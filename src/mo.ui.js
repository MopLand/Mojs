/*!
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*	
*	#UI 扩展，包括页面消息、对话框、星级评分等#
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}

/*
	创建对话框
	style			样式
	title			标题
	content		内容
	width			宽度
	height		高度
	config		配置
*/
Mo.Dialog = function( style, title, content, width, height, config ){
	
	//配置选项
	this.config = config ? config : {};

	//分配ID
	this.id = ( config["unique"] ? config["unique"] : Mo.random(10) );
	
	/////////////////////////

	this.style	= style;
	this.title  = title;
	this.html   = content;
	this.width  = width;
	this.height = height;
	
	this.object = null;
	
	this.mode	= '';
	
	//深度
	this.config["zindex"] = this.config["zindex"] ? this.config["zindex"] : 9999;
	
	var self = this;
	
	//窗口关闭时回调
	this.onRemove = function(){
		return true;
	}
	
	//窗口最小化时回调
	this.onMinimize = function(){
		return true;
	}
	
	//窗口最大化时回调
	this.onMaximize = function(){
		return true;
	}

	//窗口创建时回调
	this.onCreate = function(){
		
	}

	//标题栏双击时回调
	this.onDblclick = function(){
		
	}

	//窗口开始移动时回调
	this.onDragStart = function(){
		
	}

	//窗口结束移动时回调
	this.onDragEnd = function(){
		
	}
	
	/*
		居中窗口
		resize		是否重置大小
	*/
	this.Center = function( resize ){
		
		//var doc = Mo.document;		
				
		//滚动条位置
		var src = Mo.Toolkit.getScrollPosition();
		
		//视口位置
		var vie = Mo.Toolkit.getViewportSize();
		
		var div = this.object;
		
		if( typeof resize == 'undefined' || resize ){
		
			//转换百分比		
			if(this.width.toString().indexOf("%")>-1)	this.width=vie.width*(parseInt(this.width)/100);
			if(this.height.toString().indexOf("%")>-1)  this.height=vie.height*(parseInt(this.height)/100);
			
			//超过尺寸时修正
			this.width = this.width > vie.width ? vie.width - 100 : this.width;
			this.height = this.height > vie.height ? vie.height - 100 : this.height;
			
			//尺寸
			if( this.width ) div.style.width	= this.width+"px";
			if( this.height ) div.style.height= this.height+"px";
		
		}
		
		//背景
		if( this.config["locked"] ){
			Mo( "#"+this.id+"-bg" ).style( { "height" : "100%", "width" : "100%" } );
		}
		
	}
			
	//创建窗口
	this.Create	= function(){
		
		//已存在对象
		if( Mo( "#"+this.id ).size() ){
			
			//显示
			Mo( "#"+this.id ).toggle();
			
			return true;
		}
	
		//锁定背景
		if( this.config["locked"] && !this.config["minimize"] ){
			
			var bg = Mo( document.body ).create( "div", { "id" : this.id+"-bg" }, true );
			
			if( Mo.Browser.msie && Mo.Browser.version <= 6 ){
				bg.style( { "background" : "#666", "filter" : "alpha(opacity=20)" } );
			}else{
				bg.attr( { "className" : this.style+"-bg" } );
			}
			
			bg.style( { "position" : "fixed", "zIndex" : this.config["zindex"], "top" : "0", "left" : "0" } );
			
		}
		
		
		//创建新对象
		var dl = Mo.create( "dl", { "id" : this.id, "className" : this.style } );
		
		//标识
		dl.setAttribute("data-dialog","dialog");
		
		this.object = dl;
		
		//dt
		var dt=document.createElement("dt");
		
			//标题栏
			var sg = document.createElement("strong");
			//sg.appendChild(document.createTextNode(this.title));
			sg.innerHTML = this.title;
			
			dt.appendChild(sg);
	
			//关闭按钮
			if( this.config["remove"] ){						
				var sp = document.createElement("span");
					sp.className = "remove";							
					dt.appendChild(sp);
	
				//关闭动作
				sp.onclick = function(){ self.Remove( this ) };
				
				//停止冒泡
				Mo(sp).bind("mousedown",function( index, e ){
					Mo.Event(e).stop();
				});
				
			}
			
			//最大化按钮
			if( this.config["maximize"] ){
				var mx = document.createElement("span");
					mx.className = "maximize";							
					dt.appendChild(mx);
	
				//最大化动作
				mx.onclick = function(){ self.Maximize( this ) };
				
				//停止冒泡
				Mo(mx).bind("mousedown",function( index, e ){
					Mo.Event(e).stop();
				});
				
			}
			
			//最小化按钮
			if( this.config["minimize"] ){
				var sp=document.createElement("span");
					sp.className = "minimize";							
					dt.appendChild(sp);
	
				//最小化动作
				sp.onclick = function(){ self.Minimize( this ) };
				
				//停止冒泡
				Mo(sp).bind("mousedown",function( index, e ){
					Mo.Event(e).stop();
				});
				
			}
			
			//双击响应
			Mo(dt).bind("dblclick",function( index, e ){
											
				//回调事件
				self.onDblclick( self.config["maximize"] ? mx : null );
				
			});
				
			dl.appendChild(dt);
				
		//dd
		var dd = Mo.create( "dd", { "id" : this.id+"-dd", "innerHTML" : this.html } );
			
			dl.appendChild(dd);
		
		if( this.config["wrapper"] ){
			Mo( this.config["wrapper"] ).append( dl );
			Mo( dl ).attr( {'className' : this.style || 'wrapper' } );
		}else{
			document.body.appendChild(dl);		
		}
		
		Mo( dl ).style( { "zIndex" : (parseInt(this.config["zindex"])+1) } );
		
		//居中显示
		self.Center();
		
		//回调事件
		self.onCreate( self );
		
		//支持拖动
		if( this.config["draged"] && typeof Mo.Drag == "function" ){
		
			//拖动样式
			dt.className = "drag";
	
			//拖动支持
			var dg = new Mo.Drag( dt, dl );
			
			////////////////////////////////////
			
			//有iframe内容
			if( Mo( "iframe", dd ).size() ){
				
				//锁定背景
				Mo( document.body ).create( "div", { "id" : this.id+"-fix" }, true ).style({ 
					"position" : "absolute", "zIndex" : this.config["zindex"]+9999, "top" : "0", "left" : "0", "width" : "100%", "height" : "100%"
				}).hide();
				
			}
			
			///////////////////////////////////
	
			//开始拖动
			dg.onStart = function() {
				
				//支持透明
				if( self.config["opacity"] ){
					
					this.style.filter  = "alpha(opacity=70)";
					this.style.opacity = 0.7;
				
				}
				
				//拖动回调
				self.onDragStart( self );
				
				Mo("#"+self.id+"-fix").show();
				
			}
	
			//结束拖动
			dg.onEnd = function(x, y){		
				
				//支持透明
				if( self.config["opacity"] ){
						
					this.style.filter  = "alpha(opacity=100)";
					this.style.opacity = 1;
				
				}
				
				//拖动回调
				self.onDragEnd( self );
				
				Mo("#"+self.id+"-fix").hide();
			}
		
		}

	}
	
	//关闭窗口
	this.Remove = function( btn ){
		if( self.onRemove( self ) ){
			Mo( "#"+self.id ).remove();
			Mo( "#"+self.id+"-bg" ).remove();
		}
	}
	
	//最小化窗口
	this.Minimize = function( btn ){
		if( self.onMinimize( self ) ){
			Mo( "#"+self.id ).toggle();
		}
	}
	
	//最大化窗口
	this.Maximize = function( btn ){
	
		if( self.onMaximize( btn ) ){
			
			if( self.mode == 'Maximize' ){
				
				Mo( self.object ).style( { "height" : "" } );
				
				//居中显示
				self.Center();
				
				//正常模式
				self.mode = '';
				
				//切换样式
				btn.className = 'maximize';
					
			}else{			
				
				//滚动条位置
				var src = Mo.Toolkit.getScrollPosition();
				
				//视口位置
				var vie = Mo.Toolkit.getViewportSize();
		
				Mo( self.object ).style( { "width" : "100%", "height" : vie.height+"px", "left" : "-4px", "top" : ( src.top - 2 )+"px" } );
				
				//最大化模式
				self.mode = 'Maximize';
				
				//切换样式
				btn.className = 'toggle';
					
			}
			
		}
		
	}
	
	//立即创建
	if( this.config["create"] ){
		this.Create();
	}
}

/*
	倒计时
	path	选择器
	value	对比值
	callback	回调函数
*/
Mo.Selector = function(path,value,callback){
	
	var box = $E(path);	
	
	if( typeof callback != 'function'){
		
		var callback =function(value,rel,box){
			if( value == rel ){
				box.className='active';
			}else{
				box.className='';
			}
		};
		
	}
	
	for(var i=0; i<box.length; i++){		
		callback(value,box[i].getAttribute("rel"),box[i]);
	}	

}

/*
	面板组件控制器
*/
Mo.Planer = function(box){
	
	var box = box;
	
	/*
		表格对象
		obj		参照对象
		level	层次
	*/
	this.getTable = function( obj, level ){
		var lev = level ? level : 5;
		var tab = obj;
		//obj.parentNode.parentNode.parentNode.parentNode.parentNode
		while( lev > 0 ){
			tab = tab.parentNode;
			lev--;
		}
		return tab;
	}
	
	/*
		删除组件
		obj		参照对象
		level	层次
	*/
	this.remove = function( obj, level ){
		if( this.getNodes(box) == 1 ){
			alert('只剩下一个啦！');
			return;
		}								
			
		if( confirm('确定要删除掉这个吗？') ){
			var tab = this.getTable( obj, level );								
			Mo(tab).remove();
		}
	}
	
	/*
		新建组件
		func	回调函数		
	*/
	this.copy = function(func){
		
		//var tag = this.getFirst(box).cloneNode(true);
		var tag = this.getLast(box).cloneNode(true);
		
		try{			
			Mo( 'input,textrea', tag ).value('');			
			Mo( '*[data-remove=true]', tag ).remove();			
		}catch(e){			
		}
		
		box.appendChild(tag);		
		//tag.scrollIntoView(true);
		
		if( typeof func == 'function'){
			func(tag);
		}
	}
	
	this.move = function( obj, dest, level ){
		
		var tab = this.getTable( obj, level );
				
		//非固定
		if( tab.getAttribute("fixed") ) return;				
		
		if( dest == "down" ){
		
			var next = Mo( tab ).next( true );
			
			if( next == null ){
			
				return false;
				
			}else{
				
				//非固定
				if( !next || next.getAttribute("fixed") ) return;
				
				//交换节点
				tab.swapNode( next );
			}
		}
		
		if( dest == "up" ){
		
			var prev = Mo( tab ).prev( true );
		
			if( prev == null ){
			
				return false;
				
			}else{
				
				//非固定
				if( !prev || prev.getAttribute("fixed") ) return;
				
				//交换节点
				tab.swapNode( prev );
			}
		}						
		
	}
	
	//子节点数量
	this.getNodes = function(n){
		var x = n.childNodes;
		
		var z=0;
		for (var i=0;i<x.length;i++){
			if (x[i].nodeType==1){
				z++;
			}
		}
		
		return z;
	}
	
	//第一个节点
	this.getFirst = function(n){
		var x = n.firstChild;
		while ( x && x.nodeType!=1){
			x = x.nextSibling;
		}
		return x;
	}
	
	//最后一个节点
	this.getLast = function(n){
		var x = n.lastChild;
		while ( x && x.nodeType!=1){
			x = x.previousSibling;
		}
		return x;
	}

	
	//下一个节点
	/*
	this.getNext = function(n){
		var x = n.nextSibling;
		while ( x && x.nodeType!=1){
			x = x.nextSibling;
		}
		return x;
	}
	
	//上一个节点
	this.getPrev = function(n){
		var x = n.previousSibling;
		while ( x && x.nodeType!=1 ){
			x = x.previousSibling;
		}
		return x;
	}
	*/
		
}

/*
	筛选表格
	
	参数：
		table		表格对象或ID
		fun			匿名修理函数
	
	返回：
		tr			行对象
		event		event对象
*/
Mo.Table = function(table,funs){
	
	if(typeof table == 'string') table = $(table);
	var tr = table.getElementsByTagName("tr");
	
	for(var i=0;i<tr.length;i++){
		
		var self = tr[i];
		
		for(var n=0;n<funs.length;n+=2){
			(function(){
				var evt = funs[n];
				var fun = funs[n+1];
				self['on'+evt] = function(e){
					var e = e || event;
					fun(this,e);
				}
			})();
		}
		
	}
}

/*
	操作消息
	用于页面操作反馈
	
	参数：
		id			信息框ID
		class		附加的样式名称
		html		信息框内容
		time		显示时间,秒
		config	配置
		func		回调函数
*/
Mo.Message = function( style, html, time, config, func ){

	//空函数
	if( typeof func != 'function' ) var func = function(){};
	
	//配置选项
	var config = config ? config : {};

	//分配ID
	var id = ( config["unique"] ? config["unique"] : Mo.random(10) );

	///////////////////////
	
	//空消息
	if( !html ) return;

	//对象已存，直接显示
	Mo( "#"+id ).remove();

	//创建对象
	Mo( document.body ).create( "div" , { "id" : id, "className" : style, "innerHTML" : html } );
	
	//居中显示
	if( config["center"] ){
		
		//滚动条位置
		var src = Mo.Toolkit.getScrollPosition();
		
		//视口位置
		var vie = Mo.Toolkit.getViewportSize();

		//对象位置
		var pos = Mo( "#"+id ).position();
	
		Mo( "#"+id ).style( {
			"position" 	: "absolute",
			"left" : (vie.width-pos.width)/2 + "px", 
			"top" : src.top + (vie.height/2) - (pos.height/2) + "px"
		});
	
	}
	
	window.setTimeout(function(){
	
		//隐藏对象
		Mo( "#"+id ).hide();
		
		//回调函数
		func( Mo( "#"+id ).item(0) );
		
	},1000*time);
	
}

/*
	小纸条/小提示
	用于页面任何位置
	替代	Mo.ShowSelect
	
	参数：
		self	定位参照对象
		event	事件对象
		style	样式名称
		html	写入内容		
		action	关闭纸条的事件名称[ 'mouseout'|'click' 等等 ]
		fX	修正X位置
		fY	修正Y位置
		config	配置
*/
		
Mo.Tips = function( self, event, style, html, action, fX, fY, config ){

	//停止冒泡
	Mo.Event( event ).stop();
	
	//配置选项
	var config = config ? config : {};

	//分配ID
	var id = ( config["unique"] ? config["unique"] : Mo.random(10) );

	///////////////////////

	//对象已存，直接显示
	Mo( "#"+id ).remove();

	//创建对象
	Mo( document.body ).create( "div" , { "id" : id, "className" : style } );

	//对象位置
	var pos = Mo( self ).position();

	//修正位置
	fX = fX ? fX : 0 ;
	fY = fY ? fY : 0 ;

	///////////////////////

	//设置样式
	Mo( "#"+id ).style( {

		"position" 	: "absolute",
		"left"	 	: pos.left + fX +"px",
		"top" 		: pos.top + fY   +"px"

	}).bind( 'click' , function( index, e ){

		//停止冒泡
		if( config['bubble'] ) Mo.Event( e ).stop();

	}).html( html );
	
	////////////////////////	

	//空白处点击时隐藏
	Mo( document ).bind( action ? action : 'mouseover' , function( index, e ){

		var ele = Mo.Event( e ).element();

		if( self != ele ){

			//回调函数
			Mo( "#"+id ).hide();

		}

	});
	
}

/*
	淡入淡出幻灯片
	原作者：王晓斌 (http://www.13100.net/?action=show&id=40)
	
	方法：
		Add(o)					添加HTML对象
		Play(n)					开始播放幻灯片 [n 默认页索引,不能为空]
		onChange(n)			回调函数,返回当前页索引
		
	属性：
		Speed					图片淡入淡出的速度(默认10)[毫秒]
		Timer						图片切换的时间(默认2000)[毫秒]
*/
Mo.FadeBox = function() {
    this.Speed = 10;
    this.Timer = 2000;
    this.Alpha = 100;
    this.iCounter = 0;
    this.iCurrent = 0;
    this.iClock = null;
    this.Images = new Array();
	
	//添加
    this.Add = function(o) {
        this.Images[this.iCounter]=o;
        this.iCounter++;
    }
	
	var self = this;
	
	//播放时调用
	this.onChange= function(){
		
	}
	
	//淡入
    this.FadeIn = function() {
		var obj=this.Images[this.iCurrent];
		var style= "filter:alpha(opacity="+ parseInt(this.Alpha++) +"); opacity:"+ (this.Alpha++/100) +";";
        
		obj.style.cssText=style;
		obj.setAttribute("style",style);		
		
        if (this.Alpha >= 100) {
            window.clearInterval(this.iClock);
            this.iClock = null;
            this.Play();
            this.onChange(this.iCurrent);
        }
    }
	
	//淡出
    this.FadeOut = function() {
		var obj=this.Images[this.iCurrent];
		var style= "filter:alpha(opacity="+ parseInt(this.Alpha--) +"); opacity:"+ (this.Alpha--/100) +";";
        
		obj.style.cssText=style;
		obj.setAttribute("style",style);		
	
        if (this.Alpha <= -10){
            window.clearInterval(this.iClock);
            this.iClock = null;
			
			//隐藏当前
			this.Images[this.iCurrent].style.display="none";
			
			//显示下一页
			if(this.iCurrent+1==this.Images.length){
				this.iCurrent=0;
			}else{
				this.iCurrent++;
			}
			
			//初始下一页
			var obj=this.Images[this.iCurrent];
			var style= "filter:alpha(opacity=1); opacity:0.01; display:;";
			obj.style.cssText=style;
			obj.setAttribute("style",style);		

			this.iClock = setInterval(function(){self.FadeIn();},this.Speed);
        }
    }
	
	//下一个
    this.PlayNext = function() {
        this.iClock = setInterval(function(){self.FadeOut();},this.Speed);
    }
	
	//播放
    this.Play = function(n) {
		if(typeof(n)=="number"){
			//初始化
			for(var i=0;i<this.iCounter;i++){
				this.Images[i].style.display="none";
			}
			
			this.iCurrent=n;
			
			//默认页
			this.Images[n].style.display="";
		}

		setTimeout(function(){self.PlayNext();},this.Timer);
    }
}


/*
	选项卡/滑动门
	
	方法：
		Add(o,t)					添加卡片 [o 选项对象] [t 卡片对象]
		TabClass(a,d)			选项样式 [a 响应时样式] [d 未响应样式]
		BoxClass(a,d)			容器样式 [a 响应时样式] [d 未响应样式]
		Play(t)					播放第几张卡片 [t 卡片索引,从0开始]
		Auto(s)					自动播放选项卡 [s 毫秒后自动播放下一张卡片]
		onChange(n)			回调函数,返回当前页索引
		
	参数：
		e							侦听事件 [click | mouseover]
*/
Mo.TabMenu = function(e){
	this.Event = e;
	this.Cur=-1;
	this.Inter=null;
	this.Speed=0;
	
	this.Array = new Array();
	this.TClass = ["",""];
	this.BClass = ["",""];
	
	//选项卡样式
	this.TabClass = function(a,d){
		 this.TClass=[a,d];
	}

	//内容卡样式
	this.BoxClass = function(a,d){
		 this.BClass=[a,d];
	}

	//添加新选项卡
	this.Add = function(o,t){
		if(o && t){
			this.Array[this.Array.length]=[o,t];
		}
	}
	
	//选项卡改动时调用
	this.onChange = function(){
		
	}

	//选项卡改动
	this.Change = function(tab){
	
		if( tab >= this.Array.length ) return false;
	
		for(var n=0; n< this.Array.length ;n++){
		
            if(this.TClass[0] || this.TClass[1]){
                this.Array[n][0].className=this.TClass[1];
			}
			
			//附加Class
			if(this.BClass[0] || this.BClass[1]){
				this.Array[n][1].className=this.BClass[1];
			}else{
				this.Array[n][1].style.display="none";
			}
			
		}
		
		var obj=this.Array[tab][0];
		if(this.TClass[0] || this.TClass[1]){
            obj.className=this.TClass[0];
		}
		
		var box=this.Array[tab][1];
		
		//附加Class
		if(this.BClass[0] || this.BClass[1]){
			box.className=this.BClass[0];
		}else{
			box.style.display="";
		}
		
		//暂停播放
		if(this.Inter){
			var self=this;
			box.onmouseover=function(){
				clearInterval(self.Inter);
			}
			box.onmouseout=function(){
				self.Auto(self.Speed);
			}
		}
		
		this.Cur=tab;
		this.onChange(tab);
	}

	//播放选项卡
	this.Play=function(t){
		var self=this;
		
		for(var n=0; n< this.Array.length ;n++){		
			var obj=this.Array[n][0];			
			(function(){    
				var tab=n;
				obj["on"+self.Event]=function(){
					self.Change(tab);
					clearInterval(self.Inter);
				}
				obj["onmouseout"]=function(){
					self.Auto(self.Speed);
				}
			})();

		}
		
		if(t<=this.Array.length-1){
			this.Change(t);
		}else{
			this.Change(0);
		}
	}
	
	//自动播放
	this.Auto=function(s){
		if(s){
			this.Speed=s;
			var self=this;
			
			this.Inter=window.setInterval(function(){
				if((self.Cur+1)<=self.Array.length-1){
					self.Cur++;
					self.Change(self.Cur);
				}else{
					self.Change(0);
				}
			},s);
		}
	}
}

/*
	数字选择器
	object	Input对象
	value	JSON数据
	title	标题
	min		起始值
	max		结束值
	line	每行数量
*/
Mo.Soler = function( self, event, value, style, data, func, fX, fY ){

	//空函数
	if( typeof func != 'function' ) var func = function(){};

	//停止冒泡
	Mo.Event( event ).stop();
		
	///////////////////////

	//分配ID
	var id = "_timer_";

	//对象已存，直接显示
	Mo( "#"+id ).remove();

	//创建对象
	Mo( document.body ).create( "dl" , { "id" : id, "className" : style } );

	//对象位置
	var pos = Mo( self ).position();

	//修正位置
	fX = fX ? fX : 0 ;
	fY = fY ? fY : 0 ;
	
	///////////////////////

	//设置样式
	Mo( "#"+id ).style( {

		"position" 	: "absolute",
		"left"	 	: pos.left + fX +"px",
		"top" 		: pos.top + fY  +"px",		
		"zIndex"	: "99999"

	}).bind( 'click' , function( index, e ){

		//停止冒泡
		Mo.Event( e ).stop();

	});
		
	//var tim = Mo.String( value ).trim().output();

	//颜色值，优先取默认值，否则来自自定义属性
	var selected = value ? value : Mo( self ).attr( "_value_" );
		
	for( var key in data ){
	
		var dt = Mo.create( "dt" , { "innerHTML" : key } );
		
		var dd = Mo.create( "dd" );
		
		var ul = Mo.create( "ul" );

		for(var i in data[key]){
		
			(function(){
	
				//颜色值，转成大写
				var value = data[key][i];
					
				var li = Mo.create( "li", { "innerHTML" : value, "className" : ( selected == value ? "active" : "" ) } );				

				Mo( li ).bind( 'click' , function( index, e ){
	
					/*
						回调函数
						color	颜色值
						self	当前对象
					*/
					func.call( self, value, self );
	
					//停止冒泡
					Mo.Event( e ).stop();
	
					//隐藏对象
					Mo( "#"+id ).hide();
	
					//保存颜色到自定义属性
					Mo( self ).attr( { "_value_" : value } );
	
				});
	
				Mo( ul ).append( li );
			
			})();

		}
		
		Mo( dd ).append( ul );
		
		Mo( "#"+id ).append( dt, dd );
	
	}

	//空白处点击时隐藏
	Mo( document ).bind( 'click' , function( index, e ){

		var ele = Mo.Event( e ).element();

		if( self != ele ){

			//回调函数
			Mo( "#"+id ).hide();

		}

	});
	
}


/*state*/
Mo.plugin.push("ui");