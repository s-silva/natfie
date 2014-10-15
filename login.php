<?php

	include("clogin.php");
	
	/* no caching */
	
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
	header("Cache-Control: no-store, no-cache, must-revalidate"); 
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	
	
	$log = new logmein();
	
	if(isset($_SESSION['loggedin']))
		$loginretval = $log->logincheck($_SESSION['loggedin'], "logon", "password", "useremail");
	else
		$loginretval = false;
		
	if($loginretval == false)
		$loginretval = $log->autologin();
		
	if($loginretval == true)
	{
		header( 'Location: .' );
		
	}else{
	
		if(!$log->isloginlocked())
		{
			$page = file_get_contents("templates/login2.html");
		}else{
			$page = file_get_contents("templates/login_locked.html");
		}
		
		echo html_compress($page);
	}
	
	
	function html_compress($html)
	{
		preg_match_all('!(&lt;(?:code|pre).*&gt;[^&lt;]+&lt;/(?:code|pre)&gt;)!',$html,$pre);#exclude pre or code tags
		$html = preg_replace('!&lt;(?:code|pre).*&gt;[^&lt;]+&lt;/(?:code|pre)&gt;!', '#pre#', $html);#removing all pre or code tags
		$html = preg_replace('#&lt;!--[^\[].+--&gt;#', '', $html);#removing HTML comments
		$html = preg_replace('/[\r\n\t]+/', ' ', $html);#remove new lines, spaces, tabs
		$html = preg_replace('/&gt;[\s]+&lt;/', '&gt;&lt;', $html);#remove new lines, spaces, tabs
		$html = preg_replace('/[\s]+/', ' ', $html);#remove new lines, spaces, tabs
		if(!empty($pre[0]))
			foreach($pre[0] as $tag)
				$html = preg_replace('!#pre#!', $tag, $html,1);#putting back pre|code tags
		return $html;
	}
?>