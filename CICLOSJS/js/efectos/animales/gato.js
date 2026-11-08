// Capa visual decorativa, independiente de los ejercicios.
// gato.js — Ejercicio 5. Guardián sentado: vigila el mouse, mueve las orejas y de vez en
// cuando se lame una pata. Reacciona al enviar el formulario.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, tubo, caja, hueso, en, giro } = util;

  // Tiempo sentado entre un lamido de pata y el siguiente.
  const REPOSO_MIN = 8;
  const REPOSO_MAX = 15;

  // Duraciones en segundos.
  const ACICALAR_SUBIR = 1.3;
  const ACICALAR_MANTENER_MIN = 3;
  const ACICALAR_MANTENER_MAX = 5;
  const ACICALAR_BAJAR = 1.2;
  const REACCION_INTERRUMPIR = 1;
  const REACCION_MANTENER = 1.1;
  const REACCION_VOLVER = 0.9;

  // Capas que siempre siguen activas.
  const RESPIRACION_VELOCIDAD = 1.2;
  const COLA_VELOCIDAD = 1.1;
  const PARPADEO_MIN = 4;
  const PARPADEO_MAX = 8;
  const PARPADEO_DURACION = 0.5;
  const OREJA_MIN = 3;
  const OREJA_MAX = 8;
  const OREJA_DURACION = 0.45;
  const LAMER_VELOCIDAD = 5.5;
  const MIRADA_VELOCIDAD = 3.6;

  // Valores de cada pose. Todo lo demás del gato se calcula a partir de estos.
  const REPOSO = {
    giro: -0.28, inclinar: 0, cabeceo: 0, rodar: 0, bajar: 0,
    hombro0: 0, codo0: 0, hombro1: 0, codo1: 0, cadera: 0, rodilla: -1.4,
    cabezaX: 0, cabezaY: 0, cabezaZ: 0, cuello: 0, boca: 0, ojos: 1, orejasAtras: 0,
    colaCentro: 0, colaCurva: 1, colaAlza: 0,
    mirada: 1, lamer: 0, alerta: 0
  };

  function pose(cambios) {
    return Object.assign({}, REPOSO, cambios);
  }

  const LAMIENDO = pose({
    mirada: 0, cabeceo: 0.08, hombro1: -2.1, codo1: -1.75,
    cabezaX: 0.34, cabezaY: 0.2, cabezaZ: 0.18, boca: 0.22, ojos: 0.45, lamer: 1
  });

  const ALERTA = pose({ alerta: 1, cabezaX: -0.08 });

  function suavizar(x) {
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  function entre(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo);
  }

  class Gato extends Animal {
    constructor(ctx) {
      super(ctx);
      this.grupo.position.y = -0.55;
      this.grupo.scale.setScalar(0.96);

      this.pose = Object.assign({}, REPOSO);
      this.desde = Object.assign({}, REPOSO);
      this.hacia = REPOSO;
      this.pasos = [];
      this.paso = null;
      this.tiempoPaso = 0;
      this.comportamiento = null;
      this.esperaReposo = entre(REPOSO_MIN, REPOSO_MAX);

      this.miradaX = 0;
      this.miradaY = 0;
      this.proximoParpadeo = entre(PARPADEO_MIN, PARPADEO_MAX);
      this.parpadeo = 0;
      this.proximaOreja = entre(OREJA_MIN, OREJA_MAX);
      this.orejaMovida = 0;
      this.tiempoOreja = OREJA_DURACION;

      this.crearModelo();
    }

    crearModelo() {
      // raiz inclina y baja el cuerpo; rodar lo gira sobre la columna.
      this.raiz = giro(this.grupo, 0, -0.55, 0);
      this.rodar = giro(this.raiz, 0, 0, 0);

      this.cuerpo = en(this.rodar, bola(1.32, COLOR.gris, [1, 1.28, 0.92]));
      en(this.rodar, bola(0.68, COLOR.vino, [1, 1.25, 0.5]), 0, 0.3, 0.92);

      this.crearPatas();
      this.crearCabeza();
      this.crearCola();
    }

    crearPatas() {
      this.delanteras = [-1, 1].map(function (lado) {
        const hombro = giro(this.rodar, 0.66 * lado, 0.3, 0.8);
        en(hombro, hueso(0.27, 0.23, 0.92, COLOR.gris));
        const codo = giro(hombro, 0, -0.92, 0);
        en(codo, hueso(0.23, 0.2, 0.72, COLOR.gris));
        en(codo, bola(0.42, COLOR.gris, [1, 0.72, 1.3]), -0.1 * lado, -0.9, 0.02);
        return { hombro: hombro, codo: codo };
      }, this);

      this.traseras = [-1, 1].map(function (lado) {
        const cadera = giro(this.rodar, 1 * lado, -0.85, 0.1);
        en(cadera, bola(0.62, COLOR.gris, [1, 0.9, 1.3]), 0.08 * lado, -0.4, 0);
        const rodilla = giro(cadera, 0.08 * lado, -0.6, 0.05);
        en(rodilla, hueso(0.22, 0.18, 0.62, COLOR.gris));
        en(rodilla, bola(0.3, COLOR.gris, [1, 0.8, 1.2]), 0, -0.52, 0.05);
        return { cadera: cadera, rodilla: rodilla };
      }, this);
    }

    crearCabeza() {
      this.cabeza = giro(this.rodar, 0, 1.85, 0.14);
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

      // Boca: queda oculta hasta que se abre.
      this.boca = giro(this.cabeza, 0, -0.5, 0.8);
      en(this.boca, bola(0.5, COLOR.negro, [1, 1.05, 0.4]));
      en(this.boca, bola(0.27, COLOR.rosa, [1, 0.42, 1.2]), 0, -0.28, 0.14);
      this.mandibula = giro(this.cabeza, 0, -0.5, 0.42);
      en(this.mandibula, bola(0.46, COLOR.gris, [1, 0.3, 1]), 0, -0.08, 0.36);
    }

    crearCola() {
      // Cola hecha de eslabones: cada uno gira un poco sobre el anterior.
      this.cola = [];
      this.raizCola = giro(this.rodar, -0.9, -1.2, -0.5);
      let padre = this.raizCola;
      for (let i = 0; i < 7; i++) {
        const eslabon = giro(padre, 0, i === 0 ? 0 : -0.42, 0);
        en(eslabon, hueso(0.2 - i * 0.012, 0.19 - i * 0.012, 0.46, COLOR.gris));
        this.cola.push(eslabon);
        padre = eslabon;
      }
    }

    /* ---------- Rutina ---------- */

    irA(destino, duracion) {
      this.pasos.push({ pose: destino, duracion: duracion });
    }

    // Se lame una pata: la sube, la lame un rato y la baja.
    pasosAcicalar() {
      this.irA(LAMIENDO, ACICALAR_SUBIR);
      this.irA(LAMIENDO, entre(ACICALAR_MANTENER_MIN, ACICALAR_MANTENER_MAX));
      this.irA(REPOSO, ACICALAR_BAJAR);
    }

    iniciar(nombre) {
      this.comportamiento = nombre;
      this.pasos = [];
      this.paso = null;
      this.pasosAcicalar();
    }

    // Cambia de paso desde la pose actual, así nunca hay saltos.
    siguientePaso() {
      this.paso = this.pasos.shift() || null;
      this.tiempoPaso = 0;
      if (this.paso) {
        this.desde = Object.assign({}, this.pose);
        this.hacia = this.paso.pose;
      } else {
        this.comportamiento = null;
        this.esperaReposo = entre(REPOSO_MIN, REPOSO_MAX);
      }
    }

    avanzarRutina(dt) {
      if (!this.comportamiento) {
        this.esperaReposo -= dt;
        if (this.esperaReposo <= 0) this.iniciar("acicalar");
        return;
      }
      if (!this.paso) this.siguientePaso();
      if (!this.paso) return;

      this.tiempoPaso += dt;
      const avance = Math.min(1, this.tiempoPaso / this.paso.duracion);
      const curva = suavizar(avance);
      Object.keys(this.pose).forEach(function (clave) {
        this.pose[clave] = this.desde[clave] + (this.hacia[clave] - this.desde[clave]) * curva;
      }, this);
      if (avance >= 1) this.siguientePaso();
    }

    // Deja lo que esté haciendo con suavidad y luego reacciona.
    reaccionar() {
      super.reaccionar();
      this.comportamiento = "reaccion";
      this.paso = null;
      this.pasos = [];
      this.irA(ALERTA, REACCION_INTERRUMPIR);
      this.irA(ALERTA, REACCION_MANTENER);
      this.irA(REPOSO, REACCION_VOLVER);
    }

    /* ---------- Capas siempre activas ---------- */

    // Devuelve cuánto se cierran los ojos: 0 abiertos, 1 cerrados.
    avanzarParpadeo(dt) {
      this.proximoParpadeo -= dt;
      if (this.proximoParpadeo <= 0) {
        this.parpadeo += dt / PARPADEO_DURACION;
        if (this.parpadeo >= 1) {
          this.parpadeo = 0;
          this.proximoParpadeo = entre(PARPADEO_MIN, PARPADEO_MAX);
        }
      }
      return Math.sin(this.parpadeo * Math.PI);
    }

    // Devuelve la sacudida suave de una oreja.
    avanzarOreja(dt) {
      this.proximaOreja -= dt;
      if (this.proximaOreja <= 0) {
        this.proximaOreja = entre(OREJA_MIN, OREJA_MAX);
        this.tiempoOreja = 0;
        this.orejaMovida = Math.random() < 0.5 ? 0 : 1;
      }
      if (this.tiempoOreja >= OREJA_DURACION) return 0;
      this.tiempoOreja += dt;
      const avance = Math.min(1, this.tiempoOreja / OREJA_DURACION);
      return Math.sin(avance * Math.PI) * Math.sin(avance * Math.PI * 3) * 0.22;
    }

    dibujarCuerpo(p, t) {
      this.grupo.rotation.y = p.giro;
      this.raiz.position.y = -0.55 + p.bajar;
      this.raiz.rotation.set(p.cabeceo, 0, p.inclinar);
      this.rodar.rotation.y = p.rodar;

      const respiro = Math.sin(t * RESPIRACION_VELOCIDAD);
      this.cuerpo.scale.set(1 + respiro * 0.018, 1.28 + respiro * 0.02, 0.92 + respiro * 0.018);
    }

    dibujarPatas(p, t) {
      this.delanteras.forEach(function (pata, i) {
        pata.hombro.rotation.x = p["hombro" + i];
        pata.codo.rotation.x = p["codo" + i];
      });
      this.traseras.forEach(function (pata) {
        pata.cadera.rotation.x = p.cadera;
        pata.rodilla.rotation.x = p.rodilla;
      });
    }

    dibujarCabeza(p, t, dt) {
      const raton = this.ctx.raton;
      const mezcla = 1 - Math.exp(-dt * MIRADA_VELOCIDAD);
      this.miradaX += (raton.x * 1.1 - this.miradaX) * mezcla;
      this.miradaY += (raton.y * 0.5 - this.miradaY) * mezcla;

      const lamido = Math.sin(t * LAMER_VELOCIDAD) * 0.1 * p.lamer;
      this.cabeza.position.y = 1.85 + p.cuello;
      this.cabeza.rotation.x = p.cabezaX + this.miradaY * p.mirada + lamido;
      this.cabeza.rotation.y = p.cabezaY + this.miradaX * p.mirada;
      this.cabeza.rotation.z = p.cabezaZ;

      const abierta = p.boca > 0.02;
      const tamano = Math.min(1, p.boca * 2.5);
      this.boca.visible = abierta;
      this.mandibula.visible = abierta;
      this.boca.scale.set(tamano, Math.max(0.01, p.boca), tamano);
      this.mandibula.scale.setScalar(Math.max(0.01, tamano));
      this.mandibula.rotation.x = p.boca * 0.85;
    }

    dibujarCaraYCola(p, t, dt) {
      const cierre = this.avanzarParpadeo(dt);
      const abierto = Math.max(0.08, p.ojos * (1 - cierre));
      const ojos = 1 + p.alerta * 0.25;
      this.ojos.forEach(function (ojoGato) {
        ojoGato.scale.set(ojos, abierto * ojos, 1);
      });

      const sacudida = this.avanzarOreja(dt);
      this.orejas.forEach(function (item, i) {
        const sacude = i === this.orejaMovida ? sacudida : 0;
        item.oreja.rotation.z = -0.2 * item.lado * (1 - p.alerta) + sacude;
        item.oreja.rotation.x = -p.orejasAtras;
        item.oreja.scale.y = 1 + p.alerta * 0.15;
      }, this);

      this.raizCola.rotation.z = -1.5 * (1 - p.colaCentro);
      this.raizCola.position.x = -0.9 + 0.7 * p.colaCentro;
      this.raizCola.rotation.x = -p.colaAlza;
      this.cola.forEach(function (eslabon, i) {
        eslabon.rotation.z = -0.24 * p.colaCurva + Math.sin(t * COLA_VELOCIDAD - i * 0.55) * (0.1 + i * 0.022);
      });

      // Se escala solo el primer eslabón: los demás lo heredan.
      const esponjada = 1 + p.alerta * 0.6;
      this.cola[0].scale.set(esponjada, 1, esponjada);
    }

    actualizar(t, dt) {
      // Con dt en 0 (movimiento reducido) se queda sentado y quieto.
      if (dt > 0) this.avanzarRutina(dt);

      const p = this.pose;
      this.dibujarCuerpo(p, t);
      this.dibujarPatas(p, t);
      this.dibujarCabeza(p, t, dt);
      this.dibujarCaraYCola(p, t, dt);
    }
  }

  window.Animales.Gato = Gato;
})();
