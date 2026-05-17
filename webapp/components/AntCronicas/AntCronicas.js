const FormAntecedentesCronicos = () => {
   let html = 
   `<div class="card p-3 border-0 shadow fs-8">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            <i class="bi bi-activity me-1"></i>Antecedentes Crónico / Degenerativos
         </div>
         <div class="col-12 mt-2 fs-8">
            <div class="mb-2 fw-bold">¿Tienes alguna enfermedad crónico degenerativa?</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_cronico" id="cronico_si" autocomplete="off">
               <label class="btn btn-outline-danger fs-8" for="cronico_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_cronico" id="cronico_no" autocomplete="off">
               <label class="btn btn-outline-secondary fs-8" for="cronico_no">No</label>
            </div>            
         </div>
         <div class="col-12 mt-2">
            <textarea name="infoCronica" id="infoCronica" class="form-control fs-8" rows="5">Ingresa aquí la información adicional</textarea>
         </div>
         <div class="col-12 mt-3 text-end">
            <button type="button" class="btn btn-dark btn-lib fs-7 btn-redondo">
               Guardar
            </button>
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

window.FormAntecedentesCronicos = FormAntecedentesCronicos;