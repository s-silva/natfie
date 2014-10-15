<?php

	$pid = 0;
	
	if(isset($_GET['pid']))
	{
		$pid = $_GET['pid'];

		include_once("../../php/general/posts.php"); 

		$pc = new posts(); 

		echo $pc->delete_post($pid);
	}

?>