<?php
	include_once("../general/photos.php"); 
	
	if(!isset($_GET['n'])) die(0);
	
	if(!isset($_GET['dsc'])) $albumdsc = 0;
	else $albumdsc = $_GET['dsc'];
	
	
	$albumname = $_GET['n'];
	$albumlocset = 0;
	
	if(isset($_GET['loctext']) && isset($_GET['loclt']) && isset($_GET['locgt']) && isset($_GET['locct']))
	{
		$albumloc    = $_GET['loctext'];
		$albumloc_lt = $_GET['loclt'];
		$albumloc_lg = $_GET['locgt'];
		$albumloc_c  = $_GET['locct']; /* country id */
		
		$albumlocset = 1;
	}

	$pc = new photos(); 
		
	echo $pc->album_create($albumname, "", 0, 0);

?>