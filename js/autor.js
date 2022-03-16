import { options, urlAutor, urlDesactivarAutor, urlActivarAutor, footerModal,footerModalFormulario } from "./constantes.js";
import { obtenerJson } from "./asincronico.js";

const d = document,
$table = d.querySelector(".table"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment(),
$myModal = new bootstrap.Modal(d.getElementById('exampleModal'), options);

 function obtenerAutor(urlAutor,index){
  obtenerJson(urlAutor+index).then(response => {
    console.log("*** aqui devuelvo uno");
    console.warn(response)});
}
function obtenerAutores(urlAutor){
obtenerJson(urlAutor).then(autores => {
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

function activarAutor(urlAutor,index){
   obtenerJson(urlAutor+index).then(response => {
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

 function desactivarAutor(urlAutor, index){
  obtenerJson(urlAutor+index).then(response => {
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
  });

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
        console.log(row.innerText.toLowerCase());
        row.style.display = null;
      }
      else
        row.style.display = 'none';
    }
  }
  
 
 });