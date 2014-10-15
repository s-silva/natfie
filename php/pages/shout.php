<?php
	include_once($_SERVER["DOCUMENT_ROOT"]."cards/php/general/basics.php"); 


	function get_shoutpage()
	{
		$htmld = join("", file("templates/shout.html"));

		return $htmld;
	}
?>