<? /* vi: set sw=4 ts=4: */
include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php";


$path_run_inf_lan1 = XNODE_getpathbytarget("/runtime", "inf", "uid", $LAN1, 0);
$lan_ip = query($path_run_inf_lan1."/inet/ipv4/ipaddr");
$mask = query($path_run_inf_lan1."/inet/ipv4/mask");

/* only allow mask 255.255.255.0 */
if($mask == "24")
{
	fwrite("w", $START, "#!/bin/sh\n");
	fwrite("a", $START, "echo \"Start VPN service ..\"  > /dev/console\n");
	fwrite("w", $STOP,  "#!/bin/sh\n");
	fwrite("a", $STOP, "echo \"Stop VPN service ..\"  > /dev/console\n");
	fwrite("a", $STOP, "killall pptpd\n");
	
	$chap_secrets = "/var/etc/ppp/chap-secrets";
	$options_pptpd = "/var/etc/ppp/options.pptpd";
	$pptpd_conf = "/var/etc/pptpd.conf";
	$pptpd_enable = 0;
	$max_connections = 10;
	
	//Create /var/etc/ppp/chap-secrets
	unlink($chap_secrets);
	foreach("/vpn/account/entry")
	{
		$enable = get("", "enable");
		if($enable=="1")
		{
			$hostid	= query("hostid");
			$ip		= ipv4ip($lan_ip, $mask, $hostid);	
			fwrite("a",$chap_secrets, get("", "name")." pptpd ".get("", "password")." ".$ip."\n");
		}
	}
	
	if(get("", "/vpn/pptp")=="1")
	{
		$pptpd_enable = 1;
		fwrite("a", $START, "pptpd -c ".$pptpd_conf."&\n");	
	}	
	
	if($pptpd_enable == "1")
	{
		// iptables rules
		fwrite("a",$START, "iptables -t nat -A PRE.VPN -p tcp --dport 1723 -j ACCEPT\n");
	
		$auth_chap = query("/vpn/authtype/chap");
		$auth_mschap = query("/vpn/authtype/mschap");
		$encr_mppe_128 = query("/vpn/encrtype/");
		$isolation = query("/vpn/isolation");
	
		//Create /var/etc/ppp/options.pptpd
		fwrite("w",$options_pptpd,"name \"pptpd\"\n");
		fwrite("a",$options_pptpd,"mtu 1400\n");
		fwrite("a",$options_pptpd,"mru 1400\n");
		fwrite("a",$options_pptpd,"nobsdcomp\n");
		fwrite("a",$options_pptpd,"nodeflate\n");
		//fwrite("a",$options_pptpd,"nodefaultroute\n");
		if ($auth_chap=="0" && $auth_mschap=="0")
		{
			fwrite("a",$options_pptpd,"noauth\n");
		} else {
			fwrite("a",$options_pptpd,"refuse-eap\n");
			fwrite("a",$options_pptpd,"refuse-pap\n");
			if ($auth_chap=="1")
				fwrite("a",$options_pptpd,"require-chap\n");
			else
				fwrite("a",$options_pptpd,"refuse-chap\n");
			if ($auth_mschap=="1")
			{
				fwrite("a",$options_pptpd,"require-mschap\n");
				fwrite("a",$options_pptpd,"require-mschap-v2\n");
			} else {
				fwrite("a",$options_pptpd,"refuse-mschap\n");
				fwrite("a",$options_pptpd,"refuse-mschap-v2\n");
			}
			if ($encr_mppe_128=="1")
				fwrite("a",$options_pptpd,"require-mppe-128\n");
				
				
			//==add for test=====
			fwrite("a",$options_pptpd,"debug\n");
			//fwrite("a",$options_pptpd,"proxyarp\n");
			fwrite("a",$options_pptpd,"logfile /var/log/pppd.log\n");
			//fwrite("a",$options_pptpd,"novj\n");
			//fwrite("a",$options_pptpd,"novjccomp\n");
			//fwrite("a",$options_pptpd,"noccp\n");
			//fwrite("a",$options_pptpd,"noaccomp\n");
			//fwrite("a",$options_pptpd,"nopcomp\n");
			//==add for test=====
		}

		/* allows pppd to supply one or two DNS addresses to the clients */
		$path_inf_wan1 = XNODE_getpathbytarget("", "inf", "uid", $WAN1, 0);
		$path_run_inf_wan1 = XNODE_getpathbytarget("/runtime", "inf", "uid", $WAN1, 0);
		$wan1_inet = query($path_inf_wan1."/inet"); 
		$path_wan1_inet = XNODE_getpathbytarget("/inet", "entry", "uid", $wan1_inet, 0);	
		if(query($path_run_inf_wan1."/inet/ipv4/valid") == 1)
		{
			$dns1=query($path_run_inf_wan1."/inet/ipv4/dns");
			$dns2=query($path_run_inf_wan1."/inet/ipv4/dns:2");
		}
		$mode=query($path_wan1_inet."/addrtype");
		if($mode == "ipv4")
		{
			anchor($path_wan1_inet."/ipv4");
			if(query("static") == 1) //-----Static     
			{
				$dns1=query("dns/entry");
				$dns2=query("dns/entry:2");
			}
			if ($encr_mppe_128=="1")
			{
				$mss = 1356;/*$mtu-40; and mtu is fix to 1400, then mss=1356
							but when PPTP over PPTP, the mtu should be 1388, then the mss should be 1348*/ 
				$mss1 = $mss+1;
				fwrite("a",$START, "iptables -t mangle -N PREMSS.VPN\n");
				fwrite("a",$START, "iptables -t mangle -N PSTMSS.VPN\n");

				fwrite("a", $START,"iptables -t mangle -I PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $START,"iptables -t mangle -I POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				fwrite("a", $STOP,"iptables -t mangle -D PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $STOP,"iptables -t mangle -D POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				
				
				$iptopt = "-p tcp --tcp-flags SYN,RST,FIN SYN -m tcpmss --mss ".$mss1.":65535 -j TCPMSS --set-mss ".$mss;
				fwrite("a", $START,"iptables -t mangle -A PREMSS.VPN ".$iptopt."\n");
				fwrite("a", $START,"iptables -t mangle -A PSTMSS.VPN ".$iptopt."\n");
			}
		}
		else if($mode == "ppp4" && query($path_wan1_inet."/ppp4/over") == "eth") //-----PPPoE
		{
			$dns1=query($path_run_inf_wan1."/inet/ppp4/dns"); 
			$dns2=query($path_run_inf_wan1."/inet/ppp4/dns:2"); 
			if ($encr_mppe_128=="1")
			{
				$mss = 1356;/*$mtu-40; and mtu is fix to 1400, then mss=1356
							but when PPTP over PPTP, the mtu should be 1388, then the mss should be 1348*/ 
				$mss1 = $mss+1;
				fwrite("a",$START, "iptables -t mangle -N PREMSS.VPN\n");
				fwrite("a",$START, "iptables -t mangle -N PSTMSS.VPN\n");

				fwrite("a", $START,"iptables -t mangle -I PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $START,"iptables -t mangle -I POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				fwrite("a", $STOP,"iptables -t mangle -D PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $STOP,"iptables -t mangle -D POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				
				
				$iptopt = "-p tcp --tcp-flags SYN,RST,FIN SYN -m tcpmss --mss ".$mss1.":65535 -j TCPMSS --set-mss ".$mss;
				fwrite("a", $START,"iptables -t mangle -A PREMSS.VPN ".$iptopt."\n");
				fwrite("a", $START,"iptables -t mangle -A PSTMSS.VPN ".$iptopt."\n");
			}
		}
		else if($mode == "ppp4" && query($path_wan1_inet."/ppp4/over") == "pptp")	//-----PPTP
		{
			anchor($path_wan2_inet."/ipv4");
			if(query("static") == 1)
			{
				$dns1=query("dns/entry");
				$dns2=query("dns/entry:2");
			}
			if ($encr_mppe_128=="1")
			{
				$mss = 1356;/*$mtu-40; and mtu is fix to 1400, then mss=1356
							but when PPTP over PPTP, the mtu should be 1388, then the mss should be 1348*/ 
				$mss1 = $mss+1;
				fwrite("a",$START, "iptables -t mangle -N PREMSS.VPN\n");
				fwrite("a",$START, "iptables -t mangle -N PSTMSS.VPN\n");

				fwrite("a", $START,"iptables -t mangle -I PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $START,"iptables -t mangle -I POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				
				fwrite("a", $STOP,"iptables -t mangle -D PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $STOP,"iptables -t mangle -D POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				
				$iptopt = "-p tcp --tcp-flags SYN,RST,FIN SYN -m tcpmss --mss ".$mss1.":65535 -j TCPMSS --set-mss ".$mss;
				fwrite("a", $START,"iptables -t mangle -A PREMSS.VPN ".$iptopt."\n");
				fwrite("a", $START,"iptables -t mangle -A PSTMSS.VPN ".$iptopt."\n");
			}
		}
		else if($mode == "ppp4" && query($path_wan1_inet."/ppp4/over") == "l2tp")	//-----L2TP
		{
			anchor($path_wan2_inet."/ipv4");
			if(query("static") == 1)
			{
				$dns1=query("dns/entry");
				$dns2=query("dns/entry:2");
			}
			if ($encr_mppe_128=="1")
			{
				$mss = 1356;/*$mtu-40; and mtu is fix to 1400, then mss=1356
							but when PPTP over PPTP, the mtu should be 1388, then the mss should be 1348*/ 
				$mss1 = $mss+1;
				fwrite("a",$START, "iptables -t mangle -N PREMSS.VPN\n");
				fwrite("a",$START, "iptables -t mangle -N PSTMSS.VPN\n");

				fwrite("a", $START,"iptables -t mangle -I PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $START,"iptables -t mangle -I POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				fwrite("a", $STOP,"iptables -t mangle -D PREROUTING -i ppp0 -j PREMSS.VPN\n");
				fwrite("a", $STOP,"iptables -t mangle -D POSTROUTING -o ppp0 -j PSTMSS.VPN\n");
				
				$iptopt = "-p tcp --tcp-flags SYN,RST,FIN SYN -m tcpmss --mss ".$mss1.":65535 -j TCPMSS --set-mss ".$mss;
				fwrite("a", $START,"iptables -t mangle -A PREMSS.VPN ".$iptopt."\n");
				fwrite("a", $START,"iptables -t mangle -A PSTMSS.VPN ".$iptopt."\n");
			}
		}
		if($dns1=="0.0.0.0"){	$dns1="";}
		if($dns2=="0.0.0.0"){	$dns2="";}
		if( $dns1 != "0.0.0.0" && $dns1 != "" )
		{
			fwrite("a",$options_pptpd,"ms-dns ".$dns1."\n");
		}
		if( $dns2 != "0.0.0.0" && $dns2 != "" )
		{
			fwrite("a",$options_pptpd,"ms-dns ".$dns2."\n");
		}
		
		//Create /var/etc/pptpd.conf
		fwrite("w",$pptpd_conf,"option /etc/ppp/options.pptpd\n");
		fwrite("a",$pptpd_conf,"speed 115200\n");
		fwrite("a",$pptpd_conf,"stimeout 10\n");
		//fwrite("a",$pptpd_conf,"localip 172.16.0.254\n");
		//fwrite("a",$pptpd_conf,"remoteip 172.16.0.1-253\n");
		fwrite("a",$pptpd_conf,"connections ".$max_connections."\n");
		/* Delegates the allocation of client IP addresses to pppd
		localip and remoteip options are ignored if delegate option is set.	*/
		fwrite("a",$pptpd_conf,"delegate\n");
	
		if ($isolation == "1")
		{
			/* can not accesss lan */
			fwrite("a",$START, "iptables -A FWD.VPN -s 172.16.0.0/24 -j DROP\n");
		}
	}
	
	fwrite("a",$STOP,  "iptables -t mangle -F PREMSS.VPN\n");
	fwrite("a",$STOP,  "iptables -t mangle -F PSTMSS.VPN\n");
	
	fwrite("a",$STOP,  "iptables -t nat -F PRE.VPN\n");
	fwrite("a",$STOP,  "iptables -F FWD.VPN\n");
	fwrite("a",$STOP,  "xmldbc -X /runtime/device/vpn\n");
}
else
{
	fwrite("w", $START, "#!/bin/sh\n");
	fwrite("a", $START, "echo \"do nothing for VPN service ..\"  > /dev/console\n");
	fwrite("w", $STOP,  "#!/bin/sh\n");
	fwrite("a", $STOP, "echo \"do nothing for VPN service ..\"  > /dev/console\n");
}
?>
