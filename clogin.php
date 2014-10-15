<?php
	
	include_once("settings.php");
	
	//error_reporting(0);
	session_start();
	
class logmein
{
	public $hostname_logon;
	public $database_logon;
	public $username_logon;
	public $password_logon;

    //table fields
    var $user_table = 'logon';          //Users table name
    var $user_column = 'useremail';     //USERNAME column (value MUST be valid email)
    var $pass_column = 'password';      //PASSWORD column
    var $user_level = 'userlevel';     //userlevel column
	var $user_dname = 'username';
	var $user_dlastname = 'lastname';
	var $user_id = 'userid';
	
	var $use_rememberme = 0;
	
	
    //encryption
    var $encrypt = true;    


	function __construct() {
	
		$this->hostname_logon = settings::$mysql_hostname;
		$this->database_logon = settings::$mysql_database;
		$this->username_logon = settings::$mysql_username;
		$this->password_logon = settings::$mysql_password;
	}

  
    function dbconnect(){
	
	
        $connections = mysql_connect($this->hostname_logon, $this->username_logon, $this->password_logon) or die ('Unabale to connect to the database');
        mysql_select_db($this->database_logon) or die ('Unable to select database!');
        return $connections;
    }
	
	
	function allowrememberme($value)
	{
		$this->use_rememberme = $value;
	}
	
	function forgetme()
	{
		$this->dbconnect();
		$rkey = $this->generate_bulk(64);
		$result = mysql_query("UPDATE logon SET rememberkey='$rkey', rememberi=rememberi + 1 WHERE userid='".$_SESSION['uid']."'");
	}
	
	function report_failed_login($uemail)
	{
		if(!isset($_SESSION['logintry'])) $_SESSION['logintry'] = 1;
		else $_SESSION['logintry'] += 1;
		
		return $_SESSION['logintry'];
	}
	
	function isloginlocked()
	{
	
		if(isset($_SESSION['logintry']))
		{
			if($_SESSION['logintry'] >= 3)
			{
				return 1;
			}
		}
		
		//$this->dbconnect();
		//$result = mysql_query("SELECT logon SET rememberkey='$rkey', rememberi=rememberi + 1 WHERE userid='".$_SESSION['uid']."'");

		return 0;
	}
	
	/* auto login */
	
	function autologin()
	{
		$this->dbconnect();
				
		if(isSet($_COOKIE["thetree1e90cf430f19d3f84ff315fa96ac8f03"]))
		{
		
			parse_str($_COOKIE["thetree1e90cf430f19d3f84ff315fa96ac8f03"]);

		
			$result = mysql_query("SELECT * FROM logon WHERE useremail='$usr'");
			$row = mysql_fetch_assoc($result);

			if($row == "Error") return false;
			if($row['password'] == "" || $row['rememberkey'] == "" || $row['rememberi'] == "") return false;
			
			$pwd1 = hash("sha512", $row['password']);
			$pwd2 = md5($row['rememberkey']);
			$pwd3 = $row['rememberi'];
			
			echo $pwd1."\n".$pwd2."\n".$pwd3;
			  
			if($hash1 == $pwd1 && $hash2 == $pwd2 && $hash3 == $pwd3)
			{
				$_SESSION['loggedin']    = $row[$this->pass_column];
				$_SESSION['ufirstname']  = $row[$this->user_dname];
				$_SESSION['ulastname']   = $row[$this->user_dlastname];
                $_SESSION['userlevel']   = $row[$this->user_level];
				$_SESSION['uid']         = $row[$this->user_id];
                $_SESSION['uname']       = $row['useremail'];
				$_SESSION['displaymodefeed'] = 2;
				$_SESSION['logintry']    = 0;
				return true;
			}
		}
		
		return false;
	}
		
		
	function var_set_session($name, $value)
	{
		$_SESSION[$name] = $value;
		return 1;
	}

	function var_get_session($name)
	{
		return $_SESSION[$name];
	}

	
    //login function
    function login($table, $username, $password){
       
        $this->dbconnect();
		
		
        if($this->user_table == ""){
            $this->user_table = $table;
        }
       
        if($this->encrypt == true){
            $password = md5($password."nfsp");
        }
       
		$result = $this->qry("SELECT * FROM ".$this->user_table." WHERE ".$this->user_column."='?' AND ".$this->pass_column." = '?';" , $username, $password);
		$row=mysql_fetch_assoc($result);

        if($row != "Error"){
            if($row[$this->user_column] !="" && $row[$this->pass_column] !=""){
               
                $_SESSION['loggedin'] = $row[$this->pass_column];
				$_SESSION['ufirstname'] = $row[$this->user_dname];
				$_SESSION['ulastname'] = $row[$this->user_dlastname];
                $_SESSION['userlevel'] = $row[$this->user_level];
				$_SESSION['uid'] = $row[$this->user_id];
                $_SESSION['uname'] = $username;
				$_SESSION['displaymodefeed'] = -1;
				$_SESSION['logintry']    = 0;
				
				if($this->use_rememberme)
				{
					/* set the cookie */
					
					$password_hash1 = hash("sha512", $row['password']);
					$password_hash2 = md5($row['rememberkey']);
					$password_hash3 = $row['rememberi'];
					$cookie_time = (3600 * 24 * 30); 
					setcookie("thetree1e90cf430f19d3f84ff315fa96ac8f03", 'usr='.$username.'&hash1='.$password_hash1.'&hash2='.$password_hash2.'&hash3='.$password_hash3, time() + $cookie_time);
				
					echo "done saving";
				}
                return true;
            }else{
                //session_destroy();
				$this->report_failed_login($username);
                return false;
            }
        }else{
			$this->report_failed_login($username);
            return false;
        }

    }
	
	function qryex($q)
	{
		return $this->qry($q, $this->username_logon, $this->password_logon);
	}
	
	function getmysql()
	{
		return $this->dbconnect();
	}

    //prevent injection
    function qry($query) {
      $this->dbconnect();
      $args  = func_get_args();
      $query = array_shift($args);
      $query = str_replace("?", "%s", $query);
      $args  = array_map('mysql_real_escape_string', $args);
      array_unshift($args,$query);
      $query = call_user_func_array('sprintf',$args);
      $result = mysql_query($query) or die(mysql_error());
          if($result){
            return $result;
          }else{
             $error = "Error";
             return $result;
          }
    }
	
	function escapestr($str) {
		$this->dbconnect();
		return mysql_real_escape_string($str);
	}
	
	function qryus($query) {
      $this->dbconnect();
	  $query = mysql_real_escape_string($query);
      $result = mysql_query($query) or die(mysql_error());
	  return $result;
    }

    //logout function
    function logout(){
        session_destroy();
        return;
    }

    //check if loggedin
    function logincheck($logincode, $user_table, $pass_column, $user_column){
       
        $this->dbconnect();
      
        if($this->pass_column == ""){
            $this->pass_column = $pass_column;
        }
        if($this->user_column == ""){
            $this->user_column = $user_column;
        }
        if($this->user_table == ""){
            $this->user_table = $user_table;
        }
       
        $result = $this->qry("SELECT * FROM ".$this->user_table." WHERE ".$this->pass_column." = '?';" , $logincode);
        $rownum = mysql_num_rows($result);
      
        if($rownum != "Error"){
            if($rownum > 0){
                return true;
            }else{
                return false;
            }
        }
    }

    //reset password
    function passwordreset($username, $user_table, $pass_column, $user_column){
        
        $this->dbconnect();
     
        $newpassword = $this->createPassword();

     
        if($this->pass_column == ""){
            $this->pass_column = $pass_column;
        }
        if($this->user_column == ""){
            $this->user_column = $user_column;
        }
        if($this->user_table == ""){
            $this->user_table = $user_table;
        }
      
        if($this->encrypt == true){
            $newpassword_db = md5($newpassword."nfsp");
        }else{
            $newpassword_db = $newpassword;
        }

        $qry = "UPDATE ".$this->user_table." SET ".$this->pass_column."='".$newpassword_db."' WHERE ".$this->user_column."='".stripslashes($username)."'";
        $result = mysql_query($qry) or die(mysql_error());

        $to = stripslashes($username);
        
        $illegals=array("%0A","%0D","%0a","%0d","bcc:","Content-Type","BCC:","Bcc:","Cc:","CC:","TO:","To:","cc:","to:");
        $to = str_replace($illegals, "", $to);
        $getemail = explode("@",$to);

        //send only if there is one email
        if(sizeof($getemail) > 2){
            return false;
        }else{
            //send email
            $from = $_SERVER['SERVER_NAME'];
            $subject = "Password Reset: ".$_SERVER['SERVER_NAME'];
            $msg = "

Your new password is: ".$newpassword."

";

           
            $headers = "MIME-Version: 1.0 rn" ;
            $headers .= "Content-Type: text/html; \r\n" ;
            $headers .= "From: $from  \r\n" ;

           
            $sent = mail($to, $subject, $msg, $headers);
            if($sent){
                return true;
            }else{
                return false;
            }
        }
    }

    //create random password with 8 alphanumerical characters
    function createPassword() {
        $chars = "abcdefghijkmnopqrstuvwxyz023456789";
        srand((double)microtime()*1000000);
        $i = 0;
        $pass = '' ;
        while ($i <= 7) {
            $num = rand() % 33;
            $tmp = substr($chars, $num, 1);
            $pass = $pass . $tmp;
            $i++;
        }
        return $pass;
    }

	function generate_bulk($length)
	{ 
		$chars = "abcdefghijkmnopqrstuvwxyz023456789"; 
		srand((double)microtime()*1000000); 
		$i = 0; 
		$pass = '' ; 
		while ($i <= $length) { 
			$num = rand() % 33; 
			$tmp = substr($chars, $num, 1); 
			$pass = $pass . $tmp; 
			$i++; 
		} 
		return $pass; 
	} 
		
}
?>