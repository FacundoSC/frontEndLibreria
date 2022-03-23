import { obtenerJson } from "../asincronico.js";
import {
  urlPrestamo,
  urlActivarPrestamo,
  urlDesactivarPrestamo,
  urlPrestamoLocal,
} from "./PrestamoUris.js";
import {
  urlCliente,
  urlLibro,
  options,
  optionsGET,
} from "../constantes.js";

const d = document,
  $table = d.querySelector("#tablaPrestamos"),
  $template = d.getElementById("crud-template-prestamo").content,
  $fragment = d.createDocumentFragment();

let libros = [];
let clientes = [];
let prestamos = [];

d.addEventListener("DOMContentLoaded", pintarTabla());

function pintarTabla() {
  obtenerJson(urlPrestamoLocal).then((prestamoList) => {
    prestamos = prestamoList;

    prestamoList.forEach((prestamo) => {
      if (prestamo.alta) {
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

        $template.querySelector(
          ".libroTomado"
        ).id = `libroTomado_${prestamo.id}`;

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
        ).innerHTML = `<button class="btn btn-warning btn-editar-prestamo" data-id="edit_${prestamo.id}"}>Editar</button>`;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      }
    });

    $table.querySelector("tbody").appendChild($fragment);
  });
}

function formatDate(date, isReversed) {
  // (Ejemplo)
  //Date inicial : 2022-03-30T00:00:00.000+00:00

  let formatDate = date.split("T");
  // Se crea este array de 2 elementos: [2022-03-30] , [T00:00:00.000+00:00]

  formatDate = formatDate[0].split("-");
  // Se crea este array de 3 elementos: [2022] , [03] , [30]

  if (isReversed) {
    formatDate = formatDate.reverse(); //Invierte el array previo
  }

  formatDate = formatDate.toString().replaceAll(",", "-");
  //Se crea este String 30-03-2022

  return formatDate; //Retorno la fecha final en String
}

function crearPrestamo(options) {
  obtenerJson(urlPrestamoLocal, options).then(
    (response) => {

      if (response.alta) {
        $template.querySelector(".nombreCliente").textContent =
          response.cliente.nombre + " " + response.cliente.apellido;

        $template.querySelector(".documentoCliente").textContent =
          response.cliente.documento;

        $template.querySelector(".libroTomado").textContent =
          response.libro.titulo;

        $template.querySelector(".fechaPrestamo").textContent = formatDate(
          response.fechaPrestamo,
          true
        );

        $template.querySelector(".fechaDevolucion").textContent = formatDate(
          response.fechaDevolucion,
          true
        );

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
        $table.querySelector("tbody").appendChild($fragment);

        return true;
      } else {
        return false;
      }
    }
  );
}

function modificarPrestamo(id, options) {
  obtenerJson(urlPrestamoLocal + id, options)
    .then((response) => {

      if (response.alta) {
        d.getElementById("nombreCliente_" + id).innerHTML =
          response.cliente.nombre + " " + response.cliente.apellido;
        d.getElementById("documentoCliente_" + id).innerHTML =
          response.cliente.documento;
        d.getElementById("libroTomado_" + id).innerHTML = response.libro.titulo;
        d.getElementById("fechaPrestamo_" + id).innerHTML = formatDate(
          response.fechaPrestamo,
          true
        );
        d.getElementById("fechaDevolucion_" + id).innerHTML = formatDate(
          response.fechaDevolucion,
          true
        );

        return true;

      } else {
        return false;
      }
    })
    .catch((error) => console.error(error));
}

function getLibroByTitulo(titulo) {
  return libros.find((librito) => librito.titulo == titulo);
}

function getClienteByName(name) {
  return clientes.find(
    (clientito) => clientito.nombre + " " + clientito.apellido == name
  );
}

d.addEventListener("click", async (e) => {
  let buttonPressed = e.target;

  if (buttonPressed.matches(".btn-cancelar-prestamo")) {
    Swal.fire({
      title: "¿Deseas cancelar el prestamo?",
      showDenyButton: true,
      icon: "question",
      confirmButtonText: "Si, cancelar el prestamo",
      denyButtonText: `No, volver atrás`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelarPrestamo(buttonPressed.dataset.id);

        Swal.fire(`Se ha eliminado exitosamente el prestamo `, "", "success");

        d.querySelector("#row_" + buttonPressed.dataset.id).remove();
      } else Swal.fire("No se han realizado cambios.", "", "info");
    });
  }

  if (buttonPressed.matches(".crear")) {
    Swal.fire({
      title: "Crear nuevo prestamo ",
      html:
        `Elige un cliente ${d.querySelector("#divClientes").innerHTML} </br>` +
        `Elige un libro ${d.querySelector("#divLibros").innerHTML} </br>` +
        `Fecha inicio <input required type=date id="swal-input3" class="swal2-input"> </br>` +
        `Fecha fin <input required type=date id="swal-input4" class="swal2-input"> </br>`,

      preConfirm: () => {
        const libro = Swal.getPopup().querySelector("#selectLibros").value;
        const cliente = Swal.getPopup().querySelector("#selectClientes").value;
        const fechaPrestamo =
          Swal.getPopup().querySelector("#swal-input3").value;
        const fechaDevolucion =
          Swal.getPopup().querySelector("#swal-input4").value;

        return {
          libro: libro,
          cliente: cliente,
          fechaPrestamo: fechaPrestamo,
          fechaDevolucion: fechaDevolucion,
        };
      },
    }).then((result) => {
      let libro = getLibroByTitulo(result.value.libro);
      let cliente = getClienteByName(result.value.cliente);

      options.method = "POST";

      options.body = JSON.stringify({
        dniCliente: cliente.documento,
        fechaPrestamo: result.value.fechaPrestamo,
        fechaDevolucion: result.value.fechaDevolucion,
        tituloLibro: libro.titulo,
        isbn: libro.isbn,
      });

      crearPrestamo(options);

      Swal.fire(
        `Se ha creado exitosamente el prestamo del libro: <b>${
          libro.titulo
        }</b> </br>
            A cargo del cliente: <b>${
              cliente.nombre + " " + cliente.apellido
            }</b> `,
        "",
        "success"
      );
    });
  }

  if (buttonPressed.matches(".btn-editar-prestamo")) {
    let prestamoEditado = prestamos.find(
      (prestamito) => "edit_" + prestamito.id == buttonPressed.dataset.id
    );

    let fechaInicActual = formatDate(prestamoEditado.fechaPrestamo, false);
    let fechaDevActual = formatDate(prestamoEditado.fechaDevolucion, false);

    let selectClientes = d.querySelector("#selectClientes");
    let selectLibros = d.querySelector("#selectLibros");

    let posLibro = libros
      .map(function (librito) {
        return librito.titulo;
      })
      .indexOf(prestamoEditado.libro.titulo);

    let posCliente = clientes
      .map(function (clientito) {
        return clientito.nombre;
      })
      .indexOf(prestamoEditado.cliente.nombre);

    selectClientes.childNodes[posCliente].setAttribute("selected", "");
    selectLibros.childNodes[posLibro].setAttribute("selected", "");

    /* Pop - up */

    Swal.fire({
      title: "Datos del prestamo actuales",
      showDenyButton: true,
      denyButtonText: `No, volver atrás`,
      html:
        `Libro elegido: ${selectLibros.outerHTML} </br>` +
        `Cliente a cargo: ${selectClientes.outerHTML} </br>` +
        `Fecha de inicio: <input value=${fechaInicActual} id="swal-input3" type=date class="swal2-input"> </br>` +
        `Fecha de devolución: <input value=${fechaDevActual} id="swal-input4" type=date class="swal2-input"> </br>`,

      preConfirm: () => {
        const nombreCliente =
          Swal.getPopup().querySelector("#selectClientes").value;
        const nombreLibro =
          Swal.getPopup().querySelector("#selectLibros").value;
        const fechaPrestamo =
          Swal.getPopup().querySelector("#swal-input3").value;
        const fechaDevolucion =
          Swal.getPopup().querySelector("#swal-input4").value;

        return {
          nombreLibro: nombreLibro,
          nombreCliente: nombreCliente,
          fechaPrestamo: fechaPrestamo,
          fechaDevolucion: fechaDevolucion,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let libro = getLibroByTitulo(result.value.nombreLibro);
        let cliente = getClienteByName(result.value.nombreCliente);

        options.method = "PUT";

        options.body = JSON.stringify({
          dniCliente: cliente.documento,
          fechaPrestamo: result.value.fechaPrestamo,
          fechaDevolucion: result.value.fechaDevolucion,
          tituloLibro: libro.titulo,
          isbn: libro.isbn,
        });

        modificarPrestamo(prestamoEditado.id, options);
        Swal.fire(
          `Se ha modificado exitosamente el prestamo del libro: <b>${
            libro.titulo
          }</b> </br>
              A cargo del cliente: <b>${
                cliente.nombre + " " + cliente.apellido
              }</b> `,
          "",
          "success"
        );
      } else Swal.fire("No se han realizado cambios.", "", "info");
    });

    selectClientes.childNodes[posCliente].removeAttribute("selected", "");
    selectLibros.childNodes[posLibro].removeAttribute("selected", "");
  }
});

d.addEventListener("DOMContentLoaded", async function () {
  /** Llenar select de cliente */

  let clientesNoFilter = await obtenerJson(urlCliente);

  clientesNoFilter.forEach((cliente) => {
    if (cliente.alta) {
      clientes.push(cliente);

      let optionCliente = d.createElement("option");
      optionCliente.value = cliente.nombre + " " + cliente.apellido;
      optionCliente.innerHTML = cliente.nombre + " " + cliente.apellido;

      d.querySelector("#selectClientes").appendChild(optionCliente);
    }
  });

  /** Llenar select de libro */

  let librosNoFilter = await obtenerJson(urlLibro);

  librosNoFilter.forEach((libro) => {
    if (libro.alta && libro.ejemplaresRestantes > 0) {
      libros.push(libro);

      let optionLibro = d.createElement("option");
      optionLibro.value = libro.titulo;
      optionLibro.innerHTML = libro.titulo;

      d.querySelector("#selectLibros").appendChild(optionLibro);
    }
  });
});

function cancelarPrestamo(index) {
  obtenerJson(urlDesactivarPrestamo + index).then((response) => {
    console.log(response);
    if (response.status == 200) {
      return true;
    } else {
      return false;
    }
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

d.addEventListener("scroll", () => {
  let elemento = document.querySelector("#crear");
  elemento.classList.add("desaparecer");

  setTimeout(() => {
    elemento.classList.remove("desaparecer");
  }, 1000);
});
