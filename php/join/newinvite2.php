 <?php
	require_once('../recaptcha/recaptchalib.php');
	include_once('../accounts/main.php');
	include_once('../../clogin.php');
	
	session_start();
	
	$privatekey = "6LcIAMwSAAAAAGbMODPNAG0JtY1lpPzN5M18tSmo";
	
	$cexpire = time()+240;
	
	$resp = recaptcha_check_answer ($privatekey,
							$_SERVER["REMOTE_ADDR"],
							$_POST["recaptcha_challenge_field"],
							$_POST["recaptcha_response_field"]);

	if(!$resp->is_valid)
	{
		setcookie("judcapwrong", "1", $cexpire, "/");
		header( 'Location: ../../new'); 
	}else{
		setcookie("judcapwrong", "0", $cexpire, "/");
		$ist = new account_main();
		
		$ist->create($_SESSION['judvfname'], $_SESSION['judvlname'], $_SESSION['judvemail'], $_SESSION['judvpass'], '0', $_SESSION['judvinvi']);
		
		$log = new logmein();
		$log->login("logon", $_SESSION['judvemail'], $_SESSION['judvpass']);
		
		$_SESSION['judconfirmed'] = 0;
		
		header( 'Location: ../../'); 
	}
	
?>