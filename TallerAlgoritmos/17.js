// Ejercicio 17. Pago de matrícula en cuotas
// Una universidad permite pagar la matrícula en cuatro cuotas: la primera
// corresponde al 40 %, la segunda al 25 %, la tercera al 20 % y la cuarta al
// 15 % del valor total. Calcule el valor de cada cuota.
// Datos de prueba: Valor de la matrícula = $5.000.000

let valorMatricula = 5000000;

let cuota1 = valorMatricula * 0.4;
let cuota2 = valorMatricula * 0.25;
let cuota3 = valorMatricula * 0.2;
let cuota4 = valorMatricula * 0.15;

console.log(`Valor de la matrícula: $${valorMatricula.toLocaleString("es-CO")}`);
console.log(`Cuota 1 (40 %): $${cuota1.toLocaleString("es-CO")}`);
console.log(`Cuota 2 (25 %): $${cuota2.toLocaleString("es-CO")}`);
console.log(`Cuota 3 (20 %): $${cuota3.toLocaleString("es-CO")}`);
console.log(`Cuota 4 (15 %): $${cuota4.toLocaleString("es-CO")}`);
