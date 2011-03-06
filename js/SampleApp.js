SampleApp = function()
{
    var args            = Array.prototype.slice.call(arguments),
        callback        = args.pop(),
        dependencies    = (args[0] && typeof args[0] === "string") ? args : args[0],
        i;
    
    if(!(this instanceof SampleApp))
    {
        //console.log("force new");
        return new SampleApp(dependencies,callback);
    }
   
    var numDependencies = dependencies.length;
    for(i = 0; i < numDependencies; i+=1)
    {
        //console.log(dependencies[i]);
        dependencies[i](this);
    }
    
    callback(this);
}

