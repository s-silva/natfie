var colCount = 0;
var colWidth = 0;
var margin = 4;
var blocks = [];

function gardenui_init()
{
}

function gardenui_init_old()
{
	var cw = g_win_width - 320 - 165; /* $('feedg_feeddcontent').offsetWidth */
	var e = getElementsByClassName("feedg_postbox", "div");
	var i = 0;
	
	colWidth = 540;/*e[0].offsetWidth;*/
	colCount = Math.floor(cw/(colWidth+margin*2));
	blocks = [];
	
	for(var i=0;i<colCount;i++){
		blocks.push(margin);
	}
	
	i = 0;
	
	while(e[i])
	{
		var o = e[i];
		
		var minset = array_min(blocks);

		var min = minset.v;
		var index = minset.i;
		
		var leftPos = margin + (index * (colWidth + margin));
		
		o.style.left = leftPos + 'px';
		o.style.top = (min - margin) + 'px';

		
		blocks[index] = min + o.offsetHeight + margin;
		
		i++;
	}
	
	
	$('feedg_notes').style.width = (g_win_width - (colCount * (colWidth+margin*2)) - 320 - 165) + "px";

}

function array_min(a)
{
    var l = a.length, i, m = 0, mi = 0;
	
	var r={'v':0,'i':0};
	
	if(!l) return r;
	
	m = a[0];
	
	for(i=1; i<l; i++)
	{
		if(a[i] < m)
		{
			m = a[i];
			mi = i;
		}
	}
	
	r.v = m;
	r.i = mi;
	return r;
};