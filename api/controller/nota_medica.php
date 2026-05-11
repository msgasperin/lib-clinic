<?php
  require_once('../model/NotaMedica.php');
  require_once('../model/Globales.php');
  $v = new NotaMedica();
  $g = new Globales();

  $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
  if (strpos($contentType, "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
  } 
  
  if(isset($_SESSION["id_usuario"]) && $_SESSION["id_usuario"] != '') {
    if(isset($_POST['func'])) {
      switch ($_POST['func']) {
       
        case 'obtiene_notas_medicas':
          if($_POST["idPaciente"] == '' || $_POST["idDoctor"] == '') {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
          }
          else {
            $res = $v->obtiene_notas_medicas($_POST["idPaciente"], $_SESSION["id_usuario"], $_SESSION["perfil"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          }
        break;

        case 'guardar_nota_medica':          

          if($_POST["idPaciente"] == "" || $_POST["idDoctor"] == "" || $_POST["idCita"] == "" || $_POST["ta"] == "" || $_POST["oxigenacion"] == "" || $_POST["temperatura"] == "" || $_POST["fc"] == "" || $_POST["peso"] == "" || $_POST["estatura"] == "" || $_POST["padecimiento"] == "" || $_POST["tratamiento"] == "" || $_POST["diagnosticoPrincipal"] == "" || $_POST["receta"] == "") {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }
                    
          if($_POST["idNota"] == '0') {
            $res = $v->guardar_nota_medica($_POST, $_SESSION["nombre"]);
            $id_nota = $res["data"][0];
            $mensaje_bitacora = 'Nota médica registrada: '.$id_nota.' del paciente: '.$_POST["nomPaciente"];
          } 
          else {
            $id_nota = $_POST["idNota"];
            $res = $v->actualizar_nota($_POST, $_SESSION["nombre"]);
            $mensaje_bitacora = 'Nota médica modificada: '.$id_nota.' del paciente: '.$_POST["nomPaciente"];
          }

          if($res["estatus"] == 200) {
            $g->bitacora($mensaje_bitacora, $_POST["idCita"], $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }
          echo json_encode($res);

        break;

        case 'eliminar_nota':            
            $res = $v->eliminar_nota($_POST["idNota"]);
            if($res["estatus"] == 200) {
               $g->bitacora('Nota eliminada: '.$_POST["idNota"].' del paciente: '.$_POST["nomPaciente"], $_POST["idCita"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
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