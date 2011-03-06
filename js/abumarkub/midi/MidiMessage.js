var abumarkub   = abumarkub || {};
abumarkub.midi  = abumarkub.midi || {};

abumarkub.midi.MidiMessage = (function(box){
    
    //console.log("MidiMessage");
    var abuMidi = abumarkub.midi;
    var getNoteName = abuMidi.getNoteName;
    var getStatusCode = abuMidi.getStatusCode;
    
    var construct = function(xml)//constructor 
    {
        this.data1      = xml.find("msg").attr("data1");
        this.data2      = xml.find("msg").attr("data2");
        this.status     = xml.find("msg").attr("status");
        this.command    = xml.find("msg").attr("command");
        this.command    = this.data2 == 0 && this.command == abuMidi.Status.NOTE_ON ? abuMidi.Status.NOTE_OFF : this.command;     
        this.channel    = xml.find("msg").attr("channel");
        this.noteName   = getNoteName(this.data1);
        this.statusCode = getStatusCode(+this.command);
    }
    
    var toString = function()
    {
        var s = "";
        s += this.noteName + " " + this.statusCode + " " + this.data1 + " " + this.data2 + " " + this.status + " " + this.command;
        return s;
    }
    
    construct.prototype = {
        constructor: abuMidi.MidiMessage,
        toString: toString
    }
    
    //return construct;
    box.MidiMessage = construct;
});

