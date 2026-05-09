// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES MODAL LISTADO PEDIDOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const TabCitas = () => {
   let fecha = fnFechaActual();
   activarLoad('Cargando citas del día...');
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-calendar4-week"></i> Citas</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaCita" onclick="ModalFormCita();"><i class="bi bi-plus-lg"></i> Nueva cita</button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" align="right">
         <div class="input-group">
            <input type="date" name="inpFechaIniCita" id="inpFechaIniCita" class="form-control" value="${fecha}">
            <input type="date" name="inpFechaFinCita" id="inpFechaFinCita" class="form-control" value="${fechaRangoAdelante}">
            <button class="btn btn-dark" type="button" onclick="fn_obtiene_pedidos_fecha();"><i class="bi bi-arrow-clockwise"></i></button>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_citas"></div>
   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      pintarYInicializarCitas('listado_citas', 'tableCitas');
      closeLoad();
   }, 500);
}

const ModalFormCita = () => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormCita" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Registrar Nueva Cita</h1>
               <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-12 mt-2">
                     <b>Paciente *</b>
                     <div class="input-group">
                        <select name="pacienteCita" id="pacienteCita" class="form-select select2">
                           <option value="0">Seleccionar</option>
                        </select>
                        <button class="btn btn-dark" type="button" onclick="ModalFormPaciente(0,'',2);"><i class="bi bi-plus-lg"></i></button>
                     </div>
                  </div>
                  <div class="col-12 mt-2">
                     <b>Doctor *</b>
                     <select name="doctorCita" id="doctorCita" class="form-select select2">
                        <option value="0">Seleccionar</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Fecha *</b>
                     <input type="date" name="fechaCita" id="fechaCita" class="form-control">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Hora *</b>
                     <input type="time" name="horaCita" id="horaCita" class="form-control">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Observación</b>
                     <textarea name="obsCita" id="obsCita" class="form-control" rows="2" maxlength="250"></textarea>
                  </div>
               </div>                     
            </div>
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib">
                  Registrar Cita
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdmin').html(html);
   $('#modalFormCita').modal('show');
   $('.select2').select2({
      dropdownParent: $('#modalFormCita'),
      theme: 'bootstrap-5'
   });
   $('.select2').on('select2:open', function () {
      setTimeout(() => {
         let input = document.querySelector('.select2-container--open .select2-search__field');
         if (input) input.focus();
      }, 10);
   });
   setTimeout(() => {
      //Se cargará el catálogo de pacientes
   }, 100);
}

const pintarYInicializarCitas = (containerId, tableId) => {
   const contenedor = document.getElementById(containerId);
   
   // Datos de ejemplo para la demo
   const citas = [
      { id: '1', fecha: '04-05-2026', hora: '08:30', paciente: 'Ana García López', estudio: 'Dolor de cabeza', estatus: 'Atendida', color: 'success' },
      { id: '2', fecha: '05-05-2026', hora: '09:15', paciente: 'Roberto Valdez', estudio: 'Dolor en el pecho', estatus: 'Registrada', color: 'primary' },
      { id: '3', fecha: '05-05-2026', hora: '10:00', paciente: 'Carla Méndez', estudio: 'Cansancio General', estatus: 'Registrada', color: 'primary' },
      { id: '4', fecha: '06-05-2026', hora: '11:30', paciente: 'Luis Fernando Soler', estudio: 'Fatiga diaria', estatus: 'Registrada', color: 'primary' },
      { id: '5', fecha: '06-05-2026', hora: '12:45', paciente: 'Mónica Ruiz', estudio: 'Dolor de cabeza', estatus: 'Cancelada', color: 'danger' },
      { id: '6', fecha: '07-05-2026', hora: '14:00', paciente: 'Jorge Huertas', estudio: 'Gripa', estatus: 'Atendida', color: 'success' },
      { id: '7', fecha: '10-05-2026', hora: '16:20', paciente: 'Elena Poniatowska', estudio: 'Dolor de brazos', estatus: 'Registrada', color: 'primary' }
   ];

   // Nota: Eliminamos el overflow:hidden y la card del string para que Datatable maneje el layout
   let html = `
   <div class="table-responsive mt-4">
      <table id="${tableId}" class="table table-hover align-middle w-100">
         <thead class="bg-light">
            <tr>
               <th>ID</th>
               <th class="ps-4 text-secondary">Fecha / Hora</th>
               <th class="py-3 text-secondary">Paciente</th>
               <th class="py-3 text-secondary">Observación</th>
               <th class="py-3 text-secondary">Estatus</th>
               <th class="py-3 text-center text-secondary">Acciones</th>
            </tr>
         </thead>
         <tbody>`;
            citas.forEach(cita => {
               html += `
               <tr>
                  <td>${cita.id}</td>
                  <td class="ps-4">
                     <span class="fw-bold text-dark">${cita.fecha} / ${cita.hora}</span>
                  </td>
                  <td>
                     <div class="d-flex align-items-center">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px; background-color: #f0f2f5;">
                              <span class="text-secondary fw-bold" style="font-size: 0.7rem;">${cita.paciente.charAt(0)}</span>
                        </div>
                        <span class="text-dark fw-medium">${cita.paciente}</span>
                     </div>
                  </td>
                  <td><span class="text-muted">${cita.estudio}</span></td>
                  <td class="text-center">
                     <span class="badge rounded-pill text-${cita.color} border border-${cita.color} bg-${cita.color} bg-opacity-10">
                        ${cita.estatus}
                     </span>
                  </td>
                  <td class="text-center">
                     <button class="btn btn-outline-dark fs-7" title="Editar"><i class="bi bi-pencil"></i></button>
                     <button class="btn btn-outline-dark fs-7" title="Nota médica" onclick="ModalFormNotaMedica();">
                        <i class="bi bi-clipboard-plus"></i>
                     </button>
                     <button class="btn btn-outline-danger fs-7" title="Eliminar"><i class="bi bi-trash"></i></button>
                  </td>
               </tr>`;
            });
            html += `
         </tbody>
      </table>
   </div>`;

   contenedor.innerHTML = html;

   setTimeout(() => {
      initDataTableExport({
        tableId: '#tableCitas',
        titulo: 'Citas',
        alignment: ['10%', '10%', '50%', '10%', '10%', '10%'],
        exportColumns: [0, 1, 2, 3, 4, 5]
      });
   }, 500);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ NOTA MÉDICA  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalFormNotaMedica = () => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalNotaMedica" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary me-3 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="bi bi-person-fill fs-4"></i>
                    </div>
                    <div>
                        <h5 class="modal-title mb-0">Nota Médica</h5>
                        <small class="opacity-75">Paciente: Juan Pérez • 34 años • Veracruz, Ver.</small>
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
                           <div class="col-md-1 col-sm-4 col-6 mt-3">
                              <strong>T/A</strong>
                              <input type="text" name="taMedica" id="taMedica" class="form-control" maxlength="50" />
                           </div>
                           <div class="col-md-1 col-sm-4 col-6 mt-3">
                              <strong>SpO2</strong>
                              <input type="text" name="spoMedica" id="spoMedica" class="form-control" maxlength="50" />
                           </div>
                           <div class="col-md-1 col-sm-4 col-6 mt-3">
                              <strong>Temp.</strong>
                              <input type="text" name="spoMedica" id="spoMedica" class="form-control" maxlength="50" />
                           </div>
                           <div class="col-md-1 col-sm-4 col-6 mt-3">
                              <strong>Glucosa</strong>
                              <input type="text" name="glucosaMedica" id="glucosaMedica" class="form-control" maxlength="50" />
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3">
                              <strong>FR</strong>
                              <input type="text" name="frMedica" id="frMedica" class="form-control" maxlength="50" />
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3">
                              <strong>FC</strong>
                              <input type="text" name="fcMedica" id="fcMedica" class="form-control" maxlength="50" />
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3">
                              <strong>Peso</strong>
                              <input type="text" name="pedoMedica" id="pedoMedica" class="form-control" maxlength="50" />
                           </div>
                           <div class="col-md-2 col-sm-4 col-6 mt-3">
                              <strong>Estatura</strong>
                              <input type="text" name="estaturaMedica" id="estaturaMedica" class="form-control" maxlength="50" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="col-12 mt-5">
                     <nav>
                        <div class="nav nav-tabs" id="nav-revision-medica" role="tablist">
                           <button class="nav-link text-dark active" id="nav-padecimiento-tab" data-bs-toggle="tab" data-bs-target="#nav-padecimiento" type="button" role="tab" aria-controls="nav-padecimiento" aria-selected="true">
                              <i class="bi bi-virus2"></i> Padecimiento actual
                           </button>
                           <button class="nav-link text-dark" id="nav-exploracion-tab" data-bs-toggle="tab" data-bs-target="#nav-exploracion" type="button" role="tab" aria-controls="nav-exploracion" aria-selected="false">
                              <i class="bi bi-person-arms-up"></i> Exploración física
                           </button>
                           <button class="nav-link text-dark" id="nav-plan-tab" data-bs-toggle="tab" data-bs-target="#nav-plan" type="button" role="tab" aria-controls="nav-plan" aria-selected="false">
                              <i class="bi bi-capsule"></i> Plan de manejo y tratamiento 
                           </button>
                           <button class="nav-link text-dark" id="nav-pronostico-tab" data-bs-toggle="tab" data-bs-target="#nav-pronostico" type="button" role="tab" aria-controls="nav-pronostico" aria-selected="false">
                              <i class="bi bi-journal-medical"></i> Pronóstico
                           </button>
                           <button class="nav-link text-dark" id="nav-diagnostico-tab" data-bs-toggle="tab" data-bs-target="#nav-diagnostico" type="button" role="tab" aria-controls="nav-diagnostico" aria-selected="false">
                              <i class="bi bi-clipboard-check"></i> Diagnóstico principal
                           </button>
                           <button class="nav-link text-dark" id="nav-secundario-tab" data-bs-toggle="tab" data-bs-target="#nav-secundario" type="button" role="tab" aria-controls="nav-secundario" aria-selected="false">
                              <i class="bi bi-clipboard-minus"></i> Diagnóstico secundario
                           </button>
                        </div>
                     </nav>
                     <div class="tab-content p-3 shadow-lg bg-white" id="nav-content-revision">        
                        <div class="tab-pane fade show active" id="nav-padecimiento" role="tabpanel" aria-labelledby="nav-padecimiento-tab">
                           <strong>Padecimiento actual</strong>
                           <textarea name="padecimiento" id="padecimiento" class="form-control" rows="5"></textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-exploracion" role="tabpanel" aria-labelledby="nav-exploracion-tab">
                           <strong>Exploración física</strong>
                           <textarea name="exploracionFisica" id="exploracionFisica" class="form-control" rows="5"></textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-plan" role="tabpanel" aria-labelledby="nav-plan-tab">
                           <strong>Plan de manejo y tratamiento</strong>
                           <textarea name="tratamiento" id="tratamiento" class="form-control" rows="5"></textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-pronostico" role="tabpanel" aria-labelledby="nav-pronostico-tab">
                           <strong>Pronóstico</strong>
                           <textarea name="pronostico" id="pronostico" class="form-control" rows="5"></textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-diagnostico" role="tabpanel" aria-labelledby="nav-diagnostico-tab">
                           <strong>Diagnóstico principal</strong>
                           <textarea name="diagnosticoPrincipal" id="diagnosticoPrincipal" class="form-control" rows="5"></textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-secundario" role="tabpanel" aria-labelledby="nav-secundario-tab">
                           <strong>Diagnóstico secundario</strong>
                           <textarea name="diagnosticoSecundario" id="diagnosticoSecundario" class="form-control" rows="5"></textarea>
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
                           <textarea name="analsisiClinicos" id="analsisiClinicos" class="form-control" rows="5"></textarea>
                        </div>

                        <div class="tab-pane fade" id="nav-gabinete" role="tabpanel" aria-labelledby="nav-gabinete-tab">
                           <strong>Estudios de Gabinete</strong>
                           <textarea name="estudiosGabinete" id="estudiosGabinete" class="form-control" rows="5"></textarea>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="col-12 mt-5">
                     <nav>
                        <div class="nav nav-tabs" id="nav-receta-btn" role="tablist">
                            <button class="nav-link text-dark active fw-bold" id="nav-receta-tab" data-bs-toggle="tab" data-bs-target="#nav-receta" type="button" role="tab" aria-controls="nav-receta" aria-selected="false">
                              <i class="bi bi-prescription2"></i>Receta médica
                           </button>
                        </div>
                     </nav>
                     <div class="tab-content p-3 shadow-lg bg-white" id="nav-content-estudios">        
                        <div class="tab-pane fade show active" id="nav-receta" role="tabpanel" aria-labelledby="nav-receta-tab">
                           <textarea name="recetaMedica" id="recetaMedica" class="form-control border-secondary" rows="5" placeholder="Ingresa aquí la receta"></textarea>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="row mt-5">
                  <div class="col-12 text-center">
                     <button type="button" class="btn btn-dark btn-lib btn-redondo w-25">
                        Guardar
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
   $('#modalAdmin').html(html);
   $('#modalNotaMedica').modal('show');
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabCitas            = TabCitas;
window.ModalFormCita       = ModalFormCita; 
window.ModalFormNotaMedica = ModalFormNotaMedica;


