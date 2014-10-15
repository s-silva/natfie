var ie = document.all ? true : false;

var ptg_array = new Array;
var ptg_mode_edit = 0;
var ptg_lx = 0;
var ptg_ly = 0;

var ptg_zoomr = 0.5;
var ptg_boxrw = 128;
var ptg_boxrh = 158;
var ptg_boxw = 128 * ptg_zoomr;
var ptg_boxh = 158 * ptg_zoomr;
var ptg_boxwd = (128 - ptg_boxw) / 2;
var ptg_boxhd = (158 - ptg_boxh) / 2;

ptg_array[0] = [10, 20, 0, "Asshole"];
ptg_array[1] = [312, 60, 0, "Lin Hu"];
ptg_array[2] = [30, 40, 0, "Idiot"];

function ptg_init(z)
{
	ptg_zoomr = z;
	ptg_boxrw = 128;
	ptg_boxrh = 158;
	ptg_boxw = 128 * ptg_zoomr;
	ptg_boxh = 158 * ptg_zoomr;
	ptg_boxwd = (128 - ptg_boxw) / 2;
	ptg_boxhd = (158 - ptg_boxh) / 2;

	$("ptgimg").width = $("ptgimg").naturalWidth * z;
}

function ptg_move(e)
{
	var i;
	var f = 0;
	var de = document.documentElement;
    var b = document.body;
	var x = e.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
    var y = e.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
	
	if(ptg_mode_edit) return;
	
	var o = $("ptgg1");

	for(i=0; i<ptg_array.length; i++)
	{
		if( x < (ptg_array[i][0] * ptg_zoomr) + ptg_boxw && y < (ptg_array[i][1] * ptg_zoomr) + ptg_boxh &&
			x > (ptg_array[i][0] * ptg_zoomr) && y > (ptg_array[i][1] * ptg_zoomr))
		{
			o.style.left = ((ptg_array[i][0] * ptg_zoomr) - ptg_boxwd) + "px";
			o.style.top =  ((ptg_array[i][1] * ptg_zoomr) - ptg_boxhd) + "px";
			
			$("ptgg1c").innerHTML = ptg_array[i][2] ? ptg_array[i][2] : ptg_array[i][3];
			f = 1;
			break;
		}
	}
	
	if(!f)
		o.style.visibility = "hidden";
	else
		o.style.visibility = "visible";
}

function ptg_mdown(e)
{
	if (e == null) 
		e = window.event; 
		
	var de = document.documentElement;
    var b = document.body;
	var cx = e.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
    var cy = e.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
		
	if(ptg_mode_edit)
	{
		if( e.clientX < ptg_lx + ptg_boxrw && e.clientY < ptg_ly + ptg_boxrh &&
			e.clientX > ptg_lx && e.clientY > ptg_ly)
		{
			return;
		}
	}

	if(ptg_mode_edit == 0)
	{
		var o = $("ptgg1");
		
		ptg_lx = (cx - (ptg_boxw/2)) - ptg_boxwd;
		ptg_ly = (cy - (ptg_boxw/2)) - ptg_boxhd;
		
		o.style.left = ptg_lx + "px";
		o.style.top = ptg_ly + "px";
		
		o.style.visibility = "visible";
		
		$("ptgg1c").innerHTML = "<input type='text' id='ptgg1ci' onfocus='this.value = this.value;'/>";
		ptg_mode_edit = 1;
		
	}else{
	
		$("ptgg1").style.visibility = "hidden";
		
		ptg_mode_edit = 0;
	}

}

function ptg_add()
{
	if(ptg_mode_edit)
	{
		ptg_array.push([((ptg_lx + ptg_boxwd) / ptg_zoomr), ((ptg_ly + ptg_boxhd) / ptg_zoomr), 0, $("ptgg1ci").value]);

		$("ptgg1").style.visibility = "hidden";
		
		ptg_mode_edit = 0;
	}
}

function ptg_mup(e)
{
	if(ptg_mode_edit)
		$("ptgg1ci").focus();
}