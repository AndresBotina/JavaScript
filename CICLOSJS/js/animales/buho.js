// buho.js — Ejercicio 2. El profesor: mira a los lados y parpadea sobre su rama.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, tubo, ojo, en, giro, parpadeo } = util;

  class Buho extends Animal {
    constructor(ctx) {
      super(ctx);
      this.rama = tubo(0.17, 0.2, 8, COLOR.gris);
      this.rama.rotation.z = Math.PI / 2;
      this.rama.position.y = -2.55;
      ctx.escena.add(this.rama);

      this.grupo.position.y = -2.4;
      this.cuerpo = giro(this.grupo, 0, 0, 0);
      en(this.cuerpo, bola(1.45, COLOR.rojo, [1, 1.22, 0.9]), 0, 1.65, 0);
      en(this.cuerpo, bola(1.02, COLOR.rosa, [1, 1.2, 0.5]), 0, 1.45, 0.86);

      [-1, 1].forEach(function (lado) {
        const pie = en(this.grupo, cono(0.2, 0.42, COLOR.crema, 4), 0.42 * lado, 0.1, 0.3);
        pie.rotation.x = 1.1;
      }, this);

      this.alas = [-1, 1].map(function (lado) {
        const ala = giro(this.cuerpo, 1.32 * lado, 2.45, 0);
        en(ala, bola(0.62, COLOR.vino, [0.5, 1.75, 0.9]), 0.05 * lado, -0.98, 0);
        return { ala: ala, lado: lado };
      }, this);

      this.cabeza = giro(this.cuerpo, 0, 3.3, 0);
      en(this.cabeza, bola(1.15, COLOR.rojo, [1.14, 0.92, 0.95]));
      [-1, 1].forEach(function (lado) {
        const penacho = en(this.cabeza, cono(0.32, 0.72, COLOR.vino, 4), 0.72 * lado, 0.98, 0);
        penacho.rotation.z = -0.32 * lado;
      }, this);

      this.ojos = [-1, 1].map(function (lado) {
        const pivote = giro(this.cabeza, 0.5 * lado, 0.1, 0.92);
        const disco = en(pivote, tubo(0.46, 0.46, 0.08, COLOR.crema, 14));
        disco.rotation.x = Math.PI / 2;
        en(pivote, ojo(0.25), 0, 0, 0.09);
        return pivote;
      }, this);

      const pico = en(this.cabeza, cono(0.14, 0.42, COLOR.crema, 4), 0, -0.22, 1.1);
      pico.rotation.x = 2;

      this.grupo.scale.setScalar(0.92);
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

      const abierto = parpadeo(t, 3.7);
      this.ojos.forEach(function (ojoActual) { ojoActual.scale.y = abierto; });

      const aleteo = Math.abs(Math.sin(t * 16)) * this.energia * 1.1;
      this.alas.forEach(function (item) {
        item.ala.rotation.z = item.lado * (0.04 + aleteo);
      });
    }
  }

  window.Animales.Buho = Buho;
})();
