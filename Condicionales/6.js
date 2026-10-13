console.log("6. Sistema de reservas para un hotel");

// ===== Versión 1 =====

let huesped = "Andrés";
let tipoHabitacion = "Familiar";
let noches = 7;
let precioNoche = 0;

switch(tipoHabitacion){
    case "Sencilla":
        precioNoche = 100000;
        break;
    case "Doble":
        precioNoche = 160000;
        break;
    case "Familiar":
        precioNoche = 250000;
        break;
    default:
        precioNoche = 0;
}

if(precioNoche > 0 && noches > 0){
    let costoInicial = precioNoche * noches;
    let porcentaje = 0;

    if(tipoHabitacion == "Familiar" && noches >= 7){
        porcentaje = 15;
    }
    else if(noches >= 5){
        porcentaje = 10;
    }
    else{
        porcentaje = 0;
    }

    let valorDescontado = costoInicial * porcentaje / 100;
    let costoFinal = costoInicial - valorDescontado;

    console.log(`Huésped: ${huesped}`);
    console.log(`Habitación: ${tipoHabitacion}`);
    console.log(`Noches: ${noches}`);
    console.log(`Costo inicial: $${costoInicial}`);
    console.log(`Descuento: ${porcentaje}%`);
    console.log(`Valor descontado: $${valorDescontado}`);
    console.log(`Costo final: $${costoFinal}`);
}else{
    console.log("Habitación o noches inválidas t(-_-)t");
}

// ===== Versión 2 =====

let cliente = "Sofía";
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
