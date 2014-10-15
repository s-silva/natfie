<?php

include_once("basics.php");

class talk
{

	const sincemode_time   = 1;
    const sincemode_id     = 2;
    const sincemode_last   = 3;
    const sincemode_first  = 4;
	const sincemode_set    = 5;


	/*
	 * reply to and init time will be ignored for now.
	 * the purpose of having those two parameters is:
	 *	
	 *	repto - reply to, the note number in the post.
	 *  inittime - note initialization time: when the user actually started
	 *			   writing the note. might be used to order the flow properly.
	 *
	 * though those two parameters won't be used, they will be
	 * entered to the system from the client and the data will still be stored
	 * inside the system for future usage. so, make sure that the entered 
	 * data is right.
	 *
	 * $postuid - the owner of the post (which one's profile)
	 * $postid - the id of the post
	 *
	 * notice that this function also takes care of the table initiation and such
	 * operations for a post which hadn't had any note entered before. though it will
	 * happen, the marking tables won't be affected by this function.
	 *
	 * cdata is not used at the moment, leave them as zero.
	 *
	 * ntype = 1 is for tags, then repto will become an array of two items
	 * that will fill rating1 and rating2 which will be x and y of the tag.
	 *	
	 */
	 
	function add_note($postuid, $postid, $textm, $repto, $inittime, $cdata, $ntype)
	{
		$writeruid = $_SESSION['uid'];
		
		/* check if the post is valid */
		
		if(!basics::table_exists("posts_$postuid")) return 0;
		
		$rpd = basics::query("SELECT talkcid FROM posts_$postuid WHERE id=$postid");
		
		if(!mysql_num_rows($rpd )) return 0;
		
		
		/* check if the talk talbe exists and create if not */
		
		if(!basics::table_exists("talk_".$postuid."_".$postid))
		{
			basics::query("CREATE TABLE talk_".$postuid."_".$postid." (
				id                 int not null primary key auto_increment,
				uid       		   int,
				wtime              datetime,
				mtime              datetime,
				atime              datetime,
				rating1            int,
				rating2            int,
				reports            int,
				ctext              text,
				type               int,
				resposecount       int,
				details            int,
				reptoid            int
				);");
				
			basics::query("UPDATE posts_$postuid SET talkcid=1 WHERE id=$postid");
		}

		$ftextm = strip_tags($textm, "<b><i><s>");
		$ftextm = basics::translate_urls_to_html($ftextm);
	
		$textm = trim(str_replace('\r', '[-n-l-]', str_replace('\n', '[-n-l-]', $textm)));
		$textm = str_replace("?", "[-q-]", $textm);
		$textm = strip_tags($textm, "<b><i><s>");
		
		$dtext = basics::escapestr($textm);

		
		if($ntype == 0)
		{
			basics::query("INSERT INTO talk_$postuid"."_".$postid."  (uid, wtime, mtime, atime, rating1, rating2, reports, ctext, type, resposecount, details, reptoid)".
						                  "values ($writeruid, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), 0, 0, 0, '$dtext', 0, 0, 0, $repto)");
		}else{
		
			$r1 = 0;
			$r2 = 0;
			
			if(count($repto) >= 2)
			{
				if(is_numeric($repto[0]))
					$r1 = $repto[0];
					
				if(is_numeric($repto[1]))
					$r2 = $repto[1];
			}
			
			basics::query("INSERT INTO talk_$postuid"."_".$postid."  (uid, wtime, mtime, atime, rating1, rating2, reports, ctext, type, resposecount, details, reptoid)".
						                  "values ($writeruid, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), $r1, $r2, 0, '$dtext', 1, 0, 0, 0)");

		}
		
		
		$notesnotify = 1;
		if($postuid == $writeruid) $notesnotify = 0; /* add check for uid [todo] */
			
		if($notesnotify)
		{			
			basics::notification_set(basics::nmtype_general, basics::ntype_note, $postuid, array($postuid, $postid, 0));
		}
			
		return $ftextm;
	}
	
	
	/*
	 *	simply deletes a note made by the user.
	 */	
	function delete_note($postuid, $postid, $noteid)
	{
		$writeruid = $_SESSION['uid'];
	
		if(!basics::table_exists("posts_$postuid")) return 0;
		
		$rpd = basics::query("SELECT talkcid FROM posts_$postuid WHERE id=$postid");
		if(!mysql_num_rows($rpd )) return 0;
		
		if($writeruid == $postuid) /* let users delete other people's nots on their posts */
			$rd = basics::query("DELETE FROM talk_$postuid"."_".$postid." WHERE id=$noteid");
		else
			$rd = basics::query("DELETE FROM talk_$postuid"."_".$postid." WHERE id=$noteid AND uid=$writeruid");

		if(!mysql_num_rows($rpd )) return 0;
		
		return 1;
	}
	
	/*
	 *	this functionally too is disabled for now. but future updates to the 
	 *	system might add features that will let the owner of the post decide
	 *	if the people can modify their notes.
	 */
	function modify_note($postuid, $postid, $textm)
	{
	
	}
	
	/*
	 * get an array of data for notes.
	 * sinced is the id of the last note since the fetching should be done.
	 * sincemode is the data mode of the 'sinced'
	 * can be either:
	 *		1. sincemode_time    - note time
	 *		2. sincemode_id      - note id
	 *		3. sincemode_last    - get 'sinced' number of notes appear in the end.
	 *		4. sincemode_first   - get 'sinced' number of notes appear first.
	 *
	 *
	 * leave sincemode to 0 to fetch all notes. 
	 *
	 * returning array will contain these information:
	 * 
	 *		1. noteid - a unique id for the note relative to the post.
	 *      2. text   - text data
     *		3. time   - time of the note
	 *		4. writer - writer of the note
	 *
	 */
	
	function get_notes($postuid, $postid, $sinced, $sincemode, $pprechecked, $cnotes)
	{
		if(!$pprechecked)
		{
			if(!basics::table_exists("posts_$postuid")) return 0;
			if(!basics::table_exists("talk_$postuid"."_".$postid)) return 0;
		}
		
		$rv = 0;
		$rd = 0;
		
		if($sincemode == 0)
			$rd = basics::query("SELECT * FROM talk_$postuid"."_".$postid." WHERE type=0");
		else if($sincemode == self::sincemode_last)
			$rd = basics::query("SELECT * FROM talk_$postuid"."_".$postid." WHERE type=0 ORDER BY id DESC LIMIT $sinced");
		else if($sincemode == self::sincemode_set)
			$rd = basics::query("SELECT * FROM talk_$postuid"."_".$postid." WHERE id<$sinced AND type=0 ORDER BY id DESC LIMIT $cnotes");

		
		if(!$rd) return 0;
		
		$ntd = array();
		
		while($rv = mysql_fetch_array($rd))
		{
			$ntdi = array($rv['id'], $rv['ctext'], $rv['wtime'], $rv['uid']);

			array_push($ntd, $ntdi);
		}
		
		if($sincemode == self::sincemode_last || $sincemode == self::sincemode_set)
		{
			$ntd = array_reverse($ntd);
		}
		
		return $ntd;
	}
	
	function get_lastnote_id($postuid, $postid, $pprechecked)
	{
		$cid = 0;
		
		if(!$pprechecked)
		{
			if(!basics::table_exists("posts_$postuid")) return 0;
			if(!basics::table_exists("posts_$postuid"."_".$postid)) return 0;
		}
				
		$resudcount = basics::query("SELECT Auto_increment FROM information_schema.tables WHERE table_name='talk_$postuid"."_".$postid."' AND table_schema = DATABASE();");
		if(!$resudcount) return 0;
		
		$resudcountrow = mysql_fetch_assoc($resudcount);
		$cid = $resudcountrow['Auto_increment'] - 1;
		
		return $cid;
	}
	
	function get_notes_count($postuid, $postid, $pprechecked)
	{
		$cid = 0;
		
		if(!$pprechecked)
		{
			if(!basics::table_exists("posts_$postuid")) return 0;
			if(!basics::table_exists("posts_$postuid"."_".$postid)) return 0;
		}
				
		$resudcount = basics::query("SELECT count(*) AS num FROM talk_$postuid"."_".$postid);
		if(!$resudcount) return 0;
		
		$resudcountrow = mysql_fetch_assoc($resudcount);
		$cid = $resudcountrow['num'];
		
		return $cid;
	}
	
	
	
	
	/*
	 * get talk last update time
	 */
	 
	function get_last_update($postuid, $postid)
	{
	
	}
	
	
	/* --------------------------------------- tags --------------------------------------*/
	
	
	
	
	
	
	
	/*
	 * [tagset] - text
	 *		    - x (rating1 of db is used)
	 *		    - y (rating2)
	 */
	function add_tags($uid, $postid, $tagset)
	{
		$tcoord = array(0, 0);
		
		foreach($tagset as $t)
		{
			$tcoord[0] = $t[1];
			$tcoord[1] = $t[2];
			
			$this->add_note($uid, $postid, $t[0], $tcoord, 0, 0, 1);
		}
		return 1;
	}
	
	/*
	 * tagidset - array of ids
	 */
	function remove_tags($uid, $postid, $tagidset)
	{
		if(!basics::table_exists("posts_$uid")) return 0;
		if(!basics::table_exists("talk_$uid"."_".$postid)) return 0;
		
		if($uid == $_SESSION['uid'])
		{
			foreach($tagidset as $t)
			{
				$rd = basics::query("DELETE FROM talk_$uid"."_".$postid." WHERE type=1 AND id=$t");
			}
		}else{
			$cuid = $_SESSION['uid'];
			foreach($tagidset as $t)
			{
				$rd = basics::query("DELETE FROM talk_$uid"."_".$postid." WHERE type=1 AND id=$t AND uid=$cuid");
			}
		}
	}
	
	function clear_tags($uid, $postid)
	{
		if($uid != $_SESSION['uid']) return 0; /* [todo] or if the user wrote the post */
		
		if(!basics::table_exists("posts_$uid")) return 0;
		if(!basics::table_exists("talk_$uid"."_".$postid)) return 0;
		
		$rd = basics::query("DELETE FROM talk_$uid"."_".$postid." WHERE type=1");
	}
	
	/*
	 * returns an array of  - id
	 *						- uid (of who made the tag)
	 *						- text
	 *		    			- x (rating1 of db is used)
	 *		    			- y (rating2)
	 *						- wtime
	 */
	function get_tags($uid, $postid)
	{
		if(!basics::table_exists("posts_$uid")) return 0;
		if(!basics::table_exists("talk_$uid"."_".$postid)) return 0;
		
		$rd = basics::query("SELECT * FROM talk_$uid"."_".$postid." WHERE type=1");
		
		if(!$rd) return 0;
		
		$i = 0;
		$tagset = array();
		
		while($rv = mysql_fetch_array($rd))
		{
			$tag = array($rv['id'], $rv['uid'], $rv['ctext'], $rv['rating1'], $rv['rating2'], strtotime($rv['wtime']));

			$tagset[$i] = $tag;
			$i++;
		}
		
		return $tagset;
	}
	
}

?>