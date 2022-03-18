import { options, urlCliente, urlDesactivar, urlActivar, footerModal, footerModalFormulario } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

function obtenerClientes() {
  obtenerJson(urlCliente).then(clientes => {
    clientes.forEach(cliente => {
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
      $template.querySelector(".estado").classList.remove('tachado');

      $template.querySelector(".editar").removeAttribute("disabled")
      $template.querySelector(".botonEstado").dataset.id = cliente.id;
      $template.querySelector(".botonEstado").dataset.estado = cliente.alta;

      if (cliente.alta) {
        $template.querySelector(".botonEstado").classList.add('btn-success');
        $template.querySelector(".estado").textContent = "Activado";
      } else {
        $template.querySelector(".estado").textContent = "Desactivo";
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
}
d.addEventListener("DOMContentLoaded", obtenerClientes());

function activarCliente(urlCliente, index) {
  obtenerJson(urlCliente + index).then(response => {
    {
      let btn = d.querySelector("#botonEstado_" + index)
      btn.classList.remove("btn-danger")
      btn.classList.add("btn-success")
      btn.dataset.estado = "true";
      btn.parentElement.children[0].removeAttribute("disabled")
      btn.parentNode.parentNode.children[0].classList.remove("tachado")
      btn.parentNode.parentNode.children[1].classList.remove("tachado")
      btn.parentNode.parentNode.children[2].classList.remove("tachado")
      btn.parentNode.parentNode.children[3].classList.remove("tachado")
      d.getElementById("estado_" + index).innerHTML = "Activado";
    }
  });
}

function desactivarCliente(urlCiente, index) {
  obtenerJson(urlCliente + index).then(response => {
    {
      let btn = d.querySelector("#botonEstado_" + index)
      btn.classList.remove("btn-success")
      btn.classList.add("btn-danger")
      btn.dataset.estado = "false";
      btn.parentElement.children[0].setAttribute("disabled", '')
      btn.parentNode.parentNode.children[0].classList.add("tachado")
      btn.parentNode.parentNode.children[1].classList.add("tachado")
      btn.parentNode.parentNode.children[2].classList.add("tachado")
      btn.parentNode.parentNode.children[3].classList.add("tachado")

      d.getElementById("estado_" + index).innerHTML = "Desactivado";
    }
  });
}

d.addEventListener("click", async (e) => {
  var btn = e.target;

  if (e.target.matches(".botonEstado")) {
    if (btn.dataset.estado == 'true') {
      desactivarCliente(urlCliente + urlDesactivar, btn.dataset.id);
    } else {
      activarCliente(urlCliente + urlActivar, btn.dataset.id);
    }
  }
});

async function crearCliente(urlCliente, options) {
  return await obtenerJson(urlCliente, options);
}


d.addEventListener("click", async (e) => {
  if (e.target.matches(".crear")) {

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
      preConfirm: () => {
        let documento, nombre, apellido, telefono, username, password, roleId;
        documento = Swal.getPopup().querySelector('#documento').value;
        nombre = Swal.getPopup().querySelector(`#nombre`).value;
        apellido = Swal.getPopup().querySelector('#apellido').value;
        telefono = Swal.getPopup().querySelector(`#telefono`).value;
        username = Swal.getPopup().querySelector(`#username`).value;
        password = Swal.getPopup().querySelector('#password').value;
        roleId = 2;
        return { documento, nombre, apellido, telefono, username, password, roleId };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {

          options.method = 'POST';
          options.body = JSON.stringify(result.value);
          let urlLocal = "http://localhost:8080/api/v1/cliente/";
          crearCliente(urlLocal, options)
            .then(response => {
              Swal.fire(`Se ha creado exitosamente el cliente: <b>${response.nombre}</b>!`, '', 'success')
            }).catch(error => {
              Swal.fire('Contactese con el admin.', '', 'warning')
            })

        } else {
          Swal.fire('Se ha cancelado la operación', '', 'warning')
        }

      } else {
        Swal.fire('Se ha cancelado la operación', '', 'warning')
      }
    });

  }

});

