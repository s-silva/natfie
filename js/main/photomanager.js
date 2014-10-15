var photomanager_cpicarray = [];

function photomanager_resize()
{
/*	var o = $('photomm_co');
	var oo = $('photomm_ci');
	o.style.height = (g_win_height - o.offsetTop - 5) + 'px';
	oo.style.height = (g_win_height - oo.offsetTop - 7) + 'px';*/
	return 0;
}

function photomanager_switch(m)
{
	var o = $('pha_content');
	
	if(!o) return 0;
	
	o.innerHTML = get_preloader(32, 50);
	
	var calbumid = "0";
	
	var otabtitle = $('photomm_tlbtniname');
	if(otabtitle)
	{
		calbumid = otabtitle.getAttribute("data-albumid");
	}
	
	
	
		
	ajax_post("php/pages/getalbums.php?id=" + m + "&albid=" + calbumid, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText != "")
			{
				o.innerHTML = xmlhttp.responseText;
				synctime_set(o);
				
				var cpa = $("photomgalbpvlist");
	
				if(cpa)
				{
					photomanager_cpicarray = {};
					photomanager_cpicarray = JSON.parse(cpa.innerHTML);
							
				}else{
					photomanager_cpicarray = 0;
				}
				
				lazyloadimg_clear();
				add_lazyloading(document);
				
				o.parentNode.onscroll = function (ct)
							{
								var x = o.parentNode.scrollLeft,
									y = o.parentNode.scrollTop;

								if(g_scroll_x != x || g_scroll_y != y)
								{
									g_scroll_x = x;
									g_scroll_y = y;
									if(typeof (window.lazyloadimg_scroll) == 'function')lazyloadimg_scroll(x, y);
								}
							}
	
			}else{
				o.innerHTML = "<div class='pha_bigmessage'><b>Sorry, couldn't load page</b><br/>Try reloading...</div>";
			}
		}
	
	});
	
	
	
	var tobj = $('photomm_tlbtn' + m);
	
	if(!tobj) return 0;
	
	$('photomm_tlbtn1').className = "photomm_tlbtn";
	$('photomm_tlbtn2').className = "photomm_tlbtn";
	$('photomm_tlbtn3').className = "photomm_tlbtn";
	
	tobj.className = "photomm_tlbtn photomm_tlbtns";

}


function photomanager_viewalbumset(albumid, albumname)
{
	var otabtitle = $('photomm_tlbtniname');
	if(otabtitle)
	{
		otabtitle.innerHTML = albumname;
		otabtitle.setAttribute("data-albumid", albumid);
	}
	photomanager_switch(2);
}

function photomanager_photoview(photoid, listobj)
{
	var fi = -1;
	
	for(var i=0; i<photomanager_cpicarray.length; i++)
	{
		if(photomanager_cpicarray[i].id == (photoid ))
		{
			fi = i;
			break;
		}
	}
	
	if(fi < 0) return 0;
	
	post_expand_photoset(fi- 1, photomanager_cpicarray.length);
	
	if($(listobj + "_dpp"))
		$('spwdvdp').style.background = "url('data/u" + $(listobj + "_dpp").innerHTML + "/dp/2.jpg')";
	
	if($(listobj + "_albtt"))
		$('spwdvtitle').innerHTML     = $(listobj + "_albtt").innerHTML;
	
	if($(listobj + "_dsc"))
		$('spwdvdsc').innerHTML       = $(listobj + "_dsc").innerHTML;
	
	if($(listobj + "_ptt"))
		$('spwdvuname').innerHTML     = $(listobj + "_ptt").innerHTML;
	
}

function photomanager_listgetphoto(pid)
{
	if(!photomanager_cpicarray) return 0;

	if(pid < 0) return 0;
	else if(pid >= photomanager_cpicarray.length) return 0;

	return "<div class=\"pmmd_photo\"><img onerror='failsafe_imgphoto(this, 1);' id='pmmdimg_" + (pid + 1) + "' src=\"" + photomanager_cpicarray[pid].fn + "\"/></div>";
}

function photomanager_listgetphotocache(pid)
{
	if(!photomanager_cpicarray) return 0;

	if(pid < 0) return 0;
	else if(pid >= photomanager_cpicarray.length) return 0;

	return "<div class='pmmdtcimgout'><img id='pmmdtcimg_" + (pid + 1) + "' src=\"" + photomanager_cpicarray[pid].fn + "\" width='120px'/></div>";
}

function photomanager_listphotogetpostid(pid)
{
	if(!photomanager_cpicarray) return 0;

	if(pid < 0) return 0;
	else if(pid >= photomanager_cpicarray.length) return 0;

	return photomanager_cpicarray[pid].postid;
}


function photomanager_delpic(dobj, pindex, picid)
{
	var pdn = dobj.parentNode.parentNode.parentNode;
	
	if(!pdn) return 0;
	
	pdn.style.display = "none";
	
	var fi = -1;
	
	for(var i=0; i<photomanager_cpicarray.length; i++)
	{
		if(photomanager_cpicarray[i].id == pindex)
		{
			fi = i;
			break;
		}
	}
	
	if(fi >= 0)
		photomanager_cpicarray.splice(fi, 1);
		
	pmmd_ps_count = photomanager_cpicarray.length;
	
	lazyloadimg_scroll(0, 0);
	
	ajax_post("php/tasks/photodel.php?id=" + picid, function(){
		if(xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200 && xmlhttp.responseText == "1")
			{
			}else{
				pdn.style.display = "";
				pdn.className = "photomm_cipic err";
			}
		}
	
	});
}


function photomanager_delalbum(dobj, albumid)
{
	var pdn = dobj.parentNode.parentNode.parentNode.parentNode;
	
	if(!pdn) return 0;
	
	pdn.style.display = "none";
	
	lazyloadimg_scroll(0, 0);
	
	ajax_post("php/tasks/albumdel.php?id=" + albumid, function(){
		if(xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200 && xmlhttp.responseText == "1")
			{
			}else{
				pdn.style.display = "";
				pdn.className = "pha_thumbalbct err";
			}
		}
	
	});
}