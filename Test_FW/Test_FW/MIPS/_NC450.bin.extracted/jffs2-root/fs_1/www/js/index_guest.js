$(document).ready(function(){
	var Index = {
		
		init: function(){
			var temp;
			temp = $("#CameraDes").attr("i18n");
			temp = temp + conf.ProductType;
		
			$("#CameraDes").attr("i18n",temp);

			temp = $("#CameraTyp").attr("i18n");
			temp = temp + conf.ProductType;
		
			$("#CameraTyp").attr("i18n",temp);

			common.getBrowserInfo();
			common.shadeLayer();

			Index.bind();	
			live_view.bind();
			Index.initLanguage();
			$("#nav-live_view").click();
			
			common.removeShadeLayer();

		},

		bind: function(){

			$("#nav-live_view").click(function(){
				clearInterval(common.volumeValInterval);
				$(".nav-parent").removeClass("nav-parent-selected");
				$(this).addClass("nav-parent-selected");
				$(".content-right-cell").remove();

				common.currentPage = "index";
				common.langChange();

				$("#content-live_view").show();
				live_view.init();		
			});

			$("#logout").click(function() {
				plug.window.confirm({
					info: lang.ajax.logout.tips,
					btnConfirm: lang.plug.Logout,
					confirm: function() {
						Index.logout();
					}
				})
			})
			
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
							video.VideoStop();
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

			//English
			$("#lang-select-en").click(function(){
				$.cookie("tplanguage","EN");
				location.reload(true); 
			});
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
       				//$("#nav-live_view").click();
					break
				case "CN":
					common.langChange();
       				//$("#nav-live_view").click();
					break
				default:
					return common.currentPage;
			}
		},

	};

	Index.init();
})


	