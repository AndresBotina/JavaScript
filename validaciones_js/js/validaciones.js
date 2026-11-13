// BLOQUE 1. VALIDAR NOMBRE
function validarNombre() {
    const nombre = document.getElementById("nombre").value.trim();
    const errorNombre = document.getElementById("errorNombre");

    if (nombre.length < 3) {
        errorNombre.textContent = "El nombre debe tener mínimo 3 caracteres.";
        return false;
    } else {
        errorNombre.textContent = "";
        return true;
    }
}

document.getElementById("nombre").addEventListener("input", validarNombre);

// BLOQUE 2. VALIDAR APELLIDOS
function validarApellidos() {
    const apellidos = document.getElementById("apellidos").value.trim();
    const errorApellidos = document.getElementById("errorApellidos");

    if (apellidos.length < 3) {
        errorApellidos.textContent = "Los apellidos deben tener mínimo 3 caracteres.";
        return false;
    } else {
        errorApellidos.textContent = "";
        return true;
    }
}

document.getElementById("apellidos").addEventListener("input", validarApellidos);

// BLOQUE 3. VALIDAR DOCUMENTO
function validarDocumento() {
    const documento = document.getElementById("documento").value.trim();
    const errorDocumento = document.getElementById("errorDocumento");

    // ! significa NOT (negación): indica que el patrón NO se debe cumplir.
    // / / delimitan la expresión regular.
    // ^ indica el inicio del texto.
    // \d representa un dígito del 0 al 9.
    // {6,10} indica que debe tener entre 6 y 10 dígitos.
    // $ indica el final del texto.
    // .test() comprueba si el documento cumple el patrón.

    if (!/^\d{6,10}$/.test(documento)) {
        errorDocumento.textContent = "Ingrese un documento entre 6 y 10 números.";
        return false;
    } else {
        errorDocumento.textContent = "";
        return true;
    }
}

document.getElementById("documento").addEventListener("input", validarDocumento);

// BLOQUE 4. VALIDAR CORREO
function validarCorreo() {
    const correo = document.getElementById("correo").value.trim();
    const errorCorreo = document.getElementById("errorCorreo");

    // ^ indica el inicio del texto.
    // [^\s@]+ permite uno o más caracteres que no sean espacios ni arrobas.
    // @ exige que exista una arroba.
    // [^\s@]+ exige caracteres después de la arroba, sin espacios ni otra arroba.
    // \. exige un punto después del dominio.
    // [^\s@]+ exige caracteres después del punto.
    // $ indica el final del texto.
    // .test() comprueba si el correo cumple el patrón.
    // ! niega el resultado: si NO cumple, muestra el error.

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        errorCorreo.textContent = "Ingrese un correo electrónico válido.";
        return false;
    } else {
        errorCorreo.textContent = "";
        return true;
    }
}

document.getElementById("correo").addEventListener("input", validarCorreo);
