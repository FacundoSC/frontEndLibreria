import { options, urlAutor} from "./constantes.js";
import * as utilidades from './utilidades.js';

let current_page = 0;
let $table = document.querySelector(".table");

main();

function main() {
    document.addEventListener("DOMContentLoaded", utilidades.obtenerEntidadPaginada(urlAutor, "autor"));

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
                    utilidades.crearEntidad(urlAutor, options);
                } else {
                    utilidades.modalCancelacion();
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
                    utilidades.modificarEntidad(urlAutor, id, options)
                } else {
                    utilidades.modalCancelacion();
                }
            })
        };

        if (event.target.matches(".botonEstado")) {
            utilidades.cambiarEstado(urlAutor, event.target.dataset.id)
        }

        if (event.target.matches(".ver")) {
            let nombre = event.target.dataset.nombre
            utilidades.modalInformativo("Autor", nombre)
        }

        if (event.target.matches("#btn_next")) {
              current_page++;
              $table.querySelector("tbody").innerHTML = "";
              utilidades.obtenerEntidadPaginada(urlAutor, "autor", current_page);
          }
        
          if (event.target.matches("#btn_prev")) {
              current_page--;
              $table.querySelector("tbody").innerHTML = "";
              utilidades.obtenerEntidadPaginada(urlAutor, "autor", current_page);
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
