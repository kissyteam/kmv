var kissymods;

	chrome.tabs.onActivated.addListener(function(evt){
		kissymods=null;
	});

	chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
		//接收来自content script
	    if (request.src == "kissyMap") {
			kissymods = JSON.parse(request.kissyMods);
			chrome.runtime.sendMessage({src: "kissy", kissyMods: kissymods});
	    }
		
		if (request.src == "kissyMap1") {
			kissymods = request.kissyMods;
			chrome.runtime.sendMessage({src: "nokissy", kissyMods: kissymods});
		}
		
		//接收来自popup的请求，并向页面发出请求
	    if (request.src == "ready") {

	    	chrome.tabs.query({ active: true, highlighted: true }, function (tabs) {
	    		
  				chrome.tabs.sendMessage(tabs[0].id, {src: "ready"});
			});
	    }
	});

