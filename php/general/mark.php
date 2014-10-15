<?php

include_once("basics.php");

class mark
{
	const mark_like   = 1;
	const mark_what   = 2;
	const mark_cool   = 3;
	const mark_laugh  = 4;
	const mark_love   = 5;
	
	/*
	 *	 keep noteid = 0 for marks for the post generally
	 *	 value 3 for onoff will alter the current value in the mark
	 *   marking more than once will be regulated in this function
	 */
	function add_mark($postuid, $postid, $noteid, $mark, $onoff)
	{
		$writeruid = $_SESSION['uid'];
		
		/* check if the post is valid */
		if(!basics::table_exists("posts_$postuid")) return 0;
		
		$rpd = basics::query("SELECT markcid FROM posts_$postuid WHERE id=$postid");
		
		if(!mysql_num_rows($rpd )) return 0;
		
		
		/* check if the talk talbe exists and create if not */
		
		if(!basics::table_exists("mark_".$postuid."_".$postid))
		{
			basics::query("CREATE TABLE mark_".$postuid."_".$postid." (
				id                 int not null primary key auto_increment,
				noteid			   int,
				uid       		   int,
				wtime              datetime,
				mtime              datetime,
				type			   int
				);");
				
			basics::query("UPDATE posts_$postuid SET markcid=1 WHERE id=$postid");
		}

		if($onoff == 1)
		{
			$markssent = 0;
			$marksnotify = 1;
			
			$rd = basics::query("SELECT id FROM mark_$postuid"."_".$postid." WHERE noteid=$noteid AND type=$mark AND uid=$writeruid");
			if(!$rd)
			{
				basics::query("INSERT INTO mark_$postuid"."_".$postid."  (noteid, uid, wtime, mtime, type)".
						                  "values ($noteid, $writeruid, UTC_TIMESTAMP(), UTC_TIMESTAMP(), $mark) ON DUPLICATE KEY UPDATE mtime = UTC_TIMESTAMP()");
										  
										  
				$markssent = 1;
			}

			if(!mysql_num_rows($rd))
			{
				basics::query("INSERT INTO mark_$postuid"."_".$postid."  (noteid, uid, wtime, mtime, type)".
						                  "values ($noteid, $writeruid, UTC_TIMESTAMP(), UTC_TIMESTAMP(), $mark) ON DUPLICATE KEY UPDATE mtime = UTC_TIMESTAMP()");
										  
				$markssent = 1;
			}
			
			if($postuid == $writeruid) $marksnotify = 0; /* add check for uid [todo] */
			
			if($markssent && $marksnotify)
			{
				if($noteid == 0)																		/* postid, noteid, type */
					basics::notification_set(basics::nmtype_general, basics::ntype_mark_a_post, $postuid, array($postid, 0, $mark));
			}
			
		}else{
			basics::query("DELETE FROM mark_$postuid"."_".$postid." WHERE noteid = $noteid AND uid = $writeruid AND type = $mark");
		}
		return 1;
	}
	
	
	/*
	 * if the noteid is zero the whole marks table associated will be deleted.
	 */	
	function delete_marks($postuid, $postid, $noteid)
	{
		$writeruid = $_SESSION['uid'];
		
		if($postuid != $writeruid) return 0;
	
		if(!basics::table_exists("posts_$postuid")) return 0;
		
		$rpd = basics::query("SELECT markcid FROM posts_$postuid WHERE id=$postid");
		if(!mysql_num_rows($rpd )) return 0;
		
		if($noteid != 0) 
			$rd = basics::query("DELETE FROM mark_$postuid"."_".$postid." WHERE noteid=$noteid");
		else
			$rd = basics::query("DROP TABLE IF EXISTS mark_$postuid"."_".$postid);

		if(!mysql_num_rows($rpd )) return 0;
		
		return 1;
	}
	
	
	
	
	/*
	 * get marks
	 */
	
	function get_marks($postuid, $postid, $noteid, $pprechecked)
	{
		$writeruid = $_SESSION['uid'];
		
		if(!$pprechecked)
		{
			if(!basics::table_exists("posts_$postuid")) return 0;
			if(!basics::table_exists("posts_$postuid"."_".$postid)) return 0;
			if(!basics::table_exists("mark_$postuid"."_".$postid)) return 0;
		}
		
		$rd = basics::query("SELECT SUM(type=1) AS m1, SUM(type=2) AS m2, SUM(type=3) AS m3, SUM(type=4) AS m4, SUM(type=5) AS m5 FROM mark_$postuid"."_".$postid." WHERE noteid=$noteid");
		if(!$rd) return 0;
		
		$ntd = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		
		$rv = mysql_fetch_array($rd);
		if(!$rv) return 0;
		
		if($rv['m1']) $ntd[0] = $rv['m1'];
		if($rv['m2']) $ntd[1] = $rv['m2'];
		if($rv['m3']) $ntd[2] = $rv['m3'];
		if($rv['m4']) $ntd[3] = $rv['m4'];
		if($rv['m5']) $ntd[4] = $rv['m5'];
		
		
		$rd = basics::query("SELECT SUM(type=1) AS m1, SUM(type=2) AS m2, SUM(type=3) AS m3, SUM(type=4) AS m4, SUM(type=5) AS m5 FROM mark_$postuid"."_".$postid." WHERE noteid=$noteid AND uid=$writeruid");
		
		if($rd)
		{
			$rv = mysql_fetch_array($rd);
			if($rv)
		
			if($rv['m1']) $ntd[5] = $rv['m1'];
			if($rv['m2']) $ntd[6] = $rv['m2'];
			if($rv['m3']) $ntd[7] = $rv['m3'];
			if($rv['m4']) $ntd[8] = $rv['m4'];
			if($rv['m5']) $ntd[9] = $rv['m5'];
		}
		
		/*while($rv = mysql_fetch_array($rd))
		{
			$ntdi = array($rv['id'], $rv['ctext'], $rv['wtime'], $rv['uid']);

			array_push($ntd, $ntdi);
		}*/
		
		return $ntd;
	}

	
	/*
	 * get a list of user id's for a certain note filtered by
	 * a given mark value.
	 */
	function get_markers($postuid, $postid)
	{
		return 0;
	}

	
	
}

?>