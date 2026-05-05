// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES MODAL LISTADO PEDIDOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const TabPacientes = () => {
   activarLoad('Cargando pacientes...');
   let html =
   `<div class="row">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-8 col-6 mt-2">
         <div class="fs-4"> <i class="bi bi-person-bounding-box"></i> Pacientes</div>
      </div>
      <div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-6 mt-2">
         <button class="btn btn-dark btn-lib btn-redondo w-100 fs-6" type="button" id="btnNuevaCita" onclick="ModalFormPaciente();"><i class="bi bi-plus-lg"></i> Nuevo paciente</button>
      </div>
   </div>
   <div class="mt-4">
      <div id="listado_pacientes"></div>
   </div>`;

   $('#containerMain').html(html);
   setTimeout(() => {
      pintarYInicializarPacientes('listado_pacientes');
      closeLoad();
   }, 500);
}

const ModalFormPaciente = () => {
   let html = `
   <div class="modal fade modal-superior-blur" id="modalFormPaciente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-xl modal-fullscreen-md-down">
         <div class="modal-content sombra-modal">
            
            <div class="modal-header modal-head-per">
               <h1 class="modal-title fs-5">Ficha de Identificación</h1>
               <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" aria-label="Close">
                  <i class="bi bi-x-lg"></i>
               </button>
            </div>
            
            <div class="modal-body bg-light">
               <div class="row">
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Nombre *</b>
                     <input type="text" name="nomPaciente" id="nomPaciente" class="form-control" maxlength="100">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Ap. Paterno *</b>
                     <input type="text" name="apPaciente" id="apPaciente" class="form-control" maxlength="70">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Ap. Materno</b>
                     <input type="text" name="amPaciente" id="amPaciente" class="form-control" maxlength="70">
                  </div>
                  <div class="col-md-3 col-sm-6 col-12 mt-3">
                     <b>Fecha de nacimiento *</b>
                     <input type="date" name="fechaNacimiento" id="fechaNacimiento" class="form-control">
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Sexo</b>
                     <select name="sexoPaciente" id="sexoPaciente" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Hombre</option>
                        <option value="2">Mujer</option>
                     </select>
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Estado civil</b>
                     <select name="estadoCivilPaciente" id="estadoCivilPaciente" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Casado</option>
                        <option value="2">Soltero</option>
                        <option value="3">Divorciado</option>
                        <option value="4">Viudo</option>
                        <option value="5">Concubinato</option>
                     </select>
                  </div>
                  <div class="col-md-3 col-sm-6 col-6 mt-3">
                     <b>Escolaridad</b>
                     <select name="escolaridadPaciente" id="escolaridadPaciente" class="form-select">
                        <option value="0">Seleccionar</option>
                        <option value="1">Primaria</option>
                        <option value="2">Secundaria</option>
                        <option value="3">Bachillerato</option>
                        <option value="4">Licenciatura</option>
                        <option value="5">Posgrado</option>
                        <option value="6">Sin estudios</option>
                     </select>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Ocupación</b>
                     <input type="text" name="fechaNacimiento" id="fechaNacimiento" class="form-control" maxlength="150">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Teléfono *</b>
                     <input type="tel" name="fechaNacimiento" id="fechaNacimiento" class="form-control" onkeypress="return fnValidaNumeros(event);" maxlength="10">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Correo</b>
                     <input type="mail" name="correoPaciente" id="correoPaciente" class="form-control" maxlength="150">
                  </div>
                  <div class="col-12 mt-3">
                     <b>Dirección *</b>
                     <input type="text" name="direccionPaciente" id="direccionPaciente" class="form-control" maxlength="200">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Colonia *</b>
                     <input type="text" name="coloniaPaciente" id="coloniaPaciente" class="form-control" maxlength="100">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Municipio *</b>
                     <input type="text" name="municipioPaciente" id="municipioPaciente" class="form-control" maxlength="150">
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Estado</b>
                     <select name="estadoPaciente" id="estadoPaciente" class="form-select">
                        <option value="0">Seleccionar</option>
                        ${estadosMexico}
                     </select>
                  </div>
                  <div class="col-md-4 col-sm-6 col-12 mt-3">
                     <b>Religión</b>
                     <input type="text" name="religionPaciente" id="religionPaciente" class="form-control" maxlength="100">
                  </div>
                  <div class="col-md-8 col-sm-6 col-12 mt-3">
                     <b>Aseguradora</b>
                     <input type="text" name="aseguradoraPaciente" id="aseguradoraPaciente" class="form-control" maxlength="100">
                  </div>
               </div>
            </div>
            
            <div class="modal-footer bg-light border-0" align="right">
               <button type="button" class="btn btn-dark btn-redondo btn-lib">
                  Guardar
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
}

const pintarYInicializarPacientes = (containerId) => {
   const contenedor = document.getElementById(containerId);
   
   // Datos de ejemplo para la demo
   const citas = [
      { id: '1', paciente: 'Ana García López', fecha_nac: '1986-11-29', telefono: '2715485698', correo: 'ana@gmail.com', direccion: 'C. 27 Col Huilango, Córdoba Ver.' },
      { id: '2', paciente: 'Roberto Valdéz', fecha_nac: '1984-10-23', telefono: '2715485698', correo: 'roberto@gmail.com', direccion: 'Av 2 Calle 1 Col. Centro, Córdoba Ver.' },
      { id: '3', paciente: 'Carla Méndez', fecha_nac: '1983-09-02', telefono: '2715485698', correo: 'carla@gmail.com', direccion: 'Priv. Calle 2 No. 123 Córdoba Ver.' }
   ];

   // Nota: Eliminamos el overflow:hidden y la card del string para que Datatable maneje el layout
   let html = `
   <div class="table-responsive mt-4">
      <table id="tablePacientes" class="table table-hover align-middle w-100">
         <thead class="bg-light">
            <tr>
               <th>ID</th>
               <th class="py-3 text-secondary">Paciente</th>
               <th class="py-3 text-secondary">Fecha nacimiento</th>
               <th class="py-3 text-secondary">Teléfono</th>
               <th class="py-3 text-secondary">Correo</th>
               <th class="py-3 text-secondary">Dirección</th>
               <th class="py-3 text-center text-secondary">Acciones</th>
            </tr>
         </thead>
         <tbody>`;
            citas.forEach(row => {
               html += `
               <tr>
                  <td>${row.id}</td>
                  <td>
                     <div class="d-flex align-items-center">
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px; background-color: #f0f2f5;">
                              <span class="text-secondary fw-bold" style="font-size: 0.7rem;">${row.paciente.charAt(0)}</span>
                        </div>
                        <span class="text-dark fw-medium">${row.paciente}</span>
                     </div>
                  </td>
                  <td class="text-center">${row.fecha_nac}</td>
                  <td class="text-center">${row.telefono}</td>
                  <td class="text-center">${row.correo}</td>
                  <td>${row.direccion}</td>
                  <td class="text-center">
                     <button class="btn btn-outline-dark fs-7" title="Editar"><i class="bi bi-pencil"></i></button>
                     <button class="btn btn-outline-dark fs-7" title="Expediente Clínico" onclick="ModalFormExpClinico();">
                        <i class="bi bi-person-rolodex"></i>
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
                           <i class="bi bi-dna me-1"></i> Heredo-Fam
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
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab">
                           <i class="bi bi-activity me-1"></i>Crónico/Degenerativos
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab">
                           <i class="bi bi-heart-pulse me-1"></i> Cardiovasculares
                        </button>
                     </li>
                     <li class="nav-item" role="presentation">
                        <button class="nav-link py-3 text-nowrap" data-bs-toggle="tab">
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
            Antecedenes Heredo-Familiares
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
            Antecedenes No Patológicos
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
            Antecedenes Patológicos
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

                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bol">Sulfa</span>
                           <div class="">Reacción: Ronchas</div>
                           <div class="text-end">
                              <button class="btn btn-outline-danger btn-redondo" title="Eliminar"><i class="bi bi-trash"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="col-md-3 col-sm-4 col-12">
                     <div class="card shadow-sm">
                        <div class="card-body">
                           <span class="fw-bol">Gato</span>
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ DECLARACIÓN DE FUNCIONES  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
window.TabPacientes                  = TabPacientes;
window.ModalFormPaciente             = ModalFormPaciente; 
window.ModalFormExpClinico           = ModalFormExpClinico;

window.FormAntecedentesFamiliares    = FormAntecedentesFamiliares;
window.FormAntecedentesNoPatologicos = FormAntecedentesNoPatologicos;
window.FormAntecedentesPatologicos   = FormAntecedentesPatologicos;
