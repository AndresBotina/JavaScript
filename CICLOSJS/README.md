# Ciclos en JavaScript

Taller del SENA con ejercicios de ciclos (`for`, `while` y `do-while`), acumuladores y validaciones. Cada ejercicio tiene su propia página y el menú principal está en `index.html`.

## Estructura del proyecto

```text
CICLOSJS/
├── index.html, ejemplos.html, ejercicio1-8.html, reto.html
├── css/
│   ├── estilos.css        Estilos generales de la página y los ejercicios
│   └── efectos.css        Escena 3D y resaltado de resultados
└── js/
    ├── ejercicios/        Lógica de cada ejercicio, sin Three.js
    └── efectos/           Capa visual decorativa
        ├── escena3d.js    Escena 3D y progreso del menú
        ├── animales/      base.js y un archivo por cada animal
        └── vendor/        Three.js
```

La lógica de los ejercicios y la capa visual están separadas:

- **`js/ejercicios/`** contiene solo los ciclos, acumuladores y validaciones. Estos archivos no usan nada de la capa 3D.
- **`js/efectos/`** contiene las animaciones 3D. Cada página elige su animal con `data-animal` en el HTML.

`escena3d.js` también maneja el progreso del menú (`localStorage`, "Listo" y la barra) y el resaltado de resultados. Si se quita la capa visual, esas funciones se pierden.

La capa 3D se desarrolló con apoyo de IA.
