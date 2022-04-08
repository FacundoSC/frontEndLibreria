import {urlAutor } from "./constantes.js";
import * as utilidades from "./utilidades.js";

main();

function main() {
  document.addEventListener(
    "DOMContentLoaded",
    utilidades.obtenerEntidadPaginada(urlAutor, "autor")
  );

  document.addEventListener("click", async (event) => {
    if (event.target.matches(".crear")) {
        utilidades.crearConForm(urlAutor);
    }

    if (event.target.matches(".editar")) {
      utilidades.editarConForm(event.target, urlAutor);
    }

    if (event.target.matches(".botonEstado")) {
      utilidades.cambiarEstado(urlAutor, event.target.dataset.id);
    }

    if (event.target.matches(".ver")) {
      let nombre = event.target.dataset.nombre;
      utilidades.modalInformativo("Autor", nombre);
    }

    if (event.target.matches("#btn_next")) {
      utilidades.avanzarPagina(urlAutor, "autor");
    }

    if (event.target.matches("#btn_prev")) {
      utilidades.retrocederPagina(urlAutor, "autor");
    }
  });
}
