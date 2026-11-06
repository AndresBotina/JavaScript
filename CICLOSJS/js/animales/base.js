// base.js — Piezas comunes para armar los animales con Three.js.
// Cada animal es una clase con:
//   constructor(ctx)      crea el modelo
//   actualizar(t, dt)     lo anima en cada cuadro (t y dt en segundos)
//   ajustar(medidas)      opcional, cuando cambia el tamaño de la pantalla
//   reaccionar()          ya viene hecho: sube this.energia a 1 al enviar el formulario
window.Animales = {};

(function () {
  const COLOR = {
    rojo: 0xc0101f,
    vino: 0x7a0a16,
    rosa: 0xf0485a,
    negro: 0x1c1113,
    gris: 0x43363a,
    crema: 0xf3eeec
  };

  function material(color, extra) {
    return new THREE.MeshStandardMaterial(Object.assign({
      color: color,
      flatShading: true,
      roughness: 0.42,
      metalness: 0.05
    }, extra));
  }

  function malla(geometria, color, extra) {
    return new THREE.Mesh(geometria, material(color, extra));
  }

  // Esfera low-poly; escala = [x, y, z] para aplastarla o estirarla.
  function bola(radio, color, escala) {
    const objeto = malla(new THREE.IcosahedronGeometry(radio, 2), color);
    if (escala) objeto.scale.set(escala[0], escala[1], escala[2]);
    return objeto;
  }

  function cono(radio, alto, color, lados) {
    return malla(new THREE.ConeGeometry(radio, alto, lados || 7), color);
  }

  function tubo(radioArriba, radioAbajo, alto, color, lados) {
    return malla(new THREE.CylinderGeometry(radioArriba, radioAbajo, alto, lados || 7), color);
  }

  function caja(ancho, alto, fondo, color) {
    return malla(new THREE.BoxGeometry(ancho, alto, fondo), color);
  }

  // Segmento que cuelga desde su punto de giro (para patas y colas).
  function hueso(radioArriba, radioAbajo, largo, color) {
    const objeto = tubo(radioArriba, radioAbajo, largo, color);
    objeto.geometry.translate(0, -largo / 2, 0);
    return objeto;
  }

  // Ojo brillante con su puntico de luz.
  function ojo(radio) {
    const grupo = new THREE.Group();
    const globo = new THREE.Mesh(
      new THREE.SphereGeometry(radio, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x050303, roughness: 0.08 })
    );
    const brillo = new THREE.Mesh(
      new THREE.SphereGeometry(radio * 0.3, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    brillo.position.set(radio * 0.4, radio * 0.45, radio * 0.72);
    grupo.add(globo, brillo);
    return grupo;
  }

  // Agrega un hijo en una posición y lo devuelve.
  function en(padre, hijo, x, y, z) {
    hijo.position.set(x || 0, y || 0, z || 0);
    padre.add(hijo);
    return hijo;
  }

  function giro(padre, x, y, z) {
    return en(padre, new THREE.Group(), x, y, z);
  }

  // Forma continua hecha uniendo secciones a lo largo del eje X.
  // Cada sección es [x, y, ancho, alto]: sirve para cuerpos, cuellos y cabezas.
  function molde(secciones, color, lados) {
    const n = lados || 10;
    const vertices = [];
    const indices = [];

    secciones.forEach(function (s) {
      for (let j = 0; j < n; j++) {
        const angulo = (j / n) * Math.PI * 2;
        vertices.push(s[0], s[1] + Math.sin(angulo) * s[3], Math.cos(angulo) * s[2]);
      }
    });

    for (let i = 0; i < secciones.length - 1; i++) {
      for (let j = 0; j < n; j++) {
        const a = i * n + j;
        const b = a + n;
        const c = i * n + ((j + 1) % n);
        const d = c + n;
        indices.push(a, b, c, b, d, c);
      }
    }

    // Tapas de los dos extremos.
    const primera = secciones[0];
    const ultima = secciones[secciones.length - 1];
    const tapaInicio = vertices.length / 3;
    vertices.push(primera[0], primera[1], 0);
    const tapaFin = tapaInicio + 1;
    vertices.push(ultima[0], ultima[1], 0);
    const base = (secciones.length - 1) * n;
    for (let j = 0; j < n; j++) {
      const siguiente = (j + 1) % n;
      indices.push(tapaInicio, j, siguiente);
      indices.push(tapaFin, base + siguiente, base + j);
    }

    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometria.setIndex(indices);
    geometria.computeVertexNormals();
    return malla(geometria, color);
  }

  // Devuelve 1 con el ojo abierto y casi 0 mientras parpadea.
  function parpadeo(t, cada) {
    return t % cada < 0.14 ? 0.08 : 1;
  }

  // Gira un objeto poco a poco hasta un ángulo en Y.
  function girarHacia(objeto, angulo, dt) {
    objeto.rotation.y += (angulo - objeto.rotation.y) * (1 - Math.exp(-dt * 5));
  }

  // Ala u hoja delgada y semitransparente.
  function membrana(ancho, largo) {
    const objeto = new THREE.Mesh(
      new THREE.CircleGeometry(1, 14),
      new THREE.MeshStandardMaterial({
        color: COLOR.crema,
        transparent: true,
        opacity: 0.42,
        roughness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    objeto.scale.set(ancho, largo, 1);
    return objeto;
  }

  class Animal {
    constructor(ctx) {
      this.ctx = ctx;
      this.energia = 0;
      this.grupo = new THREE.Group();
      ctx.escena.add(this.grupo);
    }
    reaccionar() {
      this.energia = 1;
    }
    ajustar() {}
    actualizar() {}
  }

  window.Animales.Animal = Animal;
  window.Animales.util = { COLOR, material, malla, bola, cono, tubo, caja, hueso, ojo, en, giro, molde, parpadeo, girarHacia, membrana };
})();
