function FlashVisibilityDetector() {
    
    this.CreateFlashElement = function(parentElement, parentWidth, parentHeight, callback) {
        var cachebust = new Date().getTime();
        var element = document.createElement("div");
        var id = "a" + cachebust;
        element.id = id;
        parentElement.appendChild(element);
        
        var src = SWF_URL;
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
        var attributes = {"allowscriptaccess" : "always"};

        swfobject.switchOffAutoHideShow();
        swfobject.embedSWF(src, id, 1, 1, "10.0.1" ,"expressInstall.swf", flashvars, params, attributes, callback); 
     swfobject.createCSS("#" + id, "position: absolute; width: 1px; height: 1px; z-index: -100; top: " + leftOffset + "px; left: " + topOffset + "px; visibility: hidden");
     return id;
    }    
}