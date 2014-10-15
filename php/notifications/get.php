<?php
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/notifications/translate.php");
	
	
	if($_GET['id'] == 1)
	{
		$result = basics::get_latest_notifications_grouped(10, basics::nmtype_friends);	
		$sndata = "";
		$ntfli = 0;
		
		while($row = mysql_fetch_assoc($result))
		{
			$sndata = ntf_translate($ntfli, $row['maintype'],  $row['type'],  $row['fromuser'],  $row['time'],  $row['text'],  $row['datatype'],  $row['ddata'],  $row['ddata2'],  $row['ddatapath'],  $row['viewed']).$sndata;
			
			$ntfli++;
		}
		
		echo $sndata;
		
	}else if($_GET['id'] == 2){
	
		$result = basics::get_latest_notifications_grouped(20, basics::nmtype_message);	
		$sndata = "";
		$ntfli = 0;
		
		while($row = mysql_fetch_assoc($result))
		{
			$sndata = ntf_translate($ntfli, $row['maintype'],  $row['type'],  $row['fromuser'],  $row['time'],  $row['text'],  $row['datatype'],  $row['ddata'],  $row['ddata2'],  $row['ddatapath'],  $row['viewed']).$sndata;
			
			$ntfli++;
		}
		
		echo $sndata;
		
	}else if($_GET['id'] == 5){
	
		$result = basics::get_latest_notifications_grouped(20, basics::nmtype_general);	
		$sndata = "";
		$ntfli = 0;
		
		while($row = mysql_fetch_assoc($result))
		{
			$sndata = ntf_translate($ntfli, $row['maintype'],  $row['type'],  $row['fromuser'],  $row['time'],  $row['text'],  $row['datatype'],  $row['ddata'],  $row['ddata2'],  $row['ddatapath'],  $row['viewed']).$sndata;
			
			$ntfli++;
		}
		
		echo $sndata;
		
	}else{
	
		echo "";
	}
?>