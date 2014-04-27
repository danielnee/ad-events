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
        
        // Standard check for Firefox, IE, Safari
        if (ancestors === null) {
             try {
                var cTopWindow = cCurWindow.top;
                while (cCurWindow != cTopWindow) {
                    cCurWindow.parent.location.href; // Access test
                    var loc = cCurWindow.parent.location.href; // Access test
                    if (typeof loc == UNDEFINED) {
                        throw new Exception("Access exception")
                    }
                    
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
                var loc = cWindow.location.href; // Access test
                if (typeof loc == UNDEFINED) {
                    throw new Exception("Access exception")
                }
                    
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
        
        if (getClass(ancestors) == "DOMStringList") {
            // Convert to standard array
            var arrayAncestors = new Array();
            for (var i = 0; i < ancestors.length; i++) {
                arrayAncestors[i] = ancestors.item(i).toString()
            }
            ancestors = arrayAncestors;
        }
        
        if (ancestors === undefined) {
            ancestors = null;
        }
        return ancestors;
    }
}