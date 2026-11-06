// hormiga.js — Ejercicio 1. Lleva un cubo de azúcar en las mandíbulas.
// Las patas tocan el suelo de verdad: cada pie se queda quieto mientras el cuerpo avanza.
(function () {
  const { Animal, util } = window.Animales;
  const { COLOR, malla, bola, cono, tubo, caja, hueso, ojo, en, giro, molde } = util;

  const SUELO = -1.12;
  const VELOCIDAD = 0.62;
  const ZANCADA = 0.54;
  const APOYO = 0.58;        // Parte del ciclo con el pie en el suelo.
  const ALTURA_PASO = 0.3;
  const MUSLO = 1.02;
  const TIBIA = 1.16;
  const PIE = 0.3;

  // Perfiles: [x, y, ancho, alto]
  const TORAX = [[-0.6, 0, 0.1, 0.12], [-0.36, 0.05, 0.25, 0.28], [0.02, 0.09, 0.31, 0.36], [0.38, 0.05, 0.24, 0.27], [0.6, 0.01, 0.1, 0.12]];
  const CABEZA = [[-0.12, 0, 0.09, 0.1], [0.05, 0.02, 0.32, 0.27], [0.3, 0.05, 0.41, 0.32], [0.54, 0.02, 0.35, 0.25], [0.7, -0.03, 0.17, 0.13], [0.76, -0.04, 0.06, 0.05]];
  const ABDOMEN = [[-1.84, -0.04, 0.05, 0.05], [-1.66, 0, 0.33, 0.31], [-1.2, 0.05, 0.6, 0.57], [-0.7, 0.06, 0.61, 0.6], [-0.26, 0.03, 0.41, 0.4], [-0.02, 0, 0.09, 0.09]];

  // Cadera y punto de apoyo de cada pata [x, y, z], para el lado positivo de Z.
  const PATAS = [
    { cadera: [0.36, -0.14, 0.2], apoyo: [1.08, SUELO, 0.98] },
    { cadera: [0.04, -0.16, 0.24], apoyo: [0.04, SUELO, 1.22] },
    { cadera: [-0.28, -0.14, 0.2], apoyo: [-1.16, SUELO, 1.08] }
  ];

  const ARRIBA = new THREE.Vector3(0, 1, 0);

  class Hormiga extends Animal {
    constructor(ctx) {
      super(ctx);
      this.recorrido = 2;
      this.direccion = 1;
      this.girando = 0;
      this.fase = 0;
      this.grupo.rotation.set(0.3, -0.42, 0);
      this.grupo.position.y = 0.05;
      this.grupo.scale.setScalar(1.2);

      this.cuerpo = giro(this.grupo, 0, 0, 0);
      en(this.cuerpo, molde(TORAX, COLOR.vino, 10));
      this.crearCintura();
      this.crearAbdomen();
      this.crearCabeza();
      this.crearPatas();
    }

    // Cintura fina entre el tórax y el abdomen: es lo que separa las partes.
    crearCintura() {
      const palo = en(this.cuerpo, tubo(0.05, 0.05, 0.6, COLOR.gris), -0.86, 0.02, 0);
      palo.rotation.z = Math.PI / 2;
      en(this.cuerpo, bola(0.15, COLOR.rojo, [0.7, 1.15, 1]), -0.82, 0.05, 0);
    }

    crearAbdomen() {
      this.abdomen = giro(this.cuerpo, -1.12, 0.05, 0);
      en(this.abdomen, molde(ABDOMEN, COLOR.rojo, 12));
      [[-0.48, 0.52], [-0.92, 0.6], [-1.34, 0.49]].forEach(function (anillo) {
        const banda = malla(new THREE.TorusGeometry(anillo[1], 0.024, 6, 22), COLOR.negro);
        en(this.abdomen, banda, anillo[0], 0.05, 0).rotation.y = Math.PI / 2;
      }, this);
    }

    crearCabeza() {
      const cuello = en(this.cuerpo, tubo(0.06, 0.06, 0.36, COLOR.gris), 0.72, 0.04, 0);
      cuello.rotation.z = Math.PI / 2;

      this.cabeza = giro(this.cuerpo, 0.94, 0.08, 0);
      en(this.cabeza, molde(CABEZA, COLOR.rojo, 10));

      this.antenas = [-1, 1].map(function (lado) {
        en(this.cabeza, ojo(0.1), 0.34, 0.14, 0.37 * lado);

        // Antena en codo: un tramo sube y el otro baja hacia adelante.
        const base = giro(this.cabeza, 0.52, 0.2, 0.15 * lado);
        en(base, hueso(0.032, 0.028, 0.56, COLOR.vino));
        base.rotation.set(2.6 * lado, 0, 0.32 * -1);
        const codo = giro(base, 0, -0.55, 0);
        en(codo, bola(0.04, COLOR.negro));
        en(codo, hueso(0.028, 0.016, 0.66, COLOR.rosa));
        return { base: base, codo: codo, lado: lado };
      }, this);

      this.mandibulas = [-1, 1].map(function (lado) {
        const mandibula = giro(this.cabeza, 0.68, -0.08, 0.15 * lado);
        const pinza = en(mandibula, cono(0.1, 0.7, COLOR.rosa, 5), 0.33, 0, 0);
        pinza.rotation.z = -Math.PI / 2;
        return { mandibula: mandibula, lado: lado };
      }, this);

      // El cubo va al frente de las mandíbulas, sin tocar la cara.
      this.azucar = en(this.cabeza, caja(0.56, 0.56, 0.56, 0xffffff), 1.36, -0.05, 0);
      // Brillo propio para que las luces rojas no lo tiñan de rosado.
      this.azucar.material.emissive.set(0x8f8a88);
      this.azucar.rotation.set(0.1, 0, 0.14);
      this.azucar.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(this.azucar.geometry),
        new THREE.LineBasicMaterial({ color: 0xb9aeaa })
      ));
    }

    crearPatas() {
      this.patas = [];
      PATAS.forEach(function (datos, i) {
        [-1, 1].forEach(function (lado) {
          const parte = function (radio, punta, color) {
            return en(this.cuerpo, tubo(radio, punta, 1, color));
          }.bind(this);
          this.patas.push({
            cadera: new THREE.Vector3(datos.cadera[0], datos.cadera[1], datos.cadera[2] * lado),
            apoyo: new THREE.Vector3(datos.apoyo[0], datos.apoyo[1], datos.apoyo[2] * lado),
            desfase: (i + (lado > 0 ? 1 : 0)) % 2 === 0 ? 0 : 0.5,
            lado: lado,
            muslo: parte(0.075, 0.06, COLOR.rojo),
            tibia: parte(0.055, 0.04, COLOR.rosa),
            tarso: parte(0.036, 0.016, COLOR.rosa),
            rodilla: en(this.cuerpo, bola(0.078, COLOR.negro)),
            tobillo: en(this.cuerpo, bola(0.05, COLOR.negro))
          });
        }, this);
      }, this);
      this.a = new THREE.Vector3();
      this.b = new THREE.Vector3();
      this.c = new THREE.Vector3();
      this.d = new THREE.Vector3();
      this.e = new THREE.Vector3();
    }

    ajustar(medidas) {
      this.recorrido = Math.max(0, Math.min(1.6, medidas.medioAncho - 4.6));
    }

    // Une dos puntos con un tramo de pata.
    unir(parte, desde, hasta) {
      const eje = this.e.subVectors(hasta, desde);
      const largo = eje.length();
      parte.position.copy(desde).addScaledVector(eje, 0.5);
      parte.scale.set(1, largo, 1);
      parte.quaternion.setFromUnitVectors(ARRIBA, eje.normalize());
    }

    moverPata(pata, zancada) {
      const ciclo = (this.fase + pata.desfase) % 1;
      const pie = this.a.copy(pata.apoyo);

      if (ciclo < APOYO) {
        // En el suelo: el pie va hacia atrás a la misma velocidad que avanza el cuerpo.
        pie.x += zancada * (0.5 - ciclo / APOYO);
      } else {
        // En el aire: vuelve adelante en un arco.
        const aire = (ciclo - APOYO) / (1 - APOYO);
        pie.x += zancada * (aire - 0.5);
        pie.y += Math.sin(aire * Math.PI) * ALTURA_PASO;
      }

      // El tobillo queda arriba y hacia adentro del punto de apoyo.
      const tobillo = this.b.copy(pie);
      tobillo.y += PIE * 0.62;
      tobillo.z -= pata.lado * PIE * 0.72;

      // Cinemática inversa: la rodilla sube por encima de la línea cadera-tobillo.
      const hacia = this.c.subVectors(tobillo, pata.cadera);
      const distancia = Math.min(hacia.length(), MUSLO + TIBIA - 0.02);
      hacia.normalize();
      const base = (MUSLO * MUSLO - TIBIA * TIBIA + distancia * distancia) / (2 * distancia);
      const alto = Math.sqrt(Math.max(0, MUSLO * MUSLO - base * base));
      const subir = this.d.copy(ARRIBA).addScaledVector(hacia, -hacia.y).normalize();
      const rodilla = subir.multiplyScalar(alto).addScaledVector(hacia, base).add(pata.cadera);

      this.unir(pata.muslo, pata.cadera, rodilla);
      this.unir(pata.tibia, rodilla, tobillo);
      this.unir(pata.tarso, tobillo, pie);
      pata.rodilla.position.copy(rodilla);
      pata.tobillo.position.copy(tobillo);
    }

    actualizar(t, dt) {
      const prisa = 1 + this.energia * 0.8;

      // Camina a paso constante; al llegar al borde da la vuelta en su sitio.
      let velocidad = VELOCIDAD * prisa;
      let zancada = ZANCADA;
      if (this.girando > 0) {
        this.girando -= dt;
        velocidad = 0;
        zancada = ZANCADA * 0.4;
      } else {
        this.grupo.position.x += this.direccion * velocidad * this.grupo.scale.x * dt;
        if (Math.abs(this.grupo.position.x) > this.recorrido && this.grupo.position.x * this.direccion > 0) {
          this.direccion *= -1;
          this.girando = 1.5;
        }
      }

      const meta = this.direccion > 0 ? -0.42 : Math.PI + 0.42;
      this.grupo.rotation.y += (meta - this.grupo.rotation.y) * (1 - Math.exp(-dt * 3.2));

      // Los ciclos por segundo salen de la velocidad, así los pies no resbalan.
      const avancePorCiclo = ZANCADA / APOYO;
      this.fase += dt * (this.girando > 0 ? 1.1 : velocidad / avancePorCiclo);

      this.patas.forEach(function (pata) { this.moverPata(pata, zancada); }, this);

      const paso = this.fase * Math.PI * 4;
      this.cuerpo.position.y = Math.sin(paso) * 0.018;
      this.cuerpo.rotation.x = Math.sin(paso / 2) * 0.022;
      this.abdomen.rotation.z = -0.04 + Math.sin(paso / 2) * 0.035;
      this.abdomen.rotation.y = Math.sin(paso / 2 + 1) * 0.05;
      this.cabeza.rotation.z = 0.05 + Math.sin(paso) * 0.02;

      this.antenas.forEach(function (antena, i) {
        antena.codo.rotation.z = 1.9 + Math.sin(t * 4.4 + i * 2.2) * 0.16;
        antena.base.rotation.x = 2.6 * antena.lado + Math.sin(t * 2.1 + i) * 0.1;
      });

      // Al enviar el formulario abre las mandíbulas y lanza el cubo.
      const abrir = 0.17 + this.energia * 0.32;
      this.mandibulas.forEach(function (item) {
        item.mandibula.rotation.y = -item.lado * abrir;
      });
      this.azucar.position.y = -0.05 + Math.sin(this.energia * Math.PI) * 1.4;
      this.azucar.rotation.z = 0.14 + this.energia * 6;
    }
  }

  window.Animales.Hormiga = Hormiga;
})();
