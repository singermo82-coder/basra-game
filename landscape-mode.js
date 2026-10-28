/* Shared landscape-first experience for every game in the "ع القهوة" collection.
   Add <script src="./landscape-mode.js"></script> before </body> on each game page.
   Browsers may refuse programmatic orientation lock (notably iOS Safari); in that case
   the gate asks the player to rotate the device manually. */
(function () {
  'use strict';
  if (window.__aqLandscapeModeInstalled) return;
  window.__aqLandscapeModeInstalled = true;

  const css = `
    #aq-landscape-gate{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:22px;direction:rtl;background:radial-gradient(ellipse at 50% 20%,rgba(89,49,22,.96),rgba(10,6,4,.99) 72%);color:#f9e8c4;font-family:Cairo,Tajawal,Arial,sans-serif;text-align:center;overflow:auto;overscroll-behavior:contain}
    #aq-landscape-gate.aq-visible{display:flex}
    #aq-landscape-gate *{box-sizing:border-box}
    #aq-landscape-gate .aq-gate-card{width:min(100%,430px);border:1px solid rgba(236,189,91,.75);border-radius:24px;padding:26px 22px 22px;background:linear-gradient(150deg,rgba(56,31,17,.98),rgba(20,11,7,.99));box-shadow:0 22px 70px rgba(0,0,0,.58),inset 0 0 0 3px rgba(225,177,75,.08)}
    #aq-landscape-gate .aq-gate-brand{font-size:clamp(22px,5vw,32px);font-weight:900;color:#ffd87e;text-shadow:0 2px 0 #65390d,0 0 20px rgba(255,190,60,.18);margin:0 0 8px}
    #aq-landscape-gate .aq-gate-sub{font-size:14px;color:#e3d0ac;line-height:1.9;margin:0 0 18px}
    #aq-landscape-gate .aq-device-scene{height:125px;display:flex;align-items:center;justify-content:center;gap:23px;margin:0 auto 18px}
    #aq-landscape-gate .aq-phone{width:104px;height:58px;border:3px solid #edc36b;border-radius:12px;background:linear-gradient(135deg,#0e4535,#09291f);box-shadow:0 0 0 5px rgba(237,195,107,.09),0 9px 25px #0006;position:relative;transform:rotate(-8deg);animation:aq-rock 2.2s ease-in-out infinite}
    #aq-landscape-gate .aq-phone:before{content:"";position:absolute;right:7px;top:22px;width:4px;height:12px;background:#e8c476;border-radius:4px}
    #aq-landscape-gate .aq-phone:after{content:"";position:absolute;left:8px;right:18px;top:7px;bottom:7px;border:1px solid rgba(245,211,139,.35);border-radius:5px;background:repeating-linear-gradient(90deg,transparent 0 12px,rgba(232,195,106,.08) 12px 13px)}
    #aq-landscape-gate .aq-rotate-arrow{font-size:32px;color:#f7cf79;font-weight:900;text-shadow:0 2px 10px #0008}
    #aq-landscape-gate .aq-gate-btn{display:block;width:100%;border:1px solid #ffdc92;border-radius:13px;padding:13px 16px;color:#2a1609;background:linear-gradient(180deg,#ffdf96,#c88a30);font-family:inherit;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 5px 0 #704519,0 10px 24px #0005}
    #aq-landscape-gate .aq-gate-hint{min-height:24px;margin:16px 0 0;color:#cfb995;font-size:12px;line-height:1.8}
    #aq-landscape-gate .aq-gate-tip{margin:9px 0 0;color:#9b8768;font-size:11px}
    @keyframes aq-rock{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(4deg)}}
    @media(prefers-reduced-motion:reduce){#aq-landscape-gate .aq-phone{animation:none}}
  `;
  const style = document.createElement('style');
  style.id = 'aq-landscape-mode-style';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  const gate = document.createElement('div');
  gate.id = 'aq-landscape-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'aq-landscape-title');
  gate.innerHTML = `
    <div class="aq-gate-card">
      <div class="aq-gate-brand" id="aq-landscape-title">ع القهوة — اللعب بالعرض</div>
      <p class="aq-gate-sub">لف الموبايل أو التابلت بالعرض علشان الطاولة وقطع اللعب والشات وأزرار التحكم يظهروا بوضوح.</p>
      <div class="aq-device-scene" aria-hidden="true"><div class="aq-phone"></div><div class="aq-rotate-arrow">⟳</div></div>
      <button type="button" class="aq-gate-btn" id="aq-landscape-try">حاول تثبيت الوضع الأفقي</button>
      <p class="aq-gate-hint" id="aq-landscape-hint" aria-live="polite">لو الشاشة ما اتقلبتش تلقائيًا، لف الجهاز يدويًا بالعرض وأوقف قفل تدوير الشاشة.</p>
      <p class="aq-gate-tip">نفس الوضع مستخدم في الباصرة والدومينو وكل الألعاب الجديدة من ملاهي.</p>
    </div>`;

  function isTouchDevice() {
    return (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || Number(navigator.maxTouchPoints || 0) > 0;
  }
  function isPortrait() {
    const mediaPortrait = window.matchMedia && window.matchMedia('(orientation: portrait)').matches;
    return Boolean(mediaPortrait || window.innerHeight > window.innerWidth);
  }
  function shouldGate() {
    // Restrict mobile/tablet touch devices only; don't block a narrow desktop browser window.
    return isTouchDevice() && isPortrait();
  }
  function refresh() {
    const show = shouldGate();
    const body = document.body;
    if (!body) return;
    if (!gate.isConnected) body.appendChild(gate);
    gate.classList.toggle('aq-visible', show);
    body.classList.toggle('aq-landscape-blocked', show);
    body.style.overflow = show ? 'hidden' : '';
    if (show) {
      gate.style.display = 'flex';
    } else {
      gate.style.display = 'none';
    }
  }
  const button = gate.querySelector('#aq-landscape-try');
  const hint = gate.querySelector('#aq-landscape-hint');
  button.addEventListener('click', async function () {
    button.disabled = true;
    button.textContent = 'بنحاول تفعيل العرض الأفقي…';
    hint.textContent = 'المتصفح قد يحتاج إذن ملء الشاشة؛ لو رفض التدوير، لف الجهاز يدويًا.';
    try {
      const root = document.documentElement;
      if (root.requestFullscreen && !document.fullscreenElement) {
        try { await root.requestFullscreen(); } catch (_) { /* iOS and some browsers disallow page fullscreen. */ }
      }
      const orientation = screen && screen.orientation;
      if (orientation && typeof orientation.lock === 'function') {
        try { await orientation.lock('landscape'); } catch (_) { /* Manual rotation fallback below. */ }
      }
    } catch (_) { /* Keep manual rotation available on all supported devices. */ }
    window.setTimeout(function () {
      refresh();
      button.disabled = false;
      button.textContent = 'حاول تثبيت الوضع الأفقي';
      if (shouldGate()) {
        hint.textContent = 'جهازك لا يسمح للمتصفح بتدوير الشاشة تلقائيًا. لف الموبايل أو التابلت يدويًا بالعرض، وتأكد أن قفل التدوير غير مفعّل.';
      }
    }, 350);
  });

  function start() {
    if (!document.body) return;
    document.body.appendChild(gate);
    refresh();
    window.addEventListener('resize', refresh, {passive:true});
    window.addEventListener('orientationchange', function () { window.setTimeout(refresh, 120); }, {passive:true});
    if (screen.orientation && screen.orientation.addEventListener) {
      screen.orientation.addEventListener('change', refresh);
    }
    if (window.visualViewport) window.visualViewport.addEventListener('resize', refresh, {passive:true});
    document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
