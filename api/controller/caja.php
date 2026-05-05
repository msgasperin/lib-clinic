<?php
   require_once('../model/Caja.php');
   require_once('../model/Globales.php');
   $c = new Caja();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         case 'obtiene_corte_caja_dia':

            if(empty($_POST["fecha"])) {
               echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
               break;
            }
            else {
               $fecha_ini = $_POST["fecha"].' 00:00:00';
               $fecha_fin = $_POST["fecha"].' 23:59:59';

               $res = $c->obtiene_corte_caja_dia($_SESSION["id_fabrica"], $_POST["fecha"], $fecha_ini, $fecha_fin);
               echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);
            }
         break;

         case 'obtiene_movimientos_caja':

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

               $res = $c->obtiene_movimientos_caja($_SESSION["id_fabrica"], $fecha_ini, $fecha_fin);
               echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);
            }
         break;

         case 'guardar_movimiento_caja':

            if(!isset($_POST)) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               break;
            }

            if($_POST["idMovimiento"] == 0) {
               $res = $c->registrar_movimiento_caja($_POST, $_SESSION["id_fabrica"], $_SESSION["nombre"]);
               $mensaje = 'Movimiento caja registrado: '.$_POST["tipo"].', '.$_POST["concepto"];
               $id      = $res["data"][0];
            }
            else {
               $res = $c->actualizar_movimiento_caja($_POST, $_SESSION["nombre"]);
               $mensaje = 'Movimiento caja actualizado: '.$_POST["tipo"].', '.$_POST["concepto"];
               $id      = $_POST["idMovimiento"];
            }

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje, $id , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'validar_movimiento_caja':

            if(!isset($_POST)) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               break;
            }

            if($_SESSION["perfil"] != 1) {
               
               $res = ['estatus' => 401, 'mensaje' => 'No tienes permiso para relizar esta acción', 'data' => []];
               break;
            }

            $res = $c->validar_movimiento_caja($_POST["idMovimiento"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Movimiento caja validado: '.$_POST["tipo"].', '.$_POST["concepto"], $_POST["idMovimiento"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
         break;

         case 'eliminar_movimiento_caja':
            if(!isset($_POST)) {
               $res = ['estatus' => 500, 'mensaje' => 'Faltaron parámetros importantes', 'data' => []];
               break;
            }
            $res = $c->eliminar_movimiento_caja($_POST["idMovimiento"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Movimiento caja eliminado: '.$_POST["tipo"].', '.$_POST["concepto"], $_POST["idMovimiento"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }            
            echo json_encode($res);
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