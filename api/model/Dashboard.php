<?php
  //print_r($sql->errorInfo());
	header('Content-Type: application/json');
	require_once('../config/class.pdo.php');
	class Dashboard extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}
		
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ FUNCIONES Alertas ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public function alerta_pedidos_pago() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT folio, nom_cliente_hist, nom_categoria_cliente_hist, cargo_extra, total, DATE_FORMAT(fecha_entrega,'%d-%m-%Y') AS fecha_entrega_format, 
               fecha_limite_pago, DATE_FORMAT(fecha_limite_pago,'%d-%m-%Y') AS fecha_limite_pago_format, fecha_cap, DATE_FORMAT(fecha_cap,'%d-%m-%Y %H:%i:%s') AS fecha_cap_format, DATE_FORMAT(fecha_surtido,'%d-%m-%Y %H:%i:%s') AS fecha_surtido_format, DATE_FORMAT(fecha_pagado,'%d-%m-%Y %H:%i:%s') AS fecha_pagado_format, estatus, tipo_pedido, debiente, CASE
               WHEN fecha_limite_pago = CURDATE() THEN 'Hoy' 
               WHEN fecha_limite_pago = CURDATE() + INTERVAL 1 DAY THEN 'Mañana' 
               WHEN fecha_limite_pago < CURDATE() THEN 'Vencido' 
               END AS estatus_alerta
               FROM pedido 
               WHERE fecha_limite_pago <= CURDATE() + INTERVAL 1 DAY AND estatus <> 'Pagado'
               ORDER BY fecha_limite_pago ASC;"
            );
				$sql->execute();
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
				error_log($error->getMessage());
			}
			return $res;
		}
	}
?>