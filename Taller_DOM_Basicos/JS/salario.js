function calcular(){
    let horas_trabajadas = parseInt(document.getElementById("horas_trabajadas").value);
    let valor_hora = parseFloat(document.getElementById("valor_hora").value);
    let resultado = horas_trabajadas*valor_hora;
    document.getElementById("salario_a_pagar").value = resultado.toLocaleString();
}