import { options, urlAutor, urlDesactivarAutor, urlActivarAutor, footerModal,footerModalFormulario } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
$table = d.querySelector(".table"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment(),
$myModal = new bootstrap.Modal(d.getElementById('exampleModal'), options);

// function obtenerAutores() {
//   obtenerJson(urlAutor).then((autores) => {
//     autores.forEach((autor) => {

//       $template.querySelector(".name").textContent = autor.nombre;

//       $template.querySelector(".status").textContent = autor.alta;
//       $template.querySelector(".status").id = "status_" + autor.id;
//       $template.querySelector(".editar").dataset.nombre = autor.nombre;
//       $template.querySelector(".ver").dataset.nombre = autor.nombre;
//       $template.querySelector(".name").id = `nombre_${autor.id}`;

//       if (autor.alta === true) {
//         $template.querySelector(".estado").classList.remove("btn-danger")
//         $template.querySelector(".estado").classList.add("btn-success")
//         $template.querySelector(".name").classList.remove("tachado")
//         $template.querySelector(".status").classList.remove("tachado")
//         $template.querySelector(".editar").removeAttribute("disabled")
//       } else {
//         $template.querySelector(".estado").classList.remove("btn-success")
//         $template.querySelector(".estado").classList.add("btn-danger")
//         $template.querySelector(".name").classList.add("tachado")
//         $template.querySelector(".status").classList.add("tachado")
//         $template.querySelector(".editar").setAttribute("disabled", '')
//       }

//       $template.querySelector(".estado").dataset.estado = autor.alta;
//       $template.querySelector(".estado").dataset.nombre = autor.nombre;
//       $template.querySelector(".estado").dataset.id = autor.id;

//       let $clone = d.importNode($template, true);

//       $fragment.appendChild($clone);
//     });
//     $table.querySelector("tbody").appendChild($fragment);
//   });
// }

d.addEventListener("click", async (e) => {
  if (e.target.matches(".ver")) {
    Swal.fire({
      icon: 'info',
      title: 'Autor:',
      text: e.target.dataset.nombre,
    })
  }

  if (e.target.matches(".editar")) {
    d.querySelector(
      ".modal-body"
    ).innerHTML = `Autor: ${e.target.dataset.nombre}`;
    $myModal.show();
  }

  if (e.target.matches(".estado")) {
    Swal.fire({
      title: '¿Deseas cambiar el estado del autor?',
      showDenyButton: true,
      icon: 'warning',
      confirmButtonText: 'SI 😎',
      denyButtonText: `NOOOOOO 🙏`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        let btn = e.target;
        if (btn.dataset.estado == 'true') {
          desactivarAutor(btn.dataset.id);
          btn.classList.remove("btn-success")
          btn.classList.add("btn-danger")
          btn.dataset.estado = "false";
          btn.parentElement.children[0].setAttribute("disabled", '')
          btn.parentNode.parentNode.children[0].classList.add("tachado")
          btn.parentNode.parentNode.children[1].classList.add("tachado")
          d.getElementById("status_" + btn.dataset.id).innerHTML = "false";
        } else {
          activarAutor(btn.dataset.id);
          btn.classList.remove("btn-danger")
          btn.classList.add("btn-success")
          btn.dataset.estado = "true";
          btn.parentElement.children[0].removeAttribute("disabled")
          btn.parentNode.parentNode.children[0].classList.remove("tachado")
          btn.parentNode.parentNode.children[1].classList.remove("tachado")
          d.getElementById("status_" + btn.dataset.id).innerHTML = "true";
        }
        Swal.fire(`El estado del autor <b>${btn.dataset.nombre}</b> ha sido modificado a <b>${btn.dataset.estado}</b>.`, '', 'success')
      } else if (result.isDenied) {
        Swal.fire('No se han realizado cambios.', '', 'info')}});
  }})

function obtenerAutores(urlAutor){
obtenerJson(urlAutor).then(autores => {
  autores.forEach(autor => {

    $template.querySelector(".nombre").textContent = autor.nombre;
    $template.querySelector(".nombre").id = `nombre_${autor.id}`;
    $template.querySelector(".estado").textContent = autor.alta;
    $template.querySelector(".estado").id = `estado_${autor.id}`;
    $template.querySelector(".editar").dataset.id = `${autor.id}`;
    $template.querySelector(".editar").id = `editar_${autor.id}`;
    $template.querySelector(".ver").dataset.nombre = autor.nombre;
    $template.querySelector(".botonEstado").id = `botonEstado_${autor.id}`;
    $template.querySelector(".botonEstado").classList.remove('btn-success');
    $template.querySelector(".botonEstado").classList.remove('btn-danger');
    $template.querySelector(".nombre").classList.remove('tachado');
    $template.querySelector(".estado").classList.remove('tachado');
    $template.querySelector(".editar").removeAttribute("disabled")
    $template.querySelector(".botonEstado").dataset.id= autor.id;
    $template.querySelector(".botonEstado").dataset.estado = autor.alta;
    if(autor.alta){
      $template.querySelector(".botonEstado").classList.add('btn-success');
    }else{
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
}

function activarAutor(urlAutor,index){
   obtenerJson(urlAutor+index).then(response => {
    { 
      d.querySelector(`#estado_${index}`).textContent = true;
      d.querySelector(`#botonEstado_${index}`).dataset.estado = true;
      d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-success");
      d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-danger");
      d.querySelector(".modal-body").innerHTML= `${response.message}`;
      $myModal.show();

      d.querySelector(`#nombre_${index}`).classList.remove('tachado');
      d.querySelector(`#estado_${index}`).classList.remove('tachado');
      d.querySelector(`#editar_${index}`).removeAttribute("disabled");
 }});
}

 function desactivarAutor(urlAutor, index){
  obtenerJson(urlAutor+index).then(response => {
    { 
     d.querySelector(`#estado_${index}`).textContent = false;
     d.querySelector(`#botonEstado_${index}`).dataset.estado = false;
     d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-success");
     d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-danger");
     d.querySelector(".modal-body").innerHTML= `${response.message}`;
     $myModal.show();
     
     d.querySelector(`#nombre_${index}`).classList.add('tachado');
     d.querySelector(`#estado_${index}`).classList.add('tachado');
     d.querySelector(`#editar_${index}`).setAttribute("disabled", '')
 }});
}

function crearAutor(urlAutor,options){
 obtenerJson(urlAutor,options).then(response => {
  d.querySelector(".modal-body").innerHTML= `se creo el Autor: ${response.nombre} `;
  d.querySelector(".modal-footer").innerHTML= footerModal;
  $myModal.show();
 }).catch(error=>console.error(error));
}

 function modificarAutor(urlAutor,id,options){
  obtenerJson(urlAutor+id,options).then(response => {
  d.getElementById("nombre_"+id).innerHTML=response.nombre;
  d.querySelector(".modal-body").innerHTML= `Autor: ${response.nombre} modificado`;
  d.querySelector(".modal-footer").innerHTML= footerModal;
  $myModal.show();
  }).catch(error=>console.error(error));
}

  let autores = [];   

  d.addEventListener("DOMContentLoaded", obtenerAutores(urlAutor));

  d.addEventListener("DOMContentLoaded", function(){
    obtenerJson(urlAutor).then(autoresArray => {
        autores = autoresArray;
  })});

  d.addEventListener("click", async e => {
    
    if (e.target.matches(".crear")) {
      d.querySelector(".modal-body").innerHTML =`<form>
      <div class="mb-3">
      <label for="nombreAutor" class="col-form-label">Nombre Autor:</label>
     <input type="text" class="form-control" id="nombreAutor" value="">
     </div>
     </form>`;      
    d.querySelector(".modal-footer").innerHTML= footerModalFormulario;
    $myModal.show();
    d.querySelector("#saveAutor").addEventListener("click", (e)=>{
      let nombre = d.querySelector("#nombreAutor").value;
      e.preventDefault();
              $myModal.hide();
              options.method='POST';
              options.body = JSON.stringify({ nombre });
              crearAutor(urlAutor,options);
           });
   
    }
  
    if (e.target.matches(".editar")) { 
      const id = e.target.dataset.id;
      let nombre = document.getElementById("nombre_"+id).textContent;
      d.querySelector(".modal-body").innerHTML =`<form>
                 <div class="mb-3">
                 <label for="nombreAutor" class="col-form-label">Nombre Autor:</label>
                <input type="text" class="form-control" id="nombreAutor" value="${nombre}">
                </div>
            </form>`;       
     d.querySelector(".modal-footer").innerHTML= footerModalFormulario;
     $myModal.show();
     d.querySelector("#saveAutor").addEventListener("click", (e)=>{
       e.preventDefault();
               $myModal.hide();
               nombre = d.querySelector("#nombreAutor").value;
               options.method='PUT';
               options.body = JSON.stringify({ nombre });
               modificarAutor(urlAutor,id,options);

            });
    }
    if (e.target.matches(".botonEstado")) { 
      if(e.target.dataset.estado === "true"){
       desactivarAutor(urlAutor+urlDesactivarAutor,e.target.dataset.id);
      }else{
        activarAutor(urlAutor+urlActivarAutor,e.target.dataset.id);
      }  
      
      d.querySelector(".modal-footer").innerHTML= footerModal;
      $myModal.show();
    }
    if (e.target.matches(".ver")) { 
      d.querySelector(".modal-body").innerHTML= `Autor: ${e.target.dataset.nombre}`;
      d.querySelector(".modal-footer").innerHTML= footerModal;
      $myModal.show();
    
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
      // console.log(row.children[0]);
      if (row.children[0].innerText.toLowerCase().indexOf(texto) !== -1){
        row.style.display = null;
      }else
        row.style.display = 'none';
    }
  }


d.addEventListener('scroll', ()=>{
  let elemento =  document.querySelector("#crear");
  elemento.classList.add("desaparecer")

  setTimeout(()=>{elemento.classList.remove("desaparecer")}, 1000);
})
