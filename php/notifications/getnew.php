<?php
	include("../../clogin.php"); 

	$log = new logmein(); 
	$user_id    = $_SESSION['uid'];

	$res = $log->qry("select * from notifications where userid='$user_id'", $log->username_logon, $log->password_logon);
	$row = mysql_fetch_array($res);

	if($row)
		echo $row['friendships'].",".$row['messages'].",".$row['tags'].",".$row['events'].",".$row['general'];
	else
		echo "0,0,0,0,0";
	
?>