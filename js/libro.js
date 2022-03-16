import { options, urlLibro, urlDesactivar, urlActivar, footerModal, footerModalFormulario } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-templateLibro").content,
  $fragment = d.createDocumentFragment();
 // $myModal = new bootstrap.Modal(d.getElementById('exampleModal'), options);

 function obtenerLibros(urlLibro) {
    obtenerJson(urlLibro).then(libros => {
        console.table(libros)
      libros.forEach(libro => {
          
         $template.querySelector(".titulo").textContent = libro.titulo;
        // $template.querySelector(".nombre").id = `nombre_${autor.id}`;
        $template.querySelector(".isbn").textContent = libro.isbn;
        $template.querySelector(".ejemplaresRestantes").textContent = libro.ejemplaresRestantes;
        $template.querySelector(".estado").textContent = libro.alta;
        // $template.querySelector(".estado").id = `estado_${autor.id}`;
        // $template.querySelector(".editar").dataset.id = `${autor.id}`;
        // $template.querySelector(".editar").id = `editar_${autor.id}`;
        // $template.querySelector(".ver").dataset.nombre = autor.nombre;
        // $template.querySelector(".botonEstado").id = `botonEstado_${autor.id}`;
        // $template.querySelector(".botonEstado").classList.remove('btn-success');
        // $template.querySelector(".botonEstado").classList.remove('btn-danger');
        // $template.querySelector(".botonEstado").dataset.nombre = autor.nombre;
        // $template.querySelector(".nombre").classList.remove('tachado');
        // $template.querySelector(".estado").classList.remove('tachado');
        // $template.querySelector(".editar").removeAttribute("disabled")
        // $template.querySelector(".botonEstado").dataset.id = autor.id;
        // $template.querySelector(".botonEstado").dataset.estado = autor.alta;
        if (libro.alta) {
          $template.querySelector(".botonEstado").classList.add('btn-success');
        } else {
          $template.querySelector(".botonEstado").classList.add('btn-danger');
          $template.querySelector(".nombre").classList.add('tachado');
          $template.querySelector(".estado").classList.add('tachado');
          $template.querySelector(".editar").setAttribute("disabled", '')
        }
        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });
      $table.querySelector("tbody").appendChild($fragment);
    });
  }
  d.addEventListener("DOMContentLoaded", obtenerLibros(urlLibro));

//   d.addEventListener("DOMContentLoaded", function () {
//         obtenerJson(urlLibro).then(LibrosArray => {
//           Libros = LibrosArray;
//         })
//       });
  