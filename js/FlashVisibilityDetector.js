function FlashVisibilityDetector() {
    
    this.CreateFlashElement = function(parentElement, parentHeight, parentWidth) {
        var cachebust = new Date().getTime();
        var element = document.createElement("object");
        element.classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";
        element.height = "1";
        element.width = "1";
        element.id = "detector";
   
        var src = "http://false-domain-1.com/UrlExtractor/as/FrameRateDetector.swf"
   
        element.appendChild(CreateParam("allowScriptAccess", "always"));
        element.appendChild(CreateParam("allowFullScreen", "false"));
        element.appendChild(CreateParam("movie", src));
        element.appendChild(CreateParam("quality", "high"));
        element.appendChild(CreateEmbed(src));
        
        var leftOffset = Math.floor(parentWidth / 2);
        var topOffset = Math.floor(parentHeight / 2);
        
        element.style.position = "relative";
        element.style.width = "10px";
        element.style.opacity = "1";
        element.style.height = "10px";
        element.style["z-index"] = "100";
        element.style.top = leftOffset + "px";
        element.style.left = topOffset + "px";
        parentElement.appendChild(element);
        return element;
    }
    
    this.CreateFlashElement = function(parentElement, parentWidth, parentHeight) {
        var cachebust = new Date().getTime();
        var element = document.createElement("div");
        var id = "a" + cachebust;
        element.id = id;
        parentElement.appendChild(element);
        
        
        var src = "http://false-domain-1.com/UrlExtractor/as/FrameRateDetector.swf?t=" + cachebust;
        var leftOffset = Math.floor(parentWidth / 2);
        var topOffset = Math.floor(parentHeight / 2);
     
        var flashvars = {
           play : "true",
           loop : "true",
           quality : "high",
           allowscriptaccess: "always",
           allowfullscreen : "false",
           wmode : "transparent"
        };
        var params = {};
        var attributes = {};

        
        swfobject.embedSWF(src, id, 1, 1, "10.0.1" ,"expressInstall.swf", flashvars, params, attributes); 
     swfobject.createCSS("#" + id, "position: absolute; width: 1px; height: 1px; z-index: -100; top: " + leftOffset + "px; left: " + topOffset + "px; opacity: 0");
     return id
    }    
}