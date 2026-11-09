// Arreglo donde se guardan los números ingresados.
let listaNumeros = [];

// Referencias a los elementos del formulario y los resultados.
let numero = document.getElementById("numero");
let btnAgregar = document.getElementById("btnAgregar");
let lista = document.getElementById("lista");
let suma = document.getElementById("suma");
let promedio = document.getElementById("promedio");
let mayor = document.getElementById("mayor");
let menor = document.getElementById("menor");

// Agrega el número ingresado cuando se hace clic en el botón.
btnAgregar.addEventListener("click", function() {
    if (numero.value.trim() === "") {
        alert("Ingrese un número");
    } else {
        let valor = parseFloat(numero.value);

        listaNumeros.push(valor);
        numero.value = "";
        mostrarResultados();
    }
});

function mostrarResultados() {
    lista.innerHTML = "";

    let total = 0;
    let numMayor = listaNumeros[0];
    let numMenor = listaNumeros[0];

    for (let i = 0; i < listaNumeros.length; i++) {
        lista.innerHTML += `<li>${listaNumeros[i]}</li>`;
        total += listaNumeros[i];

        if (listaNumeros[i] > numMayor) {
            numMayor = listaNumeros[i];
        }

        if (listaNumeros[i] < numMenor) {
            numMenor = listaNumeros[i];
        }
    }

    let media = total / listaNumeros.length;

    suma.textContent = `Suma: ${total}`;
    promedio.textContent = `Promedio: ${media.toFixed(2)}`;
    mayor.textContent = `Número mayor: ${numMayor}`;
    menor.textContent = `Número menor: ${numMenor}`;
}
