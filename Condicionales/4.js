console.log("4. Clasificación de personas según su edad");

// ===== Versión 1 =====

let nombre = "Andrés";
let edad = 65;

if(Number.isInteger(edad) && edad >= 0){
    let categoria = "";
    let precio = 0;

    if(edad <= 11){
        categoria = "Niño";
        precio = 5000;
    }
    else if(edad <= 17){
        categoria = "Adolescente";
        precio = 8000;
    }
    else if(edad <= 59){
        categoria = "Adulto";
        precio = 15000;
    }
    else{
        categoria = "Adulto mayor";
        precio = 15000 - (15000 * 20 / 100);
    }

    console.log(`Nombre: ${nombre}`);
    console.log(`Categoría: ${categoria}`);
    console.log(`Precio de la entrada: $${precio}`);
}else{
    console.log("Edad inválida t(-_-)t");
}

// ===== Versión 2 =====

let persona = "Valentina";
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
