// Capa visual decorativa, independiente de los ejercicios.
// caballo.js — Ejercicio 6. Ciclo de caminata de cuatro tiempos, con cabeza y cola.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, tubo, caja, hueso, ojo, en, giro, molde } = util;

  // Adorno de la frente: "copete", "lucero" o "ambos".
  const FRENTE = "ambos";

  // Ángulos de reposo. El de la cabeza se suma al del cuello.
  const CUELLO = 0.98;
  const CABEZA = -1.82;

  // Perfiles: [x, y, ancho, alto]
  const TRONCO = [
    [-2.2, 0.16, 0.2, 0.26], [-1.95, 0.2, 0.56, 0.68], [-1.35, 0.22, 0.78, 0.92],
    [-0.5, 0.06, 0.74, 0.86], [0.4, 0.04, 0.74, 0.88], [1.2, 0.14, 0.72, 0.92],
    [1.75, 0.12, 0.56, 0.76], [2.05, 0.04, 0.24, 0.36]
  ];
  const PESCUEZO = [
    [-0.45, -0.12, 0.36, 0.66], [0.3, -0.04, 0.32, 0.56], [1, 0, 0.26, 0.44], [1.72, 0.02, 0.22, 0.34], [1.95, 0.02, 0.14, 0.2]
  ];
  // Desde la nuca hasta el hocico: la frente es la parte más ancha.
  const CRANEO = [
    [-0.34, -0.1, 0.16, 0.2], [-0.12, -0.1, 0.3, 0.42], [0.16, -0.08, 0.36, 0.47], [0.46, -0.06, 0.33, 0.4],
    [0.82, -0.05, 0.24, 0.29], [1.16, -0.06, 0.2, 0.23], [1.42, -0.07, 0.22, 0.25], [1.6, -0.09, 0.17, 0.18], [1.68, -0.1, 0.08, 0.08]
  ];

  class Caballo extends Animal {
    constructor(ctx) {
      super(ctx);
      this.fase = 0;
      this.grupo.rotation.y = -0.42;
      this.grupo.position.set(-0.2, 0.1, 0);
      this.grupo.scale.setScalar(0.8);

      this.cuerpo = giro(this.grupo, 0, 0, 0);
      en(this.cuerpo, molde(TRONCO, COLOR.rojo, 12));

      this.crearCuello();
      this.crearCabeza();
      this.crearPatas();
      this.crearCola();
      this.crearSuelo();
    }

    crearCuello() {
      this.cuello = giro(this.cuerpo, 1.42, 0.62, 0);
      this.cuello.rotation.z = CUELLO;
      en(this.cuello, molde(PESCUEZO, COLOR.rojo, 10));

      // Crin: mechones planos a lo largo de la cresta del cuello.
      for (let i = 0; i < 8; i++) {
        const x = -0.16 + i * 0.27;
        const alto = 0.68 - i * 0.046;
        const mechon = en(this.cuello, cono(0.24, 0.86, COLOR.gris, 4), x, alto, 0);
        mechon.scale.z = 0.4;
        mechon.rotation.z = 1.12;
      }
    }

    crearCabeza() {
      this.cabeza = giro(this.cuello, 1.84, 0.04, 0);
      this.cabeza.rotation.order = "ZYX";
      this.cabeza.rotation.z = CABEZA;
      en(this.cabeza, molde(CRANEO, COLOR.rojo, 10));

      // Mandíbula: da el corte redondo de la quijada.
      en(this.cabeza, bola(0.3, COLOR.vino, [1.25, 0.9, 0.82]), 0.08, -0.34, 0);

      this.orejas = [-1, 1].map(function (lado) {
        const oreja = giro(this.cabeza, -0.06, 0.28, 0.2 * lado);
        const punta = en(oreja, cono(0.15, 0.48, COLOR.rojo, 4), 0, 0.22, 0);
        punta.scale.z = 0.62;
        const interior = en(oreja, cono(0.07, 0.34, COLOR.rosa, 4), 0.045, 0.19, 0);
        interior.scale.z = 0.5;
        oreja.rotation.set(0.14 * lado, 0, 0.5);
        return oreja;
      }, this);

      [-1, 1].forEach(function (lado) {
        en(this.cabeza, ojo(0.095), 0.4, 0.12, 0.31 * lado);
        const orificio = en(this.cabeza, bola(0.05, COLOR.negro, [1.2, 0.8, 0.5]), 1.48, 0, 0.19 * lado);
        orificio.rotation.y = 0.3 * lado;
      }, this);

      // Línea de la boca.
      const boca = en(this.cabeza, caja(0.38, 0.018, 0.34, COLOR.negro), 1.48, -0.2, 0);
      boca.rotation.z = 0.08;

      if (FRENTE === "copete" || FRENTE === "ambos") this.crearCopete();
      if (FRENTE === "lucero" || FRENTE === "ambos") this.crearLucero();
    }

    // Mechones que nacen entre las orejas y caen pegados a la frente.
    crearCopete() {
      this.copete = giro(this.cabeza, -0.16, 0.3, 0);
      const mechon = [[0, 0.03, 0.05, 0.03], [0.22, 0.09, 0.11, 0.05], [0.46, 0.06, 0.08, 0.04], [0.7, 0, 0.012, 0.012]];
      [[0, 1], [0.24, 0.8], [-0.24, 0.8]].forEach(function (m) {
        const pieza = en(this.copete, molde(mechon, COLOR.gris, 6));
        pieza.rotation.y = m[0];
        pieza.scale.x = m[1];
      }, this);
    }

    // Mancha clara: una sola marca que sigue la frente y baja por la nariz.
    crearLucero() {
      const anchos = [0.015, 0.15, 0.06, 0.07, 0.015];
      const marca = CRANEO.slice(2, 7).map(function (seccion, i) {
        // 0.951 es la altura de la cara plana superior del molde de 10 lados.
        return [seccion[0], seccion[1] + seccion[3] * 0.951 + 0.012, anchos[i], 0.016];
      });
      en(this.cabeza, molde(marca, COLOR.crema, 6));
    }

    crearPatas() {
      // [x, z, desfase del ciclo]. Caminata de cuatro tiempos.
      this.patas = [[1.25, 0.42, 0], [1.25, -0.42, 0.5], [-1.3, 0.42, 0.75], [-1.3, -0.42, 0.25]].map(function (p) {
        const cadera = giro(this.cuerpo, p[0], -0.42, p[1]);
        en(cadera, hueso(0.3, 0.17, 1.05, COLOR.rojo));
        const rodilla = giro(cadera, 0, -1.02, 0);
        en(rodilla, hueso(0.15, 0.12, 0.98, COLOR.vino));
        en(rodilla, tubo(0.15, 0.2, 0.2, COLOR.gris), 0, -1.02, 0);
        return { cadera: cadera, rodilla: rodilla, desfase: p[2] * Math.PI * 2 };
      }, this);
    }

    crearCola() {
      this.cola = [];
      let padre = giro(this.cuerpo, -2.1, 0.62, 0);
      padre.rotation.z = -0.62;
      for (let i = 0; i < 5; i++) {
        const tramo = giro(padre, 0, i === 0 ? 0 : -0.4, 0);
        en(tramo, hueso(0.09 + i * 0.028, 0.12 + i * 0.028, 0.44, COLOR.gris));
        this.cola.push(tramo);
        padre = tramo;
      }
    }

    // Marcas del suelo que corren hacia atrás para que parezca que avanza.
    crearSuelo() {
      this.suelo = [];
      for (let i = 0; i < 7; i++) {
        this.suelo.push(en(this.grupo, caja(0.7, 0.04, 0.12, COLOR.gris), 0, -2.42, 0.9));
      }
    }

    actualizar(t, dt) {
      this.fase += dt * (3.6 + this.energia * 7);
      const fase = this.fase;

      this.patas.forEach(function (pata) {
        const onda = fase + pata.desfase;
        pata.cadera.rotation.z = Math.sin(onda) * 0.42;
        pata.rodilla.rotation.z = -Math.max(0, Math.cos(onda)) * 0.95;
      });

      this.cuerpo.position.y = Math.sin(fase * 2) * 0.035;
      this.cuerpo.rotation.z = Math.sin(fase) * 0.012;
      this.cuello.rotation.z = CUELLO + Math.sin(fase * 2 + 0.6) * 0.05;
      this.cabeza.rotation.z = CABEZA - Math.sin(fase * 2 + 1.2) * 0.06;
      // Gira un poco hacia quien mira, para que se le vea la frente.
      this.cabeza.rotation.x = 0.55;
      this.cabeza.rotation.y = -0.3 + Math.sin(t * 0.5) * 0.12;

      // Las orejas se mueven por separado, como cuando escucha algo.
      this.orejas.forEach(function (oreja, i) {
        oreja.rotation.z = 0.5 + Math.sin(t * 0.9 + i * 2.1) * 0.16;
      });
      if (this.copete) this.copete.rotation.z = Math.sin(fase * 2) * 0.025;

      this.cola.forEach(function (tramo, i) {
        tramo.rotation.z = 0.1 + Math.sin(fase * 1.1 - i * 0.65) * 0.1;
        tramo.rotation.x = Math.sin(t * 1.6 - i * 0.5) * 0.09;
      });

      const largo = 7;
      this.suelo.forEach(function (marca, i) {
        marca.position.x = ((((i * 1.1 - fase * 0.42) % largo) + largo) % largo) - largo / 2;
      });
    }
  }

  window.Animales.Caballo = Caballo;
})();
