<?php
  require_once('../model/AntFamiliar.php');
  require_once('../model/Globales.php');
  $v = new AntecedenteFamiliar();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  } 
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {
       
        case 'obtiene_antecedentes_familiares':
          if($_POST["idDoctor"] == '' || $_POST["idPaciente"] == '') {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }
          else {
            $res = $v->obtiene_antecedentes_familiares($_POST["idDoctor"], $_POST["idPaciente"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          }
        break;

        case 'agregar_antecedente_familiar':          

          if(!isset($_POST["idPaciente"]) || !isset($_POST["idDoctor"]) || !isset($_POST["familiar"]) || !isset($_POST["padecimiento"])) {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }
          
          $res = $v->agregar_antecedente_familiar($_POST, $_SESSION["nombre"]);
          $id_antecedente = $res["data"][0];          

          if($res["estatus"] == 200) {
            $g->bitacora('Antecedente familiar: '.$id_antecedente.', registrado al paciente: '.$_POST["nomPaciente"]. ', del doctor: '.$_POST["nomDoctor"], $_POST["idPaciente"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          echo json_encode($res);

        break;

        case 'eliminar_antecedente_familiar':

            if ($_POST["idAntecedente"] == '' || $_POST["familiar"] == '' || $_POST["padecimiento"] == '' || $_POST["idPaciente"] == '' || $_POST["paciente"] == '') {
              echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
              break;
            }

            $res = $v->eliminar_antecedente_familiar($_POST["idAntecedente"]);
            if($res["estatus"] == 200) {
              $g->bitacora('Antecedente eliminado, Familiar: '.$_POST["familiar"]. ' padecimiento: '.$_POST["padecimiento"].' al paciente: '.$_POST["paciente"], $_POST["idPaciente"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
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