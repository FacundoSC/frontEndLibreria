import { options, urlEditorial } from "./constantes.js";
import * as utilidades from './utilidades.js';

main();

function main() {
  document.addEventListener("DOMContentLoaded", utilidades.obtenerEntidadPaginada(urlEditorial, "editorial"));

  //funciones de click de botones
  document.addEventListener("click", async (e) => {
    //Inicio CREAR
    if (e.target.matches(".crear")) {
      Swal.fire({
        title: 'Ingrese nombre de la editorial:',
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
          utilidades.crearEntidad(urlEditorial, options);
        } else {
          utilidades.modalCancelacion()
        }
      })
    } //fin CREAR

    //Inicio EDITAR
    if (e.target.matches(".editar")) {
       utilidades.editar(e.target, urlEditorial)
    }
    //FIN EDITAR

    //Inicio cambio de estado
    if (e.target.matches(".botonEstado")) {
      utilidades.cambiarEstado(urlEditorial, e.target.dataset.id)
    }
    //FIN cambio de estado

    //Inicio VER
    if (e.target.matches(".ver")) {
      let id = e.target.dataset.id
      let nombre = e.target.dataset.nombre
      let textoHTML = ''

      if (document.getElementById("libros_" + id).firstChild.localName == "p") {
        textoHTML = `<p><b>Actualmente no posee libros asociados</b></p>`
      } else {
        let cantidadDeLibros = document.getElementById("libros_" + id).firstChild.length
        let listado = document.getElementById("libros_" + id).firstChild.children

        switch (cantidadDeLibros) {
          case 1:
            textoHTML = `<p><b>Posee solo un libro asociado:</b></p><p>${listado[0].value}, <b>Autor:</b> ${listado[0].dataset.autor}</p>`;
            break;
          case 2:
            textoHTML = `<p><b>Posee dos libros asociados:</b></p><p>${listado[0].value}, <b>Autor:</b> ${listado[0].dataset.autor}</p><p>${listado[1].value}, <b>Autor:</b> ${listado[1].dataset.autor}</p>`;
            break;
          case 3:
            textoHTML = `<p><b>Posee tres libros asociados:</b></p><p>${listado[0].value}, <b>Autor:</b> ${listado[0].dataset.autor}</p><p>${listado[1].value}, <b>Autor:</b> ${listado[1].dataset.autor}</p><p>${listado[2].value}, <b>Autor:</b> ${listado[2].dataset.autor}</p>`
            break;
          default:
            let librosSeleccionados = []; //variable aux para guardar los indices a mostrar
            while (librosSeleccionados.length < 3) {
              let numeroElegido = Math.floor(Math.random() * (cantidadDeLibros - 0));
              if (!librosSeleccionados.includes(numeroElegido)) {
                librosSeleccionados.push(numeroElegido)
              }
            }
            //recupera de la variable aux los libros
            let libroUno = librosSeleccionados[0]
            let libroDos = librosSeleccionados[1]
            let libroTres = librosSeleccionados[2]
            //fin recupero de nombres 

            textoHTML = `<p><b>Posee ${cantidadDeLibros} libros asociados, algunos de ellos son:</b></p><p>${listado[libroUno].value}, <b>Autor:</b> ${listado[libroUno].dataset.autor}</p><p>${listado[libroDos].value}, <b>Autor:</b> ${listado[libroDos].dataset.autor}</p><p>${listado[libroTres].value}, <b>Autor:</b> ${listado[libroTres].dataset.autor}</p>`;
        }
      }

      utilidades.modalInformativo("Editorial", nombre, textoHTML)
    }
    //Fin VER

    if (event.target.matches("#btn_next")) {
      utilidades.avanzarPagina(urlEditorial, "editorial");
    }

    if (event.target.matches("#btn_prev")) {
      utilidades.retrocederPagina(urlEditorial, "editorial");
    }
  });
  //fin funciones
};
