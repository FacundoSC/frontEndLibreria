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
        selector.setAttribute("id", "select_" + editorial.id)
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
        $template.querySelector(".estado").textContent = "Activado";
        $template.querySelector(".botonEstado").classList.add('btn-success');
      } else {
        $template.querySelector(".estado").textContent = "Desactivado";
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
        crearEditorial(urlEditorial, options);
        Swal.fire(`Se ha creado exitosamente la editorial: <b>${nombre}</b>!`, '', 'success')
      } else {
        Swal.fire('Se ha cancelado la operación', '', 'warning')
      }
    })
  } //fin CREAR

  //Fin EDITAR
  if (e.target.matches(".editar")) {
    const id = e.target.dataset.id;
    const nombreViejo = document.getElementById("nombre_" + id).textContent;
    let nombre = nombreViejo;

      Swal.fire({
        title: 'Modificar nombre:',
        input: 'text',
        inputValue: nombreViejo,
        inputAttributes: {
          placeholder: "Indique nuevo nombre",
          autocapitalize: 'off'
        },
        allowEnterKey: true,
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
          nombre = result.value
          if(nombreViejo != nombre){
            options.method = 'PUT';
            options.body = JSON.stringify({ nombre });
            modificarEditorial(id, options);
            Swal.fire(`Se ha modificado el nombre de <b>${nombreViejo}</b> a <b>${nombre}</b>!`, '', 'success')
          } else{
              Swal.fire({
                icon: 'warning',
                title: 'ERROR:',
                html: `<p class="nombreAutor" style="font-size: 1.5rem;">No ha realizado modificaciones al nombre.</p>`
              })
          }
        } else {
          Swal.fire('Se ha cancelado la operación', '', 'warning')
        }
      })
    };
  //Fin EDITAR

  //Inicio cambio de estado
  if (e.target.matches(".botonEstado")) {
    Swal.fire({
      title: '¿Deseas cambiar el estado del autor?',
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
          estadoFinal = "Desactivado"   
          desactivarAutor(urlEditorial+urlDesactivar, btn.dataset.id);
        } else {
          estadoFinal = "Activado"  
          activarAutor(urlEditorial+urlActivar, btn.dataset.id);
        }
        Swal.fire(`El estado de la editorial <b>${btn.dataset.nombre}</b> ha sido modificado a <b>${estadoFinal}</b>.`, '', 'success')
      } else if (result.isDenied) {
        Swal.fire('No se han realizado cambios.', '', 'info')
      }
    });
  }
  //FIN cambio de estado

  //Inicio VER
  if (e.target.matches(".ver")) {
    let id = e.target.id.split("_")[1]
    let textoHTML = ''

    if (d.getElementById("asociados_" + id).firstChild.localName == "p") {
      textoHTML = `<p><b>Actualmente no posee libros asociados</b></p>`
    } else {
      let cantidadDeLibros = d.getElementById("asociados_" + id).firstChild.length
      let listado = d.getElementById("asociados_" + id).firstChild.children

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

    Swal.fire({
      icon: 'info',
      title: 'Editorial:',
      html: `<p class="nombreAutor">${e.target.dataset.nombre}</p><br>
      ${textoHTML}`
    })
  }
  //Fin VER

});
//fin funciones


d.addEventListener('scroll', () => {
  let elemento = document.querySelector("#crear");
  elemento.classList.add("desaparecer")

  setTimeout(() => { elemento.classList.remove("desaparecer") }, 1000);
})

///Función CREAR EDITORIAL
function crearEditorial(url, options) {
  obtenerJson(url, options).then(response => {
    let id = response.id
    let nombre = response.nombre
    let alta = response.alta

    $template.querySelector(".nombre").textContent = nombre;
    $template.querySelector(".nombre").id = `nombre_${id}`;
    $template.querySelector(".nombre").classList.remove('tachado');

    $template.querySelector(".estado").classList.remove('tachado');
    $template.querySelector(".estado").textContent = "Activado";
    $template.querySelector(".estado").id = `estado_${id}`;

    //logica para adicion de libros en select
    while ($template.querySelector(".asociados").firstChild) {
      $template.querySelector(".asociados").removeChild($template.querySelector(".asociados").firstChild);
    }

    let elemento = document.createElement('p')
    elemento.textContent = "NO EXISTEN LIBROS ASOCIADOS";
    $template.querySelector(".asociados").appendChild(elemento)
    $template.querySelector(".asociados").id=`asociados_${id}`
    
    $template.querySelector(".editar").dataset.id = `${id}`;
    $template.querySelector(".editar").id = `editar_${id}`; 

    $template.querySelector(".botonEstado").id = `botonEstado_${id}`;
    $template.querySelector(".botonEstado").dataset.nombre = nombre;
    $template.querySelector(".botonEstado").dataset.id = id;
    $template.querySelector(".botonEstado").dataset.estado = alta;
    $template.querySelector(".botonEstado").classList.remove('btn-danger');
    $template.querySelector(".botonEstado").classList.add('btn-success');

    $template.querySelector(".ver").dataset.nombre = nombre;
    $template.querySelector(".ver").id = `ver_${id}`;

    let $clone = d.importNode($template, true);
    $fragment.appendChild($clone);
    $table.querySelector("tbody").appendChild($fragment);

  }).catch(error => console.error(error));
}
//Fin CREAR EDITORIAL

//Función ACTIVAR
function activarAutor(url, index) {
  obtenerJson(url + index).then(response => {
    {
      let btn = d.querySelector("#botonEstado_"+index)
      btn.classList.remove("btn-danger")
      btn.classList.add("btn-success")
      btn.dataset.estado = "true";
      btn.parentElement.children[0].removeAttribute("disabled")
      btn.parentNode.parentNode.children[0].classList.remove("tachado")
      btn.parentNode.parentNode.children[1].classList.remove("tachado")
      d.getElementById("estado_" + index).innerHTML = "Activado";
    }
  });
}
//Fin ACTIVAR

//Función DESACTIVAR
function desactivarAutor(url, index) {
  obtenerJson(url + index).then(response => {
    {
      let btn = d.querySelector("#botonEstado_"+index)
      btn.classList.remove("btn-success")
      btn.classList.add("btn-danger")
      btn.dataset.estado = "false";
      btn.parentElement.children[0].setAttribute("disabled", '')
      btn.parentNode.parentNode.children[0].classList.add("tachado")
      btn.parentNode.parentNode.children[1].classList.add("tachado")
      d.getElementById("estado_" + index).innerHTML = "Desactivado";
    }
  });
}
//Fin DESACTIVAR

//Función EDITAR
function modificarEditorial(id, options) {
  obtenerJson(urlEditorial + id, options).then(response => {
    d.getElementById("nombre_" + id).innerHTML = response.nombre;
    let listadoBotones = d.getElementById(`editar_${id}`).parentElement;
    listadoBotones.children[1].dataset.nombre = response.nombre;
    listadoBotones.children[2].dataset.nombre = response.nombre;
  }).catch(error => console.error(error));
}
//Fin EDITAR

let searchInput = document.getElementById('buscar');
let table = document.getElementById("tabla").tBodies[0];
let texto

searchInput.addEventListener('keyup', buscaTabla);

function buscaTabla() {
  texto = searchInput.value.toLowerCase();
  var r = 0;
  let row
  while (row = table.rows[r++]) {
    if (row.children[0].innerText.toLowerCase().indexOf(texto) !== -1) {
      row.style.display = null;
    } else
      row.style.display = 'none';
  }
}