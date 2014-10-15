<?php

	include("clogin.php"); 
	
	/* no caching */
	
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
	header("Cache-Control: no-store, no-cache, must-revalidate"); 
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	

	$log = new logmein(); 
	
	
	
	if(isset($_GET['m']))
	{
		$log->forgetme();
	}

	
	
	
	
	$log->logout();
	header( 'Location: login');
	
	/* clear remember me */
	setcookie("thetree1e90cf430f19d3f84ff315fa96ac8f03", "", time()-60000); 
	
	echo $page;
?>