import { obtiene_citas, guardar_cita, cancelar_cita, cita_atendida  } from "./CitasServices.js";
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

const fn_buscar_citas = () => {
   let busqueda = $('#inpBusquedaCita').val().trim();

   const normalizarTexto = (texto) => {
      return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
   };

   const busquedaNormalizada = normalizarTexto(busqueda);

   const filtrado = arrCitas.filter(cita => 
      normalizarTexto(cita.paciente).includes(busquedaNormalizada)
   );
   
   pintar_listado_citas('listado_citas', filtrado);
}

const TabCitas = () => {
   let fecha       = fnFechaActual();
   let optionAnios = comboAnios();
   let mes         = fecha.split('-')[1];

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
      <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mt-3" align="right">
         <div class="input-group">
            <select name="anioCita" id="anioCita" class="form-select">
               ${optionAnios}
            </select>
            <select name="mesCita" id="mesCita" class="form-select">
               ${comboMeses}
            </select>
            <button class="btn btn-secondary btn-lib" type="button" onclick="listar_citas('listado_citas');"><i class="bi bi-arrow-clockwise"></i></button>
         </div>
      </div>
      <div class="col-xl-3 offset-xl-5 col-lg-3 offset-lg-5 col-md-4 offset-md-4 col-sm-12 col-12 mt-3" align="right">
         <div class="input-group">
            <input type="text" name="inpBusquedaCita" id="inpBusquedaCita" class="form-control border-end-0" placeholder="Buscar citas" onkeyUp="fn_buscar_citas();">
            <span class="input-group-text border-start-0 bg-white"><i class="bi bi-search"></i></span>
         </div>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_citas"></div>
   </div>`;


   setTimeout(() => {
      $('#mesCita').val(mes);
   }, 100);

   $('#containerMain').html(html);
   setTimeout(() => {
      listar_citas('listado_citas');
   }, 500);
}

const ModalFormCita = (idCita) => {

   let text_boton   = '';
   let fecha        = '';
   let hora         = '';
   let idPaciente   = 0;
   let idDoctor     = 0; 
   let tipoConsulta = 0; 
   let tipoVisita   = 0; 
   let observacion  = '';  
   let perfilUs     = $('#perfilUs').val().trim();
   let idUser       = $('#idUserUs').val().trim();
   let user         = $('#userUs').val().trim();
   let optionDoctor = '<option value="0">Seleccionar</option>';
   let solEsfuerzo  = '';
   let solHolter    = '';
   let solMapa      = '';

   if(idCita == 0) {
      text_boton = 'Registrar Cita';
   }
   else {
      text_boton = 'Modificar Cita';

      let citaSelected = arrCitas.filter(cita => cita.id_cita == idCita);
      hora         = citaSelected[0].hora;
      fecha        = citaSelected[0].fecha;
      observacion  = citaSelected[0].observacion;
      idPaciente   = citaSelected[0].id_paciente_fk;
      idDoctor     = citaSelected[0].id_doctor_fk;
      tipoConsulta = citaSelected[0].tipo_consulta;
      tipoVisita   = citaSelected[0].tipo_visita;
      citaSelected[0].sol_esfuerzo == 1 ? solEsfuerzo = 'checked' : solEsfuerzo
      citaSelected[0].sol_holter == 1 ? solHolter = 'checked': solHolter
      citaSelected[0].sol_mapa == 1 ? solMapa = 'checked' : solMapa
   }

   if(perfilUs == 3) {
      optionDoctor = `<option value="${idUser}">${user}</option>`;
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
               <div class="row mb-5">
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
                        ${optionDoctor}
                     </select>
                  </div>
                  <div class="col-12 col-sm-6 mt-2">
                     <b>Tipo de Consulta *</b>
                     <select name="tipoConsulta" id="tipoConsulta" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Consulta</option>
                        <option value="2">Ecocardiograma</option>
                        <option value="3">Consulta / Ecocardiograma</option>
                     </select>
                  </div>
                  <div class="col-12 col-sm-6 mt-2">
                     <b>Tipo de Visita *</b>
                     <select name="tipoVisita" id="tipoVisita" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Primera Vez</option>
                        <option value="2">Seguimiento</option>
                     </select>
                  </div>
                  <div class="col-12 col-sm-6 mt-2">
                     <b>Fecha *</b>
                     <input type="date" name="fechaCita" id="fechaCita" class="form-control" value="${fecha}">
                  </div>
                  <div class="col-12 col-sm-6 mt-2">
                     <b>Hora *</b>
                     <input type="time" name="horaCita" id="horaCita" class="form-control" value="${hora}">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Observación</b>
                     <textarea name="obsCita" id="obsCita" class="form-control" rows="2" maxlength="250">${observacion}</textarea>
                  </div>
                  <div class="col-12 mt-3">
                     <b>¿Se realizará alguno de estos estudios?</b>
                  </div>
                  <div class="col-4 mt-2">    
                     <input type="checkbox" class="btn-check" name="pEsfuerzo" id="pEsfuerzo" autocomplete="off" ${solEsfuerzo}>                     
                     <label class="btn btn-outline-dark w-100" for="pEsfuerzo">
                        P. Esfuerzo
                     </label>
                  </div>
                  <div class="col-4 mt-2">    
                     <input type="checkbox" class="btn-check" name="holter" id="holter" autocomplete="off" ${solHolter}>                     
                     <label class="btn btn-outline-dark w-100" for="holter">
                        HOLTER
                     </label>
                  </div>
                  <div class="col-4 mt-2">    
                     <input type="checkbox" class="btn-check" name="mapa" id="mapa" autocomplete="off" ${solMapa}>                     
                     <label class="btn btn-outline-dark w-100" for="mapa">
                        M.A.P.A
                     </label>
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
      
      if(perfilUs != 3) {
         combo_doctores('doctorCita');
      }
      else {
         $('#doctorCita').prop('disabled', true);
         $('#doctorCita').trigger('change');
      }

      if(idCita > 0) {
         setTimeout(() => {
            $('#pacienteCita').val(idPaciente);
            $('#pacienteCita').trigger('change');
            $('#doctorCita').val(idDoctor);
            $('#tipoConsulta').val(tipoConsulta);
            $('#tipoVisita').val(tipoVisita);
         }, 300);
      }
   }, 200);
}

const fn_guardar_cita = async (idCita) => {

   let solEsfuerzo  = 0;
   let solHolter    = 0;
   let solMapa      = 0;
   let fechaActual  = fnFechaActual();
   let pacSelected  = document.getElementById("pacienteCita");
   let nomPaciente  = pacSelected.options[pacSelected.selectedIndex].text;
   let idPaciente   = $('#pacienteCita').val().trim();
   let docSelected  = document.getElementById("doctorCita");
   let nomDoctor    = docSelected.options[docSelected.selectedIndex].text;
   let idDoctor     = $('#doctorCita').val().trim();
   let tipoConsulta = $('#tipoConsulta').val();
   let tipoVisita   = $('#tipoVisita').val();
   let fechaCita    = $('#fechaCita').val().trim();
   let horaCita     = $('#horaCita').val();
   let obsCita      = $('#obsCita').val();
   
   $('#pEsfuerzo').prop('checked') ? solEsfuerzo = 1 : solEsfuerzo;
   $('#holter').prop('checked') ? solHolter = 1 : solHolter;
   $('#mapa').prop('checked') ? solMapa = 1 : solMapa;

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
   else if (tipoConsulta == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un tipo de consulta',
         icon: 'warning'
      });
      $('#tipoConsulta').focus();
      return;
   }
   else if (tipoVisita == 0) {
      ToastColor.fire({
         text: '¡Atención! Debes seleccionar un tipo de visita',
         icon: 'warning'
      });
      $('#tipoVisita').focus();
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
     
   let objCita = { func: 'guardar_cita', idCita, idPaciente, nomPaciente, idDoctor, nomDoctor, tipoConsulta, tipoVisita, fechaCita, horaCita, obsCita, solEsfuerzo, solHolter, solMapa };

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
      $('#tipoConsulta').val(0);
      $('#tipoVisita').val(0);
      $('#fechaCita').val('');
      $('#horaCita').val('');
      $('#obsCita').val('');
      $('#modalFormCita').modal('hide');
      $('#pEsfuerzo').prop('checked', false);
      $('#holter').prop('checked', false);
      $('#mapa').prop('checked', false);

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

   $('#'+containerId).html('<div class="text-center mt-5"><span class="loader_bar_2"></span><div class="text-secondary fs-7">Cargando...</div></div>');
   let anio = $('#anioCita').val();
   let mes  = $('#mesCita').val();
   const ultimoDia = new Date(anio, mes, 0).getDate();

   let fechaInicial = anio+'-'+mes+'-01';
   let fechaFinal   = anio+'-'+mes+'-'+ultimoDia;

   let respuesta = await obtiene_citas(fechaInicial, fechaFinal);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      closeLoad();
      $('#'+containerId).html('');
      return;
   }
   else if(respuesta.data.length == 0) {
      let html = 
      `<div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">No se encontraron citas médicas agendadas</p>
      </div>`;
      $('#'+containerId).html(html);
      closeLoad();
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
   let tipo_consulta = '';
   let tipo_visita   = '';
   let txtMes        = '';
   let fecha         = '';
   
   // Contenedor principal usando el sistema de filas de Bootstrap
   let html = `<div class="row g-4 mt-2">`;
   
   data.forEach(cita => {

      txtMes = arrayMeses[(parseInt(cita.fecha.split('-')[1])) - 1];
      fecha  = cita.fecha.split('-');
      fecha  = fecha[2]+' / '+txtMes+' / '+fecha[0];

      // Reiniciar variables por cada iteración
      let sol_holter      = '';
      let sol_mapa        = '';
      let sol_esfuerzo    = '';
      let botonCollapse   = '';
      let seccionCollapse = '';

      // Evaluaciones de tipos de consulta y visita
      cita.tipo_consulta == 1 ? tipo_consulta = 'Consulta' :
      cita.tipo_consulta == 2 ? tipo_consulta = 'Ecocardiograma' : 
      cita.tipo_consulta == 3 ? tipo_consulta = 'Consulta / Ecocardiograma' : tipo_consulta;

      cita.tipo_visita == 1 ? tipo_visita = 'Primera vez' :
      cita.tipo_visita == 2 ? tipo_visita = 'Seguimiento' : tipo_visita;

      // Formateo de estudios solicitados en badges pequeños
      if(cita.sol_esfuerzo == 1) sol_esfuerzo = `<span class="badge bg-light shadow-sm text-dark border me-1 mb-1"><small>Prueba de esfuerzo</small></span>`;
      if(cita.sol_holter == 1)   sol_holter   = `<span class="badge bg-light shadow-sm text-dark border me-1 mb-1"><small>HOLTER</small></span>`;
      if(cita.sol_mapa == 1)     sol_mapa     = `<span class="badge bg-light shadow-sm text-dark border me-1 mb-1"><small>M.A.P.A</small></span>`;

      if(cita.estatus == 1) {
         color   = 'primary';
         estatus = 'Registrada';
      }
      else if(cita.estatus == 2) {
         color   = 'success';
         estatus = 'Atendida';
      }
      else if(cita.estatus == 3) {
         color   = 'danger';
         estatus = 'Cancelada';
         
         // Botón que activa el collapse (solo si está cancelada)
         botonCollapse = `
         <button class="btn btn-sm btn-link text-danger p-0 mt-2 text-decoration-none d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCancel${cita.id_cita}" aria-expanded="false" aria-controls="collapseCancel${cita.id_cita}">
            <i class="bi bi-chevron-down me-1"></i> Ver motivo de cancelación
         </button>`;

         // Estructura del collapse oculto por defecto
         seccionCollapse = `
         <div class="collapse mt-2" id="collapseCancel${cita.id_cita}">
            <div class="alert alert-danger p-2 m-0 fs-8">
               <small class="d-block text-truncate"><strong>Por:</strong> ${cita.user_cancela ?? ''}</small>
               <small class="d-block text-muted"><strong>Fecha:</strong> ${cita.fecha_cancela_format ?? ''}</small>
               <div class="text-dark border-top mt-1 pt-1"><em>"${cita.motivo ?? ''}"</em></div>
            </div>
         </div>`;
      }               

      // Maquetación de la Card (col-xl-3 = 4 por fila, col-md-4 = 3 por fila)
      html += `
      <div class="col-xl-3 col-md-4 col-sm-6" id="cardCita${cita.id_cita}">
         <div class="card h-100 shadow border-0 rounded-3 position-relative overflow-hidden transition-card">
            
            <!-- Línea de color superior según el estatus -->
            <div class="border-top border-5 border-${color}"></div>
            
            <div class="card-body d-flex flex-column p-3">
               
               <!-- Encabezado: ID y Estatus -->
               <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted fw-bold fs-8">ID: #${cita.id_cita}</span>
                  <span class="badge rounded-pill text-${color} border border-${color} bg-${color} bg-opacity-10 fs-8 fw-bold">
                     ${estatus}
                  </span>
               </div>

               <!-- NUEVO FORMATO DE FECHA Y HORA (Mayor relevancia) -->
               <div class="d-flex align-items-center justify-content-between bg-light p-2 rounded-3 mb-3 border-start border-${color} border-3">
                  <div class="d-flex align-items-center">
                     <i class="bi bi-calendar3 text-secondary me-2 fs-5"></i>
                     <div class="lh-sm">
                        <small class="text-muted d-block fs-8 text-uppercase">Fecha</small>
                        <span class="text-dark fw-bold fs-6">${fecha}</span>
                     </div>
                  </div>
                  <div class="text-end lh-sm">
                     <small class="text-muted d-block fs-8 text-uppercase">Hora</small>
                     <span class="text-${color} fw-bolder fs-7">${cita.hora} <span class="fs-8">hrs</span>.</span>
                  </div>
               </div>

               <!-- Información del Paciente -->
               <div class="d-flex align-items-start mb-3">
                  <div class="w-100">
                     <div class="text-dark fw-bold fs-7">${cita.paciente}</div>
                     <div class="text-muted fs-8">Paciente</div>
                     <div class="mt-2">
                        ${sol_esfuerzo} ${sol_mapa} ${sol_holter}
                     </div>
                  </div>
               </div>

               <!-- Información del Médico y Consulta -->
               <div class="p-2 border rounded-2 mb-2 bg-light shadow-sm fs-8">
                  <div class="text-dark mb-1 text-truncate">
                     <i class="bi bi-person-md me-1 text-muted fw-bold"></i>${cita.doctor}
                  </div>
                  <div class="text-muted text-truncate" title="${tipo_consulta}">
                     <i class="bi bi-heart-pulse me-1"></i> ${tipo_consulta}
                  </div>
                  <div class="text-muted fs-8">
                     <i class="bi bi-tag me-1"></i> ${tipo_visita}
                  </div>
               </div>

               <!-- Usuario que registró -->
               <div class="mt-auto pt-2 text-muted fs-8">
                  <i class="bi bi-person-workspace me-1"></i> Registró: <span class="fw-medium">${cita.user_cap}</span>
               </div>

               <!-- Renderizado de elementos de Cancelación (Dinámicos) -->
               ${botonCollapse}
               ${seccionCollapse}

            </div>

            <!-- Botones de Acción / Footer de la Card -->
            <div class="card-footer bg-white border-top-0 p-3 pt-0 text-end">
               <div class="btn-group w-100" role="group">`;

               if(cita.estatus == 1) {
                  html += `
                  <button class="btn btn-sm btn-outline-secondary" title="Editar" onclick="ModalFormCita(${cita.id_cita});">
                     <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-success" title="Marcar como atendida" onclick="fn_cita_atendida(${cita.id_cita}, '${cita.paciente}');">
                     <i class="bi bi-check-lg"></i>
                  </button>`;
               }
               if(cita.estatus == 1 || cita.estatus == 2) {
                  html += `
                  <button class="btn btn-sm btn-outline-secondary" title="Nota médica" onclick="ModalListarNotaMedica(${cita.id_paciente_fk}, '${cita.paciente}', ${cita.id_doctor_fk}, '${cita.doctor}', ${cita.id_cita});">
                     <i class="bi bi-clipboard-plus"></i>
                  </button>`;
               }
               if(cita.estatus == 1) {
                  html += `
                  <button class="btn btn-sm btn-outline-danger" title="Cancelar cita" onclick="ModalCancelarCita(${cita.id_cita}, '${cita.paciente}');">
                     <i class="bi bi-ban"></i>
                  </button>`;
               }

               html += `
               </div>
            </div>
         </div>
      </div>`;
   });
   
   html += `</div>`; // Cierre de .row

   contenedor.innerHTML = html;
   closeLoad();
}

const ModalCancelarCita = (idCita, nomPaciente) => {
   let html = `
   <div class="modal fade" id="modalCancelarCita" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content border-0 shadow-lg rounded-4">
            
            <!-- Cuerpo del Modal -->
            <div class="modal-body p-5">
               <div class="text-center">
                  <!-- Icono de advertencia estilizado -->
                  <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 p-3 mb-4">
                     <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                  </div>
                  
                  <h4 class="fw-bold text-dark mb-2">¿Confirmar cancelación?</h4>
                  <p class="text-muted mb-4">
                     Estás por cancelar la cita de: <br>
                     <strong class="text-dark">${nomPaciente}</strong>
                  </p>
               </div>

               <!-- Campo de Motivo -->
               <div class="mb-4">
                  <label for="motivoCitaCancelada" class="form-label small fw-bold text-secondary tracking-wider">Motivo de cancelación</label>
                  <textarea name="motivoCitaCancelada" id="motivoCitaCancelada" class="form-control border-2 bg-light shadow-none fs-6" rows="3" placeholder="Escribe brevemente el motivo..." maxlength="200"></textarea>
               </div>

               <!-- Acciones -->
               <div class="row g-3">
                  <div class="col-12 col-sm-6 order-sm-2">
                     <button type="button" class="btn btn-danger w-100 fw-bold shadow-sm btn-redondo" onclick="fn_cancelar_cita(${idCita}, '${nomPaciente}');">
                        Confirmar
                     </button>
                  </div>
                  <div class="col-12 col-sm-6 order-sm-1">
                     <button type="button" class="btn btn-outline-light text-secondary w-100 border-0" data-bs-dismiss="modal">
                        Volver atrás
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

      listar_citas('listado_citas', arrCitas);
      showMessageSwalTimer('Cita cancelada correctamente!', '', 'success', 2500);
      $('#modalCancelarCita').modal('hide');
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      return;
   }
}

const fn_cita_atendida = async (idCita, nomPaciente) => {

   if (idCita == '' || nomPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }  
     
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'La cita del paciente: ' + nomPaciente + ' será marcada como atendida', 'question', 'Sí, marcar', 'Cancelar');

   if (!res.result) {
      $('.btnBloqTabpac').prop('disabled', false);
      return;
   }

   $('.btnBloqTabpac').prop('disabled', true);
   let respuesta = await cita_atendida(idCita, nomPaciente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      let index = arrCitas.findIndex(item => item.id_cita == idCita);   
      if (index !== -1) {
         arrCitas[index].estatus = 2;
      }

      listar_citas('listado_citas', arrCitas);
      showMessageSwalTimer('Cita marcada como atendida correctamente!', '', 'success', 2500);
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnBloqTabpac').prop('disabled', false);
      return;
   }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabCitas          = TabCitas;
window.ModalFormCita     = ModalFormCita;
window.ModalCancelarCita = ModalCancelarCita;

window.listar_citas      = listar_citas;
window.combo_pacientes   = combo_pacientes;
window.combo_doctores    = combo_doctores;
window.fn_guardar_cita   = fn_guardar_cita;
window.fn_cancelar_cita  = fn_cancelar_cita;
window.fn_cita_atendida  = fn_cita_atendida;
window.fn_buscar_citas   = fn_buscar_citas;

