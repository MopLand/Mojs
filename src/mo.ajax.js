/*!
	Mo.js
	javascript framework
	author:
			Wiki[MO]	gwikimo@gmail.com	
			Lay 			veryide@qq.com			
	#Ajax扩展，包括 Ajax构造 等#
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}

/*
	Ajax
	file	文件名称
*/
Mo.Ajax = function(file) {
	this.xmlhttp = null;

	this.resetData = function() {
		this.method = "GET";
		this.URLString = "";
		this.encodeURL = true;
		this.file = file;
		this.late = true;
		this.failed = false;
	};

	this.resetFunctions = function() {
		this.onLoading = function() { };
		this.onLoaded = function() { };
		this.onInteractive = function() { };
		this.onCompletion = function() { };
		this.onError = function() { };
		this.encode = (encodeURIComponent && this.encodeURL)?function(s) {
			return encodeURIComponent(s);
		}:function(s){return s;}
	};

	this.reset = function() {
		this.resetFunctions();
		this.resetData();
	};

	this.createAJAX = function(){
		try {
			this.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		}catch (e1){
			try {
				this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e2) {
				this.xmlhttp = null;
			}
		}
		if (! this.xmlhttp) {
			if (typeof XMLHttpRequest != "undefined") {
				this.xmlhttp = new XMLHttpRequest();
			} else {
				this.failed = true;
			}
		}
	};

	this.setVar = function(name, value) {
		var arr1 = [], arr2 = [];
		if (typeof name == "object" && !value) {
			for(var i in name) {
				arr1[arr1.length] = i;
				arr2[arr2.length] = name[i];
			}
		}
		else {
			arr1[0] = name;
			arr2[0] = value;
		}
		
		var first = (this.URLString.length == 0);
		
		for(var i=0;i<arr1.length;i++) {
			this.URLString += (first)?"":"&";
			this.URLString += arr1[i] + "=" + this.encode(arr2[i]);
		}
	};

	/*
		设置请求头信息
	*/
	this.setHeader = function( key , value ){
		try {
			this.xmlhttp.setRequestHeader( key , value );
		} catch(e) {}
	};

	/*
		返回最终请求地址
	*/
	this.getURL = function(){
		return this.file+"?"+this.URLString;		
	};

	this.send = function(content) {
		if (!content) content = "";
		if (!this.xmlhttp || this.failed ) {
			this.onError();
			return;
		}
		var self = this;
		if (this.method == "GET" || this.method == "GET&POST") {
			this.xmlhttp.open(this.method,this.file+"?"+this.URLString,this.late);
		} else if (this.method == "POST") {
			this.xmlhttp.open(this.method,this.file,this.late);
			try {
				this.xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			} catch(e) {}
		}
		else this.onError();

		this.xmlhttp.onreadystatechange = function() {
			switch (self.xmlhttp.readyState) {
				case 1:
					self.onLoading();
					break;
				case 2:
					self.onLoaded();
					break;
				case 3:
					self.onInteractive();
					break;
				case 4:
					self.response = self.xmlhttp.responseText;					
					self.responseXML = self.xmlhttp.responseXML;
					try{
						var status = self.xmlhttp.status;
					}catch(e){
						var status = "Trouble accessing it";
					}

					if (self.xmlhttp.readyState == 4 || status == "200") {
						self.onCompletion();
					} else {
						self.onError();
					}
					self.URLString = "";
					break;
			}
		};

		if (this.method == "POST") {
			this.xmlhttp.send(this.URLString);
		} else if (this.method == "GET") {
			this.xmlhttp.send(null);
		} else if (this.method == "GET&POST") {
			this.xmlhttp.send(content);
		}
	};

	this.reset();
	this.createAJAX();
};

/*state*/
Mo.plugin.push("ajax");