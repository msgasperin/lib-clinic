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

  $sql = $v->dbh->prepare("SELECT id_paciente, ap_paterno, ap_materno, nombre, fecha_nac, DATE_FORMAT(fecha_nac,'%d-%m-%Y') AS fecha_nac_format, sexo, estado_civil, escolaridad, ocupacion, telefono, correo, direccion, colonia, municipio, entidad_fed, religion, aseguradora, DATE_FORMAT(fecha_cap,'%Y-%m-%d') AS fecha_cap_format, user_cap FROM cat_pacientes WHERE activo = 1 AND key_query = ?");
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

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Helvetica, sans-serif;
          font-size: 13px;
          color: #333;
        }

        /* ── HEADER FIJO ── */
        header {
          position: fixed;
          top: -40px;        /* ajusta según tu margen superior */
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
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 1px;
          margin-top: 30px
        }

        header p {
          font-size: 10px;
          opacity: 0.85;
          margin-top: 5px;
        }

        /* ── FOOTER FIJO ── */
        footer {
          position: fixed;
          bottom: -30px;     /* ajusta según tu margen inferior */
          left: 0;
          right: 0;
          height: 40px;
          background-color: #f1f3f4;
          border-top: 1px solid #dadce0;
          font-size: 10px;
          color: #666;
          text-align: center;
          padding: 10px 20px;
          display: table;
          width: 100%;
        }

        .footer-left  { display: table-cell; text-align: left; width: 25%; }
        .footer-center{ display: table-cell; text-align: center; width: 50%; }
        .footer-right { display: table-cell; text-align: right; width: 25%; }

        /* Numeración de página nativa de dompdf */
        .page-number:before {
          content: counter(page);
        }
        .page-total:before {
          content: counter(pages);
        }
    

        /* ── Contenido ── */
        main { margin-top: 65px; margin-bottom: 48px; padding: 0 24px; }

        /* ── Tarjeta ── */
        .card { border: 0.5pt solid #e0e0e0; border-radius: 8pt; overflow: hidden; }

        .card-header {
          background: #233da5; padding: 12pt 16pt;
          display: table; width: 100%;
        }
        .avatar-cell { display: table-cell; vertical-align: middle; width: 52pt; }
        .avatar {
          width: 46pt; height: 46pt; border-radius: 50%;
          background: #E6F1FB; color: #132158;
          font-size: 16pt; font-weight: bold;
          text-align: center;
        }
        .text-avatar {
          margin-top: 30px;
        }
        .name-cell  { display: table-cell; vertical-align: middle; padding-left: 10pt; }
        .name-cell h2 { font-size: 14pt; font-weight: bold; color: #fff; }
        .name-cell p  { font-size: 9pt; color: #B5D4F4; margin-top: 2pt; }
        .badge-cell { display: table-cell; vertical-align: middle; text-align: right; }
        .badge-status {
          background: #132158; color: #B5D4F4;
          font-size: 9pt; padding: 3pt 10pt; border-radius: 20pt;
        }

        /* ── Sección ── */
        .section-title {
          font-size: 8pt; text-transform: uppercase; letter-spacing: .07em;
          color: #888; padding: 10pt 16pt 6pt;
          border-bottom: 0.5pt solid #e0e0e0;
        }

        /* ── Grid de campos ── */
        .fields-row { display: table; width: 100%; border-bottom: 0.5pt solid #f0f0f0; }
        .field {
          display: table-cell; padding: 8pt 16pt;
          border-right: 0.5pt solid #f0f0f0;
          vertical-align: top;
        }
        .field:last-child { border-right: none; }
        .field label { font-size: 8pt; text-transform: uppercase; letter-spacing: .05em; color: #888; display: block; margin-bottom: 3pt; }
        .field span  { font-size: 11pt; color: #333; }

        .badge-sex { font-size: 9pt; padding: 2pt 8pt; border-radius: 20pt; }
        .badge-f   { background: #FBEAF0; color: #993556; }
        .badge-m   { background: #E6F1FB; color: #185FA5; }

        /* ── Footer de tarjeta ── */
        .card-footer {
          display: table; width: 100%;
          padding: 8pt 16pt; background: #fafafa;
          border-top: 0.5pt solid #e0e0e0;
        }
        .card-footer .cf-left  { display: table-cell; text-align: left; font-size: 9pt; color: #888; }
        .card-footer .cf-right { display: table-cell; text-align: right; font-size: 9pt; color: #888; }
      </style>
    </head>
    <body>
      <!-- HEADER -->
      <header>
        <h1>LIB Laboratorios - Clínic</h1>
        <p>Expediente generado el ' . date('d/m/Y H:i:s') . '</p>
      </header>

      <!-- FOOTER -->
      <footer>
        <span class="footer-left">Expediente clínico</span>
        <span class="footer-center">LIB Laboratorios &copy; ' . date('Y') . '</span>
        <span class="footer-right">
          Página <span class="page-number"></span></span>
        </span>
      </footer>

      <!-- CONTENIDO -->
      <main>
      <div class="card">

        <!-- Encabezado -->
        <div class="card-header">
            <div class="name-cell">
              <h2>' . htmlspecialchars($paciente['nombre'].' '.$paciente['ap_paterno'].' '.$paciente['ap_materno']) . '</h2>
              <p>Ficha de identificación del paciente</p>
            </div>
          <div class="badge-cell"><span class="badge-status">Activo</span></div>
        </div>

        <!-- Datos personales -->
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
            <span>' . htmlspecialchars($paciente['estado_civil']) . '</span>
          </div>
          <div class="field">
            <label>Escolaridad</label>
            <span>' . htmlspecialchars($paciente['escolaridad']) . '</span>
          </div>
          <div class="field">
            <label>Ocupación</label>
            <span>' . htmlspecialchars($paciente['ocupacion']) . '</span>
          </div>
        </div>

        <!-- Contacto -->
        <div class="section-title">Contacto y origen</div>

        <div class="fields-row">
          <div class="field">
            <label>Lugar de nacimiento</label>
            <span>' . htmlspecialchars($paciente['municipio']) . ',  ' . htmlspecialchars($paciente['entidad_fed']) . '</span>
          </div>
          <div class="field">
            <label>Correo</label>
            <span>' . htmlspecialchars($paciente['correo']) . '</span>
          </div>
          <div class="field">
            <label>Teléfono</label>
            <span>' . htmlspecialchars($paciente['telefono']) . '</span>
          </div>
        </div>

        <div class="fields-row">
          <div class="field" style="width:100%">
            <label>Dirección</label>
            <span>' . htmlspecialchars($paciente['direccion']) . ' Col.' . htmlspecialchars($paciente['colonia']) . '</span>
          </div>
        </div>

        <!-- Datos extra -->
        <div class="section-title">Datos extra</div>
        <div class="fields-row">
          <div class="field">
            <label>Religión</label>
            <span>' . htmlspecialchars($paciente['religion']) . '</span>
          </div>
          <div class="field">
            <label>Aesguradora</label>
            <span>' . htmlspecialchars($paciente['aseguradora']) . '</span>
          </div>
          <div class="field">
            <label>No. expediente</label>
            <span>' . htmlspecialchars($paciente['id_paciente']) . '</span>
          </div>
        </div>

        <!-- Footer de tarjeta -->
        <div class="card-footer">
          <span class="cf-left">Registró: ' . htmlspecialchars($paciente['user_cap']) . '</span>
          <span class="cf-right">Última actualización: ' . formatFecha($paciente['fecha_cap_format'], $meses) . '</span>
        </div>

      </div>
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

  // Tamaño carta, vertical
  $dompdf->setPaper('letter', 'portrait');

  $dompdf->render();

  // Descarga directa en el navegador
  $dompdf->stream('documento.pdf', [
    'Attachment' => false   // false = abre en el navegador, true = descarga
  ]);