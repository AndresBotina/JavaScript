// Taller 5
let formulario = document.getElementById("formTaller5");
let resultado = document.getElementById("resultado");

formulario.addEventListener("submit", calcular);

function calcular(event) {
    event.preventDefault();

    let texto1 = document.getElementById("primero").value;
    let texto2 = document.getElementById("segundo").value;
    let operacion = document.getElementById("operacion").value;

    resultado.className = "mensaje error";

    if (texto1 === "" || texto2 === "") {
        resultado.innerText = "Escribe los dos números.";
        return;
    }

    if (operacion === "") {
        resultado.innerText = "Selecciona una operación.";
        return;
    }

    let numero1 = Number(texto1);
    let numero2 = Number(texto2);

    if (operacion === "division" && numero2 == 0) {
        resultado.innerText = "No es posible dividir entre cero.";
        return;
    }

    let total;
    let simbolo;

    switch (operacion) {
        case "suma":
            total = numero1 + numero2;
            simbolo = "+";
            break;
        case "resta":
            total = numero1 - numero2;
            simbolo = "−";
            break;
        case "multiplicacion":
            total = numero1 * numero2;
            simbolo = "×";
            break;
        case "division":
            total = numero1 / numero2;
            simbolo = "÷";
            break;
    }

    resultado.className = "mensaje exito";
    resultado.innerText = `${numero1} ${simbolo} ${numero2} = ${total}`;
}
