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













