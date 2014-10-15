<?php
	include("clogin.php");
	$log = new logmein();
	
	if($log->autologin() == true)
	{
		header( 'Location: .' );
	}else{
		if($_REQUEST['action'] == "login")
		{
			if(isset($_POST['rememberme']))
				if($_POST['rememberme'] == "1")
					$log->allowrememberme(1);
					
			if(!$log->isloginlocked())
			{
				if($log->login("logon", $_REQUEST['username'], $_REQUEST['password']) == true)
				{
					header( 'Location: .' ) ;
				}else{
					header( 'Location: login' ) ;
				}
			}else{
				
				require_once('php/recaptcha/recaptchalib.php');

				$privatekey = "6LcIAMwSAAAAAGbMODPNAG0JtY1lpPzN5M18tSmo";
				
				$resp = recaptcha_check_answer ($privatekey,
										$_SERVER["REMOTE_ADDR"],
										$_POST["recaptcha_challenge_field"],
										$_POST["recaptcha_response_field"]);

				if($resp->is_valid)
				{
					if($log->login("logon", $_REQUEST['username'], $_REQUEST['password']) == true)
					{
						header( 'Location: .' ) ;
					}else{
						header( 'Location: login' ) ;
					}
					
				}else{
					header( 'Location: login' ) ;
				}
			}
		}
	}

?>