(function(){
'use strict';
const KEY='ahwa-chess-design-v14';
const items=[
 ['tableShell','طاولة الشطرنج'],
 ['sidePanel','إعدادات القعدة'],
 ['leftPanel','الشات'],
 ['capturedWhite','القطع المأخوذة بالأبيض'],
 ['capturedBlack','القطع المأخوذة بالأسود'],
 ['moves','سجل النقلات'],
 ['board','الرقعة الداخلية'],
];
let current=null, drag=null, state={}, history=[];
function get(id){return document.getElementById(id)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function initial(){return window.__AHWA_DESIGN_PRESET||load()}
function setStyles(el,c){if(!el||!c)return;
 if(c.width)el.style.setProperty('width',c.width,'important');
 if(c.height)el.style.setProperty('height',c.height,'important');
 if(c.width||c.height){el.style.setProperty('max-width','none','important');el.style.setProperty('max-height','none','important');el.style.setProperty('min-width','0','important');el.style.setProperty('min-height','0','important');el.style.setProperty('flex-shrink','0','important');if(el.id==='tableShell'||el.id==='board'){el.style.setProperty('aspect-ratio','1 / 1','important');el.style.setProperty('flex','none','important');}}
 el.style.setProperty('transform',`translate(${Number(c.x)||0}px,${Number(c.y)||0}px)`,'important');
 if(c.hidden)el.style.setProperty('visibility','hidden','important');else el.style.removeProperty('visibility');
 el.style.position='relative';
 if(c.x||c.y)el.style.zIndex='40';
}
function apply(){for(const [id] of items)setStyles(get(id),state[id]);updateSelection()}
function save(){localStorage.setItem(KEY,JSON.stringify(state));flash('تم حفظ التصميم على الجهاز ✅')}
function snapshot(){history.push(JSON.stringify(state));if(history.length>30)history.shift()}
function flash(msg){const e=get('designNote');e.textContent=msg;e.style.display='inline';setTimeout(()=>{e.style.display='none'},2200)}
function updateSelection(){let box=get('designSelection');let el=current&&get(current);if(!el||!document.body.classList.contains('ahwa-design')){box.style.display='none';return}
 const r=el.getBoundingClientRect();box.style.display='block';Object.assign(box.style,{top:r.top+'px',left:r.left+'px',width:r.width+'px',height:r.height+'px'});
 get('designDragLabel').textContent=(items.find(x=>x[0]===current)||[])[1]+' ↔ اسحب';
 if(document.activeElement!==get('designWidth'))get('designWidth').value=Math.round(r.width);if(document.activeElement!==get('designHeight'))get('designHeight').value=Math.round(r.height);
}
function choose(id){current=id;document.querySelectorAll('.design-target').forEach(e=>e.classList.remove('design-active'));get(id)?.classList.add('design-active');updateSelection()}
function toggle(){let enabled=document.body.classList.toggle('ahwa-design');get('ahwaDesignToggle').textContent=enabled?'✅ إنهاء التصميم':'🎨 تعديل التصميم';document.querySelectorAll('.design-target').forEach(el=>el.classList.remove('design-active'));
 if(enabled){choose(current||'tableShell');flash('اسحب من عنوان التحديد؛ غيّر الحجم من الركن الذهبي')}else{current=null;get('designSelection').style.display='none';save()}}
function start(e,type){if(!current)return;e.preventDefault();e.stopPropagation();snapshot();let el=get(current),r=el.getBoundingClientRect(),c=state[current]||{};
 drag={type,id:current,px:e.clientX,py:e.clientY,x:c.x||0,y:c.y||0,w:r.width,h:r.height};e.target.setPointerCapture?.(e.pointerId)}
function moving(e){if(!drag)return;e.preventDefault();let c=state[drag.id]||(state[drag.id]={});let dx=e.clientX-drag.px,dy=e.clientY-drag.py;
 if(drag.type==='move'){c.x=Math.round(drag.x+dx);c.y=Math.round(drag.y+dy)}else{const size=Math.max(180,Math.round(Math.max(drag.w+dx,drag.h+dy)));if(drag.id==='tableShell'||drag.id==='board'){c.width=size+'px';c.height=size+'px'}else{c.width=Math.max(70,Math.round(drag.w+dx))+'px';c.height=Math.max(35,Math.round(drag.h+dy))+'px'}}
 setStyles(get(drag.id),c);updateSelection()}
function end(){if(drag){drag=null;localStorage.setItem(KEY,JSON.stringify(state))}}
function changeSize(dim,v){if(!current)return;const num=Number(v);if(!Number.isFinite(num)||num<70)return;snapshot();const c=state[current]||(state[current]={});const px=Math.round(num)+'px';c[dim]=px;if(current==='tableShell'||current==='board')c[dim==='width'?'height':'width']=px;setStyles(get(current),c);localStorage.setItem(KEY,JSON.stringify(state));updateSelection();flash('تم تطبيق الحجم: '+px+' ✅')}
function resetOne(){if(!current)return;snapshot();delete state[current];let el=get(current);if(el){['width','height','max-width','max-height','min-width','min-height','flex-shrink','flex','aspect-ratio','transform','visibility','z-index'].forEach(x=>el.style.removeProperty(x))}updateSelection();save()}
function resetAll(){if(!confirm('ترجع كل عناصر الصفحة لأماكنها الأصلية؟'))return;snapshot();state={};for(let [id] of items){let el=get(id);if(el){['width','height','max-width','max-height','min-width','min-height','flex-shrink','flex','aspect-ratio','transform','visibility','z-index'].forEach(x=>el.style.removeProperty(x))}}save();updateSelection()}
function download(name,text,type){const a=document.createElement('a'),blob=new Blob([text],{type});a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function exportJSON(){download('ahwa-chess-layout.json',JSON.stringify(state,null,2),'application/json')}
function exportHTML(){let html=document.documentElement.outerHTML;const preset='<script>window.__AHWA_DESIGN_PRESET='+JSON.stringify(state).replace(/</g,'\\u003c')+';<\\/script>';
 html=html.replace('</head>',preset.replace('<\\/script>','</script>')+'</head>');download('chess-designed.html','<!doctype html>\n'+html,'text/html;charset=utf-8')}
function fileImport(e){let f=e.target.files?.[0];if(!f)return;f.text().then(txt=>{try{let o=JSON.parse(txt);if(!o||typeof o!=='object')throw Error();snapshot();state=o;for(let [id] of items){let el=get(id);if(el)['width','height','max-width','max-height','min-width','min-height','flex-shrink','flex','aspect-ratio','transform','visibility'].forEach(k=>el.style.removeProperty(k))}apply();save()}catch{alert('ملف تصميم غير صالح')}});e.target.value=''}
function init(){state=initial();
 const b=document.createElement('button');b.id='ahwaDesignToggle';b.type='button';b.textContent='🎨 تعديل التصميم';document.body.appendChild(b);b.addEventListener('click',toggle);
 let toolbar=document.createElement('div');toolbar.id='designToolbar';toolbar.innerHTML=`<strong>🎨 وضع التصميم</strong><button id="designSave" class="primary">💾 حفظ</button><button id="designUndo">↶ تراجع</button><button id="designResetOne">إعادة العنصر</button><button id="designResetAll">إعادة الكل</button><label>عرض <input id="designWidth" type="number" min="70" style="width:58px"></label><label>ارتفاع <input id="designHeight" type="number" min="35" style="width:58px"></label><button id="designHide">👁 إخفاء/إظهار</button><button id="designExportJSON">⬇ إعدادات</button><button id="designExportHTML">⬇ HTML</button><label>⬆ استيراد<input type="file" id="designImport" accept=".json,application/json" hidden></label><span id="designNote" style="display:none"></span>`;document.body.appendChild(toolbar);
 let box=document.createElement('div');box.id='designSelection';box.innerHTML='<div class="design-drag" id="designDragLabel">اسحب</div><div class="design-resize" title="كبّر أو صغّر"></div>';document.body.appendChild(box);
 let help=document.createElement('div');help.id='designHelp';help.textContent='في وضع التصميم: اضغط العنصر، واسحب من شريطه الأخضر أو من زاوية التكبير';document.body.appendChild(help);
 for(let [id] of items){let el=get(id);if(!el)continue;el.classList.add('design-target');el.addEventListener('pointerdown',e=>{if(document.body.classList.contains('ahwa-design')){e.preventDefault();e.stopPropagation();choose(id)}},true)}
 get('designDragLabel').addEventListener('pointerdown',e=>start(e,'move'));box.querySelector('.design-resize').addEventListener('pointerdown',e=>start(e,'size'));window.addEventListener('pointermove',moving,true);window.addEventListener('pointerup',end,true);
 get('designSave').onclick=save;get('designUndo').onclick=()=>{if(!history.length)return;state=JSON.parse(history.pop());for(let [id] of items){let el=get(id);if(el)['width','height','max-width','max-height','min-width','min-height','flex-shrink','flex','aspect-ratio','transform','visibility'].forEach(x=>el.style.removeProperty(x))}apply();save()};get('designResetOne').onclick=resetOne;get('designResetAll').onclick=resetAll;
 for(const [id,dim] of [['designWidth','width'],['designHeight','height']]){const input=get(id);input.addEventListener('input',e=>{const value=e.target.value;if(value&&Number(value)>=70)changeSize(dim,value)});input.addEventListener('change',e=>changeSize(dim,e.target.value));input.addEventListener('keydown',e=>{if(e.key==='Enter'){changeSize(dim,e.target.value);e.target.blur()}})}
 get('designHide').onclick=()=>{if(!current)return;snapshot();const c=state[current]||(state[current]={});c.hidden=!c.hidden;apply();save()};
 get('designExportJSON').onclick=exportJSON;get('designExportHTML').onclick=exportHTML;get('designImport').onchange=fileImport;
 window.addEventListener('resize',updateSelection);window.addEventListener('scroll',updateSelection,true);apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
