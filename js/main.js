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
		oInput = document.getElementById("choosemods"),
	 	filter = document.getElementById("filter"),
		oReset = document.getElementById("reset"),
		showFilter = document.getElementById("showFilter"),
		hide = document.getElementById("hide"),
		choosemods = [],
		modsinit,
		kissymods;

	//隐藏开关
	var hided = false;
	hide.addEventListener("click", function() {
		if(!hided) {
			moveTopto(oFilter, -30);
			moveTopto(hide, 30);
			hided = true;
		}else {
			moveTopto(oFilter, 0);
			moveTopto(hide, 0);
			hided = false;
		}
		
	}, false);

	//用户点击kmv图标，则向background page发送“ready”请求
    chrome.runtime.sendMessage({src: "ready"});

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    	if(request.src == "kissy") {
    		kissymods = request.kissyMods;

        	modsinit = filters.init(kissymods);

			drawMap(modsinit.sample, modsinit.connect, modsinit.position);
			
    	}
    });


    //用户输入模块名，点击过滤
    filter.addEventListener("click", function() {
    	if(!oInput.value){
    		alert("您还没有输入模块匹配模式，请先输入");
    		return;
    	}

    	var end = filters.filter(oInput.value.toLowerCase(), modsinit);

    	drawMap(end.sample, end.connect, end.position);

    }, false);
	
	//用户点击重置
	oReset.addEventListener("click", function() {
		drawMap(modsinit.sample, modsinit.connect, modsinit.position);
	}, false);


})();

var filters = {

	init: function(kissymods) {

		var exclude = ["dom","node","loader","anim","features","path","promise","uri","lang","base","event","io","attribute","button","color","combobox",
		"component","cookie","date","dd","deprecated","editor","filter-menu","html-parser","import-style","menu","menubutton","meta","navigation-view",
		"overlay","querystring","reactive","resizable","router","scroll-view","separator","split-button","stylesheet","swf","tabs","toolbar",
		"tree","ua","url","util","xtemplate","json","ajax"],
		self = this;

		var connects = []
		,samples = []
		,positions = []
		,sample
		,connect
		,position
		,count = 0
		,count1 = 0;
		var requirecount = countRequire(kissymods);

		console.log(requirecount);

		for (var name in kissymods) {

			if (kissymods[name].requires && testMods(name,exclude)) {
				var size=requirecount[name]?(requirecount[name]*2+10):10;
				sample = '{"name": "' + name + '", ' + '"size": ' + size + '}';
				position = '{"name": "' + name + '", ' + '"x": ' +50 +', '+ '"y": ' +50+ '}';
				positions[count1] =JSON.parse(position);
				samples[count1] = JSON.parse(sample);
				count1++;
				for(var k = 0; k < kissymods[name].requires.length; k++){
					if (testMods(kissymods[name].requires[k],exclude) && kissymods[name].requires[k]) {

						if(kissymods[name].requires[k].indexOf('.') == 0){
							kissymods[name].requires[k] = changename(name, kissymods[name].requires[k]);
						}
						connect = '{"source": "' + name + '", ' + '"target": "' + kissymods[name].requires[k] + '"}';
						connects[count] = JSON.parse(connect);
						count++;
					}
				}
					
			}
		}

		var outcome = {"sample": samples, "connect": connects, "position": positions};
		return outcome;
	},

	filter: function(choosemods, initmods) {
		var mods = new RegExp(choosemods),
			sample = [].concat(initmods.sample),
			connect = [].concat(initmods.connect),
			position = [].concat(initmods.position);


		for(var j=0; j < sample.length; j++) {
			if(!mods.test(sample.name)){
				sample.splice(j, 1);
				j--;
			}
		}

		for(var c=0; c < connect.length; c++) {
			if(!mods.test(connect[c].source.name)) {
				if(!mods.test(connect[c].target.name)) {
					connect.splice(c, 1);
					c--;
				}
			}
		}

		for(var p=0; p < position.length; p++) {
			if(!mods.test(position[p].name)){
				position.splice(p, 1);
				p--;
			}
		}

		return {"sample": sample, "connect": connect, "position": position};
	}
};


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


function moveTopto(obj, target) {
	var speed = obj.offsetTop > target ? -10 : 10;
	clearInterval(timer1);
	var timer1 = setInterval(function() {
			if(Math.abs(obj.offsetTop-target) > 0.5) {
				obj.style.top = obj.offsetTop + speed + 'px';
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

function changename(source, target) {
	var sources = source.split("/");
	var targets = target.split("/");
	var end;
	var count = 0;
	
	for(var t = 0; t < targets.length; t++){
		if(targets[t].indexOf(".") == 0) {
			count++;
		}
	}

	for(var s = sources.length-count,j = count; j<targets.length; s++,j++){
		sources[s] = targets[j];
	}

	for(var i=0;i<sources.length;i++){
		if(i==0){ end = sources[i]}
		else{
			end = end +'/'+ sources[i];
		}
	}

	return end;
}