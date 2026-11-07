// Capa visual decorativa, independiente de los ejercicios.
// mariquita.js — Ejercicio 4. Camina, y a ratos levanta el caparazón y despliega las alas.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, hueso, material, ojo, en, giro, girarHacia } = util;

  const RADIO = 1.75;
  // Puntos de cada lado: [ángulo a lo largo, ángulo desde el lomo]
  const PUNTOS = [[0.55, 0.8], [1.45, 0.62], [2.45, 0.85], [1.55, 1.2]];

  // Bisagra del caparazón: en el hombro, junto a la cabeza.
  const BISAGRA = [1.3, 0.5];
  // Cuánto se abre: sube la parte de atrás, se separa en V y rota hacia afuera.
  const ABRIR = { subir: -0.85, separar: 0.75, rotar: -0.5 };

  const LARGO_ALA = 3.3;
  const ANCHO_ALA = 1.25;

  function suave(valor) {
    const v = Math.max(0, Math.min(1, valor));
    return v * v * (3 - 2 * v);
  }

  // Contorno del ala: angosta en la raíz y ancha cerca de la punta.
  function crearAla(lado) {
    const forma = new THREE.Shape();
    forma.moveTo(0, 0);
    forma.bezierCurveTo(ANCHO_ALA * 0.5, LARGO_ALA * 0.3, ANCHO_ALA * 0.62, LARGO_ALA * 0.82, ANCHO_ALA * 0.12, LARGO_ALA);
    forma.bezierCurveTo(-ANCHO_ALA * 0.42, LARGO_ALA * 1.03, -ANCHO_ALA * 0.62, LARGO_ALA * 0.55, -ANCHO_ALA * 0.3, LARGO_ALA * 0.25);
    forma.quadraticCurveTo(-ANCHO_ALA * 0.14, LARGO_ALA * 0.08, 0, 0);

    const geometria = new THREE.ShapeGeometry(forma, 16);
    // La forma se dibuja en XY; se acuesta para que el largo quede hacia el lado.
    geometria.rotateX(Math.PI / 2);

    const ala = new THREE.Group();
    ala.add(new THREE.Mesh(geometria, new THREE.MeshStandardMaterial({
      color: 0xf6c9c4,
      transparent: true,
      opacity: 0.5,
      roughness: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false
    })));

    // Venas desde la raíz, como en un ala real.
    const venas = new THREE.LineBasicMaterial({ color: COLOR.vino, transparent: true, opacity: 0.8 });
    [[0.34, 0.86], [0.02, 0.97], [-0.32, 0.72]].forEach(function (punta) {
      const curva = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(punta[0] * ANCHO_ALA * 0.3, 0, LARGO_ALA * 0.45),
        new THREE.Vector3(punta[0] * ANCHO_ALA, 0, punta[1] * LARGO_ALA)
      );
      ala.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curva.getPoints(12)), venas));
    });

    ala.scale.z = lado;
    return ala;
  }

  class Mariquita extends Animal {
    constructor(ctx) {
      super(ctx);
      this.recorrido = 1.6;
      this.fase = 0;
      this.avance = 0;
      this.grupo.rotation.x = 0.72;

      this.cuerpo = giro(this.grupo, 0, -0.2, 0);
      en(this.cuerpo, bola(RADIO * 0.92, COLOR.gris, [1.14, 0.42, 0.95]));
      en(this.cuerpo, bola(RADIO * 0.74, COLOR.vino, [1.16, 0.5, 0.82]), -0.15, 0.3, 0);

      this.crearCabeza();
      this.crearAlas();
      this.crearCaparazon();
      this.crearPatas();
    }

    crearCabeza() {
      const cabeza = en(this.cuerpo, bola(0.68, COLOR.gris, [0.85, 0.75, 1]), RADIO * 1.12, 0.12, 0);
      this.antenas = [-1, 1].map(function (lado) {
        en(cabeza, ojo(0.13), 0.45, 0.22, 0.38 * lado);
        const antena = giro(cabeza, 0.42, 0.4, 0.2 * lado);
        en(antena, hueso(0.035, 0.02, 0.8, COLOR.gris));
        antena.rotation.set(2.5 * -lado, 0, 0.5);
        return antena;
      });
    }

    // Nacen en el costado del cuerpo, debajo del caparazón.
    crearAlas() {
      this.alas = [1, -1].map(function (lado) {
        const pivote = giro(this.cuerpo, 0.5, 0.42, 0.62 * lado);
        pivote.rotation.order = "YXZ";
        pivote.add(crearAla(lado));
        return { pivote: pivote, lado: lado };
      }, this);
    }

    crearCaparazon() {
      this.caparazon = [1, -1].map(function (lado) {
        const pivote = giro(this.cuerpo, BISAGRA[0], BISAGRA[1], 0);
        pivote.rotation.order = "YZX";

        const inicio = lado > 0 ? 0 : Math.PI;
        const forma = new THREE.SphereGeometry(RADIO, 20, 12, inicio, Math.PI, 0, Math.PI / 2);
        const mitad = new THREE.Mesh(forma, material(COLOR.rojo));
        mitad.position.set(-BISAGRA[0], 0.1 - BISAGRA[1], 0);
        mitad.scale.set(1.16, 0.84, 1);
        pivote.add(mitad);

        // Por dentro es más oscuro, como la cara interna del caparazón.
        mitad.add(new THREE.Mesh(forma, material(COLOR.vino, { side: THREE.BackSide })));

        PUNTOS.forEach(function (punto) {
          const normal = new THREE.Vector3(
            -Math.cos(punto[0]) * Math.sin(punto[1]),
            Math.cos(punto[1]),
            Math.sin(punto[0]) * Math.sin(punto[1]) * lado
          );
          const mancha = en(mitad, bola(0.27, COLOR.negro, [1, 1, 0.3]));
          mancha.position.copy(normal).multiplyScalar(RADIO * 0.985);
          mancha.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        });
        return { pivote: pivote, lado: lado };
      }, this);
    }

    crearPatas() {
      this.patas = [];
      [-1, 1].forEach(function (lado) {
        [0.85, 0, -0.85].forEach(function (x, i) {
          const pata = giro(this.cuerpo, x, -0.1, 1.15 * lado);
          en(pata, hueso(0.09, 0.05, 0.78, COLOR.gris));
          pata.rotation.x = 1.0 * lado;
          this.patas.push({ pata: pata, turno: (i + (lado > 0 ? 1 : 0)) % 2 });
        }, this);
      }, this);
    }

    ajustar(medidas) {
      this.recorrido = Math.max(0, Math.min(1.8, medidas.medioAncho - 3.4));
    }

    actualizar(t, dt) {
      // Cada 11 segundos se detiene y vuela un momento en el sitio.
      const ciclo = t % 11;
      const vuelo = ciclo > 7 ? Math.min((ciclo - 7) / 0.9, (11 - ciclo) / 0.9) : 0;
      const apertura = Math.max(Math.min(1, vuelo), this.energia > 0.05 ? 1 : 0);
      this.apertura = this.apertura === undefined ? apertura : this.apertura + (apertura - this.apertura) * Math.min(1, dt * 7);

      // Primero se abre el caparazón y después salen las alas.
      const caparazon = suave(this.apertura / 0.55);
      const alas = suave((this.apertura - 0.45) / 0.55);
      const paso = 1 - caparazon;

      this.fase += dt * 9 * paso;
      this.avance += dt * 0.2 * paso;
      this.grupo.position.x = Math.sin(this.avance) * this.recorrido;
      girarHacia(this.grupo, Math.cos(this.avance) >= 0 ? -0.5 : Math.PI + 0.5, dt);

      const flotar = alas * (0.5 + Math.sin(t * 3.4) * 0.08);
      this.cuerpo.position.y = -0.2 + flotar + Math.abs(Math.sin(this.fase)) * 0.03 * paso;
      this.cuerpo.rotation.z = alas * 0.14;

      this.patas.forEach(function (item) {
        item.pata.rotation.z = Math.sin(this.fase + item.turno * Math.PI) * 0.42 * paso;
      }, this);

      this.caparazon.forEach(function (mitad) {
        mitad.pivote.rotation.z = ABRIR.subir * caparazon;
        mitad.pivote.rotation.y = mitad.lado * ABRIR.separar * caparazon;
        mitad.pivote.rotation.x = mitad.lado * ABRIR.rotar * caparazon;
      });

      // El ala se despliega hacia el lado y bate por debajo del caparazón abierto.
      const aleteo = 0.12 + Math.sin(t * 30) * 0.5;
      this.alas.forEach(function (item) {
        item.pivote.visible = alas > 0.02;
        item.pivote.scale.set(0.45 + alas * 0.55, 1, 0.12 + alas * 0.88);
        item.pivote.rotation.y = item.lado * (0.32 - alas * 1.2);
        item.pivote.rotation.x = -item.lado * aleteo * alas;
      });

      this.antenas.forEach(function (antena, i) {
        antena.rotation.z = 0.5 + Math.sin(t * 2.3 + i * 1.7) * 0.18;
      });
    }
  }

  window.Animales.Mariquita = Mariquita;
})();
