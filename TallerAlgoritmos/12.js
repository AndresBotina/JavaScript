// Ejercicio 12. Salario por horas trabajadas
// Calcule el salario de un trabajador a partir del número de horas trabajadas
// y el valor que se le paga por cada hora.
// Datos de prueba: Horas trabajadas = 5, Valor por hora = $9.514

let horasTrabajadas = 5;
let valorHora = 9514;

let salario = horasTrabajadas * valorHora;

console.log(`Horas trabajadas: ${horasTrabajadas}`);
console.log(`Valor por hora: $${valorHora.toLocaleString("es-CO")}`);
console.log(`Salario: $${salario.toLocaleString("es-CO")}`);
