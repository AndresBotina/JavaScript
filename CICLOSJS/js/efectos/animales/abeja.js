// Capa visual decorativa, independiente de los ejercicios.
// abeja.js — Ejercicio 7. La obrera: flota un rato y vuela con suavidad a un punto cercano.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, hueso, ojo, en, giro, membrana } = util;

  // Patrón de vuelo.
  const TIEMPO_FLOTAR_MIN = 2.5;
  const TIEMPO_FLOTAR_MAX = 5;
  const DISTANCIA_MIN = 1.3;
  const DISTANCIA_MAX = 3;
  const DURACION_DESPLAZAR = 1.7;
  const DURACION_REACCION = 0.75;
  const DISTANCIA_REACCION = 2.2;

  // Zona de vuelo: los destinos quedan dentro y dejan margen para la deriva.
  const ZONA_X = 2.4;
  const ZONA_Y = 1.25;
  const ZONA_Z = 0.4;

  // Inercia: resorte amortiguado que persigue al objetivo.
  const RIGIDEZ = 14;
  const AMORTIGUACION = 7.5;

  // Flotar: figura de 8 lenta y balanceo de arriba abajo.
  const DERIVA_ANCHO = 0.3;
  const DERIVA_ALTO = 0.14;
  const DERIVA_VELOCIDAD = 0.7;
  const BALANCEO = 0.07;
  const BALANCEO_VELOCIDAD = 2.6;

  // Orientación e inclinación, en radianes.
  const VISTA = 0.45;
  const VELOCIDAD_GIRO = 3.2;
  const INCLINACION_MAX = 0.38;
  const INCLINACION_POR_VELOCIDAD = 0.22;
  const LADEO_MAX = 0.4;
  const LADEO_POR_GIRO = 0.22;
  const SUAVIDAD_POSTURA = 6;

  // Alas siempre iguales, y partes que siguen el movimiento con retraso.
  const ALETEO_VELOCIDAD = 130;
  const ALETEO_AMPLITUD = 0.2;
  const ALETEO_ALTURA = 0.5;
  const RETRASO_SECUNDARIOS = 5;

  function limitar(valor, maximo) {
    return Math.max(-maximo, Math.min(maximo, valor));
  }

  // Curva que arranca y frena sin saltos.
  function suavizar(x) {
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  // Parte de la distancia que se recorre hacia una meta en este cuadro.
  function mezcla(rapidez, dt) {
    return 1 - Math.exp(-dt * rapidez);
  }

  class Abeja extends Animal {
    constructor(ctx) {
      super(ctx);
      this.ampliar = 1;
      this.fase = 0;
      this.estado = "flotar";
      this.espera = TIEMPO_FLOTAR_MIN;
      this.flotacion = 1;

      this.ancla = new THREE.Vector3(0.6, 0, 0);
      this.desde = new THREE.Vector3();
      this.hasta = new THREE.Vector3();
      this.avance = 0;
      this.duracion = DURACION_DESPLAZAR;
      this.objetivo = new THREE.Vector3();
      this.pos = this.ancla.clone();
      this.velocidad = new THREE.Vector3();

      this.rumbo = -Math.atan2(VISTA, 1);
      this.rumboDeseado = this.rumbo;
      this.velocidadGiro = 0;
      this.inclinacion = 0;
      this.ladeo = 0;
      this.pesoInclinacion = 0;
      this.pesoGiro = 0;
      this.pesoAvance = 0;
      this.pesoSubida = 0;

      // Primero gira, luego cabecea y por último se ladea sobre su eje.
      this.grupo.rotation.order = "YZX";

      this.cuerpo = giro(this.grupo, 0, 0, 0);
      en(this.cuerpo, bola(0.62, COLOR.gris), 0.1, 0, 0);
      // El abdomen cuelga de la cintura para moverse con retraso.
      this.abdomen = giro(this.cuerpo, -0.35, -0.04, 0);
      const anillos = [[-0.23, 0.68, COLOR.rojo], [-0.63, 0.72, COLOR.gris], [-1.03, 0.64, COLOR.rojo], [-1.39, 0.46, COLOR.gris]];
      anillos.forEach(function (anillo) {
        en(this.abdomen, bola(anillo[1], anillo[2], [0.62, 1, 1]), anillo[0], 0, 0);
      }, this);

      const aguijon = en(this.abdomen, cono(0.12, 0.5, COLOR.crema, 5), -1.85, 0, 0);
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
      this.dentroDeZona(this.ancla);
      this.dentroDeZona(this.hasta);
    }

    reaccionar() {
      super.reaccionar();
      this.iniciarDesplazar(DURACION_REACCION, DISTANCIA_REACCION);
    }

    dentroDeZona(punto) {
      const ancho = ZONA_X * this.ampliar;
      punto.x = limitar(punto.x, ancho);
      punto.y = limitar(punto.y, ZONA_Y);
      punto.z = limitar(punto.z, ZONA_Z);
    }

    // Busca un punto de la zona que quede a una distancia cómoda del actual.
    elegirDestino(destino, distanciaMinima) {
      const ancho = ZONA_X * this.ampliar;
      const minimo = distanciaMinima * this.ampliar;
      const maximo = Math.max(DISTANCIA_MAX, distanciaMinima + 1) * this.ampliar;
      for (let intento = 0; intento < 20; intento++) {
        destino.set(
          (Math.random() * 2 - 1) * ancho,
          (Math.random() * 2 - 1) * ZONA_Y,
          (Math.random() * 2 - 1) * ZONA_Z
        );
        const distancia = destino.distanceTo(this.ancla);
        if (distancia >= minimo && distancia <= maximo) return;
      }
    }

    iniciarDesplazar(duracion, distanciaMinima) {
      this.estado = "desplazar";
      this.avance = 0;
      this.duracion = duracion;
      this.desde.copy(this.ancla);
      this.elegirDestino(this.hasta, distanciaMinima);

      // Mira hacia el destino; si solo sube o baja, conserva su orientación.
      const haciaX = this.hasta.x - this.desde.x;
      const haciaZ = this.hasta.z - this.desde.z;
      if (Math.abs(haciaX) > 0.3) {
        this.rumboDeseado = -Math.atan2(haciaZ + Math.abs(haciaX) * VISTA, haciaX);
      }
    }

    avanzarVuelo(dt) {
      if (this.estado === "flotar") {
        this.espera -= dt;
        if (this.espera <= 0) this.iniciarDesplazar(DURACION_DESPLAZAR, DISTANCIA_MIN);
      } else {
        this.avance = Math.min(1, this.avance + dt / this.duracion);
        this.ancla.lerpVectors(this.desde, this.hasta, suavizar(this.avance));
        if (this.avance >= 1) {
          this.estado = "flotar";
          this.espera = TIEMPO_FLOTAR_MIN + Math.random() * (TIEMPO_FLOTAR_MAX - TIEMPO_FLOTAR_MIN);
        }
      }

      // La deriva se apaga poco a poco al viajar y vuelve al llegar.
      const meta = this.estado === "flotar" ? 1 : 0;
      this.flotacion += (meta - this.flotacion) * mezcla(2, dt);
      this.fase += dt;
    }

    moverCuerpo(dt) {
      const f = this.fase * DERIVA_VELOCIDAD;
      const balanceo = Math.sin(this.fase * BALANCEO_VELOCIDAD) * BALANCEO;
      this.objetivo.set(
        this.ancla.x + Math.sin(f) * DERIVA_ANCHO * this.ampliar * this.flotacion,
        this.ancla.y + (Math.sin(f * 2) * DERIVA_ALTO + balanceo) * this.flotacion,
        this.ancla.z
      );

      // Solo el resorte mueve la posición: nunca se asigna directo desde un seno.
      const v = this.velocidad;
      v.x += (RIGIDEZ * (this.objetivo.x - this.pos.x) - AMORTIGUACION * v.x) * dt;
      v.y += (RIGIDEZ * (this.objetivo.y - this.pos.y) - AMORTIGUACION * v.y) * dt;
      v.z += (RIGIDEZ * (this.objetivo.z - this.pos.z) - AMORTIGUACION * v.z) * dt;
      this.pos.addScaledVector(v, dt);
    }

    orientar(dt) {
      const diferencia = this.rumboDeseado - this.rumbo;
      const corta = Math.atan2(Math.sin(diferencia), Math.cos(diferencia));
      const giro = corta * mezcla(VELOCIDAD_GIRO, dt);
      this.rumbo += giro;
      this.velocidadGiro += (giro / dt - this.velocidadGiro) * mezcla(SUAVIDAD_POSTURA, dt);

      // Se inclina según lo que avanza hacia su frente y se ladea en las curvas.
      const avance = this.velocidad.x * Math.cos(this.rumbo) - this.velocidad.z * Math.sin(this.rumbo);
      const inclinacion = -limitar(avance * INCLINACION_POR_VELOCIDAD, INCLINACION_MAX);
      const ladeo = -limitar(this.velocidadGiro * LADEO_POR_GIRO, LADEO_MAX);
      this.inclinacion += (inclinacion - this.inclinacion) * mezcla(SUAVIDAD_POSTURA, dt);
      this.ladeo += (ladeo - this.ladeo) * mezcla(SUAVIDAD_POSTURA, dt);

      const retraso = mezcla(RETRASO_SECUNDARIOS, dt);
      this.pesoInclinacion += (this.inclinacion - this.pesoInclinacion) * retraso;
      this.pesoGiro += (this.velocidadGiro - this.pesoGiro) * retraso;
      this.pesoAvance += (avance - this.pesoAvance) * retraso;
      this.pesoSubida += (this.velocidad.y - this.pesoSubida) * retraso;
    }

    actualizar(t, dt) {
      // Con dt en 0 (movimiento reducido) se dibuja la pose quieta.
      if (dt > 0) {
        this.avanzarVuelo(dt);
        this.moverCuerpo(dt);
        this.orientar(dt);
      }

      this.grupo.position.copy(this.pos);
      this.grupo.rotation.set(this.ladeo, this.rumbo, this.inclinacion);

      this.abdomen.rotation.z = limitar((this.pesoInclinacion - this.inclinacion) * 0.7 + this.pesoSubida * 0.05, 0.3);
      this.abdomen.rotation.y = limitar(this.pesoGiro * 0.1, 0.25);

      this.alas.forEach(function (item) {
        item.pivote.rotation.x = item.lado * (Math.sin(t * ALETEO_VELOCIDAD) * ALETEO_AMPLITUD - ALETEO_ALTURA);
      });

      const empuje = limitar(this.pesoAvance * 0.1, 0.3);
      this.antenas.forEach(function (antena, i) {
        antena.rotation.z = 0.4 + empuje + Math.sin(t * 1.7 + i) * 0.04;
      });
    }
  }

  window.Animales.Abeja = Abeja;
})();
