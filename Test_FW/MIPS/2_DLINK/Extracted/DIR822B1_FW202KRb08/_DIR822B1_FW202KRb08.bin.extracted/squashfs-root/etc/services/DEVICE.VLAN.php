<?
include "/htdocs/phplib/trace.php";

fwrite("w",$START, "#!/bin/sh\n");
fwrite("w", $STOP, "#!/bin/sh\n");


function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}


//set vlan id, when id=0 then turn off tag
function setvlan($dev,$vlan_id,$internetid)
{
/*
    global_vlan: 0  (1 is active)
    is_lan: 1		(1 is lan)
    vlan_enable: 0  (1 is active)
    vlan_tag: 0     (1 is active)
    vlan_id: 0		(1~4096)
    vlan_pri: 0
    vlan_cfi: 0
    vlan_forwarding_rule: 0
*/
	
	TRACE_debug("vlan_id = ".$vlan_id);
	TRACE_debug("interid = ".$internetid);
	
	if($dev == "eth1")//set wan tag
	{
		startcmd('echo 1 0 1 1 '.$internetid.' 0 0 2 > /proc/'.$dev.'/mib_vlan');
		stopcmd('echo 0 0 0 0 0 0 0 0 > /proc/'.$dev.'/mib_vlan');
	}
	else if($dev == "eth7")//set bridge tag
	{
		startcmd('echo 1 0 1 0 '.$internetid.' 0 0 1 > /proc/'.$dev.'/mib_vlan');
		stopcmd('echo 0 1 0 0 0 0 0 0 > /proc/'.$dev.'/mib_vlan');
	}
	else
	{
		if($vlan_id != $internetid)//if tag is not ethernet, then set bridge mode
		{
			startcmd('echo 1 1 1 1 '.$vlan_id.' 0 0 1 > /proc/'.$dev.'/mib_vlan');
		}
		else
		{
			startcmd('echo 1 1 1 1 '.$vlan_id.' 0 0 2 > /proc/'.$dev.'/mib_vlan');
		}
		//turn off vlan tag
		stopcmd('echo 0 1 0 0 0 0 0 0 > /proc/'.$dev.'/mib_vlan');
	}
	
}

/*set vlan id, when id=0 then turn off tag, this need to modify to this way,
because vlan setting is change.*/
function setvlanwlan($dev,$vlan_id,$iptv_id,$voip_id,$internetid)
{
	TRACE_debug("vlan_id = ".$vlan_id);
	TRACE_debug("iptv_id = ".$iptv_id);
	TRACE_debug("voip_id = ".$voip_id);

	if($vlan_id == $iptv_id || $vlan_id == $voip_id)//if tag is not ethernet, then set bridge mode
	{
		startcmd('echo 1 1 1 1 '.$vlan_id.' 0 0 1 > /proc/'.$dev.'/mib_vlan');
	}
	else
	{
		startcmd('echo 1 1 1 1 '.$internetid.' 0 0 2 > /proc/'.$dev.'/mib_vlan');
	}
	//turn off vlan tag
	stopcmd('echo 0 1 0 0 0 0 0 0 > /proc/'.$dev.'/mib_vlan');
}



/* turn on/off guest access EX:ping or other access for wlan0-va0~va3*/
/* 0 is off, 1 is on*/
function guest_access($dev,$sw)
{
	startcmd('iwpriv '.$dev.' set_mib guest_access='.$sw);
}



/*set lan mac and set each lan up*/
function set_lan($dev,$mac)
{
	startcmd('ifconfig '.$dev.' hw ether '.$mac);
	startcmd('ifconfig '.$dev.' up');
	startcmd('brctl addif br0 '.$dev);
}

function check_vlan_nat($voipid_br,$iptvid_br,$vlan)
{
	//this is because vlan inter can be save on web.
	if($voipid_br == $vlan || $iptvid_br == $vlan)
		return 1;
	else
		return 2;
}

function get_inter_vlan($is_inter_nat,$interid,$vlan)
{
	if($is_inter_nat == 2)
		return $interid;
	else
		return $vlan;
}

$vlan_path	= "/device/vlan/lanport/";
$vwlan_path = "/device/vlan/wlanport/";
$vlanenable = query("/device/vlan/active");
$mac_addr   = query("/runtime/devdata/lanmac");
$layout		= query("/device/layout");

$interid	= query("/device/vlan/interid");
$voipid		= query("/device/vlan/voipid");
$iptvid		= query("/device/vlan/iptvid");
$iptv_port	= query("/device/iptv");

$lan1id = query($vlan_path."lan1");
$lan2id = query($vlan_path."lan2");
$lan3id = query($vlan_path."lan3");
$lan4id = query($vlan_path."lan4");

$wlan01id = query($vwlan_path."wlan01");
$wlan02id = query($vwlan_path."wlan02");
$wlan03id = query($vwlan_path."wlan03");
$wlan04id = query($vwlan_path."wlan04");
$wlan11id = query($vwlan_path."wlan11");
$wlan12id = query($vwlan_path."wlan12");
$wlan13id = query($vwlan_path."wlan13");
$wlan14id = query($vwlan_path."wlan14");

//==del all bridge device==//
//startcmd('brctl delif br0 eth0');
//stopcmd('ifconfig eth0 down');
//stopcmd('ifconfig eth2 down');
stopcmd('ifconfig eth3 down');
stopcmd('ifconfig eth4 down');
stopcmd('ifconfig eth7 down');
stopcmd('brctl delif br0 eth2');
stopcmd('brctl delif br0 eth3');
stopcmd('brctl delif br0 eth4');
stopcmd('brctl delif br0 eth7');

if($vlanenable == "1" && $layout == "router")
{
	//startcmd('echo 1 > /proc/rtk_vlan_support');

	$IS_NAT_LAN1 = 2;
	$IS_NAT_LAN2 = 2;
	$IS_NAT_LAN3 = 2;
	$IS_NAT_LAN4 = 2;
	
	/*
	if($interid != $lan1id)
		$IS_NAT_LAN1 = 1;
	if($interid != $lan2id)
		$IS_NAT_LAN2 = 1;
	if($interid != $lan3id)
		$IS_NAT_LAN3 = 1;
	if($interid != $lan4id)
		$IS_NAT_LAN4 = 1;
	*/
	/*
	because realtek provide the hw vlan/ dual wan patch,
	cause the PPPOE/DHCP vlan revert, so let lan become un-reference/un-used.
	*/
	$IS_NAT_LAN1 = check_vlan_nat($iptvid,$voipid,$lan1id);
	$IS_NAT_LAN2 = check_vlan_nat($iptvid,$voipid,$lan2id);
	$IS_NAT_LAN3 = check_vlan_nat($iptvid,$voipid,$lan3id);
	$IS_NAT_LAN4 = check_vlan_nat($iptvid,$voipid,$lan4id);
	
	$LAN1ID = get_inter_vlan($IS_NAT_LAN1,$interid,$lan1id);
	$LAN2ID = get_inter_vlan($IS_NAT_LAN2,$interid,$lan2id);
	$LAN3ID = get_inter_vlan($IS_NAT_LAN3,$interid,$lan3id);
	$LAN4ID = get_inter_vlan($IS_NAT_LAN4,$interid,$lan4id);
	
	$HWVLAN_WAN  = " 1 1 0 ".$interid;
	$HWVLAN_LAN1 = " 1 ".$IS_NAT_LAN1." 0 ".$LAN1ID;
	$HWVLAN_LAN2 = " 1 ".$IS_NAT_LAN2." 0 ".$LAN2ID;
	$HWVLAN_LAN3 = " 1 ".$IS_NAT_LAN3." 0 ".$LAN3ID;
	$HWVLAN_LAN4 = " 1 ".$IS_NAT_LAN4." 0 ".$LAN4ID;
		
	startcmd('echo '.$HWVLAN_WAN.$HWVLAN_LAN1.$HWVLAN_LAN2.$HWVLAN_LAN3.$HWVLAN_LAN4.' > /proc/rtl_hw_vlan_support');
	
	//interface is delay to down for set iptv port unused
	startcmd('ifconfig eth0 down');
	startcmd('ifconfig eth2 down');

	setvlan("eth0",$interid,$interid);//set wan tag
	setvlan("eth1",$interid,$interid);
	
	set_lan("eth0",$mac_addr);
	
	//when iptv port set unused, set rtl_hw_vlan_support then eth2 down
	startcmd('ifconfig eth2 down');
	if($lan1id == $iptvid || $lan2id == $iptvid || $lan3id == $iptvid || $lan4id == $iptvid)
	{
		setvlan("eth2",$iptvid,$interid);
		set_lan("eth2",$mac_addr);
	}
	/*if($lan1id == $voipid || $lan2id == $voipid || $lan3id == $voipid || $lan4id == $voipid)
	{
		setvlan("eth3",$voipid,$interid);
		set_lan("eth3",$mac_addr);
	}*/
	
	//set_lan("eth0",$mac_addr);
	//set_lan("eth2",$mac_addr);
	//set_lan("eth3",$mac_addr);
	
	//SW-VLAN
	setvlanwlan("wlan0",    $wlan01id,$iptvid,$voipid,$interid);
	setvlanwlan("wlan0-va0",$wlan02id,$iptvid,$voipid,$interid);
	setvlanwlan("wlan0-va1",$wlan03id,$iptvid,$voipid,$interid);
	setvlanwlan("wlan0-va2",$wlan04id,$iptvid,$voipid,$interid);
	setvlanwlan("wlan1",    $wlan11id,$iptvid,$voipid,$interid);
	setvlanwlan("wlan1-va0",$wlan12id,$iptvid,$voipid,$interid);
	setvlanwlan("wlan1-va1",$wlan13id,$iptvid,$voipid,$interid);
	setvlanwlan("wlan1-va2",$wlan14id,$iptvid,$voipid,$interid);
	
    /*if(query("/tr069/external/enable_dualwan")=="1")
    {
		$PPPoE_VLANID = query("/tr069/external/pppoevlanid");
		if($PPPoE_VLANID != 0)
		{
			fwrite("a",$_GLOBALS["START"], "echo 1 1 ".$PPPoE_VLANID." 0 0 > /proc/ppp/mib_vlan\n");
		}
    }*/
}
else
{
	startcmd('ifconfig eth0 up');
}

/* Done */
fwrite("a",$START, "exit 0\n");
fwrite("a", $STOP, "exit 0\n");
?>
