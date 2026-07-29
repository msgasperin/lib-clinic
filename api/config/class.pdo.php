<?php
	//ini_set('session.cookie_secure', 1);     // solo HTTPS
	$lifetime = 8 * 60 * 60; // 8 horas

	// Mantener los archivos de sesión por 8 horas
	ini_set('session.gc_maxlifetime', $lifetime);

	// La cookie también durará 8 horas
	session_set_cookie_params([
		'lifetime' => $lifetime,
		'path'     => '/',
		'httponly' => true,
		'secure'   => isset($_SERVER['HTTPS']),
		'samesite' => 'Strict'
	]);

	session_start();
	date_default_timezone_set("America/Mazatlan"); 

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