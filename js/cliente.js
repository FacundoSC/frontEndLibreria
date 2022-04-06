import { options, urlCliente, urlDesactivar, urlActivar } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";
import * as utilidades from "./utilidades.js";

let clientes;
let current_page = 0;
let totalPages

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();
main();

function main() {
  d.addEventListener("DOMContentLoaded", obtenerClientesPaginados());

  document.addEventListener("click", async (event) => {

    if (event.target.matches(".crear")) {
      let nombreFormularioCliente = "";
      Swal.fire({
        title: 'Ingrese sus Datos de Cliente: ',
        html:
          'Documento<input id="documento" class="swal2-input"><br>' +
          'Nombre<input id="nombre" class="swal2-input"><br>' +
          'Apellido<input id="apellido" class="swal2-input"><br>' +
          'Telefono<input id="telefono" class="swal2-input"><br>' +
          'Username<input id="username" class="swal2-input" type ="email"><br>' +
          'Password<input id="password" class="swal2-input" type ="password">',

        showCancelButton: true,
        cancelButtonText: 'Cancelar ❌',
        confirmButtonText: 'Guardar 💾',
        focusConfirm: false,
        preConfirm: async () => {
          let documento = obtenerValorSwalPopUp("documento");
          let clienteCrear = {
            nombre: obtenerValorSwalPopUp("nombre"),
            nombreFormularioCliente: nombre,
            apellido: obtenerValorSwalPopUp("apellido"),
            telefono: obtenerValorSwalPopUp("telefono"),
            username: obtenerValorSwalPopUp("username"),
            password: obtenerValorSwalPopUp("password"),
            roleId: 2
          }
         
          if ((documento.length>=6 && documento.length <=8)&& utilidades.esUnNumero(documento)) {

            clienteCrear.documento= parseInt(documento);
            options.method = 'POST';
            options.body = JSON.stringify(clienteCrear);
            let urlLocal = "http://localhost:8085/api/v1/cliente/";
            let responseBackEnd = await crearCliente(urlLocal, options);
            if (responseBackEnd)Swal.showValidationMessage(responseBackEnd);
          } else {
            Swal.showValidationMessage("El documento no cumple con el formato");
          }
        },
      }).then((result) => {
        if (!result.isConfirmed) {
          Swal.fire('Se ha cancelado la operación', '', 'warning')
        }
      })
    }

    if (event.target.matches(".editar")) {

      let id = event.target.dataset.id

      let documento = d.getElementById("documento_" + id).textContent;
      let nombre = d.getElementById("nombre_" + id).textContent;
      let apellido = d.getElementById("apellido_" + id).textContent;
      let telefono = d.getElementById("telefono_" + id).textContent;

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

    if (event.target.matches(".botonEstado")) {
      var btn = event.target;
      if (btn.dataset.estado == 'true') {
        desactivarCliente(btn.dataset.id);
      } else {
        activarCliente(btn.dataset.id);
      }
    }

    if (event.target.matches(".ver")) {

      let nombreCliente = event.target.dataset.nombre;
      let apellidoCliente = event.target.dataset.apellido;
      let documentoCliente = event.target.dataset.documento;
      let telefonoCliente = event.target.dataset.telefono;
      let clienteDatos = `<p ><b> DNI:</b> ${documentoCliente}</p><br>
                         <p ><b>Telefono:</b> ${telefonoCliente}</p>`;

      utilidades.modalInformativo("Cliente", nombreCliente + " " + apellidoCliente, clienteDatos);
    }

    if (event.target.matches("#btn_next")) {
      if (current_page < (totalPages - 1)) {
        current_page++;
        $table.querySelector("tbody").innerHTML = "";
        obtenerClientesPaginados();
      }
    }

    if (event.target.matches("#btn_prev")) {
      if (current_page > 0) {
        current_page--;
        $table.querySelector("tbody").innerHTML = "";
        obtenerClientesPaginados();
      }

    }
  });
}

function activarCliente(id) {
  obtenerJson(urlCliente + urlActivar + id).then(response => {
    {
      let btn = d.querySelector("#botonEstado_" + id)
      btn.classList.remove("btn-danger")
      btn.classList.add("btn-success")
      btn.dataset.estado = "true";
      btn.parentElement.children[0].removeAttribute("disabled")
      btn.parentNode.parentNode.children[0].classList.remove("tachado")
      btn.parentNode.parentNode.children[1].classList.remove("tachado")
      btn.parentNode.parentNode.children[2].classList.remove("tachado")
      btn.parentNode.parentNode.children[3].classList.remove("tachado")
      d.getElementById("estado_" + id).innerHTML = "Activado";
    }
  });
}

function desactivarCliente(id) {
  obtenerJson(urlCliente + urlDesactivar + id).then(response => {
    {
      let btn = d.querySelector("#botonEstado_" + id)
      btn.classList.remove("btn-success")
      btn.classList.add("btn-danger")
      btn.dataset.estado = "false";
      btn.parentElement.children[0].setAttribute("disabled", '')
      btn.parentNode.parentNode.children[0].classList.add("tachado")
      btn.parentNode.parentNode.children[1].classList.add("tachado")
      btn.parentNode.parentNode.children[2].classList.add("tachado")
      btn.parentNode.parentNode.children[3].classList.add("tachado")

      d.getElementById("estado_" + id).innerHTML = "Desactivado";
    }
  });
}

async function crearCliente(urlCliente, options) {

  return await obtenerJson(urlCliente, options).then(response => {
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
  return await obtenerJson(urlCliente + id, options).then(response => {
    console.log(response.status);
    if (response.status >= 200 && response.status <300) {
    d.getElementById("documento_" + id).innerHTML = response.body.documento;
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

function obtenerClientesPaginados() {

  Swal.fire({
    title: "CARGANDO DATOS",
    html: "<h3>Aguarde por favor</h3><p><img src='../img/nyan-cat.gif'><p>",
    width: 500,
    backdrop: `rgba(0,0,40,0.4)`,
    showConfirmButton: false,
  });

  obtenerJson(urlCliente + `paged?page=${current_page}&size=10`).then(response => {
    console.log(response);
    let msj;
      console.log(response.body.content)
      if (response.body.content) {
        msj = "<h3 style='margin: 0; padding: 3rem'>Petición exitosa! 🥳</h3>";
      } else {
        msj = "<h3 style='margin: 0; padding: 3rem'>Algo ha fallado 😭</h3>";
      }
      Swal.fire({
        html: msj,
        backdrop: `rgba(0,0,40,0.4)`,
        showConfirmButton: false,
        timer:1500
    });

    totalPages = response.body.totalPages;
    current_page = response.body.pageable.pageNumber

    document.querySelector("#pagActual").textContent = (current_page + 1);
    document.querySelector("#pagTotales").textContent = totalPages;

    let btnPrevio = document.querySelector("#btn_prev");
    let btnSiguiente = document.querySelector("#btn_next");

    (current_page == 0) ? btnPrevio.setAttribute("disabled", '') : btnPrevio.removeAttribute("disabled");
    (totalPages == (current_page + 1)) ? btnSiguiente.setAttribute("disabled", '') : btnSiguiente.removeAttribute("disabled");

    response.body.content.forEach(cliente => {
      $template.querySelector(".documento").textContent = cliente.documento;
      $template.querySelector(".documento").id = `documento_${cliente.id}`;
      $template.querySelector(".nombre").textContent = cliente.nombre;
      $template.querySelector(".nombre").id = `nombre_${cliente.id}`;
      $template.querySelector(".apellido").textContent = cliente.apellido;
      $template.querySelector(".apellido").id = `apellido_${cliente.id}`;
      $template.querySelector(".telefono").textContent = cliente.telefono;
      $template.querySelector(".telefono").id = `telefono_${cliente.id}`;

      $template.querySelector(".estado").textContent = cliente.alta;
      $template.querySelector(".estado").id = `estado_${cliente.id}`;
      $template.querySelector(".editar").dataset.id = `${cliente.id}`;
      $template.querySelector(".editar").id = `editar_${cliente.id}`;

      $template.querySelector(".ver").dataset.documento = cliente.documento;
      $template.querySelector(".ver").dataset.nombre = cliente.nombre;
      $template.querySelector(".ver").dataset.apellido = cliente.apellido;
      $template.querySelector(".ver").dataset.telefono = cliente.telefono;

      $template.querySelector(".botonEstado").id = `botonEstado_${cliente.id}`;
      $template.querySelector(".botonEstado").classList.remove('btn-success');
      $template.querySelector(".botonEstado").classList.remove('btn-danger');
      $template.querySelector(".botonEstado").dataset.nombre = cliente.nombre;

      $template.querySelector(".documento").classList.remove('tachado');
      $template.querySelector(".nombre").classList.remove('tachado');
      $template.querySelector(".apellido").classList.remove('tachado');
      $template.querySelector(".telefono").classList.remove('tachado');

      $template.querySelector(".editar").removeAttribute("disabled")
      $template.querySelector(".botonEstado").dataset.id = cliente.id;
      $template.querySelector(".botonEstado").dataset.estado = cliente.alta;

      if (cliente.alta) {
        $template.querySelector(".botonEstado").classList.add('btn-success');
        $template.querySelector(".estado").textContent = "Activado";
      } else {
        $template.querySelector(".estado").textContent = "Desactivado";
        $template.querySelector(".botonEstado").classList.add('btn-danger');
        $template.querySelector(".documento").classList.add('tachado');
        $template.querySelector(".nombre").classList.add('tachado');
        $template.querySelector(".apellido").classList.add('tachado');
        $template.querySelector(".telefono").classList.add('tachado');

        $template.querySelector(".editar").setAttribute("disabled", '')
      }
      let $clone = document.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);
  })
}

function obtenerValorSwalPopUp(clase) {
  return Swal.getPopup().querySelector('#' + clase).value
}

function mostrarMensajeError(responseBackEnd) {
  if (responseBackEnd) {
    return Swal.showValidationMessage(responseBackEnd);
  }
}

