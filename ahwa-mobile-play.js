/* AHWA mobile web play enhancements. No app wrapper required. */
(()=>{'use strict';
 const file=location.pathname.split('/').pop().toLowerCase().replace('.html','');
 if(!['basra','domino','chess','ludo','skrew'].includes(file))return;
 document.body.classList.add('aq-game-'+file);
 const existing=document.querySelector('#aq-mobile-fullscreen');if(existing)return;
 const btn=document.createElement('button');btn.id='aq-mobile-fullscreen';btn.type='button';btn.title='ملء الشاشة';btn.setAttribute('aria-label','ملء الشاشة');btn.textContent='⛶';document.body.append(btn);
 function update(){const on=!!document.fullscreenElement;btn.textContent=on?'⊟':'⛶';btn.title=on?'الخروج من ملء الشاشة':'ملء الشاشة'}
 btn.addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen({navigationUI:'hide'});}else{btn.title='على iPhone استخدم إضافة إلى الشاشة الرئيسية للحصول على عرض أكبر';}}catch(e){btn.title='المتصفح لا يسمح بملء الشاشة هنا';}update();});
 document.addEventListener('fullscreenchange',update);
 const meta=document.querySelector('meta[name=viewport]');if(meta)meta.content='width=device-width,initial-scale=1,viewport-fit=cover';
})();
