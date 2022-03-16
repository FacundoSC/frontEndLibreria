import { options, urlEditorial, urlDesactivar, urlActivar} from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment()

d.addEventListener("DOMContentLoaded", obtenerEditoriales(urlEditorial));

function obtenerEditoriales(url) {
  obtenerJson(url).then(editoriales => {
    editoriales.forEach(editorial => {
        // console.log(editorial.nombre+"-"+editorial.id+"-"+editorial.alta+"-")

      $template.querySelector(".nombre").textContent = editorial.nombre;
      $template.querySelector(".nombre").id = `nombre_${editorial.id}`;
      $template.querySelector(".estado").textContent = editorial.alta;
      $template.querySelector(".estado").id = `estado_${editorial.id}`;
      $template.querySelector(".editar").dataset.id = `${editorial.id}`;
      $template.querySelector(".editar").id = `editar_${editorial.id}`;
      $template.querySelector(".ver").dataset.nombre = editorial.nombre;
      $template.querySelector(".botonEstado").id = `botonEstado_${editorial.id}`;
      $template.querySelector(".botonEstado").classList.remove('btn-success');
      $template.querySelector(".botonEstado").classList.remove('btn-danger');
      $template.querySelector(".botonEstado").dataset.nombre = editorial.nombre;
      $template.querySelector(".nombre").classList.remove('tachado');
      $template.querySelector(".estado").classList.remove('tachado');
      $template.querySelector(".editar").removeAttribute("disabled")
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