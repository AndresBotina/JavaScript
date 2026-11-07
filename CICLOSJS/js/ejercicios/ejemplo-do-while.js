let formDado = document.getElementById("formDado");
let resultadoDado = document.getElementById("resultadoDado");
let listaDado = document.getElementById("listaDado");
formDado.addEventListener("submit", lanzarDado);

function lanzarDado(evento) {
  evento.preventDefault();
  let numeroBuscado = parseInt(document.getElementById("objetivo").value, 10);
  let dado;
  let lanzamientos = 0;
  listaDado.innerHTML = "";

  do {
    dado = Math.floor(Math.random() * 6) + 1;
    lanzamientos++;
    let fila = document.createElement("li");
    fila.textContent = "Lanzamiento " + lanzamientos + ": salió " + dado;
    listaDado.appendChild(fila);
  } while (dado !== numeroBuscado);

  resultadoDado.textContent = "Salió el número buscado en " + lanzamientos + " lanzamiento(s).";
}
