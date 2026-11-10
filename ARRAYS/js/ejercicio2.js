let listaNumeros = [];
let formulario=document.getElementById('formulario');
let numero = document.getElementById('numero');
let lista = document.getElementById('lista');
let suma = document.getElementById('suma');
let promedio = document.getElementById('promedio');
let mayor = document.getElementById('mayor');
let menor = document.getElementById('menor');

formulario.addEventListener('submit',agregarNumeros);

function agregarNumeros(event){
    //validaciones
    event.preventDefault();
    if(numero.value.trim()===""){
        alert("Ingrese un numero");
        numero.style.backgroundColor = '#cb3234'
    }else {
        numero.style.backgroundColor = '#fff'
        let valor = parseFloat(numero.value);
        listaNumeros.push(valor);
        numero.value = '';
        mostrarResultados();
    }

}
function mostrarResultados(){
    lista.innerHTML = '';
    let total = 0;
    let numeroMayor = listaNumeros[0];
    let numeroMenor = listaNumeros[0];

    for(let i = 0; i<listaNumeros.length; i++){
        lista.innerHTML +=`<li>${listaNumeros[i]}</li>`;
        total += listaNumeros[i];

        if(listaNumeros[i]>numeroMayor){
            numeroMayor = listaNumeros[i];
        }

        if(listaNumeros[i]<numeroMenor){
            numeroMenor = listaNumeros[i];
        }

    }

    let media = total / listaNumeros.length;
    suma.innerText = `Suma: ${total}`;
    promedio.innerText = `Promedio: ${media.toFixed(2)}`;
    mayor.innerText = `Numero mayor: ${numeroMayor}`;
    menor.innerText = `Numero menor: ${numeroMenor}`
}
