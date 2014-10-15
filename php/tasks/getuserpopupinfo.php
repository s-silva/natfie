<?php

	include_once("../general/basics.php");
	
	
	
	$uid = basics::quick_uidn($_GET['u']);
	
	if($uid == -1) die("");
	
	$name = basics::get_username_from_id($uid);
	$fname = basics::get_userfname_from_id($uid);
	$dsc = basics::get_userdescription($uid);
	$mfriends = basics::get_mutual_friend_count($uid);
	$isfriend = basics::isfriend($uid);
	$uloc = basics::quick_ulida($uid);
	
	echo '{"name":"'.$name.'", "loc":"'.$uloc.'", "fname":"'.$fname.'", "description":"'.$dsc.'", "mutual":'.$mfriends.', "friend":'.$isfriend.'}';
?>