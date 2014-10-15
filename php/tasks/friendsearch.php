<?php

	include_once("../general/basics.php");
	
	$skey = "";
	$ssort = 0;
	$slimit = 0;
	$smode = 1;
	$savailability = 0;
	$speople = 0;
	$excludefriends = 0;
	
	if(isset($_GET['q']))   $skey           = $_GET['q'];
	if(isset($_GET['st']))  $ssort          = $_GET['st'];
	if(isset($_GET['lim'])) $slimit         = $_GET['lim'];
	if(isset($_GET['sm']))  $smode          = $_GET['sm'];
	if(isset($_GET['av']))  $savailability  = $_GET['av'];
	if(isset($_GET['ppl'])) $speople        = $_GET['ppl'];
	if(isset($_GET['nf']))  $excludefriends = $_GET['nf'];
	/* $skeyword, $sorttype, $limit, $searchmode, $availableonly) */
	
	$flist = basics::search_friends($skey, $ssort, $slimit, $smode, $savailability);
	
	if($speople)
	{
		$flist2 = basics::search_people($skey, $ssort, $slimit, $smode);
		
		if($flist)
		{
			if(!$excludefriends)
			{
				$flist = array_merge($flist, $flist2);
				$flist = array_unique($flist);
			}else{
				$flist = array_diff($flist2, $flist);
			}
		}else{
			$flist = $flist2;
		}
		
	}
	
	if(!$flist)
	{
		/*header("HTTP/1.0 404 Not Found");*/
		die();
	}
	
	/* make json out of the users list */
	
	$jdata = '{"users": [';
	$fcuser = 1;
	$myuid = $_SESSION['uid'];
	
	foreach ($flist as $cuid)
	{
		if($myuid == $cuid) continue;
		
		if($fcuser)
		{
			$cuser = "{";
			$fcuser = 0;
		}else{
			$cuser = ", {";
		}

		/* get details of one user */
		
		$unameset = basics::get_usernameset_from_id($cuid);
		
		if($unameset)
		{
			$fn   = $unameset[0];
			$ln   = $unameset[1];
		}else{
			$fn   = "";
			$ln   = "";
		}
		
		$name = $fn." ".$ln;
		$av   = basics::userenv_get_availability($cuid);
		$dsc  = basics::get_userdescription($cuid);
		$uid  = basics::quick_uida($cuid);
		$lid  = basics::quick_ulida($cuid);
		$isfriend = basics::isfriend($cuid);
		
		if(!$isfriend)
			$mfs = basics::get_mutual_friend_count($cuid);
		else
			$mfs = -1;
			
		$cuserdata = '"mf": "'.$mfs.'", "ifr": "'.$isfriend.'", "fn": "'.$fn.'", "ln": "'.$ln.'", "name": "'.$name.'", "av": '.$av.', "dsc": "'.$dsc.'", "uid": "'.$uid.'", "lid": "'.$lid.'"';
		
		/* append data */
		
		
		$cuser .= $cuserdata."}";
		
		$jdata .= $cuser;
	}
	
	$jdata .= "]}";
	
	echo $jdata;
?>