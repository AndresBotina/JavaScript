// ejercicio4.js — Análisis de números ingresados

// 1. Referencias
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let paresTexto = document.getElementById("pares");
let sumaParesTexto = document.getElementById("sumaPares");
let imparesTexto = document.getElementById("impares");
let sumaImparesTexto = document.getElementById("sumaImpares");
let multiplos3Texto = document.getElementById("multiplos3");
let mayorTexto = document.getElementById("mayor");


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  let numeros = document.getElementById("numerosEntrada").value.split(",");
  let cantidadPares = 0;
  let sumaPares = 0;
  let cantidadImpares = 0;
  let sumaImpares = 0;
  let multiplos3 = 0;
  let mayor = 0;
  let cantidadValidos = 0;
  let huboInvalido = false;
  let posicion = 0;
  let numeroTexto = numeros[posicion].trim();
  let numero = parseInt(numeroTexto, 10);

  do {
    if (numero !== -1) {
      if (Number.isNaN(numero) || !Number.isInteger(Number(numeroTexto)) || numero <= 0) {
        huboInvalido = true;
      } else {
        cantidadValidos++;
        if (numero % 2 === 0) {
          cantidadPares++;
          sumaPares += numero;
        } else {
          cantidadImpares++;
          sumaImpares += numero;
        }
        if (numero % 3 === 0) {
          multiplos3++;
        }
        if (numero > mayor) {
          mayor = numero;
        }
      }
    }

    posicion++;
    if (posicion < numeros.length) {
      numeroTexto = numeros[posicion].trim();
      numero = parseInt(numeroTexto, 10);
    }
  } while (posicion < numeros.length && numero !== -1);

  if (cantidadValidos === 0) {
    mensaje.textContent = "No se registraron números válidos.";
  } else {
    mensaje.textContent = huboInvalido ? "Se omitieron los valores inválidos." : "Análisis completado.";
    paresTexto.textContent = cantidadPares;
    sumaParesTexto.textContent = sumaPares;
    imparesTexto.textContent = cantidadImpares;
    sumaImparesTexto.textContent = sumaImpares;
    multiplos3Texto.textContent = multiplos3;
    mayorTexto.textContent = mayor;
  }
}
