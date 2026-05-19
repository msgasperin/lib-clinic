<?php
	require_once('../config/class.pdo.php');
	class NotaMedica extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  }

    public function generarCadena($longitud = 10) {
			$caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			$max = strlen($caracteres) - 1;
			$cadena = '';

			for ($i = 0; $i < $longitud; $i++) {
				$cadena .= $caracteres[random_int(0, $max)];
			}

			return $cadena;
		}

    public function obtiene_notas_medicas(int $id_paciente) {
      try {
        $res = [];
        $sql = $this->dbh->prepare("SELECT id_nota_medica, id_cita_fk, id_paciente_fk, paciente, id_doctor_fk, doctor, ta, oxigenacion, temperatura, glucosa, fr, fc, peso, estatura, padecimiento, exploracion, tratamiento, diagnostico_principal, diagnostico_secundario, analisis_clinicos, estudios_gabinete, esfuerzo, mapa, holter, receta, user_cap, fecha_cap, DATE_FORMAT(fecha_cap, '%Y-%m-%d') AS fecha_cap_fil, DATE_FORMAT(fecha_cap, '%d-%m-%Y') AS fecha_cap_format FROM nota_medica WHERE estatus = 1 AND id_paciente_fk = ? ORDER BY fecha_cap DESC");
        $sql->execute([$id_paciente]);
        $res = $sql->fetchAll(PDO::FETCH_ASSOC);        
        
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
        $sql = $this->dbh->prepare("INSERT INTO nota_medica (id_cita_fk, id_paciente_fk, paciente, id_doctor_fk, doctor, ta, oxigenacion, temperatura, glucosa, fr, fc, peso, estatura, padecimiento, exploracion, tratamiento, diagnostico_principal, diagnostico_secundario, analisis_clinicos, estudios_gabinete, esfuerzo, mapa, holter, receta, user_cap) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
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
          $post["esfuerzo"],
          $post["mapa"],
          $post["holter"],
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
        $sql = $this->dbh->prepare("UPDATE nota_medica SET id_cita_fk = ?, id_paciente_fk = ?, paciente = ?, id_doctor_fk = ?, doctor = ?, ta = ?, oxigenacion = ?, temperatura = ?, glucosa = ?, fr = ?, fc = ?, peso = ?, estatura = ?, padecimiento = ?, exploracion = ?, tratamiento = ?, diagnostico_principal = ?, diagnostico_secundario = ?, analisis_clinicos = ?, estudios_gabinete = ?, esfuerzo = ?, mapa = ?, holter = ?, receta = ?, user_cap = ? WHERE id_nota_medica = ?");
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
          $post["esfuerzo"],
          $post["mapa"],
          $post["holter"],
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

    public function inserta_documento_nota(string $nom_documento, string $archivo, int $id_nota, int $id_doctor, int $id_cita, int $origen) {
      $estatus = 500;
      $mensaje = 'Error al intentar insertar documento en BD';
      $data    = [];
			try {        		
        $key_query = date('ydmhis').$id_nota.$id_cita.$this->generarCadena(20);
				$sql = $this->dbh->prepare("INSERT INTO nota_adjuntos (id_cita_fk, id_nota_fk, id_doctor_fk, nom_archivo, archivo, origen, key_query) VALUES (?,?,?,?,?,?,?)");
				$ok = $sql->execute([$id_cita, $id_nota, $id_doctor, $nom_documento, $archivo, $origen, $key_query]);
        if($ok) {
          $estatus = 200;
          $mensaje = 'ok';
        }
			} catch (Exception $error) {
        error_log($error->getMessage());
			}
			finally {
        $this->cerrar();
      }

      $res = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];

			return $res;
		}

    public function obtiene_adjuntos_nota(int $id_nota, int $id_origen) {
      try {
        $res = [];
        $sql = $this->dbh->prepare("SELECT id, id_cita_fk, id_nota_fk, nom_archivo, archivo, key_query, origen FROM nota_adjuntos WHERE id_nota_fk = ? AND origen = ?");
        $sql->execute([$id_nota, $id_origen]);
        $res = $sql->fetchAll(PDO::FETCH_ASSOC);        
        
      } catch (Exception $error) {
        error_log($error->getMessage());
      }
      
      return $res;
    }

    public function eliminar_adjunto_nota(int $id) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar eliminar el archivo adjunto';
      try {
        $sql = $this->dbh->prepare("DELETE FROM nota_adjuntos WHERE id = ?");
        $sql->execute(array($id));
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