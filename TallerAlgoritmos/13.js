// Ejercicio 13. Factura de venta de varios productos
// Elabore una factura de venta para la compra de cuatro productos. Para cada
// producto muestre la cantidad, el precio unitario y su subtotal. Luego calcule
// el subtotal general, el IVA del 19 % y el total a pagar, junto con la fecha
// de la compra.
// Datos de prueba: Mouse: 3 × $15.000, Teclado: 1 × $20.000,
// Monitor: 1 × $100.000, CPU: 2 × $800.000, IVA = 19 %

let cantidadMouse = 3;
let precioMouse = 15000;
let cantidadTeclado = 1;
let precioTeclado = 20000;
let cantidadMonitor = 1;
let precioMonitor = 100000;
let cantidadCpu = 2;
let precioCpu = 800000;

let subtotalMouse = cantidadMouse * precioMouse;
let subtotalTeclado = cantidadTeclado * precioTeclado;
let subtotalMonitor = cantidadMonitor * precioMonitor;
let subtotalCpu = cantidadCpu * precioCpu;

let subtotalGeneral = subtotalMouse + subtotalTeclado + subtotalMonitor + subtotalCpu;
let iva = subtotalGeneral * 0.19;
let totalPagar = subtotalGeneral + iva;

let fecha = new Date().toLocaleDateString();

console.log("===== FACTURA DE VENTA =====");
console.log(`Fecha: ${fecha}`);
console.log(`Mouse: ${cantidadMouse} x $${precioMouse.toLocaleString("es-CO")} = $${subtotalMouse.toLocaleString("es-CO")}`);
console.log(`Teclado: ${cantidadTeclado} x $${precioTeclado.toLocaleString("es-CO")} = $${subtotalTeclado.toLocaleString("es-CO")}`);
console.log(`Monitor: ${cantidadMonitor} x $${precioMonitor.toLocaleString("es-CO")} = $${subtotalMonitor.toLocaleString("es-CO")}`);
console.log(`CPU: ${cantidadCpu} x $${precioCpu.toLocaleString("es-CO")} = $${subtotalCpu.toLocaleString("es-CO")}`);
console.log(`Subtotal: $${subtotalGeneral.toLocaleString("es-CO")}`);
console.log(`IVA (19 %): $${iva.toLocaleString("es-CO")}`);
console.log(`Total a pagar: $${totalPagar.toLocaleString("es-CO")}`);
