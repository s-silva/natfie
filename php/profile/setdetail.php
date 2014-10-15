<?php
	//session_start();
	include_once("../general/basics.php");

	
	//include("../../clogin.php"); 

	if(isset($_GET['f']) && isset($_POST['d']))
	{
		$user_id    = $_SESSION['uid'];
		$key        = $_GET['f'];
		$value      = $_POST['d'];
		
		if($key == "peipf_idols") $key = "idols";
		else if($key == "peipf_books") $key = "books";
		else if($key == "peipf_tvshows") $key = "tvshows";
		else if($key == "peipf_movies") $key = "movies";
		else if($key == "peipf_music") $key = "music";
		else if($key == "peipf_aboutme") $key = "aboutme";
		else if($key == "peipfi_upfor") $key = "upfor";
		else if($key == "peipfi_goaloflife") $key = "goaloflife";
		else if($key == "peipfi_interestedin") $key = "interestedin";
		else if($key == "peipfi_ilike") $key = "ilike";
		else if($key == "peipfi_reading") $key = "reading";
		else if($key == "peipfi_listeningto") $key = "listening_to";
		else if($key == "peipfi_mood") $key = "mood";
		else if($key == "peipfi_motto") $key = "motto";
		else if($key == "peipf_quotes") $key = "quotes";
		

		$value = trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $value)));
		$value = str_replace("?", "[-q-]", $value);
		$value = strip_tags($value, "<b><i><s>");
		$value = basics::escapestr($value);
			
		$res = basics::query("UPDATE userdetails SET ".$key."='".$value."' where userid='".$user_id."';");
		
		echo "1";
	}else{
		echo "0";
	}
	
	
?>