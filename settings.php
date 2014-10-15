<?php

	class settings
	{

		define('DB_HOST',getenv('OPENSHIFT_MYSQL_DB_HOST'));
		define('DB_PORT',getenv('OPENSHIFT_MYSQL_DB_PORT')); 
		define('DB_USER',getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
		define('DB_PASS',getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
		define('DB_NAME',getenv('OPENSHIFT_GEAR_NAME'));

		public static $mysql_hostname = DB_HOST;
		public static $mysql_database = DB_NAME;
		public static $mysql_username = DB_USER;
		public static $mysql_password = DB_PASS;
	}
?>