//Ocultar boton de creacion
document.addEventListener('scroll', () => {
    let elemento = document.querySelector("#crear");
    elemento.classList.add("desaparecer")

    setTimeout(() => { elemento.classList.remove("desaparecer") }, 1000);
})
//Fin ocultar boton de creacion

//Funcion de busqueda
let searchInput, table, texto

document.addEventListener("DOMContentLoaded", () => {
    searchInput = document.getElementById('buscar');
    searchInput.addEventListener('keyup', buscaTabla);
})

function buscaTabla() {
    table = document.getElementById("tabla").tBodies[0];
    texto = searchInput.value.toLowerCase();
    var r = 0;
    let row
    while (row = table.rows[r++]) {
        if (row.children[0].innerText.toLowerCase().indexOf(texto) !== -1) {
            row.style.display = null;
        } else
            row.style.display = 'none';
    }
}
//FIN busqueda