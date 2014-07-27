/**
 * popup页面绘制kissyMap
 * @ author: zhangdi.zd
 * @ date: 2014-07-22
 */
(function() {

//    var sample_data = [
//        {"name": "alpha", "size": 10},
//    ]
//
//    var connections = [
//        {"source": "alpha", "target": "beta"},
//    ]
	var oFilter = document.getElementById("ofilter");
	var oSel = document.getElementById("sMods");
	var filter = document.getElementById("filter");
	var oChoose = document.getElementById("choosemod");
	var oReset=document.getElementById("reset");
	var choosemods = [];
	var showFilter = document.getElementById("showFilter");
	var oSelected=document.getElementById("oSelected");
	var count=0;

	setInterval(function(){
		if(oSelected.firstChild){
			oSelected.style.display="block";
		}else{
			oSelected.style.display="none";
		}
	},500);	

	showFilter.addEventListener("click",function(event){
		count++;
		if(count%2==0){
			moveto(oFilter,-200);
			moveto(oSelected,-200);
			showFilter.innerHTML="ShowFilter";
		}else{
			moveto(oFilter,0);
			moveto(oSelected,0);
			showFilter.innerHTML="HideFilter";
			
		}
	},false);

    chrome.runtime.sendMessage({src: "ready"}, function(request) {
	
		if (request.src == "ready") {
        	//alert(request.sample[2].name+':'+request.sample[2].size);
        	resetOption(oSel,request.sample);
			
			drawMap(request.sample,request.connect);
        }
		
		if(request.src == "noKISSY"){
			
			noKissy();
		}
    });
	
	
	oChoose.addEventListener("click",function(event) {
		var options = oSel.options;
		var modIndex = oSel.selectedIndex;
		
		choosemods.push(options[modIndex].value);
		
		var p = document.createElement("p");
		p.innerHTML = options[modIndex].value;
		p.className = "choosedMod";
		
		oSelected.appendChild(p);

		oSel.removeChild(options[modIndex]);
	});
	
	filter.addEventListener("click",function(event) {
	//	console.log(choosemods);
		if(!choosemods[0]){
			var options = oSel.options;
			var modIndex = oSel.selectedIndex;
			choosemods.push(options[modIndex].value);

			var p = document.createElement("p");
		p.innerHTML = options[modIndex].value;
		p.className = "choosedMod";
		
		oSelected.appendChild(p);  
		}
		chrome.runtime.sendMessage({src: "filter", option: choosemods},function(request){
			
			if(request.src == "filter"){
				console.log(request.sample);
				console.log(request.connect);
				resetOption(oSel,request.sample);
				
				drawMap(request.sample,request.connect);
			}
			
			if(request.src == "noKISSY"){
				noKissy();
			}
		});
	},false);

	oReset.addEventListener("click",function(event) {
	//	console.log(choosemods);
		chrome.runtime.sendMessage({src: "reset"},function(request){
			
			if(request.src == "reset"){
				console.log(request.sample);
				console.log(request.connect);
				resetOption(oSel,request.sample);

				while(oSelected.firstChild){
					oSelected.removeChild(oSelected.firstChild);
				}
				
				drawMap(request.sample,request.connect);
			}
			
			if(request.src == "noKISSY"){
				noKissy();
			}
		});
	},false);
	
})();

function noKissy() {
	var fp = document.createElement("p");
	
	fp.innerHTML = "CAN NOT FIND KISSY";
	fp.className = "nokissy";
	
	document.body.appendChild(fp);
}

function drawMap(sample,connect) {
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

function resetOption(oSel,sample) {

	while(oSel.firstChild){
		oSel.removeChild(oSel.firstChild);
	}
				
	for(var s = 0; s < sample.length; s++){
		var op = document.createElement("option");
		op.value = sample[s].name;
		op.innerHTML = sample[s].name;
					
		oSel.appendChild(op);
	}
}

function moveto(obj,target){
	var speed=obj.offsetLeft>target?-10:10;
	var timer1=setInterval(function(){
			if(Math.abs(obj.offsetLeft-target)>0.5){
				obj.style.left=obj.offsetLeft+speed+'px';
			}else{
				clearInterval(timer1);
			}
		},30);
}