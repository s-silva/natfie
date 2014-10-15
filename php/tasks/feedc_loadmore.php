<?php

	$lfid = 0;
	$inputsearchq = 0;
	$filterstr = 0;
	
	
	if(isset($_GET['lfid'])) $lfid = $_GET['lfid'];
	if(isset($_GET['q'])) $inputsearchq = $_GET['q'];
	if(isset($_GET['f'])) $filterstr = $_GET['f'];
	
	include_once("../../php/general/posts.php"); 

	$pc = new posts(); 
	
	$pc->set_searchquery($inputsearchq);
	
	
	set_filters($pc, $filterstr);
	
	
	
	

	$pdata = $pc->get_posts_html_classic(0, $lfid, 10, 1);
	$lfid = $pc->get_lftimeid();
	
	if($pdata)
		echo  "$lfid, $pdata";
	else
		echo "";



	function set_filters($pc, $filterstr)
	{
		if(!$filterstr) return;
		
		$fs = explode(",", $filterstr);
		$fsc = count($fs);
		/* [feed mode],[feed filter set],[collapse mode],[network set],[location set] */
		
		
		if($fsc > 0) /* feed mode */
		{
		
		}
		
		if($fsc > 1) /* feed filters */
		{
			if($fs[1] != "-") /* if not 'ignore' symbol */
			{
				$pc->set_mode_filters($fs[1], 1);
			}
		}
	
	}




?>