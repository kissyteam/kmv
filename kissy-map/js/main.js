/**
 * popup页面绘制kissyMap
 * 
 */
(function() {

//    var sample_data = [
//        {"name": "alpha", "size": 10},
//        {"name": "beta", "size": 12},
//        {"name": "gamma", "size": 30},
//        {"name": "delta", "size": 26},
//        {"name": "epsilon", "size": 12},
//        {"name": "zeta", "size": 26},
//        {"name": "theta", "size": 11},
//        {"name": "eta", "size": 24}
//    ]
//
//    var connections = [
//        {"source": "alpha", "target": "beta"},
//        {"source": "alpha", "target": "gamma"},
//        {"source": "beta", "target": "delta"},
//        {"source": "beta", "target": "epsilon"},
//        {"source": "zeta", "target": "gamma"},
//        {"source": "theta", "target": "gamma"},
//        {"source": "eta", "target": "gamma"}
//    ]

//    var visualization = d3plus.viz()
//        .container("#viz")
//       .type("network")
//        .data(sample_data)
//        .edges(connections)
//        .edges({"arrows": true})
//        .size("size")
//        .id("name")
//        .draw();
		

    chrome.runtime.sendMessage({src: "ready"}, function(request) {
	
        if (request.src == "ready") {
            console.log(request.kissyMods);
        }
    });
	
	//var connections=[],sample_data=[];
	
	chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	
		if (request.src=="back1") {
			var kissymods=JSON.parse(request.kissyMods);
			//console.log(request.kissyMods);
			var connect=[]
			,sample=[]
			,count=0
			,count1=0;
			for (var name in kissymods) {
				
				if (kissymods[name].requires[0]&& testMods(name)) {
					console.log(testMods(name));
					var strsample='{"name": "'+name+'", '+'"size": '+Math.round(20*Math.random()+20)+'}';
					sample[count1]=JSON.parse(strsample);
					count1++;
					for(var k=0; k<kissymods[name].requires.length; k++){
						if(testMods(kissymods[name].requires[k])){
						var strcon='{"source": "'+name+'", '+'"target": "'+kissymods[name].requires[k]+'"}';
						connect[count]=JSON.parse(strcon);
						count++;
						}
					}
				
				}
			}
			
			console.log(connect);
			console.log(sample);
			var visualization = d3plus.viz()
				.container("#viz")
				.type("network")
				.data(sample)
				.edges(connect)
				.edges({"arrows": true})
				.size("size")
				.id("name")
				.draw();
		}
	});
	
})();


function testMods(str){
	var exclude=["dom","node","loader","anim","features","path","promise","uri","lang","base","event","io","attribute","button","color","combobox",
	"component","cookie","date","dd","deprecated","editor","filter-menu","html-parser","import-style","menu","menubutton","meta","navigation-view",
	"overlay","querystring","reactive","resizable","router","scroll-view","separator","split-button","stylesheet","swf","tabs","toolbar",
	"tree","ua","url","util","xtemplate","mui"];
	
	for(var i=0;i<exclude.length;i++) {
		if(str.indexOf(exclude[i]+"/")==0){
			return false;
		}else if(exclude.indexOf(str)!=-1){
			return false;
		}
	}
	return true;
}
