var kissyMods;
var exclude=["dom","node","loader","anim","features","path","promise","uri","lang","base","event","io","attribute","button","color","combobox",
	"component","cookie","date","dd","deprecated","editor","filter-menu","html-parser","import-style","menu","menubutton","meta","navigation-view",
	"overlay","querystring","reactive","resizable","router","scroll-view","separator","split-button","stylesheet","swf","tabs","toolbar",
	"tree","ua","url","util","xtemplate","mui"];
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.src == "kissyMap") {
		kissyMods = request.kissyMods;
    }
	kissymods=JSON.parse(kissyMods);
    if (request.src == "ready") {
			//console.log(request.kissyMods);
		var end=toJson(kissymods,exclude);
		console.log(end.sample);
		console.log(end.connect);
        chrome.runtime.sendMessage({src: "back1", "sample": end.sample, "connect": end.connect});
    }
	if (request.src == "filter") {
		exclude.push(request.option);
			//console.log(request.kissyMods);
		var end=toJson(kissymods,exclude);
		console.log(end.sample);
		console.log(end.connect);
        chrome.runtime.sendMessage({src: "back2", "sample": end.sample, "connect": end.connect});
    }
	
});
function testMods(str,exclude){
	for(var i=0;i<exclude.length;i++) {
		if(str.indexOf(exclude[i]+"/")==0){
			return false;
		}else if(exclude.indexOf(str)!=-1){
			return false;
		}
	}
	return true;
}
function toJson(kissymods,exculde){
	var connect=[]
		,sample=[]
		,count=0
		,count1=0;
	for (var name in kissymods) {
				
				if (kissymods[name].requires[0]&& testMods(name,exclude)) {
					console.log(testMods(name,exclude));
					var strsample='{"name": "'+name+'", '+'"size": '+Math.round(20*Math.random()+20)+'}';
					sample[count1]=JSON.parse(strsample);
					count1++;
					for(var k=0; k<kissymods[name].requires.length; k++){
						if(testMods(kissymods[name].requires[k],exclude)){
						var strcon='{"source": "'+name+'", '+'"target": "'+kissymods[name].requires[k]+'"}';
						connect[count]=JSON.parse(strcon);
						count++;
						}
					}
				
				}
			}
	var outcome={"sample": sample, "connect": connect};
	return outcome;
}