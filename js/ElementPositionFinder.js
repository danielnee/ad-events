function ElementPositionFinder() {
    
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
     * Find our script, provide the script element and src back
     */
    this.FindScript = function() {
      var scriptElements = document.getElementsByTagName("script");  
      for (var i = 0; i < scriptElements.length; i++) {
          var src = scriptElements[i].src
          if (src.indexOf(SCRIPT_URL) >= 0) {
              return [scriptElements[i], src]
          }
      }
      return null;
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

ElementPositionFinder.VISIBILITY_MINIMUM = 0.5;