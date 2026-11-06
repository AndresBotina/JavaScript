// escena3d.js — Decoración del sitio: serpiente 3D y progreso del taller.
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
  const contenedor = document.getElementById("escena3d");
  if (!contenedor || !window.THREE) return;

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
  let medioAncho = MEDIO_ALTO;

  // Mini estudio de luces: solo sirve para que las escamas tengan reflejos.
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

  /* ---------- Cuerpo de la serpiente ---------- */
  const ANILLOS = 300;
  const LADOS = 24;
  const ANILLOS_CABEZA = 26;
  const POR_ANILLO = LADOS + 1;
  const GROSOR = esMenu ? 0.3 : 0.34;
  const LARGO_CABEZA = 0.85;

  const posiciones = new Float32Array(ANILLOS * POR_ANILLO * 3);
  const normales = new Float32Array(ANILLOS * POR_ANILLO * 3);
  const colores = new Float32Array(ANILLOS * POR_ANILLO * 3);
  const indices = [];

  const rojo = new THREE.Color(0xc0101f);
  const negro = new THREE.Color(0x12090a);
  const mezcla = new THREE.Color();

  // Rombos negros sobre el lomo, fijos a cada anillo del cuerpo.
  for (let i = 0; i < ANILLOS; i++) {
    for (let j = 0; j < POR_ANILLO; j++) {
      const angulo = (j / LADOS) * Math.PI * 2;
      const rombo = Math.abs(((i % 24) - 12) / 12) + Math.abs(Math.cos(angulo)) * 1.3;
      const sobreLomo = i > ANILLOS_CABEZA + 4 && Math.sin(angulo) > 0;
      const mancha = sobreLomo ? 1 - THREE.MathUtils.smoothstep(rombo, 0.7, 0.9) : 0;
      mezcla.copy(rojo).lerp(negro, mancha);
      colores.set([mezcla.r, mezcla.g, mezcla.b], (i * POR_ANILLO + j) * 3);
    }
  }

  for (let i = 0; i < ANILLOS - 1; i++) {
    for (let j = 0; j < LADOS; j++) {
      const a = i * POR_ANILLO + j;
      const b = a + POR_ANILLO;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute("position", new THREE.BufferAttribute(posiciones, 3));
  geometria.setAttribute("normal", new THREE.BufferAttribute(normales, 3));
  geometria.setAttribute("color", new THREE.BufferAttribute(colores, 3));
  geometria.setIndex(indices);

  const cuerpo = new THREE.Mesh(geometria, new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25
  }));
  cuerpo.frustumCulled = false;

  const grupo = new THREE.Group();
  grupo.add(cuerpo);
  escena.add(grupo);

  const materialOjo = new THREE.MeshPhysicalMaterial({ color: 0x050303, roughness: 0.08, clearcoat: 1 });
  const geometriaOjo = new THREE.SphereGeometry(0.075, 14, 10);
  const ojoA = new THREE.Mesh(geometriaOjo, materialOjo);
  const ojoB = new THREE.Mesh(geometriaOjo, materialOjo);
  grupo.add(ojoA, ojoB);

  // La serpiente mide más con cada ejercicio terminado.
  const largo = esMenu ? 7 + 7 * (completados / TOTAL) : 7;
  let escala = 1;

  // Ruta cerrada. Se recorre por distancia, así el cuerpo nunca se amontona.
  class Ruta extends THREE.Curve {
    constructor() {
      super();
      this.arcLengthDivisions = 900;
    }
    getPoint(u, destino) {
      const punto = destino || new THREE.Vector3();
      const a = u * Math.PI * 2;
      const profundidad = 0.6 * Math.sin(a + 1);
      // Un ocho acostado; en pantallas angostas se pone de pie.
      if (camara.aspect < 1) {
        return punto.set(medioAncho * 0.72 * Math.sin(2 * a), MEDIO_ALTO * 0.7 * Math.sin(a), profundidad);
      }
      const ancho = esMenu && camara.aspect > 1.2 ? 0.58 : 0.8;
      const centro = esMenu && camara.aspect > 1.2 ? 0.32 : 0;
      return punto.set(
        medioAncho * (centro + ancho * Math.sin(a)),
        MEDIO_ALTO * 0.56 * Math.sin(2 * a),
        profundidad
      );
    }
  }
  const ruta = new Ruta();
  let largoRuta = 1;

  function grosorEn(i) {
    if (i < ANILLOS_CABEZA) {
      const u = i / ANILLOS_CABEZA;
      const hocico = Math.sqrt(Math.min(1, u / 0.3));
      const cabeza = 1.2 - 0.38 * Math.max(0, (u - 0.45) / 0.55);
      return GROSOR * hocico * cabeza;
    }
    const u = (i - ANILLOS_CABEZA) / (ANILLOS - 1 - ANILLOS_CABEZA);
    const cuello = 0.82 + 0.18 * Math.min(1, u / 0.08);
    const cola = u > 0.62 ? Math.pow(1 - (u - 0.62) / 0.38, 0.8) : 1;
    return GROSOR * cuello * cola;
  }

  const punto = new THREE.Vector3();
  const adelante = new THREE.Vector3();
  const tangente = new THREE.Vector3();
  const lado = new THREE.Vector3();
  const arriba = new THREE.Vector3();
  const eje = new THREE.Vector3(0, 0, 1);

  function enRuta(distancia, destino) {
    const u = (((distancia / largoRuta) % 1) + 1) % 1;
    return ruta.getPointAt(u, destino);
  }

  function moverSerpiente(tiempo) {
    const largoCuerpo = largo * escala;
    const inicio = tiempo * 1.5;
    for (let i = 0; i < ANILLOS; i++) {
      const atraso = i < ANILLOS_CABEZA
        ? (i / ANILLOS_CABEZA) * LARGO_CABEZA * escala
        : LARGO_CABEZA * escala + ((i - ANILLOS_CABEZA) / (ANILLOS - ANILLOS_CABEZA)) * largoCuerpo;

      enRuta(inicio - atraso, punto);
      enRuta(inicio - atraso + 0.03, adelante);
      tangente.subVectors(adelante, punto).normalize();
      lado.crossVectors(eje, tangente).normalize();
      arriba.crossVectors(tangente, lado).normalize();

      // Ondulación lateral: nace detrás de la cabeza.
      const onda = Math.min(1, atraso / 1.6) * 0.2 * escala;
      punto.addScaledVector(lado, Math.sin(atraso * 2.6 - tiempo * 3.2) * onda);

      const radio = grosorEn(i) * escala;
      const plano = i < ANILLOS_CABEZA ? 0.72 : 1;
      const ancho = i < ANILLOS_CABEZA ? 1.15 : 1;

      for (let j = 0; j < POR_ANILLO; j++) {
        const angulo = (j / LADOS) * Math.PI * 2;
        const c = Math.cos(angulo);
        const s = Math.sin(angulo);
        const k = (i * POR_ANILLO + j) * 3;
        const nx = lado.x * c + arriba.x * s;
        const ny = lado.y * c + arriba.y * s;
        const nz = lado.z * c + arriba.z * s;
        posiciones[k] = punto.x + (lado.x * c * ancho + arriba.x * s * plano) * radio;
        posiciones[k + 1] = punto.y + (lado.y * c * ancho + arriba.y * s * plano) * radio;
        posiciones[k + 2] = punto.z + (lado.z * c * ancho + arriba.z * s * plano) * radio;
        normales[k] = nx;
        normales[k + 1] = ny;
        normales[k + 2] = nz;
      }

      if (i === 11) {
        ojoA.position.copy(punto).addScaledVector(lado, radio * 0.72).addScaledVector(arriba, radio * 0.5);
        ojoB.position.copy(punto).addScaledVector(lado, -radio * 0.72).addScaledVector(arriba, radio * 0.5);
      }
    }
    geometria.attributes.position.needsUpdate = true;
    geometria.attributes.normal.needsUpdate = true;
  }

  /* ---------- Animación ---------- */
  let tiempo = 8 + (parseInt(pagina, 10) || 0) * 5.3;
  let impulso = 0;
  let ratonX = 0;
  let ratonY = 0;
  let visible = true;
  let anterior = performance.now();

  function pintar() {
    moverSerpiente(tiempo);
    renderer.render(escena, camara);
  }

  function ajustarTamano() {
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;
    if (!ancho || !alto) return;
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    medioAncho = MEDIO_ALTO * camara.aspect;
    escala = Math.max(0.62, Math.min(1, camara.aspect / 1.2));
    ojoA.scale.setScalar(escala);
    ojoB.scale.setScalar(escala);
    ruta.updateArcLengths();
    largoRuta = ruta.getLength();
    if (sinMovimiento) pintar();
  }

  function animar(ahora) {
    requestAnimationFrame(animar);
    const paso = Math.min((ahora - anterior) / 1000, 0.05);
    anterior = ahora;
    if (!visible || document.hidden) return;
    impulso *= 0.97;
    tiempo += paso * 0.8 * (1 + impulso);
    grupo.rotation.y += (ratonX * 0.12 - grupo.rotation.y) * 0.04;
    grupo.rotation.x += (ratonY * 0.1 - grupo.rotation.x) * 0.04;
    pintar();
  }

  // Al enviar el formulario la serpiente se acelera un momento.
  alEnviar = function () {
    if (!sinMovimiento) impulso = 3;
  };

  window.addEventListener("pointermove", function (evento) {
    ratonX = evento.clientX / window.innerWidth - 0.5;
    ratonY = evento.clientY / window.innerHeight - 0.5;
  });

  new ResizeObserver(ajustarTamano).observe(contenedor);
  new IntersectionObserver(function (entradas) {
    visible = entradas[0].isIntersecting;
  }).observe(contenedor);

  ajustarTamano();
  if (sinMovimiento) {
    pintar();
  } else {
    requestAnimationFrame(animar);
  }
})();
