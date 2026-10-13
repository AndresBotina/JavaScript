// Modulo 4 - Tipos de datos

// ===== Ejemplo =====
// String
let nombre = "Juan";
console.log(typeof nombre); // "string"

// Number
let edad = 25;
let precioUnitario = 19.99;
console.log(typeof edad); // "number"

// Boolean
let esMayorDeEdad = true;
console.log(typeof esMayorDeEdad); // "boolean"

// Null
let direccion = null;
console.log(typeof direccion); // "object" (esto es un error histórico en JavaScript)

// Undefined
let telefono;
console.log(typeof telefono); // "undefined"

// Symbol
let codigo = Symbol("id");
console.log(typeof codigo); // "symbol"

// Object
let persona = { nombre: "Ana", edad: 30 };
console.log(typeof persona); // "object"

// ===== Ejercicio 1 =====
let ciudad = "Madrid";
console.log(typeof ciudad); // "string"

// ===== Ejercicio 2 =====
let precio = 99.99;
let descuento = true;
console.log(typeof precio); // "number"
console.log(typeof descuento); // "boolean"

// ===== Ejercicio 3 =====
let auto;
console.log(typeof auto); // "undefined"

// ===== Ejercicio 4 =====
let id = Symbol("id");
console.log(typeof id); // "symbol"
