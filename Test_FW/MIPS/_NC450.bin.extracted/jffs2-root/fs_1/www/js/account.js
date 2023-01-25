var UserManager = {
	selectedTaskId: null, 

	MODULE:{
		GetUser: function(){	
			var args = {
				url: '/alluser.fcgi',
				beforeSend: function(){
					UserManager.VIEW.GET("beforeSend");
				},
				success: function(json) {
					DATA.USER = json;
					UserManager.VIEW.GET("success");
					
				},
				error: function(xhr) {
					var json = [{
							"name": "seven1",
							"type": "amdin1"
						}, {
							"name": "seven2",
							"type": "admin2"
						}];
					DATA.USER = json;
					UserManager.VIEW.GET("error");		
				}
			};
			common.ajax.init(args);
		},

		AddUser: function(data) {
			var args = {
				url: '/adduser.fcgi',
				data: data,
				beforeSend: function(){
					UserManager.VIEW.ADD("beforeSend");
				},
				success: function(json) {
					
					if (json.errorCode == 0) {
						UserManager.MODULE.GetUser();
						UserManager.VIEW.ADD("success",json.errorCode);					
					} else{
						UserManager.VIEW.ADD("success",json.errorCode);
					} 
				},	
				error: function(xhr) {
					UserManager.VIEW.ADD("error",xhr);
				}
			};
			common.setAjax.init(args);
		},

		DeleteUser: function(data){
			var args = {
				url: '/delmultiuser.fcgi',
				data: data,
				beforeSend: function(){
					UserManager.VIEW.Delete("beforeSend");
				},
				success: function(json) {

					if (json.resultArray[0].errorCode == 1009) {
						UserManager.VIEW.Delete("success",1009);
					} else if (json.resultArray[0].errorCode == 1012) {
						UserManager.VIEW.Delete("success",1012);
					}		
					UserManager.MODULE.GetUser();
				},
				error: function(xhr) {
					UserManager.VIEW.Delete("error",xhr);
				}
			};
			common.setAjax.init(args);
		},

		ChangePwd:function(data){
			var args = {
				url: '/setpass.fcgi',
				data: {
					"Username": $("#account-current_username").text(),
					"OldPassword": Base64.encode($("#account-change_passwd-old").val()),
					"NewPassword": Base64.encode($("#account-change_passwd-new").val())
				},
				beforeSend: function(){
					UserManager.VIEW.ChangePwd("beforeSend");			
				},
				success: function(json) {
					UserManager.VIEW.ChangePwd("success",json.errorCode);
				},
				error: function(xhr) {
					UserManager.VIEW.ChangePwd("error",xhr);		
				}
			};
			common.setAjax.init(args);
		}
	},

	VIEW:{
		GET: function(status){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($("#account-add"));
					plug.button.disable($("#account-change_passwd"));
					plug.button.disable($("#account-delete"));
					break;

				case "success":
					$("#sevenTables-account-usermanage-ctrl-table").remove();
					$("#account-add-username").val("");
					$("#account-add-password").val("");
					$("#account-add-confirm_password").val("");
					UserManager.VIEW.tableInit(DATA.USER);
					$("#account-usermanage-ctrl-table .sevenTables-tbody-datagrid-row").click(function() {
						$("#account-current_username").text($(this).find("td:eq(0) .datagrid-cell-show").text());
					})
					plug.button.enable($("#account-add"));
					plug.button.enable($("#account-change_passwd"));
					plug.button.enable($("#account-delete"));
					break;

				case "error":
					plug.button.enable($("#account-add"));
					plug.button.enable($("#account-change_passwd"));
					plug.button.enable($("#account-delete"));
					break;
				default:
					break;
			}
		},

		ADD: function(status,msg){
			if(status == "beforeSend")
			{
				plug.button.disable($("#account-add-save"));
			}
			else if( status == "success")
			{
				switch(msg)
				{
					case 0:
						plug.button.enable($("#account-add-save"));
						break;
					case 1007:
						plug.window.alert({
							"info": lang.ajax.creatUser.passwordweak
						});
						plug.button.enable($("#account-add-save"));
						break;
					case 1010:
						plug.window.alert({
							"info": lang.ajax.creatUser.notadmin
						});
						plug.button.enable($("#account-add-save"));
						break;
					case 1019:
						plug.window.alert({
							"info": lang.ajax.creatUser.moreaccount
						});
						plug.button.enable($("#account-add-save"));
						break;
					case 1013:
						plug.window.alert({
							"info": lang.ajax.creatUser.accountused
						});
						plug.button.enable($("#account-add-save"));
						break;
					default:
						plug.window.alert({
							"info": lang.ajax.creatUser.failed
						});
						plug.button.enable($("#account-add-save"));
						break;
				}
			}
			else if( status == "error")
			{
				plug.button.enable($("#account-add-save"));
				plug.window.alert({
					"info": msg
				});
			}
		},

		Delete: function(status,msg){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable($("#account-delete"));break;
				case "success":
					plug.button.enable($("#account-delete"));
					if (msg == 1009) {
						plug.window.alert({
							"info": lang.ajax.removeUser.cannotremove
						})
					} else if (msg == 1012) {
						plug.window.alert({
							"info": lang.ajax.removeUser.noexist
						});
					}
					common.validatedSign.changeVal(json.token);
					userManager.selectedTaskId = [];
					$("#sevenTables-account-usermanage-ctrl-table").remove();
					$("#account-cell-change_passwd").hide();
					$("#account-cell-add").hide();

					break;
				case "error":
					plug.button.enable($("#account-delete"));
					plug.window.alert({
						"info": msg
					});
					break;
			}
		},

		ChangePwd: function(status,msg){
			if( status == "beforeSend" ){
				plug.button.disable($("#account-change_passwd-save"));
			}
			else if( status == "success")
			{
				plug.button.enable($("#account-change_passwd-save"));
				if (msg == 0) {
					if ($("#account-current_username").text() == "admin") 
					{
						window.location.href = "/login.html";
					} 
					else 
					{
						plug.window.alert({
							"info": lang.ajax.changeUserPwd.success
						});
					}
				} 
				else if (msg == 1011) 
				{
					plug.window.alert({
						"info": lang.ajax.changeUserPwd.oldpwdwrong
					});
				} 
				else if (msg == 1024) 
				{
					plug.window.alert({
						"info": lang.ajax.changeUserPwd.samepwd
					});
				} 
				else 
				{
					plug.window.alert({
						"info": lang.ajax.changeUserPwd.failed
					})
				}
				$("#account-change_passwd-old").val("");
				$("#account-change_passwd-new").val("");
				$("#account-change_passwd-confirm_password").val("");
			}
			else if( status == "error" )
			{
				plug.button.enable($("#account-change_passwd-save"));
				plug.window.alert({
					"info": xhr
				});
			}
		},



		tableInit: function(json) {
			$("#sevenTables-account-usermanage-ctrl-table").remove();
			sevenTables.init({
				holder: "#account-usermanage-ctrl-table",
				background: "none",
				column: {
					count: 2,
					width: [216, 216],
					display: ["block", "block"]
				},
				data: {
					json: json,
					option: ["name", "type"]
				},
				row: 5,
				checkbox: {
					enable: false,
					width: 50
				},
				title: [ lang.account.listUserName, lang.account.listUserGrop ],
				allowAdjustColWidth: {
					enable: false,
					column: [0, 1, 2],
					minWidth: 100,
					maxWidth: 300
				},
				mouseSelect: true,
				pagination: {
					enable: true,
					paginationCount: 15, //默认每页显示条目数若paginationPageList为true则此选项失效
					paginationPageList: {
						enable: true,
						option: [12, 20, 30]
					}
				}
			});
		}
	},

	init: function(){
		UserManager.bind();
		UserManager.MODULE.GetUser();
	},

	bind: function(){
		$("#account-add").click(function(){
			$("#account-cell-add").siblings(".content-usr-list").hide();
			$("#account-cell-add").show();
			$("#content-account .content-list-bottom").show();
			$("#account-add-save").show();
			$("#account-change_passwd-save").hide();
		});

		$("#account-change_passwd").click(function(){
			$("#account-cell-change_passwd").siblings(".content-usr-list").hide();
			$("#account-cell-change_passwd").show();
			$("#content-account .content-list-bottom").show();
			$("#account-add-save").hide();
			$("#account-change_passwd-save").show();
			$(".seventables-body-tbody tr:first").click();
		});


		$("#account-add-save").click(function(){
			if( UserManager.valid.creatUserVaild() == true )
			{
				var $username = $("#account-add-username"),
					$password = $("#account-add-password");
				var data = {
					"Username": $username.val(),
					"Password": Base64.encode($password.val()),
					"Type": "user"
				};
				UserManager.MODULE.AddUser(data);
			}
		});

		$("#account-change_passwd-save").click(function() {
			if ( UserManager.valid.changepwdValid() == true )
			{
				var data = {
					"Username": $("#account-current_username").text(),
					"OldPassword": Base64.encode($("#account-change_passwd-old").val()),
					"NewPassword": Base64.encode($("#account-change_passwd-new").val())
				};
				UserManager.MODULE.ChangePwd();
			}
		});

		$("#account-delete").click(function(event) {
			$("#account-add-save").hide();
			$(".content-list-bottom").hide();
			$("#account-change_passwd-save").hide();
			$("#account-cell-add").hide();
			$("#account-cell-change_passwd").hide();

			$("#account-current_username").text("");
				UserManager.selectedTaskId = sevenTables.selectedTaskId;
				if (UserManager.selectedTaskId.length == 0) 
				{
					plug.window.alert({
						"info": lang.ajax.removeUser.notarget
					});
					return false;
				} 
				else 
				{
					plug.window.confirm({
						"info": lang.ajax.removeUser.confirm,
						"btnConfirm": lang.plug.Delete,
						"confirm": function() {
							var holder = $("#sevenTables-account-usermanage-ctrl-table"),
								num = holder.find(".datagrid-btable").attr("id").split("nums-")[1];
							var usernames = sevenTables.privateTables["table" + num].data.json[Number(UserManager.selectedTaskId[0])].name;
							if (UserManager.selectedTaskId.length > 1) 
							{
								for (var i = 1; i < UserManager.selectedTaskId.length; i++) 
								{
									usernames += ",";
									usernames += sevenTables.privateTables["table" + num].data.json[UserManager.selectedTaskId[i]].name;
								}
							}

							var data = {
								"Usernames": usernames
							};

							UserManager.MODULE.DeleteUser(data);
						},
						"cancel": function() {
							UserManager.selectedTaskId = [];
						}
					});
				}
		});
	},

	valid: {
		creatUserVaild: function(){
			var b = false;
			var a = common.validInfo((valid.accountUsername($("#account-add-username").val()))) && common.validInfo((valid.password($("#account-add-password").val())));
			if (a == true) 
			{
				if ($("#account-add-password").val() != $("#account-add-confirm_password").val()) 
				{
					plug.window.alert({
						"info": lang.valid.password.confirm
					});
				} 
				else if('admin' == $("#account-add-password").val())
				{
					plug.window.alert({
						"info": lang.ajax.changeUserPwd.cannotbeadmin
					});						
				}
				else 
				{
					b = true;
				}
			}
			return a && b;
		},

		changepwdValid: function(){
			if ($("#account-current_username").text() == "admin") 
			{
				var b = false;
				var a = common.validInfo((valid.password($("#account-change_passwd-old").val()))) && common.validInfo((valid.password($("#account-change_passwd-new").val())));
				if (a == true) {
					if ($("#account-change_passwd-new").val() != $("#account-change_passwd-confirm_password").val()) 
					{
						plug.window.alert({
							"info": lang.valid.password.confirm
						});
					} 
					else if('admin' == $("#account-change_passwd-new").val())
					{
						plug.window.alert({
							"info": lang.ajax.changeUserPwd.cannotbeadmin
						});						
					}
					else 
					{
						b = true;
					}
				}
				return a && b;
			} 
			else 
			{
				var b = false;
				var a = common.validInfo(valid.password($("#account-change_passwd-new").val()));
				if (a == true) {
					if ($("#account-change_passwd-new").val() != $("#account-change_passwd-confirm_password").val()) {
						plug.window.alert({
							"info": lang.valid.password.confirm
						});
					} else {
						b = true;
					}
				}
				return a && b;
			}				
		}			
	}
}

