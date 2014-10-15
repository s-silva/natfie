function $(id){return document.getElementById(id);}

function guestlogin_show()
{
	
	var o = document.getElementById("guestlogin");
	
	o.innerHTML = "<form name='loginformname' method='post' id='loginformname' class='loginformid' enctype='application/x-www-form-urlencoded' action='testlog.php'>" +
		"<div style='float:left; width: 0px; overflow: hidden;' id='mgdv'><div style='float:left; width: 500px;'><div style='float:left; margin-right: 10px;'><div><input type='submit' id='glbsubmit' name='login' value='Log In' style='visibility: hidden; padding: 0; margin: 0;' class='login_button'/><label><input type='checkbox' name='rememberme' value='1' style='margin-top: 5px; vertical-align: top;'/>Remember Me</label></div></div>" +
			
		"<div style='float:left;'><div><div style='float: left;'><div class='login_fborder'><input value='' placeholder='Email address' title='Email' size='20' type='text' id='username' name='username' maxlength='2048' style='border: none; outline-style: none;' spellcheck='false'></div></div>" + 
		"<div style='float: left; margin: 0 2px;'><div class='login_fborder'><input value='' placeholder='Password'title='Password' size='20' type='password' id='password' name='password' maxlength='2048' style='border: none; outline-style: none;' spellcheck='false'></div></div>" +

		
		"<input name='action' id='action' value='login' type='hidden'> " +
		"</div></div>" +
			
	"</div></div><div style='float:right; margin-left: 5px;'><div class='guestloginbtn themecolorv3' id='guestloginbtn' onclick='javascript: guestlogin_login();'>Login</div></div></form>";
	
	document.getElementById("username").focus();
	
	guestlogin_rollout(document.getElementById("mgdv"), 0, 180);
	
}

function guestlogin_login()
{
	document.getElementById("glbsubmit").click();
}

function guestlogin_rollout(itm, v, a)
{
	if(v < 420)
	{
		itm.style.width = v + 'px';
		v += a;
		a /= 1.5;
		setTimeout(function (){guestlogin_rollout(itm, v, a);}, 100);
	}else{
		itm.style.width = '420px';
	}
}