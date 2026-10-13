// Ejercicio 9. Descuento del 15 % en una compra
// Una tienda ofrece un descuento del 15 % sobre el total de la compra. Dado el
// nombre del cliente y el valor de su compra, determine cuánto debe pagar.
// Datos de prueba: Cliente = Alejandro, Valor de la compra = $50.000,
// Descuento = 15 %

let cliente = "Alejandro";
let valorCompra = 50000;

let descuento = valorCompra * 0.15;
let totalPagar = valorCompra - descuento;

console.log(`Cliente: ${cliente}`);
console.log(`Valor de la compra: $${valorCompra.toLocaleString("es-CO")}`);
console.log(`Descuento (15 %): $${descuento.toLocaleString("es-CO")}`);
console.log(`Total a pagar: $${totalPagar.toLocaleString("es-CO")}`);
