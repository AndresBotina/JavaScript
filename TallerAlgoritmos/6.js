// Ejercicio 6. Conversión de tiempo a segundos
// Dada una cantidad de tiempo medida en horas, minutos y segundos, diga a
// cuántos segundos equivale.
// Datos de prueba: Horas = 2, Minutos = 30, Segundos = 15

let horas = 2;
let minutos = 30;
let segundos = 15;

let totalSegundos = horas * 3600 + minutos * 60 + segundos;

console.log(`${horas} h, ${minutos} min y ${segundos} s equivalen a ${totalSegundos} segundos`);
