--[[
LuCI - Lua Configuration Interface

Copyright 2008 Steven Barth <steven@midlink.org>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

$Id: index.lua 4040 2009-01-16 12:35:25Z Cyrus $
]]--
module("luci.controller.expert.maintenance", package.seeall)
local sys = require("luci.sys")
local uci = require("luci.model.uci").cursor()
local nixio = require("nixio")  --wen-hsiang 2011.9.9.--
function index()
	
	local i18n = require("luci.i18n")
	local libuci = require("luci.model.uci").cursor()
	local lang = libuci:get("system","main","language") 
	i18n.load("admin-core",lang)
	i18n.setlanguage(lang)
	
	local page  = node("expert", "maintenance")
	page.target = template("expert_maintenance/maintenance")
	page.title  = i18n.translate("Monitor")  
	page.order  = 30
	
	local page  = node("expert", "maintenance", "maingeneral")
	page.target = call("action_general")
	page.title  = i18n.translate("General")  
	page.order  = 40
	
	local page  = node("expert", "maintenance", "password")
	page.target = call("action_password")
	page.title  = i18n.translate("Password")  
	page.order  = 50
	
	local page  = node("expert", "maintenance", "time")
	page.target = call("action_timeSetting")
	page.title  = i18n.translate("Time")  
	page.order  = 60
	
	local page  = node("expert", "maintenance", "fw")
	page.target = call("action_upgrade")
	page.title  = i18n.translate("Firmware_Upgrade")  
	page.order  = 70
	
	local page  = node("expert", "maintenance", "bakrestore")
	page.target = call("action_backup")
	page.title  = i18n.translate("Backup_Restore")  
	page.order  = 80
	
	local page  = node("expert", "maintenance", "Systemrebooting")
	page.target = call("action_restart")
	page.title  = i18n.translate("Systemrebooting")  
	page.order  = 85
	
	local page  = node("expert", "maintenance", "language")
	page.target = call("act_lang")
	page.title  = i18n.translate("Language")  
	page.order  = 90

	local page  = node("expert", "maintenance", "operation_mode")
	page.target = call("act_op_mode")
	page.title  = i18n.translate("sys_op_mode")
	page.order  = 95
end

function action_general()
	local apply = luci.http.formvalue("apply")

	if apply then

		local hostname    = luci.http.formvalue("hostname")
		local domain_name = luci.http.formvalue("domain_name")
		local sessiontime = luci.http.formvalue("sessiontime")

		hostname = checkInjection(hostname)
		if hostname ~= false then
			uci:set("system","main","hostname",hostname)
			uci:set("system","config","hostname",hostname)
			uci:set("system","main","product_name",hostname)
			--Save another HostName to /etc/config/network for DHCP client use.
			uci:set("network","wan","hostname",hostname)
		end

		domain_name = checkInjection(domain_name)
		if domain_name ~= false then		   
			uci:set("system","main","domain_name",domain_name)
		end

		if string.match(sessiontime, "(%d+)") then
			sessiontime = string.match(sessiontime, "(%d+)")
			sessiontime = sessiontime * 60  -- timeout(seconds)  
			uci:set("luci","sauth","sessiontime",sessiontime)
		end

		uci:commit("system")
		uci:commit("luci")
		uci:commit("network")

		local ipaddr = uci:get("network", "lan", "ipaddr")		   
		local file = io.open( "/etc/hosts", "w" )
		if hostname ~= false then
			file:write(ipaddr .. " " .. hostname .. "\n")
		end
		file:write(ipaddr .. " " .. "myrouter" .. "\n")
		file:write("127.0.0.1" .. " " .. "localhost" .. "\n")							
		file:close()		   

		sys.exec("/sbin/update_lan_dns")
		sys.exec("/etc/init.d/dnsmasq stop 2>/dev/null")
		sys.exec("/etc/init.d/dnsmasq start 2>/dev/null")

	end

	luci.template.render("expert_maintenance/maintenance_general")

end

function action_password()
	local apply = luci.http.formvalue("apply")
	local url_password = luci.dispatcher.build_url("expert", "maintenance", "password")

	if apply then
		local new_password = luci.http.formvalue("new_password")
		local old_password = luci.http.formvalue("old_password")
		local ckPassword = uci:get("system","main","pwd")
		local password_len = string.len( new_password )
		
		if old_password ~= ckPassword then 		
			luci.http.redirect(url_password .. "?" .. "&pwError=1") 
			return
		end
		
		if ( password_len > 30 ) then
			luci.http.redirect(url_password .. "?" .. "&pwError=2") 
			return
		end

		uci:set("system","main","pwd",new_password)
		uci:commit("system") 
		uci:apply("system") 
	end

	luci.template.render("expert_maintenance/password")

end

function action_backup()
	local restore_cmd = "gunzip | tar -xC/ >/dev/null 2>&1"
	local backup_cmd  = "tar -c %s | gzip 2>/dev/null"
	local restore_fpi
	
	luci.http.setfilehandler(
		function(meta, chunk, eof)
			if not restore_fpi then
				restore_fpi = io.popen(restore_cmd, "w")
			end
			if chunk then
				restore_fpi:write(chunk)
			end
			if eof then
				restore_fpi:close()
			end
		end
	)

	local upload = luci.http.formvalue("Restore")
	local backup = luci.http.formvalue("Backup")
	local reset  = luci.http.formvalue("Reset")

	local logfile                

	if upload then
		luci.template.render("expert_maintenance/backup_restore",{rebootsystem=1})
		sys.exec("reboot")
	elseif backup then
		luci.util.perror(backup_cmd:format(_keep_pattern()))
		local backup_fpi = io.popen(backup_cmd:format(_keep_pattern()), "r")
		luci.http.header('Content-Disposition', 'attachment; filename="backup-%s-%s.tar.gz"' % {
				"NBG6616", os.date("%Y-%m-%d")})
		luci.http.prepare_content("application/x-targz")
		luci.ltn12.pump.all(luci.ltn12.source.file(backup_fpi), luci.http.write)
		luci.template.render("expert_maintenance/backup_restore")
	elseif reset then
		luci.template.render("expert_maintenance/backup_restore",{rebootsystem=1})
		sys.exec("cp /sbin/reboot /tmp")
		sys.exec("firstboot")
		io.popen("sleep 1 && /tmp/reboot &")
	else
		luci.template.render("expert_maintenance/backup_restore")
	end
end

function action_upgrade()
	require("luci.model.uci")
	local tmpfile = "/tmp/rootfs"

	local function image_checksum()
		return (luci.sys.exec("md5sum %q" % tmpfile):match("^([^%s]+)"))
	end

	local function storage_size()
		local size = 0
		if nixio.fs.access("/proc/mtd") then
			for l in io.lines("/proc/mtd") do
				local d, s, e, n = l:match('^([^%s]+)%s+([^%s]+)%s+([^%s]+)%s+"([^%s]+)"')
				if n == "fs" then
					size = tonumber(s, 16)
					break
				end
			end
		elseif nixio.fs.access("/proc/partitions") then
			for l in io.lines("/proc/partitions") do
				local x, y, b, n = l:match('^%s*(%d+)%s+(%d+)%s+([^%s]+)%s+([^%s]+)')
				if b and n and not n:match('[0-9]') then
					size = tonumber(b) * 1024
					break
				end
			end
		end
		return size
    end
	
	local function upgrade_firmware()
		local fwupgrade    = 0
		local logfile

		filechecksum=image_checksum()
		loadfilesize=nixio.fs.stat(tmpfile).size
		flashsize=storage_size()

		sys.exec("cp /sbin/reboot /tmp")
		--sys.exec("fw_upgrade fw_check 1> /tmp/logfile 2> /dev/null")		
		io.popen("fw_upgrade fw_check 1> /tmp/logfile 2> /dev/null")		
		sys.exec("sleep 10")		
			
		logfile = io.open("/tmp/logfile", "r")				
		while true do
			msg = logfile:read("*line")
			if not msg then
				break
			end

			if msg == "Upgrade check success" then
				fwupgrade=1
				break
			end			
		end		
		
		if  fwupgrade == 1 then
			luci.template.render("expert_maintenance/fw", {checksum=filechecksum, filesize=loadfilesize, fileupload=1})
			sys.exec("/etc/init.d/dlna stop")
			sys.exec("/etc/init.d/samba stop")
			sys.exec("killall -9 proftpd")
			sys.exec("sleep 1 && echo 1 > /proc/sys/vm/drop_caches")
			sys.exec("echo 'Firmware upgrading, Please wait !' > /dev/console")
			--sys.exec("fw_upgrade exec_mtd")			
			--io.popen("fw_upgrade exec_mtd && sleep 2 && /tmp/reboot &")
			io.popen("fw_upgrade exec_mtd && /tmp/reboot &")
		else
			logfile:seek("set")
			msg=logfile:read("*all")
			sys.exec("rm /tmp/rootfs")
			luci.template.render("expert_maintenance/fw", {fileupload=2, errmsg=msg})
		end
		
		logfile:close()		
		
	end

	-- Install upload handler
	local file
	luci.http.setfilehandler(
		function(meta, chunk, eof)
			if not nixio.fs.access(tmpfile) and not file and chunk and #chunk > 0 then
				file = io.open(tmpfile, "w")
			end
			if file and chunk then
				file:write(chunk)
			end
			if file and eof then
				file:close()
			end
		end
	)
	-- Determine state
	local keep_avail   = true
	local has_image    = nixio.fs.access(tmpfile)
	local has_upload   = luci.http.formvalue("mtenFWUpload")
	local upload = luci.http.formvalue("sysSubmit")

	if upload == "1" then  -- wen-hsiang 2012.5.21. --
		sys.exec("echo 3 > /proc/sys/vm/drop_caches && sleep 1")	
		upgrade_firmware()
		return
	end

	-- On-line Firmware upgrade 
	local on_line_check = luci.http.formvalue("check_fw")
	local fw_version="none"
	local fw_release_date="none"
	local fw_release_note="none"
	local fw_size="none"
	local fw_name="none"
	local online_file
	local ret="fail"

	if on_line_check == "1" then  -- wen-hsiang 2012.5.21. --
	
		sys.exec("get_online_info")
		online_file = io.open("/tmp/get_online_info", "r")
		ret = online_file:read("*line")
		online_file:close()

		if ( ret == "fail" ) then
			nixio.syslog("err","Network connection error! Firmware version check is not completed!")  -- wen-hsiang 2011.9.16. -- 
			luci.template.render("expert_maintenance/fw", {on_line_check_fw=0})
			return
		else
			nixio.syslog("info","Network has connected. Firmware version check has completed.")  -- wen-hsiang 2011.9.16. --		
			local fw_info
			fw_info = io.open("/tmp/fw_online_info", "r")
			if fw_info then
				fw_name=fw_info:read("*line")
				fw_version=fw_info:read("*line")
				fw_release_date=fw_info:read("*line")
				fw_release_note=fw_info:read("*line")
				fw_size=fw_info:read("*line")					
			end
			fw_info:close()
		end

		local file3 = io.open( "/tmp/firmware_version", "r" )
		local fw_ver_now = file3:read("*line")
		file3:close()
		
		if ( fw_ver_now == fw_version ) then
			luci.template.render("expert_maintenance/fw", {has_newer_fw=0})
		else
			luci.template.render("expert_maintenance/fw", {on_line_check_fw=1,
															FW_version=fw_version,
															FW_date=fw_release_date,
															FW_note=fw_release_note,
															FW_size=fw_size,
															firmware_version_now=fw_ver_now})
		end
		
		return
		
	end

	local on_line_upgrade = luci.http.formvalue("Do_Firmware_Upgrade")

	if on_line_upgrade == "1" then  -- wen-hsiang 2012.5.21. --
		nixio.syslog("info","Network has connected. Firmware download has started.")  -- wen-hsiang 2011.9.16. --
		--get firmware file name
		local fw_info
		fw_info = io.open("/tmp/fw_online_info", "r")			
		
		if fw_info then
			fw_name=fw_info:read("*line")
			fw_info:close()
			--download firmware			
			fw_name="\""..fw_name.."\""
			sys.exec("get_online_fw "..fw_name)

			online_file = io.open("/tmp/get_online_fw", "r")
			if online_file then
				ret = online_file:read("*line")
				online_file:close()
			end

			if ( ret == "fail" ) then
				luci.template.render("expert_maintenance/fw", {on_line_fw_dl=0})
				return
			else
				sys.exec("echo 3 > /proc/sys/vm/drop_caches && sleep 1")			
				upgrade_firmware()
				return
			end
			
		end
		
	end

	luci.template.render("expert_maintenance/fw", {fileupload=0, on_line_check_fw=2,on_line_fw_dl=1})
end

function _keep_pattern()
        local kpattern = ""
        local files = luci.model.uci.cursor():get_all("luci", "flash_keep")
        if files then
                kpattern = ""
                for k, v in pairs(files) do
                        if k:sub(1,1) ~= "." and nixio.fs.glob(v)() then
                                kpattern = kpattern .. " " ..  v
                        end
                end
        end
        return kpattern
end
function action_timeSetting()
 	local apply = luci.http.formvalue("sysSubmit2")
	local url = luci.dispatcher.build_url("expert","maintenance","time")

	if apply then
	
		local mtenNew_Hour = luci.http.formvalue("mtenNew_Hour")
		local mtenNew_Min = luci.http.formvalue("mtenNew_Min")
		local mtenNew_Sec = luci.http.formvalue("mtenNew_Sec")
		local mtenNew_Year = luci.http.formvalue("mtenNew_Year")
		local mtenNew_Mon = luci.http.formvalue("mtenNew_Mon")
		local mtenNew_Day = luci.http.formvalue("mtenNew_Day")

		mtenNew_Hour=zero_padding(mtenNew_Hour)
		mtenNew_Min=zero_padding(mtenNew_Min)
		mtenNew_Sec=zero_padding(mtenNew_Sec)
		mtenNew_Year=zero_padding(mtenNew_Year)
		mtenNew_Mon=zero_padding(mtenNew_Mon)
		mtenNew_Day=zero_padding(mtenNew_Day)


		local mtenTimeZone = luci.http.formvalue("mtenTimeZone")
		local mten_ServiceType = luci.http.formvalue("mten_ServiceType")
		local btndaylight = luci.http.formvalue("btndaylight")

		local startNum = luci.http.formvalue("startNum")
		local startD = luci.http.formvalue("startD")
		local startMonth = luci.http.formvalue("startMonth")
		local startTime = luci.http.formvalue("startTime")
		local startDay = luci.http.formvalue("startDay")
		local endNum = luci.http.formvalue("endNum")
		local endD = luci.http.formvalue("endD")
		local endMonth = luci.http.formvalue("endMonth")			
		local endTime = luci.http.formvalue("endTime")
		local endDay = luci.http.formvalue("endDay")

		local tzIndex = luci.http.formvalue("tzIndex")
		local ntpName = luci.http.formvalue("ntpName")

		-- Modification for input error check, NBG4615 v2, WenHsiang, 2012/07/04
		startTime = zero_padding(startTime)
		endTime = zero_padding(endTime)
		-- Modification for input error check, NBG4615 v2, WenHsiang, 2012/07/04           
		   
		if not btndaylight then
			btndaylight="0"
			startNum = "1"
			startD = "0"
			startMonth = "01"
			startTime = "00"
			endNum = "1"
			endD = "0"
			endMonth = "02"
			endTime = "00"			  
		else
			btndaylight="1"
		end

		if string.match(mtenTimeZone, "(%a++%d:%d+)") then				
			mtenTimeZone = string.match(mtenTimeZone, "(%a++%d:%d+)")
			uci:set("time","main","timezone",mtenTimeZone)
		elseif string.match(mtenTimeZone, "(%a+-%d:%d+)") then												
			mtenTimeZone = string.match(mtenTimeZone, "(%a+-%d:%d+)")
			uci:set("time","main","timezone",mtenTimeZone)
		elseif string.match(mtenTimeZone, "(%a++%d+)") then				
			mtenTimeZone = string.match(mtenTimeZone, "(%a++%d+)")
			uci:set("time","main","timezone",mtenTimeZone)	
		elseif string.match(mtenTimeZone, "(%a+-%d+)") then				
			mtenTimeZone = string.match(mtenTimeZone, "(%a+-%d+)")
			uci:set("time","main","timezone",mtenTimeZone)		
		end	
	   --uci:set("time","main","timezone",mtenTimeZone)

		if mten_ServiceType == "0" then
			mten_ServiceType = "manual"
		else
			mten_ServiceType = "NTP"
		end


		uci:set("time","DST","enable",btndaylight)

		if string.match(startNum, "%d") then
			startNum = string.match(startNum, "%d")
			uci:set("time","DST","start_num",startNum)
		end
		if string.match(startMonth, "%d%d") then
			startMonth = string.match(startMonth, "%d%d")
			uci:set("time","DST","start_month",startMonth)
		end
		if string.match(startD, "%d") then
			startD = string.match(startD, "%d")
			uci:set("time","DST","start_d",startD)
		end
		if string.match(startDay, "%d%d") then
			startDay = string.match(startDay, "%d%d")
			uci:set("time","DST","start_day",startDay)
		end
		if string.match(startTime, "%d%d") then
			startTime = string.match(startTime, "%d%d")
			uci:set("time","DST","start_clock",startTime)
		end
		if string.match(endNum, "%d") then
			endNum = string.match(endNum, "%d")
			uci:set("time","DST","end_num",endNum)
		end
		if string.match(endMonth, "%d%d") then
			endMonth = string.match(endMonth, "%d%d")
			uci:set("time","DST","end_month",endMonth)
		end
		if string.match(endD, "%d") then
			endD = string.match(endD, "%d")
			uci:set("time","DST","end_d",endD)
		end
		if string.match(endDay, "%d%d") then
			endDay = string.match(endDay, "%d%d")
			uci:set("time","DST","end_day",endDay)
		end
		if string.match(endTime, "%d%d") then
			endTime = string.match(endTime, "%d%d")
			uci:set("time","DST","end_clock",endTime)
		end
   
		if string.match(mtenNew_Year, "(%d%d%d%d)") then
			mtenNew_Year = string.match(mtenNew_Year, "(%d%d%d%d)")
			uci:set("time","main","manual_year",mtenNew_Year)
		end	
		if string.match(mtenNew_Mon, "(%d%d)") then
			mtenNew_Mon = string.match(mtenNew_Mon, "(%d%d)")
			uci:set("time","main","manual_mon",mtenNew_Mon)
		end
		if string.match(mtenNew_Day, "(%d%d)") then
			mtenNew_Day = string.match(mtenNew_Day, "(%d%d)")
			uci:set("time","main","manual_day",mtenNew_Day)
		end
		if string.match(mtenNew_Hour, "(%d%d)") then
			mtenNew_Hour = string.match(mtenNew_Hour, "(%d%d)")
			uci:set("time","main","manual_hour",mtenNew_Hour)
		end	
		if string.match(mtenNew_Min, "(%d%d)") then
			mtenNew_Min = string.match(mtenNew_Min, "(%d%d)")
			uci:set("time","main","manual_min",mtenNew_Min)
		end	
		if string.match(mtenNew_Sec, "(%d%d)") then
			mtenNew_Sec = string.match(mtenNew_Sec, "(%d%d)")
			uci:set("time","main","manual_sec",mtenNew_Sec)
		end

		ntpName = checkInjection(ntpName)
		if ntpName ~= false then
			uci:set("time","main","ntpName",ntpName)
		end

		if string.match(tzIndex, "(%d+)") then
			tzIndex = string.match(tzIndex, "(%d+)")
			uci:set("time","main","tzIndex",tzIndex)
		end	


		uci:set("time","main","mode",mten_ServiceType)
		uci:commit("time")
		uci:apply("time")

		local chk_wifi_sch = uci:get("wifi_schedule","wlan","enabled")

		if chk_wifi_sch == "enable" then
			uci:apply("wifi_schedule")
		end
		luci.http.redirect(url)
	end

  	luci.template.render("expert_maintenance/time")
end
function zero_padding(num)
	if num == "0" or num == "1" or num == "2" or num == "3" or num == "4" or num == "5" or num == "6" or num == "7" or num == "8" or num == "9" then
		num="0" .. num
	end
	return num
end

function act_lang()
	local apply = luci.http.formvalue("apply")
	
	if apply then
		local lang = luci.http.formvalue("language")
		if lang then
			uci:set("system","main","language",lang)
			uci:commit("system")
		end

		luci.template.render("expert_maintenance/language",{reload_page=1})
		return
	end
	
	luci.template.render("expert_maintenance/language",{reload_page=0})
end

function action_restart()
	local restartsystem = luci.http.formvalue("restartsystem")
	
	if restartsystem then
		luci.template.render("expert_maintenance/restart",{rebootsystem=1})
		sys.exec("reboot")
	else
		luci.template.render("expert_maintenance/restart")
	end
end

function act_op_mode()
	local apply = luci.http.formvalue("apply")

	if apply then
		local op_mode = luci.http.formvalue("OPMode")
		local old_op_mode = uci:get("system","main","system_mode")
		local change = false

		if op_mode == "1" or op_mode == "4" or op_mode == "5" then
			if old_op_mode == "2" or old_op_mode == "3" then
				change = "ap2router"
			end
		elseif op_mode == "2" or op_mode == "3" then
			if old_op_mode == "1" or old_op_mode == "4" or old_op_mode == "5" then
				change = "router2ap"
			end
		end

		if op_mode ~= old_op_mode then
			local lan_ip = uci:get("network","lan","ipaddr")
			local lan_mask = uci:get("network","lan","netmask")
			local lan_gw = uci:get("network","lan","gateway")
			local wan_proto = uci:get("network","wan","proto")
			local wan_mtu = uci:get("network","wan","mtu")
			local old_wan_proto = uci:get("network","general","backup_wan_proto")
			local old_wan_mtu = uci:get("network","general","backup_wan_mtu")
			local old_lan_ip = uci:get("network","general","backup_lan_ip")
			local old_lan_mask = uci:get("network","general","backup_lan_mask")
			local old_lan_gw = uci:get("network","general","backup_lan_gw")
			local old_aplan_ip = uci:get("network","general","backup_aplan_ip")
			local old_aplan_mask = uci:get("network","general","backup_aplan_mask")
			local old_aplan_gw = uci:get("network","general","backup_aplan_gw")

			if not lan_gw then
				lan_gw = ""
			end

			if not old_lan_gw then
				old_lan_gw = ""
			end

			if not old_aplan_gw then
				old_aplan_gw = ""
			end	

			--##AP->Router
			if change == "ap2router" then
				
				if lan_ip ~= old_lan_ip then
					uci:set("network","general","backup_aplan_ip",lan_ip)
				end

				if lan_mask ~= old_lan_mask then
					uci:set("network","general","backup_aplan_mask",lan_mask)
				end

				if lan_gw ~= old_lan_gw then
					uci:set("network","general","backup_aplan_gw",lan_gw)
				end

				if wan_mtu ~= old_wan_mtu then
					uci:set("network","wan","proto",old_wan_mtu)
				end
				
				if wan_proto ~= old_wan_proto then
					uci:set("network","wan","proto",old_wan_proto)
				end				
				
				uci:set("network","lan","ifname","eth1")				
				uci:set("network","lan","ipaddr",old_lan_ip)
				uci:set("network","lan","netmask",old_lan_mask)
				uci:set("network","lan","gateway",old_lan_gw)

			end
			--##Router->AP
			if change == "router2ap" then

				if lan_ip ~= old_lan_ip then
					uci:set("network","general","backup_lan_ip",lan_ip)
				end

				if lan_mask ~= old_lan_mask then
					uci:set("network","general","backup_lan_mask",lan_mask)
				end

				if lan_gw ~= old_lan_gw then
					uci:set("network","general","backup_lan_gw",lan_gw)
				end
				
				if wan_proto ~= old_wan_proto then
					uci:set("network","general","backup_wan_proto",wan_proto)
				end
				
				if wan_mtu ~= old_wan_mtu then
					uci:set("network","general","backup_wan_mtu",wan_mtu)
				end				

				uci:set("network","lan","ifname","eth1 eth0")				
				uci:set("network","lan","ipaddr",old_aplan_ip)
				uci:set("network","lan","netmask",old_aplan_mask)
				uci:set("network","lan","gateway",old_aplan_gw)

				uci:set("network","wan","proto","")
				uci:set("network","wan","mtu","")				
				
			end

			uci:commit("network")

			uci:set("system","main","system_mode",op_mode)
			uci:commit("system")

			luci.template.render("expert_maintenance/operation_mode",{rebootsystem=1,changemode=change})
			sys.exec("reboot")
			return
		end
	end

	luci.template.render("expert_maintenance/operation_mode")
end

function checkInjection(str)
	if nil == string.match(str, "[`$<>-#&|'\",:]") then
		return str
	else
		return false
	end		
end

