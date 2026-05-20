import { guardar_antecedentes_no_patologicos } from "./AntNoPatologicosServices.js";

const FormAntecedentesNoPatologicos = (idPaciente, nomPaciente) => {
   
   let habitat;
   let servicios;
   let viajes;
   let haceCuanto = '';
   let donde      = '';
   let fimicos;
   let actividad;
   let cual       = '';
   let horas      = '';

   if(arrAntNoPatologicos.length > 0) {
      habitat    = arrAntNoPatologicos[0].habitat;
      servicios  = arrAntNoPatologicos[0].servicios_basicos;
      viajes     = arrAntNoPatologicos[0].viajes_extranjero;
      haceCuanto = arrAntNoPatologicos[0].hace_cuanto;
      donde      = arrAntNoPatologicos[0].donde;
      fimicos    = arrAntNoPatologicos[0].fimicos;
      actividad  = arrAntNoPatologicos[0].actividad_fisica;
      cual       = arrAntNoPatologicos[0].cual;
      horas      = arrAntNoPatologicos[0].horas_semana;
   }

   let html = 
   `<div class="card p-3 border-0 shadow fs-8">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
            <i class="bi bi-person-walking me-1"></i>Antecedenes No Patológicos
         </div>

         <div class="col-md-2 col-sm-3 col-6 mt-3">
            <div class="mb-2 fw-bold">Hábitat *</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_habitat" id="habitat_urbano" autocomplete="off" value="1">
               <label class="btn btn-outline-secondary fs-8" for="habitat_urbano">Urbano</label>
               <input type="radio" class="btn-check fs-8" name="option_habitat" id="habitat_rural" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="habitat_rural">Rural</label>
            </div>            
         </div>

         <div class="col-md-2 col-sm-3 col-6 mt-3">
            <div class="mb-2 fw-bold">¿Cuénta con servicios básicos? *</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_servicios" id="servicios_si" autocomplete="off" value="1">
               <label class="btn btn-outline-success fs-8" for="servicios_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_servicios" id="servicios_no" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="servicios_no">No</label>
            </div>            
         </div>

         <div class="col-md-2 col-sm-3 col-6 mt-3">
            <div class="mb-2 fw-bold">¿Viajes en el extranjero? *</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_viajes" id="viajes_si" autocomplete="off" value="1">
               <label class="btn btn-outline-success fs-8" for="viajes_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_viajes" id="viajes_no" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="viajes_no">No</label>
            </div>            
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Hace cuánto</strong>
            <input type="text" name="tiempoViaje" id="tiempoViaje" class="form-control fs-8" maxlength="50" value="${haceCuanto}">
         </div>
         <div class="col-md-3 col-sm-4 col-12 mt-3">
            <strong>Dónde</strong>
            <input type="text" name="dondeViajo" id="dondeViajo" class="form-control fs-8" maxlength="100" value="${donde}">
         </div>

         <div class="col-md-2 col-sm-3 col-6 mt-3">
            <div class="mb-2 fw-bold">Fímicos *</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_fimicos" id="fimicos_si" autocomplete="off" value="1">
               <label class="btn btn-outline-danger fs-8" for="fimicos_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_fimicos" id="fimicos_no" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="fimicos_no">No</label>
            </div>            
         </div>

         <div class="col-md-2 col-sm-3 col-6 mt-3">
            <div class="mb-2 fw-bold">¿Actividad física? *</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_actividad" id="actividad_si" autocomplete="off" value="1">
               <label class="btn btn-outline-success fs-8" for="actividad_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_actividad" id="actividad_no" autocomplete="off" value="0">
               <label class="btn btn-outline-secondary fs-8" for="actividad_no">No</label>
            </div>            
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>¿Cuál?</strong>
            <input type="text" name="ejercicio" id="ejercicio" class="form-control fs-8" maxlength="100" value="${cual}">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Horas por semana</strong>
            <input type="text" name="horasEjercicio" id="horasEjercicio" class="form-control fs-8" maxlength="50" value="${horas}">
         </div>

         <div class="col-12 mt-3 text-end mt-2">
            <button type="button" class="btn btn-dark btn-lib btn-redondo fs-7" id="btnAntNoPatologicos" onclick="fn_guardar_antecedentes_no_patologicos(${idPaciente}, '${nomPaciente}');">
               Guardar
            </button>
         </div>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 mt-4">
         <div id="listado_antecedentes_familiares"></div>
      </div>
   </div>`;
   $('#antecedente_no_patologico').html(html);
   $('#antecedente_no_patologico').show();

   setTimeout(() => {
      $('input[name="option_habitat"][value="' + habitat + '"]').prop('checked', true);
      $('input[name="option_servicios"][value="' + servicios + '"]').prop('checked', true);
      $('input[name="option_viajes"][value="' + viajes + '"]').prop('checked', true);
      $('input[name="option_fimicos"][value="' + fimicos + '"]').prop('checked', true);
      $('input[name="option_actividad"][value="' + actividad + '"]').prop('checked', true);
   }, 100);

   $('#antecedente_general').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const fn_guardar_antecedentes_no_patologicos = async (idPaciente, nomPaciente) => {

   let habitat    = document.querySelector('input[name="option_habitat"]:checked')?.value;
   let servicios  = document.querySelector('input[name="option_servicios"]:checked')?.value;
   let viajes     = document.querySelector('input[name="option_viajes"]:checked')?.value;
   let haceCuanto = $('#tiempoViaje').val().trim();
   let donde      = $('#dondeViajo').val().trim();
   let fimicos    = document.querySelector('input[name="option_fimicos"]:checked')?.value;
   let actividad  = document.querySelector('input[name="option_actividad"]:checked')?.value;
   let ejercicio  = $('#ejercicio').val().trim();
   let horasEjer  = $('#horasEjercicio').val().trim();
      
   if (idPaciente == 0 || idPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes',
         icon: 'warning'
      });
      return;
   }
   else if (typeof(habitat) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar si el hábitat del paciente',
         icon: 'warning'
      });
      $('#habitat_urbano').focus();
      return;
   }
   else if (typeof(servicios) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar si el paciente cuenta con servicios básicos',
         icon: 'warning'
      });
      return;
   }
   else if (typeof(viajes) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar el paciente ha tenido viajes al extranjero',
         icon: 'warning'
      });
      return;
   }
   else if (typeof(fimicos) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar el valor de fímicos',
         icon: 'warning'
      });
      return;
   }
   else if (typeof(actividad) == 'undefined') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar si el paciente realiza actividad física',
         icon: 'warning'
      });
      return;
   }

   let objAntecedente = { func: 'guardar_antecedentes_no_patologicos', idPaciente, nomPaciente, habitat, servicios, viajes, haceCuanto, donde, fimicos, actividad, ejercicio, horasEjer };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los antecedentes no patológicos del paciente: '+ nomPaciente +' serán guardados', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      $('#btnAntNoPatologicos').prop('disabled', false);
      return;
   }

   $('#btnAntNoPatologicos').prop('disabled', true);
   let respuesta = await guardar_antecedentes_no_patologicos(objAntecedente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Guardado!', '', 'success', 1500);
      $('#btnAntNoPatologicos').prop('disabled', false);
      arrAntNoPatologicos = [];
      arrAntNoPatologicos = [{
         id_paciente_fk    : idPaciente,
         paciente_hist     : nomPaciente,
         habitat           : habitat,
         servicios_basicos : servicios,
         viajes_extranjero : viajes,
         hace_cuanto       : haceCuanto,
         donde             : donde,
         fimicos           : fimicos,
         actividad_fisica  : actividad,
         cual              : ejercicio,
         horas_semana      : horasEjer
      }];
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnAntNoPatologicos').prop('disabled', false);
      return;
   }
}

window.FormAntecedentesNoPatologicos          = FormAntecedentesNoPatologicos;
window.fn_guardar_antecedentes_no_patologicos = fn_guardar_antecedentes_no_patologicos;