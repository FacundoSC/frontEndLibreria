
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
  
  export const urlAutor = "https://libreria-rest.herokuapp.com/api/v1/autor/";
  export const urlDesactivarAutor = urlAutor + "desactivar/";
  export const urlActivarAutor = urlAutor + "activar/";

export const footerModalFormulario = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" id="updateAutor">Guardar</button>`;
export const footerModal = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
`;

