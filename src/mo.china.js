/*
	Mo.js
	javascript framework
	author:
			Wiki[MO]	gwikimo@gmail.com	
			Lay 			veryide@qq.com
			
	#地区扩展，包括国内省市筛选、过滤等#
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}


/*
	中国省市列表
	select		select对象
	area			区域
*/
Mo.China = function(select,area){

	var p = Mo.China._province;
	var c = Mo.China._city;
	
	switch(area){
	
		case 'city':
		
			//遍历省份
			for(var i=0;i<p.length;i++){
				var prov = p[i];
				
				if(c[i].length==1){
					continue;
				}
				
				select.options[select.length] = new Option(prov,prov);
				select.options[select.length-1].disabled=true;
				//select.options[select.length-1].style.fontWeight='blod';
				select.options[select.length-1].style.color='red';
				
				//遍历城市
				if(c[i].length>1){
					for(var n=0; n<c[i].length; n++){
						var city = c[i][n];
						select.options[select.length] = new Option(' - '+city,city);
					}
				}
			}
		
		break;
	
		case 'province':
		default:
		
			//遍历省份
			for(var i=0; i<p.length; i++){
				var val = p[i];
				select.options[select.length] = new Option(val,val);
			}
		
		break;
	
	}
	
}

/*
	中国省市列表
	selects		select对象组
	input			输入框
*/
Mo.China.getValue=function(selects,input){

	var val='';
	
	for(var n=0;n<selects.length; n++){
		var x = selects[n];
		for(var i=0; i<x.length; i++){
			if(x[i].selected && x[i].value && !x[i].disabled){
				val +=','+x[i].value;
			}
		}
	}
	
	input.value =val.substr(1);
}

/*
	中国省市列表
	selects		select对象组
	input			输入框
*/
Mo.China.setValue=function(selects,input){

	var array = input.value.split(',');
	
	for(var n=0;n<selects.length; n++){
		var x = selects[n];
		for(var i=0; i<x.length; i++){
			if( Mo.Array(array).indexOf(x[i].value) > -1 && !x[i].disabled){
				x[i].selected=true;
			}
		}
	}
}


/*
	中国省市列表
	select		select对象
	allowSub	是否显示子项(市)
*/
/*
Mo.China=function(select,allowSub){

	var p = Mo.China._province;
	var c = Mo.China._city;
	
	//遍历省份
	for(var i=0;i<p.length;i++){
		var prov = p[i];
		select.options[select.length] = new Option(prov,prov);
		
		
		//遍历城市
		if(allowSub && c[i].length>1){
			for(var n=0; n<c[i].length; n++){
				var city = c[i][n];
				select.options[select.length] = new Option('	..'+city,city);
			}
		}
		
	}
}
*/

Mo.China._province=["安徽","北京","重庆","福建","甘肃","广东","广西","贵州","海南","河北","河南","黑龙江","湖北","湖南","吉林","江苏","江西","辽宁","内蒙古","宁夏","青海","山东","山西","陕西","上海","四川","天津","西藏","新疆","云南","浙江","香港","澳门","台湾"];

Mo.China._city=[
	/*安徽*/["安庆","蚌埠","亳州","巢湖","滁州","阜阳","合肥","淮北","淮南","黄山","六安","马鞍山","宿州","铜陵","芜湖","宣城"],
	/*北京*/["北京"],
	/*重庆*/["重庆"],
	/*福建*/["福州","龙岩","南平","宁德","莆田","泉州","三明","厦门","漳州"],
	/*甘肃*/["白银","定西","甘南","嘉峪关",/*"金昌",*/"酒泉","兰州","临夏","平凉","庆阳","天水","武威","张掖"],
	/*广东*/["潮州","东莞","佛山","广州","河源","惠州","江门","揭阳","茂名","梅州","清远","汕头","汕尾","韶关","深圳","阳江","湛江","肇庆","中山","珠海"],
	/*广西*/["百色","北海","防城港","贵港","桂林","桂平","贺州","柳州","南宁","钦州","梧州","玉林"],
	/*贵州*/["安顺","毕节","赤水","都匀","贵阳","凯里","六盘水","铜仁","遵义"],
	/*海南*/["儋州","海口","南沙岛",/*"琼山",*/"三亚","通什","文昌","西沙"],
	/*河北*/["保定","沧州","承德","邯郸","衡水","廊坊","秦皇岛","石家庄","唐山","邢台","张家口"],
	/*河南*/["安阳","鹤壁","济源","焦作","开封","洛阳","南阳","平顶山","濮阳","三门峡","商丘","新乡","信阳","许昌","郑州","周口","驻马店"],
	/*黑龙江*/["大庆","大兴安岭","哈尔滨","鹤岗","黑河","鸡西","佳木斯","牡丹江","齐齐哈尔","七台河","双鸭山","绥化","伊春"],
	/*湖北*/["鄂州","恩施","黄冈","黄石","荆门","荆州","十堰","随州","武汉","咸宁","襄樊","孝感","宜昌"],
	/*湖南*/["常德","长沙","郴州","衡阳","怀化","吉首","娄底","邵阳","湘潭","益阳","永州","岳阳","张家界","株洲"],
	/*吉林*/["白城","白山","长春","吉林市","辽源","四平","松原","延边"],
	/*江苏*/["常州","淮安","连云港","南京","南通","苏州","泰州","无锡","徐州","盐城","扬州","宜兴","镇江"],
	/*江西*/[/*"抚州",*/"赣州",/*"吉安",*/"景德镇","九江","南昌","萍乡","上饶","宜春","鹰潭"],
	/*辽宁*/["鞍山","本溪","朝阳","大连","丹东","抚顺","阜新","葫芦岛","锦州","辽阳","沈阳","铁岭","营口"],
	/*内蒙古*/["包头","赤峰","鄂尔多斯","呼和浩特","乌海","锡林浩特"],
	/*宁夏*/["固原","银川","中卫"],
	/*青海*/["果洛","海北","海南州","海西","黄南","西宁","玉树"],
	/*山东*/["东营","菏泽","济南","济宁","聊城","临沂","青岛","曲阜","泰安","日照","潍坊","威海","烟台","枣庄","淄博"],
	/*山西*/["长治","大同","晋城","晋中","临汾","朔州","太原","忻州","阳泉","运城"],
	/*陕西*/["安康","宝鸡","韩城","汉中","商洛","铜川","渭南","西安","咸阳","延安","榆林"],
	/*上海*/["上海"],
	/*四川*/["阿坝","巴中","成都","达州","德阳","甘孜州","广元","乐山","凉山","泸州","绵阳","内江","攀枝花","雅安","宜宾","自贡"],
	/*天津*/["天津"],
	/*西藏*/["阿里","昌都","拉萨","林芝","那曲","日喀则","山南"],
	/*新疆*/["阿克苏","阿勒泰","昌吉","哈密","和田","克拉玛依","喀什","库尔勒","石河子","塔城","吐鲁番","乌鲁木齐","伊犁"],
	/*云南*/["保山","楚雄","大理","德宏","迪庆","红河","昆明","丽江","临沧","怒江",/*"曲靖",*/"思茅","文山","西双版纳","玉溪","昭通"],
	/*浙江*/["杭州","湖州","嘉兴","金华","丽水","宁波","衢州","绍兴","台州","温州","舟山"],
	/*香港*/["香港"],
	/*澳门*/["澳门"],
	/*台湾*/["高雄","台北"]
];


/*state*/
Mo.plugin.push("china");