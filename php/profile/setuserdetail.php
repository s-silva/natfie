<?php
	//session_start();
	
	include("../../clogin.php"); 

	$log = new logmein(); 
	
	
	
	if(isset($_GET['udd1']))
	{
	
	
		$d    = $_SESSION['uid'];
		
		$detailid   = $_GET['udid'];
		$type       = $_GET['udtype'];
		$data1      = $_GET['udd1'];
		$data2      = $_GET['udd2'];
		$data3      = $_GET['udd3'];
		$idata1     = $_GET['udid1'];
		$idata2     = $_GET['udid2'];
		$idata3     = $_GET['udid3'];
		$idata4     = $_GET['udid4'];
		$idata5     = $_GET['udid5'];
		
		
		
		$resud = $log->qry("select * from userdetails_$d where detailid=$detailid;", $log->username_logon, $log->password_logon);
		$success = mysql_fetch_assoc($resud);
		
		

		if(empty($success['detailid']))
		{
			$res = $log->qry("INSERT INTO userdetails_".$d." (type,data1,data2,data3,idata1,idata2,idata3,idata4,idata5) VALUES ('$type','$data1','$data2','$data3','$idata1','$idata2','$idata3','$idata4','$idata5');", $log->username_logon, $log->password_logon);
			echo "new $detailid";
		}else{
			$res = $log->qry("UPDATE userdetails_$d SET data1='$data1', data2='$data2', data3='$data3', idata1='$idata1', idata2='$idata2', idata3='$idata3', idata4='$idata4', idata5='$idata5' WHERE detailid='$detailid';", $log->username_logon, $log->password_logon);
			echo "update $detailid";
		} 

	}
	
?>