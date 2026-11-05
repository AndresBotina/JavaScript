// reto.js — Cajero automático

// 1. Referencias
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let historial = document.getElementById("historial");
let titularTexto = document.getElementById("titular");
let saldoFinalTexto = document.getElementById("saldoFinal");
let totalDepositadoTexto = document.getElementById("totalDepositado");
let totalRetiradoTexto = document.getElementById("totalRetirado");
let operacionesTexto = document.getElementById("operaciones");


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  // TODO: valida titular y saldo al procesar el formulario.
  // TODO: declara saldos y contadores; conserva operacionesPendientes como texto.
  //       Extrae cada textoOperacion con indexOf(";") y slice(), sin arreglos.
  // TODO: do {
  //         opcion = parseInt(textoOperacion, 10);
  //         obtiene el monto despues de ":" con indexOf() y parseFloat();
  //         procesa consultar, depósito, retiro, salir u opción inválida;
  //         agrega el resultado de la operación a historial.
  //       } while (opcion !== 4 && quedan operaciones);
  // TODO: muestra el resumen final con textContent.
}
