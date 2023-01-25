#!/bin/sh

CFG_SYSTEM_REBOOT_THRESHOLD=60
CFG_SYSTEM_NORMAL_SEED=1
CFG_SYSTEM_ABNORMAL_SEED=10
CFG_SYSTEM_CHECK_INTREVAL=10
CFG_LOG_FILE_PATH=/usr/local/config/ipcamera/log/message.log

SYSTEM_REBOOT_SEED=0
IS_ANY_PROCESS_ABNORMAL=0

start_lighttpd()
{
	lighttpd -f /usr/local/config/lighttpd.conf
}

kill_all()
{
	pkill ipcamera
	pkill streamd
	pkill speaker
	pkill sd_record
	pkill onvif
	pkill alarm
	pkill ssl-tunnel
	pkill upnp
	pkill relayd
	pkill p2pd
	pkill Rtmp
	pkill vod
	pkill udhcpc
	pkill rinetd
	pkill mDNSResponderPosix
	pkill sleep
	pkill datetimed
	pkill mdnew_alarm
	echo All services cleaned
}

while true
do
	IS_ANY_PROCESS_ABNORMAL=0

	lighttpd_pid=`cat /var/run/lighttpd/lighttpd.pid`
	if ! [ -f "/proc/${lighttpd_pid}/status" ]; then
		echo "Process lighttpd not found, start it"
		start_lighttpd
		sleep 40

		IS_ANY_PROCESS_ABNORMAL=1
	fi

	result=`ps | grep Z | grep cloud`
	if [ $? -eq "0" ]; then
		echo "Found cloud zombie process, killall cloud"
		killall -9 cloud

		IS_ANY_PROCESS_ABNORMAL=1
	fi

	sleep ${CFG_SYSTEM_CHECK_INTREVAL}

	result=`ps | grep Z | grep ipcamera`
	if [ $? -eq "0" ]; then
		echo "Found ipcamera zombie process, kill lighttpd"
		kill ${lighttpd_pid}

		IS_ANY_PROCESS_ABNORMAL=1
	fi

	if [ $(find  /tmp/ -mmin +1 | grep uri) ]
	then
		find /tmp | grep uri | xargs rm -f
		cat /var/run/lighttpd/lighttpd.pid | xargs kill
	fi

	if [ ${IS_ANY_PROCESS_ABNORMAL} -eq "1" ]; then
		SYSTEM_REBOOT_SEED=`expr ${SYSTEM_REBOOT_SEED} + ${CFG_SYSTEM_ABNORMAL_SEED}`
	else
		SYSTEM_REBOOT_SEED=`expr ${SYSTEM_REBOOT_SEED} - ${CFG_SYSTEM_NORMAL_SEED}`
	fi

	if [ ${SYSTEM_REBOOT_SEED} -ge ${CFG_SYSTEM_REBOOT_THRESHOLD} ]; then
		kill_all()
		kill ${lighttpd_pid}
		reboot
	elif [ ${SYSTEM_REBOOT_SEED} -lt "0" ]; then
		SYSTEM_REBOOT_SEED=0
	else
		echo SYSTEM_REBOOT_SEED=${SYSTEM_REBOOT_SEED}
	fi

	#echo [watch_lighttpd.sh] SYSTEM_REBOOT_SEED=${SYSTEM_REBOOT_SEED}

done

