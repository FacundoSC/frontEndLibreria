import { urlCliente} from "./constantes.js";
import * as utilidades from "./utilidades.js";
import {modalInformativo} from "./modales.js";

main();

function main() {
  document.addEventListener("DOMContentLoaded", utilidades.obtenerEntidadPaginada(urlCliente, "cliente"));

  document.addEventListener("click", async (event) => {

    if (event.target.matches(".crear")) {
      utilidades.crearConForm(urlCliente);
    }

    if (event.target.matches(".editar")) {
      utilidades.editarConForm(event.target, urlCliente);
    }

    if (event.target.matches(".botonEstado")) {
      utilidades.cambiarEstado(urlCliente, event.target.dataset.id)
    }

    if (event.target.matches(".ver")) {
      let nombreCliente = event.target.dataset.nombre;
      let apellidoCliente = event.target.dataset.apellido;
      let documentoCliente = event.target.dataset.documento;
      let telefonoCliente = event.target.dataset.telefono;
      let clienteDatos = `<p><b>DNI:</b> ${documentoCliente}</p><br><p><b>Teléfono:</b> ${telefonoCliente}</p>`;
      modalInformativo("Cliente", nombreCliente + " " + apellidoCliente, clienteDatos);
    }

    if (event.target.matches("#btn_next")) {
      utilidades.avanzarPagina(urlCliente, "cliente");
    }

    if (event.target.matches("#btn_prev")) {
      utilidades.retrocederPagina(urlCliente, "cliente");
    }
  });
}