import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto

export const guardar_cita = async (objCita) => {
   try {
      const respuesta = await postJSON('../api/controller/citas.php', objCita);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}

export const obtiene_citas = async (fechaInicial, fechaFinal) => {
   const datos = { func: 'obtiene_citas', fechaInicial, fechaFinal };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/citas.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const cancelar_cita = async (idCita, nomPaciente, motivo) => {
   const datos = { func: 'cancelar_cita', idCita, nomPaciente, motivo };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/citas.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}

export const cita_atendida = async (idCita, nomPaciente) => {
   const datos = { func: 'cita_atendida', idCita, nomPaciente };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/citas.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}