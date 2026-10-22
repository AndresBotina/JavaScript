function calcular(){
    let nota1 = parseFloat(document.getElementById("nota1").value);
    let nota2 = parseFloat(document.getElementById("nota2").value);
    let nota3 = parseFloat(document.getElementById("nota3").value);
    let promedio = (nota1 + nota2 + nota3 )/3;
    document.getElementById("promedio").value= promedio.toFixed(1);
}