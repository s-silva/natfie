<?php

 	include_once($_SERVER["DOCUMENT_ROOT"]."cards/clogin.php"); 
 	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/tools/idnumber.php"); 
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/settings.php");

class basics
{	


	const nmtype_friends = 1;
	const nmtype_message = 2;
	const nmtype_tag     = 3;
	const nmtype_event   = 4;
	const nmtype_general = 5;
	
	const ntype_friendship_request     = 1;
	const ntype_friendship_suggestion  = 2;
	const ntype_post                   = 3;
	const ntype_note                   = 4;
	const ntype_mark_a_post            = 5;
	const ntype_mark_a_note            = 6;
	const ntype_friendship_accept      = 7;
	const ntype_relationship_request_d = 8;
	const ntype_relationship_request_m = 9;
	const ntype_relationship_accept    = 10;
	const ntype_message_new            = 11;
	
	/*
	 * relationship details will be stored as a string 
	 * format: mode, user id, since, accepted or not
	 */
	
	const relationshipmode_hidden      = 0;
	const relationshipmode_single      = 1;
	const relationshipmode_dating      = 2;
	const relationshipmode_married     = 3;

	
	/* filters */
	
	const filter_search           	   = 1;
	const filter_arrange_recent        = 2;
	const filter_arrange_famous        = 3;
	const filter_arrange_closers       = 4;
	const filter_mode_everything       = 5;
	const filter_mode_text             = 6;
	const filter_mode_photos           = 7;
	const filter_mode_links            = 8;
	const filter_mode_music            = 9;
	const filter_mode_videos           = 10;
	const filter_mode_blog             = 11;
	const filter_view_collapsed        = 12;
	const filter_view_semi             = 13;
	const filter_network_natfie        = 14;
	const filter_network_twitter       = 15;
	const filter_network_facebook      = 16;
	const filter_geo_everyone          = 17;
	const filter_geo_physical          = 18;
	const filter_geo_virtual           = 19;
	const filter_geo_family            = 20;
	const filter_geo_friends           = 21;
	
	
	
	
	function init()
	{

	}

	function getmysql()
	{
		return $_SESSION['logclass']->getmysql();
	}
	
	function query($q)
	{
		
		return $_SESSION['logclass']->qryex($q);//, $_SESSION['logclass']->username_logon, $_SESSION['logclass']->password_logon);
	}
	
	function query_unsafe($q)
	{
		
		return $_SESSION['logclass']->qryus($q);//, $_SESSION['logclass']->username_logon, $_SESSION['logclass']->password_logon);
	}
	
	function table_exists($tname)
	{
		$rd = $_SESSION['logclass']->qryex("SELECT table_name FROM information_schema.tables WHERE table_schema = '".settings::$mysql_database."' AND table_name = '$tname';");
		return mysql_num_rows($rd) ? 1 : 0;
		//$val = $_SESSION['logclass']->qryex("select 1 from i$tname");
		//if($val) return 1;
	}
	
	/*
	 * should be called after an insert to get the id of inserted item
	 */
	function table_getlastitem($tname)
	{
		$resudcount = self::query("SELECT Auto_increment FROM information_schema.tables WHERE table_name='$tname' AND table_schema = DATABASE();");
		$resudcountrow = mysql_fetch_assoc($resudcount);
		
		$cid = $resudcountrow['Auto_increment'] - 1;
		
		return $cid;
	}
	
	function escapestr($s)
	{
		return $_SESSION['logclass']->escapestr($s);
	}
	
	function escapestrfull($s)
	{
		$s = trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $s)));
		$s = str_replace("?", "[-q-]", $s);
		return $_SESSION['logclass']->escapestr(strip_tags($s));
	}
	
	function unescapestr($s)
	{
		$s = str_replace("[-q-]", "?", $s);
		$s = str_replace("[-n-l-]", "<br/>", $s);
		return $s;
	}
	
	function notification_set_new($maintype, $touser)
	{
		$ntypestr = "";
		
		switch($maintype)
		{
		case self::nmtype_friends:
			$ntypestr = "friendships";
			break;
		case self::nmtype_message:
			$ntypestr = "messages";
			break;
		case self::nmtype_tag:
			$ntypestr = "tags";
			break;
		case self::nmtype_event:
			$ntypestr = "events";
			break;
		case self::nmtype_general:
			$ntypestr = "general";
			break;
		}
		
		self::query("update notifications SET $ntypestr=$ntypestr+1 where userid='".$touser."'");
		return true;
	}

	function notification_set($maintype, $type, $touser, $dataset)
	{
		$ntext = "";
		$cuid = $_SESSION['uid'];
		
		switch($maintype)
		{
		case basics::nmtype_friends:
			switch($type)
			{
			case basics::ntype_friendship_request:
				$ntext = "sent you a friendship request.";
				self::query("INSERT INTO usernotifications_$touser (maintype, type, fromuser, time, text, viewed) values ($maintype, $type, $cuid, UTC_TIMESTAMP(), '$ntext', 0)");
				break;
				
			case basics::ntype_friendship_accept:
				$ntext = "is friends with you now.";
				self::query("INSERT INTO usernotifications_$touser (maintype, type, fromuser, time, text, viewed) values ($maintype, $type, $cuid, UTC_TIMESTAMP(), '$ntext', 0)");
				break;
				
			case basics::ntype_friendship_suggestion:
				$ntext = "suggests ".$this->get_user_tag($dataset[0])." as friends.";
				break;
				
			case basics::ntype_relationship_request_d:
				$ntext = "sent you a relationship request.";
				self::query("INSERT INTO usernotifications_$touser (maintype, type, fromuser, time, text, viewed) values ($maintype, $type, $cuid, UTC_TIMESTAMP(), '$ntext', 0)");
				break;
				
			case basics::ntype_relationship_request_m:
				$ntext = "sent you a friendship request [Marriage].";
				self::query("INSERT INTO usernotifications_$touser (maintype, type, fromuser, time, text, viewed) values ($maintype, $type, $cuid, UTC_TIMESTAMP(), '$ntext', 0)");
				break;
			}
			break;
			
		case basics::nmtype_general:
			switch($type)
			{
			case basics::ntype_note:	

				$ntext = "left a note on your post.";
				self::query("INSERT INTO usernotifications_$touser (maintype, type, fromuser, time, text, viewed, ddata, ddata2) values ($maintype, $type, $cuid, UTC_TIMESTAMP(), '$ntext', 0, ".$dataset[0].", ".$dataset[1].")");
				
				break;
				
			case basics::ntype_mark_a_post:
				switch($dataset[2])
				{
				case 1:
					$ntext = "likes your post.";
					break;
				case 2:
					$ntext = "thinks your post is confusing.";
					break;
				case 3:
					$ntext = "thinks your post is cool.";
					break;
				case 4:
					$ntext = "is laughing to your post.";
					break;
				case 5:
					$ntext = "loves your post.";
					break;
				default:
					$ntext = "marked your post.";
					break;
				}
				
				self::query("INSERT INTO usernotifications_$touser (maintype, type, fromuser, time, text, viewed, ddata) values ($maintype, $type, $cuid, UTC_TIMESTAMP(), '$ntext', 0, ".$dataset[0].")");
				break;
			}
			break;
			
		case basics::nmtype_message:
			$ntext = "sent you a message.";
			self::query("INSERT INTO usernotifications_$touser (maintype, type, fromuser, time, text, viewed, ddata, ddatapath) values ($maintype, $type, $cuid, UTC_TIMESTAMP(), '$ntext', 0, ".$dataset[0].", '".$dataset[1]."')");
			break;
		}
	
	
		basics::notification_set_new($maintype, $touser);
		return 1;
	}
	
	function friend_request_add($touser)
	{
		if($touser == $_SESSION['uid']) return "Cheer it up, at least we love you. :)";
		
		/* check the friend id on own subscriptions list for any previous attempt */
		
		if(self::isfriend($touser) == 1) return "You're already friends.";
		
		$result = self::query("select id from usersubscriptions_".$_SESSION['uid']." where id=$touser");
		if(mysql_num_rows($result) > 0) return "You've already sent a friendship request.";

		/* add into own subscriptions list and the corresponding user's subscribers list */
		
		self::query("INSERT INTO usersubscriptions_".$_SESSION['uid']." (id, since, category, rating1) values ($touser, UTC_TIMESTAMP(), 0, 0)");
		self::query("INSERT INTO usersubscribers_$touser (id, since) values (".$_SESSION['uid'].", UTC_TIMESTAMP())");
		
		basics::notification_set(basics::nmtype_friends, basics::ntype_friendship_request, $touser, 0);
		return "The friendship request has been sent.";
	}
	
	/*
	 * just delete the notification, do nothing
	 */
	function friend_request_delete($fuser)
	{
		self::query("DELETE FROM usernotifications_".$_SESSION['uid']." WHERE fromuser=$fuser");
	}
	
	
	function friend_request_accept($fuser)
	{
		if($fuser == $_SESSION['uid']) return ""; /* what?? */
		
		/* check if they've subscribed */
		
		$result = self::query("select id from usersubscribers_".$_SESSION['uid']." where id=$fuser");
		if(mysql_num_rows($result) == 0) return ""; /* not requested */
		
		/* check if already a friend */
		
		$result = self::query("select frienduserid from userfriends_".$_SESSION['uid']." where frienduserid=$fuser");
		if(mysql_num_rows($result) > 0) return ""; /* not requested */
		
		/* add the person as a friend */
		
		self::query("INSERT INTO userfriends_".$_SESSION['uid']." (special, frienduserid, since, rating1, through, description, nick, category) values (1, $fuser, UTC_TIMESTAMP(), 0, 0, '', '', 0)");
		self::query("INSERT INTO userfriends_$fuser (special, frienduserid, since, rating1, through, description, nick, category) values (1, ".$_SESSION['uid'].", UTC_TIMESTAMP(), 0, 0, '', '', 0)");

		/* remove the notification */
		
		basics::friend_request_delete($fuser);

		/* remove from subscriptions and subscribers lists*/
		
		self::query("DELETE FROM usersubscriptions_".$_SESSION['uid']." WHERE id=$fuser");
		self::query("DELETE FROM usersubscribers_$fuser WHERE id=".$_SESSION['uid']);
		
		basics::notification_set(basics::nmtype_friends, basics::ntype_friendship_accept, $fuser, 0);
		return "Added as a friend.";
	}

	function friend_add($userid, $touser)
	{
	
	}
	
	function friend_suggest($userid, $touser, $suggesteduser)
	{
	
	}
	
	function friend_remove($userid, $removeuserid)
	{
	
	}
	
	/*
	 * 1 - dating, 2 - married.
	 */
	function relationship_request_add($touser, $rmode)
	{
		if($touser == $_SESSION['uid']) return "lol";
	
		if(self::isfriend($touser) != 1) return "You have to be a friend first.";
		
		if($rmode == 1)
			basics::notification_set(basics::nmtype_friends, basics::ntype_relationship_request_d, $touser, 0);
		else
			basics::notification_set(basics::nmtype_friends, basics::ntype_relationship_request_m, $touser, 0);

		return "The relationship request has been sent.";
	}
	
	/*
	 * just delete the notification, do nothing
	 */
	function relationship_request_delete($fuser)
	{
		self::query("DELETE FROM usernotifications_".$_SESSION['uid']." WHERE fromuser=$fuser AND maintype=".basics::nmtype_friends." AND (type=".basics::ntype_relationship_request_d." OR type=".basics::ntype_relationship_request_m.")");
	}
	
	
	function relationship_request_accept($fuser, $rmode)
	{
		$rtype = $rmode == 1 ? self::relationshipmode_dating : self::relationshipmode_married;
	
		$cuid = $_SESSION['uid'];
		
		if($fuser == $cuid) return ""; /* what?? */
		
		/* check if the other user still has the unaccepted request */
		
		$res = basics::query("select relationshipuser, relationshipaccepted FROM userdetails where userid=$fuser");
		if(!$res) return "Error in processing your relationship acceptance.";
		$row = mysql_fetch_array($res);
		if(!$row) return "Error in processing your relationship acceptance.";
		
		$otherruid = $row['relationshipuser'];
		$otherracc = $row['relationshipaccepted'];
		
		self::relationship_request_delete($fuser);
		
		if($otherruid == $cuid)
		{
			/* register it */
			
			self::query("update userdetails SET relationshipuser=$fuser, relationshipsince=UTC_TIMESTAMP(), relationshipmode=$rtype, relationshipaccepted=1 where userid=$cuid");
			self::query("update userdetails SET relationshipuser=$cuid, relationshipsince=UTC_TIMESTAMP(), relationshipmode=$rtype, relationshipaccepted=1 where userid=$fuser");

			return "Added your relationship status.";
		}else{
			return "Relationship request is no longer valid.";
		}
	}
	

	
	function get_username_from_id($userid)
	{
		$result = self::query("SELECT username, lastname FROM logon WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return "";
		return $row['username']." ".$row['lastname'];
	}
	
	function get_userfname_from_id($userid)
	{
		$result = self::query("SELECT username FROM logon WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return "";
		return $row['username'];
	}
	
	function get_userdob_from_id($userid)
	{
		$result = self::query("SELECT birth_year, birth_month, birth_day FROM userdetails WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return 0;
		return array($row['birth_year'], $row['birth_month'], $row['birth_day']);
	}
	
	function get_usergender_from_id($userid)
	{
		$result = self::query("SELECT gender FROM userdetails WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return "";
		
		if($row['gender'])
			return $row['gender'] == 1 ? "Male" : "Female";
		else
			return "";
	}
	
	function get_usergenderid_from_id($userid)
	{
		$result = self::query("SELECT gender FROM userdetails WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return "";
		
		if($row['gender'])
			return $row['gender'] == 1 ? 1 : 2;
		else
			return 0;
	}
	
	function get_userdsc_from_id($userid)
	{
		$result = self::query("SELECT description FROM userdetails WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return "";
		return $row['description'];
	}
	
	function get_useremail_from_id($userid)
	{
		$result = self::query("SELECT useremail FROM logon WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return "";
		return $row['useremail'];
	}
	
	function get_userlname_from_id($userid)
	{
		$result = self::query("SELECT lastname FROM logon WHERE userid=$userid");
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return "";
		return $row['lastname'];
	}
	
	function get_usernameset_from_id($userid)
	{
		$result = self::query("SELECT username, lastname FROM logon WHERE userid=$userid");
		if(!$result) return 0;
		
		$row = mysql_fetch_assoc($result);

		if($row == "Error") return 0;
		return array($row['username'], $row['lastname']);
	}
	
	function get_user_tag($userid)
	{
		return "(@".translate_userid($userid, false, 6).")";
	}
	
	function quick_uidn($userid_alpha)
	{
		if(strlen($userid_alpha) != 6) return -1;
		return translate_userid($userid_alpha, true, 6);
	}
	
	function quick_uida($userid_num)
	{
		return translate_userid($userid_num, false, 6);
	}
	
	function quick_ulidn($userid_alpha)
	{
		if(strlen($userid_alpha) != 6) return -1;
		return translate_locationid($userid_alpha, true, 7);
	}
	
	function quick_ulida($userid_num)
	{
		return translate_locationid($userid_num, false, 7);
	}
	
	function quicktranslate_decodenumber($num)
	{
		return translate_gnumber($num, true, false);
	}
	
	function quicktranslate_encodenumber($num)
	{
		return translate_gnumber($num, false, false);
	}
	
	function quicktranslate_encodenumber_pad($num, $pd)
	{
		return translate_gnumber($num, false, $pd);
	}
	
	function quicktranslate_decodenumber_pad($num, $pd)
	{
		return translate_gnumber($num, true, $pd);
	}
	
	function get_latest_notifications_set($count)
	{
		$res = self::query("select * from usernotifications_".$_SESSION['uid']);
		return $res;
	}
	
	function get_latest_notifications_grouped($count, $typeid)
	{
		$res = self::query("select * from usernotifications_".$_SESSION['uid']." WHERE maintype=$typeid");
		return $res;
	}
	
	
	function get_userdescription($uid)
	{
		$result = self::query("SELECT description FROM userdetails WHERE userid=$uid");
		if(!$result) return 0;
		
		$row = mysql_fetch_assoc($result);
		
		return $row['description'];
	}
	
	function get_cuserpassword()
	{
		$cuid = $_SESSION['uid'];
		$result = self::query("SELECT password FROM logon WHERE userid=$cuid");
		if(!$result) return 0;
		
		$row = mysql_fetch_assoc($result);
		
		return $row['password'];
	}
	
	function password_hash($p)
	{
		return md5($p."nfsp");
	}
	
	function get_mutual_friend_count($uid)
	{
		$cuid = $_SESSION['uid'];
		
		$res = self::query("SELECT * FROM userfriends_$cuid, userfriends_$uid where userfriends_$cuid.frienduserid = userfriends_$uid.frienduserid");
		$nr = mysql_num_rows($res);
		
		if($nr)
			return $nr;
		else
			return 0;
	}
	
	function isfriend($uid)
	{
		$cuid = $_SESSION['uid'];
		
		$res = self::query("select * from userfriends_$cuid where frienduserid=$uid");
		if(!$res)return 0;
		if(mysql_num_rows($res)==0) return 0;
		else return 1;
		
		$res = self::query("select * from usersubscriptions_$cuid where id=$uid");
		if(!$res)return 2;
		if(mysql_num_rows($res)==0) return 2;
		
		$res = self::query("select * from usersubscriptions_$uid where id=$cuid");
		if(!$res)return 2;
		if(mysql_num_rows($res)==0) return 2;
		
		return 1;
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

	
	
	/* conversations */
	
	
	/*
	 * create one
	 * 
	 *	fline - first line of the conversation
	 *	dusers - destination users
	 */
	 
	function conversation_create($fline, $dusers)
	{
		$uc = count($dusers);
		$cid = 0;
		$rsign = self::generate_bulk(120);
		$cuid = $_SESSION['uid'];
		
		self::query("INSERT INTO conversations (startinguserid, signature) values ($cuid, '$rsign')");
		
		
		$resudcount = self::query("SELECT Auto_increment FROM information_schema.tables WHERE table_name='conversations' AND table_schema = DATABASE();");
		$resudcountrow = mysql_fetch_assoc($resudcount);
		
		$cid = $resudcountrow['Auto_increment'] - 1;
		
			
		/* table - id, user id, time of the post, attributes, text */
		
		self::query("CREATE TABLE conversations_text_$cid (
						tid              int not null primary key auto_increment,
						uid              int,
						tm               datetime,
						att              int,
						text             varchar(128)
						);");
						
		self::query("INSERT INTO conversations_text_$cid (uid, tm, att, text) values ($cuid, UTC_TIMESTAMP(), 0, '$fline')");
				
		/* table - id, user id, joined at this line, attributes, reserved */
		
		self::query("CREATE TABLE conversation_users_$cid (
						tid              int not null primary key auto_increment,
						uid              int,
						sline            int,
						att              int,
						data             varchar(128)
						);");
	
		//self::query("INSERT INTO conversation_users_$cid (uid, sline, att, data) values ($cuid, 0, 1, '')");

		for($i=0; $i<$uc; $i++)
		{
			self::query("INSERT INTO conversation_users_$cid (uid, sline, att, data) values (".$dusers[$i].", 0, 0, '')");
		}
		
		for($i=0; $i<$uc; $i++)
		{
			self::query("INSERT INTO conversationsin_".$dusers[$i]." (startinguid, active, startline, roomid, signature, newmsgs, latestmsgid) values ($cuid, 1, 0, $cid, '$rsign', 1, 0)");
		}
		
		return true;
	}
	
	/*
	 * activate an existing conversation for every user involved.
	 *
	 * room id, signature, first line
	 */
	 
	function conversation_activate($cid, $rsign, $fline)
	{
		$cuid = $_SESSION['uid'];
		
		$res = self::query("SELECT * FROM conversations WHERE roomid=$cid AND signature='$rsign'");
		if(!$res)return false;
		
		self::query("INSERT INTO conversations_text_$cid (uid, tm, att, text) values ($cuid, UTC_TIMESTAMP(), 0, '$fline')");
				
		$res = self::query("SELECT uid FROM conversation_users_$cid");
		if(!$res)return false;
		
		$row = mysql_fetch_array($res);
		
		while($row)
		{
			$duid = $row['uid'];
			
			self::query("UPDATE conversationsin_$duid SET active=1 WHERE roomid=$cid;");
			
			$row = mysql_fetch_array($res);
		}
		return true;
	}
	
	/*
	 * check for the existance of a conversation and create new one if it doesn't exist
	 * or activate the last one if exists
	 */
	
	function conversation_start($fline, $dusers)
	{
		$cuid = $_SESSION['uid'];
		$ducount = count($dusers);
		
		$resconvs = self::query("SELECT roomid, signature FROM conversationsin_$cuid");
		$rowconvs = mysql_fetch_array($resconvs);
		
		$dusers[$ducount] = $cuid;
		$ducount++;
		
		sort($dusers);
		
		
		
		while($rowconvs)
		{
			$cid = $rowconvs['roomid'];
			
			$resusers = self::query("SELECT uid FROM conversation_users_$cid");
			if(!$resusers)
			{
				$rowconvs = mysql_fetch_array($resconvs);
				continue;
			}
			
			$rowusers = mysql_fetch_array($resusers);
			
			$uarray = array();
			$uai = 0;
			
			while($rowusers)
			{
				$uarray[$uai] = $rowusers['uid'];
				$uai++;
				
				$rowusers = mysql_fetch_array($resusers);
			}
			
			if($uai != $ducount) continue;
			
			sort($uarray);
			
			$allmatch = 1;
			
			for($i=0; $i<$uai; $i++)
			{
				if($uarray[$i] != $dusers[$i])
				{
					$allmatch = 0;
					break;
				}
			}
			
			if($allmatch) /* found a conversation */
			{
				
				self::conversation_activate($cid, $rowconvs['signature'], $fline);
				return true;
			}
			
			
			$rowconvs = mysql_fetch_array($resconvs);
		}
		return self::conversation_create($fline, $dusers);
	}
	
	function conversation_send($msg, $cid, $rsign, $append, $msgmode)
	{
		$cuid = $_SESSION['uid'];
		
		
		$msg = str_replace("?", "[-q-]", strip_tags($msg));
		$msg = mysql_real_escape_string($msg, self::getmysql());
		
		
		$res = self::query("SELECT * FROM conversations WHERE roomid=$cid AND signature='$rsign'");
		if(!$res)return false;
		
		if($append)
		{
			//self::query("INSERT INTO conversations_text_$cid (uid, tm, att, text) values ($cuid, UTC_TIMESTAMP(), 0, '$msg')");
			$msg = "[-n-l-]".$msg;
			self::query("UPDATE conversations_text_$cid SET text = CONCAT(text, '$msg'), tm=UTC_TIMESTAMP() ORDER BY tid DESC LIMIT 1");
			//return true;
			
		}else{
			self::query("INSERT INTO conversations_text_$cid (uid, tm, att, text) values ($cuid, UTC_TIMESTAMP(), 0, '$msg')");
		}
		basics::notification_set(basics::nmtype_message, basics::ntype_message_new, 2, array($cid, $rsign));
		$res = self::query("SELECT uid FROM conversation_users_$cid");
		if(!$res)return false;
		
		$row = mysql_fetch_array($res);
		
		while($row)
		{
			$duid = $row['uid'];
			
			if($duid != $cuid)
			{
				self::userenv_set_lastmsgtime($duid);
				
				if($msgmode)
				{
					basics::notification_set(basics::nmtype_message, basics::ntype_message_new, $duid, array($cid, $rsign));
				}
				
				if(!$append)
					self::query("UPDATE conversationsin_$duid SET newmsgs=newmsgs+1 WHERE roomid=$cid;");
			}else{
				//self::userenv_set_lastmsgtime();
			}
			
			$row = mysql_fetch_array($res);
		}
		
		return strtotime(date("Y-m-d H:i:s"));
	}
	
	
	function userenv_set_availability($amode, $userid)
	{
		if(!$userid) $userid = $_SESSION['uid'];
		
		switch($amode)
		{
		case 0: case 1: case 2: case 3: case 4:
			self::query("UPDATE userenv SET availability=$amode WHERE uid=$userid;");
			break;
		
		default:
			return 0;
		}
		return 1;
	}
	
	function userenv_get_availability($userid)
	{
		if(!$userid) $userid = $_SESSION['uid'];
		
		$res = self::query("SELECT availability FROM userenv WHERE uid=$userid");
		if(!$res)return 0;
		$row = mysql_fetch_array($res);
		
		return $row['availability'];
	}
	
	function userenv_get_availability_info($userid)
	{
		$av = self::userenv_get_availability($userid);
	
		$avstr = "Offline";
		$avcolor = "efefef";
		
		switch($av)
		{
		case 1: $avcolor = "99cc66"; $avstr = "Online"; break;  /* online */
		case 2: $avcolor = "ff6633"; $avstr = "Busy"; break;  /* busy */
		case 3: $avcolor = "ffcc00"; $avstr = "Away"; break;  /* away */
		case 4:
			if(!$userid || $userid == $_SESSION['uid'])
			{
				$avstr = "Hidden";
				$avcolor = "999999";
			}
			break;
		}
		
		return array($avstr, $avcolor);
	}
	
	function userenv_get_croomid($userid)
	{
		if(!$userid)
		{
			if(isset($_SESSION['currentrid']))
			{
				return $_SESSION['currentrid'];
			}else{
			
				$res = self::query("SELECT croomid FROM userenv WHERE uid=$userid");
				if(!$res)return 0;
				$row = mysql_fetch_array($res);
				
				$_SESSION['currentrid'] = $row['croomid'];
				return $row['croomid'];
			}
		}
		
		$res = self::query("SELECT croomid FROM userenv WHERE uid=$userid");
		if(!$res)return 0;
		$row = mysql_fetch_array($res);
		
		return $row['croomid'];
	}
	
	function userenv_get_croomsign($userid)
	{
		if(!$userid)
		{
			if(isset($_SESSION['currentrs']))
			{
				return $_SESSION['currentrs'];
			}else{
				$res = self::query("SELECT conversations.signature FROM conversations, userenv WHERE userenv.uid=$userid AND userenv.croomid=conversations.roomid");
				if(!$res)return 0;
				$row = mysql_fetch_array($res);
		
				$_SESSION['currentrs'] = $row['signature'];
				return $row['signature'];
			}
		}
		
		$res = self::query("SELECT conversations.signature FROM conversations, userenv WHERE userenv.uid=$userid AND userenv.croomid=conversations.roomid");
		if(!$res)return 0;
		$row = mysql_fetch_array($res);
		
		return $row['signature'];
	}
	
	function userenv_get_lastmsgtime($userid)
	{
		/*if(!$userid)
		{
			if(isset($_SESSION['currentrmt']))
			{
				return $_SESSION['currentrmt'];
			}else{
				$userid = $_SESSION['uid'];
				
				$res = self::query("SELECT roomvalid, lastmsgtime FROM userenv WHERE uid=$userid");
				if(!$res)return 0;
				$row = mysql_fetch_array($res);
				
				if($row['roomvalid'] == 1)
					$_SESSION['currentrmt'] = strtotime($row['lastmsgtime']);
				else
					$_SESSION['currentrmt'] = 0;
					
				return $_SESSION['currentrmt'];
			}
		} */
		
		if(!$userid) $userid = $_SESSION['uid'];
		
		$res = self::query("SELECT roomvalid, lastmsgtime FROM userenv WHERE uid=$userid");
		if(!$res)return 0;
		$row = mysql_fetch_array($res);
		
		//if($row['roomvalid'] == 1)
			return strtotime($row['lastmsgtime']);
		//else
		//	return 0;
	}
	
	
	
	function userenv_set_croomid($userid, $rid)
	{
		if(!$userid) $_SESSION['currentrid'] = $rid;
		if(!$userid) $userid = $_SESSION['uid'];
		
		return self::query("UPDATE userenv SET croomid=$rid WHERE uid=$userid");
	}
	
	function userenv_set_croomsign($userid, $rs)
	{
		if(!$userid) $_SESSION['currentrs'] = $rs;
		return 1;
	}
	
	function userenv_set_croomsign_byroom($userid, $rid)
	{
		if(!$userid) $userid = $_SESSION['uid'];
		
		$res = self::query("SELECT signature FROM conversations WHERE roomid=$rid");
		if(!$res)return 0;
		$row = mysql_fetch_array($res);
		
		$_SESSION['currentrs'] = $row['signature'];
		return 1;
	}
	
	function userenv_set_lastmsgtime($userid)
	{
		$lmt = date("Y-m-d H:i:s");
	
		if(!$userid) $_SESSION['currentrmt'] = strtotime($lmt);
		if(!$userid) $userid = $_SESSION['uid'];
		
		return self::query("UPDATE userenv SET lastmsgtime='$lmt' WHERE uid=$userid");
	}
	
	
	function chat_getlines_json($rid, $ltime)
	{
		$toutval = 0;
		return self::chat_getlines_jsonex($rid, $ltime, $toutval);
	}
	
	function chat_getlines_jsonex($rid, $ltime, &$outtimeval)
	{
		$lasttimeval = 0;
		$user_id    = $_SESSION['uid'];
		
		$ulist = "[";
		$fu = 1;
		
		$resusers = self::query("select uid from conversation_users_$rid where uid!=$user_id");
		$rowusers = mysql_fetch_array($resusers);
		
		while($rowusers)
		{
			if($fu) $fu = 0;
			else $ulist .= ", ";
			
			$urid = $rowusers['uid'];
			
			$guid = self::quick_uida($urid);
			$guname = self::get_username_from_id($urid);
			
			$ulist .= '{"name": "'.$guname.'", "id":"'.$guid.'"}';
		
			$rowusers = mysql_fetch_array($resusers);
		}
		
		$ulist .= "]";
		
		
		/* get lines */
		
		$clines = "[";
		$fl = 1;
		
		if($ltime)
		{
			$ltime = date("Y-m-d H:i:s", $ltime);
			$reslines = self::query("select * from conversations_text_$rid WHERE tm > '$ltime'");
		}else{
			$reslines = self::query("select * from conversations_text_$rid ORDER BY tid DESC LIMIT 10");	
		}

		$rowlines = mysql_fetch_array($reslines);
		
		while($rowlines)
		{
			if($fl) $fl = 0;
			else $clines .= ", ";
			
			$ul_tid  = $rowlines['tid'];
			$ul_uid  = $rowlines['uid'];
			$ul_tid  = $rowlines['tid'];
			$ul_text = str_replace("[-q-]", "?", $rowlines['text']);
			$ul_text = str_replace("\n", "[-n-l-]", $ul_text);
			$ul_text = str_replace("\"", "&quot;", $ul_text);
			$ul_text = str_replace("'", "&#39;", $ul_text);
			$ul_tm   = strtotime($rowlines['tm']);
			$ul_att  = $rowlines['att'];
			
			if($ul_tm > $lasttimeval) $lasttimeval = $ul_tm;
			
			$clines .= '{"user": "'.self::quick_uida($ul_uid).'", "userloc": "'.self::quick_ulida($ul_uid).'", "tid":"'.$ul_tid.'", "line":"'.$ul_text.'", "time":"'.$ul_tm.'", "att":"'.$ul_att.'"}';
		
			$rowlines = mysql_fetch_array($reslines);
		}
		
		$clines .= "]";
		
		
		self::userenv_set_croomid(0, $rid);
		self::userenv_set_croomsign_byroom(0, $rid);
		
		$outtimeval = $lasttimeval;
		
		return '{"users":'.$ulist.', "lines":'.$clines.'}';
	}
	
	
	/*
		returns an array of user ids (native format).
		
		skeyword      - search keyword, name/description etc.
		
		sorttype      - sort the results by
		
						1. contact reputation
						2. latest contact
		
		limit         - maximum number of results
		
		searchmode    - 1. by name
						2. by description
						3. by location
						4. by school/workplace etc.
		
		availableonly - 1. return only those who are online.
						2. those who are in a conversation. <- write it totally different, based on conversations table rather than full user list ->
	
	*/
	function search_friends($skeyword, $sorttype, $limit, $searchmode, $availableonly)
	{
		$user_id = $_SESSION['uid'];
		$keywords = explode(" ", $skeyword);
		$kwcount = count($keywords);
		
		$sqm = "";
		$sq_1 = "";
		$sq_2 = "";
		$sq_3 = "";
		
		if($kwcount > 0)
		{
			/* get list of friends */
			
			if($availableonly == 0)
				$sqm = "SELECT frienduserid FROM userfriends_$user_id, logon";
			else if($availableonly == 1)
				$sqm = "SELECT frienduserid FROM userfriends_$user_id, logon, userenv";
				
				
			$sq_1 = " WHERE logon.userid=userfriends_$user_id.frienduserid";
			
			if($kwcount < 2)
			{
				$kwa = $keywords[0];
				$sq_2 = " AND (logon.username LIKE '%%$kwa%%' OR logon.lastname LIKE '%%$kwa%%')";
				
			}else{
			
				$kwa = $keywords[0];
				$kwb = $keywords[1];
				$sq_2 = " AND (logon.username LIKE '%$kwa%' OR logon.lastname LIKE '%$kwa%' OR logon.username LIKE '%$kwb%' OR logon.lastname LIKE '%$kwb%')";
			}
			
			if($availableonly == 1)
				$sq_2 .= " AND userenv.uid=userfriends_$user_id.frienduserid AND userenv.availability != 0";
			if($limit > 0)
				$sq_3 = " LIMIT 0, $limit";
		
		}else if($limit > 0){
		
			$sqm = "SELECT frienduserid FROM userfriends_$user_id LIMIT 0, $limit";
		}else{
			$sqm = "SELECT frienduserid FROM userfriends_$user_id";
		}
		
		$sqm .= $sq_1.$sq_2.$sq_3;
 
		$resppl = self::query($sqm);	
		if(!$resppl) return 0;
		
		$ppld = mysql_fetch_array($resppl);
		if(!$ppld) return 0;
		
		$nbppl = array();
		
		while($ppld)
		{
			array_push($nbppl, $ppld['frienduserid']);
			$ppld = mysql_fetch_array($resppl);
		}
		
		return $nbppl;
	}
	
	function search_people($skeyword, $sorttype, $limit, $searchmode)
	{
		$user_id = $_SESSION['uid'];
		$keywords = explode(" ", $skeyword);
		$kwcount = count($keywords);
		
		$sqm = "";
		$sq_1 = "";
		$sq_2 = "";
		$sq_3 = "";
		
		if($kwcount > 0)
		{
			if($kwcount < 2)
			{
				$kwa = $keywords[0];
				$sq_2 = "SELECT userid FROM logon WHERE MATCH(username, lastname) AGAINST ('+*$kwa*' IN BOOLEAN MODE)";
				//$sq_2 = "SELECT userid FROM logon WHERE username LIKE '%%$kwa%%' OR lastname LIKE '%%$kwa%%'";
				
			}else{
				$kwa = $keywords[0];
				$kwb = $keywords[1];
				
				$sq_2 = "SELECT userid FROM logon WHERE MATCH(username, lastname) AGAINST ('+*$skeyword*' IN BOOLEAN MODE)";

				//$sq_2 = "SELECT userid FROM logon WHERE username LIKE '%$kwa%' OR lastname LIKE '%$kwa%' OR username LIKE '%$kwb%' OR lastname LIKE '%$kwb%'";
			}
			
			if($limit > 0)
				$sq_3 = " LIMIT 0, $limit";
		
		}else{
			return 0;
		}
		
		$sqm .= $sq_2.$sq_3;
 
		$resppl = self::query($sqm);	
		if(!$resppl) return 0;
		
		$ppld = mysql_fetch_array($resppl);
		if(!$ppld) return 0;
		
		$nbppl = array();
		
		while($ppld)
		{
			array_push($nbppl, $ppld['userid']);
			$ppld = mysql_fetch_array($resppl);
		}
		
		return $nbppl;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	function search_friends2($skeyword, $sorttype, $limit, $searchmode, $availableonly)
	{
		$user_id = $_SESSION['uid'];
		
		$keywords = explode(" ", $skeyword);
		$respeople = 0;
		$kwcount = count($keywords);
		$sq_1 = "";
		$sq_2 = "";
		$sqm = "SELECT userid FROM userfriends_$user_id, logon";
		
		if($availableonly == 1)
		{
			$sqm = "SELECT userid FROM userfriends_$user_id, logon, userenv";
		}
		
		if($limit > 0)
		{
			$sq_2 = " LIMIT 0, $limit";
		}
		
		if($searchmode == 1) /* by name */
		{
			if($kwcount > 0)
			{
				if($kwcount < 2)
				{
					$kwa = $keywords[0];
					
					$sq_1 = " WHERE (logon.username LIKE '%$kwa%' OR logon.lastname LIKE '%$kwa%')";
					
				}else{
				
					$kwa = $keywords[0];
					$kwb = $keywords[1];
					$sq_1 = " WHERE (logon.username LIKE '%$kwa%' OR logon.lastname LIKE '%$kwa%' OR logon.username LIKE '%$kwb%' OR logon.lastname LIKE '%$kwb%')";
				}
				
			}else if($limit > 0){
			
				/* search all possible matches */
			
			}else{
				return 0;
			}
		}else{
			return 0;
		}
		
		
		
	}
	
	function search_get_allfriends()
	{
		$user_id = $_SESSION['uid'];
		
		$resppl = self::query("SELECT frienduserid FROM userfriends_$user_id");
		if(!$resppl) return 0;
		
		$nbppl = array();
		
		while($rdata = mysql_fetch_array($resppl))
		{
			array_push($nbppl, $rdata['frienduserid']);
		}
		
		return $nbppl;
	}
	
	function translate_urls_to_html($s)
	{
		return preg_replace('@(https?://([-\w\.]+[-\w])+(:\d+)?(/([\w/_\.#-]*(\?\S+)?[^\.\s])?)?)@', '<a href="$1" target="_blank">$1</a>', $s);
	}
	
	/*
	 
		filters go this way:
		
		filter_search
		
		filter_arrange_recent
		filter_arrange_famous
		filter_arrange_closers

		filter_mode_everything
		filter_mode_text
		filter_mode_photos
		filter_mode_links
		filter_mode_music
		filter_mode_videos
		filter_mode_blog

		filter_view_collapsed
		filter_view_semi

		filter_network_natfie
		filter_network_twitter
		filter_network_facebook
		
		filter_geo_everyone
		filter_geo_physical
		filter_geo_virtual
		filter_geo_family
		filter_geo_friends
			 
	 */
	 
	function set_filters($fkey, $fvalue)
	{
	
	}
	
	
	/*
	 * settings
	 */
	 
	function setting_get($sgroup, $skey)
	{
		if($sgroup == 1)
		{
			$user_id = $_SESSION['uid'];
		
			$res = self::query("SELECT $skey FROM usersettings WHERE uid=$user_id");
			if(!$res) return 0;
			
			$rdata = mysql_fetch_array($res);
			if(!$rdata) return 0;
			
			return $rdata[$skey];
		}
		
		return 0;
	}
	
	function setting_get_user($uid, $sgroup, $skey)
	{
		if($sgroup == 1)
		{
			if(!$uid) $uid = $_SESSION['uid'];
		
			$res = self::query("SELECT $skey FROM usersettings WHERE uid=$uid");
			if(!$res) return 0;
			
			$rdata = mysql_fetch_array($res);
			if(!$rdata) return 0;
			
			return $rdata[$skey];
		}
		
		return 0;
	}
	
	function setting_set($sgroup, $skey, $svalue)
	{
		if($sgroup == 1)
		{
			$user_id = $_SESSION['uid'];
		
			$res = self::query("UPDATE usersettings SET $skey='$svalue' WHERE uid=$user_id");
			if(!$res) return 0;
			return 1;
		}
		
		return 0;
	}
	
	function setting_toggle($sgroup, $skey)
	{
		if($sgroup == 1)
		{
			$user_id = $_SESSION['uid'];
		
			$res = self::query("UPDATE usersettings SET $skey=$skey XOR 1 WHERE uid=$user_id");
			if(!$res) return 0;
			
			return 1;
		}
		
		return 0;
	}
	
		
	function decode_tagcodes($itext)
	{
		
		return preg_replace('/\[\@\[-([^,]*),([^,]*),([^-]*)-]]/', '<a href=\'u$2\' onmouseover="vusr(this, \'$2\');">$1</a>', $itext);
	}
	
	
}

?>