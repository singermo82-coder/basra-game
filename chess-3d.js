import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// Real WebGL meshes. All moves continue to be validated by the main chess.js engine.
export function createChess3D({mount,onSquare}) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#15272b');
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);
  camera.position.set(9.2,13.5,13.6);camera.lookAt(0,.05,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.45;
  renderer.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:manipulation;cursor:pointer';
  renderer.domElement.setAttribute('aria-label','رقعة شطرنج ثلاثية الأبعاد: اضغط على القطعة ثم المربع');
  mount.appendChild(renderer.domElement);
  const hemi=new THREE.HemisphereLight(0xffefcd,0x314349,2.6);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,3.0);key.position.set(-4,12,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-12;key.shadow.camera.right=12;key.shadow.camera.top=12;key.shadow.camera.bottom=-12;scene.add(key);
  const rim=new THREE.DirectionalLight(0xe9ba77,1.35);rim.position.set(9,8,-8);scene.add(rim);
  const board=new THREE.Group();scene.add(board);
  const wood=new THREE.MeshStandardMaterial({color:0x6c3d1f,roughness:.53,metalness:.12});
  const trim=new THREE.MeshStandardMaterial({color:0xe2af58,roughness:.29,metalness:.7});
  const darkMat=new THREE.MeshStandardMaterial({color:0x526d73,roughness:.47});
  const lightMat=new THREE.MeshStandardMaterial({color:0xe3d3b4,roughness:.54});
  function slab(w,h,d,y,material){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.y=y;m.receiveShadow=true;m.castShadow=true;board.add(m);return m}
  slab(9,.33,9,-.22,wood);slab(8.56,.065,8.56,-.02,trim);
  const squares=[];
  for(let row=0;row<8;row++)for(let col=0;col<8;col++){
    const sq=new THREE.Mesh(new THREE.BoxGeometry(.997,.045,.997),(row+col)%2?darkMat:lightMat);
    sq.position.set(col-3.5,.038,row-3.5);sq.receiveShadow=true;sq.userData.square='abcdefgh'[col]+(8-row);
    board.add(sq);squares.push(sq);
  }
  const pieces=new THREE.Group();board.add(pieces);
  const ivory=new THREE.MeshPhysicalMaterial({color:0xffeed2,roughness:.22,metalness:.05,clearcoat:.7,clearcoatRoughness:.22});
  const black=new THREE.MeshPhysicalMaterial({color:0x24252a,roughness:.23,metalness:.16,clearcoat:.9,clearcoatRoughness:.18});
  const ivoryAccent=new THREE.MeshStandardMaterial({color:0xd3b687,metalness:.44,roughness:.29});
  const blackAccent=new THREE.MeshStandardMaterial({color:0xcba66d,metalness:.58,roughness:.29});
  function lathe(profile,material){const mesh=new THREE.Mesh(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),26),material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh}
  function sphere(rad,y,material,x=0,z=0){const mesh=new THREE.Mesh(new THREE.SphereGeometry(rad,20,12),material);mesh.position.set(x,y,z);mesh.castShadow=true;return mesh}
  function cylinder(top,bottom,height,y,material,sides=32){const m=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,height,sides),material);m.position.y=y;m.castShadow=true;return m}
  function createPiece(type,color){
    const group=new THREE.Group(),mat=color==='w'?ivory:black,accent=color==='w'?ivoryAccent:blackAccent;
    const base=[[0,0],[.34,0],[.37,.052],[.35,.095],[.295,.13],[.26,.16],[.255,.20],[.21,.26]];
    group.add(lathe(base,mat));
    const tall=t=>[[.20,.26],[.23,.33],[.17,.38],[.16,t-.17],[.22,t-.14],[.235,t-.09],[.18,t-.05],[0,t-.05]];
    if(type==='p'){group.add(lathe([[.21,.26],[.18,.32],[.135,.40],[.15,.48],[.17,.52],[0,.52]],mat));group.add(sphere(.20,.68,mat));}
    if(type==='r'){group.add(lathe(tall(.90),mat));group.add(cylinder(.27,.26,.13,.87,mat));for(let i=0;i<6;i++){const a=i*Math.PI/3;const block=new THREE.Mesh(new THREE.BoxGeometry(.15,.16,.15),mat);block.position.set(Math.cos(a)*.21,.998,Math.sin(a)*.21);block.castShadow=true;group.add(block)}}
    if(type==='n'){
      group.add(lathe([[.21,.26],[.20,.35],[.14,.41],[0,.41]],mat));
      const s=new THREE.Shape();s.moveTo(-.19,.38);s.lineTo(-.14,.82);s.lineTo(-.01,1.04);s.lineTo(.18,.98);s.lineTo(.23,.80);s.lineTo(.10,.75);s.lineTo(.25,.60);s.lineTo(.17,.49);s.lineTo(.15,.38);s.closePath();
      const g=new THREE.ExtrudeGeometry(s,{depth:.23,bevelEnabled:true,bevelThickness:.055,bevelSize:.04,bevelSegments:3});
      const m=new THREE.Mesh(g,mat);m.rotation.y=Math.PI/2;m.position.z=-.09;m.castShadow=true;group.add(m);
      group.add(sphere(.045,.80,accent,.09,.19));
    }
    if(type==='b'){group.add(lathe(tall(1.0),mat));group.add(sphere(.22,.97,mat));group.add(sphere(.06,1.21,accent));}
    if(type==='q'){group.add(lathe(tall(1.10),mat));group.add(cylinder(.27,.17,.15,1.06,mat));for(let i=0;i<6;i++){const a=i*Math.PI/3;group.add(sphere(.071,1.19,accent,Math.cos(a)*.22,Math.sin(a)*.22))}group.add(sphere(.11,1.15,mat));}
    if(type==='k'){group.add(lathe(tall(1.17),mat));group.add(cylinder(.25,.18,.11,1.15,mat));const v=new THREE.Mesh(new THREE.BoxGeometry(.11,.36,.12),accent);v.position.y=1.38;v.castShadow=true;group.add(v);const h=new THREE.Mesh(new THREE.BoxGeometry(.29,.11,.12),accent);h.position.y=1.44;h.castShadow=true;group.add(h);}
    group.scale.setScalar(.91);return group;
  }
  let flipped=false,lastFen='',selection=null,targetSquares=new Set();
  function clear(){while(pieces.children.length){const child=pieces.children[0];pieces.remove(child);child.traverse(o=>{if(o.geometry)o.geometry.dispose()})}}
  function update(chess,{selected,targets=[],flip=false}={}){
    flipped=flip;selection=selected||null;targetSquares=new Set(targets);
    clear();for(let row=0;row<8;row++)for(let col=0;col<8;col++){
      const id='abcdefgh'[col]+(8-row),p=chess.get(id);if(!p)continue;
      const mesh=createPiece(p.type,p.color);mesh.position.set(col-3.5,.065,row-3.5);pieces.add(mesh);
    }
    for(const sq of squares){const active=sq.userData.square===selection;const target=targetSquares.has(sq.userData.square);const mat=sq.material;
      const col=sq.userData.square.charCodeAt(0)-97,row=8-Number(sq.userData.square[1]);sq.material=active?selectedMat:target?targetMat:(row+col)%2?darkMat:lightMat;
    }
    board.rotation.y=flipped?Math.PI:0;
  }
  function setTheme(theme){
    const schemes={walnut:[0xead0a5,0x936338,0x63371d,0xaa7842],marble:[0xf9f7ee,0x858e9d,0xc9c6be,0xe1dfd6],royal:[0xeee5d1,0x285b87,0x204b75,0xd7af59],emerald:[0xe8e4cc,0x347d5b,0x1e5846,0xbb984f],noir:[0xbdb7a8,0x3a3d43,0x202124,0x77736c]};
    const c=schemes[theme]||schemes.walnut;lightMat.color.setHex(c[0]);darkMat.color.setHex(c[1]);wood.color.setHex(c[2]);trim.color.setHex(c[3]);scene.background.setHex(c[2]);
  }
  const selectedMat=new THREE.MeshStandardMaterial({color:0xf7d156,roughness:.47});
  const targetMat=new THREE.MeshStandardMaterial({color:0x5fbb77,roughness:.47});
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function click(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(squares,false);if(hits.length)onSquare(hits[0].object.userData.square)}
  renderer.domElement.addEventListener('pointerup',click);
  let active=true,raf=0,observer=new ResizeObserver(resize);observer.observe(mount);
  function resize(){if(!active)return;const w=mount.clientWidth,h=mount.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}}
  function animate(){if(!active)return;raf=requestAnimationFrame(animate);renderer.render(scene,camera)}resize();animate();
  function dispose(){active=false;cancelAnimationFrame(raf);observer.disconnect();renderer.domElement.removeEventListener('pointerup',click);clear();renderer.dispose();renderer.domElement.remove()}
  return {update,dispose,setTheme};
}
