const playBtn = document.getElementById('playBtn');
const confettiBtn = document.getElementById('confettiBtn');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let W, H, particles=[];

function resize(){W=canvas.width = innerWidth; H=canvas.height = innerHeight}
addEventListener('resize', resize); resize();

function rand(min,max){return Math.random()*(max-min)+min}

function spawnConfetti(count=120){
  for(let i=0;i<count;i++){
    particles.push({x:rand(0,W), y:rand(-H,0), vx:rand(-2,2), vy:rand(2,6),
      size:rand(6,12), color:`hsl(${Math.floor(rand(0,360))}deg 70% 60%)`, rot:rand(0,Math.PI*2)})
  }
}

function step(){
  ctx.clearRect(0,0,W,H);
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.03; p.rot+=0.05;
    ctx.save(); ctx.fillStyle=p.color; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6); ctx.restore();
    if(p.y>H+50) particles.splice(i,1);
  }
  requestAnimationFrame(step);
}
requestAnimationFrame(step);

confettiBtn.addEventListener('click',()=>{
  spawnConfetti(180);
});

playBtn.addEventListener('click', ()=>{
  playMelody();
});

function playMelody(){
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctxA = new AudioCtx();
  const notes=[523.25,659.25,783.99,1046.5]; // C5 E5 G5 C6
  let t = ctxA.currentTime;
  notes.forEach((f,i)=>{
    const o = ctxA.createOscillator(); const g = ctxA.createGain();
    o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.12;
    o.connect(g); g.connect(ctxA.destination);
    o.start(t + i*0.25); o.stop(t + i*0.25 + 0.22);
  });
  // close context after melody
  setTimeout(()=>{try{ctxA.close()}catch(e){}}, 1200);
}
