let formulario =document.getElementById("formulario");
let resultado =document.getElementById("resultado");

formulario.addEventListener("submit", quiz);

function quiz(event){
    event.preventDefault();
    resultado.innerText = "";

    let tipo_cliente = document.getElementById("tipo_cliente").value.trim().toLowerCase();
    let nombre_cliente = document.getElementById("nombre_cliente").value.trim();
    let valor_bruto = parseFloat(document.getElementById("valor_bruto").value);
    let metodo_pago = document.getElementById("metodo_pago").value.trim().toLowerCase();
    let fidelizacion = parseInt(document.getElementById("fidelizacion").value);
    let descuento;


    if (nombre_cliente == "") {
        resultado.innerText = `Ingrese el nombre del cliente.`;
        return;
    }
    if (isNaN(valor_bruto)) {
        resultado.innerText = `Ingrese un valor bruto válido.`;
        return;
    }
    if (tipo_cliente != "nuevo" && tipo_cliente != "frecuente" && tipo_cliente != "premium") {
        resultado.innerText = `Ingrese un tipo de cliente válido: Nuevo, Frecuente o Premium.`;
        return;
    }
    if (metodo_pago != "efectivo" && metodo_pago != "tarjeta" && metodo_pago != "transferencia") {
        resultado.innerText = `Ingrese un método de pago válido: Efectivo, Tarjeta o Transferencia.`;
        return;
    }
    if (isNaN(fidelizacion)) {
        resultado.innerText = `Ingrese los puntos de fidelización.`;
        return;
    }

    if (tipo_cliente == "nuevo"){
        descuento  = 0;
    }else if(tipo_cliente == "frecuente"){
        descuento = 0.05;
    }else if(tipo_cliente == "premium"){
        descuento = 0.12;
    }
    let valor_paso1 = valor_bruto - (valor_bruto * descuento);

    let descuentoAdicional = 0;
    let recargo = 0;
    if(metodo_pago == "efectivo"){
        descuentoAdicional = 0.03;
    }else if(metodo_pago == "tarjeta"){
        recargo = 0.02;
    }
    let valor_paso2 = valor_paso1 - (valor_paso1 * descuentoAdicional) + (valor_paso1 * recargo);

    let valor_redimido = 0;
    if (fidelizacion >= 500) {
        valor_redimido = fidelizacion * 20;
        let limite_redencion = valor_paso2 * 0.30;
        if (valor_redimido > limite_redencion) {
            valor_redimido = limite_redencion;
        }
    }
    let valor_paso3 = valor_paso2 - valor_redimido;

    let iva = valor_paso3 * 0.19;
    let total = valor_paso3 + iva;

    resultado.innerText = `Cliente: ${nombre_cliente}\n` +
        `Valor bruto: $${valor_bruto}\n` +
        `Valor con descuento por tipo de cliente: $${valor_paso1}\n` +
        `Valor ajustado por método de pago: $${valor_paso2}\n` +
        `Puntos redimidos: $${valor_redimido}\n` +
        `Subtotal antes de IVA: $${valor_paso3}\n` +
        `IVA (19%): $${iva}\n` +
        `Total a pagar: $${total}`;
}