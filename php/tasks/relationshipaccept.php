<?php

	include_once("../general/basics.php");

	if(!isset($_GET['u'])) die("0");
	if(!isset($_GET['rm'])) die("0");
	
	echo basics::relationship_request_accept(basics::quick_uidn($_GET['u']), $_GET['rm']);
	
?>