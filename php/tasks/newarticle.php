<?php

	include_once("../general/posts.php"); 
	
	if(!isset($_POST['d'])) die ("error"); /* data */
	
	$fd = trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $_POST['d'])));
	$fd = str_replace("?", "[-q-]", $fd);
	
	$pc = new posts(); 

	$cpostret = $pc->create_blog_post($fd);

	echo 1;
?>