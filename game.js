(() => {
  'use strict';

  const canvas = document.querySelector('#game-canvas');
  const ctx = canvas.getContext('2d');
  const ui = {
    playerScore: document.querySelector('#player-score'),
    cpuScore: document.querySelector('#cpu-score'),
    playerProgress: document.querySelector('#player-progress'),
    cpuProgress: document.querySelector('#cpu-progress'),
    rally: document.querySelector('#rally-count'),
    speed: document.querySelector('#speed-readout'),
    bestRally: document.querySelector('#best-rally'),
    bestSpeed: document.querySelector('#best-speed'),
    status: document.querySelector('#match-status'),
    session: document.querySelector('#session-status'),
    overlay: document.querySelector('#game-overlay'),
    overlayTitle: document.querySelector('#overlay-title'),
    overlayCopy: document.querySelector('#overlay-copy'),
    start: document.querySelector('#start-button'),
    countdown: document.querySelector('#countdown'),
    pause: document.querySelector('#pause-button'),
    sound: document.querySelector('#sound-button'),
    reset: document.querySelector('#reset-button'),
  };

  const W = canvas.width;
  const H = canvas.height;
  const WIN_SCORE = 7;
  const paddle = { width: 17, height: 132, margin: 46 };
  const levels = {
    rookie: { label: '新秀', follow: 3.7, reaction: .22, error: 50, maxSpeed: 9 },
    pro: { label: '職業', follow: 5.5, reaction: .11, error: 22, maxSpeed: 11 },
    elite: { label: '菁英', follow: 7.4, reaction: .05, error: 7, maxSpeed: 13 },
  };
  const state = {
    phase: 'ready', level: 'pro', playerScore: 0, cpuScore: 0, rally: 0, bestRally: Number(localStorage.getItem('neon-arena-best-rally') || 0),
    bestSpeed: Number(localStorage.getItem('neon-arena-best-speed') || 0), muted: localStorage.getItem('neon-arena-muted') === 'true', pointerY: null, lastTime: 0, serveTimer: null,
  };
  const player = { x: paddle.margin, y: H / 2 - paddle.height / 2, targetY: H / 2 - paddle.height / 2, vy: 0 };
  const cpu = { x: W - paddle.margin - paddle.width, y: H / 2 - paddle.height / 2, targetY: H / 2 - paddle.height / 2, vy: 0 };
  const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, radius: 10, speed: 0 };
  const particles = [];
  const stars = Array.from({ length: 80 }, (_, index) => ({ x: (index * 173) % W, y: (index * 97) % H, r: index % 4 === 0 ? 1.6 : .7, a: .15 + (index % 5) * .07 }));
  const keys = new Set();
  let audioContext;
  let animationFrame;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function setText(element, value) { element.textContent = value; }
  function randomSign() { return Math.random() > .5 ? 1 : -1; }
  function difficulty() { return levels[state.level]; }

  function updateScoreboard() {
    setText(ui.playerScore, String(state.playerScore).padStart(2, '0'));
    setText(ui.cpuScore, String(state.cpuScore).padStart(2, '0'));
    setText(ui.rally, String(state.rally).padStart(2, '0'));
    setText(ui.bestRally, String(state.bestRally).padStart(2, '0'));
    setText(ui.bestSpeed, `${state.bestSpeed.toFixed(1)} km/h`);
    setText(ui.speed, ball.speed ? (ball.speed * 7.6).toFixed(1) : '0.0');
    ui.playerProgress.innerHTML = state.playerScore ? '<i></i>' : '';
    ui.cpuProgress.innerHTML = state.cpuScore ? '<i></i>' : '';
    const playerBar = ui.playerProgress.querySelector('i');
    const cpuBar = ui.cpuProgress.querySelector('i');
    if (playerBar) playerBar.style.width = `${Math.min(35 + state.playerScore * 35, 245)}px`;
    if (cpuBar) cpuBar.style.width = `${Math.min(35 + state.cpuScore * 35, 245)}px`;
  }

  function saveRecords() {
    localStorage.setItem('neon-arena-best-rally', String(state.bestRally));
    localStorage.setItem('neon-arena-best-speed', String(state.bestSpeed));
  }

  function resetPositions() {
    player.y = H / 2 - paddle.height / 2; player.targetY = player.y;
    cpu.y = H / 2 - paddle.height / 2; cpu.targetY = cpu.y;
    ball.x = W / 2; ball.y = H / 2; ball.vx = 0; ball.vy = 0; ball.speed = 0;
    particles.length = 0;
    updateScoreboard();
  }

  function serve(direction = randomSign()) {
    const angle = (Math.random() * .58 - .29);
    const speed = 7.1;
    ball.x = W / 2; ball.y = H / 2; ball.vx = direction * speed * Math.cos(angle); ball.vy = speed * Math.sin(angle); ball.speed = speed;
    state.rally = 0;
    playTone(330, .06, 'sine');
    updateScoreboard();
  }

  function startCountdown() {
    state.phase = 'countdown';
    ui.overlay.classList.add('is-hidden');
    let count = 3;
    ui.countdown.textContent = String(count);
    ui.countdown.classList.add('is-visible');
    const tick = () => {
      count -= 1;
      if (count > 0) {
        ui.countdown.textContent = String(count);
        ui.countdown.classList.remove('is-visible');
        void ui.countdown.offsetWidth;
        ui.countdown.classList.add('is-visible');
        state.serveTimer = window.setTimeout(tick, 760);
      } else {
        ui.countdown.textContent = 'GO';
        ui.countdown.classList.remove('is-visible');
        void ui.countdown.offsetWidth;
        ui.countdown.classList.add('is-visible');
        state.phase = 'playing';
        setText(ui.status, '比賽進行中');
        setText(ui.session, '進行中');
        serve(1);
      }
    };
    state.serveTimer = window.setTimeout(tick, 760);
  }

  function beginMatch() {
    window.clearTimeout(state.serveTimer);
    state.playerScore = 0; state.cpuScore = 0; state.rally = 0;
    resetPositions();
    startCountdown();
  }

  function pauseMatch() {
    if (state.phase === 'playing') {
      state.phase = 'paused'; setText(ui.status, '已暫停'); setText(ui.session, '暫停中'); ui.pause.classList.add('is-active');
    } else if (state.phase === 'paused') {
      state.phase = 'playing'; setText(ui.status, '比賽進行中'); setText(ui.session, '進行中'); ui.pause.classList.remove('is-active');
    }
  }

  function finishMatch(winner) {
    state.phase = 'over';
    const playerWon = winner === 'player';
    setText(ui.status, playerWon ? '你贏得比賽' : 'CPU 贏得比賽');
    setText(ui.session, '本局結束');
    ui.overlayTitle.textContent = playerWon ? '漂亮得分！' : '再戰一局？';
    ui.overlayCopy.textContent = playerWon ? '你已掌控 NEON ARENA。下一個傳奇紀錄等你刷新。' : 'AI 暫時守住了球桌，調整節奏再試一次。';
    ui.start.querySelector('span').textContent = '再次挑戰';
    ui.overlay.classList.remove('is-hidden');
    ui.pause.classList.remove('is-active');
    playTone(playerWon ? 660 : 180, .18, playerWon ? 'triangle' : 'sawtooth');
  }

  function scorePoint(side) {
    if (side === 'player') state.playerScore += 1; else state.cpuScore += 1;
    if (state.rally > state.bestRally) { state.bestRally = state.rally; saveRecords(); }
    updateScoreboard();
    playTone(side === 'player' ? 580 : 220, .11, 'square');
    if (state.playerScore >= WIN_SCORE || state.cpuScore >= WIN_SCORE) { finishMatch(state.playerScore >= WIN_SCORE ? 'player' : 'cpu'); return; }
    state.phase = 'point'; setText(ui.status, side === 'player' ? '你取得一分' : 'CPU 取得一分');
    resetPositions();
    state.serveTimer = window.setTimeout(() => { state.phase = 'playing'; setText(ui.status, '比賽進行中'); serve(side === 'player' ? -1 : 1); }, 740);
  }

  function movePlayer(dt) {
    const keyboardDirection = (keys.has('ArrowDown') || keys.has('s') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('w') ? 1 : 0);
    if (keyboardDirection) player.targetY += keyboardDirection * 440 * dt;
    if (state.pointerY !== null) player.targetY = state.pointerY - paddle.height / 2;
    player.targetY = clamp(player.targetY, 26, H - paddle.height - 26);
    player.y += (player.targetY - player.y) * Math.min(1, dt * 16);
  }

  function predictCpuTarget() {
    const settings = difficulty();
    if (ball.vx <= 0) { cpu.targetY += (H / 2 - paddle.height / 2 - cpu.targetY) * .03; return; }
    const timeToPaddle = (cpu.x - ball.x) / ball.vx;
    let projectedY = ball.y + ball.vy * Math.max(0, timeToPaddle);
    const period = H - 70;
    projectedY = 35 + Math.abs(((projectedY - 35) % (period * 2) + period * 2) % (period * 2) - period);
    cpu.targetY = projectedY - paddle.height / 2 + Math.sin(performance.now() / 650) * settings.error;
  }

  function moveCpu(dt) {
    if (Math.random() < difficulty().reaction * dt * 60) predictCpuTarget();
    cpu.targetY = clamp(cpu.targetY, 26, H - paddle.height - 26);
    const delta = cpu.targetY - cpu.y;
    cpu.y += clamp(delta, -difficulty().follow * 60 * dt, difficulty().follow * 60 * dt);
  }

  function spawnParticles(x, y, color, amount = 7) {
    for (let i = 0; i < amount; i += 1) particles.push({ x, y, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5, life: 1, color });
  }

  function bounce(paddleObject, direction) {
    const relative = (ball.y - (paddleObject.y + paddle.height / 2)) / (paddle.height / 2);
    const angle = relative * .92;
    const nextSpeed = Math.min(ball.speed + .42, 14.2);
    ball.speed = nextSpeed;
    ball.vx = direction * nextSpeed * Math.cos(angle);
    ball.vy = nextSpeed * Math.sin(angle);
    state.rally += 1;
    state.bestSpeed = Math.max(state.bestSpeed, ball.speed * 7.6);
    saveRecords(); updateScoreboard();
    spawnParticles(ball.x, ball.y, direction > 0 ? '#9b7cff' : '#22e3ff', 10);
    playTone(430 + Math.abs(relative) * 120, .035, 'sine');
  }

  function updateBall(dt) {
    ball.x += ball.vx * dt * 60; ball.y += ball.vy * dt * 60;
    if (ball.y - ball.radius < 28) { ball.y = 28 + ball.radius; ball.vy = Math.abs(ball.vy); spawnParticles(ball.x, ball.y, '#22e3ff', 4); playTone(250, .02, 'sine'); }
    if (ball.y + ball.radius > H - 28) { ball.y = H - 28 - ball.radius; ball.vy = -Math.abs(ball.vy); spawnParticles(ball.x, ball.y, '#22e3ff', 4); playTone(250, .02, 'sine'); }
    const hitsPlayer = ball.vx < 0 && ball.x - ball.radius < player.x + paddle.width && ball.x + ball.radius > player.x && ball.y > player.y && ball.y < player.y + paddle.height;
    const hitsCpu = ball.vx > 0 && ball.x + ball.radius > cpu.x && ball.x - ball.radius < cpu.x + paddle.width && ball.y > cpu.y && ball.y < cpu.y + paddle.height;
    if (hitsPlayer) { ball.x = player.x + paddle.width + ball.radius; bounce(player, 1); }
    if (hitsCpu) { ball.x = cpu.x - ball.radius; bounce(cpu, -1); }
    if (ball.x < -35) scorePoint('cpu');
    if (ball.x > W + 35) scorePoint('player');
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i -= 1) { const p = particles[i]; p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.life -= dt * 2.5; if (p.life <= 0) particles.splice(i, 1); }
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#061321'); gradient.addColorStop(.5, '#091b2b'); gradient.addColorStop(1, '#0a1223');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * .5, H * .5, 20, W * .5, H * .5, W * .6);
    glow.addColorStop(0, 'rgba(34, 227, 255, .075)'); glow.addColorStop(1, 'rgba(34, 227, 255, 0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    stars.forEach((star) => { ctx.fillStyle = `rgba(162, 204, 244, ${star.a})`; ctx.fillRect(star.x, star.y, star.r, star.r); });
    ctx.strokeStyle = 'rgba(88, 134, 172, .12)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(129, 169, 210, .23)'; ctx.setLineDash([8, 14]); ctx.beginPath(); ctx.moveTo(W / 2, 28); ctx.lineTo(W / 2, H - 28); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(34, 227, 255, .38)'; ctx.strokeRect(28, 28, W - 56, H - 56);
    ctx.strokeStyle = 'rgba(155, 124, 255, .12)'; ctx.strokeRect(34, 34, W - 68, H - 68);
  }

  function drawPaddle(paddleObject, color) {
    ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 22; ctx.fillStyle = color; ctx.fillRect(paddleObject.x, paddleObject.y, paddle.width, paddle.height); ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.fillRect(paddleObject.x + 4, paddleObject.y + 13, 2, paddle.height - 26); ctx.restore();
  }

  function drawBall() {
    if (!ball.speed) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 4; i >= 0; i -= 1) { ctx.beginPath(); ctx.fillStyle = `rgba(34, 227, 255, ${.035 * (5 - i)})`; ctx.arc(ball.x - ball.vx * i * 2, ball.y - ball.vy * i * 2, ball.radius + i * 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.shadowColor = '#d7fbff'; ctx.shadowBlur = 25; ctx.beginPath(); ctx.fillStyle = '#f4ffff'; ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  function drawParticles() { particles.forEach((p) => { ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fillRect(p.x, p.y, 3, 3); ctx.restore(); }); }

  function draw() { drawBackground(); drawParticles(); drawPaddle(player, '#22e3ff'); drawPaddle(cpu, '#9b7cff'); drawBall(); }

  function frame(timestamp) {
    const dt = Math.min(.033, (timestamp - (state.lastTime || timestamp)) / 1000); state.lastTime = timestamp;
    if (state.phase === 'playing') { movePlayer(dt); moveCpu(dt); updateBall(dt); updateParticles(dt); }
    draw(); animationFrame = window.requestAnimationFrame(frame);
  }

  function playTone(frequency, duration, type) {
    if (state.muted || !window.AudioContext) return;
    audioContext = audioContext || new AudioContext();
    const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.035, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration); oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
  }

  function pointerToCanvas(event) { const rect = canvas.getBoundingClientRect(); state.pointerY = (event.clientY - rect.top) * H / rect.height; }

  ui.start.addEventListener('click', beginMatch);
  ui.reset.addEventListener('click', beginMatch);
  ui.pause.addEventListener('click', pauseMatch);
  ui.sound.addEventListener('click', () => { state.muted = !state.muted; localStorage.setItem('neon-arena-muted', String(state.muted)); ui.sound.classList.toggle('is-active', !state.muted); ui.sound.setAttribute('aria-label', state.muted ? '開啟音效' : '關閉音效'); });
  document.querySelectorAll('.difficulty-button').forEach((button) => button.addEventListener('click', () => { state.level = button.dataset.level; document.querySelectorAll('.difficulty-button').forEach((item) => item.classList.toggle('is-active', item === button)); if (state.phase !== 'playing') setText(ui.status, `強度：${difficulty().label}`); }));
  window.addEventListener('keydown', (event) => { if (['ArrowUp', 'ArrowDown', 'w', 's', ' '].includes(event.key)) event.preventDefault(); if (event.key === ' ') pauseMatch(); keys.add(event.key); });
  window.addEventListener('keyup', (event) => keys.delete(event.key));
  canvas.addEventListener('pointermove', pointerToCanvas); canvas.addEventListener('pointerleave', () => { state.pointerY = null; });
  canvas.addEventListener('pointerdown', (event) => { pointerToCanvas(event); canvas.setPointerCapture(event.pointerId); });

  ui.sound.classList.toggle('is-active', !state.muted);
  updateScoreboard();
  draw();
  animationFrame = window.requestAnimationFrame(frame);
  window.addEventListener('beforeunload', () => window.cancelAnimationFrame(animationFrame));
})();
