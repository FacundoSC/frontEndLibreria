export async function obtenerJson(url, options) {
  return await fetch(url, options).
    then(response => response.json()).
    catch(error => { console.error(error) })
}