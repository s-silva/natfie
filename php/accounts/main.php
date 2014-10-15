<?php
	
	include_once("../../settings.php");
	
	class account_main
	{

		var $hostname_logon = "";
		var $database_logon = "";
		var $username_logon = "";
		var $password_logon = "";
		
		function __construct()
		{
			$this->hostname_logon = settings::$mysql_hostname;
			$this->database_logon = settings::$mysql_database;
			$this->username_logon = settings::$mysql_username;
			$this->password_logon = settings::$mysql_password;
			
			$connections = mysql_connect($this->hostname_logon, $this->username_logon, $this->password_logon) or die ('Unabale to connect to the database');
			mysql_select_db($this->database_logon) or die ('Unable to select database!');
		}
		
		/*
		 * 1 = valid;
		 * 2 = error on email
		 * 3 = error on invitation code
		 * 4 = error on invitation code: used
		 */
		 
		function validate($email, $invi)
		{
			$res = $this->qry("select used from joininvitations where genid='$invi'", $this->username_logon, $this->password_logon);
			$row = mysql_fetch_array($res);
			
			if(!$row) return 3; /* invalid invitation code */
			if($row['used'] == 1) return 4; /* invalid invitation code: used */
			
			
			$res = $this->qry("select userid from logon where useremail='$email'", $this->username_logon, $this->password_logon);
			$row = mysql_fetch_array($res);
			
			if($row) return 2; /* email exists */
			
			return 1;
		}
	
		
		function create($fname, $lname, $email, $pass, $type, $invi)
		{
			$pass = md5($pass."nfsp");
			$res = $this->qry("select userid from logon where useremail='$email'", $this->username_logon, $this->password_logon);
			$row = mysql_fetch_array($res);
			
			if($row) return false; /* email exists */
			
			$this->qry("insert into logon (username, useremail, password, userlevel, lastname, rememberkey, rememberi) values ('$fname', '$email', '$pass', '$type', '$lname', '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);

			$res = $this->qry("select userid from logon where useremail='$email'", $this->username_logon, $this->password_logon);
			$row = mysql_fetch_array($res);
			
			
			$this->user_init($row['userid']);
			
			/* cancel invitation */
			$res = $this->qry("update joininvitations set used=1, useruser=".$row['userid']." where genid='$invi'", $this->username_logon, $this->password_logon);
			
			return true;
		}
		
		function user_init($userid)
		{
			$this->qry("insert into notifications values ($userid, 0, 0, 0, 0, 0);", $this->username_logon, $this->password_logon);
			$this->qry("insert into userdetails (userid) values ($userid);", $this->username_logon, $this->password_logon);
			
			$this->qry("DROP TABLE IF EXISTS userdetails_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE userdetails_".$userid." (
						detailid         int not null primary key auto_increment,
						type             int not null,
						data1      		 varchar(128),
						data2            varchar(128),
						data3            varchar(128),
						idata1           int,
						idata2           int,
						idata3           int,
						idata4           int,
						idata5           int
						);",
						$this->username_logon, $this->password_logon);
		
			/*
				connectionid - just an id
				special      - special relationship, 0 - friend, 1 - partner, 2 - mother, 3 - father, 4 - sister, 5 - brother, 6 - grandmother, 7 - grandfather, 8 - daughter, 9 - son, 10 - granddaughter, 11 - grandson, 12 - cousin, 13 - relative
				frienduserid - numeric user id of the friend
				since        - friendship since (auto)
				rating1      - various ratings
				rating2     
				rating3     
				through      - friendship through which friend (numeric user id)
				description  - tag the friend
				nick         - nickname
			*/
						
			$this->qry("DROP TABLE IF EXISTS userfriends_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE userfriends_".$userid." (
				connectionid     int not null primary key auto_increment,
				special          int not null,
				frienduserid     int,
				since            datetime,
				rating1          int,
				rating2          double,
				rating3          int,
				through          int,
				description      varchar(128),
				nick             varchar(128),
				category         int
				);",
				$this->username_logon, $this->password_logon);
				
			/*
			 * notificationid - id
			 * maintype       - where the notification belongs to
			 
								1. friendship requests.
								2. message
								3. tag
								4. invite (event)
								5. general notification
								
			 * type           - type
			 
								1. friendship request
								2. friendship suggestion
								3. post
								4. comment on a post.
								5. like/mark a post.
								6. like/mark a comment.
								
								
			 * fromuser       - user id of whom sending it
			 * time           - time of the notification
			 * text           - notification text
			 * datatype       - destination data type
			 
								1. text post
								2. comment
								3. link
								4. photo
								5. activity
								
			 * ddata          - data location detail 1
			 * ddata2         - data location detail 2
			 * ddatapath      - data location details in text
			 * viewed         - viewed by the user or not
			 */
			 
			$this->qry("DROP TABLE IF EXISTS usernotifications_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE usernotifications_".$userid." (
				notificationid   int not null primary key auto_increment,
				maintype         int not null,
				type             int,
				fromuser         int,
				time             datetime,
				text             varchar(128),
				datatype         int,
				ddata            int,
				ddata2           int,
				ddatapath        varchar(128),
				viewed           int
				);",
				$this->username_logon, $this->password_logon);
			
				/*
			 * subscriptions
             *
			 * id
			 * since
			 * rating1
			 * rating2
			 * rating3
			 */
			
			$this->qry("DROP TABLE IF EXISTS usersubscriptions_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE usersubscriptions_".$userid." (
				usersubscriptionid  int not null primary key auto_increment,
				id                  int not null,
				since               datetime,
				category            int,
				rating1             int,
				rating2             double,
				rating3             int
				);",
				$this->username_logon, $this->password_logon);
				
			

			/*
			 * subscribers
             * 
			 * id
			 * since
			 */
			 
			$this->qry("DROP TABLE IF EXISTS usersubscribers_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE usersubscribers_".$userid." (
				usersubscriberid   int not null primary key auto_increment,
				id       		   int not null,
				since              datetime
				);",
				$this->username_logon, $this->password_logon);
				
						
			/*
			 * conversations
             * 
			 * id
			 * 
			 * active            - conversation is active or not
			 * start line id     - this user joins from which line
			 * 
			 * room id           - identifiers to the conversation data
			 * starting user id
			 * signature         - some junk signature
			 *
			 * new message count
			 * latest message id
			 *
			 * refresh           - non-zero if no browser has picked the conversation up
			 *
			 */
			 
			$this->qry("DROP TABLE IF EXISTS conversationsin_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE conversationsin_".$userid." (
				id                  int not null primary key auto_increment,
				active              int,
				startline           int,
				roomid              varchar(128),
				startinguid         int,
				signature 			varchar(128),
				newmsgs             int,
				latestmsgid         int
				);",
				$this->username_logon, $this->password_logon);
				
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
		
		
		function qry($query)
		{

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
	}
?>