<?php

class lang
{

	var $id     = "eng.us";
	var $isoid  = "eng";
	var $iso1id = "en";
	
	class languagenames
	{
		$ourname = "Netfie";
		
		var $englishuk = "English UK";
		var $englishus = "English US";
		var $englishud = "English (Upside Down)";
		var $french    = "French";	
	}
	
	
	class general
	{
		$ourname = "Netfie";
		
		var $welcome     = "Welcome To $ourname";
		var $login       = "Log In";
		var $email       = "Email";
		var $password    = "Password";
		var $newhere     = "New?";
		var $about       = "About";
		var $help        = "Help";
	    var $privacy     = "Privacy";
	    var $contact     = "Contact";
		var $terms       = "Terms";
		var $rememberme  = "Remember Me";
		
		var $mark        = "Terms";
		var $note        = "Remember Me";
	
		var $home        = "Home";
	    var $profile     = "Profile";
		var $posts       = "Posts";
		var $messages    = "Messages";
		var $blog        = "Blog";
		var $more        = "More";
		var $shout       = "Shout!";
		var $photos      = "Photos";
		var $albums      = "Albums";
		var $friends     = "Friends";
	
	}
	
	class settings
	{
	
	}
	
	
	
	
	
	
	class messages
	{
		var $forgotpassword = "Forgot password?";
		var $writenewpost   = "Write your new post here?";
		var $leavenote      = "Leave a note";
		
		
		
	
	
	
	}

	class sections
	{
		var $name             = "name";
	    var $birthday         = "birthday";
	    var $age              = "age";
	    var $quotestart       = "\"";
	    var $quoteend         = "\"";
	    var $photo            = "photo";
	    var $video            = "video";
	    var $text             = "text";
	    var $link             = "link";
		var $audio            = "audio";
	    var $message          = "message";
	    var $notification     = "notification";
		var $error            = "error";
		var $warning          = "warning";
		var $delete           = "delete";
		var $view             = "view";
		var $everything       = "everything";
		var $nothing          = "nothing";
		var $everyone         = "everyone";
		var $noone            = "no one";
		var $you              = "you";
		var $yourself         = "yourself";
		var $friend           = "friend";
		var $friends          = "friends";
		var $nfriends         = "<n> friends";
		var $onefriend        = "1 friend";
		var $mutualfriend     = "mutual friend";
		var $mutualfriends    = "<n> mutual friends";
		var $onemutualfriend  = "one mutual friend";
		var $location         = "location";
		var $physical         = "physical";
		var $virtual          = "virtual";
		var $advertisement    = "advertisement";
		var $advertisements   = "advertisements";
		var $search           = "search";
		var $add              = "add";
	}
	
	class timewords
	{
		var $agoyear          = "a year ago";
	    var $agomonth         = "a month ago";
	    var $agoweek          = "a week ago";
	    var $agoday           = "a day ago";
	    var $agohour          = "a hour ago";
	    var $agominute        = "a minute ago";
	    var $agosecond        = "a second ago";
		var $agofewseconds    = "few seconds ago";
		
		var $agoyears         = "<n> years ago";
	    var $agomonths        = "<n> months ago";
	    var $agoweeks         = "<n> weeks ago";
	    var $agodays          = "<n> days ago";
	    var $agohours         = "<n> hours ago";
	    var $agominutes       = "<n> minutes ago";
		var $agoseconds       = "<n> minutes ago";
		
		var $january          = "January";
	    var $february         = "February";
	    var $march            = "March";
	    var $april            = "April";
	    var $may              = "May";
	    var $june             = "June";
		var $july             = "July";
		var $august           = "August";
		var $september        = "September";
		var $october          = "October";
		var $november         = "November";
		var $december         = "December";
		
		var $monday           = "Monday";
	    var $tuesday          = "Tuesday";
	    var $wednesday        = "Wednesday";
	    var $thursday         = "Thursday";
	    var $friday           = "Friday";
	    var $saturday    	  = "Saturday";
		var $sunday           = "Sunday";
		
		var $winter           = "winter";
		var $summer           = "summer";
		var $autumn           = "autumn";
		var $spring           = "spring";
		
		var $tomorrow         = "tomorrow";
		var $today            = "today";
		var $yesterday        = "yesterday";
		var $lastweek         = "last week";
		var $lastmonth        = "last month";
		var $lastyear         = "last year";
		
		var $morning          = "morning";
		var $noon             = "noon";
		var $evening          = "evening";
		var $night            = "night";
		var $tonight          = "tonight";
		var $thisevening      = "this evening";
		var $thisnoon         = "this noon";
		var $inthemorning     = "in the morning";
		
	}

	
	/* capitalize first letter in a sentence */
	
	function capitalize_normal($s)
	{
	
		return $s;
	}
	
	/* capitalize each starting letter */
	
	function capitalize_title($s)
	{
		return $s;
	}
	
	/* capitalize all letters */
	
	function capitalize_full($s)
	{
		return $s;
	}
}

?>