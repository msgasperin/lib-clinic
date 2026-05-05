<?php
  //print_r($sql->errorInfo());
	header('Content-Type: application/json');
	require_once('../config/class.pdo.php');
	class Reportes extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  	}
		
      public function obtiene_operativos() {
			$res = [];
			try {				
				$sql = $this->dbh->prepare("SELECT id, nombre, usuario, celular, correo, foto, perfil FROM cat_usuarios WHERE estatus = 1 AND perfil = 2");
				$sql->execute();				
				$res = $sql->fetchAll(PDO::FETCH_ASSOC);
			} catch (Exception $error) {
        		error_log($error->getMessage());
			}
			
			return $res;
		}

		public function obtiene_reporte_utilidades(int $id_fabrica, string $fecha_ini, string $fecha_fin) {
         // Estructura de respuesta consistente
         $res = [
            'totales' => [
                  'ingresos' => 0, 
                  'inversion' => 0, 
                  'utilidad' => 0, 
                  'devoluciones' => 0
            ],
            'detalles' => [],
            'error' => false
         ];

         try {
            // 1. Query para Totales (Resumen Ejecutivo)
            // Usamos COALESCE para asegurar que siempre regrese 0 y no NULL
            $sqlSum = $this->dbh->prepare("SELECT 
               COALESCE(SUM(total + IFNULL(cargo_extra, 0)), 0) AS ingresos,
               COALESCE(SUM(costo_total), 0) AS inversion,
               COALESCE(SUM(utilidad_total + IFNULL(cargo_extra, 0) - IFNULL(monto_devoluciones, 0)), 0) AS utilidad,
               COALESCE(SUM(IFNULL(monto_devoluciones, 0)), 0) AS devoluciones
               FROM pedido 
               WHERE id_fabrica_fk = ?  AND estatus != 'Cancelado' AND fecha_cap >= ? AND fecha_cap <= ?"
            );            
            $sqlSum->execute([$id_fabrica, $fecha_ini, $fecha_fin]);
            $dataSum = $sqlSum->fetch(PDO::FETCH_ASSOC);
            
            if($dataSum) {
               $res['totales'] = $dataSum;
            }

            // 2. Query para Detalles (Listado de la tabla)
            $sqlDet = $this->dbh->prepare("SELECT id_pedido, folio, nom_cliente_hist AS cliente, DATE_FORMAT(fecha_cap, '%d-%m-%Y %H:%i') AS fecha_format, (total + IFNULL(cargo_extra, 0)) AS venta_bruta, costo_total, (utilidad_total + IFNULL(cargo_extra, 0) - IFNULL(monto_devoluciones, 0)) AS utilidad_neta, IFNULL(monto_devoluciones, 0) AS devoluciones
               FROM pedido  
               WHERE id_fabrica_fk = ? AND estatus != 'Cancelado' AND fecha_cap >= ? AND fecha_cap <= ? 
               ORDER BY fecha_cap DESC"
            );
                  
            $sqlDet->execute([$id_fabrica, $fecha_ini, $fecha_fin]);
            $res['detalles'] = $sqlDet->fetchAll(PDO::FETCH_ASSOC);

         } catch (Exception $error) {
            error_log("Error en (Reporte Utilidades): " . $error->getMessage());
            $res['error'] = true;
         } 
         
         return $res;
      }

      public function obtiene_reporte_mas_vendidos(int $id_fabrica, string $fecha_ini, string $fecha_fin) {
         $res = [
            'totales' => [
               'top_producto' => 'N/A',
               'top_sabor'    => 'N/A',
               'top_tipo'     => 'N/A',
               'total_piezas' => 0
            ],
            'detalles' => [],
            'error' => false
         ];

         try {
            
            $sql = $this->dbh->prepare("SELECT D.id_producto_fk, D.nom_producto_hist AS producto, T.tipo_producto AS tipo, S.nom_sabor AS sabor, SUM(D.cantidad) AS total_piezas, SUM(D.total_linea) AS monto_generado, COUNT(D.id_pedido_fk) AS apariciones_en_pedidos
               FROM pedido_detalle AS D
               LEFT JOIN cat_productos AS CP ON D.id_producto_fk = CP.id
               LEFT JOIN cat_tipo_productos AS T ON CP.id_tipo_prod_fk = T.id
               LEFT JOIN cat_sabores AS S ON CP.id_sabor_fk = S.id
               WHERE D.id_fabrica_fk = ? 
               AND D.estatus != 'cancelado'
               AND D.fecha_cap >= ? AND D.fecha_cap <= ?
               GROUP BY D.id_producto_fk
               ORDER BY total_piezas DESC"
            );

            $sql->execute([$id_fabrica, $fecha_ini, $fecha_fin]);
            $detalles = $sql->fetchAll(PDO::FETCH_ASSOC);

            if (count($detalles) > 0) {
               $res['detalles'] = $detalles;
               $res['totales']['top_producto'] = $detalles[0]['producto'];
               $res['totales']['total_piezas'] = array_sum(array_column($detalles, 'total_piezas'));
               $res['totales']['top_sabor']    = $detalles[0]['sabor'] ?? 'N/A';
               $res['totales']['top_tipo']     = $detalles[0]['tipo'] ?? 'N/A';
            }

         } catch (Exception $error) {
            error_log("Error en elao (Mas Vendidos Optimizado): " . $error->getMessage());
            $res['error'] = true;
         }

         return $res;
      }

      public function obtiene_reporte_stock_critico(int $id_fabrica) {
         $res = [
            'resumen' => [
               'total_criticos' => 0, // Stock <= 0
               'total_en_minimo' => 0 // Stock <= stock_minimo
            ],
            'detalles' => [],
            'error' => false
         ];

         try {
            // Usamos un CASE en SQL para calcular el nivel de alerta dinámicamente
            $sql = $this->dbh->prepare("SELECT P.id, P.sku, P.nom_producto, E.stock, E.stock_minimo, (E.stock_minimo - E.stock) AS faltante,
               CASE 
                  WHEN E.stock <= 0 THEN 'CRÍTICO'
                  WHEN E.stock <= E.stock_minimo THEN 'MÍNIMO'
                  ELSE 'OK'
               END AS nivel_alerta
               FROM existencias AS E
               JOIN cat_productos AS P ON P.id = E.id_producto_fk
               WHERE E.id_fabrica_fk = ? AND E.bajo_minimo = 1 AND P.activo = 1
               ORDER BY E.stock ASC, nivel_alerta DESC;"
            );

            $sql->execute([$id_fabrica]);
            $detalles = $sql->fetchAll(PDO::FETCH_ASSOC);

            if (count($detalles) > 0) {
               $res['detalles'] = $detalles;               
               // Contabilizamos para el resumen
               foreach ($detalles as $row) {
                  if ($row['nivel_alerta'] === 'CRÍTICO') $res['resumen']['total_criticos']++;
                  if ($row['nivel_alerta'] === 'MÍNIMO') $res['resumen']['total_en_minimo']++;
               }
            }

         } catch (Exception $error) {
            error_log("Error en elao (Stock Crítico): " . $error->getMessage());
            $res['error'] = true;
         } 

         return $res;
      }

      public function obtiene_reporte_mejores_clientes(int $id_fabrica, string $fecha_ini, string $fecha_fin) {
         $res = [
            'totales' => [
               'cliente_oro' => 'N/A',      // Mayor monto de ventas
               'cliente_fiel' => 'N/A',     // Mayor cantidad de pedidos
               'cliente_rentable' => 'N/A'  // Mayor utilidad generada
            ],
            'detalles' => [],
            'error' => false
         ];

         try {
            // Usamos BETWEEN para aprovechar mejor el índice en rangos de fecha
            $sql = $this->dbh->prepare("SELECT P.id_cliente_fk, P.nom_cliente_hist AS cliente, COUNT(P.id_pedido) AS total_pedidos, SUM(P.total) AS monto_total_compras, SUM(P.utilidad_total) AS utilidad_generada 
               FROM pedido AS P 
               WHERE P.id_fabrica_fk = ? AND P.estatus IN ('Surtido', 'Pagado') AND P.fecha_cap BETWEEN ? AND ?
               GROUP BY P.id_cliente_fk
               ORDER BY monto_total_compras DESC
            ");

            $sql->execute([$id_fabrica, $fecha_ini, $fecha_fin]);
            $detalles = $sql->fetchAll(PDO::FETCH_ASSOC);            

            if (count($detalles) > 0) {
                  $res['detalles'] = $detalles;
                  // 1. Cliente Oro: Ya es el primero por el ORDER BY del SQL
                  $res['totales']['cliente_oro'] = $detalles[0]['cliente'];                  
                  // Inicializamos punteros para los otros dos KPIs
                  $topFiel     = $detalles[0];
                  $topRentable = $detalles[0];

                  foreach ($detalles as $d) {
                     // 2. Cliente Fiel (Buscamos el máximo de pedidos)
                     if ((int)$d['total_pedidos'] > (int)$topFiel['total_pedidos']) {
                        $topFiel = $d;
                     }
                     // 3. Cliente Rentable (Buscamos la máxima utilidad)
                     if ($d['utilidad_generada'] > $topRentable['utilidad_generada']) {
                        $topRentable = $d;
                     }
                  }

                  $res['totales']['cliente_fiel']     = $topFiel['cliente'];
                  $res['totales']['cliente_rentable'] = $topRentable['cliente'];
            }

         } catch (Exception $e) {
            error_log("Error en elao (Mejores Clientes): " . $e->getMessage());
            $res['error'] = true;
         } 

         return $res;
      }

      public function obtiene_reporte_produccion(int $id_usuario, string $fecha_ini, string $fecha_fin) {
         try {
            // Usamos BETWEEN para aprovechar mejor el índice en rangos de fecha
            $sql = $this->dbh->prepare("SELECT SUM(cantidad) AS total, nom_producto_hist, id_producto_fk, sku_hist
               FROM inventario_entradas AS I 
               INNER JOIN inventario_entradas_detalle AS D ON D.id_entrada_fk = I.id_entrada
               WHERE fecha_cap >= ? AND fecha_cap <= ? AND origen_entrada = ? AND id_producido_por = ?
               GROUP BY id_producto_fk
               ORDER BY total DESC");

            $sql->execute([$fecha_ini, $fecha_fin, 1, $id_usuario]);
            $res = $sql->fetchAll(PDO::FETCH_ASSOC);
         } catch (Exception $e) {
            error_log("Error en elao (Mejores Clientes): " . $e->getMessage());
            $res = [];
         } 

         return $res;
      }
	}
?>