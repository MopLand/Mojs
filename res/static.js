
/*
	打印对象信息
	data	数据
*/
function dump( data ){
	var str = '';
	for( var key in data ){
	      str += '"'+ key +'" : "'+data[key]+'",';  
	}
	return ( '{'+str+'}' ).replace(/,\}/g,'}');
}

//DOM 载入后执行
Mo.ready(function(){

	Mo("#build").html( "当前版本：" + Mo.version + " 最后更新：" + Mo.build );
	
	///////////////////////////////
	
	//当前路径，过滤掉 # 以后的内容
	var self = location.href.replace(/#([\S\s])*$/,'');
	
	//处理导航
	Mo("#naver ul li a").each(function(){
		
		//log to api
		/*
		if( ele.innerHTML == "Logs" ){
			ele.innerHTML = 'API';	
			ele.href = 'api.html';
		}
		*/
		
		//高亮当前，如果在 api 目录时高亮 api.html
		if( 
		   this.href == self || 
		   ( self.substring( self.length-1 , self.length ) == "/" && this.href.indexOf("index.html") > -1 ) ||
		   ( this.href.indexOf("api.html") > -1 && self.indexOf("api/") > -1 )
		){
			this.className = "active";
		}
		
	});
	
	
	//在 api 目录时，链接指向上一级
	/*
	if( self.indexOf("api/") > -1 ){
	
		Mo("#naver ul li a").each(function(ele){
			Mo( ele ).attr( { "href" : "../" + Mo( ele ).attr( "href" ) } );	
		});
	
	}
	*/
	
	///////////////////////////////
	
	//搜索处理
	Mo("#search input").bind('focus',function(){
	
		this.value = ( this.value == this.defaultValue ) ? "" : this.value;
		
	}).bind('blur',function(){
	
		this.value = !this.value ? this.defaultValue : this.value;
		
	});
	
	///////////////////////////////
	
	//目录索引
	Mo("#entry").insert( 'dl', {
		"id" : "index",
		"innerHTML" : "<dt>本页目录</dt><dd><ul></ul></dd>"
	});	
	
	//创建索引
	Mo("#entry dt").each(function(){
		
		//条目名称
		var text = Mo.String( this.innerHTML ).trim().output();		
		var hash = escape( text );
		
		//加入到索引
		Mo("#index dd ul").create( 'li', {
			"innerHTML" : "<a href='#"+ hash +"'>"+ text +'</a>'
		});
		
		//创建锚点
		Mo( this ).create( 'a', {
			"name" : hash
		});

	});	
	
	///////////////////////////////

	//返回顶部
	Mo( Mo.document ).create( 'div', {
		"id" : "top",
		"title" : "返回顶部"
	});
	
	Mo("#top").bind( "click" , function(){ window.scrollTo(0,0); } )
	
	var func = function(){
	
		var scroll = Mo.Toolkit.getScrollPosition();
		var viewPortHeight = parseInt(document.documentElement.clientHeight);
		var scrollHeight = parseInt(document.body.getBoundingClientRect().top);
		
		if (scrollHeight < -100) {
			Mo("#top").style({'visibility':'visible'});
		} else {
			Mo("#top").style({'visibility':'hidden'});
		}
		
		if( viewPortHeight + scroll.top + 50 >= document.body.scrollHeight ){
			Mo("#top").style({'bottom':'48px'});
		}else{
			Mo("#top").style({'bottom':'0px'});
		}
	
	}
	
	func();
	
	Mo( document ).bind( 'scroll', function(){
		func();
	});
	
	Mo( document.documentElement ).bind( 'scroll', function(){
		func();
	});

});

/* plugin */
Mo.plugin.push("static");