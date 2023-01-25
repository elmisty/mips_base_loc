<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

include "/htdocs/webinc/config.php";
include "/htdocs/phplib/inet.php";

$result = "OK";
$dmz_path = "/nat/entry/dmz";
$sdmz_path = "/nat/entry/sdmz";
if(get("", $dmz_path."/enable")=="1" && get("", $sdmz_path."/enable")=="0")
{
	$enabledmz = "true";
	$enablesdmz = "false";
	$ipaddr = ipv4ip(get("", INET_getpathbyinf($LAN1)."/ipv4/ipaddr"), get("", INET_getpathbyinf($LAN1)."/ipv4/mask"), get("", $dmz_path."/hostid"));
	$macaddr = "";
}
else if(get("", $dmz_path."/enable")=="0" && get("", $sdmz_path."/enable")=="1")
{
	$enabledmz = "false";
	$enablesdmz = "true";
	$ipaddr = "";
	$macaddr = get("", $sdmz_path."/mac");
}
else
{
	$enabledmz = "false";
	$enablesdmz = "false";
	$ipaddr = "";
	$macaddr = "";
}

?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
		<GetDMZSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
			<GetDMZSettingsResult><?=$result?></GetDMZSettingsResult>
			<EnabledDMZ><?=$enabledmz?></EnabledDMZ>
			<EnabledSDMZ><?=$enablesdmz?></EnabledSDMZ>
			<IPAddress><?=$ipaddr?></IPAddress>
			<MACAddress><?=$macaddr?></MACAddress>			
		</GetDMZSettingsResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>