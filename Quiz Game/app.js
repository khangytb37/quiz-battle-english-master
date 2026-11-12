

const QUIZ_DATA = window.QUIZ_DATA || [];

const CATEGORY_MAP = {
  All: ['Grammar', 'Vocabulary', 'Phonetics', 'Synonym', 'Reading'],
  Grammar: ['Grammar', 'Vocabulary'],
  Phonetics: ['Phonetics'],
  Synonym: ['Synonym'],
  Reading: ['Reading']
};

const BOT_PROFILES = [
  { name: 'CyberFox_AI', avatar: '🦊', accuracy: 0.78, minMs: 2200, maxMs: 9500 },
  { name: 'NeonDragon', avatar: '🐉', accuracy: 0.85, minMs: 1800, maxMs: 8500 },
  { name: 'QuantumOwl', avatar: '🦉', accuracy: 0.72, minMs: 3200, maxMs: 12000 },
  { name: 'ViperBot_99', avatar: '🐺', accuracy: 0.65, minMs: 2600, maxMs: 11000 },
  { name: 'AlphaLion', avatar: '🦁', accuracy: 0.80, minMs: 2500, maxMs: 10000 },
  { name: 'ApexShark', avatar: '🦈', accuracy: 0.68, minMs: 3000, maxMs: 13500 }
];

const SAMPLE_CUSTOM_QUESTIONS = [
  {
    id: 101,
    category: 'Grammar',
    question: 'Hardly ______ the station when the train departed.',
    options: ['had we reached', 'we had reached', 'did we reach', 'we reached'],
    answerIndex: 0,
    explanation: 'Cấu trúc đảo ngữ với "Hardly": Hardly + had + S + V3/ed + when + S + V(quá khứ đơn).'
  },
  {
    id: 102,
    category: 'Vocabulary',
    question: 'The new policy aims to ______ economic growth while protecting the environment.',
    options: ['foster', 'hinder', 'neglect', 'abolish'],
    answerIndex: 0,
    explanation: '"Foster" = thúc đẩy, nuôi dưỡng (sự phát triển). Các từ còn lại mang nghĩa cản trở, phớt lờ hoặc bãi bỏ.'
  },
  {
    id: 103,
    category: 'Synonym',
    question: 'CLOSEST in meaning: "She remained _resilient_ despite facing numerous setbacks."',
    options: ['tough and adaptable', 'fragile', 'indifferent', 'hesitant'],
    answerIndex: 0,
    explanation: '"Resilient" = kiên cường, có khả năng phục hồi nhanh trước khó khăn, đồng nghĩa với "tough and adaptable".'
  },
  {
    id: 104,
    category: 'Phonetics',
    question: 'Choose the word with a DIFFERENT stress pattern:',
    options: ['environment', 'entertainment', 'information', 'engineering'],
    answerIndex: 0,
    explanation: '"Environment" nhấn âm 2 (/ɪnˈvaɪrənmənt/). Ba từ còn lại đều nhấn âm 3.'
  },
  {
    id: 105,
    category: 'Reading',
    question: 'Fill in the blank: "It is high time the city ______ stricter traffic regulations."',
    options: ['enforced', 'enforces', 'will enforce', 'enforcing'],
    answerIndex: 0,
    explanation: 'Cấu trúc "It is (high) time + S + V(quá khứ đơn)" diễn tả việc đã đến lúc phải làm gì.'
  }
];

class SoundEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  play(type) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    switch (type) {
      case 'click': this._beep(820, 0.05, 'square', 0.12); break;
      case 'correct': this._playCorrect(); break;
      case 'wrong': this._playWrong(); break;
      case 'combo': this._playCombo(); break;
      case 'damage': this._beep(150, 0.15, 'sawtooth', 0.28); break;
      case 'powerup': this._playPowerup(); break;
      case 'timeWarning': this._beep(640, 0.08, 'square', 0.12); break;
      case 'victory': this._playVictory(); break;
      case 'defeat': this._playDefeat(); break;
      case 'ko': this._playKO(); break;
      case 'start': this._playStart(); break;
      case 'freeze': this._beep(1900, 0.18, 'sine', 0.18); break;
      case 'reveal': this._beep(520, 0.1, 'triangle', 0.22); break;
      case 'suspense': this._playSuspense(); break;
      case 'champion': this._playChampionFanfare(); break;
      case 'firework': this._beep(180 + Math.random() * 240, 0.14, 'sawtooth', 0.1); break;
    }
  }

  _beep(freq, duration, type = 'sine', volume = 0.2) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  _playCorrect() {
    this._beep(523, 0.1, 'sine', 0.22);
    setTimeout(() => this._beep(659, 0.1, 'sine', 0.22), 75);
    setTimeout(() => this._beep(784, 0.15, 'sine', 0.22), 150);
  }

  _playWrong() {
    this._beep(290, 0.15, 'sawtooth', 0.18);
    setTimeout(() => this._beep(220, 0.22, 'sawtooth', 0.18), 110);
  }

  _playCombo() {
    [600, 800, 1000, 1250].forEach((f, i) => {
      setTimeout(() => this._beep(f, 0.09, 'sine', 0.2), i * 55);
    });
  }

  _playPowerup() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this._beep(420 + i * 190, 0.07, 'sine', 0.18), i * 45);
    }
  }

  _playVictory() {
    [523, 659, 784, 1047].forEach((n, i) => setTimeout(() => this._beep(n, 0.2, 'sine', 0.2), i * 140));
  }

  _playDefeat() {
    [400, 350, 300, 200].forEach((n, i) => setTimeout(() => this._beep(n, 0.24, 'sawtooth', 0.14), i * 190));
  }

  _playKO() {
    this._beep(200, 0.3, 'sawtooth', 0.28);
    setTimeout(() => this._beep(100, 0.5, 'sawtooth', 0.32), 180);
  }

  _playStart() {
    this._beep(440, 0.12, 'sine', 0.18);
    setTimeout(() => this._beep(440, 0.12, 'sine', 0.18), 260);
    setTimeout(() => this._beep(880, 0.25, 'sine', 0.24), 520);
  }

  _playSuspense() {
    [220, 247, 277, 311].forEach((f, i) => {
      setTimeout(() => this._beep(f, 0.18, 'triangle', 0.16), i * 180);
    });
  }

  _playChampionFanfare() {
    const melody = [
      { f: 523.25, t: 0, d: 0.14 },
      { f: 659.25, t: 130, d: 0.14 },
      { f: 783.99, t: 260, d: 0.14 },
      { f: 1046.5, t: 400, d: 0.45 },
      { f: 783.99, t: 780, d: 0.14 },
      { f: 1046.5, t: 930, d: 0.65 }
    ];
    melody.forEach(m => setTimeout(() => this._beep(m.f, m.d, 'triangle', 0.28), m.t));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.bursts = [];
    this.paused = false;
    this.mouse = { x: -1000, y: -1000 };
    this.symbols = ['?', 'A', 'B', 'C', 'D', '★', '⚡', '🎓'];
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.paused) this.animate();
    });
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    
    const count = Math.min(26, Math.max(14, Math.floor((window.innerWidth * window.innerHeight) / 45000)));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const isSymbol = Math.random() > 0.35;
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.2 - Math.random() * 0.4,
        isSymbol,
        symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
        size: isSymbol ? (14 + Math.random() * 12) : (2 + Math.random() * 2.5),
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        alpha: 0.12 + Math.random() * 0.25,
        baseAlpha: 0.12 + Math.random() * 0.25,
        colorIdx: i % 4,
        depth: 0.5 + Math.random() * 0.8
      });
    }
  }

  spawnBurst(cx, cy, color = '#00ff88') {
    const burstCount = 18;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.3;
      const speed = 2.5 + Math.random() * 4.5;
      this.bursts.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.02,
        size: 3 + Math.random() * 3,
        color,
        isStar: Math.random() > 0.5
      });
    }
  }

  animate() {
    if (document.hidden || this.paused) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const palette = isLight
      ? ['#0077b6', '#7b2cbf', '#d97706', '#059669']
      : ['#00f0ff', '#b040ff', '#ffd700', '#00ff88'];

    
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.08;
      b.alpha -= b.decay;
      if (b.alpha <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.globalAlpha = b.alpha;
      this.ctx.fillStyle = b.color;
      this.ctx.shadowColor = b.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      if (b.isStar) {
        this.ctx.font = `${Math.round(b.size * 2)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('✨', b.x, b.y);
      } else {
        this.ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx * p.depth;
      p.y += p.vy * p.depth;
      p.rot += p.vRot;

      
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 22500) {
        const dist = Math.sqrt(distSq) || 1;
        const force = (150 - dist) / 150 * 1.5;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      
      if (p.x < -30) p.x = w + 30;
      else if (p.x > w + 30) p.x = -30;
      if (p.y < -30) p.y = h + 30;
      else if (p.y > h + 30) p.y = -30;

      const col = palette[p.colorIdx];
      const curAlpha = isLight ? Math.min(0.38, p.baseAlpha + 0.05) : p.baseAlpha;

      this.ctx.save();
      this.ctx.globalAlpha = curAlpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);

      if (p.isSymbol) {
        this.ctx.font = `700 ${Math.round(p.size)}px var(--font-title), sans-serif`;
        this.ctx.fillStyle = col;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(p.symbol, 0, 0);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = col;
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    
    const maxDistSq = 10000;
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < this.particles.length; i++) {
      const pi = this.particles[i];
      if (pi.isSymbol) continue;
      this.ctx.strokeStyle = palette[pi.colorIdx];
      for (let j = i + 1; j < this.particles.length; j++) {
        const pj = this.particles[j];
        if (pj.isSymbol) continue;
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          this.ctx.globalAlpha = (1 - distSq / maxDistSq) * (isLight ? 0.15 : 0.1);
          this.ctx.beginPath();
          this.ctx.moveTo(pi.x, pi.y);
          this.ctx.lineTo(pj.x, pj.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sparks = [];
    this.confetti = [];
    this.running = false;
    this.rafId = null;
    this.burstInterval = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    this.stop();
    this.running = true;
    this.spawnConfetti(110);
    this.launchFirework();
    setTimeout(() => this.running && this.launchFirework(), 300);
    this.burstInterval = setInterval(() => {
      if (this.running) this.launchFirework();
    }, 950);
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.burstInterval) clearInterval(this.burstInterval);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.sparks = [];
    this.confetti = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  launchFirework() {
    const cx = this.canvas.width * (0.18 + Math.random() * 0.64);
    const cy = this.canvas.height * (0.15 + Math.random() * 0.35);
    const colors = ['#ffd700', '#00f0ff', '#b040ff', '#00ff88', '#ff2050'];
    const baseColor = colors[Math.floor(Math.random() * colors.length)];
    sound.play('firework');

    for (let i = 0; i < 42; i++) {
      const angle = (Math.PI * 2 * i) / 42 + (Math.random() - 0.5) * 0.15;
      const speed = 2 + Math.random() * 4.5;
      this.sparks.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.014 + Math.random() * 0.012,
        size: 2 + Math.random() * 2.5,
        color: Math.random() > 0.3 ? baseColor : '#ffffff'
      });
    }
  }

  spawnConfetti(count) {
    const colors = ['#ffd700', '#00f0ff', '#b040ff', '#00ff88', '#ff4081'];
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * this.canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2 + Math.random() * 3.5,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.06;
      s.alpha -= s.decay;
      if (s.alpha <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    for (const c of this.confetti) {
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vRot;
      if (c.y > this.canvas.height + 20) {
        c.y = -15;
        c.x = Math.random() * this.canvas.width;
      }
      this.ctx.save();
      this.ctx.globalAlpha = 0.85;
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rot);
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      this.ctx.restore();
    }

    this.ctx.globalAlpha = 1;
    this.rafId = requestAnimationFrame(() => this.loop());
  }
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

function formatMs(ms) {
  return (ms / 1000).toFixed(3) + 's';
}

function showToast(msg) {
  const el = DOM.toastNotification;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 2800);
}

function switchScreen(targetId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
  const shouldPauseParticles = targetId === 'screen-ceremony';
  if (particles.paused !== shouldPauseParticles) {
    particles.paused = shouldPauseParticles;
    if (!shouldPauseParticles) particles.animate();
  }
  window.scrollTo(0, 0);
}

function showTransition(text, callback) {
  DOM.transitionText.textContent = text;
  DOM.transitionOverlay.style.display = 'flex';
  DOM.transitionOverlay.classList.add('active');
  sound.play('start');
  setTimeout(() => {
    DOM.transitionOverlay.classList.remove('active');
    DOM.transitionOverlay.style.display = 'none';
    if (callback) callback();
  }, 700);
}

const CustomQuizManager = {
  STORAGE_KEY: 'quizBattle_customQuestions',

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  save(list) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this.updateBadges();
  },

  updateBadges() {
    const count = this.load().length;
    if (DOM.customCountBadge) DOM.customCountBadge.textContent = count;
    if (DOM.modalCustomCount) DOM.modalCustomCount.textContent = count;
    if (DOM.cqListCount) DOM.cqListCount.textContent = count;
  },

  renderList() {
    const list = this.load();
    this.updateBadges();
    DOM.cqList.innerHTML = '';

    if (list.length === 0) {
      const emptyStr = window.t ? window.t('cqEmptyList') : 'No custom questions yet. Add one or load samples!';
      DOM.cqList.innerHTML = `<div class="leaderboard-empty">${emptyStr}</div>`;
      return;
    }

    const correctPrefix = window.t ? window.t('cqCorrectPrefix') : 'Correct:';
    list.forEach((q, idx) => {
      const div = document.createElement('div');
      div.className = 'cq-item';
      const letter = ['A', 'B', 'C', 'D'][q.answerIndex] || 'A';
      div.innerHTML = `
        <div class="cq-item-q">${idx + 1}. [${escapeHTML(q.category || 'Custom')}] ${escapeHTML(q.question)}</div>
        <div class="cq-item-meta">
          <span>✅ ${correctPrefix} ${letter}. ${escapeHTML(q.options[q.answerIndex] || '')}</span>
          <div class="cq-item-actions">
            <button type="button" data-action="edit" data-idx="${idx}" title="Edit">✏️</button>
            <button type="button" data-action="delete" data-idx="${idx}" title="Delete">❌</button>
          </div>
        </div>
      `;
      DOM.cqList.appendChild(div);
    });
  }
};

class LocalRoomSimulator {
  constructor() {
    this.ROOMS_KEY = 'quizBattle_localRooms';
    this.channel = typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel('quiz_battle_room_sync')
      : null;
    this.myId = 'local_' + Math.random().toString(36).slice(2, 9);
    this.listeners = {};
    this.botTimers = [];
    this.roundTimer = null;
    this.advanceTimer = null;

    if (this.channel) {
      this.channel.onmessage = (e) => this._handleBroadcast(e.data);
    }
  }

  on(event, fn) {
    this.listeners[event] = fn;
  }

  emitLocal(event, payload) {
    if (this.listeners[event]) this.listeners[event](payload);
  }

  _getRooms() {
    try {
      return JSON.parse(localStorage.getItem(this.ROOMS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  _saveRoom(room) {
    const all = this._getRooms();
    all[room.code] = room;
    localStorage.setItem(this.ROOMS_KEY, JSON.stringify(all));
  }

  _broadcast(type, roomCode, data) {
    if (this.channel) {
      this.channel.postMessage({ type, roomCode, data, senderId: this.myId });
    }
  }

  _handleBroadcast(msg) {
    if (!msg || msg.roomCode !== GameState.roomCode) return;
    if (msg.type === 'room-updated') this.emitLocal('room-updated', msg.data);
    if (msg.type === 'match-started') this.emitLocal('match-started', msg.data);
    if (msg.type === 'room-question') this.emitLocal('room-question', msg.data);
    if (msg.type === 'player-answered') this.emitLocal('player-answered', msg.data);
    if (msg.type === 'round-ended') this.emitLocal('round-ended', msg.data);
    if (msg.type === 'match-finished') this.emitLocal('match-finished', msg.data);
    if (msg.type === 'room-reset') this.emitLocal('room-reset', msg.data);
  }

  _buildQuestions({ questionCount, source, category, customQuestions }) {
    const count = [5, 10, 15, 20].includes(Number(questionCount)) ? Number(questionCount) : 10;
    if (source === 'custom' && Array.isArray(customQuestions) && customQuestions.length > 0) {
      return shuffleArray(customQuestions).slice(0, Math.min(count, customQuestions.length)).map(q => ({
        ...q,
        timeLimit: 30
      }));
    }
    const cats = CATEGORY_MAP[category] || CATEGORY_MAP.All;
    let pool = QUIZ_DATA.filter(q => cats.includes(q.category));
    if (pool.length < count) {
      pool = [...pool, ...shuffleArray(QUIZ_DATA.filter(q => !cats.includes(q.category)))];
    }
    return shuffleArray(pool).slice(0, Math.min(count, pool.length)).map(q => ({ ...q, timeLimit: 30 }));
  }

  _sortRankings(players) {
    return [...players]
      .sort((a, b) => b.correctCount !== a.correctCount
        ? b.correctCount - a.correctCount
        : a.totalResponseTimeMs - b.totalResponseTimeMs)
      .map((p, i) => ({ ...p, rank: i + 1, totalResponseTimeMs: Math.round(p.totalResponseTimeMs) }));
  }

  createRoom(payload, ack) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const questions = this._buildQuestions(payload);
    const room = {
      code,
      hostId: this.myId,
      status: 'waiting',
      source: payload.source || 'system',
      category: payload.category || 'All',
      rawConfig: payload,
      questionCount: questions.length,
      questions,
      currentQuestionIndex: 0,
      answeredIds: [],
      players: [{
        id: this.myId,
        nickname: payload.nickname || 'Host',
        avatar: payload.avatar || '🦊',
        isHost: true,
        isBot: false,
        correctCount: 0,
        totalResponseTimeMs: 0
      }]
    };
    this._saveRoom(room);
    ack({ ok: true, room, playerId: this.myId });
  }

  joinRoom({ roomCode, nickname, avatar }, ack) {
    const all = this._getRooms();
    const room = all[String(roomCode).trim()];
    if (!room) {
      ack({ ok: false, error: 'Không tìm thấy phòng ' + roomCode + ' (Chế độ Local chỉ hỗ trợ các tab trên cùng trình duyệt; hãy chạy server Node.js để quét QR từ điện thoại).' });
      return;
    }
    if (room.status !== 'waiting') {
      ack({ ok: false, error: 'Trận đấu đã bắt đầu!' });
      return;
    }
    const player = {
      id: this.myId,
      nickname: nickname || 'Player',
      avatar: avatar || '🐉',
      isHost: false,
      isBot: false,
      correctCount: 0,
      totalResponseTimeMs: 0
    };
    room.players.push(player);
    this._saveRoom(room);
    this._broadcast('room-updated', room.code, room);
    ack({ ok: true, room, playerId: this.myId });
  }

  addBot(roomCode, ack) {
    const all = this._getRooms();
    const room = all[roomCode];
    if (!room) return;
    const used = new Set(room.players.map(p => p.nickname));
    const avail = BOT_PROFILES.filter(b => !used.has(b.name));
    const chosen = avail.length > 0
      ? avail[Math.floor(Math.random() * avail.length)]
      : { name: 'AI_Bot_' + Math.floor(10 + Math.random() * 89), avatar: '🤖', accuracy: 0.72, minMs: 2500, maxMs: 11000 };

    room.players.push({
      id: 'bot_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      nickname: chosen.name,
      avatar: chosen.avatar,
      isHost: false,
      isBot: true,
      botProfile: chosen,
      correctCount: 0,
      totalResponseTimeMs: 0
    });
    this._saveRoom(room);
    this._broadcast('room-updated', room.code, room);
    this.emitLocal('room-updated', room);
    if (ack) ack({ ok: true, room });
  }

  removePlayer(roomCode, playerId) {
    const all = this._getRooms();
    const room = all[roomCode];
    if (!room) return;
    room.players = room.players.filter(p => p.id !== playerId);
    this._saveRoom(room);
    this._broadcast('room-updated', room.code, room);
    this.emitLocal('room-updated', room);
  }

  startMatch(roomCode) {
    const all = this._getRooms();
    const room = all[roomCode];
    if (!room) return;
    room.status = 'playing';
    room.currentQuestionIndex = 0;
    room.players.forEach(p => { p.correctCount = 0; p.totalResponseTimeMs = 0; });
    this._saveRoom(room);
    this._broadcast('match-started', room.code, room);
    this.emitLocal('match-started', room);

    setTimeout(() => this._startRound(roomCode), 1400);
  }

  _clearTimers() {
    if (this.roundTimer) clearTimeout(this.roundTimer);
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.botTimers.forEach(t => clearTimeout(t));
    this.botTimers = [];
  }

  _startRound(roomCode) {
    this._clearTimers();
    const room = this._getRooms()[roomCode];
    if (!room || room.status !== 'playing') return;

    if (room.currentQuestionIndex >= room.questions.length) {
      room.status = 'finished';
      this._saveRoom(room);
      const payload = {
        roomCode: room.code,
        totalQuestions: room.questions.length,
        rankings: this._sortRankings(room.players)
      };
      this._broadcast('match-finished', room.code, payload);
      this.emitLocal('match-finished', payload);
      return;
    }

    const q = room.questions[room.currentQuestionIndex];
    room.answeredIds = [];
    this._saveRoom(room);

    const qPayload = {
      index: room.currentQuestionIndex,
      total: room.questions.length,
      question: {
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        timeLimit: 30
      },
      answeredCount: 0,
      totalPlayers: room.players.length
    };
    this._broadcast('room-question', room.code, qPayload);
    this.emitLocal('room-question', qPayload);

    
    room.players.filter(p => p.isBot).forEach(bot => {
      const prof = bot.botProfile || BOT_PROFILES[0];
      const delay = prof.minMs + Math.random() * (prof.maxMs - prof.minMs);
      const t = setTimeout(() => {
        const currentRoom = this._getRooms()[roomCode];
        if (!currentRoom || currentRoom.status !== 'playing') return;
        const b = currentRoom.players.find(p => p.id === bot.id);
        if (!b || currentRoom.answeredIds.includes(bot.id)) return;

        currentRoom.answeredIds.push(bot.id);
        if (Math.random() < prof.accuracy) b.correctCount += 1;
        b.totalResponseTimeMs += Math.round(delay);
        this._saveRoom(currentRoom);

        const prog = {
          playerId: bot.id,
          answeredCount: currentRoom.answeredIds.length,
          totalPlayers: currentRoom.players.length,
          standings: this._sortRankings(currentRoom.players)
        };
        this._broadcast('player-answered', roomCode, prog);
        this.emitLocal('player-answered', prog);

        if (currentRoom.answeredIds.length >= currentRoom.players.length) {
          this._concludeRound(roomCode);
        }
      }, delay);
      this.botTimers.push(t);
    });

    this.roundTimer = setTimeout(() => this._concludeRound(roomCode), 30400);
  }

  submitAnswer({ roomCode, questionIndex, answerIndex, responseTimeMs }) {
    const room = this._getRooms()[roomCode];
    if (!room || room.status !== 'playing' || questionIndex !== room.currentQuestionIndex) return;
    if (room.answeredIds.includes(this.myId)) return;

    const player = room.players.find(p => p.id === this.myId);
    const q = room.questions[room.currentQuestionIndex];
    if (!player || !q) return;

    const cleanMs = Math.min(30000, Math.max(50, Math.round(responseTimeMs)));
    const isCorrect = Number(answerIndex) === q.answerIndex;

    room.answeredIds.push(this.myId);
    if (isCorrect) player.correctCount += 1;
    player.totalResponseTimeMs += cleanMs;
    this._saveRoom(room);

    this.emitLocal('answer-ack', {
      questionIndex,
      isCorrect,
      correctIndex: q.answerIndex,
      explanation: q.explanation,
      responseTimeMs: cleanMs,
      correctCount: player.correctCount,
      totalResponseTimeMs: Math.round(player.totalResponseTimeMs)
    });

    const prog = {
      playerId: this.myId,
      answeredCount: room.answeredIds.length,
      totalPlayers: room.players.length,
      standings: this._sortRankings(room.players)
    };
    this._broadcast('player-answered', roomCode, prog);
    this.emitLocal('player-answered', prog);

    if (room.answeredIds.length >= room.players.length) {
      this._concludeRound(roomCode);
    }
  }

  usePowerup(roomCode, type, ack) {
    const room = this._getRooms()[roomCode];
    if (!room) return ack({ ok: false });
    const q = room.questions[room.currentQuestionIndex];
    if (!q) return ack({ ok: false });

    if (type === '5050') {
      const wrong = [0, 1, 2, 3].filter(i => i !== q.answerIndex);
      ack({ ok: true, eliminate: shuffleArray(wrong).slice(0, 2) });
    } else if (type === 'hint') {
      const letter = ['A', 'B', 'C', 'D'][q.answerIndex];
      ack({ ok: true, hintText: `Gợi ý: Đáp án đúng bắt đầu gần nhóm ${letter} (${q.category})` });
    }
  }

  _concludeRound(roomCode) {
    this._clearTimers();
    const room = this._getRooms()[roomCode];
    if (!room || room.status !== 'playing') return;

    const q = room.questions[room.currentQuestionIndex];
    room.players.forEach(p => {
      if (!room.answeredIds.includes(p.id)) {
        p.totalResponseTimeMs += 30000;
        if (p.id === this.myId) {
          this.emitLocal('round-timeout', {
            questionIndex: room.currentQuestionIndex,
            correctIndex: q.answerIndex,
            explanation: q.explanation
          });
        }
      }
    });
    this._saveRoom(room);

    const endPayload = {
      questionIndex: room.currentQuestionIndex,
      correctIndex: q.answerIndex,
      explanation: q.explanation,
      standings: this._sortRankings(room.players)
    };
    this._broadcast('round-ended', roomCode, endPayload);
    this.emitLocal('round-ended', endPayload);

    this.advanceTimer = setTimeout(() => {
      const r = this._getRooms()[roomCode];
      if (!r || r.status !== 'playing') return;
      r.currentQuestionIndex += 1;
      this._saveRoom(r);
      this._startRound(roomCode);
    }, 2300);
  }

  resetRoom(roomCode) {
    this._clearTimers();
    const room = this._getRooms()[roomCode];
    if (!room) return;
    room.status = 'waiting';
    room.currentQuestionIndex = 0;
    room.questions = this._buildQuestions(room.rawConfig);
    room.players.forEach(p => { p.correctCount = 0; p.totalResponseTimeMs = 0; });
    this._saveRoom(room);
    this._broadcast('room-reset', roomCode, room);
    this.emitLocal('room-reset', room);
  }
}

const GameState = {
  nickname: localStorage.getItem('quizBattle_nickname') || 'Player',
  avatar: localStorage.getItem('quizBattle_avatar') || '🦊',
  category: 'Grammar',
  mode: '1v1', 

  
  roomCode: null,
  myPlayerId: null,
  isHost: false,
  isSocketMode: false,
  lanOrigin: window.location.origin,
  roomQuestionCount: 10,
  roomSource: 'system',
  roomCategory: 'All',
  currentRoomData: null,

  
  playerHP: 100,
  opponentHP: 100,
  playerScore: 0,
  opponentScore: 0,
  combo: 0,
  maxCombo: 0,
  currentQuestionIndex: 0,
  currentRoomQuestion: null,
  questions: [],
  totalQuestions: 10,
  isAnswered: false,
  timeLeft: 30,
  timerInterval: null,
  questionStartPerf: 0,
  freezeBonusMs: 0,
  responseTimesMs: [],
  wrongAnswers: [],
  correctCount: 0,
  totalRoomTimeMs: 0,

  
  powerups: { '5050': false, freeze: false, hint: false },
  shieldActive: false,
  isFrozen: false,
  freezeTimeout: null,
  botTimeout: null,

  
  ceremonyTimers: [],
  ceremonySkipped: false,
  lastRankings: [],

  resetBattle() {
    this.playerHP = 100;
    this.opponentHP = 100;
    this.playerScore = 0;
    this.opponentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.currentQuestionIndex = 0;
    this.currentRoomQuestion = null;
    this.isAnswered = false;
    this.timeLeft = 30;
    this.freezeBonusMs = 0;
    this.responseTimesMs = [];
    this.wrongAnswers = [];
    this.correctCount = 0;
    this.totalRoomTimeMs = 0;
    this.powerups = { '5050': false, freeze: false, hint: false };
    this.shieldActive = false;
    this.isFrozen = false;
    if (this.timerInterval) {
      cancelAnimationFrame(this.timerInterval);
      clearInterval(this.timerInterval);
    }
    if (this.botTimeout) clearTimeout(this.botTimeout);
    if (this.freezeTimeout) clearTimeout(this.freezeTimeout);
    this.timerInterval = null;
    this.botTimeout = null;
    this.freezeTimeout = null;
    if (typeof DOM !== 'undefined' && DOM.screenBattle) {
      DOM.screenBattle.classList.remove('mood-urgent');
      if (DOM.battleVignette) DOM.battleVignette.classList.remove('active');
    }
  }
};

const DOM = {
  screenLobby: document.getElementById('screen-lobby'),
  screenRoomLobby: document.getElementById('screen-room-lobby'),
  screenBattle: document.getElementById('screen-battle'),
  battleVignette: document.getElementById('battle-vignette'),
  screenCeremony: document.getElementById('screen-ceremony'),
  screenResult: document.getElementById('screen-result'),

  
  nicknameInput: document.getElementById('nickname-input'),
  avatarGrid: document.getElementById('avatar-grid'),
  categoryGrid: document.getElementById('category-grid'),
  modeGrid: document.getElementById('mode-grid'),
  btnStart: document.getElementById('btn-start'),
  btnLeaderboard: document.getElementById('btn-leaderboard'),
  connectionStatusBadge: document.getElementById('connection-status-badge'),
  btnOpenCreateRoom: document.getElementById('btn-open-create-room'),
  btnOpenCustomQuiz: document.getElementById('btn-open-custom-quiz'),
  customCountBadge: document.getElementById('custom-count-badge'),
  joinRoomCodeInput: document.getElementById('join-room-code-input'),
  btnJoinRoom: document.getElementById('btn-join-room'),

  
  roomCodeDisplay: document.getElementById('room-code-display'),
  roomMetaTags: document.getElementById('room-meta-tags'),
  roomQrContainer: document.getElementById('room-qr-container'),
  qrUrlHint: document.getElementById('qr-url-hint'),
  btnCopyRoomLink: document.getElementById('btn-copy-room-link'),
  btnCopyRoomCode: document.getElementById('btn-copy-room-code'),
  roomPlayerCount: document.getElementById('room-player-count'),
  roomNetworkIndicator: document.getElementById('room-network-indicator'),
  roomPlayersList: document.getElementById('room-players-list'),
  roomHostControls: document.getElementById('room-host-controls'),
  roomGuestWaiting: document.getElementById('room-guest-waiting'),
  btnAddRoomBot: document.getElementById('btn-add-room-bot'),
  btnStartRoomMatch: document.getElementById('btn-start-room-match'),
  btnLeaveRoom: document.getElementById('btn-leave-room'),

  
  hud1v1: document.getElementById('hud-1v1'),
  hudRoom: document.getElementById('hud-room'),
  playerAvatarDisplay: document.getElementById('player-avatar-display'),
  playerNameDisplay: document.getElementById('player-name-display'),
  playerHPBar: document.getElementById('player-hp-bar'),
  playerHPText: document.getElementById('player-hp-text'),
  playerScoreDisplay: document.getElementById('player-score-display'),
  opponentAvatarDisplay: document.getElementById('opponent-avatar-display'),
  opponentNameDisplay: document.getElementById('opponent-name-display'),
  opponentHPBar: document.getElementById('opponent-hp-bar'),
  opponentHPText: document.getElementById('opponent-hp-text'),
  opponentScoreDisplay: document.getElementById('opponent-score-display'),
  questionCounter: document.getElementById('question-counter'),
  questionTotal: document.getElementById('question-total'),

  roomMeAvatar: document.getElementById('room-me-avatar'),
  roomMeName: document.getElementById('room-me-name'),
  roomMeCorrect: document.getElementById('room-me-correct'),
  roomMeTime: document.getElementById('room-me-time'),
  roomQCounter: document.getElementById('room-q-counter'),
  roomQTotal: document.getElementById('room-q-total'),
  roomAnsweredCount: document.getElementById('room-answered-count'),
  roomMiniStandings: document.getElementById('room-mini-standings'),
  roomRoundStatus: document.getElementById('room-round-status'),

  comboDisplay: document.getElementById('combo-display'),
  comboCount: document.getElementById('combo-count'),
  comboMultiplier: document.getElementById('combo-multiplier'),
  timerBar: document.getElementById('timer-bar'),
  timerText: document.getElementById('timer-text'),
  questionCard: document.getElementById('question-card'),
  questionCategoryBadge: document.getElementById('question-category-badge'),
  questionText: document.getElementById('question-text'),
  optionsGrid: document.getElementById('options-grid'),
  optionTexts: [
    document.getElementById('option-0'),
    document.getElementById('option-1'),
    document.getElementById('option-2'),
    document.getElementById('option-3')
  ],

  powerupsBar: document.getElementById('powerups-bar'),
  powerup5050: document.getElementById('powerup-5050'),
  powerupFreeze: document.getElementById('powerup-freeze'),
  powerupHint: document.getElementById('powerup-hint'),

  explanationOverlay: document.getElementById('explanation-overlay'),
  explanationHeader: document.getElementById('explanation-header'),
  explanationText: document.getElementById('explanation-text'),
  explanationCorrect: document.getElementById('explanation-correct'),
  btnContinue: document.getElementById('btn-continue'),
  damagePopupPlayer: document.getElementById('damage-popup-player'),
  damagePopupOpponent: document.getElementById('damage-popup-opponent'),

  
  ceremonySpotlight: document.getElementById('ceremony-spotlight'),
  ceremonyCrown: document.getElementById('ceremony-crown'),
  ceremonyStatus: document.getElementById('ceremony-status'),
  ceremonyList: document.getElementById('ceremony-list'),
  btnSkipCeremony: document.getElementById('btn-skip-ceremony'),
  ceremonyActions: document.getElementById('ceremony-actions'),
  btnCeremonyReview: document.getElementById('btn-ceremony-review'),
  ceremonyWrongCount: document.getElementById('ceremony-wrong-count'),
  btnCeremonyRematch: document.getElementById('btn-ceremony-rematch'),
  btnCeremonyHome: document.getElementById('btn-ceremony-home'),

  
  resultBanner: document.getElementById('result-banner'),
  resultIcon: document.getElementById('result-icon'),
  resultTitle: document.getElementById('result-title'),
  resultSubtitle: document.getElementById('result-subtitle'),
  statTotalScore: document.getElementById('stat-total-score'),
  statCorrect: document.getElementById('stat-correct'),
  statCombo: document.getElementById('stat-combo'),
  statAvgTime: document.getElementById('stat-avg-time'),
  reviewList: document.getElementById('review-list'),
  reviewEmpty: document.getElementById('review-empty'),
  btnRematch: document.getElementById('btn-rematch'),
  btnHome: document.getElementById('btn-home'),

  
  modalCreateRoom: document.getElementById('modal-create-room'),
  btnCloseCreateRoom: document.getElementById('btn-close-create-room'),
  roomQcountSelector: document.getElementById('room-qcount-selector'),
  roomSourceSelector: document.getElementById('room-source-selector'),
  roomSystemCategory: document.getElementById('room-system-category'),
  roomSystemCatGroup: document.getElementById('room-system-cat-group'),
  roomCustomHelper: document.getElementById('room-custom-helper'),
  modalCustomCount: document.getElementById('modal-custom-count'),
  btnCreateToCustomEditor: document.getElementById('btn-create-to-custom-editor'),
  btnConfirmCreateRoom: document.getElementById('btn-confirm-create-room'),

  modalCustomQuiz: document.getElementById('modal-custom-quiz'),
  btnCloseCustomQuiz: document.getElementById('btn-close-custom-quiz'),
  cqForm: document.getElementById('cq-form'),
  cqEditIndex: document.getElementById('cq-edit-index'),
  cqQuestion: document.getElementById('cq-question'),
  cqCategory: document.getElementById('cq-category'),
  cqOpts: [
    document.getElementById('cq-opt-0'),
    document.getElementById('cq-opt-1'),
    document.getElementById('cq-opt-2'),
    document.getElementById('cq-opt-3')
  ],
  cqExplanation: document.getElementById('cq-explanation'),
  cqSubmitBtn: document.getElementById('cq-submit-btn'),
  cqCancelEditBtn: document.getElementById('cq-cancel-edit-btn'),
  cqList: document.getElementById('cq-list'),
  cqListCount: document.getElementById('cq-list-count'),
  cqSampleBtn: document.getElementById('cq-sample-btn'),
  cqImportBtn: document.getElementById('cq-import-btn'),
  cqImportFile: document.getElementById('cq-import-file'),
  cqExportBtn: document.getElementById('cq-export-btn'),
  cqClearBtn: document.getElementById('cq-clear-btn'),

  modalReview: document.getElementById('modal-review'),
  btnCloseReview: document.getElementById('btn-close-review'),
  modalReviewList: document.getElementById('modal-review-list'),
  modalReviewEmpty: document.getElementById('modal-review-empty'),

  modalLeaderboard: document.getElementById('modal-leaderboard'),
  leaderboardList: document.getElementById('leaderboard-list'),
  btnCloseLeaderboard: document.getElementById('btn-close-leaderboard'),

  transitionOverlay: document.getElementById('transition-overlay'),
  transitionText: document.getElementById('transition-text'),
  koOverlay: document.getElementById('ko-overlay'),
  langToggle: document.getElementById('lang-toggle'),
  themeToggle: document.getElementById('theme-toggle'),
  audioToggle: document.getElementById('audio-toggle'),
  toastNotification: document.getElementById('toast-notification')
};

const sound = new SoundEngine();
const particles = new ParticleSystem(document.getElementById('particles-canvas'));
const fireworks = new FireworksEngine(document.getElementById('ceremony-canvas'));
const localSim = new LocalRoomSimulator();
let socket = null;

function initTransport() {
  if (typeof io !== 'undefined' && window.location.protocol !== 'file:') {
    socket = io({ reconnectionAttempts: 2, timeout: 1500 });
    socket.on('connect', () => {
      GameState.isSocketMode = true;
      DOM.connectionStatusBadge.textContent = '🌐 Server Real-time';
      DOM.connectionStatusBadge.classList.remove('local-mode');
    });
    socket.on('connect_error', () => {
      activateLocalFallback();
    });

    
    fetch('/api/server-info')
      .then(r => r.json())
      .then(info => {
        const host = window.location.hostname;
        if ((host === 'localhost' || host === '127.0.0.1') && info.lanIp) {
          GameState.lanOrigin = `http://${info.lanIp}:${info.port}`;
        } else {
          GameState.lanOrigin = window.location.origin;
        }
      })
      .catch(() => {});

    bindRoomEvents(socket);
  } else {
    activateLocalFallback();
  }

  bindRoomEvents(localSim);
}

function activateLocalFallback() {
  GameState.isSocketMode = false;
  DOM.connectionStatusBadge.textContent = '💻 Local Simulator';
  DOM.connectionStatusBadge.classList.add('local-mode');
}

function bindRoomEvents(transport) {
  transport.on('room-updated', (room) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    GameState.currentRoomData = room;
    renderRoomLobby(room);
  });

  transport.on('match-started', (room) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    GameState.mode = 'room';
    GameState.resetBattle();
    GameState.currentRoomData = room;
    GameState.totalQuestions = room.questionCount;
    setupRoomBattleHUD(room);
    showTransition('PHÒNG ĐẤU BẮT ĐẦU!', () => {
      switchScreen('screen-battle');
    });
  });

  transport.on('room-question', (payload) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    renderRoomQuestion(payload);
  });

  transport.on('answer-ack', (ack) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    handleRoomAnswerAck(ack);
  });

  transport.on('player-answered', (prog) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    DOM.roomAnsweredCount.textContent = `${prog.answeredCount}/${prog.totalPlayers}`;
    renderMiniStandings(prog.standings);
  });

  transport.on('round-timeout', (data) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    handleRoomTimeout(data);
  });

  transport.on('round-ended', (data) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    handleRoomRoundEnded(data);
  });

  transport.on('match-finished', (data) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    stopSharedTimer();
    startAwardCeremony(data.rankings, data.totalQuestions);
  });

  transport.on('room-reset', (room) => {
    if (transport === socket && !GameState.isSocketMode) return;
    if (transport === localSim && GameState.isSocketMode) return;
    fireworks.stop();
    GameState.currentRoomData = room;
    renderRoomLobby(room);
    switchScreen('screen-room-lobby');
  });

  if (transport === socket) {
    socket.on('kicked-from-room', () => {
      showToast('Bạn đã bị chủ phòng mời ra khỏi phòng.');
      GameState.roomCode = null;
      switchScreen('screen-lobby');
    });
  }
}

function getRoomInviteUrl(code) {
  const base = GameState.isSocketMode ? GameState.lanOrigin : window.location.origin + window.location.pathname;
  const cleanBase = base.endsWith('/') ? base : (base.includes('.html') ? base : base + '/');
  return `${cleanBase}?room=${code}`;
}

async function renderQRCode(code) {
  const url = getRoomInviteUrl(code);
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  DOM.roomQrContainer.innerHTML = '';
  DOM.qrUrlHint.textContent = url;

  if (typeof window.QRCode !== 'undefined') {
    new window.QRCode(DOM.roomQrContainer, {
      text: url,
      width: 152,
      height: 152,
      colorDark: isLight ? '#0077b6' : '#00f0ff',
      colorLight: isLight ? '#ffffff' : '#0a0a1a',
      correctLevel: window.QRCode.CorrectLevel.M
    });
    return;
  }

  
  if (GameState.isSocketMode) {
    try {
      const res = await fetch('/api/qrcode?text=' + encodeURIComponent(url));
      const data = await res.json();
      if (data.dataUrl) {
        const img = document.createElement('img');
        img.src = data.dataUrl;
        img.alt = 'QR Code';
        DOM.roomQrContainer.appendChild(img);
        return;
      }
    } catch {  }
  }

  DOM.roomQrContainer.innerHTML = `<div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--cyan);text-align:center;">ROOM<br><strong style="font-size:1.3rem">${code}</strong></div>`;
}

function renderRoomLobby(room) {
  GameState.isHost = room.hostId === GameState.myPlayerId;
  DOM.roomCodeDisplay.textContent = room.code;
  DOM.roomPlayerCount.textContent = room.players.length;
  DOM.roomNetworkIndicator.textContent = GameState.isSocketMode ? '🌐 Real-time' : '💻 Local Simulator';

  const customStr = window.t ? window.t('pillCustom') : 'Custom';
  const sysStr = window.t ? window.t('pillSystem') : 'System';
  const qStr = window.t ? window.t('pillQuestions') : 'Questions';
  const secStr = window.t ? window.t('pillSecPerQ') : '30s / Q';
  const badgeHost = window.t ? window.t('badgeHost') : '👑 HOST';
  const badgeBot = window.t ? window.t('badgeBot') : '🤖 BOT';
  const badgeMe = window.t ? window.t('badgeMe') : 'YOU';

  const sourceLabel = room.source === 'custom' ? customStr : `${sysStr} (${room.category})`;
  DOM.roomMetaTags.innerHTML = `
    <span class="meta-pill">${room.questionCount} ${qStr}</span>
    <span class="meta-pill">${secStr}</span>
    <span class="meta-pill">${escapeHTML(sourceLabel)}</span>
  `;

  DOM.roomPlayersList.innerHTML = '';
  room.players.forEach(p => {
    const chip = document.createElement('div');
    const isMe = p.id === GameState.myPlayerId;
    chip.className = `room-player-chip ${isMe ? 'is-me' : ''} ${p.isHost ? 'is-host' : ''}`;
    chip.innerHTML = `
      <span class="rp-avatar">${p.avatar}</span>
      <div class="rp-info">
        <div class="rp-name">${escapeHTML(p.nickname)}</div>
        <div class="rp-badges">
          ${p.isHost ? `<span class="rp-badge host">${badgeHost}</span>` : ''}
          ${p.isBot ? `<span class="rp-badge bot">${badgeBot}</span>` : ''}
          ${isMe ? `<span class="rp-badge me">${badgeMe}</span>` : ''}
        </div>
      </div>
      ${GameState.isHost && !p.isHost ? `<button class="rp-kick-btn" data-kick="${p.id}" title="Remove">&times;</button>` : ''}
    `;
    DOM.roomPlayersList.appendChild(chip);
  });

  DOM.roomHostControls.style.display = GameState.isHost ? 'grid' : 'none';
  DOM.roomGuestWaiting.style.display = GameState.isHost ? 'none' : 'flex';
}

function handleCreateRoom() {
  syncProfileFromInputs();
  const customQuestions = CustomQuizManager.load();
  if (GameState.roomSource === 'custom' && customQuestions.length === 0) {
    showToast(window.t ? window.t('toastNeedCustomQuestions') : '⚠️ Please add custom questions first!');
    openCustomQuizModal();
    return;
  }

  const payload = {
    nickname: GameState.nickname,
    avatar: GameState.avatar,
    questionCount: GameState.roomQuestionCount,
    source: GameState.roomSource,
    category: GameState.roomCategory,
    customQuestions
  };

  const onCreated = (res) => {
    if (!res || !res.ok) {
      showToast(res?.error || (window.t ? window.t('toastCannotCreateRoom') : 'Unable to create room!'));
      return;
    }
    GameState.roomCode = res.room.code;
    GameState.myPlayerId = res.playerId;
    GameState.currentRoomData = res.room;
    DOM.modalCreateRoom.style.display = 'none';
    renderRoomLobby(res.room);
    renderQRCode(res.room.code);
    switchScreen('screen-room-lobby');
    showToast(window.t ? window.t('toastRoomCreated', res.room.code) : `✅ Room ${res.room.code} created!`);
  };

  if (GameState.isSocketMode && socket) {
    socket.emit('create-room', payload, onCreated);
  } else {
    localSim.createRoom(payload, onCreated);
  }
}

function handleJoinRoom(codeOverride) {
  syncProfileFromInputs();
  const code = String(codeOverride || DOM.joinRoomCodeInput.value || '').trim();
  if (!/^\d{6}$/.test(code)) {
    showToast(window.t ? window.t('toastEnter6Digits') : '⚠️ Please enter a valid 6-digit room code!');
    return;
  }

  const payload = { roomCode: code, nickname: GameState.nickname, avatar: GameState.avatar };
  const onJoined = (res) => {
    if (!res || !res.ok) {
      showToast(res?.error || (window.t ? window.t('toastCannotJoinRoom') : 'Unable to join room!'));
      return;
    }
    GameState.roomCode = res.room.code;
    GameState.myPlayerId = res.playerId;
    GameState.currentRoomData = res.room;
    renderRoomLobby(res.room);
    renderQRCode(res.room.code);
    switchScreen('screen-room-lobby');
    showToast(window.t ? window.t('toastRoomJoined', res.room.code) : `🎉 Joined room ${res.room.code}!`);
  };

  if (GameState.isSocketMode && socket) {
    socket.emit('join-room', payload, onJoined);
  } else {
    localSim.joinRoom(payload, onJoined);
  }
}

function setupRoomBattleHUD(room) {
  DOM.hud1v1.style.display = 'none';
  DOM.comboDisplay.style.display = 'none';
  DOM.hudRoom.style.display = 'grid';
  DOM.roomRoundStatus.style.display = 'none';
  DOM.explanationOverlay.style.display = 'none';

  DOM.roomMeAvatar.textContent = GameState.avatar;
  DOM.roomMeName.textContent = GameState.nickname;
  DOM.roomMeCorrect.textContent = '0';
  DOM.roomMeTime.textContent = '0.000s';
  DOM.roomQTotal.textContent = room.questionCount;

  
  DOM.powerup5050.classList.remove('used');
  DOM.powerupFreeze.classList.remove('used');
  DOM.powerupHint.classList.remove('used');
}

function renderMiniStandings(standings) {
  if (!Array.isArray(standings)) return;
  DOM.roomMiniStandings.innerHTML = standings
    .slice(0, 3)
    .map(p => `<div class="mini-standing-row">#${p.rank} ${p.avatar} ${escapeHTML(p.nickname)} — <strong>${p.correctCount}đ</strong> (${formatMs(p.totalResponseTimeMs)})</div>`)
    .join('');
}

function renderRoomQuestion(payload) {
  const { index, total, question, answeredCount, totalPlayers } = payload;
  GameState.currentQuestionIndex = index;
  GameState.currentRoomQuestion = question;
  GameState.isAnswered = false;
  GameState.shieldActive = false;
  GameState.isFrozen = false;
  GameState.freezeBonusMs = 0;

  DOM.roomQCounter.textContent = index + 1;
  DOM.roomQTotal.textContent = total;
  DOM.roomAnsweredCount.textContent = `${answeredCount}/${totalPlayers}`;
  DOM.roomRoundStatus.style.display = 'none';
  DOM.questionCategoryBadge.textContent = String(question.category || 'QUIZ').toUpperCase();
  DOM.questionText.textContent = question.question;

  const optColors = ['red', 'blue', 'yellow', 'green'];
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach((btn, i) => {
    btn.className = `option-btn opt-${optColors[i]}`;
    DOM.optionTexts[i].textContent = question.options[i];
  });
  document.querySelectorAll('.hint-popup').forEach(el => el.remove());
  DOM.questionCard.classList.remove('shield-active');
  DOM.questionCard.classList.remove('slide-in');
  void DOM.questionCard.offsetWidth;
  DOM.questionCard.classList.add('slide-in');
  if (DOM.screenBattle) DOM.screenBattle.classList.remove('mood-urgent');
  if (DOM.battleVignette) DOM.battleVignette.classList.remove('active');

  GameState.timeLeft = 30;
  GameState.questionStartPerf = performance.now();
  startSharedTimer(30, false);
}

function submitRoomAnswer(selectedIndex) {
  if (GameState.isAnswered) return;
  GameState.isAnswered = true;
  stopSharedTimer();
  if (GameState.freezeTimeout) clearTimeout(GameState.freezeTimeout);

  const rawElapsed = performance.now() - GameState.questionStartPerf - GameState.freezeBonusMs;
  const responseTimeMs = Math.min(30000, Math.max(50, Math.round(rawElapsed)));

  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => btn.classList.add('disabled'));
  GameState._pendingSelectedIdx = selectedIndex;

  const payload = {
    roomCode: GameState.roomCode,
    questionIndex: GameState.currentQuestionIndex,
    answerIndex: selectedIndex,
    responseTimeMs
  };

  if (GameState.isSocketMode && socket) {
    socket.emit('submit-answer', payload);
  } else {
    localSim.submitAnswer(payload);
  }
}

function handleRoomAnswerAck(ack) {
  GameState.correctCount = ack.correctCount;
  GameState.totalRoomTimeMs = ack.totalResponseTimeMs;
  DOM.roomMeCorrect.textContent = ack.correctCount;
  DOM.roomMeTime.textContent = formatMs(ack.totalResponseTimeMs);

  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns[ack.correctIndex].classList.add('correct');

  if (ack.isCorrect) {
    sound.play('correct');
    const correctBtn = optBtns[ack.correctIndex];
    if (correctBtn) {
      const rect = correctBtn.getBoundingClientRect();
      particles.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#00ff88');
    }
    const title = window.t ? window.t('roundCorrectTitle') : '✅ CORRECT!';
    const timeLabel = window.t ? window.t('responseTimeLabel') : 'Response time:';
    const waitLabel = window.t ? window.t('waitingOtherPlayers') : 'Waiting for other contestants to finish this question...';
    DOM.roomRoundStatus.innerHTML = `<span class="neon-text-green">${title}</span> ${timeLabel} <strong>${formatMs(ack.responseTimeMs)}</strong><br><small style="color:var(--gray)">${waitLabel}</small>`;
  } else {
    sound.play('wrong');
    if (GameState._pendingSelectedIdx !== undefined && optBtns[GameState._pendingSelectedIdx]) {
      optBtns[GameState._pendingSelectedIdx].classList.add('wrong');
    }
    const q = GameState.currentRoomQuestion;
    if (q) {
      GameState.wrongAnswers.push({
        question: q.question,
        yourAnswer: q.options[GameState._pendingSelectedIdx] || 'Unselected',
        correctAnswer: q.options[ack.correctIndex],
        explanation: ack.explanation
      });
    }
    const title = window.t ? window.t('roundIncorrectTitle') : '❌ INCORRECT!';
    const ansIs = window.t ? window.t('correctAnswerIs') : 'Correct answer:';
    DOM.roomRoundStatus.innerHTML = `<span class="neon-text-red">${title}</span> (${formatMs(ack.responseTimeMs)}) • ${ansIs} <strong style="color:var(--green)">${escapeHTML(q?.options[ack.correctIndex] || '')}</strong><br><small style="color:var(--gray)">💡 ${escapeHTML(ack.explanation)}</small>`;
  }
  DOM.roomRoundStatus.style.display = 'block';
}

function handleRoomTimeout(data) {
  if (GameState.isAnswered) return;
  GameState.isAnswered = true;
  stopSharedTimer();
  sound.play('wrong');

  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => btn.classList.add('disabled'));
  if (optBtns[data.correctIndex]) optBtns[data.correctIndex].classList.add('correct');

  const q = GameState.currentRoomQuestion;
  if (q) {
    GameState.wrongAnswers.push({
      question: q.question,
      yourAnswer: '⏰ Timeout (30.000s)',
      correctAnswer: q.options[data.correctIndex],
      explanation: data.explanation
    });
  }
  GameState.totalRoomTimeMs += 30000;
  DOM.roomMeTime.textContent = formatMs(GameState.totalRoomTimeMs);

  const title = window.t ? window.t('roundTimeoutTitle') : '⏰ TIME\'S UP! (+30.000s)';
  const ansIs = window.t ? window.t('correctAnswerIs') : 'Correct answer:';
  DOM.roomRoundStatus.innerHTML = `<span class="neon-text-red">${title}</span> • ${ansIs} <strong style="color:var(--green)">${escapeHTML(q?.options[data.correctIndex] || '')}</strong><br><small style="color:var(--gray)">💡 ${escapeHTML(data.explanation)}</small>`;
  DOM.roomRoundStatus.style.display = 'block';
}

function handleRoomRoundEnded(data) {
  renderMiniStandings(data.standings);
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  if (optBtns[data.correctIndex]) optBtns[data.correctIndex].classList.add('correct');
}

function startAwardCeremony(rankings, totalQuestions) {
  GameState.lastRankings = rankings;
  GameState.ceremonySkipped = false;
  GameState.ceremonyTimers.forEach(t => clearTimeout(t));
  GameState.ceremonyTimers = [];

  fireworks.stop();
  DOM.ceremonySpotlight.classList.remove('active');
  DOM.ceremonyActions.style.display = 'none';
  DOM.btnSkipCeremony.style.display = 'inline-block';
  DOM.ceremonyWrongCount.textContent = GameState.wrongAnswers.length;
  DOM.ceremonyStatus.textContent = window.t ? window.t('ceremonyStatusInit') : 'Preparing leaderboard reveal from bottom to top...';

  DOM.ceremonyList.innerHTML = '';
  const pendingStr = window.t ? window.t('ceremonySlotWaiting') : 'Pending reveal...';
  const slots = rankings.map((player) => {
    const slot = document.createElement('div');
    slot.className = `ceremony-slot rank-${player.rank}`;
    const medal = player.rank === 1 ? '👑 #1' : player.rank === 2 ? '🥈 #2' : player.rank === 3 ? '🥉 #3' : `#${player.rank}`;
    slot.innerHTML = `
      <div class="c-rank-badge">${medal}</div>
      <div class="c-avatar">${player.avatar}</div>
      <div class="c-info">
        <div class="c-name">???</div>
        <div class="c-sub">${pendingStr}</div>
      </div>
      <div class="c-metrics">
        <div class="c-correct">--/--</div>
        <div class="c-time">--.---s</div>
      </div>
    `;
    DOM.ceremonyList.appendChild(slot);
    return { slot, player };
  });

  switchScreen('screen-ceremony');

  let cumulativeDelay = 700;
  for (let idx = rankings.length - 1; idx >= 0; idx--) {
    const rank = rankings[idx].rank;
    let suspenseWait = 550;
    if (rank === 3) suspenseWait = 1350;
    else if (rank === 2) suspenseWait = 2000;
    else if (rank === 1) suspenseWait = 2700;

    if (rank <= 3) {
      const focusDelay = cumulativeDelay;
      const tFocus = setTimeout(() => {
        if (GameState.ceremonySkipped) return;
        slots[idx].slot.classList.add('suspense-focus');
        sound.play('suspense');
        DOM.ceremonyStatus.textContent = rank === 1
          ? (window.t ? window.t('ceremonyChampionSuspense') : '🔥 SUSPENSE... WHO WILL BE THE #1 CHAMPION?!')
          : (window.t ? window.t('ceremonyRunnerUpSuspense', rank) : `🥁 Preparing to announce Rank #${rank}...`);
      }, focusDelay);
      GameState.ceremonyTimers.push(tFocus);
    }

    cumulativeDelay += suspenseWait;
    const revealDelay = cumulativeDelay;

    const tReveal = setTimeout(() => {
      if (GameState.ceremonySkipped) return;
      revealCeremonySlot(slots[idx].slot, slots[idx].player, totalQuestions);
      if (rank === 1) {
        triggerWinnerCelebration(slots[idx].player);
      } else {
        DOM.ceremonyStatus.textContent = window.t
          ? window.t('ceremonyRevealedRank', rank, slots[idx].player.nickname)
          : `✨ Revealed Rank #${rank}: ${slots[idx].player.nickname}!`;
      }
    }, revealDelay);
    GameState.ceremonyTimers.push(tReveal);
  }
}

function revealCeremonySlot(slotEl, player, totalQuestions) {
  slotEl.classList.remove('suspense-focus');
  slotEl.classList.add('revealed');
  const youStr = window.t ? window.t('badgeMe') : 'YOU';
  const isMeStr = player.id === GameState.myPlayerId ? ` (${youStr})` : '';
  const subStr = player.isBot
    ? (window.t ? window.t('ceremonySlotSubBot') : '🤖 AI Bot')
    : (player.isHost ? (window.t ? window.t('ceremonySlotSubHost') : '👑 Host') : (window.t ? window.t('ceremonySlotSubPlayer') : '⚔️ Contestant'));
  const correctStr = window.t
    ? window.t('ceremonySlotCorrect', player.correctCount, totalQuestions)
    : `${player.correctCount}/${totalQuestions} Correct`;

  slotEl.querySelector('.c-name').textContent = player.nickname + isMeStr;
  slotEl.querySelector('.c-sub').textContent = subStr;
  slotEl.querySelector('.c-correct').textContent = correctStr;
  slotEl.querySelector('.c-time').textContent = `⏱️ ${formatMs(player.totalResponseTimeMs)}`;

  if (player.rank > 1) {
    sound.play('reveal');
  }
  slotEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function triggerWinnerCelebration(winner) {
  DOM.ceremonySpotlight.classList.add('active');
  DOM.ceremonyStatus.textContent = window.t
    ? window.t('ceremonyChampionCelebrate', `${winner.avatar} ${winner.nickname}`, winner.correctCount, formatMs(winner.totalResponseTimeMs))
    : `🎉 CONGRATULATIONS CHAMPION: ${winner.avatar} ${winner.nickname} (${winner.correctCount} correct • ${formatMs(winner.totalResponseTimeMs)})!`;
  sound.play('champion');
  fireworks.start();
  DOM.btnSkipCeremony.style.display = 'none';
  DOM.ceremonyActions.style.display = 'flex';
}

function skipCeremonyReveal() {
  GameState.ceremonySkipped = true;
  GameState.ceremonyTimers.forEach(t => clearTimeout(t));
  GameState.ceremonyTimers = [];

  const totalQ = GameState.totalQuestions || 10;
  const slotEls = DOM.ceremonyList.querySelectorAll('.ceremony-slot');
  GameState.lastRankings.forEach((p, i) => {
    if (slotEls[i] && !slotEls[i].classList.contains('revealed')) {
      revealCeremonySlot(slotEls[i], p, totalQ);
    }
  });
  if (GameState.lastRankings[0]) {
    triggerWinnerCelebration(GameState.lastRankings[0]);
  }
}

function startClassicGame() {
  syncProfileFromInputs();
  GameState.resetBattle();

  const cats = CATEGORY_MAP[GameState.category] || ['Grammar', 'Vocabulary'];
  let pool = QUIZ_DATA.filter(q => cats.includes(q.category));
  if (pool.length < 10) {
    pool = [...pool, ...shuffleArray(QUIZ_DATA.filter(q => !cats.includes(q.category)))];
  }
  GameState.questions = shuffleArray(pool).slice(0, Math.min(10, pool.length));
  GameState.totalQuestions = GameState.questions.length;

  DOM.hudRoom.style.display = 'none';
  DOM.roomRoundStatus.style.display = 'none';
  DOM.hud1v1.style.display = 'flex';
  DOM.playerAvatarDisplay.textContent = GameState.avatar;
  DOM.playerNameDisplay.textContent = GameState.nickname;
  DOM.questionTotal.textContent = GameState.totalQuestions;

  if (GameState.mode === 'solo') {
    DOM.opponentAvatarDisplay.textContent = '⏱️';
    DOM.opponentNameDisplay.textContent = 'SPEEDRUN';
    document.querySelector('.opponent-card').style.opacity = '0.5';
  } else {
    const botNames = ['AI_Master', 'QuizBot_X', 'NeonBot', 'CyberAI', 'EnglishPro'];
    const botAvatars = ['🤖', '👾', '🧠', '💀', '🎯'];
    const idx = Math.floor(Math.random() * botNames.length);
    DOM.opponentAvatarDisplay.textContent = botAvatars[idx];
    DOM.opponentNameDisplay.textContent = botNames[idx];
    document.querySelector('.opponent-card').style.opacity = '1';
  }

  updateHPBar(DOM.playerHPBar, DOM.playerHPText, 100);
  updateHPBar(DOM.opponentHPBar, DOM.opponentHPText, 100);
  DOM.playerScoreDisplay.textContent = '0';
  DOM.opponentScoreDisplay.textContent = '0';
  DOM.powerup5050.classList.remove('used');
  DOM.powerupFreeze.classList.remove('used');
  DOM.powerupHint.classList.remove('used');
  DOM.comboDisplay.style.display = 'none';

  showTransition('GET READY!', () => {
    switchScreen('screen-battle');
    loadClassicQuestion();
  });
}

function loadClassicQuestion() {
  if (GameState.currentQuestionIndex >= GameState.totalQuestions) {
    endClassicGame();
    return;
  }
  if (GameState.playerHP <= 0 || (GameState.opponentHP <= 0 && GameState.mode === '1v1')) {
    showKO(() => endClassicGame());
    return;
  }

  const q = GameState.questions[GameState.currentQuestionIndex];
  GameState.isAnswered = false;
  GameState.shieldActive = false;
  GameState.isFrozen = false;
  GameState.freezeBonusMs = 0;

  DOM.questionCounter.textContent = GameState.currentQuestionIndex + 1;
  DOM.questionCategoryBadge.textContent = q.category.toUpperCase();
  DOM.questionText.textContent = q.question;

  const optColors = ['red', 'blue', 'yellow', 'green'];
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach((btn, i) => {
    btn.className = `option-btn opt-${optColors[i]}`;
    DOM.optionTexts[i].textContent = q.options[i];
  });
  document.querySelectorAll('.hint-popup').forEach(el => el.remove());
  DOM.questionCard.classList.remove('shield-active');
  DOM.questionCard.classList.remove('slide-in');
  void DOM.questionCard.offsetWidth;
  DOM.questionCard.classList.add('slide-in');
  if (DOM.screenBattle) DOM.screenBattle.classList.remove('mood-urgent');
  if (DOM.battleVignette) DOM.battleVignette.classList.remove('active');

  const limit = q.timeLimit || 30;
  GameState.timeLeft = limit;
  GameState.questionStartPerf = performance.now();
  startSharedTimer(limit, true);

  if (GameState.mode === '1v1') {
    scheduleClassicBotAnswer();
  }
}

let _lastTimerState = '';
let _lastTimerText = '';
const _timerSectionEl = document.querySelector('.timer-section');

function stopSharedTimer() {
  if (GameState.timerInterval) {
    cancelAnimationFrame(GameState.timerInterval);
    clearInterval(GameState.timerInterval);
    GameState.timerInterval = null;
  }
}

function startSharedTimer(maxSeconds, autoTimeout) {
  stopSharedTimer();
  _lastTimerState = '';
  _lastTimerText = '';
  GameState.timeLeft = maxSeconds;
  updateTimerDisplay(maxSeconds);

  let lastFrame = performance.now();
  let lastWarningSecond = -1;

  const tick = (now) => {
    const dt = (now - lastFrame) / 1000;
    lastFrame = now;

    if (!GameState.isFrozen) {
      GameState.timeLeft = Math.max(0, GameState.timeLeft - dt);
    }

    updateTimerDisplay(maxSeconds);

    const ceilSec = Math.ceil(GameState.timeLeft);
    if (!GameState.isFrozen && ceilSec <= 5 && ceilSec >= 1 && ceilSec !== lastWarningSecond) {
      lastWarningSecond = ceilSec;
      sound.play('timeWarning');
    }

    if (GameState.timeLeft <= 0) {
      GameState.timerInterval = null;
      if (autoTimeout && !GameState.isAnswered) {
        handleClassicTimeout();
      }
      return;
    }

    GameState.timerInterval = requestAnimationFrame(tick);
  };

  GameState.timerInterval = requestAnimationFrame(tick);
}

function updateTimerDisplay(maxSeconds) {
  const ratio = Math.max(0, Math.min(1, GameState.timeLeft / maxSeconds));
  DOM.timerBar.style.transform = `scaleX(${ratio})`;

  const formatted = GameState.timeLeft.toFixed(1) + 's';
  if (formatted !== _lastTimerText) {
    _lastTimerText = formatted;
    DOM.timerText.textContent = formatted;
  }

  const nextState = GameState.isFrozen
    ? 'frozen'
    : GameState.timeLeft <= 5
      ? 'danger'
      : GameState.timeLeft <= 10
        ? 'warning'
        : 'normal';

  if (nextState !== _lastTimerState) {
    _lastTimerState = nextState;
    DOM.timerBar.classList.remove('timer-warning', 'timer-danger');
    DOM.timerText.classList.remove('timer-warning-text', 'timer-danger-text');
    if (_timerSectionEl) _timerSectionEl.classList.remove('timer-frozen');

    if (nextState === 'frozen' && _timerSectionEl) {
      _timerSectionEl.classList.add('timer-frozen');
    } else if (nextState === 'danger') {
      DOM.timerBar.classList.add('timer-danger');
      DOM.timerText.classList.add('timer-danger-text');
    } else if (nextState === 'warning') {
      DOM.timerBar.classList.add('timer-warning');
      DOM.timerText.classList.add('timer-warning-text');
    }

    
    if ((nextState === 'danger' || nextState === 'warning') && !GameState.isFrozen) {
      if (DOM.screenBattle) DOM.screenBattle.classList.add('mood-urgent');
      if (DOM.battleVignette) DOM.battleVignette.classList.add('active');
    } else {
      if (DOM.screenBattle) DOM.screenBattle.classList.remove('mood-urgent');
      if (DOM.battleVignette) DOM.battleVignette.classList.remove('active');
    }
  }
}

function handleClassicAnswer(selectedIndex) {
  if (GameState.isAnswered) return;
  GameState.isAnswered = true;
  stopSharedTimer();
  if (GameState.botTimeout) clearTimeout(GameState.botTimeout);
  if (GameState.freezeTimeout) clearTimeout(GameState.freezeTimeout);
  GameState.isFrozen = false;

  const q = GameState.questions[GameState.currentQuestionIndex];
  const elapsedMs = Math.max(50, Math.round(performance.now() - GameState.questionStartPerf - GameState.freezeBonusMs));
  GameState.responseTimesMs.push(elapsedMs);
  const elapsedSec = elapsedMs / 1000;
  const isCorrect = selectedIndex === q.answerIndex;

  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => btn.classList.add('disabled'));
  optBtns[q.answerIndex].classList.add('correct');

  if (isCorrect) {
    sound.play('correct');
    const clickedBtn = optBtns[selectedIndex];
    if (clickedBtn) {
      const rect = clickedBtn.getBoundingClientRect();
      particles.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#00ff88');
    }
    GameState.correctCount++;
    GameState.combo++;
    if (GameState.combo > GameState.maxCombo) GameState.maxCombo = GameState.combo;

    const baseScore = elapsedSec <= 3 ? 100 : Math.max(30, Math.round(100 - (elapsedSec - 3) * (70 / 27)));
    const baseDamage = elapsedSec <= 3 ? 25 : 15;
    const mult = GameState.combo >= 3 ? 1.5 : 1;
    if (GameState.combo >= 3) sound.play('combo');

    GameState.playerScore += Math.round(baseScore * mult);
    const dmg = Math.round(baseDamage * mult);

    if (GameState.mode === '1v1') {
      GameState.opponentHP = Math.max(0, GameState.opponentHP - dmg);
      updateHPBar(DOM.opponentHPBar, DOM.opponentHPText, GameState.opponentHP);
      showDamagePopup(DOM.damagePopupOpponent, `-${dmg} HP`, 'damage-dealt');
      sound.play('damage');
      document.querySelector('.opponent-card').classList.add('shake-hit');
      setTimeout(() => document.querySelector('.opponent-card').classList.remove('shake-hit'), 500);
    }

    DOM.playerScoreDisplay.textContent = GameState.playerScore;
    if (GameState.combo >= 2) {
      DOM.comboDisplay.style.display = 'block';
      DOM.comboCount.textContent = GameState.combo;
      DOM.comboMultiplier.textContent = GameState.combo >= 3 ? 'MULTIPLIER x1.5 ACTIVE!' : '';
    }
    showClassicExplanation(q, true, () => {
      GameState.currentQuestionIndex++;
      loadClassicQuestion();
    });
  } else {
    optBtns[selectedIndex].classList.add('wrong');
    applyClassicPenalty(q, q.options[selectedIndex]);
  }
}

function handleClassicTimeout() {
  GameState.isAnswered = true;
  if (GameState.botTimeout) clearTimeout(GameState.botTimeout);
  const q = GameState.questions[GameState.currentQuestionIndex];
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => btn.classList.add('disabled'));
  optBtns[q.answerIndex].classList.add('correct');
  GameState.responseTimesMs.push((q.timeLimit || 30) * 1000);
  applyClassicPenalty(q, '⏰ Hết giờ');
}

function applyClassicPenalty(q, yourAnswerText) {
  sound.play('wrong');
  GameState.combo = 0;
  DOM.comboDisplay.style.display = 'none';

  if (GameState.shieldActive) {
    showDamagePopup(DOM.damagePopupPlayer, '🛡️ SHIELDED!', 'heal');
    GameState.shieldActive = false;
    DOM.questionCard.classList.remove('shield-active');
  } else {
    GameState.playerHP = Math.max(0, GameState.playerHP - 20);
    updateHPBar(DOM.playerHPBar, DOM.playerHPText, GameState.playerHP);
    showDamagePopup(DOM.damagePopupPlayer, '-20 HP', 'damage-taken');
    sound.play('damage');
    document.querySelector('.player-card').classList.add('shake-hit');
    setTimeout(() => document.querySelector('.player-card').classList.remove('shake-hit'), 500);
  }

  GameState.wrongAnswers.push({
    question: q.question,
    yourAnswer: yourAnswerText,
    correctAnswer: q.options[q.answerIndex],
    explanation: q.explanation
  });

  showClassicExplanation(q, false, () => {
    GameState.currentQuestionIndex++;
    loadClassicQuestion();
  });
}

function showClassicExplanation(q, isCorrect, callback) {
  DOM.explanationOverlay.style.display = 'flex';
  DOM.explanationHeader.innerHTML = isCorrect
    ? '<span class="explanation-icon">✅</span> Chính xác!'
    : '<span class="explanation-icon">💡</span> Giải Thích';
  DOM.explanationHeader.className = isCorrect ? 'explanation-header header-correct' : 'explanation-header';
  DOM.explanationText.textContent = q.explanation;
  DOM.explanationCorrect.textContent = '✅ Đáp án đúng: ' + q.options[q.answerIndex];

  if (isCorrect) {
    const autoClose = setTimeout(() => {
      DOM.explanationOverlay.style.display = 'none';
      callback();
    }, 1350);
    DOM.btnContinue.onclick = () => {
      clearTimeout(autoClose);
      DOM.explanationOverlay.style.display = 'none';
      callback();
    };
  } else {
    DOM.btnContinue.onclick = () => {
      DOM.explanationOverlay.style.display = 'none';
      callback();
    };
  }
}

function scheduleClassicBotAnswer() {
  const delay = 3000 + Math.random() * 5000;
  GameState.botTimeout = setTimeout(() => {
    if (GameState.isAnswered) return;
    if (Math.random() < 0.7) {
      GameState.opponentScore += Math.round(60 + Math.random() * 30);
      DOM.opponentScoreDisplay.textContent = GameState.opponentScore;
      GameState.playerHP = Math.max(0, GameState.playerHP - 15);
      updateHPBar(DOM.playerHPBar, DOM.playerHPText, GameState.playerHP);
      showDamagePopup(DOM.damagePopupPlayer, '-15 HP (Bot)', 'damage-taken');
      document.querySelector('.player-card').classList.add('shake-hit');
      setTimeout(() => document.querySelector('.player-card').classList.remove('shake-hit'), 500);
    }
  }, delay);
}

function endClassicGame() {
  stopSharedTimer();
  if (GameState.botTimeout) clearTimeout(GameState.botTimeout);
  if (GameState.freezeTimeout) clearTimeout(GameState.freezeTimeout);

  const isVictory = GameState.mode === '1v1'
    ? (GameState.opponentHP <= 0 && GameState.playerHP > 0) || (GameState.playerHP > 0 && GameState.playerScore >= GameState.opponentScore)
    : GameState.correctCount >= Math.ceil(GameState.totalQuestions * 0.6);

  const totalMs = GameState.responseTimesMs.reduce((a, b) => a + b, 0);

  if (isVictory) {
    DOM.resultBanner.className = 'result-banner victory';
    DOM.resultIcon.textContent = '🏆';
    DOM.resultTitle.textContent = 'VICTORY!';
    DOM.resultTitle.className = 'result-title neon-text-gold';
    DOM.resultSubtitle.textContent = 'Bạn đã chiến thắng! Xuất sắc!';
    sound.play('victory');
  } else {
    DOM.resultBanner.className = 'result-banner defeat';
    DOM.resultIcon.textContent = '💀';
    DOM.resultTitle.textContent = 'DEFEAT';
    DOM.resultTitle.className = 'result-title neon-text-red';
    DOM.resultSubtitle.textContent = 'Không sao, hãy thử lại lần nữa!';
    sound.play('defeat');
  }

  DOM.statTotalScore.textContent = GameState.playerScore;
  DOM.statCorrect.textContent = `${GameState.correctCount}/${GameState.totalQuestions}`;
  DOM.statCombo.textContent = GameState.maxCombo;
  DOM.statAvgTime.textContent = formatMs(totalMs);

  renderReviewItems(DOM.reviewList, DOM.reviewEmpty);
  saveToLeaderboard(GameState.nickname, GameState.avatar, GameState.playerScore, GameState.category);
  setTimeout(() => switchScreen('screen-result'), 400);
}

function renderReviewItems(listEl, emptyEl) {
  listEl.innerHTML = '';
  if (GameState.wrongAnswers.length === 0) {
    emptyEl.style.display = 'block';
  } else {
    emptyEl.style.display = 'none';
    const qWord = window.t ? window.t('reviewItemQuestion') : 'Question';
    const yourAnsWord = window.t ? window.t('reviewItemYourAnswer') : 'Your answer:';
    const correctAnsWord = window.t ? window.t('reviewItemCorrectAnswer') : 'Correct answer:';
    const explWord = window.t ? window.t('reviewItemExplanation') : 'Explanation:';
    GameState.wrongAnswers.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'review-item';
      div.innerHTML = `
        <p class="review-question"><strong>${qWord} ${i + 1}:</strong> ${escapeHTML(item.question)}</p>
        <p class="review-answer">❌ ${yourAnsWord} ${escapeHTML(item.yourAnswer)}</p>
        <p class="review-correct-answer">✅ ${correctAnsWord} ${escapeHTML(item.correctAnswer)}</p>
        <p class="review-explanation">💡 ${explWord} ${escapeHTML(item.explanation)}</p>
      `;
      listEl.appendChild(div);
    });
  }
}

function updateHPBar(bar, textEl, hp) {
  const pct = Math.max(0, hp);
  bar.style.width = pct + '%';
  textEl.textContent = Math.round(pct) + ' HP';
  bar.classList.remove('hp-low', 'hp-critical');
  if (pct <= 25) bar.classList.add('hp-critical');
  else if (pct <= 50) bar.classList.add('hp-low');
}

function showDamagePopup(element, text, type) {
  element.textContent = text;
  element.className = 'damage-popup ' + type;
  element.style.display = 'block';
  if (element === DOM.damagePopupPlayer) {
    element.style.left = '15%';
    element.style.top = '80px';
  } else {
    element.style.right = '15%';
    element.style.left = 'auto';
    element.style.top = '80px';
  }
  setTimeout(() => { element.style.display = 'none'; }, 1000);
}

function showKO(callback) {
  DOM.koOverlay.style.display = 'flex';
  DOM.koOverlay.classList.add('active');
  sound.play('ko');
  setTimeout(() => {
    DOM.koOverlay.style.display = 'none';
    DOM.koOverlay.classList.remove('active');
    if (callback) callback();
  }, 1800);
}

function initPowerups() {
  DOM.powerup5050.addEventListener('click', () => {
    if (GameState.powerups['5050'] || GameState.isAnswered) return;
    GameState.powerups['5050'] = true;
    DOM.powerup5050.classList.add('used');
    sound.play('powerup');

    if (GameState.mode === 'room') {
      const applyElim = (res) => {
        if (!res?.ok) return;
        const btns = DOM.optionsGrid.querySelectorAll('.option-btn');
        res.eliminate.forEach(idx => btns[idx]?.classList.add('eliminated'));
      };
      if (GameState.isSocketMode && socket) {
        socket.emit('use-powerup', { roomCode: GameState.roomCode, type: '5050' }, applyElim);
      } else {
        localSim.usePowerup(GameState.roomCode, '5050', applyElim);
      }
    } else {
      const q = GameState.questions[GameState.currentQuestionIndex];
      const wrong = [0, 1, 2, 3].filter(i => i !== q.answerIndex);
      const btns = DOM.optionsGrid.querySelectorAll('.option-btn');
      shuffleArray(wrong).slice(0, 2).forEach(idx => btns[idx].classList.add('eliminated'));
    }
  });

  DOM.powerupFreeze.addEventListener('click', () => {
    if (GameState.powerups.freeze || GameState.isAnswered) return;
    GameState.powerups.freeze = true;
    DOM.powerupFreeze.classList.add('used');
    sound.play('freeze');

    GameState.isFrozen = true;
    const freezeStart = performance.now();
    const badge = document.createElement('span');
    badge.className = 'freeze-badge';
    badge.textContent = '❄️ FROZEN 4s';
    badge.id = 'freeze-badge-temp';
    document.querySelector('.timer-section').appendChild(badge);

    GameState.freezeTimeout = setTimeout(() => {
      GameState.isFrozen = false;
      GameState.freezeBonusMs += (performance.now() - freezeStart);
      const b = document.getElementById('freeze-badge-temp');
      if (b) b.remove();
    }, 4000);
  });

  DOM.powerupHint.addEventListener('click', () => {
    if (GameState.powerups.hint || GameState.isAnswered) return;
    GameState.powerups.hint = true;
    DOM.powerupHint.classList.add('used');
    sound.play('powerup');

    if (GameState.mode === 'room') {
      const showHint = (res) => {
        if (!res?.ok) return;
        const hintEl = document.createElement('div');
        hintEl.className = 'hint-popup';
        hintEl.textContent = '💡 ' + res.hintText;
        DOM.questionCard.appendChild(hintEl);
        setTimeout(() => hintEl.remove(), 3500);
      };
      if (GameState.isSocketMode && socket) {
        socket.emit('use-powerup', { roomCode: GameState.roomCode, type: 'hint' }, showHint);
      } else {
        localSim.usePowerup(GameState.roomCode, 'hint', showHint);
      }
    } else {
      GameState.shieldActive = true;
      DOM.questionCard.classList.add('shield-active');
      const hintEl = document.createElement('div');
      hintEl.className = 'hint-popup';
      hintEl.textContent = window.t ? window.t('toastShieldActive') : '🛡️ Shield Active! Protected from next mistake.';
      DOM.questionCard.appendChild(hintEl);
      setTimeout(() => hintEl.remove(), 3000);
    }
  });
}

function syncProfileFromInputs() {
  const nick = DOM.nicknameInput.value.trim() || 'Player';
  GameState.nickname = nick;
  localStorage.setItem('quizBattle_nickname', nick);
  localStorage.setItem('quizBattle_avatar', GameState.avatar);
}

function saveToLeaderboard(name, avatar, score, category) {
  let lb = JSON.parse(localStorage.getItem('quizBattle_leaderboard') || '[]');
  lb.push({ name, avatar, score, category, date: new Date().toISOString() });
  lb.sort((a, b) => b.score - a.score);
  lb = lb.slice(0, 5);
  localStorage.setItem('quizBattle_leaderboard', JSON.stringify(lb));
}

function showLeaderboard() {
  const lb = JSON.parse(localStorage.getItem('quizBattle_leaderboard') || '[]');
  DOM.leaderboardList.innerHTML = '';
  if (lb.length === 0) {
    const emptyStr = window.t ? window.t('leaderboardEmpty') : 'No ranking records yet';
    DOM.leaderboardList.innerHTML = `<div class="leaderboard-empty">${emptyStr}</div>`;
  } else {
    const medals = ['🥇', '🥈', '🥉', '4', '5'];
    lb.forEach((entry, i) => {
      const div = document.createElement('div');
      div.className = 'leaderboard-entry';
      div.innerHTML = `
        <span class="lb-rank">${medals[i] || (i + 1)}</span>
        <span class="lb-avatar">${entry.avatar}</span>
        <div class="lb-info">
          <div class="lb-name">${escapeHTML(entry.name)}</div>
          <div class="lb-category">${escapeHTML(entry.category)}</div>
        </div>
        <span class="lb-score">${entry.score}</span>
      `;
      DOM.leaderboardList.appendChild(div);
    });
  }
  DOM.modalLeaderboard.style.display = 'flex';
}

function openCustomQuizModal() {
  CustomQuizManager.renderList();
  DOM.modalCustomQuiz.style.display = 'flex';
}

function initUI() {
  
  DOM.nicknameInput.value = GameState.nickname !== 'Player' ? GameState.nickname : '';
  DOM.avatarGrid.querySelectorAll('.avatar-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.avatar === GameState.avatar);
  });

  CustomQuizManager.updateBadges();

  
  DOM.avatarGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.avatar-btn');
    if (!btn) return;
    sound.play('click');
    DOM.avatarGrid.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    GameState.avatar = btn.dataset.avatar;
    localStorage.setItem('quizBattle_avatar', GameState.avatar);
  });

  DOM.categoryGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;
    sound.play('click');
    DOM.categoryGrid.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    GameState.category = btn.dataset.category;
  });

  DOM.modeGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;
    sound.play('click');
    DOM.modeGrid.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    GameState.mode = btn.dataset.mode;
  });

  
  DOM.btnStart.addEventListener('click', () => {
    sound.play('click');
    if (GameState.mode === 'room') GameState.mode = '1v1';
    const selectedModeBtn = DOM.modeGrid.querySelector('.mode-btn.selected');
    GameState.mode = selectedModeBtn ? selectedModeBtn.dataset.mode : '1v1';
    startClassicGame();
  });

  
  DOM.btnOpenCreateRoom.addEventListener('click', () => {
    sound.play('click');
    CustomQuizManager.updateBadges();
    DOM.modalCreateRoom.style.display = 'flex';
  });
  DOM.btnCloseCreateRoom.addEventListener('click', () => {
    DOM.modalCreateRoom.style.display = 'none';
  });

  DOM.roomQcountSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-btn');
    if (!btn) return;
    sound.play('click');
    DOM.roomQcountSelector.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    GameState.roomQuestionCount = Number(btn.dataset.count);
  });

  DOM.roomSourceSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('.source-btn');
    if (!btn) return;
    sound.play('click');
    DOM.roomSourceSelector.querySelectorAll('.source-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    GameState.roomSource = btn.dataset.source;
    DOM.roomSystemCatGroup.style.display = GameState.roomSource === 'system' ? 'block' : 'none';
    DOM.roomCustomHelper.style.display = GameState.roomSource === 'custom' ? 'block' : 'none';
  });

  DOM.roomSystemCategory.addEventListener('change', (e) => {
    GameState.roomCategory = e.target.value;
  });

  DOM.btnCreateToCustomEditor.addEventListener('click', () => {
    DOM.modalCreateRoom.style.display = 'none';
    openCustomQuizModal();
  });

  DOM.btnConfirmCreateRoom.addEventListener('click', () => {
    sound.play('click');
    handleCreateRoom();
  });

  DOM.btnJoinRoom.addEventListener('click', () => {
    sound.play('click');
    handleJoinRoom();
  });

  DOM.joinRoomCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleJoinRoom();
  });

  
  DOM.btnCopyRoomLink.addEventListener('click', () => {
    const url = getRoomInviteUrl(GameState.roomCode);
    navigator.clipboard?.writeText(url).then(() => showToast('📋 Đã copy Link mời vào phòng!')).catch(() => showToast(url));
  });

  DOM.btnCopyRoomCode.addEventListener('click', () => {
    navigator.clipboard?.writeText(GameState.roomCode).then(() => showToast('🔢 Đã copy mã phòng: ' + GameState.roomCode));
  });

  DOM.btnAddRoomBot.addEventListener('click', () => {
    sound.play('click');
    if (GameState.isSocketMode && socket) {
      socket.emit('add-bot', { roomCode: GameState.roomCode });
    } else {
      localSim.addBot(GameState.roomCode);
    }
  });

  DOM.roomPlayersList.addEventListener('click', (e) => {
    const kickBtn = e.target.closest('.rp-kick-btn');
    if (!kickBtn) return;
    const playerId = kickBtn.dataset.kick;
    if (GameState.isSocketMode && socket) {
      socket.emit('remove-player', { roomCode: GameState.roomCode, playerId });
    } else {
      localSim.removePlayer(GameState.roomCode, playerId);
    }
  });

  DOM.btnStartRoomMatch.addEventListener('click', () => {
    sound.play('click');
    if (GameState.isSocketMode && socket) {
      socket.emit('start-match', { roomCode: GameState.roomCode }, (res) => {
        if (res && !res.ok) showToast(res.error || 'Không thể bắt đầu!');
      });
    } else {
      localSim.startMatch(GameState.roomCode);
    }
  });

  DOM.btnLeaveRoom.addEventListener('click', () => {
    sound.play('click');
    if (GameState.isSocketMode && socket) {
      socket.emit('leave-room', { roomCode: GameState.roomCode });
    }
    GameState.roomCode = null;
    switchScreen('screen-lobby');
  });

  
  DOM.optionsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.option-btn');
    if (!btn || btn.classList.contains('disabled') || btn.classList.contains('eliminated')) return;
    const index = parseInt(btn.dataset.index, 10);
    sound.play('click');
    if (GameState.mode === 'room') {
      submitRoomAnswer(index);
    } else {
      handleClassicAnswer(index);
    }
  });

  
  DOM.btnOpenCustomQuiz.addEventListener('click', () => {
    sound.play('click');
    openCustomQuizModal();
  });
  DOM.btnCloseCustomQuiz.addEventListener('click', () => {
    DOM.modalCustomQuiz.style.display = 'none';
  });

  DOM.cqForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const qText = DOM.cqQuestion.value.trim();
    const opts = DOM.cqOpts.map(inp => inp.value.trim());
    const checkedRadio = DOM.cqForm.querySelector('input[name="cq-correct"]:checked');
    const answerIndex = checkedRadio ? Number(checkedRadio.value) : 0;
    const explanation = DOM.cqExplanation.value.trim() || 'Chưa có giải thích.';
    const category = DOM.cqCategory.value;

    if (!qText || opts.some(o => !o)) {
      showToast(window.t ? window.t('toastCqFillAll') : '⚠️ Please fill in the question and all 4 options!');
      return;
    }

    const list = CustomQuizManager.load();
    const editIdx = Number(DOM.cqEditIndex.value);
    const entry = {
      id: Date.now(),
      category,
      question: qText,
      options: opts,
      answerIndex,
      explanation
    };

    if (editIdx >= 0 && editIdx < list.length) {
      list[editIdx] = entry;
      showToast(window.t ? window.t('toastCqUpdated', editIdx + 1) : '✅ Updated question!');
    } else {
      list.push(entry);
      showToast(window.t ? window.t('toastCqSaved') : '✅ Saved question!');
    }

    CustomQuizManager.save(list);
    CustomQuizManager.renderList();
    resetCustomQuizForm();
  });

  DOM.cqCancelEditBtn.addEventListener('click', resetCustomQuizForm);

  DOM.cqList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    const list = CustomQuizManager.load();
    if (btn.dataset.action === 'delete') {
      list.splice(idx, 1);
      CustomQuizManager.save(list);
      CustomQuizManager.renderList();
      showToast(window.t ? window.t('toastCqDeleted') : '🗑️ Deleted question!');
    } else if (btn.dataset.action === 'edit') {
      const q = list[idx];
      if (!q) return;
      DOM.cqEditIndex.value = idx;
      DOM.cqQuestion.value = q.question;
      DOM.cqCategory.value = q.category || 'Custom';
      q.options.forEach((o, i) => { DOM.cqOpts[i].value = o; });
      const radio = DOM.cqForm.querySelector(`input[name="cq-correct"][value="${q.answerIndex}"]`);
      if (radio) radio.checked = true;
      DOM.cqExplanation.value = q.explanation || '';
      DOM.cqSubmitBtn.textContent = '💾 ' + (window.t ? window.t('cqSaveBtn') : 'SAVE QUESTION');
      DOM.cqCancelEditBtn.style.display = 'inline-block';
    }
  });

  DOM.cqSampleBtn.addEventListener('click', () => {
    const existing = CustomQuizManager.load();
    const merged = [...existing, ...SAMPLE_CUSTOM_QUESTIONS.map(q => ({ ...q, id: Date.now() + Math.random() }))];
    CustomQuizManager.save(merged);
    CustomQuizManager.renderList();
    showToast(window.t ? window.t('toastCqSamplesLoaded') : '✨ Loaded 5 sample questions!');
  });

  DOM.cqExportBtn.addEventListener('click', () => {
    const list = CustomQuizManager.load();
    if (list.length === 0) {
      showToast(window.t ? window.t('cqEmptyList') : '⚠️ No questions to export!');
      return;
    }
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-battle-custom-questions.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📤 Exported JSON file!');
  });

  DOM.cqImportBtn.addEventListener('click', () => DOM.cqImportFile.click());
  DOM.cqImportFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error('Invalid JSON');
        const valid = parsed.filter(q => q && q.question && Array.isArray(q.options) && q.options.length === 4);
        if (valid.length === 0) throw new Error('No valid questions');
        const merged = [...CustomQuizManager.load(), ...valid];
        CustomQuizManager.save(merged);
        CustomQuizManager.renderList();
        showToast(window.t ? window.t('toastCqImported', valid.length) : `📥 Imported ${valid.length} questions!`);
      } catch {
        showToast(window.t ? window.t('toastCqImportFailed') : '❌ Failed to import JSON: Invalid format!');
      }
      DOM.cqImportFile.value = '';
    };
    reader.readAsText(file);
  });

  DOM.cqClearBtn.addEventListener('click', () => {
    CustomQuizManager.save([]);
    CustomQuizManager.renderList();
    resetCustomQuizForm();
    showToast(window.t ? window.t('toastCqCleared') : '🗑️ Cleared all custom questions!');
  });

  
  DOM.btnSkipCeremony.addEventListener('click', skipCeremonyReveal);
  DOM.btnCeremonyReview.addEventListener('click', () => {
    renderReviewItems(DOM.modalReviewList, DOM.modalReviewEmpty);
    DOM.modalReview.style.display = 'flex';
  });
  DOM.btnCloseReview.addEventListener('click', () => {
    DOM.modalReview.style.display = 'none';
  });

  DOM.btnCeremonyRematch.addEventListener('click', () => {
    fireworks.stop();
    if (GameState.isHost) {
      if (GameState.isSocketMode && socket) {
        socket.emit('reset-room', { roomCode: GameState.roomCode });
      } else {
        localSim.resetRoom(GameState.roomCode);
      }
    } else if (GameState.currentRoomData) {
      renderRoomLobby(GameState.currentRoomData);
      switchScreen('screen-room-lobby');
    } else {
      switchScreen('screen-lobby');
    }
  });

  DOM.btnCeremonyHome.addEventListener('click', () => {
    fireworks.stop();
    if (GameState.isSocketMode && socket && GameState.roomCode) {
      socket.emit('leave-room', { roomCode: GameState.roomCode });
    }
    GameState.roomCode = null;
    switchScreen('screen-lobby');
  });

  
  DOM.btnRematch.addEventListener('click', () => {
    sound.play('click');
    startClassicGame();
  });
  DOM.btnHome.addEventListener('click', () => {
    sound.play('click');
    switchScreen('screen-lobby');
  });

  
  DOM.btnLeaderboard.addEventListener('click', () => {
    sound.play('click');
    showLeaderboard();
  });
  DOM.btnCloseLeaderboard.addEventListener('click', () => {
    DOM.modalLeaderboard.style.display = 'none';
  });

  
  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    localStorage.setItem('quizBattle_theme', isLight ? 'light' : 'dark');
    DOM.themeToggle.querySelector('.theme-icon-dark').style.display = isLight ? 'none' : 'inline';
    DOM.themeToggle.querySelector('.theme-icon-light').style.display = isLight ? 'inline' : 'none';
    DOM.themeToggle.title = isLight ? 'Chuyển sang chế độ Tối (Dark)' : 'Chuyển sang chế độ Sáng (Light)';
    if (GameState.roomCode) {
      renderQRCode(GameState.roomCode);
    }
  };

  applyTheme(localStorage.getItem('quizBattle_theme') || 'dark');

  if (DOM.langToggle) {
    DOM.langToggle.addEventListener('click', () => {
      sound.play('click');
      const nextLang = window.toggleLanguage ? window.toggleLanguage() : 'en';
      showToast(nextLang === 'vi' ? '🇻🇳 Đã chuyển sang Tiếng Việt' : '🌐 Switched to English');
      if (GameState.currentRoomData) {
        renderRoomLobby(GameState.currentRoomData);
      }
      CustomQuizManager.renderList();
    });
  }

  DOM.themeToggle.addEventListener('click', () => {
    sound.play('click');
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    const isEn = (window.getLanguage ? window.getLanguage() : 'en') === 'en';
    showToast(next === 'light' ? (isEn ? '☀️ Switched to Light Theme' : '☀️ Đã bật chế độ Sáng') : (isEn ? '🌙 Switched to Dark Theme' : '🌙 Đã bật chế độ Tối'));
  });

  
  DOM.audioToggle.addEventListener('click', () => {
    const enabled = sound.toggle();
    DOM.audioToggle.querySelector('.audio-on').style.display = enabled ? 'inline' : 'none';
    DOM.audioToggle.querySelector('.audio-off').style.display = enabled ? 'none' : 'inline';
  });

  
  document.addEventListener('keydown', (e) => {
    if (!DOM.screenBattle.classList.contains('active')) return;
    if (GameState.isAnswered) {
      if (e.key === 'Enter' && DOM.explanationOverlay.style.display === 'flex') {
        DOM.btnContinue.click();
      }
      return;
    }
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    const idx = keyMap[e.key.toLowerCase()];
    if (idx !== undefined) {
      const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
      if (!optBtns[idx].classList.contains('eliminated')) {
        sound.play('click');
        if (GameState.mode === 'room') submitRoomAnswer(idx);
        else handleClassicAnswer(idx);
      }
    }
    if (e.key.toLowerCase() === 'q') DOM.powerup5050.click();
    if (e.key.toLowerCase() === 'w') DOM.powerupFreeze.click();
    if (e.key.toLowerCase() === 'e') DOM.powerupHint.click();
  });
}

function resetCustomQuizForm() {
  DOM.cqEditIndex.value = '-1';
  DOM.cqForm.reset();
  DOM.cqSubmitBtn.textContent = '💾 ' + (window.t ? window.t('cqSaveBtn') : 'SAVE QUESTION');
  DOM.cqCancelEditBtn.style.display = 'none';
}

function checkUrlRoomParam() {
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get('room');
  if (roomParam && /^\d{6}$/.test(roomParam)) {
    DOM.joinRoomCodeInput.value = roomParam;
    const isEn = (window.getLanguage ? window.getLanguage() : 'en') === 'en';
    showToast(isEn ? `📱 Detected Room Code ${roomParam} from QR! Connecting...` : `📱 Đã nhận mã phòng ${roomParam} từ QR! Đang kết nối...`);
    setTimeout(() => {
      handleJoinRoom(roomParam);
    }, 150);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTransport();
  initUI();
  initPowerups();
  checkUrlRoomParam();

  document.addEventListener('click', () => sound.init(), { once: true });
});
