// Taller 3
let formulario = document.getElementById("formTaller3");
 formulario.addEventListener("submit",taller3);

 function taller3(){
    event.preventDefault()
    let numero1 = parseInt(document.getElementById("numero1").value);
    let numero2 = parseInt(document.getElementById("numero2").value);
    let numero3 = parseInt(document.getElementById("numero3").value);

    if(isNaN(numero1)||isNaN(numero2) || isNaN(numero3)){
        document.getElementById("resultado").innerText = `Ingresa los tres numeros solicitados`;
        return;
    }
    if((numero1>numero2) && (numero1>numero3)){
        document.getElementById("resultado").innerText = `El mayor es el ${numero1}`;
        return;
    }else if((numero2>numero1) && (numero2>numero3)){
        document.getElementById("resultado").innerText = `El mayor es el ${numero2}`;
        return;

    }else{
        document.getElementById("resultado").innerText = `El mayor es el ${numero3}`;
        return;
    }
 }