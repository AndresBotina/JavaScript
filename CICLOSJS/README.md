# Ciclos en JavaScript

Taller del SENA con ejercicios de ciclos (`for`, `while` y `do-while`), acumuladores y validaciones. Cada ejercicio tiene su propia página y el menú principal está en `index.html`.

## Estructura del proyecto

```text
CICLOSJS/
├── index.html, ejemplos.html, ejercicio1-8.html, reto.html
├── css/
│   ├── estilos.css        Estilos generales de la página y los ejercicios
│   └── efectos.css        Escena 3D
└── js/
    ├── progreso.js        Progreso del menú y resaltado de resultados
    ├── ejercicios/        Lógica de cada ejercicio, sin Three.js
    └── efectos/           Capa visual decorativa
        ├── escena3d.js    Escena 3D de cada página
        ├── animales/      base.js y un archivo por cada animal
        └── vendor/        Three.js
```

La lógica de los ejercicios, el progreso del sitio y la capa visual están separados:

- **`js/ejercicios/`** contiene solo los ciclos, acumuladores y validaciones. Estos archivos no usan nada de la capa 3D.
- **`js/progreso.js`** guarda los ejercicios terminados en `localStorage`, pinta "Listo" y la barra del menú, y resalta los resultados nuevos.
- **`js/efectos/`** contiene las animaciones 3D. Cada página elige su animal con `data-animal` en el HTML.

El progreso no depende de la capa visual: si se quita de una página, sigue funcionando. La capa visual solo lee de `progreso.js` cuántos ejercicios están terminados, para que la serpiente del menú crezca.

La capa 3D se desarrolló con apoyo de IA.
