// pajaro.js — Página de ejemplos. Aletea en el aire con un leve balanceo.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, caja, ojo, en, giro } = util;

  class Pajaro extends Animal {
    constructor(ctx) {
      super(ctx);
      this.fase = 0;
      this.grupo.rotation.y = -0.55;
      this.grupo.scale.setScalar(0.95);

      this.cuerpo = giro(this.grupo, 0, 0, 0);
      en(this.cuerpo, bola(1, COLOR.rojo, [1.35, 0.92, 0.86]));
      en(this.cuerpo, bola(0.72, COLOR.rosa, [1.3, 0.78, 0.78]), 0.3, -0.34, 0);

      this.cabeza = giro(this.cuerpo, 1.32, 0.62, 0);
      en(this.cabeza, bola(0.66, COLOR.rojo));
      const pico = en(this.cabeza, cono(0.2, 0.62, COLOR.crema, 5), 0.8, -0.05, 0);
      pico.rotation.z = -Math.PI / 2;
      [-1, 1].forEach(function (lado) {
        en(this.cabeza, ojo(0.11), 0.34, 0.2, 0.5 * lado);
      }, this);
      const copete = en(this.cabeza, cono(0.2, 0.6, COLOR.vino, 4), -0.22, 0.68, 0);
      copete.rotation.z = 0.5;

      this.cola = giro(this.cuerpo, -1.25, 0.08, 0);
      [-0.3, 0, 0.3].forEach(function (angulo) {
        const pluma = en(this.cola, caja(1.3, 0.07, 0.3, COLOR.vino), -0.6, 0, angulo * 1.1);
        pluma.rotation.y = -angulo;
      }, this);

      // Cada ala tiene dos partes: la de afuera se dobla después que la de adentro.
      this.alas = [-1, 1].map(function (lado) {
        const hombro = giro(this.cuerpo, 0.15, 0.48, 0.58 * lado);
        en(hombro, caja(0.95, 0.09, 1.2, COLOR.vino), 0, 0, 0.6 * lado);
        const codo = giro(hombro, 0, 0, 1.18 * lado);
        en(codo, caja(0.72, 0.07, 1.2, COLOR.rojo), -0.08, 0, 0.58 * lado);
        return { hombro: hombro, codo: codo, lado: lado };
      }, this);
    }

    actualizar(t, dt) {
      this.fase += dt * (9 + this.energia * 15);
      const fase = this.fase;

      this.grupo.position.y = Math.sin(t * 1.3) * 0.3 - Math.sin(fase) * 0.07 + this.energia * 0.7;
      this.grupo.position.x = Math.sin(t * 0.5) * 0.35;
      this.cuerpo.rotation.z = 0.1 + Math.sin(t * 1.1) * 0.06;
      this.cuerpo.rotation.x = Math.sin(t * 0.8) * 0.07;
      this.cabeza.rotation.y = Math.sin(t * 0.9) * 0.3;
      this.cola.rotation.z = Math.sin(fase) * 0.07;

      this.alas.forEach(function (ala) {
        ala.hombro.rotation.x = -ala.lado * (Math.sin(fase) * 0.72 + 0.14);
        ala.codo.rotation.x = -ala.lado * (Math.sin(fase - 0.9) * 0.5 - 0.1);
      });
    }
  }

  window.Animales.Pajaro = Pajaro;
})();
