var abumarkub   = abumarkub || {};
abumarkub.midi  = abumarkub.midi || {};

abumarkub.midi.MidiBridge = function(box)
{
    var MidiBridgeApp   = abumarkub.midi.MidiBridge,
    javaDiv             = $("#java"),
    applet              = null,
    flash               = null,
    midiLog             = null,
    menuMidiIn          = null,
    menuMidiOut         = null,
    extraInputs         = [],
    extraOutputs        = [];
    
                  
    /**
     * static method called by Java Applet
     */
    MidiBridgeApp.msgFromJava = function(data) 
    {
        //console.log("msgFromJava " + data);
        var xml     = $($.parseXML(data));
        var id      = xml.find("msg").attr("id");
        var error   = xml.find("msg").find("error").text();
        var warning = xml.find("msg").find("warning").text();
        if(error !== "")
        {
            logMidiMessage("error",error);
        }
        else if(warning !== "")
        {
            logMidiMessage("warning",warning);
        }
        var midiMsg;
        switch(id)
        {
            case "config":
                if(error === "" && warning === ""){
                    populateDropdownMenus(xml);
                }
                break;
            
            case "midi-data":
                midiMsg = new box.MidiMessage(xml);
                logMidiMessage("in", midiMsg.toString());
                break;
            
            case "midi-in":
                if(error === "" && warning === ""){
                    logMidiMessage("in", "midi in set to " + xml.text());
                }else{
                    logMidiMessage("in", "midi in set to " + xml.find("port").text());
                }
                break;
            
            case "midi-out":
                if(error === "" && warning === ""){
                    logMidiMessage("in", "midi out set to " + xml.text());
                }else{
                    logMidiMessage("in", "midi out set to " + xml.find("port").text());
                }
                break;
            /*
            case "js-midi-event":
                if(error === "" && warning === ""){
                    midiMsg = new box.MidiMessage(xml);
                    logMidiMessage("out", midiMsg.toString());
                }
                break;
            */
            case "upgrade-java":
                javaDiv.html("You need to upgrade your Java plugin. You can upgrade <a href='http://www.java.com/en/' target='blank' title='abumarkub midibridge download java' rel='abumarkub midibridge download java'>here</a>");
                break;
            
            case "midi-started":
                getDevices();
                break;
        }
    }
        
    /**
     * first function to be called after page load and initialisation of MidiBrigde
     */
    function loadJava()
    {
        //console.log("loadJava");        
        javaDiv.html('<object tabindex="0" id="midi-applet" type="application/x-java-applet" height="10" width="10">' + 
            '<param name="codebase" value="java/" />' + 
            '<param name="archive" value="midiapplet.jar" />' + 
            '<param name="code" value="net.abumarkub.midi.applet.MidiApplet" />' + 
            '<param name="scriptable" value="true" />' + 
            '<param name="minJavaVersion" value="1.5">' + 
            'Your browser needs the Java plugin to use the midibridge. You can download it <a href="http://www.java.com/en/" target="blank" title="abumarkub midibridge download java" rel="abumarkub midibridge download java">here</a>' + 
            '</object>');
        
        
        //console.log($.client.os,$.client.browser,$.browser.version);
    }
    
    /**
     * initialise Javascript applet object and get all midi devices
     */
    function getDevices()
    {    
        try{
            applet      = getObject("midi-applet"); 
            applet.executeJavaMethod("test","test");
        }catch(e){
            //console.log(e)
            setTimeout(getDevices,25);//Firefox needs more time to initialize the Applet
            return;
        }
        refreshDevices();
    }
   
    function populateDropdownMenus(xml) 
    {      
        //console.log("populateDropdownMenus");
        
        xml.find("device").each(function()
        {
            var id      = $(this).attr("id");
            var name    = $(this).find("name").text();
            var type    = $(this).attr("type");
            //console.log(type,id,name);
            
            if(type == "input")  
            {
                if(menuMidiIn !== null){
                    menuMidiIn.append($("<option></option>").attr("value",id).text(name));                
                }
            }  
            else if(type == "output")  
            {
                if(menuMidiOut !== null){
                    menuMidiOut.append($("<option></option>").attr("value",id).text(name));
                }
            }  
        });
        
        var i       = 0,
        max         = 0;
        
        if(menuMidiIn !== null){
            max = extraInputs.length;
            for(i = 0; i < max; i +=1){
                menuMidiIn.append(extraInputs[i]);
            }                       
        }

        if(menuMidiOut !== null){
            max = extraOutputs.length;
            for(i = 0; i < max; i +=1){
                menuMidiOut.append(extraOutputs[i]);
            }                       
        }
    }
    
    
    /// PUBLIC API ///
    
    function setElement(id,element)
    {
        switch(id)
        {
            case "midi-log":
                midiLog = element;
                break;
            case "midi-inputs":
                menuMidiIn = element;
                break;
            case "midi-outputs":
                menuMidiOut = element;
                break;
        }
    }
    
    function sendJsMidiEvent(msg)
    {
        //console.log(msg);
        //logMidiMessage("internal", msg.toString());
        applet.executeJavaMethod("js-midi-event",msg);
    }

    function setDevice(type,id)
    {
        logMidiMessage("out", type + " " + id);
        applet.executeJavaMethod(type,id);
    }
    
    function refreshDevices()
    {
        //console.log("refresh",applet);
        if(menuMidiIn !== null){
            menuMidiIn.children().remove().end().append('<option selected value="-1">choose midi input</option>');
        }
        if(menuMidiOut !== null){
            menuMidiOut.children().remove().end().append('<option selected value="-1">choose midi output</option>');
        }          
        applet.executeJavaMethod("get-devices",""); 
    }
    
    function addInput(id,name)
    {
        extraInputs.push('<option value="' + id + '">' + name + '</option>');
    }
    
    function addOutput(id,name)
    {
        extraOutputs.push('<option value="' + id + '">' + name + '</option>');
    }
    
    function logMidiMessage(cmd,msg)
    {
        if(midiLog == null){
            return
        }
        midiLog.append("<div class='midi-log-cmd'>" + cmd + "</div>" + msg + "<br/>");
        midiLog.scrollTop(midiLog.attr("scrollHeight")+1);
    }

    function clearMidiLog()
    {
        if(midiLog == null){
            return
        }
        midiLog.html("");
    }
    
    function getObject(objectName) 
    {
        if($.browser.msie || $.browser.webkit) 
        {
            return window[objectName];
        }
        else 
        {
            return document[objectName];
        }
    }
    
    //public api
    box.loadJava        = loadJava;
    box.setDevice       = setDevice;
    box.refreshDevices  = refreshDevices;
    box.sendJsMidiEvent = sendJsMidiEvent;
    box.setElement      = setElement,
    box.clearMidiLog    = clearMidiLog,
    box.addInput        = addInput,
    box.addOutput       = addOutput;
}

