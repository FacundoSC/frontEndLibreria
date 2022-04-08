import { obtenerJson } from "./asincronico.js";
import {urlDesactivar, urlActivar } from "./constantes.js";
import * as modal from "./modales.js";


//Modificaciones DOM
export function obtenerEntidadPaginada(url, tipo) {
  let current_page = setearAtributosSesion()
 
  modal.modalCargaDatos();
  obtenerJson(url + `paged?page=${current_page}&size=10`).then((response) => {
    modal.modalMostrarResultado(response.body.content);
    seteoPaginas(response);
    pintarResultado(response.body.content, tipo);
  });
}

function pintarCambioEstado(index, estadoAnterior) {
  let btnEstado = document.querySelector("#estado_" + index);
  let btnEditar = document.querySelector("#editar_" + index);
  let listadoPropiedades = propiedadesAPintar();

  if (!estadoAnterior) {
    btnEstado.classList.remove("btn-danger");
    btnEstado.classList.add("btn-success");
    btnEstado.dataset.alta = "true";
    btnEditar.removeAttribute("disabled");
    listadoPropiedades.forEach((propiedad) => {
      document.getElementById(`${propiedad}_${index}`).classList.remove("tachado");
    });
    document.getElementById("alta_" + index).innerHTML = "Activado";
  } else {
    btnEstado.classList.remove("btn-success");
    btnEstado.classList.add("btn-danger");
    btnEstado.dataset.alta = "false";
    btnEditar.setAttribute("disabled", "");
    listadoPropiedades.forEach((propiedad) => {
      document.getElementById(`${propiedad}_${index}`).classList.add("tachado");
    });
    document.getElementById("alta_" + index).innerHTML = "Desactivado";
  }
}

function seteoPaginas(response) {
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
        : ($template.querySelector(`.${propiedad}`).textContent = "Desactivado");
    } else {
      $template.querySelector(`.${propiedad}`).textContent = entidad[propiedad];
    }
    $template.querySelector(`.${propiedad}`).id = `${propiedad}_${entidad.id}`;
    $template.querySelector(`.${propiedad}`).dataset[propiedad] = entidad[propiedad];
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

function pintarResultado(response, tipo) {
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

function modificarInfo(response, id) {
  let nombreNuevo = response.nombre;
  document.getElementById("nombre_" + id).innerHTML = nombreNuevo;
  document.getElementById("estado_" + id).dataset.nombre = nombreNuevo;
  document.getElementById("ver_" + id).dataset.nombre = nombreNuevo;
}

export function cambiarEstado(url, id) {
  modal.modalPedirConfirmacion().then((result) => {
    if (result.isConfirmed) {
      let estado = document.querySelector("#estado_" + id).dataset.alta;
      if (estado == "true") {
        desactivarEntidad(url + urlDesactivar, id);
      } else {
        activarEntidad(url + urlActivar, id);
      }
    } else if (result.isDenied) {
      modal.modalCancelacion();
    }
  });
}

export async function crearEntidad(url, options) {
  return await obtenerJson(url, options)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        modal.modalExito();
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
        modal.modalExito();
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
        modal.modalConfirmacionCambioEstado("Activado", index);
      } else {
        return Promise.reject(response);
      }
    })
    .catch((badResponse) => {
      modal.modalError(badResponse.message);
    });
}
//Fin ACTIVAR

//Función DESACTIVAR
function desactivarEntidad(url, index) {
  obtenerJson(url + index)
    .then((response) => {
      if (response.status == 200) {
        pintarCambioEstado(index, true);
        modal.modalConfirmacionCambioEstado("Desactivado", index);
      } else {
        return Promise.reject(response);
      }
    })
    .catch((badResponse) => {
      modal.modalError(badResponse.message);
    });
}
//Fin DESACTIVAR

//prueba edicion
export function editarConForm(boton, urlEditar) {
  const id = boton.dataset.id;
  modal.modalFormulario(obtenerEditables(id), urlEditar, "Modificar", id);
}

export function crearConForm(urlCrear) {
  modal.modalFormulario(obtenerCreacion(), urlCrear, "Crear");
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

function obtenerCreacion() {
  let nodoHijos = document.querySelector("tr").children;
  let textoHTML = "";
  for (const hijo of nodoHijos) {
    if (hijo.classList.contains("creacion")) {
      let forLabel = hijo.dataset.label;
      let type = hijo.dataset.type;
      textoHTML += `<label class="label-input" for="${forLabel}">${forLabel}:</label><input id="${forLabel}" class="swal2-input" type="${type}" value=""><br>`;
    }
  }
  return textoHTML;
}

export function objetoAPersistir(){
  let modal = document.getElementById("swal2-html-container").children;
  let llave, valor;
  let objeto = {};
  for (const hijo of modal) {
      if(hijo.localName == "input"){
        llave = hijo.id.toLocaleLowerCase();
        valor = hijo.value;
        let par = {[llave]: valor};
        Object.assign(objeto, par);
      }
  }
  return objeto;
}

export function validarObjeto(objeto, entidad){
  if(entidad.toLowerCase() == "cliente"){
    return validarCliente(objeto);
  } 
}

function validarCliente(objeto){
  let documento = objeto.documento;
  if((documento.length>=6 && documento.length <=8) && esUnNumero(documento)){
    return;
  } return "El documento no cumple con el formato";
}

//esta logica deberia borrarse 
export function completarCliente(objeto){
  if(!objeto.username){
    let par = {["username"]: "cliente@clientejs.com"};
    Object.assign(objeto, par);
  }
  if(!objeto.password){
    let par = {["password"]: "00000000"};
    Object.assign(objeto, par);
  }
  let par = {["roleId"]: 2};
  Object.assign(objeto, par);

  return objeto;
}
//esta logica deberia borrarse 

function setNumPaginaSesionStorage(pagina) {
  sessionStorage.setItem("current_page", Number(pagina));
}

function getNumPaginaSesionStorage() {
  if (sessionStorage.getItem("current_page"))
    return Number(sessionStorage.getItem("current_page"));
}

export function obtenerNombrePagina(){
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

function setearAtributosSesion(){
  if(!esMismaSesion()){
    let pagina = obtenerNombrePagina();
    sessionStorage.setItem("pagina_actual", pagina);
    sessionStorage.setItem("current_page", Number(0));
    return 0;
  } else{
    return getNumPaginaSesionStorage();
  }
}

function esUnNumero(numero) {
  if ((numero) && !isNaN(numero)) {
    return true;
  } else {
    return false;
  }
}