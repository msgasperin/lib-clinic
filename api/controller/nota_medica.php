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
          if(empty($_POST["idPaciente"])) {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }
          else {
            $res = $v->obtiene_notas_medicas($_POST["idPaciente"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          }
        break;

        case 'guardar_nota_medica':

          if($_SESSION["perfil"] != 3) {
            echo json_encode(["estatus" => 500, "mensaje" => 'No tienes los permisos necesarios', "data" => []]);
            break;
          }

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
          if($_SESSION["perfil"] != 3) {
            echo json_encode(["estatus" => 500, "mensaje" => 'No tienes los permisos necesarios', "data" => []]);
            break;
          }

          $res = $v->eliminar_nota($_POST["idNota"]);
          if($res["estatus"] == 200) {
              $g->bitacora('Nota eliminada: '.$_POST["idNota"].' del paciente: '.$_POST["nomPaciente"], $_POST["idCita"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
          }            
          echo json_encode($res);
        break;

        //+++++++++++++++++++++++++++++++++++++++++++++++++ ADJUNTOS NOTAS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        case 'obtiene_adjuntos_nota':
          if($_POST["idNota"] == '') {
            echo json_encode(["estatus" => 500, "mensaje" => 'Faltaron parámetros importantes', "data" => []]);
            break;
          }
          else {
            $res = $v->obtiene_adjuntos_nota($_POST["idNota"], $_POST["origen"]);
            echo json_encode(["estatus" => 200, "mensaje" => "", "data" => $res]);
          }
        break;

        case 'subir_adjunto_nota':

          if($_POST["idNota"] == '' || $_POST["idCita"] == '' || $_POST["nomAdjuntoNota"] == '' || $_POST["origen"] == '') {
            echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]);
            break;
          }
          
          $nombre_archivo = $_FILES['documento']['name'];	
          $tmp_archivo    = $_FILES['documento']['tmp_name'];		
          $ext            = explode(".",$_FILES['documento']['name']);
          $extension      = end($ext);
          $nomFile        = $_POST["idNota"].'_'.$_POST["idCita"].'_'.date('ymdhis').'.'.$extension;
          $upload_folder  = '../../webapp/assets/docs/adjuntos_nota/'.$_POST["idCita"].'/';
          $archivador     = $upload_folder.$nomFile;

          if(!file_exists($upload_folder)) { //Si no existe la carpeta
            if(mkdir($upload_folder)) {
              copy('../../webapp/assets/docs/adjuntos_nota/index.php', $upload_folder.'/index.php');
            }
          }

          if(move_uploaded_file($tmp_archivo, $archivador)) {
            $res = $v->inserta_documento_nota($_POST["nomAdjuntoNota"], $nomFile, $_POST["idNota"], $_POST["idDoctor"], $_POST["idCita"], $_POST["origen"]);
            if($res["estatus"] == 200) {
              echo json_encode(['estatus' => 200, 'mensaje' => 'ok', 'data' => []]);
            }
            else {
              echo json_encode(['estatus' => 208, 'mensaje' => 'Hubo un problema con la subida del archivo - BD', 'data' => []]);
              if(file_exists($archivador)) {
                unlink($archivador);
              }
            }
          }
          else {
            echo json_encode(['estatus' => 208, 'mensaje' => 'Hubo un problema con la subida del archivo', 'data' => []]);
          }                    
        break;

        case 'eliminar_adjunto_nota':

          if(!isset($_POST["idNota"]) || !isset($_POST["idCita"]) || $_POST["nomArchivo"] == '') {
            echo json_encode(["estatus" => 406, "mensaje" => "Parámetros incompletos", 'data' => []]);
            break;
          }

          $res = $v->eliminar_adjunto_nota($_POST["id"]);
          if($res["estatus"] == 200) {
            $ruta = '../../webapp/assets/docs/adjuntos_nota/'.$_POST["idCita"].'/'.$_POST["archivo"];
            if($ruta) {
              unlink($ruta);
            }
            $g->bitacora('Archivo adjunto de nota eliminado : '.$_POST["nomArchivo"], $_POST["idNota"] , $_SESSION["id_usuario"], $_SESSION["nombre"]);
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