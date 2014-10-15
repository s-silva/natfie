<?php

	include_once("settings.php");

	$link = mysql_connect(settings::$mysql_hostname, settings::$mysql_username, settings::$mysql_password);
	@mysql_select_db('fb',$link);

?>
