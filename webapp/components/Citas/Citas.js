import { obtiene_citas, guardar_cita, cancelar_cita  } from "./CitasServices.js";
import { obtiene_pacientes } from "../Pacientes/PacientesServices.js";
import { obtiene_doctores } from "../Usuarios/UsuariosServices.js";

const combo_doctores = async (containerId) => {
   let comboDoctores = '<option value="0">Seleccionar</option>';
   let respuesta     = await obtiene_doctores();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      let res = await respuesta.data;
      if(res.length > 0) {
         res.map((row) => {
            comboDoctores +=`
            <option value="${row.id}">
               ${row.nombre}
            </option>`;
         });
         $('#'+containerId).html(comboDoctores);
      }
   }
}

const combo_pacientes = async (containerId) => {
   let comboPacientes = '<option value="0">Seleccionar</option>';
   let respuesta     = await obtiene_pacientes();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else {
      let res = await respuesta.data;
      if(res.length > 0) {
         res.map((row) => {
            comboPacientes +=`
            <option value="${row.id_paciente}">
               ${row.nombre} ${row.ap_paterno} ${row.ap_materno}
            </option>`;
         });
         $('#'+containerId).html(comboPacientes);
      }
   }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES MODAL LISTADO PEDIDOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let arrCitas = [];

const TabCitas = () => {
   let fecha = fnFechaActual();
   activarLoad('Cargando citas del día...');
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-calendar4-week"></i> Citas</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaCita" onclick="ModalFormCita(0);"><i class="bi bi-plus-lg"></i> Nueva cita</button>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" align="right">
         <div class="input-group">
            <input type="date" name="inpFechaIniCita" id="inpFechaIniCita" class="form-control" value="${fecha}">
            <input type="date" name="inpFechaFinCita" id="inpFechaFinCita" class="form-control" value="${fechaRangoAdelante}">
            <button class="btn btn-secondary btn-lib" type="button" onclick="listar_citas('listado_citas');"><i class="bi bi-arrow-clockwise"></i></button>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_citas"></div>
   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      listar_citas('listado_citas');
   }, 500);
}

const ModalFormCita = (idCita) => {

   let text_boton  = '';
   let fecha       = '';
   let hora        = '';
   let idPaciente  = 0;
   let idDoctor    = 0; 
   let observacion = '';  

   if(idCita == 0) {
      text_boton = 'Registrar Cita';
   }
   else {
      text_boton = 'Modificar Cita';

      let citaSelected = arrCitas.filter(cita => cita.id_cita == idCita);

      hora        = citaSelected[0].hora;
      fecha       = citaSelected[0].fecha;
      observacion = citaSelected[0].observacion;
      idDoctor    = citaSelected[0].id_doctor;
      idPaciente  = citaSelected[0].id_paciente;
   }

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormCita" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">${text_boton}</h1>
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
                     <select name="doctorCita" id="doctorCita" class="form-select">
                        <option value="0">Seleccionar</option>
                     </select>
                  </div>
                  <div class="col-12 mt-3">
                     <b>Fecha *</b>
                     <input type="date" name="fechaCita" id="fechaCita" class="form-control" value="${fecha}">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Hora *</b>
                     <input type="time" name="horaCita" id="horaCita" class="form-control" value="${hora}">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Observación</b>
                     <textarea name="obsCita" id="obsCita" class="form-control" rows="2" maxlength="250">${observacion}</textarea>
                  </div>
               </div>                     
            </div>
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarCita" onclick="fn_guardar_cita(${idCita});">
                  ${text_boton}
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
      combo_pacientes('pacienteCita');
      combo_doctores('doctorCita');

      if(idCita > 0) {
         setTimeout(() => {
            $('#pacienteCita').val(idPaciente);
            $('#pacienteCita').trigger('change');
            $('#doctorCita').val(idDoctor);
         }, 300);
      }
   }, 200);
}

const fn_guardar_cita = async (idCita) => {

   let fechaActual  = fnFechaActual();
   let pacSelected  = document.getElementById("pacienteCita");
   let nomPaciente  = pacSelected.options[pacSelected.selectedIndex].text;
   let idPaciente   = $('#pacienteCita').val().trim();
   let docSelected  = document.getElementById("doctorCita");
   let nomDoctor    = docSelected.options[docSelected.selectedIndex].text;
   let idDoctor     = $('#doctorCita').val().trim();
   let fechaCita    = $('#fechaCita').val().trim();
   let horaCita     = $('#horaCita').val();
   let obsCita      = $('#obsCita').val();

   if (idPaciente == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un paciente',
         icon: 'warning'
      });
      $('#pacienteCita').focus();
      return;
   }
   else if (idDoctor == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un doctor',
         icon: 'warning'
      });
      $('#doctorCita').focus();
      return;
   }
   else if (fechaCita == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una fecha',
         icon: 'warning'
      });
      $('#fechaCita').focus();
      return;
   }   
   else if (horaCita == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar una hora',
         icon: 'warning'
      });
      $('#horaCita').focus();
      return;
   }  
     
   let objCita = { func: 'guardar_cita', idCita, idPaciente, nomPaciente, idDoctor, nomDoctor, fechaCita, horaCita, obsCita };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La cita para: ' + nomPaciente + '  con fecha ' + fechaCita + ' en horario ' + horaCita + ' será registrado', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      $('#btnGuardarCita').prop('disabled', false);
      return;
   }

   $('#btnGuardarCita').prop('disabled', true);
   let respuesta = await guardar_cita(objCita);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Cita guardada correctamente', '', 'success', 2500);
      $('#pacienteCita').val(0);
      $('#pacienteCita').trigger('change');
      $('#doctorCita').val(0);
      $('#fechaCita').val('');
      $('#horaCita').val('');
      $('#obsCita').val('');
      $('#modalFormCita').modal('hide');
      listar_citas('listado_citas');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarCita').prop('disabled', false);
      return;
   }
}

const listar_citas = async (containerId) => {
   arrCitas = [];

   let fechaInicial = $('#inpFechaIniCita').val();
   let fechaFinal = $('#inpFechaFinCita').val();

   if(fechaInicial == '' || fechaFinal == '') {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar el rango de fechas',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#inpFechaIniCita').focus()
      return;
   }
   else if(fechaInicial > fechaFinal) {
      ToastColor.fire({
         text: '¡Atención! La fecha inicial no puede ser mayor a la fecha final',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#inpFechaIniCita').focus()
      return;
   }

   let respuesta = await obtiene_citas(fechaInicial, fechaFinal);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      closeLoad();
      return;
   }
   else {
      arrCitas = await respuesta.data;
      pintar_listado_citas(containerId, arrCitas);
   }
}

const pintar_listado_citas = (containerId, data) => {
   const contenedor = document.getElementById(containerId);
   let color         = '';
   let estatus       = 'No identificado';
   let infoCancelada = '';
   
   // Nota: Eliminamos el overflow:hidden y la card del string para que Datatable maneje el layout
   let html = `
   <div class="table-responsive mt-4">
      <table id="tableCitas" class="table table-hover align-middle w-100">
         <thead class="bg-light">
            <tr>
               <th>ID</th>
               <th class="ps-4 text-secondary" width="15%">Fecha / Hora</th>
               <th class="py-3 text-secondary" width="20%">Paciente</th>
               <th class="py-3 text-secondary" width="20%">Doctor</th>
               <th class="py-3 text-secondary" width="20%">Registró</th>
               <th class="py-3 text-secondary" width="10%">Estatus</th>
               <th class="py-3 text-center text-secondary" width="15%">Acciones</th>
            </tr>
         </thead>
         <tbody>`;
            data.forEach(cita => {

               infoCancelada = 'no-display';

               if(cita.estatus == 1) {
                  color   = 'primary';
                  estatus = 'Registrada';
               }
               else if(cita.estatus == 2) {
                  color   = 'success';
                  estatus = 'Atendida';
               }
               else if(cita.estatus == 3) {
                  color         = 'danger';
                  estatus       = 'Cancelada';
                  infoCancelada = 'info-flotante';
               }               

               html += `
               <tr id="trCita${cita.id_cita}">
                  <td>${cita.id_cita}</td>
                  <td class="ps-4 text-center">
                     <span class="fw-bold text-dark">${cita.fecha_format} / ${cita.hora}</span>
                  </td>
                  <td>
                     <div class="d-flex align-items-center">
                        <div class="btn-redondo d-flex align-items-center justify-content-center me-2 badge_cita">
                           <span class="text-secondary fw-bold" style="font-size: 0.7rem;">${cita.paciente.charAt(0)}</span>
                        </div>
                        <span class="text-dark fw-medium">${cita.paciente}</span>
                     </div>
                  </td>
                  <td><span class="text-muted">${cita.doctor}</span></td>
                  <td>
                     <span>${cita.user_cap}</span>
                  </td>
                  <td class="text-center celda-estatus">
                     <div id="label_estatus${cita.id_cita}">
                        <span class="badge rounded-pill text-${color} border border-${color} bg-${color} bg-opacity-10">
                           ${estatus}
                        </span>
                     </div>
                     
                     <!-- Agregamos la clase 'info-flotante' para controlarla con CSS -->
                     <div id="info_cancelada${cita.id_cita}" class="${infoCancelada}">
                        <div class="alert alert-danger p-2 m-0 mt-2">
                           <strong>Información de cancelación </strong><br>
                           <small>
                              ${cita.user_cancela ?? ''}<br>
                              ${cita.fecha_cancela_format ?? ''}<br>
                              <em>${cita.motivo ?? ''}</em>
                           </small>
                        </div>
                     </div>
                  </td>
                  <td class="text-center">`
                     if(cita.estatus == 1) {
                        html+=`
                        <button class="btn btn-outline-dark fs-7 bloqCancelCita" title="Editar" onclick="ModalFormCita(${cita.id_cita});">
                           <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-dark fs-7 ms-1 bloqCancelCita" title="Nota médica" onclick="ModalListarNotaMedica(${cita.id_paciente}, '${cita.paciente}', ${cita.id_doctor}, '${cita.doctor}', ${cita.id_cita});">
                           <i class="bi bi-clipboard-plus"></i>
                        </button>`;
                     }
                     if(cita.estatus == 1) {
                        html+=`
                        <button class="btn btn-outline-danger fs-7 ms-1 bloqCancelCita" title="Cancelar cita" onclick="ModalCancelarCita(${cita.id_cita}, '${cita.paciente}');">
                           <i class="bi bi-ban"></i>
                        </button>`;
                     }
                     html+=`
                  </td>
               </tr>`;
            });
            html += `
         </tbody>
      </table>
   </div>`;

   contenedor.innerHTML = html;
   closeLoad();

   setTimeout(() => {
      initDataTableExport({
        tableId: '#tableCitas',
        titulo: 'Citas',
        alignment: ['15%', '25%', '25%', '25%', '15%'],
        exportColumns: [1, 2, 3, 4, 5]
      });
   }, 500);
}

const ModalCancelarCita = (idCita, nomPaciente) => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalCancelarCita" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
         <div class="modal-content sombra-modal">
            <div class="modal-body">
               <div class="row pb-5">
                  <div class="col-12" align="center">
                     <i class="bi bi-exclamation-circle fs-08 text-warning"></i>
                     <h3 class="mt-3"><b>¿Estás seguro?</b></h3>
                     <h4 class="mt-3"><b>La cita será cancelada</b></h4>
                  </div>
                  <div class="col-lg-6 offset-lg-3 col-md-6 offset-md-3 col-12 mt-3">
                     <b>Ingresa un motivo</b>
                     <textarea name="motivoCitaCancelada" id="motivoCitaCancelada" class="form-control" rows="2" maxlength="200"></textarea>
                  </div>
                  <div class="col-6 mt-5" align="right">
                     <button type="buttton" class="btn btn-dark btn-lib btn-redondo" onclick="fn_cancelar_cita(${idCita}, '${nomPaciente}');">
                        <i class="bi bi-check-lg"></i> Sí, cancelar
                     </button>
                  </div>
                  <div class="col-6 mt-5">
                     <button type="buttton" class="btn btn-outline-secondary btn-redondo" data-bs-dismiss="modal">
                        <i class="bi bi-x-lg"></i> Cancelar
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt3').html(html);
   $('#modalCancelarCita').modal('show');
}

const fn_cancelar_cita = async (idCita, nomPaciente) => {   

   let motivo = $('#motivoCitaCancelada').val().trim();

   if(idCita <= 0 || nomPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! No se obtuvo un parámetro importante para continuar, actualiza y vuelve a intentarlo',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      return;
   }
   else if(motivo == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar un motivo de cancelación',
         icon: 'warning',
         position: 'top',
         timerProgressBar: false
      });
      $('#motivoCitaCancelada').focus()
      return;
   }

   let respuesta = await cancelar_cita(idCita, nomPaciente, motivo);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {

      let index = arrCitas.findIndex(item => item.id_cita == idCita);   
      if (index !== -1) {
         arrCitas[index].estatus = 3;
      }

      let labelEstatus = 
      `<span class="badge rounded-pill text-danger border border-danger bg-danger bg-opacity-10">
         Cancelada
      </span>`;
      $('#label_estatus'+idCita).html(labelEstatus);
      $('.bloqCancelCita').remove();
      showMessageSwalTimer('Cita cancelada correctamente!', '', 'success', 2500);

      let labelInfoCancelada = `
      <div class="alert alert-danger p-2">
         <strong>Información de cancelación </strong><br>
         ${motivo}
      </div>`;

      $('#info_cancelada'+idCita).html(labelInfoCancelada);

      $('#modalCancelarCita').modal('hide');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabCitas            = TabCitas;
window.ModalFormCita       = ModalFormCita;
window.ModalCancelarCita   = ModalCancelarCita;

window.listar_citas        = listar_citas;
window.combo_pacientes     = combo_pacientes;
window.fn_guardar_cita     = fn_guardar_cita;
window.fn_cancelar_cita    = fn_cancelar_cita;


