import { postJSON, postFormData } from "../globals.js";   // ajusta ruta según tu proyecto


export const guardar_paciente = async (objPaciente) => {
   try {
      const respuesta = await postJSON('../api/controller/pacientes.php', objPaciente);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}

export const obtiene_pacientes = async () => {
   const datos = { func: 'obtiene_pacientes' };
   let respuesta;
   try {
      respuesta = await postJSON('../api/controller/pacientes.php', datos);
   } catch {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
   return respuesta;
}


export const eliminar_paciente = async (idPaciente, nomPaciente) => {
   const datos = { func: 'eliminar', idPaciente, nomPaciente };
   try {
      const respuesta = await postJSON('../api/controller/pacientes.php', datos);
      return respuesta;
   } catch (err) {
      respuesta = {estatus: 500, "mensaje": "Error del servidor", data: []};
   }
}

