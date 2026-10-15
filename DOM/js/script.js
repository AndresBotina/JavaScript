function saludar() {

    let nombre = document.getElementById("nombre").value;

    alert(`Hola ${nombre}`);

    document.getElementById("resultado").value = `Hola, ${nombre}`;

    document.getElementById("resultado2").innerText = `Hola, ${nombre}`;

    document.getElementById("resultado3").innerHTML =
        `<p style="color: red;">Hola, ${nombre}</p>`;

    document.getElementById("resultado4").textContent = `Hola, ${nombre}`;

    document.write(`Hola, ${nombre}`);

}
