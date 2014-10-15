var lexpanditem = 0;
var msg_listc_width = 0;
var msg_listc_reboundside = 0;
var msg_listc_reboundx = 0;
var msg_scside = 0;
var msg_spcount = 2;
var msg_spcur = 0;
var msg_spmoved = 0;
var noslide = 0;

function messages_init()
{
	msg_spcount = $('messageclist').getAttribute('data-mcount');
	drag_init($('msliderbtn'), -37, 37, 0, 0, "message_slide_cb");
	
	messages_resize();
}

function message_slide_cb(xv, yv, mode)
{
	var o = $('msliderbtn');
	if(mode)
	{
		
		if(!noslide)
		{
			var o = $('msliderbtn');
			
			var x = parseInt(o.style.left);
			
			msg_listc_reboundx = x;
			msg_scside = 0;
			
			
			if(x > 37 / 2)
				msg_listc_reboundside = 1;
			else if(x < -37 / 2)
				msg_listc_reboundside = -1;
			else
				msg_listc_reboundside = 0;
		
			setTimeout(function (_this){reboundslider()}, 50);
			
		}else{
			var o = $('msliderbtn');
			o.style.left = "0px";
		}

		
		msg_spmoved = 0;
		noslide = 0;
		
	}else{
		
		var nv = 0;
		
		if(xv > 0) nv = 1;
		else if(xv < 0) nv = -1;
		
		if(msg_scside != nv)
		{
			msg_spcur += nv;
			
			if(msg_spcur >= msg_spcount)
			{
				msg_spcur = msg_spcount - 1;
				noslide = 1;
				o.style.left = "0px";
				
			}else if(msg_spcur < 0){
			
				msg_spcur = 0;
				noslide = 1;
				o.style.left = "0px";
			}
			
			if(!noslide)
			{
				if(nv == 1)
				{
					ajax_post("php/messages/get.php?p=" + msg_spcur, function(){
						if (xmlhttp.readyState==4 && xmlhttp.status==200)
						{
							$('messageclistslidecsub').innerHTML = xmlhttp.responseText;
						}
					});
					
				}else{
					ajax_post("php/messages/get.php?p=" + msg_spcur, function(){
						if (xmlhttp.readyState==4 && xmlhttp.status==200)
						{
							$('messageclistslidecsub').innerHTML = xmlhttp.responseText;
						}
					});
				}
			}
			
			msg_scside = nv;
		}
		
		if(!noslide)
		{
			msg_spmoved = 1;
			
			$('messageclistslidec').style.left = ((xv * msg_listc_width) / 37) + 'px';
			
			$('messageclistslidecsub').style.top = -($('messageclistslidec').offsetHeight + 2) + 'px';
			
			
			if(xv > 0)
				$('messageclistslidecsub').style.left = (((xv * msg_listc_width) / 37) - msg_listc_width) + 'px';
			else
				$('messageclistslidecsub').style.left = (((xv * msg_listc_width) / 37) + msg_listc_width) + 'px';
		}
	}
}

function msg_clist_swap()
{
	var t = $('messageclistslidecsub').innerHTML;
	
	$('messageclistslidecsub').innerHTML = $('messageclistslidec').innerHTML;
	$('messageclistslidec').innerHTML = t;

	$('messageclistslidec').style.left = '0px';
	$('messageclistslidecsub').style.left = msg_listc_width + 'px';

}

function reboundslider()
{
	var o = $('msliderbtn');
	var x = parseInt(o.style.left);
	var sc = 0;
	x /= 2;
	o.style.left = x + 'px';
	
	
	if(msg_listc_reboundside == 0)
	{
		$('messageclistslidec').style.left = ((x * msg_listc_width) / 37) + 'px';
	
		if(x > 0)
			$('messageclistslidecsub').style.left = (((x * msg_listc_width) / 37) - msg_listc_width) + 'px';
		else
			$('messageclistslidecsub').style.left = (((x * msg_listc_width) / 37) + msg_listc_width) + 'px';
	}else{
	
		msg_listc_reboundx += msg_listc_reboundside * 2;
		
		if(msg_listc_reboundx > 37) msg_listc_reboundx = 37;
		else if(msg_listc_reboundx < -37) msg_listc_reboundx = -37;
		else sc = 1;
		
		var rxv = (msg_listc_reboundx * msg_listc_width) / 37;

		//var rxv = (((-x + (37 * msg_listc_reboundside)) * msg_listc_width) / 37)
		
		$('messageclistslidec').style.left = (rxv) + 'px';
		
		if(msg_listc_reboundside == 1)
			$('messageclistslidecsub').style.left = (rxv - msg_listc_width) + 'px';
		else
			$('messageclistslidecsub').style.left = (rxv + msg_listc_width) + 'px';

		if(!sc)
		{
		
			
			msg_listc_reboundside = 0;
			msg_clist_swap();
			
			
			o.innerHTML = "Page " + (msg_spcur + 1) + " of " + msg_spcount;
		}
	}
			
	if(x > 0.2 || x < -0.2 || sc)
		setTimeout(function (_this){reboundslider()}, 50);
		

}

function messages_resize()
{
	var o = $('messageclist');
	var oin = $('messageclistin');
	
	if(!o) return 0;
	
	var hv = g_win_height - o.offsetTop - 50;
	var hw = g_win_width - o.offsetLeft;
	
	o.style.height = hv + 'px';
	oin.style.height = (hv - 20) + 'px';
	
	o.style.width = hw + 'px';
	
	msg_listc_width = hw;
	$('messageclistslidecsub').style.left = msg_listc_width + 'px';
}


function expand_basic(item)
{
	if(lexpanditem == item)
	{
		return;
	}
	
	item.className = item.className.replace('msg_line ', 'msg_line_b ');
	if(lexpanditem) lexpanditem.className = lexpanditem.className.replace('msg_line_b ', 'msg_line ');
	lexpanditem = item;
}
