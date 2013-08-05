var placementData = {
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

