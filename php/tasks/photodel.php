<?php
	include_once("../general/photos.php"); 
	
	
	if(!isset($_GET['id'])) die(0);
	
	$picid = $_GET['id'];
	$picuid = 0;
	
	$decpicid = explode("-", $picid);
	
	if(count($decpicid) < 1) die(0);

	$picuid = basics::quick_uidn($decpicid[0]);

	if($picuid <= 0) die(0);
	
	$pc = new photos(); 
	echo $pc->photo_delete($picuid, $decpicid[1], 1);

?>