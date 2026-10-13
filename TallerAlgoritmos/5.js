// Ejercicio 5. Factura con descuento e IVA
// Un almacén aplica un descuento del 10 % sobre el valor de la compra. Al valor
// resultante (subtotal) se le cobra el IVA del 19 %. Calcule el descuento,
// el subtotal, el IVA y el total de la factura.
// Datos de prueba: Valor de la compra = $25.000, Descuento = 10 %, IVA = 19 %

let valorCompra = 25000;

let descuento = valorCompra * 0.1;
let subtotal = valorCompra - descuento;
let iva = subtotal * 0.19;
let total = subtotal + iva;

console.log(`Valor de la compra: $${valorCompra.toLocaleString("es-CO")}`);
console.log(`Descuento (10 %): $${descuento.toLocaleString("es-CO")}`);
console.log(`Subtotal: $${subtotal.toLocaleString("es-CO")}`);
console.log(`IVA (19 %): $${iva.toLocaleString("es-CO")}`);
console.log(`Total a pagar: $${total.toLocaleString("es-CO")}`);
