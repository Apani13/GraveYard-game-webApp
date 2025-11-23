document.addEventListener("DOMContentLoaded", () => {
  if (!getToken()) {
    window.location.href = "login.html";
    return;
  }

  loadUsers();
});

async function loadUsers() {
  const tbody = document.getElementById("users-body");
  const errorEl = document.getElementById("admin-error");
  tbody.innerHTML = "";
  errorEl.textContent = "";

  try {
    const res = await fetchWithAuth("/admin/users");
    const users = await res.json();
    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${u.id}</td><td>${u.username}</td><td>${u.role}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    errorEl.textContent = "You need admin rights to see this panel.";
  }
}
