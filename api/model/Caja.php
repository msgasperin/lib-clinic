<?php
  //print_r($sql->errorInfo());
	header('Content-Type: application/json');
	require_once('../config/class.pdo.php');
	class Caja extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}
		
		public function obtiene_movimientos_caja(int $id_fabrica, string $fec_ini, string $fec_fin) {
			$res = [];
			try {
				$sql = $this->dbh->prepare("SELECT id, tipo_movimiento, concepto, monto, DATE_FORMAT(fecha,'%d-%m-%Y') AS fecha_format, fecha, observacion, user_cap, estatus FROM caja_movimientos WHERE (fecha >= ? AND fecha <= ?) AND estatus != ? AND id_fabrica_fk = ?");
				$sql->execute(array($fec_ini, $fec_fin, 3, $id_fabrica));
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
						
			return $res;
		}

		public function registrar_movimiento_caja(array $post, int $id_fabrica, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema registrar el movimiento de caja';
			try {	
				$sql = $this->dbh->prepare("INSERT INTO caja_movimientos (id_fabrica_fk, tipo_movimiento, concepto, monto, fecha, observacion, user_cap) VALUES (?,?,?,?,?,?,?)");
				
				$paramsCaja = [$id_fabrica, $post["tipo"], $post["concepto"], $post["monto"], $post["fecha"], $post["observacion"], $user_cap ];

				if ($sql->execute($paramsCaja)) {
					$id = $this->dbh->lastInsertId();
					if((int)$id > 0) {
						$estatus = 200;
						$data    = [$id];
						$mensaje = 'Movimiento caja registrado con éxito';
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

      public function actualizar_movimiento_caja(array $post, string $user_cap) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema para actualizar el movimiento de caja';
			try {	
				$sql = $this->dbh->prepare("UPDATE caja_movimientos SET tipo_movimiento= ?, concepto = ?, monto = ?, fecha = ?, observacion = ?, user_cap = ?, fecha_cap = ? WHERE id = ?");
				
				$paramsCaja = [$post["tipo"], $post["concepto"], $post["monto"], $post["fecha"], $post["observacion"], $user_cap, date('Y-m-d H:i:s'), $post["idMovimiento"]];
            $sql->execute($paramsCaja);

				if ($sql->rowCount() > 0) {
               $estatus = 200;
               $mensaje = 'Movimiento de caja actualizado con éxito';
            }
			} 
			catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

      public function validar_movimiento_caja(int $id) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema para validar el movimiento de caja';
			try {	
				$sql = $this->dbh->prepare("UPDATE caja_movimientos SET estatus = ? WHERE id = ? AND estatus = ?");
            $sql->execute([2, $id, 1]);

				if ($sql->rowCount() > 0) {
               $estatus = 200;
               $mensaje = 'Movimiento de caja actualizado con éxito';
            }
			} 
			catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

      public function eliminar_movimiento_caja(int $id) {
      	$estatus = 500;
      	$data    = [0];
			$mensaje = 'Hubo un problema para eliminar el movimiento de caja';
			try {	
				$sql = $this->dbh->prepare("UPDATE caja_movimientos SET estatus = ? WHERE id = ? AND estatus = ?");
            $sql->execute([3, $id, 1]);

				if ($sql->rowCount() > 0) {
               $estatus = 200;
               $mensaje = 'Movimiento de caja eliminado con éxito';
            }
			} 
			catch (Exception $error) {
				error_log($error->getMessage());
			}
			
			$res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
			return $res;
		}

		public function obtiene_corte_caja_dia(int $id_fabrica, string $fecha, string $fecha_ini, string $fecha_fin) {
			$res = [
				'ingresos' => [],
				'movimientos' => [],
				'totales' => [
					'ventas_efectivo' => 0,
					'ventas_digital'  => 0,
					'entradas_manuales' => 0,
					'salidas_manuales'  => 0,
					'balance_final'     => 0
				]
			];

			try {
				// 1. Obtener Abonos (Ventas) por método de pago
				// Usamos la tabla pedido_abonos que es la fuente real de dinero
				$sqlAbonos = $this->dbh->prepare("SELECT metodo_pago, SUM(monto_abono) AS total FROM pedido_abono WHERE id_fabrica_fk = ? AND fecha_abono >= ? AND fecha_abono <= ? GROUP BY metodo_pago");
				$sqlAbonos->execute([$id_fabrica, $fecha_ini, $fecha_fin]);

				$res['ingresos'] = $sqlAbonos->fetchAll(PDO::FETCH_ASSOC);

				// 2. Obtener Movimientos Manuales (Entradas/Salidas)
				// Filtramos por estatus != 3 (No cancelados)
				$sqlMovs = $this->dbh->prepare("SELECT tipo_movimiento, monto AS total FROM caja_movimientos WHERE id_fabrica_fk = ? AND fecha = ? AND estatus != 3");
				$sqlMovs->execute([$id_fabrica, $fecha]);
				$res['movimientos'] = $sqlMovs->fetchAll(PDO::FETCH_ASSOC);

				// 3. Procesamiento de Totales
				foreach ($res['ingresos'] as $abono) {
					if ($abono['metodo_pago'] == 1) {
						$res['totales']['ventas_efectivo'] += $abono['total'];
					} else {
						// Transferencia, Tarjeta, etc.
						$res['totales']['ventas_digital'] += $abono['total'];
					}
				}

				foreach ($res['movimientos'] as $mov) {
					if ($mov['tipo_movimiento'] == 1) {
						$res['totales']['entradas_manuales'] += $mov['total'];
					} else {
						$res['totales']['salidas_manuales'] += $mov['total'];
					}
				}

				// CÁLCULO DEL EFECTIVO EN CAJA:
				// (Efectivo de Ventas + Entradas Manuales) - Salidas Manuales
				$res['totales']['balance_final'] = ($res['totales']['ventas_efectivo'] + $res['totales']['entradas_manuales']) - $res['totales']['salidas_manuales'];

			} catch (Exception $error) {
				error_log("Error en corte de caja: " . $error->getMessage());
			}

			return $res;
		}
	}
?>