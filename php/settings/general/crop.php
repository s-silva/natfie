<?php
	include("../../../clogin.php"); 
	
	$upload_dir = "upload_pic"; 				// The directory for the images to be saved in
	$upload_path = $upload_dir."/";				// The path to where the image will be saved
	$large_image_name = "resized_pic.jpg"; 		// New name of the large image
	$max_file = "1148576"; 						// Approx 1MB
	$max_width = "300";							// Max width allowed for the large image
	$genpath = "../../../data/u".$_SESSION['uslid']."/dp/";
	$large_image_location = $genpath."temp.jpg";
	
	
	function resizeImage($image,$width,$height,$scale)
	{
		$newImageWidth = ceil($width * $scale);
		$newImageHeight = ceil($height * $scale);
		$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
		$source = imagecreatefromjpeg($image);
		imagecopyresampled($newImage,$source,0,0,0,0,$newImageWidth,$newImageHeight,$width,$height);
		imagejpeg($newImage,$image,90);
		chmod($image, 0777);
		return $image;
	}
	
	function resizeThumbnailImage($thumb_image_name, $image, $width, $height, $newImageWidth, $newImageHeight, $start_width, $start_height)
	{
		$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
		$source = imagecreatefromjpeg($image);
		imagecopyresampled($newImage,$source,0,0,$start_width,$start_height,$newImageWidth,$newImageHeight,$width,$height);
		imagejpeg($newImage,$thumb_image_name,90);
		chmod($thumb_image_name, 0777);
		return $thumb_image_name;
	}

	function getHeight($image)
	{
		$sizes = getimagesize($image);
		$height = $sizes[1];
		return $height;
	}

	function getWidth($image)
	{
		$sizes = getimagesize($image);
		$width = $sizes[0];
		return $width;
	}

	if(isset($_POST["upload"]))
	{ 
	
		switch($_POST["upload"])
		{
		case 'Upload':
			$userfile_name = $_FILES['image']['name'];
			$userfile_tmp = $_FILES['image']['tmp_name'];
			$userfile_size = $_FILES['image']['size'];
			$filename = basename($_FILES['image']['name']);
			$file_ext = substr($filename, strrpos($filename, '.') + 1);
			
			if((!empty($_FILES["image"])) && ($_FILES['image']['error'] == 0)) {
				if (($file_ext!="jpg") && ($userfile_size > $max_file)) {
					$error= "ONLY jpeg images under 1MB are accepted for upload";
				}
			}else{
				$error= "Select a jpeg image for upload";
			}
			
			if (strlen($error)==0){
				if (isset($_FILES['image']['name'])){
					
					move_uploaded_file($userfile_tmp, $large_image_location);
					chmod($large_image_location, 0777);
					
					$width = getWidth($large_image_location);
					$height = getHeight($large_image_location);

					if ($width < $height){
						$scale = $max_width/$width;
						$uploaded = resizeImage($large_image_location,$width,$height,$scale);
					}else{
						$scale = $max_width/$height;
						$uploaded = resizeImage($large_image_location,$width,$height,$scale);
					}
					
					$width  *= $scale;
					$height *= $scale;
					
					resizeThumbnailImage($genpath."1.jpg", $large_image_location, 300, 300, 77, 77, 0, 0);
					resizeThumbnailImage($genpath."2.jpg", $large_image_location, 300, 300, 41, 41, 0, 0);
					resizeThumbnailImage($genpath."3.jpg", $large_image_location, 300, 300, 27, 27, 0, 0);
				}

				echo  $large_image_location;
				header("location: ../../../settings.general");
				exit();
			}
			break;
			
		case 'Save':
		
			resizeThumbnailImage($genpath."1.jpg", $large_image_location, 300, 300, 77, 77, $_POST["ppmx1"], $_POST["ppmy1"]);
			resizeThumbnailImage($genpath."2.jpg", $large_image_location, 300, 300, 41, 41, $_POST["ppmx1"], $_POST["ppmy1"]);
			resizeThumbnailImage($genpath."3.jpg", $large_image_location, 300, 300, 27, 27, $_POST["ppmx1"], $_POST["ppmy1"]);
			header("location: ../../../settings.general");
			exit();
			break;
		}
	}


	header("location: ../../../settings.general");
	exit();
?>