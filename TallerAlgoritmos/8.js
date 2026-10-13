// Ejercicio 8. Sueldo de un vendedor con comisiones
// Un vendedor recibe un sueldo base más un 10 % de comisión sobre sus ventas.
// Si en el mes realizó tres ventas, calcule cuánto obtiene por comisiones y
// cuánto recibirá en total.
// Datos de prueba: Sueldo base = $1.300.000, Venta 1 = $120.000,
// Venta 2 = $130.000, Venta 3 = $140.000, Comisión = 10 %

let sueldoBase = 1300000;
let venta1 = 120000;
let venta2 = 130000;
let venta3 = 140000;

let totalVentas = venta1 + venta2 + venta3;
let comision = totalVentas * 0.1;
let totalRecibir = sueldoBase + comision;

console.log(`Total de ventas: $${totalVentas.toLocaleString("es-CO")}`);
console.log(`Comisión (10 %): $${comision.toLocaleString("es-CO")}`);
console.log(`Total a recibir: $${totalRecibir.toLocaleString("es-CO")}`);
