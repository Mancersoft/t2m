var counter = 0;
var loadScript = function (script_link) {
	let script = document.createElement('script');
	script.async = true;
	script.onload = function () {
		counter++;
		if (counter >= 4) {
			on_all_loaded();
		}
	}
	script.src = script_link;
	document.head.appendChild(script); 
}

loadScript("https://mancersoft.github.io/t2m/src/sha1.js")
loadScript("https://mancersoft.github.io/t2m/src/bencode.js")
loadScript("https://mancersoft.github.io/t2m/src/base32.js")
loadScript("https://mancersoft.github.io/t2m/src/t2m.external.js")

var on_all_loaded = function () {
	var link_elements = document.getElementsByClassName("torrent-download-link");
	for (var i = 0; i < link_elements.length; ++i) {
		let element = link_elements[i];
		fetch(element.href)
		   .then(data => data.blob())
		   .then(blob => T2M.queue_torrent_blob(blob))
		   .then(result_link => element.setAttribute("href", result_link));
	};
};
