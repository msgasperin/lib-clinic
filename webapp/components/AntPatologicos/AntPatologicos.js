const FormAntecedentesPatologicos = () => {
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
                <input type="radio" class="btn-check fs-8" name="option_fuma" id="fuma_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="fuma_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_fuma" id="fuma_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="fuma_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12">
              <input type="text" name="infoTabaquismo" id="infoTabaquismo" class="form-control fs-8" placeholder="Información adicional tabaquismo" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Consume alcohol?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_bebe" id="bebe_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="bebe_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_bebe" id="bebe_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="bebe_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoAlcohol" id="infoAlcohol" class="form-control fs-8" placeholder="Información adicional alcoholismo" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Consume drogas?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_drogas" id="drogas_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="drogas_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_drogas" id="drogas_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="drogas_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoDrogas" id="infoDrogas" class="form-control fs-8" placeholder="Información adicional drogas" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Alergias?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_alergias" id="alergias_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="alergias_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_alergias" id="alergias_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="alergias_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoAlergias" id="infoAlergias" class="form-control fs-8" placeholder="Información adicional alergias" maxlength="100" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Hospitalizaciones?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_hospitalizacion" id="hospitalizacion_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="hospitalizacion_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_hospitalizacion" id="hospitalizacion_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="hospitalizacion_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoHospitalizacion" id="infoHospitalizacion" class="form-control fs-8" placeholder="Información adicional hospitalización" maxlength="100" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Infecciones?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_infecciones" id="infecciones_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="infecciones_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_infecciones" id="infecciones_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="infecciones_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoInfecciones" id="infoInfecciones" class="form-control fs-8" placeholder="Información adicional infecciones" maxlength="100" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Cirugías?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_cirugias" id="cirugias_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="cirugias_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_cirugias" id="cirugias_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="cirugias_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoCirugias" id="infoCirugias" class="form-control fs-8" placeholder="Información adicional alergias" maxlength="100" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Fracturas?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_fracturas" id="facturas_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="facturas_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_fracturas" id="fracturas_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="fracturas_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoFracturas" id="infoFracturas" class="form-control fs-8" placeholder="Información adicional fracturas" maxlength="100" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 mt-2">
          <strong>¿Transfusiones?</strong>
          <div class="row">
            <div class="col-sm-3 col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_transfusiones" id="transfusiones_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="transfusiones_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_transfusiones" id="transfusiones_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="transfusiones_no">No</label>
              </div>
            </div>
            <div class="col-sm-9 col-12 mt-2">
              <input type="text" name="infoTransfusiones" id="infoTransfusiones" class="form-control fs-8" placeholder="Información adicional fracturas" maxlength="100" />
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-3 mt-2">
          <strong>¿Biomasa?</strong>
          <div class="row">
            <div class="col-12 mt-2">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check fs-8" name="option_biomasa" id="biomasa_si" autocomplete="off">
                <label class="btn btn-outline-danger fs-8" for="biomasa_si">Sí</label>
                <input type="radio" class="btn-check fs-8" name="option_biomasa" id="biomasa_no" autocomplete="off">
                <label class="btn btn-outline-secondary fs-8" for="biomasa_no">No</label>
              </div>
            </div>          
          </div>
        </div>
        <div class="col-12 col-sm-3 mt-2 text-end">
          <br>
          <button type="button" class="btn btn-dark btn-lib btn-redondo fs-7">
            Guardar
          </button>
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

window.FormAntecedentesPatologicos = FormAntecedentesPatologicos;