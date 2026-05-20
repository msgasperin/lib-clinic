import { obtiene_antecedentes_generales, guardar_antecedentes_generales } from "./AntGeneralesServices.js";
import { obtiene_antecedentes_no_patologicos } from "../AntNoPatologicos/AntNoPatologicosServices.js";
import { obtiene_antecedentes_patologicos } from "../AntPatologicos/AntPatologicosServices.js";
import { obtiene_antecedentes_ginecologicos } from "../AntGineco/AntGinecoServices.js";

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ANTECEDENTES GENERALES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const FormAntecedentesGenerales = (idPaciente, nomPaciente, idDoctor, nomDoctor) => {

   let ant_familiar;
   let info_ant_familiar          = '';
   let enfermedad_cronica;
   let info_enfermedad_cronica    = '';
   let enfermedad_cardiovascular;
   let info_enfermedad_cardio     = '';

   if(arrAntecedentesGenerales.length > 0) {
      ant_familiar              = arrAntecedentesGenerales[0].ant_familiar;
      info_ant_familiar         = arrAntecedentesGenerales[0].info_ant_familiar;
      enfermedad_cronica        = arrAntecedentesGenerales[0].enfermedad_cronica;
      info_enfermedad_cronica   = arrAntecedentesGenerales[0].info_enfermedad_cronica;
      enfermedad_cardiovascular = arrAntecedentesGenerales[0].enfermedad_cardiovascular;
      info_enfermedad_cardio    = arrAntecedentesGenerales[0].info_enfermedad_cardio;
   }

   let html = 
   `<div class="card p-3 border-0 shadow">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
           <i class="bi bi-people"></i> Antecedenes Heredo-Familiares
         </div>
         <div class="col-12 mt-2 fs-8">
            <div class="mb-2 fw-bold">¿Algún familiar con algún padecimiento?</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="ant_fam" id="ant_fam_si" autocomplete="off" value="1">
               <label class="btn btn-outline-danger fs-8" for="ant_fam_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="ant_fam" id="ant_fam_no" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="ant_fam_no">No</label>
            </div>            
         </div>
         <div class="col-12 mt-2">
            <textarea name="infoPadecimientoFamiliar" id="infoPadecimientoFamiliar" class="form-control fs-8" rows="5" maxlength="500" placeholder="Ingresa aquí la información adicional">${info_ant_familiar}</textarea>
         </div>
      </div>

      
      <div class="row mt-4">
         <div class="col-12 fs-6 fw-bold">
            <i class="bi bi-activity me-1"></i>Antecedentes Crónico No Transmisibles
         </div>
         <div class="col-12 mt-2 fs-8">
            <div class="mb-2 fw-bold">¿Tienes alguna enfermedad crónica no transmisible?</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_cronico" id="cronico_si" autocomplete="off" value="1">
               <label class="btn btn-outline-danger fs-8" for="cronico_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_cronico" id="cronico_no" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="cronico_no">No</label>
            </div>            
         </div>
         <div class="col-12 mt-2">
            <textarea name="infoCronica" id="infoCronica" class="form-control fs-8" rows="5" maxlength="500" placeholder="Ingresa aquí la información adicional">${info_enfermedad_cronica}</textarea>
         </div>
      </div>
      
      <div class="row mt-4">
         <div class="col-12 fs-6 fw-bold">
            <i class="bi bi-heart-pulse me-1"></i>Antecedentes Cardio-Nefro-Metabólicos
         </div>
         <div class="col-12 mt-2 fs-8">
            <div class="mb-2 fw-bold">¿Presentas alguna enfermedad Cardio-Nefro-Metabólica?</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_cardio" id="cardio_si" autocomplete="off" value="1">
               <label class="btn btn-outline-danger fs-8" for="cardio_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_cardio" id="cardio_no" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="cardio_no">No</label>
            </div>            
         </div>
         <div class="col-12 mt-2">
            <textarea name="infoCardio" id="infoCardio" class="form-control fs-8" rows="5" maxlength="500" placeholder="Ingresa aquí la información adicional">${info_enfermedad_cardio}</textarea>
         </div>
      </div>

      <div class="row mt-4">
         <div class="col-12 mt-3 text-end">
            <button type="button" class="btn btn-dark btn-lib fs-6 btn-redondo" id="btnAntGenerales" onclick="fn_guardar_antecedentes_generales(${idPaciente}, '${nomPaciente}', ${idDoctor}, '${nomDoctor}');">
               Guardar
            </button>
         </div>
      </div>
   </div>`;

   $('#antecedente_general').html(html);
   $('#antecedente_general').show();

   setTimeout(() => {
      $('input[name="ant_fam"][value="' + ant_familiar + '"]').prop('checked', true);
      $('input[name="option_cronico"][value="' + enfermedad_cronica + '"]').prop('checked', true);
      $('input[name="option_cardio"][value="' + enfermedad_cardiovascular + '"]').prop('checked', true);
   }, 100);

   $('#antecedente_no_patologico').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const fn_obtiene_antecedentes = async (idPaciente, nomPaciente, sexo) => {
   
   arrAntecedentesGenerales = [];

   if(idPaciente == 0) {
      ToastColor.fire({
         text: '¡Atención! Faltan parámetros importantes, actualiza y vuelve a intentar',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }

   let resAntGenerales      = await obtiene_antecedentes_generales(idPaciente);
   let resAntNoPatologicos  = await obtiene_antecedentes_no_patologicos(idPaciente);
   let resAntPatologicos    = await obtiene_antecedentes_patologicos(idPaciente); 

   arrAntecedentesGenerales = resAntGenerales.data;
   arrAntNoPatologicos      = resAntNoPatologicos.data;
   arrAntPatologicos        = resAntPatologicos.data;

   if(sexo == 'Mujer') {
      let resAntGineco         = await obtiene_antecedentes_ginecologicos(idPaciente);
      arrAntGineco             = resAntGineco.data;
   }   

   if(resAntGenerales.estatus == 403) {
      fnNoSesion();
   }
   else if(resAntGenerales.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', resAntGenerales.mensaje, 'error', 2500);
      return;
   }
   else {
      FormAntecedentesGenerales(idPaciente, nomPaciente);
   }
}

const fn_guardar_antecedentes_generales = async (idPaciente, nomPaciente) => {

   let antecedente_familiar = document.querySelector('input[name="ant_fam"]:checked')?.value;
   let infoFamiliar         = $('#infoPadecimientoFamiliar').val().trim();
   let antecedente_cronico  = document.querySelector('input[name="option_cronico"]:checked')?.value;
   let infoCronico          = $('#infoCronica').val().trim();
   let antecedente_cardio   = document.querySelector('input[name="option_cardio"]:checked')?.value;
   let infoCardio           = $('#infoCardio').val().trim();
      
   if (idPaciente == 0) {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes',
         icon: 'warning'
      });
      return;
   }
   else if (typeof(antecedente_familiar) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar si tiene algún familiar con antecedentes',
         icon: 'warning'
      });
      $('#cardio_no').focus();
      return;
   }
   else if (typeof(antecedente_cronico) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar si el paciente tiene algún padecimiento crónico no transmisible',
         icon: 'warning'
      });
      $('#cronico_no').focus();
      return;
   }
   else if (typeof(antecedente_cardio) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar si el paciente tiene algún padecimiento Cardio-Nefro-Metabólico',
         icon: 'warning'
      });
      $('#cardio_no').focus();
      return;
   }

   let objAntecedente = { func: 'guardar_antecedentes_generales', idPaciente, nomPaciente, antecedente_familiar, infoFamiliar, antecedente_cronico, infoCronico, antecedente_cardio, infoCardio };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los antecedentes generales del paciente: '+ nomPaciente +' serán guardados', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      $('#btnAntGenerales').prop('disabled', false);
      return;
   }

   $('#btnAntGenerales').prop('disabled', true);
   let respuesta = await guardar_antecedentes_generales(objAntecedente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Guardado!', '', 'success', 1500);
      $('#btnAntGenerales').prop('disabled', false);
      arrAntecedentesGenerales = [];
      arrAntecedentesGenerales = [{
         id_paciente_fk            : idPaciente,
         paciente_hist             : nomPaciente,
         ant_familiar              : antecedente_familiar,
         info_ant_familiar         : infoFamiliar,
         enfermedad_cronica        : antecedente_cronico,
         info_enfermedad_cronica   : infoCronico,
         enfermedad_cardiovascular : antecedente_cardio,
         info_enfermedad_cardio    : infoCardio
      }];
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnAntGenerales').prop('disabled', false);
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

window.FormAntecedentesGenerales         = FormAntecedentesGenerales;
window.fn_guardar_antecedentes_generales = fn_guardar_antecedentes_generales;
window.fn_obtiene_antecedentes           = fn_obtiene_antecedentes;

