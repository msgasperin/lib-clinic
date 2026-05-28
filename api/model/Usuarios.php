<?php
	require_once('../config/class.pdo.php');
	class Usuarios extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
			$this->conectar();
		}
		
		public function obtiene_doctores() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, nombre, usuario, celular, correo, cedula, registro_especial, foto, perfil FROM cat_usuarios WHERE estatus = 1 AND perfil = 3");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        	error_log($error->getMessage());
			}
			
			return $res;
		}

		public function obtiene_usuarios() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, nombre, usuario, celular, correo, cedula, registro_especial, foto, perfil FROM cat_usuarios WHERE estatus = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function usuario_existente(int $id_usuario, string $usuario) {
			$res = false;
			try {
				$sql = $this->dbh->prepare("SELECT id FROM cat_usuarios WHERE usuario = ? AND id <> ?");
				$sql->execute(array($usuario, $id_usuario));
				if($sql->rowCount() > 0) {
          		$res = true;
        		} 
			}
			catch (Exception $error) {
				error_log($error->getMessage());
			}
						
			return $res;
		}

		public function guardar_usuario(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [];
			$mensaje = 'Error al intentar guardar el usuario';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_usuarios (nombre, usuario, contrasenia, celular, correo, cedula, registro_especial, perfil, user_cap) VALUES (?,?,AES_ENCRYPT(?,?),?,?,?,?,?,?)");
				if($sql->execute(array($post["nomUsuario"], $post["usuario"], $post["contrasenia"], $this->key, $post["celUsuario"], $post["mailUsuario"], $post["cedula"], $post["registro_especial"], $post["perfilUsuario"], $user_cap))) {
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
				}
			} 
			catch (Exception $error) {
				error_log($error->getMessage());
			}
							
			$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function actualizar_usuario(array $post, string $user_cap) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar el usuario';
			try {

				if($post["contrasenia"] == '') {
					$sql = $this->dbh->prepare("UPDATE cat_usuarios SET nombre = ?, celular = ?, correo = ?, cedula = ?, registro_especial = ?, perfil = ?, user_cap = ?, fec_cap = ? WHERE id = ?");
					$sql->execute(array($post["nomUsuario"], $post["celUsuario"], $post["mailUsuario"],  $post["cedula"], $post["registro_especial"], $post["perfilUsuario"], $user_cap, date('Y-m-d H:i:s'), $post["idUsuario"]));
					if($sql->rowCount() > 0) {
						$estatus = 200;
						$data    = [$post["idUsuario"]];
						$mensaje = 'ok';
					}
					else {
						$estatus = 500;
						$data    = [$post["idUsuario"]];
						$mensaje = 'No se encontró una coincidencia para actualizar';
					}
				}
				else {
					$sql = $this->dbh->prepare("UPDATE cat_usuarios SET nombre = ?, contrasenia = AES_ENCRYPT(?,?), celular = ?, correo = ?, perfil = ?, user_cap = ?, fec_cap = ? WHERE id = ?");
					$sql->execute(array($post["nomUsuario"], $post["contrasenia"], $this->key, $post["celUsuario"], $post["mailUsuario"], $post["perfilUsuario"], $user_cap, date('Y-m-d H:i:s'), $post["idUsuario"]));

					if($sql->rowCount() > 0) {
						$estatus = 200;
						$data    = [$post["idUsuario"]];
						$mensaje = 'ok';
					}
					else {
						$estatus = 500;
						$data    = [$post["idUsuario"]];
						$mensaje = 'No se encontró una coincidencia para actualizar';
					}
				}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
      	$res = array('estatus' => $estatus, 'data' => $data, 'mensaje' => $mensaje);
			return $res;
		}

		public function eliminar_usuario(int $id_usuario) {
      	$estatus = 500;
			$mensaje = 'Error al intentar eliminar el usuario';
			$data    = [];
			try {
				$sql = $this->dbh->prepare("UPDATE cat_usuarios SET estatus = ? WHERE id = ?");
				$sql->execute(array(0, $id_usuario));
				if($sql->rowCount() >= 1) {
          		$estatus = 200;
					$mensaje = 'ok';
        		}
				else {
					$mensaje = 'No se encontró un usuario con ese identificador';
				}
			}
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			$res = ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
			return $res;
		}

		public function consulta_log(string $fecha_ini, string $fecha_fin, int $id_usuario) {
			$res = [];
			try {				
				if($id_usuario == 0) {
					$sql = $this->dbh->prepare("SELECT usuario, fecha, DATE_FORMAT(fecha,'%d-%m-%Y %H:%i:%s') AS fecha_format, accion, id_tracking FROM bitacora WHERE fecha >= ? AND fecha <= ?");
					$sql->execute([$fecha_ini, $fecha_fin]);
				}
				else {
					$sql = $this->dbh->prepare("SELECT usuario, fecha, DATE_FORMAT(fecha,'%d-%m-%Y %H:%i:%s') AS fecha_format, accion, id_tracking FROM bitacora WHERE id_usuario = ? AND (fecha >= ? AND fecha <= ?)");
					$sql->execute([$id_usuario, $fecha_ini, $fecha_fin]);
				}
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}
	}
?>