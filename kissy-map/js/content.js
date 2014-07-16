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

            window.addEventListener("message", function(e) {
                if (e.data.src == "kissyMap") {
                    chrome.runtime.sendMessage({src: "kissyMap", kissyMods: e.data.kissyMods});
					//console.log(typeof e.data.kissyMods);
                }
            });
        },

        interceptor: function() {
            setTimeout(function() {
                var mods = window.KISSY && window.KISSY.Env.mods,
                    res = {};
                for (var mod in mods) {
                    res[mod] = { requires: mods[mod].requires || [] };
                }
                window.postMessage({
                    src: "kissyMap",
                    kissyMods: JSON.stringify(res)
                }, "*");
            }, 2000);
        }
    };
    contentScript.init();
})();