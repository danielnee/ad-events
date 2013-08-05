function EventLog(adElement) {
    
    var sesssionId = Math.floor(Math.random() * 9007199254740992)
    var item = 0;
    var placementData = {};
    var adParent = adElement.parentNode;
    
    this.RegisterPlacementData = function(data)     {
        placementData = data;
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
    
    var CreateKeyValue = function(key, value) {
        return key + "=" + 
encodeURIComponent(value);
    }
}

// Monitoring parameters
EventLog.SESSION_ID = "sessionId";
EventLog.CACHEBUST = "cb";
EventLog.ITEM_NO = "item";

// Placement/Creative variables
EventLog.ADVERTISER = "padv";
EventLog.CAMPAIGN = "pcamp";
EventLog.PLACEMENT = "pplace";
EventLog.CREATIVE = "pcreative";
EventLog.PUB_SITE = "ppubsite";
EventLog.CHANNEL = "pchannel";
EventLog.PUBLISHER = "pub";
EventLog.AGENCY = "pagency";
EventLog.EVENT_TYPE = "action";

// Impression variables
EventLog.AD_DEPTH = "caddepth";
EventLog.TOP_WINDOW_DEPTH = "ctopdepth";
EventLog.TOP_URL = "ctopurl";
EventLog.ALT_URL_USED = "calturl";
EventLog.DOMAIN_ANCESTORS = "cancestors";
EventLog.BROWSER_WINDOW_HEIGHT = "cbrheight";
EventLog.BROWSER_WINDOW_WIDTH = "cbrwidth";
EventLog.SCREEN_HEIGHT = "cscheight";
EventLog.SCREEN_WIDTH = "cswidth";
EventLog.TIMEZONE = "ctimezone";
EventLog.LANGUAGE = "clang";
EventLog.COOKIE_AVAILABLE = "ccook";
EventLog.IS_TABBED = "ctabbed";
EventLog.IS_OBSTRUCTED = "cobstruct";
EventLog.AD_WIDTH = "cadwidth";
EventLog.AD_HEIGHT = "cadheight";
EventLog.FRAME_HEIGHT = "cfheight";
EventLog.FRAME_WIDTH = "cfwidth";
EventLog.FRAME_DISPLAY = "cfdisplay";
EventLog.FRAME_OPACITY = "cfopacity";
EventLog.FRAME_VISIBILITY = "cfvis";
EventLog.FLASH_AVAIL = "cflavail";
EventLog.FLASH_MAJOR = "cflmajor";
EventLog.FLASH_MINOR = "cflminor";
EventLog.FLASH_REVISION = "cflrev";
EventLog.BROWSER = "cbrow";
EventLog.IE_VERSION = "cbrowiev";
EventLog.IE_DOC_MODE = "cbrowiedoc";
EventLog.IE_TRUE_VERSION = "cbrowietver";
EventLog.INITIAL_BELOW_THE_FOLD = "cibtf";
EventLog.GEOMETRIC_VISIBILITY_INITIAL_STATE = "cgvisi";

EventLog.NO_CLICKS = "cclicks";
EventLog.ENGAGEMENT = "cengage";
EventLog.CLICK_X = "cclickx";
EventLog.CLICK_Y = "clicky";
EventLog.CLICK_TIME = "cclicktime";
EventLog.HOVER_TIME = "chovertime";
EventLog.GEOMETRIC_VISIBILITY_TOTAL_TIME = "cgvistotal";
EventLog.GEOMETRIC_VISIBILITY_VISIBLE_TIME = "cgvisvis";
EventLog.FLASH_VISIBILITY_TOTAL_TIME = "cfvistotal";
EventLog.FLASH_VISIBILITY_VISIBLE_TIME = "cfvisvis";

EventLog.TYPE_IMPRESSION = "imp";
EventLog.TYPE_CLICK = "click";
EventLog.TYPE_STATUS = "status";
    
EventLog.MAX_URL_LENGTH = 2000;