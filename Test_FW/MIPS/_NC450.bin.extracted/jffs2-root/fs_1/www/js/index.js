$(document).ready(function(){
	var Index = {
		
		init: function(){
			//first,init information depends on product type
			conf.confIndexDisplay(conf.ProductType);		

			if(1 == $.cookie("PasswordIsAdmin"))
			{
				//$.cookie("PasswordIsAdmin", 0);
				$(".content-right").css({"display":"none"});
				plug.window.changepss({
					"info":lang.ajax.login.chgpsstips
				});
			}
			//then,get information common among all product types
			common.getBrowserInfo();
			Status.MODULE.getWirelessInfo();							
			Status.MODULE.getReceiver();					
			Videosetting.MODULE.getVideoSetting();
					
			Status.MODULE.getNetInfo();
			Status.MODULE.getCloudInfo();			
			Status.MODULE.getSysInfo();
			Videosetting.MODULE.getOsdAndTimeDisplay();
			Timesetting.MODULE.getTimeInfo({preinit:true});	
			Led.MODULE.GetLed();//led
			Notification.MODULE.getNotificaInfo({preinit:true});

			common.shadeLayer();//ensure the language change complete

			Index.bind();	
			Index.initLanguage();
			live_view.bind();
			$("#nav-live_view").click();

			common.removeShadeLayer();
			
		},

		bind: function(){
			/*init*/
			$("body").find("select").each(function(){
				$(this).Select();
			});

			$("select").change(function(){
				$("option:selected",this).click();
			});

			$(".nav-left .nav-parent").click(function(){
				var id = $(this).attr("id");

				if( id != "nav-live_view"){
					$(this).next("ul").find("li").first().click();
					$(this).parents("li").siblings().find(".nav-parent").removeClass("nav-parent-selected");
					$(this).toggleClass("nav-parent-selected");
					$(this).parents("li").siblings().find(".nav-img").removeClass("nav-img-selected");
					$(this).find(".nav-img").toggleClass("nav-img-selected");

					$(this).parents("li").siblings().find(".nav-child").slideUp(50);	
					$(this).parents("li").find("ul").animate({height:'toggle'},50);
				}else{
					common.volumeValInterval = clearTimeout(common.volumeValInterval);

					$(this).parents("li").siblings().find(".nav-parent").removeClass("nav-parent-selected");
					$(this).toggleClass("nav-parent-selected");
					$(this).parents("li").siblings().find(".nav-img").removeClass("nav-img-selected");
					$(this).find(".nav-img").toggleClass("nav-img-selected");

					$(this).parents("li").siblings().find(".nav-child").slideUp(50);	
					$(this).parents("li").find("ul").animate({height:'toggle'},50);

					$(".nav-parent").removeClass("nav-parent-selected");
					$(this).addClass("nav-parent-selected");

					if(common.currentPage == "motionDetect"){
						MotionDetection.stopMDvideo();
					}

					$(".content-right-cell").remove();
					
					common.currentPage = "index";
					common.langChange();

					live_view.init();	
				}
				if($(".nav-parent").hasClass("nav-parent-selected"))
				{
					if(id == 'nav-live_view')
					{

					}
					else if(id == 'basic')
					{
						$(".nav-basic").addClass("nav-selected");
					}
					else if(id == 'advanced')
					{
						$(".nav-advanced").addClass("nav-selected");
					}
					else
					{
						$(".nav-system").addClass("nav-selected");
					}
				}	

				if(!$("#basic").hasClass("nav-parent-selected"))
				{
					$(".nav-basic").removeClass("nav-selected");
				}
					
				if(!$("#advanced").hasClass("nav-parent-selected"))		
				{
					$(".nav-advanced").removeClass("nav-selected");
				}	

				if(!$("#system").hasClass("nav-parent-selected"))	
				{
					$(".nav-system").removeClass("nav-selected");
				}
			});
			$(".nav-child li").click(function(){
				var id = $(this).attr("id");
				var k = id.split("-");

				$(".nav-child li").removeClass("nav-child-selected");
				$(this).addClass("nav-child-selected");
				
				if ( k[3] == common.currentPage ){
					return;
				}

				if( typeof common.browserInfo.safari != "undefined" ){//safari
					live_view.close(); //all request will stop
				}else{
					
					if(k[3] != "motionDetect"){
						MotionDetection.stopMDvideo();//only stop MD
					}
					live_view.close();//only stop Live_view
				}
				
				if (common.currentPage == 'sd') {
					SD.UnMount();
				}

				common.volumeValInterval = clearTimeout(common.volumeValInterval);
				
				var pageurl = "page/content_"+k[3]+".htm";

				k[1] == "advanced" ? common.pageMode = "Advanced" : common.pageMode = "Basic";

				common.timing.timer = clearTimeout(common.timing.timer);

				common.currentPage = k[3];

				$.ajax({
					url: pageurl,
					type: "get",
					dataType: "html",
					beforeSend: function(){
						$("#index-img-loading").show();
					},
					success: function(html) {
						$(".content-cell").html(html);
					},
					error: function(xhr) {
					
					}
				});
			});

			$("#logout").click(function() {
				plug.window.confirm({
					info: lang.ajax.logout.tips,
					btnConfirm: lang.plug.Logout,
					confirm: function() {
						Index.logout();
					}
				})
			});

			$("select").change(function(){
				$("option:selected",this).click();
			});
			
			Index.langBind();
		},

		logout: function() {
			var args = {
				url: "/logout.fcgi",
				data: {
					token: $("#token").attr("value")
				},
				success: function(json) {
					if (json.errorCode == 0) {
						if (location.search.indexOf("?streamPort=") == 0) {
							location.href = "/login.html" + location.search;
						} else {
							location.href = "/login.html";
						}
					} else {
						plug.window.alert({
							"info": lang.ajax.logout.failed
						});
					}
				},
				error: function(a) {}
			};
			common.setAjax.init(args);
		},

		langBind: function(){
			$("#lang-select option").bind("showMsg",function(){//select.js show message but not trigger click event
				$(".plugin-select .selected span").text($(this).text());
			});

			$("#lang-select-cn").click(function(){
				$.cookie("tplanguage","CN");
				location.reload(true); 
			});
			$("#lang-select-en").click(function(){
				$.cookie("tplanguage","EN");
				location.reload(true);
			});
			
		},

		wifiList: function(){
			var args = {
				url: '/wireless_scan.fcgi',
				timeout: 5000,
				success:function(json){	
					DATA.WIRELESS.SCAN = json;	
				},
				error:function(xhr){
				}
			};
			return common.ajax.init(args);
		},

		initLanguage: function(){
			if(!$.cookie("tplanguage")){
				$.cookie("tplanguage","EN");
				$("#lang-select-en").attr("selected",true).trigger("showMsg");
				Index.langSwitch();
			}else{
				if( $.cookie("tplanguage") == "EN" ){
					$("#lang-select-en").attr("selected",true).trigger("showMsg");
					Index.langSwitch();
				}else{
					$("#lang-select-cn").attr("selected",true).trigger("showMsg");
					Index.langSwitch();
				}
				
			}
		},

		langSwitch:function(){
			switch ($.cookie("tplanguage")) {
				case "EN":
					common.langChange();
					break
				case "CN":
					common.langChange();
					break
				default:
					return common.currentPage;
			}
		},

		ViewDetect: function(){
			if( DATA.Viewer >= 4 ){
				plug.window.alert({
					"info": lang.index.viewDetectionInfo
				});
				video.VideoStop();
			}else{
				live_view.init();
			}
		}
	}
	Index.init();
})


	