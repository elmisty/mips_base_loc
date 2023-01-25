// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var ctr_init_func = [];
var listener_local_func=[];
var localpostdata = [];
var data_local = [];

var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_kor = /^([가-힣]|[0-9a-zA-Z]|[_]){1,32}$/;
var regExp_text = /^([0-9a-zA-Z]|[_]){1,32}$/;
/*---------- page run func----------*/
var item_list = [ "C_VPNSERVER_PPTP_RUN", "C_VPNSERVER_PPTP_MPPE", "C_VPNSERVER_L2TP_RUN", "C_VPNSERVER_L2TP_PSK" ];

$(document).ready(function()
{
	window.tmenu = "expertconf"; window.smenu = "vpn";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);

});

function loadLocalPage()
{
	ctr_init();
	add_listener_local();
	
	$(".ui-page").css("background-color", "#EEF1E6");

	iux_set_onclick_local("add");
	iux_set_onclick_local("modify");
	
}

function result_config()
{
}

function lock_object(selector, proptype)
{
	$(selector).prop(proptype, true);
	$(selector).parent().addClass('ui-state-disabled');
}

function unlock_object(selector, proptype)
{
	$(selector).prop(proptype, false);
	$(selector).parent().removeClass('ui-state-disabled');
}

function get_config_from_sid(sid) {
	var val = config_data;
	sid = sid.toLowerCase().split("_").slice(1);

	for(i = 0; i < sid.length; ++i) {
		if(val[sid[i]] === undefined) {
			if(typeof val === "object")
				return undefined;
			return val;
		}
		val = val[sid[i]];
	}
	if(typeof val === "object")
		return undefined;
	return val;
}

function has_changed_vpn_input(sid)
{
	var value = get_config_from_sid(sid);
	if(value === undefined)
		return false;
	var $target = $("[sid=" + sid + "]"), target_value;
	if($target.length === 0)
		return false;
	switch($target.attr("type")) {
	case "text":
	case "password":
		target_value = $target.val();
		break;
	case "radio":
		if(value === true)
			value = "1";
		else if(value === false)
			value = "0";
		target_value = $target.filter(":checked").val();
		break;
	default:
		return false;
	}
	return value !== target_value;
}

function has_changed()
{
	for(var i = 0; i < item_list.length; ++i)
		if(has_changed_vpn_input(item_list[i]))
			return true;
	return false;
}
//init
ctr_init_func['init'] = function()
{
	$(".lc_row .ui-radio label").css("background-color","#FAFAF7");
	$(".lc_row").css("background-color","#FAFAF7");
	$(".vpn_enteradd").css("background-color", "#EEF1E6");
	$(".vpn_entermodify").css("background-color", "#EEF1E6");
	
	get_accountlist('ACCOUNTLIST');
	iux_update("C");
	iux_update("S");

	var accountlist = config_data.accountlist;
	if(accountlist.length <= 1)
		$('[sid="ACCOUNTLIST_TITLEBAR"]').hide();
	else
		$('[sid="ACCOUNTLIST_TITLEBAR"]').show();

	if(config_data.vpnserver.pptp === undefined)
		$(".row_pptp").remove();
	if(config_data.vpnserver.l2tp === undefined)
		$(".row_l2tp").remove();
	else {
		if(config_data.vpnserver.l2tp.plugin === undefined)
			$(".row_l2tp_plugin").remove();
		if(config_data.vpnserver.l2tp.psk_maxlength)
			$("[sid=C_VPNSERVER_L2TP_PSK]").attr("maxlength", config_data.vpnserver.l2tp.psk_maxlength)
	}

	item_list.forEach(function(x) {
		var $target = $('[sid="' + x + '"]');
		if($target.length == 0)
			return;

		var value = get_config_from_sid(x);
		if(value == null)
			return;

		set_init_value($target, value);
		set_event($target);
	});
	lock_object("[sid=S_BUTTON_SUBMIT]", "disabled");
	$("[sid=S_BUTTON_SUBMIT]").unbind().click( submit_event );

	function set_init_value($target, value) {
		switch($target.attr("type"))
		{
		case "slider":
			$target.val(value?"1":"0");
			break;
		case "radio":
			if($target.is(":checked") === false)
				$target.filter(function() { return ($(this).val() === "1") === value;}).prop("checked", true).checkboxradio("refresh");
			break;
		case "text":
		case "password":
			$target.val(value);
			break;
		default:
			break;
		}
	}
	function set_event($target) {
		$target.unbind();
		switch($target.attr("type"))
		{
		case "slider":
			break;
		case "radio":
			$target.change(check_changes);
			break;
		case "text":
		case "password":
			$target.keyup(check_changes);
			break;
		default:
			break;
		}
	}
	function check_changes() {
		if(has_changed())
			unlock_object("[sid=S_BUTTON_SUBMIT]", "disabled");
		else
			lock_object("[sid=S_BUTTON_SUBMIT]", "disabled");
	}
	function submit_event() {
		if($("[sid='C_VPNSERVER_L2TP_RUN']:checked").val() == "1" && $('[sid="C_VPNSERVER_L2TP_PSK"]').val().length == 0)
		{
			alert(M_lang["S_L2TP_PSK_WARNING"]);
			return;
		}
		
		$("#loading").popup("open");
		iux_submit("apply");
	}
};

listener_local_func['init'] = function()
{
	item_list.forEach(function(x) {
		var target = $('[sid="' + x + '"]');
//		if(target.attr("type") == "slider")
	});
	$('[sid="L2TP_PSK_CHECK"]').change(function()
	{
		var pw_check = $('[sid="L2TP_PSK_CHECK"]:checked').val()?1:0;
		if(pw_check)
			$('[sid="C_VPNSERVER_L2TP_PSK"]').attr("type","text");
		else
			$('[sid="C_VPNSERVER_L2TP_PSK"]').attr("type","password");
	});
};

//add
ctr_init_func['add'] = function()
{
	get_accountlist('ACCOUNTLIST');
	iux_update("C");
	iux_update("S");

	$('[sid="SHOW_PASSWD"] label').css("background-color","#FFFFFF");
	var vpninfo = config_data.vpnserver;
	if(vpninfo.ipaddr && vpninfo.subnet);
		insert_ipaddr('ACCOUNTLIST_IPADDR', vpninfo.ipaddr, vpninfo.subnet); 
	if(vpninfo.defaultadmin == "1")
	{
		$('[sid="ADD_CAPTCHA_CODE"]').val("");
		get_captcha_img();
		$('[sid="ADD_CAPTCHA_CODE"]').attr('placeholder',M_lang["S_PLEASE_INPUT_CAPTCHA_CODE"]);
		$('[sid="CAPTCHA_FIELD"]').show();
	}
	else
		$('[sid="CAPTCHA_FIELD"]').hide();
};

listener_local_func['add'] = function()
{
	$('[sid="PW_CHECK"]').change(function()
	{
		var pw_check = $('[sid="PW_CHECK"]:checked').val()?1:0;
		if(pw_check)
			$('[sid="ADD_PASSWORD"]').attr("type","text");
		else
			$('[sid="ADD_PASSWORD"]').attr("type","password");
	});

	$('[sid="CAPTCHA_REFRESH"]').click(function() 
	{
		get_captcha_img();
		$('[sid="ADD_CAPTCHA_CODE"]').val("");
		//$('[sid="ADD_CAPTCHA_CODE"]').focus();	
	});
	$('[sid="ADD_SUBMIT"]').click(function() 
	{
		var input_ip = convert_textfield_to_string('ACCOUNTLIST_IPADDR');
		var input_id = $('[sid="ADD_ACCOUNT_ID"]').val();
		var input_pw = $('[sid="ADD_PASSWORD"]').val();
		var input_captcha_code = $('[sid="ADD_CAPTCHA_CODE"]').val();
		var filename;
		var accountlist = config_data.accountlist;
		
		/////
		if(accountlist.length > config_data.vpnserver.max_vpn_user)
		{
			$("#right_panel").panel("close");
			alert(M_lang["S_ADD_SUBMIT_ERROR_FULLUSER"] + config_data.vpnserver.max_vpn_user + M_lang["S_ADD_SUBMIT_ERROR_FULLUSER2"]);
			ctr_init_func['add'].call();
			return;
		}
		/////
		if( input_id == "" || check_input_error(input_id, regExp_text) )
		{
			$('[sid="ADD_ACCOUNT_ID"]').val("");
			alert(M_lang["S_ADD_SUBMIT_ERROR_ID"]);
			ctr_init_func['add'].call();
			return;
		}
		if( input_pw == "")
		{
			
			$('[sid="ADD_PASSWORD"]').val("");
			alert(M_lang["S_ADD_SUBMIT_ERROR_PW"]);
			ctr_init_func['add'].call();
			return;
		}
		if( input_ip == "..." || check_input_error(input_ip, regExp_ip) )
		{
			$('[sid="ACCOUNTLIST_IPADDR"] input:enabled').val("");
			alert(M_lang["S_ADD_SUBMIT_ERROR_IP"]);
			ctr_init_func['add'].call();
			return;
		}
		if( config_data.vpnserver.defaultadmin == "1")
		{
			
			filename = data_local.captcha.filename;
			if( filename == "" || input_captcha_code == "" )
			{
				alert(M_lang["S_ADD_SUBMIT_FAIL_CAPTCHA"]);
				ctr_init_func['add'].call();
				return;
			}
		}

		var accountlist = config_data.accountlist;
		if(accountlist.length > 1)
		{
			for(var i=0; i < accountlist.length-1; i++)
			{
				if( accountlist[i].account == input_id)
				{
					$('[sid="ADD_ACCOUNT_ID"]').val("");
					$('[sid="ADD_PASSWORD"]').val("");
					$('[sid="ACCOUNTLIST_IPADDR"] input:enabled').val("");
					alert(M_lang["S_ADD_SUBMIT_ERROR_SAMEID"]);
					ctr_init_func['add'].call();
					return;
				}
					
			}
		}

		localpostdata = [];
		localpostdata.push({name : 'captcha_file', value : filename });
		localpostdata.push({name : 'ip', value : input_ip });

		$("#loading").popup("open");
		iux_submit('add' , localpostdata, true, null, 'local_add_form');
	});
};

//modify
ctr_init_func['modify'] = function()
{
	get_accountlist('ACCOUNTLIST');
	iux_update("C");
	iux_update("S");

	get_accountlist('MODIFY_ACCOUNTLIST','modify');
	$('[sid="MODIFY_ACCOUNTLIST"] li:even').css("background-color","#FFFFFF");
	$('[sid="MODIFY_ACCOUNTLIST"] li:odd').css("background-color","#FFFFFF");
	$('[sid="MODIFY_ACCOUNTLIST"] .ui-checkbox:even label').css("background-color","#FFFFFF");
	$('[sid="MODIFY_ACCOUNTLIST"] .ui-checkbox:odd label').css("background-color","#FFFFFF");



	var accountlist = config_data.accountlist;
	if(accountlist.length <= 1)
		$('[sid="BUTTON_DEL_FEILD"]').hide();
	else
		$('[sid="BUTTON_DEL_FEILD"]').show();

	iux_update("S");
	

};
listener_local_func['modify'] = function()
{
	$('[sid="CHECKALL"]').change(function() {
	var m_checkall = $('[sid="CHECKALL"]:checked').val();
	if(m_checkall)
		$('[sid="MODIFY_ACCOUNTLIST"] input').prop('checked', 'checked').checkboxradio("refresh");
	else
		$('[sid="MODIFY_ACCOUNTLIST"] input').removeAttr('checked').checkboxradio("refresh");
	});
	$('[sid="BUTTON_DISCONNECT"]').click(function() 
	{
		var count = 0;
		$("[sid^='check_']").each(function()
		{
			if( $(this).is(':checked') )
				++count;

		});
		if(count > 0)
		{
			localpostdata = [];
			localpostdata.push({name : 'mode', value : "disconnect" });
			$("#loading").popup("open");
			iux_submit('modify' , localpostdata, true, null, 'local_modify_form', 5000);
		}
		else
		{
			alert(M_lang["S_SUBMIT_NO_ITEM"]);
			return;
		}
	});
	$('[sid="BUTTON_DELETE"]').click(function() 
	{
		var count = 0;
		$("[sid^='check_']").each(function()
		{
			if( $(this).is(':checked') )
				++count;

		});
		if(count > 0)
		{
			localpostdata = [];
			localpostdata.push({name : 'mode', value : "delete" });
			$("#loading").popup("open");
			iux_submit('modify' , localpostdata, true, null, 'local_modify_form');
		}
		else
		{
			alert(M_lang["S_SUBMIT_NO_ITEM"]);
			return;
		}
	});
};

function iux_update_local(id)
{ 
	function set_account_status()
	{
		var accountstatus = status_data.accountstatus;
		if(accountstatus.length > 1)
		{
			for(var i=0; i < accountstatus.length-1; i++)
			{
				$('[sid="ACCOUNT_'+accountstatus[i].account+'"] p').text(M_lang[accountstatus[i].status])
			}
		}
	}
	function set_l2tp_status()
	{
		var msg, suffix;
		if(!config_data || !status_data)
			return;

		if(!config_data.vpnserver.l2tp || !config_data.vpnserver.l2tp.plugin)
			return;

		switch(status_data.vpnserver.l2tp.status)
		{
			case "L2TP_PLUGIN_FAILED_DOWNLOAD":
				msg = "S_L2TP_PLUGIN_FAILED_DOWNLOAD";
				break;
			case "L2TP_PLUGIN_UNKNOWN_STATUS":
				if(config_data.vpnserver.l2tp.run)
					msg = "S_L2TP_PLUGIN_INSTALLING";
				else
					msg = "S_L2TP_STOPPED";
				break;
			case "L2TP_PLUGIN_NOT_EXIST":
			case "L2TP_PLUGIN_TRYING_DOWNLOAD":
			case "L2TP_PLUGIN_DOWNLOAD_COMPLETE":
			case "L2TP_PLUGIN_UNPACKING":
				msg = "S_L2TP_PLUGIN_INSTALLING";
				break;
			default:
				if(config_data.vpnserver.l2tp.run)
					msg = "S_L2TP_RUNNING";
				else
					msg = "S_L2TP_STOPPED";
				break;
		}
		switch(msg)
		{
		case "S_L2TP_PLUGIN_FAILED_DOWNLOAD":
		case "S_L2TP_RUNNING":
		case "S_L2TP_STOPPED":
			suffix = "";
			break;
		default:
			suffix = ".";
		}
		if(msg)
		{
			var status_text = $("[sid=L2TP_PLUGIN_STATUS_STR]").text();
			if(status_text.replace(/\./g,"") !== M_lang[msg] || status_text.replace(/[^\.]/g,"").length > 5)
				status_text = M_lang[msg];
			$("[sid=L2TP_PLUGIN_STATUS_STR]").text(status_text + suffix);
		}
	}

	if(id == "D")
	{
		set_account_status();
		set_l2tp_status()
	}
}

function ctr_init(actname)
{
	actname = actname || "init";
	ctr_init_func[actname]();
}

function add_listener_local(actname)
{
	actname = actname || "init";
	listener_local_func[actname]();
}

function get_accountlist(sid,actname)
{
	var accountlist = config_data.accountlist;

	$('[sid="'+sid+'"]').find('li').remove();
	if(accountlist.length > 1)
	{
		for(var i=0; i < accountlist.length-1; i++)
		{
			if(actname == 'modify')
			{
				var checkid = 'check_'+i;
				$('[sid="'+sid+'"]').append('<li class="modifyaccount_item"><a href="#" onclick="checktest(\''+checkid+'\'); return false;" data-icon="false">'
				+ '<div class="title"><p>'+accountlist[i].account+'</p></div>'
				+ '<div class="ipaddr"><p>'+accountlist[i].ip+'</p></div>'
				+ '<div sid="ACCOUNT_'+accountlist[i].account+'" class="status"><p></p></div>'
				+ '<div class="check ui-alt-icon">'
				+ '<input name="account"  sid="check_'+i+'" id="check_'+i+'" type="checkbox" value="'+accountlist[i].account+'">'
				+ '<label for="check_'+i+'"></label></div></li>');
			}
			else
			{
				$('[sid="'+sid+'"]').append('<li class="vpn_account_list_item">'
				 + '<div><p>'+accountlist[i].account+'</p></div>'
				 + '<div><p>'+accountlist[i].ip+'</p></div>'
				 + '<div sid="ACCOUNT_'+accountlist[i].account+'"><p class="colorgray"></p></div></li>');
			}
		}

		$('[sid="'+sid+'"] li:even').css("background-color","#FAFAF7");
		$('[sid="'+sid+'"] li:odd').css("background-color","#FAFAF7");
		$('[sid="'+sid+'"]').trigger('create');
	}	
}

function checktest(id)
{
	var checked = $('#'+id).is(':checked');

	if(checked)
		$('#'+id).removeAttr('checked').checkboxradio("refresh");
	else
		$('#'+id).prop('checked', 'checked').checkboxradio("refresh");	
}


function get_captcha_img()
{
	$.ajaxSetup({ timeout: 5000  });
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
			var filename = data_local.captcha.filename;
			if(filename)
			{
				$('[sid="CAPTCHA_IMG"]').find('img').remove();
				$('[sid="CAPTCHA_IMG"]').append('<img style="width:100%; height:80%" src="/captcha/'+filename+'.gif">');
			}
		}
	})
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

function iux_set_onclick_local(actname)
{
	var Uactname = actname.toUpperCase();
	var Uactname = Uactname+"_ACCOUNT";
	//if(actname=='add')	$("#rignt_panel").css("background-color", "#FFFFFF");
	//else			$("#rignt_panel").css("background-color", "#EEF1E6");	

	$('[sid="'+Uactname+'"]').on('click', function()
	{
		load_rightpanel(actname); 
		
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
}

function load_rightpanel(actname) 
{
	if(actname=='add') $("#right_panel").css("background-color", "#FFFFFF");		
	else	$("#right_panel").css("background-color", "#F9F9F9");	
	
	$.ajaxSetup({ async : true, timeout : 20000 });
		$("#right_content").load('html/'+actname+'.html', function(responseTxt, statusTxt, xhr) {
				if (statusTxt == "success")
				{
					$(this).trigger('create');	
					load_header(RIGHT_HEADER, actname);
					ctr_init(actname);
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

function result_submit( act, result )
{
	switch( act ) {
	case "add" :
		if( result )
		{
			$("#loading").popup("close");
			$("#right_panel").panel("close");
			//alert(M_lang["S_ADD_SUBMIT_SUCCESS"]);
			ctr_init_func['init'].call();
			ctr_init_func['add'].call();
		}
		else
		{
			$("#loading").popup("close");
			if(errorcode == 11)
			{
				alert(M_lang["S_ADD_SUBMIT_FAIL_CAPTCHA"]);
				ctr_init_func['add'].call();
			}
			else
			{
				alert(M_lang["S_ADD_SUBMIT_FAIL"]);
				ctr_init_func['add'].call();
			}
		}
		break;
	case "modify" :
		if( localpostdata[0].value === "delete" )
		{
			if( result )
			{
				$("#loading").popup("close");
				$("#right_panel").panel("close");
			}
			else
			{
				$("#loading").popup("close");
				alert(M_lang["S_MODIFY_DELSUBMIT_FAIL"]);
			}
		}
		else if( localpostdata[0].value === "disconnect" )
		{
			if( !result )
			{
				$("#loading").popup("close");
				alert(M_lang["S_MODIFY_DISSUBMIT_FAIL"]);
			}
			var accountlist = config_data.accountlist;
			if(accountlist.length > 1)
			{
				for(var i=0; i < accountlist.length-1; i++)
				{
					$('[sid=STATUSMSG_'+i+'] p').attr('sid',accountlist[i].status);
				}
			}
			$("#right_panel").panel("close");
		}
		ctr_init_func['init'].call();
		ctr_init_func['modify'].call();
		break;
	case "apply" :
		var accountlist = config_data.accountlist;
		if(accountlist.length > 1)
		{
			for(var i=0; i < accountlist.length-1; i++)
			{
				$('[sid=STATUSMSG_'+i+'] p').attr('sid',accountlist[i].status);
			}
		}
		ctr_init_func['init'].call();
		break;
	}
}
