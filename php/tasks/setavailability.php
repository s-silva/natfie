<?php
	include_once("../general/basics.php"); 

	if(!isset($_GET['v'])) die(0);
	
	$v = $_GET['v'];
	
	basics::userenv_set_availability($v, 0);

	echo 1;
?>