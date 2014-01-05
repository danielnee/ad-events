function FlashVisibilityDetector() {
    
    this.CreateFlashElement = function(parentElement, width, height, callback, browser, ieVersion, ieDocVersion) {
        var cachebust = new Date().getTime();
        var element = document.createElement("div");
        var id = "a" + cachebust;
        element.id = id;
        parentElement.appendChild(element);
        
        var src = SWF_URL;
        var leftOffset = Math.floor(width / 2);
        var topOffset = Math.floor(height / 2);
     
        var flashvars = {
           play : "true",
           loop : "true",
           quality : "high",
           allowscriptaccess: "always",
           allowfullscreen : "false",
           wmode : "transparent"
        };
        var params = { allowscriptaccess: "always", wmode : "transparent"};
        var attributes = {
            "id" : id,
            "name" : id,
            "allowscriptaccess" : "always",
             "wmode" : "transparent"
        };

        swfobject.switchOffAutoHideShow();
        swfobject.embedSWF(src, id, 1, 1, "10.0.1" ,"expressInstall.swf", flashvars, params, attributes, callback); 
        
        var css = "position: absolute; width: 1px; height: 1px; z-index: -100; top: " + leftOffset + "px; left: " + topOffset + "px; opacity: 0; filter : alpha(opacity=0);"
        
        // For IE 8 and below we cant use visible : invisble
        if (!(browser == BrowserDetection.IE && (ieVersion == BrowserDetection.IE_VERSION_6 || ieVersion == BrowserDetection.IE_VERSION_7 || ieVersion == BrowserDetection.IE_VERSION_8))) {
            css += "visibility : hidden;"
        }
    
        swfobject.createCSS("#" + id, css);
        
        return id;
    }    
}