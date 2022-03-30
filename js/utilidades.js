import { obtenerJson } from "./asincronico.js";
import { urlDesactivar, urlActivar } from "./constantes.js";

export function modalCargaDatos() {
  Swal.fire({
    title: 'CARGANDO DATOS',
    html: "<h3>Aguarde por favor</h3><p><img src='../img/nyan-cat.gif'><p>",
    width: 500,
    backdrop: `rgba(0,0,40,0.4)`,
    showConfirmButton: false
  })
}

export function modalMostrarResultado(resultado) {
  let msj;
  if (resultado) {
    msj = "<h3 style='margin: 0; padding: 3rem'>Petición exitosa! 🥳</h3>"
  } else {
    msj = "<h3 style='margin: 0; padding: 3rem'>Algo ha fallado 😭</h3>"
  }

  Swal.fire({
    html: msj,
    backdrop: `rgba(0,0,40,0.4)`,
    showConfirmButton: false,
    width: 500,
    timer: 1500
  })
}

export function modalConfirmacionCambioEstado(estado, index) {
  let nombre = document.querySelector(`#nombre_${index}`).textContent
  Swal.fire(`El estado de la editorial <b>${nombre}</b> ha sido modificado a: <b>${estado}</b>.`, '', 'success')
}

export function modalExito() {
  Swal.fire(`Se ha guardado correctamente!`, '', 'success')
}

export function modalError(msj) {
  Swal.fire(msj, '', 'error')
}

async function modalPedirConfirmacion() {
  return await Swal.fire({
    title: '¿Deseas cambiar el estado?',
    showDenyButton: true,
    icon: 'question',
    confirmButtonText: 'SI 😎',
    denyButtonText: `NO 🙏`,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })
}

export function modalCancelacion() {
  Swal.fire('Se ha cancelado la operación', '', 'warning')
}

export function modalInformativo(tipo, nombre, textoHTML = '') {
  Swal.fire({
    icon: 'info',
    title: tipo,
    html: `<p class="nombreAutor">${nombre}</p><br>
  ${textoHTML}`
  })
}
//Fin modales

//Modificaciones DOM
export function obtenerEntidadPaginada(url, tipo, current_page = 0) {
  modalCargaDatos()
  obtenerJson(url + `paged?page=${current_page}&size=10`).then(response => {
    modalMostrarResultado(response.content);
    seteoPaginas(response);
    pintarResultado(response.content, tipo);
  })
}

export function pintarCambioEstado(index, estadoAnterior) {
  let btn = document.querySelector("#botonEstado_" + index)
  if (!estadoAnterior) {
    btn.classList.remove("btn-danger")
    btn.classList.add("btn-success")
    btn.dataset.estado = "true";
    btn.parentElement.children[0].removeAttribute("disabled")
    btn.parentNode.parentNode.children[0].classList.remove("tachado")
    btn.parentNode.parentNode.children[1].classList.remove("tachado")
    document.getElementById("estado_" + index).innerHTML = "Activado";
  } else {
    btn.classList.remove("btn-success")
    btn.classList.add("btn-danger")
    btn.dataset.estado = "false";
    btn.parentElement.children[0].setAttribute("disabled", '')
    btn.parentNode.parentNode.children[0].classList.add("tachado")
    btn.parentNode.parentNode.children[1].classList.add("tachado")
    document.getElementById("estado_" + index).innerHTML = "Desactivado";
  }
}

export function seteoPaginas(response) {
  let totalPages = response.totalPages;
  let current_page = response.pageable.pageNumber

  document.querySelector("#pagActual").textContent = (current_page + 1);
  document.querySelector("#pagTotales").textContent = totalPages;

  let btnPrevio = document.querySelector("#btn_prev");
  let btnSiguiente = document.querySelector("#btn_next");

  (current_page == 0) ? btnPrevio.setAttribute("disabled", '') : btnPrevio.removeAttribute("disabled");
  (totalPages == (current_page + 1)) ? btnSiguiente.setAttribute("disabled", '') : btnSiguiente.removeAttribute("disabled");
}

export function pintarResultado(response, tipo) {
  if (tipo == 'editorial') {
    // pintarEditorial(response)
    pintarEntidad(response)
  }
  if (tipo == 'autor') {
    // pintarAutor(response)
    pintarEntidad(response)
  }
  $table.querySelector("tbody").appendChild($fragment);
};

function pintarEditorial(response) {
  response.forEach(editorial => {

    $template.querySelector(".nombre").textContent = editorial.nombre;
    $template.querySelector(".nombre").id = `nombre_${editorial.id}`;
    $template.querySelector(".nombre").classList.remove('tachado');
    // $template.querySelector(".nombre").dataset.editable = true;
    $template.querySelector(".nombre").dataset.type = "text";

    $template.querySelector(".estado").id = `estado_${editorial.id}`;
    $template.querySelector(".estado").classList.remove('tachado');
    // $template.querySelector(".estado").dataset.editable = true;
    $template.querySelector(".estado").dataset.type = "text";


    //logica para adicion de libros en select
    $template.querySelector(".asociados").innerHTML = ""; //Remueve los hijos
    if (editorial.libros.length == 0) {
      let elemento = document.createElement('p')
      elemento.textContent = "NO EXISTEN LIBROS ASOCIADOS";
      $template.querySelector(".asociados").appendChild(elemento)
    }
    else {
      let selector = document.createElement('select')
      selector.setAttribute("id", "select_" + editorial.id)
      let fragmentLibro = document.createDocumentFragment();
      editorial.libros.forEach((libro) => {
        let elemento = document.createElement('option');
        elemento.textContent = libro.titulo;
        elemento.dataset.autor = libro.autorNombre;
        selector.appendChild(elemento);
      });
      fragmentLibro.appendChild(selector);
      $template.querySelector(".asociados").appendChild(fragmentLibro);
    }
    //fin logica para adicion de libros en select

    $template.querySelector(".asociados").id = `asociados_${editorial.id}`;

    $template.querySelector(".editar").dataset.id = `${editorial.id}`;
    $template.querySelector(".editar").id = `editar_${editorial.id}`;
    $template.querySelector(".editar").removeAttribute("disabled")

    $template.querySelector(".ver").dataset.nombre = editorial.nombre;
    $template.querySelector(".ver").id = `ver_${editorial.id}`;
    $template.querySelector(".ver").dataset.id = editorial.id;

    $template.querySelector(".botonEstado").id = `botonEstado_${editorial.id}`;
    $template.querySelector(".botonEstado").classList.remove('btn-success');
    $template.querySelector(".botonEstado").classList.remove('btn-danger');
    $template.querySelector(".botonEstado").dataset.nombre = editorial.nombre;
    $template.querySelector(".botonEstado").dataset.id = editorial.id;
    $template.querySelector(".botonEstado").dataset.estado = editorial.alta;

    if (editorial.alta) {
      $template.querySelector(".estado").textContent = "Activado";
      $template.querySelector(".botonEstado").classList.add('btn-success');
    } else {
      $template.querySelector(".estado").textContent = "Desactivado";
      $template.querySelector(".botonEstado").classList.add('btn-danger');
      $template.querySelector(".nombre").classList.add('tachado');
      $template.querySelector(".estado").classList.add('tachado');
      $template.querySelector(".editar").setAttribute("disabled", '')
    }
    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });
}

function propiedadesAPintar() {
  let padre = $template.children[0].children;
  let propiedadesAPintar = [];

  for (const hijo of padre) {
    if (hijo.dataset.toshow) {
      propiedadesAPintar.push(hijo.dataset.toshow)
    }
  }
  return propiedadesAPintar;
}

function botonesAPintar() {
  return $template.querySelector("#botones").children
}

function pintarPropiedad(entidad) {
  let listadoPropiedades = propiedadesAPintar();
  listadoPropiedades.forEach(propiedad => {
    $template.querySelector(`.${propiedad}`).textContent = entidad[propiedad];
    $template.querySelector(`.${propiedad}`).id = `${propiedad}_${entidad.id}`;
    $template.querySelector(`.${propiedad}`).dataset[propiedad] = entidad[propiedad];
    $template.querySelector(`.${propiedad}`).classList.remove('tachado');
    if (!entidad["alta"]) {
      $template.querySelector(`.${propiedad}`).classList.add('tachado');
    }
  })
}

function pintarBotones(entidad, listadoPropData) {
  let botones = botonesAPintar();

  $template.querySelector(".botonEstado").classList.remove('btn-success');
  $template.querySelector(".botonEstado").classList.remove('btn-danger');
  if (entidad["alta"]) {
    $template.querySelector(".botonEstado").classList.add('btn-success');
    $template.querySelector(".editar").removeAttribute("disabled")
  } else {
    $template.querySelector(".botonEstado").classList.add('btn-danger');
    $template.querySelector(".editar").setAttribute("disabled", '')
  }

  for (const boton of botones) {
    let tipoBoton = boton.dataset.toshow;
    boton.id = `${tipoBoton}_${entidad.id}`
    listadoPropData.forEach(prop => {
      boton.dataset[prop] = entidad[prop];
      }
    )
  }
}


//Prueba pintadoGenerico
function pintarEntidad(response) {

  let listadoPropData = Object.keys(response[0]);

  response.forEach(entidad => {
    pintarPropiedad(entidad)
    pintarBotones(entidad, listadoPropData)

    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  })
}

//FIn prueba

function pintarAutor(response) {
  response.forEach(autor => {
    $template.querySelector(".nombre").textContent = autor.nombre;
    $template.querySelector(".nombre").id = `nombre_${autor.id}`;

    $template.querySelector(".estado").textContent = autor.alta;
    $template.querySelector(".estado").id = `estado_${autor.id}`;

    $template.querySelector(".editar").dataset.id = `${autor.id}`;
    $template.querySelector(".editar").id = `editar_${autor.id}`;

    $template.querySelector(".ver").dataset.nombre = autor.nombre;
    $template.querySelector(".ver").id = `ver_${autor.id}`;
    $template.querySelector(".ver").dataset.id = autor.id;

    $template.querySelector(".botonEstado").id = `botonEstado_${autor.id}`;
    $template.querySelector(".botonEstado").classList.remove('btn-success');
    $template.querySelector(".botonEstado").classList.remove('btn-danger');
    $template.querySelector(".botonEstado").dataset.nombre = autor.nombre;
    $template.querySelector(".nombre").classList.remove('tachado');
    $template.querySelector(".estado").classList.remove('tachado');
    $template.querySelector(".editar").removeAttribute("disabled")
    $template.querySelector(".botonEstado").dataset.id = autor.id;
    $template.querySelector(".botonEstado").dataset.estado = autor.alta;
    if (autor.alta) {
      $template.querySelector(".botonEstado").classList.add('btn-success');
    } else {
      $template.querySelector(".botonEstado").classList.add('btn-danger');
      $template.querySelector(".nombre").classList.add('tachado');
      $template.querySelector(".estado").classList.add('tachado');
      $template.querySelector(".editar").setAttribute("disabled", '')
    }
    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });
}

export function modificarInfo(response, id) {
  let nombreNuevo = response.nombre
  document.getElementById("nombre_" + id).innerHTML = nombreNuevo;
  document.getElementById("botonEstado_" + id).dataset.nombre = nombreNuevo;
  document.getElementById("ver_" + id).dataset.nombre = nombreNuevo;
}

export function cambiarEstado(url, id) {
  modalPedirConfirmacion().then((result) => {
    if (result.isConfirmed) {
      let estado = document.querySelector("#botonEstado_" + id).dataset.estado
      if (estado == "true") {
        desactivarEntidad(url + urlDesactivar, id);
      } else {
        activarEntidad(url + urlActivar, id);
      }
    } else if (result.isDenied) {
      modalCancelacion()
    }
  });
}

export function crearEntidad(url, options) {
  obtenerJson(url, options).then(response => {
    if (!response.message) {
      modalExito();
    }
    else {
      return Promise.reject(response);
    }
  }).catch(badResponse => {
    modalError(badResponse.message)
  });
}

export function modificarEntidad(url, id, options) {
  obtenerJson(url + id, options).then(response => {
    if (!response.message) {
      modificarInfo(response, id)
      modalExito()
    }
    else {
      return Promise.reject(response);
    }
  }).catch(badResponse => {
    modalError(badResponse.message)
  });
}
//Fin modificaciones DOM

//Ocultar boton de creacion
document.addEventListener('scroll', () => {
  let elemento = document.querySelector("#crear");
  elemento.classList.add("desaparecer")

  setTimeout(() => { elemento.classList.remove("desaparecer") }, 1000);
})
//Fin ocultar boton de creacion

//Funcion de busqueda
let searchInput, table, texto

document.addEventListener("DOMContentLoaded", () => {
  searchInput = document.getElementById('buscar');
  searchInput.addEventListener('keyup', buscaTabla);
})

function buscaTabla() {
  table = document.getElementById("tabla").tBodies[0];
  texto = searchInput.value.toLowerCase();
  var r = 0;
  let row
  while (row = table.rows[r++]) {
    if (row.children[0].innerText.toLowerCase().indexOf(texto) !== -1) {
      row.style.display = null;
    } else
      row.style.display = 'none';
  }
}
//FIN busqueda

//Variables globales para pintado
let $table = document.querySelector(".table");
let $template = document.getElementById("crud-template").content;
let $fragment = document.createDocumentFragment();
//FIN Variables globales para pintado


//Función ACTIVAR
function activarEntidad(url, index) {
  obtenerJson(url + index).then(response => {
    if (response.status == 200) {
      pintarCambioEstado(index, false)
      modalConfirmacionCambioEstado("Activado", index)
    } else {
      return Promise.reject(response);
    }
  }).catch(badResponse => {
    modalError(badResponse.message)
  });
}
//Fin ACTIVAR

//Función DESACTIVAR
function desactivarEntidad(url, index) {
  obtenerJson(url + index).then(response => {
    if (response.status == 200) {
      pintarCambioEstado(index, true)
      modalConfirmacionCambioEstado("Desactivado", index)
    } else {
      return Promise.reject(response);
    }
  }).catch(badResponse => {
    modalError(badResponse.message)
  });
}
//Fin DESACTIVAR