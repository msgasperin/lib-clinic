const FormAntecedentesGinecoObstetra = () => {
   let html = 
   `<div class="card p-3 border-0 shadow fs-8">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
            <i class="bi bi-gender-female me-1"></i> Antecedenes Gineco-Obstétrico
         </div>
         <div class="col-md-3 col-sm-4 col-6">
            <strong>Menarca</strong>
            <input type="text" name="menarca" id="menarca" class="form-control fs-8" maxlength="100">
         </div>
         <div class="col-12 mt-4 fs-6 fw-bold">
            Ciclo menstrual
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Frecuencia</strong>
            <input type="text" name="frecuenciaMenstruacion" id="frecuenciaMenstruacion" class="form-control fs-8" maxlength="50">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Duración</strong>
            <input type="text" name="duracionMenstruacion" id="duracionMenstruacion" class="form-control fs-8" maxlength="50">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Cantidad</strong>
            <input type="text" name="cantidadMenstruacion" id="cantidadMenstruacion" class="form-control fs-8" maxlength="50">
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-2">
            <strong>Dismenorrea</strong>
            <input type="text" name="dismenorreaMenstruacion" id="dismenorreaMenstruacion" class="form-control fs-8" maxlength="50">
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Inicio de vida sexual activa</strong>
            <input type="text" name="inicioVidaSexual" id="inicioVidaSexual" class="form-control fs-8" maxlength="50">
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Embarazos</strong>
            <input type="number" inputmode="numeric" name="noEmbarazos" id="noEmbarazos" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Partos</strong>
            <input type="number" inputmode="numeric" name="noPartos" id="noPartos" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Abortos</strong>
            <input type="number" inputmode="numeric" name="noAbortos" id="noAbortos" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-2 col-sm-4 col-6 mt-3">
            <strong>No. Cesareas</strong>
            <input type="number" inputmode="numeric" name="noCesareas" id="noCesareas" class="form-control fs-8" onkeypress="return fnValidaNumeros(event);" maxlength="2" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Método anticonceptivo</strong>
            <input type="text" name="metodoAnticonceptivo" id="metodoAnticonceptivo" class="form-control fs-8" maxlength="100" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Fecha última menstruación</strong>
            <input type="date" name="ultimaMenstruacion" id="ultimaMenstruacion" class="form-control fs-8" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>ETS</strong>
            <input type="text" name="ets" id="ets" class="form-control fs-8" maxlength="100" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Menopausia</strong>
            <input type="text" name="menopausia" id="menopausia" class="form-control fs-8" maxlength="100" />
         </div>
         <div class="col-md-4 col-sm-4 col-6 mt-3">
            <strong>Climaterio</strong>
            <input type="text" name="climaterio" id="climaterio" class="form-control fs-8" maxlength="100" />
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Fecha de último papanicolaou</strong>
            <input type="date" name="ultimoPapanicolaou" id="ultimoPapanicolaou" class="form-control fs-8" />
         </div>
         <div class="col-md-5 col-sm-4 col-6 mt-3">
            <strong>Resultado</strong>
            <input type="text" name="resultadoPapanicolaou" id="resultadoPapanicolaou" class="form-control fs-8" maxlength="100" />
         </div>
         <div class="col-12 mt-3 text-end">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo fs-6">
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

window.FormAntecedentesGinecoObstetra = FormAntecedentesGinecoObstetra;