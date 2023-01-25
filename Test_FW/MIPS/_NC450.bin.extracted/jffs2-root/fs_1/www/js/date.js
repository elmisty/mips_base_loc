var Timesetting = {
	timer: null,
	dateseter_sec: null, //
	dateseter_min: null,
	dateseter_hour: null,
	dateseter_interval: null, //datesetting计时器间隔
	dateTimeManually: null, //手动时间设置标志
	ajaxuploader_fileinfo: null,
	browserVision: null, //浏览器版本
	oldTimeZone: null, //时间设置中时间根据时区变更
	newTimeZone: null,
		timeZoneList:[	
						/*{"value":"-1" ,"text": "Auto Timezone"},*/
						{"value":"0" ,"text": "(GMT-12:00) International Date Line West"},
						{"value":"1" ,"text": "(GMT-11:00) Midway Island, Samoa"},
						{"value":"2" ,"text": "(GMT-10:00) Hawaii"},
						{"value":"3" ,"text": "(GMT-09:00) Alaska"},
						{"value":"4" ,"text": "(GMT-08:00) Pacific Time (US * Canada); Tijuana"},
						{"value":"5" ,"text": "(GMT-07:00) Mountain Time (US * Canada)"},
						{"value":"6" ,"text": "(GMT-07:00) Chihuahua"},
						{"value":"7" ,"text": "(GMT-07:00) La Paz, Mazatlan"},
						{"value":"8" ,"text": "(GMT-07:00) Arizona"},
						{"value":"9" ,"text": "(GMT-06:00) Saskatchewan"},
						{"value":"10" ,"text": "(GMT-06:00) Guadalajara, Mexico City, Monterrey"},
						{"value":"11" ,"text": "(GMT-06:00) Central Time (US * Canada)"},
						{"value":"12" ,"text": "(GMT-06:00) Central America"},
						{"value":"13" ,"text": "(GMT-05:00) Indiana (East)"},
						{"value":"14" ,"text": "(GMT-05:00) Eastern Time (US * Canada)"},
						{"value":"15" ,"text": "(GMT-05:00) Bogota, Lima, Quito"},
						{"value":"16" ,"text": "(GMT-04:30) Caracas"},
						{"value":"17" ,"text": "(GMT-04:00) Santiago"},
						{"value":"18" ,"text": "(GMT-04:00) La Paz"},
						{"value":"19" ,"text": "(GMT-04:00) Atlantic Time (Canada)"},
						{"value":"20" ,"text": "(GMT-03:30) Newfoundland"},
						{"value":"21" ,"text": "(GMT-03:00) Greenland"},
						{"value":"22" ,"text": "(GMT-03:00) Buenos Aires, Georgetown"},
						{"value":"23" ,"text": "(GMT-03:00) Brasilia"},
						{"value":"24" ,"text": "(GMT-02:00) Mid-Atlantic"},
						{"value":"25" ,"text": "(GMT-01:00) Cape Verde Is."},
						{"value":"26" ,"text": "(GMT-01:00) Azores"},
						{"value":"27" ,"text": "(GMT) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London"},
						{"value":"28" ,"text": "(GMT) Casablanca"},
						{"value":"29" ,"text": "(GMT) Monrovi"},
						{"value":"30" ,"text": "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"},
						{"value":"31" ,"text": "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"},
						{"value":"32" ,"text": "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris"},
						{"value":"33" ,"text": "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb"},
						{"value":"34" ,"text": "(GMT+01:00) West Central Africa"},
						{"value":"35" ,"text": "(GMT+02:00) Athens"},
						{"value":"36" ,"text": "(GMT+02:00) Bucharest"},
						{"value":"37" ,"text": "(GMT+02:00) Cairo"},
						{"value":"38" ,"text": "(GMT+02:00) Harare, Pretoria,Minsk"},
						{"value":"39" ,"text": "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"},
						{"value":"40" ,"text": "(GMT+02:00) Jerusalem"},
						{"value":"41" ,"text": "(GMT+03:00) Baghdad, Istanbul"},
						{"value":"42" ,"text": "(GMT+03:00) Kuwait, Riyadh"},
						{"value":"43" ,"text": "(GMT+03:00) Moscow,Volgograd,Nairobi"},
						{"value":"44" ,"text": "(GMT+03:00) St.Petersburg"},
						{"value":"45" ,"text": "(GMT+03:30) Tehran"},
						{"value":"46" ,"text": "(GMT+04:00) Abu Dhabi, Muscat,Tbilisi, Yerevan"},
						{"value":"47" ,"text": "(GMT+04:00) Baku"},
						{"value":"48" ,"text": "(GMT+04:30) Kabul"},
						{"value":"49" ,"text": "(GMT+05:00) Ekaterinburg"},
						{"value":"50" ,"text": "(GMT+05:00) Islamabad, Karachi, Tashkent"},
						{"value":"51" ,"text": "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi"},
						{"value":"52" ,"text": "(GMT+05:45) Kathmandu"},
						{"value":"53" ,"text": "(GMT+06:00) Almaty, Novosibirsk"},
						{"value":"54" ,"text": "(GMT+06:00) Astana, Dhaka"},
						{"value":"55" ,"text": "(GMT+06:00) Sri Jayawardenepura"},
						{"value":"56" ,"text": "(GMT+06:30) Rangoon"},
						{"value":"57" ,"text": "(GMT+07:00) Bangkok, Hanoi, Jakarta"},
						{"value":"58" ,"text": "(GMT+07:00) Krasnoyarsk"},
						{"value":"59" ,"text": "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi"},
						{"value":"60" ,"text": "(GMT+08:00) Irkutsk"},
						{"value":"61" ,"text": "(GMT+08:00) Ulaan Bataar"},
						{"value":"62" ,"text": "(GMT+08:00) Kuala Lumpur, Singapore"},
						{"value":"63" ,"text": "(GMT+08:00) Perth"},
						{"value":"64" ,"text": "(GMT+08:00) Taipei"},
						{"value":"65" ,"text": "(GMT+09:00) Osaka"},
						{"value":"66" ,"text": "(GMT+09:00) Seoul"},
						{"value":"67" ,"text": "(GMT+09:00) Yakutsk"},
						{"value":"68" ,"text": "(GMT+09:30) Adelaide"},
						{"value":"69" ,"text": "(GMT+10:00) Brisbane"},
						{"value":"70" ,"text": "(GMT+10:00) Canberra, Melbourne, Sydney"},
						{"value":"71" ,"text": "(GMT+10:00) Guam, Port Moresby"},
						{"value":"72" ,"text": "(GMT+10:00) Hobart"},
						{"value":"73" ,"text": "(GMT+10:00) Vladivostok"},
						{"value":"74" ,"text": "(GMT+11:00) Magadan, Solomon Is., New Caledonia"},
						{"value":"75" ,"text": "(GMT+12:00) Auckland, Wellington"},
						{"value":"76" ,"text": "(GMT+12:00) Fiji"},
						{"value":"77" ,"text": "(GMT+12:00) Kamchatka, Marshall Is."}
					],
		timeZoneListNew:[],

		MODULE:{
			getTimeInfo: function(options) {
				//clearTimeout(common.timing.timer);
				//common.timing.timer = setTimeout( function(){Timesetting.MODULE.getTimeInfo()},60*1000);
				var _options = $.extend({preinit:false},options);	
				var args = {
					url: '/gettimesetting.fcgi',
					//url: 'JSON/gettimesetting.json',
					success: function(json) {
						//Timesetting.dateTimeManually = 0;
						DATA.DATE = json;
						if( Timesetting.timeZoneListNew.length == 0 ){
							Timesetting.timeZoneListNew = Timesetting.timeZoneList;
						}
						if( DATA.DATE.timezone == "-2" ){											
							var newstr = [{"text":"("+DATA.DATE.timezonestr+")"+" "+DATA.DATE.area,"value":"-2"}];
							Timesetting.timeZoneListNew = newstr.concat(Timesetting.timeZoneList);	
						}else{
							Timesetting.timeZoneListNew = Timesetting.timeZoneList;
						}			
						if( !_options.preinit ){ // not preinit
							Timesetting.VIEW.init();
						}
						
					},
					error: function(xhr) {
					}
				};
				return common.ajax.init(args);
			},
			getdLstFromCloud: function(){
				var args = {
					url: '/getdlstfromcloud.fcgi',
					//url: '/data/dst.json',
					beforeSend: function(){
						Timesetting.VIEW.getdLstFromCloud("beforeSend");
					},
					success: function(json){
						DATA.DATE.CLOUDLIST = json;
						Timesetting.VIEW.getdLstFromCloud("success");
					},
					error: function(){
						Timesetting.VIEW.getdLstFromCloud("error");
					}
				};
				common.ajax.init(args);
			},
			setDateTime: function(data) {
				var args = {
					url: '/settimesetting.fcgi',
					//url: 'JSON/settimesetting.json',
					data: data,
					beforeSend: function(){
						Timesetting.VIEW.SET("beforeSend");
					},
					success: function(json) {
						$.extend(DATA.DATE, data, json);
						//DATA.DATE.datetime = json.datetime;
						//DATA.DATE.errorCode = json.errorCode;
						Timesetting.VIEW.SET("success");		
					},
					error: function(xhr) {
						Timesetting.VIEW.SET("error");
					}
				};
				common.setAjax.init(args);
			}

		},

		VIEW: {

			init: function(){
				$(".plugin-select.date-setTimeZone").remove();
				common.optionsCreate("date-setTimeZone", Timesetting.timeZoneListNew);
				$("#date-setTimeZone").Select();

				json = DATA.DATE;
				$("#date-setTimeZone").val(json.timezone).change();
				Timesetting.VIEW.resetServerTime(DATA.DATE.datetime);
		
				if (json.sync2ntp == 1) {
					$("#date-sysntp-server-enable").click();
					if (json.sync2dhcp == 0) {
						$("#date-radio-ntp-service").click();
					} else {
						$("#date-radio-synntp-dhcp").click();
					}
				} else if (json.sync2pc == 1) {
					$("#date-set-datetime-manual").click();
				} else {
					$("#date-sysntp-server-enable").click();
				}
				json.ntpserver == null ? $("#date-sns-manual").val($("#date-sns-auto").children("option:selected").html()) : $("#date-sns-manual").val(json.ntpserver);
			},

		resetServerTime: function(json) {
			var hour = json.split(" ")[1],
				year = json.split(" ")[0];
			Timesetting.VIEW.swapYear(year);
			Timesetting.dateseter_sec = hour.split(":")[2],
			Timesetting.dateseter_min = hour.split(":")[1],
			Timesetting.dateseter_hour = hour.split(":")[0];
			$("#datemode-start-year").val(Number(year.split("-")[0])).change();
			$("#datemode-start-month").val(Number(year.split("-")[1])).change();
			$("#datemode-start-day").val(Number(year.split("-")[2])).change();
			$("#datemode-start-hour").val(Number(Timesetting.dateseter_hour)).change();
			$("#datemode-start-min").val(Number(Timesetting.dateseter_min)).change();
			$("#datemode-start-sec").val(Number(Timesetting.dateseter_sec)).change();
			clearInterval(common.timing.dateseter_interval);
			common.timing.dateseter_interval = setInterval(Timesetting.VIEW.videotimer, 1000);
		},

		swapYear: function(year) {
			var swapYear = year.split("-")[0] + "-" + Timesetting.VIEW.swapsb(year.split("-")[1]) + "-" +Timesetting.VIEW.swapsb(year.split("-")[2]);
			$("#date-current-date").html(swapYear);
			return swapYear;
		},
		isLeapYear: function(year) {
			if (year < 1900 && year > 9999) 
				return -1;
			return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0) ? 1 : 0;
		},		

		swapmonth: function(n) {
			switch (n) {
				case "Jan":
					return "01";
					break
				case "Feb":
					return "02";
					break
				case "Mar":
					return "03";
					break
				case "Apr":
					return "04";
					break
				case "May":
					return "05";
					break
				case "Jun":
					return "06";
					break
				case "Jul":
					return "07";
					break
				case "Aug":
					return "08";
					break
				case "Sep":
					return "09";
					break
				case "Oct":
					return "10";
					break
				case "Nov":
					return "11";
					break
				case "Dec":
					return "12";
					break
				default:
					return "unknownNumber";
			}
		},

		swapWeek: function(n) {
			switch (n) {
				case "Mon":
					return 1;
					break
				case "Tue":
					return 2;
					break
				case "Wed":
					return 3;
					break
				case "Thu":
					return 4;
					break
				case "Fri":
					return 5;
					break
				case "Sat":
					return 6;
					break
				case "Sun":
					return 7;
					break
				default:
					return "unknownNumber";
			}
		},

		swapsb: function(n) {
			switch (n) {
				case "0":
					return "00";
					break
				case "1":
					return "01";
					break
				case "2":
					return "02";
					break
				case "3":
					return "03";
					break
				case "4":
					return "04";
					break
				case "5":
					return "05";
					break
				case "6":
					return "06";
					break
				case "7":
					return "07";
					break
				case "8":
					return "08";
					break
				case "9":
					return "09";
					break
				default:
					return n;
			}
		},

		dayByDay: function(holderDay, holderMonth, holderYear) {
			var day = $(holderDay).val(),
				month = $(holderMonth).val(),
				year = $(holderYear).val();
			if (day == 31) //判断当从大月切换到小月时日期选择为31号的情况（小月包含2月）
			{
				if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").show();
				} 
				else if (month == "2") 
				{
					$(holderDay + " option:eq(29)").hide();
					$(holderDay + " option:eq(30)").hide();

					var type = Timesetting.VIEW.isLeapYear(year);
					if (type == 0) 
					{
						$(holderDay + " option:eq(28)").hide();
						$(holderDay).val(28);
					} 
					else 
					{
						$(holderDay).val(29);
					}
				} 
				else 
				{
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").hide();
					$(holderDay).val(30);
				}
			} 
			else if (day == 30) //判断从小月切换到大月时
			{
				if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") 
				{
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").show();
				} else if (month == "2") {
					$(holderDay + " option:eq(28)").hide();
					$(holderDay + " option:eq(29)").hide();
					$(holderDay + " option:eq(30)").hide();

					var type = Timesetting.VIEW.isLeapYear(year);
					if (type == 0) {
						$(holderDay + " option:eq(28)").hide();
						$(holderDay).val(28);
					} else {
						$(holderDay + " option:eq(28)").show();
						$(holderDay).val(29);
					}
				}
			} 
			else if (day == 29) 
			{
				if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").show();
				} else if (month == "2") {
					$(holderDay + " option:eq(29)").hide();
					$(holderDay + " option:eq(30)").hide();
					var type = Timesetting.VIEW.isLeapYear(year);
					if (type == 0) {
						$(holderDay + " option:eq(28)").hide();
						$(holderDay).val(28);
					} else {
						$(holderDay).val(29);
					}
				} else {
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
				}
			} 
			else 
			{
				if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").show();
				} else if (month == "2") {
					$(holderDay + " option:eq(28)").hide();
					$(holderDay + " option:eq(29)").hide();
					$(holderDay + " option:eq(30)").hide();
					var type = Timesetting.VIEW.isLeapYear(year);
					if (type == 0) {
						$(holderDay + " option:eq(28)").hide();
					} else {
						$(holderDay + " option:eq(28)").show();
					}
				} else {
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").hide();
				}
			}
			//update the select
			$(".datemode-start-day").remove();
			$(holderDay).Select();
		},

		videotimer: function() {		
			if (Timesetting.dateseter_sec == 59) 
			{
				Timesetting.dateseter_sec = 0;
				if (Timesetting.dateseter_min == 59) 
				{
					Timesetting.dateseter_min = 0;
					Timesetting.dateseter_hour++;
					if (Timesetting.dateseter_hour == 24) 
					{
						Timesetting.dateseter_hour = 0;
						Timesetting.getTimeInfo(); //一天交接的地方直接从后台拿数据刷新。
					}
				} 
				else 
				{
					Timesetting.dateseter_min++;
				}
			} 
			else 
			{
				Timesetting.dateseter_sec++;
			}
			str = Timesetting.VIEW.swapsb(Timesetting.dateseter_hour.toString()) + ":" + Timesetting.VIEW.swapsb(Timesetting.dateseter_min.toString()) + ":" + Timesetting.VIEW.swapsb(Timesetting.dateseter_sec.toString());
			$("#date-current-hour").html(str);
		},

		getLocalTime: function() {
			var d = new Date();
			$("#datemode-start-year").val(d.getFullYear()).change();
			$("#datemode-start-month").val(Number(d.getMonth() + 1)).change();
			$("#datemode-start-day").val(d.getDate()).change();
			$("#datemode-start-hour").val(d.getHours()).change();
			$("#datemode-start-min").val(d.getMinutes()).change();
			$("#datemode-start-sec").val(d.getSeconds()).change();
		},

		getdLstFromCloud: function(status){
			switch(status)
			{
				case "beforeSend":
					plug.button.disable( $("#date-save") );
					plug.button.disable( $("#date-update-daysave") );
					plug.button.disable( $("#date-copy-systime") );			
					
					$("#date-update-daysave").after(common.textLoading.Create("date-update-dlst-textloading"));
					common.textLoading.Start($("#date-update-dlst-textloading"),"Updating");
					break;
				case "success":
					if( DATA.DATE.CLOUDLIST === null )
					{
						plug.window.alert({
							"info": lang.dateTime.updateDSTFail
						});
						common.textLoading.End($("#date-update-dlst-textloading"),"Fail");
					}
					else if( DATA.DATE.CLOUDLIST.ErrorCode == 0)
					{
						$("#date-manual-timeoffset").val(DATA.DATE.CLOUDLIST.dlstOffset).change();
						$("#date-manual-starttime-week").val(DATA.DATE.CLOUDLIST.dlstStartWeek).change();
						$("#date-manual-starttime-day").val(DATA.DATE.CLOUDLIST.dlstStartDay).change();
						$("#date-manual-starttime-month").val(DATA.DATE.CLOUDLIST.dlstStartMonth).change();
						$("#date-manual-starttime-hour").val(DATA.DATE.CLOUDLIST.dlstStartHour).change();
						$("#date-manual-starttime-minute").val(DATA.DATE.CLOUDLIST.dlstStartMinute).change();
						$("#date-manual-endtime-week").val(DATA.DATE.CLOUDLIST.dlstEndWeek).change();
						$("#date-manual-endtime-day").val(DATA.DATE.CLOUDLIST.dlstEndDay).change();
						$("#date-manual-endtime-month").val(DATA.DATE.CLOUDLIST.dlstEndMonth).change();
						$("#date-manual-endtime-hour").val(DATA.DATE.CLOUDLIST.dlstEndHour).change();
						$("#date-manual-endtime-minute").val(DATA.DATE.CLOUDLIST.dlstEndMinute).change();
						plug.window.alert({
							"info": lang.dateTime.updateDSTSuccess
						});
						common.textLoading.End($("#date-update-dlst-textloading"),"Success");
					}
					else if( DATA.DATE.CLOUDLIST.ErrorCode == -1 )
					{
						plug.window.alert({
							"info": lang.dateTime.updateDSTFail
						});
						common.textLoading.End($("#date-update-dlst-textloading"),"Fail");
					}

					plug.button.enable( $("#date-save") );	
					plug.button.enable( $("#date-update-daysave") );
					plug.button.enable( $("#date-copy-systime") );
					break;
				case "error":
					common.textLoading.End($("#date-update-dlst-textloading"),"Error");	
					plug.button.enable( $("#date-save") );	
					plug.button.enable( $("#date-update-daysave") );
					plug.button.enable( $("#date-copy-systime") );
					break;
			}
		},

		SET: function(status){
			if( status == "beforeSend")
			{
				plug.button.disable( $("#date-save") );
				common.shadeLayer();
			}
			else if ( status == "success")
			{
				plug.button.enable($("#date-save"));
				common.removeShadeLayer();
				json = DATA.DATE;
				switch(json.errorCode)
				{
					case 0:
						plug.window.alert({
							"info": lang.ajax.system.dateSetSuccess
						});
						Timesetting.VIEW.resetServerTime(DATA.DATE.datetime);
						$("#date-update-daysave-text").val(0);
						break;
					case 1041:
						plug.window.alert({
							"info": lang.ajax.system.yearerror
						});break;
					case 1045:
						plug.window.alert({
							"info": lang.ajax.system.yearoverflow
						});break;
					case 1046:
						plug.window.alert({
							"info": lang.ajax.system.ntpoverflow
						});break;
					case 1042:
						plug.window.alert({
							"info": lang.ajax.system.timeConflicttimezone
						});break;
					default:
						plug.window.alert({
							"info": lang.ajax.system.dateSetError
						});break;
				}
				$(".date-current-time").show();
				$("#sync-manual-time-year").hide();
				$("#sync-manual-time-hour").hide();
			}
			else
			{
				plug.button.enable($("#date-save"));
				common.removeShadeLayer();
			}
		}
	},

	init: function(){				
		Timesetting.bind();
		Timesetting.VIEW.init();
		
		clearTimeout(common.timing.timer);
		common.timing.timer = setTimeout( function(){Timesetting.MODULE.getTimeInfo()},60*1000);
		Timesetting.MODULE.getTimeInfo();
	},

	bind: function(){
		$("select").change(function(){
			$("option:selected",this).click();
		});

		$("#datemode-start-month").change(function() {
			Timesetting.VIEW.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
		});
		$("#datemode-start-day").click(function() {
			Timesetting.VIEW.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
		});
		$("#datemode-start-year").change(function() {
			Timesetting.VIEW.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
		});

		//Synchronize with NTP Server
		$("#date-sysntp-server-enable").click(function(){
			$("#date-set-datetime-manual").removeClass("datetime-model-selected");
			$(this).addClass("datetime-model-selected");
			$("#date-set-datetime-manually-cell").hide();
			$('#date-sns-cell').show();
		});
		//Set dateTime manually
		$("#date-set-datetime-manual").click(function() {
			$("#date-sysntp-server-enable").removeClass("datetime-model-selected");
			$(this).addClass("datetime-model-selected");
			$("#date-set-datetime-manually-cell").show();
			$('#date-sns-cell').hide();
		});

		$("#date-radio-ntp-service").click(function(){
			$("#date-sns-manual-cell").show();
			$("#date-radio-synntp-dhcp").removeClass("date-ntpserver-radio-selected");
			$(this).addClass("date-ntpserver-radio-selected");
		}).click();
		$("#date-radio-synntp-dhcp").click(function(){
			$("#date-sns-manual-cell").hide();
			$("#date-radio-ntp-service").removeClass("date-ntpserver-radio-selected");
			$(this).addClass("date-ntpserver-radio-selected");
		});
		
		$('#date-sns-auto').change(function() {
			$('#date-sns-manual').val($('#date-sns-auto option:selected').text());
		});
		$('.sync_ntp_sword_img').click(function() {
			$('#date-sns-manual').val($('#date-sns-auto option:selected').text());
		});

		/*copy systime*/
		$("#date-copy-systime").click(function() {
			Timesetting.VIEW.getLocalTime();
		});

		/*save*/
		$("#date-save").click(function(){
			var data = {
				"datetime": $("#datemode-start-year").val() + "-" + $("#datemode-start-month").val() + "-" + $("#datemode-start-day").val() + " " + $("#datemode-start-hour").val() + ":" + $("#datemode-start-min").val() + ":" + $("#datemode-start-sec").val(),
				"timezone": $("#date-setTimeZone").val(),
				"sync2ntp": 0,
				"sync2dhcp": $(".date-ntpserver-radio-selected").val(),
				"sync2pc": 0,
				"ntpserver": $("#date-sns-manual").val(),
				"timezonestr":DATA.DATE.timezonestr,
				"area":DATA.DATE.area
						/*"dlstState": 0,
						"dlstIsAuto": $(".date-daysave-model-selected").val(),
						"dlstOffset": $("#date-manual-timeoffset").val(),
						"dlstStartMonth": $("#date-manual-starttime-month").val(),
						"dlstStartWeek": $("#date-manual-starttime-week").val(),
						"dlstStartDay": $("#date-manual-starttime-day").val(),
						"dlstStartHour": $("#date-manual-starttime-hour").val(),
						"dlstStartMinute": $("#date-manual-starttime-minute").val(),
						"dlstEndMonth": $("#date-manual-endtime-month").val(),
						"dlstEndWeek": $("#date-manual-endtime-week").val(),
						"dlstEndDay": $("#date-manual-endtime-day").val(),
						"dlstEndHour": $("#date-manual-endtime-hour").val(),
						"dlstEndMinute": $("#date-manual-endtime-minute").val(),
						"dlstUpdate": $("#date-update-daysave-text").val()*/
			};
			data.sync2ntp = $(".datetime-model-selected").val() == 1 ? 1 : 0;
			data.sync2pc = $(".datetime-model-selected").val() == 0 ? 1 : 0;
			Timesetting.MODULE.setDateTime(data);
		});


			/*update Daylight Saving Time from cloud
			$("#date-update-daysave").click(function(){
				$("#date-update-daysave-text").val("1");			
				Timesetting.MODULE.getdLstFromCloud();
			})*/


		}

};

