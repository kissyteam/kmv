var kissyMods;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.src == "kissyMap") {
        kissyMods = request.kissyMods;
    }

    if (request.src == "ready") {
        sendResponse({src: "ready", "kissyMods": kissyMods});
    }
});

