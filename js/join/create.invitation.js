

function cnai_viewpass()
{
	$("cpass1").style.display = '';
	$("cpass2").style.display = '';
}

function cnai_directsend()
{
	$("cnai_send").click();
}

function cnai_precheck(sm)
{
	
	var ocnafname  = $("cnafname");
	var ocnalname  = $("cnalname");
	var ocnaemail  = $("cnaemail");
	var ocnainv    = $("cnainvi");
	var ocnapass   = $("cnapass");
	var ocnacpass  = $("cnacpass");
	
	var wtext = "";
	var pr = 1;
	var allok = 1;
	
	if(trim(ocnafname.value).length < 2) {$("bcnafname").style.borderColor = "#ff9797"; wtext = "You need to enter your first name."; allok = 0;}
	else if(!namevalid(ocnafname.value)) {$("bcnafname").style.borderColor = "#ff9797"; ocnafname.value = "(Invalid name, the name can't have numbers or punctuation.)"; wtext = "Invalid name"; allok = 0;}
	else {$("bcnafname").style.borderColor = "#82ad36";}
	
	if(trim(ocnalname.value).length < 2) {$("bcnalname").style.borderColor = "#ff9797"; wtext = "You need to enter your last name.";}
	else if(!namevalid(ocnalname.value)) {$("bcnalname").style.borderColor = "#ff9797"; ocnalname.value = "(Invalid name, the name can't have numbers or punctuation.)"; wtext = "Invalid name"; allok = 0;}
	else {$("bcnalname").style.borderColor = "#82ad36";}
	
	if(trim(ocnaemail.value).length < 4) {$("bcnaemail").style.borderColor = "#ff9797"; wtext = "Invalid email address"; allok = 0;}
	else if(!emailvalidate(ocnaemail.value)) {$("bcnaemail").style.borderColor = "#ff9797"; wtext = "Invalid email address"; allok = 0;}
	else {$("bcnaemail").style.borderColor = "#82ad36";}
	
	if(trim(ocnainv.value).length != 6) {$("bcnainvi").style.borderColor = "#ff9797"; wtext = "Invalid invitation code"; allok = 0;}
	else {$("bcnainvi").style.borderColor = "#82ad36";}
	
	if(ocnapass.value.length < 5) {$("bcnapass").style.borderColor = "#ff9797"; ocnapass.value = ""; ocnacpass.value = ""; wtext = "Password is too short"; pr = 0;}
	if(ocnacpass.value != ocnapass.value) {$("bcnacpass").style.borderColor = "#ff9797"; ocnapass.value = ""; ocnacpass.value = ""; wtext = "Passwords don't match"; pr = 0;}
	
	if(pr)
	{
		$("bcnapass").style.borderColor = "#82ad36";
		$("bcnacpass").style.borderColor = "#82ad36";
	}else{
		 allok = 0;
	}
	
	$("cnawarning").innerHTML = wtext; 
	
	if(allok)
	{
		if(!sm)
			$("cnai_send").click();
		return true;
	}else{
		return false;
	}
}

function $(id)
{
    return document.getElementById(id);
}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function namevalid(nm)
{
	if(nm.match(/[1234567890\.,-\/#!$%\^&\*;:{}=\-_`~()]/g)) return false;
	return true;
}

function emailvalidate(em)
{
	var ems = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
	return ems.test(em);
}