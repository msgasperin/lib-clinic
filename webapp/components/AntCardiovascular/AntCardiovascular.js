const FormAntecedentesCardiovasculares = () => {
   let html = 
   `<div class="card p-3 border-0 shadow mt-4">
      <div class="row">
         <div class="col-12 fs-6 fw-bold">
            <i class="bi bi-heart-pulse me-1"></i>Antecedentes Cardio-Nefro-Metabólicos
         </div>
         <div class="col-12 mt-2 fs-8">
            <div class="mb-2 fw-bold">¿Presentas alguna enfermedad Cardio-Nefro-Metabólica?</div>
            <div class="btn-group" role="group">
               <input type="radio" class="btn-check fs-8" name="option_cardio" id="cardio_si" autocomplete="off">
               <label class="btn btn-outline-danger fs-8" for="cardio_si">Sí</label>
               <input type="radio" class="btn-check fs-8" name="option_cardio" id="cardio_no" autocomplete="off">
               <label class="btn btn-outline-secondary fs-8" for="cardio_no">No</label>
            </div>            
         </div>
         <div class="col-12 mt-2">
            <textarea name="infoCardio" id="infoCardio" class="form-control fs-8" rows="5">Ingresa aquí la información adicional</textarea>
         </div>
         <div class="col-12 mt-3 text-end">
            <button type="button" class="btn btn-dark btn-lib fs-7 btn-redondo">
               Guardar
            </button>
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

window.FormAntecedentesCardiovasculares = FormAntecedentesCardiovasculares;