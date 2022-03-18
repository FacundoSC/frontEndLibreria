import { obtenerJson } from "./asincronico.js";
import { options, urlActivar, urlAutor, urlDesactivar, urlLibro } from "./constantes.js";
import { buscaTabla, scroll } from "./funcionesGenerales.js";


const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-templateLibro").content,
  $fragment = d.createDocumentFragment();
 // $myModal = new bootstrap.Modal(d.getElementById('exampleModal'), options);

 function obtenerLibros() {
    obtenerJson(urlLibro).then(libros => {
        console.table(libros)
      libros.forEach(libro => {

        $template.querySelector(".titulo").textContent = libro.titulo;
        $template.querySelector(".titulo").id = `titulo_${libro.id}`;
        $template.querySelector(".isbn").textContent = libro.isbn;
        $template.querySelector(".isbn").id = `isbn_${libro.id}`;
        $template.querySelector(".ejemplaresRestantes").textContent = libro.ejemplaresRestantes;
        $template.querySelector(".ejemplaresRestantes").id = `ejemplaresRestantes_${libro.id}`;
        $template.querySelector(".estado").textContent = libro.alta;
        $template.querySelector(".estado").id = `estado_${libro.id}`;

        $template.querySelector(".editar").dataset.id = `${libro.id}`;
        $template.querySelector(".editar").id = `editar_${libro.id}`;
        $template.querySelector(".ver").dataset.titulo = libro.titulo;
        $template.querySelector(".ver").dataset.isbn = libro.isbn;
        $template.querySelector(".ver").dataset.anio = libro.anio;
        $template.querySelector(".ver").dataset.ejemplares = libro.ejemplares;
        $template.querySelector(".ver").dataset.ejemplaresPrestados = libro.ejemplaresPrestados;
        $template.querySelector(".ver").dataset.ejemplaresRestantes = libro.ejemplaresRestantes;
        $template.querySelector(".ver").dataset.autorNombre = libro.autorNombre;
        $template.querySelector(".ver").dataset.editorialNombre = libro.editorialNombre;

        $template.querySelector(".botonEstado").id = `botonEstado_${libro.id}`;
        $template.querySelector(".botonEstado").classList.remove('btn-success');
        $template.querySelector(".botonEstado").classList.remove('btn-danger');
        $template.querySelector(".botonEstado").dataset.titulo = libro.titulo;
        $template.querySelector(".titulo").classList.remove('tachado');
        $template.querySelector(".estado").classList.remove('tachado');
        $template.querySelector(".editar").removeAttribute("disabled")
        $template.querySelector(".botonEstado").dataset.id = libro.id;
        $template.querySelector(".botonEstado").dataset.estado = libro.alta;
        if (libro.alta) {
          $template.querySelector(".botonEstado").classList.add('btn-success');
        } else {
          $template.querySelector(".botonEstado").classList.add('btn-danger');
          $template.querySelector(".titulo").classList.add('tachado');
          $template.querySelector(".estado").classList.add('tachado');
          $template.querySelector(".editar").setAttribute("disabled", '')
        }
        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });
      $table.querySelector("tbody").appendChild($fragment);
    });
  }
  d.addEventListener("DOMContentLoaded", obtenerLibros());


   async function obtenerUnLibro (index) {
    return await  obtenerJson(urlLibro+index)
    };

    async function obtenerAutores() {
        obtenerJson(urlAutor).then(autores => {
        autores.forEach(autor => {
          var stringAutor=   ( `
            <p><select id="autores"> <option value="${autor.id}" disabled selected> ${autor.nombre}</option>      </select>
            </p> `)
           
          
            })})
      };


function activarLibro(index) {
  obtenerJson(urlLibro+urlActivar+index).then(response => {
    {
      let btn = d.querySelector("#botonEstado_"+index)
      btn.classList.remove("btn-danger")
      btn.classList.add("btn-success")
      btn.dataset.estado = "true";
      btn.parentElement.children[0].removeAttribute("disabled")
      btn.parentNode.parentNode.children[0].classList.remove("tachado")
      btn.parentNode.parentNode.children[3].classList.remove("tachado")
      d.getElementById("estado_" + index).innerHTML = "true";
    }
  });
}
function desactivarLibro(index) {
  obtenerJson(urlLibro+urlDesactivar+index).then(response => {
    {
      let btn = d.querySelector("#botonEstado_"+index)
      btn.classList.remove("btn-success")
      btn.classList.add("btn-danger")
      btn.dataset.estado = "false";
      btn.parentElement.children[0].setAttribute("disabled", '')
      btn.parentNode.parentNode.children[0].classList.add("tachado")
      btn.parentNode.parentNode.children[3].classList.add("tachado")
      d.getElementById("estado_" + index).innerHTML = "false";
    }
  });
}
function modificarLibro(urlLibro, id, options) {
  obtenerJson(urlLibro + id, options).then(response => {
    //d.getElementById("nombre_" + id).innerHTML = response.nombre;
    let listadoBotones = d.getElementById(`editar_${id}`).parentElement;
    console.log(listadoBotones)
    listadoBotones.children[1].dataset.nombre = response.nombre;
    listadoBotones.children[2].dataset.nombre = response.nombre;
  }).catch(error => console.error(error));
}


d.addEventListener("click", async (e) => {
  // if (e.target.matches(".crear")) {
  //   Swal.fire({
  //     title: 'Ingrese nombre del autor:',
  //     input: 'text',
  //     inputAttributes: {
  //       autocapitalize: 'off'
  //     },
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
  //       let nombre = result.value
  //       options.method = 'POST';
  //       options.body = JSON.stringify({ nombre });
  //       crearAutor(urlAutor, options);
  //       Swal.fire(`Se ha creado exitosamente el autor: <b>${nombre}</b>!`, '', 'success')
  //     } else {
  //       Swal.fire('Se ha cancelado la operación', '', 'warning')
  //     }
  //   })
  // }

  if (e.target.matches(".editar")) {
    const id = e.target.dataset.id;
    var libro= await obtenerUnLibro(id)
    var selectAutor= await obtenerAutores()
    console.log(selectAutor)

   // var autores=await obtenerArrayAutor();

      Swal.fire({
        title: 'Modificar Libro:',
        html: `
        <p>Titulo: <input  value= "${libro.titulo}" type="text" class="swal2-input" placeholder="Titulo Libro"></p>
        <p>Año: <input  value= "${libro.anio}" type="text"  class="swal2-input" placeholder="Año publicacion"></p>
        <p>ISBN: <input  value= "${libro.isbn}" type="text"  class="swal2-input" placeholder="Año publicacion"></p>
        <p>Ejemplares: <input  value= "${libro.ejemplares}" type="text"  class="swal2-input" placeholder="Año publicacion"></p> 
        <p>Autores:${selectAutor} </p> `
        ,
        allowEnterKey: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar ❌',
        confirmButtonText: 'Guardar 💾'//,
        // customClass: {
        //   validationMessage: 'my-validation-message'
        // },
        // preConfirm: (value) => {
        //   if (!value) {
        //     Swal.showValidationMessage(
        //       '<i class="fa fa-info-circle"></i>El nombre es requerido.'
        //     )
        //   }
        // }
      //  }).then((result) => {{
      //    // if (result.isConfirmed) {
      //    var libroNuevo = result.value
      //     options.method = 'PUT'
      //     options.body = JSON.stringify({ libroNuevo }),
      //     modificarLibro(urlLibro, id, options)
      //    // Swal.fire(`Se ha modificado el nombre de <b>${tituloViejo}</b> a <b>${titulo}</b>!`, '', 'success')
      //     // } else {
      //     //   Swal.fire('Se ha cancelado la operación', '', 'warning')
      //    // }
      //  }}

       } )
    };



  if (e.target.matches(".botonEstado")) {
    Swal.fire({
      title: '¿Deseas cambiar el estado del libro?',
      showDenyButton: true,
      icon: 'question',
      confirmButtonText: 'SI 😎',
      denyButtonText: `NO 🙏`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        let btn = e.target;
        let estadoFinal;
        if (btn.dataset.estado == 'true') {
          estadoFinal = "false"
          desactivarLibro(btn.dataset.id);
        } else {
          estadoFinal = "true"
          activarLibro(btn.dataset.id);
        }
        Swal.fire(`El estado del Libro <b>${btn.dataset.titulo}</b> ha sido modificado a <b>${estadoFinal}</b>.`, '', 'success')
      } else if (result.isDenied) {
        Swal.fire('No se han realizado cambios.', '', 'info')
      }
    });
  }

  if (e.target.matches(".ver")) {
    Swal.fire({
      icon: 'info',
      title: 'Datos Libro:',
      html: `<p class="nombreAutor">
      Titulo: ${e.target.dataset.titulo}
      <br>
      Isbn: ${e.target.dataset.isbn}
      <br>
      Año: ${e.target.dataset.anio}
      <br>
      Total Ejemplares: ${e.target.dataset.ejemplares}
      <br>
      Prestados: ${e.target.dataset.ejemplaresPrestados}
      <br>
      Restantes: ${e.target.dataset.ejemplaresRestantes}
      <br>
      Autor: ${e.target.dataset.autorNombre}
      <br>
      Editorial: ${e.target.dataset.editorialNombre}
      </p>`
    })
  }

});




let searchInput = document.getElementById('buscar');
let table = document.getElementById("tabla").tBodies[0];

searchInput.addEventListener('keyup', buscaTabla(searchInput,table));



d.addEventListener('scroll', scroll());
