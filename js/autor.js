import {options, urlAutor ,activar ,desactivar,footerModal,footerModalFormulario} from "./constantes.js";
import {obtenerJson } from "./asincronico.js";


const d = document,
$table = d.querySelector(".table"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment(),
$myModal = new bootstrap.Modal(d.getElementById('exampleModal'), options);

 function obtenerAutor(url,index){
  obtenerJson(url+index).then(response => {
    console.log("*** aqui devuelvo uno");
    console.warn(response)});
}
function obtenerAutores(url){
obtenerJson(url).then(autores => {
  autores.forEach(autor => {
    $template.querySelector(".nombre").textContent = autor.nombre;
    $template.querySelector(".nombre").id = `nombre_${autor.id}`;
    $template.querySelector(".estado").textContent = autor.alta;
    $template.querySelector(".estado").id = `estado_${autor.id}`;

    $template.querySelector(".editar").dataset.id = `${autor.id}`;

    $template.querySelector(".ver").dataset.nombre = autor.nombre;
    $template.querySelector(".botonEstado").id = `botonEstado_${autor.id}`;
    $template.querySelector(".botonEstado").classList.remove('btn-success');
    $template.querySelector(".botonEstado").classList.remove('btn-danger');
    $template.querySelector(".botonEstado").dataset.id= autor.id;
    $template.querySelector(".botonEstado").dataset.estado = autor.alta;
    if(autor.alta){
      $template.querySelector(".botonEstado").classList.add('btn-danger');
      $template.querySelector(".botonEstado").textContent="Desactivar";
    }else{
      $template.querySelector(".botonEstado").classList.add('btn-success');
      $template.querySelector(".botonEstado").textContent="Activar";
    }
    let $clone = d.importNode($template, true);
    $fragment.appendChild($clone);
  });
  $table.querySelector("tbody").appendChild($fragment);
});
}

function activarAutor(url,index){
   obtenerJson(url+index).then(response => {
    { 
      d.querySelector(`#estado_${index}`).textContent = true;
      d.querySelector(`#botonEstado_${index}`).dataset.estado = true;
      d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-success");
      d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-danger");
      d.querySelector(`#botonEstado_${index}`).textContent="Desactivar";
      d.querySelector(".modal-body").innerHTML= `${response.message}`;
      $myModal.show();
    
 }});
}

 function desactivarAutor(url, index){
  obtenerJson(url+index).then(response => {
    { 
     d.querySelector(`#estado_${index}`).textContent = false;
     d.querySelector(`#botonEstado_${index}`).dataset.estado = false;
     d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-success");
     d.querySelector(`#botonEstado_${index}`).classList.toggle("btn-danger");
     d.querySelector(`#botonEstado_${index}`).textContent="Activar";
     d.querySelector(".modal-body").innerHTML= `${response.message}`;
     $myModal.show();
 }});
}

function crearAutor(url,options){
 obtenerJson(url,options).then(response => {
  d.querySelector(".modal-body").innerHTML= `se creo el Autor: ${response.nombre} `;
  d.querySelector(".modal-footer").innerHTML= footerModal;
  $myModal.show();
 }).catch(error=>console.error(error));
}

 function modificarAutor(url,id,options){
  obtenerJson(url+id,options).then(response => {
  d.getElementById("nombre_"+id).innerHTML=response.nombre;
  d.querySelector(".modal-body").innerHTML= `Autor: ${response.nombre} modificado`;
  d.querySelector(".modal-footer").innerHTML= footerModal;
  $myModal.show();
  }).catch(error=>console.error(error));
}



  d.addEventListener("DOMContentLoaded", obtenerAutores(urlAutor));

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
       desactivarAutor(urlAutor+desactivar,e.target.dataset.id);
      }else{
        activarAutor(urlAutor+activar,e.target.dataset.id);
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


 


