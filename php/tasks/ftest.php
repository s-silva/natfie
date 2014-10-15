<?php

	include_once("../general/basics.php");

	/* $skeyword, $sorttype, $limit, $searchmode, $availableonly) */
	
	echo "<p><code>".implode(", ", basics::search_friends("or", 0, 0, 1, 0))."</code></p>";
	
?>