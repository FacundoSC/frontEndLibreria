import { obtenerJson } from "./asincronico.js";
import {
    options,
    urlActivar,
    urlAutor,
    urlEditorial,
    urlDesactivar,
    urlLibro,
} from "./constantes.js";

const d = document,
    $table = d.querySelector(".table"),
    $template = d.getElementById("crud-templateLibro").content,
    $fragment = d.createDocumentFragment();
var current_page = 0;
let totalPages;

main();

function main() {
    d.addEventListener("DOMContentLoaded", obtenerLibrosPaginados());

    d.addEventListener("click", async (e) => {
        if (e.target.matches(".crear")) {
            let selectorAutor = document.createElement("select");
            let selectorEditorial = document.createElement("select");
            selectorAutor.className = "swal2-input";
            selectorEditorial.className = "swal2-input";
            let listadoAutores = await obtenerAutores();
            let listadoEditoriales = await obtenerEditoriales();

            listadoAutores.body.forEach((autor) => {
                let elemento = document.createElement("option");
                elemento.textContent = autor.nombre;
                elemento.value = autor.id;
                elemento.className = "swal2-input";
                elemento.id = "autorId";
                selectorAutor.appendChild(elemento);
            });
            let selectAutor = selectorAutor.outerHTML;
            listadoEditoriales.body.forEach((editorial) => {
                let elemento = document.createElement("option");
                elemento.textContent = editorial.nombre;
                elemento.value = editorial.id;
                elemento.className = "swal2-input";
                elemento.id = "editorialId";
                selectorEditorial.appendChild(elemento);
            });
            let selectEditorial = selectorEditorial.outerHTML;

            Swal.fire({
                title: "Crear Libro:",
                html: `
                    <p>Titulo: <input id="titulo"  value= "" type="text" class="swal2-input" placeholder="Titulo Libro" required ></p>
                    <p>A??o: <input id="anio"  value= "" type="number"  class="swal2-input" placeholder="A??o publicacion" required ></p>
                    <p>ISBN: <input  id="isbn"  value= "" type="text"  class="swal2-input" placeholder="Isbn"  maxlength ="13" required></p>
                    <p>Ejemplares: <input  id="ejemplares" value= "" type="number"  class="swal2-input" placeholder="Ejemplares Totales" required></p>
                    <p>Prestados: <input  id="ejemplaresPrestados" value= "" type="text"  class="swal2-input" placeholder="Ejemplares Prestados" required></p>
                    <p>En Stock: <input  id="ejemplaresRestantes" value= "" type="text"  class="swal2-input" placeholder="Ejemplares Restantes" required></p>
                    <p>Autor: ${selectAutor}</p>
                    <p>Editorial: ${selectEditorial}</p>`,
                showCancelButton: true,
                cancelButtonText: "Cancelar ???",
                confirmButtonText: "Guardar ????",
                customClass: {
                    validationMessage: "my-validation-message",
                },
                preConfirm: async () => {
                    // let ejemplaresRestantes = parseInt(obtenerValorSwalPopUp("ejemplares")) - parseInt(obtenerValorSwalPopUp("ejemplaresPrestados"));
                    let libroModificar = {
                        titulo: obtenerValorSwalPopUp("titulo"),
                        anio: obtenerValorSwalPopUp("anio"),
                        isbn: obtenerValorSwalPopUp("isbn"),
                        ejemplares: parseInt(obtenerValorSwalPopUp("ejemplares")),
                        ejemplaresPrestados: parseInt(obtenerValorSwalPopUp("ejemplaresPrestados")),
                        autorId: obtenerValorSwalPopUp("autorId"),
                        editorialId: obtenerValorSwalPopUp("editorialId"),
                    };
                    libroModificar.ejemplaresRestantes = libroModificar.ejemplares - libroModificar.ejemplaresPrestados;

                    options.method = "POST";
                    options.body = JSON.stringify(libroModificar);
                    let responseBackEnd = await crearLibro(options);
                    if (!isNaN(libroModificar.isbn) && !(JSON.stringify(libroModificar) === '{}')) {
                        if (responseBackEnd) {
                            Swal.showValidationMessage(responseBackEnd);
                        }
                    } else {
                        if (isNaN(libroModificar.isbn)) {
                            Swal.showValidationMessage(`El isbn debe ser numerico`);
                        }
                    }
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: "Se ha creado el libro",
                    });
                } else {
                    Swal.fire({
                        text: "Se ha cancelado la operacion",
                    });
                }
            });

            if (e.target.matches("#btn_next")) {
                if (objJson.pageable.pageNumber < objJson.totalPages - 1) {
                    current_page++;
                    $table.querySelector("tbody").innerHTML = "";
                    obtenerLibrosPaginados();
                }
            }

            if (e.target.matches("#btn_prev")) {
                if (objJson.pageable.pageNumber > 0) {
                    current_page--;
                    $table.querySelector("tbody").innerHTML = "";
                    obtenerLibrosPaginados();
                }
            }
        }
        if (e.target.matches(".editar")) {
            const id = e.target.dataset.id;
            let libro = d.querySelector("#ver_" + id);
            let selectorAutor = document.createElement("select");
            let selectorEditorial = document.createElement("select");
            selectorAutor.className = "swal2-input";
            selectorEditorial.className = "swal2-input";
            let listadoAutores = await obtenerAutores();
            let listadoEditoriales = await obtenerEditoriales();

            listadoAutores.body.forEach((autor) => {
                let elemento = document.createElement("option");
                elemento.textContent = autor.nombre;
                elemento.value = autor.id;
                elemento.className = "swal2-input";
                elemento.id = "autorId";
                selectorAutor.appendChild(elemento);
            });
            let selectAutor = selectorAutor.outerHTML;

            listadoEditoriales.body.forEach((editorial) => {
                let elemento = document.createElement("option");
                elemento.textContent = editorial.nombre;
                elemento.value = editorial.id;
                elemento.className = "swal2-input";
                elemento.id = "editorialId";
                selectorEditorial.appendChild(elemento);
            });
            let selectEditorial = selectorEditorial.outerHTML;

            Swal.fire({
                title: "Modificar Libro:",
                html: `
        <p>Titulo: <input id="titulo"  value= "${libro.dataset.titulo}" type="text" class="swal2-input" placeholder="Titulo Libro" minlength="2" maxlength="62" required></p>
        <p>A??o: <input id="anio"  value= "${libro.dataset.anio}" type="number"  class="swal2-input" placeholder="A??o publicacion" min="868" max="3000" required></p>
        <p>ISBN: <input  id="isbn"  value= "${libro.dataset.isbn}" type="text"  class="swal2-input" placeholder="Isbn" maxlength="13" required ></p>
        <p>Ejemplares: <input  id="ejemplares" value= "${libro.dataset.ejemplares}" type="number"  class="swal2-input" placeholder="A??o publicacion" required></p>
         <input  id="ejemplaresPrestados" value= "${libro.dataset.ejemplaresPrestados}" type="hidden"  >
         <input  id="ejemplaresRestantes" value= "${libro.dataset.ejemplaresRestantes}" type="hidden"  >
         <p>Autor: ${selectAutor}</p>
         <p>Editorial: ${selectEditorial}</p>
              `,
                allowEnterKey: true,
                showCancelButton: true,
                cancelButtonText: "Cancelar ???",
                confirmButtonText: "Guardar ????",
                customClass: {
                    validationMessage: "my-validation-message",
                },
                preConfirm: async () => {
                    let libroModificar = {
                        titulo: obtenerValorSwalPopUp("titulo"),
                        anio: obtenerValorSwalPopUp("anio"),
                        isbn: obtenerValorSwalPopUp("isbn"),
                        ejemplares: obtenerValorSwalPopUp("ejemplares"),
                        ejemplaresPrestados: obtenerValorSwalPopUp("ejemplaresPrestados"),
                        autorId: obtenerValorSwalPopUp("autorId"),
                        editorialId: obtenerValorSwalPopUp("editorialId"),
                    };
                    libroModificar.ejemplaresRestantes = libroModificar.ejemplares - libroModificar.ejemplaresPrestados;

                    options.method = "PUT";
                    options.body = JSON.stringify(libroModificar);
                    let responseBackEnd = await modificarLibro(id, options);
                    if (responseBackEnd) Swal.showValidationMessage(responseBackEnd);
                    if (!isNaN(libroModificar.isbn) && !(JSON.stringify(libroModificar) === '{}')) {
                        if (responseBackEnd) {
                            Swal.showValidationMessage(responseBackEnd);
                        }
                    } else {
                        if (isNaN(libroModificar.isbn)) {
                            Swal.showValidationMessage(`El isbn debe ser numerico`);
                        }
                    }
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: "Se ha modificado libro",
                    });
                } else {
                    Swal.fire({
                        text: "Se ha cancelado la operacion",
                    });
                }
            });
        }
        if (e.target.matches(".botonEstado")) {
            Swal.fire({
                title: "??Deseas cambiar el estado del libro?",
                showDenyButton: true,
                icon: "question",
                confirmButtonText: "SI ????",
                denyButtonText: `NO ????`,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    let btn = e.target;
                    let estadoFinal;
                    if (btn.dataset.estado == "true") {
                        estadoFinal = "false";
                        desactivarLibro(btn.dataset.id);
                    } else {
                        estadoFinal = "true";
                        activarLibro(btn.dataset.id);
                    }
                    Swal.fire(
                        `El estado del Libro <b>${btn.dataset.titulo}</b> ha sido modificado a <b>${estadoFinal}</b>.`,
                        "",
                        "success"
                    );
                } else if (result.isDenied) {
                    Swal.fire("No se han realizado cambios.", "", "info");
                }
            });
        }
        if (e.target.matches(".ver")) {
            Swal.fire({
                icon: "info",
                title: "Datos Libro:",
                html: `<p class="swal2"     >
        <b>Titulo:</b> ${e.target.dataset.titulo}
        <br>
        <b>Isbn:</b> ${e.target.dataset.isbn}
        <br>
        <b>A??o:</b> ${e.target.dataset.anio}
        <br>
        <b>Total Ejemplares:</b> ${e.target.dataset.ejemplares}
        <br>
        <b>Prestados:</b> ${e.target.dataset.ejemplaresPrestados}
        <br>
        <b>Restantes:</b> ${e.target.dataset.ejemplaresRestantes}
        <br>
        <b>Autor:</b>${e.target.dataset.autorNombre}
        <br>
        <b>Editorial:</b> ${e.target.dataset.editorialNombre}
        </p>`,
            });
        }
        if (e.target.matches("#btn_next")) {
            current_page++;
            $table.querySelector("tbody").innerHTML = "";
            obtenerLibrosPaginados();
        }
        if (e.target.matches("#btn_prev")) {
            current_page--;
            $table.querySelector("tbody").innerHTML = "";
            obtenerLibrosPaginados();
        }
    });
}
async function obtenerLibrosPaginados() {
    
    let $table = document.querySelector(".table");
    let $template = document.getElementById("crud-templateLibro").content;
    let $fragment = document.createDocumentFragment();

  Swal.fire({
    title: "CARGANDO DATOS",
    html: "<h3>Aguarde por favor</h3><p><img src='../img/nyan-cat.gif'><p>",
    width: 500,
    backdrop: `rgba(0,0,40,0.4)`,
    showConfirmButton: false,
  });

  obtenerJson(urlLibro + `paged?page=${current_page}&size=10`).then(
    (response) => {
      let msj;
      console.log(response.body.content)
      if (response.body.content) {
        msj = "<h3 style='margin: 0; padding: 3rem'>Petici??n exitosa! ????</h3>";
      } else {
        msj = "<h3 style='margin: 0; padding: 3rem'>Algo ha fallado ????</h3>";
      }
      Swal.fire({
        html: msj,
        backdrop: `rgba(0,0,40,0.4)`,
        showConfirmButton: false,
        timer:1500
    });

      totalPages = response.body.totalPages;
      current_page = response.body.pageable.pageNumber;

            
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
      response.body.content.forEach((libro) => {
        $template.querySelector(".titulo").textContent = libro.titulo;
        $template.querySelector(".titulo").id = `titulo_${libro.id}`;
        $template.querySelector(".isbn").textContent = libro.isbn;
        $template.querySelector(".isbn").id = `isbn_${libro.id}`;
        $template.querySelector(".ejemplaresRestantes").textContent =
          libro.ejemplaresRestantes;
        $template.querySelector(
          ".ejemplaresRestantes"
        ).id = `ejemplaresRestantes_${libro.id}`;
        $template.querySelector(".estado").textContent = libro.alta;
        $template.querySelector(".estado").id = `estado_${libro.id}`;

                $template.querySelector(".editar").dataset.id = `${libro.id}`;
                $template.querySelector(".editar").id = `editar_${libro.id}`;
                $template.querySelector(".ver").id = `ver_${libro.id}`;
                $template.querySelector(".ver").dataset.titulo = libro.titulo;
                $template.querySelector(".ver").dataset.isbn = libro.isbn;
                $template.querySelector(".ver").dataset.anio = libro.anio;
                $template.querySelector(".ver").dataset.ejemplares = libro.ejemplares;
                $template.querySelector(".ver").dataset.ejemplaresPrestados =
                    libro.ejemplaresPrestados;
                $template.querySelector(".ver").dataset.ejemplaresRestantes =
                    libro.ejemplaresRestantes;
                $template.querySelector(".ver").dataset.autorNombre = libro.autorNombre;
                $template.querySelector(".ver").dataset.editorialNombre =
                    libro.editorialNombre;

                $template.querySelector(".botonEstado").id = `botonEstado_${libro.id}`;
                $template.querySelector(".botonEstado").classList.remove("btn-success");
                $template.querySelector(".botonEstado").classList.remove("btn-danger");
                $template.querySelector(".botonEstado").dataset.titulo = libro.titulo;
                $template.querySelector(".titulo").classList.remove("tachado");
                $template.querySelector(".estado").classList.remove("tachado");
                $template.querySelector(".editar").removeAttribute("disabled");
                $template.querySelector(".botonEstado").dataset.id = libro.id;
                $template.querySelector(".botonEstado").dataset.estado = libro.alta;
                if (libro.alta) {
                    $template.querySelector(".botonEstado").classList.add("btn-success");
                } else {
                    $template.querySelector(".botonEstado").classList.add("btn-danger");
                    $template.querySelector(".titulo").classList.add("tachado");
                    $template.querySelector(".estado").classList.add("tachado");
                    $template.querySelector(".editar").setAttribute("disabled", "");
                }
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });
            $table.querySelector("tbody").appendChild($fragment);
        }
    );
};
async function obtenerAutores() {
    return await obtenerJson(urlAutor);
}
async function obtenerEditoriales() {
    return await obtenerJson(urlEditorial);
}
async function crearLibro(options) {
  return await obtenerJson(urlLibro, options)
    .then((response) => {
      if (response.status >= 200 && response.status<300) {
        let id = response.body.id;
        let titulo = response.body.titulo;
        let alta = response.body.alta;
        let isbn = response.body.isbn;
        let anio = response.body.anio;
        let ejemplares = response.body.ejemplares;
        let ejemplaresRestantes = response.body.ejemplaresRestantes;
        let ejemplaresPrestados = response.body.ejemplaresPrestados;
        let autorNombre = response.body.autorNombre;
        let editorialNombre = response.body.editorialNombre;

                $template.querySelector(".titulo").textContent = titulo;
                $template.querySelector(".titulo").id = `titulo_` + id;
                $template.querySelector(".isbn").textContent = isbn;
                $template.querySelector(".isbn").id = `isbn_` + id;
                $template.querySelector(".ejemplaresRestantes").textContent =
                    ejemplaresRestantes;
                $template.querySelector(".ejemplaresRestantes").id =
                    `ejemplaresRestantes_` + id;
                $template.querySelector(".estado").textContent = alta;
                $template.querySelector(".estado").id = `estado_` + id;

                $template.querySelector(".editar").dataset.id = id;
                $template.querySelector(".editar").id = `editar_` + id;

                $template.querySelector(".ver").id = `ver_` + id;
                $template.querySelector(".ver").dataset.titulo = titulo;
                $template.querySelector(".ver").dataset.isbn = isbn;
                $template.querySelector(".ver").dataset.anio = anio;
                $template.querySelector(".ver").dataset.ejemplares = ejemplares;
                $template.querySelector(".ver").dataset.autorNombre = autorNombre;
                $template.querySelector(".ver").dataset.editorialNombre =
                    editorialNombre;
                $template.querySelector(".ver").dataset.ejemplaresPrestados =
                    ejemplaresPrestados;
                $template.querySelector(".ver").dataset.ejemplaresRestantes =
                    ejemplaresRestantes;

                $template.querySelector(".botonEstado").id = `botonEstado_` + id;
                $template.querySelector(".botonEstado").dataset.titulo = titulo;
                $template.querySelector(".botonEstado").dataset.id = id;
                $template.querySelector(".botonEstado").dataset.estado = alta;
                $template.querySelector(".botonEstado").classList.remove("btn-danger");
                $template.querySelector(".titulo").classList.remove("tachado");
                $template.querySelector(".estado").classList.remove("tachado");
                $template.querySelector(".botonEstado").classList.add("btn-success");

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
        $table.querySelector("tbody").appendChild($fragment);
      } else {
        return Promise.reject(response.body);
      }
    })
    .catch((badResponse) => {
      return badResponse.message;
    });
}
async function modificarLibro(id, options) {
  return await obtenerJson(urlLibro + id, options)
    .then((response) => {
      if (response.status >= 200 && response.status<300) {
        d.getElementById("titulo_" + id).innerHTML = response.body.titulo;
        d.getElementById("isbn_" + id).innerHTML = response.body.isbn;
        console.log(" response.ejemplaresRestantes",  response.body.ejemplaresRestantes);
        d.getElementById("ejemplaresRestantes_" + id).innerHTML = response.body.ejemplaresRestantes;
        let listadoBotones = d.getElementById(`editar_${id}`).parentElement;
        listadoBotones.children[1].dataset.titulo = response.body.titulo;
        listadoBotones.children[2].dataset.titulo = response.body.titulo;
        listadoBotones.children[2].dataset.anio = response.body.anio;
        listadoBotones.children[2].dataset.isbn = response.body.isbn;
        listadoBotones.children[2].dataset.ejemplares = response.body.ejemplares;
        listadoBotones.children[2].dataset.ejemplaresPrestados =
          response.body.ejemplaresPrestados;
        listadoBotones.children[2].dataset.ejemplaresRestantes =
          response.body.ejemplaresRestantes;
      } else {
        return Promise.reject(response.body);
      }
    })
    .catch((badResponse) => {
      console.log(badResponse);
      return badResponse.message;
    });
}
function activarLibro(index) {
    obtenerJson(urlLibro + urlActivar + index).then((response) => {
        {
            let btn = d.querySelector("#botonEstado_" + index);
            btn.classList.remove("btn-danger");
            btn.classList.add("btn-success");
            btn.dataset.estado = "true";
            btn.parentElement.children[0].removeAttribute("disabled");
            btn.parentNode.parentNode.children[0].classList.remove("tachado");
            btn.parentNode.parentNode.children[3].classList.remove("tachado");
            d.getElementById("estado_" + index).innerHTML = "true";
        }
    });
}
function desactivarLibro(index) {
    obtenerJson(urlLibro + urlDesactivar + index).then((response) => {
        {
            let btn = d.querySelector("#botonEstado_" + index);
            btn.classList.remove("btn-success");
            btn.classList.add("btn-danger");
            btn.dataset.estado = "false";
            btn.parentElement.children[0].setAttribute("disabled", "");
            btn.parentNode.parentNode.children[0].classList.add("tachado");
            btn.parentNode.parentNode.children[3].classList.add("tachado");
            d.getElementById("estado_" + index).innerHTML = "false";
        }
    });
}
function obtenerValorSwalPopUp(clase) {
    return Swal.getPopup().querySelector("#" + clase).value;
}