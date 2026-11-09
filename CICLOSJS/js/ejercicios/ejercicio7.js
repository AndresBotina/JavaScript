// ejercicio7.js — Nómina semanal de empleados

// 1. Referencias a los elementos del HTML
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let detalleEmpleados = document.getElementById("detalleEmpleados");
let cantidadEmpleadosTexto = document.getElementById("cantidadEmpleados");
let conExtrasTexto = document.getElementById("conExtras");
let totalNominaTexto = document.getElementById("totalNomina");


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  let lineas = document.getElementById("empleadosEntrada").value.split("\n");
  let totalNomina = 0;
  let cantidadEmpleados = 0;
  let conExtras = 0;
  let huboInvalido = false;
  detalleEmpleados.innerHTML = "";

  for (let i = 0; i < lineas.length; i++) {
    if (lineas[i].trim() === "") {
      continue;
    }

    let datos = lineas[i].split(",");
    let horas = parseFloat(datos[0]);
    let valorHora = parseFloat(datos[1]);
    let fila = document.createElement("li");

    if (Number.isNaN(horas) || Number.isNaN(valorHora) || horas <= 0 || valorHora <= 0) {
      huboInvalido = true;
      fila.textContent = "Línea " + (i + 1) + ": datos inválidos, no se cuenta.";
    } else {
      let pago = 0;
      if (horas > 40) {
        let horasExtra = horas - 40;
        pago = 40 * valorHora + horasExtra * valorHora * 1.25;
        conExtras++;
      } else {
        pago = horas * valorHora;
      }
      totalNomina += pago;
      cantidadEmpleados++;
      fila.textContent = "Empleado " + cantidadEmpleados + ": " + horas + " horas, pago $" + pago.toLocaleString("es-CO");
    }

    detalleEmpleados.appendChild(fila);
  }

  if (cantidadEmpleados === 0) {
    mensaje.textContent = "No se registraron empleados válidos.";
    cantidadEmpleadosTexto.textContent = "—";
    conExtrasTexto.textContent = "—";
    totalNominaTexto.textContent = "—";
    return;
  }

  cantidadEmpleadosTexto.textContent = cantidadEmpleados;
  conExtrasTexto.textContent = conExtras;
  totalNominaTexto.textContent = "$" + totalNomina.toLocaleString("es-CO");
  mensaje.textContent = "La empresa pagó $" + totalNomina.toLocaleString("es-CO") + " esta semana.";
  if (huboInvalido) {
    mensaje.textContent += " Se omitieron los registros inválidos.";
  }
}
