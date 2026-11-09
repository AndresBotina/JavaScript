// ejercicio5.js — Sistema de inicio de sesión

// 1. Referencias a los elementos del HTML
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let registro = document.getElementById("registro");
let intentosTexto = document.getElementById("intentos");

// 2. Datos
let contrasenaCorrecta = "sena123";
let maximoIntentos = 3;


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  let intento = 1;
  let intentosUsados = 0;
  let accedio = false;
  let sinMasIntentos = false;
  registro.innerHTML = "";

  while (intento <= maximoIntentos && !accedio && !sinMasIntentos) {
    let clave = document.getElementById("contrasena" + intento).value;

    if (clave === "") {
      sinMasIntentos = true;
    } else {
      intentosUsados++;
      let fila = document.createElement("li");

      if (clave === contrasenaCorrecta) {
        accedio = true;
        fila.textContent = "Intento " + intento + ": contraseña correcta.";
      } else {
        fila.textContent = "Intento " + intento + ": contraseña incorrecta.";
      }

      registro.appendChild(fila);
    }

    intento++;
  }

  intentosTexto.textContent = intentosUsados;

  if (accedio) {
    mensaje.textContent = "¡Bienvenido! Ingresó en el intento " + intentosUsados + ".";
  } else if (intentosUsados === maximoIntentos) {
    mensaje.textContent = "Acceso bloqueado. Se agotaron los 3 intentos.";
  } else {
    let quedan = maximoIntentos - intentosUsados;
    mensaje.textContent = "Contraseña incorrecta. Le quedan " + quedan + " intentos.";
  }
}
