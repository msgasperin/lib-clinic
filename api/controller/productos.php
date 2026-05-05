<?php
   require_once('../model/Productos.php');
   require_once('../model/Globales.php');
   $p = new Productos();
   $g = new Globales();

   $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
   if (strpos($contentType, "application/json") !== false) {
      $_POST = json_decode(file_get_contents("php://input"), true);
   } 
  
   if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
      if(isset($_POST['func'])) {
         switch ($_POST['func']) {

         // ********************************************************** Funciones de CRUD de productos **********************************************************************
         case 'obtiene_productos':
            $res = $p->obtiene_productos();          
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar_producto':          
            if($_POST["idProducto"] == '0') {
               $res = $p->guardar_producto($_POST, $_SESSION["nombre"], $_SESSION["id_fabrica"]);
               $mensaje_bitacora = 'Producto registrado: '.$_POST["nomProducto"];
               $id_producto = $res["data"][0];
            } 
            else {
               $id_producto = $_POST["idProducto"];
               $res = $p->actualizar_producto($_POST, $_SESSION["id_fabrica"]);
               $mensaje_bitacora = 'Producto modificado: '.$_POST["nomProducto"];
            }

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_producto, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $g->bitacora($res["mensaje"], $id_producto, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'eliminar_producto':
            $response = $p->eliminar_producto($_POST["idProducto"]);
            if($response) {
               $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
               $g->bitacora('Producto eliminado: '.$_POST["nomProducto"], $_POST["idProducto"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar el producto', 'data'=>[]);
            }
            
            echo json_encode($res);
         break;

         // ********************************************************** Funciones de CRUD de sabores **********************************************************************
         case 'obtiene_sabores':
            $res = $p->obtiene_sabores();
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar_sabor':

            $res = $p->guardar_sabor($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Sabor registrado: '.$_POST["nomSabor"];
            $id_sabor         = $res["data"][0];            

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_sabor, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'eliminar_sabor':
            $response = $p->eliminar_sabor($_POST["idSabor"]);
            if($response) {
               $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
               $g->bitacora('Sabor eliminado: '.$_POST["nomSabor"], $_POST["idSabor"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar el sabor', 'data'=>[]);
            }
            
            echo json_encode($res);
         break;

         // ********************************************************** Funciones de CRUD de unidades de medida **********************************************************************
         case 'obtiene_unidades_medida':
            $res = $p->obtiene_unidades_medida();
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar_unidad_medida':

            $res = $p->guardar_unidad_medida($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Unidad de medida registrada: '.$_POST["nomUniMedida"];
            $id_presentacion  = $res["data"][0];            

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_presentacion, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'eliminar_unidad_medida':
            $response = $p->eliminar_unidad_medida($_POST["idUniMedida"]);
            if($response) {
               $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
               $g->bitacora('Unidad de medida eliminada: '.$_POST["nomUniMedida"], $_POST["idUniMedida"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar la unidad de medida', 'data'=>[]);
            }
            
            echo json_encode($res);
         break;

         // ********************************************************** Funciones de CRUD presentaciones **********************************************************************
         case 'obtiene_presentaciones':
            $res = $p->obtiene_presentaciones();
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
         break;

         case 'guardar_presentacion':

            $res = $p->guardar_presentacion($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Presentación registrada: '.$_POST["nomPresentacion"];
            $id_presentacion  = $res["data"][0];            

            if($res["estatus"] == 200) {
               $g->bitacora($mensaje_bitacora, $id_presentacion, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            echo json_encode($res);
         break;

         case 'eliminar_presentacion':
            $response = $p->eliminar_presentacion($_POST["idPresentacion"]);
            if($response) {
               $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
               $g->bitacora('Presentación eliminada: '.$_POST["nomPresentacion"], $_POST["idPresentacion"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
            else {
               $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar la presentación', 'data'=>[]);
            }
            
            echo json_encode($res);
         break;

         // ********************************************************** Funciones de CRUD tipos **********************************************************************
         case 'obtiene_tipos_producto':
            $res = $p->obtiene_tipos_producto();
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
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