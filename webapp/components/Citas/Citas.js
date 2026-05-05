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
                     <textarea name="obsCita" id="obsCita" class="form-control" rows="2" maxlength="200"></textarea>
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

const pintarTablaCitasDemo = (containerId) => {
   const contenedor = document.getElementById(containerId);
   
   // Datos de ejemplo para la demo
   const citas = [
      { id: '001', hora: '08:30 AM', paciente: 'Ana García López', estudio: 'Perfil Bioquímico', estatus: 'Completado', color: 'success' },
      { id: '002', hora: '09:15 AM', paciente: 'Roberto Valdez', estudio: 'Rayos X Tórax', estatus: 'En Proceso', color: 'primary' },
      { id: '003', hora: '10:00 AM', paciente: 'Carla Méndez', estudio: 'Ultrasonido Abdominal', estatus: 'Pendiente', color: 'warning' },
      { id: '004', hora: '11:30 AM', paciente: 'Luis Fernando Soler', estudio: 'Examen de Sangre', estatus: 'Pendiente', color: 'warning' },
      { id: '005', hora: '12:45 PM', paciente: 'Mónica Ruiz', estudio: 'Mastografía', estatus: 'Cancelado', color: 'danger' },
      { id: '006', hora: '02:00 PM', paciente: 'Jorge Huertas', estudio: 'Prueba COVID-19', estatus: 'Completado', color: 'success' },
      { id: '007', hora: '04:20 PM', paciente: 'Elena Poniatowska', estudio: 'Resonancia Magnética', estatus: 'Pendiente', color: 'warning' }
   ];

   let html = `
   <div class="card shadow-sm border-0 mt-4" style="border-radius: 15px; overflow: hidden;">
      <div class="table-responsive">
         <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
               <tr>
                  <th class="ps-4 py-3 text-secondary text-uppercase" style="font-size: 0.75rem; letter-spacing: 1px;">Hora</th>
                  <th class="py-3 text-secondary text-uppercase" style="font-size: 0.75rem; letter-spacing: 1px;">Paciente</th>
                  <th class="py-3 text-secondary text-uppercase" style="font-size: 0.75rem; letter-spacing: 1px;">Estudio / Motivo</th>
                  <th class="py-3 text-secondary text-uppercase" style="font-size: 0.75rem; letter-spacing: 1px;">Estatus</th>
                  <th class="py-3 text-center text-secondary text-uppercase" style="font-size: 0.75rem; letter-spacing: 1px;">Acciones</th>
               </tr>
            </thead>
            <tbody>`;
               citas.forEach(cita => {
                  html += `
                  <tr style="cursor: pointer;">
                     <td class="ps-4">
                        <span class="fw-bold text-dark">${cita.hora}</span>
                     </td>
                     <td>
                        <div class="d-flex align-items-center">
                           <div class="rounded-circle bg-soft-${cita.color} d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px; background-color: #f0f2f5;">
                                 <span class="text-secondary fw-bold" style="font-size: 0.7rem;">${cita.paciente.charAt(0)}</span>
                           </div>
                           <span class="text-dark fw-medium">${cita.paciente}</span>
                        </div>
                     </td>
                     <td><span class="text-muted">${cita.estudio}</span></td>
                     <td>
                        <span class="badge rounded-pill bg-${cita.color}-soft text-${cita.color} border border-${cita.color}" 
                              style="font-weight: 500; padding: 0.5em 1em; background-color: rgba(var(--bs-${cita.color}-rgb), 0.1);">
                           ${cita.estatus}
                        </span>
                     </td>
                     <td class="text-center">
                        <button class="btn btn-sm btn-light border-0 px-2" title="Editar"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-light border-0 px-2 text-danger" title="Eliminar"><i class="bi bi-trash"></i></button>
                     </td>
                  </tr>`;
               });
               html += `
            </tbody>
         </table>
      </div>
   </div>`;

   contenedor.innerHTML = html;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabCitas      = TabCitas;
window.ModalFormCita = ModalFormCita; 


