chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return { cancel: true };
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["blocking"]
);
