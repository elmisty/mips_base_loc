<?
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/trace.php";

function cmd($cmd) {echo $cmd."\n";}

$found = 0;
foreach ("/runtime/prd/visitlist/entry") if ($VaLuE==$clientmac) $found=$InDeX;
if ($found > 0)
{
	TRACE_debug("prd: client ".$clientmac." lease time up");
	del("/runtime/prd/visitlist/entry:".$found);
	cmd("iptables -t nat -D PRD.LAN-1 -m mac --mac-source ".$clientmac." -j RETURN");
}
?>
