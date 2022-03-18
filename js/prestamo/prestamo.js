import {obtenerJson} from "../asincronico.js";
import {urlPrestamo, urlActivarPrestamo, urlDesactivarPrestamo} from "./PrestamoUris.js";
import {urlCliente,urlLibro, options, optionsGET} from "../constantes.js";

const d = document,
  $table = d.querySelector("#tablaPrestamos"),
  $template = d.getElementById("crud-template-prestamo").content,
  $fragment = d.createDocumentFragment(); 
/*   $myModal = new bootstrap.Modal(d.getElementById('exampleModal'), options); */

  d.addEventListener("DOMContentLoaded", pintarTabla());

  function pintarTabla() {
    obtenerJson(urlPrestamo).then(prestamos => {
      prestamos.forEach(prestamo => {

       if (prestamo.alta){
         
        $template.querySelector(".nombreCliente").textContent = prestamo.cliente.nombre + " " + prestamo.cliente.apellido;
        $template.querySelector(".documentoCliente").textContent = prestamo.cliente.documento;
        $template.querySelector(".libroTomado").textContent = prestamo.libro.titulo;
        $template.querySelector(".fechaPrestamo").textContent = formatDate(prestamo.fechaPrestamo);
        $template.querySelector(".fechaDevolucion").textContent = formatDate(prestamo.fechaDevolucion);
        /*$template.querySelector(".estado").textContent = prestamo.alta;
         $template.querySelector(".estado").id = "estado_" + prestamo.id; */

        $template.querySelector(".rowTable").id = "row_" + prestamo.id;

        $template.querySelector(".botoncito").innerHTML = `<button class="btn btn-warning btn-cancelar-prestamo" data-id="${prestamo.id}"}>Cancelar prestamo</button>`
        
        }
      
        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });

      $table.querySelector("tbody").appendChild($fragment);
    });
  }

  function formatDate(date){

    // (Ejemplo) 
    //Date inicial : 2022-03-30T00:00:00.000+00:00

   let formatDate = date.split('T');
    // Se crea este array de 2 elementos: [2022-03-30] , [T00:00:00.000+00:00]

   formatDate = formatDate[0].split("-").reverse();
    // Se crea este array de 3 elementos: [30] , [03] , [2022]

   formatDate = formatDate.toString().replaceAll(",","-");
    //Se crea este String 30-03-2022

   return formatDate; //Retorno la fecha final en String
  }

  function crearAutor(options) {
    obtenerJson(urlPrestamo, options).then(response => {

    /*  $template.querySelector(".nombreCliente").textContent = response.cliente.nombre;
        $template.querySelector(".documentoCliente").textContent = prestamo.cliente.documento;
        $template.querySelector(".libroTomado").textContent = prestamo.libro.titulo;
        $template.querySelector(".fechaPrestamo").textContent = formatDate(prestamo.fechaPrestamo);
        $template.querySelector(".fechaDevolucion").textContent = formatDate(prestamo.fechaDevolucion);
        $template.querySelector(".estado").textContent = prestamo.alta;
        $template.querySelector(".estado").id = "estado_" + prestamo.id; */

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
        $table.querySelector("tbody").appendChild($fragment);
      
    }).catch(error => console.error(error));
  }

  function listenSelectLibros(){
    let selectLibros = d.getElementById("selectLibros");
    let index;

    selectLibros.addEventListener('change', function(){
      console.log("Entre a el event listener de cambio libro");
      index = selectLibros.selectedIndex;

    })

    selectLibros.setAttribute("selectedOption",index);
  }

  function listenSelectClientes(){
    let selectClientes = d.getElementById("selectClientes");
    let index;

    selectClientes.addEventListener('change', function(){
      console.log("Entre a el event listener de cambio cliente");
      index = selectClientes.selectedIndex;

    })

    selectClientes.setAttribute("selectedOption",index);
  }


  d.addEventListener("click", async (e) =>{
    let buttonCancel = e.target;

    if(buttonCancel.matches(".btn-cancelar-prestamo")){
      cancelarPrestamo(buttonCancel.dataset.id);

       d.querySelector("#row_" + buttonCancel.dataset.id).remove(); 
    }

    if (e.target.matches(".crear")) {
      Swal.fire({
        title: 'Crear nuevo prestamo ',
        html:
          `Elige un libro ${d.querySelector("#divLibros").innerHTML} </br>` +
          `Elige un cliente ${d.querySelector("#divClientes").innerHTML} </br>` + 
          `Fecha inicio <input required type=date id="swal-input3" class="swal2-input"> </br>`+ 
          `Fecha fin <input required type=date id="swal-input4" class="swal2-input"> </br>`,
        preConfirm: () => {
          return new Promise(function (resolve) {
            resolve([

              console.log("////[Entre a la funcion Resolve]////"),
              console.log(d.querySelector('#selectLibros').getAttribute("selectedOption")),
              console.log(d.querySelector('#selectClientes').getAttribute("selectedOption")),
              console.log(d.querySelector('#swal-input3').value),
              console.log(d.querySelector('#swal-input4').value),
             
            ])
          })
        },
        onOpen: function () {
          $('#swal-input1').focus()
        }
      }).then(function (result) { 
        //new swal(JSON.stringify(result))
      }).catch(swal.noop)
    }
  })


  d.addEventListener("DOMContentLoaded", async function () {

    /** Llenar select de cliente */

    let clienteArray = await obtenerJson(urlCliente)

    clienteArray.forEach(cliente => {
      let optionCliente = d.createElement('option');
      optionCliente.value = cliente.nombre + " " + cliente.apellido;
      optionCliente.innerHTML = cliente.nombre + " " + cliente.apellido;
      d.querySelector("#selectClientes").appendChild(optionCliente);
    })

    
    /** Llenar select de libro */

    let libroArray = await obtenerJson(urlLibro)

    libroArray.forEach(libro => {
      let optionLibro = d.createElement('option');
      optionLibro.value = libro.titulo;
      optionLibro.innerHTML = libro.titulo;
      d.querySelector("#selectLibros").appendChild(optionLibro);
    })

    /* console.log(d.querySelector("#selectClientes"));
    console.log(d.querySelector("#selectLibros")); */

  }); 

  
   
  function cancelarPrestamo(index){
    /** urlActivarPrestamo 
     * urlDesactivarPrestamo*/ 
    obtenerJson(urlActivarPrestamo + index).then(response => {console.log(response)});
  }








  /* [Versión creando los selects dinamicamente, no funciona] */
  /*  let divSelects = d.createElement("div");
    divSelects.setAttribute("id","divDatalist");

    obtenerJson(urlCliente).then(clienteArray => {
      
      let selectCliente = d.createElement("select");
      selectCliente.setAttribute("id","selectClientes");

      clienteArray.forEach(cliente=> {
        let optionCliente = d.createElement('option');
        optionCliente.value = cliente.nombre;
        optionCliente.innerHTML = cliente.nombre;
        selectCliente.appendChild(optionCliente);
      })

      divSelects.appendChild(selectCliente);

      console.log(d.querySelector("#divDatalist"));
      console.log(d.querySelector("#selectClientes"));

    })

    obtenerJson(urlLibro).then(libroArray => {

      let selectLibros = d.createElement('select');
      selectLibros.setAttribute("id","selectLibros");

     libroArray.forEach(libro=> {
        let optionLibro = d.createElement('option');
        optionLibro.value = libro.titulo;
        optionLibro.innerHTML = libro.titulo;
        selectLibros.appendChild(optionLibro);
      })
      divSelects.innerHTML = selectLibros;

      console.log(d.querySelector("#divDatalist"));
      console.log(d.querySelector("#selectLibros"));
      
    })*/