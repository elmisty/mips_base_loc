//$(document).ready(function(){
var Network = {
	pppoeShowLoadingInterval: null, //pppoe载入中处理循环
	pppoeLoopLoginCount: null, //pppoe执行登录请求计数
	pppoeIp: null, //pppoeip
	pppoeStateInterval: null, //pppoe循环检测

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
			common.ajax.init(args);
		},
		//设置network信息   common.preinit.network
		ipSet: function(data){
			var args = {
				url: '/netconf_set.fcgi',
				timeout: 15000,
				data: data,
				success: function(json) {
					DATA.NETWORK.DhcpEnable = data.DhcpEnable;
					DATA.NETWORK.StaticIP = data.StaticIP;
					DATA.NETWORK.StaticMask = data.StaticMask;
					DATA.NETWORK.StaticGW = data.StaticGW;
					DATA.NETWORK.StaticDns0 = data.StaticDns0;
					DATA.NETWORK.StaticDns1 = data.StaticDns1;
					DATA.NETWORK.FallbackIP = data.FallbackIP;
					DATA.NETWORK.FallbackMask = data.FallbackMask;
					DATA.NETWORK.HttpPort = data.HttpPort;
					DATA.NETWORK.Bonjour.bonjourStatus = data.bonjourState;
					Network.VIEW.ipSetResponse(json,"succeed");
				},
				error: function(xhr) {
					Network.VIEW.ipSetResponse("","error");
				}
			}
			common.setAjax.init(args);
		}
	},

	VIEW:{
		init: function(){
			var json_network = DATA.NETWORK;
			json_network.DhcpEnable == 0 ? $("#ip_model-staticip").click() : $("#ip_model-dynamicip").click();
			$("#network-mac").text(json_network.MacAddress);
			$("#network-httpport").val(json_network.HttpPort);
			$("#content-static-ip-ip_address").val(json_network.StaticIP);
			$("#content-static-ip-sub_netmask").val(json_network.StaticMask);
			$("#content-static-ip-default_gateway").val(json_network.StaticGW);
			$("#content-static-ip_pds").val(json_network.StaticDns0);
			$("#content-static-ip_sds").val(json_network.StaticDns1);

			$("#network_fallbackip").val(json_network.FallbackIP);

			$("#network-bonjour_name").text(json_network.Bonjour.bonjourName);


			if (json_network.Bonjour.bonjourStatus == 1) {
				$("#bonjour_model-enable").click();
			} else {
				$("#bonjour_model-disable").click();
			}

			if (conf.ProductType == 'NC220' || conf.ProductType == 'NC230' || conf.ProductType == 'NC250') {
				//Network.VIEW.pppoeInit();
				//Network.VIEW.upnpInit();
			}
		
		},
		pppoeInit: function () {
			var json_network = DATA.NETWORK;
			$("#content-pppoe-username").val(Base64.decode(json_network.PPPoeUsr));
			$("#content-pppoe-password").val(Base64.decode(json_network.PPPoePwd));
			Network.pppoeStatus(json_network.PPPoeState);
			Network.pppoeIp = json_network.PPPoeIP;
			if (json_network.PPPoeAuto == 1) {
				$("#pppoe_model-enable").click();
			} else {
				$("#pppoe_model-disable").click();
			};
		},
		upnpInit: function () {
			var json_network = DATA.NETWORK;
			$("#network-upnp_name").text(Base64.decode(json_network.Upnp.name));
			if (json_network.Upnp.isEnable == 1) {
				$("#upnp_model-enable").click();					
				video.upnpInfo.ip = (Base64.decode(json_network.Upnp.wlan_ip));
				video.upnpInfo.port = (Base64.decode(json_network.Upnp.stream_wlan_port));
			} else {
				$("#upnp_model-disable").click();
			}	
		},

		ipSetResponse: function(json,status){
			if( status == "succeed"){
				plug.button.enable($("#network-save"));
				common.removeShadeLayer();
				if (json.errorCode == 0) {
					
					plug.window.alert({
						"info": lang.ajax.netconf.ipsetSuccess
					});
					var port;
					$("#network-httpport").val() == 80 ? port = "" : port = $("#network-httpport").val();
					
					
					/*if (video.upnpInfo.port && (location.hostname == video.upnpInfo.ip || location.hostname == video.upnpInfo.noip || location.hostname == video.upnpInfo.dyndns || location.hostname == video.upnpInfo.cmxaction)) {
							
					} else if (Network.pppoeIp == location.hostname) {
							
					} else */
					if (location.hostname == json.DhcpJumpIP && location.port == port) {
							
					} else {
						var link = "http://" + json.DhcpJumpIP + ":" + $("#network-httpport").val() + "/login.html";
						location.href = link;
						//location.href = "http://www.baidu.com";
					}

					Network.pppoeLoopLoginCount = 0;
					Network.pppoeStateDetect();

					Network.MODULE.getNetInfo();					
				} else if (json.errorCode == 118) {
					plug.window.alert({
						"info": lang.ajax.netconf.portDisable
					});
				} else if (json.errorCode == 117) {
					plug.window.alert({
						"info": lang.ajax.netconf.ipDisable
					});
				} else if (json.errorCode == 120) {
					plug.window.alert({
						"info": lang.ajax.netconf.portDisable
					});
				} else {
					plug.window.alert({
						"info": lang.ajax.netconf.ipsetFailed
					});
				}
			}else{
				plug.button.enable($("#network-save"));
				common.removeShadeLayer();
				if (video.upnpInfo.port && (location.hostname == video.upnpInfo.ip || location.hostname == video.upnpInfo.noip || location.hostname == video.upnpInfo.dyndns || location.hostname == video.upnpInfo.cmxaction)) {
				//	location.href = location.href;
				} else {
					location.href = "http://" + $("#content-static-ip-ip_address").val() + ":" + $("#network-httpport").val() + "/login.html";
				}
			}
		}
	},

	init: function(){
		if( common.pageMode == "Advanced" ){
			$("#content-network-advanced").show();
		}else{
			$("#content-network-advanced").hide();
		}
		conf.confNetworkDisplay(conf.ProductType);
		Network.bind();
		Network.VIEW.init();
		Network.MODULE.getNetInfo();
		Network.pppoeStateDetect();
	},

	bind: function(){
		$("#ip_model-staticip").click(function(){
			$("#ip_model-dynamicip").removeClass("ip-radio-setting-selected");
			$(this).addClass("ip-radio-setting-selected");
			$("#content-network-static_ipsetting").show();		
			$("#content-network-dynamicip-fallbackip").hide();	
		});
		$("#ip_model-dynamicip").click(function(){
			$("#ip_model-staticip").removeClass("ip-radio-setting-selected");
			$(this).addClass("ip-radio-setting-selected");
			$("#content-network-static_ipsetting").hide();
			if( common.pageMode == "Advanced" ){
				$("#content-network-dynamicip-fallbackip").show();
			} else {
				$("#content-network-dynamicip-fallbackip").hide();
			}
		});

		$("#pppoe_model-enable").click(function(){
			$("#pppoe_model-disable").removeClass("pppoe-radio-setting-selected");
			$(this).addClass("pppoe-radio-setting-selected");
			$("#content-network-pppoe_setting").show();

		});
		$("#pppoe_model-disable").click(function(){
			$("#pppoe_model-enable").removeClass("pppoe-radio-setting-selected");
			$(this).addClass("pppoe-radio-setting-selected");
			$("#content-network-pppoe_setting").hide();
		});
		$("#upnp_model-enable").click(function(){
			$("#upnp_model-disable").removeClass("upnp-radio-setting-selected");
			$(this).addClass("upnp-radio-setting-selected");
		});
		$("#upnp_model-disable").click(function(){
			$("#upnp_model-enable").removeClass("upnp-radio-setting-selected");
			$(this).addClass("upnp-radio-setting-selected");
		});
		$("#bonjour_model-enable").click(function(){
			$("#bonjour_model-disable").removeClass("bonjour-radio-setting-selected");
			$(this).addClass("bonjour-radio-setting-selected");
		});
		$("#bonjour_model-disable").click(function(){
			$("#bonjour_model-enable").removeClass("bonjour-radio-setting-selected");
			$(this).addClass("bonjour-radio-setting-selected");
		});
		$("#network-save").click(function() {
			var data = {
				"DhcpEnable": $(".ip-radio-setting-selected").val(),
				"StaticIP": $("#content-static-ip-ip_address").val(),
				"StaticMask": $("#content-static-ip-sub_netmask").val(),
				"StaticGW": $("#content-static-ip-default_gateway").val(),
				"StaticDns0": $("#content-static-ip_pds").val(),
				"StaticDns1": $("#content-static-ip_sds").val(),

				"FallbackIP": $("#network_fallbackip").val(),
				"FallbackMask": "255.255.255.0",
				//"PPPoeAuto": $(".pppoe-radio-setting-selected").val(),
				//"PPPoeUsr": Base64.encode($("#content-pppoe-username").val()),
				//"PPPoePwd": Base64.encode($("#content-pppoe-password").val()),
				"HttpPort": $("#network-httpport").val(),
				//"isEnable": $(".upnp-radio-setting-selected").val(),	
				"bonjourState": $(".bonjour-radio-setting-selected").val()
			};
			if (conf.ProductType == 'NC220' || conf.ProductType == 'NC230' || conf.ProductType == 'NC250') {
				data.PPPoeAuto = $(".pppoe-radio-setting-selected").val();
				data.PPPoeUsr = Base64.encode($("#content-pppoe-username").val());
				data.PPPoePwd = Base64.encode($("#content-pppoe-password").val());
				data.isEnable = $(".upnp-radio-setting-selected").val();
			}
			if ( Network.ipsetValid.valid() == true ){
				plug.button.disable($("#network-save"));
				common.shadeLayer();
				Network.MODULE.ipSet(data);
			}
		});
	},

	pppoeStateDetect: function() {
		Network.pppoeStateInterval = clearInterval(Network.pppoeStateInterval);
		Network.pppoeStateInterval = setInterval(function() {
			var args = {
				url: '/pppoe_state.fcgi',
				success: function(json) {
					Network.pppoeLoopLoginCount = Network.pppoeLoopLoginCount + 1;
					if (json.errorCode == 0) {
						if (json.PPPoeState == "Connected") {
							Network.pppoeShowLoadingEnd($("#network-pppoestate"));
							Network.pppoeStatus("Connected");
							Network.pppoeStateInterval = clearInterval(Network.pppoeStateInterval);
						} else if (json.PPPoeState == "Connecting") {
							Network.pppoeShowLoadingStart($("#network-pppoestate"), lang.state.connecting);
						} else if (json.PPPoeState == "Disconnected") {
							Network.pppoeStateInterval = clearInterval(Network.pppoeStateInterval);
							Network.pppoeShowLoadingEnd($("#network-pppoestate"));
							Network.pppoeStatus("Disconnected");
						} else if (Network.pppoeLoopLoginCount > 20) {
							Network.pppoeShowLoadingEnd($("#network-pppoestate"));
							Network.pppoeStateInterval = clearInterval(Network.pppoeStateInterval);
							Network.pppoeStatus("Disconnected");
						}
					} else {
						alert(lang.ajax.netconf.pppoeLoginFailed);
					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		}, 3000);
	},

	pppoeShowLoadingStart: function(holder, text) {
		holder.text(text);
		Network.pppoeShowLoadingInterval = clearInterval(Network.pppoeShowLoadingInterval);
		Network.pppoeShowLoadingInterval = setInterval(function() {
			holder.text(holder.text() + ".");
			holder.text() == text + "......" ? holder.text(text) : null;
		}, 500)
	},

	pppoeShowLoadingEnd: function(holder, text) {
		var text = text || "";
		holder.text(text);
		Network.pppoeShowLoadingInterval = clearInterval(Network.pppoeShowLoadingInterval);
	},
	
	ipsetValid: {
		valid: function() {
			return Network.ipsetValid.ip() && common.validInfo(valid.port($("#network-httpport").val())) && Network.ipsetValid.pppoe(); /*&& main.setting.ipSetting.ipsetValid.upnp()*/
		},
		pppoe: function() {
			if ($(".pppoe-radio-setting-selected").val() == 1) {
				return common.validInfo(valid.pppoeUsername($("#content-pppoe-username").val())) && common.validInfo(valid.pppoePassword($("#content-pppoe-password").val()));
			} else {
				return true;
			}
		},
		ip: function() {
			var a;
			if ($(".ip-radio-setting-selected").val() == 0) {
				a = common.validInfo(valid.ip($("#content-static-ip-ip_address").val())) && common.validInfo(valid.mask($("#content-static-ip-sub_netmask").val())) && common.validInfo(valid.gw($("#content-static-ip-default_gateway").val()));
				var dns1 = $("#content-static-ip_pds").val(),
					dns2 = $("#content-static-ip_sds").val();

				return a && common.validInfo(valid.dns(dns1)) && common.validInfo(valid.dns(dns2));
			} else {
				return common.validInfo(valid.ip($("#network_fallbackip").val()));
			}
		}
	},
	
	pppoeStatus: function(status) {
		if (status == "Disconnected") {
			$("#network-pppoestate").text(lang.state.disconnect);
		} else if (status == "Connecting") {
			$("#network-pppoestate").text(lang.state.connecting);
		} else if (status == "Connected") {
			$("#network-pppoestate").text(lang.state.connected);
		}
	}
};

//Network.init();


//})