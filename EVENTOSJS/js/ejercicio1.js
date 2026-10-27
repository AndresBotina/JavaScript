document.getElementById("botonSumar").addEventListener("click", function (event) {
    event.preventDefault();

    let valor1 = parseFloat(document.getElementById("n1").value);
    let valor2 = parseFloat(document.getElementById("n2").value);

    if (isNaN(valor1) || isNaN(valor2)) {
        alert("Escribe los dos números.");
        return;
    } else {
        alert(`Suma: ${valor1 + valor2}`);
    }
});
