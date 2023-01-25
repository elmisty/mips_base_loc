HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/inet.php";
include "/htdocs/phplib/trace.php";

$nodebase = "/runtime/hnap/SetRedirectSettings/";
$result = "OK";
$redirect_path = "/device/redirect";

if(get("", $nodebase."Enabled") == "true")
{
	set($redirect_path."/enable", "1");
	set($redirect_path."/leasetime", get("", $nodebase."Leasetime"));
	set($redirect_path."/url", get("", $nodebase."URL"));
	
}
else
{
	set($redirect_path."/enable", "0");
	set($redirect_path."/leasetime", "");
	set($redirect_path."/url", "");	
}

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->Redirect Settings\" > /dev/console\n");

if($result=="OK")
{
	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "xmldbc -s /runtime/hnap/dev_status '' > /dev/console\n");
	set("/runtime/hnap/dev_status", "ERROR");
}
else
{
	fwrite("a",$ShellPath, "echo \"We got a error in setting, so we do nothing...\" > /dev/console");
}

?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<SetRedirectSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
			<SetRedirectSettingsResult><?=$result?></SetRedirectSettingsResult>
		</SetRedirectSettingsResponse>
	</soap:Body>
</soap:Envelope>
