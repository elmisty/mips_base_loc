<?
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/trace.php";

/* trigger by vpn-helper.sh to record PPTP client state */
if($ACTION=="add")
{
	//remove old entry for error checking
	$target = 0;
	foreach ("/runtime/device/vpn/client/entry")
	{
		if($CLIENT == query("account"))
		{
			$target = $InDeX;
			break;
		}
	}
	if ($target != 0)	{	XNODE_del_entry("/runtime/device/vpn/client", $target);	}
	
	$newentry = XNODE_add_entry("/runtime/device/vpn/client", "vpn");
	anchor($newentry);
	set("account", $CLIENT);
	set("pid", $PID);
}
else if($ACTION=="remove")
{
	$target = 0;
	foreach ("/runtime/device/vpn/client/entry")
	{
		if($PID == query("pid"))
		{
			$target = $InDeX;
			break;
		}
	}
	if ($target != 0)	{	XNODE_del_entry("/runtime/device/vpn/client", $target);	}
}
else
{
	TRACE_error("vpn-helper: error action ".$ACTION);
}
?>		