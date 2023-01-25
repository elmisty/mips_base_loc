--[[
LuCI - Lua Configuration Interface

Copyright 2008 Steven Barth <steven@midlink.org>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

$Id: index.lua 4040 2009-01-16 12:35:25Z Cyrus $
]]--
module("luci.controller.easy.easy", package.seeall)
local sys = require("luci.sys")
local uci = require("luci.model.uci").cursor()

function index()
	
	local root = node()
	if not root.lock then
		root.target = alias("easy")
		root.index = true
	end
	
	local page   = node("easy")
	page.target  = alias("easy", "networkmap")
	page.title   = "Easy Mode"
	page.sysauth = "root"
	page.sysauth_authenticator = "htmlauth"
	page.order   = 11
	page.index = true

	local page   = node("easy", "passWarning") --Darren
	page.target  = call("action_chgPwd")
	page.title   = "Change Password"
	page.order   = 12
	
	local page   = node("easy", "networkmap")
	page.target  = call("action_networkmap")
	page.title   = "Network Map"
	page.order   = 13
	
	local page   = node("easy", "game")
	page.target  = template("easy_game/game")
	page.title   = "Game Engine"
	page.order   = 14
	
	local page   = node("easy", "pwsaving")
	page.target  = call("action_wifi_schedule")
	page.title   = "Power Saving"
	page.order   = 15
	
	entry({"easy", "ctfilter"}, call("action_ctfilter"), "Parental Control", 16)
	entry({"easy", "qos"}, call("action_qos"), "Bandwidth MGMT", 17)
	entry({"easy", "firewall"}, template("easy_firewall/firewall"), "Firewall", 18)
	entry({"easy", "wlan"}, call("action_wireless"), "Wireless Security", 19)
	entry({"easy", "logout"}, call("action_logout"), "Log Out", 20)
	entry({"easy", "scannetwork"}, call("action_scan_network"), "Scan Network", 21)
	entry({"easy", "easysetting"}, template("easy_set"), "Easy Setting", 22)
	entry({"easy", "easysetapply"}, call("action_easy_set_apply"), "Easy Setting", 23)

-- Modification for eaZy123 error, NBG6616, WenHsiang, 2011/12/15	
	local page   = node("easy", "eaZy123")
	page.target  = template("genie")
	page.title   = "eaZy123"
	page.order   = 24

	local page   = node("easy", "eaZy123", "genie2")
	page.target  = call("action_eaZy123_flag")	
	page.title   = "eaZy123"
	page.order   = 25

	local page   = node("easy", "eaZy123", "genie2-1")
	page.target  = template("genie2-1")
	page.title   = "eaZy123"
	page.order   = 26

	local page   = node("easy", "eaZy123", "genie2-6")        
	page.target  = call("action_wan_internet_connection")
	page.title   = "eaZy123"
	page.order   = 27

	local page   = node("easy", "eaZy123", "genie2_error")
	page.target  = template("genie2_error")
	page.title   = "eaZy123"
	page.order   = 28

	local page   = node("easy", "eaZy123", "genie2_error2")
	page.target  = template("genie2_error2")
	page.title   = "eaZy123"
	page.order   = 29

	local page   = node("easy", "eaZy123", "genie3")
	page.target  = template("genie3")
	page.title   = "eaZy123"
	page.order   = 30

	local page   = node("easy", "eaZy123", "genie4")
	page.target  = call("action_password")
	page.title   = "eaZy123"
	page.order   = 31

	local page   = node("easy", "eaZy123", "genie5")
	page.target  = call("action_completion")	
	page.title   = "eaZy123"
	page.order   = 32
-- Modification for eaZy123 error, NBG6616, WenHsiang, 2011/12/15

	local page   = node("easy","mobile")
	page.target  = template("mobile")
	page.target  = call("action_mobile")
	page.title   = "Mobile"
	page.order   = 33
-- Modification for mobile webpage, NBG6616, Michael, 2012/2/16

-- Addition for mobile, NBG6616, WenHsiang, 2012/3/6
	local page   = node("easy","mobile_wizard02")
	page.target  = template("mobile_wizard02")
	page.title   = "mobile_wizard02"
	page.order   = 34

	local page   = node("easy","mobile_wizard03")
	page.target  = call("action_mobile_wizard03")
	page.title   = "mobile_wizard03"
	page.order   = 35

	local page   = node("easy","mobile_wirelessSecurity")
	page.target  = template("mobile_wirelessSecurity")
	page.title   = "mobile_wirelessSecurity"
	page.order   = 36

	local page   = node("easy","mobile_wirelessSecurity2")
	page.target  = call("action_mobile_wirelessSecurity2")
	page.title   = "mobile_wirelessSecurity2"
	page.order   = 37

	local page   = node("easy","mobile_mainMenu")
	page.target  = template("mobile_mainMenu")
	page.title   = "mobile_mainMenu"
	page.order   = 38

	local page   = node("easy","mobile_networkmap01")
	page.target  = template("mobile_networkmap01")
	page.title   = "mobile_networkmap01"
	page.order   = 39

	local page   = node("easy","mobile_routerinfo")
	page.target  = template("mobile_routerinfo")
	page.title   = "mobile_routerinfo"
	page.order   = 40

	local page   = node("easy","mobile_networkmap02")
	page.target  = template("mobile_networkmap02")
	page.title   = "mobile_networkmap02"
	page.order   = 41

	local page   = node("easy","mobile_networkmap03")
	page.target  = template("mobile_networkmap03")
	page.title   = "mobile_networkmap03"
	page.order   = 42

	local page   = node("easy","mobile_networkmap04")
	page.target  = template("mobile_networkmap04")
	page.title   = "mobile_networkmap04"
	page.order   = 43

	local page   = node("easy","mobile_personalM")
	page.target  = call("action_mobile_personalM")
	page.title   = "mobile_personalM"
	page.order   = 44

	local page   = node("easy","mobile_wireless")
	page.target  = call("action_mobile_wireless")
	page.title   = "mobile_wireless"
	page.order   = 45

	local page   = node("easy","mobile_powerSaving")
	--page.target  = template("mobile_powerSaving")
	page.target  = call("action_mobile_wifi_schedule")
	page.title   = "mobile_powerSaving"
	page.order   = 46

	local page   = node("easy","mobile_contentFiliter")
	page.target  = call("action_mobile_contentFiliter")
	page.title   = "mobile_contentFiliter"
	page.order   = 47

	local page   = node("easy","mobile_bandwidthMgmt")
	page.target  = call("mobile_bandwidth_easy_set_apply")
	page.title   = "mobile_bandwidthMgmt"
	page.order   = 48
	-- Addition for mobile, NBG6616, WenHsiang, 2012/3/6

	local page   = node("easy", "station_info")
	page.target  = call("get_station_info")
	--page.target  = template("station_info")
	page.title   = "Station Info"
	page.order   = 50

	local page   = node("easy", "parental_display")
	page.target  = call("action_parental_display")
	page.title   = "Parental View"
	page.order   = 51

	local page   = node("easy", "parental_edit")
	page.target  = call("action_parental_edit")
	page.title   = "Parental Edit"
	page.order   = 52

	entry({"easy", "blocking_service"}, call("action_blocking_service"), "Easy Blocking", 53)
end

function action_logout()
	local dsp = require "luci.dispatcher"
	local sauth = require "luci.sauth"
	if dsp.context.authsession then
		sauth.kill(dsp.context.authsession)
		dsp.context.urltoken.stok = nil
	end
	luci.http.header("Set-Cookie", "sysauth=; path=" .. dsp.build_url())
	luci.http.redirect(luci.dispatcher.build_url())
end

function get_station_info()

	local Name = luci.http.formvalue("sta_name")
	local Ip = luci.http.formvalue("sta_ip")
	local Mac = luci.http.formvalue("sta_mac")
	local ConnType = luci.http.formvalue("sta_connType")
	local OsType = luci.http.formvalue("sta_osType")


	luci.template.render("station_info",{staName = Name,
		staIp = Ip, staMac = Mac, staConnType = ConnType,	 staOsType = OsType})
end

function action_parental_display()
	local Mac = luci.http.formvalue("sta_mac")
    luci.template.render("parental_display",{staMac = Mac})
end

function action_parental_edit()
	
	local edit = luci.http.formvalue("edit")
	local Back = luci.http.formvalue("Back")	
	local apply = luci.http.formvalue("apply")
	local mac_list=""
	local select_dev_mac = luci.http.formvalue("sta_name")	
	
	if edit then
		rule_ind="rule"..edit+1
		local tmp_count=edit+1
		local rule_count=uci:get("parental", "general" , "count")
		if string.format( rule_count ) < string.format( tmp_count ) then
			-- If the action is "Add", then add the default value to config.
			uci:set("parental","general","count",edit+1)
			uci:set("parental",rule_ind,"parental_rule")
			uci:set("parental",rule_ind,"src_mac","00:00:00:00:00:00")
			uci:set("parental",rule_ind,"stop_hour","24")
			uci:set("parental",rule_ind,"weekdays","Mon,Tue,Wed,Thu,Fri,Sat,Sun")
			uci:set("parental",rule_ind,"service_count","0")
			uci:set("parental",rule_ind,"service_act","block")
		else
			sys.exec("cat /tmp/dhcp.leases |awk -F ' ' '{ print $2}' >/tmp/maclist")
			editmac = uci:get("parental", rule_ind , "src_mac")
			local idx_3 = 0
			for mac in io.lines("/tmp/maclist") do
				if ( mac == editmac) then
					selectindx = idx_3
					uci:set("parental",rule_ind,"src_type","single")
					break
				else
					selectindx = "none"
				end
				idx_3 = idx_3 + 1
			end
			if ( selectindx == "none") and ( editmac ~= "00:00:00:00:00:00" ) then
				uci:set("parental",rule_ind,"src_type","custom")
			end
			sys.exec("rm /tmp/maclist")
		end
		uci:set("parental", "general", "ruleIdx", rule_ind)
		uci:commit("parental")
		keywords = uci:get("parental", rule_ind , "keyword")
		luci.template.render("parental_edit",{keywords = keywords, selectindx = selectindx, rule=rule_ind, mac_list=mac_list, staMac = select_dev_mac })
	else
		rule_ind = uci:get("parental", "general" , "ruleIdx")
	end	
	
	if apply then
		local rule_enable = luci.http.formvalue("rule_enable")
		if not(rule_enable) then
			uci:set("parental", rule_ind, "enable", "0")
		else
			uci:set("parental", rule_ind, "enable", "1")
		end
		local rule_name = luci.http.formvalue("rule_name")
		uci:set("parental", rule_ind, "name", rule_name)
		
		local weekdays = ""
		local Date_Mon = luci.http.formvalue("Date_Mon")
		local Date_Tue = luci.http.formvalue("Date_Tue")
		local Date_Wed = luci.http.formvalue("Date_Wed")
		local Date_Thu = luci.http.formvalue("Date_Thu")
		local Date_Fri = luci.http.formvalue("Date_Fri")
		local Date_Sat = luci.http.formvalue("Date_Sat")
		local Date_Sun = luci.http.formvalue("Date_Sun")
		if Date_Mon then
			weekdays = weekdays.."Mon,"
		end
		if Date_Tue then
			weekdays = weekdays.."Tue,"
		end
		if Date_Wed then
			weekdays = weekdays.."Wed,"
		end
		if Date_Thu then
			weekdays = weekdays.."Thu,"
		end
		if Date_Fri then
			weekdays = weekdays.."Fri,"
		end
		if Date_Sat then
			weekdays = weekdays.."Sat,"
		end
		if Date_Sun then
			weekdays = weekdays.."Sun"
		else 
			weekdays = string.sub(weekdays,1,-2)
		end
		uci:set("parental", rule_ind, "weekdays", weekdays)
		
		local StartHour = luci.http.formvalue("StartHour")
		local StartMin = luci.http.formvalue("StartMin")
		local EndHour = luci.http.formvalue("EndHour")
		local EndMin = luci.http.formvalue("EndMin")
		uci:set("parental",rule_ind,"start_hour",StartHour)	
		uci:set("parental",rule_ind,"start_min",StartMin)	
		uci:set("parental",rule_ind,"stop_hour",EndHour)	
		uci:set("parental",rule_ind,"stop_min",EndMin)	
		
		local url_str = luci.http.formvalue("url_str")
		if not url_str  then url_str="" end 
		uci:set("parental",rule_ind,"keyword",url_str)	
		
		uci:set("parental",rule_ind,"src_mac",select_dev_mac)
		uci:set("parental",rule_ind,"src_type","single")	
		
		uci:commit("parental")
		uci:apply("parental")		
		luci.template.render("parental_display",{staMac = select_dev_mac})
	end	

	if Back then		
		luci.template.render("parental_display",{staMac = select_dev_mac})
	end        
end

function action_blocking_service()

	local blocking_enable = luci.http.formvalue("blocking_flag")
	local mac_address = luci.http.formvalue("mac")
	if blocking_enable == "1" then
		local srvName="Blocking_service"		
		local dip_address="0.0.0.0"
		local sip_address="0.0.0.0"
		local protocol="TCP"
					
		-----firewall-----
		local enabled = 1		
		
		if dFromPort=="" then
			if not dToPort=="" then
				dFromPort=dToPort
			end
		end
						
		local fw_type = "in"
		local wan = 0
		local lan = 0
		local fw_time = "always"
		local target = "DROP"
				
		local rules_count = uci:get("firewall","general","rules_count")
		local NextRulePos = uci:get("firewall","general","NextRulePos")
		
		rules_count = rules_count+1
		NextRulePos = NextRulePos+1
		
		local rules = "rule"..rules_count
		local services = "service"..rules_count
		
		
		uci:set("firewall",rules,"firewall")
		uci:set("firewall",rules,"StatusEnable",enabled)
		uci:set("firewall",rules,"CurPos",rules_count)
		uci:set("firewall",rules,"type",fw_type)
		uci:set("firewall",rules,"service",services)
		uci:set("firewall",rules,"name",srvName)
		uci:set("firewall",rules,"protocol",protocol)
		uci:set("firewall",rules,"mac_address",mac_address)
		uci:set("firewall",rules,"wan",wan)
		uci:set("firewall",rules,"src_ip",sip_address)
		uci:set("firewall",rules,"local",lan)
		uci:set("firewall",rules,"dst_ip",dip_address)
		uci:set("firewall",rules,"time",fw_time)
		uci:set("firewall",rules,"target",target)	
	
		uci:set("firewall","general","rules_count",rules_count)
		uci:set("firewall","general","NextRulePos",NextRulePos)
		
		uci:commit("firewall")
		uci:apply("firewall")
			
	elseif blocking_enable == "0" then
		local rules_count = uci:get("firewall","general","rules_count")
		local StatusEnable, name, tmp_mac, rule_idx

		for i=1,rules_count do						
			StatusEnable = uci:get("firewall", "rule"..i,"StatusEnable")
			name = uci:get("firewall", "rule"..i,"name")
			tmp_mac = uci:get("firewall", "rule"..i,"mac_address")
			
			if StatusEnable == "1" and name == "Blocking_service" then 									
				if mac_address == tmp_mac then
					sys.exec("echo mac_address == tmp_mac & rule_idx= "..i.." >> /tmp/debug_log")
					rule_idx = i
					break				
				end									
			end								
		end
				
		local del_rule ="rule"..rule_idx
		uci:delete("firewall",del_rule)
		
		-----firewall-----
		local rules_count = uci:get("firewall","general","rules_count")
		local NextRulePos = uci:get("firewall","general","NextRulePos")
		local num = rules_count-rule_idx
		
		for i=num,1,-1 do
			local rules = "rule"..rule_idx+1
			local new_rule = "rule"..rule_idx
			local old_data = {}
			old_data=uci:get_all("firewall",rules)
			
			if old_data then
				uci:set("firewall",new_rule,"firewall")
				uci:tset("firewall",new_rule,old_data)
				uci:set("firewall",new_rule,"CurPos",rule_idx)
				uci:commit("firewall")
				uci:delete("firewall",rules)
				uci:commit("firewall")
				rule_idx =rule_idx+1				
			end
		end	
		
		uci:set("firewall","general","rules_count",rules_count-1)
		uci:set("firewall","general","NextRulePos",NextRulePos-1)
		
		uci:commit("firewall")
		uci:apply("firewall")
	
	end
	
	luci.template.render("networkmap")

end
-- After login, pop the change password page. Darren, 2012/01/02 
function action_chgPwd()
	local apply = luci.http.formvalue("apply")
	local ignore = luci.http.formvalue("ignore")
	
	if apply then
		local new_password = luci.http.formvalue("admpass")
		local password_len = string.len( new_password )
		
		if ( password_len > 30 ) then 		
			luci.template.render("passWarning",{pwError = 2})
			return
		end	
		
		uci:set("system","main","pwd",new_password)
		uci:commit("system")
		uci:apply("system")
		
		sys.exec("lltd.sh")
		sys.exec("ping 168.95.1.1 -c 1 > /var/ping_internet")

		luci.template.render("networkmap")
	elseif ignore then
		
		sys.exec("lltd.sh")
		sys.exec("ping 168.95.1.1 -c 1 > /var/ping_internet")

		luci.template.render("networkmap")

	else
		luci.template.render("passWarning")
	end
end

function action_networkmap()

	local file3
	local fw_ver
	if io.open( "/tmp/firmware_version", "r" ) then
		file3 = io.open( "/tmp/firmware_version", "r" )
		fw_ver = file3:read("*line")
		file3:close()
	else
		fw_ver = "TEST_FW_VERSION"
	end		

	local security_24G
	local security_5G
	local security24G = uci:get("wireless","ath0","auth")
	local security5G = uci:get("wireless","ath10","auth")
	local refresh = luci.http.formvalue("refresh")

	if security24G == "WPAPSK" then
		security_24G="WPA-PSK"
	elseif security24G == "WPA2PSK" then
		security_24G="WPA2-PSK"
	elseif security24G == "WEPAUTO" or security24G == "SHARED" then
		security_24G="WEP"
	elseif security24G == "OPEN" then
		security_24G="No Security"
	else
		security_24G=security24G
	end

	if security5G == "WPAPSK" then
		security_5G="WPA-PSK"
	elseif security5G == "WPA2PSK" then
		security_5G="WPA2-PSK"
	elseif security5G == "WEPAUTO" or security5G == "SHARED" then
		security_5G="WEP"
	elseif security5G == "OPEN" then
		security_5G="No Security"
	else
		security_5G=security5G
	end
		
	if refresh then
		sys.exec("rm /var/lltd_num_lan")
	end

	sys.exec("lltd.sh")
	sys.exec("ping 168.95.1.1 -c 1 > /var/ping_internet")
	
	luci.template.render("networkmap",{firmware_version = fw_ver,
					security_24g = security_24G,
					security_5g = security_5G})
end

function action_scan_network()
	sys.exec("lltd.sh")
	sys.exec("ping 168.95.1.1 -c 1 > /var/ping_internet")
	return 1
end

function action_easy_set_apply()
	local job = luci.http.formvalue("easy_set_button_job")
	local mode = luci.http.formvalue("easy_set_button_mode")
	
	if job and mode then
		if job == "1" then
			uci:set("qos","general","game_enable",mode)
			
			local tbl = uci:get_all("qos","priority")
			local qostbl = {}
			qostbl[tbl["game"]] = "game"
			qostbl[tbl["voip"]] = "voip"
			qostbl[tbl["web"]] = "web"
			qostbl[tbl["media"]] = "media"
			qostbl[tbl["ftp"]] = "ftp"
			qostbl[tbl["mail"]] = "mail"
				
			if mode == "1" then
				uci:set("qos","general","enable",mode)
				
				for k,name in pairs(qostbl) do
					if name == "game" then
						key = k
						break
					end
				end
				
				local idx = tonumber(key)
				if idx ~= 6 then
					for i=idx,5 do
						local tmp = qostbl[tostring(i+1)]
						qostbl[tostring(i)] = tmp
					end
					qostbl["6"] = "game"
					
					for i=idx,6 do
						uci:set("qos","priority", qostbl[tostring(i)], i)
					end
				end

			else
				local tmp = qostbl["6"]
				qostbl["6"] = qostbl["5"]
				qostbl["5"] = tmp
				
				uci:set("qos","priority", qostbl["6"], "6")
				uci:set("qos","priority", qostbl["5"], "5")
			end
			uci:commit("qos")
			uci:apply("qos")
		elseif job == "2" then
			wifi_select = uci:get("system","main","power_saving_select")
			if wifi_select == "2.4G" then
				cfg = "wifi_schedule"
			else
				cfg = "wifi_schedule5G"
			end
			if mode == "1" then
				uci:set(cfg,"wlan","enabled","enable")
			else
				uci:set(cfg,"wlan","enabled","disable")
			end
			uci:commit(cfg)
			uci:apply(cfg)
		elseif job == "3" then
			uci:set("parental","general","enable",mode)
			uci:commit("parental")
			uci:apply("parental")
		elseif job == "4" then
			uci:set("qos","general","enable",mode)
		
			if mode == "0" then
				uci:set("qos","general","game_enable",mode)
			end
			uci:commit("qos")
			uci:apply("qos")
		elseif job == "5" then
			uci:set("firewall","general","dos_enable",mode)
			uci:commit("firewall")
			uci:apply("firewall")
		elseif job == "6" then
			uci:set("wireless","ath0","disabled",mode)
		else
			return 
		end
	end
	
	luci.template.render("networkmap")
end

function action_ctfilter()
	local keywords = luci.http.formvalue("url_str")
	if keywords then
		uci:set("parental","keyword","keywords",keywords)
		uci:commit("parental")
		uci:apply("parental")
	end
	
	luci.template.render("easy_ctfilter/parental_control")
end

function action_qos()
	local apply = luci.http.formvalue("apply")

	if apply then
		local prio_table = {}
		prio_table["1"] = luci.http.formvalue("p0")
		
		if prio_table["1"] == "game" then
			uci:set("qos","app_policy_0","prio","3")
			uci:set("qos","app_policy_1","prio","3")
			uci:set("qos","app_policy_2","prio","3")
			uci:set("qos","app_policy_3","prio","3")
		elseif prio_table["1"] == "voip" then
			uci:set("qos","app_policy_4","prio","3")
		elseif prio_table["1"] == "media" then
			uci:set("qos","app_policy_5","prio","3")
		elseif prio_table["1"] == "web" then
			uci:set("qos","app_policy_6","prio","3")
		elseif prio_table["1"] == "ftp" then
			uci:set("qos","app_policy_7","prio","3")
			uci:set("qos","app_policy_8","prio","3")
			uci:set("qos","app_policy_9","prio","3")
		else
			uci:set("qos","app_policy_10","prio","3")
		end
			
		prio_table["2"] = luci.http.formvalue("p1")
		if prio_table["2"] == "game" then
			uci:set("qos","app_policy_0","prio","3")
			uci:set("qos","app_policy_1","prio","3")
			uci:set("qos","app_policy_2","prio","3")
			uci:set("qos","app_policy_3","prio","3")
		elseif prio_table["2"] == "voip" then
			uci:set("qos","app_policy_4","prio","3")
		elseif prio_table["2"] == "media" then
			uci:set("qos","app_policy_5","prio","3")
		elseif prio_table["2"] == "web" then
			uci:set("qos","app_policy_6","prio","3")
		elseif prio_table["2"] == "ftp" then
			uci:set("qos","app_policy_7","prio","3")
			uci:set("qos","app_policy_8","prio","3")
			uci:set("qos","app_policy_9","prio","3")
		else
			uci:set("qos","app_policy_10","prio","3")
		end

		prio_table["3"] = luci.http.formvalue("p2")
		if prio_table["3"] == "game" then
			uci:set("qos","app_policy_0","prio","2")
			uci:set("qos","app_policy_1","prio","2")
			uci:set("qos","app_policy_2","prio","2")
			uci:set("qos","app_policy_3","prio","2")
		elseif prio_table["3"] == "voip" then
			uci:set("qos","app_policy_4","prio","2")
		elseif prio_table["3"] == "media" then
			uci:set("qos","app_policy_5","prio","2")
		elseif prio_table["3"] == "web" then
			uci:set("qos","app_policy_6","prio","2")
		elseif prio_table["3"] == "ftp" then
			uci:set("qos","app_policy_7","prio","2")
			uci:set("qos","app_policy_8","prio","2")
			uci:set("qos","app_policy_9","prio","2")
		else
			uci:set("qos","app_policy_10","prio","2")
		end
		
		prio_table["4"] = luci.http.formvalue("p3")
		if prio_table["4"] == "game" then
			uci:set("qos","app_policy_0","prio","2")
			uci:set("qos","app_policy_1","prio","2")
			uci:set("qos","app_policy_2","prio","2")
			uci:set("qos","app_policy_3","prio","2")
		elseif prio_table["4"] == "voip" then
			uci:set("qos","app_policy_4","prio","2")
		elseif prio_table["4"] == "media" then
			uci:set("qos","app_policy_5","prio","2")
		elseif prio_table["4"] == "web" then
			uci:set("qos","app_policy_6","prio","2")
		elseif prio_table["4"] == "ftp" then
			uci:set("qos","app_policy_7","prio","2")
			uci:set("qos","app_policy_8","prio","2")
			uci:set("qos","app_policy_9","prio","2")
		else
			uci:set("qos","app_policy_10","prio","2")
		end

		prio_table["5"] = luci.http.formvalue("p4")
		if prio_table["5"] == "game" then
			uci:set("qos","app_policy_0","prio","1")
			uci:set("qos","app_policy_1","prio","1")
			uci:set("qos","app_policy_2","prio","1")
			uci:set("qos","app_policy_3","prio","1")
		elseif prio_table["5"] == "voip" then
			uci:set("qos","app_policy_4","prio","1")
		elseif prio_table["5"] == "media" then
			uci:set("qos","app_policy_5","prio","1")
		elseif prio_table["5"] == "web" then
			uci:set("qos","app_policy_6","prio","1")
		elseif prio_table["5"] == "ftp" then
			uci:set("qos","app_policy_7","prio","1")
			uci:set("qos","app_policy_8","prio","1")
			uci:set("qos","app_policy_9","prio","1")
		else
			uci:set("qos","app_policy_10","prio","1")
		end
		
		prio_table["6"] = luci.http.formvalue("p5")
		if prio_table["6"] == "game" then
			uci:set("qos","app_policy_0","prio","1")
			uci:set("qos","app_policy_1","prio","1")
			uci:set("qos","app_policy_2","prio","1")
			uci:set("qos","app_policy_3","prio","1")
		elseif prio_table["6"] == "voip" then
			uci:set("qos","app_policy_4","prio","1")
		elseif prio_table["6"] == "media" then
			uci:set("qos","app_policy_5","prio","1")
		elseif prio_table["6"] == "web" then
			uci:set("qos","app_policy_6","prio","1")
		elseif prio_table["6"] == "ftp" then
			uci:set("qos","app_policy_7","prio","1")
			uci:set("qos","app_policy_8","prio","1")
			uci:set("qos","app_policy_9","prio","1")
		else
			uci:set("qos","app_policy_10","prio","1")
		end

		for key,value in pairs(prio_table) do
			uci:set("qos","priority",value,key)
		end

		for i=0,10 do
			uci:set("qos","app_policy_" .. i,"enable","1")
		end
	
		uci:commit("qos")
		uci:apply("qos")
	end
	
	local gameSrv = {}
	local voipSrv = {}
	local mediaSrv = {}
	local ftpSrv = {}
	local webSrv ={}
	local mailSrv = {}  

	for i=0,10 do
		if i == 0 then
			gameSrv["app_policy_" .. i] = "XBox Live"
		end

		if i == 1 then		
			gameSrv["app_policy_" .. i] = "PlayStation"
		end

		if i == 2 then		
			gameSrv["app_policy_" .. i] = "MSN Game Zone"
		end

		if i == 3 then		
			gameSrv["app_policy_" .. i] = "Battle Net"
		end

		if i == 4 then			
			voipSrv["app_policy_" .. i] = "SIP"
		end
		
		if i == 5 then		
			mediaSrv["app_policy_" .. i] = "Instant Messanger"
		end

		if i == 6 then		
			webSrv["app_policy_" .. i] = "HTTP(Port 80 and 443)"
		end
		
		if i == 7 then			
			ftpSrv["app_policy_" .. i] = "FTP"
		end

		if i == 8 then		
			ftpSrv["app_policy_" .. i] = "eMule"
		end

		if i == 9 then		
			ftpSrv["app_policy_" .. i] = "BitTorrent"
		end

		if i == 10 then		
			mailSrv["app_policy_" .. i] = "E-Mail"
		end
	end

	for i=1,8 do
		local usrCfg = uci:get_all("qos","eg_policy_" .. i)
		
		if usrCfg["enable"] == "1" then
		
			if usrCfg["apptype"] == "Game Console" then
				local prio=uci:get("qos","app_policy_0","prio")
				uci:set("qos","eg_policy_" .. i,"prio",prio)
				gameSrv["eg_policy_" .. i] = usrCfg["name"]
			elseif usrCfg["apptype"] == "VoIP" then
				local prio=uci:get("qos","app_policy_4","prio")
				uci:set("qos","eg_policy_" .. i,"prio",prio)
				voipSrv["eg_policy_" .. i] = usrCfg["name"]
			elseif usrCfg["apptype"] == "Web Surfing" then
				local prio=uci:get("qos","app_policy_6","prio")
				uci:set("qos","eg_policy_" .. i,"prio",prio)
				webSrv["eg_policy_" .. i] = usrCfg["name"]
			elseif usrCfg["apptype"] == "Instant Messanger" then
				local prio=uci:get("qos","app_policy_5","prio")
				uci:set("qos","eg_policy_" .. i,"prio",prio)
				mediaSrv["eg_policy_" .. i] = usrCfg["name"]
			elseif usrCfg["apptype"] == "P2P/FTP" then
				local prio=uci:get("qos","app_policy_7","prio")
				uci:set("qos","eg_policy_" .. i,"prio",prio)
				ftpSrv["eg_policy_" .. i] = usrCfg["name"]
			else
				local prio=uci:get("qos","app_policy_10","prio")
				uci:set("qos","eg_policy_" .. i,"prio",prio)
				mailSrv["eg_policy_" .. i] = usrCfg["name"]
			end
			uci:commit("qos")
		end
	end
	
	luci.template.render("easy_qos/bandwidth", {
		game_srv = gameSrv,
		voip_srv = voipSrv,
		web_srv = webSrv,
		media_srv = mediaSrv,
		ftp_srv = ftpSrv,
		mail_srv = mailSrv,
	})
end

function action_wireless()
	require("luci.model.uci")
	local apply = luci.http.formvalue("apply")
	local enable_wps_btn = luci.http.formvalue("enable_wps_btn")
	local enable_wps_pin = luci.http.formvalue("enable_wps_pin")
	local wlanRadio = luci.http.formvalue("wlan_radio")
	local wpscfg="wps"
	local config_status
	local valid_pin="1"

	if apply then
		local cfg
		local section
		local wlanPwd = luci.http.formvalue("wlan_pwd")
		local wlanSSID = luci.http.formvalue("wlan_ssid")
		local wlanSec = luci.http.formvalue("wlan_sec")
		
		if wlanRadio == "2.4G" then
			sys.exec("kill $(ps | grep 'watch -tn 1 wps_conf_24G' | grep 'grep' -v | awk '{print $1}')")
			sys.exec("echo wifi0 >/tmp/WirelessDev")
			cfg = "wireless"
			section = "ath0"
			wpscfg = "wps"
		elseif wlanRadio == "5G" then
			sys.exec("kill $(ps | grep 'watch -tn 1 wps_conf_5G' | grep 'grep' -v | awk '{print $1}')")
			sys.exec("echo wifi1 >/tmp/WirelessDev")
			cfg = "wireless"
			section = "ath10"
			wpscfg = "wps5G"
		end

		uci:set(cfg,section,"ssid",wlanSSID)
		if wlanSec == "none" then
			if section == "ath0" then
				uci:set("wireless", "wifi0","auth","OPEN") 
			end
			if section == "ath10" then
				uci:set("wireless", "wifi1","auth","OPEN") 
			end
			uci:set(cfg,section,"auth","NONE")
			uci:set(cfg,section,"encryption","NONE")
		elseif wlanSec == "WPA-PSK" then
			uci:set(cfg,section,"auth","WPAPSK")
			uci:set(cfg,section,"encryption","WPAPSK")
			uci:set(cfg,section,"WPAPSKkey", wlanPwd)
		elseif wlanSec == "WPA2-PSK" then
			uci:set(cfg,section,"auth","WPA2PSK")
			uci:set(cfg,section,"encryption","WPA2PSK")
			uci:set(cfg,section,"WPAPSKkey", wlanPwd)
		end

		uci:commit(cfg)
		uci:apply(cfg)
		
		--Set wps conf with 1 here, the WPS status will be configured when you
		--execute "wps ath0/ath10 on"	
		uci:set(wpscfg,"wps","conf",1)
			uci:commit(wpscfg)

		local wps_enable = uci:get(wpscfg,"wps","enabled")

		if (wps_enable == "1") then
			sys.exec("wps "..section.." on")
		else
			sys.exec("iwpriv "..section.." set WscConfStatus=2")
		end
	end

	local iface
	if wlanRadio then
		if wlanRadio == "2.4G" then
			iface = "ath0"
			wpscfg = "wps"
		elseif wlanRadio == "5G" then
			iface = "ath10"
			wpscfg = "wps5G"   
		end
	end

	local fd
	local wps_enable
	
	if enable_wps_btn then 
		wps_enable = uci:get(wpscfg,"wps","enabled")
		if (wps_enable == "0" ) then
			fd = io.popen("wps "..iface.." on wps_btn &")
			uci:set(wpscfg,"wps","enabled", 1)
			uci:commit(wpscfg)
		else
			fd = io.popen("wps "..iface.." on wps_btn &")
		end
	end
	
	if enable_wps_pin then
		wps_enable = uci:get(wpscfg,"wps","enabled")
		local pincode
		local pin_verify
		pincode = luci.http.formvalue("pin_code")
		if wlanRadio == "2.4G" then
			pin_verify = sys.exec("hostapd_cli -p /tmp/run/hostapd-wifi0/ -i ath0 " .. "wps_check_pin " .. pincode)
		elseif wlanRadio == "5G" then
			pin_verify = sys.exec("hostapd_cli -p /tmp/run/hostapd-wifi1/ -i ath10 " .. "wps_check_pin " .. pincode)
		end

		 if (wps_enable == "0" ) then	
			uci:set(wpscfg,"wps","enabled", 1)
			uci:commit(wpscfg)
			if ( pin_verify == pincode ) then
				fd = io.popen("wps "..iface.." on wps_pin ".. pincode .. " &")
			end
		else
			if ( pin_verify == pincode ) then
				fd = io.popen("wps "..iface.." on wps_pin ".. pincode .. " &")
			end
		end
	end
	
	luci.template.render("easy_wireless/wireless_security", {
		SSID = uci:get("wireless","ath0","ssid"),
		security = uci:get("wireless","ath0","auth"),
		pwd = uci:get("wireless","ath0","WPAPSKkey"),
		SSID_5G = uci:get("wireless","ath10","ssid"),
		security_5G = uci:get("wireless","ath10","auth"),
		pwd_5G = uci:get("wireless","ath10","WPAPSKkey"),
		AP_PIN = uci:get(wpscfg,"wps","appin"),
		pin_valid = valid_pin
	})
end

function action_wifi_schedule()
	local cfg
	local apply = luci.http.formvalue("apply")
	local days = {"Everyday","Mon","Tue","Wed","Thu","Fri","Sat","Sun"}
	
	if apply then
		local radio = luci.http.formvalue("wlanRadio")
		
		if radio == "2.4G" then
			cfg = "wifi_schedule"
		else
			cfg = "wifi_schedule5G"
		end
		
		uci:set("system","main","power_saving_select",radio)
		uci:commit("system")
		
		for i, name in ipairs(days) do
			local prefixStr = "WLanSch" .. tonumber(i)-1
			local token = string.lower(name:sub(1, 1)) .. name:sub(2, #name)
			
			uci:set(cfg, token, "status_onoff", luci.http.formvalue(prefixStr .. "Radio"))
			uci:set(cfg, token, "start_hour",   luci.http.formvalue(prefixStr .. "StartHour"))
			uci:set(cfg, token, "start_min",    luci.http.formvalue(prefixStr .. "StartMin"))
			uci:set(cfg, token, "end_hour",     luci.http.formvalue(prefixStr .. "EndHour"))
			uci:set(cfg, token, "end_min",      luci.http.formvalue(prefixStr .. "EndMin"))

			if "1" == luci.http.formvalue(prefixStr .. "Enabled") then
				uci:set(cfg, token, "enabled", "1")
			else
				uci:set(cfg, token, "enabled", "0")
			end
		end
		
		uci:commit(cfg)
		uci:apply(cfg)
	end
	
	local wifi = {}
	local wifi5G = {}
	local wlan_radio = uci:get("system","main","power_saving_select")
	
	for i,v in ipairs(days) do
		local token = string.lower( v:sub( 1, 1 ) ) .. v:sub( 2, #v )

		wifi[i] = {status=uci:get("wifi_schedule",token,"status_onoff"),
		enabled=uci:get("wifi_schedule",token,"enabled"),
		start_hour=uci:get("wifi_schedule",token,"start_hour"),
		start_min=uci:get("wifi_schedule",token,"start_min"),
		end_hour=uci:get("wifi_schedule",token,"end_hour"),
		end_min=uci:get("wifi_schedule",token,"end_min")}
		wifi5G[i] = {status=uci:get("wifi_schedule5G",token,"status_onoff"),
		enabled=uci:get("wifi_schedule5G",token,"enabled"),
		start_hour=uci:get("wifi_schedule5G",token,"start_hour"),
		start_min=uci:get("wifi_schedule5G",token,"start_min"),
		end_hour=uci:get("wifi_schedule5G",token,"end_hour"),
		end_min=uci:get("wifi_schedule5G",token,"end_min")}
	end
	
	luci.template.render("easy_pwsave/power_saving", {
		wifi_radio = wlan_radio,
		wifi_sch = wifi,
		wifi5G_sch = wifi5G
	})
end

-- Modification for eaZy123 error, NBG6616, WenHsiang, 2011/12/28
function action_eaZy123_flag()
	uci:set("system","main","eaZy123","1")		
	uci:commit("system")
	luci.template.render("genie2")
end

function action_wan_internet_connection()
    local genie2_1_apply = luci.http.formvalue("genie2-1_apply")

    if genie2_1_apply then
		-- lock dns check, and it will be unlock after updating dns in update_sys_dns
		sys.exec("echo 1 > /var/update_dns_lock")
		local wan_proto = uci:get("network","wan","proto")
		sys.exec("echo "..wan_proto.." > /tmp/old_wan_proto")
	
        local connection_type = luci.http.formvalue("connectionType")                				

        if connection_type == "PPPOE" then

			local pppoeUser = luci.http.formvalue("pppoeUser")
			local pppoePass = luci.http.formvalue("pppoePass")
			local pppoeIdleTime = luci.http.formvalue("pppoeIdleTime")
			local pppoeWanIpAddr = luci.http.formvalue("pppoeWanIpAddr")
					
			if not pppoeIdleTime then
				pppoeIdleTime=""
			end
					
			if not pppoeWanIpAddr then
				pppoeWanIpAddr=""
			end
					
			uci:set("network","wan","proto","pppoe")
			uci:set("network","wan","username",pppoeUser)
			uci:set("network","wan","password",pppoePass)
			uci:set("network","wan","demand",pppoeIdleTime)
			uci:set("network","wan","pppoeWanIpAddr",pppoeWanIpAddr)

		elseif connection_type == "PPTP" then
		
			local pptpUser = luci.http.formvalue("pptpUser")
			local pptpPass = luci.http.formvalue("pptpPass")
			local pptp_serverIp = luci.http.formvalue("pptp_serverIp")
			local pptpWanIpAddr = luci.http.formvalue("pptpWanIpAddr")
			local pptp_config_ip = luci.http.formvalue("pptp_config_ip")
			local pptp_staticIp = luci.http.formvalue("pptp_staticIp")
			local pptp_staticNetmask = luci.http.formvalue("pptp_staticNetmask")
			local pptp_staticGateway = luci.http.formvalue("pptp_staticGateway")

			if pptpNailedup~="1" then
				pptpNailedup=0
			end
					
			if not pptpIdleTime then
				pptpIdleTime=""
			end
					
			if not pptpWanIpAddr then
				pptpWanIpAddr=""
			end					
			uci:set("network","wan","proto","pptp")
			uci:set("network","vpn","interface")
			
			if pptp_config_ip == "1" then
				uci:set("network","vpn","proto","dhcp")
			else
				uci:set("network","vpn","proto","static")
				uci:set("network","wan","ipaddr",pptp_staticIp)
				uci:set("network","wan","netmask",pptp_staticNetmask)
				uci:set("network","wan","gateway",pptp_staticGateway)
			end
			
			uci:set("network","vpn","pptp_username",pptpUser)
			uci:set("network","vpn","pptp_password",pptpPass)
			uci:set("network","vpn","pptp_Nailedup",pptpNailedup)
			uci:set("network","vpn","pptp_demand",pptpIdleTime)
			uci:set("network","vpn","pptp_serverip",pptp_serverIp)
			uci:set("network","vpn","pptpWanIPMode","1")
			uci:set("network","vpn","pptpWanIpAddr",pptpWanIpAddr)
			
		else			
			local WAN_IP_Auto = luci.http.formvalue("WAN_IP_Auto")
			local Fixed_staticIp = luci.http.formvalue("staticIp")
			local Fixed_staticNetmask = luci.http.formvalue("staticNetmask")
			local Fixed_staticGateway = luci.http.formvalue("staticGateway")
			local Server_dns1Type       = luci.http.formvalue("dns1Type")
			local Server_staticPriDns   = luci.http.formvalue("staticPriDns")
			local Server_dns2Type       = luci.http.formvalue("dns2Type")
			local Server_staticSecDns   = luci.http.formvalue("staticSecDns")
			
			if Server_dns1Type~="USER" or Server_staticPriDns == "0.0.0.0" or not Server_staticPriDns then
				Server_staticPriDns=""
				if string.match(Server_dns1Type, "(%a+)") then
					Server_dns1Type = string.match(Server_dns1Type, "(%a+)")
					uci:set("network","wan","dns1",Server_dns1Type ..",".. Server_staticPriDns)
				end
			elseif string.match(Server_dns1Type, "(%a+)") and string.match(Server_staticPriDns, "(%d+.%d+.%d+.%d+)") then
				Server_dns1Type = string.match(Server_dns1Type, "(%a+)")
				Server_staticPriDns = string.match(Server_staticPriDns, "(%d+.%d+.%d+.%d+)")
				uci:set("network","wan","dns1",Server_dns1Type ..",".. Server_staticPriDns)
			end
						
			if Server_dns2Type~="USER" or Server_staticSecDns == "0.0.0.0" or not Server_staticSecDns then
				Server_staticSecDns=""
				if string.match(Server_dns2Type, "(%a+)") then
					Server_dns2Type = string.match(Server_dns2Type, "(%a+)")
					uci:set("network","wan","dns2",Server_dns2Type ..",".. Server_staticSecDns)
				end
			elseif string.match(Server_dns2Type, "(%a+)") and string.match(Server_staticSecDns, "(%d+.%d+.%d+.%d+)") then
				Server_dns2Type = string.match(Server_dns2Type, "(%a+)")
				Server_staticSecDns = string.match(Server_staticSecDns, "(%d+.%d+.%d+.%d+)")
				uci:set("network","wan","dns2",Server_dns2Type ..",".. Server_staticSecDns)
			end
					
			if WAN_IP_Auto == "1" then
				uci:set("network","wan","proto","dhcp")
            else
				uci:set("network","wan","proto","static")
				if string.match(Fixed_staticIp, "(%d+.%d+.%d+.%d+)") then
					Fixed_staticIp = string.match(Fixed_staticIp, "(%d+.%d+.%d+.%d+)")
					uci:set("network","wan","ipaddr",Fixed_staticIp)
				end
				if string.match(Fixed_staticNetmask, "(%d+.%d+.%d+.%d+)") then
					Fixed_staticNetmask = string.match(Fixed_staticNetmask, "(%d+.%d+.%d+.%d+)")
					uci:set("network","wan","netmask",Fixed_staticNetmask)
				end
				if string.match(Fixed_staticGateway, "(%d+.%d+.%d+.%d+)") then
					Fixed_staticGateway = string.match(Fixed_staticGateway, "(%d+.%d+.%d+.%d+)")
					uci:set("network","wan","gateway",Fixed_staticGateway)
				end
            end
		end
			
		uci:set("network","general","config_section","wan")	
		uci:commit("network")	
        uci:apply("network")
	end

    luci.template.render("genie2-6")
end

function action_password()
        local genie3_apply = luci.http.formvalue("genie3_apply")

	if genie3_apply then
		local new_password = luci.http.formvalue("new_password")
		
		if not new_password then
			new_password = ""
		end
		new_password = checkInjection(new_password)
		if new_password ~= false then
			uci:set("system","main","pwd",new_password)	
		end
		
		uci:commit("system")
		uci:apply("system")
		end

		local iface
		if wlanRadio then
		if wlanRadio == "2.4G" then
			iface = "ath0"
			wpscfg = "wps"
		elseif wlanRadio == "5G" then
			iface = "ath10"
			wpscfg = "wps5G"
		end
	end
	
	luci.template.render("genie4", {
		SSID = uci:get("wireless","ath0","ssid"),
		security = uci:get("wireless","ath0","auth"),
		pwd = uci:get("wireless","ath0","WPAPSKkey"),
		SSID_5G = uci:get("wireless","ath10","ssid"),
		security_5G = uci:get("wireless","ath10","auth"),
		pwd_5G = uci:get("wireless","ath10","WPAPSKkey")
	})		

end

function action_completion()
	local genie4_apply = luci.http.formvalue("genie4_apply")
	local wlanRadio = luci.http.formvalue("wlanRadio")
	--local wps_enable = uci:get("wps","wps","enabled")
	--local wps5G_enable = uci:get("wps5G","wps","enabled")
	
	if genie4_apply then
		local cfg
		local section
		local wlanPwd = luci.http.formvalue("wlanPwd")
		local wlanSSID = luci.http.formvalue("wlanSSID")
		local wlanSec = luci.http.formvalue("wlanSec")
		
		if wlanRadio == "2.4G" then
			cfg = "wireless"
			section = "ath0"
			wpscfg = "wps"
			--elseif wlanRadio == "5G" then
			--cfg = "wireless"
			section5g = "ath10"
			wpscfg5g = "wps5G"
		end
		
		wlanSSID = checkInjection(wlanSSID)
		if wlanSSID ~= false then
			uci:set(cfg,section,"ssid",wlanSSID)
			uci:set(cfg,section5g,"ssid",wlanSSID)
		end	
		
		if wlanSec == "none" then
			uci:set(cfg,section,"auth","OPEN")
			uci:set(cfg,section,"encryption","NONE")
			uci:set(cfg,section5g,"auth","OPEN")
			uci:set(cfg,section5g,"encryption","NONE")			
		elseif wlanSec == "WPA-PSK" then
			uci:set(cfg,section,"auth","WPAPSK")
			uci:set(cfg,section,"encryption","WPAPSK")
			uci:set(cfg,section5g,"auth","WPAPSK")
			uci:set(cfg,section5g,"encryption","WPAPSK")
			
			wlanPwd = checkInjection(wlanPwd)
			if wlanPwd  ~= false then
				uci:set(cfg,section,"WPAPSKkey", wlanPwd)
				uci:set(cfg,section5g,"WPAPSKkey", wlanPwd)
			end				
		elseif wlanSec == "WPA2-PSK" then
			uci:set(cfg,section,"auth","WPA2PSK")
			uci:set(cfg,section,"encryption","WPA2PSK")
			uci:set(cfg,section5g,"auth","WPA2PSK")
			uci:set(cfg,section5g,"encryption","WPA2PSK")
			
			wlanPwd = checkInjection(wlanPwd)
			if wlanPwd  ~= false then
				uci:set(cfg,section,"WPAPSKkey", wlanPwd)
				uci:set(cfg,section5g,"WPAPSKkey", wlanPwd)
			end				
		end
		
		uci:commit(cfg)
		uci:apply(cfg)
		--WPS function
		--Set wps conf with 1 here, the WPS status will be configured when you
		--execute "wps ath0 on"
		uci:set(wpscfg,"wps","conf","1")
		uci:commit(wpscfg)
		uci:set(wpscfg5g,"wps","conf","1")
		uci:commit(wpscfg5g)		

		--if wlanRadio == "2.4G" then
			--if (wps_enable == "1") then
                        	--sys.exec("wps ath0 on")
                	--else
                        	--sys.exec("iwpriv ath0 set WscConfStatus=2")
                	--end			
		--elseif wlanRadio == "5G" then
			--if (wps5G_enable == "1") then
                        	--sys.exec("wps ath10 on")
                	--else
                        	--sys.exec("iwpriv ath10 set WscConfStatus=2")
                	--end	
		--end                
	end
	
	luci.template.render("genie5")
end
-- Modification for eaZy123 error, NBG6616, WenHsiang, 2011/12/28
-- Addition for mobile, NBG6616, WenHsiang, 2012/3/7
function action_mobile()
	uci:set("system","main","eaZy123","1")
	uci:commit("system")
	luci.template.render("mobile")
end
-- Addition for mobile, NBG6616, WenHsiang, 2012/3/6



-- Addition for mobile, NBG6616, Michael, 2012/3/13 
function mobile_action_easy_set_apply()
	local job = luci.http.formvalue("easy_set_button_job")
	local mode = luci.http.formvalue("easy_set_button_mode")
	
	if job and mode then
		if job == "1" then
			uci:set("qos","general","game_enable",mode)
			
			local tbl = uci:get_all("qos","priority")
			local qostbl = {}
			qostbl[tbl["game"]] = "game"
			qostbl[tbl["voip"]] = "voip"
			qostbl[tbl["web"]] = "web"
			qostbl[tbl["media"]] = "media"
			qostbl[tbl["ftp"]] = "ftp"
			qostbl[tbl["mail"]] = "mail"
			qostbl[tbl["others"]] = "others"
				
			if mode == "1" then
				uci:set("qos","general","enable",mode)
				
				for k,name in pairs(qostbl) do
					if name == "game" then
						key = k
						break
					end
				end
				
				local idx = tonumber(key)
				if idx ~= 7 then
					for i=idx,6 do
						local tmp = qostbl[tostring(i+1)]
						qostbl[tostring(i)] = tmp
					end
					qostbl["7"] = "game"
					
					for i=idx,7 do
						uci:set("qos","priority", qostbl[tostring(i)], i)
					end
				end
				
				-- configure shapper
				if "0" == uci:get("qos","shaper","port_rate_eth0") then
					uci:set("qos","shaper", "port_status_eth0", 0)
				else
					uci:set("qos","shaper", "port_status_eth0", mode)
				end
				
				if "0" == uci:get("qos","shaper","port_rate_lan") then
					uci:set("qos","shaper", "port_status_lan", 0)
				else
					uci:set("qos","shaper", "port_status_lan", mode)
				end
			else
				local tmp = qostbl["7"]
				qostbl["7"] = qostbl["6"]
				qostbl["6"] = tmp
				
				uci:set("qos","priority", qostbl["7"], "7")
				uci:set("qos","priority", qostbl["6"], "6")
			end
			uci:commit("qos")
			uci:apply("qos")
		elseif job == "2" then
			wifi_select = uci:get("system","main","power_saving_select")
			if wifi_select == "2.4G" then
				cfg = "wifi_schedule"
			else
				cfg = "wifi_schedule5G"
			end
			if mode == "1" then
				uci:set(cfg,"wlan","enabled","enable")
			else
				uci:set(cfg,"wlan","enabled","disable")
			end
			uci:commit(cfg)
			uci:apply(cfg)
		elseif job == "3" then
			uci:set("parental","keyword","enable",mode)
			uci:commit("parental")
			uci:apply("parental")
		elseif job == "4" then
			uci:set("qos","general","enable",mode)
			uci:commit("qos")
			uci:apply("qos")
		elseif job == "5" then
			uci:set("firewall","general","dos_enable",mode)
			uci:commit("firewall")
			uci:apply("firewall")
		elseif job == "6" then
			uci:set("wireless","ath0","disabled",mode)
		else
			return 
		end
	end
	
	luci.template.render("mobile_mainMenu")
end

function action_mobile_wizard03()
	local mobile_wizard02_apply = luci.http.formvalue("mobile_wizard02_apply")

	if mobile_wizard02_apply then
		-- lock dns check, and it will be unlock after updating dns in update_sys_dns
		sys.exec("echo 1 > /var/update_dns_lock")
		local wan_proto = uci:get("network","wan","proto")
		sys.exec("echo "..wan_proto.." > /tmp/old_wan_proto")
		local connection_type = luci.http.formvalue("connectionType")

		if connection_type == "PPPOE" then
			local pppoeUser = luci.http.formvalue("pppoeUser")
			local pppoePass = luci.http.formvalue("pppoePass")
			local pppoeIdleTime = luci.http.formvalue("pppoeIdleTime")
			local pppoeWanIpAddr = luci.http.formvalue("pppoeWanIpAddr")
					
			if not pppoeIdleTime then
				pppoeIdleTime=""
			end
					
			if not pppoeWanIpAddr then
				pppoeWanIpAddr=""
			end
					
			uci:set("network","wan","proto","pppoe")
			uci:set("network","wan","username",pppoeUser)
			uci:set("network","wan","password",pppoePass)
			uci:set("network","wan","demand",pppoeIdleTime)
			uci:set("network","wan","pppoeWanIpAddr",pppoeWanIpAddr)

		elseif connection_type == "PPTP" then
		
			local pptpUser = luci.http.formvalue("pptpUser")
			local pptpPass = luci.http.formvalue("pptpPass")
			local pptp_serverIp = luci.http.formvalue("pptp_serverIp")
			local pptpWanIpAddr = luci.http.formvalue("pptpWanIpAddr")
			local pptp_config_ip = luci.http.formvalue("pptp_config_ip")
			local pptp_staticIp = luci.http.formvalue("pptp_staticIp")
			local pptp_staticNetmask = luci.http.formvalue("pptp_staticNetmask")
			local pptp_staticGateway = luci.http.formvalue("pptp_staticGateway")

			if pptpNailedup~="1" then
				pptpNailedup=0
			end
					
			if not pptpIdleTime then
				pptpIdleTime=""
			end
					
			if not pptpWanIpAddr then
				pptpWanIpAddr=""
			end					
			uci:set("network","wan","proto","pptp")
			uci:set("network","vpn","interface")
			
			if pptp_config_ip == "1" then
				uci:set("network","vpn","proto","dhcp")
			else
				uci:set("network","vpn","proto","static")
				uci:set("network","wan","ipaddr",pptp_staticIp)
				uci:set("network","wan","netmask",pptp_staticNetmask)
				uci:set("network","wan","gateway",pptp_staticGateway)
			end
			
			uci:set("network","vpn","pptp_username",pptpUser)
			uci:set("network","vpn","pptp_password",pptpPass)
			uci:set("network","vpn","pptp_Nailedup",pptpNailedup)
			uci:set("network","vpn","pptp_demand",pptpIdleTime)
			uci:set("network","vpn","pptp_serverip",pptp_serverIp)
			uci:set("network","vpn","pptpWanIPMode","1")
			uci:set("network","vpn","pptpWanIpAddr",pptpWanIpAddr)
			
		else			
			local WAN_IP_Auto = luci.http.formvalue("WAN_IP_Auto")
			local Fixed_staticIp = luci.http.formvalue("staticIp")
			local Fixed_staticNetmask = luci.http.formvalue("staticNetmask")
			local Fixed_staticGateway = luci.http.formvalue("staticGateway")
					
			if WAN_IP_Auto == "1" then
				uci:set("network","wan","proto","dhcp")
			else
				uci:set("network","wan","proto","static")
				uci:set("network","wan","ipaddr",Fixed_staticIp)
				uci:set("network","wan","netmask",Fixed_staticNetmask)
				uci:set("network","wan","gateway",Fixed_staticGateway)
			end
		end		
		uci:set("network","general","config_section","wan")	
		uci:commit("network")	
		uci:apply("network")
	end
	
	luci.template.render("mobile_wizard03")
end

function action_mobile_wirelessSecurity2()
	local mobile_wirelessSecurity_apply = luci.http.formvalue("mobile_wirelessSecurity_apply")
	local wlanRadio = luci.http.formvalue("wlanRadio")
	
	if mobile_wirelessSecurity_apply then
		local cfg
		local section
		local wlanPwd = luci.http.formvalue("wlanPwd")
		local wlanSSID = luci.http.formvalue("wlanSSID")
		local wlanSec
		
		if wlanRadio == "2.4G" then
			cfg = "wireless"
			section = "ath0"
			wpscfg = "wps"
			wlanSec = luci.http.formvalue("wlanSec")
		elseif wlanRadio == "5G" then
			cfg = "wireless5G"
			section = "ath10"
			wpscfg = "wps5G"
			wlanSec = luci.http.formvalue("wlanSec2")
		end

		uci:set(cfg,section,"ssid",wlanSSID)
		if wlanSec == "none" then
			uci:set(cfg,section,"auth","OPEN")
			uci:set(cfg,section,"encryption","NONE")
		elseif wlanSec == "WPA-PSK" then
			uci:set(cfg,section,"auth","WPAPSK")
			uci:set(cfg,section,"encryption","WPAPSK")
			uci:set(cfg,section,"WPAPSKkey", wlanPwd)
		elseif wlanSec == "WPA2-PSK" then
			uci:set(cfg,section,"auth","WPA2PSK")
			uci:set(cfg,section,"encryption","WPA2PSK")
			uci:set(cfg,section,"WPAPSKkey", wlanPwd)
		end
		uci:commit(cfg)
		uci:apply(cfg)
	end
	
	luci.template.render("mobile_wirelessSecurity2")
end
-- Addition for mobile, NBG6616, WenHsiang, 2012/3/7

-- Addition for mobile, NBG6616, WenHsiang, 2012/3/21
function action_mobile_wireless()
	local mobile_wireless_apply = luci.http.formvalue("mobile_wireless_apply")
	local wlanRadio = luci.http.formvalue("wlanRadio")
	
	if mobile_wireless_apply then
		local cfg
		local section
		local wlanPwd = luci.http.formvalue("wlanPwd")
		local wlanSSID = luci.http.formvalue("wlanSSID")
		local wlanSec
		
		if wlanRadio == "2.4G" then
			cfg = "wireless"
			section = "ath0"
			wpscfg = "wps"
			wlanSec = luci.http.formvalue("wlanSec")
		elseif wlanRadio == "5G" then
			cfg = "wireless"
			section = "ath10"
			wpscfg = "wps5G"
			wlanSec = luci.http.formvalue("wlanSec2")
		end

		uci:set(cfg,section,"ssid",wlanSSID)
		if wlanSec == "none" then
			uci:set(cfg,section,"auth","OPEN")
			uci:set(cfg,section,"encryption","NONE")
		elseif wlanSec == "WPA-PSK" then
			uci:set(cfg,section,"auth","WPAPSK")
			uci:set(cfg,section,"encryption","WPAPSK")
			uci:set(cfg,section,"WPAPSKkey", wlanPwd)
		elseif wlanSec == "WPA2-PSK" then
			uci:set(cfg,section,"auth","WPA2PSK")
			uci:set(cfg,section,"encryption","WPA2PSK")
			uci:set(cfg,section,"WPAPSKkey", wlanPwd)
		end
		
		uci:commit(cfg)
		uci:apply(cfg)
	end
	
	luci.template.render("mobile_wireless")
end
-- Addition for mobile, NBG6616, WenHsiang, 2012/3/21

-- Addition for mobile, NBG6616, WenHsiang, 2012/3/26
function action_mobile_contentFiliter()
	local keywords = luci.http.formvalue("url_str")
	if keywords then
		uci:set("parental","keyword","keywords",keywords)
		uci:commit("parental")
		uci:apply("parental")
	end
	
	luci.template.render("mobile_contentFiliter")
end
-- Addition for mobile, NBG6616, WenHsiang, 2012/3/26

-- Addition for mobile, NBG6616, WenHsiang, 2012/4/2
function action_mobile_personalM()
	local current_mac = luci.http.formvalue("current_mac")
	local output_hostName
	local output_ipAdd
	local output_macAdd
	
	if current_mac then
		for line in io.lines("/tmp/dhcp.leases") do
			local sNum, macAdd, ipAdd, hostName, macAdd2 = line:match("(%d+) ([a-zA-F0-9:]+) ([0-9.]+)%s([a-zA-Z0-9-*]+)%s([a-zA-F0-9:*]+)")		
			if (macAdd == current_mac) then
				output_hostName = hostName
				output_ipAdd    = ipAdd
				output_macAdd   = macAdd
			end
		end
	end

	luci.template.render("mobile_personalM", {
		HOST = output_hostName,
		IP   = output_ipAdd,
		MAC  = output_macAdd
	})
end
-- Addition for mobile, NBG6616, WenHsiang, 2012/4/2


function mobile_bandwidth_easy_set_apply()
	local service = luci.http.formvalue("easy_set_service")
	local stars = luci.http.formvalue("easy_set_bandwidth")	
	local tbl = uci:get_all("qos","priority")
	local qostbl = {}
	qostbl[tbl["game"]] = "game"
	qostbl[tbl["voip"]] = "voip"
	qostbl[tbl["web"]] = "web"
	qostbl[tbl["media"]] = "media"
	qostbl[tbl["ftp"]] = "ftp"
	qostbl[tbl["mail"]] = "mail"
	qostbl[tbl["others"]] = "others"

	if service and stars then
		for i=1,7 do  
			if stars == uci:get("qos","priority",qostbl[tostring(i)]) then
				local pre_stars=uci:get("qos","priority",service)        
				uci:set("qos","priority", service, stars)
				uci:set("qos","priority", qostbl[tostring(i)], pre_stars)
			end
		end        
		uci:commit("qos")
		uci:apply("qos")   
	end
	luci.template.render("mobile_bandwidthMgmt")
end
-- Addition for mobile, NBG6616, Michael, 2012/3/27


-- Addition for mobile, NBG6616, Darren, 2012/4/04 --START--
function action_mobile_wifi_schedule()
	local cfg
	local apply = luci.http.formvalue("apply_str")
	local days = {"Everyday","Mon","Tue","Wed","Thu","Fri","Sat","Sun"}
	local job = luci.http.formvalue("pwSaving_job")
	local mode = luci.http.formvalue("pwSaving_mode")
	local setting = luci.http.formvalue("pwSaving_setting")
				
	if setting == "1" then
		if job and mode then
			local radio = luci.http.formvalue("wlanRadio")

			if radio == "2.4G" then
            		
				cfg = "wifi_schedule"
				uci:set("system","main","power_saving_select",radio)
				uci:commit("system")
				local everyday_24g = uci:get(cfg, "everyday", "enabled")
				local tmp_status_24g				

				for i, name in ipairs(days) do
					local prefixStr = "WLanSch" .. tonumber(i)-1
					local token = string.lower(name:sub(1, 1)) .. name:sub(2, #name)
					
					tmp_status_24g = uci:get(cfg, token, "status_onoff")	
					if tmp_status_24g == "0" then
						uci:set(cfg, token, "status_onoff", "1")
					end
				end
				-- if mode(everyday) = 1; others value must set "0".	
				if job == "1" then
					uci:set(cfg,"everyday","enabled",mode)
					if mode == "1" then
						uci:set(cfg,"mon","enabled","0")
						uci:set(cfg,"tue","enabled","0")
						uci:set(cfg,"wed","enabled","0")
						uci:set(cfg,"thu","enabled","0")
						uci:set(cfg,"fri","enabled","0")
						uci:set(cfg,"sat","enabled","0")
						uci:set(cfg,"sun","enabled","0")
					end
				-- if everyday_24g=1 ; others could not set value.
				elseif job == "2" then
					if everyday_24g == "0" then
						uci:set(cfg,"mon","enabled",mode)
					end
				elseif job == "3" then
					if everyday_24g == "0" then
						uci:set(cfg,"tue","enabled",mode)
					end
				elseif job == "4" then
					if everyday_24g == "0" then
						uci:set(cfg,"wed","enabled",mode)	
					end
	            		elseif job == "5" then
					if everyday_24g == "0" then
						uci:set(cfg,"thu","enabled",mode)
					end
	            		elseif job == "6" then
					if everyday_24g == "0" then
						uci:set(cfg,"fri","enabled",mode)
					end
				elseif job == "7" then
					if everyday_24g == "0" then
						uci:set(cfg,"sat","enabled",mode)
					end
				elseif job == "8" then
					if everyday_24g == "0" then
						uci:set(cfg,"sun","enabled",mode)
					end
				end
			else
				cfg = "wifi_schedule5G"
				uci:set("system","main","power_saving_select",radio)
				uci:commit("system")
				
				local everyday_5g = uci:get(cfg, "everyday", "enabled")
				local tmp_status_5g				

				for i, name in ipairs(days) do
					local prefixStr = "WLanSch" .. tonumber(i)-1
					local token = string.lower(name:sub(1, 1)) .. name:sub(2, #name)
					tmp_status_5g = uci:get(cfg, token, "status_onoff")

					if tmp_status_5g == "0" then
						uci:set(cfg, token, "status_onoff", "1")
					end
				end
					-- if mode(everyday) = 1; others value must set "0".		
					if job == "1" then
						uci:set(cfg,"everyday","enabled",mode)
						if mode == "1" then
							uci:set(cfg,"mon","enabled","0")
							uci:set(cfg,"tue","enabled","0")
							uci:set(cfg,"wed","enabled","0")
							uci:set(cfg,"thu","enabled","0")
							uci:set(cfg,"fri","enabled","0")
							uci:set(cfg,"sat","enabled","0")
							uci:set(cfg,"sun","enabled","0")
						end
					-- if everyday_24g=1 ; others could not set value.
					elseif job == "2" then
						if everyday_5g == "0" then
							uci:set(cfg,"mon","enabled",mode)
						end
					elseif job == "3" then
						if everyday_5g == "0" then
							uci:set(cfg,"tue","enabled",mode)
						end
					elseif job == "4" then
						if everyday_5g == "0" then
							uci:set(cfg,"wed","enabled",mode)
						end
							elseif job == "5" then
						if everyday_5g == "0" then
							uci:set(cfg,"thu","enabled",mode)
						end
							elseif job == "6" then
						if everyday_5g == "0" then
							uci:set(cfg,"fri","enabled",mode)
						end
					elseif job == "7" then
						if everyday_5g == "0" then
							uci:set(cfg,"sat","enabled",mode)
						end
					elseif job == "8" then
						if everyday_5g == "0" then
							uci:set(cfg,"sun","enabled",mode)
					end
				end
			end
			uci:commit(cfg)
			uci:apply(cfg)
		end
	end
		
	if apply == "1" then

		local radio = luci.http.formvalue("wlanRadio")
						
		if radio == "2.4G" then
			cfg = "wifi_schedule"
			uci:set("system","main","power_saving_select",radio)
			uci:commit("system")
			local tmp_status_24g
			for i, name in ipairs(days) do
				local prefixStr = "WLanSch" .. tonumber(i)-1
				local token = string.lower(name:sub(1, 1)) .. name:sub(2, #name)
				tmp_status_24g = uci:get(cfg, token, "status_onoff")
				if tmp_status_24g == "0" then
					uci:set(cfg, token, "status_onoff", "1")
				end		
				uci:set(cfg, token, "start_hour",   luci.http.formvalue(prefixStr .. "StartHour"))
				uci:set(cfg, token, "start_min",    luci.http.formvalue(prefixStr .. "StartMin"))
				uci:set(cfg, token, "end_hour",     luci.http.formvalue(prefixStr .. "EndHour"))
				uci:set(cfg, token, "end_min",      luci.http.formvalue(prefixStr .. "EndMin"))
			end
					
		else
			cfg = "wifi_schedule5G"
			uci:set("system","main","power_saving_select",radio)
			uci:commit("system")
			local tmp_status_5g
			for i, name in ipairs(days) do
				local prefixStr = "WLanSch" .. tonumber(i)-1
				local token = string.lower(name:sub(1, 1)) .. name:sub(2, #name)
		
				tmp_status_5g = uci:get(cfg, token, "status_onoff")
				if tmp_status_5g == "0" then
					uci:set(cfg, token, "status_onoff", "1")
				end
				uci:set(cfg, token, "start_hour",   luci.http.formvalue(prefixStr .. "StartHour_5G"))
				uci:set(cfg, token, "start_min",    luci.http.formvalue(prefixStr .. "StartMin_5G"))
				uci:set(cfg, token, "end_hour",     luci.http.formvalue(prefixStr .. "EndHour_5G"))
				uci:set(cfg, token, "end_min",      luci.http.formvalue(prefixStr .. "EndMin_5G"))
			end
		end
		uci:commit(cfg)
		uci:apply(cfg)
	end

	local wifi = {}
	local wifi5G = {}
	local wlan_radio = uci:get("system","main","power_saving_select")

	for i,v in ipairs(days) do
		local token = string.lower( v:sub( 1, 1 ) ) .. v:sub( 2, #v )
		wifi[i] = {status=uci:get("wifi_schedule",token,"status_onoff"),
		enabled=uci:get("wifi_schedule",token,"enabled"),
		start_hour=uci:get("wifi_schedule",token,"start_hour"),
		start_min=uci:get("wifi_schedule",token,"start_min"),
		end_hour=uci:get("wifi_schedule",token,"end_hour"),
		end_min=uci:get("wifi_schedule",token,"end_min")}
		wifi5G[i] = {status=uci:get("wifi_schedule5G",token,"status_onoff"),
		enabled=uci:get("wifi_schedule5G",token,"enabled"),
		start_hour=uci:get("wifi_schedule5G",token,"start_hour"),
		start_min=uci:get("wifi_schedule5G",token,"start_min"),
		end_hour=uci:get("wifi_schedule5G",token,"end_hour"),
		end_min=uci:get("wifi_schedule5G",token,"end_min")}
	end
        
	luci.template.render("mobile_powerSaving", {
		wifi_radio = wlan_radio,
		wifi_sch = wifi,
		wifi5G_sch = wifi5G
	})
end
-- Addition for mobile, NBG6616, Darren, 2012/4/04 --END--
function checkInjection(str)

        if nil ~= string.match(str,"'") then
			return false
        end

        if nil ~= string.match(str,"-") then
			return false
        end

        if nil ~= string.match(str,"<") then
			return false
        end

        if nil ~= string.match(str,">") then
			return false
        end

        return str

end

