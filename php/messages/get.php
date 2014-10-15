<?php

	include_once("main.php"); 
	
	$vp = 0;
	if(isset($_GET['p'])) $vp = $_GET['p'];
	
	echo getmsgdata($_SESSION['uid'], 0,$vp, 0)
?>