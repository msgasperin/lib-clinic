<?php  
	require_once('../config/class.pdo.php');
	class Citas extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  }
  
    public function obtiene_citas(string $fecha_inicial, string $fecha_final, int $perfil, int $id_usuario) {
      try {
        $res = [];
        if($perfil == 3) { // Doctor
          $sql = $this->dbh->prepare("SELECT id_cita, id_paciente_fk, paciente, id_doctor_fk, doctor, fecha, DATE_FORMAT(fecha, '%d-%m-%Y') AS fecha_format, hora, observacion, estatus, user_cap, DATE_FORMAT(fecha_cap,'%d-%m-%Y %H:%i:%s') AS fecha_cap_format, user_cancela, DATE_FORMAT(fecha_cancela,'%d-%m-%Y %H:%i:%s') AS fecha_cancela_format FROM citas WHERE id_doctor_fk = ? AND fecha >= ? AND fecha <= ?");
          $sql->execute([$id_usuario, $fecha_inicial, $fecha_final]);
        }
        else {
          $sql = $this->dbh->prepare("SELECT id_cita, id_paciente_fk, paciente, id_doctor_fk, doctor, fecha, DATE_FORMAT(fecha, '%d-%m-%Y') AS fecha_format, hora, observacion, estatus, user_cap, DATE_FORMAT(fecha_cap,'%d-%m-%Y %H:%i:%s') AS fecha_cap_format, user_cancela, DATE_FORMAT(fecha_cancela,'%d-%m-%Y %H:%i:%s') AS fecha_cancela_format FROM citas WHERE fecha >= ? AND fecha <= ?");
          $sql->execute([$fecha_inicial, $fecha_final]);
        }
        $res = $sql->fetchAll(PDO::FETCH_ASSOC);				
      } catch (Exception $error) {
            error_log($error->getMessage());
      }
      
      return $res;
    }

    public function valida_disponibilidad(int $id_cita, string $fecha, string $hora, int $id_doctor, int $intervalo = 1800) {
      try {
        $sql = $this->dbh->prepare("SELECT id_cita, paciente, hora FROM citas WHERE id_cita <> ? AND id_doctor_fk = ? AND fecha = ? AND estatus = 1 AND ABS(TIME_TO_SEC(hora) - TIME_TO_SEC(?)) < ? LIMIT 1");
        
        $sql->execute([$id_cita, $id_doctor, $fecha, $hora, $intervalo]);
        $res = $sql->fetch(PDO::FETCH_ASSOC);

        // Si $res tiene datos, significa que NO hay disponibilidad
        // Si $res es falso, la cita se puede agendar
        return $res;      

      } catch (Exception $error) {
        error_log($error->getMessage());
        return null;
      }
    }
  
    public function guardar_cita(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar insertar';
      try {        		
        $sql = $this->dbh->prepare("INSERT INTO citas (id_paciente_fk, paciente, id_doctor_fk, doctor, fecha, hora, observacion, user_cap) VALUES (?,?,?,?,?,?,?,?)");
        $ok  = $sql->execute(array(
          $post["idPaciente"], 
          $post["nomPaciente"],
          $post["idDoctor"], 
          $post["nomDoctor"], 
          $post["fechaCita"], 
          $post["horaCita"],
          $post["obsCita"],
          $user_cap)
        );

        if($ok) {
          $id = $this->dbh->lastInsertId();
          if((int)$id > 0) {
            $estatus = 200;
            $data    = [$id];
            $mensaje = 'ok';
          }
          else {
            $estatus = 200;
            $data    = [$id];
            $mensaje = 'Registro guardado, pero no se pudo obtener el ID';
          }
            }
      } 
      catch (Exception $error) {
        error_log($error->getMessage());
      }
            
      $res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
      return $res;
    }

    public function actualizar_cita(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [];
      $mensaje = 'Error al intentar actualizar';
      try {
        $sql = $this->dbh->prepare("UPDATE citas SET id_paciente_fk = ?, paciente = ?, id_doctor_fk = ?, doctor = ?, fecha = ?, hora = ?, observacion = ?, user_cap = ? WHERE id_cita = ?");
        $ok  = $sql->execute(array(
          $post["idPaciente"], 
          $post["nomPaciente"],
          $post["idDoctor"], 
          $post["nomDoctor"], 
          $post["fechaCita"], 
          $post["horaCita"],
          $post["obsCita"],
          $user_cap,
          $post["idCita"])
        );

        if($ok) {
          $estatus = 200;
          $data    = [$post["idCita"]];
          $sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
        }
      } 
      catch (Exception $error) {
        error_log($error->getMessage());
      }
      
        $res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
      return $res;
    }

    public function cancelar_cita(int $id_cita, string $user_cap, string $motivo) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar cancelar la cita';
      try {
        $sql = $this->dbh->prepare("UPDATE citas SET user_cancela = ?, fecha_cancela = ?, estatus = ?, motivo_cancela = ? WHERE id_cita = ?");
        $sql->execute(array($user_cap, date('Y-m-d H:i:s'), 3, $motivo, $id_cita));
        if($sql->rowCount() > 0) {
          $estatus = 200;
          $mensaje = 'ok';
        }
      }
      catch (Exception $error) {
        error_log($error->getMessage());
      }

      $res = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];

      return $res;
    }

	}
?>