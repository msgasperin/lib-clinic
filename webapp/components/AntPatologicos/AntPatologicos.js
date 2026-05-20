import { guardar_antecedentes_patologicos, obtiene_antecedentes_patologicos } from "./AntPatologicosServices.js";


const FormAntecedentesPatologicos = (idPaciente, nomPaciente) => {

  console.log(arrAntPatologicos);

  let tabaquismo;
  let infoTabaquismo      = '';
  let alcohol;
  let infoAlcohol         = '';
  let drogas;
  let infoDrogas          = '';
  let alergias;
  let infoAlergias        = '';
  let hospitalizacion;
  let infoHospitalizacion = '';
  let infecciones;
  let infoInfecciones     = '';
  let cirugias;
  let infoCirugias        = '';
  let fracturas;
  let infoFracturas       = '';
  let transfusiones;
  let infoTransfusiones   = '';
  let biomasa;
  let infoBiomasa         = '';

  if(arrAntPatologicos.length > 0) {
    tabaquismo          = arrAntPatologicos[0].tabaquismo;
    infoTabaquismo      = arrAntPatologicos[0].info_tabaquismo;
    alcohol             = arrAntPatologicos[0].alcohol;
    infoAlcohol         = arrAntPatologicos[0].info_alcohol;
    drogas              = arrAntPatologicos[0].drogas;
    infoDrogas          = arrAntPatologicos[0].info_drogas;
    alergias            = arrAntPatologicos[0].alergias;
    infoAlergias        = arrAntPatologicos[0].info_alergias;
    hospitalizacion     = arrAntPatologicos[0].hospitalizaciones;
    infoHospitalizacion = arrAntPatologicos[0].info_hospitalizaciones;
    infecciones         = arrAntPatologicos[0].infecciones;
    infoInfecciones     = arrAntPatologicos[0].info_infecciones;
    cirugias            = arrAntPatologicos[0].cirugias;
    infoCirugias        = arrAntPatologicos[0].info_cirugias;
    fracturas           = arrAntPatologicos[0].fracturas;
    infoFracturas       = arrAntPatologicos[0].info_fracturas;
    transfusiones       = arrAntPatologicos[0].transfusiones;
    infoTransfusiones   = arrAntPatologicos[0].info_transfusiones;
    biomasa             = arrAntPatologicos[0].biomasa;
    infoBiomasa         = arrAntPatologicos[0].info_biomasa;
  }

  let html = 
  `<div class="card p-3 border-0 shadow fs-8">
    <div class="row">
        <div class="col-12 fs-6 mb-3 fw-bold">
          <i class="bi bi-virus me-1"></i>Antecedenes Patológicos
        </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Fuma?</strong>
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_fuma" id="fuma_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="fuma_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_fuma" id="fuma_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="fuma_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12">
            <input type="text" name="infoTabaquismo" id="infoTabaquismo" class="form-control fs-8" placeholder="Información adicional tabaquismo" value="${infoTabaquismo}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Consume alcohol?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_alcohol" id="alcohol_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="alcohol_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_alcohol" id="alcohol_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="alcohol_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoAlcohol" id="infoAlcohol" class="form-control fs-8" placeholder="Información adicional alcoholismo" value="${infoAlcohol}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Consume drogas?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_drogas" id="drogas_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="drogas_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_drogas" id="drogas_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="drogas_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoDrogas" id="infoDrogas" class="form-control fs-8" placeholder="Información adicional drogas" value="${infoDrogas}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Alergias?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_alergias" id="alergias_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="alergias_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_alergias" id="alergias_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="alergias_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoAlergias" id="infoAlergias" class="form-control fs-8" placeholder="Información adicional alergias" maxlength="100" value="${infoAlergias}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Hospitalizaciones?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_hospitalizacion" id="hospitalizacion_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="hospitalizacion_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_hospitalizacion" id="hospitalizacion_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="hospitalizacion_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoHospitalizacion" id="infoHospitalizacion" class="form-control fs-8" placeholder="Información adicional hospitalización" maxlength="100" value="${infoHospitalizacion}"/>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Infecciones?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_infecciones" id="infecciones_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="infecciones_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_infecciones" id="infecciones_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="infecciones_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoInfecciones" id="infoInfecciones" class="form-control fs-8" placeholder="Información adicional infecciones" maxlength="100" value="${infoInfecciones}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Cirugías?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_cirugias" id="cirugias_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="cirugias_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_cirugias" id="cirugias_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="cirugias_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoCirugias" id="infoCirugias" class="form-control fs-8" placeholder="Información adicional alergias" maxlength="100" value="${infoCirugias}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Fracturas?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_fracturas" id="facturas_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="facturas_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_fracturas" id="fracturas_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="fracturas_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoFracturas" id="infoFracturas" class="form-control fs-8" placeholder="Información adicional fracturas" maxlength="100" value="${infoFracturas}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Transfusiones?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_transfusiones" id="transfusiones_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="transfusiones_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_transfusiones" id="transfusiones_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="transfusiones_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoTransfusiones" id="infoTransfusiones" class="form-control fs-8" placeholder="Información adicional fracturas" maxlength="100" value="${infoTransfusiones}" />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 mt-2">
        <strong>¿Biomasa?</strong>
        <div class="row">
          <div class="col-sm-3 col-12 mt-2">
            <div class="btn-group" role="group">
              <input type="radio" class="btn-check fs-8" name="option_biomasa" id="biomasa_si" autocomplete="off" value="1">
              <label class="btn btn-outline-danger fs-8" for="biomasa_si">Sí</label>
              <input type="radio" class="btn-check fs-8" name="option_biomasa" id="biomasa_no" autocomplete="off" value="0">
              <label class="btn btn-outline-secondary fs-8" for="biomasa_no">No</label>
            </div>
          </div>
          <div class="col-sm-9 col-12 mt-2">
            <input type="text" name="infoBiomasa" id="infoBiomasa" class="form-control fs-8" placeholder="Información adicional biomasa" maxlength="100" value="${infoBiomasa}" />
          </div>
        </div>
      </div>
      <div class="col-12 mt-2 text-end">
        <br>
        <button type="button" class="btn btn-dark btn-lib btn-redondo fs-7" id="btnAntPatologicos" onclick="fn_guardar_antecedentes_patologicos(${idPaciente}, '${nomPaciente}');">
          Guardar
        </button>
      </div>
    </div>
  </div>`;

  $('#antecedente_patologico').html(html);
  $('#antecedente_patologico').show();

  setTimeout(() => {
    $('input[name="option_fuma"][value="' + tabaquismo + '"]').prop('checked', true);
    $('input[name="option_alcohol"][value="' + alcohol + '"]').prop('checked', true);
    $('input[name="option_drogas"][value="' + drogas + '"]').prop('checked', true);
    $('input[name="option_alergias"][value="' + alergias + '"]').prop('checked', true);
    $('input[name="option_hospitalizacion"][value="' + hospitalizacion + '"]').prop('checked', true);
    $('input[name="option_infecciones"][value="' + infecciones + '"]').prop('checked', true);
    $('input[name="option_cirugias"][value="' + cirugias + '"]').prop('checked', true);
    $('input[name="option_fracturas"][value="' + fracturas + '"]').prop('checked', true);
    $('input[name="option_transfusiones"][value="' + transfusiones + '"]').prop('checked', true);
    $('input[name="option_biomasa"][value="' + biomasa + '"]').prop('checked', true);
  }, 100);

  $('#antecedente_general').hide();
  $('#antecedente_no_patologico').hide();
  $('#antecedente_gineco_obstetrico').hide();
}

const fn_guardar_antecedentes_patologicos = async (idPaciente, nomPaciente) => {

  let fuma                = document.querySelector('input[name="option_fuma"]:checked')?.value;
  let infoTabaquismo      = $('#infoTabaquismo').val().trim();
  let alcohol             = document.querySelector('input[name="option_alcohol"]:checked')?.value;
  let infoAlcohol         = $('#infoAlcohol').val().trim();
  let drogas              = document.querySelector('input[name="option_drogas"]:checked')?.value;
  let infoDrogas          = $('#infoDrogas').val().trim();
  let alergias            = document.querySelector('input[name="option_alergias"]:checked')?.value;
  let infoAlergias        = $('#infoAlergias').val().trim();
  let hospitalizacion     = document.querySelector('input[name="option_hospitalizacion"]:checked')?.value;
  let infoHospitalizacion = $('#infoTabaquismo').val().trim();
  let cirugias            = document.querySelector('input[name="option_cirugias"]:checked')?.value;
  let infoCirugias        = $('#infoCirugias').val().trim();
  let infecciones         = document.querySelector('input[name="option_infecciones"]:checked')?.value;
  let infoInfecciones     = $('#infoInfecciones').val().trim();
  let fracturas           = document.querySelector('input[name="option_fracturas"]:checked')?.value;
  let infoFracturas       = $('#infoFracturas').val().trim();
  let transfusiones       = document.querySelector('input[name="option_transfusiones"]:checked')?.value;
  let infoTransfusiones   = $('#infoTransfusiones').val().trim();
  let biomasa             = document.querySelector('input[name="option_biomasa"]:checked')?.value;
  let infoBiomasa         = $('#infoBiomasa').val().trim();  
    
  if (idPaciente == 0 || idPaciente == '') {
    ToastColor.fire({
        text: '¡Atención! Faltaron parámetros importantes',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(fuma) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente fuma o no',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(alcohol) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente consume alcohol',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(drogas) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente consume drogas',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(alergias) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente tiene alergias',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(hospitalizacion) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente ha estado hospitalizado',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(infecciones) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente ha presentado infecciones',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(cirugias) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente ha presentado cirugías',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(fracturas) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente presenta alguna fractura',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(transfusiones) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente ha tenido transfusiones',
        icon: 'warning'
    });
    return;
  }
  else if (typeof(biomasa) == 'undefined') {
    ToastColor.fire({
        text: '¡Atención! Debes indicar si el paciente presenta alguna biomasa',
        icon: 'warning'
    });
    return;
  }

  let objAntecedente = { func: 'guardar_antecedentes_patologicos', idPaciente, nomPaciente, fuma, infoTabaquismo, alcohol, infoAlcohol, drogas, infoDrogas, alergias, infoAlergias, hospitalizacion, infoHospitalizacion, infecciones, infoInfecciones, cirugias, infoCirugias, fracturas, infoFracturas, transfusiones, infoTransfusiones, biomasa, infoBiomasa };

  const res = await showMessageSwalQuestion('¿Estás seguro?', 'Los antecedentes patológicos del paciente: '+ nomPaciente +' serán guardados', 'question', 'Sí, guardar', 'Cancelar');

  if (!res.result) {
    $('#btnAntPatologicos').prop('disabled', false);
    return;
  }

  $('#btnAntPatologicos').prop('disabled', true);
  let respuesta = await guardar_antecedentes_patologicos(objAntecedente);
  if(respuesta.estatus == 403) {
    fnNoSesion();
  }
  else if(respuesta.estatus == 200) {
    showMessageSwalTimer('¡Guardado!', '', 'success', 1500);
    $('#btnAntPatologicos').prop('disabled', false);

    arrAntPatologicos = [];
    arrAntPatologicos = [{
      id_paciente_fk         : idPaciente,
      paciente_hist          : nomPaciente,
      tabaquismo             : fuma,
      info_tabaquismo        : infoTabaquismo,
      alcohol                : alcohol,
      info_alcohol           : infoAlcohol,
      drogas                 : drogas,
      info_drogas            : infoDrogas,
      alergias               : alergias,
      info_alergias          : infoAlergias,
      hospitalizaciones      : hospitalizacion,
      info_hospitalizaciones : infoHospitalizacion,
      infecciones            : infecciones,
      info_infecciones       : infoInfecciones,
      cirugias               : cirugias,
      info_cirugias          : infoCirugias,
      fracturas              : fracturas,
      info_fracturas         : infoFracturas,
      transfusiones          : transfusiones,
      info_transfusiones     : infoTransfusiones,
      biomasa                : biomasa,
      info_biomasa           : infoBiomasa      
    }];
  }
  else {
    showMessageSwal('Ocurrio un error: ', respuesta.mensaje, 'error');
    $('#btnAntPatologicos').prop('disabled', false);
    return;
  }
}

window.FormAntecedentesPatologicos         = FormAntecedentesPatologicos;
window.fn_guardar_antecedentes_patologicos = fn_guardar_antecedentes_patologicos;