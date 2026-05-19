// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ANTECEDENTES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const fn_elige_modal_expediente = (idPaciente, nomPaciente, idDoctor, nomDoctor) => {
   
   let perfilUs = $('#perfilUs').val().trim();
   let idUserUs = $('#idUserUs').val().trim();
   let userUs   = $('#userUs').val().trim();

   if(perfilUs == 3 || idDoctor > 0) { // Doctor
      ModalFormExpClinico(idPaciente, nomPaciente, idUserUs, userUs);
   }
   else {
      ModalEligeExpedienteDoctor(idPaciente, nomPaciente);
   }
}

const ModalEligeExpedienteDoctor = (idPaciente, nomPaciente) => {
   let html = `
   <div class="modal fade" id="modalEligeExpedienteDoctor" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content border-0 shadow-lg rounded-4">
            
            <!-- Cuerpo del Modal -->
            <div class="modal-body p-5">
               <div class="text-center">
                  <!-- Icono de Estetoscopio o Usuario (Azul para procesos administrativos) -->
                  <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-10 p-4 mb-4">
                     <i class="bi bi-person-badge text-secondary fs-1"></i>
                  </div>
                  
                  <h3 class="fw-bold text-dark mb-2">Elige al Doctor</h3>
                  <p class="text-muted mb-4">
                     Selecciona al médico responsable para el paciente:<br>
                     <strong class="text-dark">${nomPaciente}</strong>
                  </p>
               </div>

               <!-- Selección de Doctor -->
               <div class="mb-4">
                  <label for="doctorExpediente" class="form-label small fw-bold text-secondary text-uppercase">Doctor Especialista</label>
                  <div class="input-group">
                     <span class="input-group-text bg-light border-2 border-end-0 text-secondary">
                        <i class="bi bi-search"></i>
                     </span>
                     <select id="doctorExpediente" class="form-select form-select-lg border-2 border-start-0 bg-light shadow-none">
                        <option value="" selected disabled>Seleccionar</option>
                     </select>
                  </div>
               </div>

               <!-- Acciones -->
               <div class="row g-3 mt-2">
                  <div class="col-12 col-sm-6 order-sm-2">
                     <button type="button" class="btn btn-dark btn-lib w-100 shadow-sm btn-redondo" onclick="fn_doctor_seleccionado_expediente(${idPaciente}, '${nomPaciente}');">
                        Seleccionar Doctor
                     </button>
                  </div>
                  <div class="col-12 col-sm-6 order-sm-1">
                     <button type="button" class="btn btn-link text-secondary w-100 text-decoration-none" data-bs-dismiss="modal">
                        Cancelar
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   </div>`;

   $('#modalAdmin').html(html);
   $('#modalEligeExpedienteDoctor').modal('show');
   setTimeout(() => {
      combo_doctores('doctorExpediente');
   }, 500);
}

const fn_doctor_seleccionado_expediente = (idPaciente, nomPaciente) => {
   
   let idDoctor    = $('#doctorExpediente').val();
   let docSelected = document.getElementById("doctorExpediente");
   let nomDoctor   = docSelected.options[docSelected.selectedIndex].text;

   if (idDoctor == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un doctor',
         icon: 'warning'
      });
      $('#doctorExpediente').focus();
      return;
   }

   $('#modalEligeExpedienteDoctor').modal('hide');
   ModalFormExpClinico(idPaciente, nomPaciente, idDoctor, nomDoctor);
}

const ModalFormExpClinico = (idPaciente, nomPaciente, idDoctor, nomDoctor) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormExpediente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary me-3 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="bi bi-person-fill fs-4"></i>
                    </div>
                    <div>
                        <h5 class="modal-title mb-0">Expediente Clínico</h5>
                        <small class="opacity-75">Paciente: Juan Pérez • 34 años • Veracruz, Ver.</small>
                    </div>
                </div>
               <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="mt-2">
               <div class="bg-light border-bottom sticky-top shadow-sm">
                  <ul class="nav nav-tabs-custom shadow-sm bg-white px-3" id="expedienteTab" role="tablist">
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 active text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesGenerales(${idPaciente}, '${nomPaciente}', ${idDoctor}, '${nomDoctor}');">
                           <i class="bi bi-people"></i> Generales
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesNoPatologicos();">
                           <i class="bi bi-person-walking me-1"></i>No Patológicos
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesPatologicos();">
                           <i class="bi bi-virus me-1"></i>Patológicos
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesGinecoObstetra();">
                           <i class="bi bi-gender-female me-1"></i> Gineco-Obstétrico
                        </button>
                     </li>
                  </ul>
               </div>
            </div>

            <div class="modal-body bg-light">
               <div id="antecedente_general" class="si-display"></div>
               <div id="antecedente_no_patologico" class="no-display"></div>
               <div id="antecedente_patologico" class="no-display"></div>
               <div id="antecedente_gineco_obstetrico" class="no-display"></div>
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
   $('#modalFormExpediente').modal('show');
   setTimeout(() => {
      FormAntecedentesGenerales(idPaciente, nomPaciente, idDoctor, nomDoctor);
   }, 100);
}

const ModalVerExpedientePdf = (key_query) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalVerExpedientePdf" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content sombra-modal">
            <div class="modal-body">
               <iframe src="reportes/expediente_clinico.php?key_query=${key_query}" width="100%" height="100%"></iframe>
            </div>
            <div class="modal-footer bg-light border-0" align="right">
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminDocs').html(html);
   $('#modalVerExpedientePdf').modal('show');
}

const fn_muestra_expediente = (key_query) => {
   let urlPDF = `reportes/expediente_clinico.php?key_query=${key_query}`;
   if(window.innerWidth <= 900){
      window.open(urlPDF, '_blank');
   }
   else{
      ModalVerExpedientePdf(key_query);
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.ModalEligeExpedienteDoctor        = ModalEligeExpedienteDoctor;
window.ModalFormExpClinico               = ModalFormExpClinico;
window.ModalVerExpedientePdf             = ModalVerExpedientePdf;

window.fn_muestra_expediente             = fn_muestra_expediente;
window.fn_elige_modal_expediente         = fn_elige_modal_expediente;
window.fn_doctor_seleccionado_expediente = fn_doctor_seleccionado_expediente;
