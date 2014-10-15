<?php

	include_once("../pages/albums.php"); 
	
	$id = 0;
	
	if(!isset($_GET['id'])) die ("");        /* data */
	
	$albid = 0;
	
	if(isset($_GET['albid'])) $albid = $_GET['albid'];
	
	$id = $_GET['id'];

	$ac = new albums(); 
		
	switch($id)
	{
	case 1:
		echo $ac->get_albumsethtml(0);
		break;
		
	case 2:
		echo $ac->get_onealbumhtml(0, $albid);
		break;
		
	case 3:
		echo $ac->get_allphotoshtml(0);
		break;
	}
?>