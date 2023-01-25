HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/encrypt.php";

$nodebase = "/vpn/account/entry";
$runtimebase = "/runtime/device/vpn/client/entry";

if(get("x", "/vpn/pptp") == "1")	$pptp = true;
else	$pptp = false;

if(get("x", "/vpn/authtype/chap") == "1")	$chap = true;
else	$chap = false;

if(get("x", "/vpn/authtype/mschap") == "1")	$mschap = true;
else	$mschap = false;

if(get("x", "/vpn/encrtype") == "1")	$encrtype = true;
else	$encrtype = false;

if(get("x", "/vpn/isolation") == "1")	$isolation = true;
else	$isolation = false;

?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<GetPPTPVpnSettingsAlphaResponse xmlns="http://purenetworks.com/HNAP1/">
			<GetPPTPVpnSettingsResult>OK</GetPPTPVpnSettingsResult>
			<pptp><?=$pptp?></pptp>
			<authtype>
				<chap><?=$chap?></chap>
				<mschap><?=$mschap?></mschap>
			</authtype>
			<encrtype><?=$encrtype?></encrtype>
			<isolation><?=$isolation?></isolation>
			<account>
<?
foreach($nodebase)
{
	echo "<entry>";
	echo "<name>".query("name")."</name>";
	echo "<password>".AES_Encrypt128(query("password"))."</password>";
	echo "<hostid>".query("hostid")."</hostid>";
if(query("enable") == "1")
	echo "<enable>true</enable>";
else
	echo "<enable>false</enable>";

	$user_name = query("name");
	$user_state = "Disconnected";
	foreach($runtimebase)
	{
		if($user_name == query("account"))
			$user_state = "Connected";
	}
	echo "<state>".$user_state."</state>";
	echo "</entry>";
}
?>
			</account>
		</GetPPTPVpnSettingsAlphaResponse>
	</soap:Body>
</soap:Envelope>
