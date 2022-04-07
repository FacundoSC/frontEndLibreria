import { options, urlEditorialLocal } from "./constantes.js";
import * as utilidades from './utilidades.js';

main();

function main() {
  document.addEventListener("DOMContentLoaded", utilidades.obtenerEntidadPaginada(urlEditorialLocal, "editorial"));

  //funciones de click de botones
  document.addEventListener("click", async (e) => {
    //Inicio CREAR
    if (e.target.matches(".crear")) {
      utilidades.crearConForm(urlEditorialLocal);
    } //fin CREAR

    //Inicio EDITAR
    if (e.target.matches(".editar")) {
       utilidades.editarConForm(e.target, urlEditorialLocal)
    }
    //FIN EDITAR

    //Inicio cambio de estado
    if (e.target.matches(".botonEstado")) {
      utilidades.cambiarEstado(urlEditorialLocal, e.target.dataset.id)
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

    if (e.target.matches("#btn_next")) {
      utilidades.avanzarPagina(urlEditorialLocal, "editorial");
    }

    if (e.target.matches("#btn_prev")) {
      utilidades.retrocederPagina(urlEditorialLocal, "editorial");
    }
  });
  //fin funciones
};