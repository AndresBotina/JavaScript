let resultado = document.getElementById("resultado");
let formulario = document.getElementById("formTaller1");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    let texto = document.getElementById("numero").value;

    if (texto === "") {
        resultado.innerText = "Escribe un número.";
        return;
    }

    let numero = Number(texto);

    if (!Number.isInteger(numero)) {
        resultado.innerText = "Escribe un número entero.";
        return;
    }

    if (numero % 2 == 0) {
        resultado.innerText = `El número ${numero} es par.`;
    }
    else {
        resultado.innerText = `El número ${numero} es impar.`;
    }
});
    