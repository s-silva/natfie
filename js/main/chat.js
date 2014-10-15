var chat_croomid = 0;
var chat_croomsign = 0;
var chat_availability = 0;
var chat_lastmsgtime = 0;
var chat_lastlineid = 0;

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

function chat_show()
{
	$("chatbox").style.visibility = 'visible';
	$("chatntf").style.right = '310px';
	setCookie("cards_chatbox", "1",  365);

	chat_resize();
	post_center();
}

function chat_hide()
{
	$("chatbox").style.visibility = 'hidden';
	$("chatntf").style.right = '10px';
	setCookie("cards_chatbox", "0", 365);

	chat_resize();
	post_center();
}

function chat_isopen()
{
	if(getCookie("cards_chatbox") == "1")
		return 1;
	else
		return 0;
}


function showhide_chat(item)
{
	if($(item).style.visibility != 'visible')
	{
		$(item).style.visibility = 'visible';
		$("chatntf").style.right = '310px';
		setCookie("cards_chatbox", "1",  365);
	}else{
		$(item).style.visibility = 'hidden';
		$("chatntf").style.right = '10px';
		setCookie("cards_chatbox", "0", 365);
	}
	
	chat_resize();
	post_center();
}

function chat_resize()
{
	$("chatcontent").style.height = g_win_height - ($("cboxtop").offsetHeight + 30) + 'px';
	
	var pha_content = $('pha_content');
	
	if(pha_content)
	{
		if(chat_isopen())
			pha_content.style.width = (g_win_width - 330) + 'px';
		else
			pha_content.style.width = (g_win_width - 1) + 'px';
	}
	
	var ct = $("chattext");
	
	ct.scrollTop = ct.scrollHeight;
}

//window.onresize = chat_resize;

function chat_init()
{
	$("chattextinput").onkeyup = function(e)
	{
		e = e || event;
		if (e.keyCode === 13 && !e.shiftKey) {
			chat_sendmsg();
		}
		return true;
	}
	
	chat_reload();
 
	if(getCookie("cards_chatbox") == "1")
	{
		$("chatbox").style.visibility = 'visible';
		$("chatntf").style.right = '310px';
		chat_resize();
		
		if(chat_croomid)
		{
			chatc_viewex(chat_croomid, chat_croomsign, 0);
		}
		
	}else{
		$("chatbox").style.visibility = 'hidden';
		$("chatntf").style.right = '10px';
	}
	
}


/* conversation management */

function chatc_clear()
{
	var o = $('chatntf');
	o.innerHTML = "";
	o.setAttribute('data-ccount', 0);
}

function chatc_create(users, userav, newcount, rid, csignature, usersloc)
{
	var o = $('chatntf');
	          /* offline   available    busy   away */
	var avm = ["555555", "99cc66", "ff6633", "ffcc00"];
	
	var nbv = "";
	var ulist = "";
	var maxut = o.getAttribute('data-maxt');
	var cct = o.getAttribute('data-ccount');
	var ppt = "";
	
	cct = parseInt(cct) + 1;
	
	if(users.length > maxut)
		ppt = "<div class='chatntf_plus'></div>";
	
	if(users.length < maxut)
		maxut = users.length;
	
	for(var i=0; i<maxut; i++)
	{
		//ulist += "<a href='#'><div class='chatntf_pic' onmouseover='vusr(this, \"" + users[i] + "\")' style=\"background: url('data/u" + usersloc[i] + "/dp/2.jpg')\"><div class=\"chatntf_availability\" style=\"background: #" + avm[userav[i]] + "\"></div></div></a>";
		if(usersloc[i] != 0) /* image available */
			ulist += "<a><div class='chatntf_pic' style=\"cursor: pointer; background: url('data/u" + usersloc[i] + "/dp/2.jpg')\"><div class=\"chatntf_availability\" style=\"background: #" + avm[userav[i]] + "\"></div></div></a>";
		else
			ulist += "<a><div class='chatntf_pic' style=\"cursor: pointer; background: url('images/failsafe/dp/2.jpg')\"><div class=\"chatntf_availability\" style=\"background: #" + avm[userav[i]] + "\"></div></div></a>";

		//ulist += "<a><div class='chatntf_pic' style=\"cursor: pointer;\"><img src='data/u" + usersloc[i] + "/dp/2.jpg' onerror='failsafe_img(this, 2);'/><div class=\"chatntf_availability\" style=\"background: #" + avm[userav[i]] + "\"></div></div></a>";

	}
	
	if(newcount) nbv = "<div class='chatntf_new' id='chatntfcidnew" + cct + "'>" + newcount + "</div>";
	else  nbv = "<div class='chatntf_new' id='chatntfcidnew" + cct + "' style='visibility: hidden;'>" + newcount + "</div>";
	
	var ct = "<div class=\"chatntf_box\" onclick='chatc_view(\"" + rid + "\", \"" + csignature + "\")' data-rid='" + rid + "' data-cs='" + csignature + "' id='chatntfcid" + cct + "'><div class=\"chatntf_pic_st\"></div>" + 
			ulist + nbv + "<div class='chatntf_x' onclick=\"javascript: chatc_close('" + cct + "');\"></div>" + ppt + "</div><div style='clear:both;'></div>";
	
	o.innerHTML += ct;
	
	o.setAttribute('data-ccount', cct);
	
}

function chatc_createtest(nc)
{
	var a = new Array('uqkhjYh', 'uvkhjYh', 'uqkhjYh', 'uvkhjYh');
	var av = new Array(2, 1, 3, 0);
	chatc_create(a, av, nc);
}

function chatc_close(cid)
{
	$('chatntfcid' + cid).style.display = "none";
}

function chatc_show(cid)
{

}

/* timer call for chat */

function chat_timercall()
{
	var cct = $("chatntf").getAttribute('data-ccount');
	
	if(cct == 0)
		chat_switchicon(1);
	else
		chat_switchicon(0);
}

/*
	1 - show
	2 - hide
*/

function chat_switchicon(mode)
{
	if(mode == 1)
	{
		$("sideicon_chat").style.display = "inline";
		$("chatntf").style.top = "34px";
	}else{
		$("sideicon_chat").style.display = "none";
		$("chatntf").style.top = "0px";
	}
}


function chatc_call(uid)
{
	ajax_post("php/tasks/chatcall.php?u=" + uid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				alert(xmlhttp.responseText);
			}
		}});
}

function chatc_view(rid, cs)
{
	return chatc_viewex(rid, cs, 1);
}

function chatc_viewex(rid, cs, cpanelset)
{

	if(cpanelset)
	{
		if(!chat_isopen())
		{
			chat_show();
		}else{
			if(rid == chat_croomid)
				chat_hide();
		}
	}
	
	chat_croomid = rid;
	chat_croomsign = cs;
		
	ajax_post("php/tasks/chatget.php?r=" + rid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var jm = {};
				jm = JSON.parse(xmlhttp.responseText);
				chatv_refresh(jm, 0);
			}
		}});
}



function chatv_refresh(cd, cadd)
{
	var uftext = "";
	var ustext = "";
	var i =0;

	var usercount = cd.users.length;
	
	for(i=0; i<usercount; i++)
	{
		if(i) {uftext += ", "; ustext += ", ";}
		
		uftext += cd.users[i].name;
		
		if(i < 2)
			ustext += "<a href='u" + cd.users[i].id + "' onmouseover='vusr(this, \"" + cd.users[i].id + "\")'>" + cd.users[i].name + "</a>";
	}
	
	if(usercount > 2)
	{
		ustext += " <span title='" + uftext + "'>(+" + (usercount - 2) + ")</span>";
	}
	
	$("chatbox_cusers").innerHTML = ustext;
	
	
	/* make the lines */
	
	var linecount = cd.lines.length;
	var ltext = "";
	var clines = "";
	var loe = "";
	
	cd.lines.sort(function(a,b) { return parseFloat(a.time) - parseFloat(b.time) } );
	
	i=0;
	
	if(cadd && chat_lastlineid == cd.lines[0].id) i = 1;
	
	for(; i<linecount; i++)
	{
		clines = "<p>" + cd.lines[i].line + "</p>"
	
		if(cd.lines[i].tid % 2)
			loe = "chatlineodd";
		else
			loe = "chatlineeven";
			
		ltext += "<div class='chatbox_ci " + loe + "'><div class='chatbox_pic' onmouseover='vusr(this, \"" + cd.lines[i].user + "\");' title='" + chatjson_findusername(cd.users, cd.lines[i].user) + "'><img src='data/u" + cd.lines[i].userloc + "/dp/3.jpg' onerror='failsafe_img(this, 3);'/></div><div class='chatbox_ct'><div id='chatbox_df" + cd.lines[i].tid + "'" + chat_format(clines) + "</div><abbr class='synctime' data-ts='" + cd.lines[i].time + "' data-mode='0'>ddddd</abbr></div></div>";
	}
	
	
	
	if(!cadd)
	{
		$("chattext").innerHTML = ltext;
	}else{
		if(chat_lastlineid == cd.lines[0].tid)
		{
			clines = "<p>" + cd.lines[0].line + "</p>"
			var o = $("chatbox_df" + chat_lastlineid);
			
			if(o) o.innerHTML = chat_format(clines);
			else $("chattext").innerHTML += ltext;
		}else{
		$("chattext").innerHTML += ltext;
		}
	}
	
	var ct = $("chattext");
	
	synctime_set(ct);
	//ct.scrollTop = ct.scrollHeight;
	scroll_banimate(ct, 1);
	
	chat_lastlineid = cd.lines[linecount-1].tid;
}

function chatjson_findusername(ju, id)
{
	var usercount = ju.length;
	
	for(i=0; i<usercount; i++)
	{
		if(ju[i].id == id) return ju[i].name;
	}
	
	return "You";
}

function chat_reload()
{

	var ods = $("divdataset1");
	
	chat_croomid      = ods.getAttribute('data-ecroomid');
	chat_croomsign    = ods.getAttribute('data-eroomsign');
    chat_availability = ods.getAttribute('data-eavailability');
    chat_lastmsgtime  = ods.getAttribute('data-elastmsgtime');
	
	
}

function chat_get_friendsgrid()
{
	ajax_post("php/tasks/friendsearch.php?av=1&lm=16", function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			if(xmlhttp.responseText != "")
			{
				var jm = {};
				jm = JSON.parse(xmlhttp.responseText);
				chat_refresh_friendsgrid(jm);
			}
		}});
		
		
}

function chat_refresh_friendsgrid(jd)
{
	if(!jd || !jd.users) return;
	
	var dtext = "<div class='chat_available_line'>";
	var j=0;
	
	var dctext = "";
	
	for(var i=0; i<jd.users.length; i++)
	{
		if(j >= 8)
		{
			dtext += "</div><div class='chat_available_line'>";
			j = 0;
		}
		
		dctext = "<div class='chat_available_pic' style='cursor: pointer;' onclick=\"chatc_call('" + jd.users[i].uid + "');\"><img src='data/u" + jd.users[i].lid + "/dp/2.jpg' onerror='failsafe_img(this, 3);'width='33px' onmouseover=\"vusr(this, '" + jd.users[i].uid + "');\"/></div>";
		
		dtext += dctext;
		
		j++;
	}
	
	dtext += "</div>";
	
	$("chat_friendgrid").innerHTML = dtext;
	
	chat_resize();
}