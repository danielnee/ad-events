var UNDEFINED = "undefined";
var EVENT_URL = "//event.adamity.com/event.gif";
var SWF_URL = "//cdn.adamity.com/FrameRateDetector.swf"

Object.extend = function(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};/**
    Detects if flash is installed and the installed version
    
    Copyright (c) Copyright (c) 2007, Carl S. Yestrau All rights reserved.
    Code licensed under the BSD License: http://www.featureblend.com/license.txt
    Version: 1.0.4
*/
function FlashDetect() {
    var self = this;
    self.installed = false;
    self.raw = "";
    self.major = -1;
    self.minor = -1;
    self.revision = -1;
    self.revisionStr = "";
    
    var activeXDetectRules = [
        {
            "name":"ShockwaveFlash.ShockwaveFlash.7",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash.6",
            "version":function(obj){
                var version = "6,0,21";
                try{
                    obj.AllowScriptAccess = "always";
                    version = getActiveXVersion(obj);
                }catch(err){}
                return version;
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        }
    ];
    
    /**
     * Extract the ActiveX version of the plugin.
     * 
     * @param {Object} The flash ActiveX object.
     * @type String
     */
    var getActiveXVersion = function(activeXObj){
        var version = -1;
        try{
            version = activeXObj.GetVariable("$version");
        }catch(err){}
        return version;
    };
    
    /**
     * Try and retrieve an ActiveX object having a specified name.
     * 
     * @param {String} name The ActiveX object name lookup.
     * @return One of ActiveX object or a simple object having an attribute of activeXError with a value of true.
     * @type Object
     */
    var getActiveXObject = function(name){
        var obj = -1;
        try{
            obj = new ActiveXObject(name);
        }catch(err){
            obj = {activeXError:true};
        }
        return obj;
    };
    /**
     * Parse an ActiveX $version string into an object.
     * 
     * @param {String} str The ActiveX Object GetVariable($version) return value. 
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseActiveXVersion = function(str){
        var versionArray = str.split(",");//replace with regex
        return {
            "raw":str,
            "major":parseInt(versionArray[0].split(" ")[1], 10),
            "minor":parseInt(versionArray[1], 10),
            "revision":parseInt(versionArray[2], 10),
            "revisionStr":versionArray[2]
        };
    };
    /**
     * Parse a standard enabledPlugin.description into an object.
     * 
     * @param {String} str The enabledPlugin.description value.
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseStandardVersion = function(str){
        var descParts = str.split(/ +/);
        var majorMinor = descParts[2].split(/\./);
        var revisionStr = descParts[3];
        return {
            "raw":str,
            "major":parseInt(majorMinor[0], 10),
            "minor":parseInt(majorMinor[1], 10), 
            "revisionStr":revisionStr,
            "revision":parseRevisionStrToInt(revisionStr)
        };
    };
    /**
     * Parse the plugin revision string into an integer.
     * 
     * @param {String} The revision in string format.
     * @type Number
     */
    var parseRevisionStrToInt = function(str){
        return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
    };
    
   
    /**
     * Constructor, sets raw, major, minor, revisionStr, revision and installed public properties.
     */
    self.FlashDetect = function(){
        if(navigator.plugins && navigator.plugins.length>0){
            var type = 'application/x-shockwave-flash';
            var mimeTypes = navigator.mimeTypes;
            if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description){
                var version = mimeTypes[type].enabledPlugin.description;
                var versionObj = parseStandardVersion(version);
                self.raw = versionObj.raw;
                self.major = versionObj.major;
                self.minor = versionObj.minor; 
                self.revisionStr = versionObj.revisionStr;
                self.revision = versionObj.revision;
                self.installed = true;
            }
        }else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript){
            var version = -1;
            for(var i=0; i<activeXDetectRules.length && version==-1; i++){
                var obj = getActiveXObject(activeXDetectRules[i].name);
                if(!obj.activeXError){
                    self.installed = true;
                    version = activeXDetectRules[i].version(obj);
                    if(version!=-1){
                        var versionObj = parseActiveXVersion(version);
                        self.raw = versionObj.raw;
                        self.major = versionObj.major;
                        self.minor = versionObj.minor; 
                        self.revision = versionObj.revision;
                        self.revisionStr = versionObj.revisionStr;
                    }
                }
            }
        }
    }();
};
function BrowserDetection() {
    
    /**
     * Detect the browser without using navigator
     * @return String Browser name
     */
    this.DetectBrowser = function() {
        var browser = BrowserDetection.UNKNOWN;
        
        if (typeof window.opera !== UNDEFINED && window.opera.buildNumber !== UNDEFINED) {
            browser = BrowserDetection.OPERA;
        }
        else if (typeof window.mozInnerScreenY !== UNDEFINED) {
            browser = BrowserDetection.FIREFOX;
        }
        else if (typeof window.chrome !== UNDEFINED && typeof window.chrome.app !== UNDEFINED) {
            browser = BrowserDetection.CHROME;
        }
        else if (typeof window.WebKitPoint !== UNDEFINED) {
            browser = BrowserDetection.SAFARI;
        }
        else if (typeof window.attachEvent !== UNDEFINED) {
            browser = BrowserDetection.IE;
        }
        return browser;
    }
    
    /**
     * Detect the IE version number
     * @return String IE version number
     */
    this.DetectIEVersion = function() {
        var version = BrowserDetection.IE_VERSION_UNKNOWN;
        if (window.atob) {
            version = BrowserDetection.IE_VERSION_10;
        }
        else if (document.addEventListener) {
            version = BrowserDetection.IE_VERSION_9;
        }
        else if (window.JSON && document.querySelector) {
            version = BrowserDetection.IE_VERSION_8;
        }
        else if (window.XMLHttpRequest) {
            version = BrowserDetection.IE_VERSION_7;
        }
        else if (document.compatMode) {
            version = BrowserDetection.IE_VERSION_6; 
        }
        return version;
    }
    
    /**
     * Detect IE version from component version
     */
    this.DetectActualIEBrowserVersion = function() {
        var element = document.createElement("div");
        var version = "Unknown";
        try {
            element.style.behavior = "url(#default#clientcaps)";
            version = element.getComponentVersion("{89820200-ECBD-11CF-8B85-00AA005B4383}","componentid").replace(/,/g,".")
        } 
        catch (cException) {
            // Just catch exception
        }
        return version;
    }
    
    /**
     * Detect IE version from document mode
     */
    this.DetectDocumentMode = function() {
        return document && document.documentMode ? document.documentMode : BrowserDetection.IE_VERSION_UNKNOWN;
    }
    
    /**
     * Find the screen width and height
     */
    this.ScreenSize = function() {
        return [screen.availWidth, screen.availHeight];
    }
    
    /**
     * Get the browser client's timezone
     */
    this.ClientTimezone = function() {
        return new Date().getTimezoneOffset();
    }
    
    /**
     * Get the browser client language
     */
    this.ClientLanguage = function() {
        return window.navigator.userLanguage || window.navigator.language;
    }
    
    /**
     * Test if cookies are available
     */
    this.CookiesAvailable = function() {
        return navigator.cookieEnabled || ("cookie" in document && (document.cookie.length > 0 || (document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
    }
}

BrowserDetection.UNKNOWN = "Unknown";
BrowserDetection.OPERA = "Opera";
BrowserDetection.FIREFOX = "Firefox";
BrowserDetection.CHROME = "Chrome";
BrowserDetection.SAFARI = "Safari";
BrowserDetection.IE = "IE";

BrowserDetection.IE_VERSION_10 = 10;
BrowserDetection.IE_VERSION_9 = 9;
BrowserDetection.IE_VERSION_8 = 8;
BrowserDetection.IE_VERSION_7 = 7;
BrowserDetection.IE_VERSION_6 = 6;
BrowserDetection.IE_VERSION_UNKNOWN = "Unknown";function FrameDetector() {
    
    var iMaxDepth = 20;
    var iMaxTopDownIterations = 200;
    
    /**
     * Find the iframe depth of a window
     * @param window cCurWindow A window object
     */
    this.FindWindowDepth = function(cCurWindow) {
        var iCurDepth = 0;
        var cTopWindow = cCurWindow.top;
        // Extra looping condition to ensure we do not enter infinite loop and lock up browser
        while (cCurWindow != cTopWindow && iCurDepth <= iMaxDepth) {
            cCurWindow = cCurWindow.parent;
            iCurDepth++;
        }
        
        if (iCurDepth > iMaxDepth) {
            iCurDepth = -1; // Use -1 as error state
        }
        return iCurDepth;
    }
    
    /**
     * Find the highest reachable window with going cross domain
     * @param window cCurWindow A window object
     * @param int iCurDepth Depth of window
     */
    this.FindTopReachableWindow = function(cCurWindow, iCurDepth) {
        if (iCurDepth == -1 ) {
            return [cCurWindow, iCurDepth];
        }
        
        var ancestors = this.GetAncestors(cCurWindow);
        
        // Standard check for Firefox, IE, Safari
        if (ancestors === null) {
             try {
                var cTopWindow = cCurWindow.top;
                while (cCurWindow != cTopWindow) {
                    cCurWindow.parent.location.href; // Access test
                    cCurWindow = cCurWindow.parent;
                    iCurDepth--;
                }
            }
            catch (cException) {
            // Just need to catch the exception
            }
            return [cCurWindow, iCurDepth]
        }
        // Ancestor based check Chrome
        else {
            // Cycle through ancestors until we are blocked
            var curOrigin = cCurWindow.location.origin
            var bestDepth = iCurDepth;
            for (var i = ancestors.length - 1; i >= 0; i--) {
                if (ancestors[i] == curOrigin) {
                    bestDepth = i;
                }
            }
            
            // Now take the highest ancestor
            while (iCurDepth != bestDepth) {
                iCurDepth--;
                cCurWindow = cCurWindow.parent;
            }
            return [cCurWindow, iCurDepth];
        }
       
    }
    
    /**
     * Performs a breadth first search on all frames to see if we can
     * find one where we have access that is higher than current highest most reachable
     * @param window cTopWindow The top most window
     * @param int iCurDepth Depth of window highest reachable window
     */
    this.SearchTopDownReachable = function(cTopWindow, iCurWindowDepth, cCurWindow) {
        
        if (iCurWindowDepth == 0) {
            return [null, -1];
        }
        
        var ancestors = this.GetAncestors(cCurWindow);
        // Check for Chrome
        if (ancestors !== null) {
            // At the moment no way to stop this code throwing errors in the log
            // so don't run this detection in Chrome
            return [null, -1];
        }
        
        var aWindowsTest = [];
        aWindowsTest.push({
            win: cTopWindow,
            depth: 0
        });
        
        var iIterations = 0;
        
        while (aWindowsTest.length > 0 && iIterations <= iMaxTopDownIterations) {
            var cCurTest = aWindowsTest.shift();
            var cWindow = cCurTest.win;
            var iDepth = cCurTest.depth;
            
            if (iDepth >= iCurWindowDepth) {
                return [null, -1];
            }
            
            try {
                cWindow.location.href; // Access test
                return [cWindow, iDepth];
            }
            catch (cException) {
            // Just need to catch the exception
            }
            
            // Add all the frames to the stack
            for (var i = 0; i < cWindow.frames.length; i++) {
                aWindowsTest.push({
                    win: cWindow.frames[i],
                    depth: (iDepth + 1)
                });
            }
            iIterations++;
        }
        return [null, -1];
    }
    
    /**
     * Gets the URL closest to the parent window
     * @param window cCurWindow A window object
     * @param int iCurDepth Depth of window
     */
    this.DetectUrl = function(cCurWindow, iCurDepth) {
        if (iCurDepth == 0) {
            return cCurWindow.location.href;
        }
        else {
            return cCurWindow.document.referrer;
        }
    }
    
    /**
     * Gets ancestor list. Only works Chrome/Webkit browsers
     * @param window cCurWindow A window object
     */
    this.GetAncestors = function(cCurWindow) {
        var ancestors = cCurWindow.location.ancestorOrigins;
        if (ancestors === undefined) {
            ancestors = null;
        }
        return ancestors;
    }
}function ElementPositionFinder() {
    
    var cSelf = this;
 
    this.FindObjectPoistion = function(cObj, cCurrentWindow) {
        if (cObj.getBoundingClientRect) {
            return this.FindObjectPositionRect(cObj, cCurrentWindow)
        } else { // old browser
            return this.FindObjectPositionOffset(cObj)
        }
    }
 
    this.FindObjectPositionOffset = function(cObj) {
        // NOTES:
        // Calculating offsetTop, IE 5-7 does not count elements with position: relative as offsetParents, 
        // and moves on to the next offsetParent in the chain. offsetLeft is calculated correctly
        
        var iCurLeft = 0;
        var iCurTop = 0;
        if (cObj.offsetParent) {
            do {
                iCurLeft += cObj.offsetLeft;
                iCurTop += cObj.offsetTop;
            } while (cObj = cObj.offsetParent);
        }
        return [iCurTop, iCurLeft];
    }
    
    this.FindObjectPositionRect = function(cObj, cCurWindow) {
        var box = cObj.getBoundingClientRect();

        var body = cCurWindow.document.body;
        var docElem = cCurWindow.document.documentElement;
	     

        var scroll =  this.GetPageScroll(cCurWindow);
        var scrollTop = scroll[0];
        var scrollLeft = scroll[1];

        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0

        var top  = box.top +  scrollTop - clientTop
        var left = box.left + scrollLeft - clientLeft
        
        return [ Math.round(top), Math.round(left) ]
    }
    
    function ComputeVisible(cObj, cCurWindow, iCurScrollLeft, iCurScrollTop) {
        var aPos = cSelf.FindObjectPosition(cObj, cCurWindow);
        var iYPos = aPos[0];
        var iXPos = aPos[1];
        var iHeightViewport = this.GetViewportHeight(cCurWindow);
        var iWidthViewport = this.GetViewportWidth(cCurWindow);
        var iObjHeight = this.GetHeight(cObj);
        var iObjWidth = this.GetWidth(cObj);
        
        return thisComputeVisiblePercent(iXPos, iYPos, iObjWidth, iObjHeight, iWidthViewport, iHeightViewport, iCurScrollLeft, iCurScrollTop);
    }
    
    /**
     * Compute the percentage of the object currently visible
     * @param int iX The X position of the object
     * @param int iY The Y position of the object
     * @param int iObjWidth The width of the object
     * @param int iObjHeight The height of the object
     * @param int iViewportWidth The width of the viewport
     * @param int iViewportHeight The height of the viewport
     * @param int iScrollLeft The current left scroll
     * @param int iScollRight The current scroll right
     */
    this.ComputeVisiblePercent = function(iX, iY, iObjWidth, iObjHeight, iViewportWidth, iViewportHeight, iScrollLeft, iScrollTop) {
        var iVisibleWidth = 0;
        
        if (iX < 0) {
            iVisibleWidth = Math.max(iObjWidth + iX, 0);
        }
        else {
            var iXScrollOffset = iX - iScrollLeft;
            iVisibleWidth = Math.min(iObjWidth, Math.min(iObjWidth + iXScrollOffset, iViewportWidth - iXScrollOffset));
        }
        
        // Find the inital height visible
        var iVisibleHeight = 0;
        if (iY < 0) {
            iVisibleHeight = Math.max(iObjHeight + iY, 0);
        }
        else {
            var iYScrollOffset = iY - iScrollTop;
            iVisibleHeight = Math.min(iObjHeight, Math.min(iObjHeight + iYScrollOffset, iViewportHeight - iYScrollOffset));
        }
        
        // Handle offscreen cases
        if (iVisibleWidth < 0 || iVisibleHeight < 0) {
            return 0.0;
         }
        
        // Subtract the areas and compute the percentage
        var fTotalArea = iObjHeight * iObjWidth;
        if (fTotalArea <= 0) {
            // Element has a zero area
            return 0.0;
        }
        var fVisibleArea = iVisibleHeight * iVisibleWidth;
        return fVisibleArea / fTotalArea
    }
    
    this.ComputeInitiallyVisible = function(cObj, cCurWindow) {
        return ComputeVisible(cObj, cCurWindow, 0, 0)
    }
    
    this.ComputeCurrentlyVisible = function(cObj, cCurWindow) {
        var curentScroll = this.GetPageScroll(cCurWindow)
        return ComputeVisible(cObj, cCurWindow, curentScroll[0], curentScroll[1]);
    }
    
    this.IsVisible = function(visiblePercent) {
        return visiblePercent >= ElementPositionFinder.VISIBILITY_MINIMUM;
    }
    
    this.GetPageScroll = function(cCurWindow) {
        var xScroll, yScroll;
        if (cCurWindow.pageYOffset) {
            yScroll = cCurWindow.pageYOffset;
            xScroll = cCurWindow.pageXOffset;
        } else if (cCurWindow.document.documentElement && cCurWindow.document.documentElement.scrollTop) {
            yScroll = cCurWindow.document.documentElement.scrollTop;
            xScroll = cCurWindow.document.documentElement.scrollLeft;
        } else if (cCurWindow.document.body) {// all other Explorers
            yScroll = cCurWindow.document.body.scrollTop;
            xScroll = cCurWindow.document.body.scrollLeft;
        }
        return [xScroll,yScroll]
    }
    
    this.GetViewportWidth = function(cCurWindow) {
        return cCurWindow.document.documentElement.clientWidth;
    }
    
    this.GetViewportHeight = function(cCurWindow) {
        return cCurWindow.document.documentElement.clientHeight;
    }
    
    this.GetWidth = function(cCurObj) {
        return cCurObj.clientWidth;
    }
    
    this.GetHeight = function(cCurObj) {
        return cCurObj.clientHeight;
    }
    
    this.GetSize = function(cCurObj) {
        return [this.GetWidth(cCurObj), this.GetHeight(cCurObj)];
    }
    
    this.ComputeVolume = function(cCurObj) {
        return this.GetWidth(cCurObj) * this.GetHeight(cCurObj);
    }
    
    this.IsTabbedOut = function() {
        if (typeof document.hidden !== UNDEFINED) { // Opera 12.10 and Firefox 18 and later support
            return document.hidden
        } else if (typeof document.mozHidden !== UNDEFINED) {
            return document.mozHidden;
        } else if (typeof document.msHidden !== UNDEFINED) {
            return document.msHidden;
        } else if (typeof document.webkitHidden !== UNDEFINED) {
            return document.webkitHidden
        }
        else {
            return false;
        }
    }
    
    /**
     * Checks if the ad object is obstructed by another object
     * @param cAd The ad object, this should be obatained from FindAd
     */
    this.CheckForObstruction = function(cAd, cCurWindow) {
        var bObstructed = false;
        if (typeof cCurWindow.document.elementFromPoint !== UNDEFINED) {
            var aPos = this.FindObjectPoistion(cAd, cCurWindow);
            var aSize = this.GetSize(cAd);
            // Get roughly the center of the point
            var iCenterX = Math.floor(aPos[0] + (aSize[0] / 2));
            var iCenterY = Math.floor(aPos[1] + (aSize[1] / 2));
            var cElementAtCenter = cCurWindow.document.elementFromPoint(iCenterX, iCenterY);
            if (cElementAtCenter !== null) {
                bObstructed = cElementAtCenter !== cAd;
            }            
        }
        return bObstructed;
    }
    
    /**
     * Attempts to find the ad element
     * @param cElement An element belived to enclose the ad
     */
    this.FindAd = function(cElement) {
        var aPotentialAdElements =["iframe" ,"img" ,"a" ,"object","embed"];
        var cLargestObject = null;
        var iMaxSize = -1;
        
        for (var i = 0; i < aPotentialAdElements.length; i++) {
            var sCurrentElement = aPotentialAdElements[i];
            var aElements = cElement.getElementsByTagName(sCurrentElement);
           
            for (var j = 0; j < aElements.length; j++) {
                var cCurElement = aElements[j];
                var iElementSize = this.ComputeVolume(cCurElement);
                if (iElementSize > iMaxSize) {
                    iMaxSize = iElementSize;
                    cLargestObject = cCurElement;
                }
            }
        }
        
        return cLargestObject;
    }
}

ElementPositionFinder.VISIBILITY_MINIMUM = 0.5;function BlockedPositionFinder() {
    
    this.ScreenPos = function(curWindow) {
        var x = 0;
        if (typeof curWindow.screenX !== UNDEFINED) {
            x = curWindow.screenX;
        }
        else if (typeof curWindow.screenLeft !== UNDEFINED) {
            x = curWindow.screenLeft;
        }
        
        var y = 0;
        if (typeof curWindow.screenY !== UNDEFINED) {
            y = curWindow.screenY;
        }
        else if (typeof curWindow.screenLeft != UNDEFINED) {
            y = curWindow.screenTop;
        }
        return [x, y];
    }
    
    this.FullWindowSize = function(curWindow) {
        var width = 0;
        var height = 0;
        if (typeof curWindow.outerWidth !== UNDEFINED) {
            width = curWindow.outerWidth;
        }
        if (typeof curWindow.outerHeight !== UNDEFINED) {
            height = curWindow.outerHeight;
        }
        return [width, height];
    }
    
    this.FirefoxWindowPosition = function(curWindow) {
        var x = 0;
        var y = 0;
        if (typeof curWindow.mozInnerScreenX !== UNDEFINED) {
            x = curWindow.mozInnerScreenX;
        }
        if (typeof curWindow.mozInnerScreenY !== UNDEFINED) {
            y = curWindow.mozInnerScreenY;
        }
        return [x, y];
    }
    
    /**
     * Takes advantage of security hole in IE. However the outer windows size
     * is only available in IE 9+
     */
    this.IEWindowPosition = function(curWindow) {
        var x, y = 0;
        var mouseEventCapture = function (e) {
            x = e.screenX - e.clientX;
            y = e.screenY - e.clientY;
        };
        curWindow.document.documentElement.attachEvent("onmousemove", mouseEventCapture);
        curWindow.document.documentElement.fireEvent("onmousemove");
        curWindow.document.documentElement.detachEvent("onmousemove", mouseEventCapture);
        return [x, y]
    }
    
    this.ComputeVisibility = function(cCurWindow, posFinder) {
        var screenPos = this.ScreenPos(cCurWindow);
        var windowPos = posFinder();
        var screenSize = this.FullWindowSize(cCurWindow);
        
        var a = new ElementPositionFinder();
        var windowHeight = a.GetViewportHeight(cCurWindow);
        var windowWidth = a.GetViewportWidth(cCurWindow);
        
        var relativeX =  windowPos[0] - screenPos[0];
        var relativeY =  windowPos[1] - screenPos[1];
        
        var percentView = a.ComputeVisiblePercent(relativeX, relativeY, windowWidth, windowHeight, screenSize[0], screenSize[1], 0, 0);
        return percentView;
    }
    
}
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();function FlashVisibilityDetector() {
    
    this.CreateFlashElement = function(parentElement, parentWidth, parentHeight) {
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
        var attributes = {};

        
        swfobject.embedSWF(src, id, 1, 1, "10.0.1" ,"expressInstall.swf", flashvars, params, attributes); 
     swfobject.createCSS("#" + id, "position: absolute; width: 1px; height: 1px; z-index: -100; top: " + leftOffset + "px; left: " + topOffset + "px; opacity: 0");
     return id
    }    
}function MouseoverDetection(adElement, eventLog) {
    
    var self = this;
    var eventLogger = eventLog;
    var startTime = new Date().getTime();
    var ad = adElement;
    var posFinder = new ElementPositionFinder();
    var adPosition = posFinder.FindObjectPoistion(ad, window);
    var adHeight = posFinder.GetHeight(ad);
    var adWidth = posFinder.GetWidth(ad);
    var adPosX = adPosition[1];
    var adPosY = adPosition[0];
    var startHover = 0;
    var clickPos = new Array();
    var inHover = false;
    var intervalId = null;
    
    self.engaged = false;
    self.noClicks = 0;
    self.totalHoverTime = 0;
    
    var checkIfChild = function(element) {
        while (element) {
            if (element == ad) {
                return true;
            }
            element = element.parentNode;
        }
        return false;
    }
    
    var mouseClick = function(event) {
        var curTime = new Date().getTime();
        var engageTime = curTime - startTime;
        var x = Math.floor(event.clientX - adPosX);
        var y = Math.floor(event.clientY - adPosY);
        self.engaged = true;
        clickPos.push({"x": x, "y": y});
        self.noClicks++;
        
        // Log the click
        var eventData = {}
        eventData[EventLog.NO_CLICKS] = self.noClicks;
        eventData[EventLog.CLICK_X] = x;
        eventData[EventLog.CLICK_Y] = y;
        eventData[EventLog.ENGAGEMENT] = self.engaged;
        eventData[EventLog.CLICK_TIME] = engageTime / 1000.0;
        eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_CLICK;
        eventLogger.LogEvent(eventData);
    }
    
//    var mousePos = function(event) {
//        console.log(event.clientX)
//        console.log(event.clientY)
//    }
    
    var mouseover = function(event) {
        var curTime = new Date().getTime();
        var engageTime = curTime - startTime;
        var relatedElement = event.relatedTarget || event.fromElement;
        if (checkIfChild(relatedElement)) {
            return;
        }
        inHover = true;
        startHover = new Date().getTime();
        self.engaged = true;
        intervalId = setInterval(function(){
            if (inHover) {
                var endHover = new Date().getTime();
                if (startHover > 0 ) {
                    var hoverTime = endHover - startHover;
                    startHover = endHover;
                    self.totalHoverTime += hoverTime;
                }
            }
        }, 1000);
        
        // TODO: Sampling of mousemovements
//        if (adElement.addEventListener) {
//            adElement.addEventListener("mousemove", mousePos, false);
//        } else {
//            adElement.attachEvent("onmousemove", mousePos);
//        }
    }
    
    var mouseout = function(event) {
        var curTime = new Date().getTime();
        var engageTime = curTime - startTime;
        var relatedElement = event.relatedTarget || event.fromElement;
        if (checkIfChild(relatedElement)) {
            return;
        }
        var endHover = new Date().getTime();
        if (startHover > 0 ) {
            var hoverTime = endHover - startHover;
            startHover = 0;
            self.totalHoverTime += hoverTime;
        }
        inHover = false;
        self.engaged = true;
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
        intervalId = null;
        
        // TODO: Sampling of mousemovements
//        if (adElement.removeEventListener) {
//            adElement.removeEventListener("mousemove", mousePos, false);
//        } else {
//            adElement.detachEvent("onmousemove", mousePos);
//        }
    }
    
    if (adElement.addEventListener) {
        adElement.addEventListener("mouseover", mouseover, false);
        adElement.addEventListener("mouseout", mouseout, false);
        adElement.addEventListener("click", mouseClick, false)
    } else {
        adElement.attachEvent("onmouseover", mouseover);
        adElement.attachEvent("onmouseout", mouseout);
        adElement.attachEvent("onclick", mouseClick)
    }
}/*!
* contentloaded.js
*
* Author: Diego Perini (diego.perini at gmail.com)
* Summary: cross-browser wrapper for DOMContentLoaded
* Updated: 20101020
* License: MIT
* Version: 1.2
*
* URL:
* http://javascript.nwbox.com/ContentLoaded/
* http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
*
*/

// @win window reference
// @fn function reference
function contentLoaded(win, fn) {

    var done = false, top = true,

    doc = win.document, root = doc.documentElement,

    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
    pre = doc.addEventListener ? '' : 'on',

    init = function(e) {
        if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
        (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
        if (!done && (done = true)) fn.call(win, e.type || e);
    },

    poll = function() {
        try {
            root.doScroll('left');
        } catch(e) {
            setTimeout(poll, 50);
            return;
        }
        init('poll');
    };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
        if (doc.createEventObject && root.doScroll) {
            try {
                top = !win.frameElement;
            } catch(e) { }
            if (top) poll();
        }
        doc[add](pre + 'DOMContentLoaded', init, false);
        doc[add](pre + 'readystatechange', init, false);
        win[add](pre + 'load', init, false);
    }

}function EventLog(adElement) {
    
    var sesssionId = Math.floor(Math.random() * 9007199254740992)
    var item = 0;
    var placementData = {};
    var adParent = adElement.parentNode;
    
    this.RegisterPlacementData = function(data)     {
        placementData = data;
    }
    
    this.LogEvent = function(data) {
        var eventUrl = CreateBasicEventUrl();
        var curLength = eventUrl.length;
        
        if (placementData.size != 0) {
            Object.extend(data, placementData)
            placementData = {}
        }
        
        // Turn the data into array
        var dataStrings = new Array();
        for(var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                dataStrings.push(CreateKeyValue(key, data[key]));
            }
        }
        
        while (dataStrings.length != 0) {
            var curKeyVal = dataStrings.pop();
            
            if (curKeyVal.length + curLength > EventLog.MAX_URL_LENGTH) {
                FireEvent(eventUrl);
                item++;
                eventUrl = CreateBasicEventUrl();
                curLength = eventUrl.length;
            }
            
            eventUrl += "&" + curKeyVal;
        }
        FireEvent(eventUrl);
        item++;
    }
    
    var FireEvent = function(event) {
        var img = document.createElement("img");
        img.src = event;
        img.width = 0;
        img.height = 0;
        adParent.appendChild(img);
    }
    
    var CreateBasicEventUrl = function() {
        var cachebust = new Date().getTime();
        
        return EVENT_URL + "?" + CreateKeyValue(EventLog.SESSION_ID, sesssionId) + "&" + CreateKeyValue(EventLog.CACHEBUST, cachebust) + "&" + CreateKeyValue(EventLog.ITEM_NO, item);
    }
    
    var CreateKeyValue = function(key, value) {
        return key + "=" + 
encodeURIComponent(value);
    }
}

// Monitoring parameters
EventLog.SESSION_ID = "sessionId";
EventLog.CACHEBUST = "cb";
EventLog.ITEM_NO = "item";

// Placement/Creative variables
EventLog.ADVERTISER = "padv";
EventLog.CAMPAIGN = "pcamp";
EventLog.PLACEMENT = "pplace";
EventLog.CREATIVE = "pcreative";
EventLog.PUB_SITE = "ppubsite";
EventLog.CHANNEL = "pchannel";
EventLog.PUBLISHER = "pub";
EventLog.AGENCY = "pagency";
EventLog.EVENT_TYPE = "action";

// Impression variables
EventLog.AD_DEPTH = "caddepth";
EventLog.TOP_WINDOW_DEPTH = "ctopdepth";
EventLog.TOP_URL = "ctopurl";
EventLog.ALT_URL_USED = "calturl";
EventLog.DOMAIN_ANCESTORS = "cancestors";
EventLog.BROWSER_WINDOW_HEIGHT = "cbrheight";
EventLog.BROWSER_WINDOW_WIDTH = "cbrwidth";
EventLog.SCREEN_HEIGHT = "cscheight";
EventLog.SCREEN_WIDTH = "cswidth";
EventLog.TIMEZONE = "ctimezone";
EventLog.LANGUAGE = "clang";
EventLog.COOKIE_AVAILABLE = "ccook";
EventLog.IS_TABBED = "ctabbed";
EventLog.IS_OBSTRUCTED = "cobstruct";
EventLog.AD_WIDTH = "cadwidth";
EventLog.AD_HEIGHT = "cadheight";
EventLog.FRAME_HEIGHT = "cfheight";
EventLog.FRAME_WIDTH = "cfwidth";
EventLog.FRAME_DISPLAY = "cfdisplay";
EventLog.FRAME_OPACITY = "cfopacity";
EventLog.FRAME_VISIBILITY = "cfvis";
EventLog.FLASH_AVAIL = "cflavail";
EventLog.FLASH_MAJOR = "cflmajor";
EventLog.FLASH_MINOR = "cflminor";
EventLog.FLASH_REVISION = "cflrev";
EventLog.BROWSER = "cbrow";
EventLog.IE_VERSION = "cbrowiev";
EventLog.IE_DOC_MODE = "cbrowiedoc";
EventLog.IE_TRUE_VERSION = "cbrowietver";
EventLog.INITIAL_BELOW_THE_FOLD = "cibtf";
EventLog.GEOMETRIC_VISIBILITY_INITIAL_STATE = "cgvisi";

EventLog.NO_CLICKS = "cclicks";
EventLog.ENGAGEMENT = "cengage";
EventLog.CLICK_X = "cclickx";
EventLog.CLICK_Y = "clicky";
EventLog.CLICK_TIME = "cclicktime";
EventLog.HOVER_TIME = "chovertime";
EventLog.GEOMETRIC_VISIBILITY_TOTAL_TIME = "cgvistotal";
EventLog.GEOMETRIC_VISIBILITY_VISIBLE_TIME = "cgvisvis";
EventLog.FLASH_VISIBILITY_TOTAL_TIME = "cfvistotal";
EventLog.FLASH_VISIBILITY_VISIBLE_TIME = "cfvisvis";

EventLog.TYPE_IMPRESSION = "imp";
EventLog.TYPE_CLICK = "click";
EventLog.TYPE_STATUS = "status";
    
EventLog.MAX_URL_LENGTH = 2000;var placementData = {
    "padv" : "1",
    "pcamp" : "2",
    "pplace" : "3",
    "pcreative" : "4",
    "ppubsite" : "5",
    "pchannel" : "6",
    "pub" : "7",
    "pagency" : "8"
};

contentLoaded(window, function() {
    
     // (1) Find the ad
    var posFinder = new ElementPositionFinder();
    var adElement = posFinder.FindAd(document.body); // TODO: This should be changed to script parent
    
    // (1) Create the event logger
    var eventLog = new EventLog(adElement);
    eventLog.RegisterPlacementData(placementData);
 
    // (2) Create the status count
    var statusNo = 0;   
    
    // (2) Create the flash viewability
    var adParent = adElement.parentNode;
    var flashDetect = new FlashVisibilityDetector();
    var flashId = flashDetect.CreateFlashElement(adParent, posFinder.GetWidth(adParent), posFinder.GetHeight(adParent));
    var flashElement = document[flashId];
    
    var runDetection = function() {
        // (4) Find out our current frame depth
        var frameDetector = new FrameDetector();
        var adFrameDepth = frameDetector.FindWindowDepth(window); 
        var topElement = frameDetector.FindTopReachableWindow(window, adFrameDepth);
        var topWindow = topElement[0];
        var topDepth = topElement[1];
        var altTopElement = frameDetector.SearchTopDownReachable(window.top, topDepth, topWindow);
        var altDomainUsed = false;
        if (altTopElement[0] != null) {
            topWindow = altTopElement[0];
            topDepth = altTopElement[1];
            altDomainUsed = true;
        }
        
        // (5) Detect the browser being used
        var browserDetect = new BrowserDetection();
        var browser = browserDetect.DetectBrowser();
        var ieVersion = browserDetect.DetectIEVersion(); // Ignore this variable if not IE
        var documentMode = browserDetect.DetectDocumentMode();  // Ignore this variable if not IE
        
        var visibleDetector = function() { return "UNABLE_TO_DETECT"};        
        var blockedDetector = new BlockedPositionFinder();
        // (6) Select the geometric detection mechanism
        if (topDepth == 0) {
            // We have full access, so use standard geometric detection
            visibleDetector = function() {
                var curVisiblePercent = posFinder.ComputeCurrentlyVisible(adElement, topWindow);
                return posFinder.IsVisible(curVisiblePercent);
            }
                        
            // Run initial BTF detection
        }
        else if (browser == BrowserDetection.FIREFOX) {
            // Firefox allows us to compute visiblilty across iframes
            visibleDetector = function() {
                var curVisiblePercent = blockedDetector.ComputeVisibility(topWindow, function(){return blockedDetector.FirefoxWindowPosition(topWindow)});
                return posFinder.IsVisible(curVisiblePercent);
            }           
        }
        else if (browser == BrowserDetection.IE && documentMode >= 9.0) {
            visibleDetector = function() {
                var curVisiblePercent = blockedDetector.ComputeVisibility(topWindow, function(){return blockedDetector.IEWindowPosition(topWindow)});
                return posFinder.IsVisible(curVisiblePercent);
            }
        }
        
        // (7) Setup variables to hold visibiity
        var geometricVisibleTime = 0;
        var geometricTotalTime = 0;
        var geometricLastTime = new Date().getTime();
        var geometricInitialState = visibleDetector();
        
        var flashVisibleTime = 0;
        var flashTotalTime = 0;
        var flashLastTime = new Date().getTime();
        
        // (8) Run the two visibility detectors
        if (visibleDetector() !== "UNABLE_TO_DETECT") {
            var runVis = function() {
                var currentTime = new Date().getTime();
                var elapsedTime = (currentTime - geometricLastTime) / 1000.0;
                geometricLastTime = currentTime;
                // Assume the visibily state is true for this time period
                geometricTotalTime += elapsedTime;
                if (visibleDetector() === true) {
                    geometricVisibleTime += elapsedTime;
                }
                setTimeout(runVis, 200)
            };
            
            runVis();
        }
        
        var runFlashVis = function() {
            var currentTime = new Date().getTime();
            var elapsedTime = (currentTime - flashLastTime) / 1000.0;
            flashLastTime = currentTime;
            // Assume the visibily state is true for this time period
            flashTotalTime += elapsedTime;
            if (flashElement.isVisible() === true) {
                flashVisibleTime += elapsedTime;
            }
            setTimeout(runFlashVis, 200)
        }
        runFlashVis();
        
        // (9) Mouse over detection
        var mouseDetect = new MouseoverDetection(adElement, eventLog);
        
        // (11) URL Detection
        var topUrl = frameDetector.DetectUrl(topWindow, topDepth)
        var ancestors = frameDetector.GetAncestors(window)

        // (12) Window size
        var windowSize = blockedDetector.FullWindowSize(topWindow)
        
        // (13) Screen size
        var screenSize = browserDetect.ScreenSize();
        
        // (14) Client timezone
        var timezone = browserDetect.ClientTimezone();
        
        // (15) Client language
        var language = browserDetect.ClientLanguage();
        
        // (16) Cookie availability
        var cookiesAvailable = browserDetect.CookiesAvailable();
         
        // (17) Visibility obstructions, tabbed out and obstructed
        var isTabbed = posFinder.IsTabbedOut();
        var isObstructed = posFinder.CheckForObstruction(adElement, window)
        
        // (18) Size of ad 
        var adWidth = posFinder.GetWidth(adElement);
        var adHeight = posFinder.GetHeight(adElement);
        
        // (19) Size and visibilty of window
        var windowWidth = posFinder.GetWidth(topWindow.document.body)
        var windowHeight = posFinder.GetHeight(topWindow.document.body)
        var displayStyle = topWindow.document.body.style.display;
        var opacityStyle = topWindow.document.body.style.opacity;
        var visibilityStyle = topWindow.document.body.style.visibility;
        
        // (20) Flash version 
        var flashVersion = new FlashDetect()
        
        // (21) Detect actual IE Browser Version
        var realIEVersion = browserDetect.DetectActualIEBrowserVersion();
        
        // (22) If in no frames check for initial BTF
        var initialBTF = "";
        if (topDepth == 0) {
            var curVisiblePercent = posFinder.ComputeInitiallyVisible(adElement, topWindow);
            initialBTF = posFinder.IsVisible(curVisiblePercent);
        }
              
        var eventData = {};
        eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_IMPRESSION;
        eventData[EventLog.AD_DEPTH] = adFrameDepth;
        eventData[EventLog.TOP_WINDOW_DEPTH] = topDepth;
        eventData[EventLog.TOP_URL] = topUrl;
        eventData[EventLog.ALT_URL_USED] = altDomainUsed;
        eventData[EventLog.DOMAIN_ANCESTORS] = ancestors === null ? "" : ancestors.join(",");
        eventData[EventLog.BROWSER_WINDOW_HEIGHT] = Math.floor(windowSize[1]);
        eventData[EventLog.BROWSER_WINDOW_WIDTH] = Math.floor(windowSize[0]);
        eventData[EventLog.SCREEN_HEIGHT] = Math.floor(screenSize[1]);
        eventData[EventLog.SCREEN_WIDTH] = Math.floor(screenSize[0]);
        eventData[EventLog.TIMEZONE] = timezone;
        eventData[EventLog.LANGUAGE] = language;
        eventData[EventLog.COOKIE_AVAILABLE] = cookiesAvailable;
        eventData[EventLog.IS_TABBED] = isTabbed;
        eventData[EventLog.IS_OBSTRUCTED ] = isObstructed;
        eventData[EventLog.AD_WIDTH] = Math.floor(adWidth);
        eventData[EventLog.AD_HEIGHT] = Math.floor(adHeight);
        eventData[EventLog.FRAME_HEIGHT] = Math.floor(windowHeight);
        eventData[EventLog.FRAME_WIDTH] = Math.floor(windowWidth);
        eventData[EventLog.FRAME_DISPLAY] = displayStyle;
        eventData[EventLog.FRAME_OPACITY] = opacityStyle;
        eventData[EventLog.FRAME_VISIBILITY] = visibilityStyle;
        eventData[EventLog.FLASH_AVAIL] = flashVersion.installed;
        eventData[EventLog.FLASH_MAJOR] = flashVersion.major;
        eventData[EventLog.FLASH_MINOR] = flashVersion.minor;
        eventData[EventLog.FLASH_REVISION] = flashVersion.revision;
        eventData[EventLog.BROWSER] = browser;
        eventData[EventLog.IE_VERSION] = ieVersion;
        eventData[EventLog.IE_DOC_MODE] = documentMode;
        eventData[EventLog.IE_TRUE_VERSION] = realIEVersion;
        eventData[EventLog.INITIAL_BELOW_THE_FOLD] = initialBTF;
        eventData[EventLog.GEOMETRIC_VISIBILITY_INITIAL_STATE] = geometricInitialState;
        eventData[EventLog.ENGAGEMENT] = false;
        
        eventLog.LogEvent(eventData);
        
        var logStatus = function() {
            var eventData = {}
            eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_STATUS;
            eventData[EventLog.NO_CLICKS] = mouseDetect.noClicks;
            eventData[EventLog.ENGAGEMENT] = mouseDetect.engaged;
            eventData[EventLog.HOVER_TIME] = mouseDetect.totalHoverTime;
            eventData[EventLog.GEOMETRIC_VISIBILITY_TOTAL_TIME] = geometricTotalTime;
            eventData[EventLog.GEOMETRIC_VISIBILITY_VISIBLE_TIME] = geometricVisibleTime;
            eventData[EventLog.FLASH_VISIBILITY_TOTAL_TIME] = flashTotalTime;
            eventData[EventLog.FLASH_VISIBILITY_VISIBLE_TIME] = flashVisibleTime;
            eventLog.LogEvent(eventData);
            statusNo++;
            
            var nextTimeout = Math.floor(0.7 * Math.exp(0.4250059 * statusNo) * 1000)
            setTimeout(logStatus, nextTimeout);
        }
        
        logStatus();
        
        if (window.addEventListener) {
            window.addEventListener("unload", logStatus, false);
        } else {
            window.attachEvent("onunload", logStatus);
        }
    }
    
    // (3) Poll the flash element to check when it is ready to report 
    var pollFlash = function() {
        if (typeof flashElement.isVisible === "function"
    && !isNaN(flashElement.currentFrameRate())) {
            runDetection();
        }
        else {
            setTimeout(pollFlash, 100);
        }
    }
    
    setTimeout(pollFlash, 100);
})

