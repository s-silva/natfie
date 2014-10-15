<?php

	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/tools/idnumber.php"); 
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 
	
	$photostrip_pavailable = 0;

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
	
	function getreltionship_htmlstro($v)
	{
		if(!$v) return 0;
		$va = explode(",", $v);
		if(!$va) return 0;
		
		if(count($va) < 2) return 0;
		
		$rts = "(None)";
		$rsp = "";
		
		switch($va[0])
		{
		case 1: $rts = "Single"; break;
		case 2: $rts = "In a relationship"; break;
		case 3: $rts = "Married"; break;
		}
		
		if($va[0] > 1 && $va[3] != 0)
		{
			 if($va[1] > 0)
			 {
				$rsp = basics::get_username_from_id($va[1]);
				if($rsp != "")
				{
					$rsplid = basics::quick_uida($va[1]);
					$rsp = "<a href='u$rsplid' onmouseover=\"vusr(this, '$rsplid')\">".$rsp."</a>";
				
					if($va[0] == 2)
						$rsp = " with ".$rsp;
					else
						$rsp = " to ".$rsp;
				}
			 }
		}
		
		return $rts.$rsp;
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

	function profile_generate($userid, $usersid, $rawdata)
	{
		$res = mysql_query("select * from userdetails where userid='".$userid."';");
		$row = mysql_fetch_array($res);
	
		$profile_birth_dayfix  = ordinal(rawvdef($row['birth_day'], "01"));
		
		$profile_description   = vdef($row['description'], "Describe yourself");
		$profile_motto         = vdef($row['motto'], "A quote to describe yourself");
		$profile_livesin       = vdef($row['livesin'], "Your current location");
		$profile_hometown      = vdef($row['hometown'], "Your hometown");
		$profile_birth_year    = rawvdef($row['birth_year'], "2000");
		$profile_birth_month   = rawvdef(getmonthtext($row['birth_month']), "January");
		$profile_birth_day     = rawvdef($row['birth_day'], "01");
		$profile_gender        = vdef($row['gender'], "Male/Female");
		$profile_mood          = vdef($row['mood'], "Your mood");
		$profile_listening_to  = vdef($row['listening_to'], "Music you're currently listening to");
		$profile_reading       = vdef($row['reading'], "Books you're reading");
		$profile_relationship  = vdef(getreltionship_htmlstr($row['relationshipuser'], $row['relationshipsince'], $row['relationshipmode'], $row['relationshipaccepted']), "(None)");
		$profile_ilike         = vdef($row['ilike'], "What you like, food etc.");
		$profile_interestedin  = vdef($row['interestedin'], "Fields you're interested in");
		$profile_goaloflife    = vdef($row['goaloflife'], "Your goals of life");
		$profile_upfor         = vdef($row['upfor'], "You're ready for?");
		$profile_aboutme       = vdef($row['aboutme'], "Write something about yourself here");
		$profile_music         = vdef($row['music'], "List of your favourite music artist/band names");
		$profile_movies        = vdef($row['movies'], "List of movies you like");
		$profile_tvshows       = vdef($row['tvshows'], "List of TV shows you like");
		$profile_books         = vdef($row['books'], "List of your favourite authors and books");
		$profile_idols         = vdef($row['idols'], "List of your idols");
		$profile_quiz          = vdef($row['quiz'], "Select a quiz for yourself");
		$profile_quotes        = vdef($row['quotes'], "Write your favorite quotes here");
		$profile_displaybkbar  = 'none';
		$profile_displaybkbtn  = 'none';
		
		$profile_websitelist   = get_websitelisthtml($userid);
		
		$profile_details_count = 0;
		
		$profile_details_work        = "";
		$profile_details_edu         = "";
		$profile_details_activities  = "";
		
		$resudcount = mysql_query("SELECT Auto_increment FROM information_schema.tables WHERE table_name='userdetails_$userid' AND table_schema = DATABASE();");
		$resudcountrow = mysql_fetch_assoc($resudcount);
		
		$profile_details_count = $resudcountrow['Auto_increment'];
		
		$profile_friendgrid = generate_friendgrid($userid);

		
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
		
		
		$profile_details_work       = decodestr($profile_details_work);
		$profile_details_edu        = decodestr($profile_details_work);
		$profile_details_activities = decodestr($profile_details_work);
		$profile_description        = decodestr($profile_description );
		$profile_motto              = decodestr($profile_motto       );
		$profile_livesin            = decodestr($profile_livesin     );
		$profile_hometown           = decodestr($profile_hometown    );
		$profile_birth_day          = decodestr($profile_birth_day   );
		$profile_gender             = decodestr($profile_gender      );
		$profile_mood               = decodestr($profile_mood        );
		$profile_listening_to       = decodestr($profile_listening_to);
		$profile_reading            = decodestr($profile_reading     );
		$profile_relationship       = decodestr($profile_relationship);
		$profile_ilike              = decodestr($profile_ilike       );
		$profile_interestedin       = decodestr($profile_interestedin);
		$profile_goaloflife         = decodestr($profile_goaloflife  );
		$profile_upfor              = decodestr($profile_upfor       );
		$profile_aboutme            = decodestr($profile_aboutme     );
		$profile_music              = decodestr($profile_music       );
		$profile_movies             = decodestr($profile_movies      );
		$profile_tvshows            = decodestr($profile_tvshows     );
		$profile_books              = decodestr($profile_books       );
		$profile_idols              = decodestr($profile_idols       );
		$profile_quiz               = decodestr($profile_quiz        );
		$profile_quotes             = decodestr($profile_quotes      );
		
		
		
		$profile_photostripset = generate_photostrip($_SESSION['uid'], $_SESSION['uslid']);
		
		global $photostrip_pavailable;
		
		$profile_displaybkbar 		= 'none';
		$profile_displaybkbtn		= 'none';
		
		
		if(!$photostrip_pavailable && $userid == $_SESSION['uid'])
			$profile_displaybkbar 	= '';
		
		if($userid == $_SESSION['uid'])
			$profile_displaybkbtn	= '';
		
		$profile_displayps = "none";
		if($photostrip_pavailable) $profile_displayps = "inline";

		return preg_replace('/\{([a-z_0-9]+)\}/e', "$$1", $rawdata);
	}
	
	function decodestr($s)
	{
		$s = str_replace('[-n-l-]', '<br/>', $s);
		$s = str_replace("[-q-]", "?", $s);
		return $s;
	}
	
	function getmonthtext($mid)
	{
		if(!$mid) return "";
		
		$mset = array('', "January","February","March","April","May","June","July","August","September","October","November","December");
		
		if($mid > 12) return "";
		else if($mid < 0) return "";
		
		return $mset[$mid];
	}
	
	function generate_detail_set($detailid, $title, $detail1, $detail2)
	{
		return "<div class=\"infoleftbox\" id='pebox_work".$detailid."' onclick='javascript: pwboxedit_detail(".$detailid.", 0)'>".
					"<div id='pfinfo_work_plc".$detailid."' class=\"infoleftmain\">$title</div>".
					"<div id='pfinfo_work_loc".$detailid."' class=\"infoleftdetail1\">$detail1</div>".
					"<div id='pfinfo_work_dsc".$detailid."' class=\"infoleftdetail2\">$detail2</div>".
					"</div>";
					
		/*return "<div class=\"infoleftbox\"><div class=\"infoleftmain\">".$title."</div><div class=\"infoleftdetail1\">".$detail1."</div><div class=\"infoleftdetail2\">".$detail2."</div></div>"; */
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

	
	function generate_photostrip($uid, $user_lid)
	{
		/*
		$backgroundmode = basics::setting_get(1, "long_background");
		
		if(!$backgroundmode)
		{
			$fdir = "data/u$userslid/ps";
			$stext = "";
			$iv = 0;
			
			if($handle = opendir($fdir))
			{
				while (false !== ($entry = readdir($handle)))
				{
					if ($entry != "." && $entry != ".." && $entry != "Thumbs.db")
					{
						$stext .= "<div class='profiletoppic'><img src='data/u$userslid/ps/$entry'/></div>";
						$iv++;
					}
				}
				closedir($handle);
			}
			
			global $photostrip_pavailable;
			$photostrip_pavailable = $iv;

			$stext = "<div class='handle' style='width: ".($iv * 220)."px;'> <div class='handle' style='width: ".($iv * 220)."px;'>".$stext."</div></div>";
			return $stext;
		
		}else{
		
			global $photostrip_pavailable;
			$photostrip_pavailable = 1;
			return "<img src='images/test/background.png'/>";
		}
		*/
		
		$backgroundmode = basics::setting_get_user($uid, 1, "long_background");
		global $photostrip_pavailable;
		
		if($backgroundmode)
		{
			$photostrip_pavailable = 1;
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
			$photostrip_pavailable = 1;
		
			$d .= get_photobox($i, $luid, $r['id'], $r['fname'], $uida."-".$r['id']);

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
	

?>