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
export const urlActivarAutor = "activar/";
export const urlDesactivarAutor = "desactivar/";

export const urlLibro = "https://libreria-rest.herokuapp.com/api/v1/libro/";

export const urlCliente = "https://libreria-rest.herokuapp.com/api/v1/cliente/"

export const footerModalFormulario = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" id="saveAutor">Guardar</button>`;
export const footerModal = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
`;