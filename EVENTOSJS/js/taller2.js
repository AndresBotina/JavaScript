let formulario  = document.getElementById("formTaller2");

formulario.addEventListener("submit", taller2);
function taller2(){
    let nota = parseFloat(document.getElementById("nota").value);

    event.preventDefault();

    //validar que nota no sea nula isNaN
    //validar que nota : 0-5
    //Desempeño
    /* 4.5 a 5.0	Excelente	Aprobado
        4.0 a 4.4	Bueno	Aprobado
        3.0 a 3.9	Aceptable	Aprobado
        menor que 3.0	Insuficiente	No aprobado */

        if(isNaN(nota)){
            document.getElementById("resultado").innerText ="Ingrese la nota porfavor"
            return;
        }
        if(nota<0 || nota>5){
            document.getElementById("resultado").innerText = "Nota invalida"
            return;
        }
        let desempeño;
        let resultado = "Aprobado";

        if(nota>4.5){
            desempeño = "Excelente";
        }else if(nota>4.0){
            desempeño = "Bueno";
        }else if (nota>3){
            desempeño = "Aceptable";
        }else{
            desempeño = "Insuficiente";
            resultado = "No aprobado"
        }
        document.getElementById("resultado").innerText = `${nota}- ${desempeño} (${resultado})`
}