var Wireless = {
	wirelessCount: null,
	wirelessInfo: {}, 

	MODULE:{
		getWirelessInfo: function(){
			var args = {
				url: '/wireless_get.fcgi',
				success: function(json) {
					DATA.WIRELESS.GET = json;
				},
				error: function(xhr) {
				}
			};
			common.ajax.init(args);
		},

		wirelessScan:function(){		
			var args = {
				url: '/wireless_scan.fcgi',
				timeout: 5000,
				beforeSend:function(){
					Wireless.VIEW.SCAN("beforeSend");
				},
				complete:function(){
					Wireless.VIEW.SCAN("complete");
				},
				success:function(json){	
					DATA.WIRELESS.SCAN = json;
										
					Wireless.VIEW.SCAN("succeed");
				},
				error:function(xhr){
					Wireless.VIEW.SCAN("error");
				}
			};
			common.ajax.init(args);
		},

		setWireless: function(data) {		
			var args = {
				url: '/wireless_set.fcgi',
				timeout: 3000,
				data: data,
				beforeSend: function(){
					Wireless.VIEW.SET("beforeSend");
				},
				success: function(json) {
					$.extend(DATA.WIRELESS.GET, data);
					Wireless.VIEW.SET("success",json);
				},
				error: function(xhr) {
					Wireless.VIEW.SET("error");
				}
			}
			common.setAjax.init(args);
		}
	},

	VIEW: {
		init: function(){
			conf.confWirelessDisplay(conf.ProductType);
			var json = DATA.WIRELESS.GET;
			if (json.Enable == 1){
				/*Wireless.wirelessInfo.channel = json.Channel;
				Wireless.wirelessInfo.signal = json.Signal;
				Wireless.wirelessInfo.ssid = common.transToHTML(Base64.decode(json.SSID));
				Wireless.wirelessInfo.auth = json.Auth;
				Wireless.wirelessInfo.encp = json.Encryp;
				Wireless.wirelessInfo.wpakey = Base64.decode(json.WpaKey);
				Wireless.wirelessInfo.HtExtCha = json.HtExtCha;
				Wireless.wirelessInfo.wepkey = Base64.decode(json.WepKey);
				Wireless.wirelessInfo.wepkeyindex = json.WepKeyIndex;

				Wireless.VIEW.tableInit(true, DATA.WIRELESS.SCAN.ApInfo);//initEmpty true
				
				$("#wireless_connection-scan").show();
				$(".wireless-img-container").hide();
				$(".setting-contain-wireless-ctrl-table").show();


				$("#wireless_network-auto-ssid").text(Wireless.wirelessInfo.ssid);

				if(json.Auth == "WEP"){
					$("#wireless-auto-wep-contain").show();
					$("#wireless_connection-auto-wepkey").val(Wireless.wirelessInfo.wepkey);
				}else if(json.Auth == "None"){

				}else{
					$("#wireless-auto-wpa-contain").show();
					$("#wireless_connection-auto-wpakey").val(Wireless.wirelessInfo.wpakey);
				}*/
				$("#wireless_connection_model-enable").click();

			}else{
				$("#wireless_connection_model-disable").click();
			}		
		},

		tableInit: function(initEmpty, json) {
			var options = {
					holder: ".setting-contain-wireless-ctrl-table",
					initTips: lang.info.wirelessTableScanTips,
					emptytips: lang.ajax.wireless.scanempty,
					column:{
						count: 7,
						width: [320, 50, 150, 90, 50, 150, 50],
						display: ["block", "block", "block", "none", "none", "block", "none"]			
					},
					row:10,
					title: [ lang.wirelessConnect.listWirelessname,
							 lang.wirelessConnect.listSignal,  
							 lang.wirelessConnect.listSecurity, 
							 lang.wirelessConnect.listEncryption, 
							 lang.wirelessConnect.listChannel,	 
							 lang.wirelessConnect.listMacAddr, 
							 lang.wirelessConnect.listHtExtCha ],
					data: {
						initEmpty: initEmpty,//init set emputy tips
						json: [],
						option: ["SSID", "Signal", "AuthType", "EncrypType", "Channel", "BSSID", "HtExtCha"],
						hidden: [0] //index to be hidden .if ssid is "", hide it. Now Only support one index.
					},
					toolBar:{
						enable:false
					},
					height: 30,
					reinitBody: false,
					returnStr: false,
					mouseSelect: true
			};

			options.data.json = json;
			//common.wirelesslistStr = $.createTable(options); 	
			$.createTable(options);
			
			//$(".setting-contain-wireless-ctrl-table").html("");
			//$(".setting-contain-wireless-ctrl-table").html(common.wirelesslistStr);

			/*setTimeout(function(){
				$("#xx").addScroll();
				},0);
			$.createTableBind();*/

			$(".plug-table-body-tr").click(function(){
				Wireless.wirelessInfo.ssid = $(this).find(".plug-table-body-th-0 span").html();
				Wireless.wirelessInfo.auth = $(this).find(".plug-table-body-th-2 span").text();
				Wireless.wirelessInfo.channel = $(this).find(".plug-table-body-th-4 span").text();
				Wireless.wirelessInfo.encp = $(this).find(".plug-table-body-th-3 span").text();
				Wireless.wirelessInfo.HtExtCha = $(this).find(".plug-table-body-th-6 span").text();
				Wireless.wirelessInfo.wepkey = "";
				Wireless.wirelessInfo.wpakey = "";
				$("#wireless_network-auto-ssid").html(Wireless.wirelessInfo.ssid);
				Wireless.VIEW.infoshow(Wireless.wirelessInfo.auth);
				$("#wireless_connection-auto-wpakey").val("");
				$("#wireless_connection-auto-wepkey").val("");
			});

			Wireless.VIEW.SSIDdeCodeBase64();
			Wireless.VIEW.signImage();
			Wireless.VIEW.connectedSelect(DATA.WIRELESS.SCAN);		
		},


		signImage: function() {
			$(".plug-table-body-tr .plug-table-body-th-1").each(function() {
				if (Number($(this).text()) <= 100 && Number($(this).text()) >= 80) {
					$(this).html("<div class='wireless-table-img'></div>");
					if ($(this).next().children("span").text() == "None") {//no key
						$(this).children(".wireless-table-img").addClass("signal-4");
					} else {
						$(this).children(".wireless-table-img").addClass("signal-1");
					}
				} else if (Number($(this).text()) < 80 && Number($(this).text()) >= 40) {
					$(this).html("<div class='wireless-table-img'></div>");
					if ($(this).next().children("span").text() == "None") {
						$(this).children(".wireless-table-img").addClass("signal-5");
					} else {
						$(this).children(".wireless-table-img").addClass("signal-2");
					}
				} else {
					$(this).html("<div class='wireless-table-img'></div>");
					if ($(this).next().children("span").text() == "None") {
						$(this).children(".wireless-table-img").addClass("signal-6");
					} else {
						$(this).children(".wireless-table-img").addClass("signal-3");
					}
				}
			});
		},

		infoshow: function(authType) {
			if (authType == "None") {
				$("#wireless-auto-wep-contain").hide();
				$("#wireless-auto-wpa-contain").hide();
			} else if (authType == "WEP") {
				$("#wireless-auto-wep-contain").show();
				$("#wireless-auto-wpa-contain").hide();
				$("#wireless_connection-auto-wepkey").val(Wireless.wirelessInfo.wepkey);
			} else {
				$("#wireless-auto-wpa-contain").show();
				$("#wireless-auto-wep-contain").hide();
				$("#wireless_connection-auto-wpakey").val(Wireless.wirelessInfo.wpakey);
			}
		},


		connectedSelect: function(json) {
			if (json.WlanStatus == "Connected" && json.ConnectedAPBSSID.toUpperCase() == json.ApInfo[0].BSSID) {
				var signal, security, holder;
				signal = Number(json.ApInfo[0].Signal);
				security = json.ApInfo[0].AuthType;
				holder = $(".plug-table-body-tr .plug-table-body-tr-0 .plug-table-body-th-1 .wireless-table-img");

				$(".plug-table-body-tr-0").css({
					"color": "#21A5DD",
					"font-weight": "bold"
				});
				if (signal <= 100 && signal >= 80) {
					if (security == "None") {
						holder.addClass("signal-7");
					} else {
						holder.addClass("signal-8");
					}
				} else if (signal < 80 && signal >= 40) {
					if (security == "None") {
						holder.addClass("signal-10");
					} else {
						holder.addClass("signal-12");
					}
				} else {
					if (security == "None") {
						holder.addClass("signal-9");
					} else {
						holder.addClass("signal-11");
					}
				}
				$(".plug-table-body-tr-0 .plug-table-body-th-0 span").before("<div class='connectedselect'></div>");
				$(".plug-table-body-tr-0 .plug-table-body-th-1 .wireless-table-img").addClass("signal-8");
			} else if (json.WlanStatus == "ConnectedUnUsed") {

			} else {

			}
		},


		SSIDdeCodeBase64: function(){
			$(".plug-table-body-th-0 span").each(function() {
				$(this).html(common.transToHTML(Base64.decode($(this).html())));
			});
		},

		SCAN: function(status,holder){
			switch(status)
			{
				case "beforeSend":
				$(".setting-contain-wireless-ctrl-table").html("");
					$(".wireless-img-container").show();
					break;
				case "complete":
					$(".wireless-img-container").hide();
					$(holder).show();
					plug.button.enable($('#wireless_connection-save'));
					plug.button.enable($('#wireless_connection-scan'));
					break;
				case "succeed":
					$("#wireless_connection-scan").show();
					Wireless.VIEW.tableInit(false,DATA.WIRELESS.SCAN.ApInfo);
					break;
				case "error":
					$("#wireless_false_tips").text(lang.ajax.wireless.scanFailed);
					$("#wireless_connection-scan").show();
					Wireless.VIEW.tableInit(false,DATA.WIRELESS.SCAN.ApInfo);
					plug.button.enable($('#wireless_connection-save'));
					plug.button.enable($('#wireless_connection-scan'));
					break;
			}
		},
		SET: function(status,json){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($('#wireless_connection-scan'));
					plug.button.disable($('#wireless_connection-save'));
					$(".setting-contain-wireless-ctrl-table").hide();
					$(".wireless-img-container").show();
					break;
				case "success":
					if (json.errorCode == 0) {
						Wireless.wirelessCount = 0;
						if ($(".wireless-radio-setting-selected").val() == 1) { //enable wireless
							Wireless.wirelessStatusDetection();
						} else { //disable wireless
							plug.window.alert({
								"info": lang.ajax.wireless.setSuccess
							});
							$(".wireless-img-container").hide();
							//$("#sevenTables-setting-contain-wireless-ctrl-table").show();
							$(".setting-contain-wireless-ctrl-table").show();
							plug.button.enable($('#wireless_connection-scan'));
							plug.button.enable($('#wireless_connection-save'));
						}
					} else if (json.errorCode == 316) {
						$(".wireless-img-container").hide();
						//$("#sevenTables-setting-contain-wireless-ctrl-table").show();
						$(".setting-contain-wireless-ctrl-table").show();
						plug.window.alert({
							"info": lang.ajax.wireless.hasused
						});
						plug.button.enable($('#wireless_connection-scan'));
						plug.button.enable($('#wireless_connection-save'));
					} else {
						$(".wireless-img-container").hide();
						//$("#sevenTables-setting-contain-wireless-ctrl-table").show();
						$(".setting-contain-wireless-ctrl-table").show();
						plug.window.alert({
							"info": lang.ajax.wireless.setFailed
						});
						plug.button.enable($('#wireless_connection-scan'));
						plug.button.enable($('#wireless_connection-save'));
					}
					break;
				case "error":
					break;
			}
		}
	},

	//入口
	init:function(){			
		Wireless.bind();
		Wireless.MODULE.getWirelessInfo();
		Wireless.VIEW.init();
	},

	bind:function(){
		/*manuall dispaly*/
		if ( common.pageMode != "Basic" ){
			$("#wireless_connection-switch-button").show();
		}

		/*wireless connection disable/enable*/
		$("#wireless_connection_model-disable").click(function(){
			$("#wireless_connection_patch").hide();	
			$("#wireless_connection_model-enable").removeClass("wireless-radio-setting-selected");
			$(this).addClass("wireless-radio-setting-selected");
			$("#wireless_connection-save").val("Save");
		});

		$("#wireless_connection_model-enable").click(function(){
			$("#wireless_connection_patch").show();	
			$("#wireless_connection-manually").hide();
			$("#wireless_connection_model-disable").removeClass("wireless-radio-setting-selected");
			$(this).addClass("wireless-radio-setting-selected");
			$("#wireless_connection-save").val("Connect");
			if("NC210" != conf.ProductType)
			{
				Wireless.enableWireless();
			}
			var json = DATA.WIRELESS.GET;
			
			Wireless.wirelessInfo.channel = json.Channel;
			Wireless.wirelessInfo.signal = json.Signal;
			Wireless.wirelessInfo.ssid = common.transToHTML(Base64.decode(json.SSID));
			Wireless.wirelessInfo.auth = json.Auth;
			Wireless.wirelessInfo.encp = json.Encryp;
			Wireless.wirelessInfo.wpakey = Base64.decode(json.WpaKey);
			Wireless.wirelessInfo.HtExtCha = json.HtExtCha;
			Wireless.wirelessInfo.wepkey = Base64.decode(json.WepKey);
			Wireless.wirelessInfo.wepkeyindex = json.WepKeyIndex;

			Wireless.VIEW.tableInit(false, DATA.WIRELESS.SCAN.ApInfo);//initEmpty true
			
			$("#wireless_connection-scan").show();
			$(".wireless-img-container").hide();
			$(".setting-contain-wireless-ctrl-table").show();


			$("#wireless_network-auto-ssid").html(Wireless.wirelessInfo.ssid);

			if(json.Auth == "WEP"){
				$("#wireless-auto-wep-contain").show();
				$("#wireless_connection-auto-wepkey").val(Wireless.wirelessInfo.wepkey);
			}else if(json.Auth == "None"){

			}else{
				$("#wireless-auto-wpa-contain").show();
				$("#wireless_connection-auto-wpakey").val(Wireless.wirelessInfo.wpakey);
			}
		});

		/*Wireless Connection auto/manually*/
		$("#wireless_connection-switch-button").toggle(
			function(){
				$(this).val(lang.wirelessConnect.auto);
				$("#wireless-name-manually").show();
				$("#wireless-name-auto").hide();
				$("#wireless_connection-auto").hide();
				$("#wireless_connection-manually").show();
			},
			function(){
				$(this).val(lang.wirelessConnect.manually);
				$("#wireless-name-manually").hide();
				$("#wireless-name-auto").show();
				$("#wireless_connection-manually").hide();
				$("#wireless_connection-auto").show();
			}
		);

		/*Wireless Connection Security switch*/


		$("#content-wireless_connection-security").change(function(){
			$("option:selected",this).click();
		});

		$("#wireless_connection-security-none").click(function(){
			$(".wireless-man-wep-contain").hide();
			$(".wireless-man-wpa-contain").hide();
		});

		$("#wireless_connection-security-wep").click(function(){
			$(".wireless-man-wpa-contain").hide();
			$(".wireless-man-wep-contain").show();
		});

		$("#wireless_connection-security-wpa").click(function(){
			$(".wireless-man-wpa-contain").show();
			$(".wireless-man-wep-contain").hide();

		});

		$("#wireless_connection-security-wpa2").click(function(){
			$(".wireless-man-wpa-contain").show();
			$(".wireless-man-wep-contain").hide();

		});

		$("#wireless_connection-security-wpawpa2").click(function(){
			$(".wireless-man-wpa-contain").show();
			$(".wireless-man-wep-contain").hide();

		});

		$("#wireless_connection-scan").click(function(){
			$(".sevenTablesholder").remove();
			plug.button.disable($('#wireless_connection-save'));
			plug.button.disable($('#wireless_connection-scan'));
			Wireless.MODULE.wirelessScan();
		});
		$("#wireless_connection-save").click(function() {
			if (Wireless.wirelessValid.valid() == true) {
				plug.window.confirm({
					"info": lang.ajax.wireless.warning,
					"btnConfirm": lang.plug.Change,
					"confirm": function() {
						var data = {
							"Enable": $(".wireless-radio-setting-selected").val(),
							"Channel": 10,
							"SSID": "ipcamtest",
							"Auth": "WPA2PSK",
							"Encryp": "AES",
							"WepKeyIndex": 1,
							"WepKey": "",
							"WpaKey": "zsbzsb757",
							"Encryp": "TKIPAES",
							"HtExtCha": 1,
							"SameAsHost": DATA.WIRELESS.GET.ExtEnable 
						};
						data.Enable = $(".wireless-radio-setting-selected").val();
						if ($("#wireless_connection-switch-button").val() == "Manually") {
							data.Channel = Wireless.wirelessInfo.channel;
							data.SSID = Base64.encode(common.transToTEXT(Wireless.wirelessInfo.ssid));
							data.Encryp = Wireless.wirelessInfo.encp;
							data.Auth = Wireless.wirelessInfo.auth;
							data.HtExtCha = Wireless.wirelessInfo.HtExtCha;
							data.WepKeyIndex = Wireless.wirelessInfo.wepkeyindex;
							data.WepKey = $("#wireless_connection-auto-wepkey").is(":hidden")? Base64.encode($("#wireless_connection-auto-wepkey-decode").val()) : Base64.encode($("#wireless_connection-auto-wepkey").val());
							data.WpaKey = $("#wireless_connection-auto-wpakey").is(":hidden")? Base64.encode($("#wireless_connection-auto-wpakey-decode").val()) : Base64.encode($("#wireless_connection-auto-wpakey").val());
						} else {
							data.Channel = 0;
							data.SSID = Base64.encode($("#wireless_network-manually-ssid").val());
							data.Encryp = $("#wireless_connection-encryption").val();
							data.HtExtCha = 2;
							data.Auth = $("#content-wireless_connection-security").val();
							data.WepKeyIndex = $("#wireless_connection-wep_key_index").val();
							data.WepKey = $("#wireless_connection-man-wepkey").is(":hidden")? Base64.encode($("#wireless_connection-man-wepkey-decode").val()) : Base64.encode($("#wireless_connection-man-wepkey").val());
							data.WpaKey = $("#wireless_connection-man-wpakey").is(":hidden")? Base64.encode($("#wireless_connection-man-wpakey-decode").val()) : Base64.encode($("#wireless_connection-man-wpakey").val());
						}

						Wireless.MODULE.setWireless(data);
					},
					"cancel": function() {
						return;
					}
				});
			}
		});

		$(".showpwd").click(function(){
			if( $(this).attr("checked")){
				var key = $(this).prevAll(".input-pwd:first").val();
				$(this).prevAll(".input-pwd:first").hide();
				$(this).prevAll(".pwd-text:first").val(key).show();
			}else{
				var key = $(this).prevAll(".pwd-text:first").val();
				$(this).prevAll(".input-pwd:first").val(key).show();
				$(this).prevAll(".pwd-text:first").hide();
			}			
		});
	},

	wirelessValid: {
		valid: function() {
			var a = Wireless.wirelessValid.autoWepKey() && Wireless.wirelessValid.autoPskKey() && Wireless.wirelessValid.manualSsid() && Wireless.wirelessValid.manualWepkey() && Wireless.wirelessValid.manualPSK();
			return a
		},
		autoWepKey: function() {
			if($("#wireless_connection-auto-wepkey").is(":hidden")){
				if ($("#wireless_connection-auto-wepkey:hidden").length == 1) {
					return true;
				}
				else
				{
					return common.validInfo(valid.inWepkey($("#wireless_connection-auto-wepkey-decode").val()));
				}
			} 
			else {
				return common.validInfo(valid.inWepkey($("#wireless_connection-auto-wepkey").val()));
			}
		},
		autoPskKey: function() {
			if($("#wireless_connection-auto-wpakey").is(":hidden"))
			{
				if ($("#wireless_connection-auto-wpakey:hidden").length == 1){
					return true;
				}
				else
				{
					return common.validInfo(valid.inWpaWpa2Psk($("#wireless_connection-auto-wpakey-decode").val()))
				}
			} 
			else {
				return common.validInfo(valid.inWpaWpa2Psk($("#wireless_connection-auto-wpakey").val()))
			}
		},
		manualSsid: function() {
			if ($("#wireless_network-manually-ssid:hidden").length == 1) {
				return true;
			} else {
				/* Allow unicode string */
				/* return common.validInfo(valid.ssid($("#wireless_network-manually-ssid").val())) */
				return true;
			}
		},
		manualWepkey: function() {
			if($("#wireless_connection-man-wepkey").is(":hidden"))
			{
				if ($("#wireless_connection-man-wepkey:hidden").length == 1) {
					return true;
				}
				else
				{
					return common.validInfo(valid.inWepkey($("#wireless_connection-man-wepkey-decode").val()))
				}
			} else {
				return common.validInfo(valid.inWepkey($("#wireless_connection-man-wepkey").val()))
			}
		},
		manualPSK: function() {
			if($("#wireless_connection-man-wpakey").is(":hidden"))
			{
				if ($("#wireless_connection-man-wpakey:hidden").length == 1) {
					return true;
				}
				else
				{
					return common.validInfo(valid.inWpaWpa2Psk($("#wireless_connection-man-wpakey-decode").val()));
				}
			}
			else {
				return common.validInfo(valid.inWpaWpa2Psk($("#wireless_connection-man-wpakey").val()))
			}
		}
	},

	wirelessStatusDetection: function() {
		setTimeout(function() {
			var args = {
				url: '/wireless_status.fcgi',
				success: function(json) {
					DATA.WIRELESS.GET.WlanStatus = json.WlanStatus;
					if (json.WlanStatus == "Connected") { 
						$(".sevenTablesholder").remove();
						Wireless.MODULE.wirelessScan();
						$(".setting-contain-wireless-ctrl-table").show();
					} else if (json.WlanStatus == "ConnectedUnUsed") { 
						plug.window.alert({
							"info": lang.ajax.wireless.connectunused1 + common.transToHTML(Base64.decode(json.SSID)) + lang.ajax.wireless.connectunused2,
							"ok": function() {
								$(".sevenTablesholder").remove();
								Wireless.MODULE.wirelessScan();
								$(".setting-contain-wireless-ctrl-table").show();
							}
						});

					} else if (json.WlanStatus == "Disconnected" && Wireless.wirelessCount >= 10) {
						plug.window.alert({
							"info": lang.ajax.wireless.conncetfailed
						});
						$(".setting-contain-wireless-ctrl-table").show();
						//$("#connection-img-load").hide();
						$(".wireless-img-container").hide();
						$("#sevenTables-setting-contain-wireless-ctrl-table").show();
						plug.button.enable($('#wireless_connection-scan'));
						plug.button.enable($('#wireless_connection-save'));

						
					} else { 
						Wireless.wirelessCount++;
						Wireless.wirelessStatusDetection();
					}
				}
			}
			common.ajax.init(args);
		}, 2000);
	},

	enableWireless: function() {
		//plug.button.disable($('#wireless_connection-save'));
		$(".sevenTablesholder").remove();
		var args = {
			url: '/wireless_enable.fcgi',
			data: {
				"Enable": $(".wireless-radio-setting-selected").val()
			},
			success: function(json) {
				if (json.errorCode == 0) {
					//Wireless.tableInit(common.wirelessCache.ApInfo);
					$("#wireless_connection-scan").show();
					plug.button.enable($('#wireless_connection-save'));
				} else if (json.errorCode == 1) {
					//Wireless.tableInit(common.wirelessCache.ApInfo);
					$("#wireless_connection-scan").show();
					plug.button.enable($('#wireless_connection-save'));
				} else {
				}
			},
			error: function(xhr) {
				plug.button.enable($('#wireless_connection-save'));
			}
		}
		common.setAjax.init(args);
	}
};







