/*!
*	(C)2009-2015 VeryIDE
*	http://www.veryide.com/
*	Mo.js 核心框架
*	$Id: mo.js 2015/10/22 Lay $
*/

(function( win, doc ){

	//实例化选择器
	var Mo = function ( selector, context ){		
		return new Mo.init( selector, context );
	}
	
	/*
		Mo版本号
	*/
	Mo.version = "1.4";
	
	/*
		最后更新时间
	*/	
	Mo.build = 20151022;
	
	/*
		临时对象
	*/
	Mo.store = new Object();
	
	/*
		插件对象
	*/
	Mo.plugin = [];
	
	/*
		当前 Unix 时间戳
	*/
	Mo.time = new Date().getTime();
	
	/*
		全局变量生成
	*/
	Mo.start = function(){
	
		//所有 js 元素
		var tags = document.getElementsByTagName("script");
		
		//取当前 js 地址
		var path = tags[tags.length-1].getAttribute('src',2);
		
		//取目录地址
		var base = path ? path.substring(0,path.lastIndexOf("/")+1) : null;
		
		//Mo.js 所在目录
		Mo.base = base;
		
		/*********************/

		/*
			浏览器
		*/
		Mo.Browser = {
			msie : false,
			opera : false,
			safari : false,			
			chrome : false,			
			firefox : false
		};

		/*
			浏览器版本
		*/
		var nav = navigator;
		var uat = nav.userAgent;
		var reg = '';
		
		switch ( nav.appName ){
			
			case "Microsoft Internet Explorer":{			
				Mo.Browser.name = "ie";				
				Mo.Browser.msie = true;
				reg = /^.+MSIE (\d+\.\d+);.+$/;				
			break;
			
			}default:{
				if ( uat.indexOf("Chrome") != -1 ){
					Mo.Browser.name = "chrome";
					Mo.Browser.chrome=true;					
					reg = /^.+Chrome\/([\d.]+?)([\s].*)$/ig;
					
				}else if ( uat.indexOf("Safari") != -1 ){
					Mo.Browser.name = "safari";
					Mo.Browser.safari=true;
					reg = /^.+Version\/([\d\.]+?) (Mobile.)?Safari.+$/;
					
				}else if ( uat.indexOf("Opera") != -1 ){
					Mo.Browser.name = "opera";
					Mo.Browser.opera=true;
					reg = /^.{0,}Opera\/(.+?) \(.+$/;
					
				}else{
					Mo.Browser.name = "firefox";
					Mo.Browser.firefox=true;
					reg = /^.+Firefox\/([\d\.]+).{0,}$/;
					
				}
			}
			break;
		}
		
		/*
			客户端版本
		*/
		Mo.Browser.version = uat.replace(reg, "$1");

		/*
			客户端语言
		*/		
		Mo.Browser.lang = ( !Mo.Browser.msie ? nav.language : nav.browserLanguage ).toLowerCase();
		
		/*
			是否为移动设备
		*/
		Mo.Browser.mobile = /(iPhone|iPad|iPod|Android)/i.test( uat );
		
		/*
			文档根元素
		*/
		Mo.document = (document.compatMode && document.compatMode !="BackCompat" && ! uat.toLowerCase().indexOf('webkit')>-1 ) ? document.documentElement : document.body;
		
		///////////////////////
		
		//扩展 outerHTML 方法
		if(typeof HTMLElement !== "undefined" && !("outerHTML" in HTMLElement.prototype)) { 
		    HTMLElement.prototype.__defineGetter__("outerHTML",function(){ 
			var a=this.attributes, str="<"+this.tagName, i=0;for(;i<a.length;i++) 
			if(a[i].specified) 
			    str+=" "+a[i].name+'="'+a[i].value+'"'; 
			if(!this.canHaveChildren) 
			    return str+" />"; 
			return str+">"+this.innerHTML+"</"+this.tagName+">"; 
		    }); 
		    HTMLElement.prototype.__defineSetter__("outerHTML",function(s){ 
			var r = this.ownerDocument.createRange(); 
			r.setStartBefore(this); 
			var df = r.createContextualFragment(s); 
			this.parentNode.replaceChild(df, this); 
			return s; 
		    }); 
		    HTMLElement.prototype.__defineGetter__("canHaveChildren",function(){ 
			return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase()); 
		    }); 
		}
		
		//修正Node的DOM 
		if(window.Node){
			/* 
			IE5 MacIE5 Mozilla Konqueror2.2 Opera5 
			Node.contains yes yes no no yes 
			Node.replaceNode yes no no no no 
			Node.removeNode yes no no no no 
			Node.children yes yes no no no 
			Node.hasChildNodes yes yes yes yes no 
			Node.childNodes yes yes yes yes no 
			Node.swapNode yes no no no no 
			Node.currentStyle yes yes no no no 
			*/ 
			
			//替换指定节点
			Node.prototype.replaceNode=function(Node){
				this.parentNode.replaceChild( Node, this ); 
			}
			
			//删除指定节点
			Node.prototype.removeNode=function(Children){
				if( Children ) 
					return this.parentNode.removeChild(this); 
				else{ 
					var range=document.createRange(); 
					range.selectNodeContents(this); 
					return this.parentNode.replaceChild(range.extractContents(),this); 
				} 
			} 
			
			/*
			Node.prototype.swapNode=function(Node){
				var nextSibling=this.nextSibling; 
				var parentNode=this.parentNode; 
				Node.parentNode.replaceChild(this,Node); 
				parentNode.insertBefore(Node,nextSibling); 
			}
			*/
			
			//交换节点
			/*
			Node.prototype.swapNode = function(Node){
			    var base            = Node.parentNode;
			    var next            = Node.nextSibling;
			    var replaced        = this.parentNode.replaceChild( Node, this );
			    next ? base.insertBefore( replaced, next ) : base.appendChild( replaced );
			    return this;
			}
			*/
			Node.prototype.swapNode = function(Node){
			    var base            = this.parentNode;
			    var next            = this.nextSibling;
			    var replaced        = Node.parentNode.replaceChild( this, Node );
			    
			    //向后移动
			    if( replaced == next ){
			    	base.insertBefore( next, this );
			    	
			    //向前移动
			    }else if( next ){
			    	base.insertBefore( replaced, next );
			    	
			    //最后一个向前移动
			    }else{
				    base.appendChild( replaced );
			    }
			    
			    return this;
			}
			
		} 
		
	}
	
	Mo.start();
	
	/*********************/
	
	//获取ID对象
	Mo.$ = function(id){ return document.getElementById(id);};

	/*
		页面DOM载入后执行
		func	函数块
	*/	
	Mo.ready = function( func ) {
		
		if ( Mo.Browser.msie ) {
			
			//随机10位ID
			var rnd = Mo.random(10);
			
			//创建新数组
			if( !Mo.store.dri ) Mo.store.dri = [];
			
			Mo.store.dri[rnd] = setInterval(function() {
			
				try {
					// throws an error if doc is not ready
					document.documentElement.doScroll('left');

					clearInterval(Mo.store.dri[rnd]);
					
					Mo.store.dri[rnd] = null;
					
					//回调
					func( new Date().getTime() - Mo.time );
					
				} catch (ex) {
				
				}
				
			}, 1);
		
		}else{
			document.addEventListener("DOMContentLoaded", function(){ func( new Date().getTime() - Mo.time ); } , false);
		}
		
	}

	/*
		页面完全载入后执行
		func	函数块
	*/	
	Mo.reader = function( func ){
		Mo( window ).bind( 'load' , function(){ func( new Date().getTime() - Mo.time ); } );
	};

	/*
		页面改变后执行
		func	函数块
	*/	
	Mo.resize = function( func ){
		Mo( window ).bind( 'resize' , func );
	}
	
	/*********************/
	
	/*
		格式化日期
		format		格式字符串
		datetime	日期，默认为当前日期
	*/
	Mo.date = function( format, datetime ){
		var str = format;
		var now = datetime ? ( Mo.Validate.Number(datetime) ? new Date(parseInt(datetime) * 1000) : datetime ) : new Date();
		var y = now.getFullYear(),
				m = now.getMonth()+1,
				d = now.getDate(),
				h = now.getHours(),
				i = now.getMinutes(),
				s = now.getSeconds();

		str = str.replace('yy',y.toString().substr(y.toString().length-2));
		str = str.replace('y',y);
		str = str.replace('mm',('0'+m).substr(m.toString().length-1));
		str = str.replace('m',m);
		str = str.replace('dd',('0'+d).substr(d.toString().length-1));
		str = str.replace('d',d);
		str = str.replace('hh',('0'+h).substr(h.toString().length-1));
		str = str.replace('h',h);
		str = str.replace('ii',('0'+i).substr(i.toString().length-1));
		str = str.replace('i',i);
		str = str.replace('ss',('0'+s).substr(s.toString().length-1));
		str = str.replace('s',s);

		return str;
	}
	
	/*
		获取随机字符
		length	长度 
		upper		是否允许大写字母 
		lower		是否允许小写字母 
		number	是否允许数字
	*/
	Mo.random = function( length, upper, lower, number ){

		if( !upper && !lower && !number ){
			upper = lower = number = true;
		}
		
		var a = [
			["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
			["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
			["0","1","2","3","4","5","6","7","8","9"]
		];
			
		//临时数组
		var b = [];
		
		//临时字串 
		var c = "";

		b = upper ? b.concat(a[0]) : b;
		b = lower ? b.concat(a[1]) : b;
		b = number ? b.concat(a[2]) : b;

		for (var i=0;i<length;i++){ 
			c += b[ Math.round(Math.random()*(b.length-1)) ];
		}

		return c; 
	}

	/*
		返回两个数值之间的一个随机值
		min	最小值
		max	最大值
	*/
	Mo.between = function( min, max ){
		return Math.round(min+(Math.random()*(max-min)));
	}
	
	/*
		输出内容到页面
		html	源代码
	*/
	Mo.write = function(){
	
		//遍历参数
		for( var i = 0; i < arguments.length; i++ ){
			document.write( arguments[i] );
		}	
		
	}	
	
	/*
		解析URL地址
		myURL.file;     // = 'index.html'  	
		myURL.hash;     // = 'top'  	
		myURL.host;     // = 'abc.com'  	
		myURL.query;    // = '?id=255&m=hello'  	
		myURL.params;   // = Object = { id: 255, m: hello }  	
		myURL.path;     // = '/dir/index.html'  	
		myURL.segments; // = Array = ['dir', 'index.html']  	
		myURL.port;     // = '8080'  	
		myURL.protocol; // = 'http'  	
		myURL.source;   // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top' 
	*/	
	Mo.url = function( url ) {  	
		var a =  document.createElement('a');  	
		a.href = url;  	
		return {  	
			source: url,	
			protocol: a.protocol.replace(':',''),	
			host: a.hostname,	
			port: a.port,  	
			query: a.search,  	
			params: (function(){  	
				var ret = {},  	
					seg = a.search.replace(/^\?/,'').split('&'),  	
					len = seg.length, i = 0, s;  	
				for (;i<len;i++) {  	
					if (!seg[i]) { continue; }  	
					s = seg[i].split('=');  	
					ret[s[0]] = s[1];  	
				}  	
				return ret;  
			})(),  
	
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1], 	
			hash: a.hash.replace('#',''),  	
			path: a.pathname.replace(/^([^\/])/,'/$1'),  	
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  	
			segments: a.pathname.replace(/^\//,'').split('/')  	
		};  	
	}
		
	/*
		获取或设置Cookie
		key	名称
		value	值
		days	多少天有效
		domain	域
		path	路径
	*/
	/*
	Mo.cookie = function( key , value , days , domain , path ){
	
		//value 未定义则为获取值
		if( typeof value == "undefined" ){
			var str="";
			var arr = document.cookie.replace(/%25/g,"%").replace(/%5F/g,"_").match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
			if(arr !=null){
				try{
					str=decodeURIComponent(arr[2]);
				}catch(e){
					str=arr[2];
				}
			}
	
			return str;
			
		//设置cookie值
		}else{
		
			var cookies=key.replace("_","%5F") + "=" + encodeURIComponent(value)+ "; ";
			if (days){
				var dExpire = new Date();
				dExpire.setTime(dExpire.getTime()+parseInt(days*24*60*60*1000));
				cookies += "expires=" + dExpire.toGMTString()+ "; ";
			}
			domain ? cookies += "domain="+domain+";" : "";
			path ? cookies += "path="+path+";" : "/";
			document.cookie = cookies;
		
		}	

	}
	
	*/
	
	/**
	 * @author 	Maxime Haineault (max@centdessin.com)
	 * @version	0.3
	 * @desc 	JavaScript cookie manipulation class
	 * 
	 */	
	Mo.Cookie = {	
	
		/** Get a cookie's value
		 *
		 *  @param integer	key		The token used to create the cookie
		 *  @return void
		 */
		get: function(key) {
			// Still not sure that "[a-zA-Z0-9.()=|%/]+($|;)" match *all* allowed characters in cookies
			var tmp =  document.cookie.match((new RegExp(key +'=[a-zA-Z0-9.()=|%/]+($|;)','g')));
			if(!tmp || !tmp[0]) return null;
			else return unescape(tmp[0].substring(key.length+1,tmp[0].length).replace(';','')) || null;
			
		},	
		
		/** Set a cookie
		 *
		 *  @param integer	key		The token that will be used to retrieve the cookie
		 *  @param string	value	The string to be stored
		 *  @param integer	ttl		Time To Live (hours)
		 *  @param string	path	Path in which the cookie is effective, default is "/" (optional)
		 *  @param string	domain	Domain where the cookie is effective, default is window.location.hostname (optional)
		 *  @param boolean 	secure	Use SSL or not, default false (optional)
		 * 
		 *  @return setted cookie
		 */
		set: function(key, value, ttl, path, domain, secure) {
			var cookie = [key+'='+    escape(value),
					  'path='+    ((!path   || path=='')  ? '/' : path),
					  'domain='+  ((!domain || domain=='')?  window.location.hostname : domain)];
			
			if (ttl)         cookie.push(Mo.Cookie.hoursToExpireDate(ttl));
			if (secure)      cookie.push('secure');
			return document.cookie = cookie.join('; ');
		},
		
		/** Unset a cookie
		 *
		 *  @param integer	key		The token that will be used to retrieve the cookie
		 *  @param string	path	Path used to create the cookie (optional)
		 *  @param string	domain	Domain used to create the cookie, default is null (optional)
		 *  @return void
		 */
		unset: function(key, path, domain) {
			path   = (!path   || typeof path   != 'string') ? '' : path;
			domain = (!domain || typeof domain != 'string') ? '' : domain;
			if (Mo.Cookie.get(key)) Mo.Cookie.set(key, '', 'Thu, 01-Jan-70 00:00:01 GMT', path, domain);
		},
	
		/** Return GTM date string of "now" + time to live
		 *
		 *  @param integer	ttl		Time To Live (hours)
		 *  @return string
		 */
		hoursToExpireDate: function(ttl) {
			if (parseInt(ttl) == 'NaN' ) return '';
			else {
				var now = new Date();
				now.setTime(now.getTime() + (parseInt(ttl) * 60 * 60 * 1000));
				return now.toGMTString();			
			}
		},
	
		/** Return true if cookie functionnalities are available
		 *
		 *  @return boolean
		 */
		/*
		test: function() {
			Mo.Cookie.set('b49f729efde9b2578ea9f00563d06e57', 'true');
			if (Mo.Cookie.get('b49f729efde9b2578ea9f00563d06e57') == 'true') {
				Mo.Cookie.unset('b49f729efde9b2578ea9f00563d06e57');
				return true;
			}
			return false;
		},
		*/
		
		/** If Firebug JavaScript console is present, it will dump cookie string to console.
		 * 
		 *  @return void
		 */
		dump: function() {
			if (typeof console != 'undefined') {
				console.log(document.cookie.split(';'));
			}
		},
		
		//删除所有 cookies
		clear : function (){
			var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
			
			//alert( keys );
			
			if (keys) {
				for (var i = keys.length; i--;){
					//document.cookie = keys[i]+'=0;expires=' + new Date(0).toUTCString();					
					Mo.Cookie.unset( keys[i] );					
				}
			}
		} 
		
	}
	
	
	/*
		获取URL参数
		key	参数名称
		url		URL链接，默认为当前URL
	*/
	Mo.get = function( key, url ){
		
		var url = url ? url : location.href;	
		var v = '';
		var o = url.indexOf( key + "=" );
		if (o != -1){
			o += key.length + 1 ;
			e = url.indexOf("&", o);
			if (e == -1){
				e = url.length;
			}
			//v = decodeURIComponent(url.substring(o, e));
			v = url.substring(o, e);
		}

		return v;
	}
	
	/*
		加载 Script 脚本
		src		文件地址
		func		回调函数
		attr		属性（JSON格式）
		target	目标元素，默认为<head>		
	*/
	Mo.script = function( src, attr, func, target ){

		//空函数
		if( typeof func != 'function' ) var func = function(){};
	
		//插件
		if( src.indexOf(".") == -1 ){
		
			//已装载
			if( Mo.Array( Mo.plugin ).indexOf( src ) > -1 ){
				func && func();
				return;
			}else{
				//拼接文件名
				src = Mo.base + "mo." + src + ".js";
			}
			
		}
		
		//容器
		var target = target ? target : document.getElementsByTagName("head")[0];
		
		//附加属性
		attr = attr ? attr : {};
		attr["type"] = "text/javascript";
		attr["src"] = src;		
		
		var script = Mo.create( "script", attr );
	
		target.appendChild(script);
		
		/*
		设定读取完以后的操作
		IE9 以上同时支持 onreadystatechange 和 onload，所以使用 executed 来确保只执行一次
		http://www.aaronpeters.nl/blog/prevent-double-callback-execution-in-IE9
		*/
		script.onreadystatechange = script.onload = function() {
			if( ( !this.readyState || this.readyState == "loaded" || this.readyState == "complete" ) && !this.executed ) {
				this.executed = true;
				func && func(this);
			}
		};
		
	}
	
	/*
		加载 Script 脚本
		src		文件地址
		func		回调函数
		attr		属性（JSON格式）
		target	目标元素，默认为<head>		
	*/
	Mo.json = function( src, attr, func ){

		//空函数
		if( typeof func != 'function' ) var func = function(){};
		
		//匿名函数名称
		var c = 'cross' + parseInt(Math.random()*1000);
		
		//头部容器
		var head = document.getElementsByTagName("head")[0];
		
		//附加回调参数
		if( attr.autocall != false ){
			src = src.substr( 0, src.length-1 ) + c;
		}
		
		//附加属性
		attr = attr ? attr : {};
		attr["type"] = "text/javascript";
		attr["src"] = src;
		
		var script = Mo( head ).create( "script", attr, true );
		
		// Handle JSONP-style loading
		//将函数名设置为window的一个方法,这样此方法就是全局的了.
		window[ c ] = window[ c ] || function( data ) {
			
			//调用匿名函数
			func(data);
			
			// Garbage collect
			window[ c ] = undefined;

			try {
				delete window[ c ];
			} catch(e) {}

			//移除自己
			script.remove();

		};
		
	}
	
	/********* 模板解析_开始 *********/
	
	// Simple JavaScript Templating
	// John Resig - http://ejohn.org/ - MIT Licensed
	/*
		模板解析
		ele		模板对象（element）
		data	数据对象
	*/	
	Mo.Template = function( ele, data ){
	
		//缓存池
		Mo.Template.cache =  Mo.Template.cache || {};

		var tmpl = function(ele, data){
		
	    // Figure out if we're getting a template, or if we need to
	    // load the template - and be sure to cache the result.	   
	    var fn = !/\W/.test(ele) ? Mo.Template.cache[ele] = Mo.Template.cache[ele] || tmpl(document.getElementById(ele).innerHTML) :
	      
	      // Generate a reusable function that will serve as a template
	      // generator (and which will be cached).
	      new Function("obj",
		"var p=[],print=function(){p.push.apply(p,arguments);};" +
		
		// Introduce the data as local variables using with(){}
		"with(obj){p.push('" +
		
		// Convert the template into pure JavaScript
		/*
		ele.replace(/[\r\t\n]/g, " ")
		  .split("<%").join("\t")
		  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
		  .replace(/\t=(.*?)%>/g, "',$1,'")
		  .split("\t").join("');")
		  .split("%>").join("p.push('")
		  .split("\r").join("\\'")
	      + "');}return p.join('');");
	     */
		ele.replace(/[\r\t\n]/g, " ")
			.replace(/'(?=[^%]*%>)/g,"\t")
			.split("'").join("\\'")
			.split("\t").join("'")
			.replace(/<%=(.+?)%>/g, "',$1,'")
			.split("<%").join("');")
			.split("%>").join("p.push('")
			+ "');}return p.join('');");
	    
	    // Provide some basic currying to the user
	    return data ? fn( data ) : fn;
	  };
	  
	  return tmpl( ele, data );
	  
	};
	
	/********* 工具包_开始 *********/
	
	Mo.Toolkit = {
	
		slice:([]).slice,
		
		/*
			获取对象类型
			o	目标对象
		*/
		is:function (o) {
			return ({}).toString.call(o).slice(8, -1);
		},
		
		/*
			检测节点是否存在于文档中
			o	目标节点
		*/
		isOnDom:function (node) {

			if (!node || !node.nodeType || node.nodeType !== 1) return;
			var body = document.body;
			while (node.parentNode) {
				if (node === body) return true;
				node = node.parentNode;
			}
			return false;
		},
		
		/*
			检测 b 节点是否包含在于 a 元素中
			a	当前元素
			b	目标节点
		*/
		contains:function (a, b) {
			try {
				return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b))
			} catch (e) {}
		},
		
		/*
			获取当前视口信息
		*/
		getViewportSize:function () {
			var value = {width:0, height:0};
			undefined !== window.innerWidth ? value = {width:window.innerWidth, height:window.innerHeight} : value = {width:document.documentElement.clientWidth, height:document.documentElement.clientHeight};
			return value;
		},
		
		/*
			获取元素在视口内的位置信息
			f	目标元素
		*/
		getClinetRect:function (f) {
			var d = f.getBoundingClientRect(), e = (e = {left:d.left, right:d.right, top:d.top, bottom:d.bottom, height:(d.height || (d.bottom - d.top)), width:(d.width || (d.right - d.left))});
			return e;
		},
		
		/*
			获取当前滚动条信息
		*/
		getScrollPosition:function () {
			var position = {left:0, top:0};
			if (window.pageYOffset) {
				position = {left:window.pageXOffset, top:window.pageYOffset};
			}
			else if (typeof document.documentElement.scrollTop != 'undefined' && document.documentElement.scrollTop > 0) {
				position = {left:document.documentElement.scrollLeft, top:document.documentElement.scrollTop};
			} else if (typeof document.body.scrollTop != 'undefined') {
				position = {left:document.body.scrollLeft, top:document.body.scrollTop};
			}
			return position;
		},
		
		/*
			获取当前基础目录
			subdir	需要忽略的子目录
		*/
		getUrlBasic : function( subdir ){
			
			//所有 js 元素
			var tags = document.getElementsByTagName("script");
			
			//取当前 js 地址
			var path = tags[tags.length-1].getAttribute('src');
			
			//取目录地址
			var base = path ? path.substring(0,path.lastIndexOf("/")-( subdir ? subdir.length : 0 )) : null;
			
			return base;
			
		}
	
	}
	
	/********* 数组对象扩展_开始 *********/
	
	Mo.Array = function( source ){	
	
		//内部类
		var inti = function( source ){
			this.self = source;
			return this;
		}

		//扩展方法
		inti.prototype = {
		
			//返回源
			output : function(){				
				return this.self;
			},
			
			//返回第一个元素
			first : function () {
				return this.self[0];
			},
			
			//返回最后一个元素
			last : function () {
				return this.self[this.self.length - 1];
			},
			
			//返回最大的一个元素
			max : function () {
				return Math.max.apply(null, this.self);
			},
			
			//返回最小的一个元素
			min : function () {
				return Math.min.apply(null, this.self);
			},
			
			//数组求和
			sum : function () {
				for( var i=0,sum=0; i<this.self.length; sum += isNaN( parseInt(this.self[i]) ) ? 0 : parseInt(this.self[i]), i++ );
				return sum;
			},
	
			//清空数组
			clear :function(){
				this.self = [];
				return this;
			},
	
			/*
				检查在数组内是否存在某值
				value	要查找的值
			*/
			indexOf : function( value ) {
				var l = this.self.length;
				for(var i=0; i<=l; i++) {
					if( this.self[i]== value ) return i;
				}
				return -1;
			}

		}

		//实例化类
		return new inti(source);
		
	}	

	/********* 字符串扩展_开始 *********/
	
	Mo.String = function( source ){
		
		//内部类
		var inti = function( source ){
			this.self = String( source || '' );
			return this;
		}
		
		//扩展方法
		inti.prototype = {
		
			//返回源
			output : function(){				
				return this.self;
			},
			
			//字符串填充
			pad : function(l, s, t){
				var str = this.self.toString();
				return s || (s = " "), (l -= str.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
					+ 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
					+ str + s.substr(0, l - t) : str;
			},
			
			//返回字符串长度
			length : function(){
				return String( this.self ).replace(/[^\x00-\xff]/g, "ci").length;
			},
					
			//去掉左右空白字符
			trim : function(){
				this.self = this.self.replace(/(^\s*)|(\s*$)/g, "");
				return this;
			},
			
			//去掉左边空白字符
			leftTrim : function(){
				this.self = this.self.replace(/(^\s*)/g, "");
				return this;
			},
			
			//去掉右边空白字符
			rightTrim : function(){
				this.self = this.self.replace(/(\s*$)/g, "");
				return this;
			},
	
			//过滤JS
			stripScript : function() {
				this.self = this.self.replace(/<script.*?>.*?<\/script>/ig, '');
				return this;
			},
			
			/*
				移除 HTML 标签
				allowed		允许的标签
			*/
			stripTags : function( allowed ) {
				
			  // http://kevin.vanzonneveld.net
			  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // +   improved by: Luke Godfrey
			  // +      input by: Pul
			  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // +   bugfixed by: Onno Marsman
			  // +      input by: Alex
			  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // +      input by: Marc Palau
			  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // +      input by: Brett Zamir (http://brett-zamir.me)
			  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // +   bugfixed by: Eric Nagel
			  // +      input by: Bobby Drake
			  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // +   bugfixed by: Tomasz Wesolowski
			  // +      input by: Evertjan Garretsen
			  // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
			  // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
			  // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
			  // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
			  // *     returns 2: '<p>Kevin van Zonneveld</p>'
			  // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
			  // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
			  // *     example 4: strip_tags('1 < 5 5 > 1');
			  // *     returns 4: '1 < 5 5 > 1'
			  // *     example 5: strip_tags('1 <br/> 1');
			  // *     returns 5: '1  1'
			  // *     example 6: strip_tags('1 <br/> 1', '<br>');
			  // *     returns 6: '1  1'
			  // *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
			  // *     returns 7: '1 <br/> 1'
			  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
			  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
			  this.self = this.self.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) { return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''; });
			  return this;
			},
			
			//过滤标签
			stripTags : function() {
				this.self = String( this.self ).replace(/<[^>]+>/g, "");
				return this;
			},
			
			//ASCII -> Unicode转换
			unicode : function(){
				
				if( this.self ){				
					var result = '';
					for (var i=0; i<this.self.length; i++){
						result += '&#' + this.self.charCodeAt(i) + ';';
					}					
					this.self = result;
				}
				
				return this;
			},
			
			//Unicode -> ASCII转换
			ascii : function() {
				
				if( this.self ){				
					var code = this.self.match(/&#(\d+);/g);					
					if( code != null ){					
						var result = '';
						for (var i=0; i<code.length; i++){
							result += String.fromCharCode(code[i].replace(/[&#;]/g, ''));
						}						
						this.self = result;					
					}				
				}
				
				return this;
			},
			
			//格式化字符串
			format : function (){
				var param = [];
				for (var i = 0, l = arguments.length; i < l; i++){
					param.push(arguments[i]);
					//alert(i);
				}
				
				//var statment = param[0]; // get the first element(the original statement)
				//param.shift(); // remove the first element from array
				
				this.self = this.self.replace(/\{(\d+)\}/g, function(m, n){
					return param[n];
				});
				
				return this;
			},
			
			/*
				返回解码后的字符串
				string		源字符串
			*/
			encodeHTML : function(){
				//return this.self.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,"\"");
				return this.self.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
			},
	
			/*
				返回编码码后的字符串
				string		源字符串
			*/
			decodeHTML : function(){
				//return this.self.replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
				var b = this.self.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
				return b.replace(/&#([\d]+);/g, function(d, c) {
					return String.fromCharCode(parseInt(c, 10))
				});
			},
	
			/*
				编码特殊符号
			*/
			escapeSymbol : function(){
				return String( this.self ).replace(/\%/g, "%25").replace(/&/g, "%26").replace(/\+/g, "%2B").replace(/\ /g, "%20").replace(/\//g, "%2F").replace(/\#/g, "%23").replace(/\=/g, "%3D");
			},
	
			/*
				将 CSS 样式属性名转为 JS 形式
				例如：z-index 转换为 zIndex
			*/
			toCamelCase : function(){
				var a = this.self;
				if (a.indexOf("-") < 0 && a.indexOf("_") < 0) {
					return a
				}
				return a.replace(/[-_][^-_]/g, function(b) {
					return b.charAt(1).toUpperCase()
				});
			},
			
			/*
				将字符串转为对象
			*/
			eval : function(){
				return (new Function( 'return (' + this.self.replace(/\r/gm,'').replace(/\n/gm,'\\n') + ');'))();
			}
			
		}
	
		//实例化类
		return new inti(source);
	}

	/********* 数值扩展_开始 /*********/

	Mo.Number = function( source ){
		
		//内部类
		var inti = function( source ){
			this.self = String( source || '' );
			return this;
		}
		
		//扩展方法
		inti.prototype = {
		
	
			//将数字补前置零
			test : function(){
				alert('');
				return ;
			},
	
			/*
				逗号分隔数字串
			*/
			comma : function( d ){
				var c = this.self;
				if (!d || d < 1) {
					d = 3;
				}
				c = String(c).split(".");
				c[0] = c[0].replace(new RegExp("(\\d)(?=(\\d{" + d + "})+$)", "ig"), "$1,");
				return c.join(".");
			},
			
			/* 检查是否全为数字 */
			isNumber : function(num){
				return /^[0-9]{1,20}$/.exec(num);
			}
		
		}
	
		//实例化类
		return new inti(source);
	}	

	/********* 函数扩展_开始 *********/

	Mo.Function = function( func ){

		//内部类
		var inti = function( func ){

			this.self = func || new Function();

			return this;
		}

		//扩展方法
		inti.prototype = {

			//定时执行函数
			execute : function( time ){
				if( time ){
					window.setTimeout( this.self, time );
				}else{
					this.self();
				}
			}

		}

		//实例化类
		return new inti(func);
		
	}	
	
	/********* 日期扩展_开始 *********/

	Mo.Date = function( date ){
		
		//内部类
		var inti = function( date ){

			this.self = ( Mo.Validate.Number(date) ? new Date(parseInt(date) * 1000) : date ) || new Date();

			return this;
		}

		//扩展方法
		inti.prototype = {
			
			//判断是否是闰年,返回 true 或者 false   
			leapyear : function(){
				var year = this.self.getFullYear();   
				return ( 0 == year % 4 && ((year % 100 != 0)||(year % 400 == 0)));   
			},
	
			//返回该月天数   
			days : function(){
				return (new Date(this.self.getFullYear(),this.self.getMonth()+1,0)).getDate();   
			},
	
			//获取现在的 Unix 时间戳 (Unix timestamp)
			time : function(){
				return Math.round( this.self.getTime()/1000 );
			}

		}

		//实例化类
		return new inti(date);		
		
	}	
	
	/********* 事件扩展_开始 *********/

	Mo.Event = function( event ){
	
		//内部类
		var inti = function( event ){
		
			this.self = event || window.event;
			
			return this;
		}

		//扩展方法
		inti.prototype = {
		
			/*
				停止事件冒泡和浏览器默认行为
				type	默认停止冒泡和默认行为
						1	仅停止冒泡
						2	仅停止行为
			*/
			stop : function( type ){			
				if( !this.self ) return;
			
				if ( Mo.Browser.msie ) {
				
					//停止冒泡
					type !== 2 && ( window.event.cancelBubble = true );

					//阻止浏览器默认动作
					type !== 1 && ( window.event.returnValue = false );
					
				} else {
					
					//停止冒泡
					type !== 2 && this.self.stopPropagation();
					
					//阻止浏览器默认动作(W3C)
					type !== 1 && this.self.preventDefault();

				}
				
				//return false;
				return this;
			},
			
			/* 发生事件的节点 */
			element : function() {			
				if( !this.self ) return;

				//window.status =  this.self;
			
				if ( Mo.Browser.msie ) {
					return window.event.srcElement;
				}else{
					return this.self.currentTarget;
				}
			},
			
			/* 发生当前在处理的事件的节点 */
			target : function() {			
				if( !this.self ) return;
				
				if ( Mo.Browser.msie ) {
					return window.event.srcElement;
				}else{
					return this.self.target;
				}
			},
			
			/* 获取当前鼠标光标所在位置 */
			mouse : function(){
				if( !this.self ) return;
			
				if ( Mo.Browser.msie ) {
					var x = this.self.x + Mo.document.scrollLeft;
					var y = this.self.y + Mo.document.scrollTop;
				}else{
					var x = this.self.pageX;
					var y = this.self.pageY;
				}
				return { "x":x, "y":y };
			},
			
			/* 响应键盘事件 */
			keyboard : function( code, func ){
				if( !this.self ) return;
			
				//对比按键码
				if( ( code>-1 && this.self.keyCode == code ) || code == -1 ){
				
					//回调
					func( this.self, this.self.keyCode );
				
				}			
				
			}

		}

		//实例化类
		return new inti(event);
		
	}
	
	/********* 验证函数_开始 *********/
	
	Mo.Validate ={
	
		//判断对象是否是数组
		Array : function(obj){
			return Object.prototype.toString.apply(obj) === '[object Array]';
		},
	
		//判断对象是否是函数
		Function : function(obj){
			return Object.prototype.toString.apply(obj) === '[object Function]';
		},
	
		//判断对象是否是元素
		/*
		Mo.isElement = function(obj){
			return Object.prototype.toString.apply(obj) === '[object HTMLCollection]';
		}
		*/
	
		//判断对象是否是对象
		Object : function(obj){
			return Object.prototype.toString.apply(obj) === '[object Object]';
		},
	
	
		//判断对象是否是数值
		/*
		Mo.isNumber = function(obj){
			return Object.prototype.toString.apply(obj) === '[object Number]';
		}
		*/
	
		//日期
		Date : function(o){
		
			//验证字符串
			if( typeof o == 'string' ){				 
				 return o.match(/^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})(\s{1})(\d{1,2})(\:)(\d{1,2})/) != null || o.match(/^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})/) != null;				
			}else{
			
				//验证对象
				return Object.prototype.toString.apply(o) === '[object Date]';
			}
		},
	
		//数值
		Number : function(o) {
			return !isNaN( parseFloat( o ) ) && isFinite(o);
		},
		
		//字符串
		String : function(o){
			return typeof o === 'string';
		},
	
		//未定义
		Defined : function(o){
			return typeof o != 'undefined';
		},
	
		//对象是否为空
		Empty : function(o){
			return typeof o == 'undefined' || o == '' ;
		},
	
		//布尔
		Boolean : function(o){
			return typeof o === 'boolean';
		},

		//是否为Window对象
		Window : function(o){			
			return /\[object Window\]/.test( o );
		},

		//是否为HTML根
		Document : function(o){
			return /\[object HTMLDocument\]/.test( o );
		},
				
		//是否为HTML元素
		Element : function(o){
			//alert(o);
			//return /\[object HTML\w*(Element)?\]/.test(Object.prototype.toString.apply(o));
			//return /\[object HTML\w*(Element)?\]/.test( o );
			//o.nodeType !=1 && 
			return o.tagName ? true : false;
		},
	
		//是否为XML
		/*
		isXML : function(o){
			return  Object.prototype.toString.apply(o)==='[object XML]';
		},
		*/
		
		/****************************/

		/*
			检查是否包含中文
			str		字符串
			all		全部由中文构成
		*/
		Chinese : function( str , all ) {
		
			if( all ){

				//测试是否为双字节字符
				return ( str.length*2 == str.replace(/[^\x00-\xff]/g,"**").length ); 			
			
			}else{
				
				//测试是否为双字节字符
				return (str.length != str.replace(/[^\x00-\xff]/g,"**").length); 
			
			}		
			
		},
		
		//检查是否含有特殊字符
		Safe : function(str){
			var chkstr;
			var i;
			chkstr="'*%@#^$`~!^&*()=+{}\\|{}[];:/?<>,.";
			for (i=0;i<str.length;i++){
				if (chkstr.indexOf(str.charAt(i))!=-1) return false;
			}
			return true;
		},

		//检查是否为电子邮件地址
		Email : function(str){			
			return /^\s*([A-Za-z0-9_-]+(\.\w+)*@(\w+\.)+\w{2,3})\s*$/.test(str);
		},
		
		//检查是否为URL地址
		URL : function(str){			
			return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(str);
		},

		//检查是否为合法IP
		IP : function(str){
			return /^[0-9.]{1,20}$/.test(str);
		},

		//检查是否为合法密码
		Password : function(str){
			return /^(\w){6,20}$/.test(str);
		},
		
		//检查是否为颜色值
		Color : function(str){
			return /^#(\w){6}$/.test(str);
		},

		/****************************/
				
		/* 校验身份证（18位数字） */
		ID : function(str){
			if(str.length==18){
				return Mo.Validate.Number(str.substring(0,17));
			}else{
				return false;
			}
		},
		
		//校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
		Phone : function(str){
			return /(?:^0{0,1}1\d{10}$)|(?:^[+](\d){1,3}1\d{10}$)|(?:^0[1-9]{1,2}\d{1}\-{0,1}[2-9]\d{6,7}$)|(?:^\d{7,8}$)|(?:^0[1-9]{1,2}\d{1}\-{0,1}[2-9]\d{6,7}[\-#]{1}\d{1,5}$)/.test(str);
		},
		
		//校验手机号码：必须以数字开头，除数字外，可含有“-”
		Mobile : function(str){
			//	!/^1\d{10}$/
			return /^[1][0-9]{10}$/.test(str);
		}

		
	}	

	/********* 调试助手_开始 *********/

	/*
	Mo.Logs = {
	
		//容器
		box:null,

		//初始化，注册容器
		start:function(obj){
			Mo.Logs.box = document.getElementById(obj);
		},

		//清空调试信息
		clear:function(){
			if( Mo.Logs.box ) Mo.Logs.box.innerHTML = '';
		},
		
		//正常
		debug:function(str){
			if( Mo.Logs.box ) Mo.Logs.box.innerHTML = '&#12304;&#8730;&#12305;'+ str + '<br />' +Mo.Logs.box.innerHTML;
		},

		//消息
		point:function(str){
			if( Mo.Logs.box ) Mo.Logs.box.innerHTML = '&#12304;&#9633;&#12305;'+ str + '<br />' +Mo.Logs.box.innerHTML;
		},
		
		//警告
		alert:function(str){
			if( Mo.Logs.box ) Mo.Logs.box.innerHTML = '&#12304;&#9679;&#12305;'+ str + '<br />' +Mo.Logs.box.innerHTML;
		},
		
		//错误
		error:function(str){
			if( Mo.Logs.box ) Mo.Logs.box.innerHTML = '&#12304;&#215;&#12305;'+ str + '<br />' +Mo.Logs.box.innerHTML;
		}
		
	}	
	*/
	 
	/*	
		基本选择器
		selector	选择器表达式
		context		上下文
	*/
	Mo.find = function(selector, context){

		context = context || document;
		
		//使用浏览器内置选择器
		return context.querySelectorAll(selector);
		
	};
	
	/*
		扩展选择器方法
		func	函数
	*/
	Mo.extend = function( func ){
	
		for( var i in func){			
			Mo.init.prototype[i] = func[i];			
		}
		
	}
	
	/*
		元素创建方法
		
		tag		标签
		attr	[json]属性和值
	*/
	Mo.create = function( tag, attr ){	

		//创建对象
		var obj = document.createElement( tag );

		//附加属性
		var attr = attr || {};
		for( var key in attr ){
			//DOM 方法
			if( /[A-Z]/.test(key) ){
				obj[ key ] = attr[ key ];
			}else{
				obj.setAttribute( key, attr[key] );
			}			
		}
		
		return obj;
			
	}	
	
	/*
		初始化
		
		selector	选择器
		context		父对象
	*/
	Mo.init = function( selector, context ){
		this.self = typeof selector == 'string' ? Mo.find( selector, context ) : [selector];
	}

	Mo.init.prototype = {

		/*
			元素数量
			
			返回：
			int		数量
		*/
		size : function(){			
			return this.self.length;			
		},

		/*
			选择元素
			i		索引位置
			self	重置为当前元素
			
			返回：
			int		数量
		*/
		item : function( i, self ){
			
			//元素数量
			var size = this.size();
			
			//当前元素
			var ele = null;
		
			//从左至右返回元素
			if( i >= 0 ){			
				ele = i <= size ? this.self[i] : null;			
			}else{			
				//从右至左返回元素
				ele = Math.abs(i) <= size ? this.self[ ( size + i ) ] : null;			
			}
			
			//重置为当前元素
			if( self ){
				this.self = [ele];
			}
			
			return self ? this : ele;
					
		},

		/*
			隐藏元素
			speed	速度
			func	回调函数
		*/
		hide : function(speed,func){
			
			//批量绑定
			this.each( function( ){
				
				//隐藏对象
				this.style.display = "none";
				
				typeof(func) == 'function' && func.call( this );
				
			} );

			return this;
		},
		
		/*
			显示元素
			speed	速度
			func	回调函数
		*/
		show : function( speed,func ){
			
			//批量绑定
			this.each( function( ){
				
				//显示对象
				this.style.display = "";
				
				typeof(func) == 'function' && func.call( this );
				
			} );

			return this;
		},
		
		/*
			显示或隐藏对象
			speed	速度
			func	回调函数
		*/
		toggle : function( speed, func ){
		
			//批量绑定
			this.each( function( ){

				if( this.style.display == "none" || this.offsetHeight == 0 || this.offsetWidth == 0 ) {
					this.style.display = "";
				}else{
					this.style.display = "none";
				}
			
				/*
					回调函数
					parm	是否可见
				*/
				typeof(func) == 'function' && func.call( this, this.style.display != 'none' );

			} );
	
			return this;
		},

		/*
			设置或返回对象值
			text		[可选]文本值
			add		[可选]是否在原文本上追加
		*/	
		value : function( text, add ){
		
			//设置值
			if( typeof text != "undefined" ){
		
				//批量绑定
				this.each( function( ){
					
					//子元素数量
					var len = this.length;
					
					//按类型处理
					switch( this.type ){
						
						//单选下拉
						case "select-one":							
							
							for(var i=0; i<len; i++ ){
								if( this[i].value == text ){
									this.selectedIndex=i;
									break;
								}
							}
							
						break;
						
						//多选下拉
						case "select-multiple":
							
							for( var i=0; i<len; i++ ){
								if( Mo.Array( text ).indexOf( this[i].value ) !== -1 ){
									this[i].selected = true;
								}else{
									this[i].selected = false;
								}
							}
							
						break;
						
						//单选和筛选按钮
						case "radio":
						case "checkbox":
						
							if( ( Mo.Validate.Array(text) && Mo.Array( text ).indexOf( this.value ) !== -1 ) || this.value == text ){
								this.checked = true;
							}else{
								this.checked = false;
							}
							
						break;
						
						//文本框、隐藏域和多行文本
						case "text"	:
						case "hidden":
						case "textarea":
						case "password":
							
							if( add ){
								this.value += text;
							}else{
								this.value = text;
							}
							
						break;
						
					}
					
				} );
			
				return this;
				
			}
			
			///////////////////////////////////
			
			//返回值
			var val = [];
			
			//批量绑定
			this.each( function( ){
			
				//子元素数量
				var len = this.length;
				
				//按类型处理
				switch( this.type ){
			
					//单选下拉
					case "select-one":	
						val.push( this.selectedIndex > -1 ? this[this.selectedIndex].value : null );
					break;
					
					//多选下拉
					case "select-multiple":						
						for( var i=0; i<len; i++ ){
							this[i].selected && val.push( this[i].value );
						}						
					break;
					
					//单选和筛选按钮
					case "radio":
					case "checkbox":
						this.checked && val.push( this.value );
					break;
					
					//文本框、隐藏域和多行文本
					case "text"	:
					case "hidden":
					case "textarea":					
					case "password":					
						val.push( this.value );
					break;
				
				}
				
			} );

			return this.size() == 1 ? val[0] : val;
		},

		/*
			设置或返回对象文本
			text			[可选]文本值
			replace		[可选]新的文本値
		*/	
		text : function( text, replace ){
		
			//设置值
			if( typeof text != "undefined" ){
		
				//批量绑定
				this.each( function( ){
					
					//子元素数量
					var len = this.length;
					
					//按类型处理
					switch( this.type ){
						
						//单选下拉
						case "select-one":							
							
							for( var i=0; i<len; i++ ){
								if( this[i].text == text ){
									this.selectedIndex=i;
									if( typeof replace != "undefined" ) this[i].text = replace;
									break;
								}
							}
							
						break;
						
						//多选下拉
						case "select-multiple":
							
							for( var i=0; i<len; i++ ){
								if( Mo.Array( text ).indexOf( this[i].text ) !== -1 ){
									this[i].selected = true;
									if( typeof replace != "undefined" ) this[i].text = replace;
								}else{
									this[i].selected = false;
								}
							}
							
						break;
						
					}
					
				} );
			
				return this;
				
			}
			
			///////////////////////////////////
			
			//返回值
			var val = [];
			
			//批量绑定
			this.each( function( ){
			
				//子元素数量
				var len = this.length;
				
				//按类型处理
				switch( this.type ){
			
					//单选下拉
					case "select-one":						
						if( len ){
							val = this[this.selectedIndex].text;
						}						
					break;
					
					//多选下拉
					case "select-multiple":
						
						for( var i=0; i<len; i++ ){								
							if( this[i].selected ){
								val.push(this[i].text);
							}
						}
						
					break;
				
				}
				
			} );
		
			return val;
		},
		
		/*
			设置或返回对象内容
			html		[可选]代码块
			add		[可选]是否在原代码上追加
		*/	
		html : function( html, add ){
			
			if( typeof html != "undefined" ){
			
				//批量绑定
				this.each( function( ){
					if( add ){
						this.innerHTML += html;
					}else{
						this.innerHTML = html;
					}
				});
				
				return this;
			}
			
			var ele = this.self[0];
			
			return ele.innerHTML;
		},
		
		/*
			设置或返回对象样式名
			key		[String]	时返回样式值
					[JSON]		时设置属性值，如：{"color":"red","fontSize":"14px"}
		*/	
		attr : function( key ){
		
			//返回对象属性值
			if( typeof key == "string" ){
			
				//没有对象
				if( this.size() == 0 ) return null;
			
				var ele = this.self[0];
				
				//DOM 方法
				if( /[A-Z]/.test(key) ){
					return ele[ key ];
				}else{
					return ele.getAttribute(key);
				}
			
			}else{
			
				//批量绑定
				this.each( function( ){
				
					//设置对象属性
					for(var x in key){
					
						//DOM 方法
						if( /[A-Z]/.test( x ) ){
							this[ x ] = key[ x ] ;
						}else{
							this.setAttribute( x, key[x] );
						}			
						
					}
					
				} );
				
				return this;
				
			}
			
		},

		/*
			设置或返回对象样式
			key		[String]	时返回样式值
					[JSON]		时设置样式值，如：{"color":"red","fontSize":"14px"}
			
		*/
		style : function( key ){
		
			//返回对象样式值
			if( typeof key == "string" ){
			
				//没有对象
				if( this.size() == 0 ) return null;
			
				var ele = this.self[0];
				
				var $S=function(){ 
					var f=document.defaultView; 
					return new Function('el','style',[ 
						"style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));", 
						"style=='float' && (style='", 
						f ? 'cssFloat' : 'styleFloat', 
						"');return el.style[style] || ", 
						f ? 'window.getComputedStyle(el, null)[style]' : 'el.currentStyle[style]', 
						' || null;'].join('')); 
				}();
				
				return $S( ele, key );
			
			}else{
			
				//批量绑定
				this.each( function( ){
					
					//设置对象样式
					for(var x in key){
						this.style[x] = key[x];
					}
					
				} );
				
				return this;
			
			}
			
		},
		
		/*
			返回对象位置和尺寸信息
			json	如：{"width":width,"height":height}
		*/
		position : function( json ){
		
			//没有对象
			if( this.size() == 0 ) return null;
			
			var ele = this.self[0];
			
			var width 	= ele.offsetWidth;
			var height	= ele.offsetHeight;
			
			var top		= ele.offsetTop;
			var left	= ele.offsetLeft;
			
			while( ele = ele.offsetParent ){
				top 	+= ele.offsetTop;
				left	+= ele.offsetLeft;
			}
			
			return {"width":width, "height":height, "top":top, "left":left};
			
		},
		
		/*
			遍历元素，对每个元素执行回调函数
			func		需要执行的函数
		*/
		each : function( func ){
			
			//元素数量
			var size = this.size();
			
			var ele = this.self;
			
			for( var i = 0; i< size; i++ ){
				
				/*
					回调参数，此处有 Bug
					ele[i]	当前元素
					index	当前索引，从零开始
					索引值应该根据选择器来生成，而不是具体数值，所以还原成固定参数
				*/
				//( typeof ele[i].index == 'undefined' || ele[i].index != i ) && ( ele[i].index = i );
				
				/*
					如果需要中断，需要在函数体内定义 return false;
				*/
				if( func.call( ele[i], i ) === false ) break;
				
			}
			
			return this;
			
		},
		
		/*
			为对象绑定事件
			evt		事件名称
			fn		要执行的函数	
		*/
		bind : function( evt , fn ){
		
			//批量绑定
			this.each( function( index ){
				
				var self = this;	//IE中必须
				var call = function( e ){ return fn.call( self, index, e ); };
				
				//生成序列，用于后期移除
				!this.Listeners && ( this.Listeners = [] );
				
				//加入序列
				this.Listeners.push({ e: evt, fn: call });
				
				//绑定事件
				if (this.addEventListener) this.addEventListener( evt, call, false );
				else if (this.attachEvent) this.attachEvent( 'on' + evt, call );
				else this['on' + evt] = call;
				
			} );
			
			return this;
		},
		
		/*
			匹配对象绑定事件
			evt			事件名称
			Selector	元素选择器	
			fn			回调函数	
		*/
		live: function( eventType, elementQuerySelector, cb ){
			document.addEventListener(eventType, function (event) {	
				var qs = document.querySelectorAll(elementQuerySelector);	
				if (qs) {
					var el = event.target, index = -1;
					while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
						el = el.parentElement;
					}
					//console.log( el, qs, index );	
					if (index > -1) {
						cb.call(el, index, event);
					}
				}
			});			
		},

		/*
			移除为对象绑定的事件
			evt		事件名称	
		*/
		unbind : function(evt){

			//批量绑定
			this.each( function( index ){
				//ele['on'+evt] = null;
				
				//移除绑定
				//if (ele.removeEventListener) ele.removeEventListener( evt, fn, false );
				//else if (ele.detachEvent) ele.detachEvent( 'on' + evt, fn );
				//else ele['on' + evt] = null;
				
				//移除序列
				if (this.Listeners) {
					//console.log(ele.removeEventListener,this.Listeners.length);
					for (var i = 0; i < this.Listeners.length; i++) {
					
						if (this.removeEventListener) this.removeEventListener( this.Listeners[i].e, this.Listeners[i].fn, false );
						else if (this.detachEvent) this.detachEvent( 'on' + this.Listeners[i].e, this.Listeners[i].fn );
						else this['on' + evt] = null;
						
					};
				   delete this.Listeners;
				};
				
			} );

			return this;
		},
		
		/*
			模拟事件
		*/
		event : function( e ){
		
			//批量绑定
			this.each( function( ){
				
				try{
							
					if( document.createEvent ){
					
						var evt = document.createEvent("MouseEvents"); 
						evt.initEvent( e, true, true);
						this.dispatchEvent(evt);
						
					}else if( document.createEventObject ){
					
						var evt = document.createEventObject();
						this.fireEvent('on'+e, evt);
						
					}else{
					
						this['on'+e]();
						
					}
				
				}catch(e){
					
				}

			});
	
			return this;
		},
				
		/*
			设置对象焦点
			func	要执行的函数	
		*/
		focus : function( func, e ){
			
			//批量绑定
			this.each( function( index ){
				
				//聚焦元素
				this.focus();
				
				//回调
				if(typeof func == 'function'){				
					return func.call( this, index, e );				
				}
				
			} );			
			
			return this;
		},
		
		/*
			使对象失去焦点
			func	要执行的函数	
		*/
		blur : function( func, e ){
			
			//批量绑定
			this.each( function( index ){
				
				//失去焦点
				this.blur();
				
				//回调
				if(typeof func == 'function'){				
					return func.call( this, index, e );
				}
				
			} );			
			
			return this;
		},

		/*
			提交表单，针对表单
			func	要执行的函数	
		*/
		submit : function( func, e ){
			
			//批量绑定
			this.each( function( index ){
				
				//回调必需为真或没有回调时执行
				if( ( typeof func == 'function' && func.call( this, index, e ) ) || typeof func == "undefined" ){				
					this.submit();
				}
				
				return false;
				
			} );			
			
			return this;
		},

		/*
			重置表单，针对表单
			func	要执行的函数	
		*/
		reset : function( func, e ){
			
			//批量绑定
			this.each( function( index ){
				
				//回调必需为真或没有回调时执行
				if( ( typeof func == 'function' && func.call( this, index, e ) ) || typeof func == "undefined" ){				
					this.reset();
				}
				
				return false;
				
			} );			
			
			return this;
		},

		/*
			禁用当前元素	
		*/		
		disabled : function(){
		
			//批量绑定
			this.each( function( ){					
				this.disabled = true;				
			} );

			return this;
		},

		/*
			启用当前元素
		*/		
		enabled : function(){

			//批量绑定
			this.each( function( ){
				this.disabled = false;
			} );

			return this;
		},
		
		/*
			选中或取消选中当前元素，本方法只针对 checkbox 元素有效
		*/		
		checked : function( checked ){

			//批量绑定
			this.each( function( ){
				
				if( Mo.Validate.Boolean( checked ) ){					
					this.checked = checked;
				}else{					
					this.checked = ( this.checked? false : true );
				}
				
			} );

			return this;
		},

		/*			
			在当前元素前面位置创建兄弟元素
			obj		元素对象
			attr		属性对象
			self		是否重置为当前元素
		*/
		insert : function( tag , attr , self ){

			//创建对象
			var obj = Mo.create( tag , attr );

			//批量插入
			this.each( function( ){
				this.parentNode.insertBefore( obj , this );
			});
			
			//重置为当前元素
			if( self ) this.self = [obj];
			
			return this;
		},
		
		/*
			在当前元素上创建子元素
			obj		元素对象
			attr		属性对象
			self		是否重置为当前元素
		*/
		create : function( tag, attr, self ){

			//创建对象
			var obj = Mo.create( tag, attr );

			//批量插入
			this.append( obj );

			//重置为当前元素
			if( self ) this.self = [obj];
			
			return this;
		},

		/*
			插入外部创建的元素
			[ array ]		元素对象
		*/
		append : function( ){
		
			//遍历参数
			for( var i = 0; i < arguments.length; i++ ){
			
				var obj = arguments[i];
	
				//批量插入
				this.each( function( ){				
					this.appendChild( obj );
				});
			
			}

			return this;
		},
		
		/*
			删除元素或属性
			attr	属性名称
		*/
		remove : function( attr ){		

			//批量删除
			this.each( function( ){
				if( typeof attr == 'string' ){
					this.removeAttribute( attr );
				}else{
					this.parentNode.removeChild( this );
				}		
			} );

			return this;
		},
		
		/*
			访问父节点
			level		层次，默认为 1
		*/
		parent : function( level ){
		
			//新元素
			var tmp = [];
			
			//访问层次
			var lev = Mo.Validate.Number( level ) ? parseInt(level) : 1;
		
			//批量查找
			this.each( function( ){
				var ele = this;
				for(var i=0;i<lev;i++){
					ele = ele.parentNode;
				}
				tmp.push( ele );
			} );
			
			this.self = tmp;
			
			return this;
		
		},
		
		/*
			返回上一个兄弟节点
			self		是否重置为当前元素
		*/
		prev : function( node, self ){
		
			//没有对象
			if( this.size() == 0 ) return null;
			
			var ele = this.self[0];
			var obj = null;
			var obj = node ? ele.previousElementSibling : ele.previousSibling;

			//重置为当前元素
			if( self ){
				this.self = [obj];
				return this;
			}else{
				return obj;
			}
			
		},
		
		/*
			返回下一个兄弟节点
			self		是否重置为当前元素
		*/
		next : function( node, self ){
		
			//没有对象
			if( this.size() == 0 ) return null;
			
			var ele = this.self[0];
			var obj = node ? ele.nextElementSibling : ele.nextSibling;

			//重置为当前元素
			if( self ){
				this.self = [obj];
				return this;
			}else{
				return obj;
			}
			
		}

	}
	
	win.Mo = Mo;
	
})( window, document, undefined );
