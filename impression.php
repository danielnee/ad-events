<?php
    /**
     * Handles setting user cookies for impressions
     * 
     * Four use cases handled:
     * 
     * 1. User has cookie, do_not_cookie not set - Cookie renewed, 1x1 pixel served
     * 2. User has cookie, do_not_cookie set - Cookie renewed, 1x1 pixel served
     * 3. User has no cookie, do_not_cookie not set - Cookie created, self-redirect now with do_not_cookie_set
     * 4. User has no cookie, do_not_cookie set - Cookie created, a deterministic cookie will be created by data processor 
     */

    require_once 'helper.php';

    // Cookie User Id
    $sIdKey = "userId";
    // Opt out flag
    $sOptOut = "optOut";
    // Do not cookie field, check if we should not try to set a cookie
    $sDoNotCookieKey = "do_not_cookie";
    // Two year cookie on user id cookie (86400 secs per day for 2 years)
    $iUserIdExpireTime = 86400 * 365 * 2;
    
    // Parse the current page url
    $sUrl = curPageURL();
    $cParsedUrl = parse_url($sUrl);
    parse_str(isset($cParsedUrl["query"]) ? $cParsedUrl["query"] : "", $aQueryString);
    $bDoNotCookie = isset($aQueryString[$sDoNotCookieKey]) && $aQueryString[$sDoNotCookieKey] == "1";
    $bIsOptOut = isset($_COOKIE[$sOptOut]);
        
    // Does the user have a cookie? Refresh the cookie
    if (isset($_COOKIE[$sIdKey])) {
        $sUserId = $_COOKIE[$sIdKey];
        
        if ($bIsOptOut) {
            // Unset the cookie by setting to the past
            setcookie($sIdKey, $sUserId, 1);
        }
        else {
            setcookie($sIdKey, $sUserId, time() + $iUserIdExpireTime);
        } 
    }
    // No Cookie, create a cookie
    else if (!$bDoNotCookie && !$bIsOptOut) {
        $sUserId = gen_uuid();
        setcookie($sIdKey, $sUserId, time() + $iUserIdExpireTime);
        
        // Re-direct the user back to this URL, now with do_not_cookie added
        $aQueryString[$sDoNotCookieKey] = "1";
        $cParsedUrl["query"] = http_build_query($aQueryString);
        $sUrl = http_build_url("", $cParsedUrl);
        header("Location: $sUrl");
        exit;
    }
    
    // Return a 1x1 pixel
    header('Content-Type: image/gif');
    echo base64_decode("R0lGODdhAQABAIAAAPxqbAAAACwAAAAAAQABAAACAkQBADs=");