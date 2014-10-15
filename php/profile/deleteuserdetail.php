<?php
	//session_start();
	
	include("../../clogin.php"); 

	$log = new logmein(); 
	
	if(isset($_GET['udid']))
	{

		$d    = $_SESSION['uid'];
		$detailid   = $_GET['udid'];
		
		$resud = $log->qry("delete from userdetails_$d where detailid=$detailid;", $log->username_logon, $log->password_logon);
	}
	
?>