function Datalist(){this.list=new Array();this.maxrowid=0}Datalist.prototype.getData=function(b){var a;var c;for(a=0;a<this.list.length;a++){c=this.list[a];if(c.rowid==b){break}}return c};Datalist.prototype.getRowNum=function(a){var b=0;for(b=0;b<this.list.length;b++){if(a==this.list[b].rowid){break}}return b};Datalist.prototype.editData=function(c,a){var b=this.getRowNum(c);if(this.checkData(a,b)==false){return false}a.setRowid(c);this.list.splice(b,1,a);a.setDataToRow($("#tr"+a.rowid));return true};Datalist.prototype.deleteData=function(b){var a=this.getRowNum(b);this.list.splice(a,1);$("#tr"+b).remove()};Datalist.prototype.push=function(a){if(this.checkData(a,null)==false){return false}a.setRowid(this.maxrowid);this.list.push(a);this.maxrowid++;a.addRowToHTML("tblStaticRoute");return true};Datalist.prototype.checkData=function(b,c){var a;for(a=0;a<this.list.length;a++){if(a==c){continue}if(this.list[a].name==b.name){alert(I18N("j","Name cannot be the same."));return false}if((this.list[a].ipAddress==b.ipAddress)&&(this.list[a].tcpPort==b.tcpPort)&&(this.list[a].udpPort==b.udpPort)&&(this.list[a].schedule==b.schedule)){alert(I18N("j","Rule cannot be the same."));return false}}return true};Datalist.prototype.length=function(){return this.list.length};function Data(d,e,a,g,c,b){var f=parseInt(c,10);this.name=d;this.ipAddress=e;this.mask=a;this.gateway=g;this.metric=f;this.dev=b;this.setEnable("true")}Data.prototype={rowid:null,enable:null,name:null,ipAddress:null,mask:null,gateway:null,metric:null,dev:null,setRowid:function(a){this.rowid=a},setEnable:function(a){this.enable=a},showEnable:function(){var b;var a="";var c="true";if(this.enable=="true"){a="checked";c="false"}b='<input type="checkbox" onChange="datalist.list['+this.rowid+"].setEnable('"+c+"')\" "+a+"/>";return b},showName:function(){return HTMLEncode(this.name)},showDev:function(){if(this.dev=="WAN"){return I18N("j","WAN")}else{if(this.dev=="LAN"){return I18N("j","LAN")}}},addRowToHTML:function(c){var b;b="<tr id='tr"+this.rowid+"'></tr>";var a="#"+c+"> tbody";$(a).append(b);this.setDataToRow($("#tr"+this.rowid));return},setDataToRow:function(a){var b;b="<td>"+this.showEnable()+"</input></td>";b+="<td>"+this.showName()+"</td>";b+="<td>"+this.ipAddress+"</td>";b+="<td>"+this.mask+"</td>";b+="<td>"+this.gateway+"</td>";b+="<td>"+this.metric+"</td>";b+="<td>"+this.showDev()+"</td>";b+="<td><img src='image/edit_btn.png' width=28 height=28 style='cursor:pointer' onclick='editData("+this.rowid+")'/></td>";b+="<td><img src='image/trash.png' width=41 height=41 style='cursor:pointer' onclick='deleteData("+this.rowid+")'/></td>";a.html(b);return}};