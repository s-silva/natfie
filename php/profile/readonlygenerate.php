<?php

	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/tools/idnumber.php"); 
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 
	

class profile_genreadonly
{
	public $photostrip_pavailable = 0;
	
	function get_websitelisthtml($userid)
	{
		if(!basics::table_exists("userwebsitelist_$userid")) return "";
		
		$res = mysql_query("select * from userwebsitelist_$userid");
		
		if(!$res) return "";
		
		$whdata = "";
		
		while($row = mysql_fetch_array($res))
		{
			$ufs = basics::translate_urls_to_html($row['site']);
			$whdata .= "<div>".$row['title']."</div><div>$ufs</div>";
		}
	
		return $whdata;
	}
	
	function getreltionship_htmlstr($uid, $rsince, $rmode, $raccepted)
	{
		$rts = "(None)";
		$rsp = "";
		
		switch($rmode)
		{
		case 1: $rts = "Single"; break;
		case 2: $rts = "In a relationship"; break;
		case 3: $rts = "Married"; break;
		}
		
		if($rmode > 1 && $raccepted != 0)
		{
			 if($uid > 0)
			 {
				$rsp = basics::get_username_from_id($uid);
				if($rsp != "")
				{
					$rsplid = basics::quick_uida($uid);
					$rsp = "<a href='u$rsplid' onmouseover=\"vusr(this, '$rsplid')\">".$rsp."</a>";
				
					if($rmode == 2)
						$rsp = " with ".$rsp;
					else
						$rsp = " to ".$rsp;
				}
			 }
		}
		
		return $rts.$rsp;
	}
	
	function profile_generate_readonly($userid, $usersid, $rawdata)
	{
		if($userid <= 0)return "User Not Found";
		
		$res = mysql_query("select * from logon where userid=".$userid.";");
		$success = mysql_fetch_assoc($res);
		
		if(empty($success['userid'])) {
		   return join("", file("templates/contentblocked.html"));;
		}
				
		$res = mysql_query("select * from userdetails where userid='".$userid."';");
		
		if(!$res) return join("", file("templates/contentblocked.html"));;
		
		$row = mysql_fetch_array($res);
	
		$profile_birth_dayfix  = ordinal(rawvdef($row['birth_day'], "01"));
		
		$profile_id            = $usersid;
		$profile_lid           = translate_locationid($userid, false, 7);
		$profile_name          = $success['username']." ".$success['lastname'];
		$profile_description   = $row['description'];
		$profile_motto         = $row['motto'];
		$profile_livesin       = $row['livesin'];
		$profile_hometown      = $row['hometown'];
		$profile_birth_year    = $row['birth_year'];
		$profile_birth_month   = getmonthtext($row['birth_month']);
		$profile_birth_day     = $row['birth_day'];
		$profile_gender        = $row['gender'];
		$profile_mood          = $row['mood'];
		$profile_listening_to  = $row['listening_to'];
		$profile_reading       = $row['reading'];
		$profile_relationship  = getreltionship_htmlstr($row['relationshipuser'], $row['relationshipsince'], $row['relationshipmode'], $row['relationshipaccepted']);
		$profile_ilike         = $row['ilike'];
		$profile_interestedin  = $row['interestedin'];
		$profile_goaloflife    = $row['goaloflife'];
		$profile_upfor         = $row['upfor'];
		$profile_aboutme       = $row['aboutme'];
		$profile_music         = $row['music'];
		$profile_movies        = $row['movies'];
		$profile_tvshows       = $row['tvshows'];
		$profile_books         = $row['books'];
		$profile_idols         = $row['idols'];
		$profile_quiz          = $row['quiz'];
		$profile_quotes        = $row['quotes'];
		
		$profile_websitelist   = $this->get_websitelisthtml($userid);
		
		
		if(!$profile_name        ) $rawdata = preg_replace('/hidenulls.name.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_description ) $rawdata = preg_replace('/hidenulls.description.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_motto       ) $rawdata = preg_replace('/hidenulls.motto.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_livesin     ) $rawdata = preg_replace('/hidenulls.livesin.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_hometown    ) $rawdata = preg_replace('/hidenulls.hometown.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_birth_day   ) $rawdata = preg_replace('/hidenulls.birth_day.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_gender      ) $rawdata = preg_replace('/hidenulls.gender.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_mood        ) $rawdata = preg_replace('/hidenulls.mood.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_listening_to) $rawdata = preg_replace('/hidenulls.listening_to.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_reading     ) $rawdata = preg_replace('/hidenulls.reading.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_relationship) $rawdata = preg_replace('/hidenulls.relationship.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_ilike       ) $rawdata = preg_replace('/hidenulls.ilike.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_interestedin) $rawdata = preg_replace('/hidenulls.interestedin.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_goaloflife  ) $rawdata = preg_replace('/hidenulls.goaloflife.end[\s\S]*?hidenullsend/e', "", $rawdata); 
		if(!$profile_upfor       ) $rawdata = preg_replace('/hidenulls.upfor.end[\s\S]*?hidenullsend/e', "", $rawdata);
        if(!$profile_aboutme     ) $rawdata = preg_replace('/hidenulls.aboutme.end[\s\S]*?hidenullsend/e', "", $rawdata);
        if(!$profile_music       ) $rawdata = preg_replace('/hidenulls.music.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_movies      ) $rawdata = preg_replace('/hidenulls.movies.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_tvshows     ) $rawdata = preg_replace('/hidenulls.tvshows.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_books       ) $rawdata = preg_replace('/hidenulls.books.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_idols       ) $rawdata = preg_replace('/hidenulls.idols.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_quiz        ) $rawdata = preg_replace('/hidenulls.quiz.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_quotes      ) $rawdata = preg_replace('/hidenulls.quotes.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_websitelist ) $rawdata = preg_replace('/hidenulls.web.end[\s\S]*?hidenullsend/e', "", $rawdata);
		
		
		$profile_details_count = 0;
		
		$profile_details_work        = "";
		$profile_details_edu         = "";
		$profile_details_activities  = "";
		
		$profile_friendgrid = $this->generate_friendgrid($userid);

		$udetails = mysql_query("select * from userdetails_".$userid.";");
		
		while($rud = mysql_fetch_array($udetails))
		{
			switch($rud['type'])
			{
			case 0: /* work */
				if($rud['idata3']) /* present workplace */
				{
					if($rud['idata1'])
						$profile_details_work .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (".$rud['idata1']." - Present)");
					else
						$profile_details_work .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (Present)");

				}else{
					if($rud['idata1'] && $rud['idata2'])
						$profile_details_work .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (".$rud['idata1']." - ".$rud['idata2'].")");
					else if($rud['idata1'] && !$rud['idata2'])
						$profile_details_work .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (From ".$rud['idata1'].")");
					else if($rud['idata2'] && !$rud['idata1'])
						$profile_details_work .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (Till ".$rud['idata2'].")");
					else
						$profile_details_work .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']);
				}
				
				break;
				
			case 1: /* edu */
				if($rud['idata3']) /* present workplace */
				{
					if($rud['idata1'])
						$profile_details_edu .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (".$rud['idata1']." - Present)");
					else
						$profile_details_edu .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (Present)");

				}else{
					if($rud['idata1'] && $rud['idata2'])
						$profile_details_edu .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (".$rud['idata1']." - ".$rud['idata2'].")");
					else if($rud['idata1'] && !$rud['idata2'])
						$profile_details_edu .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (From ".$rud['idata1'].")");
					else if($rud['idata2'] && !$rud['idata1'])
						$profile_details_edu .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (Till ".$rud['idata2'].")");
					else
						$profile_details_edu .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']);
				}
				break;
				
			case 2: /* activities */
				if($rud['idata3']) /* present workplace */
				{
					if($rud['idata1'])
						$profile_details_activities .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (".$rud['idata1']." - Present)");
					else
						$profile_details_activities .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (Present)");

				}else{
					if($rud['idata1'] && $rud['idata2'])
						$profile_details_activities .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (".$rud['idata1']." - ".$rud['idata2'].")");
					else if($rud['idata1'] && !$rud['idata2'])
						$profile_details_activities .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (From ".$rud['idata1'].")");
					else if($rud['idata2'] && !$rud['idata1'])
						$profile_details_activities .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']." (Till ".$rud['idata2'].")");
					else
						$profile_details_activities .= generate_detail_set($rud['detailid'], $rud['data1'], $rud['data2'], $rud['data3']);
				}
				break;
			}
		} 
		
		if(!$profile_details_work       ) $rawdata = preg_replace('/hidenulls.work.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_details_edu        ) $rawdata = preg_replace('/hidenulls.edu.end[\s\S]*?hidenullsend/e', "", $rawdata);
		if(!$profile_details_activities ) $rawdata = preg_replace('/hidenulls.activities.end[\s\S]*?hidenullsend/e', "", $rawdata);
		
		
		
		$profile_details_work       = $this->decodestr($profile_details_work);
		$profile_details_edu        = $this->decodestr($profile_details_work);
		$profile_details_activities = $this->decodestr($profile_details_work);
		$profile_name               = $this->decodestr($profile_name        );
		$profile_description        = $this->decodestr($profile_description );
		$profile_motto              = $this->decodestr($profile_motto       );
		$profile_livesin            = $this->decodestr($profile_livesin     );
		$profile_hometown           = $this->decodestr($profile_hometown    );
		$profile_birth_day          = $this->decodestr($profile_birth_day   );
		$profile_gender             = $this->decodestr($profile_gender      );
		$profile_mood               = $this->decodestr($profile_mood        );
		$profile_listening_to       = $this->decodestr($profile_listening_to);
		$profile_reading            = $this->decodestr($profile_reading     );
		$profile_relationship       = $this->decodestr($profile_relationship);
		$profile_ilike              = $this->decodestr($profile_ilike       );
		$profile_interestedin       = $this->decodestr($profile_interestedin);
		$profile_goaloflife         = $this->decodestr($profile_goaloflife  );
		$profile_upfor              = $this->decodestr($profile_upfor       );
		$profile_aboutme            = $this->decodestr($profile_aboutme     );
		$profile_music              = $this->decodestr($profile_music       );
		$profile_movies             = $this->decodestr($profile_movies      );
		$profile_tvshows            = $this->decodestr($profile_tvshows     );
		$profile_books              = $this->decodestr($profile_books       );
		$profile_idols              = $this->decodestr($profile_idols       );
		$profile_quiz               = $this->decodestr($profile_quiz        );
		$profile_quotes             = $this->decodestr($profile_quotes      );
		
		$profile_photostripset = $this->generate_ro_photostrip($userid, $profile_lid);
		
		$profile_displayps = "none";
		if($this->photostrip_pavailable) $profile_displayps = "inline";

		$profile_displaybkbar 		= 'none';
		$profile_displaybkbtn		= 'none';
		
		
		if(!$this->photostrip_pavailable && $userid == $_SESSION['uid'])
			$profile_displaybkbar 	= '';
		
		if($userid == $_SESSION['uid'])
			$profile_displaybkbtn	= '';
			
		$rawdata = str_replace("hidenullsend", "", $rawdata);
		$rawdata = preg_replace('/hidenulls.[\s\S]*?.end/e', "", $rawdata); 
		return preg_replace('/\{([a-z_0-9]+)\}/e', "$$1", $rawdata); 
	}
 
	function decodestr($s)
	{
		$s = str_replace('[-n-l-]', '<br/>', $s);
		$s = str_replace("[-q-]", "?", $s);
		return $s;
	}
 
 
	
	function vdef($cond, $dval)
	{
		if($cond) return $cond;
		else return "(".$dval.")";
	}
	
	function rawvdef($cond, $dval)
	{
		if($cond) return $cond;
		else return $dval;
	}
	
	function ordinal($input_number)
	{
		$number            = (string) $input_number;
		$last_digit        = substr($number, -1);
		$second_last_digit = substr($number, -2, 1);
		$suffix            = 'th';
		if ($second_last_digit != '1')
		{
			switch ($last_digit)
			{
			case '1':
				$suffix = 'st';
				break;
			case '2':
				$suffix = 'nd';
				break;
			case '3':
				$suffix = 'rd';
				break;
			default:
				break;
			}
		}
		
		if ((string) $number === '1') $suffix = 'st';
			return $number.$suffix;
	}
	
	function generate_detail_set($detailid, $title, $detail1, $detail2)
	{	
		return "<div class=\"infoleftbox\"><div class=\"infoleftmain\">".$title."</div><div class=\"infoleftdetail1\">".$detail1."</div><div class=\"infoleftdetail2\">".$detail2."</div></div>"; 
	}
	
	function generate_friendgrid($uid)
	{
		$ldata = "";
		
		$cf = mysql_query("select frienduserid from userfriends_".$uid." ORDER BY RAND() LIMIT 18");
		if(!$cf) return "";
		
		while($cfv = mysql_fetch_array($cf))
		{
			$fuid = $cfv['frienduserid'];
			if(!$fuid) continue;
		
			$fulid = translate_locationid($fuid, false, 7);
			$fugid = translate_userid($fuid, false, 6);
																						
			$ldata .= "<div class='inforightboxflistb'><a href='u$fugid'><img onerror='failsafe_img(this, 1);' src='data/u$fulid/dp/1.jpg' onmouseover=\"vusr(this, '$fugid');\"/></a></div>";
		}
		
		return $ldata;
	}
	
	function getmonthtext($mid)
	{
		if(!$mid) return "";
		
		$mset = array('', "January","February","March","April","May","June","July","August","September","October","November","December");
		
		if($mid > 12) return "";
		else if($mid < 0) return "";
		
		return $mset[$mid];
	}
	

	function generate_ro_photostrip($uid, $user_lid)
	{
		$backgroundmode = basics::setting_get_user($uid, 1, "long_background");
		
		
		if($backgroundmode)
		{
			$this->photostrip_pavailable = 1;
			return "<img src='data/u$user_lid/msc/profileback.jpg'/>";
		}
		
		/*if(!$backgroundmode)
		{
			$fdir = "data/u$user_lid/ps";
			$stext = "";
			$iv = 0;
			
			if($handle = opendir($fdir))
			{
				while (false !== ($entry = readdir($handle)))
				{
					if ($entry != "." && $entry != ".." && $entry != "Thumbs.db")
					{
						$stext .= "<div class='profiletoppic'><img src='data/u$user_lid/ps/$entry'/></div>";
						$iv++;
					}
				}
				closedir($handle);
			}

			$this->photostrip_pavailable = $iv;
			
			$stext = "<div class='handle' style='width: ".($iv * 220)."px;'> <div class='handle' style='width: ".($iv * 220)."px;'>".$stext."</div></div>";
			return $stext;
			
		}else{
		
			$this->photostrip_pavailable = 1;
			return "<img src='images/test/background.png'/>";
		}*/
		
		$albumid = 19;
		
		if(!$uid) $uid = $_SESSION['uid'];
		
		$luid = basics::quick_ulida($uid);
		$uida = basics::quick_uida($uid);
		
		$errorval = "<div class='pha_bigmessage'><b>Empty album</b><br/>Click here or drag and drop photos to begin...</div>";
		
		
		if(!basics::table_exists("albums_$uid")) return $errorval;
		
		/* get the album called "random" first */
		
		$res = basics::query("SELECT id FROM albums_$uid WHERE name = 'profile'");
		if(!$res) return $errorval;
		
		$r = mysql_fetch_array($res);
		if(!$r) return $errorval;
		
		$albumid = $r['id'];
		
		
		if(!$albumid)
			$res = basics::query("SELECT * FROM photos_$uid");
		else
			$res = basics::query("SELECT * FROM photos_$uid WHERE albumid=$albumid");
				
		if(!$res) return $errorval;
		
		$i = 0;
		
		$d = "";
		
		while($r = mysql_fetch_array($res))
		{
			$this->photostrip_pavailable = 1;
		
			$d .= $this->get_photobox($i, $luid, $r['id'], $r['fname'], $uida."-".$r['id']);

			$npostid = $r['postid'];
			$ppostid = $uida.'-'.basics::quicktranslate_encodenumber($npostid);
			$i++;
		}
		
		$res = basics::query("SELECT * FROM albums_$uid WHERE id=$albumid");
		if(!$res) return $errorval;
		
		$ra = mysql_fetch_array($res);
		if(!$ra) return $errorval;
		
		
		$d = "<div class='handle' style='width: ".($i * 220)."px;'> <div class='handle' style='width: ".($i * 220)."px;'>".$d."</div></div>";

		if(!$i)
			return $errorval;
		else
			return $d;
		
	}
	
	function get_photobox($indexv, $luid, $photoid, $fname, $picid)
	{
		
		return "<div class='profiletoppic'><img data-src='data/u$luid/pt/$fname.jpg'/></div>";

	}
}
?>