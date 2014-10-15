 <?php
	require_once('../recaptcha/recaptchalib.php');
	include_once('../accounts/main.php');
	
	session_start();
	
	$privatekey = "6LcIAMwSAAAAAGbMODPNAG0JtY1lpPzN5M18tSmo";
	
	$errors_on_join = 0;

	$cexpire = time()+240;
	
	setcookie("judfail", "", $cexpire, "/");
	setcookie("judcapwrong", "0", $cexpire, "/");
	
	if(isset($_POST['qcnafname'])) setcookie("judqcnafname", $_POST['qcnafname'], $cexpire, "/");
	if(isset($_POST['qcnalname'])) setcookie("judqcnalname", $_POST['qcnalname'], $cexpire, "/");
	if(isset($_POST['qcnaemail'])) setcookie("judqcnaemail", $_POST['qcnaemail'], $cexpire, "/");
	if(isset($_POST['qcnainvi']))  setcookie("judqcnainvi", $_POST['qcnainvi'], $cexpire, "/");

	$jfname = $_POST['qcnafname'];
	$jlname = $_POST['qcnalname'];
	$jemail = $_POST['qcnaemail'];
	$jinvi  = $_POST['qcnainvi'];
	$jpass  = $_POST['qcnapass'];
	$jcpass = $_POST['qcnacpass'];
	
	$jfname = validate_human_name($jfname);
	if($jfname == '0') jvalidate_fail("First name seems to have some issues.");
	
	$jlname = validate_human_name($jlname);
	if($jlname == '0') jvalidate_fail("Last name seems to have some issues.");
	
	if(!filter_var($jemail, FILTER_VALIDATE_EMAIL)) jvalidate_fail("Invalid Email Address.");
	
	if(strlen($jpass) < 6) jvalidate_fail("Password too short.");
	if($jcpass != $jpass) jvalidate_fail("Passwords don't match");
	
	$ist = new account_main();
	$eivalidvar = $ist->validate($jemail, $jinvi);
	
	if($eivalidvar != 1)
	{
		if($eivalidvar == 2) jvalidate_fail("There's an existing accout associated with this email address.");
		else if($eivalidvar == 3) jvalidate_fail("Your invitation code is invalid");
		else if($eivalidvar == 4) jvalidate_fail("Your invitation code has been used before");
	}
	
	/*
	$resp = recaptcha_check_answer ($privatekey,
							$_SERVER["REMOTE_ADDR"],
							$_POST["recaptcha_challenge_field"],
							$_POST["recaptcha_response_field"]);

	if(!$resp->is_valid)
	{
		setcookie("judcapwrong", "1", $cexpire, "/");
		$errors_on_join = 1;
	}else{
		setcookie("judcapwrong", "0", $cexpire, "/");
	} */
	
	if($errors_on_join == 1)
		header( 'Location: ../../new'); 
		
		
	/* everything seems right */

	//session_register('judvfname');
	//session_register('judvlname');
	//session_register('judvemail');
	//session_register('judvpass');
	//session_register('judvinvi');
	
	psession_set('judvfname', $jfname);
	psession_set('judvlname', $jlname);
	psession_set('judvemail', $jemail);
	psession_set('judvpass', $jcpass);
	psession_set('judvinvi', $jinvi);
	psession_set('judconfirmed', 1);
	
	
	
	
	$_SESSION['judvfname'] = $jfname;
	$_SESSION['judvlname'] = $jlname;
	$_SESSION['judvemail'] = $jemail;
	$_SESSION['judvpass']  = $jcpass;
	$_SESSION['judvinvi']  = $jinvi;
	
	//session_register('judconfirmed');
	$_SESSION['judconfirmed'] = 1;
	
	header( 'Location: ../../new'); 

	
	die();
		
		
	function jvalidate_fail($er)
	{
		$errors_on_join == 1;
		setcookie("judfail", $er, $cexpire, "/");
		header( 'Location: ../../new'); 
		die();
	}
		
		
	function validate_human_name($name)
	{
		$r = trim($name);
		
		if(strlen($r) < 1) return 0;
		
		if(preg_match("/[0-9\^<,\"@\/\{\}\(\)\*\$%\?=>:\|;#]+/i", $r)) return 0;
		if(strstr($r, "--")) return 0;
		if(strstr($r, "''")) return 0;
		if(strstr($r, " - ")) return 0;
		if(strstr($r, "- ")) return 0;
		if(substr($r, 0, 1) == '-') return 0;
		
		if(preg_match_all('/[A-Z]/', $r, $treffer) > 3) return 0;
		
		/* check if there are any repeating letters */
		if(strlen($r) > 3)
		{
			$len = strlen($r);
			$ll = '0';
			$oc = 0;
			$lr = strtolower($r);
			
			
			for($i=0; $i<$len; $i++)
			{
				$cc = substr($lr, $i, 1);
				if($cc == $ll)
				{
					$oc++;
					if($oc > 1) return 0;
				}else{
					$oc = 0;
					$ll = $cc;
				}
			}
		}
	
		$r = ucwords($r);
		return $r;
	}
?>