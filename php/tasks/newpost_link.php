<?php

	include_once("../general/posts.php"); 
	
	$touser = 0;
	$extrad = 0;
	$mode   = posts::post_type_link_url;
	
	if(!isset($_POST['d'])) die ("error");       /* data */
	if(!isset($_POST['m'])) die ("error");        /* mode */
	if(isset($_GET['e'])) $extrad = $_GET['e'];  /* extra data */
	if(isset($_GET['u'])) $touser = $_GET['u'];  /* to user */
	
	switch($_POST['m'])
	{
	case posts::post_type_link_video:
	case posts::post_type_link_audio:
	case posts::post_type_link_url:
		$mode = $_POST['m'];
		break;
	}
	
	$fd = trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $_POST['d'])));
	$fd = str_replace("?", "[-q-]", $fd);
	$fd = strip_tags($fd, "<b><i><s>");
	
	$ed = "";
	
	/* combine urls and details together */
	             
	$ed_url   = "";
	$ed_site  = "";
	$ed_title = "";
	$ed_dsc   = "";
	$ed_dur   = "";
	$ed_thumb = "";
	
	if(isset($_POST['eurl']))   $ed_url      = text_safeconvert($_POST['eurl']);
	if(isset($_POST['esite']))  $ed_site     = text_safeconvert($_POST['esite']);
	if(isset($_POST['etitle'])) $ed_title    = text_safeconvert($_POST['etitle']);
	if(isset($_POST['edsc']))   $ed_dsc      = text_safeconvert($_POST['edsc']);
	if(isset($_POST['edur']))   $ed_dur      = text_safeconvert($_POST['edur']);
	if(isset($_POST['ethumb'])) $ed_thumb    = text_safeconvert($_POST['ethumb']);
	
	$eda = array($ed_url, $ed_thumb, $ed_site, $ed_title, $ed_dsc, $ed_dur);
	$ed = serialize($eda);

	$pc = new posts(); 
	
	if($touser) $touser = basics::quick_uidn($touser);
	
	echo $pc->create_post($touser, $mode, $fd, $ed, 0, 0, 1);

	
	function text_safeconvert($t)
	{
		$t = trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $t)));
		$t = str_replace("?", "[-q-]", $t);
		$t = strip_tags($t, "<b><i><s>");
		return $t;
	}
?>