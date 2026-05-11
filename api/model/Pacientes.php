<?php
  //print_r($sql->errorInfo());
	header('Content-Type: application/json');
	require_once('../config/class.pdo.php');
	class Pacientes extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  }	

		public function obtiene_pacientes() {
			try {
				$res = [];
				$sql = $this->dbh->prepare("SELECT id_paciente, ap_paterno, ap_materno, nombre, fecha_nac, DATE_FORMAT(fecha_nac,'%d-%m-%Y') AS fecha_nac_format, sexo, estado_civil, escolaridad, ocupacion, telefono, correo, direccion, colonia, municipio, entidad_fed, religion, aseguradora, key_query FROM cat_pacientes WHERE activo = 1"
				);
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);				
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}
	
		public function guardar_paciente(array $post, string $user_cap, string $key_query) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar insertar';

			try {        		
				$sql = $this->dbh->prepare("INSERT INTO cat_pacientes (ap_paterno, ap_materno, nombre, fecha_nac, sexo, estado_civil, escolaridad, ocupacion, telefono, correo, direccion, colonia, municipio, entidad_fed, religion, aseguradora, key_query, user_cap) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
				$ok  = $sql->execute(array(
					$post["apPaciente"], 
					$post["amPaciente"], 
					$post["nomPaciente"], 
					$post["fechaNacimiento"], 
					$post["sexoPaciente"], 
					$post["estadoCivilPaciente"], 
					$post["escolaridadPaciente"], 
					$post["ocupacion"], 
					$post["telefono"], 
					$post["correoPaciente"],
					$post["direccionPaciente"],
					$post["coloniaPaciente"],
					$post["municipioPaciente"],
					$post["entidadPaciente"],
					$post["religionPaciente"],
					$post["aseguradoraPaciente"],
					$key_query,
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

		public function actualizar_paciente(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar actualizar';
			try {
				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET ap_paterno = ?, ap_materno = ?, nombre = ?, fecha_nac = ?, sexo = ?, estado_civil = ?, escolaridad = ?, ocupacion = ?, telefono = ?, correo = ?, direccion = ?, colonia = ?, municipio = ?, entidad_fed = ?, religion = ?, aseguradora = ?, user_cap = ? WHERE id_paciente = ?");
				$ok  = $sql->execute(array(
					$post["apPaciente"], 
					$post["amPaciente"], 
					$post["nomPaciente"], 
					$post["fechaNacimiento"], 
					$post["sexoPaciente"], 
					$post["estadoCivilPaciente"], 
					$post["escolaridadPaciente"], 
					$post["ocupacion"], 
					$post["telefono"], 
					$post["correoPaciente"],
					$post["direccionPaciente"],
					$post["coloniaPaciente"],
					$post["municipioPaciente"],
					$post["entidadPaciente"],
					$post["religionPaciente"],
					$post["aseguradoraPaciente"],
					$user_cap,
					$post["idPaciente"])
				);

				if($ok) {
					$estatus = 200;
					$data    = [$post["idPaciente"]];
					$sql->rowCount() > 0 ? $mensaje = 'ok' : $mensaje = 'No hubo cambios que actualizar';
				}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_paciente(int $id_paciente) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_pacientes SET activo = ? WHERE id_paciente = ?");
				if($sql->execute(array(0, $id_paciente))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}
	}
?>