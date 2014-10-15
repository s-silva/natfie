<?php
	include_once("../../general/basics.php");
	
	if(!isset($_GET['p'])) die ("0");
	if(!isset($_GET['fn'])) die ("0");
	if(!isset($_GET['mn'])) die ("0");
	if(!isset($_GET['ln'])) die ("0");
	if(!isset($_GET['dsc'])) die ("0");
	if(!isset($_GET['em'])) die ("0");
	if(!isset($_GET['by'])) die ("0");
	if(!isset($_GET['bm'])) die ("0");
	if(!isset($_GET['bd'])) die ("0");
	if(!isset($_GET['gn'])) die ("0");
	
	if(basics::get_useremail_from_id($_SESSION['uid']) == "demo@cards.com") die(0);
	
	if(basics::password_hash($_GET['p']) == basics::get_cuserpassword())
	{
		$cuid = $_SESSION['uid'];
		
		$fname = "";
		$lname = "";
		$mname = "";
		$dsc = "";
		$email = "";
		$birth_year = "";
		$birth_month = "";
		$birth_day = "";
		$gender = "";

		
		$fname = basics::escapestrfull($_GET['fn']);
		$lname = basics::escapestrfull($_GET['ln']);
		$mname = basics::escapestrfull($_GET['mn']);
		$dsc = basics::escapestrfull($_GET['dsc']);
		$email = basics::escapestrfull($_GET['em']);
		
		$birth_year = basics::escapestrfull($_GET['by']);
		$birth_month = basics::escapestrfull($_GET['bm']);
		$birth_day = basics::escapestrfull($_GET['bd']);
		$gender = basics::escapestrfull($_GET['gn']);
		
		$_SESSION['ufirstname'] = $fname;
		$_SESSION['ulastname'] = $lname;
		
		basics::query("UPDATE logon SET username='$fname', lastname='$lname', useremail='$email' WHERE userid=$cuid");
		basics::query("UPDATE userdetails SET description='$dsc' WHERE userid=$cuid");
	
		basics::query("UPDATE userdetails SET birth_year=$birth_year, birth_month=$birth_month, birth_day=$birth_day, gender=$gender WHERE userid=$cuid");
		echo $birth_year;
	}else{
		echo 0;
	}
?>