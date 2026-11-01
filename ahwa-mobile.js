(()=>{'use strict';
 const isHome=/^(index|games)(\.html)?$/i.test(location.pathname.split('/').pop()||'index.html');
 const check=()=>{if(document.getElementById('ahwaAppTools'))return;
 const tool=document.createElement('div');tool.className='ahwa-app-tools';tool.id='ahwaAppTools';
 const fs=document.createElement('button');fs.type='button';fs.className='ahwa-app-button';fs.textContent='⛶ ملء الشاشة';fs.setAttribute('aria-label','تشغيل ملء الشاشة');
 const install=document.createElement('button');install.type='button';install.className='ahwa-app-button ahwa-install';install.textContent='📲 تثبيت اللعبة';
 const msg=document.createElement('div');msg.className='ahwa-app-message';msg.setAttribute('role','status');
 tool.append(fs,install,msg);document.body.append(tool);
 if(!isHome)document.body.classList.add('ahwa-game-page');
 const notify=s=>{msg.textContent=s;msg.classList.add('visible');};
 const update=()=>{fs.textContent=document.fullscreenElement?'⤢ خروج من ملء الشاشة':'⛶ ملء الشاشة';fs.setAttribute('aria-pressed',String(!!document.fullscreenElement));};
 fs.addEventListener('click',async()=>{
  try{
   if(document.fullscreenElement){await document.exitFullscreen();}
   else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen({navigationUI:'hide'});}
   else notify('على iPhone: افتح مشاركة Safari ثم «إضافة إلى الشاشة الرئيسية» لتشغيل اللعبة كتطبيق.');
   update();
  }catch(e){notify('المتصفح لا يسمح بملء الشاشة هنا. افتح اللعبة من Chrome أو أضفها للشاشة الرئيسية.');}
 });
 document.addEventListener('fullscreenchange',update); update();
 let prompt=null;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;install.classList.add('available');});
 install.addEventListener('click',async()=>{if(prompt){prompt.prompt();await prompt.userChoice;prompt=null;install.classList.remove('available');}else notify('من قائمة المتصفح اختار «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق».');});
 if('serviceWorker' in navigator&&location.protocol==='https:'){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./ahwa-sw.js',{scope:'./'}).catch(()=>{}));
 }
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check);else check();
})();
