/**
 * 向页面注入 postMessage 脚本
 * @author: gonghao.gh
 * @date: 2014-07-02
 */

(function() {

    var contentScript = {

        init: function() {
            var self = this;
            var script_string = "(" + self.interceptor.toString() + ")();";
            var script = document.createElement("script");
            script.innerHTML = script_string;
            document.getElementsByTagName("head")[0].appendChild(script);
			
		//	接收来自background的请求
			chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
				
				if(request.src == "ready"){
					window.postMessage({src: "ready"}, "*");

					window.addEventListener("message", function(e) {
					
		                if (e.data.src == "kissyMap") {
		   				   chrome.runtime.sendMessage({src: "kissyMap", kissyMods: e.data.kissyMods});
						}
						
						if(e.data.src == "kissyMap1") {
							chrome.runtime.sendMessage({src: "kissyMap1", kissyMods: e.data.kissyMods});
						}
            		});
				}

			});
        },

        interceptor: function() {
            	
            window.addEventListener("message", function(event){
            	if(event.data.src == "ready"){
       				
            		var mods =window.KISSY && window.KISSY.Env.mods,
						res = {};
					if (mods) {
					//	var k=0;
						for (var mod in mods) {
							res[mod] = { requires: mods[mod].requires || [] };
					//		k++;
						}
						
					//	alert(k);
						window.postMessage({
							src: "kissyMap",
							kissyMods: JSON.stringify(res)
						}, "*");
					}else {
						window.postMessage({
							src: "kissyMap1",
							kissyMods: mods
						}, "*");
					}
            	}
            }, false);
					
        }
    };
    contentScript.init();
})();
