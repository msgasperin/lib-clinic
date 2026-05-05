<?php
  //print_r($sql->errorInfo());
	header('Content-Type: application/json');
	require_once('../config/class.pdo.php');
	class Productos extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}

		// ********************************************************** Funciones de CRUD de productos **********************************************************************

		public function obtiene_productos() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT P.id, sku, nom_producto, id_tipo_prod_fk, tipo_producto, id_sabor_fk, nom_sabor, id_presentacion_fk, nom_presentacion, 	
					id_unidad_medida_fk, nom_unidad_medida, costo, precio_base, observaciones, stock, stock_minimo 
					FROM cat_productos P
					INNER JOIN cat_tipo_productos T ON P.id_tipo_prod_fk = T.id
					INNER JOIN cat_sabores S ON P.id_sabor_fk = S.id
					INNER JOIN cat_presentaciones PR ON P.id_presentacion_fk = PR.id
					INNER JOIN cat_unidades_medida U ON P.id_unidad_medida_fk = U.id
					LEFT JOIN existencias AS E ON E.id_producto_fk = P.id
					WHERE P.activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

    	public function guardar_producto(array $post, string $user_cap, int $id_fabrica) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error inesperado al guardar el producto';

			try {

				$this->dbh->beginTransaction();

				// 1. Insertar Producto
				$sql = $this->dbh->prepare("INSERT INTO cat_productos (nom_producto, id_tipo_prod_fk, id_sabor_fk, id_presentacion_fk, id_unidad_medida_fk, costo, precio_base, observaciones, user_cap) VALUES (?,?,?,?,?,?,?,?,?)");
				
				$sql->execute([$post["nomProducto"], $post["tipoProducto"], $post["saborProducto"], $post["presentacionProd"], $post["uMedidaProd"], $post["costoProducto"], $post["precioBase"], $post["observaciones"], $user_cap]);

				$id = $this->dbh->lastInsertId();

				// 2. Generar y actualizar SKU en un solo paso
				$abrev = strtoupper(substr($post["nomTipoProducto"], 0, 3));
				$sku   = $abrev . '-' . str_pad($id, 6, '0', STR_PAD_LEFT);
				
				$this->dbh->prepare("UPDATE cat_productos SET sku = ? WHERE id = ?")->execute([$sku, $id]);

				// 3. Gestionar Existencias // Esta sentencia inserta si no existe, o actualiza el stock_minimo si ya existe.
				$sqlStock = $this->dbh->prepare("INSERT INTO existencias (id_producto_fk, id_fabrica_fk, stock_minimo, stock) VALUES (?, ?, ?, 0) ON DUPLICATE KEY UPDATE stock_minimo = VALUES(stock_minimo)");
				$sqlStock->execute([$id, $id_fabrica, $post["stockMinimo"]]);

				// Si llegamos aquí sin errores, confirmamos los cambios
				$this->dbh->commit();

				$estatus = 200;
				$mensaje = 'ok';
				$data    = [$id];

			} catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log($error->getMessage());
			}
						
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function actualizar_producto(array $post, int $id_fabrica) {
			$estatus = 500;
			$data    = [0];
			$mensaje = 'Error al intentar actualizar';
			$id      = $post["idProducto"]; // ID del producto a editar

			try {
				$this->dbh->beginTransaction();

				// 1. Actualizar los datos maestros del producto
				$sql = $this->dbh->prepare("UPDATE cat_productos SET nom_producto = ?, id_tipo_prod_fk = ?, id_sabor_fk = ?, id_presentacion_fk = ?,  id_unidad_medida_fk = ?, costo = ?, precio_base = ?, observaciones = ? WHERE id = ?");

				$sql->execute([$post["nomProducto"], $post["tipoProducto"], $post["saborProducto"], $post["presentacionProd"], $post["uMedidaProd"], $post["costoProducto"], $post["precioBase"], $post["observaciones"], $id	]);

				// 2. Actualizar el stock mínimo en la tabla de existencias para ESTA fábrica
				// Usamos ON DUPLICATE por si acaso la fila de existencia no se creó en el registro inicial
				$sqlStock = $this->dbh->prepare("INSERT INTO existencias (id_producto_fk, id_fabrica_fk, stock_minimo, stock) VALUES (?, ?, ?, 0) ON DUPLICATE KEY UPDATE stock_minimo = VALUES(stock_minimo) ");
				$sqlStock->execute([$id, $id_fabrica, $post["stockMinimo"]]);

				$this->dbh->commit();

				$estatus = 200;
				$mensaje = 'ok';
				$data    = [$id];

			} catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log($error->getMessage());
			}
			
			return ['estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data];
		}

		public function eliminar_producto(int $id_producto) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_productos SET activo = ? WHERE id = ?");
				if($sql->execute(array(0, $id_producto))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}
	
      // ********************************************************** Funciones de CRUD de sabores **********************************************************************

		public function obtiene_sabores() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nom_sabor FROM cat_sabores WHERE activo = 1 ORDER BY nom_sabor");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function guardar_sabor(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al intentar guardar el sabor';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_sabores (nom_sabor, user_cap) VALUES (?,?)");
				if($sql->execute(array($post["nomSabor"], $user_cap))) {
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function eliminar_sabor(int $id_sabor) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_sabores SET activo = ? WHERE id = ?");
				if($sql->execute(array(0, $id_sabor))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

      // ********************************************************** Funciones de CRUD de unidades de medida **********************************************************************
      
		public function obtiene_unidades_medida() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nom_unidad_medida, abreviatura FROM cat_unidades_medida WHERE activo = 1 ORDER BY nom_unidad_medida");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function guardar_unidad_medida(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al guardar unidad de medidas';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_unidades_medida (nom_unidad_medida, abreviatura, user_cap) VALUES (?,?,?)");
				if($sql->execute(array($post["nomUniMedida"], $post["abrevUniMedida"], $user_cap))) {
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
					
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function eliminar_unidad_medida(int $id_unidad_medida) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_unidades_medida SET activo = ? WHERE id = ?");
				if($sql->execute(array(0, $id_unidad_medida))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		// ********************************************************** Funciones de CRUD de presentaciones **********************************************************************
      
		public function obtiene_presentaciones() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, nom_presentacion FROM cat_presentaciones WHERE activo = 1 ORDER BY nom_presentacion");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function guardar_presentacion(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Error al guardar presentación';
			try {
				$sql = $this->dbh->prepare("INSERT INTO cat_presentaciones (nom_presentacion, user_cap) VALUES (?,?)");
				if($sql->execute(array($post["nomPresentacion"], $user_cap))) {
					$estatus = 200;
					$data    = [$this->dbh->lastInsertId()];
					$mensaje = 'ok';
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function eliminar_presentacion(int $id_presentacion) {
      	$res = false;
			try {
				$sql = $this->dbh->prepare("UPDATE cat_presentaciones SET activo = ? WHERE id = ?");
				if($sql->execute(array(0, $id_presentacion))) {
          		$res = true;
        		}
			} 
			catch (Exception $error) {
        		error_log($error->getMessage());
			}
						
			return $res;
		}

		// ********************************************************** Funciones de CRUD de tipos_producto **********************************************************************
      
		public function obtiene_tipos_producto() {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, tipo_producto FROM cat_tipo_productos WHERE activo = 1");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}
	}
?>