<?php
	include_once("../general/photos.php"); 
	
	
	if(!isset($_GET['id'])) die(0);
	
	$albumid = $_GET['id'];

	$pc = new photos(); 
	echo $pc->album_delete($albumid);

?>