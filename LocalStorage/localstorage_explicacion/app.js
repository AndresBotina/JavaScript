const claveNombre = "localstorage_explicacion_nombre";

const nombreGuardar = document.getElementById("nombreGuardar");
const resultadoGuardar = document.getElementById("resultadoGuardar");

function guardarNombre(){

    let nombre = document.getElementById("nombreGuardar").value.trim();

    if(nombre === ""){
        alert("Por favor ingrese el nombre");
        return;
    }else{
        let listaNombres = JSON.parse(localStorage.getItem("Nombre")) || [];
        listaNombres.push(nombre);

        localStorage.setItem("Nombre", JSON.stringify(listaNombres));

        document.getElementById("nombreGuardar").value = "";
        document.getElementById("resultadoGuardar").innerText = `Nombre guardado ${nombre}`;
    }
}

function mostrarNombre() {
    let listaNombres = JSON.parse(localStorage.getItem("Nombre")) || [];
    let resultado = document.getElementById("resultadoMostrar");
    resultado.textContent = "";

    if (listaNombres.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No hay nombres guardados";
        resultado.appendChild(item);
        return;
    }

    listaNombres.forEach(function (nombre) {
        const item = document.createElement("li");
        item.textContent = nombre;
        resultado.appendChild(item);
    });
}

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

const formMascota = document.getElementById("formMascota");

formMascota.addEventListener("submit", (event) => {
    event.preventDefault();

    const mascota = {
        nombre: document.getElementById("mascota").value,
        raza: document.getElementById("raza").value,
        edad: Number(document.getElementById("edad").value)
    };

    localStorage.setItem("mascota", JSON.stringify(mascota));
});
