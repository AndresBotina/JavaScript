// hormiga.js — Ejercicio 1. Camina con seis patas por turnos cargando una miga.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, caja, hueso, ojo, en, giro, girarHacia } = util;

  class Hormiga extends Animal {
    constructor(ctx) {
      super(ctx);
      this.recorrido = 2.2;
      this.fase = 0;
      this.grupo.rotation.x = 0.18;
      this.grupo.scale.setScalar(0.98);

      this.cuerpo = giro(this.grupo, 0, 0, 0);
      en(this.cuerpo, bola(0.56, COLOR.vino, [1.32, 0.92, 0.92]));
      this.gaster = en(this.cuerpo, bola(0.9, COLOR.rojo, [1.38, 1, 1]), -1.72, 0.08, 0);
      en(this.cuerpo, bola(0.18, COLOR.vino), -0.8, 0.02, 0);

      this.cabeza = giro(this.cuerpo, 1.12, 0.14, 0);
      en(this.cabeza, bola(0.58, COLOR.rojo, [1.1, 0.95, 1]));
      this.antenas = [-1, 1].map(function (lado) {
        en(this.cabeza, ojo(0.12), 0.34, 0.2, 0.42 * lado);
        const antena = giro(this.cabeza, 0.32, 0.4, 0.2 * lado);
        en(antena, hueso(0.04, 0.025, 0.8, COLOR.rosa));
        antena.rotation.set(2.45 * -lado, 0, 0.75);
        return antena;
      }, this);

      this.miga = en(this.cabeza, caja(0.86, 0.66, 0.7, COLOR.crema), 0.92, 0.42, 0);
      this.miga.rotation.set(0.3, 0.5, 0.2);

      this.patas = [];
      [-1, 1].forEach(function (lado) {
        [0.5, 0, -0.5].forEach(function (x, i) {
          const cadera = giro(this.cuerpo, x, -0.28, 0.36 * lado);
          cadera.rotation.x = 1.05 * lado;
          en(cadera, hueso(0.085, 0.07, 0.82, COLOR.rojo));
          const rodilla = giro(cadera, 0, -0.8, 0);
          rodilla.rotation.x = -1.12 * lado;
          en(rodilla, hueso(0.07, 0.03, 0.95, COLOR.rosa));
          this.patas.push({ cadera: cadera, rodilla: rodilla, lado: lado, turno: (i + (lado > 0 ? 1 : 0)) % 2 });
        }, this);
      }, this);
    }

    ajustar(medidas) {
      this.recorrido = Math.max(0, Math.min(2.2, medidas.medioAncho - 3.2));
    }

    actualizar(t, dt) {
      const velocidad = Math.cos(t * 0.3);
      this.fase += dt * (3 + Math.abs(velocidad) * 11) * (1 + this.energia);
      this.grupo.position.x = Math.sin(t * 0.3) * this.recorrido;
      this.grupo.position.y = 0.2 + Math.abs(Math.sin(this.fase)) * 0.045;
      girarHacia(this.grupo, velocidad >= 0 ? -0.4 : Math.PI + 0.4, dt);

      this.patas.forEach(function (item) {
        const onda = this.fase + item.turno * Math.PI;
        item.cadera.rotation.z = Math.sin(onda) * 0.42;
        item.cadera.rotation.x = item.lado * (1.05 - Math.max(0, Math.cos(onda)) * 0.32);
      }, this);

      this.gaster.rotation.z = Math.sin(this.fase) * 0.03;
      this.cabeza.rotation.z = Math.sin(this.fase * 0.5) * 0.04;
      this.antenas.forEach(function (antena, i) {
        antena.rotation.z = 0.75 + Math.sin(t * 4.2 + i * 2) * 0.22;
      });

      // Al enviar el formulario lanza la miga y la vuelve a atrapar.
      this.miga.position.y = 0.42 + Math.sin(this.energia * Math.PI) * 1.5;
      this.miga.rotation.z = 0.2 + this.energia * 6;
    }
  }

  window.Animales.Hormiga = Hormiga;
})();
