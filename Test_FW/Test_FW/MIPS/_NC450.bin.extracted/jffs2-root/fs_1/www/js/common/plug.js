var valid = {
	init: function() {},
	string: function() {},
	email: function(a, b) {
		b = b || {
			holder: "email",
			lengthNull: "enable"
		};
		var c = /^[a-zA-Z0-9]([\.]?[a-zA-Z0-9-_])*@([a-zA-Z0-9]+([-_]?[a-zA-Z0-9])*[\.])+[a-zA-Z][a-zA-Z]+$/;
		return 0 == a.length ? "enable" == b.lengthNull ? {
			pass: !1,
			str: lang.valid[b.holder].empty
		} : {
			pass: !0
		} : a.indexOf("@") <= -1 || a.lastIndexOf(".") - a.indexOf("@") < 2 ? {
			pass: !1,
			str: lang.valid[b.holder].invalid
		} : c.test(a) ? a.length > 32 ? {
			pass: !1,
			str: lang.valid[b.holder].limit
		} : {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid[b.holder].invalid
		}
	},
	emailnotips:function(a, b) {
		b = b || {
			holder: "email",
			lengthNull: "enable"
		};
		var c = /^[a-zA-Z0-9]([\.]?[a-zA-Z0-9-_])*@([a-zA-Z0-9]+([-_]?[a-zA-Z0-9])*[\.])+[a-zA-Z][a-zA-Z]+$/;
		return 0 == a.length ? "enable" == b.lengthNull ? {
			pass: !1,
			//str: lang.valid[b.holder].empty
		} : {
			pass: !0
		} : a.indexOf("@") <= -1 || a.lastIndexOf(".") - a.indexOf("@") < 2 ? {
			pass: !1,
			//str: lang.valid[b.holder].invalid
		} : c.test(a) ? a.length > 32 ? {
			pass: !1,
			//str: lang.valid[b.holder].limit
		} : {
			pass: !0
		} : {
			pass: !1,
			//str: lang.valid[b.holder].invalid
		}
	},
	accountUsername: function(a) {
		var b = /^[0-9A-Za-z-_@.]{1,20}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.accountUsername.empty
		} : a.length > 20 ? {
			pass: !1,
			str: lang.valid.accountUsername.limit
		} : a.length < 1 ? {
			pass: !1,
			str: lang.valid.accountUsername.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.accountUsername.invalid
		}
	},
	cloudUsername: function(a) {
		var b = /^[0-9A-Za-z-_.]{1,32}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.cloudUsername.empty
		} : a.length > 32 ? {
			pass: !1,
			str: lang.valid.cloudUsername.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.cloudUsername.invalid
		}
	},
	ddnsUsername: function(a) {
		var b = /^[0-9A-Za-z-_@.]{1,31}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.ddnsUsername.empty
		} : a.length > 31 ? {
			pass: !1,
			str: lang.valid.ddnsUsername.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.ddnsUsername.invalid
		}
	},
	ftpUsername: function(a) {
		var b = /^[0-9A-Za-z-_@.]{0,32}$/;
		return 0 == a.length ? {
			pass: !0
		} : a.length > 32 ? {
			pass: !1,
			str: lang.valid.ftpUsername.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.ftpUsername.invalid
		}
	},
	pppoeUsername: function(a) {
		var b = /^[a-zA-Z0-9\\!#$%&()*+,-`'".\/:;<=>?@\[\]^_{|}~ ]{0,118}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.pppoeUsername.empty
		} : a.length > 118 ? {
			pass: !1,
			str: lang.valid.pppoeUsername.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.pppoeUsername.invalid
		}
	},
	smtpUsername: function(a) {
		var b = /^[0-9A-Za-z-_@.]{1,63}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.smtpUsername.empty
		} : a.length > 63 ? {
			pass: !1,
			str: lang.valid.smtpUsername.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.smtpUsername.invalid
		}
	},
	confirmpassword: function(a, b) {
		return a != b ? {
			pass: !1,
			str: lang.valid.password.pppoeconfirm
		} : {
			pass: !0
		}
	},
	password: function(a) {
		//var b = /^[a-zA-Z0-9_-~!@#$%^&()=+;\[\].{}]{5,20}$/;
		var b = /^[a-zA-Z0-9!#$&()+,-.;=[\]^_`{}~]{5,20}$/;
		
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.password.empty
		} : a.length > 20 || a.length < 5 ? {
			pass: !1,
			str: lang.valid.password.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.password.invalid
		}
	},
	ftpPath: function(a) {
		var b = /^[a-zA-Z0-9!#$&()+,-.;=[\]^_`{}~\/]*$/;
		
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.path.empty
		} : valid.getValLen(a) > 63 || valid.getValLen(a) < 1 ? {
			pass: !1,
			str: lang.valid.path.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.path.invalid
		}
	},
	ftpPathsubstr:function(a)
	{
		var b = /^[^\.]*([^\.]+.*[^\.]+)*$/ ;
		return b.test(a)? {pass:!0}:{pass:!1,str:lang.valid.path.invalidsub};
	},	
	cloudPassword: function(a) {
		var b = /^[a-zA-Z0-9-_.!@#$%^&*]{6,20}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.cloudPassword.empty
		} : a.length > 20 || a.length < 6 ? {
			pass: !1,
			str: lang.valid.cloudPassword.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.cloudPassword.invalid
		}
	},
	inPassword: function(a) {
		var b = /^[0-9A-Za-z-_.!@#$%^&*]{6,20}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.cloudPassword.empty
		} : a.length > 20 || a.length < 6 ? {
			pass: !1,
			str: lang.valid.cloudPassword.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.cloudPassword.invalid
		}
	},
	ftpPassword: function(a) {
		var b = /^[a-zA-Z0-9!#$&()+,-.;=[\]^_`{}~]*$/;
		if (a.length > 63) {
			return {
				pass: !1,
				str: lang.valid.ftppassword.limit
			}
		} else if (!b.test(a)) {
			return {
				pass: !1,
				str: lang.valid.password.invalid
			}
		} else {
			return {
				pass: !0
			}
		}
	},
	pppoePassword: function(a) {
		var b = /^[a-zA-Z0-9\\!#$%&()*`'"+,-.\/:;<=>?@\[\]^_{|}~ ]{0,118}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.pppoePassword.empty
		} : a.length > 118 ? {
			pass: !1,
			str: lang.valid.pppoePassword.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.pppoePassword.invalid
		}
	},
	ddnspassword: function(a) {
		var b = /^[a-zA-Z0-9_-]{0,31}$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.password.empty
		} : a.length > 31 ? {
			pass: !1,
			str: lang.valid.password.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.password.invalid
		}
	},
	smtpPwd: function(a) {
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.smtpPassword.empty
		} : a.length > 63 ? {
			pass: !1,
			str: lang.valid.smtpPassword.limit
		} : {
			pass: !0
		}
	},
	ip: function(a) {
		var c, d, b = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
		if (0 == a.length) return {
			pass: !1,
			str: lang.valid.ip.empty
		};
		if (!b.test(a)) return {
			pass: !1,
			str: lang.valid.ip.limit
		};
		for (c = a.split("."), d = 0; d < c.length; d++) if (c[d] < 0 || c[d] > 255) return {
			pass: !1,
			str: lang.valid.ip.limit
		};
		return 127 == c[0] && 0 == c[1] && 0 == c[2] ? {
			pass: !1,
			str: lang.valid.ip.loopback
		} : c[0] >= 224 && c[0] <= 239 ? {
			pass: !1,
			str: lang.valid.ip.multicast
		} : {
			pass: !0
		}
	},
	gw: function(a) {
		var c, d, b = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
		if (0 == a.length) return {
			pass: !0
		};
		if (!b.test(a)) return {
			pass: !1,
			str: lang.valid.gw.limit
		};
		for (c = a.split("."), d = 0; d < c.length; d++) if (c[d] < 0 || c[d] > 255) return {
			pass: !1,
			str: lang.valid.gw.limit
		};
		return 127 == c[0] && 0 == c[1] && 0 == c[2] ? {
			pass: !1,
			str: lang.valid.gw.loopback
		} : c[0] >= 224 && c[0] <= 239 ? {
			pass: !1,
			str: lang.valid.gw.multicast
		} : {
			pass: !0
		}
	},
	dnsCompare: function(a, b) {
		return a != b ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.dnsDiffs
		}
	},
	dns: function(a) {
		var c, d, b = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
		if (0 == a.length) return {
			pass: !0
		};
		if (!b.test(a)) return {
			pass: !1,
			str: lang.valid.dns.limit
		};
		for (c = a.split("."), d = 0; d < c.length; d++) if (c[d] < 0 || c[d] > 255) return {
			pass: !1,
			str: lang.valid.dns.limit
		};
		return 127 == c[0] && 0 == c[1] && 0 == c[2] ? {
			pass: !1,
			str: lang.valid.dns.loopback
		} : c[0] >= 224 && c[0] <= 239 ? {
			pass: !1,
			str: lang.valid.dns.multicast
		} : {
			pass: !0
		}
	},
	mask: function(a) {
		var c, d, e, f, g, b = /^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$/;
		if (0 == a.length) return {
			pass: !1,
			str: lang.valid.mask.invalid
		};
		if (!b.test(a)) return {
			pass: !1,
			str: lang.valid.mask.invalid
		};
		for (c = a.split("."), d = 0; d < c.length; d++) if (c[d] < 0 || c[d] > 255) return {
			pass: !1,
			str: lang.valid.mask.invalid
		};
		if (e = !1, f = parseInt(parseInt(parseInt(c[0]) << 24) + parseInt(parseInt(c[1]) << 16) + parseInt(parseInt(c[2]) << 8) + parseInt(c[3])), f == parseInt(0)) return {
			pass: !1,
			str: lang.valid.mask.invalid
		};
		if (f == parseInt(-1)) return {
			pass: !1,
			str: lang.valid.mask.invalid
		};
		for (d = 0; 32 > d; ++d) if (g = 1 << 31 - d, parseInt(f & g) == parseInt(0)) e = !0;
		else if (1 == e) return {
			pass: !1,
			str: lang.valid.mask.invalid
		};
		return {
			pass: !0
		}
	},
	domainAndIp: function(a) {
		var e, f, c = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
			d = /^([A-Za-z0-9][A-Za-z0-9-]+\.)+([A-Za-z]{2,4})$/;
		if (0 == a.length) return {
			pass: !1,
			str: lang.valid.service.empty
		};
		if (d.test(a)) return {
			pass: !0
		};
		if (c.test(a)) {
			for (e = a.split("."), f = 0; f < e.length; f++) if (e[f] < 0 || e[f] > 255) return {
				pass: !1,
				str: lang.valid.ip.limit
			};
			return 127 == e[0] && 0 == e[1] && 0 == e[2] ? {
				pass: !1,
				str: lang.valid.ip.loopback
			} : e[0] >= 224 && e[0] <= 239 ? {
				pass: !1,
				str: lang.valid.ip.multicast
			} : {
				pass: !0
			}
		}
		return {
			pass: !1,
			str: lang.valid.service.invalid
		}
	},
	domain: function(a) {
		var b = /^([A-Za-z0-9][A-Za-z0-9-]+\.)+([A-Za-z]{2,4})$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.domain.empty
		} : a.length > 63 ? {
			pass: !1,
			str: lang.valid.domain.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.domain.invalid
		}
	},
	port: function(a, b) {
		b || (b = {
			max: 65535,
			min: 1
		}), b.max = b.max || 65535, b.min = b.min || 1;
		var c = /^[0-9]+$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.port.empty
		} : c.test(a) ? parseInt(a) < b.min || parseInt(a) > b.max ? {
			pass: !1,
			str: lang.valid.port.invalid
		} : {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.port.invalid
		}
	},
	ftpPort: function(a, b) {
		b || (b = {
			max: 65535,
			min: 1
		}), b.max = b.max || 65535, b.min = b.min || 1;
		var c = /^[0-9]+$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.ftpport.empty
		} : c.test(a) ? parseInt(a) < b.min || parseInt(a) > b.max ? {
			pass: !1,
			str: lang.valid.ftpport.invalid
		} : {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.ftpport.invalid
		}
	},
	smtpPort: function(a, b) {
		b || (b = {
			max: 65535,
			min: 1
		}), b.max = b.max || 65535, b.min = b.min || 1;
		var c = /^[0-9]+$/;
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.smtpport.empty
		} : c.test(a) ? parseInt(a) < b.min || parseInt(a) > b.max ? {
			pass: !1,
			str: lang.valid.smtpport.invalid
		} : {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.smtpport.invalid
		}
	},
	mac: function(a) {
		var e, f, b = /^\s*([A-Fa-f0-9]{2}\-){5}[A-Fa-f0-9]{2}\s*$/,
			c = /^\s*[0-9A-Fa-f]{1}[13579bdfBDF]{1}(\-[A-Fa-f0-9]{2}){5}\s*$/,
			d = /^\s*(((FF)|(ff))\-){5}((FF)|(ff)){1}\s*$/;
		return f = "undefined" == typeof arguments[1] || 1 == arguments[1] ? !0 : !1, 0 == a.length ? {
			pass: !1,
			str: lang.valid.mac.empty
		} : (e = b.test(a)) ? (e = d.test(a)) ? {
			pass: !1,
			str: lang.valid.mac.invalid
		} : (e = c.test(a), e ? {
			pass: !1,
			str: lang.valid.mac.invalid
		} : {
			pass: !0
		}) : {
			pass: !1,
			str: lang.valid.mac.invalid
		}
	},
	timeOffset: function(a, b, c) {
		var d = valid.num(a, b, c);
		switch (d) {
			case "empty":
				return {
					pass: !1,
					str: lang.valid.timeoffset.empty
				};
			case "invalid":
				return {
					pass: !1,
					str: lang.valid.timeoffset.invalid
				};
			case "greater":
				return {
					pass: !1,
					str: lang.valid.timeoffset.max
				};
			case "less":
				return {
					pass: !1,
					str: lang.valid.timeoffset.min
				};
			case !0:
				return {
					pass: !0
				};
			default:
				return {
					pass: !1,
					str: lang.valid.timeoffset.invalid
				}
		}
	},
	num: function(a, b, c) {
		var d;
		return b = b || 65535, c = c || 0, d = /^(\+)?[0-9]+$/, 0 == a.length ? "empty" : d.test(a) ? a > b ? "greater" : c > a ? "less" : !0 : "invalid"
	},
	ftp: function(a) {
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.ftp.empty
		} : a.length > 32 ? {
			pass: !1,
			str: lang.valid.ftp.invalid
		} : {
			pass: !0
		}
	},
	cameraname: function(a) {
		//var b = /^(([a-zA-Z0-9\.\-\_\'\@]\ ?)*([a-zA-Z0-9\.\-\_\'\@])){1,30}$/;
		var b = /^[^\x00-\x1F\x7F{}<>'"=:&\x2f\x5c]*$/;
		var maxLength = 31;
		for (var i = 0; i < a.length; i++) {
			var charCode = a.charCodeAt(i);
			if (charCode >= 0xD800 && charCode <= 0xDBFF) {
				i++;
				maxLength++;
			}
		}
		return 0 == a.length ? {
			pass: !1,
			str: lang.valid.cameraname.empty
		} : a.length > maxLength ? {
			pass: !1,
			str: lang.valid.cameraname.limit
		} : b.test(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.cameraname.invalid
		}
	},
	path: function(a) {
		var b = Number(valid.getValLen(a));
		return b > 63 ? {
			pass: !1,
			str: lang.valid.path.limit
		} : 0 == b ? {
			pass: !1,
			str: lang.valid.path.limit
		} : {
			pass: !0
		}
	},
	wpaWpa2Psk: function(a) {
		var b = valid.getValLen(a);
		return 8 > b ? {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.limit
		} : b > 64 ? {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.limit
		} : 64 == b ? 0 == valid.hex(a) ? {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.error
		} : {
			pass: !0
		} : 1 == valid.asc2(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.error
		}
	},
	inWpaWpa2Psk: function(a) {
		var b = valid.getValLen(a);
		return 8 > b ? {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.inerror
		} : b > 64 ? {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.inerror
		} : 64 == b ? 0 == valid.hex(a) ? {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.inerror
		} : {
			pass: !0
		} : 1 == valid.asc2(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.wpaWpa2Psk.inerror
		}
	},
	osdtext: function(a, b, c) {
		var d = valid.getValLen(a);
		return b = b || 65535, c = c || 0, d > b ? {
			pass: !1,
			str: lang.valid.osdtext.limit
		} : c > d ? {
			pass: !1,
			str: lang.valid.osdtext.limit
		} : {
			pass: !0
		}
	},
	ssid: function(a) {
		var b = valid.getValLen(a);
		return b >= 1 && 32 >= b ? valid.asc2(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.ssid.asc2limit
		} : {
			pass: !1,
			str: lang.valid.ssid.asc2limit
		}
	},
	wepkey: function(a) {
		var b = valid.getValLen(a);
		return 5 == b || 13 == b ? valid.asc2(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.wepkey.limit
		} : 10 == b || 26 == b ? valid.hex(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.wepkey.limit
		} : {
			pass: !1,
			str: lang.valid.wepkey.limit
		}
	},
	inWepkey: function(a) {
		var b = valid.getValLen(a);
		return 5 == b || 13 == b ? valid.asc2(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.wepkey.inerror
		} : 10 == b || 26 == b ? valid.hex(a) ? {
			pass: !0
		} : {
			pass: !1,
			str: lang.valid.wepkey.inerror
		} : {
			pass: !1,
			str: lang.valid.wepkey.inerror
		}
	},
	getValLen: function(a) {
		var d, b = 0,
			c = 0;
		for (c = 0; c < a.length; c++) 
			d = a.charAt(c), b += d >= " " && "~" >= d ? 1 : 2;
		return b
	},
	asc2: function(a) {
		var c, b = "0123456789ABCDEFabcdefGHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz`~!@#$%^&*()-=_+[]{};:'\"\\|/?.,<>/ ";
		for (c = 0; c < a.length; c++) if (-1 == b.indexOf(a.charAt(c))) return !1;
		return !0
	},
	hex: function(a) {
		var c, b = "0123456789ABCDEFabcdef";
		for (c = 0; c < a.length; c++) if (-1 == b.indexOf(a.charAt(c))) return !1;
		return !0
	}
};

var sevenTables = {
	holder: null,
	row: null,
	data: null,
	jsonOption: null,
	column: null,
	title: null,
	checkbox: null,
	allowAdjustColWidth: null,
	holderName: null,
	mouseSelect: null,
	selectedTaskId: [],
	selectedPreDivId: null,
	tablesNums: null,
	enabledEdit: null,
	privateTables: null,
	toolbarSelectAjax: null,
	ajaxResponse: null,
	ajaxXhr: null,
	toolBar: null,
	paginationNum: null,
	init: function(a) {
		"null" == sevenTables.tablesNums ? 1 : sevenTables.tablesNums++, null == sevenTables.privateTables ? sevenTables.privateTables = {} : sevenTables.privateTables, sevenTables.privateTables["table" + sevenTables.tablesNums] = a, sevenTables.eval(), sevenTables.launch()
	},
	reinit: function(a, b) {
		sevenTables.tablesNums = b, sevenTables.privateTables["table" + sevenTables.tablesNums].data.json = a, sevenTables.eval(), sevenTables.launch()
	},
	eval: function() {
		sevenTables.holder = sevenTables.privateTables["table" + sevenTables.tablesNums].holder || "body", sevenTables.holderName = sevenTables.holder.substring(1), sevenTables.privateTables["table" + sevenTables.tablesNums].data = sevenTables.optimize.delJsonComma(sevenTables.privateTables["table" + sevenTables.tablesNums].data), sevenTables.data = sevenTables.privateTables["table" + sevenTables.tablesNums].data || null, sevenTables.row = sevenTables.privateTables["table" + sevenTables.tablesNums].data.json.length || 1, sevenTables.background = sevenTables.privateTables["table" + sevenTables.tablesNums].background || "none", sevenTables.column = sevenTables.privateTables["table" + sevenTables.tablesNums].column || {
			count: 3,
			width: []
		}, sevenTables.tr = sevenTables.privateTables["table" + sevenTables.tablesNums].tr || {
			color: ["#FFFFFF", "#F7F7F7"]
		}, sevenTables.emptytips = sevenTables.privateTables["table" + sevenTables.tablesNums].emptytips || "SORRY,THE REQUEST DOES NOT RESPONSE", sevenTables.jsonOption = sevenTables.privateTables["table" + sevenTables.tablesNums].data.option || !1, sevenTables.toolBar = sevenTables.privateTables["table" + sevenTables.tablesNums].toolBar || !1, sevenTables.title = sevenTables.privateTables["table" + sevenTables.tablesNums].title || sevenTables.functionsLogic.columnArray(), sevenTables.checkbox = sevenTables.privateTables["table" + sevenTables.tablesNums].checkbox || !1, sevenTables.allowAdjustColWidth = sevenTables.privateTables["table" + sevenTables.tablesNums].allowAdjustColWidth || !1, sevenTables.mouseSelect = sevenTables.privateTables["table" + sevenTables.tablesNums].mouseSelect || !1, sevenTables.scrollCtrl = sevenTables.privateTables["table" + sevenTables.tablesNums].scrollCtrl || !1, sevenTables.enabledEdit = sevenTables.privateTables["table" + sevenTables.tablesNums].enabledEdit || !1
	},
	optimize: {
		delJsonComma: function(a) {
			var b = sevenTables.optimize.stringify(a);
			return b = b.replace(/},null]/, "}]"), b = b.replace(/},]/, "}]"), a = jQuery.parseJSON(b)
		},
		stringify: function(a) {
			var b = function(a) {
				return "[object Array]" == Object.prototype.toString.call(a)
			}, c = function(a) {
				var f, e = "";
				for (f in a) switch (typeof a[f]) {
					case "string":
						e += '"' + f + '":"' + a[f] + '",';
						break;
					case "number":
					case "boolean":
						e += '"' + f + '":' + a[f] + ",";
						break;
					default:
						e += b(a[f]) ? '"' + f + '":[' + d(a[f]) + "]," : '"' + f + '":{' + c(a[f]) + "},"
				}
				return e = e.replace(/,$/g, "")
			}, d = function(a) {
				var f, e = "";
				for (f in a) switch (typeof a[f]) {
					case "string":
						e += '"' + a[f] + '",';
						break;
					case "number":
					case "boolean":
						e += a[f] + ",";
						break;
					default:
						e += b(a[f]) ? "[" + d(a[f]) + "]," : "{" + c(a[f]) + "},"
				}
				return e = e.replace(/,$/g, "")
			};
			return b(a) ? "[" + d(a) + "]" : "{" + c(a) + "}"
		},
		inherit: function(a) {
			function c() {}
			if (null == a) throw TypeError();
			if (Object.create) return Object.create(a);
			var b = typeof a;
			if ("object" !== b && "function" !== b) throw TypeError();
			return c.prototype = a, new c
		}
	},
	launch: function() {
		var b, a = "";
		for (a += "<div class='sevenTablesholder' id='sevenTables-" + sevenTables.holderName + "'>", a += "<div class='sevenTablesholder-contain sevenTables-" + sevenTables.holderName + "-contain'>", a += "<div class='sevenTables-datagrid sevenTables-" + sevenTables.holderName + "-datagrid'>", a += "<div class='datagrid-header'>", a += "<div class='datagrid-header-inner'>", a += "<table class='datagrid-htable  sevenTables-head-num-" + sevenTables.tablesNums + " ' cellspacing='0' cellpadding='0' border='0' style='height: 25px;'>", a += "<tbody>", a += "<tr class='datagrid-header-row'>", a += sevenTables.functionsLogic.tableHead(), a += "</tr>", a += "</tbody>", a += "</table>", a += "</div>", a += "</div>", a += "<div class='datagrid-body' >", a += "<table id='seventables-nums-" + sevenTables.tablesNums + "'class='datagrid-btable sevenTables-body-num-" + sevenTables.tablesNums + " ' cellspacing='0' cellpadding='0' border='0' >", a += "<tbody class='seventables-body-tbody seventables-body-tbody-num-" + sevenTables.tablesNums + "' id='num-" + sevenTables.tablesNums + "-sevenTables-tbody'>", b = 0; b < sevenTables.row; b++) a += "<tr class='sevenTables-tbody-datagrid-row sevenTables-num-" + sevenTables.tablesNums + "-tbody-datagrid-row' id='" + sevenTables.holderName + "-table-row-" + b + "'>", a += sevenTables.functionsLogic.tableBody(b), a += "</tr>";
		a += "</tbody>", a += "</table>", a += "</div>", a += "</div>", a += "</div>", a += "</div>", $(sevenTables.holder).append(a), sevenTables.bind(), $(".sevenTables-noresponse-td").click(function() {
			return !1
		})
	},
	refreshTbody: function() {
		var a, b, c;
		for (sevenTables.eval(), a = " ", b = 0; b < sevenTables.row; b++) a += "<tr class='sevenTables-tbody-datagrid-row sevenTables-num-" + sevenTables.tablesNums + "-tbody-datagrid-row' id='" + sevenTables.holderName + "-table-row-" + b + "'>", a += sevenTables.functionsLogic.tableBody(b), a += "</tr>";
		c = $(".seventables-body-tbody-num-" + sevenTables.tablesNums), c.append(a), sevenTables.rebind()
	},
	functionsLogic: {
		init: function() {
			sevenTables.functionsLogic.tableColumnWidth(), sevenTables.functionsLogic.tableBackgound(), sevenTables.functionsLogic.tableColumnColor(), sevenTables.functionsLogic.tableColumnDisplay()
		},
		tableHead: function() {
			var b, a = "";
			if (1 == sevenTables.checkbox.enable) for (a += "<td class='datagrid-check' >", a += "<div class='datagrid-check-cell  datagrid-header-cell " + sevenTables.holderName + "-sevenTables-title-checkbox' >", a += "<div class='datagrid-checkall-click-img'></div>", a += "<input class='datagrid-checkall-click' type='checkbox'>", a += "</div>", a += "</td>", b = 0; b < sevenTables.column.count; b++) a += "<td class='" + sevenTables.holderName + "-datagrid-header-td-" + b + "'>", a += "<div class='datagrid-cell datagrid-header-cell " + sevenTables.holderName + "-sevenTables-title-" + b + "'>", a += "<span class='datagrid-title-main'>" + sevenTables.title[b] + "</span>", a += "<span class='datagrid-sort-icon'> </span>", a += "</div>", a += "</td>";
			else for (b = 0; b < sevenTables.column.count; b++) a += "<td class='" + sevenTables.holderName + "-datagrid-header-td-" + b + "'>", a += "<div class='datagrid-cell datagrid-header-cell " + sevenTables.holderName + "-sevenTables-title-" + b + "' >", a += "<span class='datagrid-title-main'>" + sevenTables.title[b] + "</span>", a += "<span class='datagrid-sort-icon'> </span>", a += "</div>", a += "</td>";
			return a
		},
		tableBody: function(tablerow) {
			var tablecolumn, a = "",
				tableVal = sevenTables.data.json[tablerow];
			if (tableVal) if (1 == sevenTables.checkbox.enable) for (a += "<td class='datagrid-check " + sevenTables.holderName + "-table-column-checkbox' >", a += "<div class='datagrid-check-cell '>", a += "<div class='datagrid-click-img'></div>", a += "<input class='" + sevenTables.holderName + "-check-cell datagrid-click-input checkon" + tablerow + "' type='checkbox'>", a += "</div>", a += "</td>", tablecolumn = 0; tablecolumn < sevenTables.column.count; tablecolumn++) a += "<td class='" + sevenTables.holderName + "-column-" + tablecolumn + "' >", a += "<div class='datagrid-cell datagrid-cell-show'>" + eval("(sevenTables.data.json[" + tablerow + "]." + sevenTables.jsonOption[tablecolumn] + ")") + "</div>", a += "</td>";
			else for (tablecolumn = 0; tablecolumn < sevenTables.column.count; tablecolumn++) a += "<td class='" + sevenTables.holderName + "-column-" + tablecolumn + "' >", a += "<div class='datagrid-cell datagrid-cell-show'>" + eval("(sevenTables.data.json[" + tablerow + "]." + sevenTables.jsonOption[tablecolumn] + ")") + "</div>", a += "</td>";
			else a += "<td class='" + sevenTables.holderName + "-column-0 sevenTables-noresponse-td' >", a += "<div class='tips-cell  sevenTables-noresponse datagrid-cell-show'>" + sevenTables.emptytips + "</div>", a += "</td>";
			return a
		},
		tableBackgound: function() {
			$(".sevenTables-datagrid").css({
				background: sevenTables.background
			})
		},
		tableColumnColor: function() {
			var a = "#seventables-nums-" + sevenTables.tablesNums + " tr:even",
				b = "#seventables-nums-" + sevenTables.tablesNums + " tr:odd";
			$(a).css("background", sevenTables.tr.color[0]), $(b).css("background", sevenTables.tr.color[1])
		},
		tableColumnDisplay: function() {
			var b, a = sevenTables.column.display;
			if (a) for (b = 0; b <= a.length; b++) "none" == a[b] && ($("." + sevenTables.holderName + "-column-" + b).css("display", "none"), $("." + sevenTables.holderName + "-datagrid-header-td-" + b).css("display", "none"))
		},
		tableColumnWidth: function() {
			var a, b, c;
			if (1 == sevenTables.checkbox.enable) for (a = 0; a <= sevenTables.column.count; a++) b = $("." + sevenTables.holderName + "-sevenTables-title-" + a), c = $("." + sevenTables.holderName + "-column-" + a + " div"), b.css("width", null == sevenTables.column.width[a] ? b.width() : sevenTables.column.width[a]), c.css("width", null == sevenTables.column.width[a] ? c.width() : sevenTables.column.width[a]);
			else for (a = 0; a <= sevenTables.column.count; a++) b = $("." + sevenTables.holderName + "-sevenTables-title-" + a), c = $("." + sevenTables.holderName + "-column-" + a + " div"), b.css("width", null == sevenTables.column.width[a] ? b.width() : sevenTables.column.width[a]), c.css("width", null == sevenTables.column.width[a] ? c.width() : sevenTables.column.width[a])
		}
	},
	bind: function() {
		1 == sevenTables.mouseSelect ? sevenTables.tableSelect() : !1, 1 == sevenTables.allowAdjustColWidth.enable ? sevenTables.columnsChangeable() : !1, 1 == sevenTables.checkbox.enable ? sevenTables.checkall() : !1, 1 == sevenTables.enabledEdit.enable ? sevenTables.editTables.init() : !1, sevenTables.functionsLogic.init(), 1 == sevenTables.toolBar.enable ? sevenTables.toolBars.init() : !1, 1 == sevenTables.scrollCtrl.enable ? sevenTables.scrollChange() : !1
	},
	rebind: function() {
		1 == sevenTables.mouseSelect ? sevenTables.tableSelect() : !1, 1 == sevenTables.enabledEdit.enable ? sevenTables.editTables.init() : !1, sevenTables.functionsLogic.init(), 1 == sevenTables.detection(sevenTables.toolBar.pagination) ? sevenTables.toolBars.pagination.reinit() : !1
	},
	columnsChangeable: function() {
		var d, e, f, a = sevenTables.allowAdjustColWidth.column || sevenTables.lengthToArray($(".sevenTables-head-num-" + sevenTables.tablesNums + " .datagrid-header-cell").length),
			b = sevenTables.allowAdjustColWidth.minWidth || 50,
			c = sevenTables.allowAdjustColWidth.maxWidth || 300;
		for (d = 0; d < a.length; d++) e = "." + sevenTables.holderName + "-sevenTables-title-" + a[d], f = "." + sevenTables.holderName + "-column-" + a[d] + " .datagrid-cell", $(e).resizable({
			handles: "e",
			minWidth: b,
			maxWidth: c,
			alsoResize: f,
			resize: function() {
				$(".datagrid-edit-input").css("width", $(this).width() - 10)
			}
		})
	},
	lengthToArray: function(a) {
		var c, b = [];
		for (c = 1; a >= c; c++) b.push(c);
		return b
	},
	checkall: function() {
		$(".sevenTables-head-num-" + sevenTables.tablesNums + " .datagrid-checkall-click-img").click(function() {
			$(this).siblings(".datagrid-checkall-click").attr("checked") ? ($(this).siblings(".datagrid-checkall-click").attr("checked", !1), $(this).parents(".datagrid-header").siblings(".datagrid-body").find(".datagrid-click-input").each(function() {
				$(this).attr("checked", !1), $(this).parents(".sevenTables-tbody-datagrid-row").removeClass("sevenTables-selected")
			})) : ($(this).siblings(".datagrid-checkall-click").attr("checked", !0), $(this).parents(".datagrid-header").siblings(".datagrid-body").find(".datagrid-click-input").each(function() {
				$(this).attr("checked", !0), $(this).parents(".sevenTables-tbody-datagrid-row").addClass("sevenTables-selected")
			}))
		}).css({
			width: $(".datagrid-check").width(),
			height: $(".datagrid-check").height()
		}), $(".sevenTables-body-num-" + sevenTables.tablesNums + " .datagrid-click-img").click(function() {
			$(this).siblings(".datagrid-click-input").attr("checked") ? ($(this).siblings(".datagrid-click-input").attr("checked", !1), $(this).parents(".sevenTables-tbody-datagrid-row").removeClass("sevenTables-selected")) : ($(this).siblings(".datagrid-click-input").attr("checked", !0), $(this).parents(".sevenTables-tbody-datagrid-row").addClass("sevenTables-selected"))
		}).css({
			width: $(".datagrid-check").width(),
			height: $(".datagrid-check").height()
		})
	},
	deleteSubject: function(a, b) {
		$(a + " .sevenTables-selected").each(function() {
			$(this).remove()
		}), null == b ? !1 : sevenTables.ajax.init(b)
	},
	scrollChange: function() {
		sevenTables.row > 10 && ($(".sevenTables-" + sevenTables.holderName + "-datagrid .datagrid-body").css({
			overflow: "auto",
			height: sevenTables.scrollCtrl.height
		}), $(sevenTables.holder).width($(sevenTables.holder).width() + 18), $("." + sevenTables.holderName + "-sevenTables-title-" + sevenTables.scrollCtrl.headerTdNum).css({
			width: $("." + sevenTables.holderName + "-sevenTables-title-" + sevenTables.scrollCtrl.headerTdNum).width() + 17
		}))
	},
	tableSelect: function() {
		$(".datagrid-btable").click(function(a) {
			a.stopPropagation()
		}), $(".datagrid-htable").click(function(a) {
			a.stopPropagation()
		}), $("body").click(function() {
			$(".sevenTables-tbody-datagrid-row").removeClass("sevenTables-selected"), sevenTables.selectedTaskId = [], $(".sevenTablesholder :checkbox").attr("checked", !1)
		}), $(".seventables-body-tbody-num-" + sevenTables.tablesNums).selectable({
			start: function(a) {
				sevenTables.selectedTaskId = [], a.ctrlKey ? $(this).attr("id") != sevenTables.selectedPreDivId && ($(".sevenTables-selected").removeClass("sevenTables-selected"), $(".sevenTablesholder :checkbox").attr("checked", !1)) : ($(".sevenTables-selected").removeClass("sevenTables-selected"), $(".sevenTablesholder :checkbox").attr("checked", !1))
			},
			stop: function() {
				sevenTables.selectedPreDivId = $(this).attr("id");
				var c = $("#select-result").empty();
				$(".sevenTables-selected", this).each(function() {
					var a = $(this).attr("id").split("row-")[1];
					c.append(" #" + a), sevenTables.selectedTaskId.push(a)
				})
			},
			filter: "tr:visible",
			cancel: ".datagrid-check,.datagrid-edit-input",
			selecting: function(a, b) {
				$(b.selecting).addClass("sevenTables-selecting"), a.ctrlKey ? $(".sevenTablesholder :checkbox").attr("checked", !1) : $(b.selecting).find(".datagrid-click-input").attr("checked", !0)
			},
			selected: function(a, b) {
				$(b.selected).hasClass("sevenTables-selected") ? $(b.selected).removeClass("sevenTables-selected sevenTables-selecting") : $(b.selected).removeClass("sevenTables-selecting").addClass("sevenTables-selected")
			},
			unselecting: function(a, b) {
				$(b.unselecting).removeClass("sevenTables-selecting"), $(b.unselecting).find(".datagrid-click-input").attr("checked", !1)
			}
		})
	},
	ajax: {
		init: function(a) {
			var b = a.url,
				c = a.type || "post",
				d = a.dataType || "text",
				e = a.data,
				f = a.cache || !1,
				g = a.contentType || "application/x-www-form-urlencoded;charset=utf-8",
				h = a.timeout || 0,
				i = a.global || !1,
				j = a.async || !1,
				k = a.beforeSend || function() {}, l = a.success || function() {}, m = a.error || function() {}, n = a.complete || function() {};
			$.ajax({
				url: b,
				type: c,
				dataType: d,
				data: e,
				cache: f,
				contentType: g,
				timeout: h,
				async: j,
				global: i,
				beforeSend: function() {
					k()
				},
				success: function(a) {
					l(a)
				},
				complete: function(a) {
					n(a)
				},
				error: function(a) {
					m(a)
				}
			})
		}
	},
	tableShade: function(a) {
		var b = "";
		b += "<div id='seventables-shade'>", b += "</div>", a.append(b)
	},
	editTables: {
		init: function() {
			sevenTables.editTables.launch()
		},
		launch: function() {
			var b, a = "";
			for (a += "<input type='text' class='datagrid-edit-input' />", b = 0; b < sevenTables.enabledEdit.column.length; b++) $("." + sevenTables.holderName + "-column-" + sevenTables.enabledEdit.column[b]).addClass("enableEdit").append(a);
			sevenTables.editTables.bind()
		},
		bind: function() {
			$(".datagrid-edit-input").click(function(a) {
				a.stopPropagation()
			}), $(".sevenTables-" + sevenTables.holderName + " .enableEdit").dblclick(function() {
				sevenTables.editTables.showEditInput($(this))
			})
		},
		showEditInput: function(a) {
			a.find(".datagrid-cell-show").hide(), a.find(".datagrid-edit-input").val(a.find(".datagrid-cell-show").html()), a.find(".datagrid-edit-input").show().focus().select(), a.find(".datagrid-edit-input").one("blur", function() {
				sevenTables.editTables.hideEditInput($(this))
			}), sevenTables.tableShade(a.parents(".datagrid-btable")), $(".datagrid-edit-input").blur(function() {
				$("#seventables-shade").remove()
			}), $("#seventables-shade").one("click", function() {
				$(this).remove(), $(".datagrid-edit-input").blur()
			})
		},
		hideEditInput: function(a) {
			a.siblings(".datagrid-cell-show").show(), a.hide(), " " == a.val() ? !1 : a.siblings(".datagrid-cell-show").html(a.val()), sevenTables.ajax.init(sevenTables.privateTables["table" + a.parents(".datagrid-btable").attr("id").split("nums-")[1]].enabledEdit.ajax)
		}
	},
	toolBars: {
		init: function() {
			sevenTables.toolBars.launch(), sevenTables.toolBars.bind(), 1 == sevenTables.detection(sevenTables.toolBar.changecontain) ? sevenTables.toolBars.changeContain.init() : !1, 1 == sevenTables.detection(sevenTables.toolBar.pagination) ? sevenTables.toolBars.pagination.init() : !1
		},
		launch: function() {
			var b, a = "";
			a += "<div id='sevenTables-" + sevenTables.tablesNums + "-toolbar' class='sevenTables-toolbar'>", a += "</div>", b = ".sevenTables-" + sevenTables.holderName + "-datagrid", $(b).append(a)
		},
		bind: function() {
			sevenTables.toolBars.changeContain.bind()
		},
		ajax: function(a, b) {
			var c = a.error,
				d = a.success;
			sevenTables.loading(), a.success = function(a) {
				b = b.parents(".sevenTables-toolbar").siblings(".datagrid-body").find(".datagrid-btable");
				var c = b.attr("id").split("seventables-nums-")[1];
				sevenTables.loadingOver(c), d(a, b)
			}, a.error = function(a) {
				c(a)
			}, sevenTables.ajax.init(a)
		},
		changeContain: {
			init: function() {
				sevenTables.toolBars.changeContain.launch(), sevenTables.toolBars.changeContain.bind(), sevenTables.toolBars.changeContain.width()
			},
			launch: function() {
				var b, c, d, a = "";
				for (b = 0; b < sevenTables.toolBar.changecontain.select.length; b++) {
					for (a += "<div class='sevenTables-toolbar-cell'>", a += "<div class='sevenTables-toolbar-changeContain'>", a += "<div class='sevenTables-toolbar-changecontain-cell sevenTables-toolbar-changecontain-title sevenTables-toolsbar-cell'>", a += sevenTables.toolBar.changecontain.select[b].title + ":", a += "</div>", a += "<div class='sevenTables-toolbar-changecontain-cell sevenTables-toolsbar-cell'>", a += "<select class='sevenTables-tablesnum-changecontain-selectnum-" + b + " sevenTables-changecontain-tablenum-" + sevenTables.tablesNums + "-selectnum-" + b + " sevenTables-changecontain-num-" + sevenTables.tablesNums + "'>", c = 0; c < sevenTables.toolBar.changecontain.select[b].option.length; c++) a += sevenTables.toolBar.changecontain.select[b].value ? "<option value='" + sevenTables.toolBar.changecontain.select[b].value[c] + "'>" : "<option value='" + sevenTables.toolBar.changecontain.select[b].option[c] + "'>", a += sevenTables.toolBar.changecontain.select[b].option[c], a += "</option>";
					a += "</select>", a += "</div>", a += "</div>", a += "</div>"
				}
				d = "#sevenTables-" + sevenTables.tablesNums + "-toolbar", $(d).append(a)
			},
			width: function() {
				for (var a = 0; a < sevenTables.toolBar.changecontain.select.length; a++) sevenTables.toolBar.changecontain.select[a].width ? $(".sevenTables-changecontain-tablenum-" + sevenTables.tablesNums + "-selectnum-" + a).width(sevenTables.toolBar.changecontain.select[a].width) : null
			},
			bind: function() {
				$(".sevenTables-changecontain-num-" + sevenTables.tablesNums).change(function() {
					var selectdata, obj, transobj, stringobj, p, objKey, objKeyVal, tablenum = $(this).attr("class").split("sevenTables-changecontain-num-")[1],
						selectnum = $(this).attr("class").split("changecontain-selectnum-")[1].split(" ")[0];
					sevenTables.tablesNums = tablenum, selectdata = [], $(this).parents(".sevenTables-toolbar").find(".sevenTables-toolbar-cell .sevenTables-toolbar-changeContain select").each(function() {
						selectdata.push($(this).val())
					}), obj = sevenTables.optimize.inherit(sevenTables.privateTables["table" + sevenTables.tablesNums].toolBar.changecontain.ajax.data), transobj = sevenTables.optimize.inherit(sevenTables.privateTables["table" + sevenTables.tablesNums].toolBar.changecontain.ajax), stringobj = "obj.";
					for (p in obj) objKey = stringobj + p, objKeyVal = eval("(" + objKey + ")"), "first" == objKeyVal ? obj[p] = selectdata[0] : "second" == objKeyVal ? obj[p] = selectdata[1] : "third" == objKeyVal && (obj[p] = selectdata[2]);
					transobj.data = obj, sevenTables.toolBars.ajax(transobj, $(this))
				})
			}
		},
		pagination: {
			init: function() {
				var a;
				sevenTables.toolBars.pagination.launch(), a = 1 == sevenTables.detection(sevenTables.toolBar.pagination.paginationPageList) ? sevenTables.toolBars.pagination.paginationPageList() : sevenTables.toolBar.pagination.paginationCount, sevenTables.toolBars.pagination.initPagin(a), sevenTables.toolBars.pagination.bind()
			},
			reinit: function() {
				paginationNum = 1 == sevenTables.detection(sevenTables.toolBar.pagination.paginationPageList) ? $("#sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-pagelist select").val() : sevenTables.toolBar.pagination.paginationCount, sevenTables.toolBars.pagination.initPagin(paginationNum)
			},
			launch: function() {
				var b, a = "";
				a += "<div class='sevenTables-toolbar-cell'>", a += "<div class='sevenTables-toolbar-pagination'>", a += "<div class='sevenTables-toolbar-pagination-cell sevenTables-pagination-icon-separator-left'>", a += "<div class='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-fristpage sevenTables-pagination-icon'>", a += "<span class='sevenTables-pagination-icon-inner sevenTables-pagination-icon-fristpage'>", a += "</span>", a += "</div>", a += "</div>", a += "<div class='sevenTables-toolbar-pagination-cell'>", a += "<div class='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-previous sevenTables-pagination-icon'>", a += "<span class='sevenTables-pagination-icon-inner sevenTables-pagination-icon-previous'>", a += "</span>", a += "</div>", a += "</div>", a += "<div class='sevenTables-toolbar-pagination-cell'>", a += "<div class='sevenTables-pagination-num-choice'>", a += "<span class='sevenTables-pagination-num-choice-cell'>Page</span>", a += "<input value='1' type='text' class='sevenTables-pagination-numinput' id='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-numinput'/>", a += "<span class='sevenTables-pagination-num-choice-cell'>of</span>", a += "<span class='sevenTables-pagination-num-choice-cell' id='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-page-totality'>23</span>", a += "</div>", a += "</div>", a += "<div class='sevenTables-toolbar-pagination-cell'>", a += "<div class='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-nextpage sevenTables-pagination-icon'>", a += "<span class='sevenTables-pagination-icon-inner sevenTables-pagination-icon-nextpage'>", a += "</span>", a += "</div>", a += "</div>", a += "<div class='sevenTables-toolbar-pagination-cell'>", a += "<div class='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-lastpage sevenTables-pagination-icon'>", a += "<span class='sevenTables-pagination-icon-inner sevenTables-pagination-icon-lastpage'>", a += "</span>", a += "</div>", a += "</div>", "undefined" != typeof sevenTables.toolBar.pagination.refresh && "undefined" != sevenTables.toolBar.pagination.refresh.enable && 1 == sevenTables.toolBar.pagination.refresh.enable && (a += "<div class='sevenTables-toolbar-pagination-cell'>", a += "<div class='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-refresh sevenTables-pagination-icon'>", a += "<span class='sevenTables-pagination-icon-inner sevenTables-pagination-icon-refresh'>", a += "</span>", a += "</div>", a += "</div>"), a += "<div class='sevenTables-toolbar-pagination-cell'>", a += "<div id='sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-pagelist' class='sevenTables-pagination-select sevenTables-pagination-icon-separator-right'>", a += "</div>", a += "</div>", a += "</div>", a += "</div>", b = "#sevenTables-" + sevenTables.tablesNums + "-toolbar", $(b).append(a)
			},
			bind: function() {
				$("#sevenTables-" + sevenTables.tablesNums + "-toolbar").mousedown(function() {
					sevenTables.tablesNums = $(this).attr("id").split("sevenTables-")[1].split("-toolbar")[0], sevenTables.eval()
				}), $(".sevenTables-pagination-icon").bind({
					mouseover: function() {
						$(this).css({
							background: "url('../seventable/images/button_plain_hover.png') repeat-x scroll 0 0",
							border: "1px solid #B6CDDE"
						})
					},
					mouseout: function() {
						$(this).css({
							background: "#EFEFEF",
							border: "1px solid #EFEFEF"
						})
					}
				}), $("#sevenTables-" + sevenTables.tablesNums + "-toolbar .sevenTables-pagination-numinput").bind({
					click: function() {
						$(this).focus().select()
					},
					keydown: function(a) {
						"13" == a.keyCode ? sevenTables.toolBars.pagination.option($(this)) : "27" == a.keyCode && $(this).blur()
					}
				}), $("#sevenTables-" + sevenTables.tablesNums + "-toolbar .sevenTables-pagination-pagelist").change(function() {
					var a = Number($(this).parent().attr("id").split("sevenTables-tablesnum-")[1].split("-pagination-pagelist")[0]),
						b = $(this).val();
					sevenTables.toolBars.pagination.amountPage(a, b)
				}), $("#sevenTables-" + sevenTables.tablesNums + "-toolbar .sevenTables-pagination-icon-fristpage").parent().click(function() {
					sevenTables.toolBars.pagination.fristPage($(this))
				}), $("#sevenTables-" + sevenTables.tablesNums + "-toolbar .sevenTables-pagination-icon-lastpage").parent().click(function() {
					sevenTables.toolBars.pagination.lastPage($(this))
				}), $("#sevenTables-" + sevenTables.tablesNums + "-toolbar .sevenTables-pagination-icon-previous").parent().click(function() {
					sevenTables.toolBars.pagination.previousPage($(this))
				}), $("#sevenTables-" + sevenTables.tablesNums + "-toolbar .sevenTables-pagination-icon-nextpage").parent().click(function() {
					sevenTables.toolBars.pagination.nextPage($(this))
				}), $("#sevenTables-" + sevenTables.tablesNums + "-toolbar .sevenTables-pagination-icon-refresh").parent().click(function() {
					"function" == sevenTables.toolBar.pagination.refresh.mode ? sevenTables.toolBars.pagination.functionRefresh() : sevenTables.toolBars.pagination.ajaxRefresh()
				})
			},
			paginationPageList: function() {
				var b, c, a = "";
				for (a += "<select class='sevenTables-pagination-pagelist'>", b = 0; b < sevenTables.toolBar.pagination.paginationPageList.option.length; b++) a += "<option>", a += sevenTables.toolBar.pagination.paginationPageList.option[b], a += "</option>";
				return a += "</select>", $("#sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-pagelist").append(a), c = $("#sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-pagelist select").val()
			},
			initPagin: function(a) {
				var e, b = 1,
					c = parseInt(sevenTables.row / a),
					d = sevenTables.row % a;
				for (c = 0 == d ? c : c + 1, e = 0; e < sevenTables.row; e++) e >= a * b ? b++ : b, $("#num-" + sevenTables.tablesNums + "-sevenTables-tbody tr:eq(" + e + ")").attr("name", "pagination-" + sevenTables.tablesNums + "-pagenum-" + b + "-pagelistvalue-select");
				sevenTables.toolBars.pagination.show(sevenTables.tablesNums, 1), $("#sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-page-totality").html(c)
			},
			option: function(a) {
				var b = Number(a.val()),
					c = a.attr("id").split("sevenTables-tablesnum-")[1].split("-pagination-numinput")[0],
					d = Number($("#sevenTables-tablesnum-" + c + "-pagination-page-totality").html());
				b > 0 && d >= b ? sevenTables.toolBars.pagination.show(c, b) : alert("Please input a legal value")
			},
			lastPage: function(a) {
				var b = a.attr("class").split("sevenTables-tablesnum-")[1].split("-pagination-lastpage")[0],
					c = $("#num-" + sevenTables.tablesNums + "-sevenTables-tbody tr:eq(-1)").attr("name").split("pagination-" + b + "-pagenum-")[1].split("-pagelistvalue-select")[0],
					d = Number($("#sevenTables-tablesnum-" + b + "-pagination-page-totality").html()),
					e = $("#sevenTables-tablesnum-" + b + "-pagination-numinput").val();
				e == d ? alert("Last page!") : ($("#sevenTables-tablesnum-" + b + "-pagination-numinput").val(Number($("#sevenTables-tablesnum-" + b + "-pagination-page-totality").html())), sevenTables.toolBars.pagination.show(b, c))
			},
			fristPage: function(a) {
				var b = a.attr("class").split("sevenTables-tablesnum-")[1].split("-pagination-fristpage")[0],
					c = $("#num-" + sevenTables.tablesNums + "-sevenTables-tbody tr:eq(0)").attr("name").split("pagination-" + b + "-pagenum-")[1].split("-pagelistvalue-select")[0],
					d = $("#sevenTables-tablesnum-" + b + "-pagination-numinput").val();
				1 == d ? alert("Frist page!") : ($("#sevenTables-tablesnum-" + b + "-pagination-numinput").val(1), sevenTables.toolBars.pagination.show(b, c))
			},
			nextPage: function(a) {
				var b = a.attr("class").split("sevenTables-tablesnum-")[1].split("-pagination-nextpage")[0],
					c = Number($(".sevenTables-num-" + b + "-tbody-datagrid-row:visible").eq(0).attr("name").split("pagination-" + b + "-pagenum-")[1].split("-pagelistvalue-select")[0]) + 1,
					d = Number($("#sevenTables-tablesnum-" + b + "-pagination-page-totality").html());
				d >= c ? ($("#sevenTables-tablesnum-" + b + "-pagination-numinput").val(c), sevenTables.toolBars.pagination.show(b, c)) : alert("Last page!")
			},
			previousPage: function(a) {
				var b = a.attr("class").split("sevenTables-tablesnum-")[1].split("-pagination-previous")[0],
					c = Number($(".sevenTables-num-" + b + "-tbody-datagrid-row:visible").eq(0).attr("name").split("pagination-" + b + "-pagenum-")[1].split("-pagelistvalue-select")[0]) - 1;
				Number($("#sevenTables-tablesnum-" + b + "-pagination-page-totality").html()), c > 0 ? ($("#sevenTables-tablesnum-" + b + "-pagination-numinput").val(c), sevenTables.toolBars.pagination.show(b, c)) : alert("Frist page!")
			},
			functionRefresh: function() {
				var a = sevenTables.tablesNums;
				sevenTables.loading(), sevenTables.privateTables["table" + a].toolBar.pagination.refresh.functionMode(), setTimeout(function() {
					sevenTables.loadingOver(a)
				}, 1e3), $("#sevenTables-tablesnum-" + a + "-pagination-numinput").val(1)
			},
			ajaxRefresh: function() {
				var b, a = sevenTables.tablesNums;
				sevenTables.loading(), b = {
					url: sevenTables.privateTables["table" + a].toolBar.pagination.refresh.ajax.url,
					async: !0,
					data: sevenTables.privateTables["table" + a].toolBar.pagination.refresh.ajax.data,
					success: function(b) {
						sevenTables.loadingOver(a), $("#sevenTables-tablesnum-" + a + "-pagination-numinput").val(1), sevenTables.privateTables["table" + a].toolBar.pagination.refresh.ajax.success(b)
					},
					error: function() {}
				}, sevenTables.ajax.init(b)
			},
			amountPage: function(a, b) {
				var f, c = 1,
					d = parseInt(sevenTables.row / b),
					e = sevenTables.row % b;
				for (d = 0 == e ? d : d + 1, $("#sevenTables-tablesnum-" + a + "-pagination-numinput").val(1), f = 0; f < sevenTables.row; f++) f >= b * c ? c++ : c, $("#num-" + a + "-sevenTables-tbody tr:eq(" + f + ")").attr("name", "pagination-" + a + "-pagenum-" + c + "-pagelistvalue-select");
				sevenTables.toolBars.pagination.show(a, 1), $("#sevenTables-tablesnum-" + a + "-pagination-page-totality").html(d)
			},
			show: function(a, b) {
				var c = "pagination-" + a + "-pagenum-" + b + "-pagelistvalue-select";
				$(".sevenTables-num-" + a + "-tbody-datagrid-row").hide(), $("tr[name='" + c + "']").show()
			}
		}
	},
	detection: function(a) {
		return "undefined" == typeof a ? "obj undefined" : 0 == a.enable ? !1 : !0
	},
	refresh: function(a, b) {
		sevenTables.tablesNums = b || sevenTables.tablesNums, $(".sevenTables-num-" + sevenTables.tablesNums + "-tbody-datagrid-row").remove(), sevenTables.privateTables["table" + sevenTables.tablesNums].data.json = a, sevenTables.row = a.length || 1, $("#sevenTables-tablesnum-" + sevenTables.tablesNums + "-pagination-numinput").val(1), sevenTables.refreshTbody()
	},
	loading: function() {
		$("#seventables-nums-" + sevenTables.tablesNums).parent().hide();
		var a = "";
		a += "<div class='sevenTables-refresh-loading'>", a += "<div class='sevenTables-tablesnum-" + sevenTables.tablesNums + "-refresh-loading sevenTables-loading-img'>", a += "<span class='sevenTables-loading-img-inner sevenTables-img-refresh-loading'>", a += "</span>", a += "</div>", a += "</div>", $("#seventables-nums-" + sevenTables.tablesNums).parent().after(a)
	},
	loadingOver: function(a) {
		$("#seventables-nums-" + a).parent().show(), $("#seventables-nums-" + a).parent().siblings(".sevenTables-refresh-loading").remove()
	}
};

var Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function(a) {
		var c, d, e, f, g, h, i, b = "",
			j = 0;
		for (a = Base64._utf8_encode(a); j < a.length;) c = a.codePointAt(j++), d = a.codePointAt(j++), e = a.codePointAt(j++), f = c >> 2, g = (3 & c) << 4 | d >> 4, h = (15 & d) << 2 | e >> 6, i = 63 & e, isNaN(d) ? h = i = 64 : isNaN(e) && (i = 64), b = b + Base64._keyStr.charAt(f) + Base64._keyStr.charAt(g) + Base64._keyStr.charAt(h) + Base64._keyStr.charAt(i);
		return b
	},
	decode: function(a) {
		var c, d, e, f, g, h, i, b = "",
			j = 0;
		for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); j < a.length;) f = Base64._keyStr.indexOf(a.charAt(j++)), g = Base64._keyStr.indexOf(a.charAt(j++)), h = Base64._keyStr.indexOf(a.charAt(j++)), i = Base64._keyStr.indexOf(a.charAt(j++)), c = f << 2 | g >> 4, d = (15 & g) << 4 | h >> 2, e = (3 & h) << 6 | i, b += String.fromCodePoint(c), 64 != h && (b += String.fromCodePoint(d)), 64 != i && (b += String.fromCodePoint(e));
		return b = Base64._utf8_decode(b)
	},
	_utf8_encode: function(a) {
		var b, c, d;
		for (a = a.replace(/\r\n/g, "\n"), b = "", c = 0; c < a.length; c++) d = a.charCodeAt(c), d >= 0xD800 && d <= 0xDBFF ? (d = a.codePointAt(c), c++) : c, 128 > d ? b += String.fromCodePoint(d) : d > 127 && 2048 > d ? (b += String.fromCodePoint(192 | d >> 6), b += String.fromCodePoint(128 | 63 & d)) : d > 2047 && d < 65536 ? (b += String.fromCodePoint(224 | d >> 12), b += String.fromCodePoint(128 | 63 & d >> 6), b += String.fromCodePoint(128 | 63 & d)) : (b += String.fromCodePoint(240 | d >> 18), b += String.fromCodePoint(128 | 63 & d >> 12), b += String.fromCodePoint(128 | 63 & d >> 6), b += String.fromCodePoint(128 | 63 & d));
		return b
	},
	_utf8_decode: function(a) {
		for (var b = "", c = 0, d = c1 = c2 = 0; c < a.length;) d = a.codePointAt(c), 128 > d ? (b += String.fromCodePoint(d), c++) : d > 191 && 224 > d ? (c2 = a.codePointAt(c + 1), b += String.fromCodePoint((31 & d) << 6 | 63 & c2), c += 2) : d > 223 && d < 240 ? (c2 = a.codePointAt(c + 1), c3 = a.codePointAt(c + 2), b += String.fromCodePoint((15 & d) << 12 | (63 & c2) << 6 | 63 & c3), c += 3) : (c2 = a.codePointAt(c + 1), c3 = a.codePointAt(c + 2), c4 = a.codePointAt(c + 3), b += String.fromCodePoint((15 & d) << 18 | (63 & c2) << 12 | (63 & c3) << 6 | 63 & c4), c += 4);
		return b
	}
};

function stopBubble(a) {
	return a.preventDefault(), a.stopPropagation(), a.cancelBubble = !0, a.returnValue = !1, !1
};

var plug = {
	holder: null,
	launch: function() {},
	checkbox: {
		initial: function(a) {
			return $.browser.msie && "7.0" == $.browser.version ? !1 : (a.find(".checkbox").remove(), a.find("input[type='checkbox']").hide().each(function() {
				var g, h, b = $(this),
					c = $(this).attr("id"),
					d = $(this).attr("name"),
					e = $(this).attr("checked"),
					f = $(this).attr("disabled");
				g = "checked" == e ? "disabled" == f ? "checkbox-checked-disabled" : "checkbox-checked" : "disabled" == f ? "checkbox-disabled" : "", $(this).after("<div class='checkbox " + g + " checkbox-" + c + "' name='" + d + "'></div>"), h = $(this).nextAll("div.checkbox:first"), h.bind({
					click: function() {
						"disabled" != b.attr("disabled") && this.previousSibling.click()
					}
				}), $(this).nextAll("label:first").bind({
					click: function() {
						"disabled" != b.attr("disabled") && (h.hasClass("checkbox-checked") ? h.removeClass("checkbox-checked") : h.addClass("checkbox-checked"), b.click())
					}
				}).removeAttr("for"), $(this).change(function() {
					$(this).attr("checked") ? h.addClass("checkbox-checked") : h.removeClass("checkbox-checked")
				})
			}), void 0)
		},
		check: function(a) {
			$(".checkbox" + a).each(function() {
				$(this).addClass("checkbox-checked")
			})
		},
		cancel: function(a) {
			$(".checkbox" + a).each(function() {
				$(this).removeClass("checkbox-checked")
			})
		},
		synchronize: function(a) {
			var a = a || {}, b = a.$holder || $("body"),
				c = a.selector || "";
			b.find(".checkbox" + c).each(function() {
				var d, a = $(document.getElementsByName($(this).attr("name"))[0]),
					b = a.attr("checked"),
					c = a.attr("disabled");
				d = "checked" == b ? "disabled" == c ? "checkbox-checked-disabled" : "checkbox-checked" : "disabled" == c ? "checkbox-disabled" : "", $(this).removeAttr("class").attr("class", "checkbox checkbox-" + a.attr("id") + " " + d)
			})
		},
		enable: function(a) {
			$(".checkbox" + a).each(function() {
				$(this).hasClass("checkbox-disabled") && $(this).removeClass("checkbox-disabled"), $(this).hasClass("checkbox-checked-disabled") && ($(this).removeClass("checkbox-checked-disabled"), $(this).addClass("checkbox-checked"))
			})
		},
		disable: function(a) {
			$(".checkbox" + a).each(function() {
				$(this).hasClass("checkbox-checked") ? ($(this).removeClass("checkbox-checked"), $(this).addClass("checkbox-checked-disabled")) : $(this).addClass("checkbox-disabled")
			})
		}
	},
	button: {
		disable: function(a) {
			var b = a.attr("id");
			return b ? (document.getElementById(b).style.cssText = "background:#a7a9ac;color:#36444b;border:1px solid #a7a9ac", a.attr("disabled", !0), void 0) : !1
		},
		enable: function(a) {
			var b = a.attr("id");
			var show = document.getElementById(b).style['display'];
			return b ? (document.getElementById(b).style.cssText = "color:#ffffff;border:1px solid #4acbd6;display:"+show+";", a.attr("disabled", !1), void 0) : !1
		}
	},
	window: {
		PasswordLevelCheck:function(){
			var Point = 0;

			var NewPassword = $("#new_password").val();
			var PasswordLength = NewPassword.length;

			if((0 < PasswordLength) && (4 >= PasswordLength))
			{
				Point += 5;
			}  
			else if((4 < PasswordLength) && (7 >= PasswordLength))
			{
				Point += 10;
			}
			else if(7 < PasswordLength)
			{
				Point += 25;
			}

			var PatternLowcase = /[a-z]/g;
			var PatternUpcase  = /[A-Z]/g;
			var PatterNum      = /[0-9]/g;

			var PatternSign    = /[\!\#\$\&\(\)\+\,\-\.\;\=\[\]\^\_\`\{\}\~]/g;

			var FlagLow = PatternLowcase.test(NewPassword);
			var FlagUp  = PatternUpcase.test(NewPassword);

			var FlagChar = FlagLow || FlagUp;
			var FlagBoth = FlagLow && FlagUp;

			if(FlagBoth)
			{
				Point += 20;
			}
			else if(FlagChar)
			{
				Point += 10;
			}

			var FlagNum = PatterNum.test(NewPassword);
			var length  = NewPassword.match(PatterNum);

			if(length)
			{
				length = length.length;
			}
			else
			{
				length = 0;
			}

			if(3 <= length)
			{
				Point += 20;
			}
			else if((0 < length) && (3 > length))
			{
				Point += 10;
			}

			var FlagSign = PatternSign.test(NewPassword);
			var length = NewPassword.match(PatternSign);

			if(length)
			{
				length = length.length;
			}
			else
			{
				length = 0;
			}

			if(1 < length)
			{
				Point += 20;
			}
			else if(1 == length)
			{
				Point += 10;
			}

			if(FlagBoth && FlagSign && FlagNum)
			{
				Point += 5;
			}
			else if(FlagChar && FlagSign && FlagNum)
			{
				Point += 3;
			}
			else if(FlagChar && FlagNum)
			{
				Point += 2;
			}

			var level = 0;

			if(0 >= Point)
			{
				//grey
				level = 0;
			}
			else if((0 < Point) && (50 >= Point))
			{
				//low
				level = 1;
			}
			else if((50 < Point) && (80 >= Point))
			{
				//middle
				level = 2;
			}
			else 
			{
				//high
				level = 3;
			}

			var PasswordLevel = $("ul").find('li.level');
			PasswordLevel.removeClass("level-0 level-1 level-2 level-3");
			PasswordLevel.fadeIn(100).addClass("level-"+level);
		},


		request: function() {
			var data = {
				"Username": $.cookie("UserName"),
				"Password": Base64.encode($("#new_password").val()),
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
					$.cookie("CameraType",json.model);
					$.cookie("isAdmin",json.isAdmin);
					$.cookie("UserName",$('#username').attr('value'))
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
				},
				error: function(xhr) {

				}
			});	
		},

		ChangePwd:function(data){
		/*
			var data = {
				"Username": $("#username").val(),
				"OldPassword": Base64.encode($('#password').attr('value')),
				"NewPassword": Base64.encode($("#new_password").val()),
				"token": $.cookie("Token")
			};
		
			$.ajax({
				url: '/setpass.fcgi',
				type: 'post',
				dataType: 'text',
				data: data,
				contentType: 'application/x-www-form-urlencoded;charset=utf-8',

				success:function(response){
					var json = jQuery.parseJSON(response);
					if(0 == json.errorCode)
					{
						console.log("xxoo2");
						//window.location.href = "../../index.html";
					}
				},
				error:function(response){
					var json = jQuery.parseJSON(response);
					if(0 == json.errorCode)
					{	
						console.log("xxoo3");
					}
				}
			});
		*/
			var args = {
				url: '/setpass.fcgi',
				data: {
					"Username": $.cookie("UserName"),
					"OldPassword": Base64.encode('admin'),
					"NewPassword": Base64.encode($("#new_password").val())
				},
				beforeSend: function(){		
				},
				success: function(json) {
					if(0 == json.errorCode)
					{
						$.cookie("PasswordIsAdmin", 0);
						$.cookie("StreamPassword",Base64.encode($("#new_password").val()));
						//$(".seven-windows-position").remove();
						//$(".seven-windows-holder").remove();
						//$(".content-right").css({"display":"block"});
						plug.window.request();
						//window.location.href = "../../index.html";
					}
				},
				error: function(xhr) {		
				}
			};
			common.setAjax.init(args);
		
		},

		alert: function(a) {
			var b, c;
			a = a || {}, b = plug.window.init(a), plug.window.beforeInit(b), c = "", c += "<div class='seven-windows-holder'>", c += "</div>", c += "<div class='seven-windows-position'>", c += "<div class='seven-windows-contain'>", c += "<span class='seven-windows-head'>", c += "<span class='seven-windows-head-title'>", c += b.title, c += "</span>", c += "<span class='seven-windows-head-close'>", c += "</span>", c += "</span>", c += "<span class='seven-windows-body'>", c += "<span class='seven-windows-body-contain'>", c += "<p class='seven-windows-body-contain-font'>", c += b.info, c += "</p>", c += "</span>", c += "</span>", c += "<span class='seven-windows-body-foot'>", c += "<span class='seven-windows-body-foot-contain'>", c += "<input id='seven-windows-button-ok' class='seven-windows-button seven-windows-alert-button' value='OK' type='button' />", c += "</span>", c += "</span>", c += "</span>", c += "</div>", c += "</div>", $("body").append(c), plug.window.bind(b), $("#seven-windows-button-ok").focus()
		},
		changepss: function(a) {
			var b, c;
			a = a || {}, b = plug.window.init(a), plug.window.beforeInit(b), c = "", c += "<div class='seven-windows-holder'>", c += "</div>", c += "<div class='seven-windows-position'>", c += "<div class='seven-windows-contain'>", c += "<span class='seven-windows-head'>", c += "<span class='seven-windows-head-title'>", c += b.title, c += "</span>", c += "<span class='seven-windows-head-close'>", c += "</span>", c += "</span>", c += "<span class='seven-windows-body'>", c += "<span class='seven-windows-body-contain' style='height:200px'>", c += "<p class='seven-windows-body-contain-font' style='margin-bottom:10px'>", c += b.info, c += "</p>", 
			c+="<ul>", 
			c+="<li style='margin-left:28px'>", c+="<span style='margin-right:28px'>", c+="New Password:", c+="</span>", c+="<input type='password' class='changepss-input newpassword' id='new_password'>", c+="</li>",
			c+="<li style='margin-left:165px; margin-top:2px' class='level'>", c+="<span class='changepss-level low' style='margin-right:4px'>", c+="Low", c+="</span>", c+="<span class='changepss-level middle' style='margin-right:4px'>", c+="Middle", c+="</span>", c+="<span class='changepss-level high'>", c+="High", c+="</span>", c+="</li>",
			c+="<li style='margin-left:28px'>", c+="<span style='margin-right:7px'>", c+="Confirm Password:", c+="</span>", c+="<input type='password' class='changepss-input' id='confirm_new_password' style='margin-top:6px'>", c+="</li>",
			c+="</ul>",
			c+= "<span class='seven-windows-body-contain-font' style='margin-bottom:10px;color:#ff0000' id='error-tips'>",
			c+= "</span>",
			c += "</span>", c += "</span>", c += "<span class='seven-windows-body-foot'>", c += "<span class='seven-windows-body-foot-contain'>", c += "<input id='seven-windows-button-setnewpss-ok' class='seven-windows-button seven-windows-alert-button' value='OK' type='button' />", c += "</span>", c += "</span>", c += "</span>", c += "</div>", c += "</div>", $("body").append(c), plug.window.bind(b), $("#seven-windows-button-ok").focus()
		},
		confirm: function(a) {
			var b, c;
			a = a || {}, b = plug.window.init(a), plug.window.beforeInit(b), c = "", c += "<div class='seven-windows-holder'>", c += "</div>", c += "<div class='seven-windows-position'>", c += "<div class='seven-windows-contain'>", c += "<span class='seven-windows-head'>", c += "<span class='seven-windows-head-title'>", c += b.title, c += "</span>", c += "<span class='seven-windows-head-close'>", c += "</span>", c += "</span>", c += "<span class='seven-windows-body'>", c += "<span class='seven-windows-body-contain'>", c += "<p class='seven-windows-body-contain-font'>", c += b.info, c += "</p>", c += "</span>", c += "</span>", c += "<span class='seven-windows-body-foot'>", c += "<span class='seven-windows-body-foot-contain'>", c += "<input id='seven-windows-button-confirm' class='seven-windows-button seven-windows-alert-button' value='" + b.btnConfirm + "' type='button' />", c += "<input id='seven-windows-button-cancel' class='seven-windows-button seven-windows-alert-button' value='Cancel' type='button' />", c += "</span>", c += "</span>", c += "</div>", c += "</div>", $("body").append(c), plug.window.bind(b), $("#seven-windows-button-confirm").focus()
		},
		beforeInit: function(a) {
			$("#tpplugin").css({
				width: 1,
				height: 1
			});
			
			if (typeof video != "undefined") {
				video.mdPlayerWidth.width = $("#mdplugin").width();
				video.mdPlayerWidth.height = $("#mdplugin").height();					
			} 		 		
						
			$("#mdplugin").css({
				width: 1,
				height: 1
			});
			a.beforeInit();
		},
		afterCancel: function(){
			if (typeof video != "undefined") {
				$("#tpplugin").css({
					//width: video.playerSize.width,
					//height: video.playerSize.height
				});
				$("#mdplugin").css({
					//width: video.mdPlayerWidth.width,
					//height: video.mdPlayerWidth.height
				});				
			} 		 	
			//a.afterCancel();
		},
		remove: function(a) {
			if ($("#tpplugin").attr("id")) {
				if (typeof video != "undefined") {
					video.zoom();
				}
			}
			a.beforeRemove(), $("body").unbind("keydown", plug.window.disableKey), $("#main input").attr("tabindex", "1"), $(".seven-windows-holder").remove(), $(".seven-windows-position").remove(), a.afterRemove()
		},
		init: function(a) {
			return $(".seven-windows-holder").remove(), $(".seven-windows-position").remove(), a.title = a.title || "TIPS", a.info = a.info || "Something wrong.", a.btnConfirm = a.btnConfirm || "Confirm", a.cancel = a.cancel || function() {}, a.ok = a.ok || function() {}, a.beforeInit = a.beforeInit || function() {}, a.beforeRemove = a.beforeRemove || function() {}, a.afterRemove = a.afterRemove || function() {}, a.confirm = a.confirm || function() {}, a
		},
		disableKey: function(a) {
			//"27" == a.keyCode && $(".seven-windows-head-close").click()
			"27" == a.keyCode
		},
		bind: function(a) {
			var flag = 0;
			$("body").bind("keydown", plug.window.disableKey), $("#main input").attr("tabindex", -1), $("#seven-windows-button-cancel").bind({
				click: function() {
					a.cancel(), plug.window.remove(a), plug.window.afterCancel()
				}
			}), $("#seven-windows-button-confirm").bind({
				click: function() {
					a.confirm(), plug.window.remove(a), plug.window.afterCancel()
				}
			}), $("#seven-windows-button-ok").bind({
				click: function() {
					a.ok(), plug.window.remove(a), plug.window.afterCancel()
				}
			}),/*, $(".seven-windows-head-close").bind({
				click: function() {
					a.cancel(), plug.window.remove(a), plug.window.afterCancel()
				}
			})*/
			$("div").delegate("input.newpassword", "keyup", function(){
				plug.window.PasswordLevelCheck();
			}),

			$("#confirm_new_password").bind({
				keydown: function(event) 
				{
					if (event.keyCode == "13") 
					{
						$("#seven-windows-button-setnewpss-ok").click();
					}
				}
			}),

			$("#seven-windows-button-setnewpss-ok").bind({
				click: function() {
					var validinfo = valid.password($("#new_password").val());
					if(!validinfo.pass)
					{
						$(".seven-windows-contain").css({"height":"295px"});
						$(".seven-windows-body").css({"height":"210px"});						
						$("#error-tips").text(validinfo.str);
					}
					else if('' == $("#confirm_new_password").val())
					{
						$(".seven-windows-contain").css({"height":"295px"});
						$(".seven-windows-body").css({"height":"210px"});						
						$("#error-tips").text(lang.ajax.changeUserPwd.confirmpassword);						
					}
					else if('admin' == $("#new_password").val())
					{
						$(".seven-windows-contain").css({"height":"295px"});
						$(".seven-windows-body").css({"height":"210px"});						
						$("#error-tips").text(lang.ajax.changeUserPwd.cannotbeadmin);
					}					
					else if($("#new_password").val() != $("#confirm_new_password").val())
					{
						$(".seven-windows-contain").css({"height":"295px"});
						$(".seven-windows-body").css({"height":"210px"});
						$("#error-tips").text(lang.ajax.changeUserPwd.mismatch);
					}
					else 
					{
						plug.window.ChangePwd();
					}
				}
			}),
			$("#seven-windows-button-setnewpss-ok").blur(function(){
				$(".seven-windows-contain").css({"height":"260px"});
				$(".seven-windows-body").css({"height":"175px"});
				$("#error-tips").text("");
			}),
			$("#new_password").blur(function(){
				var validinfo = valid.password($("#new_password").val());
				if(!validinfo.pass)
				{
					$(".seven-windows-contain").css({"height":"295px"});
					$(".seven-windows-body").css({"height":"210px"});						
					$("#error-tips").text(validinfo.str);					
				}
			}),
			$("#new_password").focus(function(){
				$(".seven-windows-contain").css({"height":"260px"});
				$(".seven-windows-body").css({"height":"175px"});						
				$("#error-tips").text("");				
			})
		}
	},
	select: {
		initial: function(a, b) {
			if ($.browser.msie && "7.0" == $.browser.version) return !1;
			var b = b || "auto";
			a.find(".plugin-select").remove(), a.find("select").each(function() {
				function m(b) {
					a.find(".select-slide").removeClass("select-slide");
					var d = $(b).attr("xvalue");
					l.find(".selected").html($(b).html()), c.val(d), c.change()
				}
				var d, e, f, g, h, i, j, k, l, c = $(this);
				c.show(), d = $(this).attr("id"), e = c.find("option"), f = 0 == c.width() ? 200 : c.outerWidth(), g = null == c.attr("Optionwidth") ? f : c.attr("Optionwidth"), h = Math.min(250, 29 * e.length), i = c.attr("disabled"), c.hide(), j = c.find("option[value='" + c.val() + "']").html(), k = "<div class='plugin-select select" + ("disabled" == i ? " select-disabled" : "") + " select-" + d + " " + d + " select-slide'>",/*console.log("j:"+j),*/ k += "<div class='selected lang'>" + (null == j ? "" : j) + "</div>", k += "<div class='triangle'></div>", k += "<div class='forDisabled'></div>", k += "<div class='slide'>", k += "<div class='slide-item-holder'>", e.each(function() {
					"none" != $(this).css("display") && (k += "  <div class='slide-item lang' xvalue='" + $(this).attr("value") + "' class='forOption'>" + $(this).html() + "</div>")
				}), k += " </div>", k += "</div>", k += "</div>", $(k).insertBefore(c), l = a.find("div." + d), l.bind({
					click: function(d) {
						var f = screen.availHeight,
							g = d.pageY;
						"up" == b ? l.find(".slide").css({
							bottom: $(this).height(),
							top: ""
						}) : "down" == b ? l.find(".slide").css({
							top: $(this).height(),
							bottom: ""
						}) : /*f - g < Math.min(250, 25 * e.length) ? l.find(".slide").css({
							bottom: $(this).height(),
							top: ""
						}) :*/ l.find(".slide").css({
							top: $(this).height(),
							bottom: ""
						}), $(this).hasClass("select-slide") ? $(this).removeClass("select-slide") : (a.find(".select-slide").removeClass("select-slide"), $(this).addClass("select-slide")), c.focus(), d.stopPropagation()
					}
				}).disableSelection(), l.find(".slide").find(".slide-item").bind({
					click: function(a) {
						m(this), a.stopPropagation()
					}
				}), l.width(f), l.find(".selected").width(f - 30), l.find(".slide").width(g).height(h), l.find(".slide-item-holder").width(g).attr({
					height: 29 * e.length
				}), l.find(".forDisabled").width(f).bind({
					click: function(a) {
						a.stopPropagation()
					}
				}), plug.scrollbar.initial({
					$target: l.find(".slide .slide-item-holder"),
					$holder: l.find(".slide")
				}), a.find(".select-slide").removeClass("select-slide"), $("body").click(function() {
					$("div.select-slide").removeClass("select-slide")
				}), c.change(function() {
					l.find(".selected").html($(this).children("option:selected").html())
				})
			})
		},
		optionSelected: function(a) {
			$holder.find(".select-slide").removeClass("select-slide");
			var c = $(a).attr("xvalue");
			$widgetSelect.find(".selected").html($(a).html()), $select.val(c), $select.change()
		},
		synchronize: function(a) {
			var a = a || {}, b = a.selector || "";
			$("select" + b).each(function() {
				function h(a) {
					e.removeClass("select-slide");
					var c = $(a).attr("xvalue");
					e.find(".selected").html($(a).html()), b.val(c), b.change()
				}
				var g, b = $(this),
					c = b.attr("disabled"),
					d = b.find("option"),
					e = $(".select-" + b.attr("name")),
					f = Math.min(250, 25 * d.length);
				e.find(".slide-item-holder").attr({
					height: 25 * d.length
				}), e.find(".selected").html(b.find("option[value='" + b.val() + "']").html()), "disabled" == c ? e.addClass("select-disabled") : e.removeClass("select-disabled"), e.find(".slide").height(f), g = "", d.each(function() {
					g += "  <div class='slide-item' title='" + $(this).html() + "' xvalue='" + $(this).attr("value") + "' class='forOption'>" + $(this).html() + "</div>"
				}), e.find(".slide .slide-item-holder").html(g), 0 == d.length && e.find(".selected").html(""), e.find(".slide .slide-item").bind({
					click: function(a) {
						h(this), stopBubble(a)
					}
				}), plug.scrollbar.initial({
					$target: e.find(".slide .slide-item-holder"),
					$holder: e.find(".slide")
				})
			})
		},
		enabled: function(a) {
			var b = a.name,
				c = $("div." + b);
			c.removeClass("select-disabled"), $("select[name='" + b + "']").removeAttr("disabled")
		},
		disabled: function(a) {
			var b = a.name,
				c = $("div." + b);
			c.removeClass("select-slide"), c.addClass("select-disabled"), $("select[name='" + b + "']").attr("disabled", "disabled")
		},
		recover: function() {
			$("#date").blur(), $("div.select-slide").removeClass("select-slide")
		}
	},
	scrollbar: {
		scrollTo: function(a) {
			var e, f, g, b = a.top,
				c = a.$target,
				d = a.$holder;
			0 != d.find(".scrollBar-vertical").length && (c.css({
				top: b
			}), e = {}, f = {}, g = d.find(".scrollBar-vertical .scroll-area .scroll-block"), e.top = Math.min(1, c.position().top / (d.height() - c.height())), f.top = (g.parent().height() - g.height()) * e.top, g.css({
				top: f.top
			}))
		},
		synchronize: function() {},
		initial: function(a) {
			function f(a) {
				var d, f;
				b.outerHeight() <= c.outerHeight() || (e && b.css({
					overflow: "hidden"
				}), d = b.position().top, f = EventUtil.getWheelDelta(a), f > 0 ? b.css("top", Math.min(d + 15, 0)) : b.css("top", Math.max(d - 15, c.height() - b.height())), j.top = b.position().top / (c.height() - b.height()), k.top = (l.height() - l.parent().height()) * j.top, l.css({
					top: -k.top
				}), e && b.css({
					overflow: "visible"
				}), stopBubble(a))
			}
			var h, i, j, k, l, m, b = a.$target,
				c = a.$holder,
				d = 0 == a.revert ? !1 : !0,
				e = a.overflowFlag || !1,
				g = b.attr("height") || b.outerHeight();
			if (g > c.outerHeight()) {
				if (d && b.css({
					top: 0
				}), 0 == c.find(".scrollBar-vertical").length) h = "<div class='scrollBar scrollBar-vertical' onmousedown='stopBubble(event)'>", h += "	<div class='scroll-area'>", h += "	<div class='scroll-block'></div>", h += "	</div>", h += "</div>", c.prepend(h), i = 100 * Math.floor((g - c.height()) / 1e3), c.find(".scrollBar-vertical .scroll-block").css({}), j = {}, k = {}, l = c.find(".scrollBar-vertical .scroll-area .scroll-block"), $.browser.mozilla ? EventUtil.addHandler(b[0], "DOMMouseScroll", f) : EventUtil.addHandler(b[0], "mousewheel", f);
				else {
					if (!d) return;
					l = c.find(".scrollBar-vertical .scroll-area .scroll-block"), l.css({
						top: 0
					}), i = 100 * Math.floor((b.height() - c.height()) / 1e3), c.find(".scrollBar-vertical .scroll-block").css({
						height: Math.min(85, Math.max(5, 100 - i)) + "%"
					})
				}
				e && b.css({
					overflow: "visible"
				})
			} else b.css({
				top: 0
			}), e && b.css({
				overflow: "visible"
			}), c.find(".scrollBar-vertical").remove();
			b.width() > c.width() ? 0 == c.find(".scrollBar-horizontal").length && (h = "<div class='scrollBar scrollBar-horizontal' onmousedown='stopBubble(event)'>", h += "	<div class='scroll-area'>", h += "		<div class='scroll-block'></div>", h += "	</div>", h += "</div>", c.prepend(h), i = 100 * Math.floor((b.width() - c.width()) / 1e3), c.find(".scrollBar-horizontal .scroll-block").css({
				width: Math.min(85, Math.max(5, 100 - i)) + "%"
			})) : (b.css({
				left: 0
			}), c.find(".scrollBar-horizontal").remove()), m = c.find(".scroll-block"), m.draggable({
				containment: "parent",
				drag: function(a, d) {
					var e = {
						top: d.position.top / (d.helper.parent().height() - d.helper.height()),
						left: d.position.left / (d.helper.parent().width() - d.helper.width())
					}, f = {
						top: (b.height() - c.height()) * e.top,
						left: (b.width() - c.width()) * e.left
					};
					b.css({
						top: -f.top,
						left: -f.left
					})
				},
				stop: function() {}
			})
		}
	},
	radio: {
		initial: function(a) {
			a.find(".radio").remove(), a.find("input[type='radio']").hide().each(function() {
				var h, c = $(this),
					d = $(this).attr("id"),
					e = $(this).attr("name"),
					f = $(this).attr("checked"),
					g = $(this).attr("disabled");

				h = "checked" == f ? "disabled" == g ? "radio-checked-disabled" : "radio-checked" : "disabled" == g ? "radio-disabled" : "", $(this).after("<div class='radio " + h + " radio-" + d + "' rId='" + d + "' name='" + e + "'></div>"), $(this).nextAll("div.radio:first").bind({
					update: function() {
						"disabled" != a.find("#" + d).attr("disabled") && (a.find("input[type='radio'][name='" + e + "']").removeAttr("checked"), a.find("#" + d).attr("checked", "checked"), a.find(".radio[name='" + e + "']").removeClass("radio-checked"), $(this).addClass("radio-checked"))
					},
					click: function() {
						if ( c.attr('disabled') ){
							return null;
						}
						c.click();
						//$(this).update();
						//"disabled" != a.find("#" + d).attr("disabled") && (a.find("input[type='radio'][name='" + e + "']").removeAttr("checked"), a.find("#" + d).attr("checked", "checked"), c.click(), a.find(".radio[name='" + e + "']").removeClass("radio-checked"), $(this).addClass("radio-checked"))
					},
				}), $(this).nextAll("label:first").bind({
					click: function() {
						"disabled" != a.find("#" + d).attr("disabled") && (a.find("input[type='radio'][name='" + e + "']").removeAttr("checked"), a.find("#" + d).attr("checked", "checked"), c.click(), a.find(".radio[name='" + e + "']").removeClass("radio-checked"), a.find(".radio-" + d).addClass("radio-checked"))
					}
				}).removeAttr("for")

				/*add by mj 2016.4.15*/
				c.bind({
					click:function(){
						c.nextAll("div.radio:first").trigger('update');
					}
				})	
			})
		},
		synchronize: function(a) {
			var a = a || "";
			$(".radio" + a).each(function() {
				var f, b = $("input[type='radio'][id='" + $(this).attr("rId") + "']"),
					c = b.attr("checked"),
					d = b.attr("disabled"),
					e = b.attr("id");
				f = "checked" == c ? "disabled" == d ? "radio-checked-disabled" : "radio-checked" : "disabled" == d ? "radio-disabled" : "", $(this).removeAttr("class"), $(this).attr("class", "radio radio-" + e + " " + f)
			})
		},
		enable: function(a) {
			a.attr("disabled", false);
			a = a.attr('id');
			$(".radio-" + a).each(function() {
				$(this).hasClass("radio-disabled") && $(this).removeClass("radio-disabled"), $(this).hasClass("radio-checked-disabled") && ($(this).removeClass("radio-checked-disabled"), $(this).addClass("radio-checked"))
			})
		},
		disable: function(a) {
			a.attr("disabled", true);
			a = a.attr('id');
			$(".radio-" + a).each(function() {
				$(this).hasClass("radio-checked") ? ($(this).removeClass("radio-checked"), $(this).addClass("radio-checked-disabled")) : $(this).addClass("radio-disabled")
			})
		}
	}
};

EventUtil = {
        getEvent: function(event) {
            return event ? event : window.event;
        },
        addHandler: function(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        removeHandler: function(element, type, handler) {
            if (element.removeEventListener) { //检测DOM2级方法  
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) { //检测IE方法  
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null; //使用DOM0方法  
            }
        },
        getWheelDelta: function(event) {
            if (event.wheelDelta) {
                return event.wheelDelta;
            } else {
                return -event.detail * 40;
            }
        }
};
