<?php

	include_once("../general/basics.php");
	
	if(!isset($_GET['v'])) die ("0");
	if(!isset($_GET['g'])) die ("0");
	
	$g = $_GET['g'];
	$v = $_GET['v'];
	
	switch($g)
	{
	case 1:		/* switch profile background mode */
	
		basics::setting_toggle(1, $v);
		break;
	
	default:
		die("0");
	}
	
	echo 1;
?>