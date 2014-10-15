
function feed_process(jval)
{
	var jc;
	
	
	/* showing new notifications */
	
	if(jval.newnotifications && !newnotifications_changed)
	{
		jc = jval.newnotifications;
		
		var objs = new Array();
		var objv = [-1, -1, -1, -1, -1];
		
		if(jc.friends)       objv[0] = jc.friends;
		if(jc.messages)      objv[1] = jc.messages;
		if(jc.tags)          objv[2] = jc.tags;
		if(jc.events)        objv[3] = jc.events;
		if(jc.notifications) objv[4] = jc.notifications;
		
		
		objs[0] = $("icon_new_friends");
		objs[1] = $("icon_new_messages");
		objs[2] = $("icon_new_tags");
		objs[3] = $("icon_new_events");
		objs[4] = $("icon_new_notifications");
				
		var i;
		
		for(i=0; i<5; i++)
		{
			if(objv[i] > -1)
			{
				if(objv[i] > 0)
				{
					objs[i].setAttribute("data-nvalue", objv[i]);
					objs[i].innerHTML = "<p>" + objv[i] + "</p>"
					objs[i].style.visibility = "visible";
				}else{
					objs[i].setAttribute("data-nvalue", 0);
					objs[i].innerHTML = "<p>" + objv[i] + "</p>"
					objs[i].style.visibility = "hidden";
				}
			}
		}
	}
	
	/* showing new conversation notifications */
	
	if(jval.newconversations)
	{
		chatc_clear();
		
		var hasntf = 0;
		
		var av = new Array(2, 1, 3, 0);
		
		for(var i=0; i<jval.newconversations.conversations.length; i++)
		{
			chatc_create(jval.newconversations.conversations[i].users, jval.newconversations.conversations[i].usersav, jval.newconversations.conversations[i].msgs, jval.newconversations.conversations[i].rid, jval.newconversations.conversations[i].cid, jval.newconversations.conversations[i].usersloc);
			if(jval.newconversations.conversations[i].msgs)
				hasntf = 1;
		}
		
		if(!is_window_active && (hasntf == 1))
			home_window_settitle("New Message", 1);
		
	}
	
	if(jval.newlines)
	{
		//if(is_window_active)
			chatv_refresh(jval.newlines, 1);
	}
	
	if(jval.chatlasttime)
	{
		chat_lastmsgtime = jval.chatlasttime;
	}
	
}




/* ------- */

function feed_init()
{
	if (window.XMLHttpRequest) feedxmlhttp=new XMLHttpRequest();
	else feedxmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}

function feed_update()
{
	var ntfdata = "";
	feedxmlhttp.onreadystatechange = feed_refresh;
	
	if(newnotifications_changed)
	{
		/* format - &ntf=1,2,3,4,5 */
		
		var objs = new Array();
		
		objs[0] = $("icon_new_friends");
		objs[1] = $("icon_new_messages");
		objs[2] = $("icon_new_tags");
		objs[3] = $("icon_new_events");
		objs[4] = $("icon_new_notifications");
		
		ntfdata = "&nntf="  + objs[0].getAttribute("data-nvalue") + ","
							+ objs[1].getAttribute("data-nvalue") + ","
							+ objs[2].getAttribute("data-nvalue") + ","
							+ objs[3].getAttribute("data-nvalue") + ","
							+ objs[4].getAttribute("data-nvalue");
	}
	
	
	feedxmlhttp.open("GET", "php/feed/feedb.php?r=" + chat_croomid + "&tm=" + chat_lastmsgtime + ntfdata, true);
	feedxmlhttp.send(null); 
	newnotifications_changed = 0;
}

function feed_refresh()
{
	if(feedxmlhttp.readyState==4 && feedxmlhttp.status==200)
	{
		var jm = {};
		jm = JSON.parse(feedxmlhttp.responseText);
		feed_process(jm);
	}
}
