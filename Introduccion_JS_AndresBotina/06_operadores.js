// Modulo 5 - Operadores

// ===== Ejemplo =====
// Operadores aritméticos
let a = 10;
let b = 5;
console.log(a + b); // 15 (suma)
console.log(a % b); // 0 (módulo)
console.log(a ** b); // 100000 (exponenciación)

// Operadores de comparación
console.log(a == 10); // true (igualdad)
console.log(a === "10"); // false (igualdad estricta)
console.log(a > b); // true (mayor que)

// Operadores lógicos
let mayor = a > b;
let par = a % 2 === 0;
console.log(mayor && par); // true (AND)
console.log(!mayor); // false (NOT)

// Operadores de asignación
let c = 20;
c += 10; // c = c + 10
console.log(c); // 30

// ===== Ejercicio 1 =====
let base = 10;
let altura = 5;
let area = base * altura;
console.log(area); // 50

// ===== Ejercicio 2 =====
let num1 = 10;
let num2 = 20;
console.log(num1 < num2); // true

// ===== Ejercicio 3 =====
let esMayor = true;
let esPar = false;
console.log(esMayor && esPar); // false
console.log(esMayor || esPar); // true
// && da false porque necesita que los dos sean true y esPar es false
// || da true porque basta con que uno sea true

// ===== Ejercicio 4 =====
let valor = 10;
valor += 5;
console.log(valor); // 15

// ===== Ejercicio 5 =====
let numero = 8;
console.log(numero > 0 && numero % 2 === 0); // true
