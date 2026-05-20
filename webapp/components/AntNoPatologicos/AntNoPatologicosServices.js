import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto


export const guardar_antecedentes_no_patologicos = async (objAntecedente) => {
   try {
      const respuesta = await postJSON('../api/controller/ant_no_patologicos.php', objAntecedente);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}

export const obtiene_antecedentes_no_patologicos = async (idPaciente) => {
   
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/ant_no_patologicos.php', { func: 'obtiene_antecedentes_no_patologicos', idPaciente });
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

