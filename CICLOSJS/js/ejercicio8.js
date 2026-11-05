// ejercicio8.js — Juego de adivinar el número

// 1. Referencias
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let intentosTexto = document.getElementById("intentos");
let puntosTexto = document.getElementById("puntos");
let registro = document.getElementById("registro");


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  let secreto = 42; // para probar; luego: Math.floor(Math.random() * 100) + 1
  let intentosEntrada = document.getElementById("intentosEntrada").value.split(",");
  let intentos = 0;
  let maxIntentos = 7;
  let puntos = 100;
  let adivino = false;
  let posicion = 0;
  registro.innerHTML = "";

  while (intentos < maxIntentos && posicion < intentosEntrada.length && adivino === false) {
    let textoNumero = intentosEntrada[posicion].trim();
    let numero = parseInt(textoNumero, 10);
    let fila = document.createElement("li");

    if (Number.isNaN(numero) || !Number.isInteger(Number(textoNumero)) || numero < 1 || numero > 100) {
      fila.textContent = textoNumero + ": inválido; no cuenta como intento.";
    } else {
      intentos++;
      if (numero === secreto) {
        adivino = true;
        fila.textContent = numero + ": correcto.";
      } else if (numero < secreto) {
        puntos -= 10;
        fila.textContent = numero + ": el secreto es mayor.";
      } else {
        puntos -= 10;
        fila.textContent = numero + ": el secreto es menor.";
      }
    }

    registro.appendChild(fila);
    posicion++;
  }

  intentosTexto.textContent = intentos;
  puntosTexto.textContent = puntos;
  mensaje.textContent = adivino
    ? "¡Adivinaste el número secreto!"
    : "No adivinaste. El número secreto era " + secreto + ".";
}
