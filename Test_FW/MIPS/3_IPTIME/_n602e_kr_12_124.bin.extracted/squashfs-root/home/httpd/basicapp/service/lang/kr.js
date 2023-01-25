// JavaScript Set Language (kr)
var D_lang = {
	"D_USB_TETHERING_STARTED" : "USB테더링사용중",
	"D_USB_TETHERING_FOUND" : "테더링 장치 검색됨",
	"D_USB_TEHERING_NOT_FOUND" : "테더링 장치 검색되지않음",
	"D_NO_PRINTER_FOUND" : "중단됨(프린터없음)",
	"D_NOT_INSTALLED" : "설치되지 않음",
	"D_NOT_INSTALLED_FS" : "설치되지 않음",

	"D_DDNS_SUCCESS" : "정상 등록",
	"D_DDNS_BAD_AUTH" : "사용자 이름 또는 암호 오류",
	"D_DDNS_PARAMETER_INVALID" : "매개변수 오류",
	"D_DDNS_BLOCKED" :  "클라이언트 접속 차단됨",
	"D_DDNS_DOMAIN_NOT_SUPPORTED" : "지원되지 않는 Domain",
	"D_DDNS_HOSTNAME_NOT_EXIST" : "등록되지 않은 호스트이름"	,
	"D_DDNS_USER_IS_NOT_A_DONATOR" : "기부자가 아님",
	"D_DDNS_NOT_YOURS" : "다른 사용자의 호스트이름",
	"D_DDNS_CUSTOM_DNS_NOT_ACT" : "Active 되어 있지 않음",
	"D_DDNS_HOSTNAME_IS_BLOCKED_BY_ABUSE" : "등록이 차단된 호스트이름",
	"D_DDNS_TOO_MANY_OR_FEW" : "호스트들의 갯수 오류",
	"D_DDNS_DDNS_ERROR" : "DNS 오류",
	"D_DDNS_SERVER_SHUTDOWN" :  "서버가 동작하지 않음",
	"D_DDNS_CONN_FAIL" : "연결 실패",
	"D_DDNS_ONLY_ONE_DOMAIN" : "다른 호스트이름이 등록되어 있음.",
	"D_DDNS_UNKNOWN_ERROR" : "알수없는 오류",
}
var S_lang = {
	"S_PAGE_TITLE" : "서비스 설정",
	"S_SERVICE_TITLE" : "서비스",
	"S_SUBTITLE_TITLE" : "접속된 서비스 이름",	

	"S_IPDISK_TITLE" : "ipDISK 주소관리",
	"S_IPDISK_HOSTNAME_TITLE" : "ipDISK 주소",
	"S_IPDISK_EMAIL_TITLE" : "ipDISK 이메일",
	"S_IPDISK_SERVICE_STOP_CONFIRM" : "ipDISK서버를 중단할 경우, 설정된 ipDISK주소 등록이 취소됩니다.\n또한, 설정되어 있던 ipDISK주소를 다른사용자가 사용할수도 있습니다.\n계속 진행하시겠습니까?", 

	"S_FTP_TITLE" : "ipDISK/FTP 서비스",
	"S_FTP_CHARSET_TITLE" : "문자셋",
	"S_FTP_PORT_TITLE" : "FTP 포트",	
	"S_FTP_IPDISKPORT_TITLE" : "HTTP 포트",
	"S_FTP_USERSETUP_TITLE" : "사용자설정",
	"S_FTP_USERSETUP_PROPERTY" : "속성",
	"S_FTP_USERSETUP_USERID" : "사용자ID",
	"S_FTP_USERSETUP_PASSWD" : "암호",
	"S_FTP_USERSETUP_PASSWD_VISIBLE" : "보기",

	"S_AFP_TITLE" : "AFP 서비스",
	"S_AFP_SERVER_NAME" : "서버 이름",	

	"S_SAMBA_TITLE" : "윈도우 파일공유 서비스",
	"S_SAMBA_NAME_TITLE" : "서버이름",
	"S_SAMBA_GROUP_TITLE" : "작업그룹",	
	"S_SAMBA_USERSETUP_TITLE" : "사용자설정",
	"S_SAMBA_USERSETUP_PROPERTY" : "속성",
	"S_SAMBA_USERSETUP_USERID" : "사용자ID",
	"S_SAMBA_USERSETUP_PASSWD" : "암호",
	"S_SAMBA_USERSETUP_PASSWD_VISIBLE" : "보기",

	"S_SAMBA_USE_NETWORK_TRASH_STR" : "휴지통 사용",
	"S_SAMBA_SMB_PROTOCOL_STR" : "프로토콜",
	"S_SAMBA_SMB_PROTOCOL_STR12" : "SMB1 + SMB2",
	"S_SAMBA_SMB_PROTOCOL_STR1" : "SMB1",
	"S_SAMBA_SMB_PROTOCOL_STR2" : "SMB2",
			
	"S_APACHE_TITLE" : "Apache 서버",
	"S_APACHE_SERVICE_TITLE" : "서비스",
	"S_APACHE_PORT_TITLE" : "포트번호",
	"S_APACHE_DATAFOLDER_TITLE" : "DocumentRoot",	
	"S_APACHE_SERVERFOLDER_TITLE" : "ServerRoot",
	
	"S_MYSQL_TITLE" : "MySQL 서버",
	"S_MYSQL_PORT_TITLE" : "포트번호",
	"S_MYSQL_DATAFOLDER_TITLE" : "DB폴더",	
	"S_MYSQL_CHARSET_TITLE" : "서버 문자셋",
	"S_MYSQL_MAP_TITLE" : "최대허용패킷",
	"S_MYSQL_DESC1" : "주의",
	"S_MYSQL_DESC2" : "설정된 DB폴더로 최초 실행 시, MySQL 계정이 'root'/암호없음 으로 설정됩니다.",
	"S_MYSQL_DESC3" : "보안을 위해 DB접근계정을 재설정한 후 사용하십시오.",
	
	"S_TORRENT_TITLE" : "토렌트",
	"S_TORRENT_USERID_TITLE" : "사용자ID",
	"S_TORRENT_PASSWD_TITLE" : "암호",	
	"S_TORRENT_PORT_TITLE" : "포트번호",
	"S_TORRENT_DATAFOLDER_TITLE" : "다운로드폴더",
	
	"S_MEDIA_TITLE" : "미디어 서버",
	"S_MEDIA_NAME_TITLE" : "서버이름",
	"S_MEDIA_DATAFOLDER_TITLE" : "미디어폴더",	
	"S_MEDIA_PATH_TITLE" : "미디어DB폴더",
	"S_MEDIA_UPDATEDATADB_TITLE" : "마지막업데이트",
	"S_BUTTON_UPDATE" : "미디어DB 수동업데이트",

	"S_ITUNES_TITLE" : "iTunes 서버",
	"S_ITUNES_NAME_TITLE" : "서버이름",
	"S_ITUNES_DATAFOLDER_TITLE" : "iTunes 음악 폴더",	
	"S_ITUNES_PATH_TITLE" : "미디어DB",
	"S_ITUNES_AUTOSCAN" : "자동 검색",
	"S_ITUNES_PERIOD" : "분마다 음악 폴더 검색",

	"S_RSYNC_TITLE" : "Cloud백업 서비스",
	"S_RSYNC_USERID_TITLE" : "사용자ID",
	"S_RSYNC_PASSWD_TITLE" : "암호",	
	"S_RSYNC_PORT_TITLE" : "포트번호",
	"S_RSYNC_DATAFOLDER_TITLE" : "백업폴더",

	"S_IPTIMECLOUD_TITLE" : "ipTIME Cloud 서비스",
	"S_IPTIMECLOUD_USERID_TITLE" : "사용자ID",
	"S_IPTIMECLOUD_PASSWD_TITLE" : "암호",	
	"S_IPTIMECLOUD_PORT_TITLE" : "포트번호",
	"S_IPTIMECLOUD_DATAFOLDER_TITLE" : "홈 폴더",
	
	"S_URL_TITLE" : "URL 서비스",
	"S_URL_ENABLEAUTH_TITLE" : "사용자인증",
	"S_URL_USERID_TITLE" : "사용자ID",	
	"S_URL_PASSWD_TITLE" : "암호",
	"S_URL_PORT_TITLE" : "포트번호",
	
	"S_TETHERING_TITLE" : "USB 테더링",
	"S_TETHERING_DESC1" : "USB테더링 기능설명",
	"S_TETHERING_DESC2" : "1. USB 테더링기능을 사용하면, 스마트폰을 통한 인터넷을 사용할수 있습니다.",
	"S_TETHERING_DESC3" : "2. 공유기와 스마트폰을 USB케이블로 연결하고 스마트폰의 [USB테더링기능]을 활성화한 후 사용 가능합니다.",
	"S_TETHERING_DESC4" : "3. 안드로이드 계열 스마트폰을 지원합니다.(일부호환되지 않는 기종이 있을 수 있습니다.)",
	"S_TETHERING_DESC5" : "4.스마트폰이 3G/LTE등으로 연결된 경우, 요금제에 따라 데이터 요금이 발생할 수 있습니다.",
	"S_TETHERING_DESC6" : "5. 공유기의 WAN포트가 연결되어 있는 상태에는 동작하지 않습니다.",
	
	"S_CUPSD_TITLE" : "네트워크 프린터 서버",
	"S_WANPORT_TITLE" : "WAN 접속",
	"S_CUPSD_DESC1" : "네트워크 프린터 기능 설명",
	"S_CUPSD_DESC2" : "네트워크 프린터 서버 기능을 통해 공유기에 연결된 USB 프린터를 네트워크 프린터 방식으로 사용할 수 있습니다.",
	"S_CUPSD_DESC3" : "메모리 여유 공간(",
	"S_CUPSD_DESC4" : ")을 초과하는 파일은 인쇄할 수 없습니다.",

	"S_USERLIST_TITLE" : "접속된 서비스/사용자",
	"S_USERLIST_DETAILVIEW" : "상세보기",
	"S_USERLIST_USERTEXT" : "사용자 : _명",
	"S_USERLIST_USERID" : "접속된 서비스/사용자",	
	"S_USERLIST_IPADDR" : "접속 IP주소",	
	"S_USERLIST_TIME" : "접속 시간",
	"S_USERLIST_NOUSER" : "현재 접속한 사용자가 없습니다.",	
	"S_USERLIST_LOAD_USER_INFO" : "사용자 정보 불러오는중...",
	"S_USERLIST_NOTIME" : "--",

	"S_CLIENTUSESERVERCHAR" : "클라이언트에서 서버문자셋 사용",
	"S_CHARCASE" : "DB 테이블 이름 대소문자 구분",
	"S_ADD_NEW_DIR" : "에 새로 만들기",
	"S_MYSQL_NEWFOLDER" : "새로운 폴더이름 입력", 
	"S_NEWFOLDER" : "새로운 폴더이름 입력", 
	
	"S_PORT_ERROR" : "포트번호가 비어있거나 잘못 입력되었습니다.\n허용범위(1-65535)", 
	"S_PORT_80_ERROR" : "80 포트는 사용하실 수 없습니다.", 
	"S_IPDISKPORT_ERROR" : "포트번호가 비어있거나 잘못 입력되었습니다.\n허용범위(1-65535)", 
	"S_HOSTNAME_ERROR" : "ipDISK주소가 비어있거나 잘못 입력되었습니다.", 
	"S_EMAIL_ERROR" : "이메일 형식이 비어있거나 잘못되었습니다.", 
	"S_NAME_ERROR" : "서버이름 형식이 비어있거나 잘못되었습니다.", 
	"S_GROUP_ERROR" : "작업그룹 형식이 비어있거나 잘못되었습니다.", 
	"S_USERID_ERROR" : "사용자ID 형식이 비어있거나 잘못되었습니다.", 
	"S_PASSWD_ERROR" : "비밀번호 형식이 비어있거나 잘못되었습니다.\n(특수문자 !,@,#,$,%,^,*,+,=,- 만 허용)",
	"S_MAXALLOWPACKET_ERROR" : "최대허용패킷이 비어있거나 잘못 입력되었습니다.\n허용범위(1-999)", 

	"S_DATAFOLDER_ERROR" : "폴더를 선택해주세요.", 
	"S_SERVERFOLDER_ERROR" : "폴더를 선택해주세요.",  

	"S_USERID0_ERROR" : "1번째 사용자ID 형식이 비어있거나 잘못되었습니다.", 
	"S_USERID1_ERROR" : "2번째 사용자ID 형식이 비어있거나 잘못되었습니다.", 
	"S_USERID2_ERROR" : "3번째 사용자ID 형식이 비어있거나 잘못되었습니다.", 
	"S_USERID3_ERROR" : "4번째 사용자ID 형식이 비어있거나 잘못되었습니다.", 
	"S_USERID4_ERROR" : "5번째 사용자ID 형식이 비어있거나 잘못되었습니다.", 
	"S_PASSWD0_ERROR" : "1번째 사용자 비밀번호 형식이 비어있거나 잘못되었습니다.\n(특수문자 !,@,#,$,%,^,*,+,=,- 만 허용)",
	"S_PASSWD1_ERROR" : "2번째 사용자 비밀번호 형식이 비어있거나 잘못되었습니다.\n(특수문자 !,@,#,$,%,^,*,+,=,- 만 허용)",
	"S_PASSWD2_ERROR" : "3번째 사용자 비밀번호 형식이 비어있거나 잘못되었습니다.\n(특수문자 !,@,#,$,%,^,*,+,=,- 만 허용)", 
	"S_PASSWD3_ERROR" : "4번째 사용자 비밀번호 형식이 비어있거나 잘못되었습니다.\n(특수문자 !,@,#,$,%,^,*,+,=,- 만 허용)",
	"S_PASSWD4_ERROR" : "5번째 사용자 비밀번호 형식이 비어있거나 잘못되었습니다.\n(특수문자 !,@,#,$,%,^,*,+,=,- 만 허용)", 
	
	"S_DATAFOLDER_ERROR_NEWDIR" : "새로운 폴더명 형식이 비어있거나 잘못되었습니다.",
	"S_SERVERFOLDER_ERROR_NEWDIR" : "새로운 폴더명 형식이 비어있거나 잘못되었습니다.",

	"S_MYSQL_DATAFOLDER" : [{"value" : "" , "text" : "DB 폴더를 선택하세요"}],
	"S_APACHE_DATAFOLDER" : [{"value" : "" , "text" : "Doc 폴더를 선택하세요"}],
	"S_APACHE_SERVERFOLDER" : [{"value" : "" , "text" : "Server 폴더를 선택하세요."}],
	"S_TORRENT_DATAFOLDER" : [{"value" : "" , "text" : "다운로드 폴더를 선택하세요"}],
	"S_RSYNC_DATAFOLDER" : [{"value" : "" , "text" : "백업 폴더를 선택하세요"}],
	"S_IPTIMECLOUD_HDDNAME" : [{"value" : "" , "text" : "홈 폴더를 생성할 파티션을 선택하세요"}],
	"S_MEDIA_DATAFOLDER" : [{"value" : "" , "text" : "미디어 폴더를 선택하세요"}],
	"S_ITUNES_DATAFOLDER" : [{"value" : "" , "text" : "음악 폴더를 선택하세요"}],
	"S_ENTWARE_DATAFOLDER" : [{"value" : "" , "text" : "설치 폴더를 선택하세요"}],
		
	"S_MYSQL_CHARSET":[{"value" : "euckr","text" : "euckr"},
	{"value" : "armscii8","text" : "armscii8"},
	{"value" : "ascii","text" : "ascii"},
	{"value" : "big5","text" : "big5"},
	{"value" : "binary","text" : "binary"},
	{"value" : "cp850","text" : "cp850"},
	{"value" : "cp852","text" : "cp852"},
	{"value" : "cp866","text" : "cp866"},
	{"value" : "cp932","text" : "cp932"},
	{"value" : "cp1250","text" : "cp1250"},
	{"value" : "cp1251","text" : "cp1251"},
	{"value" : "cp1256","text" : "cp1256"},
	{"value" : "cp1257","text" : "cp1257"},
	{"value" : "dec8","text" : "dec8"},
	{"value" : "eucjpms","text" : "eucjpms"},
	{"value" : "gb2312","text" : "gb2312"},	
	{"value" : "gbk","text" : "gbk"},
	{"value" : "geostd8","text" : "geostd8"},
	{"value" : "greek","text" : "greek"},
	{"value" : "hebrew","text" : "hebrew"},
	{"value" : "hp8","text" : "hp8"},
	{"value" : "keybcs2","text" : "keybcs2"},
	{"value" : "koi8r","text" : "koi8r"},
	{"value" : "koi8u","text" : "koi8u"},
	{"value" : "latin1","text" : "latin1"},
	{"value" : "latin2","text" : "latin2"},
	{"value" : "latin5","text" : "latin5"},
	{"value" : "latin7","text" : "latin7"},
	{"value" : "macce","text" : "macce"},
	{"value" : "macroman","text" : "macroman"},
	{"value" : "sjis","text" : "sjis"},
	{"value" : "swe7","text" : "swe7"},
	{"value" : "tis620","text" : "tis620"},
	{"value" : "ucs2","text" : "ucs2"},
	{"value" : "ujis","text" : "ujis"},
	{"value" : "utf8","text" : "utf8"},
	{"value" : "utf16","text" : "utf16"},
	{"value" : "utf32","text" : "utf32"},
	{"value" : "utf8mb4","text" : "utf8mb4"}],
	
	"S_FTP_CHARSET":[
	{"value" : "AUTO","text" : "AUTO"},
	{"value" : "EUC-KR","text" : "EUC-KR"},
	{"value" : "UTF-8","text" : "UTF-8"},
	{"value" : "GB2321","text" : "GB2321"},
	{"value" : "BIG-5","text" : "BIG-5"}],

	"S_AFP_USERPROPERTY0":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_AFP_USERPROPERTY1":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_AFP_USERPROPERTY2":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_AFP_USERPROPERTY3":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_AFP_USERPROPERTY4":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],

	"S_FTP_USERPROPERTY0":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_FTP_USERPROPERTY1":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_FTP_USERPROPERTY2":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_FTP_USERPROPERTY3":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_FTP_USERPROPERTY4":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],

	"S_SAMBA_USERPROPERTY0":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_SAMBA_USERPROPERTY1":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_SAMBA_USERPROPERTY2":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_SAMBA_USERPROPERTY3":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],
	"S_SAMBA_USERPROPERTY4":[
	{"value" : "off","text" : "사용안함"},
	{"value" : "readwrite","text" : "읽기/쓰기"},
	{"value" : "readonly","text" : "읽기전용"}],

	"S_ITUNES_SCAN":[
	{"value" : "3","text" : "3"},
	{"value" : "6","text" : "6"},
	{"value" : "9","text" : "9"},
	{"value" : "12","text" : "12"},
	{"value" : "15","text" : "15"},
	{"value" : "18","text" : "18"},
	{"value" : "21","text" : "21"},
	{"value" : "24","text" : "24"},
	{"value" : "27","text" : "27"},
	{"value" : "30","text" : "30"}],

	"S_PLUGIN_BUTTON1" : "USB저장장치에 서비스 설치하기",

	"S_PLUGIN_INSTALL1"	: "USB 저장장치에 ",
	"S_PLUGIN_INSTALL2"	: "가 설치되어 있지 않습니다.",
	"S_PLUGIN_INSTALL3"	: "서비스 설치를 위해 256MB 공간을 사용합니다.",
	"S_PLUGIN_INSTALL4"	: "설치 경로",

	"S_ERR_NO_HDD"	: "USB장치가 연결되어 있지 않습니다",
	"S_ERR_NO_PROGRAM_NO_INTERNET" : "인터넷에 연결되어 있지 않습니다",
	"S_ERR_NO_PROGRAM_NOSPACE"	: "USB 여유공간이 부족합니다",
	"S_ERR_NO_HDD_PANEL"	: "USB장치가 연결되어 있지 않아 ",
	"S_ERR_NO_PROGRAM_NO_INTERNET_PANEL" : "인터넷에 연결되어 있지 않아 ",
	"S_ERR_NO_PROGRAM_NOSPACE_PANEL"	: "USB 여유공간이 부족하여 ",
	"S_ERR_POSTFIX"	: "를 설치할 수 없습니다",
	"S_INSTALLED"	: "설치됨",
	"S_INSTALLING1"	: "설치 중입니다",
	"S_INSTALLING2"	: "잠시만 기다려주십시오",
	
	"S_PLUGIN_STATUS_START_INSTALL_TXT"	:	"설치대기 중",
	"S_PLUGIN_STATUS_START_UPDATE_TXT"	:	"업데이트대기 중",
	"S_PLUGIN_STATUS_START_REMOVE_TXT"	:	"삭제대기 중",
	"S_PLUGIN_STATUS_ISNTALLING_TXT"	:	"설치 중",
	"S_PLUGIN_STATUS_UPDATING_TXT"		:	"업데이트 중",
	"S_PLUGIN_STATUS_REMOVING_TXT"		:	"삭제중",
	"S_PLUGIN_STATUS_INSTALLED_TXT"		:	"설치됨",
	"S_PLUGIN_STATUS_REMOVED_TXT"		:       "삭제됨",
	"S_PLUGIN_STATUS_INSTALL_FAIL_TXT"	:	"설치실패",
	"S_PLUGIN_STATUS_REMOVE_FAIL_TXT"	:	"삭제실패",
	"S_PLUGIN_STATUS_UPDATE_FAIL_TXT"	:	"업데이트실패",
	"S_PLUGIN_STATUS_NOT_INSTALLED_TXT"	:	"미설치",
	"S_PLUGIN_STATUS_NEED_UPDATE_TXT"	:	"업데이트가능",

	"S_USER_DESC1"	: "FTP와 AFP 서비스는 사용자 정보를 공유합니다.",

	"S_ENTWARE_TITLE"		: "Entware 지원",
	"S_ENTWARE_DATAFOLDER_TITLE"	: "설치 폴더",
	"S_ENTWARE_NO_SELECT"		: "선택하지 않음",
	"S_ENTWARE_STATUS_TITLE"	: "설치 상태",
	"S_ENTWARE_NOADMIN"		: "관리자 계정 설정 후 다시 실행해 주시기 바랍니다.",
	"S_ENTWARE_IMPOSSIBLE"		: "Telnet 실행 또는 Entware 설치를 위한 폴더가 준비되지 않았습니다.\n폴더 확인 후 다시 실행해 주십시오.",

	"S_ENTWARE_STATUS_INSTALLING"	: "설치중",
	"S_ENTWARE_STATUS_READY"	: "설치 완료",
	"S_ENTWARE_STATUS_ERROR"	: "설치 실패",
	"S_ENTWARE_STATUS_NONE"	: "-",

	"S_ENTWARE_EXTSTATUS_RUN"	: "(Telnet 동작중)",
	"S_ENTWARE_EXTSTATUS_STOP"	: "(Telnet 중단됨)",
	"S_ENTWARE_EXTSTATUS_INSTALLED"	: "설치됨",
	"S_ENTWARE_EXTSTATUS_NOT_INSTALLED"	: "미설치",

	"S_ENTWARE_DESC_TITLE"		: "Entware란?",
	"S_ENTWARE_DESC_EXPLAIN1"	: "* Embedded 장치를 위한 Software 프로젝트입니다.",
	"S_ENTWARE_DESC_EXPLAIN2"	: "* 설정한 폴더로 Entware의 단순 다운로드 및 설치, 사용을 위한 Telnet 서비스를 제공합니다.",
	"S_ENTWARE_DESC_EXPLAIN3"	: "* Telnet 접속 시 공유기 관리자 계정과 비밀번호를 사용하므로, 설정 후 사용하십시오.",
	"S_ENTWARE_DESC_EXPLAIN4"	: "* ipTIME에서는 Entware 자체의 사용법에 대한 지원은 하지 않습니다.",
	"S_ENTWARE_DESC_EXPLAIN5"	: "* Telnet은 보안을 위해 외부에서 접속할 수 없습니다.",

	"S_BUTTON_ENTWARE_INSTALL"	: "Entware 설치",
	"S_BUTTON_ENTWARE_SUBMIT"	: "적용",
	"S_TELNET_SERVICE"		: "Telnet 서비스",

	"S_FOLDER_ALL_SELECTED"	: "모든 폴더"
}