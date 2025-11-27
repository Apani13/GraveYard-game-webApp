// js/auth.js

document.addEventListener("DOMContentLoaded", () => {

  // --- LOGIN/REGISTER AMBIENCE ---
const loginMusic = document.getElementById("birds-1");
const loginAtmos = document.getElementById("birds-2");
const loginWind  = document.getElementById("wind-soft");
const loginWhisp = document.getElementById("whispers");


 if (loginMusic) loginMusic.volume = 0.35;
 if (loginAtmos) loginAtmos.volume = 0.25;
 if (loginWind)  loginWind.volume  = 0.20;
 if (loginWhisp) loginWhisp.volume = 0.12;


   // --- CLICK SFX for ENTER / AWAKEN ---
   const authClick = document.getElementById("sfx-auth-click");
   if (authClick) authClick.volume = 0.55; // un poco más suave que el máximo

  function playAuthClick() {
    playFullSound(authClick);
  }




function playLoginAmbience() {
  loginMusic?.play().catch(()=>{});
  loginAtmos?.play().catch(()=>{});
  loginWind?.play().catch(()=>{});
  loginWhisp?.play().catch(()=>{});
}


  // intento directo
  playLoginAmbience();

  // fallback autoplay (click required en Chrome)
  document.body.addEventListener("click", playLoginAmbience, { once: true });


  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    const errorEl = document.getElementById("login-error");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      playAuthClick();

      errorEl.classList.add("hidden");
      errorEl.textContent = "";
      const formData = new FormData(loginForm);
      const username = formData.get("username");
      const password = formData.get("password");

      try {
        const data = await apiLogin(username, password);
        setToken(data.token);
        setUsername(data.username);
        setUserRole(data.role);

        loginMusic?.pause();
        loginAtmos?.pause();
        loginWind?.pause();
        loginWhisp?.pause();

     setTimeout(() => {
       window.location.href = "game.html";
     }, 1200);

      } catch (err) {
          console.error(err);
          errorEl.textContent = "Login incorrecte. Revisa usuari/contrasenya.";
          errorEl.classList.remove("hidden");     // ★ NECESSARI
      }

    });
  }

  if (registerForm) {
    const errorEl = document.getElementById("register-error");
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      playAuthClick();

      errorEl.classList.add("hidden");
      errorEl.textContent = "";
      const formData = new FormData(registerForm);
      const username = formData.get("username");
      const password = formData.get("password");

      try {
        const data = await apiRegister(username, password);
        setToken(data.token);
        setUsername(data.username);
        setUserRole(data.role);

       loginMusic?.pause();
       loginAtmos?.pause();
       loginWind?.pause();
       loginWhisp?.pause();

     setTimeout(() => {
       window.location.href = "game.html";
     }, 1200);

      } catch (err) {
          console.error(err);
          errorEl.textContent = "No s'ha pogut registrar l'usuari.";
          errorEl.classList.remove("hidden");     // ★ NECESSARI
      }

    });
  }
});

function playFullSound(audioElement) {
    if (!audioElement) return;

    const clone = audioElement.cloneNode(true);
    clone.volume = audioElement.volume;
    clone.play().catch(err => console.error("Audio play error:", err));
}






