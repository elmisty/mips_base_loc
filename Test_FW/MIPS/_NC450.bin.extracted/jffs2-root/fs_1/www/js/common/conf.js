var DAYNIGHTMODE_AUTO 		= 1;
var DAYNIGHTMODE_DAY_MODE 	= 2;
var DAYNIGHTMODE_NIGHT_MODE = 3;
var STREAMRESOLUTION_VGA 	= 0;		// 640*480
var STREAMRESOLUTION_QVGA 	= 1;		// 320*240
var STREAMRESOLUTION_HD		= 2;		// 1280*720
var STREAMTYPE_H264         = 2;
var AUDIOSTREAMTYPE_AAC		= 2;        //AAC

var conf = {
	isAdimn:null,
	ProductType: null,
	ResolutionMode: "HD",
	streamresolution: STREAMRESOLUTION_HD,
	streamType: STREAMTYPE_H264,
	audiostreamtype: AUDIOSTREAMTYPE_AAC,
	playerSize: {width:768,height:432},

	confIndexDisplay:function(CameraType){//configure display info on index.html than depends on product type
		//display description info about camera
		var temp;
		temp = $("#CameraDes").attr("i18n");
		temp = temp + CameraType
		
		$("#CameraDes").attr("i18n",temp);

		temp = $("#CameraTyp").attr("i18n");
		temp = temp + CameraType
		
		$("#CameraTyp").attr("i18n",temp);

		//display ddns&wirelessextender menu or not
		if(CameraType == "NC220" ||
		   CameraType == "NC230" ||
		   CameraType == "NC250"
		){
			//$("#nav-advanced-child-ddns").show();
			$("#nav-advanced-child-ddns").hide();
			$("#nav-advanced-child-wirelessEx").show();
		}
		else
		{
			if(CameraType == "NC210")
			{
				$("#nav-advanced-child-notification").hide();
			}
			$("#nav-advanced-child-ddns").hide();
			$("#nav-advanced-child-wirelessEx").hide();			
		}

		//display sd&ptz menu or not
		if(CameraType !="NC450")
		{
			if(CameraType != "NC260")// NC450 and NC 260 support sd card
			{
				$("#nav-advanced-child-sd").hide();
			}
			$("#yuntaiControl").hide();//only NC450 supports ptz

		}
		else if(CameraType =="NC450" || CameraType == "NC260")//init sd data or not
		{
			SD.MODULE.getSdState({preinit : true});
		}			
	},
	confWirelessDisplay:function(CameraType){
		if("NC210" == CameraType)
		{
			$("#wireless_connection_model").hide();
		}
	},
	confNetworkDisplay:function(CameraType){//configure network.html display info on product type
		if(CameraType == "NC220" ||
		   CameraType == "NC230" ||
		   CameraType == "NC250"
		){
			$("#content-network-pppoe").hide();
			$("#content-network-upnp").hide();
		}
		else
		{
			$("#content-network-pppoe").hide();
			$("#content-network-upnp").hide();		
		}
	},
	confSmtpDisplay:function(CameraType){
		$("#smtp-check").show();
	},
	confftpDisplay:function(CameraType)
	{
		if(("NC260" == CameraType) || ("NC450" == CameraType))
		{
			$("#ftp-check").show();
		}
		else
		{
			$("#ftp-check").show();
		}
	},
	confVideosettingDisplay:function(CameraType){
		if(CameraType == "NC220")
		{
			$("#videoprofile2info").show();
		}
		else
		{
			$("#videoprofile2info").hide();
		}
	},
	confStatusDisplay:function(CameraType){
		if(CameraType == "NC220")
		{
			$("#videoprofile2").show();
		}
		else
		{
			$("#videoprofile2").hide();
		}
	}
};
	