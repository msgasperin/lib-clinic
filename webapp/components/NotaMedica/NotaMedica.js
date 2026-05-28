import { obtiene_notas_medicas, guardar_nota_medica, eliminar_nota, subir_adjunto_nota, obtiene_adjuntos_nota, eliminar_adjunto_nota } from "./NotaMedicaServices.js";

let arrNotaMedica = [];

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ NOTA MÉDICA  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const fn_buscar_nota = () => {
   let busqueda = $('#inpBusquedaNota').val().trim();

   const filtrado = arrNotaMedica.filter(nota => nota.fecha_cap_fil == busqueda);
   pintar_listado_notas_medicas('listado_notas_medicas', filtrado);
}

const ModalListarNotaMedica = (idPaciente, nomPaciente, edadPaciente, sexoPaciente, idDoctor, doctor, cedula, registroEspecial, idCita) => {

   let perfilUs = $('#perfilUs').val().trim();

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

            <div class="modal-body bg-light">
               <div class="row">
                  
                  <div class="col-4 col-md-4">
                     <div class="input-group">
                        <input type="date" name="inpBusquedaNota" id="inpBusquedaNota" class="form-control border-end-0" onchange="fn_buscar_nota();">
                     </div>
                  </div>
                  <div class="col-4 col-md-4">
                     <div class="input-group">
                        <button type="button" class="btn btn-outline-secondary fs-7 btn-redondo no-display" id="btnImprimirNotasMedicas" onclick="fn_imprimir_notas_medicas();">
                           <i class="bi bi-file-earmark-pdf text-danger"></i> Imprimir notas
                        </button>
                     </div>
                  </div>`;
                  if(parseInt(perfilUs) == 3 && parseInt(idCita) > 0) {
                     html+=`
                     <div class="col-4 col-md-4 text-end">
                        <button class="btn btn-dark btn-lib btn-redondo fs-6" type="button" id="btnNuevaNotaMedica" onclick="ModalFormNotaMedica(${idPaciente}, '${nomPaciente}', '${edadPaciente}', '${sexoPaciente}', ${idDoctor}, '${doctor}', '${cedula}', '${registroEspecial}', ${idCita}, 0);">
                           <i class="bi bi-plus-lg"></i> Nueva nota
                        </button>
                     </div>`;
                  }
                  html+=`
               </div>
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
   let txtMes       = '';
   let fecha        = '';
   let perfilUs     = $('#perfilUs').val().trim();
   let idUser       = $('#idUserUs').val().trim();
   let html         = '';
   
   if(data.length > 0) {
      $('#btnImprimirNotasMedicas').show();
      html = `
      <div class="row mt-4">`;
         data.forEach(row => {

            txtMes = arrayMeses[(parseInt(row.fecha_cap_format.split('-')[1])) - 1];
            fecha  = row.fecha_cap_format.split('-');
            fecha  = fecha[0]+' / '+txtMes+' / '+fecha[2];

            // Reiniciar variables por cada iteración
            let sol_holter      = '';
            let sol_mapa        = '';
            let sol_esfuerzo    = '';
            let botonCollapse   = '';
            let seccionCollapse = '';

            // Formateo de estudios solicitados en badges pequeños
            if(row.esfuerzo == 1) sol_esfuerzo = `<span class="badge bg-light shadow-sm text-dark border me-1 mb-1"><small>Prueba de esfuerzo</small></span>`;
            if(row.holter == 1)   sol_holter   = `<span class="badge bg-light shadow-sm text-dark border me-1 mb-1"><small>HOLTER</small></span>`;
            if(row.mapa == 1)     sol_mapa     = `<span class="badge bg-light shadow-sm text-dark border me-1 mb-1"><small>M.A.P.A</small></span>`;

            html += `
            <div class="col-12 mt-4" id="cardNotMedica${row.id_nota_medica}">
               <div class="card border rounded-3 shadow border-secondary border-0 border-start border-5">
                  <div class="card-body px-4 py-3">
                     <div class="row mb-2">
                        <div class="col-8">
                           <div class="mb-0 fw-semibold fs-7">${row.doctor}</div>
                           <small class="text-muted">Doctor</small>
                        </div>
                        <div class="col-4 text-end">
                           <div class="badge text-bg-primary rounded-pill fw-normal p-1">Nota # ${row.id_nota_medica}</div>
                           <div class="text-muted fs-8 mt-1">${fecha}</i></div>
                        </div>
                     </div>
                     <hr class="my-2">
                     <div class="row g-2">
                        <div class="col-12 col-sm-6">
                           <p class="text-muted mb-1 text-uppercase fs-8">Padecimiento</p>
                           <p class="mb-0 small">
                              <i class="bi bi-heart-pulse me-1 text-secondary"></i>${row.padecimiento}
                           </p>
                        </div>
                        <div class="col-12 col-sm-6">
                           <p class="text-muted mb-1 text-uppercase fs-8">Diagnóstico</p>
                           <p class="mb-0 small">
                              <i class="bi bi-clipboard2-pulse-fill me-1 text-secondary"></i>${row.diagnostico_principal}
                           </p>
                        </div>
                     </div>
                     <div class="d-flex align-items-start">
                        <div class="w-100">
                           <div class="mt-2">
                              ${sol_esfuerzo} ${sol_mapa} ${sol_holter}
                           </div>
                        </div>
                     </div>
                     <div class="row mt-2">
                        <div class="col-12 text-end">
                           <button type="button" class="btn btn-outline-secondary btnAccNotaMedica btn-redondo" title="Ver nota" onclick="fn_ver_nota_medica(${row.id_nota_medica});">
                              <i class="bi bi-file-earmark-pdf"></i>
                           </button>
                           <button type="button" class="btn btn-outline-secondary btnAccNotaMedica btn-redondo ms-1" title="Adjuntar" onclick="ModalFormSubirAdjuntoNota(${row.id_nota_medica}, ${row.id_cita_fk}, ${row.id_doctor_fk}, '${row.doctor}' ,'${row.paciente}', 2);">
                              <i class="bi bi-cloud-arrow-up"></i>
                           </button>`;

                           if(perfilUs == 3 && idUser == row.id_doctor_fk) {
                              html+=`
                              <button type="button" class="btn btn-outline-secondary btnAccNotaMedica btn-redondo ms-1" title="Editar" onclick="ModalFormNotaMedica(${row.id_paciente_fk}, '${row.paciente}', '${row.edad_hist}', '${row.sexo_hist}', ${row.id_doctor_fk}, '${row.doctor}', '${row.cedula_hist}', '${row.registro_especial_hist}', ${row.id_cita_fk}, ${row.id_nota_medica});">
                                 <i class="bi bi-pencil-square"></i>
                              </button>
                              <button type="button" class="btn btn-outline-danger ms-1 btnAccNotaMedica btn-redondo" title="Eliminar" onclick="fn_eliminar_nota(${row.id_nota_medica}, ${row.id_cita_fk}, '${row.paciente}');">
                                 <i class="bi bi-trash"></i>
                              </button>`;
                           }
                           html+=`
                        </div>
                     </div>

                  </div>
               </div>
            </div>`;
         });
         html += `
      </div>`;
   }
   else {
      $('#btnImprimirNotasMedicas').hide();
      html = 
      `<div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">No se encontraron notas médicas</p>
      </div>`;
   }
   contenedor.innerHTML = html;
}

const ModalFormNotaMedica = (idPaciente, nomPaciente, edad, sexo, idDoctor, doctor, cedula, registroEspecial, idCita, idNota) => {  
   
   let text_boton             = '';
   let ta                     = '';
   let oxigenacion            = '';
   let temperatura            = '';
   let glucosa                = ''; 
   let fr                     = '';
   let fc                     = '';
   let peso                   = '';
   let estatura               = '';
   let valoracion             = '';
   let padecimiento           = '';
   let res_analisis_gabinete  = '';
   let exploracion            = '';
   let tratamiento            = '';
   let diagnostico_principal  = '';
   let diagnostico_secundario = '';
   let analisis_clinicos      = '';
   let estudios_gabinete      = '';
   let pronostico             = '';
   let receta                 = '';
   let checkMapa              = '';
   let checkHolter            = '';
   let checkEsfuerzo          = '';

   if(idNota == 0) {
      text_boton = 'Registrar Nota';
   }
   else {
      text_boton = 'Modificar Nota';

      let notaSelected = arrNotaMedica.filter(nota => nota.id_nota_medica == idNota);

      ta                     = notaSelected[0].ta;
      oxigenacion            = notaSelected[0].oxigenacion;
      temperatura            = notaSelected[0].temperatura;
      glucosa                = notaSelected[0].glucosa; 
      fr                     = notaSelected[0].fr;
      fc                     = notaSelected[0].fc;
      peso                   = notaSelected[0].peso;
      estatura               = notaSelected[0].estatura;
      valoracion             = notaSelected[0].motivo_valoracion;
      padecimiento           = notaSelected[0].padecimiento;
      res_analisis_gabinete  = notaSelected[0].res_analisis_gabinete;
      exploracion            = notaSelected[0].exploracion;
      tratamiento            = notaSelected[0].tratamiento;
      diagnostico_principal  = notaSelected[0].diagnostico_principal;
      diagnostico_secundario = notaSelected[0].diagnostico_secundario;
      analisis_clinicos      = notaSelected[0].analisis_clinicos;
      estudios_gabinete      = notaSelected[0].estudios_gabinete;
      receta                 = notaSelected[0].receta;
      pronostico             = notaSelected[0].pronostico;

      notaSelected[0].mapa == 1 ? checkMapa = 'checked' : checkMapa;
      notaSelected[0].holter == 1 ? checkHolter = 'checked' : checkHolter;
      notaSelected[0].esfuerzo == 1 ? checkEsfuerzo = 'checked' : checkEsfuerzo;
   }

   let html = `
   <div class="modal fade" id="modalFormNotaMedica" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content border-0">
            
            <!-- Encabezado Clínico Principal -->
            <div class="modal-header modal-head-per py-3 border-0">
               <div class="row  w-100">
                  <div class="col-12 col-sm-8">
                     <div class="row">
                        <div class="col-12">
                           <h5 class="modal-title fw-bold mb-0">${text_boton}</h5>
                        </div>
                        <div class="col-12 col-sm-4 col-md-4">
                           <small class="text-white-50">
                              <i class="bi bi-person me-1"></i>Paciente: <strong class="text-white">${nomPaciente}</strong> 
                              <span class="mx-2">|</span>
                           </small>
                        </div>
                        <div class="col-12 col-sm-4 col-md-4">
                           <small class="text-white-50">
                              <i class="bi bi-person-md me-1"></i>Médico: <span class="text-white">${doctor}</span>
                           </small>
                        </div>
                     </div>
                  </div>
               </div>
            </div>                    

            <div class="modal-body bg-light p-4">
               <form id="formNotaMedica" autocomplete="off">
                  
                  <!-- BLOQUE INTEGRAL DE SIGNOS VITALES -->
                  <div class="card border-0 shadow-sm rounded-3 mb-4">
                     <div class="card-body p-3 bg-white">
                        <div class="d-flex align-items-center mb-3">
                           <i class="bi bi-heart-pulse text-danger me-2 fs-5"></i>
                           <h6 class="text-dark fw-bold m-0 fs-6">Signos Vitales y Somatometría</h6>
                        </div>
                        
                        <div class="row g-3">
                           <div class="col-6 col-sm-4 col-md-3 col-xl-1">
                              <label for="taMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">T/A <span class="text-danger">*</span></label>
                              <input type="text" name="taMedica" id="taMedica" class="form-control form-control-sm text-center fw-bold" placeholder="00/00" maxlength="10" value="${ta}" required />
                           </div>
                           <div class="col-6 col-sm-4 col-md-3 col-xl-1">
                              <label for="spoMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">SpO2 % <span class="text-danger">*</span></label>
                              <input type="number" inputmode="numeric" name="spoMedica" id="spoMedica" class="form-control form-control-sm text-center fw-bold" placeholder="00" maxlength="3" value="${oxigenacion}" required />
                           </div>
                           <div class="col-6 col-sm-4 col-md-3 col-xl-1">
                              <label for="tempMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">Temp. °C <span class="text-danger">*</span></label>
                              <input type="number" step="0.1" inputmode="decimal" name="tempMedica" id="tempMedica" class="form-control form-control-sm text-center fw-bold" placeholder="00.0" maxlength="5" value="${temperatura}" required />
                           </div>
                           <div class="col-6 col-sm-4 col-md-3 col-xl-2">
                              <label for="glucosaMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">Glucosa (mg/dL)</label>
                              <input type="number" inputmode="numeric" name="glucosaMedica" id="glucosaMedica" class="form-control form-control-sm text-center" placeholder="00" maxlength="4" value="${glucosa}" />
                           </div>
                           <div class="col-6 col-sm-4 col-md-3 col-xl-1">
                              <label for="frMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">FR (rpm)</label>
                              <input type="number" inputmode="numeric" name="frMedica" id="frMedica" class="form-control form-control-sm text-center" placeholder="00" maxlength="3" value="${fr}"/>
                           </div>
                           <div class="col-6 col-sm-4 col-md-3 col-xl-1">
                              <label for="fcMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">FC (lpm) <span class="text-danger">*</span></label>
                              <input type="number" inputmode="numeric" name="fcMedica" id="fcMedica" class="form-control form-control-sm text-center fw-bold" placeholder="00" maxlength="3" value="${fc}" required />
                           </div>
                           <div class="col-6 col-sm-4 col-md-3 col-xl-2">
                              <label for="pesoMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">Peso (kg.) <span class="text-danger">*</span></label>
                              <input type="number" step="0.1" inputmode="decimal" name="pesoMedica" id="pesoMedica" class="form-control form-control-sm text-center fw-bold" placeholder="0.00" maxlength="5" value="${peso}" required />
                           </div>
                           <div class="col-6 col-sm-4 col-md-3 col-xl-2">
                              <label for="estaturaMedica" class="form-label fw-semibold text-secondary mb-1 fs-8">Estatura (cm.) <span class="text-danger">*</span></label>
                              <input type="number" inputmode="numeric" name="estaturaMedica" id="estaturaMedica" class="form-control form-control-sm text-center fw-bold" placeholder="000" maxlength="5" value="${estatura}" required />
                           </div>
                        </div>

                     </div>
                  </div>

                  <!-- COLUMNAS DE TRABAJO EN PARALELO (UX CLÍNICA EFICIENTE) -->
                  <div class="row g-4">
                     
                     <!-- COLUMNA IZQUIERDA: DIAGNÓSTICO Y EVOLUCIÓN -->
                     <div class="col-lg-6">
                        <div class="card border-0 shadow rounded-3 h-100">
                           <div class="card-body p-4">
                              
                              <div class="d-flex align-items-center mb-3 text-success">
                                 <i class="bi bi-clipboard2-pulse me-2 fs-5"></i>
                                 <h6 class="fw-bold text-dark m-0">Evolución y Diagnósticos</h6>
                              </div>

                              <div class="mb-3">
                                 <label for="motivo_valoracion" class="form-label fw-bold text-secondary mb-1 fs-7">
                                 <i class="bi bi-journal-plus me-1"></i>Motivo de Valoración <span class="text-danger">*</span></label>
                                 <textarea name="motivoValoracion" id="motivoValoracion" class="form-control border-secondary border-opacity-25 fs-8" rows="4" maxlength="500" placeholder="Describa los motivos de la visita..." required>${valoracion}</textarea>
                              </div>

                              <div class="mb-3">
                                 <label for="padecimiento" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-virus2 me-1"></i>Padecimiento Actual <span class="text-danger">*</span></label>
                                 <textarea name="padecimiento" id="padecimiento" class="form-control border-secondary border-opacity-25 fs-8" rows="4" maxlength="500" placeholder="Describa los síntomas y estado actual del paciente..." required>${padecimiento}</textarea>
                              </div>
                              

                              <div class="mb-3">
                                 <label for="resultado_analisis_gabinete" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-moisture me-1"></i>Resultados análisis / gabinete</label>
                                 <textarea name="resAnalisisGabinete" id="resAnalisisGabinete" class="form-control border-secondary border-opacity-25 fs-8" rows="3" maxlength="500" placeholder="Resultados obtenidos de estudios realizados...">${res_analisis_gabinete}</textarea>
                              </div>

                              <div class="mb-3">
                                 <label for="exploracionFisica" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-person-arms-up me-1"></i>Exploración Física</label>
                                 <textarea name="exploracionFisica" id="exploracionFisica" class="form-control border-secondary border-opacity-25 fs-8" rows="3" maxlength="500" placeholder="Hallazgos de la exploración médica general o segmental...">${exploracion}</textarea>
                              </div>

                              <div class="mb-4">
                                 <label for="diagnosticoPrincipal" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-clipboard-check-fill text-success me-1"></i>Diagnóstico Principal <span class="text-danger">*</span></label>
                                 <textarea name="diagnosticoPrincipal" id="diagnosticoPrincipal" class="form-control border-success border-opacity-50 bg-success bg-opacity-10 text-dark fw-medium fs-8" rows="5" maxlength="500" placeholder="Diagnóstico primario confirmado o presuntivo..." required>${diagnostico_principal}</textarea>
                              </div>

                              <div class="mb-0">
                                 <label for="diagnosticoSecundario" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-clipboard-minus me-1"></i>Diagnóstico Secundario / Comorbilidades</label>
                                 <textarea name="diagnosticoSecundario" id="diagnosticoSecundario" class="form-control border-secondary border-opacity-25 fs-8" rows="2" maxlength="500" placeholder="Otros diagnósticos o condiciones adicionales...">${diagnostico_secundario}</textarea>
                              </div>

                           </div>
                        </div>
                     </div>

                     <!-- COLUMNA DERECHA: PLAN, ESTUDIOS Y RECETA -->
                     <div class="col-lg-6">
                        <div class="card border-0 shadow-sm rounded-3 h-100">
                           <div class="card-body p-4 d-flex flex-column">
                              
                              <div class="d-flex align-items-center mb-3 text-success">
                                 <i class="bi bi-prescription2 me-2 fs-5"></i>
                                 <h6 class="fw-bold text-dark m-0">Tratamiento y Plan de Acción</h6>
                              </div>

                              <div class="mb-3">
                                 <label for="tratamiento" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-capsule me-1"></i>Plan de Manejo y Tratamiento General <span class="text-danger">*</span></label>
                                 <textarea name="tratamiento" id="tratamiento" class="form-control border-secondary border-opacity-25 fs-8" rows="3" maxlength="500" placeholder="Indicaciones generales, dieta, recomendaciones..." required>${tratamiento}</textarea>
                              </div>

                              <div class="row g-3 mb-3">
                                 <div class="col-md-6">
                                    <label for="analisisClinicos" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-droplet me-1"></i>Análisis Clínicos Solicitados</label>
                                    <textarea name="analisisClinicos" id="analisisClinicos" class="form-control border-secondary border-opacity-25 fs-8" rows="3" maxlength="500" placeholder="Laboratorios (Biometría, Química, etc.)">${analisis_clinicos}</textarea>
                                 </div>
                                 <div class="col-md-6">
                                    <label for="estudiosGabinete" class="form-label fw-bold text-secondary mb-1 fs-7"><i class="bi bi-clipboard2-pulse me-1"></i>Estudios de Gabinete</label>
                                    <textarea name="estudiosGabinete" id="estudiosGabinete" class="form-control border-secondary border-opacity-25 fs-8" rows="3" maxlength="500" placeholder="Rayos X, Ultrasonido, TAC, etc.">${estudios_gabinete}</textarea>
                                 </div>
                              </div>

                              <!-- NUEVO ROW: ESTUDIOS ESPECIALES REQUERIDOS -->
                              <div class="row g-3 mb-3">
                                 <div class="col-12">
                                    <label class="form-label fw-bold text-secondary mb-2 fs-7"><i class="bi bi-plus-circle me-1"></i>Estudios Especiales a Solicitar</label>
                                    
                                    <div class="bg-light p-3 rounded-3 border d-flex flex-wrap gap-4 align-items-center justify-content-start">
                                       
                                       <div class="form-check form-switch m-0 fs-8">
                                          <input class="form-check-input" type="checkbox" role="switch" name="holterNota" id="holterNota" value="1" ${checkHolter}>
                                          <label class="form-check-label text-dark fw-medium" for="holterNota">Monitoreo HOLTER</label>
                                       </div>

                                       <div class="form-check form-switch m-0 fs-8">
                                          <input class="form-check-input" type="checkbox" role="switch" name="mapaNota" id="mapaNota" value="1" ${checkMapa}>
                                          <label class="form-check-label text-dark fw-medium" for="mapaNota">M.A.P.A.</label>
                                       </div>

                                       <div class="form-check form-switch m-0 fs-8">
                                          <input class="form-check-input" type="checkbox" role="switch" name="esfuerzoNota" id="esfuerzoNota" value="1" ${checkEsfuerzo}>
                                          <label class="form-check-label text-dark fw-medium" for="esfuerzoNota">Prueba de Esfuerzo</label>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div class="mt-auto">
                                 <label for="pronostico" class="form-label fw-bold text-dark mb-1 fs-7"><i class="bi bi-body-text me-1"></i>Pronóstico <span class="text-danger">*</span></label>
                                 <textarea name="pronostico" id="pronostico" class="form-control border-success border-opacity-50 p-3 bg-light fw-medium fs-8" rows="4" placeholder="Conclusión de la consulta médica" maxlength="500" required>${pronostico}</textarea>
                              </div>

                              <div class="mt-3">
                                 <label for="recetaMedica" class="form-label fw-bold text-dark mb-1 fs-7"><i class="bi bi-printer me-1"></i>Especificación de Receta Médica <span class="text-danger">*</span></label>
                                 <textarea name="recetaMedica" id="recetaMedica" class="form-control border-primary border-opacity-50 p-3 bg-light fw-medium fs-8" rows="4" placeholder="Medicamento - Dosis - Frecuencia - Duración&#10;Ejemplo: Paracetamol 500mg, 1 tab cada 8 horas por 5 días." maxlength="500" required>${receta}</textarea>
                              </div>`;

                              if(idNota > 0) {
                                 html+=`
                                 <div class="shadow border-1 border-secondary rounded-3 mt-3 p-3">
                                    <div class="row">
                                       <div class="col-12">
                                          <div class="text-dark fw-bold m-0 fs-7">
                                             <i class="bi bi-folder"></i> Expediente Digital
                                          </div>
                                       </div>
                                       <div class="col-7">
                                          <input type="text" name="nomAdjuntoNota" id="nomAdjuntoNota" class="form-control fs-8" placeholder="Nombre del documento" maxlength="50">
                                       </div>
                                       <div class="col-3">
                                          <input type="file" name="adjuntoNota" id="adjuntoNota" class="form-control fs-8" accept=".pdf">
                                       </div>
                                       <div class="col-2" align="right">
                                          <button type="button" id="btnAdjuntarNota" class="btn btn-dark btn-lib btn-redondo fs-8" title="Adjuntar archivo" onclick="fn_subir_adjunto_nota(${idNota}, ${idCita}, 1,0);">
                                             <i class="bi bi-cloud-arrow-up"></i>
                                          </button>
                                       </div>
                                    </div>
                                    <div id="ver_adjuntos_nota" class="mt-2">
                                       <div class="text-center text-muted py-2 mt-2 border border-dashed rounded fs-8">
                                          <i class="bi bi-paperclip me-1 text-opacity-50"></i> Sin documentos adjuntos
                                       </div>
                                    </div>
                                 </div>`;
                              }
                              html+=`
                           </div>
                        </div>
                     </div>

                  </div> <!-- Cierre .row secundario -->
               </form>
            </div> <!-- Cierre .modal-body -->
            
            <!-- Footer Fijo de Acciones Rápidas -->
            <div class="modal-footer bg-white border-top p-3">
               <div class="row">
                  <div class="col-12">
                     <button type="button" class="btn btn-outline-secondary px-4 fw-medium btn-redondo" data-bs-dismiss="modal">
                        Cerrar Nota
                     </button>
                     <button type="submit" form="formNotaMedica" class="btn btn-dark btn-lib px-4 fw-bold shadow-sm btn-redondo ms-1" id="btnGuardarNotaMedica" onclick="event.preventDefault(); fn_guardar_nota_medica(${idPaciente}, '${nomPaciente}', '${edad}', '${sexo}', ${idDoctor}, '${doctor}', '${cedula}', '${registroEspecial}', ${idCita}, ${idNota});">
                        ${text_boton}
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   </div>`;
   
   $('#modalAdminExt').html(html);
   $('#modalFormNotaMedica').modal('show');
   setTimeout(() => {
      if(idNota > 0) {
         listar_adjuntos_notas('ver_adjuntos_nota', idNota, 1);
      }
   }, 500);
}

const fn_guardar_nota_medica = async (idPaciente, nomPaciente, edadPaciente, sexoPaciente, idDoctor, nomDoctor, cedula, registroEspecial, idCita, idNota) => {

   let holter                = 0;
   let mapa                  = 0;
   let esfuerzo              = 0;
   let ta                    = $('#taMedica').val().trim();
   let oxigenacion           = $('#spoMedica').val().trim();
   let temperatura           = $('#tempMedica').val().trim();
   let glucosa               = $('#glucosaMedica').val().trim() || 0;
   let fr                    = $('#frMedica').val().trim() || 0;
   let fc                    = $('#fcMedica').val().trim();
   let peso                  = $('#pesoMedica').val().trim();
   let estatura              = $('#estaturaMedica').val().trim();
   let valoracion            = $('#motivoValoracion').val().trim();
   let padecimiento          = $('#padecimiento').val().trim();
   let resAnalisisGabinete   = $('#resAnalisisGabinete').val().trim();
   let exploracion           = $('#exploracionFisica').val().trim();
   let tratamiento           = $('#tratamiento').val().trim();
   let diagnosticoPrincipal  = $('#diagnosticoPrincipal').val().trim();
   let diagnosticoSecundario = $('#diagnosticoSecundario').val().trim();
   let analisisClinicos      = $('#analisisClinicos').val().trim();
   let estudiosGabinete      = $('#estudiosGabinete').val().trim();
   let receta                = $('#recetaMedica').val().trim();
   let pronostico            = $('#pronostico').val().trim();

   $('#holterNota').prop('checked') ? holter = 1 : holter;
   $('#mapaNota').prop('checked') ? mapa = 1 : mapa;
   $('#esfuerzoNota').prop('checked') ? esfuerzo = 1 : esfuerzo;

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
   else if (valoracion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un motivo de valoración',
         icon: 'warning'
      });
      $('#motivoValoracion').focus();
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
   else if (diagnosticoPrincipal == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un diagnóstico al paciente',
         icon: 'warning'
      });
      $('#diagnosticoPrincipal').focus();
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
   else if (pronostico == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un pronóstico',
         icon: 'warning'
      });
      $('#pronostico').focus();
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
     
   let objNota = { func: 'guardar_nota_medica', idPaciente, nomPaciente, edadPaciente, sexoPaciente, idDoctor, nomDoctor, cedula, registroEspecial, idCita, idNota, ta, oxigenacion, temperatura, glucosa, fr, fc, peso, estatura, valoracion, padecimiento, resAnalisisGabinete, exploracion, tratamiento, diagnosticoPrincipal, diagnosticoSecundario, analisisClinicos, estudiosGabinete, pronostico, receta,  holter, mapa, esfuerzo };

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

const fn_ver_nota_medica = (idNota) => {

   const arrPrint = arrNotaMedica.find(nota => nota.id_nota_medica == idNota);   
   fetch('reportes/nota_medica_pdf.php', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(arrPrint)
   })
   .then(res => res.blob())
   .then(pdf => {
      const url = window.URL.createObjectURL(pdf);
      window.open(url);
   });
}

const fn_imprimir_notas_medicas = () => {

   fetch('reportes/notas_medicas_pdf.php', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(arrNotaMedica)
   })
   .then(res => res.blob())
   .then(pdf => {

      const url = window.URL.createObjectURL(pdf);

      window.open(url, '_blank');

      // liberar memoria después
      setTimeout(() => {
         window.URL.revokeObjectURL(url);
      }, 1000);

   })
   .catch(error => {
      console.error(error);
   });

}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ADJUNTOS NOTA MÉDICA ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ModalFormSubirAdjuntoNota = (idNota, idCita, idDoctor, nomDoctor, nomPaciente, origen) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormSubirAdjuntoNota" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-md-down">
         <div class="modal-content border-0 sombra-modal">
            
            <!-- Encabezado Clínico Principal -->
            <div class="modal-header modal-head-per py-3 border-0">
               <div class="row  w-100">
                  <div class="col-12">
                     <div class="row">
                        <div class="col-12">
                           <h5 class="modal-title fw-bold mb-0">Adjuntar documentos</h5>
                        </div>
                        <div class="col-12 col-sm-6">
                           <small class="text-white-50">
                              Paciente: <strong class="text-white">${nomPaciente}</strong>
                           </small>
                        </div>
                        <div class="col-12 col-sm-6">
                           <small class="text-white-50">
                              <i class="bi bi-person-md me-1"></i>Médico: <span class="text-white">${nomDoctor}</span>
                           </small>
                        </div>
                     </div>
                  </div>
               </div>
            </div>                    

            <div class="modal-body bg-light p-4">
               <div class="row">
                  <div class="col-12 col-sm-6 fs-7">
                     <b>Nombre del archivo *</b>
                     <input type="text" name="nomAdjuntoAdmin" id="nomAdjuntoAdmin" class="form-control fs-7" maxlength="50">
                  </div>
                  <div class="col-12 col-sm-4 fs-7">
                     <b>Archivo *</b>
                     <input type="file" name="archivoAdjuntoAdmin" id="archivoAdjuntoAdmin" class="form-control fs-7" accept=".pdf">
                  </div>
                  <div class="col-12 col-sm-2 fs-7">
                     <br>
                     <button type="button" class="btn btn-dark btn-lib btn-redondo w-100 fs-7" onclick="fn_subir_adjunto_nota(${idNota}, ${idCita}, ${origen}, ${idDoctor})" title="Subir archivo">
                         <i class="bi bi-cloud-arrow-up"></i>
                     </button>
                  </div>
               </div>
               <div class="row mt-4">
                  <div class="col-12">
                     <div id="ver_adjuntos_nota_admin"></div>
                  </div>
               </div>
            </div>
                        
            <div class="modal-footer bg-light border-0 p-3">
               <div class="row">
                  <div class="col-12">
                     <button type="button" class="btn btn-outline-secondary px-4 fw-medium btn-redondo" data-bs-dismiss="modal">
                        Cerrar
                     </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   </div>`;
   
   $('#modalAdminExt2').html(html);
   $('#modalFormSubirAdjuntoNota').modal('show');
   setTimeout(() => {
      if(idNota > 0) {
         listar_adjuntos_notas('ver_adjuntos_nota_admin', idNota, origen);
      }
   }, 500);
}

const fn_subir_adjunto_nota = async (idNota, idCita, origen, idDoctor) => {
   
   let nomAdjuntoNota;
   let file0;
   let file;
   let containerId;
   let campoArchivo;   
   let campoNombre;

   if(origen == 1) { // Petición desde la nota médica
      campoNombre    = 'nomAdjuntoNota';
      campoArchivo   = 'adjuntoNota';
      nomAdjuntoNota = $('#nomAdjuntoNota').val().trim();
      file0          = document.getElementById('adjuntoNota');
      file           = file0.files[0];
      containerId    = 'ver_adjuntos_nota';
      idDoctor       = $('#idUserUs').val().trim();
   }
   else if(origen == 2) {
      campoNombre    = 'nomAdjuntoAdmin';
      campoArchivo   = 'archivoAdjuntoAdmin';
      nomAdjuntoNota = $('#nomAdjuntoAdmin').val().trim();
      file0          = document.getElementById('archivoAdjuntoAdmin');
      file           = file0.files[0];
      containerId    = 'ver_adjuntos_nota_admin';
      idDoctor       = 0;
   }
   else {
      ToastColor.fire({
         text: '¡Faltaron parámetros importantes, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }

   if (idNota <= 0 || idCita <= 0 || idDoctor < 0) {
      ToastColor.fire({
         text: '¡Faltaron parámetros importantes, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }
   else if (nomAdjuntoNota == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del documento',
         icon: 'warning'
      });
      $('#'+campoNombre).focus();
      return;
   }
   else if (typeof(file) == "undefined") {
      ToastColor.fire({
        text: '¡Atención! Debes seleccionar un documento', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      $('#'+campoArchivo).focus();
      return;
   }
   else if (file.size > 3000000) {
      ToastColor.fire({
        text: '¡Atención! Debes agregar un documento más ligero, tamaño máximo 3 MB.', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      $('#'+campoArchivo).focus();
      return;
   } 
   else if (!(/\.(pdf)$/i).test(file.name)) {
      ToastColor.fire({ text: '¡Atención! El archivo debe ser un documento PDF', icon: 'warning', position: 'top', timer: 4000, timerProgressBar: false });
      $('#'+campoArchivo).focus();
      return;    
   }

   var objArchivo = new FormData();
   objArchivo.append('func', 'subir_adjunto_nota');
   objArchivo.append('idNota', idNota); 
   objArchivo.append('idCita', idCita);
   objArchivo.append('idDoctor', idDoctor);
   objArchivo.append('origen', origen);
   objArchivo.append('nomAdjuntoNota', nomAdjuntoNota);
   objArchivo.append('documento', file);

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Se adjuntará el documento', 'question', 'Sí, subir', 'Cancelar');
   
   if (!res.result) return;

   let respuesta = await subir_adjunto_nota(objArchivo);

   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Subido correctamente!', '', 'success', 2500);
      listar_adjuntos_notas(containerId, idNota, origen);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      return;
   }
}

const listar_adjuntos_notas = async (containerId, idNota, origen = 1) => {
   
   let arrAdjuntos = [];
   
   if(idNota == '') {
      ToastColor.fire({
         text: '¡Atención! No se obtuvieron parámetros importantes',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      let html = 
      `<div class="alert alert-secondary p-2 text-center">No hay documentos adjuntos</div>`;
      $('#'+containerId).html(html);
      return;
   }

   let respuesta = await obtiene_adjuntos_nota(idNota, origen);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      let html = 
      `<div class="text-center text-muted py-2 mt-2 border border-dashed rounded fs-8">
         <i class="bi bi-paperclip me-1 text-opacity-50"></i> Sin documentos adjuntos
      </div>`;
      $('#'+containerId).html(html);
      return;
   }
   else if(respuesta.data.length == 0) {
      let html = 
      `<div class="text-center text-muted py-2 mt-2 border border-dashed rounded fs-8">
         <i class="bi bi-paperclip me-1 text-opacity-50"></i> Sin documentos adjuntos
      </div>`;
      $('#'+containerId).html(html);
   }
   else {
      arrAdjuntos = await respuesta.data;
      pintar_listado_adjuntos_notas(containerId, arrAdjuntos);
   }
}

const pintar_listado_adjuntos_notas = (containerId, data) => {
   const contenedor = document.getElementById(containerId);
   let perfilUs     = $('#perfilUs').val().trim();
   let idUserUs     = $('#idUserUs').val().trim();
   let html         = '';
   
   if(data.length > 0) {
      html = `<div class="row row-cols-1 row-cols-md-2 g-2 mt-2">`;
      
      data.forEach(row => {
         html += `
         <div class="col" id="cardAdjNota${row.id}">
            <!-- Creamos la estructura de "pill" usando bordes redondeados y alineación flex compacta -->
            <div class="d-flex align-items-center justify-content-between p-1 ps-2 pe-1 border rounded-pill bg-light shadow-sm">
               
               <!-- Contenedor del texto e icono con truncate para que no rompa las 2 columnas -->
               <div class="d-flex align-items-center text-truncate me-2 fs-8 pointer" onclick="fn_ver_adjunto('${row.key_query}')">
                  <i class="bi bi-file-earmark-pdf-fill text-danger fs-6 me-2 flex-shrink-0"></i>
                  <span class="text-truncate fw-medium text-dark" title="${row.nom_archivo}.pdf">
                     ${row.nom_archivo}.pdf
                  </span>
               </div>`;

               if( (parseInt(row.id_doctor_fk) == parseInt(idUserUs)) || (row.origen == 2 && perfilUs == 1) ) {
                  html+=`
                  <button type="button" class="btn btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 text-muted btn-outline-danger border-0 opacity-75 opacity-100-hover" style="width: 24px; height: 24px; min-width: 24px;" title="Eliminar adjunto" onclick="fn_eliminar_adjunto_nota(${row.id}, '${row.nom_archivo}', '${row.archivo}', ${row.id_nota_fk}, ${row.id_cita_fk});">
                     <i class="bi bi-x fs-5"></i>
                  </button>`;
               }
               html+=`
            </div>
         </div>`;
      });
      
      html += `</div>`;
   }
   else {
      html = `
      <div class="text-center text-muted py-2 mt-2 border border-dashed rounded" style="font-size: 0.8rem; border-style: dashed !important;">
         <i class="bi bi-paperclip me-1 text-opacity-50"></i> Sin documentos adjuntos
      </div>`;
   }
   
   contenedor.innerHTML = html;
}

const fn_eliminar_adjunto_nota = async (id, nomArchivo, archivo, idNota, idCita) => {

   if (idNota <= 0 || id <= 0 || idCita <= 0 || nomArchivo == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes',
         icon: 'warning'
      });
      return;
   }
        
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El archivo será eliminado', 'question', 'Sí, eliminar', 'Cancelar');

   if (!res.result) {
      return;
   }

   let respuesta = await eliminar_adjunto_nota(id, nomArchivo, archivo, idNota, idCita);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Eliminado!', '', 'success', 2500);
      $('#cardAdjNota'+id).remove();
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      return;
   }
}

const fn_ver_adjunto = (key_query) => {
   window.open('reportes/ver_adjunto.php?id='+key_query);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.ModalListarNotaMedica     = ModalListarNotaMedica; 
window.ModalFormNotaMedica       = ModalFormNotaMedica;

window.fn_guardar_nota_medica    = fn_guardar_nota_medica;
window.fn_eliminar_nota          = fn_eliminar_nota;
window.fn_buscar_nota            = fn_buscar_nota;
window.fn_ver_nota_medica        = fn_ver_nota_medica;
window.fn_subir_adjunto_nota     = fn_subir_adjunto_nota;
window.listar_adjuntos_notas     = listar_adjuntos_notas;
window.fn_eliminar_adjunto_nota  = fn_eliminar_adjunto_nota;
window.fn_ver_adjunto            = fn_ver_adjunto;
window.fn_imprimir_notas_medicas = fn_imprimir_notas_medicas;

window.ModalFormSubirAdjuntoNota = ModalFormSubirAdjuntoNota;



