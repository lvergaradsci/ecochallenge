// =========================================================
// sound.js — Motor de sonido 8-bit con Web Audio API
// Sin archivos externos, sin copyright, puro JavaScript
// =========================================================

const SoundEngine = (() => {
  let ctx = null;
  let masterGain = null;
  let timerLoop = null;
  let timerPhase = 0;       // cuántas veces ha sonado el timer
  let timerBpm = 140;       // velocidad base del timer
  let muted = false;

  // ---- Inicializar contexto (debe ocurrir tras gesto del usuario) ----
  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.28;   // volumen master — sutil
      masterGain.connect(ctx.destination);
    } catch(e) {
      console.warn('Web Audio no disponible:', e);
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ---- Utilidad: crear oscilador y conectar ----
  function osc(type, freq, start, duration, gainVal = 0.4, detune = 0) {
    if (!ctx || muted) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    g.gain.setValueAtTime(gainVal, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    o.connect(g);
    g.connect(masterGain);
    o.start(start);
    o.stop(start + duration + 0.02);
  }

  // ---- Utilidad: nota rápida con envelope ----
  function note(freq, start, dur, vol = 0.35, type = 'square') {
    osc(type, freq, start, dur, vol);
  }

  // =========================================================
  // TIMER — Melodía 8-bit urgente tipo "Running Out of Time"
  // Inspirada en el feeling de cuenta regresiva de Mario
  // Se acelera a medida que quedan pocos segundos
  // =========================================================

  // Escala pentatónica en Do — suena urgente y 8-bit
  const TIMER_NOTES = [523, 659, 784, 1047, 784, 659, 523, 392];
  // Versión acelerada (últimos 5 segundos)
  const TIMER_NOTES_FAST = [659, 784, 1047, 1319, 1047, 784, 659, 523];

  function playTimerTick(urgent = false) {
    if (!ctx || muted) return;
    resume();
    const now = ctx.currentTime;
    const notes = urgent ? TIMER_NOTES_FAST : TIMER_NOTES;
    const step  = urgent ? 0.09 : 0.13;
    const vol   = urgent ? 0.22 : 0.15;

    // Dos notas por tick — suena como un "bit" de cuenta regresiva
    const idx = timerPhase % notes.length;
    note(notes[idx],       now,         0.10, vol, 'square');
    note(notes[(idx+4) % notes.length], now + step, 0.08, vol * 0.6, 'square');

    timerPhase++;
  }

  function startTimerSound(totalSeconds) {
    stopTimerSound();
    timerPhase = 0;
    if (!ctx || muted) return;

    let elapsed = 0;
    const urgent = () => (totalSeconds - elapsed) <= 5;

    // Primera llamada inmediata
    playTimerTick(false);
    elapsed++;

    timerLoop = setInterval(() => {
      const isUrgent = urgent();
      playTimerTick(isUrgent);
      elapsed++;

      // Pulso grave extra cuando queda muy poco
      if (isUrgent && elapsed % 2 === 0) {
        const now = ctx.currentTime;
        note(130, now, 0.12, 0.18, 'sawtooth');
      }
    }, 1000);
  }

  function stopTimerSound() {
    if (timerLoop) { clearInterval(timerLoop); timerLoop = null; }
    timerPhase = 0;
  }

  // =========================================================
  // ACIERTO — Fanfarria brillante tipo "¡6 AM!" de FNAF
  // Acorde mayor con eco y shimmer ascendente
  // =========================================================
  function playCorrect() {
    if (!ctx || muted) return;
    resume();
    const now = ctx.currentTime;

    // Acorde Do Mayor en tres octavas — brillante y victorioso
    const chord = [523, 659, 784, 1047];
    chord.forEach((f, i) => {
      note(f, now + i * 0.04, 0.35, 0.28, 'square');
      // Octava superior con shimmer
      note(f * 2, now + i * 0.04 + 0.02, 0.18, 0.10, 'triangle');
    });

    // Eco ascendente — el "yey" sube
    const ascent = [784, 1047, 1319, 1568];
    ascent.forEach((f, i) => {
      note(f, now + 0.22 + i * 0.07, 0.12, 0.18, 'square');
    });

    // Remate — nota final larga sostenida
    note(2093, now + 0.58, 0.40, 0.22, 'triangle');
    note(1047, now + 0.58, 0.50, 0.18, 'square');

    // Sub-grave para dar "peso" al éxito
    osc('sine', 80, now, 0.3, 0.35);
  }

  // =========================================================
  // ERROR — Melodía descendente burlona tipo Duck Hunt dog
  // "Wah wah wah waaah" — inconfundible y graciosa
  // =========================================================
  function playWrong() {
    if (!ctx || muted) return;
    resume();
    const now = ctx.currentTime;

    // Patrón "wah wah wah waaah" — frecuencias descendentes
    const wahFreqs  = [494, 440, 392, 349];
    const wahTimes  = [0,   0.18, 0.36, 0.54];
    const wahDurs   = [0.15, 0.15, 0.15, 0.55];

    wahFreqs.forEach((f, i) => {
      const t = now + wahTimes[i];
      const d = wahDurs[i];

      // Nota principal con vibrato (tono burlón)
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f, t);
      // Ligero pitch-bend descendente en cada nota
      o.frequency.exponentialRampToValueAtTime(f * 0.88, t + d);

      // Vibrato con LFO
      if (i < 3) {
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.frequency.value = 8;
        lfoG.gain.value = 12;
        lfo.connect(lfoG);
        lfoG.connect(o.detune);
        lfo.start(t);
        lfo.stop(t + d + 0.05);
      }

      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(g);
      g.connect(masterGain);
      o.start(t);
      o.stop(t + d + 0.1);
    });

    // Nota final extra grave — el remate burlón
    osc('sawtooth', 220, now + 1.1, 0.45, 0.22);
    osc('sine',     110, now + 1.1, 0.55, 0.18);
  }

  // =========================================================
  // TIMEOUT — Variante de error más urgente (se acabó el tiempo)
  // =========================================================
  function playTimeout() {
    if (!ctx || muted) return;
    resume();
    const now = ctx.currentTime;

    // Alarma descendente rápida
    [880, 740, 622, 494, 392].forEach((f, i) => {
      note(f, now + i * 0.09, 0.12, 0.25, 'sawtooth');
    });
    osc('sine', 150, now + 0.5, 0.4, 0.2);
  }

  // =========================================================
  // CELEBRACIÓN FINAL — Fanfarria larga para el podio
  // =========================================================
  function playVictory() {
    if (!ctx || muted) return;
    resume();
    const now = ctx.currentTime;

    // Melodía tipo "You Win!" de 8-bit
    const melody = [
      [523, 0.00], [659, 0.12], [784, 0.24], [1047, 0.36],
      [784, 0.52], [880, 0.64], [1047, 0.80],
      [1319, 1.00], [1047, 1.20], [1319, 1.40],
    ];
    melody.forEach(([f, t]) => {
      note(f, now + t, 0.18, 0.22, 'square');
      note(f / 2, now + t, 0.14, 0.10, 'triangle');
    });

    // Arpegio final
    [523, 659, 784, 1047, 1319, 1047, 784].forEach((f, i) => {
      note(f, now + 1.7 + i * 0.06, 0.10, 0.18, 'square');
    });

    osc('sine', 65, now, 0.5, 0.3);
    osc('sine', 65, now + 1.0, 0.5, 0.25);
    osc('sine', 65, now + 1.7, 0.8, 0.3);
  }

  // =========================================================
  // UI click — click sutil para botones
  // =========================================================
  function playClick() {
    if (!ctx || muted) return;
    resume();
    const now = ctx.currentTime;
    note(1200, now, 0.04, 0.08, 'sine');
  }

  // =========================================================
  // CONTROL DE VOLUMEN Y MUTE
  // =========================================================
  function setVolume(v) {
    if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
  }

  function toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.28;
    if (muted) stopTimerSound();
    return muted;
  }

  function isMuted() { return muted; }

  return {
    init,
    startTimerSound,
    stopTimerSound,
    playCorrect,
    playWrong,
    playTimeout,
    playVictory,
    playClick,
    setVolume,
    toggleMute,
    isMuted,
  };
})();
