<?php
	
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php");
	//include_once("../general/basics.php");


	/* translate notifications from the database format to html
	   including button additions etc. */
	   
	/* note: the tagged users (@userid) in input text has to be translated
	         before running through this process */
	   
	function ntf_translate($listindex, $maintype, $type, $fromuser, $time, $text, $datatype, $ddata, $ddata2, $ddatapath, $viewed)
	{
		$usid  = basics::quick_uida($fromuser);
		
		$dtf = "";
		
		if($type == basics::ntype_friendship_request)
			$dtf = "<div><div style='float: right;'><div class='general_button_mlh button_white' onclick=\"javascript: friendreq_reject('$usid');\">Reject</div><div class='general_button_mlh button_green'><div class='button_wide' onclick=\"javascript: friendreq_accept('$usid');\">Accept</div></div></div><div style='clear: both;'></div></div>";
		else if($type == basics::ntype_relationship_request_d)
			$dtf = "<div><div style='float: right;'><div class='general_button_mlh button_white' onclick=\"javascript: relationshipreq_reject('$usid');\">Reject</div><div class='general_button_mlh button_green'><div class='button_wide' onclick=\"javascript: relationshipreq_accept('$usid', 1);\">Accept</div></div></div><div style='clear: both;'></div></div>";
		else if($type == basics::ntype_relationship_request_m)
			$dtf = "<div><div style='float: right;'><div class='general_button_mlh button_white' onclick=\"javascript: relationshipreq_reject('$usid');\">Reject</div><div class='general_button_mlh button_green'><div class='button_wide' onclick=\"javascript: relationshipreq_accept('$usid', 2);\">Accept</div></div></div><div style='clear: both;'></div></div>";
	
		$vd = $ntfbdata = ntftl_box("", $dtf, $listindex, $fromuser, $text, $time, $maintype);
		
		
		if($type == basics::ntype_mark_a_post && $ddata)
		{
			$ddpostuid = $_SESSION['usid'];
			$ddpostid = "c".$ddpostuid.'-'.basics::quicktranslate_encodenumber($ddata);
			return "<div style='cursor: pointer' onclick='javascript: h5wh_switch(\"$ddpostid\"); notifications_mhide(\"notify\")'>$vd</div>";
		
		}else if($type == basics::ntype_note){
		
			$ddpostuid = $_SESSION['usid'];
			$ddpostid = "c".basics::quick_uida($ddata).'-'.basics::quicktranslate_encodenumber($ddata2);
			return "<div style='cursor: pointer' onclick='javascript: h5wh_switch(\"$ddpostid\"); notifications_mhide(\"notify\")'>$vd</div>";
		}else if($maintype == basics::nmtype_message){
		
			$ddpostuid = $_SESSION['usid'];
			$ddpostid = "c";
			return "<div style='cursor: pointer' onclick='javascript: message_expand(this); notifications_mhide(\"notify\")' data-rid='$ddata' data-cs='$ddatapath'>$vd</div>";
		}
		return $ntfbdata;
	}
	
	/*
	 * dtm - main data
	 * dtf - footer data (photo, mark button, quick comment etc.)
	 */
	function ntftl_box($dtm, $dtf, $lindex, $uid, $text, $time, $mtype)
	{
		$oeval = $lindex % 2 ? "menuodd" : "";
		
		$uname = basics::get_username_from_id($uid);
		$usid  = basics::quick_uida($uid);
		$uslid = basics::quick_ulida($uid);
		$ptime = strtotime( $time ); /* php time */
		
		if($dtm) $dtm = "&quot;".$dtm."&quot;";
		
		$rs = "<div class=\"nmenuitem $oeval\" id=\"notifydm$lindex\" onmouseover='ntfitem_check(this, ".($mtype-1).");' data-nchecked='0'>";
		$rs .= "<div class='boxpic' style=\"background: url('data/u$uslid/dp/2.jpg');\"></div>";
		$rs .= "<div class=\"nmenutext\"><a class='dunamelink' href='pu$usid'>".$uname."</a> $text<p>$dtm</p></div>";
		$rs .= "<div class=\"nmenutextdetail\"><abbr class='synctime' data-ts='$ptime' data-mode='0'>ddddd</abbr></div><div style=\"clear:both;\"></div>";
		$rs .= $dtf;
		$rs .= "</div>";
		return $rs;
	}

?>