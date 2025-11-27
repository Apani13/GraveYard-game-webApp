// js/game.js - versión corregida SOLO con cambios de stage 1/2/3 y PNGs

const NUM_GRAVES = 6;
let currentTool = null;
let summons = [];
let collected = {
  ghost: 0,
  zombie: 0,
  skeleton: 0
};

let musicEnabled = true;
let sfxEnabled = true;
let musicVolume = 0.35;
let sfxVolume = 0.45;



// -------------------- Helpers token and username --------------------
function getToken() {
  return localStorage.getItem("jwtToken");
}

function clearToken() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");
}


function getUsername() {
  return localStorage.getItem("username");
}

function clearUsername() {
  localStorage.removeItem("username");
}



// -------------------- Init --------------------
document.addEventListener("DOMContentLoaded", async () => {
  if (!getToken()) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearToken();
      window.location.href = "login.html";
    });
  }



const panelName = document.getElementById("user-panel-name");
if (panelName) {
  panelName.textContent = getUsername() || "Necromancer";
}


// --- Admin button (solo admins) ---
if (localStorage.getItem("role") === "ADMIN") {
  const btn = document.createElement("button");
  btn.className = "btn-admin-panel";

  btn.innerHTML = `
    <span class="admin-badge">★</span>
    <span class="admin-text">Admin Panel</span>
  `;

  btn.addEventListener("click", () => {
    window.location.href = "admin.html";
  });

  document.querySelector(".user-panel").appendChild(btn);
}


  initToolbar();
  initGraveyardGrid();
  initModals();

  await initUserStats();

  loadSummons();
  startAmbience();
  initSoundSettings();
});



// -------------------- Toolbar --------------------
function initToolbar() {
  const toolButtons = document.querySelectorAll(".tool-btn");

  toolButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      const selectedTool = btn.dataset.tool;

      // IMPORTANT: capture previous tool BEFORE overwriting it
      const previousTool = currentTool;

      // Toggle logic (deselect if clicking same tool)
      currentTool = (currentTool === selectedTool) ? null : selectedTool;

      // Play SFX only when selecting a new tool
      if (currentTool && previousTool !== currentTool) {
        const toolToSound = {
          book: "sfx-spellbook",
          soul: "sfx-soul",
          dust: "sfx-dust",
          shovel: "sfx-shovel",
          harvest: "sfx-harvest"
        };
        playSFX(toolToSound[currentTool]);
      }

      updateToolbarUI();
      updateCursor();
    });
  });

  // Initial state when game loads
  updateToolbarUI();
  updateCursor();
}


function updateToolbarUI() {
  const toolButtons = document.querySelectorAll(".tool-btn");

  toolButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tool === currentTool);
  });

  updateCursor();  // 🔥 NEW: Make sure cursor updates when UI changes
}


// -------------------- Cursor System --------------------
function updateCursor() {
  const body = document.body;

  // Default cursor when no tool is selected
if (!currentTool) {
  body.style.cursor = "url('assets/cursors/spooky-pointer.png') 0 0, auto";
  return;
}


  const cursorMap = {
    book:    "assets/cursors/spellbook-cursor.png",
    soul:    "assets/cursors/aura-cursor.png",
    dust:    "assets/cursors/arcane-dust-cursor.png",
    shovel:  "assets/cursors/shovel-cursor.png",
    harvest: "assets/cursors/seal-cursor.png"
  };

  const iconPath = cursorMap[currentTool];

if (iconPath) {
  body.style.cursor = `url('${iconPath}') 0 0, auto`;
} else {
  body.style.cursor = "url('assets/cursors/spooky-pointer.png') 0 0, auto";
}

}





function playSFX(id) {
  if (!sfxEnabled) return;

  const audio = document.getElementById(id);
  if (!audio) return;

  audio.currentTime = 0;
  audio.volume = sfxVolume * 0.5;
  audio.play().catch(() => {});
}


function playFinalCreatureSFX(creatureType) {
  if (!sfxEnabled) return;

  const map = {
    ghost: "sfx-final-ghost",
    zombie: "sfx-final-zombie",
    skeleton: "sfx-final-skeleton"
  };

  const audioId = map[creatureType];
  if (!audioId) return;

  const audio = document.getElementById(audioId);
  if (!audio) return;

  let vol = sfxVolume * 10.5;   // prueba 1.4–1.8 según sensaciones
  if (vol > 1) vol = 1;
  audio.play().catch(() => {});
}




// -------------------- Ambience Music --------------------
// -------------------- Ambience Music + Ambient Sounds --------------------
function startAmbience() {
  const bg = document.getElementById("bg-music");
  const birds1 = document.getElementById("birds-1");
  const birds2 = document.getElementById("birds-2");
  const wind = document.getElementById("wind-soft");
  const whispers = document.getElementById("whispers");

  // Volúmenes iniciales
  if (bg) bg.volume = musicVolume = 0.08;
  if (birds1) birds1.volume = 0.45 * sfxVolume;
  if (birds2) birds2.volume = 0.50 * sfxVolume;
  if (wind) wind.volume = 0.45 * sfxVolume;
  if (whispers) whispers.volume = 0.50 * sfxVolume;

  // Función para reproducirlos todos
  const playAll = () => {
    if (musicEnabled && bg) bg.play().catch(()=>{});

    if (sfxEnabled) {
      birds1?.play().catch(()=>{});
      birds2?.play().catch(()=>{});
      wind?.play().catch(()=>{});
      whispers?.play().catch(()=>{});
    } else {
      birds1?.pause();
      birds2?.pause();
      wind?.pause();
      whispers?.pause();
    }
  };

  // Intento inicial (autoplay suele fallar)
  playAll();

  // Fallback si el navegador bloquea autoplay
  document.body.addEventListener("click", () => playAll(), { once: true });

  // Guardar la pista musical principal para sliders
  window.ambienceTrack = bg;

  // Guardar el pack de ambientes para el slider SFX
  window.ambientSounds = { birds1, birds2, wind, whispers };
}






function initSoundSettings() {
  const musicSlider = document.getElementById("music-volume");
  const sfxSlider = document.getElementById("sfx-volume");
  const musicToggle = document.getElementById("music-toggle");
  const sfxToggle = document.getElementById("sfx-toggle");

  // MUSIC VOLUME
  musicSlider.addEventListener("input", () => {
    musicVolume = parseFloat(musicSlider.value);
    if (window.ambienceTrack) {
      window.ambienceTrack.volume = musicVolume;
    }
  });

  // SFX VOLUME
 sfxSlider.addEventListener("input", () => {
   sfxVolume = parseFloat(sfxSlider.value);

   if (window.ambientSounds) {
     const { birds1, birds2, wind, whispers } = window.ambientSounds;

     if (birds1) birds1.volume = 0.35 * sfxVolume;
     if (birds2) birds2.volume = 0.25 * sfxVolume;
     if (wind) wind.volume = 0.15 * sfxVolume;
     if (whispers) whispers.volume = 0.10 * sfxVolume;
   }
 });


  // MUSIC ON/OFF
  musicToggle.addEventListener("click", () => {
    musicEnabled = !musicEnabled;
    musicToggle.textContent = musicEnabled ? "ON" : "OFF";
    musicToggle.classList.toggle("off", !musicEnabled);

    if (window.ambienceTrack) {
      if (musicEnabled) {
        window.ambienceTrack.volume = musicVolume;
        window.ambienceTrack.play().catch(()=>{});
      } else {
        window.ambienceTrack.pause();
      }
    }
  });

  // SFX ON/OFF
  sfxToggle.addEventListener("click", () => {
    sfxEnabled = !sfxEnabled;
    sfxToggle.textContent = sfxEnabled ? "ON" : "OFF";
    sfxToggle.classList.toggle("off", !sfxEnabled);
  });
}






// -------------------- Grid --------------------
function initGraveyardGrid() {
  const grid = document.getElementById("graveyard-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const positions = [
 { left: "87%", top: "76%" }, // 0 ok
   { left: "72%", top: "85%" }, // 1

   // Fila central (un poco por encima del suelo)
   { left: "47%", top: "91%" }, // 2
   { left: "15%", top: "82%" }, // 3
   { left: "36%", top: "75%" }, // 4

   // Fila superior (la tumba que está más arriba en el fondo)
   { left: "60%", top: "74%" }  // 5 ok (arriba
  ];

  for (let i = 0; i < positions.length; i++) {
    const slot = document.createElement("div");
    slot.className = "grave-slot";
    slot.dataset.index = i.toString();

    // Posición en el fondo
    slot.style.left = positions[i].left;
    slot.style.top = positions[i].top;

    slot.addEventListener("click", () => onGraveClick(i));

    grid.appendChild(slot);
  }
}




// -------------------- Stage Logic --------------------

function getStage(soul, arcane) {
  const total = (soul || 0) + (arcane || 0);

  // Stage 1 – creat, sense energia
  if (total === 0) return 1;

  // Stage 3 – final, criatura presentada
  if (total >= 100) return 3;

  // Stage 2 – a mig procés, qualsevol energia però no final
  return 2;
}

function getGraveSprite(stage, creatureType) {
  if (stage === 0) return "/assets/graves/grave.png";              // slot buit
  if (stage === 1) return "/assets/graves/grave-stage-1.png";      // creat
  if (stage === 2) return "/assets/graves/grave-stage-2.png";      // regant / creixent

  // Stage 3 → criatura final depenent del tipus
  return `assets/graves/${creatureType}-summon.png`;
}




// -------------------- Render --------------------
function getSummonByGraveIndex(index) {
  return summons.find(s => s.graveIndex === index);
}




function renderGraveyard() {
  for (let i = 0; i < NUM_GRAVES; i++) {
    const slot = document.querySelector(`.grave-slot[data-index="${i}"]`);
    if (!slot) continue;

    const summon = getSummonByGraveIndex(i);

    // Always show default grave if empty
    slot.style.backgroundImage = "url('assets/graves/grave.png')";

    if (!summon) continue;

    const { soulEnergy = 0, arcaneStability = 0, creatureType } = summon;
    const stage = getStage(soulEnergy, arcaneStability);
    const sprite = getGraveSprite(stage, creatureType);

    slot.style.backgroundImage = `url('${sprite}')`;
  }
}



// -------------------- Click logic --------------------
function onGraveClick(index) {
  const summon = getSummonByGraveIndex(index);

  // ---- EMPTY SLOT ----
  if (!summon) {
    if (currentTool === "book") {
      playSFX("sfx-spellbook");   // 🔊 NEW
      openCreateModal(index);
    }
    return;
  }

  // ---- NO TOOL SELECTED → OPEN INFO ----
  if (!currentTool) {
    openInfoModal(summon);
    return;
  }

  // ---- USE TOOLS ----
  if (currentTool === "soul") {
    playSFX("sfx-soul");         // 🔊 NEW
    applySoulEnergy(summon);

  } else if (currentTool === "dust") {
    playSFX("sfx-dust");         // 🔊 NEW
    applyArcaneDust(summon);

  } else if (currentTool === "shovel") {
    playSFX("sfx-shovel");       // 🔊 NEW
    deleteSummonDialog(summon);
  }

  // ---- HARVEST ----
  if (currentTool === "harvest") {
    const stage = getStage(summon.soulEnergy, summon.arcaneStability);

    if (stage === 3) {
      playSFX("sfx-harvest");    // 🔊 NEW
      harvestSummon(summon);

    } else {
      openWarning("La criatura encara no està llesta per collir!");
    }
    return;
  }
}

// -------------------- Modals --------------------
let modalCreate, modalInfo, modalBackdrop;
let createForm, createErrorEl;

function initModals() {
  modalCreate = document.getElementById("modal-create");
  modalInfo = document.getElementById("modal-info");
  modalBackdrop = document.getElementById("modal-backdrop");

  createForm = document.getElementById("create-summon-form");
  createErrorEl = document.getElementById("create-error");

  if (createForm) {
    createForm.addEventListener("submit", onCreateSummonSubmit);
  }

  const cancelCreateBtn = document.getElementById("cancel-create");
  if (cancelCreateBtn) {
    cancelCreateBtn.addEventListener("click", closeCreateModal);
  }

  const closeInfoBtn = document.getElementById("close-info");
  if (closeInfoBtn) {
    closeInfoBtn.addEventListener("click", closeInfoModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", () => {
      closeCreateModal();
      closeInfoModal();
    });
  }
}

function openCreateModal(graveIndex) {

  // 🔄 limpiar campos del modal (name, epitaph, etc.)
  if (createForm) {
    createForm.reset();
  }

  const indexInput = document.getElementById("create-grave-index");
  if (indexInput) indexInput.value = graveIndex;

  if (createErrorEl) createErrorEl.textContent = "";

  modalCreate?.classList.remove("hidden");
  modalBackdrop?.classList.remove("hidden");
}

function closeCreateModal() {
  if (createForm) {
    createForm.reset();
  }
  modalCreate?.classList.add("hidden");
  modalBackdrop?.classList.add("hidden");
}

function openInfoModal(summon) {
  const infoContent = document.getElementById("info-content");
  if (!infoContent) return;

  const stage = getStage(summon.soulEnergy, summon.arcaneStability);
  let stageText;
  if (stage === 0) stageText = "Les energies comencen a moure's...";
  else if (stage === 1) stageText = "La silueta de la criatura pren forma...";
  else if (stage === 2) stageText = "La criatura gairebé es revela...";
  else stageText = "La criatura està a punt de ressorgir!";

infoContent.innerHTML = `
  <div class="info-section">
    <p class="info-label">Tipus</p>
    <p class="info-value">${summon.creatureType}</p>
  </div>

  <div class="info-section">
    <p class="info-label">Nom</p>
    <p class="info-value">${summon.name || "(sense nom)"}</p>
  </div>

  <div class="info-section">
    <p class="info-label">Tomba</p>
    <p class="info-value">#${summon.graveIndex}</p>
  </div>

  <div class="info-divider"></div>

  <div class="info-grid">
    <div>
      <p class="info-label">Ànima</p>
      <p class="info-value">${summon.soulEnergy ?? 0}</p>
    </div>
    <div>
      <p class="info-label">Arcà</p>
      <p class="info-value">${summon.arcaneStability ?? 0}</p>
    </div>
  </div>

  <div class="info-section">
    <p class="info-label">Epitafi</p>
    <p class="info-value">${summon.epitaph || "(cap epitafi)"}</p>
  </div>

  <div class="info-divider"></div>

  <p class="info-status">${stageText}</p>
`;


  modalInfo?.classList.remove("hidden");
  modalBackdrop?.classList.remove("hidden");
}

function closeInfoModal() {
  modalInfo?.classList.add("hidden");
  modalBackdrop?.classList.add("hidden");
}



// -------------------- NEW GLOBAL MODALS --------------------

function openConfirm(title, message) {
  return new Promise(resolve => {
    const modal = document.getElementById("modal-confirm");
    const backdrop = modalBackdrop;

    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-message").textContent = message;

    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");

    // sonido + animación al abrir modal
    const sOpen = document.getElementById("sfx-modal-open");
    if (sOpen) sOpen.play();

    modal.style.transform = "scale(0.85)";
    setTimeout(() => {
      modal.style.transform = "scale(1)";
    }, 60);


    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    const close = (result) => {
      // activar animación de cierre
      modal.classList.add("modal-closing");

      // sonido cerrar
      const sClose = document.getElementById("sfx-modal-close");
      if (sClose) sClose.play();

      // esperar a que termine la animación
      setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("modal-closing");
        backdrop.classList.add("hidden");

        yesBtn.removeEventListener("click", onYes);
        noBtn.removeEventListener("click", onNo);

        resolve(result);
      }, 220);
    };


    const onYes = () => close(true);
    const onNo = () => close(false);

    yesBtn.addEventListener("click", onYes);
    noBtn.addEventListener("click", onNo);
  });
}

function openWarning(message) {
  const modal = document.getElementById("modal-warning");
  document.getElementById("warning-message").textContent = message;

  modal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");

  document.getElementById("warning-ok").onclick = () => {
    modal.classList.add("hidden");
    modalBackdrop.classList.add("hidden");
  };
}




// -------------------- API actions --------------------
async function loadSummons() {
  try {
    summons = await apiGetSummons();
    renderGraveyard();
  } catch (err) {
    console.error("Error loading summons:", err);
  }
}

async function onCreateSummonSubmit(e) {
  e.preventDefault();
  if (!createForm) return;

  const formData = new FormData(createForm);

  const CREATURE_TYPES = ["zombie", "ghost", "skeleton"];
  const randomType = CREATURE_TYPES[Math.floor(Math.random() * CREATURE_TYPES.length)];

  const payload = {
    creatureType: randomType,
    name: formData.get("name") || null,
    graveIndex: Number(formData.get("graveIndex")),
    epitaph: formData.get("epitaph") || null
  };

  try {
    await apiCreateSummon(payload);
    await loadSummons();
    closeCreateModal();
  } catch (err) {
    if (createErrorEl) createErrorEl.textContent = "No s'ha pogut crear el ritual.";
  }
}

async function applySoulEnergy(summon) {
  const prevStage = getStage(summon.soulEnergy, summon.arcaneStability);

  const newSoul = Math.min((summon.soulEnergy || 0) + 10, 100);
  const newStage = getStage(newSoul, summon.arcaneStability);

  try {
    await apiUpdateSummon(summon.id, { soulEnergy: newSoul });

    // si acaba d'arribar a l'estat final...
    if (prevStage !== 3 && newStage === 3) {
      playFinalCreatureSFX(summon.creatureType);
    }

    await loadSummons();
  } catch (err) {
    alert("No s'ha pogut aplicar essència d'ànima.");
  }
}


async function applyArcaneDust(summon) {
  const prevStage = getStage(summon.soulEnergy, summon.arcaneStability);

  const newArcane = Math.min((summon.arcaneStability || 0) + 10, 100);
  const newStage = getStage(summon.soulEnergy, newArcane);

  try {
    await apiUpdateSummon(summon.id, { arcaneStability: newArcane });

    // si acaba d'arribar a l'estat final...
    if (prevStage !== 3 && newStage === 3) {
      playFinalCreatureSFX(summon.creatureType);
    }

    await loadSummons();
  } catch (err) {
    alert("No s'ha pogut aplicar pols arcana.");
  }
}


async function deleteSummonDialog(summon) {
  const ok = await openConfirm(
    "Cancel ritual?",
    `Vols cancel·lar el ritual de "${summon.name || summon.creatureType}"?`
  );
  if (!ok) return;

  // 🔊 Sonido SOLO cuando se confirma el delete
  playSFX("sfx-delete");

  try {
    await apiDeleteSummon(summon.id);
    await loadSummons();
  } catch (err) {
    alert("No s'ha pogut cancel·lar el ritual.");
  }
}


async function harvestSummon(summon) {
  const ok = await openConfirm(
    "Harvest",
    `Vols collir la criatura "${summon.creatureType}"?`
  );
  if (!ok) return;

  try {
    await apiDeleteSummon(summon.id);

    // Preparamos el delta que vamos a enviar al backend
    const delta = {
      ghostDelta: 0,
      zombieDelta: 0,
      skeletonDelta: 0,
    };

    if (summon.creatureType === "ghost") {
      collected.ghost++;
      delta.ghostDelta = 1;
    } else if (summon.creatureType === "zombie") {
      collected.zombie++;
      delta.zombieDelta = 1;
    } else if (summon.creatureType === "skeleton") {
      collected.skeleton++;
      delta.skeletonDelta = 1;
    }

    // 🔁 Actualizamos backend
    await apiIncrementMyStats(delta);

    // Actualizamos panel local
    updateCollectedStats();
    await loadSummons();
  } catch (err) {
    console.error(err);
    alert("Error en collir la criatura.");
  }
}




function updateCollectedStats() {
  document.getElementById("stat-ghosts").textContent = collected.ghost;
  document.getElementById("stat-zombies").textContent = collected.zombie;
  document.getElementById("stat-skeletons").textContent = collected.skeleton;
}



async function initUserStats() {
  try {
    const stats = await apiGetMyStats();

    collected.ghost = stats.ghostsCollected ?? 0;
    collected.zombie = stats.zombiesCollected ?? 0;
    collected.skeleton = stats.skeletonsCollected ?? 0;

    updateCollectedStats();
  } catch (err) {
    console.error("Error carregant estadístiques de l'usuari", err);
    // Si falla, simplemente se quedan en 0 y ya.
  }
}

function updateCollectedStats() {
  document.getElementById("stat-ghosts").textContent = collected.ghost;
  document.getElementById("stat-zombies").textContent = collected.zombie;
  document.getElementById("stat-skeletons").textContent = collected.skeleton;
}


