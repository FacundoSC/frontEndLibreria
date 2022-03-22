export const options = {
  method: "",
  body: "",
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
};

export const optionsGET = {
  method: "GET",
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
};

//export const urlAutor = "https://libreria-rest.herokuapp.com/api/v1/autor/";

export const urlAutor = "https://localhost:8080/api/v1/autor/";
export const urlActivar = "activar/";
export const urlDesactivar = "desactivar/";
//export const urlEditorial = "https://libreria-rest.herokuapp.com/api/v1/editorial/";

export const urlEditorial = "https://localhost:8080/api/v1/editorial/";

export const footerModalFormulario = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" id="saveAutor">Guardar</button>`;
export const footerModal = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;

//Libro

//export const urlLibro = "https://libreria-rest.herokuapp.com/api/v1/libro/";

export const urlLibro = "https://localhost:8080/api/v1/libro/";

