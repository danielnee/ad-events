ready(function() {
    
    try {
        // (1) Find the ad
        var posFinder = new ElementPositionFinder();
        var script = posFinder.FindScript()
                
        // If our scrupt is not find, default to document body
        if (script == null) {
            script = [document.body, ""];
        }

        var scriptParent = script[0].parentNode;
        var adElement = posFinder.FindAd(scriptParent);
        if (adElement == null) {
            adElement = scriptParent
        }

        // (1) Create the event logger
        var eventLog = new EventLog(adElement);
        // Parse the placement data from the script source
        var placementData = eventLog.ParsePlacementArgumentsFromUrl(script[1]) 
        eventLog.RegisterPlacementData(placementData);

        // Log the proper impression 
        eventLog.LogImpression(placementData);

        // Log the first status message
        var flashVersion = new FlashDetect();
        var eventData = {};
        eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_IMPRESSION;
        eventData[EventLog.FLASH_AVAIL] = flashVersion.installed;
        // Fire the impression event
        eventLog.LogEvent(eventData);
    }
    catch (e) {
        // Handle errors that occur in initial setup
        if (typeof eventLog == UNDEFINED) {
            var eventLog = new EventLog(window.document.body.firstChild);
        }
        
        var eventData = {};
        eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_ERROR_INITIAL;
        eventData[EventLog.ERROR] = e.message;
        eventLog.LogEvent(eventData);
        return;
    }
 
    try {
        // (2) Create the status count
        var statusNo = 0;   

        // (2) Create the flash viewability
        var adParent = adElement
        if (adElement.parentNode != UNDEFINED) {
            adParent = adElement.parentNode;
        }
        var flashDetect = new FlashVisibilityDetector();
        
        var flashElement = null;
        var pollCount = 0;
        
        // (3) Poll the flash element to check when it is ready to report 
        var pollFlash = function() {
            
            if (pollCount >= 50 ) {
                var eventData = {};
                eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_ERROR_MAIN;
                eventData[EventLog.ERROR] = "Reached polling limit";
                eventLog.LogEvent(eventData);
                return;
            }
            else if (flashVersion.installed == "false" || (typeof flashElement.addi === "function"
        && !isNaN(flashElement.addc()))) {
                runDetection();
            }
            else {
                pollCount++;
                setTimeout(pollFlash, 100);
            }
        }
        
        var embedHandler = function (e) {  
            flashElement = e.ref;
            
            // Handle case when we are in no iframes. Here we will likely trust the
            // geometric result
            if (adFrameDepth == 0 && (adParent.style.position != "static" || adParent.style.position != "")) {
                var eventData = {};
                eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_STATUS;
                eventData[EventLog.FLASH_DETECT_NOT_TRUSTED] = "true";
                eventLog.LogEvent(eventData);
            }
            else {
                setTimeout(function() {
                    flashElement.style.position = "absolute";
                    
                    if (addHidden) {
                        flashElement.style.visibility = "hidden";
                    }   
                }, 200);
                
                flashElement.style.top = topOffset + "px";
                flashElement.style.left = leftOffset + "px";
            }
                     
            flashElement.style.width = "1px";
            flashElement.style.height = "1px";
            flashElement.style["z-index"] = "-100";
            flashElement.style.opacity = "0";
            flashElement.style.filter = "alpha(opacity=0)";
                    
                     
            setTimeout(pollFlash, 100);
          };
          
        // (5) Detect the browser being used
        var browserDetect = new BrowserDetection();
        var browser = browserDetect.DetectBrowser();
        var ieVersion = browserDetect.DetectIEVersion(); // Ignore this variable if not IE
        var documentMode = browserDetect.DetectDocumentMode();  // Ignore this variable if not IE  
        
        var frameDetector = new FrameDetector();
        var adFrameDepth = frameDetector.FindWindowDepth(window);  
        
        var leftOffset = Math.floor(posFinder.GetWidth(adElement) / 2);
        var topOffset = Math.floor(posFinder.GetHeight(adElement) / 2);
        
        // IE, we can't set the object to invisible and opactity doesn't work
        // Best workaround is to move to top left of ad.
        // We lose the 50% detection however
        if (browser == BrowserDetection.IE || browser == BrowserDetection.FIREFOX) {
            leftOffset = 0;
            topOffset = 0;
        }
               
        var addHidden = false;
        if (browser != BrowserDetection.FIREFOX && browser != BrowserDetection.IE) {
            addHidden = true;
        }
          
        var flashId = flashDetect.CreateFlashElement(adParent, posFinder.GetWidth(adElement), posFinder.GetHeight(adElement), embedHandler, browser, ieVersion, documentMode );

        var runDetection = function() {
            // (4) Find out our current frame depth           
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

            var visibleDetector = function() { return GEO_VISIBILITY_NO_DETECTION};        
            var blockedDetector = new BlockedPositionFinder();
            // (6) Select the geometric detection mechanism
            if (topDepth == 0) {
                // We have full access, so use standard geometric detection
                visibleDetector = function() {
                    var curVisiblePercent = posFinder.ComputeCurrentlyVisible(adElement, topWindow);
                    return posFinder.IsVisible(curVisiblePercent);
                }
            }
            else if (browser == BrowserDetection.FIREFOX) {
                // Firefox allows us to compute visiblilty across iframes
                visibleDetector = function() {
                    // This appears to cause an error in firebug log by accessing screenX too 
                    // quickly. Nothing that we can do about it 

                    var curVisiblePercent = blockedDetector.ComputeVisibility(topWindow, function(){return blockedDetector.FirefoxWindowPosition(topWindow)});
                    return posFinder.IsVisible(curVisiblePercent);
                }           
            }
            else if (browser == BrowserDetection.IE && documentMode >= 9.0 && documentMode <= 10.0) {
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
            if (visibleDetector() !== GEO_VISIBILITY_NO_DETECTION) {
                var runVis = function() {
                    var currentTime = new Date().getTime();
                    var elapsedTime = (currentTime - geometricLastTime) / 1000.0;
                    geometricLastTime = currentTime;
                    // Assume the visibily state is true for this time period
                    geometricTotalTime += elapsedTime;
                    if (visibleDetector() === true) {
                        geometricVisibleTime += elapsedTime;
                    }
                    setTimeout(runVis, 100)
                };

                runVis();
            }

            if (flashVersion.installed != "false") {
                var runFlashVis = function() {
                    var currentTime = new Date().getTime();
                    var elapsedTime = (currentTime - flashLastTime) / 1000.0;
                    flashLastTime = currentTime;
                    // Assume the visibily state is true for this time period
                    flashTotalTime += elapsedTime;
                    console.log(flashElement.addi())
                    if (flashElement.addi() === true && !posFinder.IsTabbedOut()) {
                        flashVisibleTime += elapsedTime;
                    }
                    setTimeout(runFlashVis, 100)
                }
                runFlashVis();
            }
            

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

            // (21) Detect actual IE Browser Version
            var realIEVersion = browserDetect.DetectActualIEBrowserVersion();

            // (22) If in no frames check for initial BTF
            var initialBTF = "";
            if (topDepth == 0) {
                var curVisiblePercent = posFinder.ComputeInitiallyVisible(adElement, topWindow);
                initialBTF = posFinder.IsVisible(curVisiblePercent);
            }

            var eventData = {};
            eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_STATUS;
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

            var logStatus = function(last) {
                if (typeof last == UNDEFINED) {
                    last = "false";
                }

                var eventData = {};
                eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_STATUS;
                eventData[EventLog.NO_CLICKS] = mouseDetect.noClicks;
                eventData[EventLog.ENGAGEMENT] = mouseDetect.engaged;
                eventData[EventLog.HOVER_TIME] = mouseDetect.totalHoverTime;
                eventData[EventLog.GEOMETRIC_VISIBILITY_TOTAL_TIME] = geometricTotalTime;
                eventData[EventLog.GEOMETRIC_VISIBILITY_VISIBLE_TIME] = geometricVisibleTime;
                eventData[EventLog.FLASH_VISIBILITY_TOTAL_TIME] = flashTotalTime;
                eventData[EventLog.FLASH_VISIBILITY_VISIBLE_TIME] = flashVisibleTime;
                eventData[EventLog.LAST_EVENT] = last;
                eventLog.LogEvent(eventData);
                statusNo++;

                var nextTimeout = Math.floor(0.7 * Math.exp(0.4250059 * statusNo) * 1000)
                setTimeout(logStatus, nextTimeout);
            }

            logStatus();

            if (window.addEventListener) {
                window.addEventListener("unload", function() { logStatus("true"); }, false);
            } else {
                window.attachEvent("onunload", function() { logStatus("true"); });
            }
        }    
    }
    catch (e) {
        // Handle errors that occur in the main detection code
        var eventData = {};
        eventData[EventLog.EVENT_TYPE] = EventLog.TYPE_ERROR_MAIN;
        eventData[EventLog.ERROR] = e.message;
        eventLog.LogEvent(eventData);
        return;
   }
});

