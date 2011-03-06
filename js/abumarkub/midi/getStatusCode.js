var abumarkub   = abumarkub || {};
abumarkub.midi  = abumarkub.midi || {};

abumarkub.midi.getStatusCode = (function(){
    
    abumarkub.midi.Status = {
       
        NOTE_OFF            : 0x80,//128
        NOTE_ON             : 0x90,//144
        POLY_PRESSURE       : 0xA0,//160
        CONTROL_CHANGE      : 0xB0,//176
        PROGRAM_CHANGE      : 0xC0,//192
        CHANNEL_PRESSURE    : 0xD0,//208
        PITCH_BEND          : 0xE0,//224
        SYSTEM_EXCLUSIVE    : 0xF0//240
    } 	
    
    var commands    = [];
    commands[0x80]  = "NOTE OFF";
    commands[0x90]  = "NOTE ON";
    commands[0xA0]  = "POLY PRESSURE";
    commands[0xB0]  = "CONTROL CHANGE";
    commands[0xC0]  = "PROGRAM CHANGE";
    commands[0xD0]  = "CHANNEL PRESSURE";
    commands[0xE0]  = "PITCH BEND";
    commands[0xF0]  = "SYSTEM EXCLUSIVE";
    
    //console.log("getStatusCode");
    
    return(function(command){
       
        return commands[command];
   });
})();
