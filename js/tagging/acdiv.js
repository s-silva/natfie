
var suggestions = new Array("Dagmar Mcvey ", "Beckie Pinette ", "Elina Marchal ", "Becki Outten ", "Tonie Pavelka ", "Kary Podesta ", "Ismael Karcher ", "Tamesha Sigman ", "Davis Duerr ", "Martha Tuff ", "Loren Mohler ", "Haley Galeana ", "Abbey Macleod ", "Corene Dickison ", "Rebekah Vigue ", "Viva Mcraney ", "Les Huizar ", "Bradley Nery ", "Trent Grassi ", "Erlinda Guizar ", "Levi Sheen ", "Adela Stwart ", "Brigitte Grayer ", "Venetta Mull ", "Matthew Sarcone ", "Sybil Canchola ", "Kayce Visconti ", "Jennette Ruland ", "Elfrieda Mroz ", "Annabelle Kampen ", "Linsey Klapp ", "Vannesa Hogan ", "Araceli Norgard ", "Lon Loew ", "Shayne Wycoff ", "Merry Rierson ", "Randell Howlett ", "June Chang ", "Alvin Patterson ", "Jonna Buell ", "Zack Rahe ", "Jacklyn Cockett ", "Ora Kitzmiller ", "Pearle Zamorano ", "Stephane Asuncion ", "Trudi Pfeil ", "Kandace Godfrey ", "Fairy Pool ", "Wanda Shields ", "Russel Izzard");
var savedRange, savedRange2;


function getCaretPosition(element) {
	var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined") {
		if(!window.getSelection().rangeCount) return 0;
        range = window.getSelection().getRangeAt(0);
        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
            (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return  start;
}

function saveSelection()
{
    if(window.getSelection)//non IE Browsers
    {
        savedRange = window.getSelection().getRangeAt(0);
    }
    else if(document.selection)//IE
    { 
        savedRange = document.selection.createRange();  
    } 
}

function saveSelection2()
{
    if(window.getSelection)//non IE Browsers
    {
        savedRange2 = window.getSelection().getRangeAt(0);
    }
    else if(document.selection)//IE
    { 
        savedRange2 = document.selection.createRange();  
    } 
}

function restoreSelection()
{
    if (savedRange != null) {
        if (window.getSelection)//non IE and there is already a selection
        {
            var s = window.getSelection();
            if (s.rangeCount > 0) 
                s.removeAllRanges();
            s.addRange(savedRange);
        }
        else 
            if (document.createRange)//non IE and no selection
            {
                window.getSelection().addRange(savedRange);
            }
            else 
                if (document.selection)//IE
                {
                    savedRange.select();
                }
    }
}

function tokenize_setdiv(obj, outp, dataget, dataset, outcallback, callbackkeyup)
{
	var oldins;
	var posi = -1;
	var words = new Array();
	var input;
	var key;
	var datuseid;
	var wids = new Array();
	var voldwords = new Array();
	var voldwworddt = new Array();
	var voldwwids = new Array();
	
	var color_tsel = "#555555";
	var color_bsel = "#ecf1f6";
	var color_t = "#555555";
	var color_b = "#ffffff";
	var lselwin;
	
	setTimeout(lookat(0), 100);
	
	setvis("hidden");
	
	obj.setAttribute('data-ttokentrigon', 0);
	
	obj.onkeydown = keydownm;
	obj.onkeyup = keyupm;
	var lastcpos = 0;


	function insertTextAtCursor(text)
	{
		var sel, range, html;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				var b = document.createElement("span");
				b.innerHTML = text;
				range.insertNode(b); //document.createHTMLNode(text) );
				 
			}
		} else if (document.selection && document.selection.createRange) {
			document.selection.createRange().text = text;
		}
	}
	
	function pasteHtmlAtCaret(html)
	{
		var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				
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


	function keydownm(event)
	{
		
		if (!event && window.event) event = window.event;
		if (event) key = event.keyCode;
		else key = event.which;
		
		saveSelection();
		
		lastcpos  = getCaretPosition(obj);
		lookat(0);
		
		if(obj.getAttribute('data-ttokentrigon') != 0)
			if(key == 40 || key == 38 || (key == 13 && !event.shiftKey)) event.preventDefault();
	}
		
	function keyupm(event)
	{
		saveSelection();
		
		lookat(0);
		if(obj.getAttribute('data-ttokentrigon') == 0)
		{
			if(callbackkeyup) callbackkeyup(event);
			return 0;
		}
		
		if (key == 40) // down
		{
			if (words.length > 0 && posi < words.length-1)
			{
				if (posi >=0) setcolor(posi, color_b, color_t);
				else input = obj.innerText;
				setcolor(++posi, color_bsel, color_tsel);
			}
		}else if (key == 38){ // up
			if (words.length > 0 && posi >= 0)
			{
				if (posi >=1)
				{
					setcolor(posi, color_b, color_t);
					setcolor(--posi, color_bsel, color_tsel);
				}else{
					setcolor(posi, color_b, color_t);
					posi--;
				}
			}
		}else if (key == 27){ // esc
		
			setvis("hidden");
			posi = -1;
			oldins = input;
			
		}else if (key == 8){ // backspace
			posi = -1;
			oldins=-1;
		}else if(key == 13){ // enter
			settoken(outp.childNodes[posi].getAttribute('data-tval'), -1, outp.childNodes[posi].getAttribute('data-ikid'));
			//settoken(outp.childNodes[posi].firstChild.nodeValue, -1, outp.childNodes[posi].getAttribute('data-ikid'));
			setvis("hidden");
			posi = -1;
			return 0;
		}else{
			if(callbackkeyup) callbackkeyup(event);
		}
	}
	
	function settoken(tv, nsv, id)
	{
		var objt = obj;
		
		var selvals = lastcpos;
		
		if(nsv < 0) nsv = selvals + 1;
		
		var ssv = objt.getAttribute('data-ttokentrigonsv');

		objt.setAttribute('data-ttokentrigon', 0);
		
		var obfb = objt.innerText.substr(0, ssv - 1);
		var obeb = objt.innerText.substr(nsv);
		
		objt.focus();
		restoreSelection();
		var ncdp = getCaretPosition(obj);
		var fromAmpDistance = ncdp - ssv;
		
		for(var i=0; i<fromAmpDistance+1; i++)
		{
			window.getSelection().deleteFromDocument();
		}
		pasteHtmlAtCaret(dataset(tv, id, worddt[id] ?  worddt[id] : voldwworddt[id]));
		objt.focus();
	}
	
	function setcolor(_posi, _color, _forg)
	{
		outp.childNodes[_posi].style.background = _color;
		outp.childNodes[_posi].style.color = _forg;
	}
	
	function setvis(visi)
	{
		if(!outp) return 0;
		outp.style.visibility = visi;
		//if(visi == "hidden") obj.setAttribute('data-ttokentrigon', 0);
	}
	
	function lookat(md)
	{
		var selvals = getCaretPosition(obj);
		var objtcv = obj.innerText.replace(/\n/g, "").replace(/\r/g, "");
		var objtc = objtcv.substr(selvals - 1, 1);
		
		
		if(objtc == '@')
		{	
			obj.setAttribute('data-ttokentrigon', 1);
			obj.setAttribute('data-ttokentrigonsv', selvals);
			saveSelection2();
		}
		
		if(obj.getAttribute('data-ttokentrigon') == 0) return 0;
		var nsv = obj.getAttribute('data-ttokentrigonsv');
		
		var ins = objtcv.substr(nsv, selvals - nsv).toLowerCase();
		
		if (posi > -1);
		else if (ins.length > 0)
		{
			if(!md)
			{
				if(oldins != ins)
					words = getword(ins);
			}
			
			oldins = ins;
			
			//if(words.length == 0)
			{
				words = voldwords;
				worddt = voldwworddt;
				wids = voldwwids;
			}
			
			if (words.length > 0)
			{
				clearoutput();
				for (var i=0;i<words.length; ++i) addword (words[i], wids[i], i);
				setvis("visible");
				input = obj.innerText;
			}else{
				setvis("hidden");
				posi = -1;
			}
		}else{
			setvis("hidden");
			posi = -1;
		}
		oldins = ins;
	}
	
	function addword(word, id, rid)
	{
		var sp = document.createElement("div");

		if(worddt[rid].dsc)
			var dsc = worddt[rid].dsc;
		else
			var dsc = "";
			
		var img = "";
		
		if(worddt[rid].lid)
		{
			img = "<img style='float: left; margin: 2px 0 2px;' onerror='failsafe_img(this, 3);' src='data/u" + worddt[rid].lid + "/dp/3.jpg'/>";
		}
			
		sp.innerHTML = img + "<p style='margin-left: 30px'>" + word + "<br/><i style='color: #808080;'>" + dsc + "</i></p><div style='clear: both;'></div>";
		
		
		sp.onmouseover = mousehandler;
		sp.onmouseout = mousehandlerout;
		sp.onclick = mouseclick;
		sp.className = "tag_complete_line";
		sp.setAttribute('data-ikid', rid);
		sp.setAttribute('data-tval', word)
		
		outp.appendChild(sp);
	}
	
	function clearoutput()
	{
		while(outp.hasChildNodes())
		{
			noten = outp.firstChild;
			outp.removeChild(noten);
		}
		posi = -1;
	}
	
	function getword(beginning)
	{
		var words = new Array();
		wids = new Array();
		
		var dset = dataget(beginning, returning_words);
		
		/*for (var i=0;i<dset.length; ++i)
		{
			var j = -1;
			var correct = 1;
			var sugval = dset[i].name.toLowerCase();
			
			while (correct == 1 && ++j < beginning.length)
			{
				if (sugval.charAt(j) != beginning.charAt(j)) correct = 0;
			}
			
			if (correct == 1) worddt[words.length] = dset[i];
			if (correct == 1) words[words.length] = dset[i].name;
			if (correct == 1) wids[wids.length] = i;
		}
		*/
		return words;
		
		return words;
	}
	
	function returning_words(beginning, dset)
	{
		var words = new Array();
		wids = new Array();
		
		for (var i=0;i<dset.length; ++i)
		{
			var j = -1;
			var correct = 1;
			var sugval = dset[i].name.toLowerCase();
			
			while (correct == 1 && ++j < beginning.length)
			{
				if (sugval.charAt(j) != beginning.charAt(j)) correct = 0;
			}
			
			if (correct == 1) worddt[words.length] = dset[i];
			if (correct == 1) words[words.length] = dset[i].name;
			if (correct == 1) wids[wids.length] = i;
		}
		voldwworddt = worddt;
		voldwwids = wids;
		voldwords = words;
		lookat(1);
		
		return 1;
	}
	
	function mousehandler()
	{
		for (var i=0;i<words.length;++i)
			setcolor (i, color_b, color_t);
	
		this.style.background = color_bsel;
		this.style.color= color_tsel;
	}
	
	function mousehandlerout()
	{
		this.style.background = color_b;
		this.style.color = color_t;
	}
	
	function mouseclick()
	{
		//settoken(this.firstChild.nodeValue, -1, this.getAttribute('data-ikid'));
		settoken(this.getAttribute('data-tval'), -1, this.getAttribute('data-ikid'));
		setvis("hidden");
		posi = -1;
		oldins = this.firstChild.nodeValue;
	}
}


function minit()
{
	init_ajaxmain();
	//tokenize_setdiv($('txt'), $('output'), getlocations, makelocationtoken, function(v){$('outputse').innerHTML = v;});
}

function tokenized_init(obj)
{
	tokenize_setdiv(obj, $('tagcomplete_box'), gettagfriends, makeusertoken, function(v){$('newpostautocompfoutputse').innerHTML = v;});
}

function tokenized_init_loctag(obj, keyupcb)
{
	tokenize_setdiv(obj, $('tagcomplete_box'), getlocations, makelocationtoken, 0, keyupcb);
}

function tokenized_init_usertag(obj, keyupcb)
{
	tokenize_setdiv(obj, $('tagcomplete_box'), gettagfriends, makeusertoken, 0, keyupcb);
}

function makelocationtoken(it, iid, objloc)
{
	return "<i contentEditable='false' style='color: #CD8530; cursor: pointer; font-style: normal;' onclick='show_mapcard(this, 1, \"" + objloc.lt + "," + objloc.lg + "\");' data-lt='" + objloc.lt + "' data-lg='" + objloc.lg + "'>" + it + "</i> ";
}


function makeusertoken(it, iid, obj)
{
	if(!obj) return 0;
	return "<i data-value='[@[-" + it + "," + obj.uid + "," + obj.lid + "-]]' contentEditable='false' style='color: #6699cc; cursor: pointer; font-style: normal;'>" + it + "</i>";
}

function mapshow(mobj)
{
	if(!mobj) return 0;
	var lt = mobj.getAttribute('data-lt');
	var lg = mobj.getAttribute('data-lg');
	
	if(!lt) return 0;
	if(!lg) return 0;
	
	var edata = lt +"," + lg;
	
	$('newpostautocompfouttt').innerHTML = "<img style='cursor: pointer;' src='http://maps.googleapis.com/maps/api/staticmap?center=" + edata + "&zoom=11&size=335x200&sensor=false&amp;markers=" + edata + "'>";
}
	
function getlocations(keyf, fcallback)
{
	ajax_post("php/geo/getlocation.php?q=" + keyf, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var jm = {};
			jm = JSON.parse(xmlhttp.responseText);
			fcallback(keyf, jm);
		}
	});
	return 1;//suggestions;
}

function gettagfriends(keyf, fcallback)
{
	if(!keyf) return 1;
	
	if(!cached_friendlist)
	{
		ajax_post("php/tasks/getfriendlist.php", function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "")
				{
					var jm = {};
					jm = JSON.parse(xmlhttp.responseText);
					
					cached_friendlist = jm;
					
					var nm = search_cachedlist(cached_friendlist, keyf);
					
					/* [todo] need to optimize according to http://code.flickr.com/blog/2009/03/18/building-fast-client-side-searches/ */
					
					fcallback(keyf, nm.users);
					return 0;
				}else{
					return 0;
				}
			}});
			
		return 0;
	}
	
	var nm = search_cachedlist(cached_friendlist, keyf);
	fcallback(keyf, nm.users);
	
}

