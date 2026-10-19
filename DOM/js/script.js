function saludar() {

    let nombre = document.getElementById("nombre").value;

    alert(`Hola ${nombre}`);

    document.getElementById("resultado").value = `Hola, ${nombre}`;

    document.getElementById("resultado2").innerText = `Hola, ${nombre}`;

    document.getElementById("resultado3").innerHTML =
        `<p style="color: red;">Hola, ${nombre}</p>`;

    document.getElementById("resultado4").textContent = `Hola, ${nombre}`;

}

function registrar(){
    let nombre = document.getElementById("nombre2").value;
    let programa = document.getElementById("programa2").value;
    document.getElementById("resultado11").value = (`${nombre} Programa: ${programa}`);
    document.getElementById("resultado33").innerHTML = `<p style = "color:blue;">${nombre} TuU programa: ${programa}</p>`;
    document.getElementById("resultado22").innerText = `${nombre} Tu programa: ${programa}`;
    document.getElementById("resultado44").textContent = `${nombre} del programa ${programa}`


    console.log("Nombre: ",nombre);
    console.log("Programa: ",programa)
}

