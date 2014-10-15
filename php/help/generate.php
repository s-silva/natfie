<?php
	
	/* this module takes care of the generation of all help
	   related pages. */
	 
	/*
	 * p = parameters.
	 * returns content [0] and footer bar content [1]
	 */
	 
	function help_page_generate($p)
	{
		$gbordert = "<div style='position:absolute; top:30px; bottom:0px; left:0px; right:0px; overflow: auto;'><link href='css/help/main.css' rel='stylesheet' type='text/css'/><div class='helpbackouter'><div class='helpbackout'><div class='helpback'><div class='helpinside' id='helpinsidect'><div class='helpcontent'>".join("", file("templates/help/main.html"));
		$gborderb = "</div></div></div></div><div style='height: 200px;'></div><div style='background: #ffffff;'><main.footer></div></div>";
		$md = "";
		$ft = "Help";
		
		if($p == "about") {$md = join("", file("templates/help/about/about.html")); $ft = "About The Card Tree";}
		else if($p == "privacy") {$md = join("", file("templates/help/about/privacy.html")); $ft = "Privacy Policy";}
		else if($p == "terms") {$md = join("", file("templates/help/about/terms.html")); $ft = "Terms of Service";}
		else if($p == "articles") {$md = join("", file("templates/help/about/articles.html")); $ft = "Help Articles";}
		else if($p == "news") {$md = join("", file("templates/help/about/news.html")); $ft = "News Posts";}
		else if($p == "api") {$md = join("", file("templates/help/about/api.html")); $ft = "API";}
		else if($p == "faq") {$md = join("", file("templates/help/about/faq.html")); $ft = "Frequently Asked Questions";}
		else if($p == "contact") {$md = join("", file("templates/help/about/contact.html")); $ft = "Frequently Asked Questions";}
		else if($p == "advertising") {$md = join("", file("templates/help/about/advertising.html")); $ft = "Frequently Asked Questions";}
		
		return array($gbordert.$md.$gborderb, "");
		//return array($gbordert.$md.$gborderb, "<div class='footerbar'><div style='width: 100%;'><div style='margin: 2px 10px 0 10px;'><div style='float: left;'><div style='font-weight: bold;'>$ft</div></div><div style='float: right;'><a href='help.about'>About</a> | <a href='help.support'>Support</a> | <a href='help.main'>Help Contents</a></div></div></div></div>");
	}

?>