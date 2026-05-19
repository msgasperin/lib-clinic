const FormAntecedentesNoPatologicos = () => {
   let html = 
   `<div class="card p-3 border-0 shadow fs-8">
      <div class="row">
         <div class="col-12 fs-6 mb-3 fw-bold">
            <i class="bi bi-person-walking me-1"></i>Antecedenes No Patológicos
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Hábitat *</strong>
            <select name="habitat" id="habitat" class="form-select fs-8">
               <option value="0">Seleccionar</option>
               <option value="Urbano">Urbano</option>
               <option value="Rural">Rural</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Cuénta con servicios básicos *</strong>
            <select name="serviciosBasicos" id="serviciosBasicos" class="form-select fs-8">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Viajes al extranjero *</strong>
            <select name="viajeExtranjero" id="viajeExtranjero" class="form-select fs-8">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Hace cuánto</strong>
            <input type="text" name="tiempoViaje" id="tiempoViaje" class="form-control fs-8" maxlength="50" disabled>
         </div>
         <div class="col-md-3 col-sm-4 col-12 mt-3">
            <strong>Dónde</strong>
            <input type="text" name="dondeViajo" id="dondeViajo" class="form-control fs-8" maxlength="100" disabled>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Fímicos *</strong>
            <select name="fimicos" id="fimicos" class="form-select fs-8">
               <option value="0">Seleccionar</option>
               <option value="Positivo">Positivo</option>
               <option value="Negativo">Negativo</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Actividad física *</strong>
            <select name="actividadFisica" id="actividadFisica" class="form-select fs-8">
               <option value="0">Seleccionar</option>
               <option value="Sí">Sí</option>
               <option value="No">No</option>
            </select>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>¿Cuál?</strong>
            <input type="text" name="ejercicio" id="ejercicio" class="form-control fs-8" maxlength="100" disabled>
         </div>
         <div class="col-md-3 col-sm-4 col-6 mt-3">
            <strong>Horas por semana</strong>
            <input type="text" name="horasEjercicio" id="horasEjercicio" class="form-control fs-8" maxlength="50" disabled>
         </div>
         <div class="col-md-9 col-sm-12 col-12 mt-3 text-end">
            <br>
            <button type="button" class="btn btn-dark btn-lib btn-redondo fs-7">
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

window.FormAntecedentesNoPatologicos = FormAntecedentesNoPatologicos;