console.log("2. Sistema de descuentos para una tienda");

let cliente = "Andrés";
let producto = "Portátil";
let cantidad = 2;
let precioUnitario = 350000;

if(cantidad > 0 && precioUnitario > 0){
    let valorInicial = cantidad * precioUnitario;
    let porcentaje = 0;

    if(valorInicial >= 1000000){
        porcentaje = 15;
    }
    else if(valorInicial >= 500000){
        porcentaje = 10;
    }
    else if(valorInicial >= 200000){
        porcentaje = 5;
    }
    else{
        porcentaje = 0;
    }

    let valorDescuento = valorInicial * porcentaje / 100;
    let totalPagar = valorInicial - valorDescuento;

    console.log(`Cliente: ${cliente}`);
    console.log(`Producto: ${producto}`);
    console.log(`Valor inicial: $${valorInicial.toFixed(1)}`);
    console.log(`Descuento aplicado: ${porcentaje}%`);
    console.log(`Valor descontado: $${valorDescuento.toFixed(1)}`);
    console.log(`Total a pagar: $${totalPagar.toFixed(1)}`);
}else{
    console.log("Cantidad o precio inválido t(-_-)t");
}
