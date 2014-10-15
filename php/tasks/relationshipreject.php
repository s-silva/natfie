<?php

	include_once("../general/basics.php");

	
	echo basics::relationship_request_delete(basics::quick_uidn($_GET['u']));
	
?>