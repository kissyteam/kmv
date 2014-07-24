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

	    if (request.src == "kissyMap") {
			kissymods = JSON.parse(request.kissyMods);
	    }
		
		if (request.src == "kissyMap1") {
			kissymods = request.kissyMods;
		}
		
	    if (request.src == "ready") {
			if (kissymods) {
				var end=toJson(kissymods,exclude);
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

function toJson(kissymods,ex) {
	var connect = []
		,sample = []
		,count = 0
		,count1 = 0;
	var requirecount=countRequire(kissymods);
	console.log(requirecount);
	for (var name in kissymods) {
				
				if (kissymods[name].requires[0] && testMods(name,ex)) {
					var size=requirecount[name]?(requirecount[name]+10):20;
					console.log(requirecount.name+' '+name);
					var strsample = '{"name": "' + name + '", ' + '"size": ' + size + '}';
					sample[count1] = JSON.parse(strsample);
					count1++;
					for(var k = 0; k < kissymods[name].requires.length; k++){
						if (testMods(kissymods[name].requires[k],ex)) {
						var strcon = '{"source": "' + name + '", ' + '"target": "' + kissymods[name].requires[k] + '"}';
						connect[count] = JSON.parse(strcon);
						count++;
						}
					}
				
				}
			}
	var outcome = {"sample": sample, "connect": connect};
	return outcome;
}

//过滤与json格式化要分开来

//过滤