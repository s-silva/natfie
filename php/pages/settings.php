<?php
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 
	
	
	function get_settings_html_getweblist($userid)
	{
		if(!basics::table_exists("userwebsitelist_$userid")) return "";
		
		$res = mysql_query("select * from userwebsitelist_$userid");
		
		if(!$res) return "";
		
		$whdata = "";
		
		$rc = 1;
		
		while($row = mysql_fetch_array($res))
		{
			$ufs = $row['site'];
			$uts = $row['title'];
			
			$cval = "";
			
			if(!($rc % 2)) $cval = " class='od'";
			
			$whdata .= "<tr id='settings_g_wbtbr_$rc' $cval><td><select style='display: none; font-size: 11px;' id='settings_g_wbtbrsel_$rc'><option>Homepage:</option><option>Work:</option><option>Facebook:</option><option>Twitter:</option><option>DeviantArt:</option><option>Flickr:</option><option>MSN:</option><option>Skype:</option><option>Where I'm always at:</option><select><div onclick=\"javascript: settings_ieditset('settings_g_wbtbrsel_$rc', this, 1);\" id='settings_g_wbtbrdk_$rc'>$uts</div></td>";
			$whdata .= "<td><div style='min-width: 200px; min-height: 20px; cursor: pointer;' onclick=\"javascript: settings_ieditset('settings_gwba_$rc', this, 0);\" id='settings_g_wbtbrdv_$rc'>$ufs</div><input style='font-size: 11px; border: #efefef; min-width: 200px; display: none;' id='settings_gwba_$rc'/></td>";
			$whdata .= "<td><a href='javascript: settings_gwb_delwbrow(\"settings_g_wbtbr_$rc\")'>x</a></td></tr>";

			$rc++;
		}
	
		return "<table id='settings_g_wbtb' data-rcount='$rc'>".$whdata."</table>";
	}

	function get_settings_html($spanel)
	{
		$fa = "templates/settings/$spanel.html";
		$fv = "";
		$fvn = 0;
		
		if(file_exists($fa))
		{
			$fv = join("", file("templates/settings/$spanel.html"));
		}else{
			$fv = join("", file("templates/settings/general.html"));
		}
		
		$fcd = join("", file("templates/settings/main.html"));
		
		$fn = strtolower($spanel);
		
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
		$contentdata = str_replace("<settings.panelcontent>", $fv, $contentdata);
		$contentdata = str_replace("<settingsgpanelweblist>", get_settings_html_getweblist($_SESSION['uid']), $contentdata);
		
		
		if($fvn == 5)
		{
			$cuid = $_SESSION['uid'];
			
			$res = basics::query("select relationshipuser, relationshipmode, relationshipaccepted FROM userdetails where userid=$cuid");
			if(!$res) die("0");
			$row = mysql_fetch_array($res);
			if(!$row) die("0");
			
			$rperson = $row['relationshipuser'];
			$racc    = $row['relationshipaccepted'];
			$rmode   = $row['relationshipmode'];
			
			$rpersond = "Click here to select a person";
			$rhide    = 0;
			
			if($rmode < 2) $rperson = 0;
			if($rmode < 2) $rhide = 1;
			
			switch($rmode)
			{
			case 0: $rmode = "(None)"; break;
			case 1: $rmode = "Single"; break;
			case 2: $rmode = "In a relationship"; break;
			case 3: $rmode = "Married"; break;
			}
			
			if($rperson)
			{
				$rpersond = "<b style='color: #336699;'>".basics::get_username_from_id($rperson)."</b>";
				if(!$racc) $rpersond .= "(Pending)";
				
				$rpersond .= "<div><img onerror='failsafe_img(this, 1);' src='data/u".basics::quick_ulida($rperson)."/dp/1.jpg'/></div>";
				
			}
		
			if($rhide)
				$contentdata = str_replace("<settings_psvr_rhide>", "style='display: none;'", $contentdata);
			else
				$contentdata = str_replace("<settings_psvr_rhide>", "", $contentdata);
				
			$contentdata = str_replace("<settings_psvr_rmode>", $rmode, $contentdata);
			$contentdata = str_replace("<settings_psvr_rperson>", $rpersond, $contentdata);
		
		}
		
		if($_SESSION['displaymodefeed'] == 1)
		{
			$contentdata = str_replace("<settingdpmfeedst_1>", "style='visibility: visible;'", $contentdata);
			$contentdata = str_replace("<settingdpmfeedst_2>", "", $contentdata);
		}else{
			$contentdata = str_replace("<settingdpmfeedst_1>", "", $contentdata);
			$contentdata = str_replace("<settingdpmfeedst_2>", "style='visibility: visible;'", $contentdata);
		}
		return $contentdata;
	}
?>