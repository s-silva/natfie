

/* content types:
	1  - status (2 strips)
	2  - photos (friends)
	3  - videos (friends)
	4  - videos and links (friends)
	5  - photos (top)
	6  - videos (top)
	7  - music (top)
	8  - movies (top)
	9  - news
	10 - photos (recent)
*/

/*
    content type
	splits
	dummy
	dummy
*/

var content_columns =    [[1, 2, 0, 0], [1, 2, 0, 0], [2, 1, 0, 0], [3, 1, 0, 0], [4,  1, 0, 0], [5,  1, 0, 0], [6,  1, 0, 0], [7,  1, 0, 0], [8,  1, 0, 0], [9,  1, 0, 0], [10,  1, 0, 0]];

var home_isdrag = false;
var posts_mdown_item;
var posts_mmove = 0;
var content_x = 0;
var content_y = 0;
var proper_cx = 0;
var old_cx = 0;
var proper_cy = 0;
var old_cy = 0;
var content_moving = 0;
var content_selected = 1;
var drag_started = 0;

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
var box_rw = 180 * 2;
var box_rh = 110 * 2;
var box_w = box_rw + 4;
var box_h = box_rh + 4;
var box_font_n_size = 9;
var content_single_color = 1;

var drag_mode = 1;

var content_add_yoffset = 0;

var posts_general_controls = "<div class='boxc'><div class='boxc_i boxc_icm'></div><div class='boxc_icmd'>12</div><span><div class='boxc_i boxc_share'></div><div class='boxc_i boxc_close' onclick='pblock();'></div></span></div>";



function home_addbox(x, y, title, data /* html data inside */, color)
{
	//var str = document.getElementById("content").innerHTML;
	var itemname = "b" + x + "_" + y;
	var s = "";
	
	var boxdata = "";
	
	switch(content_columns[y][0])
	{
	case 2:
		boxdata = "pv" + (x + 1);
		break;
	case 3:
		boxdata = "tv" + (x + 1);
		break;
	}
	
	switch(content_columns[y][0])
	{
	case 2:
	case 3:
	case 4:
	case 5:
	case 6:
	case 7:
	case 8:
	case 10:
		s = "<div class=\"box\" id=\"" + itemname +  "\" style=\"width: " + Math.floor(box_rw) + "px; height: " + Math.floor(box_rh / content_columns[y][1]) + "px; left: " + (x * box_w) + "px; top: " + (content_add_yoffset) + "px;\"><div class='boxout'><div class='boxin'><div class='boxpic' style=\"background: url('images/test/dp.jpg');\"></div><div class='boxtextp'><h1 id=\"h" + itemname + "\">" + title + "</h1><p>" + data + "</p></div><div class='boxdatab'><div class='boxdata' style=\"background: url('images/test/" + boxdata + ".jpg');\"></div></div></div>" + posts_general_controls + "</div></div>";
		break;
		
	default:
		s = "<div class=\"box\" id=\"" + itemname +  "\" style=\"width: " + Math.floor(box_rw) + "px; height: " + Math.floor(box_rh / content_columns[y][1]) + "px; left: " + (x * box_w) + "px; top: " + (content_add_yoffset) + "px;\"><div class='boxout'><div class='boxin'><div class='boxpic' style=\"background: url('images/test/dp.jpg');\"></div><div class='boxtext'><h1 id=\"h" + itemname + "\">" + title + "</h1><p>" + data + "</p></div></div>" + posts_general_controls + "</div></div>";
	}
	
	return s;
	//$(itemname).style.width = Math.floor(box_rw) + 'px';
	//$(itemname).style.height = Math.floor(box_rh / content_columns[y][1]) + 'px';
}

function rand(max)
{
	return Math.floor(Math.random()*max);
}

function slide_fix()
{
	if(!home_mdown && drag_mode == 2)
	{
	
		var ct = document.getElementById("content");
		/*
		if(content_x != proper_cx)
		{
			var d = content_x - proper_cx;
			d /= 2;

			content_x -= d;
			
			if(content_x < -500)
			{
				if(content_x < proper_cx + 4 && content_x > proper_cx - 4)
					content_x = proper_cx = -box_w;
			}
			
			ct.style.left = content_x + 'px';
		}
		*/
		if(content_y != proper_cy)
		{
			var d = content_y - proper_cy;
			d /= 2;
			content_y -= d;
			
			if(content_y < -500)
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
	
	posts_available = 1;
	
	var sampletitle = "<a href='#' class='userpage' onmouseover=\"vusr(this, 'vkhjYh');\">James Walker</a>";
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

	content_add_yoffset = 0;
	
	var s = "";
	var ypos = 0;
				
	for(y=0; y<box_count_y; y++)
	{
		var hv = (Math.floor(box_rh / content_columns[y][1]) +  4);
		
		s = s + "<div class='dragger' style='width: 3000px; top: " + ypos + "px; height: " + hv + "px;'>";
		
		ypos += hv;
		
		for(x=0; x<box_count_x; x++)
		{
			if(content_single_color)
				s = s + home_addbox(x, y, sampletitle, sampledata, 0);
			else
				s = s + home_addbox(x, y, sampletitle, sampledata, rand(colorsets.length));
		}
		
		s = s + "</div>";
		
		content_add_yoffset +=  Math.floor((box_rh / content_columns[y][1]) + 4);
	}
	
		
	$("content").innerHTML = "<div id='postscontent' class='focusbox'>" + s + "</div>";
	
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

function post_click(x, y)
{
	post_expand(x, y);
}

/*
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
 */
 
InitDragDrop();

function InitDragDrop()
{
	//document.onmousedown = posts_OnMouseDown;
	//document.onmouseup = posts_OnMouseUp;
	//document.ondblclick = OnDblClick;
	
}

function ischildof(t, p)
{
	while(t)
	{
		if(t.className == p){return t};
		t = t.parentNode;
		
	}
	return 0;
}

function posts_OnMouseDown(e)
{
    if (e == null) 
        e = window.event; 
		
	home_mdown = 1;
	content_moving = 0;
	drag_mode = 0;
	drag_started = 0;
	posts_mmove = 0;

    var target = e.target != null ? e.target : e.srcElement;
   
	posts_mdown_item = target;
	
	var parentc = ischildof(target, 'dragger');
	
	target = parentc;

    if ((e.button == 1 && window.event != null || e.button == 0) && target)
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
       // document.onmousemove = posts_OnMouseMove;
		home_isdrag = true;
        
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

function posts_OnMouseMove(e)
{
	if(!home_isdrag) return;
	
    if (e == null) 
        var e = window.event; 
		
	content_x = (_offsetX + e.clientX - _startX);
	content_y = (_offsetY + e.clientY - _startY);
	
	posts_mmove = 1;
	
	if(drag_started == 0)
	{
		if(content_y > old_cy + 2 || content_y < old_cy - 2)
		{
			drag_mode = 2;
			
			var target = $("content");
			
			//_dragElement.style.left = proper_cx + 'px';
			
			_startX = e.clientX;
			_startY = e.clientY;
			
			old_cx = _offsetX = ExtractNumber(target.style.left);
			old_cy = _offsetY = ExtractNumber(target.style.top);
			
			content_x = old_cx;
			content_y = old_cy ;

			_dragElement = target;
			
			drag_started = 1;
		}else if(content_x > old_cx + 2 || content_x < old_cx - 2){
			drag_mode = 1;
			drag_started = 1;
		}
	}
	
	/*
	if(drag_mode == 1)
	{
		if(content_y > old_cy + 100 || content_y < old_cy - 100)
		{
			var target = $("content");
			
			_dragElement.style.left = proper_cx + 'px';
			
			_startX = e.clientX;
			_startY = e.clientY;
			
			old_cx = _offsetX = ExtractNumber(target.style.left);
			old_cy = _offsetY = ExtractNumber(target.style.top);
			
			content_x = old_cx;
			content_y = old_cy ;

			_dragElement = target;

			drag_mode = 2;
		}
	} */
	
	if(content_x > 0) content_x = 0;
	if(content_y > 0) content_y = 0;
	
	if(drag_mode == 1)
		_dragElement.style.left = content_x + 'px';
	else if(drag_mode == 2)
		_dragElement.style.top = content_y + 'px';
/*	

	
	

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
    } */
	
	
}

function posts_OnMouseUp(e)
{
	home_mdown = 0;
	home_isdrag = false;

    if (_dragElement != null)
    {
	
		if(!posts_mmove)
		{
			if(!ischildof(posts_mdown_item, 'boxc'))
			{
				var b = ischildof(posts_mdown_item, 'box');
				var a = b.id.substr(1).split("_", 2);
				post_click(a[0], a[1]);
			}
		}
	
	
	
	
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        //document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;
	

		if(drag_mode == 1)
		{
			if(old_cx > content_x + 100)
				proper_cx = content_x - (content_x % box_w) - box_w;
			else if(old_cx < content_x - 100)
				proper_cx = content_x - (content_x % box_w);
				
		}else if(drag_mode == 2){
		
			if(old_cy > content_y + 100)
				proper_cy = content_y - (content_y % box_h) - box_h;
			else if(old_cy < content_y - 100)
				proper_cy = content_y - (content_y % box_h);
		}
			
		if(drag_mode == 1)
		{
			if(proper_cx != content_x)
				slidebox(_dragElement, content_x, 50, proper_cx, content_x);
        }
		
		// this is how we know we're not dragging      
        _dragElement = null;
    }
}

function slidebox(obj, x, dx, px, lx)
{
	
	obj.style.left = x + 'px';
	
	if(lx > px)
	{
		if(x >= px)
			setTimeout(function (_this){slidebox(obj, x - dx, dx - 2 > 4 ? dx - 1 : 4, px, lx);}, 50);
		else
			obj.style.left = px + 'px';
	}else{
		if(x <= px)
			setTimeout(function (_this){slidebox(obj, x + dx, dx - 2 > 4 ? dx - 1 : 4, px, lx);}, 50);
		else
			obj.style.left = px + 'px';
	}
}

function wheel_document(e)
{
	if(!content_selected) return false;

	drag_mode = 2;
	
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
