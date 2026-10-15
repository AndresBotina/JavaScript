console.log("6. Sistema de reservas para un hotel");

let cliente = "Andrés";
let habitacion = "Doble";
let estadia = 5;
let tarifa;

if(habitacion == "Sencilla"){
    tarifa = 100000;
}
else if(habitacion == "Doble"){
    tarifa = 160000;
}
else if(habitacion == "Familiar"){
    tarifa = 250000;
}

if(tarifa == undefined){
    console.log("Tipo de habitación no válido (o_o)");
}
else if(estadia <= 0){
    console.log("La cantidad de noches debe ser mayor que cero (o_o)");
}
else{
    let subtotal = tarifa * estadia;
    let rebajaPct = 0;

    if(estadia >= 5){
        rebajaPct = 10;
        if(habitacion == "Familiar" && estadia >= 7){
            rebajaPct = 15;
        }
    }

    let rebaja = subtotal * rebajaPct / 100;
    let totalReserva = subtotal - rebaja;

    console.log(`Cliente: ${cliente}`);
    console.log(`Tipo de habitación: ${habitacion}`);
    console.log(`Número de noches: ${estadia}`);
    console.log(`Subtotal: $${subtotal}`);
    console.log(`Porcentaje de rebaja: ${rebajaPct}%`);
    console.log(`Rebaja: $${rebaja}`);
    console.log(`Total de la reserva: $${totalReserva}`);
}
