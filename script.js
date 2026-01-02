// Avatar upload and download functionality
const avatarInput = document.getElementById('avatarInput');
const avatarHolder = document.getElementById('avatarHolder');
const avatarSVG = document.getElementById('avatarSVG');
const downloadBtn = document.getElementById('downloadBtn');
const cardRoot = document.getElementById('cardRoot');

// Inline SVG fallback markup (used if /assets/avatar.jpg not available)
const svgFallback = `
<svg id="avatarSVG" class="avatar" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="avatar">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#ff9a9e" />
      <stop offset="1" stop-color="#fad0c4" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="96" fill="url(#g)" />
  <g transform="translate(40,45) scale(0.9)">
    <ellipse cx="60" cy="90" rx="56" ry="42" fill="#fff" opacity="0.15" />
    <circle cx="60" cy="50" r="36" fill="#ffd9e2" />
    <path d="M36 72c8 9 36 9 44 0" fill="#e6a3b3" />
    <circle cx="50" cy="46" r="4" fill="#3b2b2b" />
    <circle cx="70" cy="46" r="4" fill="#3b2b2b" />
    <path d="M50 60c6 6 14 6 20 0" stroke="#3b2b2b" stroke-width="2" fill="none" stroke-linecap="round" />
  </g>
</svg>
`;

// Try to load default avatar from assets/avatar.jpg; fallback to inline SVG if not found.
const avatarImgEl = document.getElementById('avatarImg');
if(avatarImgEl){
  const test = new Image();
  test.onload = () => {
    avatarImgEl.src = 'assets/avatar.jpg';
  };
  test.onerror = () => {
    avatarHolder.innerHTML = svgFallback;
  };
  // trigger load attempt (relative path)
  test.src = 'assets/avatar.jpg';
}

avatarInput.addEventListener('change', (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);

  // remove existing children and insert img
  avatarHolder.innerHTML = '';
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'avatar';
  img.className = 'avatar-img';
  img.onload = () => URL.revokeObjectURL(url);
  avatarHolder.appendChild(img);
});

// Download card as PNG using html2canvas
downloadBtn.addEventListener('click', () => {
  // Disable button while rendering
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Đang tạo...';

  html2canvas(cardRoot, {backgroundColor: null, scale: 2}).then(canvas => {
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'thiệp-sinh-nhat.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
      downloadBtn.disabled = false;
    }, 'image/png');
  }).catch(err => {
    console.error(err);
    downloadBtn.disabled = false;;
  });
});

// Falling effects: supports candy, heart, both, off
const CANDIES = ['🍭','🍬','🍪','🍫','🍡','🍩','🍒','🍓','✨'];
const HEARTS = ['❤️','💖','💝','💕','💘','💞'];
const fallingRoot = document.getElementById('falling');

const fallTypeSel = document.getElementById('fallType');
const densityInput = document.getElementById('density');
const toggleFallingBtn = document.getElementById('toggleFalling');

function pickEmoji(){
  const mode = fallTypeSel ? fallTypeSel.value : 'both';
  if(mode === 'off') return null;
  if(mode === 'candy') return CANDIES[Math.floor(Math.random()*CANDIES.length)];
  if(mode === 'heart') return HEARTS[Math.floor(Math.random()*HEARTS.length)];
  // both
  const pool = CANDIES.concat(HEARTS);
  return pool[Math.floor(Math.random()*pool.length)];
}

function spawnCandy(){
  if(!fallingRoot) return;
  const emoji = pickEmoji();
  if(!emoji) return; // off

  const el = document.createElement('div');
  el.className = 'candy';
  el.textContent = emoji;
  const left = Math.random()*100; // vw
  el.style.left = left + 'vw';
  const sizeClass = Math.random() > 0.7 ? 'large' : (Math.random() > 0.6 ? 'small' : '');
  if(sizeClass) el.classList.add(sizeClass);
  const dur = (4 + Math.random()*5).toFixed(2);
  const swayDur = (2 + Math.random()*3).toFixed(2);
  const spinDur = (3 + Math.random()*4).toFixed(2);
  el.style.animationDuration = `${dur}s, ${swayDur}s, ${spinDur}s`;
  el.style.animationDelay = `${(Math.random()*1.5).toFixed(2)}s, 0s, 0s`;
  fallingRoot.appendChild(el);
  setTimeout(()=> el.remove(), (parseFloat(dur)+1)*1000 + 200);
}

// spawn controller
let spawnIntervalMs = parseInt(densityInput ? densityInput.value : 600, 10) || 600;
let spawnTimer = null;
function startSpawning(){
  if(spawnTimer) return;
  spawnTimer = setInterval(spawnCandy, spawnIntervalMs);
}
function stopSpawning(){
  if(!spawnTimer) return;
  clearInterval(spawnTimer); spawnTimer = null;
}

// init: always start spawning automatically unless user explicitly set 'off'
// start automatically and spawn an initial burst so falling is visible immediately
if(!(fallTypeSel && fallTypeSel.value === 'off')){
  // initial burst across the top
  function spawnBurst(count = 18){
    for(let i=0;i<count;i++){
      setTimeout(()=>{
        // reuse spawnCandy but create element manually to control immediate spawn
        if(!fallingRoot) return;
        const emoji = pickEmoji();
        if(!emoji) return;
        const el = document.createElement('div');
        el.className = 'candy';
        el.textContent = emoji;
        const left = Math.random()*100; // vw
        el.style.left = left + 'vw';
        const sizeClass = Math.random() > 0.7 ? 'large' : (Math.random() > 0.6 ? 'small' : '');
        if(sizeClass) el.classList.add(sizeClass);
        const dur = (3 + Math.random()*4).toFixed(2); // slightly faster for burst
        const swayDur = (2 + Math.random()*2).toFixed(2);
        const spinDur = (2 + Math.random()*3).toFixed(2);
        el.style.animationDuration = `${dur}s, ${swayDur}s, ${spinDur}s`;
        // small random delay so they don't all fall at exact same time
        el.style.animationDelay = `${(Math.random()*0.8).toFixed(2)}s, 0s, 0s`;
        fallingRoot.appendChild(el);
        setTimeout(()=> el.remove(), (parseFloat(dur)+1)*1000 + 200);
      }, i * 120);
    }
  }

  spawnBurst(18);
  startSpawning();
}

// react to changes
if(densityInput){
  densityInput.addEventListener('input', (e)=>{
    spawnIntervalMs = parseInt(e.target.value,10) || 600;
    if(spawnTimer){ stopSpawning(); startSpawning(); }
  });
}
if(fallTypeSel){
  fallTypeSel.addEventListener('change', ()=>{
    if(fallTypeSel.value === 'off') stopSpawning(); else startSpawning();
  });
}
if(toggleFallingBtn){
  toggleFallingBtn.addEventListener('click', ()=>{
    if(spawnTimer){ stopSpawning(); toggleFallingBtn.textContent = 'Bật rơi'; }
    else { startSpawning(); toggleFallingBtn.textContent = 'Tắt rơi'; }
  });
}

// pause when page hidden
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden){ stopSpawning(); }
  else if(fallTypeSel && fallTypeSel.value !== 'off'){ startSpawning(); }
});

// --- Music control ---
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
if(bgMusic){
  // try to set source to assets/music.mp3
  bgMusic.src = 'assets/music.mp3';
  // attempt to autoplay (may be blocked); if blocked show paused state
  const tryPlay = () => {
    bgMusic.play().then(()=>{
      if(musicToggle) musicToggle.classList.remove('paused');
    }).catch(()=>{
      if(musicToggle) musicToggle.classList.add('paused');
    });
  };
  // try autoplay after small delay
  setTimeout(tryPlay, 400);

  if(musicToggle){
    musicToggle.addEventListener('click', ()=>{
      if(bgMusic.paused){
        bgMusic.play();
        musicToggle.classList.remove('paused');
      } else {
        bgMusic.pause();
        musicToggle.classList.add('paused');
      }
    });
  }
}

// --- Click/tap hearts effect ---
function spawnClickHeartsAt(x, y, count = 6){
  if(!fallingRoot) return;
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'click-heart';
    // random heart emoji
    const hearts = ['❤️','💖','💝','💕','💘','💞','💗'];
    h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    // random size
    const sz = Math.random();
    if(sz > 0.75) h.classList.add('large');
    else if(sz < 0.35) h.classList.add('small');

    // position relative to viewport (fallingRoot is fixed full-screen)
    const offsetX = (Math.random()-0.5) * 30; // random x drift in px
    h.style.left = (x + offsetX) + 'px';
    h.style.top = (y + (Math.random()*6-3)) + 'px';
    // css variable for sideways movement
    h.style.setProperty('--sx', (Math.random()*40-20) + 'px');

    // random duration to vary feel
    const dur = 700 + Math.floor(Math.random()*600);
    h.style.animationDuration = dur + 'ms';

    fallingRoot.appendChild(h);
    // cleanup after animation
    setTimeout(()=>{ h.remove(); }, dur + 120);
  }
}

// listen for pointerdown on card (works for mouse and touch)
if(cardRoot){
  cardRoot.addEventListener('pointerdown', (ev)=>{
    const x = ev.clientX;
    const y = ev.clientY;
    spawnClickHeartsAt(x, y, 6);
  });
}