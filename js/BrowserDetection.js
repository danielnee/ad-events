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
        return [screen.availHeight, screen.availWidth];
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
BrowserDetection.IE_VERSION_UNKNOWN = "Unknown";