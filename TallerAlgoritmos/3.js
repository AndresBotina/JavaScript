// Ejercicio 3. Nota definitiva con porcentajes y aprobación
// Un estudiante presenta tres evaluaciones con los siguientes pesos: la primera
// vale el 20 %, la segunda el 30 % y la tercera el 50 %. Calcule la nota
// definitiva e indique si el estudiante aprueba (nota mayor o igual a 3.5)
// o no aprueba.
// Datos de prueba: Estudiante = Eliana, Nota 1 = 3 (20 %), Nota 2 = 4 (30 %),
// Nota 3 = 3.3 (50 %)

let estudiante = "Eliana";
let nota1 = 3;
let nota2 = 4;
let nota3 = 3.3;

let promedio = nota1 * 0.2 + nota2 * 0.3 + nota3 * 0.5;

console.log(`Estudiante: ${estudiante}`);
console.log(`Promedio: ${promedio}`);

if (promedio >= 3.5) {
  console.log("Resultado: Aprueba");
} else {
  console.log("Resultado: No aprueba");
}
