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
            utilidades.editar(event.target, urlAutor)
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
