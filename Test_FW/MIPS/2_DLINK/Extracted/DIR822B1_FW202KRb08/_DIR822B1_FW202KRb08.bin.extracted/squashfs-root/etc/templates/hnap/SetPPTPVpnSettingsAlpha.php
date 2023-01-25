HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/encrypt.php";

$nodebase = "/runtime/hnap/SetPPTPVpnSettingsAlpha/";
$rlt = "OK";

$pptp = get("x", $nodebase."pptp");
$chap = get("x", $nodebase."authtype/chap");
$mschap = get("x", $nodebase."authtype/mschap");
$encrtype = get("x", $nodebase."encrtype");
$isolation = get("x", $nodebase."isolation");
$account_info = $nodebase."account/entry";
$i = 1;

if($pptp == "true"){
	set("/vpn/pptp",	"1");
}else{
	set("/vpn/pptp",	"0");
}

if($encrtype == "true"){
	set("/vpn/encrtype",	"1");
}else{
	set("/vpn/encrtype",	"0");
}

set("/vpn/authtype/chap",	"1");
set("/vpn/authtype/mschap",	"1");
set("/vpn/isolation",		"0");
set("/vpn/entry/type",	     "pptp");
set("/vpn/entry/enable",	"0");


$i = get("x", "/vpn/account/entry#");
while($i > 0)
{
        del("/vpn/account/entry");
        $i--;
}

$i = 1;
foreach($account_info)
{
	$name = get("x", "name");
	set("/vpn/account/entry:".$i."/name", $name);
	$password = get("x", "password");
	$password = AES_Decrypt128($password);
	set("/vpn/account/entry:".$i."/password", $password);
	$hostid = get("x", "hostid");
	set("/vpn/account/entry:".$i."/hostid", $hostid);
	$enable = get("x", "enable");
	if($enable == "true"){
		set("/vpn/account/entry:".$i."/enable", "1");
	}else{
		set("/vpn/account/entry:".$i."/enable", "0");
	}
	$i++;
}

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->PPTPVPN Change\" > /dev/console\n");
if($rlt == "OK")
{
	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "service VPN restart > /dev/console\n");
	fwrite("a",$ShellPath, "xmldbc -s /runtime/hnap/dev_status '' > /dev/console\n");
	set("/runtime/hnap/dev_status", "ERROR");
}
else
{
	fwrite("a",$ShellPath, "echo \"We got a error in setting, so we do nothing...\" > /dev/console\n");
}
?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
<SetPPTPVpnSettingsAlphaResponse xmlns="http://purenetworks.com/HNAP1/">
<SetPPTPVpnSettingsResult><?=$rlt?></SetPPTPVpnSettingsResult>
</SetPPTPVpnSettingsAlphaResponse>
</soap:Body>
</soap:Envelope>
