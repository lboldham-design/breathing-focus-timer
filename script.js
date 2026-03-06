// ── Presets ──

const presets = {
  calm:  { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  focus: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  relax: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
};

function applyPreset(name) {
  const p = presets[name];
  document.getElementById('inhale-dur').value = p.inhale;
  document.getElementById('hold1-dur').value  = p.hold1;
  document.getElementById('exhale-dur').value = p.exhale;
  document.getElementById('hold2-dur').value  = p.hold2;
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === name);
  });
}

function clearPresetHighlight() {
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
}

// ── Timer state ──

let breathInterval = null;
let currentPhase = 0;
let currentSecond = 0;
let phases = [];
let isRunning = false;

// Build the phase list from the current input values.
// Phases with a duration of 0 are skipped (hold fields may be 0).
function buildPhases() {
  const inhale = Math.max(1,  parseInt(document.getElementById('inhale-dur').value) || 4);
  const hold1  = Math.max(0,  parseInt(document.getElementById('hold1-dur').value)  || 0);
  const exhale = Math.max(1,  parseInt(document.getElementById('exhale-dur').value) || 4);
  const hold2  = Math.max(0,  parseInt(document.getElementById('hold2-dur').value)  || 0);

  const result = [];
  result.push({ label: 'Inhale', duration: inhale, scale: 1.0,  glow: 0.45, animate: true });
  if (hold1 > 0)
    result.push({ label: 'Hold',   duration: hold1,  scale: 1.0,  glow: 0.3,  animate: false });
  result.push({ label: 'Exhale', duration: exhale, scale: 0.42, glow: 0.08, animate: true });
  if (hold2 > 0)
    result.push({ label: 'Hold',   duration: hold2,  scale: 0.42, glow: 0.08, animate: false });
  return result;
}

// Apply the current phase's styles and reset the countdown.
function enterPhase() {
  const phase = phases[currentPhase];
  const circle = document.getElementById('breath-circle');

  if (phase.animate) {
    circle.style.transition =
      `transform ${phase.duration}s ease-in-out, box-shadow ${phase.duration}s ease-in-out`;
  } else {
    circle.style.transition = 'none';
  }

  circle.style.transform = `scale(${phase.scale})`;
  circle.style.boxShadow = `0 0 ${Math.round(80 * phase.glow)}px rgba(58, 140, 168, ${phase.glow})`;

  document.getElementById('phase-label').textContent = phase.label;
  document.getElementById('phase-count').textContent = phase.duration;
  currentSecond = phase.duration;
}

// Called every second while running.
function breathTick() {
  currentSecond--;
  if (currentSecond <= 0) {
    currentPhase = (currentPhase + 1) % phases.length;
    enterPhase();
  } else {
    document.getElementById('phase-count').textContent = currentSecond;
  }
}

function toggleBreathing() {
  if (isRunning) {
    stop();
  } else {
    start();
  }
}

function start() {
  phases = buildPhases();
  isRunning = true;
  currentPhase = 0;

  document.getElementById('idle-hint').textContent = '';
  setInputsDisabled(true);

  const btn = document.getElementById('main-btn');
  btn.textContent = 'Stop';
  btn.classList.add('running');

  enterPhase();
  clearInterval(breathInterval);
  breathInterval = setInterval(breathTick, 1000);
}

function stop() {
  isRunning = false;
  clearInterval(breathInterval);
  breathInterval = null;

  const circle = document.getElementById('breath-circle');
  circle.style.transition = 'transform 0.8s ease, box-shadow 0.8s ease';
  circle.style.transform = 'scale(0.42)';
  circle.style.boxShadow = '0 0 50px rgba(58, 140, 168, 0.15)';

  document.getElementById('phase-label').textContent = '';
  document.getElementById('phase-count').textContent = '';
  document.getElementById('idle-hint').textContent = 'Set your pattern and press Start';

  setInputsDisabled(false);

  const btn = document.getElementById('main-btn');
  btn.textContent = 'Start';
  btn.classList.remove('running');
}

function setInputsDisabled(disabled) {
  ['inhale-dur', 'hold1-dur', 'exhale-dur', 'hold2-dur'].forEach(id => {
    document.getElementById(id).disabled = disabled;
  });
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.disabled = disabled;
  });
}
