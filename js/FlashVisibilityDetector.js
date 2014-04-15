function FlashVisibilityDetector() {
    
    this.CreateFlashElement = function(parentElement, width, height, callback, browser, ieVersion, ieDocVersion) {
        var cachebust = new Date().getTime();
        var element = document.createElement("div");
        var id = "a" + cachebust;
        element.id = id;
        parentElement.appendChild(element);
        
        var src = SWF_URL;
     
        var flashvars = {
           play : "true",
           loop : "true",
           quality : "high",
           allowscriptaccess: "always",
           allowfullscreen : "false",
           wmode : "window"
        };
        var params = { allowscriptaccess: "always", wmode : "window"};
        var attributes = {
            "id" : id,
            "name" : id,
            "allowscriptaccess" : "always",
            "wmode" : "window"
        };

        swfobject.switchOffAutoHideShow();
        swfobject.embedSWF(src, id, 1, 1, "10.0.1" ,"expressInstall.swf", flashvars, params, attributes, callback); 
                
        return id;
    }    
}