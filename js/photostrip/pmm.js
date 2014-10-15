var ppmds_x = 0;
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









