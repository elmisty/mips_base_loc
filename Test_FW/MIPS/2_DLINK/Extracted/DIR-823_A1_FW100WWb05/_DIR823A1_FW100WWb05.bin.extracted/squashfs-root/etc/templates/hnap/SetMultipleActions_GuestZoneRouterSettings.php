<?
/*this file is for include in SetMultipleAction*/
include "/htdocs/phplib/inet.php";
include "/htdocs/phplib/inf.php";

$result="OK";
/* those data have complete checked by client side, we just simply check at here */
$InetAcs = get("",$nodebase."InternetAccessOnly"); //not set, sammy
$ipaddr = get("",$nodebase."IPAddress");
$mask = get("",$nodebase."SubnetMask");
$mask = ipv4mask2int($mask); // 255.255.255.0 => 24
$en_dhcp = get("",$nodebase."DHCPServer");
$start = get("",$nodebase."DHCPRangeStart");
$end = get("",$nodebase."DHCPRangeEnd");
$leasetime = get("",$nodebase."DHCPLeaseTime");

//Prevent the security issue of Command Injection
if($ipaddr != "" && INET_validv4addr($ipaddr)==0) { $result = "ERROR"; }
else if($mask != "" && isdigit($mask)==0)         { $result = "ERROR"; }

if($en_dhcp != "true" && $en_dhcp != "false") { $result = "ERROR"; }

if($result == "OK")
{
	$path_inf_lan2 = XNODE_getpathbytarget("", "inf", "uid", $LAN2, 0);
	$lan2_inet = get("", $path_inf_lan2."/inet");
	$path_inet_lan2 = XNODE_getpathbytarget("inet", "entry", "uid", $lan2_inet, 0);
	TRACE_debug("path_inf_lan2=".$path_inf_lan2);
	TRACE_debug("path_inet_lan2=".$path_inet_lan2);

	/*	Ref. main trunk  dlob.hans\htdcos\webinc\js\adv_gzone.php
		Enable internet access only is equal to disable routing between zones.
	      /acl/obfilter (used to apply at FORWARD chain)
		    Rule FWL-1 -> drop guestzone traffic to hostzone
		    Rule FWL-2 -> drop hostzone traffic to guestzone
	      /acl/obfilter2 (apply at INPUT chain) for traffic that from guestzone and the destination is hostzone's ip or guestzone's ip.
	*/
	if ($InetAcs == "true")
	{
		set("/acl/obfilter/policy", "ACCEPT");
		set("/acl/obfilter2/policy", "ACCEPT");
	}
	else if ($InetAcs == "false")
	{
		set("/acl/obfilter/policy", "DISABLE");
		set("/acl/obfilter2/policy", "DISABLE");
	}

	if($ipaddr=="")
	{
	    if(query($path_inet_lan2."/ipv4/ipaddr")=="")
	        { $ipaddr="192.168.7.1"; }
	    else
	        { $ipaddr=query($path_inet_lan2."/ipv4/ipaddr"); }
	}
	if($mask=="")
	{
	    if(query($path_inet_lan2."/ipv4/ipaddr")=="")
	        { $mask=ipv4mask2int("255.255.255.0"); }
	    else
	        { $mask=query($path_inet_lan2."/ipv4/mask"); }
	}

	set($path_inet_lan2."/ipv4/ipaddr", $ipaddr);
	set($path_inet_lan2."/ipv4/mask", $mask);

	if		 ($dnsr == "true")			set($path_inf_lan2."/dns4", "DNS4-1");
	else if($dnsr == "false")			set($path_inf_lan2."/dns4", "");
	$path_dhcps4_lan2 = XNODE_getpathbytarget("dhcps4", "entry", "uid", "DHCPS4-2", 0);

	if($start=="") { $start="100"; }
	if($end=="") { $end="199"; }
	if($leasetime=="") { $leasetime="10080"; }

	set($path_dhcps4_lan2."/start", $start);
	set($path_dhcps4_lan2."/end", $end);
	set($path_dhcps4_lan2."/leasetime", $leasetime*60);
}

if($result == "OK")
{
	fwrite("a",$ShellPath, "service PHYINF.WIFI restart > /dev/console\n");
	fwrite("a",$ShellPath, "service INET.LAN-2 restart > /dev/console\n");
	fwrite("a",$ShellPath, "service DHCPS4.LAN-2 restart > /dev/console\n");
}
else
{
	fwrite("a",$ShellPath, "echo \"We got a error in setting, so we do nothing...\" > /dev/console\n");
}
?>

