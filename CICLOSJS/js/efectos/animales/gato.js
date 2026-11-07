// Capa visual decorativa, independiente de los ejercicios.
// gato.js — Ejercicio 5. Guardián sentado: respira, mueve la cola, parpadea y vigila el mouse.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, tubo, caja, hueso, en, giro, parpadeo } = util;

  class Gato extends Animal {
    constructor(ctx) {
      super(ctx);
      this.grupo.position.y = -0.55;
      this.grupo.rotation.y = -0.28;
      this.grupo.scale.setScalar(0.96);

      this.cuerpo = en(this.grupo, bola(1.32, COLOR.gris, [1, 1.28, 0.92]), 0, -0.55, 0);
      en(this.grupo, bola(0.68, COLOR.vino, [1, 1.25, 0.5]), 0, -0.25, 0.92);
      [-1, 1].forEach(function (lado) {
        en(this.grupo, bola(0.42, COLOR.gris, [1, 0.72, 1.3]), 0.56 * lado, -2.08, 0.82);
        en(this.grupo, bola(0.62, COLOR.gris, [1, 0.9, 1.3]), 1.08 * lado, -1.8, 0.1);
      }, this);

      this.cabeza = giro(this.grupo, 0, 1.3, 0.14);
      en(this.cabeza, bola(1.06, COLOR.gris, [1.14, 0.95, 0.95]));

      this.orejas = [-1, 1].map(function (lado) {
        const oreja = giro(this.cabeza, 0.68 * lado, 0.72, 0);
        en(oreja, cono(0.42, 0.82, COLOR.gris, 4), 0, 0.3, 0);
        en(oreja, cono(0.24, 0.52, COLOR.rojo, 4), 0, 0.22, 0.17);
        oreja.rotation.z = -0.2 * lado;
        return { oreja: oreja, lado: lado };
      }, this);

      this.ojos = [-1, 1].map(function (lado) {
        const ojoGato = giro(this.cabeza, 0.42 * lado, 0.12, 0.9);
        en(ojoGato, bola(0.23, COLOR.rosa, [1.1, 1, 0.45]));
        en(ojoGato, caja(0.07, 0.34, 0.04, COLOR.negro), 0, 0, 0.1);
        return ojoGato;
      }, this);

      en(this.cabeza, cono(0.1, 0.14, COLOR.rosa, 3), 0, -0.2, 1.02).rotation.x = Math.PI;
      [-1, 1].forEach(function (lado) {
        [-0.09, 0.05, 0.18].forEach(function (inclinacion) {
          const bigote = en(this.cabeza, tubo(0.009, 0.009, 1, COLOR.crema, 4), 0.72 * lado, -0.28, 0.84);
          bigote.rotation.z = Math.PI / 2 + inclinacion * lado;
        }, this);
      }, this);

      // Cola hecha de eslabones: cada uno gira un poco sobre el anterior.
      this.cola = [];
      let padre = giro(this.grupo, -0.9, -1.75, -0.5);
      padre.rotation.z = -1.5;
      for (let i = 0; i < 7; i++) {
        const eslabon = giro(padre, 0, i === 0 ? 0 : -0.42, 0);
        en(eslabon, hueso(0.2 - i * 0.012, 0.19 - i * 0.012, 0.46, COLOR.gris));
        this.cola.push(eslabon);
        padre = eslabon;
      }
    }

    actualizar(t) {
      const respiro = Math.sin(t * 1.7);
      this.cuerpo.scale.set(1 + respiro * 0.018, 1.28 + respiro * 0.02, 0.92 + respiro * 0.018);

      const raton = this.ctx.raton;
      this.cabeza.rotation.y += (raton.x * 1.1 - this.cabeza.rotation.y) * 0.06;
      this.cabeza.rotation.x += (raton.y * 0.5 - this.cabeza.rotation.x) * 0.06;

      const abierto = parpadeo(t, 3.9);
      this.ojos.forEach(function (ojoGato) {
        ojoGato.scale.set(1 + this.energia * 0.25, abierto * (1 + this.energia * 0.25), 1);
      }, this);

      // Una oreja se sacude cada tanto; al enviar se paran las dos.
      const sacudida = t % 5 < 0.35 ? Math.sin(t * 30) * 0.2 : 0;
      this.orejas.forEach(function (item, i) {
        item.oreja.rotation.z = -0.2 * item.lado * (1 - this.energia) + (i ? sacudida : 0);
        item.oreja.scale.y = 1 + this.energia * 0.15;
      }, this);

      this.cola.forEach(function (eslabon, i) {
        eslabon.rotation.z = -0.24 + Math.sin(t * 1.5 - i * 0.55) * (0.1 + i * 0.022);
      });

      // Se escala solo el primer eslabón: los demás lo heredan.
      const esponjada = 1 + this.energia * 0.6;
      this.cola[0].scale.set(esponjada, 1, esponjada);
    }
  }

  window.Animales.Gato = Gato;
})();
