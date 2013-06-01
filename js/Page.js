$(document).ready(function () {
    var maxDepth = 12;
    
    var depth = GetURLParameter("depth");
    var sameDomain = GetURLParameter("sameDomain");
    var altDomain = GetURLParameter("altDomain");
    
    if (depth === undefined) {
        depth = 1;
    }
    else if (depth > maxDepth) {
        depth = maxDepth;
    }
    
    if (sameDomain === undefined) {
        sameDomain = "true";
    }
    
    if (altDomain === undefined) {
        altDomain = "false";
    }
    
    var generator = new PageGenerator(depth, sameDomain, altDomain);
    generator.CreatePage();
});


function GetURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
