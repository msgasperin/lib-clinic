<?php
   require_once('../model/Inventario.php');
   require_once('../model/Globales.php');
   $i = new Inventario();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         case 'obtiene_movimientos_producto':

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

               if($_POST["idProducto"] <= 0 || $_POST["idProducto"] == '') {
                  echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
               }
               else {
                  $res = $i->obtiene_movimientos_producto($_SESSION["id_fabrica"], $_POST["idProducto"], $fecha_ini, $fecha_fin);
                  echo json_encode(["estatus" => 200, "mensaje" => 'ok', "data" => $res]);
               }
            }
         break;

         case 'obtiene_productos_inventario':
            $res = $i->obtiene_productos_inventario($_SESSION["id_fabrica"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
            if(isset($_SESSION["carrito_entrada_inventario"])) {
               unset($_SESSION["carrito_entrada_inventario"]);  
            }
         break;

         case 'entrada_carrito_inventario':
               $id_producto   = $_POST["idProducto"];
               $sku           = $_POST["sku"];
               $nom_producto  = $_POST["nomProducto"];
               $costo         = (float)$_POST["costo"];
               $cantidad      = (float)$_POST["cantidad"];
               
               if (isset($_SESSION["carrito_entrada_inventario"][$id_producto])) {
                  // Ya existe → sumamos cantidad
                  $_SESSION["carrito_entrada_inventario"][$id_producto]['cantidad'] += $cantidad;
               } else {
                  // No existe → lo creamos
                  $_SESSION["carrito_entrada_inventario"][$id_producto] = [
                     'id'           => $id_producto,
                     'id_producto'  => $id_producto,
                     'sku'          => $sku,
                     'nom_producto' => $nom_producto,
                     'costo'        => $costo,
                     'cantidad'     => $cantidad
                  ];
               }

               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => $_SESSION["carrito_entrada_inventario"]];

            echo json_encode($res);
         break;

         case 'borrar_carrito_inventario':
            if(isset($_SESSION["carrito_entrada_inventario"])) {
               unset($_SESSION["carrito_entrada_inventario"]);  
            }
            
            $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];

            echo json_encode($res);
         break;

         case 'borrar_producto_carrito_inventario':
            if(isset($_SESSION["carrito_entrada_inventario"][$_POST["idCarrito"]])) {
               unset($_SESSION["carrito_entrada_inventario"][$_POST["idCarrito"]]);
               $res = ['estatus' => 200, 'mensaje' => 'ok', 'data' => []];
            }
            else {
               $res = ['estatus' => 500, 'mensaje' => 'error', 'data' => []];
            }

            echo json_encode($res);
         break;

         case 'registrar_entrada_inventario':
            if(!isset($_SESSION["carrito_entrada_inventario"]) || empty($_SESSION["carrito_entrada_inventario"])) {
               $estatus = 406;
               $mensaje = 'Hubo un problema para obtener el listado de productos';
               $res     = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => []];               
            }
            else {
               $res = $i->registrar_entrada_inventario($_POST, $_SESSION["carrito_entrada_inventario"], $_SESSION["nombre"], $_SESSION["id_fabrica"]);
               if($res["estatus"] == 200) {
                  $g->bitacora('Entrada de inventario producida por:  '.$_POST["nomProducidoPor"], $res["data"][0] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
            }
            
            echo json_encode($res);
         break;

         case 'registrar_salida_inventario':
            if($_SESSION["perfil"] == 1) {
               $res = $i->registrar_salida_inventario($_POST, $_SESSION["id_fabrica"]);
               if($res["estatus"] == 200) {
                  $g->bitacora('Salida directa de inventario producto: '.$_POST["nomProducto"].' cantidad: '.$_POST["cantidadSalidaInv"], $res["data"][0] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
               }
            }
            else {
               $res = ['estatus' => 401, 'mensaje' => 'No tienes permiso para relizar esta acción', 'data' => []];
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