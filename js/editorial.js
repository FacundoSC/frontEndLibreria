import { options, urlEditorial } from "./constantes.js";
import * as utilidades from './utilidades.js';

let current_page = 0;
let $table = document.querySelector(".table");
//Fin variables globales

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

    //Fin EDITAR
    // if (e.target.matches(".editar")) {
    //   const id = e.target.dataset.id;
    //   const nombreViejo = document.getElementById("nombre_" + id).textContent;
    //   let nombre = nombreViejo;

    //   Swal.fire({
    //     title: 'Modificar nombre:',
    //     input: 'text',
    //     inputValue: nombreViejo,
    //     inputAttributes: {
    //       placeholder: "Indique nuevo nombre",
    //       autocapitalize: 'off'
    //     },
    //     allowEnterKey: true,
    //     showCancelButton: true,
    //     cancelButtonText: 'Cancelar ❌',
    //     confirmButtonText: 'Guardar 💾',
    //     customClass: {
    //       validationMessage: 'my-validation-message'
    //     },
    //     preConfirm: (value) => {
    //       if (!value) {
    //         Swal.showValidationMessage(
    //           '<i class="fa fa-info-circle"></i>El nombre es requerido.'
    //         )
    //       }
    //     }
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       nombre = result.value
    //       if (nombreViejo != nombre) {
    //         options.method = 'PUT';
    //         options.body = JSON.stringify({ nombre });
    //         utilidades.modificarEntidad(urlEditorial, id, options)
    //       } else {
    //         Swal.fire({
    //           icon: 'warning',
    //           title: 'ERROR:',
    //           html: `<p class="nombreAutor" style="font-size: 1.5rem;">No ha realizado modificaciones al nombre.</p>`
    //         })
    //       }
    //     } else {
    //       utilidades.modalCancelacion();
    //     }
    //   })
    // };
    //Fin EDITAR

    //PRUEBA EDITAR
    if (e.target.matches(".editar")) {
      const id = e.target.dataset.id;
      const nombreViejo = document.getElementById("nombre_" + id).textContent;
      let nombre = nombreViejo;
      let textoHTML = '';

      let nodoHijos = document.getElementById("nombre_" + id).parentElement.children
      for (const hijo of nodoHijos) {
        if (hijo.classList.contains("editable")) {
          console.log(hijo)
          let id = hijo.id;
          let datoCargar = id.split("_")[0];
          let type = hijo.dataset.type
          let valorActual = hijo.textContent;
          textoHTML += `<label for="${id}">${datoCargar}:</label><input id="${id}" type="${type}" value="${valorActual}"><br>`
        }
      }

      Swal.fire({
        title: 'Modificar:',
        html: textoHTML,
        allowEnterKey: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar ❌',
        confirmButtonText: 'Guardar 💾',
      });
    }


      // Swal.fire({
      //   title: 'Modificar:',
      //   html: textoHTML,
      //   allowEnterKey: true,
      //   showCancelButton: true,
      //   cancelButtonText: 'Cancelar ❌',
      //   confirmButtonText: 'Guardar 💾',
      //   customClass: {
      //     validationMessage: 'my-validation-message'
      //   },
      //   preConfirm: (value) => {
      //     if (!value) {
      //       Swal.showValidationMessage(
      //         '<i class="fa fa-info-circle"></i>El nombre es requerido.'
      //       )
      //     }
      //   }
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     nombre = result.value
      //     if (nombreViejo != nombre) {
      //       options.method = 'PUT';
      //       options.body = JSON.stringify({ nombre });
      //       utilidades.modificarEntidad(urlEditorial, id, options)
      //     } else {
      //       Swal.fire({
      //         icon: 'warning',
      //         title: 'ERROR:',
      //         html: `<p class="nombreAutor" style="font-size: 1.5rem;">No ha realizado modificaciones al nombre.</p>`
      //       })
      //     }
      //   } else {
      //     utilidades.modalCancelacion();
      //   }
      // })
    //FIN PRUEBA EDITAR

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

      if (document.getElementById("asociados_" + id).firstChild.localName == "p") {
        textoHTML = `<p><b>Actualmente no posee libros asociados</b></p>`
      } else {
        let cantidadDeLibros = document.getElementById("asociados_" + id).firstChild.length
        let listado = document.getElementById("asociados_" + id).firstChild.children

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

    if (e.target.matches("#btn_next")) {
      current_page++;
      $table.querySelector("tbody").innerHTML = "";
      utilidades.obtenerEntidadPaginada(urlEditorial, "editorial", current_page);
    }

    if (e.target.matches("#btn_prev")) {
      current_page--;
      $table.querySelector("tbody").innerHTML = "";
      utilidades.obtenerEntidadPaginada(urlEditorial, "editorial", current_page);
    }
  });
  //fin funciones
};
