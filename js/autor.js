import { options, urlAutor, optionsGET, urlDesactivarAutor, urlActivarAutor } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment(),
  $myModal = new bootstrap.Modal(d.getElementById("exampleModal"), options);


function obtenerAutores() {
  obtenerJson(urlAutor).then((autores) => {
    autores.forEach((autor) => {

      $template.querySelector(".name").textContent = autor.nombre;

      $template.querySelector(".status").textContent = autor.alta;
      $template.querySelector(".status").id = "status_" + autor.id;
      $template.querySelector(".editar").dataset.nombre = autor.nombre;
      $template.querySelector(".ver").dataset.nombre = autor.nombre;

      if (autor.alta === true) {
        $template.querySelector(".estado").classList.remove("btn-danger")
        $template.querySelector(".estado").classList.add("btn-success")
        $template.querySelector(".name").classList.remove("tachado")
        $template.querySelector(".status").classList.remove("tachado")
        $template.querySelector(".editar").removeAttribute("disabled")
      } else {
        $template.querySelector(".estado").classList.remove("btn-success")
        $template.querySelector(".estado").classList.add("btn-danger")
        $template.querySelector(".name").classList.add("tachado")
        $template.querySelector(".status").classList.add("tachado")
        $template.querySelector(".editar").setAttribute("disabled", '')
      }

      $template.querySelector(".estado").dataset.estado = autor.alta;
      $template.querySelector(".estado").dataset.nombre = autor.nombre;
      $template.querySelector(".estado").dataset.id = autor.id;

      let $clone = d.importNode($template, true);

      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);
  });
}

function activarAutor(index) {
  obtenerJson(urlActivarAutor + index, optionsGET).then((response) => {
    {
      console.table(response);
    }
  });
}

function desactivarAutor(index) {
  obtenerJson(urlDesactivarAutor + index, optionsGET).then((response) => {
    {
      console.table(response);
    }
  });
}

function crearAutor(options) {
  obtenerJson(urlAutor, options)
    .then((response) => {
      console.log("aqui se aplica la logica");
      alert(`se creo el autor ${response.nombre}`);
    })
    .catch((error) => console.error(error));
}
function modificarAutor(options) {
  obtenerJson(urlAutor, options)
    .then((response) => {
      console.log("aqui se aplica la logica");
      alert(`se modifico el autor ${response.nombre}`);
    })
    .catch((error) => console.error(error));
}

d.addEventListener("DOMContentLoaded", obtenerAutores());

d.addEventListener("click", async (e) => {
  if (e.target.matches(".ver")) {
    Swal.fire({
      icon: 'info',
      title: 'Autor:',
      text: e.target.dataset.nombre,
    })
  }

  if (e.target.matches(".editar")) {
    d.querySelector(
      ".modal-body"
    ).innerHTML = `Autor: ${e.target.dataset.nombre}`;
    $myModal.show();
  }

  if (e.target.matches(".estado")) {
    Swal.fire({
      title: '¿Deseas cambiar el estado del autor?',
      showDenyButton: true,
      icon: 'warning',
      confirmButtonText: 'SI 😎',
      denyButtonText: `NOOOOOO 🙏`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {

      if (result.isConfirmed) {

        let btn = e.target;
        console.log(btn)

        if (btn.dataset.estado == 'true') {

          desactivarAutor(btn.dataset.id);

          btn.classList.remove("btn-success")
          btn.classList.add("btn-danger")
          btn.dataset.estado = "false";

          btn.parentElement.children[0].setAttribute("disabled", '')

          btn.parentNode.parentNode.children[0].classList.add("tachado")
          btn.parentNode.parentNode.children[1].classList.add("tachado")

          d.getElementById("status_" + btn.dataset.id).innerHTML = "false";

        } else {

          activarAutor(btn.dataset.id);
          btn.classList.remove("btn-danger")
          btn.classList.add("btn-success")
          btn.dataset.estado = "true";

          btn.parentElement.children[0].removeAttribute("disabled")

          btn.parentNode.parentNode.children[0].classList.remove("tachado")
          btn.parentNode.parentNode.children[1].classList.remove("tachado")

          d.getElementById("status_" + btn.dataset.id).innerHTML = "true";
        }

        Swal.fire(`El estado del autor <b>${btn.dataset.nombre}</b> ha sido modificado a <b>${btn.dataset.estado}</b>.`, '', 'success')
      } else if (result.isDenied) {
        Swal.fire('No se han realizado cambios.', '', 'info')
      }
    })
  }

});


////para probar filtro
let busqueda = document.getElementById('buscar');
let table = document.getElementById("tabla").tBodies[0];
let texto;

function buscaTabla() {
  texto = busqueda.value.toLowerCase();
  var r = 0;
  let row
  while (row = table.rows[r++]) {
    if (row.children[0].innerHTML.toLowerCase().indexOf(texto) !== -1)
    row.style.display = null;
  else
    row.style.display = 'none';
}

  //   if (row.innerText.toLowerCase().indexOf(texto) !== -1)
  //     row.style.display = null;
  //   else
  //     row.style.display = 'none';
  // }
}

busqueda.addEventListener('keyup', buscaTabla);