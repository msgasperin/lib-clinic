<?php
  //print_r($sql->errorInfo());
	header('Content-Type: application/json');
	require_once('../config/class.pdo.php');
	class Inventario extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}
		
		public function obtiene_productos_inventario(int $id_fabrica) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT P.id, sku, nom_producto, id_tipo_prod_fk, stock_minimo, stock, nom_presentacion
				FROM cat_productos AS P 
				INNER JOIN cat_presentaciones AS PR ON P.id_presentacion_fk = PR.id
				INNER JOIN existencias AS E ON E.id_producto_fk = P.id WHERE id_fabrica_fk = ?");
				$sql->execute(array($id_fabrica));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
						
			return $res;
		}

		public function registrar_entrada_inventario(array $post, array $carrito, string $user_cap, int $id_fabrica) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema procesar la entrada a inventario';
			try {	
				
				$this->dbh->beginTransaction();
				
				$sqlEntrada = $this->dbh->prepare("INSERT INTO inventario_entradas (id_fabrica_fk, origen_entrada, id_producido_por, producido_por, observaciones, user_cap) VALUES (?,?,?,?,?,?)");
				if (!$sqlEntrada->execute([$id_fabrica, $post["origenInventario"], $post["idProducidoPor"], $post["nomProducidoPor"], $post["observacionEntrada"], $user_cap])) {
					throw new Exception("Error al insertar la cabecera de entrada a inventario");
				}

				$id_entrada = $this->dbh->lastInsertId();

				$sqlDetalle = $this->dbh->prepare("INSERT INTO inventario_entradas_detalle (id_fabrica_fk, id_entrada_fk, id_producto_fk, sku_hist, nom_producto_hist, cantidad, costo_unitario) VALUES (?,?,?,?,?,?,?)");

				foreach ($carrito as $item) {
					if (!$sqlDetalle->execute([ $id_fabrica, $id_entrada, $item["id_producto"], $item["sku"], $item["nom_producto"], $item["cantidad"], $item["costo"] ])) {
						throw new Exception("Error al insertar el producto: " . $item["nom_producto"]);
					}
				}

				// 5. Si todo salió bien, confirmamos los cambios
				$this->dbh->commit();

				$estatus = 200;
				$data    = [$id_entrada];
				$mensaje = 'Entrada a inventario registrada con éxito';
			} 
			catch (Exception $error) {
				if ($this->dbh->inTransaction()) {
					$this->dbh->rollBack();
				}
				error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function registrar_salida_inventario(array $post, int $id_fabrica) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema procesar la salida a inventario';
			try {	
				$sql = $this->dbh->prepare("INSERT INTO inventario_movimientos (id_producto_fk, nom_producto_hist, id_fabrica_fk, tipo_movimiento, cantidad, id_referencia, descripcion) VALUES (?,?,?,?,?,?,?)");
				
				$paramsSalida = [$post["idProducto"], $post["nomProducto"], $id_fabrica, 'SALIDA', $post["cantidadSalidaInv"], 0, $post["motivoSalidaInv"] ];

				if ($sql->execute($paramsSalida)) {
					$id = $this->dbh->lastInsertId();
					if((int)$id > 0) {
						$estatus = 200;
						$data    = [$id];
						$mensaje = 'Salida a inventario registrada con éxito';
					}
					else {
						$estatus = 202;
						$data    = [$id];
						$mensaje = 'Se registró pero hubo problemas para obtener el id, habla con el administrador';
					}
				}
			} 
			catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function obtiene_movimientos_producto(int $id_fabrica, int $id_producto, string $fecha_ini, string $fecha_fin) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT tipo_movimiento, cantidad, descripcion, fecha, DATE_FORMAT(fecha, '%d-%m-%Y %H:%i:%s') AS fecha_format, stock_anterior, stock_actual FROM inventario_movimientos WHERE id_fabrica_fk = ? AND id_producto_fk = ? AND (fecha >= ? AND fecha <= ?)");
				$sql->execute(array($id_fabrica, $id_producto, $fecha_ini, $fecha_fin));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
			return $res;
		}

	}
?>