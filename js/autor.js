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
   console.log("aqui se aplica la logica")
    alert(`se creo el autor ${response.nombre}`);
 }).catch(error=>console.error(error));
}
 function modificarAutor(url,options){
  obtenerJson(url,options).then(response => {
    console.log("aqui se aplica la logica")
     alert(`se modifico el autor ${response.nombre}`);
  }).catch(error=>console.error(error));
    //obtenerJson(url,options).then(response => console.log(response));
}
options.method='PUT';
options.body =JSON.stringify({
  nombre: "Gabriel Garcia Marquez"
});
//modificarAutor(urlAutor+55,options)
const form = document.querySelector("form");
form.addEventListener("submit", function(e){
  e.preventDefault();              
  const data = new FormData(e.target);
  const body = Object.fromEntries(data.entries());
  options.method='POST';
  options.body= JSON.stringify(body);
  crearAutor(urlAutor,options);
});


  d.addEventListener("DOMContentLoaded", obtenerAutores(urlAutor));

  d.addEventListener("click", async e => {
    if (e.target.matches(".ver")) { 
      d.querySelector(".modal-body").innerHTML= `Autor: ${e.target.dataset.nombre}`;
      d.querySelector(".modal-footer").innerHTML= footerModal;
      $myModal.show();
    
    }
    
    if (e.target.matches(".editar")) { 
      d.querySelector(".modal-body").innerHTML =`<form>
                 <div class="mb-3">
                 <label for="recipient-name" class="col-form-label">Recipient:</label>
                <input type="text" class="form-control" id="recipient-name">
                </div>
                <div class="mb-3">
              <label for="message-text" class="col-form-label">Message:</label>
              <textarea class="form-control" id="message-text"></textarea>
              </div>
            </form>`;

      d.querySelector(".modal-footer").innerHTML= footerModalFormulario;
      $myModal.show();
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

  /*
    if (e.target.matches(".delete")) {
      let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);

      if (isDelete) {
        //Delete - DELETE
        try {
          let options = {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8"
            }
          },
            res = await fetch(`http://localhost:5555/santos/${e.target.dataset.id}`, options),
            json = await res.json();

          if (!res.ok) throw { status: res.status, statusText: res.statusText };

          location.reload();
        } catch (err) {
          let message = err.statusText || "Ocurrió un error";
          alert(`Error ${err.status}: ${message}`);
        }
      }
    }*/





  })


 


