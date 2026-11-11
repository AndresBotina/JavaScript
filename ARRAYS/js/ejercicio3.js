let productos = [];
let formulario = document.getElementById('formulario');
let inputProducto = document.getElementById('producto');
let inputPrecio = document.getElementById('precio');
let inputCantidad = document.getElementById('cantidad');
let tabla = document.getElementById('tabla');
let total = document.getElementById('total');

// Ejemplo de un objeto:
// let p = { nombre:'Arroz', precio:2500, cantidad : 4};
// p.nombre //'Arroz'
// p.precio //2500
// p.cantidad //4

// Ejemplo de un arreglo de objetos:
// productos = [
//     {nombre:'Arroz',precio:2500, cantidad:4},
//     {nombre: 'Leche',precio:4200,cantidad:2}
// ];

formulario.addEventListener('submit',function(event){
    event.preventDefault();
    let nombre = inputProducto.value.trim();
    let precio = parseFloat(inputPrecio.value);
    let cantidad = parseInt(inputCantidad.value);

    //validaciones
    if(nombre === ""){
        alert("Ingrese el nombre del producto");
    }else if(isNaN(precio) || precio <= 0){
        alert("Ingrese un precio mayor a cero");
    }else if(isNaN(cantidad) || cantidad <= 0){
        alert("Ingrese una cantidad mayor a cero");
    }else {
        productos.push({nombre: nombre, precio: precio, cantidad: cantidad});
        formulario.reset();
        mostrarProductos();
    }
})

function mostrarProductos(){
    tabla.innerHTML = '';
    let valorTotal = 0;

    for(let i = 0; i<productos.length; i++){
        let subtotal = productos[i].precio * productos[i].cantidad;
        valorTotal += subtotal;

        tabla.innerHTML += `<tr>
            <td>${productos[i].nombre}</td>
            <td>${productos[i].precio}</td>
            <td>${productos[i].cantidad}</td>
            <td>${subtotal}</td>
        </tr>`;
    }

    total.innerText = `Valor total: ${valorTotal}`;
}
