console.log("5. Sistema de tarifas para un parqueadero");

// ===== Versión 1 =====

let placa = "ABC123";
let tipoVehiculo = "Automóvil";
let horas = 6;
let tarifaHora = 0;

switch(tipoVehiculo){
    case "Motocicleta":
        tarifaHora = 2000;
        break;
    case "Automóvil":
        tarifaHora = 4000;
        break;
    case "Camioneta":
        tarifaHora = 5000;
        break;
    default:
        tarifaHora = 0;
}

if(tarifaHora > 0 && horas > 0){
    let valorInicial = tarifaHora * horas;
    let descuento = 0;

    if(horas > 5){
        descuento = valorInicial * 10 / 100;
    }else{
        descuento = 0;
    }

    let total = valorInicial - descuento;

    console.log(`Placa: ${placa}`);
    console.log(`Tipo de vehículo: ${tipoVehiculo}`);
    console.log(`Tiempo: ${horas} horas`);
    console.log(`Valor inicial: $${valorInicial}`);
    console.log(`Descuento: $${descuento}`);
    console.log(`Total a pagar: $${total}`);
}else{
    console.log("Tipo de vehículo u horas inválidas t(-_-)t");
}

// ===== Versión 2 =====

let matricula = "XYZ789";
let vehiculo = "Motocicleta";
let tiempo = 3;
let costoHora;

if(vehiculo == "Motocicleta"){
    costoHora = 2000;
}
else if(vehiculo == "Automóvil"){
    costoHora = 4000;
}
else if(vehiculo == "Camioneta"){
    costoHora = 5000;
}

if(costoHora == undefined){
    console.log("Ese vehículo no está permitido (o_o)");
}
else if(tiempo <= 0){
    console.log("Las horas deben ser mayores que cero (o_o)");
}
else{
    let bruto = costoHora * tiempo;
    let rebaja = tiempo > 5 ? bruto * 0.1 : 0;
    let cobro = bruto - rebaja;

    console.log(`Matrícula: ${matricula}`);
    console.log(`Vehículo: ${vehiculo}`);
    console.log(`Permanencia: ${tiempo} horas`);
    console.log(`Valor sin descuento: $${bruto}`);
    console.log(`Rebaja: $${rebaja}`);
    console.log(`Cobro final: $${cobro}`);
}
