console.log("5. Sistema de tarifas para un parqueadero");

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
