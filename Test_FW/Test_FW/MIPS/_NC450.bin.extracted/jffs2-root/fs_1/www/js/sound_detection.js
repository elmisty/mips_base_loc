$(document).ready(function(){
	var SoundDetection = {
		X: null,
		r: null,
		Y: null,
		initflag: null,
		path: null,
		line: null,
		glow: null,
		datas: null,
		bgp: null,
		volumeValInterval:null,

		Init:function() {
			SoundDetection.Bind();

			$("tspan").attr("dy",0);
			SoundDetection.GetInfo();
		},

		Bind:function() {
			$("#sounde_detection-model-enable").click(function(){
				$("#sound-cell").show();
				SoundDetection.InitSoundGrid();
			});

			$("#sounde_detection-model-disable").click(function(){
				$("#sound-cell").hide();
				common.volumeValInterval = clearTimeout(common.volumeValInterval);
			});

			$("#sound_detection-save").click(function() {
				SoundDetection.SaveInfo();
			});

			$(".sounddec-radio").click(function() {
				$(".sounddec-radio").removeClass("sounddec-radio-selected");
				$(this).addClass("sounddec-radio-selected");
			});	
		},

		SaveInfo: function() {
			plug.button.disable($("#sound_detection-save"));

			var args = {
				url: '/SetAudioDetection.fcgi',
				data: {
					"adStatus": $(".sounddec-radio-selected").val(),
					"adSensitivity": $("#motion-sound-sensitivity").val()
				},	
				success: function(json) {
					plug.button.enable($("#sound_detection-save"));
					if (json.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.sounddetection.setSuccess
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.sounddetection.setFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#motionsounddetection-ctrl-save"));
				}			
			}
			common.setAjax.init(args);
		},

		GetInfo: function() {
			var args = {
				url: '/GetAudioDetection.fcgi',
				type: "post",
				success: function(json) {
					if (json.errorCode == 0) {
						$("#motion-sound-sensitivity").val(json.adSensitivity).change();
						if (json.adStatus != 0) {
							$("#sounde_detection-model-enable").val(json.adStatus);
						}
						json.adStatus == 0 ? $("#sounde_detection-model-disable").click() : $("#sounde_detection-model-enable").click();
					} else {

					}
					//plug.radio.initial($(".setting-contain-motionsoundalarm"));
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);			
		},

		InitSoundGrid:function() {
			if (SoundDetection.r) {
				SoundDetection.r.remove();
			}
			var labels = [lang.soundDetect.silence, 
						  lang.soundDetect.whisper, 
						  lang.soundDetect.quietHome, 
						  lang.soundDetect.hairDryer, 
						  lang.soundDetect.noisyOffice, 
						  lang.soundDetect.lawnMower/*0, 20, 40, 60, 80, 100*/];

			SoundDetection.datas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var data = SoundDetection.datas;

			// Draw
			var width = 580,
				height = 330,
				leftgutter = 70,
				bottomgutter = 20,
				topgutter = 20,
				r = Raphael("motiondetection-soundctrl", width + 50, height),
				txt = {
					font: '12px Helvetica, Arial',
					fill: "#000"
				},
				txt1 = {
					font: '14px Helvetica, Arial',
					fill: "#000"
				},
				txt2 = {
					font: '12px Helvetica, Arial',
					fill: "#000"
				},
				txt3 = {
					font: '14px Helvetica, Arial',
					"font-weight": "bold",
					fill: "#2DA1C8"
				}
				X = (width - leftgutter) / data.length,
				max = 100,
				Y = (height - bottomgutter - topgutter) / max;
				r.drawGrid(leftgutter + X * .5 + .5, topgutter, width - leftgutter - X, height - topgutter - bottomgutter, 0, 5, "#ccc");

				t = r.text(560, 323, lang.soundDetect.currentSound).attr(txt3);

				for (var i = 0, ii = labels.length; i < ii; i++) {
					t = r.text(X * .5 + 30, 28 * (6 - i) * 2 - 30, labels[i]).attr(txt);
				}
			
				/**
				 *  谷歌下不加此代码会导致纵坐标错位
				 **/
				$("tspan").attr("dy",0);

				SoundDetection.X = X;
				SoundDetection.r = r;
				SoundDetection.Y = Y;
				SoundDetection.labels = labels;


				var initPath = SoundDetection.getSoundPath(data);
				SoundDetection.path = r.path(initPath.p)
				.attr({
					stroke: "#4DBDD4",
					"stroke-width": 4,
					"stroke-linejoin": "round"
				});	
							
				SoundDetection.bgp = r.path(initPath.bgpp).attr({
					stroke: "none",
					opacity: .8,
					y: 252,
					fill: "#C5EDF1"
				});
				　
				var rightborder = r.path("M571,21v,290").attr({ //蓝色右边
					"fill": "#4DBDD4",
					"stroke-width": 3,
					'stroke': "#4DBDD4"
				});
			
				SoundDetection.refreshSound(data);
		},
		getVoVal: function() {
			var args = {
				url: '/GetADData.fcgi',
				type: "post",
				success: function(json) {
					SoundDetection.datas.shift();
					if (json.errorCode == 0) {
						SoundDetection.datas.push(json.adSounddata);
					} else {
						SoundDetection.datas.push(0);
					}
					if (!common.volumeValInterval) {
						return;
					}
					SoundDetection.refreshSound(SoundDetection.datas);
				},
				error: function(xhr) {
					SoundDetection.datas.push(0);
					if (!common.volumeValInterval) {
						return;
					}
					SoundDetection.refreshSound(SoundDetection.datas);
				}
			}
			common.ajax.init(args);
		},

		refreshSound: function(val) {
			common.volumeValInterval = clearTimeout(common.volumeValInterval);
			var r = SoundDetection.r;
			var datas = val || [0, 0, 0, 0, 0, 0];
			var newPath = SoundDetection.getSoundPath(datas);
			SoundDetection.path.animate({
				path: newPath.p
			}, 0, "linear", function() {
				common.volumeValInterval = setTimeout(function() {
					SoundDetection.getVoVal();
				}, 500);
			});

			SoundDetection.bgp.animate({
				path: newPath.bgpp
			}, 0, "linear");
		},

		getSoundPath: function(data) {
			var r = SoundDetection.r;
			var path;

			var width = 580,
				height = 330,
				leftgutter = 70,
				bottomgutter = 20,
				txt = {
					font: '12px Helvetica, Arial',
					fill: "#000"
				},
				topgutter = 30;
			var labels = SoundDetection.labels,
				X = SoundDetection.X,
				Y = SoundDetection.Y;

			var p, bgpp;
			for (var i = 0, ii = data.length; i < ii; i++) {
				var y = Math.round(height - bottomgutter - Y * data[i]),
					x = Math.round(leftgutter + X * (i + .5));
				if (!i) {
					p = ["M", x, y, "C", x, y];
					bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
				}
				if (i && i < ii - 1) {
					var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
						X0 = Math.round(leftgutter + X * (i - .5)),
						Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
						X2 = Math.round(leftgutter + X * (i + 1.5));
					var a = getAnchors(X0, Y0, x, y, X2, Y2);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
				}
			}
			p = p.concat([x, y, x, y]);
			bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
			return {
				"p": p,
				"bgpp": bgpp
			};　
		},
		currentLine : null,
		finalLine : null			
	};
	SoundDetection.Init();
})
