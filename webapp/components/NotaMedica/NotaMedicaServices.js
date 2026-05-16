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

export const subir_adjunto_nota = async (objArchivo) => {
   
   let respuesta;

   try {               
      respuesta = await postFormData('../api/controller/nota_medica.php', objArchivo);
   } catch (err) {
      respuesta = { estatus: 500, "mensaje": "Error del servidor: "+err, data: [] };
   }

   return respuesta;
};

export const obtiene_adjuntos_nota = async (idNota) => {
   const datos = { func: 'obtiene_adjuntos_nota', idNota };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/nota_medica.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const eliminar_adjunto_nota = async (id, nomArchivo, archivo, idNota, idCita) => {
   const datos = { func: 'eliminar_adjunto_nota', id, nomArchivo, archivo, idNota, idCita };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/nota_medica.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}