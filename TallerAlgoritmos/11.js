// Ejercicio 11. Porcentaje de hombres y mujeres
// Un profesor desea saber qué porcentaje de hombres y qué porcentaje de mujeres
// hay en un grupo de estudiantes.
// Datos de prueba: Mujeres = 12, Hombres = 3

let mujeres = 12;
let hombres = 3;

let totalEstudiantes = mujeres + hombres;
let porcentajeMujeres = (mujeres / totalEstudiantes) * 100;
let porcentajeHombres = (hombres / totalEstudiantes) * 100;

console.log(`Total de estudiantes: ${totalEstudiantes}`);
console.log(`Mujeres: ${porcentajeMujeres} %`);
console.log(`Hombres: ${porcentajeHombres} %`);
