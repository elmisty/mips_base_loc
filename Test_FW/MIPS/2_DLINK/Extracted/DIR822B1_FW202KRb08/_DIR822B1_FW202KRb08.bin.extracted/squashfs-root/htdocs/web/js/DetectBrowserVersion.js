function DetectBrowserVersion(){var h=navigator.appVersion;var i=navigator.userAgent;var f=navigator.appName;var g=""+parseFloat(navigator.appVersion);var c=parseInt(navigator.appVersion,10);var b,d,a;var e=0;if((d=i.indexOf("Opera"))!=-1){f="Opera";g=i.substring(d+6);if((d=i.indexOf("Version"))!=-1){g=i.substring(d+8)}}else{if((d=i.indexOf("MSIE"))!=-1){f="Microsoft Internet Explorer";g=i.substring(d+5)}else{if((d=i.indexOf("Sleipnir"))!=-1){f="Sleipnir";g=i.substring(d+9)}else{if((d=i.indexOf("Chrome"))!=-1){f="Chrome";g=i.substring(d+7)}else{if((d=i.indexOf("Safari"))!=-1){f="Safari";g=i.substring(d+7);if((d=i.indexOf("Version"))!=-1){g=i.substring(d+8)}}else{if((d=i.indexOf("Firefox"))!=-1){f="Firefox";g=i.substring(d+8);e=1}else{if((b=i.lastIndexOf(" ")+1)<(d=i.lastIndexOf("/"))){f=i.substring(b,d);g=i.substring(d+1);if(f.toLowerCase()==f.toUpperCase()){f=navigator.appName}}}}}}}}if((a=g.indexOf(";"))!=-1){g=g.substring(0,a)}if((a=g.indexOf(" "))!=-1){g=g.substring(0,a);c=parseInt(""+g,10)}if(isNaN(c)){g=""+parseFloat(navigator.appVersion);c=parseInt(navigator.appVersion,10)}return[f,g,e]};