// cerdo.js — Ejercicio 3. Es la alcancía: respira y recibe una moneda al enviar el formulario.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, malla, bola, cono, tubo, caja, hueso, ojo, en, giro, parpadeo } = util;

  class Cerdo extends Animal {
    constructor(ctx) {
      super(ctx);
      this.grupo.rotation.y = -0.5;
      this.grupo.position.y = -0.45;

      this.cuerpo = en(this.grupo, bola(1.55, COLOR.rojo, [1.32, 1, 1]));
      en(this.grupo, caja(0.95, 0.05, 0.2, COLOR.negro), -0.1, 1.53, 0);

      this.cabeza = giro(this.grupo, 1.95, 0.45, 0);
      en(this.cabeza, bola(0.98, COLOR.rojo));
      this.hocico = en(this.cabeza, tubo(0.42, 0.46, 0.42, COLOR.rosa, 9), 0.98, -0.1, 0);
      this.hocico.rotation.z = Math.PI / 2;
      [-1, 1].forEach(function (lado) {
        const orificio = en(this.cabeza, tubo(0.07, 0.07, 0.03, COLOR.negro, 7), 1.2, -0.1, 0.16 * lado);
        orificio.rotation.z = Math.PI / 2;
      }, this);

      this.ojos = [-1, 1].map(function (lado) {
        return en(this.cabeza, ojo(0.13), 0.68, 0.34, 0.5 * lado);
      }, this);

      this.orejas = [-1, 1].map(function (lado) {
        const pivote = giro(this.cabeza, -0.05, 0.78, 0.55 * lado);
        en(pivote, cono(0.3, 0.6, COLOR.vino, 4), 0, 0.26, 0);
        pivote.rotation.x = 0.4 * lado;
        return pivote;
      }, this);

      [[1.25, 0.72], [1.25, -0.72], [-1.25, 0.72], [-1.25, -0.72]].forEach(function (p) {
        const pata = giro(this.grupo, p[0], -1.05, p[1]);
        en(pata, hueso(0.33, 0.28, 1.05, COLOR.vino));
      }, this);

      // Colita enroscada.
      this.cola = giro(this.grupo, -2, 0.4, 0);
      const rizo = malla(new THREE.TorusGeometry(0.19, 0.055, 6, 12, Math.PI * 1.7), COLOR.rosa);
      en(this.cola, rizo, -0.18, 0, 0);

      this.moneda = tubo(0.36, 0.36, 0.07, COLOR.crema, 14);
      this.moneda.rotation.x = Math.PI / 2;
      this.grupo.add(this.moneda);
    }

    actualizar(t) {
      const respiro = Math.sin(t * 1.9);
      this.cuerpo.scale.set(1.32, 1 + respiro * 0.025, 1 + respiro * 0.025);
      this.cabeza.rotation.z = Math.sin(t * 0.7) * 0.05;
      this.cabeza.rotation.y = Math.sin(t * 0.45) * 0.14;
      this.hocico.scale.y = 1 + Math.max(0, Math.sin(t * 7)) * 0.16 * (Math.sin(t * 0.8) > 0.4 ? 1 : 0);

      const abierto = parpadeo(t, 4.1);
      this.ojos.forEach(function (ojoActual) { ojoActual.scale.y = abierto; });

      // Sacude las orejas de vez en cuando.
      const sacudida = t % 6 < 0.5 ? Math.sin(t * 22) * 0.3 : 0;
      this.orejas.forEach(function (oreja, i) {
        oreja.rotation.z = (i ? -1 : 1) * 0.06 + sacudida;
      });

      this.cola.rotation.x = Math.sin(t * 6) * 0.4;

      // La moneda cae por la ranura al enviar el formulario.
      const caida = 1 - this.energia;
      this.moneda.visible = this.energia > 0.08;
      this.moneda.position.set(-0.1, 3.5 - caida * 2.1, 0);
      this.moneda.rotation.z = caida * 8;
      this.grupo.position.y = -0.45 + (this.energia < 0.3 ? Math.sin(this.energia * 10.4) * 0.1 : 0);
    }
  }

  window.Animales.Cerdo = Cerdo;
})();
