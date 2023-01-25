<?
include "/htdocs/phplib/trace.php"; 
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/phyinf.php";
include "/htdocs/phplib/inf.php";

fwrite("w",$START, "#!/bin/sh\n");
fwrite("w",$STOP,  "#!/bin/sh\n");

function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}

if(query("/device/eee")=="1") fwrite("w",$START, "rtlioc eneee\n");
else if(query("/device/eee")=="0") fwrite("w",$START, "rtlioc diseee\n");

/*  prepare data for http to create httpd.conf (service PRD) */
function prdsetup($name)
{
	/* Get the interface */
	$infp = XNODE_getpathbytarget("", "inf", "uid", $name, 0);

	if ($infp=="")
	{
		SHELL_info($_GLOBALS["START"], "prdsetup: (".$name.") not exist.");
		SHELL_info($_GLOBALS["STOP"],  "prdsetup: (".$name.") not exist.");
		return;
	}

	/* Get the "runtime" physical interface */
	$stsp = XNODE_getpathbytarget("/runtime", "inf", "uid", $name, 0);

	if ($stsp!="")
	{
		$phy = query($stsp."/phyinf");
		if ($phy!="")
		{
			$phyp = XNODE_getpathbytarget("/runtime", "phyinf", "uid", $phy, 0);
			if ($phyp!="" && query($phyp."/valid")=="1")
				$ifname = query($phyp."/name");
		}
	}

	/* Get address family & IP address */
	$atype = query($stsp."/inet/addrtype");

	if      ($atype=="ipv4") {$af="inet"; $ipaddr=query($stsp."/inet/ipv4/ipaddr");}
	else if ($atype=="ppp4") {$af="inet"; $ipaddr=query($stsp."/inet/ppp4/local");}
	else if ($atype=="ipv6") {$af="inet6";$ipaddr=query($stsp."/inet/ipv6/ipaddr");}
	else if ($atype=="ppp6") {$af="inet6";$ipaddr=query($stsp."/inet/ppp6/local");}

	if($af != "inet")
	{
		SHELL_info($_GLOBALS["START"], "prdsetup: (".$name.") not ipv4.");
		SHELL_info($_GLOBALS["STOP"],  "prdsetup: (".$name.") not ipv4.");
		return;
	}

	if ($ifname==""||$af==""||$ipaddr=="")
	{
		SHELL_info($_GLOBALS["START"], "prdsetup: (".$name.") no phyinf.");
		SHELL_info($_GLOBALS["STOP"],  "prdsetup: (".$name.") no phyinf.");
		return;
	}
	$webaccess = query("/device/redirect/enable");
	$port = "7789";
	if($name=="LAN-1")
	{
		$dirty = 0;
	}
	else
	{
    		$dirty = 0;
    		$ifname="";
	}
	
	
	$stsp = XNODE_getpathbytarget("/runtime/services/http", "server", "uid", "PRD.".$name, 0);
	if ($stsp=="")
	{
		if ($webaccess != 1)
		{
			SHELL_info($_GLOBALS["START"], "prdsetup: (".$name." with code ".$webaccess.") not active.");
			SHELL_info($_GLOBALS["STOP"],  "prdsetup: (".$name." with code ".$webaccess.") not active.");
			return;
		}
		else
		{
			$dirty++;
			$stsp = XNODE_getpathbytarget("/runtime/services/http","server","uid","PRD.".$name,1);
			set($stsp."/mode",  "PRD");
			set($stsp."/inf",   $name);
			set($stsp."/ifname", $ifname);
			set($stsp."/ipaddr",$ipaddr);
			set($stsp."/port",  $port);
			set($stsp."/af",    $af);
		}
	}
	else
	{
		if ($webaccess != 1) { $dirty++; del($stsp);}
		else
		{
			if (query($stsp."/mode")!="PRD")   { $dirty++; set($stsp."/mode", "PRD"); }
			if (query($stsp."/inf")!=$name)         { $dirty++; set($stsp."/inf", $name); }
			if (query($stsp."/ifname")!=$ifname)    { $dirty++; set($stsp."/ifname", $ifname); }
			if (query($stsp."/ipaddr")!=$ipaddr)    { $dirty++; set($stsp."/ipaddr", $ipaddr); }
			if (query($stsp."/port")!=$port)        { $dirty++; set($stsp."/port", $port); }
			if (query($stsp."/af")!=$af)            { $dirty++; set($stsp."/af", $af); }
		}
	}

	stopcmd('sh /etc/scripts/delpathbytarget.sh runtime/services/http server uid PRD.'.$name);
}

if(query("/device/redirect/enable")=="1") 
{
	prdsetup("LAN-1");
}

//page redirect iptables setting
$prdport = "7789";
if(query("/device/redirect/enable")=="1")
{
	fwrite("a",$START, "iptables -t nat -A PRD.LAN-1 -p tcp --dport 80 -j REDIRECT --to-ports ".$prdport."\n");
}
fwrite("a",$STOP, "iptables -t nat -F PRD.LAN-1\n");

//clean table maintain visited clients
fwrite("a",$STOP, "xmldbc -X /runtime/prd\n");

startcmd("service HTTP restart");
startcmd("service IPT.WAN-1 restart");
stopcmd("service HTTP restart");

fwrite("a",$START, "exit 0\n");
fwrite("a",$STOP,  "exit 0\n");
?>