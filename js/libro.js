import { obtenerJson } from "./asincronico.js";
import { options, urlActivar, urlAutor,urlEditorial, urlDesactivar, urlLibro } from "./constantes.js";
//  import { buscaTabla, scroll } from "./funcionesGenerales.js";


const d = document,
  $table = d.querySelector(".table"),
  $template = d.getElementById("crud-templateLibro").content,
  $fragment = d.createDocumentFragment();

function obtenerLibros() {
    obtenerJson(urlLibro).then(libros => {
        console.table(libros)
      libros.forEach(libro => {
        //Creacion listado
      
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
        $template.querySelector(".ver").id = `ver_${libro.id}`;
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
};
d.addEventListener("DOMContentLoaded", obtenerLibros());
async function obtenerAutores() {
      return await   obtenerJson(urlAutor)
};
async function obtenerEditoriales() {
        return await   obtenerJson(urlEditorial)
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
};
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
};
function modificarLibro( id, options) {
   obtenerJson(urlLibro + id, options).then(response => {
    d.getElementById("titulo_" + id).innerHTML = response.titulo;
     d.getElementById("isbn_" + id).innerHTML = response.isbn;
     d.getElementById("ejemplaresRestantes_" + id).innerHTML = response.ejemplaresRestantes;
    let listadoBotones = d.getElementById(`editar_${id}`).parentElement;
     console.log(listadoBotones)
    listadoBotones.children[1].dataset.titulo = response.titulo;
    listadoBotones.children[2].dataset.titulo = response.titulo;
    listadoBotones.children[2].dataset.anio = response.anio;
    listadoBotones.children[2].dataset.isbn = response.isbn;
    listadoBotones.children[2].dataset.ejemplares = response.ejemplares;
    listadoBotones.children[2].dataset.ejemplaresPrestados = response.ejemplaresPrestados;
    listadoBotones.children[2].dataset.ejemplaresRestantes = response.ejemplaresRestantes;
   }).catch(error => console.error(error));
};
function crearLibro( options) {
  obtenerJson(urlLibro, options).then(response => {
    let id = response.id
    let titulo = response.titulo
    let alta = response.alta
    let isbn = response.isbn
    let anio = response.anio
    let ejemplares = response.ejemplares
    let ejemplaresRestantes = response.ejemplaresRestantes
    let ejemplaresPrestados= response.ejemplaresPrestados
    let autorNombre = response.autorNombre
    let editorialNombre = response.editorialNombre

   
    $template.querySelector(".titulo").textContent = titulo;
    $template.querySelector(".titulo").id = `titulo_`+id;
    $template.querySelector(".isbn").textContent = isbn;
    $template.querySelector(".isbn").id = `isbn_`+id;
    $template.querySelector(".ejemplaresRestantes").textContent = ejemplaresRestantes;
    $template.querySelector(".ejemplaresRestantes").id = `ejemplaresRestantes_`+id;
    $template.querySelector(".estado").textContent = alta;
    $template.querySelector(".estado").id = `estado_`+id;

      $template.querySelector(".editar").dataset.id = id;
      $template.querySelector(".editar").id = `editar_`+id;

        $template.querySelector(".ver").id = `ver_`+id;
        $template.querySelector(".ver").dataset.titulo = titulo;
        $template.querySelector(".ver").dataset.isbn = isbn;
        $template.querySelector(".ver").dataset.anio = anio;
        $template.querySelector(".ver").dataset.ejemplares = ejemplares;
        $template.querySelector(".ver").dataset.autorNombre = autorNombre;
        $template.querySelector(".ver").dataset.editorialNombre = editorialNombre;
        $template.querySelector(".ver").dataset.ejemplaresPrestados = ejemplaresPrestados;
        $template.querySelector(".ver").dataset.ejemplaresRestantes =   ejemplaresRestantes;

        $template.querySelector(".botonEstado").id = `botonEstado_`+id;
        $template.querySelector(".botonEstado").dataset.titulo = titulo;
        $template.querySelector(".botonEstado").dataset.id = id;
        $template.querySelector(".botonEstado").dataset.estado = alta;
        $template.querySelector(".botonEstado").classList.remove('btn-danger');
        $template.querySelector(".titulo").classList.remove('tachado');
        $template.querySelector(".estado").classList.remove('tachado');
        $template.querySelector(".botonEstado").classList.add('btn-success');
    
      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
      $table.querySelector("tbody").appendChild($fragment);
    
  }).catch(error => console.error(error));
};
d.addEventListener("click", async (e) => {
  if (e.target.matches(".crear")) {
    let selectorAutor = document.createElement('select')
    let selectorEditorial = document.createElement('select')
    selectorAutor.className="swal2-input";
    selectorEditorial.className="swal2-input";
    let listadoAutores = await obtenerAutores()
    let listadoEditoriales = await obtenerEditoriales()
  
    listadoAutores.forEach((autor) => {
      let elemento = document.createElement('option');
      elemento.textContent = autor.nombre;
      elemento.value=autor.id;
      elemento.className="swal2-input";
      elemento.id="autorId"
      selectorAutor.appendChild(elemento);
    });
    let selectAutor = selectorAutor.outerHTML
    listadoEditoriales.forEach((editorial) => {
      let elemento = document.createElement('option');
      elemento.textContent = editorial.nombre;
      elemento.value=editorial.id;
      elemento.className="swal2-input";
      elemento.id="editorialId"
      selectorEditorial.appendChild(elemento);
      });
      let selectEditorial = selectorEditorial.outerHTML
    
    Swal.fire({
      title: 'Crear Libro:',
      html: `
        <p>Titulo: <input id="titulo"  value= "" type="text" class="swal2-input" placeholder="Titulo Libro"></p>
        <p>Año: <input id="anio"  value= "" type="text"  class="swal2-input" placeholder="Año publicacion"></p>
        <p>ISBN: <input  id="isbn"  value= "" type="text"  class="swal2-input" placeholder="Isbn"></p>
        <p>Ejemplares: <input  id="ejemplares" value= "" type="text"  class="swal2-input" placeholder="Ejemplares Totales"></p>
        <p>Prestados: <input  id="ejemplaresPrestados" value= "" type="text"  class="swal2-input" placeholder="Ejemplares Prestados"></p>
        <p>En Stock: <input  id="ejemplaresRestantes" value= "" type="text"  class="swal2-input" placeholder="Ejemplares Restantes"></p>
        <p>Autor: ${selectAutor}</p>
        <p>Editorial: ${selectEditorial}</p>`
      ,
      showCancelButton: true,
      cancelButtonText: 'Cancelar ❌',
      confirmButtonText: 'Guardar 💾',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: () => {
        const titulo = Swal.getPopup().querySelector('#titulo').value
        const anio = Swal.getPopup().querySelector('#anio').value
        const isbn = Swal.getPopup().querySelector('#isbn').value
        const ejemplares = Swal.getPopup().querySelector('#ejemplares').value
        const autorId = Swal.getPopup().querySelector('#autorId').value
        const editorialId = Swal.getPopup().querySelector('#editorialId').value
        const ejemplaresPrestados = Swal.getPopup().querySelector('#ejemplaresPrestados').value
        const ejemplaresRestantes = Swal.getPopup().querySelector('#ejemplaresRestantes').value
        if (!titulo || !anio|| !isbn|| !ejemplares|| !autorId|| !editorialId) {
          Swal.showValidationMessage(`Todos los campos deben estar completos`)
        }
        return { titulo: titulo, isbn: isbn,anio: anio, ejemplares: ejemplares,autorId: autorId,editorialId: editorialId,ejemplaresRestantes:ejemplaresRestantes,ejemplaresPrestados:ejemplaresPrestados}
      }
    }).then((result) => {
       console.log(result)
        let titulo =result.value.titulo;
        let anio =result.value.anio;
        let isbn =result.value.isbn;
        let ejemplares =result.value.ejemplares;
        let autorId =result.value.autorId;
        let editorialId =result.value.editorialId;
        let ejemplaresRestantes =result.value.ejemplaresRestantes;
        let ejemplaresPrestados =result.value.ejemplaresPrestados;
        
        options.method = 'POST';
        options.body = JSON.stringify({ titulo ,anio, isbn, ejemplares, autorId,editorialId,ejemplaresRestantes,ejemplaresPrestados });
        console.log(options.body);
        crearLibro( options);
        Swal.fire(`Se ha creado exitosamente el libro: <b></b>!`, '', 'success')
      // // } else {
      // //   Swal.fire('Se ha cancelado la operación', '', 'warning')
      // }
    })
  }

  if (e.target.matches(".editar")) {
    const id = e.target.dataset.id;
    var libro = d.querySelector("#ver_"+id);
    let selectorAutor = document.createElement('select')
    let selectorEditorial = document.createElement('select')
    selectorAutor.className="swal2-input";
    selectorEditorial.className="swal2-input";
    let listadoAutores = await obtenerAutores()
    let listadoEditoriales = await obtenerEditoriales()
  
    listadoAutores.forEach((autor) => {
      let elemento = document.createElement('option');
      elemento.textContent = autor.nombre;
      elemento.value=autor.id;
      elemento.className="swal2-input";
      elemento.id="autorId"
      selectorAutor.appendChild(elemento);
    });
    let selectAutor = selectorAutor.outerHTML
    listadoEditoriales.forEach((editorial) => {
      let elemento = document.createElement('option');
      elemento.textContent = editorial.nombre;
      elemento.value=editorial.id;
      elemento.className="swal2-input";
      elemento.id="editorialId"
      selectorEditorial.appendChild(elemento);
      });
      let selectEditorial = selectorEditorial.outerHTML
    
    Swal.fire({
      title: 'Modificar Libro:',
      html: `
        <p>Titulo: <input id="titulo"  value= "${libro.dataset.titulo}" type="text" class="swal2-input" placeholder="Titulo Libro"></p>
        <p>Año: <input id="anio"  value= "${libro.dataset.anio}" type="text"  class="swal2-input" placeholder="Año publicacion"></p>
        <p>ISBN: <input  id="isbn"  value= "${libro.dataset.isbn}" type="text"  class="swal2-input" placeholder="Año publicacion"></p>
        <p>Ejemplares: <input  id="ejemplares" value= "${libro.dataset.ejemplares}" type="text"  class="swal2-input" placeholder="Año publicacion"></p>
         <input  id="ejemplaresPrestados" value= "${libro.dataset.ejemplaresPrestados}" type="hidden"  >
         <input  id="ejemplaresRestantes" value= "${libro.dataset.ejemplaresRestantes}" type="hidden"  >
        <p>Autor: ${selectAutor}</p>
        <p>Editorial: ${selectEditorial}</p>`
      ,
      allowEnterKey: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar ❌',
      confirmButtonText: 'Guardar 💾' ,
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: () => {
        const titulo = Swal.getPopup().querySelector('#titulo').value
        const anio = Swal.getPopup().querySelector('#anio').value
        const isbn = Swal.getPopup().querySelector('#isbn').value
        const ejemplares = Swal.getPopup().querySelector('#ejemplares').value
        const ejemplaresPrestados = Swal.getPopup().querySelector('#ejemplaresPrestados').value
        const ejemplaresRestantes = ejemplares - ejemplaresPrestados
        const autorId = Swal.getPopup().querySelector('#autorId').value
        const editorialId = Swal.getPopup().querySelector('#editorialId').value
        if (!titulo || !anio|| !isbn|| !ejemplares|| !autorId|| !editorialId) {
          Swal.showValidationMessage(`Todos los campos deben estar completos`)
        }
        return { titulo: titulo, isbn: isbn,anio: anio, ejemplaresRestantes:ejemplaresRestantes,ejemplaresPrestados:ejemplaresPrestados,ejemplares: ejemplares,autorId: autorId,editorialId: editorialId}
      }
    }).then((result) => {
       console.log(result)
        let titulo =result.value.titulo;
        let anio =result.value.anio;
        let isbn =result.value.isbn;
        let ejemplares =result.value.ejemplares;
        let autorId =result.value.autorId;
        let editorialId =result.value.editorialId;
        let ejemplaresPrestados=result.value.ejemplaresPrestados;
        let ejemplaresRestantes=result.value.ejemplaresRestantes;
        options.method = 'PUT';
        options.body = JSON.stringify({ titulo ,anio, isbn, ejemplares,ejemplaresPrestados,ejemplaresRestantes, autorId,editorialId});
        console.log(options.body);
        modificarLibro( id, options);
    })
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
      html: `<p class="swal2" >
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
};

d.addEventListener('scroll', () => {
  let elemento = document.querySelector("#crear");
  elemento.classList.add("desaparecer")

  setTimeout(() => { elemento.classList.remove("desaparecer") }, 1000);
});
