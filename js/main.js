/**
 * popup页面绘制kissyMap
 * @ author: zhangdi.zd
 * @ date: 2014-07-22
 */

(function() {
//    var sample_data = [
//        {"name": "alpha", "size": 10},
//    ]
//	  var positions=[
//		  {"name": "alpha", "x": 10, "y": 12}	
//	  ]
//    var connections = [
//        {"source": "alpha", "target": "beta"},
//    ]

	var oFilter = document.getElementById("ofilter"),
		oSel = document.getElementById("sMods"),
	 	filter = document.getElementById("filter"),
		oChoose = document.getElementById("choosemod"),
		oReset = document.getElementById("reset"),
		choosemods = [],
		showFilter = document.getElementById("showFilter"),
		oSelected = document.getElementById("oSelected"),
		oBackout = document.getElementById("backout"),
		count = 0,
		gmod,
		kissymods,
		exclude=["dom","node","loader","anim","features","path","promise","uri","lang","base","event","io","attribute","button","color","combobox",
	"component","cookie","date","dd","deprecated","editor","filter-menu","html-parser","import-style","menu","menubutton","meta","navigation-view",
	"overlay","querystring","reactive","resizable","router","scroll-view","separator","split-button","stylesheet","swf","tabs","toolbar",
	"tree","ua","url","util","xtemplate","mui"],

	resetmods=["dom","node","loader","anim","features","path","promise","uri","lang","base","event","io","attribute","button","color","combobox",
	"component","cookie","date","dd","deprecated","editor","filter-menu","html-parser","import-style","menu","menubutton","meta","navigation-view",
	"overlay","querystring","reactive","resizable","router","scroll-view","separator","split-button","stylesheet","swf","tabs","toolbar",
	"tree","ua","url","util","xtemplate","mui"];



	//过滤器隐藏开关
	setInterval(function() {
		if( oSelected.firstChild ) {
			oSelected.style.display = "block";
		}else {
			oSelected.style.display = "none";
		}
	}, 500);	

	showFilter.addEventListener("click", function(event) {
		count++;

		if( count%2 == 0) {
			moveto(oFilter,-200);
			moveto(oSelected,-200);
			showFilter.innerHTML = "过滤器显示";
		}else {
			moveto(oFilter,0);
			moveto(oSelected,0);
			showFilter.innerHTML = "过滤器隐藏";
			
		}
	}, false);

	//popup页面请求
    chrome.runtime.sendMessage({src: "ready"});

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    	if(request.src == "kissy") {
    		kissymods = request.kissyMods;

        	var end = toJson(kissymods, resetmods);
        //	console.log(end);
        	resetOption(oSel,end.sample);
			drawMap(end.sample,end.connect,end.positions);

			gmod=document.getElementsByClassName("d3plus_rect");
		//	var gm=[];
			
    	}

    	if(request.src == "nokissy"){
    		noKissy();
    	}
    });
	
	//选择模块
	oChoose.addEventListener("click", function(event) {
		var options = oSel.options;
		var modIndex = oSel.selectedIndex;
		
		choosemods.push(options[modIndex].value);
		
		var p = document.createElement("p");
		p.innerHTML = options[modIndex].value;
		p.className = "choosedMod";
		
		oSelected.appendChild(p);

		oSel.removeChild(options[modIndex]);
	}, false);

	//撤销选择
	oBackout.addEventListener("click", function(event) {
		if(choosemods[0]) {
			var oplast = choosemods[choosemods.length-1];
			//Array.remove(choosemods,choosemods.length-1);
			choosemods.length = choosemods.length-1;
			oSelected.removeChild(oSelected.lastChild);

			var op = document.createElement("option");
			op.value = oplast;
			op.innerHTML = oplast;
			oSel.insertBefore(op,oSel.firstChild);
			oSel.selectedIndex = 0;
		}
	}, false);
	
	//过滤模块
	filter.addEventListener("click", function(event) {
	
	//	当没有选择模块时，默认过滤掉当前select选中的模块
		if(!choosemods[0]) {
			var options = oSel.options;
			var modIndex = oSel.selectedIndex;
			choosemods.push(options[modIndex].value);

			var p = document.createElement("p");
			p.innerHTML = options[modIndex].value;
			p.className = "choosedMod";
		
			oSelected.appendChild(p);  
		}

		//发送过滤请求
		exclude = exclude.concat(choosemods);
		choosemods = [];
        var end = toJson(kissymods, exclude);
        resetOption(oSel,end.sample);
			
		drawMap(end.sample,end.connect,end.positions);

	},false);

//	请求重置
	oReset.addEventListener("click", function(event) {
	//	console.log(choosemods);
		
				//清空选择的模块
			while(oSelected.firstChild) {
					oSelected.removeChild(oSelected.firstChild);
				}
			exclude.length = resetmods.length;
			choosemods = [];

			var end = toJson(kissymods, resetmods);
        	resetOption(oSel,end.sample);
			
			drawMap(end.sample,end.connect,end.positions);
			
	},false);
	

	//var g=document.getElementsByClassName("d3plus_color");
	//console.log(typeof g);


})();


function noKissy() {
	var fp = document.createElement("p");
	
	fp.innerHTML = "此页面未发现KISSY模块";
	fp.className = "nokissy";
	
	document.body.appendChild(fp);
}


function drawMap(sample, connect, positions) {
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


function resetOption(oSel, sample) {

	while(oSel.firstChild) {
		oSel.removeChild(oSel.firstChild);
	}
				
	for(var s = 0; s < sample.length; s++) {
		var op = document.createElement("option");
		op.value = sample[s].name;
		op.innerHTML = sample[s].name;
					
		oSel.appendChild(op);
	}
}


function moveto(obj, target) {
	var speed = obj.offsetLeft > target ? -10 : 10;
	clearInterval(timer1);
	var timer1 = setInterval(function() {
			if(Math.abs(obj.offsetLeft-target) > 0.5) {
				obj.style.left = obj.offsetLeft + speed + 'px';
			}else{
				clearInterval(timer1);
			}
		},30);
}

//测试模块是否需要过滤
function testMods(str, ex) {
	for(var i = 0; i < ex.length; i++) {
		if(str.indexOf(ex[i] + "/") == 0) {
			return false;
		} else if (str.indexOf(ex[i]) == 0){
			return false;
		}
	}
	return true;
}

//被依赖次数记录
function countRequire(kissymods) {
	var requirecount = {};
	for(var i in kissymods) {
		if(kissymods[i].requires[0]) {
			kissymods[i].requires.forEach(function(data){
				if(requirecount[data]) {
					requirecount[data]++;
				}else {
					requirecount[data] = 1;
				}
			});
		}
	}
	return requirecount;
}

//格式化JSON
function toJson(kissymods, ex) {
	var connect = []
		,sample = []
		,positions = []
		,count = 0
		,count1 = 0;
	var c=0;
	var requirecount = countRequire(kissymods);
	for (var name in kissymods) {
		c++;
			//	alert(kissymods[name].requires.length+':'+testMods(name,ex));
			if (kissymods[name].requires.length > 0 && testMods(name,ex)) {
					var size=requirecount[name]?(requirecount[name]*2+10):10;
			//		alert(name+':'+testMods(name,ex)+'*');
					var strsample = '{"name": "' + name + '", ' + '"size": ' + size + '}';
					var position = '{"name": "' + name + '", ' + '"x": ' +50 +', '+ '"y": ' +50+ '}';
					positions[count1] =JSON.parse(position);
					sample[count1] = JSON.parse(strsample);
					count1++;
					for(var k = 0; k < kissymods[name].requires.length; k++){
						if (testMods(kissymods[name].requires[k],ex) && kissymods[name].requires[k]) {
							var strcon = '{"source": "' + name + '", ' + '"target": "' + kissymods[name].requires[k] + '"}';
							connect[count] = JSON.parse(strcon);
							count++;
						}
					}
				
			}
	}
	//alert(count+' '+count1+' '+c);
	var outcome = {"sample": sample, "connect": connect, "positions": positions};
	return outcome;
}

function getSample(kissymods, ex){
	var sample=[];

	for(var i in kissymods){
		var requires=kissymods[i].requires;
		if(requires && testMods(i, ex) && sample.indexOf(i) == -1){
			var size = countRequire(kissymods)[i] ? (countRequire(kissymods)[i]+10) : 10;
			var strsample = '{"name": "' + name + '", ' + '"size": ' + size + '}';

			sample.push(JSON.parse(strsample));
			for(var j = 0; j < requires.length; j++){
				if(testMods(requires[j],ex) && kissymods[name].requires[k]){}
			}
		}
	}

}