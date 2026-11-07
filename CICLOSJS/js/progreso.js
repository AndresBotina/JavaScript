// progreso.js — Funcionalidad del sitio: guarda los ejercicios terminados, pinta el
// avance en el menú y resalta los resultados nuevos. No depende de la capa 3D.
// Todo va dentro de una función para que sus variables no choquen con las de
// ejercicio1.js, ejercicio2.js, etc.
(function () {
  const CLAVE = "ciclos-cerrados";
  const TOTAL = 9;
  const pagina = document.body.dataset.ejercicio || "menu";
  const esMenu = pagina === "menu";

  /* ---------- Progreso guardado en el navegador ---------- */
  function leerCerrados() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE)) || [];
    } catch (error) {
      return [];
    }
  }

  function cerrarCiclo(id) {
    const cerrados = leerCerrados();
    if (cerrados.indexOf(id) !== -1) return;
    cerrados.push(id);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(cerrados));
    } catch (error) {
      // Sin almacenamiento la página sigue funcionando, solo no recuerda.
    }
  }

  function pintarMenu() {
    const cerrados = leerCerrados();
    let cuenta = 0;
    document.querySelectorAll("[data-ciclo]").forEach(function (enlace) {
      if (cerrados.indexOf(enlace.dataset.ciclo) !== -1) {
        enlace.classList.add("hecho");
        enlace.querySelector(".estado").textContent = "Listo";
        cuenta++;
      }
    });
    document.getElementById("progresoNumero").textContent = cuenta + "/" + TOTAL;
    document.getElementById("progresoBarra").style.width = (cuenta / TOTAL) * 100 + "%";
    return cuenta;
  }

  const completados = esMenu ? pintarMenu() : 0;

  /* ---------- Resultados del formulario ---------- */
  let esperandoResultado = false;

  document.addEventListener("submit", function () {
    esperandoResultado = true;
  }, true);

  // Observa #resultado sin tocar el código del ejercicio.
  const resultado = document.getElementById("resultado");
  if (resultado) {
    const anteriores = new Map();
    const valores = resultado.querySelectorAll("strong");
    valores.forEach(function (valor) { anteriores.set(valor, valor.textContent); });

    new MutationObserver(function () {
      let hayDatos = false;
      valores.forEach(function (valor) {
        if (valor.textContent !== "—") hayDatos = true;
        if (valor.textContent !== anteriores.get(valor)) {
          anteriores.set(valor, valor.textContent);
          valor.classList.remove("recien");
          void valor.offsetWidth;
          valor.classList.add("recien");
        }
      });
      if (esperandoResultado && hayDatos) {
        cerrarCiclo(pagina);
        esperandoResultado = false;
      }
    }).observe(resultado, { childList: true, subtree: true, characterData: true });
  }

  // La serpiente del menú usa estos datos para crecer.
  window.Progreso = { completados: completados, total: TOTAL };
})();
