<script>
var focus_obj = null;
var autodetect_timer = -1;
var status_running = true;

function ElementsControl(name, type)
{
	var objs = document.getElementsByName(name);
	if(objs && objs.length != 0){
		for(var i = 0; i < objs.length; i++){
			if(type == 'view')	objs[i].style.display = '';
			else			objs[i].style.display = 'none';
		}
	}else{	/*for IE 8 lower*/
		for(var i = 0; (objs = document.getElementById(name+(i+1))) ; i++){
			if(type == 'view')	objs.style.display = '';
			else			objs.style.display = 'none';
		}
	}
}

function update_dhcp_macbox(org, myaddr, myobj)
{
	var obj,i;
	if(org && (org.indexOf(':') != -1 || org.indexOf('-') != -1)){
		if(org.indexOf(':') != -1)	org = org.split(':');
		else				org = org.split('-');
	}else{
		org = [];
		for(i = 0; i < 6; i ++){org[i] = '';}
	}
	if(myaddr && (myaddr.indexOf(':') != -1 || myaddr.indexOf('-') != -1)){
		if(myaddr.indexOf(':') != -1)	myaddr = myaddr.split(':');
		else				myaddr = myaddr.split('-');
	}else{
		myaddr = [];
		for(i = 0; i < 6; i ++){myaddr[i] = '';}
	}
	if(myobj.checked){
		for(i = 1; i <= 6; i ++){
			obj = document.getElementsByName('hw_addr'+i)[0];
			if(obj)obj.value = myaddr[i-1];
		}
	}else{
		for(i = 1; i <= 6; i ++){
			obj = document.getElementsByName('hw_addr'+i)[0];
			if(obj)obj.value = org[i-1];
		}
	}
}

function is_branch_menu(menu_name)
{
	if(menu_name == 'netadvance')	return true;
	else				return false;
}

function check_passview(my, target, all)
{
	function _do_action(my, target){
		if(my.checked){
			var newtarget = document.getElementsByName(target.name + '_text')[0];
			newtarget.value = target.value;
			HideObj(target);
			ShowObj(newtarget);
		}else{
			var newtarget = document.getElementsByName(target.name + '_text')[0];
			target.value = newtarget.value;
			HideObj(newtarget);
			ShowObj(target);
		}
	}

	if(all == 'wireless'){
		var obj;
		for(var i = 0 ; i < support_wl_tags.length; i++){
			obj = document.getElementById('chk_'+ support_wl_tags[i].tag);
			if(obj){
				if(obj.checked){
					_do_action(my, document.getElementsByName('wlpw_'+ support_wl_tags[i].tag)[0]);
					document.getElementById('view_'+ support_wl_tags[i].tag).checked = my.checked;
				}
				else
					_do_action(document.getElementById('view_'+ support_wl_tags[i].tag), document.getElementsByName('wlpw_'+ support_wl_tags[i].tag)[0]);
			}else{
				_do_action(my, target);
			}
		}
	}else{
		_do_action(my, target);
	}
}

function set_title_text(step)
{
	for(var i = 0; i < max_wizard_orders; i++){
		if(wizard_orders[i].step == step){
			if(is_branch_menu(wizard_orders[i].menu)){
				var val = GetRadioValue(document.wizard_main_form.conntype);
				switch(val){
				case 'dynamic':
					document.getElementById('menu_titlebar').innerHTML = WIZARD_DHCP_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
					break;
				case 'pppoe':
					document.getElementById('menu_titlebar').innerHTML = WIZARD_PPPOE_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
					break;
				case 'static':
					document.getElementById('menu_titlebar').innerHTML = WIZARD_STATIC_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
					break;
				}
			}else{
				document.getElementById('menu_titlebar').innerHTML = wizard_orders[i].text;
			}
		}
	}
}

function update_wizard_wl_input(nm, origin)
{
	for(var i = 0 ; i < support_wl_tags.length; i++){
		if(support_wl_tags[i].tag == origin){
			if(nm == 'wlpw'){
				if(document.getElementById('view_'+ support_wl_tags[i].tag).checked){
					document.getElementsByName(nm + '_'+support_wl_tags[i].tag)[0].value =
						document.getElementsByName(nm + '_' + support_wl_tags[i].tag + '_text')[0].value;
				}else{
					document.getElementsByName(nm + '_'+support_wl_tags[i].tag + '_text')[0].value =
						document.getElementsByName(nm + '_' + support_wl_tags[i].tag)[0].value;
				}
			}
			continue;
		}
		if(document.getElementById('chk_'+ support_wl_tags[i].tag).checked){
			document.getElementsByName(nm + '_'+support_wl_tags[i].tag)[0].value = 
				document.getElementsByName(nm + '_' + origin)[0].value;
			if(nm == 'wlpw'){
				document.getElementsByName(nm + '_'+support_wl_tags[i].tag + '_text')[0].value = 
					document.getElementsByName(nm + '_' + origin + '_text')[0].value;
			}else{
				document.getElementsByName(nm + '_'+support_wl_tags[i].tag)[0].value += support_wl_tags[i].addtxt;
			}
		}
	}
}

function update_wizard_wl_copy(chkobj, origin, copied, addtxt)
{
	if(chkobj.checked){
		DisableObj(document.getElementsByName('ssid_'+copied)[0]);
		document.getElementsByName('ssid_'+copied)[0].value = document.getElementsByName('ssid_'+origin)[0].value + addtxt;
		DisableObj(document.getElementsByName('wlpw_'+copied)[0]);
		document.getElementsByName('wlpw_'+copied)[0].value = document.getElementsByName('wlpw_'+origin)[0].value;
		DisableObj(document.getElementsByName('wlpw_'+copied + '_text')[0]);
		document.getElementsByName('wlpw_'+copied + '_text')[0].value = document.getElementsByName('wlpw_'+origin + '_text')[0].value;
		DisableObj(document.getElementById('view_'+copied));
	}else{
		EnableObj(document.getElementsByName('ssid_'+copied)[0]);
		EnableObj(document.getElementsByName('wlpw_'+copied)[0]);
		EnableObj(document.getElementsByName('wlpw_'+copied + '_text')[0]);
		EnableObj(document.getElementById('view_'+copied));
	}
}

function update_navi_title(step)
{
	for(var i = 0; i < max_wizard_orders; i++){
		document.getElementById('wizard_'+wizard_orders[i].step+'_text_black').style.display = '';
		document.getElementById('wizard_'+wizard_orders[i].step+'_text_white').style.display = 'none';
		document.getElementById('wizard_'+wizard_orders[i].step+'_image_black').style.display = '';
		document.getElementById('wizard_'+wizard_orders[i].step+'_image_white').style.display = 'none';
		document.getElementById('wizard_'+wizard_orders[i].menu+'_black').style.display = '';
		document.getElementById('wizard_'+wizard_orders[i].menu+'_white').style.display = 'none';
		if((parseInt(wizard_orders[i].step.substr('step'.length,1))) > 1){
			document.getElementById('wizard_'+wizard_orders[i].step+'_dot_black').style.display = '';
			document.getElementById('wizard_'+wizard_orders[i].step+'_dot_white').style.display = 'none';
		}
		if(wizard_orders[i].step == step){
			if(is_branch_menu(wizard_orders[i].menu)){
				var val = GetRadioValue(document.wizard_main_form.conntype);
				switch(val){
					case 'dynamic':
						document.getElementById('wizard_'+step+'_text_black').innerHTML = WIZARD_DHCP_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
						document.getElementById('wizard_'+step+'_text_white').innerHTML = WIZARD_DHCP_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
						break;
					case 'pppoe':
						document.getElementById('wizard_'+step+'_text_black').innerHTML = WIZARD_PPPOE_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
						document.getElementById('wizard_'+step+'_text_white').innerHTML = WIZARD_PPPOE_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
						break;
					case 'static':
						document.getElementById('wizard_'+step+'_text_black').innerHTML = WIZARD_STATIC_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
						document.getElementById('wizard_'+step+'_text_white').innerHTML = WIZARD_STATIC_TITLE_TEXT + ' ' + WIZARD_SETUP_TEXT;
						break;
				}
			}
			for(var j = i+1; j < max_wizard_orders ; j++){
				document.getElementById('wizard_'+wizard_orders[j].step+'_text_black').style.display = 'none';
				document.getElementById('wizard_'+wizard_orders[j].step+'_text_white').style.display = '';
				document.getElementById('wizard_'+wizard_orders[j].step+'_image_black').style.display = 'none';
				document.getElementById('wizard_'+wizard_orders[j].step+'_image_white').style.display = '';
				document.getElementById('wizard_'+wizard_orders[j].menu+'_black').style.display = 'none';
				document.getElementById('wizard_'+wizard_orders[j].menu+'_white').style.display = '';
				if((parseInt(wizard_orders[j].step.substr('step'.length,1))) > 1){
					document.getElementById('wizard_'+wizard_orders[j].step+'_dot_black').style.display = 'none';
					document.getElementById('wizard_'+wizard_orders[j].step+'_dot_white').style.display = '';
				}
			}
			return;
		}
	}
}

function click_act_button(action, extra)
{
	var regExp_hex = /[0-9a-fA-F]{64}/;
	var regExp_adminid = /^[0-9a-zA-Z]{1,32}$/;

	function get_cur_page()
	{
		return document.wizard_main_form.cur_step.value;
	}
	
	function get_branch_text(context_name)
	{
		var F = document.wizard_main_form;

		if(context_name == 'conntype')
			return GetRadioValue(F.conntype);
		else
			return '';
	}

	function get_page_name(step)
	{
		for(var i = 0; i < max_wizard_orders; i++){
			if(wizard_orders[i].step == step)	return wizard_orders[i].menu;
		}
		return '';
	}

	function get_special_page(menu_name, extra)
	{
		for(var i = 0; i < max_wizard_orders; i++){
			if(wizard_orders[i].menu == menu_name){
				if(extra){
					return (wizard_orders[i].step + '_' + extra);
				}else{
					return wizard_orders[i].step;
				}
			}
		}
		return '';
	}

	function get_next_page()
	{
		var cur_page = get_cur_page();
		var next_page = ('step' + (parseInt(cur_page.substr('step'.length,1))+1));

		if(is_branch_menu(get_page_name(next_page)))
		{
			next_page += ('_' + get_branch_text('conntype'));
		}

		return next_page;
	}

	function get_prev_page()
	{
		var cur_page = get_cur_page();
		var prev_page = ('step' + (parseInt(cur_page.substr('step'.length,1))-1));

		if(is_branch_menu(get_page_name(prev_page)))
		{
			prev_page += ('_' + get_branch_text('conntype'));
		}

		return prev_page;
	}

	function get_netadvance_innertext()
	{
		var val = GetRadioValue(document.wizard_main_form.conntype);
		var obj = '';
		switch(val){
			case 'dynamic':	obj = WIZARD_DHCP_TITLE_TEXT;		break;
			case 'pppoe':	obj = WIZARD_PPPOE_TITLE_TEXT;		break;
			case 'static':	obj = WIZARD_STATIC_TITLE_TEXT;		break;
		}

		return obj;
	}

	function update_confirm_page()
	{
		var F = document.wizard_main_form;
		var obj, step_num, step_name;

		for(var i = 0; i < max_wizard_orders; i++){
			step_num = (parseInt(wizard_orders[i].step.substr('step'.length,1)));
			step_name = wizard_orders[i].menu;

			switch(step_name){
				case 'timezone':
				obj = document.getElementById('result1');
				obj.innerHTML = F.gmtidx.options[F.gmtidx.selectedIndex].text;
				break;
				case 'netsetup':
				obj = document.getElementById('result2');
				obj.innerHTML = get_netadvance_innertext();
				break;
				case 'wireless':
				for(var j = 0 ; j < support_wl_tags.length; j++){
					obj = document.getElementById('rssid'+step_num+'_'+support_wl_tags[j].tag);
					obj.innerHTML = document.getElementsByName('ssid_'+support_wl_tags[j].tag)[0].value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
					obj = document.getElementById('rwlpw'+step_num+'_'+support_wl_tags[j].tag);
					obj.innerHTML = document.getElementsByName('wlpw_'+support_wl_tags[j].tag)[0].value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
				}
				break;
				case 'admin':
				obj = document.getElementById('ruserid'+step_num);
				obj.innerHTML = F.adminid.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
				obj = document.getElementById('ruserpw'+step_num);
				obj.innerHTML = F.adminpw.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
				break;
			}
		}
	}

	function process_cur_step(step)
	{
		var origin_step, ext_step;
		if(step.indexOf('_') != -1){origin_step = step.split('_')[0]; ext_step = step.split('_')[1];}
		else{origin_step = step; ext_step = '';}
		var page_name = get_page_name(origin_step);
		switch(page_name)
		{
			case 'netsetup':
				if(document.wizard_main_form.wan_exist && document.wizard_main_form.wan_exist.value == '0'){
					DisableObj(document.getElementById('netsetup_next'));
					DisableObj(document.getElementById('netsetup_prev'));
					EnableObj(document.getElementById('netsetup_reboot'));
					document.getElementById('wizard_auto_black').style.display = 'none';
					document.getElementById('wizard_auto_white').style.display = '';
				}else{
					EnableObj(document.getElementById('netsetup_next'));
					EnableObj(document.getElementById('netsetup_prev'));
					DisableObj(document.getElementById('netsetup_reboot'));
					document.getElementById('wizard_auto_black').style.display = '';
					document.getElementById('wizard_auto_white').style.display = 'none';
				}
				if(document.wizard_main_form.use_special_act && document.wizard_main_form.use_special_act.value == '1'){
					click_act_button('autodetect');
				}
				break;
			case 'confirm':
				if(document.wizard_main_form.captcha_code){
					document.wizard_main_form.captcha_code.value = '';
					BlurCaptcha(document.wizard_main_form);
					iframe_captcha.location.reload();
				}
				break;
		}
	}

	function set_cur_page(val)
	{
		document.wizard_main_form.cur_step.value = val;
		if(val.indexOf('_') != -1)	val = val.split('_')[0];
		update_navi_title(val);
		set_title_text(val);
		process_cur_step(document.wizard_main_form.cur_step.value);
	}

	function copy_all_value_to_setup_iframe(ifrname, frmname)
	{
		var ifr = document[ifrname] || document.getElementsByName(ifrname)[0];
		var idoc = ifr.document || ifr.contentWindow.document;
		var F = idoc[frmname];
		if(!F)	idoc.getElementsByName(frmname)[0];

		var step_name, step_num;
		var i, j;
		for(i = 0; i < max_wizard_orders; i++){
			step_num = (parseInt(wizard_orders[i].step.substr('step'.length,1)));
			step_name = wizard_orders[i].menu;

			switch(step_name){
				case 'timezone':
					F.gmtidx.value = document.wizard_main_form.gmtidx.value;
					F.summer_flag.value = ((document.wizard_main_form.summer_flag.checked)?1:0);
				break;
				case 'netsetup':
					if(document.wizard_main_form.wan_if)
						F.wan_if.value = GetRadioValue(document.wizard_main_form.wan_if);
					F.conntype.value = GetRadioValue(document.wizard_main_form.conntype);
				break;
				case 'netadvance':
					if(F.conntype.value == 'dynamic'){
						F.mclone.value = GetRadioValue(document.wizard_main_form.mclone);
						if(F.mclone.value == 'using'){
							for(j = 0; j < 6; j++){
					idoc.getElementsByName('hw_addr'+(j+1))[0].value = document.getElementsByName('hw_addr'+(j+1))[0].value;
							}
						}
					}else if(F.conntype.value == 'pppoe'){
						F.userid.value = document.wizard_main_form.userid.value;
						F.passwd.value = document.wizard_main_form.passwd.value;
					}else if(F.conntype.value == 'static'){
						for(j = 0; j < 4; j++){
					idoc.getElementsByName('extip'+(j+1))[0].value = document.getElementsByName('extip'+(j+1))[0].value;
					idoc.getElementsByName('mask'+(j+1))[0].value = document.getElementsByName('mask'+(j+1))[0].value;
					idoc.getElementsByName('gw'+(j+1))[0].value = document.getElementsByName('gw'+(j+1))[0].value;
					idoc.getElementsByName('fdns'+(j+1))[0].value = document.getElementsByName('fdns'+(j+1))[0].value;
					idoc.getElementsByName('sdns'+(j+1))[0].value = document.getElementsByName('sdns'+(j+1))[0].value;
						}
					}
				break;
				case 'wireless':
					for(j = 0 ; j < support_wl_tags.length; j++){
		idoc.getElementsByName(support_wl_tags[j].tag + '_ssid')[0].value = document.getElementsByName('ssid_'+support_wl_tags[j].tag)[0].value;
		idoc.getElementsByName(support_wl_tags[j].tag + '_wlpw')[0].value = document.getElementsByName('wlpw_'+support_wl_tags[j].tag)[0].value;
					}
				break;
				case 'admin':
					F.adminid.value = document.wizard_main_form.adminid.value;
					F.adminpw.value = document.wizard_main_form.adminpw.value;
				break;
				case 'confirm':
					if(F.captcha_code){
						F.captcha_file.value=iframe_captcha.captcha_form.captcha_file.value;
						F.captcha_code.value=document.wizard_main_form.captcha_code.value;
					}
				break;
			}
		}
	}

	function get_formvalue_to_string(ifrname, frmname)
	{
		var ifr = document[ifrname] || document.getElementsByName(ifrname)[0];
		var idoc = ifr.document || ifr.contentWindow.document;
		var F = idoc[frmname];
		if(!F)	idoc.getElementsByName(frmname)[0];

		var step_name, step_num;
		var i, j;

		var result_text = '';
		for(i = 0; i < max_wizard_orders; i++){
			step_num = (parseInt(wizard_orders[i].step.substr('step'.length,1)));
			step_name = wizard_orders[i].menu;

			switch(step_name){
				case 'timezone':
					result_text += ('gmtidx=' + encodeURI(F.gmtidx.value) + '&');
					result_text += ('summer_flag=' + encodeURI(F.summer_flag.value) + '&');
				break;
				case 'netsetup':
					if(document.wizard_main_form.wan_if)
						result_text += ('wan_if=' + encodeURI(F.wan_if.value) + '&');
					result_text += ('conntype=' + encodeURI(F.conntype.value) + '&');
				break;
				case 'netadvance':
					if(F.conntype.value == 'dynamic'){
						result_text += ('mclone=' + encodeURI(F.mclone.value) + '&');
						if(F.mclone.value == 'using'){
							for(j = 0; j < 6; j++){
							result_text += (('hw_addr'+(j+1)) + '=' + encodeURI(idoc.getElementsByName('hw_addr'+(j+1))[0].value) + '&');
							}
						}
					}else if(F.conntype.value == 'pppoe'){
						result_text += ('userid=' + encodeURI(F.userid.value) + '&');
						result_text += ('passwd=' + encodeURI(F.passwd.value) + '&');
					}else if(F.conntype.value == 'static'){
						for(j = 0; j < 4; j++){
						result_text += (('extip'+(j+1)) + '=' + encodeURI(idoc.getElementsByName('extip'+(j+1))[0].value) + '&');
						result_text += (('mask'+(j+1)) + '=' + encodeURI(idoc.getElementsByName('mask'+(j+1))[0].value) + '&');
						result_text += (('gw'+(j+1)) + '=' + encodeURI(idoc.getElementsByName('gw'+(j+1))[0].value) + '&');
						result_text += (('fdns'+(j+1)) + '=' + encodeURI(idoc.getElementsByName('fdns'+(j+1))[0].value) + '&');
						result_text += (('sdns'+(j+1)) + '=' + encodeURI(idoc.getElementsByName('sdns'+(j+1))[0].value) + '&');
						}
					}
				break;
				case 'wireless':
					for(j = 0 ; j < support_wl_tags.length; j++){
			result_text += ((support_wl_tags[j].tag + '_ssid') + '=' + encodeURI(idoc.getElementsByName(support_wl_tags[j].tag + '_ssid')[0].value) + '&');
			result_text += ((support_wl_tags[j].tag + '_wlpw') + '=' + encodeURI(idoc.getElementsByName(support_wl_tags[j].tag + '_wlpw')[0].value) + '&');
					}
				break;
				case 'admin':
					result_text += ('adminid=' + encodeURI(F.adminid.value) + '&');
					result_text += ('adminpw=' + encodeURI(F.adminpw.value) + '&');
				break;
				case 'confirm':
					if(F.captcha_code){
						result_text += ('captcha_file=' + encodeURI(F.captcha_file.value) + '&');
						result_text += ('captcha_code=' + encodeURI(F.captcha_code.value) + '&');
					}
				break;
			}
		}
		result_text += ('act=' + F.act.value + '&');
		result_text += ('tmenu=' + F.tmenu.value + '&');
		result_text += ('smenu=' + F.smenu.value + '&');
		result_text += ('extra=' + F.extra.value);

		return result_text;
	}

	function signal_to_iframe(ifrname, frmname, action, extra)
	{
		var ifr = document[ifrname] || document.getElementsByName(ifrname)[0];
		var idoc = ifr.document || ifr.contentWindow.document;
		var F = idoc[frmname];
		if(!F)	idoc.getElementsByName(frmname)[0];

		F.act.value = action;
		F.extra.value = extra;
		F.submit();
	}

	function check_connected_using_ajax()
	{
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function(){
			if(this.readyState == 4){
				if(typeof(this.status) != 'number'){	/*for IE7, IE8*/
					this.abort();
					setTimeout(function(){check_connected_using_ajax();}, 3000);
				}
				else if(this.status == 200){
					UnMaskIt(document,'cnf');
					end_wizard_setup();
				}else if(this.status != 0){
					this.abort();
					setTimeout(function(){check_connected_using_ajax();}, 3000);
				}
			}
		}
		xmlhttp.ontimeout = function(){
			this.abort();
			setTimeout(function(){check_connected_using_ajax();}, 3000);
		}

		xmlhttp.onerror = function(){
			this.abort();
			setTimeout(function(){check_connected_using_ajax();}, 3000);
		}

		xmlhttp.open("POST", "timepro.cgi", true);
		xmlhttp.timeout = 3000;
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send('tmenu=iframe&smenu=wizard_setup');
	}

	function signal_to_iframe_using_ajax(ifrname, frmname, action, extra, conn_by_wlan)
	{
		var ifr = document[ifrname] || document.getElementsByName(ifrname)[0];
		var idoc = ifr.document || ifr.contentWindow.document;
		var F = idoc[frmname];
		if(!F)	idoc.getElementsByName(frmname)[0];

		F.act.value = action;
		F.extra.value = extra;

		var xmlhttp = new XMLHttpRequest();
		var formData = get_formvalue_to_string(ifrname, frmname);

		xmlhttp.onreadystatechange = function(){
			if(this.readyState == 4){
				if(typeof(this.status) != 'number'){	/*for IE7, IE8*/
					this.abort();
					if(conn_by_wlan)	alert(WIZARD_WIRELESS_RECONNECT);
					document.getElementById('alt_button').style.display = 'none';
					check_connected_using_ajax();
				}
				else if(this.status == 200){
					if(this.responseText.indexOf('wizard_captcha_error') != -1){
						wizard_captcha_error();
					}else if(this.responseText.indexOf('end_wizard_setup') != -1){
						end_wizard_setup(5000);
					}else{	/*for IE7, IE8*/
						this.abort();
						if(conn_by_wlan)	alert(WIZARD_WIRELESS_RECONNECT);
						document.getElementById('alt_button').style.display = 'none';
						check_connected_using_ajax();
					}
				}
			}
		}
		xmlhttp.ontimeout = function(){
			this.abort();
			if(conn_by_wlan)	alert(WIZARD_WIRELESS_RECONNECT);
			document.getElementById('alt_button').style.display = 'none';
			check_connected_using_ajax();
		}
		xmlhttp.onerror = function(){
			this.abort();
			if(conn_by_wlan)	alert(WIZARD_WIRELESS_RECONNECT);
			document.getElementById('alt_button').style.display = 'none';
			check_connected_using_ajax();
		}

		xmlhttp.open("POST", "timepro.cgi", true);
		xmlhttp.timeout = 20000;
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send(formData);
	}

	function validate_string(str, regExp, type)
	{
		if(type == 'unpermitted'){if(str.match(regExp)) return false;}
		else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
		return true;
	}

	function StrLenUTF8CharCode(val)
	{
		var len=0, i=0;

		for(i=0;val.charCodeAt(i);i++)
			len+=ByteLenUTF8CharCode(val.charCodeAt(i));
		return len;
	}

	function check_netadvance_input(ext)
	{
		var F = document.wizard_main_form;
		var obj;
		switch(ext)
		{
			case 'dynamic':
				if(GetRadioValue(F.mclone) == 'using'){
					if(obj=CheckHW('hw_addr')){alert(WIZARD_ERROR_HWINVALID); focus_obj = obj; return false;}
				}
				break;
			case 'pppoe':
				if(F.userid.value == ''){alert(WIZARD_ERROR_PPPOE_IDINVALID); focus_obj = F.userid; return false;}
				obj = document.getElementById('view_passwd');
				if(obj.checked){F.passwd.value = F.passwd_text.value;}
				else{F.passwd_text.value = F.passwd.value;}
				if(F.passwd.value == ''){alert(WIZARD_ERROR_PPPOE_PWINVALID); focus_obj = F.passwd; return false;}
				break;
			case 'static':
				if(obj=CheckIP('extip')){alert(WIZARD_ERROR_STATIC_IPINVALID);	focus_obj = obj;	return false;}
				if(obj=CheckIPNetwork('extip')){alert(WIZARD_ERROR_STATIC_IPINVALID);	focus_obj = obj;	return false;}
				if(obj=CheckIP('mask')){alert(WIZARD_ERROR_STATIC_SMINVALID);	focus_obj = obj;	return false;}
				if(obj=CheckIP('gw')){alert(WIZARD_ERROR_STATIC_GWINVALID);	focus_obj = obj;	return false;}
				if(obj=CheckIPNetwork('gw')){alert(WIZARD_ERROR_STATIC_GWINVALID);	focus_obj = obj;	return false;}
				if(obj=CheckIP('fdns')){alert(WIZARD_ERROR_STATIC_FDNSINVALID);		focus_obj = obj;	return false;}
				if(obj=CheckIPNetwork('fdns')){alert(WIZARD_ERROR_STATIC_FDNSINVALID);	focus_obj = obj;	return false;}
				if(obj=CheckOptionalIP('sdns')){alert(WIZARD_ERROR_STATIC_SDNSINVALID);	focus_obj = obj;	return false;}
				if(obj=CheckIPNetwork('sdns')){alert(WIZARD_ERROR_STATIC_SDNSINVALID);	focus_obj = obj;	return false;}
				break;
		}

		return true;
	}

	function check_lanwansame_input()
	{
		var ifr = document['wizard_setup'] || document.getElementsByName('wizard_setup')[0];
		var idoc = ifr.document || ifr.contentWindow.document;
		var F = document.wizard_main_form;
		var obj;
		var nwaddr = GetNetworkAddress('intip', 'localsm');
		var braddr  = GetLocalBroadcastAddress('intip', 'localsm');
		var ipaddr  = GetIP('intip');

		if(obj=CheckIP('intip')){alert(WIZARD_LANWAN_INVALID);	focus_obj = obj;	return false;}
		if(nwaddr == ipaddr){obj = F.intip4; alert(WIZARD_LANWAN_NETWORK);  focus_obj = obj;        return false;}
		if(braddr == ipaddr){obj = F.intip4; alert(WIZARD_LANWAN_BROAD);  focus_obj = obj;        return false;}
		if(nwaddr){
			if(CheckSameSubnet(nwaddr, F.wan1subnet.value)){
				obj = F.intip4; alert(WIZARD_LANWAN_SAME);  focus_obj = obj;        return false;
			}
			if(F.wan2subnet && F.wan2subnet.value != '' && CheckSameSubnet(nwaddr, F.wan2subnet.value)){
				obj = F.intip4; alert(WIZARD_LANWAN_SAME);  focus_obj = obj;        return false;
			}
		}
		for(var j = 0; j < 4; j++){
			idoc.getElementsByName('intip'+(j+1))[0].value = document.getElementsByName('intip'+(j+1))[0].value;
		}

		return true;
	}

	function check_wireless_input(ext, postfix)
	{
		var obj = document.getElementById('view_'+ext);
		var obj2, slen;
		if(obj.checked){
			obj = document.getElementsByName('wlpw_'+ext + '_text')[0];
			obj2 = document.getElementsByName('wlpw_'+ext)[0];
			obj2.value = obj.value;
		}else{
			obj = document.getElementsByName('wlpw_'+ext)[0];
			obj2 = document.getElementsByName('wlpw_'+ext + '_text')[0];
			obj2.value = obj.value;
		}

		obj = document.getElementsByName('ssid_'+ext)[0];
		if(obj.value == ''){alert(postfix + ' ' + WIZARD_ERROR_WL_SSID_BLANK);	obj.focus();	focus_obj = obj; return false;}
		if((slen = StrLenUTF8CharCode(obj.value)) > 32){alert(postfix + ' ' + WIZARD_ERROR_WL_SSID_OVFLOW + slen + 'bytes');	focus_obj = obj; return false;}
		obj = document.getElementsByName('wlpw_'+ext)[0];
		if(obj.value == ''){alert(postfix + ' ' + WIZARD_ERROR_WL_WLPW_BLANK);	focus_obj = obj; return false;}
		if(obj.value.length < 8 || obj.value.length > 64){alert(postfix + ' ' + WIZARD_ERROR_WL_WLPW_INVALID);	focus_obj = obj; return false;}
		if(obj.value.length >= 64 && !validate_string(obj.value, regExp_hex, 'match')){alert(postfix+' '+WIZARD_ERROR_WL_WLPW_HEX);	focus_obj = obj; return false;}

		return true;
	}

	function check_admin_input()
	{
		var F = document.wizard_main_form;
		var obj = document.getElementById('view_adminpw');

		if(obj.checked){F.adminpw.value = F.adminpw_text.value;}
		else{F.adminpw_text.value = F.adminpw.value;}

		if(F.adminid.value == ''){alert(WIZARD_ERROR_ADMIN_NAME); focus_obj = F.adminid;	return false;}
		if(!validate_string(F.adminid.value, regExp_adminid, 'match')){alert(WIZARD_ERROR_ADMIN_NAME_INV); focus_obj = F.adminid;	return false;}
		if(F.adminpw.value == ''){alert(WIZARD_ERROR_ADMIN_PASS); focus_obj = F.adminpw;	return false;}

		return true;
	}

	function check_confirm_input()
	{
		var F = document.wizard_main_form;

		if(F.captcha_code){
			if(F.captcha_code.value == '' || F.captcha_code.value == F.default_captcha_desc.value)
			{
				alert(WIZARD_NEED_CAPTCHA);
				focus_obj = F.captcha_code;
				return false;
			}
		}
		return true;
	}

	function process_each_step(step)
	{
		var origin_step, ext_step;
		if(step.indexOf('_') != -1){origin_step = step.split('_')[0]; ext_step = step.split('_')[1];}
		else{origin_step = step; ext_step = '';}
		var page_name = get_page_name(origin_step);
		switch(page_name)
		{
			case 'netsetup':
				document.getElementById('wizard_netsetup_sresult').innerHTML = '';
				autodetect_timer = -1;
				break;
			case 'netadvance':
				if(!check_netadvance_input(ext_step))	return false;
				break;
			case 'wireless':
				for(var i = support_wl_tags.length-1 ; i >= 0; i--){
					if(!check_wireless_input(support_wl_tags[i].tag, (support_wl_tags[i].ghztxt + ' ')))	return false;
				}
				break;
			case 'admin':
				if(!check_admin_input())	return false;
				break;
		}
		return true;
	}

	function do_action(action, extra)
	{
		switch(action)
		{
			case 'exit':
				parent.location.href='login.cgi';
				break;
			case 'end':
				signal_to_iframe('wizard_setup', 'wiz_setup', 'allend', '');
				//parent.location.href='login.cgi';
				break;
			case 'apply':
				if(!check_confirm_input())	return;
				status_running = false;
				copy_all_value_to_setup_iframe('wizard_setup', 'wiz_setup');
				//if(document.wizard_main_form.connbywlan.value != '0'){
					signal_to_iframe_using_ajax('wizard_setup', 'wiz_setup', 'submit', ''
						, ((document.wizard_main_form.connbywlan.value != '0')?true:false));
				//}else{
				//	signal_to_iframe('wizard_setup', 'wiz_setup', 'submit', '');
				//}
				document.getElementById('wizard_applying_div').style.display = '';
				DisableObj(document.getElementById('wizard_confirm_prev_btn'));
				DisableObj(document.getElementById('wizard_confirm_apply_btn'));
				break;
			case 'prev':
				if(!document.getElementById(get_prev_page()))	return;
				document.getElementById(get_cur_page()).style.display = 'none';
				document.getElementById(get_prev_page()).style.display = '';
				set_cur_page(get_prev_page());
				break;
			case 'next':
				if(!document.getElementById(get_next_page()))	return;
				if(!process_each_step(get_cur_page()))	return;
				if(get_page_name(get_next_page()) == 'confirm')	update_confirm_page();
				document.getElementById(get_cur_page()).style.display = 'none';
				document.getElementById(get_next_page()).style.display = '';
				set_cur_page(get_next_page());
				break;
			case 'autodetect':
				status_running = true;
				autodetect_timer = 20;
				process_wizard_status('detecting');
				signal_to_iframe('wizard_setup', 'wiz_setup', 'autodetect', 'start');
				break;
			case 'conntest':
				status_running = false;
				signal_to_iframe('wizard_setup', 'wiz_setup', 'conntest', '');
				break;
			case 'lanwansame':
				if(!check_lanwansame_input())	return;
				status_running = false;
				ElementsControl('conntest_appling_div', 'view');
				ElementsControl('lanwansame_conntest_btns', '');
				document.getElementById('conntest_appling_ani').style.display = '';
				document.getElementById('conntest_explain').innerHTML = WIZARD_LANWAN_APPLY;
				signal_to_iframe('wizard_setup', 'wiz_setup', 'lanwansame', '');
				break;
			case 'reboot':
				status_running = false;
				signal_to_iframe('wizard_setup', 'wiz_setup', 'reboot', '');
				break;
			case 'off':
				window.close();
				break;
			case 'gotopage':
				if(!extra)	return;
				status_running = true;
				var mainp, subp;
				if(extra.indexOf('_') != -1){mainp = extra.split('_')[0]; subp = extra.split('_')[1];}
				else{mainp = extra; subp = '';}
				document.getElementById(get_cur_page()).style.display = 'none';
				set_cur_page(get_special_page(mainp, subp));
				document.getElementById(get_cur_page()).style.display = '';
				break;
		}
	}

	do_action(action, extra);
}

function end_wizard_setup(wait_time)
{
	function _do_action()
	{
		click_act_button('conntest');
	}

	if(wait_time && wait_time > 0){
		setTimeout(function(){end_wizard_setup();}, wait_time);
	}else{
		_do_action();
	}
}

function wizard_captcha_error()
{
	var F = document.wizard_main_form;
	document.getElementById('wizard_applying_div').style.display = 'none';
	EnableObj(document.getElementById('wizard_confirm_prev_btn'));
	EnableObj(document.getElementById('wizard_confirm_apply_btn'));
	iframe_captcha.location.reload();

	if(F.captcha_code){
		alert(WIZARD_NEED_CAPTCHA);
		focus_obj = F.captcha_code;
	}
}

function wizard_lanwansame_process(remained)
{
	document.getElementById('conntest_appling_ani').style.display = '';
	document.getElementById('conntest_explain').innerHTML = WIZARD_NOW_REBOOTING + remained + WIZARD_WAN_DETECT2;

	remained -= 1;

	if(remained > 0)
		setTimeout(function(){wizard_lanwansame_process(remained);}, 1000);
	else{
		document.getElementById('conntest_appling_ani').style.display = 'none';
		document.getElementById('conntest_explain').innerHTML = WIZARD_LANWAN_COMPLETE + GetIP('intip');
		ElementsControl('the_end_btns', 'view');
	}
}

function wizard_reboot_process(remained)
{
	document.getElementById('wizard_netsetup_sresult').innerHTML = WIZARD_NOW_REBOOTING + remained + WIZARD_WAN_DETECT2;
	document.getElementById('wizard_auto_black').style.display = 'none';
	document.getElementById('wizard_auto_white').style.display = '';
	document.getElementById('wizard_netsetup_ani').style.display = '';

	remained -= 1;

	if(remained > 0)
		setTimeout(function(){wizard_reboot_process(remained);}, 1000);
	else
		parent.location.href='login.cgi';
}

function wizard_conntest_result(res, special_case, extra)
{
	function update_to_ipform(name, ipdata)
	{
		var i;
		if(ipdata.indexOf('.') == -1)	return;

		ipdata = ipdata.split('.');
		for(i = 0; i < 4; i++){
			document.getElementsByName(name+(i+1))[0].value = ipdata[i];
		}
	}

	document.getElementById('wizard_applying_div').style.display = 'none';
	EnableObj(document.getElementById('wizard_confirm_prev_btn'));
	EnableObj(document.getElementById('wizard_confirm_apply_btn'));

	click_act_button('next');

	if(res){
		ElementsControl('conntest_success_title', 'view');
		ElementsControl('conntest_failed_title', '');
		ElementsControl('conntest_success_explain', 'view');
		ElementsControl('conntest_commonfail_explain', '');
		ElementsControl('conntest_wanfail_explain', '');
		ElementsControl('conntest_lanwansame_explain', '');
		ElementsControl('conntest_pppoefail_explain', '');
		ElementsControl('reset_conntest_btns', '');
		ElementsControl('pppoe_conntest_btns', '');
		ElementsControl('common_conntest_btns', 'view');
		ElementsControl('lanwansame_conntest_btns', '');
		ElementsControl('conntest_appling_div', '');
		ElementsControl('the_end_btns', '');
	}else{
		ElementsControl('conntest_success_title', '');
		ElementsControl('conntest_failed_title', 'view');
		ElementsControl('conntest_appling_div', '');
		ElementsControl('the_end_btns', '');
		if(special_case){
			switch(special_case){
				case 'wan':
					ElementsControl('conntest_success_explain', '');
					ElementsControl('conntest_commonfail_explain', '');
					ElementsControl('conntest_wanfail_explain', 'view');
					ElementsControl('conntest_lanwansame_explain', '');
					ElementsControl('conntest_pppoefail_explain', '');
					ElementsControl('reset_conntest_btns', 'view');
					ElementsControl('pppoe_conntest_btns', '');
					ElementsControl('common_conntest_btns', 'view');
					ElementsControl('lanwansame_conntest_btns', '');
					break;
				case 'pppoe':
					ElementsControl('conntest_success_explain', '');
					ElementsControl('conntest_commonfail_explain', '');
					ElementsControl('conntest_wanfail_explain', '');
					ElementsControl('conntest_lanwansame_explain', '');
					ElementsControl('conntest_pppoefail_explain', 'view');
					ElementsControl('reset_conntest_btns', '');
					ElementsControl('pppoe_conntest_btns', 'view');
					ElementsControl('common_conntest_btns', 'view');
					ElementsControl('lanwansame_conntest_btns', '');
					break;
				case 'lanwansame':
					var F = document.wizard_main_form;
					if(F.wan2subnet && extra['wan2subnet']){F.wan2subnet.value = extra['wan2subnet'];}
					if(extra['wan1subnet']){F.wan1subnet.value = extra['wan1subnet'];}
					if(extra['autoupip']){F.autoupip.value = extra['autoupip'];}
					if(extra['localsm']){update_to_ipform('localsm', extra['localsm']);}
					update_to_ipform('intip', F.autoupip.value);

					ElementsControl('conntest_success_explain', '');
					ElementsControl('conntest_commonfail_explain', '');
					ElementsControl('conntest_wanfail_explain', '');
					ElementsControl('conntest_lanwansame_explain', 'view');
					ElementsControl('conntest_pppoefail_explain', '');
					ElementsControl('reset_conntest_btns', '');
					ElementsControl('pppoe_conntest_btns', '');
					ElementsControl('common_conntest_btns', '');
					ElementsControl('lanwansame_conntest_btns', 'view');
					break;
			}
		}else{
			ElementsControl('conntest_success_explain', '');
			ElementsControl('conntest_commonfail_explain', 'view');
			ElementsControl('conntest_wanfail_explain', '');
			ElementsControl('conntest_lanwansame_explain', '');
			ElementsControl('conntest_pppoefail_explain', '');
			ElementsControl('reset_conntest_btns', 'view');
			ElementsControl('pppoe_conntest_btns', '');
			ElementsControl('common_conntest_btns', 'view');
			ElementsControl('lanwansame_conntest_btns', '');
		}
	}
}

function process_wizard_status(stat, extra)
{
	function get_extra_string(extra)
	{
		var cur_lang = document.wizard_main_form.cur_lang.value;

		if(cur_lang == 'ch' || cur_lang == 'cx'){
			switch(extra){
				case 'dynamic':	return (WIZARD_DETECTED_COMMON + WIZARD_DHCP_TITLE_TEXT);
				case 'pppoe':	return (WIZARD_DETECTED_PPPOE + WIZARD_DETECTED_COMMON + WIZARD_PPPOE_TITLE_TEXT);
				case 'static':	return (WIZARD_WAN_DETECT_FAIL);
				default:	return '';
			}
		}else{
			switch(extra){
				case 'dynamic':	return (WIZARD_DHCP_TITLE_TEXT + WIZARD_DETECTED_COMMON);
				case 'pppoe':	return (WIZARD_PPPOE_TITLE_TEXT + WIZARD_DETECTED_PPPOE + WIZARD_DETECTED_COMMON);
				case 'static':	return (WIZARD_WAN_DETECT_FAIL);
				default:	return '';
			}
		}
	}

	function set_radio_val(name, val)
	{
		autodetect_timer = -1;
		if(val == 'static'){return;}
		var rbutton = document.getElementsByName(name);
		for(var i = 0; i < rbutton.length; i++){
			if(rbutton[i].value == val)	rbutton[i].checked = true;
			else				rbutton[i].checked = false;
		}
	}

	if(autodetect_timer > 0 && stat == 'normal'){stat = 'detecting';}
	if(autodetect_timer > 16 && stat == 'detected'){stat = 'detecting';}

	switch(stat){
		case 'normal':
			if(document.getElementById('wizard_netsetup_sresult').innerHTML == WIZARD_WAN_NOTCONNECT){
				document.getElementById('wizard_netsetup_sresult').innerHTML = '';
			}
			if(document.wizard_main_form.wan_exist && document.wizard_main_form.wan_exist.value == '0'){
				document.getElementById('wizard_auto_black').style.display = 'none';
				document.getElementById('wizard_auto_white').style.display = '';
				DisableObj(document.getElementById('netsetup_next'));
				DisableObj(document.getElementById('netsetup_prev'));
				EnableObj(document.getElementById('netsetup_reboot'));
			}else{
				document.getElementById('wizard_auto_black').style.display = '';
				document.getElementById('wizard_auto_white').style.display = 'none';
				EnableObj(document.getElementById('netsetup_next'));
				EnableObj(document.getElementById('netsetup_prev'));
				DisableObj(document.getElementById('netsetup_reboot'));
			}
			document.getElementById('wizard_netsetup_ani').style.display = 'none';
			break;
		case 'nowan':
			document.getElementById('wizard_netsetup_sresult').innerHTML = WIZARD_WAN_NOTCONNECT;
			document.getElementById('wizard_auto_black').style.display = 'none';
			document.getElementById('wizard_auto_white').style.display = '';
			document.getElementById('wizard_netsetup_ani').style.display = 'none';
			break;
		case 'detecting':
			document.getElementById('wizard_auto_black').style.display = 'none';
			document.getElementById('wizard_auto_white').style.display = '';
			document.getElementById('wizard_netsetup_ani').style.display = '';
			document.getElementById('wizard_netsetup_sresult').innerHTML = (WIZARD_WAN_DETECT1 + autodetect_timer + WIZARD_WAN_DETECT2);
			if(autodetect_timer > 0)	autodetect_timer -= 1;
			break;
		case 'detected':
			document.getElementById('wizard_auto_black').style.display = '';
			document.getElementById('wizard_auto_white').style.display = 'none';
			document.getElementById('wizard_netsetup_ani').style.display = 'none';
			document.getElementById('wizard_netsetup_sresult').innerHTML = get_extra_string(extra);
			if(autodetect_timer >= 0)	set_radio_val('conntype', extra);
			break;
	}
}

function status_run_func()
{
	var ifr = document.wizard_data || document.getElementsByName('wizard_data')[0];
	if(!ifr){setTimeout(function(){status_run_func();}, 1000);	return;}
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc){setTimeout(function(){status_run_func();}, 1000);	return;}
	var F = idoc.wiz_data || idoc.getElementsByName('wiz_data')[0];
	if(!F){setTimeout(function(){status_run_func();}, 1000);	return;}

	if(status_running){
		//for FIREFOX bug
		setTimeout(function(){
		if(ifr.location)	ifr.location.reload();
		else			idoc.location.reload();
		},0);
	}

	setTimeout(function(){status_run_func();}, 1000);
}

function init_config_page()
{
	function getAllElementsById(tag)
	{
		var all_elem = document.getElementsByTagName('div');
		var retval = [], child;
		for(var i = 0 , length = all_elem.length; i < length; i++){
			child = all_elem[i];
			if(child.id.indexOf(tag) != -1)
				retval.push(child);
		}
		return retval;
	};

	function _init(setp, stat)
	{
		var pages;
		var F = document.wizard_main_form;
		var cur_page = F.cur_step.value;

		pages = getAllElementsById('step');
	
		for(var tmp in pages){
			if(pages[tmp].id == cur_page)	pages[tmp].style.display = '';
			else				pages[tmp].style.display = 'none';
		}

		update_navi_title(cur_page);
		set_title_text(cur_page);
		status_run_func();

		return cur_page;
	}

	_init();
}

function alert(msg, obj)
{
	function get_linec_index(_msg)
	{
		if(_msg.indexOf('\n') != -1){
			return (_msg.indexOf('\n')+1);
		}

		return _msg.length;
	}

	if(!msg)	msg = '';

	var i,cur, len = msg.length;
	var cur_lang = document.wizard_main_form.cur_lang.value;
	var SPLIT_LEN, calc_len;
	var _tmp;

	switch(cur_lang){
		case 'en':	SPLIT_LEN = 45;	break;
		default:	SPLIT_LEN = 32;	break;
	}

	for( i = 1, cur = 0 ; (i <= 5 && cur < len); i++){
		_tmp = msg.substring(cur, (((cur + SPLIT_LEN) < len)?(cur+SPLIT_LEN):len));
		calc_len = get_linec_index(_tmp);
		_tmp = msg.substring(cur, cur+calc_len);
		document.getElementById('wizard_alert_line'+i).innerHTML = _tmp;
		cur += calc_len;
	}
	for( ; i <= 5; i++){document.getElementById('wizard_alert_line'+i).innerHTML = '';}

	MaskIt(document, 'cnf');
	document.getElementById('alt_button').style.display = '';
	document.getElementById('oktable').style.display = 'none';
	document.getElementById('ngtable').style.display = 'none';
	document.getElementById('pppoetable').style.display = 'none';
	document.getElementById('alttable').style.display = '';
}

</script>
