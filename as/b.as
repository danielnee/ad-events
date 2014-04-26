package {

import flash.display.*;
import flash.events.*;
import flash.external.*;
import flash.system.*;
import flash.utils.*;

public class b extends MovieClip {

    public const IN_VIEW : String = "IN VIEW";
    public const HIDDEN : String = "HIDDEN";
    public const HIDDEN_MILLISECONDS : Number = 400;

    public var prevTimer : Number;
    public var visibilityState : String;

    public function b() {
        addFrameScript(0, initFrame); 
    }

    public function checkFrameRate(event : Event) : void {
        var curTimer : Number = getTimer();
        var curDiff : Number = curTimer - prevTimer;

        visibilityState = curDiff > HIDDEN_MILLISECONDS ? HIDDEN : IN_VIEW
        prevTimer = curTimer; 
    }

    public function isInView() : Boolean {
         return (visibilityState === IN_VIEW); 
    }

    public function registerExternalCallbacks(event : Event) : void {
        removeEventListener(Event.ENTER_FRAME, registerExternalCallbacks);  

        if (ExternalInterface.available) {
             ExternalInterface.addCallback("abpi", isInView); 
        };
    }

    function initFrame() : void {
        Security.allowDomain("*");
        Security.allowInsecureDomain("*");

        this.addEventListener(Event.ENTER_FRAME, checkFrameRate); 
        prevTimer = 0; 
        addEventListener(Event.ENTER_FRAME, registerExternalCallbacks);
    }

}
}
