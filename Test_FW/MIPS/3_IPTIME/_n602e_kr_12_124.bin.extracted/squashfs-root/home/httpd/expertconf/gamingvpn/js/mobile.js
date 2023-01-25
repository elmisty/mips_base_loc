"use strict";
//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
//local-global variables end

//local utility functions

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

function immediately_submit_event_add(service_name)
{
	if(check_change_value()){submit_local(service_name);}
}

//local utility functions end
iux_update_local_func['mudfish'] = function(identifier)
{
	if(identifier == 'D'){
		$('[sid=\"MUDRUN_STATUS\"]').text(M_lang[status_data.mudfish.stat]);
/*
		if(status_data.mudfish.ready == '1'){
			 $('[sid=\"L_SEARCH_BTN\"]').css('display', '');
			 $('.cc_iconbar').css('display', '');
		}else{
			 $('[sid=\"L_SEARCH_BTN\"]').css('display', 'none');
			 $('.cc_iconbar').css('display', 'none');
		}
*/
		$('[sid=\"L_SEARCH_BTN\"]').css('display', 'none');
		$('.cc_iconbar').css('display', 'none');
	}
}

add_listener_local_func['mudfish'] = function()
{
	sliderButtonEvent( { sid : 'C_MUDFISH_RUN', arguments : ['mudfish'], runFunc : immediately_submit_event_add } );
}

submit_local_func['mudfish'] = function()
{
	var localdata = [];
        $('#loading').popup('open');
        localdata.push({'name' : 'run', 'value' : $('[sid=\"C_MUDFISH_RUN\"]').val()});
        iux_submit('mudfish',localdata, false);
}

$(document).ready(function() {
	window.tmenu = "expertconf";
	window.smenu = "gamingvpn";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
        iux_update('C');
	iux_set_onclick_local();
}

function iux_set_onclick_local()
{
	$('[sid=\"L_SEARCH_BTN\"]').unbind('click').click(function(){
		$(location).attr('href', 'http://'+config_data.mudfish.addr+':'+config_data.mudfish.port).attr('target', '_blank');
        });
	listener_add_local('mudfish');
}

function iux_update_local(identifier)
{
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
	else if(identifier == 'D'){
		for(var articleName in status_data){
			if(config_data.hasOwnProperty(articleName) && articleName != ''){
				var caller_func = iux_update_local_func[articleName];
				if(caller_func){
					caller_func.call(this, identifier);
				}
			}
		}
	}
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
}

function submit_local(aname, localdata)
{
	submit_local_func[aname].call(this, localdata);
}
