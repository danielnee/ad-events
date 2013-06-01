function FrameDetector() {
    
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
        else {
            // Cycle through ancestors until we are blocked
        }
       
    }
    
    /**
     * Performs a breadth first search on all frames to see if we can
     * find one where we have access that is higher than current highest most reachable
     * @param window cTopWindow The top most window
     * @param int iCurDepth Depth of window highest reachable window
     */
    this.SearchTopDownReachable = function(cTopWindow, iCurWindowDepth) {
        if (iCurWindowDepth == 0) {
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
    
    this.TopWindowTest = function(cCurWindow) {
        var topElement = "Unknown";
        var ffBug = "Unknown";
        try {
            topElement = cCurWindow.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.location.href;
        } catch (cException) {
            var message = cException.message;
            var domain = message.substring(message.lastIndexOf("<") + 1, message.lastIndexOf(">"));
            if (typeof domain != UNDEFINED && this.CheckFirefoxVersionForBug()) {
                ffBug = domain;
            }
        }
        return [topElement, ffBug];
    }
    
    this.CheckFirefoxVersionForBug = function() {
        var bugMajorVersion = 3;
        var bugMinorVersion = 6;
        var bugRevision = 13;
        var isBuggedVersion = false;
        
        if (typeof window.navigator !== UNDEFINED && typeof window.navigator.userAgent !== UNDEFINED) {
            
            //var userAgent = window.navigator.userAgent;
            var firefoxVersionNumber = window.navigator.userAgent.match(/Firefox\/([\.0-9]+)/);
            if (firefoxVersionNumber !== null && firefoxVersionNumber.length == 2) {
                firefoxVersionNumber = firefoxVersionNumber[1].split(".");
                var majorVersion = parseInt(firefoxVersionNumber[0]);
                if (majorVersion == bugMajorVersion) {
                    var minorVersion = parseInt(firefoxVersionNumber[1]);
                    if (minorVersion < bugMinorVersion) {
                        isBuggedVersion = true;
                    }
                    else if (minorVersion == bugMinorVersion) {
                        if (firefoxVersionNumber.length == 3) {
                            var revisionNumber = parseInt(firefoxVersionNumber[2]);
                            if (revisionNumber <= bugRevision) {
                                isBuggedVersion = true;
                            }
                        } else {
                            isBuggedVersion = true;
                        }
                    }
                }
            }
        }
        return isBuggedVersion;
    }
}


// Advertiser
// Campaign
// Placement
// Creative
// Site
// Channel
// Publisher/Ad Network
// Agency

// Cachebust or version
// Callback


