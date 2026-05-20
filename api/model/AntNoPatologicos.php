<?php  
	require_once('../config/class.pdo.php');
	class AntecedenteNoPatologico extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  }
  
    public function obtiene_antecedentes_no_patologicos(int $id_paciente) {
      try {
        $res = [];
        
        $sql = $this->dbh->prepare("SELECT id, id_paciente_fk, paciente_hist, habitat, servicios_basicos, viajes_extranjero, hace_cuanto, donde, fimicos, actividad_fisica, cual, horas_semana FROM ant_no_patologicos WHERE id_paciente_fk = ?");
        $sql->execute([$id_paciente]);
        
        $res = $sql->fetchAll(PDO::FETCH_ASSOC);				
      } catch (Exception $error) {
          error_log($error->getMessage());
      }
      
      return $res;
    }

    public function valida_insert_update(int $id_paciente): bool {
      try {          
          $sql = $this->dbh->prepare("SELECT id FROM ant_no_patologicos WHERE id_paciente_fk = ? LIMIT 1");
          $sql->execute([$id_paciente]);        
          $respuesta = $sql->fetch(PDO::FETCH_ASSOC);
          
          return (bool)$respuesta;

      } catch (Exception $error) {
          error_log($error->getMessage());
          return false;
      }
    }

    public function inserta_antecedentes_no_patologicos(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar insertar';
      try {        		
        $sql = $this->dbh->prepare("INSERT INTO ant_no_patologicos (id_paciente_fk, paciente_hist, habitat, servicios_basicos, viajes_extranjero, hace_cuanto, donde, fimicos, actividad_fisica, cual, horas_semana, user_cap) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
        $ok  = $sql->execute(array(
          $post["idPaciente"], 
          $post["nomPaciente"],
          $post["habitat"], 
          $post["servicios"], 
          $post["viajes"], 
          $post["haceCuanto"],
          $post["donde"],
          $post["fimicos"],
          $post["actividad"],
          $post["ejercicio"],
          $post["horasEjer"],
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

    public function actualizar_antecedentes_no_patologicos(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar actualizar';
      try {        		
        $sql = $this->dbh->prepare("UPDATE ant_no_patologicos SET habitat = ?, servicios_basicos = ?, viajes_extranjero = ?, hace_cuanto = ?, donde = ?, fimicos = ?, actividad_fisica = ?, cual = ?, horas_semana = ?, user_cap = ?, fecha_cap = ? WHERE id_paciente_fk = ?");
        $sql->execute(array(
          $post["habitat"], 
          $post["servicios"], 
          $post["viajes"], 
          $post["haceCuanto"],
          $post["donde"],
          $post["fimicos"],
          $post["actividad"],
          $post["ejercicio"],
          $post["horasEjer"],
          $user_cap,
          date('Y-m-d H:i:s'),
          $post["idPaciente"])
        );

        if($sql->rowCount() > 0) {
          $estatus = 200;
          $mensaje = 'ok';
        }
      } 
      catch (Exception $error) {
        error_log($error->getMessage());        
      }
            
      $res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
      return $res;
    }
	}
?>