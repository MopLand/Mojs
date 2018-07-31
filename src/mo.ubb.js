/*!
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*
*	#UBB 扩展，包括UBB编辑器、UBB解析等#
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}

/**********/

Mo.UBB = {

	//版本号
	version:"2.0",

	//拖动对象
	drag:null,

	//配置项
	config:null,
	
	get : function(id){ return document.getElementById(id);},
	
	bind:function( self, id ){
		
		//////////////////////////////////
		
		//空白处点击时隐藏
		/*
		Mo( document ).bind( 'click' , function( ele, index , event ){
	
			var ele = Mo.Event( event ).element();
			
			console.log( ele );
	
			if( self != ele ){
	
				//回调函数
				Mo( "#"+id ).hide();
	
			}
	
		});
		*/
		//////////////////////////////////
		
		var pos = Mo( self ).position();
		
		//设置样式
		Mo( "#"+id ).bind( 'click' , function( e ){
	
			Mo( this ).hide();
	
		}).style( {
	
			"position" 	: "absolute",
			"left"	 	: pos.left +"px",
			"top" 		: pos.top  +"px"
	
		}).toggle();
	},
	
	//显示工具栏
	show:function( config ){
		
		var obj = config["id"];
		var cfg = config["toolbar"] ? config["toolbar"] : [];
		
		this.config = cfg;
	
		var html='<div class="ubb">';
		
		//菜单 [菜单名称，样式名称，对象ID]
		var array=["字体","font","fontface","大小","size","format","颜色","color","color"];
		for(var i=0;i<array.length;i+=3){
			if( Mo.Array( cfg ).indexOf(array[i+1]) > -1 || cfg.length==0){
				html+='<img src="'+Mo.store.host+'image/spacer.gif" alt="'+array[i]+'" class="ubb-img img-'+array[i+1]+'" unselectable="on" onclick="Mo.UBB.bind(this,\''+array[i+2]+'\');" />';
			}
		}
		
		//字体
		html+='<div id=fontface class="ubb-menu" style="display:none;"><ul>';
		var array=["Arial","Arial Black","Impact","Verdana","宋体","黑体","楷体_GB2312","幼圆","Microsoft YaHei"];
		for(var i=0;i<array.length;i++){
			html+='<li onclick="Mo.UBB.face(\''+obj+'\',\''+array[i]+'\');" style="font-family:'+array[i]+'" unselectable="on" onfocus="this.blur();">'+array[i]+'</li>';
		}
		html+='</ul></div>';
		
		//字号
		html+='<div id=format class="ubb-menu" style="display:none;"><ul>';
		for(var i=1;i<=6;i++){
			html+='<li onclick="Mo.UBB.size(\''+obj+'\',\''+i+'\');" unselectable="on" onfocus="this.blur();"><font size="'+i+'" unselectable="on">'+i+'</font></li>';
		}
		html+='</ul></div>';
		
		//颜色
		html+='<div id=color class="ubb-menu ubb-color" style="display:none;"><ul>';
		var array=["黑色","black","灰色","gray","茶色","maroon","红色","red","紫色","purple","紫红","fuchsia","绿色","green","亮绿","lime","橄榄","olive","黄色","yellow","深蓝","teal","蓝色","blue","浅绿","aqua","粉红","pink","橙色","orange","褐色","brown"];
		for(var i=0;i<array.length;i+=2){
			html+='<li onclick="Mo.UBB.color(\''+obj+'\',\''+array[i+1]+'\');" style="color:'+array[i+1]+'" unselectable="on">'+array[i]+'</li>';
		}
		html+='</ul></div>';
		
		//表情
		html+='<div id="smile" class="ubb-menu ubb-smile" style="display:none;"><ul>';
		for(var i=0; i<=103; i++){
			html+='<li onclick="Mo.UBB.smile(\''+obj+'\',\''+i+'\');" unselectable="on"><img src="'+Mo.store.host+'image/smile/'+i+'.gif" alt="'+i+'" unselectable="on" /></li>';
		}
		html+='</ul></div>';
		
		//代码
		html+='<div id="code" class="ubb-menu" style="display:none;"><ul>';
		var array=["JavaScript","js","XML","xml","VB","vb","SQL","sql","Java","java","CSS","css","PHP","php"];
		for(var i=0;i<array.length;i+=2){
			html+='<li onclick="Mo.UBB.code(\''+obj+'\',\''+array[i+1]+'\');" unselectable="on">'+array[i]+'</li>';
		}
		html+='</ul></div>';
		
		//修饰
		var array=["加粗","bold","斜体","italic","下划线","under","左对齐","left","居中","center","右对齐","right"];
		for(var i=0;i<array.length;i+=2){
			if(Mo.Array( cfg ).indexOf(array[i+1]) > -1 || cfg.length==0){
				html+='<img src="'+Mo.store.host+'image/spacer.gif" alt="'+array[i]+'" class="ubb-img img-'+array[i+1]+'" onclick="Mo.UBB.'+array[i+1]+'(\''+obj+'\')" unselectable="on" />';
			}
		}
		
		//菜单 [菜单名称，样式名称，对象ID]
		var array=["表情","smile","smile","代码","code","code"];
		for(var i=0;i<array.length;i+=3){
			if(Mo.Array( cfg ).indexOf(array[i+1]) > -1 || cfg.length==0){
				html+='<img src="'+Mo.store.host+'image/spacer.gif" alt="'+array[i]+'" class="ubb-img img-'+array[i+1]+'" unselectable="on" onclick="Mo.UBB.bind(this,\''+array[i+2]+'\');" />';
			}
		}
		
		//功能
		var array=["链接","link","图片","image","FLASH","flash","视频","video","音乐","mp3","引用","quote","仅会员浏览","hidden","转换复制的HTML","html"];
		for(var i=0;i<array.length;i+=2){
			if(Mo.Array( cfg ).indexOf(array[i+1]) > -1 || cfg.length==0){
				html+='<img src="'+Mo.store.host+'image/spacer.gif" alt="'+array[i]+'" class="ubb-img img-'+array[i+1]+'"  onclick="Mo.UBB.'+array[i+1]+'(\''+obj+'\')" unselectable="on" />';
			}
		}		
		
		//缩放
		var array=["最佳尺寸/原始尺寸","zoom","放大输入框","zoomin","缩小输入框","zoomout","关于","about"];
		for(var i=0;i<array.length;i+=2){
			if(Mo.Array( cfg ).indexOf(array[i+1]) > -1 || cfg.length==0){
				html+='<img src="'+Mo.store.host+'image/spacer.gif" alt="'+array[i]+'" class="ubb-img img-'+array[i+1]+'"  onclick="Mo.UBB.'+array[i+1]+'(\''+obj+'\')" unselectable="on" />';
			}
		}
		
		//统计
		if( Mo.Array( cfg ).indexOf("stat") > -1 || cfg.length==0 ){
			html+='<span id="'+obj+'_stat" class="ubb-stat"></span>';
			
			Mo.reader(function(){
				//var self = obj;
				
				Mo("#"+obj).bind('keyup',function(){					
					Mo("#"+obj+'_stat').html( "字数:" + Mo.String( this.value ).length() );					
				});
				
			});
		}
		
		html+='</div>';
		
		Mo.write(html);
	},
	
	//字体
	face:function( obj, sel ){
		var s="[face="+sel+"]";
		var e="[/face]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//字号
	size:function( obj, sel ){
		var s="[size="+sel+"]";
		var e="[/size]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//代码
	code:function(obj,sel){
		var s="[code]";
		var e="[/code]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//颜色
	color:function(obj,sel){
		var s="[color="+sel+"]";
		var e="[/color]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//表情
	smile:function(obj,sel){
		var s="[smile]"+sel;
		var e="[/smile]";
		
		Mo.UBB.insert(obj,s,e,false);
	},
	
	//代码
	code:function(obj,sel){
		var s="[code="+sel+"]\n";
		var e="\n[/code]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//粗体字
	bold:function(obj){
		var s="[b]";
		var e="[/b]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//斜体字
	italic:function(obj){
		var s="[i]";
		var e="[/i]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//下划线
	under:function(obj){
		var s="[u]";
		var e="[/u]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//左对齐
	left:function(obj){
		var s="[align=left]";
		var e="[/align]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//居中
	center:function(obj){
		var s="[align=center]";
		var e="[/align]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	//右对齐
	right:function(obj){
		var s="[align=right]";
		var e="[/align]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	link:function(obj){
		var t = prompt("请输入链接要显示的文字,只能包含中文,英文字母,或中英文混合","请点击这里");
		if(!t) return;
		var url = prompt("请输入URL地址","http://");
		
		if(!url)return;
		
		Mo.UBB.get(obj).value+=(!t)?"[url]"+url+"[\/url]":"[url="+url+"]"+t+"[\/url]";
		Mo.UBB.get(obj).focus();
	},
	
	flash:function(obj){
		var a = prompt("请输入Flash的URL地址","http://");
		if(!a) return;
		if(!/^http/.test(a)) {alert("URL地址格式不对");return;}
		var b = prompt("请输入Flash高度和宽度","350,200");
		var c = "[flash="+b+"]"+a+"[\/flash]";

		Mo.UBB.get(obj).value += c;
		Mo.UBB.get(obj).focus();
	},
	
	mp3:function(obj){
		var a = prompt("请输入音频文件的URL地址","http://");
		if(!a) return;
		if(!/^http/.test(a)) {alert("URL地址格式不对");return;}
		var b = prompt("请输入音频文件播放器高度和宽度","220,40");
		var c = "[mp3="+b+"]"+a+"[\/mp3]";

		Mo.UBB.get(obj).value += c;
		Mo.UBB.get(obj).focus();
	},
	
	hidden:function(obj){
		var s="[hidden]";
		var e="[/hidden]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	image:function(obj){
		var a = prompt("请输入图片的URL地址","http://");
		if(!a) return;
		if(!/^http/.test(a)) {alert("URL地址格式不对");return;}
		var c = "[img]"+a+"[\/img]";

		Mo.UBB.get(obj).value += c;
		Mo.UBB.get(obj).focus();
	},
	
	video:function(obj){
		var autostart = "true";
		var a = prompt("请输入视频文件地址","");
		if(a == null || a == "" || a == '')
		return;
		
		var b = prompt("请输入视频文件显示大小","400,250");
		if(b == null || b == "" || b == ''){
			b = "400,250";
		}
		
		var c = prompt("请输入是否自动播放,默认为自动播放(yes自动，no不自动播放）","yes");
		if(c != "yes"){
			autostart = "false";
		}
		var strvideo = "[embed="+b+","+autostart+"]"+a+"[/embed]";

		Mo.UBB.get(obj).value += strvideo;
		Mo.UBB.get(obj).focus();
	},
	
	quote:function(obj){
		var s="[quote]";
		var e="[/quote]";
		
		Mo.UBB.insert(obj,s,e);
	},
	
	zoom:function(obj){
		var o = Mo("#"+obj).item(0);

		if(o.scrollHeight > o.offsetHeight){
			o.style.height = o.scrollHeight+"px";
		}else{
			o.style.height = "auto";	
		}
	},
	
	zoomin:function(obj){
		var o = Mo("#"+obj).item(0);
		o.rows+=5;
	},
	
	zoomout:function(obj){
		var o = Mo("#"+obj).item(0);
		if(o.rows>=10){
			o.rows-=5;
		}
	},
	
	about:function(obj){
		alert( 'VeryIDE UBBeditor '+Mo.UBB.version+' \n\nhttp://www.veryide.com/' );		
	},
	
	html:function(obj){
		
		var ifr=obj+"_iframe";
		
		if(!Mo.UBB.get(ifr)){
			var box=document.createElement('iframe');
				box.id=ifr;
				box.name=ifr;
				box.style.width="0px";
				box.style.height="0px";
				box.style.border="0";
				document.body.appendChild(box);
				
			var box=window.frames[ifr].document;
				box.designMode="On";
				box.open();
				box.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\
				<html xmlns=\"http://www.w3.org/1999/xhtml\">\
				<head>\
				<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\
				<title>测试</title>\
				</head>\
				<body >\</body>\
				</html>");
				
				box.close();
		}
		
		var box=window.frames[ifr].document;
			
			box.execCommand("SelectAll",false,null);
			box.execCommand("Delete",false,null);
			try {
				box.execCommand("paste",false,null);
			} catch (e) {
				alert("Sorry!\n\n当前浏览器暂不支持粘贴操作");
				return false;
			}
			
			var str=box.body.innerHTML;
			if(str){
				str = str.replace(/\r/g,"");
				//str = str.replace(/on(load|click|dbclick|mouseover|mousedown|mouseup)="[^"]+"/ig,"");
				str = str.replace(/on(error|load|unload|resize|blur|change|click|dblclick|focus|keydown|keypress|keyup|mousewheel|mousemove|mousedown|mouseout|mouseover|mouseup|select)="[^"]+"/ig,"");
				str = str.replace(/<script[^>]*?>([\w\W]*?)<\/script>/ig,"");
				str = str.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/ig,"\n[url=$1]$2[/url]\n");
				str = str.replace(/<font[^>]+color=([^ >]+)[^>]*>(.*?)<\/font>/ig,"\n[color=$1]$2[/color]\n");
				str = str.replace(/<img[^>]+src="([^"]+)"[^>]*>/ig,"\n[img]$1[/img]\n");
				str = str.replace(/<([\/]?)b>/ig,"[$1b]");
				str = str.replace(/<([\/]?)strong>/ig,"[$1b]");
				str = str.replace(/<([\/]?)u>/ig,"[$1u]");
				str = str.replace(/<([\/]?)i>/ig,"[$1i]");
				str = str.replace(/&nbsp;/g," ");
				str = str.replace(/&amp;/g,"&");
				str = str.replace(/&quot;/g,"\"");
				str = str.replace(/&lt;/g,"<");
				str = str.replace(/&gt;/g,">");
				str = str.replace(/<br>/ig,"\n");
				str = str.replace(/<[^>]*?>/g,"");
				str = str.replace(/\[url=([^\]]+)\]\n(\[img\]\1\[\/img\])\n\[\/url\]/g,"$2");
				str = str.replace(/\n+/g,"\n");
				
				Mo.UBB.get(obj).value += str;
				
			}else{
				alert('无需转换的HTML内容');	
			}
		
	},
	
	getSel:function()
	{
		return window.getSelection ? window.getSelection() : document.selection;
	},
	getRng:function()
	{
		var sel=this.getSel(),rng;
		
		try{//标准dom
			rng = sel.rangeCount > 0 ? sel.getRangeAt(0) : (sel.createRange ? sel.createRange() : document.createRange());
		}catch (ex){}
		if(!rng)rng = document.all ? document.body.createTextRange() : document.createRange();
		return rng;
	},
	
	/*
		obj 对象
		s	起始标签
		e	结束标签
		f	是否将光标移动到标签中，默认 true
	*/
	insert:function(obj,s,e,f){
		
		var obj = Mo("#"+obj).item(0);

		function strlen(str) {
			return (document.all && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
		}
		
		function checkFocus(obj) {
			//var obj = typeof wysiwyg == 'undefined' || !wysiwyg ? $('postform').message : editwin;
			if(!obj.hasfocus) {
				obj.focus();
			}
		}
		

		function isUndefined(variable) {
			return typeof variable == 'undefined' ? true : false;
		}

		
		/*
		$(obj).value += s + e;
		$(obj).focus();
		return false;
		*/
		
		//$(obj).focus();
		
		//obj = $('postform').message;
		
		
		/*
		var txt = s + e;
		
		selection = document.selection;
		checkFocus(obj);
		if(!isUndefined(obj.selectionStart)) {
			var opn = obj.selectionStart + 0;
			obj.value = obj.value.substr(0, obj.selectionStart) + txt + obj.value.substr(obj.selectionEnd);
		} else if(selection && selection.createRange) {
			var sel = selection.createRange();
			sel.text = txt;
			sel.moveStart('character', -strlen(txt));
		} else {
			obj.value += txt;
		}
		*/
		
		
		//checkFocus( $(obj) );
		
		/*
		var selection = document.selection;
		
		if( typeof obj.selectionStart != 'undefined' ) {
			var opn = obj.selectionStart + 0;
			obj.value = obj.value.substr(0, obj.selectionStart) + s + e + obj.value.substr(obj.selectionEnd);
		}
		*/
		
/*		var range = this.getRng();
		
		range.text = s+e;
		
		return;
*/		
/*		var ubbLength=obj.value.length; 
		obj.focus(); 
		if(typeof document.selection !="undefined"){ 
			document.selection.createRange().text=s+e;
			
			alert('');
		}else{
			var text = obj.value.substr(obj.selectionStart, obj.selectionEnd-1);
			alert(obj.selectionStart +'  ' + obj.selectionEnd-1)
			alert(text);
			obj.value=obj.value.substr(0,obj.selectionStart) + s + text + e + obj.value.substring(obj.selectionEnd,ubbLength); 
		}
		
		return;
		
		
		
*/		


		/*
 		var txa=obj; 
        txa.focus(); 
        var strEnd=markup.replace(/\[/ig,'[/'); 
        if (strEnd.indexOf('=')>-1){ 
            strEnd=strEnd.replace(/(.*?)=.*?]/,']'); 
        }
		*/
		
		obj.focus();
		
		// && document.selection.type== "Text"
        if( document.selection ){	// IE, Opera 
						
			var bm = document.selection.createRange().getBookmark();  
			
			var sel = obj.createTextRange();  
			
			sel.moveToBookmark(bm);  
			
			var sleft = obj.createTextRange();  
			
				sleft.collapse(true);  
			
				sleft.setEndPoint("EndToStart", sel);  
			
			//得到插入点
			//alert(sleft.text);
			//alert(sleft.text.replace(/[\n\r]/g,'_').length);
			//alert(sleft.text.length);
			obj.selectionStart = strlen(sleft.text);  
			
			obj.selectionEnd = sleft.text.length + sel.text.length;  
			
			obj.selectedText = sel.text;  
			
			/***************/
			
			var oStr = document.selection.createRange(); 
			
			//选中字符串长度
			var leng = strlen(oStr.text);
			oStr.text = s + oStr.text + e;
			
			/***************/
			
			//选中字符
			var start = obj.selectionStart+strlen(s);
			var end = leng;
						
			/*
			var range = obj.createTextRange();
			
			var l = obj.value.length;
			
			range.moveStart("character",-l);
			range.moveEnd("character",-l);
			
			//选中字符
			range.moveStart("character",obj.selectionStart+strlen(s));
			range.moveEnd("character",leng);
			range.select();
			*/
			
				
        } else if( window.getSelection && obj.selectionStart>-1 ) {	// Netscape 
            var st = obj.selectionStart; 
            var ed = obj.selectionEnd; 
				obj.value=obj.value.substring(0,st) + s + obj.value.substring(st,ed) + e + obj.value.slice(ed); 
				
				//选中字符
				//obj.setSelectionRange(st+strlen(s), ed+strlen(s));
				//obj.focus();
				
				//选中字符
				var start = st+strlen(s);
				var end = ed+strlen(s);

			   
        } else {
			
            obj.value += s+e;
			obj.focus();
        } 
		
		//obj.focus();
		
		//不移动光标
		if( f === false ) return;
		
		//移动到起始标签
		if( obj.createTextRange ){//IE浏览器
			var length = obj.value.length;
			var range = obj.createTextRange();
			range.moveStart("character",-length);
			range.moveEnd("character",-length);
			range.moveStart("character", start);
			range.moveEnd("character",end);
			range.select();
		}else{
			obj.setSelectionRange(start, end);
			obj.focus();
		}
		
		/*
		return;
		
		selection = document.selection;
		
		if(!obj.hasfocus) {
			obj.focus();
		}
		
		//checkFocus(obj);
		if( typeof obj.selectionStart != 'undefined' ) {	//FF
			
			//var opn = obj.selectionStart + 0;
			var text = obj.value.substr(obj.selectionStart, obj.selectionEnd);
			obj.value = obj.value.substr(0, obj.selectionStart) + s + text + e + obj.value.substr(obj.selectionEnd);
			
			//obj.select();
			
			//obj.selectionStart = obj.selectionStart + strlen(s);   
			//obj.selectionEnd = obj.selectionStart + strlen(s) + strlen(text);   
			
		} else if(selection && selection.createRange) {	//IE
			
			var sel = selection.createRange();
			sel.text = s + sel.text + e;
			sel.moveStart('character', -strlen(sel.text));
			
			//obj.sel.select()
			
			//alert('');
			
		} else {
			
			obj.value += s + e;
			
		}
		
		*/
		
		
		/*		
		if ((document.selection)&&(document.selection.type == "Text")){
			var range = document.selection.createRange();
			var text = range.text;
			range.text = s + text + e;
			range.moveStart('character', -strlen(range.text));
		}else{
		
			$(obj).value += s + e;
			return false;
		}
		*/		
		
	}
}

/*state*/
Mo.plugin.push("ubb");