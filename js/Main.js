contentLoaded(window, function() {
    console.log("here");
    // (1) Find the ad
    var posFinder = new ElementPositionFinder();
    var adElement = posFinder.FindAd(document.body); // This should be changed to script parent
    
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
        console.log("here");
        var topWindow = topElement[0];
        var topDepth = topElement[1];
        var altTopElement = frameDetector.SearchTopDownReachable(window.top, topDepth);
        if (altTopElement[0] != null) {
            topWindow = altTopElement[0];
            topDepth = altTopElement[1];
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
                //console.log(curVisiblePercent);
                return posFinder.IsVisible(curVisiblePercent);
            }           
        }
        else if (browser == BrowserDetection.IE && documentMode >= 9.0) {
            visibleDetector = function() {
                var curVisiblePercent = blockedDetector.ComputeVisibility(topWindow, function(){return blockedDetector.IEWindowPosition(topWindow)});
                return posFinder.IsVisible(curVisiblePercent);
            }
        }
        
        console.log(visibleDetector())
        
        // (7) Setup variables to hold visibiity
        var visibleTime = 0;
        var totalTime = 0;
        var lastTime = new Date().getTime();
        
        if (visibleDetector() !== "UNABLE_TO_DETECT") {
            var runVis = function() {
                var currentTime = new Date().getTime();
                var elapsedTime = currentTime - lastTime;
                lastTime = currentTime;
                // Assume the visibily state is true for this time period
                totalTime += elapsedTime;
                if (visibleDetector() === true) {
                    visibleTime += elapsedTime;
                }
                console.log(visibleTime);
                setTimeout(runVis, 100)
            };
            
            runVis();
        }
//        
//        
//        
//        console.log(flashElement.currentFrameRate())
    }
    
    // (3) Poll the flash element to check when it is ready to report 
    var pollFlash = function() {
        if (typeof flashElement.isVisible === "function"
    && !isNaN(flashElement.currentFrameRate())) {
    console.log("HIIs")
            runDetection()
        }
        else {
            setTimeout(pollFlash, 50);
        }
    }
    
    setTimeout(pollFlash, 50);
})

