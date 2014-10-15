<?php

	include_once("../general/basics.php"); 
	include_once("../general/photos.php"); 

	$uid = $_SESSION['uid'];
	$dsc = "";
	$luid = basics::quick_ulida($uid);

	if(!isset($_GET['albid'])) die(0);
	if(isset($_GET['dsc'])) $dsc = $_GET['dsc'];
	
	$albid = $_GET['albid'];
	
	
	
	$upload_folder = "../../data/u$luid";

	$data = file_get_contents('php://input');
	$data = substr($data,strpos($data,",")+1);
	
	$content = base64_decode($data);
	
	/* pf and pt are two folders for full images, thumbnails. there can
	   be one for HD images called ph */
	   
	if(!file_exists("$upload_folder/pt/")) mkdir("$upload_folder/pt/");
	if(!file_exists("$upload_folder/pf/")) mkdir("$upload_folder/pf/"); /* 337x145 */
	if(!file_exists("$upload_folder/ptl/")) mkdir("$upload_folder/ptl/"); /* large size thumbnail for retina displays/blog 900x387*/
	
	$pc = new photos(); 
	$pfname = $pc->photo_add(0, $albid, 315, 150, 0, $dsc, 0);
	
	
	//if(!file_put_contents("$upload_folder/pf/$pfname.jpg", $content)) die(0);
	
	$im = imagecreatefromstring($content);
	
	$rv = 0;
	$rv = save_full($im, 1000, "$upload_folder/pf/$pfname.jpg");
	$rv = save_thumbnail($im, 337, 145, "$upload_folder/pt/$pfname.jpg");
	$rv = save_thumbnail($im, 900, 387, "$upload_folder/ptl/$pfname.jpg");
	
	echo $rv;
	exit();
	
	
	function save_thumbnail($img, $w, $h, $loc)
	{
		$width  = ImageSX($img);
		$height = ImageSY($img);
		
		$newh = floor(($height / $width) * $w);
		$sy = 0;
		$gasp = ($w / $h);
		
		if($newh > $h)
		{
			$sy = ($newh / 2) - ($h / 2);
		}
		
		$image_p = imagecreatetruecolor($w, $h);
		imagecopyresampled($image_p, $img, 0, 0, 0, $sy, $w, $h, $width, floor($h / $w * $width));
		
		imageinterlace($image_p, 1);
		
		return imagejpeg($image_p, $loc);
	}
	
	function save_full($img, $m, $loc)
	{
		$width  = ImageSX($img);
		$height = ImageSY($img);
		
		$nw = $width;
		$nh = $height;
		
		if($width > $height)
		{
			if($width > $m)
			{
				$nw = $m;
				$nh = floor(($height / $width) * $m);
			}
		}else{
			if($height > $m)
			{
				$nh = $m;
				$nw = floor(($width / $height) * $m);
			}
		}
		
		$image_p = imagecreatetruecolor($nw, $nh);
		imagecopyresampled($image_p, $img, 0, 0, 0, 0, $nw, $nh, $width, $height);
		
		imageinterlace($image_p, 1);
		
		return imagejpeg($image_p, $loc);
	}
?>