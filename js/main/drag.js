
var dragitem_sx, dragitem_sy;
var dragitem_offsetX, dragitem_offsetY;
var dragitem_sel;

/*
 * xd, yd = 1 to move, xa, ya is the align blocks.
 */
function setitemdrag(item, xd, yd, xa, ya)
{
    //$(item).onmousedown = dragitem_mdown;
	$(item).addEventListener("onmousedown", dragitem_mdown, true);
    $(item).onmouseup = dragitem_mmove;
}

function dragitem_mdown(e)
{
	if (e == null) 
        e = window.event; 
alert('ohoaa');
    
    var target = e.target != null ? e.target : e.srcElement;

    if ((e.button == 1 && window.event != null || e.button == 0))
    {
        dragitem_sx = e.clientX;
        dragitem_sy = e.clientY;
        
        dragitem_offsetX = ExtractNumber(target.style.left);
        dragitem_offsetY = ExtractNumber(target.style.top);
        dragitem_sel = target;
        dragitem_sel.onmousemove = OnMouseMove;
        document.body.focus();
        document.onselectstart = function () { return false; };
        target.ondragstart = function() { return false; };
        return false;
	}
}

function dragitem_mmove(e)
{
    if (e == null) 
        var e = window.event; 
		
	dragitem_sel.style.left = (dragitem_offsetX + e.clientX - dragitem_sy) + 'px';
	dragitem_sel.style.top = (dragitem_offsetY + e.clientY - dragitem_sx)  + 'px';
}

function dragitem_mup(e)
{
	return 0;
}