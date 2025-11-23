/******************************************************
 *  Graveyard Game - Frontend Logic
 ******************************************************/

let currentTool = null;
let summons = [];

// -------------------------------------------
// Token handlers
// -------------------------------------------
function getToken() {
  return localStorage.getItem("jwtToken");
}

function clearToken() {
  localStorage.removeItem("jwtToken");
}

// -------------------------------------------
// On DOM Loaded
// -------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Si no hay token → redirigir a login
  if (!getToken()) {
    window.location.href = "login.html";
    return;
  }

  // Logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearToken();
      window.location.href = "login.html";
    });
  }

  // Username fijo por ahora
  const usernameLabel = document.getElementById("username-label");
  if (usernameLabel) {
    usernameLabel.textContent = "Necromancer";
  }

  initToolbar();
  initModals();
  initGraveyardGrid();

  loadSummons();
});

// -------------------------------------------
// Toolbar
// -------------------------------------------
function initToolbar() {
  const toolButtons = document.querySelectorAll(".tool-btn");

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tool = button.dataset.tool;

      if (currentTool === tool) {
        currentTool = null;
        button.classList.remove("active");
      } else {
        currentTool = tool;
        toolButtons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
      }
    });
  });
}

// -------------------------------------------
// Modals
// -------------------------------------------
let createModalEl, createForm, createErrorEl;
let infoModalEl, infoCloseBtn, infoBodyEl;
let deleteModalEl, deleteConfirmBtn, deleteCancelBtn;

function initModals() {
  // CREATE MODAL
  createModalEl = document.getElementById("create-modal");
  createForm = document.getElementById("create-form");
  createErrorEl = document.getElementById("create-error");

  if (createForm) {
    createForm.addEventListener("submit", onCreateSummonSubmit);
  }

  // INFO MODAL
  infoModalEl = document.getElementById("info-modal");
  infoCloseBtn = document.getElementById("info-close-btn");
  infoBodyEl = document.getElementById("info-body");

  if (infoCloseBtn) {
    infoCloseBtn.addEventListener("click", closeInfoModal);
  }

  // DELETE MODAL
  deleteModalEl = document.getElementById("delete-modal");
  deleteConfirmBtn = document.getElementById("delete-confirm-btn");
  deleteCancelBtn = document.getElementById("delete-cancel-btn");

  if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener("click", closeDeleteModal);
  }
}

// -------------------------------------------
// Graveyard grid setup
// -------------------------------------------
function initGraveyardGrid() {
  const container = document.getElementById("graveyard-container");
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const slot = document.createElement("div");
    slot.className = "grave-slot";
    slot.dataset.index = i;

    const emoji = document.createElement("div");
    emoji.className = "grave-emoji";
    emoji.textContent = "🪦";

    slot.appendChild(emoji);
    slot.addEventListener("click", () => onGraveClick(i));

    container.appendChild(slot);
  }
}

// -------------------------------------------
// Click logic
// -------------------------------------------
function onGraveClick(index) {
  const summon = summons.find((s) => s.graveIndex === index);

  if (!summon) {
    if (currentTool === "book") {
      openCreateModal(index);
    }
    return;
  }

  if (!currentTool) {
    openInfoModal(summon);
    return;
  }

  switch (currentTool) {
    case "candle":
      applySoulEnergy(summon.id);
      break;
    case "dust":
      applyArcaneDust(summon.id);
      break;
    case "skull":
      openDeleteModal(summon.id);
      break;
  }
}

// -------------------------------------------
// Create Summon
// -------------------------------------------
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
    console.error(err);
    createErrorEl.textContent = "No s'ha pogut crear el ritual.";
  }
}

function openCreateModal(index) {
  if (!createModalEl) return;

  createErrorEl.textContent = "";
  createForm.reset();
  createForm.graveIndex.value = index;

  createModalEl.classList.add("open");
}

function closeCreateModal() {
  if (createModalEl) {
    createModalEl.classList.remove("open");
  }
}

// -------------------------------------------
// Info Modal
// -------------------------------------------
function openInfoModal(summon) {
  infoBodyEl.innerHTML = `
    <p><strong>Nom:</strong> ${summon.name || "(sense nom)"}</p>
    <p><strong>Ritual ID:</strong> ${summon.id}</p>
    <p><strong>Posició:</strong> ${summon.graveIndex}</p>
    <p><strong>Soul Energy:</strong> ${summon.soulEnergy}</p>
    <p><strong>Arcane Stability:</strong> ${summon.arcaneStability}</p>
    <p><strong>Tipus:</strong> ${summon.creatureType}</p>
    <p><strong>Epitafi:</strong> ${summon.epitaph || "(cap)"}</p>
  `;

  infoModalEl.classList.add("open");
}

function closeInfoModal() {
  infoModalEl.classList.remove("open");
}

// -------------------------------------------
// Delete Summon Modal
// -------------------------------------------
let selectedDeleteID = null;

function openDeleteModal(id) {
  selectedDeleteID = id;
  deleteModalEl.classList.add("open");

  deleteConfirmBtn.onclick = async () => {
    try {
      await apiDeleteSummon(selectedDeleteID);
      await loadSummons();
      closeDeleteModal();
    } catch (err) {
      console.error(err);
    }
  };
}

function closeDeleteModal() {
  deleteModalEl.classList.remove("open");
}

// -------------------------------------------
// Level calculation
// -------------------------------------------
function getStage(soul, stability) {
  const total = soul + stability;
  if (total < 20) return 0;
  if (total < 50) return 1;
  return 2;
}

// -------------------------------------------
// Render Graveyard
// -------------------------------------------
function renderGraveyard() {
  const container = document.getElementById("graveyard-container");
  if (!container) return;

  const slots = container.querySelectorAll(".grave-slot");

  slots.forEach((slot, index) => {
    const emojiEl = slot.querySelector(".grave-emoji");

    slot.classList.remove(
      "creature-ghost",
      "creature-zombie",
      "creature-skeleton"
    );

    emojiEl.textContent = "🪦";

    const summon = summons.find((s) => s.graveIndex === index);
    if (!summon) return;

    const { soulEnergy = 0, arcaneStability = 0, creatureType } = summon;
    const stage = getStage(soulEnergy, arcaneStability);

    if (stage === 0) {
      emojiEl.textContent = "✨";
    } else if (stage === 1) {
      emojiEl.textContent = "💀";
    } else {
      if (creatureType === "ghost") {
        slot.classList.add("creature-ghost");
      } else if (creatureType === "skeleton") {
        slot.classList.add("creature-skeleton");
      } else {
        slot.classList.add("creature-zombie");
      }
    }
  });
}

// -------------------------------------------
// API calls
// -------------------------------------------
async function loadSummons() {
  try {
    summons = await apiGetSummons();
    renderGraveyard();
  } catch (err) {
    console.error(err);
  }
}

async function applySoulEnergy(id) {
  try {
    await apiUpdateSummon(id, { soulEnergy: 1 });
    await loadSummons();
  } catch (err) {
    console.error(err);
  }
}

async function applyArcaneDust(id) {
  try {
    await apiUpdateSummon(id, { arcaneStability: 1 });
    await loadSummons();
  } catch (err) {
    console.error(err);
  }
}
