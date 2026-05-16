import { obtiene_pacientes, guardar_paciente, eliminar_paciente } from "./PacientesServices.js";

let arrPacientes = [];

const TabPacientes = () => {
   activarLoad('Cargando pacientes...');
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-person-bounding-box"></i> Pacientes</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaCita" onclick="ModalFormPaciente(0, '', 1);"><i class="bi bi-plus-lg"></i> Nuevo paciente</button>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_pacientes"></div>
   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      listar_pacientes('listado_pacientes');
      closeLoad();
   }, 500);
}

const ModalFormPaciente = (idPaciente, nomPaciente, origen) => {

   let text_boton   = '';
   let nombre       = '';
   let ap_paterno   = '';
   let ap_materno   = '';
   let fec_nac      = '';
   let sexo         = 'NA';
   let estado_civil = 'NA';
   let escolaridad  = 'NA';
   let ocupacion    = '';
   let telefono     = '';
   let correo       = '';
   let direccion    = '';
   let colonia      = '';
   let municipio    = '';
   let entidad      = 'NA';
   let religion     = '';
   let aseguradora  = '';

   if(idPaciente == 0) {
      text_boton = 'Guardar';
   }
   else {
      text_boton = 'Guardar cambios';
      let pacienteSelect = arrPacientes.filter(pac => pac.id_paciente == idPaciente);
    
      nombre       = pacienteSelect[0].nombre;
      ap_paterno   = pacienteSelect[0].ap_paterno;
      ap_materno   = pacienteSelect[0].ap_materno;
      fec_nac      = pacienteSelect[0].fecha_nac;
      sexo         = pacienteSelect[0].sexo;
      estado_civil = pacienteSelect[0].estado_civil;
      escolaridad  = pacienteSelect[0].escolaridad;
      ocupacion    = pacienteSelect[0].ocupacion;
      telefono     = pacienteSelect[0].telefono;
      correo       = pacienteSelect[0].correo;
      direccion    = pacienteSelect[0].direccion;
      colonia      = pacienteSelect[0].colonia;
      municipio    = pacienteSelect[0].municipio;
      entidad      = pacienteSelect[0].entidad_fed;
      religion     = pacienteSelect[0].religion;
      aseguradora  = pacienteSelect[0].aseguradora;
   }

   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormPaciente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Ficha de Identificación del Paciente</h1>
               <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Nombre *</b>
                     <input type="text" name="nomPaciente" id="nomPaciente" class="form-control" maxlength="100" value="${nombre}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Ap. Paterno *</b>
                     <input type="text" name="apPaciente" id="apPaciente" class="form-control" maxlength="70" value="${ap_paterno}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Ap. Materno</b>
                     <input type="text" name="amPaciente" id="amPaciente" class="form-control" maxlength="70" value="${ap_materno}">
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Fecha de nacimiento *</b>
                     <input type="date" name="fechaNacimiento" id="fechaNacimiento" class="form-control" value="${fec_nac}">
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Sexo</b>
                     <select name="sexoPaciente" id="sexoPaciente" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                     </select>
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Estado civil</b>
                     <select name="estadoCivilPaciente" id="estadoCivilPaciente" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="Casado">Casado</option>
                        <option value="Soltero">Soltero</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viudo">Viudo</option>
                        <option value="Concubinato">Concubinato</option>
                     </select>
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Escolaridad</b>
                     <select name="escolaridadPaciente" id="escolaridadPaciente" class="form-select">
                        <option value="NA">Seleccionar</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Bachillerato">Bachillerato</option>
                        <option value="Licenciatura">Licenciatura</option>
                        <option value="Posgrado">Posgrado</option>
                        <option value="Sin estudios">Sin estudios</option>
                     </select>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Ocupación</b>
                     <input type="text" name="ocupacion" id="ocupacion" class="form-control" maxlength="150" value="${ocupacion}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Teléfono *</b>
                     <input type="tel" name="telefono" id="telefono" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="10" value="${telefono}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Correo</b>
                     <input type="email" name="correoPaciente" id="correoPaciente" class="form-control" maxlength="150" value="${correo}">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <input type="text" name="direccionPaciente" id="direccionPaciente" class="form-control" maxlength="200" value="${direccion}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Colonia *</b>
                     <input type="text" name="coloniaPaciente" id="coloniaPaciente" class="form-control" maxlength="100" value="${colonia}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Municipio</b>
                     <input type="text" name="municipioPaciente" id="municipioPaciente" class="form-control" maxlength="150" value="${municipio}">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Estado</b>
                     <select name="entidadPaciente" id="entidadPaciente" class="form-select">
                        <option value="NA">Seleccionar</option>
                        ${estadosMexico}
                     </select>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Religión</b>
                     <input type="text" name="religionPaciente" id="religionPaciente" class="form-control" maxlength="100" value="${religion}">
                  </div>
                  <div class="col-md-8 col-sm-6 col-12 mt-3">
                     <b>Aseguradora</b>
                     <input type="text" name="aseguradoraPaciente" id="aseguradoraPaciente" class="form-control" maxlength="100" value="${aseguradora}">
                  </div>
               </div>
            </div>
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarPaciente" onclick="fn_guardar_paciente(${idPaciente}, ${origen});">
                  ${text_boton}
               </button>
               <button type="buttton" class="btn btn-outline-dark btn-redondo" data-bs-dismiss="modal">
                  Cerrar
               </button>
            </div>
         </div>
      </div>
   </div>`;
   $('#modalAdminExt').html(html);
   $('#modalFormPaciente').modal('show');

   if(idPaciente > 0) {
      setTimeout(() => {
         $('#sexoPaciente').val(sexo);
         $('#estadoCivilPaciente').val(estado_civil);
         $('#escolaridadPaciente').val(escolaridad);
         $('#entidadPaciente').val(entidad);
      }, 500);
   }
}

const fn_guardar_paciente = async (idPaciente, origen) => {

   let nomPaciente         = $('#nomPaciente').val().trim();
   let apPaciente          = $('#apPaciente').val().trim();
   let amPaciente          = $('#amPaciente').val().trim();
   let fechaNacimiento     = $('#fechaNacimiento').val();
   let sexoPaciente        = $('#sexoPaciente').val();
   let estadoCivilPaciente = $('#estadoCivilPaciente').val();
   let escolaridadPaciente = $('#escolaridadPaciente').val();
   let ocupacion           = $('#ocupacion').val().trim();
   let telefono            = $('#telefono').val().trim();
   let correoPaciente      = $('#correoPaciente').val().trim();
   let direccionPaciente   = $('#direccionPaciente').val().trim();
   let coloniaPaciente     = $('#coloniaPaciente').val().trim();
   let municipioPaciente   = $('#municipioPaciente').val().trim();
   let entidadPaciente     = $('#entidadPaciente').val();
   let religionPaciente    = $('#religionPaciente').val().trim();
   let aseguradoraPaciente = $('#aseguradoraPaciente').val().trim();

   if (nomPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el nombre del paciente',
         icon: 'warning'
      });
      $('#nomPaciente').focus();
      return;
   }
   else if (apPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar el apellido paterno del paciente',
         icon: 'warning'
      });
      $('#apPaciente').focus();
      return;
   }
   else if (fechaNacimiento == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una fecha de nacimiento',
         icon: 'warning'
      });
      $('#fechaNacimiento').focus();
      return;
   }
   else if (telefono == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una número telefónico',
         icon: 'warning'
      });
      $('#telefono').focus();
      return;
   }
   else if (direccionPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una dirección',
         icon: 'warning'
      });
      $('#direccionPaciente').focus();
      return;
   }
   else if (coloniaPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Debes ingresar una colonia',
         icon: 'warning'
      });
      $('#colonia').focus();
      return;
   }
     
   let objPaciente = { func: 'guardar_paciente', idPaciente, nomPaciente, apPaciente, amPaciente, fechaNacimiento, sexoPaciente, estadoCivilPaciente, escolaridadPaciente, ocupacion, telefono, correoPaciente, direccionPaciente, coloniaPaciente, municipioPaciente, entidadPaciente, religionPaciente, aseguradoraPaciente };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El paciente: ' + nomPaciente + ' será registrado', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      $('#btnGuardarPaciente').prop('disabled', false);
      return;
   }

   $('#btnGuardarPaciente').prop('disabled', true);
   let respuesta = await guardar_paciente(objPaciente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Paciente guardado correctamente', '', 'success', 2500);
      let nomPaciente         = $('#nomPaciente').val().trim();
      $('#apPaciente').val('');
      $('#amPaciente').val('');
      $('#fechaNacimiento').val('');
      $('#sexoPaciente').val('NA');
      $('#estadoCivilPaciente').val('NA');
      $('#escolaridadPaciente').val('NA');      
      $('#ocupacion').val('');
      $('#telefono').val('');
      $('#correoPaciente').val('');
      $('#direccionPaciente').val('');
      $('#coloniaPaciente').val('');
      $('#municipioPaciente').val('');
      $('#entidadPaciente').val('NA');
      $('#religionPaciente').val('');        
      $('#modalFormPaciente').modal('hide');
      $('#btnGuardarPaciente').prop('disabled', false);
      if(origen == 2) { //Viene desde la modal de registrar cita
         combo_pacientes('pacienteCita');
         setTimeout(() => {
            $('#pacienteCita').val(respuesta.data[0]);
            $('#pacienteCita').trigger('change');
         }, 500);
      }
      else {
         listar_pacientes('listado_pacientes');
      }
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnGuardarPaciente').prop('disabled', false);
      return;
   }
}

const fn_eliminar_paciente = async (idPaciente, nomPaciente) => {

   if (idPaciente == '' || nomPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes, actualiza y vuelve a intentarlo',
         icon: 'warning'
      });
      return;
   }  
     
   const res = await showMessageSwalQuestion('¿Estás seguro?', 'El paciente: ' + nomPaciente + ' será eliminado', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      $('.btnBloqTabpac').prop('disabled', false);
      return;
   }

   $('.btnBloqTabpac').prop('disabled', true);
   let respuesta = await eliminar_paciente(idPaciente, nomPaciente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('Paciente eliminado correctamente', '', 'success', 2500);            
      $('.btnBloqTabpac').prop('disabled', false);
      let tabla = $('#tablePacientes').DataTable();
      tabla.row($('#trPaciente' + idPaciente)).remove().draw();
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('.btnBloqTabpac').prop('disabled', false);
      return;
   }
}

const listar_pacientes = async (containerId) => {
   arrPacientes = [];
   let respuesta = await obtiene_pacientes();
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus != 200) {
      showMessageSwalTimer('Ocurrio un error: ', respuesta.mensaje, 'error', 2500);
      return;
   }
   else if(respuesta.data.length == 0) {
      let html = 
      `<div class="text-center py-5">
         <img src="assets/images/no_encontrado.png" class="img-fluid mb-3">
         <p class="text-muted">No se encontraron pacientes registrados</p>
      </div>`;
      $('#'+containerId).html(html);
      closeLoad();
   }
   else {
      arrPacientes = await respuesta.data;
      pinta_listado_pacientes(containerId, arrPacientes);
   }
}

const pinta_listado_pacientes = (containerId, data) => {
   const contenedor = document.getElementById(containerId); 
   
   let perfilUs = $('#perfilUs').val().trim();

   let html = `
   <div class="table-responsive mt-4">
      <table id="tablePacientes" class="table table-hover align-middle w-100">
         <thead class="bg-light">
            <tr>
               <th>ID</th>
               <th class="py-3 text-secondary" width="17%">Paciente</th>
               <th class="py-3 text-secondary" width="10%">Fecha nacimiento</th>
               <th class="py-3 text-secondary" width="10%">Teléfono</th>
               <th class="py-3 text-secondary" width="15%">Correo</th>
               <th class="py-3 text-secondary" width="25%">Dirección</th>
               <th class="py-3 text-center text-secondary" width="23%">Acciones</th>
            </tr>
         </thead>
         <tbody>`;
            data.forEach(row => {
               html += `
               <tr id="trPaciente${row.id_paciente}">
                  <td>${row.id_paciente}</td>
                  <td>
                     <div class="d-flex align-items-center">
                        <div class="btn-redondo d-flex align-items-center justify-content-center me-2 badge_nombre">
                           <span class="text-secondary fw-bold fs-7">${row.nombre.charAt(0)}</span>
                        </div>
                        <span class="text-dark fw-medium">${row.nombre} ${row.ap_paterno} ${row.ap_materno ?? ''}</span>
                     </div>
                  </td>
                  <td class="text-center">${row.fecha_nac_format}</td>
                  <td class="text-center">${row.telefono}</td>
                  <td class="text-center">${row.correo}</td>
                  <td>${row.direccion}</td>
                  <td class="text-center">
                     <!--
                     <button class="btn btn-dark btn-lib fs-7 btnBloqTabpac ms-1" title="Expediente Clínico" onclick="fn_elige_modal_expediente(${row.id_paciente}, '${row.nombre} ${row.ap_paterno} ${row.ap_materno}', 0, '');">
                        <i class="bi bi-person-rolodex"></i>
                     </button>
                     -->
                     <button class="btn btn-outline-dark fs-7 btnBloqTabpac" title="Editar" onclick="ModalFormPaciente(${row.id_paciente}, '${row.nombre} ${row.ap_paterno} ${row.ap_materno}', 1);">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button class="btn btn-outline-dark fs-7 btnBloqTabpac ms-1" title="Nota médica" onclick="ModalListarNotaMedica(${row.id_paciente}, '${row.nombre} ${row.ap_paterno} ${row.ap_materno}', 0, '', 0);">
                        <i class="bi bi-clipboard-plus"></i>
                     </button>
                     <button class="btn btn-outline-dark fs-7 btnBloqTabpac ms-1" title="Expediente PDF" onclick="fn_muestra_expediente('${row.key_query}');">
                        <i class="bi bi-list-columns"></i>
                     </button>`;
                     if(perfilUs != 3) {
                        html+=`
                        <button class="btn btn-outline-danger fs-7 btnBloqTabpac ms-1" title="Eliminar" onclick="fn_eliminar_paciente(${row.id_paciente}, '${row.nombre} ${row.ap_paterno} ${row.ap_materno}');">
                           <i class="bi bi-trash"></i>
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

   setTimeout(() => {
      initDataTableExport({
        tableId: '#tablePacientes',
        titulo: 'Listado de Pacientes',
        alignment: ['10%', '10%', '50%', '10%', '10%'],
        exportColumns: [0, 1, 2, 3, 4]
      });
   }, 500);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabPacientes                     = TabPacientes;
window.ModalFormPaciente                = ModalFormPaciente; 

// Funciones 
window.fn_guardar_paciente              = fn_guardar_paciente;
window.fn_eliminar_paciente             = fn_eliminar_paciente;
