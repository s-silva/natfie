
function uploadpic()
{
	$("btnuploadpp").click();
}

function savepic()
{
	$("btnsavepp").click();
}


function uploadbtncolor(val)
{
	if(val == 1)
	{
		$("btnup").style.background = "#78a2cc";
	}else{
		$("btnup").style.background = "#5882ac";
	}
}


function $(id)
{
    return document.getElementById(id);
}

var ie=document.all;
var nn6=document.getElementById&&!document.all;

var isdrag=false;
var x,y;
var dobj;
var objh = 0;
var objw = 0;

function movemouse(e)
{
	if (isdrag)
	{
		if(objh > objw)
		{
			var yv = (nn6 ? ty + e.clientY - y : ty + event.clientY - y);

			if(yv > 0) yv = 0;
			else if(yv < +300-objh)yv = +300-objh;
			//dobj.style.left = (nn6 ? tx + e.clientX - x : tx + event.clientX - x) + 'px';
			dobj.style.top  = yv + 'px';

			$("ppmx1").value = 0;
			$("ppmy1").value = -yv;

			$("ppthumb1").style.top = ((yv * 77) / 300) + 'px';
			$("ppthumb2").style.top = ((yv * 41) / 300) + 'px';
			$("ppthumb3").style.top = ((yv * 27) / 300) + 'px';
			
			
		}else if(objw > objh){
		
			var xv = (nn6 ? tx + e.clientX - x : tx + event.clientX - x);

			if(xv > 0) xv = 0;
			else if(xv < +300-objw)xv = +300-objw;
			//dobj.style.left = (nn6 ? tx + e.clientX - x : tx + event.clientX - x) + 'px';
			dobj.style.left  = xv + 'px';

			$("ppmx1").value = -xv;
			$("ppmy1").value = 0;

			$("ppthumb1").style.left = ((xv * 77) / 300) + 'px';
			$("ppthumb2").style.left = ((xv * 41) / 300) + 'px';
			$("ppthumb3").style.left = ((xv * 27) / 300) + 'px';
		}
		return false;
	}
}

function cropselectmouse(e) 
{
  var fobj       = nn6 ? e.target : event.srcElement;
  var topelement = nn6 ? "HTML" : "BODY";

  while (fobj.tagName != topelement && fobj.className != "dragme")
  {
    fobj = nn6 ? fobj.parentNode : fobj.parentElement;
  }

  if (fobj.className=="dragme")
  {
    isdrag = true;
    dobj = fobj;
    tx = parseInt(dobj.style.left+0);
    ty = parseInt(dobj.style.top+0);
	objh = parseInt(dobj.offsetHeight+0);
	objw = parseInt(dobj.offsetWidth+0);
    x = nn6 ? e.clientX : event.clientX;
    y = nn6 ? e.clientY : event.clientY;
    document.onmousemove=movemouse;
    return false;
  }
  
  return true;
}

function cropinit()
{
	var o = $("dpcropdrag");
	var tobjh = parseInt(o.offsetHeight+0);
	var tobjw = parseInt(o.offsetWidth+0);
	
	if(tobjh > tobjw)
	{
		$("ppthumb1").style.width='77px'
		$("ppthumb2").style.width='41px'
		$("ppthumb3").style.width='27px'
	}else{
		$("ppthumb1").style.height='77px'
		$("ppthumb2").style.height='41px'
		$("ppthumb3").style.height='27px'
	}
}

//document.onmousedown=selectmouse;
document.onmouseup=new Function("isdrag=false");

