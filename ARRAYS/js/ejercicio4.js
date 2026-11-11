let estudiantes = ['Andres', 'Laura', 'Camilo', 'Valentina', 'Santiago', 'Daniela', 'Juan', 'Sofia'];
let formulario = document.getElementById('formulario');
let inputBuscar = document.getElementById('buscar');
let lista = document.getElementById('lista');
let resultado = document.getElementById('resultado');

mostrarEstudiantes();

formulario.addEventListener('submit',function(event){
    event.preventDefault();
    let nombre = inputBuscar.value.trim();

    //validaciones
    if(nombre === ""){
        alert("Ingrese el nombre que desea buscar");
    }else {
        let encontrado = estudiantes.find(function(estudiante){
            return estudiante.toLowerCase() === nombre.toLowerCase();
        });

        if(encontrado){
            resultado.innerText = `${encontrado} está registrado`;
        }else {
            resultado.innerText = `${nombre} no se encuentra registrado`;
        }

        inputBuscar.value = '';
    }
})

function mostrarEstudiantes(){
    lista.innerHTML = '';

    for(let i = 0; i<estudiantes.length; i++){
        lista.innerHTML +=`<li>${estudiantes[i]}</li>`;
    }
}
