function initialDetectRouterConnection(b){var a="";if(b=="Home"){a+='<div id="dialogBox" style="width:616px">'}else{a+='<div class="dialogBox" style="width:616px">'}a+='<table class="myCreatePop_table" border="0" cellspacing="0" id="RouterConnectionTable">';a+="<tbody>";a+='<tr><td colspan="3"><div class ="popTitle">'+I18N("j","Router Not Found")+"</div></td></tr>";a+='<tr><td id="save_td" colspan="4"><center><div id="Save_edit_pop_btn" style="cursor:pointer" tabindex="12" onclick="CheckHTMLStatus(\'\');">'+I18N("j","Retry")+"</div></center></td></tr>";a+="</tbody>";a+="</table>";a+="</div>";document.getElementById("DetectRouterConnection").innerHTML=a};