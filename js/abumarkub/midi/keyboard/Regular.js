var abumarkub   = abumarkub || {};
abumarkub.midi  = abumarkub.midi || {};
abumarkub.midi.keyboard = abumarkub.midi.keyboard || {};

//Regular = (function(box)
abumarkub.midi.keyboard.Regular = (function(box)
{    
    var isActive = false;
    
    function init(element)
    {      
        if(element == null)
        {
            element = $(document);
        }
        
        var midiMessage     = "",
        midiNoteNumber  = -1,
        code            = -1;
    
        element.keydown(function(e){
            code            = (e.keyCode ? e.keyCode : e.which);
            midiNoteNumber  = getMidiNoteNumber(code);
            if(midiNoteNumber != -1 && isActive)
            {
                //midiMessage = "<midi-data data1='" + midiNoteNumber + "' data2='90' channel='0' command='144' status='144' />";
                midiMessage = "144,1," + midiNoteNumber + ",90";//command,channel,data1,data2(velocity)
                box.sendJsMidiEvent(midiMessage);
            }
        });

        element.keyup(function(e){
            code            = (e.keyCode ? e.keyCode : e.which);
            midiNoteNumber  = getMidiNoteNumber(code);
            if(midiNoteNumber != -1 && isActive)
            {
                //midiMessage = "<midi-data data1='" + midiNoteNumber + "' data2='0' channel='0' command='128' status='144' />";
                midiMessage = "128,1," + midiNoteNumber + ",0";//command,channel,data1,data2(velocity)
                box.sendJsMidiEvent(midiMessage);
            }
        });
    }
    
    function setActive(flag)
    {
        isActive = flag;
    }
     
    function getMidiNoteNumber(keyCode)
    {
        var midiNoteNumber = -1;
                
        switch(keyCode)
        {
            case 65://a
                midiNoteNumber = 60;//C4
                break;
            case 83://s
                midiNoteNumber = 62;//D4
                break;
            case 68://d
                midiNoteNumber = 64;//E4
                break;
            case 70://f
                midiNoteNumber = 65;//F4
                break;
            case 71://g
                midiNoteNumber = 67;//G4
                break;
            case 72://h
                midiNoteNumber = 69;//A4
                break;
            case 74://j
                midiNoteNumber = 71;//B4
                break;
            case 75://k
                midiNoteNumber = 72;//C5
                break;
        }
        return midiNoteNumber;
    } 
    
    box.initRegularKeyboard = init;
    box.useRegularKeyBoard  = setActive;
});

