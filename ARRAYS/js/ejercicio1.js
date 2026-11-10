let listaNombres = []; // Crear un arreglo vacío

let formulario = document.getElementById("formulario");
let inputNombre = document.getElementById("nombre");
// Sin .value para poder modificar después el input.
let lista = document.getElementById("lista");
let cantidad = document.getElementById("cantidad");

// Evento del formulario.
formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    let nombre = inputNombre.value.trim();

    if (nombre === "") {
        alert("Ingrese un nombre");
    } else {
        listaNombres.push(nombre);
        mostrarNombres();

        inputNombre.value = "";
        inputNombre.focus();
    }
});

// Función para mostrar los nombres.
function mostrarNombres() {
    lista.innerHTML = "";

    for (let i = 0; i < listaNombres.length; i++) {
        lista.innerHTML += `<li>${listaNombres[i]}</li>`;
    }

    cantidad.textContent = `Total registrados: ${listaNombres.length}`;
}
