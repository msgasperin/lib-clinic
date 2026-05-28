<?php

  require_once '../assets/lib/dompdf-2.0.4/vendor/autoload.php';
  require_once '../../api/config/class.pdo.php';
  require_once '../../api/config/seguridad.php';

  $data = json_decode(file_get_contents("php://input"), true);
  
  header('Content-Type: application/pdf');
  header('Content-Disposition: inline; filename="expediente.pdf"');
  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  header('Pragma: no-cache');
  header('Expires: 0');
  header('X-Frame-Options: SAMEORIGIN');
  header('Content-Security-Policy: frame-ancestors \'self\'');

  use Dompdf\Dompdf;
  use Dompdf\Options;

  $options = new Options();
  $options->set('defaultFont', 'Helvetica');

  $dompdf = new Dompdf($options);

  $data = json_decode(file_get_contents("php://input"), true);

  $html = '
  <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">

      <style>

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          font-family: Helvetica, sans-serif;
          font-size:12px;
          color:#333;
        }

        header{
          position: fixed;
          top:0px;
          left:0;
          right:0;
          height:40px;
          background:#1C307E;
          border-bottom:4px solid #FBB635;
          color:#fff;
          padding:15px 20px;
        }

        header h1{
          font-size:18px;
        }

        header p{
          font-size:10px;
          margin-top:4px;
        }

        footer{
          position: fixed;
          bottom:-15px;
          left:0;
          right:0;
          height:35px;
          background:#f3f3f3;
          border-top:1px solid #ddd;
          text-align:center;
          font-size:10px;
          color:#666;
          padding-top:10px;
        }

        main{
          margin-top:90px;
          margin-bottom:45px;
          padding:0 15px;
        }

        .card{
          border:1px solid #ddd;
          border-radius:6px;
          overflow:hidden;
        }

        .card-header{
          background:#233da5;
          color:#fff;
          padding:15px;
        }

        .card-header h2{
          font-size:18px;
          margin-bottom:5px;
        }

        .card-header p{
          font-size:11px;
          color:#d7def8;
        }

        .section-title{
          background:#f8f9fb;
          color:#666;
          padding:8px 15px;
          font-size:10px;
          text-transform:uppercase;
          border-bottom:1px solid #e5e5e5;
          letter-spacing:.08em;
          margin-top: 10px;
        }

        .row{
          width:100%;
          border-bottom:1px solid #eee;
        }

        .field{
          display:inline-block;
          vertical-align:top;
          width:10%;
          padding:6px 9px;
        }

        .field-full{
          width:100%;
          padding:6px 9px;
        }

        .field label{
          display:block;
          font-size:9px;
          text-transform:uppercase;
          color:#888;
          margin-bottom:2px;
        }

        .field span{
          font-size:12px;
        }

        .badge{
          display:inline-block;
          padding:3px 8px;
          border-radius:20px;
          font-size:10px;
          background:#E6F1FB;
          color:#185FA5;
        }

        .text-block{
          padding:10px;
          border-bottom:1px solid #eee;
        }

        .text-block label{
          display:block;
          font-size:9px;
          color:#888;
          text-transform:uppercase;
          margin-bottom:4px;
        }

        .text-block p{
          font-size:11px;
          line-height:1.6;
          text-align:justify;
        }

        .footer-card{
          background:#fafafa;
          padding:10px 15px;
          font-size:10px;
          color:#777;
        }

        .container-doctor {
          margin-top: 50px; 
          padding: 15px;
          text-align: right;
          width: 90%;
        }

        .body-doctor {
          display: inline-block;
          text-align: right;
          min-width: 250px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }

        .p-doctor {
          font-size: 13px;
          font-weight: bold; color: #1C307E;
          margin-bottom: 2px;
        }

        .p-cedula {
          font-size: 10px; 
          color: #666; 
          margin-bottom: 2px;
        }

        .p-registro {
          font-size: 10px; 
          color: #888; 
          font-style: italic;
        }

      </style>

    </head>

    <body>

      <header>
        <h1>LIB Laboratorios - Nota Médica</h1>
        Nota # '.$data["id_nota_medica"].'
        <p>Generado el '.date('d/m/Y H:i:s').'</p>
      </header>

      <main>
        
        <div class="card">
          <div class="card-header">
            <h3>Paciente: '.htmlspecialchars($data['paciente']).' - '.$data['edad_hist'].' años - '.$data['sexo_hist'].' </h3>
            <p>Atendido por '.$data['doctor'].'</p>
          </div>
        </div>

        <div class="section-title">
            Signos vitales
          </div>

          <div class="row">
            <div class="field">
              <label>T. arterial</label>
              <span>'.$data['ta'].' mmHg</span>
            </div>

            <div class="field">
              <label>Oxigenación</label>
              <span>'.$data['oxigenacion'].'%</span>
            </div>

            <div class="field">
              <label>Temperatura</label>
              <span>'.$data['temperatura'].' °C</span>
            </div>

            <div class="field">
              <label>F.a cardiaca</label>
              <span>'.$data['fc'].' lpm</span>
            </div>

            <div class="field">
              <label>F. respiratoria</label>
              <span>'.$data['fr'].' rpm</span>
            </div>

            <div class="field">
              <label>Peso</label>
              <span>'.$data['peso'].' kg</span>
            </div>

            <div class="field">
              <label>Estatura</label>
              <span>'.$data['estatura'].' cm</span>
            </div>
          </div>


          <div class="row">
            <div class="field-full">
              <span class="badge">
                '.($data['mapa'] ? 'MAPA ' : '').'
              </span>
              <span class="badge">
                '.($data['holter'] ? 'HOLTER' : '').'
              </span>
              <span class="badge">
                '.($data['esfuerzo'] ? 'P. Esfuerzo' : '').'
              </span>
            </div>
          </div>

          <div class="section-title">
            Nota médica
          </div>

          <div class="text-block">
            <label>Motivo de valoración</label>
            <p>'.nl2br(htmlspecialchars($data['motivo_valoracion'])).'</p>
          </div>

          <div class="text-block">
            <label>Padecimiento actual</label>
            <p>'.nl2br(htmlspecialchars($data['padecimiento'])).'</p>
          </div>

          <div class="text-block">
            <label>Exploración física</label>
            <p>'.nl2br(htmlspecialchars($data['exploracion'])).'</p>
          </div>

          <div class="text-block">
            <label>Resultados de Laboratorio y Gabinete</label>
            <p>'.nl2br(htmlspecialchars($data['res_analisis_gabinete'])).'</p>
          </div>

          <div class="text-block">
            <label>Diagnóstico principal</label>
            <p>'.nl2br(htmlspecialchars($data['diagnostico_principal'])).'</p>
          </div>

          <div class="text-block">
            <label>Diagnóstico secundario</label>
            <p>'.nl2br(htmlspecialchars($data['diagnostico_secundario'])).'</p>
          </div>

          <div class="text-block">
            <label>Plan y tratamiento</label>
            <p>'.nl2br(htmlspecialchars($data['tratamiento'])).'</p>
          </div>

          <div class="text-block">
            <label>Pronóstico</label>
            <p>'.nl2br(htmlspecialchars($data['pronostico'])).'</p>
          </div>

          <div class="text-block">
            <label>Receta médica</label>
            <p>'.nl2br(htmlspecialchars($data['receta'])).'</p>
          </div>

          <div class="container-doctor">
            <div class="body-doctor">
              <p class="p-doctor">
                '.htmlspecialchars($data['doctor']).'
              </p>
              <p class="p-cedula">
                Cédula Profesional: '.htmlspecialchars($data['cedula_hist']).'
              </p>
              <p class="p-registro">
                '.htmlspecialchars($data['registro_especial_hist']).'
              </p>              
            </div>
          </div>
                  
        </div>

      </main>

      <footer>
        LIB Laboratorios - Nota Médica
      </footer>
    </body>
  </html>';


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
  
