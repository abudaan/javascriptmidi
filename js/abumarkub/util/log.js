var abumarkub   = abumarkub || {};
abumarkub.util  = abumarkub.util || {};

abumarkub.util.log = function(box,show){

    var logMsgIndex = 0;
    var debug       = $("#debug");
    debug.css("visibility",show ? "visible" : "hidden");
    
    box.log = function(){
        debug.append("<div class='debug-number'>[" + ++logMsgIndex + "]</div>");
        for(var i = 0; i < arguments.length; i++){
            debug.append(arguments[i] + " ");
        }
        debug.append("<br/>");
        debug.scrollTop(debug.attr("scrollHeight")+1);
    }
}