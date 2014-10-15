<?php
	
	include("../../settings.php");
	
	class geninvite
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
		
		function gen()
		{
			$connections = mysql_connect($this->hostname_logon, $this->username_logon, $this->password_logon) or die ('Unabale to connect to the database');
			
			mysql_select_db($this->database_logon) or die ('Unable to select database!');
			
			$this->qry("CREATE TABLE IF NOT EXISTS joininvitations (
						id               int not null primary key auto_increment,
						used             int,
						useruser         int,
						genid            varchar(32)
						);",
						$this->username_logon, $this->password_logon);
			
			$resudcount = mysql_query("SELECT Auto_increment FROM information_schema.tables WHERE table_name='joininvitations' AND table_schema = DATABASE();");
			$resudcountrow = mysql_fetch_assoc($resudcount);
			
			$gcount = $resudcountrow['Auto_increment'];
			$gid = $this->invite_translate_userid($gcount + 2, false, 6);
						
			$this->qry("insert into joininvitations (used, useruser, genid) values (0, 0, '$gid')");

			echo "<h1>The Invitation ID is: ".$gid."</h1>";
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
		
		function invite_translate_userid($in, $to_num = false, $pad_up = false)
		{
		  $index    = array("nIYBS8FEPjNG1A4MCfqoKRpedTtgw9h3rXc5mVziuLsy6Ql7xHvOJWZ2kbU0aD",
							"qSOCVJGayr1KwITiL4AxoPcWtQYM3BmZR68FNluH5h7X0df2snEvgpDbjezkU9",
							"3YASn2TIhLG7mDgB5yKlcaWNZi8RPzbj1CkvdFpsJfuOHMoVrEq4wxUteXQ960",
							"SXDcmZtCgRAN1rHElkQbOxLGq7UViFdv5fKhw9WTo6MeusYjp2PJna4yI03B8z",
							"bVHv2jMnzQBtgx6yuXAciWOT5q39YCPDrkNoZKa4IFlpGeEhsJ17SRfmd80wLU",
							"7NMOUKYas1mQTbzgolPFRkqCrAIJLvyx3DjXuEZcnW6i9e5tpwfSB402HVhdG8");

		  $base  = strlen($index[0]);
		  $ni = 0;
		 
		  if ($to_num) {
			// Digital number  <<--  alphabet letter code
			$in  = strrev($in);
			$out = 0;
			$len = strlen($in) - 1;
			for ($t = 0; $t <= $len; $t++) {
			  $bcpow = bcpow($base, $len - $t);
			  $out   = $out + strpos($index[$ni], substr($in, $t, 1)) * $bcpow;
			  $ni++;
			}
		 
			if (is_numeric($pad_up)) {
			  $pad_up--;
			  if ($pad_up > 0) {
				$out -= pow($base, $pad_up);
			  }
			}
			$out = sprintf('%F', $out);
			$out = substr($out, 0, strpos($out, '.'));
		  } else {
			// Digital number  -->>  alphabet letter code
			if (is_numeric($pad_up)) {
			  $pad_up--;
			  if ($pad_up > 0) {
				$in += pow($base, $pad_up);
			  }
			}
		 
			
			$out = "";
			for ($t = floor(log($in, $base)); $t >= 0; $t--) {
			  $bcp = bcpow($base, $t);
			  $a   = floor($in / $bcp) % $base;
			  $out = $out . substr($index[$ni], $a, 1);
			  $in  = $in - ($a * $bcp);
			  $ni++;
			}
			$out = strrev($out); // reverse
		  }
		 
		  return $out;
		}
	}
	
	$ist = new geninvite();
	$ist->gen();
?>