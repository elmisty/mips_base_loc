#!/bin/sh

file=/tmp/output
devfile=/tmp/lltd_inf_lan
devnumfile_tmp=/tmp/lltd_num_lan_tmp
devnumfile=/tmp/lltd_num_lan

num=0
dev=0
wdev=0
mod=0
oop=0
i=0
j=0

rm -rf $devnumfile_tmp

#Update the 2.4g wifi state
wlanconfig ath0 list|awk '{print $1 $15}'|grep -v ADDR > /tmp/status24g
wlanconfig ath1 list|awk '{print $1 $15}'|grep -v ADDR >> /tmp/status24g
wlanconfig ath2 list|awk '{print $1 $15}'|grep -v ADDR >> /tmp/status24g
wlanconfig ath3 list|awk '{print $1 $15}'|grep -v ADDR >> /tmp/status24g
wifi_status /tmp/status24g
#Update the 5g wifi state
wlanconfig ath10 list|awk '{print $1 $15}'|grep -v ADDR > /tmp/status5g
wlanconfig ath11 list|awk '{print $1 $15}'|grep -v ADDR >> /tmp/status5g
wlanconfig ath12 list|awk '{print $1 $15}'|grep -v ADDR >> /tmp/status5g
wlanconfig ath13 list|awk '{print $1 $15}'|grep -v ADDR >> /tmp/status5g
wifi_status /tmp/status5g

zy1905="/tmp/zy1905.json"
local neighbor_range
if [ -f "$zy1905" ]; then
	cat /tmp/zy1905.json | grep -A1 'IEEE1905Device\.' | grep 'IEEE1905Id' | awk -F'\"' '{print $4}' > /tmp/output2
	neighbor=$(cat /tmp/zy1905.json | grep -n 'IEEE1905Device\.' | sed -n '1p' | awk -F":" '{print $1}')
	neighbor_end=$(cat /tmp/zy1905.json | wc -l)
	if [ "$neighbor" != "" ]; then
		neighbor_range=`expr $neighbor_end - $neighbor + 1`
	fi
fi
	
while read line
do
	mod=$((num % 7))
	if [ "$mod" -eq "0" ]; then
		line1=`echo $line | cut -c 4-20`
	elif [ "$mod" -eq "1" ]; then
		line2=`echo $line | cut -c 4-`
	elif [ "$mod" -eq "2" ]; then
		line3=`echo $line | cut -c 4-`
	elif [ "$mod" -eq "3" ]; then
		line4=$line
	elif [ "$mod" -eq "4" ]; then
		line5=$line
	elif [ "$mod" -eq "5" ]; then
		if [ -f "$zy1905" ]; then
			if [ "$(cat /tmp/output2)" == "" ]; then   
				[ `echo $line | cut -c 4-5` == "1" ] && line6="Wi-Fi " || line6="Ethernet "
				dev=$((dev + 1))
			else			
				if [ "$(cat /tmp/output2 | grep $line1)" != "" ]; then
					[ `echo $line | cut -c 4-5` == "1" ] && line6="L2-Device" || line6="L2-Device"
				elif [ "$neighbor_range" != "" -a "$(cat /tmp/zy1905.json | tail -n $neighbor_range | grep $line1 | grep '\"InterfaceId\"')" != "" ]; then
					line6="L2-Device"					
				else
					[ `echo $line | cut -c 4-5` == "1" ] && line6="Wi-Fi" || line6="Ethernet"
				fi
				dev=$((dev + 1))
			fi
		else
			[ `echo $line | cut -c 4-5` == "1" ] && line6="Wi-Fi " || line6="Ethernet "
			dev=$((dev + 1))
		fi						
	elif [ "$mod" -eq "6" ]; then
		if [ -f "$zy1905" -a "$neighbor_range" != "" ]; then
			line7=`echo $line | cut -c 4-`
			if [ "$(cat /tmp/zy1905.json | tail -n $neighbor_range | grep $line1 | grep '\"InterfaceId\"')" != "" ]; then		
				cat /tmp/zy1905.json | grep -A1 'IEEE1905Device\.' | grep 'IEEE1905Id' | awk -F'\"' '{print $4}' | while read LINE
				do					
					i=$((i + 1))							
					intf_num=$(cat /tmp/zy1905.json | grep -n -A2 ${LINE} | grep -A2 "IEEE1905Id" | tr -d "," | sed -n '3p' | awk -F": " '{print $2}')		 
					intf_num2=Interface.$intf_num   #intf_num2=Interface.14
					neighbor2=$(cat /tmp/zy1905.json | grep -n ${LINE} | grep "IEEE1905Id" | awk -F":" '{print $1}')		
					neighbor_range2=`expr $neighbor_end - $neighbor2 + 1`
					
					end_line=$(cat /tmp/zy1905.json | tail -n $neighbor_range2 | grep -n -A4 $intf_num2 | sed -n '4p' | awk -F"-" '{print $1}')
					end_line2=`expr $neighbor2 + $end_line`
				
					range=`expr $end_line2 - $neighbor2 + 1`
				
					echo ${LINE} > /tmp/L2_intf_al$i
					cat /tmp/zy1905.json | head -n $end_line2 | tail -n $range | grep 'InterfaceId' | awk -F"\"" '{print $4}' >>/tmp/L2_intf_al$i
					intf_mac=$(cat /tmp/L2_intf_al$i | grep $line1)

					if [ "$intf_mac" != "" ]; then
						line8=$(cat /tmp/L2_intf_al$i | sed -n '1p')
						echo "$line1 $line2 $line3 $line6 $line7 $line8" > $devfile$dev
						echo "$line1 $line2 $line3 $line6 $line7 $line8" >> $devnumfile_tmp						
						break
					fi
				done	
			else
				echo "$line1 $line2 $line3 $line6 $line7 none" > $devfile$dev
				echo "$line1 $line2 $line3 $line6 $line7 none" >> $devnumfile_tmp
			fi			
		else
			line7=`echo $line | cut -c 4-`
			echo "$line1 $line2 $line3 $line6 $line7" > $devfile$dev
			echo "$line1 $line2 $line3 $line6 $line7" >> $devnumfile_tmp
		fi
	fi
	num=$((num + 1))
done < $file


if [ -f "$zy1905" ]; then
	while read line
	do
		if [ "$(cat /tmp/lltd_num_lan_tmp | grep $line)" == "" ]; then
			dev=$((dev + 1))
			echo "$line 0.0.0.0 unknown L2-Device none $line " > $devfile$dev #not the same
			echo "$line 0.0.0.0 unknown L2-Device none $line" >> $devnumfile_tmp
		fi
	done < /tmp/output2 #L2 device	
fi

mv -f $devnumfile_tmp $devnumfile

