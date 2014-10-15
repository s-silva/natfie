var chat_oddeven = 0; /* 0 - odd, 1 even */
var chat_userid = 0;
var oldbox = "";
var chat_currentbox = 0;
var message_lastmsgtime = 0;

function chatlocal_createmsg(msg, cdid)
{
	var vs;
	
	if(!chat_userid) chat_userid = $("divdataset2").getAttribute('data-ulid');
	
	if(chat_oddeven)
		vs = "<div class='chatbox_ci chatlineeven'>";
	else
		vs = "<div class='chatbox_ci chatlineodd'>";

	vs = vs + "<div class='chatbox_pic' style=\"background: url('data/u" + chat_userid + "/dp/3.jpg')\"></div><div class='chatbox_ct' id='" + cdid + "'><p>" + msg + "</p></div></div>";
	
	return vs;
}

function chat_format(msg)
{
	var civ = chatemot_itranslate(msg);
	civ = civ.replace(/\[\-n\-l\-\]/gi,'</p><p>')
	return civ;
}

function chat_append(text)
{
	var ci = $("chattextinput");
	ci.value = ci.value + text;
}

function chat_sendmsg()
{
	var ci = $("chattextinput");
	var ct = $("chattext");
	var msg = "hoo";
	var cdid = "cbtintu";
	
	var cmg = ci.value.slice(0, -1);
	var civ = chatemot_itranslate(cmg);
	
	var d = new Date();
	
	cdid += d.getTime();
	
	if(d.getTime() - oldbox.substr(7) > 10 * 1000) {oldbox = ""; chat_oddeven ^= 1;};

	
	civ = civ.replace(/\n/g,'</p><p>')
	
	
	
	if(!oldbox)
	{
		var nbox = document.createElement("div");
	
		nbox.innerHTML = chatlocal_createmsg(civ, cdid);
		ct.appendChild(nbox);
		
		chat_currentbox = $(cdid);
		
		oldbox = cdid;
		chat_sendtoserver(cmg, 0);
	}else{
		
		var nbox = document.createElement("p");
	
		nbox.innerHTML = civ;
		$(oldbox).appendChild(nbox);
		
		chat_currentbox = $(oldbox);
		
		//$(oldbox).innerHTML = $(oldbox).innerHTML + "<br/>" +  civ;
		chat_sendtoserver(cmg, 1);
		
	}
	
	
	ci.value = "";
	scroll_banimate(ct, 1);
}


function message_send_writer(croomid, croomsign)
{
	var inputbox = $("msgexp_tbox_in");
	var outbox = $("msgexp_in");
	var tmsg = "";
	var msg = "";
	var d = new Date();
	
	if(!inputbox) return 0;
	if(!outbox) return 0;
	
	if(!inputbox.getAttribute("data-focus")) return 0;
	
	tmsg = inputbox.innerText;
	msg = chatemot_itranslate(inputbox.innerText);
	
	if(msg == "") return 0;
	
	var ulid = $("divdataset2").getAttribute('data-ulid');
	var uid = $("divdataset2").getAttribute('data-uid');
	var uname = $("divdataset2").getAttribute('data-uname');
	
	var nbox = document.createElement("div");
	nbox.className = "msgexp_line me";
	nbox.id = "msgwriteline_" + d.getTime();
	nbox.innerHTML = "<img class='msgexp_dp' onmouseover=\"vusr(this, '" + uid + "');\" src='data/u" + ulid + "/dp/2.jpg' onerror='failsafe_img(this, 2);'><h1>" + uname + "</h1><p>" + msg + "</p>";

	message_send(croomid, croomsign, tmsg, nbox.id, 0, function(id){if($(id)){$(id).style.backgroundColor = "#ffe82f";}});
	
	inputbox.innerHTML = "";
	
	outbox.insertBefore(nbox, outbox.firstChild);
}


function message_send(croomid, croomsign, txt, id, fsuccess, ffail)
{
	ajax_post("php/tasks/cs.php?r=" + croomid + "&s=" + croomsign + "&m=" + encodeURIComponent(txt) + "&msg=1&a=0", function(){
	if (xmlhttp.readyState==4)
	{
		if(xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "" && xmlhttp.responseText != "0")
			{
				message_lastmsgtime = xmlhttp.responseText;
				if(fsuccess)fsuccess(id);
			}else{
				if(fsuccess)ffail(id);
			}
		}else{
			if(fsuccess)ffail(id);
		}
	}
	});
}


/* inline translation for emoticons */

function chatemot_make(x, y, tip)
{
	return "<img class='chatemot' src='images/blank.gif' style='background-position: " + ((x * -15) - 1)+ "px " + ((y * -15) - 77) + "px;' title='" + tip + "'/><span class='chatemott'>" + tip + "</span>";
}

function chatemot_itranslate(line)
{
	var nl = line;
	
	nl =  nl.replace(/\:\)|\:\-\)/gi,             chatemot_make(0, 0, ":)"));
	nl =  nl.replace(/\:D|\:\-D/gi,               chatemot_make(1, 0, ":D"));
	nl =  nl.replace(/\:p|\:\-p/gi,               chatemot_make(2, 0, ":P"));
	nl =  nl.replace(/\;\)|\;\-\)/gi,             chatemot_make(3, 0, ";)"));
	nl =  nl.replace(/\:o|\:\-O/gi,               chatemot_make(4, 0, ":o"));
	nl =  nl.replace(/xD|x\-D/gi,                 chatemot_make(5, 0, "xD"));
	nl =  nl.replace(/\=D/gi,                     chatemot_make(6, 0, "=D"));
	nl =  nl.replace(/\>\.\<|\>_\</gi,            chatemot_make(7, 0, ">.<"));
	nl =  nl.replace(/\=\.\=|\=_\=/gi,            chatemot_make(8, 0, "=.="));
	nl =  nl.replace(/\<\.\<|\<_\</gi,            chatemot_make(9, 0, "<.<"));
	nl =  nl.replace(/\>\.\>|\>_\>/gi,            chatemot_make(10, 0, ">.>"));
	nl =  nl.replace(/B\||B\-\|/g,                chatemot_make(11, 0, "B|"));
	nl =  nl.replace(/B\)|B\-\)/g,                chatemot_make(12, 0, ">.>"));
	nl =  nl.replace(/B\-D/g,                     chatemot_make(13, 0, ">.>"));
	nl =  nl.replace(/o\.O|o_O|O_o|O\.o/g,        chatemot_make(14, 0, "o.O"));
	nl =  nl.replace(/\:ninja\:/gi,               chatemot_make(15, 0, "ninja"));
	nl =  nl.replace(/\:\/|\:\-\/|\:\\|\:\-\\/gi, chatemot_make(16, 0, ":/"));
	nl =  nl.replace(/\:s|\:\-s/gi,               chatemot_make(17, 0, ":S"));
	nl =  nl.replace(/\:3|\:\-3/gi,               chatemot_make(18, 0, ":3"));

	
	nl =  nl.replace(/\:\(|\:\-\(/gi,    chatemot_make(0,  1, ":("));
	nl =  nl.replace(/\:\'\(/gi,         chatemot_make(1,  1, ":'("));
	nl =  nl.replace(/\:\@|\:\-\@/gi,    chatemot_make(2,  1, ":@"));
	nl =  nl.replace(/\:\$|\:\-\$/gi,    chatemot_make(3,  1, "blushed"));
	nl =  nl.replace(/\;_\;/gi,          chatemot_make(4,  1, ";_;"));
	nl =  nl.replace(/\^\^/gi,           chatemot_make(5,  1, "^^"));
	nl =  nl.replace(/\:x|\:\-x/gi,      chatemot_make(6,  1, ":x"));
	nl =  nl.replace(/\<3/gi,            chatemot_make(7,  1, "<3"));
	nl =  nl.replace(/\<\/3/gi,          chatemot_make(8,  1, "</3"));
	//nl =  nl.replace(/\:/gi,           chatemot_make(9,  1, "xD"));
	nl =  nl.replace(/\:grin\:/gi,       chatemot_make(10, 1, ":grin:"));
	nl =  nl.replace(/\(y\)/gi,          chatemot_make(11, 1, "(y)"));
	nl =  nl.replace(/\(n\)/gi,          chatemot_make(12, 1, "(n)"));
	nl =  nl.replace(/\:\>\<\:/gi,       chatemot_make(13, 1, ":><:"));
	nl =  nl.replace(/8\||8\-\|/gi,      chatemot_make(14, 1, "8|"));
	nl =  nl.replace(/8\)|8\-\)/gi,      chatemot_make(15, 1, "8)"));
	nl =  nl.replace(/\:\||\:\-\|/gi,    chatemot_make(16, 1, ":|"));
	nl =  nl.replace(/\:\*|\:\-\*/gi,    chatemot_make(17, 1, ":*"));
	//nl =  nl.replace(/\:/gi,           chatemot_make(18, 1, ":"));
	

	return nl;
}



function chat_sendtoserver(msg, tappend)
{

	ajax_post("php/tasks/cs.php?r=" + chat_croomid + "&s=" + chat_croomsign + "&m=" + encodeURIComponent(msg) + "&a=" + tappend, function(){
		if (xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "" && xmlhttp.responseText != "0")
				{
					chat_lastmsgtime = xmlhttp.responseText;
				}else{
					if(chat_currentbox)chat_currentbox.style.backgroundColor = "#ffe82f";
				}
			}else{
				if(chat_currentbox)chat_currentbox.style.backgroundColor = "#ffe82f";
			}
		}
	
	});

}