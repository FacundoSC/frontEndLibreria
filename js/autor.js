import { options, urlAutorLocal } from "./constantes.js";
import * as utilidades from "./utilidades.js";

main();

function main() {
  document.addEventListener(
    "DOMContentLoaded",
    utilidades.obtenerEntidadPaginada(urlAutorLocal, "autor")
  );

  document.addEventListener("click", async (event) => {
    if (event.target.matches(".crear")) {
        utilidades.crearConForm(urlAutorLocal);
    }

    if (event.target.matches(".editar")) {
      utilidades.editarConForm(event.target, urlAutorLocal);
    }

    if (event.target.matches(".botonEstado")) {
      utilidades.cambiarEstado(urlAutorLocal, event.target.dataset.id);
    }

    if (event.target.matches(".ver")) {
      let nombre = event.target.dataset.nombre;
      utilidades.modalInformativo("Autor", nombre);
    }

    if (event.target.matches("#btn_next")) {
      utilidades.avanzarPagina(urlAutorLocal, "autor");
    }

    if (event.target.matches("#btn_prev")) {
      utilidades.retrocederPagina(urlAutorLocal, "autor");
    }
  });
}
