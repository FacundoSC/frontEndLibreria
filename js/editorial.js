import { options, urlEditorial, urlDesactivar, urlActivar } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment()

d.addEventListener("DOMContentLoaded", obtenerEditoriales(urlEditorial));

function obtenerEditoriales() {
  obtenerJson(urlEditorial).then(editoriales => {
    console.log(editoriales)
    editoriales.forEach(editorial => {

      $template.querySelector(".nombre").textContent = editorial.nombre;
      $template.querySelector(".nombre").id = `nombre_${editorial.id}`;
      $template.querySelector(".nombre").classList.remove('tachado');

      $template.querySelector(".estado").textContent = editorial.alta;
      $template.querySelector(".estado").id = `estado_${editorial.id}`;
      $template.querySelector(".estado").classList.remove('tachado');

      //logica para adicion de libros en select
      while ($template.querySelector(".asociados").firstChild) {
        $template.querySelector(".asociados").removeChild($template.querySelector(".asociados").firstChild);
      }

      if (editorial.libros.length == 0) {
        let elemento = document.createElement('p')
        elemento.textContent = "NO EXISTEN LIBROS ASOCIADOS";
        $template.querySelector(".asociados").appendChild(elemento)
      }
      else {
        let selector = document.createElement('select')
        selector.setAttribute("id", editorial.id)
        let fragmentLibro = document.createDocumentFragment();
        editorial.libros.forEach((libro) => {
          let elemento = document.createElement('option');
          elemento.textContent = libro.titulo;
          selector.appendChild(elemento);
        });
        fragmentLibro.appendChild(selector);
        $template.querySelector(".asociados").appendChild(fragmentLibro);
      }
      //fin logica para adicion de libros en select


      $template.querySelector(".editar").dataset.id = `${editorial.id}`;
      $template.querySelector(".editar").id = `editar_${editorial.id}`;
      $template.querySelector(".editar").removeAttribute("disabled")

      $template.querySelector(".ver").dataset.nombre = editorial.nombre;
      $template.querySelector(".ver").id = `ver_${editorial.id}`;

      $template.querySelector(".botonEstado").id = `botonEstado_${editorial.id}`;
      $template.querySelector(".botonEstado").classList.remove('btn-success');
      $template.querySelector(".botonEstado").classList.remove('btn-danger');
      $template.querySelector(".botonEstado").dataset.nombre = editorial.nombre;
      $template.querySelector(".botonEstado").dataset.id = editorial.id;
      $template.querySelector(".botonEstado").dataset.estado = editorial.alta;

      if (editorial.alta) {
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
}//fin funcion obtener editoriales