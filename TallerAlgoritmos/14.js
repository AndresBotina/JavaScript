// Ejercicio 14. Venta con IVA y cambio al cliente
// Se realiza una venta a la que debe sumarse el IVA del 19 %. El cliente paga
// en efectivo. Calcule el valor del IVA, el total a pagar y el cambio (vueltas)
// que se le debe devolver al cliente.
// Datos de prueba: Valor de la venta = $30.000, IVA = 19 %,
// Efectivo entregado = $50.000

let valorVenta = 30000;
let efectivo = 50000;

let iva = valorVenta * 0.19;
let totalPagar = valorVenta + iva;
let cambio = efectivo - totalPagar;

console.log(`Valor de la venta: $${valorVenta.toLocaleString("es-CO")}`);
console.log(`IVA (19 %): $${iva.toLocaleString("es-CO")}`);
console.log(`Total a pagar: $${totalPagar.toLocaleString("es-CO")}`);
console.log(`Efectivo entregado: $${efectivo.toLocaleString("es-CO")}`);
console.log(`Cambio: $${cambio.toLocaleString("es-CO")}`);
