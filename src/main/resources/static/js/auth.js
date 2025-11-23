// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    const errorEl = document.getElementById("login-error");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      const formData = new FormData(loginForm);
      const username = formData.get("username");
      const password = formData.get("password");

      try {
        const data = await apiLogin(username, password);
        setToken(data.token);
        window.location.href = "game.html";
      } catch (err) {
        console.error(err);
        errorEl.textContent = "Login incorrecte. Revisa usuari/contrasenya.";
      }
    });
  }

  if (registerForm) {
    const errorEl = document.getElementById("register-error");
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      const formData = new FormData(registerForm);
      const username = formData.get("username");
      const password = formData.get("password");

      try {
        const data = await apiRegister(username, password);
        setToken(data.token);
        window.location.href = "game.html";
      } catch (err) {
        console.error(err);
        errorEl.textContent = "No s'ha pogut registrar l'usuari.";
      }
    });
  }
});
