import { obtiene_notas_medicas, guardar_nota_medica, eliminar_nota } from "./NotaMedicaServices.js";

let arrNotaMedica = [];

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ NOTA MÉDICA  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ModalListarNotaMedica = (idPaciente, nomPaciente, idDoctor, doctor, idCita) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalListarNotaMedica" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary me-3 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="bi bi-person-fill fs-4"></i>
                    </div>
                    <div>
                        <h5 class="modal-title mb-0">Nota Médica</h5>
                        <small class="opacity-75">Paciente: ${nomPaciente}</small>
                    </div>
                </div>
               <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>                        

            <div class="modal-body bg-light">`;
               if(parseInt(idDoctor) > 0 && parseInt(idCita) > 0) {
                  html+=`
                  <div class="row">
                     <div class="col-12 text-end">
                        <button class="btn btn-dark btn-lib btn-redondo fs-6" type="button" id="btnNuevaNotaMedica" onclick="ModalFormNotaMedica(${idPaciente}, '${nomPaciente}', ${idDoctor}, '${doctor}', ${idCita}, 0);">
                           <i class="bi bi-plus-lg"></i> Nueva nota médica
                        </button>
                     </div>
                  </div>`;
               }
               html+=`
               <div class="row">
                  <div class="col-12">
                     <div id="listado_notas_medicas"></div>
                  </div>
               </div>
            </div>                                              
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdmin').html(html);
   $('#modalListarNotaMedica').modal('show');
   $('#listado_notas_medicas').html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');
   setTimeout(() => {
      listar_notas_medicas('listado_notas_medicas',idPaciente, idDoctor);
   }, 500);
}

const listar_notas_medicas = async (containerId, idPaciente, idDoctor) => {
   arrNotaMedica = [];
   
   if(idPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! No se obtuvieron parámetros importantes',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      let html = 
      `<div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">No se encontraron notas médicas registradas</p>
      </div>`;
      $('#listado_notas_medicas').html(html);
      return;
   }

   let respuesta = await obtiene_notas_medicas(idPaciente, idDoctor);
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
         <p class="text-muted">No se encontraron notas médicas registradas</p>
      </div>`;
      $('#listado_notas_medicas').html(html);
   }
   else {
      arrNotaMedica = await respuesta.data;
      pintar_listado_notas_medicas(containerId, arrNotaMedica);
   }
}

const pintar_listado_notas_medicas = (containerId, data) => {
   const contenedor = document.getElementById(containerId);
   
   let html = `
   <div class="row mt-4">`;
      data.forEach(row => {
         html += `
         <div class="col-12 mt-2" id="cardNotMedica${row.id_nota_medica}">
            <div class="card border rounded-3 shadow-sm">
               <div class="card-body px-4 py-3">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                     <div>
                     <div class="mb-0 fw-semibold fs-7">${row.paciente}</div>
                     <small class="text-muted">Paciente</small>
                     </div>
                     <span class="badge text-bg-primary rounded-pill fw-normal"># ${row.id_cita_fk}</span>
                  </div>
                  <hr class="my-2">
                  <div class="row g-2">
                     <div class="col-5">
                        <p class="text-muted mb-1 text-uppercase fs-8">Doctor</p>
                        <p class="mb-0 small">
                           <i class="bi bi-person-badge me-1 text-secondary"></i>${row.doctor}
                        </p>
                     </div>
                     <div class="col-7">
                        <p class="text-muted mb-1 text-uppercase fs-8">Padecimiento</p>
                        <p class="mb-0 small">
                           <i class="bi bi-heart-pulse me-1 text-secondary"></i>${row.padecimiento}
                        </p>
                     </div>
                  </div>
                  <div class="row mt-2">
                     <div class="col-12 text-end">
                        <button type="button" class="btn btn-outline-secondary btnAccNotaMedica" title="Editar" onclick="ModalFormNotaMedica(${row.id_paciente_fk}, '${row.paciente}', ${row.id_doctor_fk}, '${row.doctor}', ${row.id_cita_fk}, ${row.id_nota_medica});">
                           <i class="bi bi-pencil-square"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger ms-1 btnAccNotaMedica" title="Eliminar" onclick="fn_eliminar_nota(${row.id_nota_medica}, ${row.id_cita_fk}, '${row.paciente}');">
                           <i class="bi bi-trash"></i>
                        </button>
                     </div>
                  </div>

               </div>
            </div>
         </div>`;
      });
      html += `
   </div>`;

   contenedor.innerHTML = html;
}

const ModalFormNotaMedica = (idPaciente, nomPaciente, idDoctor, doctor, idCita, idNota) => {  
   
   let text_boton             = '';
   let ta                     = '';
   let oxigenacion            = '';
   let temperatura            = '';
   let glucosa                = ''; 
   let fr                     = '';
   let fc                     = '';
   let peso                   = '';
   let estatura               = '';
   let padecimiento           = '';
   let exploracion            = '';
   let tratamiento            = '';
   let diagnostico_principal  = '';
   let diagnostico_secundario = '';
   let analisis_clinicos      = '';
   let estudios_gabinete      = '';
   let receta                 = '';

   if(idNota == 0) {
      text_boton = 'Registrar Nota Médica';
   }
   else {
      text_boton = 'Modificar Nota Médica';

      let notaSelected = arrNotaMedica.filter(nota => nota.id_nota_medica == idNota);

      ta                     = notaSelected[0].ta;
      oxigenacion            = notaSelected[0].oxigenacion;
      temperatura            = notaSelected[0].temperatura;
      glucosa                = notaSelected[0].glucosa; 
      fr                     = notaSelected[0].fr;
      fc                     = notaSelected[0].fc;
      peso                   = notaSelected[0].peso;
      estatura               = notaSelected[0].estatura;
      padecimiento           = notaSelected[0].padecimiento;
      exploracion            = notaSelected[0].exploracion;
      tratamiento            = notaSelected[0].tratamiento;
      diagnostico_principal  = notaSelected[0].diagnostico_principal;
      diagnostico_secundario = notaSelected[0].diagnostico_secundario;
      analisis_clinicos      = notaSelected[0].analisis_clinicos;
      estudios_gabinete      = notaSelected[0].estudios_gabinete;
      receta                 = notaSelected[0].receta;
   }

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormNotaMedica" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary me-3 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="bi bi-person-fill fs-4"></i>
                    </div>
                    <div>
                        <h5 class="modal-title mb-0">Nota Médica</h5>
                        <small class="opacity-75">Paciente: ${nomPaciente}}</small>
                    </div>
                </div>
               <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>                        

            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-12">
                     <div class="card p-3 border-0 shadow">
                        <div class="row">
                           <div class="col-12 fs-6 fw-bold">
                              Signos Vitales
                           </div>
                           <div class="col-md-1 col-sm-4 col-6 mt-3 fs-8">
                              <strong>T/A *</strong>
                              <input type="text" name="taMedica" id="taMedica" class="form-control" maxlength="10" value="${ta}" />
                           </div>
                           <div class="col-md-1 col-sm-4 col-6 mt-3 fs-8">
                              <strong>SpO2 % *</strong>
                              <input type="number" inputmode="numeric" name="spoMedica" id="spoMedica" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="3" value="${oxigenacion}" />
                           </div>
                           <div class="col-md-1 col-sm-4 col-6 mt-3 fs-8">
                              <strong>Temp. °C *</strong>
                              <input type="number" inputmode="numeric" name="tempMedica" id="tempMedica" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="5" value="${temperatura}" />
                           </div>
                           <div class="col-md-1 col-sm-4 col-6 mt-3 fs-8">
                              <strong>Glucosa (mg/dL)</strong>
                              <input type="number" inputmode="numeric" name="glucosaMedica" id="glucosaMedica" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4"value="${glucosa}" />
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3 fs-8">
                              <strong>FR (rpm) </strong>
                              <input type="number" inputmode="numeric" name="frMedica" id="frMedica" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="3" value="${fr}"/>
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3 fs-8">
                              <strong>FC (ltm) *</strong>
                              <input type="number" inputmode="numeric" name="fcMedica" id="fcMedica" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="3" value="${fc}"/>
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3 fs-8">
                              <strong>Peso (kg.) *</strong>
                              <input type="number" inputmode="decimal" name="pesoMedica" id="pesoMedica" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="5" value="${peso}"/>
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3 fs-8">
                              <strong>Estatura (cm.) *</strong>
                              <input type="number" inputmode="decimal" name="estaturaMedica" id="estaturaMedica" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="5" value="${estatura}"/>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="col-12 mt-5">
                     <nav>
                        <div class="nav nav-tabs" id="nav-revision-medica" role="tablist">
                           <button class="nav-link text-dark active" id="nav-padecimiento-tab" data-bs-toggle="tab" data-bs-target="#nav-padecimiento" type="button" role="tab" aria-controls="nav-padecimiento" aria-selected="true">
                              <i class="bi bi-virus2"></i> Padecimiento actual *
                           </button>
                           <button class="nav-link text-dark" id="nav-exploracion-tab" data-bs-toggle="tab" data-bs-target="#nav-exploracion" type="button" role="tab" aria-controls="nav-exploracion" aria-selected="false">
                              <i class="bi bi-person-arms-up"></i> Exploración física
                           </button>
                           <button class="nav-link text-dark" id="nav-plan-tab" data-bs-toggle="tab" data-bs-target="#nav-plan" type="button" role="tab" aria-controls="nav-plan" aria-selected="false">
                              <i class="bi bi-capsule"></i> Plan de manejo y tratamiento *
                           </button>
                           <button class="nav-link text-dark" id="nav-diagnostico-tab" data-bs-toggle="tab" data-bs-target="#nav-diagnostico" type="button" role="tab" aria-controls="nav-diagnostico" aria-selected="false">
                              <i class="bi bi-clipboard-check"></i> Diagnóstico principal *
                           </button>
                           <button class="nav-link text-dark" id="nav-secundario-tab" data-bs-toggle="tab" data-bs-target="#nav-secundario" type="button" role="tab" aria-controls="nav-secundario" aria-selected="false">
                              <i class="bi bi-clipboard-minus"></i> Diagnóstico secundario
                           </button>
                        </div>
                     </nav>
                     <div class="tab-content p-3 shadow-lg bg-white" id="nav-content-revision">        
                        <div class="tab-pane fade show active" id="nav-padecimiento" role="tabpanel" aria-labelledby="nav-padecimiento-tab">
                           <strong>Padecimiento actual *</strong>
                           <textarea name="padecimiento" id="padecimiento" class="form-control" rows="5" maxlength="500">${padecimiento}</textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-exploracion" role="tabpanel" aria-labelledby="nav-exploracion-tab">
                           <strong>Exploración física</strong>
                           <textarea name="exploracionFisica" id="exploracionFisica" class="form-control" rows="5" maxlength="500">${exploracion}</textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-plan" role="tabpanel" aria-labelledby="nav-plan-tab">
                           <strong>Plan de manejo y tratamiento *</strong>
                           <textarea name="tratamiento" id="tratamiento" class="form-control" rows="5" maxlength="500">${tratamiento}</textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-diagnostico" role="tabpanel" aria-labelledby="nav-diagnostico-tab">
                           <strong>Diagnóstico principal *</strong>
                           <textarea name="diagnosticoPrincipal" id="diagnosticoPrincipal" class="form-control" rows="5" maxlength="500">${diagnostico_principal}</textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-secundario" role="tabpanel" aria-labelledby="nav-secundario-tab">
                           <strong>Diagnóstico secundario</strong>
                           <textarea name="diagnosticoSecundario" id="diagnosticoSecundario" class="form-control" rows="5" maxlength="500">${diagnostico_secundario}</textarea>
                        </div>

                     </div>
                  </div>

                  <div class="col-12 mt-5">
                     <nav>
                        <div class="nav nav-tabs" id="nav-estudios" role="tablist">
                            <button class="nav-link text-dark active" id="nav-analisis-tab" data-bs-toggle="tab" data-bs-target="#nav-analisis" type="button" role="tab" aria-controls="nav-analisis" aria-selected="false">
                              <i class="bi bi-droplet"></i>Análisis Clínicos
                           </button>
                           <button class="nav-link text-dark" id="nav-gabinete-tab" data-bs-toggle="tab" data-bs-target="#nav-gabinete" type="button" role="tab" aria-controls="nav-gabinete" aria-selected="true">
                              <i class="bi bi-clipboard2-pulse"></i>Estudios de Gabinete
                           </button>
                        </div>
                     </nav>
                     <div class="tab-content p-3 shadow-lg bg-white" id="nav-content-estudios">        
                        <div class="tab-pane fade show active" id="nav-analisis" role="tabpanel" aria-labelledby="nav-analisis-tab">
                           <strong>Análisis Clínicos</strong>
                           <textarea name="analisisClinicos" id="analisisClinicos" class="form-control" rows="5" maxlength="500">${analisis_clinicos}</textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-gabinete" role="tabpanel" aria-labelledby="nav-gabinete-tab">
                           <strong>Estudios de Gabinete</strong>
                           <textarea name="estudiosGabinete" id="estudiosGabinete" class="form-control" rows="5" maxlength="500">${estudios_gabinete}</textarea>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="col-12 mt-5">
                  <nav>
                     <div class="nav nav-tabs" id="nav-receta-btn" role="tablist">
                           <button class="nav-link text-dark active fw-bold" id="nav-receta-tab" data-bs-toggle="tab" data-bs-target="#nav-receta" type="button" role="tab" aria-controls="nav-receta" aria-selected="false">
                           <i class="bi bi-prescription2"></i>Receta médica *
                        </button>
                     </div>
                  </nav>
                  <div class="tab-content p-3 shadow-lg bg-white" id="nav-content-estudios">        
                     <div class="tab-pane fade show active" id="nav-receta" role="tabpanel" aria-labelledby="nav-receta-tab">
                        <textarea name="recetaMedica" id="recetaMedica" class="form-control" rows="5" placeholder="Ingresa aquí la receta" maxlength="500">${receta}</textarea>
                     </div>
                  </div>
               </div>

               <div class="row mt-5">
                  <div class="col-12 col-sm-6 offset-sm-3 col-md-4 offset-md-4 col-lg-2 offset-lg-5 text-center">
                     <button type="button" class="btn btn-dark btn-lib btn-redondo w-100" id="btnGuardarNotaMedica" onclick="fn_guardar_nota_medica(${idPaciente}, '${nomPaciente}', ${idDoctor}, '${doctor}', ${idCita}, ${idNota});">
                        ${text_boton}
                     </button>
                  </div>
               </div>

            </div>                                                           
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt').html(html);
   $('#modalFormNotaMedica').modal('show');
}

const fn_guardar_nota_medica = async (idPaciente, nomPaciente, idDoctor, nomDoctor, idCita, idNota) => {

   let ta                    = $('#taMedica').val().trim();
   let oxigenacion           = $('#spoMedica').val().trim();
   let temperatura           = $('#tempMedica').val().trim();
   let glucosa               = $('#glucosaMedica').val().trim() || 0;
   let fr                    = $('#frMedica').val().trim() || 0;
   let fc                    = $('#fcMedica').val().trim();
   let peso                  = $('#pesoMedica').val().trim();
   let estatura              = $('#estaturaMedica').val().trim();
   let padecimiento          = $('#padecimiento').val().trim();
   let exploracion           = $('#exploracionFisica').val().trim();
   let tratamiento           = $('#tratamiento').val().trim();
   let diagnosticoPrincipal  = $('#diagnosticoPrincipal').val().trim();
   let diagnosticoSecundario = $('#diagnosticoSecundario').val().trim();
   let analisisClinicos      = $('#analisisClinicos').val().trim();
   let estudiosGabinete      = $('#estudiosGabinete').val().trim();
   let receta                = $('#recetaMedica').val().trim();

   if (idPaciente <= 0 || idDoctor <= 0 || idCita <= 0) {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes',
         icon: 'warning'
      });
      return;
   }
   else if (ta == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la presión arterial',
         icon: 'warning'
      });
      $('#taMedica').focus();
      return;
   }
   else if (oxigenacion == '' || oxigenacion <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la oxigenación del paciente',
         icon: 'warning'
      });
      $('#spoMedica').focus();
      return;
   }   
   else if (temperatura == '' || temperatura <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la temperatura del paciente',
         icon: 'warning'
      });
      $('#tempMedica').focus();
      return;
   } 
   else if (fc == '' || fc <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la frecuencia cardíaca del paciente',
         icon: 'warning'
      });
      $('#fcMedica').focus();
      return;
   }
   else if (peso == '' || peso <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un peso y este debe ser mayor a 0',
         icon: 'warning'
      });
      $('#pesoMedica').focus();
      return;
   }
   else if (estatura == '' || estatura <= 0) {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar la estatura del paciente y esta debe ser mayor a 0',
         icon: 'warning'
      });
      $('#estaturaMedica').focus();
      return;
   }
   else if (padecimiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un padecimiento al paciente',
         icon: 'warning'
      });
      $('#padecimiento').focus();
      return;
   }
   else if (tratamiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un tratamiento al paciente',
         icon: 'warning'
      });
      $('#tratamiento').focus();
      return;
   }
   else if (diagnosticoPrincipal == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un diagnóstico al paciente',
         icon: 'warning'
      });
      $('#diagnosticoPrincipal').focus();
      return;
   }
   else if (receta == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una receta al paciente',
         icon: 'warning'
      });
      $('#recetaMedica').focus();
      return;
   }
     
   let objNota = { func: 'guardar_nota_medica', idPaciente, nomPaciente, idDoctor, nomDoctor, idCita, idNota, ta, oxigenacion, temperatura, glucosa, fr, fc, peso, estatura, padecimiento, exploracion, tratamiento, diagnosticoPrincipal, diagnosticoSecundario, analisisClinicos, estudiosGabinete, receta };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La nota médica para: ' + nomPaciente + ' será registrada', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      $('#btnGuardarNotaMedica').prop('disabled', false);
      return;
   }

   $('#btnGuardarNotaMedica').prop('disabled', true);
   let respuesta = await guardar_nota_medica(objNota);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Nota médica guardada correctamente', '', 'success', 2500);
      $('#taMedica').val('');
      $('#spoMedica').val('');
      $('#tempMedica').val('');
      $('#glucosaMedica').val('');
      $('#frMedica').val('');
      $('#fcMedica').val('');
      $('#pesoMedica').val('');
      $('#estaturaMedica').val('');
      $('#padecimiento').val('');
      $('#exploracionFisica').val('');
      $('#tratamiento').val('');
      $('#diagnosticoPrincipal').val('');
      $('#diagnosticoSecundario').val('');
      $('#analisisClinicos').val('');
      $('#estudiosGabinete').val('');
      $('#receta').val('');
      $('#modalFormNotaMedica').modal('hide');
      listar_notas_medicas('listado_notas_medicas', idPaciente, idDoctor);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarNotaMedica').prop('disabled', false);
      return;
   }
}

const fn_eliminar_nota = async (idNota, idCita, nomPaciente) => {

   if (idNota <= 0 || idCita <= 0 || nomPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes',
         icon: 'warning'
      });
      return;
   }
        
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La nota médica del paciente: ' + nomPaciente + ' será eliminada', 'question', 'Sí, eliminar', 'Cancelar');

   if (!res.result) {
      $('.btnAccNotaMedica').prop('disabled', false);
      return;
   }

   $('.btnAccNotaMedica').prop('disabled', true);
   let respuesta = await eliminar_nota(idNota, idCita, nomPaciente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Nota médica eliminada correctamente', '', 'success', 2500);
      $('#cardNotMedica'+idCita).remove();
      $('.btnAccNotaMedica').prop('disabled', false);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnAccNotaMedica').prop('disabled', false);
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.ModalListarNotaMedica = ModalListarNotaMedica; 
window.ModalFormNotaMedica   = ModalFormNotaMedica;

window.fn_guardar_nota_medica = fn_guardar_nota_medica;
window.fn_eliminar_nota       = fn_eliminar_nota;



