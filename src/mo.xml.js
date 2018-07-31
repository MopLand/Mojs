/*!
*	(C)2009-2013 VeryIDE
*	Mo.js
*	author:
*			Wiki[MO]	gwikimo@gmail.com	
*			Lay 		veryide@qq.com
*
*	#XML 解析和转换工具，支持 xml 和 json 互转
*/

if(typeof Mo != 'function'){
	var Mo = { plugin:[] }
}


Mo.XML = {
	
	/*
		将字符串转成 XML 对象
		text	字符串
	*/
	parseXML : function( text ){
        if (window.ActiveXObject){
          var doc=new ActiveXObject('Microsoft.XMLDOM');
          doc.async='false';
          doc.loadXML(text);
        } else {
          var parser=new DOMParser();
          var doc=parser.parseFromString(text,'text/xml');
        }
        return doc;
    },
    
    
	// Changes XML to JSON
	// fixed some bugs from http://davidwalsh.name/convert-xml-json
	// October 9, 2012
	// Brian Hurlow
	/*
	 * @param {Object} xml
	 * @param {Boolean} strip if true, strip empty (whitespace) nodes
	*/
	getJSON : function( xml, strip ) {
	
		// Default strip setting by Lay
		var strip = ( typeof strip == 'undefined' ? true : strip );
		
		// Create the return object
		var obj = {};
	 
		// console.log(xml.nodeType, xml.nodeName );
		
		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} 
		else if (xml.nodeType == 4) { // cdata section
			obj = xml.nodeValue
		}
		else if( xml.nodeType == 3 ){ // textnode by Lay
			obj = strip ? xml.nodeValue.replace(/^\s+|\s+$/g, '') : xml.nodeValue;
		}
	 
		// do children
		if ( xml.hasChildNodes() ) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				
				//ignore whitespace by Lay
				if ( strip && ( item.nodeType == 8 || item.nodeType == 3 && !/[^\s]/.test(item.nodeValue) ) ) {
					// that is, if it's a whitespace text node
					xml.removeChild(item);
					i--;
					continue;
				}
				
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = Mo.XML.getJSON( item, strip );
				} else {
					if (typeof(obj[nodeName].length) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					if (typeof(obj[nodeName]) === 'object') {
						obj[nodeName].push( Mo.XML.getJSON( item, strip ) );
					}
				}
			}
		}
		return obj;
	},
	
	
	/*	This work is licensed under Creative Commons GNU LGPL License.
	
		License: http://creativecommons.org/licenses/LGPL/2.1/
	   Version: 0.9
		Author:  Stefan Goessner/2006
		Web:     http://goessner.net/ 
		http://goessner.net/download/prj/jsonxml/
	*/
	getXML : function( object, tidy ) {
	
	   var toXml = function(v, name, ind) {
	      var xml = "";
	      
	      if (v instanceof Array) {
	         for (var i=0, n=v.length; i<n; i++){
		         xml += ind + toXml(v[i], name, ind + ( tidy ? '\t' : '' )) + ( tidy ? '\n' : '' );
	         }
	      }
	      else if (typeof(v) == "object") {
	      
	         var hasChild = false;
	         
	         xml += ind + "<" + name;
	         
	         //构造属性
	         for (var m in v['@attributes']) {
				 xml += " " + m + "=\"" + v['@attributes'][m].toString() + "\"";
	         }
	         
	         //判断是否有子元素
	         for (var m in v) {
	         	if ( m != '@attributes' ){
		         	hasChild = true;
		         	break;
	         	}
	         }
	         
	         xml += hasChild ? ">" : "/>";         
	         
	         //如果有子元素
	         if (hasChild) {
	            for (var m in v) {
	            
	               if (m == "#text"){
		               xml += v[m];
	               }else if (m == "#cdata-section"){
		               xml += "<![CDATA[" + v[m] + "]]>";
	               }else if (m != "@attributes"){
		               xml += toXml(v[m], m, ind+( tidy ? '\t' : '' ));
	               }
	                  
	            }
	            
	            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
	         }
	                  
	      }
	      else {
	         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
	      }
	      return xml;
	      
	   }, xml="";
	   
	   for (var m in object){
		   xml += toXml(object[m], m, "");
	   }
	
	   return xml;
	}
	
}

/*state*/
Mo.plugin.push("xml");