// Ejercicio 23. Tiempo de subida de un escalador
// Un escalador sube 7 metros en 5 horas. Manteniendo el mismo ritmo, ¿cuánto
// tiempo necesita para subir 3 metros?
// Datos de prueba: Altura de referencia = 7 m, Tiempo de referencia = 5 h,
// Altura a subir = 3 m

let alturaReferencia = 7;
let tiempoReferencia = 5;
let alturaSubir = 3;

// Regla de tres: si 7 m toman 5 h, 3 m toman (3 * 5) / 7 h
let tiempoNecesario = (alturaSubir * tiempoReferencia) / alturaReferencia;

console.log(`Si sube ${alturaReferencia} m en ${tiempoReferencia} h,`);
console.log(`para subir ${alturaSubir} m necesita ${tiempoNecesario} horas`);
