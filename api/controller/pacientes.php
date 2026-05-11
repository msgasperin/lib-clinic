<?php
  require_once('../model/Pacientes.php');
  require_once('../model/Globales.php');
  $v = new Pacientes();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  } 
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {

        case 'obtiene_pacientes':
          $res = $v->obtiene_pacientes();          
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
        break;


        case 'guardar_paciente':

          if($_POST["idPaciente"] == '0') {
            $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            $key_query = '';
            for ($i = 0; $i < 10; $i++) {
              $key_query .= $chars[rand(0, strlen($chars) - 1)];
            }

            $res = $v->guardar_paciente($_POST, $_SESSION["nombre"], $key_query);
            $mensaje_bitacora = 'Paciente registrado: '.$_POST["nomPaciente"];
            $id_paciente = $res["data"][0];
          } 
          else {
            $id_paciente = $_POST["idPaciente"];
            $res = $v->actualizar_paciente($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Paciente modificado: '.$_POST["nomPaciente"];
          }

          if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_paciente, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          echo json_encode($res);
        break;

        case 'eliminar':
          $response = $v->eliminar_paciente($_POST["idPaciente"]);
          if($response) {
            $res = array('estatus' => 200, 'mensaje' => 'ok', 'data'=>[]);
            $g->bitacora('Paciente eliminado: '.$_POST["nomPaciente"], $_POST["idPaciente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          else {
            $res = array('estatus' => 500, 'mensaje' => 'error al intentar eliminar al paciente', 'data'=>[]);
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