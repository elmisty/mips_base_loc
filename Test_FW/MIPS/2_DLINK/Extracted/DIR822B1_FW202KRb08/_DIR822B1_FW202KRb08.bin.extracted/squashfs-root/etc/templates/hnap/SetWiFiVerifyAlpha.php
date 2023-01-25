HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php";

function check_pin($pin)
{
	/* more checking added for WPS 2.0
		We allow pin with : xxxx-xxxx
							xxxx xxxx
							xxxxxxxx
	*/
	$len = strlen($pin);
	$delim = "";

	//we support 4 digits
	if($len==4)
	{
		if(isdigit($pin)!=1) { return 0; }
		else 				 { return $pin; }
	}
	if($len==9)
	{
		if(cut_count($pin, "-")==2) 		{ $delim = "-"; }
		else if(cut_count($pin, " ")==2) 	{ $delim = " "; }
		else { return 0; }

		$val1=cut($pin,0,$delim);
		$val2=cut($pin,1,$delim);
		if(strlen($val1)!=4 || strlen($val2)!=4) { return 0; }
		$pin = $val1.$val2;
	}

	if (isdigit($pin)!=1) return 0;
	if (strlen($pin)!=8) return 0;
	$i = 0; $pow = 3; $sum = 0;
	while($i < 8)
	{
		$sum = $pow * substr($pin, $i, 1) + $sum;
		if ($pow == 3)  $pow = 1;
		else            $pow = 3;
		$i++;
	}
	$sum = $sum % 10;
	if ($sum == 0)  return $pin;
	else            return 0;
}
$rphyinf1 = XNODE_getpathbytarget("/runtime", "phyinf", "uid", $WLAN1, 0);
$rphyinf2 = XNODE_getpathbytarget("/runtime", "phyinf", "uid", $WLAN2, 0);
$rphyinf3 = XNODE_getpathbytarget("/runtime", "phyinf", "uid", $WLAN3, 0);
$phyinf1 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1, 0);
$phyinf2 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2, 0);
$phyinf3 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN3, 0);
$wifi1 = XNODE_getpathbytarget("/wifi", "entry", "uid", query($phyinf1."/wifi"), 0);
$wifi2 = XNODE_getpathbytarget("/wifi", "entry", "uid", query($phyinf2."/wifi"), 0);
$wifi3 = XNODE_getpathbytarget("/wifi", "entry", "uid", query($phyinf3."/wifi"), 0);

$dev_pin = get("","/runtime/hnap/SetWiFiVerifyAlpha/WPS/DEV_PIN");
$reset = get("","/runtime/hnap/SetWiFiVerifyAlpha/WPS/ResetToUnconfigured");
$pin = get("","/runtime/hnap/SetWiFiVerifyAlpha/WPS/WPSPIN");
$pbc = get("","/runtime/hnap/SetWiFiVerifyAlpha/WPS/WPSPBC");

$result = "ERROR_ACTION";
fwrite("w",$ShellPath, "#!/bin/sh\n");
if ($pin != "" && check_pin($pin) > 0)
{
    if($rphyinf1 != "") {set($rphyinf1."/media/wps/enrollee/pin",$pin);}
    if($rphyinf2 != "") {set($rphyinf2."/media/wps/enrollee/pin",$pin);}
	if($rphyinf3 != "") {set($rphyinf3."/media/wps/enrollee/pin",$pin);}

    if($rphyinf1 != "" || $rphyinf2 != "" || $rphyinf3 != "")
    {
        fwrite("a",$ShellPath, "event WPSPIN > /dev/console \n");
        $result = "SUCCESS";
    }
    else {fwrite("a",$ShellPath, "echo \"PIN:can't find correct path...\" > /dev/console");}
}
else if ($pbc == "1")
{
    fwrite("a",$ShellPath, "event WPSPBC.PUSH > /dev/console \n");
    $result = "SUCCESS";
}
else if ($dev_pin != "" && check_pin($pin) > 0)
{
    if($wifi1!="") {set($wifi1."/wps/pin",$dev_pin);}
    if($wifi2!="") {set($wifi2."/wps/pin",$dev_pin);}
	if($wifi3!="") {set($wifi3."/wps/pin",$dev_pin);}

    if($wifi1!="" || $wifi2!="" || $wifi3!="")
    {
        fwrite("a",$ShellPath, "event DBSAVE > /dev/console \n");
        fwrite("a",$ShellPath, "service PHYINF.WIFI restart > /dev/console \n");
        $result = "SUCCESS";
    }
    else {fwrite("a",$ShellPath, "echo \"DEV_PIN:can't find correct path...\" > /dev/console");}
}
else if ($reset == "1")
{
    TRACE_info("Reset to Unconfigured!!!");
    $result = "SUCCESS";
    fwrite("a",$ShellPath, "event FRESET > /dev/console \n");
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
        <SetWiFiVerifyAlphaResponse xmlns="http://purenetworks.com/HNAP1/">
            <SetWPSSettingResult><?=$result?></SetWPSSettingResult>
        </SetWiFiVerifyAlphaResponse>
    </soap:Body>
</soap:Envelope>

