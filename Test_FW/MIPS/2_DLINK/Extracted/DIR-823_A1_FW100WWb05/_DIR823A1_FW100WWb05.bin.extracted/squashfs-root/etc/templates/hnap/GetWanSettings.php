<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/encrypt.php";

$path_inf_wan1 = XNODE_getpathbytarget("", "inf", "uid", $WAN1, 0);
$path_inf_wan2 = XNODE_getpathbytarget("", "inf", "uid", $WAN2, 0);
$path_inf_br1 = XNODE_getpathbytarget("", "inf", "uid", $BR1, 0);

$wan1_inet = query($path_inf_wan1."/inet"); 
$wan2_inet = query($path_inf_wan2."/inet");
$br1_inet = query($path_inf_br1."/inet");

$path_wan1_inet = XNODE_getpathbytarget("/inet", "entry", "uid", $wan1_inet, 0);
$path_wan2_inet = XNODE_getpathbytarget("/inet", "entry", "uid", $wan2_inet, 0);
$path_br1_inet = XNODE_getpathbytarget("/inet", "entry", "uid", $br1_inet, 0);

$wan1_phyinf = query($path_inf_wan1."/phyinf");
$path_wan1_phyinf  = XNODE_getpathbytarget("", "phyinf", "uid", $wan1_phyinf, 0);

$path_run_inf_wan1 = XNODE_getpathbytarget("/runtime", "inf", "uid", $WAN1, 0);
$path_run_inf_br1 = XNODE_getpathbytarget("/runtime", "inf", "uid", $BR1, 0);

$Type        = "";
$Username    = "";
$Password    = "";
$MaxIdletime = 0;
$ServiceName = "";
$AutoReconnect = "false";
$vpnipaddr = "";
$vpnsubmask = "";
$vpngateway= "";
$MacCloneEnable = "false";

$layout = query("/device/layout");

if($layout=="bridge") /* bridge mode */
{
	$Type = "Bridged";
	if(query("/device/wirelessmode") == "WirelessRepeaterExtender")
	{
		$Type = "Extender";
	}
	else if(query("/device/wirelessmode") == "WirelessAp")
	{
		$Type = "Ap";
	}
	
	if(query($path_run_inf_br1."/inet/ipv4/valid") == 1)
	{
		$ipaddr  = query($path_run_inf_br1."/inet/ipv4/ipaddr");
		$gateway = query($path_run_inf_br1."/inet/ipv4/gateway");
		$mask    = ipv4int2mask(query($path_run_inf_br1."/inet/ipv4/mask"));	
		
		$run_dns1 = query($path_run_inf_br1."/inet/ipv4/dns");
		$run_dns2 = query($path_run_inf_br1."/inet/ipv4/dns:2");
	}
	
	$MTU = 1500;
	
	$mode = query($path_br1_inet."/addrtype");
	
	if($mode == "ipv4")
	{
		anchor($path_br1_inet."/ipv4");
		
		if(query("static") == 1)	//StaticBridged
		{
			$Type = "Static".$Type;
			
			$ipaddr  = query("ipaddr");
			$gateway = query("gateway");
			$mask    = ipv4int2mask(query("mask"));
			$MTU     = query("mtu");
			$dns1    = query("dns/entry");
			$dns2    = query("dns/entry:2");
		}
		else if(query("static") == 0) //DynamicBridged
		{
			$Type = "Dynamic".$Type;
			
			$MTU = query("mtu");
			$dns1    = query("dns/entry");
			$dns2    = query("dns/entry:2");
		}
	}
}
else /* router mode */
{
	if(query($path_run_inf_wan1."/inet/ipv4/valid") == 1)
	{
		$ipaddr  = query($path_run_inf_wan1."/inet/ipv4/ipaddr");
		$gateway = query($path_run_inf_wan1."/inet/ipv4/gateway");
		$mask    = ipv4int2mask(query($path_run_inf_wan1."/inet/ipv4/mask"));	
		
		$run_dns1 = query($path_run_inf_wan1."/inet/ipv4/dns");
		$run_dns2 = query($path_run_inf_wan1."/inet/ipv4/dns:2");
	}
	
	$MTU = 1500;
	$mac = query("/runtime/devdata/wanmac");
	
	$mode = query($path_wan1_inet."/addrtype");
	if($mode == "ppp4" && query($path_wan1_inet."/ppp4/over") == "eth")
	{
		$PPPoE_IPv4 = "true";
	}
	
	
	if($mode == "ipv4")
	{
		$autodtect = query($path_wan1_inet."/autodetect/active");
		anchor($path_wan1_inet."/ipv4");
		
		if(query("ipv4in6/mode") == "dslite" && $autodetect != "1")	// DS-Lite
		{
			$Type = "DsLite";
			if(query("ipv4in6/remote") != "")   // DS-Lite_static
			{	
				$DsLite_Configuration    = "Manual";
				$DsLite_AFTR_IPv6Address = query("ipv4in6/remote");
			} 
			else //DS-Lite_dynamic
			{	
				$DsLite_Configuration    = "Dhcpv6Option";
				$DsLite_AFTR_IPv6Address = query($path_run_inf_wan1."/inet/ipv4/ipv4in6/remote");
			}
			$DsLite_B4IPv4Address = query("ipaddr");	
		}	
		else if(query("static") == 1)    //Static     
		{
			$Type = "Static";
			
			$ipaddr  = query("ipaddr");
			$gateway = query("gateway");
			$mask    = ipv4int2mask(query("mask"));
			$MTU     = query("mtu");
			$dns1    = query("dns/entry");
			$dns2    = query("dns/entry:2");
			
			if(query($path_wan1_phyinf."/macaddr")!="")
			{
				$mac=query($path_wan1_phyinf."/macaddr");
				$MacCloneEnable = "true";
			}
		}
		else if(query("static") == 0)    //DHCP
		{
			$Type = "DHCP";
			
			$MTU = query("mtu");
			$dns1    = query("dns/entry");
			$dns2    = query("dns/entry:2");
			if(query($path_wan1_phyinf."/macaddr")!="")
			{
				$mac=query($path_wan1_phyinf."/macaddr");
				$MacCloneEnable = "true";
			}
		}			
	}
	else if($mode == "ppp10" || $PPPoE_IPv4 == "true")    // PPPoE & Russia PPPoE
	{
		anchor($path_wan1_inet."/ppp4");
		$ETISALAT_DUALWAN = query("/tr069/external/enable_dualwan");
		if(query("static") == 1)
		{
			if(query($path_inf_wan2."/nat") == "NAT-1" && query($path_inf_wan2."/active") == 1) // Russia StaticPPPoE
			{
				if( $ETISALAT_DUALWAN == 1)
				{
					$Type   = "DHCPPPPoE";
				}
				else
				{
					$Type = "Ru_StaticPPPoE";

					// Russia PPPoE WAN	
					if(query($path_wan2_inet."/ipv4/static") == 1)
					{
						$Ruppp_Type				=	"StaticPPPoE";
						$Ruppp_IPAddress 	= query($path_wan2_inet."/ipv4/ipaddr");
						$Ruppp_Gateway 		= query($path_wan2_inet."/ipv4/gateway");
						$Ruppp_SubnetMask	= ipv4int2mask(query($path_wan2_inet."/ipv4/mask"));
						$Ruppp_PriDns    	= query($path_wan2_inet."/ipv4/dns/entry");
						$Ruppp_SecDns    	= query($path_wan2_inet."/ipv4/dns/entry:2");
					}
					else
					{
						$Ruppp_Type	=	"DHCPPPPoE";
					}
				}
			}
			else
			{
				$Type   = "StaticPPPoE";
			}
			
			$ipaddr = query($path_wan1_inet."/ppp4/ipaddr");
		}
		else
		{
			if(query($path_inf_wan2."/nat") == "NAT-1" && query($path_inf_wan2."/active") == 1) // Russia DynamicPPPoE
			{
				if( $ETISALAT_DUALWAN == 1)
				{
					$Type   = "DHCPPPPoE";
				}
				else
				{
					$Type = "Ru_DHCPPPPoE";
					
					// Russia PPPoE WAN	
					if(query($path_wan2_inet."/ipv4/static") == 1)
					{
						$Ruppp_Type				=	"StaticPPPoE";
						$Ruppp_IPAddress		=	query($path_wan2_inet."/ipv4/ipaddr");
						$Ruppp_Gateway			=	query($path_wan2_inet."/ipv4/gateway");
						$Ruppp_SubnetMask	=	ipv4int2mask(query($path_wan2_inet."/ipv4/mask"));
						$Ruppp_PriDns			=	query($path_wan2_inet."/ipv4/dns/entry");
						$Ruppp_SecDns			=	query($path_wan2_inet."/ipv4/dns/entry:2");
					}
					else
					{
						$Ruppp_Type	=	"DHCPPPPoE";
					}
				}
			}
			else
			{
				$Type   = "DHCPPPPoE";
			}
			
			$ipaddr = query($path_run_inf_wan1."/inet/ppp4/local"); 
		}
		
		if($ipaddr == "")
		{
			$mask	= "";
		}
		else
		{
			$mask	= "255.255.255.255";
		}
			
		$gateway  = query($path_run_inf_wan1."/inet/ppp4/peer");
		$Username = get("","username");
		$Password = get("","password");
		
		$MaxIdletime = query("dialup/idletimeout");
		$ServiceName = get("","pppoe/servicename");
		
		if(query($path_wan1_phyinf."/macaddr")!="")
		{
			$mac=query($path_wan1_phyinf."/macaddr");
			$MacCloneEnable = "true";
		}
		
		$dialup_mode = query("dialup/mode");
		if($dialup_mode == "auto")
		{
			$AutoReconnect="true";
		}
		
		$run_dns1     = query($path_run_inf_wan1."/inet/ppp4/dns");
		$run_dns2     = query($path_run_inf_wan1."/inet/ppp4/dns:2");
		$dns1 = query($path_wan1_inet."/ppp4/dns/entry"); 
		$dns2 = query($path_wan1_inet."/ppp4/dns/entry:2"); 
		
		$MTU=query("mtu");
	}
	else if($mode == "ppp4" && query($path_wan1_inet."/ppp4/over") == "pptp")    //PPTP
	{
		anchor($path_wan2_inet."/ipv4");
		$dialup_mode = query($path_wan1_inet."/ppp4/dialup/mode");
		
		if(query("static") == 1)
		{
			if(query($path_inf_wan2."/nat") == "NAT-1" && query($path_inf_wan2."/active") == 1) // Russia StaticPPTP
			{
				$Type = "Ru_StaticPPTP";
			}
			else
			{
				$Type = "StaticPPTP";
			}
			
			$dns1    = query("dns/entry");
			$dns2    = query("dns/entry:2");
		}
		else
		{
			if(query($path_inf_wan2."/nat") == "NAT-1" && query($path_inf_wan2."/active") == 1) // Russia DynamicPPTP
			{
				$Type = "Ru_DynamicPPTP";
			}
			else
			{
				$Type = "DynamicPPTP";
			}
			$dns1 = query($path_wan1_inet."/ppp4/dns/entry");
		    $dns2 = query($path_wan1_inet."/ppp4/dns/entry:2");
		}
		$ipaddr  = query("ipaddr");
        $gateway = query("gateway");
		$mask    = ipv4int2mask(query("mask")); 
		
		$run_dns1 = get("", $path_run_inf_wan1."/inet/ppp4/dns");
		$run_dns2 = get("", $path_run_inf_wan1."/inet/ppp4/dns:2");

		$Username = get("",$path_wan1_inet."/ppp4/username");
		$Password = get("",$path_wan1_inet."/ppp4/password");
		
		$MaxIdletime = query($path_wan1_inet."/ppp4/dialup/idletimeout");
		$ServiceName = get("",$path_wan1_inet."/ppp4/pptp/server");
		
		if(query($path_wan1_phyinf."/macaddr")!="")
		{
			$mac = query($path_wan1_phyinf."/macaddr");
			$MacCloneEnable = "true";
		}

		if($dialup_mode == "auto")
		{
			$AutoReconnect = "true";
		}
		
		$MTU = query($path_wan1_inet."/ppp4/mtu");
	
		/*
			Work run to show PPTP or L2TP IP address information in Home.html without the parameters of $VPNIPAddress, $VPNSubnetMask, and $VPNGateway.
			Original HNAP GetWanSettings could not get the PPTP (L2TP) IP address given by PPTP (L2TP) server. The tags "IPAddress", "SubnetMask" and "Gateway" are used to show the static IP information of physical layer (WAN-2). So the parameter $VPNIPAddress, $VPNSubnetMask, and $VPNGateway are designed to show the PPTP (L2TP) IP address given by PPTP (L2TP) server.
			However, D-Link would not follow this way. They want to use the tags "IPAddress", "SubnetMask" and "Gateway" to show the PPTP (L2TP) IP address given by PPTP (L2TP) server. The static IP information of physical layer (WAN-2) showed in GetWan2Settings HNAP.
			However, the GetWan2Settings HNAP is not defined clearly now. To show static IP information of physical layer (WAN-2) would be an issue now.
		*/

/* jef mark for internet wan PP2P static setting. to avoid wrong IP setting.
		$ipaddr		= get("", $path_run_inf_wan1."/inet/ppp4/local");
		if($ipaddr == "")	{	$mask	= "";	}
		else							{	$mask	= "255.255.255.255";	}
		$gateway	= get("", $path_run_inf_wan1."/inet/ppp4/peer");
*/
		$VPNIPAddress  = get("", $path_run_inf_wan1."/inet/ppp4/local");
		if($VPNIPAddress == "")	{	$VPNSubnetMask	= "";	}
		else										{	$VPNSubnetMask	= "255.255.255.255";	}
		$VPNGateway = get("", $path_run_inf_wan1."/inet/ppp4/peer");
	}
	else if($mode == "ppp4" && query($path_wan1_inet."/ppp4/over") == "l2tp")    //L2TP
	{
		anchor($path_wan2_inet."/ipv4");
		
		$dialup_mode = query($path_wan1_inet."/ppp4/dialup/mode");

		if(query("static") == 1)
		{
			if(query($path_inf_wan2."/nat") == "NAT-1" && query($path_inf_wan2."/active") == 1) // Russia StaticL2TP
			{
				$Type = "Ru_StaticL2TP";
			}
			else
			{
				$Type = "StaticL2TP";
			}	
			$dns1    = query("dns/entry");
			$dns2    = query("dns/entry:2");
			
		}
		else
		{
			if(query($path_inf_wan2."/nat") == "NAT-1" && query($path_inf_wan2."/active") == 1) // Russia DynamicL2TP
			{
				$Type = "Ru_DynamicL2TP";
			}
			else
			{
				$Type = "DynamicL2TP";
			}
			$dns1 = query($path_wan1_inet."/ppp4/dns/entry");
		    $dns2 = query($path_wan1_inet."/ppp4/dns/entry:2");
		}

        $ipaddr  = query("ipaddr");		
	    $gateway = query("gateway");
		$mask    = ipv4int2mask(query("mask"));
		$run_dns1 = get("", $path_run_inf_wan1."/inet/ppp4/dns");
		$run_dns2 = get("", $path_run_inf_wan1."/inet/ppp4/dns:2");
		
		$Username = get("",$path_wan1_inet."/ppp4/username");
		$Password = get("",$path_wan1_inet."/ppp4/password");
		$MaxIdletime = query($path_wan1_inet."/ppp4/dialup/idletimeout");
		$ServiceName = get("",$path_wan1_inet."/ppp4/l2tp/server");
		
		if(query($path_wan1_phyinf."/macaddr")!="")
		{
			$mac = query($path_wan1_phyinf."/macaddr");
			$MacCloneEnable = "true";
		}

		if($dialup_mode == "auto")
		{
			$AutoReconnect = "true";
		}
		
		$MTU = query($path_wan1_inet."/ppp4/mtu");
	
		/*
			Work run to show PPTP or L2TP IP address information in Home.html without the parameters of $VPNIPAddress, $VPNSubnetMask, and $VPNGateway.
			Original HNAP GetWanSettings could not get the PPTP (L2TP) IP address given by PPTP (L2TP) server. The tags "IPAddress", "ubnetMask" and "Gateway" are used to show the static IP information of physical layer (WAN-2). So the parameter $VPNIPAddress, $VPNSubnetMask, and $VPNGateway are designed to show the PPTP (L2TP) IP address given by PPTP (L2TP) server.
			However, D-Link would not follow this way. They want to use the tags "IPAddress", "SubnetMask" and "Gateway" to show the PPTP (L2TP) IP address given by PPTP (L2TP) server. The static IP information of physical layer (WAN-2) showed in GetWan2Settings HNAP.
			However, the GetWan2Settings HNAP is not defined clearly now. To show static IP information of physical layer (WAN-2) would be an issue now.
		*/

/* jef mark for internet wan PP2P/L2TP static setting. to avoid wrong IP setting.
		$ipaddr		= get("", $path_run_inf_wan1."/inet/ppp4/local");
		if($ipaddr == "")	{	$mask	= "";	}
		else							{	$mask	= "255.255.255.255";	}
		$gateway	= get("", $path_run_inf_wan1."/inet/ppp4/peer");
*/
		$VPNIPAddress  = get("", $path_run_inf_wan1."/inet/ppp4/local");
		if($VPNIPAddress == "")	{	$VPNSubnetMask	= "";	}
		else										{	$VPNSubnetMask	= "255.255.255.255";	}
		$VPNGateway    = get("", $path_run_inf_wan1."/inet/ppp4/peer");
	}	
	
	if(query("/advdns/enable") == 1) { $adv_dns_enable = "true";  }
	else                             { $adv_dns_enable = "false"; }
	
	/*Follow HNAP SPEC. HNAP Protocol Specification Version 1.2.1.pdf
	  If Type is set to DHCP, DHCPPPPoE, DynamicPPPOA or Dynamic1483Bridged this returns the DHCP configured values.
	  If DHCP has not acquired an address yet, this should return 0.0.0.0. */
	if($Type=="DHCP" || $Type=="DHCPPPPoE")
	{
		if($ipaddr=="")	{$ipaddr="0.0.0.0";}
		if($mask=="")	{$mask="0.0.0.0";}
		if($gateway==""){$gateway="0.0.0.0";}
	}
}
$MaxIdletime = $MaxIdletime*60; //Alpha saves maximum idle time in DB with minute unit. However, HNAP SPEC. HNAP Core Specification v1.1 Rev12.pdf uses second for the unit.
?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
		<GetWanSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
			<GetWanSettingsResult>OK</GetWanSettingsResult>
			<Type><?=$Type?></Type>
			<Username><? echo escape("x",$Username); ?></Username>
			<Password><? echo AES_Encrypt128($Password); ?></Password>
			<MaxIdleTime><?=$MaxIdletime?></MaxIdleTime>
			<HostName><? echo get("x", "/device/hostname_dhcpc");?></HostName>
			<VPNLocalIPAddress><?=$VPNIPAddress?></VPNLocalIPAddress>
			<VPNLocalSubnetMask><?=$VPNSubnetMask?></VPNLocalSubnetMask>
			<VPNLocalGateway><?=$VPNGateway?></VPNLocalGateway>
			<ServiceName><? echo escape("x",$ServiceName); ?></ServiceName>
			<AutoReconnect><?=$AutoReconnect?></AutoReconnect>
			<IPAddress><?=$ipaddr?></IPAddress>
			<SubnetMask><?=$mask?></SubnetMask>
			<Gateway><?=$gateway?></Gateway>
			<ConfigDNS>
				<Primary><?=$dns1?></Primary>
				<Secondary><?=$dns2?></Secondary>
			</ConfigDNS>
			<RuntimeDNS>
				<Primary><?=$run_dns1?></Primary>
				<Secondary><?=$run_dns2?></Secondary>
			</RuntimeDNS>
			<OpenDNS>
				<enable><?=$adv_dns_enable?></enable>
			</OpenDNS>
			<MacAddress><?=$mac?></MacAddress>
			<MacCloneEnable><?=$MacCloneEnable?></MacCloneEnable>
			<MTU><?=$MTU?></MTU>
			<DsLite_Configuration><?=$DsLite_Configuration?></DsLite_Configuration>
			<DsLite_AFTR_IPv6Address><?=$DsLite_AFTR_IPv6Address?></DsLite_AFTR_IPv6Address>
			<DsLite_B4IPv4Address><?=$DsLite_B4IPv4Address?></DsLite_B4IPv4Address>
			<RussiaPPP>
				<Type><?=$Ruppp_Type?></Type>
				<IPAddress><?=$Ruppp_IPAddress?></IPAddress>
				<SubnetMask><?=$Ruppp_SubnetMask?></SubnetMask>
				<Gateway><?=$Ruppp_Gateway?></Gateway>
				<DNS>
					<Primary><?=$Ruppp_PriDns?></Primary>
					<Secondary><?=$Ruppp_SecDns?></Secondary>
				</DNS>
			</RussiaPPP>
		</GetWanSettingsResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
