import { options, urlAutor, urlDesactivar, urlActivar } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

let autores;
let current_page = 0;
let totalPages
let $table = document.querySelector(".table");
let $template = document.getElementById("crud-template").content;
let $fragment = document.createDocumentFragment();

main();

function main() {

    document.addEventListener("DOMContentLoaded", obtenerAutoresPaginados());

    document.addEventListener("DOMContentLoaded", function () {
        obtenerJson(urlAutor).then(autoresArray => {
            autores = autoresArray;
        })
    });

    document.addEventListener("click", async (event) => {
        if (event.target.matches(".crear")) {
            Swal.fire({
                title: 'Ingrese nombre del autor:',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                cancelButtonText: 'Cancelar ❌',
                confirmButtonText: 'Guardar 💾',
                customClass: {
                    validationMessage: 'my-validation-message'
                },
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage(
                            '<i class="fa fa-info-circle"></i>El nombre es requerido.'
                        )
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    let nombre = result.value
                    options.method = 'POST';
                    options.body = JSON.stringify({ nombre });
                    crearAutor(urlAutor, options);
                    Swal.fire(`Se ha creado exitosamente el autor: <b>${nombre}</b>!`, '', 'success')
                } else {
                    Swal.fire('Se ha cancelado la operación', '', 'warning')
                }
            })
        }

        if (event.target.matches(".editar")) {
            const id = event.target.dataset.id;
            const nombreViejo = document.getElementById("nombre_" + id).textContent;
            let nombre = nombreViejo;

            Swal.fire({
                title: 'Modificar nombre:',
                input: 'text',
                inputValue: nombreViejo,
                inputAttributes: {
                    placeholder: "Indique nuevo nombre",
                    autocapitalize: 'off'
                },
                allowEnterKey: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar ❌',
                confirmButtonText: 'Guardar 💾',
                customClass: {
                    validationMessage: 'my-validation-message'
                },
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage(
                            '<i class="fa fa-info-circle"></i>El nombre es requerido.'
                        )
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    nombre = result.value
                    options.method = 'PUT';
                    options.body = JSON.stringify({ nombre });
                    modificarAutor(urlAutor, id, options);
                    Swal.fire(`Se ha modificado el nombre de <b>${nombreViejo}</b> a <b>${nombre}</b>!`, '', 'success')
                } else {
                    Swal.fire('Se ha cancelado la operación', '', 'warning')
                }
            })
        };

        if (event.target.matches(".botonEstado")) {
            Swal.fire({
                title: '¿Deseas cambiar el estado del autor?',
                showDenyButton: true,
                icon: 'question',
                confirmButtonText: 'SI 😎',
                denyButtonText: `NO 🙏`,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    let btn = event.target;
                    let estadoFinal;
                    if (btn.dataset.estado == 'true') {
                        estadoFinal = "false"
                        desactivarAutor(urlAutor + urlDesactivar, btn.dataset.id);
                    } else {
                        estadoFinal = "true"
                        activarAutor(urlAutor + urlActivar, btn.dataset.id);
                    }
                    Swal.fire(`El estado del autor <b>${btn.dataset.nombre}</b> ha sido modificado a <b>${estadoFinal}</b>.`, '', 'success')
                } else if (result.isDenied) {
                    Swal.fire('No se han realizado cambios.', '', 'info')
                }
            });
        }

        if (event.target.matches(".ver")) {
            Swal.fire({
                icon: 'info',
                title: 'Autor:',
                html: `<p class="nombreAutor">${event.target.dataset.nombre}</p>`
            })
        }

        if (event.target.matches("#btn_next")) {
            if (current_page < (totalPages - 1)) {
              current_page++;
              $table.querySelector("tbody").innerHTML = "";
              obtenerAutoresPaginados();
            }
          }
        
          if (event.target.matches("#btn_prev")) {
            if (current_page > 0) {
              current_page--;
              $table.querySelector("tbody").innerHTML = "";
              obtenerAutoresPaginados();
            }
          }
    });
};

function obtenerAutoresPaginados() {
  
    obtenerJson(urlAutor + `paged?page=${current_page}&size=10`).then(response =>{
        totalPages = response.totalPages;
        current_page = response.pageable.pageNumber

        document.querySelector("#pagActual").textContent = (current_page+1);
        document.querySelector("#pagTotales").textContent = totalPages;

        let btnPrevio = document.querySelector("#btn_prev");
        let btnSiguiente = document.querySelector("#btn_next");

        (current_page == 0) ? btnPrevio.setAttribute("disabled", '') : btnPrevio.removeAttribute("disabled");
        (totalPages == (current_page+1)) ? btnSiguiente.setAttribute("disabled", '') : btnSiguiente.removeAttribute("disabled");
        
        response.content.forEach(autor => {
            $template.querySelector(".nombre").textContent = autor.nombre;
            $template.querySelector(".nombre").id = `nombre_${autor.id}`;
            $template.querySelector(".estado").textContent = autor.alta;
            $template.querySelector(".estado").id = `estado_${autor.id}`;
            $template.querySelector(".editar").dataset.id = `${autor.id}`;
            $template.querySelector(".editar").id = `editar_${autor.id}`;
            $template.querySelector(".ver").dataset.nombre = autor.nombre;
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
        $table.querySelector("tbody").appendChild($fragment);
    })
}


function obtenerAutores(urlAutor) {

    let $table = document.querySelector(".table");
    let $template = document.getElementById("crud-template").content;
    let $fragment = document.createDocumentFragment();

    obtenerJson(urlAutor).then(autores => {
        autores.forEach(autor => {
            $template.querySelector(".nombre").textContent = autor.nombre;
            $template.querySelector(".nombre").id = `nombre_${autor.id}`;
            $template.querySelector(".estado").textContent = autor.alta;
            $template.querySelector(".estado").id = `estado_${autor.id}`;
            $template.querySelector(".editar").dataset.id = `${autor.id}`;
            $template.querySelector(".editar").id = `editar_${autor.id}`;
            $template.querySelector(".ver").dataset.nombre = autor.nombre;
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
        $table.querySelector("tbody").appendChild($fragment);
    });
}

function activarAutor(urlAutor, index) {
    obtenerJson(urlAutor + index).then(response => {
        {
            let btn = document.querySelector("#botonEstado_" + index)
            btn.classList.remove("btn-danger")
            btn.classList.add("btn-success")
            btn.dataset.estado = "true";
            btn.parentElement.children[0].removeAttribute("disabled")
            btn.parentNode.parentNode.children[0].classList.remove("tachado")
            btn.parentNode.parentNode.children[1].classList.remove("tachado")
            document.getElementById("estado_" + index).innerHTML = "true";
        }
    });
}

function desactivarAutor(urlAutor, index) {
    obtenerJson(urlAutor + index).then(response => {
        {
            let btn = document.querySelector("#botonEstado_" + index)
            btn.classList.remove("btn-success")
            btn.classList.add("btn-danger")
            btn.dataset.estado = "false";
            btn.parentElement.children[0].setAttribute("disabled", '')
            btn.parentNode.parentNode.children[0].classList.add("tachado")
            btn.parentNode.parentNode.children[1].classList.add("tachado")
            document.getElementById("estado_" + index).innerHTML = "false";
        }
    });
}

function crearAutor(urlAutor, options) {

    let $table = document.querySelector(".table");
    let $template = document.getElementById("crud-template").content;
    let $fragment = document.createDocumentFragment();

    obtenerJson(urlAutor, options).then(response => {
        let id = response.id
        let nombre = response.nombre
        let alta = response.alta

        $template.querySelector(".nombre").textContent = nombre;
        $template.querySelector(".nombre").id = `nombre_${id}`;
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
        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
        $table.querySelector("tbody").appendChild($fragment);

    }).catch(error => console.error(error));
}

function modificarAutor(urlAutor, id, options) {
    obtenerJson(urlAutor + id, options).then(response => {
        document.getElementById("nombre_" + id).innerHTML = response.nombre;
        let listadoBotones = d.getElementById(`editar_${id}`).parentElement;
        listadoBotones.children[1].dataset.nombre = response.nombre;
        listadoBotones.children[2].dataset.nombre = response.nombre;
    }).catch(error => console.error(error));
}
