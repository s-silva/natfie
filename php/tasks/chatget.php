<?php

	include("../../clogin.php"); 
	include_once("../general/basics.php");

	$log = new logmein(); 
	$user_id    = $_SESSION['uid'];
	
	/* verify the room */
	
	
	$rid = $_GET['r'];
	
	/* get users */
	basics::query("UPDATE conversationsin_$user_id SET newmsgs=0 WHERE roomid=$rid;");

	echo basics::chat_getlines_json($rid, 0);
	
?>