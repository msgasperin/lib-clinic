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
         <div class="col-md-3 col-sm-4 col-6">
            <strong>Familiar *</strong>
            <select name="tipoFamiliar" id="tipoFamiliar" class="form-select">
               <option value="NA">Seleccionar</option>
               <option value="Abuelo Paterno">Abuelo Paterno</option>
               <option value="Abuela Paterna">Abuela Paterna</option>
               <option value="Abuelo Materno">Abuelo Materno</option>
               <option value="Abuela Materna">Abuela Materna</option>
               <option value="Padre">Padre</option>
               <option value="Madre">Madre</option>
               <option value="Hijo (a)">Hijo (a)</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6">
            <strong>Padecimiento *</strong>
            <select name="padecimientoFamiliar" id="padecimientoFamiliar" class="form-select" onchgange="toggleOtroAntecedent(this.value);">
               <option value="NA">Seleccionar</option>
               <option value="Diabetes">Diabetes</option>
               <option value="Hipertensión">Hipertensión</option>
               <option value="Cardiopatía">Cardiopatía</option>
               <option value="Dislipidemia">Dislipidemia</option>
               <option value="Cáncer">Cáncer</option>
               <option value="Otro">Otro</option>
            </select>
         </div>
         <div class="col-md-4 col-sm-4 col-12">
            <strong>Otro</strong>
            <input type="text" name="otroPadecimientoFamiliar" id="otroPadecimientoFamiliar" class="form-control" maxlength="100" disabled>
         </div>
         <div class="col-md-2 col-sm-12 col-12">
            <br>
            <button type="button" class="btn btn-dark btn-lib w-100 btn-redondo" id="btnAgregarAntFamiliar" onclick="fn_agregar_antecedente_familiar(${idPaciente}, '${nomPaciente}', ${idDoctor}, '${nomDoctor}');">
               Agregar
            </button>
         </div>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 mt-4">
         <div id="listado_antecedentes_familiares"></div>
      </div>
   </div>`;
   $('#antecedente_heredo_familiar').html(html);
   $('#antecedente_heredo_familiar').show();

   $('#antecedente_no_patologico').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_cronico_degenerativo').hide();
   $('#antecedente_cardiovascular').hide();
   $('#antecedente_gineco_obstetrico').hide();

   $('#listado_antecedentes_familiares').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');
   setTimeout(() => {
      fn_obtiene_antecedente_familiares('listado_antecedentes_familiares', idPaciente, nomPaciente, idDoctor, nomDoctor);
   }, 500);
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
         <div class="col-md-3 col-sm-4 col-12">
            <div class="card shadow-sm">
               <div class="card-body">
                  <i class="bi bi-person-circle fs-4 text-muted"></i> 
                  <div class="fw-bold">${row.familiar}</div>
                  <div class="text-secondaty mt-2"><i class="bi bi-prescription2"></i> ${row.padecimiento}</div>
                  <div class="text-end">
                     <button class="btn btn-outline-danger btn-redondo btnEliminarAntFam" title="Eliminar" onclick="fn_eliminar_antecedente_familiar();">
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
   let padecimiento     = $('#padecimientoFamiliar').val();
   let otroPadecimiento = $('#otroPadecimientoFamiliar').val().trim();

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
   else if (padecimiento == 'NA') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un padecimiento',
         icon: 'warning'
      });
      $('#padecimientoFamiliar').focus();
      return;
   }   
   else if (padecimiento == 'Otro' && otroPadecimiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar otro padecimiento',
         icon: 'warning'
      });
      $('#otroPadecimientoFamiliar').focus();
      return;
   }  
     
   let objAntecedente = { func: 'agregar_antecedente_familiar', idPaciente, nomPaciente, idDoctor, nomDoctor, familiar, padecimiento, otroPadecimiento };

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
      $('#padecimientoFamiliar').val('NA');
      $('#tipoFamiliar').val('');
      fn_obtiene_antecedente_familiares('listado_antecedentes_familiares', idPaciente, nomPaciente, idDoctor, nomDoctor);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnAgregarAntFamiliar').prop('disabled', false);
      return;
   }
}

const fn_eliminar_antecedente_familiar = async (idPaciente, nomPaciente, nomDoctor, familiar, padecimiento) => {

   if (idCita == '' || nomPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }  
     
   let objAntecedente = { func: 'eliminar_antecedente_familiar', idPaciente, nomPaciente, nomDoctor, familiar, padecimiento };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El padecimiento: ' + padecimiento + ' será eliminado del expediente', 'question', 'Sí, eliminar', 'Cancelar');

   if (!res.result) {
      $('.btnEliminarAntFam').prop('disabled', false);
      return;
   }

   $('.btnEliminarAntFam').prop('disabled', true);
   let respuesta = await eliminar_antecedente_familiar(objAntecedente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      let index = arrCitas.findIndex(item => item.id_cita == idCita);   
      if (index !== -1) {
         arrCitas[index].estatus = 2;
      }

      let labelEstatus = 
      `<span class="badge rounded-pill text-success border border-success bg-success bg-opacity-10">
         Atendida
      </span>`;
      $('#label_estatus'+idCita).html(labelEstatus);
      $('.bloqAtendidaCita').remove();
      showMessageSwalTimer('Cita marcada como atendida correctamente!', '', 'success', 2500);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnEliminarAntFam').prop('disabled', false);
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

window.FormAntecedentesFamiliares       = FormAntecedentesFamiliares;
window. fn_agregar_antecedente_familiar = fn_agregar_antecedente_familiar;

