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
   $('#modalAdminExt').html(html);
   $('#modalFormExpediente').modal('show');
   setTimeout(() => {
      FormAntecedentesFamiliares(idPaciente, nomPaciente, idDoctor, nomDoctor);
   }, 100);
}

const toggleOtroAntecedent = (valor) => {
   const inputOtro = document.getElementById('otroAntecedenteFamiliar');

   if(valor === 'Otro') {
      inputOtro.disabled = false;
      inputOtro.focus();
   }
   else {
      inputOtro.disabled = true;
      inputOtro.value = '';
   }
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

window.FormAntecedentesNoPatologicos     = FormAntecedentesNoPatologicos;
window.FormAntecedentesPatologicos       = FormAntecedentesPatologicos;
window.FormAntecedentesCronicos          = FormAntecedentesCronicos;
window.FormAntecedentesCardiovasculares  = FormAntecedentesCardiovasculares;
window.FormAntecedentesGinecoObstetra    = FormAntecedentesGinecoObstetra;

window.fn_muestra_expediente             = fn_muestra_expediente;
window.toggleOtroAntecedent              = toggleOtroAntecedent;
window.fn_elige_modal_expediente         = fn_elige_modal_expediente;
window.fn_doctor_seleccionado_expediente = fn_doctor_seleccionado_expediente;
