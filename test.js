console.log(document.currentScript);
var span = document.createElement('span'),
currentSite = "http://www.dbxd.com",
websiteCredits = "Website Credits",
websiteHover = "Website by DBXD",
datalink = "dbxd",
websiteCredits = "Website Credits",
anchor = document.createElement('a'),
anchorText = document.createTextNode(websiteCredits);
anchor.setAttribute('href', currentSite);
anchor.setAttribute('target', "_blank");
anchor.setAttribute('data-link', datalink);
anchor.style.textDecoration = "none";
anchor.style.color = "inherit";
anchor.appendChild(anchorText);
span.appendChild(anchor);


function belnord () {
    var container = document.getElementById('container');
    container.appendChild(span);
    container.addEventListener('mouseover', function (e) {
        if (e.target.getAttribute('data-link') === datalink) {
            e.target.innerHTML = websiteHover;
        }
    })
    container.addEventListener('mouseout', function (e) {
        if (e.target.getAttribute('data-link') === datalink) {
            e.target.innerHTML = websiteCredits;
        }
    })
}

function originLocation (origin) {
	switch (origin) {
	case "http://262fifth.dev.dbxd.com/":
        return true;
	case "http://localhost:7000":
        return belnord();
	default:
		return null
	}
}

originLocation(window.location.origin);