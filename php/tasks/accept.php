<?php

	include_once("../general/basics.php");

	
	echo basics::friend_request_accept(basics::quick_uidn($_GET['u']));
	
?>