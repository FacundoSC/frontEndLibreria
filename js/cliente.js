import { options, urlCliente, urlDesactivar, urlActivar, footerModal, footerModalFormulario } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

let clientes;
let current_page = 0;
let totalPages

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();


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

d.addEventListener("click", async (e) => {
  var btn = e.target;

  if (e.target.matches(".botonEstado")) {
    if (btn.dataset.estado == 'true') {
      desactivarCliente(btn.dataset.id);
    } else {
      activarCliente(btn.dataset.id);
    }
  }
});

async function crearCliente(urlCliente, options) {

  return await obtenerJson(urlCliente, options).then(response => {
    console.log(response);
    if(response.status>=200 && response.status <=300){

    let id = response.id
    let nombre = response.nombre
    let alta = response.alta

    $template.querySelector(".documento").textContent = response.documento;
    $template.querySelector(".documento").id = `documento_${id}`;
    $template.querySelector(".nombre").textContent = nombre;
    $template.querySelector(".nombre").id = `nombre_${id}`;
    $template.querySelector(".apellido").textContent = response.apellido;
    $template.querySelector(".apellido").id = `apellido_${id}`;
    $template.querySelector(".telefono").textContent = response.telefono;
    $template.querySelector(".telefono").id = `telefono_${id}`;
    $template.querySelector(".username").textContent = response.username;
    $template.querySelector(".username").id = `username_${id}`;
    $template.querySelector(".password").textContent = response.password;
    $template.querySelector(".password").id = `password_${id}`;


    $template.querySelector(".estado").textContent = alta;
    $template.querySelector(".estado").id = `estado_${id}`;
    $template.querySelector(".editar").dataset.id = `${id}`;
    $template.querySelector(".editar").id = `editar_${id}`;
    $template.querySelector(".ver").dataset.nombre = nombre;
    $template.querySelector(".botonEstado").id = `botonEstado_${id}`;
    $template.querySelector(".botonEstado").dataset.nombre = nombre;
    $template.querySelector(".botonEstado").dataset.id = id;
    $template.querySelector(".botonEstado").dataset.estado = alta;
    $template.querySelector(".botonEstado").classList.remove('btn-danger');
    $template.querySelector(".nombre").classList.remove('tachado');
    $template.querySelector(".estado").classList.remove('tachado');
    $template.querySelector(".botonEstado").classList.add('btn-success');

    let $clone = d.importNode($template, true);
    $fragment.appendChild($clone);
    $table.querySelector("tbody").appendChild($fragment);
    
    }else{
      return Promise.reject(response);

    }
  }).catch(function(response){
    return response.message;
  });

  // return await obtenerJson(urlCliente, options);
}

function modificarCliente(urlCliente, id, options) {
  obtenerJson(urlCliente + id, options).then(response => {
    d.getElementById("documento_" + id).innerHTML = response.documento;
    d.getElementById("nombre_" + id).innerHTML = response.nombre;
    d.getElementById("apellido_" + id).innerHTML = response.apellido;
    d.getElementById("telefono_" + id).innerHTML = response.telefono;


    let listadoBotones = d.getElementById(`editar_${id}`).parentElement;
    listadoBotones.children[1].dataset.nombre = response.nombre;
    listadoBotones.children[2].dataset.nombre = response.nombre;
  }).catch(error => console.error(error));
}


d.addEventListener("click", async (e) => {
  if (e.target.matches(".editar")) {

    let id = e.target.dataset.id

    let documento = d.getElementById("documento_" + id).textContent;
    let nombre = d.getElementById("nombre_" + id).textContent;
    let apellido = d.getElementById("apellido_" + id).textContent;
    let telefono = d.getElementById("telefono_" + id).textContent;


    Swal.fire({
      title: 'Ingrese los datos a modificar : ',
      html:
        `Documento<input id="documento" class="swal2-input" value = "${documento}">` +
        `Nombre<input id="nombre" class="swal2-input" value = "${nombre}">` +
        `Apellido<input id="apellido" class="swal2-input" value = "${apellido}">` +
        `Telefono<input id="telefono" class="swal2-input" value = "${telefono}">`,

      showCancelButton: true,
      cancelButtonText: 'Cancelar ❌',
      confirmButtonText: 'Guardar 💾',
      focusConfirm: false,
      preConfirm: () => {
        let documento, nombre, apellido, telefono, roleId, username, password;
        documento = Swal.getPopup().querySelector('#documento').value;
        nombre = Swal.getPopup().querySelector(`#nombre`).value;
        apellido = Swal.getPopup().querySelector('#apellido').value;
        telefono = Swal.getPopup().querySelector(`#telefono`).value;

        roleId = 2;
        username = "js@js.com";
        password = "123";

        return { documento, nombre, apellido, telefono, roleId, username, password };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {

          let id = e.target.dataset.id;
          options.method = 'PUT';
          options.body = JSON.stringify(result.value);
          let urlLocal = "http://localhost:8085/api/v1/cliente/";
          modificarCliente(urlLocal, id, options)

        } else {
          Swal.fire('Se ha cancelado la operación', '', 'warning')
        }

      } else {
        Swal.fire('Se ha cancelado la operación', '', 'warning')
      }
    });

  }

});


function obtenerClientesPaginados() {

  obtenerJson(urlCliente + `paged?page=${current_page}&size=10`).then(response => {
    totalPages = response.totalPages;
    current_page = response.pageable.pageNumber

    document.querySelector("#pagActual").textContent = (current_page + 1);
    document.querySelector("#pagTotales").textContent = totalPages;

    let btnPrevio = document.querySelector("#btn_prev");
    let btnSiguiente = document.querySelector("#btn_next");

    (current_page == 0) ? btnPrevio.setAttribute("disabled", '') : btnPrevio.removeAttribute("disabled");
    (totalPages == (current_page + 1)) ? btnSiguiente.setAttribute("disabled", '') : btnSiguiente.removeAttribute("disabled");

    response.content.forEach(cliente => {
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

      // $template.querySelector(".estado").classList.remove('tachado');

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

        // $template.querySelector(".estado").classList.add('tachado');
        $template.querySelector(".editar").setAttribute("disabled", '')
      }
      let $clone = document.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);
  })
}

d.addEventListener("DOMContentLoaded", obtenerClientesPaginados());

d.addEventListener("click", async (e) => {
  if (e.target.matches("#btn_next")) {
    if (current_page < (totalPages - 1)) {
      current_page++;
      $table.querySelector("tbody").innerHTML = "";
      obtenerClientesPaginados();
    }
  }

  if (e.target.matches("#btn_prev")) {
    if (current_page > 0) {
      current_page--;
      $table.querySelector("tbody").innerHTML = "";
      obtenerClientesPaginados();
    }
  }
});


d.addEventListener("click", async (e) => {
  if (e.target.matches(".crear")) {
    let nombreFormularioCliente = "";
    Swal.fire({
      title: 'Ingrese sus Datos de Cliente: ',
      html:
        'Documento<input id="documento" class="swal2-input">' +
        'Nombre<input id="nombre" class="swal2-input">' +
        'Apellido<input id="apellido" class="swal2-input">' +
        'Telefono<input id="telefono" class="swal2-input">' +
        'Username<input id="username" class="swal2-input" type ="email">' +
        'Password<input id="password" class="swal2-input" type ="password">',

      showCancelButton: true,
      cancelButtonText: 'Cancelar ❌',
      confirmButtonText: 'Guardar 💾',
      focusConfirm: false,
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: async () => {
        
        let clienteCrear = {
          documento: obtenerValorSwalPopUp("documento"),
          nombre: obtenerValorSwalPopUp("nombre"),
           nombreFormularioCliente :nombre,
          apellido: obtenerValorSwalPopUp("apellido"),
          telefono: obtenerValorSwalPopUp("telefono"),
          username: obtenerValorSwalPopUp("username"),
          password: obtenerValorSwalPopUp("password"),
          roleId: 2
        }
       
         if (!clienteCrear.documento || !clienteCrear.apellido|| !clienteCrear.nombre ||
           !clienteCrear.telefono || !clienteCrear.username || !clienteCrear.password) {
             Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i> El campo es obligatorio') 
           }
            
          
        options.method = 'POST';
        options.body = JSON.stringify(clienteCrear);
        let urlLocal = "http://localhost:8085/api/v1/cliente/";
         let responseBackEnd = await crearCliente(urlLocal, options);

         if (!isNaN(clienteCrear.documento)) {
          if (responseBackEnd) {
            Swal.showValidationMessage(responseBackEnd);
          }
        } else {
          if (isNaN(clienteCrear.documento)) {
            Swal.showValidationMessage(`El documento debe ser numerico`);
          }
         }

        let regVar=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/

          if (!regVar.test(crearCliente.username)){
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i> El username no es valido') 
          }else{
            if (responseBackEnd) {
              Swal.showValidationMessage(responseBackEnd);
            }
          }
        
       
        
      },

    }).then((result) => {
      if (result.isConfirmed) {
        
          Swal.fire(`Se ha creado exitosamente el cliente ${nombreFormularioCliente}`, '', 'success')
      }else{
        Swal.fire('Se ha cancelado la operación', '', 'warning')
      }
    })
  }
});

 
function obtenerValorSwalPopUp(clase) {
  return Swal.getPopup().querySelector('#' + clase).value
}

function mostrarMensajeError(responseBackEnd) {
  if (responseBackEnd) {
    return Swal.showValidationMessage(responseBackEnd);
  }
}