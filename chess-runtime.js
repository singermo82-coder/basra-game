import {Chess} from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';
const $=id=>document.getElementById(id);
const chess=new Chess();
let mode='cpu',difficulty='easy',selected=null,flipped=false,room='',myColor='w',db=null,roomRef=null,chatRef=null,thinking=false,remoteApplying=false,muted=false,chatMuted=false,radioUrl='';
let name=localStorage.getItem('ahwa-name')||'محمد';
let pieceTheme=localStorage.getItem('ahwa-chess-piece-theme')||'classic';
let tableTheme=localStorage.getItem('ahwa-chess-table-theme')||'walnut';
const pieceGlyph={wk:'♔',wq:'♕',wr:'♖',wb:'♗',wn:'♘',wp:'♙',bk:'♚',bq:'♛',br:'♜',bb:'♝',bn:'♞',bp:'♟'};
const AVATARS=[
 {id:'curly-man',name:'شاب كيرلي',cat:'men',emoji:'👨🏻',x:0,y:0},
 {id:'fez-man',name:'معلم بالطربوش',cat:'cafe',emoji:'🧔🏻',x:33.3333,y:0},
 {id:'hijab-woman',name:'بنت بالحجاب',cat:'women',emoji:'👩🏻',x:66.6667,y:0},
 {id:'young-woman',name:'بنت مودرن',cat:'women',emoji:'👩🏻‍🦰',x:100,y:0},
 {id:'teacher',name:'المعلم المصري',cat:'cafe',emoji:'👳🏻‍♂️',x:0,y:50},
 {id:'bearded-man',name:'شاب كاجوال',cat:'men',emoji:'🧔🏻‍♂️',x:33.3333,y:50},
 {id:'orange-cat',name:'قط برتقالي',cat:'pets',emoji:'🐈',x:66.6667,y:50},
 {id:'golden-dog',name:'كلب جولدن',cat:'pets',emoji:'🐕',x:100,y:50},
 {id:'parrot',name:'ببغاء',cat:'pets',emoji:'🦜',x:0,y:100},
 {id:'rabbit',name:'أرنب',cat:'pets',emoji:'🐇',x:33.3333,y:100},
 {id:'black-cat',name:'قط أسود',cat:'pets',emoji:'🐈‍⬛',x:66.6667,y:100},
 {id:'auntie',name:'ست مصرية',cat:'women',emoji:'👵🏻',x:100,y:100}
];
let avatarCategory='all';
const pieceNames={p:'بيدق',n:'حصان',b:'فيل',r:'قلعة',q:'وزير',k:'ملك'};
const pieceThemes={classic:{name:'كلاسيك',desc:'ستايل واضح وتقليدي'},stone:{name:'حجري فاخر',desc:'إحساس خامة حجر / خشب'},gold:{name:'ذهبي',desc:'فخم ولامع'},'3d':{name:'3D حقيقي',desc:'رقعة وقطع WebGL مجسمة'}};
const tableThemes={walnut:{name:'جوز كلاسيك',desc:'خشب شطرنج دافئ',mini:'linear-gradient(135deg,#8b5b34,#3e2515 55%,#8b5b34)'},marble:{name:'رخام أنيق',desc:'ستايل احترافي هادئ',mini:'linear-gradient(135deg,#eee5d6,#8d7a65 60%,#d7ccbc)'},royal:{name:'أزرق ملكي',desc:'ستايل بطولة',mini:'linear-gradient(135deg,#6e542d,#1f3a57 58%,#6e542d)'},emerald:{name:'زمردي',desc:'طاولة قهوة راقية',mini:'linear-gradient(135deg,#8f6b3a,#234f43 58%,#8f6b3a)'},noir:{name:'أسود فاخر',desc:'قوي واحترافي',mini:'linear-gradient(135deg,#594121,#151515 58%,#4a3820)'}};
const radioLinks={nagham:'https://www.naghamfm1053.com/ar',nogoum:'https://www.nogoumfm.net',nile:'https://www.nilefm.com',nrj:'https://www.nrjegypt.com',shaabi:'https://www.maspero.eg',aghani:'https://www.maspero.eg'};

const SVG_SHAPES={
 p:'<circle cx="50" cy="24" r="13"/><path d="M37 40 Q50 30 63 40 L67 72 L33 72Z"/>',
 r:'<path d="M26 16H38V25H46V16H54V25H62V16H74L70 36H30Z M34 38H66L64 72H36Z"/>',
 n:'<path d="M30 72L32 52L23 48L18 38L34 20L44 17L51 7L62 16L70 38L62 45L60 72Z"/><circle cx="44" cy="28" r="3" fill="var(--eye)" stroke="none"/>',
 b:'<path d="M50 10C68 20 70 39 57 53L65 72H35L43 53C30 39 32 20 50 10Z"/><path d="M59 21L42 48" stroke="var(--detail)" stroke-width="5"/>',
 q:'<path d="M21 20L34 47L40 25L50 47L60 25L66 47L79 20L67 71H33Z"/><circle cx="20" cy="18" r="6"/><circle cx="40" cy="18" r="5"/><circle cx="60" cy="18" r="5"/><circle cx="80" cy="18" r="6"/>',
 k:'<path d="M44 8H56V17H66V28H56V38L68 72H32L44 38V28H34V17H44Z"/>'
};
const pieceIconCache={};
function svgPiece(type,color){
 const key=type+color;if(pieceIconCache[key])return pieceIconCache[key];
 const light=color==='w',main=light?['#fff9e6','#ead8b4','#ae9067','#66513a']:['#a6a29b','#51524f','#24272a','#090d10'];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${main[3]}"/><stop offset=".18" stop-color="${main[2]}"/><stop offset=".39" stop-color="${main[0]}"/><stop offset=".65" stop-color="${main[1]}"/><stop offset="1" stop-color="${main[3]}"/></linearGradient><linearGradient id="foot" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${main[0]}"/><stop offset="1" stop-color="${main[3]}"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="2.1"/></filter></defs><ellipse cx="53" cy="86" rx="34" ry="6" fill="#000" opacity=".45" filter="url(#shadow)"/><g stroke="${main[3]}" stroke-width="2" stroke-linejoin="round" fill="url(#metal)" style="--detail:${main[3]};--eye:${main[3]}">${SVG_SHAPES[type]}<path d="M28 70Q50 66 72 70L77 79H23Z" fill="url(#foot)"/><path d="M20 79Q50 76 80 79V88H20Z" fill="url(#metal)"/></g><path d="M35 78H65" stroke="#fff" opacity=".45" stroke-width="1.6" stroke-linecap="round"/></svg>`;
 return pieceIconCache[key]='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}

const sq=(r,c)=>'abcdefgh'[c]+(8-r);
const avatarById=id=>AVATARS.find(a=>a.id===id);
function message(t){const x=$('gameDetail');if(x)x.textContent=t;}
function pieceSpan(piece){const theme=pieceTheme in pieceThemes?pieceTheme:'classic';return theme==='3d'?`<img class="chess-piece chess-piece-3d" draggable="false" alt="${piece.color==='w'?'أبيض':'أسود'} ${pieceNames[piece.type]}" src="${svgPiece(piece.type,piece.color)}">`:`<span class="chess-piece ${piece.color==='w'?'white':'black'} theme-${theme}">${pieceGlyph[piece.color+piece.type]}</span>`}
function computeCaptured(){const hist=chess.history({verbose:true});const white=[],black=[];for(const m of hist){if(m.captured){const g=pieceGlyph[(m.color==='w'?'b':'w')+m.captured];(m.color==='w'?white:black).push({glyph:g,color:m.color==='w'?'black':'white',type:m.captured});}}return {white,black};}
function renderCaptured(){const caps=computeCaptured(), img=(p)=>pieceTheme==='3d'?`<img class=\"captured-piece-img\" alt=\"${pieceNames[p.type]}\" src=\"${svgPiece(p.type,p.color==='white'?'w':'b')}\">`:p.glyph;const w=$('capturedWhite'),b=$('capturedBlack');if(w)w.innerHTML=caps.white.length?caps.white.map(p=>`<span class=\"captured-piece ${p.color}\" title=\"${pieceNames[p.type]}\">${img(p)}</span>`).join(''):'<span class=\"muted small\">لا يوجد قطع مأخوذة</span>';if(b)b.innerHTML=caps.black.length?caps.black.map(p=>`<span class=\"captured-piece ${p.color}\" title=\"${pieceNames[p.type]}\">${img(p)}</span>`).join(''):'<span class=\"muted small\">لا يوجد قطع مأخوذة</span>';}
let chess3D=null,loading3D=false,chess3DError=false;
async function activate3D(){
 if(chess3D||loading3D)return;
 loading3D=true;chess3DError=false;
 const status=$('chess3dError');if(status)status.hidden=true;
 try{
   const {createChess3D}=await import('./chess-3d.js?v=7');
   if(pieceTheme!=='3d'){loading3D=false;return}
   chess3D=createChess3D({mount:$('chess3dMount'),onSquare:squareClick}); if(chess3D.setTheme)chess3D.setTheme(tableTheme);
   document.body.classList.add('chess-3d-active');
   render();
 }catch(err){console.error('تعذر تفعيل 3D',err);chess3DError=true;document.body.classList.remove('chess-3d-active');
   if(status){status.textContent='متصفحك أو اتصال الإنترنت منع تحميل المجسمات. الرقعة العادية متاحة للعب.';status.hidden=false;}
 }
 loading3D=false;
}
function sync3D(){
 if(pieceTheme==='3d'&&!chess3D&&!loading3D&&!chess3DError){activate3D();return}
 if(chess3D&&pieceTheme==='3d'){
  try{chess3D.update(chess,{selected,targets:selected?chess.moves({square:selected,verbose:true}).map(m=>m.to):[],flip:flipped})}catch(err){console.error(err)}
 }
}
function render(){
  const board=$('board'); if(!board)return; board.innerHTML='';
  const canSelect=!chess.isGameOver()&&!thinking&&(mode!=='online'||chess.turn()===myColor);
  const options=selected&&canSelect?chess.moves({square:selected,verbose:true}):[];
  const dest=new Set(options.map(m=>m.to)),hist=chess.history({verbose:true}),last=hist.at(-1);
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const y=flipped?7-r:r,x=flipped?7-c:c,id=sq(y,x),piece=chess.get(id),el=document.createElement('div');
    el.className='chess-square '+((r+c)%2?'dark':'light')+(selected===id?' selected':'')+(dest.has(id)?' target':'')+(last&&(last.from===id||last.to===id)?' last':'')+(chess.isCheck()&&piece?.type==='k'&&piece.color===chess.turn()?' check':'');
    el.setAttribute('role','button');el.setAttribute('aria-label',id);el.tabIndex=0;
    el.onclick=()=>squareClick(id);
    el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();squareClick(id)}};
    if(piece)el.innerHTML=pieceSpan(piece);
    board.appendChild(el);
  }
  const status=chess.isCheckmate()?'كش مات! '+(chess.turn()==='w'?'الأسود':'الأبيض')+' كسب':chess.isStalemate()?'تعادل — مفيش نقلة قانونية':chess.isDraw()?'تعادل':chess.isCheck()?'كش! دور '+(chess.turn()==='w'?'الأبيض':'الأسود'):'دور '+(chess.turn()==='w'?'الأبيض':'الأسود');
  const moveCount=hist.length; const lastSan=hist.length?hist.at(-1).san:'لا توجد'; const modeLabelText=mode==='cpu'?'ضد المعلم':mode==='local'?'لاعبان محليان':'أونلاين';
  if($('turnBanner'))$('turnBanner').textContent=status; message(status);
  if($('moves'))$('moves').innerHTML=hist.map((m,i)=>'<span>'+(i%2===0?Math.floor(i/2)+1+'. ':'')+m.san+'</span>').join('');
  if($('modeLabel'))$('modeLabel').textContent=modeLabelText;
  if($('targetLabel'))$('targetLabel').textContent=mode==='online'?(room||'قعدة خاصة'):'كش مات';
  if($('roundLabel'))$('roundLabel').textContent=String(Math.floor(hist.length/2)+1);
  if($('connectionStatus'))$('connectionStatus').textContent=mode==='online'?'🌐 '+room:'محلي 🟢';
  if($('opName'))$('opName').textContent=mode==='cpu'?'المعلم زكي':(mode==='local'?'اللاعب الثاني':'المنافس');
  if($('meName'))$('meName').textContent=name;
  if($('turnChipMini'))$('turnChipMini').textContent=chess.turn()==='w'?'الأبيض':'الأسود';
  if($('moveCountChip'))$('moveCountChip').textContent=String(moveCount);
  if($('lastMoveChip'))$('lastMoveChip').textContent=lastSan;
  if($('themeChip'))$('themeChip').textContent=(pieceThemes[pieceTheme]&&pieceThemes[pieceTheme].name)||'كلاسيك';
  if($('tableChip'))$('tableChip').textContent=(tableThemes[tableTheme]&&tableThemes[tableTheme].name)||'جوز كلاسيك';
  if($('modeChipMini'))$('modeChipMini').textContent=modeLabelText;
  applyAvatar($('topProfileAvatar'), localStorage.getItem('aq-chess-avatar')||localStorage.getItem('aq-domino-avatar')||'curly-man');
  applyAvatar($('meAvatar'), localStorage.getItem('aq-chess-avatar')||localStorage.getItem('aq-domino-avatar')||'curly-man');
  if($('opAvatar'))applyAvatar($('opAvatar'),'teacher');
  renderCaptured();
  sync3D();
}
function squareClick(id){if(thinking||chess.isGameOver())return;if(mode==='cpu'&&chess.turn()==='b')return;if(mode==='online'&&chess.turn()!==myColor)return;const piece=chess.get(id);if(piece&&piece.color===chess.turn()){selected=selected===id?null:id;render();return}const opts=selected?chess.moves({square:selected,verbose:true}).filter(m=>m.to===id):[];if(!opts.length){selected=null;render();return}const m=opts[0];if(m.flags.includes('p')){const popup=document.createElement('div');popup.className='chess-choice';popup.innerHTML='<span style="font-weight:700;color:#fff">ترقية البيدق:</span>';for(const q of ['q','r','b','n']){const btn=document.createElement('button');btn.innerHTML=pieceGlyph[chess.turn()+q];btn.onclick=()=>{popup.remove();commit({from:selected,to:id,promotion:q})};popup.appendChild(btn)}document.body.appendChild(popup)}else commit({from:selected,to:id,promotion:'q'})}
async function commit(m){
  try{
    const before=chess.fen();
    const move=chess.move(m);
    if(!move)return;
    selected=null; render(); playMoveFx(move.captured?'capture':'move');
    if(mode==='online'&&!remoteApplying&&roomRef){
      try{const snap=await roomRef.child('game').once('value'); const value=snap.val()||{}; if(value.fen!==before){chess.load(value.fen||new Chess().fen()); render(); message('النقلة لم تُحفظ بسبب تزامن الدور. حاول تاني'); return} await roomRef.child('game').update({fen:chess.fen(),lastBy:myColor,updatedAt:Date.now()})}
      catch(e){chess.undo();render();message('مشكلة اتصال: '+e.message)}
    }
    if(mode==='cpu'&&!chess.isGameOver()&&chess.turn()==='b')cpuMove();
  }catch(e){message('النقلة غير قانونية: '+e.message)}
}
function cpuMove(){thinking=true;setTimeout(()=>{const moves=chess.moves({verbose:true});if(!moves.length){thinking=false;render();return}let pick;if(difficulty==='easy')pick=moves[Math.floor(Math.random()*moves.length)];else{const points={p:1,n:3,b:3,r:5,q:9,k:0};pick=moves.map(m=>({m,v:(m.captured?points[m.captured]*10:0)+(m.san.includes('+')?3:0)+(m.san.includes('#')?1000:0)+Math.random()*(difficulty==='medium'?6:2)})).sort((a,b)=>b.v-a.v)[0].m}thinking=false;commit({from:pick.from,to:pick.to,promotion:pick.promotion||'q'})},420)}
window.newChessGame=async()=>{if(mode==='online'&&roomRef){if(!confirm('إعادة بدء مباراة الأونلاين لكل اللاعبين؟'))return;await roomRef.child('game').set({fen:new Chess().fen(),updatedAt:Date.now()});return}chess.reset();selected=null;render()};
window.newLocalGame=window.newChessGame;
window.flipBoard=()=>{flipped=!flipped;render()};
window.undoChess=()=>{if(mode==='online'){message('التراجع غير متاح في القعدة الأونلاين');return}if(mode==='cpu'){chess.undo();chess.undo()}else chess.undo();selected=null;render()};
window.setMode=m=>{if(mode==='online'&&m!=='online'){roomRef?.off();chatRef?.off();room=''}mode=m;chess.reset();flipped=false;selected=null;render()};
window.setDifficulty=x=>{difficulty=x;localStorage.setItem('ahwa-chess-difficulty',x)};
window.openModal=id=>{const x=$(id);if(x)x.classList.remove('hidden');if(id==='tableSkinsModal')renderTableSkins();if(id==='pieceSkinsModal')renderPieceSkins();if(id==='avatarModal')renderAvatarPicker();};
window.closeModal=id=>{$(id)?.classList.add('hidden')};
window.showComingSoon=t=>alert(t+' — قريبًا ع القهوة ✨');
window.editProfileName=()=>{const n=prompt('اسمك على القهوة',name);if(n?.trim()){name=n.trim().slice(0,20);localStorage.setItem('ahwa-name',name);if($('topProfileName'))$('topProfileName').textContent=name;render()}};
window.toggleMasterMute=()=>{muted=!muted;localStorage.setItem('ahwa-chess-muted',String(muted));if($('masterSoundIcon'))$('masterSoundIcon').textContent=muted?'🔇':'🔊';if($('masterSoundLabel'))$('masterSoundLabel').textContent=muted?'شغّل الصوت':'كتم الصوت'};
let audioCtx; function ctx(){return audioCtx||(audioCtx=new(window.AudioContext||window.webkitAudioContext)())}
function playMoveFx(kind='move'){if(muted)return;try{const c=ctx();const now=c.currentTime;if(kind==='capture'){const n=c.createBufferSource(),g=c.createGain(),buffer=c.createBuffer(1,c.sampleRate*0.08,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);n.buffer=buffer;n.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.08,now);g.gain.exponentialRampToValueAtTime(.001,now+0.07);n.start();const o=c.createOscillator(),og=c.createGain();o.type='triangle';o.frequency.setValueAtTime(150,now);o.frequency.exponentialRampToValueAtTime(95,now+.09);o.connect(og);og.connect(c.destination);og.gain.setValueAtTime(.06,now);og.gain.exponentialRampToValueAtTime(.001,now+.09);o.start();o.stop(now+.1)}else{const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(420,now);o.frequency.exponentialRampToValueAtTime(260,now+.05);o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.045,now);g.gain.exponentialRampToValueAtTime(.001,now+.07);o.start();o.stop(now+.08)}}catch(e){}}
window.toggleAmbience=()=>message('أجواء القهوة متاحة تجريبيًا.'); window.testCafeTalk=()=>playMoveFx('capture'); window.testTileSound=()=>playMoveFx('move'); window.testTeaStir=()=>playMoveFx('move'); window.testTeaPour=()=>playMoveFx('capture'); window.testCupClink=()=>playMoveFx('move'); window.testCallout=()=>{if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance('كش يا معلم');u.lang='ar-EG';speechSynthesis.speak(u)}};
window.selectRadioStation=k=>{radioUrl=radioLinks[k];const fr=$('radioFrame');if(fr)fr.src=radioUrl;if($('radioFramePlaceholder'))$('radioFramePlaceholder').classList.add('hidden');if($('radioOfficialLink'))$('radioOfficialLink').href=radioUrl;if($('radioNowLabel'))$('radioNowLabel').textContent='المحطة المختارة: '+k};
window.stopRadio=()=>{if($('radioFrame'))$('radioFrame').src='about:blank'};
window.shareGame=window.shareRoom=()=>navigator.clipboard?.writeText(location.href).then(()=>message('تم نسخ رابط اللعبة')).catch(()=>prompt('انسخ الرابط',location.href));
window.ahwaOpenMusic=()=>message('مزيكا القهوة متاحة من إعدادات القعدة.'); window.openMusic=()=>openModal('radioModal'); window.ahwaPlayMusic=()=>{}; window.ahwaPauseMusic=()=>{}; window.ahwaAudioTest=()=>playMoveFx('move');
window.mobileMenuAction=k=>{closeModal('mobileMenuModal');const action={chat:()=>toggleChatPanel(),online:()=>openModal('onlineModal'),skins:()=>openModal('pieceSkinsModal'),sound:()=>openModal('soundModal'),rules:()=>openModal('rulesModal'),share:()=>shareGame(),chatSound:()=>toggleChatSound(),new:()=>newChessGame()};action[k]?.()};
window.toggleChatPanel=()=>{const p=$('chatCard');if(p)p.classList.toggle('chat-visible');}; window.toggleMobileChat=window.toggleChatPanel; window.toggleChatSound=()=>{chatMuted=!chatMuted};
window.sendQuick=t=>{const i=$('chatInput');if(i){i.value=t;sendChat()}};
window.sendChat=async()=>{const i=$('chatInput')||$('chatMessage');if(!i)return;const msg=i.value.trim().slice(0,300);if(!msg)return;i.value='';if(chatRef){await chatRef.push({name,text:msg,at:Date.now()})}else appendChat(name,msg)};
function appendChat(n,t){const area=$('chatMessages')||$('chatFeed');if(area){const d=document.createElement('div');d.className='chat-entry';d.textContent=n+': '+t;area.appendChild(d);area.scrollTop=area.scrollHeight}}
function renderTableSkins(){const grid=$('tableSkinsGrid');if(!grid)return;grid.innerHTML=Object.entries(tableThemes).map(([id,v])=>`<button type="button" data-table="${id}" aria-pressed="${tableTheme===id}" class="table-skin-card ${tableTheme===id?'active':''}" onclick="setTableSkin('${id}')"><div class="table-preview"><span class="mini-board"></span><span class="mini-piece">♞</span></div><div class="table-caption"><strong>${tableTheme===id?'✓ ':''}${v.name}</strong><small>${v.desc}</small></div></button>`).join('');}
window.setTableSkin=k=>{tableTheme=k; localStorage.setItem('ahwa-chess-table-theme',k); document.body.classList.remove(...Object.keys(tableThemes).map(x=>'table-theme-'+x)); document.body.classList.add('table-theme-'+k); const vars={walnut:['#e7cfa6','#896444'],marble:['#f5ead6','#9aa0aa'],royal:['#f0dfbf','#58799a'],emerald:['#e6e4d0','#5e8967'],noir:['#dbccaa','#5a5246']}[k]||['#e8d1ab','#678260']; document.documentElement.style.setProperty('--chess-light',vars[0]); document.documentElement.style.setProperty('--chess-dark',vars[1]); if(chess3D&&typeof chess3D.setTheme==='function')chess3D.setTheme(k); render();renderTableSkins();};
function renderPieceSkins(){
 const grid=$('pieceSkinsGrid');if(!grid)return;
 const glyphs=['k','q','n','r','b','p'];
 const buildPreview=id=>glyphs.map((p,i)=>{
   const color=i%2===0?'w':'b';
   return id==='3d'
     ? `<img class="preview-figure" draggable="false" src="${svgPiece(p,color)}" alt="${pieceNames[p]}">`
     : `<span class="preview-figure chess-piece ${color==='w'?'white':'black'} theme-${id}">${pieceGlyph[color+p]}</span>`;
 }).join('');
 grid.innerHTML=Object.entries(pieceThemes).map(([id,v])=>`<button type="button" aria-pressed="${pieceTheme===id}" class="piece-skin-card piece-theme-${id} ${pieceTheme===id?'active':''}" onclick="setPieceTheme('${id}')"><div class="piece-preview chess-preview-six">${buildPreview(id)}</div><div class="piece-caption"><strong>${pieceTheme===id?'✓ ':''}${v.name}</strong><small>${v.desc}</small></div></button>`).join('');
}
window.setPieceTheme=k=>{if(!(k in pieceThemes))return;pieceTheme=k;localStorage.setItem('ahwa-chess-piece-theme',k);
 document.body.classList.toggle('pieces-3d-mode',k==='3d');
 if(k!=='3d'){if(chess3D){chess3D.dispose();chess3D=null}chess3DError=false;document.body.classList.remove('chess-3d-active');}
 else if(chess3DError){chess3DError=false;}
 render();renderPieceSkins();};
function renderAvatarPicker(){const grid=$('avatarPickerGrid'); if(!grid)return; const selected=localStorage.getItem('aq-chess-avatar')||localStorage.getItem('aq-domino-avatar')||'curly-man'; const list=AVATARS.filter(a=>avatarCategory==='all'||a.cat===avatarCategory); grid.innerHTML=list.map(a=>`<button type="button" class="avatar-option ${a.id===selected?'active':''}" onclick="chooseAvatar('${a.id}')"><span class="avatar-choice-picture" style="background-image:url('./avatar-grid.webp');background-size:400% 300%;background-position:${a.x}% ${a.y}%"></span><strong>${a.name}</strong><small>${a.cat==='men'?'شباب':a.cat==='women'?'بنات':a.cat==='pets'?'حيوان أليف':'شخصية القهوة'}</small><span class="avatar-check">✓ تم الاختيار</span></button>`).join(''); document.querySelectorAll('[data-avatar-category]').forEach(b=>b.classList.toggle('active',b.dataset.avatarCategory===avatarCategory));}
window.setAvatarCategory=cat=>{avatarCategory=cat; renderAvatarPicker();};
window.chooseAvatar=id=>{if(!avatarById(id))return; localStorage.setItem('aq-chess-avatar',id); render(); renderAvatarPicker(); closeModal('avatarModal'); message('تم اختيار صورتك');};
function applyAvatar(el,id){if(!el)return;const a=avatarById(id);el.classList.remove('avatar-sprite','avatar-photo');el.textContent='';el.style.backgroundImage=id==='teacher'?"url('./teacher-avatar.webp')":"url('./avatar-grid.webp')";el.style.backgroundSize=id==='teacher'?'cover':'400% 300%';el.style.backgroundPosition=id==='teacher'?'center':`${a?.x||0}% ${a?.y||0}%`;el.style.backgroundRepeat='no-repeat';el.style.display='block';el.style.fontSize='';} 
async function connectDB(){if(db)return db; await new Promise((ok,fail)=>{if(window.firebase)return ok(); const sc=document.createElement('script'); sc.src='https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js'; sc.onload=ok; sc.onerror=fail; document.head.appendChild(sc)}); await new Promise((ok,fail)=>{if(firebase.database)return ok(); const sc=document.createElement('script'); sc.src='https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js'; sc.onload=ok; sc.onerror=fail; document.head.appendChild(sc)}); if(!firebase.apps.length)firebase.initializeApp({apiKey:'AIzaSyDVMg6O1jIDqH9EH51K9a1V19lJB-xRkFU',authDomain:'basra-game-2995a.firebaseapp.com',databaseURL:'https://basra-game-2995a-default-rtdb.firebaseio.com',projectId:'basra-game-2995a'}); db=firebase.database(); return db}
function onlineInfo(t){if($('onlineMessage'))$('onlineMessage').textContent=t}
async function startOnline(code,host){try{await connectDB(); room=code; mode='online'; myColor=host?'w':'b'; roomRef=db.ref('games/chess_'+code); roomRef.off(); roomRef.child('game').on('value',snap=>{const v=snap.val(); if(!v?.fen)return; try{chess.load(v.fen); selected=null; remoteApplying=true; flipped=myColor==='b'; render(); remoteApplying=false}catch(e){console.error(e)}}); chatRef=roomRef.child('chat'); chatRef.off(); const area=$('chatMessages')||$('chatFeed'); if(area)area.innerHTML=''; chatRef.limitToLast(60).on('child_added',x=>{const d=x.val(); if(d?.text)appendChat(d.name||'ضيف',d.text)}); onlineInfo('القعدة جاهزة! '+(host?'انسخ الكود وابعته لصاحبك':'دخلت القعدة. دورك بالأسود')); render()}catch(e){onlineInfo('تعذر الاتصال الأونلاين: '+e.message); message('تعذر الاتصال بالأونلاين')}}
window.createOnlineRoom=async()=>{const code='CHS-'+Math.random().toString(36).slice(2,8).toUpperCase(); try{await connectDB(); await db.ref('games/chess_'+code).set({createdAt:Date.now(),host:name,game:{fen:new Chess().fen(),updatedAt:Date.now()}}); await startOnline(code,true)}catch(e){onlineInfo('فشل إنشاء القعدة: '+e.message)}};
window.joinOnlineRoom=async()=>{const code=($('onlineCode')?.value||'').trim().toUpperCase(); if(!/^CHS-[A-Z0-9]{6}$/.test(code)){onlineInfo('الكود لازم يكون على شكل CHS-ABC123'); return} try{await connectDB(); const snap=await db.ref('games/chess_'+code).once('value'); if(!snap.exists()){onlineInfo('القعدة دي مش موجودة'); return} await startOnline(code,false)}catch(e){onlineInfo('تعذر الدخول: '+e.message)}};
window.addEventListener('load',()=>{muted=localStorage.getItem('ahwa-chess-muted')==='true'; difficulty=localStorage.getItem('ahwa-chess-difficulty')||'easy'; if($('difficulty'))$('difficulty').value=difficulty; if($('topProfileName'))$('topProfileName').textContent=name; document.body.classList.toggle('pieces-3d-mode',pieceTheme==='3d'); setTableSkin(tableTheme); render(); const q=new URLSearchParams(location.search).get('room'); if(q){openModal('onlineModal'); if($('onlineCode'))$('onlineCode').value=q; onlineInfo('اضغط دخول بالكود عشان تبدأ')}});
