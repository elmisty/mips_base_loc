(function($){
		$.fn.CreateDrawer = function(options){

			var _options = $.extend({}, $.fn.CreateDrawer.defaults, options);
			var $drawer = $(this);

			var a = "<div class='motionTable-plug'>";
			var tempzeros = "";
			function transToBinary(num) {
				var tempzeros = '';
				var tmp = (parseInt(num)).toString(2);
				var p = 8 - tmp.length;
				if (p > 0) {
					for( var ii = 0; ii < p; ii++) {
						tempzeros += '0';
					}
				}
				tempzeros += tmp;
				return tempzeros;
			};

			for (var row = 0;row < _options.row; row++) {
			
				a += "<div class='motionTable-tr'>";

				for (var column = 0; column < _options.column; column++) {
					if ((column/8) >= 1) {
						var ten = transToBinary(_options.area[2*row+1]);
						if (ten[column - 8] == '1') {
							var item = "<div class='motion-rec motion-rec-selected' id='recid-"+ column +"-"+ row +
							"' ></div>";
						} else {
							var item = "<div class='motion-rec' id='recid-"+ column +"-"+ row +
							"' ></div>";
						}
					} else {
						var ten = transToBinary( _options.area[2*row]);				
						if (ten[column] == '1') {
							var item = "<div class='motion-rec motion-rec-selected' id='recid-"+ column +"-"+ row +
							"' ></div>";
						} else {
							var item = "<div class='motion-rec' id='recid-"+ column +"-"+ row +
							"' ></div>";
						}
					}
							
					a += item;
				}
				a += "</div>"
			}
			a += "</div>";
			$drawer.html(a);
			//document.getElementById("myTable").innerHTML = a;

			var mouseonFlag = 1; //鼠标按下标志
			var mousemoveFlag = 0; //鼠标拖动标志
			var downcoo = {}; //按下的格子坐标
			var finalcoo = {}; //拖动停止的格子坐标
			var mode = "fill"; //fill：选中模式；clear：清除选中模式


			//画布事件
			$drawer.bind({
				"mousedown":function(){
					if( typeof $(".motion-rec-hover").attr("id") == "undefined") {//拖动出去或其他错误情况就退出函数
							return false;
						}
					mouseonFlag = 1;
					if ( $(".motion-rec-hover").hasClass("motion-rec-selected") ){
						mode = "clear";
					}else{
						mode = "fill";
					}
					var reccoo = $(".motion-rec-hover").attr("id").split("-");
					downcoo.x = Number(reccoo[1]);
					downcoo.y = Number(reccoo[2]);

				},
				"mousemove":function(){
					window.getSelection().removeAllRanges();//clear selection
					if(mouseonFlag == 1){
						mousemoveFlag = 1;//发生拖动
						if( typeof $(".motion-rec-hover").attr("id") == "undefined") {//拖动出去或其他错误情况就退出函数
							return false;
						}
						var reccoo = $(".motion-rec-hover").attr("id").split("-");
						finalcoo.x = Number(reccoo[1]);
						finalcoo.y = Number(reccoo[2]);

						var numCol = finalcoo.x - downcoo.x ;
						var numRow = finalcoo.y - downcoo.y ;

						if (numCol >= 0 && numRow >= 0 ) {  //south-east or south or east
							for(i=0;i<=numCol;i++){
								var delx = finalcoo.x - i;
								for(j=0;j<=numRow;j++){
									var dely = finalcoo.y - j;
									var selectItem = "recid-"+delx+"-"+dely;
									modeSelect(mode,selectItem);
								}
							}
						}else if(numCol > 0 && numRow < 0 ){ //north-east
							for(i=0;i<=numCol;i++){
								var delx = finalcoo.x - i;
								for(j=0;j<=(-numRow);j++){
									var dely = finalcoo.y + j;
									var selectItem = "recid-"+delx+"-"+dely;
									modeSelect(mode,selectItem);
								
								}
							}
						}else if(numCol < 0 && numRow > 0){ //south-west
							for(i=0;i<=(-numCol);i++){
								var delx = finalcoo.x + i;
								for(j=0;j<=numRow;j++){
									var dely = finalcoo.y - j;
									var selectItem = "recid-"+delx+"-"+dely;
									modeSelect(mode,selectItem);
								}
							}						
						}else if(numCol <= 0 && numRow <= 0){ //north-west or north or west
							for(i=0;i<=(-numCol);i++){
								var delx = finalcoo.x + i;
								for(j=0;j<=(-numRow);j++){
									var dely = finalcoo.y + j;
									var selectItem = "recid-"+delx+"-"+dely;
									modeSelect(mode,selectItem);						
								}
							}
						}				
					}
				},
				"mouseup":function(){
					if(mousemoveFlag == 0){//如果是被选中则取消选中，没被选中则选中
						$(".motion-rec-hover").hasClass("motion-rec-selected") ? $(".motion-rec-hover").removeClass("motion-rec-selected") : $(".motion-rec-hover").addClass("motion-rec-selected");
					}
					mouseonFlag = 0;
					downcoo = {};
					finalcoo = {};
					mousemoveFlag = 0;
				},
				"mouseleave":function(event){
					window.getSelection().removeAllRanges();//clear selection
					event.stopPropagation();//停止事件冒泡
					$drawer.mouseup();
				}
			});

			//格子悬浮事件
			$(".motion-rec").hover(function(){
				$(this).addClass("motion-rec-hover");
			},function(){
				$(this).removeClass("motion-rec-hover");
			});

			//全局禁止事件
			/*document.ondragstart = function() { //禁止拖动
    			return false;
			};*/
			document.onselectstart = function(event){ //禁止全选
				if(event.target.tagName!="INPUT"){
		            return false;
		        }
			};

			//模式选择clear or fill
			function modeSelect(mode,selectItem){
				if ( mode == "clear"){
					if( $("#"+selectItem).hasClass("motion-rec-selected") ){
							$("#"+selectItem).removeClass("motion-rec-selected");
					}
				}else{
					if( !$("#"+selectItem).hasClass("motion-rec-selected") ){
						$("#"+selectItem).addClass("motion-rec-selected");
					}
				}
			};
		}

		$.fn.CreateDrawer.defaults = {
        	row: 12,
        	column: 16,
        	area:[0,4,8,0,0,0,0,0,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    	}
		

})(jQuery)

	

