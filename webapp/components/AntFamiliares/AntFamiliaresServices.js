import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto


export const agregar_antecedente_familiar = async (objAntecedente) => {
   try {
      const respuesta = await postJSON('../api/controller/ant_familiar.php', objAntecedente);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}

export const obtiene_antecedentes_familiares = async (objAntecedente) => {
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/ant_familiar.php', objAntecedente);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}


export const eliminar_antecedente_familiar = async (objAntecedente) => {
   try {
      const respuesta = await postJSON('../api/controller/ant_familiar.php', objAntecedente);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}

