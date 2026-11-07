// Capa visual decorativa, independiente de los ejercicios.
// buho.js — Ejercicio 2. El profesor: mira a los lados y parpadea sobre su rama.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, material, malla, bola, cono, hueso, tubo, ojo, en, giro, molde } = util;

  // Silueta del cuerpo: [altura, ancho, fondo].
  const SILUETA = [
    [0.2, 0.5, 0.42],
    [0.7, 1.12, 0.92],
    [1.4, 1.42, 1.14],
    [2.1, 1.38, 1.1],
    [2.8, 1.12, 0.92],
    [3.3, 0.95, 0.8]
  ];

  // Medidas de la cabeza (radios de un óvalo).
  const CABEZA = [1.42, 1.16, 1.0];

  // Párpado: ángulo abierto y ángulo cerrado.
  const PARPADO_ABIERTO = -0.72;
  const PARPADO_CERRADO = 1.25;

  // Ancho y fondo del cuerpo a cierta altura.
  function radiosEn(altura) {
    for (let i = 0; i < SILUETA.length - 1; i++) {
      const a = SILUETA[i];
      const b = SILUETA[i + 1];
      if (altura <= b[0]) {
        const f = Math.max(0, (altura - a[0]) / (b[0] - a[0]));
        return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
      }
    }
    const ultimo = SILUETA[SILUETA.length - 1];
    return [ultimo[1], ultimo[2]];
  }

  // Pluma con nervio central: nace en el origen, la punta va hacia -Y y es más oscura.
  function crearGeometriaPluma() {
    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute("position", new THREE.Float32BufferAttribute([
      0, 0, 0,
      -0.5, -0.32, 0,
      0.5, -0.32, 0,
      0, -0.42, 0.1,
      -0.36, -0.78, 0,
      0.36, -0.78, 0,
      0, -1, 0
    ], 3));
    geometria.setAttribute("color", new THREE.Float32BufferAttribute([
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
      0.8, 0.8, 0.8,
      0.8, 0.8, 0.8,
      0.5, 0.5, 0.5
    ], 3));
    geometria.setIndex([0, 1, 3, 0, 3, 2, 1, 4, 3, 3, 5, 2, 3, 4, 6, 3, 6, 5]);
    geometria.computeVertexNormals();
    return geometria;
  }

  class Buho extends Animal {
    constructor(ctx) {
      super(ctx);
      this.geometriaPluma = crearGeometriaPluma();
      this.materiales = {};

      this.crearRama();
      this.grupo.position.y = -2.4;
      this.grupo.scale.setScalar(0.92);
      this.cuerpo = giro(this.grupo, 0, 0, 0);

      this.crearCuerpo();
      this.crearCola();
      this.crearPatas();
      this.crearAlas();
      this.crearCabeza();
      this.crearCara();
    }

    // Todas las plumas de un color comparten el mismo material.
    pluma(padre, color, ancho, largo, x, y, z) {
      if (!this.materiales[color]) {
        this.materiales[color] = material(color, { vertexColors: true, side: THREE.DoubleSide });
      }
      const objeto = new THREE.Mesh(this.geometriaPluma, this.materiales[color]);
      objeto.scale.set(ancho, largo, ancho);
      objeto.rotation.order = "YXZ";
      return en(padre, objeto, x, y, z);
    }

    crearRama() {
      const seccion = [];
      for (let i = 0; i <= 10; i++) {
        const x = -4.4 + i * 0.88;
        const punta = Math.min(1, (5 - Math.abs(i - 5)) / 2);
        const grosor = 0.11 + punta * 0.09 + (i % 3 === 0 ? 0.025 : 0);
        seccion.push([x, Math.sin(i * 1.3) * 0.05, grosor, grosor]);
      }
      this.rama = molde(seccion, COLOR.gris, 7);
      this.rama.position.y = -2.55;
      this.ctx.escena.add(this.rama);
    }

    crearCuerpo() {
      // Una sola forma de pera desde la cola hasta el cuello.
      const secciones = SILUETA.map(function (s) { return [s[0], 0, s[2], s[1]]; });
      const forma = en(this.cuerpo, molde(secciones, COLOR.vino, 12));
      forma.rotation.z = Math.PI / 2;

      // Plumas del pecho en filas alternadas, como tejas.
      for (let fila = 0; fila < 12; fila++) {
        const altura = 2.62 - fila * 0.2;
        const radios = radiosEn(altura);
        const debajo = radiosEn(altura - 0.2);
        const inclinacion = Math.atan2(radios[1] - debajo[1], 0.2);
        const inicio = fila % 2 ? -1.57 : -1.7;

        for (let angulo = inicio; angulo <= 1.72; angulo += 0.27) {
          const color = Math.abs(angulo) < 0.85 ? COLOR.rosa : COLOR.rojo;
          const objeto = this.pluma(
            this.cuerpo, color, 0.31, 0.5,
            Math.sin(angulo) * radios[0],
            altura,
            Math.cos(angulo) * radios[1]
          );
          objeto.rotation.y = angulo;
          objeto.rotation.x = inclinacion - 0.14;
        }
      }
    }

    crearCola() {
      for (let i = -2; i <= 2; i++) {
        const objeto = this.pluma(this.cuerpo, COLOR.vino, 0.42, 2, i * 0.17, 0.75, -0.72);
        objeto.rotation.z = i * 0.09;
        objeto.rotation.x = 0.12;
      }
    }

    crearPatas() {
      [-1, 1].forEach(function (lado) {
        const pie = giro(this.grupo, 0.48 * lado, 0.2, 0.2);
        en(pie, bola(0.24, COLOR.rosa, [1.1, 0.8, 1]), 0, 0.08, 0);

        [-1, 0, 1].forEach(function (dedo) {
          const pivote = giro(pie, dedo * 0.15, 0, 0.08);
          pivote.rotation.x = -1.05;
          pivote.rotation.z = -dedo * 0.2;
          en(pivote, hueso(0.075, 0.06, 0.34, COLOR.crema));
          const garra = en(pivote, cono(0.055, 0.2, COLOR.negro, 5), 0, -0.4, 0);
          garra.rotation.x = Math.PI + 0.5;
        });
      }, this);
    }

    crearAlas() {
      this.alas = [-1, 1].map(function (lado) {
        const ala = giro(this.cuerpo, 1.27 * lado, 2.62, 0.05);
        const plumas = [];
        en(ala, bola(0.55, COLOR.vino, [0.42, 1.7, 1.05]), 0.1 * lado, -0.85, -0.05);

        // Tres capas: largas abajo y cortas encima, abiertas hacia atrás.
        const capas = [
          { color: COLOR.vino, cantidad: 6, ancho: 0.42, largo: 2.15, afuera: 0.2, abre: 0.09 },
          { color: COLOR.rojo, cantidad: 5, ancho: 0.42, largo: 1.45, afuera: 0.27, abre: 0.13 },
          { color: COLOR.rosa, cantidad: 4, ancho: 0.38, largo: 0.8, afuera: 0.33, abre: 0.2 }
        ];
        capas.forEach(function (capa) {
          for (let i = 0; i < capa.cantidad; i++) {
            const paso = i - (capa.cantidad - 1) / 2;
            const objeto = this.pluma(ala, capa.color, capa.ancho, capa.largo, capa.afuera * lado, 0, paso * 0.1);
            const abertura = paso * capa.abre * lado;
            objeto.rotation.y = lado * 1.12;
            objeto.rotation.z = abertura;
            plumas.push({ objeto: objeto, abertura: abertura });
          }
        }, this);

        return { ala: ala, lado: lado, plumas: plumas };
      }, this);
    }

    crearCabeza() {
      this.cabeza = giro(this.cuerpo, 0, 3.3, 0);
      en(this.cabeza, bola(1, COLOR.rojo, CABEZA));

      // Corona de plumas: rodea la cabeza y deja libre la cara.
      [-0.38, 0.2, 0.62, 1.02, 1.32].forEach(function (elevacion, fila) {
        const pasos = [20, 18, 15, 11, 6][fila];
        for (let i = 0; i < pasos; i++) {
          const angulo = ((i + (fila % 2) * 0.5) / pasos) * Math.PI * 2;
          const delante = Math.cos(angulo) > 0.25;
          if (delante && elevacion > 0 && elevacion < 0.7) continue;

          const objeto = this.pluma(
            this.cabeza, fila % 2 ? COLOR.rojo : COLOR.vino, 0.5, 0.62,
            Math.sin(angulo) * Math.cos(elevacion) * CABEZA[0],
            Math.sin(elevacion) * CABEZA[1],
            Math.cos(angulo) * Math.cos(elevacion) * CABEZA[2]
          );
          objeto.rotation.y = angulo;
          objeto.rotation.x = -elevacion - 0.1;
        }
      }, this);

      // Penachos: tres plumas abiertas a cada lado.
      [-1, 1].forEach(function (lado) {
        [[0.55, 1.05, 0.34], [0.3, 1.25, 0.38], [0.05, 0.95, 0.32]].forEach(function (p) {
          const objeto = this.pluma(this.cabeza, COLOR.vino, p[2], p[1], 0.88 * lado, 0.72, 0.18);
          objeto.rotation.z = Math.PI - p[0] * lado;
        }, this);
      }, this);
    }

    crearCara() {
      this.ojos = [-1, 1].map(function (lado) {
        const cara = giro(this.cabeza, 0.56 * lado, 0.14, 0.98);
        cara.rotation.y = 0.3 * lado;

        // Disco facial: plumas que salen del ojo y se hunden hacia el borde.
        for (let i = 0; i < 20; i++) {
          const angulo = (i / 20) * Math.PI * 2;
          // Las que apuntan al centro se saltan para no encimarse entre los ojos.
          if (Math.sin(angulo) * lado < -0.7) continue;

          const borde = this.pluma(cara, COLOR.vino, 0.26, 0.84, 0, 0, -0.06);
          borde.rotation.order = "ZXY";
          borde.rotation.z = angulo;
          borde.rotation.x = 0.16;

          const interior = this.pluma(cara, i % 2 ? COLOR.crema : COLOR.rosa, 0.26, 0.68, 0, 0, 0);
          interior.rotation.order = "ZXY";
          interior.rotation.z = angulo + 0.15;
          interior.rotation.x = 0.1;
        }

        const cuenca = en(cara, tubo(0.4, 0.4, 0.06, COLOR.negro, 18), 0, 0, 0.05);
        cuenca.rotation.x = Math.PI / 2;
        const iris = en(cara, tubo(0.33, 0.33, 0.04, COLOR.crema, 18), 0, 0, 0.09);
        iris.rotation.x = Math.PI / 2;
        const anillo = en(cara, tubo(0.27, 0.27, 0.04, COLOR.rosa, 18), 0, 0, 0.1);
        anillo.rotation.x = Math.PI / 2;
        const pupila = en(cara, ojo(0.2), 0, 0, 0.12);
        pupila.scale.z = 0.5;

        const parpado = giro(cara, 0, 0, 0.04);
        const domo = new THREE.SphereGeometry(0.42, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        parpado.add(malla(domo, COLOR.rojo));

        // Ceja: da la mirada seria de búho.
        const ceja = this.pluma(cara, COLOR.vino, 0.17, 1.05, -0.5 * lado, 0.1, 0.16);
        ceja.rotation.z = 2.11 * lado;

        return { pupila: pupila, parpado: parpado };
      }, this);

      const pico = giro(this.cabeza, 0, -0.08, 1.02);
      en(pico, bola(0.16, COLOR.gris, [1, 0.9, 1]));
      const punta = en(pico, cono(0.13, 0.42, COLOR.negro, 5), 0, -0.2, 0.08);
      punta.rotation.x = Math.PI + 0.35;
    }

    actualizar(t) {
      this.grupo.rotation.z = Math.sin(t * 0.8) * 0.035;
      const respiro = Math.sin(t * 1.5) * 0.012;
      this.cuerpo.scale.set(1 + respiro, 1 - respiro, 1 + respiro);

      // Mira a un lado, se queda quieto y vuelve; al enviar da la vuelta completa.
      const ciclo = (t % 9) / 9;
      const mirada = Math.sin(ciclo * Math.PI * 2) * 1.1;
      const suave = Math.sign(mirada) * Math.pow(Math.abs(mirada) / 1.1, 0.45) * 0.95;
      this.cabeza.rotation.y = suave + (1 - this.energia) * Math.PI * 2 * (this.energia > 0.01 ? 1 : 0);
      this.cabeza.rotation.z = Math.sin(t * 0.6) * 0.06;

      // Baja el párpado despacio y abre más los ojos cuando reacciona.
      const momento = t % 3.7;
      const cierre = momento < 0.26 ? Math.sin((momento / 0.26) * Math.PI) : 0;
      const abierto = PARPADO_ABIERTO - this.energia * 0.3;
      const pupila = 1 + this.energia * 0.22;
      this.ojos.forEach(function (ojoActual) {
        ojoActual.parpado.rotation.x = abierto + (PARPADO_CERRADO - abierto) * cierre;
        ojoActual.pupila.scale.set(pupila, pupila, 0.5);
      });

      const aleteo = Math.abs(Math.sin(t * 11)) * this.energia;
      this.alas.forEach(function (item) {
        item.ala.rotation.z = item.lado * (0.03 + aleteo * 0.9);
        item.plumas.forEach(function (pluma) {
          pluma.objeto.rotation.z = pluma.abertura * (1 + aleteo * 1.6);
        });
      });
    }
  }

  window.Animales.Buho = Buho;
})();
