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
	
	var oForm=document.getElementById("filterMods");
	var oSel=document.getElementById("sMods");
	var oBt=document.getElementsByTagName("button")[0];
	oBt.addEventListener("click",function(event){
		var options=oSel.options;
		var modIndex=oSel.selectedIndex;
		
		chrome.runtime.sendMessage({src: "filter", option: options[modIndex].value});
		//exclude.push(options[modIndex].value);
		
		//window.location.reload();
		//console.log(exclude);
	},false);
	
	chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	
		if (request.src=="back1") {
			while(oSel.firstChild){
				oSel.removeChild(oSel.firstChild);
			}
			
			console.log(request.sample.length);
			
			for(var s=0;s<request.sample.length;s++){
				var op=document.createElement("option");
				op.value=request.sample[s].name;
				op.innerHTML=request.sample[s].name;
				
				oSel.appendChild(op);
			}
			
			var visualization = d3plus.viz()
				.container("#viz")
				.type("network")
				.data(request.sample)
				.edges(request.connect)
				.edges({"arrows": true})
				.size("size")
				.id("name")
				.draw();
		}
		
		
		if(request.src=="back2"){
			
			while(oSel.firstChild){
				oSel.removeChild(oSel.firstChild);
			}
			for(var s=0;s<request.sample.length;s++){
				var op=document.createElement("option");
				op.value=request.sample[s].name;
				op.innerHTML=request.sample[s].name;
				
				oSel.appendChild(op);
			}
			
			var visualization = d3plus.viz()
				.container("#viz")
				.type("network")
				.data(request.sample)
				.edges(request.connect)
				.edges({"arrows": true})
				.size("size")
				.id("name")
				.draw();
			console.log(exclude);
		}
	});
	
})();

