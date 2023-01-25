// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var ctr_init_func = [];
var data_local=[];
var localpostdata = [];
var waninfo = ["dynamic","static","pppoe"];
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mtu =  /^[0-9]{1,4}$/;
var regExp_lcp =  /^[0-9]{1,3}$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
var regExp_kor = /^([가-힣]|[0-9a-zA-Z]|[_]){1,32}$/;
var regExp_text = /^([0-9a-zA-Z]|[_]){1,32}$/;
var confirm_name = '';
var alerted = 0;
var org_ig = '';
var org_id = '';

/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "netinfo"; window.smenu = "laninfo";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function iux_update_local(id)
{
	$("[sid=\"lanpcinfo\"] a").css("background-color","#F8F8F5");
}

function loadLocalPage()
{
	ctr_init();
	add_listener_local();
}

function result_config( result )
{
	$(".lc_row:visible:even .ui-checkbox label").css("background-color","#FFFFFF");
	$(".lc_row:visible:even .ui-radio label").css("background-color","#FFFFFF");
	$(".lc_row:visible:even").css("background-color","#FFFFFF");
	$(".lc_row:visible:odd .ui-checkbox label").css("background-color","#FFFFFF");
	$(".lc_row:visible:odd .ui-radio label").css("background-color","#F9FAF5");
	$(".lc_row:visible:odd").css("background-color","#FFFFFF");

	if( result && $('#loading_reboot').parent().hasClass("ui-popup-hidden"))
	{
		iux_update("C");
		ctr_hubap();
		ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
	}
}

function ctr_init(actname)
{
	if(!actname)
	{
		ctr_enable("S_BUTTON_SUBMIT", false);
		iux_set_onclick_local("lanpcinfo");
		iux_update("C");
		ctr_hubap();
	}
	switch (actname)
	{
		case "lanpcinfo":
			get_mgraddrlist(actname);
			break;
	}
}

function ctr_hubap()
{
	var m_hubap = $('[sid="C_LANINFO_HUBAPUSING"]:checked').val();
	var m_gw = $('[sid="C_LANINFO_MGW"]:checked').val();
	var m_dns = $('[sid="C_LANINFO_MDNS"]:checked').val();

	ctr_enable("C_LANINFO_GATEWAY",m_hubap, true);
	ctr_enable("C_LANINFO_FDNS",m_hubap, true);
	ctr_enable("C_LANINFO_SDNS",m_hubap, true);
	ctr_enable("C_LANINFO_MDNS",m_hubap);
	ctr_enable("C_LANINFO_MGW",m_hubap);

	if(!m_gw){
		ctr_enable("C_LANINFO_GATEWAY",m_gw, true);
	}
	if(!m_dns){
		ctr_enable("C_LANINFO_FDNS",m_dns, true);
		ctr_enable("C_LANINFO_SDNS",m_dns, true);
	}
	ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
}

function get_mgraddrlist(actname)
{
	$.ajaxSetup({ timeout: 5000  });
	$.getJSON('/cgi/iux_get.cgi', {
		tmenu : window.tmenu,
		smenu : window.smenu,
		act : "status"
	})
	.done(function(data)
	{
		if(json_validate(data, '') == true)
		{
			data_local = data;
			var targetlistname;
			var noitemmsg;
			
			targetlistname = data_local.addlist;
			noitemmsg = M_lang["S_LANPCINFO_NO_ITEM"];

			$('[sid="N_ADDMGRLIST"]').find('li').remove();
			if(targetlistname.length > 1)
			{
				for(var i=0; i < targetlistname.length-1; i++)
				{
					var m_dynamic, m_connect_type, m_hostname;
					
					if(targetlistname[i].dynamic == 1)
						m_dynamic = ":"+M_lang["S_DYNAMIC_ALLOC"]
					else
						m_dynamic = ":"+M_lang["S_STATIC_ALLOC"];

					m_connect_type = M_lang[targetlistname[i].connect_type];
					if(!targetlistname[i].hostname && targetlistname[i].hostname == "")
						m_hostname = '';		
					else
						m_hostname = ' / '+targetlistname[i].hostname;
					
					$('[sid="N_ADDMGRLIST"]').append('<li sid="idx_'+i+'" class="addrmgr"><a href="#" data-icon="false">'
					+ '<div class="title_row"><div class="title"><p>'+targetlistname[i].ipaddr+' ('+targetlistname[i].hwaddr+')</p></div>'
					+ '<div class="subtitle"><p>'+m_connect_type+m_dynamic+m_hostname+'</p></div>'
					+ '</div></a></li>');
				}
			}
			else
			{
				$('[sid="N_ADDMGRLIST"]').append('<li sid="idx_'+i+'" class="addrmgr"><a href="#" data-icon="false">'
				+ '<div class="title_row"><div class="title"><p style="line-height: 3em;">'+noitemmsg+'</p></div>'
				+ '</div></a></li>');
			}
			$('[sid="N_ADDMGRLIST"]').listview( "refresh" );
			$('[sid="N_ADDMGRLIST"]').trigger('create');
			$('[sid=\"N_ADDMGRLIST\"] li').on('click',function(e){
				if(!e)	e = window.event;
				e.stopPropagation();	e.preventDefault();
			});
			$('[sid="N_ADDMGRLIST"] li>a').removeClass("ui-btn-icon-right");
			$('[sid="N_ADDMGRLIST"] li>a:even').css("background-color","#FFFFFF");
			$('[sid="N_ADDMGRLIST"] li>a:odd').css("background-color","#FFFFFF");
		}
	});
}

function get_int_network()
{
	$('[sid="REBOOT_MSG"]').text(M_lang['S_SEARCHING_INT_MSG']);
	$('#loading_reboot').popup('open');

	$.ajaxSetup({ timeout: 10000  });
	$.getJSON('/cgi/iux_get.cgi', {
		tmenu : window.tmenu,
		smenu : window.smenu,
		act : "data"
	})
	.done(function(data)
	{
		if(json_validate(data, '') == true)
                {
                        data_local = data;

			if(data_local.landata.gw == '' || data_local.landata.fdns == ''){
				$('#loading_reboot').popup('close');
				$('[sid="PENDING_MSG1"]').text(M_lang['S_SEARCHING_FAILED_MSG1']);
				$('[sid="PENDING_MSG2"]').text(M_lang['S_SEARCHING_FAILED_MSG2']);
				$('#loading_pending').popup('open');
				setTimeout(function(){$('#loading_pending').popup('close');},3000);
				$('[sid="C_LANINFO_MGW"]').prop('checked', 'checked').checkboxradio("refresh");
				$('[sid="C_LANINFO_MDNS"]').prop('checked', 'checked').checkboxradio("refresh");
				ctr_hubap();
				return;
			}

			var value = data_local.landata.gw;
			org_ig = value;
			var value_arr = value.split('.');
			
			for(var i = 0; i < value_arr.length; i++){
				$('[sid=\"C_LANINFO_GATEWAY\"] [sid=\"VALUE'+i+'\"]').val(value_arr[i]);
			}

			value = data_local.landata.fdns;
			org_id = value;
			value_arr = value.split('.');
			
			for(var i = 0; i < value_arr.length; i++){
				$('[sid=\"C_LANINFO_FDNS\"] [sid=\"VALUE'+i+'\"]').val(value_arr[i]);
				$('[sid=\"C_LANINFO_SDNS\"] [sid=\"VALUE'+i+'\"]').val('');
			}
		}
		$('#loading_reboot').popup('close');
		$('[sid="PENDING_MSG1"]').text(M_lang['S_SEARCHING_SUCCESS_MSG']);
		$('[sid="PENDING_MSG2"]').text('');
		$('#loading_pending').popup('open');
		setTimeout(function(){$('#loading_pending').popup('close');},3000);
	}).fail(function(jqxhr, textStatus, error){
		$('#loading_reboot').popup('close');
		$('[sid="PENDING_MSG1"]').text(M_lang['S_SEARCHING_FAILED_MSG1']);
		$('[sid="PENDING_MSG2"]').text(M_lang['S_SEARCHING_FAILED_MSG2']);
		$('#loading_pending').popup('open');
		setTimeout(function(){$('#loading_pending').popup('close');},3000);
		$('[sid="C_LANINFO_MGW"]').prop('checked', 'checked').checkboxradio("refresh");
		$('[sid="C_LANINFO_MDNS"]').prop('checked', 'checked').checkboxradio("refresh");
		ctr_hubap();
	});
}

function add_listener_local(actname)
{
	$('[sid="S_BUTTON_SUBMIT"]').click(function() {
		if(!check_presubmit_local()) return;
		confirm_name = 'reboot';
		events.confirm({ msg: M_lang['S_REBOOT_ALERT_MSG'], runFunc: function( flag ) {}});
	});	

	$('[sid="C_LANINFO_HUBAPUSING"]').change(function()
	{
		var m_hubap = $('[sid="C_LANINFO_HUBAPUSING"]:checked').val();
		if(m_hubap){
			confirm_name = 'hubap';
			events.confirm({ msg: M_lang['S_HUBAP_ALERT_MSG'], runFunc: function( flag ) {}});
		}else{
			$('[sid="C_LANINFO_MGW"]').removeAttr('checked').checkboxradio("refresh");
			$('[sid="C_LANINFO_MDNS"]').removeAttr('checked').checkboxradio("refresh");
			$('[sid=\"C_LANINFO_GATEWAY\"] [sid^=\"VALUE\"]').val('');
			$('[sid=\"C_LANINFO_FDNS\"] [sid^=\"VALUE\"]').val('');
			$('[sid=\"C_LANINFO_SDNS\"] [sid^=\"VALUE\"]').val('');
		}
		ctr_hubap();
		ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
	});

	$('[sid="C_LANINFO_MGW"]').change(function()
	{
		var m_gw = $('[sid="C_LANINFO_MGW"]:checked').val();
		ctr_enable("C_LANINFO_GATEWAY",m_gw, true);
		ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
	});
	$('[sid="C_LANINFO_MDNS"]').change(function()
	{
		var m_dns = $('[sid="C_LANINFO_MDNS"]:checked').val();
		ctr_enable("C_LANINFO_FDNS",m_dns, true);
		ctr_enable("C_LANINFO_SDNS",m_dns, true);
		ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
	});

	listener_textgroup("C_LANINFO_IP");
	listener_textgroup("C_LANINFO_NETMASK");
	listener_textgroup("C_LANINFO_GATEWAY");
	listener_textgroup("C_LANINFO_FDNS");
	listener_textgroup("C_LANINFO_SDNS");
}
function readyforsubmit_ip()
{
	var current_ip = convert_textfield_to_string('C_LANINFO_IP');
	if( current_ip == "..." || check_input_error(current_ip, regExp_ip) )
	{
		alert(M_lang["S_INVALID_IPADDRESS_STRING"]);
		return false;
	}

	var wan1subnet =  config_data.laninfo.wan1subnet;
	var s_wan1subnet = wan1subnet.split(".");
	var s_current_ip = current_ip.split(".");
	var netmaskArray = config_data.laninfo.netmask.split(".");
	for (var i = 0; i < 4; ++i)
	{
		if( s_wan1subnet[i] != ( s_current_ip[i] & netmaskArray[i] ) )
			return true;
	}
	alert(M_lang["S_INVALID_SAME_EXT_INT_NETWORK"]);
	return false;
}

function readyforsubmit_netmask()
{
	var current_netmask = convert_textfield_to_string('C_LANINFO_NETMASK');
	if( current_netmask == "..." || check_input_error(current_netmask, regExp_ip) )
	{
		alert(M_lang["S_INVALID_NETMASKADDRESS_STRING"]);
		return false;
	}
	return true;
}

function readyforsubmit_gw()
{
	var m_hubap = $('[sid="C_LANINFO_HUBAPUSING"]:checked').val();
	if(!m_hubap)	return true;

	var current_netmask = convert_textfield_to_string('C_LANINFO_GATEWAY');
	if( current_netmask == "..." || check_input_error(current_netmask, regExp_ip) )
	{
		alert(M_lang["S_INVALID_GATEWAYADDR_STRING"]);
		return false;
	}
	return true;
}

function readyforsubmit_dns()
{
	var m_hubap = $('[sid="C_LANINFO_HUBAPUSING"]:checked').val();
	if(!m_hubap)	return true;

	var current_netmask = convert_textfield_to_string('C_LANINFO_FDNS');
	if( current_netmask == "..." || check_input_error(current_netmask, regExp_ip) )
	{
		alert(M_lang["S_INVALID_DNSADDR_STRING"]);
		return false;
	}
	current_netmask = convert_textfield_to_string('C_LANINFO_SDNS');
	if( current_netmask != "..." && check_input_error(current_netmask, regExp_ip) )
	{
		alert(M_lang["S_INVALID_DNSADDR_STRING"]);
		return false;
	}
	return true;
}

function readyforsubmit_checksamesubnet()
{
	var m_hubap = $('[sid="C_LANINFO_HUBAPUSING"]:checked').val();
	if(!m_hubap)	return true;

	var current_ip = convert_textfield_to_string('C_LANINFO_IP');
	var current_gw = convert_textfield_to_string('C_LANINFO_GATEWAY');
	var current_netmask = convert_textfield_to_string('C_LANINFO_NETMASK');
	
	var ipstr = current_ip.split('.');
	var maskstr = current_netmask.split('.');
	var gwstr = current_gw.split('.');

	for(var i = 0; i < 4; i++){
		if( (parseInt(ipstr[i]) & parseInt(maskstr[i])) != (parseInt(gwstr[i]) & parseInt(maskstr[i])) )
		{
			alert(M_lang["S_INVALID_PLZ_CHANGE"]);
			return false;
		}
	}
	return true;
}

function confirm_result_local(flag)
{
	if(confirm_name == 'hubap'){
		if(flag)
		{
			alerted = 1;
			$('[sid="C_LANINFO_HUBAPUSING"]').prop('checked', 'checked').checkboxradio("refresh");
			get_int_network();
		}else{
			$('[sid="C_LANINFO_HUBAPUSING"]').removeAttr('checked').checkboxradio("refresh");
		}
		ctr_hubap();
	}else if(confirm_name == 'reboot'){
		if(flag){
			localpostdata.push({name : 'reboot', value : '1' });
			localpostdata.push({name : 'alerted', value : alerted });

			localpostdata.push({name : 'ip', value :  convert_textfield_to_string('C_LANINFO_IP') });
			localpostdata.push({name : 'netmask', value :  convert_textfield_to_string('C_LANINFO_NETMASK') });

			var hubapusing = $('[sid="C_LANINFO_HUBAPUSING"]:checked').val();
			localpostdata.push({name : 'hubapusing', value : hubapusing });

			if(hubapusing){
				localpostdata.push({name : 'org_ig', value :  org_ig });
				localpostdata.push({name : 'org_id', value :  org_id });

				localpostdata.push({name : 'mgw', value : $('[sid="C_LANINFO_MGW"]:checked').val() });
				localpostdata.push({name : 'mdns', value : $('[sid="C_LANINFO_MDNS"]:checked').val() });

				localpostdata.push({name : 'gateway', value :  convert_textfield_to_string('C_LANINFO_GATEWAY') });
				localpostdata.push({name : 'fdns', value :  convert_textfield_to_string('C_LANINFO_FDNS') });
				localpostdata.push({name : 'sdns', value :  convert_textfield_to_string('C_LANINFO_SDNS') });
			}

			iux_submit("apply", localpostdata, true);
			var remaining = config_data.rebootsec?(parseInt(config_data.rebootsec)) : 60;
			reboot_timer(remaining);
			stopstatus = true;
			$('#loading_reboot').popup('open');

			if(config_data.laninfo.ip != convert_textfield_to_string('C_LANINFO_IP'))
				call_native("lan_ip_addr\n" + convert_textfield_to_string('C_LANINFO_IP'));
		}
	}
}

function result_submit(act, result)
{
}

function check_presubmit_local()
{
	var result = (readyforsubmit_ip() && readyforsubmit_netmask() && readyforsubmit_gw() && readyforsubmit_dns() && readyforsubmit_checksamesubnet());
	return result;
}

function listener_textgroup(sid)
{
	$('[sid="'+sid+'"] input').each(function()
	{
		$(this).attr('psid',sid);
		$(this).keyup(function() {
			var psid = $(this).attr('psid');
			var s_psid = psid.split("_");
			var config_ipvalue = eval("config_data."+s_psid[1].toLowerCase()+"."+s_psid[2].toLowerCase());
			var current_ipvalue = convert_textfield_to_string(psid);
			if(config_ipvalue == current_ipvalue)
			{
				if( check_change_value() )
					ctr_enable("S_BUTTON_SUBMIT", true );
				else
					ctr_enable("S_BUTTON_SUBMIT", false );
			}		
			else
			{
				if( check_change_value() )
					ctr_enable("S_BUTTON_SUBMIT", true );
				else
					ctr_enable("S_BUTTON_SUBMIT", true );
			}
		});
	});
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
	var type;
	if( $('[sid="'+sid+'"]').hasClass("ip") )
		type = "ip";
	else if( $('[sid="'+sid+'"]').hasClass("mac") )
		type = "mac";

	if(type == "ip")
	{
		var data = "";
		for(var i=0;i<4;i++)
		{
			data += $('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val();
			i != 3 ? data += "." : "";
		}
	}
	else
	{
		var data = "";
		for(var i=0;i<6;i++)
		{
			data += $('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val();
			i != 5 ? data += ":" : "";
		}
	}
	return data;
}
function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}

function reboot_timer(remaining)
{
	if(remaining == 0){	
		$('#loading_reboot').popup('close');
		alert(M_lang["S_REBOOT_RESULT"]);
	}
	else{
		$('[sid="REBOOT_MSG"]').text(M_lang['S_REBOOT_REMAINING_MSG1'] + remaining + M_lang['S_REBOOT_REMAINING_MSG2']);
		remaining --;
		setTimeout("reboot_timer("+remaining+")",1000);
	}
}

function iux_set_onclick_local(actname)
{
	$('[sid="'+actname+'"]').on('click', function() {	load_rightpanel(actname); })
	.on("mousedown touchstart", function() {
		$(this).find("a").addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
}

function load_rightpanel(actname) 
{
	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load('html/'+actname+'.html', function(responseTxt, statusTxt, xhr) {
		if (statusTxt == "success")
		{
			$(this).trigger('create');	
			load_header(RIGHT_HEADER, actname);
			ctr_init(actname);
			iux_update("C");
			iux_update("S");
			ctr_hubap();
			add_listener_local(actname);
		}
	});
}


function insert_ipaddr(sid, ip, subnet)
{
	var s_ip = ip.split(".");
	var s_subnet = subnet.split(".");
	
	for(var i=0;i<4;i++)
	{
		if(s_subnet[i] == "255")
		{
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
		}
	}
}


function addmanual_insert_ipaddr(sid, ip)
{
	var s_ip = ip.split(".");
	for(var i=0;i<4;i++)
	{
		if(s_ip[i] == 0)
		{
			if(i != 3 )
			{
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
				break;
			}
			else
				break;
		}
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
	}
}
