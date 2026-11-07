/* Account link shared across all games. No changes to game rules or multiplayer. */
(function(){
  if(document.getElementById('ahwaAccountLink'))return;
  const st=document.createElement('style');
  st.textContent=`#ahwaAccountLink{position:fixed!important;right:max(8px,env(safe-area-inset-right))!important;top:max(8px,env(safe-area-inset-top))!important;z-index:2147483000!important;display:flex!important;align-items:center;justify-content:center;gap:6px;background:#2c1a10f5;color:#ffe2a3;border:1px solid #cfa25b;border-radius:30px;padding:6px 10px;box-shadow:0 3px 13px #0009;font:700 12px system-ui,sans-serif;text-decoration:none;max-width:105px;min-height:34px;box-sizing:border-box}#ahwaAccountLink img{width:25px;height:25px;border-radius:50%;object-fit:cover}#ahwaAccountLink .ahwa-face{font-size:20px}@media(max-width:600px){#ahwaAccountLink{right:max(4px,env(safe-area-inset-right))!important;top:max(3px,env(safe-area-inset-top))!important;padding:3px 7px;max-width:76px;font-size:10px;min-height:29px}#ahwaAccountLink img{width:20px;height:20px}}`;
  document.head.appendChild(st);
  const a=document.createElement('a');a.id='ahwaAccountLink';a.href='./profile.html';a.title='حسابك في ع القهوة';a.setAttribute('aria-label','حساب اللاعب');
  a.innerHTML='<span class="ahwa-face">👤</span><span>حسابي</span>';
  document.body.appendChild(a);
  function refresh(){
    const user=window.firebase?.auth?.().currentUser;
    const emoji=localStorage.getItem('ahwa-profile-avatar')||'👤';
    a.replaceChildren();
    if(user?.photoURL){const i=document.createElement('img');i.src=user.photoURL;i.alt='';i.referrerPolicy='no-referrer';a.appendChild(i)}
    else {const face=document.createElement('span');face.className='ahwa-face';face.textContent=emoji;a.appendChild(face)}
    const label=document.createElement('span');label.textContent=user?'ملفي':'حسابي';a.appendChild(label);
  }
  refresh();
  window.addEventListener('storage',refresh);
  if(window.firebase?.auth){try{window.firebase.auth().onAuthStateChanged(refresh)}catch(e){}}
  else {
    const s=document.createElement('script');s.src='https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';s.onload=()=>{
      const s2=document.createElement('script');s2.src='https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';s2.onload=()=>{
        try{if(!firebase.apps.length)firebase.initializeApp({apiKey:'AIzaSyAc21tJsinRp3I-op4gtthSj9SiZmQOt3I',authDomain:'basra-game-2995a.firebaseapp.com',projectId:'basra-game-2995a',appId:'1:1024179389498:web:3ba98f053d49bfa1676103'});firebase.auth().onAuthStateChanged(refresh)}catch(e){console.warn('Account badge:',e)}
      };document.head.appendChild(s2)
    };document.head.appendChild(s);
  }

  // Shared social hub link; leaves existing game controls and logic unchanged.
  if(!document.getElementById('ahwaHubLink')){
    const social=document.createElement('a');social.id='ahwaHubLink';social.href='./hub.html';social.title='أصحابك ومكافآتك';social.textContent='🎁 قعدتك';
    social.style.cssText='position:fixed;right:max(8px,env(safe-area-inset-right));top:calc(max(8px,env(safe-area-inset-top)) + 38px);z-index:2147482999;display:flex;align-items:center;justify-content:center;background:#2d1c11;color:#ffe1a7;border:1px solid #af8d50;border-radius:20px;padding:5px 9px;font:700 12px Tahoma,sans-serif;text-decoration:none;min-height:30px;box-shadow:0 3px 12px #0008';
    document.body.appendChild(social);
  }
})();