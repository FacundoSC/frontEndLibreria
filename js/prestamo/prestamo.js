import { obtenerJson } from "../asincronico.js";
import { urlDesactivarPrestamo, urlPrestamo } from "./PrestamoUris.js";
import { options, urlCliente, urlLibro } from "../constantes.js";

const d = document,
  $table = d.querySelector("#tablaPrestamos"),
  $template = d.getElementById("crud-template-prestamo").content,
  $fragment = d.createDocumentFragment();

let libros = [];
let clientes = [];
var current_page = 0;

main();

function main() {
  d.addEventListener("DOMContentLoaded", () => {
    pintarTablaPaginada();
    getSelectClientes();
    getSelectLibros();
  });

  d.addEventListener("click", async (e) => {
    let buttonPressed = e.target;
    let todayDate = getActualDate();

    if (buttonPressed.matches(".btn-cancelar-prestamo")) {
      Swal.fire(
        {
          title: "¿Deseas cancelar el prestamo?",
          showDenyButton: true,
          icon: "question",
          confirmButtonText: "Si, cancelar el prestamo",
          denyButtonText: `No, volver atrás`,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          preConfirm: async () => {
            let responseEntity = await cancelarPrestamo(
              buttonPressed.dataset.id
            );

            return responseEntity;
          },
        },
      ).then(async (result) => {
        if (result.isConfirmed) {
          let prestamoCancelado = await getPrestamoById(
            buttonPressed.dataset.id
          );

          if (result.value.status >= 200 && result.value.status < 300) {
            Swal.fire(
              `Se ha eliminado exitosamente el prestamo a nombre de: <b>${
                prestamoCancelado.cliente.nombre +
                " " +
                prestamoCancelado.cliente.apellido
              }</b>  </br> 
            Fecha de devolución: <b>${formatDate(
              getActualDate(),
              true
            )}</b> </br> 
            Libro devuelto:  "<b>${prestamoCancelado.libro.titulo}" </b>
            Editorial:  <b>${prestamoCancelado.libro.editorialNombre} </b>`,
              "",
              "success"
            );

            d.querySelector("#row_" + buttonPressed.dataset.id).remove();
          } else {
            Swal.fire(
              `Status: <b>${result.value.body.status}</b> </br> 
            Message: <b>"${result.value.body.message}"</b> `,
              "",
              "error"
            );
          }
        } else Swal.fire("No se han realizado cambios.", "", "info");
      });
    }

    if (buttonPressed.matches(".crear")) {
      Swal.fire({
        title: "Crear nuevo prestamo ",
        showDenyButton: true,
        confirmButtonText: "Crear prestamo",
        denyButtonText: `Volver atrás`,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        html:
          `Elige un cliente ${
            d.querySelector("#divClientes").innerHTML
          } </br>` +
          `Elige un libro ${d.querySelector("#divLibros").innerHTML} </br>` +
          `Fecha de inicio <input  min="${todayDate}" type=date id="swal-input3" class="swal2-input" required> </br>` +
          `Fecha de fin <input  min="${todayDate}" type=date id="swal-input4" class="swal2-input" required> </br>`,

        preConfirm: async () => {
          const libro = Swal.getPopup().querySelector("#selectLibros").value;
          const cliente =
            Swal.getPopup().querySelector("#selectClientes").value;
          const fechaPrestamo =
            Swal.getPopup().querySelector("#swal-input3").value;
          const fechaDevolucion =
            Swal.getPopup().querySelector("#swal-input4").value;

          if (!libro || !cliente || !fechaPrestamo || !fechaDevolucion) {
            Swal.showValidationMessage(
              "Por favor complete todos los campos para crear el prestamo"
            );
          } else if (
            fechaDevolucion < todayDate ||
            fechaPrestamo < todayDate ||
            fechaDevolucion < fechaPrestamo
          ) {
            Swal.showValidationMessage(
              "Las fechas ingresadas para la creación del prestamo son inválidas (fecha previa a la actual)"
            );
          } else {
            let libroObj = getLibroByTitulo(libro);
            let clienteObj = getClienteByName(cliente);

            options.method = "POST";

            options.body = JSON.stringify({
              dniCliente: clienteObj.documento,
              fechaPrestamo: fechaPrestamo,
              fechaDevolucion: fechaDevolucion,
              tituloLibro: libroObj.titulo,
              isbn: libroObj.isbn,
            });

            let message = await crearPrestamo(options);

            if (message) {
              Swal.showValidationMessage(message);
            }
          }

          return {
            libro: libro,
            cliente: cliente,
            fechaPrestamo: fechaPrestamo,
            fechaDevolucion: fechaDevolucion,
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            `Se ha creado exitosamente el prestamo del libro: <b>"${
              result.value.libro
            }"</b> </br>
              A cargo del cliente: <b>${result.value.cliente}</b> </br>
              Fecha inicio: <b>${formatDate(
                result.value.fechaPrestamo,
                true
              )}</b> </br>
              Fecha fin: <b>${formatDate(
                result.value.fechaDevolucion,
                true
              )}</b> </br>`,
            "",
            "success"
          );
        }
      });
    }

    if (buttonPressed.matches(".btn-editar-prestamo")) {
      let prestamoEditado = await getPrestamoById(e.target.dataset.id);

      let fechaInicActual = formatDate(prestamoEditado.fechaPrestamo, false);
      let fechaDevActual = formatDate(prestamoEditado.fechaDevolucion, false);

      let selectClientes = d.querySelector("#selectClientes");
      let selectLibros = d.querySelector("#selectLibros");

      let posLibro = libros
        .map(function (librito) {
          return librito.titulo;
        })
        .indexOf(prestamoEditado.libro.titulo);

      let posCliente = clientes.body
        .map(function (clientito) {
          return clientito.nombre + " " + clientito.apellido;
        })
        .indexOf(
          prestamoEditado.cliente.nombre +
            " " +
            prestamoEditado.cliente.apellido
        );

      selectClientes.childNodes[posCliente + 1].setAttribute("selected", "");
      selectLibros.childNodes[posLibro + 1].setAttribute("selected", "");

      /* Pop - up */

      Swal.fire({
        title: "Datos del prestamo actuales",
        confirmButtonText: "Modificar prestamo",
        showDenyButton: true,
        denyButtonText: `No, volver atrás`,
        html:
          `Libro elegido: ${selectLibros.outerHTML} </br>` +
          `Cliente a cargo: ${selectClientes.outerHTML} </br>` +
          `Fecha de inicio: <input value=${fechaInicActual}  id="swal-input3" type=date  class="swal2-input"> </br>` +
          `Fecha de fin: <input value=${fechaDevActual} id="swal-input4" type=date class="swal2-input"> </br>`,

        preConfirm: async () => {
          const nombreCliente =
            Swal.getPopup().querySelector("#selectClientes").value;
          const nombreLibro =
            Swal.getPopup().querySelector("#selectLibros").value;
          const fechaPrestamo =
            Swal.getPopup().querySelector("#swal-input3").value;
          const fechaDevolucion =
            Swal.getPopup().querySelector("#swal-input4").value;

          if (fechaDevolucion < fechaPrestamo) {
            Swal.showValidationMessage(
              "La fecha de devolución no puede ser anterior a la de inicio del préstamo"
            );
          } else {
            let libro = getLibroByTitulo(nombreLibro);
            let cliente = getClienteByName(nombreCliente);

            options.method = "PUT";
            options.body = JSON.stringify({
              dniCliente: cliente.documento,
              fechaPrestamo: fechaPrestamo,
              fechaDevolucion: fechaDevolucion,
              tituloLibro: libro.titulo,
              isbn: libro.isbn,
            });

            let message = await modificarPrestamo(prestamoEditado.id, options);

            if (message) {
              Swal.showValidationMessage(message);
            }

            return {
              nombreLibro: nombreLibro,
              nombreCliente: nombreCliente,
              fechaPrestamo: fechaPrestamo,
              fechaDevolucion: fechaDevolucion,
            };
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            `Se ha modificado exitosamente el prestamo del libro: <b>${
              result.value.nombreLibro
            }</b> </br>
                A cargo del cliente: <b>${result.value.nombreCliente}</b> </br>
                Fecha inicio: <b>${formatDate(
                  result.value.fechaPrestamo,
                  true
                )}</b> </br>
              Fecha fin: <b>${formatDate(
                result.value.fechaDevolucion,
                true
              )}</b> </br>`,
            "",
            "success"
          );
        }
      });

      selectClientes.childNodes[posCliente + 1].removeAttribute("selected", "");
      selectLibros.childNodes[posLibro + 1].removeAttribute("selected", "");
    }

    if (e.target.matches("#btn_next")) {
      current_page++;
      $table.querySelector("tbody").innerHTML = "";
      pintarTablaPaginada();
    }

    if (e.target.matches("#btn_prev")) {
      current_page--;
      $table.querySelector("tbody").innerHTML = "";
      pintarTablaPaginada();
    }
  });

  d.addEventListener("scroll", () => {
    let elemento = document.querySelector("#crear");
    elemento.classList.add("desaparecer");

    setTimeout(() => {
      elemento.classList.remove("desaparecer");
    }, 1000);
  });

  async function pintarTablaPaginada() {
    let prestamosAsPag = await obtenerJson(
      urlPrestamo + `paged?page=${current_page}&size=10`
    );

    let totalPages = prestamosAsPag.body.totalPages;
    current_page = prestamosAsPag.body.pageable.pageNumber;

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

    prestamosAsPag.body.content.forEach((prestamo) => {
      $template.querySelector(".nombreCliente").textContent =
        prestamo.cliente.nombre + " " + prestamo.cliente.apellido;

      $template.querySelector(
        ".nombreCliente"
      ).id = `nombreCliente_${prestamo.id}`;

      $template.querySelector(".documentoCliente").textContent =
        prestamo.cliente.documento;

      $template.querySelector(
        ".documentoCliente"
      ).id = `documentoCliente_${prestamo.id}`;

      $template.querySelector(".libroTomado").textContent =
        prestamo.libro.titulo;

      $template.querySelector(".libroTomado").id = `libroTomado_${prestamo.id}`;

      $template.querySelector(".fechaPrestamo").textContent = formatDate(
        prestamo.fechaPrestamo,
        true
      );

      $template.querySelector(
        ".fechaPrestamo"
      ).id = `fechaPrestamo_${prestamo.id}`;

      $template.querySelector(".fechaDevolucion").textContent = formatDate(
        prestamo.fechaDevolucion,
        true
      );

      $template.querySelector(
        ".fechaDevolucion"
      ).id = `fechaDevolucion_${prestamo.id}`;

      $template.querySelector(".rowTable").id = `row_${prestamo.id}`;

      $template.querySelector(
        ".botoncitoCancelar"
      ).innerHTML = `<button class="btn btn-danger btn-cancelar-prestamo" data-id="${prestamo.id}"}>Dar de baja</button>`;

      $template.querySelector(
        ".botoncitoEditar"
      ).innerHTML = `<button class="btn btn-warning btn-editar-prestamo"  data-id="edit_${prestamo.id}"}>Editar</button>`;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
  }

  async function getSelectClientes() {
    clientes = await obtenerJson(urlCliente + "alta");

    clientes.body.forEach((cliente) => {
      let optionCliente = d.createElement("option");
      optionCliente.value = cliente.nombre + " " + cliente.apellido;
      optionCliente.innerHTML = cliente.nombre + " " + cliente.apellido;

      d.querySelector("#selectClientes").appendChild(optionCliente);
    });

    //ordenarSelect(d.querySelector("#selectClientes"));
    //ordenarArrayString(clientes.body);
  }

  async function getSelectLibros() {
    let librosNoFilter = await obtenerJson(urlLibro + "alta");

    librosNoFilter.body.forEach((libro) => {
      if (libro.ejemplaresRestantes > 0) {
        libros.push(libro);

        let optionLibro = d.createElement("option");
        optionLibro.value = libro.titulo;
        optionLibro.innerHTML = libro.titulo;

        d.querySelector("#selectLibros").appendChild(optionLibro);
      }
    });
    //ordenarSelect(d.querySelector("#selectLibros"));
    //ordenarArrayString(libro);
  }

  async function crearPrestamo(options) {
    return await obtenerJson(urlPrestamo, options)
      .then((response) => {
        if (response.body.alta) {
          $template.querySelector(".nombreCliente").textContent =
            response.body.cliente.nombre + " " + response.body.cliente.apellido;

          $template.querySelector(
            ".nombreCliente"
          ).id = `nombreCliente_${response.body.id}`;

          $template.querySelector(".documentoCliente").textContent =
            response.body.cliente.documento;

          $template.querySelector(
            ".documentoCliente"
          ).id = `documentoCliente_${response.body.id}`;

          $template.querySelector(".libroTomado").textContent =
            response.body.libro.titulo;

          $template.querySelector(
            ".libroTomado"
          ).id = `libroTomado_${response.body.id}`;

          $template.querySelector(".fechaPrestamo").textContent = formatDate(
            response.body.fechaPrestamo,
            true
          );

          $template.querySelector(
            ".fechaPrestamo"
          ).id = `fechaPrestamo_${response.body.id}`;

          $template.querySelector(".fechaDevolucion").textContent = formatDate(
            response.body.fechaDevolucion,
            true
          );

          $template.querySelector(
            ".fechaDevolucion"
          ).id = `fechaDevolucion_${response.body.id}`;

          $template.querySelector(".rowTable").id = `row_${response.body.id}`;

          $template.querySelector(
            ".botoncitoCancelar"
          ).innerHTML = `<button class="btn btn-danger btn-cancelar-prestamo" data-id="${response.body.id}"}>Dar de baja</button>`;

          $template.querySelector(
            ".botoncitoEditar"
          ).innerHTML = `<button class="btn btn-warning btn-editar-prestamo"  data-id="edit_${response.body.id}"}>Editar</button>`;

          let $clone = d.importNode($template, true);
          $fragment.appendChild($clone);
          $table.querySelector("tbody").appendChild($fragment);
        } else {
          return Promise.reject(response);
        }
      })
      .catch((badResponse) => {
        console.log(badResponse.body.message);

        return badResponse.body.message;
      });
  }

  async function getPrestamoById(id) {
    let response, prestamo;

    if (id.includes("_")) {
      //Caso donde el id es: "edit_[Nro. ID]"
      id = id.split("_");
      response = await fetch(urlPrestamo + id[1]);
    } else {
      // Caso donde el id es únicamente el número
      response = await fetch(urlPrestamo + id);
    }

    prestamo = await response.json();

    return prestamo;
  }

  async function modificarPrestamo(id, options) {
    return await obtenerJson(urlPrestamo + id, options)
      .then((response) => {
        if (response.body.alta) {
          d.getElementById("nombreCliente_" + id).innerHTML =
            response.body.cliente.nombre + " " + response.body.cliente.apellido;
          d.getElementById("documentoCliente_" + id).innerHTML =
            response.body.cliente.documento;
          d.getElementById("libroTomado_" + id).innerHTML =
            response.body.libro.titulo;
          d.getElementById("fechaPrestamo_" + id).innerHTML = formatDate(
            response.body.fechaPrestamo,
            true
          );
          d.getElementById("fechaDevolucion_" + id).innerHTML = formatDate(
            response.body.fechaDevolucion,
            true
          );
        } else {
          return Promise.reject(response);
        }
      })
      .catch((badResponse) => {
        console.log(badResponse.body.message);

        return badResponse.body.message;
      });
  }

  async function cancelarPrestamo(id) {
    return await obtenerJson(urlDesactivarPrestamo + id)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          updateDevolutionDate(id);
          return response;
        } else {
          return Promise.reject(response);
        }
      })
      .catch((badResponse) => {
        console.log(badResponse.body.message);

        return badResponse;
      });
  }

  async function updateDevolutionDate(prestamoId) {
    let prestamoCancelado = await getPrestamoById(prestamoId);

    options.method = "PUT";
    options.body = JSON.stringify({
      isbn: prestamoCancelado.libro.isbn,
      dniCliente: prestamoCancelado.cliente.documento,
      fechaPrestamo: prestamoCancelado.fechaPrestamo,
      fechaDevolucion: getActualDate(),
    });

    obtenerJson(urlPrestamo + prestamoId, options).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return true;
      } else return false;
    });
  }

  function getLibroByTitulo(titulo) {
    return libros.find((librito) => librito.titulo == titulo);
  }

  function getClienteByName(name) {
    return clientes.body.find(
      (clientito) => clientito.nombre + " " + clientito.apellido == name
    );
  }

  function formatDate(date, isReversed) {
    let formattedDate;

    if (date.includes("T")) {
      formattedDate = date.split("T"); // Se crea este array de 2 elementos: [2022-03-30] , [T00:00:00.000+00:00]
      formattedDate = formattedDate[0].split("-");
      // Se crea este array de 3 elementos: [2022] , [03] , [30]
    } else {
      formattedDate = date.split("-");
      // Se crea este array de 3 elementos: [2022] , [03] , [30]
    }

    if (isReversed) {
      formattedDate = formattedDate.reverse(); //Invierte el array previo
    }

    formattedDate = formattedDate.toString().replaceAll(",", "-");
    //Se crea este String 30-03-2022

    return formattedDate; //Retorno la fecha final formateada en String
  }

  function getActualDate() {
    let todayDate = new Date();
    todayDate =
      todayDate.getFullYear() +
      "-" +
      ("0" + (todayDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + todayDate.getDate()).slice(-2);

    return todayDate;
  }

  function ordenarSelect(selectElem) {
    var tmpAry = new Array();
    for (var i = 0; i < selectElem.options.length; i++) {
      tmpAry[i] = new Array();
      tmpAry[i][0] = selectElem.options[i].text;
      tmpAry[i][1] = selectElem.options[i].value;
    }
    tmpAry.sort();
    while (selectElem.options.length > 0) {
      selectElem.options[0] = null;
    }
    for (var i = 0; i < tmpAry.length; i++) {
      var op = new Option(tmpAry[i][0], tmpAry[i][1]);
      selectElem.options[i] = op;
    }
    return;
  }

  function ordenarArrayString(arrayDesordenado) {
    arrayDesordenado.sort((a, b) => {
      let fa = a.nombre.toLowerCase(),
        fb = b.nombre.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }

  let searchInput = document.getElementById("buscar");
  searchInput.addEventListener("keyup", buscaTabla);

  function buscaTabla() {
    let table = document.getElementById("tablaPrestamos").tBodies[0];
    let texto;

    texto = searchInput.value.toLowerCase();
    var r = 0;
    let row;
    while ((row = table.rows[r++])) {
      if (row.children[0].innerText.toLowerCase().indexOf(texto) !== -1) {
        row.style.display = null;
      } else row.style.display = "none";
    }
  }
}