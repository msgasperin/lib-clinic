import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const guardar_nota_medica = async (objNota) => {
   try {
      const respuesta = await postJSON('../api/controller/nota_medica.php', objNota);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}

export const obtiene_notas_medicas = async (idPaciente, idDoctor, idCita, origen) => {
   const datos = { func: 'obtiene_notas_medicas', idPaciente, idDoctor, idCita, origen };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/nota_medica.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const eliminar_nota = async (idNota, idCita, nomPaciente) => {
   const datos = { func: 'eliminar_nota', idNota, idCita, nomPaciente };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/nota_medica.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}