// Modulo 3 - Comentarios

// ===== Comentario de una linea =====
// Esto es un comentario de una línea
let x = 10; // Esto también es un comentario

// ===== Comentario de varias lineas =====
/* Esto es un comentario
que abarca múltiples líneas.
Puedes escribir lo que quieras aquí. */
let y = 20;

// ===== Ejemplo combinado =====
// Declaración de una variable
let nombre = "Juan";

/*
  Este es un bloque de comentario
  que explica el siguiente código.
  La función saludar imprime un mensaje en la consola.
*/
function saludar() {
  console.log("Hola, " + nombre);
}

saludar(); // Llamada a la función

// ===== Asignacion de valores =====
// ejemplo basico
let nombrePersona = "Juan";

// asignacion directa
let edad = 25; // La variable "edad" almacena el número 25.

// asignacion a partir de una operacion
let total = 10 + 5; // La variable "total" almacena el resultado de 10 + 5, que es 15.

// asignacion a partir de otra variable
let a = 10;
let b = a; // La variable "b" almacena el valor de "a", que es 10.

// asignacion dinamica
// prompt solo funciona en el navegador, en Code Runner da error, por eso queda comentado
// let nombreUsuario = prompt("Ingresa tu nombre:"); // El valor de "nombreUsuario" depende de lo que el usuario ingrese.

console.log(x, y, nombrePersona, edad, total, b);

// ===== console.log con comillas invertidas =====
// esto no es un comentario, es un texto de varias lineas (template literal)
// si se ejecuta y se muestra en la consola
let estudiante = "Andres";
let curso = "JavaScript";
let modulo = 3;
let aprobado = true;
console.log(`Estudiante: ${estudiante}
Curso: ${curso}
Modulo: ${modulo}
Aprobado: ${aprobado}`);
