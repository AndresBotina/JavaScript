// ejercicio8.js — Juego de adivinar el número secreto

// 1. Referencias a los elementos del HTML
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let registro = document.getElementById("registro");
let intentosTexto = document.getElementById("intentos");
let puntosTexto = document.getElementById("puntos");

// 2. Datos
let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let maximoIntentos = 7;


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  let numeros = document.getElementById("intentosEntrada").value.split(",");
  let intentos = 0;
  let puntos = 100;
  let adivino = false;
  let posicion = 0;
  registro.innerHTML = "";

  while (posicion < numeros.length && intentos < maximoIntentos && !adivino) {
    let numero = parseFloat(numeros[posicion].trim());
    let fila = document.createElement("li");

    if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
      fila.textContent = numeros[posicion].trim() + ": no es un número entre 1 y 100, no cuenta.";
    } else {
      intentos++;
      if (numero === numeroSecreto) {
        adivino = true;
        fila.textContent = "Intento " + intentos + ": " + numero + " ¡Correcto!";
      } else {
        puntos -= 10;
        if (numeroSecreto > numero) {
          fila.textContent = "Intento " + intentos + ": " + numero + ", el número secreto es mayor.";
        } else {
          fila.textContent = "Intento " + intentos + ": " + numero + ", el número secreto es menor.";
        }
      }
    }

    registro.appendChild(fila);
    posicion++;
  }

  intentosTexto.textContent = intentos;
  puntosTexto.textContent = puntos;

  if (adivino) {
    let palabra = intentos === 1 ? " intento." : " intentos.";
    mensaje.textContent = "¡Ganaste! Adivinaste el número en " + intentos + palabra;
  } else if (intentos === maximoIntentos) {
    mensaje.textContent = "Perdiste. El número secreto era " + numeroSecreto + ".";
  } else {
    let quedan = maximoIntentos - intentos;
    let palabra = quedan === 1 ? "queda 1 intento" : "quedan " + quedan + " intentos";
    mensaje.textContent = "Aún no lo adivinas. Te " + palabra + "; usa las pistas y vuelve a jugar.";
  }
}
