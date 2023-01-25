<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

include "/htdocs/webinc/config.php";
include "/htdocs/phplib/inet.php";

$result = "OK";
$redirect_path = "/device/redirect";

if(get("", $redirect_path."/enable")=="1")
{
	$enable = "true";
	$leasetime = get("", $redirect_path."/leasetime");
	$url= get("", $redirect_path."/url");
}
else
{
	$enable = "false";
	$leasetime = "";
	$url= "";
}

?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
		<GetRedirectSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
			<GetRedirectSettingsResult><?=$result?></GetRedirectSettingsResult>
			<Enabled><?=$enable?></Enabled>
			<Leasetime><?=$leasetime?></Leasetime>
			<URL><?=$url?></URL>			
		</GetRedirectSettingsResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
