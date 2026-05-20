<?php  
	require_once('../config/class.pdo.php');
	class AntecedenteGinecologico extends Conexion {
		//Objeto principal del constructor de la clase
		public function __construct() {
	   	$this->conectar();
	  }
  
    public function obtiene_antecedentes_ginecologicos(int $id_paciente) {
      try {
        $res = [];
        
        $sql = $this->dbh->prepare("SELECT id, id_paciente_fk, paciente_hist, menarca, mens_frecuencia, mens_duracion, mens_cantidad, dismenorrea, inicio_sexual, no_embarazos, no_partos, no_abortos, no_cesareas, metodo_anticonceptivo, ultima_mens, ets, menopausia, climaterio, ultimo_papanicolaou, resultado_papanicolaou FROM ant_ginecologicos WHERE id_paciente_fk = ?");
        $sql->execute([$id_paciente]);
        
        $res = $sql->fetchAll(PDO::FETCH_ASSOC);				
      } catch (Exception $error) {
          error_log($error->getMessage());
      }
      
      return $res;
    }

    public function valida_insert_update(int $id_paciente): bool {
      try {          
          $sql = $this->dbh->prepare("SELECT id FROM ant_ginecologicos WHERE id_paciente_fk = ? LIMIT 1");
          $sql->execute([$id_paciente]);        
          $respuesta = $sql->fetch(PDO::FETCH_ASSOC);
          
          return (bool)$respuesta;

      } catch (Exception $error) {
          error_log($error->getMessage());
          return false;
      }
    }

    public function inserta_antecedentes_ginecologicos(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar insertar';
      try {        		
        $sql = $this->dbh->prepare("INSERT INTO ant_ginecologicos (id_paciente_fk, paciente_hist,  menarca, mens_frecuencia, mens_duracion, mens_cantidad, dismenorrea, inicio_sexual, no_embarazos, no_partos, no_abortos, no_cesareas, metodo_anticonceptivo, ultima_mens, ets, menopausia, climaterio, ultimo_papanicolaou, resultado_papanicolaou, user_cap) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $ok  = $sql->execute(array(
          $post["idPaciente"], 
          $post["nomPaciente"],
          $post["menarca"], 
          $post["frecuenciaMenstruacion"], 
          $post["duracionMenstruacion"], 
          $post["cantidadMenstruacion"],
          $post["dismenorreaMenstruacion"],
          $post["inicioVidaSexual"],
          $post["noEmbarazos"],
          $post["noPartos"],
          $post["noAbortos"],
          $post["noCesareas"],
          $post["metodoAnticonceptivo"],
          $post["ultimaMenstruacion"],
          $post["ets"],
          $post["menopausia"],
          $post["climaterio"],
          $post["ultimoPapanicolaou"],
          $post["resultadoPapanicolaou"],
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
        print_r($error->getMessage());
      }
            
      $res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
      return $res;
    }

    public function actualizar_antecedentes_ginecologicos(array $post, string $user_cap) {
      $estatus = 500;
      $data    = [0];
      $mensaje = 'Error al intentar actualizar';
      try {        		
        $sql = $this->dbh->prepare("UPDATE ant_ginecologicos SET menarca = ?, mens_frecuencia = ?, mens_duracion = ?, mens_cantidad = ?, dismenorrea = ?, inicio_sexual = ?, no_embarazos = ?, no_partos = ?, no_abortos = ?, no_cesareas = ?, metodo_anticonceptivo = ?, ultima_mens = ?, ets = ?, menopausia = ?, climaterio = ?, ultimo_papanicolaou = ?, resultado_papanicolaou = ?, user_cap = ?, fecha_cap = ? WHERE id_paciente_fk = ?");
        $sql->execute(array(
          $post["menarca"], 
          $post["frecuenciaMenstruacion"], 
          $post["duracionMenstruacion"], 
          $post["cantidadMenstruacion"],
          $post["dismenorreaMenstruacion"],
          $post["inicioVidaSexual"],
          $post["noEmbarazos"],
          $post["noPartos"],
          $post["noAbortos"],
          $post["noCesareas"],
          $post["metodoAnticonceptivo"],
          $post["ultimaMenstruacion"],
          $post["ets"],
          $post["menopausia"],
          $post["climaterio"],
          $post["ultimoPapanicolaou"],
          $post["resultadoPapanicolaou"],
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
        print_r($error->getMessage());
      }
            
      $res = array('estatus' => $estatus, 'mensaje' => $mensaje, 'data' => $data);
      return $res;
    }
	}
?>