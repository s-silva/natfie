<?php
	include_once("../general/posts.php"); 
	
	$postuid = 0;
	$postid = 0;
	$fnoteid = 0;
	$notecount = 20;
	$mode = 0;
	
	$rpid = 0;
	
	if(isset($_GET['c'])) $notecount = $_GET['c'];
	if($notecount <= 0) die("0");
	
	if(isset($_GET['id'])) $rpid = $_GET['id'];  /* data */
	if(!$rpid) die ("0");
	
	if(isset($_GET['mode'])) $mode = $_GET['mode'];
	
	$rpid = decode_note_id($rpid);

	if(!$rpid) die ("0");
	
	$postuid = $rpid[0];
	$postid  = $rpid[1];
	$fnoteid = $rpid[2];
	
	$pc = new posts(); 
	
	
	
	echo $pc->get_note_set_html($postuid, $postid, $fnoteid, $notecount, $mode);
	
	function decode_note_id($sdata) /* decode id from: userid-postid_noteid */
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