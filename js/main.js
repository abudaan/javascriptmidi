
$(document).ready(function(){
        
    SampleApp([abumarkub.midi.MidiBridge,abumarkub.midi.keyboard.Regular,abumarkub.midi.MidiMessage], function(box){         
      
        var midiLog         = $("#midi-log");
        var menuMidiIn      = $("#midi-in");
        var menuMidiOut     = $("#midi-out");
        var id              = -1;

        //connect DOM elements to MidiBridge
        box.setElement("midi-log",midiLog);
        box.setElement("midi-inputs",menuMidiIn);
        box.setElement("midi-outputs",menuMidiOut);
        //start the MidiBridge
        box.loadJava();
        //add an optional extra module that allows you to play with your regular computer keyboard
        box.initRegularKeyboard();
        //add the extra input to the MidiBridge
        box.addInput(100,"Regular Computer Keyboard");
               
                
        menuMidiIn.change(function(){
            $("#midi-in option:selected").each(function () {
                id = $(this).val();
                //if regular keyboard is selected, set it active so it starts sending midi events on keypress
                box.useRegularKeyBoard(id === "100")
                if(id !== "100"){
                    box.setDevice("midi-in",id);
                }
            });
        })

        menuMidiOut.change(function(){
            $("#midi-out option:selected").each(function () {
                id = $(this).val();
                box.setDevice("midi-out",id);
            });
        })

        $("#refresh-devices").click(function(){
            box.useRegularKeyBoard(false);
            box.refreshDevices();
        })

        $("#clear-log").click(function(){
            box.clearMidiLog();
        })        
    });
});
