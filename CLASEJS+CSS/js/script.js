function calcular(){
    let producto = document.getElementById("producto").value.trim();
    if(producto ==""){
        alert("El campo producto es obligatorio.")
        document.getElementById("producto").style.borderColor = "red";
    }

    let cantidad = parseInt(document.getElementById("cantidad").value);
    if (isNaN(cantidad)){
        alert("El campo cantidad es obligatorio");
        document.getElementById("cantidad").style.borderBlockColor = "red"
    }

    let precio = parrrseFLoat(document.getElementById("precio").value);
    if (isNaN(precio)){
        alert("El campo precio es obligatorio");
        document.getElementById("precio").style.borderBlockColor = "red"
    }


    if(cantidad<=0){
        alert("Ingresa Valores Positivos")
        document.getElementById("cantidad").style.borderBlockColor = "red"

    }

    if(precio<=0){
        alert("Ingresa valores positivos")
        document.getElementById("precio").style.borderBlockColor = "red"

    }

    let subtotal = cantidad * precio;

    document.getElementById("subtotal").value =subtotal.toLocaleString();

    let descuento  = 0;

    if(subtotal<100000){
        descuento = 0;
    }else if(subtotal<300000){
        descuento = 0.10 * subtotal;
    }else if(subtotal<500000){
        descuento = 0.30* subtotal;
    }
    let iva = 0;
    document.getElementById("descuento").value = descuento.toLocaleString("es-CO");
    if(producto == "huevo" || producto == "pan" || producto == "leche"){
        iva = 0;
    } else{
        iva = subtotal *0.19
    }
    document.getElementById("iva").value = iva.toLocaleString("es-CO");
}