// js/admin.js — Admin Dashboard Logic

document.addEventListener("DOMContentLoaded", async () => {
    checkAdminAccess();

    // --- ADMIN AUDIO ---
    const adminMusic = document.getElementById("birds-1");
    const adminAtmos = document.getElementById("birds-2");
    const adminWind  = document.getElementById("wind-soft");
    const adminWhisp = document.getElementById("whispers");

    if (adminMusic) adminMusic.volume = 0.35;
    if (adminAtmos) adminAtmos.volume = 0.25;
    if (adminWind)  adminWind.volume  = 0.20;
    if (adminWhisp) adminWhisp.volume = 0.12;

    // función para reproducir el ambiente del admin
    function playAdminAmbience() {
        adminMusic?.play().catch(()=>{});
        adminAtmos?.play().catch(()=>{});
        adminWind?.play().catch(()=>{});
        adminWhisp?.play().catch(()=>{});
    }

    // 🔊 activar ambiente en el PRIMER click
    document.body.addEventListener("click", function handler() {
        playAdminAmbience();
        document.body.removeEventListener("click", handler);
    }, { once: true });

    // Back button
    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "game.html";
    });

    await loadUsers();
});


// ----------------------------
//   ACCESS CONTROL
// ----------------------------
function checkAdminAccess() {
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
        alert("No tens permisos per entrar aquí!");
        window.location.href = "game.html";
        throw new Error("Access denied");
    }
}


// ----------------------------
//   LOAD USERS
// ----------------------------
async function loadUsers() {
    const container = document.getElementById("admin-users-container");
    const errorEl = document.getElementById("admin-error");

    try {
        const users = await apiGetUsers();   // defined in api.js

        container.innerHTML = "";

        users.forEach(u => {
            const card = document.createElement("div");
            card.className = "admin-user-card";

            card.innerHTML = `
                <h3 class="admin-user-name">${u.username}</h3>

                <p class="admin-user-role">
                    <strong>Role:</strong> ${u.role}
                </p>

                 <p><strong>Ghosts collected:</strong> ${u.ghostsCollected ?? 0}</p>
                 <p><strong>Zombies collected:</strong> ${u.zombiesCollected ?? 0}</p>
                 <p><strong>Skeletons collected:</strong> ${u.skeletonsCollected ?? 0}</p>

                <p><strong>ID:</strong> ${u.id}</p>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        errorEl.textContent = "Error carregant usuaris.";
    }
}
