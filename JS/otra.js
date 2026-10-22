function calcular(){
    let nro_invitados = parseInt(document.getElementById("nro_invitados").value);
    let costo_comida = parseFloat(document.getElementById("costo_comida").value);
    let costo_bebida = parseFloat(document.getElementById("costo_bebida").value);
    let costo_decoracion = parseFloat(document.getElementById("costo_decoracion").value);
    let costo_musica = parseFloat(document.getElementById("costo_musica").value);
    let porcentaje_propina = parseFloat(document.getElementById("propina").value);

    let total_comida = nro_invitados * costo_comida;
    let total_bebida = nro_invitados * costo_bebida;
    let total_decoracion = nro_invitados * costo_decoracion;
    let total_musica = nro_invitados * costo_musica;
    let subtotal = total_comida + total_bebida + total_decoracion + total_musica;
    let propina = subtotal * (porcentaje_propina / 100);
    let total_general = subtotal + propina;
    let costo_por_invitado = total_general / nro_invitados;

    document.getElementById("total_comida").innerText = total_comida.toLocaleString();
    document.getElementById("total_bebida").innerText = total_bebida.toLocaleString();
    document.getElementById("total_decoracion").innerText = total_decoracion.toLocaleString();
    document.getElementById("total_musica").innerText = total_musica.toLocaleString();
    document.getElementById("total_subtotal").innerText = subtotal.toLocaleString();
    document.getElementById("total_propina").innerText = propina.toLocaleString();
    document.getElementById("total_general").innerText = total_general.toLocaleString();
    document.getElementById("total_costo_invitados").innerText = costo_por_invitado.toLocaleString();
}
