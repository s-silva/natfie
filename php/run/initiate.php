<?php

	//error_reporting(0);
	include_once("../../settings.php");
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/tools/idnumber.php"); 
	
	
	class initiatesite
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
		
		
		function init_details()
		{
			$connections = mysql_connect($this->hostname_logon, $this->username_logon, $this->password_logon) or die ('Unabale to connect to the database');
			
			mysql_query("CREATE DATABASE cards", $connections);
			
			mysql_select_db($this->database_logon) or die ('Unable to select database!');
			
			$this->qry("DROP TABLE IF EXISTS userdetails;", $this->username_logon, $this->password_logon);
			
			$this->qry("CREATE TABLE userdetails (
						userid           INT,
						description      VARCHAR(128),
						motto            VARCHAR(128),
						livesin          VARCHAR(250),
						hometown         VARCHAR(250),
						birth_year       INT,
						birth_month      INT,
						birth_day        INT,
						gender           INT,
						mood             VARCHAR(128),
						listening_to     VARCHAR(128),
						reading          VARCHAR(128),
						relationship     VARCHAR(128),
						ilike            VARCHAR(128),
						interestedin     VARCHAR(128),
						goaloflife       VARCHAR(128),
						upfor            VARCHAR(128),
						aboutme          TEXT,
						music            TEXT,
						movies           TEXT,
						tvshows          TEXT,
						books            TEXT,
						idols            TEXT,
						quiz             TEXT,
						quotes           TEXT,
						relationshipuser		int, 
						relationshipsince		datetime, 
						relationshipmode 		int, 
						relationshipaccepted 	int, 
						);",
						$this->username_logon, $this->password_logon);

			
			
			$this->qry("DROP TABLE IF EXISTS logon;", $this->username_logon, $this->password_logon);
			
			/*
				accountmode - active, deactivated, to be deleted
				lockedlevel - 1 if login needs captcha (3 try lock)
			*/
			
			$this->qry("CREATE TABLE logon (
						userid           int not null primary key auto_increment,
						username         varchar(30) not null,
						useremail        varchar(50) not null,
						password         varchar(50) not null,
						userlevel        int(1) not null,
						lastname         varchar(128) not null,
						rememberkey      varchar(128) not null,
						rememberi        int not null,
						accountmode		 int,
						lockedlevel      int
						);",
						$this->username_logon, $this->password_logon);
						
						
			$this->qry("DROP TABLE IF EXISTS notifications;", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE notifications (
						userid           int not null,
						friendships      int,
						messages         int,
						tags             int,
						events           int,
						general          int
						);",
						$this->username_logon, $this->password_logon);
						
			$this->qry("DROP TABLE IF EXISTS conversations;", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE conversations (
						roomid           int not null primary key auto_increment,
						startinguserid   int,
						signature       varchar(128)
						);",
						$this->username_logon, $this->password_logon);
						
						
			/*
			 * user environment
			 * - attributes of the user's current environment. not settings.
			 * 
			 * id           - default auto increment
			 * uid          - user id
			 * availability - 0 - offline
			 *				  1 - online
			 *                2 - busy
			 *                3 - away
			 *                4 - hidden
			 *                
			 * croomid      - current room id
			 * lastmsgtime  - time of the last received message of the current room
			 *				  will be used for syncronization purposes.
			 *
			 * roomvalid    - room data is valid/1 - if there's an open room
			 */
			 
			$this->qry("DROP TABLE IF EXISTS userenv;", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE userenv (
						id                int not null primary key auto_increment,
						uid               int,
						availability      int,
						croomid           int,
						lastmsgtime       datetime,
						roomvalid         int
						);",
						$this->username_logon, $this->password_logon);
						
			 
			 /*
			 * user settings
			 *
			 *	filter_mode = 0 means show everything, else it's taken as binary switches.
			 *
			 */
			 
			$this->qry("DROP TABLE IF EXISTS usersettings;", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE usersettings (
						id                int not null primary key auto_increment,
						uid               int,
						filter_search     varchar(128),
						filter_search_do  int,
						filter_arrange	  int,
						filter_mode       int,
						filter_view       varchar(16),
						filter_network    int,
						filter_geo        int,
						style_main        int,
						style_sub         int,
						dp_x              int,
						dp_y              int,
						long_background   int,
						blog_enable       int,
						blog_name         varchar(128),
						blog_dsc          varchar(255),
						blog_theme        varchar(128),
						blog_theme_id     int
						);",
						$this->username_logon, $this->password_logon);
						
			
						
			/*
			 * rememberkey = key for cookies, for more security and ability to
			 *     			 "forget me from all logged on systems".
			 * rememberi   = some iteration for the key since the 'rememberkey' could' 
			 *               repeat the same key when trying to generate a new one.
			 *			     yes rare, but possible.
			 */
						

			/*
			
			Angle     Keasler
			Francie   Shapiro
			Brittani  Collinson
			Darcel    Skelley
			Pearlene  Hacker
			Carlita   Peppers
			Edyth     Myler
			Jennell   Crooker
			Sophia    Huff
			Willodean Parodi
			Roselia   Shuey
			Cierra    Ang
			Johnsie   Sondag
			Sharon    Levy
			Becky     Everett
			Lori      Bliss
			Pauline   Koon
			Georgia   Galvin
			Jenny     Kao
			*/
			$this->qry("insert into logon values (1, 'Chase', 'c-h@users.sf.net', '123', '1', 'H', '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (2, 'Emily', 'emily@cards.com', '123', '1', 'Northwood', '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (3, 'Tony', 'tony@skins.com', '123', '1', 'Stonem', '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);

			$this->qry("insert into logon values (4,  'Angle',     'angle@cards.com',     '123', '1', 'Keasler',   '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (5,  'Francie',   'francie@cards.com',   '123', '1', 'Shapiro',   '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (6,  'Brittani',  'brittani@cards.com',  '123', '1', 'Collinson', '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (7,  'Darcel',    'darcel@cards.com',    '123', '1', 'Skelley',   '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (8,  'Pearlene',  'pearlene@cards.com',  '123', '1', 'Hacker',    '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (9,  'Carlita',   'carlita@cards.com',   '123', '1', 'Peppers',   '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (10, 'Edyth',     'edyth@cards.com',     '123', '1', 'Myler',     '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (11, 'Jennell',   'jennell@cards.com',   '123', '1', 'Crooker',   '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (12, 'Sophia',    'sophia@cards.com',    '123', '1', 'Huff',      '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (13, 'Willodean', 'willodean@cards.com', '123', '1', 'Parodi',    '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (14, 'Roselia',   'roselia@cards.com',   '123', '1', 'Shuey',     '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (15, 'Cierra',    'cierra@cards.com',    '123', '1', 'Ang',       '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (16, 'Johnsie',   'johnsie@cards.com',   '123', '1', 'Sondag',    '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (17, 'Sharon',    'sharon@cards.com',    '123', '1', 'Levy',      '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (18, 'Becky',     'becky@cards.com',     '123', '1', 'Everett',   '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (19, 'Lori',      'lori@cards.com',      '123', '1', 'Bliss',     '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (20, 'Pauline',   'pauline@cards.com',   '123', '1', 'Koon',      '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (21, 'Georgia',   'georgia@cards.com',   '123', '1', 'Galvin',    '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			$this->qry("insert into logon values (22, 'Jenny',     'jenny@cards.com',     '123', '1', 'Kao',       '".$this->generate_bulk(64)."', 1);", $this->username_logon, $this->password_logon);
			
			
			for($j=1; $j<=22; $j++)
			{
				$this->user_init($j);
			}
			echo "done";
		}
		
		/*
		 * pass the numeric id here
		 */
		function user_init($userid)
		{
			$this->qry("insert into notifications values ($userid, 0, 0, 0, 0, 0);", $this->username_logon, $this->password_logon);
			$this->qry("insert into userdetails (userid) values ($userid);", $this->username_logon, $this->password_logon);
			$this->qry("insert into userenv (uid, availability, croomid, lastmsgtime, roomvalid) values ($userid, 1, 0, 0, 0);", $this->username_logon, $this->password_logon);
			$this->qry("insert into usersettings (uid, filter_search, filter_search_do, filter_arrange, filter_mode, filter_view, filter_network, filter_geo, style_main, style_sub, dp_x, dp_y, long_background, bk_y, blog_enable, blog_name, blog_dsc, blog_theme, blog_theme_id) values ($userid, '', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0);", $this->username_logon, $this->password_logon);
			
			
			
			
			
			
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
				rating2          int,
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
				
				
				
			/* ---------------------------------- POSTS ----------------------------- */
			
			
			
			
			
			
			/*
			 * posts
             * 
			 * id
			 * uid          - who wrote the post
			 * ptype        - post type
			 *		           1 - general post
			 *                 2 - tag
			 *				   3 - reposts
			 * opid         - original post id (if it's a tagged/reposted post, the opid will be the user id of the author, div1 will be the post id and div2 will be the very next reposter's uid)
			 * utype        - user type, for now just 1 or 0 for personal accounts
			 * visibility   - visibility mode, just 0 for hidden and 1 for visible at the moment
			 * reports      - reportings, if it gets much reportings the user will forced to remove it
			 * rating1      - different ratings, will be described later.
			 * rating2
			 * rating3
			 * rating4
			 *
			 * wtime        - written/created time of the post
			 * ltime        - last accessed time of the post (viewed)
			 * mtime        - last modified time
			 * rtime        - last reception time (last time when somebody made a comment etc.)
			 *
			 * type         - post type
			 *                 1 - text
			 *                 2 - photo
			 *                 3 - video
			 *                 4 - audio
			 *                 5 - link
			 *                 6 - commented
			 *				   7 - marked
			 *				   8 - friendship
			 *				   9 - relationship
			 *                 10 - new profile picture
			 *				   11 - changes
			 *                 12 - blog article
			 *
			 * mode         - just some settings on the post size etc.
			 * mode2        - more details
			 *
			 * ctext        - text content of the post user tags will go as [[@user id alpha, f/m/l/0/1/2]]
			 *		        	if the user name is John Little Smith
			 *		        	f = John
			 *                  m = Little
			 *		        	l = Smith          
			 *		        	0 - John Little Smith
			 *		        	1 - John Smith
			 *		        	2 - Little Smith
			 *
			 * dtext        - data text, for links this will work as the url
			 * div1         - int value, photos, it's the album id
			 * div2         - for photos, it's the photo id etc.
			 * 
			 * tagcid       - tag content table it for the post (extra tagged people in the post)
			 * markcid      - mark content table id (the marks with post id 0 will be the marks for the post)
			 * talkcid      - comment section content table id
			 * repostscid   - details about reposts made (link to a table)
			 *
			 * repostcount  - how many reposts have made
			 * 
			 * remotehost   - details about the remote host if it's originated in another site
			 * remotehostd1 - data
			 * remotehostd2
			 * remotehostd3 
			 *
			 * privacymode
			 * filtergroup
			 *
			 * loc_used     - will be 1 if location data is present.
			 *
			 */
			 
			$this->qry("DROP TABLE IF EXISTS posts_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE posts_".$userid." (
				id			  int not null primary key auto_increment,
				uid           int,
				ptype         int,	
				opid          int,
				utype         int,
				visibility    int,
				reports       int,
				rating1       int,
				rating2		  int,
				rating3		  int,
				rating4		  int,
				wtime         datetime,
				ltime         datetime,
				mtime         datetime,
				rtime         datetime,
				type          int,
				mode          int,
				mode2         int,
				ctext         text,
				dtext         varchar(2048),
				div1          int,
				div2          int,
				allowresponse int,
				tagcid        int,
				markcid       int,
				talkcid       int,
				repostscid    int,
				repostcount   int,
				remotehost    int,
				remotehostd1  int,
				remotehostd2  int,
				remotehostd3  varchar(255),
				privacymode   int,
				filtergroup   int,
				loc_lt		  FLOAT( 10, 6 ),
				loc_lg		  FLOAT( 10, 6 ),
				loc_name      varchar(255),
				loc_used      int
				);",
				$this->username_logon, $this->password_logon);
			
		
			/*
			 * photo albums of the user
             * 
			 * id           
			 * wtime        - created time
			 * mtime        - modified time
			 * photocount   - number of photos in the album
			 * albumtime    - time when the photos were taken
			 * postid       - general post associated with the album (for sharing, comments etc)
			 * type         - reserved. (for video albums etc.)
			 *
			 * privacymode
			 * filtergroup
			 * 
			 */
			 
			$this->qry("DROP TABLE IF EXISTS useralbums_".$userid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE useralbums_".$userid." (
				id                 int not null primary key auto_increment,
				wtime      		   datetime,
				mtime       	   datetime,
				photocount         int,
				albumtime          datetime,
				postid             int,
				type               int,
				privacymode        int,
				filtergroup        int
				);",
				$this->username_logon, $this->password_logon);
				
				
			
				
				
			$useraid = translate_locationid($userid, false, 7);
			
			mkdir("../../data/u$useraid");
			mkdir("../../data/u$useraid/dp");	
			mkdir("../../data/u$useraid/ps");
		}
		
		/* not used in initialization, just here for the sketch */
		
		function inituserpostdata($userid, $postid)
		{
			
			/*
			 * talk (comment section for a post)
			 * 
			 * id           - comment id
			 * uid       	- user id
			 * wtime        - written time
			 * mtime        - modified time
			 * atime        - last access time (marked etc.)
			 * rating1      - rating 1, positive marks
			 * rating2      - 
			 * reports      - 
			 * ctext        - content text
			 * type         - content type (photo, link etc.)
			 * resposecount - markings etc.
			 * details      - dummy data
			 *
			 */
			 
			$this->qry("DROP TABLE IF EXISTS talk_".$userid."_".$postid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE talk_".$userid."_".$postid." (
				id                 int not null primary key auto_increment,
				uid       		   int,
				wtime              datetime,
				mtime              datetime,
				atime              datetime,
				rating1            int,
				rating2            int,
				reports            int,
				ctext              text,
				type               int,
				resposecount       int,
				details            int
				);",
				$this->username_logon, $this->password_logon);
				
			/*
			 * marks (like, etc...)
             * 
			 * id    - mark id
			 * uid   - user id
			 * cid   - comment id (if it's of the post, will be zero)
			 * wtime - marked time
			 * type  - mark type
			 *
			 */
			 
			$this->qry("DROP TABLE IF EXISTS marks_".$userid."_".$postid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE marks_".$userid."_".$postid." (
				id                 int not null primary key auto_increment,
				uid       		   int,
				cid                commentid,
				wtime              datetime,
				type               int
				);",
				$this->username_logon, $this->password_logon);
				
			
		}
		
		function inituserphotoalbum($userid, $albumid)
		{
			/*
			 * a single photo album
             * 
			 * id           - id of a photot
			 * wtime        - created time
			 * mtime        - modified time
			 *
			 * title        - title text
			 * dsc          - description
			 * phototime    - time when the photo was taken
			 * postid       - general post associated with the photo (for sharing, comments etc)
			 * 
			 * privacymode
			 * filtergroup
			 * 
			 */
			 
			$this->qry("DROP TABLE IF EXISTS photoalbum_".$userid."_".$albumid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE photoalbum_".$userid."_".$albumid." (
				id                 int not null primary key auto_increment,
				wtime      		   datetime,
				mtime       	   datetime,
				title         	   varchar(255),
				dsc        		   text,
				phototime          datetime,
				phototagid         int,
				postid             int,
				privacymode        int,
				filtergroup        int
				);",
				$this->username_logon, $this->password_logon);
			
		
			/*
			 * tagging data for a photo
             * 
			 * id           - tag id (might need it)
			 *
			 * pid          - photo id of the tag
			 *
			 * ttime        - tagged time
			 * taccepted    - tag accepted by the user
			 * tuid         - tagged user id
			 * taggedbyuid  - tagged by
			 *
			 * xpos         - position in the photo
			 * ypos         - 
			 * zpos         - reserved.
			 *
			 * ttext        - tagged text
			 * mode1        - dummy data
			 * mode2        - dummy data
			 * 
			 */
			 
			$this->qry("DROP TABLE IF EXISTS phototags_".$userid."_".$albumid.";", $this->username_logon, $this->password_logon);
			$this->qry("CREATE TABLE phototags_".$userid."_".$albumid." (
				id            int not null primary key auto_increment,
				pid           int,
				ttime         datetime,
				taccepted     int,
				tuid          int,
				taggedbyuid   int,
				xpos          int,
				ypos          int,
				zpos          int,
				ttext         varchar(255),
				mode1         int,
				mode2         int
				);",
				$this->username_logon, $this->password_logon);
		
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
	
	$ist = new initiatesite();
	$ist->init_details();
?>