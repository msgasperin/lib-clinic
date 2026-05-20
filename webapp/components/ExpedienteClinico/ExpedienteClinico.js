// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ANTECEDENTES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let arrAntecedentesGenerales = [];
let arrAntNoPatologicos      = [];
let arrAntPatologicos        = [];
let arrAntGineco             = [];

const ModalFormExpClinico = (idPaciente, nomPaciente, sexo) => {
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
                        <small class="opacity-75">Paciente: ${nomPaciente}</small>
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
                        <button class="nav-link py-3 active text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesGenerales(${idPaciente}, '${nomPaciente}');">
                           <i class="bi bi-people"></i> Generales
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesNoPatologicos(${idPaciente}, '${nomPaciente}');">
                           <i class="bi bi-person-walking me-1"></i>No Patológicos
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesPatologicos(${idPaciente}, '${nomPaciente}');">
                           <i class="bi bi-virus me-1"></i>Patológicos
                        </button>
                     </li>`;
                     if(sexo == 'Mujer') {
                        html+=`
                        <li class="nav-item" role="presentation">
                           <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesGinecoObstetra(${idPaciente}, '${nomPaciente}');">
                              <i class="bi bi-gender-female me-1"></i> Gineco-Obstétrico
                           </button>
                        </li>`;
                     }
                     html+=`
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
      // Obtiene los antecedentes del paciente
      fn_obtiene_antecedentes(idPaciente, nomPaciente, sexo);      
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
window.ModalFormExpClinico      = ModalFormExpClinico;
window.ModalVerExpedientePdf    = ModalVerExpedientePdf;

window.fn_muestra_expediente    = fn_muestra_expediente;

window.arrAntecedentesGenerales = arrAntecedentesGenerales;
window.arrAntNoPatologicos      = arrAntNoPatologicos;
window.arrAntPatologicos        = arrAntPatologicos;
window.arrAntGineco             = arrAntGineco;