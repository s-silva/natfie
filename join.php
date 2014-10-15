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
		header( 'Location: index.php' );
		
	}else{
	
		if(isset($_SESSION['judconfirmed']) && $_SESSION['judconfirmed'] == 1)
		{
			$capwrong = 0;
			$initw = "";
			$capstyle = "";
			
			if(isset($_COOKIE['judcapwrong'] )) {if($_COOKIE['judcapwrong'] == '1') $capwrong = 1;}
			
			if($capwrong)
			{
				$initw = "The security letters were not typed correctly. Please try again.";
				$capstyle = "style='border-color: #ff9797;'";
			}
			
			
			$page = join("", file("templates/new account/main.html"));
			$childpage = join("", file("templates/new account/step2.html"));
			
			$page = str_replace("<data.join.box>", $childpage, $page);
			
			$page = str_replace("<data.join.initwarning>", $initw, $page);
			$page = str_replace("<data.join.captchastyle>", $capstyle, $page);
		
			$page = str_replace("<data.join.sid>",  "", $page);
			
		}else{
		
			$aqcnafname = "";
			$aqcnalname = "";
			$aqcnaemail = "";
			$aqcnainvi  = "";
			$capwrong = 0;
			$initw = "";
			$capstyle = "";
			
			if(isset($_COOKIE['judqcnafname'])) $aqcnafname = $_COOKIE['judqcnafname'];
			if(isset($_COOKIE['judqcnalname'])) $aqcnalname = $_COOKIE['judqcnalname'];
			if(isset($_COOKIE['judqcnaemail'])) $aqcnaemail = $_COOKIE['judqcnaemail'];
			if(isset($_COOKIE['judqcnainvi'] )) $aqcnainvi  = $_COOKIE['judqcnainvi'] ;
			
			if(isset($_COOKIE['judcapwrong'] )) {if($_COOKIE['judcapwrong'] == '1') $capwrong = 1;}
			
			if($capwrong)
			{
				$initw = "The security letters were not typed correctly. Please try again.";
				$capstyle = "style='border-color: #ff9797;'";
			}else{
				if(isset($_COOKIE['judfail']))
					$initw = $_COOKIE['judfail'];
			}
			
			if(isset($_POST['invitation']))
				$aqcnainvi = $_GET['invitation'];	
			
			$page = join("", file("templates/new account/main.html"));
			$childpage = join("", file("templates/new account/invitation.html"));
			
			$page = str_replace("<data.join.box>", $childpage, $page);
			
			$page = str_replace("<data.join.initwarning>", $initw, $page);
			$page = str_replace("<data.join.captchastyle>", $capstyle, $page);
			
			$page = str_replace("<data.join.userfname>", $aqcnafname, $page);
			$page = str_replace("<data.join.userlname>", $aqcnalname, $page);
			$page = str_replace("<data.join.useremail>", $aqcnaemail, $page);
			$page = str_replace("<data.join.userinvi>",  $aqcnainvi, $page);
			
			$_SESSION['ff'] = "afsfa";
			$page = str_replace("<data.join.sid>",  "", $page);
			
			
			
			$v = "";
			for ($i=1; $i<=31; $i++) $v .= "<option value='$i'>$i</option>";
			$page = str_replace("<data.join.days>",  $v, $page);
			
			$v = "";
			for ($i=2006; $i>=1900; $i=$i-1) $v .= "<option value='$i'>$i</option>";
			$page = str_replace("<data.join.years>",  $v, $page);
		}
		
				
		
		
		echo $page;
	}
?>