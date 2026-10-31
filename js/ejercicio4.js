let formulario = document.getElementById("formulario");

formulario.addEventListener("submit", division);

function division(event) {
    event.preventDefault();

    let numero1 = Number(document.getElementById("num1").value);
    let numero2 = Number(document.getElementById("num2").value);

    if (numero2 == 0) {
        alert("No se puede dividir entre cero.");
        return;
    }

    alert(`División: ${numero1 / numero2}`);
}
