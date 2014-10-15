<?php

	function translate_userid($in, $to_num = false, $pad_up = false)
	{
	  $index    = array("mhj17nIM5D69JTzEsSPNk0eyQ8LxgiwAVuRlXUZr3COaGoHfBdWqYtF2pKcv4b",
						"YTeZDg3GW61dftIpkHFnKhq7vw5ojCJM2SP9VaLlXb8zy0sN4uUBRAmQEOcrix",
						"jBuRTc0bQ9sdIoEY2hSNXz6wvfrM1eZa4tgUGmxlWiOynpVLHJ3Pk5FADK7qC8",
						"h2F0E74ROVXI3LcNYCvmKgdsT6iBDJnlZa9joUMyrSxGHbfq5eu8ApkP1zQWwt",
						"kO47vXwQgj29DnYV51RBIfcesitbuzSoNh68mUFxLlMaTAqZE0dJH3KPrpGyWC",
						"tvqKkwVP5Gau610XndfySWl9xQzbATZCF4Bs8hcN7oe3UgMEjmiIOHpRLrYDJ2");

	  $base  = strlen($index[0]);
	  $ni = 0;
	 
	  if ($to_num) {
		// Digital number  <<--  alphabet letter code
		$in  = strrev($in);
		$out = 0;
		$len = strlen($in) - 1;
		for ($t = 0; $t <= $len; $t++) {
		  $bcpow = bcpow($base, $len - $t);
		  $out   = $out + strpos($index[$ni % 6], substr($in, $t, 1)) * $bcpow;
		  $ni++;
		}
	 
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$out -= pow($base, $pad_up);
		  }
		}
		$out = sprintf('%F', $out);
		$out = substr($out, 0, strpos($out, '.'));
	  } else {
		// Digital number  -->>  alphabet letter code
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$in += pow($base, $pad_up);
		  }
		}
	 
		
		$out = "";
		for ($t = floor(log($in, $base)); $t >= 0; $t--) {
		  $bcp = bcpow($base, $t);
		  $a   = floor($in / $bcp) % $base;
		  $out = $out . substr($index[$ni], $a, 1);
		  $in  = $in - ($a * $bcp);
		  $ni++;
		}
		$out = strrev($out); // reverse
	  }
	 
	  return $out;
	}
	
	function translate_roomid($in, $to_num = false, $pad_up = false)
	{
	  $index    = array("SrNxBaUp3wQMhy8VnuJtXi6ODdPjIW5Ro0qG92bCczYEKf1sLvHZlAmg4keT7F",
						"kpv1BUeDM8aszx0cnOifdwhF5KPQE4N6WjolJRX9rVLgHyZSCAuG3mYTI2bq7t",
						"lHj93W8eYr4iN1ZUxkMqSs6oQXPmBu5AC7tRy2IEwncdGKz0JgbhvDVTfOapLF",
						"H4IYGVMo1gXxKhjkOJA7E9yL2tzsTvUNqS6DCQuBmc053FiedwnlpfZbar8RWP",
						"59QiXJfEmOY0ATVDZIkznq8srKaN6e4poMPwCBFSRGH1U2jL37tlcvydWgxubh",
						"DYQpoU3zadsAixX6vK7CcHrnfIeFuVyGgPB81RMmNZlTL9tOjbk2WEhS5Jw04q");

	  $base  = strlen($index[0]);
	  $ni = 0;
	 
	  if ($to_num) {
		// Digital number  <<--  alphabet letter code
		$in  = strrev($in);
		$out = 0;
		$len = strlen($in) - 1;
		for ($t = 0; $t <= $len; $t++) {
		  $bcpow = bcpow($base, $len - $t);
		  $out   = $out + strpos($index[$ni], substr($in, $t, 1)) * $bcpow;
		  $ni++;
		}
	 
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$out -= pow($base, $pad_up);
		  }
		}
		$out = sprintf('%F', $out);
		$out = substr($out, 0, strpos($out, '.'));
	  } else {
		// Digital number  -->>  alphabet letter code
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$in += pow($base, $pad_up);
		  }
		}
	 
		
		$out = "";
		for ($t = floor(log($in, $base)); $t >= 0; $t--) {
		  $bcp = bcpow($base, $t);
		  $a   = floor($in / $bcp) % $base;
		  $out = $out . substr($index[$ni], $a, 1);
		  $in  = $in - ($a * $bcp);
		  $ni++;
		}
		$out = strrev($out); // reverse
	  }
	 
	  return $out;
	}
	
	/* 36 ^ 7 > 62 ^ 6, so using only 7 characters per location is enough */
	
	function translate_locationid($in, $to_num = false, $pad_up = false)
	{
	  $index    = array("y8w061nla3pc4vzfx79rjgiout2mhkqeb5sd",
						"xnjfk028r3y54bodasu1vcgmethz9pi67wql",
						"4qr2lxhpk0im5t913sbvdjfyuw6zeacn78og",
						"kcfnsymzopd6b4e03ga81x25iu9lqwj7hrvt",
						"wdsl72fj8tohp5yr369qvxbmi4z1nugkae0c",
						"120dgtjsm7r56lnohy8kuax3zcbp4efw9qiv",
						"fzdc2ptnv63u50jy1ibw4xeom8a7sgrqk9hl");

	  $base  = strlen($index[0]);
	  $ni = 0;
	 
	  if ($to_num) {
		// Digital number  <<--  alphabet letter code
		$in  = strrev($in);
		$out = 0;
		$len = strlen($in) - 1;
		for ($t = 0; $t <= $len; $t++) {
		  $bcpow = bcpow($base, $len - $t);
		  $out   = $out + strpos($index[$ni], substr($in, $t, 1)) * $bcpow;
		  $ni++;
		}
	 
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$out -= pow($base, $pad_up);
		  }
		}
		$out = sprintf('%F', $out);
		$out = substr($out, 0, strpos($out, '.'));
	  } else {
		// Digital number  -->>  alphabet letter code
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$in += pow($base, $pad_up);
		  }
		}
	 
		
		$out = "";
		for ($t = floor(log($in, $base)); $t >= 0; $t--) {
		  $bcp = bcpow($base, $t);
		  $a   = floor($in / $bcp) % $base;
		  $out = $out . substr($index[$ni], $a, 1);
		  $in  = $in - ($a * $bcp);
		  $ni++;
		}
		$out = strrev($out); // reverse
	  }
	 
	  return $out;
	}
	
	
	
	function translate_gnumber($in, $to_num = false, $pad_up = false)
	{
	  $index    = array("ok5an1c3d2stp8b90mjfgv4lihey7zu6rqxw",
						"k0ufjnz1m9sqr7ow2lv3p4tdxcihbgy6ea58",
						"wzlmky7tib560f9uavd24s3oephrqcg8xn1j",
						"quh9r68lpmw0efzj2tkncv1sboyxd3574gia",
						"l0k5myszacigjde7xwnohv3146qpurbt28f9",
						"sr5y89gnxj61mvqlfepua720zbt4ch3wokid",
						"erxuan64os5lk1jpz2v7bcdwqm3tg0i89hyf");

	  $base  = strlen($index[0]);
	  $ni = 0;
	 
	  if ($to_num) {
		// Digital number  <<--  alphabet letter code
		$in  = strrev($in);
		$out = 0;
		$len = strlen($in) - 1;
		for ($t = 0; $t <= $len; $t++) {
		  $bcpow = bcpow($base, $len - $t);
		  $out   = $out + strpos($index[$ni % 7], substr($in, $t, 1)) * $bcpow;
		  $ni++;
		}
	 
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$out -= pow($base, $pad_up);
		  }
		}
		$out = sprintf('%F', $out);
		$out = substr($out, 0, strpos($out, '.'));
	  } else {
		// Digital number  -->>  alphabet letter code
		if (is_numeric($pad_up)) {
		  $pad_up--;
		  if ($pad_up > 0) {
			$in += pow($base, $pad_up);
		  }
		}
	 
		
		$out = "";
		for ($t = floor(log($in, $base)); $t >= 0; $t--) {
		  $bcp = bcpow($base, $t);
		  $a   = floor($in / $bcp) % $base;
		  $out = $out . substr($index[$ni % 7], $a, 1);
		  $in  = $in - ($a * $bcp);
		  $ni++;
		}
		$out = strrev($out); // reverse
	  }
	 
	  return $out;
	}

?>