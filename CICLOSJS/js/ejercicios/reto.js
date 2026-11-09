// reto.js — Cajero automático

// 1. Referencias a los elementos del HTML
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let historial = document.getElementById("historial");
let titularTexto = document.getElementById("titular");
let saldoFinalTexto = document.getElementById("saldoFinal");
let totalDepositadoTexto = document.getElementById("totalDepositado");
let totalRetiradoTexto = document.getElementById("totalRetirado");
let operacionesTexto = document.getElementById("operaciones");

// 2. Datos
let maximoDeposito = 2000000;
let maximoRetiros = 3;


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function agregarAlHistorial(texto) {
  let fila = document.createElement("li");
  fila.textContent = texto;
  historial.appendChild(fila);
}

function procesarFormulario(evento) {
  evento.preventDefault();
  let titular = document.getElementById("titularEntrada").value.trim();
  let saldo = parseFloat(document.getElementById("saldoEntrada").value);
  let texto = document.getElementById("operacionesEntrada").value + ";";
  let totalDepositado = 0;
  let totalRetirado = 0;
  let exitosas = 0;
  let retiros = 0;
  let opcion = 0;
  let inicio = 0;
  historial.innerHTML = "";

  if (Number.isNaN(saldo) || saldo < 0) {
    mensaje.textContent = "El saldo inicial debe ser un número mayor o igual a 0.";
    return;
  }

  do {
    // Se toma la operación que va desde "inicio" hasta el siguiente ";"
    let fin = texto.indexOf(";", inicio);
    let operacion = texto.slice(inicio, fin).trim();
    inicio = fin + 1;

    if (operacion !== "") {
      // Si tiene ":" se separa la opción del monto
      let dosPuntos = operacion.indexOf(":");
      let monto = NaN;
      if (dosPuntos === -1) {
        opcion = parseInt(operacion);
      } else {
        opcion = parseInt(operacion.slice(0, dosPuntos));
        monto = parseFloat(operacion.slice(dosPuntos + 1));
      }

      if (opcion === 1) {
        agregarAlHistorial("Consulta: el saldo es $" + saldo.toLocaleString("es-CO") + ".");
        exitosas++;
      } else if (opcion === 2) {
        if (Number.isNaN(monto) || monto <= 0) {
          agregarAlHistorial("Depósito rechazado: el valor debe ser mayor que 0.");
        } else if (monto > maximoDeposito) {
          agregarAlHistorial("Depósito rechazado: el máximo por depósito es $2.000.000.");
        } else {
          saldo += monto;
          totalDepositado += monto;
          exitosas++;
          agregarAlHistorial("Depósito de $" + monto.toLocaleString("es-CO") + ". Nuevo saldo: $" + saldo.toLocaleString("es-CO") + ".");
        }
      } else if (opcion === 3) {
        if (retiros === maximoRetiros) {
          agregarAlHistorial("Retiro rechazado: ya hizo los 3 retiros permitidos.");
        } else if (Number.isNaN(monto) || monto <= 0) {
          agregarAlHistorial("Retiro rechazado: el valor debe ser mayor que 0.");
        } else if (monto % 10000 !== 0) {
          agregarAlHistorial("Retiro rechazado: el valor debe ser múltiplo de $10.000.");
        } else if (monto > saldo) {
          agregarAlHistorial("Retiro rechazado: saldo insuficiente.");
        } else {
          saldo -= monto;
          totalRetirado += monto;
          retiros++;
          exitosas++;
          agregarAlHistorial("Retiro de $" + monto.toLocaleString("es-CO") + ". Nuevo saldo: $" + saldo.toLocaleString("es-CO") + ".");
        }
      } else if (opcion === 4) {
        agregarAlHistorial("Salir: sesión finalizada.");
      } else {
        agregarAlHistorial("Opción \"" + operacion + "\" no existe. Menú: 1 Consultar, 2 Depositar, 3 Retirar, 4 Salir.");
      }
    }
  } while (opcion !== 4 && inicio < texto.length);

  titularTexto.textContent = titular;
  saldoFinalTexto.textContent = "$" + saldo.toLocaleString("es-CO");
  totalDepositadoTexto.textContent = "$" + totalDepositado.toLocaleString("es-CO");
  totalRetiradoTexto.textContent = "$" + totalRetirado.toLocaleString("es-CO");
  operacionesTexto.textContent = exitosas;

  if (opcion === 4) {
    mensaje.textContent = "Gracias por usar el cajero, " + titular + ".";
  } else {
    mensaje.textContent = "Las operaciones terminaron sin la opción 4; la sesión se cerró automáticamente.";
  }
}
