function EventLog(adElement) {
    
    var sesssionId = Math.floor(Math.random() * 9007199254740992)
    var item = 0;
    var placementData = {};
    var adParent = adElement.parentNode;
    
    this.RegisterPlacementData = function(data)     {
        placementData = data;
    }
    
    this.LogImpression = function(placementData) {
        var impressionUrl = CreateBasicImpressionUrl(); 
        
        // Turn the data into array
        var dataStrings = new Array();
        for(var key in placementData)
        {
            if (placementData.hasOwnProperty(key))
            {
                dataStrings.push(CreateKeyValue(key, placementData[key]));
            }
        }
        
        while (dataStrings.length != 0) {
            var curKeyVal = dataStrings.pop();      
            impressionUrl += "&" + curKeyVal;
        }
        FireEvent(impressionUrl);
    }
    
    this.LogEvent = function(data) {
        var eventUrl = CreateBasicEventUrl();
        var curLength = eventUrl.length;
        
        if (placementData.size != 0) {
            Object.extend(data, placementData)
            placementData = {}
        }
        
        // Turn the data into array
        var dataStrings = new Array();
        for(var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                dataStrings.push(CreateKeyValue(key, data[key]));
            }
        }
        
        while (dataStrings.length != 0) {
            var curKeyVal = dataStrings.pop();
            
            if (curKeyVal.length + curLength > EventLog.MAX_URL_LENGTH) {
                FireEvent(eventUrl);
                item++;
                eventUrl = CreateBasicEventUrl();
                curLength = eventUrl.length;
            }
            
            eventUrl += "&" + curKeyVal;
        }
        FireEvent(eventUrl);
        item++;
    }
    
    this.ParsePlacementArgumentsFromUrl = function(url) {
        var queryStringPos = url.indexOf("?")
        if (queryStringPos == -1)
            return {};
        
        var queryString = url.substring(queryStringPos + 1)
        var queryStringSplit = queryString.split("&")
        var queryParams = {};
        for (var i = 0; i < queryStringSplit.length; i++) {
            var keyVal = queryStringSplit[i].split("=")
            var key = decodeURIComponent(keyVal[0]);
            var val = "";
            if (keyVal.length > 1)
                val = decodeURIComponent(keyVal[1]);
            
            queryParams[key] = val;
        }
        
        // Construct the placement parameters
        var placementData = {};
        if (queryParams.hasOwnProperty(EventLog.PLACEMENT)) placementData[EventLog.PLACEMENT] = queryParams[EventLog.PLACEMENT];
        if (queryParams.hasOwnProperty(EventLog.CREATIVE)) placementData[EventLog.CREATIVE] = queryParams[EventLog.CREATIVE];

        return placementData;
    }
    
    var FireEvent = function(event) {
        var img = document.createElement("img");
        img.src = event;
        img.width = 0;
        img.height = 0;
        adParent.appendChild(img);
    }
    
    var CreateBasicEventUrl = function() {
        var cachebust = new Date().getTime();
        
        return EVENT_URL + "?" + CreateKeyValue(EventLog.SESSION_ID, sesssionId) + "&" + CreateKeyValue(EventLog.CACHEBUST, cachebust) + "&" + CreateKeyValue(EventLog.ITEM_NO, item);
    }
    
    var CreateBasicImpressionUrl = function() {
        var cachebust = new Date().getTime();
        
        return IMPRESSION_URL + "?" + CreateKeyValue(EventLog.SESSION_ID, sesssionId) + "&" + CreateKeyValue(EventLog.CACHEBUST, cachebust);
    }
    
    var CreateKeyValue = function(key, value) {
        return key + "=" + encodeURIComponent(value);
    }
}

// Monitoring parameters
EventLog.SESSION_ID = "sessionId";
EventLog.CACHEBUST = "cb";
EventLog.ITEM_NO = "item";

// Placement/Creative variables
EventLog.PLACEMENT = "placement";
EventLog.CREATIVE = "creative";
EventLog.EVENT_TYPE = "action";

// Impression variables
EventLog.AD_DEPTH = "addepth";
EventLog.TOP_WINDOW_DEPTH = "topdepth";
EventLog.TOP_URL = "topurl";
EventLog.ALT_URL_USED = "alturl";
EventLog.DOMAIN_ANCESTORS = "ancestors";
EventLog.BROWSER_WINDOW_HEIGHT = "brheight";
EventLog.BROWSER_WINDOW_WIDTH = "brwidth";
EventLog.SCREEN_HEIGHT = "scheight";
EventLog.SCREEN_WIDTH = "swidth";
EventLog.TIMEZONE = "timezone";
EventLog.LANGUAGE = "lang";
EventLog.COOKIE_AVAILABLE = "cook";
EventLog.IS_TABBED = "tabbed";
EventLog.IS_OBSTRUCTED = "obstruct";
EventLog.AD_WIDTH = "adwidth";
EventLog.AD_HEIGHT = "adheight";
EventLog.FRAME_HEIGHT = "fheight";
EventLog.FRAME_WIDTH = "fwidth";
EventLog.FRAME_DISPLAY = "fdisplay";
EventLog.FRAME_OPACITY = "fopacity";
EventLog.FRAME_VISIBILITY = "fvis";
EventLog.FLASH_AVAIL = "flavail";
EventLog.FLASH_MAJOR = "flmajor";
EventLog.FLASH_MINOR = "flminor";
EventLog.FLASH_REVISION = "flrev";
EventLog.BROWSER = "brow";
EventLog.IE_VERSION = "browiev";
EventLog.IE_DOC_MODE = "browiedoc";
EventLog.IE_TRUE_VERSION = "browietver";
EventLog.INITIAL_BELOW_THE_FOLD = "ibtf";
EventLog.GEOMETRIC_VISIBILITY_INITIAL_STATE = "gvisi";

EventLog.NO_CLICKS = "clicks";
EventLog.ENGAGEMENT = "engage";
EventLog.CLICK_X = "clickx";
EventLog.CLICK_Y = "clicky";
EventLog.CLICK_TIME = "clicktime";
EventLog.HOVER_TIME = "hovertime";
EventLog.GEOMETRIC_VISIBILITY_TOTAL_TIME = "gvistotal";
EventLog.GEOMETRIC_VISIBILITY_VISIBLE_TIME = "gvisvis";
EventLog.FLASH_VISIBILITY_TOTAL_TIME = "fvistotal";
EventLog.FLASH_VISIBILITY_VISIBLE_TIME = "fvisvis";

EventLog.LAST_EVENT = "last";
EventLog.ERROR = "error";

EventLog.TYPE_IMPRESSION = "imp";
EventLog.TYPE_CLICK = "click";
EventLog.TYPE_STATUS = "status";
EventLog.TYPE_ERROR_MAIN = "errorMain";
EventLog.TYPE_ERROR_INITIAL = "errorInitial";
    
EventLog.MAX_URL_LENGTH = 2000;