function message_expand(obj)
{
	var vub = $('popupcard_msg');
	
	vub.innerHTML = "<div class='msgexp_title' id='msgexp_title'></div><div id='msgexp_others' style='display: none;'></div><div class='msgexp_in' id='msgexp_in'></div>";
	
	$('popupcard_msg').style.visibility = 'visible';
	$('popupcard_msg').style.width = '635px';
	
	$('popupcard_msg_out').style.display = '';
	var tbox = $('popupcard_msg_tbox');
	
	tbox.style.display = '';
	
	tbox.innerHTML = "<div class='msgexp_tbox_in' id='msgexp_tbox_in' contenteditable='plaintext-only'>Write your message here...</div><button class='general_settingbuttonblue' style='float: right; padding: 0px 40px 0px 40px; margin-top: 10px;' onclick=\"message_send_writer('" + obj.getAttribute('data-rid') + "', '" + obj.getAttribute('data-cs') + "');\">Send</button>";
	var o = $('msgexp_tbox_in');
	
	if(o)
	{
		o.onfocus = function(e){
			if(!o.getAttribute("data-focus"))
			{
				o.innerHTML = "";
				o.setAttribute("data-focus", 1);
			}
			return true;
		}
	}
	
	object_center(vub, 0, 0);
	object_center(tbox, 1, 10);
	overlaydef_show(function(){message_expand_hide();});
	
	message_expand_load(obj.getAttribute('data-rid'), obj.getAttribute('data-cs'));

}

function message_expand_hide()
{
	$('popupcard_msg').style.visibility = 'hidden';
	$('popupcard_msg_out').style.display = 'none';
	$('popupcard_msg_tbox').style.display = 'none';
	
	overlaydef_close();
}



function message_expand_load(rid, cs)
{
	chat_croomid = rid;
	chat_croomsign = cs;
		
	ajax_post("php/tasks/chatget.php?r=" + rid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var jm = {};
				jm = JSON.parse(xmlhttp.responseText);
				message_expand_refresh(jm, 0);
			}
		}});
}




function message_expand_refresh(cd, cadd)
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

	cd.lines.sort(function(b,a) { return parseFloat(a.time) - parseFloat(b.time) } );
	
	i=0;
	
	//if(cadd && chat_lastlineid == cd.lines[0].id) i = 1;
	
	for(; i<linecount; i++)
	{
		clines = "<p>" + cd.lines[i].line + "</p>"

		var memode = "";
		
		var cline_uname = message_exp_findusername(cd.users, cd.lines[i].user);
		
		if(cline_uname == 0)
		{
			cline_uname = $('divdataset2').getAttribute('data-uname');
			memode = " me";
		}
		
		ltext += "<div class='msgexp_line" + memode + "'><img class='msgexp_dp' onmouseover='vusr(this, \"" + cd.lines[i].user + "\");' src='data/u" + cd.lines[i].userloc + "/dp/2.jpg' onerror='failsafe_img(this, 2);'/><h1>" + cline_uname + "</h1>" + chat_format(clines) + "</div>";
	}
	
	
	
	if(!cadd)
	{
		$("msgexp_in").innerHTML = ltext;
	}else{
		//if(chat_lastlineid == cd.lines[0].tid)
		//{
		//	clines = "<p>" + cd.lines[0].line + "</p>"
			//$("chatbox_df" + chat_lastlineid).innerHTML = chat_format(clines);
		//}else{
			$("msgexp_in").innerHTML += ltext;
		//}
	}
	
	var ct = $("msgexp_in");
	
	synctime_set(ct);
	ct.scrollTop = ct.scrollHeight;
	
	//chat_lastlineid = cd.lines[linecount-1].tid;
	
	var ctitle = $('msgexp_title');
	
	if(ctitle)
	{
		var ctitletxt = "Conversation with " + cd.users[0].name;
		
		if(cd.users.length > 1)
		{
			for(i=1; i<3; i++)
			{
				if(i >= cd.users.length) break;
				ctitletxt = ctitletxt + ", " + cd.users[i].name;
			}
		}
		
		var otherslist = "";
			
		for(i=0; i<cd.users.length; i++)
		{
			otherslist = otherslist + "," + cd.users[i].name;
		}
		
		$("msgexp_others").innerHTML = otherslist;
		
		ctitle.innerHTML = ctitletxt;
	}
}

function message_exp_findusername(ju, id)
{
	var usercount = ju.length;
	
	for(i=0; i<usercount; i++)
	{
		if(ju[i].id == id) return ju[i].name;
	}
	
	return 0;
}