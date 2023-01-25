<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

include "/htdocs/phplib/xnode.php"; 
include "/htdocs/phplib/encrypt.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php"; 
$radioID = get("","/runtime/hnap/GetWLanRadioSecurity/RadioID");

$WLAN1_UID = $WLAN1;
$WLAN2_UID = $WLAN2;
$WLAN3_UID = $WLAN3;

if($FEATURE_HAVEREPEATER==1 || $FEATURE_HAVEEXTENDER==1)
{
	if(query("/device/layout")=="bridge")
	{
		$wirelessmode=query("/device/wirelessmode");
		if ($wirelessmode=="WirelessRepeaterExtender" || $wirelessmode=="WirelessRepeater")
		{
			$WLAN1_UID = $WLAN_EXT24G;
			$WLAN2_UID = $WLAN_EXT5G;
			
			if($FEATURE_TRI_BAND==1) $WLAN3_UID = $WLAN_EXT5G2;
		}
	}
}

if( $radioID == "2.4GHZ" || $radioID == "RADIO_24GHz" || $radioID == "RADIO_2.4GHz")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1_UID, 0);	}
if( $radioID == "5GHZ" || $radioID == "RADIO_5GHz")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2_UID, 0);	}
if( $radioID == "RADIO_5GHz_2")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN3_UID, 0);	}
if( $radioID == "RADIO_2.4G_Guest" || $radioID == "RADIO_2.4GHz_Guest")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1_GZ, 0);	} 
if( $radioID == "RADIO_5G_Guest" || $radioID == "RADIO_5GHz_Guest")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2_GZ, 0);	} 
if( $radioID == "RADIO_5GHz_2_Guest")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN3_GZ, 0);	} 

$path_wlan_wifi = XNODE_getpathbytarget("/wifi", "entry", "uid", query($path_phyinf_wlan."/wifi"), 0);
TRACE_debug("\nGetWLanRadioSecurity PrivateKey=".$PrivateKey."\n");
$result = "OK";

if( $radioID != "2.4GHZ" && $radioID != "5GHZ" && $radioID != "RADIO_24GHz" && 
		$radioID != "RADIO_5GHz" && $radioID != "RADIO_2.4GHz" && $radioID != "RADIO_2.4G_Guest" && $radioID != "RADIO_2.4GHz_Guest" &&
		 $radioID != "RADIO_5G_Guest" && $radioID != "RADIO_5GHz_Guest" && $radioID != "RADIO_5GHz_2" && $radioID != "RADIO_5GHz_2_Guest")
{
	$result = "ERROR_BAD_RADIOID";
	$enabled = "";
	$keyRenewal = "";
	$type = "";
	$encrypt = "";
	$key = "";
	$radiusIP1 = "";
	$radiusPort1 = "";
	$radiusSecret1 = "";
	$radiusIP2 = "";
	$radiusPort2 = "";
	$radiusSecret2 = "";
}
else
{
	$enable = get("",$path_wlan_wifi."/encrtype");
	$authType	= get("",$path_wlan_wifi."/authtype");
	if( $enable != "NONE" )
	{
		$enabled = "true";
		if( $enable == "WEP" )
		{
			if( $authType != "OPEN" && $authType != "SHARED" && $authType != "WEPAUTO")
			{
				$result = "ERROR";
			}
			else
			{
				$defKey = get("",$path_wlan_wifi."/nwkey/wep/defkey");
				$key = get("",$path_wlan_wifi."/nwkey/wep/key:".$defKey);
				if( $authType == "OPEN" )
				{
					$type = "WEP-OPEN";
					$keyLen = get("",$path_wlan_wifi."/nwkey/wep/size");
					$encrypt = "WEP-".$keyLen;
				}
				else if( $authType == "SHARED" )
				{
					$type = "WEP-SHARED";
					$keyLen = get("",$path_wlan_wifi."/nwkey/wep/size");
					$encrypt = "WEP-".$keyLen;
				}
				else if( $authType == "WEPAUTO" )
				{
					$type = "WEP-AUTO";
					$keyLen = get("x",$path_wlan_wifi."/nwkey/wep/size");
					$encrypt = "WEP-".$keyLen;
				}				
				else
				{
					$result = "ERROR";
				}
			}
		}
		else if( $authType == "WPA" || $authType == "WPA2" || $authType == "WPA+2")
		{
			if( $authType == "WPA" ) { $type = "WPA-RADIUS"; }
			if( $authType == "WPA2" ) { $type = "WPA2-RADIUS"; }
			if( $authType == "WPA+2" ) { $type = "WPAORWPA2-RADIUS"; } /* ALPHA add, not follow HNAP Spec 1.1 */
			if( $enable == "TKIP" ) {	$encrypt = "TKIP"; } 
			else if( $enable == "AES" ) { $encrypt = "AES"; }
			else if( $enable == "TKIP+AES" ) { $encrypt = "TKIPORAES"; }
			else { $result = "ERROR"; }
			$keyRenewal = get("",$path_wlan_wifi."/nwkey/wpa/groupintv");
			$radiusIP1 = get("",$path_wlan_wifi."/nwkey/eap/radius");
			$radiusPort1 = get("",$path_wlan_wifi."/nwkey/eap/port");
			$radiusSecret1 = get("",$path_wlan_wifi."/nwkey/eap/secret");
			$radiusIP2 = get("",$path_wlan_wifi."/nwkey/eap/radius2");
			$radiusPort2 = get("",$path_wlan_wifi."/nwkey/eap/port2");
			$radiusSecret2 = get("",$path_wlan_wifi."/nwkey/eap/secret2");
		}
		else if( $authType == "WPAPSK" || $authType == "WPA2PSK" || $authType == "WPA+2PSK")
		{
			if( $authType == "WPAPSK" ) { $type = "WPA-PSK"; }
			if( $authType == "WPA2PSK" ) { $type = "WPA2-PSK"; }
			if( $authType == "WPA+2PSK" ) { $type = "WPAORWPA2-PSK"; } /* ALPHA add, not follow HNAP Spec 1.1 */
			if( $enable == "TKIP" ) {	$encrypt = "TKIP"; } 
			else if( $enable == "AES" ) { $encrypt = "AES"; }
			else if( $enable == "TKIP+AES" ) { $encrypt = "TKIPORAES"; }
			else { $result = "ERROR"; }
			$keyRenewal = get("",$path_wlan_wifi."/nwkey/wpa/groupintv");
			$key = get("",$path_wlan_wifi."/nwkey/psk/key");
		}
	}
	else
	{
		$enabled = "false";
		$keyRenewal = "0";
		$radiusPort1 = "0";
		$radiusPort2 = "0";
		//When encrtype is none, key value should be empty
		$key = "";
	}
	//fix for TestDevice
	if($keyRenewal == "") { $keyRenewal = "1800"; }
	if($radiusPort1 == "") { $radiusPort1 = "0"; }
	if($radiusPort2 == "") { $radiusPort2 = "0"; }
}

?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
	<GetWLanRadioSecurityResponse xmlns="http://purenetworks.com/HNAP1/">
		<GetWLanRadioSecurityResult><?=$result?></GetWLanRadioSecurityResult>
		<Enabled><?=$enabled?></Enabled>
		<Type><?=$type?></Type>
		<Encryption><?=$encrypt?></Encryption>
		<KeyRenewal><?=$keyRenewal?></KeyRenewal>
		<Key><? echo AES_Encrypt128($key); ?></Key>
		<RadiusIP1><?=$radiusIP1?></RadiusIP1>
		<RadiusPort1><?=$radiusPort1?></RadiusPort1>
		<RadiusSecret1><? echo AES_Encrypt128($radiusSecret1); ?></RadiusSecret1>
		<RadiusIP2><?=$radiusIP2?></RadiusIP2>
		<RadiusPort2><?=$radiusPort2?></RadiusPort2>
		<RadiusSecret2><? echo AES_Encrypt128($radiusSecret2); ?></RadiusSecret2>
	</GetWLanRadioSecurityResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
