/*!
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*
*	#效果扩展，包括倒计时、进度条、星级评分等#
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}

/*
	评分组件
	
	box		容器名称
	min		最小评分
	max		最大评分
	def		默认评分
	grey		默认图片
	light		高亮图片
	func		回调函数
*/

Mo.Grade = function( box , min , max , def , grey , light , func ){

	//评分容器
	this.Box = box;
	
	//最小评分
	this.Min = min;
	
	//最大评分
	this.Max = max;
	
	//默认分数
	this.Def = def;

	//默认图片
	this.Grey = grey;

	//高亮图片
	this.Light = light;
	
	//回调函数
	this.Func = func;
	
	///////////////////
	
	var self = this;
	
	//初始化
	this.Inti = function(){
	
		//创建评分图片
		for( var i = this.Min; i <= this.Max ; i++ ){
			Mo( box ).create( "img" , { "data-index" : i , "src" : this.Grey } );		
		}
		
		if( 'ontouchstart' in window ){
			//绑定评分操作
			Mo( box + " img" ).bind( 'touchmove' , function( e ){
				
				//高亮当前
				self.Play( this.getAttribute('data-index') );

				//回调评分
				self.Return( this.getAttribute('data-index') );
				
			}).bind( 'touchend' , function( e ){

				//保存默认
				self.Def = this.getAttribute('data-index');
				
				//回调评分
				self.Return( self.Def );

			});
		}else{
			//绑定评分操作
			Mo( box + " img" ).bind( 'mouseover' , function( e ){
				
				//高亮当前
				self.Play( this.getAttribute('data-index') );

				//回调评分
				self.Return( this.getAttribute('data-index') );
				
			}).bind( 'mouseout' , function( e ){

				//高亮默认
				self.Play( self.Def );

				//回调评分
				self.Return( self.Def );

			}).bind( 'click' , function( e ){

				//保存默认
				self.Def = this.getAttribute('data-index');
				
				//回调评分
				self.Return( self.Def );

			});
		}
	
	}
	
	/*
		高亮部分
		rate	分值
	*/
	this.Play = function( rate ){

		Mo( box + " img" ).each( function( ele , index ){

			//高亮部分
			if( this.getAttribute('data-index') <= rate  ){				
				this.src = self.Light;
			}else{
				this.src = self.Grey;
			}

		});
	
	}
	
	/*
		执行回调
		rate	分值
	*/
	this.Return = function( rate ){
	
		//回调评分
		if( typeof this.Func == 'function' ) this.Func( rate );
	
	}
	
	///////////////
	
	this.Inti();
	
	this.Play( this.Def );

}

/*
	倒计时
	expire		过期时间,Unix 时间戳（秒）
	func		回调函数
*/
Mo.DateDiff = function( expire, func ){

	//空函数
	if( typeof func != 'function' ) var func = function(){};
		
	//过期时间
	if( !expire ){
		return false;
	}
	
	//转换成微秒
	var expire = Math.round(parseInt(expire)*1000);	
		
	//已过期
	if( new Date().getTime() >= expire ){
		//回调	
		func( -1, { "d":0, "h":0, "m":0, "s":0 } );
	}else{
	
		var asd = expire;
		window.setInterval(function(){
		
			//已过期
			if( new Date().getTime() > expire ){
				//回调
				func( -1, { "d":0, "h":0, "m":0, "s":0 } );
			}else{
				var DifferenceHour = -1;
				var DifferenceMinute = -1;
				var DifferenceSecond = -1;
				var daysms = 24 * 60 * 60 * 1000;
				var hoursms = 60 * 60 * 1000;
				var Secondms = 60 * 1000;
				var microsecond = 1000;
				var time = new Date();
				var convertHour = DifferenceHour;
				var convertMinute = DifferenceMinute;
				var convertSecond = DifferenceSecond;
				var Result = Diffms = asd - time.getTime();
				DifferenceHour = Math.floor(Diffms / daysms);
				Diffms -= DifferenceHour * daysms;
				DifferenceMinute = Math.floor(Diffms / hoursms);
				Diffms -= DifferenceMinute * hoursms;
				DifferenceSecond = Math.floor(Diffms / Secondms);
				Diffms -= DifferenceSecond * Secondms;
				var dSecs = Math.floor(Diffms / microsecond);
				
				if(convertHour != DifferenceHour){
					var a = DifferenceHour;
				}
				
				if(convertMinute != DifferenceMinute){
					var b = DifferenceMinute;
				}
				
				if(convertSecond != DifferenceSecond){
					var c = DifferenceSecond;
					var d = dSecs;
				}
				
				//var dd = "clock("+asd+",'"+id+"')";
				//clk.innerHTML=a+"天"+b+"小时"+c+"分钟"+d+"秒";
				
				/*
					回调函数
					Result	相差秒数
					date	[json]
							a	天
							b	小时
							c	分钟
							d	秒
				*/				
				func( parseInt( Result / 1000 ) , { "d":a, "h":b, "m":c, "s":d } );
			}
			
		},1000);
	}
}

/*
	进度条
*/
Mo.Process = function(){
	
	//组列表
	this.groups=[];
	
	var self = this;
	
	var $ = function( id ){ return document.getElementById( id ); }

	/*
		组
		参数：
		gid 唯一组ID
	*/
	this.Group = function(gid){
		self.groups[gid] = {"GID":gid, "COUNT":0, "OPTIONS":[]};
		this.gid = gid;
		
		/*
		参数：
		oid 唯选项ID
		val 值
		*/
		this.Option = function(oid,val){
			val = ( val != 0 ) ? parseInt( val ) : 0;
			self.groups[this.gid]["COUNT"] += val;			
			if( oid !== null ) self.groups[this.gid]["OPTIONS"][oid] = {"OID":oid, "COUNT":val};
		}
		
	}
	
	this.Show = function(){
		for(var x in self.groups){
			
			for(var n in self.groups[x]["OPTIONS"]){
				var p = Math.round( self.groups[x]["OPTIONS"][n]["COUNT"] / self.groups[x]["COUNT"] *100);
				
				(function(){
					var N = n;
					var P = p;
					var i = 0;
					
					var func = function(){
						if( i<=P && i <= 100 ){
							$('option-'+N).style.width = i +'%';
							$('percent-'+N).innerHTML = i +'%';
							i++;
						}else{
							clearInterval(inti);	
						}
					};
					
					var inti = window.setInterval(func, 2);
				
				})();
			}
			
		}
	}
}

/*state*/
Mo.plugin.push("effect");