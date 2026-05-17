import { obtiene_antecedentes_familiares, agregar_antecedente_familiar, eliminar_antecedente_familiar } from "./AntFamiliaresServices.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ANTECEDENTES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let arrAntecedentesFamiliares = [];

const FormAntecedentesFamiliares = (idPaciente, nomPaciente, idDoctor, nomDoctor) => {
   let html = 
   `<div class="card p-3 border-0 shadow">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
           <i class="bi bi-people"></i> Antecedenes Heredo-Familiares
         </div>
         <div class="col-12 mt-2 fs-8">
            <div class="mb-2 fw-bold">¿Algún familiar con algún padecimiento?</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_biomasa" id="biomasa_si" autocomplete="off">
               <label class="btn btn-outline-danger fs-8" for="biomasa_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_biomasa" id="biomasa_no" autocomplete="off">
               <label class="btn btn-outline-secondary fs-8" for="biomasa_no">No</label>
            </div>            
         </div>
         <div class="col-12 mt-2">
            <textarea name="infoPadecimientoFamiliar" id="infoPadecimientoFamiliar" class="form-control fs-8" rows="5">Ingresa aquí la información adicional</textarea>
         </div>
         <div class="col-12 mt-3 text-end">
            <button type="button" class="btn btn-dark btn-lib fs-7 btn-redondo">
               Guardar
            </button>
         </div>
      </div>
   </div>`;
   $('#antecedente_heredo_familiar').html(html);
   $('#antecedente_heredo_familiar').show();

   $('#antecedente_no_patologico').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_cronico_degenerativo').hide();
   $('#antecedente_cardiovascular').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const fn_obtiene_antecedente_familiares = async (containerId, idPaciente, nomPaciente, idDoctor, nomDoctor) => {
   arrAntecedentesFamiliares = [];

   if(idPaciente == 0 || idDoctor == 0) {
      ToastColor.fire({
         text: '¡Atención! Faltan parámetros importantes, actualiza y vuelve a intentar',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }

   let objAntecedente = { func: 'obtiene_antecedentes_familiares', idPaciente, nomPaciente, idDoctor, nomDoctor };

   let respuesta = await obtiene_antecedentes_familiares(objAntecedente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      closeLoad();
      return;
   }
   else if(respuesta.data.length == 0) {
      let html = 
      `<div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">No se encontraron antecedentes familiares registrados</p>
      </div>`;
      $('#'+containerId).html(html);
   }
   else {
      arrAntecedentesFamiliares = await respuesta.data;
      pintar_antecedentes_familiares(containerId, arrAntecedentesFamiliares);
   }
}

const pintar_antecedentes_familiares = (containerId, data) => {

   const contenedor = document.getElementById(containerId);
   
   let html = `
   <div class="row">`;
      data.forEach(row => {
         html += `
         <div class="col-md-3 col-sm-4 col-12" id="cardAntFam${row.id_antecedente}">
            <div class="card shadow-sm">
               <div class="card-body">
                  <i class="bi bi-person-circle fs-4 text-muted"></i> 
                  <div class="fw-bold">${row.familiar}</div>
                  <div class="text-secondaty mt-2"><i class="bi bi-prescription2"></i> ${row.padecimiento}</div>
                  <div class="text-end">
                     <button class="btn btn-outline-danger btn-redondo btnEliminarAntFam" title="Eliminar" onclick="fn_eliminar_antecedente_familiar(${row.id_antecedente}, '${row.familiar}', '${row.padecimiento}', ${row.id_paciente_fk}, '${row.paciente_hist}');">
                        <i class="bi bi-trash"></i>
                     </button>
                  </div>
               </div>
            </div>
         </div>`;
      });
      html += `
   </div>`;

   contenedor.innerHTML = html;
}

const fn_agregar_antecedente_familiar = async (idPaciente, nomPaciente, idDoctor, nomDoctor) => {

   let familiar         = $('#tipoFamiliar').val();
   let padecimiento     = $('#padecimientoFamiliar').val().trim();

   if (idPaciente == 0 || idDoctor == 0) {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes',
         icon: 'warning'
      });
      return;
   }
   else if (familiar == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un familiar',
         icon: 'warning'
      });
      $('#tipoFamiliar').focus();
      return;
   }
   else if (padecimiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un padecimiento',
         icon: 'warning'
      });
      $('#padecimientoFamiliar').focus();
      return;
   }
     
   let objAntecedente = { func: 'agregar_antecedente_familiar', idPaciente, nomPaciente, idDoctor, nomDoctor, familiar, padecimiento };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El antecedente familiar: '+ padecimiento +' será agregado', 'question', 'Sí, agregar', 'Cancelar');

   if (!res.result) {
      $('#btnAgregarAntFamiliar').prop('disabled', false);
      return;
   }

   $('#btnAgregarAntFamiliar').prop('disabled', true);
   let respuesta = await agregar_antecedente_familiar(objAntecedente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Agregado!', '', 'success', 1500);
      $('#tipoFamiliar').val('NA');
      $('#padecimientoFamiliar').val('');
      fn_obtiene_antecedente_familiares('listado_antecedentes_familiares', idPaciente, nomPaciente, idDoctor, nomDoctor);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnAgregarAntFamiliar').prop('disabled', false);
      return;
   }
}

const fn_eliminar_antecedente_familiar = async (idAntecedente, familiar, padecimiento, idPaciente, paciente) => {

   if (idAntecedente == '' || familiar == '' || padecimiento == '' || paciente == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }  
     
   let objAntecedente = { func: 'eliminar_antecedente_familiar', idAntecedente, familiar, padecimiento, idPaciente, paciente };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El padecimiento: ' + padecimiento + ' será eliminado del expediente', 'question', 'Sí, eliminar', 'Cancelar');

   if (!res.result) {
      return;
   }

   let respuesta = await eliminar_antecedente_familiar(objAntecedente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      $('#cardAntFam'+idAntecedente).remove();
      showMessageSwalTimer('Cita marcada como atendida correctamente!', '', 'success', 2500);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

window.FormAntecedentesFamiliares       = FormAntecedentesFamiliares;
window.fn_agregar_antecedente_familiar  = fn_agregar_antecedente_familiar;
window.fn_eliminar_antecedente_familiar = fn_eliminar_antecedente_familiar;

