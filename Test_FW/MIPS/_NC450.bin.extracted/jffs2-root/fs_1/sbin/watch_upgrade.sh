#!/bin/sh

WATCH_UP_LOCK=/tmp/watch_upgrade.lock
UPGRADE_PREPARE=/tmp/upgrade_prepare
UPGRADE_INFO=/tmp/upgrade_info

if [ -f $WATCH_UP_LOCK ]; then
	echo watch_upgrade.sh already exist.
	exit 1
fi

touch $WATCH_UP_LOCK
chmod 600 $WATCH_UP_LOCK

trap "rm -rf $WATCH_UP_LOCK; rm -rf $UPGRADE_PREPARE; exit" 1 2 3 9 15

while true
do
	if ls /tmp/lighttpd* > /dev/null 2>&1;then
		if [ ! -f $UPGRADE_PREPARE ]; then
			touch $UPGRADE_PREPARE
			pkill storage
			pkill streamd

			sleep 2
			freememery=`cat /proc/meminfo | grep MemFree|awk '{print $2}'`
			echo memery free: $freememery
		fi
	elif ls /tmp/upgrade.bin > /dev/null 2>&1;then
		if [ ! -f $UPGRADE_PREPARE ]; then
			touch $UPGRADE_PREPARE
			pkill storage
			pkill streamd

			sleep 2
			freememery=`cat /proc/meminfo | grep MemFree|awk '{print $2}'`
			echo memery free: $freememery
		fi
	else
		if [ -f $UPGRADE_PREPARE ]; then
			if [ ! -f $UPGRADE_INFO ]; then
				# wait for upgrader to kill the other process
				sleep 5
				rm -rf $UPGRADE_PREPARE
			fi
		fi
	fi

	if [ -f $UPGRADE_INFO ]; then
		pid=`cat $UPGRADE_INFO | awk 'NR==1 {print}'`
		stat_path="/proc/"$pid"/stat"
		if ! cat $stat_path > /dev/null 2>&1; then
			upgrade_file_path=`cat $UPGRADE_INFO | awk 'NR==2 {print}'`

			echo upgrader was gone! It should be restart.
			sleep 2
			rm -rf $UPGRADE_INFO
			/bin/upgrader $upgrade_file_path &
		fi
	fi
	sleep 1
done

