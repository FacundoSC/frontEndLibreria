import { urlClienteLocal} from "./constantes.js";
import * as utilidades from "./utilidades.js";

main();

function main() {
  document.addEventListener("DOMContentLoaded", utilidades.obtenerEntidadPaginada(urlClienteLocal, "cliente"));

  document.addEventListener("click", async (event) => {

    if (event.target.matches(".crear")) {
      utilidades.crearConForm(urlClienteLocal);
    }

    if (event.target.matches(".editar")) {
      utilidades.editarConForm(event.target, urlClienteLocal);
    }

    if (event.target.matches(".botonEstado")) {
      utilidades.cambiarEstado(urlClienteLocal, event.target.dataset.id)
    }

    if (event.target.matches(".ver")) {
      let nombreCliente = event.target.dataset.nombre;
      let apellidoCliente = event.target.dataset.apellido;
      let documentoCliente = event.target.dataset.documento;
      let telefonoCliente = event.target.dataset.telefono;
      let clienteDatos = `<p><b>DNI:</b> ${documentoCliente}</p><br><p><b>Teléfono:</b>${telefonoCliente}</p>`;
      utilidades.modalInformativo("Cliente", nombreCliente + " " + apellidoCliente, clienteDatos);
    }

    if (event.target.matches("#btn_next")) {
      utilidades.avanzarPagina(urlClienteLocal, "cliente");
    }

    if (event.target.matches("#btn_prev")) {
      utilidades.retrocederPagina(urlClienteLocal, "cliente");
    }
  });
}