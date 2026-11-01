/* راديو ع القهوة: مزاج رايق — shared across all game pages */
(()=>{'use strict';
const FILE='ahwa-calm-radio.mp3', K='ahwa_mazag_radio_v1';
let stored={};try{stored=JSON.parse(sessionStorage.getItem(K)||'{}')}catch{}
const audio=document.createElement('audio');audio.src=FILE;audio.loop=true;audio.preload='metadata';audio.volume=Math.max(0,Math.min(1,Number(stored.volume??0.35)));
audio.style.display='none';document.body.appendChild(audio);
const style=document.createElement('style');style.textContent=`
#mazag-fab{position:fixed;z-index:2147482000;bottom:18px;left:18px;background:linear-gradient(145deg,#d4a456,#86531f);color:#20150b;border:2px solid #f6d390;border-radius:40px;padding:11px 17px;font:700 14px Tahoma,Arial;box-shadow:0 6px 22px #0009;cursor:pointer}
#mazag-panel{position:fixed;z-index:2147482001;bottom:74px;left:18px;width:min(345px,calc(100vw - 36px));padding:17px;background:linear-gradient(155deg,#332014,#150f0c);border:1px solid #dfb678;border-radius:18px;color:#f8e5c0;box-shadow:0 14px 50px #000b;font:14px Tahoma,Arial;text-align:right;direction:rtl}
#mazag-panel[hidden]{display:none!important}#mazag-panel button{border:1px solid #d4aa72;border-radius:9px;background:#6a4527;color:#fff1db;padding:9px 12px;cursor:pointer;font:700 14px Tahoma,Arial}#mazag-panel input{width:100%;accent-color:#edb963}#mazag-status{font-size:12px;color:#dabf96;margin:9px 0}#mazag-row{display:flex;align-items:center;gap:10px;margin:12px 0}#mazag-panel h3{margin:0 0 8px;color:#f3c679;font-size:18px}
#mazag-choice{background:linear-gradient(145deg,#79502b,#362212)!important;color:#ffe5ad!important;border:1px solid #d6a456!important;border-radius:10px!important;padding:9px!important;width:100%!important;margin:6px 0!important;cursor:pointer}
@media(max-width:650px){#mazag-fab{bottom:10px;left:9px;padding:9px 12px;font-size:12px}#mazag-panel{left:9px;bottom:60px;width:min(345px,calc(100vw - 18px))}}`;
document.head.appendChild(style);
const fab=document.createElement('button');fab.id='mazag-fab';fab.type='button';fab.textContent='📻 مزاج رايق';fab.title='راديو ع القهوة — مزاج رايق';
const panel=document.createElement('section');panel.id='mazag-panel';panel.hidden=true;panel.innerHTML=`<h3>📻 راديو ع القهوة | مزاج رايق</h3><div>🌙 موسيقى هادية — محطة مستقلة</div><div id="mazag-status" role="status">اضغط تشغيل للاستماع</div><div id="mazag-row"><button id="mazag-play" type="button">▶ تشغيل</button><button id="mazag-restart" type="button">↺ من الأول</button><button id="mazag-close" type="button" aria-label="إغلاق">✕</button></div><label for="mazag-volume">🔊 مستوى الصوت <span id="mazag-percent">35%</span></label><input id="mazag-volume" type="range" min="0" max="100" value="35"><div style="font-size:11px;margin-top:10px;opacity:.8">الموسيقى تتكرر تلقائيًا، ويمكنك التحكم فيها أثناء اللعب.</div>`;
document.body.append(fab,panel);
const $=(id)=>document.getElementById(id),status=$('mazag-status'),play=$('mazag-play'),vol=$('mazag-volume');vol.value=Math.round(audio.volume*100);$('mazag-percent').textContent=vol.value+'%';
function save(){try{sessionStorage.setItem(K,JSON.stringify({volume:audio.volume,position:audio.currentTime||0,playing:!audio.paused}))}catch{}}
function ui(){play.textContent=audio.paused?'▶ تشغيل':'⏸ إيقاف مؤقت';status.textContent=audio.error?'تعذّر العثور على ملف الموسيقى ahwa-calm-radio.mp3':audio.paused?'المحطة متوقفة — اضغط تشغيل':'♫ مزاج رايق شغّال دلوقتي';fab.textContent=audio.paused?'📻 مزاج رايق':'♫ مزاج رايق • شغال';save()}
function show(){panel.hidden=!panel.hidden;if(!panel.hidden)ui()}
async function start(){try{if(typeof window.stopRadio==='function')window.stopRadio()}catch{};try{await audio.play()}catch{status.textContent='اضغط تشغيل مرة ثانية، وتأكد أن ملف MP3 موجود بجوار صفحة اللعبة.'}ui()}
function pause(){audio.pause();ui()}
fab.addEventListener('click',show);$('mazag-close').addEventListener('click',()=>panel.hidden=true);play.addEventListener('click',()=>audio.paused?start():pause());$('mazag-restart').addEventListener('click',()=>{audio.currentTime=0;start()});vol.addEventListener('input',()=>{audio.volume=Number(vol.value)/100;$('mazag-percent').textContent=vol.value+'%';save()});
audio.addEventListener('play',ui);audio.addEventListener('pause',ui);audio.addEventListener('error',ui);audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(stored.position)&&stored.position>0&&stored.position<audio.duration){audio.currentTime=stored.position}ui()},{once:true});
setInterval(()=>{if(!audio.paused)save()},5000);
function addStation(){const grids=document.querySelectorAll('.radio-station-grid');grids.forEach(grid=>{if(grid.querySelector('#mazag-choice'))return;const btn=document.createElement('button');btn.id='mazag-choice';btn.type='button';btn.innerHTML='<strong>🌙 مزاج رايق — إذاعتنا الخاصة</strong><small style="display:block">موسيقى هادية • تسجيلك الخاص</small>';btn.addEventListener('click',()=>{panel.hidden=false;start();const modal=grid.closest('.overlay');if(modal){/* keep modal for station selection */}});grid.prepend(btn)})}
addStation();
// Resuming automatically across pages is browser-dependent; a user click guarantees playback.
if(stored.playing){fab.textContent='📻 مزاج رايق • اضغط للاستكمال';fab.addEventListener('click',()=>{if(stored.playing&&audio.paused)status.textContent='اضغط تشغيل لاستكمال الموسيقى'}, {once:true})}
ui();
})();
