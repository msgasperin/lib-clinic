<?php

  require_once '../assets/lib/dompdf-2.0.4/vendor/autoload.php';
  require_once '../../api/config/class.pdo.php';
  require_once '../../api/config/seguridad.php';

  $v = new Conexion();
  $v->conectar();

  use Dompdf\Dompdf;
  use Dompdf\Options;

  // Configuración
  $options = new Options();
  $options->set('defaultFont', 'Helvetica');
  $options->set('isHtml5ParserEnabled', true);

  $dompdf = new Dompdf($options);

  $sql = $v->dbh->prepare("SELECT id_paciente, ap_paterno, ap_materno, nombre, fecha_nac, DATE_FORMAT(fecha_nac,'%d-%m-%Y') AS fecha_nac_format, sexo, estado_civil, escolaridad, ocupacion, telefono, correo, direccion, colonia, municipio, entidad_fed, religion, aseguradora, DATE_FORMAT(P.fecha_cap,'%Y-%m-%d') AS fecha_cap_format, P.user_cap,
  ant_familiar, info_ant_familiar, enfermedad_cronica, info_enfermedad_cronica, enfermedad_cardiovascular, info_enfermedad_cardio,
  habitat, servicios_basicos, viajes_extranjero, hace_cuanto, donde, fimicos, actividad_fisica, cual, horas_semana, 
  tabaquismo, info_tabaquismo, alcohol, info_alcohol, drogas, info_drogas, alergias, info_alergias, hospitalizaciones, info_hospitalizaciones, infecciones, info_infecciones, cirugias, info_cirugias, fracturas, info_fracturas, transfusiones, info_transfusiones, biomasa, info_biomasa,
  menarca, mens_frecuencia, mens_duracion, mens_cantidad, dismenorrea, inicio_sexual, no_embarazos, no_partos, no_abortos, no_cesareas, metodo_anticonceptivo, ultima_mens, ets, menopausia, climaterio, ultimo_papanicolaou, resultado_papanicolaou
  FROM cat_pacientes AS P
  LEFT JOIN ant_generales AS G ON P.id_paciente = G.id_paciente_fk
  LEFT JOIN ant_no_patologicos AS N ON P.id_paciente = N.id_paciente_fk
  LEFT JOIN ant_patologicos AS PA ON P.id_paciente = PA.id_paciente_fk
  LEFT JOIN ant_ginecologicos AS GI ON P.id_paciente = GI.id_paciente_fk
  WHERE activo = 1 AND key_query = ?");
  $sql->execute(array($_GET["key_query"]));
  $paciente = $sql->fetch(PDO::FETCH_ASSOC);


  // ── Cálculo de edad ─────────────────────────────────────────────────
  $hoy        = new DateTime();
  $nacimiento = new DateTime($paciente['fecha_nac']);
  $edad       = $hoy->diff($nacimiento)->y;

  $palabras  = explode(' ', $paciente['nombre']);
  $iniciales = strtoupper(
      mb_substr($palabras[0], 0, 1, 'UTF-8') . 
      mb_substr($palabras[1] ?? '', 0, 1, 'UTF-8')
  );

  // ── Formato de fechas ────────────────────────────────────────────────
  $meses = ['', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  function formatFecha(string $fecha, array $meses): string {
    [$y, $m, $d] = explode('-', $fecha);
    return "$d / {$meses[(int)$m]} / $y";
  }

  $sexoClass  = $paciente['sexo'] === 'Mujer' ? 'badge-f'  : 'badge-m';

  // HTML del documento
  $html = '
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
       
        .main {
            padding: 0px 20px 0px 20px;
         }

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          font-family: Helvetica, sans-serif;
          font-size:10px;
          color:#333;
          padding-top:80px;
        }

        @page{
          margin:80px 20px 45px 20px;
        }

        /* ── HEADER FIJO ── */
        header {
          position: fixed;
          top: -40px;
          left: 0;
          right: 0;
          height: 60px;
          background-color: #1C307E;
          color: #fff;
          text-align: center;
          padding: 12px 20px;
          border-bottom: 4px solid #FBB635;
        }

        header h1 {
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 1px;
          margin-top: 32px;
        }

        header p {
          font-size: 9px;
          opacity: 0.85;
          margin-top: 3px;
        }

        /* ── FOOTER FIJO ── */
        footer {
          position: fixed;
          bottom: -30px;
          left: 0;
          right: 0;
          height: 40px;
          background-color: #f1f3f4;
          border-top: 1px solid #dadce0;
          font-size: 9px;
          color: #666;
          text-align: center;
          padding: 10px 20px;
          display: table;
          width: 100%;
        }

        .footer-left  { display: table-cell; text-align: left; width: 25%; }
        .footer-center{ display: table-cell; text-align: center; width: 50%; }
        .footer-right { display: table-cell; text-align: right; width: 25%; }

        .page-number:before { content: counter(page); }

        /* ── Contenido ── */
        main { margin-top: 50px; margin-bottom: 40px; padding: 0 24px; }

        /* ── Tarjetas Estilizadas ── */
        .card { 
          border: 0.5pt solid #e0e0e0; 
          border-radius: 6pt; 
          overflow: hidden; 
          background: #fff;
          margin-bottom: 14pt;
          page-break-inside: avoid; /* Evita que la tarjeta se parta a la mitad si hay espacio */
        }

        .card-header {
          background: #233da5; 
          padding: 10pt 14pt;
          display: table; 
          width: 100%;
        }
        
        .name-cell { display: table-cell; vertical-align: middle; }
        .name-cell h2 { font-size: 13pt; font-weight: bold; color: #fff; }
        .name-cell p  { font-size: 8pt; color: #B5D4F4; margin-top: 1pt; }
        .badge-cell { display: table-cell; vertical-align: middle; text-align: right; }
        .badge-status {
          background: #132158; color: #B5D4F4;
          font-size: 8pt; padding: 2pt 8pt; border-radius: 12pt;
        }

        /* ── Secciones de los antecedentes ── */
        .section-title {
          font-size: 9pt; 
          text-transform: uppercase; 
          letter-spacing: .05em;
          color: #1c307e; 
          font-weight: bold;
          padding: 8pt 14pt 4pt;
          background-color: #f8f9fa;
          border-bottom: 0.5pt solid #e0e0e0;
        }

        /* ── Estructura de Filas de Campos ── */
        .fields-row { display: table; width: 100%; border-bottom: 0.5pt solid #f0f0f0; table-layout: fixed; }
        .fields-row:last-of-type { border-bottom: none; }
        
        .field {
          display: table-cell; 
          padding: 6pt 14pt;
          border-right: 0.5pt solid #f0f0f0;
          vertical-align: top;
        }
        .field:last-child { border-right: none; }
        .field label { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .03em; color: #777; display: block; margin-bottom: 2pt; }
        .field span  { font-size: 10pt; color: #333; font-weight: 500; }

        /* Badges de respuestas rápidas (Sí/No) */
        .badge-boolean { font-size: 8pt; padding: 1pt 6pt; border-radius: 8pt; font-weight: bold; display: inline-block; }
        .badge-yes { background: #e6f4ea; color: #137333; }
        .badge-no { background: #fce8e6; color: #c5221f; }
        
        /* Badges de sexo */
        .badge-sex { font-size: 8pt; padding: 1pt 6pt; border-radius: 8pt; font-weight: bold; }
        .badge-f   { background: #FBEAF0; color: #993556; }
        .badge-m   { background: #E6F1FB; color: #185FA5; }

        /* Bloques de especificación de detalles (info_*) */
        .info-block {
          background: #fafafa;
          padding: 4pt 12pt 6pt;
          border-top: 0.5pt dashed #e0e0e0;
          font-size: 9.5pt;
          color: #555;
        }
        .info-block em { color: #888; font-style: italic; font-size: 8.5pt; }

        /* Footer de tarjeta */
        .card-footer {
          display: table; width: 100%;
          padding: 6pt 14pt; background: #fafafa;
          border-top: 0.5pt solid #e0e0e0;
        }
        .card-footer .cf-left  { display: table-cell; text-align: left; font-size: 8pt; color: #888; }
        .card-footer .cf-right { display: table-cell; text-align: right; font-size: 8pt; color: #888; }
      </style>
    </head>
    <body>
      <!-- HEADER -->
      <header>
        <h1>LIB Laboratorios - Expediente Clínico</h1>
        <p>Expediente generado el ' . date('d/m/Y H:i:s') . '</p>
      </header>

      <!-- FOOTER -->
      <footer>
        <span class="footer-left">Expediente clínico</span>
        <span class="footer-center">LIB Laboratorios &copy; ' . date('Y') . '</span>
        <span class="footer-right">Página <span class="page-number"></span></span>
      </footer>

      <!-- CONTENIDO PRINCIPAL -->
      <main class="main">
        
        <!-- FICHA DE IDENTIFICACIÓN -->
        <div class="card" style="margin-top:-50px;">
          <div class="card-header">
              <div class="name-cell">
                <h2>' . htmlspecialchars($paciente['nombre'].' '.$paciente['ap_paterno'].' '.$paciente['ap_materno']) . '</h2>
                <p>Expediente Clínico del Paciente</p>
              </div>
            <div class="badge-cell"><span class="badge-status">Activo</span></div>
          </div>

          <div class="section-title">Datos personales</div>
          <div class="fields-row">
            <div class="field">
              <label>Fecha de nacimiento</label>
              <span>' . formatFecha($paciente['fecha_nac_format'], $meses) . '</span>
            </div>
            <div class="field">
              <label>Edad</label>
              <span>' . $edad . ' años</span>
            </div>
            <div class="field">
              <label>Sexo</label>
              <span class="badge-sex ' . $sexoClass . '">' . $paciente["sexo"] . '</span>
            </div>
          </div>

          <div class="fields-row">
            <div class="field">
              <label>Estado civil</label>
              <span>' . htmlspecialchars($paciente['estado_civil'] ?? 'No especificado') . '</span>
            </div>
            <div class="field">
              <label>Escolaridad</label>
              <span>' . htmlspecialchars($paciente['escolaridad'] ?? 'No especificada') . '</span>
            </div>
            <div class="field">
              <label>Ocupación</label>
              <span>' . htmlspecialchars($paciente['ocupacion'] ?? 'No especificada') . '</span>
            </div>
          </div>

          <div class="section-title">Contacto y origen</div>
          <div class="fields-row">
            <div class="field">
              <label>Lugar de nacimiento</label>
              <span>' . htmlspecialchars($paciente['municipio'] ?? '') . ', ' . htmlspecialchars($paciente['entidad_fed'] ?? '') . '</span>
            </div>
            <div class="field">
              <label>Correo</label>
              <span>' . htmlspecialchars($paciente['correo'] ?? 'Sin correo') . '</span>
            </div>
            <div class="field">
              <label>Teléfono</label>
              <span>' . htmlspecialchars($paciente['telefono'] ?? 'Sin teléfono') . '</span>
            </div>
          </div>

          <div class="fields-row">
            <div class="field" style="width:100%">
              <label>Dirección</label>
              <span>' . htmlspecialchars($paciente['direccion'] ?? '') . ' Col. ' . htmlspecialchars($paciente['colonia'] ?? '') . '</span>
            </div>
          </div>

          <div class="section-title">Datos extra</div>
          <div class="fields-row">
            <div class="field">
              <label>Religión</label>
              <span>' . htmlspecialchars($paciente['religion'] ?? 'Ninguna') . '</span>
            </div>
            <div class="field">
              <label>Aseguradora</label>
              <span>' . htmlspecialchars($paciente['aseguradora'] ?? 'Ninguna') . '</span>
            </div>
            <div class="field">
              <label>No. expediente</label>
              <span>' . htmlspecialchars($paciente['id_paciente']) . '</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="cf-left">Registró: ' . htmlspecialchars($paciente['user_cap']) . '</span>
            <span class="cf-right">Última actualización: ' . formatFecha($paciente['fecha_cap_format'], $meses) . '</span>
          </div>
        </div>


        <!-- ANTECEDENTES GENERALES -->
        <div class="card">
          <div class="section-title">Antecedentes Heredo-familiares</div>
          
          <div class="fields-row">
            <div class="field">
              <label>Antecedentes Familiares</label>
              <span>' . ($paciente['ant_familiar'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
            </div>
            <div class="field">
              <label>Enfermedad Crónica</label>
              <span>' . ($paciente['enfermedad_cronica'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
            </div>
            <div class="field">
              <label>Enfermedad Cardiovascular</label>
              <span>' . ($paciente['enfermedad_cardiovascular'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
            </div>
          </div>
          
          ' . (!empty($paciente['info_ant_familiar']) ? '<div class="info-block"><em>Detalles familiares:</em> ' . htmlspecialchars($paciente['info_ant_familiar']) . '</div>' : '') . '
          ' . (!empty($paciente['info_enfermedad_cronica']) ? '<div class="info-block"><em>Detalles de enfermedad crónica:</em> ' . htmlspecialchars($paciente['info_enfermedad_cronica']) . '</div>' : '') . '
          ' . (!empty($paciente['info_enfermedad_cardio']) ? '<div class="info-block"><em>Detalles cardiovasculares:</em> ' . htmlspecialchars($paciente['info_enfermedad_cardio']) . '</div>' : '') . '
        </div>


        <!-- ANTECEDENTES NO PATOLÓGICOS -->
        <div class="card">
          <div class="section-title">Antecedentes No Patológicos</div>
          
          <div class="fields-row">
            <div class="field">
              <label>Hábitat</label>
              <span>' . ($paciente['habitat'] == 1 ? 'Urbano' : 'Rural') . '</span>
            </div>
            <div class="field">
              <label>Servicios Básicos</label>
              <span>' . ($paciente['servicios_basicos'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
            </div>
            <div class="field">
              <label>Fímicos</label>
              <span>' . ($paciente['fimicos'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
            </div>
          </div>

          <div class="fields-row">
            <div class="field">
              <label>Actividad Física</label>
              <span>' . ($paciente['actividad_fisica'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['cual']) ? '<div style="margin-top:4px; font-size:8.5pt; color:#666;">' . htmlspecialchars($paciente['cual']) . ' (' . htmlspecialchars($paciente['horas_semana']) . ' hrs/sem)</div>' : '') . '
            </div>
            <div class="field">
              <label>Viajes al Extranjero</label>
              <span>' . ($paciente['viajes_extranjero'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['donde']) ? '<div style="margin-top:4px; font-size:8.5pt; color:#666;">' . htmlspecialchars($paciente['donde']) . ' / ' . htmlspecialchars($paciente['hace_cuanto']) . '</div>' : '') . '
            </div>
          </div>
        </div>


        <!-- ANTECEDENTES PATOLÓGICOS -->
        <div class="card">
          <div class="section-title">Antecedentes Patológicos</div>
          
          <div class="fields-row">
            <div class="field">
              <label>Tabaquismo</label>
              <span>' . ($paciente['tabaquismo'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_tabaquismo']) ? '<div class="info-block" style="padding:4pt 0; border:none;">' . htmlspecialchars($paciente['info_tabaquismo']) . '</div>' : '') . '
            </div>
            <div class="field">
              <label>Alcoholismo</label>
              <span>' . ($paciente['alcohol'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_alcohol']) ? '<div class="info-block" style="padding:4pt 0; border:none;">' . htmlspecialchars($paciente['info_alcohol']) . '</div>' : '') . '
            </div>
            <div class="field">
              <label>Drogas</label>
              <span>' . ($paciente['drogas'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_drogas']) ? '<div class="info-block" style="padding:4pt 0; border:none;">' . htmlspecialchars($paciente['info_drogas']) . '</div>' : '') . '
            </div>
          </div>

          <div class="fields-row">
            <div class="field">
              <label>Alergias</label>
              <span>' . ($paciente['alergias'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_alergias']) ? '<div style="font-size:8.5pt; color:#666; margin-top:2px;">' . htmlspecialchars($paciente['info_alergias']) . '</div>' : '') . '
            </div>
            <div class="field">
              <label>Cirugías</label>
              <span>' . ($paciente['cirugias'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_cirugias']) ? '<div style="font-size:8.5pt; color:#666; margin-top:2px;">' . htmlspecialchars($paciente['info_cirugias']) . '</div>' : '') . '
            </div>
            <div class="field">
              <label>Hospitalizaciones</label>
              <span>' . ($paciente['hospitalizaciones'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_hospitalizaciones']) ? '<div style="font-size:8.5pt; color:#666; margin-top:2px;">' . htmlspecialchars($paciente['info_hospitalizaciones']) . '</div>' : '') . '
            </div>
          </div>

          <div class="fields-row">
            <div class="field">
              <label>Infecciones</label>
              <span>' . ($paciente['infecciones'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_infecciones']) ? '<div style="font-size:8.5pt; color:#666; margin-top:2px;">' . htmlspecialchars($paciente['info_infecciones']) . '</div>' : '') . '
            </div>
            <div class="field">
              <label>Fracturas</label>
              <span>' . ($paciente['fracturas'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_fracturas']) ? '<div style="font-size:8.5pt; color:#666; margin-top:2px;">' . htmlspecialchars($paciente['info_fracturas']) . '</div>' : '') . '
            </div>
            <div class="field">
              <label>Transfusiones</label>
              <span>' . ($paciente['transfusiones'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_transfusiones']) ? '<div style="font-size:8.5pt; color:#666; margin-top:2px;">' . htmlspecialchars($paciente['info_transfusiones']) . '</div>' : '') . '
            </div>
          </div>

          <div class="fields-row">
            <div class="field" style="width:33.3%">
              <label>Exposición a Biomasa</label>
              <span>' . ($paciente['biomasa'] == 1 ? '<span class="badge-boolean badge-yes">Sí</span>' : '<span class="badge-boolean badge-no">No</span>') . '</span>
              ' . (!empty($paciente['info_biomasa']) ? '<div style="font-size:8.5pt; color:#666; margin-top:2px;">' . htmlspecialchars($paciente['info_biomasa']) . '</div>' : '') . '
            </div>
            <div class="field" style="width:66.6%;"></div>
          </div>
        </div>';


        // ── CONTROL DE FLUJO: ANTECEDENTES GINECOLÓGICOS (SOLO MUJERES) ──
        if ($paciente['sexo'] === 'Mujer') {
            $html .= '
            <div class="card">
              <div class="section-title">Antecedentes Ginecoobstétricos</div>
              
              <div class="fields-row">
                <div class="field">
                  <label>Menarca</label>
                  <span>' . htmlspecialchars($paciente['menarca'] ?? 'No registra') . ' años</span>
                </div>
                <div class="field">
                  <label>Ciclo Menstrual</label>
                  <span>' . htmlspecialchars($paciente['mens_frecuencia'] ?? '-') . ' días x ' . htmlspecialchars($paciente['mens_duracion'] ?? '-') . ' días</span>
                </div>
                <div class="field">
                  <label>Cantidad de Flujo</label>
                  <span>' . htmlspecialchars($paciente['mens_cantidad'] ?? '-') . '</span>
                </div>
              </div>

              <div class="fields-row">
                <div class="field">
                  <label>Dismenorrea</label>
                  <span>' . htmlspecialchars($paciente['dismenorrea'] ?? 'No') . '</span>
                </div>
                <div class="field">
                  <label>Inicio Vida Sexual Active</label>
                  <span>' . htmlspecialchars($paciente['inicio_sexual'] ?? 'No registra') . ' años</span>
                </div>
                <div class="field">
                  <label>Método Anticonceptivo</label>
                  <span>' . htmlspecialchars($paciente['metodo_anticonceptivo'] ?? 'Ninguno') . '</span>
                </div>
              </div>

              <div class="fields-row">
                <div class="field">
                  <label>Gesta / Partos / Abortos / Cesáreas</label>
                  <span>G: ' . htmlspecialchars($paciente['no_embarazos'] ?? '0') . ' | P: ' . htmlspecialchars($paciente['no_partos'] ?? '0') . ' | A: ' . htmlspecialchars($paciente['no_abortos'] ?? '0') . ' | C: ' . htmlspecialchars($paciente['no_cesareas'] ?? '0') . '</span>
                </div>
                <div class="field">
                  <label>Última Menstruación</label>
                  <span>' . htmlspecialchars($paciente['ultima_mens'] ?? 'No registra') . '</span>
                </div>
                <div class="field">
                  <label>Historial ETS</label>
                  <span>' . htmlspecialchars($paciente['ets'] ?? 'Ninguna') . '</span>
                </div>
              </div>

              <div class="fields-row">
                <div class="field">
                  <label>Menopausia / Climaterio</label>
                  <span>' . htmlspecialchars($paciente['menopausia'] ?? 'No') . ' / ' . htmlspecialchars($paciente['climaterio'] ?? 'No') . '</span>
                </div>
                <div class="field">
                  <label>Último Papanicolaou</label>
                  <span>' . htmlspecialchars($paciente['ultimo_papanicolaou'] ?? '-') . '</span>
                </div>
                <div class="field">
                  <label>Resultado Papanicolaou</label>
                  <span>' . htmlspecialchars($paciente['resultado_papanicolaou'] ?? '-') . '</span>
                </div>
              </div>
            </div>';
        }

      $html .= '
      </main>
    </body>
  </html>
  ';

  header('Content-Type: application/pdf');
  header('Content-Disposition: inline; filename="expediente.pdf"');
  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  header('Pragma: no-cache');
  header('Expires: 0');
  header('X-Frame-Options: SAMEORIGIN');
  header('Content-Security-Policy: frame-ancestors \'self\'');

  $dompdf->loadHtml($html);

  $dompdf->setPaper('letter', 'portrait');

  $dompdf->render();

  $pdf = $dompdf->output();

  header('Content-Type: application/pdf');
  header('Content-Disposition: inline; filename="notas_medicas.pdf"');
  header('Cache-Control: private, max-age=0, must-revalidate');
  header('Pragma: public');
  header('Content-Length: ' . strlen($pdf));

  ob_end_clean();
  echo $pdf;
  exit;