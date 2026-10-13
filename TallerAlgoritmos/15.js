// Ejercicio 15. Ganancia de un conductor
// Un conductor recauda cierta cantidad de dinero en un día de trabajo y recibe
// adicionalmente una bonificación del 19 % sobre lo recaudado. Calcule el valor
// total que gana el conductor ese día.
// Datos de prueba: Recaudo del día = $100.000, Bonificación = 19 %

let recaudo = 100000;

let bonificacion = recaudo * 0.19;
let totalGanado = recaudo + bonificacion;

console.log(`Recaudo del día: $${recaudo.toLocaleString("es-CO")}`);
console.log(`Bonificación (19 %): $${bonificacion.toLocaleString("es-CO")}`);
console.log(`Total ganado: $${totalGanado.toLocaleString("es-CO")}`);
