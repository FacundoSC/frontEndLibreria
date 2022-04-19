import {options} from "./constantes.js"
import * as utilidades from "./utilidades.js"
export function modalCargaDatos() {
    Swal.fire({
      title: "CARGANDO DATOS",
      html: "<h3>Aguarde por favor</h3><p><img src='../img/nyan-cat.gif'><p>",
      width: 500,
      backdrop: `rgba(0,0,40,0.4)`,
      showConfirmButton: false,
    });
  }
  
  export function modalMostrarResultado(resultado) {
    let msj;
    if (resultado) {
      msj = "<h3 style='margin: 0; padding: 3rem'>Petición exitosa! 🥳</h3>";
    } else {
      msj = "<h3 style='margin: 0; padding: 3rem'>Algo ha fallado 😭</h3>";
    }
  
    Swal.fire({
      html: msj,
      backdrop: `rgba(0,0,40,0.4)`,
      showConfirmButton: false,
      width: 500,
      timer: 1500,
    });
  }
  
  export function modalConfirmacionCambioEstado(estado, index) {
    let nombre = document.querySelector(`#nombre_${index}`).textContent;
    Swal.fire(
      `El estado de: <b>${nombre}</b> ha sido modificado a: <b>${estado}</b>.`,
      "",
      "success"
    );
  }
  
  export function modalExito() {
    Swal.fire({
      icon: "success",
      title: "Se ha guardado correctamente!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  
  export function modalError(msj) {
    Swal.fire(msj, "", "error");
  }
  
  export async function modalPedirConfirmacion() {
    return await Swal.fire({
      title: "¿Deseas cambiar el estado?",
      showDenyButton: true,
      icon: "question",
      confirmButtonText: "SI 😎",
      denyButtonText: `NO 🙏`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });
  }
  
  export function modalCancelacion() {
    Swal.fire("Se ha cancelado la operación", "", "warning");
  }
  
  export function modalInformativo(tipo, nombre, textoHTML = "") {
    Swal.fire({
      icon: "info",
      title: tipo,
      html: `<p class="nombreAutor">${nombre}</p><br>
    ${textoHTML}`,
    });
  }

  export function modalFormulario(textoHTML, url, accion, id = undefined) {
    Swal.fire({
      title: accion,
      html: textoHTML,
      allowEnterKey: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar ❌",
      confirmButtonText: "Guardar 💾",
      preConfirm: async () => {
        let objeto = utilidades.objetoAPersistir();
        let entidad = utilidades.obtenerNombrePagina().toLowerCase();
        let responseBackEnd = utilidades.validarObjeto(objeto, entidad)
  
        //esta logica deberia borrarse 
         if(utilidades.obtenerNombrePagina().toLowerCase() == "cliente"){
          objeto = utilidades.completarCliente(objeto);
        }
        //esta logica deberia borrarse 
  
        if(responseBackEnd){
          Swal.showValidationMessage(responseBackEnd)
        } else{
          options.body = JSON.stringify(objeto);
          if (accion.toLowerCase() == "modificar") {
            options.method = "PUT";
            responseBackEnd = await utilidades.modificarEntidad(url, id, options);
          } else {
            options.method = "POST";
            responseBackEnd = await utilidades.crearEntidad(url, options);
          }
          if (responseBackEnd) Swal.showValidationMessage(responseBackEnd);
        }
  
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        modalCancelacion();
      }
    });
  }