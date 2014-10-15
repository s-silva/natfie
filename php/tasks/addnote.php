<?php
	include_once("../general/talk.php"); 
	
	$postuid = 0;
	$postid = 0;
	$intt = 0;
	$rpid = 0;
	
	if(!isset($_POST['d'])) die ("0");
	
	$fd = $_POST['d'];

	if(isset($_GET['id'])) $rpid = $_GET['id'];  /* extra data */
	if(isset($_GET['intt'])) $intt = $_GET['intt'];  /* to user */
	
	if(!$rpid) die ("0");
	
	$rpid = decode_singlepost_ids($rpid);
	
	if(!$rpid) die ("0");
	
	$postuid = $rpid[0];
	$postid = $rpid[1];

	$tc = new talk(); 
	
	if($postuid <= 0) die ("0");
	if($postid < 0) die ("0");
	
	echo $tc->add_note($postuid, $postid, $fd, 0, $intt, 0, 0);

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