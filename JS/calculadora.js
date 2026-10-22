function sumar() {
    let numero1 = parseInt(document.getElementById("numero1").value);
    let numero2 = parseInt(document.getElementById("numero2").value);
    let suma = numero1+ numero2;
    document.getElementById("resultado").value = suma;
}
function restar() {
    let numero1 = parseInt(document.getElementById("numero1").value);
    let numero2 = parseInt(document.getElementById("numero2").value);
    let resta = numero1 - numero2;
    document.getElementById("resultado").value = resta;
}
function multiplicar() {
    let numero1 = parseInt(document.getElementById("numero1").value);
    let numero2 = parseInt(document.getElementById("numero2").value);
    let multiplicacion = numero1 * numero2;
    document.getElementById("resultado").value = multiplicacion;
}

function dividir() {
    let numero1 = parseInt(document.getElementById("numero1").value);
    let numero2 = parseInt(document.getElementById("numero2").value);
    let dividir = numero1 / numero2;
    document.getElementById("resultado").value = dividir;
}

