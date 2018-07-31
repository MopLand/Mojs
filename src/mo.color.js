/*!
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*
*	#颜色扩展，包括颜色选择器、RGB 转 16 进制、16 进制转 RGB 等#
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}

/*
	常用颜色选择器		
	self	当前对象
	event	Event
	style	样式名称
	func	[可选] 回调函数
	fxLeft	[可选] 修正居左位置
	fxTop	[可选] 修正居上位置
*/
Mo.Color = function( self, event, style, func, fxLeft, fxTop ){

	//空函数
	if( typeof func != 'function' ) var func = function(){};
	
	//停止冒泡
	Mo.Event( event ).stop();
	
	///////////////////////

	//分配ID
    var id = "_color_";
	
	//对象已存，直接显示
	Mo( "#"+id ).remove();
	
	//创建对象
	Mo( document.body ).create( "div" , { "id" : id, "className" : style } );
	
	//滚动条位置
	var src = Mo.Toolkit.getScrollPosition();
	
	//对象视口位置
	var pos = Mo.Toolkit.getClinetRect( self );
	
	//修正位置
	fxLeft = fxLeft ? fxLeft : 0 ;
	fxTop  = fxTop  ? fxTop : 0 ;
	
	///////////////////////
	
    //设置样式
	Mo( "#"+id ).style( {
	
		"position" 	: "absolute",
		"left"	 	: pos.left + fxLeft + src.left +"px",
		"top" 		: pos.top + fxTop + src.top +"px",		
		"zIndex"	: "99999"
		
	}).bind( 'click' , function( index , event ){

		//停止冒泡
		Mo.Event( event ).stop();

	});

	//颜色字典
    var dict = ["#000000","#333333","#666666","#888888","#999999","#CCCCCC","#EEEEEE","#EFEFEF","#FAFAFA","#FFFFFF","#000033","#000066","#000099","#0000cc","#0000ff","#003300","#003333","#003366","#003399","#0033cc","#0033ff","#006600","#006633","#006666","#006699","#0066cc","#0066ff","#009900","#009933","#009966","#009999","#0099cc","#0099ff","#00cc00","#00cc33","#00cc66","#00cc99","#00cccc","#00ccff","#00ff00","#00ff33","#00ff66","#00ff99","#00ffcc","#00ffff","#330000","#330033","#330066","#330099","#3300cc","#3300ff","#333300","#333333","#333366","#333399","#3333cc","#3333ff","#336600","#336633","#336666","#336699","#3366cc","#3366ff","#339900","#339933","#339966","#339999","#3399cc","#3399ff","#33cc00","#33cc33","#33cc66","#33cc99","#33cccc","#33ccff","#33ff00","#33ff33","#33ff66","#33ff99","#33ffcc","#33ffff","#660000","#660033","#660066","#660099","#6600cc","#6600ff","#663300","#663333","#663366","#663399","#6633cc","#6633ff","#666600","#666633","#666666","#666699","#6666cc","#6666ff","#669900","#669933","#669966","#669999","#6699cc","#6699ff","#66cc00","#66cc33","#66cc66","#66cc99","#66cccc","#66ccff","#66ff00","#66ff33","#66ff66","#66ff99","#66ffcc","#66ffff","#990000","#990033","#990066","#990099","#9900cc","#9900ff","#993300","#993333","#993366","#993399","#9933cc","#9933ff","#996600","#996633","#996666","#996699","#9966cc","#9966ff","#999900","#999933","#999966","#999999","#9999cc","#9999ff","#99cc00","#99cc33","#99cc66","#99cc99","#99cccc","#99ccff","#99ff00","#99ff33","#99ff66","#99ff99","#99ffcc","#99ffff","#cc0000","#cc0033","#cc0066","#cc0099","#cc00cc","#cc00ff","#cc3300","#cc3333","#cc3366","#cc3399","#cc33cc","#cc33ff","#cc6600","#cc6633","#cc6666","#cc6699","#cc66cc","#cc66ff","#cc9900","#cc9933","#cc9966","#cc9999","#cc99cc","#cc99ff","#cccc00","#cccc33","#cccc66","#cccc99","#cccccc","#ccccff","#ccff00","#ccff33","#ccff66","#ccff99","#ccffcc","#ccffff","#ff0000","#ff0033","#ff0066","#ff0099","#ff00cc","#ff00ff","#ff3300","#ff3333","#ff3366","#ff3399","#ff33cc","#ff33ff","#ff6600","#ff6633","#ff6666","#ff6699","#ff66cc","#ff66ff","#ff9900","#ff9933","#ff9966","#ff9999","#ff99cc","#ff99ff","#ffcc00","#ffcc33","#ffcc66","#ffcc99","#ffcccc","#ffccff","#ffff00","#ffff33","#ffff66","#ffff99","#ffffcc"];

	//颜色容器
	Mo( "#"+id ).create( "ul" , { "border" : "0", "id" : id+"-table" } );
	
	//颜色值，来自自定义属性
	var selected = Mo( self ).attr( "_color_" );
	
	for( var i=0; i< dict.length; i++ ){
		
		(function(){

			//颜色值，转成大写
			var color = dict[i].toUpperCase();
	
			//创建元素
			Mo( "#"+id+"-table" ).create( "li" , { "border" : "0", "title" : color, "className" : ( selected == color ? "active" : "" ) } , true ).bind( 'click' , function( e ){
	
				/*
					回调函数
					color	颜色值
					self	当前对象
				*/
				func.call( self, color, self );
				
				//停止冒泡
				Mo.Event( e ).stop();
				
				//隐藏对象
				Mo( "#"+id ).hide();
				
				//保存颜色到自定义属性
				Mo( self ).attr( { "_color_" : color } );
	
			}).html( '<div style="background:'+ dict[i] +';"></div>' );

		})();
		
	}
	
	////////////////////////
	
	//空白处点击时隐藏
	Mo( document ).bind( 'click' , function( e ){
	
		var ele = Mo.Event( e ).element();
	
		if( self != ele ){

			//回调函数
			Mo( "#"+id ).hide();
		
		}

	});
	
}

///////////////////////////////////////

//将 16 进制颜色值转为 RGB 颜色值
Mo.Color.RGB = function( hexColor ){
	var a=hexColor;
	
	if(a.substr(0,1)=="#"){a=a.substring(1);}
	if(a.length!=6){return alert("请输入正确的颜色编码!");}
	a=a.toLowerCase();

	var b=new Array();
	for(x=0;x<3;x++){
		b[0]=a.substr(x*2,2);
		b[3]="0123456789abcdef";
		b[1]=b[0].substr(0,1);
		b[2]=b[0].substr(1,1);
		b[20+x]=b[3].indexOf(b[1])*16+b[3].indexOf(b[2]);
	}
	return b[20]+","+b[21]+","+b[22];
}

//将 RGB 颜色值转为 16 进制颜色值
Mo.Color.HEX = function( rgbColor ){
	var hexcode="#";
	
	for(x=0;x<3;x++){
	
		var n= rgbColor[x];
		
		if(n==""){n="0";}
		
		if(parseInt(n)!=n){
			return alert("请输入数字！");
		}
		if(a<0 && a>255){
			return alert("数字在0－255之间!");
		}
		var c="0123456789abcdef";
		var b="";
		var a=n%16;b=c.substr(a,1);
		a=(n-a)/16;hexcode+=c.substr(a,1)+b;
	}
	return hexcode.toUpperCase();
}

	
//产生一个随机颜色值
Mo.Color.rand = function(){
	var n = "0123456789abcdef";var c = "#"; for(var i=0;i<6;i++){ c = c+ n.charAt(Math.random()*n.length);} return c;
}

/*state*/
Mo.plugin.push("color");