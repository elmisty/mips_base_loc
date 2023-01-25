<?
//this script needs argument EVENT, we need this to control WAN LED

include "/htdocs/phplib/xnode.php";

echo "#!/bin/sh\n";

function wan_has_ip()
{
	$wan_inf = XNODE_getpathbytarget("/runtime", "inf", "uid", "WAN-1", 0);
	if($wan_inf == "")
		return 0;

	$addrtype = get("x", $wan_inf."/inet/addrtype");
	$ipaddr = "";

	if($addrtype == "ppp4")
	{
		$ipaddr = get("x", $wan_inf."/inet/ppp4/local");
	}

	if($addrtype == "ipv4")
	{
		$ipaddr = get("x", $wan_inf."/inet/ipv4/ipaddr");
	}

	if($ipaddr == "")
	{
		return 0;
	}
	else
	{
		return 1;
	}
}

if($EVENT == "WAN_CONNECTED")
{
//	echo "wan_port_status=`psts -i 4`\n";
//	echo "if [ \"$wan_port_status\" != \"\" ]; then\n";
//	echo "usockc /var/gpio_ctrl INET_ON\n";
	echo "usockc /var/gpio_ctrl INET_GREEN\n";
//	echo "fi\n";
}

if($EVENT == "WAN_DISCONNECTED")
{
	echo "usockc /var/gpio_ctrl INET_NONE\n";

//	$ppp_inf = XNODE_getpathbytarget("/runtime", "inf", "phyinf", "PPP.WAN-1", 0);
//	echo "\"ppp_inf =" .$ppp_inf."\n\" >> /dev/console"; 
//	echo "# ppp_inf :".$ppp_inf."\n"; 

//	$ppp_phy = get("x",$ppp_inf."/phyinf");
//	echo "\"ppp_phy =" .$ppp_phy."\n\" >> /dev/console";
//	echo "# ppp_phy :".$ppp_phy."\n";

//	if($ppp_phy != "PPP.WAN-1" || $ppp_phy != "PPP.WAN-2")(
//		echo "\"ppp_inf =" .$ppp_inf."\n\" >> /dev/console";
//		echo "usockc /var/gpio_ctrl INET_NONE\n";
//	}
//	else{
//		echo "usockc /var/gpio_ctrl INET_GREEN_BLINK\n";
//	}
}
if($EVENT == "WAN_DHCP_RELEASE")
{
	echo "usockc /var/gpio_ctrl INET_GREEN_BLINK\n";
}

if($EVENT == "WAN_PPP_ONDEMAND")
{
//	echo "usockc /var/gpio_ctrl INET_BLINK_SLOW\n";
	echo "usockc /var/gpio_ctrl INET_GREEN_BLINK\n";
}

if($EVENT == "WAN_LINKUP")
{
	if(wan_has_ip() != 0)
	{
	//	echo "usockc /var/gpio_ctrl INET_ON\n";
		echo "usockc /var/gpio_ctrl INET_GREEN\n";
	}
}

if($EVENT == "WAN_LINKDOWN")
{
	//echo "usockc /var/gpio_ctrl INET_OFF\n";
	echo "usockc /var/gpio_ctrl INET_NONE\n";

}

?>
