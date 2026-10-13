// Ejercicio 20. Precio de un producto con descuento e IVA
// Se compran varias unidades de un producto. Sobre el subtotal se aplica un
// descuento del 20 % y luego se cobra el IVA del 19 %. Calcule el subtotal,
// el descuento, el IVA y el precio neto a pagar.
// Datos de prueba: Producto = arroz, Cantidad = 5, Valor unitario = $1.200,
// Descuento = 20 %, IVA = 19 %

let producto = "arroz";
let cantidad = 5;
let valorUnitario = 1200;

let subtotal = cantidad * valorUnitario;
let descuento = subtotal * 0.2;
let valorConDescuento = subtotal - descuento;
let iva = valorConDescuento * 0.19;
let precioNeto = valorConDescuento + iva;

console.log(`Producto: ${producto}`);
console.log(`Subtotal: ${cantidad} x $${valorUnitario.toLocaleString("es-CO")} = $${subtotal.toLocaleString("es-CO")}`);
console.log(`Descuento (20 %): $${descuento.toLocaleString("es-CO")}`);
console.log(`IVA (19 %): $${iva.toLocaleString("es-CO")}`);
console.log(`Precio neto a pagar: $${precioNeto.toLocaleString("es-CO")}`);
