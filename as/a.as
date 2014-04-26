package {

    import flash.display.Sprite;
    import flash.system.System;
    import flash.external.ExternalInterface;
    import flash.utils.getTimer; 
    import flash.events.Event;
    import flash.system.Security;

    [SWF( frameRate="30", width="1", height="1" )]
    public class a extends Sprite {
      
        private var frames : int;

        private var prevTimer : Number;

        private var curTimer : Number;

        private var fps : Number;

        private var millisecondsInView : Number;

        private var totalMilliseconds : Number;

        private static const INVIS_FRAME_RATE : Number = 14.0; 

        public function a() {
            super();
            Security.allowDomain("*");
            Security.allowInsecureDomain("*");
            frames = 0;
            prevTimer = 0;
            curTimer = 0;
            totalMilliseconds = 0;
            millisecondsInView = 0;
            this.addEventListener(Event.ENTER_FRAME, updateFrameRate);
            ExternalInterface.addCallback("addc", currentFrameRate);
            ExternalInterface.addCallback("addi", isVisible);
        }

        private function updateFrameRate(e : Event) : void {
            frames += 1;
            curTimer = getTimer();
            if (curTimer - prevTimer >= 100){
                var timeDiff : Number = curTimer - prevTimer; 
                totalMilliseconds += timeDiff;
                fps = Math.round(frames * 1000 / ( timeDiff ));
                prevTimer = curTimer;
                frames = 0;

                if (isVisible()) {
                    millisecondsInView += timeDiff;
                }
            }
         }

         public function currentFrameRate() : Number {
            return fps;
         }
         
         public function isVisible() : Boolean {
            return fps >= INVIS_FRAME_RATE;
         }
    }
}