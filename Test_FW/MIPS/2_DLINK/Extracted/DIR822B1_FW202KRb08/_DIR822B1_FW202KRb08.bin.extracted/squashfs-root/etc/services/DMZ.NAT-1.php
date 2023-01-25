<?
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/inf.php";
include "/htdocs/phplib/phyinf.php";
include "/htdocs/webinc/config.php";

fwrite("w",$START, "#!/bin/sh\n");
fwrite("a",$START, "service IPTDMZ restart\n");
fwrite("w",$STOP,  "#!/bin/sh\n");
fwrite("a",$STOP, "service IPTDMZ stop\n");

/* refresh the chain of WAN interfaces */
$i = 1;
while ($i>0)
{
	$ifname = "WAN-".$i;
	$ifpath = XNODE_getpathbytarget("", "inf", "uid", $ifname, 0);
	if ($ifpath == "") { $i=0; break; }
	fwrite("a",$_GLOBALS["START"], "service IPT.".$ifname." restart\n");
	fwrite("a",$_GLOBALS["STOP"],  "service IPT.".$ifname." restart\n");
	$i++;
}

$sdmz_enable = get("", "/nat/entry/sdmz/enable");
if($sdmz_enable=="1")
{
	$wanaddr_type = INF_getcurraddrtype($WAN1);
	$wan_gw = INF_getcurrgateway($WAN1);
	$wan_runtime_inf = XNODE_getpathbytarget("/runtime", "inf", "uid", $WAN1, "0");
	$wan_peer = get("", $wan_runtime_inf."/inet/ppp4/peer");
	$lanip = INF_getcurripaddr($LAN1);
	$lan_devname = PHYINF_getruntimeifname($LAN1);
	$wanip = INF_getcurripaddr($WAN1);
	$wan_devname = PHYINF_getruntimeifname($WAN1);
	$wan_mask = INF_getcurrmask($WAN1);
	$wan_network_id = ipv4networkid($wanip, $wan_mask);	
		
	if($wanaddr_type=="ipv4")
	{
		$wan_static = get("", $wan_runtime_inf."/inet/ipv4/static");
		fwrite("a",$START, "ip neigh add proxy ".$wan_gw." dev ".$lan_devname."\n");
		fwrite("a",$START, "ip neigh add proxy ".$wanip." dev ".$wan_devname."\n");
		fwrite("a",$START, "ip route del table local ".$wanip." dev ".$wan_devname."\n");
		fwrite("a",$START, "ip route add ".$wanip." dev ".$lan_devname."\n");
		fwrite("a",$START, "ip route change table default default via ".$wan_gw." dev ".$wan_devname." src ".$lanip." metric 100\n");
		fwrite("a",$START, "ip route change table main ".$wan_network_id."/".$wan_mask." dev ".$wan_devname." proto kernel  scope link  src ".$lanip."\n");
		fwrite("a",$START, "event UPDATERESOLV\n");
		fwrite("a",$START, "service HW_ACCEL restart\n");
		fwrite("a",$START, "service DHCPS4.LAN-1 restart\n");
		fwrite("a",$START, "echo 0 > /var/proc/alpha/ip_conntrack_fastnat\n"); //Let the other LAN PC work normally		
		if ($wan_static=="0")
		{
			fwrite("a",$START, "echo -n \"--proto UDP --port 67\" > /proc/nf_conntrack_flush\n"); // flush previous wan dhcpc conntrack
			fwrite("a",$START, "echo -n \"--proto UDP --port 68\" > /proc/nf_conntrack_flush\n"); // flush previous wan dhcpc conntrack
		}

		
		fwrite("a",$STOP, "ip neigh del proxy ".$wan_gw." dev ".$lan_devname."\n");
		fwrite("a",$STOP, "ip neigh del proxy ".$wanip." dev ".$wan_devname."\n");
		fwrite("a",$STOP, "ip route del ".$wanip." dev ".$lan_devname."\n");
		fwrite("a",$STOP, "ip route add table local local ".$wanip." dev ".$wan_devname."\n");
		fwrite("a",$STOP, "ip route change table default default via ".$wan_gw." dev ".$wan_devname." metric 100\n");
		fwrite("a",$STOP, "ip route change table main ".$wan_network_id."/".$wan_mask." dev ".$wan_devname." proto kernel  scope link  src ".$wanip."\n");
		fwrite("a",$STOP, "event UPDATERESOLV\n");
		fwrite("a",$STOP, "service HW_ACCEL restart\n");
		fwrite("a",$STOP, "service DHCPS4.LAN-1 restart\n");
		fwrite("a",$STOP, "echo 1 > /var/proc/alpha/ip_conntrack_fastnat\n");		
		if ($wan_static=="0")
		{
			fwrite("a",$STOP, "echo -n \"--proto UDP --port 67\" > /proc/nf_conntrack_flush\n"); // flush dhcpc conntrack
			fwrite("a",$STOP, "echo -n \"--proto UDP --port 68\" > /proc/nf_conntrack_flush\n"); // flush dhcpc conntrack
		}
	}
	else if($wanaddr_type=="ppp4")
	{
		fwrite("a",$START, "ip neigh add proxy ".$wan_peer." dev ".$lan_devname."\n");
		fwrite("a",$START, "ip route del table local ".$wanip." dev ".$wan_devname."\n");
		fwrite("a",$START, "ip route add ".$wanip." dev ".$lan_devname."\n");
		fwrite("a",$START, "ip route change table default default via ".$wan_peer." dev ".$wan_devname." src ".$lanip." metric 100\n");
		fwrite("a",$START, "ip route change table main ".$wan_peer." dev ".$wan_devname." proto kernel  scope link  src ".$lanip."\n");
		fwrite("a",$START, "event UPDATERESOLV\n");
		fwrite("a",$START, "service HW_ACCEL restart\n");
		fwrite("a",$START, "service DHCPS4.LAN-1 restart\n");
		fwrite("a",$START, "echo 0 > /var/proc/alpha/ip_conntrack_fastnat\n"); //Let the other LAN PC work normally		
		
		fwrite("a",$STOP, "ip neigh del proxy ".$wan_peer." dev ".$lan_devname."\n");
		fwrite("a",$STOP, "ip route del ".$wanip." dev ".$lan_devname."\n");		
		fwrite("a",$STOP, "ip route add table local local ".$wanip." dev ".$wan_devname."\n");
		fwrite("a",$STOP, "ip route change table default default via ".$wan_peer." dev ".$wan_devname." metric 100\n");
		fwrite("a",$STOP, "ip route change table main ".$wan_peer." dev ".$wan_devname." proto kernel  scope link  src ".$wanip."\n");
		fwrite("a",$STOP, "event UPDATERESOLV\n");
		fwrite("a",$STOP, "service HW_ACCEL restart\n");
		fwrite("a",$STOP, "service DHCPS4.LAN-1 restart\n");
		fwrite("a",$STOP, "echo 1 > /var/proc/alpha/ip_conntrack_fastnat\n");			
	}
}
?>
