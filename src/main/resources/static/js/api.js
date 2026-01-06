// js/api.js

const API_BASE_URL = ""; // buit perquè fem servir el mateix origen (Spring Boot)

/** Obté el token JWT del localStorage */
function getToken() {
  return localStorage.getItem("jwtToken");
}

/** Desa el token */
function setToken(token) {
  localStorage.setItem("jwtToken", token);
}

/** Elimina token (logout) */
function clearToken() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");
}



function setUsername(username) {
  localStorage.setItem("username", username);
}

function getUsername() {
  return localStorage.getItem("username");
}




/** Helper per fer fetch amb Auth */
async function fetchWithAuth(path, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error("No hi ha token. L'usuari no està autenticat.");
  }

  const headers = options.headers || {};
  headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"] && options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  return response;
}

/** AUTH: login */
async function apiLogin(username, password) {
  const res = await fetch(API_BASE_URL + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    throw new Error("Error de login");
  }
  return res.json();
}

/** AUTH: register */
async function apiRegister(username, password) {
  const res = await fetch(API_BASE_URL + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    throw new Error("Error de registre");
  }
  return res.json();
}

/** GET /summons */
async function apiGetSummons() {
  const res = await fetchWithAuth("/summons", {
    method: "GET"
  });
  return res.json();
}

/** POST /summons */
async function apiCreateSummon(payload) {
  const res = await fetchWithAuth("/summons", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return res.json();
}

/** PUT /summons/{id} */
async function apiUpdateSummon(id, payload) {
  const res = await fetchWithAuth(`/summons/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return res.json();
}

/** DELETE /summons/{id} */
async function apiDeleteSummon(id) {
  await fetchWithAuth(`/summons/${id}`, {
    method: "DELETE"
  });
}


function setUserRole(role) {
  localStorage.setItem("role", role);
}

function getUserRole() {
  return localStorage.getItem("role");
}


/** GET /admin/users */
async function apiGetUsers() {
  const res = await fetchWithAuth("/admin/users", {
    method: "GET"
  });
  return res.json();
}


/** GET /users/me/stats */
async function apiGetMyStats() {
  const res = await fetchWithAuth("/users/me/stats", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("No s'han pogut carregar les estadístiques");
  }

  return res.json();
}

/** POST /users/me/stats */
async function apiIncrementMyStats(delta) {
  const res = await fetchWithAuth("/users/me/stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(delta),
  });

  if (!res.ok) {
    throw new Error("No s'han pogut actualitzar les estadístiques");
  }

  return res.json();
}
