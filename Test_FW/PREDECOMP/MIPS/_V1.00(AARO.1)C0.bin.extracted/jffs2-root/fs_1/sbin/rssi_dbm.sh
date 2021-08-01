#!/bin/sh

cdm_channel=$(cat /tmp/3g_cmd_channel)
gcom -d "$cdm_channel" -s /etc/gcom/getstrength.gcom > /tmp/3g_strength

rssi=$(cat /tmp/3g_strength | grep '+CSQ:' | sed s'/+CSQ: //'g | cut -d ',' -f1)

if [ "$rssi" -gt "99" -o "$rssi" -lt "0" ] ; then
	signal_strength="no match the format" 
	echo $signal_strength > /tmp/3g_signal_strength
else
  dbm=$((-113 + $rssi*2))
  echo $dbm dbm > /tmp/3g_signal_strength
  if [ "$dbm" -ge "-77" ] ; then ##BAR_5
	signal_strength="(Excellent)" 
	echo $signal_strength >> /tmp/3g_signal_strength
  elif [ "$dbm" -ge "-86" ] ; then ##BAR_4
	signal_strength="(Good)" 
	echo $signal_strength >> /tmp/3g_signal_strength
  elif [ "$dbm" -ge "-92" ] ; then ##BAR_3
	signal_strength="(Fair)" 
	echo $signal_strength >> /tmp/3g_signal_strength
  elif [ "$dbm" -ge "-101" ] ; then ##BAR_2
	signal_strength="(Bad)" 
	echo $signal_strength >> /tmp/3g_signal_strength
  elif [ "$dbm" -ge "-108" ] ; then ##BAR_1
	signal_strength="(Weak)"
	echo $signal_strength >> /tmp/3g_signal_strength
  else ##dbm >= -110 ##BAR_0
	signal_strength="No Service" 
	echo $signal_strength >> /tmp/3g_signal_strength
  fi
  
fi



