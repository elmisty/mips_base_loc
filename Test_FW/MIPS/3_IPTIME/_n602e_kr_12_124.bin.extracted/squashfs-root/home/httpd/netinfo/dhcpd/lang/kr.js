// JavaScript Set Language (kr)
var D_lang = {
	"D_WWAN_DESC" : "무선WAN - ",
	"D_NETCONF_INTERNAL_DHCP_AUTO_DETECT" : "내부네트워크에서 DHCP서버가 발견되어 중단됨.",
	"D_NETCONF_INTERNAL_DHCP_NEED_IP_CHANGE" : "DHCP서버 충돌! - 내부 IP주소를 변경필요.",
	"D_NETCONF_INTERNAL_DHCP_CLEAR" : ""
}

var S_lang = {
	"S_PAGE_TITLE" : "DHCP 서버 설정",
	"S_NETMASK_TITLE" : "서브넷마스크",
	"S_DHCPRUN_TITLE" : "DHCP서버동작",
	"S_SIP_TITLE" : "IP주소대여범위",
	"S_EIP_TITLE" : "　",
	"S_DHCPCONF_SELF" : "수동입력",
	"S_IPLEASE_TITLE" : "IP대여시간",
	"S_DNSSUFFIX_TITLE" : "DNS서픽스",
	"S_DHCPDETECT_TITLE" : "DHCP서버충돌",
	"S_DHCPCONF_DHCPAUTODETECT" : "DHCP 서버 충돌발견시 중단",
	"S_SMDHCP_TITLE" : "서브넷 마스크",
	"S_GWDHCP_TITLE" : "게이트웨이 주소",
	"S_FDHDNS_TITLE" : "기본 DNS 주소",
	"S_SDHDNS_TITLE" : "보조 DNS 주소",
	
	"S_DHCPADDR_MGR_TITLE" : "DHCP주소 관리",
	"S_ADDSEARCH_TITLE" : "사용중인 IP주소",
	"S_ADDMANUAL_TITLE" : "수동 주소 등록",
	"S_DELLEASE_TITLE" : "등록된 주소 관리",

	"S_MACRESTRICTBINDING_DESC" : "DHCP 서버에 등록된 주소만 통신허용",
	"S_NETCONF_INTERNALDYNAMICONLYINTERNET" : "DHCP 서버로 자동할당된 주소만 통신허용",	

	"S_BUTTON_ADDSEARCH_SUBMIT" : "주소등록",
	"S_BUTTON_ADDMANUAL_SUBMIT" : "수동등록",
	"S_BUTTON_DEL_SUBMIT" : "삭제",	

	"S_WIRELESS"  : "무선",	
	"S_WIRE" : "유선",	
	"S_WIRE_UNKNOWN" : " -- ",	
	"S_WIRE_NOT_CONNECT" : "",
	"S_DYNAMIC_ALLOC" : "자동할당",
	"S_STATIC_ALLOC" : "수동할당",

	"S_ADDSEARCH_NO_ITEM" : "등록할 주소가 존재하지 않습니다.",
	"S_REGADDR_NO_ITEM" : "등록된 주소가 없습니다.",

	"S_ADDSEARCH_INPUT_DESC" : "설명을 입력하세요.",
	"S_INVALID_GATEWAYADDRESS_STRING" : "게이트웨이 값이 잘못 입력되었습니다.",
	"S_INVALID_NETMASKADDRESS_STRING" : "서브넷마스크 값이 잘못 입력되었습니다.",
	"S_INVALID_DNSADDRESS1_STRING" : "기본 DNS 값이 잘못 입력되었습니다.",
	"S_INVALID_DNSADDRESS2_STRING" : "보조 DNS 값이 잘못 입력되었습니다.",
	"S_INVALID_IPRANGEADDRESS_STRING" : "IP주소 대여 범위 값이 잘못 입력되었습니다.",
	"S_INVALID_DNSSUFFIX_STRING" : "DNS서픽스 값이 잘못 입력되었습니다.",
	"S_INVALID_NOT_SAME_NETWORK" : "IP주소 대여 범위가 잘못 입력되었습니다.",
	
	"S_SUBMIT_NO_ITEM" : "선택된 항목이 없습니다.",
	"S_SUBMIT_ADDMANUAL_SUCCESS" : "등록되었습니다.",
	"S_SUBMIT_ADDMANUAL_FAIL" : "등록에 실패하였습니다.",
	"S_SUBMIT_ADDSEARCH_SUCCESS" : "선택한 주소가 등록되었습니다.",
	"S_SUBMIT_ADDSEARCH_FAIL" : "등록에 실패하였습니다.",
	"S_SUBMIT_DEL_SUCCESS" : "선택한 주소가 삭제 되었습니다.",
	"S_SUBMIT_DEL_FAIL" : "삭제에 실패하였습니다.",

	"S_INVALID_ACCESSLIST_REG_IP" : "이미 등록된 주소입니다.",
	"S_INVALID_LEASETIME_ALERT" : "IP 대여시간을 선택해 주십시오",
	"S_INVALID_ADDMANUAL_IPADDR" : "IP주소값이 없거나 잘못 입력되었습니다.",
	"S_INVALID_ADDMANUAL_MACADDR" : "MAC주소값이 없거나 잘못 입력되었습니다.",
	"S_INVALID_ADDMANUAL_DESC" : "설명값이 없거나 잘못입력되었습니다.",

	"S_LEASETIME_VALUES" : [
		{"value" : "-", "text" : "-"},
		{"value" : "60", "text" : "1분"},
		{"value" : "600", "text" : "10분"},
		{"value" : "1800", "text" : "30분"},
		{"value" : "3600", "text" : "1시간"},
		{"value" : "7200", "text" : "2시간"},
		{"value" : "14400", "text" : "4시간"},
		{"value" : "21600", "text" : "6시간"},
		{"value" : "43200", "text" : "12시간"},
		{"value" : "64800", "text" : "18시간"},
		{"value" : "86400", "text" : "1일"},
		{"value" : "172800", "text" : "2일"},
		{"value" : "259200", "text" : "3일"},
		{"value" : "604800", "text" : "7일"}
	],

	"S_REBOOT_ALERT_MSG" : "내부IP가 변경되어 공유기가\n재시작 됩니다. 계속하시겠습니까?",
	"S_REBOOT_RESULT" : "내부IP가 변경되었습니다.\n변경된주소로 다시 접속하십시오.",
	"S_REBOOT_REMAINING_MSG1" : "재시작 중입니다.(",
	"S_REBOOT_REMAINING_MSG2" : "초 남음)"
}
