window.lang = {

	"html": {
		"cloud": {
			"disconnect1": "Cannot connect to the TP-Link Cloud server.",
			"disconnect2": "Please check your network or try again later.",
			"loginfail1": "Your camera has been removed from the TP-Link Cloud account or the password of the TP-Link Cloud account has been changed",
			"loginfail2": "Please register your camera again.",
			"loading":"Connecting… Please wait.",
			"connecting": "Connecting to TP-Link Cloud…"
		}
	},
	"info": {
		"update":"New Plugin version is available, please click Download to update.",
		"recordInterrupt": "The recording will be interrupted if you change the resolution or leave this page. Are you sure you want to continue?",
		"recordInterrupted": "A network error has interrupted the recording, please check your network connection.",
		"recordDiskFull": "Not enough storage. The recording will stop.",
		"shootDiskFull": "Not enough storage. The shooting will stop.",
		"recordingAudioHold": "Recording... Audio settings cannot be changed."
	},
	"state": {
		"enable": "开启",
		"disable": "关闭",
 		"noregister":"未注册",
		"connect": "连接",
		"connected": "已连接",
		"connecting": "正在连接",
		"connectedunused":"Connected but not in use (Unplug the camera's Ethernet cable to use the wireless connection.)",
		"disconnect": "未连接",
		"static": "静态IP",
		"dhcp": "动态IP",
		"testing": "测试中"
	},

	"ajax": {
		"ajaxError": "Request times out. Please click the OK button and then try again.", 
		"login": {
			"usrnull": "Please enter a registered username.",
			"pwdnull": "Please enter your password.",
			"usrnotexist": "Username does not exist.",
			"pwderror": "Incorrect password.",
			"chgpsstips":"Please create a password for your camera to enhance security:",
			"loginerror": "Login failed, please check your account information."
		},
		"logout": {
			"tips": "Are you sure you want to log out?",
			"success": "Logout successful.",
			"failed": "Logout failed, please check your network settings or try again later."
		},
		"pluginUninstall": "The TP-Link camera plugin is required. Please download and install the camera plugin and manually refresh the page or restart the browser. If the installed plugin doesn't work, please set your browser security settings to allow plugins.",
		"videoSet": {
			"success": "Video and OSD settings updated successfully.",
			"videoFailed": "Video settings failed to updated. Please check your network settings or try again later.",
			"osdFailed": "OSD setting failed to updated."
		},
		"creatUser": {
			"passwordweak": "Please enter a stronger password combining digits and letters.",
			"notadmin": "Username admin is for the administrator account only, please use another username.",
			"moreaccount": "At most 5 accounts can be added.",
			"accountused": "Username already exists.",
			"failed": "Account creation failed."
		},
		"removeUser": {
			"noexist": "The account does not exist. ",
			"notarget": "Please select an account to delete.",
			"cannotremove": "The admin account can not be deleted.",
			"confirm": "Are you sure you want to delete this account?"
		},
		"changeUserPwd": {
			"success": "Password changed successfully.",
			"failed": "Failed to change the password.",
			"samepwd":"New password cannot be the same as the current one.",
			"oldpwdwrong":" Old password is incorrect, please re-enter."
		},
		"cloudReg": {
			"success": "Account sign-up successful.",
			"failed": " Account sign-up failed.",
			"emailUsed": "This E-mail address has already been registered, please enter another one.",
			"usernameUsed": "This username has been already registered, please enter another one."
		},
		"cameraBind": {
			"lock": "You account was locked for 2 hours",
			"binded":"The divice has bind to other account.",
			"unbinded":"The divice has unbind by tpCamera APP or cloud user.",
			"bindSuccess": "Camera registration successful.",
			"bindFailed": "Camera registration failed.",
			"networdbreak":"Can not connect to the Internet, please check your network settings and try again.",
			"pwderror":"Incorrect password.",
			"usrerror":"This account does not exist.",
			"ipcnameerror":"Incorrect camera name format, please enter a name with 1 to 12 letters or numbers.",
			"unbindSuccess": "The camera has been deleted from the account successfully.",
			"unbindFailed": "Failed to remove the camera from the account."
		},
		"netconf": {
			"ipsetSuccess": "Network settings updated successfully.",
			"ipsetFailed": "Network settings failed to update.",
			"dangerport":"This port is prohibited by the browser, please enter another one.",
			"ipHasUsed": "This IP address has been used.",
		//	"portHasUsed": "This port has been used.",
			"portDisable": "This port has been occupied by the system.",
			"ipDisable": "This IP address has been occupied in the local area network."
			// "pppoeLoginSuccess": "PPPoE login succeeded.",
			// "pppoeLoginFailed": "PPPoE login failed.",
			// "pppoeLogoutSuccess": "PPPoE logout succeeded.",
			// "pppoeLogoutFailed": "PPPoE logout failed.",
			// "fallbackSuccess": "Fallback IP setting succeeded.",
			// "fallbackFalied": "Fallback IP setting failed."
		},
		"wireless": {
			"setSuccess": "Wireless settings updated successfully.",
			"setFailed": "Wireless settings failed to update.",
			"hasused":"Wireless settings unchanged.",
			"warning":"The camera’s wireless network will change. Make sure the camera and computer are in the same LAN, or your computer won’t be able to access the camera.",
			"wirelessdisconnect":"Network error, please check your network settings and refresh this page.",
			"connectunused1":"The camera is connected to the ",
			"connectunused2":" network.To use this wireless connection, unplug the camera's Ethernet cable.",
			"conncetfailed":"Connection settings failed to update, please check your settings.",
			"scanempty":"No wireless network found, please click the Scan button to refresh the list.",
			"scanFailed":"Wireless scan failed, please click the Scan button to refresh the list."
		},
		"wirelessextender": {
			"setSuccess": "Wireless extender settings updated successfully.",
			"setFailed": "Wireless extender settings failed to update."
		},
		"ddns": {
			"setSuccess": "DDNS settings updated successfully.",
			"setFailed": "DDNS settings failed to updated.",
			"loginSuccess": "DDNS login successful.",
			"loginFailed": "DDNS login failed.",
			"logoutSuccess": "DDNS logout successful.",
			"logoutFailed": "DDNS logout failed."
		},
		"notice": {
			"setSuccess": "Notification servers settings updated successfully.",
			"setFailed": "Notification servers settings failed to updated."
		},
		"smtp": {
			"setSuccess": "E-mail servers setting succeeded.",
			"setFailed": "E-mail servers setting failed.",
			"connectFailed": "Server connection failed.",
			"oooo": "E-mail address connection successful for all recipients.",
			"ooox": "E-mail address connection  failed for recipient 4.",
			"ooxx": "E-mail address connection failed for recipients 3 and 4.",
			"oxxx": "E-mail address connection failed for recipients 2, 3, and 4.",
			"xxxx": "E-mail address connecting failed for all recipients.",
			"xxxo": "E-mail address connection failed for recipients 1, 2 , and 3.",
			"xxoo": "E-mail address connection failed for recipients 1 and 2.",
			"xooo": "E-mail address connection failed for recipient 1.",
			"oxxo": "E-mail address connection failed for recipients 2 and 3.",
			"ooxo": "E-mail address connection failed for recipient 3.",
			"oxoo": "E-mail address connection failed for recipient 2.",
			"oxox": "E-mail address connection failed for recipients 2 and 4.",
			"xoxo": "E-mail address connection failed for recipients 1 and 3.",
			"xoox": "E-mail address connection failed for recipients 1 and 4.",
			"xxox": "E-mail address connection failed for recipients 1, 2, and 4.",
			"xoxx": "E-mail address connection failed for recipients 1, 3, and 4.",
			"pwderror": "Sender e-mail address or password is incorrect. Server connection failed.",
			"sendererror": "Email service is temporarily unavailable. Please try again later. ",
			"testFailed": "E-mail settings test failed."
		},
		"video": {
			"getOsdSuccess": "",
			"getOsdFalied": ""
		},
		"ftp": {
			"setSuccess": "FTP server settings updated successfully.",
			"setFailed": "FTP server connection failed.",
			"loginFailed": "FTP server login failed.",
			"disconnect": "FTP server is not connected",
			"upLoadFailed": "FTP server upload failed, please check your path.",
			"modeError": "FTP servers test failed on this mode, please change to another mode and try again.",
			"testSuccess": "FTP setting test successful.",
			"ftpPowerLow": "FTP server authority limits. Please check your server.",
			"testFailed": "FTP setting test failed.",
			"missusrname":"Please enter a user name.",
			"servererror":"Incorrect server address."
		},
		"sounddetection": {
			"setSuccess": "Sound detection settings updated successfully.",
			"setFailed": "Sound detection server settings failed to updated."
		},
		"motiondetection": {
			"getFailed": "Failed to obtain motion detection configurations.",
			"setSuccess": "Motion detection server settings updated successfully.",
			"setFailed": "Motion detection server settings failed to updated."
		},
		"log": {
			"logFailed": "Log export failed.",
			"clearSuccess":"Log clearing successful.",
			"downloadFailed":"Log download failed.",
			"clearConfirm":"Are you sure you want to clear all logs?",
			"clearFalied":"Log clearing failed."
		},
		"system": {
			"dateSetSuccess": "Date&Time settings updated successfully.",
			"dateSetError":"Date&Time settings failed to updated.",
			"synNtpFailed": "NTP clock synchronization failed.",
			"yearerror": "Incorrect year or time format.",
			"yearoverflow": "Please set a date from 2013-1-11 to 2037-12-31.",
			"timeConflicttimezone":"The time you entered does not match the time zone.",
			"ntpoverflow": "The value of NTP server domain name should contain less than 64 characters.",
			"synServerBreak": "NTP server is not connected.",
			"factoryRestore": "Please specify a file path.",
			"rebootConfirm": "Are you sure you want to reboot the camera?",
			"rebootSuccess": "Rebooting...Please wait.",
			"rebootFailed": "Reboot failed.",
			"restoreConfirm": "Are you sure you want to restore the camera?",
			"factorydefaultSuccess": "Reset successful.",
			"factorydefaultFailed": "Reset failed.",
			"uploadSuccess": "Upload successful.",
			"uploadFailed": "Upload failed.",
			"backupFailed":"Backup failed.",
			"dectectFailed":"IPCamera update detection failed.",
			"newversion":"Your software is up to date.",
			"detectdisconnect":"Network error, please check your network settings and try again.",
			"oldversion":"New software version is available, please click your Download.",
			"upgradeSuccess": "Upgrade successful.",
			"upgradeFailed": "Upgrade failed."
		},
		"tables": {
			"logChangeContainFailed": "Request failed. Please try again later."
		},
		"led": {
			"setFailed": "LED settings failed.",
			"setSuccess":"LED setting is updated successfully."
		},
		"testftp": "FTP service request timed out. Please try again later.",
		"testmail": "SMTP service request timed out. Please try again later."
	},
	"valid": {
		"email": {
			"empty": "The E-mail address cannot be empty.",
			"invalid": "Please enter a valid E-mail address.",
			"limit": "Please enter an E-mail address within 32 characters."
		},
		"smtpRemailAllEmpty": "Please specify at least one recipient E-mail address.",
		"smtpRemail1": {
			"empty":" The first recipient E-mail address cannot be empty.",
			"invalid": "Please enter a valid E-mail address for recipient 1.",
			"limit": "Please enter an E-mail address for recipient 1 within 32 characters."
		},
		"smtpRemail2": {
			//	"empty":" Please specify at least one recipient E-mail address.",
			"invalid": "Please enter a valid E-mail address for recipient 2.",
			"limit": "Please enter an E-mail address for recipient 2 within 32 characters."
		},
		"smtpRemail3": {
			//	"empty":"Please specify at least one recipient E-mail address.",
			"invalid": "Please enter a valid E-mail address for recipient 3.",
			"limit": "Please enter an E-mail address for recipient 3 within 32 characters."
		},
		"smtpRemail4": {
			//	"empty":" Please specify at least one recipient E-mail address.",
			"invalid": "Please enter a valid E-mail address for recipient 4.",
			"limit": "Please enter an E-mail address for recipient 4 within 32 characters."
		},
		"smtpSender": {
			"empty": " Please specify a sender E-mail address.",
			"invalid": "Please enter a valid E-mail address for the sender.",
			"limit": "Please enter an E-mail address for the sender within 32 characters."
		},
		"accountUsername": {
			"empty": "The user name cannot be empty.",
			"invalid": "Permitted user name characters: digits, letters, and -_@.",
			"limit": "Please enter a user name within 20 characters."
		},
		"cloudUsername": {
			"exists": "Account already exists.", 
			"empty": "Account cannot be empty.",
			"invalid": "Permitted cloud username characters: digits, letters, and -_.", 
			"limit": "Please enter a account within 32 characters."
		},
		"pppoeUsername": {
			"empty": "PPPoE user name cannot be empty.",
			"invalid": "Please enter a valid user name.",
			"limit": "Please enter a user name within 118 characters."
		},
		"ftpUsername": {
			"empty": "FTP user name cannot be empty.",
			"invalid": "Please enter a valid FTP user name.",
			"limit": "Please enter a FTP user name within 32 characters."
		},
		"ddnsUsername": {
			"empty": "DDNS user name cannot be empty.",
			"invalid": "Please enter a valid user name.",
			"limit": "Please enter a user name within 31 characters."
		},
		"smtpUsername": {
			"empty": "E-mail user name cannot be empty.",
			"invalid": "Please enter a valid user name.",
			"limit": "Please enter a user name within 63 characters."
		},
		"ip": {
			"empty": "The IP address cannot be empty.",
			"loopback":"A loopback address can’t be used here.",
			"multicast":"A multicast address can’t be used here.",
			"limit": "Invalid IP address format."
		},
		"service": {
			"empty":"The service address cannot be empty.",
			"invalid":"Please enter a valid service address."
		},
		"mask": {
			"empty": "The subnet mask cannot be empty.",
			"invalid": "Invalid subnet mask. Please enter another one. (eg: 255.255.255.0)"
		},
		"domain": {
			"empty": "The E-mail sender server  cannot be empty.",
			"invalid": "Invalid E-mail sender server. Please enter another one.",
			"limit": "Please enter a valid E-mail sender server within 63 characters."
		},
		"gw": {
			"empty": "The gateway cannot be empty.",
			"loopback":"A loopback address can’t be used here.",
			"multicast":"A multicast address can’t be used here.",
			"limit": "Invalid gateway address format."
		},
		"dns": {
			"empty": "The DNS server cannot be empty.",
			"loopback":"A loopback address cannot be used here.",
			"multicast":"A multicast address cannot be used here.",
			"limit": "Invalid DNS server address format."
		},
		"port": {
			"empty": "The port cannot be empty",
			"invalid": "Please enter a valid port ID (1~65535)."
		},
		"ftpport": {
			"empty": "The FTP port cannot be empty",
			"invalid": "Please enter a valid FTP port ID (1~65535)."
		},
		"smtpport": {
			"empty": "The E-mail server port cannot be empty.",
			"invalid": "Please enter a valid E-mail servers port ID (1~65535)."
		},
		"mac": {
			"empty": "The MAC address cannot be empty",
			"invalid": "Please enter a valid MAC address."
		},
		"num": {
			"empty": "The num cannot be empty.",
			"invalid": "Please enter a valid num."
 		},
		"timeoffset": {
			"empty": "The time offset cannot be empty.",
			"max": "Please enter a number less than 720",
			"min": "Please enter a number greater than 0",
			"invalid": "Please enter a number between 0 and 720."
		},
		"cameraname": {
			"empty": "The camera name cannot be empty.",
			"limit": "Please enter a camera name within 30 characters.",
			"invalid": "Permitted camera name characters: digits, letters, and .-_'@"
		},
		"password": {
			"empty": "The password cannot be empty.",
			"limit": "Please enter a valid password with 5 to 20 characters.",
			"cloudlimit": "Please enter a valid password with 6 to 20 characters.",
			"invalid": "Permitted password characters: digits, letters, and !#$&()+,-.;=[]^_`{}~",
			"inerror":"Password is incorrect.",
			"confirm": "Passwords do not match.",
			"accept":"In order to use our services, you must agree to TP-Link's Terms of Service.",
			"pppoeconfirm": "PPPoE passwords do not match."
		},
		"ftppassword": {
			"empty": "The password cannot be empty.",
			"limit": "Please enter a valid password within 0 to 63 characters.",
			"invalid": "Permitted FTP password characters: digits, letters, and !#$&()+,-.;=[]^_`{}~"
 		},
		"pppoePassword": {
			"empty": "PPPoE password cannot be empty.",
			"limit": "Please enter a valid password within 118 characters.",
			"invalid": "PPPoE password is incorrect."
 		},
		"ddnspassword": {
			"empty": "The password cannot be empty.",
			"limit": "Please enter a valid password within 1 to 31 characters.",
			"invalid": "DDNS password is incorrect."
 		},
		"smtpPassword": {
			"empty": "The password cannot be empty.",
			"limit": "Please enter a valid password within 1 to 63 characters.",
			"invalid": "SMTP password is incorrect." 
		},
		"cloudPassword": {
			"empty": "The password cannot be empty.",
			"limit": "Please enter a valid password within 6 to 20 characters.",
			"invalid": "Permitted password characters: digits, letters, and -_.!@#$%^&*" 
		},
		"ftp": {
			"empty": "The FTP address cannot be empty.",
			"invalid": "Incorrect FTP address. Please enter a valid FTP address.",
			"unamenull": "Please enter a user name if you have entered a password."
		},
		"asc2": {
			"invalid": "Please enter ASCⅡ characters."
		},
		"hex": {
			"invalid": "Please enter hexadecimal characters."
		},
		"path": {
			"empty": "The path cannot be empty.",
			"limit": "Please enter a valid path within 1 to 63 characters.",
			"invalid": "Permitted path characters: digits, letters, and !#$&()+,-.;=[]^_`{}~"
		},
		"wpaWpa2Psk": {
			"limit": "PSK passphrase must be 8 to 64 characters. Please enter another one.",
			"error": "PSK passphrase contains illegal characters. Please enter another one.",
			"inerror":"Incorrect password."
		},
		"ssid": {
			"asc2limit": "Wireless Network Name must be 1 to 32 ASCII characters. Please enter another one."
		},
		"osdtext": {
			"limit": "Please enter a valid on-screen display within 1 to 20 characters.",
			"illegal" : "Invalid OSD text. Only digits, letters, spaces and hyphens are allowed."
		},		
		"wepkey": {
			"limit": "WEP passphrase must be 5,13,10,or 26 characters. Please enter another one.",
			"error": "WEP passphrase contains illegal characters. Please enter another one.",
			"inerror":"Incorrect password."
		},
		"nolog": "No logs"
	},
	/****************************************************************************************************************/
	"plug" : {
		"Download" : "Download",
		"Cancel" : "Cancel",
		"Logout" : "Logout",
		"Delete" : "Delete",
		"Clear" : "Clear",
		"Change" : "Change",
		"Reboot" : "Reboot",
		"Reset" : "Reset"
	},	

	"index" : {
		//"camera-descr-nc200" : "Cloud Camera, 300Mbps Wi-Fi",
		//"camera-descr-nc220" : "Day/Night Cloud Camera, 300Mbps Wi-Fi",
		"camera-descr" : "HD Day/Night Cloud Camera, 300Mbps Wi-Fi",
		//"camera-descr-nc450" : "HD Day/Night Cloud Camera, 300Mbps Wi-Fi",
		//"camera-nc200" : "NC200",
		//"camera-nc220" : "NC220",
		"camera-type" : "NC210",
		//"camera-nc450" : "NC450",


		"nav-live_view" : "视频",
		"nav-status": "状态",
		"nav-basic" : "基础设置",
		"nav-network" : "网络",
		"nav-wireless_connection" : "无线连接",
		"nav-cloud" : "云设置",
		"nav-led" : "显示灯",
		"nav-advanced" : "高级设置",
		"nav-wireless_extender"  : "无线扩展",
		"nav-ddns" : "DDNS",
		"nav-video" : "视频设置",
		"nav-motion_detection" : "动作捕捉",
		"nav-sound_detection" : "声音捕捉",
		"nav-notification" : "通知设置",
		"nav-account" : "账户",
		"nav-dateandtime" : "日期与时间",
		"nav-management" : "系统管理",
		"nav-log" : "系统日志",
		"nav-system" : "系统设置",
		"snapshot" : "截图",
		"record-start" : "录像",
		"record-stop" : "停止录像",
		"filp" : "翻转",
		"mirror" : "镜面翻转",
		"dayandnight" : "白天&夜间",
		"zoom" : "缩放",
		"volume" : "音量",
		"fullscreen" : "全屏",
		"dayctrl-auto" : "自动",
		"dayctrl-day" : "白天",
		"dayctrl-night" : "夜晚",
		"brightness" : "亮度",
		"contrast" : "对比度",
		"saturation" : "饱和度",
		"resolution" : "分辨率:",
		"preset" : "还原预设"
	},

	"status" : {
		"legend-basic" : "基本状态",
		"legend-cloud" : "云服务",
		"legend-wireless" : "无线",
		"legend-network" : "网络",
		"legend-pppoe" : "PPPoE",
		"legend-videoprofile1" : "视频设置1",
		"legend-videoprofile2" : "视频设置2",
		"basic-camearname" : "设备名称:",
		"basic-model" : "设备型号:",
		"basic-firmware" : "设备版本:",
		"basic-viewers" : "当前观察人数:",
		"cloud-connecState" : "连接状态:",
		"cloud-username" : "用户名:",
		"wireless-connecState" : "连接状态:",
		"wireless-wirelessName" : "无线网络名称:",
		"wireless-channel" : "信道:",
		"wireless-signal" : "信号强度:",
		"wireless-security" : "加密方式:",
		"network-connectType" : "连接类型:",
		"networks-macAddr" : "物理地址:",
		"network-lanIP" : "局域网IP地址:",
		"network-submask" : "子网掩码:",
		"network-gateway" : "默认网关:",
		"network-pds" : "首选DNS:",
		"wireless-sds" : "备选DNS:",
		"pppoe-status" : "状态:",
		"pppoe-wanIP" : "广域网IP地址:",
		"videoprofile1-resolution" : "分辨率:",
		"videoprofile1-frameRate" : "帧率:",
		"videoprofile1-imageQuality" : "图像质量:",
		"videoprofile1-lightFre" : "刷新频率:",
		"videoprofile2-resolution" : "分辨率:",
		"videoprofile2-frameRate" : "帧率:",
		"videoprofile2-imageQuality" : "图像质量:",
		"videoprofile2-lightFre" : "刷新频率:"
	},

	"network" : {
		"legend-IPaddr" : "IP地址",
		"title-IPmodel" : "IP模式",
		"dynmicIP" : "动态IP",
		"staticIP" : "静态IP",
		"macAddr" : "物理地址",
		"IPaddr" : "IP地址:",
		"subMask" : "子网掩码:",
		"gateway" : "默认网关:",
		"pds" : "首选DNS:",
		"sds": "备选DNS:",
		"fallbackIP" : "回退IP:",
		"legend-pppoe" : "PPPoe",
		"title-pppoe" : "PPPoe:",
		"radio-enable" : "开启",
		"radio-disable" : "关闭",
		"pppoe-status" : "状态:",
		"pppoe-username" : "用户名:",
		"passwd" : "密码:",
		"legend-http" : "HTTP",
		"http-port" : "端口:",
		"legend-upnp" : "UPnP",
		"title-upnp" : "UPnP:",
		"upnp-name" : "名称:",
		"legend-bonjour" : "Bonjour",
		"title-bonjour" : "Bonjour:",
		"bonjour-name" : "Bonjour 名称:",
		"save" : "保存"
	},

	"wirelessConnect" : {
		"legend-wirelessConnect" : "无线连接",
		"title-wirelessConnect" : "无线连接:",
		"radio-enable" : "开启",
		"radio-disable" : "关闭",
		"wireless-list" : "无线列表:",
		"scan" : "扫描",
		"refresh" : "刷新",
		"wirelessname" : "无线名称:",
		"auto" : "自动",
		"manually" : "手动",
		"passwd" : "密码:",
		"show-passwd" : "显示密码",
		"security" : "加密方式:",
		"wep-key-index" : "Wep Key Index:",
		"encryption" : "Encryption:",
		"connect" : "连接",
		"listWirelessname" : "无线名称",
		"listSignal" : "信号", 
		"listSecurity" : "认证方式", 
		"listEncryption" : "加密方式", 
		"listChannel" : "信道",
		"listMacAddr" : "物理地址", 
		"listHtExtCha" : "HtExtCha"
	},

	"cloudSetting" : {
		"legend-cloudSetting" : "Cloud Setting",
		"noAccount-tips" : "Don't have an account?",
		"add-tips" : "Add your camera to Cloud account ",
		"input-tips" : "Please enter your Cloud account and password:",
		"account" : "Account:",
		"cameraName" : "Camera Name:",
		"link-tips" : "With Cloud service, you can view your cloud cameras anytime and anywhere over the Internet. Go to",
		"registered-tips" : "The camera has been added to the TP-Link Cloud account.",
		"cloudAccount" : "Cloud Account:",
		"email" : "Email:",
		"username" : "Username:",
		"passwd" : "Password:",
		"confirm-passwd" : "Confirm Password:",
		"accept-tips" : "I accept the TP-Link Cloud",
		"privacyPolicy" : "Privacy Policy",
		"termsOfUse" : "Terms of Use",
		"register" : "Register",
		"refresh" : "Refresh",
		"reRegister" : "Reregister",
		"deRegister" : "Deregister",
		"back" : "Back",
		"signup" : "Sign up"
	},

	"wirelessEx" : {
		"legend-wirelessEx" : "Wireless Extender",
		"radio-enable" : "Enable",
		"radio-disable" : "Disable",
		"hostname" : "Host Wireless Network Name:",
		"exname" : "Extended Wireless Network",
		"sameAsHost" : "Same as Host",
		"security" : "Security:",
		"wep-key-index" : "Wep Key Index:",
		"passwd" : "Password:",
		"show-passwd" : "show password",
		"encryption" : "Encryption:",
		"maxCli" : "Max Clients:",
		"save" : "Save"
	},

	"ddns" : {
		"legend-ddns" : "DDNS",
		"serviceProvider" : "Service Provider:",
		"gotoRegister" : "Goto register...",
		"username" : "Username:",
		"passwd" : "Password:",
		"domainName" : "Domain Name:",
		"connectionStatus" : "Connection Status:",
		"logout" : "Logout",
		"login" : "Login",
		"save" : "Save"
	},

	"motionDetect" : {
		"legend-motionDetect" : "Motion Detection",
		"title-motionDetect" : "Motion Detection:",
		"radio-enable" : "Enable",
		"radio-disable" : "Disable",
		"sensitivity" : "Sensitivity:",
		"high" : "High",
		"medium" : "Medium",
		"low" : "Low",
		"save" : "Save",
		"clear" : "Clear",
		"drag-tips" : "Tips:Drag the mouse to draw the areas you want to monitor."
	},

	"soundDetect" : {
		"legend-soundDetect" : "Sound Detection",
		"title-soundDetect" : "Sound Detection:",

		"radio-enable" : "Enable",
		"radio-disable" : "Disable",

		"sensitivity" : "Sensitivity:",
		"high" : "High", 
		"medium" : "Medium",
		"low" : "Low",

		"silence" : "Silence",
		"whisper" : "Whisper",
		"quietHome" : "Quiet home",
		"hairDryer" : "Hair dryer",
		"noisyOffice" : "Noisy office",
		"lawnMower" : "Lawn mower",
		"currentSound" : "Current Sound",

		"save" : "Save",

		"drag-tips" : "Tips:You can also drag the arrow to set the threshold for sound detection"
	},

	"videosetting" : {
		"video" : "Video",
		"videoProfile1" : "Video Profile 1:",
		"videoProfile2" : "Video Profile 2:",
		"codingFormat" : "Coding Format",
		"resolution" : "Resolution",
		"frameRate" : "Frame Rate",
		"mode" : "Mode",
		"imageQuality" : "Image Quality",
		"high" : "High",
		"medium" : "Medium",
		"low" : "Low",
		"lightFre" : "Light Frequency:",
		"auto" : "Auto",
		"backlight" : "Backlight Compensation:",
		"radio-enable" : "Enable",
		"radio-disable" : "Disable",
		"timeStamp-osd" : "Time Stamp&On-Screen Display (OSD):",
		"osd-text" : "OSD Text:",
		"save" : "Save"
	},

	"notification" : {
		"legend-Notification" : "Notification Delivery",
		"target" : "Target:",
		"ftp" : "FTP",
		"ftp-serverPort" : "FTP Server/Port:",
		"username" : "Username:",
		"passwd" : "Password:",
		"path" : "Path:",
		"passiveMode" : "Passive Mode:",
		"test" : "Test",
		"email" : "Email",
		"recipientAddr" : "Recipient E-mail Address:",
		"addRecipient" : "Add recipient",
		"delete" : "Delete",
		"sendAddr" : "Sender E-mail Address:",
		"smtp-serverPort" : "SMTP Server/Port:",
		"sslEncryption" : "SSL Encryption:",
		"sendInterval" : "Sending Interval:",
		"smtp-note" : "Note:If you want to set Hotmail as sender E-mail Address, you need to set SMTP Server/Port as smtp-mail.outlook.com:25 (Or 587), and SSL Encryption as STARTTLS. If you want to set Gmail as sender E-mail Address, please refer to this link: ",
		"save" : "Save"
	},

	"account" : {
		"legend-account" : "Account",
		"add" : "Add",
		"delete" : "Delete",
		"addNewTip" : "Add a New User Account",
		"username" : "Username:",
		"passwd" : "Password:",
		"confirm-passwd" : "Confirm Password:",
		"changePwd" : "Change Password",
		"currentUsr" : "Current User:",
		"oldPwd" : "Old Password:",
		"newPwd" : "New Password:",
		"confirm-passwd" : "Confirm Password:",
		"save" : "Save",
		"listUserName" : "User Name", 
		"listUserGrop" : "User Group"
	},

	"dateTime" : {
		"legend-dateTime" : "Date/Time",
		"timeConf" : "Time Configuration:",
		"currentTime" : "Current Time:",
		"timeZone" : "Time Zone:",
		"enable-daySave" : "Enable Daylight Saving Time",
		"automatically" : "Automatically",
		"manually" : "Manually",
		"timeOffset" : "Time Offset:",
		"startTime" : "Start Time:",
		"First" : "First",
		"Second" : "Second",
		"Third" : "Third",
		"Fourth" : "Fourth",
		"Fifth" : "Fifth",
		"Sixth" : "Sixth",
		"Sunday" : "Sunday",
		"Monday" : "Monday",
		"Tuesday" : "Tuesday",
		"Wednesday" : "Wednesday",
		"Thursday" : "Thursday",
		"Friday" : "Friday",
		"Saturday" : "Saturday",
		"January" : "January",
		"February" : "February",
		"March" : "March",
		"April" : "April",
		"May" : "May",
		"June" : "June",
		"July" : "July",
		"Augest" : "Augest",
		"September" : "September",
		"October" : "October",
		"November" : "November",
		"December" : "December",
		"at" : "at",
		"endTime" : "End Time:",
		"in" : "in",
		"auto-timeConf" : "Automatic Time Configuration:",
		"sns" : "Synchronize With NTP Server",
		"ntpService" : "NTP Service",
		"set-ntpFromDynIP" : "Set NTP Server from Dynamic IP",
		"set-date-manually" : "Set Date And Time Manually:",
		"year" : "year",
		"month" : "month",
		"day" : "day",
		"hour" : "hour",
		"minute" : "minute",
		"second" : "second",
		"copy-timeSetting" : "Copy Your Computer's Time Settings",
		"save" : "Save",
		"autoTimezoom" : "Auto Timezone",
		"Timezoom0" : "(GMT-12:00) International Date Line West",
		"Timezoom1" : "(GMT-11:00) Midway Island, Samoa",
		"Timezoom2" : "(GMT-10:00) Hawaii",
		"Timezoom3" : "(GMT-09:00) Alaska",
		"Timezoom4" : "(GMT-08:00) Pacific Time (US &amp; Canada); Tijuana",
		"Timezoom5" : "(GMT-07:00) Mountain Time (US &amp; Canada)",
		"Timezoom6" : "(GMT-07:00) Chihuahua",
		"Timezoom7" : "(GMT-07:00) La Paz, Mazatlan",
		"Timezoom8" : "(GMT-07:00) Arizona",
		"Timezoom9" : "(GMT-06:00) Saskatchewan",
		"Timezoom10" : "(GMT-06:00) Guadalajara, Mexico City, Monterrey",
		"Timezoom11" : "(GMT-06:00) Central Time (US &amp; Canada)",
		"Timezoom12" : "(GMT-06:00) Central America",
		"Timezoom13" : "(GMT-05:00) Indiana (East)",
		"Timezoom14" : "(GMT-05:00) Eastern Time (US &amp; Canada)",
		"Timezoom15" : "(GMT-05:00) Bogota, Lima, Quito",
		"Timezoom16" : "(GMT-04:30) Caracas",
		"Timezoom17" : "GMT-04:00) Santiago",
		"Timezoom18" : "(GMT-04:00) La Paz",
		"Timezoom19" : "(GMT-04:00) Atlantic Time (Canada)",
		"Timezoom20" : "(GMT-03:30) Newfoundland",
		"Timezoom21" : "(GMT-03:00) Greenland",
		"Timezoom22" : "(GMT-03:00) Buenos Aires, Georgetown",
		"Timezoom23" : "(GMT-03:00) Brasilia",
		"Timezoom24" : "(GMT-02:00) Mid-Atlantic",
		"Timezoom25" : "(GMT-01:00) Cape Verde Is.",
		"Timezoom26" : "(GMT-01:00) Azores",
		"Timezoom27" : "(GMT) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London",
		"Timezoom28" : "(GMT) Casablanca",
		"Timezoom29" : "(GMT) Monrovi",
		"Timezoom30" : "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
		"Timezoom31" : "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
		"Timezoom32" : "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris",
		"Timezoom33" : "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
		"Timezoom34" : "(GMT+01:00) West Central Africa",
		"Timezoom35" : "(GMT+02:00) Athens",
		"Timezoom36" : "(GMT+02:00) Bucharest",
		"Timezoom37" : "(GMT+02:00) Cairo",
		"Timezoom38" : "(GMT+02:00) Harare, Pretoria,Minsk",
		"Timezoom39" : "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
		"Timezoom40" : "(GMT+02:00) Jerusalem",
		"Timezoom41" : "(GMT+03:00) Baghdad, Istanbul",
		"Timezoom42" : "(GMT+03:00) Kuwait, Riyadh",
		"Timezoom43" : "(GMT+03:00) Moscow,Volgograd,Nairobi",
		"Timezoom44" : "(GMT+03:00) St.Petersburg",
		"Timezoom45" : "(GMT+03:30) Tehran",
		"Timezoom46" : "(GMT+04:00) Abu Dhabi, Muscat,Tbilisi, Yerevan",
		"Timezoom47" : "(GMT+04:00) Baku",
		"Timezoom48" : "(GMT+04:30) Kabul",
		"Timezoom49" : "(GMT+05:00) Ekaterinburg",
		"Timezoom50" : "(GMT+05:00) Islamabad, Karachi, Tashkent",
		"Timezoom51" : "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
		"Timezoom52" : "(GMT+05:45) Kathmandu",
		"Timezoom53" : "(GMT+06:00) Almaty, Novosibirsk",
		"Timezoom54" : "(GMT+06:00) Astana, Dhaka",
		"Timezoom55" : "(GMT+06:00) Sri Jayawardenepura",
		"Timezoom56" : "(GMT+06:30) Rangoon",
		"Timezoom57" : "(GMT+07:00) Bangkok, Hanoi, Jakarta",
		"Timezoom58" : "(GMT+07:00) Krasnoyarsk",
		"Timezoom59" : "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
		"Timezoom60" : "(GMT+08:00) Irkutsk",
		"Timezoom61" : "(GMT+08:00) Ulaan Bataar",
		"Timezoom62" : "(GMT+08:00) Kuala Lumpur, Singapore",
		"Timezoom63" : "(GMT+08:00) Perth",
		"Timezoom64" : "(GMT+08:00) Taipei",
		"Timezoom65" : "(GMT+09:00) Osaka",
		"Timezoom66" : "(GMT+09:00) Seoul",
		"Timezoom67" : "(GMT+09:00) Yakutsk",
		"Timezoom68" : "GMT+09:30) Adelaide",
		"Timezoom69" : "(GMT+10:00) Brisbane",
		"Timezoom70" : "(GMT+10:00) Canberra, Melbourne, Sydney",
		"Timezoom71" : "(GMT+10:00) Guam, Port Moresby",
		"Timezoom72" : "(GMT+10:00) Hobart",
		"Timezoom73" : "(GMT+10:00) Vladivostok",
		"Timezoom74" : "(GMT+11:00) Magadan, Solomon Is., New Caledonia",
		"Timezoom75" : "(GMT+12:00) Auckland, Wellington",
		"Timezoom76" : "(GMT+12:00) Fiji",
		"Timezoom77" : "(GMT+12:00) Kamchatka, Marshall Is."
	},

	"sysmanage" : {		
		"reboot" : "Reboot",
		"reboot-yourcamera" : "Reboot your camera:",
		"back-and-restore" : "Backup and Restore",
		"backup-currentSetting" : "Back up current settings:",
		"backup" : "Backup",
		"restore-backup-setting" : "Restore settings from a backup file:",
		"browser" : "Browser",
		"restore" : "Restore",
		"restore-default-setting" : "Restore factory default settings:",
		"reset" : "Reset",
		"update" : "Update",
		"upgrade-harddisk" : "Upgrade from a file on your hard disk:",
		"upgrade" : "Upgrade",
		"software-update" : "Software update:",
		"download" : "Download",

		"detect-tips" : "Your software version is the latest one.",
		"upgrademaxsize": "File size must be less than 8M.",
		"restoreminsize": "File size must be greater than 1K.",
		"restoremaxsize": "File size must be less than 20K.",
		"upgrademinsize": "File size must be greater than 2M.",
		"upgradename": "Please select a correct upgrade file.",
		"restorename": "Please select a compatible restoration file.",

		"management": "Management",
		"rebooting": "Rebooting...",
		"resetting": "Resetting...",
		"restoretitle":"Restore",
		"restoring": "Restoring...",
		"upgrading": "Upgrading...",
		"upgradetitle":"Upgrade",
		"reboottitle":"Reboot",
		"factitle":"Factory Defaults",
	},

	"syslog" : {
		"systemLog" : "System Log",
		"clear-log" : "Clear",
		"save-log" : "Save Log",
		"refresh" : "Refresh",

		"Time" : "Time", 
		"Module" : "Module", 
		"Level" : "Level", 
		"Content" : "Content",
		"ALL" : "ALL", 
		"UserManage" : "UserManage", 
		"DateTime" : "UserManage", 
		"UPnP" : "UPnP", 
		"Cloud" : "Cloud",
		"NetSwitch" : "NetSwitch",
		"Wireless" : "Wireless", 
		"NetConfig" : "NetConfig", 
		"Ddns" : "Ddns", 
		"SMTP" : "SMTP", 
		"FTP" : "FTP", 
		"DynDdns" : "DynDdns", 
		"MotionDetection" : "MotionDetection", 
		"Bonjour" : "Bonjour", 
		"VideoControl" : "VideoControl", 
		"System" : "System",
		"EMERG" : "EMERG", 
		"ALERT" : "ALERT", 
		"CRIT" : "CRIT", 
		"ERR" : "ERR", 
		"WARNING" : "WARNING", 
		"NOTICE" : "NOTICE", 
		"INFO" : "INFO", 
		"DEBUG" : "DEBUG"	
	},

	"led" : {
		"legend-led" : "LED",
		"title-led" : "LED:",
		"on" : "On",
		"off" : "Off",
		"save" : "Save"
	}
};

