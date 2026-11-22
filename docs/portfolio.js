const canvas = document.querySelector("#core");
const ctx = canvas.getContext("2d");
const stage = canvas.parentElement;
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const sections = [...document.querySelectorAll("main > section")];
const labels = ["Connected systems","Separate the components","Trace the relationships","Focus on the evidence","Review the timeline","Investigate an event","Connected systems"];
const caption = document.querySelector("#core-state");
const signs = [-1, 1];
const vertices = [];
for (const x of signs) for (const y of signs) for (const z of signs) vertices.push([x,y,z]);
const edges = vertices.flatMap((a,i) => vertices.slice(i+1).flatMap((b,j) =>
  a.filter((v,k) => v !== b[k]).length === 1 ? [[i,i+j+1]] : []));
let sectionIndex=0, pointerX=0, pointerY=0, spread=0, visible=true, raf=0;
let width=0, height=0;
function draw(time) {
  raf=0;
  if (!ctx || !width || !height) return;
  ctx.clearRect(0,0,width,height);
  const target = [0,.34,.22,.13,.16,.28,0][sectionIndex];
  spread += (target-spread)*(motion.matches ? 1 : .09);
  const angle = .52 + (motion.matches ? 0 : time * .00025 + pointerX * .43);
  const tilt = -.45 + (motion.matches ? 0 : pointerY * .34);
  const scale=Math.min(width,height)*.169;
  function project([x,y,z]) {
    const px=x*Math.cos(angle)+z*Math.sin(angle);
    const depth=z*Math.cos(angle)-x*Math.sin(angle);
    const py=y*Math.cos(tilt)-depth*Math.sin(tilt);
    const pz=y*Math.sin(tilt)+depth*Math.cos(tilt);
    const s=5/(5-pz);
    return [width/2+px*scale*s,height/2+py*scale*s,pz];
  }
  function path(points,stroke,thickness) {
    ctx.beginPath();
    points.forEach(([x,y],i)=> i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.strokeStyle=stroke;
    ctx.lineWidth=thickness;
    ctx.stroke();
  }
  const hues=["#8b8cff90","#b7ff657e","#ebeeff65"];
  for(let axis=0;axis<3;axis++){
    const ring=[];
    for(let i=0;i<=96;i++){
      const theta=i*Math.PI/48;
      const v=[1.84*Math.cos(theta),1.84*Math.sin(theta),.04];
      ring.push(project(v.slice(axis).concat(v.slice(0,axis)).map(n=>n*(1+spread))));
    }
    path(ring,hues[axis],1.35);
  }
  const faces=[[0,1,3,2],[4,5,7,6],[0,4,6,2],[1,5,7,3],[0,4,5,1],[2,6,7,3]];
  const points=vertices.map(v=>project(v.map(n=>n*(1+spread))));
  const panels=faces.map(face=>face.map(i=>points[i]));
  panels.sort((a,b)=>a.reduce((sum,p)=>sum+p[2],0)-b.reduce((sum,p)=>sum+p[2],0));
  panels.forEach((panel,i)=>{
    ctx.beginPath();
    panel.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.closePath();
    ctx.fillStyle=i<3?"#8b8cff15":"#b7ff6521";
    ctx.fill();
  });
  const core=project([0,0,0]), glow=ctx.createRadialGradient(core[0],core[1],0,core[0],core[1],scale*.55);
  glow.addColorStop(0,"#f3ffe4");
  glow.addColorStop(.22,"#b7ff65");
  glow.addColorStop(1,"#b7ff6500");
  ctx.fillStyle=glow;
  ctx.fillRect(core[0]-scale,core[1]-scale,scale*2,scale*2);
  edges.forEach(([a,b])=>path([points[a],points[b]],"#cddad9b0",1));
  points.sort((a,b)=>a[2]-b[2]).forEach(([x,y,z])=>{
    ctx.beginPath();
    ctx.arc(x,y,Math.max(2,3.5+z),0,Math.PI*2);
    ctx.fillStyle=z>.35?"#b7ff65":"#b3a7ff";
    ctx.fill();
  });
  stage.classList.add("rendered");
  if(visible&&!motion.matches) raf=requestAnimationFrame(draw);
}
function wake(){if(!raf)raf=requestAnimationFrame(draw);}
if(ctx){
  new ResizeObserver(()=>{
    const bounds=canvas.getBoundingClientRect(), dpr=Math.min(devicePixelRatio,2);
    width=bounds.width; height=bounds.height;
    canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    wake();
  }).observe(canvas);
  new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;
    if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}
  }).observe(stage);
  stage.addEventListener("pointermove",event=>{
    if(event.pointerType!=="mouse")return;
    const bounds=stage.getBoundingClientRect();
    pointerX=(event.clientX-bounds.left)/bounds.width-.5;
    pointerY=(event.clientY-bounds.top)/bounds.height-.5;
  });
  stage.addEventListener("pointerleave",()=>{pointerX=pointerY=0;});
  motion.addEventListener("change",wake);
}
const navigation=[...document.querySelectorAll(".links a")];
const sectionObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    sectionIndex=sections.indexOf(entry.target);
    caption.textContent=labels[sectionIndex];
    navigation.forEach(link=>{
      if(link.hash==="#"+entry.target.id)link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
  }
},{rootMargin:"-25% 0px -55% 0px"});
sections.forEach(section=>sectionObserver.observe(section));
const evidence=[
 "09:00–09:02 UTC · Three failures for the same account and source.",
 "09:04 UTC · The same account and source recorded a successful sign-in.",
 "Keep the alert open for review. Check MFA, device context, and activity after the sign-in."
];
const controls=[...document.querySelectorAll("[data-step]")];
controls.forEach(button=>button.addEventListener("click",()=>{
  controls.forEach(control=>control.setAttribute("aria-pressed",String(control===button)));
  document.querySelector("#evidence").textContent=evidence[Number(button.dataset.step)];
}));
