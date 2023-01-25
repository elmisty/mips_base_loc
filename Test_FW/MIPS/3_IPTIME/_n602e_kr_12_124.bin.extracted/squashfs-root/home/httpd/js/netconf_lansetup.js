<script>

var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@&$#%\\\=\'\"]/g;

function validate_string(str, regExp, type)
{
        if(type == 'unpermitted'){if(str.match(regExp)) return false;}
        else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
        return true;
}

function reset_form(F)
{
        if(!F)  return;

        for(var i = 0; i < F.length;){
                if(F[i] && F[i].tagName && F[i].tagName == 'INPUT' && F[i].name){
                        var nm = F[i].name;
                        F.removeChild(F[i]);
                        if(F[nm])       F[nm] = null;
                }else i++;
        }
}

function isIE6()
{
	var retv = -1;
	if (window.navigator && navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			retv = parseFloat( RegExp.$1 );
	}
	return ((retv==6.0)?true:false);
}

function add_hiddeninput(F, elem, idoc)
{
	if(!F || !elem)	return;

	var crelm = document.createElement('input');
	if(idoc)	crelm = idoc.createElement('input');
	crelm.type = 'hidden';
	/*IE 5*/
	if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');

	if(elem.type == 'checkbox'){
		crelm.value = elem.checked?'on':'off';
		crelm.setAttribute('value', elem.checked?'on':'off');
	}else{
		crelm.value = elem.value;
		crelm.setAttribute('value', elem.value);
	}

	crelm.name = elem.name;
	crelm.setAttribute('name', elem.name);

	F.appendChild(crelm);
	/*IE 5*/
	if(!F[elem.name])
		F[elem.name] = crelm;

}

function copy_formvalues(original_form, copied_form, idoc)
{
        var F = original_form;
        var iform = copied_form;

        for(var i = 0; i < F.length; i++){
                if(F[i] && F[i].tagName && (F[i].tagName == 'INPUT' || F[i].tagName == 'SELECT') && F[i].name/* && !F[i].disabled*/){
                        if(is_viewing_element(F[i])){
                                var crelm = document.createElement('input');
				if(idoc)	crelm = idoc.createElement('input');
                                crelm.type = 'hidden';
                                /*IE 5*/
                                if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');
                                if(F[i].type == 'checkbox' || F[i].type == 'radio'){
                                        if(F[i].checked){
                                                crelm.value = F[i].value;
                                                crelm.name = F[i].name;
                                                /*IE 5*/
                                                crelm.setAttribute('name', F[i].name);
                                                crelm.setAttribute('value', F[i].value);
                                        }else   continue;
                                }
                                else if(F[i].type == 'button'){
                                        continue;
                                }
                                else{
                                        crelm.value = F[i].value;
                                        crelm.name = F[i].name;
                                        /*IE 5*/
                                        crelm.setAttribute('name', F[i].name);
                                        crelm.setAttribute('value', F[i].value);
                                }
                                iform.appendChild(crelm);
                                /*IE 5*/
                                if(!iform[F[i].name])
                                        iform[F[i].name] = crelm;
                        }
                }
        }
}

function is_viewing_element(obj)
{
        var node = null;

        if(typeof obj.length == 'undefined'){
                node = obj;
                while(node){
                        if(typeof(node.style) != 'undefined' && node.style.display == 'none')
                                return false;
                        node = node.parentNode;
                }
                return true;
        }else{
                for(i=0; i < obj.length; i++){
                        node = obj[i];

                        var node_display = true;
                        while(node){
                                if(typeof(node.style) != 'undefined' && node.style.display == 'none'){
                                        node_display = false;   break;
                                }
                                node = node.parentNode;
                        }
                        if(node_display) return true;
                }
                return false;
        }
}

function SetIPViewByCheckbox(frm_name, checked)
{
	if(checked){
            EnableIP(frm_name);
	}
	else{
            DisableIP(frm_name);
	}
}

function check_ipval_diff(F, copyF, iname)
{
	if(!F || !copyF || !iname)	return 0;

	for(var i = 1; i <= 4; i++){
		if(!F[iname+i] && copyF[iname+i])		return 1;
		if(F[iname+i] && !copyF[iname+i])		return 1;
		if(F[iname+i].value != copyF[iname+i].value)	return 1;
	}

	return 0;
}

function check_ckbox_diff(F, copyF, iname)
{
	if(!F || !copyF || !iname)	return 0;

	if(!F[iname] && copyF[iname])		return 1;
	if(F[iname].checked){
		if(F[iname] && !copyF[iname])			return 1;
		if(F[iname].value != copyF[iname].value)	return 1;
	}else{
		if((copyF[iname]) && (F[iname].value != copyF[iname].value))	return 1;
	}

	return 0;
}

function lansetup_reboot_process(rebootDuration, refreshURL)
{
	if(rebootDuration > 0){
		document.getElementById('lansetup_div_msg').innerHTML = NETCONF_LANSETUP_REBOOTMSG1 + rebootDuration + NETCONF_LANSETUP_REBOOTMSG2;
		setTimeout(function(){lansetup_reboot_process(rebootDuration-1, refreshURL);}, 1000);
	}else{
		document.getElementById('lansetup_div_info1').innerHTML = LANSETUP_REBOOT_CHANGEIP_RETRY_LOGIN;
		if(refreshURL){
			document.getElementById('lansetup_div_info2').innerHTML = 'URL : ' + refreshURL;
		}else{
			document.getElementById('lansetup_div_info2').innerHTML = '';
		}
		UnMaskIt(document, 'apply_mask');
		MaskIt(document, 'info_mask');
	}
}

function lansetup_part_process(act)
{
	UnMaskIt(document, 'apply_mask');

	if(act == 'success'){
		document.getElementById('lansetup_div_info1').innerHTML = LANSETUP_SEARCH_SUCCESS;
		document.getElementById('lansetup_div_info2').innerHTML = '';
	}else{
		document.getElementById('lansetup_div_info1').innerHTML = LANSETUP_SEARCH_FAILED;
		document.getElementById('lansetup_div_info2').innerHTML = LANSETUP_SEARCH_FAILED2;
	}
	MaskIt(document, 'info_mask');
	setTimeout(function(){UnMaskIt(document, 'info_mask');}, 3000);
}

function ApplyPartSubmit(iname)
{
	var ifr = document.hiddenlansetup_iframe || document.getElementsByName('hiddenlansetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.netconf_hiddenlansetup;
	
	var F = document.netconf_lansetup;

	document.getElementById('lansetup_div_msg').innerHTML = NETCONF_LANSETUP_PARTAPPLY;
        MaskIt(document, 'apply_mask');

if(isIE6()){
	add_hiddeninput(iform, F[iname], idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.act, idoc);
}else{
	add_hiddeninput(iform, F[iname]);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.act);
}

	iform.tmenu.value = 'iframe';
	iform.smenu.value = 'hiddenlansetup';
	iform.act.value = 'part';

	iform.submit();
}

function ApplyLanSetup()
{
	if(!CheckInternalSetup())	return;

	var F = document.netconf_lansetup;
	var copyF = document.backup_lansetup;

	var ifr = document.hiddenlansetup_iframe || document.getElementsByName('hiddenlansetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.netconf_hiddenlansetup;

	F.reboot.value = '';

	/*if(check_ipval_diff(F, copyF, 'ip') || check_ipval_diff(F, copyF, 'sm')
	|| check_ckbox_diff(F, copyF, 'hubapusing') || check_ckbox_diff(F, copyF, 'mgw') || check_ckbox_diff(F, copyF, 'mdns')
	|| ((F.hubapusing.checked) && (check_ipval_diff(F, copyF, 'gwlan') || check_ipval_diff(F, copyF, 'fdns') || check_ipval_diff(F, copyF, 'sdns'))))*/
	if(true)
	{
		if (F.faketwinip)
                        rc = confirm(LANSETUP_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP);
                else
                        rc = confirm(LANSETUP_RESTART_CONFIRM_CHANGE_LANIP);
                if (!rc) return;

		F.reboot.value = 'reboot';
		document.runstat = 'stop';
		if(document.timeoutval)	clearTimeout(document.timeoutval);
	}

if(isIE6()){
	copy_formvalues(F, iform, idoc);
}else{	
	copy_formvalues(F, iform);
}
	iform.act.value = 'submit';
	iform.tmenu.value = 'iframe';
	iform.smenu.value = 'hiddenlansetup';

	document.getElementById('lansetup_div_msg').innerHTML = NETCONF_LANSETUP_APPLYSTR;
        MaskIt(document, 'apply_mask');

	iform.submit();
	reset_form(copyF);
	copy_formvalues(F, copyF);
}

function ChangeLANServerOp()
{
    var F = document.netconf_lansetup;

    if (F.hubapusing.checked == true)
    {
            EnableIP('gwlan');
            EnableIP('fdns');
            EnableIP('sdns');

            if(F.mgw){
                    F.mgw.disabled = false;
		    SetIPViewByCheckbox('gwlan', F.mgw.checked);
	    }
            if(F.mdns){
                    F.mdns.disabled = false;
		    SetIPViewByCheckbox('fdns', F.mdns.checked);
		    SetIPViewByCheckbox('sdns', F.mdns.checked);
	    }
    }
    else
    {
            DisableIP('gwlan');
            DisableIP('fdns');
            DisableIP('sdns');
            if(F.mgw)		F.mgw.disabled = true;
            if(F.mdns)		F.mdns.disabled = true;
    }
}

function onclick_autoconn(obj, newip, oldip)
{
	var F = document.netconf_lansetup;
	
	if(obj.checked){
		SetIP('ip', newip);
	}else{
		SetIP('ip', oldip);
	}
}

function onclick_ckbox(iname, obj)
{
	var F = document.netconf_lansetup;

	if(iname == 'mdns'){
		SetIPViewByCheckbox('fdns', obj.checked);
		SetIPViewByCheckbox('sdns', obj.checked);
		
		if(!obj.checked)	UpdateHubapData(null, F.org_id.value);
	}else if(iname == 'mgw'){
		SetIPViewByCheckbox('gwlan', obj.checked);

		if(!obj.checked)	UpdateHubapData(F.org_ig.value, null);
	}
}

function clear_hubap_options()
{
	var F = document.netconf_lansetup;

	F.mgw.checked = false;
	F.mdns.checked = false;
	for(var i = 0; i < 4; i++){
		(document.getElementsByName('gwlan' + (i+1)))[0].value = '';
	}
	for(var i = 0; i < 4; i++){
		(document.getElementsByName('fdns' + (i+1)))[0].value = '';
	}
	for(var i = 0; i < 4; i++){
		(document.getElementsByName('sdns' + (i+1)))[0].value = '';
	}
}

function onclick_hubapchk(obj)
{
	var F = document.netconf_lansetup;

	if(obj.checked){
		if(F.alerted.value != '1'){
			if(confirm(NETCONF_LANSETUP_HUBAP_ALERT)){F.alerted.value = '1';}
			else{obj.checked = false; return;} 
			ApplyPartSubmit('hubapusing');
		}
	}else{
		F.alerted.value = '0';
		clear_hubap_options();
	}
	ChangeLANServerOp();
}

function ProcessHubapData(gw, dns)
{
	var F = document.netconf_lansetup;

	if(gw && dns){
		lansetup_part_process('success');
	}else{
		lansetup_part_process('failed');
	}
	
	UpdateHubapData(gw, dns);

	if(!F.mgw.checked && gw && gw != ''){	
		F.org_ig.value = gw;
		//F.mgw.checked = false;
	}
	else{
		if(!F.mgw.checked)
			F.org_ig.value = '';
		F.mgw.checked = true;
	}
	if(!F.mdns.checked && dns && dns != ''){
		F.org_id.value = dns;
		//F.mdns.checked = false;
	}
	else{
		if(!F.mdns.checked)
			F.org_id.value = '';
		F.mdns.checked = true;
	}
	ChangeLANServerOp();
}

function UpdateHubapData(gw, dns)
{
	var F = document.netconf_lansetup;
	
	if(gw && gw != ''){
		var gws = gw.split('.');

		for(var i = 0; i < gws.length; i++){
			(document.getElementsByName('gwlan' + (i+1)))[0].value = gws[i];
		}
	}
	if(dns && dns != ''){
		var dnss = dns.split('.');

		for(var i = 0; i < dnss.length; i++){
			(document.getElementsByName('fdns' + (i+1)))[0].value = dnss[i];
			//(document.getElementsByName('sdns' + (i+1)))[0].value = '';
		}
	}
}

function CheckInternalSetup()
{
	var F = document.netconf_lansetup;
	var obj;
	
	if(obj=CheckIP('ip'))
	{
	        alert(MSG_INVALID_IP);
	        obj.focus();
	        obj.select();
	        return 0;
	}

	if(obj=CheckMask('sm'))
	{
		alert(MSG_INVALID_NETMASK);
	        obj.focus();
	        obj.select();
		return 0;
	}

	nwaddr = GetNetworkAddress('ip', 'sm');
	braddr  = GetLocalBroadcastAddress('ip', 'sm');
	ipaddr  = GetIP('ip');

	if(nwaddr == ipaddr )
	{
		alert(MSG_ERROR_NETWORK_LANIP);
		return 0;
	}

	if(braddr == ipaddr )
	{
		alert(MSG_ERROR_BROAD_LANIP);
		return 0;
	}

	if (nwaddr)
	{
		if (CheckSameSubnet(nwaddr, F.wan1subnet.value))
		{
			alert(NETCONF_INTERNAL_INVALID_NETWORK);
			return 0;
		}
		if (F.wan2subnet && F.wan2subnet.value != '' && CheckSameSubnet(nwaddr, F.wan2subnet.value))
		{
			alert(NETCONF_INTERNAL_INVALID_NETWORK);
			return 0;
		}
	}
	if (F.hubapusing.checked == true)
	{
		if(obj=CheckIP('gwlan'))
		{
			alert(NETCONF_LANSETUP_INVALID_GATEWAY);
			obj.focus();
			obj.select();
			return 0;
		}
		if(obj=CheckIP('fdns'))
		{
			alert(MSG_INVALID_FDNS);
			obj.focus();
			obj.select();
			return 0;
		}
		if (F.mdns.checked == true && (F.sdns1.value != '' || F.sdns2.value != '' || F.sdns3.value != '' || F.sdns4.value != '')){
			if(obj=CheckIP('sdns'))
			{
				alert(MSG_INVALID_SDNS);
				obj.focus();
				obj.select();
				return 0;
			}
		}

		var iplan = GetIP('ip');
		var smlan = GetIP('sm');
		var gwlan = GetIP('gwlan');

		var iparr = iplan.split('.');
		var smarr = smlan.split('.');
		var gwarr = gwlan.split('.');

		for(var i = 0 ; i < 4 ; i ++){
			if ((parseInt(iparr[i]) & parseInt(smarr[i])) != (parseInt(gwarr[i]) & parseInt(smarr[i])))
                	{
                	        alert(NETCONF_LANSETUP_PLZ_CHANGE);
                	        return 0;
                	}
		}
	}

	return 1;
}

function init_netconf_lansetup()
{
	document.runstat = 'run';
	document.body.style.backgroundColor='#EEEEEE';  document.body.children[0].style.backgroundColor='#EEEEEE';
	var F = document.netconf_lansetup;
	var copyF = document.backup_lansetup;

	reset_form(copyF);

	ChangeLANServerOp();

	copy_formvalues(F, copyF);
}

</script>
