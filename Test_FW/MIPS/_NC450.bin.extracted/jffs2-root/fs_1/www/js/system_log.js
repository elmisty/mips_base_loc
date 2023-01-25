$(document).ready(function(){
	var Log = {
		init: function(){
			Log.bind();
			Log.getLogInfo();
			Log.getControl();
		},

		bind: function(){
			$("select").change(function(){
				$("option:selected",this).click();
			});

			$("#log-save").click(function() {
				Log.download();
			});

			$("#log-clear").click(function() {
				plug.window.confirm({
					"info": lang.ajax.log.clearConfirm,
					"btnConfirm": lang.plug.Clear,
					"confirm": function() {
						Log.clear();
					}
				});
			});

			$("#log-refresh").click(function() {
				Log.refresh();
			});

			$("#log-control").toggle(
				function(){
					$(this).val(lang.syslog.hideControl);
					$("#log-control-cell").show();
				},
				function(){
					$(this).val(lang.syslog.logControl);
					$("#log-control-cell").hide();
				}
			);

			$("#log-debug-enable").click(function(){
				$(this).addClass("debug-switch-selected");
				$("#log-debug-disable").removeClass("debug-switch-selected");
			});
			$("#log-debug-disable").click(function(){
				$(this).addClass("debug-switch-selected");
				$("#log-debug-enable").removeClass("debug-switch-selected");
			});			
			$("#log-net-enable").click(function(){
				$(this).addClass("net-switch-selected");
				$("#log-net-disable").removeClass("net-switch-selected");
			});
			$("#log-net-disable").click(function(){
				$(this).addClass("net-switch-selected");
				$("#log-net-enable").removeClass("net-switch-selected");
			});
			$("#log-control-save").click(function(){
				Log.setControl();
			});
				
		},

		getLogInfo: function() {
			plug.button.disable($("#log-clear"));
			plug.button.disable($("#log-save"));
			plug.button.disable($("#log-refresh"));
			
			var args = {
				data: {
					"level": 8,
					"name": "ALL",
					"line": 50
				},
				url: '/getlog.fcgi',
				//url: '/JSON/getlog.json',
				success: function(response) {
					var json = jQuery.parseJSON(response);
					json = json.log;
					$("#systemlog-ctrl-table").html("");
					//$("#systemlog-ctrl-table").width(724);
					//Log.tableInit(json);
					Log.ytableInit(json);
					Log.decodeLog();
					$("#log-img-loading").hide();
					plug.button.enable($("#log-clear"));
					plug.button.enable($("#log-save"));
					plug.button.enable($("#log-refresh"));
				},
				error: function(xhr) {
					plug.button.enable($("#log-clear"));
					plug.button.enable($("#log-save"));
					plug.button.enable($("#log-refresh"));
				}
			}
			sevenTables.ajax.init(args);
		},

		tableInit: function(json) {
			sevenTables.init({
				holder: "#systemlog-ctrl-table",
				background: "none",
				column: {
					count: 4,
					width: [150, 105, 80, 383]
				},
				data: {
					json: json,
					option: ["time", "module", "level", "msg"]
				},
				row: 5,
				Num: true,
				checkbox: {
					enable: false,
					width: 50
				},
				title: [lang.syslog.Time, lang.syslog.Module, lang.syslog.Level, lang.syslog.Content],
				allowAdjustColWidth: {
					enable: false,
					column: [0, 1, 2, 3, 4, 5],
					minWidth: 100,
					maxWidth: 400
				},
				mouseSelect: false,
				enabledEdit: {
					enable: false,
					column: [1, 2],
					ajax: {
						url: '/inits/request.fcgi',
						type: 'post',
						dataType: 'text',
						contentType: 'application/x-www-form-urlencoded;charset=utf-8',
						timeout: 20000,
						async: true,
						cache: false,
						global: false,
						data: {
							"httpget_isenable": 1234,
							"sometest": 2343
						},
						beforeSend: function() {
						},
						success: function() {
						},
						complete: function() {
						},
						error: function() {
						}

					}
				},
				toolBar: {
					enable: true,
					changecontain: {
						enable: true,
						select: [{
							title: lang.syslog.Level,
							refreshable: true,
							width: 90,
							option: [lang.syslog.ALL, 
									 lang.syslog.EMERG, 
									 lang.syslog.ALERT, 
									 lang.syslog.CRIT, 
									 lang.syslog.ERROR, 
									 lang.syslog.WARNING, 
									 lang.syslog.NOTICE, 
									 lang.syslog.INFO, 
									 /*lang.syslog.DEBUG*/],
							value: ["8", "0", "1", "2", "3", "4", "5", "6"/*, "7"*/]
						}, {
							title: lang.syslog.Module,
							refreshable: true,
							width: 120,
							option: [lang.syslog.ALL, 
								 	 lang.syslog.UserManage, 
								 	 lang.syslog.DateTime, 
								 	/* lang.syslog.UPnP, */
								 	 lang.syslog.Cloud, 
								 	 lang.syslog.NetSwitch, 
								 	 lang.syslog.Wireless, 
								 	 lang.syslog.NetConfig, 
								 	 /*lang.syslog.Ddns, 
								 	 lang.syslog.SMTP, 
								 	 lang.syslog.FTP, 
								 	 lang.syslog.DynDdns,*/ 
								 	 lang.syslog.MotionDetection, 
								 	 lang.syslog.Bonjour, 
								 	 lang.syslog.VideoControl,
								 	 lang.syslog.System,
								 	 ]
						}],
						ajax: {
							url: '/getlog.fcgi',
							type: 'post',
							dataType: 'text',
							contentType: 'application/x-www-form-urlencoded;charset=utf-8',
							timeout: 20000,
							async: true,
							cache: false,
							global: false,
							data: {
								"level": "first",
								"name": "second",
								"line": 50
							},
							beforeSend: function() {
								//	alert(sevenTables.ajaxXhr);
							},
							success: function(response) {
								var json = jQuery.parseJSON(response);
								if (json.errorCode == 0) {
									Log.refresh(json.log);
									if (json.log.length < 10) {
									} else {
									}

									Log.decodeLog();
								} else {
									plug.window.alert({
										"info": lang.ajax.tables.logChangeContainFailed
									});
								}
							},
							complete: function() {
							},
							error: function(xhr) {
							}
						}
					},
					pagination: {
						enable: false,
						paginationCount: 15,
						paginationPageList: {
							enable: true,
							option: [10, 20, 50]
						}
					}
				},
				scrollCtrl: {
					enable: true,
					height: 310,
					headerTdNum: 3
				}
			});
		},
		ytableInit:function(json) {
			var options ={

				holder: "#systemlog-ctrl-table",
				emptytips: lang.ajax.log.nolog,
				column:{
					count: 4,
					width: [150, 105, 80, 383],
					display: ["block", "block", "block", "block"]	
				},
				row: 8,
				title: [lang.syslog.Time, lang.syslog.Module, lang.syslog.Level, lang.syslog.Content],
				data: {
					initEmpty: false,
					json: [],
					option: ["time", "module", "level", "msg"]
				},
				height: null,
				reinitBody: false,
				returnStr: false,
				mouseSelect: false,
				toolBar: {
						enable: true,
						select: [{
							id:"level",
							title: lang.syslog.Level,
							width: 90,
							option: [lang.syslog.ALL, 
									 lang.syslog.EMERG, 
									 lang.syslog.ALERT, 
									 lang.syslog.CRIT, 
									 lang.syslog.ERROR, 
									 lang.syslog.WARNING, 
									 lang.syslog.NOTICE, 
									 lang.syslog.INFO, 
									 /*lang.syslog.DEBUG*/],
								value: ["8", "0", "1", "2", "3", "4", "5", "6"/*, "7"*/]
							}, 
							{
								id:"module",
								title: lang.syslog.Module,
								width: 130,
								option: [lang.syslog.ALL, 
										 lang.syslog.UserManage, 
										 lang.syslog.DateTime, 
										 	/* lang.syslog.UPnP, */
										 lang.syslog.Cloud, 
										 lang.syslog.NetSwitch, 
									 	 lang.syslog.Wireless, 
									 	 lang.syslog.NetConfig, 
									 	 /*lang.syslog.Ddns, 
									 	 lang.syslog.SMTP, 
									 	 lang.syslog.FTP, 
									 	 lang.syslog.DynDdns,*/ 
									 	 lang.syslog.MotionDetection, 
									 	 lang.syslog.Bonjour, 
									 	 lang.syslog.VideoControl,
									 	 lang.syslog.System,
								],
								value: [lang.syslog.ALL, 
										 lang.syslog.UserManage, 
										 lang.syslog.DateTime, 
										 	/* lang.syslog.UPnP, */
										 lang.syslog.Cloud, 
										 lang.syslog.NetSwitch, 
									 	 lang.syslog.Wireless, 
									 	 lang.syslog.NetConfig, 
									 	 /*lang.syslog.Ddns, 
									 	 lang.syslog.SMTP, 
									 	 lang.syslog.FTP, 
									 	 lang.syslog.DynDdns,*/ 
									 	 lang.syslog.MotionDetection, 
									 	 lang.syslog.Bonjour, 
									 	 lang.syslog.VideoControl,
									 	 lang.syslog.System,
								]
						}]

				}
			};
			options.data.json = json;
			//createTable
			$.createTable(options);
			$(options.holder).find("select").each(function(){
				$(this).Select();
			});

			//toolbar bind
			$(".plug-tabel-toolbar-select select option").click(function(){
					var args = {
						url: '/getlog.fcgi',
						type: 'post',
						data: {
							"level":$(".plug-tabel-toolbar-select-level").val(),
							"name": $(".plug-tabel-toolbar-select-module").val(),
							"line": 50
						},
						beforeSend: function() {
						},
						success: function(json) {
							if (json.errorCode == 0) {
								options.data.json = json.log;
								options.reinitBody = true;
								$.createTable(options);
								if (json.log.length < 10) {
								} else {
								}
								Log.decodeLog();
								} else {
									plug.window.alert({
										"info": lang.ajax.tables.logChangeContainFailed
									});
								}
							},
							complete: function() {
							},
							error: function(xhr) {
							}
					}
					common.ajax.init(args);
			});
			$("select").change(function(){
				$("option:selected",this).click();
			});

		},
		decodeLog: function() {
			$(".plug-table-body-test .plug-table-body-th-3 span").each(function() {
				$(this).text(Base64.decode($(this).text()));	
			});
		},
		download: function() {
			var args = {
				url: "/check_1.fcgi",
				data: {},
				success: function(json) {
					if (json.errorCode == 0) {
						var token_param = { token: $("#token").attr("value") };
						location.href = "/downloadlog.fcgi?" + $.param(token_param);
					} else {
						plug.window.alert({
							"info": lang.ajax.log.downloadFailed
						});
					}
				},
				error: function(xhr) {
				}
			}
			common.setAjax.init(args);
		},
		clear: function() {
			var args = {
				url: '/clearlog.fcgi',
				data: {},
				success: function(json) {
					if (json.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.log.clearSuccess
						});
						Log.refresh();
					} else {
						plug.window.alert({
							"info": lang.ajax.log.clearFailed
						});
					}
				},
				error: function(xhr) {
				}
			}
			common.setAjax.init(args);
		},
		refresh: function() {
			plug.button.disable($("#log-clear"));
			plug.button.disable($("#log-save"));
			plug.button.disable($("#log-refresh"));
			var args = {
				data: {
					"level": 8,
					"name": "ALL",
					"line": 50
				},
				url: '/getlog.fcgi',
				success: function(json) {
					//var tableNum = Number($("#sevenTables-systemlog-ctrl-table .datagrid-btable").attr("id").split("seventables-nums-")[1]);
					//$("#sevenTables-systemlog-ctrl-table").remove();
					//var json = jQuery.parseJSON(response);
					$("#systemlog-ctrl-table").html("");
					//sevenTables.reinit(json.log, tableNum);
					json = json.log;
					Log.ytableInit(json);
					Log.decodeLog();
					plug.button.enable($("#log-clear"));
					plug.button.enable($("#log-save"));
					plug.button.enable($("#log-refresh"));
				},
				error: function(xhr) {
					plug.button.enable($("#log-clear"));
					plug.button.enable($("#log-save"));
					plug.button.enable($("#log-refresh"));
				}
			}
			common.ajax.init(args);
		},

		//log control save
		setControl:function(){
			var args = {
				url: '/setcontrollog.fcgi',
				data: {
					'LEVEL': $("#log-control-level").val(),
					'MODULE': $("#log-control-model").val(),
					'NET': $(".net-switch-selected").val() || 0,
					'DEBUG': $(".debug-switch-selected").val() || 0
				},
				success: function(json) {
					if (json.errorCode == 0) {
						plug.window.alert({
								"info": lang.syslog.logControlSetSuccess
							});
					} else {
						plug.window.alert({
								"info": lang.syslog.logControlSetFail
						});
					}
				},
				error: function(xhr) {
				}
			}
			common.setAjax.init(args);
		},
		getControl: function(){
			var args = {
				url: '/getcontrollog.fcgi',
				success: function(json) {
					$("#log-control-level").val(json.LEVEL).change();
					$("#log-control-model").val(json.MODULE).change();
					if(json.NET == 1){
						$("#log-net-enable").click();
					}else{
						$("#log-net-disable").click();
					}
					if(json.DEBUG == 1){
						$("#log-debug-enable").click();
					}else{
						$("#log-debug-disable").click();
					}
				},
				error: function(xhr) {
				}
			}
			common.ajax.init(args);
		}
	};

	Log.init();
})
