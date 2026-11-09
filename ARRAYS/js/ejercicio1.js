let listaNombres = []; // Crear un arreglo vacío
//crear variables: input, botonagregar, lista, et
let inputNombre = document.getElementById("nombre");

// Sin .value para poder modificar después el input.
let btnAgregar = document.getElementById("btnAgregar");
let lista = document.getElementById("lista");
let cantidad = document.getElementById("cantidad");

// Evento del botón.
btnAgregar.addEventListener("click", function() {
    let nombre = inputNombre.value.trim();

    if (nombre === "") {
        alert("Ingrese un nombre");
        inputNombre.style.backgroundColor = "yellow"
    } else if (listaNombres.includes(nombre)) {
        alert("Ese nombre ya está registrado");
        inputNombre.style.backgroundColor = "yellow"
    } else {
        listaNombres.push(nombre);
        mostrarNombres();
        inputNombre.value = "";
        inputNombre.focus();
        //Quita el color de fondo rojo
        inputNombre.style.backgroundColor = "white"

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
