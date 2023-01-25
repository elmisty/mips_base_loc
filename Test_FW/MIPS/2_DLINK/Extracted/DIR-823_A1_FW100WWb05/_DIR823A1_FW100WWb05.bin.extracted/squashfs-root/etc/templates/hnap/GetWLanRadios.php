<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/wifi.php";

function show_SecurityInfo($wifiverify)
{
	echo "<SupportedSecurity>\n";
		if ($wifiverify==1)
		{
			echo "<SecurityInfo>\n";
			echo "	<SecurityType>WPA2-AES</SecurityType>\n";
			echo "	<Encryptions>\n";
			echo "		<string>TKIP</string>\n";
			echo "		<string>AES</string>\n";
			echo "		<string>TKIPORAES</string>\n";
			echo "	</Encryptions>\n";
			echo "</SecurityInfo>\n";
			echo "<SecurityInfo>\n";
			echo "	<SecurityType>WPA+WPA2-TKIP+AES</SecurityType>\n";
			echo "	<Encryptions>\n";
			echo "		<string>TKIP</string>\n";
			echo "		<string>AES</string>\n";
			echo "		<string>TKIPORAES</string>\n";
			echo "	</Encryptions>\n";
			echo "</SecurityInfo>\n";
		}
		else
		{
//			echo "<SecurityInfo>\n";
//			echo "	<SecurityType>WEP</SecurityType>\n";
//			echo "	<Encryptions>\n";
//			echo "		<string>WEP-64</string>\n";
//			echo "		<string>WEP-128</string>\n";
//			echo "	</Encryptions>\n";
//			echo "</SecurityInfo>\n";
			echo "<SecurityInfo>\n";
			echo "	<SecurityType>WPA-Personal</SecurityType>\n";
			echo "	<Encryptions>\n";
			echo "		<string>TKIP</string>\n";
			echo "		<string>AES</string>\n";
			echo "		<string>TKIPORAES</string>\n";
			echo "	</Encryptions>\n";
			echo "</SecurityInfo>\n";
		}
	echo "</SupportedSecurity>\n";
}
$wifiverify = get("","/runtime/devdata/wifiverify");
//if ($wifiverify==1) {$FEATURE_NOACMODE=1;}

$path_phyinf_wlan1 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1, 0);
$path_phyinf_wlan2 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2, 0);
$path_phyinf_wlan3 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN3, 0);
$CountryCode = get("", "/runtime/devdata/countrycode");
/* For D-Link Morrison requirement.
   If smart connect is enabled, QRS mobile would just display single band for the router settings.
   If smart connect is disabled, QRS mobile would displays double band for the router settings.
*/
$smartconnect = get("", "/device/features/smartconnect");
?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
    <GetWLanRadiosResponse xmlns="http://purenetworks.com/HNAP1/">
		<GetWLanRadiosResult>OK</GetWLanRadiosResult>
		<RadioInfos>
		<?if($path_phyinf_wlan1==""){echo "<!--";}?>
			<RadioInfo>
			<RadioID>2.4GHZ</RadioID>
			<Frequency>2</Frequency>
			<SupportedModes>
			<?if ($wifiverify==1)
				{
					echo "<string>802.11b</string>\n";
					echo "<string>802.11g</string>\n";
					echo "<string>802.11n</string>\n";
					echo "<string>802.11bg</string>\n";
					echo "<string>802.11gn</string>\n";
					echo "<string>802.11bgn</string>\n";
				}
				else
				{
					echo "<string>802.11n</string>\n";
					echo "<string>802.11gn</string>\n";
					echo "<string>802.11bgn</string>\n";
				}
			?>
			</SupportedModes>
			<Channels><?
			echo "\n";
			$clist = WIFI_getchannellist("g");
			$count = cut_count($clist, ",");
			$i = 0;
			while($i < $count)
			{
				$channel = cut($clist, $i, ',');
				echo "\t\t\t\t<int>".$channel."</int>";
				$i++;
				if($i < $count) echo "\n";
			}?>
			</Channels>
			<WideChannels>
			<?
			$bandwidth = query($path_phyinf_wlan1."/media/dot11n/bandwidth");
			if ($bandWidth != "20")
			{
				$startChannel = 3;
				while( $startChannel <= 9 )
				{
					echo "<WideChannel>\n";
					echo "	<Channel>".$startChannel."</Channel>\n";
					echo "	<SecondaryChannels>\n";
					$secondaryChnl = $startChannel - 2;
					echo "		<int>".$secondaryChnl."</int>\n";
					$secondaryChnl = $startChannel + 2;
					echo "		<int>".$secondaryChnl."</int>\n";
					echo "	</SecondaryChannels>\n";
					echo "</WideChannel>\n";
					$startChannel++;
				}
			}
			?>
			</WideChannels>
<? show_SecurityInfo($wifiverify); ?>
			</RadioInfo>
			<?
		if($path_phyinf_wlan2!="")
		{
			echo "<RadioInfo>\n";
			echo "<RadioID>5GHZ</RadioID>\n";
			echo "<Frequency>5</Frequency>\n";
			echo "<SupportedModes>\n";
				echo "<string>802.11a</string>\n";
				echo "<string>802.11n</string>\n";
				echo "<string>802.11an</string>\n";
				if($FEATURE_NOACMODE!=1)
				{
					echo "\n";
					echo "\t\t\t\t<string>802.11ac</string>\n";
					echo "\t\t\t\t<string>802.11nac</string>\n";
					echo "\t\t\t\t<string>802.11anac</string>";
				}
			echo "</SupportedModes>\n";
			echo "<Channels>\n";
			echo "\n";
			if($FEATURE_TRI_BAND!=1) $clist = WIFI_getchannellist("a");
			else $clist = WIFI_getchannellist("a0");
			if($CountryCode=="EU")	$clist="36,40,44,48";
			$count = cut_count($clist, ",");
			$i = 0;
			while($i < $count)
			{
				$channel = cut($clist, $i, ',');
				echo "\t\t\t\t<int>".$channel."</int>";
				$i++;
				if($i < $count) echo "\n";
			}
			echo "</Channels>\n";
			echo "<WideChannels>\n";
			$bandwidth = query($path_phyinf_wlan2."/media/dot11n/bandwidth");
			if ($bandWidth != "20")
			{
				$startChannel = 44;
				while( $startChannel <= 56 )
				{
					echo "<WideChannel>\n";
					echo "	<Channel>".$startChannel."</Channel>\n";
					echo "	<SecondaryChannels>\n";
					$secondaryChnl = $startChannel - 8;
					echo "		<int>".$secondaryChnl."</int>\n";
					$secondaryChnl = $startChannel + 8;
					echo "		<int>".$secondaryChnl."</int>\n";
					echo "	</SecondaryChannels>\n";
					echo "</WideChannel>\n";
					$startChannel=$startChannel+4;
				}
				echo "<WideChannel>\n";
		    	echo "	<Channel>157</Channel>\n";
				echo "	<SecondaryChannels>\n";
				echo "		<int>149</int>\n";
				echo "		<int>165</int>\n";
				echo "	</SecondaryChannels>\n";
				echo "</WideChannel>\n";
			}
			echo "</WideChannels>\n";
			show_SecurityInfo($wifiverify);
			echo "</RadioInfo>\n";
		}
		if($path_phyinf_wlan3!="")
		{
			echo "<RadioInfo>\n";
			echo "<RadioID>RADIO_5GHz_2</RadioID>\n";
			echo "<Frequency>5</Frequency>\n";
			echo "<SupportedModes>\n";
				echo "\t\t\t\t<string>802.11a</string>\n";
				echo "\t\t\t\t<string>802.11n</string>\n";
				echo "\t\t\t\t<string>802.11an</string>\n";
				if($FEATURE_NOACMODE!=1)
				{
					echo "\n";
					echo "\t\t\t\t<string>802.11ac</string>\n";
					echo "\t\t\t\t<string>802.11nac</string>\n";
					echo "\t\t\t\t<string>802.11anac</string>";
				}
			echo "</SupportedModes>\n";
			echo "<Channels>\n";
			echo "\n";
			$clist = WIFI_getchannellist("a1");
			$count = cut_count($clist, ",");
			$i = 0;
			while($i < $count)
			{
				$channel = cut($clist, $i, ',');
				echo "\t\t\t\t<int>".$channel."</int>";
				$i++;
				if($i < $count) echo "\n";
			}
			echo "</Channels>\n";
			echo "<WideChannels>\n";
			$bandwidth = query($path_phyinf_wlan2."/media/dot11n/bandwidth");
			if ($bandWidth != "20")
			{
				$startChannel = 44;
				while( $startChannel <= 56 )
				{
					echo "<WideChannel>\n";
					echo "	<Channel>".$startChannel."</Channel>\n";
					echo "	<SecondaryChannels>\n";
					$secondaryChnl = $startChannel - 8;
					echo "		<int>".$secondaryChnl."</int>\n";
					$secondaryChnl = $startChannel + 8;
					echo "		<int>".$secondaryChnl."</int>\n";
					echo "	</SecondaryChannels>\n";
					echo "</WideChannel>\n";
					$startChannel=$startChannel+4;
				}
				echo "<WideChannel>\n";
		    	echo "	<Channel>157</Channel>\n";
				echo "	<SecondaryChannels>\n";
				echo "		<int>149</int>\n";
				echo "		<int>165</int>\n";
				echo "	</SecondaryChannels>\n";
				echo "</WideChannel>\n";
			}
			echo "</WideChannels>\n";
			show_SecurityInfo($wifiverify);
			echo "</RadioInfo>\n";
		}	?>
		</RadioInfos>
    </GetWLanRadiosResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
