<?php
  require_once('../model/Usuarios.php');
  require_once('../model/Globales.php');
  $u = new Usuarios();
  $g = new Globales();
  $_POST = json_decode(file_get_contents("php://input"), true);
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {
        
        case 'obtiene_doctores':
          $res = $u->obtiene_doctores();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        // Funciones de CRUD de usuarios
        case 'obtiene_usuarios':
          $res = $u->obtiene_usuarios();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        case 'guardar':
          $userExist = $u->usuario_existente($_POST["idUsuario"], $_POST["usuario"]);
          if($userExist) {
            $res = array('estatus' => 202, 'data'=>[], 'mensaje' => 'El usuario ya existe');
          } 
          else {
            if($_POST["idUsuario"] == '0') {
              $res = $u->guardar_usuario($_POST, $_SESSION["nombre"]);
              $mensaje_bitacora = 'Usuario registrado: '.$_POST["nomUsuario"];
              $id_usuario = $res["data"][0];
            } 
            else {
              $id_usuario = $_POST["idUsuario"];
              $res = $u->actualizar_usuario($_POST, $_SESSION["nombre"]);
              $mensaje_bitacora = 'Usuario modificado: '.$_POST["nomUsuario"];
            }

            if($res["estatus"] == 200) {
              $g->bitacora($mensaje_bitacora, $id_usuario, $_SESSION["id_usuario"], $_SESSION["nombre"]);
            }
          }
          echo json_encode($res);
        break;

        case 'eliminar':
          $res = $u->eliminar_usuario($_POST["idUsuario"]);
          if($res["estatus"] == 200) {
            $g->bitacora('Usuario eliminado: '.$_POST["nomUsuario"], $_POST["idUsuario"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }         
          
          echo json_encode($res);
        break;

        case 'consulta_log':

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

          $fecha_ini = $_POST["fecIni"].' 00:00:00';
          $fecha_fin = $_POST["fecFin"].' 23:59:59';

          $res = $u->consulta_log($fecha_ini, $fecha_fin, $_POST["idUsuario"]);
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;

        default:
          echo json_encode(["estatus" => 401, "mensaje" => "Función no encontrada", "data" => []]);
        break;
      }
    }
    else
      echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", "data" => []]);
  } else {
    echo json_encode(["estatus" => 403, "mensaje" => "Sin permiso", "data" => []]);
  }
?>