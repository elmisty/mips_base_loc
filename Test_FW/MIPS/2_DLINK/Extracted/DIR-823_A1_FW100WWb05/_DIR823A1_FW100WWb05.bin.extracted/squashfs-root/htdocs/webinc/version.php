<html>
	<script type="text/javascript" charset="utf-8" src="/js/configuration/DeviceConfig.js"></script>
	<script>
		function GetLangcode()
		{
			var langcode = "<?echo query("/runtime/device/langcode");?>";
			document.getElementById("langcode").innerHTML = (langcode=="")? "en":langcode;
		}

		function toHex( n )
		{
			var digitArray = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
			var result = ''
			var start = true;

			for (var i=32; i>0;)
			{
				i -= 4;
				var digit = ( n >> i ) & 0xf;

				if (!start || digit != 0)
				{
					start = false;
					result += digitArray[digit];
				}
			}

			return ( result == '' ? '0' : result );
		}
		function pad( str, len, pad )
		{
			var result = str;

			for (var i=str.length; i<len; i++)
			{
				result = pad + result;
			}

			return  result;
		}
		function EncodeHex()
		{
			var str = "<?echo cut(fread("", "/etc/config/builddaytime"), "0", "\n");?>";
			var result = "";

			for (var i=0; i<str.length; i++)
			{
				if (str.substring(i,i+1).match(/[^\x00-\xff]/g) != null)
				{
					result += escape(str.substring(i,i+1), 1).replace(/%/g,'\\');
				}
				else
				{
					result += pad(toHex(str.substring(i,i+1).charCodeAt(0)&0xff),2,'0');
				}
			}
			document.getElementById("checksum").innerHTML = result.substring(result.length-8,result.length);
		}

		function GetQueryUrl()
		{
			var fwsrv = "<?echo query("/runtime/device/fwinfosrv");?>";
			var fwpath= "<?echo query("/runtime/device/fwinfopath");?>";
			var model = "<?echo query("/runtime/device/modelname");?>";
			var fwver = "<?echo query("/runtime/device/firmwareversion");?>";
			var hwstr = "<?echo query("/runtime/devdata/hwrev");?>";
			var hwver = "Ax";
			if (hwstr == "")
			{
				hwstr = "<?echo query("/runtime/devdata/hwver");?>";
			}
			
			
			function removeSymbol(input, symbol)
			{
				var ary = input.split(symbol);
				var res = "";
				for (var i=0;i<ary.length;i++)
				{
					res += ary[i];
				}
				return res;
			}
			var mac = removeSymbol("<?echo query("/runtime/devdata/lanmac");?>", ":");
			
			fwver =removeSymbol(fwver,".");
			if (fwver.length == 3)
				fwver = "0"+fwver;
			
			
			//get fw check parameter add by sam_pan
			var fwcheckparameter = "<?echo query("/device/fwcheckparameter");?>";

			// Get hw revision
			for(i=0; i<hwstr.length; i++)
			{
				char_code = hwstr.charAt(i);
				if ((char_code >= 'a' && char_code <= 'z') ||
						(char_code >= 'A' && char_code <= 'Z'))
				{
					hwver=char_code.toUpperCase()+"x";
					break;
				}
			}
			if(fwcheckparameter == "")
			{
				fwcheckparameter = 	hwver+"_Default";
			}

			document.getElementById("fwq").innerHTML = "http:\/\/"+fwsrv+fwpath+"?model="+model+"_"+fwcheckparameter+"_FW_"+fwver+"_"+mac;
		}

		function Configured()
		{
			document.getElementById("configured").innerHTML = "<?

			$size = query("/runtime/device/devconfsize");
			if		($size == "")	echo i18n("N/A");
			else if ($size > 0)		echo "0(Not default)";	//(The setting is not default)
			else					echo "1(Is default)";	//(The setting is default)

			?>";
		}

		function OnLoad()
		{
			GetLangcode();
			EncodeHex();
			GetQueryUrl();
			Configured();
			document.getElementById("fw_gui_ver").innerHTML = GUIVersion;
		}
	</script>
	<body onload="OnLoad();">
		<div">
			<h1>Version</h1>
			<div class="emptyline"></div>
			<div class="info">
				<span class="name">Firmware External Version :</span>
				<span class="value">V<?echo cut(fread("", "/etc/config/buildver"), "0", "\n");?></span>
			</div>
			<div class="info" style="display:none;">
				<span class="name">Firmware External Revision :</span>
				<span class="value"><?echo cut(fread("", "/etc/config/buildrev"), "0", "\n");?></span>
			</div>
			<div class="info">
				<span class="name">Firmware Internal Version :</span>
				<span class="value" style="text-transform:uppercase;">V<?echo cut(fread("", "/etc/config/buildver"), "0", "\n");?><?echo cut(fread("", "/etc/config/buildrev"), "0", "\n");?></span>
			</div>
			<div class="info" style="display:none;">
				<span class="name">Firmware GUI Version :</span>
				<span class="value" style="text-transform:uppercase;" id="fw_gui_ver"></span>
			</div>
		<?
			if (isfile("/htdocs/webinc/body/version_3G.php")==1)
				dophp("load", "/htdocs/webinc/body/version_3G.php");
		?>
			<div class="info" style="display:none;">
				<span class="name">Language Package :</span>
				<span class="value" id="langcode"></span>
			</div>
			<div class="info">
				<span class="name">Date :</span>
				<span class="value"><?echo cut(query("/runtime/device/firmwarebuilddate"), "1", " ");?>, <?echo cut(query("/runtime/device/firmwarebuilddate"), "2", " ");?>, <?echo cut(query("/runtime/device/firmwarebuilddate"), "3", " ");?></span>
			</div>
			<div class="info">
				<span class="name">CheckSum :</span>
				<span class="value" id="checksum"></span>
			</div>
			<div class="info">
				<span class="name">2.4GHz regulation domain :</span>
				<span class="value">
			  	<? 
			  	$ccode = query("/runtime/devdata/countrycode");
					if($ccode == "GB" || $ccode == "EU") echo 'EU';
			  		else if($ccode == "NA" || $ccode == "US") echo 'NA'; 
			  		else if($ccode == "BR") echo 'AU';
			  		else if($ccode == "CA") echo 'NA';
			  		else if($ccode == "LA") echo 'AU';
			  		else if($ccode == "TW") echo 'NA';
			  		else if($ccode == "CN") echo 'CN';
			  		else if($ccode == "KR") echo 'EU';
			  		else if($ccode == "FR") echo 'EU';
			  		else if($ccode == "RU") echo 'EU';
			  		else if($ccode == "IL") echo 'EU';
			  		else if($ccode == "IN") echo 'AU';
			  		else echo $ccode;
			  		
			  		echo "<br>";
			  		echo "&nbsp;&nbsp;";
			  		echo query("/runtime/freqrule/channellist/g");
			  	?>
				</span>
			</div>
			<div class="info" <? include "/htdocs/webinc/config.php"; if ($FEATURE_DUAL_BAND!="1" && $FEATURE_TRI_BAND!="1") echo 'style="display:none;"';?> >
				<span class="name">5GHz country code :</span>
				<span class="value">
			  	<? 
			  		if($ccode == "GB" || $ccode == "EU") echo 'EU/GB';
			  		else if($ccode == "NA" || $ccode == "US") echo 'NA/US'; 
			  		else echo $ccode;
			  		
			  		if ($FEATURE_TRI_BAND!="1")
			  		{
				  		echo "<br>";
				  		echo "&nbsp;&nbsp;";
				  		echo query("/runtime/freqrule/channellist/a");
			  		}
			  		else
			  		{
				  		echo "<br>";
				  		echo "&nbsp;&nbsp;";
				  		echo i18n("Primary : ");
				  		echo query("/runtime/freqrule/channellist/a0");
				  		echo "<br>";
				  		echo "&nbsp;&nbsp;";
				  		echo i18n("Secondary : ");
				  		echo query("/runtime/freqrule/channellist/a1");
			  		}
			  	?>
				</span>
			</div>
			<div class="info" <? include "/htdocs/webinc/config.php"; if ($FEATURE_DUAL_BAND!="1" && $FEATURE_TRI_BAND!="1") echo 'style="display:none;"';?> >
				<span class="name">5GHz DFS Channel :</span>
				<span class="value">
			  	<? 
			  		include "/htdocs/phplib/wifi.php";
					//$fcc = query("/runtime/device/fcc");
			  		//$ce = query("/runtime/device/ce");
			  		$list_dfs = query("/runtime/freqrule/channellist/dfs");
					$dfs_enable=WIFI_checkDFS($ccode);
					if($dfs_enable == "1") { echo $list_dfs; }
				/*	
			  		if($ccode == "AU" && $fcc == "1")      echo $list_dfs;
			  		else if($ccode == "CA" && $fcc == "1") echo $list_dfs; 
			  		else if($ccode == "CN" && $fcc == "1") echo $list_dfs;
			  		else if($ccode == "SG" && $ce  == "1") echo $list_dfs;
					  else if($ccode == "TW" && $fcc == "1") echo $list_dfs;
					  else if($ccode == "NA" && $fcc == "1") echo $list_dfs;
					  else if($ccode == "US" && $fcc == "1") echo $list_dfs;
					  else if($ccode == "EU" && $ce  == "1") echo $list_dfs;
					  else if($ccode == "GB" && $ce  == "1") echo $list_dfs;
					  else if($ccode == "IL" && $ce  == "1") echo $list_dfs;
					  else if($ccode == "KR" && $ce  == "1") echo $list_dfs;
					  else if($ccode == "JP" && $ce  == "1") echo $list_dfs;
					  else if($ccode == "EG" && $ce  == "1") echo $list_dfs;
					  else if($ccode == "BR" && $fcc == "1") echo $list_dfs;
			  	*/
				?>
				</span>
			</div>
			<div class="info" style="display:none;">
				<span class="name">802.11 country code :</span>
				<span class="value">
			  	<? 
					  if($ccode == "GB" || $ccode == "EU") echo 'UK';
					  else if($ccode == "NA" || $ccode == "US") echo 'US'; 
					  else if($ccode == "LA") echo 'PE';
					  else echo $ccode;
			  	?>
				</span>
			</div>
			<div class="info" style="display:none;">
				<span class="name">Bootcode Version :</span>
				<span class="value"><?echo query("/runtime/device/bootver");?></span>
			</div>
			<div class="info" style="display:none;">
				<span class="name">Kernel :</span>
				<span class="value"><?echo cut(fread("", "/proc/version"), "0", "(");?></span>
			</div>
			<div class="info">
				<span class="name">Firmware Query :</span>
				<span class="value" id="fwq"></span>
			</div>
			<div class="info" style="display:none;">
				<span class="name">Apps :</span>
				<span class="value"><?echo cut(fread("", "/etc/config/builddate"), "0", "\n");?></span>
			</div>
			<div class="info" style="display:none;">
				<span class="name">WLAN Driver :</span>
				<span class="value"><?echo query("/runtime/device/wlandriver");?></span>
			</div>
			<div class="info" <? if(query("/device/layout") != "router" && query("/device/op_mode") == "repeater_ext") echo 'style="display:none;"';?>>
				<span class="name">LAN MAC :</span>
				<span class="value"><?echo query("/runtime/devdata/lanmac");?></span>
			</div>
			<div class="info" <? if(query("/device/layout") != "router") echo 'style="display:none;"';?>>
				<span class="name">WAN MAC :</span>
				<span class="value"><?echo query("/runtime/devdata/wanmac");?></span>
			</div>
			<div class="info">
				<span class="name">2.4GHz WLAN MAC :</span>
				<span class="value"><?echo query("/runtime/devdata/wlanmac");?></span>
			</div>
			<div class="info" <? include "/htdocs/webinc/config.php"; if ($FEATURE_DUAL_BAND!="1" && $FEATURE_TRI_BAND!="1") echo 'style="display:none;"';?> >
				<span class="name">5GHz WLAN MAC :</span>
				<span class="value">
				<? if(query("/runtime/devdata/wlanmac2") != "") echo query("/runtime/devdata/wlanmac2");
				   else if(query("/runtime/devdata/wlan5mac") != "") echo query("/runtime/devdata/wlan5mac"); ?></span>
			</div>
			<div class="info" <? include "/htdocs/webinc/config.php"; if ($FEATURE_TRI_BAND!="1") echo 'style="display:none;"';?> >
				<span class="name">5GHz WLAN MAC2 :</span>
				<span class="value">
				<? if(query("/runtime/devdata/wlanmac3") != "") echo query("/runtime/devdata/wlanmac3");
				   else if(query("/runtime/devdata/wlan5mac2") != "") echo query("/runtime/devdata/wlan5mac2"); ?></span>
			</div>
			<div class="info">
				<span class="name">SSID (2.4G) :</span>				
				<pre style="font-family:Tahoma"><span class="value"><? include "/htdocs/phplib/xnode.php"; $path = XNODE_getpathbytarget("/wifi", "entry", "uid", "WIFI-1", "0"); echo get(h,$path."/ssid");?></span></pre>
			</div>
			<div class="info" <? include "/htdocs/webinc/config.php"; if ($FEATURE_DUAL_BAND!="1" && $FEATURE_TRI_BAND!="1") echo 'style="display:none;"';?> >
				<span class="name"><? include "/htdocs/webinc/config.php"; if ($FEATURE_TRI_BAND!="1") echo 'SSID (5G)'; else echo 'SSID (Primary 5G)';?> :</span>
				<pre style="font-family:Tahoma"><span class="value"><? include "/htdocs/phplib/xnode.php"; $path = XNODE_getpathbytarget("/wifi", "entry", "uid", "WIFI-3", "0"); echo get(h,$path."/ssid");?></span></pre>
			</div>
			<div class="info" <? include "/htdocs/webinc/config.php"; if ($FEATURE_TRI_BAND!="1") echo 'style="display:none;"';?> >
				<span class="name">SSID (Secondary 5G) :</span>
				<pre style="font-family:Tahoma"><span class="value"><? include "/htdocs/phplib/xnode.php"; $path = XNODE_getpathbytarget("/wifi", "entry", "uid", "WIFI-5", "0"); echo get(h,$path."/ssid");?></span></pre>
			</div>
			<div class="info">
				<span class="name">Factory Default :</span>
				<span class="value" id="configured"></span>
			</div>
			<div class="gap"></div>
			<div class="info">
				<span class="name"></span>
				<span class="value">
					<input type="button" value="Continue" onClick='self.location.href="Home.html";' />
				</span>
			</div>
			<div class="emptyline"></div>
		</div>
	</body>
</html>
