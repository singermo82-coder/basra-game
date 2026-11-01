/* ع القهوة — محطة مزاج رايق داخل واجهة الراديو الأصلية، بلا نوافذ عائمة */
(()=>{'use strict';
const FILE='./ahwa-calm-radio.mp3', KEY='ahwa_mazag_settings_v3';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
const audio=document.createElement('audio');audio.src=FILE;audio.loop=true;audio.preload='metadata';audio.volume=typeof saved.volume==='number'?Math.max(0,Math.min(1,saved.volume)):.45;document.body.appendChild(audio);
const css=document.createElement('style');css.textContent=`
.mazag-radio-button{background:linear-gradient(135deg,#715020,#302012)!important;border:2px solid #e5bf74!important;color:#ffe4a0!important;cursor:pointer}
.mazag-radio-player{direction:rtl;text-align:right;display:none;position:relative;padding:22px;margin:8px 0;background:radial-gradient(circle at 50% 0%,#52331e,#170e09 75%);border:1px solid #d8b077;border-radius:16px;color:#ffe4ac;min-height:180px}
.mazag-radio-player.active{display:block}.mazag-radio-player h3{margin:0 0 9px;font-size:21px;color:#ffd88b}.mazag-radio-player p{font-size:13px;line-height:1.7;color:#e6c99a;margin:7px 0 13px}
.mazag-controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.mazag-controls button{background:#96632d;border:1px solid #f7d38b;border-radius:12px;padding:12px 20px;color:white;cursor:pointer;font-weight:bold}.mazag-controls input{width:min(190px,100%);accent-color:#e5b86e}.mazag-radio-player .mazag-msg{font-size:12px;color:#ffdc9b;display:block;margin-top:13px}
.mazag-standalone-open{position:fixed;z-index:2000;bottom:12px;right:12px;padding:12px 18px;border:1px solid #e8b76b;background:#301e13;color:#ffe3a5;border-radius:22px;font-weight:bold;cursor:pointer}
.mazag-full-overlay{display:none;position:fixed;inset:0;z-index:29999;background:#000b;align-items:center;justify-content:center;padding:20px}.mazag-full-overlay.show{display:flex}.mazag-full-card{width:min(700px,95vw);max-height:90vh;overflow:auto;background:#25150e;color:#ffe4ad;border:2px solid #c99b56;border-radius:20px;padding:24px;direction:rtl}.mazag-full-card>button{float:left;background:#4f2a18;color:white;border:1px solid #b98b48;border-radius:8px;padding:10px 15px;cursor:pointer}
`;document.head.appendChild(css);
function save(){try{localStorage.setItem(KEY,JSON.stringify({volume:audio.volume,playing:!audio.paused,position:audio.currentTime||0}))}catch{}}
function player(){const wrap=document.createElement('div');wrap.className='mazag-radio-player';wrap.innerHTML=`<h3>🌙 راديو ع القهوة | مزاج رايق</h3><p>موسيقى مصرية هادية، محطة خاصة ضمن راديو القهوة.</p><div class="mazag-controls"><button class="mazag-toggle" type="button">▶ تشغيل المحطة</button><label>🔊 الصوت <input class="mazag-vol" type="range" min="0" max="100" value="${Math.round(audio.volume*100)}"></label><span class="mazag-percent">${Math.round(audio.volume*100)}%</span></div><span class="mazag-msg" role="status">اضغط تشغيل لسماع المحطة</span>`;
const btn=wrap.querySelector('.mazag-toggle'),status=wrap.querySelector('.mazag-msg'),vol=wrap.querySelector('.mazag-vol');
btn.onclick=()=>audio.paused?audio.play().catch(()=>{status.textContent='تعذر التشغيل: تأكد من فتح الموقع بعد رفع ملف الصوت.'}):audio.pause();vol.oninput=()=>{audio.volume=Number(vol.value)/100;document.querySelectorAll('.mazag-vol').forEach(v=>v.value=vol.value);update()};
function update(){btn.textContent=audio.paused?'▶ تشغيل المحطة':'⏸ إيقاف مؤقت';if(audio.error){status.textContent='⚠️ ملف الصوت غير موجود: ahwa-calm-radio.mp3';}else{status.textContent=audio.paused?'المحطة جاهزة — اضغط تشغيل':'♫ محطة مزاج رايق شغّالة الآن';}wrap.querySelector('.mazag-percent').textContent=Math.round(audio.volume*100)+'%';save()}
audio.addEventListener('play',update);audio.addEventListener('pause',update);audio.addEventListener('error',update);update();return wrap;}
function activate(wrap,grid){document.querySelectorAll('.mazag-radio-player').forEach(p=>p.classList.toggle('active',p===wrap));grid?.querySelectorAll('.radio-station').forEach(b=>b.classList.toggle('active',b.dataset.station==='mazag'));const label=document.getElementById('radioNowLabel');if(label)label.textContent='📻 مزاج رايق — إذاعتنا الخاصة';const hint=document.getElementById('radioNowHint');if(hint)hint.textContent='موسيقى هادية • تشغيل محلي من ملفات المنصة';const link=document.getElementById('radioOfficialLink');if(link)link.style.display='none';const frame=document.getElementById('radioFrame');if(frame)frame.src='about:blank';const placeholder=document.getElementById('radioFramePlaceholder');if(placeholder)placeholder.classList.add('hidden');audio.play().catch(()=>{});}
const grids=[...document.querySelectorAll('.radio-station-grid')];
if(grids.length){
  const grid=grids[0];
  const btn=document.createElement('button');
  btn.className='radio-station mazag-radio-button';
  btn.dataset.station='mazag';btn.type='button';
  btn.innerHTML='<span>🌙 محطة خاصة</span><strong>مزاج رايق</strong><small>موسيقى مصرية هادية</small>';
  grid.prepend(btn);
  const wrap=player();
  const frameWrap=document.querySelector('.radio-frame-wrap');
  if(frameWrap){
    frameWrap.parentNode.insertBefore(wrap,frameWrap);
    btn.onclick=()=>{activate(wrap,grid);frameWrap.style.display='none'};
    const oldSelect=window.selectRadioStation;
    if(typeof oldSelect==='function')window.selectRadioStation=function(...args){
      audio.pause();wrap.classList.remove('active');frameWrap.style.display='';
      const link=document.getElementById('radioOfficialLink');if(link)link.style.display='';
      return oldSelect.apply(this,args);
    };
    const oldStop=window.stopRadio;
    if(typeof oldStop==='function')window.stopRadio=function(...args){
      audio.pause();wrap.classList.remove('active');frameWrap.style.display='';
      return oldStop.apply(this,args);
    };
  } else {
    grid.after(wrap);
    btn.onclick=()=>activate(wrap,grid);
  }
}else{
  const launch=document.createElement('button');launch.type='button';launch.className='mazag-standalone-open';launch.textContent='📻 راديو القهوة';
  const overlay=document.createElement('section');overlay.className='mazag-full-overlay';
  overlay.innerHTML='<div class="mazag-full-card"><button type="button" aria-label="إغلاق">✕</button><h2>📻 راديو ع القهوة</h2></div>';
  const wrap=player();wrap.classList.add('active');overlay.querySelector('.mazag-full-card').append(wrap);
  overlay.querySelector('button').onclick=()=>overlay.classList.remove('show');
  launch.onclick=()=>overlay.classList.add('show');document.body.append(launch,overlay);
}
// حفظ التفضيل، وعدم إعادة التشغيل تلقائيًا بسبب سياسات المتصفحات
if(saved.position>0)audio.addEventListener('loadedmetadata',()=>{if(saved.position<audio.duration)audio.currentTime=saved.position},{once:true});window.addEventListener('pagehide',save);
})();
