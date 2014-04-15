#!/bin/bash

# Combines all JavaScript sources into a single file and runs minify

cat ../js/ScopeStart.js ../js/Common.js ../js/FlashDetect.js ../js/BrowserDetection.js ../js/FrameDetector.js ../js/ElementPositionFinder.js ../js/BlockedPositionFinder.js ../js/swfobject.js ../js/FlashVisibilityDetector.js ../js/MouseoverDetection.js ../js/ContentLoaded.js ../js/EventLog.js ../js/Main.js ../js/ScopeEnd.js > ../js/adamity.js
python minifyjs.py ../js/adamity.js > temp
mv temp ../js/adamity.js