<?php

include_once("basics.php");
include_once("talk.php");
include_once("mark.php");
include_once("photos.php");

class posts
{
	const post_type_text        = 1;
	const post_type_photo       = 2;
	const post_type_link_video  = 3;
	const post_type_link_audio  = 4;
	const post_type_link_url    = 5;
	const post_type_album       = 6;
	const post_type_albumphoto  = 7;
	
	const feed_style_classic  	= 1;
	const feed_style_garden     = 2;
	
	
	var $lfid;
	var $lftimeid;
	
	var $feed_style = self::feed_style_classic;

	var $feed_box_color = 0;
	
	var $res_profile_posts = 0;
	var $newspost_array = 0;
	var $newspost_arrayindex = 0;
	var $newspost_arraycount = 0;
	
	function __construct()
	{
		if($_SESSION['displaymodefeed'] == 1)
			$this->feed_style = self::feed_style_classic;
		else
			$this->feed_style = self::feed_style_garden;
	}
	
	function trim_text($input, $length, $ellipses = true, $ellipsest = '...')
	{
		if (strlen($input) <= $length) {
			return $input;
		}

		$last_space = strrpos(substr($input, 0, $length), ' ');
		
		/* if the words are too long (usual for chinese) */
		if($last_space > $length + 20 || $last_space < $length - 20) $last_space = $length;
		
		$trimmed_text = substr($input, 0, $last_space);

		if ($ellipses)
		{
			$trimmed_text .= $ellipsest;
		}
	  
		return $trimmed_text;
	}
	
	function create_post($touser, $ptype, $tcontent, $tcontent2, $tcontent3, $addtoblog, $visibility)
	{
		$writeruid = $_SESSION['uid'];
		
		if($touser) /* post to another user */
		{
			/* exit if not a friend [todo] check user's personal privacy settings for possibility of posting */
			if(!basics::isfriend($touser))return 0;
		}
		
		if(!$touser) $touser = $writeruid;
		//if($ptype < 1 || $ptype > 5) return 0;
		
		
		$div1      = 0;
		$div2      = 0;
		$ctext     = $tcontent;
		$posttype  = $ptype;
		$dtext     = '';
		
		switch($ptype)
		{
		case self::post_type_text:       
			break;
		case self::post_type_photo:
		case self::post_type_album:
			$div1      = $tcontent2;
			$div2      = $tcontent3;
			break;
		case self::post_type_link_video: 
		case self::post_type_link_audio: 
		case self::post_type_link_url:   
			$dtext = $tcontent2;
			break;
		}
		
		
		$ctext = basics::escapestr($ctext);
		
		$finalpid = 0;
	
		if($dtext)
			$dtext = basics::escapestr($dtext);
		
		basics::query("INSERT INTO posts_$touser  (uid, ptype, opid, utype, visibility, reports, rating1, rating2, rating3, rating4, wtime, ltime, mtime, rtime, type, ctext, dtext, div1, div2, tagcid, markcid, talkcid, repostscid, repostcount, remotehost, privacymode, filtergroup)".
						                  "values ($writeruid, 1, 0, 1, $visibility, 0, 0, 0, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), $posttype, '$ctext', '$dtext', $div1, $div2, 0, 0, 0, 0, 0, 0, 0, 0)");


		
		if($ptype == self::post_type_photo || $ptype == self::post_type_album ||  $ptype == self::post_type_albumphoto)
		{
			/* get post id */
			
			$resudcount = basics::query("SELECT Auto_increment FROM information_schema.tables WHERE table_name='posts_$touser' AND table_schema = DATABASE();");
			$resudcountrow = mysql_fetch_assoc($resudcount);
			
			$finalpid = $resudcountrow['Auto_increment'] - 1;
			
			return $finalpid;
		}else{
			return 1;
		}
	}
	
	function make_repost($touser, $opuid, $oppid, $visibility)
	{
		$writeruid = $_SESSION['uid'];
		
		if($touser) /* post to another user */
		{
			/* exit if not a friend [todo] check user's personal privacy settings for possibility of posting */
			if(!basics::isfriend($touser))return 0;
		}
		if(!$touser) $touser = $writeruid;
		

		$posttype  = 0;
		$ctext     = '';
		$dtext     = '';
		
		/* [todo] if it's just text or a link, copy ctext and dtext to save the repost even after the deletion of the original
		   plus probably should make a table with all repost uids and ids for instant deletion and statistics */

		basics::query("INSERT INTO posts_$touser  (uid, ptype, opid, utype, visibility, reports, rating1, rating2, rating3, rating4, wtime, ltime, mtime, rtime, type, ctext, dtext, div1, div2, tagcid, markcid, talkcid, repostscid, repostcount, remotehost, privacymode, filtergroup)".
						                  "values ($writeruid, 3, $opuid, 1, $visibility, 0, 0, 0, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), $posttype, '$ctext', '$dtext', $oppid, 0, 0, 0, 0, 0, 0, 0, 0, 0)");


	}

	function add_comment($uid, $postid, $ctext, $cdata)
	{
	
	
	}
	
	function get_profile_post_set($uid, $psince, $pmnumber, $psincemode, $psinceval)
	{
		$resposts = 0;
		
		if(!basics::table_exists("posts_$uid")) return 0;
		
		if(!$psinceval)
		{
			$resposts = basics::query("SELECT * FROM posts_$uid WHERE visibility=1 ORDER BY id DESC LIMIT $pmnumber"); 
		}else{
			if($psincemode == 0)
				$resposts = basics::query("SELECT * FROM posts_$uid WHERE id<$psinceval AND visibility=1 ORDER BY id DESC LIMIT $pmnumber"); 
		}
		
		$this->newspost_array = 0;
		$this->res_profile_posts = $resposts;
		return $resposts;
	}
	
	function get_news_post_set($uid, $psince, $pmnumber, $psincemode, $psinceval)
	{
		$resposts = 0;
		$farray = array();
		$farrayc = 0;
		
		if(!basics::table_exists("posts_$uid")) return 0;
		
		$sqv1 = 0;
		$sqv2 = 0;
		
		if(!$psinceval)
		{
			$sqv1 = "SELECT * FROM posts_";
			$sqv2 = " WHERE visibility=1 ORDER BY id DESC LIMIT $pmnumber"; 
			
		}else{
			if($psincemode == 0)
			{
				$sqv1 = "SELECT * FROM posts_";
				$sqv2 = " WHERE id<$psinceval AND visibility=1 ORDER BY id DESC LIMIT $pmnumber";

				//$resposts = basics::query("SELECT * FROM posts_17 WHERE id<$psinceval ORDER BY id DESC LIMIT $pmnumber"); 
			}else if($psincemode == 1){
			
				$tmval = date( 'Y-m-d H:i:s', $psinceval );
				$sqv1 = "SELECT * FROM posts_";
				$sqv2 = " WHERE wtime<'$tmval' AND visibility=1 ORDER BY id DESC LIMIT $pmnumber";
			
			}
		}
				
		$this->newspost_array = array();
		
		$this->newspost_arrayindex = 0;
		$this->newspost_arraycount = 0;
		$this->res_profile_posts = 0;
		
		$postrankid = 0;
		
		/* generate friend list [including self] */
		
		$cuid = $_SESSION['uid'];
		
		$farrayres = basics::query("SELECT frienduserid FROM userfriends_$cuid"); 
	
		array_push($farray, $cuid);
		$farrayc++;
		
		while($ffa = mysql_fetch_array($farrayres))
		{
			array_push($farray, $ffa['frienduserid']);
			$farrayc++;
		}
	
		/* generate news post array */

		
		if(!$sqv1 || !$sqv2) return 0;
		
		
		foreach($farray as $npuserid)
		{
			$resposts = basics::query($sqv1.$npuserid.$sqv2); 
			
			while($rpost = mysql_fetch_array($resposts))
			{
				$rpost['nparrayuid'] = $npuserid;
				$rpost['nparrayrankid'] = $postrankid;
				
				array_push($this->newspost_array, $rpost);
				
				$postrankid++;
				$this->newspost_arraycount++;
			}
		}


		usort($this->newspost_array, function($a, $b){
		
			$av = strtotime($a['wtime']);
			$bv = strtotime($b['wtime']);
			if($av == $bv) return 0;
			if($av < $bv) return 1;
			else return -1;
		});

		
		return $resposts;
	}
	
	function get_setnextpost(&$postowner)
	{
		
		if($this->res_profile_posts)
		{
			$postowner = 0;
			return mysql_fetch_array($this->res_profile_posts);
			
		}else{
			
			if($this->newspost_arrayindex >= $this->newspost_arraycount) return 0;
			
			$rv = $this->newspost_array[$this->newspost_arrayindex];
			
			
			$postowner = $rv['nparrayuid'];
			$this->newspost_arrayindex++;
			return $rv;
		}
		return 0;
	}
	
	/*
	 * uid - user id (if zero, it's friend feed)
	 * pmnumber - maximum posts to fetch
	 * psincemode - 0 - psince is just a post number
	 *              1 - psince is a starting time of the latest post
	 */
	function get_posts_html_classic($uid, $psince, $pmnumber, $psincemode)
	{
		$feedmode = $uid ? 1 : 0; /* 1 - posts, 0 - feed */
		
		$displaynote_count = 3; /* display maximum of 3 notes (todo - get from settings) */

		if($feedmode) $poaddmode = "_posts";
		else $poaddmode = "";
		
		if(!$uid) $uid = $_SESSION['uid'];
		
		$cuid   = $_SESSION['uid'];
		$cusid  = $_SESSION['usid'] ;
		$cuslid = $_SESSION['uslid'];
		$cuname = $_SESSION['ufirstname']." ".$_SESSION['ulastname']; 
		
		$cuop   = 0;
		
		$pgenindex = 0;
		$pgenlast_markertime = 0;
		
		$page = "";
		$pageex = "";
		$psinceval = 0;
		
		
		if($psince == "-1" || $psince == -1)
		{
			$this->lfid = "-1";
			$this->lftimeid = "-1";
			return "";
		}
		
		$postfooter = 	"<!--<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>".
							"<div class='feedc_cm_dp'><img src='data/u<data.user.lid>/dp/3.jpg' onerror='failsafe_img(this, 2);'/></div>".
							"<div class='feedc_cm_c'>".
								"<div class='expandingArea' style='margin-left: 0px; min-height: 20px; width: 300px;'>".
										"<pre><span></span><br></pre>".
										"<textarea class='newc_textarea' autocomplete='off' placeholder='Leave a note...'></textarea>".
								"</div>".
							"</div>".
							"<div style='clear: both;'></div>".
						"</div></div>-->".
					"</div>".
				"</div></div>";
				
				
		if($psincemode == 0 && $psince) /* find the position where the last post is */
		{
			$psva = explode("-", $psince);
			
			if(count($psva) > 1)
			{
				$psvad = basics::quicktranslate_decodenumber($psva[1]);
				$psinceval = $psvad;
			}
		}else if($psincemode == 1 && $psince){ /* by time */
		
			$psinceval = $psince;
		}
		
		if($feedmode)
			$resposts = $this->get_profile_post_set($uid, $psince, $pmnumber, $psincemode, $psinceval);
		else
			$resposts = $this->get_news_post_set($uid, $psince, $pmnumber, $psincemode, $psinceval);
				
		
		

		if(!$resposts)
		{
			$this->lfid = "-1";
			$this->lftimeid = "-1";
			return "";
		}
		$puniqueid = "-1";
		
		$talkcls = new talk(); 
		
		$postowner = $uid;
		$llooptime = 0;
			
		while($rpost = $this->get_setnextpost($postowner))
		{		
			$puid    = $rpost['uid'];
			$pgenindex++;
			
			$llooptime = $rpost['wtime'];
			
			if(!$postowner) $postowner = $uid;
			
			if($this->feed_style == self::feed_style_garden && $feedmode != 1)
				$postm = $this->get_singlepost_html_garden($postowner, $rpost, $feedmode, $pgenindex, $displaynote_count, $talkcls, $pgenlast_markertime, $puniqueid, 0);
			else
				$postm = $this->get_singlepost_html($postowner, $rpost, $feedmode, $pgenindex, $displaynote_count, $talkcls, $pgenlast_markertime, $puniqueid, 0);


			if($this->feed_style == self::feed_style_garden && $feedmode != 1)
			{
				$page .= $postm;
			}else{
				if(!$feedmode)
				{
					$page .= $postm . $postfooter;
				}else{
					if($pgenindex % 2)
						$page .= $postm . $postfooter;
					else
						$pageex .= $postm . $postfooter;
				}
			}
		}
		
		$this->lfid = $puniqueid;
		$this->lftimeid = strtotime($llooptime);
		
		
		if(!$feedmode)
			return $page;
		else
			return array($page, $pageex);
	}
	
	function get_marks_html($mobj, $powner, $postid, $noteid)
	{
		$cbarvals = "";
		$cmarkvals = "";
		$cmarkarray = array(0, 0, 0, 0, 0);
		$ucmarkarray = array(0, 0, 0, 0, 0);
		
		if($mobj)
		{
			$cmaarray = $mobj->get_marks($powner, $postid, $noteid, 1);
			
			$cmarkarray[0] = $cmaarray[0];
			$cmarkarray[1] = $cmaarray[1];
			$cmarkarray[2] = $cmaarray[2];
			$cmarkarray[3] = $cmaarray[3];
			$cmarkarray[4] = $cmaarray[4];
			
			$ucmarkarray[0] = $cmaarray[5];
			$ucmarkarray[1] = $cmaarray[6];
			$ucmarkarray[2] = $cmaarray[7];
			$ucmarkarray[3] = $cmaarray[8];
			$ucmarkarray[4] = $cmaarray[9];
		}else{
			return 0;
		}
		
		
		if($cmarkarray[0]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -64px -19px;'></div> ".$cmarkarray[0]."</a>";
		if($cmarkarray[1]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position:  0px  -20px;'></div> ".$cmarkarray[1]."</a>";
		if($cmarkarray[2]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -17px -18px;'></div> ".$cmarkarray[2]."</a>";
		if($cmarkarray[3]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -32px -19px;'></div> ".$cmarkarray[3]."</a>";
		if($cmarkarray[4]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -49px -18px;'></div> ".$cmarkarray[4]."</a>";
		
		return array($cmarkvals, $cmarkarray, $ucmarkarray);
	}
	
	function get_note_set_html($postuid, $postid, $fnoteid, $notecount, $mode)
	{
		$rrpost = basics::query("SELECT * FROM posts_$postuid WHERE id=$postid"); 
		$rpost = mysql_fetch_array($rrpost);
		
		$talkcls = new talk(); 
		
		if($rpost['talkcid'])
			$pnoteset = $talkcls->get_notes($postuid, $rpost['id'], $fnoteid, talk::sincemode_set, 1, $notecount);
			
		$postuida = basics::quick_uida($postuid);
		$puniqueid = $postuida.'-'.basics::quicktranslate_encodenumber($rpost['id']);
		
		$postnotes = "";
			
		$nnotes = count($pnoteset);
			
		if($nnotes)
			$ifnoteid = $pnoteset[0][0];
			
		$mcmark = 0;

		if($rpost['markcid'])
			$mcmark = new mark();
			
		
		
		for($i=0; $i<$nnotes; $i++)
		{
			$inote     = $pnoteset[$i][1];
			$inotetime = strtotime($pnoteset[$i][2]);
			$inoteid   = $pnoteset[$i][0];
			$inoteuid  = $pnoteset[$i][3];
			
			$ownnotep = 0;
			
			//if($inoteuid == $cuid)
			//{
			//	$notepusid  = $cusid;
			//	$noteculid = $cuslid;
			//	$notecuname = $cuname;
			//	$ownnotep    = 1;
			//}else{
				$notepusid  = basics::quick_uida($inoteuid);
				$noteculid  = basics::quick_ulida($inoteuid);
				$notecuname = basics::get_username_from_id($inoteuid);
			//}
			
			//if($powner == $cuid)$ownnotep    = 1;
			
			$noteids = "pcd".$puniqueid;
			$notetsyncid  = "ctv".$noteids.$inoteid;
			$noteccuid    = $noteids."_".$inoteid;
	
			if($i % 2)	$oddev = "o";
			else $oddev = "e";
			
			$inote = str_replace("[-q-]", "?", $inote);
			$inote = str_replace("[-n-l-]", "<br/>", $inote);
			
			$inote = basics::decode_tagcodes($inote);
			$inote = basics::translate_urls_to_html($inote);
			
			if($ownnotep)
				$notedelp = "<samp title='Double click to remove note' ondblclick='fc_notedel(\"$noteccuid\")'><div class='feedc_cm_cdel' ></div></samp>";
			else
				$notedelp = "<samp title='Double click to report note' ondblclick='fc_notereport(\"$noteccuid\")'><div class='feedc_cm_cdel'></div></samp>";
			
			$notemarkshtml = "";
			$notemarkvalsuc = array(0, 0, 0, 0, 0);
			$notemarkvalsac = array(0, 0, 0, 0, 0);
			
			if($mcmark)
			{
				$notemarkvals = $this->get_marks_html($mcmark, $postuid, $rpost['id'], $inoteid);
				$notemarkshtml = $notemarkvals[0];
				
				if($notemarkvals[2])
				{
					$notemarkvalsuc[0] = $notemarkvals[2][0];
					$notemarkvalsuc[1] = $notemarkvals[2][1];
					$notemarkvalsuc[2] = $notemarkvals[2][2];
					$notemarkvalsuc[3] = $notemarkvals[2][3];
					$notemarkvalsuc[4] = $notemarkvals[2][4];
				}
				
				if($notemarkvals[1])
				{
					$notemarkvalsac[0] = $notemarkvals[1][0];
					$notemarkvalsac[1] = $notemarkvals[1][1];
					$notemarkvalsac[2] = $notemarkvals[1][2];
					$notemarkvalsac[3] = $notemarkvals[1][3];
					$notemarkvalsac[4] = $notemarkvals[1][4];
				}
			}
			
			$postnotes .= 	"<div class='feedc_cm_line feedc_cm_line_" . $oddev . "' id='feedc_cm_line_tct" . $noteccuid . "'><div class='feedc_cmli'>" .
							"<div class='feedc_cm_dp'><img src='data/u" . $noteculid . "/dp/3.jpg'/></div>" .
							"<div class='feedc_cm_c'>$notedelp" .
							"<div id='feedc_cm_line_tdt" . $noteccuid . "'><a onmouseover='vusr(this, \"$notepusid\");' href='u$notepusid' class='feedc_pouname'>" . $notecuname . " </a>" . $inote .
								"</div><div class='feedc_ponote_ctr'><abbr class='synctime' id='" . $notetsyncid . "' data-mode='0' data-ts='" . $inotetime . "'></abbr> <div style='display: inline-block;' id='mkcd$puniqueid-$noteccuid'>$notemarkshtml</div> <samp> . <a data-attch='mkcd$puniqueid-$noteccuid' data-nid='$puniqueid"."-$noteccuid' data-ua='".$notemarkvalsuc[0]."' data-ub='".$notemarkvalsuc[1]."' data-uc='".$notemarkvalsuc[2]."' data-ud='".$notemarkvalsuc[3]."' data-ue='".$notemarkvalsuc[4]."' data-a='".$notemarkvalsac[0]."' data-b='".$notemarkvalsac[1]."' data-c='".$notemarkvalsac[2]."' data-d='".$notemarkvalsac[3]."' data-e='".$notemarkvalsac[4]."' onclick='markbox_show(this);'>Mark</a></samp></div>" .
							"</div><div style='clear: both;'></div></div></div>";
		}
			
		return $nnotes."-".$ifnoteid."_".$postnotes;
	}
	
	/*
	 * displaymode
	 *
	 *	0 - classical posts/feed.
	 *	1 - single post
	 *  2 - single post in a popup
	 *  3 - photo album
	 *  4 - single photo
	 *  5 - single photo in a popup
	 *	6 - just notes and header (popup)
	 */
	 
	function get_singlepost_html($powner, $rpost, $feedmode, $pgenindex, $displaynote_count, $talkcls, &$pgenlast_markertime, &$puniqueid, $displaymode)
	{
		if(!$talkcls) $talkcls = new talk(); 
		
		if($feedmode) $poaddmode = "_posts";
		else $poaddmode = "";
		
		$feed_powner = 0;
		$repost_fromuser = 0;
		$postmode = 0; /* 1 if repost */
		$repost_rpost = 0;
		$ifnoteid = 0; /* first note id (for expanding notes) */
		
		$cuid   = $_SESSION['uid'];
		$cusid  = $_SESSION['usid'] ;
		$cuslid = $_SESSION['uslid'];
		$cuname = $_SESSION['ufirstname']." ".$_SESSION['ulastname']; 
		
		if($rpost['uid'] == $_SESSION['uid'])
		{
			$org_pusid  = $cusid;
			$org_puslid = $cuslid;
			$org_puname = $cuname;
		}else{
			$org_pusid  = basics::quick_uida($rpost['uid']);
			$org_puslid = basics::quick_ulida($rpost['uid']);
			$org_puname = basics::get_username_from_id($rpost['uid']);
		}

		$org_wtime = strtotime($rpost['wtime']);
		
		if($rpost['ptype'] == 2 || $rpost['ptype'] == 3) /* repost or tagged post */
		{
			$postmode = 1;
			
			$rpuid = $rpost['opid'];
			$rppid = $rpost['div1'];
			
			$repost_fromuser = $rpuid;
			//$powner = $repost_fromuser = $rpuid;
			
			$resrpost = basics::query("SELECT * FROM posts_$rpuid WHERE id=$rppid"); 
			$repost_rpost = mysql_fetch_array($resrpost);
		}
	
		
		$puid    = $rpost['uid'];
		$psowner = basics::quick_uida($powner);
		
		if($puid == $cuid)
		{
			$pusid  = $cusid;
			$puslid = $cuslid;
			$puname = $cuname;
			$cuop = 1;
		}else{
			$pusid  = basics::quick_uida($puid);
			$puslid = basics::quick_ulida($puid);
			$puname = basics::get_username_from_id($puid);
			$cuop = 0;
		}
		
		//$puniqueid = $pusid.$rpost['id'];
		
		$puniqueid = $cuniqueid = $psowner.'-'.basics::quicktranslate_encodenumber($rpost['id']);
		
		$popuid = $pusid;
		$poppid = basics::quicktranslate_encodenumber($rpost['id']);
		
		if($displaymode != 6)
		{
			$pcdata = $rpost['ctext'];
			$pcdata = str_replace("[-q-]", "?", $pcdata);
			$pcdata = "<p>".str_replace("[-n-l-]", "</p><p>", $pcdata)."</p>";
			
			$pcdata = basics::decode_tagcodes($pcdata);
			$pcdata = basics::translate_urls_to_html($pcdata);
			$pcdatam = self::trim_text($pcdata, 400, true, "... <div class='feedc_potop_exp'><a href='javascript: fc_post_expand(\"pidtds$puniqueid\", \"pidtdl$puniqueid\", 0)'>...</a></div>");
		
		}else{
			$pcdata = "";
			$pcdatam = "";
		}
		
		
		$wtime = strtotime($rpost['wtime']);
		
		
		
		$hpicdata = "";
		
		if($displaymode != 6) /* no content, just notes */
		{
			if($postmode == 0) /* repost */
			{
				$cposttype = $rpost['type'];
				$cpostdata = $rpost;
			}else{
				$cposttype = $repost_rpost['type'];
				$cpostdata = $repost_rpost;
			}
			
			if($cposttype == 1 && $postmode == 1)
			{
				$sp_pcdata = $cpostdata['ctext'];
				$sp_pcdata = str_replace("[-q-]", "?", $sp_pcdata);
				$sp_pcdata = str_replace("[-n-l-]", "<br/>", $sp_pcdata);
				
				$sp_pcdata = basics::decode_tagcodes($sp_pcdata);
				$sp_pcdata  = basics::translate_urls_to_html($sp_pcdata);
				$sp_pcdatam = self::trim_text($sp_pcdata, 400, true, "... <div class='feedc_potop_exp'><a href='javascript: fc_post_expand(\"sp_pidtds$puniqueid\", \"sp_pidtdl$puniqueid\", 0)'>...</a></div>");
			
				$hpicdata = "<div class='feedc_picm_dtquote'><b class='feedc_picm_dtquotest'>&ldquo;</b><div id='sp_pidtds$puniqueid'>$sp_pcdatam</div><div id='sp_pidtdl$puniqueid' style='display: none;'>$sp_pcdata</div><b class='feedc_picm_dtquoteen'>&rdquo;</b></div>";
			}
			
			if($cposttype == 3)
			{
			
				$mvrpdtext = $cpostdata['dtext'];
				
				$turl    = "";
				$mvurl   = "";
				$mvsite  = "";
				$mvtitle = "";
				$mvdsc   = "";
				$mvdur   = "";
				

				/* unserialize data */
				
				if($mvrpdtext)
				{
					$nv = unserialize($mvrpdtext);
					
					
					/* ed_url, ed_thumb, ed_site, ed_title, ed_dsc, ed_dur */
					
					
					$turl    = posts::translate_text_post($nv[1]);
					$mvurl   = posts::translate_text_post($nv[0]);
					$mvsite  = posts::translate_text_post($nv[2]);
					$mvtitle = posts::translate_text_post($nv[3]);
					$mvdsc   = posts::translate_text_post($nv[4]);
					$mvdur   = posts::translate_text_post($nv[5]);
					
				
					if($displaymode == 0) /* normal post, thumbnail photo */
					{
						$hpicdata = "<div class='feedc_picb'><div class='feedc_picm' >".
									"<img data-src='$turl'/ width='337px' onload='newpostimg_center(this);' onerror='newpostimg_err(this)'/>".
								"<div class='feedc_picm_vc' onclick=\"fc_post_expand_video('$mvsite', '$mvurl', 'pidtdlvttl$puniqueid', 'pidtdl$puniqueid', '$puname', '$puslid', '$pusid', '$puniqueid')\"><div class='feedc_picm_vcplay'></div><div class='feedc_picm_vcdur'>$mvdur</div></div></div><a href='$mvurl' style='text-decoration: none;' target='_blank'><div class='feedc_picbvt' id='pidtdlvttl$puniqueid'>$mvtitle</div></a><div class='feedc_picbvs'>$mvsite</div></div>";
		
					}else{ /* everything else needs a full embedded video preview */
					
						if($mvsite == "Youtube.com")
						{
							preg_match('/[\\?\\&]v=([^\\?\\&]+)/', $mvurl, $matches);
							
							if(count($matches[1]) >= 1)
							{
								$mvmu = $matches[1];
								
								$hpicdata = "<div class='singlepost_sdata'>".
											"<object width='640' height='360'><param name='movie' value='http://www.youtube.com/v/$mvmu?version=3'><param name='allowFullScreen' value='true'><param name='allowscriptaccess' value='always'><param name='wmode' value='opaque'><embed src='http://www.youtube.com/v/$mvmu?version=3' type='application/x-shockwave-flash' width='640' height='360' allowscriptaccess='always' allowfullscreen='true' wmode='opaque'></object>".
										"</div>";
							}
						}
						
						
						$hpicdata .= "<div class='singlepost_ddetails'>".
										"<div class='singlepost_ddetails_t'><a href='$mvurl'>$mvtitle</a></div>".
										"<div class='singlepost_ddetails_u'>$mvsite</div>".
									"</div>";
					}
				}
			}else if($rpost['type'] == self::post_type_album){
			
				$postphotoct = new photos;
				$postphotoctcvpid = 0;
				$postphotoctfile = $postphotoct->photo_getfile($powner, $rpost['div1'], 0, 0, $postphotoctcvpid);
				$postphotoctalbumid = $rpost['div1'];
				$postphotoct_albumsid = basics::quicktranslate_encodenumber_pad($postphotoctalbumid, 4);
				$postphotoct_photosid = basics::quicktranslate_encodenumber_pad($postphotoctcvpid, 4);
			
				$postphotoct_albname = "Untitled";
				$postphotoct_albdsc  = "";
				$postphotoct_albloc  = "Not set";
				
				$postphotoct->album_getinfo($powner, $postphotoctalbumid, $postphotoct_albname, $postphotoct_albdsc, $postphotoct_albloc);
				
				$pcdatam = $postphotoct_albdsc;
				$pcdata = $postphotoct_albdsc;
				
				$hpicdata .= "<div class='feedc_picb'><div class='feedc_picm' >".
									"<img data-src='$postphotoctfile'/ width='337px' onload='newpostimg_center(this);' onclick=\"fc_post_expand_album('$pusid', $postphotoctalbumid, $postphotoctcvpid, '$puniqueid')\">".
								"</div><a href='albums.$pusid.$postphotoct_albumsid' style='text-decoration: none;'><div class='feedc_picbvt' id='pidtdlvttl$puniqueid'>$postphotoct_albname</div></a><div class='feedc_picbvs'></div><div class='feedc_picbvl'>$postphotoct_albloc</div></div>";
								"<div class='singlepost_ddetails'>".
										"<div class='singlepost_ddetails_t'></div>".
										"<div class='singlepost_ddetails_u'></div>".
									"</div>";
			}
		}
		
		$posttmarker = "";
		
		if(($pgenindex % 2) && $feedmode)
		{
			$ptmtime = strtotime($rpost['wtime']);
			$ptmtimem = date('n', $ptmtime);
			if($ptmtimem != $pgenlast_markertime)
			{
				$ptmtime = "<abbr class='synctime' data-ts='$ptmtime' data-mode='3'></abbr>";
				$posttmarker = "<div class='feedc_post_timemarker'><div class='feedc_post_timemarkerin'>$ptmtime</div></div>";
			}
			$pgenlast_markertime = $ptmtimem;
		}			
		
		if($cuop)
		{
			$linkuid_pusid = 'pu'.$pusid;
			$linkuid_vusr  = "";
		}else{
			$linkuid_pusid = 'u'.$pusid;
			$linkuid_vusr  = " onmouseover=\"vusr(this, '$pusid')\"";
		}
		
		$pnoteset = 0;
		
		if($rpost['talkcid'])
			$pnoteset = $talkcls->get_notes($powner, $rpost['id'], $displaynote_count, talk::sincemode_last, 1, 0);
			
		$postnotes = "";
		
		$ncnotes = 0; /* number of notes there (invisible etc.) */
		$nnotes = 0;
		$mnid = 0;
		$previousnotesdisplay = "none";
		$mcmark = 0;
		
		if($rpost['talkcid'])
			$mnid = $talkcls->get_lastnote_id($powner, $rpost['id'], 1);
			
		if($rpost['talkcid'])
			$ncnotes = $talkcls->get_notes_count($powner, $rpost['id'], 1);
			
			
		if($rpost['markcid'])
			$mcmark = new mark();
			
		if($pnoteset)
		{			
			//foreach ($pnoteset as &$inote)
			//{
			//	$postnotes .= $inote;
			//}
			//
			//unset($inote);
			
			
			$nnotes = count($pnoteset);
			
			if($nnotes)
				$ifnoteid = $pnoteset[0][0];
				
			
			for($i=0; $i<$nnotes; $i++)
			{
				$inote = $pnoteset[$i][1];
				$inotetime = strtotime($pnoteset[$i][2]);
				$inoteid = $pnoteset[$i][0];
				$inoteuid = $pnoteset[$i][3];
				
				$ownnotep = 0;
				
				if($inoteuid == $cuid)
				{
					$notepusid  = $cusid;
					$noteculid = $cuslid;
					$notecuname = $cuname;
					$ownnotep    = 1;
				}else{
					$notepusid  = basics::quick_uida($inoteuid);
					$noteculid = basics::quick_ulida($inoteuid);
					$notecuname = basics::get_username_from_id($inoteuid);
				}
				
				if($powner == $cuid)$ownnotep    = 1;
				
				$noteids = "pcd".$puniqueid;
				$notetsyncid  = "ctv".$noteids.$inoteid;
				$noteccuid    = $noteids."_".$inoteid;
		
				if($i % 2)	$oddev = "o";
				else $oddev = "e";
				
				$inote = str_replace("[-q-]", "?", $inote);
				$inote = str_replace("[-n-l-]", "<br/>", $inote);
				
				$inote = basics::decode_tagcodes($inote);
				$inote = basics::translate_urls_to_html($inote);
				
				if($ownnotep)
					$notedelp = "<samp title='Double click to remove note' ondblclick='fc_notedel(\"$noteccuid\")'><div class='feedc_cm_cdel' ></div></samp>";
				else
					$notedelp = "<samp title='Double click to report note' ondblclick='fc_notereport(\"$noteccuid\")'><div class='feedc_cm_cdel'></div></samp>";
				
				$notemarkshtml = "";
				$notemarkvalsuc = array(0, 0, 0, 0, 0);
				$notemarkvalsac = array(0, 0, 0, 0, 0);
				
				if($mcmark)
				{
					$notemarkvals = $this->get_marks_html($mcmark, $powner, $rpost['id'], $inoteid);
					$notemarkshtml = $notemarkvals[0];
					
					if($notemarkvals[2])
					{
						$notemarkvalsuc[0] = $notemarkvals[2][0];
						$notemarkvalsuc[1] = $notemarkvals[2][1];
						$notemarkvalsuc[2] = $notemarkvals[2][2];
						$notemarkvalsuc[3] = $notemarkvals[2][3];
						$notemarkvalsuc[4] = $notemarkvals[2][4];
					}
					
					if($notemarkvals[1])
					{
						$notemarkvalsac[0] = $notemarkvals[1][0];
						$notemarkvalsac[1] = $notemarkvals[1][1];
						$notemarkvalsac[2] = $notemarkvals[1][2];
						$notemarkvalsac[3] = $notemarkvals[1][3];
						$notemarkvalsac[4] = $notemarkvals[1][4];
					}
				}
				
				$postnotes .= 	"<div class='feedc_cm_line feedc_cm_line_" . $oddev . "' id='feedc_cm_line_tct" . $noteccuid . "'><div class='feedc_cmli'>" .
								"<div class='feedc_cm_dp'><img src='data/u" . $noteculid . "/dp/3.jpg'/></div>" .
								"<div class='feedc_cm_c'>$notedelp" .
								"<div id='feedc_cm_line_tdt" . $noteccuid . "'><a onmouseover='vusr(this, \"$notepusid\");' href='u$notepusid' class='feedc_pouname'>" . $notecuname . " </a>" . $inote .
									"</div><div class='feedc_ponote_ctr'><abbr class='synctime' id='" . $notetsyncid . "' data-mode='0' data-ts='" . $inotetime . "'></abbr> <div style='display: inline-block;' id='mkcd$puniqueid-$noteccuid'>$notemarkshtml</div> <samp> . <a data-attch='mkcd$puniqueid-$noteccuid' data-nid='$puniqueid"."-$noteccuid' data-ua='".$notemarkvalsuc[0]."' data-ub='".$notemarkvalsuc[1]."' data-uc='".$notemarkvalsuc[2]."' data-ud='".$notemarkvalsuc[3]."' data-ue='".$notemarkvalsuc[4]."' data-a='".$notemarkvalsac[0]."' data-b='".$notemarkvalsac[1]."' data-c='".$notemarkvalsac[2]."' data-d='".$notemarkvalsac[3]."' data-e='".$notemarkvalsac[4]."' onclick='markbox_show(this);'>Mark</a></samp></div>" .
								"</div><div style='clear: both;'></div></div></div>";
			}
			
		
		}
		
	
		if($nnotes)
		{
			$postaddbtn = 	"<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>".
								"<div class='feedc_cm_dp'><img src='data/u" . $cuslid . "/dp/3.jpg' onerror='failsafe_img(this, 3);'/></div><div class='feedc_cm_c'>".
					/*				"<div id='" . $cuniqueid . "aci' class='expandingArea' style='margin-left: 0px; margin-top: 2px; min-height: 20px; width: 100%; border: 1px solid #f0f1f2;'>".
										"<pre><span></span><br></pre>".
										"<textarea onclick='fc_comment_button(\"pcd$puniqueid\")' id='" . $cuniqueid . "acit' class='newc_textarea' autocomplete='off' placeholder='Leave a Note...'></textarea></div>".
					*/				
								"<div class='feedc_cm_cm'><div onclick='fc_comment_button_ex(\"pcd$puniqueid\")' style='outline: none; padding: 2px 4px 2px 4px;' id='pcd" . $cuniqueid . "acit' contenteditable='plaintext-only'></div><div class='feed_cm_ph'>Leave a note...</div></div>".
							"</div><div style='clear: both;'></div></div></div>";
		}else{
			$postaddbtn = "";
		}
		
		$cbarvals = "";
		$cmarkvals = "";
		$cmarkarray = array(0, 0, 0, 0, 0);
		$ucmarkarray = array(0, 0, 0, 0, 0);
		
		if($mcmark)
		{
			$cmaarray = $mcmark->get_marks($powner, $rpost['id'], 0, 1);
			
			$cmarkarray[0] = $cmaarray[0];
			$cmarkarray[1] = $cmaarray[1];
			$cmarkarray[2] = $cmaarray[2];
			$cmarkarray[3] = $cmaarray[3];
			$cmarkarray[4] = $cmaarray[4];
			
			$ucmarkarray[0] = $cmaarray[5];
			$ucmarkarray[1] = $cmaarray[6];
			$ucmarkarray[2] = $cmaarray[7];
			$ucmarkarray[3] = $cmaarray[8];
			$ucmarkarray[4] = $cmaarray[9];
		}
		
		
		if($cmarkarray[0]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -64px -19px;'></div> ".$cmarkarray[0]."</a>";
		if($cmarkarray[1]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position:  0px  -20px;'></div> ".$cmarkarray[1]."</a>";
		if($cmarkarray[2]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -17px -18px;'></div> ".$cmarkarray[2]."</a>";
		if($cmarkarray[3]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -32px -19px;'></div> ".$cmarkarray[3]."</a>";
		if($cmarkarray[4]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -49px -18px;'></div> ".$cmarkarray[4]."</a>";
		
		
		if($ncnotes > $displaynote_count)
		{
			$previousnotesdisplay = "block";
			$cbarvals .= " . <div class='boxc_inline boxc_icm'></div>$ncnotes";
		}
		
		$feedc_cm_set = "feedc_cm_set";
		$feedc_potop_t = "feedc_potop_t";
		$ncnotediv = "";
		
		
		$putousername = "";
		
		if($powner != $puid && !$feedmode)
			$putousername = " - <a href='pu$psowner' class='feedc_pouname' style='font-weight: normal;'>".basics::get_username_from_id($powner)."</a>";
		
		
		if($repost_fromuser)
			$putousername .= " <a style='color: #aaaaaa;'> from </a> <a href='pu".basics::quick_uida($repost_fromuser)."' class='feedc_pouname' style='font-weight: normal;'>".basics::get_username_from_id($repost_fromuser)."</a>";
			
		if($ncnotes)
			$ncnotediv = "";//<div class='boxc_i boxc_icm'></div><div class='boxc_icmd'>$ncnotes</div>";
		
		$icmsourcebtn = "";
		if($repost_fromuser)
		{
			$icmsourceid = "c".basics::quick_uida($repost_fromuser)."-".basics::quicktranslate_encodenumber($repost_rpost['id']);
			$icmsourcebtn = "<a href='$icmsourceid'><div title='Go to the source' class='boxc_i boxc_source' style='margin-right: 2px;' ></div></a>";
		}	
		
		if($displaymode == 0)
		{
			$postm =	"<div class='feedc_poout$poaddmode' id='feedcpoout$puniqueid'>$posttmarker<div class='feedc_poin$poaddmode'>".
							"<span><div class='feedc_boxc$poaddmode'>$ncnotediv<span>$icmsourcebtn<div title='Share' class='boxc_i boxc_share' onclick=\"repost_publish(0, '$popuid', '$poppid');\" style='margin-right: 2px;' ></div><div class='boxc_i boxc_close' onclick='show_feedpopup(1, this, 1, \"$puniqueid\");'></div></span></div></span>".
							"<div class='feedc_potop'>".
								"<div class='feedc_potop_dp'><a href='$linkuid_pusid'><img src='data/u$org_puslid/dp/2.jpg' onerror='failsafe_img(this, 2);'/></a></div>".
								"<div class='feedc_potop_c'>".
									"<a href='$linkuid_pusid' class='feedc_pounamem' $linkuid_vusr>$org_puname</a>$putousername";
		}else{
			$feedc_cm_set = "feedc_cm_sets";
			$feedc_potop_t = "singlepost_stext";
			
			$postm =	"<div class='feedc_psoout$poaddmode' id='feedcpoout$puniqueid'>$posttmarker<div class='feedc_psoin$poaddmode'>".
							"<span><div class='feedc_boxc$poaddmode'>$ncnotediv<span><div title='Share' class='boxc_i boxc_share' onclick=\"repost_publish(0, '$popuid', '$poppid');\" style='margin-right: 2px;' ></div><div class='boxc_i boxc_close' onclick='show_feedpopup(1, this, 1, \"$puniqueid\");'></div></span></div></span>".
							"<div class='feedc_psotop'><div class='feedc_psotop_c'>";

		}
		
		$postm .=	"<div class='$feedc_potop_t'><div id='pidtds$puniqueid'>$pcdatam</div><div id='pidtdl$puniqueid' style='display: none;'>$pcdata</div></div>".
								$hpicdata.
								"<div class='feedc_potop_ctr'>".
									"<a data-attch='mkcd$puniqueid' data-nid='$puniqueid"."_0' data-ua='".$ucmarkarray[0]."' data-ub='".$ucmarkarray[1]."' data-uc='".$ucmarkarray[2]."' data-ud='".$ucmarkarray[3]."' data-ue='".$ucmarkarray[4]."' data-a='".$cmarkarray[0]."' data-b='".$cmarkarray[1]."' data-c='".$cmarkarray[2]."' data-d='".$cmarkarray[3]."' data-e='".$cmarkarray[4]."' onclick='markbox_show(this);'>Mark</a> . <a href='javascript: fc_comment_button_ex(\"pcd$puniqueid\");'>Note </a>$cbarvals <div style='display: inline-block;' id='mkcd$puniqueid'>$cmarkvals</div> . ".
									"<a href='c$cuniqueid'><abbr class='synctime' data-ts='$org_wtime' data-mode='0'></abbr></a>".
								"</div></div></div><div style='clear: both;'></div>".
						"<div class='$feedc_cm_set'><div class='feedc_cm_line_m' id='infopcd$puniqueid'  style='display: $previousnotesdisplay'><div class='feedc_cmli'><a href='javascript: fc_notes_expand(\"pcd$puniqueid\", \"infoexppcd$puniqueid\");' id='infoexppcd$puniqueid'>Expand Notes ($nnotes/$ncnotes)</a></div></div><div id='pcd$puniqueid' data-ccount='$nnotes' data-fcount='$ncnotes' data-mnid='$mnid' data-fcid='$ifnoteid'>$postnotes</div><div id='addpcd$puniqueid'>$postaddbtn</div>".
							"<!---->";
							
		
		return $postm;
	}
	
	
	
	
	/* ----------------------------------------------------------------- */
	
	
	
	function delete_postex($psuid, $psvad)
	{
		$cuid   = $_SESSION['uid'];
		
		$resposts = basics::query("SELECT * FROM posts_$psuid WHERE uid=$cuid AND id=$psvad"); 
		if(!$resposts) return 0;
		
		$rpost = mysql_fetch_array($resposts);
		if(!$rpost) return 0;
		
		/* delete talk table */
		
		if($rpost['talkcid'] != 0)
		{
			$resposts = basics::query("DROP TABLE IF EXISTS talk_$psuid"."_".$psvad); 
		}
		
		/* delete all associated marks */
		
		$mk = new mark();
		
		$mk->delete_marks($psuid, $psvad, 0);
		
		
		basics::query("DELETE FROM posts_$psuid WHERE id=$psvad");  /* only deletes user's own posts */
		return 1;
	}
	
	
	function delete_post($puid)
	{
		$cuid   = $_SESSION['uid'];
		
		$psva = explode("-", $puid);
		
		if(count($psva) > 1)
		{
			$psuid = basics::quick_uidn($psva[0]);
			$psvad = basics::quicktranslate_decodenumber($psva[1]);
			
			return $this->delete_postex($psuid, $psvad);
		}
		
		return 0;
	}
	
	
	function get_lfid()
	{
		return $this->lfid;
	}
	
	function get_lftimeid()
	{
		return $this->lftimeid;
	}
	
	function translate_text_post($v)
	{
		$v = str_replace("[-q-]", "?", $v);
		return $v;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	/* garden ui --------------------------------------------------- */
	
	function get_singlepost_html_garden($powner, $rpost, $feedmode, $pgenindex, $displaynote_count, $talkcls, &$pgenlast_markertime, &$puniqueid, $displaymode)
	{
		if(!$talkcls) $talkcls = new talk(); 
		
		if($feedmode) $poaddmode = "_posts";
		else $poaddmode = "";
		
		$feed_powner = 0;
		$repost_fromuser = 0;
		$postmode = 0; /* 1 if repost */
		$repost_rpost = 0;
		$ifnoteid = 0; /* first note id (for expanding notes) */
		
		$cuid   = $_SESSION['uid'];
		$cusid  = $_SESSION['usid'] ;
		$cuslid = $_SESSION['uslid'];
		$cuname = $_SESSION['ufirstname']." ".$_SESSION['ulastname']; 
		
		if($rpost['uid'] == $_SESSION['uid'])
		{
			$org_pusid  = $cusid;
			$org_puslid = $cuslid;
			$org_puname = $cuname;
		}else{
			$org_pusid  = basics::quick_uida($rpost['uid']);
			$org_puslid = basics::quick_ulida($rpost['uid']);
			$org_puname = basics::get_username_from_id($rpost['uid']);
		}

		$org_wtime = strtotime($rpost['wtime']);
		
		if($rpost['ptype'] == 2 || $rpost['ptype'] == 3) /* repost or tagged post */
		{
			$postmode = 1;
			
			$rpuid = $rpost['opid'];
			$rppid = $rpost['div1'];
			
			$repost_fromuser = $rpuid;
			//$powner = $repost_fromuser = $rpuid;
			
			$resrpost = basics::query("SELECT * FROM posts_$rpuid WHERE id=$rppid"); 
			$repost_rpost = mysql_fetch_array($resrpost);
		}
	
		
		$puid    = $rpost['uid'];
		$psowner = basics::quick_uida($powner);
		
		if($puid == $cuid)
		{
			$pusid  = $cusid;
			$puslid = $cuslid;
			$puname = $cuname;
			$cuop = 1;
		}else{
			$pusid  = basics::quick_uida($puid);
			$puslid = basics::quick_ulida($puid);
			$puname = basics::get_username_from_id($puid);
			$cuop = 0;
		}
		
		//$puniqueid = $pusid.$rpost['id'];
		
		$puniqueid = $cuniqueid = $psowner.'-'.basics::quicktranslate_encodenumber($rpost['id']);
		
		$popuid = $pusid;
		$poppid = basics::quicktranslate_encodenumber($rpost['id']);
		
		if($displaymode != 6)
		{
			$pcdata = $rpost['ctext'];
			$pcdata = str_replace("[-q-]", "?", $pcdata);
			$pcdata = "<p>".str_replace("[-n-l-]", "</p><p>", $pcdata)."</p>";
			
			$pcdata = basics::decode_tagcodes($pcdata);
			$pcdata = basics::translate_urls_to_html($pcdata);
			$pcdatam = self::trim_text($pcdata, 400, true, "... <div class='feedc_potop_exp'><a href='javascript: fc_post_expand(\"pidtds$puniqueid\", \"pidtdl$puniqueid\", 0)'>...</a></div>");
		
		}else{
			$pcdata = "";
			$pcdatam = "";
		}
		
		
		$wtime = strtotime($rpost['wtime']);
		
		
		
		$hpicdata = "";
		
		if($displaymode != 6) /* no content, just notes */
		{
			if($postmode == 0) /* repost */
			{
				$cposttype = $rpost['type'];
				$cpostdata = $rpost;
			}else{
				$cposttype = $repost_rpost['type'];
				$cpostdata = $repost_rpost;
			}
			
			if($cposttype == 1 && $postmode == 1)
			{
				$sp_pcdata = $cpostdata['ctext'];
				$sp_pcdata = str_replace("[-q-]", "?", $sp_pcdata);
				$sp_pcdata = str_replace("[-n-l-]", "<br/>", $sp_pcdata);
				
				$sp_pcdata = basics::decode_tagcodes($sp_pcdata);
				$sp_pcdata  = basics::translate_urls_to_html($sp_pcdata);
				$sp_pcdatam = self::trim_text($sp_pcdata, 400, true, "... <div class='feedc_potop_exp'><a href='javascript: fc_post_expand(\"sp_pidtds$puniqueid\", \"sp_pidtdl$puniqueid\", 0)'>...</a></div>");
			
				$hpicdata = "<div class='feedc_picm_dtquote'><b class='feedc_picm_dtquotest'>&ldquo;</b><div id='sp_pidtds$puniqueid'>$sp_pcdatam</div><div id='sp_pidtdl$puniqueid' style='display: none;'>$sp_pcdata</div><b class='feedc_picm_dtquoteen'>&rdquo;</b></div>";
			}
			
			if($cposttype == 3)
			{
			
				$mvrpdtext = $cpostdata['dtext'];
				
				$turl    = "";
				$mvurl   = "";
				$mvsite  = "";
				$mvtitle = "";
				$mvdsc   = "";
				$mvdur   = "";
				

				/* unserialize data */
				
				if($mvrpdtext)
				{
					$nv = unserialize($mvrpdtext);
					
					
					/* ed_url, ed_thumb, ed_site, ed_title, ed_dsc, ed_dur */
					
					
					$turl    = posts::translate_text_post($nv[1]);
					$mvurl   = posts::translate_text_post($nv[0]);
					$mvsite  = posts::translate_text_post($nv[2]);
					$mvtitle = posts::translate_text_post($nv[3]);
					$mvdsc   = posts::translate_text_post($nv[4]);
					$mvdur   = posts::translate_text_post($nv[5]);
					
				
					if($displaymode == 0) /* normal post, thumbnail photo */
					{
						$hpicdata = "<div class='feedc_picb'><div class='feedc_picm' >".
									"<img data-src='$turl'/ width='337px' onload='newpostimg_center(this);' onerror='newpostimg_err(this)'/>".
								"<div class='feedc_picm_vc' onclick=\"fc_post_expand_video('$mvsite', '$mvurl', 'pidtdlvttl$puniqueid', 'pidtdl$puniqueid', '$puname', '$puslid', '$pusid', '$puniqueid')\"><div class='feedc_picm_vcplay'></div><div class='feedc_picm_vcdur'>$mvdur</div></div></div><a href='$mvurl' style='text-decoration: none;' target='_blank'><div class='feedc_picbvt' id='pidtdlvttl$puniqueid'>$mvtitle</div></a><div class='feedc_picbvs'>$mvsite</div></div>";
		
					}else{ /* everything else needs a full embedded video preview */
					
						if($mvsite == "Youtube.com")
						{
							preg_match('/[\\?\\&]v=([^\\?\\&]+)/', $mvurl, $matches);
							
							if(count($matches[1]) >= 1)
							{
								$mvmu = $matches[1];
								
								$hpicdata = "<div class='singlepost_sdata'>".
											"<object width='640' height='360'><param name='movie' value='http://www.youtube.com/v/$mvmu?version=3'><param name='allowFullScreen' value='true'><param name='allowscriptaccess' value='always'><param name='wmode' value='opaque'><embed src='http://www.youtube.com/v/$mvmu?version=3' type='application/x-shockwave-flash' width='640' height='360' allowscriptaccess='always' allowfullscreen='true' wmode='opaque'></object>".
										"</div>";
							}
						}
						
						
						$hpicdata .= "<div class='singlepost_ddetails'>".
										"<div class='singlepost_ddetails_t'><a href='$mvurl'>$mvtitle</a></div>".
										"<div class='singlepost_ddetails_u'>$mvsite</div>".
									"</div>";
					}
				}
			}else if($rpost['type'] == self::post_type_album){
			
				$postphotoct = new photos;
				$postphotoctcvpid = 0;
				$postphotoctfile = $postphotoct->photo_getfile($powner, $rpost['div1'], 0, 0, $postphotoctcvpid);
				$postphotoctalbumid = $rpost['div1'];
				$postphotoct_albumsid = basics::quicktranslate_encodenumber_pad($postphotoctalbumid, 4);
				$postphotoct_photosid = basics::quicktranslate_encodenumber_pad($postphotoctcvpid, 4);
			
				$postphotoct_albname = "Untitled";
				$postphotoct_albdsc  = "";
				$postphotoct_albloc  = "Not set";
				
				$postphotoct->album_getinfo($powner, $postphotoctalbumid, $postphotoct_albname, $postphotoct_albdsc, $postphotoct_albloc);
				
				$pcdatam = $postphotoct_albdsc;
				$pcdata = $postphotoct_albdsc;
				
				$hpicdata .= "<div class='feedc_picb'><div class='feedc_picm' >".
									"<img data-src='$postphotoctfile'/ width='337px' onload='newpostimg_center(this);' onclick=\"fc_post_expand_album('$pusid', $postphotoctalbumid, $postphotoctcvpid, '$puniqueid')\">".
								"</div><a href='albums.$pusid.$postphotoct_albumsid' style='text-decoration: none;'><div class='feedc_picbvt' id='pidtdlvttl$puniqueid'>$postphotoct_albname</div></a><div class='feedc_picbvs'></div><div class='feedc_picbvl'>$postphotoct_albloc</div></div>";
								"<div class='singlepost_ddetails'>".
										"<div class='singlepost_ddetails_t'></div>".
										"<div class='singlepost_ddetails_u'></div>".
									"</div>";
			}
		}
		
		$posttmarker = "";
		
		if(($pgenindex % 2) && $feedmode)
		{
			$ptmtime = strtotime($rpost['wtime']);
			$ptmtimem = date('n', $ptmtime);
			if($ptmtimem != $pgenlast_markertime)
			{
				$ptmtime = "<abbr class='synctime' data-ts='$ptmtime' data-mode='3'></abbr>";
				$posttmarker = "<div class='feedc_post_timemarker'><div class='feedc_post_timemarkerin'>$ptmtime</div></div>";
			}
			$pgenlast_markertime = $ptmtimem;
		}			
		
		if($cuop)
		{
			$linkuid_pusid = 'pu'.$pusid;
			$linkuid_vusr  = "";
		}else{
			$linkuid_pusid = 'u'.$pusid;
			$linkuid_vusr  = " onmouseover=\"vusr(this, '$pusid')\"";
		}
		
		$pnoteset = 0;
		
		if($rpost['talkcid'])
			$pnoteset = $talkcls->get_notes($powner, $rpost['id'], $displaynote_count, talk::sincemode_last, 1, 0);
			
		$postnotes = "";
		
		$ncnotes = 0; /* number of notes there (invisible etc.) */
		$nnotes = 0;
		$mnid = 0;
		$previousnotesdisplay = "none";
		$mcmark = 0;
		
		if($rpost['talkcid'])
			$mnid = $talkcls->get_lastnote_id($powner, $rpost['id'], 1);
			
		if($rpost['talkcid'])
			$ncnotes = $talkcls->get_notes_count($powner, $rpost['id'], 1);
			
			
		if($rpost['markcid'])
			$mcmark = new mark();
			
		if($pnoteset)
		{			
			//foreach ($pnoteset as &$inote)
			//{
			//	$postnotes .= $inote;
			//}
			//
			//unset($inote);
			
			
			$nnotes = count($pnoteset);
			
			if($nnotes)
				$ifnoteid = $pnoteset[0][0];
				
			
			for($i=0; $i<$nnotes; $i++)
			{
				$inote = $pnoteset[$i][1];
				$inotetime = strtotime($pnoteset[$i][2]);
				$inoteid = $pnoteset[$i][0];
				$inoteuid = $pnoteset[$i][3];
				
				$ownnotep = 0;
				
				if($inoteuid == $cuid)
				{
					$notepusid  = $cusid;
					$noteculid = $cuslid;
					$notecuname = $cuname;
					$ownnotep    = 1;
				}else{
					$notepusid  = basics::quick_uida($inoteuid);
					$noteculid = basics::quick_ulida($inoteuid);
					$notecuname = basics::get_username_from_id($inoteuid);
				}
				
				if($powner == $cuid)$ownnotep    = 1;
				
				$noteids = "pcd".$puniqueid;
				$notetsyncid  = "ctv".$noteids.$inoteid;
				$noteccuid    = $noteids."_".$inoteid;
		
				if($i % 2)	$oddev = "o";
				else $oddev = "e";
				
				$inote = str_replace("[-q-]", "?", $inote);
				$inote = str_replace("[-n-l-]", "<br/>", $inote);
				
				$inote = basics::decode_tagcodes($inote);
				$inote = basics::translate_urls_to_html($inote);
				
				if($ownnotep)
					$notedelp = "<samp title='Double click to remove note' ondblclick='fc_notedel(\"$noteccuid\")'><div class='feedc_cm_cdel' ></div></samp>";
				else
					$notedelp = "<samp title='Double click to report note' ondblclick='fc_notereport(\"$noteccuid\")'><div class='feedc_cm_cdel'></div></samp>";
				
				$notemarkshtml = "";
				$notemarkvalsuc = array(0, 0, 0, 0, 0);
				$notemarkvalsac = array(0, 0, 0, 0, 0);
				
				if($mcmark)
				{
					$notemarkvals = $this->get_marks_html($mcmark, $powner, $rpost['id'], $inoteid);
					$notemarkshtml = $notemarkvals[0];
					
					if($notemarkvals[2])
					{
						$notemarkvalsuc[0] = $notemarkvals[2][0];
						$notemarkvalsuc[1] = $notemarkvals[2][1];
						$notemarkvalsuc[2] = $notemarkvals[2][2];
						$notemarkvalsuc[3] = $notemarkvals[2][3];
						$notemarkvalsuc[4] = $notemarkvals[2][4];
					}
					
					if($notemarkvals[1])
					{
						$notemarkvalsac[0] = $notemarkvals[1][0];
						$notemarkvalsac[1] = $notemarkvals[1][1];
						$notemarkvalsac[2] = $notemarkvals[1][2];
						$notemarkvalsac[3] = $notemarkvals[1][3];
						$notemarkvalsac[4] = $notemarkvals[1][4];
					}
				}
				
				$postnotes .= 	"<div class='feedc_cm_line feedc_cm_line_" . $oddev . "' id='feedc_cm_line_tct" . $noteccuid . "'><div class='feedc_cmli'>" .
								"<div class='feedc_cm_dp'><img src='data/u" . $noteculid . "/dp/3.jpg'/></div>" .
								"<div class='feedc_cm_c'>$notedelp" .
								"<div id='feedc_cm_line_tdt" . $noteccuid . "'><a onmouseover='vusr(this, \"$notepusid\");' href='u$notepusid' class='feedc_pouname'>" . $notecuname . " </a>" . $inote .
									"</div><div class='feedc_ponote_ctr'><abbr class='synctime' id='" . $notetsyncid . "' data-mode='0' data-ts='" . $inotetime . "'></abbr> <div style='display: inline-block;' id='mkcd$puniqueid-$noteccuid'>$notemarkshtml</div> <samp> . <a data-attch='mkcd$puniqueid-$noteccuid' data-nid='$puniqueid"."-$noteccuid' data-ua='".$notemarkvalsuc[0]."' data-ub='".$notemarkvalsuc[1]."' data-uc='".$notemarkvalsuc[2]."' data-ud='".$notemarkvalsuc[3]."' data-ue='".$notemarkvalsuc[4]."' data-a='".$notemarkvalsac[0]."' data-b='".$notemarkvalsac[1]."' data-c='".$notemarkvalsac[2]."' data-d='".$notemarkvalsac[3]."' data-e='".$notemarkvalsac[4]."' onclick='markbox_show(this);'>Mark</a></samp></div>" .
								"</div><div style='clear: both;'></div></div></div>";
			}
			
		
		}
		
	
		if($nnotes)
		{
			$postaddbtn = 	"<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>".
								"<div class='feedc_cm_dp'><img src='data/u" . $cuslid . "/dp/3.jpg' onerror='failsafe_img(this, 3);'/></div><div class='feedc_cm_c'>".
					/*				"<div id='" . $cuniqueid . "aci' class='expandingArea' style='margin-left: 0px; margin-top: 2px; min-height: 20px; width: 100%; border: 1px solid #f0f1f2;'>".
										"<pre><span></span><br></pre>".
										"<textarea onclick='fc_comment_button(\"pcd$puniqueid\")' id='" . $cuniqueid . "acit' class='newc_textarea' autocomplete='off' placeholder='Leave a Note...'></textarea></div>".
					*/				
								"<div class='feedc_cm_cm'><div onclick='fc_comment_button_ex(\"pcd".$puniqueid."\")' style='outline: none; padding: 2px 4px 2px 4px;' id='pcd" . $cuniqueid . "acit' contenteditable='plaintext-only'></div></div>".
							"</div><div style='clear: both;'></div></div></div>";
		}else{
			$postaddbtn = "";
		}
		
		$cbarvals = "";
		$cmarkvals = "";
		$cmarkarray = array(0, 0, 0, 0, 0);
		$ucmarkarray = array(0, 0, 0, 0, 0);
		
		if($mcmark)
		{
			$cmaarray = $mcmark->get_marks($powner, $rpost['id'], 0, 1);
			
			$cmarkarray[0] = $cmaarray[0];
			$cmarkarray[1] = $cmaarray[1];
			$cmarkarray[2] = $cmaarray[2];
			$cmarkarray[3] = $cmaarray[3];
			$cmarkarray[4] = $cmaarray[4];
			
			$ucmarkarray[0] = $cmaarray[5];
			$ucmarkarray[1] = $cmaarray[6];
			$ucmarkarray[2] = $cmaarray[7];
			$ucmarkarray[3] = $cmaarray[8];
			$ucmarkarray[4] = $cmaarray[9];
		}
		
		
		if($cmarkarray[0]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -64px -19px;'></div> ".$cmarkarray[0]."</a>";
		if($cmarkarray[1]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position:  0px  -20px;'></div> ".$cmarkarray[1]."</a>";
		if($cmarkarray[2]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -17px -18px;'></div> ".$cmarkarray[2]."</a>";
		if($cmarkarray[3]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -32px -19px;'></div> ".$cmarkarray[3]."</a>";
		if($cmarkarray[4]) $cmarkvals .= " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -49px -18px;'></div> ".$cmarkarray[4]."</a>";
		
		
		if($ncnotes > $displaynote_count)
		{
			$previousnotesdisplay = "block";
			$cbarvals .= " . <div class='boxc_inline boxc_icm'></div>$ncnotes";
		}
		
		$feedc_cm_set = "feedc_cm_set";
		$feedc_potop_t = "feedc_potop_t";
		$ncnotediv = "";
		
		
		$putousername = "";
		
		if($powner != $puid && !$feedmode)
			$putousername = " - <a href='pu$psowner' class='feedc_pouname' style='font-weight: normal;'>".basics::get_username_from_id($powner)."</a>";
		
		
		if($repost_fromuser)
			$putousername .= " <a style='color: #aaaaaa;'> from </a> <a href='pu".basics::quick_uida($repost_fromuser)."' class='feedc_pouname' style='font-weight: normal;'>".basics::get_username_from_id($repost_fromuser)."</a>";
			
		if($ncnotes)
			$ncnotediv = "";//<div class='boxc_i boxc_icm'></div><div class='boxc_icmd'>$ncnotes</div>";
		
		$icmsourcebtn = "";
		if($repost_fromuser)
		{
			$icmsourceid = "c".basics::quick_uida($repost_fromuser)."-".basics::quicktranslate_encodenumber($repost_rpost['id']);
			$icmsourcebtn = "<a href='$icmsourceid'><div title='Go to the source' class='boxc_i boxc_source' style='margin-right: 2px;' ></div></a>";
		}	
		
		if($displaymode == 0)
		{
			$postm =	"<div class='feedc_poout$poaddmode' id='feedcpoout$puniqueid'>$posttmarker<div class='feedc_poin$poaddmode'>".
							"<span><div class='feedc_boxc$poaddmode'>$ncnotediv<span>$icmsourcebtn<div title='Share' class='boxc_i boxc_share' onclick=\"repost_publish(0, '$popuid', '$poppid');\" style='margin-right: 2px;' ></div><div class='boxc_i boxc_close' onclick='show_feedpopup(1, this, 1, \"$puniqueid\");'></div></span></div></span>".
							"<div class='feedc_potop'>".
								"<div class='feedc_potop_dp'><a href='$linkuid_pusid'><img src='data/u$org_puslid/dp/2.jpg' onerror='failsafe_img(this, 2);'/></a></div>".
								"<div class='feedc_potop_c'>".
									"<a href='$linkuid_pusid' class='feedc_pounamem' $linkuid_vusr>$org_puname</a>$putousername";
		}else{
			$feedc_cm_set = "feedc_cm_sets";
			$feedc_potop_t = "singlepost_stext";
			
			$postm =	"<div class='feedc_psoout$poaddmode' id='feedcpoout$puniqueid'>$posttmarker<div class='feedc_psoin$poaddmode'>".
							"<span><div class='feedc_boxc$poaddmode'>$ncnotediv<span><div title='Share' class='boxc_i boxc_share' onclick=\"repost_publish(0, '$popuid', '$poppid');\" style='margin-right: 2px;' ></div><div class='boxc_i boxc_close' onclick='show_feedpopup(1, this, 1, \"$puniqueid\");'></div></span></div></span>".
							"<div class='feedc_psotop'><div class='feedc_psotop_c'>";

		}
		
		$postm .=	"<div class='$feedc_potop_t'><div id='pidtds$puniqueid'>$pcdatam</div><div id='pidtdl$puniqueid' style='display: none;'>$pcdata</div></div>".
								$hpicdata.
								"<div class='feedc_potop_ctr'>".
									"<a data-attch='mkcd$puniqueid' data-nid='$puniqueid"."_0' data-ua='".$ucmarkarray[0]."' data-ub='".$ucmarkarray[1]."' data-uc='".$ucmarkarray[2]."' data-ud='".$ucmarkarray[3]."' data-ue='".$ucmarkarray[4]."' data-a='".$cmarkarray[0]."' data-b='".$cmarkarray[1]."' data-c='".$cmarkarray[2]."' data-d='".$cmarkarray[3]."' data-e='".$cmarkarray[4]."' onclick='markbox_show(this);'>Mark</a> . <a href='javascript: fc_comment_button_ex(\"pcd$puniqueid\");'>Note </a>$cbarvals <div style='display: inline-block;' id='mkcd$puniqueid'>$cmarkvals</div> . ".
									"<a href='c$cuniqueid'><abbr class='synctime' data-ts='$org_wtime' data-mode='0'></abbr></a>".
								"</div></div></div><div style='clear: both;'></div>".
						"<div class='$feedc_cm_set'><div class='feedc_cm_line_m' id='infopcd$puniqueid'  style='display: $previousnotesdisplay'><div class='feedc_cmli'><a href='javascript: fc_notes_expand(\"pcd$puniqueid\", \"infoexppcd$puniqueid\");' id='infoexppcd$puniqueid'>Expand Notes ($nnotes/$ncnotes)</a></div></div><div id='pcd$puniqueid' data-ccount='$nnotes' data-fcount='$ncnotes' data-mnid='$mnid' data-fcid='$ifnoteid'>$postnotes</div><div id='addpcd$puniqueid'>$postaddbtn</div>".
							"<!---->";
							
		
			
		$postm = "<div class='feedg_postbox'>
					<div class='feedg_postbox_sb m".($this->feed_box_color + 1)."'><p>".strtoupper($org_puname)."</p></div>
				
					<div class='feedg_postbox_basics'>
						<div class='feedg_postbox_basicsdp'>
							<img src='data/u$org_puslid/dp/1.jpg' width='51px' onerror='failsafe_img(this, 1);'/>
						</div>
						
						<div class='feedg_postbox_mc'>
						
						<div style='padding: 3px 0 0 40px; line-height: 130%;'>
						<div class='feedg_postbox_basicstitle'>".strtoupper($org_puname)."</div>
						<div class='feedg_postbox_bdsc'>Text</div>
						<div class='feedg_postbox_bctr'><a href='c$cuniqueid'><abbr class='synctime' data-ts='$org_wtime' data-mode='0'></abbr></a> . <a data-attch='mkcd$puniqueid' data-nid='$puniqueid"."_0' data-ua='".$ucmarkarray[0]."' data-ub='".$ucmarkarray[1]."' data-uc='".$ucmarkarray[2]."' data-ud='".$ucmarkarray[3]."' data-ue='".$ucmarkarray[4]."' data-a='".$cmarkarray[0]."' data-b='".$cmarkarray[1]."' data-c='".$cmarkarray[2]."' data-d='".$cmarkarray[3]."' data-e='".$cmarkarray[4]."' onclick='markbox_show(this);'>Mark</a> . <a href='javascript: fc_comment_button_ex(\"pcd$puniqueid\");'>Note </a> . <a href='#'>Reblog</a></div>
						<div class='feedg_postbox_bloc'>City Hall, Downtown, Yorkshire.</div>
						</div>
						
						<div class='feedg_postbox_bct'>
						<div id='pidtds$puniqueid'>$pcdatam</div><div id='pidtdl$puniqueid' style='display: none;'>$pcdata</div>
						
						$hpicdata
						
						</div>
						
						</div>
					</div>
					
					
				</div>";
				
		if(++$this->feed_box_color >= 4) $this->feed_box_color = 0;
			
		return $postm;
	}
	


}

//$pc = new posts(); 
//echo $pc->get_posts_html_classic(1, 0, 10, 0);
//$pc->create_post(0, posts::post_type_text, "this is cool", 0, 0, 0);

?>