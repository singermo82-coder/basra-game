/* Default: Sha3by FM 95, no background synthesized music or cup stirring. */
(()=>{
 if(window.__aqRadioInstalled)return;window.__aqRadioInstalled=true;
 const removeMusic=()=>{document.querySelectorAll('audio').forEach(a=>{if(a.id!=='aq-shaaby-radio'){try{a.pause()}catch(_){}}});};
 removeMusic();
 const bar=document.createElement('div');bar.id='aq-radio-bar';
 bar.style.cssText='position:fixed;bottom:12px;left:12px;z-index:99999;direction:rtl;background:#20130bf2;border:1px solid #ca9b50;color:#ffe6a9;padding:9px 11px;border-radius:13px;font:700 12px Cairo,Tahoma,sans-serif;box-shadow:0 4px 20px #0009;display:flex;align-items:center;gap:7px;max-width:95vw;';
 bar.innerHTML='<span>📻 شعبي FM 95</span><button id="aq-radio-start" style="background:#dfb35f;color:#261809;border:none;padding:6px 12px;border-radius:8px;font-weight:900;cursor:pointer">▶ استماع</button><a href="https://worldradiomap.com/eg/play/sha3by" target="_blank" rel="noopener" style="color:#ffe6a9">فتح البث الرسمي ↗</a><button id="aq-radio-stop" style="background:transparent;color:#ffe6a9;border:1px solid #a47530;border-radius:8px;padding:5px;cursor:pointer">إيقاف</button>';
 document.body.append(bar);
 // Explicit station player; third-party iframe might block embedding/autoplay.
 let frame=null;
 const start=()=>{removeMusic();if(!frame){frame=document.createElement('iframe');frame.title='شعبي FM';frame.allow='autoplay';frame.src='https://worldradiomap.com/eg/play/sha3by';frame.style.cssText='position:fixed;bottom:66px;left:12px;width:330px;height:155px;max-width:94vw;z-index:99999;background:white;border:1px solid #bd914f;border-radius:10px';document.body.append(frame)}};
 const stop=()=>{if(frame){frame.remove();frame=null}};
 bar.querySelector('#aq-radio-start').addEventListener('click',start);
 bar.querySelector('#aq-radio-stop').addEventListener('click',stop);
 // Don't let browser policy secretly prevent audio: user can click to start.
})();