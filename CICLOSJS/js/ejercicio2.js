// ejercicio2.js — Registro de notas de un estudiante

// 1. Referencias
let formulario = document.getElementById("formulario");
let mensaje = document.getElementById("mensaje");
let listaNotas = document.getElementById("listaNotas");
let promedioTexto = document.getElementById("promedio");
let notasAltasTexto = document.getElementById("notasAltas");
let notaMayorTexto = document.getElementById("notaMayor");
let notaMenorTexto = document.getElementById("notaMenor");


// 3. Lógica
formulario.addEventListener("submit", procesarFormulario);

function procesarFormulario(evento) {
  evento.preventDefault();
  let suma = 0;
  let cantidadValidas = 0;
  let notasAltas = 0;
  let mayor = -1;
  let menor = 6;
  listaNotas.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    let nota = parseFloat(document.getElementById("nota" + i).value);
    let fila = document.createElement("li");
    fila.textContent = "Nota " + i + ": " + nota;

    if (Number.isNaN(nota) || nota < 0 || nota > 5) {
      fila.textContent += " (inválida)";
    } else {
      suma += nota;
      cantidadValidas++;
      if (nota >= 3) {
        notasAltas++;
      }
      if (nota > mayor) {
        mayor = nota;
      }
      if (nota < menor) {
        menor = nota;
      }
    }

    listaNotas.appendChild(fila);
  }

  if (cantidadValidas === 0) {
    mensaje.textContent = "No se ingresaron notas válidas.";
    promedioTexto.textContent = "—";
    notasAltasTexto.textContent = "—";
    notaMayorTexto.textContent = "—";
    notaMenorTexto.textContent = "—";
    return;
  }

  let promedio = suma / cantidadValidas;
  promedioTexto.textContent = promedio.toFixed(2);
  notasAltasTexto.textContent = notasAltas;
  notaMayorTexto.textContent = mayor;
  notaMenorTexto.textContent = menor;
  mensaje.textContent = promedio >= 3 ? "Aprobó." : "Reprobó.";
}
