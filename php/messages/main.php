<?php

	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 
	
	
	function getmsg_pagecount($user_id, $maxitems)
	{
		if(!$maxitems) $maxitems = 20;
		$res = basics::query("select COUNT(*) from conversationsin_$user_id");
		if(!$res)return 0;
		
		$ra=mysql_fetch_row($res); 
		$n = $ra[0];
		
		return max(floor($n / $maxitems), 1);
	}
	
	/*
	 * mfolder - 0 - inbox
	 *           1 - sent
	 *			 3 - important
	 */
	 
	function getmsgdata($user_id, $mfolder, $ipage, $maxitems)
	{
		if(!$maxitems) $maxitems = 20;
		
		$ifirstitem = $ipage * $maxitems;
		
		$d = "";
		$res = basics::query("select * from conversationsin_$user_id LIMIT $ifirstitem, $maxitems");
	
		if(!$res) return "";
		
		$cci = 0;
		
		while($row = mysql_fetch_array($res))
		{
			$oddeven = $cci % 2 ? "odd" : "even";
			$du = "";
			$dl = "";
			$rid   = $row['roomid'];
			$cid   = $row['roomid']."_".$row['signature'];
			$msgs  = $row['newmsgs'];
			$suid  = $row['startinguid'];
			$ltime = 0;
			$lluid = 0;

			$reslines = basics::query("select * from conversations_text_$rid ORDER BY tid DESC LIMIT 5");	
			
			$rline1 = mysql_fetch_array($reslines);
			if($rline1) $rline2 = mysql_fetch_array($reslines);
			
			$dfl = "";

			if($rline1)
			{
				$lluid = $rline1['uid'];
				$du .= basics::get_username_from_id($rline1['uid']);
				$ltime = strtotime($rline1['tm']);
				
				//$dfl .= "<p><b>".basics::get_userfname_from_id($rline1['uid']).": </b>".$rline1['text']."</p>";
				$dfl .= "<p>".$rline1['text']."</p>";
				
				if($rline2)
				{
					if($rline2['uid'] != $lluid)
						$du .= ' and '.basics::get_username_from_id($rline2['uid']);
						
					$dl .= $rline2['text'].' ';
					
					//$dfl .= "<p><b>".basics::get_userfname_from_id($rline2['uid']).": </b>".$rline2['text']."</p>";
					$dfl .= "<p>".$rline2['text']."</p>";
				
				}
				
				$dl .= $rline1['text'];
			}
			
			while($rlne = mysql_fetch_array($reslines))
			{
				//$dfl .= "<p><b>".basics::get_userfname_from_id($rlne['uid']).": </b>".$rlne['text']."</p>";
				$dfl .= "<p>".$rlne['text']."</p>";
			}
			
			$ulist = "";
			$unamelist = "";
			
			$resusers = basics::query("select uid from conversation_users_$rid where uid!=$rid");	
			
			while($cuser = mysql_fetch_array($resusers))
			{
				$culid = basics::quick_ulida($cuser['uid']);
				$ulist .= "<div class='msg_line_upic'><img src='data/u$culid/dp/2.jpg' onerror='failsafe_img(this, 2);'/></div>";
				
				if($cuser['uid'] != $user_id)
				{
					if($unamelist != "") $unamelist .= " and ";
					$unamelist .= "<a href='u".basics::quick_uida($cuser['uid'])."'>".basics::get_username_from_id($cuser['uid'])."</a>";
				}
			}

			$dl = str_replace('[-n-l-]', ' ', $dl);
			$dfl = str_replace('[-n-l-]', ' ', $dfl);
			$dl = str_replace('[-q-]', '?', $dl);
			$dfl = str_replace('[-q-]', '?', $dfl);
			
			$d .= "<div class='msg_line_b msg_line_$oddeven' onclick='message_expand(this);' data-rid='$rid' data-cs='$cid'>".
					"<div class='msg_line_ctcard'><img src='data/u$culid/dp/1.jpg' onerror='failsafe_img(this, 1);'/><div style='clear: both;'></div><div class='msg_line_rtactive'></div><!--<div class='msg_line_rtbtn'><div class='msg_line_cstar'></div></div><div class='msg_line_rtbtn'><div class='msg_line_cdel'></div></div>--></div>".
				"<div class='msg_line_ctd'><div class='msg_line_text'>" .
					"<div class='msg_line_user'>$unamelist</div>".
					"<font><div class='msg_line_contents'>$dl</div></font>".
					"<span><div class='msg_line_contents'>$dfl</div></span>".
				"</div><div class='msg_line_right'><div class='msg_line_rt'>".
				"</div>".
					"<div class='msg_line_time'><abbr class='synctime' data-ts='$ltime' data-mode='0'></abbr></div>".
					"<span style='display: none;'><div class='msg_line_controls'>$ulist<div class='msg_line_csep'></div>".
							"<div class='msg_line_cbtn'><div style=\"background: url('images/sheet.png') no-repeat -156px -153px; width: 30px; height: 25px; position: relative; top: 7px; left: 5px\"></div></div>".
							"<div class='msg_line_cbtn'><div style=\"background: url('images/sheet.png') no-repeat -156px -179px; width: 30px; height: 25px; position: relative; top: 7px; left: 5px\"></div></div>".
							"<div class='msg_line_cbtn'><div style=\"background: url('images/sheet.png') no-repeat -188px -153px; width: 21px; height: 21px; position: relative; top: 10px; left: 10px\"></div></div></div></span>".

				"</div></div></div>";
			
			
			$cci++;
		}



		return $d;
	}
	
?>