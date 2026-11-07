// Capa visual decorativa, independiente de los ejercicios.
// arana.js — Reto final. Camina sobre el "vidrio" de la pantalla, teje telarañas
// y caza la mosca que sigue al cursor.
// Usa una cámara plana donde 1 unidad = 1 píxel, así el recorrido calza con la ventana.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, bola, cono, tubo, en, giro, ojo, membrana } = util;

  const FEMUR = 64;
  const TIBIA = 76;
  const ALTURA_CUERPO = 36;
  const ALTURA_PASO = 26;
  const VELOCIDAD = 215;
  const DESCANSO = 6;

  // Cadera y punto de apoyo de cada pata, en píxeles desde el centro del cuerpo.
  const CADERAS = [[15, 9], [7, 13], [-2, 13], [-10, 9]];
  const ANGULOS = [38, 74, 112, 150];
  const ALCANCE = [112, 104, 104, 118];

  const ESQUINAS = ["arribaDerecha", "abajoDerecha", "abajoIzquierda", "arribaIzquierda"];

  // Caza: los radios y velocidades son píxeles y se multiplican por this.s.
  const RADIO_ALERTA = 220;
  const RADIO_SALIDA = 260;
  const RADIO_ESCAPE = 340;
  const RADIO_ATAQUE_CLIC = 220;
  const RADIO_CAPTURA = 46;
  const ESPERA_ATAQUE = 1.2;
  const VELOCIDAD_ATAQUE = 1500;
  const FRENO_ATAQUE = 3;
  const VELOCIDAD_REGRESO = 320;
  const TIEMPO_FRENADO = 0.7;
  const TIEMPO_CAPTURA = 0.6;
  const TIEMPO_REAPARICION = 3;

  // Mosca.
  const RETRASO_MOSCA = 2.4;
  const ZUMBIDO = 12;
  const ZUMBIDO_NERVIOSO = 30;
  const ALTURA_MOSCA = 160;

  // Puntos en el cuerpo de la araña, en píxeles desde su centro.
  const BOCA = new THREE.Vector2(46, 0);
  const PATA_ALZADA = [105, 38];
  const PATA_CERRADA = [58, 8];
  const ALTURA_PATA_ALZADA = 45;

  // Los clics en estos elementos no despiertan a la araña.
  const SIN_ATAQUE = "input, textarea, select, label";

  function materialHilo() {
    return new THREE.LineBasicMaterial({
      color: 0xe9dcd9,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });
  }

  class Arana extends Animal {
    constructor(ctx) {
      super(ctx);
      this.camara = new THREE.OrthographicCamera(0, 1, 0, -1, -900, 900);
      this.camara.position.z = 500;
      this.ancho = 0;
      this.alto = 0;
      this.s = 1;
      this.pos = new THREE.Vector2();
      this.rumbo = Math.PI;
      this.esquina = 0;
      this.telas = [];
      this.tela = null;
      this.etapa = "caminar";
      this.camino = [];
      this.tramo = 0;
      this.recorrido = 0;
      this.espera = 0;
      this.grupoActivo = 0;
      this.relojPaso = 0;
      this.crearCuerpo();
      this.crearPatas();

      // La caza solo mueve this.pos: etapa, tramo y recorrido quedan congelados.
      this.caza = null;
      this.retorno = null;
      this.tiempoCaza = 0;
      this.velocidadCaza = 0;
      this.velocidadPasos = 0;
      this.alzado = 0;
      this.cierre = 0;
      this.hilo = null;
      this.mosca = null;
      this.reaparicion = 0;
      this.cursor = { x: 0, y: 0, dentro: false };
      this.pieReal = new THREE.Vector3();
      this.conMosca = !ctx.sinMovimiento && !window.matchMedia("(hover: none)").matches;
      if (this.conMosca) this.escucharMouse();
    }

    crearCuerpo() {
      // Abdomen de viuda negra, pero rojo para que se vea sobre el fondo oscuro.
      const abdomen = en(this.grupo, bola(31, COLOR.rojo, [1.28, 1, 0.82]), -44, 0, 0);
      this.abdomen = abdomen;
      en(abdomen, cono(9, 15, COLOR.negro, 4), -7, 0, 25).rotation.z = Math.PI / 2;
      en(abdomen, cono(9, 15, COLOR.negro, 4), 7, 0, 25).rotation.z = -Math.PI / 2;
      en(this.grupo, bola(19, COLOR.vino, [1.15, 0.95, 0.72]), 2, 0, 2);
      en(this.grupo, bola(11, COLOR.rojo, [1, 0.95, 0.75]), 24, 0, 3);
      // Colmillos.
      [-5, 5].forEach(function (y) {
        const colmillo = en(this.grupo, cono(3, 12, COLOR.negro, 5), 37, y, 0);
        colmillo.rotation.z = -Math.PI / 2;
      }, this);
      // Ocho ojos en la frente.
      [[30, 5, 9, 2.6], [30, -5, 9, 2.6], [27, 9, 9, 2], [27, -9, 9, 2],
        [24, 4, 12, 1.9], [24, -4, 12, 1.9], [21, 8, 11, 1.6], [21, -8, 11, 1.6]].forEach(function (o) {
        en(this.grupo, ojo(o[3]), o[0], o[1], o[2]);
      }, this);
    }

    crearPatas() {
      this.patas = [];
      for (let lado = -1; lado <= 1; lado += 2) {
        for (let i = 0; i < 4; i++) {
          const angulo = (ANGULOS[i] * Math.PI) / 180;
          const pata = {
            cadera: new THREE.Vector2(CADERAS[i][0], CADERAS[i][1] * lado),
            casa: new THREE.Vector2(Math.cos(angulo) * ALCANCE[i], Math.sin(angulo) * ALCANCE[i] * lado),
            turno: (i + (lado > 0 ? 1 : 0)) % 2,
            pie: new THREE.Vector3(),
            desde: new THREE.Vector3(),
            hasta: new THREE.Vector3(),
            avance: 1,
            delantera: i === 0,
            femur: tubo(4.2, 3, 1, COLOR.rojo),
            tibia: tubo(3, 1.3, 1, COLOR.vino),
            rodilla: bola(4.6, COLOR.negro)
          };
          this.ctx.escena.add(pata.femur, pata.tibia, pata.rodilla);
          this.patas.push(pata);
        }
      }
    }

    ajustar(medidas) {
      const cambioAncho = medidas.ancho !== this.ancho;
      const primeraVez = this.ancho === 0;
      this.ancho = medidas.ancho;
      this.alto = medidas.alto;
      this.camara.left = 0;
      this.camara.right = medidas.ancho;
      this.camara.top = 0;
      this.camara.bottom = -medidas.alto;
      this.camara.updateProjectionMatrix();
      if (!cambioAncho) return;

      this.cancelarCaza();
      this.s = medidas.ancho < 700 ? 0.5 : 0.78;
      this.grupo.scale.setScalar(this.s);
      this.patas.forEach(function (pata) {
        pata.rodilla.scale.setScalar(this.s);
      }, this);

      this.telas.forEach(function (tela) { this.ctx.escena.remove(tela.linea); }, this);
      this.telas = [];
      this.tela = null;

      if (this.ctx.sinMovimiento) {
        this.pos.copy(this.centroDe(ESQUINAS[0]));
        this.rumbo = Math.PI * 0.75;
        this.ponerPies();
        const tela = this.crearTela(ESQUINAS[0]);
        tela.hecho = tela.puntos.length;
        this.dibujarHasta(tela, tela.puntos.length - 1, 0);
        this.etapa = "descansar";
        this.espera = Infinity;
        return;
      }

      if (primeraVez) {
        const centro = this.centroDe(ESQUINAS[0]);
        this.pos.set(medidas.ancho + 170 * this.s, centro.y);
        this.ponerPies();
        this.irA([centro]);
      } else {
        this.pos.copy(this.centroDe(ESQUINAS[this.esquina]));
        this.ponerPies();
        this.empezarTela();
      }
    }

    centroDe(esquina) {
      const margen = 112 * this.s;
      return new THREE.Vector2(
        esquina.indexOf("Derecha") !== -1 ? this.ancho - margen : margen,
        esquina.indexOf("arriba") === 0 ? margen : this.alto - margen
      );
    }

    /* ---------- Telaraña ---------- */

    crearTela(esquina) {
      const centro = this.centroDe(esquina);
      const borde = 5;
      const radio = Math.min(235, Math.min(this.ancho, this.alto) * 0.38);
      const radios = 12;
      const puntas = [];

      // Cada hilo llega hasta el borde de la ventana o hasta el radio máximo.
      for (let i = 0; i < radios; i++) {
        const angulo = ((i + 0.5) / radios) * Math.PI * 2;
        const dx = Math.cos(angulo);
        const dy = Math.sin(angulo);
        const hastaX = dx > 0 ? (this.ancho - borde - centro.x) / dx : (borde - centro.x) / dx;
        const hastaY = dy > 0 ? (this.alto - borde - centro.y) / dy : (borde - centro.y) / dy;
        const largo = Math.min(radio, hastaX, hastaY);
        puntas.push(new THREE.Vector2(centro.x + dx * largo, centro.y + dy * largo));
      }

      const puntos = [centro.clone()];
      // Radios de dos en dos: sale, cruza a la siguiente punta y vuelve al centro.
      for (let i = 0; i < radios; i += 2) {
        puntos.push(puntas[i], puntas[i + 1], centro);
      }
      // Marco exterior.
      puntos.push(puntas[0]);
      for (let i = 1; i <= radios; i++) puntos.push(puntas[i % radios]);

      // Espiral hacia adentro, con los hilos un poco colgados entre radios.
      const vueltas = 5;
      const pasos = vueltas * radios;
      const enRadio = function (i, fraccion) {
        return centro.clone().lerp(puntas[((i % radios) + radios) % radios], fraccion);
      };
      for (let i = 0; i < pasos; i++) {
        const f1 = 0.9 - 0.7 * (i / pasos);
        const f2 = 0.9 - 0.7 * ((i + 1) / pasos);
        const a = enRadio(i, f1);
        const b = enRadio(i + 1, f2);
        const medio = a.clone().lerp(b, 0.5).lerp(centro, 0.07);
        puntos.push(medio, b);
      }
      puntos.push(centro);

      const geometria = new THREE.BufferGeometry();
      const posiciones = new Float32Array(puntos.length * 3);
      puntos.forEach(function (punto, i) {
        posiciones[i * 3] = punto.x;
        posiciones[i * 3 + 1] = -punto.y;
      });
      geometria.setAttribute("position", new THREE.BufferAttribute(posiciones, 3));
      geometria.setDrawRange(0, 0);
      const linea = new THREE.Line(geometria, materialHilo());
      linea.frustumCulled = false;
      this.ctx.escena.add(linea);

      const tela = { linea, puntos, vieja: false };
      this.telas.push(tela);
      return tela;
    }

    // Muestra el hilo hasta el tramo actual y lo estira hasta donde va la araña.
    dibujarHasta(tela, tramo, fraccion) {
      const posicion = tela.linea.geometry.attributes.position;
      const siguiente = Math.min(tramo + 1, tela.puntos.length - 1);
      const a = tela.puntos[tramo];
      const b = tela.puntos[siguiente];
      posicion.setXY(tramo, a.x, -a.y);
      posicion.setXY(siguiente, a.x + (b.x - a.x) * fraccion, -(a.y + (b.y - a.y) * fraccion));
      posicion.needsUpdate = true;
      tela.linea.geometry.setDrawRange(0, siguiente + 1);
    }

    /* ---------- Recorridos ---------- */

    irA(destinos) {
      this.etapa = "caminar";
      this.camino = [this.pos.clone()].concat(destinos);
      this.tramo = 0;
      this.recorrido = 0;
    }

    empezarTela() {
      this.tela = this.crearTela(ESQUINAS[this.esquina]);
      this.etapa = "tejer";
      this.camino = this.tela.puntos;
      this.tramo = 0;
      this.recorrido = 0;
    }

    seguirCamino(dt) {
      let distancia = VELOCIDAD * this.s * (1 + 2 * this.energia) * dt;
      let fraccion = 0;
      while (this.tramo < this.camino.length - 1) {
        const a = this.camino[this.tramo];
        const b = this.camino[this.tramo + 1];
        const largo = a.distanceTo(b);
        if (largo > 0.01 && this.recorrido + distancia < largo) {
          this.recorrido += distancia;
          fraccion = this.recorrido / largo;
          this.pos.copy(a).lerp(b, fraccion);
          this.rumboDeseado = Math.atan2(-(b.y - a.y), b.x - a.x);
          return fraccion;
        }
        distancia -= largo - this.recorrido;
        this.recorrido = 0;
        this.tramo++;
      }
      this.pos.copy(this.camino[this.camino.length - 1]);
      return 1;
    }

    avanzarEtapa(dt) {
      if (this.etapa === "descansar") {
        this.espera -= dt;
        if (this.espera > 0) return false;
        this.telas.forEach(function (tela) { tela.vieja = true; });
        this.esquina = (this.esquina + 1) % ESQUINAS.length;
        this.irA([this.centroDe(ESQUINAS[this.esquina])]);
        return true;
      }

      const fraccion = this.seguirCamino(dt);
      const termino = this.tramo >= this.camino.length - 1;

      if (this.etapa === "tejer") {
        const tramo = Math.min(this.tramo, this.tela.puntos.length - 2);
        this.dibujarHasta(this.tela, tramo, termino ? 1 : fraccion);
        if (termino) {
          this.etapa = "descansar";
          this.espera = DESCANSO;
        }
      } else if (termino) {
        this.empezarTela();
      }
      return true;
    }

    /* ---------- Mosca ---------- */

    escucharMouse() {
      const cursor = this.cursor;
      window.addEventListener("pointermove", function (evento) {
        cursor.x = evento.clientX;
        cursor.y = evento.clientY;
        cursor.dentro = true;
      });
      document.documentElement.addEventListener("pointerleave", function () {
        cursor.dentro = false;
      });
      document.documentElement.addEventListener("pointerenter", function (evento) {
        cursor.x = evento.clientX;
        cursor.y = evento.clientY;
        cursor.dentro = true;
      });
      window.addEventListener("pointerdown", this.alHacerClic.bind(this));
    }

    alHacerClic(evento) {
      if (evento.target.closest && evento.target.closest(SIN_ATAQUE)) return;
      if (!this.moscaActiva() || this.caza === "ataque" || this.caza === "atrapar") return;
      const distancia = Math.hypot(evento.clientX - this.pos.x, evento.clientY - this.pos.y);
      if (distancia < RADIO_ATAQUE_CLIC * this.s) this.iniciarAtaque();
    }

    crearMosca() {
      const grupo = new THREE.Group();
      en(grupo, bola(7.5, COLOR.gris, [1.4, 0.9, 0.8]), -7, 0, 0);
      en(grupo, bola(6, COLOR.gris), 2, 0, 1);
      en(grupo, bola(4.6, COLOR.gris), 9, 0, 1);
      [-1, 1].forEach(function (lado) {
        en(grupo, bola(3.1, COLOR.rojo), 10.5, 3.6 * lado, 3);
      });

      const alas = [-1, 1].map(function (lado) {
        const pivote = giro(grupo, 1, 2 * lado, 5);
        const ala = en(pivote, membrana(5.5, 13), -2, 12 * lado, 0);
        ala.rotation.z = 0.35 * lado;
        return { pivote: pivote, lado: lado };
      });

      grupo.scale.setScalar(this.s);
      this.ctx.escena.add(grupo);

      const inicio = new THREE.Vector2(this.cursor.x + 40, this.cursor.y - 30);
      this.mosca = {
        grupo: grupo,
        alas: alas,
        base: inicio,
        pos: inicio.clone(),
        anterior: inicio.clone(),
        velocidad: new THREE.Vector2(),
        fase: 0,
        nervios: 0,
        atrapada: false,
        encogido: 0,
        oculta: false
      };
    }

    liberarMosca() {
      this.ctx.escena.remove(this.mosca.grupo);
      this.mosca.grupo.traverse(function (objeto) {
        if (!objeto.isMesh) return;
        objeto.geometry.dispose();
        objeto.material.dispose();
      });
      this.mosca = null;
      this.reaparicion = TIEMPO_REAPARICION;
    }

    moscaActiva() {
      return this.mosca !== null && !this.mosca.atrapada && this.cursor.dentro;
    }

    distanciaMosca() {
      return this.pos.distanceTo(this.mosca.pos);
    }

    actualizarMosca(t, dt) {
      if (!this.mosca) {
        this.reaparicion -= dt;
        if (this.reaparicion <= 0 && this.cursor.dentro) this.crearMosca();
        return;
      }

      const mosca = this.mosca;
      if (mosca.atrapada) {
        // Queda pegada a los colmillos mientras se encoge.
        mosca.encogido = Math.min(1, mosca.encogido + dt / TIEMPO_CAPTURA);
        const boca = this.aMundo(BOCA, Arana.E);
        mosca.pos.set(boca.x, -boca.y);
        mosca.grupo.position.set(boca.x, boca.y, ALTURA_MOSCA);
        mosca.grupo.scale.setScalar(this.s * (1 - mosca.encogido));
        return;
      }

      // Al volver a la ventana reaparece junto al cursor.
      if (!this.cursor.dentro) {
        mosca.oculta = true;
        mosca.grupo.visible = false;
        return;
      }
      if (mosca.oculta) {
        mosca.oculta = false;
        mosca.grupo.visible = true;
        mosca.base.set(this.cursor.x + 40, this.cursor.y - 30);
        mosca.pos.copy(mosca.base);
        mosca.anterior.copy(mosca.base);
      }

      const seguir = 1 - Math.exp(-dt * RETRASO_MOSCA);
      mosca.base.x += (this.cursor.x - mosca.base.x) * seguir;
      mosca.base.y += (this.cursor.y - mosca.base.y) * seguir;

      // Zumbido: varias frecuencias mezcladas para que no parezca un patrón.
      const meta = this.caza === "alerta" ? 1 : 0;
      mosca.nervios += (meta - mosca.nervios) * (1 - Math.exp(-dt * 6));
      mosca.fase += dt * (1 + mosca.nervios * 0.9);
      const f = mosca.fase;
      const zumbido = (ZUMBIDO + (ZUMBIDO_NERVIOSO - ZUMBIDO) * mosca.nervios) * this.s;
      mosca.pos.set(
        mosca.base.x + (Math.sin(f * 7.3) + Math.sin(f * 12.9 + 1) * 0.6 + Math.sin(f * 23.1 + 2) * 0.35) * zumbido,
        mosca.base.y + (Math.cos(f * 6.1 + 2) + Math.sin(f * 14.7) * 0.6 + Math.cos(f * 21.3 + 1) * 0.35) * zumbido
      );

      // Mira hacia donde se mueve.
      if (dt > 0) {
        const mezcla = 1 - Math.exp(-dt * 8);
        mosca.velocidad.x += ((mosca.pos.x - mosca.anterior.x) / dt - mosca.velocidad.x) * mezcla;
        mosca.velocidad.y += ((mosca.pos.y - mosca.anterior.y) / dt - mosca.velocidad.y) * mezcla;
      }
      mosca.anterior.copy(mosca.pos);
      if (mosca.velocidad.length() > 15) {
        const rumbo = Math.atan2(-mosca.velocidad.y, mosca.velocidad.x);
        const diferencia = rumbo - mosca.grupo.rotation.z;
        mosca.grupo.rotation.z += Math.atan2(Math.sin(diferencia), Math.cos(diferencia)) * (1 - Math.exp(-dt * 10));
      }

      mosca.grupo.position.set(mosca.pos.x, -mosca.pos.y, ALTURA_MOSCA);
      mosca.alas.forEach(function (ala) {
        ala.pivote.rotation.x = ala.lado * (0.55 + Math.sin(t * 95) * 0.5);
      });
    }

    /* ---------- Caza ---------- */

    mirarA(punto) {
      this.rumboDeseado = Math.atan2(-(punto.y - this.pos.y), punto.x - this.pos.x);
    }

    // Avanza hacia un punto sin pasarse. Devuelve true al llegar.
    moverHacia(destino, paso) {
      const distancia = this.pos.distanceTo(destino);
      if (distancia <= paso) {
        this.pos.copy(destino);
        return true;
      }
      this.pos.lerp(destino, paso / distancia);
      return false;
    }

    empezarAlerta() {
      if (!this.retorno) this.retorno = this.pos.clone();
      this.caza = "alerta";
      this.tiempoCaza = 0;
    }

    iniciarAtaque() {
      if (!this.retorno) this.retorno = this.pos.clone();
      if (!this.hilo) this.crearHilo();
      this.caza = "ataque";
      this.tiempoCaza = 0;
      this.velocidadCaza = VELOCIDAD_ATAQUE * this.s;
    }

    terminarCaza() {
      this.caza = null;
      this.retorno = null;
      this.velocidadPasos = 0;
      this.liberarHilo();
    }

    // Al cambiar el ancho las telarañas se rehacen y el punto guardado ya no sirve.
    cancelarCaza() {
      this.terminarCaza();
      if (this.mosca && this.mosca.atrapada) this.liberarMosca();
    }

    // Hilo de seguridad: une el punto donde dejó la telaraña con la araña.
    crearHilo() {
      const geometria = new THREE.BufferGeometry();
      geometria.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      this.hilo = new THREE.Line(geometria, materialHilo());
      this.hilo.frustumCulled = false;
      this.ctx.escena.add(this.hilo);
    }

    dibujarHilo() {
      const posicion = this.hilo.geometry.attributes.position;
      posicion.setXY(0, this.retorno.x, -this.retorno.y);
      posicion.setXY(1, this.pos.x, -this.pos.y);
      posicion.needsUpdate = true;
    }

    liberarHilo() {
      if (!this.hilo) return;
      this.ctx.escena.remove(this.hilo);
      this.hilo.geometry.dispose();
      this.hilo.material.dispose();
      this.hilo = null;
    }

    // Revisa si la mosca se acercó mientras la araña hace otra cosa.
    vigilarMosca() {
      if (this.moscaActiva() && this.distanciaMosca() < RADIO_ALERTA * this.s) this.empezarAlerta();
    }

    // Devuelve true si la araña se está desplazando.
    actualizarCaza(dt) {
      this.tiempoCaza += dt;

      if (this.caza === "alerta") {
        if (!this.moscaActiva() || this.distanciaMosca() > RADIO_SALIDA * this.s) {
          this.caza = "regresar";
        } else {
          this.mirarA(this.mosca.pos);
          if (this.tiempoCaza >= ESPERA_ATAQUE) this.iniciarAtaque();
        }
        return false;
      }

      if (this.caza === "ataque") {
        const perdida = !this.moscaActiva() || this.distanciaMosca() > RADIO_ESCAPE * this.s;
        if (perdida || this.velocidadCaza < VELOCIDAD * this.s) {
          this.caza = "frenar";
          this.tiempoCaza = 0;
          return true;
        }
        if (this.distanciaMosca() <= RADIO_CAPTURA * this.s) {
          this.mosca.atrapada = true;
          this.caza = "atrapar";
          this.tiempoCaza = 0;
          return false;
        }
        // Arranque brusco: sale con toda la velocidad y se va frenando.
        this.mirarA(this.mosca.pos);
        this.moverHacia(this.mosca.pos, this.velocidadCaza * dt);
        this.velocidadCaza *= Math.exp(-dt * FRENO_ATAQUE);
        this.velocidadPasos = this.velocidadCaza;
        return true;
      }

      if (this.caza === "frenar") {
        // Sigue un poco por la inercia y se queda quieta.
        this.velocidadCaza *= Math.exp(-dt * 12);
        this.velocidadPasos = this.velocidadCaza;
        this.pos.x += Math.cos(this.rumbo) * this.velocidadCaza * dt;
        this.pos.y -= Math.sin(this.rumbo) * this.velocidadCaza * dt;
        if (this.tiempoCaza >= TIEMPO_FRENADO) {
          this.caza = "regresar";
          this.vigilarMosca();
        }
        return this.velocidadCaza > 20;
      }

      if (this.caza === "atrapar") {
        if (this.tiempoCaza >= TIEMPO_CAPTURA) {
          this.liberarMosca();
          this.caza = "regresar";
        }
        return false;
      }

      // Regresar: vuelve derecho al punto exacto donde dejó lo que hacía.
      this.vigilarMosca();
      if (this.caza !== "regresar") return false;
      this.mirarA(this.retorno);
      this.velocidadPasos = VELOCIDAD_REGRESO * this.s;
      if (this.moverHacia(this.retorno, this.velocidadPasos * dt)) this.terminarCaza();
      return true;
    }

    /* ---------- Patas ---------- */

    aMundo(local, destino) {
      const c = Math.cos(this.rumbo);
      const s = Math.sin(this.rumbo);
      const x = local.x * this.s;
      const y = local.y * this.s;
      return destino.set(this.pos.x + x * c - y * s, -this.pos.y + x * s + y * c, 0);
    }

    ponerPies() {
      this.patas.forEach(function (pata) {
        this.aMundo(pata.casa, pata.pie);
        pata.avance = 1;
      }, this);
    }

    darPasos(dt, moviendose, velocidad) {
      // A más velocidad, pasos más cortos para que las patas no queden atrás.
      const normal = VELOCIDAD * this.s;
      const duracion = (0.15 / (1 + this.energia)) * Math.min(1, normal / Math.max(velocidad, 1));
      this.relojPaso += dt;
      if (this.relojPaso >= duracion) {
        this.relojPaso = 0;
        this.grupoActivo = 1 - this.grupoActivo;
        const adelanto = moviendose ? velocidad * duracion * 1.3 : 0;
        const objetivo = new THREE.Vector3();
        this.patas.forEach(function (pata) {
          if (pata.turno !== this.grupoActivo) return;
          this.aMundo(pata.casa, objetivo);
          objetivo.x += Math.cos(this.rumbo) * adelanto;
          objetivo.y += Math.sin(this.rumbo) * adelanto;
          if (objetivo.distanceTo(pata.pie) > 12 * this.s) {
            pata.desde.copy(pata.pie);
            pata.hasta.copy(objetivo);
            pata.avance = 0;
          }
        }, this);
      }

      this.patas.forEach(function (pata) {
        if (pata.avance >= 1) return;
        pata.avance = Math.min(1, pata.avance + dt / duracion);
        pata.pie.lerpVectors(pata.desde, pata.hasta, pata.avance);
        pata.pie.z = Math.sin(pata.avance * Math.PI) * ALTURA_PASO * this.s;
      }, this);
    }

    colocarHueso(hueso, desde, hasta, grosor) {
      const eje = this.eje || (this.eje = new THREE.Vector3());
      eje.subVectors(hasta, desde);
      const largo = eje.length();
      hueso.position.copy(desde).addScaledVector(eje, 0.5);
      hueso.scale.set(grosor, largo, grosor);
      hueso.quaternion.setFromUnitVectors(Arana.ARRIBA, eje.normalize());
    }

    // Cinemática inversa: dada la cadera y el pie, calcula dónde queda la rodilla.
    dibujarPata(pata, alturaCuerpo) {
      const femur = FEMUR * this.s;
      const tibia = TIBIA * this.s;
      const cadera = this.aMundo(pata.cadera, Arana.A);
      cadera.z = alturaCuerpo;
      const hacia = Arana.B.subVectors(pata.pie, cadera);
      const d = Math.min(hacia.length(), femur + tibia - 1);
      hacia.normalize();
      const base = (femur * femur - tibia * tibia + d * d) / (2 * d);
      const alto = Math.sqrt(Math.max(0, femur * femur - base * base));
      const subir = Arana.C.set(0, 0, 1).addScaledVector(hacia, -hacia.z).normalize();
      const rodilla = Arana.D.copy(cadera).addScaledVector(hacia, base).addScaledVector(subir, alto);
      this.colocarHueso(pata.femur, cadera, rodilla, this.s);
      this.colocarHueso(pata.tibia, rodilla, pata.pie, this.s);
      pata.rodilla.position.copy(rodilla);
    }

    // Lleva el pie hacia la mosca; al cerrarse lo acerca a la boca.
    alzarPata(pata, altura) {
      const lado = Math.sign(pata.cadera.y);
      const x = PATA_ALZADA[0] + (PATA_CERRADA[0] - PATA_ALZADA[0]) * this.cierre;
      const y = PATA_ALZADA[1] + (PATA_CERRADA[1] - PATA_ALZADA[1]) * this.cierre;
      const destino = this.aMundo(Arana.F.set(x, y * lado), Arana.E);
      destino.z = altura + ALTURA_PATA_ALZADA * this.s;
      pata.pie.lerp(destino, this.alzado);
    }

    // Suaviza la postura de caza: patas alzadas, cuerpo abajo y patas cerradas.
    actualizarPostura(dt) {
      const caza = this.caza;
      let metaAlzado = 0;
      if (caza === "alerta" || caza === "ataque" || caza === "atrapar") metaAlzado = 1;
      if (caza === "frenar") metaAlzado = 0.7;
      this.alzado += (metaAlzado - this.alzado) * (1 - Math.exp(-dt * 9));

      const cerca = caza === "ataque" && this.moscaActiva() && this.distanciaMosca() < 100 * this.s;
      const metaCierre = cerca || caza === "atrapar" ? 1 : 0;
      this.cierre += (metaCierre - this.cierre) * (1 - Math.exp(-dt * 14));
    }

    actualizar(t, dt) {
      if (this.conMosca) this.actualizarMosca(t, dt);
      if (this.conMosca && !this.caza) this.vigilarMosca();
      const moviendose = this.caza ? this.actualizarCaza(dt) : this.avanzarEtapa(dt);
      if (this.hilo) this.dibujarHilo();
      this.actualizarPostura(dt);

      // Las telarañas viejas se van borrando.
      this.telas = this.telas.filter(function (tela) {
        if (!tela.vieja) return true;
        tela.linea.material.opacity -= dt * 0.05;
        if (tela.linea.material.opacity > 0) return true;
        this.ctx.escena.remove(tela.linea);
        tela.linea.geometry.dispose();
        return false;
      }, this);

      if ((moviendose || this.caza === "alerta") && this.rumboDeseado !== undefined) {
        let diferencia = this.rumboDeseado - this.rumbo;
        diferencia = Math.atan2(Math.sin(diferencia), Math.cos(diferencia));
        this.rumbo += diferencia * (1 - Math.exp(-dt * 11));
      }

      this.darPasos(dt, moviendose, this.caza ? this.velocidadPasos : VELOCIDAD * this.s);

      // La cámara mira desde arriba: al agacharse también se encoge un poco.
      const altura = (ALTURA_CUERPO * (1 - this.alzado * 0.35) + Math.sin(t * 2.2) * 1.5) * this.s;
      this.grupo.position.set(this.pos.x, -this.pos.y, altura);
      this.grupo.rotation.z = this.rumbo;
      this.grupo.scale.setScalar(this.s * (1 - this.alzado * 0.08));
      const temblor = this.caza === "alerta" ? Math.sin(t * 42) * 0.07 : 0;
      this.abdomen.rotation.z = Math.sin(t * 1.7) * 0.05 + temblor;

      this.patas.forEach(function (pata) {
        if (!pata.delantera || this.alzado < 0.01) {
          this.dibujarPata(pata, altura);
          return;
        }
        // Solo cambia el pie para dibujar; el paso real sigue en su sitio.
        this.pieReal.copy(pata.pie);
        this.alzarPata(pata, altura);
        this.dibujarPata(pata, altura);
        pata.pie.copy(this.pieReal);
      }, this);
    }
  }

  Arana.ARRIBA = new THREE.Vector3(0, 1, 0);
  Arana.A = new THREE.Vector3();
  Arana.B = new THREE.Vector3();
  Arana.C = new THREE.Vector3();
  Arana.D = new THREE.Vector3();
  Arana.E = new THREE.Vector3();
  Arana.F = new THREE.Vector2();

  window.Animales.Arana = Arana;
})();
