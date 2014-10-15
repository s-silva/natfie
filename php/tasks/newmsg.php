<?php

	include_once("../general/basics.php");
	

	if(!isset($_GET['u'])) die ("error");
	if(!isset($_POST['m'])) die ("error");
	
	$msg = $_POST['m'];
	$ulist = $_GET['u'];
	
	$msg = strip_tags(trim($msg));
	if($msg == "") die(0);
	
	$ua = explode(",", $ulist);
	
	for($i=0; $i<count($ua); $i++)
	{
		$ua[$i] = basics::quick_uidn($ua[$i]);
	}
	
	$ua = array_unique($ua);
	
	if(count($ua) == 0) die(0);

	echo basics::conversation_start($msg, $ua);
	//echo basics::conversation_send(trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $_GET['m']))), $_GET['r'], $_GET['s'], $a, $msgmode);
	echo 1;
?>