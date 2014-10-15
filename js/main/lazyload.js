/*
 * faster image lazyloading algorithm based on the code by Erwan Lefèvre <erwan.lefevre@aposte.net>
 *
 * features:
 *
 * 1. can call the function and work notice a scroll/viewsport change.
 * 2. don't keep track on images which are already loaded.
 * 3. page will be displayed first even if there are images which are already on the viewsport.
 *
 */

var lazyloadimg_scrollval = 0;
var lazyloadimg_imgset = [];
var lazyloadimg_distance = 500;


function lazyloadimg_clear()
{
	lazyloadimg_scrollval = 0;
	lazyloadimg_imgset = [];
}

function add_lazyloading(obj)
{
	var newelmlist = obj.getElementsByTagName('img');
	var dscv = 0, cobj;
	
	for(var i=0; i<newelmlist.length; i++ )
	{
		cobj = newelmlist[i];
		dscv = cobj.getAttribute("data-src");
		
		if(dscv)
		{
		
			if(lazyloadimg_isitemvisible(cobj, lazyloadimg_distance))
			{
			
				cobj.src = dscv;
			}else{
				lazyloadimg_imgset.push(cobj);
			}
		}
	}
}

function lazyloadimg_scroll(x, y)
{
	lazyloadimg_scrollval = y;
	for(var i=0; i<lazyloadimg_imgset.length; i++)
	{
		
		var cobj = lazyloadimg_imgset[i];
		if(lazyloadimg_isitemvisible(cobj, lazyloadimg_distance))
		{
			var imgpos = get_position(cobj);
			cobj.src = cobj.getAttribute("data-src");
			lazyloadimg_imgset.splice(i, 1);
		}
	}
}


function lazyloadimg_isitemvisible(img, vdistance)
{
	var imgpos = get_position(img);
	var rmin = lazyloadimg_scrollval - vdistance;
	var rmax = lazyloadimg_scrollval + g_win_height + vdistance;

	return (((rmin<=imgpos.t) && (rmax>=imgpos.t) ) || ( (rmin<=imgpos.b) && (rmax>=imgpos.b)));
}

