
const WEB3FORMS_ACCESS_KEY = "TU_ACCESS_KEY_AQUI";

(function () {
  const boton = document.getElementById("btnSubir");
  if (!boton) return;

  function actualizar() {
    boton.classList.toggle("visible", window.scrollY > 300);
  }
  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();

  boton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

document.querySelectorAll("form[data-web3forms]").forEach(function (form) {
  const estado = form.querySelector(".form-estado");
  const boton = form.querySelector("button[type='submit']");

  function mostrar(tipo, texto) {
    if (!estado) return;
    estado.className = "form-estado small mt-2 alert alert-" + tipo + " py-2 mb-0";
    estado.textContent = texto;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (WEB3FORMS_ACCESS_KEY === "TU_ACCESS_KEY_AQUI") {
      mostrar("warning", "Falta configurar la Access Key de Web3Forms en js/app.js.");
      return;
    }

    const datos = new FormData(form);
    datos.append("access_key", WEB3FORMS_ACCESS_KEY);
    datos.append("subject", form.dataset.asunto || "Nuevo mensaje desde la web de MobiFix");
    datos.append("from_name", "Web MobiFix");

    const textoOriginal = boton ? boton.innerHTML : "";
    if (boton) { boton.disabled = true; boton.textContent = "Enviando..."; }

    try {
      const respuesta = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: datos
      });
      const resultado = await respuesta.json();

      if (resultado.success) {
        mostrar("success", form.dataset.exito || "¡Enviado correctamente! Gracias.");
        form.reset();
      } else {
        mostrar("danger", "No se pudo enviar: " + (resultado.message || "inténtalo de nuevo."));
      }
    } catch (error) {
      mostrar("danger", "Error de conexión. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      if (boton) { boton.disabled = false; boton.innerHTML = textoOriginal; }
    }
  });
});
