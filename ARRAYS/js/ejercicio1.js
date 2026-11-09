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

    // Revisa si el nombre ya existe, sin importar mayúsculas o minúsculas.
    let repetido = false;
    for (let i = 0; i < listaNombres.length; i++) {
        if (listaNombres[i].toLowerCase() === nombre.toLowerCase()) {
            repetido = true;
        }
    }

    if (nombre === "") {
        alert("Ingrese un nombre");
        inputNombre.style.backgroundColor = "yellow"
    } else if (repetido) {
        alert("Ese nombre ya está registrado");
        inputNombre.style.backgroundColor = "red"
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
