# Día 1 - Formulario con 2 inputs validados

El HTML y el CSS ya están hechos. Escribe el JS en `js/app.js`.

## Qué debe hacer

1. **Validar el nombre** (`nombre` → error en `errorNombre`)
   - Si está vacío: "Escribe tu nombre."
   - Si tiene menos de 3 caracteres: "El nombre debe tener mínimo 3 caracteres."
   - Si está bien: borrar el mensaje de error.

2. **Validar la edad** (`edad` → error en `errorEdad`)
   - Si está vacía: "Escribe tu edad."
   - Si es menor que 1 o mayor que 100: "La edad debe estar entre 1 y 100."
   - Si está bien: borrar el mensaje de error.

3. Que cada campo se valide **mientras se escribe** (evento `input`).

4. Al enviar el formulario (evento `submit`):
   - Evitar que la página se recargue.
   - Si alguno de los dos campos no es válido, no mostrar el resultado.
   - Si los dos están bien, mostrar en `resultado`:
     - Si la edad es 18 o más: "Hola Carlos, tienes 20 años y eres mayor de edad."
     - Si es menor: "Hola Carlos, tienes 15 años y eres menor de edad."
   - Limpiar el formulario.

## Pistas
- Haz una función por campo (`validarNombre`, `validarEdad`) que devuelva `true` o `false`, como en `validaciones_js`.
- Usa `.value.trim()` para el texto y `Number()` para la edad.
