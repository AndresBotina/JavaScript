// Ejercicio 21. Cálculo de la edad
// A partir de la fecha de nacimiento de una persona y la fecha actual, calcule
// su edad en años cumplidos.
// Datos de prueba: Fecha de nacimiento = 23/04/1993, Fecha actual = la del sistema

let diaNacimiento = 23;
let mesNacimiento = 4;
let anioNacimiento = 1993;

let fechaActual = new Date();
let diaActual = fechaActual.getDate();
let mesActual = fechaActual.getMonth() + 1; // getMonth() cuenta los meses desde 0
let anioActual = fechaActual.getFullYear();

let edad = anioActual - anioNacimiento;

// Si este año todavía no ha llegado el cumpleaños, se resta un año
if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
  edad = edad - 1;
}

console.log(`Fecha de nacimiento: ${diaNacimiento}/${mesNacimiento}/${anioNacimiento}`);
console.log(`Fecha actual: ${diaActual}/${mesActual}/${anioActual}`);
console.log(`Edad: ${edad} años`);
