console.log("2. Sistema de descuentos para una tienda");

let comprador = "Andrés";
let articulo = "Portátil";
let unidades = 2;
let precioArticulo = 350000;

if(unidades > 0 && precioArticulo > 0){
    let subtotal = unidades * precioArticulo;
    let descuentoPct = 0;

    if(subtotal >= 1000000){
        descuentoPct = 15;
    }
    else if(subtotal >= 500000){
        descuentoPct = 10;
    }
    else if(subtotal >= 200000){
        descuentoPct = 5;
    }
    else{
        descuentoPct = 0;
    }

    let ahorro = subtotal * descuentoPct / 100;
    let pagoFinal = subtotal - ahorro;

    console.log(`Cliente: ${comprador}`);
    console.log(`Producto: ${articulo}`);
    console.log(`Valor inicial: $${subtotal}`);
    console.log(`Descuento aplicado: ${descuentoPct}%`);
    console.log(`Valor descontado: $${ahorro}`);
    console.log(`Total a pagar: $${pagoFinal}`);
}else{
    console.log("Cantidad o precio inválido t(-_-)t");
}
