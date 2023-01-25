#! /bin/sh
#freememery=`cat /proc/meminfo | grep MemFree|awk '{print $2}'`

#echo $freememery
#if [ $freememery -lt 9000 ]
#then
#	echo "memery is not enough"
#	#exit 1;
#	pkill streamd
#	sleep 2
#fi


#echo $@
if [ $# -ne 2 ]
then
	echo "usage: autoupgrade.sh SaveFileName URL"
#	streamserver=`ps -ef | grep streamd | grep -v grep | wc -l`
#	if [ $streamserver -ne 1 ]
#	then
#		streamd
#	fi
	exit 1
fi

savefilename=$1
url=$2
/usr/bin/wget -q -O $savefilename $url
#/usr/local/sbin/wget -O /tmp/upgrade.bin http://s3-ap-southeast-1.amazonaws.com/ipcamera-statics/ssl/firmware/nc200/nc200_1.0.16_Build_140613_Rel.16331.bin

result=$?

if [ $result -ne 0 ]
then
	echo "wget get the bin file failed"
	/usr/local/sbin/autoupgradenotice 0
	sleep 5;
#	if [ $(ps -ef | grep streamd |grep -v grep | wc -l) -ne 1 ]
#	then
#	streamd
#	fi
	if [ -f /tmp/upgrade.bin ]
	then
		rm /tmp/upgrade.bin
	fi
	exit 1
else
	/usr/local/sbin/autoupgradenotice 1
	echo "success"
fi
exit 0
