<?php

	include_once("clogin.php"); 
	include_once("php/profile/generate.php"); 
	include_once("php/profile/readonlygenerate.php"); 
	include_once("php/tools/idnumber.php");
	include_once("php/general/basics.php"); 
	include_once("pack.php"); 
	

	$log = new logmein(); 
	
	if(isset($_SESSION['loggedin']))
		$loginretval = $log->logincheck($_SESSION['loggedin'], "logon", "password", "useremail");
	else
		$loginretval = $log->logincheck("", "logon", "password", "useremail");
	
	if($loginretval == false)
		$loginretval = $log->autologin();

		
	$guestmode = 0;
	$footerbarcontent = "";
	$display_mode_feed = 1; /* display classic feed for guests */
	
	if($loginretval == false)
	{ 
		$guestmode = 1;
	}
		
	/*
	if($loginretval == false){ 
		 
		header( 'Location: login'); 

	}else{
	*/
	{
		

		
		
		
		if(!$guestmode)
		{
			$_SESSION['logclass'] = $log;
			basics::init();
			
			$page = "";//join("", file("templates/main.html"));
			
			$user_email = $_SESSION['uname']; 
			$user_fname = $_SESSION['ufirstname']; 
			$user_lname = $_SESSION['ulastname']; 
			$user_id    = $_SESSION['uid'];
			$user_sid   = translate_userid($user_id, false, 6);
			$user_slid  = translate_locationid($user_id, false, 7);
			
			$display_mode_feed = $_SESSION['displaymodefeed'];
			
			
			$current_lfid = 0;
			$current_lftimeid = 0;
			$current_lptimeid = 0;
			
			$_SESSION['usid'] = $user_sid;
			$_SESSION['uslid'] = $user_slid; /* lowercase, 7 letter user id */
			$user_sid_posts   = "p".$user_sid;
			
		}else{
			$page = join("", file("templates/guest.html"));
		}

		/* load home page as default */
		
		if(isset($_GET['user'])){
		
			if(isset($_GET['m'])){
			
				if($_GET['m'] == "p")
				{
					//$contentdata = join("", file("templates/posts.html"));
					
					include_once("php/general/posts.php"); 
					
					$pc = new posts(); 
					$postsuid = translate_userid(substr($_GET['user'], 1), true, 6);
					
					$pdata = $pc->get_posts_html_classic($postsuid, 0, 10, 0);
					$current_lfid = $pc->get_lfid();
					
					$contentdata = join("", file("templates/posts.classic.html"));
					
					
					$pgr = new profile_genreadonly();
					$contentdata = $pgr->profile_generate_readonly($postsuid, substr($_GET['user'], 1), $contentdata);

					$contentdata = str_replace("<posts.feedl>", $pdata[0], $contentdata);
					$contentdata = str_replace("<posts.feedr>", $pdata[1], $contentdata);
					
					
					
					
					
				}else if($_GET['m'] == "b"){
				
					$blogthemedir = "templates/blog/themes/1/";
					
					$contentdata = "<link href=\"".$blogthemedir."theme.css\" rel=\"stylesheet\" type=\"text/css\"/>";
					$contentdata .= join("", file($blogthemedir."theme.html"));
					
					
					include_once("php/general/blog.php"); 
					
					$pc = new blog(); 
					$postsuid = translate_userid(substr($_GET['user'], 1), true, 6);
					
					$pdata = $pc->get_blog_html($postsuid, 0, 10, 1);
					
					//$current_lfid = $pc->get_lfid();
					//$current_lftimeid = $pc->get_lftimeid();
					
					//$contentdata = join("", file("templates/posts.classic.html"));

					//$pgr = new profile_genreadonly();
					//$contentdata = $pgr->profile_generate_readonly($postsuid, substr($_GET['user'], 1), $contentdata);
					
					$contentdata = $pc->write_theme_data($postsuid, $contentdata);
					$contentdata = str_replace("<article.feed>", $pdata, $contentdata);
					
				}else{
				
					if($_GET['user'] == $user_sid)
					{
						$contentdata = join("", file("templates/profile_edit.html"));
						$contentdata = profile_generate($user_id, $user_sid, $contentdata);
					}else{
						$contentdata = join("", file("templates/profile.html"));
						$pgr = new profile_genreadonly();
						$contentdata = $pgr->profile_generate_readonly(translate_userid($_GET['user'], true, 6), $_GET['user'], $contentdata);
					}
				}
				
			}else{
			
				if(!$guestmode)
				{
					if($_GET['user'] == $user_sid)
					{
						$contentdata = join("", file("templates/profile_edit.html"));
						$contentdata = profile_generate($user_id, $user_sid, $contentdata);
					}else{
						$contentdata = join("", file("templates/profile.html"));
						$pgr = new profile_genreadonly();
						$contentdata = $pgr->profile_generate_readonly(translate_userid($_GET['user'], true, 6), $_GET['user'], $contentdata);
					}
				}else{
				
					$contentdata = join("", file("templates/profile.html"));
					$pgr = new profile_genreadonly();
					$contentdata = $pgr->profile_generate_readonly(translate_userid($_GET['user'], true, 6), $_GET['user'], $contentdata);
				}
			}
		}else if(isset($_GET['settings'])){
		
			if(!$guestmode)
			{
				require_once("php/pages/settings.php"); 
					
				$contentdata = get_settings_html($_GET['settings']);
				
				/*$fa = "templates/settings/".$_GET['settings'].".html";
				$fv = "";
				$fvn = 0;
				
				if(file_exists($fa))
				{
					$fv = join("", file("templates/settings/".$_GET['settings'].".html"));
				}else{
					$fv = join("", file("templates/settings/general.html"));
				}
				
				$fcd = join("", file("templates/settings/main.html"));
				
				$fn = strtolower($_GET['settings']);
				
				if($fn == "privacy") $fvn = 1;
				else if($fn == "display") $fvn = 2;
				else if($fn == "blog") $fvn = 3;
				else if($fn == "account") $fvn = 4;
				else if($fn == "personal") $fvn = 5;
				
				
				$fcd = str_replace("<settingstabcn$fvn>", " setting_select", $fcd);
				
				$fcd = str_replace("<settingstabcn0>", "", $fcd);
				$fcd = str_replace("<settingstabcn1>", "", $fcd);
				$fcd = str_replace("<settingstabcn2>", "", $fcd);
				$fcd = str_replace("<settingstabcn3>", "", $fcd);
				$fcd = str_replace("<settingstabcn4>", "", $fcd);
				$fcd = str_replace("<settingstabcn5>", "", $fcd);
				
				$contentdata = $fcd;
				$contentdata = str_replace("<settings.panelcontent>", $fv, $contentdata); */
			}else{
				header( 'Location: login'); 
			}
			
		}else if(isset($_GET['help'])){
		
			include_once("php/help/generate.php"); 
			
			$v = help_page_generate($_GET['help']);
			
			$contentdata = $v[0];
			$footerbarcontent = $v[1];
			
		}else{
			if(!$guestmode)
			{
				if(isset($_GET['m'])){
					if($_GET['m'] == "m") /* messages */
					{
					
						include_once("php/messages/main.php"); 
						
						$contentdata = join("", file("templates/messages.html"));
						$msgdset = getmsgdata($user_id, 0, 0, 0);
						$msgdsetcount = getmsg_pagecount($user_id, 0);
						$contentdata = str_replace("<data.msgset>", $msgdset, $contentdata);
						$contentdata = str_replace("<data.msgsetcount>", $msgdsetcount, $contentdata);
						
					}else if($_GET['m'] == "f"){ /* friends */
					
						$contentdata = join("", file("templates/friends.html"));
					
					}else if($_GET['m'] == "w"){ /* world */
					
						$contentdata = join("", file("templates/world.html"));
						
					}else if($_GET['m'] == "a"){ /* albums */
					
						$contentdata = join("", file("templates/albums.html"));
						
					}else if($_GET['m'] == "s"){ /* content/single posts */
					
						include_once("php/pages/shout.php"); 
						
						$contentdata = get_shoutpage();

					}else if($_GET['m'] == "c"){ /* content/single posts */
					
						include_once("php/pages/singlepost.php"); 
						
						if(isset($_GET['id']))
						{
							$spids = decode_singlepost_ids($_GET['id']);
							$contentdata = get_singlepost($spids[0], $spids[1]);
						}else{
							$contentdata = get_singlepost(0, 0);
						}
					
					}else{
						//$contentdata = join("", file("templates/home.html"));
						$contentdata = join("", file("templates/feed.classic.html"));
						//$contentdata = join("", file("templates/feed.garden.html"));
					}
					
				}else{
					//$contentdata = join("", file("templates/home.html"));
					include_once("php/general/posts.php"); 
					include_once("php/segments/feed.classic/leftbar.php"); 
					
					$pc = new posts(); 
					
					$pdata = $pc->get_posts_html_classic(0, 0, 10, 0);
					$current_lfid = $pc->get_lfid();
					$current_lftimeid = $pc->get_lftimeid();
					$current_lptimeid = $pc->get_lptimeid();
					
					//$contentdata = join("", file("templates/feed.classic.html"));
					//$contentdata = join("", file("templates/feed.garden.html"));
					
					if($display_mode_feed == 1)
					{
						if($device_mobile)
							$contentdata = join("", file("templates/mobile/feed.classic.html"));
						else
							$contentdata = join("", file("templates/feed.classic.html"));
					}else{
						$contentdata = join("", file("templates/feed.garden.html"));
					}
					
					$filterdata = array(0, basics::setting_get(1, "filter_view"), 0, 0, 0);
					
					$contentdata = str_replace("<feed.classic.leftbar>", leftbar_get(1, $filterdata), $contentdata);
					
					
					$contentdata = str_replace("<posts.feed>", $pdata, $contentdata);
				}
			}else{
				header( 'Location: login'); 
			}
		}
		
		
		
		$page = $contentdata;
		
		
		if(!$guestmode)
		{
			$page = str_replace("<userenv.availability>", basics::userenv_get_availability(0), $page);
			
			$crid = basics::userenv_get_croomid(0);
			$crsg = basics::userenv_get_croomsign(0);
			
			if(!$crid) $crid = 0;
			if(!$crsg) $crsg = 0;
			
			$page = str_replace("<userenv.croomid>",      $crid, $page);
			$page = str_replace("<userenv.croomsign>",    $crsg, $page);
			$page = str_replace("<userenv.lastmsgtime>",  basics::userenv_get_lastmsgtime(0), $page);
			
		
			$page = str_replace("<data.user.email>", $user_email, $page);
			$page = str_replace("<data.user.name>", $user_fname.' '.$user_lname, $page);
			$page = str_replace("<data.user.firstname>", $user_fname, $page);
			$page = str_replace("<data.user.lastname>", $user_lname, $page);
			$page = str_replace("<data.user.id>", $user_sid, $page);
			$page = str_replace("<data.user.lid>", $user_slid, $page);
			
			$page = str_replace("<data.user.lfid>", $current_lfid, $page);
			$page = str_replace("<data.user.lftimeid>", $current_lftimeid, $page);
			$page = str_replace("<data.user.lptimeid>", $current_lptimeid, $page);
		}
		
		$page = str_replace("<footerbar.content>", $footerbarcontent, $page);
		$page = str_replace("<main.footer>", join("", file("templates/mainfooter.html")), $page);
		
	} 

	echo html_compress($page);
	
	
	function html_compress($html)
	{
		preg_match_all('!(<(?:code|pre|script).*>[^<]+</(?:code|pre|script)>)!',$html,$pre);
		$html = preg_replace('!<(?:code|pre).*>[^<]+</(?:code|pre)>!', '#pre#', $html);
		//$html = preg_replace('#<!–[^\[].+–>#', '', $html);
		$html = preg_replace('/<!--(.*)-->/Uis', '', $html);
		$html = preg_replace('/[\r\n\t]+/', ' ', $html);
		$html = preg_replace('/>[\s]+</', '><', $html);
		$html = preg_replace('/[\s]+/', ' ', $html);
		if (!empty($pre[0])) {
			foreach ($pre[0] as $tag) {
				$html = preg_replace('!#pre#!', $tag, $html,1);
			}
		}
		return $html;
	}
?>