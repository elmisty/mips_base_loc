$(document).ready(function(){
	var Wextender = {
		extenderInfo: {
			WlanStatus: null,
			ExtEnable: null,
			ExtSameAsHost: null,
			ExtSSID: null,
			ExtMaxCli: null,
			ExtAuth: null,
			ExtEncryp: null,
			ExtWepKeyIndex: null,
			ExtWepKey: null,
			ExtWpaKey: null
		},

		init: function(){
			Wextender.bind();
			Wextender.getExtenderInfo();
		},

		bind: function(){
			$("#wireless_extender-disable").click(function(){
				$("#wireless_extender-enable").removeClass("wirelessex-radio-selected");
				$(this).addClass("wirelessex-radio-selected");

				$(".radio-wireless_extender-enable").removeClass("radio-checked");
				$(".radio-wireless_extender-disable").addClass("radio-checked");

				$("#wireless_extender-patch").hide();
			});
			$("#wireless_extender-enable").click(function(){
				$("#wireless_extender-patch").show();
				$("#wireless_extender-disable").removeClass("wirelessex-radio-selected");

				$(".radio-wireless_extender-disable").removeClass("radio-checked");
				$(".radio-wireless_extender-enable").addClass("radio-checked");

				$(this).addClass("wirelessex-radio-selected");
			});

			/*wireless extender other name*/
			$("#extend_ssid-radio-other").click(function(){
				$("#extend_ssid-text-other").removeAttr("disabled").css("background-color","rgb(250, 250, 250)");	
				$("#extend_ssid-radio-sameashost").removeClass("wirelessex-host-selected");

				$(".radio-extend_ssid-radio-sameashost").removeClass("radio-checked");
				$(".radio-extend_ssid-radio-other").addClass("radio-checked");


				$(this).addClass("wirelessex-host-selected");
				$("#wireless_extender-otherssid-part").show();
			});
			$("#extend_ssid-radio-sameashost").click(function(){
				$("#wireless_extender-otherssid-part").hide();
				$("#extend_ssid-text-other").attr("disabled","disabled").css("background-color","rgb(238, 238, 238)");	
				$("#extend_ssid-radio-other").removeClass("wirelessex-host-selected");

				$(".radio-extend_ssid-radio-sameashost").addClass("radio-checked");
				$(".radio-extend_ssid-radio-other").removeClass("radio-checked");

				$(this).addClass("wirelessex-host-selected");
			});


			$("#wireless_extender-auth select").change(function(){
				$("option:selected",this).click();
			});

			$("#wireless_extender-auth_none").click(function(){
				$(".wireless_extender-wep").hide();
				$(".wireless_extender-wpa").hide();
			});

			$("#wireless_extender-auth_wep").click(function(){
				$(".wireless_extender-wpa").hide();
				$(".wireless_extender-wep").show();
			});

			$("#wireless_extender-auth_wpa ,#wireless_extender-auth_wpa2,#wireless_extender-auth_wpa12").click(function(){
				$(".wireless_extender-wep").hide();
				$(".wireless_extender-wpa").show();
			});

			$("#wireless_extender-auth").change(function(){
				var auth = $(this).val();
				if(auth == "None"){
					$(".wireless_extender-wep").hide();
					$(".wireless_extender-wpa").hide();
				}else if(auth == "WEP"){
					$(".wireless_extender-wpa").hide();
					$(".wireless_extender-wep").show();
				}else{
					$(".wireless_extender-wep").hide();
					$(".wireless_extender-wpa").show();
				}
			});

			$("#wireless_extender-save").click(function() {
				if ($(".wirelessex-radio-selected").val() == 1) {
					if ($(".wirelessex-host-selected").val() == 0) {
						Wextender.Valid.exValid() == true ? Wextender.setWirelessExtender() : null;
					} else {
						Wextender.setWirelessExtender();
					}
				} else {
					Wextender.setWirelessExtender();
				}
			});

			$(".showpwd").click(function(){
				if( $(this).attr("checked")){
					var key = $(this).prevAll(".input-pwd:first").val();
					$(this).prevAll(".input-pwd:first").hide();
					$(this).prevAll(".pwd-text:first").val(key).show();
				}else{
					$(this).prevAll(".input-pwd:first").show();
					$(this).prevAll(".pwd-text:first").hide();
				}			
			});

			$("#wireless_extender-wpa-encp").change(function(){
				$("option:selected",this).click();
			});

			$("#wireless_extender-wep-index").change(function(){
				$("option:selected",this).click();
			});

		},

		start: function(){
			if( Wextender.extenderInfo.ExtEnable == 1 ){
				$("#wireless_extender-enable").click();
				Wextender.extendStatus(Wextender.extenderInfo.WlanStatus, Wextender.extenderInfo.ExtSameAsHost, Wextender.extenderInfo.ExtSSID);
				
				$("#extend_ssid-text-other").val(Base64.decode(Wextender.extenderInfo.ExtSSID));
				if(Wextender.extenderInfo.ExtAut != "WEP"){
					$("#wireless_extender-auth").val(Wextender.extenderInfo.ExtAuth).change();
					$("#wireless_extender-wpa-encp").val(Wextender.extenderInfo.ExtEncryp).change();
					$("#wireless_extender-wpakey").val(Base64.decode(Wextender.extenderInfo.ExtWpaKey));
				}else{
					$("#wireless_extender-auth").val(Wextender.extenderInfo.ExtAuth).change();
					$("#wireless_extender-wep-index").val(Wextender.extenderInfo.ExtWepKeyIndex).change();
					$("#wireless_extender-wepkey").val(Base64.decode(Wextender.extenderInfo.ExtWepKey));
				}
				$("#extender-maxcli").val(Wextender.extenderInfo.ExtMaxCli).change();

			}else{
				$("#wireless_extender-disable").click();
			}
		},

		getExtenderInfo: function(){
			var args = {
				url: '/wireless_get.fcgi',
				success: function(json) {
					if (json.Enable == 1){
						Wextender.extenderInfo.WlanStatus = json.WlanStatus;
 						Wextender.extenderInfo.ExtEnable = json.ExtEnable;
						Wextender.extenderInfo.ExtSameAsHost = json.ExtSameAsHost;
						Wextender.extenderInfo.ExtSSID = json.ExtSSID;
						Wextender.extenderInfo.ExtMaxCli = json.ExtMaxCli;
						Wextender.extenderInfo.ExtAuth = json.ExtAuth;
						Wextender.extenderInfo.ExtEncryp = json.ExtEncryp;
						Wextender.extenderInfo.ExtWepKeyIndex = json.ExtWepKeyIndex;
						Wextender.extenderInfo.ExtWepKey = json.ExtWepKey;
						Wextender.extenderInfo.ExtWpaKey = json.ExtWpaKey;

						Wextender.start();
					}else{
						$("#wireless_extender-disable").click();
					}				
				},
				error: function(xhr) {
					alert("get error");
				}
			}
			common.ajax.init(args);
		},

		extendStatus: function(WlanStatus, ExtSameAsHost, SSID) {
			if (WlanStatus == "Connected") {
				$("#extender-host-ssid").text(Base64.decode(Wextender.extenderInfo.ExtSSID));
				$("#extend_ssid-radio-sameashost").attr("disabled", false);
				if (ExtSameAsHost == 0) {
					$("#extend_ssid-radio-other").click();
				} else {
					$("#extend_ssid-radio-sameashost").click();
				}
			} else {
				$("#extender-host-ssid").text(lang.state.disconnect);
				$("#extend_ssid-radio-sameashost").attr("disabled", true);
				$("#extend_ssid-radio-other").click();
			}
		},

		setWirelessExtender: function() {
			plug.button.disable($("#wireless_extender-save"));
			var args = {
				url: '/wireless_extender_set.fcgi',
				data: {
					"ExtEnable": $(".wirelessex-radio-selected").val(),
					"ExtSSID": Base64.encode($("#extend_ssid-text-other").val()),
					"ExtMaxCli": $("#extender-maxcli").val(),
					"ExtAuth": $("#wireless_extender-auth").val(),
					"ExtWepKeyIndex": $("#wireless_extender-wep-index").val(),
					"ExtEncryp": $("#wireless_extender-wpa-encp").val(),
					"ExtWepKey": $("#wireless_extender-wepkey").is(":hidden")? Base64.encode($("#wireless_extender-wepkey-decode").val()) : Base64.encode($("#wireless_extender-wepkey").val()),
					"ExtWpaKey": $("#wireless_extender-wpakey").is(":hidden")? Base64.encode($("#wireless_extender-wpakey-decode").val()) : Base64.encode($("#wireless_extender-wpakey").val()),
					"Encryp": $("#wireless_extender-wpa-encp").val(),
					"ExtSameAsHost": $(".wirelessex-host-selected").val()
				},
				success: function(json) {
					plug.button.enable($("#wireless_extender-save"));
					if (json.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.wirelessextender.setSuccess
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.wirelessextender.setFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#wireless_extender-save"));
				}
			}
			if ($(".wirelessex-host-selected").val() == 0) {
				args.ExtSSID = Base64.encode($("#extend_ssid-text-other").val());
			} else {
				args.ExtSSID = Base64.encode($("#extender-host-ssid").text());
			}
			common.setAjax.init(args);
		},

		Valid: {
			exValid: function() {
				var a = Wextender.Valid.exSetting() && Wextender.Valid.exWepkey() && Wextender.Valid.exPSK();
				return a
			},
			exSetting: function() {
				if ($("#extend_ssid-radio-other").attr("checked")) {
					return common.validInfo(valid.ssid($("#extend_ssid-text-other").val()));
				} else {
					return true;
				}
			},
			exWepkey: function() {
				
				if($("#wireless_extender-wepkey").is(":hidden")){
					if ($("#wireless_extender-wepkey:hidden").length == 1) {
						
						return true;
					}
					else
					{
						return common.validInfo(valid.wepkey($("#wireless_extender-wepkey-decode").val()));
					}
				} 
				else {
					return common.validInfo(valid.wepkey($("#wireless_extender-wepkey").val()))
				}
			},
			exPSK: function() {
				if($("#wireless_extender-wpakey").is(":hidden")){
					if ($("#wireless_extender-wpakey:hidden").length == 1) {
						
						return true;
					}
					else{
						return common.validInfo(valid.wpaWpa2Psk($("#wireless_extender-wpakey-decode").val()));
					}
				} 
				else {
					return common.validInfo(valid.wpaWpa2Psk($("#wireless_extender-wpakey").val()))
				}
			}
		}


	};


	Wextender.init();
})
