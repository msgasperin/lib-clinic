<?php
  require_once('../model/AntNoPatologicos.php');
  require_once('../model/Globales.php');
  $v = new AntecedenteNoPatologico();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  } 
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {
       
        case 'obtiene_antecedentes_no_patologicos':
          if(empty($_POST["idPaciente"]) || empty($_POST["idPaciente"])) {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }

          $res = $v->obtiene_antecedentes_no_patologicos($_POST["idPaciente"]);
          echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          
        break;

        case 'guardar_antecedentes_no_patologicos':

          if(empty($_POST["idPaciente"]) || empty($_POST["idPaciente"])) {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }
          
          $resVal = $v->valida_insert_update($_POST["idPaciente"]);
          if($resVal) {
            $res = $v->actualizar_antecedentes_no_patologicos($_POST, $_SESSION["nombre"]);
            $mensaje = 'Antecedentes no patologicos actualizados del paciente: '.$_POST["nomPaciente"];
          }
          else {
            $res = $v->inserta_antecedentes_no_patologicos($_POST, $_SESSION["nombre"]);
            $mensaje = 'Antecedentes no patologicos registrados del paciente: '.$_POST["nomPaciente"];
          }          
          
          if($res["estatus"] == 200) {
            $g->bitacora($mensaje, $_POST["idPaciente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
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