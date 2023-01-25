$(document).ready(function(){
	var Sysmanager = {
		progressBarInterval: null,
		frmVer: null,

		init: function(){
			Sysmanager.bind();
			Sysmanager.getSysInfo();
		},

		bind: function(){
			$("#sysmanager-restore-path").val("");
			$("#sysmanager-restore-path-input").val("");
			$("#sysmanager-upgrade-path-input").val("");
			$("#sysmanager-upgrade-path").val("");

			$("#sysmanager-restore-button-path_browser").click(function(){
				$("#sysmanager-restore-path").click();
			});

			$("#sysmanager-restore-path").change(function(){
				var a = $("#sysmanager-restore-path").val();
				$("#sysmanager-restore-path-input").val(a);
			});

			$("#sysmanager-update-button-path_browser").click(function(){
				$("#sysmanager-upgrade-path").click();
			});

			$("#sysmanager-upgrade-path").change(function(){
				var b = $("#sysmanager-upgrade-path").val();
				$("#sysmanager-update-path-input").val(b);		
			});

			$("#sysmanager-reboot").click(function() {
				plug.window.confirm({
					"info": lang.ajax.system.rebootConfirm,
					"btnConfirm": lang.plug.Reboot,
					"confirm": function() {
						Sysmanager.reboot();
					}
				});
			});

			$("#sysmanager-backup").click(function() {
				Sysmanager.Backup();
			});

			$("#sysmanager-factory-reset").click(function() {
				plug.window.confirm({
					"info": lang.ajax.system.restoreConfirm,
					"btnConfirm": lang.plug.Reset,
					"confirm": function() {
						Sysmanager.factoryDefault();
					}
				});
			});

			$("#sysmanager-factory-restore").click(function() {
				if ($("#sysmanager-restore-path").val() == "") {
					plug.window.alert({
						"info": lang.ajax.system.factoryRestore
					});
					return false;
				}
				if (false != Sysmanager.valid.checkRestoreFile(document.getElementById("sysmanager-restore-path"), "cfg", 20 * 1024, 1024)) {
					Sysmanager.progressBar(lang.sysmanage.restoretitle, 60000, lang.sysmanage.rebooting);
					Sysmanager.restore();
				}
			});

			$("#sysmanager-upgrade").click(function() {
				if ($("#sysmanager-upgrade-path").val() == "") {
					plug.window.alert({
						"info": lang.ajax.system.factoryRestore
					});
					return false;
				}
				if (false != Sysmanager.valid.checkUpgradeFile(document.getElementById("sysmanager-upgrade-path"), "bin", 16 * 1024 * 1024, 2 * 1024 * 1024)) {
					Sysmanager.progressBar(lang.sysmanage.upgradetitle, 210000, lang.sysmanage.upgrade);
					Sysmanager.Upgrade();
				}
			});

		},

		reboot: function() {
			Sysmanager.progressBar(lang.sysmanage.reboottitle, 60000, lang.sysmanage.rebooting);
			var args = {
				url: '/reboot.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
					} else {
						plug.window.alert({
							"info": lang.ajax.system.rebootFailed
						});
						Sysmanager.exitProgressBar();
					}
				},
				error: function(xhr) {
				}
			};
			common.setAjax.init(args);
		},

		Backup: function() {
			var args = {
				url: '/check_1.fcgi',
				timeout: 2000,
				success: function(json) {
					if (json.errorCode == 0) {
						var token_param = { token: $("#token").attr("value") };
						window.location.href = "backup.fcgi?" + $.param(token_param);
					} else {
						plug.window.alert({
							"info": lang.ajax.system.backupFailed
						});
					}
				},
				error: function(xhr) {
					plug.window.alert({
						"info": lang.ajax.system.backupFailed
					});
				}
			}
			common.setAjax.init(args);
		},

		restore: function() {
			var args = {
				url: '/check_1.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {					
						var token_param = { token: $("#token").attr("value") };
						$.ajaxFileUpload({
							url: 'restore.fcgi?' + $.param(token_param),
							secureuri: false,
							fileElementId: 'sysmanager-restore-path', 
							dataType: 'text', 
							beforeSend: function() {
							},
							success: function(data, status) {
								var json = jQuery.parseJSON(data)
								if (json.errorCode == 0) {} else if (json.errorCode == 1052) {
									$("#sysmanager-restore-path").change(function() {
										$("#sysmanager-restore-path-input").val($(this).val());
									});
									$("#sysmanager-restore-path-input").val("");
									$("#sysmanager-restore-path").val("");
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.restorename
									});
								} else {
									$("#sysmanager-restore-path").change(function() {
										$("#sysmanager-restore-path-input").val($(this).val());
									});
									$("#sysmanager-restore-path-input").val("");
									$("#sysmanager-restore-path").val("");
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.ajax.system.uploadFailed
									});
								}
							},
							error: function(data, status, e) {
								var json = jQuery.parseJSON(data.responseText);
								if (json.errorCode == 1052) {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.restorename
									});
								} else if (json.errorCode == 1053) {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.restoreminsize
									});
								} else if (json.errorCode == 1054) {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.restoremaxsize
									});
								} else {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.ajax.system.uploadFailed
									});
								}
								$("#sysmanager-restore-path").change(function() {
									$("#sysmanager-restore-path-input").val($(this).val());
								});
								$("#sysmanager-restore-path-input").val("");
								$("#sysmanager-restore-path").val("");
							}
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.system.upgradeFailed
						});
					}
				},
				error: function(xhr) {}
			}
			common.setAjax.init(args);
		},

		Upgrade: function() {
			var args = {
				url: '/check_1.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						$("#loading")
							.ajaxStart(function() {
							$(this).show();
						})
							.ajaxComplete(function() {
							$(this).hide();
						});
							
						var token_param = { token: $("#token").attr("value") };
						$.ajaxFileUpload({
							url: 'upgrade.fcgi?' + $.param(token_param),
							secureuri: false,
							//data : {size: 2000, id : 1},
							fileElementId: 'sysmanager-upgrade-path', 
							dataType: 'text', 
							beforeSend: function() { 
							},
							success: function(data, status) { 
								var json = jQuery.parseJSON(data)
								if (json.errorCode == 0) {
								} else if (json.errorCode == 1052) {
									$("#sysmanager-upgrade-path-input").val("");
									$("#sysmanager-upgrade-path").val("");
									$("#sysmanager-upgrade-path").change(function() {
										$("#sysmanager-upgrade-path-input").val($(this).val());
									});
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.upgradename
									});
								} else {
									$("#sysmanager-upgrade-path-input").val("");
									$("#sysmanager-upgrade-path").val("");
									$("#sysmanager-upgrade-path").change(function() {
										$("#sysmanager-upgrade-path-input").val($(this).val());
									});
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.ajax.system.upgradeFailed
									});
								}
							},
							error: function(data, status, e) {
								var json = jQuery.parseJSON(data.responseText) || {
									"errorCode": -1
								};
								if (json.errorCode == 0) {} else if (json.errorCode == 1052) {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.upgradename
									});
								} else if (json.errorCode == 1053) {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.upgrademinsize
									});
								} else if (json.errorCode == 1054) {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.sysmanage.upgrademaxsize
									});
								} else {
									Sysmanager.exitProgressBar();
									plug.window.alert({
										"info": lang.ajax.system.upgradeFailed
									});
								}
								$("#sysmanager-upgrade-path-input").val("");
								$("#sysmanager-upgrade-path").val("");
								$("#sysmanager-upgrade-path").change(function() {
									$("#sysmanager-upgrade-path-input").val($(this).val());
								});
							}
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.system.upgradeFailed
						});
					}
				},
				error: function(xhr) {}
			}
			common.setAjax.init(args);
		},

		factoryDefault: function() {
			Sysmanager.progressBar(lang.sysmanage.factitle, 60000, lang.sysmanage.resetting);
			var args = {
				url: '/reset.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
					
					} else {
						plug.window.alert({
							"info": lang.ajax.system.factorydefaultFailed
						});
						Sysmanager.exitProgressBar();
					}
				},
				error: function(xhr) {
				}
			}
			common.setAjax.init(args);
		},
		getSysInfo: function(){
			var args = {
				url: '/getsysinfo.fcgi',
				success: function(json) {	
					Sysmanager.frmVer = json.frmVer;

				},
				error: function(xhr) {
				}
			}
			common.ajax.init(args);
		},
		detectUpgrade: function() {
			var args = {
				url: "https://"+ common.URL +"/init2.php",
				dataType: "jsonp",
				timeout: 5000,
				data: {
					"REQUEST": 'COMMONUPDATE',
					"DATA": {
						"OS": "firmware",
						"Version": Sysmanager.frmVer.substring(0,6),
						"Model": video.productType
					}
				},
				success: function(json, response) {
					if (response.errorCode == 10000) {
					} else if (response.errorCode == 0) {
						plug.window.confirm({
							"info": lang.ajax.system.oldversion,
							"btnConfirm": lang.plug.Download,
							"confirm": function() {
								window.location.href = response.msg;
							}
						});
						$("#sysmanager-software-detect").attr("href", response.msg).show();
						$("#sysmanager-software-detect-tips").hide();
					} else {
						plug.window.alert({
							"info": lang.ajax.system.dectectFailed
						});
					}
				},
				error: function(xhr) {
					plug.window.alert({
						"info": lang.ajax.system.detectdisconnect
					});
				}
			}
			common.ajax.init(args);
		},
		progressBar: function(title, delaytime, caution) {
			$("#management-cell").hide();
			$("#sysmanager-progressbar").show();
			common.shadeLayer();
			$(".sevenprogressbar-text").text(caution);
			$("#progress-title").text(title);

			$(".sevenprogressbar-img").css({
				"width": 0
			});
			Sysmanager.progressBarInterval = setInterval(function() {
				var width = parseInt($(".sevenprogressbar-img").width() * 100 / $(".sevenprogressbar-cell").width());
				$(".sevenprogressbar-percent").text(width + "%");
				if (width == 100) {
					Sysmanager.progressBarInterval = clearInterval(Sysmanager.progressBarInterval);
					window.location.reload();
				}
			}, 1000);
			$(".sevenprogressbar-img").animate({
				width: '100%'
			}, delaytime);
		},
		exitProgressBar: function() {
			Sysmanager.progressBarInterval = clearInterval(Sysmanager.progressBarInterval);
			$(".sevenprogressbar-img").stop();
			$(".sevenprogressbar-img").width(0);
			common.removeShadeLayer();
			$("#sysmanager-progressbar").hide();
			$(".sevenprogressbar-percent").text();
			$("#management-cell").show();
			$("#progress-title").text(lang.sysmanage.management);
		},
		valid: {
			checkRestoreFile: function(obj, suffix, maxSize, minSize) {
				var size, name;
				if (common.browserName == "Microsoft Internet Explorer") {
					name = obj.value;
					size = minSize;
				} else {
					size = obj.files[0].size;
					name = obj.files[0].name;
					if (!size) {
						size = obj.files[0].fileSize;
						name = obj.files[0].fileName;
						if (!size) {
							size = obj.value;
							name = minSize
						}
					}
				}
				if (name.match(eval("/\." + suffix + "$/i")) == null) {
					plug.window.alert({
						"info": lang.sysmanage.restorename
					})
					return false;
				} else {
					if (size > maxSize) {
						plug.window.alert({
							"info": lang.sysmanage.restoremaxsize
						})
						return false;
					} else if (size < minSize) {
						plug.window.alert({
							"info": lang.sysmanage.restoreminsize
						})
						return false;
					}
				}
			},
			checkUpgradeFile: function(obj, suffix, maxSize, minSize) {
				var size, name;
				if (common.browserName == "Microsoft Internet Explorer") {
					name = obj.value;
					size = minSize;
				} else {
					size = obj.files[0].size;
					name = obj.files[0].name;
					if (!size) {
						size = obj.files[0].fileSize;
						name = obj.files[0].fileName;
						if (!size) {
							size = obj.value;
							name = minSize
						}
					}
				}
				if (name.match(eval("/\." + suffix + "$/i")) == null) {
					plug.window.alert({
						"info": lang.sysmanage.upgradename
					})
					return false;
				} else {
					if (size > maxSize) {
						plug.window.alert({
							"info": lang.sysmanage.upgrademaxsize
						})
						return false;
					} else if (size < minSize) {
						plug.window.alert({
							"info": lang.sysmanage.upgrademinsize
						})
						return false;
					}
				}
			}
		}
	};
	Sysmanager.init();
})
