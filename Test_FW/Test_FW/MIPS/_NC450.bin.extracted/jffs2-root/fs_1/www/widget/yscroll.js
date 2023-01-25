(function($){
	$.fn.addScroll = function(holder){


			var $mainBox = $(this);
			if ( typeof holder == 'undefined' ){
                var $contentBox = $mainBox.find(".plug-table-body-test");
            }else{
                //console.log(holder);
                var $contentBox = $mainBox.find(holder);
            }      
			var mainBox = $mainBox.get(0);  
            var contentBox = $contentBox.get(0);  
            var scrollDiv;

        	var _wheelData = -1;

			function bind(obj, type, handler) {  
                var node = typeof obj == "string" ? $(obj) : obj;  
                if (node.addEventListener) {  
                    node.addEventListener(type, handler, false);  
                } else if (node.attachEvent) {  
                    node.attachEvent('on' + type, handler);  
                } else {  
                    node['on' + type] = handler;  
                }  
        	}  
            //IE
            function mouseWheel(obj, handler) {  
                var node = typeof obj == "string" ? $(obj) : obj;  
                bind(node, 'mousewheel', function(event) {  
                    var data = -getWheelData(event);  
                    handler(data);  
                    if (document.all) {  //可判断是否IE
                        window.event.returnValue = false;  
                    } else {  
                        event.preventDefault();  
                    }  
      
                });  
                //火狐  
                bind(node, 'DOMMouseScroll', function(event) {  
                    var data = getWheelData(event);  
                    handler(data);  
                    event.preventDefault();  
                });  
                function getWheelData(event) {  
                    var e = event || window.event;  
                    return e.wheelDelta ? e.wheelDelta : e.detail * 40;  //返回按ie与ff不同
                }  
            }  
      
           // addScroll.prototype = {  
            	//初始化
            function init() {  
                //var mainBox = doc.getElementById(mainBox);  
                //var contentBox = doc.getElementById(contentBox);  
               // var scrollDiv = this._createScroll(mainBox, className);  

                createScroll();   
                resizeScorll();  
                tragScroll(scrollDiv, mainBox,contentBox);  
                wheelChange(scrollDiv, mainBox,contentBox);  
                clickScroll(scrollDiv, mainBox,contentBox);  
            }
                //创建滚动条  
                function createScroll() {  
                    /*var _scrollBox = doc.createElement('div')  
                    var _scroll = doc.createElement('div');  
                    var span = doc.createElement('span');*/
                    var _scroll = "<div class='plug-table-scroll-cell'><div class='plug-table-scroll'>"
                    				+"<span></span></div></div>";  
                    $mainBox.append(_scroll); 
                    scrollDiv = $(".plug-table-scroll").get(0);
                } 
                //调整滚动条  
                function resizeScorll() {
                    var conHeight = contentBox.offsetHeight; //内容实际高度
                    var _width = mainBox.clientWidth;  //mainbox 窗口宽度
                    var _height = mainBox.clientHeight;  //mainbox 窗口高度
                    var _scrollWidth = scrollDiv.offsetWidth;  //滚动条 宽度
                    var _left = _width - _scrollWidth;  

                	$(".plug-table-scroll-cell").css({
                		"width" : _scrollWidth + "px",
                		"height" : _height + "px",
                		"left" : (_left + 1) + "px",
                		"position" : "absolute",
                		"background" : "#f0f0f0"
                	});

                	/*$contentBox.css({
                		"width" :  (mainBox.offsetWidth - _scrollWidth) + "px"//内容区宽度
                	});*/



                	/*$(".plug-table-scroll").css({

                	});
                    
                    /*p.style.width = _scrollWidth + "px";  
                    p.style.height = _height + "px";  
                    p.style.left = _left + "px";  
                    p.style.position = "absolute";  
                    p.style.background = "#ccc";  
                    contentBox.style.width = (mainBox.offsetWidth - _scrollWidth)  //内容区宽度
                            + "px";  */
                    var _scrollHeight = parseInt(_height * (_height / conHeight)); //滚动条高度 
                    if (_scrollHeight >= mainBox.clientHeight) {  //内容不超过框，不需要滚动条
                        scrollDiv.parentNode.style.display = "none";  
                    }  
                    scrollDiv.style.height = _scrollHeight + "px";  
                } 
                //拖动滚动条  
                function tragScroll(element, mainBox, contentBox) {  
                    var mainHeight = mainBox.clientHeight; 

                    element.onmousedown = function(event) {  //按下鼠标
                        var _this = this;  
                        var _scrollTop = element.offsetTop;
                        var e = event || window.event;  
                        var top = e.clientY;  //按下鼠标时的坐标

                        //this.onmousemove=scrollGo;  
                        document.onmousemove = scrollGo;  //按下鼠标后移动鼠标，触发scrollGo
                        document.onmouseup = function(event) {  //按下鼠标后释放鼠标
                            this.onmousemove = null;  //释放鼠标后移动不触发事件
                        }  
                        function scrollGo(event) {  
                            var e = event || window.event;  
                            var _top = e.clientY;  //移动坐标
                            
                            var _t = _top - top + _scrollTop;  //相对main框移动坐标量

                            if (_t > (mainHeight - element.offsetHeight)) {  
                                _t = mainHeight - element.offsetHeight;  
                            }  
                            if (_t <= 0) {  
                                _t = 0;  
                            }  

                            element.style.top = _t + "px";//滑动块的移动 
                            //console.log("scrollDiv:"+scrollDiv.style.top); 
                            contentBox.style.top = -_t    //内容框的移动
                                    * (contentBox.offsetHeight / mainBox.offsetHeight)  
                                    + "px";

                            _wheelData = _t;  
                        }  
                    }  
                    element.onmouseover = function() {  
                        this.style.background = "#b2b2b2";  
                    }  
                    element.onmouseout = function() {  
                        this.style.background = "#cdcdcd";  
                    }  
                } 
                //鼠标滚轮滚动，滚动条滚动  
                function wheelChange(element, mainBox, contentBox) {  
                    var node = typeof mainBox == "string" ? $(mainBox) : mainBox;  
                    var flag = 0, rate = 0, wheelFlag = 0;  
                    if (node) {  
                        mouseWheel(  
                                node,  
                                function(data) {  
                                    wheelFlag += data;  
                                    if (_wheelData >= 0) {  
                                        flag = _wheelData;  
                                        element.style.top = flag + "px";  
                                        wheelFlag = _wheelData * 12;  
                                        _wheelData = -1;  
                                    } else {  
                                        flag = wheelFlag / 12;  
                                    }  
                                    if (flag <= 0) {  
                                        flag = 0;  
                                        wheelFlag = 0;  
                                    }  
                                    if (flag >= (mainBox.offsetHeight - element.offsetHeight)) {  
                                        flag = (mainBox.clientHeight - element.offsetHeight);  
                                        wheelFlag = (mainBox.clientHeight - element.offsetHeight) * 12;  
      
                                    }  
                                    element.style.top = flag + "px";  
                                    contentBox.style.top = -flag  
                                            * (contentBox.offsetHeight / mainBox.offsetHeight)  
                                            + "px";  
                                });  
                    }  
                }
                function clickScroll(element, mainBox, contentBox) {  
                    var p = element.parentNode;  
                    //console.log("p:"+p);
                    p.onclick = function(event) {  
                        var e = event || window.event;  
                        var t = e.target || e.srcElement;  
                        var sTop = document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop  
                                : document.body.scrollTop;  
                        var _top = e.offsetY - element.offsetHeight/2;
                        if (_top <= 0) {  
                            _top = 0;  
                        }  
                        if (_top >= (mainBox.clientHeight - element.offsetHeight)) {  
                            _top = mainBox.clientHeight - element.offsetHeight;  
                        }  
                        if (t != element) {  
                            element.style.top = _top + "px";  
                            contentBox.style.top = -_top  
                                    * (contentBox.offsetHeight / mainBox.offsetHeight)  
                                    + "px";  
                            _wheelData = _top;  
                        }  
                    }  
                }  
           // } 

            //new addScroll(mainBox, contentBox, className);  
            init();
    }
	       

})(jQuery)