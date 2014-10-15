<?php
	include_once("../../general/basics.php");
	
	if(!isset($_GET['uid'])) die ("0");
	if(!isset($_GET['t'])) die ("0");
	/* if(!isset($_GET['ps'])) die ("0"); */ 
	
	$uid   = $_GET['uid'];
	$rtype = $_GET['t'];

	$uid = basics::quick_uidn($uid);

	$cuid = $_SESSION['uid'];
	$tmstr = time();
	
	
	/* clear the other person's relationship mode */
	
	$res = basics::query("select relationshipuser, relationshipaccepted FROM userdetails where userid=$cuid");
	if(!$res) die("0");
	$row = mysql_fetch_array($res);
	if(!$row) die("0");
	$myruid = $row['relationshipuser'];
	$myracc = $row['relationshipaccepted'];
	
	if($myruid)
	{
		$res = basics::query("select relationshipuser, relationshipaccepted FROM userdetails where userid=$myruid");
		if(!$res) die("0");
		$row = mysql_fetch_array($res);
		if(!$row) die("0");
		$otherruid = $row['relationshipuser'];
		$otherracc = $row['relationshipaccepted'];
		
		if($otherruid == $cuid && $otherracc != 0) /* we're in a relationship */
		{
			basics::query("update userdetails SET relationshipuser=0, relationshipaccepted=0 where userid=$myruid");
		}
	}
	
	if($rtype > 1)
	{
		basics::query("update userdetails SET relationshipuser=$uid, relationshipsince=UTC_TIMESTAMP(), relationshipmode=$rtype, relationshipaccepted=0 where userid=$cuid");
		basics::relationship_request_add($uid, $rtype == 3 ? 2 : 1);
	}else{
		basics::query("update userdetails SET relationshipuser=0, relationshipsince=UTC_TIMESTAMP(), relationshipmode=$rtype, relationshipaccepted=0 where userid=$cuid");
	}
	echo 1;
?>