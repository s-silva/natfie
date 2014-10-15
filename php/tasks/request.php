<?php

	include_once("../general/basics.php");

	
	echo basics::friend_request_add(basics::quick_uidn($_GET['u']));
	
?>