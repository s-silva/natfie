<?php
	include_once("../general/photos.php"); 
	
	
	if(!isset($_GET['uid'])) die(0);
	$guida = $_GET['uid'];
	
	if(!isset($_GET['albid'])) die(0);
	$galbumid = $_GET['albid'];
	
	if(!isset($_GET['photoid'])) die(0);
	$gphotoid = $_GET['photoid'];
	
	
	
	function get_photoset_json($uid, $albumid, $uida, $luid)
	{
		if(!$uid) $uid = $_SESSION['uid'];
		
		
		if(!$uida)$uida = basics::quick_uida($uid);
		

		if(!basics::table_exists("albums_$uid")) return 0;
		
		$res = basics::query("SELECT * FROM photos_$uid WHERE albumid=$albumid");
		if(!$res) return 0;
		
		$i = 0;
		
		$dlist = "[";
		
		while($r = mysql_fetch_array($res))
		{
			if($i)$dlist .= ", ";
			
			$npostid = $r['postid'];
			$ppostid = $uida.'-'.basics::quicktranslate_encodenumber($npostid);
			
	
			$dlist .= '{"w": '.$r['w'].', "h":'.$r['h'].', "id": '.$i.', "fnt": "data\/u'.$luid.'\/pt\/'.$r['fname'].'.jpg", "fn": "data\/u'.$luid.'\/pf\/'.$r['fname'].'.jpg", "postid":"'.$ppostid.'"}';
			$i++;
		}
		$dlist .= "]";
		
		return $dlist;
	}
	
	
	$guid = basics::quick_uidn($guida);
	$gluid = basics::quick_ulida($guid);
	
	$rjson_pset = get_photoset_json($guid, $galbumid, $guida, $gluid);
	if(!$rjson_pset) die(0);
	
	$res = basics::query("SELECT * FROM albums_$guid WHERE id=$galbumid");
	if(!$res) return 0;
	
	$r = mysql_fetch_array($res);
	if(!$r) return 0;
	
	
	$npostid = $r['postid'];
	$ppostid = $guida.'-'.basics::quicktranslate_encodenumber($npostid);
	
	$locname = "";
	if($r['locname'] && $r['loccountry']) $locname = $r['locname'].", ".$r['loccountry'];
	
	$rjson = '{"pset": '.$rjson_pset.', "aname":"'.$r['name'].'", "uname": "'.basics::get_username_from_id($guid).'", "uid":"'.$guida.'", "ulid":"'.$gluid.'", "loc": "'.$locname.'", "locurl":"", "dsc":"'.$r['dsc'].'", "postid":"'.$ppostid.'"}';
	
	echo $rjson;


?>