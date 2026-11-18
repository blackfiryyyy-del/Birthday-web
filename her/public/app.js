const C = CONFIG, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion:reduce)').matches, sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function toast(m) {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('on'), 2800);
}

// Stage Switcher
function go(id) {
  $$('.scene').forEach(s => s.classList.remove('on'));
  $('#main').classList.add('hide');
  $('#stars').style.display = 'block';
  if (id === 'main') {
    $('#stars').style.display = 'none';
    $('#main').classList.remove('hide');
    window.scrollTo(0, 0);
    buildMain();
  } else {
    $('#' + id).classList.add('on');
  }
}

// ==========================================
// WEB AUDIO API SYNTHESIZER ENGINE
// ==========================================
class BirthdaySoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.isMuted = false;
    this.melodyTimeout = null;
    this.noteIndex = 0;
    this.melody = [
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.55 }, { f: 261.63, d: 0.55 }, { f: 349.23, d: 0.55 }, { f: 329.63, d: 0.95 },
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.55 }, { f: 261.63, d: 0.55 }, { f: 392.00, d: 0.55 }, { f: 349.23, d: 0.95 },
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 523.25, d: 0.55 }, { f: 440.00, d: 0.55 }, { f: 349.23, d: 0.55 }, { f: 329.63, d: 0.55 }, { f: 293.66, d: 0.85 },
      { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.25 }, { f: 440.00, d: 0.55 }, { f: 349.23, d: 0.55 }, { f: 392.00, d: 0.55 }, { f: 349.23, d: 1.10 }
    ];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMusicBoxNote(freq, dur) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      subOsc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      subOsc.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + dur * 1.35);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.025, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.8);

      osc.connect(gain);
      subOsc.connect(subGain);
      subGain.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + dur * 1.4);
      subOsc.stop(now + dur * 1.4);
    } catch (e) { }
  }

  startMelody() {
    this.init();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.noteIndex = 0;
    this.scheduleNextNote();
    ui();
  }

  scheduleNextNote() {
    if (!this.isPlayingMusic) return;
    const note = this.melody[this.noteIndex];
    this.playMusicBoxNote(note.f, note.d);
    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.melodyTimeout = setTimeout(() => {
      this.scheduleNextNote();
    }, note.d * 1000);
  }

  stopMelody() {
    this.isPlayingMusic = false;
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
    ui();
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    ui();
    return this.isMuted;
  }

  playPop() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.11);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) { }
  }

  playSwitch() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) { }
  }

  playFanfare() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq, 0.55);
      }, idx * 120);
    });
  }
}

const soundEngine = new BirthdaySoundEngine();

// Stars Generator
for (let i = 0; i < 90; i++) {
  const s = document.createElement('i');
  s.className = 'st';
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s`;
  $('#stars').append(s);
}

// ===== FX (confetti + fireworks) =====
const cv = $('#fx'), cx = cv.getContext('2d');
let P = [], run = false;
const size = () => { cv.width = innerWidth; cv.height = innerHeight; };
size();
addEventListener('resize', size);

const COL = ['#ff2e93', '#a78bfa', '#22d3ee', '#f5d27a', '#fff', '#60a5fa'];
function confetti(x = innerWidth / 2, y = innerHeight / 2, n = 140) {
  n = RM ? 20 : n;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.28, v = 4 + Math.random() * 10;
    P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, g: 0.25, c: COL[i % 6], s: 5 + Math.random() * 6, l: 140, r: Math.random() * 6 });
  }
  loop();
}

function firework() {
  const x = innerWidth * (0.15 + Math.random() * 0.7), y = innerHeight * (0.15 + Math.random() * 0.4), c = COL[Math.floor(Math.random() * 6)];
  for (let i = 0; i < 70; i++) {
    const a = i / 70 * 6.28, v = 2 + Math.random() * 4;
    P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.05, c, s: 3, l: 70, r: 0, f: 1 });
  }
  loop();
}

function loop() {
  if (run) return;
  run = true;
  (function f() {
    cx.clearRect(0, 0, cv.width, cv.height);
    P = P.filter(p => p.l-- > 0);
    P.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.99;
      cx.globalAlpha = Math.min(1, p.l / 40);
      cx.fillStyle = p.c;
      if (p.f) {
        cx.beginPath(); cx.arc(p.x, p.y, p.s, 0, 6.3); cx.fill();
      } else {
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r += 0.1);
        cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore();
      }
    });
    P.length ? requestAnimationFrame(f) : (run = false, cx.clearRect(0, 0, cv.width, cv.height));
  })();
}
const sparkle = e => confetti(e.clientX, e.clientY, 30);

// Global Music Player Button
const mb = $('#mus');
function ui() {
  const isPlaying = soundEngine.isPlayingMusic && !soundEngine.isMuted;
  mb.textContent = isPlaying ? '🎵' : '🔇';
  mb.title = isPlaying ? 'Music playing (Click to mute)' : 'Music muted (Click to play)';
  mb.setAttribute('aria-pressed', isPlaying);
}
mb.onclick = () => {
  if (!soundEngine.isPlayingMusic) {
    soundEngine.startMelody();
  } else {
    soundEngine.toggleMute();
  }
};

// ==========================================
// SCENE 1: COUNTDOWN
// ==========================================
const T = new Date(C.birthday).getTime();
function tick() {
  const d = T - Date.now();
  if (d <= 0) {
    const today = Date.now() - T < 864e5;
    $('#cd').innerHTML = `<div class="cdb"><b>${today ? '🎉 IT\'S TODAY! 🎉' : '💗 Belated Happy Birthday 💗'}</b></div>`;
    $('#cdmsg').textContent = today ? `Happy Birthday, Sharmi! The wait is over, Dude!` : `The party may be over, Dude, but the celebration never ends...`;
    return;
  }
  const v = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
  $('#cd').innerHTML = ['DAYS', 'HOURS', 'MINUTES', 'SECONDS'].map((l, i) => `<div class="cdb"><b>${String(v[i]).padStart(2, '0')}</b><small>${l}</small></div>`).join('');
}
tick();
setInterval(tick, 1000);

// Allow direct preview via URL hash or query param (e.g. #main, ?stage=main, #butterfly-section)
const urlParams = new URLSearchParams(window.location.search);
const targetStage = urlParams.get('stage') || (window.location.hash ? window.location.hash.replace('#', '') : null);
if (targetStage === 'main' || targetStage === 'butterfly-section' || targetStage === 'birthday-letter' || targetStage === 'balloons-game' || targetStage === 'polaroids') {
  go('main');
  if (targetStage !== 'main') {
    setTimeout(() => {
      const el = document.getElementById(targetStage);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  }
} else if (targetStage === 's2') {
  go('s2'); dark();
} else if (targetStage === 's3') {
  go('s3'); cake();
}

$('#go1').onclick = e => {
  sparkle(e);
  soundEngine.startMelody();
  setTimeout(() => {
    go('s2');
    dark();
  }, 400);
};

// ==========================================
// SCENE 2: DARK ROOM & LIGHTS ON
// ==========================================
const bl = $('.bulbs');
['#ff2e93', '#a78bfa', '#22d3ee', '#f5d27a', '#60a5fa', '#ff2e93', '#22d3ee', '#f5d27a'].forEach((c, i) => {
  const b = document.createElement('i');
  b.className = 'bulb';
  b.style.cssText = `--c:${c};--h:${(i % 3) * 30 + 10};animation-delay:${i * 0.2}s`;
  bl.append(b);
});

async function setT(el, t) {
  el.style.opacity = 0;
  await sleep(500);
  el.textContent = t;
  el.style.opacity = 1;
}

async function dark() {
  const t = $('#t2');
  await sleep(2200);
  await setT(t, "Dude deserves a little magic, doesn't she?");
}

$('#lon').onclick = async e => {
  sparkle(e);
  soundEngine.playSwitch();
  $('#lon').classList.add('hide');
  $('#s2').style.cssText = 'background:#1a0b3d;transition:background 2.5s';
  $('#lights').classList.add('on');
  setInterval(() => $('#s2').classList.contains('on') && confetti(Math.random() * innerWidth, 0, 6), 1200);
  await setT($('#t2'), 'Okayyy! Now we\'re talking!');
  await sleep(800);
  $('#go2').classList.remove('hide');
};

$('#go2').onclick = e => {
  sparkle(e);
  soundEngine.playSwitch();
  go('s3');
  cake();
};

// ==========================================
// SCENE 3: PROPER CAKE & CANDLE CEREMONY
// ==========================================
const cd = $('.candles');
cd.innerHTML = '';
for (let i = 0; i < 5; i++) cd.insertAdjacentHTML('beforeend', '<div class="candle"><i class="flame"></i></div>');

async function cake() {
  const t = $('#t3');
  $('#lights').classList.add('dim');
  await setT(t, 'Something sweet is coming...');
  $('#cakewrap').classList.add('up');
  await sleep(2200);

  await setT(t, 'Every birthday deserves a wish...');
  for (const c of $$('.candle')) {
    c.classList.add('in');
    soundEngine.playPop();
    await sleep(350);
  }
  await sleep(500);

  await setT(t, "Now it's your moment, Dude! 👑");
  $('#s3').classList.add('glowbg');
  cd.classList.remove('out');
  cd.classList.add('lit');
  soundEngine.playFanfare();
  await sleep(2000);

  await setT(t, 'MAKE A WISH, SHARMI! ✨');
  confetti();
  await sleep(2500);

  await setT(t, 'HAPPY BIRTHDAY, DUDE! 🎂👑');
  confetti();
  firework();
  setTimeout(firework, 400);
  setTimeout(firework, 900);
  $('#blow').classList.remove('hide');
  balloons($('#s3'), 6);
  await sleep(2000);
  $('#go3').classList.remove('hide');
}

$('#blow').onclick = async () => {
  soundEngine.playPop();
  cd.classList.remove('lit');
  cd.classList.add('out');
  $$('.candle').forEach(c => c.insertAdjacentHTML('beforeend', '<i class="smoke"></i>'));
  $('#blow').classList.add('hide');
  confetti();
  await setT($('#t3'), 'Your special celebration is just getting started... 💖✨');
};

$('#go3').onclick = e => {
  sparkle(e);
  soundEngine.playFanfare();
  go('main');
};

function balloons(host, n = 8) {
  for (let i = 0; i < n; i++) {
    const b = document.createElement('button');
    b.className = 'balloon';
    b.setAttribute('aria-label', 'Pop balloon');
    b.style.cssText = `left:${5 + i * 12}%;background:${COL[i % 6]};animation-duration:${9 + Math.random() * 7}s;animation-delay:${Math.random() * 4}s`;
    b.onclick = e => {
      soundEngine.playPop();
      b.classList.add('pop');
      confetti(e.clientX, e.clientY, 40);
      setTimeout(() => b.remove(), 300);
    };
    host.append(b);
  }
}

// ==========================================
// SCENE 5 / MAIN: INTERACTIVE BIRTHDAY PARTY HUB
// ==========================================
const ph = (src, emoji = '📷', alt = '') => src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.replaceWith('${emoji}')">` : emoji;

// Rich Emoji Birthday Letter Content
const PERSONALIZED_LETTER_TEXT = `💫🥰 Happy Birthday, Sharmi! 💐🎂❤️

Some people make ordinary conversations special, and you're definitely one of them. From our silly arguments and endless teasing to those little moments of care, every interaction has its own charm. 😄

You deserve all the happiness, peace, success and beautiful experiences life has to offer. May you achieve everything you've been dreaming of, keep smiling through every phase, and never lose that lovely spirit of yours.

I hope this new chapter brings you countless reasons to smile, wonderful memories to cherish, and opportunities to shine brighter than ever.

And one small reminder… don't change that playful version of yourself! Our little arguments would become boring otherwise. 😂❤️

Stay happy, stay blessed, and keep shining!

Once again, many many happy returns of the day, Sharmi! 🥳✨

வாழ்க வளமுடன்! ❤️`;

// Extra Data from Reference Code
const BALLOONS_DATA = [
  { id: 1, color: 'linear-gradient(to bottom, #ec4899, #e11d48)', label: 'Pop Me!', msg: 'Sharmi: 100% Pure Chaos, 1000% Pure Gold Heart! 💖' },
  { id: 2, color: 'linear-gradient(to bottom, #a855f7, #4f46e5)', label: 'Click!', msg: 'Different personalities, exact same madness! 🤪✨' },
  { id: 3, color: 'linear-gradient(to bottom, #fbbf24, #f97316)', label: 'Surprise!', msg: 'Thank you for being my unpaid therapist & partner-in-crime! 🕵️‍♀️' },
  { id: 4, color: 'linear-gradient(to bottom, #22d3ee, #2563eb)', label: 'Pop!', msg: 'Forever My Person — Dude, you\'re stuck with me for life! 🔒' },

  { id: 5, color: 'linear-gradient(to bottom, #d946ef, #db2777)', label: '20 Nov!', msg: 'November 20 is officially declared National Dude Appreciation Day! 👑' },
  { id: 6, color: 'linear-gradient(to bottom, #8b5cf6, #7c3aed)', label: 'Open!', msg: 'Life is 10x brighter and 100x louder with you in it, Sharmi! 🎉' },
  { id: 7, color: 'linear-gradient(to bottom, #fb7185, #dc2626)', label: 'Tap Me!', msg: 'Here’s to another year of bad decisions and unforgettable memories! 🥂' }
];

// ==========================================
// 11 BUTTERFLIES DATA & MOTIVATIONAL LINES FOR SHARMI
// ==========================================
const BUTTERFLIES_DATA = [
  {
    id: 1,
    name: 'Monarch of Courage',
    color1: '#ff2e93',
    color2: '#ff80bf',
    glow: 'rgba(255, 46, 147, 0.8)',
    icon: '🦋',
    quote: 'Sharmi, your smile has a rare magic that lights up even the darkest room. Never lose that radiance! 🌟',
    x: 10,
    y: 18,
    anim: 'bflyDrift1',
    dur: '8s'
  },
  {
    id: 2,
    name: 'Amethyst Fire',
    color1: '#9333ea',
    color2: '#c084fc',
    glow: 'rgba(147, 51, 234, 0.8)',
    icon: '✨',
    quote: 'You are capable of far more than your quietest doubts will ever let you believe. Trust your strength, Dude! 💪✨',
    x: 32,
    y: 52,
    anim: 'bflyDrift2',
    dur: '9.5s'
  },
  {
    id: 3,
    name: 'Golden Resilience',
    color1: '#d97706',
    color2: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.8)',
    icon: '👑',
    quote: 'Never forget how resilient you are — every storm you\'ve faced has only made your wings stronger and wiser. 🦋💖',
    x: 62,
    y: 22,
    anim: 'bflyDrift3',
    dur: '7.5s'
  },
  {
    id: 4,
    name: 'Sapphire Joy',
    color1: '#0284c7',
    color2: '#38bdf8',
    glow: 'rgba(2, 132, 199, 0.8)',
    icon: '🌸',
    quote: 'Your laughter and pure energy are genuine gifts to everyone lucky enough to know you. Keep spreading joy! 😄🌈',
    x: 82,
    y: 58,
    anim: 'bflyDrift4',
    dur: '10s'
  },
  {
    id: 5,
    name: 'Emerald Wonder',
    color1: '#059669',
    color2: '#34d399',
    glow: 'rgba(5, 150, 105, 0.8)',
    icon: '🍀',
    quote: 'The world is full of ordinary, but you, Sharmi, are effortlessly and wonderfully unique. Be unapologetically you! 💖',
    x: 20,
    y: 72,
    anim: 'bflyDrift1',
    dur: '8.8s'
  },
  {
    id: 6,
    name: 'Starlight Dreamer',
    color1: '#db2777',
    color2: '#f43f5e',
    glow: 'rgba(219, 39, 119, 0.8)',
    icon: '⭐',
    quote: 'Great things never come from staying in comfort zones — take that brave leap, Dude, because your dreams are waiting! 🚀✨',
    x: 46,
    y: 16,
    anim: 'bflyDrift2',
    dur: '11s'
  },
  {
    id: 7,
    name: 'Lilac Grace',
    color1: '#7c3aed',
    color2: '#a78bfa',
    glow: 'rgba(124, 58, 237, 0.8)',
    icon: '💜',
    quote: 'Be deeply proud of how far you’ve come, and excited for every beautiful surprise the universe is preparing for you! 🌺',
    x: 74,
    y: 76,
    anim: 'bflyDrift3',
    dur: '8.2s'
  },
  {
    id: 8,
    name: 'Ocean Whisper',
    color1: '#0369a1',
    color2: '#38bdf8',
    glow: 'rgba(3, 105, 161, 0.8)',
    icon: '🌊',
    quote: 'You don’t have to have every answer figured out right now. Just take the next gentle step with peace in your heart. 👣💫',
    x: 14,
    y: 44,
    anim: 'bflyDrift4',
    dur: '9.2s'
  },
  {
    id: 9,
    name: 'Blossom Blessing',
    color1: '#e11d48',
    color2: '#fda4af',
    glow: 'rgba(225, 29, 72, 0.8)',
    icon: '🌺',
    quote: 'You deserve all the peace, boundless love, and genuine happiness this world has to offer — today and every single day! 💕',
    x: 52,
    y: 64,
    anim: 'bflyDrift1',
    dur: '10.5s'
  },
  {
    id: 10,
    name: 'Golden Superpower',
    color1: '#ca8a04',
    color2: '#fef08a',
    glow: 'rgba(202, 138, 4, 0.8)',
    icon: '🛡️',
    quote: 'Your kindness is not a weakness; it is your greatest superpower. Never let the world harden your tender heart. 💖✨',
    x: 86,
    y: 28,
    anim: 'bflyDrift2',
    dur: '7.8s'
  },
  {
    id: 11,
    name: 'Diamond Soul',
    color1: '#6366f1',
    color2: '#e0e7ff',
    glow: 'rgba(99, 102, 241, 0.8)',
    icon: '💎',
    quote: 'Sharmi, you are a rare diamond — brilliant, resilient, deeply cherished, and destined for extraordinary heights! 💎👑',
    x: 36,
    y: 35,
    anim: 'bflyDrift3',
    dur: '9s'
  }
];

function getButterflySVG(b) {
  return `
    <svg class="bfly-svg" viewBox="0 0 70 60" width="58" height="50">
      <defs>
        <linearGradient id="bf-grad-l-${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${b.color2}" />
          <stop offset="100%" stop-color="${b.color1}" />
        </linearGradient>
        <linearGradient id="bf-grad-r-${b.id}" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${b.color2}" />
          <stop offset="100%" stop-color="${b.color1}" />
        </linearGradient>
      </defs>
      <!-- LEFT WINGS -->
      <g class="wing-group wing-left" style="transform-origin: 35px 30px;">
        <!-- Forewing -->
        <path d="M 34 26 C 24 8, 4 4, 3 18 C 2 28, 16 36, 33 30 Z" fill="url(#bf-grad-l-${b.id})" />
        <path d="M 31 25 C 23 13, 10 11, 8 19 C 7 25, 18 30, 31 28 Z" fill="rgba(255,255,255,0.45)" />
        <!-- Hindwing -->
        <path d="M 34 32 C 22 38, 10 44, 13 52 C 15 57, 28 55, 34 38 Z" fill="url(#bf-grad-l-${b.id})" />
        <circle cx="16" cy="21" r="2.5" fill="#ffffff" opacity="0.9" />
        <circle cx="18" cy="46" r="1.8" fill="#ffffff" opacity="0.85" />
      </g>
      <!-- RIGHT WINGS -->
      <g class="wing-group wing-right" style="transform-origin: 35px 30px;">
        <!-- Forewing -->
        <path d="M 36 26 C 46 8, 66 4, 67 18 C 68 28, 54 36, 37 30 Z" fill="url(#bf-grad-r-${b.id})" />
        <path d="M 39 25 C 47 13, 60 11, 62 19 C 63 25, 52 30, 39 28 Z" fill="rgba(255,255,255,0.45)" />
        <!-- Hindwing -->
        <path d="M 36 32 C 48 38, 60 44, 57 52 C 55 57, 42 55, 36 38 Z" fill="url(#bf-grad-r-${b.id})" />
        <circle cx="54" cy="21" r="2.5" fill="#ffffff" opacity="0.9" />
        <circle cx="52" cy="46" r="1.8" fill="#ffffff" opacity="0.85" />
      </g>
      <!-- BODY & ANTENNAE -->
      <g class="bfly-core">
        <path d="M 34 16 Q 29 8 25 7" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" fill="none" />
        <circle cx="25" cy="7" r="1.6" fill="#ffd700" />
        <path d="M 36 16 Q 41 8 45 7" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" fill="none" />
        <circle cx="45" cy="7" r="1.6" fill="#ffd700" />
        <ellipse cx="35" cy="30" rx="2.5" ry="14" fill="#241038" stroke="${b.color2}" stroke-width="0.9" />
        <circle cx="35" cy="18" r="3" fill="#ffffff" opacity="0.9" />
      </g>
    </svg>
  `;
}

const ENVELOPES_DATA = [
  {
    id: 'laugh',
    tag: 'Emergency Giggle Dose 🤪',
    title: 'Open When You Need a Laugh',
    letter: `Dear Dude,\n\nIf you're reading this with a straight face, stop right now and remember that time we laughed so hard we couldn't breathe over something that wasn't even funny to anyone else! 😂🍕\n\nNever forget: we are two crazy souls sharing one single chaotic braincell, and honestly, the world isn't ready for us. Smile right now—your laugh is my favorite sound in the world! 💖✨`
  },
  {
    id: 'overwhelmed',
    tag: 'Forever My Person 🫂',
    title: 'Open When Life Feels Overwhelming',
    letter: `Dearest Sharmi,\n\nTake a deep breath. 🌸 You have survived 100% of your hardest days so far, and you never have to carry heavy days alone.\n\nYou are "Forever My Person"—the one who's always there for me, which means I am ALWAYS in your corner too. Call me at 3 PM or 3 AM. We'll grab snacks, vent it all out, and conquer it together! 🫂💖`
  },
  {
    id: 'madness',
    tag: 'Two Crazy Souls ⚡',
    title: 'Open When You Miss Our Madness',
    letter: `Hey Partner-in-Crime! (Yes, you, Dude) 🕵️‍♀️\n\nMissing our unfiltered chaos? Different personalities, same madness—that's our superpower. No matter how busy life gets or where we are, the second we reunite, it takes approximately 0.2 seconds for the madness to resume! 🤪🔥\n\nText me the code word "CAKE" right now and let's plan our next adventure! 🎂🚗`
  },
  {
    id: 'birthday',
    tag: 'Birthday Queen Special 👑',
    title: 'Open on November 20, 2026',
    letter: PERSONALIZED_LETTER_TEXT
  }
];

let POLAROIDS_LIST = [
  {
    id: 1,
    caption: 'Where It All Began 🌸✨',
    date: 'May 2021 • Early Bestie Days',
    r: -2.5,
    src: 'assets/images/IMG-20210501-WA0033.jpg',
    emoji: '📸'
  },
  {
    id: 2,
    caption: 'Unfiltered Smiles & Endless Laughs ☀️',
    date: 'June 2022 • Summer Chronicles',
    r: 3,
    src: 'assets/images/IMG_20220610_194950.jpg',
    emoji: '📸'
  },
  {
    id: 3,
    caption: 'The Partner-in-Crime Look 👀💖',
    date: 'August 2022 • Bestie Moments',
    r: -3,
    src: 'assets/images/IMG-20220817-WA0013.jpg',
    emoji: '📸'
  },
  {
    id: 4,
    caption: 'Two Crazy Souls, One Single Braincell 🤪⚡',
    date: 'November 2022 • Pure Madness',
    r: 2.5,
    src: 'assets/images/1669298236944.jpg',
    emoji: '📸'
  },
  {
    id: 5,
    caption: 'Unstoppable Energy & Queen Vibes 💃👑',
    date: 'Snapchat Memory #01',
    r: -2,
    src: 'assets/images/Snapchat-1460370725.jpg',
    emoji: '📸'
  },
  {
    id: 6,
    caption: '100% Chaos, 1000% Pure Heart 💕',
    date: 'Snapchat Memory #02',
    r: 3.5,
    src: 'assets/images/Snapchat-1813478015.jpg',
    emoji: '📸'
  },
  {
    id: 7,
    caption: 'Unplanned Hangouts Are The Best Trips 🍕🎉',
    date: 'Hangout Highlights',
    r: -3.5,
    src: 'assets/images/Snapchat-462739153.jpg',
    emoji: '📸'
  },
  {
    id: 8,
    caption: 'Telepathic Giggles & Secret Inside Jokes 🤫😂',
    date: 'Giggle Therapy Session',
    r: 2,
    src: 'assets/images/Snapchat-724400268.jpg',
    emoji: '📸'
  },
  {
    id: 9,
    caption: 'Shining Brighter Every Single Year 🌟✨',
    date: 'April 2025 • Queen Energy',
    r: -2.5,
    src: 'assets/images/IMG_20250413_125933.jpg',
    emoji: '📸'
  },
  {
    id: 10,
    caption: 'Forever My Person, Through Thick & Thin 👭🔒',
    date: 'April 2025 • Unbreakable Bond',
    r: 3,
    src: 'assets/images/IMG-20250415-WA0022.jpg',
    emoji: '📸'
  },
  {
    id: 11,
    caption: 'Cherished Snapshots in Time 💖📸',
    date: 'Google Photos Favorite',
    r: -3,
    src: 'assets/images/Screenshot 2026-11-18 at 10-27-43 Photo - Google Photos.png',
    emoji: '📸'
  },
  {
    id: 12,
    caption: 'Celebrating Sharmi (Our Favorite Dude): Today, Tomorrow, Always! 🎂🥂👑',
    date: 'Grand Celebration • Birthday Queen',
    r: 2.5,
    src: 'assets/images/event_photo (6).jpg',
    emoji: '📸'
  }
];

let activeEnvelopeItem = null;
let voucherText = 'VIP PASS: Unlimited Food Runs, Late-Night Rant Sessions & 100% Bestie Spoiling on Nov 20, 2026! 🍕🧁💖';

function buildMain() {
  const N = C.name, U = N.toUpperCase();
  $('#main').innerHTML = `
    <!-- HERO HEADER -->
    <header class="hero">
      <div class="avatar">${ph(C.photo, '👑', N)}</div>
      <h1>Happy Birthday, <em>DUDE</em>! 💖✨</h1>
      <p style="font-size:1.3rem;color:var(--gold);font-weight:600">
        Two Crazy Souls • One Unbreakable Bond • Forever My Person 👭💞
      </p>
      <p style="max-width:620px;line-height:1.7;color:#fce7f3">
        Different personalities, endless madness, countless memories, and a friendship that deserves its own little universe. Welcome to your official party world!
      </p>
      <div class="tc">
        <div class="tcard"><b>TWO CRAZY SOULS</b>One Unbreakable Bestie Bond 🤪⚡</div>
        <div class="tcard"><b>FOREVER MY PERSON</b>Always There Through Thick & Thin 💖👭</div>
        <div class="tcard"><b>SPECIAL DATE</b>20 November 2026 👑🎂</div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:14px">
        <button class="btn pulse" onclick="document.getElementById('birthday-letter').scrollIntoView({behavior:'smooth'})">
          💌 READ SHARMI'S BIRTHDAY LETTER
        </button>
        <button class="btn" onclick="document.getElementById('butterfly-section').scrollIntoView({behavior:'smooth'})">
          🦋 CATCH DUDE'S 11 BUTTERFLIES ✨
        </button>
        <button class="btn" onclick="document.getElementById('polaroids').scrollIntoView({behavior:'smooth'})">
          📸 POLAROIDS WITH DUDE 💖
        </button>
        <button class="btn" onclick="document.getElementById('balloons-game').scrollIntoView({behavior:'smooth'})">
          🎈 EXPLORE PARTY HUB ↓
        </button>
      </div>
    </header>

    <!-- 1. PERSONALIZED HEARTFELT BIRTHDAY LETTER (FEATURE SECTION) -->
    <section class="sec letter-feature-sec" id="birthday-letter">
      <div class="s1-badge">💌 A SPECIAL KEEPSAKE • WRITTEN WITH ENDLESS LOVE</div>
      <h2>A Personalized Birthday Letter For Sharmi 💖✨</h2>
      <p>A little piece of my heart, captured in words for my favorite human on Earth.</p>
      
      <div class="letter-box-container">
        <div class="vintage-letter-card">
          <div class="letter-top-stamp">
            <div class="letter-stamp-badge">OFFICIAL BESTIE DISPATCH • DUDE &amp; SHARMI EDITION</div>
            <div class="letter-date-stamp">20 November 2026 ✨</div>
          </div>
          
          <div class="letter-salutation">
            💫🥰 Happy Birthday, Sharmi! 💐🎂❤️
          </div>
          
          <div class="letter-paragraphs">
            <p>Some people make ordinary conversations special, and you're definitely one of them. From our silly arguments and endless teasing to those little moments of care, every interaction has its own charm. 😄</p>
            <p>You deserve all the happiness, peace, success and beautiful experiences life has to offer. May you achieve everything you've been dreaming of, keep smiling through every phase, and never lose that lovely spirit of yours.</p>
            <p>I hope this new chapter brings you countless reasons to smile, wonderful memories to cherish, and opportunities to shine brighter than ever. ✨</p>
            <p>And one small reminder… don't change that playful version of yourself! Our little arguments would become boring otherwise. 😂❤️</p>
            <p style="font-size:1.15rem;font-weight:700;color:var(--gold);margin:14px 0 6px">Stay happy, stay blessed, and keep shining!</p>
            <p style="font-size:1.1rem;font-weight:600">Once again, many many happy returns of the day, Sharmi! 🥳✨</p>
          </div>

          <div class="letter-sign-off" style="font-size:1.4rem;font-weight:800;color:#f43f5e;letter-spacing:1px">
            வாழ்க வளமுடன்! ❤️
          </div>

          <div class="letter-wax-footer">
            <span>✨ Sealed with Bestie Magic</span>
            <span>Two Crazy Souls • One Unbreakable Bond • Forever My Person 💞</span>
          </div>
        </div>

        <div class="letter-actions-bar">
          <button class="btn" id="copy-letter-btn">📋 Copy Letter to Clipboard</button>
          <button class="btn pulse" id="celebrate-letter-btn">🎉 Shower With Love & Confetti!</button>
        </div>
      </div>
    </section>

    <!-- 2. BALLOON POP COMPLIMENT GAME -->
    <section class="sec" id="balloons-game">
      <h2>Interactive Balloon Pop 🎈</h2>
      <p>Pop each floating balloon to unlock secret bestie notes written especially for you!</p>
      <div class="balloon-hub-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <span style="font-size:13px;font-weight:700;color:var(--lav)" id="b-counter">${BALLOONS_DATA.length} Balloons Left to Pop!</span>
          <button class="btn" style="padding:6px 16px;font-size:12px" id="reset-balloons-btn">🔄 Inflate More Balloons</button>
        </div>
        <div class="balloon-grid" id="b-grid"></div>
        <div class="revealed-notes" id="b-notes"></div>
      </div>
    </section>

    <!-- 3. BUTTERFLY CATCH WITH MAGIC JAR (11 MOTIVATIONAL BUTTERFLIES) -->
    <section class="sec" id="butterfly-section">
      <div class="s1-badge">🦋 INTERACTIVE MAGIC • CATCH & COLLECT</div>
      <h2>Catch Dude's 11 Birthday Butterflies 🦋✨</h2>
      <p>11 magical butterflies are fluttering in the night breeze. Catch each one into the glowing glass jar to unlock a secret motivational truth for Dude's journey ahead!</p>

      <div class="bfly-game-container">
        <!-- LEFT: THE ENCHANTED MEADOW -->
        <div class="bfly-meadow-card">
          <div class="meadow-header">
            <span class="meadow-status" id="bfly-status-txt">
              <span style="font-size:16px">🦋</span> Tap a butterfly to catch it! (11 fluttering)
            </span>
            <button class="btn" style="padding:6px 14px;font-size:12px" id="bfly-release-btn">🔄 Release All Butterflies</button>
          </div>

          <div class="bfly-field" id="bfly-field">
            <!-- 11 SVGs will float around smoothly here -->
          </div>
          
          <div class="meadow-instructions">
            💡 <em>Tap or click any butterfly to gently guide it into the magical jar!</em>
          </div>
        </div>

        <!-- RIGHT: THE GLOWING MAGIC JAR & MOTIVATION CARD -->
        <div class="bfly-sidebar">
          <!-- THE MAGIC JAR -->
          <div class="magic-jar-wrapper">
            <div class="magic-jar" id="magic-jar">
              <div class="jar-lid">
                <div class="jar-cork"></div>
                <div class="jar-neck-string"></div>
              </div>
              <div class="jar-glass">
                <div class="jar-reflection"></div>
                <div class="jar-fireflies" id="jar-fireflies">
                  <!-- Caught butterflies glowing firefly orbs float here -->
                </div>
                <div class="jar-bottom-glow"></div>
              </div>
            </div>
            <div class="jar-counter-badge" id="jar-counter">0 / 11 Caught 🦋</div>
            <div class="jar-counter-sub" id="jar-subtext">Jar is waiting for its first butterfly...</div>
          </div>

          <!-- MOTIVATION CARD DISPLAY -->
          <div class="motivation-display-card" id="motivation-card">
            <div class="mot-badge" id="mot-badge">✨ WAITING FOR A BUTTERFLY...</div>
            <div class="mot-quote" id="mot-quote">
              “Catch any of the 11 glowing butterflies in the meadow to reveal an inspiring motivational message for Dude!” 💖
            </div>
            <div class="mot-author" id="mot-author">— With endless love & faith in you ✨</div>
          </div>
        </div>
      </div>

      <!-- ALL CAUGHT CELEBRATION BANNER (HIDDEN UNTIL 11/11) -->
      <div class="all-caught-banner hide" id="bfly-complete-banner">
        <div class="banner-sparkles">🌟 👑 🦋 💎 💖</div>
        <h3>All 11 Butterflies Safely Caught in Dude's Magic Jar! 🎉</h3>
        <p>Sharmi, may every single one of these 11 motivational blessings guide and protect you throughout this new year of your life. You are strong, radiant, loved, and capable of touching the stars!</p>
        <button class="btn pulse" id="bfly-celebrate-btn">🎊 Shower Jar With Magic Stardust!</button>
      </div>
    </section>

    <!-- 4. THEME 2: FOREVER MY PERSON ("OPEN WHEN..." VAULT) -->
    <section class="sec" id="letter-vault">
      <div class="s1-badge">💌 THEME 02 • THE ONE WHO'S ALWAYS THERE</div>
      <h2>Forever My Person — Secret Letter Vault 💌</h2>
      <p>Click any wax-sealed envelope to break the seal and read a heartfelt letter for Dude.</p>
      <div class="vault-grid">
        ${ENVELOPES_DATA.map(e => `
          <div class="vault-card" data-env="${e.id}">
            <span class="vault-tag">${e.tag}</span>
            <div class="wax-seal">💌</div>
            <div>
              <div class="vault-title">${e.title}</div>
              <span style="font-size:12px;color:var(--pk);text-decoration:underline">Break Wax Seal →</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 5. POLAROID WALL & PHOTO UPLOAD -->
    <section class="sec" id="polaroids">
      <div class="pol-top-bar">
        <div>
          <div class="s1-badge">📸 BESTIE SNAPSHOTS • 12 SPECIAL MOMENTS</div>
          <h2>Sharmi & Me: Polaroid Wall 📸</h2>
          <p style="font-size:13.5px;color:#d8b4fe;margin-top:4px">Tap any polaroid to view full-screen and flip through our favorite memories with Dude!</p>
        </div>
        <div class="pol-upload-box">
          <input type="text" id="pol-caption-input" class="pol-input" placeholder="Caption for your photo...">
          <input type="file" id="pol-file-input" accept="image/*" class="hide">
          <button class="btn" style="padding:8px 16px;font-size:12px" id="pol-upload-btn">📷 Add Another Photo</button>
        </div>
      </div>
      <div class="pol-grid" id="pol-grid"></div>
    </section>

    <!-- 5. SCRATCH-OFF CARD -->
    <section class="sec" id="games">
      <div style="max-width:540px;margin:0 auto">
        <!-- Golden Scratch-Off Voucher -->
        <div class="scratch-box">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span class="s1-badge">🎁 BIRTHDAY GIFT</span>
              <span style="font-size:12px;color:var(--lav)" id="scratch-pct">0% Scratched</span>
            </div>
            <h3 style="font-size:22px;color:#fff;margin-top:8px">Dude’s Golden Bestie Voucher ✨</h3>
            <p style="font-size:12px;color:var(--lav);margin-top:4px">
              Scratch the metallic gold foil below with your mouse or finger to uncover your birthday perk!
            </p>
          </div>
          <div class="scratch-canvas-wrap">
            <div class="voucher-reveal-text" id="voucher-text">${voucherText}</div>
            <canvas id="scratch-canvas" class="scratch-canvas"></canvas>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <button class="btn" style="padding:6px 14px;font-size:11px" id="reset-scratch-btn">🔄 Reset Gold Foil</button>
            <button class="btn" style="padding:6px 14px;font-size:11px" id="edit-voucher-btn">✏️ Customize Prize</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. NIGHT SKY LANTERN WISH LAUNCHER -->
    <section class="sec">
      <div class="lantern-sec" id="lantern-sec">
        <div class="lantern-sky" id="lantern-sky"></div>
        <div>
          <div class="s1-badge">🏮 NIGHT SKY CELEBRATION</div>
          <h2 style="font-size:clamp(1.8rem,5vw,2.8rem)">Send a Sky Lantern for Sharmi 🏮✨</h2>
          <p style="max-width:540px;margin:8px auto;font-size:14px;color:#fef08a">
            Type your birthday wish below and release a glowing lantern for Dude to float into the starry sky!
          </p>
        </div>
        <form class="lantern-form" id="lantern-form">
          <input type="text" id="lantern-input" class="lantern-input" placeholder="Write a wish for Dude (e.g., Forever my person, happy birthday!)...">
          <button type="submit" class="btn pulse" style="padding:10px 22px">Release Lantern 🏮</button>
        </form>
      </div>
    </section>

    <footer>
      Crafted with endless love &amp; madness for <strong>Sharmi (Dude)</strong> 💗 • 20 November 2026<br>
      Two Crazy Souls, One Unbreakable Bond • Forever My Person
    </footer>
  `;

  initPartyHubInteractions();
}

// ==========================================
// INTERACTIVE PARTY HUB LOGIC
// ==========================================
function initPartyHubInteractions() {
  // 0. Personalized Letter Buttons
  $('#copy-letter-btn').onclick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PERSONALIZED_LETTER_TEXT).then(() => {
        soundEngine.playSwitch();
        toast('Letter copied to clipboard! 📋💖');
      }).catch(() => {
        toast('Letter ready in heart! 💖');
      });
    } else {
      toast('Letter ready in heart! 💖');
    }
  };

  $('#celebrate-letter-btn').onclick = () => {
    soundEngine.playFanfare();
    confetti();
    firework();
    setTimeout(firework, 400);
    toast('Endless love sent to Dude! 🎉💖👑');
  };

  // 1. Balloon Pop Setup
  let remainingBalloons = [...BALLOONS_DATA];
  const bGrid = $('#b-grid');
  const bNotes = $('#b-notes');
  const bCounter = $('#b-counter');

  function renderBalloons() {
    bGrid.innerHTML = remainingBalloons.map(b => `
      <div class="hub-balloon" data-id="${b.id}">
        <div class="b-oval" style="background:${b.color}">${b.label}</div>
        <div class="b-knot"></div>
        <div class="b-string"></div>
      </div>
    `).join('');
    bCounter.textContent = `${remainingBalloons.length} Balloons Left to Pop!`;

    $$('.hub-balloon').forEach(el => {
      el.onclick = e => {
        const id = +el.dataset.id;
        const item = remainingBalloons.find(x => x.id === id);
        if (!item) return;
        soundEngine.playPop();
        confetti(e.clientX, e.clientY, 35);
        remainingBalloons = remainingBalloons.filter(x => x.id !== id);
        renderBalloons();

        bNotes.insertAdjacentHTML('afterbegin', `
          <div class="rev-card">
            <span>💖</span>
            <div>${esc(item.msg)}</div>
          </div>
        `);
      };
    });
  }
  renderBalloons();

  $('#reset-balloons-btn').onclick = () => {
    soundEngine.playSwitch();
    remainingBalloons = [...BALLOONS_DATA];
    renderBalloons();
    toast('Balloons inflated again! 🎈');
  };

  // ==========================================
  // 2. BUTTERFLY CATCH WITH MAGIC JAR (11 MOTIVATIONAL BUTTERFLIES)
  // ==========================================
  const bflyField = $('#bfly-field');
  const jarEl = $('#magic-jar');
  const jarFireflies = $('#jar-fireflies');
  const jarCounter = $('#jar-counter');
  const jarSubtext = $('#jar-subtext');
  const bflyStatusTxt = $('#bfly-status-txt');
  const motCard = $('#motivation-card');
  const motBadge = $('#mot-badge');
  const motQuote = $('#mot-quote');
  const motAuthor = $('#mot-author');
  const bflyCompleteBanner = $('#bfly-complete-banner');

  let caughtButterflies = new Set();

  function renderButterflies() {
    if (!bflyField) return;
    bflyField.innerHTML = BUTTERFLIES_DATA.map(b => {
      const isCaught = caughtButterflies.has(b.id);
      if (isCaught) return '';
      return `
        <div class="bfly-item" id="bfly-${b.id}" data-id="${b.id}" style="
          left: ${b.x}%;
          top: ${b.y}%;
          filter: drop-shadow(0 0 10px ${b.glow});
          animation: ${b.anim} ${b.dur} ease-in-out infinite alternate;
        " title="${b.name}">
          ${getButterflySVG(b)}
        </div>
      `;
    }).join('');

    $$('.bfly-item').forEach(el => {
      el.onclick = e => {
        e.stopPropagation();
        const id = +el.dataset.id;
        const b = BUTTERFLIES_DATA.find(x => x.id === id);
        if (!b || caughtButterflies.has(id)) return;

        caughtButterflies.add(id);

        // Harmonious musical note on catch
        const melodyNotes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
        const note = melodyNotes[(caughtButterflies.size - 1) % melodyNotes.length];
        soundEngine.playMusicBoxNote(note, 0.7);

        // Calculate flight swoop coordinates to magic jar
        const bRect = el.getBoundingClientRect();
        const jRect = jarEl.getBoundingClientRect();
        const deltaX = (jRect.left + jRect.width / 2) - (bRect.left + bRect.width / 2);
        const deltaY = (jRect.top + jRect.height / 2) - (bRect.top + bRect.height / 2);

        // Animate butterfly flying into jar
        el.style.animation = 'none';
        el.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease';
        el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
        el.style.opacity = '0.15';

        // Sparkle burst
        confetti(bRect.left + bRect.width / 2, bRect.top + bRect.height / 2, 24);

        setTimeout(() => {
          el.remove();

          // Add glowing firefly spirit inside jar
          const bug = document.createElement('div');
          bug.className = 'jar-bug';
          bug.style.background = `radial-gradient(circle, #ffffff 15%, ${b.color1} 60%, ${b.color2} 100%)`;
          bug.style.boxShadow = `0 0 14px ${b.glow}, 0 0 5px #fff`;
          bug.style.left = `${Math.random() * 65 + 15}%`;
          bug.style.top = `${Math.random() * 60 + 20}%`;
          bug.style.animationDuration = `${(Math.random() * 2 + 2.2).toFixed(1)}s`;
          bug.title = b.name;
          jarFireflies.appendChild(bug);

          // Pulse jar
          jarEl.classList.remove('jar-pulse');
          void jarEl.offsetWidth;
          jarEl.classList.add('jar-pulse');

          // Update counter and texts
          const count = caughtButterflies.size;
          jarCounter.textContent = `${count} / 11 Caught 🦋`;
          jarSubtext.textContent = count === 11
            ? '✨ All 11 Butterflies Glowing in Harmony! ✨'
            : `${11 - count} butterflies remaining in the meadow...`;
          bflyStatusTxt.innerHTML = count === 11
            ? '🎉 All 11 butterflies collected into the Magic Jar!'
            : `<span style="font-size:16px">🦋</span> Tap a butterfly to catch it! (${11 - count} fluttering)`;

          // Update Motivation Card with radiant pop
          motCard.classList.remove('mot-pop');
          void motCard.offsetWidth;
          motCard.classList.add('mot-pop');

          motBadge.innerHTML = `🦋 BUTTERFLY #${b.id} CAUGHT: ${esc(b.name.toUpperCase())}`;
          motBadge.style.color = b.color2;
          motBadge.style.borderColor = b.color1;
          motBadge.style.boxShadow = `0 0 14px ${b.glow}`;

          motQuote.innerHTML = `“${esc(b.quote)}”`;
          motAuthor.innerHTML = `— ${b.id % 2 === 0 ? 'Dude' : 'Sharmi'}'s Birthday Truth #${b.id} 💖✨`;

          toast(`Butterfly #${b.id} caught! 🦋✨`);

          // If all 11 caught:
          if (count === 11) {
            setTimeout(() => {
              soundEngine.playFanfare();
              confetti();
              firework();
              setTimeout(firework, 450);
              setTimeout(firework, 900);
              jarEl.classList.add('jar-gold-glow');
              if (bflyCompleteBanner) {
                bflyCompleteBanner.classList.remove('hide');
                bflyCompleteBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
              toast('🌟 All 11 Butterflies Caught! Dude\'s Magic Jar is Full! 🌟');
            }, 350);
          }
        }, 650);
      };
    });
  }
  renderButterflies();

  $('#bfly-release-btn').onclick = () => {
    soundEngine.playSwitch();
    caughtButterflies.clear();
    jarFireflies.innerHTML = '';
    jarEl.classList.remove('jar-gold-glow');
    if (bflyCompleteBanner) bflyCompleteBanner.classList.add('hide');
    jarCounter.textContent = '0 / 11 Caught 🦋';
    jarSubtext.textContent = 'Jar is waiting for its first butterfly...';
    bflyStatusTxt.innerHTML = '<span style="font-size:16px">🦋</span> Tap a butterfly to catch it! (11 fluttering)';

    motBadge.innerHTML = '✨ WAITING FOR A BUTTERFLY...';
    motBadge.style.color = 'var(--gold)';
    motBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    motBadge.style.boxShadow = 'none';
    motQuote.innerHTML = '“Catch any of the 11 glowing butterflies in the meadow to reveal an inspiring motivational message for Dude!” 💖';
    motAuthor.innerHTML = '— With endless love & faith in you ✨';

    renderButterflies();
    toast('Butterflies released back into the night meadow! 🦋✨');
  };

  const bflyCelebrateBtn = $('#bfly-celebrate-btn');
  if (bflyCelebrateBtn) {
    bflyCelebrateBtn.onclick = () => {
      soundEngine.playFanfare();
      confetti();
      firework();
      setTimeout(firework, 400);
      toast('May all your dreams take flight, Sharmi! 🦋🌟💖');
    };
  }

  // 3. Envelope Vault Setup
  const envModal = $('#env-modal');
  const emTag = $('#em-tag');
  const emTitle = $('#em-title');
  const emBody = $('#em-body');
  const emClose = $('#env-modal-close');
  const emEditBtn = $('#em-edit-btn');
  const emSaveBtn = $('#em-save-btn');
  let isEditingEnv = false;

  $$('.vault-card').forEach(vc => {
    vc.onclick = () => {
      const eid = vc.dataset.env;
      activeEnvelopeItem = ENVELOPES_DATA.find(x => x.id === eid);
      if (!activeEnvelopeItem) return;
      soundEngine.playSwitch();
      emTag.textContent = activeEnvelopeItem.tag;
      emTitle.textContent = activeEnvelopeItem.title;
      emBody.innerHTML = esc(activeEnvelopeItem.letter);
      isEditingEnv = false;
      emEditBtn.textContent = '✏️ Customize Letter';
      envModal.classList.remove('hide');
    };
  });

  emClose.onclick = () => envModal.classList.add('hide');
  envModal.onclick = e => { if (e.target === envModal) envModal.classList.add('hide'); };

  emEditBtn.onclick = () => {
    if (!isEditingEnv) {
      isEditingEnv = true;
      emBody.innerHTML = `<textarea class="env-modal-textarea" id="em-textarea">${esc(activeEnvelopeItem.letter)}</textarea>`;
      emEditBtn.textContent = '💾 Save Changes';
    } else {
      const ta = $('#em-textarea');
      if (ta) {
        activeEnvelopeItem.letter = ta.value;
        emBody.innerHTML = esc(activeEnvelopeItem.letter);
      }
      isEditingEnv = false;
      emEditBtn.textContent = '✏️ Customize Letter';
      toast('Letter updated! 💌');
    }
  };

  emSaveBtn.onclick = () => {
    confetti();
    envModal.classList.add('hide');
    toast('Stored safely in heart! 💖');
  };

  // 4. Polaroid Wall Setup
  const polGrid = $('#pol-grid');
  let currentLightboxIdx = 0;

  function openLightbox(idx) {
    if (!POLAROIDS_LIST.length) return;
    currentLightboxIdx = (idx + POLAROIDS_LIST.length) % POLAROIDS_LIST.length;
    const item = POLAROIDS_LIST[currentLightboxIdx];
    soundEngine.playSwitch();

    $('#lbc').innerHTML = `
      <div class="lb-img-wrap">
        ${item.src ? `<img src="${esc(item.src)}" alt="${esc(item.caption)}" class="lb-active-img">` : `<div style="font-size:4rem">${item.emoji}</div>`}
      </div>
      <div class="lb-caption-bar">
        <div class="lb-counter-pill">📸 Photo ${currentLightboxIdx + 1} of ${POLAROIDS_LIST.length}</div>
        <p class="lb-cap-text">${esc(item.caption)}</p>
        <small class="lb-date-text">${esc(item.date)}</small>
      </div>
    `;
    $('#lb').classList.remove('hide');
  }

  function renderPolaroids() {
    polGrid.innerHTML = POLAROIDS_LIST.map((p, idx) => `
      <div class="pol-frame" style="--r:${p.r}deg;--tape-r:${(p.r * -0.5).toFixed(1)}deg" data-pidx="${idx}">
        <div class="pol-pic">
          ${p.src ? `<img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy">` : p.emoji}
        </div>
        <div class="pol-cap">${esc(p.caption)}</div>
        <div class="pol-date">${esc(p.date)}</div>
      </div>
    `).join('');

    $$('.pol-frame').forEach(f => {
      f.onclick = () => {
        const pidx = +f.dataset.pidx;
        openLightbox(pidx);
      };
    });
  }
  renderPolaroids();

  const lbp = $('#lbp');
  const lbn = $('#lbn');
  if (lbp) lbp.onclick = e => { e.stopPropagation(); openLightbox(currentLightboxIdx - 1); };
  if (lbn) lbn.onclick = e => { e.stopPropagation(); openLightbox(currentLightboxIdx + 1); };

  $('#pol-upload-btn').onclick = () => $('#pol-file-input').click();
  $('#pol-file-input').onchange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const cap = $('#pol-caption-input').value.trim() || 'Dude & Me: Pure Magic 💖';
      POLAROIDS_LIST.unshift({
        id: Date.now(),
        caption: cap,
        date: 'Nov 20, 2026 Memory',
        r: (Math.random() - 0.5) * 6,
        src: ev.target.result,
        emoji: '📸'
      });
      $('#pol-caption-input').value = '';
      renderPolaroids();
      soundEngine.playFanfare();
      confetti();
      toast('Memory pinned to wall! 📸');
    };
    reader.readAsDataURL(file);
  };

  // 5. Scratch-Off Canvas Setup
  const scanvas = $('#scratch-canvas');
  const spct = $('#scratch-pct');
  let scratchedPct = 0;

  function initScratch() {
    if (!scanvas) return;
    const ctx = scanvas.getContext('2d');
    scanvas.width = scanvas.offsetWidth || 340;
    scanvas.height = scanvas.offsetHeight || 160;

    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, scanvas.width, scanvas.height);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.35, '#fde047');
    grad.addColorStop(0.7, '#d97706');
    grad.addColorStop(1, '#fef08a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, scanvas.width, scanvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let x = 12; x < scanvas.width; x += 30) {
      for (let y = 12; y < scanvas.height; y += 30) {
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, 6.28); ctx.fill();
      }
    }

    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE, DUDE! ✨', scanvas.width / 2, scanvas.height / 2 - 4);
    ctx.font = '11px sans-serif';
    ctx.fillText('(Drag cursor or finger across the gold foil)', scanvas.width / 2, scanvas.height / 2 + 18);
    scratchedPct = 0;
    spct.textContent = '0% Scratched';
  }
  setTimeout(initScratch, 200);

  function scratchMove(e) {
    if (e.buttons !== 1 && e.type === 'mousemove') return;
    const rect = scanvas.getBoundingClientRect();
    const cx0 = e.touches ? e.touches[0].clientX : e.clientX;
    const cy0 = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((cx0 - rect.left) / rect.width) * scanvas.width;
    const y = ((cy0 - rect.top) / rect.height) * scanvas.height;

    const ctx = scanvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, 6.28);
    ctx.fill();

    const imgData = ctx.getImageData(0, 0, scanvas.width, scanvas.height).data;
    let transparent = 0;
    for (let i = 3; i < imgData.length; i += 32) {
      if (imgData[i] === 0) transparent++;
    }
    scratchedPct = Math.min(100, Math.round((transparent / (imgData.length / 32)) * 100));
    spct.textContent = `${scratchedPct}% Scratched`;
    if (scratchedPct > 70 && !scanvas.cleared) {
      scanvas.cleared = true;
      confetti();
      soundEngine.playFanfare();
    }
  }

  scanvas.onmousemove = scratchMove;
  scanvas.ontouchmove = scratchMove;
  $('#reset-scratch-btn').onclick = () => {
    soundEngine.playSwitch();
    scanvas.cleared = false;
    initScratch();
  };

  $('#edit-voucher-btn').onclick = () => {
    const nv = prompt('Enter customized birthday prize:', voucherText);
    if (nv && nv.trim()) {
      voucherText = nv.trim();
      $('#voucher-text').textContent = voucherText;
      toast('Voucher perk customized! ✨');
    }
  };

  // 6. Sky Lantern Setup
  const sky = $('#lantern-sky');
  const lanterns = [
    { text: 'Happy Birthday Sharmi! Forever My Person 💖', left: 16, dur: 18 },
    { text: 'Two Crazy Souls, One Unbreakable Bond! ✨', left: 70, dur: 22 },
    { text: 'Here\'s to endless laughter with Dude! 🥂✨', left: 42, dur: 20 }
  ];

  function addLanternToSky(text, left = Math.random() * 75 + 10, dur = Math.random() * 6 + 16) {
    const l = document.createElement('div');
    l.className = 'sky-lantern';
    l.style.left = `${left}%`;
    l.style.animationDuration = `${dur}s`;
    l.innerHTML = `
      <div class="lantern-body"><div class="lantern-core"></div></div>
      <div class="lantern-msg">${esc(text)}</div>
    `;
    sky.appendChild(l);
  }
  lanterns.forEach(l => addLanternToSky(l.text, l.left, l.dur));

  $('#lantern-form').onsubmit = e => {
    e.preventDefault();
    const inp = $('#lantern-input');
    const val = inp.value.trim() || `Happy Birthday ${C.name}! Endless magic! 🏮💖`;
    addLanternToSky(val);
    inp.value = '';
    soundEngine.playFanfare();
    confetti();
    toast('Sky lantern released! 🏮✨');
  };
}


// Lightbox close and navigation helpers
$('#lbx').onclick = () => $('#lb').classList.add('hide');
$('#lb').onclick = e => { if (e.target.id === 'lb') $('#lb').classList.add('hide'); };
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $('#lb').classList.add('hide');
    $('#env-modal').classList.add('hide');
  } else if (e.key === 'ArrowLeft' && !$('#lb').classList.contains('hide')) {
    const prevBtn = $('#lbp');
    if (prevBtn) prevBtn.click();
  } else if (e.key === 'ArrowRight' && !$('#lb').classList.contains('hide')) {
    const nextBtn = $('#lbn');
    if (nextBtn) nextBtn.click();
  }
});
