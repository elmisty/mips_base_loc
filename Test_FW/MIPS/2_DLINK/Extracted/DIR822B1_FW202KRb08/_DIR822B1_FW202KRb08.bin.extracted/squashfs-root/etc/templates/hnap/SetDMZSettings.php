HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/inet.php";
include "/htdocs/phplib/trace.php";

$nodebase = "/runtime/hnap/SetDMZSettings/";
$result = "OK";
$dmz_path = "/nat/entry/dmz";
$sdmz_path= "/nat/entry/sdmz";

if(get("", $nodebase."EnabledDMZ") == "true" && get("", $nodebase."EnabledSDMZ") == "false")
{
	set($dmz_path."/enable", "1");
	set($dmz_path."/inf", $LAN1);
	set($dmz_path."/hostid", ipv4hostid(get("", $nodebase."IPAddress"), get("", INET_getpathbyinf($LAN1)."/ipv4/mask")));
	
	set($sdmz_path."/enable", "0");
	set($sdmz_path."/mac", "");
	set($sdmz_path."/schedule", "");
	
}
else if(get("", $nodebase."EnabledDMZ") == "false" && get("", $nodebase."EnabledSDMZ") == "true")
{
	set($dmz_path."/enable", "0");
	set($dmz_path."/inf", "");
	set($dmz_path."/hostid", "");
	
	set($sdmz_path."/enable", "1");
	set($sdmz_path."/mac", get("", $nodebase."MACAddress"));
	set($sdmz_path."/schedule", "");
}
else
{
	set($dmz_path."/enable", "0");
	set($dmz_path."/inf", "");
	set($dmz_path."/hostid", "");
	
	set($sdmz_path."/enable", "0");
	set($sdmz_path."/mac", "");
	set($sdmz_path."/schedule", "");
}


fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->DMZ Settings\" > /dev/console\n");

if($result=="OK")
{
	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "service DMZ.NAT-1 restart > /dev/console\n");
	fwrite("a",$ShellPath, "service ACL restart > /dev/console\n");
	fwrite("a",$ShellPath, "service FIREWALL restart > /dev/console\n");
	fwrite("a",$ShellPath, "service HTTP.WAN-1 restart > /dev/console\n");
	if(get("", $nodebase."EnabledDMZ") == "false" && get("", $nodebase."EnabledSDMZ") == "true")
	{
		fwrite("a",$ShellPath, "et robowr 0x10 0x0 0x800 > /dev/console\n");
		fwrite("a",$ShellPath, "et robowr 0x11 0x0 0x800 > /dev/console\n");
		fwrite("a",$ShellPath, "et robowr 0x12 0x0 0x800 > /dev/console\n");
		fwrite("a",$ShellPath, "et robowr 0x13 0x0 0x800 > /dev/console\n");
		fwrite("a",$ShellPath, "service PHYINF.WIFI restart > /dev/console\n");
		fwrite("a",$ShellPath, "et robowr 0x10 0x0 0x8000 > /dev/console\n");
		fwrite("a",$ShellPath, "et robowr 0x11 0x0 0x8000 > /dev/console\n");
		fwrite("a",$ShellPath, "et robowr 0x12 0x0 0x8000 > /dev/console\n");
		fwrite("a",$ShellPath, "et robowr 0x13 0x0 0x8000 > /dev/console\n");
	}
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
		<SetDMZSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
			<SetDMZSettingsResult><?=$result?></SetDMZSettingsResult>
		</SetDMZSettingsResponse>
	</soap:Body>
</soap:Envelope>
