/*
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*
*	#表单扩展，包括表单验证、序列化、配置项等#
*	最后修改：8:47 2015/3/23
*/
if(typeof Mo!="function"){var Mo={plugin:[]}}function isDOBvalid(Day,Month,Year,name){var ArrDays=new Array(31,28,31,30,31,30,31,31,30,31,30,31);if(Year.value%4==0){ArrDays[1]=29}if(Day.value>ArrDays[Month.value-1]){ArrDays[1]=28;alert("Enter Valid Date "+name);Day.focus();return false}}function switchChar(str){var str1="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";var str2="１２３４５６７８９０ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ";var len=str.length;for(var i=0;i<len;i++){var n=str2.indexOf(str.charAt(i));if(n!=-1){str=str.replace(str.charAt(i),str1.charAt(n))}}return str}Mo.Password=function(string,func){if(typeof func!="function"){var func=function(){}}var Level=["极佳","很好","一般","简单"];var LevelValue=[40,30,20,0];var Factor=[1,2,5];var KindFactor=[0,0,10,20];var Regex=[/[a-zA-Z]/g,/\d/g,/[^a-zA-Z0-9]/g];var StrengthValue=function(pwd){var strengthValue=0;var ComposedKind=0;for(var i=0;i<Regex.length;i++){var chars=pwd.match(Regex[i]);if(chars!=null){strengthValue+=chars.length*Factor[i];ComposedKind++}}strengthValue+=KindFactor[ComposedKind];return strengthValue};var StrengthLevel=function(pwd){var value=StrengthValue(pwd);for(var i=0;i<LevelValue.length;i++){if(value>=LevelValue[i]){return{"level":Level[i],"pos":i}}}};var test=StrengthLevel(string);func(StrengthValue(string),test["level"],test["pos"])};Mo.Serialize=function(form,func,link,prefix){if(typeof func!="function"){var func=function(str){return str?encodeURIComponent(str):""}}var pix=prefix?prefix:"";var data={};var len=form.elements.length;for(var i=0;i<len;i++){var ele=form.elements[i];var key=func(ele.name);var val=ele.value;if(!key){continue}var key=i==0?key:pix+key;switch(ele.type){case"select-one":var opt=ele[ele.selectedIndex];data[key]=func(opt.attributes&&opt.attributes.value&&!(opt.attributes.value.specified)?opt.text:opt.value);break;case"select-multiple":for(var x=0;x<ele.length;x++){if(ele[x].selected){data[key]=func(ele[x].value)}}break;case"radio":if(ele.checked){data[key]=func(ele.value)}break;case"checkbox":if(ele.checked){data[key]=func(ele.value)}break;default:data[key]=func(val);break}}if(link){var str="";for(var key in data){str+=link+key+"="+(data[key]||"")}data=str}return data};Mo.Config=function(value){this.Value=value;this.Length=0;this.JSON="";this.Array=[];if(!this.Value){this.Value="{}"}this.JSON=eval("("+this.Value+")");var self=this;this.setJSON=function(){for(var k in self.JSON){if(k=="*"&&self.Array[k]=="*"){delete self.JSON[k];continue}self.Array[k]=self.JSON[k];self.Length++}}();this.getJSON=function(){var json="";var i=1;for(k in this.Array){if(k=="*"&&this.Array[k]=="*"){this.Length=this.Length-1;delete this.Array[k];continue}json+='"'+k+'":"'+this.Array[k].toString().replace(/"/g,'\\"').replace(/(\r\n)/g,"<br />")+'"'+(this.Length>i?",":"");i++}return"{"+(json.substr(json.length-1)==","?json.substr(0,json.length-1):json)+"}"};this.getValue=function(key){return this.Array[key]};this.setValue=function(action,key,value,func){if(action){if(!this.Array[key]){this.Length++}this.Array[key]=value.toString()}else{if(this.Array[key]){delete this.Array[key];this.Length--}}if(typeof func=="function"){func(this.getJSON())}}};Mo.ValidForm=function(form,func){if(typeof func!="function"){var func=function(err){alert(err)}}var len=form.elements.length;for(var i=0;i<len;i++){var ele=form.elements[i];var _name=ele.getAttribute("data-valid-name");var _desc=ele.getAttribute("placeholder");if(_desc&&ele.value==_desc){ele.value=""}if(!_name){continue}if(ele.disabled===true){continue}if(Mo.ValidForm.Element(ele,func)===false){return false}}return true};Mo.ValidForm.Element=function(ele,func){var title=ele.getAttribute("data-valid-name");var val=ele.value;var type=ele.type;var id=ele.id;var name=ele.name;var err="";if(Mo.Array(["text","textarea","password","hidden","file"]).indexOf(type)>-1){var emp=Mo.Validate.Empty(Mo.String(val).trim().output());var size=Mo.String(val).length();var chknull=ele.getAttribute("data-valid-empty");if(chknull=="yes"&&emp){err=title+" 不能为空! "}if(type=="password"){var chkpwd=ele.getAttribute("data-valid-password");if(chkpwd&&Mo(chkpwd).size()&&Mo(chkpwd).value()!=val){err=title+" 输入有误! "}ele.setAttribute("data-valid-empty","yes")}var chkvalue=ele.getAttribute("data-valid-confirm");if(chkvalue&&Mo(chkvalue).value()!=val){err=title+" 输入有误! "}var chkexte=ele.getAttribute("data-valid-accept");var chkexte=chkexte?chkexte.replace(/[,|，]/ig," "):"";if(chknull=="yes"&&chkexte&&Mo.Array(chkexte.split(" ")).indexOf(ele.value.replace(/.*\./,"").toLowerCase())==-1){err=title+" 不支持此类型文件! "}var minsize=ele.getAttribute("data-valid-minsize");if(size<parseInt(minsize)){err=title+" 未到最小长度："+minsize}var maxsize=ele.getAttribute("data-valid-maxsize");if(size>parseInt(maxsize)){err=title+" 超出最大长度："+maxsize}var chksafe=ele.getAttribute("data-valid-secure");if((chksafe=="yes"&&!Mo.Validate.Safe(val))||(chksafe=="no"&&!emp&&!Mo.Validate.Safe(val))){err=title+" 存在非法字符! "}var chkemail=ele.getAttribute("data-valid-email");if((chkemail=="yes"&&!Mo.Validate.Email(val))||(chkemail=="no"&&!emp&&!Mo.Validate.Email(val))){err=title+" 应为电子邮件地址! "}var chkip=ele.getAttribute("data-valid-ip");if((chkip=="yes"&&!Mo.Validate.IP(val))||(chkip=="no"&&!emp&&!Mo.Validate.IP(val))){err=title+" 应为IP地址! "}var chkurl=ele.getAttribute("data-valid-url");if((chkurl=="yes"&&!Mo.Validate.URL(val))||(chkurl=="no"&&!emp&&!Mo.Validate.URL(val))){err=title+" 应为URL地址! "}var chknum=ele.getAttribute("data-valid-number");if((chknum=="yes"&&!Mo.Validate.Number(val))||(chknum=="no"&&!emp&&!Mo.Validate.Number(val))){err=title+" 应为数字! "}var chkid=ele.getAttribute("data-valid-idcard");if((chkid=="yes"&&!Mo.Validate.ID(val))||(chkid=="no"&&!emp&&!Mo.Validate.ID(val))){err=title+" 应为身份证号码! "}var chkTel=ele.getAttribute("data-valid-phone");if((chkTel=="yes"&&!Mo.Validate.Phone(val))||(chkTel=="no"&&!emp&&!Mo.Validate.Phone(val))){err=title+" 应为电话号码! "}var chkMobile=ele.getAttribute("data-valid-mobile");if((chkMobile=="yes"&&!Mo.Validate.Mobile(val))||(chkMobile=="no"&&!emp&&!Mo.Validate.Mobile(val))){err=title+" 应为手机号码! "}var chkDate=ele.getAttribute("data-valid-datetime");if((chkDate=="yes"&&!Mo.Validate.Date(val))||(chkDate=="no"&&!emp&&!Mo.Validate.Date(val))){err=title+" 应为日期格式! "}var chkRegex=ele.getAttribute("data-valid-regexp");if(chkRegex&&val){var re=new RegExp(chkRegex);if(!re.test(val)){err=title+" 格式不匹配! "}}}else{switch(type){case"select-one":var val=Mo(ele).value();if(val==""&&ele.getAttribute("data-valid-empty")=="yes"){err=" 请选择 "+title}break;case"radio":var val=Mo("input[name='"+name+"']").value();if(val==""&&ele.getAttribute("data-valid-empty")=="yes"){err=" 请选择 "+title}break;case"checkbox":var obj=Mo("input[name='"+name+"']");var x=0;for(var i=0;i<obj.size();i++){if(obj.item(i).checked){x++}}var chknull=ele.getAttribute("data-valid-empty");if(chknull=="yes"&&x==0){err=title+" 不能为空! "}var chkMax=ele.getAttribute("data-valid-maxsize");var chkMin=ele.getAttribute("data-valid-minsize");if(chkMax&&chkMax<x){err=title+" 最多只能选 "+chkMax+" 项! "}if(chkMin&&chkMin>x){err=title+" 至少需要选 "+chkMin+" 项! "}break}}if(err){if(type!="hidden"){try{ele.focus()}catch(e){}}func(err,ele);return false}return true};Mo.plugin.push("form");