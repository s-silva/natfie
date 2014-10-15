var xmlhttp;

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