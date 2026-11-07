// Capa visual decorativa, independiente de los ejercicios.
// abeja.js — Ejercicio 7. La obrera: aleteo rápido y vuelo errático en trayectos cortos.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, hueso, ojo, en, giro, girarHacia, membrana } = util;

  class Abeja extends Animal {
    constructor(ctx) {
      super(ctx);
      this.ampliar = 1;
      this.tiempo = 0;
      this.anteriorX = 0;

      this.cuerpo = giro(this.grupo, 0, 0, 0);
      en(this.cuerpo, bola(0.62, COLOR.gris), 0.1, 0, 0);
      const anillos = [[-0.58, 0.68, COLOR.rojo], [-0.98, 0.72, COLOR.gris], [-1.38, 0.64, COLOR.rojo], [-1.74, 0.46, COLOR.gris]];
      anillos.forEach(function (anillo) {
        en(this.cuerpo, bola(anillo[1], anillo[2], [0.62, 1, 1]), anillo[0], -0.04, 0);
      }, this);

      const aguijon = en(this.cuerpo, cono(0.12, 0.5, COLOR.crema, 5), -2.2, -0.04, 0);
      aguijon.rotation.z = Math.PI / 2;

      const cabeza = en(this.cuerpo, bola(0.48, COLOR.rojo), 0.84, 0.06, 0);
      this.antenas = [-1, 1].map(function (lado) {
        en(cabeza, ojo(0.13), 0.26, 0.14, 0.32 * lado);
        const antena = giro(cabeza, 0.2, 0.34, 0.16 * lado);
        en(antena, hueso(0.03, 0.02, 0.62, COLOR.gris));
        antena.rotation.set(2.6 * -lado, 0, 0.4);
        return antena;
      });

      this.alas = [];
      [-1, 1].forEach(function (lado) {
        [[0.15, 0.62, 1.2], [-0.42, 0.45, 0.9]].forEach(function (datos) {
          const pivote = giro(this.cuerpo, datos[0], 0.5, 0.2 * lado);
          const ala = en(pivote, membrana(datos[1], datos[2]), 0, 0, datos[2] * lado);
          ala.rotation.x = Math.PI / 2;
          this.alas.push({ pivote: pivote, lado: lado });
        }, this);
      }, this);

      [-0.1, 0.25, 0.55].forEach(function (x) {
        [-1, 1].forEach(function (lado) {
          const pata = giro(this.cuerpo, x, -0.45, 0.28 * lado);
          en(pata, hueso(0.04, 0.025, 0.5, COLOR.gris));
          pata.rotation.set(0.5 * lado, 0, -0.5);
        }, this);
      }, this);

      this.grupo.scale.setScalar(0.95);
    }

    ajustar(medidas) {
      this.ampliar = Math.max(0.35, Math.min(1, (medidas.medioAncho - 2) / 2.2));
    }

    actualizar(t, dt) {
      this.tiempo += dt * (1 + this.energia * 2.5);
      const v = this.tiempo;

      // Varias ondas mezcladas dan un vuelo nervioso, que no se ve repetido.
      const x = (1.9 * Math.sin(v * 0.71) + 0.7 * Math.sin(v * 2.3 + 1) + 0.24 * Math.sin(v * 7.1)) * this.ampliar;
      const y = 1.1 * Math.sin(v * 1.13) + 0.45 * Math.sin(v * 3.1) + 0.14 * Math.sin(v * 9.3);
      this.grupo.position.set(x, y, 0.6 * Math.sin(v * 0.9));

      if (dt > 0) {
        const haciaX = x - this.anteriorX;
        if (Math.abs(haciaX) > 0.002) {
          girarHacia(this.grupo, haciaX > 0 ? -0.42 : Math.PI + 0.42, dt * 1.6);
        }
        this.grupo.rotation.z = Math.max(-0.35, Math.min(0.35, Math.abs(haciaX) * 3 - 0.08));
      } else {
        this.grupo.rotation.y = -0.42;
      }
      this.anteriorX = x;

      this.alas.forEach(function (item) {
        item.pivote.rotation.x = item.lado * (Math.sin(t * 52) * 0.62 + 0.12);
      });
      this.antenas.forEach(function (antena, i) {
        antena.rotation.z = 0.4 + Math.sin(t * 5 + i) * 0.16;
      });
    }
  }

  window.Animales.Abeja = Abeja;
})();
