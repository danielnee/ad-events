function MouseoverDetection(adElement) {
    console.log(adElement);
    var startTime = new Date().getTime();
    var ad = adElement;
    var posFinder = new ElementPositionFinder();
    var adPosition = posFinder.FindObjectPoistion(ad, window);
    var adHeight = posFinder.GetHeight(ad);
    var adWidth = posFinder.GetWidth(ad);
    var adPosX = adPosition[1];
    var adPosY = adPosition[0];
    var engaged = false;
    var totalHoverTime = 0;
    var startHover = 0;
    
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
        var x = event.clientX - adPosX;
        var y = event.clientY - adPosY;
        engaged = true;
        console.log(x);
        console.log(y);
        console.log(engageTime);
    }
    
    var mousePos = function(event) {
        console.log(event.clientX)
        console.log(event.clientY)
    }
    
    var mouseover = function(event) {
        var curTime = new Date().getTime();
        var engageTime = curTime - startTime;
        var relatedElement = event.relatedTarget || event.fromElement;
        if (checkIfChild(relatedElement)) {
            return;
        }
        startHover = new Date().getTime();
        engaged = true;
        
        if (adElement.addEventListener) {
            adElement.addEventListener("mousemove", mousePos, false);
        } else {
            adElement.attachEvent("onmousemove", mousePos);
        }
    }
    
    var mouseout = function(event) {
        var curTime = new Date().getTime();
        var engageTime = curTime - startTime;
        var relatedElement = event.relatedTarget || event.fromElement;
        if (checkIfChild(relatedElement)) {
            return;
        }
        endHover = new Date().getTime();
        if (startHover > 0 ) {
            var hoverTime = endHover - startHover;
            startHover = 0;
            totalHoverTime += hoverTime;
            console.log(hoverTime);
            console.log(totalHoverTime);
            
        }
        engaged = true;
        
        if (adElement.removeEventListener) {
            adElement.removeEventListener("mousemove", mousePos, false);
        } else {
            adElement.detachEvent("onmousemove", mousePos);
        }
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
}