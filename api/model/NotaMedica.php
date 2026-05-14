<?php
	require_once('../config/class.pdo.php');
	class NotaMedica extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  }
  
    public function obtiene_notas_medicas(int $id_paciente, int $id_doctor, int $perfil) {
      try {
        $res = [];
        if($perfil == 3) { // Doctor
          $sql = $this->dbh->prepare("SELECT id_nota_medica, id_cita_fk, id_paciente_fk, paciente, id_doctor_fk, doctor, ta, oxigenacion, temperatura, glucosa, fr, fc, peso, estatura, padecimiento, exploracion, tratamiento, diagnostico_principal, diagnostico_secundario, analisis_clinicos, estudios_gabinete, receta, user_cap, fecha_cap, DATE_FORMAT(fecha_cap, '%d-%m-%Y %H:%i:%s') AS fecha_cap_format FROM nota_medica WHERE estatus = 1 AND id_paciente_fk = ? AND id_doctor_fk = ?");
          $sql->execute([$id_paciente, $id_doctor]);
          $res = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        else if($perfil == 1) { // Administrador
          $sql = $this->dbh->prepare("SELECT id_nota_medica, id_cita_fk, id_paciente_fk, paciente, id_doctor_fk, doctor, ta, oxigenacion, temperatura, glucosa, fr, fc, peso, estatura, padecimiento, exploracion, tratamiento, diagnostico_principal, diagnostico_secundario, analisis_clinicos, estudios_gabinete, receta, user_cap, fecha_cap, DATE_FORMAT(fecha_cap, '%d-%m-%Y %H:%i:%s') AS fecha_cap_format FROM nota_medica WHERE estatus = 1 AND id_paciente_fk = ?");
          $sql->execute([$id_paciente]);
          $res = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        
      } catch (Exception $error) {
          error_log($error->getMessage());
      }
      
      return $res;
    }
  
    public function guardar_nota_medica(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar insertar';
      try {        		
        $sql = $this->dbh->prepare("INSERT INTO nota_medica (id_cita_fk, id_paciente_fk, paciente, id_doctor_fk, doctor, ta, oxigenacion, temperatura, glucosa, fr, fc, peso, estatura, padecimiento, exploracion, tratamiento, diagnostico_principal, diagnostico_secundario, analisis_clinicos, estudios_gabinete, receta, user_cap) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $ok  = $sql->execute(array(
          $post["idCita"], 
          $post["idPaciente"],
          $post["nomPaciente"], 
          $post["idDoctor"], 
          $post["nomDoctor"], 
          $post["ta"],
          $post["oxigenacion"],
          $post["temperatura"],
          $post["glucosa"],
          $post["fr"],
          $post["fc"],
          $post["peso"],
          $post["estatura"],
          $post["padecimiento"],
          $post["exploracion"],
          $post["tratamiento"],
          $post["diagnosticoPrincipal"],
          $post["diagnosticoSecundario"],
          $post["analisisClinicos"],
          $post["estudiosGabinete"],
          $post["receta"],
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

    public function actualizar_nota(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [];
      $mensaje = 'Error al intentar actualizar';
      try {
        $sql = $this->dbh->prepare("UPDATE nota_medica SET id_cita_fk = ?, id_paciente_fk = ?, paciente = ?, id_doctor_fk = ?, doctor = ?, ta = ?, oxigenacion = ?, temperatura = ?, glucosa = ?, fr = ?, fc = ?, peso = ?, estatura = ?, padecimiento = ?, exploracion = ?, tratamiento = ?, diagnostico_principal = ?, diagnostico_secundario = ?, analisis_clinicos = ?, estudios_gabinete = ?, receta = ?, user_cap = ? WHERE id_nota_medica = ?");
        $ok  = $sql->execute(array(
          $post["idCita"], 
          $post["idPaciente"],
          $post["nomPaciente"], 
          $post["idDoctor"], 
          $post["nomDoctor"], 
          $post["ta"],
          $post["oxigenacion"],
          $post["temperatura"],
          $post["glucosa"],
          $post["fr"],
          $post["fc"],
          $post["peso"],
          $post["estatura"],
          $post["padecimiento"],
          $post["exploracion"],
          $post["tratamiento"],
          $post["diagnosticoPrincipal"],
          $post["diagnosticoSecundario"],
          $post["analisisClinicos"],
          $post["estudiosGabinete"],
          $post["receta"],
          $user_cap,
          $post["idNota"])
        );

        if($ok) {
          $estatus = 200;
          $data    = [$post["idNota"]];
          $sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
        }
      } 
      catch (Exception $error) {
        error_log($error->getMessage());
      }
      
        $res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
      return $res;
    }

    public function eliminar_nota(int $id_nota) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar eliminar la nota';
      try {
        $sql = $this->dbh->prepare("UPDATE nota_medica SET estatus = ? WHERE id_nota_medica = ?");
        $sql->execute(array(0, $id_nota));
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