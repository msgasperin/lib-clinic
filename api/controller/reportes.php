<?php
   require_once('../model/Reportes.php');
   require_once('../model/Globales.php');
   $r = new Reportes();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         case 'obtiene_operativos':            
            $res = $r->obtiene_operativos();
            echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);            
         break;

         case 'obtiene_reporte_produccion':  
            $fecha_ini = $_POST["fecIni"].' 00:00:00';
            $fecha_fin = $_POST["fecFin"].' 23:59:59';          
            $res = $r->obtiene_reporte_produccion($_POST["idUsuario"], $fecha_ini, $fecha_fin);
            echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);            
         break;

         case 'obtiene_reporte_stock_critico':            
            $res = $r->obtiene_reporte_stock_critico($_SESSION["id_fabrica"]);
            echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);            
         break;
         
         case 'obtiene_reporte_utilidades':
            
            if(empty($_POST["fecIni"]) || empty($_POST["fecFin"])) {
               echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
               break;
            }
            // Validar que la diferencia no sea mayor a 30 días
            $fechaInicio = new DateTime($_POST["fecIni"]);
            $fechaFin    = new DateTime($_POST["fecFin"]);
            $diff        = $fechaInicio->diff($fechaFin);

            if ($diff->days > 30) {
               echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
               break;
            }
            else {
               $fecha_ini = $_POST["fecIni"].' 00:00:00';
               $fecha_fin = $_POST["fecFin"].' 23:59:59';
               $res = $r->obtiene_reporte_utilidades($_SESSION["id_fabrica"], $fecha_ini, $fecha_fin);
               echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);
            }
         break;

         case 'obtiene_reporte_mas_vendidos':    

            if(empty($_POST["fecIni"]) || empty($_POST["fecFin"])) {
               echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
               break;
            }
            // Validar que la diferencia no sea mayor a 30 días
            $fechaInicio = new DateTime($_POST["fecIni"]);
            $fechaFin    = new DateTime($_POST["fecFin"]);
            $diff        = $fechaInicio->diff($fechaFin);

            if ($diff->days > 30) {
               echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
               break;
            }
            else {
               $fecha_ini = $_POST["fecIni"].' 00:00:00';
               $fecha_fin = $_POST["fecFin"].' 23:59:59';
               $res = $r->obtiene_reporte_mas_vendidos($_SESSION["id_fabrica"], $fecha_ini, $fecha_fin);
               echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);
            }
         break;

         case 'obtiene_reporte_mejores_clientes':  
            if(empty($_POST["fecIni"]) || empty($_POST["fecFin"])) {
               echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
               break;
            }          
            // Validar que la diferencia no sea mayor a 30 días
            $fechaInicio = new DateTime($_POST["fecIni"]);
            $fechaFin    = new DateTime($_POST["fecFin"]);
            $diff        = $fechaInicio->diff($fechaFin);

            if ($diff->days > 30) {
               echo json_encode(["estatus" => 500, "mensaje" => 'El rango de fechas no puede ser mayor a 30 días', "data" => []]);
               break;
            }
            else {
               $fecha_ini = $_POST["fecIni"].' 00:00:00';
               $fecha_fin = $_POST["fecFin"].' 23:59:59';
               $res = $r->obtiene_reporte_mejores_clientes($_SESSION["id_fabrica"], $fecha_ini, $fecha_fin);
               echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);
            }
         break;


         default:
            echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", 'data' => []]); // Función no encontrada
         break;
         }
      }
      else
         echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]); // Parámatros no enviados
   } else {
      echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", 'data' => []]); // Sin sesión de usuarios
   }
?>