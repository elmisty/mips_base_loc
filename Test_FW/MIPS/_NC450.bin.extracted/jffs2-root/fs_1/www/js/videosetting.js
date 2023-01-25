var Videosetting = {
	osd_size: null,
	config: {
		p1Rate: null,
		p2Rate: null,
		p1BitRate: null,
		p2BitRate: null
	},

	MODULE:{
		getOsdAndTimeDisplay: function(){
			return $.post('/getosdandtimedisplay.fcgi').done( function(json){
				DATA.VIDEO.OSD = json;//getOSDTimeStamp
			})
		},

		getVideoSetting: function(){
			return $.post('/getvideosetting.fcgi').done( function(json){
				DATA.VIDEO.SETTING = json;//getVideoSetting
			})
		},


		setVideoSetting: function(setting_data,osd_data) {
			plug.button.disable($("#videosetting-save"));
			var args = {
				url: '/setvideosetting.fcgi',
				data: setting_data,
				beforeSend: function(){
					Videosetting.VIEW.SET("beforeSend");
				},
				success: function(json) {			
					if (json.errorCode == 0) {
						DATA.VIDEO.SETTING = json;
						Videosetting.MODULE.setOSDTimeStamp(osd_data); 
					} else {
						Videosetting.VIEW.SET("failed");		
					}
				},
				error: function(xhr) {
					Videosetting.VIEW.SET("error");
				}
			};	
			common.setAjax.init(args);
		},

		setOSDTimeStamp: function(osd_data) {
			var args = {
				url: '/setosdandtimedisplay.fcgi',
				data: osd_data,
				success: function(json) {
					Videosetting.VIEW.SET("success", json);
				},
				error: function(xhr) {
					Videosetting.VIEW.SET("error");
				}
			}
			common.setAjax.init(args);
		}
	},

	VIEW: {
		init: function(){
			json_setting = DATA.VIDEO.SETTING;
			json_osd = DATA.VIDEO.OSD;
			//setting
			if (json_setting.errorCode == 0) {
				$("#videosetting1-resolution").text(json_setting.profile1.width1+"*"+json_setting.profile1.height1);
				$("#videoprofile1-frameRate1").val(json_setting.profile1.fps1).change();
				$("#videoprofile2-frameRate1").val(json_setting.profile3.fps3).change();
				$("#videoprofile1-imageQuality1").val(json_setting.profile1.qualityvalue1.qualitylevel1).change();
				$("#videoprofile2-imageQuality1").val(json_setting.profile3.qualityvalue3.qualitylevel3).change();
				$("#videosetting-lightfrequency").val(json_setting.powerline_frequency.value).change();
				json_setting.backlight_compensation.value == 0 ? $("#videosetting-backlight-disable").click() : $("#videosetting-backlight-enable").click();
			}
			//OSD
			if (json_osd.errorCode == 0) {
				$("#videosetting-osd-input-text").val(Base64.decode(json_osd.osd_info));
				if (json_osd.time_enable == 1) {
					$("#videosetting-osd-enable").click();
				} else if (json_osd.time_enable == 0) {
					$("#videosetting-osd-disable").click();		
				}
			}
		},

		SET: function(status, json){
			switch(status)
			{
				case "beforeSend":
					common.shadeLayer();
					plug.button.disable($("#videosetting-save"));
					break;
				case "success":
					if (DATA.VIDEO.OSD.errorCode == 0) {
						DATA.VIDEO.OSD = json;
						var str = $("#videosetting-osd-input-text").val();
						if ($(".osd-radio-selected").val() == 1) {
							video.osdArgs.enable = true;
							video.osdArgs.str = str;
						} else if ($(".osd-radio-selected").val() == 0) {
							video.osdArgs.enable = false;
							video.osdArgs.str = str;
						}
						if ($(".timestamp-radio-selected").val() == 1) {
							video.timeStamp.enable = true;
						} else if ($(".timestamp-radio-selected").val() == 0) {
							video.timeStamp.enable = false;
						}
						plug.window.alert({
							"info": lang.ajax.videoSet.success
						});
						plug.button.enable($("#videosetting-save"));
						common.removeShadeLayer();
					} else {
						plug.window.alert({
							"info": lang.ajax.videoSet.osdFailed
						});
						plug.button.enable($("#videosetting-save"));
						common.removeShadeLayer();
					}
					break;
				case "failed":
					plug.window.alert({
						"info": lang.ajax.videoSet.videoFailed
					});
					plug.button.enable($("#videosetting-save"));
					common.removeShadeLayer();
					break;
				case "error":
					plug.button.enable($("#videosetting-save"));
					common.removeShadeLayer();
					break;
			}
		}
	},

	init: function(){
		conf.confVideosettingDisplay(conf.ProductType);
		Videosetting.bind();
		Videosetting.VIEW.init();
		$.when(Videosetting.MODULE.getOsdAndTimeDisplay(),Videosetting.MODULE.getVideoSetting()).then( function(){
			Videosetting.VIEW.init();
		});
	},

	bind: function(){
		$("#videosetting-save").click(function(){
			if( !common.checkInputUseRegularExp($("#videosetting-osd-input-text").val(), /[^a-zA-Z0-9 -]|_/ig ) ){
				plug.window.alert({
					info: lang.valid.osdtext.illegal		  
				});
				return;
			}		

			var setting_data = {
				"qualitytype1": DATA.VIDEO.SETTING.profile1.qualitytype1,//
				"qualitylevel1": $("#videoprofile1-imageQuality1").val(),
				"bitrate1": DATA.VIDEO.SETTING.profile1.qualityvalue1.bitrate1,//
				"fps1":$("#videoprofile1-frameRate1").val(),
				"qualitytype3": DATA.VIDEO.SETTING.profile3.qualitytype3,//
				"qualitylevel3": $("#videoprofile2-imageQuality1").val(),
				"bitrate3": DATA.VIDEO.SETTING.profile3.qualityvalue3.bitrate3,//
				"fps3":$("#videoprofile2-frameRate1").val(),
				"powerline_frequency": $("#videosetting-lightfrequency").val(),
				"backlight_compensation": $(".backlight-radio-selected").val()
			};	

			var osd_data = {
				"time_enable": $(".osd-radio-selected").val(),
				"osd_enable": $(".osd-radio-selected").val(),
				"osd_size": DATA.VIDEO.OSD.osd_size,
				"osd_info": Base64.encode($("#videosetting-osd-input-text").val())
			};

			common.validInfo(valid.osdtext($("#videosetting-osd-input-text").val(), 19)) == true ? Videosetting.MODULE.setVideoSetting(setting_data,osd_data) : null;
		});

		$("#videosetting-backlight-enable").click(function(){
			$("#videosetting-backlight-disable").removeClass("backlight-radio-selected");
			$(this).addClass("backlight-radio-selected");
		});
		$("#videosetting-backlight-disable").click(function(){
			$("#videosetting-backlight-enable").removeClass("backlight-radio-selected");
			$(this).addClass("backlight-radio-selected");
		});
		$("#videosetting-osd-enable").click(function(){
			$("#videosetting-osd-disable").removeClass("osd-radio-selected");
			$(this).addClass("osd-radio-selected");
			$("#videosetting-osd-text").show();
		});
		$("#videosetting-osd-disable").click(function(){
			$("#videosetting-osd-enable").removeClass("osd-radio-selected");
			$(this).addClass("osd-radio-selected");
			$("#videosetting-osd-text").hide();
		});

		$("#videoprofile1-frameRate1").change(function(){
			$("option:selected",this).click();
			if(conf.ProductType == 'NC220')
			{
				var val_arr = [30,25,20,15,10];
				var current_val = $("#videoprofile1-frameRate1").val();					
				var p2FrameRateVal = $("#videoprofile2-frameRate1").val();

				//$("#p2FrameRate").html("<option value='30' id='rateDisappear-30'>30FPS</option><option value='20' id='rateDisappear-20'>20FPS</option><option value='15' id='rateDisappear-15'>15FPS</option><option value='10' id='rateDisappear-10'>10FPS</option><option value='5' id='rateDisappear-5'>5FPS</option>");
				$("#videoprofile2-frameRate1").html("<option value='15' id='rateDisappear-15'>15FPS</option><option value='10' id='rateDisappear-10'>10FPS</option><option value='5' id='rateDisappear-5'>5FPS</option>");					
				for(var i = 0 ;i < 5; i++){
					if( val_arr[i] > current_val ){
						$("#rateDisappear-"+val_arr[i]).remove();
					}
				}
				plug.select.initial($("#videoprofile2-frameRate1").parent());
				if(current_val == 10 && p2FrameRateVal > 10)
				{
					$("#videoprofile2-frameRate1").val(10).change();
				}
			}
		});

		$("#videoprofile1-imageQuality1").change(function(){
			$("option:selected",this).click();
		});

		$("#videosetting-lightfrequency").change(function(){
			$("option:selected",this).click();
		});
	}

};
