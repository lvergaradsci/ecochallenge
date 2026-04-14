// =========================================================
// game.js — Lógica del juego (modo individual por jugador)
// =========================================================

const DIFFICULTY_POINTS = { 1: 50, 2: 100, 3: 200 };
const DIFFICULTY_TIME   = { 1: 20,  2: 15,  3: 10  };
const DIFFICULTY_STARS  = { 1: '★☆☆', 2: '★★☆', 3: '★★★' };

let gameState = {
  currentPlayer:  null,
  sessionPoints:  0,
  currentQ:       0,
  questionOrder:  [],
  timerInterval:  null,
  timeLeft:       0,
  editingQId:     null,
  answered:       false,
};

// =========================================================
// NAVEGACIÓN
// =========================================================
function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  t.classList.add('active');
  t.classList.remove('enter');
  void t.offsetWidth;
  t.classList.add('enter');
}

// =========================================================
// PARTÍCULAS
// =========================================================
function initParticles() {
  const c = document.getElementById('particles');
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation-delay:${Math.random()*8}s;animation-duration:${6+Math.random()*10}s;
      width:${4+Math.random()*7}px;height:${4+Math.random()*7}px;opacity:${0.1+Math.random()*0.25}`;
    c.appendChild(p);
  }
}

// =========================================================
// SELECCIÓN DE JUGADOR
// =========================================================
function goToPlayerSelect() {
  renderPlayerSelectGrid();
  goToScreen('screen-player-select');
}

function renderPlayerSelectGrid() {
  const grid = document.getElementById('players-grid-select');
  grid.innerHTML = '';
  const excluded = ['Luis Fernando Vergara Sibaja','Xiara Sarge Jaramillo','Jaider Andres Vergara Urán','Mateo Mercado Carvajal'];

  GAME_DATA.players.forEach(p => {
    const isExpositor = excluded.some(e =>
      e.toLowerCase().split(' ').slice(0,2).join(' ') === p.name.toLowerCase().split(' ').slice(0,2).join(' ')
    );
    const chip = document.createElement('div');
    chip.className = 'player-chip' + (isExpositor ? ' excluded-chip' : '');
    chip.style.setProperty('--pcolor', p.color);
    chip.dataset.id = p.id;
    const firstName = p.name.split(' ')[0];
    const lastName  = p.name.split(' ').slice(-1)[0];
    chip.innerHTML = `
      <span class="chip-emoji">${p.emoji}</span>
      <span class="chip-name">${firstName}<br><small>${lastName}</small></span>
      ${isExpositor ? '<span class="chip-tag">Expositor</span>' : ''}
    `;
    if (!isExpositor) chip.onclick = () => selectPlayerChip(chip, p);
    grid.appendChild(chip);
  });
}

function selectPlayerChip(chip, player) {
  document.querySelectorAll('.player-chip').forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
  gameState.currentPlayer = player;

  const preview = document.getElementById('selected-preview');
  const card    = document.getElementById('preview-card');
  preview.style.display = 'flex';
  card.innerHTML = `
    <span style="font-size:2.5rem">${player.emoji}</span>
    <div>
      <div style="font-family:var(--font-head);font-size:1.1rem;font-weight:700">${player.name}</div>
      <div style="color:var(--text2);font-size:0.85rem">Listo para jugar 🎮</div>
    </div>
  `;
  preview.style.flexDirection = 'row';
  preview.style.alignItems    = 'center';
  preview.style.gap           = '1rem';
  preview.style.marginTop     = '1.5rem';
}

async function startAsPlayer() {
  if (!gameState.currentPlayer) { showToast('Selecciona tu perfil primero', 'warning'); return; }

  if (Sheets.isConnected()) {
    await Sheets.registerPlayer(gameState.currentPlayer);
    showToast('☁️ Conectado a Google Sheets');
  }

  gameState.sessionPoints = 0;
  gameState.currentQ      = 0;

  const normal = GAME_DATA.questions.filter(q => !q.isReto).sort(() => Math.random() - 0.5);
  const retos  = GAME_DATA.questions.filter(q => q.isReto).sort(() => Math.random() - 0.5);
  gameState.questionOrder = [...normal, ...retos];

  goToScreen('screen-question');
  renderQuestion();
}

// =========================================================
// PREGUNTA
// =========================================================
function renderQuestion() {
  const q = gameState.questionOrder[gameState.currentQ];
  if (!q) { endSession(); return; }

  const total   = gameState.questionOrder.length;
  const current = gameState.currentQ + 1;

  document.getElementById('hud-qnum').textContent    = `${current}/${total}`;
  document.getElementById('hud-points').textContent  = gameState.sessionPoints.toLocaleString();
  document.getElementById('q-category').textContent  = q.category;
  document.getElementById('q-difficulty').textContent= DIFFICULTY_STARS[q.difficulty];
  document.getElementById('q-text').textContent      = q.text;
  document.getElementById('q-points').textContent    = `+${DIFFICULTY_POINTS[q.difficulty]} pts`;
  document.getElementById('q-points').className      = 'question-points-badge diff-' + q.difficulty;
  document.getElementById('progress-bar').style.width= ((current-1)/total*100)+'%';

  const p = gameState.currentPlayer;
  document.getElementById('player-banner').innerHTML =
    `<span>${p.emoji}</span> <span style="font-weight:600">${p.name.split(' ')[0]}</span>`;

  const grid = document.getElementById('answers-grid');
  grid.innerHTML = '';
  const answers = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
  answers.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.dataset.correct = ans === q.correct ? 'true' : 'false';
    btn.innerHTML = `<span class="ans-letter">${String.fromCharCode(65+i)}</span><span class="ans-text">${ans}</span>`;
    btn.onclick = () => selectAnswer(btn, q);
    grid.appendChild(btn);
  });

  gameState.answered = false;
  startTimer(DIFFICULTY_TIME[q.difficulty], () => onTimeout(q));
}

// =========================================================
// RESPONDER
// =========================================================
function selectAnswer(btn, q) {
  if (gameState.answered) return;
  gameState.answered = true;
  clearTimer();

  const all = document.querySelectorAll('.answer-btn');
  all.forEach(b => b.disabled = true);
  const isCorrect = btn.dataset.correct === 'true';
  all.forEach(b => {
    if (b.dataset.correct === 'true') b.classList.add('correct');
    else if (b === btn && !isCorrect) b.classList.add('incorrect');
  });

  const timeBonus = isCorrect ? Math.max(0, Math.floor(gameState.timeLeft * 2)) : 0;
  const basePts   = isCorrect ? DIFFICULTY_POINTS[q.difficulty] : 0;
  const total     = basePts + timeBonus;
  if (isCorrect) gameState.sessionPoints += total;

  setTimeout(() => showResult(isCorrect, q, total, timeBonus), 650);
}

function onTimeout(q) {
  if (gameState.answered) return;
  gameState.answered = true;
  document.querySelectorAll('.answer-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  setTimeout(() => showResult(false, q, 0, 0, true), 500);
}

// =========================================================
// RESULTADO + SYNC
// =========================================================
async function showResult(correct, q, points, timeBonus, timeout = false) {
  goToScreen('screen-result');

  const RC = ['✅','🔥','⚡','🎯','🌟','💥','🎉','🏆'];
  const RF = ['❌','😬','💀','😅','🤔','😵','🫤'];
  const TC = ['¡CORRECTO!','¡BRILLANTE!','¡EXACTO!','¡A TODO MOTOR!','¡CRACK AMBIENTAL!'];
  const TF = timeout ? ['⏰ TIEMPO AGOTADO'] : ['¡FALLASTE!','NO ERA ESA...','¡CASI!','MMMM... NOPE'];

  document.getElementById('result-emoji').textContent = correct
    ? RC[Math.floor(Math.random()*RC.length)]
    : RF[Math.floor(Math.random()*RF.length)];

  const el = document.getElementById('result-title');
  el.textContent = correct ? TC[Math.floor(Math.random()*TC.length)] : TF[Math.floor(Math.random()*TF.length)];
  el.className   = 'result-title ' + (correct ? 'correct' : 'wrong');

  document.getElementById('result-explanation').textContent = q.explanation || '';

  const ptEl = document.getElementById('result-points');
  if (correct && points > 0) {
    ptEl.textContent = `+${points} pts${timeBonus > 0 ? ` (+${timeBonus} por velocidad ⚡)` : ''}`;
    ptEl.style.display = 'block';
    triggerCelebration();
  } else {
    ptEl.style.display = 'none';
  }

  const penZone = document.getElementById('penalty-zone');
  if (!correct && GAME_DATA.penalties.length > 0) {
    document.getElementById('penalty-text').textContent =
      GAME_DATA.penalties[Math.floor(Math.random()*GAME_DATA.penalties.length)];
    penZone.style.display = 'block';
  } else {
    penZone.style.display = 'none';
  }

  // Sync
  const syncEl  = document.getElementById('sync-status');
  const syncMsg = document.getElementById('sync-msg');
  syncEl.style.display = 'flex';

  if (Sheets.isConnected()) {
    syncMsg.textContent = '☁️ Guardando en Google Sheets...';
    const res = await Sheets.submitScore(gameState.currentPlayer.id, points, correct, q.text);
    syncMsg.textContent = res && !res.error ? '✅ Guardado en Google Sheets' : '⚠️ Guardado local (sin nube)';
    if (res?.error) saveScoreLocally(gameState.currentPlayer, points, correct);
  } else {
    saveScoreLocally(gameState.currentPlayer, points, correct);
    syncMsg.textContent = '💾 Guardado localmente';
  }
}

function nextQuestion() {
  gameState.currentQ++;
  if (gameState.currentQ >= gameState.questionOrder.length) { endSession(); return; }
  goToScreen('screen-question');
  renderQuestion();
}

function endSession() {
  clearTimer();
  showToast(`🎉 ¡Sesión terminada! Acumulaste ${gameState.sessionPoints.toLocaleString()} pts`);
  loadLeaderboard();
  goToScreen('screen-leaderboard');
}

// =========================================================
// TIMER
// =========================================================
function startTimer(seconds, onTimeout) {
  clearTimer();
  gameState.timeLeft = seconds;
  const circle = document.getElementById('timer-circle');
  const text   = document.getElementById('timer-text');
  const circ   = 2 * Math.PI * 26;
  circle.style.strokeDasharray = circ;

  const update = () => {
    circle.style.strokeDashoffset = circ * (1 - gameState.timeLeft / seconds);
    text.textContent = gameState.timeLeft;
    const urgent = gameState.timeLeft <= 3;
    circle.style.stroke = urgent ? '#ef4444' : '';
    text.style.color    = urgent ? '#ef4444' : '';
  };
  update();
  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--;
    update();
    if (gameState.timeLeft <= 0) { clearTimer(); onTimeout(); }
  }, 1000);
}

function clearTimer() {
  if (gameState.timerInterval) { clearInterval(gameState.timerInterval); gameState.timerInterval = null; }
}

// =========================================================
// CELEBRACIÓN
// =========================================================
function triggerCelebration() {
  const c = document.getElementById('celebration');
  c.style.display = 'block'; c.innerHTML = '';
  const em = ['🎉','⭐','✨','🎊','🌟','💥','🔥'];
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = em[Math.floor(Math.random()*em.length)];
    el.style.cssText = `left:${Math.random()*100}vw;animation-duration:${1+Math.random()*2}s;animation-delay:${Math.random()*0.5}s;font-size:${16+Math.random()*22}px`;
    c.appendChild(el);
  }
  setTimeout(() => { c.style.display = 'none'; }, 2800);
}

// =========================================================
// TOAST
// =========================================================
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 3200);
}

// =========================================================
// ADMIN
// =========================================================
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  if (tabId === 'tab-questions') renderAdminQuestions();
  if (tabId === 'tab-penalties') renderAdminPenalties();
  if (tabId === 'tab-players')   renderAdminPlayers();
}

function renderAdminQuestions() {
  const list = document.getElementById('questions-list');
  list.innerHTML = '';
  GAME_DATA.questions.forEach(q => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
      <div class="admin-item-info">
        <span class="admin-item-cat">${q.category}</span>
        <span class="admin-item-diff">${DIFFICULTY_STARS[q.difficulty]}</span>
        <p class="admin-item-text">${q.text.substring(0,90)}${q.text.length>90?'...':''}</p>
      </div>
      <div class="admin-item-actions">
        <button onclick="editQuestion(${q.id})">✏️</button>
        <button onclick="deleteQuestion(${q.id})" class="btn-danger">🗑️</button>
      </div>`;
    list.appendChild(div);
  });
}

function renderAdminPenalties() {
  const list = document.getElementById('penalties-list');
  list.innerHTML = '';
  GAME_DATA.penalties.forEach((pen, i) => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
      <div class="admin-item-info"><p class="admin-item-text">${pen}</p></div>
      <div class="admin-item-actions">
        <button onclick="editPenalty(${i})">✏️</button>
        <button onclick="deletePenalty(${i})" class="btn-danger">🗑️</button>
      </div>`;
    list.appendChild(div);
  });
}

function renderAdminPlayers() {
  const list = document.getElementById('players-admin-list');
  list.innerHTML = '';
  GAME_DATA.players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
      <div class="admin-item-info" style="display:flex;align-items:center;gap:10px">
        <span style="font-size:1.4rem">${p.emoji}</span>
        <span style="color:${p.color};font-weight:700">■</span>
        <span>${p.name}</span>
      </div>
      <div class="admin-item-actions">
        <button onclick="editPlayer(${p.id})">✏️</button>
        <button onclick="deletePlayer(${p.id})" class="btn-danger">🗑️</button>
      </div>`;
    list.appendChild(div);
  });
}

function addQuestion() {
  gameState.editingQId = null;
  document.getElementById('modal-q-title').textContent = 'Nueva Pregunta';
  ['modal-q-text','modal-q-correct','modal-q-wrong','modal-q-explain'].forEach(id => document.getElementById(id).value='');
  document.getElementById('modal-q-cat').value  = '🔬 Conceptos';
  document.getElementById('modal-q-diff').value = '2';
  document.getElementById('modal-question').style.display = 'flex';
}
function editQuestion(id) {
  const q = GAME_DATA.questions.find(x=>x.id===id); if(!q) return;
  gameState.editingQId = id;
  document.getElementById('modal-q-title').textContent = 'Editar Pregunta';
  document.getElementById('modal-q-text').value    = q.text;
  document.getElementById('modal-q-cat').value     = q.category;
  document.getElementById('modal-q-diff').value    = q.difficulty;
  document.getElementById('modal-q-correct').value = q.correct;
  document.getElementById('modal-q-wrong').value   = q.wrong.join('\n');
  document.getElementById('modal-q-explain').value = q.explanation || '';
  document.getElementById('modal-question').style.display = 'flex';
}
function saveQuestion() {
  const text=document.getElementById('modal-q-text').value.trim();
  const correct=document.getElementById('modal-q-correct').value.trim();
  const wrong=document.getElementById('modal-q-wrong').value.split('\n').map(s=>s.trim()).filter(Boolean);
  const explain=document.getElementById('modal-q-explain').value.trim();
  const cat=document.getElementById('modal-q-cat').value;
  const diff=parseInt(document.getElementById('modal-q-diff').value);
  if(!text||!correct){showToast('Completa pregunta y respuesta correcta','warning');return;}
  if(gameState.editingQId){
    const q=GAME_DATA.questions.find(x=>x.id===gameState.editingQId);
    if(q) Object.assign(q,{text,correct,wrong,explanation:explain,category:cat,difficulty:diff});
  } else {
    const newId=Math.max(0,...GAME_DATA.questions.map(q=>q.id))+1;
    GAME_DATA.questions.push({id:newId,text,correct,wrong,explanation:explain,category:cat,difficulty:diff});
  }
  saveGameData(GAME_DATA); closeModal('modal-question'); renderAdminQuestions(); showToast('✅ Guardada');
}
function deleteQuestion(id){if(!confirm('¿Eliminar?'))return;GAME_DATA.questions=GAME_DATA.questions.filter(q=>q.id!==id);saveGameData(GAME_DATA);renderAdminQuestions();showToast('🗑️ Eliminada');}

function addPenalty(){const t=prompt('Nueva penitencia:');if(t?.trim()){GAME_DATA.penalties.push(t.trim());saveGameData(GAME_DATA);renderAdminPenalties();showToast('✅ Agregada');}}
function editPenalty(i){const t=prompt('Editar:',GAME_DATA.penalties[i]);if(t?.trim()){GAME_DATA.penalties[i]=t.trim();saveGameData(GAME_DATA);renderAdminPenalties();showToast('✅ Actualizada');}}
function deletePenalty(i){if(!confirm('¿Eliminar?'))return;GAME_DATA.penalties.splice(i,1);saveGameData(GAME_DATA);renderAdminPenalties();}

function addPlayer(){const name=prompt('Nombre:');if(!name?.trim())return;const emojis=['🌿','🌊','⚡','🔥','🌙','🏔️','💎'];const colors=['#4FC3F7','#81C784','#FFD54F','#FF8A65','#CE93D8'];const newId=Math.max(0,...GAME_DATA.players.map(p=>p.id))+1;GAME_DATA.players.push({id:newId,name:name.trim(),emoji:emojis[Math.floor(Math.random()*emojis.length)],color:colors[Math.floor(Math.random()*colors.length)]});saveGameData(GAME_DATA);renderAdminPlayers();showToast('✅ Agregado');}
function editPlayer(id){const p=GAME_DATA.players.find(x=>x.id===id);if(!p)return;const name=prompt('Nombre:',p.name);if(name?.trim()){p.name=name.trim();saveGameData(GAME_DATA);renderAdminPlayers();showToast('✅ Actualizado');}}
function deletePlayer(id){if(!confirm('¿Eliminar?'))return;GAME_DATA.players=GAME_DATA.players.filter(p=>p.id!==id);saveGameData(GAME_DATA);renderAdminPlayers();}

function exportData(){const blob=new Blob([JSON.stringify(GAME_DATA,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ecochallenge_data.json';a.click();URL.revokeObjectURL(url);showToast('💾 Exportado');}
function importData(event){const file=event.target.files[0];if(!file)return;const r=new FileReader();r.onload=e=>{try{const data=JSON.parse(e.target.result);if(data.questions&&data.players){GAME_DATA=data;saveGameData(GAME_DATA);renderAdminQuestions();showToast('📂 Importado');}else showToast('❌ Formato inválido','warning');}catch{showToast('❌ Error','warning');}};r.readAsText(file);}

function closeModal(id){document.getElementById(id).style.display='none';}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  const savedUrl = localStorage.getItem('eco_sheets_url');
  if (savedUrl !== null) {
    goToScreen('screen-intro');
    checkConnection();
  }
  document.getElementById('modal-question').addEventListener('click', function(e){
    if(e.target===this) closeModal('modal-question');
  });
  // Click sonoro en todos los botones (audio se inicia con primer gesto)
  document.addEventListener('click', (e) => {
    if (e.target.matches('button, .player-chip, .mode-card, .answer-btn')) {
      if (e.target.matches('.answer-btn')) return; // el answer tiene su propio sonido
      SoundEngine.playClick();
    }
  });

  // Botón mute flotante — se inyecta dinámicamente
  const muteBtn = document.createElement('button');
  muteBtn.id = 'mute-btn';
  muteBtn.innerHTML = '🔊';
  muteBtn.title = 'Silenciar / Activar sonido';
  muteBtn.style.cssText = `
    position:fixed; bottom:1rem; right:1rem; z-index:500;
    width:40px; height:40px; border-radius:50%;
    background:var(--card,#1e2d40); border:1px solid rgba(255,255,255,0.12);
    color:#fff; font-size:16px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:opacity .2s, transform .15s;
    opacity:0.6;
  `;
  muteBtn.onmouseenter = () => muteBtn.style.opacity = '1';
  muteBtn.onmouseleave = () => muteBtn.style.opacity = '0.6';
  muteBtn.onclick = (e) => {
    e.stopPropagation();
    SoundEngine.init();
    const isMuted = SoundEngine.toggleMute();
    muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
    muteBtn.style.transform = 'scale(0.9)';
    setTimeout(() => muteBtn.style.transform = '', 150);
    if (isMuted) SoundEngine.stopTimerSound();
  };
  document.body.appendChild(muteBtn);  
});

