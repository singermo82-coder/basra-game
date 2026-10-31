(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const channels=[
    {id:'cafe',title:'قعدة على القهوة',subtitle:'أجواء مصرية هادئة • مشهد ديكوري',emoji:'☕'},
    {id:'stars',title:'ليل القاهرة',subtitle:'ليل ونجوم • مشهد ديكوري',emoji:'🌙'},
    {id:'news',title:'أخبار القعدة',subtitle:'قعدة الشطرنج • مشهد خيالي',emoji:'♟️'}
  ];
  let current=0,paused=false,auto=false,last=0;
  function draw(){const c=channels[current];$('tvScreen').dataset.channel=c.id;$('tvChannelTitle').textContent=c.title;$('tvChannelSubtitle').textContent=c.subtitle;$('tvIllustration').textContent=c.emoji;$('tvIndex').textContent=(current+1)+' / '+channels.length;$('tvToggle').textContent=paused?'▶':'⏸';$('tvScreen').dataset.paused=String(paused);$('tvAuto').textContent='تغيير تلقائي: '+(auto?'مفعّل':'مغلق');$('tvAuto').setAttribute('aria-pressed',String(auto))}
  function change(n){current=(current+n+channels.length)%channels.length;draw()}
  function layout(){const arena=document.querySelector('.arena'),board=$('tableShell'),cap=document.querySelector('.capture-lane'),tv=$('ahwaTv');if(!arena||!board||!cap||!tv)return;if(innerWidth<=760)return;
    const a=arena.getBoundingClientRect(),b=board.getBoundingClientRect();const gap=9;
    const available=b.left-a.left-gap-9;
    const w=Math.max(125,Math.min(230,Math.floor(available)));
    const x=Math.max(7,Math.round(b.left-a.left-gap-w));
    arena.style.setProperty('--capture-w',w+'px');arena.style.setProperty('--capture-x',x+'px');
    arena.style.setProperty('--capture-y',Math.max(50,Math.round(b.top-a.top+14))+'px');
    const maxTv=a.bottom-(tv.getBoundingClientRect().top-a.top+a.top)-12;
    tv.style.maxHeight=Math.max(100,Math.min(230,maxTv))+'px';
  }
  function init(){if(!$('ahwaTv'))return;draw();$('tvPrev').addEventListener('click',()=>change(-1));$('tvNext').addEventListener('click',()=>change(1));$('tvToggle').addEventListener('click',()=>{paused=!paused;draw()});$('tvAuto').addEventListener('click',()=>{auto=!auto;last=Date.now();draw()});
    setInterval(()=>{if(auto&&!paused&&Date.now()-last>12000){change(1);last=Date.now()}},1400);
    layout();window.addEventListener('resize',layout); if('ResizeObserver'in window){const ro=new ResizeObserver(()=>requestAnimationFrame(layout));ro.observe($('tableShell'));ro.observe(document.querySelector('.arena'))}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
