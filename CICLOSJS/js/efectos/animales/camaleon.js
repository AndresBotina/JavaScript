// Capa visual decorativa, independiente de los ejercicios.
// camaleon.js — Ejercicio 1. Camina por su rama, explora con cada ojo por separado
// y caza el cursor con la lengua. La piel es un shader que cambia cara por cara.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, material, malla, bola, cono, tubo, caja, ojo, en, giro, molde } = util;

  // Colores del shader de piel.
  const PIEL_OSCURO = 0x4f0710;
  const PIEL_BASE = 0xb00f1d;
  const PIEL_CLARO = 0xf0485a;

  // Ritmo y fuerza del patrón de la piel.
  const PIEL_VELOCIDAD = 0.55;
  const PIEL_ACELERACION = 3.2;
  const PIEL_FRANJAS = 21;
  const PIEL_MANCHAS = 30;
  const PIEL_BRILLO = 0.32;
  const PIEL_FASE_QUIETA = 2.4;
  const RAFAGA_DURACION = 1;

  // Caminata.
  const VELOCIDAD = 0.42;
  const CAMINAR_MIN = 2.5;
  const CAMINAR_MAX = 5;
  const MECERSE_MIN = 2;
  const MECERSE_MAX = 4;
  const MECERSE_VELOCIDAD = 3.4;
  const MECERSE_AMPLITUD = 0.2;
  const GIRAR_DURACION = 3.4;
  const GIRAR_RAPIDO = 1.1;
  const ZANCADA = 0.34;
  const DURACION_PASO = 0.62;
  const DURACION_PASO_GIRO = 0.3;
  const ALTURA_PASO = 0.2;

  // Ojos.
  const OJO_RAPIDEZ = 15;
  const OJO_ESPERA_MIN = 0.7;
  const OJO_ESPERA_MAX = 2.6;
  const OJO_GIRO_MAX = 1.3;

  // Cola.
  const COLA_ESLABONES = 15;
  const COLA_LARGO = 0.2;
  const COLA_RAPIDEZ = 0.35;
  const COLA_CAMBIO_MIN = 5;
  const COLA_CAMBIO_MAX = 11;

  // Atención al cursor y lengua.
  const RADIO_ATENCION = 6.5;
  const TIEMPO_QUIETO = 0.6;
  const TIEMPO_PREPARAR = 1.1;
  const ENFRIAMIENTO = 2.5;
  const UMBRAL_QUIETO = 0.05;
  const ALCANCE_LENGUA = 11;
  const MARGEN_LENGUA = 0.85;
  const LENGUA_APERTURA = 0.1;
  const LENGUA_SALIDA = 0.1;
  const LENGUA_REBOTE = 0.2;
  const LENGUA_RETRAER = 0.24;
  const LENGUA_TRAMOS = 9;

  // Escena.
  const ESCALA = 1.35;
  const MARGEN_LADOS = 4.6;
  const CORRIMIENTO_ESCRITORIO = 0.8;
  const ALTO_ESCRITORIO = 260;
  const ALTURA_RAMA = -1.75;
  const RADIO_RAMA = 0.2;
  const ALTURA_CUERPO = 1.1;
  const VISTA = 0.38;

  // Los clics en estos elementos no despiertan al camaleón.
  const SIN_ATAQUE = "input, textarea, select, label";

  // Medidas de las patas.
  const MUSLO = 0.64;
  const TIBIA = 0.66;
  const PATAS = [
    { x: 0.72, y: -0.3, z: 0.25, lado: 1, turno: 0 },
    { x: 0.72, y: -0.3, z: -0.25, lado: -1, turno: 1 },
    { x: -0.92, y: -0.3, z: 0.24, lado: 1, turno: 1 },
    { x: -0.92, y: -0.3, z: -0.24, lado: -1, turno: 0 }
  ];

  // Perfiles: [x, y, ancho, alto]. El cuerpo es mucho más alto que ancho.
  const TORSO = [
    [-1.6, 0.14, 0.09, 0.14], [-1.32, 0.15, 0.2, 0.38], [-0.8, 0.2, 0.28, 0.6], [-0.15, 0.24, 0.31, 0.7],
    [0.45, 0.2, 0.28, 0.62], [0.9, 0.2, 0.21, 0.46], [1.2, 0.26, 0.14, 0.3]
  ];
  const CRANEO = [
    [-0.16, 0.02, 0.14, 0.24], [0.08, 0.03, 0.25, 0.36], [0.4, 0, 0.27, 0.35],
    [0.68, -0.06, 0.21, 0.25], [0.9, -0.1, 0.12, 0.15], [1, -0.12, 0.04, 0.05]
  ];
  const CASCO = [
    [0.56, 0.18, 0.17, 0.07], [0.26, 0.23, 0.21, 0.25], [-0.06, 0.29, 0.19, 0.38],
    [-0.32, 0.4, 0.11, 0.36], [-0.52, 0.6, 0.02, 0.05]
  ];
  const MANDIBULA = [[0, -0.02, 0.2, 0.08], [0.4, -0.04, 0.2, 0.09], [0.72, -0.02, 0.1, 0.06], [0.84, 0, 0.03, 0.02]];

  const ARRIBA = new THREE.Vector3(0, 1, 0);

  function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, valor));
  }

  function suavizar(x) {
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  function mezcla(rapidez, dt) {
    return 1 - Math.exp(-dt * rapidez);
  }

  function entre(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo);
  }

  // Agrega secciones intermedias suaves para tener más facetas, como escamas.
  function refinar(perfil, pasos) {
    const salida = [];
    for (let i = 0; i < perfil.length - 1; i++) {
      const p0 = perfil[Math.max(0, i - 1)];
      const p1 = perfil[i];
      const p2 = perfil[i + 1];
      const p3 = perfil[Math.min(perfil.length - 1, i + 2)];
      for (let paso = 0; paso < pasos; paso++) {
        const u = paso / pasos;
        salida.push(p1.map(function (_, k) {
          const a = 2 * p1[k];
          const b = (p2[k] - p0[k]) * u;
          const c = (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u;
          const d = (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * u * u * u;
          return Math.max(k >= 2 ? 0.01 : -9, 0.5 * (a + b + c + d));
        }));
      }
    }
    salida.push(perfil[perfil.length - 1]);
    return salida;
  }

  function ramaY(x) {
    return ALTURA_RAMA + Math.sin(x * 0.28 + 0.6) * 0.16 + Math.sin(x * 0.9 + 2) * 0.035;
  }

  function pendiente(x) {
    return Math.atan((ramaY(x + 0.1) - ramaY(x - 0.1)) / 0.2);
  }

  // Agrega el patrón a un material estándar sin tocar su iluminación ni su facetado.
  function crearPiel(uniformes) {
    const piel = material(0xffffff);
    piel.onBeforeCompile = function (shader) {
      Object.assign(shader.uniforms, uniformes);
      shader.vertexShader = "attribute vec4 aPiel;\nvarying vec4 vPiel;\n" +
        shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvPiel = aPiel;");

      shader.fragmentShader = `
        varying vec4 vPiel;
        uniform float uFase, uIntensidad, uRafaga, uRafagaFuerza, uFranjas, uManchas, uBrillo;
        uniform vec3 uOscuro, uBase, uClaro;
        vec3 colorPiel;
        float destello;
      ` + shader.fragmentShader
        .replace("#include <color_fragment>", `#include <color_fragment>
          float s = vPiel.x;
          float v = vPiel.y;
          float azar = vPiel.z;

          // Ondas que recorren el cuerpo de la cabeza a la cola.
          float onda = 0.5 + 0.5 * sin(s * 9.0 - uFase * 1.3 + sin(uFase * 0.21) * 1.5);

          // Franjas y manchas aparecen y se desvanecen por turnos.
          float verFranjas = smoothstep(0.25, 0.8, 0.5 + 0.5 * sin(uFase * 0.33));
          float verManchas = smoothstep(0.25, 0.8, 0.5 + 0.5 * sin(uFase * 0.21 + 2.2));
          float franjas = smoothstep(0.1, 0.65, sin(s * uFranjas + v * 2.4 - uFase * 0.8));
          float manchas = smoothstep(0.34, 0.72, sin(s * uManchas + azar * 3.0 + uFase * 0.5) * sin(v * 8.0 + azar * 6.3 - uFase * 0.3));

          colorPiel = mix(uBase, uClaro, onda * (0.14 + uIntensidad * 0.34));
          colorPiel = mix(colorPiel, uOscuro, franjas * verFranjas * (0.68 + uIntensidad * 0.3));
          colorPiel = mix(colorPiel, uClaro, manchas * verManchas * (0.5 + uIntensidad * 0.45));

          // La ráfaga es un frente de luz que viaja por todo el cuerpo.
          destello = exp(-pow((s - uRafaga) * 11.0, 2.0)) * uRafagaFuerza;
          colorPiel = mix(colorPiel, uClaro, destello * 0.8);

          // Cada cara tiene un tono propio, como una escama.
          colorPiel *= (0.8 + azar * 0.4) * (0.82 + v * 0.3) * vPiel.w;
          diffuseColor.rgb = colorPiel;
        `)
        .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
          totalEmissiveRadiance += colorPiel * (uIntensidad * uBrillo + destello * 0.45);
        `);
    };
    piel.customProgramCacheKey = function () { return "piel-camaleon"; };
    return piel;
  }

  class Camaleon extends Animal {
    constructor(ctx) {
      super(ctx);
      this.grupo.rotation.order = "YZX";
      this.grupo.scale.setScalar(ESCALA);

      this.t = 0;
      this.medioAncho = 8;
      this.medioAlto = 4.29;
      this.limite = 3;
      this.centro = 0;
      this.x = 0;
      this.vaiven = 0;
      this.direccion = 1;
      this.giroY = -VISTA;
      this.estado = "caminar";
      this.espera = entre(CAMINAR_MIN, CAMINAR_MAX);
      this.faseMecer = 0;
      this.duracionMecer = 1;
      this.tiempoMecer = 0;
      this.fasePaso = 0;
      this.giroDesde = 0;
      this.giroHasta = 0;
      this.giroDuracion = GIRAR_DURACION;
      this.tiempoGiro = 0;
      this.turno = 0;

      this.accion = null;
      this.tiempoAccion = 0;
      this.objetivo = new THREE.Vector3();
      this.pendienteDisparo = false;
      this.pendienteReaccion = false;
      this.enfriamiento = 0;
      this.tiempoQuieto = 0;
      this.cursorAnterior = new THREE.Vector2();
      this.lengua = 0;
      this.largoLengua = 0;
      this.apertura = 0;
      this.retroceso = 0;
      this.temblor = 0;

      this.intensidad = 0;
      this.tiempoRafaga = RAFAGA_DURACION;
      this.enrollado = 0.8;
      this.metaEnrollado = 0.8;
      this.cambioCola = entre(COLA_CAMBIO_MIN, COLA_CAMBIO_MAX);
      this.cuelloZ = 0;
      this.cuelloY = 0;

      this.cursor = { x: 0, y: 0, dentro: false, enEscena: false, mundo: new THREE.Vector3() };
      this.conMouse = !ctx.sinMovimiento && !window.matchMedia("(hover: none)").matches;
      this.modoOjos = "explorar";

      this.a = new THREE.Vector3();
      this.b = new THREE.Vector3();
      this.c = new THREE.Vector3();
      this.d = new THREE.Vector3();
      this.boca = new THREE.Vector3();

      this.uniformes = {
        uFase: { value: PIEL_FASE_QUIETA },
        uIntensidad: { value: 0 },
        uRafaga: { value: -1 },
        uRafagaFuerza: { value: 0 },
        uFranjas: { value: PIEL_FRANJAS },
        uManchas: { value: PIEL_MANCHAS },
        uBrillo: { value: PIEL_BRILLO },
        uOscuro: { value: new THREE.Color(PIEL_OSCURO) },
        uBase: { value: new THREE.Color(PIEL_BASE) },
        uClaro: { value: new THREE.Color(PIEL_CLARO) }
      };
      this.piel = crearPiel(this.uniformes);

      this.crearRama();
      this.cuerpo = giro(this.grupo, 0, 0, 0);
      this.crearTorso();
      this.crearCabeza();
      this.crearOjos();
      this.crearCola();
      this.crearPatas();
      this.crearLengua();

      if (this.conMouse) this.escucharMouse();
    }

    /* ---------- Modelo ---------- */

    // Cada cara guarda su lugar en el cuerpo: s va de la cabeza (0) a la cola (1).
    conPiel(objeto, sDesde, sHasta, tono) {
      const anterior = objeto.geometry;
      const geometria = anterior.index ? anterior.toNonIndexed() : anterior;
      geometria.computeVertexNormals();
      geometria.computeBoundingBox();
      const caja3 = geometria.boundingBox;
      const posicion = geometria.attributes.position;
      const datos = new Float32Array(posicion.count * 4);
      const anchoX = Math.max(caja3.max.x - caja3.min.x, 0.001);
      const altoY = Math.max(caja3.max.y - caja3.min.y, 0.001);

      for (let cara = 0; cara < posicion.count / 3; cara++) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < 3; i++) {
          x += posicion.getX(cara * 3 + i) / 3;
          y += posicion.getY(cara * 3 + i) / 3;
        }
        const avance = (x - caja3.min.x) / anchoX;
        const azar = Math.abs(Math.sin((cara + 1) * 12.9898 + sDesde * 78.233) * 43758.5453) % 1;
        for (let i = 0; i < 3; i++) {
          datos.set([sDesde + (sHasta - sDesde) * avance, (y - caja3.min.y) / altoY, azar, tono || 1], (cara * 3 + i) * 4);
        }
      }

      geometria.setAttribute("aPiel", new THREE.BufferAttribute(datos, 4));
      objeto.material.dispose();
      objeto.geometry = geometria;
      objeto.material = this.piel;
      return objeto;
    }

    crearRama() {
      const secciones = [];
      for (let i = 0; i <= 26; i++) {
        const x = -13 + i;
        const grosor = RADIO_RAMA + (i % 4 === 0 ? 0.03 : 0);
        secciones.push([x, ramaY(x), grosor, grosor]);
      }
      this.rama = molde(secciones, COLOR.gris, 7);
      this.ctx.escena.add(this.rama);
    }

    crearTorso() {
      this.conPiel(en(this.cuerpo, molde(refinar(TORSO, 4), COLOR.rojo, 18)), 0.58, 0.22);

      // Cresta de placas a lo largo del lomo.
      for (let i = 0; i < 11; i++) {
        const avance = i / 10;
        const x = -1.42 + avance * 2.5;
        const alto = 0.17 + Math.sin(avance * Math.PI) * 0.14;
        const y = 0.2 + Math.sin(avance * Math.PI) * 0.58 + 0.13;
        const placa = en(this.cuerpo, cono(0.14, alto * 2, COLOR.rojo, 4), x, y, 0);
        placa.scale.z = 0.32;
        placa.rotation.z = 0.25;
        this.conPiel(placa, 0.56 - avance * 0.32, 0.56 - avance * 0.32, 0.8);
      }
    }

    crearCabeza() {
      this.cuello = giro(this.cuerpo, 1.12, 0.28, 0);
      this.cabeza = giro(this.cuello, 0.14, 0.02, 0);
      this.conPiel(en(this.cabeza, molde(refinar(CRANEO, 3), COLOR.rojo, 14)), 0.2, 0.02);
      this.conPiel(en(this.cabeza, molde(refinar(CASCO, 3), COLOR.rojo, 10)), 0.17, 0.06, 1.08);

      this.mandibula = giro(this.cabeza, 0.1, -0.2, 0);
      this.conPiel(en(this.mandibula, molde(refinar(MANDIBULA, 2), COLOR.vino, 10)), 0.16, 0.04, 0.9);
      en(this.cabeza, caja(0.72, 0.016, 0.3, COLOR.negro), 0.56, -0.18, 0);
    }

    crearOjos() {
      this.ojos = [1, -1].map(function (lado) {
        const reposo = lado > 0 ? 0 : Math.PI;
        const torreta = giro(this.cabeza, 0.46, 0.12, 0.22 * lado);
        torreta.rotation.order = "YXZ";
        torreta.rotation.y = reposo;
        torreta.scale.setScalar(1.22);

        this.conPiel(en(torreta, bola(0.21, COLOR.rojo, [1, 1, 0.8])), 0.11, 0.1);
        const conoOjo = en(torreta, malla(new THREE.CylinderGeometry(0.095, 0.2, 0.22, 10), COLOR.rojo), 0, 0, 0.14);
        conoOjo.rotation.x = Math.PI / 2;
        this.conPiel(conoOjo, 0.09, 0.09, 1.1);
        en(torreta, bola(0.095, COLOR.crema, [1, 1, 0.45]), 0, 0, 0.25);
        const pupila = en(torreta, ojo(0.05), 0, 0, 0.27);
        pupila.scale.z = 0.7;

        return {
          torreta: torreta, lado: lado, reposo: reposo,
          giro: 0, alto: 0, metaGiro: 0, metaAlto: 0,
          espera: entre(OJO_ESPERA_MIN, OJO_ESPERA_MAX)
        };
      }, this);
    }

    crearCola() {
      const raiz = giro(this.cuerpo, -1.5, 0.14, 0);
      raiz.rotation.z = -Math.PI / 2;
      this.cola = [];
      let padre = raiz;
      for (let i = 0; i < COLA_ESLABONES; i++) {
        const eslabon = giro(padre, 0, i === 0 ? 0 : -COLA_LARGO, 0);
        const grosor = 0.13 - i * 0.0075;
        const pieza = tubo(grosor, grosor - 0.0075, COLA_LARGO + 0.04, COLOR.rojo, 7);
        pieza.geometry.translate(0, -COLA_LARGO / 2, 0);
        const s = 0.6 + (i / COLA_ESLABONES) * 0.4;
        en(eslabon, this.conPiel(pieza, s, s));
        this.cola.push(eslabon);
        padre = eslabon;
      }
    }

    crearPatas() {
      this.patas = PATAS.map(function (dato) {
        const s = dato.x > 0 ? 0.28 : 0.52;
        const pata = {
          cadera: new THREE.Vector3(dato.x, dato.y, dato.z),
          lado: dato.lado,
          turno: dato.turno,
          muslo: this.conPiel(tubo(0.13, 0.095, 1, COLOR.rojo, 7), s, s),
          tibia: this.conPiel(tubo(0.095, 0.07, 1, COLOR.rojo, 7), s + 0.03, s + 0.03),
          rodilla: this.conPiel(bola(0.11, COLOR.rojo), s + 0.01, s + 0.01),
          pinza: new THREE.Group(),
          dedos: [],
          pie: new THREE.Vector3(),
          desde: new THREE.Vector3(),
          hasta: new THREE.Vector3(),
          avance: 1,
          mundo: new THREE.Vector3()
        };

        // Dos dedos opuestos que abrazan la rama.
        this.conPiel(en(pata.pinza, bola(0.12, COLOR.rojo, [1.1, 0.7, 1])), s + 0.05, s + 0.05, 0.9);
        [-1, 1].forEach(function (cara) {
          const dedo = giro(pata.pinza, 0, 0, 0.05 * cara);
          const pieza = tubo(0.055, 0.03, 0.22, COLOR.vino, 5);
          pieza.geometry.translate(0, -0.11, 0);
          en(dedo, this.conPiel(pieza, s + 0.06, s + 0.06, 0.75));
          pata.dedos.push({ dedo: dedo, cara: cara });
        }, this);

        pata.rodilla.scale.setScalar(ESCALA);
        pata.pinza.scale.setScalar(ESCALA);
        this.ctx.escena.add(pata.muslo, pata.tibia, pata.rodilla, pata.pinza);
        return pata;
      }, this);
    }

    crearLengua() {
      this.tramos = [];
      const mat = material(COLOR.rosa);
      for (let i = 0; i < LENGUA_TRAMOS; i++) {
        const tramo = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 1, 6), mat);
        tramo.visible = false;
        this.ctx.escena.add(tramo);
        this.tramos.push(tramo);
      }
      this.punta = bola(0.15, COLOR.rosa);
      this.punta.visible = false;
      this.ctx.escena.add(this.punta);
    }

    /* ---------- Cursor ---------- */

    escucharMouse() {
      const cursor = this.cursor;
      window.addEventListener("pointermove", function (evento) {
        cursor.x = evento.clientX;
        cursor.y = evento.clientY;
        cursor.dentro = true;
      });
      document.documentElement.addEventListener("pointerleave", function () {
        cursor.dentro = false;
      });
      window.addEventListener("pointerdown", this.alHacerClic.bind(this));
    }

    // Pasa del punto en pantalla al plano de la escena.
    leerCursor() {
      const cursor = this.cursor;
      const zona = document.getElementById("escena3d").getBoundingClientRect();
      const u = (cursor.x - zona.left) / zona.width;
      const v = (cursor.y - zona.top) / zona.height;
      cursor.enEscena = cursor.dentro && u >= 0 && u <= 1 && v >= 0 && v <= 1;
      cursor.mundo.set((u * 2 - 1) * this.medioAncho, (1 - v * 2) * this.medioAlto, 0);
    }

    alHacerClic(evento) {
      if (evento.target.closest && evento.target.closest(SIN_ATAQUE)) return;
      this.cursor.x = evento.clientX;
      this.cursor.y = evento.clientY;
      this.cursor.dentro = true;
      this.leerCursor();
      if (this.cursor.enEscena && this.accion !== "disparar") this.apuntar(this.cursor.mundo);
    }

    /* ---------- Atención ---------- */

    actualizarAtencion(dt) {
      this.enfriamiento = Math.max(0, this.enfriamiento - dt);
      if (!this.conMouse) return;

      this.leerCursor();
      const cursor = this.cursor;
      if (this.accion === "disparar" || this.estado === "girar") return;

      if (!cursor.dentro) {
        this.modoOjos = "explorar";
        this.cancelarPreparar();
        return;
      }

      const movido = Math.hypot(cursor.mundo.x - this.cursorAnterior.x, cursor.mundo.y - this.cursorAnterior.y);
      this.cursorAnterior.set(cursor.mundo.x, cursor.mundo.y);
      this.tiempoQuieto = movido > UMBRAL_QUIETO ? 0 : this.tiempoQuieto + dt;

      const cerca = cursor.enEscena && cursor.mundo.distanceTo(this.boca) < RADIO_ATENCION;
      this.modoOjos = "seguir";

      if (cerca && this.tiempoQuieto >= TIEMPO_QUIETO && this.enfriamiento <= 0) {
        if (this.accion !== "preparar") {
          this.accion = "preparar";
          this.tiempoAccion = 0;
        }
        this.modoOjos = "fijar";
        this.objetivo.copy(cursor.mundo);
        this.tiempoAccion += dt;
        if (this.tiempoAccion >= TIEMPO_PREPARAR) this.apuntar(cursor.mundo);
      } else {
        this.cancelarPreparar();
      }
    }

    cancelarPreparar() {
      if (this.accion === "preparar") this.accion = null;
    }

    // Recorta el destino al alcance de la lengua y al encuadre.
    fijarDestino(punto) {
      const destino = this.objetivo.copy(punto);
      const margenX = this.medioAncho - MARGEN_LENGUA;
      const margenY = this.medioAlto - MARGEN_LENGUA;
      destino.x = limitar(destino.x, -margenX, margenX);
      destino.y = limitar(destino.y, -margenY, margenY);
      destino.z = this.boca.z;
      const largo = destino.distanceTo(this.boca);
      if (largo > ALCANCE_LENGUA) destino.lerpVectors(this.boca, destino, ALCANCE_LENGUA / largo);
    }

    // Si el destino queda detrás, primero se da la vuelta.
    apuntar(punto) {
      this.fijarDestino(punto);
      if ((this.objetivo.x - this.boca.x) * this.direccion < 0.2) {
        this.pendienteDisparo = true;
        this.accion = null;
        if (this.estado !== "girar") this.iniciarGiro(GIRAR_RAPIDO);
        return;
      }
      this.disparar();
    }

    disparar() {
      this.accion = "disparar";
      this.modoOjos = "fijar";
      this.tiempoAccion = 0;
      this.lengua = 0;
      this.largoLengua = this.objetivo.distanceTo(this.boca);
    }

    reaccionar() {
      super.reaccionar();
      this.tiempoRafaga = 0;
      if (this.accion === "disparar") {
        this.pendienteReaccion = true;
      } else {
        this.lenguetazo();
      }
    }

    // Lengüetazo al aire, hacia adelante y arriba.
    lenguetazo() {
      this.a.set(this.boca.x + this.direccion * 3.6, this.boca.y + 1.2, 0);
      this.fijarDestino(this.a);
      this.disparar();
    }

    actualizarLengua(dt) {
      if (this.accion !== "disparar") {
        this.lengua = 0;
        return;
      }
      this.tiempoAccion += dt;
      let tiempo = this.tiempoAccion - LENGUA_APERTURA;

      if (tiempo < 0) {
        this.lengua = 0;
      } else if (tiempo < LENGUA_SALIDA) {
        // Salida explosiva: casi todo el recorrido ocurre al principio.
        this.lengua = 1 - Math.pow(1 - tiempo / LENGUA_SALIDA, 4);
      } else if ((tiempo -= LENGUA_SALIDA) < LENGUA_REBOTE) {
        const avance = tiempo / LENGUA_REBOTE;
        // El rebote va siempre hacia adentro, para no pasarse del destino.
        this.lengua = 1 - Math.abs(Math.sin(avance * Math.PI * 2.5)) * 0.07 * (1 - avance);
      } else if ((tiempo -= LENGUA_REBOTE) < LENGUA_RETRAER) {
        const avance = tiempo / LENGUA_RETRAER;
        this.lengua = 1 - avance * avance;
      } else {
        this.lengua = 0;
        this.accion = null;
        this.enfriamiento = ENFRIAMIENTO;
        this.tiempoQuieto = 0;
        if (this.pendienteReaccion) {
          this.pendienteReaccion = false;
          this.lenguetazo();
        }
      }
    }

    /* ---------- Caminata ---------- */

    iniciarGiro(duracion) {
      this.estado = "girar";
      this.tiempoGiro = 0;
      this.giroDuracion = duracion;
      this.giroDesde = this.giroY;
      this.direccion = -this.direccion;
      const hasta = this.direccion > 0 ? -VISTA : Math.PI + VISTA;
      const diferencia = hasta - this.giroDesde;
      this.giroHasta = this.giroDesde + Math.atan2(Math.sin(diferencia), Math.cos(diferencia));
    }

    avanzarEstado(dt) {
      if (this.accion) return;

      if (this.estado === "caminar") {
        // Da pasos indecisos: acelera, duda y sigue.
        this.fasePaso += dt * 2.2;
        const ritmo = 0.3 + 0.7 * Math.max(0, Math.sin(this.fasePaso));
        this.x += this.direccion * VELOCIDAD * ritmo * dt;
        this.espera -= dt;

        const salida = (this.x - this.centro) * this.direccion > this.limite;
        if (salida) {
          this.iniciarGiro(GIRAR_DURACION);
        } else if (this.espera <= 0) {
          this.estado = "mecerse";
          this.tiempoMecer = 0;
          this.duracionMecer = entre(MECERSE_MIN, MECERSE_MAX);
        }
      } else if (this.estado === "mecerse") {
        // Atrás y adelante, como una hoja movida por el viento.
        this.tiempoMecer += dt;
        this.faseMecer += dt * MECERSE_VELOCIDAD;
        const avance = Math.min(1, this.tiempoMecer / this.duracionMecer);
        this.vaiven = Math.sin(this.faseMecer) * MECERSE_AMPLITUD * Math.sin(avance * Math.PI);
        if (avance >= 1) {
          this.vaiven = 0;
          this.estado = "caminar";
          this.espera = entre(CAMINAR_MIN, CAMINAR_MAX);
        }
      } else {
        this.tiempoGiro += dt;
        const avance = Math.min(1, this.tiempoGiro / this.giroDuracion);
        this.giroY = this.giroDesde + (this.giroHasta - this.giroDesde) * suavizar(avance);
        if (avance >= 1) {
          this.estado = "caminar";
          this.espera = entre(CAMINAR_MIN, CAMINAR_MAX);
          if (this.pendienteDisparo) {
            this.pendienteDisparo = false;
            this.fijarDestino(this.objetivo);
            this.disparar();
          }
        }
      }
    }

    colocarCuerpo(t) {
      const balance = Math.sin(t * 7) * 0.05 * this.temblor;
      const x = this.x + this.vaiven + balance;
      const respiro = Math.sin(t * 1.1) * 0.012;

      this.grupo.position.set(x, ramaY(x) + RADIO_RAMA + ALTURA_CUERPO * ESCALA + respiro, 0);
      const inclinar = pendiente(x) * this.direccion + this.vaiven * 0.24;
      this.grupo.rotation.set(balance * 0.6, this.giroY, inclinar);
      this.cuerpo.position.x = -this.retroceso;
      this.cuerpo.scale.z = 1 + Math.sin(t * 1.1) * 0.02;
    }

    /* ---------- Patas ---------- */

    casa(pata, destino) {
      destino.copy(pata.cadera);
      destino.x += 0.12;
      this.grupo.localToWorld(destino);
      destino.z = pata.lado * this.direccion * 0.1;
      destino.y = ramaY(destino.x) + RADIO_RAMA + 0.03;
      return destino;
    }

    plantarPatas() {
      this.patas.forEach(function (pata) {
        this.casa(pata, pata.pie);
        pata.avance = 1;
      }, this);
    }

    iniciarPaso(pata) {
      pata.desde.copy(pata.pie);
      this.casa(pata, pata.hasta);
      pata.hasta.x += this.direccion * ZANCADA * 0.5;
      pata.hasta.y = ramaY(pata.hasta.x) + RADIO_RAMA + 0.03;
      pata.avance = 0;
    }

    darPasos(dt) {
      const girando = this.estado === "girar";
      const paso = girando ? ZANCADA * 0.45 : ZANCADA;
      const duracion = girando ? DURACION_PASO_GIRO : DURACION_PASO;
      const quieto = this.accion || this.estado === "mecerse";
      const andando = this.patas.some(function (pata) { return pata.avance < 1; });

      if (!andando && !quieto) {
        // Mueve la pareja diagonal que más lejos quedó de su sitio.
        let mayor = 0;
        let turno = -1;
        this.patas.forEach(function (pata) {
          const lejos = this.casa(pata, this.a).distanceTo(pata.pie);
          if (lejos > mayor) {
            mayor = lejos;
            turno = pata.turno;
          }
        }, this);
        if (mayor > paso) {
          this.patas.forEach(function (pata) {
            if (pata.turno === turno) this.iniciarPaso(pata);
          }, this);
        }
      }

      // Si una pata se estira de más, da su paso sin esperar a la otra.
      const alcance = (MUSLO + TIBIA) * ESCALA * 0.96;
      this.patas.forEach(function (pata) {
        if (pata.avance >= 1 && pata.mundo.distanceTo(pata.pie) > alcance) this.iniciarPaso(pata);
      }, this);

      this.patas.forEach(function (pata) {
        if (pata.avance >= 1) return;
        pata.avance = Math.min(1, pata.avance + dt / duracion);
        const curva = suavizar(pata.avance);
        pata.pie.lerpVectors(pata.desde, pata.hasta, curva);
        pata.pie.y += Math.sin(pata.avance * Math.PI) * ALTURA_PASO;
      });
    }

    colocarHueso(hueso3d, desde, hasta) {
      const eje = this.c.subVectors(hasta, desde);
      const largo = eje.length();
      hueso3d.position.copy(desde).addScaledVector(eje, 0.5);
      hueso3d.scale.set(ESCALA, largo, ESCALA);
      hueso3d.quaternion.setFromUnitVectors(ARRIBA, eje.normalize());
    }

    // Cinemática inversa: la rodilla sale hacia afuera, como en un reptil.
    dibujarPata(pata) {
      const cadera = pata.mundo.copy(pata.cadera);
      this.grupo.localToWorld(cadera);

      const hacia = this.a.subVectors(pata.pie, cadera);
      const muslo = MUSLO * ESCALA;
      const tibia = TIBIA * ESCALA;
      const distancia = Math.min(hacia.length(), muslo + tibia - 0.01);
      hacia.normalize();
      const base = (muslo * muslo - tibia * tibia + distancia * distancia) / (2 * distancia);
      const alto = Math.sqrt(Math.max(0, muslo * muslo - base * base));

      // Hacia afuera y un poco arriba, sin importar para dónde mire el cuerpo.
      const afuera = this.b.set(0, 0.55, pata.lado * this.direccion);
      afuera.addScaledVector(hacia, -afuera.dot(hacia)).normalize();

      const rodilla = pata.rodilla.position;
      rodilla.copy(cadera).addScaledVector(hacia, base).addScaledVector(afuera, alto);
      this.colocarHueso(pata.muslo, cadera, rodilla);
      this.colocarHueso(pata.tibia, rodilla, pata.pie);

      pata.pinza.position.copy(pata.pie);
      pata.pinza.rotation.z = pendiente(pata.pie.x);
      const abierta = pata.avance < 1 ? Math.sin(pata.avance * Math.PI) * 0.8 : 0;
      pata.dedos.forEach(function (item) {
        item.dedo.rotation.x = item.cara * (0.42 + abierta);
      });
    }

    /* ---------- Ojos ---------- */

    mirarPunto(item, punto) {
      const dir = this.a.copy(punto);
      this.cabeza.worldToLocal(dir);
      dir.sub(item.torreta.position);
      const absoluto = Math.atan2(dir.x, dir.z);
      const diferencia = absoluto - item.reposo;
      item.metaGiro = limitar(Math.atan2(Math.sin(diferencia), Math.cos(diferencia)), -OJO_GIRO_MAX, OJO_GIRO_MAX);
      item.metaAlto = limitar(-Math.atan2(dir.y, Math.hypot(dir.x, dir.z)), -0.9, 0.9);
    }

    actualizarOjos(dt) {
      // Sigue con el ojo que queda hacia la cámara.
      const guia = this.direccion > 0 ? 0 : 1;
      const hayPunto = this.modoOjos !== "explorar";
      const punto = this.modoOjos === "seguir" ? this.cursor.mundo : this.objetivo;

      this.ojos.forEach(function (item, i) {
        const sigue = hayPunto && (this.modoOjos === "fijar" || i === guia);
        if (sigue) {
          this.mirarPunto(item, punto);
        } else {
          item.espera -= dt;
          if (item.espera <= 0) {
            item.espera = entre(OJO_ESPERA_MIN, OJO_ESPERA_MAX);
            item.metaGiro = entre(-1.1, 1.1);
            item.metaAlto = entre(-0.55, 0.4);
          }
        }
        const rapidez = mezcla(OJO_RAPIDEZ, dt);
        item.giro += (item.metaGiro - item.giro) * rapidez;
        item.alto += (item.metaAlto - item.alto) * rapidez;
      }, this);
    }

    dibujarOjos() {
      this.ojos.forEach(function (item) {
        item.torreta.rotation.y = item.reposo + item.giro;
        item.torreta.rotation.x = item.alto;
      });
    }

    /* ---------- Cabeza, cola y lengua ---------- */

    actualizarCabeza(dt) {
      let metaZ = Math.sin(this.t * 0.5) * 0.05;
      let metaY = 0;
      if (this.accion) {
        const dir = this.a.copy(this.objetivo);
        this.cuerpo.worldToLocal(dir);
        dir.sub(this.cuello.position);
        metaZ = limitar(Math.atan2(dir.y, dir.x), -0.6, 0.6);
        metaY = limitar(-Math.atan2(dir.z, dir.x), -0.4, 0.4);
      }
      const rapidez = mezcla(this.accion === "disparar" ? 22 : 5, dt);
      this.cuelloZ += (metaZ - this.cuelloZ) * rapidez;
      this.cuelloY += (metaY - this.cuelloY) * rapidez;

      const abierta = this.accion === "disparar" && this.lengua < 0.98 ? 1 : (this.lengua > 0.02 ? 0.7 : 0);
      this.apertura += (abierta - this.apertura) * mezcla(26, dt);
      const preparando = this.accion === "preparar" ? 1 : 0;
      this.temblor += (preparando - this.temblor) * mezcla(5, dt);
      const empuje = this.accion === "disparar" ? this.lengua * 0.08 : 0;
      this.retroceso += (empuje - this.retroceso) * mezcla(18, dt);
    }

    actualizarCola(dt) {
      this.cambioCola -= dt;
      if (this.cambioCola <= 0) {
        this.cambioCola = entre(COLA_CAMBIO_MIN, COLA_CAMBIO_MAX);
        this.metaEnrollado = entre(0.5, 1);
      }
      this.enrollado += (this.metaEnrollado - this.enrollado) * mezcla(COLA_RAPIDEZ, dt);
    }

    dibujarCola(t) {
      this.cola.forEach(function (eslabon, i) {
        const avance = i / (COLA_ESLABONES - 1);
        const curva = this.enrollado * (0.2 + avance * avance * 1.05);
        eslabon.rotation.z = curva + Math.sin(t * 0.8 - i * 0.4) * 0.02;
      }, this);
    }

    dibujarCabeza() {
      this.cuello.rotation.z = this.cuelloZ;
      this.cuello.rotation.y = this.cuelloY;
      this.mandibula.rotation.z = -this.apertura * 0.5;
      this.boca.set(0.86, -0.2, 0);
      this.cabeza.localToWorld(this.boca);
    }

    dibujarLengua() {
      const visible = this.lengua > 0.001;
      this.punta.visible = visible;
      this.tramos.forEach(function (tramo) { tramo.visible = visible; });
      if (!visible) return;

      const largo = this.largoLengua * this.lengua;
      const dir = this.a.subVectors(this.objetivo, this.boca).normalize();
      const lado = this.b.set(-dir.y, dir.x, 0);
      const quiebre = (1 - Math.min(1, this.lengua)) * 0.3;
      let anterior = this.d.copy(this.boca);
      const inicio = anterior.clone();

      for (let i = 1; i <= LENGUA_TRAMOS; i++) {
        const u = i / LENGUA_TRAMOS;
        const punto = inicio.clone().addScaledVector(dir, largo * u);
        punto.addScaledVector(lado, Math.sin(u * Math.PI) * quiebre);
        this.colocarHueso(this.tramos[i - 1], anterior, punto);
        anterior = punto;
      }
      this.punta.position.copy(anterior);
    }

    /* ---------- Piel ---------- */

    actualizarPiel(dt) {
      let meta = 0;
      if (this.modoOjos === "seguir") meta = 0.2;
      if (this.accion) meta = 1;
      this.intensidad += (meta - this.intensidad) * mezcla(3.5, dt);

      const u = this.uniformes;
      u.uIntensidad.value = this.intensidad;
      u.uFase.value += dt * PIEL_VELOCIDAD * (1 + this.intensidad * PIEL_ACELERACION);

      this.tiempoRafaga = Math.min(RAFAGA_DURACION, this.tiempoRafaga + dt);
      const avance = this.tiempoRafaga / RAFAGA_DURACION;
      u.uRafaga.value = avance * 1.3 - 0.15;
      u.uRafagaFuerza.value = avance < 1 ? 1 : 0;
    }

    /* ---------- Medidas y cuadro ---------- */

    ajustar(medidas) {
      this.medioAncho = medidas.medioAncho;
      this.medioAlto = medidas.medioAlto;
      this.centro = medidas.alto >= ALTO_ESCRITORIO ? CORRIMIENTO_ESCRITORIO : 0;
      this.limite = Math.max(0.6, medidas.medioAncho - MARGEN_LADOS);

      this.x = limitar(this.x, this.centro - this.limite, this.centro + this.limite);
      this.vaiven = 0;
      this.accion = null;
      this.pendienteDisparo = false;
      this.colocarCuerpo(this.t);
      this.grupo.updateMatrixWorld(true);
      this.plantarPatas();
    }

    actualizar(t, dt) {
      this.t = t;
      if (dt > 0) {
        this.actualizarAtencion(dt);
        this.avanzarEstado(dt);
        this.actualizarLengua(dt);
        this.actualizarPiel(dt);
        this.actualizarCola(dt);
        this.actualizarCabeza(dt);
      }

      this.colocarCuerpo(t);
      this.dibujarCabeza();
      this.dibujarCola(t);
      this.grupo.updateMatrixWorld(true);
      this.dibujarCabeza();

      if (dt > 0) {
        this.darPasos(dt);
        this.actualizarOjos(dt);
      }
      this.dibujarOjos();
      this.patas.forEach(this.dibujarPata, this);
      this.dibujarLengua();
    }
  }

  window.Animales.Camaleon = Camaleon;
})();
