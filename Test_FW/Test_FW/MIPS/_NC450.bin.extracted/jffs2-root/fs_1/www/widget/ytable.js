				/*	sevenTables.init({
						holder: '.setting-contain-wireless-ctrl-table',
						emptytips: lang.ajax.wireless.scanempty,
						column: {
							count: 7,
							width: [320, 50, 120, 90, 50, 150, 50],
							display: ['block', 'block', 'block', 'none', 'none', 'block', 'none']
						},
						data: {
							json: json,
							option: ['SSID', 'Signal', 'AuthType', 'EncrypType', 'Channel', 'BSSID', 'HtExtCha']
						},
						row: 5,
						title: [ lang.wirelessConnect.listWirelessname,
								 lang.wirelessConnect.listSignal,  
								 lang.wirelessConnect.listSecurity, 
								 lang.wirelessConnect.listEncryption, 
								 lang.wirelessConnect.listChannel,	 
								 lang.wirelessConnect.listMacAddr, 
								 lang.wirelessConnect.listHtExtCha ],
						toolBar: {
							enable: false,
							pagination: {
								enable: true,
								paginationCount: 15, //默认每页显示条目数若paginationPageList为true则此选项失效
								paginationPageList: {
									enable: true,
									option: [6, 20, 30]
								},
								refresh: {
									enable: true,
									mode: 'ajax',
									ajax: {
										url: '/wireless_scan.fcgi',
										type: 'post',
										dataType: 'text',
										contentType: 'application/x-www-form-urlencoded;charset=utf-8',
										async: true,
										beforeSend: function() {
										//	alert(sevenTables.ajaxXhr);
										},
										success: function(response) {
											var json = jQuery.parseJSON(response);
											sevenTables.refresh(json.ApInfo);
											Wireless.initScanWireLess();
										},
										complete: function() {
											//	alert(sevenTables.ajaxXhr);
										},
										error: function(xhr) {
											//	alert(sevenTables.ajaxXhr);
										}
										}
							}
							}
						},
						scrollCtrl: {
							enable: true,
							height: 310,
							headerTdNum: 5
						}
					});*/

(function($){
	'use strict';
	//createTable类
	$.createTable = function(options){

		var _options = options;

		//create header
		
		var LASTITEM = -1; //最后一个显示不为none的元素序列
		var EXTRAPX = 19; //extra pix to fix the scrool
		var BODYWIDTH = 0;
		var hasScroll = false;
		var _height = _options.height ? _options.height : null;

		if (_options.data.json && _options.data.json.length > _options.row) {
			hasScroll = true;
		}

		for (var k = 0; k < _options.column.count; k++) {
			if (_options.column.display[k] != 'none') {
				BODYWIDTH += (_options.column.width[k] + 1);
			}
		}

		if (hasScroll) {
			BODYWIDTH += 16;
		}else{
			BODYWIDTH -= 1;
		}
		//console.log('scroll:'+hasScroll);
		//console.log(body_width);
		//find last display
		function getLastItem(args) {
			var _index = -1;
			for (var j = args.column.count - 1; j > -1; j--) {
				//console.log('j:'+j);
				if (args.column.display[j] != 'none') {
					_index = j;
					return _index;
				}
			}
		}

		//create table header
		function createHeader(args, extrapix) {

			var str_header = '<div class="plug-table-header" style="width:' + BODYWIDTH + 'px;overflow:hidden;">'
							+'<div style="width:'+(BODYWIDTH+20)+'px;">';

			var header_item = '';

			//lastitem = getLastItem(args);
			var extra = 0;
			for (var i = 0; i < args.column.count; i++) {

				//额外像素
				if (i == LASTITEM) {//last item
					if (hasScroll){
						extra = extrapix;
					} else {
						extra = 1;
					}					
				}

				var item = '<div class="plug-table-header-th" style="width:'+(args.column.width[i]+extra)
							+'px;height:25px; display:'+ args.column.display[i]+';">'
							+'<span>' + args.title[i] + '</span>'
							+'</div>';
				//console.log(item);
				header_item += item;	
			}
			str_header = str_header + header_item + '</div></div>';
			return str_header;
		}
		
		//create body
		function createBody(args) {//options.column, options.data, emptytips, initTips, row
			var body_item = '';

			if (typeof (args.data.json) == 'undefined' || args.data.json.length == 0) {//空 or 不存在
				
				if (args.data.initEmpty == true) {//if init empty

					body_item += '<div class="plug-table-body-tr">';		
					body_item  = '<div class="plug-table-body-th" style="width:' + (BODYWIDTH) + 'px;">'
								+'<span style="display:block;text-align:center;">' + args.initTips + '</span></div>';
								
				} else {
					body_item += '<div class="plug-table-body-tr">';		
					body_item  = '<div class="plug-table-body-th" style="width:' + (BODYWIDTH) + 'px;">'
							+'<span style="display:block;text-align:center;">' + args.emptytips + '</span></div>';
				}

			} else {

				var data_length = args.data.json.length;
				
				for (var i = 0; i < data_length; i++) {
			
					body_item += '<div class="plug-table-body-tr plug-table-body-tr-'+ i +'" style="width:800px; position: relative;">';
			
					var counter = 0;

					if (args.data.hidden && !args.data.json[i][args.data.option[args.data.hidden[0]]]) {
						body_item += '</div>';
						continue;
					}

					for (var k = 0; k < args.data.option.length; k++) {  //proptypes
						var key = args.data.json[i][args.data.option[k]];						
						if (counter == LASTITEM) {
							body_item += '<div class="plug-table-body-th table-th-last plug-table-body-th-' + counter + '"' 
								+'style = "width:' + (args.column.width[counter] + 1)
								+'px;height:' + _height + 'px;display:' + args.column.display[counter] + ';">'
					 			+'<span>' + key + '</span>'
					 			+'</div>';
						} else {
							body_item += '<div class="plug-table-body-th plug-table-body-th-' + counter + '"' 
								+'style = "width:' + args.column.width[counter] + 'px;'
								+'height:' + _height + 'px;'
								+'display:' + args.column.display[counter] + ';">'
					 			+'<span>' + key + '</span>'
					 			+'</div>';
						}	
						counter ++;			 	
					}
					body_item += '</div>';
				}
			}
				
				//console.log(body_width);
				var str_body ='';
				if (hasScroll) {
					str_body = '<div class="plug-table-body" style="width:'+BODYWIDTH+'px;'
								+'height:'+(31*args.row)+'px;">'
								+'<div class="plug-table-body-test" style="position:absolute;">';
				} else {
					str_body = '<div class="plug-table-body" style="width:'+BODYWIDTH+'px;'
								+'height:'+(31*args.row)+'px;">'
								+ '<div class="plug-table-body-test" style="float:left;">';
				}

				str_body = str_body + body_item +'</div></div>';
			 	//console.log(str_body);
			 	return str_body;
		}

		//creat toolBar
		function creatToolBar() {
			var selectItems = '';
			for (var i = 0; i < _options.toolBar.select.length; i++) {
				selectItems += '<div class="plug-tabel-toolbar-select">'
								+'<span class="plug-tabel-toolbar-title">'+_options.toolBar.select[i].id+'</span>'//title
								+'<select class="plug-tabel-toolbar-select-'+_options.toolBar.select[i].id
								+'" style="width:'+_options.toolBar.select[i].width+'px;">';//width
				for (var j = 0; j < _options.toolBar.select[i].option.length; j++) {
					selectItems += '<option value="'+_options.toolBar.select[i].value[j] +'">'
									+_options.toolBar.select[i].option[j]+'</option>';
				}
				selectItems += '</select></div>';
			}
			
			return '<div class="plug-table-toolbar" style="width:'+BODYWIDTH+'px;">'+selectItems+'</div>';
		}

		function updateItemHeight() {
			if (!_height) {
				setTimeout(function() {
					$('.plug-table-body-tr').each(function() {
						var _this = $(this);
						_this.find('.plug-table-body-th-'+LASTITEM).siblings().height(_this.find('.plug-table-body-th-'+LASTITEM).height());
					});
				}, 0);
			}
		}

		LASTITEM = getLastItem(_options);

		if (_options.reinitBody) { //header, body, toolbar width may change
			var StrHeader = createHeader(_options, EXTRAPX);
			var StrBody = createBody(_options);
			$('.plug-table-body').remove();
			$('.plug-table-header').remove();
			$('.plug-table-toolbar').before(StrHeader+StrBody);
			$('.plug-table-toolbar').css('width',BODYWIDTH);

			updateItemHeight();

			setTimeout(function(){
				$('.plug-table-body').addScroll();
			},0);
			return;
		}

		var StrBody = createBody(_options);
		var StrHeader = createHeader(_options, EXTRAPX);
		var StrToolBar = '';

		//toolBar
		if (_options.toolBar.enable == true) {
			StrToolBar = creatToolBar();			
		}

		var total_table = StrHeader + StrBody + StrToolBar;
		//total
		if (_options.returnStr == false) {	
			$(_options.holder).html('');
			$(_options.holder).html(total_table);
			//$('.plug-table-body-test .plug-table-body-th-3 span').each(function() {
				//$(this).text(Base64.decode($(this).text()));	
			//});
			updateItemHeight();

			setTimeout(function() {
				$('.plug-table-body').addScroll();
			},0);

			if (_options.mouseSelect) {
				createTableBind();
			}

		} else {
			return total_table;			
		}
	}

	function createTableBind() {
			var mousedown = 0;
			$('.plug-table-body-tr').mousedown(function(e) {
				mousedown = 1;
				//$(body).removeClass('plug-table-body-tr-selected');

			});
			$('.plug-table-body-tr').mouseup(function() {
				//$(this).addClass('plug-table-body-tr-selected');
					mousedown = 0;
					$('.plug-table-body-tr').removeClass('plug-table-body-tr-selected');
					$(this).addClass('plug-table-body-tr-selected');
					
					/*var a = '';
						a += '<div class="table-shade-layer">',
						a += '<div class="table-shade-layer-img-holder">',
						a += '<span class="table-shade-layer-img">',
						a += '</span>',
						a += '</div>',
						a += '</div>';
					$(this).append(a);
					$('.table-shade-layer').remove();*/

					Wireless.wirelessInfo.ssid = $(this).find(".plug-table-body-th-0 span").html();
					Wireless.wirelessInfo.auth = $(this).find(".plug-table-body-th-2 span").text();
					Wireless.wirelessInfo.channel = $(this).find(".plug-table-body-th-4 span").text();
					Wireless.wirelessInfo.encp = $(this).find(".plug-table-body-th-3 span").text();
					Wireless.wirelessInfo.HtExtCha = $(this).find(".plug-table-body-th-6 span").text();
					Wireless.wirelessInfo.wepkey = "";
					Wireless.wirelessInfo.wpakey = "";
					$("#wireless_network-auto-ssid").html(Wireless.wirelessInfo.ssid);
					Wireless.VIEW.infoshow(Wireless.wirelessInfo.auth);
					$("#wireless_connection-auto-wpakey").val("");
					$("#wireless_connection-auto-wepkey").val("");
			})

			$('.plug-table-body-tr').mouseover(function(){
				if (1 == mousedown) {
					$(this).find('.table-shade-layer').remove();
					$(this).addClass('plug-table-body-tr-selected');
					/*var a = '';
						a += '<div class="table-shade-layer">',
						a += '<div class="table-shade-layer-img-holder">',
						a += '<span class="table-shade-layer-img">',
						a += '</span>',
						a += '</div>',
						a += '</div>';
						$(this).append(a);*/
				}
				
			});
	}

	function toolBarAjax(original_data, args){
		var ajaxurl = args.url,
			ajaxtype = args.type || 'post',
			ajaxdataType = args.dataType || 'text',
			ajaxdata = args.data,
			ajaxcache = args.cache || false,
			ajaxcontentType = args.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
			ajaxtimeout = args.timeout || 0,
			ajaxasync = args.async || true,
			ajaxglobal = args.global || false,
			ajaxBeforeSend = args.beforeSend || function() {},
			ajaxsuccess = args.success || function() {},
			ajaxerror = args.error || function() {},
			ajaxcomplete = args.complete || function() {};

			$.ajax({
				url: ajaxurl,
				type: ajaxtype,
				dataType: ajaxdataType,
				data: ajaxdata,
				cache: ajaxcache,
				contentType: ajaxcontentType,
				timeout: ajaxtimeout,
				async: ajaxasync,
				global: ajaxglobal,
				beforeSend: function() {
					ajaxBeforeSend();
				},
				success: function(response) {
					ajaxdata = original_data;
					ajaxsuccess(response);
				},		
				complete: function(xhr) {
					ajaxcomplete(xhr);
				},
				error: function(xhr) {
					ajaxerror(xhr);
					return false;
				}
			});
	}
	
})(jQuery)
