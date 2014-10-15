<?php
	include_once("../../general/basics.php");
	
	if(!isset($_POST['d'])) die (0);
	
	$jd = json_decode($_POST['d']);
	
	if(!$jd) die (0);
	
	$i = 0;
	$cuid = $_SESSION['uid'];
	
	basics::query("DROP TABLE IF EXISTS userwebsitelist_$cuid;");
	basics::query("CREATE TABLE userwebsitelist_$cuid (
				id	            int not null primary key auto_increment,
				title   		VARCHAR(128),
				site	        VARCHAR(250)
				);");


	
	foreach($jd as $kv)
	{
		if(count($kv) < 2) continue;
		if(!$kv[0]) continue;
		if(!$kv[1]) continue;
		
		$k = $kv[0];
		$v = $kv[1];
		
		$k = basics::escapestrfull($k);
		$v = basics::escapestrfull($v);

		$k = str_replace('[-n-l-]', '', $k);
		$v = str_replace('[-n-l-]', '', $v);		
		
		basics::query("insert into userwebsitelist_$cuid (title, site) values ('".$k."', '".$v."')");
			
		$i++;
		
		if($i >= 10) break;
	}
	
	echo 1;
?>