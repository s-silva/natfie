<?php
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/posts.php"); 
	
	
	function get_singlepost($uid, $pid)
	{
		$cposts = new posts;
		$feedmode = 0; /* 1 - posts, 0 - feed */
		
		$displaynote_count = 100; /* display maximum of 3 notes (todo - get from settings) */

		$cuid   = $_SESSION['uid'];
		$cusid  = $_SESSION['usid'] ;
		$cuslid = $_SESSION['uslid'];
		$cuname = $_SESSION['ufirstname']." ".$_SESSION['ulastname']; 
			
		
		$htmld = join("", file("templates/singlepost.html"));
		$errorval = join("", file("templates/contentblocked.html"));
		
		
		if($uid <= 0) return $errorval;
		if($pid <= 0) return $errorval;
	
	
		$resposts = basics::query("SELECT * FROM posts_$uid WHERE id=$pid"); 
		
		if(!$resposts) return $errorval;
	
		$rpost = mysql_fetch_array($resposts);
		
		if(!$rpost) return $errorval;
		
		$puid    = $rpost['uid'];
		
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
		
		
		$htmld = str_replace("<singlepost.data.uname>", $puname, $htmld);
		$htmld = str_replace("<singlepost.data.udp>", "<img src='data/u$puslid/dp/1.jpg'/>", $htmld);
		
		
		
		$pgenindex = 0;
		$pgenlast_markertime = 0;
		
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
				
		$puniqueid = 0;
		$postm = $cposts->get_singlepost_html($uid, $rpost, $feedmode, $pgenindex, $displaynote_count, 0, $pgenlast_markertime, $puniqueid, 1);

		return str_replace("<singlepost.data.main>",  $postm . $postfooter, $htmld);
	}

	function get_singlepostex($uid, $pid)
	{
		$cuid   = $_SESSION['uid'];
		$cusid  = $_SESSION['usid'] ;
		$cuslid = $_SESSION['uslid'];
		$cuname = $_SESSION['ufirstname']." ".$_SESSION['ulastname']; 
			
		
		$htmld = join("", file("templates/singlepost.html"));
		$errorval = join("", file("templates/contentblocked.html"));
		
		
		if($uid <= 0) return $errorval;
		if($pid <= 0) return $errorval;
	
	
		$resposts = basics::query("SELECT * FROM posts_$uid WHERE id=$pid"); 
		
		if(!$resposts) return $errorval;
	
		$rpost = mysql_fetch_array($resposts);
		
		if(!$rpost) return $errorval;
		
		$puid    = $rpost['uid'];

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
		
		
		$htmld = str_replace("<singlepost.data.uname>", $puname, $htmld);
		$htmld = str_replace("<singlepost.data.udp>", "<img src='data/u$puslid/dp/1.jpg'/>", $htmld);
		
		
		
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
				
				
		
		$puniqueid = $cuniqueid = $pusid.'-'.basics::quicktranslate_encodenumber($rpost['id']);
		
		$pcdata = $rpost['ctext'];
		$pcdata = str_replace("[-q-]", "?", $pcdata);
		$pcdata = "<p>".str_replace("[-n-l-]", "</p><p>", $pcdata)."</p>";
		
		$pcdata = basics::translate_urls_to_html($pcdata);
		
		$wtime = strtotime($rpost['wtime']);
		

		
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
				$hpicdata = "";
				
				$nv = unserialize($rpost['dtext']);
				
				
				/* ed_url, ed_thumb, ed_site, ed_title, ed_dsc, ed_dur */
				
				
				$turl    = translate_text_post($nv[1]);
				$mvurl   = translate_text_post($nv[0]);
				$mvsite  = translate_text_post($nv[2]);
				$mvtitle = translate_text_post($nv[3]);
				$mvdsc   = translate_text_post($nv[4]);
				$mvdur   = translate_text_post($nv[5]);

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
		
		
		if($cuop)
		{
			$linkuid_pusid = 'pu'.$pusid;
			$linkuid_vusr  = "";
		}else{
			$linkuid_pusid = 'u'.$pusid;
			$linkuid_vusr  = " onmouseover=\"vusr(this, '$pusid')\"";
		}
			
		$postm =	"<div><div>".
						"<span style='float: right;'><div><div class='boxc_i boxc_icm'></div><div class='boxc_icmd'>12</div><span><div class='boxc_i boxc_share'></div><div class='boxc_i boxc_close' onclick='show_feedpopup(1, this, 1, \"$puniqueid\");'></div></span></div></span>".
						"<div class='singlepost_stext'>$pcdata</div>".$hpicdata.
						"<div class='singlepost_potop_ctr'>".
							"<a href='#'>Mark</a> . <a href='javascript: fc_comment_button(\"pcd$puniqueid\");'>Note</a> . <abbr class='synctime' data-ts='$wtime' data-mode='0'></abbr>".
						"</div><div style='clear: both;'></div>".
						"<div class='feedc_cm_set'><div class='feedc_cm_line_m' id='infopcd$puniqueid' style='display: none;'><div class='feedc_cmli'><a href='#'>View Previous 7 Notes</a></div></div><div id='pcd$puniqueid' data-ccount='0'></div><div id='addpcd$puniqueid'></div>".
							"<!---->";
								



		$htmld = str_replace("<singlepost.data.main>",  $postm . $postfooter, $htmld);
				
		return $htmld;
	}


	function decode_singlepost_ids($sdata)
	{
		$rv = array(0, 0);
		
		if(!$sdata) return 0;
	
		$ra = explode("-", $sdata);
		
		if(!$ra) return 0;
		
		if(count($ra) > 1)
		{
			$rv = array(basics::quick_uidn($ra[0]), basics::quicktranslate_decodenumber($ra[1]));
		
			
		}
		
		return $rv;
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

	function translate_text_post($v)
	{
		$v = str_replace("[-q-]", "?", $v);
		return $v;
	}
?>