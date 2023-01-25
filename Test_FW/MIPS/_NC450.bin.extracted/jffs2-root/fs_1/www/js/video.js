var video = {
	mdPlayerWidth: {},
	osdArgs: {},
	timeStamp: {},
	mdjson: null, 
	zoomMulit: null, 
	ResolutionMode: null, 
	streamType: null,
	current_streamresolution: null, 
	audiostreamtype: null,
	showLoadingInterval: null,
	upnpInfo: {},
	volumeValInterval: null,
	brightness: {},
	contrast: {},
	saturation: {},
	watcherHeartBeat: null, 
	IEInterval: null,

	init:function(){
		if((conf.ProductType == "NC450") && (conf.isAdmin == 1))
		{
			video.getVelocity();
		}

		if((conf.ProductType == "NC220") ||
		   (conf.ProductType == "NC230") ||
		   (conf.ProductType == "NC250") ||	
		   (conf.ProductType == "NC460") ||	
		   (conf.ProductType == "NC450") ||
		   (conf.ProductType == "NC260"))
		{
			$("#daynight").show();
			video.getDayNight();
		}
		
		$('#browser-error-info-span-H5').hide();
		
		video.getVideoArgs();
		video.VideoStart();			
	},
	VideoStart: function(){
		if(typeof common.browserInfo.ie != "undefined" || typeof common.browserInfo.edge != "undefined"){//IE ,edge
			$(".live-view-tips").attr("src","../images/tpcamera_tips.png");
			$("#content-live_view").hide();
			$("#liveview-contain").hide();
			$("#video-control_bar").hide();
			
			$(".liveview-error").show();
		}else{
			if((typeof common.browserInfo.chrome != "undefined" || typeof common.browserInfo.firefox != "undefined") && common.browserInfo.os !== 'other') {
				$('#liveview-contain').remove();
				if ((typeof common.browserInfo.chrome != "undefined" && parseInt(common.browserInfo.chrome.substr(0,2)) < 52) || (typeof common.browserInfo.firefox != "undefined" && parseInt(common.browserInfo.firefox.substr(0,2)) < 52)){
					//browser version too old
					$(".live-view-tips").attr("src","../images/tpcamera_tips.png");
					$("#content-live_view").hide();
					$("#liveview-contain").hide();
					$("#video-control_bar").hide();
					
					$(".liveview-error").show();
					
					$('#browser-error-info-span').hide();
					$('#browser-error-info-span-H5').show();
				}else{
					//H5player
					video.VideoStartH5player();
				}
			} else {
				//MJPEG
				$('#liveview-contain-new').remove();
				$('#videorecordbegin').remove();
				$('#videorecordend').remove();
				if(conf.ProductType == "NC220"){
					$("#livegetimage").attr("src",common.imgsrcVGA+"&&tempid="+Math.random());
				}
				else if(conf.ProductType == "NC230" ||
						conf.ProductType == "NC250" ||
						conf.ProductType == "NC260" ||
						conf.ProductType == "NC450" 
				){
					$("#livegetimage").attr("src",common.imgsrcHD+"&&tempid="+Math.random());
				}	
			}
		}
		video.heartBeat();
		video.watcherHeartBeat = setInterval(function() {
												video.heartBeat();
										}, 600000);	
	},
	VideoStop: function(){
		if(typeof common.browserInfo.ie == "undefined" || typeof common.browserInfo.edge == "undefined" || typeof common.browserInfo.safari != "undefined"){
			$("#livegetimage").attr("src","#");
			video.watcherHeartBeat = clearInterval(video.watcherHeartBeat);
		}
		if(typeof common.browserInfo.safari != "undefined"){
			$("#livegetimage").attr("src","#");
			window.stop();//interrupt all request
		}
	},
	VideoStartH5player: function() {
		
		if (video.h5player !== undefined) {
			return;
		}

		function timeLeftEvent() {
			console.warn('time left event');
			console.error('stop tp player');
			video.h5player.pause();
			video.h5player.unload();
			video.h5player.detachMediaElement();
			video.h5player.destroy();
		}
				
		function setSwitchPlayerCallback() {
			setTimeout(function () {
					var setSuc = video.h5player.setSwitchPlayerCallback(video.switchplayer);
					if (setSuc === false) {
						setSwitchPlayerCallback();
					}
				},
				3000);
		}

		function load() {
			if (!tpjs.isSupported()) {
				console.error("this browser donn't support mse h264 play");
			}

			var xhr = new XMLHttpRequest();
			xhr.open('GET', decodeURIComponent(getUrlParam('src', './JSON/media.json')), true);
			xhr.onload = function () {
				video.h5mediaDataSource = JSON.parse(xhr.response.toString());
				
				video.h5mediaDataSource.url = 'http://' + document.location.hostname + video.h5mediaDataSource.url;

				var element = document.getElementById('videoElement');
				var element2 = document.getElementById('videoElement2');
				element2.controls = false;
				
				if (video.h5player && video.h5player !== null) {
					video.h5player.unload();
					video.h5player.detachMediaElement();
					video.h5player.destroy();
				}
				
				video.h5player = tpjs.createPlayer(video.h5mediaDataSource, {
					enableWorker: false,
					seekType: 'range'
				}, timeLeftEvent);
				
				video.h5player.onWebCanPlay(function () {
					console.log('web can play');
				});
				
				video.h5player.onIOError(function () {
					console.error('io error');
				});
				
				video.h5player.attachMediaElement(element);
				video.h5player.load();
				video.h5player.play();
				setSwitchPlayerCallback();
				
				setTimeout(function () {
						console.log("after some time");
						console.log("x-client-id: " + video.h5player.getClientId());
					},
					1000);
			};
			xhr.send();
		}

		function record_start_callback() {
			$("#videorecordbegin").show().siblings("span").hide();
		}
		$("#videorecordbegin").show().siblings("span").hide();
		$("#videorecordbegin").click(function() {
			video.switchplayer(true);
			$("#videorecordend").show().siblings("span").hide();
		});
		$("#videorecordend").click(function() {
			video.h5player.record_end();
		});

		function getUrlParam(key, defaultValue) {
			var pageUrl = window.location.search.substring(1);
			var pairs = pageUrl.split('&');
			for (var i = 0; i < pairs.length; i++) {
				var keyAndValue = pairs[i].split('=');
				if (keyAndValue[0] === key) {
					return keyAndValue[1];
				}
			}
			return defaultValue;
		}

		video.h5player = null;
		video.h5mediaDataSource = null;
		
		video.switchplayer = function (isRecording) {
			var player2 = null;
			
			if (!tpjs.isSupported()) {
				console.error("this browser donn't support mse h264 play");
			}

			if (video.h5mediaDataSource != null && video.h5player != null) {
				var element1 = document.getElementById('videoElement');
				var element2 = document.getElementById('videoElement2');
				var isBackswich = false;
				if (video.h5player._mediaElement == element2) {
					isBackswich = true;
				}
				player2 = tpjs.createPlayer(video.h5mediaDataSource, {
					enableWorker: false,
					seekType: 'range'
				}, timeLeftEvent);
				
				player2.onWebCanPlay(function () {
					console.log('web can play');
					setTimeout(function () {
						if (isBackswich) {
							element2.style.display = 'none';
							element1.style.display = 'block';
						} else {
							element2.style.display = 'block';
							element1.style.display = 'none';
						}
						
						if (video.h5player && video.h5player !== null) {
							video.h5player.detachMediaElement();
							video.h5player.destroy();
						}
						
						video.h5player = player2;
						setSwitchPlayerCallback();
						
						if (isRecording) {
							video.h5player.record_start(record_start_callback);
						}
					}
					);
				});
				
				player2.onIOError(function () {
					console.error('io error');
				});
				
				if (isBackswich) {
					player2.attachMediaElement(element1);
				} else {
					player2.attachMediaElement(element2);
				}
				player2.load();
				player2.play();
				
				if (video.h5player && video.h5player !== null) {
					video.h5player.unload();
				}
				
			}
		};
		
		$.getScript('js/tp.min.js', function() {
			load();
		});
	},

	getVelocity : function(){		
		var args = {
				url: "/getPtzVelocity.fcgi",
				success: function(json, response) {
					var json = jQuery.parseJSON(response);
					if (json.errorCode == 0) {
						$("#navigator-velocity-select").val(json.value).change();
					}
				},
				error: function(xhr) {
				}
			}
		common.ajax.init(args);
	},

	changeVelocity : function(value){	
		var args = {
			url: "/setPtzVelocity.fcgi",
			data: {
				value : value
			},
			success: function(json, response) {
				var json = response;
				if (json.errorCode == 0) {
					
				}
			},
			error: function(xhr) {
			}
		}
		common.setAjax.init(args);
	},

	Snapshot: function(){
		$("#if-videocut").remove();

		if(conf.ProductType == "NC220"){
			var iframe = "<iframe id='if-videocut' src='"+common.snapshotVGA+"' style='display:none;'>";
		}
		else if(conf.ProductType == "NC230" ||
				conf.ProductType == "NC250" ||
				conf.ProductType == "NC260" ||
				conf.ProductType == "NC450" 
		){
			var iframe = "<iframe id='if-videocut' src='"+common.snapshotHD+"' style='display:none;'>";
		}

		$("body").append(iframe); 
	},
	setMirrorFlip: function(datas) {
		var args = {
			url: '/setvideoctrls.fcgi',
			data: datas,
			dataType:"json",
			success: function(json) {
				if (json.errorCode == 0) {

				} else {
					plug.window.alert({
						"info": lang.ajax.videoSet.videoFailed
					});
				}
			},
			error: function(xhr) {

			}
		};
		common.setAjax.init(args);
	},
	setDayNight: function(mode) {		
		var args = {
			url: "/daynightconf.fcgi",
			type: 'post',
			data: {
				"daynightmode": mode
			},
			success: function(json) {
				if (json.errorCode == 0) {		
					live_view.daynightDisplay(json.daynightmode);
				} else {
				}
			},
			error: function(xhr) {
			}
		};
		common.setAjax.init(args);
	},
	setVideoCtrls:function(setArgs){
		var args = {
			url: '/setvideoctrls.fcgi',
			data: {
				"brightness": setArgs.brightness ,
				"saturation": setArgs.saturation ,
				"contrast": setArgs.contrast
			},
			dataType:"json",
			success: function(json) {
				if (json.errorCode == 0) {				
				}
			},
			error: function(xhr) {
			}
		}
		common.setAjax.init(args);
	},
	backPercent: function(val, min, max) {
		if (min >= 0) {
			return Math.ceil((val / 100) * (max - min) + min);
		} else {
			return Math.ceil((val / 100) * (max - min) + min);
		}
	},
	turnPercent: function(val, min, max) {
		return Math.ceil( (val - min) * ( 100 / (max-min) ) );
	},
	getVideoArgs: function() {
		var args = {
			url: '/getvideoctrls.fcgi',
			data: {
				"all": "any value"
			},
			success: function(json) {
				if (json.errorCode == 0) {
					video.brightness = json.brightness;
					video.contrast = json.contrast;
					video.saturation = json.saturation;		
					video.initVideoBar(json);
				}
			},
			error: function(xhr) {

			}
		}
		common.ajax.init(args);
	},
	initVideoBar:function(json){
		var setting = {
			brightness: video.turnPercent(json.brightness.value,json.brightness.minimum,json.brightness.maximum),
			contrast: video.turnPercent(json.contrast.value,json.contrast.minimum,json.contrast.maximum),
			saturation: video.turnPercent(json.saturation.value,json.saturation.minimum,json.saturation.maximum)
		}
		live_view.videoBar(setting);
	},

	heartBeat: function() {
		var args = {
			url: '/watcherheartbeat.fcgi',
			success: function(response) {
				var json = jQuery.parseJSON(response);
			},
			error: function(xhr) {}
		}
		common.setAjax.init(args);
	},
	resetVideoCtrls: function() {
		var args = {
			url: '/resetvideoctrls.fcgi',
			data: { 
				"brightness": "any value",
				"saturation": "any value",
				"contrast": 10,
				"flip": "",
				"mirror": ""
			},
			success: function(json) {

				if (json.errorCode == 0) {
					video.initVideoBar(json);
				}
			},
			error: function(xhr) {

			}
		}
		common.setAjax.init(args);
	},

	getOSDTimeStamp: function() {
		var args = {
			url: '/getosdandtimedisplay.fcgi',
			success: function(json) {
				if (json.errorCode == 0) {
					if (json.osd_enable == 1) {
						video.osdArgs.enable = true;
						video.osdArgs.str = Base64.decode(json.osd_info);
					} else if (json.osd_enable == 0) {
						video.osdArgs.enable = false;
						video.osdArgs.str = Base64.decode(json.osd_info);
					}
					if (json.time_enable == 1) {
						video.timeStamp.enable = true;
					} else if (json.time_enable == 0) {
						video.timeStamp.enable = false;
					}
				} else {

				}
			},
			error: function(xhr) {

			}
		}
		common.ajax.init(args);
	},
	initOsd: function() {
		try {
			video.playerObj.ShowOSD(video.osdArgs.enable, 10, 9, 0xFFFFFF, video.osdArgs.fontsize, video.osdArgs.str);
			video.playerObj.ShowTime(video.timeStamp.enable, video.timeStamp.positionX, 10, 0xFFFFFF, video.timeStamp.fontsize);
		} catch (error) {}
	},

	getDayNight: function() {
		var args = {
			url: '/daynightconfsettinginit.fcgi',
			success: function(json) {
				if (json.errorCode == 0) {
					live_view.daynightDisplay(json.daynightmode);
				}
			},
			error: function(xhr) {

			}
		}
		common.ajax.init(args);
	}
}
