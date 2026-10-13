// Ejercicio 2. Promedio de tres notas
// Un estudiante obtiene tres notas en una asignatura. Calcule y muestre su
// nota definitiva como el promedio de las tres notas.
// Datos de prueba: Nota 1 = 3, Nota 2 = 4, Nota 3 = 5

let nota1 = 3;
let nota2 = 4;
let nota3 = 5;

let notaDefinitiva = (nota1 + nota2 + nota3) / 3;

console.log(`Notas: ${nota1}, ${nota2}, ${nota3}`);
console.log(`Nota definitiva: ${notaDefinitiva.toFixed(2)}`);
