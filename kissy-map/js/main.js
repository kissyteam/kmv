/**
 * popup页面绘制kissyMap
 * 
 */
(function() {

//    var sample_data = [
//        {"name": "alpha", "size": 10},
//    ]
//
//    var connections = [
//        {"source": "alpha", "target": "beta"},
//    ]

		
    chrome.runtime.sendMessage({src: "ready"}, function(request) {
	
		if (request.src == "ready") {
        //   console.log(request.sample);
		//	console.log(request.connect);
			while(oSel.firstChild){
				oSel.removeChild(oSel.firstChild);
			}
			
		//	console.log(request.sample.length);
			
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
		
		if(request.src == "noKISSY"){
			noKissy();
		}
    });
	
//	var oForm=document.getElementById("filterMods");
	var oSel=document.getElementById("sMods");
	var oBt=document.getElementsByTagName("button")[0];
	oBt.addEventListener("click",function(event){
		var options=oSel.options;
		var modIndex=oSel.selectedIndex;
		
		chrome.runtime.sendMessage({src: "filter", option: options[modIndex].value},function(request){
			if(request.src=="filter"){
			
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
				//	console.log(exclude);
			}
			
			if(request.src=="noKISSY"){
				noKissy();
			}
		});
	},false);
	
})();

function noKissy(){
	var fp=document.createElement("p");
	
	fp.innerHTML="CAN NOT FIND KISSY";
	fp.className="nokissy";
	
	document.body.appendChild(fp);
}
