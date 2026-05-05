<?php
  require('../../public/lib/PHPMailer/Exception.php');
  require('../../public/lib/PHPMailer/PHPMailer.php');
  require('../../public/lib/PHPMailer/SMTP.php');

  use PHPMailer\PHPMailer\PHPMailer;

  if(isset($_POST["func"])) {
    $estatus = 0;
    $mensaje = '';
    if($_POST["func"] == "fnSendToken") 	{
      if(isset($_POST["correo"]) && trim($_POST["correo"]) != '') {

        require_once('../config/class.pdo.php');
        $v = new Conexion();
        $v->conectar(); 

        $sql = $v->dbh->prepare("SELECT token, nombre FROM cat_usuarios WHERE correo = ?");
        $sql->execute(array($_POST["correo"]));
        if($sql->rowCount()>=1) {

          if($_POST["movimiento"] == 1) {
            $movimiento = 'Generar token para inicio de sesión';
            $mov = 'inicio de sesión';
          } else {
            $movimiento = 'Generar token para recuperar contraseña';
            $mov = 'recuperación de contraseña';
          }

          $row = $sql->fetch(PDO::FETCH_ASSOC);
          $contenido = 
          '<center>
            <div style="border: solid 2px #EFEEED; background-color:#EFEEED; border-radius:5px; width:95%; padding: 10px;">
              <br><br>
              <span style="color:#666666">Notificación ITSX</span>
              <br><br><br>
              <div style="background-color:#001F39; width:60%; padding: 20px; color:#FFFFFF; font-size:25px; border-bottom: solid 10px #DABD3D;">
                ITSX
              </div>
              <div style="background-color:#FFFFFF; width:60%; padding: 20px;">
                <div style="color: #001F39; font-size:25px; margin-top:30px; text-align: left; padding:20px;">
                  Hola '.$row["nombre"].':
                </div>
                <div style="color: #001F39; font-size:18px; margin-top:10px; text-align: left; padding:20px;">
                  Se ha realizado una solicitud de '.$mov.' al SIEV; para continuar se generó el siguiente <strong>Token</strong>
                </div>
                <div style="color: #001F39; font-size:35px; margin-top:10px; padding:20px; background-color:#EFEEED; width:92%; border-radius:5px;">
                  '.$row["token"].'
                </div>
                <div style="color: #666666; font-size:15px; margin-top:20px; text-align: left; padding:20px;">
                  DETALLES DEL MOVIMIENTO<br><br>
                  Movimiento: <br>'.$movimiento.'
                  <br><br>
                  Fecha:<br> '.date('Y-m-d H:i:s').'
                </div>
              </div>
            </div>
          </center>';

          $oMail             = new PHPMailer();
          $oMail->isSMTP();
          $oMail->CharSet    = 'UTF-8';
          $oMail->Host       = 'smtp.gmail.com';  
          $oMail->SMTPSecure = 'tls'; //Tipo se seguridad
          $oMail->Port       = 587;   //Puerto      
          $oMail->SMTPAuth   = true;  //True indica que se tendrá que aunténticar por FTP.      
          // $oMail->Username   = 'segobver.egob@gmail.com';
          // $oMail->Password   = 'pjczhzqrocikkvjc';
          $oMail->Username   = 'miguel.gasperin9@gmail.com';
          $oMail->Password   = 'qresaqxpybbbrojo';          

          $oMail->setFrom('miguel.gasperin9@gmail.com','Centro de notificaciones ITSX');
          $oMail->addAddress($_POST["correo"], $row["nombre"]);
          $oMail->Subject    = 'Token de acceso';			
          $oMail->msgHTML($contenido);

          //$oMail->SMTPDebug = 2; //Muestra los errores detallados de la comunicación con el servidor SMTP
          if($oMail->send()) {
              $estatus = 200;
              $mensaje = 'Correo enviado';
          } else {
            $estatus = 500;
            $mensaje = 'Token no enviado, vuelve a intentarlo';
          }
        } else {
          $estatus = 404;
          $mensaje = 'Problemas para obtener el token';
        }
      }
      else {
        $estatus = 500;
        $mensaje = 'Parámetros incompletos';
      }
    }
  }
  header('Content-Type: application/json');
  $datos = array('estatus' => $estatus, 'mensaje' => $mensaje);	
  echo json_encode($datos, JSON_FORCE_OBJECT);
?>