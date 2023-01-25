#!/bun/sh

if [ "`ifconfig $1 | grep "RUNNING"`" == "" ]; then
	echo sleep 1, wait for $1 up > /dev/console
	xmldbc -k WIFI_ROOT_DETECT
	xmldbc -t "WIFI_ROOT_DETECT:1:sh /etc/scripts/wifi_root_detect.sh $1"
else
	ifconfig $1-vxd up
fi
exit 0
