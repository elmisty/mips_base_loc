var Status = {
	MODULE:{
		//common.preinit.netconf
		getNetInfo: function(){
			var args = {
				url: '/netconf_get.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						DATA.NETWORK = json;
					}
				},
				error: function(xhr) {
				}
			};
			return common.ajax.init(args);
		},

		//status cloud       
		//common.preinit.cloud
		getCloudInfo: function(){
			var args = {
				url: '/get_cloud.fcgi',
				timeout: 30000,
				success: function(json) {
					DATA.CLOUD = json;
					if (DATA.CLOUD.status == 1 && DATA.CLOUD.binded == 1) {
						setTimeout(function() {
							Status.MODULE.getCloudInfo();
						}, 1000);
					} else {
						//Status.VIEW.CLOUD.init();
					}
				},
				error: function(xhr) {
					//Status.VIEW.CLOUD.getError();
				}
			};
			return common.ajax.init(args);
		},

		//status basic        
		//common.preinit.sysinfo
		getSysInfo: function(){
			var args = {
				url: '/getsysinfo.fcgi',
				success: function(json) {
					DATA.SYSTEM = json;
				},
				error: function(xhr) {
				}
			};
			return common.ajax.init(args);
		},

		//common.preinit.status.viewer

		getReceiver: function(){
			var args = {
				url: '/getreceiver.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						var receiverlength = 0;
						for (var i = 0; i < json.receivers.length; i++) {
							if (json.receivers[i].indexOf("video") == 0) {
								receiverlength++;
							}
						}
						DATA.Viewer = receiverlength;
					} else {
						DATA.Viewer = "-";
					}
				},
				error: function(xhr) {
				}
			};
			return common.ajax.init(args);
		},

		//common.preinit.wireless
		getWirelessInfo: function(){
			var args = {
				url: '/wireless_get.fcgi',
				success: function(json) {
					DATA.WIRELESS.GET = json;
				},
				error: function(xhr) {
				}
			};
			return common.ajax.init(args);
		},

		getVideoSetting: function() {
			var args = {
				url: '/getvideosetting.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						DATA.VIDEO.SETTING = json;
					}
				},
				error: function(xhr) {
				}
			}
			return common.ajax.init(args);
		},
	},

	VIEW:{
		init: function(){
			var json_network = DATA.NETWORK;
			$("#status-lanIp").text(json_network.CurIP || "-");
			$("#status-submask").text(json_network.CurMask || "-");
			$('#status-gateway').text(json_network.CurGW || "-");
			$('#status-pdns').text(json_network.CurDns0 || "-");
			$('#status-sdns').text(json_network.CurDns1 || "-");
			if (json_network.DhcpEnable == 0) {
				$("#status-linktype").text(lang.state.static || "-");
				$("#status-dhcp").text(lang.state.disable || "-");
			} else {
				$("#status-linktype").text(lang.state.dhcp || "-");
				$("#status-dhcp").text(lang.state.enable || "-");
			}
			$("#status-pppoewanip").text(json_network.PPPoeIP || "-");
			$("#status-mac").text(json_network.MacAddress || "-");

			//status pppoe
			if (json_network.PPPoeState == "Disconnected") {
				$("#status-pppoestatus").text(lang.state.disconnect);
			} else if (json_network.PPPoeState == "Connecting") {
				$("#status-pppoestatus").text(lang.state.connecting);
			} else if (json_network.PPPoeState == "Connected") {
				$("#status-pppoestatus").text(lang.state.connected);
			}

			//status cloud
			var json_cloud = DATA.CLOUD;
			if ( json_cloud == "undefined" ){
				$("#status-cloud-status").text(lang.state.disconnect);
				$("#status-cloud-username").text("-");
			}
			if (json_cloud.status == 3 && json_cloud.binded == 1){  
				$("#status-cloud-status").text(lang.state.disconnect);
				$("#status-cloud-username").text(json_cloud.username);
			}else if (json_cloud.status == 4 && json_cloud.binded == 1) { 
				$("#status-cloud-status").text(lang.state.disconnect);
				$("#status-cloud-username").text(json_cloud.username);
			}else if (json_cloud.status == 1) {  
				$("#status-cloud-status").text(lang.state.connecting);
				$("#status-cloud-username").text(json_cloud.username);
			}else if (json_cloud.status == 2 && json_cloud.binded == 1) { 
				$("#status-cloud-status").text(lang.state.connected);
				$("#status-cloud-username").text(json_cloud.username);
			}else{  
				$("#status-cloud-status").text(lang.state.noregister);
				$("#status-cloud-username").text("-");
			}

			//status basic
			var json_sysinfo = DATA.SYSTEM;
			$("#status-cameraname").text(json_sysinfo.cameraName);
			$("#status-devicemodel").text(json_sysinfo.model);
			$("#status-fwVersion").text(json_sysinfo.frmVer);

			var json_videosetting = DATA.VIDEO.SETTING;
			$("#status-resolution-1").text(json_videosetting.profile1.width1+"*"+json_videosetting.profile1.height1);
			$("#status-frameRate-1").text(json_videosetting.profile1.fps1);
			$("#status-imageQuality-1").text(Status.VIEW.videoImageShow(json_videosetting.profile1.qualityvalue1.qualitylevel1));
			$("#status-lightFre").text(Status.VIEW.freShow(json_videosetting.powerline_frequency.value));
			if(conf.ProductType == "NC220")
			{
				$("#status-resolution-2").text(json_videosetting.profile3.width3+"*"+json_videosetting.profile3.height3);
				$("#status-frameRate-2").text(json_videosetting.profile3.fps3);
				$("#status-imageQuality-2").text(Status.VIEW.videoImageShow(json_videosetting.profile3.qualityvalue3.qualitylevel3));
			}	
				
			var json_wireless = DATA.WIRELESS.GET;
			if( json_wireless.WlanStatus == "Disconnected" ) {
				$("#status-wireless-status").text(lang.state.disconnect);
				$("#status-wireless-name").html("-");
				$("#status-wireless-channel").text("-");
				$("#status-wireless-strength").text("-");
				$("#status-wireless-security").text("-");
			}else if ( json_wireless.WlanStatus == "Connected" ) {
				$("#status-wireless-status").text(lang.state.connected);
				$("#status-wireless-name").html(common.transToHTML(Base64.decode(json_wireless.SSID)) || "-");
				$("#status-wireless-channel").text(json_wireless.Channel);
				$("#status-wireless-strength").text(json_wireless.Signal + "%" || "85%");
				$("#status-wireless-security").text(json_wireless.Auth);
			}else if (json_wireless.WlanStatus == "ConnectedUnUsed") {
				$("#status-wireless-status").text(lang.state.connectedunused);
				$("#status-wireless-name").html("-");
				$("#status-wireless-channel").text("-");
				$("#status-wireless-strength").text("-");
				$("#status-wireless-security").text("-");
			}

			$("#status-viewer").text(DATA.Viewer);
		},

		videoImageShow: function(value){
			var imageQuality; 
			if(value == 0){
				imageQuality = "High";
			}else if(value == 1){
				imageQuality = "Medium";
			}else if(value == 2){
				imageQuality = "Low";
			}
			return imageQuality;
		},

		freShow: function(value){
			var lightFre; 
			if(value == 0){
				lightFre = "Auto";
			}else if(value == 1){
				lightFre = "50Hz";
			}else if(value == 2){
				lightFre = "60Hz";
			}
			return lightFre;
		}
	},

	init: function(){
		conf.confStatusDisplay(conf.ProductType);
		$.when( Status.MODULE.getNetInfo() ,
			Status.MODULE.getWirelessInfo(), 
			Status.MODULE.getCloudInfo(),
			Status.MODULE.getSysInfo(),
			Status.MODULE.getReceiver(),
			Status.MODULE.getVideoSetting()
		).done(function(){
			Status.VIEW.init();	
		});
	}
};







