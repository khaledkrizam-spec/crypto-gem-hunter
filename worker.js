const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://khaledkrizam-spec.github.io",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: CORS_HEADERS
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
      return json({ error: "GET method required" }, 405);
    }

    if (url.pathname === "/health" || url.pathname === "/api/status") {
      return json({
        status: "online",
        app: "Crypto Gem Hunter",
        mode: "on_demand",
        persistence: false,
        scheduled_scans: false
      });
    }

    return json({
      app: "Crypto Gem Hunter",
      status: "running",
      mode: "on_demand",
      endpoints: ["/health", "/api/status"]
    });
  }
};
