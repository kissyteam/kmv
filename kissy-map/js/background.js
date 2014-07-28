var kissymods;

	chrome.tabs.onActivated.addListener(function(evt){
		chrome.tabs.reload(evt.tabId);
		kissymods=null;
	});

	chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
		//接收来自content script
	    if (request.src == "kissyMap") {
			kissymods = JSON.parse(request.kissyMods);
	    }
		
		if (request.src == "kissyMap1") {
			kissymods = request.kissyMods;
		}
		
		//接收来自popup
	    if (request.src == "ready") {
			if (kissymods) {
				sendResponse({src: "ready", kissyMods: kissymods});
			} else {
				sendResponse({src: "noKISSY"});
			}
	    }
	});

