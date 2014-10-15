<?php
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/posts.php"); 
	
class albums
{
	function get_calbumdetails($uid)
	{
		if(!$uid) $uid = $_SESSION['uid'];
		$errorval = array(0, "");
		
		if(!basics::table_exists("albums_$uid")) return $errorval;
		
		$res = basics::query("SELECT * FROM albums_$uid");
		if(!$res) return $errorval;
		
		$r = mysql_fetch_array($res);
		if(!$r) return $errorval;
		
		return array($r['id'], $r['name']);
	}
	
	function get_albumdetails($uid, $albid)
	{
		if(!$uid) $uid = $_SESSION['uid'];
		$errorval = array(0, "");
		
		if(!basics::table_exists("albums_$uid")) return $errorval;
		
		$res = basics::query("SELECT * FROM albums_$uid WHERE id=$albid");
		if(!$res) return $errorval;
		
		$r = mysql_fetch_array($res);
		if(!$r) return $errorval;
		
		return array($r['id'], $r['name']);
	}
	
	function get_albumsethtml($uid)
	{
		if(!$uid) $uid = $_SESSION['uid'];
		$errorval = "<div class='pha_bigmessage'><b>You don't have any albums</b><br/>Click here or drag and drop photos to begin...</div>";
		
		if(!basics::table_exists("albums_$uid")) return $errorval;
		
		$res = basics::query("SELECT * FROM albums_$uid");
		if(!$res) return $errorval;
		
		$i = 0;
		$d = "";
		
		while($r = mysql_fetch_array($res))
		{
			$d .= $this->get_salbumbox($r['id'], $r['name'], $r['dsc'], 0, $r['photocount'], $r['wtime'], $r['coverphoto']);
			
			$i++;
		}
		
		$d .= "<div style='clear: both;'></div>";
		
		if(!$i)
			return $errorval;
		else
			return $d;
	}
	
	function get_onealbumhtml($uid, $albumid)
	{
		if(!$uid) $uid = $_SESSION['uid'];
		
		$luid = basics::quick_ulida($uid);
		$uida = basics::quick_uida($uid);
		
		$errorval = "<div class='pha_bigmessage'><b>Empty album</b><br/>Click here or drag and drop photos to begin...</div>";
		
		
		if(!basics::table_exists("albums_$uid")) return $errorval;
		
		if(!$albumid)
			$res = basics::query("SELECT * FROM photos_$uid");
		else
			$res = basics::query("SELECT * FROM photos_$uid WHERE albumid=$albumid");
				
		if(!$res) return $errorval;
		
		$i = 0;
		
		$dlist = "<div id='photomgalbpvlist' style='display: none;'>[";
		$d = "";
		
		while($r = mysql_fetch_array($res))
		{
			$d .= $this->get_photobox($i, $luid, $r['id'], $r['fname'], $uida."-".$r['id'], $uida, $albumid, 0, $uida."-".basics::quicktranslate_encodenumber($r['postid']));
			
			if($i)$dlist .= ", ";
			
			$npostid = $r['postid'];
			$ppostid = $uida.'-'.basics::quicktranslate_encodenumber($npostid);
			
			$dlist .= '{"id": '.$i.', "fn": "data\/u'.$luid.'\/pt\/'.$r['fname'].'.jpg", "postid":"'.$ppostid.'"}';
			$i++;
		}
		
		$res = basics::query("SELECT * FROM albums_$uid WHERE id=$albumid");
		if(!$res) return $errorval;
		
		$ra = mysql_fetch_array($res);
		if(!$ra) return $errorval;
		
		
		$dlist .= "]</div>";
		$d .= "<div style='clear: both;'></div>$dlist<div style='display: none;'><div id='photomgalbpvlist_dpp'>$luid</div>".
			  "<div id='photomgalbpvlist_albtt'>".$ra['name']."</div><div id='photomgalbpvlist_dsc'>".$ra['dsc']."</div>".
			  "<div id='photomgalbpvlist_ptt'><a href='u".$uida."'>".basics::get_username_from_id($uid)."</a></div></div>";
		
		if(!$i)
			return $errorval;
		else
			return $d;
	}
	
	function get_allphotoshtml($uid)
	{
		$errorval = "<div class='pha_bigmessage'><b>You don't have any photos</b><br/>Click here or drag and drop photos to begin...</div>";
		
		return $errorval;
	}
	
	/*
	 * try to get album id, if album does not exist, create new one
	 * and return the id.
	 */
	function force_get_albumid($albumname)
	{
		$uid = $_SESSION['uid'];
		
		if(!basics::table_exists("albums_$uid"))
		{
			/* create */
		}
		
		$res = basics::query("SELECT id FROM albums_$uid WHERE name = '$albumname'");
		if(!$res) return 0;
		
		$r = mysql_fetch_array($res);
		if(!$r) return 0;
		
		return $r['id'];
	}
	
	function get_albumid($strid)
	{
		$lstrid = strtolower($strid);
		
		if($lstrid == "random")
		{
			return array($_SESSION['uid'], $this->force_get_albumid("Random"));
		}
		if($lstrid == "profile")
		{
			return array($_SESSION['uid'], $this->force_get_albumid("Profile"));
		}
		if($lstrid == "blog")
		{
			return array($_SESSION['uid'], $this->force_get_albumid("Blog"));
		}
		
		if(strpos($strid, '-') > 0)
		{
			$idset = explode("-", $strid);
			if(!$idset) return 0;
			
			return array(basics::quick_uidn($idset[0]), basics::quicktranslate_decodenumber_pad($idset[1], 4));
		}else{
			
			return array($_SESSION['uid'], basics::quicktranslate_decodenumber_pad($strid, 4));
		}
		
	}
	
	function get_photothumbnail_file($uid, $photoid)
	{
		if(!basics::table_exists("photos_$uid")) return 0;
		
		$res = basics::query("SELECT fname FROM photos_$uid WHERE id=$photoid");
		if(!$res) return 0;
		
		$r = mysql_fetch_array($res);
		if(!$r) return 0;
		
		$fname = $r['fname'].".jpg";
		$luid = basics::quick_ulida($uid);
		
		
		return "data/u$luid/pt/$fname";
	}
	
	
	function get_salbumbox($albid, $aname, $adsc, $loc, $photocount, $wtime, $coverphotoid)
	{
		$wtime = strtotime($wtime);
		$photocountwordend = 's';
		
		if($photocount == 1) $photocountwordend = '';
		
		$imgc = "<img data-src='images/test/pv6.jpg'/>";
		if(!$photocount)
			$imgc = "<p>Empty</p>";
			
			
		if($photocount)
		{
			$timg = $this->get_photothumbnail_file($_SESSION['uid'], $coverphotoid);
			if($timg) $imgc = "<img data-src='$timg'/>";
		}
			
		return "<div class='pha_thumbalbct'>".
						"<div class='pha_thumbalbcttbk'><a href='javascript: photomanager_viewalbumset($albid, \"$aname\");'>$imgc</a><span><div class='photomm_eit'><div class='photomm_eitb'><div class='photomm_eitbi1'></div></div><div class='photomm_eitb' onclick='photomanager_delalbum(this, $albid);'><div class='photomm_eitbi2'></div></div></div></span></div>".
						"<div class='pha_thumbalbbt'>".
							"<div class='pha_thumbalbbt_c'>$photocount Photo$photocountwordend</div>".
							"<div class='pha_thumbalbbt_r'>".
								"<div class='pha_thumbalbbt_t'>$aname</div>".
								"<div class='pha_thumbalbbt_l'>Coast Way, California</div>".
								"<div class='pha_thumbalbbt_tt'><abbr class='synctime' data-ts='$wtime' data-mode='0'></abbr></div>".
					"</div></div></div>";
		
	}
	
	function get_photobox($indexv, $luid, $photoid, $fname, $picid, $uid, $albumid, $npic, $postid)
	{
		
		return "<div class='photomm_cipic'><a href=\"javascript: fc_post_expand_album('$uid', $albumid, $indexv, '$postid');\"><img style='position: absolute;' onerror='failsafe_imgphoto(this, 2);' data-src='data/u$luid/pt/$fname.jpg'/></a><span><div class='photomm_eib'>Her Side of The Mirror<div class='photomm_eibr'><div class='boxc_i boxc_icm'></div><div class='boxc_icmd'>12</div></div></div><div class='photomm_eit'><div class='photomm_eitb'><div class='photomm_eitbi1'></div></div><div class='photomm_eitb' onclick=\"photomanager_delpic(this, $indexv, '$picid');\"><div class='photomm_eitbi2'></div></div></div></span></div>";

	}
	
	function get_photobox_old($indexv, $luid, $photoid, $fname, $picid)
	{
		
		return "<div class='photomm_cipic'><a href='javascript: photomanager_photoview($indexv, \"photomgalbpvlist\");'><img style='position: absolute;' onerror='failsafe_imgphoto(this, 2);' data-src='data/u$luid/pt/$fname.jpg'/></a><span><div class='photomm_eib'>Her Side of The Mirror<div class='photomm_eibr'><div class='boxc_i boxc_icm'></div><div class='boxc_icmd'>12</div></div></div><div class='photomm_eit'><div class='photomm_eitb'><div class='photomm_eitbi1'></div></div><div class='photomm_eitb' onclick=\"photomanager_delpic(this, $indexv, '$picid');\"><div class='photomm_eitbi2'></div></div></div></span></div>";

	}
}

?>