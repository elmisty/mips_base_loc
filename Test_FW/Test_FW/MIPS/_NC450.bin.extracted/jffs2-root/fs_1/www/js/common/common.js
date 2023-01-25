var common = {	
	ProductType:null,
	Url: null,
	browserInfo: {},
	browserName: null,
	volumeValInterval:null,
	wirelessCache: {},
	pageMode: "Basic",
	IsUnusable: null,
	currentPage: "index",
	imgsrcHD:"http://"+location.hostname+":8080/stream/video/mjpeg?resolution=HD&&Username="+$.cookie("StreamAccount")+"&&Password="+$.cookie("StreamPassword"),
	imgsrcVGA:"http://"+location.hostname+":8080/stream/video/mjpeg?resolution=VGA&&Username="+$.cookie("StreamAccount")+"&&Password="+$.cookie("StreamPassword"),
	
	snapshotHD:"http://"+location.hostname+":8080/stream/snapshot.jpg?resolution=HD&&Username="+$.cookie("StreamAccount")+"&&Password="+$.cookie("StreamPassword")+"&&attachment=1",
	snapshotVGA:"http://"+location.hostname+":8080/stream/snapshot.jpg?resolution=VGA&&Username="+$.cookie("StreamAccount")+"&&Password="+$.cookie("StreamPassword")+"&&attachment=1",
	
	snapshotIE2HD:"http://"+location.hostname+":8080/stream/snapshot.jpg?resolution=HD&&Username="+$.cookie("StreamAccount")+"&&Password="+$.cookie("StreamPassword")+"&&tempid="+Math.random(),
	snapshotIE2VGA:"http://"+location.hostname+":8080/stream/snapshot.jpg?resolution=HD&&Username="+$.cookie("StreamAccount")+"&&Password="+$.cookie("StreamPassword")+"&&tempid="+Math.random(),
	
	IEIntervalMD:null,
	dragflag:false,
	timing:{
		getInfoTimer: null,  
		dateseter_interval: null 
	},

	pageTimers:null, //defined page timers

	ajax: {
		init: function(args) {
			var ajaxurl = args.url,
				ajaxtype = args.type || 'post',
				ajaxdataType = args.dataType || 'text',
				ajaxdata = args.data,
				ajaxcache = args.cache || false,
				ajaxcontentType = args.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
				ajaxtimeout = args.timeout || 0,
				ajaxasync = args.async || true,
				ajaxglobal = args.global || false,
				ajaxBeforeSend = args.beforeSend || function() {},
				ajaxsuccess = args.success || function() {},
				ajaxerror = args.error || function() {},
				ajaxcomplete = args.complete || function() {};
				return $.ajax({
					url: ajaxurl,
					type: ajaxtype,
					dataType: ajaxdataType,
					data: ajaxdata,
					cache: ajaxcache,
					contentType: ajaxcontentType,
					timeout: ajaxtimeout,
					async: ajaxasync,
					global: ajaxglobal,
					beforeSend: function() {
						ajaxBeforeSend();
					},
					success: function(response) {
						try {
							var json = jQuery.parseJSON(response);
							if (json.errorCode == 902) {
								location.href = "/login.html";
							}
						} catch (error) {}
						ajaxsuccess(json, response);
					},
					statusCode: {
						403: function() {
							location.href = "/login.html"
						}
					},
					complete: function(xhr) {
						ajaxcomplete(xhr);
					},
					error: function(xhr) {
						var continueError = ajaxerror(xhr);
						return false;
					}
				});
		}
	},
	setAjax: {
		init: function(args) {
		var ajaxurl = args.url,
			ajaxtype = args.type || 'post',
			ajaxdataType = args.dataType || 'text',
			ajaxdata = args.data || {},
			ajaxcache = args.cache || false,
			ajaxcontentType = args.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
			ajaxtimeout = args.timeout || 0,
			ajaxasync = args.async || true,
			ajaxglobal = args.global || false,
			ajaxBeforeSend = args.beforeSend || function() {},
			ajaxsuccess = args.success || function() {},
			ajaxerror = args.error || function() {},
			ajaxcomplete = args.complete || function() {};
			ajaxdata.token = $("#token").attr("value");
		return $.ajax({
			url: ajaxurl,
			type: ajaxtype,
			dataType: ajaxdataType,
			data: ajaxdata,
			cache: ajaxcache,
			contentType: ajaxcontentType,
			timeout: ajaxtimeout,
			async: ajaxasync,
			global: ajaxglobal,
			beforeSend: function() {
				ajaxBeforeSend();
			},
			success: function(response) {
				try {
					
					var string = common.validatedSign.reconstruct(response);
					var json = jQuery.parseJSON(string);
					common.validatedSign.changeVal(json.token);
					if (json.errorCode == 902) {
						location.href = "/login.html";
					} else if (json.errorCode == 903) {
						plug.window.alert({
							"info": lang.ajax.ajaxError
						})
					}
				} catch (error) {}
				ajaxsuccess(json, string);
			},
			complete: function(xhr) {
				ajaxcomplete(xhr);
			},
			statusCode: {
				403: function() {
					location.href = "/login.html"
				}
			},
			error: function(xhr) {
				ajaxerror(xhr);
				//	return false;
			}
		});
		}
	},
	validatedSign: {
		init: function() {
		common.validatedSign.changeVal(location.href.split("?")[1]);
		},
		changeVal: function(sign) {
			$("#token").attr("value", sign);
		},
		reconstruct: function(string) {
			var jsonString = string.replace(/}&&{/g, ",");
			return jsonString;
		}
	},
	
	//common.browserInfo contains browser kernel version,browser type and version, cpu type,information about os
	//undefined means it is not that browser type
	// example: if(typeof common.browserInfo.ie == "undefined")  implies that the browser is not ie
	getBrowserInfo: function(){
		var ua = navigator.userAgent.toLowerCase();
		var s;
		if( s = ua.match(/trident\/([\d\.]+)/) ){//
			common.browserInfo.enginer = "trident";
			common.browserInfo.enginerVer = s[1];
			//if ( s = ua.match(/rv\:([\d\.]+)/) || s= ua.match(/msie ([^;]+)/) ){//IE8-IE11
			if ( s = ua.match(/rv\:([\d\.]+)/) ){//IE8-IE11	
				common.browserInfo.ie = s[1];
			}else if(s= ua.match(/msie ([^;]+)/))
			{
				common.browserInfo.ie = s[1];
			}
		}else if( s = ua.match( /msie ([^;]+)/ ) ){//IE6,7
			common.browserInfo.ie = s[1];
		}else if( s = ua.match(/applewebkit\/([\d.]+)/) ){//
			common.browserInfo.enginer = "webkit";
			common.browserInfo.enginerVer = s[1];
			if( s = ua.match(/opr\/([\d.]+)/) ){ //
				common.browserInfo.opera = s[1];
			}else if( s = ua.match(/version\/([\d.]+)/) ){ //
				common.browserInfo.safari = s[1];
			}else if( s = ua.match(/edge\/([\d.]+)/)){ //
				common.browserInfo.edge = s[1];
			}else{ //chrome
				s = ua.match(/chrome\/([\d.]+)/);
				common.browserInfo.chrome = s[1];
			}
		}else if( s = ua.match(/rv:([\d.]+)\)[(\s)+]gecko\/\d{8}/)){//
			common.browserInfo.enginer = "gecko";
			common.browserInfo.enginerVer = s[1];
			if ( s = ua.match(/firefox\/([\d.]+)/) ){//
				common.browserInfo.firefox = s[1];
			}
		}


	    (ua.indexOf("win64")>=0||ua.indexOf("wow64")>=0||ua.indexOf("x64")) ? common.browserInfo.cpu = "x64" :
	    common.browserInfo.cpu = "x32";
		

	    (navigator.userAgent.indexOf("Windows", 0) != -1) ? common.browserInfo.os = "win" :
	    (navigator.userAgent.indexOf("Mac", 0) != -1) ? common.browserInfo.os = "mac" :
	    common.browserInfo.os = "other";
	},

	isIe: function() {
		var userAgent = navigator.userAgent,
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
		var ua = userAgent.toLowerCase();
		var match = rMsie.exec(ua);
		if (match != null) {
			return "Microsoft Internet Explorer";
		}
	},
	detectBrowser: function() {
		var windows = (navigator.userAgent.indexOf("Windows", 0) != -1) ? 1 : 0;
		var mac = (navigator.userAgent.indexOf("Mac", 0) != -1) ? 1 : 0;
		if (windows) {
			if (common.browserName == "Microsoft Internet Explorer") {
				if (navigator.userAgent.indexOf("x64") != -1) {
					return "ie_x64";
				}else{				
					return "ie_x86";
				}
			} else {
				if (navigator.userAgent.indexOf("x64") != -1) {
					return "ff_x64";
				}else{				
					return "ff_x86";
				}
			}
		}
		if (mac) {
			return "mac";
		}
	},
	validInfo: function(strIn) {
		if (strIn.pass == true) {
			return true;
		} else {
			strIn.str ? plug.window.alert({
				"info": strIn.str
			}) : null;
			return false;
		}
	},
	checkInputUseRegularExp: function(string,reg){
		var regu = reg;
		var re = new RegExp(regu);
		if(re.test(string)){
			return false;
		}
		return true;
	},
	shadeLayer: function() {
		var a = "";
		a += "<div class='shade-layer'>",
		a += "<div class='shade-layer-img-holder'>",
		a += "<span class='shade-layer-img'>",
		a += "</span>",
		a += "</div>",
		a += "</div>";
		$("body").append(a);
	},
	removeShadeLayer: function() {
		$(".shade-layer").remove();
	},
	transToHTML: function(str) {
		var transHtml = [
			/&/g, "&amp;",
			/\\/g, "&#92;",
			/'/g, "&#39;",
			/"/g, "&quot;",
			/</g, "&lt;",
			/>/g, "&gt;",
			/ /g, "&nbsp;"];
		for (var i = 0; i < transHtml.length; i += 2) {
			str = str.replace(transHtml[i], transHtml[i + 1]);
		}
		return str;
	},
	transToTEXT: function(str) {
		var transHtml = [
				/&amp;/g, "&",
				/&#92;/g, "\\",
				/&#39;/g, "'",
				/&quot;/g, '"',
				/&lt;/g, "<",
				/&gt;/g, ">",
				/&nbsp;/g, " "];
		for (var i = 0; i < transHtml.length; i += 2) {
				str = str.replace(transHtml[i], transHtml[i + 1]);
		}
		return str;
	},
	cloudUrl : function(){	
		var args = {
			url: '/getcloudurl.fcgi',
			dataType:"json",
			success: function(json) {
				if (json.errorCode == 0) {
					common.URL = json.cloudweburl;
				}
			},
			error: function(xhr) {
				common.URL = "www.tplinkcloud.com";
			}
		}
		common.ajax.init(args);
	},

	textLoading:{
		Create: function(holderName){
			var str = "<div class='m-textloading'><span  id='"+holderName+"'></span></div>";
			return str;
		},
		Start: function(holder,text){
			holder.text(text);
			common.textShowLoadingInterval = setInterval(function() {
				holder.text(holder.text() + ".");
				holder.text() == text + "......" ? holder.text(text) : null;
			}, 500);
		},
		End: function(holder,text){
			var text = text || "";
			holder.text(text);
			$(".m-textloading").remove();
			common.textShowLoadingInterval = clearInterval(common.textShowLoadingInterval);
		}
	},

	optionsCreate: function(holder, data){

		var ele = document.getElementById(holder);
		if (typeof common.browserInfo.ie != "undefined" && parseInt(common.browserInfo.ie) <= 8 ) { //for IE6-9
			for( var i=0;i<data.length;i++){
				var opt = document.createElement('OPTION');
				opt.text = data[i].text;
				opt.value = data[i].value;
				ele.options.add(opt);
			}
		} else {
			var options = "";
			for( var i=0;i<data.length;i++){
				options += "<option class='lang_option' value='"+data[i].value+"'>"+data[i].text+"</option>";
			}
			ele.innerHTML = options;
		}
		
	},

	widgetEnable: function(){
		//select
		$(".content-cell").find("select").each(function(){
		 	$(this).Select();
		 });

		//radio
		plug.radio.initial($(".content-cell"));
		//checkbox
		plug.checkbox.initial($(".content-cell"));

	},

	langChange: function(){

		$(".lang-text").each(function(){
    		var key = $(this).attr("i18n");
    		if ( typeof(key) != "undefined" ){  	
    			var key_page = $(lang).attr(common.currentPage);  		
    			var key_text = $(key_page).attr(key);
    			$(this).text(key_text);
    		}     		
    	});

    	$(".lang-value").each(function(){
    		var key = $(this).attr("i18n");
    		if ( typeof(key) != "undefined" ){
    			var key_page = $(lang).attr(common.currentPage);   	
    			var key_text = $(key_page).attr(key);   	
    			$(this).val(key_text);
    		}
    	});

    	$(".lang-title").each(function(){
    		var key = $(this).attr("i18n");
    		if ( typeof(key) != "undefined" ){
    			var key_page = $(lang).attr(common.currentPage);
    			var key_text = $(key_page).attr(key);
    			$(this).attr("title",key_text);
    		}		
    	});
	}
};


	