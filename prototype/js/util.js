;(function(window,jq){
	var _console,
	u = {},
	_debug = true,
	_debugError = false;
    u.BROWSERS = {
        UNKNOWN:    0,
        IE:         1,
        FIREFOX:    2,
        SAFARI:     3,
        CHROME:     4,
        OPERA:      5
    };
	u.Browser = {
        vendor:     u.BROWSERS.UNKNOWN,
        version:    0,
        alpha:      true
    };
	
	(function() {
        var app = navigator.appName,
            ver = navigator.appVersion,
            ua  = navigator.userAgent,
            regex;


        switch( navigator.appName ){
            case "Microsoft Internet Explorer":
                if( !!window.attachEvent &&
                    !!window.ActiveXObject ) {

                    u.Browser.vendor = u.BROWSERS.IE;
                    u.Browser.version = parseFloat(
                        ua.substring(
                            ua.indexOf( "MSIE" ) + 5,
                            ua.indexOf( ";", ua.indexOf( "MSIE" ) ) )
                        );
                }
                break;
            case "Netscape":
                if( !!window.addEventListener ){
                    if ( ua.indexOf( "Firefox" ) >= 0 ) {
                        u.Browser.vendor = u.BROWSERS.FIREFOX;
                        u.Browser.version = parseFloat(
                            ua.substring( ua.indexOf( "Firefox" ) + 8 )
                        );
                    } else if ( ua.indexOf( "Safari" ) >= 0 ) {
                        u.Browser.vendor = ua.indexOf( "Chrome" ) >= 0 ?
                            u.BROWSERS.CHROME :
                            u.BROWSERS.SAFARI;
                        u.Browser.version = parseFloat(
                            ua.substring(
                                ua.substring( 0, ua.indexOf( "Safari" ) ).lastIndexOf( "/" ) + 1,
                                ua.indexOf( "Safari" )
                            )
                        );
                    } else {
                        regex = new RegExp( "Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
                        if ( regex.exec( ua ) !== null ) {
                            u.Browser.vendor = u.BROWSERS.IE;
                            u.Browser.version = parseFloat( RegExp.$1 );
                        }
                    }
                }
                break;
            case "Opera":
                u.Browser.vendor = u.BROWSERS.OPERA;
                u.Browser.version = parseFloat( ver );
                break;
        }

            // ignore '?' portion of query string
        var query = window.location.search.substring( 1 ),
            parts = query.split('&'),
            part,
            sep,
            i;

        for ( i = 0; i < parts.length; i++ ) {
            part = parts[ i ];
            sep  = part.indexOf( '=' );

        }

        //determine if this browser supports image alpha transparency
        u.Browser.alpha = !(
            (
                u.Browser.vendor == u.BROWSERS.IE &&
                u.Browser.version < 9
            ) || (
                u.Browser.vendor == u.BROWSERS.CHROME &&
                u.Browser.version < 2
            )
        );

        u.Browser.opacity = !(
            u.Browser.vendor == u.BROWSERS.IE &&
            u.Browser.version < 9
        );

    })();
	
	function createConsole(){
		_console = {
				log:function(){
//					alert(arguments);
				},
				error:function(){
//					alert(arguments);
				}
		}
	}
	try{
		_console = console||window.console;
		if(!_console){
			createConsole();
		}
	}catch(e){
		createConsole();
	}
	function _addPara2Ele(ele,cssclass,attrs,csses){
		ele = cssclass ? ele.addClass(cssclass) : ele;
		ele = attrs ? ele.attr(attrs) : ele;
		ele = csses ? ele.css(csses) : ele;
	}
	u.getScrollTop = function(){
		var top = document.documentElement.scrollTop;
		if(top==0){
			if(document.body){
				top = document.body.scrollTop;
			}
		}
		return top;
	}
	u.log = function(){
		if(_debug){
			if(_debugError){
				_console.error(arguments);
			}else{
				_console.log(arguments);
			}
			
		}
	}
	u.error = function(){
		if(_debug){
			_console.error(arguments);
		}
	}
	u.extend = function(subClass,superClass){
	    var F = function(){};
	    F.prototype = superClass.prototype;
	    subClass.prototype = new F();
	    subClass.prototype.constructor = subClass;
	    subClass.superclass = superClass.prototype; 
	    if(superClass.prototype.constructor == Object.prototype.constructor){
	        superClass.prototype.constructor = superClass;
	    }
	}
	u.isShow = function(ele){
		if(typeof ele == "object"&&ele==jq){
			return ele.css("display")!="none"
		}
		throw Error("u.isShow() >> ele is not jquery object.")
	}
	u.isExisted = function(arg){
		if(typeof arg=="string"){
			var ele = jQuery("*[SERIAL_NUMBER="+arg+"]");
			if(ele&&ele.length>0){
				return true;
			}else{
				return false;
			}
		}else if(typeof arg == "object"&&arg==jq){
			return u.isShow(arg);
		}else{
			return false;
		}
	}
	u.checkMandatory = function(parentElement){
		var projId = proj_info.proj_id;
		if(isManObj&&isManObj[projId]){
			var parent_ele = parentElement?parentElement:jQuery(".sf-pd-table");
			parent_ele.find("div[id*=isman_]").css({"color":"#000"});
			for(var i=0;i<isManObj[projId].length;i++){
				var isman = isManObj[projId][i].split(";");
				var isman_font =parent_ele.find("#isman_"+isman[0]);
				if(isman_font){
					isman_font.css({"color":"red"});
				}
			}
		}
		projId = null;
	}
	u.stopEvent = function(e){
		if(e){
			if(typeof e.preventDefault=="function"){
				 e.preventDefault();    
			}
			if(typeof e.stopPropagation=="function"){
				 e.stopPropagation();    
			}
			if (window.event) {
			   e.cancelBubble=true; 
			}
		}
	}
	u.chkBoolean = function(val){
		if(val==true||val=="true"||val==1||val=="1"){
			return true;
		}else{
			return false;
		}
	}
	u.convertBean = function(data,keymap){
		var newBean = {};
		for(var key in keymap){
			newBean[keymap[key]] = data[key];
		}
		return newBean;
	}		
	u.div = function(cssclass,attrs,csses){
		var div = jq("<div>");
		_addPara2Ele(div,cssclass,attrs,csses);
		return div;
	}
	u.a = function(cssclass,attrs,csses){
		var a = jq("<a>");
		a.attr("href","javascript:void(0)");
		_addPara2Ele(a,cssclass,attrs,csses);
		return a;
	}
	u.span = function(cssclass,attrs,csses){
		var span = jq("<span>");
		_addPara2Ele(span,cssclass,attrs,csses);
		return span;
	}
	u.nav = function(cssclass,attrs,csses){
		var nav = jq("<nav>");
		_addPara2Ele(nav,cssclass,attrs,csses);
		return nav;
	}
	u.ul = function(cssclass,attrs,csses){
		var ul = jq("<ul>");
		_addPara2Ele(ul,cssclass,attrs,csses);
		return ul;
	}
	u.li = function(cssclass,attrs,csses){
		var li = jq("<li>");
		_addPara2Ele(li,cssclass,attrs,csses);
		return li;
	}
	u.input = function(cssclass,attrs,csses){
		var input = jq("<input>");
		_addPara2Ele(input,cssclass,attrs,csses);
		return input;
	}
	u.lable = function(cssclass,attrs,csses){
		var lable = jq("<lable>");
		_addPara2Ele(lable,cssclass,attrs,csses);
		return lable;
	}
	u.img = function(cssclass,attrs,csses){
		var img = jq("<img>");
		_addPara2Ele(img,cssclass,attrs,csses);
		return img;
	}
	u.table = function(cssclass,attrs,csses){
		var table = jq("<table>");
		_addPara2Ele(table,cssclass,attrs,csses);
		return table;
	}
	u.tr = function(cssclass,attrs,csses){
		var tr = jq("<tr>");
		_addPara2Ele(tr,cssclass,attrs,csses);
		return tr;
	}
	u.td = function(cssclass,attrs,csses){
		var td = jq("<td>");
		_addPara2Ele(td,cssclass,attrs,csses);
		return td;
	}
	u.strong = function(cssclass,attrs,csses){
		var strong = jq("<strong>");
		_addPara2Ele(strong,cssclass,attrs,csses);
		return strong;
	}
	u.btn = function(btnName,cssclass,attrs,csses){
		var btn = u.a(cssclass,attrs,csses).addClass("mybutton_tool");
		btn.append(u.span().htmlText(btnName)).append(u.div());
		return btn;
	}
	u.select = function(cssclass,attrs,csses){
		var select = jq("<select>");
		_addPara2Ele(select,cssclass,attrs,csses);
		return select;
	}
	u.option = function(cssclass,attrs,csses){
		var option = jq("<option>");
		_addPara2Ele(option,cssclass,attrs,csses);
		return option;
	}
	u.hr = function(cssclass,attrs,csses){
		var hr = jq("<hr>");
		_addPara2Ele(hr,cssclass,attrs,csses);
		return hr;
	}
	u.textarea = function(cssclass,attrs,csses){
		var textarea = jq("<textarea>");
		_addPara2Ele(textarea,cssclass,attrs,csses);
		return textarea;
	}
	u.font = function(cssclass,attrs,csses){
		var font = jq("<font>");
		_addPara2Ele(font,cssclass,attrs,csses);
		return font;
	}
	GAPUtil = window.GAPUtil = u;
})(window,jQuery);