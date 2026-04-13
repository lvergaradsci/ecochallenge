// =========================================================
// sheets.js — Conector con Google Apps Script
// =========================================================

const Sheets = (() => {

  function getUrl() {
    return "https://script.google.com/macros/s/AKfycbzZ2XNwD7cYkDpoc4SPfs1xQwkYZGQ6K0SaaiVqfytmXThXuIimpueiJvmdNxh5gvbu/exec";
            
  }

  function isConnected() {
    return !!getUrl();
  }

  // ---- Llamada genérica a la API ----
  async function call(params) {
    const url = getUrl();
    if (!url) return { error: 'Sin URL configurada' };

    const qs = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${url}?${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Sheets error:', err);
      return { error: err.message };
    }
  }

  // ---- Registrar jugador ----
  async function registerPlayer(player) {
    return call({ action: 'registerPlayer', name: player.name, emoji: player.emoji, id: player.id });
  }

  // ---- Enviar puntaje tras cada pregunta ----
  async function submitScore(playerId, points, correct, questionText) {
    return call({
      action: 'submitScore',
      id: playerId,
      points,
      correct: String(correct),
      question: (questionText || '').substring(0, 80)
    });
  }

  // ---- Obtener tabla de puntajes ----
  async function getScores() {
    return call({ action: 'getScores' });
  }

  // ---- Reiniciar todos los scores ----
  async function resetGame() {
    return call({ action: 'resetGame' });
  }

  // ---- Verificar conexión ----
  async function ping() {
    const res = await call({ action: 'getScores' });
    return !res.error;
  }

  return { isConnected, getUrl, registerPlayer, submitScore, getScores, resetGame, ping };
})();


// =========================================================
// UI: configuración y estado de conexión
// =========================================================

function saveConfig() {
  const url = document.getElementById('config-url').value.trim();
  if (!url || !url.startsWith('https://script.google.com')) {
    showToast('⚠️ La URL debe ser de script.google.com', 'warning');
    return;
  }
  localStorage.setItem('eco_sheets_url', url);
  showToast('✅ URL guardada. Verificando conexión...');
  goToScreen('screen-intro');
  checkConnection();
}

function skipConfig() {
  localStorage.setItem('eco_sheets_url', '');
  showToast('🎮 Modo local activado. Los puntajes se guardarán solo en este dispositivo.');
  goToScreen('screen-intro');
  updateConnectionUI(false);
}

function changeConfig() {
  document.getElementById('config-url').value = Sheets.getUrl();

  
  //goToScreen('screen-config');
}

async function checkConnection() {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (!text || !dot) return;

  if (!Sheets.isConnected()) {
    dot.className  = 'status-dot offline';
    text.textContent = 'Modo local (sin nube)';
    return;
  }

  dot.className  = 'status-dot checking';
  text.textContent = 'Conectando...';

  const ok = await Sheets.ping();
  updateConnectionUI(ok);
}

function updateConnectionUI(ok) {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (!dot || !text) return;
  if (ok) {
    dot.className  = 'status-dot online';
    text.textContent = 'Conectado a Google Sheets ✓';
  } else {
    dot.className  = 'status-dot offline';
    text.textContent = Sheets.isConnected() ? 'Error al conectar — revisa la URL' : 'Modo local';
  }
}

// =========================================================
// Leaderboard
// =========================================================

async function loadLeaderboard() {
  const list = document.getElementById('leaderboard-list');
  if (!list) return;
  list.innerHTML = '<div class="loading-state">⏳ Cargando desde Google Sheets...</div>';

  if (!Sheets.isConnected()) {
    // Modo local: usar puntajes almacenados localmente
    const localScores = JSON.parse(localStorage.getItem('eco_local_scores') || '[]');
    if (localScores.length === 0) {
      list.innerHTML = '<div class="loading-state">Aún no hay puntajes. ¡Juega primero!</div>';
      return;
    }
    renderLeaderboard(localScores.sort((a,b) => b.points - a.points));
    return;
  }

  const res = await Sheets.getScores();
  if (res.error || !res.players) {
    list.innerHTML = `<div class="loading-state error">❌ Error: ${res.error || 'Sin datos'}</div>`;
    return;
  }
  renderLeaderboard(res.players);
}

function renderLeaderboard(players) {
  const list = document.getElementById('leaderboard-list');
  if (!list) return;

  if (players.length === 0) {
    list.innerHTML = '<div class="loading-state">Aún no hay puntajes registrados.</div>';
    return;
  }

  const medals = ['🥇','🥈','🥉'];
  list.innerHTML = '';

  players.forEach((p, i) => {
    const accuracy = p.correct + p.incorrect > 0
      ? Math.round(p.correct / (p.correct + p.incorrect) * 100)
      : 0;

    const card = document.createElement('div');
    card.className = 'lb-card' + (i < 3 ? ' lb-top' : '');
    card.innerHTML = `
      <div class="lb-rank">${medals[i] || '#' + (i+1)}</div>
      <div class="lb-emoji">${p.emoji || '🌿'}</div>
      <div class="lb-info">
        <div class="lb-name">${p.name}</div>
        <div class="lb-meta">${p.correct || 0} correctas · ${accuracy}% precisión</div>
      </div>
      <div class="lb-points">${(p.points || 0).toLocaleString()} pts</div>
    `;
    list.appendChild(card);
  });
}

// =========================================================
// Exportar como Excel (CSV que Excel abre directo)
// =========================================================

async function exportLeaderboard() {
  let players = [];

  if (Sheets.isConnected()) {
    const res = await Sheets.getScores();
    players = res.players || [];
  } else {
    players = JSON.parse(localStorage.getItem('eco_local_scores') || '[]');
  }

  if (players.length === 0) { showToast('No hay puntajes para exportar', 'warning'); return; }

  const header = ['Posición','Nombre','Emoji','Puntos','Correctas','Incorrectas','Precisión (%)'];
  const rows = players.map((p, i) => {
    const acc = p.correct + p.incorrect > 0
      ? Math.round(p.correct / (p.correct + p.incorrect) * 100)
      : 0;
    return [i+1, p.name, p.emoji, p.points, p.correct || 0, p.incorrect || 0, acc];
  });

  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  // BOM para que Excel en Windows lo abra con tildes correctas
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'EcoChallenge_Resultados.csv'; a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Descargado — ábrelo con Excel');
}

// =========================================================
// Reset desde admin
// =========================================================

async function resetAllScores() {
  if (!confirm('¿Borrar TODOS los puntajes en Google Sheets? Esta acción no se puede deshacer.')) return;
  if (!Sheets.isConnected()) {
    localStorage.removeItem('eco_local_scores');
    showToast('✅ Puntajes locales borrados');
    return;
  }
  const res = await Sheets.resetGame();
  if (res.ok) showToast('✅ Puntajes borrados en Google Sheets');
  else showToast('❌ Error: ' + (res.error || 'desconocido'), 'warning');
}

function resetLocalProgress() {
  if (!confirm('¿Reiniciar tu progreso local en este dispositivo?')) return;
  localStorage.removeItem('eco_current_player');
  localStorage.removeItem('eco_local_scores');
  showToast('🔄 Progreso local reiniciado');
}

// Guardar score localmente como fallback
function saveScoreLocally(player, points, correct) {
  const scores = JSON.parse(localStorage.getItem('eco_local_scores') || '[]');
  const existing = scores.find(s => s.id === player.id);
  if (existing) {
    existing.points    += points;
    existing.correct   += correct ? 1 : 0;
    existing.incorrect += correct ? 0 : 1;
  } else {
    scores.push({
      id: player.id, name: player.name, emoji: player.emoji,
      points, correct: correct ? 1 : 0, incorrect: correct ? 0 : 1
    });
  }
  localStorage.setItem('eco_local_scores', JSON.stringify(scores));
}
document.addEventListener('DOMContentLoaded', () => {
  console.log('App iniciada 🚀');
  checkConnection();
});
