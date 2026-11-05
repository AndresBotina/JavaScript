// Ejemplo 1: break
// El ciclo se detiene al llegar al 4, por eso el 4 no se muestra
console.log("Ejemplo 1: break");

for (let i = 1; i <= 10; i++) {
  if (i === 4) {
    break;
  }
  console.log(i);
}

console.log("El ciclo terminó");

// Ejemplo 2: continue
// Muestra del 1 al 5, pero salta el 3
console.log("Ejemplo 2: continue");

for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }
  console.log(i);
}

// Ejercicio 1: for del 1 al 10, usar break al llegar a 7
console.log("Ejercicio 1: break al llegar a 7");

for (let i = 1; i <= 10; i++) {
  if (i === 7) {
    break;
  }
  console.log(i);
}

// Ejercicio 2: for del 1 al 10, usar continue para mostrar solo los impares
console.log("Ejercicio 2: solo impares con continue");

for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue;
  }
  console.log(i);
}
