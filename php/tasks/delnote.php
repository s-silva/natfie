<?php
	include_once("../general/talk.php"); 
	
	$postuid = 0;
	$postid = 0;
	$noteid = 0;
	$rpid = 0;

	if(isset($_GET['id'])) $rpid = $_GET['id'];  /* extra data */
	
	if(!$rpid) die ("0");
	
	$rpid = decode_note_id($rpid);

	if(!$rpid) die ("0");
	
	$postuid = $rpid[0];
	$postid = $rpid[1];
	$noteid = $rpid[2];
	
	$tc = new talk(); 
	
	if($postuid <= 0) die ("0");
	if($postid < 0) die ("0");
	if($noteid < 0) die ("0");
	
	echo $tc->delete_note($postuid, $postid, $noteid);

	
	
	
	
	
	
	function decode_note_id($sdata)
	{
		$nid = 0;
		$rv = array(0, 0, 0);
		
		if(!$sdata) return 0;
	
		$ra = explode("_", $sdata);
		if(!$ra) return 0;

		if(count($ra) <= 1) return 0;

		$nid = $ra[1];
	
		$ra = explode("-", $ra[0]);
		if(!$ra) return 0;
		
		if(count($ra) > 1)
		{
			$rv = array(basics::quick_uidn($ra[0]), basics::quicktranslate_decodenumber($ra[1]), $nid);
		}
		
		return $rv;
	}
?>