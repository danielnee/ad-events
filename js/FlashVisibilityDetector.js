function FlashVisibilityDetector() {
    
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