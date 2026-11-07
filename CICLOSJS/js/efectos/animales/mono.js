// Capa visual decorativa, independiente de los ejercicios.
// mono.js — Ejercicio 6. Mono araña que se balancea de bejuco en bejuco.
// La mano hace de péndulo; al soltarse vuela en un arco real hasta el siguiente bejuco.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, material, bola, caja, hueso, ojo, en, giro, molde, extremidad } = util;

  // Física del balanceo.
  const GRAVEDAD = 9;
  const AMORTIGUACION = 0.08;
  const FUERZA_IMPULSO = 1.2;
  const FRENO_FINAL = 7;
  const ANGULO_SOLTAR = 0.1;
  const ANGULO_MAX = 0.6;
  const SEPARACION_NORMAL = 3.2;
  const VUELO_IDEAL = 0.42;
  const VUELO_MIN = 0.15;
  const VUELO_MAX = 0.65;
  const PASADO_MAX = 0.9;
  const ASISTENCIA_MAX = 0.6;
  const RETENCION_AGARRE = 0.85;

  // Bejucos.
  const ALTURA_ANCLA = 4.9;
  const LARGO_BEJUCO = 4.4;
  const AGARRE = 3;
  const AGARRE_MIN = 2.6;
  const AGARRE_MAX = 3.7;
  const AGARRE_COLA = 1.2;
  const VELOCIDAD_TREPAR = 0.9;
  const MARGEN_LADOS = 3.1;
  const CORRIMIENTO_ESCRITORIO = 0.7;
  const ALTO_ESCRITORIO = 260;
  const ANCHO_PARA_CINCO = 9;
  const CURVA_PESO = 0.16;
  const AMORTIGUACION_LIBRE = 0.85;
  const SEGMENTOS_BEJUCO = 10;

  // Pausas y comportamientos.
  const PROBABILIDAD_PAUSA = 0.5;
  const PROBABILIDAD_ENROSCAR = 0.3;
  const TIEMPO_PAUSA_MIN = 3.5;
  const TIEMPO_PAUSA_MAX = 6;
  const DURACION_SALUDO = 3;
  const DURACION_COLGARSE = 1.8;
  const DURACION_RETOMAR = 1.6;

  // Seguimiento con retraso.
  const RIGIDEZ_CUERPO = 18;
  const FRENO_CUERPO = 8;
  const RETRASO_PIERNAS = 5;
  const RETRASO_COLA = 3;

  // Medidas del mono.
  const LARGO_BRAZO = 0.95;
  const ALCANCE = LARGO_BRAZO * 2 - 0.05;
  const DISTANCIA_COLGADO = ALCANCE * 0.84;
  const ALTURA_MANO_VUELO = 1.5;
  const ESLABONES = 10;
  const LARGO_ESLABON = 0.27;
  const ESLABONES_RECTOS = 7;
  const BASE_COLA = -1.3;
  const LARGO_COLGADO = -BASE_COLA + ESLABONES_RECTOS * LARGO_ESLABON;

  // Perfiles de las extremidades: [t, radio], del cuerpo hacia la punta.
  const PERFIL_BRAZO = [[0, 0.07], [0.07, 0.15], [0.3, 0.165], [0.62, 0.13], [0.92, 0.1], [1, 0.06]];
  const PERFIL_ANTEBRAZO = [[0, 0.06], [0.08, 0.105], [0.3, 0.112], [0.68, 0.085], [0.94, 0.07], [1, 0.055]];
  const PERFIL_MUSLO = [[0, 0.1], [0.1, 0.17], [0.38, 0.175], [0.74, 0.125], [0.95, 0.095], [1, 0.06]];
  const PERFIL_PIERNA = [[0, 0.06], [0.1, 0.1], [0.34, 0.11], [0.74, 0.075], [0.95, 0.06], [1, 0.04]];
  const PERFIL_DEDO = [[0, 0.03], [0.2, 0.04], [0.8, 0.034], [1, 0.016]];
  const SOLAPE = 0.08;

  // Torso: [altura, 0, fondo, ancho], de las caderas al cuello.
  const TORSO = [
    [-1.44, 0, 0.09, 0.12], [-1.28, 0, 0.23, 0.32], [-1.06, 0, 0.27, 0.36], [-0.82, 0, 0.27, 0.3],
    [-0.58, 0, 0.23, 0.24], [-0.34, 0, 0.28, 0.32], [-0.08, 0, 0.31, 0.41], [0.1, 0, 0.23, 0.43], [0.24, 0, 0.1, 0.14]
  ];

  // Dedos: cuánto se cierran. Sobre el bejuco quedan enganchados.
  const MANO_AGARRA = 1;
  const MANO_RELAJADA = 0.55;
  const MANO_ABIERTA = 0.08;
  const MANO_RAPIDEZ = 16;
  const RADIO_GANCHO = 0.07;

  const ARRIBA = new THREE.Vector3(0, 1, 0);

  function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, valor));
  }

  function suavizar(x) {
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  function mezcla(rapidez, dt) {
    return 1 - Math.exp(-dt * rapidez);
  }

  function entre(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo);
  }

  class Mono extends Animal {
    constructor(ctx) {
      super(ctx);
      this.grupo.rotation.order = "ZYX";

      this.t = 0;
      this.estado = "balancear";
      this.sentido = 1;
      this.indice = 0;
      this.cantidad = 5;
      this.anguloMax = ANGULO_MAX;
      this.mano = 0;
      this.manoAgarrada = 0;
      this.agarre = AGARRE;
      this.pendienteSaludo = false;
      this.punto2 = new THREE.Vector3();
      this.punto3 = new THREE.Vector3();
      this.asistencia = 0;
      this.fallos = 0;

      this.hombros = new THREE.Vector3();
      this.velocidad = new THREE.Vector3();
      this.anterior = new THREE.Vector3();
      this.punto = new THREE.Vector3();
      this.auxiliar = new THREE.Vector3();

      // angulo: línea del brazo. rotacion: lo que se ve del cuerpo, con retraso.
      this.angulo = 0;
      this.velocidadAngulo = 0;
      this.distancia = DISTANCIA_COLGADO;
      this.rotacion = 0;
      this.velocidadRotacion = 0;
      this.mirada = 0.6;

      this.tiempoVuelo = 0;
      this.tiempoCola = 0;
      this.duracionCola = 0;
      this.modoCola = "pausa";
      this.gesto = "aplaudir";
      this.colaRecta = 0;
      this.enrosque = 0;
      this.metaEnrosque = 0;
      this.desde = new THREE.Vector3();
      this.rotacionDesde = 0;
      this.rotacionMeta = 0;
      this.pesoPiernas = 0;
      this.pesoCola = new Array(ESLABONES).fill(0);
      this.ladoCola = -1;

      this.crearBejucos();
      this.crearCuerpo();
      this.crearCabeza();
      this.crearPiernas();
      this.crearCola();
      this.crearBrazos();
    }

    /* ---------- Modelo ---------- */

    crearBejucos() {
      const mat = material(COLOR.gris);
      this.bejucos = [];
      for (let i = 0; i < 5; i++) {
        const tramos = [];
        for (let j = 0; j < SEGMENTOS_BEJUCO; j++) {
          const tramo = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 1, 5), mat);
          this.ctx.escena.add(tramo);
          tramos.push(tramo);
        }
        this.bejucos.push({
          x: 0, angulo: 0, velocidad: 0, curva: 0, libre: 1,
          fase: i * 1.7, tramos: tramos, puntos: []
        });
        for (let j = 0; j <= SEGMENTOS_BEJUCO; j++) this.bejucos[i].puntos.push(new THREE.Vector3());
      }
    }

    crearCuerpo() {
      const torso = en(this.grupo, molde(TORSO, COLOR.rojo, 12));
      torso.rotation.z = Math.PI / 2;
      en(this.grupo, bola(0.24, COLOR.vino, [0.85, 1.4, 0.3]), 0, -0.82, 0.19);
    }

    crearCabeza() {
      this.cabeza = giro(this.grupo, 0, 0.5, 0.04);
      en(this.cabeza, bola(0.52, COLOR.rojo));
      en(this.cabeza, bola(0.4, COLOR.rosa, [1.02, 0.94, 0.45]), 0, -0.03, 0.34);
      en(this.cabeza, bola(0.2, COLOR.crema, [1.1, 0.72, 0.6]), 0, -0.16, 0.46);
      en(this.cabeza, caja(0.2, 0.018, 0.02, COLOR.negro), 0, -0.2, 0.585);
      [-1, 1].forEach(function (lado) {
        en(this.cabeza, ojo(0.085), 0.17 * lado, 0.07, 0.49);
        en(this.cabeza, bola(0.17, COLOR.vino, [0.45, 1, 1]), 0.53 * lado, 0.02, 0);
      }, this);
    }

    crearPiernas() {
      this.piernas = [-1, 1].map(function (lado) {
        const cadera = giro(this.grupo, 0.21 * lado, -1.24, 0);
        en(cadera, extremidad(PERFIL_MUSLO, COLOR.rojo, 9, { desdeArriba: 0.66, solape: SOLAPE }));
        const rodilla = giro(cadera, 0, -0.64, 0);
        en(rodilla, extremidad(PERFIL_PIERNA, COLOR.rojo, 9, { desdeArriba: 0.58, solape: SOLAPE }));

        // Pie alargado con dedos que se curvan para agarrar.
        const pie = giro(rodilla, 0, -0.58, 0);
        const planta = en(pie, extremidad([[0, 0.05], [0.25, 0.1], [0.75, 0.1], [1, 0.05]], COLOR.vino, 8, { desdeArriba: 0.26, plano: 0.55 }));
        planta.rotation.x = -Math.PI / 2;
        const dedos = [-1.5, -0.5, 0.5, 1.5].map(function (posicion) {
          return this.crearDedo(pie, posicion * 0.05, 0, 0.24, COLOR.vino);
        }, this);
        return { cadera: cadera, rodilla: rodilla, pie: pie, lado: lado, dedos: dedos };
      }, this);
    }

    // Dedo de dos falanges que nace hacia +Z.
    crearDedo(padre, x, y, z, color) {
      const base = giro(padre, x, y, z);
      const primera = en(base, extremidad(PERFIL_DEDO, color, 5, { desdeArriba: 0.12 }));
      primera.rotation.x = -Math.PI / 2;
      const punta = giro(base, 0, 0, 0.11);
      const segunda = en(punta, extremidad(PERFIL_DEDO, color, 5, { desdeArriba: 0.11 }));
      segunda.rotation.x = -Math.PI / 2;
      return { base: base, punta: punta };
    }

    crearCola() {
      this.cola = [];
      let padre = giro(this.grupo, 0, BASE_COLA, -0.16);
      for (let i = 0; i < ESLABONES; i++) {
        const eslabon = giro(padre, 0, i === 0 ? 0 : -LARGO_ESLABON, 0);
        const grosor = 0.085 - i * 0.0055;
        en(eslabon, hueso(grosor, grosor - 0.005, LARGO_ESLABON + 0.03, i % 2 ? COLOR.vino : COLOR.rojo));
        this.cola.push(eslabon);
        padre = eslabon;
      }
    }

    // Los brazos viven en la escena: los coloca la cinemática inversa.
    crearBrazos() {
      this.brazos = [-1, 1].map(function (lado) {
        const brazo = {
          lado: lado,
          superior: extremidad(PERFIL_BRAZO, COLOR.rojo, 9, { solape: SOLAPE }),
          inferior: extremidad(PERFIL_ANTEBRAZO, COLOR.rojo, 9, { solape: SOLAPE }),
          mano: new THREE.Group(),
          dedos: [],
          cierre: MANO_RELAJADA,
          codo: new THREE.Vector3(),
          hombro: new THREE.Vector3(),
          pos: new THREE.Vector3(),
          meta: new THREE.Vector3()
        };

        // Mano en gancho: palma alargada y cuatro dedos, sin pulgar.
        const palma = en(brazo.mano, extremidad([[0, 0.05], [0.2, 0.085], [0.8, 0.085], [1, 0.05]], COLOR.vino, 7, { plano: 0.55 }), RADIO_GANCHO * 0.8, 0.09, 0);
        palma.scale.y = 0.36;
        [0, 1, 2, 3].forEach(function (i) {
          brazo.dedos.push(this.crearDedo(brazo.mano, RADIO_GANCHO, 0.01 + i * 0.066, 0, COLOR.vino));
        }, this);

        this.ctx.escena.add(brazo.superior, brazo.inferior, brazo.mano);
        return brazo;
      }, this);
    }

    /* ---------- Bejucos ---------- */

    ajustar(medidas) {
      const cantidad = medidas.medioAncho >= ANCHO_PARA_CINCO ? 5 : 4;
      const lado = medidas.medioAncho - MARGEN_LADOS;
      this.cantidad = cantidad;

      // Con bejucos más juntos se balancea menos, para no pasarse de largo.
      const separacion = (lado * 2) / (cantidad - 1);
      this.anguloMax = ANGULO_MAX * Math.min(1, separacion / SEPARACION_NORMAL);

      // En escritorio el título ocupa la izquierda: la escena se corre un poco.
      const corrimiento = medidas.alto >= ALTO_ESCRITORIO ? CORRIMIENTO_ESCRITORIO : 0;
      this.bejucos.forEach(function (bejuco, i) {
        const visible = i < cantidad;
        bejuco.x = corrimiento - lado + (i / (cantidad - 1)) * lado * 2;
        bejuco.tramos.forEach(function (tramo) { tramo.visible = visible; });
      });

      // Con otro ancho los bejucos cambian de sitio: vuelve a colgarse quieto.
      this.indice = Math.min(this.indice, cantidad - 1);
      this.colgarDe(this.bejucos[this.indice]);
    }

    colgarDe(bejuco) {
      this.bejuco = bejuco;
      this.estado = "balancear";
      this.agarre = AGARRE;
      this.manoAgarrada = this.mano;
      this.pendienteSaludo = false;
      this.colaRecta = 0;
      bejuco.angulo = 0;
      bejuco.velocidad = 0;
      this.angulo = 0;
      this.velocidadAngulo = 0;
      this.distancia = DISTANCIA_COLGADO;
      this.rotacion = 0;
      this.velocidadRotacion = 0;
      this.puntoBejuco(bejuco, this.agarre, this.punto);
      this.hombros.set(this.punto.x, this.punto.y - this.distancia, 0);
      this.anterior.copy(this.hombros);
      this.velocidad.set(0, 0, 0);
      this.brazos.forEach(function (brazo) { brazo.pos.copy(this.punto); }, this);
    }

    // Punto del bejuco a cierta distancia del ancla.
    puntoBejuco(bejuco, d, destino) {
      const seno = Math.sin(bejuco.angulo);
      const coseno = Math.cos(bejuco.angulo);
      const sostenido = bejuco === this.bejuco && this.estado !== "volar";
      const hasta = sostenido ? this.agarreSostenido() : LARGO_BEJUCO;

      if (d <= hasta) {
        const arco = Math.sin((Math.PI * d) / hasta) * bejuco.curva;
        const onda = Math.sin(d * 1.1 - this.t * 1.4 + bejuco.fase) * 0.05 * (d / LARGO_BEJUCO) * bejuco.libre;
        const lateral = arco + onda;
        return destino.set(
          bejuco.x + d * seno + lateral * coseno,
          ALTURA_ANCLA - d * coseno + lateral * seno,
          -0.06
        );
      }

      // Debajo de la mano el bejuco cuelga suelto y va un poco atrasado.
      const cola = bejuco.angulo - bejuco.velocidad * 0.14;
      const resto = d - hasta;
      return destino.set(
        bejuco.x + hasta * seno + resto * Math.sin(cola),
        ALTURA_ANCLA - hasta * coseno - resto * Math.cos(cola),
        -0.06
      );
    }

    agarreSostenido() {
      return this.estado === "cola" || this.modoSostenCola() ? AGARRE_COLA : this.agarre;
    }

    modoSostenCola() {
      return (this.estado === "colgarse" && this.manoAgarrada < 0) ||
        (this.estado === "retomar" && this.manoAgarrada < 0);
    }

    actualizarBejucos(dt) {
      this.bejucos.forEach(function (bejuco) {
        const sostenido = bejuco === this.bejuco && this.estado !== "volar";
        const curva = sostenido ? CURVA_PESO * (bejuco.velocidad > 0 ? -1 : 1) : 0;
        bejuco.curva += (curva - bejuco.curva) * mezcla(4, dt);
        bejuco.libre += ((sostenido ? 0 : 1) - bejuco.libre) * mezcla(3, dt);

        if (sostenido) return;
        const aceleracion = -(GRAVEDAD / LARGO_BEJUCO) * Math.sin(bejuco.angulo) - AMORTIGUACION_LIBRE * bejuco.velocidad;
        bejuco.velocidad += aceleracion * dt;
        bejuco.angulo += bejuco.velocidad * dt;
      }, this);
    }

    /* ---------- Balanceo ---------- */

    siguienteBejuco() {
      const siguiente = this.indice + this.sentido;
      return siguiente >= 0 && siguiente < this.cantidad ? this.bejucos[siguiente] : null;
    }

    balancear(dt) {
      const b = this.bejuco;
      const siguiente = this.siguienteBejuco();
      // El peso está en el cuerpo, así que el péndulo incluye el brazo.
      const largo = this.agarre + DISTANCIA_COLGADO;
      let aceleracion = -(GRAVEDAD / largo) * Math.sin(b.angulo) - AMORTIGUACION * b.velocidad;

      const avanza = b.velocidad * this.sentido;
      // Impulsa solo si el balanceo aún no llegaría al ángulo máximo.
      const altura = (largo * b.velocidad * b.velocidad) / (2 * GRAVEDAD);
      const cabe = Math.cos(b.angulo) - altura / largo > Math.cos(this.anguloMax);
      if (siguiente && cabe && (avanza > 0 || Math.abs(b.velocidad) < 0.05)) {
        aceleracion += this.sentido * FUERZA_IMPULSO;
      }
      // En el último bejuco frena para no salirse del encuadre.
      if (!siguiente) aceleracion -= FRENO_FINAL * b.velocidad;

      b.velocidad += aceleracion * dt;
      b.angulo += b.velocidad * dt;
      this.moverDesdeMano(dt);

      if (this.pendienteSaludo) {
        this.pendienteSaludo = false;
        this.iniciarCola("saludo");
        return;
      }

      if (!siguiente) {
        // Al perder impulso decide si hace una pausa o se devuelve.
        if (b.velocidad * this.sentido <= 0.06) {
          if (Math.random() < PROBABILIDAD_PAUSA) this.iniciarCola("pausa");
          else this.darVuelta();
        }
        return;
      }

      if (b.velocidad * this.sentido > 0 && b.angulo * this.sentido >= ANGULO_SOLTAR) {
        this.intentarSoltar(siguiente);
      }
    }

    darVuelta() {
      this.sentido = -this.sentido;
      this.metaEnrosque = Math.random() < PROBABILIDAD_ENROSCAR ? 1 : 0;
    }

    // La mano sigue en el bejuco y el cuerpo cuelga de ella.
    moverDesdeMano(dt) {
      const b = this.bejuco;
      // Trepa poco a poco hasta su altura de agarre.
      this.agarre += (AGARRE - this.agarre) * mezcla(VELOCIDAD_TREPAR, dt);
      this.puntoBejuco(b, this.agarre, this.punto);

      const meta = b.angulo;
      this.velocidadAngulo += (RIGIDEZ_CUERPO * (meta - this.angulo) - FRENO_CUERPO * this.velocidadAngulo) * dt;
      this.angulo += this.velocidadAngulo * dt;
      this.distancia += (DISTANCIA_COLGADO - this.distancia) * mezcla(6, dt);

      this.hombros.set(
        this.punto.x + Math.sin(this.angulo) * this.distancia,
        this.punto.y - Math.cos(this.angulo) * this.distancia,
        0
      );
      this.girarCuerpo(this.angulo, dt);
    }

    girarCuerpo(meta, dt) {
      this.velocidadRotacion += (RIGIDEZ_CUERPO * (meta - this.rotacion) - FRENO_CUERPO * this.velocidadRotacion) * dt;
      this.rotacion += this.velocidadRotacion * dt;
    }

    // Solo se suelta si llega al bejuco con una corrección pequeña.
    intentarSoltar(siguiente) {
      const v = this.velocidad;
      if (v.x * this.sentido < 0.8) return;

      // Apunta a donde estará el bejuco al llegar, no a su ancla.
      const futuro = siguiente.angulo + siguiente.velocidad * VUELO_IDEAL;
      const destino = siguiente.x + Math.sin(futuro) * AGARRE - this.sentido * 0.55;
      const tiempo = (destino - this.hombros.x) / v.x;
      if (tiempo < VUELO_MIN || tiempo > VUELO_IDEAL) return;
      const natural = this.hombros.y + v.y * tiempo - 0.5 * GRAVEDAD * tiempo * tiempo;

      // Puede agarrar el bejuco en un tramo; solo corrige si cae fuera de él.
      const agarre = ALTURA_ANCLA - (natural + ALTURA_MANO_VUELO);
      const cercano = limitar(agarre, AGARRE_MIN, AGARRE_MAX);
      const correccion = (agarre - cercano) / tiempo;
      if (Math.abs(correccion) > ASISTENCIA_MAX) return;

      v.y += correccion;
      this.asistencia = Math.abs(correccion);
      this.estado = "volar";
      this.tiempoVuelo = 0;
      this.manoAgarrada = -1;
      this.mano = 1 - this.mano;
      this.bejuco.velocidad *= 0.6;
    }

    /* ---------- Vuelo ---------- */

    volar(dt) {
      this.tiempoVuelo += dt;
      this.velocidad.y -= GRAVEDAD * dt;
      this.hombros.addScaledVector(this.velocidad, dt);
      this.girarCuerpo(this.sentido * 0.55, dt);

      const siguiente = this.siguienteBejuco();
      const d = limitar(ALTURA_ANCLA - (this.hombros.y + ALTURA_MANO_VUELO), AGARRE_MIN, AGARRE_MAX);
      this.puntoBejuco(siguiente, d, this.punto);
      this.brazos[this.mano].meta.copy(this.punto);

      const brazo = this.brazos[this.mano];
      const cerca = this.punto.distanceTo(brazo.hombro) < ALCANCE && brazo.pos.distanceTo(this.punto) < 0.3;
      if (cerca) {
        this.atrapar(siguiente, this.punto);
      } else if ((this.hombros.x - this.punto.x) * this.sentido > PASADO_MAX || this.tiempoVuelo > VUELO_MAX) {
        // Red de seguridad: si pasó de largo, se agarra donde alcance.
        this.fallos++;
        const agarre = limitar(ALTURA_ANCLA - (this.hombros.y + ALCANCE * 0.9), AGARRE_MIN, LARGO_BEJUCO);
        this.puntoBejuco(siguiente, agarre, this.punto);
        this.atrapar(siguiente, this.punto);
      }
    }

    atrapar(bejuco, punto) {
      const dx = punto.x - bejuco.x;
      const dy = ALTURA_ANCLA - punto.y;
      bejuco.angulo = Math.atan2(dx, dy);
      this.agarre = Math.hypot(dx, dy);

      // Conserva la velocidad que traía, ahora como giro del péndulo.
      const tangente = this.velocidad.x * Math.cos(bejuco.angulo) + this.velocidad.y * Math.sin(bejuco.angulo);
      bejuco.velocidad = (tangente / (this.agarre + DISTANCIA_COLGADO)) * RETENCION_AGARRE;

      this.indice += this.sentido;
      this.bejuco = bejuco;
      this.estado = "balancear";
      this.manoAgarrada = this.mano;

      const hastaHombros = this.auxiliar.subVectors(this.hombros, punto);
      this.distancia = hastaHombros.length();
      this.angulo = Math.atan2(hastaHombros.x, -hastaHombros.y);
      this.velocidadAngulo = bejuco.velocidad;
      this.metaEnrosque = Math.random() < PROBABILIDAD_ENROSCAR ? 1 : 0;
    }

    /* ---------- Colgado de la cola ---------- */

    iniciarCola(modo) {
      this.estado = "colgarse";
      this.modoCola = modo;
      this.tiempoCola = 0;
      this.desde.copy(this.hombros);
      this.rotacionDesde = this.rotacion;
      // Voltea hacia el centro de la escena para no salirse por los lados.
      this.rotacionMeta = (this.bejuco.x > 0 ? -1 : 1) * Math.PI;
      this.metaEnrosque = 0;
    }

    // Dónde quedan los hombros para que la cola llegue a su punto del bejuco.
    hombrosColgando(rotacion, destino) {
      this.puntoBejuco(this.bejuco, AGARRE_COLA, destino);
      destino.x -= Math.sin(rotacion) * LARGO_COLGADO;
      destino.y += Math.cos(rotacion) * LARGO_COLGADO;
      destino.z = 0;
      return destino;
    }

    calmarBejuco(dt) {
      const b = this.bejuco;
      b.velocidad += (-(GRAVEDAD / LARGO_BEJUCO) * Math.sin(b.angulo) - 2 * b.velocidad) * dt;
      b.angulo += b.velocidad * dt;
    }

    colgarse(dt) {
      this.calmarBejuco(dt);
      this.tiempoCola += dt;
      const avance = Math.min(1, this.tiempoCola / DURACION_COLGARSE);
      const curva = suavizar(avance);
      if (avance > 0.4) this.manoAgarrada = -1;

      this.rotacion = this.rotacionDesde + (this.rotacionMeta - this.rotacionDesde) * curva;
      this.velocidadRotacion = 0;
      // Va en línea recta hasta donde quedará colgado; no persigue la voltereta.
      this.hombrosColgando(this.rotacionMeta, this.punto);
      this.hombros.lerpVectors(this.desde, this.punto, curva);
      this.colaRecta = curva;

      if (avance >= 1) this.empezarColgado();
    }

    empezarColgado() {
      this.estado = "cola";
      this.tiempoCola = 0;
      const saludo = this.modoCola === "saludo";
      this.duracionCola = saludo ? DURACION_SALUDO : entre(TIEMPO_PAUSA_MIN, TIEMPO_PAUSA_MAX);
      this.gesto = saludo ? (Math.random() < 0.5 ? "aplaudir" : "saludar") : "rascar";
    }

    colgado(dt) {
      this.calmarBejuco(dt);
      this.tiempoCola += dt;
      this.rotacion = this.rotacionMeta + Math.sin(this.tiempoCola * 1.1) * 0.05;
      this.hombrosColgando(this.rotacion, this.hombros);
      if (this.tiempoCola >= this.duracionCola) this.iniciarRetomar();
    }

    iniciarRetomar() {
      this.estado = "retomar";
      this.tiempoCola = 0;
      this.desde.copy(this.hombros);
      this.rotacionDesde = this.rotacion;
      this.agarre = AGARRE;
    }

    retomar(dt) {
      this.calmarBejuco(dt);
      this.tiempoCola += dt;
      const avance = Math.min(1, this.tiempoCola / DURACION_RETOMAR);
      const curva = suavizar(avance);

      this.rotacion = this.rotacionDesde * (1 - curva) + this.bejuco.angulo * curva;
      this.velocidadRotacion = 0;
      this.colaRecta = 1 - curva;

      const b = this.bejuco;
      const seno = Math.sin(b.angulo);
      const coseno = Math.cos(b.angulo);
      this.punto.set(
        b.x + this.agarre * seno + seno * DISTANCIA_COLGADO,
        ALTURA_ANCLA - this.agarre * coseno - coseno * DISTANCIA_COLGADO,
        0
      );
      this.hombros.lerpVectors(this.desde, this.punto, curva);
      if (avance > 0.45) this.manoAgarrada = this.mano;

      if (avance >= 1) {
        this.estado = "balancear";
        this.manoAgarrada = this.mano;
        this.angulo = b.angulo;
        this.velocidadAngulo = 0;
        this.distancia = DISTANCIA_COLGADO;
        if (!this.siguienteBejuco()) this.sentido = -this.sentido;
      }
    }

    reaccionar() {
      super.reaccionar();
      if (this.estado === "balancear") {
        this.iniciarCola("saludo");
      } else if (this.estado === "volar" || this.estado === "retomar") {
        // Termina lo que hace y saluda apenas tenga agarre.
        this.pendienteSaludo = true;
      } else {
        this.modoCola = "saludo";
        if (this.estado === "cola") this.empezarColgado();
      }
    }

    /* ---------- Dibujo ---------- */

    dibujarBejucos() {
      this.bejucos.forEach(function (bejuco, i) {
        if (i >= this.cantidad) return;
        const puntos = bejuco.puntos;
        for (let j = 0; j <= SEGMENTOS_BEJUCO; j++) {
          this.puntoBejuco(bejuco, (j / SEGMENTOS_BEJUCO) * LARGO_BEJUCO, puntos[j]);
        }
        bejuco.tramos.forEach(function (tramo, j) {
          this.colocarHueso(tramo, puntos[j], puntos[j + 1]);
        }, this);
      }, this);
    }

    colocarHueso(hueso3d, desde, hasta) {
      const eje = this.auxiliar.subVectors(hasta, desde);
      const largo = eje.length();
      hueso3d.position.copy(desde).addScaledVector(eje, 0.5);
      hueso3d.scale.set(1, largo, 1);
      hueso3d.quaternion.setFromUnitVectors(ARRIBA, eje.normalize());
    }

    metaLocal(brazo, x, y, z) {
      brazo.meta.set(x, y, z);
      this.grupo.localToWorld(brazo.meta);
    }

    // Decide adónde va cada mano libre.
    ponerMetas() {
      const t = this.t;
      this.brazos.forEach(function (brazo, i) {
        if (i === this.manoAgarrada) return;
        const l = brazo.lado;

        if (this.estado === "volar") {
          if (i !== this.mano) this.metaColgando(brazo);
        } else if (this.estado === "cola") {
          this.metaColgado(brazo, t);
        } else if (this.estado === "retomar" && i === this.mano) {
          this.puntoBejuco(this.bejuco, this.agarre, brazo.meta);
        } else if (this.estado === "balancear") {
          this.metaColgando(brazo);
        } else {
          this.metaColgando(brazo);
        }
      }, this);
    }

    // El brazo libre cuelga por su peso, con el codo un poco doblado y algo atrasado.
    metaColgando(brazo) {
      brazo.meta.copy(brazo.hombro);
      brazo.meta.x += limitar(-this.velocidad.x * 0.09, -0.55, 0.55) + brazo.lado * 0.12;
      brazo.meta.y -= ALCANCE * 0.96;
      brazo.meta.z += 0.22;
    }

    metaColgado(brazo, t) {
      const l = brazo.lado;
      if (this.gesto === "aplaudir") {
        const separacion = 0.1 + Math.abs(Math.sin(t * 5)) * 0.3;
        this.metaLocal(brazo, separacion * l, 0.95, 0.75);
      } else if (this.gesto === "saludar") {
        const mueve = l > 0 ? Math.sin(t * 6) * 0.3 : 0;
        if (l > 0) this.metaLocal(brazo, 1.15 + mueve, 1.2, 0.5);
        else this.metaLocal(brazo, -0.75, 1.25, 0.2);
      } else if (l > 0) {
        // Se rasca la cabeza.
        this.metaLocal(brazo, 0.42 + Math.sin(t * 8) * 0.06, 0.92, 0.1 + Math.sin(t * 8) * 0.05);
      } else {
        this.metaLocal(brazo, -0.75, 1.25, 0.2);
      }
    }

    dibujarBrazo(brazo, dt) {
      const hombro = brazo.hombro;
      const agarrada = this.brazos.indexOf(brazo) === this.manoAgarrada;

      if (agarrada) {
        this.puntoBejuco(this.bejuco, this.agarre, brazo.pos);
      } else {
        brazo.pos.lerp(brazo.meta, mezcla(this.estado === "volar" ? 16 : 8, dt));
      }

      // Cinemática inversa: con hombro y mano calcula dónde queda el codo.
      const hacia = this.auxiliar.subVectors(brazo.pos, hombro);
      const distancia = Math.min(hacia.length(), LARGO_BRAZO * 2 - 0.01);
      hacia.normalize();
      const mano = this.punto.copy(hombro).addScaledVector(hacia, distancia);
      if (!agarrada) brazo.pos.copy(mano);

      const alto = Math.sqrt(Math.max(0, LARGO_BRAZO * LARGO_BRAZO - (distancia / 2) * (distancia / 2)));

      // El codo se dobla hacia afuera del cuerpo y un poco atrás.
      const afuera = this.punto2.set(Math.cos(this.rotacion) * brazo.lado, Math.sin(this.rotacion) * brazo.lado, -0.35);
      afuera.addScaledVector(hacia, -afuera.dot(hacia));
      if (afuera.lengthSq() < 0.01) afuera.set(0, 0, -1);
      afuera.normalize();

      const codo = brazo.codo.copy(hombro).addScaledVector(hacia, distancia / 2).addScaledVector(afuera, alto);
      const fin = this.punto3.copy(mano);
      this.colocarHueso(brazo.superior, hombro, codo);
      this.colocarHueso(brazo.inferior, codo, fin);
      this.dibujarMano(brazo, fin, codo, agarrada, dt);
    }

    dibujarMano(brazo, fin, codo, agarrada, dt) {
      // La mano sigue la línea del antebrazo; la izquierda queda como espejo.
      const eje = this.auxiliar.subVectors(fin, codo).normalize();
      brazo.mano.position.copy(fin);
      brazo.mano.quaternion.setFromUnitVectors(ARRIBA, eje);
      if (brazo.lado < 0) brazo.mano.rotateY(Math.PI);

      const buscando = this.estado === "volar" && this.brazos.indexOf(brazo) === this.mano;
      const meta = agarrada ? MANO_AGARRA : (buscando ? MANO_ABIERTA : MANO_RELAJADA);
      brazo.cierre += (meta - brazo.cierre) * mezcla(MANO_RAPIDEZ, dt);

      // Los dedos rodean el bejuco y forman el gancho.
      brazo.dedos.forEach(function (dedo) {
        dedo.base.rotation.y = -brazo.cierre * 1.25;
        dedo.punta.rotation.y = -brazo.cierre * 1.5;
      });
    }

    dibujarPiernasYCola(dt) {
      const impulso = this.estado === "volar" ? this.velocidad.x * 0.2 : this.bejuco.velocidad;
      this.pesoPiernas += (impulso - this.pesoPiernas) * mezcla(RETRASO_PIERNAS, dt);

      const recogida = this.estado === "volar" ? 0.55 : 0.25;
      this.piernas.forEach(function (pierna, i) {
        pierna.cadera.rotation.z = limitar(-this.pesoPiernas * 0.45, -0.7, 0.7) + 0.08 * pierna.lado;
        pierna.cadera.rotation.x = -recogida - this.colaRecta * 0.3;
        pierna.rodilla.rotation.x = recogida * 1.3 + Math.sin(this.t * 1.2 + i) * 0.05;
        pierna.pie.rotation.x = -recogida * 0.6;
        pierna.dedos.forEach(function (dedo) {
          dedo.base.rotation.x = recogida * 1.1;
          dedo.punta.rotation.x = recogida * 1.5;
        });
      }, this);

      // La cola se curva hacia atrás del recorrido: hace de contrapeso.
      this.ladoCola += (-this.sentido - this.ladoCola) * mezcla(2, dt);
      this.enrosque += (this.metaEnrosque - this.enrosque) * mezcla(1.6, dt);
      this.pesoCola[0] += (-impulso - this.pesoCola[0]) * mezcla(RETRASO_COLA, dt);
      for (let i = 1; i < ESLABONES; i++) {
        this.pesoCola[i] += (this.pesoCola[i - 1] - this.pesoCola[i]) * mezcla(RETRASO_COLA * 2, dt);
      }

      this.cola.forEach(function (eslabon, i) {
        const libre = 0.3 * this.ladoCola + this.pesoCola[i] * 0.16 + Math.sin(this.t * 1.3 - i * 0.5) * 0.05;
        const enroscada = libre + this.enrosque * 0.5 * this.ladoCola;
        const final = i >= ESLABONES_RECTOS ? 1.25 : 0;
        eslabon.rotation.z = enroscada * (1 - this.colaRecta) + final * this.colaRecta;
      }, this);
    }

    actualizar(t, dt) {
      this.t = t;
      if (dt > 0) {
        this.actualizarBejucos(dt);
        if (this.estado === "balancear") this.balancear(dt);
        else if (this.estado === "volar") this.volar(dt);
        else if (this.estado === "colgarse") this.colgarse(dt);
        else if (this.estado === "cola") this.colgado(dt);
        else this.retomar(dt);

        if (this.estado !== "volar") {
          this.velocidad.subVectors(this.hombros, this.anterior).divideScalar(dt);
        }
        this.anterior.copy(this.hombros);

        const colgado = this.estado === "colgarse" || this.estado === "cola";
        const mirada = colgado ? 0 : this.sentido * 0.6;
        this.mirada += (mirada - this.mirada) * mezcla(3, dt);
      }

      this.grupo.position.copy(this.hombros);
      this.grupo.rotation.set(0, this.mirada, this.rotacion);
      this.grupo.updateMatrixWorld(true);

      this.brazos.forEach(function (brazo) {
        brazo.hombro.set(0.4 * brazo.lado, 0, 0);
        this.grupo.localToWorld(brazo.hombro);
      }, this);
      this.ponerMetas();
      this.brazos.forEach(function (brazo) { this.dibujarBrazo(brazo, dt); }, this);
      this.dibujarPiernasYCola(dt);
      this.dibujarBejucos();
    }
  }

  window.Animales.Mono = Mono;
})();
