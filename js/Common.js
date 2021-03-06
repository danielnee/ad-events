var UNDEFINED = "undefined";
var SCRIPT_URL = "cdn.adamity.com/adamity.js"
var EVENT_URL = "//event.adamity.com/event";
var IMPRESSION_URL = "//event.adamity.com/impression"
var SWF_URL = "//cdn.adamity.com/a.swf"
var GEO_VISIBILITY_NO_DETECTION = "UNABLE_TO_DETECT"

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

function getClass(obj) {
  if (typeof obj === "undefined")
    return "undefined";
  if (obj === null)
    return "null";
  return Object.prototype.toString.call(obj)
    .match(/^\[object\s(.*)\]$/)[1];
}