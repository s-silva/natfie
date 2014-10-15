<?php

	include("../../clogin.php"); 
	include_once("../general/basics.php");

	$log = new logmein(); 
	$user_id    = $_SESSION['uid'];

	if(isset($_GET['tm']))
		$chatlasttime = $_GET['tm'];
	else
		$chatlasttime = -1;
		
	if(isset($_GET['r']))
		$chatcroomid = $_GET['r'];
	else
		$chatcroomid = 0;
		
		
	/* update new notification values from the user */
	
	if(isset($_GET['nntf']))
	{
		$defnv = array(-1, -1, -1, -1, -1);
		$nntv = $_GET['nntf'];
		$ev = explode(",", $nntv);
		$evc = 0;
		
		$evi = 0;
		
		foreach ($ev as $ei)
		{
			if(is_numeric($ei))
			{
				$evc = 1;
				if($ei > 0)
				{
					$defnv[$evi] = $ei;
				}else{ /* zero */
					$defnv[$evi] = 0;
				}
			}
			if (++$evi >= 5) break;
		}
		
		if($evc)
		{
			$nnesv = "";
			
			if($defnv[0] != -1) $nnesv .= "friendships=".$defnv[0].",";
			if($defnv[1] != -1) $nnesv .= "messages=".$defnv[1].",";
			if($defnv[2] != -1) $nnesv .= "tags=".$defnv[2].",";
			if($defnv[3] != -1) $nnesv .= "events=".$defnv[3].",";
			if($defnv[4] != -1) $nnesv .= "general=".$defnv[4].",";
			
			$nnesv = substr($nnesv, 0, -1);

			$log->qry("update notifications set $nnesv where userid='$user_id'", $log->username_logon, $log->password_logon);
		}
		
	}
	

	/* new notifications */
	
	$newnotifications = "";
	
	$res = $log->qry("select * from notifications where userid='$user_id'", $log->username_logon, $log->password_logon);
	$row = mysql_fetch_array($res);

	if($row)
		$newnotifications = '"friends":'.$row['friendships'].', "messages":'.$row['messages'].', "tags":'.$row['tags'].', "events":'.$row['events'].', "notifications":'.$row['general'];
	else
		$newnotifications = '"friends":0, "messages":0, "tags":0, "events":0, "notifications":0';
	
	
	/* new conversations */
	
	$newconversations = "";
	
	if($chatlasttime != 1) /* [todo] check updates and send new conversations only if there are any new */
	{
		$newclist = array();
		
		$res = $log->qry("select * from conversationsin_$user_id where active=1", $log->username_logon, $log->password_logon);
		
		if($res)
		{
			$cci = 0;
			$row = mysql_fetch_array($res);
			
			while($row)
			{
				$rid   = $row['roomid'];
				$cid   = $row['roomid']."_".$row['signature'];
				$users = 1;
				$uc    = 1;
				$msgs  = $row['newmsgs'];
				

				$ulistav = "[";
				$ulistloc = "[";
				$ulist = "[";
				$resusers = $log->qry("select uid from conversation_users_$rid", $log->username_logon, $log->password_logon);
				if(!$resusers) continue;
				
				$rowusers = mysql_fetch_array($resusers);
				
				$nnufadded = 0;
				
				if($rowusers['uid'] != $user_id)
				{
					$ulist .= '"'.basics::quick_uida($rowusers['uid']).'"';
					$ulistav .= '"'.basics::userenv_get_availability($rowusers['uid']).'"';
					$ulistloctmp = basics::quick_ulida($rowusers['uid']);

					if(file_exists("../../data/u$ulistloctmp/dp/2.jpg"))
						$ulistloc .= '"'.$ulistloctmp.'"';
					else
						$ulistloc .= '"0"';
						
					$nnufadded = 1;
				}
				
				for($j=0; $j<3; $j++)
				{
					$rowusers = mysql_fetch_array($resusers);
					if(!$rowusers) break;
					
					if($rowusers['uid'] == $user_id) continue;
					
					if($nnufadded)
					{
						$ulist .= ', ';
						$ulistav .= ', ';
						$ulistloc .= ', ';
					}
					
					$nnufadded = 1;
					
					$ulist .= '"'.basics::quick_uida($rowusers['uid']).'"';
					$ulistav .= '"'.basics::userenv_get_availability($rowusers['uid']).'"';
					
					$culistloctmp = basics::quick_ulida($rowusers['uid']);
					if(file_exists("../../data/u$culistloctmp/dp/2.jpg"))
						$ulistloc .= '"'.$culistloctmp.'"';
					else
						$ulistloc .= '"0"';
				}
				
				$ulist .= ']';
				$ulistav .= ']';
				$ulistloc .= ']';
				
				$newclist[$cci++] = '"rid":"'.$rid.'", "cid":"'.$cid.'", "uc":'.$uc.', "msgs":'.$msgs.', "users":'.$ulist.', "usersloc":'.$ulistloc.', "usersav":'.$ulistav;
				$row = mysql_fetch_array($res);
			}
			
		}
		
		
		if($newclist)
		{
			$count = count($newclist);
			$newconversations = '"conversations": [';
			
			
			for($i=0; $i<$count; $i++)
			{
				if($i)$newconversations .= ",";
				$newconversations .= '{'.$newclist[$i].'}';
			}
			
			$newconversations .= ']';
		}
		
	}
	
	$newlines = "";
	$cstout = "";
	
	$chatlasttimeout = 0;
	
	if($chatlasttime != basics::userenv_get_lastmsgtime(0) && $chatcroomid)
	{
		$newlines = basics::chat_getlines_jsonex($chatcroomid, $chatlasttime, $chatlasttimeout);
		$cstout = basics::userenv_get_lastmsgtime(0);
		$cstout = $chatlasttimeout;
	}
	
	
	/* compile all together */
	
	$mainjson = '{';
	
	if($newnotifications)
		$mainjson .= '"newnotifications": {'.$newnotifications.'},';
		
	if($newconversations)
		$mainjson .= '"newconversations": {'.$newconversations.'},';

	if($newlines)
		$mainjson .= '"newlines": '.$newlines.',';
		
	if($cstout)
	{
		$mainjson .= '"chatlasttime": "'.$cstout.'",';
	}
		
	$mainjson = substr($mainjson, 0, -1).'}';
	
	echo $mainjson;
?>