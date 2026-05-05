<?php
	//ini_set('session.cookie_secure', 1);     // solo HTTPS
	ini_set('session.cookie_httponly', 1);   // no accesible desde JS
	ini_set('session.cookie_samesite', 'Strict'); // bloquea CSRF adicional
	session_start();
	date_default_timezone_set("America/Mexico_City"); 

	class SafePDO extends PDO {
		public static function exception_handler($exception) {	
			die("Uncaught exception: ".$exception->getMessage());
		}

		public function __construct($dsn, $username='', $password='', $driver_options=array()) {
			set_exception_handler(array(__CLASS__, 'exception_handler'));		
			parent::__construct($dsn, $username, $password, $driver_options);		
			restore_exception_handler();
		}
	}

	class Conexion {
		var $db   = 'sagm_lib_clinic';
		var $host = 'localhost';
		var $us   = 'root';
		var $pw   = '';
		var $key  = '3l40key234!';
		var $dbh;	
		
		function conectar() {$this->dbh = new SafePDO( "mysql:host=" . $this->host . ";dbname=" . $this->db, $this->us, $this->pw, array(\Pdo\Mysql::ATTR_INIT_COMMAND => "SET NAMES 	utf8", PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		}
		
		function cerrar() {
			$this->dbh = null;
		}
	}
?>