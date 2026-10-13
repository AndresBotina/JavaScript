console.log("3. Cálculo del salario semanal de un empleado");

// ===== Versión 1 =====

let empleado = "Andrés";
let horasTrabajadas = 46;
let valorHora = 10000;

if(horasTrabajadas >= 0 && valorHora > 0){
    let horasOrdinarias = 0;
    let horasExtras = 0;

    if(horasTrabajadas <= 40){
        horasOrdinarias = horasTrabajadas;
        horasExtras = 0;
    }else{
        horasOrdinarias = 40;
        horasExtras = horasTrabajadas - 40;
    }

    let pagoOrdinario = horasOrdinarias * valorHora;
    let pagoExtra = horasExtras * valorHora * 1.5;
    let salarioTotal = pagoOrdinario + pagoExtra;

    console.log(`Empleado: ${empleado}`);
    console.log(`Horas ordinarias: ${horasOrdinarias} - Pago: $${pagoOrdinario}`);
    console.log(`Horas extras: ${horasExtras} - Pago: $${pagoExtra}`);
    console.log(`Salario semanal: $${salarioTotal}`);
}else{
    console.log("Horas o valor de la hora inválido t(-_-)t");
}

// ===== Versión 2 =====

let trabajador = "Camila";
let horasSemana = 38;
let pagoPorHora = 12000;
let jornadaMaxima = 40;
let recargo = 1.5;

if(horasSemana < 0 || pagoPorHora <= 0){
    console.log("Datos inválidos (o_o)");
}else{
    let normales = horasSemana;
    let extras = 0;

    if(horasSemana > jornadaMaxima){
        normales = jornadaMaxima;
        extras = horasSemana - jornadaMaxima;
    }

    let dineroNormales = normales * pagoPorHora;
    let dineroExtras = extras * pagoPorHora * recargo;
    let sueldo = dineroNormales + dineroExtras;

    console.log(`Trabajador: ${trabajador}`);
    console.log(`Horas normales: ${normales} = $${dineroNormales}`);
    console.log(`Horas extra: ${extras} = $${dineroExtras}`);
    console.log(`Total de la semana: $${sueldo}`);
}
