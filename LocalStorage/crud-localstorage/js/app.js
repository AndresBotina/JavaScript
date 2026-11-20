// 1. VARIABLES Y ESTADO
let formulario = document.getElementById("formulario");

let nombre = document.getElementById("nombre");
let correo = document.getElementById("correo");
let edad = document.getElementById("edad");

let errorNombre = document.getElementById("errorNombre");
let errorCorreo = document.getElementById("errorCorreo");
let errorEdad = document.getElementById("errorEdad");

let tabla = document.getElementById("tablaEstudiantes");
let btnGuardar = document.getElementById("btnGuardar");

let listaEstudiantes = [];

// Variable para controlar la edición
let indiceEditar = -1;

// 2. VALIDAR NOMBRE

function validarNombre() {

    let nombreEstudiante = nombre.value.trim();

    if (nombreEstudiante === "") {
        errorNombre.textContent = "Escribe el nombre del estudiante.";
        return false;
    }
    else if (nombreEstudiante.length < 3) {
        errorNombre.textContent = "El nombre debe tener mínimo 3 caracteres.";
        return false;
    }
    else{
        errorNombre.textContent = "";
        return true;
    }

}

nombre.addEventListener("input", validarNombre);

// 3. VALIDAR CORREO

function validarCorreo() {

    let correoEstudiante = correo.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoEstudiante)) {
        errorCorreo.textContent = "Escribe un correo válido.";
        return false;
    }
    else{
        errorCorreo.textContent = "";
        return true;
    }

}

correo.addEventListener("input", validarCorreo);

// 4. VALIDAR EDAD
function validarEdad() {

    let edadEstudiante = Number(edad.value);

    if (edad.value.trim() === "" || !Number.isInteger(edadEstudiante) || edadEstudiante <= 0) {
        errorEdad.textContent = "Escribe una edad entera mayor que cero.";
        return false;
    }
    else{
        errorEdad.textContent = "";
        return true;
    }

}

edad.addEventListener("input", validarEdad);

// 5. EVENTO DEL FORMULARIO

formulario.addEventListener("submit", registrarEstudiante);

// 6. REGISTRAR Y ACTUALIZAR ESTUDIANTE

function registrarEstudiante(event) {

    event.preventDefault();

    // Validar los campos antes de registrar
    let nombreValido = validarNombre();
    let correoValido = validarCorreo();
    let edadValida = validarEdad();

    if (!nombreValido || !correoValido || !edadValida) {
        return;
    }

    // Obtener los valores de los campos
    let nombreEstudiante = nombre.value.trim();
    let correoEstudiante = correo.value.trim().toLowerCase();
    let edadEstudiante = Number(edad.value);

    // Crear el objeto del estudiante
    let estudiante = {
        nombre: nombreEstudiante,
        correo: correoEstudiante,
        edad: edadEstudiante
    };

    // Verificar si se está editando un estudiante
    if (indiceEditar === -1) {

        // Agregar un nuevo estudiante al arreglo
        listaEstudiantes.push(estudiante);

    } else {

        // Actualizar el estudiante seleccionado
        listaEstudiantes[indiceEditar] = estudiante;

        indiceEditar = -1;

    }

    // Guardar los datos y actualizar la tabla
    localStorage.setItem("estudiantes", JSON.stringify(listaEstudiantes));

    mostrarEstudiantes();

    // Limpiar el formulario
    formulario.reset();

    // Limpiar los mensajes de error
    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorEdad.textContent = "";

    // Restaurar el texto del botón
    btnGuardar.textContent = "Registrar estudiante";

}

// 7. MOSTRAR ESTUDIANTES EN LA TABLA
function mostrarEstudiantes() {
    tabla.innerHTML = "";

    for (let i = 0; i < listaEstudiantes.length; i++) {

        // Agregar una fila por cada estudiante
        tabla.innerHTML += `
            <tr>
                <td>${listaEstudiantes[i].nombre}</td>
                <td>${listaEstudiantes[i].correo}</td>
                <td>${listaEstudiantes[i].edad}</td>
                <td>
                    <button onclick="editarEstudiante(${i})">
                        Editar
                    </button>
                </td>
                <td>
                    <button onclick="eliminarEstudiante(${i})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;

    }

}

// 8. EDITAR ESTUDIANTE

function editarEstudiante(indice) {

    // Cargar los datos del estudiante en los inputs
    nombre.value = listaEstudiantes[indice].nombre;
    correo.value = listaEstudiantes[indice].correo;
    edad.value = listaEstudiantes[indice].edad;

    // Guardar la posición del estudiante seleccionado
    indiceEditar = indice;

    // Cambiar el texto del botón
    btnGuardar.textContent = "Actualizar estudiante";

}

// 9. ELIMINAR ESTUDIANTE


function eliminarEstudiante(indice) {

    // Eliminar el estudiante del arreglo
    listaEstudiantes.splice(indice, 1);

    // Guardar los cambios y actualizar la tabla
    localStorage.setItem("estudiantes", JSON.stringify(listaEstudiantes));
    mostrarEstudiantes();

    // Si se elimina el estudiante que se estaba editando
    if (indiceEditar === indice) {

        indiceEditar = -1;

        formulario.reset();

        btnGuardar.textContent = "Registrar estudiante";

        errorNombre.textContent = "";
        errorCorreo.textContent = "";
        errorEdad.textContent = "";

    }

    // Si se elimina un registro anterior al que se edita
    else if (indiceEditar > indice) {

        indiceEditar--;

    }
}

// 10. CARGAR DATOS AL INICIAR
// ==========================================

// Consultar los estudiantes guardados
let datosGuardados = localStorage.getItem("estudiantes");

// Verificar si existen datos almacenados
if (datosGuardados !== null) {

    listaEstudiantes = JSON.parse(datosGuardados);

}

// Mostrar los estudiantes en la tabla
mostrarEstudiantes();
