<?php

	$lfid = 0;
	$inputsearchq = 0;
	$user = 0;
	
	if(isset($_GET['user'])) $user = $_GET['user'];
	if(isset($_GET['lfid'])) $lfid = $_GET['lfid'];
	if(isset($_GET['q'])) $inputsearchq = $_GET['q'];
	
	include_once("../../php/general/posts.php"); 

	$pc = new posts(); 
	
	$pc->set_searchquery($inputsearchq);
	
	if($user)
		$user = basics::quick_uidn($user);

	$pdata = $pc->get_posts_html_classic($user, $lfid, 10, 0);
	$lfid = $pc->get_lfid();
	
	if($pdata)
		echo "$lfid,".str_replace("\n", " ", $pdata[0])."\n".str_replace("\n", " ", $pdata[1]);
	else
		echo "";







?>