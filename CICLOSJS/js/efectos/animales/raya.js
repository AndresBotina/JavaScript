// Capa visual decorativa, independiente de los ejercicios.
// raya.js — Ejercicio 3. Manta raya que planea en el sitio ondulando las alas.
// Mira hacia +Z, las alas van sobre el eje X y el lomo hacia +Y.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, material, cono, hueso, ojo, en, giro } = util;

  const MEDIA_ENVERGADURA = 2.75;
  const SEGMENTOS_ALA = 8;
  const SEGMENTOS_LARGO = 6;
  const ALTURA_ONDA = 0.8;
  const FRECUENCIA_ONDA = 1.1;
  const RITMO = 0.8;
  const SEGMENTOS_COLA = 6;
  const LARGO_SEGMENTO = 0.55;

  // Distancia al centro: 0 en el lomo, 1 en la punta del ala.
  function haciaPunta(x) {
    return Math.abs(x) / MEDIA_ENVERGADURA;
  }

  // Contorno de rombo: en cada x devuelve el borde delantero y el trasero.
  function frente(x) {
    return 1.5 - 1.95 * Math.pow(haciaPunta(x), 1.2);
  }

  function atras(x) {
    return -1.9 + 1.4 * Math.pow(haciaPunta(x), 0.8);
  }

  // Abultamiento del centro. Vale 0 en el contorno, así lomo y vientre se unen.
  function bulto(x, avance) {
    return 4 * avance * (1 - avance) * (0.06 + 0.4 * Math.exp(-Math.pow(x / 0.85, 2)));
  }

  function alturaLomo(x, z) {
    return bulto(x, (frente(x) - z) / (frente(x) - atras(x)));
  }

  // La ola viaja de adelante hacia atrás y las puntas van un poco retrasadas.
  function onda(x, z, fase) {
    const punta = haciaPunta(x);
    return ALTURA_ONDA * Math.pow(punta, 1.7) * Math.sin(fase + z * FRECUENCIA_ONDA - punta * 0.9);
  }

  function puntoCuerpo(i, j, lado) {
    const x = (i / SEGMENTOS_ALA) * MEDIA_ENVERGADURA;
    const avance = j / SEGMENTOS_LARGO;
    const z = frente(x) + (atras(x) - frente(x)) * avance;
    const y = bulto(x, avance) * (lado > 0 ? 1 : -0.55);
    return [x, y, z];
  }

  // Cada cara lleva sus propios vértices para tener un tono diferente.
  function crearCuerpo() {
    const vertices = [];
    const colores = [];
    const tono = new THREE.Color();
    const rojo = new THREE.Color(COLOR.rojo);
    const vino = new THREE.Color(COLOR.vino);
    const rosa = new THREE.Color(COLOR.rosa);

    function cara(a, b, c, lado) {
      const azar = Math.random();
      if (lado < 0) tono.copy(vino).lerp(rojo, azar * 0.4);
      else if (azar < 0.7) tono.copy(rojo).lerp(vino, azar * 0.5);
      else tono.copy(rojo).lerp(rosa, (azar - 0.7) * 0.6);

      [a, b, c].forEach(function (punto) {
        vertices.push(punto[0], punto[1], punto[2]);
        colores.push(tono.r, tono.g, tono.b);
      });
    }

    [1, -1].forEach(function (lado) {
      for (let i = -SEGMENTOS_ALA; i < SEGMENTOS_ALA; i++) {
        for (let j = 0; j < SEGMENTOS_LARGO; j++) {
          const a = puntoCuerpo(i, j, lado);
          const b = puntoCuerpo(i + 1, j, lado);
          const c = puntoCuerpo(i, j + 1, lado);
          const d = puntoCuerpo(i + 1, j + 1, lado);
          // El vientre se arma al revés para que sus caras miren hacia abajo.
          if (lado > 0) {
            cara(a, b, c, lado);
            cara(b, d, c, lado);
          } else {
            cara(a, c, b, lado);
            cara(b, c, d, lado);
          }
        }
      }
    });

    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometria.setAttribute("color", new THREE.Float32BufferAttribute(colores, 3));
    geometria.computeVertexNormals();
    return geometria;
  }

  class Raya extends Animal {
    constructor(ctx) {
      super(ctx);
      this.fase = 0;

      this.geometria = crearCuerpo();
      this.reposo = this.geometria.attributes.position.array.slice();
      this.grupo.add(new THREE.Mesh(this.geometria, material(0xffffff, { vertexColors: true })));

      // Aletas cefálicas: salen del frente y se curvan hacia adentro.
      this.aletas = [-1, 1].map(function (lado) {
        const x = 0.42 * lado;
        const pivote = giro(this.grupo, x, 0, frente(x) - 0.04);
        const aleta = en(pivote, cono(0.15, 0.62, COLOR.vino, 4), 0, 0, 0.28);
        aleta.rotation.x = Math.PI / 2;
        aleta.scale.z = 0.35;
        pivote.rotation.y = -0.22 * lado;
        return pivote;
      }, this);

      this.ojos = [-1, 1].map(function (lado) {
        const x = 0.6 * lado;
        const z = 0.9;
        const objeto = en(this.grupo, ojo(0.09), x, alturaLomo(x, z), z);
        return { objeto: objeto, x: x, y: objeto.position.y, z: z };
      }, this);

      // La cola son segmentos encadenados para que se doble como un látigo.
      this.cola = [];
      let padre = this.grupo;
      for (let i = 0; i < SEGMENTOS_COLA; i++) {
        const segmento = giro(padre, 0, 0, i === 0 ? -1.82 : -LARGO_SEGMENTO);
        const grosor = 0.085 * (1 - i / SEGMENTOS_COLA);
        const grosorFinal = 0.085 * (1 - (i + 1) / SEGMENTOS_COLA) + 0.006;
        en(segmento, hueso(grosor, grosorFinal, LARGO_SEGMENTO, COLOR.vino)).rotation.x = Math.PI / 2;
        this.cola.push(segmento);
        padre = segmento;
      }
    }

    actualizar(t, dt) {
      // Al enviar el formulario da un aletazo: sube y vuelve a la calma.
      const impulso = Math.sin(this.energia * Math.PI);
      this.fase += dt * (1.5 + impulso * 1.1);
      const fuerza = 1 + impulso * 0.3;

      const posiciones = this.geometria.attributes.position.array;
      for (let i = 0; i < posiciones.length; i += 3) {
        const x = this.reposo[i];
        const z = this.reposo[i + 2];
        posiciones[i + 1] = this.reposo[i + 1] + onda(x, z, this.fase) * fuerza;
      }
      this.geometria.attributes.position.needsUpdate = true;
      this.geometria.computeVertexNormals();

      this.ojos.forEach(function (ojoActual) {
        ojoActual.objeto.position.y = ojoActual.y + onda(ojoActual.x, ojoActual.z, this.fase) * fuerza;
      }, this);

      this.aletas.forEach(function (aleta) {
        aleta.rotation.x = Math.sin(this.fase + 1.4) * 0.14;
      }, this);

      // Planeo: flota despacio y gira un poco, sin moverse del sitio.
      const giroCuerpo = Math.sin(t * RITMO);
      this.grupo.position.y = -0.2 + Math.sin(t * 0.6) * 0.16 + impulso * 0.35;
      this.grupo.rotation.x = 0.8 + Math.sin(t * 0.5 + 1) * 0.05;
      this.grupo.rotation.y = -1.15 + giroCuerpo * 0.14;
      this.grupo.rotation.z = Math.sin(t * 0.5) * 0.05;

      // La cola repite el giro del cuerpo con retraso, más fuerte hacia la punta.
      this.cola.forEach(function (segmento, i) {
        segmento.rotation.y = Math.sin(t * RITMO - 0.7 - i * 0.45) * (0.06 + i * 0.022);
        segmento.rotation.x = Math.sin(this.fase - 2 - i * 0.5) * 0.03;
      }, this);
    }
  }

  window.Animales.Raya = Raya;
})();
