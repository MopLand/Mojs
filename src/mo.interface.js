/*!
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*
*	$Id: mo.interface.js,v1.0 8:43 2011/2/11 Lay $
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}

//根据option的pid属性,过虑Select
/*
function filterSelect(obj,pid,name){
	var old=$(obj+"_old");	
	if(!old){
		old=$(obj).cloneNode(true);
		old.id=obj+"_old";
		old.style.display="none";
		document.body.appendChild(old);
	}
	
	var New=$(obj);
	if(name){
		New.length=1;
	}else{
		New.length=0;	
	}
	
	var len = old.length;
	for(var i=0;i<len;i++){
		if(pid==old[i].getAttribute("pid")){
			New[New.length]=new Option(old[i].text,old[i].value);
		}	
	}
	New.style.display="";
}
*/

/*
函数名称:	VerySelect_Float
函数作用:	创建浮动菜单选项(链接)
参数说明:	id			新菜单的ID
			Class		菜单引用的CSS类
			PClass		菜单父级的父级CSS类,用于装饰
			url			基础URL地址(不变的部分)
			value		参数(变动的部分)
			disabled	需要禁用项的值
*/
/*
Mo.Status=function(parent,id,baseUrl,array,value,mx,my){
	
	if( !$(id) ){
		
		mx = mx ? mx : 0;
		my = my ? my : 0;
	
		var obj = document.createElement("ul");
		obj.id=id;
		obj.className="select";
		
		var html = '';
		
		for( var key in array ){			
			if( key != value ){
				html += "<li><a href='"+baseUrl+key+'&amp;jump='+encodeURIComponent(location.href)+"' title='"+array[key]+"'>○ "+array[key]+"</a></li>";
			}else{
				html += "<li>● "+array[key]+"</li>";
				parent.innerHTML = array[key];
			}
		}
		
		obj.innerHTML = html;
		
		parent.appendChild(obj);
		
		(function(){
				  
			var o = obj;
			var p = parent;
				  
			p.onmouseover = function(){
				
				var pos=new getPosition(p);
				
				var x = pos.left;
				var y = pos.top;
				
				//定位
				with(o.style){
					left=x+mx+"px",
					top=y+my+"px",
					position="absolute",
					display="block"
				}
				
			}
			
			p.onmouseout = function(event){				
				o.style.display="none";
			}
				  
		})();
		
	}
	
}
*/

/*
	拖拉对象尺寸
	handle		按钮对象
	control		控制对象
	option		选项
	____________
	DELETE
*/
/*
Mo.Reszie=function(handle,control,option){
	
	if(typeof option!="object") var option={x:true,y:true};
	
	this._handle=handle;
	this._control=control;
	
	var self=this;
	
	this.callback=function(w,h){
		window.status='width:'+w+'px height:'+h+'px ';
	}
	this.onrelse=function(){
		
	}
	
	this.start=function(){
		this.drag();
	},
	
	this.drag=function(){
		var pos = getPosition(this._control);
		var left = pos.left-16;
		var top = pos.top+pos.height-16;
		var width = pos.width;
		
		var css="position:absolute;cursor:nw-resize;left:"+(left+width)+"px;top:"+top+"px";
		
		this._handle.style.cssText=css;
		this._handle.setAttribute("style",css);
		this._handle.unselectable="on";
		
		this._handle.onmousedown = function(){ self.event();}
	},

	this.event=function(){
		
		document.onmousemove = function(e){

			if(self._control){
				var x = 0;
				var y = 0;
				
				try{
					var doc = document.documentElement;
				}catch (e){
					var doc = document.body;
				}
				
				var e = e || window.event;
				var x  = (e.clientX || e.pageX) + doc.scrollLeft;
				var y  = (e.clientY || e.pageY) + doc.scrollTop;
		
				var pos=getPosition(self._control);
				var w = x-pos.left;
				var h = y-pos.top;
				
				if(w<80 || h<80) return false;
				
				self._control.style.width  = w+"px";   
				self._control.style.height = h+"px";   
				
				self.drag();
				self.callback(w,h);
			}   
		}   

		document.onmouseup = function(e){   
			//self._control=null;
			document.onmousemove=null;			
		}   
	}
	
}
*/

/*
	滚动表头
	thead	表头对象
*/
/*
Mo.Thead = function(thead){
	var thead=getObject(thead);
		
	var pos=getPosition(thead);
	var doc=Mo.getDocument();
	
	var top=0;
	if(pos.attr["top"]){
		top=pos.attr["top"].value;
	}else{
		top=pos.top;
		thead.setAttribute("top",pos.top);
	}
	
	if(doc.scrollTop>=top){
		thead.style.top			=	(doc.scrollTop)+'px';
		thead.style.position		=	'absolute';
	}else{
		thead.style.top			=	'0px';
		thead.style.position		=	'relative';
	}
}
*/

/*
	浏览器交互 收藏和设置首页
	
	cmd		命令
				favorite		加入收藏
				homepage	设置首页
				
	param	参数				
	func		回调函数				
*/
Mo.Command = function( cmd , param , func ){

	//空函数
	if( typeof func != 'function' ) var func = function(){};
	if( typeof param != 'object' ) var param = {"title":document.title,"href":location.href};
	
	var text = '';

	switch( cmd ){
	
		//加入收藏
		case "favorite":
		
		    try{ 
		    
		        if ( window.sidebar && 'object' == typeof( window.sidebar ) && 'function' == typeof( window.sidebar.addPanel ) ){  
		            window.sidebar.addPanel( param.title, param.href, '');  
		        }  
		        else if ( document.all && 'object' == typeof( window.external ) ){  
		            window.external.addFavorite( param.href, param.title );  
		        }  
		        else {  
		            alert('您使用的浏览器不支持此功能，请按 Ctrl + D 键加入收藏');  
		        }
		        
		    }catch(e){  
		        alert('您使用的浏览器不支持此功能，请按 Ctrl + D 键加入收藏');  
		    }
			
		break;
		
		//设置首页
		case "homepage":
		
			if( Mo.Browser.msie ){
				//new link
				obj=document.createElement("a");
				obj.setAttribute("href","javascript:void(0);");
				document.body.appendChild(obj);

				obj.style.behavior='url(#default#homepage)';
				obj.sethomepage(param.href);
			}else{
				try{
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				}catch(e){  
				   text = "此操作被浏览器拒绝！<br />请在浏览器地址栏输入“about:config”并回车<br />然后将[signed.applets.codebase_principal_support]设置为'true'";
				}
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
				prefs.setCharPref('browser.startup.homepage',param.href);
			}
			
		break;
	}
	
	//回调
	func( text );
	
	return void(0);
}

/*
	浏览器交互 复制到剪贴板
	
	text		内容
	func		回调函数
				返回 true 或 false
*/
Mo.Clipboard = function( text , func ){

	//空函数
	if( typeof func != 'function' ) var func = function(){};

	//IE
	if (window.clipboardData){
	
		window.clipboardData.setData("Text", text);
		
	}else if (window.netscape){
	
		try{  
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
		}catch (e){ 
			throw new SecurityException(SecurityException.ERROR,"");
		}
		
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if (!clip) return;

		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans) return;
		
		trans.addDataFlavor('text/unicode');
		
		var str = new Object();
		var len = new Object();
		
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		
		var copytext=text;
		
		str.data=copytext;
		
		trans.setTransferData("text/unicode",str,copytext.length*2);
		
		var clipid=Components.interfaces.nsIClipboard;
		if (!clip) return false;
		
		clip.setData(trans,null,clipid.kGlobalClipboard);
		
	}
	
	//回调
	func( text );
	
	return false;
}

/*state*/
Mo.plugin.push("interface");