/*!
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*
*	#表单扩展，包括表单验证、序列化、配置项等#
*	最后修改：8:47 2015/3/23
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}

//校验日期
function isDOBvalid(Day,Month,Year,name){
	var ArrDays=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	if (Year.value%4==0)													
	{
		ArrDays[1]=29;			
	}
	if ( Day.value > ArrDays[Month.value-1]){
		ArrDays[1]=28;
		alert("Enter Valid Date " + name);
		Day.focus();
		return false;
	}
}



//全角转半角
function switchChar(str){
	var str1="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var str2="１２３４５６７８９０ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ";

	var len=str.length;
	for(var i=0; i<len; i++){
		var n = str2.indexOf(str.charAt(i));
		if(n != -1) str = str.replace(str.charAt(i), str1.charAt(n));
	}
	return str;
}

/////////////////////////////////

/*
	密码强度测试
*/
Mo.Password = function( string, func ){

	//空函数
	if( typeof func != 'function' ) var func = function(){};
	
	////////////////////////////
	
	//级别
	var Level = ["极佳","很好","一般","简单"];
	
	//强度值
	var LevelValue = [40,30,20,0];
	
	//字符加数,分别为字母，数字，其它
	var Factor = [1,2,5];
	
	//密码含几种组成的加数 
	var KindFactor = [0,0,10,20];
	
	//字符正则数字正则其它正则
	var Regex = [/[a-zA-Z]/g,/\d/g,/[^a-zA-Z0-9]/g];
	
	//返回级别数值
	var StrengthValue = function(pwd){
		var strengthValue = 0;
		var ComposedKind = 0;
		for(var i = 0 ; i < Regex.length;i++){
			var chars = pwd.match(Regex[i]);
			if(chars != null){
				strengthValue += chars.length * Factor[i];
				ComposedKind ++;
			}
		}
		strengthValue += KindFactor[ComposedKind];
		return strengthValue;
	};
	
	//返回级别信息
	var StrengthLevel = function(pwd){
		var value = StrengthValue(pwd);
		for(var i = 0 ; i < LevelValue.length ; i ++){
			if(value >= LevelValue[i] ){
				return { "level":Level[i], "pos":i };
			}
		}
	};
	
	/////////////////////////
	
	var test = StrengthLevel( string );
	
	//回调
	func( StrengthValue( string ), test["level"], test["pos"] );
	
}

///////////////////////////////////

/*
	序列化表单
	form		表单对象	
	func		是否将值编码，传入编码函数，默认使用 encodeURIComponent
	link		是否将结果转换为 URL 字符串，请使用 &
	prefix		键前辍，适用于 Ajax，请使用 &
*/
Mo.Serialize = function( form, func, link, prefix ){

	//空函数
	if( typeof func != 'function' ){
		var func = function( str ){ return str ? encodeURIComponent( str ) : ''; };
	}
	
	var pix = prefix ? prefix : '';
	
	//////////////////////////////////////////
	
	//临时数组
	var data = {};

	/*遍历表单元素*/
	var len = form.elements.length;
	for (var i=0; i<len; i++){
	
		var ele	= form.elements[i];
		var key	= func(ele.name);
		var val	= ele.value;
	
	 	/*忽略没有名字元素*/
		if ( !key ) continue;
		
		var key = i == 0 ? key : pix + key;
			
		/*处理其它元素*/
		switch( ele.type ){
		
			case "select-one":
				var opt = ele[ele.selectedIndex];
				data[key] = func( opt.attributes && opt.attributes.value && !(opt.attributes.value.specified) ? opt.text : opt.value );
			break;
		
			case "select-multiple":
				for (var x = 0; x < ele.length; x++) {					
					if( ele[x].selected ){							
						data[key] = func(ele[x].value);
					}					
				}
			break;
			
			case "radio":
				if( ele.checked ){
					data[key] = func(ele.value);
				}					
			break;
			
			case "checkbox":
				if( ele.checked ){							
					data[key] = func(ele.value);
				}					
			break;
			
			default:
				data[key] = func(val);
			break;
		}
		
	}
	
	///////////////////////
	
	//转换成 URL 请求字符串
	if( link ){
		var str = '';
		//拼接url
		for ( var key in data ) {
			str += link + key +'=' + ( data[key] || '' );
		}
		data = str;
	}
	
	return data;
}


/*
	处理JSON数据
	value	JSON数据
*/
Mo.Config = function( value ){
	this.Value = value;
	this.Length = 0;
	this.JSON = '';
	this.Array = [];
	
	if( !this.Value ){
		this.Value = '{}';
	}
	
	this.JSON = eval('('+this.Value+')');
	
	var self = this;
	
	//处理JSON
	this.setJSON = function(){	
		for (var k in self.JSON) {
			
			if( k == "*" && self.Array[k] =="*" ){
				delete self.JSON[k];
				continue;
			}
			
			self.Array[k] = self.JSON[k];
			self.Length++;
		}
		//alert(self.JSON);
	}();
	
	//返回JSON
	this.getJSON = function(){
		var json = '';
		var i=1;
		for (k in this.Array) {
			
			if( k == "*" && this.Array[k] =="*" ){
				this.Length=this.Length-1;
				delete this.Array[k];
				continue;
			}
			
			json += '"' + k + '":"' + this.Array[k].toString().replace(/"/g,'\\"').replace(/(\r\n)/g,'<br />') + '"' + (this.Length>i?',':'');
			i++;
		}
		//return '{'+json+'}';
		return '{'+( json.substr(json.length-1) == ',' ? json.substr(0,json.length-1) : json )+'}';
	}
	
	//获取值
	this.getValue = function(key){
		return this.Array[key];
	}
	
	//设置值
	this.setValue = function(action,key,value,func){
	
		//add
		if(action){
			if(!this.Array[key]){
				this.Length++;
			}
			this.Array[key] = value.toString();
		}else{
			//delete
			if(this.Array[key]){
				delete this.Array[key];
				this.Length--;
			}
		}
		
		//var json = this.getJSON();		
		
		if(typeof func == 'function'){
			func(this.getJSON());	
		}
	}
}

/* 
  表单遍历检查（那些具有自定义属性的元素）
  示例:
  onsubmit="return Mo.ValidForm(this,function(i){alert(i);});"
  onsubmit="return Mo.ValidForm(this,null);"
  
  form		表单对象
  func		回调函数,返回错误信息(string)
  desc		元素描述文本样式
*/

Mo.ValidForm = function( form , func ){

	//空函数
	if( typeof func != 'function' ) var func = function( err ){ alert(err);};
	
	//表单元素数量
	var len = form.elements.length;
				
	for ( var i=0; i<len; i++ ){
	
		//当前元素
		var ele		= form.elements[i];
		
		//自定义名称
		var _name	= ele.getAttribute("data-valid-name");

		//描述信息
		var _desc	= ele.getAttribute("placeholder");

		//清空描述信息
		if( _desc && ele.value == _desc ) ele.value = '';
	
	 	/* 非自定义属性的元素不予理睬 */
		if ( !_name ) continue;
	
	 	/* 已禁用的元素不予理睬 */
		if ( ele.disabled === true ) continue;
		
		/* 校验当前元素 */
		if ( Mo.ValidForm.Element( ele, func ) === false ){
			return false;
		}
	}
	
	return true;
}

/*
  检查表单元素【此函数配合 Mo.ValidForm 而使用】
  
  /////////////////////////////////
  
  ele		表单元素
  func	回调函数
  
  /////////////////////////////////

  元素支持以下自定义属性：

  data-valid-name			元素别名  		    *不为空时才校验其值*
  
  注意：以下属性值取值范围
  "no" 不强制(值可为空,不为空时检查)
  "yes" 为强制检查
  
  data-valid-empty	    	为空检查
  data-valid-number	  	数字类检查
  data-valid-secure		 	安全字符检查
  data-valid-password  	密码类型属性，会自动启用 data-valid-secure 属性                	
  data-valid-ip		   		 IP地址型属性
  data-valid-url		  		URL地址验证
  data-valid-idcard		  		身份证号属性
  data-valid-email		  	邮箱地址验证
  data-valid-phone		    电话号码属性
  data-valid-mobile	  		手机号码属性
  data-valid-datetime	 	  	时间日期属性
  data-valid-regexp	 	  	正则表达式
  data-valid-minsize	  	字符最小长度
  data-valid-maxsize	  	字符最大长度
  data-valid-accept			文件上传扩展名
  data-valid-confirm		对比两值是否相同
  
  /////////////////////////////////
  
  返回值：
  true		无错误
  false	有错误，同时调用 func
  
*/

Mo.ValidForm.Element = function( ele , func ){
	
	//自定名称
	var title	 = ele.getAttribute("data-valid-name");
	
	//值
	var val		= ele.value;
	
	//元素类型
	var type	= ele.type;
	
	//元素ID
	var id		= ele.id;
	
	//元素名称
	var name	= ele.name;

	//错误消息
	var err		= "";
	
	////////////////////////////////////////////
			
	//不同类型不同处理
	if( Mo.Array( ['text','textarea','password','hidden','file'] ).indexOf( type ) > -1 ){
	
		/* 值为空测试 */
		var emp		= Mo.Validate.Empty( Mo.String( val ).trim().output() );
		
		/* 内容长度 */
		var size	= Mo.String( val ).length();
		
		/* 非空校验 */
		var chknull = ele.getAttribute("data-valid-empty");		
		if ( chknull == "yes" && emp ){
			err = title+" 不能为空! ";
		}
	
		/* 密码校验 */
		if( type == "password" ){
		
			var chkpwd = ele.getAttribute("data-valid-password");
			
			if ( chkpwd && Mo(chkpwd).size() && Mo(chkpwd).value() != val ){
				err = title+" 输入有误! ";
			};
			
			//这里有问题
			//ele.setAttribute("data-valid-secure","yes");
			
			ele.setAttribute("data-valid-empty","yes");

		}
		
		/* 相同性校验 */
		var chkvalue = ele.getAttribute("data-valid-confirm");
		if ( chkvalue && Mo(chkvalue).value() != val ){
			err = title+" 输入有误! ";
		}
		
		/* 扩展名检查 */
		var chkexte = ele.getAttribute("data-valid-accept");
		var chkexte = chkexte ? chkexte.replace(/[,|，]/ig," ") : '';
		if ( chknull == "yes" && chkexte && Mo.Array( chkexte.split(" ") ).indexOf( ele.value.replace(/.*\./,"").toLowerCase() ) == -1 ){
			err = title+" 不支持此类型文件! ";
		}
	
		/* 最小长度 */
		var minsize = ele.getAttribute("data-valid-minsize");
		if ( size < parseInt(minsize) ){
			err = title+" 未到最小长度："+minsize;
		}
		
		/* 最大长度 */
		var maxsize = ele.getAttribute("data-valid-maxsize");
		if ( size > parseInt(maxsize) ){
			err = title+" 超出最大长度："+maxsize;
		}
		
		/*字符安全性检测*/
		var chksafe = ele.getAttribute("data-valid-secure");
		if ( (chksafe == "yes" && !Mo.Validate.Safe(val)) || (chksafe=="no" && !emp && !Mo.Validate.Safe(val)) ){
			err = title+" 存在非法字符! ";
		}
		
		/* E-mail地址合法性检测 */
		var chkemail = ele.getAttribute("data-valid-email");
		if ( (chkemail== "yes" && !Mo.Validate.Email(val)) || (chkemail=="no" && !emp && !Mo.Validate.Email(val)) ){
			err = title+" 应为电子邮件地址! ";
		}	
		
		/* IP地址合法性检测 */
		var chkip = ele.getAttribute("data-valid-ip");
		if ( (chkip== "yes" && !Mo.Validate.IP(val)) || (chkip=="no" && !emp && !Mo.Validate.IP(val)) ){
			err = title+" 应为IP地址! ";
		}
		
		/* URL地址合法性检测 */
		var chkurl = ele.getAttribute("data-valid-url");
		if ( (chkurl== "yes" && !Mo.Validate.URL(val)) || (chkurl=="no" && !emp && !Mo.Validate.URL(val)) ){
			err = title+" 应为URL地址! ";
		}

		/* 数据类型校验 */
		var chknum=ele.getAttribute("data-valid-number");
		if ( (chknum== "yes" && !Mo.Validate.Number(val)) || (chknum=="no" && !emp && !Mo.Validate.Number(val)) ){
			err = title+" 应为数字! ";
		}

		/* 身份证号校验 */
		var chkid = ele.getAttribute("data-valid-idcard");
		if ( (chkid== "yes" && !Mo.Validate.ID(val)) || (chkid=="no" && !emp && !Mo.Validate.ID(val)) ){
			err = title +" 应为身份证号码! ";
		}
		
		/* 电话号码校验 */
		var chkTel = ele.getAttribute("data-valid-phone");
		if ( (chkTel== "yes" && !Mo.Validate.Phone(val)) || (chkTel=="no" && !emp && !Mo.Validate.Phone(val)) ){
			err = title +" 应为电话号码! ";
		}	

		/* 手机号码校验 */
		var chkMobile = ele.getAttribute("data-valid-mobile");
		if ( (chkMobile== "yes" && !Mo.Validate.Mobile(val)) || (chkMobile=="no" && !emp && !Mo.Validate.Mobile(val)) ){
			err = title +" 应为手机号码! ";
		}

		/* 时间日期校验 */
		var chkDate = ele.getAttribute("data-valid-datetime");
		if ( (chkDate== "yes" && !Mo.Validate.Date(val)) || (chkDate=="no" && !emp && !Mo.Validate.Date(val)) ){
			err = title +" 应为日期格式! ";
		}

		/* 正则表达式校验 */
		var chkRegex = ele.getAttribute("data-valid-regexp");
		if ( chkRegex && val ){
			var re = new RegExp(chkRegex);
			if( !re.test(val) ){
				err = title +" 格式不匹配! ";
			}	
		}
		
	}else{
	
		/* 其它类型检查 */
		switch(type){
			case "select-one":
			
				var val = Mo( ele ).value();
				//var val = Mo("select[name='"+name+"']").value();
				
				if( val == '' && ele.getAttribute("data-valid-empty") == "yes" ){
					err = " 请选择 "+ title;
				}
				
			break;
			
			case "radio":
			
				var val = Mo("input[name='"+ name +"']").value();
				
				if( val == '' && ele.getAttribute("data-valid-empty") == "yes" ){
					err = " 请选择 "+ title;
				}
				
			break;
			
			case "checkbox":
			
				var obj = Mo("input[name='"+ name +"']");
				
				var x=0;
				for( var i=0; i<obj.size(); i++ ){
					if( obj.item(i).checked ){
						x++;
					}
				}
				
				/* 非空校验 */
				var chknull = ele.getAttribute("data-valid-empty");		
				if ( chknull == "yes" && x == 0 ){
					err = title+" 不能为空! ";
				}
				
				var chkMax=ele.getAttribute("data-valid-maxsize");
				var chkMin=ele.getAttribute("data-valid-minsize");
				
				if ( chkMax && chkMax<x ){
					err = title +" 最多只能选 "+chkMax+" 项! ";
				}
				
				if ( chkMin && chkMin>x ){
					err = title +" 至少需要选 "+chkMin+" 项! ";
				}
			
			break;
		}	
	}
	
	//有错误
	if( err ){
		
		//焦点移到可见对象上
		if ( type !="hidden" ){
			try{
				ele.focus();
			}catch(e){
				
			}			
		}

		/*
			回调函数
			err	错误信息
			ele	当前元素
		*/		
		func( err, ele );
	
		return false;
	}

	return true;	
}

/*state*/
Mo.plugin.push("form");