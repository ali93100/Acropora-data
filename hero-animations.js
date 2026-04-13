/**
 * hero-animations.js
 * Unique canvas animations for each sub-page hero.
 * Each page-hero must have data-hero-anim="key"
 */
(function () {
  'use strict';

  const hero = document.querySelector('.page-hero[data-hero-anim]');
  if (!hero) return;

  const key = hero.dataset.heroAnim;

  /* ── Canvas setup ─────────────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.55;';
  hero.style.position = 'relative';
  hero.style.overflow = 'hidden';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, raf;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
    if (init[key]) init[key]();
  }
  window.addEventListener('resize', resize);

  /* ── Colour helpers ───────────────────────────────────── */
  const C = {
    teal:  '#81abb3',
    dark:  '#1a5d6a',
    light: 'rgba(129,171,179,',
    white: 'rgba(255,255,255,',
    coral: 'rgba(243,117,110,',
  };

  /* ═══════════════════════════════════════════════════════
     ANIMATION DEFINITIONS
  ═══════════════════════════════════════════════════════ */

  /* ── 1. MDM — flowing data network ───────────────────── */
  const mdm = (() => {
    let nodes, edges, packets;
    function setup() {
      nodes = Array.from({length: 18}, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
        r: 3 + Math.random()*3
      }));
      edges = [];
      for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        if (Math.sqrt(dx*dx+dy*dy)<W*0.25) edges.push({a:i,b:j});
      }
      packets = edges.slice(0,12).map(e=>({e,t:Math.random(),speed:0.003+Math.random()*0.004}));
    }
    function draw(ts) {
      ctx.clearRect(0,0,W,H);
      nodes.forEach(n=>{
        n.x+=n.vx; n.y+=n.vy;
        if(n.x<0||n.x>W) n.vx*=-1;
        if(n.y<0||n.y>H) n.vy*=-1;
      });
      edges.forEach(e=>{
        const a=nodes[e.a],b=nodes[e.b];
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        ctx.strokeStyle=`rgba(129,171,179,${0.6-d/(W*0.3)})`;
        ctx.lineWidth=0.8;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      });
      nodes.forEach(n=>{
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle=C.light+'0.9)'; ctx.fill();
        ctx.strokeStyle=C.light+'0.4)'; ctx.lineWidth=1; ctx.stroke();
      });
      packets.forEach(p=>{
        p.t+=p.speed; if(p.t>1)p.t=0;
        const a=nodes[p.e.a],b=nodes[p.e.b];
        const x=a.x+(b.x-a.x)*p.t, y=a.y+(b.y-a.y)*p.t;
        const g=ctx.createRadialGradient(x,y,0,x,y,8);
        g.addColorStop(0,C.light+'1)'); g.addColorStop(1,C.light+'0)');
        ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
      });
    }
    return {setup, draw};
  })();

  /* ── 2. Testing — matrix rain ─────────────────────────── */
  const testing = (() => {
    let cols, drops, chars;
    function setup() {
      chars = '01アイウエオカキクケコ∑∞≠∂∫ΩπΨΦ'.split('');
      const fs=14;
      cols = Math.floor(W/fs);
      drops = Array.from({length:cols},()=>Math.random()*-H/fs);
    }
    function draw() {
      ctx.fillStyle='rgba(13,61,71,0.08)'; ctx.fillRect(0,0,W,H);
      ctx.font='13px monospace';
      const fs=14;
      drops.forEach((d,i)=>{
        const c=chars[Math.floor(Math.random()*chars.length)];
        const bright=Math.random()>0.92;
        ctx.fillStyle=bright?'rgba(255,255,255,0.9)':'rgba(129,171,179,0.7)';
        ctx.fillText(c, i*fs, d*fs);
        if(d*fs>H && Math.random()>0.975) drops[i]=0;
        drops[i]+=0.6;
      });
    }
    return {setup, draw};
  })();

  /* ── 3. Test Strategy — hexagonal scan ───────────────── */
  const teststrategy = (() => {
    let t=0, hexes;
    function hexPts(cx,cy,r){
      return Array.from({length:6},(_,i)=>{
        const a=Math.PI/180*(60*i-30);
        return [cx+r*Math.cos(a), cy+r*Math.sin(a)];
      });
    }
    function setup(){
      hexes=[];
      const size=50, rows=Math.ceil(H/size/1.5)+2, cols=Math.ceil(W/size/1.73)+2;
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
        const cx=c*size*1.73+(r%2)*size*0.87, cy=r*size*1.5;
        hexes.push({cx,cy,r:size*0.9,phase:Math.random()*Math.PI*2});
      }
    }
    function draw(){
      t+=0.012;
      ctx.clearRect(0,0,W,H);
      hexes.forEach(h=>{
        const pulse=Math.sin(t+h.phase);
        const alpha=0.08+0.12*((pulse+1)/2);
        const pts=hexPts(h.cx,h.cy,h.r);
        ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
        pts.forEach(p=>ctx.lineTo(p[0],p[1])); ctx.closePath();
        ctx.strokeStyle=`rgba(129,171,179,${alpha+0.15})`; ctx.lineWidth=1; ctx.stroke();
        ctx.fillStyle=`rgba(129,171,179,${alpha*0.3})`; ctx.fill();
      });
      /* scanning line */
      const scanY=(Math.sin(t*0.5)+1)/2*H;
      const grad=ctx.createLinearGradient(0,scanY-40,0,scanY+40);
      grad.addColorStop(0,'rgba(129,171,179,0)');
      grad.addColorStop(0.5,'rgba(129,171,179,0.35)');
      grad.addColorStop(1,'rgba(129,171,179,0)');
      ctx.fillStyle=grad; ctx.fillRect(0,scanY-40,W,80);
    }
    return {setup,draw};
  })();

  /* ── 4. BI — rising chart bars ───────────────────────── */
  const bi = (() => {
    let bars, particles, t=0;
    function setup(){
      const n=Math.floor(W/60);
      bars=Array.from({length:n},(_,i)=>({
        x:30+i*(W/(n+1)), targetH:0.2+Math.random()*0.65,
        h:0, phase:i*0.3
      }));
      particles=[];
    }
    function draw(){
      t+=0.02;
      ctx.clearRect(0,0,W,H);
      bars.forEach(b=>{
        b.h+=(b.targetH-b.h)*0.04;
        if(Math.abs(b.h-b.targetH)<0.01&&Math.random()<0.02)
          b.targetH=0.2+Math.random()*0.65;
        const bh=b.h*H*0.65, by=H-bh-20, bw=28;
        const g=ctx.createLinearGradient(0,by,0,H);
        g.addColorStop(0,C.light+'0.9)');
        g.addColorStop(1,C.light+'0.2)');
        ctx.fillStyle=g; ctx.fillRect(b.x-bw/2,by,bw,bh);
        /* top glow */
        ctx.fillStyle=C.white+'0.9)';
        ctx.fillRect(b.x-bw/2,by,bw,2);
        /* spawn particle at top */
        if(Math.random()<0.04){
          particles.push({x:b.x,y:by,vx:(Math.random()-0.5)*1.5,vy:-1.5-Math.random(),a:1});
        }
      });
      particles=particles.filter(p=>{
        p.x+=p.vx; p.y+=p.vy; p.a-=0.025;
        ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a})`; ctx.fill();
        return p.a>0;
      });
    }
    return {setup,draw};
  })();

  /* ── 5. Overview — rotating wireframe globe ──────────── */
  const overview = (() => {
    let t=0, pts;
    function setup(){
      pts=[];
      for(let lat=-80;lat<=80;lat+=20)
        for(let lon=0;lon<360;lon+=15)
          pts.push({lat:lat*Math.PI/180, lon:lon*Math.PI/180});
    }
    function project(lat,lon,ry){
      const x=Math.cos(lat)*Math.sin(lon+ry);
      const y=Math.sin(lat);
      const z=Math.cos(lat)*Math.cos(lon+ry);
      const scale=350, cx=W/2, cy=H/2;
      return {x:cx+x*scale, y:cy-y*scale*0.9, z};
    }
    function draw(){
      t+=0.005;
      ctx.clearRect(0,0,W,H);
      /* latitude rings */
      for(let lat=-80;lat<=80;lat+=20){
        const la=lat*Math.PI/180;
        ctx.beginPath();
        let first=true;
        for(let lon=0;lon<=360;lon+=5){
          const {x,y,z}=project(la,lon*Math.PI/180,t);
          if(z<0){first=true;continue;}
          first?ctx.moveTo(x,y):ctx.lineTo(x,y); first=false;
        }
        ctx.strokeStyle='rgba(129,171,179,0.25)'; ctx.lineWidth=0.8; ctx.stroke();
      }
      /* longitude arcs */
      for(let lon=0;lon<360;lon+=30){
        ctx.beginPath(); let first=true;
        for(let lat=-90;lat<=90;lat+=5){
          const {x,y,z}=project(lat*Math.PI/180,(lon*Math.PI/180),t);
          if(z<0){first=true;continue;}
          first?ctx.moveTo(x,y):ctx.lineTo(x,y); first=false;
        }
        ctx.strokeStyle='rgba(129,171,179,0.2)'; ctx.lineWidth=0.8; ctx.stroke();
      }
      /* glowing dots */
      pts.forEach(p=>{
        const {x,y,z}=project(p.lat,p.lon,t);
        if(z<0.1) return;
        ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(129,171,179,${z*0.9})`; ctx.fill();
      });
    }
    return {setup,draw};
  })();

  /* ── 6. Data Approach — ripple methodology ───────────── */
  const dataapproach = (() => {
    let ripples=[], t=0;
    function setup(){
      ripples=[
        {x:W*0.5, y:H*0.5, phase:0, speed:0.015, color:'129,171,179'},
        {x:W*0.25, y:H*0.4, phase:2, speed:0.012, color:'255,255,255'},
        {x:W*0.75, y:H*0.6, phase:4, speed:0.018, color:'129,171,179'},
      ];
    }
    function draw(){
      t+=0.016;
      ctx.clearRect(0,0,W,H);
      ripples.forEach(r=>{
        for(let i=0;i<6;i++){
          const radius=((t*60*r.speed+i*55)%330)+10;
          const alpha=Math.max(0, 0.35-radius/400);
          ctx.beginPath(); ctx.arc(r.x,r.y,radius,0,Math.PI*2);
          ctx.strokeStyle=`rgba(${r.color},${alpha})`; ctx.lineWidth=1.5; ctx.stroke();
        }
      });
    }
    return {setup,draw};
  })();

  /* ── 7. Team — constellation ─────────────────────────── */
  const team = (() => {
    let stars, t=0;
    function setup(){
      stars=Array.from({length:60},()=>({
        x:Math.random()*W, y:Math.random()*H,
        r:0.5+Math.random()*2, phase:Math.random()*Math.PI*2,
        vx:(Math.random()-0.5)*0.2, vy:(Math.random()-0.5)*0.2
      }));
    }
    function draw(){
      t+=0.01;
      ctx.clearRect(0,0,W,H);
      /* connections */
      for(let i=0;i<stars.length;i++){
        stars[i].x+=stars[i].vx; stars[i].y+=stars[i].vy;
        if(stars[i].x<0||stars[i].x>W) stars[i].vx*=-1;
        if(stars[i].y<0||stars[i].y>H) stars[i].vy*=-1;
        for(let j=i+1;j<stars.length;j++){
          const d=Math.hypot(stars[i].x-stars[j].x,stars[i].y-stars[j].y);
          if(d<120){
            ctx.strokeStyle=`rgba(129,171,179,${0.5*(1-d/120)})`;
            ctx.lineWidth=0.6; ctx.beginPath();
            ctx.moveTo(stars[i].x,stars[i].y); ctx.lineTo(stars[j].x,stars[j].y); ctx.stroke();
          }
        }
      }
      /* stars */
      stars.forEach(s=>{
        const pulse=0.5+0.5*Math.sin(t+s.phase);
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r*(0.8+0.4*pulse),0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${0.5+0.5*pulse})`; ctx.fill();
      });
    }
    return {setup,draw};
  })();

  /* ── 8. Ethics — sacred geometry mandala ─────────────── */
  const ethics = (() => {
    let t=0;
    function drawPoly(cx,cy,r,n,rot,alpha){
      ctx.beginPath();
      for(let i=0;i<=n;i++){
        const a=rot+i*(Math.PI*2/n);
        i===0?ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
      }
      ctx.strokeStyle=`rgba(129,171,179,${alpha})`; ctx.lineWidth=0.8; ctx.stroke();
    }
    function setup(){}
    function draw(){
      t+=0.004;
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2;
      [1,2,3].forEach(ring=>{
        const r=ring*65;
        for(let i=3;i<=8;i++){
          drawPoly(cx,cy,r,i,t*(ring%2?1:-1)*0.7,0.08+0.04*ring);
        }
        /* spoke lines */
        for(let i=0;i<12;i++){
          const a=t+i*(Math.PI/6);
          ctx.beginPath(); ctx.moveTo(cx,cy);
          ctx.lineTo(cx+r*Math.cos(a), cy+r*Math.sin(a));
          ctx.strokeStyle='rgba(129,171,179,0.06)'; ctx.lineWidth=0.5; ctx.stroke();
        }
      });
      /* center dot */
      ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2);
      ctx.fillStyle='rgba(129,171,179,0.8)'; ctx.fill();
    }
    return {setup,draw};
  })();

  /* ── 9. Scoping — blueprint grid ─────────────────────── */
  const scoping = (() => {
    let nodes=[], t=0;
    function setup(){
      const gs=55;
      for(let x=gs;x<W;x+=gs) for(let y=gs;y<H;y+=gs){
        if(Math.random()<0.2) nodes.push({x,y,r:0,maxR:3+Math.random()*3,phase:Math.random()*Math.PI*2,born:t+Math.random()*4});
      }
    }
    function draw(){
      t+=0.015;
      ctx.clearRect(0,0,W,H);
      /* grid */
      const gs=55;
      ctx.strokeStyle='rgba(129,171,179,0.12)'; ctx.lineWidth=0.5;
      for(let x=0;x<W;x+=gs){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for(let y=0;y<H;y+=gs){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      /* animated nodes */
      nodes.forEach(n=>{
        if(t<n.born) return;
        n.r=Math.min(n.maxR,(n.r||0)+0.06);
        const pulse=0.6+0.4*Math.sin(t*2+n.phase);
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(129,171,179,${pulse*0.9})`; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*pulse+4,0,Math.PI*2);
        ctx.strokeStyle=`rgba(129,171,179,${pulse*0.25})`; ctx.lineWidth=1; ctx.stroke();
      });
    }
    return {setup,draw};
  })();

  /* ── 10. AI — neural network firing ──────────────────── */
  const ai = (() => {
    let layers, signals=[], t=0;
    function setup(){
      layers=[];
      const counts=[3,5,5,3];
      counts.forEach((c,li)=>{
        const layer=[];
        for(let i=0;i<c;i++){
          layer.push({
            x: W*0.15 + li*(W*0.7/3),
            y: H/2 + (i-(c-1)/2)*70,
            fired:false, glow:0
          });
        }
        layers.push(layer);
      });
    }
    function fire(){
      const li=Math.floor(Math.random()*layers.length);
      const ni=Math.floor(Math.random()*layers[li].length);
      const node=layers[li][ni];
      node.glow=1;
      if(li<layers.length-1){
        layers[li+1].forEach(n=>{
          signals.push({x:node.x,y:node.y,tx:n.tx||n.x,ty:n.ty||n.y,nx:n.x,ny:n.y,t:0,speed:0.03});
        });
      }
    }
    function draw(){
      t+=0.016;
      ctx.clearRect(0,0,W,H);
      if(Math.random()<0.03) fire();
      /* connections */
      for(let li=0;li<layers.length-1;li++){
        layers[li].forEach(a=>layers[li+1].forEach(b=>{
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle='rgba(129,171,179,0.12)'; ctx.lineWidth=0.8; ctx.stroke();
        }));
      }
      /* signals */
      signals=signals.filter(s=>{
        s.t+=s.speed;
        const x=s.x+(s.nx-s.x)*s.t, y=s.y+(s.ny-s.y)*s.t;
        const g=ctx.createRadialGradient(x,y,0,x,y,6);
        g.addColorStop(0,'rgba(129,171,179,1)'); g.addColorStop(1,'rgba(129,171,179,0)');
        ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
        if(s.t>=1){ const ni=layers.flat().find(n=>n.x===s.nx&&n.y===s.ny); if(ni)ni.glow=1; }
        return s.t<1;
      });
      /* nodes */
      layers.flat().forEach(n=>{
        n.glow*=0.95;
        ctx.beginPath(); ctx.arc(n.x,n.y,10,0,Math.PI*2);
        ctx.fillStyle=`rgba(26,93,106,${0.8+n.glow*0.2})`; ctx.fill();
        ctx.strokeStyle=`rgba(129,171,179,${0.4+n.glow*0.6})`; ctx.lineWidth=1.5; ctx.stroke();
        if(n.glow>0.1){
          ctx.beginPath(); ctx.arc(n.x,n.y,16,0,Math.PI*2);
          ctx.strokeStyle=`rgba(129,171,179,${n.glow*0.5})`; ctx.lineWidth=1; ctx.stroke();
        }
      });
    }
    return {setup,draw};
  })();

  /* ── 11. Custom Solutions — morphing blob ─────────────── */
  const custom = (() => {
    let t=0;
    function blob(cx,cy,r,pts,speed,t){
      ctx.beginPath();
      for(let i=0;i<=pts;i++){
        const a=i*(Math.PI*2/pts);
        const noise=Math.sin(a*3+t*speed)*0.18+Math.sin(a*5+t*speed*1.3)*0.1;
        const pr=r*(1+noise);
        i===0?ctx.moveTo(cx+pr*Math.cos(a),cy+pr*Math.sin(a)):ctx.lineTo(cx+pr*Math.cos(a),cy+pr*Math.sin(a));
      }
      ctx.closePath();
    }
    function setup(){}
    function draw(){
      t+=0.012;
      ctx.clearRect(0,0,W,H);
      [[W/2,H/2,160,1],[W*0.3,H*0.5,90,1.5],[W*0.7,H*0.5,90,0.8]].forEach(([cx,cy,r,sp],i)=>{
        blob(cx,cy,r,80,sp,t+i*1.2);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.3);
        g.addColorStop(0,`rgba(129,171,179,${0.15-i*0.03})`);
        g.addColorStop(1,'rgba(129,171,179,0)');
        ctx.fillStyle=g; ctx.fill();
        ctx.strokeStyle=`rgba(129,171,179,${0.3-i*0.05})`; ctx.lineWidth=1; ctx.stroke();
      });
    }
    return {setup,draw};
  })();

  /* ── 12. Careers — warp speed starfield ──────────────── */
  const careers = (() => {
    let stars;
    function setup(){
      stars=Array.from({length:200},()=>({
        x:(Math.random()-0.5)*W*3, y:(Math.random()-0.5)*H*3,
        z:Math.random()*W, pz:0
      }));
    }
    function draw(){
      ctx.fillStyle='rgba(13,61,71,0.25)'; ctx.fillRect(0,0,W,H);
      const cx=W/2, cy=H/2;
      stars.forEach(s=>{
        s.pz=s.z; s.z-=4;
        if(s.z<=0){ s.x=(Math.random()-0.5)*W*3; s.y=(Math.random()-0.5)*H*3; s.z=W; s.pz=W; }
        const sx=cx+(s.x/s.z)*W*0.5, sy=cy+(s.y/s.z)*H*0.5;
        const px=cx+(s.x/s.pz)*W*0.5, py=cy+(s.y/s.pz)*H*0.5;
        const alpha=Math.min(1,(1-s.z/W)*1.5);
        ctx.strokeStyle=`rgba(129,171,179,${alpha})`;
        ctx.lineWidth=Math.max(0.5,1.5*(1-s.z/W));
        ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(sx,sy); ctx.stroke();
      });
    }
    return {setup,draw};
  })();

  /* ── 13. Contact — radar sweep ───────────────────────── */
  const contact = (() => {
    let angle=0, pings=[];
    function setup(){}
    function draw(){
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2, maxR=Math.min(W,H)*0.48;
      /* rings */
      for(let r=maxR/4;r<=maxR;r+=maxR/4){
        ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.strokeStyle='rgba(129,171,179,0.15)'; ctx.lineWidth=1; ctx.stroke();
      }
      /* crosshair */
      ctx.strokeStyle='rgba(129,171,179,0.1)'; ctx.lineWidth=0.8;
      ctx.beginPath(); ctx.moveTo(cx-maxR,cy); ctx.lineTo(cx+maxR,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-maxR); ctx.lineTo(cx,cy+maxR); ctx.stroke();
      /* sweep */
      angle+=0.022;
      const grad=ctx.createConicalGradient?undefined:null;
      for(let i=0;i<30;i++){
        const a=angle-i*0.04;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,maxR,a,a+0.04);
        ctx.fillStyle=`rgba(129,171,179,${(30-i)/30*0.18})`; ctx.fill();
      }
      /* sweep line */
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.lineTo(cx+maxR*Math.cos(angle), cy+maxR*Math.sin(angle));
      ctx.strokeStyle='rgba(129,171,179,0.7)'; ctx.lineWidth=1.5; ctx.stroke();
      /* random pings */
      if(Math.random()<0.015){
        const a=Math.random()*Math.PI*2, r=Math.random()*maxR*0.85;
        pings.push({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a),a:1});
      }
      pings=pings.filter(p=>{
        p.a-=0.02;
        ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2);
        ctx.fillStyle=`rgba(129,171,179,${p.a})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x,p.y,8,0,Math.PI*2);
        ctx.strokeStyle=`rgba(129,171,179,${p.a*0.5})`; ctx.lineWidth=1; ctx.stroke();
        return p.a>0;
      });
    }
    return {setup,draw};
  })();

  /* ── 14. Tech Partners — orbit system ────────────────── */
  const techpartners = (() => {
    let orbits, t=0;
    function setup(){
      orbits=[
        {r:70, speed:0.025, count:3, phase:0},
        {r:130, speed:0.015, count:5, phase:1},
        {r:190, speed:0.009, count:7, phase:2},
      ];
    }
    function draw(){
      t+=0.016;
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2;
      /* center hub */
      ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2);
      ctx.fillStyle='rgba(26,93,106,0.8)'; ctx.fill();
      ctx.strokeStyle='rgba(129,171,179,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy,28,0,Math.PI*2);
      ctx.strokeStyle='rgba(129,171,179,0.15)'; ctx.lineWidth=1; ctx.stroke();
      orbits.forEach(o=>{
        /* orbit ring */
        ctx.beginPath(); ctx.arc(cx,cy,o.r,0,Math.PI*2);
        ctx.strokeStyle='rgba(129,171,179,0.12)'; ctx.lineWidth=0.8; ctx.stroke();
        for(let i=0;i<o.count;i++){
          const a=o.phase+i*(Math.PI*2/o.count)+t*o.speed;
          const x=cx+o.r*Math.cos(a), y=cy+o.r*Math.sin(a);
          /* connector */
          ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y);
          ctx.strokeStyle='rgba(129,171,179,0.06)'; ctx.lineWidth=0.5; ctx.stroke();
          /* node */
          ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
          ctx.fillStyle='rgba(129,171,179,0.9)'; ctx.fill();
          ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1; ctx.stroke();
        }
      });
    }
    return {setup,draw};
  })();

  /* ── 15. Biz Partners — growing web ──────────────────── */
  const bizpartners = (() => {
    let nodes=[], t=0, maxN=25;
    function addNode(){
      const angle=Math.random()*Math.PI*2, r=Math.random()*Math.min(W,H)*0.4;
      nodes.push({x:W/2+r*Math.cos(angle), y:H/2+r*Math.sin(angle), born:t, a:0});
    }
    function setup(){ for(let i=0;i<10;i++) addNode(); }
    function draw(){
      t+=0.015;
      ctx.clearRect(0,0,W,H);
      if(nodes.length<maxN && Math.random()<0.02) addNode();
      nodes.forEach(n=>{ n.a=Math.min(1,n.a+0.02); });
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const d=Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y);
        if(d<W*0.28){
          const alpha=Math.min(nodes[i].a,nodes[j].a)*(0.45-d/(W*0.7));
          ctx.strokeStyle=`rgba(129,171,179,${alpha})`; ctx.lineWidth=0.7;
          ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
        }
      }
      nodes.forEach(n=>{
        ctx.beginPath(); ctx.arc(n.x,n.y,4,0,Math.PI*2);
        ctx.fillStyle=`rgba(129,171,179,${n.a*0.9})`; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x,n.y,9,0,Math.PI*2);
        ctx.strokeStyle=`rgba(129,171,179,${n.a*0.2})`; ctx.lineWidth=1; ctx.stroke();
      });
    }
    return {setup,draw};
  })();

  /* ── 16. Become Partner — DNA helix ──────────────────── */
  const becomepartner = (() => {
    let t=0;
    function setup(){}
    function draw(){
      t+=0.025;
      ctx.clearRect(0,0,W,H);
      const cx=W/2, amp=H*0.25, freq=0.04;
      /* strand 1 */
      for(let y=0;y<H;y+=4){
        const x1=cx+amp*Math.cos(freq*y+t);
        const x2=cx+amp*Math.cos(freq*y+t+Math.PI);
        const phase=(y/H+t*0.1)%1;
        const alpha=0.4+0.3*Math.sin(freq*y+t);
        ctx.beginPath(); ctx.arc(x1,y,3,0,Math.PI*2);
        ctx.fillStyle=`rgba(129,171,179,${alpha})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x2,y,3,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${alpha*0.6})`; ctx.fill();
        /* rungs every 30px */
        if(y%30===0){
          ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y);
          const bright=Math.sin(freq*y*2+t)>0.5;
          ctx.strokeStyle=bright?'rgba(129,171,179,0.5)':'rgba(255,255,255,0.2)';
          ctx.lineWidth=1.5; ctx.stroke();
        }
      }
    }
    return {setup,draw};
  })();

  /* ── 17. Blog — floating text fragments ──────────────── */
  const blog = (() => {
    let particles=[], t=0;
    const words=['DATA','MDM','API','SQL','AI','ETL','KPI','BI','IoT','CDP'];
    function setup(){
      particles=Array.from({length:20},()=>({
        x:Math.random()*W, y:Math.random()*H,
        word:words[Math.floor(Math.random()*words.length)],
        vy:-0.3-Math.random()*0.4, alpha:Math.random()*0.4+0.1,
        size:10+Math.floor(Math.random()*14)
      }));
    }
    function draw(){
      t+=0.01;
      ctx.clearRect(0,0,W,H);
      /* grid lines */
      ctx.strokeStyle='rgba(129,171,179,0.06)'; ctx.lineWidth=0.5;
      for(let x=0;x<W;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for(let y=0;y<H;y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      particles.forEach(p=>{
        p.y+=p.vy; if(p.y<-20){ p.y=H+20; p.x=Math.random()*W; }
        ctx.font=`700 ${p.size}px Montserrat,sans-serif`;
        ctx.fillStyle=`rgba(129,171,179,${p.alpha})`; ctx.fillText(p.word,p.x,p.y);
      });
    }
    return {setup,draw};
  })();

  /* ── 18. News/Actualites — pulse broadcast ───────────── */
  const news = (() => {
    let waves=[], t=0;
    function setup(){}
    function draw(){
      t+=0.02;
      ctx.clearRect(0,0,W,H);
      if(Math.random()<0.04) waves.push({r:5,a:0.8,cx:W/2+(Math.random()-0.5)*W*0.3,cy:H/2+(Math.random()-0.5)*H*0.3});
      waves=waves.filter(w=>{
        w.r+=2.5; w.a-=0.012;
        ctx.beginPath(); ctx.arc(w.cx,w.cy,w.r,0,Math.PI*2);
        ctx.strokeStyle=`rgba(129,171,179,${w.a})`; ctx.lineWidth=1.5; ctx.stroke();
        return w.a>0;
      });
      /* horizontal scan line */
      const sy=((t*30)%H);
      ctx.fillStyle='rgba(129,171,179,0.05)'; ctx.fillRect(0,sy-1,W,2);
    }
    return {setup,draw};
  })();

  /* ── 19. Academy — atomic orbitals ───────────────────── */
  const academy = (() => {
    let t=0, electrons;
    function setup(){
      electrons=[
        {r:70, speed:0.04, a:0, tilt:0},
        {r:110, speed:0.025, a:2, tilt:Math.PI/3},
        {r:150, speed:0.016, a:4, tilt:Math.PI*2/3},
      ];
    }
    function draw(){
      t+=0.016;
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2;
      /* nucleus */
      ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2);
      ctx.fillStyle='rgba(129,171,179,0.8)'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,20,0,Math.PI*2);
      ctx.strokeStyle='rgba(129,171,179,0.2)'; ctx.lineWidth=1; ctx.stroke();
      electrons.forEach(e=>{
        e.a+=e.speed;
        /* ellipse orbit */
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(e.tilt);
        ctx.beginPath(); ctx.ellipse(0,0,e.r,e.r*0.38,0,0,Math.PI*2);
        ctx.strokeStyle='rgba(129,171,179,0.18)'; ctx.lineWidth=1; ctx.stroke();
        /* electron */
        const ex=e.r*Math.cos(e.a), ey=e.r*0.38*Math.sin(e.a);
        ctx.beginPath(); ctx.arc(ex,ey,5,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fill();
        const g=ctx.createRadialGradient(ex,ey,0,ex,ey,12);
        g.addColorStop(0,'rgba(129,171,179,0.5)'); g.addColorStop(1,'rgba(129,171,179,0)');
        ctx.beginPath(); ctx.arc(ex,ey,12,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
        ctx.restore();
      });
    }
    return {setup,draw};
  })();

  /* ── 20. Case Studies — data transformation ──────────── */
  const casestudies = (() => {
    let dots=[], t=0;
    function setup(){
      dots=Array.from({length:60},(_,i)=>({
        startX:Math.random()*W, startY:Math.random()*H,
        endX: 80+((i%8)*((W-160)/7)), endY: 80+(Math.floor(i/8)*((H-160)/7)),
        x:0,y:0,phase:Math.random()*Math.PI*2
      }));
      dots.forEach(d=>{d.x=d.startX;d.y=d.startY;});
    }
    function draw(){
      t+=0.008;
      ctx.clearRect(0,0,W,H);
      const progress=(Math.sin(t)*0.5+0.5);
      dots.forEach(d=>{
        d.x=d.startX+(d.endX-d.startX)*progress;
        d.y=d.startY+(d.endY-d.startY)*progress;
        ctx.beginPath(); ctx.arc(d.x,d.y,2.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(129,171,179,${0.4+0.5*progress})`; ctx.fill();
      });
    }
    return {setup,draw};
  })();

  /* ── 21. About / Qui sommes nous — heartbeat ─────────── */
  const about = (() => {
    let t=0, pulses=[];
    function setup(){}
    function draw(){
      t+=0.018;
      ctx.clearRect(0,0,W,H);
      /* EKG-like wave */
      ctx.beginPath();
      for(let x=0;x<=W;x+=2){
        const p=x/W;
        let y=H/2;
        const wave=Math.sin(p*Math.PI*6-t*3);
        if(Math.abs(Math.sin(p*Math.PI*6-t*3+0.5))<0.15){
          y=H/2+wave*H*0.35;
        } else {
          y=H/2+wave*H*0.04;
        }
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba(129,171,179,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
      /* second faint wave */
      ctx.beginPath();
      for(let x=0;x<=W;x+=2){
        const p=x/W;
        const y=H/2+Math.sin(p*Math.PI*4-t*2)*H*0.06;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba(129,171,179,0.15)'; ctx.lineWidth=1; ctx.stroke();
    }
    return {setup,draw};
  })();

  /* ── 22. Solutions — geometric kaleidoscope ──────────── */
  const solutions = (() => {
    let t=0;
    function setup(){}
    function draw(){
      t+=0.008;
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2, slices=6;
      for(let s=0;s<slices;s++){
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(s*(Math.PI*2/slices)+t);
        for(let r=40;r<Math.min(W,H)*0.5;r+=45){
          const sides=3+Math.floor(r/45);
          ctx.beginPath();
          for(let i=0;i<=sides;i++){
            const a=i*(Math.PI*2/sides)+t*0.5;
            i===0?ctx.moveTo(r*Math.cos(a),r*Math.sin(a)):ctx.lineTo(r*Math.cos(a),r*Math.sin(a));
          }
          ctx.strokeStyle=`rgba(129,171,179,${0.18-r/1200})`; ctx.lineWidth=0.8; ctx.stroke();
        }
        ctx.restore();
      }
    }
    return {setup,draw};
  })();

  /* ═══════════════════════════════════════════════════════
     DISPATCH TABLE
  ═══════════════════════════════════════════════════════ */
  const animations = {
    'mdm':            mdm,
    'testing':        testing,
    'test-strategy':  teststrategy,
    'bi':             bi,
    'overview':       overview,
    'data-approach':  dataapproach,
    'team':           team,
    'ethics':         ethics,
    'scoping':        scoping,
    'ai':             ai,
    'custom':         custom,
    'careers':        careers,
    'contact':        contact,
    'tech-partners':  techpartners,
    'biz-partners':   bizpartners,
    'become-partner': becomepartner,
    'blog':           blog,
    'news':           news,
    'academy':        academy,
    'casestudies':    casestudies,
    'about':          about,
    'solutions':      solutions,
  };

  const anim = animations[key];
  if (!anim) return;

  const init = {};
  Object.keys(animations).forEach(k => { init[k] = animations[k].setup; });

  function loop() {
    anim.draw();
    raf = requestAnimationFrame(loop);
  }

  resize();
  loop();
})();
