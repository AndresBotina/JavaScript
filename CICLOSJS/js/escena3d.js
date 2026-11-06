// escena3d.js — Decoración del sitio: progreso del taller y escena 3D del animal de cada página.
// No hace parte de los ejercicios. Todo va dentro de una función para que
// sus variables no choquen con las de ejercicio1.js, ejercicio2.js, etc.
(function () {
  const CLAVE = "ciclos-cerrados";
  const TOTAL = 9;
  const pagina = document.body.dataset.ejercicio || "menu";
  const esMenu = pagina === "menu";
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---------- Reacción al enviar un formulario ---------- */
  let esperandoResultado = false;
  let alEnviar = function () {};

  document.addEventListener("submit", function () {
    esperandoResultado = true;
    alEnviar();
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

  /* ---------- Escena Three.js ---------- */
  // El animal de cada página se elige con data-animal en el HTML.
  const contenedor = document.getElementById("escena3d");
  if (!contenedor || !window.THREE || !window.Animales) return;
  const ClaseAnimal = window.Animales[contenedor.dataset.animal];
  if (!ClaseAnimal) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (error) {
    contenedor.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  contenedor.appendChild(renderer.domElement);

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camara.position.z = 16;
  const MEDIO_ALTO = Math.tan((15 * Math.PI) / 180) * 16;

  // Mini estudio de luces: solo sirve para que los animales tengan reflejos.
  function crearReflejos() {
    const estudio = new THREE.Scene();
    estudio.background = new THREE.Color(0x120406);
    function panel(color, fuerza, ancho, alto, x, y, z) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(fuerza),
        side: THREE.DoubleSide
      });
      const malla = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), material);
      malla.position.set(x, y, z);
      malla.lookAt(0, 0, 0);
      estudio.add(malla);
    }
    panel(0xffffff, 3.5, 8, 3, 0, 6, 5);
    panel(0xff6a5a, 4, 2, 9, -7, 0, 3);
    panel(0xff3b30, 3, 3, 8, 7, -1, 2);
    const generador = new THREE.PMREMGenerator(renderer);
    const textura = generador.fromScene(estudio, 0.02).texture;
    generador.dispose();
    return textura;
  }
  escena.environment = crearReflejos();

  const luz = new THREE.DirectionalLight(0xffffff, 1.6);
  luz.position.set(-3, 5, 8);
  escena.add(luz);

  const raton = { x: 0, y: 0 };
  const animal = new ClaseAnimal({
    escena: escena,
    raton: raton,
    sinMovimiento: sinMovimiento,
    completados: completados,
    total: TOTAL
  });

  /* ---------- Animación ---------- */
  let tiempo = 0;
  let visible = true;
  let anterior = performance.now();

  function pintar(paso) {
    animal.actualizar(tiempo, paso);
    renderer.render(escena, animal.camara || camara);
  }

  function ajustarTamano() {
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;
    if (!ancho || !alto) return;
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    animal.ajustar({
      ancho: ancho,
      alto: alto,
      aspecto: camara.aspect,
      medioAlto: MEDIO_ALTO,
      medioAncho: MEDIO_ALTO * camara.aspect
    });
    if (sinMovimiento) pintar(0);
  }

  function animar(ahora) {
    requestAnimationFrame(animar);
    const paso = Math.min((ahora - anterior) / 1000, 0.05);
    anterior = ahora;
    if (!visible || document.hidden) return;
    tiempo += paso;
    animal.energia *= Math.pow(0.25, paso);
    pintar(paso);
  }

  // Al enviar el formulario cada animal reacciona a su manera.
  alEnviar = function () {
    if (!sinMovimiento) animal.reaccionar();
  };

  window.addEventListener("pointermove", function (evento) {
    raton.x = evento.clientX / window.innerWidth - 0.5;
    raton.y = evento.clientY / window.innerHeight - 0.5;
  });

  new ResizeObserver(ajustarTamano).observe(contenedor);
  new IntersectionObserver(function (entradas) {
    visible = entradas[0].isIntersecting;
  }).observe(contenedor);

  ajustarTamano();
  if (!sinMovimiento) requestAnimationFrame(animar);
})();
