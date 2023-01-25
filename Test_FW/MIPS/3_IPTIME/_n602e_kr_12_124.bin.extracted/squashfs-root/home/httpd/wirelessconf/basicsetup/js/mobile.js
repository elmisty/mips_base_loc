//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_hex = /[0-9a-fA-F]{64}/;
var regExp_hex_for_wep64 = /[0-9a-fA-F]{10}/;
var regExp_hex_for_wep128 = /[0-9a-fA-F]{26}/;

var WPS_STOP = 0;
var WPS_START = 1;
var WPS_CONFIGURED = 2;

var tmp_config_data = null;
var current_mode = null;
var confirm_mode = null;
var confirm_data = null;
var control_channel_arr = [];
var central_channel_arr = [];
var error_code_local = null;
var wps_modes = [];
var wps_btn_stats = [];
var is_loading_panel = false;
var current_selected_mode = '2g';
var opened = false;
var support_wl_modes = null;
var bndstrg_info = null;
var bndstrg_run = false;
var confirm_stack = null;

var use_wep = false;

var chans = null;
//local-global variables end

//local utility functions
function reboot_timer(remaining)
{
	if(remaining == 0){	
		$('#loading_reboot').popup('close');
		location.reload();
	}
	else{
		$('[sid="REBOOT_MSG"]').text(M_lang['S_REBOOT_REMAINING_MSG1'] + remaining + M_lang['S_REBOOT_REMAINING_MSG2']);
		remaining --;
		setTimeout("reboot_timer("+remaining+")",1000);
	}
}

function check_channel_value(country, bw)
{
	if(!config_data.extendsetup)	return '0.0';
	var ctl = config_data.extendsetup.ctlchan;
	var cnt = config_data.extendsetup.cntchan;
	var ctl_arr = control_channel_arr[current_selected_mode][country + '_' + bw];
	var cnt_arr = central_channel_arr[current_selected_mode][country + '_' + bw];
        var match_first_val = null;

        for(var i in ctl_arr){
                if(ctl == ctl_arr[i]){
                        if(cnt == cnt_arr[i])   return ctl_arr[i] + '.' + cnt_arr[i];
                        if(!match_first_val)    match_first_val = ctl_arr[i]+'.'+cnt_arr[i];
                }
        }
        if(match_first_val)     return match_first_val;

        return '0.0';
}

function wl_tag_to_full_ghz_text(wltag)
{
	if(!support_wl_modes)	return '';

	for(var i = 0; i < support_wl_modes.length; i++){
		if(wltag == support_wl_modes[i].tag)	return support_wl_modes[i].postfix+"GHz";
	}
	if(bndstrg_info){
		if(wltag == bndstrg_info[0].tag) 	return bndstrg_info[0].text;
	}

	return '';
}

function get_parameter(key)
{
        var _tempUrl = window.location.search.substring(1);
        if(_tempUrl == '')      return null;
        var _tempArray = _tempUrl.split('&');

        for(var i = 0; _tempArray.length; i++) {
                var _keyValuePair = _tempArray[i].split('=');

                if(_keyValuePair[0] == key){
                        return _keyValuePair[1];
                }
        }
        return null;
}

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

function toggleImage( img )
{
        if( !opened ) {
                img.attr( "src", "images/menu_list_opened.png" ); opened = true;
        } else {
                img.attr( "src", "images/menu_list_closed.png" ); opened = false;
        }
}

function StrLenUTF8CharCode(val)
{
        var len=0, i=0;

        for(i=0;val.charCodeAt(i);i++)
                len+=ByteLenUTF8CharCode(val.charCodeAt(i));
        return len;
}

function submit_button_event_add(rule_type)
{
	$('[sid="S_MODIFY_BTN"]').click(function(){
		submit_local(rule_type, null);
	});
}

function locking_obj(sid, proptype ,defval)
{
	if(defval || defval == ''){
		$('[sid="'+sid+'"]').val(defval).prop(proptype, true);	$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, true);		$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}
}

function unlocking_obj(sid, proptype ,defval)
{
	if(defval || defval == ''){
		$('[sid="'+sid+'"]').val(defval).prop(proptype, false);		$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, false);			$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}
}

function validate_string(str, regExp, type)
{
	if(type == 'unpermitted'){if(str.match(regExp))	return false;}
	else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
	return true;
}

function footerbtn_view_control()
{
	if(check_change_value()){unlocking_obj('S_MODIFY_BTN', 'disabled');}
	else{	locking_obj('S_MODIFY_BTN', 'disabled');}
}

function get_wl_postfix_by_tag(wl_tag)
{
	for(var i = 0; i < support_wl_modes.length; i++){
		if(support_wl_modes[i].tag == wl_tag)	return support_wl_modes[i].postfix;
	}
	if(bndstrg_info){
		if(bndstrg_info[0].tag == wl_tag)	return bndstrg_info[0].postfix;
	}
	return '';
}

function is_loading_need_menu(_idval)
{
	for(var i = 0; i < support_wl_modes.length; i++){
		if((_idval == ('wlrule_0_' + support_wl_modes[i].tag)) || (_idval == ('extendsetup_0_' + support_wl_modes[i].tag)))
			return true;
	}
	return false;
}

function get_category_text()
{
	return (get_wl_postfix_by_tag(current_selected_mode) + 'GHz');
}

function btncontrol_event_add(sid, type)
{
	switch(type){
		case "click":	$('[sid="'+sid+'"]').click(function(){footerbtn_view_control();});break;
		case "keyup":	$('[sid="'+sid+'"]').keyup(function(){footerbtn_view_control();});break;
		case "change":	$('[sid="'+sid+'"]').change(function(){footerbtn_view_control();});break;
	}
}

function get_current_conntag()
{
	if(tmp_config_data && tmp_config_data.conntag)
		return tmp_config_data.conntag;
	return config_data.conntag || '';
}

function should_confirm_submit()
{
	return get_current_conntag().indexOf(current_selected_mode) !== -1;
}

function make_ip_string()
{
	var result = '';

	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE0\"]').val();	result += '.';
	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE1\"]').val();	result += '.';
	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE2\"]').val();	result += '.';
	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE3\"]').val();

	return result;
}

function make_local_postdata(ruletype)
{
	localdata = [];
	switch(ruletype){
		case 'wlrule':
			tmp_config_data.wlrule = config_data.wlrule;
			localdata.push({'name':'ismain', 'value':config_data.wlrule.ismain});
			localdata.push({'name':'wlmode', 'value':current_selected_mode});
			localdata.push({'name':'sidx', 'value':config_data.wlrule.sidx});
			localdata.push({'name':'uiidx', 'value':config_data.wlrule.uiidx});
			localdata.push({'name':'radiusserver', 'value':make_ip_string()});
			break;
		case 'extendsetup':
			localdata.push({'name':'wlmode', 'value':current_selected_mode});
			break;
	}
	return localdata;
}

function extendsetup_validate(localdata)
{
	var val = '';
	val = $('[sid=\"C_EXTENDSETUP_TXPOWER\"]').val();
	if(val !== undefined) {
		if(val == ''){alert(M_lang['S_TXPOWER_BLANKED']);	return false;}
		if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_TXPOWER_INVALID']);	return false;}
		if(parseInt(val)<0 || parseInt(val)>100){alert(M_lang['S_TXPOWER_INVALID']);	return false;}
	}
	val = $('[sid=\"C_EXTENDSETUP_BEACON\"]').val();
	if(val !== undefined) {
		if(val == ''){alert(M_lang['S_BEACON_BLANKED']);	return false;}
		if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_BEACON_INVALID']);	return false;}
		if(parseInt(val)<50 || parseInt(val)>1024){alert(M_lang['S_BEACON_INVALID']);	return false;}
	}
	val = $('[sid=\"C_EXTENDSETUP_RTS\"]').val();
	if(val !== undefined) {
		if(val == ''){alert(M_lang['S_RTS_BLANKED']);	return false;}
		if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_RTS_INVALID']);	return false;}
		if(parseInt(val)<0 || parseInt(val)>2347){alert(M_lang['S_RTS_INVALID']);	return false;}
	}
	val = $('[sid=\"C_EXTENDSETUP_FRAG\"]').val();
	if(val !== undefined) {
		if(val == ''){alert(M_lang['S_FRAG_BLANKED']);	return false;}
		if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_FRAG_INVALID']);	return false;}
		if(parseInt(val)<256 || parseInt(val)>2346){alert(M_lang['S_FRAG_INVALID']);	return false;}
	}
	val = $('[sid=\"C_EXTENDSETUP_DCSPERIODHOUR\"]').val();
	if(val !== undefined) {
		if(val == ''){alert(M_lang['S_DCSPERIOD_BLANKED']);	return false;}
		if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_DCSPERIOD_INVALID']);	return false;}
		if(parseInt(val)<1 || parseInt(val)>100){alert(M_lang['S_DCSPERIOD_INVALID']);	return false;}
	}
	val = check_channel_value($('[sid=\"C_EXTENDSETUP_COUNTRY\"]').val(), $('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]').val());
	if(val != '0.0'){
		localdata.push({'name':'selchannel', 'value':val});
	}
	val = $('[sid=\"C_EXTENDSETUP_BNDRUN\"]').val();
	if(val == 'on')
	{
		confirm_stack = null;
		if(tmp_config_data && tmp_config_data.use_creboot == '1'){
			val = $('[sid=\"C_EXTENDSETUP_COUNTRY\"]').val();
			if(config_data.extendsetup.country != val){
				localdata.push({'name':'country_reboot', 'value':'1'});
				localdata.push({'name':'wlmode', 'value':current_selected_mode});
				confirm_stack = [];
				confirm_stack.push({'name' : 'country_reboot', 'text' : M_lang['S_COUNTRY_REBOOT_REQUIRED']});
			}
		}
		confirm_mode = 'ext_bndstrg_all';	confirm_data = localdata;
		confirm(M_lang['S_BNDSTRG_WARNING_STRING'], null, confirm_stack?false:true);	return false;
	}

	if(tmp_config_data && tmp_config_data.use_creboot == '1'){
		val = $('[sid=\"C_EXTENDSETUP_COUNTRY\"]').val();
		if(config_data.extendsetup.country != val){
			localdata.push({'name':'country_reboot', 'value':'1'});
			confirm_mode = 'country_reboot';	confirm_data = localdata;
			confirm_stack = null;
			confirm(M_lang['S_COUNTRY_REBOOT_REQUIRED']);	return false;
		}
	}
	return true;
}

function wlrule_validate()
{
	var val = '';
	var slen;
	val = $('[sid=\"C_WLRULE_SSID\"]').val();
	if(val == ''){
		alert(M_lang['S_SSID_BLANKED']);	return false;
	}
	if((slen = StrLenUTF8CharCode(val)) > 32){
		alert(M_lang['S_SSID_OVERFLOW'] + slen + 'bytes');	return false;
	}
	val = $('[sid=\"C_WLRULE_USEENTERPRISE\"]').is(':checked');
	if(val){
		if(!validate_string(make_ip_string(), regExp_ip, 'match')){
			alert(M_lang['S_RADIUSSERVER_INVALID']);	return false;
		}
		val = $('[sid=\"C_WLRULE_RADIUSPORT\"]').val();
		if(!validate_string(val, regExp_onlynum, 'match')){
			alert(M_lang['S_RADIUSPORT_INVALID']);	return false;
		}
		if(parseInt(val) < 0 || parseInt(val) > 65535){
			alert(M_lang['S_RADIUSPORT_INVALID']);	return false;
		}
		val = $('[sid=\"C_WLRULE_RADIUSSECRET\"]').val();
		if(val == ''){
			alert(M_lang['S_RADIUSSECRET_BLANKED']);	return false;
		}
	}
	else{
		val = $('[sid=\"C_WLRULE_PERSONALLIST\"]').val();
		if(val == 'auto_wep' || val == 'open_wep' || val == 'key_wep'){
			if(use_wep){
				val = $('[sid=\"C_WLRULE_WEPKEY\"]').val();
				if(val == ''){
					alert(M_lang['S_WEPKEY_INVALID_MSG']);      return false;
				}
				if(val.length != 5 && val.length != 10 && val.length != 13 && val.length != 26){
					alert(M_lang['S_WEPKEY_INVALID_MSG']);      return false;
				}
				if(val.length == 10){
					if(!validate_string(val, regExp_hex_for_wep64, 'match')){
						alert(M_lang['S_WEPKEY_INVALID_MSG']);	return false;
					}
				}
				if(val.length == 26){
					if(!validate_string(val, regExp_hex_for_wep128, 'match')){
						alert(M_lang['S_WEPKEY_INVALID_MSG']);	return false;
					}
				}
			}else{
				alert(M_lang['S_WEP_NOTSUPPORTED_ALERT']);	return false;
			}
		}
		else if(val != 'nouse'){
			val = $('[sid=\"C_WLRULE_WPAPSK\"]').val();
			if(val == ''){
				alert(M_lang['S_WPAPSK_BLANKED']);	return false;
			}
			if(val.length < 8){
				alert(M_lang['S_WPAPSK_INVALID']);	return false;
			}
			if(val.length >= 64){
				if(!validate_string(val, regExp_hex, 'match')){
					alert(M_lang['S_WPAPSK_HEX_INVALID']);	return false;
				}
			}
		}
	}	

	val = $('[sid=\"C_WLRULE_QOSENABLE\"]').is(':checked');
	if(val){
		val = $('[sid=\"C_WLRULE_RXRATE\"]').val();
		if(val != '' && !validate_string(val, regExp_onlynum, 'match')){
			alert(M_lang['S_RXRATE_INVALID']);	return false;
		}
		val = $('[sid=\"C_WLRULE_TXRATE\"]').val();
		if(val != '' && !validate_string(val, regExp_onlynum, 'match')){
			alert(M_lang['S_TXRATE_INVALID']);	return false;
		}
	}
	return true;
}

function set_authview_by_personallist(ruletype, val)
{
	switch(val){
		case 'nouse':
			$('[sid=\"PERSONAL_BOX\"]').css('display','none');
			$('[sid=\"WEP_EXPLAIN_BOX\"]').css('display','none');
			$('[sid=\"WEP_SETTING_BOX\"]').css('display','none');
			$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
			break;
		case 'auto_wep':
		case 'open_wep':
		case 'key_wep':
			$('[sid=\"PERSONAL_BOX\"]').css('display','none');
			if(use_wep){
				$('[sid=\"WEP_EXPLAIN_BOX\"]').css('display','none');
				$('[sid=\"WEP_SETTING_BOX\"]').css('display','');
			}else{
				$('[sid=\"WEP_EXPLAIN_BOX\"]').css('display','');
				$('[sid=\"WEP_SETTING_BOX\"]').css('display','none');
			}
			$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
			break;
		default:
			$('[sid=\"PERSONAL_BOX\"]').css('display','');
			$('[sid=\"WEP_EXPLAIN_BOX\"]').css('display','none');
			$('[sid=\"WEP_SETTING_BOX\"]').css('display','none');
			$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
			break;
	}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PERSONALLIST\"]').val(val).selectmenu('refresh', true);
}

function set_authview_by_useenterprise(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_USEENTERPRISE\"]').is(':checked');
	if(val){
		$('[sid=\"AUTH_BOX\"]').css('display','none');
		$('[sid=\"PERSONAL_BOX\"]').css('display','none');
		$('[sid=\"ENTERPRISE_BOX\"]').css('display','');
	}
	else{
		$('[sid=\"AUTH_BOX\"]').css('display','');
		$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
		set_authview_by_personallist(ruletype, $('[sid=\"C_'+ruletype.toUpperCase()+'_PERSONALLIST\"]').val());
	}
}

function set_initcheck_passview(ruletype)
{
	$('[sid=\"L_'+ruletype.toUpperCase()+'_WPAPSKCHECK\"]').removeAttr('checked').checkboxradio('refresh');
	if(use_wep)	$('[sid=\"L_'+ruletype.toUpperCase()+'_WEPCHECK\"]').removeAttr('checked').checkboxradio('refresh');
	$('[sid=\"L_'+ruletype.toUpperCase()+'_RADIUSSECRETCHECK\"]').removeAttr('checked').checkboxradio('refresh');
}

function set_password_process(ruletype, ctlname, checked)
{
	if(checked){$('[sid=\"C_'+ruletype.toUpperCase()+'_'+ctlname+'\"]').attr('type','text');}
	else{$('[sid=\"C_'+ruletype.toUpperCase()+'_'+ctlname+'\"]').attr('type','password');}
}

function set_radiusport_by_check(ruletype, checked)
{
	if(checked){unlocking_obj('C_'+ruletype.toUpperCase()+'_RADIUSPORT','readonly');}
	else{locking_obj('C_'+ruletype.toUpperCase()+'_RADIUSPORT','readonly');}
}

function set_qosinput_by_check(ruletype, checked)
{
	if(checked){unlocking_obj('C_'+ruletype.toUpperCase()+'_RXRATE','readonly'); unlocking_obj('C_'+ruletype.toUpperCase()+'_TXRATE','readonly');}
	else{locking_obj('C_'+ruletype.toUpperCase()+'_RXRATE','readonly'); locking_obj('C_'+ruletype.toUpperCase()+'_TXRATE','readonly');}
}

function set_dyninput_by_slider(ruletype, val)
{
	if(val == 'on'){unlocking_obj('C_'+ruletype.toUpperCase()+'_DCSPERIODHOUR','readonly');}
	else{locking_obj('C_'+ruletype.toUpperCase()+'_DCSPERIODHOUR','readonly');}
}

function set_wpstext_by_status()
{
	for(var i = 0 ; i < support_wl_modes.length; i++){
		var modeArr = support_wl_modes[i].text.split(" ");
		var mode = modeArr[0]+modeArr[1];

		if(wps_modes[support_wl_modes[i].tag] == WPS_START){
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]')
				.text((mode) + ' ' + M_lang['S_WPSCANCEL_STRING']);
				//.text(support_wl_modes[i].postfix + 'GHz ' + M_lang['S_WPSCANCEL_STRING']);
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpscancel.png');
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSDESC_STRING']);
		}
		else if(wps_modes[support_wl_modes[i].tag] == WPS_CONFIGURED){
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]')
				.text((mode) + ' ' +M_lang['S_WPSCONNECT_STRING']);
				//.text(support_wl_modes[i].postfix + 'GHz ' +M_lang['S_WPSCONNECT_STRING']);
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSCONFIGURED_STRING']);
		}
		else{
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]')
				.text((mode) + ' ' +M_lang['S_WPSCONNECT_STRING']);
				//.text(support_wl_modes[i].postfix + 'GHz ' +M_lang['S_WPSCONNECT_STRING']);
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"] [sid=\"WPSTEXT_CONTENT\"]').text('');
		}
	}
	if(bndstrg_info && bndstrg_run){
		if(wps_modes[bndstrg_info[0].tag] == WPS_START){
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]')
				.text((bndstrg_info[0].text) + ' ' + M_lang['S_WPSCANCEL_STRING']);
				//.text(bndstrg_info[0].postfix + 'GHz ' + M_lang['S_WPSCANCEL_STRING']);
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpscancel.png');
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSDESC_STRING']);
		}
		else if(wps_modes[bndstrg_info[0].tag] == WPS_CONFIGURED){
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]')
				.text((bndstrg_info[0].text) + ' ' +M_lang['S_WPSCONNECT_STRING']);
				//.text(bndstrg_info[0].postfix + 'GHz ' +M_lang['S_WPSCONNECT_STRING']);
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSCONFIGURED_STRING']);
		}
		else{
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]')
				.text((bndstrg_info[0].text) + ' ' +M_lang['S_WPSCONNECT_STRING']);
				//.text(bndstrg_info[0].postfix + 'GHz ' +M_lang['S_WPSCONNECT_STRING']);
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"] [sid=\"WPSTEXT_CONTENT\"]').text('');
		}
	}
}

function basic_control_event_add(ruletype, idval)
{
	$('[sid^="C_"]').each(function(){
		var type=$(this).attr('type');
		if(!type)	return;
		var sid=$(this).attr('sid');
		var etype;

		switch(type){
			case 'radio':
			case 'checkbox':
			case 'slider':
			case 'select':	etype='change';	break;
			case 'text':
			case 'number':	etype='keyup';	break;
			default:	return;
		}
		btncontrol_event_add(sid,etype);
	});

	if(ruletype == 'wlrule'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_PERSONALLIST\"]').unbind('change').change(function(){
			set_authview_by_personallist(ruletype, $(this).val());
			footerbtn_view_control();
		});
		
		$('[sid=\"C_'+ruletype.toUpperCase()+'_USEENTERPRISE\"]').unbind('change').change(function(){
			set_authview_by_useenterprise(ruletype);
			footerbtn_view_control();
		});
		
		$('[sid=\"C_'+ruletype.toUpperCase()+'_QOSENABLE\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_qosinput_by_check(ruletype, val);
			footerbtn_view_control();
		}).trigger('change');

		$('[sid=\"L_'+ruletype.toUpperCase()+'_WPAPSKCHECK\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_password_process(ruletype, 'WPAPSK', val);
		}).trigger('change');

		$('[sid=\"L_'+ruletype.toUpperCase()+'_WEPCHECK\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_password_process(ruletype, 'WEPKEY', val);
		}).trigger('change');

		$('[sid=\"L_'+ruletype.toUpperCase()+'_RADIUSSECRETCHECK\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_password_process(ruletype, 'RADIUSSECRET', val);
		}).trigger('change');

		$('[sid=\"L_'+ruletype.toUpperCase()+'_RADIUSPORTCHECK\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_radiusport_by_check(ruletype, val);
		}).trigger('change');
		
		$('[sid=\"L_CHANSEARCH_BTN\"]').unbind('click').click(function(){
			$('[sid=\"L_CUSTOM_MSG1\"]').text(M_lang['S_NOW_SEARCH1']);
			$('[sid=\"L_CUSTOM_MSG2\"]').text(M_lang['S_NOW_SEARCH2']);
			$('#loading_msg').popup('open');
			get_search_data();
		});
	}
	else if(ruletype == 'extendsetup'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_MODE\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				//extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);

			var delchan = false;
		
			if(current_selected_mode == '5g' && $(this).find('option:selected').text().indexOf('ac') == -1)	delchan = true;
			if(current_selected_mode == '5g2' && $(this).find('option:selected').text().indexOf('ac') == -1)	delchan = true;
			if(current_selected_mode == '2g' && $(this).find('option:selected').text().indexOf('N') == -1)	delchan = true;

			/*AX must be show all channel width*/
			if(($(this).find('option:selected').text().indexOf('ax') != -1)){delchan = false;}

			var chanobj = $('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]');
			var realval = config_data.extendsetup.channelwidth;

			if(!chans)	return;
			chanobj.find('option').remove();
			for(var i = 0; i < chans.length; i++){
				if((current_selected_mode == '5g' && delchan && chans[i].text.indexOf('80') != -1)
				|| (current_selected_mode == '5g2' && delchan && chans[i].text.indexOf('80') != -1)
				|| (current_selected_mode == '2g' && delchan && chans[i].text.indexOf('40') != -1)){
					if(config_data.extendsetup.channelwidth == chans[i].value)	
						realval = (chans[(((i+1) < chans.length)?(i+1):0)].value);
					else
						realval = (config_data.extendsetup.channelwidth);
					continue;
				}

				chanobj.append('<option value=\"'+chans[i].value+'\">'
					+((chans[i].value == '0')?M_lang['S_EXTAUTO_STRING']:chans[i].text)+'</option>');
			}
			chanobj.val(realval).selectmenu('refresh', true);
			footerbtn_view_control();
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_COUNTRY\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				if(tmp_config_data && tmp_config_data.use_creboot == '1'){
					var localdata = [];
					localdata.push({'name':($(this).attr('name')), 'value':($(this).val())});
					localdata.push({'name':'country_reboot', 'value':'1'});
					localdata.push({'name':'wlmode', 'value':current_selected_mode});
					var val = check_channel_value($(this).val(), $('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]').val());
					if(val != '0.0'){
						localdata.push({'name':'selchannel', 'value':val});
					}
					confirm_mode = 'country_reboot_one';	confirm_data = localdata;
					confirm_stack = null;
					confirm(M_lang['S_COUNTRY_REBOOT_REQUIRED']);
				}else{
					extendsetup_part_submit($(this).attr('name'), $(this).val());
				}
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_CHANNELWIDTH\"]').unbind('change').change(function(){
			if($(this).val() == '160') {
				var that = this;
				events.confirm({ msg: M_lang["S_DFS_WARNING_160"], runFunc: function( flag ) {
					if(flag && $('[sid=\"S_MODIFY_BTN\"]').prop('disabled')) {
						extendsetup_part_submit($(that).attr('name'), $(that).val());
					}
					$(that).selectmenu('refresh', true);
				}});
			} else {
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($(this).attr('name'), $(this).val());
				}
				$(this).selectmenu('refresh', true);
			}
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_LDPC\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_BNDRUN\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					var myval = $myObj.val();
					if(myval == 'on' && myval != config_data.extendsetup.bndrun){
						var localdata = [];
						localdata.push({'name':($myObj.attr('name')), 'value':($myObj.val())});
						confirm_mode = 'bndstrg_onoff';	confirm_data = localdata;
						confirm_stack = null;
						confirm(M_lang['S_BNDSTRG_WARNING_STRING']);
					}else{
						extendsetup_part_submit($myObj.attr('name'), $myObj.val());
					}
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_WMM\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_WPSMODE\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_PHYWATCHDOG\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_WPSNOTI\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_DFS\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_STBC\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_DYNCHANNEL\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				var val = $myObj.val();
				set_dyninput_by_slider(ruletype, val);
				if(val == 'off'){
					if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
						extendsetup_part_submit($myObj.attr('name'), $myObj.val());
					}else{
						footerbtn_view_control();
					}
				}else{
					footerbtn_view_control();
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_TXBFMUMODE\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_MUFLAG\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_MIMOANT\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_VHT24G\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
		});
	}
	submit_button_event_add(ruletype);
}

function extendsetup_part_submit(name, value)
{
	var localdata = [];
	var mode = current_selected_mode;
	$('#loading').popup('open');
	localdata.push({'name':name, 'value':value});
	localdata.push({'name':'wlmode', 'value':mode});
	var val = check_channel_value($('[sid=\"C_EXTENDSETUP_COUNTRY\"]').val(), $('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]').val());
	if(val != '0.0'){
		localdata.push({'name':'selchannel', 'value':val});
	}
	iux_submit('extendsetup',localdata, false);
}

function wpssetup_part_submit(val, mode)
{
	var localdata = [];
	$('#loading').popup('open');
	localdata.push({'name':'wpsstatus', 'value':((val==WPS_START)?'start':'stop')});
	localdata.push({'name':'wlmode', 'value':mode});
	iux_submit('wps',localdata, false);
}

function wps_button_event_add()
{
	for(var i = 0 ; i < support_wl_modes.length; i++){
		$('[sid=\"S_WPS_BTN'+support_wl_modes[i].tag.toUpperCase()+'\"]').unbind('click').click(function(){
			var val = WPS_START;
			for(var j = 0 ; j < support_wl_modes.length; j++){
				var wl_tag = support_wl_modes[j].tag;
				if($(this).attr('sid') == 'S_WPS_BTN'+wl_tag.toUpperCase()){
					if(wps_modes[wl_tag] == WPS_START){val = WPS_STOP;}
					else if(wps_modes[wl_tag] == WPS_STOP || wps_modes[wl_tag] == WPS_CONFIGURED){val = WPS_START;}
					else {val = WPS_STOP;}
					wpssetup_part_submit(val, wl_tag);
				}
			}
		});
	}
	if(bndstrg_info && bndstrg_run){
		$('[sid=\"S_WPS_BTN'+bndstrg_info[0].tag.toUpperCase()+'\"]').unbind('click').click(function(){
			var val = WPS_START;
			if($(this).attr('sid') == 'S_WPS_BTN'+bndstrg_info[0].tag.toUpperCase()){
				if(wps_modes[bndstrg_info[0].tag] == WPS_START){val = WPS_STOP;}
				else if(wps_modes[bndstrg_info[0].tag] == WPS_STOP || wps_modes[bndstrg_info[0].tag] == WPS_CONFIGURED){val = WPS_START;}
				else {val = WPS_STOP;}
				wpssetup_part_submit(val, bndstrg_info[0].tag);
			}
		});
	}
}

function wlrule_onoff_event_add()
{
	$('[sid=\"LISTDATA\"] select').unbind('change').each(function(){
		sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
			var mode = $myObj.attr('sid').split('_')[2];
			current_selected_mode = mode;
			var idx = $myObj.attr('sid').split('_')[0].replace(/[^0-9]/g, '');
			var localdata = [];
			var tmp = null;
			tmp = config_data['bsslist_'+mode][idx];
		
			if($myObj.val() != tmp.run){
				for(var Name in tmp){
					if(tmp.hasOwnProperty(Name) && Name != ''){
						if(Name == 'run')	continue;
						localdata.push({'name':Name, 'value':eval('tmp.'+Name)});
					}
				}
				localdata.push({'name':'run', 'value':($myObj.val())});
				localdata.push({'name':'wlmode', 'value':mode});
				if(should_confirm_submit()) {
					confirm_mode = 'wlrule_onoff';	confirm_data = localdata;
					confirm_stack = null;
					confirm(M_lang[((tmp.ismain == '1')?'S_DISCONNECTCONFIRM_STRING':'S_DISCONNECTCONFIRM2_STRING')]);	return;
				}
				$('#loading').popup('open');
				preserve_submit_data(localdata);
				iux_submit('wlrule',localdata, false);
			}
		}});
	});
}

function append_main_line(ruletype, ruleidx, run, unlocking, wlmode, bkidx, bndmode)
{
	var HTMLStr = '';
	HTMLStr += ('<div sid=\"LISTDATA\" class=\"'+((ruleidx==0)?'':('contents_div '+((opened)?'show ':'hide ')))+((ruleidx==0)?'lc_whitebox_div':'lc_greenbox_div')+'\">');

	HTMLStr += ('<a href=\"#right_panel\" id=\"'+ruletype+'_'+ruleidx+'_'+wlmode+'\" data-icon=\"false\">');
	HTMLStr += ('<div class=\"lc_left_click_div\">');
	HTMLStr += ('<div class=\"lc_line_div\"><div><span sid=\"WLRULE_TITLE\" class=\"'+((run == '0' || bndmode)?'lc_disabled_text':'lc_description_text')+'\">');
	HTMLStr += (wl_tag_to_full_ghz_text(wlmode) + ' ');
	HTMLStr += ((ruleidx == 0?M_lang['S_DEFAULT_WIRELESS']:(M_lang['S_SUB_WIRELESS']) +' '+ ruleidx)+ ((bndstrg_info && (bndstrg_info[0].tag == wlmode))?('('+M_lang['S_BNDSTRG_STRING']+')'):"") + '</span>');
	HTMLStr += ('<img src=\"/common/images/loading.gif\" class=\"lc_description_img\" sid=\"WLRULE_IMG\"></div></div>');
	HTMLStr += ('<div class=\"lc_line_div\"><p class=\"'+((run == '0' || bndmode)?'lc_disabled_text':'')+'\" sid=\"WLRULE_VALUE\"></p>');
	HTMLStr += ('</div>');
	HTMLStr += ('</div>');
	HTMLStr += ('</a>');
	
	HTMLStr += ('<div class=\"lc_center_noclick_div\">');
	HTMLStr += ('<div class=\"lc_oneline_div\">');
	HTMLStr += ('<div class=\"ui-alt-icon lc_line_rightside lc_line_checkbox\">');
	HTMLStr += ('<label class=\"ui-hidden-accessible\" for=\"'+(ruletype + ruleidx)+'_run'+'_'+wlmode+'\"></label>');
	HTMLStr += ('<select sid=\"'+(ruletype.toUpperCase()+ruleidx)+'_RUN_'+wlmode+'\" id=\"'+(ruletype + ruleidx)+'_run_'+wlmode+'\" data-role=\"slider\">');
	HTMLStr += ('<option value=\"0\">Off</option><option value=\"1\">On</option>');
	HTMLStr += ('</select></div><div class=\"lc_line_rightside\" style=\"display:padding-right:.5em;\">');
	HTMLStr += ('<img src=\"images/'+(unlocking?'wifi_unlock.png':'wifi_lock.png')+'\" class=\"'+((run=='0' || bndmode)?'lc_opacity30':'')+'\"></div>');
	HTMLStr += ('</div></div>');

	HTMLStr += ('<a href=\"#right_panel\" id=\"'+ruletype+'_'+ruleidx+'_'+wlmode+'\" data-icon=\"false\">');
	HTMLStr += ('<div class=\"lc_right_click_div\">');
	HTMLStr += ('<div class=\"lc_oneline_div\"><p class=\"lc_line_centerside\">');
	HTMLStr += ('<img src=\"/common/images/icon_list_run.png\" class=\"'+((run=='0' || bndmode)?'lc_opacity30':'')+'\"></p></div>')
	HTMLStr += ('</div>');
	HTMLStr += ('</a>');

	HTMLStr += ('</div>');

	$('#wl_listbox').append(HTMLStr).trigger('create');
}

function update_bssid_line(idval, configObj, identifier)
{
	var mode = get_rulemode(idval);
	if(identifier && identifier == 'D'){
		set_wpstext_by_status();
		if((status_data['dfs_stat'+mode] == 'DFS_SWITCHING' || status_data['dfs_stat'+mode] == 'DFS_SILENCE') && status_data['dfs_remain'+mode]){
			$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','');
			if(status_data['dfs_stat'+mode] == 'DFS_SWITCHING'){
				$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(M_lang['S_DFS_SWITCHING']);
			}else{
				$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(M_lang['S_DFS_SILENCE'] + ' ' +
				(parseInt(status_data['dfs_remain'+mode]))+M_lang['S_WPSCONNECTING2_STRING']);
			}
			locking_obj('S_WPS_BTN'+mode.toUpperCase(), 'disabled');
		}
		else if(wps_modes[mode] == WPS_START){
			if(parseInt(status_data['remaintime'+mode]) == 0 || parseInt(status_data['remaintime'+mode]) >= 120){
				return;
			}
			$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','');
			$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(M_lang['S_WPSCONNECTING1_STRING']+
			(120 - parseInt(status_data['remaintime'+mode]))+M_lang['S_WPSCONNECTING2_STRING']);
			unlocking_obj('S_WPS_BTN'+mode.toUpperCase(), 'disabled');
		}
		else{
			$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','none'); 
			if(status_data['switch'+mode] && status_data['switch'+mode] == '1'){
				$('#'+idval+' [sid=\"WLRULE_TITLE\"]')
					.text((wl_tag_to_full_ghz_text(mode) + ' ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSWITCH_STRING']);
					//.text((get_wl_postfix_by_tag(mode) + ' GHz ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSWITCH_STRING']);
				locking_obj('S_WPS_BTN'+mode.toUpperCase(), 'disabled');
			}
			else if(status_data['schedule'+mode] && status_data['schedule'+mode] == '1'){
				$('#'+idval+' [sid=\"WLRULE_TITLE\"]')
					.text((wl_tag_to_full_ghz_text(mode) + ' ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSCHEDULER_STRING']);
					//.text((get_wl_postfix_by_tag(mode) + ' GHz ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSCHEDULER_STRING']);
				locking_obj('S_WPS_BTN'+mode.toUpperCase(), 'disabled');
			}
			else{
				if(bndstrg_info && bndstrg_info[0].tag == mode){
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text((wl_tag_to_full_ghz_text(mode) + ' ') + M_lang['S_DEFAULT_WIRELESS'] + '('+M_lang['S_BNDSTRG_STRING']+')');
					//$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text((get_wl_postfix_by_tag(mode) +' GHz ') + M_lang['S_DEFAULT_WIRELESS'] + '('+M_lang['S_BNDSTRG_STRING']+')');
				}
				else{
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text((wl_tag_to_full_ghz_text(mode) + ' ') + M_lang['S_DEFAULT_WIRELESS']);
					//$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text((get_wl_postfix_by_tag(mode) +' GHz ') + M_lang['S_DEFAULT_WIRELESS']);
				}
				if(wps_btn_stats[mode] && wps_btn_stats[mode] == true){
					unlocking_obj('S_WPS_BTN'+mode.toUpperCase(), 'disabled');
				}
			}
		}
	}
	else{
		$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','none');
		if(configObj.ismain == '1'){
			$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(M_lang['S_DEFAULT_WIRELESS']);
		}
		if(configObj.run == '0'){$('#'+idval+' [sid=\"WLRULE_VALUE\"]').text(M_lang['S_DISABLED_STRING']);}
		else{$('#'+idval+' [sid=\"WLRULE_VALUE\"]').text(configObj.ssid);}
		var $flipSwitch = $('[sid=\"LISTDATA\"] [sid=\"'+(get_ruletype(idval).toUpperCase() + get_ruleindex(idval))+'_RUN_'+mode+'\"]').val(configObj.run).slider('refresh');
	}
}

function make_localConfigObj(mode, configObj, idx)
{
	var localConfigObj = new Object();
	switch(mode){
		case 'wlrule':	localConfigObj.wlrule = configObj;
		if(localConfigObj.wlrule.radiusserver && localConfigObj.wlrule.radiusserver == ''){localConfigObj.wlrule.radiusserver = '...';}
		if(localConfigObj.wlrule.uiidx == '0'){localConfigObj.wlrule.uiidx = idx;}
		break;
		default:
		localConfigObj.extendsetup = configObj;
		break;
	}
	return localConfigObj;
}

function get_localConfigObj(_idstr)
{
	if(!_idstr)	return null;
	var arr = _idstr.split('_');
	var mode = arr[2];
	switch(arr[0]){
		case 'wlrule':		
			if(mode){
				config_data['bsslist_'+mode][parseInt(arr[1])].use_wpa3 = config_data.use_wpa3;
				return make_localConfigObj(arr[0], config_data['bsslist_'+mode][parseInt(arr[1])], arr[1]);
			}
			break;
		default:
			if(mode){
				return make_localConfigObj(arr[0], config_data['extendsetup'+mode]);
			}
			break;
	}
}

function get_ruletype(_idstr)
{
	if(!_idstr)	return 'wlrule';
	else	return _idstr.split('_')[0];
}
function get_ruleindex(_idstr)
{
	if(!_idstr)	return 0;
	else	return parseInt(_idstr.split('_')[1]);
}
function get_rulemode(_idstr)
{
	if(!_idstr)	return '2g';
	else	return _idstr.split('_')[2];
}

function confirm_result_local(flag)
{
	if(!confirm_mode)	return;
	else {
		if(flag){
			if(confirm_mode == 'wlrule' || confirm_mode == 'wlrule_onoff'){
				$('#loading').popup('open');
				iux_submit('wlrule',confirm_data, true);
				preserve_submit_data(confirm_data);
			}
			else if(confirm_mode == 'ext_bndstrg_all'){
				if(confirm_stack){
					var stack_item = confirm_stack.pop();
					if(stack_item){
						confirm_mode = stack_item.name;
						confirm(stack_item.text, null, false);	return;
					}
				}
				$('#loading').popup('open');
				iux_submit('extendsetup',confirm_data, true);
			}
			else if(confirm_mode == 'country_reboot' || confirm_mode == 'country_reboot_one'){
				reboot_timer(parseInt(tmp_config_data.rebootsec));
				iux_submit('extendsetup',confirm_data, true);
				$('#loading_reboot').popup('open');
			}
			else if(confirm_mode == 'bndstrg_onoff'){
				extendsetup_part_submit(confirm_data[0].name, confirm_data[0].value);
			}
		}
		else{
			if(confirm_mode == 'wlrule_onoff'){
				iux_update_local();
			}
			else if(confirm_mode == 'bndstrg_onoff' || confirm_mode == 'country_reboot_one'){
				iux_update('C');
			}
		}
	}
	confirm_data = null;	confirm_mode = null;
}

function loadLocalPage()
{
	if(error_code_local == 1 || error_code_local == 2 || error_code_local == 5){
		alert(M_lang['S_ERRORMSG_STRING'+error_code_local]);	return;
	}
	//pageview_select_update(loc);
	get_status_local();
	$('[sid=\"C_WANINFO_MACLIST\"]').attr('sid', 'L_WIRELESS_SEARCHLIST');
	$('[sid=\"S_POPUP_MACSELECT_TITLE_TEXT\"]').attr('sid', 'L_WIRELESS_TITLE');
}

function result_config(result)
{
	if(result){
		error_code_local = parseInt(config_data.errcode);
		iux_update_local();
		$('#loading').popup('close');
	}
}

function need_refresh_val()
{
	if(config_data.wlrule.ssid != last_submit_data.ssid)
		return true;
	if(!!parseInt(config_data.wlrule.useenterprise) != last_submit_data.useenterprise)
		return true;
	if(last_submit_data.useenterprise) {
		if(config_data.wlrule.radiussecret != last_submit_data.radiussecret)
			return true;
	} else {
		if(config_data.wlrule.wpapsk != last_submit_data.wpapsk)
			return true;
	}
	return false;
}

function should_call_native()
{
	if(should_confirm_submit() === false)
		return false;
	if((get_current_conntag().split(".")[1] || "0") !== config_data.wlrule.uiidx)
		return false;
	return need_refresh_val();
}

var last_submit_data;
function preserve_submit_data(local_data)
{
	last_submit_data = $('#iux_form')
		.serializeArray()
		.concat(local_data)
		.reduce(function(ret, cur) {
			ret[cur.name] = cur.value;
			return ret;
		}, {});
}

function call_native_with_info()
{
	var info = "wireless\n";
	info += config_data.wlrule.bssid + "\n";
	info += config_data.wlrule.ssid + "\n";
	info += last_submit_data.ssid + "\n";
	if(last_submit_data.useenterprise) {
		info += last_submit_data.enterpriselist + "\n";
		info += last_submit_data.radiussecret;
	} else {
		info += last_submit_data.personallist + "\n";
		info += last_submit_data.wpapsk;
	}
	call_native(info);
}

function result_submit(service_name, result)
{
	if(service_name == 'wlrule') {
		if(should_call_native())
			call_native_with_info();
	}
	if(result){
		if(service_name == 'wlrule'){
			if(tmp_config_data)	tmp_config_data = null;
			$('#right_panel').panel('close');
		}
		else if(service_name == 'extendsetup'){
			if(tmp_config_data)	tmp_config_data = null;
			$('#right_panel').panel('close');
		}
	}
	else{
		alert(M_lang['S_DISCONNECTED_MSG']);
	}
}

function get_frequency_desc(ctl_ch, cent_ch, wltag)
{
	var desc = ctl_ch + ' [ ';
	var real_tag = (wltag?wltag:current_selected_mode);
	var ghz = (real_tag == '5g' || real_tag == '5g2')?5:2;

	if(ghz == 5)
		desc += '5.'+5*ctl_ch;
	else{
		if(ctl_ch == 14)	desc += '2.484';
		else			desc += '2.'+(407+5*ctl_ch);
	}
	desc += ' GHz';
	if(ctl_ch != cent_ch)	desc += ',' + ((ctl_ch < cent_ch)?M_lang['S_UPPERCHANNEL_STRING']:M_lang['S_LOWERCHANNEL_STRING']);
	desc += ' ]';
	return desc;
}

function update_channel_options(ruletype, country, bw, val, isauto, wltag)
{
	$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL'+((wltag)?wltag:'')+'\"]').find('option').remove();
	var ctl_arr = control_channel_arr[wltag?wltag:current_selected_mode][country + '_' + bw];
	var cent_arr = central_channel_arr[wltag?wltag:current_selected_mode][country + '_' + bw];
	var ctl_ch = parseInt(val.split('.')[0]);
	var cent_ch = parseInt(val.split('.')[1]);
	var optext = M_lang['S_AUTOCHANNEL_STRING'] + '(' + get_frequency_desc(ctl_ch, cent_ch,wltag) + ')';

	$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL'+((wltag)?wltag.toUpperCase():'')+'\"]').append('<option value=\"0\">'+optext+'</option>');

	var is_correct = false;	
	for(var i in ctl_arr){
		optext = get_frequency_desc(ctl_arr[i], cent_arr[i],wltag);
		$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL'+((wltag)?wltag.toUpperCase():'')+'\"]').append('<option value=\"'+(ctl_arr[i] + '.' + cent_arr[i])+'\">'+optext+'</option>');
		if(bw == '40' && val == (ctl_arr[i] + '.' + cent_arr[i])){is_correct = true;}
		else if(bw != '40' && ctl_ch == ctl_arr[i]){val = (ctl_arr[i] + '.' + cent_arr[i]); is_correct = true;}
	}
	if(!is_correct){
		for(var i in ctl_arr){
			if(ctl_ch == ctl_arr[i]){val = (ctl_arr[i] + '.' + cent_arr[i]);	is_correct = true;}
		}
		if(!is_correct)	val = '0';
	}
	if(isauto == '1'){
		val = '0';
	}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL'+((wltag)?wltag.toUpperCase():'')+'\"]').attr('value',val).val(val).selectmenu('refresh',true);
	return val;
}

function onclick_searchlist(val)
{
	$('[sid=\"C_WLRULE_SELCHANNEL\"]').val(val).selectmenu('refresh').trigger('change');
	$('#list_popup').popup('close');
}

function get_search_data()
{
	$('[sid=\"L_WIRELESS_TITLE\"]').text(M_lang['S_CHANNELSEARCH_STRING']);
	$('[sid=\"L_WIRELESS_SEARCHLIST\"]').find('li').remove();
	$.ajaxSetup({async : true, timeout : 20000});	
	$.getJSON('/cgi/iux_get.cgi', { tmenu : window.tmenu,smenu : window.smenu, category : current_selected_mode,
			'act' : 'data', 'mode' : 'scan', 'bw' : config_data.wlrule.bandwidth, 'country':config_data.wlrule.country})
        .done(function(data){
		if(json_validate(data, '') == true){
			var resultList = data;
			var tmpList = resultList.channellist;
			var chanList = [];
			for(var i = 0; i < tmpList.length; i++){
				if(tmpList[i].isbestchan == '1'){chanList[0] = tmpList[i];}
			}
			for(var i = chanList.length, j = 0; j < tmpList.length; j++){
				if(tmpList[j].isbestchan != '1'){chanList[i] = tmpList[j]; i++;}
			}
			for(var i = 0; i < chanList.length; i++){
				$('[sid=\"L_WIRELESS_SEARCHLIST\"]').append(
					'<li class=\"lc_channel_li\"><a onclick=\"onclick_searchlist(\''+chanList[i].channel+'\');\">'+
					'<div class=\"lc_channelleft\"><div><p class=\"lc_channeltitle '+
					((chanList[i].isbestchan == '1')?'':'lc_grayfont_text')+'\">'+
					M_lang['S_CHANNEL_STRING'] + ' ' +chanList[i].idx +
					'</p></div></div><div class=\"lc_channelright\"><div class=\"lc_channelright_line\"><p'+
					((chanList[i].isbestchan == '1')?'':' class=\"lc_grayfont_text\"')+'>' +
					chanList[i].ghz + ((chanList[i].chanband != '')?(','+M_lang[chanList[i].chanband]):'') +
					((chanList[i].mhz != '')?(',' + chanList[i].mhz):'') +  
					((chanList[i].isbestchan == '1')?(' - ' + M_lang['S_BESTCHAN_STRING']):'') +
					'</p></div><div class=\"lc_channelright_line\">' + 
					'<p'+((chanList[i].isbestchan == '1')?'':' class=\"lc_grayfont_text\"')+'>' + 
					((chanList[i].ssidstr != '')?
					(M_lang['S_USINGAPLIST_STRING'] + '(' + chanList[i].numberofap + M_lang['S_USEAP_STRING'] + ') : ' + 
					chanList[i].ssidstr):M_lang['S_AVAILABLE_STRING']) + 
					'</p></div></div></a></li>'
				);
			}
		}
		$('#loading_msg').popup('close');
		$('[sid=\"L_WIRELESS_SEARCHLIST\"]').parent().css('width','30em').css('height','30em').css('overflow','auto')
		$('[sid=\"L_WIRELESS_SEARCHLIST\"]').listview('refresh');
		$("li>a").removeClass("ui-btn-icon-right");

		$("li>a:even").css("background-color","#FFFFFF");
		$("li>a:odd").css("background-color","#F9FAF5");
		$('[sid=\"L_WIRELESS_SEARCHLIST\"]').listview('refresh');

		$('[sid=\"L_WIRELESS_SEARCHLIST\"] a').each(function(){
			$(this).on("mousedown touchstart", function() {
                		$(this).addClass("animation_blink")
               		 	.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
        		                $(this).removeClass("animation_blink");
        		        });
	        	});
		});


		$('#list_popup').popup('open');
	})
	.fail(function(jqxhr, textStatus, error){
		$('#loading_msg').popup('close');
		alert(M_lang['S_SEARCHFAIL_STRING']);
	});
}

function get_channel_regulation_warning(cobj)
{
	function is_regulation_chan(lporg, chan, bwidth)
        {
                var lplist = lporg.split(',');
                for(var idx = 0; idx < lplist.length; idx ++){
                        lp = lplist[idx];
                        var lpchan = lp.split(':')[0];
                        var lpbw = lp.split(':')[1];
                        if(chan == lpchan && (lpbw == '*' || lpbw == bwidth))   return true;
                }
                return false;
        }

	if(cobj.rwarning == '1'){
		if(cobj.lpchannel){
			var val = $('[sid=\"C_WLRULE_SELCHANNEL\"]').val();
			if(val){
				val = val.split('.')[0];
				var bwidth = cobj.bandwidth;
				if(is_regulation_chan(cobj.lpchannel, val, bwidth)){
					return true;
				}
			}else{
				for(var i = 0; i < support_wl_modes.length; i++){
					val = $('[sid=\"C_WLRULE_SELCHANNEL'+(support_wl_modes[i].tag.toUpperCase())+'\"]').val();
					if(val){
						val = val.split('.')[0];
						var bwidth = cobj.bandwidth;
						if(is_regulation_chan(cobj.lpchannel, val, bwidth)){
							return true;
						}
					}
				}
			}
		}else{
			var val = $('[sid=\"C_WLRULE_SELCHANNEL\"]').val();
			if(!val)	return false;
			val = parseInt(val.split('.')[0]);
			if(val > 35 && val < 49){
				return true;
			}
		}
	}
	return false;
}

function get_channel_dfs_warning(dwarn)
{
	if(dwarn == '1'){
		var val = $('[sid=\"C_WLRULE_SELCHANNEL\"]').val();
		if(val){
			val = parseInt(val.split('.')[0]);
			if(val >= 52 && val <= 144){
				return true;
			}
		}
		for(var i = 0; i < support_wl_modes.length; i++){
			val = $('[sid=\"C_WLRULE_SELCHANNEL'+(support_wl_modes[i].tag.toUpperCase())+'\"]').val();
			if(val){
				val = parseInt(val.split('.')[0]);
				if(val >= 52 && val <= 144){
					return true;
				}
			}
		}
	}
	return false;
}

function get_channel_data(wlmode)
{
	//$('#loading').popup('open');
	$.ajaxSetup({async : true, timeout : 4000});
	$.getJSON('/cgi/iux_get.cgi', { tmenu : window.tmenu,smenu : window.smenu, act : 'data', category : wlmode, mode : 'channel'})
        .done(function(data){
		if(json_validate(data, '') == true){
			control_channel_arr[wlmode] = new Array();	central_channel_arr[wlmode] = new Array();			
			var chanList = data.channellist;
			if(!chanList)	return;
			
			for(var i = 0; i < chanList.length; i++){
				for(var codeName in chanList[i]){
					var split_arr = codeName.split('_');
					if(split_arr[0] == 'control'){
						control_channel_arr[wlmode][split_arr[1] + '_' + split_arr[2]] = new Array();
						for(var j = 0; j < (chanList[i])[codeName].length; j ++){
							control_channel_arr[wlmode][split_arr[1] + '_' + split_arr[2]][j] 
								= parseInt((chanList[i])[codeName][j].value);
						}
					}
					else{
						central_channel_arr[wlmode][split_arr[1] + '_' + split_arr[2]] = new Array();
						for(var j = 0; j < (chanList[i])[codeName].length; j ++){
							central_channel_arr[wlmode][split_arr[1] + '_' + split_arr[2]][j]
							 	= parseInt((chanList[i])[codeName][j].value);
						}
					}
				}
			}
		}
	})
        .fail(function(jqxhr, textStatus, error) {
		$('#loading').popup('close');
		alert(M_lang['S_DISCONNECTED_MSG']);
        });
}

function get_extendsetup_data()
{
	$.ajaxSetup({async : true, timeout : 4000});
	$.getJSON('/cgi/iux_get.cgi', { tmenu : window.tmenu,smenu : window.smenu, act : 'data', category : current_selected_mode, mode : 'extendsetup'})
        .done(function(data){
		if(json_validate(data, '') == true){
			var ccode = data.countrycode;
			var mlist = data.modelist;
			//var chans = data.channelwidths;
			chans = data.channelwidths;
			var txbfs = data.txbfmumode;
			var muflag = data.muflag;
			var mant = data.mimoant;
			var delchan = false;
			for(var i = 0; i < ccode.length; i++){
				$('[sid=\"C_EXTENDSETUP_COUNTRY\"]').append('<option value=\"'+ccode[i].value+'\">'
					+M_lang['S_LANG'+ccode[i].value+'_STRING']+'</option>');
			}
			for(var i = 0; i < mlist.length; i++){
				$('[sid=\"C_EXTENDSETUP_MODE\"]').append('<option value=\"'+mlist[i].value+'\">'
					+mlist[i].text+'</option>');
				if(config_data.extendsetup.mode == mlist[i].value){
					if(current_selected_mode == '5g' && mlist[i].text.indexOf('ac') == -1)	delchan = true;
					if(current_selected_mode == '5g2' && mlist[i].text.indexOf('ac') == -1)	delchan = true;
					if(current_selected_mode == '2g' && mlist[i].text.indexOf('N') == -1)	delchan = true;

					/*AX must be show all channel width*/
					if((mlist[i].text.indexOf('ax') != -1)){delchan = false;}

				}
			}
			for(var i = 0; i < chans.length; i++){
				if(current_selected_mode == '5g' && delchan && chans[i].text.indexOf('80') != -1){
					config_data.extendsetup.channelwidth = chans[(((i+1) < chans.length)?(i+1):0)].value;	continue;}
				if(current_selected_mode == '5g2' && delchan && chans[i].text.indexOf('80') != -1){
					config_data.extendsetup.channelwidth = chans[(((i+1) < chans.length)?(i+1):0)].value;	continue;}
				if(current_selected_mode == '2g' && delchan && chans[i].text.indexOf('40') != -1){
					config_data.extendsetup.channelwidth = chans[(((i+1) < chans.length)?(i+1):0)].value;	continue;}
				$('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]').append('<option value=\"'+chans[i].value+'\">'
					+((chans[i].value == '0')?M_lang['S_EXTAUTO_STRING']:chans[i].text)+'</option>');
			}
			if(txbfs){
				for(var i = 0; i < txbfs.length; i++){
					$('[sid=\"C_EXTENDSETUP_TXBFMUMODE\"]').append('<option value=\"'+txbfs[i].value+'\">'
						+txbfs[i].text+'</option>');
				}
			}
			if(muflag){
				for(var i = 0; i < muflag.length; i++){
					$('[sid=\"C_EXTENDSETUP_MUFLAG\"]').append('<option value=\"'+muflag[i].value+'\">'
						+muflag[i].text+'</option>');
				}
			}
			if(mant){
				for(var i = 0; i < mant.length; i++){
					$('[sid=\"C_EXTENDSETUP_MIMOANT\"]').append('<option value=\"'+mant[i].value+'\">'
						+mant[i].text+'</option>');
				}
			}
			$('[sid=\"C_EXTENDSETUP_COUNTRY\"]')
				.val(config_data.extendsetup.country)
				.selectmenu('refresh',true);
			$('[sid=\"C_EXTENDSETUP_MODE\"]')
				.val(config_data.extendsetup.mode)
				.selectmenu('refresh',true);
			$('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]')
				.val(config_data.extendsetup.channelwidth)
				.selectmenu('refresh',true);

			var val = config_data.extendsetup.mode;
			$('[sid=\"C_EXTENDSETUP_MODE\"]').attr('value',val).val(val).selectmenu('refresh',true);
			val = config_data.extendsetup.country;
			$('[sid=\"C_EXTENDSETUP_COUNTRY\"]').attr('value',val).val(val).selectmenu('refresh',true);
			val = config_data.extendsetup.channelwidth;
			$('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]').attr('value',val).val(val).selectmenu('refresh',true);
			if(txbfs){
				val = config_data.extendsetup.txbfmumode;
				$('[sid=\"C_EXTENDSETUP_TXBFMUMODE\"]').attr('value',val).val(val).selectmenu('refresh',true);
			}
			if(muflag){
				val = config_data.extendsetup.muflag;
				$('[sid=\"C_EXTENDSETUP_MUFLAG\"]').attr('value',val).val(val).selectmenu('refresh',true);
			}
			if(mant){
				val = config_data.extendsetup.mimoant;
				$('[sid=\"C_EXTENDSETUP_MIMOANT\"]').attr('value',val).val(val).selectmenu('refresh',true);
			}else{
				$('[sid=\"MIMOANT_BOX\"]').remove();
			}
			init_rightpanel_after('extendsetup');

			if(current_selected_mode != '2g'){$('[sid=\"VHT24G_BOX\"]').remove();}
			$('[sid="S_TEMP_TITLE"]').text(get_category_text()+' '+M_lang['S_EXTENDSETUP_STRING']);
			$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
			$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
			locking_obj('S_MODIFY_BTN', 'disabled');
		}
 		setTimeout(function(){$('#loading').popup('close');},500);
	})
        .fail(function(jqxhr, textStatus, error) {
		$('#loading').popup('close');
		alert(M_lang['S_DISCONNECTED_MSG']);
        });
}

//delete unsupported controls
function init_rightpanel_before(ruletype)
{
	if(ruletype == 'wlrule'){
		if(config_data.use_radius == '0'){
			$('[sid=\"ENTERPRISE_BOX\"]').remove();
			$('[sid=\"ENTERPRISECHECK_BOX\"]').remove();
		}
		if(config_data.use_qos == '0'){$('[sid=\"QOS_BOX\"]').remove();}
	}
	else if(ruletype == 'extendsetup'){
		if(config_data.use_dynchannel == '0'){$('[sid=\"DYN_BOX\"]').remove();}
		if(config_data.use_ldpc == '0'){$('[sid=\"LDPC_BOX\"]').remove();}
		if(config_data.use_stbc == '0'){$('[sid=\"STBC_BOX\"]').remove();}
		if(config_data.use_dfs == '0'){$('[sid=\"DFS_BOX\"]').remove();}
		if(config_data.use_phy == '0'){$('[sid=\"PHY_BOX\"]').remove();}
		if(config_data.use_lgtv == '0'){$('[sid=\"WPSNOTI_BOX\"]').remove();}
		if(config_data.use_txbfmumode == '0'){$('[sid=\"TXBFMUMODE_BOX\"]').remove();}
		if(config_data.use_muflag == '0'){$('[sid=\"MUFLAG_BOX\"]').remove();}
		if(config_data.use_mimoant == '0'){$('[sid=\"MIMOANT_BOX\"]').remove();}
		if(config_data.use_wmm == '0'){$('[sid=\"WMM_BOX\"]').remove();}
		if(config_data.use_bndstrg == '0'){$('[sid=\"BNDRUN_BOX\"]').remove();}
		if(config_data.use_vht24g == '0'){$('[sid=\"VHT24G_BOX\"]').remove();}
		if(config_data.use_rts == '0'){$('[sid=\"RTS_BOX\"]').remove();}
	}
}

function append_extendsteup_line(wltag)
{
	var HTMLStr = '';

	HTMLStr += ('<div class=\"lc_extendsetup_div\" sid=\"'+wltag.toUpperCase()+'LINE\">');
	HTMLStr += ('<a href=\"#right_panel\" data-icon=\"false\" id=\"extendsetup_0_'+wltag+'\" sid=\"EXTENDSETUP\">');
	HTMLStr += ('<div class=\"lc_oneline_div\"><div class=\"lc_click_div\">');
	HTMLStr += ('<p sid=\"EXTENDSETUP_STRING\"></p>');
	HTMLStr += ('</div><div class=\"lc_right_click_div\">');
	HTMLStr += ('<p class=\"lc_line_centerside\"><img src=\"/common/images/icon_list_run.png\"></p>');
	HTMLStr += ('</div></div></a></div>');

	$('#etc_listbox').append(HTMLStr).trigger('create');
}

function append_wps_line(wltag)
{
	var HTMLStr = '';

	HTMLStr += ('<div class=\"lc_wpssetup_div\" sid=\"'+wltag.toUpperCase()+'LINE\">');
	HTMLStr += ('<div class=\"lc_oneline_div\"><div class=\"lc_wpsbtn_leftdiv\"><div>');
	HTMLStr += ('<button type=\"button\" sid=\"S_WPS_BTN'+wltag.toUpperCase()+'\" class=\"custom_css_button lc_wpsbtn\" data-role=\"none\">');
	HTMLStr += ('<span sid=\"WPSBTNTEXT_CONTENT\"></span>');
	HTMLStr += ('</button></div></div><div class=\"lc_wpsbtn_rightdiv\">');
	HTMLStr += ('<span sid=\"WPSTEXT_CONTENT\" class=\"lc_wpstext\"></span>');
	HTMLStr += ('</div></div></div>');

	$('#etc_listbox').append(HTMLStr).trigger('create');
}

function append_bndstrg_explain_line(wltag)
{
	var HTMLStr = '';

	HTMLStr += ('<div class=\"lc_row\">');
	HTMLStr += ('<div class=\"lc_right\">');
	HTMLStr += ('<p>'+M_lang['S_BNDSTRG_EXPLAIN_1']+'</p>');
	HTMLStr += ('</div>');
	HTMLStr += ('<div class=\"lc_right\">');
	HTMLStr += ('<p>'+(get_wl_postfix_by_tag(wltag))+M_lang['S_BNDSTRG_EXPLAIN_2']+'</p>');
	HTMLStr += ('</div>');
	HTMLStr += ('<div class=\"lc_right\">');
	HTMLStr += ('<p>'+M_lang['S_BNDSTRG_EXPLAIN_3']+'</p>');
	HTMLStr += ('</div>');
	HTMLStr += ('</div>');

	$('#right_main').append(HTMLStr).trigger('create');
}

function append_bndstrg_channel_line(wltag)
{
	var HTMLStr = '';

	HTMLStr += ('<div class=\"lc_row\">');
	HTMLStr += ('<div class=\"lc_left lc_panel_left\">');
	HTMLStr += ('<p>' + (wl_tag_to_full_ghz_text(wltag) + ' ') + M_lang['S_CHANNEL_STRING'] + '</p>');
	//HTMLStr += ('<p>' + (get_wl_postfix_by_tag(wltag)) + 'GHz' + M_lang['S_CHANNEL_STRING'] + '</p>');
	HTMLStr += ('</div>');
	HTMLStr += ('<div class=\"lc_right lc_panel_right\">');
	HTMLStr += ('<div class=\"ui-alt-icon ui-nodisc-icon lc_selectbox\">');
	HTMLStr += ('<select name=\"selchannel'+wltag+'\" sid=\"C_WLRULE_SELCHANNEL'+wltag.toUpperCase()+'\" type=\"select\"></select></div>');
	HTMLStr += ('</div></div>');

	$('[sid=\"CHANNEL_BOX_BANDSTEERING\"]').append(HTMLStr).trigger('create');
}
//view updates
function init_rightpanel_after(ruletype)
{
	if(ruletype == 'wlrule'){
		set_authview_by_personallist(ruletype, config_data.wlrule.personallist);
		set_authview_by_useenterprise(ruletype);
		set_initcheck_passview(ruletype);
	}
	else if(ruletype == 'extendsetup'){
		set_dyninput_by_slider(ruletype, config_data.extendsetup.dynchannel);
		$("#extendsetup div .lc_row:even").css("background-color","#FFFFFF");
		$("#extendsetup div .lc_row:odd").css("background-color","#FFFFFF");
	}
}
function sort_bsslist(wl_tag)
{
	for(var j = 0; j < config_data['bsslist_'+wl_tag].length; j++){
		if(!config_data['bsslist_'+wl_tag][j].run)	continue;
		if(config_data['bsslist_'+wl_tag][j].ismain == '0'){
			if(config_data['bsslist_'+wl_tag][j].uiidx != (''+j)){
				var tmpObj = config_data['bsslist_'+wl_tag][j];
				config_data['bsslist_'+wl_tag][j] = config_data['bsslist_'+wl_tag][parseInt(tmpObj.uiidx)];
				config_data['bsslist_'+wl_tag][parseInt(tmpObj.uiidx)] = tmpObj;	tmpObj = null;
			}
		}
	}
}

function process_main_wlrule_line(wl_tag, bkidx)
{
	sort_bsslist(wl_tag);

	var bndstrg_mode = false;
	if(bndstrg_run && config_data['bsslist_'+wl_tag][0].bndstrg == '1'){
		config_data['bsslist_'+wl_tag][0].run = '1';
		bndstrg_mode = true;
	}
	append_main_line('wlrule',0,config_data['bsslist_'+wl_tag][0].run,
		(config_data['bsslist_'+wl_tag][0].personallist=='nouse' && config_data['bsslist_'+wl_tag][0].useenterprise=='0'), wl_tag, bkidx
		, bndstrg_mode);
	update_bssid_line('wlrule_'+0+'_' + wl_tag, config_data['bsslist_'+wl_tag][0]);
}

function process_guest_wlrule_line(wl_tag, bkidx)
{
	for(var j = 1; j < config_data['bsslist_'+wl_tag].length; j++,bkidx++){
		if(!config_data['bsslist_'+wl_tag][j].run){bkidx--;	continue;}
		append_main_line('wlrule',j,config_data['bsslist_'+wl_tag][j].run,
			(config_data['bsslist_'+wl_tag][j].personallist=='nouse' && config_data['bsslist_'+wl_tag][j].useenterprise=='0')
			, wl_tag, bkidx);
		update_bssid_line('wlrule_'+j+'_'+wl_tag, config_data['bsslist_'+wl_tag][j]);
	}

	return bkidx;
}

function process_extendsetup_line(wl_tag, postfix)
{
	$('[sid=\"'+wl_tag.toUpperCase()+'LINE\"] [sid=\"EXTENDSETUP_STRING\"]')
		.text(wl_tag_to_full_ghz_text(wl_tag) + ' ' + M_lang['S_EXTENDSETUP_STRING']);
		//.text(postfix+' GHz ' + M_lang['S_EXTENDSETUP_STRING']);
}

function process_wps_line(wl_tag, postfix)
{
	append_wps_line(wl_tag);
	$('[sid=\"'+wl_tag.toUpperCase()+'LINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]')
		.text(/*wl_tag_to_full_ghz_text(wl_tag) +*/ ' ' + M_lang['S_WPSCONNECT_STRING']);
		//.text(postfix+'GHz ' + M_lang['S_WPSCONNECT_STRING']);
	$('[sid=\"'+wl_tag.toUpperCase()+'LINE\"] [sid=\"WPSTEXT_CONTENT\"]').text('');

	if(config_data['bsslist_'+wl_tag][0].run == '0'){
		wps_btn_stats[wl_tag] = false;
		locking_obj('S_WPS_BTN' + wl_tag.toUpperCase(), 'disabled');
	}
	else{					
		if(config_data['extendsetup'+wl_tag].wpsmode && config_data['extendsetup'+wl_tag].wpsmode == 'off'){
			wps_btn_stats[wl_tag] = false;
			locking_obj('S_WPS_BTN'+wl_tag.toUpperCase(), 'disabled');
		}
		else{
			wps_btn_stats[wl_tag] = true;
			unlocking_obj('S_WPS_BTN'+wl_tag.toUpperCase(), 'disabled');
		}
	}
}

function process_wl_status(wl_tag)
{
	if(status_data && status_data['wps'+wl_tag]){
		if(!status_data['remaintime'+wl_tag])	return;
		if(status_data['wps'+wl_tag].status == 'WPS_STOP'){wps_modes[wl_tag] = WPS_STOP;}
		else if(status_data['wps'+wl_tag].status == 'WPS_START' || status_data['wps'+wl_tag].status == 'WPS_PROCESSING')
			{wps_modes[wl_tag] = WPS_START;}
		else if(status_data['wps'+wl_tag].status == 'WPS_CONFIGURED'){wps_modes[wl_tag] = WPS_CONFIGURED;}
		else{wps_modes[wl_tag] = WPS_STOP;}
		update_bssid_line('wlrule_0_'+wl_tag, null, 'D');
	}
}
//local utility functions end

//local functions start
iux_update_local_func['wlmain'] = function(identifier)
{
	if(identifier == 'C'){
		if(config_data.support_wl_list){support_wl_modes = config_data.support_wl_list;}
		if(config_data.bndstrg_info){bndstrg_info = config_data.bndstrg_info;}
		if(config_data.use_bndstrg == '1'){bndstrg_run = (config_data['bsslist_'+bndstrg_info[0].tag][0].run == '1');}
		if(config_data.use_wep == '1'){use_wep = true;}

		$('[sid="LISTDATA"]').remove();
		var bkidx = 0;
		
		/*list up rules*/
		for(var i = 0; i < support_wl_modes.length; i++){
			get_channel_data(support_wl_modes[i].tag);
			process_main_wlrule_line((support_wl_modes[i].tag), bkidx++);
			if(bndstrg_run)
				locking_obj('WLRULE0_RUN_'+support_wl_modes[i].tag, 'disabled');
		}

		if(config_data.use_bndstrg == '1'){
			if(bndstrg_run)
				process_main_wlrule_line((bndstrg_info[0].tag), bkidx++);
		}

		var HTMLStr = ('<div sid=\"LISTDATA\" class=\"title_div lc_oneline_div '+('lc_greenbox_div')+'\">');
		HTMLStr += ('<div class=\"lc_click_div\"><p sid=\"S_SELECT_GUESTNETWORK\">'+M_lang["S_SELECT_GUESTNETWORK"]+'</p></div>');
		HTMLStr += ('<div class=\"lc_right_click_div\"><p class=\"open_div\" sid=\"S_GUESTNET_OPEN\">'+(M_lang[(opened)?'S_GUESTNET_CLOSE':'S_GUESTNET_OPEN'])+'</p><p class=\"lc_line_centerside\">');
		HTMLStr += ('<img src=\"images/menu_list_'+((opened)?'opened':'closed')+'.png\" name=\"title_state\"></p></div>');
		HTMLStr += ('</div');
		$('#wl_listbox').append(HTMLStr).trigger('create');

		for(var i = 0; i < support_wl_modes.length; i++){
			if(!bndstrg_run)
				bkidx = process_guest_wlrule_line((support_wl_modes[i].tag), bkidx);
		}
		if(config_data.use_bndstrg == '1' && bndstrg_run){
			bkidx = process_guest_wlrule_line((bndstrg_info[0].tag), bkidx);
		}
		for(var i = 0; i < support_wl_modes.length; i++){
			$('[sid=\"'+support_wl_modes[i].tag.toUpperCase()+'LINE\"]').remove();
		}
		if(config_data.use_bndstrg == '1'){
			$('[sid=\"'+bndstrg_info[0].tag.toUpperCase()+'LINE\"]').remove();
		}

		for(var i = 0; i < support_wl_modes.length; i++){
			append_extendsteup_line(support_wl_modes[i].tag);
			process_extendsetup_line(support_wl_modes[i].tag, support_wl_modes[i].postfix);
			if(!bndstrg_run)
				process_wps_line(support_wl_modes[i].tag, support_wl_modes[i].postfix);
		}
		if(config_data.use_bndstrg == '1' && bndstrg_run){
			process_wps_line(bndstrg_info[0].tag, bndstrg_info[0].postfix);
		}
	}
	else if(identifier == 'D'){
		for(var i = 0; i < support_wl_modes.length; i++){
			process_wl_status(support_wl_modes[i].tag);
		}
		if(config_data.use_bndstrg == '1'){
			process_wl_status(bndstrg_info[0].tag);
		}
	}
};

add_listener_local_func['wlmain'] = function(idval)
{
	wlrule_onoff_event_add();
	wps_button_event_add();
}

iux_update_local_func['wlrule'] = function(identifier)
{
	if(identifier == 'C'){
		// unsupported wpa3
		if(config_data.wlrule.use_wpa3 == 0) {
			$('[sid=\"C_WLRULE_PERSONALLIST\"]').children('option[value=\"wpa3saewpa2psk_aes\"]').remove();
			$('[sid=\"C_WLRULE_PERSONALLIST\"]').children('option[value=\"wpa3sae_aes\"]').remove();
		}

		if(bndstrg_info && bndstrg_info[0].tag == current_selected_mode){
			locking_obj('C_WLRULE_SELCHANNEL','disabled');
			$('[sid=\"CHANNEL_BOX\"]').css('display','none');
			$('[sid=\"CHANNEL_BOX_BANDSTEERING\"] div').remove();
			if(config_data.wlrule.ismain == '1'){
				for(var i = 0; i < support_wl_modes.length; i++){
					append_bndstrg_channel_line(support_wl_modes[i].tag);
					tmp_config_data['bsslist_'+support_wl_modes[i].tag][0].selchannel = update_channel_options('wlrule'
						, tmp_config_data['bsslist_'+support_wl_modes[i].tag][0].country
						, tmp_config_data['bsslist_'+support_wl_modes[i].tag][0].bandwidth
						, tmp_config_data['bsslist_'+support_wl_modes[i].tag][0].channel
						, tmp_config_data['bsslist_'+support_wl_modes[i].tag][0].autochannel, support_wl_modes[i].tag);
			config_data.wlrule['selchannel'+support_wl_modes[i].tag] = tmp_config_data['bsslist_'+support_wl_modes[i].tag][0].selchannel;
					if(tmp_config_data['bsslist_'+support_wl_modes[i].tag][0].chandisable == '1'){
						locking_obj(('C_WLRULE_SELCHANNEL'+(support_wl_modes[i].tag.toUpperCase())),'disabled');
					}
				}
			}

		}else{
			$('[sid=\"CHANNEL_BOX_BANDSTEERING\"]').css('display','none');
			config_data.wlrule.selchannel = update_channel_options('wlrule', config_data.wlrule.country, config_data.wlrule.bandwidth
				, config_data.wlrule.channel, config_data.wlrule.autochannel);
			if(config_data.wlrule.chandisable == '1'){
				locking_obj('C_WLRULE_SELCHANNEL','disabled');
				locking_obj('L_CHANSEARCH_BTN','disabled');
			}
		}

 		setTimeout(function(){$('#loading').popup('close');},500);

		if(config_data.wlrule.ismain == '1'){
			$('[sid="S_TEMP_TITLE"]').text(get_category_text() + ' ' + M_lang['S_DEFAULT_WIRELESS']);
			$('[sid=\"QOS_BOX\"]').css('display','none');
			locking_obj('C_WLRULE_QOSENABLE','disabled');
			$('[sid=\"POLICY_BOX\"]').css('display','none');
			locking_obj('C_WLRULE_MBSSPOLICY','disabled');
		}else{
			locking_obj('C_WLRULE_SELCHANNEL','disabled');
			$('[sid=\"CHANNEL_BOX\"]').css('display','none');
			$('[sid="S_TEMP_TITLE"]').text(get_category_text() + ' ' + M_lang['S_SUB_WIRELESS'] + ' ' + config_data.wlrule.uiidx);
			$('[sid=\"QOS_BOX\"]').css('display','');
			$('[sid=\"POLICY_BOX\"]').css('display','');
		}
		if(config_data.wlrule.radiusport == '1812')
			$('[sid=\"L_WLRULE_RADIUSPORTCHECK\"]').removeAttr('checked').checkboxradio('refresh');
		else
			$('[sid=\"L_WLRULE_RADIUSPORTCHECK\"]').prop('checked', 'checked').checkboxradio('refresh');

		if(tmp_config_data.use_bndstrg == '1' && bndstrg_run){
			if(current_selected_mode != bndstrg_info[0].tag){
				$('#right_main div').remove();
				$('#right_footer div').remove();
				append_bndstrg_explain_line(current_selected_mode);
			}
		}
		$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
		$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
		init_rightpanel_after('wlrule');

		locking_obj('S_MODIFY_BTN', 'disabled');
	}
}

add_listener_local_func['wlrule'] = function(idval)
{
	basic_control_event_add('wlrule',idval);
}

submit_local_func['wlrule'] = function(localdata)
{
	if(!wlrule_validate('wlrule'))	return;
	if(!localdata){
		localdata = make_local_postdata('wlrule');
	}
	if(should_confirm_submit()) {
		confirm_mode = 'wlrule';	confirm_data = localdata;
		confirm_stack = null;
		confirm(M_lang[((config_data.wlrule.ismain == '1')?'S_DISCONNECTCONFIRM_STRING':'S_DISCONNECTCONFIRM2_STRING')]);	return;
	}
	if(config_data.wlrule.ismain == '1' 
		&& get_channel_regulation_warning(config_data.wlrule)){
		confirm_mode = 'wlrule';	confirm_data = localdata;
		confirm_stack = null;
		confirm(M_lang['S_REGULATION_WARNING']);	return;
	}
	if(config_data.wlrule.ismain == '1' 
		&& get_channel_dfs_warning(config_data.wlrule.dfswarning)){
		confirm_mode = 'wlrule';	confirm_data = localdata;
		confirm_stack = null;
		confirm(M_lang['S_DFS_WARNING']);	return;
	}
	$('#loading').popup('open');
	iux_submit('wlrule',localdata, true);
}

iux_update_local_func['extendsetup'] = function(identifier)
{
	if(identifier == 'C'){
		get_extendsetup_data();
	}
}

add_listener_local_func['extendsetup'] = function(idval)
{
	basic_control_event_add('extendsetup',idval);
}

submit_local_func['extendsetup'] = function(localdata)
{
	if(!localdata){
		localdata = make_local_postdata('extendsetup');
	}
	if(!extendsetup_validate(localdata))	return;
	$('#loading').popup('open');
	iux_submit('extendsetup',localdata, true);
}
//local functions end
$(document).on("panelbeforeclose", "#right_panel", function(){
	if(tmp_config_data){config_data = tmp_config_data;	tmp_config_data = null;}
});

$(document).ready(function() {
	window.tmenu = "wirelessconf";
	window.smenu = "basicsetup";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, 60000, true);
	events.off("panelbeforeopen");
	events.off('load_header_ended_local');
	events.on('load_header_ended_local', function(menuname){
		iux_update("C");	iux_update("S");
		if(!is_loading_panel)
 			setTimeout(function(){$('#loading').popup('close');},500);
	});
});

function get_status_local()
{
        $.ajaxSetup({async : true, timeout : 4000});
        var _data = [];
        _data.push({name : "tmenu", value : window.tmenu});
        _data.push({name : "smenu", value : window.smenu});
        _data.push({name : "act", value : "status"});
        $.getJSON('/cgi/iux_get.cgi', _data)
        .done(function(data) {
                if(json_validate(data, '') == true)
                        status_data = data;
                iux_update("D");
        })
        .fail(function(jqxhr, textStatus, error) {
        }).always(function(){
 		setTimeout(function(){get_status_local();},1000);
	});
}

function iux_set_onclick_local()
{
	$('[sid="LISTDATA"] [href=\"#right_panel\"]').each(function(){
		var idval = $(this).attr('id');
		$(this).unbind('click').on('click', function(){
			if(tmp_config_data){return;}
			$('#loading').popup('open');
			load_rightpanel(idval);
		});
	});
	$('[sid="LISTDATA"]').on("mousedown touchstart", function() {
		current_selected_mode = get_rulemode($(this).attr('id'));
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	$('[sid="EXTENDSETUP"]').each(function(){
		var idval = $(this).attr('id');
		if(error_code_local != 0 && error_code_local != 6){$(this).attr('href','#');}
		else{$(this).attr('href','#right_panel');}
		$(this).unbind('click').on('click', function(){
			if(error_code_local != 0 && error_code_local != 6){	alert(M_lang['S_ERRORMSG_STRING'+error_code_local]);}
			else{
				$('#loading').popup('open');
				load_rightpanel(idval);
			}
		});
	}).on("mousedown touchstart", function() {
		current_selected_mode = get_rulemode($(this).attr('id'));
		$(this).parent().addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});

	$(".title_div").unbind('click').on("click", function()
        {
                $('.hide, .show').toggleClass( "hide" ).toggleClass( "show" );
                toggleImage( $(this).find("img[name='title_state']"));
		for(var i = 0; i < support_wl_modes.length; i++){
			var wl_tag = support_wl_modes[i].tag;

			if(!opened){
				$('[sid="S_GUESTNET_OPEN"]').text(M_lang["S_GUESTNET_OPEN"]);	
				$('.title_div').css('border-bottom', '3px solid #EEF1E6');
			}else{	
				$('[sid="S_GUESTNET_OPEN"]').text(M_lang["S_GUESTNET_CLOSE"]);		
				$('.title_div').css('border-bottom', 'none');
			}		

		}
        });
}

function iux_update_local(identifier)
{
	if(!identifier || identifier == 'D'){	//list update
		if(!identifier){
			iux_update_local_func['wlmain'].call(this, 'C');	listener_add_local('wlmain', null);
			iux_set_onclick_local();
		}else{
			iux_update_local_func['wlmain'].call(this, identifier);
		}
	}
	else{
		if(identifier == 'C'){
			for(var articleName in config_data){
				if(config_data.hasOwnProperty(articleName) && articleName != ''){
					var caller_func = iux_update_local_func[articleName];
					if(caller_func){
						caller_func.call(this, identifier);
					}
				}
			}
		}
	}
}

function listener_add_local(ruletype, idval)
{
	add_listener_local_func[ruletype].call(this, idval);
}

function submit_local(rule_type, localdata, checking)
{
	submit_local_func[rule_type].call(this, localdata);
}

function load_rightpanel(_idvalue)
{
	var ruletype = get_ruletype(_idvalue);
	current_selected_mode = get_rulemode(_idvalue);
	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load(
		'html/'+ruletype+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');
				init_rightpanel_before(ruletype);
				tmp_config_data = config_data;
				config_data = get_localConfigObj(_idvalue);
				is_loading_panel = is_loading_need_menu(_idvalue);
				load_header(RIGHT_HEADER, 'TEMP');
				listener_add_local(ruletype, _idvalue);
			}
		}
	);
}

