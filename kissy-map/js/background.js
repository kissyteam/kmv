var kissymods;

var exclude=["dom","node","loader","anim","features","path","promise","uri","lang","base","event","io","attribute","button","color","combobox",
	"component","cookie","date","dd","deprecated","editor","filter-menu","html-parser","import-style","menu","menubutton","meta","navigation-view",
	"overlay","querystring","reactive","resizable","router","scroll-view","separator","split-button","stylesheet","swf","tabs","toolbar",
	"tree","ua","url","util","xtemplate","mui"],
	resetmods=["dom","node","loader","anim","features","path","promise","uri","lang","base","event","io","attribute","button","color","combobox",
	"component","cookie","date","dd","deprecated","editor","filter-menu","html-parser","import-style","menu","menubutton","meta","navigation-view",
	"overlay","querystring","reactive","resizable","router","scroll-view","separator","split-button","stylesheet","swf","tabs","toolbar",
	"tree","ua","url","util","xtemplate","mui"];

	chrome.tabs.onActivated.addListener(function(evt){
		chrome.tabs.reload(evt.tabId);
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
				var end=toJson(kissymods,exclude);
				debugger;
				sendResponse({src: "ready", sample: end.sample, connect: end.connect});
			} else {
				sendResponse({src: "noKISSY"});
			}
	    }

		if (request.src == "filter") {
			console.log(request.option);
			var excludes=exclude.concat(request.option);
			if (kissymods) {
				console.log(excludes);
				console.log(exclude);
				var end = toJson(kissymods,excludes);
				console.log(end);
				sendResponse({src: "filter", sample: end.sample, connect: end.connect});
			} else {
				sendResponse({src: "noKISSY"});
			}
	    }

	    if(request.src == "reset"){
	    	if (kissymods) {
				var end=toJson(kissymods,exclude);
				sendResponse({src: "reset", sample: end.sample, connect: end.connect});
			} else {
				sendResponse({src: "noKISSY"});
			}
	    }
	});

//测试模块是否需要过滤
function testMods(str,ex) {
	for(var i = 0; i < ex.length; i++) {
		if(str.indexOf(ex[i] + "/") == 0) {
			return false;
		} else if (ex.indexOf(str) != -1){
			return false;
		}
	}
	return true;
}

//被依赖次数记录
function countRequire(kissymods){
	var requirecount={};
	for(var i in kissymods){
		if(kissymods[i].requires[0]){
			kissymods[i].requires.forEach(function(data){
				if(requirecount[data]){
					requirecount[data]++;
				}else{
					requirecount[data]=1;
				}
			});
		}
	}
	return requirecount;
}

//格式化
function toJson(kissymods,ex) {
	var connect = []
		,sample = []
		,count = 0
		,count1 = 0;
	var requirecount=countRequire(kissymods);
	console.log(requirecount);
	for (var name in kissymods) {
				
				if (kissymods[name].requires[0] && testMods(name,ex)) {
					var size=requirecount[name]?(requirecount[name]+10):10;
					console.log(requirecount.name+' '+name);
					var strsample = '{"name": "' + name + '", ' + '"size": ' + size + '}';
					sample[count1] = JSON.parse(strsample);
					count1++;
					for(var k = 0; k < kissymods[name].requires.length; k++){
					//	if (testMods(kissymods[name].requires[k],ex)) {
						var strcon = '{"source": "' + name + '", ' + '"target": "' + kissymods[name].requires[k] + '"}';
						connect[count] = JSON.parse(strcon);
						count++;
					//	}
					}
				
				}
			}
	var outcome = {"sample": sample, "connect": connect};
	return outcome;
}