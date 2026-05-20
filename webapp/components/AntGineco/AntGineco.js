import { guardar_antecedentes_ginecologicos } from "./AntGinecoServices.js";

const FormAntecedentesGinecoObstetra = (idPaciente, nomPaciente) => {

   let menarca                = '';
   let mens_frecuencia        = '';
   let mens_duracion          = '';
   let mens_cantidad          = '';
   let dismenorrea            = '';
   let inicio_sexual          = '';
   let no_embarazos           = '';
   let no_partos              = '';
   let no_abortos             = '';
   let no_cesareas            = '';
   let metodo_anticonceptivo  = '';
   let ultima_mens            = '';
   let ets                    = '';
   let menopausia             = '';
   let climaterio             = '';
   let ultimo_papanicolaou    = '';
   let resultado_papanicolaou = '';
   

   if(arrAntGineco.length > 0) {
      menarca                = arrAntGineco[0].menarca;
      mens_frecuencia        = arrAntGineco[0].mens_frecuencia;
      mens_duracion          = arrAntGineco[0].mens_duracion;
      mens_cantidad          = arrAntGineco[0].mens_cantidad;
      dismenorrea            = arrAntGineco[0].dismenorrea;
      inicio_sexual          = arrAntGineco[0].inicio_sexual;
      no_embarazos           = arrAntGineco[0].no_embarazos;
      no_partos              = arrAntGineco[0].no_partos;
      no_abortos             = arrAntGineco[0].no_abortos;
      no_cesareas            = arrAntGineco[0].no_cesareas;
      metodo_anticonceptivo  = arrAntGineco[0].metodo_anticonceptivo;
      ultima_mens            = arrAntGineco[0].ultima_mens;
      ets                    = arrAntGineco[0].ets;
      menopausia             = arrAntGineco[0].menopausia;
      climaterio             = arrAntGineco[0].climaterio;
      ultimo_papanicolaou    = arrAntGineco[0].ultimo_papanicolaou;
      resultado_papanicolaou = arrAntGineco[0].resultado_papanicolaou;
      
   }

   let html = 
   `<div class="card p-3 border-0 shadow fs-8">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
            <i class="bi bi-gender-female me-1"></i> Antecedenes Gineco-Obstétrico
         </div>
         <div class="col-md-3 col-sm-4 col-6">
            <strong>Menarca</strong>
            <input type="text" name="menarca" id="menarca" class="form-control fs-8" maxlength="100" value="${menarca}">
         </div>
         <div class="col-12 mt-4 fs-6 fw-bold">
            Ciclo menstrual
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Frecuencia *</strong>
            <input type="text" name="frecuenciaMenstruacion" id="frecuenciaMenstruacion" class="form-control fs-8" maxlength="50" value="${mens_frecuencia}">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Duración *</strong>
            <input type="text" name="duracionMenstruacion" id="duracionMenstruacion" class="form-control fs-8" maxlength="50" value="${mens_duracion}">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Cantidad *</strong>
            <input type="text" name="cantidadMenstruacion" id="cantidadMenstruacion" class="form-control fs-8" maxlength="50" value="${mens_cantidad}">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Dismenorrea</strong>
            <input type="text" name="dismenorreaMenstruacion" id="dismenorreaMenstruacion" class="form-control fs-8" maxlength="50" value="${dismenorrea}">
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Inicio de vida sexual activa *</strong>
            <input type="text" name="inicioVidaSexual" id="inicioVidaSexual" class="form-control fs-8" maxlength="50" value="${inicio_sexual}">
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Embarazos *</strong>
            <input type="number" inputmode="numeric" name="noEmbarazos" id="noEmbarazos" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" value="${no_embarazos}" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Partos *</strong>
            <input type="number" inputmode="numeric" name="noPartos" id="noPartos" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" value="${no_partos}" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Abortos</strong>
            <input type="number" inputmode="numeric" name="noAbortos" id="noAbortos" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" value="${no_abortos}" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Cesareas *</strong>
            <input type="number" inputmode="numeric" name="noCesareas" id="noCesareas" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" value="${no_cesareas}" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Método anticonceptivo</strong>
            <input type="text" name="metodoAnticonceptivo" id="metodoAnticonceptivo" class="form-control fs-8" maxlength="100" value="${metodo_anticonceptivo}" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Última menstruación</strong>
            <input type="text" name="ultimaMenstruacion" id="ultimaMenstruacion" class="form-control fs-8" maxlength="50" value="${ultima_mens}" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>ETS</strong>
            <input type="text" name="ets" id="ets" class="form-control fs-8" maxlength="100"  value="${ets}" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Menopausia</strong>
            <input type="text" name="menopausia" id="menopausia" class="form-control fs-8" maxlength="100" value="${menopausia}" />
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Climaterio</strong>
            <input type="text" name="climaterio" id="climaterio" class="form-control fs-8" maxlength="100" value="${climaterio}" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Fecha de último papanicolaou</strong>
            <input type="text" name="ultimoPapanicolaou" id="ultimoPapanicolaou" class="form-control fs-8" maxlength="50" value="${ultimo_papanicolaou}" />
         </div>
         <div class="col-md-5 col-sm-4 col-6 mt-3">
            <strong>Resultado</strong>
            <input type="text" name="resultadoPapanicolaou" id="resultadoPapanicolaou" class="form-control fs-8" maxlength="100" value="${resultado_papanicolaou}" />
         </div>
         <div class="col-12 mt-3 text-end">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo fs-6" id="btnAntGineco" onclick="fn_guardar_antecedentes_ginecologicos(${idPaciente}, '${nomPaciente}')">
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

   $('#antecedente_general').hide();
   $('#antecedente_patologico').hide();
   $('#antecedente_gineco_obstetrico').hide();
}

const fn_guardar_antecedentes_ginecologicos = async (idPaciente, nomPaciente) => {

   let menarca                 = $('#menarca').val().trim();
   let frecuenciaMenstruacion  = $('#frecuenciaMenstruacion').val().trim();
   let duracionMenstruacion    = $('#duracionMenstruacion').val().trim();
   let cantidadMenstruacion    = $('#cantidadMenstruacion').val().trim();
   let dismenorreaMenstruacion = $('#dismenorreaMenstruacion').val().trim();
   let inicioVidaSexual        = $('#inicioVidaSexual').val().trim();
   let noEmbarazos             = $('#noEmbarazos').val().trim();
   let noPartos                = $('#noPartos').val().trim();
   let noAbortos               = $('#noAbortos').val().trim();
   let noCesareas              = $('#noCesareas').val().trim();
   let metodoAnticonceptivo    = $('#metodoAnticonceptivo').val().trim();
   let ultimaMenstruacion      = $('#ultimaMenstruacion').val().trim();
   let ets                     = $('#ets').val().trim();
   let menopausia              = $('#menopausia').val().trim();
   let climaterio              = $('#climaterio').val().trim();
   let ultimoPapanicolaou      = $('#ultimoPapanicolaou').val().trim();
   let resultadoPapanicolaou   = $('#resultadoPapanicolaou').val().trim();
      
   if (idPaciente == 0 || idPaciente == '') {
      ToastColor.fire({
         text: '¡Atención! Faltaron parámetros importantes',
         icon: 'warning'
      });
      return;
   }
   else if (frecuenciaMenstruacion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar la frecuencia del ciclo menstrual',
         icon: 'warning'
      });
      $('#frecuenciaMenstruacion').focus();
      return;
   }
   else if (duracionMenstruacion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar la duración del ciclo menstrual',
         icon: 'warning'
      });
      $('#duracionMenstruacion').focus();
      return;
   }
   else if (cantidadMenstruacion == '') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar la cantidad del ciclo menstrual',
         icon: 'warning'
      });
      $('#cantidadMenstruacion').focus();
      return;
   }
   else if (inicioVidaSexual == '') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar el inicio de la vida sexual',
         icon: 'warning'
      });
      $('#inicioVidaSexual').focus();
      return;
   }
   else if (noEmbarazos == '') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar el número de embarazos',
         icon: 'warning'
      });
      $('#noEmbarazos').focus();
      return;
   }
   else if (noPartos == '') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar el número de partos',
         icon: 'warning'
      });
      $('#noPartos').focus();
      return;
   }
   else if (noCesareas == '') {
      ToastColor.fire({
         text: '¡Atención! Debes indicar el número de cesareas',
         icon: 'warning'
      });
      $('#noCesareas').focus();
      return;
   }  

   let objAntecedente = { func: 'guardar_antecedentes_ginecologicos', idPaciente, nomPaciente, menarca, frecuenciaMenstruacion, duracionMenstruacion, cantidadMenstruacion, dismenorreaMenstruacion, inicioVidaSexual, noEmbarazos, noPartos, noAbortos, noCesareas, metodoAnticonceptivo, ultimaMenstruacion, ets, menopausia, climaterio, ultimoPapanicolaou, resultadoPapanicolaou };

   const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los antecedentes ginecológicos del paciente: '+ nomPaciente +' serán guardados', 'question', 'Sí, guardar', 'Cancelar');

   if (!res.result) {
      $('#btnAntGineco').prop('disabled', false);
      return;
   }

   $('#btnAntGineco').prop('disabled', true);
   let respuesta = await guardar_antecedentes_ginecologicos(objAntecedente);
   if(respuesta.estatus == 403) {
      fnNoSesion();
   }
   else if(respuesta.estatus == 200) {
      showMessageSwalTimer('¡Guardado!', '', 'success', 1500);
      $('#btnAntGineco').prop('disabled', false);
      arrAntGineco = [];
      arrAntGineco = [{
         id_paciente_fk         : idPaciente,
         paciente_hist          : nomPaciente,
         menarca                : menarca,
         mens_frecuencia        : frecuenciaMenstruacion,
         mens_duracion          : duracionMenstruacion,
         mens_cantidad          : cantidadMenstruacion,
         dismenorrea            : dismenorreaMenstruacion,
         inicio_sexual          : inicioVidaSexual,
         no_embarazos           : noEmbarazos,
         no_partos              : noPartos,
         no_abortos             : noAbortos,
         no_cesareas            : noCesareas,
         metodo_anticonceptivo  : metodoAnticonceptivo,
         ultima_mens            : ultimaMenstruacion,
         ets                    : ets,
         menopausia             : menopausia,
         climaterio             : climaterio,
         ultimo_papanicolaou    : ultimoPapanicolaou,
         resultado_papanicolaou : resultadoPapanicolaou
      }];
   }
   else {
      showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
      $('#btnAntGineco').prop('disabled', false);
      return;
   }
}

window.FormAntecedentesGinecoObstetra        = FormAntecedentesGinecoObstetra;
window.fn_guardar_antecedentes_ginecologicos = fn_guardar_antecedentes_ginecologicos;