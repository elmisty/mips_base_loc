$(document).ready(function(){
	var DDns = {
		noipShowLoadingInterval: null, 
		dyndnsShowLoadingInterval: null, 
		comexeShowLoadingInterval: null, 
		noipLoopLoginCount: null, 
		dyndnsLoopLoginCount: null, 
		comexeLoopLoginCount: null, 
		noipStateInterval: null, 
		dyndnsStateInterval: null, 
		comexeStateInterval: null, 

		init: function(){
			DDns.bind();
			DDns.getDDnsInfo();
			//DDns.noipCtrl.stateDetect();
			//DDns.dyndnsCtrl.stateDetect();
			//DDns.comexeCtrl.stateDetect();
		},
		bind: function(){		
			$("#ddns-type").change(function() {
				$(".ddns-type-cell").hide();
				$(".ddns-save-button").hide();
				if ($("#ddns-type").val() == 2) {
					$("#ddns-comexe-cell").show();
					$("#ddns-select-regist-title").attr("href", "http://www.comexe.cn");
					$("#ddns-comexe-save").show();
				} else if ($("#ddns-type").val() == 1) {
					$("#ddns-dyndns-cell").show();
					$("#ddns-dyndns-save").show();
					$("#ddns-select-regist-title").attr("href", "http://www.dyn.com");
				} else if ($(this).val() == 0) {
					$("#ddns-noip-cell").show();
					$("#ddns-noip-save").show();
					$("#ddns-select-regist-title").attr("href", "http://www.noip.com");
				}
			});

			/*noip*/
			$("#ddns-noip-login").click(function() {
				DDns.noipCtrl.login();
			});
			$("#ddns-noip-logout").click(function() {
				plug.button.disable($("#ddns-noip-logout"));
				var args = {
					"NoipAction": 2,
					"types": "noip"
				}
				DDns.ddnslogout(args);
			});				
			$("#ddns-noip-save").click(function() {
				DDns.noipCtrl.save();
			});
				
			/*dyndns*/
			$("#ddns-dyndns-login").click(function() {
				DDns.dyndnsCtrl.login();
			});

			$("#ddns-dyndns-logout").click(function() {
				plug.button.disable($("#ddns-dyndns-logout"));
				var args = {
					"DynAction": 2,
					"types": "dyndns"
				}
				DDns.ddnslogout(args);
			});

			$("#ddns-dyndns-save").click(function() {
				DDns.dyndns.save();
			});

			/*comexe */
			$("#ddns-comexe-login").click(function() {
				DDns.comexeCtrl.login();
			});

			$("#ddns-comexe-logout").click(function() {
				plug.button.disable($("#ddns-comexe-logout"));
				var args = {
					"CmxAction": 2,
					"types": "cmxaction"
				}
				DDns.ddnslogout(args);
			});

			$("#ddns-comexe-save").click(function() {
				DDns.comexeCtrl.save();
			});
		},

		getDDnsInfo: function() {
			var args = {
				url: '/ddns_get.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						json.NoipAutoBoot == 0 ? null : $("#ddns-noip-enable").attr("checked", true);
						json.CmxAutoBoot == 0 ? null : $("#ddns-cmxaction-enable").attr("checked", true);
						json.DynAutoBoot == 0 ? null : $("#ddns-dyndns-enable").attr("checked", true);
						$("#ddns-comexe-username").val(Base64.decode(json.CmxUserName));
						$("#ddns-comexe-passwd").val(Base64.decode(json.CmxPassWord));
						$("#ddns-comexe-domain").val(Base64.decode(json.CmxDomain));
						$("#ddns-noip-usernamer").val(Base64.decode(json.NoipUserName));
						$("#ddns-noip-passwd").val(Base64.decode(json.NoipPassWord));
						$("#ddns-noip-domain").val(Base64.decode(json.NoipDomain));
						$("#ddns-dyndns-username").val(Base64.decode(json.DynUserName));
						$("#ddns-dyndns-passwd").val(Base64.decode(json.DynPassWord));
						$("#ddns-dyndns-domain").val(Base64.decode(json.DynDomain));
						DDns.ddnsConnectState(json.NoipStatus, "noip");
						DDns.ddnsConnectState(json.CmxStatus, "comexe");
						DDns.ddnsConnectState(json.DynStatus, "dyndns");
						video.upnpInfo.noip = Base64.decode(json.NoipDomain);
						video.upnpInfo.dyndns = Base64.decode(json.DynDomain);
						video.upnpInfo.cmxaction = Base64.decode(json.CmxDomain);
					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},

		ddnsConnectState: function(status, types) {
			var $connect = $("#ddns-" + types + "-connectstate"),
				$login = $("#ddns-" + types + "-login"),
				$logout = $("#ddns-" + types + "-logout"),
				$savebutton = $("#ddns-" + types + "-save");
			if (status == "Disconnected") {	
				plug.button.enable($logout);
				$login.show();
				$logout.hide();
				//plug.button.enable($savebutton);
				$connect.html(lang.state.disconnect);
			} else if (status == "Connecting") {
				$login.hide();
				$logout.show();
				plug.button.disable($savebutton);
				$connect.html(lang.state.connecting);
			} else if (status == "Connected") {
					// plug.button.disable($login);
					// plug.button.enable($logout);
				$logout.show();
				$login.hide();
				plug.button.disable($savebutton);
				$connect.html(lang.state.connected);
			}
		},

		noipCtrl:{
			login: function() {
				plug.button.disable($("#ddns-noip-login"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"NoipAction": 1,
						"NoipUserName": Base64.encode($("#ddns-noip-username").val()),
						"NoipPassWord": Base64.encode($("#ddns-noip-passwd").val()),
						"NoipDomain": Base64.encode($("#ddns-noip-domain").val())
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.button.enable($("#ddns-noip-login"));
							$("#ddns-noip-login").hide();
							$("#ddns-noip-logout").show();
							plug.button.disable($("#ddns-noip-save"));
							DDns.noipLoopLoginCount = 0;
							DDns.noipCtrl.stateDetect();
							DDns.noipCtrl.showLoadingStart($("#ddns-noip-connectstate"), lang.state.connecting);

						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.loginFailed
							});
						}
					},
					error: function(xhr) {
					}
				};
				common.setAjax.init(args);
			},

			save: function() {
				plug.button.disable($("#ddns-noip-save"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"NoipAction": "0",
						"NoipUserName": Base64.encode($("#ddns-noip-username").val()),
						"NoipPassWord": Base64.encode($("#ddns-noip-passwd").val()),
						"NoipDomain": Base64.encode($("#ddns-noip-domain").val())
					},
					success: function(json) {
						plug.button.enable($("#ddns-noip-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.ddns.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#ddns-noip-save"));
					}
				}
				common.setAjax.init(args);
			},

			stateDetect: function() {
				DDns.noipStateInterval = setInterval(function() {
					var args = {
						url: '/noip_status.fcgi',
						success: function(json) {
							DDns.noipLoopLoginCount = DDns.noipLoopLoginCount + 1;
							if (json.errorCode == 0) {
								if (json.NoipStatus == "Connected") {
									DDns.noipCtrl.showLoadingEnd($("#ddns-noip-connectstate"));
									DDns.ddnsConnectState("Connected", "noip");
									DDns.noipStateInterval = clearInterval(DDns.noipStateInterval);
								} else if (json.NoipStatus == "Disconnected") {
									DDns.noipStateInterval = clearInterval(DDns.noipStateInterval);
									DDns.noipCtrl.showLoadingEnd($("#ddns-noip-connectstate"));
									DDns.ddnsConnectState("Disconnected", "noip");
									$("#ddns-noip-login").show();
									$("#ddns-noip-logout").hide();
								} else if (DDns.noipLoopLoginCount > 20) {
									DDns.noipCtrl.showLoadingEnd($("#ddns-noip-connectstate"));
									DDns.noipStateInterval = clearInterval(DDns.noipStateInterval);
									plug.button.enable($("#ddns-noip-save"));
									DDns.ddnsConnectState("Disconnected", "noip");
									$("#ddns-noip-logout").click();
								} else if (json.NoipStatus == "Connecting") {
									$("#ddns-noip-login").hide();
									$("#ddns-noip-logout").show();
									DDns.noipCtrl.showLoadingStart($("#ddns-noip-connectstate"), lang.state.connecting);
								}
							} else {}
						},
						error: function(xhr) {
						}
					}
					common.ajax.init(args);
				}, 3000);
			},

			showLoadingStart: function(holder, text) {
				holder.text(text);
				DDns.noipShowLoadingInterval = clearInterval(DDns.noipShowLoadingInterval);
				DDns.noipShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},

			showLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				DDns.noipShowLoadingInterval = clearInterval(DDns.noipShowLoadingInterval);
			}
		},

		dyndnsCtrl: {
			login: function() {
				plug.button.disable($("#ddns-dyndns-login"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"DynAction": 1,
						"DynUserName": Base64.encode($("#ddns-dyndns-username").val()),
						"DynPassWord": Base64.encode($("#ddns-dyndns-passwd").val()),
						"DynDomain": Base64.encode($("#ddns-dyndns-domain").val())
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.button.enable($("#ddns-dyndns-login"));
							$("#ddns-dyndns-login").hide();
							$("#ddns-dyndns-logout").show();
							plug.button.disable($("#ddns-dyndns-save"));
							DDns.dyndnsLoopLoginCount = 0;
							DDns.dyndnsCtrl.stateDetect();
							DDns.dyndnsCtrl.showLoadingStart($("#ddns-dyndns-connectstate"), lang.state.connecting);
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {}
				}
				common.setAjax.init(args);
			},

			save: function() {
				plug.button.disable($("#ddns-dyndns-save"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"DynAction": "0",
						"DynUserName": Base64.encode($("#ddns-dyndns-username").val()),
						"DynPassWord": Base64.encode($("#ddns-dyndns-passwd").val()),
						"DynDomain": Base64.encode($("#ddns-dyndns-domain").val())
					},
					success: function(json) {
						plug.button.enable($("#ddns-dyndns-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.ddns.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#ddns-dyndns-save"));
					}
				}
				common.setAjax.init(args);
			},

			stateDetect: function() {
				DDns.dyndnsStateInterval = setInterval(function() {
					var args = {
						url: '/dyn_status.fcgi',
						success: function(json) {
							DDns.dyndnsLoopLoginCount = DDns.dyndnsLoopLoginCount + 1;
							if (json.errorCode == 0) {
								if (json.DynStatus == "Connected") {
									DDns.dyndnsCtrl.showLoadingEnd($("#ddns-dyndns-connectstate"));
									DDns.ddnsConnectState("Connected", "dyndns");
									DDns.dyndnsStateInterval = clearInterval(DDns.dyndnsStateInterval);
								} else if (json.DynStatus == "Disconnected") {
									DDns.dyndnsStateInterval = clearInterval(DDns.dyndnsStateInterval);
									DDns.dyndnsCtrl.showLoadingEnd($("#ddns-dyndns-connectstate"));
									DDns.ddnsConnectState("Disconnected", "dyndns");
									$("#ddns-dyndns-login").show();
									$("#ddns-dyndns-logout").hide();
								} else if (DDns.dyndnsLoopLoginCount > 20) {
									DDns.dyndnsCtrl.showLoadingEnd($("#ddns-dyndns-connectstate"));
									DDns.dyndnsStateInterval = clearInterval(DDns.dyndnsStateInterval);
									plug.button.enable($("#ddns-dyndns-save"));
									DDns.ddnsConnectState("Disconnected", "dyndns");
									$("#ddns-dyndns-lLogout").click();
								} else if (json.DynStatus == "Connecting") {
									$("#ddns-dyndns-login").hide();
									$("#ddns-dyndns-logout").show();
									DDns.dyndnsCtrl.showLoadingStart($("#ddns-dyndns-connectstate"), lang.state.connecting);
								}

							} else {}
						},
						error: function(xhr) {

						}
					}
					common.ajax.init(args);
				}, 3000);
			},

			showLoadingStart: function(holder, text) {
				holder.text(text);
				DDns.dyndnsShowLoadingInterval = clearInterval(DDns.dyndnsShowLoadingInterval);
				DDns.dyndnsShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},

			showLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				DDns.dyndnsShowLoadingInterval = clearInterval(DDns.dyndnsShowLoadingInterval);
			}
		},

		comexeCtrl: {
			login: function(setArgs) {
				plug.button.disable($("#ddns-comexe-login"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"CmxAction": 1,
						"CmxUserName": Base64.encode($("#ddns-comexe-username").val()),
						"CmxPassWord": Base64.encode($("#ddns-comexe-passwd").val()),
						"CmxDomain": Base64.encode($("#ddns-comexe-domain"))
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.button.enable($("#ddns-comexe-login"));
							$("#ddns-comexe-ogin").hide();
							$("#ddns-comexe-ogout").show();
							plug.button.disable($("#ddns-comexe-save"));
							DDns.comexeLoopLoginCount = 0;
							DDns.comexeCtrl.showLoadingStart($("#ddns-comexe-connectstate"), lang.state.connecting);
							DDns.comexeCtrl.stateDetect();
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},

			save: function() {
				plug.button.disable($("#ddns-comexe-save"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"CmxAction": "0",
						"CmxUserName": Base64.encode($("#ddns-comexe-username").val()),
						"CmxPassWord": Base64.encode($("#ddns-comexe-passwd").val()),
						"CmxDomain": Base64.encode($("#ddns-comexe-domain").val())
					},
					success: function(json) {
						plug.button.enable($("#ddns-comexe-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.ddns.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#ddns-comexe-savee"));
					}
				}
				common.setAjax.init(args);
			},

			stateDetect: function() {
				DDns.comexeStateInterval = setInterval(function() {
					var args = {
						url: '/cmx_status.fcgi',
						success: function(json) {
							DDns.comexeLoopLoginCount = DDns.comexeLoopLoginCount + 1;
							if (json.errorCode == 0) {
								if (json.CmxStatus == "Connected") {
									DDns.comexeCtrl.showLoadingEnd($("#ddns-comexe-connectstate"));
									DDns.ddnsConnectState("Connected", "comexe");
									DDns.comexeCtrl.stateInterval = clearInterval(DDns.comexeStateInterval);
								} else if (json.CmxStatus == "Disconnected") {
									DDns.comexeStateInterval = clearInterval(DDns.comexeStateInterval);
									DDns.comexeCtrl.showLoadingEnd($("#ddns-comexe-connectstate"));
									DDns.ddnsConnectState("Disconnected", "comexe");
									$("#ddns-comexe-login").show();
									$("#ddns-comexe-logout").hide();
								} else if (DDns.comexeLoopLoginCount > 20) {
									DDns.comexeCtrl.showLoadingEnd($("#ddns-comexe-connectstate"));
									DDns.comexeStateInterval = clearInterval(DDns.comexeStateInterval);
									plug.button.enable($("#ddns-comexe-save"));
									DDns.ddnsConnectState("Disconnected", "comexe");
									$("#ddns-comexe-logout").click();
								} else if (json.CmxStatus == "Connecting") {
									$("#ddns-comexe-login").hide();
									$("#ddns-comexe-logout").show();
									main.setting.ddns.comexeShowLoadingStart($("#ddns-comexe-connectstate"), lang.state.connecting);
								}
							} else {
								//alert(lang.ajax.ddns.loginFailed);
							}

						},
						error: function(xhr) {

						}
					}
					common.ajax.init(args);
				}, 3000);
			},

			showLoadingStart: function(holder, text) {
				holder.text(text);
				DDns.comexeShowLoadingInterval = clearInterval(DDns.comexeShowLoadingInterval);
				DDns.comexeShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},

			showLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				DDns.comexeShowLoadingInterval = clearInterval(DDns.comexeShowLoadingInterval);
			}
		},

		ddnslogout: function(setArgs) {
			var args = {
				url: '/ddns_set.fcgi',
				data: {
					"CmxAction": setArgs.CmxAction || "-1",
					"DynAction": setArgs.DynAction || "-1",
					"NoipAction": setArgs.NoipAction || "-1"
				},
				success: function(json) {
					if (json.errorCode == 0) {
						if (setArgs.NoipAction) {
							DDns.noipCtrl.showLoadingEnd($("#ddns-noip-connectstate"));
							DDns.noipStateInterval = clearInterval(DDns.noipStateInterval);
							plug.button.enable($("#ddns-noip-save"));
						} else if (setArgs.DynAction) {
							DDns.dyndnsCtrl.showLoadingEnd($("#ddns-dyndns-connectstate"));
							DDns.dyndnsStateInterval = clearInterval(DDns.dyndnsStateInterval);
							plug.button.enable($("#ddns-dyndns-save"));
						} else if (setArgs.CmxAction) {
							DDns.comexeCtrl.showLoadingEnd($("#ddns-comexe-connectstate"));
							DDns.comexeStateInterval = clearInterval(DDns.comexeStateInterval);
							plug.button.enable($("#ddns-comexe-save"));
						}
						DDns.ddnsConnectState("Disconnected", setArgs.types);
					} else {
						plug.window.alert({
							"info": lang.ajax.ddns.logoutFailed
						});
					}
				},
				error: function(xhr) {

				}
			};
			common.setAjax.init(args);
		}
	};

	DDns.init();
})
