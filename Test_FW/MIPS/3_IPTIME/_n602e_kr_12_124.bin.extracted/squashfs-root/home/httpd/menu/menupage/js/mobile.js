"use strict";
//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
//local-global variables end

//local utility functions

$(document).ready(function() {
	window.tmenu = "menu";
	window.smenu = "menupage";
	//window.smenu = "menu";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	iux_set_onclick_local();
	//console.log("hi");
	$('.cc_leftheader_div').find('p').remove();
	$('#logo').remove();

	var HTMLStr = "<div id='logo'><span>";
	HTMLStr +="<img src='/common/images/logo.png'><p sid='S_PRODUCT_CODE' id='product_code'></p></span></div>";
	$('.cc_leftheader_div').html(HTMLStr);


}

function iux_set_onclick_local()
{

}

function iux_update_local(identifier)
{
}


