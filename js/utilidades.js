import { obtenerJson } from "./asincronico.js";
import { options, urlDesactivar, urlActivar } from "./constantes.js";

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

async function modalPedirConfirmacion() {
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
//Fin modales

//Modificaciones DOM
export function obtenerEntidadPaginada(url, tipo) {
  let current_page = setearAtributosSesion()
 
  modalCargaDatos();
  obtenerJson(url + `paged?page=${current_page}&size=10`).then((response) => {
    modalMostrarResultado(response.body.content);
    seteoPaginas(response);
    pintarResultado(response.body.content, tipo);
  });
}

export function pintarCambioEstado(index, estadoAnterior) {
  let btn = document.querySelector("#estado_" + index);
  if (!estadoAnterior) {
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-success");
    btn.dataset.alta = "true";
    btn.parentElement.children[0].removeAttribute("disabled");
    btn.parentNode.parentNode.children[0].classList.remove("tachado");
    btn.parentNode.parentNode.children[1].classList.remove("tachado");
    document.getElementById("alta_" + index).innerHTML = "Activado";
  } else {
    btn.classList.remove("btn-success");
    btn.classList.add("btn-danger");
    btn.dataset.alta = "false";
    btn.parentElement.children[0].setAttribute("disabled", "");
    btn.parentNode.parentNode.children[0].classList.add("tachado");
    btn.parentNode.parentNode.children[1].classList.add("tachado");
    document.getElementById("alta_" + index).innerHTML = "Desactivado";
  }
}

export function seteoPaginas(response) {
  let totalPages = response.body.totalPages;
  let current_page = response.body.pageable.pageNumber;

  document.querySelector("#pagActual").textContent = current_page + 1;
  document.querySelector("#pagTotales").textContent = totalPages;

  let btnPrevio = document.querySelector("#btn_prev");
  let btnSiguiente = document.querySelector("#btn_next");

  current_page == 0
    ? btnPrevio.setAttribute("disabled", "")
    : btnPrevio.removeAttribute("disabled");
  totalPages == current_page + 1
    ? btnSiguiente.setAttribute("disabled", "")
    : btnSiguiente.removeAttribute("disabled");
}

function propiedadesAPintar() {
  let padre = $template.children[0].children;
  let propiedadesAPintar = [];

  for (const hijo of padre) {
    if (hijo.dataset.toshow) {
      propiedadesAPintar.push(hijo.dataset.toshow);
    }
  }
  return propiedadesAPintar;
}

function botonesAPintar() {
  return $template.querySelector("#botones").children;
}

function pintarPropiedad(entidad) {
  let listadoPropiedades = propiedadesAPintar();
  listadoPropiedades.forEach((propiedad) => {
    if (propiedad == "alta") {
      entidad[propiedad]
        ? ($template.querySelector(`.${propiedad}`).textContent = "Activado")
        : ($template.querySelector(`.${propiedad}`).textContent =
            "Desactivado");
    } else {
      $template.querySelector(`.${propiedad}`).textContent = entidad[propiedad];
    }
    $template.querySelector(`.${propiedad}`).id = `${propiedad}_${entidad.id}`;
    $template.querySelector(`.${propiedad}`).dataset[propiedad] =
      entidad[propiedad];
    $template.querySelector(`.${propiedad}`).classList.remove("tachado");
    if (!entidad["alta"]) {
      $template.querySelector(`.${propiedad}`).classList.add("tachado");
    }
  });
}

function pintarBotones(entidad, listadoPropData) {
  let botones = botonesAPintar();

  $template.querySelector(".botonEstado").classList.remove("btn-success");
  $template.querySelector(".botonEstado").classList.remove("btn-danger");
  if (entidad["alta"]) {
    $template.querySelector(".botonEstado").classList.add("btn-success");
    $template.querySelector(".editar").removeAttribute("disabled");
  } else {
    $template.querySelector(".botonEstado").classList.add("btn-danger");
    $template.querySelector(".editar").setAttribute("disabled", "");
  }

  for (const boton of botones) {
    let tipoBoton = boton.dataset.toshow;
    boton.id = `${tipoBoton}_${entidad.id}`;
    listadoPropData.forEach((propiedad) => {
      let tipoEntidad = typeof entidad[propiedad];
      if (tipoEntidad != "object") {
        boton.dataset[propiedad] = entidad[propiedad];
      }
    });
  }
}

function datosPorTipo(tipo, entidad) {
  if (tipo == "editorial") {
    pintarLibrosAsociados(entidad);
  }
}

function pintarLibrosAsociados(editorial) {
  $template.querySelector(".libros").innerHTML = ""; //Remueve los hijos
  if (editorial.libros.length == 0) {
    let elemento = document.createElement("p");
    elemento.textContent = "NO EXISTEN LIBROS ASOCIADOS";
    $template.querySelector(".libros").appendChild(elemento);
  } else {
    let selector = document.createElement("select");
    selector.setAttribute("id", "select_" + editorial.id);
    let fragmentLibro = document.createDocumentFragment();
    editorial.libros.forEach((libro) => {
      let elemento = document.createElement("option");
      elemento.textContent = libro.titulo;
      elemento.dataset.autor = libro.autorNombre;
      selector.appendChild(elemento);
    });
    fragmentLibro.appendChild(selector);
    $template.querySelector(".libros").appendChild(fragmentLibro);
  }
}

//Prueba pintadoGenerico
export function pintarResultado(response, tipo) {
  let listadoPropData = Object.keys(response[0]);

  response.forEach((entidad) => {
    pintarPropiedad(entidad);
    pintarBotones(entidad, listadoPropData);
    datosPorTipo(tipo, entidad);
    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });

  $table.querySelector("tbody").appendChild($fragment);
}
//FIn prueba

export function modificarInfo(response, id) {
  let nombreNuevo = response.nombre;
  document.getElementById("nombre_" + id).innerHTML = nombreNuevo;
  document.getElementById("estado_" + id).dataset.nombre = nombreNuevo;
  document.getElementById("ver_" + id).dataset.nombre = nombreNuevo;
}

export function cambiarEstado(url, id) {
  modalPedirConfirmacion().then((result) => {
    if (result.isConfirmed) {
      let estado = document.querySelector("#estado_" + id).dataset.alta;
      if (estado == "true") {
        desactivarEntidad(url + urlDesactivar, id);
      } else {
        activarEntidad(url + urlActivar, id);
      }
    } else if (result.isDenied) {
      modalCancelacion();
    }
  });
}

export async function crearEntidad(url, options) {
  return await obtenerJson(url, options)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        modalExito();
      } else {
        return Promise.reject(response.body);
      }
    })
    .catch((badResponse) => {
      return badResponse.message;
    });
}

export async function modificarEntidad(url, id, options) {
  return await obtenerJson(url + id, options)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        modificarInfo(response.body, id);
        modalExito();
      } else {
        return Promise.reject(response.body);
      }
    })
    .catch((badResponse) => {
      return badResponse.message;
    });
}

export function avanzarPagina(url, tipo) {
  let current_page = getNumPaginaSesionStorage() + 1;
  setNumPaginaSesionStorage(current_page);
  $table.querySelector("tbody").innerHTML = "";
  obtenerEntidadPaginada(url, tipo);
}

export function retrocederPagina(url, tipo) {
  let current_page = getNumPaginaSesionStorage() - 1;
  setNumPaginaSesionStorage(current_page);
  $table.querySelector("tbody").innerHTML = "";
  obtenerEntidadPaginada(url, tipo);
}
//Fin modificaciones DOM

//Ocultar boton de creacion
document.addEventListener("scroll", () => {
  let elemento = document.querySelector("#crear");
  elemento.classList.add("desaparecer");

  setTimeout(() => {
    elemento.classList.remove("desaparecer");
  }, 1000);
});
//Fin ocultar boton de creacion

//Funcion de busqueda
let searchInput, table, texto;

document.addEventListener("DOMContentLoaded", () => {
  searchInput = document.getElementById("buscar");
  searchInput.addEventListener("keyup", buscaTabla);
});

function buscaTabla() {
  table = document.getElementById("tabla").tBodies[0];
  texto = searchInput.value.toLowerCase();
  var r = 0;
  let row;
  while ((row = table.rows[r++])) {
    if (row.children[0].innerText.toLowerCase().indexOf(texto) !== -1) {
      row.style.display = null;
    } else row.style.display = "none";
  }
}
//FIN busqueda

//Variables globales para pintado
let $table = document.querySelector(".table");
let $template = document.getElementById("crud-template").content;
let $fragment = document.createDocumentFragment();
// let current_page = 0;
//FIN Variables globales para pintado

//Función ACTIVAR
function activarEntidad(url, index) {
  obtenerJson(url + index)
    .then((response) => {
      if (response.status == 200) {
        pintarCambioEstado(index, false);
        modalConfirmacionCambioEstado("Activado", index);
      } else {
        return Promise.reject(response);
      }
    })
    .catch((badResponse) => {
      modalError(badResponse.message);
    });
}
//Fin ACTIVAR

//Función DESACTIVAR
function desactivarEntidad(url, index) {
  obtenerJson(url + index)
    .then((response) => {
      if (response.status == 200) {
        pintarCambioEstado(index, true);
        modalConfirmacionCambioEstado("Desactivado", index);
      } else {
        return Promise.reject(response);
      }
    })
    .catch((badResponse) => {
      modalError(badResponse.message);
    });
}
//Fin DESACTIVAR

//prueba edicion
export function editarConForm(boton, urlEditar) {
  const id = boton.dataset.id;
  modalFormulario(obtenerEditables(id), urlEditar, "Modificar", id);
}

export function crearConForm(urlCrear) {
  modalFormulario(obtenerEditables(), urlCrear, "Crear");
}

function obtenerEditables(id = undefined) {
  let nodoHijos = document.querySelector("tr").children;
  let textoHTML = "";
  for (const hijo of nodoHijos) {
    if (hijo.classList.contains("editable")) {
      let forLabel = hijo.dataset.label;
      let type = hijo.dataset.type;
      let valorActual = "";
      if (id) {
        let propiedad = forLabel.toLowerCase();
        valorActual = document.querySelector(`#${propiedad}_${id}`).textContent;
      }
      textoHTML += `<label class="label-input" for="${forLabel}">${forLabel}:</label><input id="${forLabel}" class="swal2-input" type="${type}" value="${valorActual}"><br>`;
    }
  }
  return textoHTML;
}

function modalFormulario(textoHTML, url, accion, id = undefined) {
  Swal.fire({
    title: accion,
    html: textoHTML,
    allowEnterKey: true,
    showCancelButton: true,
    cancelButtonText: "Cancelar ❌",
    confirmButtonText: "Guardar 💾",
    preConfirm: async (nombre) => {
      let responseBackEnd;
      nombre = Swal.getPopup().querySelector(".swal2-input").value;
      options.body = JSON.stringify({ nombre });
      if (accion.toLowerCase() == "modificar") {
        options.method = "PUT";
        responseBackEnd = await modificarEntidad(url, id, options);
      } else {
        options.method = "POST";
        responseBackEnd = await crearEntidad(url, options);
      }
      if (responseBackEnd) Swal.showValidationMessage(responseBackEnd);
    },
  }).then((result) => {
    if (!result.isConfirmed) {
      modalCancelacion();
    }
  });
}

function setNumPaginaSesionStorage(pagina) {
  sessionStorage.setItem("current_page", Number(pagina));
}

function getNumPaginaSesionStorage() {
  if (sessionStorage.getItem("current_page"))
    return Number(sessionStorage.getItem("current_page"));
}

function obtenerNombrePagina(){
  let cabeceraMeta = document.head.children;
  for (const elemento of cabeceraMeta) {
    if(elemento.localName == "title"){
      return elemento.text
    }
  }
}

function esMismaSesion(){
  if(sessionStorage.getItem("pagina_actual")){
    let paginaPrev = sessionStorage.getItem("pagina_actual")
    let paginaActual = obtenerNombrePagina();
    return (paginaActual == paginaPrev)
  }
  return false;
}

export function setearAtributosSesion(){
  if(!esMismaSesion()){
    let pagina = obtenerNombrePagina();
    sessionStorage.setItem("pagina_actual", pagina);
    sessionStorage.setItem("current_page", Number(0));
    return 0;
  } else{
    return getNumPaginaSesionStorage();
  }
}

export function esUnNumero(numero) {
  if ((numero) && !isNaN(numero)) {
    return true;
  } else {
    return false;
  }
}