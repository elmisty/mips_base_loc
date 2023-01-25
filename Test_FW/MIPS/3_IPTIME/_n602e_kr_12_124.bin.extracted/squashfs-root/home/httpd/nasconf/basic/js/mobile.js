//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
var result_submit_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

var printData = '';
//local-global variables end
function getMountSize(slotnumber, idx)
{
	var count = 0;
	for(var key in status_data["device" + slotnumber][idx])
		if(key.indexOf("storage") >= 0)
			count++;
	return count;
}

function hasStorageInfo(object)
{
	if(!object.storage0)
		return false;
	return true;
}

var dinfo = {
	service : {
		UNKNOWN		: 0x00,
		MASS_STORAGE	: 0x10,
		TETHERING	: 0x20,
		PRINTER		: 0x30
	},
	state : {
		UNKNOWN_MSG	: 0,
		CONNECTED_MSG	: 1,
		REMOVED_MSG	: 2,
		TETHERING_USE	: 3,
		TETHERING_NOTUSE_WANLINK : 4,
	}
}

function getDeviceType(device)
{
	return device.statusindex & 0xf0;
}

function getDeviceTypeString(index)
{
	switch(index)
	{
		case dinfo.service.UNKNOWN_DEVICE	: return M_lang["S_DEVICE_TEXT4"];
		case dinfo.service.MASS_STORAGE 	: return M_lang["S_DEVICE_TEXT1"];
		case dinfo.service.TETHERING		: return M_lang["S_DEVICE_TEXT2"];
		case dinfo.service.PRINTER		: return M_lang["S_DEVICE_TEXT3"];
		default					: return M_lang["S_DEVICE_TEXT4"];
	}
}

function getStatusString(object)
{
	switch(object.statusindex & 0xf)
	{
		case dinfo.state.CONNECTED_MSG		: return M_lang["S_USB_CONNECTED"];
		case dinfo.state.REMOVED_MSG		: return M_lang["S_USB_REMOVED"];
		case dinfo.state.TETHERING_USE		: return M_lang["S_USB_TETHERING"];
		case dinfo.state.TETHERING_NOTUSE_WANLINK : return M_lang["S_USB_WANLINK"];
		default :
			if(object.manufacturer)
				return object.manufacturer;
			else
				return M_lang["S_USB_UNKNOWN"];
	}
}

function getSizeDesc(object, index)
{
	return object["storage" + index].totalsize + M_lang["S_SIZE_TEXT1"] + object["storage" + index].freesize + M_lang["S_SIZE_TEXT2"];
}

function getMountName(object, index)
{
	var fileSysName = object["storage" + index].filesystem;
	if(fileSysName === "MOUNTING")
		fileSysName = M_lang["S_FILESYSTEM_STATE1"];
	return "/" + object["storage" + index].mountname + "(" + fileSysName + ")";
}

function getMountInfoDivSize(slotnumber, idx)
{
	var object = $('#device_'+slotnumber+'_'+idx);
	if(!object)
		return 0;
	return object.children("div").length - 1;
}

function removeMountInfoDiv(slotnumber, idx)
{
	$('#device_'+slotnumber+'_'+idx).children("div:not(:first-child)").remove();
}

function appendMountInfoDiv(slotnumber, idx, line_idx)
{
	var htmlStr = $("<div>").attr("class", "lc_line_div"), index = slotnumber + "_" + idx + '_' + line_idx;
	htmlStr.html([
	'<div class = "lc_left_div class_hide" id = "storage_info_div', index, '">',
	'	<div>',
	'		<p class = "lc_grayfont_text" sid = "S_DEVICE_TEXT6"></p>',
	'		<p class = "lc_grayfont_text" id = "mountName', index, '"></p>',
	'	</div>',
	'</div>',
	'<div class = "lc_right_div">',
	'	<div>',
	'		<p class = "lc_grayfont_text" id = "sizeDesc', index, '"></p>',
	'	</div>',
	'</div>'].join(''));
	htmlStr.appendTo($('#device_'+slotnumber+'_'+idx));
}

function appendSpoolInfoDiv(slotnumber, idx)
{
	var htmlStr = $("<div>").attr("class", "lc_line_div line2_left_p");
	htmlStr.html([
	'<div class = "lc_left_div">',
	'		<p class = "lc_grayfont_text" id = "row', slotnumber, '_', idx,'_line2_left_p"></p>',
	'</div>',
	'<div class = "lc_right_div">',
	'	<div>',
	'	</div>',
	'</div>'].join(''));
	htmlStr.appendTo($('#device_'+slotnumber+'_'+idx));
}

function makeDiv(slotnumber, idx)
{
	var type = getDeviceType(status_data["device" + slotnumber][idx]);
	removeMountInfoDiv(slotnumber, idx);
	if(type === dinfo.service.MASS_STORAGE)
	{
		var mountSize = getMountSize(slotnumber, idx), i = 0;
		while(i < mountSize)
			appendMountInfoDiv(slotnumber, idx, i++);
	}
	else if(type === dinfo.service.PRINTER)
	{
		appendSpoolInfoDiv(slotnumber, idx);
	}
}

function updateMountUmountButton(slotnumber, idx)
{
	var deleteDiv = $('#device_'+slotnumber+'_'+idx+' [sid="L_DELETE_DIV"]');
	deleteDiv.removeClass("class_hide");
	if(getMountSize(slotnumber, idx) > 0)
	{
		deleteDiv.find("img").attr("src", "/common/images/del_icon.png");
		deleteDiv.find("p").text(M_lang["S_DEVICE_TEXT5"]);
	}
	else
	{
		deleteDiv.find("img").attr("src", "/common/images/add_icon.png");
		deleteDiv.find("p").text(M_lang["S_DEVICE_TEXT8"]);
	}
}

function updateDeviceInfo(slotnumber, idx)
{
	var object = status_data["device" + slotnumber][idx];
	var device_type = getDeviceType(object);

	makeDiv(slotnumber,idx);
	updateMountUmountButton(slotnumber, idx);

	$('#device_'+slotnumber+'_'+idx+' [sid="L_DEVICE_INDEX"]').text(object.slotnumber);
	$('#device_'+slotnumber+'_'+idx+' [sid="L_DEVICE_STATUS"]').text("(" + getDeviceTypeString(device_type) + getStatusString(object) + ")");

	$('#device_'+slotnumber+'_'+idx).children("div").removeClass("class_hide");
	if(device_type === dinfo.service.MASS_STORAGE)
	{
		var size = getMountSize(slotnumber, idx), i = 0;
		while(i < size)
		{
			var line_idx = slotnumber + "_" + idx + "_" + i;
			if(hasStorageInfo(object))
			{
				$("#mountName" + line_idx).text(getMountName(object, i));
				$("#sizeDesc" + line_idx).text(getSizeDesc(object, i));
				$("#storage_info_div" + line_idx).removeClass("class_hide");
			}
			else
			{
				$("#storage_info_div" + line_idx).addClass("class_hide");
			}
			$('#device_'+slotnumber+'_'+idx+' [sid="L_DELETE_DIV"]').removeClass("class_hide");
			++i;
		}
	}
	else {
		$('#device_'+slotnumber+'_'+idx+' [sid="L_DELETE_DIV"]').addClass("class_hide");
	}

	if(device_type === dinfo.service.PRINTER)
	{
		if(status_data["device" + slotnumber][idx].spoolusedpercent >= 0)
			$("#row" + slotnumber + '_' + idx + "_line2_left_p").text(M_lang["S_CUPS_SPOOLSIZE"] + " " + status_data["device" + slotnumber][idx].maxspoolsize + M_lang["S_MB"]
				+ "(" + status_data["device" + slotnumber][idx].spoolusedpercent + "% " + M_lang["S_CUPS_SPOOLUSED"] + ")");
		else
			$("#row" + slotnumber + '_' + idx + "_line2_left_p").text(M_lang["S_CUPS_SPOOLSIZE"] + "(" + M_lang["S_CUPS_FAILED"] + ")");
	}
}


function ClearDeviceInfo(slotnumber, idx)
{
	$('#device_'+slotnumber+'_'+idx+' [sid="L_DEVICE_INDEX"]').text(slotnumber);
	$('#device_'+slotnumber+'_'+idx+' [sid="L_DEVICE_STATUS"]').text("(" + M_lang["S_DEVICE_TEXT7"] + ")");
	$('#device_'+slotnumber+'_'+idx+' [sid="L_DEVICE_MOUNTNAME"]').text();
	$('#device_'+slotnumber+'_'+idx+' [sid="L_DEVICE_SIZEDESC"]').text();
	$('#device_'+slotnumber+'_'+idx+' [sid="L_DELETE_DIV"]').addClass("class_hide");

	removeMountInfoDiv(slotnumber, idx);
}

function insert_dev_line(slotnumber, idx)
{
	var HTMLStr = '';

	HTMLStr += ('<div class="lc_row_div" id="device_'+slotnumber+'_'+idx+'" sid="L_DEVICE_ITEM">');
	HTMLStr += ('<div class="lc_line_div first_div"><div class="lc_left_div title_div">');
	HTMLStr += ('<p sid="S_DEVICE_TEXT0">'+M_lang["S_DEVICE_TEXT0"]+'</p><p sid="L_DEVICE_INDEX"></p>');
	HTMLStr += ('<p class="last_p" sid="L_DEVICE_STATUS"></p></div>');
	HTMLStr += ('<div class="lc_right_div"><div class="class_hide" sid="L_DELETE_DIV" id="del_'+slotnumber+'_'+idx+'"><img><p></p></div></div></div></div>');

	if(idx <= 0)
		$(HTMLStr).appendTo('#devlist');
	else if($('#device_'+slotnumber+'_'+(idx-1)).length > 0)
		$(HTMLStr).insertAfter('#device_'+slotnumber+'_'+(idx-1));
	else
		$(HTMLStr).prependTo('#devlist');

	$('#del_'+slotnumber+'_'+idx).unbind('click').on('click', function(){
		splitted = $(this).attr('id').split('_');
		if(!splitted || splitted.length != 3)	return;
		submit_local("main", splitted[1], splitted[2]);
	});
}

function get_slot_data_length(obj)
{
	var dlen = 0;

	if(obj){
		for(var ts in obj)	dlen += 1;
	}

	return dlen;
}

//local utility functions
iux_update_local_func['main'] = function(identifier)
{
	if( !config_data || !status_data)
		return;
	if(identifier == 'D'){
		var allport = parseInt(config_data.usbport);
		for(var slotnumber = 1; slotnumber <= allport; ++slotnumber)
		{
			if( status_data["device" + slotnumber] ){
				var dlen = get_slot_data_length(status_data["device" + slotnumber]);
				var idx = 0;
				for(; idx < dlen; idx++){
					if($('[id="device_'+slotnumber+'_'+idx+'"]').length == 0){
						insert_dev_line(slotnumber, idx);
					}
					updateDeviceInfo(slotnumber, idx);
				}
				if(idx == 0){
					if($('[id^="device_'+slotnumber+'"]').length != 1){
						$('[id^="device_'+slotnumber+'"]').remove();
						insert_dev_line(slotnumber, 0);
					}
					ClearDeviceInfo(slotnumber, 0);
				}
				else if($('[id^="device_'+slotnumber+'"]').length > idx){
					for(var tidx=$('[id^="device_'+slotnumber+'"]').length; tidx >= idx; tidx --){
						$('[id="device_'+slotnumber+'_'+tidx+'"]').remove();
					}
				}
			}else{
				$('[id^="device_'+slotnumber+'"]').remove();
				insert_dev_line(slotnumber, 0);
				ClearDeviceInfo(slotnumber, 0);
			}
		}
	}
}

add_listener_local_func['main'] = function()
{
}

submit_local_func['main'] = function(slotnumber, idx)
{
        $('#loading').popup('open');

	var localdata = [];
	localdata.push({name : "devicename", value : status_data["device" + slotnumber][idx].name});

	if(getMountSize(slotnumber, idx) > 0)
	        return iux_submit('remove', localdata);
	else
	        return iux_submit('mount', localdata);
}

//local utility functions end

$(document).ready(function() {
	window.tmenu = "nasconf";
	window.smenu = "basic";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	iux_update_local();
	iux_set_onclick_local();
}

function result_config()
{
	iux_update('C');	
	iux_update_local();
}

function iux_set_onclick_local()
{
	listener_add_local('main');
}

function iux_update_local(identifier)
{
        for(var articleName in iux_update_local_func)
                iux_update_local_func[articleName].call(this, identifier);
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
}

function submit_local(service_name, slotnumber, idx)
{
	if(submit_local_func[service_name].call(this, slotnumber, idx)){
	}
}

function result_submit(act, result)
{
        if(errorcode != "0")
        {
                alert(M_lang['S_UNKNOWN_ERROR_MSG'] + "(" + errorcode + ")");
        }
        if(result_submit_func[act])
                result_submit_func[act].call(this, result);
        iux_update('C');
        iux_update_local();
}

