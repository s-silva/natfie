<?php
	include("clogin.php");
	$log = new logmein();
	
	if($log->autologin() == true)
	{
		header( 'Location: .' );
	}else{
		if($log->login("logon", "demo@cards.com", "123") == true)
		{
			header( 'Location: .' ) ;
		}else{
			header( 'Location: login' ) ;
		}
	}

?>