function blog_publishnew()
{
	var otitle = $('blog_newarticle_cttitle');
	var otext = $('blog_newarticle_text');
	
	var fhtml = otitle.innerText + ":endof-natfie-title:" + otext.innerHTML;
	
	ajax_postbig("php/tasks/newarticle.php", "d", fhtml.replace(/\n\r?/g, '[-n-l-]'), function(){
		if (xmlhttp.readyState==4)
		{
			if(xmlhttp.status==200)
			{
				if(xmlhttp.responseText == "1")
				{
					blog_closenew();
					
				}else{
					
				}
			}else{
				
			}
		}});
}

function blog_closenew()
{
	$('blog_newarticle_ct').style.display = "none";
	$('blog_newarticle_btn').style.display = "";
}

function blog_startnew()
{
	$('blog_newarticle_ct').style.display = "";
	$('blog_newarticle_btn').style.display = "none";
	$('blog_newarticle_cttitle').focus();
}

function blog_format_action(id)
{

	switch(id)
	{

	case 1: /* Image */
		blog_insert_at_caret("im");
		break;
		
	case 2: /* Link */
		break;
		
	case 3: /* Video */
		break;
		
	case 4: /* Music */
		break;
		
	case 5: /* Heading */
		break;
		
	case 6: /* List */
		break;
		
	case 7: /* Table*/
		break;
		
	case 8: /* Quote */
		alert(blog_get_selected_text());
		break;
		
	case 9: /* Highlight */
		blog_insert_at_caret("<mark>" + blog_get_selected_text() + "</mark>");
		
		break;

	}

	

}

function blog_insert_at_caret(html)
{
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function blog_get_selected_text()
{
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

