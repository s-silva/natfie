/* include panorama image handling upon the aspect ratio */

var photodata = 0;
var photoup_files = 0;

function photoup_viewthumbs(startid, c, cobj)
{
	var tvals = "";

	startid = parseInt(startid);
	
	for(var i=0; i<c; i++)
	{
		tvals += "<div class='photoupv_thumbboxo'><div class='photoupv_thumbboxuppbar' id='photoupv_thumbboxuppbar" + (startid + i) + "'><div class='photoupv_thumbboxuppbari' id='photoupv_thumbboxuppbari" + (startid + i) + "'></div></div><div class='photoupv_thumbbox' id='photouppptbi" + (startid + i) + "'></div><div class='photoupv_thumbbox_ft'><div class='photoupv_thumbbox_ftdsc'><p id='photouppptbdsc" + (startid + i) + "' onclick=\"geditinplace(this, 2, 278, 45);\">Add a description...</p></div></div></div>";
	}
	
	cobj.innerHTML += tvals;
	cobj.setAttribute('data-npics', startid + c);
}

function photoup_resamplethumbs(startid, c, files)
{
	startid = parseInt(startid);
	
	photoup_files = new Array(c);
	
	photodata = new Array(c);
	
	for(var i=0; i<c; i++)
	{
		photoup_files[i] = files[i];
		photoup_html5resample(files[i], 337, $('photouppptbi' + (startid + i)), 337/145.0, i, 0, 0);
	}
}

/*
 * pojb can be zero and idi won't be used if retdata is non-zero.
 */
 
function photoup_html5resample(ifile, width, pobj, ar, idi, retdata, retdvals)
{
	var file = new FileReader;
	var data = 0;
	
    file.onload = function (){

			var mi = new Image;
			
			mi.src = file.result;
			
			/* mi.onerror = function (){}; */
			
			mi.onload = function (){
					var canvas = document.createElement("canvas");
					context = canvas.getContext("2d");
					
					if(!ar)
					{
						if(mi.width < width) width = mi.width;
						if(mi.height > width) width = mi.width * (width / mi.height);
					}
					
					var nw = width, nh = Math.round(mi.height * width / mi.width), exh = mi.height, exw = mi.width, sy = 0, sx = 0;
					var sc = mi.width / width;
					
					if(ar)
					{
						if(mi.width / mi.height < ar)
						{
							nh = nw / ar;
							exh = mi.width / ar;
							sy = mi.height / 2 - (nh * sc) / 2;
						}else{
							
							exw = mi.height * ar;
							
							nh = nw / ar;
							sc = mi.height / nh;
							sy = 0;
							sx = mi.width / 2 - (nw * sc) / 2;
						}
					}
					
					canvas.width = nw;
					canvas.height = nh;
					
					context.drawImage(mi, sx, sy, exw, exh, 0, 0, nw, nh);
					data = canvas.toDataURL("image/jpeg");
					
					if(!retdata)
					{
						pobj.appendChild(new Image).src = data;

					//photo_uploadimg(0, data);
						photodata[idi] = data;
					}else{
						photoup_uploadphoto(data, retdvals[0], retdvals[1], retdvals[2], 0, 0, 0);
					}
				
					delete context;
					delete canvas;
				};
			
			
		};
		
    /*
	file.onabort = function (){};
	file.onerror = function (){};
	*/

	file.readAsDataURL(ifile);

}


function photoup_uploadset()
{
	var albumname = 0;
	var photodsc = 0;
	var photocount = 0;

	photocount = $('overlayfulldialog_ic').getAttribute('data-npics');
	if(!photocount) return 0;
	photocount = parseInt(photocount);
	if(!photocount) return 0;
	
	albumname = $('photoup_albumtitle').innerText;
	
	ajax_post("php/tasks/addalbum.php?n=" + albumname, function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText && xmlhttp.responseText != "0")
			{
				var upalbumid = xmlhttp.responseText;
			
				/* add photos */
	
				for(var i=0; i<photocount; i++)
				{
					var o = $('photouppptbdsc' + i);
					var opic = $('photouppptbi' + i);
					if(!o) continue;
					
					photodsc = o.innerText;
					
					if(!o.getAttribute('data-eipset')) photodsc = "";
					
					set_opacity(opic, 50);
				
					var pb = $('photoupv_thumbboxuppbar' + i);
					var pbi = $('photoupv_thumbboxuppbari' + i);
					
					if(pb && pbi)
					{
						pb.style.visibility = "visible";
						pbi.style.width = '50%';
					}
					
					var pcurrentdata = [photodsc, upalbumid, function(v, dv){
						pbi.style.width = v + '%';
						}];
					
					photoup_html5resample(photoup_files[i], 1000, 0, 0, 0, 1, pcurrentdata);
					
					//photoup_uploadphoto(pcurrentdata, photodsc, upalbumid, function(v, dv){
					//	pbi.style.width = v + '%';
					//	}, 0, 0, 0);
					//photoup_uploadphoto(photodata[i], photodsc, upalbumid, function(v, dv){
					//	pbi.style.width = v + '%';
					//	}, 0, 0, 0);

					
					//alert(albumname + " - " + photodsc);
				}
				
				/* </add photos> */
				
			}
		}
	
	});
}


function  photoup_uploadphoto(data, photodsc, albumid, progressb, ppdata, photoprivacy, photoloc)
{
	var xhr = new XMLHttpRequest();
	var fd = new FormData();

	fd.append("upload", data);
	xhr.open("POST", "php/tasks/addphoto.php?albid=" + albumid + "&dsc=" + photodsc);
	
	if(progressb)
	{
		xhr.upload.addEventListener("progress", function(e) {
			if (e.lengthComputable) {
				var percentage = Math.round((e.loaded * 100) / e.total);
				progressb(percentage, ppdata);
			}}, false);
	}
		
	xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.setRequestHeader('UP-FILENAME', "photo.jpg");
	xhr.setRequestHeader('UP-SIZE', 100);
	xhr.setRequestHeader('UP-TYPE', "image/jpg");
	
	xhr.send(data);
	
	xhr.onreadystatechange = function(){if(xhr.readyState==4){};};
}

function  photoup_uploadimg(calbumid, data)
{
	var xhr = new XMLHttpRequest();
	
	
	var fd = new FormData();

	fd.append("upload", data);

	
	
	xhr.open("POST", "upload.php");
	
	xhr.upload.addEventListener("progress", function(e) {
		if (e.lengthComputable) {
			var percentage = Math.round((e.loaded * 100) / e.total);
			document.title = percentage;
		}}, false);
		
	xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.setRequestHeader('UP-FILENAME', "haha.jpg");
	xhr.setRequestHeader('UP-SIZE', 100);
	xhr.setRequestHeader('UP-TYPE', "image/jpg");
	
	xhr.send(data);
	
	xhr.onreadystatechange = function(){if(xhr.readyState==4){};};
}