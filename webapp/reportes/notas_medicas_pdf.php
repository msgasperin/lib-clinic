<?php
   ob_start();
   require_once '../assets/lib/dompdf-2.0.4/vendor/autoload.php';
   require_once '../../api/config/class.pdo.php';
   require_once '../../api/config/seguridad.php';

   use Dompdf\Dompdf;
   use Dompdf\Options;

   $data = json_decode(file_get_contents("php://input"), true);

   $options = new Options();
   $options->set('defaultFont', 'Helvetica');
   $options->set('isRemoteEnabled', true);

   $dompdf = new Dompdf($options);

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

         header{
            position: fixed;
            top:0px;
            left:0;
            right:0;
            height:40px;
            background:#1C307E;
            border-bottom:4px solid #FBB635;
            color:#fff;
            padding:12px 20px;
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
            bottom:-35px;
            left:0;
            right:0;
            height:25px;
            background:#f5f5f5;
            border-top:1px solid #ddd;
            text-align:center;
            line-height:25px;
            font-size:9px;
            color:#666;
         }

         .nota{
            border:1px solid #dcdcdc;
            border-radius:6px;
            margin-bottom:20px;
            overflow:hidden;
            paddind: 30px;
            page-break-inside: avoid;
         }

         .nota-header{
            background: #62656e;
            color: #fff;
            padding:8px 10px;
         }

         .nota-header h2{
            font-size:13px;
            margin-bottom:2px;
         }

         .nota-header p{
            font-size:9px;
            color:#dce3ff;
         }

         .info{
            width:100%;
            border-collapse: collapse;
         }

         .info td{
            border-bottom:1px solid #eee;
            padding:5px 8px;
            vertical-align:top;
         }

         .label{
            font-size:8px;
            text-transform:uppercase;
            color:#777;
            margin-bottom:2px;
         }

         .value{
            font-size:10px;
            color:#222;
         }

         .section{
            padding:7px 10px;
            border-bottom:1px solid #eee;
         }

         .section-title{
            font-size:8px;
            text-transform:uppercase;
            color:#666;
            margin-bottom:4px;
            font-weight:bold;
         }

         .section-text{
            font-size:10px;
            line-height:1.4;
            text-align:justify;
         }

         .badge{
            display:inline-block;
            padding:2px 6px;
            border-radius:12px;
            font-size:8px;
            background:#E6F1FB;
            color:#185FA5;
            margin-right:4px;
         }

         hr{
            border:none;
            border-top:1px dashed #ccc;
            margin:8px 0;
         }

      </style>

   </head>

   <body>

      <header>
         <h1>LIB Laboratorios</h1>
         <h3>Unidad Y Gabinete Especializado</h3>
         <h5>Nota médica</h5>
         Paciente: '.htmlspecialchars($data[0]['paciente']).'
      </header>

      <footer>
         Documento clínico
      </footer>

      <main class="main">';

         foreach($data as $nota){

            $html .= '
            <div class="nota">

               <div class="nota-header">
                  <h4>No. Nota: '.htmlspecialchars($nota['id_nota_medica']).'</h4>
                  <p>
                     Doctor: '.htmlspecialchars($nota['doctor']).'
                     &nbsp;&nbsp;|&nbsp;&nbsp;
                     Fecha: '.htmlspecialchars($nota['fecha_cap_format'] ?? '')
                  .'</p>
               </div>

               <table class="info">
                  <tr>
                     <td width="12%">
                        <div class="label">TA</div>
                        <div class="value">'.$nota['ta'].'</div>
                     </td>

                     <td width="12%">
                        <div class="label">OX</div>
                        <div class="value">'.$nota['oxigenacion'].'%</div>
                     </td>

                     <td width="12%">
                        <div class="label">TEMP</div>
                        <div class="value">'.$nota['temperatura'].'°</div>
                     </td>

                     <td width="12%">
                        <div class="label">FC</div>
                        <div class="value">'.$nota['fc'].'</div>
                     </td>

                     <td width="12%">
                        <div class="label">FR</div>
                        <div class="value">'.$nota['fr'].'</div>
                     </td>

                     <td width="12%">
                        <div class="label">GLUC</div>
                        <div class="value">'.$nota['glucosa'].'</div>
                     </td>

                     <td width="14%">
                        <div class="label">PESO</div>
                        <div class="value">'.$nota['peso'].' kg</div>
                     </td>

                     <td width="14%">
                        <div class="label">ESTATURA</div>
                        <div class="value">'.$nota['estatura'].' cm</div>
                     </td>
                  </tr>
               </table>

               <div class="section">

                  '.(
                     $nota['mapa']
                     ? '<span class="badge">MAPA</span>'
                     : ''
                  ).'

                  '.(
                     $nota['holter']
                     ? '<span class="badge">HOLTER</span>'
                     : ''
                  ).'

                  '.(
                     $nota['esfuerzo']
                     ? '<span class="badge">P. ESFUERZO</span>'
                     : ''
                  ).'

               </div>

               <div class="section">
                  <div class="section-title">Padecimiento actual</div>
                  <div class="section-text">
                     '.nl2br(htmlspecialchars($nota['padecimiento'])).'
                  </div>
               </div>

               <div class="section">
                  <div class="section-title">Exploración física</div>
                  <div class="section-text">
                     '.nl2br(htmlspecialchars($nota['exploracion'])).'
                  </div>
               </div>

               <div class="section">
                  <div class="section-title">Diagnóstico</div>
                  <div class="section-text">
                     <strong>Principal:</strong>
                     '.nl2br(htmlspecialchars($nota['diagnostico_principal'])).'
                     <br><br>

                     <strong>Secundario:</strong>
                     '.nl2br(htmlspecialchars($nota['diagnostico_secundario'])).'
                  </div>
               </div>

               <div class="section">
                  <div class="section-title">Tratamiento</div>
                  <div class="section-text">
                     '.nl2br(htmlspecialchars($nota['tratamiento'])).'
                  </div>
               </div>

               <div class="section">
                  <div class="section-title">Estudios solicitados</div>
                  <div class="section-text">
                     <strong>Análisis clínicos:</strong><br>
                     '.nl2br(htmlspecialchars($nota['analisis_clinicos'])).'
                     <br><br>

                     <strong>Gabinete:</strong><br>
                     '.nl2br(htmlspecialchars($nota['estudios_gabinete'])).'
                  </div>
               </div>

               <div class="section">
                  <div class="section-title">Receta médica</div>
                  <div class="section-text">
                     '.nl2br(htmlspecialchars($nota['receta'])).'
                  </div>
               </div>

            </div>';

         }

      $html .= '
      </main>
   </body>
</html>';

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