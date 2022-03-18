
export function scroll() {
  let elemento = document.querySelector("#crear");
  elemento.classList.add("desaparecer")

  setTimeout(() => { elemento.classList.remove("desaparecer") }, 1000);
}

export function buscaTabla(searchInput,table) {
  let  texto = searchInput.value.toLowerCase();
  var r = 0;
  let row
  while (row = table.rows[r++]) {
    if (row.children[0].innerText.toLowerCase().indexOf(texto) !== -1) {
      row.style.display = null;
    } else
      row.style.display = 'none';
  }
}