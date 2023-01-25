//$(document).ready(function(){

	var Notification = {

		smtpShowLoadingInterval:null,

		MODULE:{
			getNotificaInfo: function(options) {
				var _options = $.extend({preinit:false},options);	
				var args = {
					url: '/smtp_and_ftp_load.fcgi',
					success: function(json) {
						DATA.Notification = json;
						if (!_options.preinit) {
							Notification.VIEW.Init(DATA.Notification);
						}		
					},
					error: function(xhr) {
					}
				}
				common.ajax.init(args);
			},			
		},


		VIEW:{
			Init:function(json){

				$("#notification-ftp-server").val(Base64.decode(json.ftp_server));
				$("#notification-ftp-port").val(Base64.decode(json.ftp_port));
				$("#notification-ftp-username").val(Base64.decode(json.ftp_user));
				$("#notification-ftp-passwd").val(Base64.decode(json.ftp_password));
				$("#notification-ftp-path").val(Base64.decode(json.ftp_path));
				if (json.ftp_mode == 1) {
					$("#notification-ftp-pasive_mode").attr("checked", true);
					$(".checkbox-notification-ftp-pasive_mode").addClass("checkbox-checked");
				} else {
					$("#notification-ftp-pasive_mode").attr("checked", false);
					$(".checkbox-notification-ftp-pasive_mode").removeClass("checkbox-checked");
				}
				if (json.ftp_is_enable == 1) { 
					$("#notification-model-ftp").attr("checked", true);
					$(".checkbox-notification-model-ftp").addClass("checkbox-checked");
					$("#notification-cell-ftp").show();
				} else {
					$("#notification-model-ftp").attr("checked", false);
					$(".checkbox-notification-model-ftp").removeClass("checkbox-checked");
					$("#notification-cell-ftp").hide();
				}

				var a = Base64.decode(json.smtp_to);

				$("#notification-email-recipient_addr2").val("");
				$("#notification-email-recipient_addr3").val("");
				$("#notification-email-recipient_addr4").val("");
				var reAddr = a.split(';');
				$("#notification-email-recipient_addr1").val(reAddr[0]);
				//If has '',show the add_ele
				if ($.inArray('', reAddr) == -1) {
					$("#ftp-add_recipient").hide();
				} else {
					$("#ftp-add_recipient").show();
				}
				//console.log(reAddr);
				for (var i = 0; i < reAddr.length-1; i++) {
					if (reAddr[i+1]) { //Not null or ''
						//console.log(reAddr[i+1]);
						$('.notification-email-extra_addr:eq(' + i + ') input').val(reAddr[i+1]);
						$('.notification-email-extra_addr:eq(' + i + ')').show();
					} else {
						$('.notification-email-extra_addr:eq(' + i + ')').hide();
					}
				}			
				$("#notification-email-sender_addr").val(Base64.decode(json.smtp_auth_user));
				$("#notification-email-passwd").val(Base64.decode(json.smtp_auth_pass));
				$("#notification-email-sslencry").val(json.smtp_encryption).change();
				$("#notification-email-interval").val(json.smtp_send_time).change();
					
				var b = Base64.decode(json.smtp_mailhub);
				$("#notification-email-smtp_server").val(b.split(":")[0]);
				$("#notification-email-smtp_port").val(b.split(":")[1]);
					
				if (json.smtp_is_enable == 1) {
					$("#notification-model-email").attr("checked", true);
					$(".checkbox-notification-model-email").addClass("checkbox-checked");
					$("#notification-cell-email").show();
				} else {
					$("#notification-model-email").attr("checked", false);
					$(".checkbox-notification-model-email").removeClass("checkbox-checked");
					$("#notification-cell-email").hide();
				}
			}
		},


		init: function(){		
			conf.confSmtpDisplay(conf.ProductType);
			conf.confftpDisplay(conf.ProductType);
			Notification.bind();
			Notification.VIEW.Init(DATA.Notification);
			Notification.MODULE.getNotificaInfo();
		},
		bind: function(){

			/*ftp*/
			$("#notification-model-ftp").change(function(){
				$("#notification-cell-ftp").toggle();
			});

			/*email*/
			$("#notification-model-email").change(function(){
				$("#notification-cell-email").toggle();
			});

			/*Add recipient && delete*/
			$("#ftp-add_recipient").click(function(){
				$(".notification-email-extra_addr:hidden:first").show();
				$(".notification-email-extra_addr:hidden").length == 0 ? $(this).hide() : null;
				return false;
			});

			//Delete recipient
			$(".ftp-del_recipient").click(function(){
				$("#ftp-add_recipient").show();
				var reAddr = [];
				var extrAddrNum = 3 - $('.notification-email-extra_addr:hidden').length;
				for (var i = 0; i < extrAddrNum; i++) {
					reAddr.push($('.notification-email-extra_addr:eq('+i+') input').val());
				}
				//console.log(reAddr);
				var p = parseInt($(this).parent().attr('id').split('-')[2]);
				reAddr.splice(p-2,1);
				//console.log(reAddr);
				$('.notification-email-extra_addr').hide();
				$('.notification-email-extra_addr input').val("");
				for (var i = 0; i < reAddr.length; i++) {
					$('.notification-email-extra_addr:eq(' + i + ') input').val(reAddr[i]);
					$('.notification-email-extra_addr:eq(' + i + ')').show();
				}
			});
			$("#notification-ftp-test").click(function() {
				Notification.valid.validFtp() == true ? Notification.testFtp() : null;
			});
			$("#notification-email-test").click(function() {
				Notification.valid.validSmtp() == true ? Notification.testEmail() : null;
			});

			$("#notification-email-sslencry").change(function(){
				if(1 == $("#notification-email-sslencry").val())
				{
					$("#notification-email-smtp_port").val(465);
				}
				else if(2 == $("#notification-email-sslencry").val())
				{
					$("#notification-email-smtp_port").val(587);
				}
			});

			$("#notification-save").click(function(){
				if(!$("#notification-model-ftp").attr("checked") && !$("#notification-model-email").attr("checked"))
				{
					Notification.saveVal();
				}
				else if(!$("#notification-model-ftp").attr("checked") && $("#notification-model-email").attr("checked"))
				{
					//console.log($("#notification-email-recipient_addr1").val() + ";" + $("#notification-email-recipient_addr2").val() + ";" + $("#notification-email-recipient_addr3").val() + ";" + $("#notification-email-recipient_addr4").val());
					Notification.valid.validSmtp()? Notification.saveVal():null;
				}
				else if($("#notification-model-ftp").attr("checked") && !$("#notification-model-email").attr("checked"))
				{
					Notification.valid.validFtp()? Notification.saveVal():null;
				}
				else if($("#notification-model-ftp").attr("checked") && $("#notification-model-email").attr("checked"))
				{
					Notification.valid.validFtp() && Notification.valid.validSmtp()? Notification.saveVal():null;
				}

			});
		},

		saveVal: function() {
			plug.button.disable($("#notification-save"));
			var data = {
				"smtp_is_enable": 0,
				// "smtp_from": Base64.encode($("#advance-smtp-server-sender").val()),
				"smtp_to": Base64.encode($("#notification-email-recipient_addr1").val() + ";" + $("#notification-email-recipient_addr2").val() + ";" + $("#notification-email-recipient_addr3").val() + ";" + $("#notification-email-recipient_addr4").val()),
				"smtp_mailhub": Base64.encode($("#notification-email-smtp_server").val() + ":" + $("#notification-email-smtp_port").val()),
				"smtp_auth_user": Base64.encode($("#notification-email-sender_addr").val()),
				"smtp_auth_pass": Base64.encode($("#notification-email-passwd").val()),
				"smtp_encryption": $("#notification-email-sslencry").val(),
				"smtp_send_time": $("#notification-email-interval").val(),
				"ftp_is_enable": 0,
				"ftp_server": Base64.encode($("#notification-ftp-server").val()),
				"ftp_port": Base64.encode($("#notification-ftp-port").val()),
				"ftp_user": Base64.encode($("#notification-ftp-username").val()),
				"ftp_password": Base64.encode($("#notification-ftp-passwd").val()),
				"ftp_path": Base64.encode($("#notification-ftp-path").val()),
				"ftp_mode": Base64.encode("0")
			};
			if ($("#notification-model-ftp").attr("checked")) {
				data.ftp_is_enable = 1
			}
			if ($("#notification-model-email").attr("checked")) {
				data.smtp_is_enable = 1
			}
			if ($("#notification-ftp-pasive_mode").attr("checked")) {
				data.ftp_mode = Base64.encode("1");
			}
			
			var args = {
				url: '/smtp_and_ftp_save.fcgi',
				data: data,
				success: function(json) {
					Notification.responseError(json,data);
					plug.button.enable($("#notification-save"));				
				},
				error: function(xhr) {
					plug.button.enable($("#notification-save"));
				}
			}
			common.setAjax.init(args);		
		},

		testFtp: function() {
				
			plug.button.disable($("#notification-ftp-test"));
			plug.button.disable($("#notification-email-test"));
			plug.button.disable($("#notification-save"));
			Notification.showLoadingStart($("#ftp-test-loadingshow"), lang.state.testing);

			var args = {
					url: '/ftp_test.fcgi'/*'/ftp_save.fcgi'*/,
					data: {
						"ftp_is_enable": 1,
						"ftp_server": Base64.encode($("#notification-ftp-server").val()),
						"ftp_port": Base64.encode($("#notification-ftp-port").val()),
						"ftp_user": Base64.encode($("#notification-ftp-username").val()),
						"ftp_password": Base64.encode($("#notification-ftp-passwd").val()),
						"ftp_path": Base64.encode($("#notification-ftp-path").val()),
						"ftp_mode": Base64.encode("0")
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.button.enable($("#notification-ftp-test"));
							plug.button.enable($("#notification-email-test"));
							plug.button.enable($("#notification-save"));
							Notification.showLoadingEnd($("#ftp-test-loadingshow"));

							plug.window.alert({
								"info": lang.ajax.ftp.testSuccess
							});
						} else {
							plug.button.enable($("#notification-ftp-test"));
							plug.button.enable($("#notification-email-test"));
							plug.button.enable($("#notification-save"));
							Notification.showLoadingEnd($("#ftp-test-loadingshow"));
							Notification.responseError(json);

							/*plug.window.alert({
								"info": lang.ajax.ftp.testFailed
							});*/
							return false;
						}
					},
					error: function(xhr) {
						plug.button.enable($("#notification-ftp-test"));
						plug.button.enable($("#notification-email-test"));
						plug.button.enable($("#notification-save"));
						Notification.showLoadingEnd($("#smtp-test-loadingshow"));
						plug.window.alert({
							"info": lang.ajax.ftp.testFailed
						});
						return false;
					}
			};			
			if ($("#notification-ftp-pasive_mode").attr("checked")) {
				args.data.ftp_mode = Base64.encode("1");
			}			
			common.setAjax.init(args);			
		},
		testEmail: function() {
			plug.button.disable($("#notification-ftp-test"));
			plug.button.disable($("#notification-email-test"));
			plug.button.disable($("#notification-save"));
			Notification.showLoadingStart($("#email-test-loadingshow"), lang.state.testing);
			var args = {
				url: '/smtp_test.fcgi',
				data: {
					"smtp_is_enable": 1,
					"smtp_to": Base64.encode($("#notification-email-recipient_addr1").val() + ";" + $("#notification-email-recipient_addr2").val() + ";" + $("#notification-email-recipient_addr3").val() + ";" + $("#notification-email-recipient_addr4").val()),
					"smtp_mailhub": Base64.encode($("#notification-email-smtp_server").val() + ":" + $("#notification-email-smtp_port").val()),
					"smtp_auth_user": Base64.encode($("#notification-email-sender_addr").val()),
					"smtp_auth_pass": Base64.encode($("#notification-email-passwd").val()),
					"smtp_encryption": $("#notification-email-sslencry").val(),
					"smtp_send_time": $("#notification-email-interval").val()
				},
				success: function(json) {
					if (json.errorCode == 0) {
						plug.button.enable($("#notification-ftp-test"));
						plug.button.enable($("#notification-email-test"));
						plug.button.enable($("#notification-save"));
						Notification.showLoadingEnd($("#email-test-loadingshow"));
						plug.window.alert({
							"info": lang.ajax.smtp.testSuccess
						});

					} else {
						plug.button.enable($("#notification-ftp-test"));
						plug.button.enable($("#notification-email-test"));
						plug.button.enable($("#notification-save"));
						Notification.showLoadingEnd($("#email-test-loadingshow"));
						Notification.responseError(json);
						/*plug.window.alert({
							"info": lang.ajax.smtp.testFailed
						});*/

					}
				},
				error: function(xhr) {
						plug.button.enable($("#notification-ftp-test"));
						plug.button.enable($("#notification-email-test"));
						plug.button.enable($("#notification-save"));
						Notification.showLoadingEnd($("#email-test-loadingshow"));
						plug.window.alert({
							"info": lang.ajax.smtp.testFailed
						});
						return false;
				}
			}
			common.setAjax.init(args);
		},
		showLoadingStart: function(holder, text) {
			holder.text(text);
			Notification.smtpShowLoadingInterval = setInterval(function() {
				holder.text(holder.text() + ".");
				holder.text() == text + "......" ? holder.text(text) : null;
			}, 500)
		},
		showLoadingEnd: function(holder, text) {
			var text = text || "";
			holder.text(text);
			Notification.smtpShowLoadingInterval = clearInterval(Notification.smtpShowLoadingInterval);
		},
		readResult: function(result) {
			var code = Base64.decode(result);
			if (code == "0000") {
				plug.window.alert({
					"info": lang.ajax.smtp.oooo
				})
			} else if (code == "0001") {
				plug.window.alert({
					"info": lang.ajax.smtp.ooox
				})
			} else if (code == "0011") {
				plug.window.alert({
					"info": lang.ajax.smtp.ooxx
				})
			} else if (code == "0111") {
				plug.window.alert({
					"info": lang.ajax.smtp.oxxx
				})
			} else if (code == "1111") {
				plug.window.alert({
					"info": lang.ajax.smtp.xxxx
				})
			} else if (code == "1110") {
				plug.window.alert({
					"info": lang.ajax.smtp.xxxo
				})
			} else if (code == "1100") {
				plug.window.alert({
					"info": lang.ajax.smtp.xxoo
				})
			} else if (code == "1000") {
				plug.window.alert({
					"info": lang.ajax.smtp.xooo
				})
			} else if (code == "0110") {
				plug.window.alert({
					"info": lang.ajax.smtp.oxxo
				})
			} else if (code == "0010") {
				plug.window.alert({
					"info": lang.ajax.smtp.ooxo
				})
			} else if (code == "0100") {
				plug.window.alert({
					"info": lang.ajax.smtp.oxoo
				})
			} else if (code == "0101") {
				plug.window.alert({
					"info": lang.ajax.smtp.oxox
				})
			} else if (code == "1010") {
				plug.window.alert({
					"info": lang.ajax.smtp.xoxo
				})
			} else if (code == "1001") {
				plug.window.alert({
					"info": lang.ajax.smtp.xoox
				})
			} else if (code == "1101") {
				plug.window.alert({
					"info": lang.ajax.smtp.xxox
				})
			} else if (code == "1011") {
				plug.window.alert({
					"info": lang.ajax.smtp.xoxx
				})
			}
		},
		responseError: function(json, data) {
			if (json.errorCode == 0) {
				if (json.result) {
					Notification.readResult(json.result);
				} else {
					if (data) {
						$.extend(DATA.Notification, data);
					}		
					plug.window.alert({
						"info": lang.ajax.notice.setSuccess
					})
				}
			} else if (json.errorCode == 1300) {
				plug.window.alert({
					"info": lang.ajax.ftp.setFailed
				});
			} else if (json.errorCode == 1259) {
				plug.window.alert({
					"info": lang.ajax.smtp.connectFailed
				});
			} else if (json.errorCode == 1261) {
				plug.window.alert({
					"info": lang.ajax.smtp.xxxx
				});
			} else if (json.errorCode == 1260) {
				plug.window.alert({
					"info": lang.ajax.smtp.pwderror
				});
			} else if (json.errorCode == 1262) {
				plug.window.alert({
					"info": lang.ajax.smtp.sendererror
				});
			} else if (json.errorCode == 1275) {
				plug.window.alert({
					"info": lang.ajax.smtp.setFailed
				});
			} else if (json.errorCode == 1285) {
				plug.window.alert({
					"info": lang.ajax.ftp.disconnect
				});
			} else if (json.errorCode == 1286) {
				plug.window.alert({
					"info": lang.ajax.ftp.loginFailed
				});
			} else if (json.errorCode == 1287) {
				plug.window.alert({
					"info": lang.ajax.ftp.upLoadFailed
				});
			} else if (json.errorCode == 1288) {
				plug.window.alert({
					"info": lang.ajax.ftp.modeError
				});
			} else if (json.errorCode == 1289) {
				plug.window.alert({
					"info": lang.ajax.ftp.ftpPowerLow
				});
			} else if (json.errorCode == 1281) {
				plug.window.alert({
					"info": lang.ajax.ftp.missusrname
				});
			} else if (json.errorCode == 1277) {
				plug.window.alert({
					"info": lang.ajax.ftp.servererror
				});
			} else {
				plug.window.alert({
					"info": lang.ajax.smtp.setFailed
				});
			}
		},

		valid: {
			validFtp: function() {
				var flag;
				$("#notification-ftp-username").val() == null ? ($("#notification-ftp-passwd").val() == null ? flag = false : flag = true) : flag = true;
				if (flag == true) {
					var a = common.validInfo((valid.ftp($("#notification-ftp-server").val()))) 
							&& common.validInfo((valid.ftpPort($("#notification-ftp-port").val()))) 
							&& common.validInfo((valid.ftpUsername($("#notification-ftp-username").val()))) 
							&& common.validInfo((valid.ftpPath($("#notification-ftp-path").val())))
							&& common.validInfo((valid.ftpPassword($("#notification-ftp-passwd").val())));
					if(a)
					{
						var temp = $("#notification-ftp-path").val();
						var pathsubstr = temp.split("/");
						for(var i = 0;i<pathsubstr.length;i++)
						{
							var b = common.validInfo(valid.ftpPathsubstr(pathsubstr[i]));
							if(!b) 
							{
								return b;
							}
						}
						if(i == pathsubstr.length)
						{
							return a;
						}
					}
					else
					{
						return a;	
					}	
				} else {
					plug.window.alert({
						"info": lang.valid.ftp.unamenull
					});
				}
			},
			validSmtp: function() {

				var smtpRemail1 = $("#notification-email-recipient_addr1").val(),
					smtpRemail2 = $("#notification-email-recipient_addr2").val(),
					smtpRemail3 = $("#notification-email-recipient_addr3").val(),
					smtpRemail4 = $("#notification-email-recipient_addr4").val();

				//All is empty
				if (smtpRemail1 + smtpRemail2 + smtpRemail3 + smtpRemail4 == "") {
					plug.window.alert({
						"info": lang.valid.smtpRemailAllEmpty
					});
					return false;
				} else {
					
					var a = false;
					var	ip = false;
					var ippattern = /^[0-9.]+$/;
					ippattern.test($("#notification-email-smtp_server").val()) == false ? ip = common.validInfo(valid.domain($("#notification-email-smtp_server").val())) : ip = common.validInfo(valid.ip($("#notification-email-smtp_server").val()));
					if (ip == true) {
						a = common.validInfo(valid.smtpPort($("#notification-email-smtp_port").val())) 
							&& common.validInfo(valid.email(smtpRemail1, {
								"holder": "smtpRemail1",
								"lengthNull": "enable"
							})) && common.validInfo(valid.email(smtpRemail2, {
									"holder": "smtpRemail2",
									"lengthNull": "disable"
							})) && common.validInfo(valid.email(smtpRemail3, {
									"holder": "smtpRemail3",
									"lengthNull": "disable"
							})) && common.validInfo(valid.email(smtpRemail4, {
									"holder": "smtpRemail4",
									"lengthNull": "disable"
							})) &&	common.validInfo(valid.email($("#notification-email-sender_addr").val(), {
									"holder": "smtpSender",
									"lengthNull": "enable"
							})) && common.validInfo(valid.smtpPwd($("#notification-email-passwd").val())) 
					} else {
						a = null;
					} 
					a = a && ip;
					return a;
				}
			}

		}


	};
	//common.langChange("notification");
	//Notification.init();
	
//})