<?php
	
	if(!isset($_GET['q'])) die("[]");
	
	$q = $_GET['q'];
	
	$hostname_logon = "localhost";
	$database_logon = "cards";
	$username_logon = "root";
	$password_logon = "1234";
	
	$connections = mysql_connect($hostname_logon, $username_logon, $password_logon) or die ('Unabale to connect to the database');
	
	mysql_select_db($database_logon) or die ('Unable to select database!');
	
	$res = mysql_query("SELECT * from geodataplaces where name LIKE '$q%%' LIMIT 10;");

	$r = "[";
	$i = 0;
	
	while($rplc = mysql_fetch_array($res))
	{
		if($i) $r .= ",";
		
		$cv = $rplc['country'];
		
		$ncres = mysql_query("SELECT name from geodatacountries where iso_alpha2='$cv' LIMIT 20;");
		$rc = mysql_fetch_array($ncres);
		
		$r .= '{"name":"'.$rplc['name'].', '.$rc['name'].'", "lt":"'.$rplc['latitude'].'", "lg":"'.$rplc['longitude'].'"}';
		$i++;
	}
	
	$r .= "]";
	echo $r;
?>