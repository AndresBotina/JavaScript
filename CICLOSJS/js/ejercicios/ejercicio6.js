// ejercicio6.js — Análisis de ventas de siete días

// 1. Referencias a los elementos del HTML
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
  let diasValidos = 0;
  let diasAltos = 0;
  let mayorVenta = -1;
  let mejorDia = 0;
  detalleDias.innerHTML = "";

  for (let dia = 1; dia <= 7; dia++) {
    let venta = parseFloat(document.getElementById("venta" + dia).value);
    let fila = document.createElement("li");

    if (Number.isNaN(venta) || venta < 0) {
      fila.textContent = "Día " + dia + ": valor inválido, no se cuenta.";
    } else {
      fila.textContent = "Día " + dia + ": $" + venta.toLocaleString("es-CO");
      total += venta;
      diasValidos++;
      if (venta > 300000) {
        diasAltos++;
      }
      if (venta > mayorVenta) {
        mayorVenta = venta;
        mejorDia = dia;
      }
    }

    detalleDias.appendChild(fila);
  }

  if (diasValidos === 0) {
    mensaje.textContent = "No se registraron ventas válidas.";
    totalVendidoTexto.textContent = "—";
    promedioTexto.textContent = "—";
    mejorDiaTexto.textContent = "—";
    diasAltosTexto.textContent = "—";
    return;
  }

  let promedio = total / diasValidos;
  totalVendidoTexto.textContent = "$" + total.toLocaleString("es-CO");
  promedioTexto.textContent = "$" + promedio.toLocaleString("es-CO", { maximumFractionDigits: 0 });
  mejorDiaTexto.textContent = "Día " + mejorDia + " ($" + mayorVenta.toLocaleString("es-CO") + ")";
  diasAltosTexto.textContent = diasAltos;

  if (promedio > 400000) {
    mensaje.textContent = "Rendimiento excelente.";
  } else if (promedio >= 200000) {
    mensaje.textContent = "Rendimiento aceptable.";
  } else {
    mensaje.textContent = "Rendimiento bajo.";
  }
  if (diasValidos < 7) {
    mensaje.textContent += " Se omitieron las ventas negativas.";
  }
}
