function $(id)
{
    return document.getElementById(id);
}

function get_position(obj)
{
    var pos={'r':0,'l':0,'t':0,'b':0,'x':0,'y':0},
        tmp=obj;

    do {
        pos.l += tmp.offsetLeft;
        tmp = tmp.offsetParent;
    } while( tmp !== null );
    pos.r = pos.l + obj.offsetWidth;
    
    tmp=obj;
    do {
        pos.t += tmp.offsetTop;
        tmp = tmp.offsetParent;
    } while( tmp !== null );
    pos.b = pos.t + obj.offsetHeight;
	
	pos.x = pos.l;
	pos.y = pos.t;
    
    return pos;
}

function get_mouse_pos(e)
{
	var tempX = 0;
	var tempY = 0;
	var pos={'x':0,'y':0},
        tmp=obj;
	
	if (IE)
	{
		tempX = event.clientX + document.body.scrollLeft;
		tempY = event.clientY + document.body.scrollTop;
	}else {
		tempX = e.pageX;
		tempY = e.pageY;
	}  

	if (tempX < 0){tempX = 0;}
	if (tempY < 0){tempY = 0;}  

	pos.x = tempX;
	pos.y = tempY;
	return pos;
}

var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};


/* simple drag and drop implementation */

var drag_vobj = 0;
var drag_vobjx = 0;
var drag_vobjy = 0;

function drag_init(obj, xmin, xmax, ymin, ymax, fname)
{
	obj.setAttribute("data-dragxv", 0);
	obj.setAttribute("data-dragyv", 0);
	obj.setAttribute("data-drag", "a");
	obj.setAttribute("data-dragxmin", xmin);
	obj.setAttribute("data-dragxmax", xmax);
	obj.setAttribute("data-dragymin", ymin);
	obj.setAttribute("data-dragymax", ymax);
	obj.setAttribute("data-dragcall", fname);
}

function drag_get(obj)
{

}

function drag_md(e)
{
	var fobj       = nn6 ? e.target : event.srcElement;
	var topelement = nn6 ? "HTML" : "BODY";

	while (fobj.tagName != topelement && !fobj.getAttribute("data-drag"))
	{
		fobj = nn6 ? fobj.parentNode : fobj.parentElement;
	}

	if(fobj.getAttribute("data-drag"))
	{
		drag_vobj   = fobj;
		drag_vobjx  = parseInt(fobj.style.left +0);
		drag_vobjy  = parseInt(fobj.style.top + 0);
		drag_vobjdx = nn6 ? e.clientX : event.clientX;
		drag_vobjdy = nn6 ? e.clientY : event.clientY;
		
		document.body.focus();
		document.onselectstart = function () { return false; };
		fobj.ondragstart = function() { return false; };
		return false;
	}
}

function drag_mm(e)
{
	if(drag_vobj)
	{
		var xv = (nn6 ? e.clientX : event.clientX);
		var yv = (nn6 ? e.clientY : event.clientY);
		var obj = drag_vobj;
		
		var	xmin = (typeof obj.getAttribute("data-dragxmin") != 'undefined') ? obj.getAttribute("data-dragxmin") : 0; 
		var	xmax = (typeof obj.getAttribute("data-dragxmax") != 'undefined') ? obj.getAttribute("data-dragxmax") : 0;
		var	ymin = (typeof obj.getAttribute("data-dragymin") != 'undefined') ? obj.getAttribute("data-dragymin") : 0;
		var	ymax = (typeof obj.getAttribute("data-dragymax") != 'undefined') ? obj.getAttribute("data-dragymax") : 0;
		
		xv = (xv - drag_vobjdx + drag_vobjx);
		yv = (yv - drag_vobjdy + drag_vobjy);
		
		if(xv > xmax)xv = xmax;
		else if(xv < xmin)xv = xmin;
		
		if(yv > ymax)yv = ymax;
		else if(yv < ymin)yv = ymin;
		
		if(xmax != 0 && xmin != 0)
			drag_vobj.style.left = xv + 'px';
		
		if(ymax != 0 && ymin != 0)
			drag_vobj.style.top = yv + 'px';
	
		if(obj.getAttribute("data-dragcall"))
			window[obj.getAttribute("data-dragcall")](xv, yv, 0);
	}
}

function drag_mu(e)
{
	if(drag_vobj)
	{
		document.onselectstart = null;
		drag_vobj.ondragstart = null;
		
		if(drag_vobj.getAttribute("data-dragcall"))
			window[drag_vobj.getAttribute("data-dragcall")](0, 0, 1);
			
		drag_vobj = 0;
	}
}


/* <add event> */



// For discussion and comments, see: http://remysharp.com/2009/01/07/html5-enabling-script/
/*@cc_on'abbr article aside audio canvas details figcaption figure footer header hgroup mark menu meter nav output progress section summary time video'.replace(/\w+/g,function(n){document.createElement(n)})@*/

var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();




/* </add event> */


/* scroll bottom animation */

function scroll_banimate(o, v)
{
	if(!o) return 0;
	if(o.scrollTop + v >= (o.scrollHeight - o.offsetHeight))
	{
		o.scrollTop = o.scrollHeight;
		return 0;
	}
	
	o.scrollTop += v;
	setTimeout(function(){return scroll_banimate(o, v + 1);}, 40);
	return 1;
}





function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	alert(dumped_text);
}







/* <HTML WEB HISTORY> */

var h5wh_pagechanged = 0;
var cssloaded_feedc = 0;
var cssloaded_msgpage = 0;
var h5wh_firstpage = document.URL;

function reportEvent(event)
{
	if(h5wh_pagechanged)
	{
		if(event.state)
		{
			reportData(event.state.toString());
			
		}else{
			reportData(h5wh_firstpage);
		}
	}
}


function reportData(data)
{
	if(data.substr(0, 5) == "http:")
	{
		var dv = h5wh_getff(data);
		var dvf = 0;
		var dvdat = "";
		var dvf1 = dv.substr(0, 1);
		var dvf2 = dv.substr(0, 2);
		var rmode = 0;
		
		if(dv == "cards")
		{
			rmode = "pf";
			dvdat = "minimal.php";
			dvf = 1;
		}else if(dv == "messages"){
			rmode = "m";
			dvdat = "minimal.php?m=m";
			dvf = 1;
		}else if(dvf2 == "pu"){
			rmode = "pf";
			dvdat = "minimal.php?m=p&user=" + dv.substr(1);
			dvf = 1;
		}else if(dvf1 == "u"){
			rmode = "pf";
			dvdat = "minimal.php?user=" + dv.substr(1);
			dvf = 1;
		}else if(dvf1 == "b"){
			dvdat = "minimal.php?m=b&user=" + dv.substr(1);
			dvf = 1;
		}else if(dvf1 == "c"){
			dvdat = "minimal.php?m=c&id=" + dv.substr(1);
			dvf = 1;
		}
		
		if(rmode == "pf")
		{
			if(!cssloaded_feedc)
				dynamicload_css("css/main/feedclassic.css", 0);
			cssloaded_feedc = 1;
			
			if($('backup_divdatasetfeed'))
				$('divdatasetfeed').setAttribute('data-lfid', $('backup_divdatasetfeed').getAttribute('data-lfid'));
		
			
		}else if(rmode == "m"){
			if(!cssloaded_msgpage)
				dynamicload_css("css/main/messages.css", 0);
			cssloaded_msgpage = 1;
		}
		
		if(dvf)
		{
			/*document.getElementById('pagemaincontent').innerHTML = "";*/
			
			ajax_post(dvdat, function(){
				if(xmlhttp.readyState==4)
				{
					if(xmlhttp.status==200)
					{
						if(xmlhttp.responseText != "")
						{
							h5wh_pagechanged = 1;
							unbind_boxes();
							document.getElementById('pagemaincontent').innerHTML = xmlhttp.responseText;
							home_reinit(rmode);
						}else{
							window.location.reload();
						}
					}else{
						window.location.reload();
					}
				}
			
			});
			return 1;
		}else{
			window.location = data;
			return 0;
		}
	}
	
	return 0;
}

/*document.addEventListener("DOMContentLoaded", function (){if(h5wh_pagechanged){home_reinit(); h5wh_pagechanged = 0;}}, false )*/


addEvent(document, 'click', function (event)
{
	
	
	var t = event.target;
	var fd = 0;
	
	while(t)
	{
		if(t.nodeName == 'A'){fd = 1; break;};
		t = t.parentNode;
	}
	
	if(fd)
	{
		history.pushState(t.href, t.href, t.href);
		if(reportData(t.href))
			event.preventDefault();
	}
});


function h5wh_getff(href)
{
	if(href.lastIndexOf('/') === href.length - 1)
	{
		href = href.substring(0, href.length - 1);
	}
	
	var slashes = href.split('/');
	return slashes[slashes.length - 1];
}


function h5wh_switch(loc)
{

	var hv = window.location.toString().lastIndexOf('/');
	
	if(hv)
	{
		
		var ld = window.location.toString().substr(0, hv) + "/" + loc;
		history.pushState(ld, ld, ld);
		reportData(ld.toString());
		
	}else{
		window.location = loc;
	}
}

addEvent(window, 'popstate', function (event)
{
  var data = event.state;
  reportEvent(event);
  /*reportData(event.state || { url: "unknown", name: "undefined", location: "undefined" });*/
});

addEvent(window, 'hashchange', function (event){reportEvent(event);});
addEvent(window, 'pageshow', function (event) {reportEvent(event);});
addEvent(window, 'pagehide', function (event) {reportEvent(event);});


/* </HTML WEB HISTORY> */
var autotimesync_objs = [];
var autotimesync_init = 0;
var autotimesync_cct = 0;

function synctime_set(pitem)
{
	if(pitem != 0)
		var e = getElementsByClassName("synctime", "abbr");
	else
		var e = getElementsByClassName("synctime", "abbr", pitem);
		
	var i = 0;
	
	while(e[i])
	{
		var o = e[i];
		var m = o.getAttribute('data-mode');
		var v = new Date(o.getAttribute('data-ts') *1000);
		var ft = relativetime_full(v);
		o.title = ft;
			
		if(m == '0')
			o.innerHTML = relativetime(v) + " ago";
		else if(m == '1')
			o.innerHTML = relativetime2(v);
		else if(m == '3') /* Month, Year */
			o.innerHTML = relativetime3(v);
		else
			o.innerHTML = ft;
			
		
		i++;
	}
}

function synctime_setobj(o)
{
	var m = o.getAttribute('data-mode');
	var v = new Date(o.getAttribute('data-ts') *1000);
	var ft = relativetime_full(v);
	o.title = ft;
		
	if(m == '0')
		o.innerHTML = relativetime(v) + " ago";
	else if(m == '1')
		o.innerHTML = relativetime2(v);
	else
		o.innerHTML = ft;
	
}

function synctime_settimer(o)
{
	var obj = {id:o.id, ltus:1, iv:0};
	autotimesync_objs.push(obj);
	
	if(!autotimesync_init)
	{
		synctime_timer_thread();
		autotimesync_init = 1;
	}
}

function synctime_timer_thread()
{
	var o;
	var c = autotimesync_objs.length;
	var i = 0;
	
	for(i=0; i<c; i++)
	{
		o = autotimesync_objs[i];
		if(o)
		{
			if(autotimesync_cct % o.ltus == 0)
			{
				o.iv++;
				var iv = o.iv;
				
				if(iv > 6) o.ltus = 3;
				if(iv > 360) o.ltus = 150;
				synctime_setobj($(o.id));
			}
		}
	}

	autotimesync_cct++;
	setTimeout(function (){synctime_timer_thread();}, 10000); /* as you append one zero here, remove one zero from above numbers, and vice versa */
}

/*
 * returns only, ago times.
 * useful for comments and etc. not for
 * any serious data.
 */
function relativetime(otime)
{
	var ntime = new Date();
	var votime = new Date(otime.getTime());
	diff  = new Date();
	diff.setTime(Math.abs(ntime.getTime() - votime.getTime()));
	var timediff = diff.getTime();
	
	var years = Math.floor(timediff / (1000 * 60 * 60 * 24 * 365));
	var months = Math.floor(timediff / (1000 * 60 * 60 * 24 * 31));
	var weeks = Math.floor(timediff / (1000 * 60 * 60 * 24 * 7));
	var days = Math.floor(timediff / (1000 * 60 * 60 * 24)); 
	var hours = Math.floor(timediff / (1000 * 60 * 60)); 
	var mins = Math.floor(timediff / (1000 * 60)); 
	var c = Math.floor(timediff / 1000); 
	var ms = Math.floor(timediff);

	if(years > 1) return years + " years";
	if(years == 1) return "a year";
	if(months > 1) return months + " months";
	if(months == 1) return "a month"
	if(weeks > 1) return weeks + " weeks";
	if(weeks == 1) return "a week";
	if(days > 1) return days + " days";
	if(days == 1) return "a day";
	if(hours > 1) return hours + " hours";
	if(hours == 1) return "an hour";
	if(mins > 1) return mins + " minutes";
	if(mins == 1) return "a minute"
	if(c > 1) return c + " seconds";
	if(c == 1) return "a second";
	if(ms <= 1000) return "less than a second";

	/*if(c < 2) return "a second";
	if(c < 60) return c + " seconds";
	if(c < 120) return "a minute";
	if(c < (60 * 60)) return mins + " minutes";
	if(c < (60 * 60) * 2) return "an hour";
	if(c < (60 * 60) * 24) return hours + " hours";
	if(c < ((60 * 60) * 24) * 2) return "a day";
	if(c < ((60 * 60) * 24) * 7) return days + " days";
	if(c < (((60 * 60) * 24) * 8)) return "a week";
	if(c < (((60 * 60) * 24) * 7) * 4) return weeks + " weeks";
	if(c < (((60 * 60) * 24) * 31) * 2) return "a month";
	if(c < (((60 * 60) * 24) * 31) * 12) return months + " months";
	if(c < ((((60 * 60) * 24) * 31) * 12) * 2) return "a year";
	return years + " years"; /**/ 
}


/*
 * returns ago times combined with real times
 * flow: 
 *        less than a second, seconds, minutes, hours
 *        yesterday - <flow won't be there if yesterday was few hours or less away>
 *        week day name
 *        day, month
 *        full date
 * good for important messages and  data.
 */
function relativetime2(otime)
{
	var ntime = new Date();
	var votime = new Date(otime.getTime());
	diff  = new Date();
	diff.setTime(Math.abs(ntime.getTime() - votime.getTime()));
	var timediff = diff.getTime();
	var mmonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var mdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

	var hours = Math.floor(timediff / (1000 * 60 * 60)); 
	var mins = Math.floor(timediff / (1000 * 60)); 
	var c = Math.floor(timediff / 1000); 
	var ms = Math.floor(timediff);

	if(otime.getMonth() != ntime.getMonth()) return relativetime_ordi(otime.getDate()) + " " + mmonths[otime.getMonth()] + ", " + otime.getFullYear();
	if(otime.getDate() + 8 < ntime.getDate()) return relativetime_ordi(otime.getDate()) + " " + mmonths[otime.getMonth()];
	if(otime.getDate() + 7 < ntime.getDate()) return mdays[otime.getDay()];
	if(otime.getDate() + 1 < ntime.getDate()) return mdays[otime.getDay()];
	if(otime.getDate() < ntime.getDate()) return "yesterday";
	
	if(hours > 1) return hours + " hours ago";
	if(hours == 1) return "an hour ago";
	if(mins > 1) return mins + " minutes ago";
	if(mins == 1) return "a minute ago"
	if(c > 1) return c + " seconds ago";
	if(ms <= 1000) return "less than a second ago";
}

function relativetime3(otime)
{
	var ntime = new Date();
	var votime = new Date(otime.getTime());
	diff  = new Date();
	diff.setTime(Math.abs(ntime.getTime() - votime.getTime()));
	var timediff = diff.getTime();
	var mmonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return mmonths[otime.getMonth()] + ", " + otime.getFullYear() ;
}

function relativetime_ordi(n)
{
	var s='th';
	if(n===1 || n==21 || n==31) s='st';
	if(n===2 || n==22) s='nd';
	if(n===3 || n==23) s='rd';
	return n+s;
}

function relativetime_addzero(n)
{
	if(n <= 9) return "0" + n;
	else return n;
}

function relativetime_addzerohour(n, m)
{
	var vs = "AM";
	
	if(n >= 12) vs = "PM";
	else if(n == 0) n = 12;
	
	var v = n;
	
	if(v <= 9) v = "0" + v;
	
	if(m)
		return vs;
	else
		return v;
}


/*
 * converts time for special details
 * output format: 10th January, 2012 at 12.03AM
 */
function relativetime_full(otime)
{
	var mmonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var mdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	var ampm = relativetime_addzerohour(otime.getHours(), 1);
	return relativetime_ordi(otime.getDate()) + " " + mmonths[otime.getMonth()] + ", " + otime.getFullYear() + " at " + relativetime_addzerohour(otime.getHours(), 0) + ":" + relativetime_addzero(otime.getMinutes()) + "" + ampm;
}
/* 
 * Copyright (C) Natfie.com - All Rights Reserved
 *
 * Unauthorized copying, distribution of this file, via
 * any medium is strictly prohibited.
 *
 * Proprietary and confidential
 *
 * chase@natfie.com - 2012.
 */

var cuser_uid = "";
var cuser_ulid = "";
var cuser_name = "";

var last_notify_id = -1;
var stop_currentfading = 0;
var fadeitem_last = 0;
var last_usrlloc = "";

var timer_chatgridcount = 20;

var is_window_active = 1;
var window_old_title = 0;
var window_flash_title = 0;
var window_flash_value = 0;

var newnotifications_changed = 0;

var posts_available = 0;
var pmmd_available = 0;

var vusrdisplaying = 0;
var vusrlastlink = 0;
var vusrprecheck = 0;
var vusrprecheckci = 0;
var vusrlcid = 0;
var vusrluid = 0;
var vusrclose = 0;
var c = 0;

var g_win_width = 640;
var g_win_height = 360;
var g_scroll_x = 0;
var g_scroll_y = 0;
var g_win_ctop = 30; /* top bar height */

var mhideitem = 0;
var mhideitemh = 0;
var mhideitemcallback = 0;
var mhideitem_showitem = 0;
var editinplace_fitemo = 0;
var editinplace_fitem = 0;
var editinplace_bkp = "";

var showhidesets_last = [0, 0, 0, 0, 0];

var phototag_th = "<div class='ptg_content' onmousemove='javascript: ptg_move();'><div class='ptgpictc' id='ptgptc'><div class='ptgpictcb' onclick='javascript: ptg_splist();'>View Tagged People</div><div class='ptgpictcb'>Remove Tag</div><div class='ptgpictcb' id='ptgbtagstart' onclick='javascript: pmmd_switchtagmode(3);'>Start Tagging</div></div>"
var phototag_tf = "</div>";

var testdata_video = "<object width=\"640\" height=\"360\"><param name=\"movie\" value=\"http://www.youtube.com/v/tEPB7uzKuh4?version=3&amp;hl=en_US\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowscriptaccess\" value=\"always\"></param><param name=\"wmode\" value=\"opaque\" /><embed src=\"http://www.youtube.com/v/tEPB7uzKuh4?version=3&amp;hl=en_US\" type=\"application/x-shockwave-flash\" width=\"640\" height=\"360\" allowscriptaccess=\"always\" allowfullscreen=\"true\" wmode=\"opaque\"></embed></object>";
var testdata_photo = "<script type=\"text/javascript\" src=\"js/photostrip/pmm.js\"></script>"+ phototag_th + "<div class='pmmd_pdbox' id='pmmd_pdb'><div class='pmmd_photos' id='pmmd_ps'>" +
			"<div class='pmmd_photo'><img id='pmmdimg_1' src='data/ud1wk4x8/ps/1.jpg'/></div>" +
			"<div class='pmmd_photo'><img id='pmmdimg_2' src='data/ud1wk4x8/ps/2.jpg'/></div>" +
			"<div class='pmmd_photo'><img id='pmmdimg_3' src='data/ud1wk4x8/ps/3.jpg'/></div></div></div>" + phototag_tf;

var post_view_type_photo = 0;
var current_photo_postid = 0;

var newpost_cdt_url = 0;
var newpost_cdt_link_mode     = 0;
var newpost_cdt_link_site     = 0;
var newpost_cdt_link_title    = 0;
var newpost_cdt_link_dsc      = 0;
var newpost_cdt_link_duration = 0;
var newpost_cdt_link_turl     = 0; /* thumbnail image url */

var feedc_newpost_controls_display = 0;
var feedc_newpost_controls_display = 0;
var feed_search_current_text = 0;

var home_onscroll_timer  = 0;

var general_photoset = 0;
var general_photoset_inuse = 0;
var general_photoset_lastid = 0;
var general_photoview_pic = 0;

var sendmessage_userlist = [];

var auto_feed_loading_processing = 0;
var auto_feed_loading_count = 0;

/* caching */

var cached_friendlist = 0;


/* code */


function shset_show(item, setid)
{
	if(showhidesets_last[setid] != 0) $(showhidesets_last[setid]).style.visibility = 'hidden';
	
	showhidesets_last[setid] = item;
	$(item).style.visibility = 'visible';
}

function shset_hide(item, setid)
{
	showhidesets_last[setid] = 0;
	$(item).style.visibility = 'hidden';
}

function show_mitem(item)
{
	if(mhideitem)
	{
		$(mhideitem).style.visibility = 'hidden';
		if(mhideitem == item) {mhideitem = 0; return;}
		mhideitem = 0;
	}
	
	mhideitem = item;
	$(item).style.visibility = 'visible';
	mhideitemh = 0;
	mhideitemcallback = 0;
}

function hide_mitem(item)
{
	$(item).style.visibility = 'hidden';
	
	mhideitem = 0;
	mhideitemh = 0;
	
	if(mhideitem_showitem)
	{
		mhideitem_showitem.style.visibility = 'visible';
		mhideitem_showitem.style.display = '';
		mhideitem_showitem = 0;
		mhideitemcallback = 0;
	}
}

function show_mitemh(item)
{
	if(mhideitem)
	{
		$(mhideitem).style.display = 'none';
		$(mhideitem).style.visibility = 'hidden';
		if(mhideitem == item) {mhideitem = 0; return;}
		mhideitem = 0;
	}
	
	mhideitem = item;
	$(item).style.display = '';
	$(item).style.visibility = 'visible';
	mhideitemh = 1;
}


function show_mitemh_autosave(item, mhidecallback)
{
	if(mhideitem)
	{
		$(mhideitem).style.display = 'none';
		$(mhideitem).style.visibility = 'hidden';
		if(mhideitem == item) {mhideitem = 0; return;}

		mhideitem = 0;
	}
	
	mhideitemcallback = mhidecallback;
	mhideitem = item;
	$(item).style.display = '';
	$(item).style.visibility = 'visible';
	mhideitemh = 1;
}


function hide_mitemh(item)
{
	$(item).style.display = 'none';
	$(item).style.visibility = 'hidden';
	mhideitem = 0;
	mhideitemh = 0;
	mhideitemcallback = 0;
		
	if(mhideitem_showitem)
	{
		mhideitem_showitem.style.visibility = 'visible';
		mhideitem_showitem.style.display = '';
		mhideitem_showitem = 0;
	}
}

/*
 * dmode - data mode (0 - raw data, 1 - ajax url)
 * vmode - view mode (0 - default, 1 - left, 2 - right)
 */
function show_popupcard(vdata, pitem, dmode, vmode)
{
	var vub = $('popupcard_main');
	var xypos = getposabs(pitem);
	
	if(dmode == 0)
		vub.innerHTML = vdata;
	
	if(!xypos) return 0;
	
	if((xypos[0] + vub.offsetWidth) > g_win_width)
	{
		vmode = 1;
	}

	if(vmode == 1)
		vub.style.left = (xypos[0] - vub.offsetWidth + pitem.offsetWidth) + 'px';
	else
		vub.style.left = xypos[0] + 'px';


	vub.style.top = xypos[1] + pitem.offsetHeight + 'px';

	show_mitem('popupcard_main');
}

function show_mapcard(pitem, vmode, edata)
{
	var vub = $('popupcard_map');
	var xypos = getposabs(pitem);
	var vl, vt, vw, vh;
	
	//if(edata)
	{
		vub.innerHTML = "<img style='cursor: pointer;' src='http://maps.googleapis.com/maps/api/staticmap?center=" + edata + "&zoom=11&size=335x200&sensor=false&amp;markers=" + edata + "'>";
		vub.setAttribute('data-maploc', edata);
	}
	
	if(!xypos) return 0;
	
	vw = vub.offsetWidth;
	vh = vub.offsetHeight;

	if(vmode == 1)
		vl = (xypos[0] - vw + pitem.offsetWidth);
	else
		vl = xypos[0];

	vt = xypos[1] + pitem.offsetHeight;
	
	if(vl < 0) vl = vl + vw - pitem.offsetWidth;
	
	
	vub.style.left = vl + 'px';
	vub.style.top  = vt + 'px';
	vub.style.zIndex = 10000001;
	
	vub.onclick = function(){set_mapcardfull();};

	$('popupcard_map').style.visibility = 'visible';
	overlaydef_show(function(){hide_mapcard();});
}

function set_mapcardfull()
{
	var vub = $('popupcard_map');
	var x, y;
	
	x = parseInt(vub.style.left);
	y = parseInt(vub.style.top);

	if(y + 370 > g_win_height) y = g_win_height - 370;
	if(x + 650 > g_win_width) x = g_win_width - 650;
	
	if(y < 40) y = 40;
	if(x < 4) x = 4;
	
	vub.style.left = x + 'px';
	vub.style.top = y + 'px';
	
	var loc = vub.getAttribute('data-maploc');
	
	vub.innerHTML = "<iframe width='640' height='360' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='http://maps.google.com/maps?f=d&amp;source=s_d&amp;saddr=&amp;daddr=" + loc + "&amp;hl=en&amp;geocode=&amp;sll=" + loc + "&amp;sspn=0.167376,0.220757&amp;mra=mift&amp;mrsp=1&amp;sz=12&amp;ie=UTF8&amp;t=m&amp;ll=" + loc + "&amp;spn=0.197532,0.438766&amp;z=11&amp;output=embed'></iframe>";
}

function hide_mapcard()
{
	$('popupcard_map').style.visibility = 'hidden';
	overlaydef_close();
}


function show_feedpopup(fmenuid, pitem, vmode, edata)
{
	var v = "";
	
	if(pitem == show_feedpopup.cid)
	{
		show_feedpopup.cid = -1;
		return 0;
	}
	
	switch(fmenuid)
	{
	case 1: /* own item details menu */
		v = "<ul><li>View Full Post</li>" + 
			"<li>Edit Privacy Settings</li>" + 
			"<li onclick='feed_post_delete(\"" + edata + "\"); hide_mitem(\"popupcard_main\");'>Delete Post</li></ul>";
			
		show_popupcard(v, pitem, 0, vmode);
		break;
		
	case 2: /* somebody else's item on your feed - details menu */
		v = "<ul><li>View Full Post</li>" + 
			"<li>Report</li>" + 
			"<li onclick='pblock();'>Hide Post</li>";
			
		show_popupcard(v, pitem, 0, vmode);
		break;
		
	case 3: /* something random */
		v = "<ul><li>View Full Post</li>" + 
			"<li>Report</li>";
			
		show_popupcard(v, pitem, 0, vmode);
		break;
	}
	
	show_feedpopup.cid = pitem;
}



function show_bkphotomenu(fmenuid, pitem, vmode, edata)
{
	var v = "";
	
	//if(pitem == show_bkphotomenu.cid)
	//{
	//	show_bkphotomenu.cid = -1;
	//	return 0;
	//}
	
	switch(fmenuid)
	{
	case 1:
		v = "<ul><a href='albums.profile'><li>Manage the album</li></a>" + 
			"<li onclick=\"setting_toggle(1, 'long_background', 1)\">Switch mode</li>" + 
			"<li><div style='display: block; height: 21px; overflow: hidden;  cursor: pointer; '><div style=\"width: 140px; height: 21px; position: relative; top: 0px; left: 0px;\">Select long background</div><input type='file' title='Select Photos to upload' id='bkphotomenu_sellongback' name='files[]' multiple='' style='font-size: 50px; cursor: pointer; width: 120px; opacity: 0; filter:alpha(opacity: 0); position: relative; top: -40px;; left: -20px'></div></li>" + 
			"</ul>";
			
		show_popupcard(v, pitem, 0, vmode);
		
		var btno = $('bkphotomenu_sellongback');
		if(!btno) return 0;
		
		btno.addEventListener('change', backphoto_uploadhandle, false);

		break;
	}
	
	//show_bkphotomenu.cid = pitem;
}

function backphoto_uploadhandle(evt)
{
	var files = evt.target.files;
	var fc = 0;

	if(!files[0]) return 0;
	
	var swrap = $('slidewrapper');
	if(!swrap) return 0;
	
	swrap.innerHTML = "";
	
	var img = document.createElement("img");
	
	img.id = "slidewrapper_longbkimg";
	img.style.position = "relative";
	swrap.appendChild(img);
	
	drag_init(img, 0, 100, -1000, 0, 'backphoto_slide');

	var reader = new FileReader();
	
	reader.onloadend = function() {
			img.src = reader.result;
			img.style.width = '1200px';
			
			var o = $('profilelongpic_save');
			
			if(o)
			{
				o.onclick = backphoto_save;
				o.style.visibility = "visible";
			}
		}
		
	reader.readAsDataURL(files[0]);
	
	
}

function backphoto_save(e)
{
	var xhr = new XMLHttpRequest();
	var fd = new FormData();
	
	var img = $('slidewrapper_longbkimg');
	if(!img) return 0;

	fd.append("upload", img.src);
	xhr.open("POST", "php/tasks/setlongprofileback.php?top=" + (-parseInt(img.style.top)));

	/*
	xhr.upload.addEventListener("progress", function(e) {
		if (e.lengthComputable) {
			var percentage = Math.round((e.loaded * 100) / e.total);
		}}, false);
	*/
		
	xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.setRequestHeader('UP-FILENAME', "photo.jpg");
	xhr.setRequestHeader('UP-SIZE', 100);
	xhr.setRequestHeader('UP-TYPE', "image/jpg");
	
	xhr.send(img.src);
	
	xhr.onreadystatechange = function(){if(xhr.readyState==4){$('profilelongpic_save').style.visibility = "hidden";};};
}

function backphoto_slide(xv, yv, mode)
{
	if(!mode)
	{
		var img = $('slidewrapper_longbkimg');
		if(!img) return 0;
		
		img.style.top = yv + 'px';
	}
}

function setting_toggle(sgroup, skey, vrefresh)
{

	if(sgroup == 1)
	{
		ajax_post("php/tasks/editsetting.php?g=" + sgroup + "&v=" + skey, function(){
		if(xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText == "1")
			{
				if(vrefresh)
					window.location.reload();
			}
		}
	
		});
		return 1;
	}
	
	return 0;
}


function show_timepopup(pitem, vmode, edata)
{
	if(pitem == show_timepopup.cid)
	{
		show_timepopup.cid = -1;
		return 0;
	}
	
	var v = "<div class='popup_cal_ct'><h1>19</h1><h2>April</h2><h3>2012</h3></div><div class='popup_cal_txt'><b>Coachella Festival</b><br/>April 21st - 23rd, 8.00am - 7.00pm<br/>Indio, CA, USA <span class='popup_cal_cturl' onclick='javascript: show_mapcard(this, 1, \"48.825183,2.1985795\");')>(Map)</span></div>";
	show_popupcard(v, pitem, 0, vmode);
	
	show_timepopup.cid = pitem;
}

function show_item(item)
{
	$(item).style.visibility = 'visible';
}

function hide_item(item)
{
	$(item).style.visibility = 'hidden';
}

function hide_obj(item)
{
	item.style.visibility = 'hidden';
}

function show_obj(item)
{
	item.style.visibility = 'visible';
}

function showhide_item(item)
{
	if($(item).style.visibility != 'visible')
		$(item).style.visibility = 'visible';
	else
		$(item).style.visibility = 'hidden';
}

/* -1 to refresh */

function notifications_menu(id)
{
	var nmenu;
	
	if(id != -1)
	{
		if(last_notify_id == id) {hide_item("notify"); last_notify_id = -1; return;}
		
		//if(last_notify_id == -1) 
		
	}else{
		id = last_notify_id;
		hide_mitem("notify");
	}
	
	nmenu = $("notify");
	
	get_notifications_list(id, $("notifyd"));
	
	nmenu.style.left = 286 + (id * 28) + 'px';
	
	last_notify_id = id;
	
	show_mitem("notify");
}

function notifications_mhide()
{
	last_notify_id = -1;
	hide_mitem("notify");
}


function home_init()
{
	var ds2 = $("divdataset2");
	
	cuser_uid  = ds2.getAttribute("data-uid");
	cuser_ulid = ds2.getAttribute("data-ulid");
	cuser_name = ds2.getAttribute("data-uname");

	home_onresize(0);

	add_lazyloading(document);
	
	init_ajaxmain();
	chat_init();
	feed_init();
	imain_init();
	if(typeof (window.posts_init) == 'function')posts_init();
	if(typeof (window.posts_fc_init) == 'function')posts_fc_init();
	if(typeof (window.general_init) == 'function')general_init();
	if(typeof (window.messages_init) == 'function')messages_init();
	
	show_new_notifications();
	
	set_elastic_text();
	synctime_set(0);
	
	home_init_textinput();
	
	document.onkeydown = home_onkeydown;
	
	var scrollct = $("scrollbox");
	
	if(scrollct)
	{
		home_onscroll(scrollct);
	}
		
	globaltimer();
	
	auto_feed_loading_count = 0;
}

function home_reinit(rmode)
{
	/*home_onresize(0);
	
	posts_fc_init();
	messages_init();

	
	
	
	*/
	
	auto_feed_loading_count = 0;
	
	home_onresize(0);
	
	
	if(rmode == "m")
	{
		if(typeof (window.messages_init) == 'function')messages_init();
		else {
			dynamicload_script("js/main/msgs.js", function(){if(typeof (window.messages_init) == 'function')messages_init();});
		}
	}else if(rmode == "pf"){
		
		imain_init();

		if(typeof (window.general_init) != 'function')
		{
			dynamicload_script("js/main/profile.js", 0);
			dynamicload_script("js/main/profile_edit.js", 0);
			dynamicload_script("js/main/dragdealer.js", function(){if(typeof (window.general_init) == 'function')general_init();});
		}else{
			if(typeof (window.general_init) == 'function')general_init();
		}
			
	}
	
	if(typeof (window.posts_fc_init) == 'function')posts_fc_init();
	
	if(home_onscroll_timer)
	{
		clearTimeout(home_onscroll_timer);
		home_onscroll_timer = 0;
	}
	
	set_elastic_text();
	synctime_set(0);
	
	lazyloadimg_clear();
	
	add_lazyloading(document);

	var scrollct = $("scrollbox");
	
	if(scrollct)
		home_onscroll(scrollct);
		
	home_onresize(0);
}

function dynamicload_script(url, callback)
{
    var script = document.createElement("script")
    script.type = "text/javascript";
	
	if(callback)
	{
		if (script.readyState){  //IE
			script.onreadystatechange = function(){
				if (script.readyState == "loaded" ||
						script.readyState == "complete"){
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {  //Others
			script.onload = function(){
				callback();
			};
		}
	}

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function dynamicload_css(url, callback)
{
    var script = document.createElement("link")
    script.type = "text/css";
	script.rel = "stylesheet";

	if(callback)
	{
		if (script.readyState){  //IE
			script.onreadystatechange = function(){
				if (script.readyState == "loaded" ||
						script.readyState == "complete"){
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {  //Others
			script.onload = function(){
				callback();
			};
		}
	}

    script.href = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function home_onkeydown(e)
{
	if (!e && window.event) e = window.event;
	if (e) key = e.keyCode;
	else key = e.which;
	
	if(document.activeElement)
	{
		var vt = document.activeElement.tagName.toLowerCase();
		if(vt == "textarea" || vt == "input") return 0;
		if(vt == "div" && document.activeElement.contentEditable)
		{
			if(document.activeElement.contentEditable != "false") return 0;
		}
	}
	
	switch(key)
	{
	case 83: /* s */
		shset_show('friendsearchfull', 1);
		peoplesearchbox_init();
		e.preventDefault();
		break;
		
	case 65: /* a */
		shset_show('newpostfull', 1);
		$("newpostptdata").focus();
		e.preventDefault();
		break;
	}
}

function home_onscroll(ct)
{
    var x = ct.scrollLeft,
		y = ct.scrollTop;

	if(g_scroll_x != x || g_scroll_y != y)
	{
		g_scroll_x = x;
		g_scroll_y = y;
		if(typeof (window.lazyloadimg_scroll) == 'function')lazyloadimg_scroll(x, y);
	}
	

	if(!auto_feed_loading_processing && auto_feed_loading_count < 3)
	{
		if($('postscontent'))
		{
			var ymax = $('postscontent').offsetHeight - g_win_height;

			if(y / ymax > 0.7)
			{
				if($('postscontent').getAttribute('data-mode') == "2")
				{
					feedc_loadmoredual($('postscontent').getAttribute('data-uid'));
				}else{
					feedc_loadmore();
				}
				auto_feed_loading_processing = 1;
				auto_feed_loading_count++;
			}
		}
	}
	
	home_onscroll_timer = setTimeout(function(){home_onscroll(ct);}, 100);
}


function ExtractNumber(value)
{
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}

function set_opacity(obj, value)
{
	obj.style.opacity = value / 100;
	obj.style.filter = 'alpha(opacity=' + value + ')';
	
	/* just in case if opacity ain't working */
	
	if(value == 0)obj.style.visibility = "hidden";
	else obj.style.visibility = "visible";
}

function fadeinx(obj, opc)
{
	if (opc==undefined)
	{
		opc = 10;
		set_opacity(obj, opc);
	}
	
	opc += 10;
	set_opacity(obj, opc);
	
	if (opc<100)
	{
		obj.setAttribute('data-fadein', 1);
		setTimeout(function() {fadeinx(obj, opc);}, 30);
	}else{
		//set_opacity(obj, 100);
		obj.setAttribute('data-fadein', 0);
	}
}

function fadein(obj, opc)
{
	if (opc==undefined)
	{
		opc = 10;
		set_opacity(obj, opc);
	}
	
	if(obj.getAttribute('data-fadein') == 1) return 0;
	if(obj.getAttribute('data-fadeout') == 1) return 0;
	
	fadeinx(obj, opc);
}


function fadeoutx(obj, opc)
{
	if (opc==undefined)
	{
		opc = 90;
		set_opacity(obj, opc);
	}
	
	opc -= 10;
	set_opacity(obj, opc);
	
	if (opc>0)
	{
		obj.setAttribute('data-fadeout', 1);
		setTimeout(function() {fadeoutx(obj, opc);}, 30);
	}else{
		//set_opacity(obj, 100);
		obj.setAttribute('data-fadeout', 0);
	}
}

function fadeout(obj, opc)
{
	if (opc==undefined)
	{
		opc = 90;
		set_opacity(obj, opc);
	}
	
	if(obj.getAttribute('data-fadein') == 1) return 0;
	if(obj.getAttribute('data-fadeout') == 1) return 0;
	
	fadeoutx(obj, opc);
}



/*
function fadein(obj)
{
	stop_currentfading = 1;
	setTimeout(function (){stop_currentfading = 0; fadein_ex(obj, 0, 10);}, 100);
} */

function fadein_item(itemid, hidelastone)
{
	if(hidelastone)
	{
		if(fadeitem_last == itemid) return;
		
		if(fadeitem_last)
		{
			$(fadeitem_last).style.visibility = "hidden";
			fadeitem_last = 0;
		}
		
		fadeitem_last = itemid;
	}
	
	var id = $(itemid);
	fadein(id);
}

function fadeout_item(itemid)
{
	var id = $(itemid);
	fadeout(id);
}


function fadeoutl(obj)
{
	stop_currentfading = 1;
	setTimeout(function (){stop_currentfading = 0; fadeout_ex(obj, 100, -5);}, 100);
}

function fadein_ex(obj, v, c)
{
	if(v >= 100)
	{
		set_opacity(obj, 100);
		return;
	}
	
	if(stop_currentfading) return;
	
	set_opacity(obj, v);
	setTimeout(function (_this){fadein_ex(obj, v + c, c);}, 50);
}

function fadeout_ex(obj, v, c)
{
	if(v <= 0)
	{
		set_opacity(obj, 0);
		return;
	}
	
	if(stop_currentfading) return;
	
	set_opacity(obj, v);
	setTimeout(function (_this){fadeout_ex(obj, v + c, c);}, 50);
}

function nstatus_display(svar)
{
	var sn = $("statusnotification");
	
	sn.innerHTML = svar;
	fadein(sn);
	
	setTimeout(function (){if(sn.style.visibility == "visible")fadeout(sn);}, 5000);
}

function nstatus_hide()
{
	fadeout($("statusnotification"));
}

/* posts */


function post_expand_photoset(currentpid, photocount)
{
	$("spwout").style.display = '';
	$("spw").style.display = '';
	$('spwdbar').style.display = "none";
	
	g_photoviewer_w = g_win_width - 350;
	
	if(g_photoviewer_w > 1000) g_photoviewer_w = 1000;
	g_photoviewer_h = g_photoviewer_w;
	
	
	$('spwd').innerHTML = "<script type=\"text/javascript\" src=\"js/photostrip/pmm.js\"></script>"+ phototag_th + "<div class='pmmd_pdbox' id='pmmd_pdb'><div class='pmmd_photos' id='pmmd_ps'>" +
			+ pmmd_generate_photo(currentpid) + pmmd_generate_photo(currentpid + 1) + pmmd_generate_photo(currentpid + 2) + "</div></div>" + phototag_tf + "<center><div id='pmmd_photosett' style='display: none;'></div><div style='clear: both;'></div></center>";


	
	
	$('pmmd_pdb').style.width = g_photoviewer_w + 'px';

	pmmd_init();
	pmmd_available = 1;
	pmmd_oindex = currentpid + 1;
	pmmd_ps_count = photocount;
	post_view_type_photo = 1;

	$('spwdbar').style.display = "none";
	$("spw").style.display = '';
	
	//pmmd_slideauto(pmmd_dobj, pmmd_dx, pmmd_nx, 640);
	pmmd_photostop();
	
	
	
	overlay_show();
	post_center();
	
	$('pmmd_pdb').style.width = g_photoviewer_w + 'px';
}

function post_expand(x, y)
{

	$("spwout").style.display = '';
	$("spw").style.display = '';
	

	$('spwdbar').style.display = "none";
	
	
	
	
	//if(x == 1 && y == 3)
	//{
	//	$('spwd').innerHTML = testdata_video;
	//
	//}else if(x == 1 && y == 2){
	
		$('spwd').innerHTML = testdata_photo;
		
		pmmd_init();
		pmmd_available = 1;
		post_view_type_photo = 1;
		
	//}
	
	$('spwdbar').style.display = "none";
	$("spw").style.display = '';
	
	overlay_show();
	post_center();
}

function post_close()
{
	general_photoset_inuse = 0;
	general_photoset = 0;
	post_view_type_photo = 0;
	$('spw').style.display = 'none';
	$("spwout").style.display = 'none';
	$('spwd').innerHTML = "";
	pmmd_available = 0;
	overlay_close();
}

function post_hideshow()
{
	if($('spwd').innerHTML.length >= 1)
	{
		$('spwdbar').style.display = "";
		$('spwd').innerHTML = "";
		pmmd_available = 0;
		
	}else{
		$('spwd').innerHTML = testdata_video;
		$('spwdbar').style.display = "none";
	}
	post_center();
}

function post_center()
{
	var p = $('spw');
	var cbo = 0;
	var cbv = $('chatbox').style.visibility;
	
	if(cbv == 'visible') cbo = 240;
	
	if((g_win_width / 2) - (p.offsetWidth / 2) + cbo + p.offsetWidth < g_win_width) cbo = 0;
	
	p.style.marginLeft = -((p.offsetWidth / 2) + cbo) + 'px';

	if(-((p.offsetWidth / 2) + cbo) < -(g_win_width / 2))p.style.marginLeft = -(g_win_width / 2) + 20 + 'px';
	
	if(p.offsetHeight < g_win_height)
		post_vcenter();
	else
		p.style.top = "100px";
		
	pmmd_init();
}

function post_vcenter()
{
	var p = $('spw');
	var topv = ((home_getviewport().height / 2) - (p.offsetHeight / 2));
	
	if(topv < 10) topv = 10;
	
	p.style.top = topv + 'px';
	
	if(p.left < 0) p.style.marginLeft = -(p.offsetWidth / 2) + 'px';
	
	pmmd_init();
}


function object_center(obj, cmode, value1)
{
	var p = obj;
	var cbo = 0;
	var cbv = $('chatbox').style.visibility;
	
	if(cbv == 'visible') cbo = 240;
	
	if((g_win_width / 2) - (p.offsetWidth / 2) + cbo + p.offsetWidth < g_win_width) cbo = 0;
	
	p.style.left = (g_win_width / 2)-((p.offsetWidth / 2) + cbo) + 'px';

	if(-((p.offsetWidth / 2) + cbo) < -(g_win_width / 2))p.style.left = (g_win_width / 2)-(g_win_width / 2) + 20 + 'px';
	
	if(cmode == 0)
	{
		if(p.offsetHeight < g_win_height)
		{
			var topv = ((home_getviewport().height / 2) - (p.offsetHeight / 2));
			
			if(topv < 10) topv = 10;
			
			p.style.top = topv + 'px';
			
			//if(p.left < 0) p.style.marginLeft = -(p.offsetWidth / 2) + 'px';
		}else{
			p.style.top = "100px";
		}
	}else if(cmode == 1){ /* vertical bottom */
		
		var topv = home_getviewport().height - p.offsetHeight - value1;

		p.style.top = topv + 'px';
	}
}

/* notifications */

function ntfitem_check(obj, ntype)
{
	if(obj.getAttribute("data-nchecked") == '0')
	{
		var o = 0;
		switch(ntype)
		{
		case 0: /* friendships */
			var o = $("icon_new_friends");
			break;
			
		case 1: /* messages */
			var o = $("icon_new_messages");
			break;
			
		case 2: /* tags */
			var o = $("icon_new_tags");
			break;
			
		case 3: /* events */
			var o = $("icon_new_events");
			break;
			
		case 4: /* general */
			var o = $("icon_new_notifications");
			break;
		}
		
		if(o)
		{
			var cv = o.getAttribute("data-nvalue");
			if(cv > 0)
			{
				cv--;
				newnotifications_changed = 1;
				o.setAttribute("data-nvalue", cv);
				o.innerHTML = "<p>" + cv + "</p>";
				if(cv <= 0)
					o.style.visibility = "hidden";
			}
		}
		
		obj.getAttribute("data-nchecked") == '1'
	}
}

function show_new_notifications()
{

	/*
	ajax_post("php/notifications/getnew.php", function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var ary = xmlhttp.responseText.split(",");

				var objs = new Array();
				
				objs[0] = $("icon_new_friends");
				objs[1] = $("icon_new_messages");
				objs[2] = $("icon_new_tags");
				objs[3] = $("icon_new_events");
				objs[4] = $("icon_new_notifications");
				
				var i;
				
				for(i=0; i<5; i++)
				{
					
					if(ary[i] > 0)
					{
						objs[i].innerHTML = "<p>" + ary[i] + "</p>"
						objs[i].style.visibility = "visible";
					}else{
						objs[i].innerHTML = "<p>" + ary[i] + "</p>"
						objs[i].style.visibility = "hidden";
					}
				}
			}
		}
	
	}); */
	
	feed_update();

	setTimeout(show_new_notifications, 2000);

}

function get_notifications_list(id, robj)
{
	robj.innerHTML = get_preloader(32, 50);
	
	ajax_post("php/notifications/get.php?id=" + id, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				robj.innerHTML = xmlhttp.responseText;
				synctime_set(robj);
			}else{
				robj.innerHTML = "<div style='margin: 10px; text-align: center;'>You don't have any notifications.</div>";
			}
		}
	
	});
}






/* other stuff */

document.onmousedown = home_onmousedown;
document.onmouseup = home_onmouseup;
document.onmousemove = home_onmousemove;


var is_IE = document.all?true:false;
if (!is_IE) document.captureEvents(Event.MOUSEMOVE);
	
function home_onmousedown(e)
{
	if(posts_available) posts_OnMouseDown(e);
	if(pmmd_available && post_view_type_photo) pmmd_mousedown(e);
	if(drag_md) drag_md(e);
	if(typeof (window.cropselectmouse) == 'function')
	{
		if(!cropselectmouse(e)) return false;
	}
	
	if(mhideitem)
	{
		var t = e.target != null ? e.target : e.srcElement;
		var fd = 0;
		
		while(t)
		{
			if(t.id == mhideitem){fd = 1; break;};
			t = t.parentNode;
		}
		if(!fd)
		{
			if(mhideitemh)$(mhideitem).style.display = 'none';
			
			if(mhideitemcallback)
			{
				if(typeof (mhideitemcallback) == 'function')
				{
					mhideitemcallback();
				}
			}
			
			$(mhideitem).style.visibility = 'hidden';
			
			if(mhideitem_showitem)
			{
				mhideitem_showitem.style.visibility = 'visible';
				mhideitem_showitem.style.display = '';
				mhideitem_showitem = 0;
			}

			mhideitemh = 0;
			mhideitem = 0;
		}
	}
	
	if(editinplace_fitemo)
	{
		var t = e.target != null ? e.target : e.srcElement;
		var fdn = 0;
		while(t)
		{
			if(t == editinplace_fitemo || t == editinplace_fitem){fdn = 1; break;};
			t = t.parentNode;
		}
		
		if(!fdn)
		{
			editinplace_hide();
		}
	}
}

function home_onmousemove(e)
{
	if(posts_available) posts_OnMouseMove(e);
	if(pmmd_available && post_view_type_photo) pmmd_movemouse(e);
	if(drag_mm) drag_mm(e);
	
	if(vusrprecheck)
	{
		var vt = e.target != null ? e.target : e.srcElement;
		vusrprecheckci = vt;
	}
	
	
	if(vusrdisplaying)
	{
		var t = e.target != null ? e.target : e.srcElement;
		var fd = 0;
		while(t)
		{
			if(t == vusrlastlink || t.id == "vusrdbox"){vusrclose = 0; vusrdisplaying = 1; fd = 1; break;};
			t = t.parentNode;
		}
		
		if(!fd)
		{
			vusrclose = 1;

		}

	}
}

function home_onmouseup(e)
{
	if(posts_available) posts_OnMouseUp(e);
	if(pmmd_available && post_view_type_photo) pmmd_mouseup(e);
	if(drag_mu) drag_mu(e);
}

function home_onfocus(e)
{
	is_window_active = 1;
	home_window_settitle(0, 0);
}

function home_onblur(e)
{
	is_window_active = 0;
}


function home_onresize(e)
{
	/* calculate window size */
	
	var winW = 630, winH = 460;
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
		 winW = document.documentElement.offsetWidth;
		 winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
	
	g_win_width = winW;
	g_win_height = winH;
	
	if(typeof (window.gardenui_init) == 'function')gardenui_init();
	
	var ofooter = $('main_footer');
	
	if(ofooter)
	{
		var ofooterpos = getposabs(ofooter);
		
		if(ofooterpos)
		{
			if(ofooterpos[1] < g_win_height - ofooter.offsetHeight)
			{
				if(ofooter.parentNode.id == "main_footer_ct")
				{
					ofooter = ofooter.parentNode;
				}

				//ofooter.style.position = "absolute";
				//ofooter.style.bottom = "0px";
				
				ofooter.style.marginTop = (g_win_height - ofooter.offsetHeight + 70 - ofooterpos[1]) + "px";
			}
		}
	}
	
	var photomm_ci = $('photomm_ci');
	
	if(photomm_ci)
	{
		var cgpcipos = getposabs(photomm_ci);
		if(cgpcipos) photomm_ci.style.height = (winH - cgpcipos[1]) + 'px';
	}
	
	if($('pbf_ns'))
		$('pbf_ns').style.height = (g_win_height - 30) + "px";

	
	chat_resize();
	post_center();
	if(typeof (window.messages_resize) == 'function')messages_resize();
	if(typeof (window.photomanager_resize) == 'function')photomanager_resize();
}

function addevent(elem, type, eventHandle) {
    if (elem == null || elem == undefined) return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};

function makeExpandingArea(container) {
 var area = container.querySelector('textarea');
 var span = container.querySelector('span');
 if (area.addEventListener) {
   area.addEventListener('input', function() {
     span.textContent = area.value;
   }, false);
   span.textContent = area.value;
 } else if (area.attachEvent) {
   // IE8 compatibility
   area.attachEvent('onpropertychange', function() {
     span.innerText = area.value;
   });
   span.innerText = area.value;
 }
 // Enable extra CSS
 container.className += ' active';
}

function set_elastic_text()
{
	var areas = document.querySelectorAll('.expandingArea');
	var l = areas.length;

	while (l--)
	{
		makeExpandingArea(areas[l]);
	}
}

function home_getviewport()
{
	var e = window, a = 'inner';
	if ( !( 'innerWidth' in window ) )
	{
		a = 'client';
		e = document.documentElement || document.body;
	}
	return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

function home_window_settitle(ttext, tflash)
{
	if(!window_old_title) window_old_title = document.title;
	
	if(tflash)
		window_flash_title = ttext;
	
	if(!ttext) document.title = window_old_title;
	else document.title = ttext;
}

function fsendrequest(touser)
{

	ajax_post("php/tasks/request.php?u=" + touser, 1);
}

function friendreq_accept(fid)
{
	ajax_post("php/tasks/accept.php?u=" + fid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				nstatus_display(xmlhttp.responseText);
			}
			notifications_menu(-1);
		}
	
	});
}

function friendreq_reject(fid)
{
	ajax_post("php/tasks/reject.php?u=" + fid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				nstatus_display(xmlhttp.responseText);
			}
			
			notifications_menu(-1);
		}
	
	});
}

function relationshipreq_accept(fid, rmode)
{
	ajax_post("php/tasks/relationshipaccept.php?u=" + fid + "&rm=" + rmode, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				nstatus_display(xmlhttp.responseText);
			}
			notifications_menu(-1);
		}
	
	});
}

function relationshipreq_reject(fid)
{
	ajax_post("php/tasks/relationshipreject.php?u=" + fid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			notifications_menu(-1);
		}
	
	});
}

function get_preloader(size, h)
{
	var st = "<div style='text-align: center; padding: " + h + "px 0 " + h + "px 0;'>"
	if(size == 32)
		st += "<img src='images/preloaders/32.gif'/></div>";
	else
		st += "<img src='images/preloaders/16.gif'/></div>";
		
	return st;
}

/*

function getposabs(item)
{
	var x = y = 0;
	if (item.offsetParent)
	{
		do {
			if(item.offsetLeft || item.scrollTop)
			{
			x += item.offsetLeft
			y -= item.scrollLeft;
			y += item.offsetTop
			y -= item.scrollTop;
			}
		} while (item = item.parentNode);
		
		return [x, y];
	}
} */

function getposabs( oElement ) {
  function getNextAncestor( oElement ) {
    var actualStyle;
    if( window.getComputedStyle ) {
      actualStyle = getComputedStyle(oElement,null).position;
    } else if( oElement.currentStyle ) {
      actualStyle = oElement.currentStyle.position;
    } else {
      //fallback for browsers with low support - only reliable for inline styles
      actualStyle = oElement.style.position;
    }
    if( actualStyle == 'absolute' || actualStyle == 'fixed' ) {
      //the offsetParent of a fixed position element is null so it will stop
      return oElement.offsetParent;
    }
    return oElement.parentNode;
  }
  if( typeof( oElement.offsetParent ) != 'undefined' ) {
    var originalElement = oElement;
    for( var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent ) {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
    if( !originalElement.parentNode || !originalElement.style || typeof( originalElement.scrollTop ) == 'undefined' ) {
      //older browsers cannot check element scrolling
      return [ posX, posY ];
    }
    oElement = getNextAncestor(originalElement);
    while( oElement && oElement != document.body && oElement != document.documentElement ) {
      posX -= oElement.scrollLeft;
      posY -= oElement.scrollTop;
      oElement = getNextAncestor(oElement);
    }
    return [ posX, posY ];
  } else {
    return [ oElement.x, oElement.y ];
  }
}

function vusr(cid, uid)
{
	vusrprecheck = cid;

	if(!vusrdisplaying)
	{
		setTimeout(function (_this){vusr_timed(cid, uid, 1);}, 500);
	}else{
		if(vusrlcid != cid)
			vusr_timed(cid, uid, 0);
	}
}

function vusr_timed(cid, uid, tnew)
{
	if(vusrlcid == cid) return 0;
	if(vusrluid == uid) 
	{
		if(vusrprecheckci == vusrprecheck)
			vusr_basic(cid, uid, tnew, last_usrlloc);
		return 1;
	}
	
	if(vusrprecheckci == vusrprecheck)
	{
		ajax_post("php/tasks/getuserpopupinfo.php?u=" + uid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var jm = {};
				jm = JSON.parse(xmlhttp.responseText);
				
				$("vusrboxname").innerHTML = "<a href='u" + uid + "'>" + jm.name + "</a>";
				$("vusrboxdsc").innerHTML = jm.description + "&nbsp;";
				
				if(jm.mutual > 1)
					$("vusrboxmutual").innerHTML = jm.mutual + " Mutual friends";
				else if(jm.mutual == 1)
					$("vusrboxmutual").innerHTML = jm.mutual + " Mutual friend";
				else
					$("vusrboxmutual").innerHTML = "&nbsp;";
				
				if(jm.friend == 1)
				{
					$("vusrsearchbox").innerHTML =
					
					"<div class='fsbx_btn' onclick='' title='Send a private message to " + jm.fname + "'><div class='fsbx_btnm2'></div></div>" + 
					"<div class='fsbx_btn' onclick='' title='Post on " + jm.fname + "&#39;s profile'><div class='fsbx_btnm3'></div></div>" + 
					"<div class='fsbx_btn' onclick='' title='Start chatting with " + jm.fname + "'><div class='fsbx_btnm4'></div></div>" + 
					"<a style='float: left;' href='pu" + uid + "'><div class='fsbx_btn' onclick='' title='View " + jm.fname + "&#39;s posts'><div class='fsbx_btnm5'></div></div></a>" + 
					"<a style='float: left;' href='bu" + uid + "'><div class='fsbx_btn' onclick='' title='Read " + jm.fname + "&#39;s blog'><div class='fsbx_btnm6'></div></div></a>" + 
					"<div style='clear:both;'></div>";
				}else{
				
					$("vusrsearchbox").innerHTML =
					
					"<div class='fsbx_btn' onclick='' title='Add " + jm.fname + " as a friend'><div class='fsbx_btnm1'></div></div>" + 
					"<div class='fsbx_btn' onclick='' title='Send a private message to " + jm.fname + "'><div class='fsbx_btnm2'></div></div>" + 
					"<div style='clear:both;'></div>";
				
				}
				
				last_usrlloc = jm.loc;
				vusr_basic(cid, uid, tnew, last_usrlloc);
			}
		}});
		
	}
}

function vusr_basic(cid, uid, tnew, loc)
{
	var vub = $('vusrdbox');
	var xypos = getposabs(cid);
	var tipmode = 0;
	if(!xypos) return 0;
	
	vusrclose = 0;
	
	if(tnew)
		set_opacity(vub, 0);
	
	$("vusrboximg").src = "data/u" + loc + "/dp/1.jpg";
	
	vub.style.left = xypos[0] + 'px';

	if((xypos[1] - 100)  < 0)
	{
		vub.style.top = (xypos[1] + cid.offsetHeight + 0) + 'px';
		tipmode = 1; /* top left */
		//$('vusrdboxplb').style.visibility = 'hidden';
		//$('vusrdboxplt').style.visibility = 'visible';
		
	}else{
		vub.style.top = (xypos[1] - 118) + 'px';
		tipmode = 2; /* bottom left */
		//$('vusrdboxplb').style.visibility = 'visible';
		//$('vusrdboxplt').style.visibility = 'hidden';
	}	

	if((xypos[0] + 240) > g_win_width)
	{
		vub.style.left = (xypos[0] - 220) + 'px';
		
		if(tipmode == 1) tipmode = 4;
		else tipmode = 3;
	}
	
	switch(tipmode)
	{
	case 1: /* top left */
		$('vusrdboxplb').style.visibility = 'hidden';
		$('vusrdboxplt').style.visibility = 'visible';
		$('vusrdboxprb').style.visibility = 'hidden';
		$('vusrdboxprt').style.visibility = 'hidden';
		break;
		
	case 2: /* bottom left */
		$('vusrdboxplb').style.visibility = 'visible';
		$('vusrdboxplt').style.visibility = 'hidden';
		$('vusrdboxprb').style.visibility = 'hidden';
		$('vusrdboxprt').style.visibility = 'hidden';
		break;
		
	case 3: /* top right */
		$('vusrdboxplb').style.visibility = 'hidden';
		$('vusrdboxplt').style.visibility = 'hidden';
		$('vusrdboxprb').style.visibility = 'visible';
		$('vusrdboxprt').style.visibility = 'hidden';
		break;
		
	default: /* bottm right */
		$('vusrdboxplb').style.visibility = 'hidden';
		$('vusrdboxplt').style.visibility = 'hidden';
		$('vusrdboxprb').style.visibility = 'hidden';
		$('vusrdboxprt').style.visibility = 'visible';
		break;
	}
	
	//vub.style.visibility = 'visible';
	if(tnew == 1)
		fadein(vub);
		
	vusrlcid = cid;
	vusrluid = uid;
	
	vusrdisplaying = 1;
	vusrlastlink = cid;
}

function overlaydialog_show(ct, mode, fdone)
{
	var o = $("overlaydialog");
	
	o.style.display = '';
	o.style.left = ((g_win_width / 2) - (o.offsetWidth / 2)) + 'px';
	o.style.top = ((g_win_height / 2) - (o.offsetHeight / 2)) + 'px';
	
	overlaydef_show(0);
}

function overlaydialog_center()
{
	var o = $("overlaydialog");
	
	o.style.left = ((g_win_width / 2) - (o.offsetWidth / 2)) + 'px';
	o.style.top = ((g_win_height / 2) - (o.offsetHeight / 2)) + 'px';
}

function overlaydialog_close()
{
	$("overlaydialog").style.display = 'none';
	overlaydef_close();
}

function overlay_show()
{
	$("windowoverlaymain").style.display = '';
	var postc = $('postscontent');
	if(postc) postc.className = "blurry";
}

function overlay_close()
{
	$("windowoverlaymain").style.display = 'none';
	var postc = $('postscontent');
	if(postc) postc.className = "focusbox";
}

function overlaydef_show(onclickf)
{
	$("windowoverlaymaind").style.display = '';
	$("windowoverlaymaind").onclick = onclickf;

	var postc = $('postscontent');
	if(postc) postc.className = "blurry";
}

function overlaydef_close()
{
	$("windowoverlaymaind").style.display = 'none';
	var postc = $('postscontent');
	if(postc) postc.className = "focusbox";
}

function overlay_switchlights()
{
	var o = $('windowoverlaymain');
	
	if(o.getAttribute('data-lights') == 1)
	{
		o.style.background = "#000000";
		o.setAttribute('data-lights', 0);
	}else{
		o.style.background = "#ffffff";
		o.setAttribute('data-lights', 1);
	}

}

function pblock()
{
	overlaydialog_show("", 0, 0);
}


function show_gendialog(urlc, locdata, btitle, okfnc)
{
	var umode = 0;
	
	if(locdata==undefined) umode = 1;
	if(!locdata) umode = 1;
	
	if(btitle != undefined && btitle) $('gendialogbox_titletext').innerHTML = btitle;
	else $('gendialogbox_titletext').innerHTML = "Enter Details";
	
	if(okfnc != undefined && okfnc)
	{
		$('gendialogbox_applybtn').onclick = okfnc;
	}
	
	if(umode)
	{
		$('generaldialog_data').innerHTML = get_preloader(32, 5);
		overlaydialog_show("", 0, 0);
		
		ajax_post(urlc, function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "")
				{
					$("generaldialog_data").innerHTML = xmlhttp.responseText;
					overlaydialog_center();
				}else{
					$("generaldialog_data").innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>Found no available friends for the name you've entered.</div>";
					overlaydialog_center();
				}
			}});	
	}else{
	
		$('generaldialog_data').innerHTML = locdata;
		overlaydialog_show("", 0, 0);
	}
}

function globaltimer()
{
	if(vusrclose)
	{
		var vub = $('vusrdbox');
		//vub.style.visibility = "hidden";
		//$('vusrdboxplb').style.visibility = 'hidden';
		//$('vusrdboxplt').style.visibility = 'hidden';
		//$('vusrdboxprb').style.visibility = 'hidden';
		//$('vusrdboxprt').style.visibility = 'hidden';
		fadeout(vub);
		
		vusrdisplaying = 0;
		vusrclose = 0;
		vusrlastlink = 0;
		vusrprecheck = 0;
		vusrprecheckci = 0;
		vusrlcid = 0;
	}
	
	
	if(window_flash_title)
	{
		if(window_flash_value)
			document.title = window_flash_title;
		else 
			document.title = window_old_title;
	}
	
	
	chat_timercall();
	
	if(timer_chatgridcount > 20)
	{
		chat_get_friendsgrid();
		timer_chatgridcount = 0;
	}
	
	timer_chatgridcount++;
	
	setTimeout(function (){globaltimer();}, 1000);
}



function emotboxset(val)
{
	chat_append(val);
	$("emotbox").style.visibility = "hidden";
	mhideitem = 0;
}

function emotboxsetv(obj)
{
	emotboxset(obj.innerHTML);
}

function emotboxsd(mode)
{

	if(this.last_md == mode)
	{
		$("emotboxdata").style.display = "none";
		this.last_md = 0;
		return;
	}else{
		if(mode == 3)
		{
			$("emotboxdata").style.display = "inline";
		}
	}
	
	this.last_md = mode;
}

function emotboxshow()
{
	$("emotboxdata").style.display = "none";
	show_mitem('emotbox');
}


/* friend search and stuff */

function home_init_textinput()
{
	$("mfriendsearchinput").onkeyup = function(e)
	{
		e = e || event;
	//	if (e.keyCode === 13 && !e.shiftKey) {
			friendsearchbox_search($("mfriendsearchinput").value);
	//	}
		return true;
	}

	$("mpeoplesearchinput").onkeyup = function(e)
	{
		e = e || event;
		
		
		if (e.keyCode === 13 && !e.shiftKey) {
			peoplesearchbox_search($("mpeoplesearchinput").value);
			
		}else if(e.keyCode === 38 || e.keyCode === 40){
			/* do nothing, navigation */
			
		}else{
			peoplesearchbox_searchfriends($("mpeoplesearchinput").value);
		
		}
		return true;
	}
	
	var o = $('friendspanelsearchinput');
	if(o)
	{
		fullpeoplesearchbox_init();
		
		o.onkeyup = function(e)
		{
			e = e || event;
			if (e.keyCode === 13 && !e.shiftKey) {
				fullpeoplesearchbox_search(o.value);
			}
			return true;
		}
	}
	
	$("mpeoplesearchinput").onkeydown = peoplesearch_keyboardnav;
}

function friendsearchbox_init()
{
	var minput = $("mfriendsearchinput");
	var moutput = $("mfriendsearch_content");
	
	minput.value = "";
	moutput.innerHTML = "";
	minput.focus();
}

function search_cachedlist(list, sterm)
{
	var i;
	var jm = {};
	
	jm.users = [];
	
	if(!sterm) return jm;
	
	sterm = sterm.toLowerCase();

	if(!list.users) return jm;
	
	for(i=0; i<list.users.length; i++)
	{
		if(list.users[i].name.toLowerCase().indexOf(sterm) != -1) jm.users.push(list.users[i]);
	}
	return jm;
}


function friendlist_search(sterm, sinput, soutput, fcallback, displaycallback)
{
	
	
	if(!cached_friendlist)
	{
		if(!sterm) return 0;
		
		ajax_post("php/tasks/getfriendlist.php", function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "")
				{
					var jm = {};
					jm = JSON.parse(xmlhttp.responseText);
					
					cached_friendlist = jm;
					
					var nm = search_cachedlist(cached_friendlist, sterm);
					
					/* [todo] need to optimize according to http://code.flickr.com/blog/2009/03/18/building-fast-client-side-searches/ */
					
					displaycallback(nm, sinput, soutput, fcallback);
				}else{
					return 0;
				}
			}});
	}
	
	var nm = search_cachedlist(cached_friendlist, sterm);
	displaycallback(nm, sinput, soutput, fcallback);
	
}

function friendsearchbox_searchcached(sterm, sinput, soutput, fcallback)
{
	return friendlist_search(sterm, sinput, soutput, fcallback, friendsearchbox_displayex);
}


function friendsearchbox_searchex(sterm, sinput, soutput, fcallback)
{
	if(!sterm) return 0;
	
	ajax_post("php/tasks/friendsearch.php?av=1&q=" + sterm, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var jm = {};
				jm = JSON.parse(xmlhttp.responseText);
				friendsearchbox_displayex(jm, sinput, soutput, fcallback);
			}else{
				soutput.innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>Found no available friends for the name you've entered.</div>";
			}
		}});
}

function friendsearchbox_search(sterm)
{
	return friendsearchbox_searchcached(sterm, $("mfriendsearchinput"), $("mfriendsearch_content"), 0);
}

function friendsearchbox_displayex(jd, sinput, soutput, fcallback)
{
	if(!jd || !jd.users) return 0;
		
	if(jd.users.length <= 0)
	{
		soutput.innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>Found no available friends for the name you've entered.</div>";
		return 0;
	}
	
	var dtext = "";
	var dctext = "";
	var ocev = "";
	
	for(var i=0; i<jd.users.length; i++)
	{
		if(fcallback) ocev = "onclick='" + fcallback.toString() + "(\"" + jd.users[i].uid + "\", \"" + escape(jd.users[i].name) + "\", \"" + escape(jd.users[i].dsc) + "\", \"" + jd.users[i].lid + "\");'";

		dctext = "<div " + ocev + " class='menug_item' style='float: left; margin-bottom: 3px;'><div class='chatbox_pic'; overflow: hidden; margin: 4px 8px 4px 3px;\"><img src='data/u" + jd.users[i].lid + "/dp/3.jpg' onerror='failsafe_img(this, 3);'/></div><div style='padding: 0px 10px 0 0; margin-left: 35px;'><div class='idefusername'>" + jd.users[i].name + "</div><div class='idefuserdsc'>" + jd.users[i].dsc + "</div></div></div>";

		dtext += dctext;
	}
	
	
	dtext += "</div>";
	
	soutput.innerHTML = dtext;
}

function friendsearchbox_display(jd)
{
	return friendsearchbox_displayex(jd, $("mfriendsearchinput"), $("mfriendsearch_content"), 0);
}

function friendsearch_keyboardnav(e)
{
	alert('a');
}

/* people search */


function peoplesearchbox_init()
{
	var minput = $("mpeoplesearchinput");
	var moutput = $("mpeoplesearchoutput");

	minput.value = "";
	moutput.innerHTML = "";
	minput.focus();

	
	minput.setAttribute('data-ppcount', 0);
	minput.setAttribute('data-ppindex', -1);
}

function peoplesearchbox_search(sterm)
{
	if(!sterm) return 0;
	
	/* people only search */
	ajax_post("php/tasks/friendsearch.php?nf=1&ppl=1&av=1&q=" + sterm, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var jm = {}; //alert(xmlhttp.responseText);
				jm = JSON.parse(xmlhttp.responseText);
				peoplesearchbox_display(jm);
			}else{
				 //$("mpeoplesearchoutput").innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>No results found.</div>";
			}
		}});
}

function peoplesearchbox_searchfriends(q)
{
	return friendlist_search(q, $("mpeoplesearchinput"), $("mpeoplesearchoutput"), 0, peoplesearchbox_displayfriends);
}

function peoplesearchbox_displayfriends(jd, sinput, soutput, fcallback)
{
	if(!jd || !jd.users) return 0;
		
	if(jd.users.length <= 0)
	{
		soutput.innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>No results found, press enter to search the network.</div>";
		return 0;
	}
	
	var dtext = "";
	var dctext = "";
	var ocev = "";
	var oddeven = "";
	
	for(var i=0; i<jd.users.length; i++)
	{
		if(fcallback) ocev = "onclick='" + fcallback.toString() + "(\"" + jd.users[i].uid + "\", \"" + escape(jd.users[i].name) + "\", \"" + escape(jd.users[i].dsc) + "\", \"" + jd.users[i].lid + "\");'";
		
		if(i % 2 == 0) oddeven = "odd";
		else oddeven = "even";
		
		dctext = "<div data-uloc='pu" + jd.users[i].uid + "' id='mppksearch_person_pdbid" + i + "' class='friendsearch_person friendsearch_" + oddeven + "'><a href='pu" + jd.users[i].uid + "'><div class='friendsearch_dpb'><div class='friendsearch_dp'><div class='boxpic'><img src='data/u" + jd.users[i].lid + "/dp/2.jpg' onerror='failsafe_img(this, 2)'/></div></div></div><div class='friendsearch_mb'>" +
				 "<div class='friendsearch_pn'>" + jd.users[i].name + "</div>" +
				 "<div class='friendsearch_pd'>" + jd.users[i].dsc + "&nbsp;</div></a>" +
				 "<div class='friendsearch_bx'>" +
					"<div class='fsbx_btn' onclick=\"javascript: fsendmessage('" + jd.users[i].uid + "','" + jd.users[i].lid + "','" + jd.users[i].name + "'); shset_hide('friendsearchfull', 1);\" title='Send a private message to " + jd.users[i].fn + "'> <div class='fsbx_btnm2'></div></div>" + 
					"<div class='fsbx_btn' onclick=\"javascript: shset_show('newpostfull', 1);\" title='Post something on " + jd.users[i].fn + "&#39;s profile'> <div class='fsbx_btnm3'></div></div>" + 
					"<div class='fsbx_btn' onclick=\"javascript: showhide_chat('chatbox'); shset_hide('friendsearchfull', 1);\" title='Start chatting with " + jd.users[i].fn + "'> <div class='fsbx_btnm4'></div></div>" + 
					"<a href='pu" + jd.users[i].uid + "'><div class='fsbx_btn' onclick=\"javascript: shset_hide('friendsearchfull', 1);\" title='View " + jd.users[i].fn + "&#39;s posts'> <div class='fsbx_btnm5'></div></div></a>" + 
					"<a href='bu" + jd.users[i].uid + "'><div class='fsbx_btn' onclick=\"javascript: shset_hide('friendsearchfull', 1);\" title='Read " + jd.users[i].fn + "&#39;s Blog'>  <div class='fsbx_btnm6'></div></div></a>" + 
				 "<div style='clear:both;'></div></div><div style='clear:both;'></div></div></div>";

		dtext += dctext;
	}
	
	var minput = $("mpeoplesearchinput");
	
	minput.setAttribute('data-ppcount', jd.users.length);
	minput.setAttribute('data-ppindex', -1);
	
	dtext += "</div>";
	
	soutput.innerHTML = dtext;
}


function peoplesearchbox_display(jd)
{
	if(!jd || !jd.users) return 0;
		
	var moutput = $("mpeoplesearchoutput");

	if(jd.users.length <= 0)
	{
		//moutput.innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>No results found.</div>";
		return 0;
	}
	
	var minput = $("mpeoplesearchinput");
	
	
	var dtext = "";
	var dctext = "";
	var oddeven = "";
	var mfs = "";
	var lastfriendid = parseInt(minput.getAttribute('data-ppcount'));
	
	for(var i=0; i<jd.users.length; i++)
	{
		if(i % 2 == 0) oddeven = "odd";
		else oddeven = "even";
		//dctext = "<div class='menug_item' style='float: left;'><div class='chatbox_pic' style=\"background: url('data/u" + jd.users[i].lid + "/dp/3.jpg'); margin: 4px 8px 4px 3px;\"></div><div style='padding-top: 3px;'><div class='idefusername'>" + jd.users[i].name + "</div><div class='idefuserdsc'>" + jd.users[i].dsc + "</div></div></div>";

		/* friends */
		if(jd.users[i].ifr == 1) /* is friend? */
		{
			dctext = "<div data-uloc='pu" + jd.users[i].uid + "' id='mppksearch_person_pdbid" + (i + lastfriendid) + "' class='friendsearch_person friendsearch_" + oddeven + "'><a href='pu" + jd.users[i].uid + "'><div class='friendsearch_dpb'><div class='friendsearch_dp'><div class='boxpic'><img src='data/u" + jd.users[i].lid + "/dp/2.jpg' onerror='failsafe_img(this, 2)'/></div></div></div><div class='friendsearch_mb'>" +
				 "<div class='friendsearch_pn'>" + jd.users[i].name + "</div>" +
				 "<div class='friendsearch_pd'>" + jd.users[i].dsc + "&nbsp;</div></a>" +
				 "<div class='friendsearch_bx'>" +
					"<div class='fsbx_btn' onclick=\"javascript: fsendmessage('" + jd.users[i].uid + "','" + jd.users[i].lid + "','" + jd.users[i].name + "'); shset_hide('friendsearchfull', 1);\" title='Send a private message to " + jd.users[i].fn + "'> <div class='fsbx_btnm2'></div></div>" + 
					"<div class='fsbx_btn' onclick=\"javascript: shset_show('newpostfull', 1);\" title='Post something on " + jd.users[i].fn + "&#39;s profile'> <div class='fsbx_btnm3'></div></div>" + 
					"<div class='fsbx_btn' onclick=\"javascript: showhide_chat('chatbox'); shset_hide('friendsearchfull', 1);\" title='Start chatting with " + jd.users[i].fn + "'> <div class='fsbx_btnm4'></div></div>" + 
					"<a href='pu" + jd.users[i].uid + "'><div class='fsbx_btn' onclick=\"javascript: shset_hide('friendsearchfull', 1);\" title='View " + jd.users[i].fn + "&#39;s posts'> <div class='fsbx_btnm5'></div></div></a>" + 
					"<a href='bu" + jd.users[i].uid + "'><div class='fsbx_btn' onclick=\"javascript: shset_hide('friendsearchfull', 1);\" title='Read " + jd.users[i].fn + "&#39;s Blog'>  <div class='fsbx_btnm6'></div></div></a>" + 
				 "<div style='clear:both;'></div></div><div style='clear:both;'></div></div></div>";
		}else{ 
			
			/* other people */
			
			if(jd.users[i].mf > 1)
				mfs = jd.users[i].mf + " Mutual Friends";
			else if(jd.users[i].mf == 1)
				mfs = "1 Mutual Friend";
			else
				mfs = "&nbsp;";
			
			dctext = "<div data-uloc='u" + jd.users[i].uid + "' id='mppksearch_person_pdbid" + (i + lastfriendid) + "' class='friendsearch_person friendsearch_" + oddeven + "'><a href='u" + jd.users[i].uid + "'><div class='friendsearch_dpb'><div class='friendsearch_dp'><div class='boxpic'><img src='data/u" + jd.users[i].lid + "/dp/2.jpg' onerror='failsafe_img(this, 2)'/> </div></div></div><div class='friendsearch_mb'>" +
				 "<div class='friendsearch_pn'>" + jd.users[i].name + "</div>" +
				 "<div class='friendsearch_pd'>" + jd.users[i].dsc + "&nbsp;</div></a>" +
				 "<div class='friendsearch_bx'>" +
					"<div class='fsbx_btn'><div class='fsbx_btnm1'></div></div>" +
					"<div class='fsbx_btn'><div class='fsbx_btnm2'></div></div>" +
					"<div class='fsbx_mf'>" + mfs + "</div>" +
				 "<div style='clear:both;'></div></div><div style='clear:both;'></div></div></div>";
		
		}
		
		dtext += dctext;
	}
	
	minput.setAttribute('data-ppcount', parseInt(minput.getAttribute('data-ppcount')) + jd.users.length);
	minput.setAttribute('data-ppindex', -1);
	
	dtext += "</div>";
	
	moutput.innerHTML += dtext;
}


function peoplesearch_keyboardnav(e)
{
	if (!e && window.event) e = window.event;
	if (e) key = e.keyCode;
	else key = e.which;
	
	var o = $("mpeoplesearchinput");
	
	if(key == 27) /* esc */
	{
		shset_hide('friendsearchfull', 1);
		document.focus();
		return 0;
	}
		
	if(key == 40 || key == 38)
	{
		var count = o.getAttribute('data-ppcount');
		var ppindex = o.getAttribute('data-ppindex');
		
		var diobj = $('mppksearch_person_pdbid' + ppindex);
		
		if(diobj)
			diobj.style.background = diobj.getAttribute('data-bkpback');
		
		if(key == 40)ppindex++;
		else ppindex--;
		
		if(ppindex < 0) ppindex = count - 1;
		else if(ppindex >= count) ppindex = 0;
		
		o.setAttribute('data-ppindex', ppindex);
		
		var dobj = $('mppksearch_person_pdbid' + ppindex);
		if(dobj)
		{
			dobj.setAttribute('data-bkpback', dobj.style.background);
			dobj.style.background = "#96b1cb";
		}
		
	}else if(key == 13){
	
		var ppindex = o.getAttribute('data-ppindex');
		
		if(ppindex < 0) return 1;
		
		var dobj = $('mppksearch_person_pdbid' + ppindex);
		if(dobj)
		{
			var uloc = dobj.getAttribute('data-uloc');
			if(uloc)
			{
				//alert(window.location);
				//if(window.history.go)
					 //window.history.go(uloc);
				//else
				window.location = uloc;
			}
		}
	
	}
	return 1;
}



/* feed/posts  - general functions */

function fc_post_expand(sdiv, ldiv, mpid)
{
	if(!mpid)
	{
		$(sdiv).style.display = "none";
		$(ldiv).style.display = "inline";
	}
}

function newpost_switchmode()
{
	var so = $("newpostpswitch");
	var m = so.getAttribute("data-cmode");
	if(m == '1')
	{
		so.innerHTML = "Send To";
		$("newpostptitle").innerHTML = "New Post";
		$("newpostpsubox").style.display = "none";
		$("newpostpexpt").style.marginLeft = '0px';
		$("newpostpbb").style.marginLeft = '0px';
		so.setAttribute("data-cmode", 0);
	}else{
		so.innerHTML = "Switch to Status";
		$("newpostptitle").innerHTML = "Send New Post to";
		$("newpostpsubox").style.display = "inline";
		$("newpostpexpt").style.marginLeft = '55px';
		$("newpostpbb").style.marginLeft = '55px';
		so.setAttribute("data-cmode", 1);
	}
}

function newpost_sendex(fns, fnf, objptdata, smode, smuserid, locset)
{
	var uaddition = "";
	var textvalue = "";
	
	if(smode == 1) /* send to someone */
	{
		uaddition = "?u=" + smuserid;
	}
	
	
	/* get locations */
	
	var locsetstr = "";
		
	if(locset)
	{
		if(locset[0])
			locsetstr = "locn=" + locset[0] + "&loclg=" + locset[1] + "&loclt=" + locset[2];
	}
	
	if(uaddition != "") locsetstr = "&" + locsetstr;
	else locsetstr = "?" + locsetstr;
	
	textvalue = objptdata.value;
	if(!textvalue) textvalue = objptdata.innerText;
	
	var lftimeid_val = "lftimeid=" + $("divdatasetfeed").getAttribute("data-lptimeid");
	
	if(uaddition != "" || locsetstr != "") lftimeid_val = "&" + lftimeid_val;
	else lftimeid_val = "?" + lftimeid_val;
	
	if(!newpost_cdt_url) /* text */
	{
		var txtval = textvalue.replace(/\s/g, "");
		
		if(txtval.length <= 0) return;
		
		ajax_postbig("php/tasks/newpost.php" + uaddition + locsetstr + lftimeid_val, "d", textvalue.replace(/\n\r?/g, '[-n-l-]'), function(){
		if (xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "")
				{
					if(fns)fns(xmlhttp.responseText);
					
				}else{
					if(fnf)fnf();
				}
			}else{
				if(fnf)fnf();
			}
		}});
	
	}else{
	
		var dv = "";

		dv += "m=" + encodeURIComponent(newpost_cdt_link_mode);
		dv += "&eurl=" + encodeURIComponent(newpost_cdt_url);
		dv += "&esite=" + encodeURIComponent(newpost_cdt_link_site);
		dv += "&etitle=" + encodeURIComponent(newpost_cdt_link_title);
		dv += "&edsc=" + encodeURIComponent(newpost_cdt_link_dsc);
		dv += "&edur=" + encodeURIComponent(newpost_cdt_link_duration);
		dv += "&ethumb=" + encodeURIComponent(newpost_cdt_link_turl);
		   
		dv += "&d";
	
		ajax_postbig("php/tasks/newpost_link.php" + uaddition + locsetstr + lftimeid_val, dv, textvalue.replace(/\n\r?/g, '[-n-l-]'), function(){
		if (xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "")
				{
					if(fns)fns();
					//alert(xmlhttp.responseText);
				}else{
					if(fnf)fnf();
				}
			}else{
				if(fnf)fnf();
			}
		}});
	
	}
}

function newpost_send(fns, fnf)
{
	var smode = 0;
	var so = $("newpostpswitch");
	var m = 0;
	if(so)
	{
		m = so.getAttribute("data-cmode");
	}
	
	if(m == "1")smode = 1;
	
	return newpost_sendex(fns, fnf, $("newpostptdata"), smode, 0, 0);
}


function feedc_newpost_send()
{
	var po = $("feedpostspownerid"); /* won't be there for your own feed/posts */
	var uid     = 0;
	var selfid  = 0;
	
	var locset = 0;
	
	if(po)
	{
		uid = po.getAttribute("data-uid");
		selfid = po.getAttribute("data-selfid");
	}
	if(po && uid && selfid && (uid != selfid))
	{

		newpost_sendex(function (v){feedc_newpost_posted(v);}, 0 /* fail */, $("feednewpostptdata"), 1, uid, locset);

	}else{
	
		var objloc = $("feed_newpost_eiloc");
		if(objloc)
		{
			var ofchild = objloc.firstChild;
		
			if(ofchild)
			{
				if(ofchild.tagName == "I" || ofchild.tagName == "i")
				{
					locset = [];
					locset[0] = ofchild.innerText;
					locset[1] = ofchild.getAttribute('data-lg'); /* lg */
					locset[2] = ofchild.getAttribute('data-lt'); /* lt */
				}
			}
		}
	
	
		newpost_sendex(function (v){feedc_newpost_posted(v);}, 0 /* fail */, $("feednewpostptdata"), 0, 0, locset);

	}
}

function feedc_newpost_cancel()
{
	feed_newpost_ctd_clear();
	//expandbox_setvalue($("feednewpostptdatact"), $("feednewpostptdata"), "");
	$("feed_newpost_mainbtns").style.display = "none";
	feedc_newpost_controls_display = 0;
}


function feedc_newpost_posted(postdt)
{
	feedc_newpost_cancel();
	var o = $("feedc_pomiddleb");
	o.innerHTML = postdt + o.innerHTML;
}



function newpost_ctd_clear()
{
	var so = $("newpost_ctdata");
	
	newpost_cdt_url = 0;
	$("newpost_ctdatai").innerHTML = "";
	so.style.display = "none";
	so.setAttribute("data-ctddisplay", 0);
}

function feed_newpost_ctd_clear()
{
	var so = $("feed_newpost_ctdata");
	
	newpost_cdt_url = 0;
	$("feed_newpost_ctdatai").innerHTML = "";
	so.style.display = "none";
	so.setAttribute("data-ctddisplay", 0);
}

function newpost_ctd_check(textboxid, thumboutdiv, thumbindiv, detailov, detailov1, detailov2)
{
	var tv = $(textboxid).value;
	
	if(!tv) tv = $(textboxid).innerText;
	if(!tv) tv = $(textboxid).innerHTML;
	if(!tv) return 0;
	
	var fl = newpost_cdt_url;
	var flc = 0;
	
	var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var nt = tv.replace(urlRegex, function(url) {
        if(!fl)
		{
			fl = url;
			flc = 1;
		}
		return "";
    })
	
	if(flc)
	{
		newpost_cdt_url = fl;
		var ud = url_get_details(fl, thumboutdiv, thumbindiv, detailov, detailov1, detailov2);
		
		if(ud.thumb)
		{
			newpost_addthumb(thumboutdiv, thumbindiv, ud.thumb, ud.mode, ud.site, ud.title, ud.dsc);
		}
	}
}






function newpost_addthumb(thumboutdiv, thumbindiv, thumb, mode, site, title, dsc)
{
	if(!thumb && !title) return;
	
	var so = $(thumboutdiv);
	
	if(thumb)
		newpost_cdt_link_turl = thumb;
	
	$(thumbindiv).innerHTML = "<div class='newpost_ctdataimgcover'><img onload='newpostimg_center(this);' id='newpost_ctdataimg' src='" + thumb + "' width='337px'/></div>";
	
	so.style.display = "";
	so.setAttribute("data-ctddisplay", 1);
}


function newpost_setdetails(mode, site, title, dsc, tlength, detailov, detailov1, detailov2)
{
	var o = $(detailov);
	
	if(!o)return;
	
	title = title.substr(0, 50);
	dsc = dsc.substr(0, 200);
	
	$(detailov1).innerHTML = "<div style='background: url(\"images/sheet.png\") no-repeat -212px -172px; width: 24px; height: 32px;'></div>";
	$(detailov2).innerHTML = tlength;
	
	switch(mode)
	{
	case 2: /* photo */
		newpost_cdt_link_mode = 2;
		break;
		
	case 3: /* video */
		newpost_cdt_link_mode = 3;
		break;
		
	default:
		newpost_cdt_link_mode = 5; /* in server, 5 stands for a url/link */
		break;
	}
	
	newpost_cdt_link_site      = site;
	newpost_cdt_link_title     = title;
	newpost_cdt_link_dsc       = dsc;
	newpost_cdt_link_duration  = tlength;
	

	o.innerHTML = '<b>' + title + '</b> (' + site + ')<p>' + dsc + '</p>';
}


function newpostimg_center(o)
{
	var h = 145;
	
	if(o.parentNode)
	{
		if(o.parentNode.offsetHeight) h = o.parentNode.offsetHeight;
	}
	
	o.style.marginTop = -(o.offsetHeight/2 - h/2) + 'px';
	fadein(o);
}

function newpostimg_err(o)
{
	o.style.background = "#EBF0F5";
	o.style.height = '145px';
	fadein(o);
}

function url_get_details(url, thumboutdiv, thumbindiv, detailov, detailov1, detailov2)
{
	var tloc   = 0;
	var umode  = 0;
	var usite  = 0;
	var utitle = 0;
	var udsc   = 0;
	var gsite  = 0;

	var id;

	if (url.indexOf('youtube.com') > -1) {
		id = url.split('v=')[1].split('&')[0];
		if(id){tloc = 'http://i2.ytimg.com/vi/' + id + '/hqdefault.jpg'; gsite = 1;}
	} else if (url.indexOf('youtu.be') > -1) {
		id = url.split('/')[1];
		if(id){tloc = 'http://i2.ytimg.com/vi/' + id + '/hqdefault.jpg'; gsite = 1;}
	} else if (url.indexOf('vimeo.com') > -1) {
		if (url.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/)) {
			id = url.split('/')[1];
		} else if (url.match(/^vimeo.com\/channels\/[\d\w]+#[0-9]+/)) {
			id = url.split('#')[1];
		} else if (url.match(/vimeo.com\/groups\/[\d\w]+\/videos\/[0-9]+/)) {
			id = url.split('/')[4];
		}
		
		gsite = 2;

		jsonp.get("http://vimeo.com/api/v2/video/2323231.json", function(data){
			if(data) newpost_addthumb(thumboutdiv, thumbindiv, data[0].thumbnail_large, 0, 0, 0, 0);
			});		
			
	}
	
	
	if(gsite == 1) /* youtube */
	{
		/* get video data through jsonp and set it */
	
	
		
		jsonp.get("https://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=jsonc", function(data){
			if(data) newpost_setdetails(3, "Youtube.com", data.data.title, data.data.description, translate_seconds_to_duration(data.data.duration), detailov, detailov1, detailov2);
			});	
	
	
	
	
	
	
	}
	
	
	
	
	
	
	
	
	
	
	
	tloc = tloc.replace("#", "");
	tloc = tloc.replace("!", "");
	
	return {
        thumb: tloc,
        mode: umode, /* 1 - general, 2 - photo, 3 - video */
        site: usite,
        title: utitle,
		dsc: udsc
    };
}

function translate_seconds_to_duration(secs)
{
	var hr = Math.floor(secs / 3600);
	var min = Math.floor((secs - (hr * 3600))/60);
	var sec = secs - (hr * 3600) - (min * 60);
	
	while (min.length < 2) {min = '0' + min;}
	while (sec.length < 2) {sec = '0' + min;}
	if (hr) hr += ':';
	return hr + min + ':' + sec;
}


function imain_init()
{
	feedc_newpost_controls_display = 0;
	
	$("newpostptdata").onkeyup = function(e)
	{
		e = e || event;
		if (e.keyCode === 13 || e.keyCode == 32) {
			newpost_ctd_check("newpostptdata", "newpost_ctdata", "newpost_ctdatai", "newpost_ctimgoverlay", "newpost_ctimgoverlayilb", "newpost_ctimgoverlayirb");
		}
		return true;
	}
	
	detect_paste($("newpostptdata"), function() {newpost_ctd_check("newpostptdata", "newpost_ctdata", "newpost_ctdatai", "newpost_ctimgoverlay", "newpost_ctimgoverlayilb", "newpost_ctimgoverlayirb");});

	if($("feednewpostptdata"))
	{
		$("feednewpostptdata").onclick = function(e){autocomplete_box_setpos($("feednewpostptdata"));};
		tokenized_init_usertag($("feednewpostptdata"), function(e)
		{
			e = e || event;
			
			feedc_showhide_controls();
			
			if (e.keyCode === 13 && !e.shiftKey) {
				newpost_ctd_check("feednewpostptdata", "feed_newpost_ctdata", "feed_newpost_ctdatai",  "feed_newpost_ctimgoverlay", "feed_newpost_ctimgoverlayilb", "feed_newpost_ctimgoverlayirb");

			}
			return true;
		});
		
		//
		detect_paste_div($("feednewpostptdata"), function() {feedc_showhide_controls(); newpost_ctd_check("feednewpostptdata", "feed_newpost_ctdata", "feed_newpost_ctdatai", "feed_newpost_ctimgoverlay", "feed_newpost_ctimgoverlayilb", "feed_newpost_ctimgoverlayirb");});

	}
	
}


function feedc_showhide_controls()
{
	if($("feednewpostptdata").innerText.length > 0)
	{
		if(!feedc_newpost_controls_display)
		{
			$("feed_newpost_mainbtns").style.display = "";
			feedc_newpost_controls_display = 1;
		}
	}else{
		if(feedc_newpost_controls_display)
		{
			$("feed_newpost_mainbtns").style.display = "none";
			feedc_newpost_controls_display = 0;
		}
	}
}


function fc_post_expand_video(vsite, vurl, vtitleobj, vdscobj, uname, uloc, uid, pid)
{
	var vid = get_option_from_url(vurl, 'v');
	if(!vid) return 0;
	
	$("spwout").style.display = '';
	$("spw").style.display = '';
	
	vurl = "http://www.youtube.com/v/" + vid;
	var veurl = "<object width=\"640\" height=\"360\"><param name=\"movie\" value=\"" + vurl + "?version=3&amp;hl=en_US\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowscriptaccess\" value=\"always\"></param><param name=\"wmode\" value=\"opaque\" /><embed src=\"" + vurl + "?version=3&amp;hl=en_US\" type=\"application/x-shockwave-flash\" width=\"640\" height=\"360\" allowscriptaccess=\"always\" allowfullscreen=\"true\" wmode=\"opaque\"></embed></object>";
    
	$('spwdvdp').style.background = "url('data/u" + uloc + "/dp/2.jpg')";
	$('spwdvtitle').innerHTML = $(vtitleobj).innerHTML;
	$('spwdvdsc').innerHTML = $(vdscobj).innerHTML;
	$('spwdvuname').innerHTML = uname;
	
	
	$('spwd').innerHTML = veurl;
	$('spwdbar').style.display = "none";
	
	
	overlay_show();
	post_center();
	
	
	/* get notes and data */
	
	ajax_post("php/pages/getnotes.php?pid=" + pid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText)
			{
				$('spw_edt').innerHTML = xmlhttp.responseText;
				
				synctime_set($('spw_edt'));
			}
		}
		});
	
	
	
	
	
}

function get_option_from_url(url, okey)
{
	var start = url.search(okey + '=');
	if(start < 0) return 0;
	start += okey.length + 1;
	var nurl = url.substr(start);
	var end = nurl.search('&');
	if(end >= 0)
		return url.substr(start, end);
	else
		return nurl;
}

function fc_comment_button(uid)
{
				/* add comment input */
	if(!$(uid + "aci"))
	{
		
		var o = $("add" + uid);
		if(o)
		{
			o.innerHTML =	"<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>" +
							"<div class='feedc_cm_dp'><img onerror='failsafe_img(this, 3);' src='data/u" + cuser_ulid + "/dp/3.jpg'/></div><div class='feedc_cm_c'>" +
								"<div id='" + uid + "aci' class='expandingArea' style='margin-left: 0px; margin-top: 2px; min-height: 20px; width: 100%;  border: 1px solid #f0f1f2;'>" +
									"<pre><span></span><br></pre>" +
									"<textarea id='" + uid + "acit' class='newc_textarea' autocomplete='off' placeholder='Leave a Note...'></textarea>" +
						"</div></div><div style='clear: both;'></div></div></div>";
		}
		
		makeExpandingArea($(uid + "aci"));
		//$('info' + uid).style.display = '';
		
		$(uid + "acit").onkeyup = function(e)
		{
			e = e || event;
			if (e.keyCode === 13 && !e.shiftKey) {
				fc_comment_add(uid, $(uid + "acit").value);
				/* clear text in write box only if ajax returns 1 */
			}
			return true;
		}
		
		$(uid + "acit").focus();
	}
}


function fc_comment_button_ex(uid)
{
	/* add comment input */

	if(!$(uid + "aci"))
	{
		
		var o = $("add" + uid);
		if(o)
		{
		/*	o.innerHTML =	"<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>" +
							"<div class='feedc_cm_dp'><img onerror='failsafe_img(this, 3);' src='data/u" + cuser_ulid + "/dp/3.jpg'/></div><div class='feedc_cm_c'>" +
								"<div id='" + uid + "aci' class='expandingArea' style='margin-left: 0px; margin-top: 2px; min-height: 20px; width: 100%;  border: 1px solid #f0f1f2;'>" +
									"<pre><span></span><br></pre>" +
									"<textarea id='" + uid + "acit' class='newc_textarea' autocomplete='off' placeholder='Leave a Note...'></textarea>" +
						"</div></div><div style='clear: both;'></div></div></div>";
		*/
			o.innerHTML =	"<div class='feedc_cm_line feedc_cm_line_e'><div class='feedc_cmli'>" + 
								"<div class='feedc_cm_dp'><img src='data/u" + cuser_ulid + "/dp/3.jpg' onerror='failsafe_img(this, 3);'/></div><div class='feedc_cm_c'>" + 
								"<div class='feedc_cm_cm'><div onclick='fc_comment_button_ex(\"pcd$puniqueid\")' style='outline: none; padding: 2px 4px 2px 4px;' id='" + uid + "acit' contenteditable='plaintext-only' placeholder='Leave a Note...'></div></div>" +
							"</div><div style='clear: both;'></div></div></div>";
		
		}
		
		//makeExpandingArea($(uid + "aci"));
		//$('info' + uid).style.display = '';
		autocomplete_box_setpos($(uid + "acit"));
		tokenized_init_usertag($(uid + "acit"), function(e)
			{
				e = e || event;
				if (e.keyCode === 13 && !e.shiftKey) {
					fc_comment_add(uid, $(uid + "acit").innerHTML);
					/* clear text in write box only if ajax returns 1 */
				}
				return true;
			});
		
		$(uid + "acit").focus();
	}
}


function fc_comment_add(uid, value)
{

	/* eliminate html and extract tagging codes */
	value = value.replace(/<i data-value=\"([^\"]*)[^\/]*.../gm, "$1");

	var o = $(uid);
	var cnc = o.getAttribute("data-mnid");
	var cnc_count = o.getAttribute("data-ccount");
	
	cnc++;
	cnc_count++;
	
	var ccuid = uid + "_" + cnc;
	
	var oddev = "e";
	var tsyncid = "ctv" + uid + cnc;
	var offset = new Date().getTimezoneOffset();
	var tsyncval = +new Date();;
	
	tsyncval /= 1000;
	
	if(cnc_count % 2 == 0) oddev = "o";
	
	o.setAttribute("data-mnid", cnc);
	o.setAttribute("data-ccount", cnc_count);
	
	var dcval = "<div class='feedc_cm_line feedc_cm_line_" + oddev + "' id='feedc_cm_line_tct" + ccuid + "'><div class='feedc_cmli'>" + 
					"<div class='feedc_cm_dp'><img src='data/u" + cuser_ulid + "/dp/3.jpg'/></div>" + 
					"<div class='feedc_cm_c'>" + 
					"<div id='feedc_cm_line_tdt" + ccuid + "'><a href='#' class='feedc_pouname'>" + cuser_name + "</a>" + value + 
						"</div><div><abbr id='" + tsyncid + "' data-mode='0' data-ts='" + tsyncval + "'>few seconds ago.</abbr></div>" + 
					"</div><div style='clear: both;'></div></div></div>";
											
	o.innerHTML += dcval;
	
	/* just clear it since we're not using ajax yet */
	
	synctime_settimer($(tsyncid));
	
	ajax_postbig("php/tasks/addnote.php?intt=0&id=" + uid.substr(3), "d", value, function(){
			if(xmlhttp.readyState==4)
			{
				if(xmlhttp.status==200 && xmlhttp.responseText != "" && xmlhttp.responseText != "0")
				{
					var cob = $("feedc_cm_line_tdt" + ccuid)
					if(cob)
					{
						cob.innerHTML = "<a href='#' class='feedc_pouname'>" + cuser_name + "</a> " + xmlhttp.responseText;
					}
					
				}else{
					var cob = $("feedc_cm_line_tct" + ccuid);
					if(cob)
					{
						cob.style.background = "#ffe82f";
					/* cob.title = "Couldn't send this note, click here to try it again."; */
					}
				}
			}});
	
	
	//expandbox_setvalue($("add" + uid), $(uid + "acit"), "");
	$(uid + "acit").innerHTML = "";
}

function fc_notedel(uid)
{
	var o = $('feedc_cm_line_tct' + uid);
	if(!o) return 0;
	
	o.innerHTML = get_preloader(32, 5);
	
	ajax_post("php/tasks/delnote.php?id=" + uid.substr(3), function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText == "1")
			{
				var p = o.parentNode;
				p.removeChild(o);
			}else{
				alert(xmlhttp.responseText);
				o.innerHTML = "<center style='color: #888888; padding: 8px 0 0 0;'>Sorry, <a style='text-decoration: none; color: #336699;'href='javascript: fc_notedel(\"" + uid + "\")'>try again</a></center>";
			}
		}
		});
}

function fc_notereport(uid)
{
	var o = $('feedc_cm_line_tct' + uid);
	if(!o) return 0;
	set_opacity(o, 10);
}

function fc_notes_expand(pid, expid)
{
	var o = $(pid);
	var bkpidata = o.innerHTML;

	var fnoteid = o.getAttribute('data-fcid');
	if(!fnoteid) return 0;

	if(parseInt(o.getAttribute('data-ccount')) >= parseInt(o.getAttribute('data-fcount'))) return 0;

	o.innerHTML = get_preloader(32, 5) + bkpidata;
	
	
	ajax_post("php/tasks/getnotes.php?id=" + pid.substr(3) + "_" + fnoteid + "&c=20", function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText)
			{
				var vc = xmlhttp.responseText.indexOf('_');
				var nsetdata = xmlhttp.responseText.substr(0, vc);
				
				var vcc = nsetdata.indexOf('-');
				var ncount = nsetdata.substr(0, vcc);
				var nfid = nsetdata.substr(vcc + 1);
				
				var fncount = o.getAttribute('data-ccount');
				
				if(fncount)
				{
					fncount = parseInt(fncount) + parseInt(ncount);
					o.setAttribute('data-ccount', fncount);
				}
				
				o.setAttribute('data-fcid', nfid);
				
				var expobj = $(expid);
				if(expobj)
				{
					expobj.innerHTML = "Expand Notes (" + fncount + "/" + o.getAttribute('data-fcount') + ")";
				}
				
				o.innerHTML = xmlhttp.responseText.substr(vc + 1) + bkpidata;
				synctime_set(o);
			}else{
				o.innerHTML = "Error" + bkpidata;
			}
		}
		});
}


function expandbox_setvalue(obj, objtextarea, value)
{
	var spanbox = obj.querySelector('span');
	
	if(!objtextarea)
		objtextarea = obj.querySelector('textarea');
	
	spanbox.innerHTML = value;
	objtextarea.value = value;
}

function expandbox_setvalueex(obj, objtextarea, value, ovalue)
{
	var spanbox = obj.querySelector('span');
	
	if(!objtextarea)
		objtextarea = obj.querySelector('textarea');
	
	spanbox.innerHTML = value;
	objtextarea.value = ovalue;
}

/*
 * filterset
 * [feed mode],[feed filter set],[collapse mode],[network set],[location set]
 *
 * zero for set - everything/everyone
 * set is represented as a binary string otherwise.
 *
 */

function feedc_loadmore_ex(mappend, msearchvalue, filterset)
{
	var txtfilterset = "";
	
	if(filterset)txtfilterset = "&f=" + filterset;
	
	$("feedc_postexpandbari").innerHTML = get_preloader(32, 5);
	
	if(msearchvalue != -1)
		feed_search_current_text = msearchvalue;
	else
		msearchvalue = feed_search_current_text;
		
	var lfid = $("divdatasetfeed").getAttribute("data-lftimeid");
	
	ajax_post("php/tasks/feedc_loadmore.php?lfid=" + lfid + "&q=" + msearchvalue + txtfilterset, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var vc = xmlhttp.responseText.indexOf(',');
				lfid = xmlhttp.responseText.substr(0, vc);
				
				$("divdatasetfeed").setAttribute("data-lftimeid", lfid);
				
				$("feedc_postexpandbari").innerHTML = "<a>More...</a>";
				
				if(mappend)
				{
					var ondv = document.createElement('div');
					ondv.innerHTML = xmlhttp.responseText.substr(vc + 1);
					
					$("feedc_pomiddleb").appendChild(ondv);
			
					add_lazyloading(ondv);
					synctime_set(ondv);
				}else{
					var midoutb = $("feedc_pomiddleb");
					
					midoutb.innerHTML = xmlhttp.responseText.substr(vc + 1);
					add_lazyloading(midoutb);
					synctime_set(midoutb);
				}
				
				//$("feedc_pomiddleb").innerHTML += xmlhttp.responseText.substr(vc + 1);
				//synctime_set($("feedc_pomiddleb"));
				
				auto_feed_loading_processing = 0;
				
			}else{
			
				if(msearchvalue != -1)
				{
					if(!mappend)
					{
						$("feedc_pomiddleb").innerHTML = "<center style='padding: 150px 0 150px 0;'>No results found.</center>";
					}
				}
				$("feedc_postexpandbari").innerHTML = "<a>Sorry, cannot view more posts...</a>";
			}
		}
	
	});
}

function feedc_loadmore()
{
	return feedc_loadmore_ex(1, -1);
}

function feedc_loadmoredual(uid)
{
	return feedc_loadmoredual_ex(uid, 1, -1);
}

function feedc_loadmoredual_ex(uid, mappend, msearchvalue)
{
	$("feedc_postexpandbari").innerHTML = get_preloader(32, 5);

	if(msearchvalue != -1)
		feed_search_current_text = msearchvalue;
	else
		msearchvalue = feed_search_current_text;
		
	var lfid = $("divdatasetfeed").getAttribute("data-lfid");
	
	ajax_post("php/tasks/feedc_loadmore_dual.php?lfid=" + lfid + "&user=" + uid + "&q=" + msearchvalue, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var vc = xmlhttp.responseText.indexOf(',');
				lfid = xmlhttp.responseText.substr(0, vc);
				
				var vcc = xmlhttp.responseText.substr(vc + 1, 20).indexOf(',');
				
				var vccv = parseInt(xmlhttp.responseText.substr(vc + 1, vcc));
				
				$("divdatasetfeed").setAttribute("data-lfid", lfid);
				
				$("feedc_postexpandbari").innerHTML = "<a>More...</a>";
				
				var va = xmlhttp.responseText.substr(vc + 1).split("\n");
				
				//$("feedc_pomiddleb").innerHTML += va[0];
				//$("feedc_pomiddlebr").innerHTML += va[1];
				
				//synctime_set($("feedc_pomiddleb"));
				
				if(mappend)
				{
					var ondv1 = document.createElement('div');
					var ondv2 = document.createElement('div');
					
					ondv1.innerHTML = va[0];
					ondv2.innerHTML = va[1];
					
					$("feedc_pomiddleb").appendChild(ondv1);
					$("feedc_pomiddlebr").appendChild(ondv2);
					
					$("feedc_pofull").style.display = '';
					$("feedc_ponotice").innerHTML = "";
					
					add_lazyloading(ondv1);
					add_lazyloading(ondv2);
					
					synctime_set(ondv1);
					synctime_set(ondv2);
				}else{

					$("feedc_pomiddleb").innerHTML = va[0];
					$("feedc_pomiddlebr").innerHTML = va[1];
					
					$("feedc_pofull").style.display = '';
					$("feedc_ponotice").innerHTML = "";
					
					add_lazyloading($("feedc_pomiddleb"));
					add_lazyloading($("feedc_pomiddlebr"));
					
					synctime_set($("feedc_pomiddleb"));
					synctime_set($("feedc_pomiddlebr"));
				}
				
				auto_feed_loading_processing = 0;
				
			}else{
			
				$("feedc_pofull").style.display = '';
				$("feedc_postexpandbari").innerHTML = "<a>Sorry, cannot view more posts...</a>";
			}
		}
	
	});
}

function feed_post_delete(pid)
{
	ajax_post("php/tasks/feed_post_delete.php?pid=" + pid, function(){
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		var o = $("feedcpoout" + pid);
		
		if(o)
		{
			o.innerHTML = "";
			o.parentNode.removeChild(o);
		}
	}
	});
}



function posts_fc_init()
{

	var dz = $('feedc_postboxinput');
	
	if(dz)
	{
		dz.addEventListener('dragover', posts_fc_uploadphandle_dragover, false);
		dz.addEventListener('drop', posts_fc_uploadphandle_drop, false);
	}
	
	var dzs = $('pfeedfc_uploadpsel');
	
	if(dzs)
		dzs.addEventListener('change', posts_fc_uploadphandle, false);

	var icdz = $('overlayfulldialog');
		
	if(icdz)
	{
		icdz.addEventListener('dragover', posts_fc_uploadphandle_dragover, false);
		icdz.addEventListener('drop', posts_fc_uploadphandle_drop, false);
	}
}

function posts_fc_uploadphandle(evt)
{
	var files = evt.target.files;
	var fc = 0;

	for (var i = 0, f; f = files[i]; i++)
	{
		//if (!f.type.match('image.*'))continue;
		fc++;
	}
	
	var npics = $('overlayfulldialog_ic').getAttribute('data-npics');
	
	if(!npics) npics = 0;
	
	photoupf_show();
	photoup_viewthumbs(npics, fc, $('overlayfulldialog_ic'));
	photoup_resamplethumbs(npics, fc, files);
}

function posts_fc_uploadphandle_drop(evt)
{
	evt.stopPropagation();
	evt.preventDefault();
	
	var files = evt.dataTransfer.files;
	var fc = 0;
	
	for (var i = 0, f; f = files[i]; i++)
	{
		//if (!f.type.match('image.*'))continue;
		fc++;
	}
	
	var npics = $('overlayfulldialog_ic').getAttribute('data-npics');
	
	if(!npics) npics = 0;
	
	photoupf_show();
	photoup_viewthumbs(npics, fc, $('overlayfulldialog_ic'));
	photoup_resamplethumbs(npics, fc, files);
}

function posts_fc_uploadphandle_dragover(evt)
{
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}


/* photo uploading window */

function photoupf_show()
{
	var o = $('overlayfulldialog');
	var oi = $('overlayfulldialog_ic');
	
	if(o.style.display)
	{
		o.style.display = '';
		
		overlaydef_show(function(){photoupf_close();});
	}
}

function photoupf_close()
{
	var o = $('overlayfulldialog');
	var oi = $('overlayfulldialog_ic');
	
	o.style.display = 'none';
	oi.innerHTML = "";
	
	oi.setAttribute('data-npics', 0);
	
	overlaydef_close();
}

/* paste detection -------------------- */


function detect_paste(textarea, callback) {
    textarea.onpaste = function() {
        var sel = getTextAreaSelection(textarea);
        var initialLength = textarea.value.length;
        window.setTimeout(function() {
            var val = textarea.value;
            var pastedTextLength = val.length - (initialLength - sel.length);
            var end = sel.start + pastedTextLength;
            callback({
                start: sel.start,
                end: end,
                length: pastedTextLength,
                text: val.slice(sel.start, end)
            });
        }, 1);
    };
}

function getTextAreaSelection(textarea) {
    var start = textarea.selectionStart, end = textarea.selectionEnd;
    return {
        start: start,
        end: end,
        length: end - start,
        text: textarea.value.slice(start, end)
    };
}



function detect_paste_div(obj, callback) {
    obj.onpaste = function() {
        window.setTimeout(function() {
            var val = get_div_selection(obj);
            callback({
                start: 0,
                end: 0,
                length: val.length,
                text: val
            });
        }, 1);
    };
}


function get_div_selection(obj) {
	var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
	
	return html;
}

/* edit-in-place */


function geditinplace(obj, emode, w, h)
{
	var val = obj.innerText;
	
	if(editinplace_fitemo) return;

	editinplace_bkp = obj.innerHTML;
	
	if(emode == 2)
	{
		obj.innerHTML = "<textarea id='geditinplaceitmvinput'>" + val + "</textarea>";
	}else{
		obj.innerHTML = "<input id='geditinplaceitmvinput' value='" + val + "'/>";
	}
	
	var itobj = $('geditinplaceitmvinput');
	
	editinplace_fitemo = obj;
	editinplace_fitem = itobj;
	
	
	if(w!=undefined)
		itobj.style.width = w + 'px';
	
	if(h!=undefined)
		itobj.style.height = h + 'px';

	switch(emode)
	{
	case 0: /* text */
	case 2: /* text-multiline */
	case 1: /* location [todo] */
	
		$('geditinplaceitmvinput').onkeyup = function(e)
		{
			e = e || event;
			if (e.keyCode === 13 && !e.shiftKey)
			{
				if(editinplace_fitemo)
				{
					var iobj = $('geditinplaceitmvinput');
					if(iobj)
					{
						editinplace_fitemo.innerHTML = iobj.value.replace(/\n/g, "<br>");
						if(editinplace_fitemo.innerHTML)
							editinplace_fitemo.setAttribute('data-eipset', 1);
					}else{
						editinplace_fitemo.innerHTML = editinplace_bkp;
					} 
					
					editinplace_fitemo = 0;
					editinplace_fitem = 0;
					editinplace_bkp = "";
				}
			}
			return true;
		}
		break;
	}
	
	itobj.focus();
}

function editinplace_hide()
{
	var obj = editinplace_fitemo;
	var iobj = $('geditinplaceitmvinput');

	/*if(iobj)
	{
		obj.innerHTML = iobj.value;
	}else{
		obj.innerHTML = editinplace_bkp;
	} */
	obj.innerHTML = editinplace_bkp;
	
	editinplace_fitemo = 0;
	editinplace_fitem = 0;
	editinplace_bkp = "";
}


function failsafe_img(obj, id)
{
	switch(id)
	{
	case 1: /* full profile pic */
		obj.src = "images/failsafe/dp/1.jpg";
		break;
	
	case 2: /* small profile pic */
		obj.src = "images/failsafe/dp/2.jpg";
		break;
		
	case 3: /* smallest profile pic */
		obj.src = "images/failsafe/dp/3.jpg";
		break;
	
	case 4: /* huge profile pic */
		obj.src = "images/failsafe/dp/temp.jpg";
		break;
	
	}

}

function failsafe_imgphoto(obj, id)
{
	switch(id)
	{
	case 1:
		obj.parentNode.innerHTML = "<p style='margin-top: 200px;'>Sorry, couldn't load the photo.</p>";
		break;
		
	case 2:
		obj.style.display = "none";
		
		var emsgdiv = document.createElement('p');
		emsgdiv.innerHTML = "<center>Sorry, couldn't load the photo.</center>";
		emsgdiv.style.position = "absolute";
		emsgdiv.style.top = "58px";
		emsgdiv.style.width = "100%";
		emsgdiv.style.color = "#336699";
		
		obj.parentNode.appendChild(emsgdiv);
		obj.parentNode.style.background = "#E5ECF2";
		break;
	}

}



/* friend/people full search */


function fullpeoplesearchbox_init()
{
	var minput = $("friendspanelsearchinput");
	var moutput = $("fullpeoplesearchgrid");

	minput.value = "";
	moutput.innerHTML = get_preloader(32, 50);
	minput.focus();

	
	minput.setAttribute('data-ppcount', 0);
	minput.setAttribute('data-ppindex', -1);
}

function fullpeoplesearchbox_search(sterm)
{
	if(!sterm) return 0;
	
	ajax_post("php/tasks/friendsearch.php?ppl=1&av=1&q=" + sterm, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				var jm = {};
				jm = JSON.parse(xmlhttp.responseText);
				fullpeoplesearchbox_display(jm);
			}else{
				 $("fullpeoplesearchgrid").innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>No results found.</div>";
			}
		}});
}

function fullpeoplesearchbox_display(jd)
{
	if(!jd || !jd.users) return 0;
		
	var moutput = $("fullpeoplesearchgrid");

	if(jd.users.length <= 0)
	{
		moutput.innerHTML = "<div style='padding: 10px; text-align: center; font-size: 11px;'>No results found.</div>";
		return 0;
	}
	
	var dtext = "";
	var dctext = "";
	var oddeven = "";
	
	for(var i=0; i<jd.users.length; i++)
	{
		if(i % 2 == 0) oddeven = "odd";
		else oddeven = "even";
		//dctext = "<div class='menug_item' style='float: left;'><div class='chatbox_pic' style=\"background: url('data/u" + jd.users[i].lid + "/dp/3.jpg'); margin: 4px 8px 4px 3px;\"></div><div style='padding-top: 3px;'><div class='idefusername'>" + jd.users[i].name + "</div><div class='idefuserdsc'>" + jd.users[i].dsc + "</div></div></div>";

		/* friends */
		var mfs = "";
		
		if(jd.users[i].ifr == 1) /* is friend? */
		{
			dctext = "<div data-uloc='pu" + jd.users[i].uid + "' id='mppksearch_person_pdbid" + i + "' class='friendsearch_person friendsearch_" + oddeven + "'><a href='pu" + jd.users[i].uid + "'><div class='friendsearch_dpb'><div class='friendsearch_dp'><div class='boxpic'><img src='data/u" + jd.users[i].lid + "/dp/2.jpg' onerror='failsafe_img(this, 2)'/></div></div></div><div class='friendsearch_mb'>" +
				 "<div class='friendsearch_pn'>" + jd.users[i].name + "</div>" +
				 "<div class='friendsearch_pd'>" + jd.users[i].dsc + "&nbsp;</div></a>" +
				 "<div class='friendsearch_bx'>" +
					"<div class='fsbx_btn' onclick=\"javascript: fsendmessage('" + jd.users[i].uid + "'); shset_hide('friendsearchfull', 1);\" title='Send a private message to " + jd.users[i].fn + "'> <div class='fsbx_btnm2'></div></div>" + 
					"<div class='fsbx_btn' onclick=\"javascript: shset_show('newpostfull', 1);\" title='Post something on " + jd.users[i].fn + "&#39;s profile'> <div class='fsbx_btnm3'></div></div>" + 
					"<div class='fsbx_btn' onclick=\"javascript: showhide_chat('chatbox'); shset_hide('friendsearchfull', 1);\" title='Start chatting with " + jd.users[i].fn + "'> <div class='fsbx_btnm4'></div></div>" + 
					"<a href='pu" + jd.users[i].uid + "'><div class='fsbx_btn' onclick=\"javascript: shset_hide('friendsearchfull', 1);\" title='View " + jd.users[i].fn + "&#39;s posts'> <div class='fsbx_btnm5'></div></div></a>" + 
					"<a href='bu" + jd.users[i].uid + "'><div class='fsbx_btn' onclick=\"javascript: shset_hide('friendsearchfull', 1);\" title='Read " + jd.users[i].fn + "&#39;s Blog'>  <div class='fsbx_btnm6'></div></div></a>" + 
				 "<div style='clear:both;'></div></div><div style='clear:both;'></div></div></div>";
		}else{ 
			
			/* other people */
			if(jd.users[i].mf > 1)
				mfs = jd.users[i].mf + " Mutual Friends";
			else if(jd.users[i].mf == 1)
				mfs = "1 Mutual Friend";
			else
				mfs = "&nbsp;";
			
			dctext = "<div data-uloc='u" + jd.users[i].uid + "' id='mppksearch_person_pdbid" + i + "' class='friendsearch_person friendsearch_" + oddeven + "'><a href='u" + jd.users[i].uid + "'><div class='friendsearch_dpb'><div class='friendsearch_dp'><div class='boxpic'><img src='data/u" + jd.users[i].lid + "/dp/2.jpg' onerror='failsafe_img(this, 2)'/> </div></div></div><div class='friendsearch_mb'>" +
				 "<div class='friendsearch_pn'>" + jd.users[i].name + "</div>" +
				 "<div class='friendsearch_pd'>" + jd.users[i].dsc + "&nbsp;</div></a>" +
				 "<div class='friendsearch_bx'>" +
					"<div class='fsbx_btn'><div class='fsbx_btnm1'></div></div>" +
					"<div class='fsbx_btn'><div class='fsbx_btnm2'></div></div>" +
					"<div class='fsbx_mf'>" + mfs + "</div>" +
				 "<div style='clear:both;'></div></div><div style='clear:both;'></div></div></div>";
		
		}
		
		dtext += dctext;
	}
	
	var minput = $("friendspanelsearchinput");
	
	minput.setAttribute('data-ppcount', jd.users.length);
	minput.setAttribute('data-ppindex', -1);
	
	dtext += "</div>";
	
	moutput.innerHTML = dtext;
}



/* marking section */

var markbox_lastobj = 0;

function markbox_show(pobj)
{
	var o = $('popupcard_mark');
	
	
	
	markbox_lastobj = pobj;
	
	var ppos = getposabs(pobj);
	
	o.style.left = '0px';// ppos[0] + 'px';
	o.style.top = (pobj.offsetHeight + 7) + 'px';//ppos[1] + pobj.offsetHeight + 2 + 'px';
	
	var cumarkarray = new Array(pobj.getAttribute('data-ua'), pobj.getAttribute('data-ub'), pobj.getAttribute('data-uc'), pobj.getAttribute('data-ud'), pobj.getAttribute('data-ue'));
	
	if(cumarkarray[0] != "0")cumarkarray[0] = "style='background: #feeede;'"; else cumarkarray[0] = "";
	if(cumarkarray[1] != "0")cumarkarray[1] = "style='background: #feeede;'"; else cumarkarray[1] = "";
	if(cumarkarray[2] != "0")cumarkarray[2] = "style='background: #feeede;'"; else cumarkarray[2] = "";
	if(cumarkarray[3] != "0")cumarkarray[3] = "style='background: #feeede;'"; else cumarkarray[3] = "";
	if(cumarkarray[4] != "0")cumarkarray[4] = "style='background: #feeede;'"; else cumarkarray[4] = "";
	
	o.innerHTML = "<ul><li " + cumarkarray[0] + " onclick='markbox_mark(1);' title='Like'><div class='bmarkicon_box' style='background-position: -64px -19px; margin: 6px 0 0 10px;'></div>" + pobj.getAttribute('data-a') + "</li>" +
				      "<li " + cumarkarray[1] + " onclick='markbox_mark(2);' title='Meh'> <div class='bmarkicon_box' style='background-position: 0px -20px; margin: 6px 0 0 10px;'></div>" +    pobj.getAttribute('data-b') + "</li>" + 
				      "<li " + cumarkarray[2] + " onclick='markbox_mark(3);' title='Cool'><div class='bmarkicon_box' style='background-position: -17px -18px; margin: 6px 0 0 10px;'></div>" + pobj.getAttribute('data-c') + "</li>" +
				      "<li " + cumarkarray[3] + " onclick='markbox_mark(4);' title='Haha'><div class='bmarkicon_box' style='background-position: -32px -19px; margin: 6px 0 0 10px;'></div>" + pobj.getAttribute('data-d') + "</li>" +
				      "<li " + cumarkarray[4] + " onclick='markbox_mark(5);' title='Love'><div class='bmarkicon_box' style='background-position: -49px -18px; margin: 6px 0 0 10px;'></div>" + pobj.getAttribute('data-e') + "</li></ul>";

	pobj.parentNode.style.position = 'relative';
	var ni = pobj.parentNode.appendChild(o);
	//ni.style.visibility = "visible";

	show_mitem("popupcard_mark");
}

function markbox_mark(mmode)
{
	var mv = "";
	var puid = "";

	if(!markbox_lastobj) return 0;
	
	switch(mmode)
	{
	case 1:
		mv = "a";
		break;
	case 2:
		mv = "b";
		break;
	case 3:
		mv = "c";
		break;
	case 4:
		mv = "d";
		break;
	case 5:
		mv = "e";
		break;
	default:
		return 0;
	}
	
	mvu = "data-u" + mv;
	mv = "data-" + mv;
	
	puid = markbox_lastobj.getAttribute('data-nid');
	if(!puid) return 0;
	
	

	if(markbox_lastobj.getAttribute(mvu) == "0")
	{
		markbox_lastobj.setAttribute(mvu, "1");
		markbox_lastobj.setAttribute(mv, parseInt(markbox_lastobj.getAttribute(mv)) + 1);
		
		markbox_setmark(puid, 0, mmode, 1);
	}else{
		markbox_lastobj.setAttribute(mvu, "0");
		markbox_lastobj.setAttribute(mv, parseInt(markbox_lastobj.getAttribute(mv)) - 1);
		
		markbox_setmark(puid, 0, mmode, 0);
	}
		
	hide_mitem("popupcard_mark");
	
	markbox_update(markbox_lastobj);
}

function markbox_update(pobj)
{
	var nn = pobj.getAttribute('data-attch');
	if(!nn) return 0;
	
	var o = $(nn);
	if(!o) return 0;

	var cmarkvals = "";
	var cmarkarray = new Array(pobj.getAttribute('data-a'), pobj.getAttribute('data-b'), pobj.getAttribute('data-c'), pobj.getAttribute('data-d'), pobj.getAttribute('data-e'));
			
	if(cmarkarray[0] != 0) cmarkvals += " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -64px -19px;'></div> " + cmarkarray[0] + "<a>";
	if(cmarkarray[1] != 0) cmarkvals += " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position:  0px  -20px;'></div> " + cmarkarray[1] + "<a>";
	if(cmarkarray[2] != 0) cmarkvals += " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -17px -18px;'></div> " + cmarkarray[2] + "<a>";
	if(cmarkarray[3] != 0) cmarkvals += " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -32px -19px;'></div> " + cmarkarray[3] + "<a>";
	if(cmarkarray[4] != 0) cmarkvals += " . <a class='boxc_marksp'><div class='boxc_markspi' style='display: inline-block; background-position: -49px -18px;'></div> " + cmarkarray[4] + "<a>";

	o.innerHTML = cmarkvals;
}

function markbox_setmark(puid, noteid, marktype, onoff)
{
	ajax_post("php/tasks/setmark.php?id=" + puid + "&m=" + marktype + "&o=" + onoff, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText)
			{
			}
		}
	
	});
}


function show_popup_align(parentobj, popupobj)
{
	var xypos = getposabs(parentobj);
	var tmode = 0;

	if(!xypos) return 0;
	
	popupobj.style.left = xypos[0] + 'px';

	if((xypos[1] - 100)  < 0)
	{
		popupobj.style.top = (xypos[1] + parentobj.offsetHeight + 0) + 'px';
		tmode = 1; /* top left */
	}else{
		popupobj.style.top = (xypos[1]) + 'px';
		tmode = 2; /* bottom left */
	}	

	if((xypos[0] + 240) > g_win_width)
	{
		popupobj.style.left = (xypos[0] - 220) + 'px';
		
		if(tmode == 1) tmode = 4;
		else tmode = 3;
	}
	
	return tmode;
}

function friendsearch_showpopup(pobj, smode, fcallback)
{
	show_popup_align(pobj, $('quicksearchbox'));
	show_mitem('quicksearchbox');

	var minput = $("mquickfsearch_input");
	var moutput = $("mquickfsearch_content");
	
	minput.value = "";
	moutput.innerHTML = "";
	minput.focus();
	
	minput.onkeyup = function(e)
	{
		e = e || event;
		//if (e.keyCode === 13 && !e.shiftKey) {
			friendsearchbox_searchcached(minput.value, minput, moutput, fcallback);
		//	show_popup_align(pobj, $('quicksearchbox'));
		//}
		return true;
	}
}

function friendsearch_hidepopup()
{
	$("mquickfsearch_content").innerHTML = "";
	hide_mitem('quicksearchbox');
}



/* album view */


function fc_post_expand_album_old(uid, albumid, photoid, postuid)
{

	ajax_post("php/tasks/getalbumdetails.php?uid=" + uid + "&albid=" + albumid + "&photoid=" + photoid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText)
			{

				var calbdetals = {};
				calbdetals = JSON.parse(xmlhttp.responseText);
				if(!calbdetals) return 0;
				
				$('spwdvdp').style.background = "url('data/u" + calbdetals.ulid + "/dp/2.jpg')";

				$('spwdvtitle').innerHTML     = calbdetals.aname;
				$('spwdvdsc').innerHTML       = calbdetals.dsc;
				$('spwdvuname').innerHTML     = calbdetals.uname;
				
				var fi = -1;
	
				for(var i=0; i<calbdetals.pset.length; i++)
				{
					if(calbdetals.pset[i].id == (photoid))
					{
						fi = i;
						break;
					}
				}
				
				if(fi < 0) return 0;
				
				general_photoset = calbdetals.pset;
				general_photoset_inuse = 1;
				
				post_expand_photoset(fi - 1, calbdetals.pset.length);
				
				ajax_post("php/pages/getnotes.php?pid=" + postuid, function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200)
				{
					if(xmlhttp.responseText)
					{
						$('spw_edt').innerHTML = xmlhttp.responseText;
						synctime_set($('spw_edt'));
					}
				}
				});
				
				
				
				
				
			}
		}
		});
	
	

}

function general_photolist_getphoto(pid)
{
	if(!general_photoset) return 0;

	if(pid < 0) return 0;
	else if(pid >= general_photoset.length) return 0;
	
	var opdb = $('pmmd_pdb');
	var wvalue = "";
	
	//if(opdb)
	{
		wvalue = "width='" + g_photoviewer_w + "px'";//opdb.offsetWidth + "px'";
	}
	/*if(g_photoviewer_w && g_photoviewer_h)
	{
		if(g_photoviewer_w <= g_photoviewer_h)
			wvalue = "width='" + g_photoviewer_w + "px'";
		else
			wvalue = "height='" + g_photoviewer_h + "px'";
	}*/
	
	return "<div class=\"pmmd_photo\"><img onerror='failsafe_imgphoto(this, 1);' id='pmmdimg_" + (pid + 1) + "' " + wvalue + " src=\"" + general_photoset[pid].fn + "\"/></div>";
}

function general_photolist_getphotocache(pid)
{
	if(!general_photoset) return 0;

	if(pid < 0) return 0;
	else if(pid >= general_photoset.length) return 0;

	return "<div class='pmmdtcimgout'><img id='pmmdtcimg_" + (pid + 1) + "' src=\"" + general_photoset[pid].fn + "\" width='120px'/></div>";
}

function general_photolist_getpostid(pid)
{
	if(!general_photoset) return 0;

	if(pid < 0) return 0;
	else if(pid >= general_photoset.length) return 0;
	
	return general_photoset[pid].postid;
}

/* reposts */


function repost_publish_send(touser, opuid, oppid)
{
	ajax_post("php/tasks/repost.php?u=" + touser + "&opu=" + opuid + "&opp=" + oppid, function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText)
				{
					alert(xmlhttp.responseText);
				}
			}});
}


function repost_publish(touser, opuid, oppid, oppobjid)
{
	var obdata = "";
	var obwidth = 410;
	
	if(oppobjid)
	{
		var o = $(oppobjid);
		if(o)
		{
			obdata = o.innerHTML;
			var t = o.offsetWidth;
			if(t) obwidth = t;
		}
	}
	show_gendialog(0, 	"<div style='top: -30px'><div class='dialogbox_inputsettings' style='color: #999999; width: 430px'>My Profile</div>" +
						"<div class='dialogbox_inputsettings' style='color: #656565; width: 430px'>Your voice, your eyes, your hands, your lips... <br/>Our silences, our words. Light that goes, light that returns</div>" + 
						"<div class='dialogbox_inputbox' style='height: 175px; width: 410px; padding: 10px; background: #f7f9fb;'><center><div style='width: " + obwidth + "px'>" + obdata + "</center></div></div></div>", "Share Post <span style='font-weight: normal'>to</span>", 0);
}

/* filters */

function feed_set_filter(fmodestr)
{
	$("divdatasetfeed").setAttribute("data-lftimeid", 0);
	feedc_loadmore_ex(0, -1, fmodestr);
}

function feedc_filter_switch(section, id)
{
	var fid = "feedcfilos" + section + "_" + id;
	var o = $(fid);
	var fmodestr = "";
	
	var fmode_main = '-';
	var fmode_filter = '-';
	var fmode_collapse = '-';
	var fmode_network = '-';
	var fmode_location = '-';
	
	if(!o) return 0;
	
	var objfeed = $("feedc_pomiddleb");
	if(!objfeed) return 0;
	
	objfeed.innerHTML = get_preloader(32, 150);
	
	switch(section)
	{
	case 1: /* feed mode */
	
		fmode_main = id;
		
		for(var i=1; i<=3; i++)
		{
			var nnfid = "feedcfilos" + section + "_" + i;
			var nno = $(nnfid);
			
			if(!nno) break;
			
			if(id == i)
			{
				nno.className = "feedc_filtersection feedc_filtersel";
				nno.setAttribute('data-fs', 1);
			}else{
				nno.className = "feedc_filtersection";
				nno.setAttribute('data-fs', 0);
			}
		}
		break;
		
	case 2: /* feed filter */
		if(id == 1)
		{
			o.className = "feedc_filtersection feedc_filtersel";
			o.setAttribute('data-fs', 1);
			
			fmode_filter = "0";
		
			for(var i=2; i<=7; i++)
			{
				var nnfid = "feedcfilos" + section + "_" + i;
				var nno = $(nnfid);
				
				if(!nno) break;
				
				nno.className = "feedc_filtersection";
				nno.setAttribute('data-fs', 0);
			}

		}else{
		
			var nnfid = "feedcfilos" + section + "_1";
			var nno = $(nnfid);
			
			fmode_filter = "";

			if(!nno) break;
			
			nno.className = "feedc_filtersection";
			nno.setAttribute('data-fs', 0);
			
			if(o.getAttribute('data-fs') == 1)
			{
				o.className = "feedc_filtersection";
				o.setAttribute('data-fs', 0);
			}else{
				o.className = "feedc_filtersection feedc_filtersel";
				o.setAttribute('data-fs', 1);
			}
			
			
			for(var i=2; i<=7; i++)
			{
				var nito = $("feedcfilos" + section + "_" + i);
				if(!nito) break;
				if(nito.getAttribute('data-fs') == 1) fmode_filter = fmode_filter + "1"; else fmode_filter = fmode_filter + "0";
			}
		}
		break;
		
	case 3: /* collapse */
		fmode_collapse = id;
		
		for(var i=1; i<=2; i++)
		{
			var nnfid = "feedcfilos" + section + "_" + i;
			var nno = $(nnfid);
			
			if(!nno) break;
			
			if(id == i)
			{
				nno.className = "feedc_filtersection feedc_filtersel";
				nno.setAttribute('data-fs', 1);
			}else{
				nno.className = "feedc_filtersection";
				nno.setAttribute('data-fs', 0);
			}
		}
		break;
		
	case 4: /* network */
		if(o.getAttribute('data-fs') == 1)
		{
			o.className = "feedc_filtersection";
			o.setAttribute('data-fs', 0);
		}else{
			o.className = "feedc_filtersection feedc_filtersel";
			o.setAttribute('data-fs', 1);
		}
		break;
		
	case 5: /* feed filter */
	
		if(id == 1)
		{
			o.className = "feedc_filtersection feedc_filtersel";
			o.setAttribute('data-fs', 1);
		
			for(var i=2; i<=7; i++)
			{
				var nnfid = "feedcfilos" + section + "_" + i;
				var nno = $(nnfid);
				
				if(!nno) break;
				
				nno.className = "feedc_filtersection";
				nno.setAttribute('data-fs', 0);
			}

		}else{
			var nnfid = "feedcfilos" + section + "_1";
			var nno = $(nnfid);
			
			if(!nno) break;
			
			nno.className = "feedc_filtersection";
			nno.setAttribute('data-fs', 0);
			
			if(o.getAttribute('data-fs') == 1)
			{
				o.className = "feedc_filtersection";
				o.setAttribute('data-fs', 0);
			}else{
				o.className = "feedc_filtersection feedc_filtersel";
				o.setAttribute('data-fs', 1);
			}
		}
		break;
	}
	
	return feed_set_filter(fmode_main + "," + fmode_filter + "," + fmode_collapse+ "," + fmode_network + "," + fmode_location);
}

/* autocomplete boxes */


function autocomplete_box_setpos(obj)
{
	var o = $('tagcomplete_box');
	
	if(!o || !obj) return 0;
	
	o.style.bottom = "auto";
	obj.parentNode.appendChild(o);
}

function autocomplete_box_setpos_top(obj)
{
	var o = $('tagcomplete_box');
	
	if(!o || !obj) return 0;
	o.style.bottom = obj.offsetHeight + 44 + "px";
	obj.parentNode.appendChild(o);
}



/* blog ---------------------------------------------------------- */



function blog_fadein_bcontrols(obj, cname)
{
	var o = obj.firstChild;
	alert(o[0]);
	if(hidelastone)
	{
		if(fadeitem_last == o) return;
		
		if(fadeitem_last)
		{
			$(fadeitem_last).style.visibility = "hidden";
			fadeitem_last = 0;
		}
		
		fadeitem_last = o;
	} 
	
	
	if(o) fadein(o);
} 

function blog_photo_center(o)
{
	o.style.marginTop = -(o.offsetHeight/2 - 389/2) + 'px';
	fadein(o);
	//o.style.visibility = "visible";
}



/* feed search */

function userpost_search_show(uid)
{
	show_mitem('quicksearch_feed');
	var minput = $("quicksearch_feed_input");
	
	if(!minput) return 0;
	
	minput.value = "";
	minput.focus();
	
	var mkeyaction = function()
	{
		var objfeed = $("feedc_pofull");
		if(!objfeed) return 0;
		
		var o;
		
		o = $('feed_msgf_text'); if(o) o.innerHTML = "Search results for '" + minput.value + "'";
		o = $('feed_msgf'); if(o) o.style.display = '';
		
		objfeed.style.display = 'none';
		$('feedc_pomiddleb').innerHTML = "";
		$('feedc_pomiddlebr').innerHTML = "";
		$("feedc_ponotice").innerHTML = get_preloader(32, 150);
		
		$("divdatasetfeed").setAttribute("data-lfid", 0);
		feedc_loadmoredual_ex(uid, 0, minput.value);

		hide_mitem('quicksearch_feed');
		return true;
	}
	
	minput.onkeyup = function(e)
	{
		e = e || event;
		if (e.keyCode === 13 && !e.shiftKey) { mkeyaction(); }
		return true;
	};
	
	
	var msbox = $('quicksearch_feed_sbox');
	if(msbox)
	{
		msbox.onclick = function(e)
		{
			mkeyaction();
			return true;
		}
	}
}


function feedsearch_show()
{
	show_mitem('quicksearch_feed');
	var minput = $("quicksearch_feed_input");
	
	if(!minput) return 0;
	
	minput.value = "";
	minput.focus();
	
	
	var mkeyaction = function()
	{
		var objfeed = $("feedc_pomiddleb");
		if(!objfeed) return 0;
		
		var o;
		
		o = $('feed_msgf_text'); if(o) o.innerHTML = "Search results for '" + minput.value + "'";
		o = $('feed_msgf'); if(o) o.style.display = '';
		
		objfeed.innerHTML = get_preloader(32, 150);
		
		$("divdatasetfeed").setAttribute("data-lftimeid", 0);
		feedc_loadmore_ex(0, minput.value);

		hide_mitem('quicksearch_feed');
		return true;
	}
	
	minput.onkeyup = function(e)
	{
		e = e || event;
		if (e.keyCode === 13 && !e.shiftKey) { mkeyaction(); }
		return true;
	}
	
	var msbox = $('quicksearch_feed_sbox');
	if(msbox)
	{
		msbox.onclick = function(e)
		{
			mkeyaction();
			return true;
		}
	}
}

function userpost_search_restore(uid)
{
	var o;
	
	o = $("feedc_pomiddleb"); if(o) o.innerHTML = "";
	o = $("feedc_pomiddlebr"); if(o) o.innerHTML = "";
	o = $('feed_msgf'); if(o) o.style.display = 'none';		
	o = $('feed_msgf_text'); if(o) o.innerHTML = "";
	
	$("divdatasetfeed").setAttribute("data-lfid", 0);
	
	feedc_loadmoredual_ex(uid, 0, 0);
}


function feedsearch_restore()
{
	var o;
	
	o = $("feedc_pomiddleb"); if(o) o.innerHTML = "";
	o = $('feed_msgf'); if(o) o.style.display = 'none';		
	o = $('feed_msgf_text'); if(o) o.innerHTML = "";
	
	$("divdatasetfeed").setAttribute("data-lftimeid", 0);
	
	feedc_loadmore_ex(0, 0);
}


/* add people to new post and geolocations stuff */

function newpost_addpeopleinit(obj)
{
	if(obj.getAttribute('data-tinit') != "1")
	{
		obj.innerHTML = "";
		obj.setAttribute('data-tinit', 1);
	}
	
	autocomplete_box_setpos(obj);
	tokenized_init_usertag(obj, function(e)
		{
			e = e || event;
			if (e.keyCode === 13 && !e.shiftKey) {
				
			}
			return true;
		});
		
	obj.focus();
}

function newpost_addlocinit(obj)
{
	if(obj.getAttribute('data-tinit') != "1")
	{
		obj.innerHTML = "";
		obj.setAttribute('data-tinit', 1);
	}
	
	autocomplete_box_setpos(obj);
	tokenized_init_loctag(obj, function(e)
		{
			e = e || event;
			if (e.keyCode === 13 && !e.shiftKey) {
				
			}
			return true;
		});
		
	obj.focus();
}


/* send-message box */


function sendmsgbox_addfriend(fid, uname, udsc, ulid)
{
	var picbox = $('sendmsgbox_picuser');
	if(!picbox) return 0;
	
	uname = uname.replace(/%20/g,' ');
	
	sendmessage_userlist.push(fid);
	
	picbox.innerHTML += "<div class='sendmsgboxpic' title='" + uname + "'><img src='data/u" + ulid + "/dp/2.jpg' onerror='failsafe_img(this, 2);'/></div>";

	hide_mitem('quicksearchbox');
}

function sendmsgbox_send()
{
	var picbox = $('sendmsgbox_picuser');
	var textvalue = $('newmsg_txt');
	if(!picbox) return 0;
	if(!textvalue) return 0;
	
	var userlist = "";
	var i;
	
	for(i=0; i<sendmessage_userlist.length; i++)
	{
		if(i > 0) userlist = userlist + ",";
		userlist = userlist + sendmessage_userlist[i];
	}
	
	textvalue = textvalue.value;
	
	ajax_postbig("php/tasks/newmsg.php?u=" + userlist, "m", textvalue.replace(/\n\r?/g, '[-n-l-]'), function(){
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		if(xmlhttp.responseText)
		{
			nstatus_display("Your message has been sent.");
			hide_item('sendmsgbox_full');
		}
	}
	});
	
}


function fsendmessage(touser, ulocid, uname)
{
	fadein_item('sendmsgbox_full', false);
	
	if(!ulocid || !uname) return 0;
	
	var picbox = $('sendmsgbox_picuser');
	if(!picbox) return 0;
	
	sendmessage_userlist = [];
	sendmessage_userlist.push(touser);
	
	picbox.innerHTML = "<div class='sendmsgboxpic' title='" + uname + "'><img src='data/u" + ulocid + "/dp/2.jpg' onerror='failsafe_img(this, 2);'/></div>";
}

/* unbind child eliments that are just there temporarily
   probably on a page close */
   
function unbind_boxes()
{
	var o;
	var cowner = $("unbind_owner");
	
	if(!cowner) return 0;
	
	o = $("tagcomplete_box"); cowner.appendChild(o);
	
	return 1;
}


/* full photo display */

function fullphoto_show()
{
	$('pbf_out').style.display = "";
	$('pbf_out').onclick = fullphoto_close();
	
	$('pbf_ct').style.display = "";
}

function fullphoto_close()
{
	$('pbf_out').style.display = "none";
	$('pbf_ct').style.display = "none";
}

function fullphoto_fullscreen()
{
	var elem = document.querySelector(document.webkitCancelFullScreen ? "#pbf_ct_out" : "#pbf_ct_inner");
  //elem.onwebkitfullscreenchange = onFullScreenEnter;
  //elem.onmozfullscreenchange = onFullScreenEnter;
  elem.style.background = '#000000';
  
  $('pbf_ns').style.display = "none";
  $('pbf_ns').className = 'pbf_ns floating';

  
  elem.onmousemove = function(e)
  {
	if(e.clientX > g_win_width - 450)
		$('pbf_ns').style.display = "";
	else
		$('pbf_ns').style.display = "none";
  };
  if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    elem.mozRequestFullScreen();
  }
}

function fullphoto_fullscreen_exit()
{
	$('pbf_out').style.display = "none";
	$('pbf_ct').style.display = "none";
}



/* album view */

function fc_post_expand_album(uid, albumid, photoid, postuid)
{

	ajax_post("php/tasks/getalbumdetails.php?uid=" + uid + "&albid=" + albumid + "&photoid=" + photoid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText)
			{

				var calbdetals = {};
				calbdetals = JSON.parse(xmlhttp.responseText);
				if(!calbdetals) return 0;
				
				$('pbf_pinfo_dp').innerHTML = "<img src='data/u" + calbdetals.ulid + "/dp/1.jpg' width='58px' onerror='failsafe_img(this, 2);'/>";
				$('pbf_pinfo_tuser').innerHTML		= calbdetals.uname;
				$('pbf_pinfo_ttitle').innerHTML		= calbdetals.aname;
				$('pbf_pinfo_tloc' ).innerHTML		= calbdetals.loc;
				
				$("pmmd_pdb").onmousemove = fullphoto_view_onmouse;
				
				var fi = -1;
	
				for(var i=0; i<calbdetals.pset.length; i++)
				{
					if(calbdetals.pset[i].id == (photoid))
					{
						fi = i;
						break;
					}
				}
				
				if(fi < 0) return 0;
				
				general_photoset = calbdetals.pset;
				general_photoset_inuse = 1;
				general_photoset_lastid = fi;
				
				$('pbf_out').style.display = '';
				$('pbf_ct').style.display = '';
				
				general_photoview_pic = 'pbf_pic';
				
				var objpic = $(general_photoview_pic);
				
				set_opacity($('pbf_pic2'), 0);
				$('pbf_pic2').innerHTML = "";
				
				objpic.innerHTML = general_photolist_getpbf(fi, objpic.offsetWidth, g_win_height - g_win_ctop);
				set_opacity(objpic, 100);
				
				pmmd_cacheimages(general_photoview_pic);
				
				
				/* set tagging buttons */
				
				$('ptgbtagview').onclick = function(e){ptg_splist(); e.stopPropagation();};
				$('ptgbtagstart').onmousedown = function(e){pmmd_switchtagmode(3); e.stopPropagation();};
				$('ptgbtagedit').onclick = function(e){e.stopPropagation();};
				$('ptgbtageffects').onclick = function(e){photoeffects_showmenu($('ptgbtageffects'), general_photoview_pic); e.stopPropagation();};
				
				pmmd_available = 1;
				post_view_type_photo = 1;
				
				//$(general_photoview_pic).style.height = $(general_photoview_pic).parentNode.offsetHeight + "px";
				
				$('pbf_thumbs_o').style.width = objpic.offsetWidth + "px";
				
				current_photo_postid = general_photolist_getpostid(general_photoset_lastid);
				
				fullphoto_setthumbnails()
				
				ajax_post("php/pages/getnotes.php?style=2&appendtags=1&pid=" + current_photo_postid, function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200)
				{
					if(xmlhttp.responseText)
					{
						var sloc = xmlhttp.responseText.indexOf(':');
						var nstr = xmlhttp.responseText.substr(0, sloc);
						var snoteslength = parseInt(nstr);
						var notesstr = xmlhttp.responseText.substr(sloc + 1, snoteslength);
						var tagstr = xmlhttp.responseText.substr(sloc + snoteslength + 2);
					
						
						$('pbf_nsn').innerHTML = notesstr;
						synctime_set($('pbf_nsn'));
						fullphoto_notebutton("pcd" + general_photolist_getpostid(general_photoset_lastid), 0);
						
						/* tagstr: tag id, user id, text, x, y, time */
						fullphoto_settags(tagstr);
						ptg_splist();
					}
				}
				});
				
				
				
				
				
			}
		}
		});
	
	

}

function fullphoto_setthumbnails()
{
	var pto = $('pbf_thumbs_o');
	var ob = "";
	
	var i = general_photoset_lastid - 2;
	var m = general_photoset_lastid + 2;
	
	if(i<0)i=0;
	if(m >= general_photoset.length) m = general_photoset.length;
	
	for(var j=i;j<m; j++)
	{
		ob += "<div class='pbf_thumb'><img  width='183;' id='fullphviewer_thumb_" + j + "' src='" + general_photolist_getfn(j, 1) + "'/></div>";
	}
	
	pto.innerHTML = ob + "<div style='clear: both;'></div>";
	
	for(var j=i;j<m; j++)
	{
		var o = $("fullphviewer_thumb_" + j);
		if(o)
		{
			o.onclick = function(e){fc_post_switch_photo_quick(j); e.stopPropagation();};
		}
	}
	
}


function fullphoto_view_onmouse(e)
{
	ptg_move();

	var x = e.clientX, y = e.clientY;
	
	if(e.clientY > g_win_height - 200)
	{
		$('pbf_thumbs_o').style.display = "";
		
		if(!fc_post_switch_photo.pbfinfoactive)
			set_opacity($('pbf_pinfo'), 0);
			
	}else if(e.clientY < 80){
	
		$('pbf_thumbs_o').style.display = "none";
		set_opacity($('pbf_pinfo'), 100);
		
	}else{
		$('pbf_thumbs_o').style.display = "none";
		
		if(!fc_post_switch_photo.pbfinfoactive)
			set_opacity($('pbf_pinfo'), 0);
	}
	
	if(x > $('pmmd_pdb').offsetWidth / 2)
		fc_post_switch_photo.switchback = 0;
	else
		fc_post_switch_photo.switchback = 1;
}

function general_photolist_getpbf(pid, mw, mh)
{
	if(!general_photoset) return 0;

	if(pid < 0) return 0;
	else if(pid >= general_photoset.length) return 0;

	var cw = "";
	var ch = "";
	
	if(general_photoset[pid].w > mw)
		cw = "width='" + mw + "px'";
		
	if(mh)
	{
		if(general_photoset[pid].h > mh)
			ch = " height='" + mh + "px'";
	}
	
	return "<img style='margin-top: 10px;' onload='general_photoview_photoinit(this, " + mw + ", " + mh + ");' onerror='failsafe_imgphoto(this, 1);' " + cw + ch + " id='pmmdimg_1' src='" + general_photoset[pid].fn + "'/>";

}

function general_photolist_getfn(pid, thumb)
{
	if(!general_photoset) return 0;

	if(pid < 0) return 0;
	else if(pid >= general_photoset.length) return 0;

	if(thumb)
	{
		return general_photoset[pid].fnt;
	}else{
		return general_photoset[pid].fn;
	}
}

function general_photoview_photoinit(obj, mw, mh)
{
	if(!obj || !mw) return;
	
	if(!mh)
	{
		if(obj.offsetWidth > mw) obj.style.width = mw + "px";
	}else{
	
		if(obj.offsetWidth > mw || obj.offsetHeight > mh)
		{
			var iar = obj.offsetHeight / obj.offsetWidth, car = mh / mw;
		
			if(iar>car) 
			{ 
				obj.style.height = mh + "px"; 
			}else{ 
				obj.style.width = mw + "px";	
			}
		}
	}
	
	obj.style.marginTop = -(obj.offsetHeight/2 - obj.parentNode.offsetHeight/2) + 'px';
	
	fadein(obj.parentNode);
}

function fc_post_switch_photo_quick(n)
{
	fc_post_switch_photo.switchback = 0;
	//general_photoset_lastid = n + 1;
	fc_post_switch_photo($('pmmd_pdb'));
}

function fc_post_switch_photo(obj)
{
	if(pmmd_tagging_enabled) return 0;
	
	if(fc_post_switch_photo.switchback)
	{
		if(general_photoset_lastid >= 1)
			general_photoset_lastid--;
		else
			return 0;
	}else{
		if(general_photoset_lastid < general_photoset.length - 1)
			general_photoset_lastid++;
		else
			return 0;
	}
		
	if(general_photoview_pic == 'pbf_pic')
	{
		general_photoview_pic = 'pbf_pic2';
	
		$('pbf_pic').style.zIndex = 10;
		$(general_photoview_pic).style.zIndex = 0;
		
		fadeout($('pbf_pic'));
		
		set_opacity($(general_photoview_pic), 0);
		
	}else{
		general_photoview_pic = 'pbf_pic';
		
		$('pbf_pic2').style.zIndex = 10;
		$(general_photoview_pic).style.zIndex = 0;
		
		fadeout($('pbf_pic2'));
		
		set_opacity($(general_photoview_pic), 0);
	}
	
	
	//fadein($(general_photoview_pic));
	
	set_opacity($('pbf_pinfo'), 100);
	
	if(!fc_post_switch_photo.pbfinfoactive)
		setTimeout(function(){fadeout($('pbf_pinfo')); fc_post_switch_photo.pbfinfoactive = 0;}, 2000);
		
	fc_post_switch_photo.pbfinfoactive = 1;
	
	$(general_photoview_pic).innerHTML = general_photolist_getpbf(general_photoset_lastid, $(general_photoview_pic).offsetWidth,  g_win_height - g_win_ctop);
	//$(general_photoview_pic).style.height = $(general_photoview_pic).parentNode.offsetHeight + "px";
	
	pmmd_cacheimages(general_photoview_pic);
	
	$('pbf_thumbs_o').style.width = $(general_photoview_pic).offsetWidth + "px";
	
	
	$('pbf_nsn').innerHTML = "";
	
	current_photo_postid = general_photolist_getpostid(general_photoset_lastid);
	fullphoto_setthumbnails();
	
	ajax_post("php/pages/getnotes.php?style=2&appendtags=1&pid=" + general_photolist_getpostid(general_photoset_lastid), function(){
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		if(xmlhttp.responseText)
		{
			/* the result will be: <number: length of notes string>:<string: notes html>,<string: tags> (excluding < and >) */
			
			var sloc = xmlhttp.responseText.indexOf(':');
			var nstr = xmlhttp.responseText.substr(0, sloc);
			var snoteslength = parseInt(nstr);
			var notesstr = xmlhttp.responseText.substr(sloc + 1, snoteslength);
			var tagstr = xmlhttp.responseText.substr(sloc + snoteslength + 2);
		
			
			$('pbf_nsn').innerHTML = notesstr;
			synctime_set($('pbf_nsn'));
			fullphoto_notebutton("pcd" + general_photolist_getpostid(general_photoset_lastid), 0);
			
			/* tagstr: tag id, user id, text, x, y, time */
			fullphoto_settags(tagstr);
			ptg_splist();
		}
	}
	});
}

/*
 * jsonstr: [[tag id, user id, text, x, y, time]...]
 */
function fullphoto_settags(jsonstr)
{
	ptg_array = [];
	
	if(!jsonstr) return 0;
	
	var jm = {};
	jm = JSON.parse(jsonstr);
	
	if(!jm) return 0;
	
	
	var ptg_stag = [];
	
	for(var i=0; i<jm.length; i++)
	{
		ptg_stag = [];
		
		ptg_stag[0] = jm[i][3];
		ptg_stag[1] = jm[i][4];
		ptg_stag[2] = 0
		ptg_stag[3] = jm[i][2];
	
		ptg_array.push(ptg_stag);
	}
}

function fullphoto_notebutton(uid, sfocus)
{
	var setfocus = 0;
	
	if(sfocus == undefined)
	{
		setfocus = 1;
	}else{
		setfocus = sfocus;
	}
	
	/* add comment input */

	if(!$(uid + "aci"))
	{
		var o = $("pbf_wnote");

		autocomplete_box_setpos_top(o);
		tokenized_init_usertag(o, function(e)
			{
				e = e || event;
				if (e.keyCode === 13 && !e.shiftKey) {
					fc_comment_add(uid, o.innerHTML);
					/* clear text in write box only if ajax returns 1 */
				}
				return true;
			});
		
		if(setfocus)
			o.focus();
	}
}


/* availability */

function availability_color(mode)
{
	switch(mode)
	{
	case 0: return "efefef";  /* offline */
	case 1: return "99cc66";  /* online */
	case 2: return "ff6633";  /* busy */
	case 3: return "ffcc00";  /* away */
	case 4: return "999999";  /* hidden*/
	}
	return "efefef";
}

function availability_text(mode)
{
	switch(mode)
	{
	case 0: return "Offline";  /* offline */
	case 1: return "Online";  /* online */
	case 2: return "Busy";  /* busy */
	case 3: return "Away";  /* away */
	case 4: return "Hidden";  /* hidden*/
	}
	return "Offline";
}

function availability_set(mode)
{
	ajax_post("php/tasks/setavailability.php?v=" + mode, function(){
	if(xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		if(xmlhttp.responseText == "1")
		{
			$("chatntf_availability").style.background = "#" + availability_color(mode);
			$("chatntf_availabilitytxt").innerHTML = availability_text(mode);
			hide_mitem("menu_chat_availability");
		}
	}
	});
	
	
}




/* photo effects */

function photoeffects_showmenu(pitem, imgid)
{
	var v = "";
	
	v = "<ul><li onclick=\"photoeffects_apply('" + imgid + "', 1);\">Cinemascope</li>" + 
			"<li onclick=\"photoeffects_apply('" + imgid + "', 2);\">Retro</li>" + 
			"<li onclick=\"photoeffects_apply('" + imgid + "', 3);\">Black and White</li>" +
			"<li onclick=\"photoeffects_apply('" + imgid + "', 4);\">Focus</li></ul>";
			
	show_popupcard(v, pitem, 0, 1);
	show_feedpopup.cid = pitem;
}

function photoeffects_apply(imgid, fx)
{
	var canvas, ctx, img;
	var canvas_id = 'canvas_photofx';
	
    canvas = $(canvas_id);
	img = $(imgid).firstChild;
	
	if(!canvas) return 0;
	if(!img) return 0;
	
    ctx = canvas.getContext('2d');
	
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height);
    
	switch(fx)
	{
	case 1: image_fxpreset_cinemascope(canvas_id); break;
	case 2: image_fxpreset_retro(canvas_id); break;
	case 3: image_fxpreset_bnw(canvas_id); break;
	case 4: image_fxpreset_focus(canvas_id); break;
	}
	
	img.src = canvas.toDataURL('image/jpeg');
	
	hide_mitem("popupcard_main");
}














function feed_process(jval)
{
	var jc;
	
	
	/* showing new notifications */
	
	if(jval.newnotifications && !newnotifications_changed)
	{
		jc = jval.newnotifications;
		
		var objs = new Array();
		var objv = [-1, -1, -1, -1, -1];
		
		if(jc.friends)       objv[0] = jc.friends;
		if(jc.messages)      objv[1] = jc.messages;
		if(jc.tags)          objv[2] = jc.tags;
		if(jc.events)        objv[3] = jc.events;
		if(jc.notifications) objv[4] = jc.notifications;
		
		
		objs[0] = $("icon_new_friends");
		objs[1] = $("icon_new_messages");
		objs[2] = $("icon_new_tags");
		objs[3] = $("icon_new_events");
		objs[4] = $("icon_new_notifications");
				
		var i;
		
		for(i=0; i<5; i++)
		{
			if(objv[i] > -1)
			{
				if(objv[i] > 0)
				{
					objs[i].setAttribute("data-nvalue", objv[i]);
					objs[i].innerHTML = "<p>" + objv[i] + "</p>"
					objs[i].style.visibility = "visible";
				}else{
					objs[i].setAttribute("data-nvalue", 0);
					objs[i].innerHTML = "<p>" + objv[i] + "</p>"
					objs[i].style.visibility = "hidden";
				}
			}
		}
	}
	
	/* showing new conversation notifications */
	
	if(jval.newconversations)
	{
		chatc_clear();
		
		var hasntf = 0;
		
		var av = new Array(2, 1, 3, 0);
		
		for(var i=0; i<jval.newconversations.conversations.length; i++)
		{
			chatc_create(jval.newconversations.conversations[i].users, jval.newconversations.conversations[i].usersav, jval.newconversations.conversations[i].msgs, jval.newconversations.conversations[i].rid, jval.newconversations.conversations[i].cid, jval.newconversations.conversations[i].usersloc);
			if(jval.newconversations.conversations[i].msgs)
				hasntf = 1;
		}
		
		if(!is_window_active && (hasntf == 1))
			home_window_settitle("New Message", 1);
		
	}
	
	if(jval.newlines)
	{
		//if(is_window_active)
			chatv_refresh(jval.newlines, 1);
	}
	
	if(jval.chatlasttime)
	{
		chat_lastmsgtime = jval.chatlasttime;
	}
	
}




/* ------- */

function feed_init()
{
	if (window.XMLHttpRequest) feedxmlhttp=new XMLHttpRequest();
	else feedxmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}

function feed_update()
{
	var ntfdata = "";
	feedxmlhttp.onreadystatechange = feed_refresh;
	
	if(newnotifications_changed)
	{
		/* format - &ntf=1,2,3,4,5 */
		
		var objs = new Array();
		
		objs[0] = $("icon_new_friends");
		objs[1] = $("icon_new_messages");
		objs[2] = $("icon_new_tags");
		objs[3] = $("icon_new_events");
		objs[4] = $("icon_new_notifications");
		
		ntfdata = "&nntf="  + objs[0].getAttribute("data-nvalue") + ","
							+ objs[1].getAttribute("data-nvalue") + ","
							+ objs[2].getAttribute("data-nvalue") + ","
							+ objs[3].getAttribute("data-nvalue") + ","
							+ objs[4].getAttribute("data-nvalue");
	}
	
	
	feedxmlhttp.open("GET", "php/feed/feedb.php?r=" + chat_croomid + "&tm=" + chat_lastmsgtime + ntfdata, true);
	feedxmlhttp.send(null); 
	newnotifications_changed = 0;
}

function feed_refresh()
{
	if(feedxmlhttp.readyState==4 && feedxmlhttp.status==200)
	{
		var jm = {};
		jm = JSON.parse(feedxmlhttp.responseText);
		feed_process(jm);
	}
}
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
var dragitem_sx, dragitem_sy;
var dragitem_offsetX, dragitem_offsetY;
var dragitem_sel;

/*
 * xd, yd = 1 to move, xa, ya is the align blocks.
 */
function setitemdrag(item, xd, yd, xa, ya)
{
    //$(item).onmousedown = dragitem_mdown;
	$(item).addEventListener("onmousedown", dragitem_mdown, true);
    $(item).onmouseup = dragitem_mmove;
}

function dragitem_mdown(e)
{
	if (e == null) 
        e = window.event; 
alert('ohoaa');
    
    var target = e.target != null ? e.target : e.srcElement;

    if ((e.button == 1 && window.event != null || e.button == 0))
    {
        dragitem_sx = e.clientX;
        dragitem_sy = e.clientY;
        
        dragitem_offsetX = ExtractNumber(target.style.left);
        dragitem_offsetY = ExtractNumber(target.style.top);
        dragitem_sel = target;
        dragitem_sel.onmousemove = OnMouseMove;
        document.body.focus();
        document.onselectstart = function () { return false; };
        target.ondragstart = function() { return false; };
        return false;
	}
}

function dragitem_mmove(e)
{
    if (e == null) 
        var e = window.event; 
		
	dragitem_sel.style.left = (dragitem_offsetX + e.clientX - dragitem_sy) + 'px';
	dragitem_sel.style.top = (dragitem_offsetY + e.clientY - dragitem_sx)  + 'px';
}

function dragitem_mup(e)
{
	return 0;
}function message_expand(obj)
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
}var xmlhttp;

function ajax_post(value, schange)
{
	xmlhttp.open("POST", value, true);
	xmlhttp.send(null); 
	if(schange != 0)
	{
		if(schange == 1) /* show default box */
			xmlhttp.onreadystatechange = ajax_refresh_default;
		else
			xmlhttp.onreadystatechange = schange;
	}else{
		
		xmlhttp.onreadystatechange = ajax_refresh;
	}
}

function ajax_postbig(value, dk, dv, schange)
{
	xmlhttp.open("POST", value, true);
	dv = dk + "=" + encodeURIComponent(dv);
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlhttp.send(dv); 
	if(schange != 0)
	{
		if(schange == 1) /* show default box */
			xmlhttp.onreadystatechange = ajax_refresh_default;
		else
			xmlhttp.onreadystatechange = schange;
	}else{
		
		xmlhttp.onreadystatechange = ajax_refresh;
	}
}

function ajax_postjson(value, jm, schange)
{
	xmlhttp.open("POST", value, true);
	dv = "js=" + encodeURIComponent(JSON.stringify(jm));
	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlhttp.send(dv); 
	if(schange != 0)
	{
		if(schange == 1) /* show default box */
			xmlhttp.onreadystatechange = ajax_refresh_default;
		else
			xmlhttp.onreadystatechange = function(){schange(xmlhttp.readyState, xmlhttp.status, xmlhttp.responseText);};
	}else{
		
		xmlhttp.onreadystatechange = ajax_refresh;
	}
}

function ajax_refresh()
{
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		//alert(xmlhttp.responseText);
	}
}

function ajax_refresh_default()
{
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		nstatus_display(xmlhttp.responseText);
	}
}

function init_ajaxmain()
{
	
	if (window.XMLHttpRequest) xmlhttp=new XMLHttpRequest();
	else xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	
	xmlhttp.onreadystatechange = ajax_refresh;

}

var jsonp = {  
    currentScript: null,  
    get: function(url, callback) {
	  var data = {};
      var src = url + (url.indexOf("?")+1 ? "&" : "?");
      var head = document.getElementsByTagName("head")[0];
      var newScript = document.createElement("script");
      var params = [];
      var param_name = ""
	  
	  if(!callback)callback = function(){};

      this.success = callback;

      data["callback"] = "jsonp.success";
      for(param_name in data){  
          params.push(param_name + "=" + encodeURIComponent(data[param_name]));  
      }
      src += params.join("&")

      newScript.type = "text/javascript";  
      newScript.src = src;

      if(this.currentScript) head.removeChild(currentScript);
      head.appendChild(newScript); 
    },
    success: null
}; 

function rt_send_data(dt)
{

}

function rt_on_data(dt)
{


}var chat_oddeven = 0; /* 0 - odd, 1 even */
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

}/* include panorama image handling upon the aspect ratio */

var photodata = 0;
var photoup_files = 0;

function photoup_viewthumbs(startid, c, cobj)
{
	var tvals = "";

	startid = parseInt(startid);
	
	for(var i=0; i<c; i++)
	{
		tvals += "<div class='photoupv_thumbboxo'><div class='photoupv_thumbboxuppbar' id='photoupv_thumbboxuppbar" + (startid + i) + "'><div class='photoupv_thumbboxuppbari' id='photoupv_thumbboxuppbari" + (startid + i) + "'></div></div><div class='photoupv_thumbbox' id='photouppptbi" + (startid + i) + "'></div><div class='photoupv_thumbbox_ft'><div class='photoupv_thumbbox_ftdsc'><p id='photouppptbdsc" + (startid + i) + "' onclick=\"geditinplace(this, 2, 278, 45);\">Add a description...</p></div></div></div>";
	}
	
	cobj.innerHTML += tvals;
	cobj.setAttribute('data-npics', startid + c);
}

function photoup_resamplethumbs(startid, c, files)
{
	startid = parseInt(startid);
	
	photoup_files = new Array(c);
	
	photodata = new Array(c);
	
	for(var i=0; i<c; i++)
	{
		photoup_files[i] = files[i];
		photoup_html5resample(files[i], 337, $('photouppptbi' + (startid + i)), 337/145.0, i, 0, 0);
	}
}

/*
 * pojb can be zero and idi won't be used if retdata is non-zero.
 */
 
function photoup_html5resample(ifile, width, pobj, ar, idi, retdata, retdvals)
{
	var file = new FileReader;
	var data = 0;
	
    file.onload = function (){

			var mi = new Image;
			
			mi.src = file.result;
			
			/* mi.onerror = function (){}; */
			
			mi.onload = function (){
					var canvas = document.createElement("canvas");
					context = canvas.getContext("2d");
					
					if(!ar)
					{
						if(mi.width < width) width = mi.width;
						if(mi.height > width) width = mi.width * (width / mi.height);
					}
					
					var nw = width, nh = Math.round(mi.height * width / mi.width), exh = mi.height, exw = mi.width, sy = 0, sx = 0;
					var sc = mi.width / width;
					
					if(ar)
					{
						if(mi.width / mi.height < ar)
						{
							nh = nw / ar;
							exh = mi.width / ar;
							sy = mi.height / 2 - (nh * sc) / 2;
						}else{
							
							exw = mi.height * ar;
							
							nh = nw / ar;
							sc = mi.height / nh;
							sy = 0;
							sx = mi.width / 2 - (nw * sc) / 2;
						}
					}
					
					canvas.width = nw;
					canvas.height = nh;
					
					context.drawImage(mi, sx, sy, exw, exh, 0, 0, nw, nh);
					data = canvas.toDataURL("image/jpeg");
					
					if(!retdata)
					{
						pobj.appendChild(new Image).src = data;

					//photo_uploadimg(0, data);
						photodata[idi] = data;
					}else{
						photoup_uploadphoto(data, retdvals[0], retdvals[1], retdvals[2], 0, 0, 0);
					}
				
					delete context;
					delete canvas;
				};
			
			
		};
		
    /*
	file.onabort = function (){};
	file.onerror = function (){};
	*/

	file.readAsDataURL(ifile);

}


function photoup_uploadset()
{
	var albumname = 0;
	var photodsc = 0;
	var photocount = 0;

	photocount = $('overlayfulldialog_ic').getAttribute('data-npics');
	if(!photocount) return 0;
	photocount = parseInt(photocount);
	if(!photocount) return 0;
	
	albumname = $('photoup_albumtitle').innerText;
	
	ajax_post("php/tasks/addalbum.php?n=" + albumname, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText && xmlhttp.responseText != "0")
			{
				var upalbumid = xmlhttp.responseText;
			
				/* add photos */
	
				for(var i=0; i<photocount; i++)
				{
					var o = $('photouppptbdsc' + i);
					var opic = $('photouppptbi' + i);
					if(!o) continue;
					
					photodsc = o.innerText;
					
					if(!o.getAttribute('data-eipset')) photodsc = "";
					
					set_opacity(opic, 50);
				
					var pb = $('photoupv_thumbboxuppbar' + i);
					var pbi = $('photoupv_thumbboxuppbari' + i);
					
					if(pb && pbi)
					{
						pb.style.visibility = "visible";
						pbi.style.width = '50%';
					}
					
					var pcurrentdata = [photodsc, upalbumid, function(v, dv){
						pbi.style.width = v + '%';
						}];
					
					photoup_html5resample(photoup_files[i], 1000, 0, 0, 0, 1, pcurrentdata);
					
					//photoup_uploadphoto(pcurrentdata, photodsc, upalbumid, function(v, dv){
					//	pbi.style.width = v + '%';
					//	}, 0, 0, 0);
					//photoup_uploadphoto(photodata[i], photodsc, upalbumid, function(v, dv){
					//	pbi.style.width = v + '%';
					//	}, 0, 0, 0);

					
					//alert(albumname + " - " + photodsc);
				}
				
				/* </add photos> */
				
			}
		}
	
	});
}


function  photoup_uploadphoto(data, photodsc, albumid, progressb, ppdata, photoprivacy, photoloc)
{
	var xhr = new XMLHttpRequest();
	var fd = new FormData();

	fd.append("upload", data);
	xhr.open("POST", "php/tasks/addphoto.php?albid=" + albumid + "&dsc=" + photodsc);
	
	if(progressb)
	{
		xhr.upload.addEventListener("progress", function(e) {
			if (e.lengthComputable) {
				var percentage = Math.round((e.loaded * 100) / e.total);
				progressb(percentage, ppdata);
			}}, false);
	}
		
	xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.setRequestHeader('UP-FILENAME', "photo.jpg");
	xhr.setRequestHeader('UP-SIZE', 100);
	xhr.setRequestHeader('UP-TYPE', "image/jpg");
	
	xhr.send(data);
	
	xhr.onreadystatechange = function(){if(xhr.readyState==4){};};
}

function  photoup_uploadimg(calbumid, data)
{
	var xhr = new XMLHttpRequest();
	
	
	var fd = new FormData();

	fd.append("upload", data);

	
	
	xhr.open("POST", "upload.php");
	
	xhr.upload.addEventListener("progress", function(e) {
		if (e.lengthComputable) {
			var percentage = Math.round((e.loaded * 100) / e.total);
			document.title = percentage;
		}}, false);
		
	xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.setRequestHeader('UP-FILENAME', "haha.jpg");
	xhr.setRequestHeader('UP-SIZE', 100);
	xhr.setRequestHeader('UP-TYPE', "image/jpg");
	
	xhr.send(data);
	
	xhr.onreadystatechange = function(){if(xhr.readyState==4){};};
}/*
 * faster image lazyloading algorithm based on the code by Erwan Lefèvre <erwan.lefevre@aposte.net>
 *
 * features:
 *
 * 1. can call the function and work notice a scroll/viewsport change.
 * 2. don't keep track on images which are already loaded.
 * 3. page will be displayed first even if there are images which are already on the viewsport.
 *
 */

var lazyloadimg_scrollval = 0;
var lazyloadimg_imgset = [];
var lazyloadimg_distance = 500;


function lazyloadimg_clear()
{
	lazyloadimg_scrollval = 0;
	lazyloadimg_imgset = [];
}

function add_lazyloading(obj)
{
	var newelmlist = obj.getElementsByTagName('img');
	var dscv = 0, cobj;
	
	for(var i=0; i<newelmlist.length; i++ )
	{
		cobj = newelmlist[i];
		dscv = cobj.getAttribute("data-src");
		
		if(dscv)
		{
		
			if(lazyloadimg_isitemvisible(cobj, lazyloadimg_distance))
			{
			
				cobj.src = dscv;
			}else{
				lazyloadimg_imgset.push(cobj);
			}
		}
	}
}

function lazyloadimg_scroll(x, y)
{
	lazyloadimg_scrollval = y;
	for(var i=0; i<lazyloadimg_imgset.length; i++)
	{
		
		var cobj = lazyloadimg_imgset[i];
		if(lazyloadimg_isitemvisible(cobj, lazyloadimg_distance))
		{
			var imgpos = get_position(cobj);
			cobj.src = cobj.getAttribute("data-src");
			lazyloadimg_imgset.splice(i, 1);
		}
	}
}


function lazyloadimg_isitemvisible(img, vdistance)
{
	var imgpos = get_position(img);
	var rmin = lazyloadimg_scrollval - vdistance;
	var rmax = lazyloadimg_scrollval + g_win_height + vdistance;

	return (((rmin<=imgpos.t) && (rmax>=imgpos.t) ) || ( (rmin<=imgpos.b) && (rmax>=imgpos.b)));
}


var canvas, ctx;
var imgObj;

function image_effect_sepia(img)
{
	var r = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
		g = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
		b = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];
	
	var noise = 20;
   
    for (var i=0; i < img.data.length; i+=4)
	{
        img.data[i]   = r[img.data[i]];
        img.data[i+1] = g[img.data[i+1]];
        img.data[i+2] = b[img.data[i+2]];

        if (noise > 0) {
            var n = Math.round(noise - Math.random() * noise);

            for(var j=0; j<3; j++){
                var iPN = n + img.data[i+j];
                img.data[i+j] = (iPN > 255) ? 255 : iPN;
            }
        }
    }
}

function image_effect_grayscale(img)
{
    for (var i=0; i < img.data.length; i+=4)
	{
		var g = img.data[i] * 0.3 + img.data[i+1] * 0.59 + img.data[i+2] * 0.11;

        img.data[i]   = g;
        img.data[i+1] = g;
        img.data[i+2] = g;

    }
}

/* brightness contrast */

function image_effect_addnoise(img)
{
	var noise = 10;
	
    for (var i=0; i < img.data.length; i+=4)
	{
        if (noise > 0)
		{
            var n = Math.round(noise - Math.random() * noise);

            for(var j=0; j<3; j++)
			{
                var iPN = n + img.data[i+j];
                img.data[i+j] = (iPN > 255) ? 255 : iPN;
            }
        }
    }
}


function image_effect_bc(img)
{
	var brightness = 1.0, contrast = 1.1;
    for (var i=0; i < img.data.length; i+=4)
	{
        img.data[i]   = (((img.data[i  ] * brightness) - 128) * contrast + 128);
        img.data[i+1] = (((img.data[i+1] * brightness) - 128) * contrast + 128);
        img.data[i+2] = (((img.data[i+2] * brightness) - 128) * contrast + 128);
    }
}

function image_effect_saturate(img)
{
	var desaturate_level = 0.5;
    for (var i=0; i < img.data.length; i+=4)
	{
		var average = ( img.data[i] + img.data[i+1] + img.data[i+2] ) / 3;

		img.data[i  ] += Math.round( ( average - img.data[i  ] ) * desaturate_level);
		img.data[i+1] += Math.round( ( average - img.data[i+1] ) * desaturate_level);
		img.data[i+2] += Math.round( ( average - img.data[i+2] ) * desaturate_level);
    }
}

function image_effect_tint(img)
{
	var CyanRed      = -40.0;
	var MagentaGreen = 0.0;
	var YellowBlue   = 20.0;
	var r, g, b;
	
    for (var i=0; i < img.data.length; i+=4)
	{
		r = img.data[i  ];
		g = img.data[i+1];
		b = img.data[i+2];
		
		r += CyanRed;
		g -= (CyanRed / 2);
		b -= (CyanRed / 2);

		r -= (MagentaGreen / 2);
		g += MagentaGreen;
		b -= (MagentaGreen / 2);

		r -= (YellowBlue / 2);
		g -= (YellowBlue / 2);
		b += YellowBlue;
		
		
		img.data[i  ] = r;
		img.data[i+1] = g;
		img.data[i+2] = b;
    }
}


function image_effect_vignette(ctx, w, h, strength)
{
	var darkstrength = 0.8;
	var gradient;
	
	if(strength) darkstrength = strength;
	
	var outerRadius = Math.sqrt( Math.pow(w/2, 2) + Math.pow(h/2, 2) );

	ctx.globalCompositeOperation = 'source-over';
	gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, outerRadius);
	gradient.addColorStop(0, 'rgba(0,0,0,0)');
	gradient.addColorStop(0.2, 'rgba(0,0,0,0)');
	gradient.addColorStop(1, 'rgba(0,0,0,' + darkstrength + ')');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, w, h);
}


function apply_image_effect(cv, fn)
{
	var ctx = cv.getContext('2d');
	
	if(fn == 'center_blur')
	{
	   var blurRadius = 10;
	   var steps = 3;
	   var gradientPixels = getLinearGradientMap(cv.width, cv.height, cv.width/2, cv.height/2, -Math.PI, 320, true );

		var radiusFactor = 1.5;
		var divider = radiusFactor;
		for ( var i = 1; i < steps; i++ )
		{
			divider += Math.pow( radiusFactor, i+1 );
		}
		var startRadius = blurRadius / divider;
		compoundBlurImage( 'srcimg', cv.id, gradientPixels, startRadius, radiusFactor, steps, false );
	
	
	}else{
		var img = ctx.getImageData(0,0,cv.width,cv.height);
		
		if(fn) fn(img);
		
		ctx.putImageData(img, 0, 0);
	}
	
}

function onload()
{
	var canvas, ctx, imgObj;
	
    canvas = document.getElementById('source');
    ctx = canvas.getContext('2d');
	
    imgObj = new Image();
	
    imgObj.onload = function ()
	{
		canvas.style.width = this.width + "px";
		canvas.style.height = this.height + "px";
        ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
    }
	
    imgObj.src = '5.jpg';
}








function image_fxpreset_cinemascope(canvas_id)
{
	var canvas = document.getElementById(canvas_id);
	var ctx = canvas.getContext('2d');
	
	apply_image_effect(canvas, image_effect_saturate);
	apply_image_effect(canvas, image_effect_addnoise);
	apply_image_effect(canvas, 'center_blur');
	image_effect_vignette(ctx, canvas.width, canvas.height, 0.8);
	apply_image_effect(canvas, image_effect_tint);
	

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, 60);
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
}

function image_fxpreset_retro(canvas_id)
{
	var canvas = document.getElementById(canvas_id);
	var ctx = canvas.getContext('2d');
	
	apply_image_effect(canvas, image_effect_sepia);
	apply_image_effect(canvas, 'center_blur');
	image_effect_vignette(ctx, canvas.width, canvas.height, 0.8);
}

function image_fxpreset_bnw(canvas_id)
{
	var canvas = document.getElementById(canvas_id);
	var ctx = canvas.getContext('2d');
	
	apply_image_effect(canvas, image_effect_grayscale);
	apply_image_effect(canvas, image_effect_bc);
}

function image_fxpreset_focus(canvas_id)
{
	var canvas = document.getElementById(canvas_id);
	var ctx = canvas.getContext('2d');
	
	apply_image_effect(canvas, image_effect_bc);
	apply_image_effect(canvas, 'center_blur');
	image_effect_vignette(ctx, canvas.width, canvas.height, 0.3);
}


















/* compound blur */


/*

CompoundBlur - Blurring with varying radii for Canvas

Version: 	0.1
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Copyright (c) 2011 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

		
function compoundBlurImage( imageID, canvasID, radiusData, minRadius, increaseFactor, blurLevels, blurAlphaChannel )
{

       
	var canvas = document.getElementById( canvasID );
    var context = canvas.getContext("2d");
   	var w = canvas.width;
    var h = canvas.height;

	if ( isNaN(minRadius) || minRadius <= 0 || isNaN(increaseFactor) || increaseFactor == 0 ) return;
	
	if ( blurAlphaChannel )
		compundBlurCanvasRGBA( canvasID, 0, 0, w, h, radiusData, minRadius, increaseFactor, blurLevels );
	else 
		compundBlurCanvasRGB( canvasID, 0, 0, w, h, radiusData, minRadius, increaseFactor, blurLevels );
}

function getLinearGradientMap( width, height, centerX, centerY, angle, length, mirrored )
{
	var cnv = document.createElement('canvas');
	cnv.width  = width;
	cnv.height = height;
	
	var x1 = centerX + Math.cos( angle ) * length * 0.5;
	var y1 = centerY + Math.sin( angle ) * length * 0.5;
	
	var x2 = centerX - Math.cos( angle ) * length * 0.5;
	var y2 = centerY - Math.sin( angle ) * length * 0.5;
	
	var context = cnv.getContext("2d");
    var gradient = context.createLinearGradient(x1, y1, x2, y2);
	if ( !mirrored )
	{
		gradient.addColorStop(0, "white");
		gradient.addColorStop(1, "black");
	} else {
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.5, "black");
		gradient.addColorStop(1, "white");
	}
	context.fillStyle = gradient;
	context.fillRect(0, 0, width, height );
	return context.getImageData( 0, 0, width, height );
}

function getRadialGradientMap( width, height, centerX, centerY, radius1, radius2 )
{
	var cnv = document.createElement('canvas');
	cnv.width  = width;
	cnv.height = height;
	
	
	var context = cnv.getContext("2d");
    var gradient = context.createRadialGradient(centerX, centerY, radius1, centerX, centerY, radius2);
	
	gradient.addColorStop(1, "white");
	gradient.addColorStop(0, "black");
	
	context.fillStyle = gradient;
	context.fillRect(0, 0, width, height );
	return context.getImageData( 0, 0, width, height );
}

function compundBlurCanvasRGB( id, top_x, top_y, width, height, radiusData, minRadius, increaseFactor, blurLevels )
{
	if ( isNaN(minRadius) || minRadius <= 0 || isNaN(increaseFactor) || increaseFactor == 0 ) return;
	 
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
		
	renderCompundBlurRGB( imageData, radiusData, width, height, minRadius, increaseFactor, blurLevels );
	context.putImageData( imageData, top_x, top_y );	
}

function compundBlurCanvasRGBA( id, top_x, top_y, width, height, radiusData, minRadius, increaseFactor, blurLevels )
{
	if ( isNaN(minRadius) || minRadius <= 0 || isNaN(increaseFactor) || increaseFactor == 0 ) return;
	 
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
		
	renderCompundBlurRGBA( imageData, radiusData, width, height, minRadius, increaseFactor, blurLevels );
	context.putImageData( imageData, top_x, top_y );	
}
		
function renderCompundBlurRGB( imageData, radiusData, width, height, radius, increaseFactor, blurLevels )
{
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
	r_out_sum, g_out_sum, b_out_sum,
	r_in_sum, g_in_sum, b_in_sum,
	pr, pg, pb, rbs;
	
	var imagePixels = imageData.data;
	var radiusPixels = radiusData.data;
	
	var wh = width * height;
	var wh4 = wh << 2;
	var pixels = [];
	
	for ( var i = 0; i < wh4; i++ )
	{
		pixels[i] = imagePixels[i];
	}
	
	var currentIndex = 0;
	var steps = blurLevels;
	blurLevels -= 1;
	
	while ( steps-- >= 0 )
	{
		var iradius = ( radius + 0.5 ) | 0;
		if ( iradius == 0 ) continue;
		if ( iradius > 256 ) iradius = 256;
		
		var div = iradius + iradius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = iradius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		var mul_sum = mul_table[iradius];
		var shg_sum = shg_table[iradius];
	
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			}
		
		
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p =  ( yw + ( ( p = x + radiusPlus1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

	
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p]   = (r_sum * mul_sum) >> shg_sum;
				pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
	
		radius *= increaseFactor;
		
		for ( i = wh; --i > -1 ; )
		{
			var idx = i << 2;
			var lookupValue = (radiusPixels[idx+2] & 0xff) / 255.0 * blurLevels;
			var index = lookupValue | 0;
			
			if ( index == currentIndex )
			{
				var blend =  256.0 * ( lookupValue - (lookupValue | 0 ));
				var iblend = 256 - blend;
				
				 imagePixels[idx] = (  imagePixels[idx] * iblend + pixels[idx] * blend ) >> 8;
				 imagePixels[idx+1] = (  imagePixels[idx+1] * iblend + pixels[idx+1] * blend) >> 8;
				 imagePixels[idx+2] = (  imagePixels[idx+2] * iblend + pixels[idx+2] * blend) >> 8;
			
			} else if ( index == currentIndex + 1 )
			{
				imagePixels[idx] = pixels[idx];
				imagePixels[idx+1] = pixels[idx+1];
				imagePixels[idx+2] = pixels[idx+2];
				
			}
		}
		currentIndex++;
	}
}

function renderCompundBlurRGBA( imageData, radiusData, width, height, radius, increaseFactor, blurLevels )
{
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum,
	pa, pr, pg, pb, rbs;
	
	var imagePixels = imageData.data;
	var radiusPixels = radiusData.data;
	
	var wh = width * height;
	var wh4 = wh << 2;
	var pixels = [];
	
	for ( var i = 0; i < wh4; i++ )
	{
		pixels[i] = imagePixels[i];
	}
	
	var currentIndex = 0;
	var steps = blurLevels;
	blurLevels -= 1;
	
	while ( steps-- >= 0 )
	{
		var iradius = ( radius + 0.5 ) | 0;
		if ( iradius == 0 ) continue;
		if ( iradius > 256 ) iradius = 256;
		
		var div = iradius + iradius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = iradius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		var mul_sum = mul_table[iradius];
		var shg_sum = shg_table[iradius];
	
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			}
			
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
				if ( pa != 0 )
				{
					pa = 255 / pa;
					pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
				} else {
					pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
				}
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p =  ( yw + ( ( p = x + radiusPlus1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				a_in_sum += ( stackIn.a = pixels[p+3]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
			   
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
				if ( pa > 0 )
				{
					pa = 255 / pa;
					pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
				} else {
					pixels[p] = pixels[p+1] = pixels[p+2] = 0;
				}
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
			   
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
			   
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
	
		radius *= increaseFactor;
		
		for ( i = wh; --i > -1 ; )
		{
			var idx = i << 2;
			var lookupValue = (radiusPixels[idx+2] & 0xff) / 255.0 * blurLevels;
			var index = lookupValue | 0;
			
			if ( index == currentIndex )
			{
				var blend =  256.0 * ( lookupValue - (lookupValue | 0 ));
				var iblend = 256 - blend;
				
				 imagePixels[idx]   = (imagePixels[idx]   * iblend + pixels[idx]   * blend) >> 8;
				 imagePixels[idx+1] = (imagePixels[idx+1] * iblend + pixels[idx+1] * blend) >> 8;
				 imagePixels[idx+2] = (imagePixels[idx+2] * iblend + pixels[idx+2] * blend) >> 8;
				 imagePixels[idx+3] = (imagePixels[idx+3] * iblend + pixels[idx+3] * blend) >> 8;
			
			} else if ( index == currentIndex + 1 )
			{
				imagePixels[idx]   = pixels[idx];
				imagePixels[idx+1] = pixels[idx+1];
				imagePixels[idx+2] = pixels[idx+2];
				imagePixels[idx+3] = pixels[idx+3];
			}
		}
		currentIndex++;
	}
}
	
function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}var ppmds_x = 0;
var pmmd_oindex = 0;
var pmmd_ps_end = 0;
var pmmd_stopslide = 0;
var pmmd_currentset = ["pmmdimg_1", "pmmdimg_2", "pmmdimg_3"];
var pmmd_isdrag=false;
var pmmd_x,pmmd_y;
var pmmd_dobj;
var pmmd_dx = -1, pmmd_nx = 0;
var pmmd_tx, pmmd_ty;
var pmmd_tagging_enabled = 0;

var photobox_abs_ccx = 0;
var photobox_abs_ccy = 0;
var photobox_abs_ccw = 0;
var photobox_abs_cch = 0;

var ptg_mbuttondown = 0;

var ie  = document.all;
var nn6 = document.getElementById&&!document.all;

pmmd_available = 1;

var pmmd_ps_count = 0;

var g_photoviewer_w = 650;
var g_photoviewer_h = 500;

function pmmd_movemouse(e)
{

	
	if(pmmd_isdrag)
	{
		var xv = (nn6 ? pmmd_tx + e.clientX - pmmd_x : pmmd_tx + event.clientX - pmmd_x);
		var mxv = (nn6 ? e.clientX : event.clientX);

		if(xv > 0) xv = 0;
		
		/*if(ppmds_x > xv && pmmd_oindex + 1 >= pmmd_ps_count)
		{
			
			return false;
		}*/
		

		if(pmmd_ps_end)
		{
			if(ppmds_x > xv)
			{
				pmmd_stopslide = 1;
				return false;
			}else{
				pmmd_stopslide = 0;
			}
		}
		
		
		ppmds_x = xv;
		pmmd_nx = ppmds_x;

		if(pmmd_getcurrentimgid() >= pmmd_ps_count) return false;
		
		pmmd_dobj.style.left  = xv + 'px';
		return false;
	}
	
	ptg_move(e);
 
}

function pmmd_selectmouse(e) 
{
  var fobj       = nn6 ? e.target : event.srcElement;
  var topelement = nn6 ? "HTML" : "BODY";
 

  while (fobj.tagName != topelement && fobj.className != "pmmd_photos")
  {
    fobj = nn6 ? fobj.parentNode : fobj.parentElement;
  }

  if (fobj.className=="pmmd_photos")
  {
	
	pmmd_dx = pmmd_nx;
    pmmd_isdrag = true;
    pmmd_dobj = fobj;
    pmmd_tx = parseInt(pmmd_dobj.style.left+0);
    pmmd_ty = parseInt(pmmd_dobj.style.top+0);
    pmmd_x = nn6 ? e.clientX : event.clientX;
    pmmd_y = nn6 ? e.clientY : event.clientY;
	//if(pmmd_dx < 0) pmmd_nx = x;
	
	
	
    //document.onmousemove=pmmd_movemouse;
	
	document.body.focus();
	document.onselectstart = function () { return false; };
	fobj.ondragstart = function() { return false; };
    return false;
  }
}

//document.onmousedown=pmmd_selectmouse;
//document.onmouseup=new Function("pmmd_isdrag=false; pmmd_slideauto(pmmd_dobj, pmmd_dx, pmmd_nx, 640);");
function pmmd_switchtagmode(m)
{
	if(m == 3) /* auto */
	m = !pmmd_tagging_enabled;
	
	if(m)
	{
		$('ptgbtagstart').innerHTML = "Save";
		$('ptgbtagstart').style.backgroundColor = "#ffcc00";
		pmmd_tagging_enabled = 1;
		$("ptgptc").style.visibility = "visible";
	}else{
	
		if(pmmd_tagging_enabled)
		{
			phototags_savenew();
		}
	}
}

function pmmd_mousedown(e)
{
	
	ptg_mdown(e);
	
	if(pmmd_tagging_enabled) return;
	
	pmmd_selectmouse(e);
}

function pmmd_mouseup(e)
{
	ptg_mup(e);
	if(pmmd_isdrag)
	{
		pmmd_isdrag=false;
		pmmd_slideauto(pmmd_dobj, pmmd_dx, pmmd_nx, g_photoviewer_w);
		//document.onmousemove = null;
		document.onselectstart = null;
		pmmd_dobj.ondragstart = null;
	}
}


function pmmd_generate_photo(pid)
{
	var ttexts = "";
	
	if(general_photoset_inuse) return general_photolist_getphoto(pid);
	
	if(typeof (window.photomanager_listgetphoto) == 'function')
	{
		return photomanager_listgetphoto(pid);
	}
	
	return "<div class=\"pmmd_photo\"><img id='pmmdimg_" + (pid + 1) + "' src=\"data/ud1wk4x8/ps/" + (pid + 1) + ".jpg\"/></div>";
}

function pmmd_generate_photocache(pid)
{
	var ttexts = "";
	
	if(general_photoset_inuse) return general_photolist_getphotocache(pid);
	
	if(typeof (window.photomanager_listgetphotocache) == 'function')
	{
		return photomanager_listgetphotocache(pid);
	}
	
	return "Error";
}

function pmmd_getpostid(pid)
{
	if(general_photoset_inuse) return general_photolist_getpostid(pid);
	
	if(typeof (window.photomanager_listphotogetpostid) == 'function')
	{
		return photomanager_listphotogetpostid(pid);
	}
	
	return 0;
}

function pmmd_generate_photostrip(poffset)
{
	var s = "";
	if(poffset <= 0)
	{
		s += pmmd_generate_photo(poffset);
		s += pmmd_generate_photo(poffset + 1);
		s += pmmd_generate_photo(poffset + 2);
		
		pmmd_currentset[0] = "pmmdimg_" + (poffset + 1);
		pmmd_currentset[1] = "pmmdimg_" + (poffset + 2);
		pmmd_currentset[2] = "pmmdimg_" + (poffset + 3);
	
	}else{
	
		s += pmmd_generate_photo(poffset);
		s += pmmd_generate_photo(poffset + 1);
		s += pmmd_generate_photo(poffset + 2);
		
		pmmd_currentset[0] = "pmmdimg_" + (poffset + 1);
		pmmd_currentset[1] = "pmmdimg_" + (poffset + 2);
		pmmd_currentset[2] = "pmmdimg_" + (poffset + 3);
	}
	
	//if(poffset + 3 > pmmd_ps_count) pmmd_ps_end = 1;
	//else pmmd_ps_end = 0;
	
	return s;
}

function pmmd_resizephotoset()
{
	var i;
	
	for(i=0; i<3; i++)
	{
		var o = $(pmmd_currentset[i]);
		alert(o.offsetHeight);
		if(o.offsetHeight > g_photoviewer_h)
		{
			o.style.height = g_photoviewer_w + 'px';
		}else{
			if(o.offsetWidth > g_photoviewer_w)
				o.style.width = g_photoviewer_w + 'px';
		} 
	}
}

function pmmd_resizeonephoto(o)
{
	if(o.offsetHeight > g_photoviewer_h)
	{
		o.style.height = g_photoviewer_h + 'px';
	}else{
		if(o.offsetWidth > g_photoviewer_w)
			o.style.width = g_photoviewer_w + 'px';
	}
}

function pmmd_init()
{
	//pmmd_resizephotoset();
	var mo=$("pmmd_pdb");

	photobox_abs_ccx = photobox_abs_ccy = 0;

	
	while(mo)
	{
		photobox_abs_ccx += mo.offsetLeft;
		photobox_abs_ccy += mo.offsetTop;
		mo = mo.offsetParent;
	}
	
	


	
	//$("vg").style.left = photobox_abs_ccx + "px";
	//$("vg").style.top = photobox_abs_ccy + "px";
}

function pmmd_photostop()
{
	var pcimg = pmmd_getcurrentimg();
	
	if(pcimg)
		var ioh = Math.min(pcimg.offsetHeight, g_photoviewer_h);
	else
		var ioh = g_photoviewer_h;
	var v = 0;
	
	$("pmmd_pdb").style.height = Math.max(ioh, 200) + 'px';
	post_vcenter();
	
	if(-ppmds_x >= (g_photoviewer_w * 2))
	{
		v = pmmd_generate_photostrip(pmmd_oindex + 1);
		if(v)
		{
			pmmd_oindex++;
			$("pmmd_ps").innerHTML = v;
			pmmd_nx = ppmds_x = -g_photoviewer_w;
			$("pmmd_ps").style.left = ppmds_x + 'px';
		}
		//pmmd_resizephotoset();
		
	}else if((-ppmds_x < (g_photoviewer_w)) && (pmmd_oindex > 0)){

		v = pmmd_generate_photostrip(pmmd_oindex - 1);
		if(v)
		{
			pmmd_oindex--;
			$("pmmd_ps").innerHTML = v;
			pmmd_nx = ppmds_x = -g_photoviewer_w;
			$("pmmd_ps").style.left = ppmds_x + 'px';
		}
		//pmmd_resizephotoset();
	}
	
	/* update notes */
	
	var cuimageid = pmmd_getcurrentimgid();
	
	$('spw_edt').innerHTML = "<div>Photo " + cuimageid + "/" + pmmd_ps_count + "</div>";
	
	ajax_post("php/pages/getnotes.php?pid=" + pmmd_getpostid(cuimageid - 1), function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText)
			{
				$('spw_edt').innerHTML = "<div>Photo " + cuimageid + "/" + pmmd_ps_count + "</div>" +  xmlhttp.responseText;
				synctime_set($('spw_edt'));
			}
		}
		});
	
	
	pmmd_cacheimages(cuimageid - 1);
	
}


function pmmd_slidebox(obj, x, dx, px, lx)
{
	
	ppmds_x = x;
	obj.style.left = x + 'px';
	
	if(lx > px)
	{
		if(x >= px)
		{
			setTimeout(function (_this){pmmd_slidebox(obj, x - dx, dx - 2 > 4 ? dx - 1 : 4, px, lx);}, 50);
		
		}else{
			ppmds_x = px;
			obj.style.left = px + 'px';
			pmmd_photostop();
		}
	}else{
		if(x <= px)
		{
			setTimeout(function (_this){pmmd_slidebox(obj, x + dx, dx - 2 > 4 ? dx - 1 : 4, px, lx);}, 50);
		
		}else{
		
			ppmds_x = px;
			obj.style.left = px + 'px';
			pmmd_photostop();
		}
	}
}

function pmmd_cacheimages(cid)
{
	var o = $('pmmd_photosett');

	if(!o) return 0;
	
	var tstart = cid - 4;
	if(tstart < 0) tstart = 0;
	
	var tend = cid + 4;
	if(tend > pmmd_ps_count) tend = pmmd_ps_count;
	
	var chtml = "";
	var i;
	
	for(i=tstart; i<tend; i++)
	{
		chtml += pmmd_generate_photocache(i);
	}
	
	o.innerHTML = chtml;
}

function pmmd_getcurrentimg()
{
	var v = (-ppmds_x / g_photoviewer_w) + 1;
	v += pmmd_oindex;
	return $(("pmmdimg_" + Math.round(v)));
}

function pmmd_getcurrentimgid()
{
	var v = (-ppmds_x / g_photoviewer_w) + 1;
	v += pmmd_oindex;
	return v;
}

function pmmd_slideauto(o, ox, nx, bw)
{
	var px = 0;
	
	
	if(pmmd_getcurrentimgid() >= pmmd_ps_count) return false;
	//document.title = Math.round(v) + "/" + pmmd_ps_count;
	
	if(ox > nx + 60)
		px = nx - (nx % bw) - bw;
	else if(ox < nx - 60)
		px = nx - (nx % bw);
				
	//if(px != nx)
	if(!pmmd_stopslide)
		pmmd_slidebox(o, nx, (50 * g_photoviewer_w) / 500, px, nx);
}

/*###############################################################################*/

var ie = document.all ? true : false;

var ptg_array = new Array;
var ptg_mode_edit = 0;
var ptg_lx = 0;
var ptg_ly = 0;

var ptg_zoomr = 1.0;
var ptg_boxrw = 128;
var ptg_boxrh = 158;
var ptg_boxw = 128 * ptg_zoomr;
var ptg_boxh = 158 * ptg_zoomr;
var ptg_boxwd = (128 - ptg_boxw) / 2;
var ptg_boxhd = (158 - ptg_boxh) / 2;

ptg_array[0] = [10, 20, 0, "Person A"];
ptg_array[1] = [312, 60, 0, "Person B"];
ptg_array[2] = [30, 40, 0, "Person C"];

function ptg_init(z)
{
	ptg_zoomr = z;
	ptg_boxrw = 128;
	ptg_boxrh = 158;
	ptg_boxw = 128 * ptg_zoomr;
	ptg_boxh = 158 * ptg_zoomr;
	ptg_boxwd = (128 - ptg_boxw) / 2;
	ptg_boxhd = (158 - ptg_boxh) / 2;

	$("ptgimg").width = $("ptgimg").naturalWidth * z;
}

function ptg_move(e)
{
	var i;
	var f = 0;
	var de = document.documentElement;
    var b = document.body;
	
	if(ptg_mbuttondown) return;
	
	if (e == null) 
		e = window.event; 
		
	var x = e.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
    var y = e.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
	
	if(general_photoview_pic)
	{
		var o = $(general_photoview_pic);
		
		if(o)
		{
			if(o.firstChild)
			{
				photobox_abs_ccx = o.firstChild.offsetLeft;
				photobox_abs_ccy = ((g_win_height - 30) / 2 - o.firstChild.offsetHeight / 2);
				
				ptg_zoomr =  o.firstChild.width /  o.firstChild.naturalWidth;
			}
		}
	}

	if(ptg_mode_edit) return;
	
	if(x > parseInt($("pmmd_pdb").offsetWidth) - 100)
	{
		$("ptgptc").style.visibility = "visible";
	}else{
		if(!pmmd_tagging_enabled)
			$("ptgptc").style.visibility = "hidden";
	}
	
	x -= photobox_abs_ccx;
	y -= photobox_abs_ccy;
	
	if(y > parseInt($("pmmd_pdb").offsetHeight)) return;
	
	var o = $("ptgg1");

	for(i=0; i<ptg_array.length; i++)
	{
		if( x < (ptg_array[i][0] * ptg_zoomr) + ptg_boxw && y < (ptg_array[i][1] * ptg_zoomr) + ptg_boxh &&
			x > (ptg_array[i][0] * ptg_zoomr) && y > (ptg_array[i][1] * ptg_zoomr))
		{
			o.style.left = ((ptg_array[i][0] * ptg_zoomr) - ptg_boxwd) + photobox_abs_ccx + "px";
			o.style.top =  ((ptg_array[i][1] * ptg_zoomr) - ptg_boxhd) + photobox_abs_ccy + "px";
			
			$("ptgg1c").innerHTML = ptg_array[i][2] ? ptg_array[i][2] : ptg_array[i][3];
			f = 1;
			break;
		}
	}
	
	if(!f)
		o.style.visibility = "hidden";
	else
		o.style.visibility = "visible";
}

function ptg_mdown(e)
{
	ptg_mbuttondown = 1;
	
	if(!pmmd_tagging_enabled) return;
	
	if (e == null) 
		e = window.event; 
		
	var de = document.documentElement;
    var b = document.body;
	var cx = e.clientX;//+ (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
    var cy = e.clientY; //+ (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
	var ccx = cx;
	var ccy = cy;
	
	ccx -= photobox_abs_ccx; ccy -= photobox_abs_ccy;
	
	if(ccx < 0 || ccy < 30) return; //|| ccx > photobox_abs_ccw || ccy > photobox_abs_cch) return;
		
	if(ptg_mode_edit)
	{
		if( e.clientX < ptg_lx + ptg_boxrw && e.clientY < ptg_ly + ptg_boxrh &&
			e.clientX > ptg_lx && e.clientY > ptg_ly)
		{
			return;
		}
	}

	if(ptg_mode_edit == 0)
	{
		var o = $("ptgg1");
		
		ptg_lx = (cx - (ptg_boxw/2)) - ptg_boxwd;
		ptg_ly = (cy - (ptg_boxw/2)) - ptg_boxhd;
		
		o.style.left = ptg_lx + "px";
		o.style.top = ptg_ly + "px";
		
		o.style.visibility = "visible";
		
		$("ptgg1c").innerHTML = "<input type='text' id='ptgg1ci' onfocus='this.value = this.value;'/>";
		ptg_mode_edit = 1;
		
	}else{
	
		$("ptgg1").style.visibility = "hidden";
		
		ptg_mode_edit = 0;
	}

}

function ptg_add()
{
	if(ptg_mode_edit)
	{
		if(general_photoview_pic)
		{
			var o = $(general_photoview_pic);
			
			if(o)
			{
				if(o.firstChild)
				{
					ptg_zoomr =  o.firstChild.width /  o.firstChild.naturalWidth;
				}
			}
		}
	
		ptg_array.push([((ptg_lx - photobox_abs_ccx + ptg_boxwd) / ptg_zoomr), ((ptg_ly - photobox_abs_ccy + ptg_boxhd) / ptg_zoomr), 1, $("ptgg1ci").value]);

		$("ptgg1").style.visibility = "hidden";
		
		ptg_mode_edit = 0;
	}
}

function ptg_mup(e)
{
	ptg_mbuttondown = 0;
	
	if(ptg_mode_edit)
		$("ptgg1ci").focus();
}


function ptg_splist()
{
	$("spw_tagedt").innerHTML = ptg_generate_ppl_list();
}

function ptg_remtag(i)
{
	ptg_array.splice(i, 1);
	$("spw_tagedt").innerHTML = ptg_generate_ppl_list();
}

function ptg_showp(i)
{
	var o = $("ptgg1");

	o.style.left = ((ptg_array[i][0] * ptg_zoomr) - ptg_boxwd) + photobox_abs_ccx + "px";
	o.style.top =  ((ptg_array[i][1] * ptg_zoomr) - ptg_boxhd) + photobox_abs_ccy + "px";
	
	$("ptgg1c").innerHTML = ptg_array[i][2] ? ptg_array[i][2] : ptg_array[i][3];
	/**/o.style.visibility = "visible";
}

function ptg_generate_ppl_list()
{
	var ptgl = "", vn;
	
	for(i=0; i<ptg_array.length; i++)
	{
		vn = ptg_array[i][2] ? ptg_array[i][2] : ptg_array[i][3];
		ptgl = ptgl + "<a href='#' onmousemove='javascript: ptg_showp(" + i + ");'>"+ vn + "</a><a class='spw_ranchor' href='javascript: ptg_remtag(" + i + ");' style='padding-right: 10px;'><sup>(x)</sup></a>";
	}
	return ptgl;
}




/* save new tags */

function phototags_savenew()
{
	var i = 0, j = 0;
	var filter_ptga = [];
	
	for(i=0; i<ptg_array.length; i++)
	{
		if(ptg_array[i][2])
		{
			filter_ptga[j] = ptg_array[i];
			j++;
		}
	}

	var jm = {"tags" : filter_ptga};

	ajax_postjson("php/tasks/setphototags.php?postid=" + current_photo_postid, jm, function(state, status, r){
		if(state == 4 && status == 200 && r != "0")
		{
			$('ptgbtagstart').style.backgroundColor = "#000000";
			$('ptgbtagstart').innerHTML = "Start";
			
			/* mark all tags as old, we don't wanna send these to the server again */
			
			for(i=0; i<ptg_array.length; i++)
			{
				ptg_array[i][2] = 0;
			}

			pmmd_tagging_enabled = 0;
		}
	});
}










var suggestions = new Array("Dagmar Mcvey ", "Beckie Pinette ", "Elina Marchal ", "Becki Outten ", "Tonie Pavelka ", "Kary Podesta ", "Ismael Karcher ", "Tamesha Sigman ", "Davis Duerr ", "Martha Tuff ", "Loren Mohler ", "Haley Galeana ", "Abbey Macleod ", "Corene Dickison ", "Rebekah Vigue ", "Viva Mcraney ", "Les Huizar ", "Bradley Nery ", "Trent Grassi ", "Erlinda Guizar ", "Levi Sheen ", "Adela Stwart ", "Brigitte Grayer ", "Venetta Mull ", "Matthew Sarcone ", "Sybil Canchola ", "Kayce Visconti ", "Jennette Ruland ", "Elfrieda Mroz ", "Annabelle Kampen ", "Linsey Klapp ", "Vannesa Hogan ", "Araceli Norgard ", "Lon Loew ", "Shayne Wycoff ", "Merry Rierson ", "Randell Howlett ", "June Chang ", "Alvin Patterson ", "Jonna Buell ", "Zack Rahe ", "Jacklyn Cockett ", "Ora Kitzmiller ", "Pearle Zamorano ", "Stephane Asuncion ", "Trudi Pfeil ", "Kandace Godfrey ", "Fairy Pool ", "Wanda Shields ", "Russel Izzard");
var savedRange, savedRange2;


function getCaretPosition(element) {
	var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined") {
		if(!window.getSelection().rangeCount) return 0;
        range = window.getSelection().getRangeAt(0);
        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
            (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return  start;
}

function saveSelection()
{
    if(window.getSelection)//non IE Browsers
    {
        savedRange = window.getSelection().getRangeAt(0);
    }
    else if(document.selection)//IE
    { 
        savedRange = document.selection.createRange();  
    } 
}

function saveSelection2()
{
    if(window.getSelection)//non IE Browsers
    {
        savedRange2 = window.getSelection().getRangeAt(0);
    }
    else if(document.selection)//IE
    { 
        savedRange2 = document.selection.createRange();  
    } 
}

function restoreSelection()
{
    if (savedRange != null) {
        if (window.getSelection)//non IE and there is already a selection
        {
            var s = window.getSelection();
            if (s.rangeCount > 0) 
                s.removeAllRanges();
            s.addRange(savedRange);
        }
        else 
            if (document.createRange)//non IE and no selection
            {
                window.getSelection().addRange(savedRange);
            }
            else 
                if (document.selection)//IE
                {
                    savedRange.select();
                }
    }
}

function tokenize_setdiv(obj, outp, dataget, dataset, outcallback, callbackkeyup)
{
	var oldins;
	var posi = -1;
	var words = new Array();
	var input;
	var key;
	var datuseid;
	var wids = new Array();
	var voldwords = new Array();
	var voldwworddt = new Array();
	var voldwwids = new Array();
	
	var color_tsel = "#555555";
	var color_bsel = "#ecf1f6";
	var color_t = "#555555";
	var color_b = "#ffffff";
	var lselwin;
	
	setTimeout(lookat(0), 100);
	
	setvis("hidden");
	
	obj.setAttribute('data-ttokentrigon', 0);
	
	obj.onkeydown = keydownm;
	obj.onkeyup = keyupm;
	var lastcpos = 0;


	function insertTextAtCursor(text)
	{
		var sel, range, html;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				var b = document.createElement("span");
				b.innerHTML = text;
				range.insertNode(b); //document.createHTMLNode(text) );
				 
			}
		} else if (document.selection && document.selection.createRange) {
			document.selection.createRange().text = text;
		}
	}
	
	function pasteHtmlAtCaret(html)
	{
		var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node, lastNode;
				while ( (node = el.firstChild) ) {
					lastNode = frag.appendChild(node);
				}
				range.insertNode(frag);

				// Preserve the selection
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		} else if (document.selection && document.selection.type != "Control") {
			// IE < 9
			document.selection.createRange().pasteHTML(html);
		}
	}


	function keydownm(event)
	{
		
		if (!event && window.event) event = window.event;
		if (event) key = event.keyCode;
		else key = event.which;
		
		saveSelection();
		
		lastcpos  = getCaretPosition(obj);
		lookat(0);
		
		if(obj.getAttribute('data-ttokentrigon') != 0)
			if(key == 40 || key == 38 || (key == 13 && !event.shiftKey)) event.preventDefault();
	}
		
	function keyupm(event)
	{
		saveSelection();
		
		lookat(0);
		if(obj.getAttribute('data-ttokentrigon') == 0)
		{
			if(callbackkeyup) callbackkeyup(event);
			return 0;
		}
		
		if (key == 40) // down
		{
			if (words.length > 0 && posi < words.length-1)
			{
				if (posi >=0) setcolor(posi, color_b, color_t);
				else input = obj.innerText;
				setcolor(++posi, color_bsel, color_tsel);
			}
		}else if (key == 38){ // up
			if (words.length > 0 && posi >= 0)
			{
				if (posi >=1)
				{
					setcolor(posi, color_b, color_t);
					setcolor(--posi, color_bsel, color_tsel);
				}else{
					setcolor(posi, color_b, color_t);
					posi--;
				}
			}
		}else if (key == 27){ // esc
		
			setvis("hidden");
			posi = -1;
			oldins = input;
			
		}else if (key == 8){ // backspace
			posi = -1;
			oldins=-1;
		}else if(key == 13){ // enter
			settoken(outp.childNodes[posi].getAttribute('data-tval'), -1, outp.childNodes[posi].getAttribute('data-ikid'));
			//settoken(outp.childNodes[posi].firstChild.nodeValue, -1, outp.childNodes[posi].getAttribute('data-ikid'));
			setvis("hidden");
			posi = -1;
			return 0;
		}else{
			if(callbackkeyup) callbackkeyup(event);
		}
	}
	
	function settoken(tv, nsv, id)
	{
		var objt = obj;
		
		var selvals = lastcpos;
		
		if(nsv < 0) nsv = selvals + 1;
		
		var ssv = objt.getAttribute('data-ttokentrigonsv');

		objt.setAttribute('data-ttokentrigon', 0);
		
		var obfb = objt.innerText.substr(0, ssv - 1);
		var obeb = objt.innerText.substr(nsv);
		
		objt.focus();
		restoreSelection();
		var ncdp = getCaretPosition(obj);
		var fromAmpDistance = ncdp - ssv;
		
		for(var i=0; i<fromAmpDistance+1; i++)
		{
			window.getSelection().deleteFromDocument();
		}
		pasteHtmlAtCaret(dataset(tv, id, worddt[id] ?  worddt[id] : voldwworddt[id]));
		objt.focus();
	}
	
	function setcolor(_posi, _color, _forg)
	{
		outp.childNodes[_posi].style.background = _color;
		outp.childNodes[_posi].style.color = _forg;
	}
	
	function setvis(visi)
	{
		if(!outp) return 0;
		outp.style.visibility = visi;
		//if(visi == "hidden") obj.setAttribute('data-ttokentrigon', 0);
	}
	
	function lookat(md)
	{
		var selvals = getCaretPosition(obj);
		var objtcv = obj.innerText.replace(/\n/g, "").replace(/\r/g, "");
		var objtc = objtcv.substr(selvals - 1, 1);
		
		
		if(objtc == '@')
		{	
			obj.setAttribute('data-ttokentrigon', 1);
			obj.setAttribute('data-ttokentrigonsv', selvals);
			saveSelection2();
		}
		
		if(obj.getAttribute('data-ttokentrigon') == 0) return 0;
		var nsv = obj.getAttribute('data-ttokentrigonsv');
		
		var ins = objtcv.substr(nsv, selvals - nsv).toLowerCase();
		
		if (posi > -1);
		else if (ins.length > 0)
		{
			if(!md)
			{
				if(oldins != ins)
					words = getword(ins);
			}
			
			oldins = ins;
			
			//if(words.length == 0)
			{
				words = voldwords;
				worddt = voldwworddt;
				wids = voldwwids;
			}
			
			if (words.length > 0)
			{
				clearoutput();
				for (var i=0;i<words.length; ++i) addword (words[i], wids[i], i);
				setvis("visible");
				input = obj.innerText;
			}else{
				setvis("hidden");
				posi = -1;
			}
		}else{
			setvis("hidden");
			posi = -1;
		}
		oldins = ins;
	}
	
	function addword(word, id, rid)
	{
		var sp = document.createElement("div");

		if(worddt[rid].dsc)
			var dsc = worddt[rid].dsc;
		else
			var dsc = "";
			
		var img = "";
		
		if(worddt[rid].lid)
		{
			img = "<img style='float: left; margin: 2px 0 2px;' onerror='failsafe_img(this, 3);' src='data/u" + worddt[rid].lid + "/dp/3.jpg'/>";
		}
			
		sp.innerHTML = img + "<p style='margin-left: 30px'>" + word + "<br/><i style='color: #808080;'>" + dsc + "</i></p><div style='clear: both;'></div>";
		
		
		sp.onmouseover = mousehandler;
		sp.onmouseout = mousehandlerout;
		sp.onclick = mouseclick;
		sp.className = "tag_complete_line";
		sp.setAttribute('data-ikid', rid);
		sp.setAttribute('data-tval', word)
		
		outp.appendChild(sp);
	}
	
	function clearoutput()
	{
		while(outp.hasChildNodes())
		{
			noten = outp.firstChild;
			outp.removeChild(noten);
		}
		posi = -1;
	}
	
	function getword(beginning)
	{
		var words = new Array();
		wids = new Array();
		
		var dset = dataget(beginning, returning_words);
		
		/*for (var i=0;i<dset.length; ++i)
		{
			var j = -1;
			var correct = 1;
			var sugval = dset[i].name.toLowerCase();
			
			while (correct == 1 && ++j < beginning.length)
			{
				if (sugval.charAt(j) != beginning.charAt(j)) correct = 0;
			}
			
			if (correct == 1) worddt[words.length] = dset[i];
			if (correct == 1) words[words.length] = dset[i].name;
			if (correct == 1) wids[wids.length] = i;
		}
		*/
		return words;
		
		return words;
	}
	
	function returning_words(beginning, dset)
	{
		var words = new Array();
		wids = new Array();
		
		for (var i=0;i<dset.length; ++i)
		{
			var j = -1;
			var correct = 1;
			var sugval = dset[i].name.toLowerCase();
			
			while (correct == 1 && ++j < beginning.length)
			{
				if (sugval.charAt(j) != beginning.charAt(j)) correct = 0;
			}
			
			if (correct == 1) worddt[words.length] = dset[i];
			if (correct == 1) words[words.length] = dset[i].name;
			if (correct == 1) wids[wids.length] = i;
		}
		voldwworddt = worddt;
		voldwwids = wids;
		voldwords = words;
		lookat(1);
		
		return 1;
	}
	
	function mousehandler()
	{
		for (var i=0;i<words.length;++i)
			setcolor (i, color_b, color_t);
	
		this.style.background = color_bsel;
		this.style.color= color_tsel;
	}
	
	function mousehandlerout()
	{
		this.style.background = color_b;
		this.style.color = color_t;
	}
	
	function mouseclick()
	{
		//settoken(this.firstChild.nodeValue, -1, this.getAttribute('data-ikid'));
		settoken(this.getAttribute('data-tval'), -1, this.getAttribute('data-ikid'));
		setvis("hidden");
		posi = -1;
		oldins = this.firstChild.nodeValue;
	}
}


function minit()
{
	init_ajaxmain();
	//tokenize_setdiv($('txt'), $('output'), getlocations, makelocationtoken, function(v){$('outputse').innerHTML = v;});
}

function tokenized_init(obj)
{
	tokenize_setdiv(obj, $('tagcomplete_box'), gettagfriends, makeusertoken, function(v){$('newpostautocompfoutputse').innerHTML = v;});
}

function tokenized_init_loctag(obj, keyupcb)
{
	tokenize_setdiv(obj, $('tagcomplete_box'), getlocations, makelocationtoken, 0, keyupcb);
}

function tokenized_init_usertag(obj, keyupcb)
{
	tokenize_setdiv(obj, $('tagcomplete_box'), gettagfriends, makeusertoken, 0, keyupcb);
}

function makelocationtoken(it, iid, objloc)
{
	return "<i contentEditable='false' style='color: #CD8530; cursor: pointer; font-style: normal;' onclick='show_mapcard(this, 1, \"" + objloc.lt + "," + objloc.lg + "\");' data-lt='" + objloc.lt + "' data-lg='" + objloc.lg + "'>" + it + "</i> ";
}


function makeusertoken(it, iid, obj)
{
	if(!obj) return 0;
	return "<i data-value='[@[-" + it + "," + obj.uid + "," + obj.lid + "-]]' contentEditable='false' style='color: #6699cc; cursor: pointer; font-style: normal;'>" + it + "</i>";
}

function mapshow(mobj)
{
	if(!mobj) return 0;
	var lt = mobj.getAttribute('data-lt');
	var lg = mobj.getAttribute('data-lg');
	
	if(!lt) return 0;
	if(!lg) return 0;
	
	var edata = lt +"," + lg;
	
	$('newpostautocompfouttt').innerHTML = "<img style='cursor: pointer;' src='http://maps.googleapis.com/maps/api/staticmap?center=" + edata + "&zoom=11&size=335x200&sensor=false&amp;markers=" + edata + "'>";
}
	
function getlocations(keyf, fcallback)
{
	ajax_post("php/geo/getlocation.php?q=" + keyf, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var jm = {};
			jm = JSON.parse(xmlhttp.responseText);
			fcallback(keyf, jm);
		}
	});
	return 1;//suggestions;
}

function gettagfriends(keyf, fcallback)
{
	if(!keyf) return 1;
	
	if(!cached_friendlist)
	{
		ajax_post("php/tasks/getfriendlist.php", function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "")
				{
					var jm = {};
					jm = JSON.parse(xmlhttp.responseText);
					
					cached_friendlist = jm;
					
					var nm = search_cachedlist(cached_friendlist, keyf);
					
					/* [todo] need to optimize according to http://code.flickr.com/blog/2009/03/18/building-fast-client-side-searches/ */
					
					fcallback(keyf, nm.users);
					return 0;
				}else{
					return 0;
				}
			}});
			
		return 0;
	}
	
	var nm = search_cachedlist(cached_friendlist, keyf);
	fcallback(keyf, nm.users);
	
}

function blog_publishnew()
{
	var otitle = $('blog_newarticle_cttitle');
	var otext = $('blog_newarticle_text');
	
	var fhtml = otitle.innerText + ":endof-natfie-title:" + otext.innerHTML;
	
	ajax_postbig("php/tasks/newarticle.php", "d", fhtml.replace(/\n\r?/g, '[-n-l-]'), function(){
		if (xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200)
			{
				if(xmlhttp.responseText == "1")
				{
					blog_closenew();
					
				}else{
					
				}
			}else{
				
			}
		}});
}

function blog_closenew()
{
	$('blog_newarticle_ct').style.display = "none";
	$('blog_newarticle_btn').style.display = "";
}

function blog_startnew()
{
	$('blog_newarticle_ct').style.display = "";
	$('blog_newarticle_btn').style.display = "none";
	$('blog_newarticle_cttitle').focus();
}

function blog_format_action(id)
{

	switch(id)
	{

	case 1: /* Image */
		blog_insert_at_caret("im");
		break;
		
	case 2: /* Link */
		break;
		
	case 3: /* Video */
		break;
		
	case 4: /* Music */
		break;
		
	case 5: /* Heading */
		break;
		
	case 6: /* List */
		break;
		
	case 7: /* Table*/
		break;
		
	case 8: /* Quote */
		alert(blog_get_selected_text());
		break;
		
	case 9: /* Highlight */
		blog_insert_at_caret("<mark>" + blog_get_selected_text() + "</mark>");
		
		break;

	}

	

}

function blog_insert_at_caret(html)
{
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function blog_get_selected_text()
{
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

