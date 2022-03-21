import { obtenerJson } from "../asincronico.js";
import {
  urlPrestamo,
  urlActivarPrestamo,
  urlDesactivarPrestamo,
  urlPrestamoLocal,
} from "./PrestamoUris.js";
import { urlCliente, urlLibro, options, optionsGET } from "../constantes.js";

const d = document,
  $table = d.querySelector("#tablaPrestamos"),
  $template = d.getElementById("crud-template-prestamo").content,
  $fragment = d.createDocumentFragment();
/*   $myModal = new bootstrap.Modal(d.getElementById('exampleModal'), options); */

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
        $template.querySelector(".documentoCliente").textContent =
          prestamo.cliente.documento;
        $template.querySelector(".libroTomado").textContent =
          prestamo.libro.titulo;
        $template.querySelector(".fechaPrestamo").textContent = formatDate(
          prestamo.fechaPrestamo, true
        );
        $template.querySelector(".fechaDevolucion").textContent = formatDate(
          prestamo.fechaDevolucion, true
        );
        /*$template.querySelector(".estado").textContent = prestamo.alta;
         $template.querySelector(".estado").id = "estado_" + prestamo.id; */

        $template.querySelector(".rowTable").id = "row_" + prestamo.id;

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

function formatDate(date,isReversed) {
  // (Ejemplo)
  //Date inicial : 2022-03-30T00:00:00.000+00:00

  let formatDate = date.split("T");
  // Se crea este array de 2 elementos: [2022-03-30] , [T00:00:00.000+00:00]

  formatDate = formatDate[0].split("-");
  // Se crea este array de 3 elementos: [30] , [03] , [2022
  
  if (isReversed){
    formatDate = formatDate.reverse();
  }
  
  
  formatDate = formatDate.toString().replaceAll(",", "-");
  //Se crea este String 30-03-2022

  return formatDate; //Retorno la fecha final en String
}

function crearPrestamo(options) {
  obtenerJson("http://localhost:8080/api/v1/prestamo/", options)
    .then((response) => {
      console.log(response);
      $template.querySelector(".nombreCliente").textContent =
        response.cliente.nombre;
      $template.querySelector(".documentoCliente").textContent =
        response.cliente.documento;
      $template.querySelector(".libroTomado").textContent =
        response.libro.titulo;
      $template.querySelector(".fechaPrestamo").textContent = formatDate(
        response.fechaPrestamo
      );
      $template.querySelector(".fechaDevolucion").textContent = formatDate(
        response.fechaDevolucion
      );
      $template.querySelector(".estado").textContent = response.alta;
      $template.querySelector(".estado").id = "estado_" + response.id;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
      $table.querySelector("tbody").appendChild($fragment);
    })
    .catch((error) => console.log(error));
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
  let buttonCancel = e.target;

  if (buttonCancel.matches(".btn-cancelar-prestamo")) {
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
        cancelarPrestamo(buttonCancel.dataset.id);

        d.querySelector("#row_" + buttonCancel.dataset.id).remove();
      } else Swal.fire("No se han realizado cambios.", "", "info");
    });
  }

  if (e.target.matches(".crear")) {
    Swal.fire({
      title: "Crear nuevo prestamo ",
      html:
        `Elige un libro ${d.querySelector("#divLibros").innerHTML} </br>` +
        `Elige un cliente ${d.querySelector("#divClientes").innerHTML} </br>` +
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

  if (e.target.matches(".btn-editar-prestamo")) {

    /* Obtengo el prestamo a editar desde el Array de prestamos*/

    let prestamoEditado = prestamos.find(prestamito => ("edit_" + prestamito.id) == e.target.dataset.id);

    /* Obtengo las fechas del prestamo en su formato correcto para asignarlas al value del input*/
    let fechaInicActual = formatDate(prestamoEditado.fechaPrestamo,false);
    let fechaDevActual = formatDate(prestamoEditado.fechaDevolucion, false);

    /* Obtengo el select de Cliente, uno para mostrar en el pop-up y otro para setear el index por default*/

    let selectClientes = d.querySelector("#divClientes").innerHTML;
    //let selectClientes2 = d.getElementById("selectClientes")//d.querySelector("#selectClientes");

    let selectLibros = d.querySelector("#divLibros").innerHTML;
    //let selectLibros2 = d.getElementById("selectLibros")//d.querySelector("#selectLibros");

    /* Lógica para obtener la posición dentro del Select. La posición en el Array es la misma que en los select*/ 

    var posLibro = libros.map(function(librito) {
      return librito.titulo;
    }).indexOf(prestamoEditado.libro.titulo);

    var posCliente = clientes.map(function(clientito) {
      return clientito.nombre;
    }).indexOf(prestamoEditado.cliente.nombre);

    console.log("Cliente:" + clientes[posCliente].nombre + " " + clientes[posCliente].apellido );
    console.log("Cliente pos dentro de su array: " + posCliente);

    console.log("Libro:" + libros[posLibro].titulo);
    console.log("Libro pos dentro de su array: " + posLibro);

    //console.log(d.querySelector("#divClientes").firstElementChild.item(4))

    /* Asigno por default los index dentro de los Select de Clientes y de Libros */

    //Version 1
    //selectClientes2.selectedIndex = posCliente;
    //selectLibros2.selectedIndex = posLibro;

    //Version 2
    let defaultOpCliente = d.querySelector("#divClientes").firstElementChild.item(posCliente);
    defaultOpCliente.setAttribute("selected","selected")

    console.log(defaultOpCliente)
      

    /* Pop - up */

    Swal.fire({
      title: "Datos del prestamo actuales",
      html:
        `Cliente a cargo: ${selectClientes} </br>` +
        `Libro elegido: ${selectLibros} </br>`+
        `Fecha de inicio: <input value=${fechaInicActual} id="swal-input3" type=date class="swal2-input"> </br>` +
        `Fecha de devolución: <input value=${fechaDevActual} id="swal-input4" type=date class="swal2-input"> </br>`,

        preConfirm: () => {
          const nombreCliente = Swal.getPopup().querySelector("#selectClientes").value;
          const nombreLibro = Swal.getPopup().querySelector("#selectLibros").value;
          const fechaPrestamo = Swal.getPopup().querySelector("#swal-input3").value;
          const fechaDevolucion = Swal.getPopup().querysSelector("#swal-input4").value;
  
          return {
            nombreLibro: nombreLibro,
            nombreCliente: nombreCliente,
            fechaPrestamo: fechaPrestamo,
            fechaDevolucion: fechaDevolucion,
          };
        },
        
    }).then((result) => {
      console.log(result.nombreLibro.value);
      console.log(result.nombreCliente.value);
      console.log(result.fechaPrestamo.value);
      console.log(result.fechaDevolucion.value);

    });

    defaultOpCliente.removeAttribute("selected")
  }
});

d.addEventListener("DOMContentLoaded", async function () {
  /** Llenar select de cliente */

  clientes = await obtenerJson(urlCliente);

  clientes.forEach((cliente) => {
    if (cliente.alta) {
      let optionCliente = d.createElement("option");
      optionCliente.value = cliente.nombre + " " + cliente.apellido;
      optionCliente.innerHTML = cliente.nombre + " " + cliente.apellido;

      d.querySelector("#selectClientes").appendChild(optionCliente);
    }
  });

  /** Llenar select de libro */

  libros = await obtenerJson(urlLibro);

  libros.forEach((libro) => {
    if (libro.alta && libro.ejemplaresRestantes > 0) {
      let optionLibro = d.createElement("option");
      optionLibro.value = libro.titulo;
      optionLibro.innerHTML = libro.titulo;

      d.querySelector("#selectLibros").appendChild(optionLibro);
    }
  });
});

function cancelarPrestamo(index) {
  /** urlActivarPrestamo
   * urlDesactivarPrestamo*/
  obtenerJson(urlDesactivarPrestamo + index).then((response) => {
    console.log(response);
  });
}
