// Taller 4
let formulario = document.getElementById("formTaller4");
let resultado = document.getElementById("resultado");

formulario.addEventListener("submit", validarRegistro);

function validarRegistro(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let textoEdad = document.getElementById("edad").value;
    let correo = document.getElementById("correo").value;
    let clave = document.getElementById("clave").value;
    let confirmar = document.getElementById("confirmar").value;

    resultado.className = "mensaje error";

    if (nombre === "") {
        resultado.innerText = "Escribe tu nombre.";
        return;
    }

    if (textoEdad === "") {
        resultado.innerText = "Escribe tu edad.";
        return;
    }

    let edad = Number(textoEdad);

    if (!Number.isInteger(edad) || edad < 18 || edad > 100) {
        resultado.innerText = "La edad debe ser un número entero entre 18 y 100.";
        return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
        resultado.innerText = "Escribe un correo válido.";
        return;
    }

    if (clave != confirmar) {
        resultado.innerText = "Las contraseñas no coinciden.";
        return;
    }

    resultado.className = "mensaje exito";
    resultado.innerText = `Registro exitoso. Bienvenido(a), ${nombre}.`;
}
