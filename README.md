<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Crypto Gem Hunter 1.0</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#eef2f1;--card:#fff;--ink:#17302e;--mute:#5d726f;--line:#d5dfdd;--acc:#1f4e79;--ok:#2f7d4f;--warn:#b7791f;--bad:#b3362b;--okb:#e3f2e8;--warnb:#fbf0da;--badb:#f8e2df}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 'IBM Plex Sans Arabic',system-ui,sans-serif}
.w{max-width:1180px;margin:auto;padding:20px 16px 60px}
header{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:18px}
h1{margin:0;font-size:26px}h1 small{font-size:13px;font-weight:500;color:var(--mute);margin-inline-start:8px}
h2{font-size:17px;margin:0 0 10px}
button,input,select{font:inherit}
button{background:var(--acc);color:#fff;border:0;border-radius:6px;padding:9px 18px;cursor:pointer;font-weight:700}
button.g{background:transparent;color:var(--acc);border:1px solid var(--acc)}
button:disabled{opacity:.5;cursor:wait}
button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid #7fb0dd;outline-offset:2px}
.bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.box{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px;margin-bottom:16px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:16px}
.stats div{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 14px}
.stats b{display:block;font-size:24px}.stats span{color:var(--mute);font-size:13px}
#st{color:var(--mute);margin:0 0 14px}
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:820px}
th,td{padding:9px 10px;text-align:start;border-bottom:1px solid var(--line);white-space:nowrap}
th{font-size:13px;color:var(--mute);font-weight:500}
td.n{direction:ltr;text-align:end;font-variant-numeric:tabular-nums}
tr.r{cursor:pointer}tr.r:hover{background:#f4f8f7}
.tag{display:inline-block;padding:2px 10px;border-radius:99px;font-size:13px;font-weight:700}
.ok{background:var(--okb);color:var(--ok)}.wa{background:var(--warnb);color:var(--warn)}.ba{background:var(--badb);color:var(--bad)}
.sc{display:inline-block;width:46px;height:7px;background:var(--line);border-radius:4px;margin-inline-end:8px;vertical-align:middle;overflow:hidden}
.sc i{display:block;height:100%;background:var(--acc)}
.dt td{white-space:normal;background:#f7faf9;font-size:14px}
.dt ul{margin:4px 0;padding-inline-start:20px}.dt li.p{color:var(--ok)}.dt li.m{color:var(--bad)}.dt li.i{color:var(--mute)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
label{display:block;font-size:13px;color:var(--mute)}
input,select{width:100%;padding:7px 9px;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink)}
.cb{display:flex;align-items:center;gap:8px;color:var(--ink);font-size:14px}.cb input{width:auto}
.note{font-size:13px;color:var(--mute)}
a{color:var(--acc)}
.dir{direction:ltr;display:inline-block}
@media(prefers-reduced-motion:no-preference){.sc i{transition:width .4s}}
</style>
</head>
<body>
<div class="w">
<header>
 <h1>Crypto Gem Hunter<small>الإصدار 1.0</small></h1>
 <div class="bar">
  <button id="go">افحص الآن</button>
  <button class="g" id="auto">التحديث التلقائي: متوقف</button>
  <button class="g" id="csv">تصدير CSV</button>
 </div>
</header>
<p id="st">جاهز. يبدأ الفحص عند الضغط على «افحص الآن».</p>
<div class="stats">
 <div><b id="s1">—</b><span>رموز جرى فحصها</span></div>
 <div><b id="s2">—</b><span>اجتازت الفلاتر</span></div>
 <div><b id="s3">—</b><span>مرشحة قوية</span></div>
 <div><b id="s4">—</b><span>آخر تحديث</span></div>
</div>

<div class="box">
 <h2>النتائج مرتبة بالتقييم</h2>
 <div class="tw"><table>
  <thead><tr><th>العملة</th><th>الشبكة</th><th>السعر</th><th>القيمة السوقية</th><th>السيولة</th><th>حجم 24س</th><th>التقييم</th><th>القرار</th></tr></thead>
  <tbody id="rows"><tr><td colspan="8" class="note">لا توجد نتائج بعد.</td></tr></tbody>
 </table></div>
 <p class="note">اضغط على أي صف لرؤية أسباب القرار. التقييم أداة فرز وليس توصية شراء.</p>
</div>

<div class="box">
 <h2>الإعدادات</h2>
 <div class="grid">
  <label>أقل سيولة ($)<input id="minLiq" type="number" value="25000"></label>
  <label>أقل حجم 24س ($)<input id="minVol" type="number" value="50000"></label>
  <label>أقل قيمة سوقية ($)<input id="minMc" type="number" value="300000"></label>
  <label>أعلى قيمة سوقية ($)<input id="maxMc" type="number" value="30000000"></label>
  <label>أقصى عمر (أيام)<input id="maxAge" type="number" value="30"></label>
  <label>أقل عمر (ساعات)<input id="minAge" type="number" value="6"></label>
  <label>الحد الأدنى للقرار «مرشح قوي»<input id="thr" type="number" value="70"></label>
  <label>عدد الرموز المجلوبة<select id="lim"><option>30</option><option selected>60</option><option>100</option></select></label>
 </div>
 <p></p>
 <label>رموز تُستبعد (فاصلة بينها)<input id="ex" value="APT,ZRO,SEI,AR,GALA,PYR,FLOKI,NEIRO,CETUS"></label>
 <p></p>
 <label class="cb"><input type="checkbox" id="fSec" checked> استبعاد الرمز عند فشل أي فحص أمان حرج</label>
 <label class="cb"><input type="checkbox" id="fDefi" checked> استبعاد مشاريع DeFi وأموال الاستقرار بالكلمات المفتاحية</label>
 <p><button class="g" id="save">حفظ الإعدادات</button></p>
</div>

<div class="box">
 <h2>سجل الاستبعاد</h2>
 <div class="tw"><table><thead><tr><th>العملة</th><th>الشبكة</th><th>السبب</th></tr></thead><tbody id="log"><tr><td colspan="3" class="note">يظهر هنا سبب استبعاد كل رمز.</td></tr></tbody></table></div>
</div>

<div class="box note">
 <b>كيف يتخذ النظام قراره:</b> يجمع بيانات السوق من DEX Screener، ثم يفحص أمان العقد عبر GoPlus (شبكات EVM) وRugCheck (سولانا). التقييم من 100: السيولة 15، نشاط التداول 15، نسبة السيولة للقيمة السوقية 10، توازن الشراء والبيع 10، عدد الصفقات 10، العمر 5، الزخم السعري 10، الحضور العلني 5، الأمان 20.
 أي مؤشر خطر حرج (honeypot، ضريبة بيع عالية، عقد قابل للتعديل، تداول وهمي) يعطي القرار «تجنب» بغض النظر عن التقييم.
 لا يستطيع النظام إثبات توزيع الحائزين الحقيقي ولا الارتباطات المؤسسية ولا التوافق الشرعي؛ هذه تحتاج مراجعة بشرية موثقة. الأداة لا تشتري ولا تتصل بمحفظة. كل قرار استثمار مسؤوليتك.
</div>
</div>

<script>
const $=id=>document.getElementById(id);
const GP={ethereum:1,bsc:56,base:8453,arbitrum:42161,polygon:137,avalanche:43114,optimism:10};
const CH=new Set([...Object.keys(GP),'solana']);
const DEFI=/\b(swap|dex|lend|lending|yield|farm|staking|stake|vault|bridge|liquidity|protocol|amm|perp|derivatives|usd|usdt|usdc|stable|wrapped|wbtc|weth)\b/i;
const IDS=['minLiq','minVol','minMc','maxMc','maxAge','minAge','thr','lim','ex'];
let results=[],timer=null;

// الإعدادات
try{const s=JSON.parse(localStorage.getItem('cgh')||'{}');IDS.forEach(i=>{if(s[i]!=null)$(i).value=s[i]});['fSec','fDefi'].forEach(i=>{if(s[i]!=null)$(i).checked=s[i]})}catch(e){}
$('save').onclick=()=>{try{const s={};IDS.forEach(i=>s[i]=$(i).value);['fSec','fDefi'].forEach(i=>s[i]=$(i).checked);localStorage.setItem('cgh',JSON.stringify(s));$('st').textContent='تم حفظ الإعدادات.'}catch(e){$('st').textContent='تعذر الحفظ على هذا المتصفح.'}};
const cfg=()=>({minLiq:+$('minLiq').value,minVol:+$('minVol').value,minMc:+$('minMc').value,maxMc:+$('maxMc').value,maxAge:+$('maxAge').value,minAge:+$('minAge').value,thr:+$('thr').value,lim:+$('lim').value,ex:$('ex').value.toUpperCase().split(',').map(x=>x.trim()).filter(Boolean),sec:$('fSec').checked,defi:$('fDefi').checked});

const fj=async(u,t=12000)=>{const c=new AbortController();const k=setTimeout(()=>c.abort(),t);try{const r=await fetch(u,{signal:c.signal});if(!r.ok)throw new Error(r.status);return await r.json()}finally{clearTimeout(k)}};
const money=n=>n==null?'—':n>=1e6?'$'+(n/1e6).toFixed(2)+'M':n>=1e3?'$'+(n/1e3).toFixed(1)+'K':'$'+n.toFixed(0);
const price=p=>{p=+p;return !p?'—':p<0.0001?'$'+p.toExponential(2):p<1?'$'+p.toFixed(6):'$'+p.toFixed(3)};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// فحص الأمان
async function secEvm(chain,addrs){
 const out={};
 for(let i=0;i<addrs.length;i+=20){
  const b=addrs.slice(i,i+20);
  try{const j=await fj(`https://api.gopluslabs.io/api/v1/token_security/${GP[chain]}?contract_addresses=${b.join(',')}`);
   for(const a of b){const r=j.result&&j.result[a.toLowerCase()];if(r)out[a.toLowerCase()]=evmRead(r)}}catch(e){}
 }return out;
}
function evmRead(r){
 const bad=[],good=[],info=[],st=+r.sell_tax||0,bt=+r.buy_tax||0;
 if(r.is_honeypot==='1')bad.push('honeypot: لا يمكن البيع');
 if(r.cannot_sell_all==='1')bad.push('لا يمكن بيع كامل الكمية');
 if(st>0.1)bad.push(`ضريبة بيع ${(st*100).toFixed(0)}%`);else if(st>0.05)info.push(`ضريبة بيع ${(st*100).toFixed(0)}%`);
 if(bt>0.1)bad.push(`ضريبة شراء ${(bt*100).toFixed(0)}%`);
 if(r.is_mintable==='1')bad.push('العقد يسمح بطباعة عملات جديدة');
 if(r.hidden_owner==='1'||r.can_take_back_ownership==='1')bad.push('مالك مخفي أو قابل للاسترجاع');
 if(r.transfer_pausable==='1')bad.push('يمكن إيقاف التحويل');
 if(r.is_blacklisted==='1')info.push('يحتوي قائمة حظر');
 if(r.is_open_source==='0')bad.push('العقد غير مفتوح المصدر');else if(r.is_open_source==='1')good.push('العقد مفتوح المصدر');
 const h=+r.holder_count;if(h)(h<100?info:good).push(`عدد الحائزين ${h}`);
 const lp=(r.lp_holders||[]).filter(x=>x.is_locked==='1').reduce((s,x)=>s+(+x.percent||0),0);
 if(lp>=0.5)good.push(`سيولة مقفلة ${(lp*100).toFixed(0)}%`);else info.push('أغلب السيولة غير مقفلة');
 return{bad,good,info,ok:true};
}
async function secSol(a){
 try{const j=await fj(`https://api.rugcheck.xyz/v1/tokens/${a}/report/summary`);
  const bad=[],good=[],info=[];
  (j.risks||[]).forEach(x=>{(x.level==='danger'?bad:info).push(x.name)});
  if(!bad.length)good.push('لا مخاطر حرجة في RugCheck');
  if(j.lpLockedPct>=50)good.push(`سيولة مقفلة ${j.lpLockedPct.toFixed(0)}%`);
  return{bad,good,info,ok:true};
 }catch(e){return null}
}

// التقييم
function score(p,sec,c){
 const liq=p.liquidity?.usd||0,vol=p.volume?.h24||0,mc=p.marketCap||p.fdv||0,tx=p.txns?.h24||{buys:0,sells:0},n=tx.buys+tx.sells;
 const age=(Date.now()-p.pairCreatedAt)/864e5,ch=p.priceChange?.h24??0,vl=vol/liq,lm=liq/mc,br=n?tx.buys/n:0.5;
 const pro=[],con=[],hard=[];let s=0;
 const a=Math.min(15,15*Math.log10(liq/c.minLiq+1)/Math.log10(5));s+=a;
 (liq>=100000?pro:con).push(`سيولة ${money(liq)}`);
 if(vl>=0.5&&vl<=10){s+=15;pro.push(`حجم/سيولة ${vl.toFixed(1)}x صحي`)}
 else if(vl<0.5){s+=vl*20;con.push(`نشاط ضعيف (${vl.toFixed(2)}x)`)}
 else if(vl<=40){s+=8;con.push(`نشاط مرتفع جداً (${vl.toFixed(0)}x)`)}
 else{hard.push(`تداول مشبوه: حجم ${vl.toFixed(0)}x السيولة`)}
 if(lm>=0.08){s+=10;pro.push(`سيولة ${(lm*100).toFixed(0)}% من القيمة السوقية`)}
 else if(lm>=0.03){s+=5;con.push(`سيولة ${(lm*100).toFixed(1)}% من القيمة السوقية`)}
 else con.push(`سيولة هزيلة مقارنة بالقيمة (${(lm*100).toFixed(1)}%)`);
 if(br>=0.45&&br<=0.65){s+=10;pro.push(`توازن شراء/بيع ${(br*100).toFixed(0)}%`)}
 else if(br>0.65&&br<=0.8){s+=5;con.push('ضغط شراء غير طبيعي، قد يكون تحفيزاً مصطنعاً')}
 else if(br<0.4)con.push(`ضغط بيع ${((1-br)*100).toFixed(0)}%`);
 if(n>=1000){s+=10;pro.push(`${n} صفقة`)}else if(n>=300){s+=6;pro.push(`${n} صفقة`)}else con.push(`صفقات قليلة (${n})`);
 if(age>=1&&age<=14){s+=5;pro.push(`عمر ${age.toFixed(1)} يوم`)}else if(age<1)con.push('عمر أقل من يوم');
 if(ch>=-20&&ch<=150){s+=10;pro.push(`حركة 24س ${ch.toFixed(0)}%`)}
 else if(ch>400){con.push(`قفزة ${ch.toFixed(0)}% خلال 24س: خطر ذروة`);s+=2}
 else if(ch<-50){con.push(`هبوط ${ch.toFixed(0)}%`)}else s+=5;
 const w=p.info?.websites?.length,t=(p.info?.socials||[]).some(x=>x.type==='twitter');
 if(w&&t){s+=5;pro.push('موقع وحساب X معلنان')}else if(w||t){s+=2;con.push('حضور علني جزئي')}else con.push('لا موقع ولا حساب X');
 let verified=false;
 if(sec){verified=true;sec.bad.forEach(x=>hard.push(x));sec.good.forEach(x=>pro.push(x));sec.info.forEach(x=>con.push(x));if(!sec.bad.length)s+=20}
 else{s+=6;con.push('لم يتم التحقق من أمان العقد')}
 s=Math.round(Math.min(100,s));
 let d,cls;
 if(hard.length||s<45){d='تجنب';cls='ba'}
 else if(s>=c.thr&&verified){d='مرشح قوي';cls='ok'}
 else{d='مراقبة';cls='wa'}
 return{s,d,cls,pro,con,hard,verified,age};
}

// الفحص
async function run(){
 const c=cfg(),log=[],cand=[];
 $('go').disabled=true;$('st').textContent='جلب أحدث الرموز…';
 try{
  const [pr,bo]=await Promise.all([fj('https://api.dexscreener.com/token-profiles/latest/v1'),fj('https://api.dexscreener.com/token-boosts/latest/v1').catch(()=>[])]);
  const seen=new Set(),list=[];
  [...pr,...bo].forEach(x=>{const k=x.chainId+x.tokenAddress;if(CH.has(x.chainId)&&!seen.has(k)){seen.add(k);list.push(x)}});
  const sel=list.slice(0,c.lim),by={};
  sel.forEach(x=>(by[x.chainId]=by[x.chainId]||[]).push(x.tokenAddress));
  $('st').textContent='جلب أزواج التداول…';
  const pairs=[];
  for(const ch in by)for(let i=0;i<by[ch].length;i+=30){
   try{const j=await fj(`https://api.dexscreener.com/tokens/v1/${ch}/${by[ch].slice(i,i+30).join(',')}`);pairs.push(...(Array.isArray(j)?j:[]))}catch(e){}
  }
  const best={};
  pairs.forEach(p=>{const k=p.chainId+p.baseToken.address.toLowerCase();if(!best[k]||(p.liquidity?.usd||0)>(best[k].liquidity?.usd||0))best[k]=p});
  sel.forEach(x=>{if(!best[x.chainId+x.tokenAddress.toLowerCase()])log.push([x.tokenAddress.slice(0,8)+'…',x.chainId,'لا يوجد زوج تداول'])});
  Object.values(best).forEach(p=>{
   const sy=(p.baseToken.symbol||'').toUpperCase(),liq=p.liquidity?.usd||0,vol=p.volume?.h24||0,mc=p.marketCap||p.fdv||0,age=(Date.now()-p.pairCreatedAt)/864e5;
   const no=m=>log.push([sy||p.baseToken.address.slice(0,8),p.chainId,m]);
   if(c.ex.includes(sy))return no('ضمن قائمة الاستبعاد');
   if(c.defi&&DEFI.test(p.baseToken.name+' '+sy))return no('اسم يدل على DeFi أو عملة مستقرة');
   if(liq<c.minLiq)return no(`سيولة ${money(liq)} أقل من الحد`);
   if(vol<c.minVol)return no(`حجم ${money(vol)} أقل من الحد`);
   if(!mc)return no('القيمة السوقية غير متاحة');
   if(mc<c.minMc||mc>c.maxMc)return no(`قيمة سوقية ${money(mc)} خارج النطاق`);
   if(age>c.maxAge)return no(`عمر ${age.toFixed(0)} يوم أكبر من الحد`);
   if(age*24<c.minAge)return no('الزوج أحدث من الحد الأدنى للعمر');
   cand.push(p);
  });
  $('st').textContent=`فحص أمان ${cand.length} رمز…`;
  const sec={},evm={};
  cand.forEach(p=>{if(GP[p.chainId])(evm[p.chainId]=evm[p.chainId]||[]).push(p.baseToken.address)});
  for(const ch in evm)Object.assign(sec,await secEvm(ch,evm[ch]));
  await Promise.all(cand.filter(p=>p.chainId==='solana').map(async p=>{const r=await secSol(p.baseToken.address);if(r)sec[p.baseToken.address.toLowerCase()]=r}));
  results=cand.map(p=>({p,r:score(p,sec[p.baseToken.address.toLowerCase()],c)}));
  results.forEach(({p,r})=>{if(c.sec&&r.hard.length)log.push([p.baseToken.symbol,p.chainId,'مخاطر حرجة: '+r.hard.join('، ')])});
  results.sort((a,b)=>b.r.s-a.r.s);
  render(results,log,sel.length);
  $('st').textContent='اكتمل الفحص. المصادر: DEX Screener وGoPlus وRugCheck.';
 }catch(e){$('st').textContent='تعذر الجلب: '+e.message+'. تحقق من الاتصال وأعد المحاولة.'}
 $('go').disabled=false;
}
function render(res,log,tot){
 const shown=res.filter(x=>!(cfg().sec&&x.r.hard.length));
 $('s1').textContent=tot;$('s2').textContent=res.length;$('s3').textContent=res.filter(x=>x.r.d==='مرشح قوي').length;
 $('s4').textContent=new Date().toLocaleTimeString('ar-AE',{hour:'2-digit',minute:'2-digit'});
 $('rows').innerHTML=shown.length?shown.map(({p,r},i)=>`<tr class="r" data-i="${i}" tabindex="0"><td><b>${esc(p.baseToken.symbol)}</b> <span class="note">${esc(p.baseToken.name)}</span></td><td>${esc(p.chainId)}</td><td class="n">${price(p.priceUsd)}</td><td class="n">${money(p.marketCap||p.fdv)}</td><td class="n">${money(p.liquidity?.usd)}</td><td class="n">${money(p.volume?.h24)}</td><td><span class="sc"><i style="width:${r.s}%"></i></span>${r.s}</td><td><span class="tag ${r.cls}">${r.d}</span>${r.verified?'':' <span class="note">(أمان غير مؤكد)</span>'}</td></tr>`).join(''):'<tr><td colspan="8" class="note">لم يجتز أي رمز الفلاتر. خفّف الحدود في الإعدادات.</td></tr>';
 document.querySelectorAll('tr.r').forEach(tr=>{const f=()=>{const nx=tr.nextElementSibling;if(nx&&nx.classList.contains('dt')){nx.remove();return}const {p,r}=shown[tr.dataset.i];const li=(a,c)=>a.map(x=>`<li class="${c}">${esc(x)}</li>`).join('');tr.insertAdjacentHTML('afterend',`<tr class="dt"><td colspan="8"><ul>${li(r.hard,'m')}${li(r.pro,'p')}${li(r.con,'i')}</ul><a href="${esc(p.url)}" target="_blank" rel="noopener">فتح الرسم على DEX Screener</a> · <span class="dir">${esc(p.baseToken.address)}</span></td></tr>`)};tr.onclick=f;tr.onkeydown=e=>{if(e.key==='Enter')f()}});
 $('log').innerHTML=log.length?log.map(l=>`<tr><td>${esc(l[0])}</td><td>${esc(l[1])}</td><td>${esc(l[2])}</td></tr>`).join(''):'<tr><td colspan="3" class="note">لا استبعادات.</td></tr>';
}
$('go').onclick=run;
$('auto').onclick=()=>{if(timer){clearInterval(timer);timer=null;$('auto').textContent='التحديث التلقائي: متوقف'}else{timer=setInterval(run,9e5);$('auto').textContent='التحديث التلقائي: كل 15 دقيقة';run()}};
$('csv').onclick=()=>{if(!results.length)return;const h='symbol,chain,price,mcap,liquidity,vol24h,score,decision,address\n';const b=results.map(({p,r})=>[p.baseToken.symbol,p.chainId,p.priceUsd,p.marketCap||p.fdv,p.liquidity?.usd,p.volume?.h24,r.s,r.d,p.baseToken.address].map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+h+b],{type:'text/csv'}));a.download='gem-hunter.csv';a.click()};
</script>
</body>
</html>
