<?
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/inet.php";
include "/htdocs/phplib/trace.php";

function execute_cmd($cmd)
{
	fwrite("w","/var/run/exec.sh",$cmd);
	event("EXECUTE");
}

function HTML_gen_302_header($host, $uri)
{
        echo "Location: http://";
        if ($host == "")        echo $_SERVER["HTTP_HOST"].$uri;
        else                            echo $host.$uri;
        echo "\r\n\r\n";
}

function HTML_gen_401_header()
{
	echo "HTTP/1.1 401 Unauthorized\r\n";
	echo "\r\n\r\n";
	echo "<H1>HTTP/1.1 401 Unauthorized</H1>";
}

$url = get("","/device/redirect/url");
$clientip = $_SERVER["REMOTE_ADDR"];
$host = $_SERVER['HTTP_HOST'];
$clientmac = INET_ARP($clientip);
$agent = $_SERVER['HTTP_USER_AGENT'];
$visit=0;
$lease_time = query("/device/redirect/leasetime");
$lease_time_phpfile = "/htdocs/web/prd/leaset_time.php";

$url_start=strstr($url,"http://");
if($url_start!="") {	$url=substr($url,strlen("http://"),strlen($url)-strlen("http://")); } //remove "http://"
$agent = tolower($agent);
$is_browser = strstr($agent, "mozilla");
//TRACE_debug("prd: user-agent=".$agent);

/* do page redirect when HTTP packet is send by BROWSER,
	 but we can't check is it really send by "USER"
*/
TRACE_debug("prd: is_browser =".$is_browser."\n");

if($is_browser!="")
{
	/* prevent looping */
	$found = 0;
	foreach ("/runtime/prd/visitlist/entry") if ($VaLuE==$clientmac) $found=1;
	TRACE_debug("prd: found =".$found."\n");

	if ($found == 1)
	{
		HTML_gen_401_header();
		TRACE_error("prd: loops redirect to ".$url);
		//flush conntrack cache
		setattr("/runtime/prd/cmd1", "get", "echo -n '--proto TCP --sport 7789' > /proc/nf_conntrack_flush\n");
		get("x", "/runtime/prd/cmd1");
		del("/runtime/prd/cmd1");	
	}	
	else
	{
		//do page redirect
		HTML_gen_302_header($url,"");
		TRACE_debug("prd: redirect from [".$host."] to [".$url."] for ".$clientmac);		
		//skip page redirect next time for this client
		setattr("/runtime/prd/cmd2", "get", "iptables -t nat -I PRD.LAN-1 -m mac --mac-source ".$clientmac." -j RETURN");
		get("x", "/runtime/prd/cmd2");
		del("/runtime/prd/cmd2");	
		//flush conntrack cache
		fwrite("w","/var/run/exec.sh","xmldbc -t \"del_redirect:1:echo -n '--proto TCP --sport 7789' > /proc/nf_conntrack_flush\"\n");
		//lease time
		if($lease_time > 0)
			{ fwrite("a","/var/run/exec.sh","xmldbc -t \"lease_time:".$lease_time.":phpsh ".$lease_time_phpfile." clientmac=".$clientmac."\"\n"); }			
		//remember this client to prevent loops
		$found = 0;
		foreach ("/runtime/prd/visitlist/entry") if ($VaLuE==$clientmac) $found=1;
		if ($found == 0) {add("/runtime/prd/visitlist/entry", $clientmac);}		
		event("EXECUTE");
	}
}
else //request not send by browser
{
	HTML_gen_401_header();
}
?>
