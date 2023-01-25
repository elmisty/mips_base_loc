var SD = {
	clickTimer:null,
	getFileAjax: null,
	allowRequest: true,
	fileRenderInterval: null,
	getfilecount:0,
	GETFILESTEP:500, // the numbers of getting from back-end each time
	MAXFILE: 5760, //max number to get files
	FILETMP:[], //save the tmp of file
	fileInfo:{
	},
	renderNumEachTime: 100,
	renderCircleTime: 300, //ms
	PRELOAD: function() {
		SD.MODULE.getSdState({preinit : true});
	},
	OnMount: function() {
		SD.allowRequest = true;
	},
	UnMount: function () {
		if (SD.getFileAjax) {
			SD.getFileAjax.abort();
		}	
		SD.allowRequest = false;
		SD.fileRenderInterval = clearTimeout(SD.fileRenderInterval);
	},
	MODULE:{
		getSdState: function(options) {
			var _options = $.extend({preinit:false}, options);
			var args = {
				url: '/sdgetstate.fcgi',
				//url: '/data/area.json',
				data: {
					"command": "getsdstate"
				},
				success: function(json) {
					DATA.SD.STATE = json;

					//IF preinit
					if (!_options.preinit) { 
						if (json.state == 1) { //if detect sd,then get infomation
							$.when(
								SD.MODULE.getSdInfo({preinit:false}), // maybe need to concat the fcgi?
								SD.MODULE.getSdConf({preinit:false}),
								SD.MODULE.getFile({
									preinit: false,
									"filepath": $("#sd-path-info").text()
								}, 1)
							).done(function () {
								SD.VIEW.init();
							})
						} else {
							SD.VIEW.init();
						}
					//IF not preinit
					} else {
						if (json.state == 1) { //if detect sd,then get infomation
							SD.MODULE.getSdInfo({preinit:true}); // maybe need to concat the fcgi?
							SD.MODULE.getSdConf({preinit:true});
						}
					}

				},
				error: function(xhr) {
				}
			}
			return common.setAjax.init(args);
		},

		getSdInfo: function(options) {
			var _options = $.extend({preinit:false}, options);

			var args = {
				url: '/sdinfo.fcgi',
				data: {
					"command": "getsdinfo"
				},
				success: function(json) {
					DATA.SD.SDINFO = json;
					if( !_options.preinit ){
						SD.VIEW.INFO();
					}				
				},
				error: function(xhr) {
				}
			}
			return common.setAjax.init(args);
		},
		getSdConf: function(options) {
			var _options = $.extend({preinit:false},options);

			var args = {
				url: '/sdgetconf.fcgi',
				data: {
					"command": "getsdconf",
				},
				success: function(json) {
					DATA.SD.CONF = json;			
					if ( !_options.preinit ){
						SD.VIEW.CONF();
					}			
				},
				error: function(xhr) {
				}
			}
			return common.setAjax.init(args);
		},

		getFile: function(options,pagenum){	
			var _options = $.extend({preinit:false},options);		

			if (!_options.preinit && !SD.allowRequest) {
				return;
			}

			var args = {
				url: '/sdgetfile.fcgi',
				data : {
					"command": "getfile",
					"filepath": _options.filepath,
					"numberperpage":SD.GETFILESTEP,
					"pagenumber": pagenum
				},
				//timeout: 10000, //5s timeout
				beforeSend: function() {
					if ( !_options.preinit ){
						SD.VIEW.FILE('beforeSend');
					}
				},
				success: function(json) {
					SD.FILETMP = SD.FILETMP.concat(json.fileInfo);
					SD.getfilecount++;
					//console.log(SD.getfilecount);

					if (SD.getfilecount * SD.GETFILESTEP <= SD.MAXFILE && json.totalFileNumber > SD.getfilecount * SD.GETFILESTEP) {
						/*if ( !_options.preinit ){
							SD.VIEW.FILE('continue');
						}*/
						SD.MODULE.getFile(options, SD.getfilecount+1);					
					} else {
						DATA.SD.FILE = json;
						DATA.SD.FILE.fileInfo = SD.FILETMP;
						SD.FILETMP = [];
						SD.getfilecount = 0;

						if ( !_options.preinit ){
							//console.log('complete');
							SD.VIEW.FILE('complete');
						}	
									
					}
				},
				error: function(xhr,response) {	
					if ( !_options.preinit ){
						SD.VIEW.FILE('error');
					}	
				}
			};

			SD.getFileAjax = common.setAjax.init(args);
		},

		deleteFile : function(options){	
			//No need to preload, remove the preload function
			var args = {
				url: '/sddelfile.fcgi',
				data:{
					"command": "delfile",
					"filepath": options.filepath
				},
				success: function(json) {
					SD.VIEW.DELETE("success", json);
				},
				error: function(xhr) {
					SD.VIEW.DELETE("error");
				}
			}
			return common.setAjax.init(args);
		},

		formatSD : function(){
			var args = {
				url: '/formatsd.fcgi',
				data: {
					"command": "formatsd"
				},
				beforeSend:function(){
					SD.VIEW.FORMAT("beforeSend");
				},
				success: function(json) {
					SD.VIEW.FORMAT("success", json);
				},
				error: function(xhr) {	
					SD.VIEW.FORMAT("error");
				}
			}
			common.setAjax.init(args);
		},

		save : function(options){									
			//No need to preload, remove the preload function
			var args = {
				url: '/sdsetconf.fcgi',
				data: {
					"command": "setsdconf",			
					"docleantime": options.cleanTimepoint,//$("#sdcleantime").val(),
					"overduetime": options.daysOfFileSave,//$("#sdtime").val(),
					"capability": options.proportion,//$("#sdcap").val(),
					"timeclean":options.timeClean,//$('input:radio[name="timeclean"]:checked').val(),
					"capclean":options.capClean//$('input:radio[name="capclean"]:checked').val(),
				},
				beforeSend: function(){
					SD.VIEW.SAVE("beforeSend");
				},
				success: function(json) {
					SD.VIEW.SAVE("success", json);			
				},
				error: function(xhr) {
					SD.VIEW.SAVE("error");
				}
			}
			common.setAjax.init(args);
		}
	},

	VIEW : {
		init: function() {
			$("#index-img-loading").hide();
			SD.VIEW.STATE();
			SD.VIEW.INFO();
			SD.VIEW.CONF();
			SD.VIEW.FILE();
		},
		//state == 0 or state == 2
		STATE: function(){
			if (typeof DATA.SD.STATE == 'undefined') {
				$("#sd-tips").text("Please Insert SD Card");	
				$("#sd-tips-cell").show();
				$(".sd-main-cell").hide();	
				return;
			}

			var json = DATA.SD.STATE;
			if (json.errorCode == 0) {
				switch(json.state){
					case 0:	
						$("#sd-tips").text("Please Insert SD Card");	
						$("#sd-tips-cell").show();
						$(".sd-main-cell").hide();	
						break;
					case 2:
						$("#sd-tips").text("Please Format SD Card");	
						$("#sd-tips-cell").show();		
						$(".sd-main-cell").hide();	
						break;
					case 3:
						$("#sd-tips").text("Not enough storage. Please delete files or format the SD card.");	
						$("#sd-tips-cell").show();		
						$(".sd-main-cell").hide();
						break;
					default:
						$("#sd-tips-cell").hide();		
						$(".sd-main-cell").show();
						break;
				}
			} else {
				//other error code
				$("#sd-tips").text("Please Insert SD Card");	
				$("#sd-tips-cell").show();
				$(".sd-main-cell").hide();

				/*plug.window.alert({
					"info": lang.sd.setFail
				});*/
			}
		},
		
		INFO: function(){
			if (typeof DATA.SD.SDINFO == 'undefined') {
				return;
			}

			var json = DATA.SD.SDINFO;
			
			if (json.errorCode == 0) {
				var htmlcontent = "Total:"+"&nbsp"+json.sdInfo.total+"&nbsp;&nbsp;&nbsp;&nbsp;"+"Used:"+"&nbsp"+json.sdInfo.used+"&nbsp;&nbsp;&nbsp;&nbsp;"+"Free:"+"&nbsp"+json.sdInfo.free;
				$("#sd-file-total-info").html(htmlcontent);
			} else {
				
				plug.window.alert({
					"info": lang.sd.setFail
				});
			}
		},
		CONF: function(){
			if (typeof DATA.SD.CONF == 'undefined') {
				return;
			}

			var json = DATA.SD.CONF;
			
			if (json.errorCode == 0) {	
				$("#sd-setting-clean-timepoint").val(json.cleantime).change();
				$("#sd-setting-days-of-file-save").val(json.timeofday).change();
				$("#sd-setting-propotion").val(json.capability).change();
							
				if(json.timeenable == 1){
					$("#sd-cleanOldFile-on").click();
				}else{
					$("#sd-cleanOldFile-off").click();
				}
				if(json.capenable == 1){
					$("#sd-reserveSpace-on").click();
				}else{
					$("#sd-reserveSpace-off").click();
				}
			} else {
				
				plug.window.alert({
					"info": lang.sd.setFail
				});
			}			
		},
		FILE: function(state){

			plug.button.disable($("#sd-back"));
			$('.sd-file-list-mask').show();

			if (typeof DATA.SD.FILE == 'undefined') {
				return;
			}
			//IF fail, the path show
			function sdPath() {
				if ($("#sd-path-info").text().length > 1) {					
					var text = $("#sd-path-info").text();
					var pos = text.lastIndexOf("/", text.length - 2);
					text = text.substr(0, pos + 1);
					$("#sd-path-info").text(text);
				}
						
				plug.window.alert({
					"info": lang.sd.setFail
				});

				SD.MODULE.getSdState();
				
			}

			var json = DATA.SD.FILE;
			switch(state) {
				case 'beforeSend':
					//Add mask
					plug.button.disable($("#sd-back"));
					$('.sd-file-list-mask').show();
					break;
				case 'continue':
					if (json.errorCode == 0) {	
						SD.listFile();
					} else {	
						sdPath();
					}
					break;
				case 'complete': 
					if (json.errorCode == 0) {
						SD.sortFile();	
						SD.listFile(function() {
							$('.sd-file-list-mask').hide();
							plug.button.enable($("#sd-back"));
						});
					} else {	
						sdPath();
					}
					break;
				case 'error':
					$('.sd-file-list-mask').hide();
					plug.button.enable($("#sd-back"));
				default:
					$('.sd-file-list-mask').hide();
					plug.button.enable($("#sd-back"));
					break;
			}
			
			
		},
		DELETE: function(state, json){
			if (state == 'error') {
				plug.window.alert({
					"info": lang.sd.setFail
				});
			}else {
				if (json.errorCode == 0) {
					SD.MODULE.getFile({"filepath": $("#sd-path-info").text()},1);
					SD.listFile(function(){SD.MODULE.getSdInfo();});
								
					/*plug.window.alert({
						"info": "delete success"
					});*/
				} else {
					plug.window.alert({
						"info": lang.sd.setFail
					});
				}
			}
		},
		FORMAT: function(status, json){
			switch(status){
				case "beforeSend":
					common.shadeLayer();
					break;
				case "success":
					if (json.errorCode == 0) {
						//SD.CloseDiv('formatbg');
						plug.window.alert({
							"info": lang.sd.formatSuccess
						});							
					} else {
						//main.setting.sdSetting.CloseDiv('formatbg');
						plug.window.alert({
							"info": lang.sd.formatFail
						});
					}
					setTimeout(function() {
						SD.MODULE.getSdState();
					}, 5000);
					common.removeShadeLayer();		
					break;
				case "error":
					common.removeShadeLayer();
					break;
			}
		},
		SAVE: function(status, json){
			switch(status){
				case "beforeSend":
					common.shadeLayer();	
					break;
				case "success":
					if (json.errorCode == 0) {
								
						plug.window.alert({
							"info": lang.sd.setSuccess
						});
					} else {
						
						plug.window.alert({
							"info": lang.sd.setFail
						});
					}
					common.removeShadeLayer();
					break;
				case "error":
					common.removeShadeLayer();
					break;
			}
		}

	},

	bind:function(){

		$("select").change(function(){
			$("option:selected",this).click();
		});

/*		$('#content-sd').delegate('.checkbox', 'click', function() {
			this.previousSibling.click();
		});*/

		//button back
		$("#sd-back").click(function(){

			if($("#sd-path-info").text().length > 1){
				var text = $("#sd-path-info").text();
				var pos = text.lastIndexOf("/", text.length-2);
						
				text = text.substr(0, pos+1);
				$("#sd-path-info").text(text);
				
				SD.MODULE.getFile({"filepath": $("#sd-path-info").text()},1);
				//SD.listFile();
			}

		});

		//Clean Old File
		$("#sd-cleanOldFile-on").click(function(){
			$("#sd-cleanOldFile-cell").show();
			$("#sd-cleanOldFile-off").removeClass("sd-cleanOldFile-selected");
			$(this).addClass("sd-cleanOldFile-selected");
		});
		$("#sd-cleanOldFile-off").click(function(){
			$("#sd-cleanOldFile-cell").hide();
			$("#sd-cleanOldFile-on").removeClass("sd-cleanOldFile-selected");
			$(this).addClass("sd-cleanOldFile-selected");
		});

		//Reserve Space
		$("#sd-reserveSpace-on").click(function(){
			$("#sd-reserveSpace-cell").show();	
			$(this).addClass("sd-reserveSpace-selected");
			$("#sd-reserveSpace-off").removeClass("sd-reserveSpace-selected");	 
		});
		$("#sd-reserveSpace-off").click(function(){
			$("#sd-reserveSpace-cell").hide();
			$("#sd-reserveSpace-on").removeClass("sd-reserveSpace-selected");	
			$(this).addClass("sd-reserveSpace-selected");						 
		});

		//Delete
		$("#sd-delete").click(function(){
			//var filePath = $("#sd-path-info").text();
			var filePath = "";
			var basepath = $("#sd-path-info").text();	
			$("input:checkbox[name='delfile']:checked").each(function(){
				basepath += $(this).val();
				filePath += basepath + "*";
				basepath =  $("#sd-path-info").text();					
			});
			if(filePath == ""){
				plug.window.alert({
					"info": "please choose your target"
				});
				return;
			}else{
				SD.MODULE.deleteFile({"filepath": filePath});	
			}
											
		});

		//Button choose all
		$("#sd_choose_all").click(function(){
			if(this.checked){
				$("input:checkbox[name='delfile']").attr("checked",true);
			}else{
				$("input:checkbox[name='delfile']").attr("checked",false);
			}
			plug.checkbox.initial($("#sd_file_list"));
		});


		$("#sd-format").click(function(){
			SD.MODULE.formatSD();						   
		});
		$("#sd-save").click(function(){
			var data = {
				"timeClean" : $(".sd-cleanOldFile-selected").val(),
				"capClean" : $(".sd-reserveSpace-selected").val(),
				"cleanTimepoint" : $("#sd-setting-clean-timepoint").val(),
				"daysOfFileSave" : $("#sd-setting-days-of-file-save").val(),
				"proportion" : $("#sd-setting-propotion").val()
			};
			
			SD.MODULE.save(data);

		});

	},

	listFile : function(callback){
		if (typeof DATA.SD.FILE.fileInfo == 'undefined') {
			data = [];
		} else {
			data = DATA.SD.FILE.fileInfo;
		}
		
		var filecount = data.length;

		$("#sd_file_list .tpTableContent").empty();
		$("#sd_choose_all").attr("checked",false);

		if (filecount == 0) {
			if (callback) {
				return callback();
			} else {
				return;
			}
		}

		function render (gap, time, data, callback) {
			this.time = time;
			this.turn = 1;
			this.gap = gap;
			this.i = 0;
			this.data = data;
			this.callback = callback;
			//this.circleOnRuning = null;
			this.circle = function () {
				var _this = this;
				i = _this.i;
				turn = _this.turn;
				gap = _this.gap;
				time = _this.time;
				data = _this.data;
				callback = _this.callback || null;
				//console.log(this);
				SD.fileRenderInterval = setTimeout( function () {
					//console.log(_this);
					var tr = '';
					for(;i<gap*turn;i++){
						//console.log(i);
						tr += "<tr class='"+(i%2==0?"even":"odd")+"'>";
						if (data[i].fileSize=="dir") {
							tr += " <td style='width:60px'><img src='images/file.png'/></td>";
							tr += " <td style='width:320px' class='filename folder_font_color' onclick=\"if(SD.clickTimer){window.clearTimeout(SD.clickTimer);SD.clickTimer=null;} SD.clickTimer=window.setTimeout(function(){SD.openFile(\'"+i+"\');},200);\" ondblclick=\"if(SD.clickTimer){window.clearTimeout(SD.clickTimer);SD.clickTimer=null;} SD.openFile(\'"+i+"\');\"><span title='"+data[i].fileName+"'>"+(data[i].fileName.length<25?data[i].fileName:(data[i].fileName.substr(0.25)+"..."))+"</span></td>";
						}
						else {
							if (data[i].fileName.split(".")[1] == "mp4") {
								tr += " <td style='width:60px'><img src = 'images/video.png'/></td>";
							}
							else if (data[i].fileName.split(".")[1] == "jpg") {
								tr += " <td style='width:60px'><img src = 'images/photo.png'/></td>";
							}
							else {
								tr += " <td style='width:60px'><img src = 'images/other.png'/></td>";
							}
							var userAgent = navigator.userAgent;
							var isEdge = userAgent.toLowerCase().indexOf("edge") > -1;
							if (isEdge) {
								tr += "<td style='width:320px' class='filename file_font_color'><a target='_blank' class='a-filelist' href='/sdcard"+$("#sd-path-info").html()+data[i].fileName+"'><span class='span-filelist' title='"+isEdge+data[i].fileName+"'>"+(data[i].fileName.length<25?data[i].fileName:(data[i].fileName.substr(0.25)+"..."))+"</span></a></td>"
							}
							else {
								tr += "<td style='width:320px' class='filename file_font_color'><a target='_blank' class='a-filelist' href='/sdcard"+$("#sd-path-info").html()+data[i].fileName+"' download><span class='span-filelist' title='"+isEdge+data[i].fileName+"'>"+(data[i].fileName.length<25?data[i].fileName:(data[i].fileName.substr(0.25)+"..."))+"</span></a></td>"
							}
						}
						tr += "	<td style='width:100px'>"+(data[i].fileSize=="dir"?"":data[i].fileSize)+"</td>";
						tr += "	<td style='width:100px'>"+(data[i].numberOfFile==0?"":data[i].numberOfFile)+"</td>";
						tr += "	<td class='td-rightest'>"+data[i].fileDate+"</td>";
						tr += "</tr>";		
						if (i == (data.length - 1) && SD.fileRenderInterval) {
							$("#sd_file_list .tpTableContent").append(tr);
							if (callback) {
								callback();
							}
							data = [];	
							SD.fileRenderInterval = clearTimeout(SD.fileRenderInterval);	
							//plug.checkbox.initial($("#sd_file_list"));
							return;
						}	
					}
					//console.log(i);
					$("#sd_file_list .tpTableContent").append(tr);
					//plug.checkbox.initial($("#sd_file_list"));
					_this.turn++;
					_this.i = i;
					_this.circle();
				}, time);
			};
		}
		var r = new render(SD.renderNumEachTime, SD.renderCircleTime, data, callback);
		r.circle();	
	},
	openFile : function(i){
		
		var file = DATA.SD.FILE.fileInfo[i];
		var filename = file.fileName;
			
		if(file.fileSize == "dir"){
			var current_path = $("#sd-path-info").html();
			$("#sd-path-info").html(current_path + filename + "/");
				
			SD.MODULE.getFile({"filepath": $("#sd-path-info").text()},1);
		}	
	},
	sortFile: function () {
		//console.time('sort');
		DATA.SD.FILE.fileInfo.sort(function (a, b) {
			if (Date.parse(a.fileDate) < Date.parse(b.fileDate) 
				|| (Date.parse(a.fileDate) == Date.parse(b.fileDate) && a.fileName < b.fileName)){ //sort by date and name
				return 1; 
			} else{
				return -1;
			}
		});
		//console.timeEnd('sort');
	},

	init: function(){
		SD.OnMount();
		SD.bind();
		//SD.VIEW.init();
		SD.MODULE.getSdState();
		//SD.VIEW.STATE();
	}
};
