var MotionDetection = {
	mdjson:null,
	mdenableval:-1,
		Init:function() {
			//MotionDetection.launch(conf.playerSize.width,conf.playerSize.height);
			//$("#mdlivegetimage").attr("src",common.imgsrcIE);
			//var mdimg = "<img id='mdlivegetimage' alt='live view' src='"+common.imgsrcIE+"'style='width:768px;height:432px;background-color:black;'/>";
			//$("#mdplayer").html(mdimg);
			MotionDetection.Bind();
			MotionDetection.GetMD_test();
			//MotionDetection.startMDvideo();
		},

		startMDvideo:function(){
		if(typeof common.browserInfo.ie != "undefined" || typeof common.browserInfo.edge != "undefined"){//IE ,edge
			$("#mdplayer").hide();
			$(".live-view-tips").attr("src","../images/tpcamera_tips.png");
			$(".liveview-error").show();
			}else{//chrome ff
				if(conf.ProductType == "NC220"){
					$("#mdlivegetimage").attr("src",common.imgsrcVGA+"&&tempid="+Math.random());
				}
				else if(conf.ProductType == "NC230" ||
						conf.ProductType == "NC250" ||
						conf.ProductType == "NC260" ||
						conf.ProductType == "NC450" 
				){
					$("#mdlivegetimage").attr("src",common.imgsrcHD+"&&tempid="+Math.random());
				}				
			}
		},

	stopMDvideo:function(){			
		if(typeof common.browserInfo.ie == "undefined" || typeof common.browserInfo.edge == "undefined" || typeof common.browserInfo.safari != "undefined"){
			$("#mdlivegetimage").attr("src","#");
		}

		if(typeof common.browserInfo.safari != "undefined"){
			$("#mdlivegetimage").attr("src","#");
			window.stop();//interrupt all request
		}
	},

		Bind:function() {

			$('body').delegate('#mdplayer', 'dragstart', function(e) { // can't drag the img
				return false;
			});
			$('body').delegate('#mdplayer', 'selectstart', function(e) { // can't select all
				return false;
			});
			
			$("#motion_detection-model-enble").click(function(){
				$("#motiondetection-vedioctrl").show();
				$(".content-list-bottom").show();
				$("#motion_detection-clear").hide();
				MotionDetection.startMDvideo();
			});

			$("#motion_detection-model-disable").click(function(){
				$("#motiondetection-vedioctrl").hide();
				$(".content-list-bottom").show();
				$("#motion_detection-clear").hide();
				//$(".motionTable-plug").remove();
				MotionDetection.stopMDvideo();
			});

			$("#motion_detection-save").click(function(){
				MotionDetection.setMD();
				/*if(video.pluginFlag == 1){
					MotionDetection.setMD();
				}
				else
				{
					
					MotionDetection.setMD_noplugin();
				}*/
			});

			$("#motion_detection-clear").click(function(){
				//MotionDetection.motionAreaCleanAll();
			});

			$(".motiondec-radio").click(function() {
				$(".motiondec-radio").removeClass("motiondec-radio-selected");
				$(this).addClass("motiondec-radio-selected");
			});
		},

		GetMD:function() {
			var args = {
				url: '/mdconf_get.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						MotionDetection.mdjson = json;
						MotionDetection.mdenableval = json.is_enable;
						$("#motion-detection-sensitivity").val(json.precision).change();	
						json.is_enable != 0 ? $("#motion_detection-model-enble").click() : $("#motion_detection-model-disable").click();
						
					} else {

					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		GetMD_test:function(){
			var args = {
				//url: '/data/area.json',
				url: '/mdconf_get.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						MotionDetection.mdjson = json;
						MotionDetection.mdenableval = json.is_enable;
						var options = {"area":json.area};
						$("#myTable").CreateDrawer(options);
						$("#motion-detection-sensitivity").val(json.precision).change();	
						json.is_enable != 0 ? $("#motion_detection-model-enble").click() : $("#motion_detection-model-disable").click();
						
					} else {

					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		setMD: function() {
			plug.button.disable($("#motion_detection-save"));

			var RegionData = [0];
			for (var i = 0; i < 25; i++) {
				//RegionData[i] = playerobj.GetMotionArea(i);
				RegionData[i] = 0;
			}
			//console.log(RegionData);
			$(".motion-rec-selected").each(function(){
				var id = $(this).attr("id").split("-");
				var x = parseInt(id[1]);
				var y = parseInt(id[2]);

				if( (x/8) >= 1 ){
					RegionData[2*y+1] += Math.pow(2,15-x);
				}else{
					RegionData[2*y] += Math.pow(2,7-x);
				}
			})

			plug.button.enable($("#motion_detection-save"));
			var args = {
				url: '/mdconf_set.fcgi',
				data: {
					"is_enable": $(".motiondec-radio-selected").val() < 1? $(".motiondec-radio-selected").val():(MotionDetection.mdenableval>0)? MotionDetection.mdenableval:$(".motiondec-radio-selected").val(),
					"precision": $("#motion-detection-sensitivity").val(),
					"area1": RegionData[0],
					"area2": RegionData[1],
					"area3": RegionData[2],
					"area4": RegionData[3], 
					"area5": RegionData[4],
					"area6": RegionData[5],
					"area7": RegionData[6],
					"area8": RegionData[7],
					"area9": RegionData[8],
					"area10": RegionData[9],
					"area11": RegionData[10],
					"area12": RegionData[11],
					"area13": RegionData[12],
					"area14": RegionData[13],
					"area15": RegionData[14],
					"area16": RegionData[15],
					"area17": RegionData[16],
					"area18": RegionData[17],
					"area19": RegionData[18],
					"area20": RegionData[19],
					"area21": RegionData[20],
					"area22": RegionData[21],
					"area23": RegionData[22],
					"area24": RegionData[23],
					"area25": RegionData[24]//useless
				},
				success: function(json) {
					plug.button.enable($("#motion_detection-save"));
					if (json.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.motiondetection.setSuccess
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.motiondetection.setFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#motion_detection-save"));
				}
			}
			common.setAjax.init(args);
		},
		setMD_noplugin: function(){
			plug.button.disable($("#motion_detection-save"));
			var args = {
				url:  '/mdconf_set.fcgi',
				data: {
					"is_enable": $(".motiondec-radio-selected").val(),
					"precision": $("#motion-detection-sensitivity").val()				
				},
				success: function(json) {
					plug.button.enable($("#motion_detection-save"));
					if (json.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.motiondetection.setSuccess
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.motiondetection.setFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#motion_detection-save"));
				}
			}
			common.setAjax.init(args);
		},
		motionAreaCleanAll : function(){
			//playerobj.MotionAreaCleanAll();
		}
	};

	//common.langChange("motionDetect");
	MotionDetection.Init();
//})