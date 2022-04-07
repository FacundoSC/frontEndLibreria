import { options, urlClienteLocal, urlDesactivar, urlActivar } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";
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

async function crearCliente(urlClienteLocal, options) {

  return await obtenerJson(urlClienteLocal, options).then(response => {
    console.log(response);
    if (response.status >= 200 && response.status <= 300) {

      utilidades.modalExito();
    } else {
      return Promise.reject(response.body);

    }
  }).catch(function (response) {
    return response.message;
  });
}

async function modificarCliente(id, options) {
  return await obtenerJson(urlClienteLocal + id, options).then(response => {
    console.log(response.status);
    if (response.status >= 200 && response.status <300) {
    document.getElementById("documento_" + id).innerHTML = response.body.documento;
    d.getElementById("nombre_" + id).innerHTML = response.body.nombre;
    d.getElementById("apellido_" + id).innerHTML = response.body.apellido;
    d.getElementById("telefono_" + id).innerHTML = response.body.telefono;
    console.log(response);
    let listadoBotones = d.getElementById(`editar_${id}`).parentElement;
    listadoBotones.children[1].dataset.nombre = response.body.nombre;
    listadoBotones.children[2].dataset.documento= response.body.documento;
    listadoBotones.children[2].dataset.nombre = response.body.nombre;
    listadoBotones.children[2].dataset.apellido = response.body.apellido;
    listadoBotones.children[2].dataset.telefono = response.body.telefono;

      utilidades.modalExito();
    } else {
      return Promise.reject(response.body);

    }
  }).catch(function (response) {
    return response.message;
  });
}

function obtenerValorSwalPopUp(clase) {
  return Swal.getPopup().querySelector('#' + clase).value
}
function aBorrar(){ 
let id = event.target.dataset.id

let documento = document.getElementById("documento_" + id).textContent;
let nombre = document.getElementById("nombre_" + id).textContent;
let apellido = document.getElementById("apellido_" + id).textContent;
let telefono = document.getElementById("telefono_" + id).textContent;

Swal.fire({
  title: 'Ingrese los datos a modificar : ',
  html:
    `Documento<input id="documento" class="swal2-input" value = "${documento}"><br>` +
    `Nombre<input id="nombre" class="swal2-input" value = "${nombre}"><br>` +
    `Apellido<input id="apellido" class="swal2-input" value = "${apellido}"><br>` +
    `Telefono<input id="telefono" class="swal2-input" value = "${telefono}"><br>`,

  showCancelButton: true,
  cancelButtonText: 'Cancelar ❌',
  confirmButtonText: 'Guardar 💾',
  focusConfirm: false,
  preConfirm: async () => {
    
    let documento = obtenerValorSwalPopUp("documento");
    let clienteModificar = {
      nombre: obtenerValorSwalPopUp("nombre"),
      nombreFormularioCliente: nombre,
      apellido: obtenerValorSwalPopUp("apellido"),
      telefono: obtenerValorSwalPopUp("telefono"),
      username: "jsjs@js.com",
      password: "passWord_123!",
      roleId: 2
    }

    if ((documento.length>=6 && documento.length <=8)&& utilidades.esUnNumero(documento)) {

      clienteModificar.documento= parseInt(documento);
      options.method = 'PUT';
      options.body = JSON.stringify(clienteModificar);
      let urlLocal = "http://localhost:8085/api/v1/cliente/";
      let responseBackEnd = await modificarCliente(id, options);
      if (responseBackEnd)Swal.showValidationMessage(responseBackEnd);
    } else {
      Swal.showValidationMessage("El documento no cumple con el formato");
    }
  },
}).then((result) => {
  if (!result.isConfirmed) {
    Swal.fire('Se ha cancelado la operación', '', 'warning')
  }
});
}


// if (event.target.matches(".crear")) {
//   let nombreFormularioCliente = "";
//   Swal.fire({
//     title: 'Ingrese sus Datos de Cliente: ',
//     html:
//       'Documento<input id="documento" class="swal2-input"><br>' +
//       'Nombre<input id="nombre" class="swal2-input"><br>' +
//       'Apellido<input id="apellido" class="swal2-input"><br>' +
//       'Telefono<input id="telefono" class="swal2-input"><br>' +
//       'Username<input id="username" class="swal2-input" type ="email"><br>' +
//       'Password<input id="password" class="swal2-input" type ="password">',

//     showCancelButton: true,
//     cancelButtonText: 'Cancelar ❌',
//     confirmButtonText: 'Guardar 💾',
//     focusConfirm: false,
//     preConfirm: async () => {
//       let documento = obtenerValorSwalPopUp("documento");
//       let clienteCrear = {
//         nombre: obtenerValorSwalPopUp("nombre"),
//         nombreFormularioCliente: nombre,
//         apellido: obtenerValorSwalPopUp("apellido"),
//         telefono: obtenerValorSwalPopUp("telefono"),
//         username: obtenerValorSwalPopUp("username"),
//         password: obtenerValorSwalPopUp("password"),
//         roleId: 2
//       }
     
//       if ((documento.length>=6 && documento.length <=8)&& utilidades.esUnNumero(documento)) {

//         clienteCrear.documento= parseInt(documento);
//         options.method = 'POST';
//         options.body = JSON.stringify(clienteCrear);
//         let urlLocal = "http://localhost:8085/api/v1/cliente/";
//         let responseBackEnd = await crearCliente(urlLocal, options);
//         if (responseBackEnd)Swal.showValidationMessage(responseBackEnd);
//       } else {
//         Swal.showValidationMessage("El documento no cumple con el formato");
//       }
//     },
//   }).then((result) => {
//     if (!result.isConfirmed) {
//       Swal.fire('Se ha cancelado la operación', '', 'warning')
//     }
//   })
// }