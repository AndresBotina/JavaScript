// Ejercicio 10. Calificación final ponderada
// Un estudiante desea saber su calificación final en una materia. La
// calificación se compone así: 55 % del promedio de sus tres notas parciales,
// 30 % de la nota del examen final y 15 % de la nota del trabajo final.
// Datos de prueba: Estudiante = Laura, Parciales = 3.4, 5, 3.2,
// Examen final = 3, Trabajo final = 5

let estudiante = "Laura";
let parcial1 = 3.4;
let parcial2 = 5;
let parcial3 = 3.2;
let examenFinal = 3;
let trabajoFinal = 5;

let promedioParciales = (parcial1 + parcial2 + parcial3) / 3;
let calificacionFinal = promedioParciales * 0.55 + examenFinal * 0.3 + trabajoFinal * 0.15;

console.log(`Estudiante: ${estudiante}`);
console.log(`Promedio de parciales: ${promedioParciales}`);
console.log(`Calificación final: ${calificacionFinal}`);
