<?
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/phyinf.php";

function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}
function error($errno)	{startcmd("exit ".$errno); stopcmd("exit ".$errno);}

//setup vlan
function setup_vlaninf($dev,$VID,$macaddr)
{
	$devname = $dev.".".$VID;
	startcmd(
			"vconfig add ".$dev." ".$VID."; ".
			"ip link set ".$devname." addr ".$macaddr."; ".
			"ip link set ".$devname." up"
			);
	stopcmd("ip link set ".$devname." down; vconfig rem ".$devname);
}
/* Walk throuhg all the physical interfaces of the logical interface.
 * Prepare the MAC address and save in the GLOBAL variable space. */
function get_macaddr($prefix, $i)
{
	$mac = query("/runtime/devdata/".$prefix.$i);
	if ($mac=="") $mac = query("/runtime/devdata/".$prefix);
	if ($mac=="")
	{
		if ($i>0) $i--;
		/* $i should be less than 10 or we will have trouble. */
		if		($prefix=="wanmac")	$mac = "00:DE:FA:5E:A0:0".$i;
		else if	($prefix=="lanmac")	$mac = "00:DE:FA:5E:B0:0".$i;
		else						$mac = "00:DE:FA:5E:FF:0".$i;
	}
	return $mac;
}

function prepare_macaddr($prefix, $macnam)
{
	foreach ("/inf")
	{
		$uid = query("uid");
		if (cut($uid,0,"-")==$prefix)
		{
			$phyinf = query("phyinf");
			$phyinfp= XNODE_getpathbytarget("", "phyinf", "uid", $phyinf, 0);
			if ($phyinfp!="")
			{
				$macaddr = get_macaddr($macnam, cut($uid,1,"-"));
				XNODE_set_var("MACADDR_".$phyinf, $macaddr);
				startcmd("# choosing ".$macaddr." for ".$uid."/".$phyinf);
			}
		}
	}
}

/* In bridge mode, we use wanmac. */
function prepare_bridge_macaddr()
{
	prepare_macaddr("BRIDGE", "lanmac");
}

function prepare_router_macaddr($mdoe)
{
	prepare_macaddr("LAN", "lanmac");
	prepare_macaddr("WAN", "wanmac");
}

function powerdown_lan()
{
}

function layout_bridge()
{
	SHELL_info($START, "LAYOUT: Start bridge layout ...");

	/* Allocate MAC addresses for interfaces. */
	prepare_bridge_macaddr();

	/* Start .......................................................................... */
	/* Config VLAN as bridge layout. */
	//disable switch VLAN configuration
	/* Realtek's suggestion to setup AP mode. */
	$infp = XNODE_getpathbytarget("", "inf", "uid", "BRIDGE-1", 0);
	$phyinf = query($infp."/phyinf");
	$macaddr = XNODE_get_var("MACADDR_".$phyinf);

	startcmd("echo 1 > /var/sys_op");
	//startcmd("echo 1 > /proc/sw_nat");
	startcmd("echo 2 > /proc/hw_nat"); //bridge mode
	startcmd("echo 0 > /proc/rtk_vlan_support");
	
	powerdown_lan();

	startcmd("ifconfig eth0 allmulti");
	startcmd("ifconfig eth1 allmulti");
	startcmd("ip link set eth0 addr ".$macaddr);
	startcmd("ip link set eth0 up");
	startcmd("ip link set eth1 addr ".$macaddr);
	startcmd("ip link set eth1 up");

	/*for https need lo interface*/
	startcmd('ip link set lo up');

	/* Create bridge interface. */
	startcmd("brctl addbr br0; brctl stp br0 off; brctl setfd br0 0");
	startcmd('brctl addif br0 eth0');
	startcmd('brctl addif br0 eth1');
	startcmd("ip link set br0 addr ".$macaddr);
	startcmd('ip link set br0 up');
	/*for bridge 192.168.10.50 alias ip access*/
	startcmd('ifconfig br0:1 192.168.0.50 up');
	$path = XNODE_getpathbytarget("/runtime", "inf", "uid", "BRIDGE-1", 1);
	set($path."/ipalias/cnt",1);
	set($path."/ipalias/ipv4/ipaddr:1","192.168.0.50");
	set($path."/devnam","br0"); 
	
	
	/* Update the runtime nodes */
	PHYINF_setup($phyinf, "eth", "br0");
	startcmd("service PHYINF.".$phyinf." alias PHYINF.BRIDGE-1");
	$path = XNODE_getpathbytarget("/runtime", "phyinf", "uid", $phyinf, 0);
	setattr($path."/linkstatus:1","get","psts wan");
	add($path."/bridge/port",  "BAND24G-1.1");
	add($path."/bridge/port",  "BAND24G-REPEATER");
	add($path."/bridge/port",  "BAND5G-1.1");
	add($path."/bridge/port",  "BAND5G-REPEATER");
	add($path."/bridge/port",  "BAND24G-1.2");
	add($path."/bridge/port",  "BAND24G-1.3");
	add($path."/bridge/port",  "BAND24G-1.4");
	add($path."/bridge/port",  "BAND5G-1.2");
	add($path."/bridge/port",  "BAND5G-1.3");
	add($path."/bridge/port",  "BAND5G-1.4");

	/* Done */
	startcmd('xmldbc -s /runtime/device/layout bridge');
	startcmd('usockc /var/gpio_ctrl BRIDGE');
	startcmd('service ENLAN start');
	startcmd('service PHYINF.ETH-1 alias PHYINF.BRIDGE-1');
	startcmd("service PHYINF.".$phyinf." start");
	startcmd('service HTTP restart');

	/*$p = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-1", 0);
	add($p."/bridge/port",	"WIFI-STA");*/

	/* Stop ........................................................................... */
	SHELL_info($STOP, "LAYOUT: Stop bridge layout ...");
	stopcmd("service PHYINF.ETH-1 stop");
	stopcmd('service PHYINF.BRIDGE-1 delete');
	stopcmd('xmldbc -s /runtime/device/layout ""');
	stopcmd("phpsh /etc/scripts/delpathbytarget.php BASE=/runtime NODE=phyinf TARGET=uid VALUE=".$phyinf);
	stopcmd('brctl delif br0 eth0');
	stopcmd('brctl delif br0 eth1');
	stopcmd('ip link set eth0 down');
	stopcmd('ip link set eth1 down');
	/*for bridge 192.168.0.254 alias ip access*/
	stopcmd('ifconfig br0:1 down');
	stopcmd('ip link set br0 down');
	stopcmd('brctl delbr br0');
	stopcmd("service PHYINF.".$phyinf." stop");
	stopcmd("service PHYINF.BRIDGE-1 delete");
	stopcmd('xmldbc -s /runtime/device/layout ""');
	return 0;
}

function layout_router($mode)
{
	startcmd('echo "LAYOUT: ROUTER" > /dev/console');

	/* Start .......................................................................... */
	/* Allocate MAC addresses for interfaces. */
	prepare_router_macaddr();

	/* Sart ... */
	$lanp		= XNODE_getpathbytarget("", "inf", "uid", "LAN-1", 0);
	$lanphy		= query($lanp."/phyinf");
	$lanmac		= XNODE_get_var("MACADDR_".$lanphy);
	$wanp		= XNODE_getpathbytarget("", "inf", "uid", "WAN-1", 0);
	$wanphy		= query($wanp."/phyinf");
	$wanphyinfp	= XNODE_getpathbytarget("", "phyinf", "uid", $wanphy, 0);
	$wanmac		= query($wanphyinfp."/macaddr");
	if ($wanmac=="") $wanmac = XNODE_get_var("MACADDR_".$wanphy);

	/* Realtek's suggestion to setup RG mode. */
	$vlan_support = 0;
	startcmd("echo 0 > /var/sys_op");
	startcmd("echo 0 > /proc/sw_nat");
	startcmd("echo 1 > /proc/fast_nat");
	startcmd("echo ".$vlan_support." > /proc/rtk_vlan_support");

	powerdown_lan();

	startcmd("ifconfig eth0 allmulti");

	/* Setup MAC address */
	/* Check User configuration for WAN port. */
	startcmd("ip link set eth0 addr ".$lanmac);
	startcmd("ip link set eth0 up");
	startcmd("ip link set eth1 addr ".$wanmac);
	startcmd("ip link set eth1 up");

	/*for https need lo interface*/
	startcmd('ip link set lo up');
	
	/* Create bridge interface. */
	startcmd("brctl addbr br0; brctl stp br0 off; brctl setfd br0 0;");
	startcmd("brctl addif br0 eth0");
	startcmd("ip link set br0 addr ".$lanmac);
	startcmd("ip link set br0 up");

	if ($mode=="1W2L")
	{
		startcmd("brctl addbr br1; brctl stp br1 off; brctl setfd br1 0;");
		startcmd("ip link set br1 up");

		PHYINF_setup("ETH-1", "eth", "br0");
		PHYINF_setup("ETH-2", "eth", "br1");
		PHYINF_setup("ETH-3", "eth", "eth1");

		/* set Service Alias */
		startcmd('service PHYINF.ETH-1 alias PHYINF.LAN-1');
		startcmd('service PHYINF.ETH-2 alias PHYINF.LAN-2');
		startcmd('service PHYINF.ETH-3 alias PHYINF.WAN-1');
		/* WAN: set extension nodes for linkstatus */
		$path = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-3", 0);
		setattr($path."/linkstatus","get","psts wan");
	}

	/* Setup the runtime nodes. */
	$Wan_index_number = query("/device/router/wanindex");

	/* LAN: set extension nodes for linkstatus */
	$path = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-1", 0);

	setattr($path."/linkstatus:1","get","psts lan1");
	setattr($path."/linkstatus:2","get","psts lan2");
	setattr($path."/linkstatus:3","get","psts lan3");
	setattr($path."/linkstatus:4","get","psts lan4");

	/* Done */
	startcmd("xmldbc -s /runtime/device/layout router");
	startcmd("xmldbc -s /runtime/device/router/mode ".$mode);
	startcmd("usockc /var/gpio_ctrl ROUTER");
	startcmd("service PHYINF.ETH-1 start");
	startcmd("service PHYINF.ETH-2 start");
	if ($mode=="1W2L") startcmd("service PHYINF.ETH-3 start");

	/* Stop ........................................................................... */
	SHELL_info($STOP, "LAYOUT: Stop router layout ...");
	if ($mode=="1W2L")
	{
		stopcmd("service PHYINF.ETH-3 stop");
		stopcmd("service PHYINF.LAN-2 delete");
	}
	stopcmd('service PHYINF.ETH-2 stop');
	stopcmd('service PHYINF.ETH-1 stop');
	stopcmd('service PHYINF.WAN-1 delete');
	stopcmd('service PHYINF.LAN-1 delete');
	stopcmd('xmldbc -s /runtime/device/layout ""');
	stopcmd('phpsh /etc/scripts/delpathbytarget.php BASE=/runtime NODE=phyinf TARGET=uid VALUE=ETH-1');
	stopcmd('phpsh /etc/scripts/delpathbytarget.php BASE=/runtime NODE=phyinf TARGET=uid VALUE=ETH-2');
	stopcmd('phpsh /etc/scripts/delpathbytarget.php BASE=/runtime NODE=phyinf TARGET=uid VALUE=ETH-3');
	stopcmd('brctl delif br0 eth0');
	stopcmd('ip link set eth0 down');
	stopcmd('ip link set eth1 down');
	stopcmd('ip link set br0 down');
	stopcmd('brctl delbr br0; brctl delbr br1');
	return 0;
}

/* everything starts from here !! */
fwrite("w",$START, "#!/bin/sh\n");
fwrite("w", $STOP, "#!/bin/sh\n");

$ret = 9;
$layout = query("/device/layout");
if ($layout=="router")
{
	/* only 1W1L & 1W2L supported for router mode. */
	$mode = query("/device/router/mode"); if ($mode!="1W1L") $mode = "1W2L";
	$ret = layout_router($mode);
	$p = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-1", 0);
	add($p."/bridge/port",	"BAND24G-1.1");	
	add($p."/bridge/port",	"BAND5G-1.1");	
	$p = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-2", 0);
	add($p."/bridge/port",	"BAND24G-1.2");	
	add($p."/bridge/port",	"BAND5G-1.2");	
}
else if ($layout=="bridge")
{
	$ret = layout_bridge();
}

/* driver is not installed yet, we move this to s52wlan (tom, 20120405) */
/* startcmd("service PHYINF.WIFI start");*/ 
//stopcmd("service PHYINF.WIFI stop");

error($ret);

?>
