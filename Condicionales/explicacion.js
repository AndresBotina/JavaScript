//crear Variable genero = F = Mujer - M = Hombre


let genero ="F";

if(genero== "F"){
    console.log("Eres una dama (^-^) ");
}
else if(genero=="M"){
    console.log("Eres un macho (¬_¬)");
}
else{
    console.log("Opción Inválida (o_o)");
}


//Ejercicio 2: Determinar si una persona es menor de edad

let edad = 17;

if( edad >0 && edad <=100){
    if(edad <18){
        console.log("Estas chiquito");
    }else{
        console.log("Estas ruquito");
    }
}else{
    console.log("Edad fuera de rango");
}


//Diferentes Opciones

let mes = 4;

switch(mes){
    case 1:
        console.log("Enero");
        break;
    case 2:
        console.log("Febrero");
        break;
    case 3:
        console.log("Marzo");
        break;
    case 4:
        console.log("Abril");
        break;
    case 5:
        console.log("Mayo");
        break;
    case 6:
        console.log("Junio");
        break;
    case 7:
        console.log("Julio");
        break;
    case 8:
        console.log("Agosto");
        break;
    case 9:
        console.log("Septiembre");
        break;
    case 10:
        console.log("Octubre");
        break;
    case 11:
        console.log("Noviembre");
        break;
    case 12:
        console.log("Diciembre");
        break;
    default:
        console.log("Mes inválido (o_o)");
}

