const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// Files are served from public/ — or, if you uploaded everything flat (no folders, e.g. from a phone), from the project root.
app.use((req,res,next)=>{
  if (req.method!=='GET') return next();
  let rel; try{ rel = decodeURIComponent(req.path); }catch(e){ return next(); }
  if (rel.includes('..')) return next();
  const _p=require('path'), _f=require('fs');
  const base=_p.basename(rel);
  if (!['.html','.png','.jpg','.jpeg','.gif','.webp','.svg','.json'].includes(_p.extname(base).toLowerCase())) return next();
  if (['config.json','package.json','package-lock.json'].includes(base)) return next();
  for (const f of [_p.join(__dirname,'public',rel), _p.join(__dirname,base)]){
    try{ if (_f.statSync(f).isFile()) return res.sendFile(f); }catch(e){}
  }
  next();
});
app.use(express.static('public'));
app.get('/', (req,res)=>res.redirect('/player.html'+(req.query.code?'?code='+encodeURIComponent(req.query.code):'')));
// Short Host links: /host or /admin open the Host page directly
app.get(['/host','/admin'], (req,res)=>res.redirect('/host.html'));
app.use(express.json({limit:'2mb'}));

const HOST_ID = process.env.HOST_ID || 'admin';
const HOST_PW = process.env.HOST_PW || 'gyan2026';

const DEFAULT_QA = [
 ['જીવને માયામાંથી તારીને ભગવાનના દિવ્ય સ્વરૂપમાં જોડવા માટે સંતો દ્વારા અખંડ કથા-વાર્તા અને વિચરણ કરીને કરવામાં આવતા ભારે આધ્યાત્મિક પરિશ્રમને શું કહેવાય?','દાખડો'],
 ['અંતરમાં અખંડ ટાઢક (શાંતિ) રાખવાના અને મન અશાંત ન થાય તેના સ્વામીએ કેટલા ઉપાયો બતાવ્યા છે?','બે'],
 ['સ્વામીના મતે મોક્ષના દાતા કોણ છે?','ભગવાન અને એકાંતિક સાધુ'],
 ['ભગવાન અને સાધુ જ મોક્ષના દાતા હોવાથી આપણે શું ધ્યાન રાખવું જોઈએ?','અવગુણ ન લેવો'],
 ['સ્વામીના મતે ભવિષ્યમાં સત્સંગ અને મંદિરોનો વિકાસ કેવો થશે?','કરોડ ગણો'],
 ['સ્વામીના મતે સારો સત્સંગી કોણ છે?','ભગવાનના ભક્તમાં આત્મબુદ્ધિ'],
 ['સ્વામી ક્યાં સુધી સત્સંગ કરાવવાની વાત કરે છે?','રાત્રિપ્રલય'],
 ['મનુષ્યના જીવનમાં કયું દુઃખ થોડું અને કયું દુઃખ વધારે (ઝાઝું) હોય છે?','દેહનું અને મનનું'],
 ['સત્સંગમાંથી ક્યારેય ન પડાય (વિમુખ ન થવાય) તે માટે સ્વામીએ કેટલા સારા સાધુ અને કેટલા સારા હરીભક્તો સાથે જીવ બાંધવા કહ્યું છે','બે અને ત્રણ'],
 ['ભગવાન, સંતો, હરિભક્તો કે સત્સંગની વ્યવસ્થાઓ વિશે નકારાત્મક વાતો કરવી કે દોષ જોવાને સત્સંગની ભાષામાં શું કહેવાય?','અભાવ અવગુણ'],
 ['સ્વામીના વચન અનુસાર આપણે આપણા પોતાના સ્વરૂપને કેવું માનવું જોઈએ?','અક્ષર'],
 ['જો પોતાના સ્વરૂપને અક્ષર ન માની શકાય, તો પણ કઈ બાબતની પોતાને ના માનવું?','સ્થૂળ દેહ'],
 ['વિષયો દેહના ભાવ તરીકે એક પડખે રહ્યા હોય, તો પણ જીવે પોતાના આત્માને શું ન માનવો?','નરકનો કીડો'],
 ['સત્સંગમાં ભક્તોના આધ્યાત્મિક વિકાસને સમજાવવા સ્વામીએ કોનું ઉદાહરણ આપ્યું છે?','વામનજીની લાકડી'],
 ['સ્વામીના મતે ભક્ત કથા, કીર્તન કે વાતો કરે પણ કઈ મૂળભૂત જાગૃતિ વિના તે બધું અધૂરું છે?','આ દેહ હું નહિ'],
 ['ભગવાન અને સાધુનો સાચો મહિમા સમજવાનું કારણ (સાધન) શું છે?','ભગવદીનો પ્રસંગ'],
 ['દુષ્કાળ, રોગચાળો, આર્થિક સંકટ, કુદરતી આફતો કે જીવનમાં આવતી કોઈપણ વિપરીત અને પ્રતિકૂળ પરિસ્થિતિને સામાન્ય રીતે શું કહેવાય?','દેશકાળની અવરાઈ'],
 ['દોષ પીડે તેથી સત્સંગમાં શું થઈને રહેવાય ?','દિન આધીન'],
 ['આધ્યાત્મિક માર્ગમાં સૌથી બળવાન તત્વ કયું દર્શાવવામાં આવ્યું છે?','શબ્દ'],
 ['સ્વામીના મતે જીવ સૌથી શ્રેષ્ઠ અને ઉત્તમ રીતે શેનાથી શુદ્ધ થાય છે?','વાતું'],
 ['આધ્યાત્મિક માર્ગમાં જીવને બળવાન બનાવવાનું સૌથી મોટું સાધન કયું છે?','મહિમા'],
 ['દેહના દુશ્મન કોણ કદી હોય નહિ? જેમ કરશે તેમ સુખ જ થાશે.','હરિ'],
 ['દિવ્યભાવ ને મનુષ્યભાવ એ બેને એક સમજે તે શેને તરી રહ્યો છે?','માયા'],
 ['આઠે પહોર ભજન કરવું જે, "હું દેહ નથી ને દેહમાં રહ્યો એવો જે હું કોણ છું?"','આત્મા'],
 ['જેમ નાતનો, નામનો અને ગામનો નિશ્ચય થયો છે, તેમ જ એવું શુ કરવું જોઈએ?, "હું આત્મા છું, બ્રહ્મ છું, સુખરૂપ છું"','અભ્યાસ'],
 ['ભગવાન પુરુષોત્તમ નારાયણ સર્વ અવતારના કોણ છે?','અવતારી'],
 ['ભગવાન જ્યારે પૃથ્વી ઉપર આવે ત્યારે રાજસી, તામસી, સાત્ત્વિક ને શેનો ઉદ્ધાર કરી નાખે છે?','અધમ'],
 ['નિત્યે લાખ રૂપિયા લાવે ને સત્સંગનું શું બોલતો હોય તો તે મને ન ગમે?','ઘસાતું'],
 ['અમારો મત એવો જે, ક્રિયા કરવામાં પણ ક્રિયારૂપ ન થાવું ને ક્રિયા મૂકીને પણ તેના શું ન કરવા?','મનસૂબા'],
 ['ભગવાનના કર્તાપણાની સમજણ ન હોય તો મુશ્કેલ દેશકાળમાં શું નુકસાન થાય છે?','સત્સંગ ચૂંથાઈ જાય'],
 ['સ્વામીના વચન મુજબ, કોઈ વ્યક્તિ રોજ કેટલું કમાઈને લાવે તો પણ જો સત્સંગનું ઘસાતું બોલે તો સ્વામીને ગમતું નથી?','લાખ રૂપિયા'],
 ['મહારાજના વચનામૃતના આધારે, જો ભક્તમાં કામ-લોભ ન હોય પણ ભગવાનના ભક્તમાં જીવન બંધાયો હોય તો તેનું શું પરિણામ આવે છે?','અસુર'],
 ['‘સ્વામિનારાયણ’ મહામંત્રના જાપથી કયા બાહ્ય સંકટનું ઝેર પણ ચડતું નથી?','કાળો નાગ'],
 ['‘સ્વામિનારાયણ’ મંત્ર કયા મોટા બંધનોમાંથી મુક્તિ અપાવે છે?','કાળ, કર્મ, માયા'],
 ['સ્વામીના મતે આજની તારીખે કયો મંત્ર સૌથી વધુ બળિયો (શક્તિશાળી) છે?','સ્વામિનારાયણ'],
 ['સ્વામીના મતે દેહ આપણી પાસે રોજ શું કરાવે છે?','નરક']
];

const LINES = (() => {
  const L = [];
  for (let r = 0; r < 5; r++) L.push([0,1,2,3,4].map(c => r*5+c));
  for (let c = 0; c < 5; c++) L.push([0,1,2,3,4].map(r => r*5+c));
  L.push([0,6,12,18,24]); L.push([4,8,12,16,20]);
  return L;
})();
const WINNER_ORDER = ['line1','line2','line3','line4','line5','full','top3','top2','top1'];
const WINNER_LABELS = {line1:'1 Line',line2:'2 Line',line3:'3 Line',line4:'4 Line',line5:'5 Line',full:'Full House',top3:'3rd Score',top2:'2nd Score',top1:'Overall Champion'};

function defaultQuestions(){ return DEFAULT_QA.map(([q,a]) => ({q,a})); }
function parseQA(text){
  const lines = (text||'').split('\n').map(l=>l.trim()).filter(Boolean);
  const out = [], bad = [];
  for (let l of lines){
    // optional picture: put [img:https://...] anywhere in the line
    let img = '';
    l = l.replace(/\[img:\s*(\S+?)\s*\]/i, (m,u)=>{ img=u; return ''; }).trim();
    // just a file name (e.g. q1.jpg) => picture from the public/qimg/ folder
    if (img && !/^(https?:|data:|\/)/i.test(img)) img = '/qimg/' + encodeURIComponent(img.replace(/^qimg\//i,''));
    let parts = null;
    if (l.includes('::')) parts = [l.split('::')[0], l.split('::').slice(1).join('::')];
    else if (l.includes(' - ')) parts = [l.split(' - ')[0], l.split(' - ').slice(1).join(' - ')];
    else if ((l.match(/:/g)||[]).length===1) parts = l.split(':');
    if (parts && parts[0].trim() && parts[1] && parts[1].trim()) out.push(img?{q:parts[0].trim(), a:parts[1].trim(), img}:{q:parts[0].trim(), a:parts[1].trim()});
    else bad.push(l);
  }
  return { questions: out.length?out:defaultQuestions(), bad, usedDefault: out.length===0 };
}
function shuffle(a){ const arr=a.slice(); for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }
function makeCard(questions){
  let pool = shuffle(questions.map(q=>q.a));
  while (pool.length < 25) pool = pool.concat(shuffle(questions.map(q=>q.a)));
  return pool.slice(0,25);
}
function randCode(){ const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s='GYAN'; for(let i=0;i<4;i++) s+=c[Math.floor(Math.random()*c.length)]; return s; }

const rooms = {}; // code -> room object

// ---------- Power Cards, Fast Bonus, Bonus Streak ----------
const STREAK_LEN = 3, STREAK_BONUS = 10, FAST_BONUS = 1;
const CARD_KEYS = ['shield','fifty','change','streak'];
function markCell(p, qi){ const k = Object.keys(p.marks).find(k=>p.marks[k]===qi); return k===undefined ? undefined : +k; }
function answerOnCard(room, p, qi){ const q = room.questions[qi]; return !!(q && q.a!==undefined && p.card.includes(q.a)); }
// Bonus Streak: from the question where it was switched on, the next 3 questions whose answer is on THIS player's card
function streakSlots(room, p){
  if (!p.cards || p.cards.streak==null) return [];
  const pos = room.usedIdx.indexOf(p.cards.streak); if (pos<0) return [];
  const out = [];
  for (let i=pos; i<room.usedIdx.length && out.length<STREAK_LEN; i++){ const qi=room.usedIdx[i]; if (answerOnCard(room,p,qi)) out.push(qi); }
  return out;
}
function streakActive(room, p){
  if (!p.cards || p.cards.streak==null) return false;
  const sl = streakSlots(room,p);
  if (sl.length<STREAK_LEN) return true;
  return room.status==='question' && room.curIdx===sl[STREAK_LEN-1];   // the 3rd slot is still being played
}
// who answered each question correctly FIRST (time of the player's final tap, judged by the server clock)
function fastMap(r){
  const fm = {};
  (r.usedIdx||[]).forEach(qi=>{
    const q = r.questions[qi]; if(!q || q.a===undefined) return; let best=null;
    for (const [n,p] of Object.entries(r.players)){
      const ci = markCell(p,qi); if (ci===undefined || q.a!==p.card[ci]) continue;
      const ts = (p.markTs||{})[qi]; if (ts==null) continue;
      if (!best || ts<best.ts || (ts===best.ts && p.joinedAt<best.j)) best={n,ts,j:p.joinedAt};
    }
    if (best) fm[qi]=best.n;
  });
  return fm;
}


function playerResults(room, pname, fm){
  const p = room.players[pname];
  const cellState = Array(25).fill('none');
  Object.entries(p.marks).forEach(([ci,qi]) => {
    ci = +ci;
    cellState[ci] = (room.questions[qi] && room.questions[qi].a === p.card[ci]) ? 'green' : 'red';
  });
  const usedAnswers = room.usedIdx.map(i => room.questions[i].a);
  for (let ci=0; ci<25; ci++) if (cellState[ci]==='none' && usedAnswers.includes(p.card[ci])) cellState[ci]='yellow';
  const correctRows = LINES.filter(line => line.every(ci=>cellState[ci]==='green')).length;
  const correctCount = cellState.filter(s=>s==='green').length;
  const wrongCount = cellState.filter(s=>s==='red').length;
  const fullHouse = cellState.every(s=>s==='green');
  const out = { cellState, correctRows, correctCount, wrongCount, fullHouse };
  if (fm){
    const cards = p.cards||{};
    // Shield: a wrong answer on the Shield question costs 0 instead of -1
    const shieldSaved = (cards.shield!=null && markCell(p,cards.shield)!==undefined && cellState[markCell(p,cards.shield)]==='red') ? 1 : 0;
    const fastQs = Object.keys(fm).filter(qi=>fm[qi]===pname).map(Number);
    const slots = streakSlots(room,p);
    const slotRes = slots.map(qi=>{ const ci=markCell(p,qi); return ci===undefined ? 'miss' : (cellState[ci]==='green' ? 'ok' : 'bad'); });
    const streakOk = slots.length===STREAK_LEN && slotRes.every(x=>x==='ok');
    Object.assign(out, { shieldSaved, fastQs, fastCount:fastQs.length, streakSlots:slots, streakRes:slotRes, streakOk, streakBonus: streakOk?STREAK_BONUS:0,
      netScore: correctCount - (wrongCount-shieldSaved) + fastQs.length*FAST_BONUS + (streakOk?STREAK_BONUS:0) });
  } else out.netScore = correctCount - wrongCount;
  return out;
}
function computeWinners(room){
  const winners = {}; const FM = fastMap(room);
  for (const cat of ['line1','line2','line3','line4','line5','full']){
    let best=null, tied=[];
    for (const [name,p] of Object.entries(room.players)){
      if (!p.claims || !p.claims[cat]) continue;
      const valid = p.claims[cat].valid === true; // judged when the claim was made
      if (valid){
        const ts=p.claims[cat].ts;
        if(!best || ts<best.ts){ best={name,ts}; tied=[name]; }
        else if(ts===best.ts){ tied.push(name); }
      }
    }
    winners[cat] = best?best.name:null;
    winners[cat+'_ts'] = best?best.ts:null;
    winners[cat+'_ms'] = best?Math.max(0,best.ts-(room.startedAt||room.createdAt)):null; // time taken from game start
    winners[cat+'_tie'] = tied.length>1 ? tied : null; // more than one player claimed validly at the exact same moment
  }
  // Top 3 by Final Score (ties: more correct answers, then fewer wrong, then who joined first)
  const ranked = Object.entries(room.players).map(([name,p])=>({name,p,res:playerResults(room,name,FM)}))
    .sort((a,b)=> b.res.netScore-a.res.netScore || b.res.correctCount-a.res.correctCount || a.res.wrongCount-b.res.wrongCount || a.p.joinedAt-b.p.joinedAt);
  [['top1',0],['top2',1],['top3',2]].forEach(([k,i])=>{ const x=ranked[i]; winners[k]=x?x.name:null; winners[k+'_score']=x?x.res.netScore:null; winners[k+'_correct']=x?x.res.correctCount:null; winners[k+'_wrong']=x?x.res.wrongCount:null; });
  // Zone winner: zone with the highest AVERAGE net score (ties -> higher total)
  const zs={};
  for (const [name,p] of Object.entries(room.players)){
    const zn=(p.zone||'').trim(); if(!zn) continue;
    const k=zn.toLowerCase(); const res=playerResults(room,name,FM);
    if(!zs[k]) zs[k]={zone:zn,count:0,total:0};
    zs[k].count++; zs[k].total+=res.netScore;
  }
  let bz=null;
  for (const z of Object.values(zs)){ z.avg=z.total/z.count; if(!bz || z.avg>bz.avg || (z.avg===bz.avg && z.total>bz.total)) bz=z; }
  winners.zone = bz && bz.avg>0 ? bz.zone : null;
  winners.zone_avg = bz && bz.avg>0 ? Math.round(bz.avg*100)/100 : null;
  winners.zone_total = bz && bz.avg>0 ? bz.total : null;
  winners.zone_count = bz && bz.avg>0 ? bz.count : null;
  return winners;
}
function publicRoom(room){
  // Until results are revealed, never send correct answers or claim validity to browsers.
  if (room.status==='revealed') return room;
  const players = {};
  for (const [n,p] of Object.entries(room.players)){
    const claims = {};
    for (const [k,c] of Object.entries(p.claims||{})) claims[k] = {ts:(c.shownTs||c.ts), marks:c.marks};
    players[n] = {...p, claims, _f: undefined, stk: streakSlots(room,p)};
  }
  return {...room, questions: room.questions.map(q=>({q:q.q, img:q.img})), players};
}
// Host-only backup: the host's browser keeps the FULL room (with answers) so that if the server
// sleeps/restarts (Render free tier), the host can restore the game instantly.
const bkTimers = {};
function scheduleBackup(code){
  if (bkTimers[code]) return;
  bkTimers[code] = setTimeout(()=>{ delete bkTimers[code]; if (rooms[code]) io.to(code+'#h').emit('backup', rooms[code]); }, 1500);
}
function broadcast(code){
  if (rooms[code]){ io.to(code).emit('state', publicRoom(rooms[code])); scheduleBackup(code); }
}

setInterval(() => {
  for (const code of Object.keys(rooms)){
    const r = rooms[code];
    if (r.status==='question' && !r.paused && r.timerEnd && Date.now()>=r.timerEnd){
      r.status='locked';
      broadcast(code);
    }
  }
}, 1000);

io.on('connection', (socket) => {
  socket.on('subscribe', ({code, host}, cb) => {
    if (rooms[code]){
      socket.join(code);
      if (host){ socket.join(code+'#h'); scheduleBackup(code); }
      cb && cb({ok:true, room: publicRoom(rooms[code])});
    }
    else cb && cb({ok:false, error:'Room code મળ્યો નહિ.'});
  });

  // Players call this every few seconds: re-joins the room after a server restart/restore.
  socket.on('resync', ({code}, cb) => {
    const r = rooms[code];
    if (!r){ cb && cb({ok:false}); return; }
    if (socket.rooms.has(code)) { cb && cb({ok:true}); return; }
    socket.join(code); cb && cb({ok:true, room: publicRoom(r)});
  });

  // Host restores a game from the backup kept in the host's browser (after server sleep/restart).
  socket.on('host:restore', ({room}, cb) => {
    try{
      if (!room || typeof room.code!=='string' || !room.players || !Array.isArray(room.questions)){ cb&&cb({ok:false,error:'Backup ખરાબ છે.'}); return; }
      const code = room.code;
      if (!rooms[code]){
        const r = room;
        // a spin that never completed is cancelled; give the question back to the wheel
        if (r.status==='spinning' || r.status==='revealing'){
          r.usedIdx = (r.usedIdx||[]).filter(i=>i!==r.curIdx); r.curIdx=null; r.status='active'; r.timerEnd=null;
        }
        if (r.status==='question' && !r.paused && (!r.timerEnd || r.timerEnd<Date.now())) r.status='locked';
        r.clientMap = r.clientMap || {};
        rooms[code] = r;
      }
      socket.join(code); socket.join(code+'#h');
      cb && cb({ok:true, code});
      broadcast(code);
    }catch(e){ cb && cb({ok:false, error:String(e.message||e)}); }
  });

  // ---- Pause / Resume the question timer ----
  socket.on('host:pause', ({code}) => {
    const r = rooms[code]; if(!r || r.status!=='question' || r.paused) return;
    r.paused = true; r.pausedMs = Math.max(0, (r.timerEnd||0)-Date.now()); r.timerEnd = null;
    broadcast(code);
  });
  socket.on('host:resume', ({code}) => {
    const r = rooms[code]; if(!r || !r.paused) return;
    r.paused = false; r.timerEnd = Date.now() + (r.pausedMs||0); r.pausedMs = null;
    broadcast(code);
  });

  // ---- Undo the last spin (only if nobody has claimed since that spin) ----
  socket.on('host:undoSpin', ({code}, cb) => {
    const r = rooms[code]; if(!r){ cb&&cb({ok:false}); return; }
    if (r.curIdx==null || !['question','locked','revealing'].includes(r.status) || !r.usedIdx.includes(r.curIdx)){ cb&&cb({ok:false,error:'Undo કરવા જેવું કોઈ Question નથી.'}); return; }
    for (const p of Object.values(r.players)){
      for (const c of Object.values(p.claims||{})){
        if (c.shownTs>=r.lastSpinAt || c.ts>=r.lastSpinAt){ cb&&cb({ok:false,error:'આ Question પછી કોઈ Player એ Claim કરી દીધી છે, એટલે Undo થઈ શકશે નહિ.'}); return; }
      }
    }
    const idx = r.curIdx;
    r.usedIdx = r.usedIdx.filter(i=>i!==idx);
    for (const p of Object.values(r.players)){
      for (const ci of Object.keys(p.marks)) if (p.marks[ci]===idx) delete p.marks[ci];
      if (p.markTs) delete p.markTs[idx];
      if (p.cards) for (const k of CARD_KEYS) if (p.cards[k]===idx){ delete p.cards[k]; if(k==='change') p.changed=false; }
      p._f = null;
    }
    r.status='active'; r.curIdx=null; r.timerEnd=null; r.paused=false; r.pausedMs=null;
    cb && cb({ok:true});
    broadcast(code);
  });

  socket.on('host:login', ({id,pw}, cb) => {
    cb && cb({ok: id===HOST_ID && pw===HOST_PW});
  });

  socket.on('host:create', ({hostName, maxPlayers, qaText}, cb) => {
    const code = randCode();
    const parsed = parseQA(qaText);
    rooms[code] = {
      code, hostName, maxPlayers: maxPlayers||null, status:'lobby',
      questions: parsed.questions, usedIdx:[], curIdx:null, timerEnd:null,
      players:{}, winners:null, revealStep:0, createdAt: Date.now()
    };
    socket.join(code);
    cb && cb({ok:true, code, parseInfo:{count:parsed.questions.length, bad:parsed.bad, usedDefault:parsed.usedDefault}});
    broadcast(code);
  });

  socket.on('host:start', ({code}) => { const r=rooms[code]; if(!r) return; r.status='active'; if(!r.startedAt) r.startedAt=Date.now(); broadcast(code); });

  const REVEAL_MS=1600;       // how long the big number popup stays up before the question appears
  const SPIN_SAFETY_MS=6000;  // safety net only — if host's browser never confirms, auto-advance so the game can't get stuck
  socket.on('host:spin', ({code}) => {
    const r = rooms[code]; if(!r) return;
    if(r.status!=='active' && r.status!=='locked') return; // ignore duplicate/racing spin clicks — fixes skipped questions
    const avail=[]; for(let i=0;i<r.questions.length;i++) if(!r.usedIdx.includes(i)) avail.push(i);
    if (avail.length===0){ r.status='ended'; broadcast(code); return; }
    const idx = avail[Math.floor(Math.random()*avail.length)];
    r.status='spinning'; r.curIdx=idx; r.usedIdx=[...r.usedIdx, idx]; r.timerEnd=null; r.paused=false; r.pausedMs=null; r.lastSpinAt=Date.now();
    broadcast(code);
    // Safety net only: if the host's own wheel never confirms completion (tab closed, crash, etc.),
    // reveal anyway after a generous timeout so the game never gets permanently stuck.
    setTimeout(()=>{
      const rr=rooms[code]; if(!rr||rr.status!=='spinning'||rr.curIdx!==idx) return;
      advanceToRevealing(code, idx);
    }, SPIN_SAFETY_MS);
  });
  function advanceToRevealing(code, idx){
    const r=rooms[code]; if(!r||r.status!=='spinning'||r.curIdx!==idx) return;
    r.status='revealing'; broadcast(code);
    setTimeout(()=>{
      const rr=rooms[code]; if(!rr||rr.status!=='revealing'||rr.curIdx!==idx) return;
      rr.status='question'; rr.timerEnd=Date.now()+(rr.qSec||30)*1000; broadcast(code);
    }, REVEAL_MS);
  }
  // Host's own wheel tells us exactly when its CSS animation visually finished — no guessing, no drift.
  socket.on('host:spinComplete', ({code, idx}) => { advanceToRevealing(code, idx); });

  // Host: question timer length (10-60 s) and skip the remaining time
  socket.on('host:setTimer', ({code, sec}) => {
    const r = rooms[code]; if(!r) return;
    sec = Math.round(+sec); if(!(sec>=10 && sec<=60)) return;
    r.qSec = sec; broadcast(code);
  });
  socket.on('host:skipTimer', ({code}) => {
    const r = rooms[code]; if(!r || r.status!=='question') return;
    r.status='locked'; r.paused=false; r.pausedMs=null; r.timerEnd=null; broadcast(code);
  });

  socket.on('host:end', ({code}) => { const r=rooms[code]; if(!r) return; r.status='ended'; r.paused=false; broadcast(code); });

  // Host's live note shown under every player's Scratch Card message
  socket.on('host:scNote', ({code, text}, cb) => {
    const r = rooms[code]; if(!r){ cb&&cb({ok:false}); return; }
    r.scNote = String(text||'').replace(/[\u0000-\u001f]+/g,' ').trim().slice(0,140);
    broadcast(code); cb&&cb({ok:true});
  });

  // Host reveals the Scratch Card to every player
  socket.on('host:scReveal', ({code, on}, cb) => {
    const r = rooms[code]; if(!r){ cb&&cb({ok:false}); return; }
    r.scReveal = !!on; broadcast(code); cb&&cb({ok:true});
  });

  socket.on('host:reveal', ({code}) => {
    const r = rooms[code]; if(!r) return;
    r.winners = computeWinners(r); r.status='revealed'; r.revealStep=1;
    broadcast(code);
  });

  socket.on('host:nextWinner', ({code}) => {
    const r = rooms[code]; if(!r) return;
    r.revealStep = (r.revealStep||0)+1;
    broadcast(code);
  });

  socket.on('player:join', ({code,name,zone,avatar,clientId}, cb) => {
    const r = rooms[code]; if(!r){ cb&&cb({ok:false,error:'Room code મળ્યો નહિ.'}); return; }
    name=(name||'').trim(); zone=(zone||'').trim();
    if(!name){ cb&&cb({ok:false,error:'નામ લખો.'}); return; }
    if(!r.clientMap) r.clientMap = {};
    const norm = x => (x||'').trim().toLowerCase();
    // 1) same device + same name + same zone => reconnecting (refresh / network drop): resume own card
    const mine = clientId && r.clientMap[clientId];
    if(mine && r.players[mine] && norm(r.players[mine].baseName)===norm(name) && norm(r.players[mine].zone)===norm(zone)){
      socket.join(code);
      cb && cb({ok:true, room: publicRoom(r), yourKey:mine, resumed:true, priv:(r.players[mine]._f||null)});
      broadcast(code);
      return;
    }
    // 2) another player with the same name AND same zone already exists => ask for a different name
    const dup = Object.values(r.players).some(p => norm(p.baseName)===norm(name) && norm(p.zone)===norm(zone));
    if(dup){ cb&&cb({ok:false,error:'⚠️ આ નામ અને Zone વાળા Player પહેલેથી Join થઈ ગયા છે. કૃપા કરીને બીજું નામ (અથવા અટક/ઉપનામ સાથે) વાપરો.'}); return; }
    if (r.maxPlayers && Object.keys(r.players).length>=r.maxPlayers){ cb&&cb({ok:false,error:'Room ભરાઈ ગયો છે.'}); return; }
    // 3) same name in a different zone is allowed; give it a unique internal key "Name (2)"
    let key = name;
    if(r.players[key]){
      let n=2; while(r.players[`${name} (${n})`]) n++;
      key = `${name} (${n})`;
    }
    r.players[key] = { card: makeCard(r.questions), baseName: name, zone, avatar: avatar||'🦁', marks:{}, markTs:{}, cards:{}, claims:{}, joinedAt: Date.now() };
    if(clientId) r.clientMap[clientId] = key;
    socket.join(code);
    cb && cb({ok:true, room: publicRoom(r), yourKey:key});
    broadcast(code);
  });

  socket.on('player:mark', ({code,name,ci}) => {
    const r = rooms[code]; if(!r || r.status!=='question' || r.paused) return;
    const p = r.players[name]; if(!p) return;
    ci = +ci; if(!Number.isInteger(ci) || ci<0 || ci>24) return;
    if(!p.markTs) p.markTs = {}; if(!p.cards) p.cards = {};
    const old = markCell(p, r.curIdx);
    if (old!==undefined){
      // already answered: only allowed once, and only when the Change card was switched on for THIS question
      if (!(p.cards.change===r.curIdx && !p.changed)) return;
      if (old===ci || p.marks[ci]!==undefined) return;
      delete p.marks[old]; p.marks[ci] = r.curIdx; p.markTs[r.curIdx] = Date.now(); p.changed = true;
      broadcast(code); return;
    }
    if (p.marks[ci]!==undefined) return;
    p.marks[ci] = r.curIdx; p.markTs[r.curIdx] = Date.now();
    broadcast(code);
  });

  // ---- Power Cards (each once per game; only ONE Power Card at a time) ----
  socket.on('player:useCard', ({code,name,card}, cb) => {
    const r = rooms[code]; const fail = m => cb && cb({ok:false,error:m});
    if(!r || r.status!=='question' || r.paused) return fail('હમણાં Card વાપરી શકાય નહિ.');
    const p = r.players[name]; if(!p) return fail('Player મળ્યો નહિ.');
    if(!CARD_KEYS.includes(card)) return fail('ખોટું Card.');
    if(!p.cards) p.cards = {}; if(!p.markTs) p.markTs = {};
    const cur = r.curIdx;
    if (p.cards[card]!=null) return fail('આ Card તમે પહેલેથી વાપરી લીધું છે.');
    if (CARD_KEYS.some(k=>p.cards[k]===cur)) return fail('આ પ્રશ્નમાં એક Power Card વપરાઈ ગયું છે. એક સમયે ફક્ત એક જ.');
    if (card!=='streak' && streakActive(r,p)) return fail('Bonus Streak ચાલુ છે, ત્યાં સુધી બીજું Card ન વપરાય.');
    if (card==='streak'){
      p.cards.streak = cur; broadcast(code);
      return cb && cb({ok:true, onCard: answerOnCard(r,p,cur)});
    }
    if (!answerOnCard(r,p,cur)) return fail('આ પ્રશ્નનો જવાબ તમારા Card માં નથી. Card વપરાયું નથી.');
    if (card==='change' && markCell(p,cur)===undefined) return fail('પહેલા એક ખાનું દબાવો, પછી 🔄 Change વાપરો.');
    if (card==='shield'){ p.cards.shield = cur; broadcast(code); return cb && cb({ok:true}); }
    if (card==='change'){ p.cards.change = cur; p.changed = false; broadcast(code); return cb && cb({ok:true}); }
    if (card==='fifty'){
      const right = p.card.indexOf(r.questions[cur].a);
      const others = shuffle([...Array(25).keys()].filter(i=>i!==right));
      p.cards.fifty = cur; p._f = {qi:cur, cells: shuffle([right, others[0]])};
      broadcast(code); return cb && cb({ok:true, cells:p._f.cells});
    }
  });

  socket.on('player:claim', ({code,name,type}) => {
    const r = rooms[code]; if(!r) return;
    const p = r.players[name]; if(!p) return;
    if(!p.claims) p.claims={};
    if(!/^(line[1-5]|full)$/.test(type)) return;
    const now = Date.now();
    const res = playerResults(r, name);       // validity is judged at the moment of the claim
    const marks = Object.keys(p.marks).length;
    const put = (key, need) => {
      const valid = key==='full' ? res.fullHouse : res.correctRows>=need;
      const old = p.claims[key];
      if(old && old.valid){ old.marks = marks; return; }   // an earlier valid claim always stays (earliest time wins)
      // shownTs = time of the player's FIRST click; it never changes, so a player can't tell from the clock
      // whether an earlier claim was wrong. ts = official time used for winners (only revealed at the end).
      p.claims[key] = {ts: now, shownTs: old ? (old.shownTs||old.ts) : now, valid, marks};
    };
    put(type, type==='full'?null:+type.replace('line',''));
    // Claiming "N Line" also registers 1..N-1 Line, each judged on its own truth.
    // So: 1 Line claimed wrongly earlier + 2 Line claimed rightly later => 1 Line also becomes valid (at the later time).
    if(/^line[2-5]$/.test(type)){
      const n = +type.replace('line','');
      for(let k=1;k<n;k++) put('line'+k, k);
    }
    broadcast(code);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Gyan Shodh Quiz server running on port '+PORT));
