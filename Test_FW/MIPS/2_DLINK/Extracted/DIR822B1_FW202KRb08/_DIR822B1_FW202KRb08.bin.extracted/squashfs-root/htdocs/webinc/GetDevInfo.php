HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<? echo "\<\?xml version='1.0'\?\>"; ?>
<Device_Information>
	<Firmware_External_Version>V<? echo cut(fread("", "/etc/config/buildver"), "0", "\n");?></Firmware_External_Version>
	<Firmware_Internal_Version>V<? echo cut(fread("", "/etc/config/buildver"), "0", "\n");?><?echo cut(fread("", "/etc/config/buildrev"), "0", "\n");?></Firmware_Internal_Version>
	<Model_Name><? echo query("/runtime/device/modelname");?></Model_Name>
	<Hardware_Version><? echo query("/runtime/device/hardwareversion");?></Hardware_Version>
	<Country_Code><? echo query("/runtime/devdata/countrycode");?></Country_Code>
	<Language><? echo map("/runtime/device/langcode", "", "EN", "*", query("/runtime/device/langcode"));?></Language>
	<LAN_MAC><? echo query("/runtime/devdata/lanmac");?></LAN_MAC>
	<WAN_MAC><? echo query("/runtime/devdata/wanmac");?></WAN_MAC>
	<LAN_MAC_2.4G><? echo query("/runtime/devdata/wlanmac");?></LAN_MAC_2.4G>
	<LAN_MAC_5G><? echo query("/runtime/devdata/wlanmac2");?></LAN_MAC_5G>
	<LAN_MAC_5G_Low><? echo query("/runtime/devdata/wlanmac2");?></LAN_MAC_5G_Low>
	<LAN_MAC_5G_High><? echo query("/runtime/devdata/wlanmac3");?></LAN_MAC_5G_High>
	<SSID_2.4G><? include "/htdocs/phplib/xnode.php"; $path = XNODE_getpathbytarget("/wifi", "entry", "uid", "WIFI-1", "0"); echo get(h,$path."/ssid");?></SSID_2.4G>
	<SSID_5G><? include "/htdocs/phplib/xnode.php"; $path = XNODE_getpathbytarget("/wifi", "entry", "uid", "WIFI-3", "0"); echo get(h,$path."/ssid");?></SSID_5G>
	<SSID_5G_Low><? include "/htdocs/phplib/xnode.php"; $path = XNODE_getpathbytarget("/wifi", "entry", "uid", "WIFI-3", "0"); echo get(h,$path."/ssid");?></SSID_5G_Low>
	<SSID_5G_High><? include "/htdocs/phplib/xnode.php"; $path = XNODE_getpathbytarget("/wifi", "entry", "uid", "WIFI-5", "0"); echo get(h,$path."/ssid");?></SSID_5G_High>
	<Reboot_Time>300</Reboot_Time>
	<Factory_default_Flag><? echo map("/runtime/device/devconfsize", "0", "TRUE", "*", "FALSE");?></Factory_default_Flag>
</Device_Information>
