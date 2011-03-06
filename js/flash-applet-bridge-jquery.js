var minJavaVer		= "1.5";
var minFlashVer		= "10.0.12";
var promptForJava	= false;
var jsReady 		= false;

var flashBgColor	= "#ffffff";
var preloaderUrl 	= "";	
var appUrl 			= "";
var jarUrl 			= "java/midiapplet.jar";

var flashDivId 		= "flash";
var javaDivId 		= "java";
var javaMsgDivId 	= "javamessage";
var serverPath 		= "";

var appletObject;
var flashObject;

var javaVersion;		
var flashVersion;	

var javaDivHTML		= "<div id='java'><applet name='midiApplet' id='midiApplet' code='net.abumarkub.midi.applet.MidiApplet'";
javaDivHTML		   += "archive='" + jarUrl + "' width='1' height='1' MAYSCRIPT>";
javaDivHTML		   += "</applet></div>";

$(document).ready(function()
{
	start();
	top.talkToFlash = talkToFlash;
	//top.talkToFlash("init");
});

$(window).bind("unload",function() 
{
	$("*:not('applet, object')").add(document).unbind();
});

function noFlash(){var s = "<div>For this site you need Flash plugin version " + minFlashVer + " or higher:" +
					"<ul><li>click <a href='http://www.adobe.com/go/getflashplayer' target='_blank'>here</a> to install or update</li></ul></div>" +
					"<div><a href='http://www.adobe.com/go/getflashplayer' target='_blank'><img src='img/flash_icon.jpg' width='75' height='75' border='0' /></a></div>";
					return s;}

function noJava(){var s	= "<div>For this site you need Java plugin version " + minJavaVer + " or higher:" +
					"<ul><li>click <a href='javascript:loadJava()'>here</a> if your Java Plugin version is " + minJavaVer + " or higher</li>" +
					"<li>click <a href='http://java.com/en/download/index.jsp' target='_blank'>here</a> to install the Java plugin.</li>" +
					//"<li>click <a href='javascript:startWithoutJava()'>here</a> to continue without java</li>" +
					"</ul></div>" + 
					"<div><a href='http://java.com/en/download/index.jsp' target='_blank'><img src='img/java_icon.jpg' width='75' height='65' border='0' /></a></div>";
					return s;}


function trace(args)
{
	alert(args);
}

function start()
{
	if(navigator.platform.indexOf("Mac") != -1 && navigator.appVersion.indexOf("Safari") == -1)
	{
		$("#"+flashDivId).html("<div class='error2'>Sorry, only Safari is supported on OSX</div>");
		return;
	}
	else if(navigator.platform.indexOf("Linux") != -1 && navigator.appVersion.indexOf("Konqueror") != -1)
	{
		$("#"+flashDivId).html("<div class='error2'>Sorry, Konqueror is not supported.</div>");
		return;
	}

	checkFlash();
}

function checkFlash()
{
	if(swfobject.hasFlashPlayerVersion(minFlashVer))
	{
		var player   			= swfobject.getFlashPlayerVersion()
		flashVersion			= player.major + "." + player.minor + "." + player.release;
		checkJava();
	}
	else
	{
		$("#"+flashDivId).html(noFlash());
		$("#"+flashDivId).append(noJava());
	}
}

function checkJava()
{
	if($.browser.msie) 
	{
		minJavaVer = "1.6";
	}	
	//trace("browser:" + navigator.userAgent + "\njar:" + jarUrl + " \napplet:" + appletCode);

	if(promptForJava)
	{
		$("#"+flashDivId).html(noJava());
	}
	else
	{
		loadJava();
	}
}
	
function loadJava()
{
	var content   			= "<p style='text-align:left;'>Initializing Java....";
	content 	       	   += "<br>Please be patient, this can take up to 30 seconds.";
	content		       	   += "<br>Check your Java plugin settings if you see this message longer that a minute.";
	//content		       	   += "<br>Additionally, you might want to read <a href='http://www.abumarkub.net/abublog/?p=97' target='blank'>this</a>.";
	content		       	   += "</p>";
	$("#"+javaMsgDivId).html(content);	 
    $("#"+javaDivId).html(javaDivHTML);
}

function startWithoutJava()
{
	jsReady					= true;
	loadApp();
}

function loadApp()
{
	$("#"+javaMsgDivId).html("");

	if(preloaderUrl != "")
	{	
		swfobject.embedSWF(preloaderUrl, flashDivId, flashWidth, flashHeight, minFlashVer, 
				'swf/expressinstall.swf', {url:flashUrl}, 
				{bgcolor: flashBgColor, menu: 'false', allowFullscreen:flashAllowFullscreen, allowScriptAccess: 'always', wmode:flashWmode}, 
				{id: 'flashApp'});
		return;
	}

	//alert(flashUrl + ":" + flashDivId + ":" + flashWidth + ":" + flashHeight);

	swfobject.embedSWF(flashUrl, flashDivId, flashWidth, flashHeight, minFlashVer, 
			'swf/expressinstall.swf', {conf:serverPath + '/xml/config.xml',css:serverPath + '/css/app.css'}, 
			{bgcolor: flashBgColor, menu: 'false', allowFullscreen:flashAllowFullscreen, allowScriptAccess: 'always', wmode:flashWmode}, 
			{id: 'flashApp'});
	
}

function talkToFlash(command,params) 
{
	console.log("talkToFlash " + command + " " + params);
	if(appletObject == undefined)
    { 	
    	appletObject	= $("#midiApplet")[0];
    	console.log(appletObject,flashObject);
    	jsReady 		= true;
    	if(flashObject == undefined)
    	{
    		loadApp();
    		return;
    	}
    } 
    flashObject.executeASMethod(command,params);
}

function talkToJava(command,params) 
{
	//console.log("talkToJava " + command + " " + params);
	if(flashObject == undefined)
	{
		flashObject = $("#flashApp")[0];
		console.log("flashObject",flashObject);
	}
	switch(command)
	{
		case "stop":
			$("#"+javaDivId).html("");
			appletObject = null;
			flashObject.executeASMethod(command,"<midi-connection-stopped/>");
			break;
		case "start":
			$("#"+javaDivId).html(javaDivHTML);
			break;
		default:
			appletObject.executeJavaMethod(command,params);
	}
}

function javaScriptReady()
{
	console.log("jsReady called")
	return jsReady;
}
