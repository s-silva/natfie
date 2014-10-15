
function settings_ieditset(idbox, objcall, emode)
{
	show_mitemh_autosave(idbox, function(){objcall.style.display = ""; objcall.innerText = $(idbox).value;});
	mhideitem_showitem = objcall;
	
	
	
	if(emode == 0 || emode == 1)
	{
		$(idbox).value = objcall.innerText;
		objcall.style.display = 'none';
		$(idbox).focus();
		
		$(idbox).onkeydown = function (e){
				e = e || event;
				if (e.keyCode === 13 && !e.shiftKey) {
					objcall.style.display = "";
					objcall.innerText = $(idbox).value;
					hide_mitemh(idbox);
				}else if (e.keyCode === 27 && !e.shiftKey) {
					hide_mitemh(idbox);
				}
			}
	}
	
	if($('settings_g_wbsave'))
		$('settings_g_wbsave').style.visibility = "visible";

}


function settingsgendapply_displaydetails()
{

	
	/*alert($('stgd_fname').value + " " + 
	$('stgd_mname').value + " " + 
	$('stgd_lname').value + " " + 
	$('stgd_gender').value + " " + 
	$('stgd_bmonth').value + " " + 
	$('stgd_bday').value + " " + 
	$('stgd_byear').value + " " + 
	$('stgd_dsc').value + " " + 
	$('stgd_email').value + " " + 
	$('stgd_cpass').value + " ");*/
	
	
	ajax_post("php/settings/actions/generaldiset.php?p=" + $('stgd_cpass').value + "&fn=" + $('stgd_fname').value + "&ln=" + $('stgd_lname').value + "&mn=" + $('stgd_mname').value + "&dsc=" + $('stgd_dsc').value + "&em=" + $('stgd_email').value + 
				"&by=" + $('stgd_byear').value + "&bm=" + $('stgd_bmonth').value + "&bd=" + $('stgd_bday').value + "&gn=" + $('stgd_gender').value, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		alert(	xmlhttp.responseText);
			if(xmlhttp.responseText != 0)
			{
				alert("done");
				overlaydialog_close();
			}
		}
	
	});
	
	
	
}

function settings_gwb_addwbrow(tbid)
{
	var o = $(tbid);
	if(!o) return 0;
	
	var rid = o.getAttribute('data-rcount');
	rid++;
	o.setAttribute('data-rcount', rid);
	
	var rw = o.insertRow(-1);
	
	rw.id = "settings_g_wbtbr_" + rid;
	
	if(!(rid % 2)) rw.className = "od";

	var c1 = rw.insertCell(0);
	var c2 = rw.insertCell(1);
	var c3 = rw.insertCell(2);
	       
		   
	c1.innerHTML = "<select style='display: none; font-size: 11px;' id='settings_g_wbtbrsel_" + rid + "'><option>Homepage:</option><option>Work:</option><option>Facebook:</option><option>Twitter:</option><option>DeviantArt:</option><option>Flickr:</option><option>MSN:</option><option>Skype:</option><option>Where I'm always at:</option><select><div onclick=\"javascript: settings_ieditset('settings_g_wbtbrsel_" + rid + "', this, 1);\" id='settings_g_wbtbrdk_" + rid + "'>Homepage:</div>";
	c2.innerHTML = "<div style='min-width: 200px; min-height: 20px; cursor: pointer;' onclick=\"javascript: settings_ieditset('settings_gwba_" + rid + "', this, 0);\" id='settings_g_wbtbrdv_" + rid + "'>http://example.com</div><input style='font-size: 11px; border: #efefef; min-width: 200px; display: none;' id='settings_gwba_" + rid + "'/>";
	c3.innerHTML = "<a href='javascript: settings_gwb_delwbrow(\"settings_g_wbtbr_" + rid + "\")'>x</a>";

	$('settings_g_wbsave').style.visibility = "visible";
	return 1;
}

function settings_gwb_delwbrow(trid)
{
	var o = $(trid);
	if(!o) return 0;
	var rw = o.parentNode;
	if(!rw) return 0;
	rw.removeChild(o);
	$('settings_g_wbsave').style.visibility = "visible";
}

function settings_gwb_save()
{
	var o = $("settings_g_wbtb");
	if(!o) return 0;
	
	var rc = o.getAttribute('data-rcount');
	
	var i;
	
	var dto = "[";
	
	for(i=0; i<rc; i++)
	{
		var dk = $('settings_g_wbtbrdk_' + (i + 1)); if(!dk) continue;
		var dv = $('settings_g_wbtbrdv_' + (i + 1)); if(!dv) continue;

		if(i) dto += ",";
		dto += "[\"" + dk.innerText + "\",\"" + dv.innerText +  "\"]";
	}
	
	dto += "]";
	
	ajax_postbig("php/settings/actions/generalwebset.php", "d", dto, function(){
		if (xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200)
			{
				if(xmlhttp.responseText == "1")
				{
					$('settings_g_wbsave').style.visibility = "hidden";
				}
			}
		}});
}

function settings_psrel_saventf()
{
	$('settings_ps_relsel').onchange = function(){
	
		if($('settings_ps_relsel').selectedIndex > 1)
		{
			$('settings_ps_relpersonrow').style.display = "";
		}else{
			$('settings_ps_relpersonrow').style.display = "none";
		}
	}
	
	$('settings_ps_relsave').style.visibility = "visible";
}

function settings_psrel_selfriend(fid, uname, udsc, ulid)
{
	var o = $('settings_ps_reluserbox');
	
	if(!o) return 0;
	
	o.setAttribute('data-uid', fid);
	o.innerHTML = "<b style='color: #336699;'>" + unescape(uname) + "</b> (Pending)<div><img src='data/u" + ulid + "/dp/1.jpg' onerror='failsafe_img(this, 1);'></div>";
	friendsearch_hidepopup();
	
	settings_psrel_saventf();
}

function settings_psrel_delperson()
{
	var o = $('settings_ps_reluserbox');
	
	if(!o) return 0;
	
	o.setAttribute('data-uid', 0);
	o.innerHTML = "Click here to select a person";
}


function settings_psrel_save()
{
	var o = $('settings_ps_reluserbox');
	var cbx = $('settings_ps_relsel');
	
	if(!cbx) return 0;
	if(!o) return 0;
	
	var uid = o.getAttribute('data-uid', 0);
	if(!uid) uid = 0;
	
	
	var rtype = cbx.selectedIndex;
	
	
	ajax_post("php/settings/actions/relationshipset.php?uid=" + uid + "&t=" + rtype, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText == "1")
			{
				$('settings_ps_relsave').style.visibility = "hidden";
			}else{
				alert(xmlhttp.responseText);
			}
		}
	
	});
}

function settings_dpmode_switch(dpfeed, dpmode)
{
	if(dpfeed == 1)
	{
		ajax_post("php/settings/actions/switchdisplay.php?v=" + dpmode, function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "0")
				{
					if(xmlhttp.responseText == "1")
					{
						var o = $('settingdpmfeed_1');
						if(o) o.style.visibility = "visible";
						o = $('settingdpmfeed_2');
						if(o) o.style.visibility = "hidden";
						
					}else{
					
						var o = $('settingdpmfeed_1');
						if(o) o.style.visibility = "hidden";
						o = $('settingdpmfeed_2');
						if(o) o.style.visibility = "visible";
					}
				}
			}
		
		});
	
	}
}