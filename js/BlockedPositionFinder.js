function BlockedPositionFinder() {
    
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
