function PageGenerator(iIframeDepth, bSameDomain, bAltFrame) {
    
    var piIframeDepth = iIframeDepth;
    var pbSameDomain = bSameDomain;
    var pbAltFrame = bAltFrame;
    
    var domainEnd = ".test.adamity.com"
    
    this.CreatePage = function() {
        if (pbSameDomain == "true") {
           var sDomain = "test.adamity.com";
        }
        else {
           var sDomain = "false-domain-" + piIframeDepth + domainEnd;
        }
       
        if (piIframeDepth == 1) {
            var sPage = "http://" + sDomain + "/ad.html";
            $("body").append(this.CreateIframe(sPage));
        }
        else if (piIframeDepth > 1) {            
            var sPage = "http://" + sDomain + "/testIframe.html?depth=" + (piIframeDepth - 1) + "&sameDomain=" + pbSameDomain;
            $("body").append(this.CreateIframe(sPage));
        }
        else {
            $.ajaxSetup({
                cache: true
            });
            $("body").append('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" id="OAS_RMF_x26_FLASH" width="300" height="250" align="" alt=""><param name="movie" value="http://imagenen1.247realmedia.com/RealMedia/ads/Creatives/oasfr/DEMO_mpave/300x250_snowcake_video2.swf/1339670116?clicktag=http://mfr.247realmedia.com/RealMedia/ads/click_lx.ads/www.247realmedia.com/site-demo-formats/L38/2112954938/x26/oasfr/DEMO_mpave/DEMO_mpave.html/546d6c4862553662536d4141446c6677?http://www.247realmedia.com"><param name="quality" value="high"><param name="wmode" value="transparent"><param name="AllowScriptAccess" value="always"><embed src="http://imagenen1.247realmedia.com/RealMedia/ads/Creatives/oasfr/DEMO_mpave/300x250_snowcake_video2.swf/1339670116?clicktag=http://mfr.247realmedia.com/RealMedia/ads/click_lx.ads/www.247realmedia.com/site-demo-formats/L38/2112954938/x26/oasfr/DEMO_mpave/DEMO_mpave.html/546d6c4862553662536d4141446c6677?http://www.247realmedia.com" quality="high" wmode="transparent" swliveconnect="FALSE" width="300" height="250" name="OAS_RMF_x26_FLASH" align="" allowscriptaccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" alt=""></object>');
            $.getScript("//cdn.adamity.com/adamity.js?padv=1&pcamp=2&pplace=3&pcreative=4&ppubsite=5&pchannel=6&ppub=7&lol=sas&pagency=8", function(data, textStatus, jqxhr) {
            });
        }
        
        if (pbAltFrame == "true") {
            var sAltDomain = "false-domain-" + 1 + domainEnd;;
            var sPage = "http://" + sAltDomain + "/testAlt.html";
            $("body").append(this.CreateIframe(sPage));
        }
    }
    
    this.CreateIframe = function(sSrc) {
        return "<iframe width=\"300\" scrolling=\"no\" height=\"250\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" bordercolor=\"#000000\" vspace=\"0\" hspace=\"0\" src=\"" + sSrc + "\"></iframe>";
    }
}