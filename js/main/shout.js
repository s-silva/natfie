var shout_active = 0;
var shout_annon = 0;

function shout_start()
{
	var o = $('shoutmdata');
	var annoncheckb = "";

	o.style.visibility = 'hidden';
	if(shout_annon) annoncheckb = "<div class='shoutanoncheckboxtick'></div>";
	
	o.innerHTML = "<div class='shout_typeboxout'><div class='shout_anonout'><a href='javascript: shout_annonswitch();' class='shout_anon'><div id='shout_anonboxcheck' class='shout_anonbox'>" + annoncheckb + "</div>Anonymous</a></div><div class='shout_typebox'>" +
						"<div id='shout_typeboxea' class='expandingArea' style='color: white; margin-left: 0px; min-height: 20px; width: 300px; min-height: 35px; width: 100%; border-radius: 0; border: none;'>" +
							"<pre><span></span><br></pre>" +
							"<textarea id='shout_typeboxeadt' class='newc_textarea' autocomplete='off' placeholder='Start writing to the world here...'></textarea></div></div><center><button class='shout_sendbutton'>Send!</button></a></center></div>";
	
	
	makeExpandingArea($('shout_typeboxea'));
	
	fadein(o);
	
	shout_active = 1;
}

function shout_end()
{
	var o = $('shoutmdata');
	
	o.innerHTML = "";
	shout_next();
	
	shout_active = 0;
}

function shout_switch()
{
	if(shout_active)
		shout_end();
	else
		shout_start();
}

function shout_expand()
{

}

function shout_next()
{
	var o = $('shoutmdata');
	
	o.style.visibility = 'hidden';
	
	o.innerHTML = "<div class='shout_mbox'>" + 
			"<div><img src='data/u41wk4x8/dp/1.jpg' height='60px'/></div><div class='shout_mboxl'>" + 
				"<div><a class='mdefusername' href='#'>Jane's Addiction</a></div>" + 
				"<div>A north bases jane.<br/>" + 
					"Past the waving platform dresses a condensed baffle.<br/>" + 
					"Will jane understand a fish? Why can't jane operate the etymology?</div></div></div>";
	fadein(o);
}

function shout_annonswitch()
{
	var checko = $('shout_anonboxcheck');
	
	shout_annon ^= 1;
	
	if(shout_annon)
	{
		checko.innerHTML = "<div class='shoutanoncheckboxtick'></div>";
	}else{
		checko.innerHTML = "";
	}
}