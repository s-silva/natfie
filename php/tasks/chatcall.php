<?php

	include_once("../general/basics.php");

	$dusers = array();
	$dusers[0] = basics::quick_uidn($_GET['u']);
	
	echo basics::conversation_start("hi!", $dusers);
	
?>