
/*                    back       title      text       */
var colorsets =    [["#ffffff", "#333333", "#333333"], 
					["#9ebeff", "#ffffff", "#000000"], 
					["#5d7dbe", "#ffffff", "#000000"],
					["#f0f0f0", "#000000", "#000000"],
					["#ff4e4e", "#ffffff", "#000000"],
					["#ffdf5d", "#ffffff", "#000000"],
					["#ff9e5d", "#ffffff", "#000000"],
					["#7ddf9e", "#ffffff", "#000000"],
					["#7d9ebe", "#ffffff", "#000000"],
					["#ffcc00", "#ffffff", "#000000"]];
					
var content_x = 0;
var content_y = 0;
var proper_cx = 0;
var old_cx = 0;
var proper_cy = 0;
var old_cy = 0;
var content_moving = 0;
var content_selected = 1;

var c_r, c_b, c_g;

var box_count_x = 0;
var box_count_y = 0;

var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var _debug = $('debug');    // makes life easier
var home_mdown = 0;
var last_view_item = null;

var content_zoom_x = 1.0;
var content_zoom_y = 1.0;
var content_zoom = 1.0;
var box_rw = 170 * 2;
var box_rh = 100 * 2;
var box_w = box_rw + 24;
var box_h = box_rh + 24;
var box_font_n_size = 9;
var content_single_color = 1;

function home_addbox(x, y, title, data /* html data inside */, color)
{
	var str = document.getElementById("content").innerHTML;
	var itemname = "b" + x + "_" + y;
	
	//document.getElementById("content").innerHTML = str + "<div class=\"box\" id=\"" + itemname +  "\" style=\"left: " + (x * box_w) + "px; top: " + (y * box_h) + "px; background:" + colorsets[color][0] + ";\"><h1 id=\"h" + itemname + "\" style=\"color: " + colorsets[color][1] + ";\">" + title + "</h1><p style=\"color: " + colorsets[color][2] + ";\">" + data + "</p></div>";
	document.getElementById("content").innerHTML = str + "<div class=\"box\" id=\"" + itemname +  "\" style=\"left: " + (x * box_w) + "px; top: " + (y * box_h) + "px;\"><h1 id=\"h" + itemname + "\" style=\"color: " + colorsets[color][1] + ";\">" + title + "</h1><p style=\"color: " + colorsets[color][2] + ";\">" + data + "</p></div>";
	
	//if(content_zoom_x != 1.0)
		$(itemname).style.width = Math.floor(box_rw) + 'px';
		
	//if(content_zoom_y != 1.0)
		$(itemname).style.height = Math.floor(box_rh) + 'px';
}

function rand(max)
{
	return Math.floor(Math.random()*max);
}


function shift_colors()
{
	var c, r, g, b;
	
	for(i=0; i<colorsets.length; i++)
	{
		c = colorsets[i][0];
		
		r = hexToR(c);
		g = hexToR(c);
		b = hexToR(c);

		rgb_shift(60, 50, 50, r, g, b);
		
		c = rgbToHex(c_r, c_g, c_b);
		
		colorsets[i][0] = c;
	}
}


function rgbToHex(R,G,B) {return '#'+toHex(R)+toHex(G)+toHex(B)}
function toHex(n)
{
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16)
	  + "0123456789ABCDEF".charAt(n%16);
}
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function wrap_color(x)
{
	return x < 0 ? 0 : (x > 255 ? 255 : x);
}

function rgb_shift(h, s, v, r, g, b)
{
	var _a, _b, _c, pc;
	var osc;
	
	h = (h * 3.5);
	s = (s * 2.5);
	v = (wrap_color( (((v + 50) * 2) * ((r + g + b) / 3)) / 255 ));


	pc  = Math.floor(h / 60);
	osc = (((h * 100) / 6)) - ((h / 60) * 1000);

	_a = (((255 - s) * v) / 255);
	_b = (((255 - ((s * osc) / 1000)) * v) / 255);
	_c = (((255 - ((s * (1000 - osc)) / 1000)) * v) / 255);

	switch(pc)
	{
	case 0: c_r =  v; c_g = _c; c_b = _a; break;
	case 1: c_r = _b; c_g =  v; c_b = _a; break;
	case 2: c_r = _a; c_g =  v; c_b = _c; break;
	case 3: c_r = _a; c_g = _b; c_b =  v; break;
	case 4: c_r = _c; c_g = _a; c_b =  v; break;
	case 5: c_r =  v; c_g = _a; c_b = _b; break;
	}
	
	c_r = wrap_color(c_r);
	c_g = wrap_color(c_g);
	c_b = wrap_color(c_b);
}

function slide_fix()
{
	if(!home_mdown)
	{
	
		var ct = document.getElementById("content");
		
		if(content_x != proper_cx)
		{
			var d = content_x - proper_cx;
			d /= 2;

			content_x -= d;
			
			//if(content_x < -500)
			{
				if(content_x < proper_cx + 4 && content_x > proper_cx - 4)
					content_x = proper_cx = -box_w;
			}
			
			ct.style.left = content_x + 'px';
		}
		
		if(content_y != proper_cy)
		{
			var d = content_y - proper_cy;
			d /= 2;
			content_y -= d;
			
			//if(content_y < -500)
			{
				if(content_y < proper_cy + 4 && content_y > proper_cy - 4)
					content_y = proper_cy = -box_h;
			}
				
			ct.style.top = content_y + 'px';
		}

	}
	
	setTimeout("slide_fix()", 50);
}

function posts_init()
{

	/* samples */
	
	var sampletitle = "<a href=\"#\">James Walker</a>";
	var sampledata  = "<a href=\"#\">I have often walked down the street before, but the pavement always stayed beneath my feet before. all that once am i several stories high, knowing I'm on the street where you live.</a>";
	
	var x, y;
	
	
	
	
	if(content_zoom_x != 1.0)
	{
		box_rw *= content_zoom_x;
		box_w = box_rw + (22);
	}
	
	if(content_zoom_y != 1.0)
	{
		box_rh *= content_zoom_y;
		box_h = box_rh + (22);
	}
	
	box_count_x = 6;
	box_count_y = 4;
	
	//shift_colors();
	
	for(y=0; y<box_count_y; y++)
	{
		for(x=0; x<box_count_x; x++)
		{
			if(content_single_color)
				home_addbox(x, y, sampletitle, sampledata, 0);
			else
				home_addbox(x, y, sampletitle, sampledata, rand(colorsets.length));
		}
	}
	
	if(content_zoom != 1.0)
	{
		$("content").style.MozTransform = "scale(" + content_zoom + ")";
		$("content").style.zoom = content_zoom;
	}


	slide_fix();
	

}


function home_mmove(ev)
{

}

function home_mup()
{
	home_mouse_down = 0;
}

function home_mdown()
{
	home_mouse_down = 1;
}


function OnDblClick(e)
{
	 if (e == null) 
        e = window.event; 
		
	if(last_view_item)
	{
		restore_item(last_view_item);
		return;
	}

    var target = e.target != null ? e.target : e.srcElement;
   
    if (target.className == 'box' || target.parentElement.parentElement.className == 'box')
    {
		if(target.className != 'box')
			target = target.parentElement.parentElement;
		
		target.style.width = (box_rw * 3) + (16 * 3) - 1 + 'px';
		target.style.height = (box_rh * 3) + (16 * 3) - 1 + 'px';
		target.style.background = "#ffffff";
		target.style.zIndex = 10000;
		last_view_item = target;
	}
}

function restore_item(target)
{
	target.style.width = box_rw + 'px';
	target.style.height = box_rh + 'px';
	target.style.background = "#fafafa";
	target.style.zIndex = 0;
}

InitDragDrop();

function InitDragDrop()
{
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
	document.ondblclick = OnDblClick;
	
}

function OnMouseDown(e)
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
        e = window.event; 
		
	home_mdown = 1;
	content_moving = 0;
	
	
	var ntarget = e.target != null ? e.target : e.srcElement;
	
	if(last_view_item != null && !((last_view_item == ntarget) || (last_view_item == ntarget.parentElement) || (last_view_item == ntarget.parentElement.parentElement)))
	{
		restore_item(last_view_item);
		last_view_item = null;
	}
	
	if(last_view_item) return;
    
    // IE uses srcElement, others use target
    var target = $("content");//e.target != null ? e.target : e.srcElement;
   

    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || 
        e.button == 0) && (ntarget.className == 'homecontent' || ntarget.className == 'chatntf' || ntarget.className == 'box' || ntarget.parentElement.className == 'box' || ntarget.parentElement.parentElement.className == 'box'))
    {
		content_selected = 1;
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        
        // grab the clicked element's position
        old_cx = _offsetX = ExtractNumber(target.style.left);
        old_cy = _offsetY = ExtractNumber(target.style.top);
        
        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        //target.style.zIndex = 10000;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;
        
        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        // prevent text selection (except IE)
        return false;
    }else{
		content_selected = 0;
	}
}

function OnMouseMove(e)
{
    if (e == null) 
        var e = window.event; 
		
	content_x = (_offsetX + e.clientX - _startX);
	content_y = (_offsetY + e.clientY - _startY);
	
	if(content_x > 0) content_x = 0;
	if(content_y > 0) content_y = 0;
	

	if((content_x > old_cx + 40 || content_x < old_cx - 40) || content_moving)
	{
		_dragElement.style.left = content_x + 'px';
		 content_moving = 1;
	}else{
		content_x = old_cx;
	}

    // this is the actual "drag code"
   
	if((content_y > old_cy + 40 || content_y < old_cy - 40) || content_moving)
	{
		_dragElement.style.top = content_y + 'px';
		content_moving = 1;
	}else{
		content_y = old_cy;
    }
	
	
}

function OnMouseUp(e)
{
	home_mdown = 0;
    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;

		if(old_cx > content_x + 100)
			proper_cx = content_x - (content_x % box_w) - box_w;
		else if(old_cx < content_x - 100)
			proper_cx = content_x - (content_x % box_w);
	
		if(old_cy > content_y + 100)
			proper_cy = content_y - (content_y % box_h) - box_h;
		else if(old_cy < content_y - 100)
			proper_cy = content_y - (content_y % box_h);
    }
}

function wheel_document(e)
{
	if(!content_selected) return false;
	
    var evt=window.event || e;
    var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta;
    //nextslideindex=(delta<=-120)? nextslideindex+1 : nextslideindex-1 //move image index forward or back, depending on whether wheel is scrolled down or up

	old_cy = content_y;
	content_y = (delta<=-120)? content_y-10 : content_y+10;
	
	if(content_y > 0) content_y = 0;
	
	if(old_cy > content_y)
		proper_cy = content_y - (content_y % box_h) - box_h;
	else
		proper_cy = content_y - (content_y % box_h);
	
	
	
	
    if (evt.preventDefault) //disable default wheel action of scrolling page
        evt.preventDefault()
    else
        return false
 
}
 
var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
 
if (document.attachEvent) //if IE (and Opera depending on user setting)
    document.attachEvent("on" + mousewheelevt, wheel_document);
else if (document.addEventListener) //WC3 browsers
	document.addEventListener(mousewheelevt, wheel_document, false)
