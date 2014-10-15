<?php

	include_once("../general/basics.php");
	
	$msgmode = 0;
	
	if(!isset($_GET['r'])) die ("error");
	if(!isset($_GET['s'])) die ("error");
	if(!isset($_GET['m'])) die ("error");
	if(!isset($_GET['a'])) die ("error");
	
	if(isset($_GET['msg']))
	{
		if($_GET['msg'] == 1)$msgmode = 1;
	}
	
	
	$a = 0;
	
	if($_GET['a'] == 1) $a = 1;
	
	echo basics::conversation_send(trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $_GET['m']))), $_GET['r'], $_GET['s'], $a, $msgmode);
	
?>