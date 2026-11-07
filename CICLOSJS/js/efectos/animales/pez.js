// Capa visual decorativa, independiente de los ejercicios.
// pez.js — Ejercicio 8. Nada de lado a lado ondulando el cuerpo y la cola.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, ojo, en, giro, girarHacia } = util;

  const PERFIL = [0.82, 1, 0.94, 0.74, 0.52, 0.32];

  class Pez extends Animal {
    constructor(ctx) {
      super(ctx);
      this.recorrido = 2;
      this.segmentos = [];
      this.grupo.scale.setScalar(0.92);

      let padre = this.grupo;
      PERFIL.forEach(function (radio, i) {
        const segmento = giro(padre, i === 0 ? 1.4 : -0.62, 0, 0);
        en(segmento, bola(radio, i % 2 ? COLOR.vino : COLOR.rojo, [1.05, 1.08, 0.66]));
        this.segmentos.push(segmento);
        padre = segmento;
      }, this);

      const cabeza = this.segmentos[0];
      [-1, 1].forEach(function (lado) {
        en(cabeza, ojo(0.17), 0.36, 0.26, 0.5 * lado);
        const aleta = en(cabeza, cono(0.34, 0.8, COLOR.rosa, 4), -0.4, -0.45, 0.48 * lado);
        aleta.scale.z = 0.14;
        aleta.rotation.set(0.5 * lado, 0, 2.5);
      });

      const dorsal = en(this.segmentos[2], cono(0.55, 0.95, COLOR.rosa, 4), -0.1, 1.15, 0);
      dorsal.scale.z = 0.14;
      dorsal.rotation.z = 0.45;

      this.cola = en(padre, cono(0.8, 1.25, COLOR.rosa, 4), -0.72, 0, 0);
      this.cola.scale.z = 0.14;
      this.cola.rotation.z = -Math.PI / 2;

      this.burbujas = [];
      for (let i = 0; i < 5; i++) {
        const burbuja = bola(0.09 + i * 0.018, COLOR.crema);
        burbuja.material.transparent = true;
        ctx.escena.add(burbuja);
        this.burbujas.push(burbuja);
      }
    }

    ajustar(medidas) {
      this.recorrido = Math.max(0, Math.min(2.6, medidas.medioAncho - 2.8));
    }

    actualizar(t, dt) {
      const velocidad = Math.cos(t * 0.34);
      const haciaDerecha = velocidad >= 0;
      this.grupo.position.x = Math.sin(t * 0.34) * this.recorrido;
      this.grupo.position.y = Math.sin(t * 0.9) * 0.3 + Math.sin(this.energia * Math.PI) * 1.5;
      girarHacia(this.grupo, haciaDerecha ? -0.32 : Math.PI + 0.32, dt);
      this.grupo.rotation.z = Math.sin(t * 0.9 + 1) * 0.05;

      // La onda crece hacia la cola.
      this.segmentos.forEach(function (segmento, i) {
        if (i === 0) return;
        segmento.rotation.y = Math.sin(t * 5.2 - i * 0.8) * (0.1 + i * 0.05);
      });

      this.burbujas.forEach(function (burbuja, i) {
        const subida = (t * 0.22 + i / 5) % 1;
        burbuja.position.set(
          this.grupo.position.x + (haciaDerecha ? 1.8 : -1.8) + Math.sin(t * 2 + i) * 0.14,
          this.grupo.position.y + subida * 2.8,
          0
        );
        burbuja.material.opacity = 0.55 * (1 - subida);
      }, this);
    }
  }

  window.Animales.Pez = Pez;
})();
