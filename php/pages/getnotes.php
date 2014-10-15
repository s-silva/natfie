<?php
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/posts.php"); 
	
	$style = 0;
	$appendtags = 0;
	
	if(isset($_GET['style'])) $style = $_GET['style'];
	if(isset($_GET['appendtags'])) $appendtags = $_GET['appendtags'];
	
	
	$display_style = 6;
	if($style == 2) $display_style = 7;
	
	function get_singlepost($uid, $pid)
	{
		$cposts = new posts;
		$feedmode = 0; /* 1 - posts, 0 - feed */
		
		$displaynote_count = 100; /* display maximum of 3 notes (todo - get from settings) */

		$cuid   = $_SESSION['uid'];
		$cusid  = $_SESSION['usid'] ;
		$cuslid = $_SESSION['uslid'];
		$cuname = $_SESSION['ufirstname']." ".$_SESSION['ulastname']; 
			
		$errorval = 0;
		
		
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
		
		global $display_style;
		
		$postm = $cposts->get_singlepost_html($uid, $rpost, $feedmode, $pgenindex, $displaynote_count, 0, $pgenlast_markertime, $puniqueid, $display_style);

		return $postm . $postfooter;
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

	if(!isset($_GET['pid'])) die(0);
	
	$rv = decode_singlepost_ids($_GET['pid']);
	
	if(!$rv)die(0);
	if($rv[0] <= 0)die(0);
	
	if(!$appendtags)
	{
		echo get_singlepost($rv[0], $rv[1]);
	}else{
	
		$tc = new talk(); 
		
		
		$notestr = get_singlepost($rv[0], $rv[1]);
		echo strlen($notestr).":".$notestr.",".json_encode($tc->get_tags($rv[0], $rv[1]));
	}
?>