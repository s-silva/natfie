<?php

	include_once("php/tiny/tiny.php");
	
	function run_packer()
	{
	
	$a = array(
	
		array('templates/main.html', 'code/html/main.html', 1),
		array(array(
				'css/main/default.css',
				'css/main/expandingarea.css',
				'css/main/messages.css'
			), 
			'code/css/default.css', 2),
		array(array(

			'js/main/main.js',
			'js/locale/timesync.js',
			'js/main/home.js',
			'js/realtime/feed.js',
			'js/main/chat.js',
			'js/main/drag.js',
			'js/main/msgs.js',
			'js/ajax/main.js',
			'js/realtime/rtmain.js',
			'js/realtime/rtchat.js',
			'js/main/photoup.js',
			'js/main/lazyload.js',
			'js/main/imagefx.js',
			'js/photostrip/pmm.js',
			'js/tagging/acdiv.js',
			'js/main/blog.js'
			
			), 'code/js/maincom.js', 3)
	
	
	
	
	
	
	);
	
	
	
	
	
	
	
	
	
	
	
	tiny_refresh("", $a);
	
	}
	
?>