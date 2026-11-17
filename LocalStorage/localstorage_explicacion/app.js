const claveNombre = "localstorage_explicacion_nombre";

const formGuardar = document.getElementById("formGuardar");
const nombreGuardar = document.getElementById("nombreGuardar");
const resultadoGuardar = document.getElementById("resultadoGuardar");
const errorNombre = document.getElementById("errorNombre");

// Validar el campo nombre
function validarNombre() {
    const nombre = nombreGuardar.value.trim();
//Validacion de que el nombre no este vacio
    if (nombre === "") {
        errorNombre.textContent = "Escribe un nombre antes de guardarlo.";
        return false;
//Validacion sobre el tamaño del nombre
    } else if (nombre.length < 3) {
        errorNombre.textContent = "El nombre debe tener mínimo 3 caracteres.";
        return false;
    } else {
        errorNombre.textContent = "";
        return true;
    }
}

nombreGuardar.addEventListener("input", validarNombre);

formGuardar.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validarNombre()) {
        resultadoGuardar.textContent = "";
        return;
    }

    const nombre = nombreGuardar.value.trim();
    localStorage.setItem(claveNombre, nombre);
    resultadoGuardar.textContent = "Nombre guardado correctamente.";
    formGuardar.reset();
});

const formMostrar = document.getElementById("formMostrar");
const resultadoMostrar = document.getElementById("resultadoMostrar");

formMostrar.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreGuardado = localStorage.getItem(claveNombre);
    resultadoMostrar.textContent = nombreGuardado === null
        ? "No hay un nombre guardado." 
        : "Nombre guardado: " + nombreGuardado;
});

const formEditar = document.getElementById("formEditar");
const nombreEditar = document.getElementById("nombreEditar");
const resultadoEditar = document.getElementById("resultadoEditar");

formEditar.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nuevoNombre = nombreEditar.value.trim();
    if (nuevoNombre === "") {
        resultadoEditar.textContent = "Escribe el nuevo nombre.";
        return;
    }

    localStorage.setItem(claveNombre, nuevoNombre);
    resultadoEditar.textContent = "Nombre actualizado correctamente.";
    formEditar.reset();
});

const formEliminar = document.getElementById("formEliminar");
const resultadoEliminar = document.getElementById("resultadoEliminar");

formEliminar.addEventListener("submit", function (evento) {
    evento.preventDefault();

    localStorage.removeItem(claveNombre);
    resultadoEliminar.textContent = "Nombre eliminado.";
});







