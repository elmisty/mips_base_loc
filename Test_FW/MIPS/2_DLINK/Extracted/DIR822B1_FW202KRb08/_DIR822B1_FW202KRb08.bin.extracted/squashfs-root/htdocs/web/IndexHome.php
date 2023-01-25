<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns= "http://www.w3c.org/1999/xhtml">

<head>
<title>D-LINK</title>
<meta http-equiv="X-UA-Compatible" content="IE=9">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width">
<script type="text/javascript" charset="utf-8" src="/js/initialJS.js?v=20200423094010"></script>
<script type="text/javascript" charset="utf-8" src="/js/initialCSS.js?v=20200423094010"></script>
<script type="text/javascript" charset="utf-8" src="/js/initialJQ.js?v=20200423094010"></script>
</head>
<body>
	<iframe class="login_frame" id="defaultframe" src="" frameborder="0" width="100%" height="100%"></iframe>
</body>
<script type="text/javascript">
	var HNAP = new HNAP_XML();
	var xml_GetOperationMode = HNAP.GetXML("GetOperationMode");
	var device_layout = xml_GetOperationMode.Get("GetOperationModeResponse/OperationModeList/CurrentOPMode");
	//var onepage = "<? echo get('', '/runtime/devdata/onepage');?>";
	var onepage = "<? echo get('', '/runtime/devdata/countrycode');?>";

	var isMobile = false;
	if(navigator.userAgent.match(/Android|webOS|iPhone|iPod|BlackBerry/i))
	{
		isMobile = true;
	}

	if(isMobile)
		location.replace('/MobileHome.html');
	else
	{
		//if(onepage == 1)
		if(onepage == "CN")
			location.replace('/onepage.php');
		else if(device_layout == "WirelessBridge" || device_layout.indexOf("WirelessRepeater") == 0)
			location.replace('/WiFi.html');
		else
			location.replace('/Home.html');
	}
</script>
</html>
