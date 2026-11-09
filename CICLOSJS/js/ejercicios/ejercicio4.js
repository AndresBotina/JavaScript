// ejercicio4.js — Análisis de números ingresados

// 1. Referencias a los elementos del HTML
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
  let pares = 0;
  let impares = 0;
  let sumaPares = 0;
  let sumaImpares = 0;
  let multiplos3 = 0;
  let mayor = 0;
  let cantidadValidos = 0;
  let posicion = 0;
  let numero = parseFloat(numeros[posicion].trim());
  let huboInvalido = false;

  while (posicion < numeros.length && numero !== -1) {
    if (!Number.isInteger(numero) || numero <= 0) {
      huboInvalido = true;
    } else {
      cantidadValidos++;
      if (numero % 2 === 0) {
        pares++;
        sumaPares += numero;
      } else {
        impares++;
        sumaImpares += numero;
      }
      if (numero % 3 === 0) {
        multiplos3++;
      }
      if (numero > mayor) {
        mayor = numero;
      }
    }

    posicion++;
    if (posicion < numeros.length) {
      numero = parseFloat(numeros[posicion].trim());
    }
  }

  if (cantidadValidos === 0) {
    mensaje.textContent = "No se registró ningún número válido.";
    paresTexto.textContent = "—";
    sumaParesTexto.textContent = "—";
    imparesTexto.textContent = "—";
    sumaImparesTexto.textContent = "—";
    multiplos3Texto.textContent = "—";
    mayorTexto.textContent = "—";
    return;
  }

  paresTexto.textContent = pares;
  sumaParesTexto.textContent = sumaPares;
  imparesTexto.textContent = impares;
  sumaImparesTexto.textContent = sumaImpares;
  multiplos3Texto.textContent = multiplos3;
  mayorTexto.textContent = mayor;
  mensaje.textContent = "Se analizaron " + cantidadValidos + " números.";
  if (huboInvalido) {
    mensaje.textContent += " Se omitieron los valores que no eran enteros positivos.";
  }
}
