var UNDEFINED = "undefined";
var EVENT_URL = "//event.adamity.com/event.gif";
var SWF_URL = "//cdn.adamity.com/FrameRateDetector.swf"

Object.extend = function(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};