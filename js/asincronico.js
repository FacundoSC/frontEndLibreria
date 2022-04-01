export async function obtenerJson(url, options) {
  let response = await obtenerResponse(url, options);

  if (response !== undefined) {
    let body = await response.json();

    let respuesta = {
      status: response.status,
      body,
    };

    return respuesta;
  }
}

async function obtenerResponse(url, options) {
  try {
    let response = await fetch(url, options);

    return response;
  } catch (e) {
    console.error(e);
  }
}