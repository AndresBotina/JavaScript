function calcular(){
    nombre = document.getElementById("nombre_producto").value;
    cantidad = parseInt(document.getElementById("cantidad").value);
    precio_unidad = parseInt(document.getElementById("precio_unitario").value);
    subTotal = cantidad * precio_unidad;
    document.getElementById("subtotal").value = subTotal.toLocaleString();

    iva = subTotal * 0.19;
    document.getElementById("iva").value = iva.toLocaleString();
    descuento = subTotal * 0.10;
    document.getElementById("descuento").value = descuento.toLocaleString();
    total = subTotal + iva - descuento;
    document.getElementById("total_pagar").value = total.toLocaleString();
}