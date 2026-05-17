<?php  
	require_once('../config/class.pdo.php');
	class AntecedenteFamiliar extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  }
  
    public function obtiene_antecedentes_familiares(int $id_doctor, int $id_paciente) {
      try {
        $res = [];
        
        $sql = $this->dbh->prepare("SELECT id_antecedente, familiar, padecimiento, id_paciente_fk, paciente_hist, doctor_hist, user_cap, fecha_cap, DATE_FORMAT(fecha_cap,'%d-%m-%Y %H:%i:%s') AS fecha_cap_format FROM ant_familiar WHERE id_doctor_fk = ? AND id_paciente_fk = ?");
        $sql->execute([$id_doctor, $id_paciente]);
        
        $res = $sql->fetchAll(PDO::FETCH_ASSOC);				
      } catch (Exception $error) {
          error_log($error->getMessage());
      }
      
      return $res;
    }

    public function agregar_antecedente_familiar(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar insertar';
      try {        		
        $sql = $this->dbh->prepare("INSERT INTO ant_familiar (id_paciente_fk, paciente_hist, id_doctor_fk, doctor_hist, familiar, padecimiento, user_cap) VALUES (?,?,?,?,?,?,?)");
        $ok  = $sql->execute(array(
          $post["idPaciente"], 
          $post["nomPaciente"],
          $post["idDoctor"], 
          $post["nomDoctor"], 
          $post["familiar"], 
          $post["padecimiento"],
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
        //print_r($error->getMessage());
      }
            
      $res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
      return $res;
    }

    public function eliminar_antecedente_familiar(int $id_antecedente) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar marcar cita como atendida';
      try {
        $sql = $this->dbh->prepare("DELETE FROM ant_familiar WHERE id_antecedente = ?");
        $sql->execute(array($id_antecedente));
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