var live_view = {
	bind:function(){		
		$("#daynight").click(function(){
			$("#daylist").toggle();
		});

		/*brightness*/
		$("#video-brightness").slider({
			range: "min",
			value: 0,
			min: 0,
			max: 100,
			stop: function(event, ui) {
				$("#video-brightness").slider("value", ui.value);
				var val = video.backPercent(ui.value, video.brightness.minimum, video.brightness.maximum);
				var args = {
					"brightness": val
				};
				video.setVideoCtrls(args);
			}
		})

		/*contrast*/
		$("#video-contrast").slider({
			range: "min",
			value: 0,
			min: 0,
			max: 100,
			stop: function(event, ui) {
				$("#video-contrast").slider("value", ui.value);
				var val = video.backPercent(ui.value, video.contrast.minimum, video.contrast.maximum);
				var args = {
					"contrast": val
				};
				video.setVideoCtrls(args);
			}
		});
		/*saturation*/
		$("#video-saturation").slider({
			range: "min",
			value: 0,
			min: 0,
			max: 100,
			stop: function(event, ui) {
				$("#video-saturations").slider("value", ui.value);
				var val = video.backPercent(ui.value, video.saturation.minimum, video.saturation.maximum);
				var args = {
					"saturation": val
				};
				video.setVideoCtrls(args);
			}
		});

		$("#videocut").click(function() {
			video.Snapshot(); 
		});

		$("#rotate").click(function() {
			video.setMirrorFlip({
				"rotate": ""
			});
		});

		$("#videomirror").click(function() {
			video.setMirrorFlip({
				"mirror": ""
			});
		});
		$("#automode").click(function(){
			video.setDayNight(DAYNIGHTMODE_AUTO);
		});
		$("#daymode").click(function(){
			video.setDayNight(DAYNIGHTMODE_DAY_MODE);
		});
		$("#nightmode").click(function(){
			video.setDayNight(DAYNIGHTMODE_NIGHT_MODE);
		});

		$("#video-reset").click(function(){
			video.resetVideoCtrls();
		});

		$("#navigator-velocity-select").bind({
			change : function(){
				video.changeVelocity($(this).val());
			}
		});

		var TIME_INTERVAL = 1000;
		var INTERVAL_TIMER;
					
		var args = {
			url: '/setTurnDirection.fcgi',
			data: {
				operation: "",
				direction: ""
			},
			success: function(response) {
			},
			error: function(xhr) {
			}
		}
		if(conf.ProductType == "NC450")
		{					
			$(".yuntaiControl_btn_nw").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "nw";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){													  
					common.setAjax.init(args);
				},TIME_INTERVAL);	
				
			}).mouseup(function(){
				
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/
			$(".yuntaiControl_btn_n").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "n";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
				
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/

			$(".yuntaiControl_btn_ne").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "ne";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
				
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/
			$(".yuntaiControl_btn_w").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "w";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
				
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/
			$(".yuntaiControl_btn_c").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "c";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
			
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			})
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/
			$(".yuntaiControl_btn_e").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "e";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
				
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/
			$(".yuntaiControl_btn_sw").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "sw";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
				
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/
			$(".yuntaiControl_btn_s").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "s";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
				  
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/
			$(".yuntaiControl_btn_se").mousedown(function(){
				args.data.operation = "start";
				args.data.direction = "se";
																				  
				common.setAjax.init(args);
				
				INTERVAL_TIMER = setInterval(function(){
					common.setAjax.init(args);
				},TIME_INTERVAL);	
					  
			}).mouseup(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
				
			});
			/*.mouseleave(function(){
				args.data.operation = "stop";
				
				clearInterval(INTERVAL_TIMER);
				
				common.setAjax.init(args);
			});*/	
		}	
	},
	init:function(){ 
		video.init();
		$("#live_view").show();	
	},
	close: function(){
		$("#live_view").hide();	
		video.VideoStop();
	},
	daynightDisplay:function(daynightmode){
		if (daynightmode == DAYNIGHTMODE_AUTO) {
			$("#daylist").hide();
			$("#autoimg").show().siblings("span").hide();
		} else if (daynightmode == DAYNIGHTMODE_DAY_MODE) {
			$("#daylist").hide();
			$("#dayimg").show().siblings("span").hide();
		} else if (daynightmode == DAYNIGHTMODE_NIGHT_MODE) {
			$("#daylist").hide();
			$("#nightimg").show().siblings("span").hide();
		}
	},

	videoBar:function(setting){
		$("#video-brightness").slider("value", setting.brightness);
		$("#video-contrast").slider("value", setting.contrast);
		$("#video-saturation").slider("value", setting.saturation);
	}
};









	
	

	