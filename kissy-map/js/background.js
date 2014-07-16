var kissyMods;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.src == "kissyMap") {
		
		kissyMods = request.kissyMods;
		//chrome.runtime.sendMessage({src: "back", kissyMods: request.kissyMods});
    }
	
    if (request.src == "ready") {
        chrome.runtime.sendMessage({src: "back1", "kissyMods": kissyMods});
    }
	
});
