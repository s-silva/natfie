var ppicset;
var current_profile_work_count = -1;
var current_profile_edu_count = -1;
var current_profile_act_count = -1;
var workedit_boxsel = -1;
var eduedit_boxsel = -1;
var actedit_boxsel = -1;
var last_inplacefield = 0;
var last_inplacefield_data = "";

function general_init()
{
	if($("detailcount"))
	{
		/*var slideshow = new Dragdealer('slidewrapper',
		{
		steps: 5,
		loose: true,
		animationCallback: function(x, y)
		{
			
		}
		});*/
		
		current_profile_work_count = $("detailcount").innerHTML;
		
		setonclickfunction("peditinplace_field", inplacefield_callback);
		
	}
}



function setonclickfunction(cls, func)
{
	var anchors = document.getElementsByTagName('div');
	for(var i = 0; i < anchors.length; i++) {
		var anchor = anchors[i];
		if(anchor.className == cls) {
			anchor.onclick = Function("inplacefield_callback('" + anchor.id + "')");
		}
	}
}

function profile_addwork(initval)
{
	var gbox = $("leftgroup_work");
	
	if(current_profile_work_count < 0) current_profile_work_count = initval;
	
	gbox.innerHTML += "<div class=\"infoleftbox\" id='pebox_work" + current_profile_work_count + "' onclick='javascript: pwboxedit_detail(" + current_profile_work_count + ", 0)'>" + 
					"<div id='pfinfo_work_plc" + current_profile_work_count + "' class=\"infoleftmain\">Workplace Name</div>" + 
					"<div id='pfinfo_work_loc" + current_profile_work_count + "' class=\"infoleftdetail1\">Location</div>" + 
					"<div id='pfinfo_work_dsc" + current_profile_work_count + "' class=\"infoleftdetail2\">Work Area</div>" + 
					"</div>";
					
	current_profile_work_count++;
}

function profile_addedu(initval)
{
	var gbox = $("leftgroup_edu");
	
	if(current_profile_work_count < 0) current_profile_work_count = initval;
	
	gbox.innerHTML += "<div class=\"infoleftbox\" id='pebox_work" + current_profile_work_count + "' onclick='javascript: pwboxedit_detail(" + current_profile_work_count + ", 1)'>" + 
					"<div id='pfinfo_work_plc" + current_profile_work_count + "' class=\"infoleftmain\">University/College/School Name</div>" + 
					"<div id='pfinfo_work_loc" + current_profile_work_count + "' class=\"infoleftdetail1\">Location</div>" + 
					"<div id='pfinfo_work_dsc" + current_profile_work_count + "' class=\"infoleftdetail2\">Concentration</div>" + 
					"</div>";
					
	current_profile_work_count++;
}

function profile_addactivity(initval)
{
	var gbox = $("leftgroup_activities");
	
	if(current_profile_work_count < 0) current_profile_work_count = initval;
	
	gbox.innerHTML += "<div class=\"infoleftbox\" id='pebox_work" + current_profile_work_count + "' onclick='javascript: pwboxedit_detail(" + current_profile_work_count + ", 2)'>" + 
					"<div id='pfinfo_work_plc" + current_profile_work_count + "' class=\"infoleftmain\">Activity Title</div>" + 
					"<div id='pfinfo_work_loc" + current_profile_work_count + "' class=\"infoleftdetail1\">Location</div>" + 
					"<div id='pfinfo_work_dsc" + current_profile_work_count + "' class=\"infoleftdetail2\">Description</div>" + 
					"</div>";
					
	current_profile_work_count++;
}

function pwboxedit_detaildeletesel()
{
	var lbox = $("pebox_work" + workedit_boxsel);
	lbox.innerHTML = "";
	lbox.style.display = 'none';
	
	ajax_post("php/profile/deleteuserdetail.php?udid="+ workedit_boxsel, 0);
			
}

/*
 * dtype - 0 - work
 *         1 - edu
 *         2 - act
 */

function pwboxedit_detail(boxid, dtype)
{
	var savebtn = 0;
	var pebox_name = "pebox_work";
	var pedit_name = "peditwork";
	var modes = "work";
	
	if(dtype == 1) modes = "edu";
	else if(dtype == 2) modes = "act";
	
	if(dtype == 1) pedit_name = "peditedu";
	else if(dtype == 2) pedit_name = "peditact";

	
	if(pwboxedit_detail.ignore_next == 1)
	{
		pwboxedit_detail.ignore_next = 0;
		return;
	}
	
	if(workedit_boxsel == boxid) return;
	if(boxid == -1)
	{
		savebtn = 1;
		boxid = workedit_boxsel;
	}


	if(workedit_boxsel != -1) // last selection exists
	{
		var lbox = $(pebox_name + workedit_boxsel);
		if(savebtn)
		{
			var str =    "<div id='pfinfo_work_plc" + workedit_boxsel + "' class=\"infoleftmain\">" + $("profile" + modes + "edit_place").value + "</div>" + 
						 "<div id='pfinfo_work_loc" + workedit_boxsel + "' class=\"infoleftdetail1\">" + $("profile" + modes + "edit_location").value + "</div>" + 
						 "<div id='pfinfo_work_dsc" + workedit_boxsel + "' class=\"infoleftdetail2\">" + $("profile" + modes + "edit_description").value + "</div>";
								
					
			ajax_post("php/profile/setuserdetail.php?udid="+ workedit_boxsel +"&udtype=" + dtype + "&udd1="+$("profile" + modes + "edit_place").value+"&udd2="+$("profile" + modes + "edit_location").value+"&udd3="+$("profile" + modes + "edit_description").value+"&udid1="+"0"+"&udid2="+"0"+"&udid3="+"0"+"&udid4=0&udid5=0", 0);
			
		}else{
	
			var str =    "<div id='pfinfo_work_plc" + workedit_boxsel + "' class=\"infoleftmain\">" + pwboxedit_detail.pwplace + "</div>" + 
						 "<div id='pfinfo_work_loc" + workedit_boxsel + "' class=\"infoleftdetail1\">" + pwboxedit_detail.pwloc + "</div>" + 
						 "<div id='pfinfo_work_dsc" + workedit_boxsel + "' class=\"infoleftdetail2\">" + pwboxedit_detail.pwdsc + "</div>";
		}
		
		lbox.innerHTML = str;
	}
	
	if(!savebtn)
	{
		var ebox = $(pebox_name + boxid);
		var editbox = $(pedit_name);
		
		
		pwboxedit_detail.pwplace = $("pfinfo_work_plc" + boxid).innerHTML;
		pwboxedit_detail.pwloc = $("pfinfo_work_loc" + boxid).innerHTML;
		pwboxedit_detail.pwdsc = $("pfinfo_work_dsc" + boxid).innerHTML;
		
		
		ebox.innerHTML = editbox.innerHTML.replace(/69/g, "");
		//ebox.style.display = 'none';
		
		$("profile" + modes + "edit_place").value = pwboxedit_detail.pwplace;
		$("profile" + modes + "edit_location").value = pwboxedit_detail.pwloc;
		$("profile" + modes + "edit_description").value = pwboxedit_detail.pwdsc;
	
	}
	

	workedit_boxsel = boxid;
	
	if(savebtn){ workedit_boxsel = -1; pwboxedit_detail.ignore_next = 1; }
}


/*
function pwboxedit_work(boxid)
{
	var savebtn = 0;

	
	if(pwboxedit_work.ignore_next == 1)
	{
		pwboxedit_work.ignore_next = 0;
		return;
	}
	
	if(workedit_boxsel == boxid) return;
	if(boxid == -1)
	{
		savebtn = 1;
		boxid = workedit_boxsel;
	}


	if(workedit_boxsel != -1) // last selection exists
	{
		var lbox = $("pebox_work" + workedit_boxsel);
		if(savebtn)
		{
			var str =    "<div id='pfinfo_work_plc" + workedit_boxsel + "' class=\"infoleftmain\">" + $("profileworkedit_place").value + "</div>" + 
						 "<div id='pfinfo_work_loc" + workedit_boxsel + "' class=\"infoleftdetail1\">" + $("profileworkedit_location").value + "</div>" + 
						 "<div id='pfinfo_work_dsc" + workedit_boxsel + "' class=\"infoleftdetail2\">" + $("profileworkedit_description").value + "</div>";
								
								
			ajax_post("php/profile/setuserdetail.php?udid="+ workedit_boxsel +"&utype=0&udd1="+$("profileworkedit_place").value+"&udd2="+$("profileworkedit_location").value+"&udd3="+$("profileworkedit_description").value+"&udid1="+"0"+"&udid2="+"0"+"&udid3="+"0"+"&udid4=0&udid5=0", 0);
			
		}else{
	
			var str =    "<div id='pfinfo_work_plc" + workedit_boxsel + "' class=\"infoleftmain\">" + pwboxedit_work.pwplace + "</div>" + 
						 "<div id='pfinfo_work_loc" + workedit_boxsel + "' class=\"infoleftdetail1\">" + pwboxedit_work.pwloc + "</div>" + 
						 "<div id='pfinfo_work_dsc" + workedit_boxsel + "' class=\"infoleftdetail2\">" + pwboxedit_work.pwdsc + "</div>";
		}
		
		lbox.innerHTML = str;
	}
	
	if(!savebtn)
	{
		var ebox = $("pebox_work" + boxid);
		var editbox = $("peditwork");
		
		
		pwboxedit_work.pwplace = $("pfinfo_work_plc" + boxid).innerHTML;
		pwboxedit_work.pwloc = $("pfinfo_work_loc" + boxid).innerHTML;
		pwboxedit_work.pwdsc = $("pfinfo_work_dsc" + boxid).innerHTML;
		
		
		ebox.innerHTML = editbox.innerHTML.replace(/69/g, "");
		//ebox.style.display = 'none';
		
		$("profileworkedit_place").value = pwboxedit_work.pwplace;
		$("profileworkedit_location").value = pwboxedit_work.pwloc;
		$("profileworkedit_description").value = pwboxedit_work.pwdsc;
	
	}
	

	workedit_boxsel = boxid;
	
	if(savebtn){ workedit_boxsel = -1; pwboxedit_work.ignore_next = 1; }
}
*/

/* ------------- in place field editing -------------------- */


function inplacefield_callback(id)
{
	var ebox = $(id);
	
	if(last_inplacefield != id)
	{
		if(last_inplacefield)
		{
			$(last_inplacefield).innerText = last_inplacefield_data;
		}
		
		
		last_inplacefield_data = ebox.innerText;
		
		if(id.substr(0, 6) == "peipfi")
			ebox.innerHTML = "<div class='inplacefield'><div class='inforightddata_input'><input type='text' id='tarea_" + id + "' value='" + last_inplacefield_data + "' onkeydown='javascript:inplacefield_key(\"" + id + "\", event);'/></div></div>";
		else
			ebox.innerHTML = "<div class='inplacefield'><textarea style='width:" + ebox.offsetWidth + "px; height:" + ebox.offsetHeight + "px;' id='tarea_" + id + "'>" + last_inplacefield_data + "</textarea><div class='profileinplace_buttons'><a style='background: #ffffff; color: #555555; border: 1px solid #dddddd;' href='javascript:inplacefield_cancel();'/>Cancel</a><a href='javascript:inplacefield_save(\"" + id + "\");'/>Save</a></div><div style='clear:both;'></div></div>";
		$("tarea_" + id).focus();
	}
	
	last_inplacefield = id;
}

function inplacefield_key(id, e)
{
	if(e.keyCode == 13) inplacefield_save(id);
	else if(e.keyCode == 27) inplacefield_cancel();
}


function inplacefield_save(id)
{
	if(last_inplacefield)
	{
		var val;
		val = $("tarea_" + id).value;
		
	
		//ajax_post("php/profile/setdetail.php?f=" + last_inplacefield + "&v=" + val, 0);
		ajax_postbig("php/profile/setdetail.php?f=" + last_inplacefield, "d", val.replace(/\n\r?/g, '[-n-l-]'), function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText == "1")
				{
					if(val.length == 0)
						$(last_inplacefield).innerText = "(none)";
					else
						$(last_inplacefield).innerText = val;
						
					last_inplacefield = 0;
					last_inplacefield_data = "";
				}
			}});
	}
	
	
	
	
}

function inplacefield_cancel()
{
	if(last_inplacefield)
	{
		$(last_inplacefield).innerText = last_inplacefield_data;
	}
	
	last_inplacefield = 0;
	last_inplacefield_data = "";
}