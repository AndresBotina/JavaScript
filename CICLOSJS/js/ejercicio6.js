// ejercicio6.js — Estadísticas de ventas de un negocio

// 1. Referencias
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let detalleDias = document.getElementById("detalleDias");
let totalVendidoTexto = document.getElementById("totalVendido");
let promedioTexto = document.getElementById("promedio");
let mejorDiaTexto = document.getElementById("mejorDia");
let diasAltosTexto = document.getElementById("diasAltos");


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  let total = 0;
  let diasAltos = 0;
  let ventaMayor = -1;
  let mejorDia = 0;
  let huboInvalido = false;
  detalleDias.innerHTML = "";

  for (let dia = 1; dia <= 7; dia++) {
    let venta = parseFloat(document.getElementById("venta" + dia).value);
    if (Number.isNaN(venta) || venta < 0) {
      venta = 0;
      huboInvalido = true;
    }

    total += venta;
    if (venta > 300000) {
      diasAltos++;
    }
    if (venta > ventaMayor) {
      ventaMayor = venta;
      mejorDia = dia;
    }

    let fila = document.createElement("li");
    fila.textContent = "Día " + dia + ": $" + venta.toLocaleString("es-CO");
    detalleDias.appendChild(fila);
  }

  let promedio = total / 7;
  totalVendidoTexto.textContent = "$" + total.toLocaleString("es-CO");
  promedioTexto.textContent = "$" + promedio.toLocaleString("es-CO", { maximumFractionDigits: 0 });
  mejorDiaTexto.textContent = "Día " + mejorDia;
  diasAltosTexto.textContent = diasAltos;

  if (promedio > 400000) {
    mensaje.textContent = "Rendimiento excelente.";
  } else if (promedio >= 200000) {
    mensaje.textContent = "Rendimiento aceptable.";
  } else {
    mensaje.textContent = "Rendimiento bajo.";
  }
  if (huboInvalido) {
    mensaje.textContent += " Las ventas negativas o inválidas se contaron como 0.";
  }
}
