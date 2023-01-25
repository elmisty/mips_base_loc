<?
include "/htdocs/phplib/xnode.php";

setattr("/runtime/devdata/mfcmode" ,"get","devdata get -e mfcmode");


function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}


function schcmd($uid)
{
	/* Get schedule setting */
	$p = XNODE_getpathbytarget("", "phyinf", "uid", $uid, 0);
	$sch = XNODE_getschedule($p);
	$schid =  query($p."/schedule");
	if ($sch=="") $cmd = "start";
	else	{$cmd = XNODE_getschedule2013cmd($schid);}
	return $cmd;
}

/********************************************************************/
fwrite("w",$START, "#!/bin/sh\n");
fwrite("w", $STOP, "#!/bin/sh\n");

if(query("/runtime/devdata/mfcmode") != "1"){
	if(query("/device/layout")=="router")
	{
	fwrite("a",$START,	
		"service PHYINF.BAND24G-1.1 ".schcmd("BAND24G-1.1")."\n".
		"service PHYINF.BAND24G-1.2 ".schcmd("BAND24G-1.2")."\n".
		"service PHYINF.BAND5G-1.1 ".schcmd("BAND5G-1.1")."\n".
		"service PHYINF.BAND5G-1.2 ".schcmd("BAND5G-1.2")."\n".
		);

	fwrite("a",$STOP,
		"echo 1 > /var/run/BAND24G-1.1.DOWN\n".
		"rm -f /var/run/BAND24G-1.1.UP\n".
		"echo 1 > /var/run/BAND24G-1.2.DOWN\n".
		"rm -f /var/run/BAND24G-1.2.UP\n".
		"echo 1 > /var/run/BAND5G-1.1.DOWN\n".
		"rm -f /var/run/BAND5G-1.1.UP\n".
		"echo 1 > /var/run/BAND5G-1.2.DOWN\n".
		"rm -f /var/run/BAND5G-1.2.UP\n".
		"service PHYINF.BAND5G-1.2 stop\n".
		"service PHYINF.BAND5G-1.1 stop\n".
		"service PHYINF.BAND24G-1.2 stop\n".
		"service PHYINF.BAND24G-1.1 stop\n".
		);
	}
	else if(query("/device/layout")=="bridge")
	{
		fwrite("a",$START,	
			"service PHYINF.BAND24G-1.1 ".schcmd("BAND24G-1.1")."\n".
			"service PHYINF.BAND24G-1.2 ".schcmd("BAND24G-1.2")."\n".
			"service PHYINF.BAND5G-1.1 ".schcmd("BAND5G-1.1")."\n".
			"service PHYINF.BAND5G-1.2 ".schcmd("BAND5G-1.2")."\n".
			"service PHYINF.BAND24G-REPEATER ".schcmd("BAND24G-1.1")."\n".
			"service PHYINF.BAND5G-REPEATER ".schcmd("BAND5G-1.1")."\n".
			);
		//workaround: wlan0-vxd shouble be follow wlan0 , so use same schedule to workaround it.
		fwrite("a",$STOP,
			"echo 1 > /var/run/BAND5G-REPEATER.DOWN\n".
			"rm -f /var/run/BAND5G-REPEATER.UP\n".
			"echo 1 > /var/run/BAND24G-REPEATER.DOWN\n".
			"rm -f /var/run/BAND24G-REPEATER.UP\n".
			"echo 1 > /var/run/BAND24G-1.1.DOWN\n".
			"rm -f /var/run/BAND24G-1.1.UP\n".
			"echo 1 > /var/run/BAND24G-1.2.DOWN\n".
			"rm -f /var/run/BAND24G-1.2.UP\n".
			"echo 1 > /var/run/BAND5G-1.1.DOWN\n".
			"rm -f /var/run/BAND5G-1.1.UP\n".
			"echo 1 > /var/run/BAND5G-1.2.DOWN\n".
			"rm -f /var/run/BAND5G-1.2.UP\n".
			"service PHYINF.BAND5G-REPEATER stop\n".
			"service PHYINF.BAND24G-REPEATER stop\n".
			"service PHYINF.BAND5G-1.2 stop\n".
			"service PHYINF.BAND5G-1.1 stop\n".
			"service PHYINF.BAND24G-1.2 stop\n".
			"service PHYINF.BAND24G-1.1 stop\n".
			);
			
			startcmd("xmldbc -k \"DHCP_RENEW\"");
			startcmd("xmldbc -t \"DHCP_RENEW:3:event WANPORT.LINKUP\"");
			stopcmd("event WANPORT.LINKDOWN");
			
	}
}
fwrite("a",$START,	"exit 0\n");
fwrite("a",$STOP,	"exit 0\n");
?>
