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
		
		//接收来自popup的“ready”请求，首先判断该页面是否已有kissymods，有则直接返回，否则向contentscripts请求
	    if (request.src == "ready") {
	    	if(kissymods) {
	    		chrome.runtime.sendMessage({src: "kissy", kissyMods: kissymods});
	    	}else{
		    	chrome.tabs.query({ active: true, highlighted: true }, function (tabs) {
		    		chrome.tabs.sendMessage(tabs[0].id, {src: "ready"});
				});
			}
	    }
	});

