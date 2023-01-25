#!/bin/sh

SAVE_TIME_LOCK=/tmp/save_last_time.lock

if [ -e $SAVE_TIME_LOCK ]; then
	echo save_last_time.sh already exist.
	exit 1
fi

touch $SAVE_TIME_LOCK
chmod 600 $SAVE_TIME_LOCK

trap "rm -rf $SAVE_TIME_LOCK; exit" 1 2 3 9 15

i=10
while true
do
	if [ $i -ge 10 ]; then
		echo `date -u "+%Y-%m-%d %H:%M:%S"` > /usr/local/config/ipcamera/last_time
		i=0
	fi
	sleep 1
	i=`expr $i + 1`
done

