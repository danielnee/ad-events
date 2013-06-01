function PageGenerator(iIframeDepth, bSameDomain, bAltFrame) {
    
    var piIframeDepth = iIframeDepth;
    var pbSameDomain = bSameDomain;
    var pbAltFrame = bAltFrame;
    
    this.CreatePage = function() {
        if (pbSameDomain == "true") {
           var sDomain = "true-domain.com";
        }
        else {
           var sDomain = "false-domain-" + piIframeDepth + ".com";
        }
       
        if (piIframeDepth == 1) {
            var sPage = "http://" + sDomain + "/UrlExtractor/ad.html";
            $("body").append(this.CreateIframe(sPage));
        }
        else if (piIframeDepth > 1) {            
            var sPage = "http://" + sDomain + "/UrlExtractor/index.html?depth=" + (piIframeDepth - 1) + "&sameDomain=" + pbSameDomain;
            $("body").append(this.CreateIframe(sPage));
        }
        else {
            $("body").append("<script src=\"js/Common.js\"></script>");
            $("body").append("<script src=\"js/FlashDetect.js\"></script>");
            $("body").append("<script src=\"js/BrowserDetection.js\"></script>");
            $("body").append("<script src=\"js/FrameDetector.js\"></script>");
            $("body").append("<script src=\"js/ElementPositionFinder.js\"></script>");
            $("body").append("<script src=\"js/BlockedPositionFinder.js\"></script>");
            $("body").append("<script src=\"js/swfobject.js\"></script>");
            $("body").append("<script src=\"js/FlashVisibilityDetector.js\"></script>");
            $("body").append("<script src=\"js/MouseoverDetection.js\"></script>");
            $("body").append("<script src=\"js/ContentLoaded.js\"></script>");
            $("body").append("<script src=\"js/Main.js\"></script>");
            $("body").append("<img src=\"img/lena.png\" height=\"300\" width=\"250\"> ");
        }
        
        if (pbAltFrame == "true") {
            var sAltDomain = "false-domain-" + 1 + ".com";
            var sPage = "http://" + sAltDomain + "/UrlExtractor/alt.html";
            $("body").append(this.CreateIframe(sPage));
        }
    }
    
    this.CreateIframe = function(sSrc) {
        return "<iframe width=\"300\" scrolling=\"no\" height=\"250\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" bordercolor=\"#000000\" vspace=\"0\" hspace=\"0\" src=\"" + sSrc + "\"></iframe>";
    }
}