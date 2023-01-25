<script>

function PasswordView2(password, password_text, password_view)
{
	if(!password || !password_text || !password_view)
		return;
	if(password_view.checked == true)
	{
		password.disabled = true;
		password.style.display = "none";
		password_text.disabled = false;
		password_text.style.display = "inline";
		password_text.value = password.value;
	}
	else
	{
		password_text.disabled = true;
		password_text.style.display = "none";
		password.disabled = false;
		password.value = password_text.value;
		password.style.display = "inline";
	}
}

function EnableObj2(object)
{
	if(!object)
		return;
	object.disabled = false;
}

function EnableAllObj2(F)
{
        for(var i = 0 ; i < F.elements.length; i++ )
		EnableObj2(F.elements[i]);
}

function DisableObj2(object)
{
	if(!object)
		return;
	object.disabled = true;
}

function DisableAllObj2(F)
{
	for(var i = 0 ; i < F.elements.length; i++ )
	{
		if(F.elements[i].type !== "hidden")
			DisableObj2(F.elements[i]);
	}
};

function Disable_2G_SSID()
{
	DisableObj2(document.getElementsByName("2g_ssid")[0]);
	DisableObj2(document.getElementsByName("guest_2g_ssid")[0]);
}

function EnableAlmostInputs(F)
{
	EnableAllObj2(F);

	var d_control = document.getElementsByClassName('d_control');
	for(var i=0; i<d_control.length; i++)
		d_control[i].classList.remove('gray');

	var d_target =document.getElementsByClassName('d_target');
	var d_control_on = document.getElementsByName('density_config');
	if(d_control_on[0].checked) {
		for(var i=0; i < d_target.length; i++)
			d_target[i].classList.remove('gray');
	}else {
		DisableObj2(document.getElementById('select_signal'));
		DisableObj2(document.getElementById('input_signal'));
	}

	ChangeGuestInputs();
	Disable_2G_SSID();
}

function DisableAlmostInputs(F)
{
	DisableAllObj2(F);

	var modes = document.getElementsByName("mode");
	for(var i = 0; i < modes.length; i++)
		modes[i].disabled = false;

	var d_control = document.getElementsByClassName('d_control');
	for(var i=0; i<d_control.length; i++)
		d_control[i].classList.add('gray');

	var d_target =document.getElementsByClassName('d_target');
	for(var i=0; i < d_target.length; i++)
		d_target[i].classList.add('gray');
	
	document.getElementById("apply_button").disabled = false;
}

function EnableGuestInputs()
{
	EnableObj2(document.getElementById("hide_guest_ssid"));
	EnableObj2(document.getElementById("show_guest_password"));

	EnableObj2(document.getElementsByName("guest_ssid")[0]);

	PasswordView2(document.getElementsByName('guest_password')[0], document.getElementsByName('guest_password_text')[0], document.getElementsByName('show_guest_password')[0]);
}

function DisableGuestInputs()
{
	DisableObj2(document.getElementById("hide_guest_ssid"));
	DisableObj2(document.getElementById("show_guest_password"));

	DisableObj2(document.getElementsByName("guest_ssid")[0]);
	DisableObj2(document.getElementsByName("guest_password")[0]);
	DisableObj2(document.getElementsByName("guest_password_text")[0]);
}

function ChangeGuestInputs()
{
	var policy = document.getElementById('guest_network_policy');
	if(!policy)
		return;
	if(policy.value === 'off')
		DisableGuestInputs();
	else
		EnableGuestInputs();
}

function ToggleMeshInputs()
{
	ChangeGuestInputs();

	var mode = GetRadioValue(document.getElementsByName("mode"));
	if(mode === "none")
		DisableAlmostInputs(easymesh_fm);
}

function SetElementsToAgentMode(F)
{
	for(var i = 0 ; i < F.elements.length; i++ )
	{
		if(F.elements[i].tagName === "INPUT" && F.elements[i].type !== 'checkbox')
		{
			F.elements[i].readOnly = true;
			F.elements[i].disabled = false;
		}
		else
		{
			F.elements[i].disabled = true;
		}
	}
	document.getElementById("apply_button").disabled = false;
}

function maskRebootMsg( second, new_url )
{
        function refresh( second )
        {
                if( second < 0 )
                {
			document.getElementById('reboot_seconds').innerHTML = "";
			if(new_url)
			{
				document.getElementById('lansetup_div_info1').innerHTML = EASYMESH_REBOOT_CHANGEIP_RETRY_LOGIN;
				document.getElementById('lansetup_div_info2').innerHTML = 'URL : <a target=\"_top\" href=\"' + new_url + '\">' + new_url + '</a>';
				UnMaskIt(document, 'apply_mask');
				MaskIt(document, 'info_mask');
			}
			else
			{
				location.reload();
			}

			return;
                }
                document.getElementById('reboot_seconds').innerHTML = MSG_REBOOT_SECONDS_REMAINS1 + second + MSG_REBOOT_SECONDS_REMAINS2;
                setTimeout(function() {
                        refresh( --second );
                }, 1000);
        }

        MaskIt(document, 'reboot_mask');
        refresh( second );
}

function submit_easymesh( F, rebootSeconds )
{
	function is_checked (name)
	{
		var obj = document.getElementsByName(name)[0];
		if(!obj)
			return;
		return obj.checked;
	}

	function getValue (name)
	{
		var obj = document.getElementsByName(name)[0];
		if(!obj)
			return;
		return GetValue(obj);
	}

	function check_ip_format()
	{
		var obj;
		var nwaddr, braddr, ipaddr;

		if(obj = CheckIP('ipaddr'))
		{
			alert(MSG_INVALID_IP);
			obj.focus();
			obj.select();
			return false;
		}

		if(obj = CheckMask('subnet_mask'))
		{
			alert(MSG_INVALID_NETMASK);
			obj.focus();
			obj.select();
			return false;
		}

		nwaddr = GetNetworkAddress('ipaddr', 'subnet_mask');
		braddr  = GetLocalBroadcastAddress('ipaddr', 'subnet_mask');
		ipaddr  = GetIP('ipaddr');

		if(nwaddr == ipaddr )
		{
			alert(MSG_ERROR_NETWORK_LANIP);
			return false;
		}

		if(braddr == ipaddr )
		{
			alert(MSG_ERROR_BROAD_LANIP);
			return false;
		}

		return true;
	}
	function CheckMinimumSSID( name )
	{
		var obj = document.getElementsByName(name)[0];
		if(!obj)
			return;
		var length = StrLenUTF8CharCode(obj.value);
		if(length <= 0)
			return obj;
	}
	function CheckMaximumSSID( name )
	{
		var obj = document.getElementsByName(name)[0];
		if(!obj)
			return;
		var length = StrLenUTF8CharCode(obj.value);
		if(length > 32)
			return obj;
	}
	function CheckMinimumPW( name )
	{
		var obj = document.getElementsByName(name)[0];
		if(!obj)
			return;
		var length = StrLenUTF8CharCode(obj.value);
		if(length > 0 && length < 8)
			return obj;
	}
	function CheckMaximumPW( name )
	{
		var obj = document.getElementsByName(name)[0];
		if(!obj)
			return;
		var length = StrLenUTF8CharCode(obj.value);
		if(length > 63)
			return obj;
	}
	function check_bss_conf(prefix)
	{
		if(!prefix)
			prefix = "";

		if((obj = CheckMinimumSSID(prefix + 'ssid')))
		{
			alert(MSG_TOO_SHORT_SSID);
			obj.focus();
			obj.select();

			return false;
		}
		if((obj = CheckMaximumSSID(prefix + 'ssid')))
		{
			alert(MSG_TOO_LONG_SSID);
			obj.focus();
			obj.select();

			return false;
		}
		var password_name = prefix + 'password';
		if(is_checked('show_' + prefix + 'password'))
			password_name += '_text';

		if((obj = CheckMinimumPW(password_name)))
		{
			alert(MSG_TOO_SHORT_PW);
			obj.focus();
			obj.select();

			return false;
		}
		if((obj = CheckMaximumPW(password_name)))
		{
			alert(MSG_TOO_LONG_PW);
			obj.focus();
			obj.select();

			return false;
		}

		return true;
	}
	function check_all_bss_conf()
	{
		if(!check_bss_conf(""))
			return false;

		var guest_policy = getValue('guest_network_policy');
		if(guest_policy !== 'off')
		{
			if(!check_bss_conf("guest_"))
				return false;
		}

		return true;
	}
	function mode_is_changed()
	{
		var radios = document.getElementsByName("mode");
		for(var i = 0; i < radios.length; i++)
		{
			if(radios[i].defaultChecked != radios[i].checked)
				return true;
		}
		return false;
	}
	function ip_address_is_changed( name )
	{
		for(var i = 1; i <= 4; i++)
		{
			var ip = document.getElementsByName(name + i)[0];
			if(ip.defaultValue != ip.value)
				return true;
		}
		return false;
	}
	function check_rssi_range()
	{
		var select_signal = document.getElementById("select_signal");
		var input_signal = document.getElementById("input_signal");

		if(input_signal.value == "")
		{
			alert(MSG_ENTER_SIGNAL_STRENGTH);
			return false;
		}

		if(input_signal.value < -100 || input_signal.value > -40)
		{
			alert(MSG_INVALID_SIGNAL_RANGE);
			return false;
		}
	}
	function check_other_confirm_specs()
	{
		if(document.getElementsByName('bridge_has_device')[0].value == '1'){
			return MSG_BRIDGE_HAS_DEVICE;
		}

		return false;
	}

	if(GetRadioValue(document.getElementsByName("mode")) !== 'none') {
		if(check_ip_format() === false)
			return;
		if(check_all_bss_conf() === false)
			return;
	}

	if(document.getElementById('input_signal') && check_rssi_range() == false)
		return;

	var needReboot = mode_is_changed() || ip_address_is_changed("subnet_mask");
	var new_addr = ip_address_is_changed("ipaddr");
	var other_specs = check_other_confirm_specs();

	if(other_specs){
		if(!confirm(other_specs))
			return;
	}

        if( needReboot || new_addr)
        {
		if(document.getElementById("mode_none").checked === true)
		{
			if(!confirm(MSG_DISABLE_EASYMESH))
				return;
		}
		else if(!confirm(MSG_RESTART_CONFIRM_REBOOT))
                        return;
		if(new_addr)
			maskRebootMsg( rebootSeconds, location.protocol + '//' + GetIP("ipaddr") + (location.port?":" + location.port:"") );
		else
			maskRebootMsg( rebootSeconds );
        }
        else
                MaskIt(document, 'apply_mask');

        F.submit();
}


function DisplayApplyButton(flag)
{
	if(flag)
		document.getElementById("apply_button").style.visibility = "visible"
	else
		document.getElementById("apply_button").style.visibility = "hidden"
}

function EnableApplyButton(flag)
{
	if(flag)
		document.getElementById("apply_button").disabled = false;
	else
		document.getElementById("apply_button").disabled = true;
}

function RestoreConfig(F)
{
	if(!F.mesh_cfg.value) {
		alert(MSG_RESTORE_NOT_SELECTED);
		return false;
	}
	if(!confirm(MSG_RESTORE_EASYMESH_CONFIG))
		return false;

	MaskIt(document, 'apply_mask');

	return true;
}

function ChangeRebootMsg(doc, id, msg)
{
	doc.getElementById(id).innerHTML = msg;
}

function MirrorSSID(from, to, condition)
{
	setTimeout(function () {
		if(!condition || condition.value === 'off' || from.value.length === 0)
			to.value = '';
		else {
			var suffix = (condition.value === 'separated') ? '_2G' : '';
			to.value = from.value + suffix;
		}
	}, 0);
}

function AddMirrorEvent(from, to, condition)
{
	if(!from || !to || !condition)
		return;
	if(from.nodeName === 'INPUT') {
		if(from.addEventListener) {
			from.addEventListener("keydown", function () {
				MirrorSSID(from, to, condition);
			});
		} else if(from.attachEvent) {
			from.attachEvent("onkeydown", function () {
				MirrorSSID(from, to, condition);
			});
		}
	}
	if(condition.nodeName === 'SELECT') {
		if(condition.addEventListener) {
			condition.addEventListener("change", function () {
				MirrorSSID(from, to, condition);
			});
		} else if(condition.attachEvent) {
			condition.addEventListener("onchange", function () {
				MirrorSSID(from, to, condition);
			});
		}
	}
}

function ReadOnly(obj, readOnly)
{
	if(readOnly)
		obj.readOnly = true;
	else
		obj.readOnly = false;
}

function ChangeRssiUI(flag)
{
	var option = document.getElementById("select_signal").selectedOptions[0];
	var input_signal = document.getElementById("input_signal");
	var rssi = option.getAttribute('rssi');
	var value = option.value;

	if(flag)
		input_signal.value = rssi ? rssi : "";
	else if(!flag && value != "manual")
		input_signal.value = rssi;

	if(value == "manual") {
		ReadOnly(input_signal, false);
		if(flag)	input_signal.focus();
	}else
		ReadOnly(input_signal, true);
}

function DisableDensityConfig()
{
	var d_target =document.getElementsByClassName('d_target');
	for(var i=0; i < d_target.length; i++)
		d_target[i].classList.add('gray');

	DisableObj2(document.getElementById("select_signal"));
	DisableObj2(document.getElementById("input_signal"));
}

function EnableDensityConfig()
{
	var d_target =document.getElementsByClassName('d_target');
	var option = document.getElementById("select_signal").selectedOptions[0];
	var input_signal = document.getElementById("input_signal");
	for(var i=0; i < d_target.length ;i++ )
		d_target[i].classList.remove('gray');

	ReadOnly(input_signal, option.value == "manual" ? false : true);

	EnableObj2(document.getElementById("select_signal"));
	EnableObj2(document.getElementById("input_signal"));
}
</script>
