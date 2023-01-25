<script>
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

function DisableObj_V2(obj)
{
	if(!obj)	return;
	obj.disabled = true;
	obj.style.opacity = '0.4';
}

function EnableObj_V2(obj)
{
	if(!obj)	return;
	obj.disabled = false;
	obj.style.opacity = '';
}

function HideObj_V2(obj)
{
	if(!obj)	return;
	if(obj.style.display != 'none')
		obj.prevDisplay = obj.style.display;
	obj.style.display = 'none';
}

function ShowObj_V2(obj)
{
	if(!obj)	return;
	if(obj.prevDisplay)
		obj.style.display = obj.prevDisplay;
	else
		obj.style.display = '';
}

function add_hiddeninput(F, elem, idoc)
{
        if(!F || !elem) return;

        var crelm = document.createElement('input');
	if(idoc)	crelm = idoc.createElement('input');
        crelm.type = 'hidden';
        /*IE 5*/
        if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');

        if(elem.type == 'checkbox'){
                crelm.value = elem.checked?'on':'off';
                crelm.setAttribute('value', elem.checked?'on':'off');
        }
        else if(elem[0] && elem[0].type == 'radio'){
                crelm.value = GetValue(elem);
                crelm.setAttribute('value', GetValue(elem));
        }
        else{
                crelm.value = elem.value;
                crelm.setAttribute('value', elem.value);
        }

        if(elem[0] && elem[0].type == 'radio'){
                crelm.name = elem[0].name;
                crelm.setAttribute('name', elem[0].name);
        }else{
                crelm.name = elem.name;
                crelm.setAttribute('name', elem.name);
        }

        F.appendChild(crelm);
        /*IE 5*/
        if(!F[elem.name])
                F[elem.name] = crelm;

}

function ClickEventPropagater(e)
{
        if(!e)  e = window.event;
        e.cancelbubble = true;
        if(e.stopPropagation)   e.stopPropagation();
        if(e.preventDefault)    e.preventDefault();
        return false;
}

function ApplyGamingvpn(act)
{
        var F=document.gamingvpn_fm;
	var ifr = document.gamingvpnsetup_iframe || document.getElementsByName('gamingvpnsetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_gamingvpnsetup;
        if(!iform)      return;

	document.getElementById('gamingvpn_div_msg').innerHTML = EXPERTCONF_GAMINGVPN_APPLYSTR;
	MaskIt(document, 'apply_mask');

        iform.act.value=act;
if(isIE6()){
	add_hiddeninput(iform, F.mudfish_onoff, idoc);
}else{
	add_hiddeninput(iform, F.mudfish_onoff);
}

        iform.submit();
}

function init_gamingvpn_status(statstr, btncontrol, period, showlink)
{
	var statobj;

	statobj = document.getElementById('mudfish_status');
	statobj.innerHTML = statstr;
	
	if(btncontrol){
		EnableObj_V2(document.getElementById('appbtn'));
	}else{
		DisableObj_V2(document.getElementById('appbtn'));
	}
	
	if(showlink){
		ShowObj_V2(document.getElementById('mudfish_link'));
	}else{
		HideObj_V2(document.getElementById('mudfish_link'));
	}

	setTimeout(
		function(){
			var ifr = document.gamingvpnstatus_iframe || document.getElementsByName('gamingvpnstatus_iframe')[0];
			if(!ifr)        return;
			var idoc = ifr.document || ifr.contentWindow.document;
			if(!idoc)       return;
			var iform = idoc.expertconf_gamingvpnstatus;
			if(!iform)      return;

			iform.submit();
		}
	, period);
}
</script>
