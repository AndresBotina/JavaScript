console.log("1. Sistema de calificaciones de un estudiante");
let nota1 = 5, nota2 = 5, nota3 = 3

if(nota1>0 && nota1 <=5 || nota2>0 && nota2 <=5 || nota3>0 && nota3<=5){
    let promedio = (nota1+nota2+nota3)/3
    let estudiante = "Andrés"

    if(promedio>=4.5){
        console.log(`${estudiante} - Promedio superior: ${promedio.toFixed(1)}, Melo`);
    
    }
    else if(promedio >= 4.0){
        console.log(`${estudiante} - Promedio alto: ${promedio.toFixed(1)}, eres el masomenos`);
    }
    else if(promedio>=3.0){
        console.log(`${estudiante} - Promedio básico: ${promedio.toFixed(1)}, eres el basico`);

    }
    else if(promedio<3.0){
        console.log(`${estudiante} - Promedio bajo: ${promedio.toFixed(1)}, estás suave`);
    
    }
}else{
    console.log("Nota Inválida t(-_-)t");
}