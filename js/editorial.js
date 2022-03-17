import { options, urlEditorial, urlDesactivar, urlActivar } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment()

d.addEventListener("DOMContentLoaded", obtenerEditoriales(urlEditorial));

function obtenerEditoriales() {
  obtenerJson(urlEditorial).then(editoriales => {
    editoriales.forEach(editorial => {

      $template.querySelector(".nombre").textContent = editorial.nombre;
      $template.querySelector(".nombre").id = `nombre_${editorial.id}`;
      $template.querySelector(".nombre").classList.remove('tachado');

      $template.querySelector(".estado").textContent = editorial.alta;
      $template.querySelector(".estado").id = `estado_${editorial.id}`;
      $template.querySelector(".estado").classList.remove('tachado');

      //logica para adicion de libros en select
      while ($template.querySelector(".asociados").firstChild) {
        $template.querySelector(".asociados").removeChild($template.querySelector(".asociados").firstChild);
      }

      if (editorial.libros.length == 0) {
        let elemento = document.createElement('p')
        elemento.textContent = "NO EXISTEN LIBROS ASOCIADOS";
        $template.querySelector(".asociados").appendChild(elemento)
      }
      else {
        let selector = document.createElement('select')
        selector.setAttribute("id", "select_"+editorial.id)
        let fragmentLibro = document.createDocumentFragment();
        editorial.libros.forEach((libro) => {
          let elemento = document.createElement('option');
          elemento.textContent = libro.titulo;
          elemento.dataset.autor = libro.autorNombre;
          selector.appendChild(elemento);
        });
        fragmentLibro.appendChild(selector);
        $template.querySelector(".asociados").appendChild(fragmentLibro);
      }
      //fin logica para adicion de libros en select
      $template.querySelector(".asociados").id = `asociados_${editorial.id}`;

      $template.querySelector(".editar").dataset.id = `${editorial.id}`;
      $template.querySelector(".editar").id = `editar_${editorial.id}`;
      $template.querySelector(".editar").removeAttribute("disabled")

      $template.querySelector(".ver").dataset.nombre = editorial.nombre;
      $template.querySelector(".ver").id = `ver_${editorial.id}`;

      $template.querySelector(".botonEstado").id = `botonEstado_${editorial.id}`;
      $template.querySelector(".botonEstado").classList.remove('btn-success');
      $template.querySelector(".botonEstado").classList.remove('btn-danger');
      $template.querySelector(".botonEstado").dataset.nombre = editorial.nombre;
      $template.querySelector(".botonEstado").dataset.id = editorial.id;
      $template.querySelector(".botonEstado").dataset.estado = editorial.alta;

      if (editorial.alta) {
        $template.querySelector(".botonEstado").classList.add('btn-success');
      } else {
        $template.querySelector(".botonEstado").classList.add('btn-danger');
        $template.querySelector(".nombre").classList.add('tachado');
        $template.querySelector(".estado").classList.add('tachado');
        $template.querySelector(".editar").setAttribute("disabled", '')
      }
      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);
  });
}//fin funcion obtener editoriales

//funciones de click de botones
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

  // if (e.target.matches(".editar")) {
  //   const id = e.target.dataset.id;
  //   const nombreViejo = document.getElementById("nombre_" + id).textContent;
  //   let nombre = nombreViejo;

  //     Swal.fire({
  //       title: 'Modificar nombre:',
  //       input: 'text',
  //       inputValue: nombreViejo,
  //       inputAttributes: {
  //         placeholder: "Indique nuevo nombre",
  //         autocapitalize: 'off'
  //       },
  //       allowEnterKey: true,
  //       showCancelButton: true,
  //       cancelButtonText: 'Cancelar ❌',
  //       confirmButtonText: 'Guardar 💾',
  //       customClass: {
  //         validationMessage: 'my-validation-message'
  //       },
  //       preConfirm: (value) => {
  //         if (!value) {
  //           Swal.showValidationMessage(
  //             '<i class="fa fa-info-circle"></i>El nombre es requerido.'
  //           )
  //         }
  //       }
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         nombre = result.value
  //         options.method = 'PUT';
  //         options.body = JSON.stringify({ nombre });
  //         modificarAutor(urlAutor, id, options);
  //         Swal.fire(`Se ha modificado el nombre de <b>${nombreViejo}</b> a <b>${nombre}</b>!`, '', 'success')
  //       } else {
  //         Swal.fire('Se ha cancelado la operación', '', 'warning')
  //       }
  //     })
  //   };


  // if (e.target.matches(".botonEstado")) {
  //   Swal.fire({
  //     title: '¿Deseas cambiar el estado del autor?',
  //     showDenyButton: true,
  //     icon: 'question',
  //     confirmButtonText: 'SI 😎',
  //     denyButtonText: `NO 🙏`,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       let btn = e.target;
  //       let estadoFinal;
  //       if (btn.dataset.estado == 'true') {       
  //         estadoFinal = "false"   
  //         desactivarAutor(urlAutor+urlDesactivar, btn.dataset.id);
  //       } else {
  //         estadoFinal = "true"  
  //         activarAutor(urlAutor+urlActivar, btn.dataset.id);
  //       }
  //       Swal.fire(`El estado del autor <b>${btn.dataset.nombre}</b> ha sido modificado a <b>${estadoFinal}</b>.`, '', 'success')
  //     } else if (result.isDenied) {
  //       Swal.fire('No se han realizado cambios.', '', 'info')
  //     }
  //   });
  // }

  if (e.target.matches(".ver")) {
    let id = e.target.id.split("_")[1]
    let textoHTML = ''

    if(d.getElementById("asociados_"+id).firstChild.localName == "p"){
      textoHTML=`<p><b>Actualmente no posee libros asociados</b></p>`
    } else{
      let cantidadDeLibros = d.getElementById("asociados_"+id).firstChild.length
      let listado = d.getElementById("asociados_"+id).firstChild.children

      switch (cantidadDeLibros) {
        case 1:
          textoHTML=`<p><b>Posee solo un libro asociado:</b></p><p>${listado[0].value}</p>`;
          break;
        case 2: 
        textoHTML=`<p><b>Posee dos libros asociados:</b></p><p>${listado[0].value}</p><p>${listado[1].value}</p>`;
        break;
        case 3: 
        textoHTML=`<p><b>Posee tres libros asociados:</b></p><p>${listado[0].value}</p><p>${listado[1].value}</p><p>${listado[2].value}</p>`
          break;
        default:
          let librosSeleccionados = []; //variable aux para guardar los indices a mostrar
          while(librosSeleccionados.length < 3){
            let numeroElegido = Math.random() * (cantidadDeLibros - 0);
            if(!librosSeleccionados.includes(numeroElegido)){
              librosSeleccionados.push(numeroElegido)
            }
          }
          //recupera de la variable aux los libros
          let libroUno = librosSeleccionados[0] 
          let libroDos = librosSeleccionados[1] 
          let libroTres = librosSeleccionados[2]
          //fin recupero de nombres 

          textoHTML=`<p><b>Posee ${cantidadDeLibros} libros asociados, algunos de ellos son:</b></p><p>${listado[libroUno].value}</p><p>${listado[libroDos].value}</p><p>${listado[libroTres].value}</p>`;
      }
    }

    Swal.fire({
      icon: 'info',
      title: 'Editorial:',
      html: `<p class="nombreAutor">${e.target.dataset.nombre}</p><br>
      ${textoHTML}`
    })
  }

});
//fin funciones


d.addEventListener('scroll', () => {
  let elemento = document.querySelector("#crear");
  elemento.classList.add("desaparecer")

  setTimeout(() => { elemento.classList.remove("desaparecer") }, 1000);
})