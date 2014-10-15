<?php

	//error_reporting(0);
	include_once("../../settings.php");
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/tools/idnumber.php"); 
	
	
	class initiatesite
	{

		var $hostname_logon = "";
		var $database_logon = "";
		var $username_logon = "";
		var $password_logon = "";
		
		function __construct()
		{
			$this->hostname_logon = settings::$mysql_hostname;
			$this->database_logon = settings::$mysql_database;
			$this->username_logon = settings::$mysql_username;
			$this->password_logon = settings::$mysql_password;
		}
		
		function generate_bulk($length)
		{ 
			$chars = "abcdefghijkmnopqrstuvwxyz023456789"; 
			srand((double)microtime()*1000000); 
			$i = 0; 
			$pass = '' ; 
			while ($i <= $length) { 
				$num = rand() % 33; 
				$tmp = substr($chars, $num, 1); 
				$pass = $pass . $tmp; 
				$i++; 
			} 
			return $pass; 
		} 
		
		
		function init_details()
		{
			$connections = mysql_connect($this->hostname_logon, $this->username_logon, $this->password_logon) or die ('Unabale to connect to the database');
			
			//mysql_query("CREATE DATABASE cards", $connections);
			
			mysql_select_db($this->database_logon) or die ('Unable to select database!');
			
			$this->qry("ALTER TABLE logon ADD COLUMN accountmode int, ADD COLUMN lockedlevel int", $this->username_logon, $this->password_logon);

			/*
			$this->qry("ALTER TABLE logon ADD FULLTEXT (username, lastname)", $this->username_logon, $this->password_logon);
			*/

			//for($i=1; $i<=22; $i++)
			//	$this->qry("insert into usersettings (uid, filter_search, filter_search_do, filter_arrange, filter_mode, filter_view, filter_network, filter_geo, style_main, style_sub, dp_x, dp_y, long_background, bk_y, blog_enable, blog_name, blog_dsc, blog_theme, blog_theme_id) values ($i, '', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0);", $this->username_logon, $this->password_logon);
			
			//for($i=1; $i<=22; $i++)
			//{
			//	$this->qry("ALTER TABLE posts_$i ADD COLUMN loc_lt FLOAT( 10, 6 ), ADD COLUMN loc_lg		  FLOAT( 10, 6 ), ADD COLUMN loc_name      varchar(255), ADD COLUMN loc_used      int", $this->username_logon, $this->password_logon);
            //
			//
			//	
			//	//$this->qry("insert into usersettings (uid, filter_search, filter_search_do, filter_arrange, filter_mode, filter_view, filter_network, filter_geo, style_main, style_sub, dp_x, dp_y, long_background, bk_y, blog_enable, blog_name, blog_dsc, blog_theme, blog_theme_id) values ($i, '', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0);", $this->username_logon, $this->password_logon);
			//}
						
		}
		
		
		function qry($query)
		{

			$args  = func_get_args();
			$query = array_shift($args);
			$query = str_replace("?", "%s", $query);
			$args  = array_map('mysql_real_escape_string', $args);
			array_unshift($args,$query);
			$query = call_user_func_array('sprintf',$args);
			$result = mysql_query($query) or die(mysql_error());
			if($result){
				return $result;
			}else{
				$error = "Error";
				return $result;
			}
		}
	}
	
	$ist = new initiatesite();
	$ist->init_details();
?>