var Cloud = {
	cloudConnectTimeout: null,
	MODULE:{
		getCloudInfo: function(){
			var args = {
				url: '/get_cloud.fcgi',
				timeout: 30000,
				success: function(json) {
					DATA.CLOUD = json;
					if (DATA.CLOUD.status == 1 && DATA.CLOUD.binded == 1) {
						Cloud.cloudConnectTimeout = clearTimeout(Cloud.cloudConnectTimeout);
						Cloud.cloudConnectTimeout = setTimeout(function() {
							Cloud.VIEW.init();
							Cloud.MODULE.getCloudInfo();
						}, 1000);
					} else {
						Cloud.VIEW.init();
					}
				},
				error: function(xhr) {
					Cloud.VIEW.getError();
				}
			};
			common.ajax.init(args);
		},

		//刷新cloud
		refreshCloud: function() {	
			var args = {
				url: '/cloud.fcgi',
				timeout: 30000,
				data: {
					"command": "refresh"
				},
				beforeSend: function(){
					Cloud.VIEW.refresh("beforeSend");
				},
				success: function(json) {
					DATA.CLOUD = json;
					if (DATA.CLOUD.status == 1 && DATA.CLOUD.binded == 1) {
						Cloud.VIEW.init();
						Cloud.MODULE.getCloudInfo();
					} else {
						Cloud.VIEW.refresh("success");
					}
				},
				error: function(xhr) {
					Cloud.VIEW.refresh("error");
				}
			};
			common.setAjax.init(args);
		},
		//解绑cloud
		unbindCloud: function(mode) {		
			var args = {
				url: '/cloud.fcgi',
				data: {
					"command": "unbind"
				},
				timeout: 30000,
				beforeSend: function(){
					Cloud.VIEW.unbind("beforeSend");
				},
				success: function(json) {
					DATA.CLOUD = json;
					Cloud.VIEW.unbind("success");
				},
				error: function(xhr) {
					Cloud.VIEW.unbind("error");
				}
			};
			common.setAjax.init(args);
		},

		setCloud: function(data){
			var args = {
				url: '/cloud.fcgi',
				timeout: 30000,
				data: data,
				beforeSend: function(){
					Cloud.VIEW.SET("beforeSend");
				},
				success: function(json) {
					DATA.CLOUD = json;
					Cloud.VIEW.SET("success");
				},
				error: function(xhr) {
					Cloud.VIEW.SET("error");	
				}
			}
			common.setAjax.init(args);
		},
		//设置cloud，用于regusr注册
		registerCloud: function(data) {
			plug.button.disable($("#cloud-new-register-signup"));
			var args = {
				url: '/cloud.fcgi',
				timeout: 30000,
				data: data,
				beforeSend: function(){
					Cloud.VIEW.REGISTER("beforeSend");
				},
				success: function(json) {
					DATA.CLOUD = json;
					Cloud.VIEW.REGISTER("success");
				},
				error: function(xhr) {
					Cloud.VIEW.REGISTER("error");
				}
			}
			common.setAjax.init(args);
		}
	},

	VIEW: {
		init: function(){
			$("#cloud-account-registered-name").text(DATA.CLOUD.username);
			$("#cloud-login-cameraname").val(DATA.CLOUD.cameraname);
			Cloud.VIEW.statusShow(DATA.CLOUD.status, DATA.CLOUD.binded);
		},

		getError: function(){
			Cloud.VIEW.statusShow(3, 1);
		},

		statusShow: function(status, binded) {
			$("#cloud-refresh").hide();
			if (status == 3 && binded == 1) //device cannot connect to cloud server
			{ 
				$(".cloud-part").hide();
				$("#cloud-error-tips").show();
				var a = "";
				a += "<p>" + lang.html.cloud.disconnect1 + "</p>";
				a += "<p>" + lang.html.cloud.disconnect2 + "</p>";
				$("#cloud-error-tips").html(a);
				$(".cloud-button").hide();
				$("#cloud-refresh").show();
			} 
			else if (status == 4 && binded == 1) //code or account has been changed,login failed
			{ 
				$(".cloud-part").hide();
				$("#cloud-error-tips").show();
				var a = "";
				a += "<p>" + lang.html.cloud.loginfail1 + "</p>",
				a += "<p>" + lang.html.cloud.loginfail2 + "</p>";
				$("#cloud-error-tips").html(a);
				$(".cloud-button").hide();
				$("#cloud-rebind").show();
			} 
			else if (status == 1 && binded ==1) //connecting to server
			{ 
				$("#cloud-registered-status").html(lang.html.cloud.connecting);
				$(".cloud-part").hide();
				$("#cloud-registered-part").show();
				$(".cloud-button").hide();
				$("#cloud-refresh").show();
			} 
			else if (status == 2 && binded == 1) //connected to server
			{ 
				$(".cloud-part").hide();
				$("#cloud-registered-status").html(lang.cloudSetting['registered-tips']);
				$("#cloud-registered-part").show();
				$("#cloud-error-tips").hide();
				$(".cloud-button").hide();
				$("#cloud-deregister").show();
				plug.button.enable($("#cloud-deregister"));
			} 
			else // unbound
			{ 
				$(".cloud-part").hide();
				$("#cloud-login-part").show();
				$(".cloud-button").hide();
				$("#cloud-register").show();
			}
		},

		refresh: function(status){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($("#cloud-refresh"));
					break;
				case "success":
					plug.button.enable($("#cloud-refresh"));
					Cloud.VIEW.statusShow(DATA.CLOUD.status, DATA.CLOUD.binded);
					break;
				case "error":
					Cloud.VIEW.statusShow(3, 1);
					plug.button.enable($("#cloud-refresh"));
					break;
			}
		},

		unbind: function(status){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($("#cloud-deregister"));
					break;
				case "success":
					if (DATA.CLOUD.errorCode == 0) {
						Cloud.VIEW.statusShow(0);
					} else if (DATA.CLOUD.errorCode == 1080) {
						plug.window.alert({
							"info": lang.ajax.cameraBind.networdbreak
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.cameraBind.unbindFailed
						});
					}
					plug.button.enable($("#cloud-deregister"));
					break;
				case "error":
					plug.button.enable($("#cloud-deregister"));
					break;
			}
		},

		SET: function(status){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($("#cloud-register"));
					break;
				case "success":
					plug.button.enable($("#cloud-register"));
					if (DATA.CLOUD.errorCode == 0) 
					{
						plug.window.alert({
							"info": lang.ajax.cameraBind.bindSuccess
						});
						$("#cloud-account-registered-name").text($("#cloud-login-name").val());
						Cloud.VIEW.statusShow(2, 1);
					} 
					else if (DATA.CLOUD.errorCode == 1080) 
					{
						plug.window.alert({
							"info": lang.ajax.cameraBind.networdbreak
						});
					} 
					else if (DATA.CLOUD.errorCode == 1081) 
					{
						plug.window.alert({
							"info": lang.ajax.cameraBind.pwderror
						});
					} 
					else if (DATA.CLOUD.errorCode == 1082) 
					{
						plug.window.alert({
							"info": lang.ajax.cameraBind.usrerror
						});
					} 
					else if(DATA.CLOUD.errorCode == 1083)
					{
						plug.window.alert({
							info: lang.ajax.cameraBind.binded
						});
					}
					else if(DATA.CLOUD.errorCode == 1088)
					{
						plug.window.alert({
							info: lang.ajax.cameraBind.unbinded
						});
					}
					else if(DATA.CLOUD.errorCode == 1084)
					{
						plug.window.alert({
							info: lang.ajax.cameraBind.accountexist
						});
					}
					else if(DATA.CLOUD.errorCode == 1085)
					{
						plug.window.alert({
							info: lang.ajax.cameraBind.loginnameexist
						});
					}					
					else if (DATA.CLOUD.errorCode == 1086) 
					{
						plug.window.alert({
							"info": lang.ajax.cameraBind.camernameinvalid
						});
					} 
					else if(DATA.CLOUD.errorCode == 1087)
					{
						plug.window.alert({
							info: lang.ajax.cameraBind.databaseerror
						});
					}	
					else if(DATA.CLOUD.errorCode == 1089)
					{
						plug.window.alert({
							info: lang.ajax.cameraBind.requesttimeout
						});
					}									
					else {
						plug.window.alert({
							"info": lang.ajax.cameraBind.bindFailed
						});
					}
					break;
				case "error":
					plug.button.enable($("#cloud-register"));
					break;
			}			
		},

		REGISTER: function(status){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($("#cloud-new-register-signup"));
					break;
				case "success":
					plug.button.enable($("#cloud-new-register-signup"));
					if (DATA.CLOUD.errorCode == 0) 
					{
							plug.window.alert({
								"info": lang.ajax.cloudReg.success
							});
							$("#cloud-login-name").val($("#cloud-register-email").val());
							$("#cloud-login-pwd").val($("#cloud-register-pwd").val());
							$("#cloud-register-email").val("");
							$("#cloud-register-username").val("");
							$("#cloud-register-pwd").val("");
							$("#cloud-register-confirm-pwd").val("");
							$("#cloud-register-part").hide();
							$("#cloud-register-part-bottom").hide();
							$("#cloud-login-part").show();
							$("#cloud-normal-bottom").show();
					} 
					else if (DATA.CLOUD.errorCode == 1084) 
					{
						plug.window.alert({
							"info": lang.ajax.cloudReg.emailUsed
						});
					} 
					else if (DATA.CLOUD.errorCode == 1085) 
					{
						plug.window.alert({
							"info": lang.ajax.cloudReg.usernameUsed
						});
					} 
					else 
					{
						plug.window.alert({
							"info": lang.ajax.cloudReg.failed
						});
					}
				case "error":
					plug.button.enable($("#cloud-register"));
					break;
			}	
		}
	},

	init: function(){
		Cloud.bind();
		Cloud.VIEW.init();
		Cloud.MODULE.getCloudInfo();
	},

	bind: function(){
		$("#cloud-deregister").click(function(){
			Cloud.MODULE.unbindCloud();
		});

		$("#cloud-register").click(function(){
			var data = {
				"command": "bind",
				"username": $("#cloud-login-name").val(),
				"password": $("#cloud-login-pwd").val(),
				"cameraname": $("#cloud-login-cameraname").val()
			};
			var a =  Cloud.cloudValid.cameranameValid() && Cloud.cloudValid.emailValid()
			a == true ? Cloud.MODULE.setCloud(data) : null;	
		});

		$("#cloud-new-register").click(function(){
			$("#cloud-register-part").show();
			$("#cloud-login-part").hide();
			$("#cloud-normal-bottom").hide();
			$("#cloud-register-part-bottom").show();
		});

		$("#cloud-new-register-back").click(function(event) {
			$("#cloud-register-part").hide();
			$("#cloud-login-part").show();
			$("#cloud-normal-bottom").show();
			$("#cloud-register-part-bottom").hide();
		});

		$("#cloud-new-register-signup").click(function() {
			var data = {
				"command": "regusr",
				"username": $("#cloud-register-username").val(),
				"password": $("#cloud-register-pwd").val(),
				"account": $("#cloud-register-email").val()	
			};
			Cloud.cloudValid.regValid() == true ? Cloud.MODULE.registerCloud(data) : null;
		});

		$("#cloud-refresh").click(function() {
			Cloud.MODULE.refreshCloud();
		});

		$("#cloud-login-name").bind({
			focus: function(){
				if($(this).val() == "E-mail/Username")
				{
					$(this).val("");
				}
			},
			blur: function(){
				if($(this).val() == "")
				{
					$(this).val("E-mail/Username");
				}					
			}
		});				
	},

	cloudValid:{
		cameranameValid: function() {
			var a = common.validInfo((valid.cameraname($("#cloud-login-cameraname").val())));
			return a;
		},
		emailValid:function(){
			var email = $("#cloud-login-name").val();
			if (email == "E-mail/Username") {
				plug.window.alert({
					info: lang.valid.cloudUsername.empty
				});
				return false;
			}
			else if (email.length < 1 || email.length > 32) 
			{
				plug.window.alert({
					info: lang.valid.cloudUsername.limit
				});
				return false;
			} 
			else if (!valid.email(email).pass && !valid.cloudUsername(email).pass) 
			{
				plug.window.alert({
					info: lang.valid.cloudUsername.invalid
				});
				return false;
			}
			else
			{
				return true;
			}
		},
		regValid: function() {
			var b = false;

			var email = $("#cloud-register-email").val();
			if  (email.length < 1 || email.length > 32) 
			{
				plug.window.alert({
					info: lang.valid.email.limit
				});
				return;
			} 
			else if (!valid.email(email).pass)
			{
				plug.window.alert({
					info: lang.valid.email.invalid
				});
				return;
			}

			var a = common.validInfo((valid.cloudUsername($("#cloud-register-username").val()))) 
					&& common.validInfo((valid.cloudPassword($("#cloud-register-pwd").val())));
			if (a == true) {
				if ($("#cloud-register-pwd").val() != $("#cloud-register-confirm-pwd").val()) 
				{
					plug.window.alert({
						"info": lang.valid.password.confirm
					});
					b = false;
				} 
				else if (!$("#cloud-register-accept").attr("checked")) 
				{
					plug.window.alert({
						"info": lang.valid.password.accept
					});
					b = false;
				} 
				else 
				{
					b = true;
				}
			}
			return a && b;
		}
	}
};

