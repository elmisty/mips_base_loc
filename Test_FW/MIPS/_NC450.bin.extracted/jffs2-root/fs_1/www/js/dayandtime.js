$(document).ready(function(){
	var Timesetting = {
		timer: null,
		dateseter_sec: null, //
		dateseter_min: null,
		dateseter_hour: null,
		dateseter_interval: null, //
		dateTimeManually: null, //
		ajaxuploader_fileinfo: null,
		browserVision: null, //
		oldTimeZone: null, //
		newTimeZone: null,

		init: function(){	
			Timesetting.bind();
			Timesetting.getTimeInfo();
		},

		bind: function(){
			/*Daylight Saving Time*/
			$("#date-daysave-enable").change(function(){
				$("#date-daysave-cell").toggle();
			});

			/*auto && manually*/
			$("#date-daysave-auto").click(function(){
				$("#date-daysave-manually").removeClass("date-daysave-model-selected");
				$(this).addClass("date-daysave-model-selected");
				$(".checkbox-date-set-datetime-manual").removeClass("checkbox-checked");
				$(this).addClass("checkbox-checked");
				$("#date-daysave-manually-cell").hide();	
			});
			$("#date-daysave-manually").click(function(){
				$("#date-daysave-auto").removeClass("date-daysave-model-selected");
				$(this).addClass("date-daysave-model-selected");

				$("#date-daysave-manually-cell").show();
			});


			$("#datemode-start-month").change(function() {
				Timesetting.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
			});
			$("#datemode-start-day").click(function() {
				Timesetting.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
			});
			$("#datemode-start-year").change(function() {
				Timesetting.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
			});


			/*Synchronize with NTP Server*/
			$("#date-sysntp-server-enable").click(function(){
				if($("#date-sysntp-server-enable").attr("checked"))
				{
					$(this).attr("checked",true);
					$(".checkbox-date-sysntp-server-enable").addClass("checkbox-checked");
					$("#date-set-datetime-manual").attr("checked",false);//取消set day manually
					$(".checkbox-date-set-datetime-manual").removeClass("checkbox-checked");
					$("#date-set-datetime-manually-cell").hide();
					$('#date-sns-cell').show();
				}
				else
				{
					$(this).attr("checked",false);
					$(".checkbox-date-sysntp-server-enable").removeClass("checkbox-checked");
					$('#date-sns-cell').hide();
				}	
			});

			$("#date-set-datetime-manual").click(function() {
				if ($("#date-set-datetime-manual").attr("checked")) 
				{
					$(this).attr("checked", true);
					$(".checkbox-date-set-datetime-manual").addClass("checkbox-checked");
					$("#date-set-datetime-manual-cell").show();

					$(".checkbox-date-sysntp-server-enable").removeClass("checkbox-checked");
					$("#date-sysntp-server-enable").attr("checked", false);
					$('#date-sns-cell').hide();
				} 
				else 
				{
					$(this).attr("checked",false);
					$(".checkbox-date-set-datetime-manual").removeClass("checkbox-checked");
					$("#date-set-datetime-manual-cell").hide();
				}
			});

			$("#date-radio-ntp-service").click(function(){
				$("#date-sns-manual-cell").show();
				$("#date-radio-synntp-dhcp").removeClass("date-ntpserver-radio-selected");
				$(".radio-date-radio-synntp-dhcp").removeClass("radio-checked");
				$(this).addClass("date-ntpserver-radio-selected");
			}).click();

			$("#date-radio-synntp-dhcp").click(function(){
				$("#date-sns-manual-cell").hide();
				$("#date-radio-ntp-service").removeClass("date-ntpserver-radio-selected");
				$(".radio-date-radio-ntp-service").removeClass("radio-checked");
				$(this).addClass("date-ntpserver-radio-selected");
			});

			$("#date-sns-auto").change(function(){
				var ntp_text = $("#date-sns-auto").children("option:selected").html();
				$("#date-sns-manual").val(ntp_text);
			});

			/*Set Date and time Manually*/
			$("#date-set-datetime-manual").change(function(){
				$("#date-set-datetime-manually-cell").toggle();
			});

			/*copy systime*/
			$("#date-copy-systime").click(function() {
				Timesetting.getLocalTime();
			});

			/*save*/
			$("#date-save").click(function(){
				Timesetting.setDateTime();
			});
		},

		getTimeInfo: function() {
			clearTimeout(common.timing.timer);
			common.timing.timer = setTimeout( function(){Timesetting.getTimeInfo()},60*1000);
					
			var args = {
				url: '/gettimesetting.fcgi',
				success: function(json) {
					Timesetting.dateTimeManually = 0;
					$("#date-setTimeZone").val(json.timezone).change();
					Timesetting.resetServerTime(json.datetime);
							
							
					if (json.dlstState == 1) 
					{
						$("#date-daysave-enable").attr("checked", true);
						$(".checkbox-date-daysave-enable").addClass("checkbox-checked");
						$("#date-daysave-cell").show();
					}
					else
					{
						$("#date-daysave-enable").attr("checked", false);
						$(".checkbox-date-daysave-enable").removeClass("checkbox-checked");
						$("#date-daysave-cell").hide();
					}
					if (json.dlstIsAuto == 0) 
					{
						$("#date-daysave-manually").click();
						$("#date-manual-timeoffset").val(json.dlstOffset).change();
						$("#date-manual-starttime-day").val(json.dlstStartDay).change();
						$("#date-manual-starttime-week").val(json.dlstStartWeek).change();
						$("#date-manual-starttime-month").val(json.dlstStartMonth).change();
						$("#date-manual-starttime-hour").val(json.dlstStartHour).change();
						$("#date-manual-starttime-minute").val(json.dlstStartMinute).change();
						$("#date-manual-endtime-week").val(json.dlstEndDay).change();
						$("#date-manual-endtime-week").val(json.dlstEndWeek).change();
						$("#date-manual-endtime-month").val(json.dlstEndMonth).change();
						$("#date-manual-endtime-hour").val(json.dlstEndHour).change();
						$("#date-manual-endtime-min").val(json.dlstEndMinute).change();
					} 
					else 
					{
						$("#date-daysave-auto").click();
					}

				
					if (json.sync2ntp == 1) 
					{
						$("#date-sysntp-server-enable").attr("checked", true);
						$("#date-set-datetime-manual").attr("checked", false);
						$(".checkbox-date-sysntp-server-enable").addClass("checkbox-checked");
						$(".checkbox-date-set-datetime-manual").removeClass("checkbox-checked");

						$("#date-set-datetime-manually-cell").hide();
						$('#date-sns-cell').show();
						if (json.sync2dhcp == 0) 
						{
							$("#date-radio-ntp-service").click();
						} 
						else 
						{
							$("#date-radio-synntp-dhcp").click();
						}
					} 
					else if (json.sync2pc == 1) 
					{
						$("#date-set-datetime-manual").attr("checked", true);
						$(".checkbox-date-set-datetime-manual").addClass("checkbox-checked");
						$("#date-set-datetime-manually-cell").show();
						$('#date-sns-cell').hide();
						$("#date-sysntp-server-enable").attr("checked", false);
						$(".checkbox-date-sysntp-server-enable").removeClass("checkbox-checked");
					} 
					else 
					{
						$("#date-set-datetime-manual").attr("checked", false);
						$("#date-sysntp-server-enable").attr("checked", false);
						$(".checkbox-date-sysntp-server-enable").removeClass("checkbox-checked");
						$(".checkbox-date-set-datetime-manual").removeClass("checkbox-checked");
						$("#date-set-datetime-manually-cell").hide();
						$('#date-sns-cell').hide();
					}
					json.ntpserver == null ? $("#date-sns-manual").val($("#date-sns-auto").children("option:selected").html()) : $("#date-sns-manual").val(json.ntpserver);
				},
				error: function(xhr) {
				}
			};
			common.ajax.init(args);
		},

		resetServerTime: function(json) {
			var hour = json.split(" ")[1],
				year = json.split(" ")[0];
			Timesetting.swapYear(year);
			Timesetting.dateseter_sec = hour.split(":")[2],
			Timesetting.dateseter_min = hour.split(":")[1],
			Timesetting.dateseter_hour = hour.split(":")[0];
			$("#datemode-start-year").val(Number(year.split("-")[0])).change();
			$("#datemode-start-month").val(Number(year.split("-")[1])).change();
			$("#datemode-start-day").val(Number(year.split("-")[2])).change();
			$("#datemode-start-hour").val(Timesetting.dateseter_hour).change();
			$("#datemode-start-min").val(Timesetting.dateseter_min).change();
			$("#datemode-start-sec").val(Timesetting.dateseter_sec).change();
			clearInterval(common.timing.dateseter_interval);
			common.timing.dateseter_interval = setInterval(Timesetting.videotimer, 1000);
		},
		swapYear: function(year) {
			var swapYear = year.split("-")[0] + "-" + Timesetting.swapsb(year.split("-")[1]) + "-" +Timesetting.swapsb(year.split("-")[2]);
			$("#date-current-date").html(swapYear);
			return swapYear;
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

					var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
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
				if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").show();
				} 
				else if (month == "2") 
				{
					$(holderDay + " option:eq(28)").hide();
					$(holderDay + " option:eq(29)").hide();
					$(holderDay + " option:eq(30)").hide();

					var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
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
				if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") 
				{
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").show();
				} 
				else if (month == "2") 
				{
					$(holderDay + " option:eq(29)").hide();
					$(holderDay + " option:eq(30)").hide();
					var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
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
				}
			} 
			else 
			{
				if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") 
				{
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").show();
				} 
				else if (month == "2") 
				{
					$(holderDay + " option:eq(28)").hide();
					$(holderDay + " option:eq(29)").hide();
					$(holderDay + " option:eq(30)").hide();
					var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
					if (type == 0) 
					{
						$(holderDay + " option:eq(28)").hide();
					} 
					else 
					{
						$(holderDay + " option:eq(28)").show();
					}
				} 
				else 
				{
					$(holderDay + " option:eq(28)").show();
					$(holderDay + " option:eq(29)").show();
					$(holderDay + " option:eq(30)").hide();
				}
			}
		},
		videotimer: function() {		
			if (Timesetting.dateseter_sec == 59) {
				Timesetting.dateseter_sec = 0;

				if (Timesetting.dateseter_min == 59) {
					Timesetting.dateseter_min = 0;
					Timesetting.dateseter_hour++;
					if (Timesetting.dateseter_hour == 24) {
						Timesetting.dateseter_hour = 0;
						Timesetting.getTimeInfo(); //一天交接的地方直接从后台拿数据刷新。
					}
				} else {
					Timesetting.dateseter_min++;
				}
			} else {
				Timesetting.dateseter_sec++;
			}
			str = Timesetting.swapsb(Timesetting.dateseter_hour.toString()) + ":" + Timesetting.swapsb(Timesetting.dateseter_min.toString()) + ":" + Timesetting.swapsb(Timesetting.dateseter_sec.toString());
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

		setDateTime: function() {
			plug.button.disable($("#date-save"));
			var args = {
				url: '/settimesetting.fcgi',
					data: {
						"datetime": $("#datemode-start-year").val() + "-" + $("#datemode-start-month").val() + "-" + $("#datemode-start-day").val() + " " + $("#datemode-start-hour").val() + ":" + $("#datemode-start-min").val() + ":" + $("#datemode-start-sec").val(),
						"timezone": $("#date-setTimeZone").val(),
						"sync2ntp": 0,
						"sync2dhcp": $(".date-ntpserver-radio-selected").val(),
						"sync2pc": 0,
						"ntpserver": $("#date-sns-manual").val(),
						"dlstState": 0,
						"dlstIsAuto": $(".date-daysave-model-selected").val(),
						"dlstOffset": $("#date-manual-timeoffset").val(),
						"dlstStartMonth": $("#date-manual-starttime-month").val(),
						"dlstStartWeek": $("#date-manual-starttime-week").val(),
						"dlstStartDay": $("#date-manual-starttime-day").val(),
						"dlstStartHour": $("#date-manual-starttime-hour").val(),
						"dlstStartMinute": $("#date-manual-starttime-minute").val(),
						"dlstEndMonth": $("#date-manual-endtime-month").val(),
						"dlstEndWeek": $("#date-manual-endtime-week").val(),
						"dlstEndDay": $("#date-manual-endtime-week").val(),
						"dlstEndHour": $("#date-manual-endtime-hour").val(),
						"dlstEndMinute": $("#date-manual-endtime-min").val()
					},
					success: function(json) {
						plug.button.enable($("#date-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.system.dateSetSuccess
							});
							if ($("#date-set-datetime-manual").attr("checked")) {
								var time = {
									"datetime": $("#datemode-start-year").val() + "-" + $("#datemode-start-month").val() + "-" + $("#datemode-start-day").val() + " " + $("#datemode-start-hour").val() + ":" + $("#datemode-start-min").val() + ":" + $("#datemode-start-sec").val()
								}
								Timesetting.resetServerTime(time.datetime);
							}else{
								Timesetting.resetServerTime(json.datetime);
							}
						} else if (json.errorCode == 1041) {
							plug.window.alert({
								"info": lang.ajax.system.yearerror
							});
						} else if (json.errorCode == 1045) {
							plug.window.alert({
								"info": lang.ajax.system.yearoverflow
							});
						} else if (json.errorCode == 1046) {
							plug.window.alert({
								"info": lang.ajax.system.ntpoverflow
							});
						} else if (json.errorCode == 1042) {
							plug.window.alert({
								"info": lang.ajax.system.timeConflicttimezone
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.system.dateSetError
							});
						}
						$(".date-current-time").show();
						$("#sync-manual-time-year").hide();
						$("#sync-manual-time-hour").hide();
						Timesetting.dateTimeManually = 0;
					},
					error: function(xhr) {
						plug.button.enable($("#date-save"));
					}
			};
			if ($("#date-daysave-enable").attr("checked")) {
				args.data.dlstState = 1;
			}
			if ($("#date-sysntp-server-enable").attr("checked")) {
				args.data.sync2ntp = 1;
			} else {
				args.data.sync2ntp = 0;
			}
			if ($("#date-set-datetime-manual").attr("checked")) {
				args.data.sync2pc = 1;
			} else {
				args.data.sync2pc = 0;
			}

			common.setAjax.init(args);
		}
	};
	Timesetting.init();
})

