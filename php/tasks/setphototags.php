<?php
	include_once("../general/talk.php"); 
	
	$postid = 0;
	
	if(!isset($_POST['js'])) die(0);
	if(!isset($_GET['postid'])) die(0);
	
	$postid = $_GET['postid'];
	
	if(!$postid) die(0);
	
	$json = json_decode($_POST['js']);
	
	if(!$json) die(0);
	
	$pids = decode_singlepost_ids($postid);
	if(!$pids) die(0);
	if(!$pids[0]) die(0);
	if(!$pids[1]) die(0);
	
	$tc = new talk(); 
	
	$stag = array(0, 0, 0);
	$tagset = array();
	$i = 0;
	
	foreach($json->{'tags'} as $t)
	{
		$stag[0] = $t[3];
		$stag[1] = floor($t[0]);
		$stag[2] = floor($t[1]);
		
		$tagset[$i] = $stag;
		$i++;
	}
	
	echo $tc->add_tags($pids[0], $pids[1], $tagset);
	
	
	
	
	
	
	function decode_singlepost_ids($sdata)
	{
		$rv = array(0, 0);
		
		if(!$sdata) return 0;
	
		$ra = explode("-", $sdata);
		
		if(!$ra) return 0;
		
		if(count($ra) > 1)
		{
			$rv = array(basics::quick_uidn($ra[0]), basics::quicktranslate_decodenumber($ra[1]));	
		}
		
		return $rv;
	}
	
?>