console.log("3. Cálculo del salario semanal de un empleado");

let trabajador = "Andrés";
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
