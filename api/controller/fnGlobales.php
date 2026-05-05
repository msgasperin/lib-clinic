<?php
  require_once('../model/Globales.php');
  $g = new Globales();

  if(isset($_POST['func'])) {
    switch ($_POST['func']) {
    
      default:
        echo json_encode(['estatus'=>'valor_inválido']);
      break;
    }
  }
  else
    echo json_encode(['estatus'=>'no_declarado']);

?>