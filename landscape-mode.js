/* ع القهوة — portrait-first v2
   Previously forced landscape on mobile; now portrait play is fully supported.
   File kept for backward compatibility — just clears any lingering gate. */
(function () {
  'use strict';
  if (window.__aqLandscapeModeInstalled) return;
  window.__aqLandscapeModeInstalled = true;

  function removeGate() {
    var gate = document.getElementById('aq-landscape-gate');
    if (gate) gate.remove();
    var style = document.getElementById('aq-landscape-mode-style');
    if (style) style.remove();
    document.body && document.body.classList.remove('aq-landscape-blocked');
    document.body && (document.body.style.overflow = '');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeGate, { once: true });
  } else {
    removeGate();
  }
})();
