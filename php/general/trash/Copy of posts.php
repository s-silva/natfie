<?php

include_once("basics.php");
include_once("talk.php");

class posts
{
	const post_type_text        = 1;
	const post_type_photo       = 2;
	const post_type_link_video  = 3;
	const post_type_link_audio  = 4;
	const post_type_link_url    = 5;
	
	var $lfid;
	
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
	
	function create_post($touser, $ptype, $tcontent, $tcontent2, $tcontent3, $addtoblog)
	{
		$writeruid = $_SESSION['uid'];
		
		if($touser) /* post to another user */
		{
			/* exit if not a friend [todo] check user's personal privacy settings for possibility of posting */
			return;
		}
		
		if(!$touser) $touser = $writeruid;
		if($ptype < 1 || $ptype > 5) return 0;
		
		
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
	
		if($dtext)
			$dtext = basics::escapestr($dtext);
		
		basics::query("INSERT INTO posts_$touser  (uid, ptype, opid, utype, visibility, reports, rating1, rating2, rating3, rating4, wtime, ltime, mtime, rtime, type, ctext, dtext, div1, div2, tagcid, markcid, talkcid, repostscid, repostcount, remotehost, privacymode, filtergroup)".
						                  "values ($writeruid, 1, 0, 1, 1, 0, 0, 0, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), $posttype, '$ctext', '$dtext', $div1, $div2, 0, 0, 0, 0, 0, 0, 0, 0)");

		return 1;
	}

	function add_comment($uid, $postid, $ctext, $cdata)
	{
	
	
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
			return "";
		}
		
		$postfooter = 	"<!--<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>".
							"<div class='feedc_cm_dp'><img src='data/u<data.user.lid>/dp/3.jpg'/></div>".
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
		}
						
		if(!$psinceval)
		{
			$resposts = basics::query("SELECT * FROM posts_$uid ORDER BY id DESC LIMIT $pmnumber"); 
		}else{
			if($psincemode == 0)
				$resposts = basics::query("SELECT * FROM posts_$uid WHERE id<$psinceval ORDER BY id DESC LIMIT $pmnumber"); 
		}

		if(!$resposts)
		{
			$this->lfid = "-1";
			return "";
		}
		$puniqueid = "-1";
		
		$talkcls = new talk(); 
			
		while($rpost = mysql_fetch_array($resposts))
		{		
			$puid    = $rpost['uid'];
			$pgenindex++;
			
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
			
			$puniqueid = $cuniqueid = $pusid.'-'.basics::quicktranslate_encodenumber($rpost['id']);
			
			$pcdata = $rpost['ctext'];
			$pcdata = str_replace("[-q-]", "?", $pcdata);
			$pcdata = "<p>".str_replace("[-n-l-]", "</p><p>", $pcdata)."</p>";
			
			$pcdata = basics::translate_urls_to_html($pcdata);
			
			$wtime = strtotime($rpost['wtime']);
			
			$pcdatam = self::trim_text($pcdata, 400, true, "... <div class='feedc_potop_exp'><a href='javascript: fc_post_expand(\"pidtds$puniqueid\", \"pidtdl$puniqueid\", 0)'>...</a></div>");
			
			
			
			$hpicdata = "";
			
			if($rpost['type'] == 3)
			{
				$turl    = "";
				$mvurl   = "";
				$mvsite  = "";
				$mvtitle = "";
				$mvdsc   = "";
				$mvdur   = "";
				

				/* unserialize data */
				
				if($rpost['dtext'])
				{
					$nv = unserialize($rpost['dtext']);
					
					
					/* ed_url, ed_thumb, ed_site, ed_title, ed_dsc, ed_dur */
					
					
					$turl    = posts::translate_text_post($nv[1]);
					$mvurl   = posts::translate_text_post($nv[0]);
					$mvsite  = posts::translate_text_post($nv[2]);
					$mvtitle = posts::translate_text_post($nv[3]);
					$mvdsc   = posts::translate_text_post($nv[4]);
					$mvdur   = posts::translate_text_post($nv[5]);
					
				
					$hpicdata = "<div class='feedc_picb'><div class='feedc_picm' >".
									"<img data-src='$turl'/ width='337px' onload='newpostimg_center(this);' onclick=\"fc_post_expand_video('$mvsite', '$mvurl', 'pidtdlvttl$puniqueid', 'pidtdl$puniqueid', '$puname', '$puslid', '$pusid')\">".
								"</div><div class='feedc_picbvt' id='pidtdlvttl$puniqueid'>$mvtitle</div><div class='feedc_picbvs'>$mvsite</div></div>";
							
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
				$pnoteset = $talkcls->get_notes($puid, $rpost['id'], 3, talk::sincemode_last, 1);
				
			$postnotes = "";
			
			$ncnotes = 0; /* number of notes there (invisible etc.) */
			$nnotes = 0;
			$mnid = 0;
			$previousnotesdisplay = "none";
			
			if($rpost['talkcid'])
				$mnid = $talkcls->get_lastnote_id($puid, $rpost['id'], 1);
				
			if($rpost['talkcid'])
				$ncnotes = $talkcls->get_notes_count($puid, $rpost['id'], 1);
			
			if($pnoteset)
			{			
				//foreach ($pnoteset as &$inote)
				//{
				//	$postnotes .= $inote;
				//}
				//
				//unset($inote);
				
				
				$nnotes = count($pnoteset);
				
					
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
					
					$noteids = "pcd".$puniqueid;
					$notetsyncid  = "ctv".$noteids.$inoteid;
					$noteccuid    = $noteids."_".$inoteid;
			
					if($i % 2)	$oddev = "o";
					else $oddev = "e";
					
					$inote = str_replace("[-q-]", "?", $inote);
					$inote = str_replace("[-n-l-]", "<br/>", $inote);
					
					$inote = basics::translate_urls_to_html($inote);
					
					if($ownnotep)
						$notedelp = "<samp title='Double click to remove note' ondblclick='fc_notedel(\"$noteccuid\")'><div class='feedc_cm_cdel' ></div></samp>";
					else
						$notedelp = "<samp title='Double click to report note' ondblclick='fc_notereport(\"$noteccuid\")'><div class='feedc_cm_cdel'></div></samp>";
					
					$postnotes .= 	"<div class='feedc_cm_line feedc_cm_line_" . $oddev . "' id='feedc_cm_line_tct" . $noteccuid . "'><div class='feedc_cmli'>" .
									"<div class='feedc_cm_dp'><img src='data/u" . $noteculid . "/dp/3.jpg'/></div>" .
									"<div class='feedc_cm_c'>$notedelp" .
									"<div id='feedc_cm_line_tdt" . $noteccuid . "'><a href='#' class='feedc_pouname'>" . $notecuname . " </a>" . $inote . 
										"</div><div><abbr class='synctime' id='" . $notetsyncid . "' data-mode='0' data-ts='" . $inotetime . "'></abbr></div>" .
									"</div><div style='clear: both;'></div></div></div>";
				}
				
			
			}
			
		
			if($nnotes)
			{
				$postaddbtn = 	"<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>".
									"<div class='feedc_cm_dp'><img src='data/u" . $puslid . "/dp/3.jpg'/></div><div class='feedc_cm_c'>".
										"<div id='" . $cuniqueid . "aci' class='expandingArea' style='margin-left: 0px; margin-top: 2px; min-height: 20px; width: 100%; border: 1px solid #f0f1f2;'>".
											"<pre><span></span><br></pre>".
											"<textarea onclick='fc_comment_button(\"pcd$puniqueid\")' id='" . $cuniqueid . "acit' class='newc_textarea' autocomplete='off' placeholder='Leave a Note...'></textarea>".
								"</div></div><div style='clear: both;'></div></div></div>";
			}else{
				$postaddbtn = "";
			}
			
			$cbarvals = "";
			$cmarkvals = "";
			$cmarkarray = array(0, 0, 0, 0, 0);
			
			
			if($cmarkarray[0]) $cmarkvals .= "<a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -64px -19px;'></div> ".$cmarkarray[0]."<a> . ";
			if($cmarkarray[1]) $cmarkvals .= "<a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position:  0px  -20px;'></div> ".$cmarkarray[1]."<a> . ";
			if($cmarkarray[2]) $cmarkvals .= "<a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -17px -18px;'></div> ".$cmarkarray[2]."<a> . ";
			if($cmarkarray[3]) $cmarkvals .= "<a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -32px -19px;'></div> ".$cmarkarray[3]."<a> . ";
			if($cmarkarray[4]) $cmarkvals .= "<a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -49px -18px;'></div> ".$cmarkarray[4]."<a> . ";
			
			
			if($ncnotes > $displaynote_count)
			{
				$previousnotesdisplay = "block";
				$cbarvals .= "<div class='boxc_inline boxc_icm'></div>$ncnotes . ";
			}
			
			$postm =	"<div class='feedc_poout$poaddmode' id='feedcpoout$puniqueid'>$posttmarker<div class='feedc_poin$poaddmode'>".
							"<span><div class='feedc_boxc$poaddmode'><div class='boxc_i boxc_icm'></div><div class='boxc_icmd'>$nnotes</div><span><div class='boxc_i boxc_share'></div><div class='boxc_i boxc_close' onclick='show_feedpopup(1, this, 1, \"$puniqueid\");'></div></span></div></span>".
							"<div class='feedc_potop'>".
								"<div class='feedc_potop_dp'><a href='$linkuid_pusid'><img src='data/u$puslid/dp/2.jpg'/></a></div>".
								"<div class='feedc_potop_c'>".
									"<a href='$linkuid_pusid' class='feedc_pouname' $linkuid_vusr>$puname</a>".
									"<div class='feedc_potop_t'><div id='pidtds$puniqueid'>$pcdatam</div><div id='pidtdl$puniqueid' style='display: none;'>$pcdata</div></div>".
									$hpicdata.
									"<div class='feedc_potop_ctr'>".
										"<a href='#' data-attch='mkcd$puniqueid' data-ua='0' data-ub='0' data-uc='0' data-ud='0' data-ue='0' data-a='".$cmarkarray[0]."' data-b='".$cmarkarray[1]."' data-c='".$cmarkarray[2]."' data-d='".$cmarkarray[3]."' data-e='".$cmarkarray[4]."' onclick='markbox_show(this);'>Mark</a> . <a href='javascript: fc_comment_button(\"pcd$puniqueid\");'>Note</a> . $cbarvals <div style='display: inline-block;' id='mkcd$puniqueid'>$cmarkvals</div>".
										"<a href='c$cuniqueid'><abbr class='synctime' data-ts='$wtime' data-mode='0'></abbr></a>".
									"</div></div></div><div style='clear: both;'></div>".
							"<div class='feedc_cm_set'><div class='feedc_cm_line_m' id='infopcd$puniqueid'  style='display: $previousnotesdisplay'><div class='feedc_cmli'><a href='javascript: fc_notes_expand(\"pcd$puniqueid\");'>Expand Notes</a></div></div><div id='pcd$puniqueid' data-ccount='$nnotes' data-mnid='$mnid'>$postnotes</div><div id='addpcd$puniqueid'>$postaddbtn</div>".
								"<!---->";
								
			
								

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
		
		$this->lfid = $puniqueid;
		
		if(!$feedmode)
			return $page;
		else
			return array($page, $pageex);
	}
	
	function get_singlepost_html($rpost, $feedmode, $pgenindex)
	{
	
	}
	
	function delete_post($puid)
	{
		$cuid   = $_SESSION['uid'];
		
		$psva = explode("-", $puid);
		
		if(count($psva) > 1)
		{
			$psuid = basics::quick_uidn($psva[0]);
			$psvad = basics::quicktranslate_decodenumber($psva[1]);
			
			$resposts = basics::query("SELECT * FROM posts_$psuid WHERE uid=$cuid AND id=$psvad"); 
			if(!$resposts) return 0;
			
			$rpost = mysql_fetch_array($resposts);
			if(!$rpost) return 0;
			
			/* delete talk table */
			
			if($rpost['talkcid'] != 0)
			{
				$resposts = basics::query("DROP TABLE IF EXISTS talk_$psuid"."_".$psvad); 
			}
			
			basics::query("DELETE FROM posts_$cuid WHERE id=$psvad");  /* only deletes user's own posts */
			return 1;
		}
		
		return 0;
	}
	
	
	function get_lfid()
	{
		return $this->lfid;
	}
	
	function translate_text_post($v)
	{
		$v = str_replace("[-q-]", "?", $v);
		return $v;
	}


}

//$pc = new posts(); 
//echo $pc->get_posts_html_classic(1, 0, 10, 0);
//$pc->create_post(0, posts::post_type_text, "this is cool", 0, 0, 0);

?>