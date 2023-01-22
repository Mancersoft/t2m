let counter = 0;
let isAllLoaded = false;

const loadScript = function (script_link) {
  const script = document.createElement('script');
  script.async = true;
  script.onload = function () {
    counter++;
    if (counter >= 4) {
      isAllLoaded = true;
    }
  }
  script.src = script_link;
  document.head.appendChild(script); 
}

loadScript("https://staskkk.github.io/t2m/src/sha1.js")
loadScript("https://staskkk.github.io/t2m/src/bencode.js")
loadScript("https://staskkk.github.io/t2m/src/base32.js")
loadScript("https://staskkk.github.io/t2m/src/t2m.external.js")

var allLinkElems = document.body.getElementsByTagName("a");
for(let linkElem of allLinkElems) {
    linkElem.onclick = function (e) {
    if (!isAllLoaded) {
        return true;
    }

    e = e ||  window.event;
    const element = e.target || e.srcElement;

    if (element.tagName == 'A'
    && (element.href.startsWith("https:")
    || element.href.startsWith("http:"))
    && localStorage.getItem("TtoM:" + element.href) === null) {
        e.stopPropagation();
        fixIfTorrentLink(element);
        return false;
    }
    
    return true;
    };
}

async function fixIfTorrentLink(element) {
  if (await checkHeadersIsTorrent(element.href)) {
    console.log("Block torrent file download");
    const data = await fetch(element.href);
    const blob = await data.blob();
    const result_link = await T2M.queue_torrent_blob(blob);
    element.setAttribute("href", result_link);
    element.onclick = function (e) {
        e = e ||  window.event;
        const innerElement = e.target || e.srcElement;
        e.stopPropagation();
        window.open(innerElement.href);
        return false;
    }
    window.open(result_link);
    return;
  }
  
  localStorage.setItem("TtoM:" + element.href, "+");
  element.click();
}

async function checkHeadersIsTorrent(url) {
  const response = await fetch(url, {method: 'HEAD'});
  for (const headerEntry of response.headers) {
    if (headerEntry[0] == "content-type"
    && headerEntry[1].includes("application/x-bittorrent")) {
      return true;
    }
  }
  
  return false;
}