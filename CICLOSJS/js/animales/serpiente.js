// serpiente.js — Menú principal. Crece con cada ejercicio terminado.
(function () {
  const ANILLOS = 300;
  const LADOS = 24;
  const ANILLOS_CABEZA = 26;
  const POR_ANILLO = LADOS + 1;
  const GROSOR = 0.3;
  const LARGO_CABEZA = 0.85;

  class Ruta extends THREE.Curve {
    constructor() {
      super();
      this.arcLengthDivisions = 900;
      this.medioAncho = 1;
      this.medioAlto = 1;
      this.aspecto = 1;
    }
    // Un ocho acostado; en pantallas angostas se pone de pie.
    getPoint(u, destino) {
      const punto = destino || new THREE.Vector3();
      const a = u * Math.PI * 2;
      const profundidad = 0.6 * Math.sin(a + 1);
      if (this.aspecto < 1) {
        return punto.set(this.medioAncho * 0.72 * Math.sin(2 * a), this.medioAlto * 0.7 * Math.sin(a), profundidad);
      }
      const ancho = this.aspecto > 1.2 ? 0.58 : 0.8;
      const centro = this.aspecto > 1.2 ? 0.32 : 0;
      return punto.set(
        this.medioAncho * (centro + ancho * Math.sin(a)),
        this.medioAlto * 0.56 * Math.sin(2 * a),
        profundidad
      );
    }
  }

  class Serpiente extends window.Animales.Animal {
    constructor(ctx) {
      super(ctx);
      this.largo = 7 + 7 * (ctx.completados / ctx.total);
      this.escala = 1;
      this.ruta = new Ruta();
      this.largoRuta = 1;
      this.tiempoExtra = 0;

      this.posiciones = new Float32Array(ANILLOS * POR_ANILLO * 3);
      this.normales = new Float32Array(ANILLOS * POR_ANILLO * 3);
      this.geometria = this.crearCuerpo();

      const cuerpo = new THREE.Mesh(this.geometria, new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.32,
        clearcoat: 0.7,
        clearcoatRoughness: 0.25
      }));
      cuerpo.frustumCulled = false;
      this.grupo.add(cuerpo);

      const util = window.Animales.util;
      this.ojoA = util.ojo(0.075);
      this.ojoB = util.ojo(0.075);
      this.grupo.add(this.ojoA, this.ojoB);

      this.punto = new THREE.Vector3();
      this.adelante = new THREE.Vector3();
      this.tangente = new THREE.Vector3();
      this.lado = new THREE.Vector3();
      this.arriba = new THREE.Vector3();
      this.eje = new THREE.Vector3(0, 0, 1);
    }

    crearCuerpo() {
      const colores = new Float32Array(ANILLOS * POR_ANILLO * 3);
      const indices = [];
      const rojo = new THREE.Color(0xc0101f);
      const negro = new THREE.Color(0x12090a);
      const mezcla = new THREE.Color();

      // Rombos negros sobre el lomo, fijos a cada anillo del cuerpo.
      for (let i = 0; i < ANILLOS; i++) {
        for (let j = 0; j < POR_ANILLO; j++) {
          const angulo = (j / LADOS) * Math.PI * 2;
          const rombo = Math.abs(((i % 24) - 12) / 12) + Math.abs(Math.cos(angulo)) * 1.3;
          const sobreLomo = i > ANILLOS_CABEZA + 4 && Math.sin(angulo) > 0;
          const mancha = sobreLomo ? 1 - THREE.MathUtils.smoothstep(rombo, 0.7, 0.9) : 0;
          mezcla.copy(rojo).lerp(negro, mancha);
          colores.set([mezcla.r, mezcla.g, mezcla.b], (i * POR_ANILLO + j) * 3);
        }
      }

      for (let i = 0; i < ANILLOS - 1; i++) {
        for (let j = 0; j < LADOS; j++) {
          const a = i * POR_ANILLO + j;
          const b = a + POR_ANILLO;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }

      const geometria = new THREE.BufferGeometry();
      geometria.setAttribute("position", new THREE.BufferAttribute(this.posiciones, 3));
      geometria.setAttribute("normal", new THREE.BufferAttribute(this.normales, 3));
      geometria.setAttribute("color", new THREE.BufferAttribute(colores, 3));
      geometria.setIndex(indices);
      return geometria;
    }

    ajustar(medidas) {
      this.ruta.medioAncho = medidas.medioAncho;
      this.ruta.medioAlto = medidas.medioAlto;
      this.ruta.aspecto = medidas.aspecto;
      this.ruta.updateArcLengths();
      this.largoRuta = this.ruta.getLength();
      this.escala = Math.max(0.62, Math.min(1, medidas.aspecto / 1.2));
      this.ojoA.scale.setScalar(this.escala);
      this.ojoB.scale.setScalar(this.escala);
    }

    grosorEn(i) {
      if (i < ANILLOS_CABEZA) {
        const u = i / ANILLOS_CABEZA;
        const hocico = Math.sqrt(Math.min(1, u / 0.3));
        const cabeza = 1.2 - 0.38 * Math.max(0, (u - 0.45) / 0.55);
        return GROSOR * hocico * cabeza;
      }
      const u = (i - ANILLOS_CABEZA) / (ANILLOS - 1 - ANILLOS_CABEZA);
      const cuello = 0.82 + 0.18 * Math.min(1, u / 0.08);
      const cola = u > 0.62 ? Math.pow(1 - (u - 0.62) / 0.38, 0.8) : 1;
      return GROSOR * cuello * cola;
    }

    enRuta(distancia, destino) {
      const u = (((distancia / this.largoRuta) % 1) + 1) % 1;
      return this.ruta.getPointAt(u, destino);
    }

    actualizar(t, dt) {
      this.tiempoExtra += dt * this.energia * 3;
      const tiempo = t + 8 + this.tiempoExtra;
      const raton = this.ctx.raton;
      this.grupo.rotation.y += (raton.x * 0.12 - this.grupo.rotation.y) * 0.04;
      this.grupo.rotation.x += (raton.y * 0.1 - this.grupo.rotation.x) * 0.04;

      const { punto, adelante, tangente, lado, arriba, eje, escala } = this;
      const largoCuerpo = this.largo * escala;
      const inicio = tiempo * 1.2;

      for (let i = 0; i < ANILLOS; i++) {
        const atraso = i < ANILLOS_CABEZA
          ? (i / ANILLOS_CABEZA) * LARGO_CABEZA * escala
          : LARGO_CABEZA * escala + ((i - ANILLOS_CABEZA) / (ANILLOS - ANILLOS_CABEZA)) * largoCuerpo;

        this.enRuta(inicio - atraso, punto);
        this.enRuta(inicio - atraso + 0.03, adelante);
        tangente.subVectors(adelante, punto).normalize();
        lado.crossVectors(eje, tangente).normalize();
        arriba.crossVectors(tangente, lado).normalize();

        // Ondulación lateral: nace detrás de la cabeza.
        const onda = Math.min(1, atraso / 1.6) * 0.2 * escala;
        punto.addScaledVector(lado, Math.sin(atraso * 2.6 - tiempo * 3.2) * onda);

        const radio = this.grosorEn(i) * escala;
        const plano = i < ANILLOS_CABEZA ? 0.72 : 1;
        const ancho = i < ANILLOS_CABEZA ? 1.15 : 1;

        for (let j = 0; j < POR_ANILLO; j++) {
          const angulo = (j / LADOS) * Math.PI * 2;
          const c = Math.cos(angulo);
          const s = Math.sin(angulo);
          const k = (i * POR_ANILLO + j) * 3;
          this.posiciones[k] = punto.x + (lado.x * c * ancho + arriba.x * s * plano) * radio;
          this.posiciones[k + 1] = punto.y + (lado.y * c * ancho + arriba.y * s * plano) * radio;
          this.posiciones[k + 2] = punto.z + (lado.z * c * ancho + arriba.z * s * plano) * radio;
          this.normales[k] = lado.x * c + arriba.x * s;
          this.normales[k + 1] = lado.y * c + arriba.y * s;
          this.normales[k + 2] = lado.z * c + arriba.z * s;
        }

        if (i === 11) {
          this.ojoA.position.copy(punto).addScaledVector(lado, radio * 0.72).addScaledVector(arriba, radio * 0.5);
          this.ojoB.position.copy(punto).addScaledVector(lado, -radio * 0.72).addScaledVector(arriba, radio * 0.5);
        }
      }
      this.geometria.attributes.position.needsUpdate = true;
      this.geometria.attributes.normal.needsUpdate = true;
    }
  }

  window.Animales.Serpiente = Serpiente;
})();
