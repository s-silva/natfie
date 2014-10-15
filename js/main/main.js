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
