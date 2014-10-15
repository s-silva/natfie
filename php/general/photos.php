<?php

include_once("basics.php");
include_once("posts.php");

class photos
{
	const defalbum_blogphotos     = 1;
	const defalbum_random         = 2;
	const defalbum_profilephotos  = 3;

	/*
	 * this basically creates the album and would probably
	 * create and initialize photos/albums table.
	 * will create a whole post for the album and stop at that point.
	 * publishing it will be done as another process.
	 * probably would be done after adding photos.
	 * returns the album id.
	 * location will be passed as an array with place name, country name
	 * and coordinates.
	 */
	function album_create($aname, $dsc, $loc, $defalbum)
	{
		$cuid = $_SESSION['uid'];
		
		/* create the table if it doesn't exist */
		
		if(!basics::table_exists("albums_$cuid"))
		{
			basics::query("CREATE TABLE albums_$cuid (
				id					int not null primary key auto_increment,
				name				varchar(128),
				dsc					text,
				locname				varchar(260),
				loccountry			varchar(8),
				loclat				double,
				loclon				double,
				locset				double,
				locext				int,
				wtime				datetime,
				atime				datetime,
				mtime				datetime,
				photocount			int,
				privacymode   		int,
				filtergroup  		int,
				privacyext			int,
				postid				int,
				coverphoto			int,
				puid				int
				);");
		}		



		$aname = basics::escapestrfull($aname);
		$dsc = basics::escapestrfull($dsc);
		
		$loccountry	= "";
		$locname	= "";
		$loclat		= 0.0;
		$loclon		= 0.0;
		$locset		= 0;
		
		if($loc)
		{
			/* [todo] set above location parameter list */
		}
		
		$albid = 0;
		
		$rcheck = basics::query("SELECT id FROM albums_$cuid WHERE name='$aname'");
		if(mysql_num_rows($rcheck ))
		{
			$r = mysql_fetch_array($rcheck);
			$albid = $r['id'];
			
			basics::query("UPDATE albums_$cuid SET mtime=UTC_TIMESTAMP(), dsc='$dsc' WHERE name='$aname'");
		
			
		}else{
		
		
			$albid = basics::table_getlastitem("albums_$cuid") + 1;
			
			$pc = new posts();
			$postid = $pc->create_post(0, posts::post_type_album, $aname, $albid, 0, 0, 1);
		
			basics::query("INSERT INTO albums_$cuid (name, dsc, locname, loccountry, loclat, loclon, locset, locext, wtime, atime, mtime, photocount, privacymode, filtergroup, privacyext, postid, coverphoto)".
						                  "values ('$aname', '$dsc', '$locname', '$loccountry', $loclat, $loclon, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, 0, $postid, 0)");
			
		}
		
		
		
		return $albid;
	}
	
	function album_delete($albumid)
	{
		$uid = $_SESSION['uid'];

		if(!basics::table_exists("photos_$uid")) return 0;
		
		$res = basics::query("SELECT id FROM photos_$uid WHERE albumid=$albumid");
		if(!$res) return 0;

		
		while($r = mysql_fetch_array($res))
		{
			$this->photo_delete($uid, $r['id'], 0);
		}
		
		if(!basics::table_exists("albums_$uid")) return 0;
		
		$res = basics::query("SELECT postid FROM albums_$uid WHERE id=$albumid");
		if(!$res) return 0;
		
		$r = mysql_fetch_array($res);
		if(!$r) return 0;
		
		/* delete post associated with the album */
		$pc = new posts();
		$pc->delete_postex($uid, $r['postid']);
		
		basics::query("DELETE FROM albums_$uid WHERE id=$albumid");
		return 1;
	}
	
	function album_modify($albumid, $aname, $dsc, $loc)
	{
	
	}
	
	/* 
	 * will be published with the latest photo as cover.
	 */
	function album_publish($albumid)
	{
	
	}
	
	function album_getinfo($uid, $albumid, &$aname, &$dsc, &$loc)
	{
		if(!$uid)$uid = $_SESSION['uid'];

		if(!basics::table_exists("albums_$uid")) return 0;
		
		$res = basics::query("SELECT * FROM albums_$uid WHERE id=$albumid");
		if(!$res) return 0;

		$r = mysql_fetch_array($res);
		if(!$r) return 0;
		
		$dsc = $r['dsc'];
		$aname = $r['name'];
		return 1;
	}
	
	
	/* ------------------------------------------------------ */
	
	
	/*
	 * will return a text based ID, it will used
	 * to name the photo file.
	 * $d isn't used
	 * return = array[photo file name, numeric id]
	 */
	function photo_add($uid, $albumid, $w, $h, $d, $dsc, $loc)
	{
		$cuid = $_SESSION['uid'];
		if(!$uid) $uid = $cuid;
		
		/* create the table if it doesn't exist */
		
		if(!basics::table_exists("photos_$uid"))
		{
			basics::query("CREATE TABLE photos_$uid (
				id					int not null primary key auto_increment,
				albumid				int,
				fname				varchar(128),
				name				varchar(128),
				dsc					text,
				locname				varchar(260),
				loccountry			varchar(8),
				loclat				double,
				loclon				double,
				locset				double,
				locext				int,
				wtime				datetime,
				atime				datetime,
				mtime				datetime,
				privacymode   		int,
				filtergroup  		int,
				privacyext			int,
				postid				int,
				tagid				int,
				upmethod			int,
				ptype               int,
				w					int,
				h					int,
				d					int
				);");
		}		
		
		$dsc = basics::escapestrfull($dsc);
		
		$cnumid = basics::table_getlastitem("photos_$uid") + 1;
		$pfname = basics::generate_bulk(32).$cnumid;
		
		$loccountry	= "";
		$locname	= "";
		$loclat		= 0.0;
		$loclon		= 0.0;
		$locset		= 0;
		
		if($loc)
		{
			/* [todo] set above location parameter list */
		}
		
		$pc = new posts();
		$postid = $pc->create_post(0, posts::post_type_albumphoto, $pfname, $albumid, $cnumid, 0, 0);
		
		basics::query("INSERT INTO photos_$uid (albumid, fname, name, dsc, locname, loccountry, loclat, loclon, locset, locext, wtime, atime, mtime, privacymode, filtergroup, privacyext, postid, tagid, upmethod, ptype, w, h, d)".
						                  "values ($albumid, '$pfname', '', '$dsc', '$locname','$loccountry', $loclat, $loclon, 0, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, $postid, 0, 0, 0, $w, $h, $d)");


		basics::query("UPDATE albums_$uid SET coverphoto=IF(coverphoto > 0, coverphoto, $cnumid) WHERE id=$albumid");
		basics::query("UPDATE albums_$uid SET photocount=photocount+1 WHERE id=$albumid");

		return $pfname;
	}
	
	/*
	 * will take care of the file removal too if it's there.
	 */
	function photo_delete($uid, $photoid, $adjustcover)
	{
		$cuid = $_SESSION['uid'];
		
		if(!basics::table_exists("photos_$uid")) return 0;
		
		if($cuid != $uid) return 0; /* [todo] other people's photo posts */
		
		$res = basics::query("SELECT * FROM photos_$uid WHERE id=$photoid");
		if(!$res) return 0;
		
		$r = mysql_fetch_array($res);
		if(!$r) return 0;
		
		$albumid = $r['albumid'];
		
		/* delete post associated with the photo */
		$pc = new posts();
		
		$pc->delete_postex($uid, $r['postid']);
		
		/* delete files */
		
		$luid = basics::quick_ulida($uid);
		
		$dfp =   "../../data/u$luid/pt/".$r['fname'].".jpg";
		if(file_exists($dfp)) unlink($dfp);
		
		$dfp =   "../../data/u$luid/pf/".$r['fname'].".jpg";
		if(file_exists($dfp)) unlink($dfp);
		
		$dfp =   "../../data/u$luid/ptl/".$r['fname'].".jpg";
		if(file_exists($dfp)) unlink($dfp);
	
	
		
		basics::query("DELETE FROM photos_$uid WHERE id=$photoid");
		basics::query("UPDATE albums_$uid SET photocount=photocount-1 WHERE id=$albumid");
		
		/* [todo] set cover photo if we just deleted that */
		
		if($adjustcover)
		{
			$res = basics::query("SELECT * FROM albums_$uid WHERE id=$albumid");
			if(!$res) return 0;
			
			$r = mysql_fetch_array($res);
			if(!$r) return 0;
			
			if($r['coverphoto'] == $photoid)
			{
				$ncoverpicid = 0;
				
				$res = basics::query("SELECT id FROM photos_$uid WHERE albumid=$albumid ORDER BY id DESC LIMIT 1");
				if($res)
				{
					$r = mysql_fetch_array($res);
					if($r)
					{
						$ncoverpicid = $r['id'];
					}
				}
				
				basics::query("UPDATE albums_$uid SET coverphoto=$ncoverpicid WHERE id=$albumid");
			}
		}

	
		return 1;
	}
	
	/*
	 * pid - person id.
	 * x, y, z, radius are relative to the photo size. saved in floating point.
	 * tag will be added to the tag table. yet appear as hidden till the owner
	 * or tagged person accepts. returns tag id
	 */
	function photo_settag($albumid, $photoid, $x, $y, $z, $radius, $ptext, $pid)
	{
	
	}
	
	function photo_accepttag($albumid, $photoid, $tagid)
	{
	
	}
	
	/*
	 * if albumid is there and photo id isn't, this will return the cover photo.
	 * photomode - 0 for thumbnail and 1 for full photo 2 for large thumbnails
	 * albumid and uid are optional
	 * if cvpid is non-zero, it will return the photo id
	 */
	function photo_getfile($uid, $albumid, $photoid, $photomode, &$cvpid)
	{
		if(!$uid) $uid = $_SESSION['uid'];
		
		if(!$photoid)
		{
			if(!basics::table_exists("albums_$uid")) return 0;
			
			$res = basics::query("SELECT * FROM albums_$uid WHERE id=$albumid");
			if(!$res) return 0;
			
			$r = mysql_fetch_array($res);
			if(!$r) return 0;
			
			$photoid = $r['coverphoto'];
		}

		if($cvpid) $cvpid = $photoid;
		
		if(!basics::table_exists("photos_$uid")) return 0;
		
		$res = basics::query("SELECT fname FROM photos_$uid WHERE id=$photoid");
		if(!$res) return 0;
		
		$r = mysql_fetch_array($res);
		if(!$r) return 0;
		
		$fname = $r['fname'].".jpg";
		$luid = basics::quick_ulida($uid);
		
		if($photomode == 0) return "data/u$luid/pt/$fname";
		else if($photomode == 1) return "data/u$luid/pf/$fname";
		else if($photomode == 2) return "data/u$luid/ptl/$fname";
		else return 0;
	}
}

?>