//local-global variable
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
var ctr_init_func = [];
var data_local=[];
var confirm_name = '';
var alerted = 0;
var org_ig = '';
var org_id = '';
var once=true;

$(document).ready(function() {
	window.tmenu = "wirelessconf";
	window.smenu = "easymesh";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, 60000, true);

	events.on('load_header_ended_local', function(menuname){
		iux_update("S");
	});

});

function loadLocalPage()
{
	add_listener_local();
	
	loadData();
	viewPass();
	ctr_enable("S_BUTTON_SUBMIT", false);

	$('[sid="S_MAIN_2GSSID"]').val(config_data.main_2g.ssid);
	$('[sid="S_GUEST_2GSSID"]').val(config_data.guest_2g.ssid);
	
	change_apply("C_MODE");
	change_apply("C_MAIN_HIDDEN");
	change_apply("C_MAIN_USERID");
	change_apply("C_MAIN_USERPW");
	change_apply("S_2GHZ_POLICY");
	change_apply("C_GUEST_HIDDEN");
	change_apply("C_GUEST_USERID");
	change_apply("C_GUEST_USERPW");
	change_apply("S_GUEST_POLICY");
	change_apply("C_IP_INTERNAL");
	change_apply("C_SM_MASK");
	change_apply("N_STEERING_LEVEL");

	change_apply("S_DENSITY_MODE");
	change_apply("S_RSSI_LEVEL");
	change_apply("S_RSSI_STRENGTH");
}

function change_apply(sid) {
	var sid_=$('[sid="'+sid+'"]');
	var type = sid_.attr("type");
	switch ( type ){
		case undefined: 
		case "text":
		case "password":
			sid_.keyup(changeEventCallback);
			break;
		case "select":
		case "radio" :
		case "checkbox":
			sid_.change(changeEventCallback);
			break;
	}
}

function changeEventCallback() {
	if(isChanged())
		ctr_enable("S_BUTTON_SUBMIT", true);
	else
		ctr_enable("S_BUTTON_SUBMIT", false);

	function isChanged(){
		config_data.steering_level = String( config_data.steering_level );

		var list = [
			[ $('[sid="C_MODE"]:checked').val(), config_data.mode ],
		];
		if(config_data.mode == 'controller') {
			list.push(
				[ $('[sid="C_MAIN_USERID"]').val(),	config_data.main_5g.ssid	],
				[ $('[sid="C_MAIN_USERPW"]').val(),	config_data.main_5g.pass	],
				[ $('[sid="C_MAIN_HIDDEN"]').prop('checked'),
									config_data.main_5g.hidden	],
				[ $('[sid="S_2GHZ_POLICY"]').val(),	getCurrent2GHzPolicy()		],

				[ $('[sid="C_GUEST_USERID"]').val(),	config_data.guest_5g.ssid	],
				[ $('[sid="C_GUEST_USERPW"]').val(),	config_data.guest_5g.pass	],
				[ $('[sid="C_GUEST_HIDDEN"]').prop('checked'),
									config_data.guest_5g.hidden	],
				[ $('[sid="S_GUEST_POLICY"]').val(),	getCurrentGuestPolicy()		],
				[ $('[sid="N_STEERING_LEVEL"]').val(),	config_data.steering_level	],

				[ convert_textfield_to_string('C_IP_INTERNAL'),	config_data.ip		],
				[ convert_textfield_to_string('C_SM_MASK'),	config_data.sm		],

				/* need density mode */
				[ Number($('[sid="S_DENSITY_MODE"]:checked').val()),	config_data.density_config.flag	],
				[ $('[sid="S_RSSI_LEVEL"]').val(),			config_data.density_config.rssi_level ],
				[ $('[sid="S_RSSI_STRENGTH"]').val(),			config_data.density_config.rssi_strength ]
			);
		}

		for(var i = 0; i < list.length; i++) {
			var current = list[i][0];
			var configured = list[i][1];

			if(current != configured)
				return true;
		}

		return false;
	}

}

function loadData(){
	loadIp('C_IP_INTERNAL', config_data.ip);
	loadIp('C_SM_MASK', config_data.sm);	
	loadIp('C_GATEWAY', config_data.gw);	

	loadNetwork(config_data.main_5g.ssid);
	loadNetwork(config_data.main_5g.pass);
	loadNetwork(config_data.guest_5g.ssid);
	loadNetwork(config_data.guest_5g.pass);
	loadDensity(config_data.density_config);
	loadMode(config_data.mode);

	hidden(config_data.main_5g.hidden);
	hidden(config_data.guest_5g.hidden);
	hidden(config_data.guest_5g.enable);
}

function loadNetwork(data){
	switch( data ) {
	case config_data.main_5g.ssid:$('[sid="C_MAIN_USERID"]').val(data);break;
	case config_data.main_5g.pass:$('[sid="C_MAIN_USERPW"]').val(data);break;
	case config_data.guest_5g.ssid:$('[sid="C_GUEST_USERID"]').val(data); break;
	}
	
	if(data==config_data.guest_5g.pass){
		$('[sid="C_GUEST_USERPW"]').val(data);
	}

}

//IP, SUBNETMASK 
function loadIp(sid, data){
	var ip = data.split('.');
	var inputs = $('[sid=' + sid + '] input');

	var length = Math.min(ip.length, inputs.length);
	for(var i = 0; i < length; i++) {
		inputs.eq(i).val(ip[i]);
	}
}

function unusedRowsInAgentsMode () {
	var unusedList = [
		'#guest_ap_ad_container',
		'#main_ap_ad_container',
		'#mode_controller_container',
		'[sid="ROW_MESH_TOOL"]',
		'[sid="ROW_CONFIG"]',
		'div[sid=ROW_2G_OPTION]',
		'div[sid=ROW_GUESTPW]',
		'div[sid=ROW_HUBAPUSING]',
		'div[sid=ROW_PW]',
		'div[sid=ROW_STEERINGLEVEL]',
		'div[sid=ROW_DENSITY_CONFIG]',
		'div[sid=ROW_RSSI]'
	];
	for(var i = 0; i < unusedList.length; i++)
		$(unusedList[i]).remove();
}

function unusedRowsInControllerMode () {
	var unusedList = [
		'[sid="C_GATEWAY"]',
		'#mode_agent_container',
	];
	for(var i = 0; i < unusedList.length; i++)
		$(unusedList[i]).remove();
}

function unusedRowsWhenNotUsed () {
	var unusedList = [
		'[sid="C_GATEWAY"]',
		'#mode_agent_container',
		'[sid="ROW_MESH_TOOL"]',
	];
	for(var i = 0; i < unusedList.length; i++)
		$(unusedList[i]).remove();

	$('[sid="EASYMESH_BACKUP"]').attr('disabled',true);
}

function unusedRowsInAgentOnly () {
	var unusedList = [
		'#mode_controller_container',
		'[sid="ROW_CONFIG"]',
		'.lc_submit',
	];
	for(var i = 0; i < unusedList.length; i++)
		$(unusedList[i]).remove();
}

function loadMode(data){
        if(data=="controller"){
		checkedValue(data, 'mode_controller');
		change_etc(true);
		unusedRowsInControllerMode();
        }else if(data=="agent"){
		checkedValue(data, 'mode_agent');
		unusedRowsInAgentsMode();
		change_etc(false);
        }else if(data=="none"){
		checkedValue(data, 'mode_none');
		change_etc(false);
		unusedRowsWhenNotUsed();

		if(config_data.support.indexOf('controller') === -1)
			unusedRowsInAgentOnly();
	}
}

function loadDensity(data) {
	var flag = data.flag;
	checkedValue(String(flag), flag ? "density_on" : "density_off");
	$("[sid=S_RSSI_STRENGTH]").val(data.rssi_strength);

	if(data.rssi_level != "manual")
		ctr_enable('S_RSSI_STRENGTH', false);

	/*	
	if(!flag) {	// 비활성화
		$("[sid=S_RSSI_LEVEL]").val("normal").selectmenu('refresh',true).trigger('change');
		$("[sid=S_RSSI_STRENGTH]").val(data.strength_obj.normal);
	}
	*/

	density_field_enable(data.rssi_level == "manual", flag);
}

function viewPass(){
        $("#input_passwd_check").change(function(){
                if($("#input_passwd_check").is(":checked"))
                        $('[sid="C_MAIN_USERPW"]').attr("type", "text");
                else
                        $('[sid="C_MAIN_USERPW"]').attr("type", "password");
        });

        $("#dns_dynamic_check").change(function(){
                if($("#dns_dynamic_check").is(":checked"))
                        $('[sid="C_GUEST_USERPW"]').attr("type", "text");
                else
                        $('[sid="C_GUEST_USERPW"]').attr("type", "password");
        });
}

function hidden(data){
	if(data==true){
		checkedValue(config_data.main_5g.hidden, 'input_allowprivate_check');
		checkedValue(config_data.guest_5g.hidden, 'mac_manual_check');
		checkedValue(config_data.guest_5g.enable, 'check_hubapusing');
		
		if(config_data.mode=="controller"){
			if(data==config_data.guest_5g.enable)
				change_guest(true);
		}
		
	}else{
	                if(data==config_data.guest_5g.enable)
				change_guest(false);				
	}
}

function fill(data, id){
	if(data==true)
		$('[sid="'+id+'"]').val("1");
	else
		$('[sid="'+id+'"]').val("0");
}

function checkedValue(data, id){
	
	switch ( typeof(data) ){
	case 'boolean':if(data==true){$("input:checkbox[id='"+id+"']").prop("checked", true).checkboxradio('refresh');};break;
	case 'string': $("input:radio[id='"+id+"']").prop("checked", true).checkboxradio('refresh');break;
	}
}

function appendSelectOptions($target, listOptions, selectedValue)
{
	for(var idx in listOptions) {
		var option = listOptions[idx];
		$target.append('<option value="'+ option.value + '">' + option.text + '</option>');
	}
	$target.val(selectedValue).selectmenu('refresh',true).trigger('change');	
}

function MirrorSSID($from, $to, $condition)
{
	setTimeout(function () {
		if(!$condition || $condition.val() === 'off' || $from.val() === '')
			$to.val('');
		else {
			var suffix = ($condition.val() === 'separated') ? '_2G' : '';
			$to.val($from.val() + suffix);
		}
	}, 0);
}

function AddMirrorEvent($from, $to, $condition)
{
	if($from[0].nodeName === 'INPUT') {
		$from.keydown(function () {
			MirrorSSID($from, $to, $condition);
		});
	}
	if($condition.length > 0 && $condition[0].nodeName === 'SELECT') {
		$condition.change(function () {
			MirrorSSID($from, $to, $condition);
		});
	}
}

function getCurrent2GHzPolicy()
{
	if(!config_data.main_2g || !config_data.main_2g.ssid)
		return 'off';
	if(config_data.main_5g.ssid !== config_data.main_2g.ssid)
		return 'separated';
	return 'unified';
}

function getCurrentGuestPolicy()
{
	if(!config_data.guest_5g || !config_data.guest_5g.ssid)
		return 'off';
	if(config_data.guest_5g.restricted === true)
		return 'restricted';
	return 'on';
}

/*---------------------------------------*/
function iux_update_local(id)
{
	if( !config_data )
		return;
	if(!id)
		iux_update_local_func['init'].call();
	else
	{
		var currentinfo = $('[sid="C_WANINFO_INFO"]:checked').val();
		//if (!currentinfo) currentinfo = config_data.mode;
		//iux_update_local_func[currentinfo].call(this, id);
	}
	if(id =="D")
		change_submit_button();

        $("[sid=\"ROW_MESH_TOOL\"] a").css("background-color","#F8F8F5");

	//Steering level option add 
	appendSelectOptions($('[sid="N_STEERING_LEVEL"]'), M_lang['S_SLEVEL_OPTION'], config_data.steering_level);
	appendSelectOptions($('[sid="S_2GHZ_POLICY"]'), M_lang['S_2GHZ_OPTIONS'], getCurrent2GHzPolicy());
	appendSelectOptions($('[sid="S_GUEST_POLICY"]'), M_lang['S_GUEST_OPTIONS'], getCurrentGuestPolicy());
	appendSelectOptions($('[sid="S_RSSI_LEVEL"]'), M_lang['S_RSSI_LEVEL_OPTIONS'], config_data.density_config.rssi_level);	
}

function check_input_values()
{
	function validate_string(str, regExp, type)
	{
		if(type == 'unpermitted'){if(str.match(regExp)) return false;}
		else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
		return true;
	}

	function ssid_check_func(chkstr)
	{
		function StrLenUTF8CharCode(val)
		{
			function ByteLenUTF8CharCode(charCode)
			{
			    if (charCode <= 0x00007F) {
				  return 1;
				} else if (charCode <= 0x0007FF) {
				  return 2;
				} else if (charCode <= 0x00FFFF) {
				  return 3;
				} else {
				  return 4;
				}
			}

			var len=0, i=0;

			for(i=0;val.charCodeAt(i);i++)
				len+=ByteLenUTF8CharCode(val.charCodeAt(i));
			return len;
		}

		var slen;

		if(chkstr == '')
			return M_lang['S_SSID_BLANKED'];
		if((slen = StrLenUTF8CharCode(chkstr)) > 32)
			return M_lang['S_SSID_OVERFLOW'] + slen + 'bytes';

		return null;
	}
	function pass_check_func(chkstr)
	{
		var regExp_hex = /[0-9a-fA-F]{64}/;

		if(chkstr == '')
			return null;
		if(chkstr.length < 8)
			return M_lang['S_WPAPSK_INVALID'];
		if(chkstr.length >= 64 && !validate_string(chkstr, regExp_hex, 'match'))
			return M_lang['S_WPAPSK_HEX_INVALID'];

		return null;
	}

	function check_ip_addr_func(ip, sm)
	{
		function GetNetworkAddress(ip,sm)
		{
			var sp_ip = ip.split('.');
			var sp_sm = sm.split('.');
			var ret_str = '';

			for(var i = 0; i < 4; i ++)
			{
				if(i == 0)
					ret_str = (parseInt(sp_ip[i]) & parseInt(sp_sm[i]));
				else
					ret_str += (parseInt(sp_ip[i]) & parseInt(sp_sm[i]));
				if(i != 3)
					ret_str += '.';
			}
			return ret_str;
		}

		function GetLocalBroadcastAddress(ip, sm)
		{
			var sp_ip = ip.split('.');
			var sp_sm = sm.split('.');
			var ret_str = '';

			for(var i = 0; i < 4; i ++)
			{
				if(i == 0)
					ret_str = ((parseInt(sp_ip[i]) & parseInt(sp_sm[i])) ^ ~ parseInt(sp_sm[i]) & 255);
				else
					ret_str += ((parseInt(sp_ip[i]) & parseInt(sp_sm[i])) ^ ~ parseInt(sp_sm[i]) & 255);
				if(i != 3)
					ret_str += '.';
			}

			return ret_str;
		}

		var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

		var tmpchk;

		if(ip == '...' || !validate_string(ip, regExp_ip, 'match'))
			return M_lang['S_INVALID_IPADDRESS_STRING'];
		if(sm == '...' || !validate_string(sm, regExp_ip, 'match'))
			return M_lang['S_INVALID_NETMASKADDRESS_STRING'];

		tmpchk = GetNetworkAddress(ip, sm);
		if(tmpchk == ip)
			return M_lang['S_INVALID_NETWORK_LANIP'];
		tmpchk = GetLocalBroadcastAddress(ip, sm);
		if(tmpchk == ip)
			return M_lang['S_INVALID_BROAD_LANIP'];

		return null;
	}
	
	var chkstr, result_check = null;

	if($('[sid="C_MODE"]:checked').val() == 'none')
		return null;

	chkstr = $('[sid="C_MAIN_USERID"]').val();
	if((result_check = ssid_check_func(chkstr)) != null)
		return result_check;
	
	if($('[sid="C_MAIN_USERPW"]').length) {
		chkstr = $('[sid="C_MAIN_USERPW"]').val();
		if((result_check = pass_check_func(chkstr)) != null)
			return result_check;
	}

	if($('[sid="S_GUEST_POLICY"]').val() !== 'off') {
		chkstr = $('[sid="C_GUEST_USERID"]').val();
		if((result_check = ssid_check_func(chkstr)) != null)
			return result_check;
		
		chkstr = $('[sid="C_GUEST_USERPW"]').val();
		if((result_check = pass_check_func(chkstr)) != null)
			return result_check;
	}
	
	if((result_check = check_ip_addr_func(convert_textfield_to_string('C_IP_INTERNAL'), convert_textfield_to_string('C_SM_MASK'))) != null)
		return result_check;

	return result_check;
}

function local_fileform_submit(rule_type)
{
	var postData = new FormData($('#iux_file_form')[0]);
	postData.append("tmenu", window.tmenu);
	postData.append("smenu", window.smenu);
	postData.append("service_name", rule_type);

	$.ajax({
		url: '/cgi/iux_set.cgi',
		processData: false,
		contentType: false,
		data: postData,
		type: 'POST',
		success: function(data){
			events.emit("config.restore.done", data);
		},
		error: function(){
			events.emit("config.restore.done", 'FAIL');
		}
	});
}

function add_listener_local(actname)
{
	$('[sid="S_BUTTON_SUBMIT"]').click(function() {
		var chktxt;
		if((chktxt = check_input_values()) != null){
			alert(chktxt);
			return;
		}

		var density_mode = Number($("input[name=density]:checked").val()) ? "on" : "off";
		var select_level = $('[sid="S_RSSI_LEVEL"]').val();
		var rssi_value = $('[sid="S_RSSI_STRENGTH"]').val();

		if($('[sid="C_MODE"]:checked').val() == "controller" && density_mode == "on" && select_level == "manual") {
			if(rssi_value == "") {
				alert(M_lang["S_RSSI_MSG1"]);
				return;
			}
			if(Number(rssi_value) < -100 || Number(rssi_value) > -40) {
				alert(M_lang["S_RSSI_MSG2"]);
				return;
			}
		}

		var localpostdata =[];
                localpostdata.push({name : 'mode', value: $('[sid="C_MODE"]:checked').val()});

		if($('[sid="C_MODE"]:checked').val() === "controller") {
			localpostdata.push(
				{ name : 'main_hidden',		value: $('[sid="C_MAIN_HIDDEN"]').prop('checked') },
				{ name : 'main_pass',		value: $('[sid="C_MAIN_USERPW"]').val() },
				{ name : 'main_ssid',		value: $('[sid="C_MAIN_USERID"]').val() },
				{ name : '2ghz_policy',		value: $('[sid="S_2GHZ_POLICY"]').val()},
				{ name : 'guest_policy',	value: $('[sid="S_GUEST_POLICY"]').val()},
				{ name : 'guest_hidden',	value: $('[sid="C_GUEST_HIDDEN"]').prop('checked') },
				{ name : 'guest_pass',		value: $('[sid="C_GUEST_USERPW"]').val()},
				{ name : 'guest_ssid',		value: $('[sid="C_GUEST_USERID"]').val()},
				{ name : 'ip',			value: convert_textfield_to_string('C_IP_INTERNAL')},
				{ name : 'sm',			value: convert_textfield_to_string('C_SM_MASK')},
				{ name : 'steering_level',	value: $('[sid="N_STEERING_LEVEL"]').val()},
				{ name : 'density_config',	value: density_mode },
				{ name : 'signal_level',	value: select_level },
				{ name : 'signal_strength',	value: rssi_value }
			);
		}
	
		//mode, ip, sm 변경 시 	
		if($('[sid="C_MODE"]:checked').val() != config_data.mode
				|| convert_textfield_to_string('C_IP_INTERNAL') != config_data.ip
				|| convert_textfield_to_string('C_SM_MASK') != config_data.sm) {
			events.confirm({ msg: M_lang['S_REBOOT_ALERT_MSG'], runFunc: function( flag ) {
				if(!flag)
					return;
				$('#loading_reboot').popup('open');
        	                var remaining = firmware_sysinfo.reboot;
                        	reboot_timer(remaining);
                    		stopstatus = true;
				
				iux_submit("apply", localpostdata, false);
			}});
		} else {
			$("#loading").popup('open');
			iux_submit("apply", localpostdata, false);
			ctr_enable("S_BUTTON_SUBMIT", false);
		}
	});	
	
	//게스트네트워크사용
	$('[sid="S_GUEST_POLICY"]').change(function() {
		change_guest($(this).val() !== 'off');
	});

	//비활성화	
	$('[sid="C_MODE"]').change(function(){
		if(config_data.mode === 'agent') {
			change_etc(false); 
		} else {
			var mode = $('[sid="C_MODE"]:checked').val();
			if(mode=="controller")
				change_etc(true);  
			else
				change_etc(false); 
		}
	});

	$('[sid="C_CONFIG_RESTORE"]').change(function() {
		if(this.value) {
			var path = this.value.split('\\');
			$('[sid="S_CONFIG_SELECT"]').val(path[path.length - 1]);
		} else {
			$('[sid="S_CONFIG_SELECT"]').val(M_lang['S_CONFIG_SELECT']);
		}
	});

	$('[sid="EASYMESH_BACKUP"]').click(function() {
		location.href = '/cgi/iux_download.cgi?act=easymesh';
	});

	$('[sid="EASYMESH_RESTORE"]').click(function() {
		if($('[sid="C_CONFIG_RESTORE"]').val() == '') {
			alert(M_lang['S_RESTORE_NOFILE']);
			return;
		}
		events.confirm({ msg: M_lang['S_RESTORE_WARNING'], runFunc: function( flag ) {
			if(!flag)
				return;
			$("#loading").popup('open');
			events.on( "config.restore.done", function(flag) {
				setTimeout(function () {
					$("#loading").popup('close');
					if(flag == 'OK') {
						$('#loading_reboot').popup('open');
						reboot_timer(firmware_sysinfo.reboot);
					} else {
						alert(M_lang["S_RESTORE_FAIL"]);
					}
					$('[sid="C_CONFIG_RESTORE"]').val("").trigger('change');
				}, 1000);
			});
			local_fileform_submit('restore');
		}});
	});

	$("[sid='S_RSSI_LEVEL']").change(function() {
		var value = $(this).val();
		$("[sid='S_RSSI_STRENGTH']").val(config_data.density_config.strength_obj[value]);
		ctr_enable('S_RSSI_STRENGTH', value != "manual" ? false : true);
		if(value == "manual")	$("[sid='S_RSSI_STRENGTH']").focus();
	});

	$("input[name=density]").change(function() {
		var flag = Number($("input[name=density]:checked").val());
		var selectValue = $("[sid='S_RSSI_LEVEL']").val();
		density_field_enable(selectValue == "manual", flag);
	});

	AddMirrorEvent($('[sid="C_MAIN_USERID"]'), $('[sid="S_MAIN_2GSSID"]'), $('[sid="S_2GHZ_POLICY"]'));
	AddMirrorEvent($('[sid="C_GUEST_USERID"]'), $('[sid="S_GUEST_2GSSID"]'), $('[sid="S_2GHZ_POLICY"]'));
}

function density_field_enable(manualflag, flag)
{
		if(flag) {
			// true -> enable
			ctr_enable('S_RSSI_LEVEL', true);
			$("[sid=S_DENSITY_TEXT1], [sid=S_DENSITY_TEXT2]").removeClass('gray');
			if(manualflag)
				ctr_enable('S_RSSI_STRENGTH', true);
		}else {
			// false -> disable
			ctr_enable('S_RSSI_LEVEL', false);
			$("[sid=S_DENSITY_TEXT1], [sid=S_DENSITY_TEXT2]").addClass('gray');
			ctr_enable('S_RSSI_STRENGTH', false);
		}
}
function checkbox_val(sid){
	var sid_ = $('[sid="'+sid+'"]');
	sid_.change(function(){
		if(sid_.val()=="1") sid_.val("0");
		else sid_.val("1");
	});
}

function change_etc(flag){
	//NETWORK
	ctr_enable("C_MAIN_USERID", flag);
	ctr_enable("C_MAIN_USERPW", flag);
	ctr_enable("S_2GHZ_POLICY", flag);

	//checkbox
	ctr_enable("C_MAIN_HIDDEN", flag);
	ctr_enable("C_MAIN_CHECK", flag);	
	ctr_enable("S_GUEST_POLICY", flag);	
		
        //ip
	ctr_enable("C_IP_ADDRESS", flag, true);
	ctr_enable("C_SM_MASK", flag, true);
	ctr_enable("C_GATEWAY", flag, true);

	//Steering
	ctr_enable("N_STEERING_LEVEL", flag);

	ctr_enable('S_DENSITY_MODE', flag);
	density_field_enable($("[sid='S_RSSI_LEVEL']").val() == "manual", flag);
	if(flag) {
		var density_value = Number($("[sid=S_DENSITY_MODE]:checked").val());	
		if(density_value == 0) {
			ctr_enable("S_RSSI_LEVEL", false);
			$("[sid=S_DENSITY_TEXT1], [sid=S_DENSITY_TEXT2]").addClass('gray');
		}
	}

	if(flag)
		flag = $('[sid="S_GUEST_POLICY"]').val() !== 'off';
	change_guest(flag);
}

function change_guest(flag) {
	ctr_enable("C_GUEST_USERID", flag);
	ctr_enable("C_GUEST_USERPW", flag);
	ctr_enable("C_GUEST_HIDDEN", flag);
	ctr_enable("C_GUEST_CHECK", flag);
}

function ctr_enable(sid, flag, textboxgroupflag)
{
	var option;
	if(textboxgroupflag)
		option = "input";
	else
		option = "";

	$('[sid="'+sid+'"] '+ option).each(function()
	{

		if(flag == true) {
			$(this).removeAttr('readonly');
			$(this).parent().removeClass("ui-state-disabled");
			$(this).removeAttr('disabled');
		}
		else {
			$(this).prop('readonly',true);
			$(this).parent().addClass("ui-state-disabled");
			$(this).attr('disabled',true);
		}
	});
}

function convert_textfield_to_string(sid)
{
	var delimiter = '';
	var $container = $('[sid="' + sid + '"]');
	if( $container.hasClass("ip") )
		delimiter = ".";
	else if( $container.hasClass("mac") )
		delimiter = ':';

	return $container.find("input").toArray().map(function(node) { return node.value; }).join(delimiter);
}

function reboot_timer(remaining)
{
	if(remaining == 0){	
		$('#loading_reboot').popup('close');
		alert(M_lang["S_REBOOT_RESULT"]);
		$('[sid="alert__yes"]').click(function() {
			location.reload(true);
		});
	}
	else{
		$('[sid="REBOOT_MSG"]').text(M_lang['S_REBOOT_REMAINING_MSG1'] + remaining + M_lang['S_REBOOT_REMAINING_MSG2']);
		remaining --;
		setTimeout("reboot_timer("+remaining+")",1000);
	}
}

function check_change_value() {
	return $('[sid="S_BUTTON_SUBMIT"]').prop('disabled') === false;
}
