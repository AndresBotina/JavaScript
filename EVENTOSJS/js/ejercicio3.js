document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    let numero1 = Number(document.getElementById("num1").value);
    let numero2 = Number(document.getElementById("num2").value);

    alert(`Multiplicación: ${numero1 * numero2}`);
});
