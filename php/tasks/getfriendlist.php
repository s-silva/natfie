<?php

	include_once("../general/basics.php");

	$flist = basics::search_get_allfriends();
	
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