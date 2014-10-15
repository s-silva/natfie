<?php

	include_once("../general/basics.php");

	
	echo basics::friend_request_delete(basics::quick_uidn($_GET['u']));
	
?>