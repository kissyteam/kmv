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
		//	chrome.runtime.onMessage.addListener(function(request,sender,response){	
		//		if(request.src=="getKISSY"){
				//	console.log(request.src);
				//	window.postMessage("getKISSY","*");
				//	loadAgain();
		//		}
		//	});
			
			window.postMessage("getKISSY","*");
			
            window.addEventListener("message", function(e) {
                if (e.data.src == "kissyMap") {
                    chrome.runtime.sendMessage({src: "kissyMap", kissyMods: e.data.kissyMods});
					//console.log(typeof e.data.kissyMods);
                }
				
				if(e.data.src=="kissyMap1"){
					chrome.runtime.sendMessage({src: "kissyMap1", kissyMods: e.data.kissyMods});
				}
            });
        },

        interceptor: function() {
            window.addEventListener("message",function(e) {
				if(e.data=="getKISSY"){
					var mods = window.KISSY && window.KISSY.Env.mods,
						res = {};
					if(mods){
						for (var mod in mods) {
							res[mod] = { requires: mods[mod].requires || [] };
						}
						window.postMessage({
							src: "kissyMap",
							kissyMods: JSON.stringify(res)
						}, "*");
					}else{
					//	console.log(mods);
						window.postMessage({
							src: "kissyMap1",
							kissyMods: mods
						}, "*");
					}
				}
            },false);
        }
    };
    contentScript.init();
})();

function loadAgain(){
	window.location.reload();
}