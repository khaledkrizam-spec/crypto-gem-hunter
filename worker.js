
const NETWORKS = ["eth", "bsc", "base", "solana", "arbitrum"];

const NORMAL_CRON = "*/15 * * * *";

const REQUEST_INTERVAL_MS = 12_000; // 5 requests/minute
const LOCK_DURATION_MS = 15 * 60 * 1000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":
    "https://khaledkrizam-spec.github.io",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: CORS_HEADERS
  });
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function preliminaryScore(liquidity, volume, txns, ageHours) {
  const liquidityPoints =
    Math.min(40, Math.log10(liquidity + 1) * 10);

  const volumePoints =
    Math.min(30, Math.log10(volume + 1) * 6);

  const transactionPoints =
    Math.min(20, Math.log10(txns + 1) * 6);

  const agePoints = ageHours === null
    ? 0
    : Math.max(0, 10 - (ageHours / 48) * 10);

  return Math.round(
    liquidityPoints +
    volumePoints +
    transactionPoints +
    agePoints
  );
}

// حجز موعد عالمي للطلب في D1.
// كل طلب، بما فيه إعادة المحاولة، يمر من هنا.
async function reserveRequestSlot(env) {
  const now = Date.now();

  const row = await env.DB.prepare(`
    UPDATE api_rate_limit
    SET next_allowed_at =
      MAX(next_allowed_at, ?) + ?
    WHERE id = 1
    RETURNING next_allowed_at
  `).bind(now, REQUEST_INTERVAL_MS).first();

  if (!row) {
    throw new Error("Could not reserve API request slot");
  }

  const scheduledAt =
    row.next_allowed_at - REQUEST_INTERVAL_MS;

  const waitMs = Math.max(0, scheduledAt - Date.now());

  if (waitMs > 0) {
    await sleep(waitMs);
  }
}

function getRetryDelay(response, attempt) {
  const retryAfter = response.headers.get("Retry-After");

  if (retryAfter) {
    const seconds = Number(retryAfter);

    if (Number.isFinite(seconds)) {
      return Math.max(0, seconds * 1000);
    }

    const dateDelay =
      new Date(retryAfter).getTime() - Date.now();

    if (Number.isFinite(dateDelay) && dateDelay > 0) {
      return dateDelay;
    }
  }

  return 2000 * Math.pow(2, attempt);
}

async function fetchNetworkPools(network, env) {
  const url =
    `https://api.geckoterminal.com/api/v2/networks/${network}/new_pools?include=base_token&page=1`;

  for (let attempt = 0; attempt < 3; attempt++) {
    // لا يوجد طلب إلى GeckoTerminal قبل حجز موعد.
    await reserveRequestSlot(env);

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json;version=20230203"
      }
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 429 && attempt < 2) {
      const delay = getRetryDelay(response, attempt);

      // لا ننتظر زمناً غير محدود داخل Worker.
      if (delay > 120_000) {
        throw new Error(
          `${network}: 429 Retry-After too long`
        );
      }

      console.log(
        `${network}: 429, retry ${attempt + 1}, wait ${delay}ms`
      );

      await sleep(delay);
      continue;
    }

    const body = await response.text();

    throw new Error(
      `${network}: HTTP ${response.status}: ${body.slice(0, 300)}`
    );
  }

  throw new Error(`${network}: maximum retries exceeded`);
}

async function scanNetwork(network, env) {
  const result = await fetchNetworkPools(network, env);

  const pools = (result.data || []).slice(0, 5);

  // بيانات العملة الأساسية التي أعادها include=base_token.
  const includedTokens = new Map(
    (result.included || [])
      .filter((item) => item.type === "token")
      .map((item) => [item.id, item.attributes || {}])
  );

  let saved = 0;

  for (const pool of pools) {
    const a = pool.attributes || {};

    const relation =
      pool.relationships?.base_token?.data?.id || "";

    const tokenAddress = relation.includes("_")
      ? relation.split("_").slice(1).join("_")
      : relation;

    const token = includedTokens.get(relation) || {};

    const liquidity = number(a.reserve_in_usd);
    const volume = number(a.volume_usd?.h24);

    const buys = number(a.transactions?.h24?.buys);
    const sells = number(a.transactions?.h24?.sells);
    const txns = buys + sells;

    const created = a.pool_created_at
      ? new Date(a.pool_created_at)
      : null;

    const validDate =
      created && Number.isFinite(created.getTime());

    const ageHours = validDate
      ? Math.max(
          0,
          (Date.now() - created.getTime()) / 3600000
        )
      : null;

    const score = preliminaryScore(
      liquidity,
      volume,
      txns,
      ageHours
    );

    const flags = [
      "contract_security_not_checked",
      "holder_distribution_not_checked",
      "defi_status_not_verified",
      "sharia_status_not_verified",
      "israeli_connection_not_verified"
    ];

    await env.DB.prepare(`
      INSERT INTO pool_snapshots (
        network,
        pool_address,
        token_address,
        token_name,
        token_symbol,
        price_usd,
        liquidity_usd,
        volume_24h,
        fdv_usd,
        buys_24h,
        sells_24h,
        age_hours,
        preliminary_score,
        review_status,
        review_flags,
        scanned_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      network,
      a.address || pool.id || "",
      tokenAddress,
      token.name || "Unknown token",
      token.symbol || null,
      number(a.base_token_price_usd),
      liquidity,
      volume,
      number(a.fdv_usd),
      buys,
      sells,
      ageHours,
      score,
      "manual_review",
      JSON.stringify(flags),
      new Date().toISOString()
    ).run();

    saved++;
  }

  return {
    pools_received: pools.length,
    pools_saved: saved
  };
}

// قفل مشترك بين Cron والطلبات اليدوية.
async function acquireScanLock(env) {
  const now = Date.now();

  const lock = await env.DB.prepare(`
    UPDATE scan_lock
    SET locked_until = ?
    WHERE id = 1 AND locked_until < ?
    RETURNING id
  `).bind(
    now + LOCK_DURATION_MS,
    now
  ).first();

  return Boolean(lock);
}

async function releaseScanLock(env) {
  await env.DB.prepare(`
    UPDATE scan_lock
    SET locked_until = 0
    WHERE id = 1
  `).run();
}

async function runScan(env) {
  if (!env.DB) {
    throw new Error("D1 database binding DB is missing");
  }

  const locked = await acquireScanLock(env);

  if (!locked) {
    return {
      status: "busy",
      message: "Another scan is already running"
    };
  }

  try {
    const started = new Date().toISOString();

    let saved = 0;
    let scanned = 0;
    let received = 0;

    const errors = [];

    for (const network of NETWORKS) {
      try {
        const result = await scanNetwork(network, env);

        saved += result.pools_saved;
        received += result.pools_received;
        scanned++;

        console.log(
          `${network}: received ${result.pools_received}, saved ${result.pools_saved}`
        );

      } catch (error) {
        errors.push({
          network,
          message: String(error)
        });

        console.log(`${network}: ${String(error)}`);
      }
    }

    const scanStatus =
      errors.length === 0 ? "success" : "partial";

    const finished = new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO scan_runs (
        started_at,
        finished_at,
        status,
        networks_scanned,
        pools_saved,
        errors
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      started,
      finished,
      scanStatus,
      scanned,
      saved,
      JSON.stringify(errors)
    ).run();

    return {
      status: scanStatus,
      networks_scanned: scanned,
      pools_received: received,
      pools_saved: saved,
      request_limit: "5 per minute",
      errors
    };

  } finally {
    await releaseScanLock(env);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    if (url.pathname === "/health") {
      return json({
        status: "online",
        app: "Crypto Gem Hunter",
        version: "3.2",
        database: env.DB ? "connected" : "not_connected",
        request_limit: "5 per minute"
      });
    }

    if (!env.DB) {
      return json({
        error: "D1 binding DB is not connected"
      }, 503);
    }

    if (url.pathname === "/api/scan") {
      if (request.method !== "POST") {
        return json({
          error: "POST method required"
        }, 405);
      }

      try {
        const result = await runScan(env);

        return json({
          message: "Scan finished",
          ...result
        });

      } catch (error) {
        return json({
          status: "error",
          message: String(error)
        }, 500);
      }
    }

    if (url.pathname === "/api/status") {
      const latest = await env.DB.prepare(`
        SELECT * FROM scan_runs
        ORDER BY id DESC LIMIT 1
      `).first();

      return json({
        status: "online",
        latest_scan: latest || null
      });
    }

    
if (url.pathname === "/api/candidates") {
  const requested = Number(
    url.searchParams.get("limit") || 50
  );

  const limit = Math.max(
    1,
    Math.min(100, requested)
  );

  const result = await env.DB.prepare(`
    SELECT *
    FROM (
      SELECT *,
        ROW_NUMBER() OVER (
          PARTITION BY network, pool_address
          ORDER BY id DESC
        ) AS row_number
      FROM pool_snapshots
    )
    WHERE row_number = 1
    ORDER BY scanned_at DESC
    LIMIT ?
  `).bind(limit).all();

  return json({
    count: result.results.length,
    sort_order: "newest_first",
    candidates: result.results
  });
}

      });
    }

    return json({
      app: "Crypto Gem Hunter Engine",
      status: "running",
      version: "3.2",
      endpoints: [
        "/health",
        "/api/status",
        "/api/candidates",
        "/api/scan"
      ]
    });
  },

  async scheduled(controller, env) {
    const scheduledDate =
      new Date(controller.scheduledTime);

    const utcHour = scheduledDate.getUTCHours();

    // إيقاف الفحص العادي أثناء الفترة المكثفة.
    if (
      controller.cron === NORMAL_CRON &&
      utcHour >= 20 &&
      utcHour <= 22
    ) {
      return;
    }

    const result = await runScan(env);

    console.log("Crypto Gem Hunter scan:", result);
  }
};
