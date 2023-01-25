var Login = {
	init: function() {
		Login.bind();
		Login.checkbox();
		Login.rmbuser();
	},

	bind: function(){
		$("#login-submit").click(function() {
			Login.request();
		});	

		$("#username").bind({
			focus: function() {
				$(".login-info-username").addClass("login-info-focus");
				$(".login-img-usr").addClass("login-img-usr-focus");
			},

			blur: function() {
				$(".login-info-username").removeClass("login-info-focus");
				$(".login-img-usr").removeClass("login-img-usr-focus");
			}
		});

		$("#password").bind({
			focus: function() {
				$(".login-info-password").addClass("login-info-focus");
				$(".login-img-psw").addClass("login-img-psw-focus");
			},

			blur: function() {
				$(".login-info-password").removeClass("login-info-focus");
				$(".login-img-psw").removeClass("login-img-psw-focus");
			},

			keydown: function(event) {
				if (event.keyCode == "13") {
					Login.request();
				}
			}
		});		

		$("#username").focus().select();
	},

	checkbox: function() {
		plug.checkbox.initial($("body"));
		$("#login-remember-account").siblings(".checkbox").attr("tabindex", 3);
		$("#login-remember-account").siblings(".checkbox").bind({
			keydown: function(event) {
				if (event.keyCode == "32") {
					$('#login-remember-account').click();
				}
				else if (event.keyCode == "13") {
					Login.request();
				}
			}
		});
	},

	rmbuser: function(){
		if($.cookie("RemAccount") == "true")
		{
			$("#login-remember-account").attr("checked", "true");
			$("#username").val($.cookie("Account"));
			$(".checkbox").addClass("checkbox-checked");
			$("#password").focus().select();
		}
	},

	saveaccount: function() {
		var UserName = $("#username").val();
		var PassWord = $("#password").val();
		$.cookie("StreamAccount",UserName);
		var temp = Base64.encode(PassWord);
		$.cookie("StreamPassword",temp);

		if($("#login-remember-account").attr("checked"))
		{
			$.cookie("RemAccount","true",{exires:7});
			$.cookie("Account",UserName,{expires:7});			
		}
		else 
		{
			$.cookie("RemAccount","false",{expires:-1});
			$.cookie("Account",'',{expires:-1});
		}


	},

	request: function() {
		Login.saveaccount();
		var data = {
			"Username": $('#username').attr('value'),
			"Password": Base64.encode($('#password').attr('value')),
			"region": $("#regionselect").val(),
			"frequency": $("#regionselect option:selected").attr("frequency")
		};
		$.ajax({
			url: '/login.fcgi',
			type: 'post',
			dataType: 'text',
			data: data,
			contentType: 'application/x-www-form-urlencoded;charset=utf-8',
			success: function(response) {
				var json = jQuery.parseJSON(response);
				$.cookie("Token",json.token);

				switch (json.errorCode) 
				{
					case 1000:
						plug.window.alert({
							"info": lang.ajax.login.usrnull
						});
						break;
					case 1001:
						plug.window.alert({
							"info":lang.ajax.login.loginerror
						});
						break;
					case 1002:
						plug.window.alert({
							"info":lang.ajax.login.loginerror
						});
						break;
					case 1003:
						plug.window.alert({
							"info":lang.ajax.login.pwdnull
						});
						break;
					case 1012:
						plug.window.alert({
							"info":lang.ajax.login.usrnotexist
						});
						break;
					case 1011:
						plug.window.alert({
							"info":lang.ajax.login.pwderror
						});
						break;
					case 0:
						$.cookie("CameraType",json.model);
						$.cookie("isAdmin",json.isAdmin);
						$.cookie("UserName",$('#username').attr('value'))
						if('admin' == $('#password').attr('value'))
						//if('admin' != $('#password').attr('value'))
						{
							//plug.window.changepss({
								//"info":lang.ajax.login.chgpsstips
							//});
							$.cookie("PasswordIsAdmin", 1);
						}

						if (json.isAdmin) {
							if (location.search.indexOf("?streamPort=") == 0)
							{
								location.href = "/index.html"+location.search;
							}
							else{
								window.location.href = "/index.html";
							}
							
						} else {
							if (location.search.indexOf("?streamPort=") == 0)
							{
								location.href = "/guest.html"+location.search;
							}
							else{
								window.location.href = "/guest.html";
							}	
						}
						break;
					default:
						plug.window.alert({"info":lang.login.loginerror});
				}
			},
			error: function(xhr) {

			}
		});		
	}
};
