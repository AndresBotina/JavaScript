console.log("4. Clasificación de personas según su edad");

let persona = "Andrés";
let anios = 14;
let tarifaAdulto = 15000;

if(!Number.isInteger(anios) || anios < 0){
    console.log("La edad debe ser un número entero positivo (o_o)");
}else{
    let grupo;
    let entrada;

    if(anios < 12){
        grupo = "Niño";
        entrada = 5000;
    }
    else if(anios < 18){
        grupo = "Adolescente";
        entrada = 8000;
    }
    else if(anios < 60){
        grupo = "Adulto";
        entrada = tarifaAdulto;
    }
    else{
        grupo = "Adulto mayor";
        entrada = tarifaAdulto * 0.8;
    }

    console.log(`Persona: ${persona}`);
    console.log(`Grupo: ${grupo}`);
    console.log(`Valor a pagar: $${entrada}`);
}
