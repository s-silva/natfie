<?php

	include_once("../general/posts.php"); 
	
	$touser = 0;
	$opuid = 0;
	$oppid = 0;
	
	if(!isset($_GET['opu'])) die ("error");        /* data */
	
	
	if(isset($_GET['opu'])) $opuid  = $_GET['opu'];
	if(isset($_GET['opp'])) $oppid  = $_GET['opp'];
	if(isset($_GET['u']))   $touser = $_GET['u'];  /* to user */

	if($touser) $touser = basics::quick_uidn($touser);
	if($opuid) $opuid = basics::quick_uidn($opuid);
	if($oppid) $oppid = basics::quicktranslate_decodenumber($oppid);
	
	$pc = new posts(); 
		
	echo $pc->make_repost($touser, $opuid, $oppid, 1);
?>