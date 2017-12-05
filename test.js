console.log(document.currentScript);
var span = document.createElement('span'),
currentSite = "http://www.dbxd.com",
websiteCredits = "Website Credits",
websiteHover = "Website by DBXD",
anchor = document.createElement('anchor'),
anchorText = document.createTextNode('Website Credits')
anchor.setAttribute('href', currentSite);
anchor.setAttribute('target', "_blank");
anchor.appendChild(anchorText);
span.appendChild(anchor);


function belnord () {
    var container = document.getElementById('container');
    container.appendChild(span)
}

function location (origin) {
	switch (origin) {
	case "http://262fifth.dev.dbxd.com/":
        return true;
	case "http://localhost:7000":
        return belnord();
	default:
		return null
	}
}

location(window.location.origin);