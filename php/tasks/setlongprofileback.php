<?php

	include_once("../general/basics.php"); 
	
	$yvalue =  -1;
	if(isset($_GET['top'])) $yvalue = $_GET['top'];

	$uid = $_SESSION['uid'];
	$luid = basics::quick_ulida($uid);

	$upload_folder = "../../data/u$luid";

	$data = file_get_contents('php://input');
	$data = substr($data,strpos($data,",")+1);
	
	$content = base64_decode($data);
	
	/* pf and pt are two folders for full images, thumbnails. there can
	   be one for HD images called ph */
	   
	if(!file_exists("$upload_folder/msc/")) mkdir("$upload_folder/msc/");

	$im = imagecreatefromstring($content);
	
	$rv = 0;
	$rv = save_img($im, 1200, 260, "$upload_folder/msc/profileback.jpg", $yvalue);

	echo $rv;
	exit();
	
	
	function save_img($img, $w, $h, $loc, $sy)
	{
		$width  = ImageSX($img);
		$height = ImageSY($img);
		
		$newh = floor(($height / $width) * $w);
		
		$gasp = ($w / $h);
		
		if($sy < 0)
		{
			if($newh > $h)
			{
				$sy = ($newh / 2) - ($h / 2);
			}
		}
		
		$sy = $sy * ($width / $w);
		
		//if($sy > $height - $newh) $sy = $height - $newh;
		
		$image_p = imagecreatetruecolor($w, $h);
		imagecopyresampled($image_p, $img, 0, 0, 0, $sy, $w, $h, $width, floor($h / $w * $width));
		
		imageinterlace($image_p, 1);
		
		return imagejpeg($image_p, $loc);
	}
?>