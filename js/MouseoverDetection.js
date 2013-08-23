function MouseoverDetection(adElement, eventLog) {
    
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
        
        console.log("here");
        
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
    
    //adElement = adElement.parentNode.parentNode;
    console.log(adElement);
    if (adElement.addEventListener) {
        adElement.addEventListener("mouseover", mouseover, false);
        adElement.addEventListener("mouseout", mouseout, false);
        adElement.addEventListener("click", mouseClick, false);
    } else {
        adElement.attachEvent("onmouseover", mouseover);
        adElement.attachEvent("onmouseout", mouseout);
        adElement.attachEvent("onclick", mouseClick);
    }
}