function LOCALIZE(){}LOCALIZE.prototype={localize:null,GetLangfile:function(c){var a=this;if(c==="auto"){var b=(navigator.browserLanguage||navigator.language);c=b.toLowerCase()}$.ajax({type:"GET",url:"/js/localization/"+c+".js",dataType:"json",async:false}).done(function(d){a.localize=d;sessionStorage.setItem("langPack",JSON.stringify(d))}).fail(function(f,d,e){})},LangReplace:function(c,b){try{var d=(c.length>0)?new RegExp("\\$([1-"+c.length.toString()+"])","g"):null;var g=this.localize.hasOwnProperty(b)?this.localize[b]:b;var a=String(g).replace(d,function(h,e){e++;return c[e]});return a}catch(f){return b}}};var LANG=new LOCALIZE();function InitLANG(b){var a=sessionStorage.getItem("langPack");if(a==null){LANG.GetLangfile(b)}else{LANG.localize=JSON.parse(a)}}function I18N(d,b){var a=arguments;var c;b=b.toString()||"";c=LANG.LangReplace(a,b);if(d==="h"){document.write(c)}else{if(d==="j"){return c}}};