// Ejercicio 7. Ganancia de una inversión
// Una persona invierte una cantidad de dinero en un banco que paga un interés
// del 2 % mensual. Calcule cuánto dinero ganará al cabo de un mes.
// Datos de prueba: Nombre = María, Inversión = $1.000.000, Interés = 2 % mensual

let nombre = "María";
let inversion = 1000000;

let ganancia = inversion * 0.02;

console.log(`Nombre: ${nombre}`);
console.log(`Inversión: $${inversion.toLocaleString("es-CO")}`);
console.log(`Ganancia en un mes: $${ganancia.toLocaleString("es-CO")}`);
