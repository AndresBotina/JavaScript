// Ejercicio 19. Datos del aprendiz y promedio de cinco notas
// Registre el nombre de un aprendiz, su programa de formación, su número de
// ficha y cinco notas. Calcule la nota definitiva como el promedio de las cinco
// notas y muestre toda la información.
// Datos de prueba: Aprendiz = Andrés, Programa = ADSO, Ficha = 3065908,
// Notas = 3.5, 4, 4.5, 5, 4.2

let aprendiz = "Andrés";
let programa = "ADSO";
let ficha = 3065908;
let nota1 = 3.5;
let nota2 = 4;
let nota3 = 4.5;
let nota4 = 5;
let nota5 = 4.2;

let notaDefinitiva = (nota1 + nota2 + nota3 + nota4 + nota5) / 5;

console.log(`Aprendiz: ${aprendiz}`);
console.log(`Programa: ${programa}`);
console.log(`Ficha: ${ficha}`);
console.log(`Notas: ${nota1}, ${nota2}, ${nota3}, ${nota4}, ${nota5}`);
console.log(`Nota definitiva: ${notaDefinitiva}`);
