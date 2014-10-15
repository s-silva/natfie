<?php

	include_once("../general/posts.php"); 
	
	$touser = 0;
	$extrad = 0;
	$lftimeid = 0;
	
	if(!isset($_POST['d'])) die ("error");        /* data */
	if(isset($_GET['e'])) $extrad = $_GET['e'];  /* extra data */
	if(isset($_GET['u'])) $touser = $_GET['u'];  /* to user */
	if(isset($_GET['lftimeid'])) $lftimeid = $_GET['lftimeid'];
	
	$fd = trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $_POST['d'])));
	$fd = str_replace("?", "[-q-]", $fd);
	$fd = strip_tags($fd, "<b><i><s>");
	
	if($touser) $touser = basics::quick_uidn($touser);
	
	$pc = new posts(); 
	
	$loc_array = 0;
	
	if(isset($_GET['locn']) && isset($_GET['loclg']) && isset($_GET['loclt']))
	{
		$loc_array = array($_GET['locn'], $_GET['loclg'], $_GET['loclt'], 0);
	}
	
	$cpostret = $pc->create_post_geo($touser, posts::post_type_text, $fd, 0, 0, 0, 1, $loc_array);

	if($cpostret)
	{
		if($lftimeid)
		{
			echo $pc->get_posts_html_classic(0, $lftimeid, 10, 3);
		}else{
			echo $cpostret;
		}
	}else{
		echo 0;
	}
?>