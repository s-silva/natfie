<?php
	
	include_once("../../general/basics.php");
 	include_once($_SERVER["DOCUMENT_ROOT"]."cards/clogin.php"); 
	
	if(!isset($_GET['v'])) die (0);
	
	$newvalue = $_GET['v'];
	
	/* [todo] add db saving */

	$_SESSION['logclass']->var_set_session('displaymodefeed', $newvalue);
	basics::setting_set(1, "style_sub", $newvalue);
	
	echo $newvalue;

?>