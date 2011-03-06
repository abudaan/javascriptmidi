var abumarkub   = abumarkub || {};
abumarkub.midi  = abumarkub.midi || {};

abumarkub.midi.getNoteName = (function(){
    
    var noteNamesSharp  = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var noteNamesFlat   = ["C","D♭","D","E♭","E","F","G♭","G","A♭","A","B♭","B"];
    
    //console.log("getNoteName");
    
    return(function(noteNumber,mode){
        
        var octave      = Math.floor(((noteNumber)/12)-1); 
        var noteName    = mode == "sharp" ? noteNamesSharp[noteNumber % 12] : noteNamesFlat[noteNumber % 12];
			
        return noteName + "" + octave;	
    });
})();
