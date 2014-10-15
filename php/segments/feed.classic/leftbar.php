<?php

	function leftbar_get($mode, $data)
	{
		
		if($mode == 1)
		{
			$feed_mode     = 0;
			$feed_filter   = 0;
			$feed_collapse = 0;
			$feed_network  = 0;
			$feed_location = 0;
			
			
			
			if($data)
			{
				if(count($data) >= 5)
				{
					if($data[1])
					{
						if($data != "0")
						{
							$feed_filter = str_split($data[1]);
						}
					}
				}
			}
			
			$str_feed_mode     = "";
			$str_feed_filter   = "";
			$str_feed_collapse = "";
			$str_feed_network  = "";
			$str_feed_location = "";
			
			
			if($feed_filter)
				$str_feed_filter .= "<div onclick='feedc_filter_switch(2, 1);' id='feedcfilos2_1' data-fs='0' class='feedc_filtersection'>Everything</div>";
			else
				$str_feed_filter .= "<div onclick='feedc_filter_switch(2, 1);' id='feedcfilos2_1' data-fs='1' class='feedc_filtersection feedc_filtersel'>Everything</div>";

			for($i=2; $i<=7; $i++)
			{
				$fstr = "";
				
				switch($i)
				{
				case 2: $fstr = "Text updates"; break;
				case 3: $fstr = "Photos"; break;
				case 4: $fstr = "Links"; break;
				case 5: $fstr = "Music"; break;
				case 6: $fstr = "Videos"; break;
				case 7: $fstr = "Blog Articles"; break;
				}
				
				$selbool = "0";
				$selstr = "";
				
				if($feed_filter)
				{
					if($feed_filter[$i - 2] == "1")
					{
						$selbool = "1";
						$selstr = " feedc_filtersel";
					}
				}
				
				
				$str_feed_filter .= "<div onclick='feedc_filter_switch(2, $i);' id='feedcfilos2_$i' data-fs='$selbool' class='feedc_filtersection $selstr'>$fstr</div>";
			
			}
			
			/* collapse */
			
			if(!$feed_collapse)
			{
				$str_feed_collapse = "<div onclick='feedc_filter_switch(3, 1);' id='feedcfilos3_1' data-fs='1'  class='feedc_filtersection feedc_filtersel'>Collapsed</div>
									  <div onclick='feedc_filter_switch(3, 2);' id='feedcfilos3_2' data-fs='0'  class='feedc_filtersection'>Semi-expanded</div>";
			
			}else{
			
				$str_feed_collapse = "<div onclick='feedc_filter_switch(3, 1);' id='feedcfilos3_1' data-fs='0'  class='feedc_filtersection'>Collapsed</div>
									  <div onclick='feedc_filter_switch(3, 2);' id='feedcfilos3_2' data-fs='1'  class='feedc_filtersection feedc_filtersel'>Semi-expanded</div>";

			}
			
			
			
		
			return "<div class='feedc_lfilters'>
			
			<div onclick='feedc_filter_switch(1, 1);' id='feedcfilos1_1' data-fs='1' class='feedc_filtersection feedc_filtersel'>Recent</div>
			<div onclick='feedc_filter_switch(1, 2);' id='feedcfilos1_2' data-fs='0' class='feedc_filtersection'>Famous</div>
			<div onclick='feedc_filter_switch(1, 3);' id='feedcfilos1_3' data-fs='0' class='feedc_filtersection'>Closers</div>
			
			<div class='feedc_filtersectionend'></div>$str_feed_filter 
			<div class='feedc_filtersectionend'></div>$str_feed_collapse
			<div class='feedc_filtersectionend'></div>

			<div onclick='feedc_filter_switch(4, 1);' id='feedcfilos4_1' data-fs='1'  class='feedc_filtersection feedc_filtersel'><div class='feedc_filtersstatus'></div>Natfie</div>
			<div onclick='feedc_filter_switch(4, 2);' id='feedcfilos4_2' data-fs='0'  class='feedc_filtersection'><div class='feedc_filtersstatus'></div>Twitter</div>
			<div onclick='feedc_filter_switch(4, 3);' id='feedcfilos4_3' data-fs='0'  class='feedc_filtersection'><div class='feedc_filtersstatus'></div>Facebook</div>
			
			<div class='feedc_filtersectionend'></div>
			
			<div onclick='feedc_filter_switch(5, 1);' id='feedcfilos5_1' data-fs='1' class='feedc_filtersection feedc_filtersel'>Everyone</div>
			<div onclick='feedc_filter_switch(5, 2);' id='feedcfilos5_2' data-fs='0' class='feedc_filtersection'>Local - Physical</div>
			<div onclick='feedc_filter_switch(5, 3);' id='feedcfilos5_3' data-fs='0' class='feedc_filtersection'>Local - Virtual</div>
			<div onclick='feedc_filter_switch(5, 4);' id='feedcfilos5_4' data-fs='0' class='feedc_filtersection'>Family</div>
			<div onclick='feedc_filter_switch(5, 5);' id='feedcfilos5_5' data-fs='0' class='feedc_filtersection'>Friends</div>
			
			<div style='clear: both;'></div>
			
			</div>";
		}
		
		return "";
	}

?>