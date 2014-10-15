<?php

	function psession_get($key)
	{
		if(!isset($_SESSION[$key])) return 0;
		return $_SESSION[$key];
	}
	
	function psession_set($key, $value)
	{
		$_SESSION[$key] = $value;
	}
	
	function psession_isset($key)
	{
		return isset($_SESSION[$key]);
	}
?>