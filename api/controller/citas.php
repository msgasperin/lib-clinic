<?php
  require_once('../model/Citas.php');
  require_once('../model/Globales.php');
  $v = new Citas();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  } 
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {
       
        case 'obtiene_citas':
          if($_POST["fechaInicial"] == '' || $_POST["fechaFinal"] == '') {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
          }
          else {
            $res = $v->obtiene_citas($_POST["fechaInicial"], $_POST["fechaFinal"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          }
        break;

        case 'guardar_cita':          

          if(!isset($_POST["idPaciente"]) && !isset($_POST["idDoctor"]) && !isset($_POST["fechaCita"]) && !isset($_POST["horaCita"])) {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }

          if($_POST["fechaCita"] < date('Y-m-d')) {
            echo json_encode(["estatus" => 500, "mensaje" => 'No puedes registrar citas en fechas pasadas.', "data" => []]);
            break;
          }
          
          $cruce = $v->valida_disponibilidad($_POST["idCita"], $_POST["fechaCita"], $_POST["horaCita"], $_POST["idDoctor"]);
    
          if($cruce) {
            // Si hay cruce, mandamos un error 400 y los datos de la cita que estorba
            echo json_encode([
                "estatus" => 400, 
                "mensaje" => "El doctor ya tiene una cita a las " . $cruce['hora'] . " con " . $cruce['paciente'],
                "data" => $cruce
            ]);
            break; // Importante detener la ejecución aquí
          }
          
          if($_POST["idCita"] == '0') {
            $res = $v->guardar_cita($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Cita registrada: '.$_POST["nomPaciente"];
            $id_cita = $res["data"][0];
          } 
          else {
            $id_cita = $_POST["idPaciente"];
            $res = $v->actualizar_cita($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Cita modificada: '.$_POST["nomPaciente"];
          }

          if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $id_cita, $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          echo json_encode($res);

        break;

        case 'cancelar_cita':            
            $res = $v->cancelar_cita($_POST["idCita"], $_POST["motivo"], $_SESSION["nombre"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Cita cancelada del paciente '.$_POST["nomPaciente"], $_POST["idCita"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
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