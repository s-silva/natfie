<?php

	//require 'packer/class.JavaScriptPacker.php';
	require 'jsmin.php';


   /*
	* this is a compression/stripping and caching system for
	* websites. it allows you to
	*
	* 1. compress html, css and js
	* 2. combine few files into one to reduce http requests
	* 3. cache files to reduce the server load.
	* 4. automatic cache refreshing for easy file editing
	*
	* http://c-h.users.sf.net
	* 
	*/
	
	$tiny_o_bypass_jscompression = 0;      /* if you want to debug the code */
	

   /*
	* request html text from a file for server usage.
	* call is coming from the server. there will be a cached text
	* value in the memory, load that instead of dealing with i/o
	*/
	
	function tiny_getfile($fname)
	{
		return join("", file($fname));
	}

   /*
	* refresh cache/files
	*
	* pprefix - path prefix
	* iof - an array, usage:
	* 
    *    {original file name, output file name, filetype},
	*	 {{original file 1, original file 2, original file 3}, output file name, filetype}
	*	 
	*	 example:
	*	 
	*	 {{'part1.js', 'part2.js', 'part3.js'}, 'main.js', 3}
	*
	*
	* filetype - 1. html
	*            2. css
	*            3. js
	*
	*
	*/
	
	function tiny_refresh($pprefix, $iof)
	{
		foreach($iof as $item)
		{
			$iitems = $item[0];
			$oitem = $item[1];
			$itype = $item[2];
		
			$fmodified = 0;
			
			if(file_exists($oitem))
			{
				$otime = filemtime($oitem); /* output file's modified time */
		
				if(is_array($iitems))
				{
					foreach($iitems as $ci)
					{
						$ci = $pprefix.$ci;
						if(tiny_isnew($ci, $otime))
						{
							$fmodified = 1;
							break;
						}
					}
				}else{
					$ci = $pprefix.$iitems;
					if(tiny_isnew($ci, $otime)) $fmodified = 1;
				}
			}else{
				$fmodified = 1;
			}
			
			if($fmodified) /* start processing the file */
			{
				$fcontent = "";
				
				if(is_array($iitems))
				{
					foreach($iitems as $ci)
					{
						$ci = $pprefix.$ci;
						$fcontent .= join("", file($ci));
					}
				}else{
					$ci = $pprefix.$iitems;
					$fcontent .= join("", file($ci));
				}
				
				switch($itype)
				{
				case 1: /* html */
					$fcontent = tiny_html_compress($fcontent);
					break;
					
				case 2: /* css */
					$fcontent = tiny_css_compress($fcontent);
					break;
					
				case 3: /* js */
					$fcontent = $fcontent;//tiny_js_compress($fcontent);
					break;
				}
				
				/* if html, keep in cache */
				if($itype == 1)
				{
				
				}
			
				/* save file */

				file_put_contents($pprefix.$oitem, $fcontent, LOCK_EX);
			}
		}
		return 1;
	}
	
	function tiny_isnew($fname, $otime)
	{
		if(!file_exists($fname)) return 0;
		if(filemtime($fname) > $otime) return 1;
		return 0;
	}


   /*
	* compression ---------------------------------------------------
	*/

	function tiny_html_compress($html)
	{
		preg_match_all('!(<(?:code|pre|script).*>[^<]+</(?:code|pre|script)>)!',$html,$pre);
		$html = preg_replace('!<(?:code|pre).*>[^<]+</(?:code|pre)>!', '#pre#', $html);
		//$html = preg_replace('#<!–[^\[].+–>#', '', $html);
		$html = preg_replace('/<!--(.*)-->/Uis', '', $html);
		$html = preg_replace('/[\r\n\t]+/', ' ', $html);
		$html = preg_replace('/>[\s]+</', '><', $html);
		$html = preg_replace('/[\s]+/', ' ', $html);
		if (!empty($pre[0])) {
			foreach ($pre[0] as $tag) {
				$html = preg_replace('!#pre#!', $tag, $html,1);
			}
		}
		return $html;
	}

	function tiny_css_compresso($css)
	{
		$css = preg_replace('!//[^\n\r]+!', '', $css);#comments<br />
		//$css = preg_replace('/[\r\n\t\s]+/s', ' ', $css);#new lines, multiple spaces/tabs/newlines<br />
		$css = preg_replace('#/\*.*?\*/#', '', $css);#comments<br />
		//$css = preg_replace('/[\s]*([\{\},;:])[\s]*/', '\1', $css);#spaces before and after marks<br />
		//$css = preg_replace('/^\s+/', '', $css);#spaces on the begining<br />
		return $css;
	}
	
	function tiny_css_compress($css)
	{
		require_once'cssmin.php';
		
	
		$css = cssmin::process($css);
		return $css;
	}

	
	function tiny_js_compress($jsv)
	{
		global $tiny_o_bypass_jscompression;
		if($tiny_o_bypass_jscompression) return $jsv;
		
		//$packer = new JavaScriptPacker($jsv, 'Normal', true, false);
		//$jsv = $packer->pack();
		$jsv = JSMin::minify($jsv);
	
		return $jsv;
	}
	
	

?>