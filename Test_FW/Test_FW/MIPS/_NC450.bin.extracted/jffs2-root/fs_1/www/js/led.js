var Led = {
	MODULE:{ 
		GetLed:function() {
			var args = {
				url: '/ledgetting.fcgi',
				success: function(json) {
					DATA.LED = json;
					Led.VIEW.init();
				},
				error: function(xhr) {
				}
			}
			return common.ajax.init(args);
		},

		SaveLed:function(data){	
			var args = {
				url: '/ledsetting.fcgi',
				data: data,
				beforeSend: function(){
					Led.VIEW.SET("beforeSend");
				},
				success: function(json) {
					if(json.errorCode == 0){
						DATA.LED.errorCode = 0;
						DATA.LED.enable = data.enable;
					}else{
						DATA.LED.errorCode = "";
						DATA.LED.enable = data.enable;
					}
					Led.VIEW.SET("success");
				},
				error: function(xhr) {
					Led.VIEW.SET("error");
				}
			}
			common.setAjax.init(args);
		}
	},
	
	VIEW: {
		init: function(){
			if (DATA.LED.enable == 1) {
				$("#led_model-on").click();
			} else {
				$("#led_model-off").click();
			}
		},
		SET: function(status){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($("#led-save"));
					break;
				case "success":
					plug.button.enable($("#led-save"));
					if (DATA.LED.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.led.setSuccess
						});
						Led.VIEW.init();
					} else {
						plug.window.alert({
							"info": lang.ajax.led.setFailed
						});
						Led.VIEW.init();
					}
					break;
				case "error":
					plug.button.enable($("#led-save"));
					plug.window.alert({
						"info": lang.valid.led.setFailed
					});
					break;
			}
		}
	},

	Init:function(){
		Led.Bind();
		Led.VIEW.init();
		Led.MODULE.GetLed();
	},

	Bind:function(){	
		$("#led-save").click(function(){
			var data = {
				"enable":$(".led-radio-selected").val()
			};
			Led.MODULE.SaveLed(data);
		});
		$(".led-radio").click(function() {
			$(".led-radio").removeClass("led-radio-selected");
			$(this).addClass("led-radio-selected");
		});

	}
}

