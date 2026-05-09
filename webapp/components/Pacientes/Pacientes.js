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
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaCita" onclick="ModalFormPaciente(0, '');"><i class="bi bi-plus-lg"></i> Nuevo paciente</button>
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

const ModalFormPaciente = (idPaciente, nomPaciente) => {

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
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
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
                     <input type="mail" name="correoPaciente" id="correoPaciente" class="form-control" maxlength="150" value="${correo}">
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
               <button type="button" class="btn btn-dark btn-redondo btn-lib" id="btnGuardarPaciente" onclick="fn_guardar_paciente(${idPaciente});">
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

const fn_guardar_paciente = async (idPaciente) => {

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
      listar_pacientes('listado_pacientes');
      $('#modalFormPaciente').modal('hide');
      $('#btnGuardarPaciente').prop('disabled', false);
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
   else {
      arrPacientes = await respuesta.data;
      pinta_listado_pacientes(containerId, arrPacientes);
   }
}

const pinta_listado_pacientes = (containerId, data) => {
   const contenedor = document.getElementById(containerId);   

   let html = `
   <div class="table-responsive mt-4">
      <table id="tablePacientes" class="table table-hover align-middle w-100">
         <thead class="bg-light">
            <tr>
               <th>ID</th>
               <th class="py-3 text-secondary" width="20%">Paciente</th>
               <th class="py-3 text-secondary" width="10%">Fecha nacimiento</th>
               <th class="py-3 text-secondary" width="10%">Teléfono</th>
               <th class="py-3 text-secondary" width="15%">Correo</th>
               <th class="py-3 text-secondary" width="25%">Dirección</th>
               <th class="py-3 text-center text-secondary" width="20%">Acciones</th>
            </tr>
         </thead>
         <tbody>`;
            data.forEach(row => {
               html += `
               <tr id="trPaciente${row.id_paciente}">
                  <td>${row.id_paciente}</td>
                  <td>
                     <div class="d-flex align-items-center">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-2 badge_nombre">
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
                     <button class="btn btn-outline-dark fs-7 btnBloqTabpac" title="Editar" onclick="ModalFormPaciente(${row.id_paciente}, '${row.nombre} ${row.ap_paterno} ${row.ap_materno}');">
                        <i class="bi bi-pencil"></i>
                     </button>
                     <button class="btn btn-outline-dark fs-7 btnBloqTabpac ms-1" title="Expediente Clínico" onclick="ModalFormExpClinico();">
                        <i class="bi bi-person-rolodex"></i>
                     </button>
                     <button class="btn btn-outline-dark fs-7 btnBloqTabpac ms-1" title="Nota médica" onclick="ModalFormNotaMedica();">
                        <i class="bi bi-clipboard-plus"></i>
                     </button>
                     <button class="btn btn-outline-dark fs-7 btnBloqTabpac ms-1" title="Expediente PDF">
                        <i class="bi bi-list-columns"></i>
                     </button>
                     <button class="btn btn-outline-danger fs-7 btnBloqTabpac ms-1" title="Eliminar" onclick="fn_eliminar_paciente(${row.id_paciente}, '${row.nombre} ${row.ap_paterno} ${row.ap_materno}');">
                        <i class="bi bi-trash"></i>
                     </button>
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ANTECEDENTES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ModalFormExpClinico = () => {
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
                        <button class="nav-link py-3 active text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesFamiliares();">
                           <i class="bi bi-people"></i> Heredo-Fam
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
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesCronicos();">
                           <i class="bi bi-activity me-1"></i>Crónico/Degenerativos
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab" onclick="FormAntecedentesCardiovasculares();">
                           <i class="bi bi-heart-pulse me-1"></i> Cardiovasculares
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
               <div id="antecedente_heredo_familiar" class="si-display"></div>
               <div id="antecedente_no_patologico" class="no-display"></div>
               <div id="antecedente_patologico" class="no-display"></div>
               <div id="antecedente_cronico_degenerativo" class="no-display"></div>
               <div id="antecedente_cardiovascular" class="no-display"></div>
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
   $('#modalAdmin').html(html);
   $('#modalFormExpediente').modal('show');
   setTimeout(() => {
      FormAntecedentesFamiliares();
   }, 100);
}

const FormAntecedentesFamiliares = () => {
   let html = 
   `<div class="card p-3 border-0 shadow">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
           <i class="bi bi-people"></i> Antecedenes Heredo-Familiares
         </div>
         <div class="col-md-3 col-sm-4 col-6">
            <strong>Familiar *</strong>
            <select name="tipoFamiliar" id="tipoFamiliar" class="form-select">
               <option value="0">Seleccionar</option>
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
            <select name="padecimientoFamiliar" id="padecimientoFamiliar" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Diabetes">Diabetes</option>
               <option value="Hipertensión">Hipertensión</option>
               <option value="Cardiopatía">Cardiopatía</option>
               <option value="Dislipidemia">Dislipidemia</option>
               <option value="Cáncer">Cáncer</option>
               <option value="Otro">Otro</option>
            </select>
         </div>
         <div class="col-md-4 col-sm-4 col-12">
            <strong>Otro *</strong>
            <input type="text" name="otroAntecedenteFamiliar" id="otroAntecedenteFamiliar" class="form-control" maxlength="100">
         </div>
         <div class="col-md-2 col-sm-12 col-12">
            <br>
            <button type="button" class="btn btn-dark btn-lib w-100 btn-redondo">
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
      cargar_antecedentes_familiares('listado_antecedentes_familiares');
   }, 500);
}

const cargar_antecedentes_familiares = (containerId) => {
   const contenedor = document.getElementById(containerId);
   
   // Datos de ejemplo para la demo
   const antecedentes = [
      { id: '1', familiar: 'Abuelo Paterno', padecimiento: 'Diabetes' },
      { id: '2', familiar: 'Abuelo Paterno', padecimiento: 'Dolores reumáticos' },
      { id: '3', familiar: 'Abuela Paterna', padecimiento: 'Hipertensión' }
   ];

   let html = `
   <div class="row">`;
      antecedentes.forEach(row => {
         html += `
         <div class="col-md-4 col-sm-4 col-12">
            <div class="card shadow-sm">
               <div class="card-body">
                  <i class="bi bi-person-circle fs-4 text-muted"></i> 
                  <div class="fw-bold">${row.familiar}</div>
                  <div class="text-secondaty mt-2"><i class="bi bi-prescription2"></i> ${row.padecimiento}</div>
                  <div class="text-end">
                     <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                  </div>
               </div>
            </div>
         </div>`;
      });
      html += `
   </div>`;
   contenedor.innerHTML = html;
}

const FormAntecedentesNoPatologicos = () => {
   let html = 
   `<div class="card p-3 border-0 shadow">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
            <i class="bi bi-person-walking me-1"></i>Antecedenes No Patológicos
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Hábitat *</strong>
            <select name="habitat" id="habitat" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Urbano">Urbano</option>
               <option value="Rural">Rural</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Cuénta con servicios básicos *</strong>
            <select name="serviciosBasicos" id="serviciosBasicos" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Viajes al extranjero *</strong>
            <select name="viajeExtranjero" id="viajeExtranjero" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Hace cuánto</strong>
            <input type="text" name="tiempoViaje" id="tiempoViaje" class="form-control" maxlength="50" disabled>
         </div>
         <div class="col-md-3 col-sm-4 col-12 mt-3">
            <strong>Dónde</strong>
            <input type="text" name="dondeViajo" id="dondeViajo" class="form-control" maxlength="100" disabled>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Fímicos *</strong>
            <select name="fimicos" id="fimicos" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Positivo">Positivo</option>
               <option value="Negativo">Negativo</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Actividad física *</strong>
            <select name="actividadFisica" id="actividadFisica" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>¿Cuál?</strong>
            <input type="text" name="ejercicio" id="ejercicio" class="form-control" maxlength="100" disabled>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Horas por semana</strong>
            <input type="text" name="horasEjercicio" id="horasEjercicio" class="form-control" maxlength="50" disabled>
         </div>
         <div class="col-md-2 col-sm-12 col-12 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib w-100 btn-redondo">
               Guardar
            </button>
         </div>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 mt-4">
         <div id="listado_antecedentes_familiares"></div>
      </div>
   </div>`;
   $('#antecedente_no_patologico').html(html);
   $('#antecedente_no_patologico').show();

   $('#antecedente_heredo_familiar').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_cronico_degenerativo').hide();
   $('#antecedente_cardiovascular').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const FormAntecedentesPatologicos = () => {
   let html = 
   `<div class="card p-3 border-0 shadow">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
           <i class="bi bi-virus me-1"></i>Antecedenes Patológicos
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Tabaquismo *</strong>
            <select name="tabaquismo" id="tabaquismo" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Positivo">Positivo</option>
               <option value="Negativo">Negativo</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Cuántos cigarros por día</strong>
            <input type="number" inputmode="numeric" name="cigarrosPorDia" id="cigarrosPorDia" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="3" disabled />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Años</strong>
            <input type="number" inputmode="numeric" name="aniosFumando" id="aniosFumando" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4" disabled />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Suspendido hace (años)</strong>
            <input type="number" inputmode="numeric" name="aniosFumando" id="aniosFumando" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4" disabled />
         </div>

         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Etilismo *</strong>
            <select name="etilismo" id="etilismo" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Positivo">Positivo</option>
               <option value="Negativo">Negativo</option>
            </select>
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Qué tipo</strong>
            <input type="text" name="tipoAlcohol" id="tipoAlcohol" class="form-control" maxlength="50" disabled />
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Cuántas por semana</strong>
            <input type="number" inputmode="numeric" name="cuantasBebeSemana" id="cuantasBebeSemana" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="3" disabled />
         </div>

         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Drogas *</strong>
            <select name="drogas" id="drogas" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Positivo">Positivo</option>
               <option value="Negativo">Negativo</option>
            </select>
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Qué tipo</strong>
            <input type="text" name="tipoDroga" id="tipoDroga" class="form-control" maxlength="50" disabled />
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Cuántas por semana</strong>
            <input type="text" inputmode="numeric" name="cuantasDrogasSemana" id="cuantasDrogasSemana" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="3" disabled />
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Exposición a biomasa</strong>
            <select name="biomasa" id="biomasa" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Positivo">Positivo</option>
               <option value="Negativo">Negativo</option>
            </select>
         </div>         
         <div class="col-md-2 col-sm-12 col-12 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib w-100 btn-redondo">
               Guardar
            </button>
         </div>
      </div>
   </div>

   <div class="card p-3 border-0 shadow mt-4">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            Alergias
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Alergias</strong>
            <select name="alergias" id="alergias" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Positivo">Positivo</option>
               <option value="Negativo">Negativo</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Tipo</strong>
            <input type="text" name="tipoAlergia" id="tipoAlergia" class="form-control" maxlength="50" disabled />
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Reacción</strong>
            <input type="text" name="reaccionAlergia" id="reaccionAlergia" class="form-control" maxlength="100" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo w-100">Agregar</button>
         </div>
         <div class="col-12 mt-3">
            <div id="listado_alergias p-2">
               <div class="row">

                  <div class="col-xxl-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Sulfa</span>
                           <div class="">Reacción: Ronchas</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="col-xxl-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Gato</span>
                           <div class="">Reacción: Rinitis, inflamación de la nariz</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </div>
   </div>
   
      
   <div class="card p-3 border-0 shadow mt-4">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            Cirugías
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Cirugías</strong>
            <select name="cirugias" id="cirugias" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Cuál</strong>
            <input type="text" name="tipoCirugia" id="tipoCirugia" class="form-control" maxlength="50" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Que año</strong>
            <input type="text" inputmode="numeric" name="anioCirugia" id="anioCirugia" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4" disabled />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Complicación</strong>
            <input type="text" name="complicacionCirugia" id="complicacionCirugia" class="form-control" maxlength="100" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo w-100">Agregar</button>
         </div>
         <div class="col-12 mt-3">
            <div id="listado_cirugias p-2">
               <div class="row">
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Hernia (2002)</span>
                           <div class="">Complicación: No se presentó</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   
   
   <div class="card p-3 border-0 shadow mt-4">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            Fracturas
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Fracturas</strong>
            <select name="fracturas" id="fracturas" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Cuál</strong>
            <input type="text" name="tipoFractura" id="tipoFractura" class="form-control" maxlength="50" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Que año</strong>
            <input type="text" inputmode="numeric" name="anioFractura" id="anioFractura" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4" disabled />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Complicación</strong>
            <input type="text" name="complicacionFractura" id="complicacionFractura" class="form-control" maxlength="100" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo w-100">Agregar</button>
         </div>
         <div class="col-12 mt-3">
            <div id="listado_fracturas p-2">
               <div class="row">
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Muñeca derecha (2010)</span>
                           <div class="">Complicación: No se presentó</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   
   <div class="card p-3 border-0 shadow mt-4">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            Transfusiones
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Transfusiones</strong>
            <select name="transfusiones" id="transfusiones" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Que año</strong>
            <input type="text" inputmode="numeric" name="anioTransfusion" id="anioTransfusion" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4" disabled />
         </div>
         <div class="col-md-6 col-sm-4 col-6 mt-3">
            <strong>Por qué</strong>
            <input type="text" name="motivoTransfusion" id="motivoTransfusion" class="form-control" maxlength="100" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo w-100">Agregar</button>
         </div>
         <div class="col-12 mt-3">
            <div id="listado_alergias p-2">
               <div class="row">
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">2002</span>
                           <div class="">Por la operación de la hernia</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>`;

   $('#antecedente_patologico').html(html);
   $('#antecedente_patologico').show();

   $('#antecedente_heredo_familiar').hide();
   $('#antecedente_no_patologico').hide();
   $('#antecedente_cronico_degenerativo').hide();
   $('#antecedente_cardiovascular').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const FormAntecedentesCronicos = () => {
   let html = 
   `<div class="card p-3 border-0 shadow">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            <i class="bi bi-activity me-1"></i>Antecedentes Crónico / Degenerativos
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Enfermedad</strong>
            <select name="enfermedad" id="enfermedad" class="form-select">
               <option value="0">Seleccionar</option>
               <option value="Diabetes">Diabetes</option>
               <option value="Hipertensión">Hipertensión</option>
               <option value="Otra">Otra</option>
            </select>
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Otra enfermedad</strong>
            <input type="text" name="otraEnfermedad" id="otraEnfermedad" class="form-control" maxlength="100" disabled />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Año diagnóstico</strong>
            <input type="number" inputmode="numeric" name="anioEnfermedad" id="anioEnfermedad" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo w-100">Agregar</button>
         </div>
         <div class="col-12 mt-3">
            <div id="listado_enfermedades_cronicas p-2">

               <div class="row">
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Hipertensión</span>
                           <div class="">Año diagnóstico: 2000</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Diabetes</span>
                           <div class="">Año diagnóstico: 2010</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   </div>`;

   $('#antecedente_cronico_degenerativo').html(html);
   $('#antecedente_cronico_degenerativo').show();

   $('#antecedente_heredo_familiar').hide();
   $('#antecedente_no_patologico').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_cardiovascular').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const FormAntecedentesCardiovasculares = () => {
   let html = 
   `<div class="card p-3 border-0 shadow mt-4">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            <i class="bi bi-heart-pulse me-1"></i>Antecedentes Cardiovasculares
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Enfermedad</strong>
            <select name="enfermedadCardio" id="enfermedadCardio" class="form-select">
               <option value="NA">Seleccionar</option>
               <option value="Cardiopatía Coronaria">Cardiopatía Coronaria</option>
               <option value="Accidente Cerebrovascular">Accidente Cerebrovascular</option>
               <option value="Insuficiencia Cardíaca">Insuficiencia Cardíaca</option>
               <option value="Otra">Otra</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-3 col-6 mt-3">
            <strong>Otra enfermedad</strong>
            <input type="text" name="otraEnfermedadCardio" id="otraEnfermedadCardio" class="form-control" maxlength="100" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>Año diagnóstico</strong>
            <input type="number" inputmode="numeric" name="anioEnfermedadCardio" id="anioEnfermedadCardio" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="4" disabled />
         </div>
         <div class="col-md-3 col-sm-3 col-6 mt-3">
            <strong>Proc / Estudio</strong>
            <input type="text" name="procEnfermedadCardio" id="procEnfermedadCardio" class="form-control" maxlength="100" disabled />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo w-100">Agregar</button>
         </div>
         <div class="col-12 mt-3">
            <div id="listado_enfermedades_cronicas p-2">

               <div class="row">
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Cardiopatía Coronaria</span>
                           <div class="">Año diagnóstico: 2000</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bold">Insuficiencia Cardíaca</span>
                           <div class="">Año diagnóstico: 2010</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   </div>`;

   $('#antecedente_cardiovascular').html(html);
   $('#antecedente_cardiovascular').show();

   $('#antecedente_heredo_familiar').hide();
   $('#antecedente_no_patologico').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_cronico_degenerativo').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const FormAntecedentesGinecoObstetra = () => {
   let html = 
   `<div class="card p-3 border-0 shadow">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
            <i class="bi bi-gender-female me-1"></i> Antecedenes Gineco-Obstétrico
         </div>
         <div class="col-md-3 col-sm-4 col-6">
            <strong>Menarca</strong>
            <input type="text" name="menarca" id="menarca" class="form-control" maxlength="100">
         </div>
         <div class="col-12 mt-4 fs-6 fw-bold">
            Ciclo menstrual
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Frecuencia</strong>
            <input type="text" name="frecuenciaMenstruacion" id="frecuenciaMenstruacion" class="form-control" maxlength="50">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Duración</strong>
            <input type="text" name="duracionMenstruacion" id="duracionMenstruacion" class="form-control" maxlength="50">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Cantidad</strong>
            <input type="text" name="cantidadMenstruacion" id="cantidadMenstruacion" class="form-control" maxlength="50">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Dismenorrea</strong>
            <input type="text" name="dismenorreaMenstruacion" id="dismenorreaMenstruacion" class="form-control" maxlength="50">
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Inicio de vida sexual activa</strong>
            <input type="text" name="inicioVidaSexual" id="inicioVidaSexual" class="form-control" maxlength="50">
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Embarazos</strong>
            <input type="number" inputmode="numeric" name="noEmbarazos" id="noEmbarazos" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Partos</strong>
            <input type="number" inputmode="numeric" name="noPartos" id="noPartos" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Abortos</strong>
            <input type="number" inputmode="numeric" name="noAbortos" id="noAbortos" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Cesareas</strong>
            <input type="number" inputmode="numeric" name="noCesareas" id="noCesareas" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Método anticonceptivo</strong>
            <input type="text" name="metodoAnticonceptivo" id="metodoAnticonceptivo" class="form-control" maxlength="100" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Fecha última menstruación</strong>
            <input type="date" name="ultimaMenstruacion" id="ultimaMenstruacion" class="form-control" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>ETS</strong>
            <input type="text" name="ets" id="ets" class="form-control" maxlength="100" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Menopausia</strong>
            <input type="text" name="menopausia" id="menopausia" class="form-control" maxlength="100" />
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Climaterio</strong>
            <input type="text" name="climaterio" id="climaterio" class="form-control" maxlength="100" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Fecha de último papanicolaou</strong>
            <input type="date" name="ultimoPapanicolaou" id="ultimoPapanicolaou" class="form-control" />
         </div>
         <div class="col-md-5 col-sm-4 col-6 mt-3">
            <strong>Resultado</strong>
            <input type="text" name="resultadoPapanicolaou" id="resultadoPapanicolaou" class="form-control" maxlength="100" />
         </div>
         <div class="col-12 mt-3 text-center">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo w-25">
               Guardar
            </button>
         </div>
      </div>
   </div>
   <div class="row mt-3">
      <div class="col-12 mt-4">
         <div id="listado_antecedentes_familiares"></div>
      </div>
   </div>`;
   $('#antecedente_no_patologico').html(html);
   $('#antecedente_no_patologico').show();

   $('#antecedente_heredo_familiar').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_cronico_degenerativo').hide();
   $('#antecedente_cardiovascular').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabPacientes                     = TabPacientes;
window.ModalFormPaciente                = ModalFormPaciente; 
window.ModalFormExpClinico              = ModalFormExpClinico;

window.FormAntecedentesFamiliares       = FormAntecedentesFamiliares;
window.FormAntecedentesNoPatologicos    = FormAntecedentesNoPatologicos;
window.FormAntecedentesPatologicos      = FormAntecedentesPatologicos;
window.FormAntecedentesCronicos         = FormAntecedentesCronicos;
window.FormAntecedentesCardiovasculares = FormAntecedentesCardiovasculares;
window.FormAntecedentesGinecoObstetra   = FormAntecedentesGinecoObstetra;

// Funciones 
window.fn_guardar_paciente              = fn_guardar_paciente;
window.fn_eliminar_paciente             = fn_eliminar_paciente;
