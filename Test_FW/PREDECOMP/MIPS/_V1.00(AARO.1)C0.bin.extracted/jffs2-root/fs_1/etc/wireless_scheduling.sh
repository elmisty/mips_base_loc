#!/bin/sh

. /etc/functions.sh
include /lib/config

wifi_scheduling_up()
{
	wifi_status=$(uci_get wireless ath0 disabled)

	if [ "$wifi_status" == "1" ]; then
                exit 0
        fi
	
	/sbin/wifi up wifi0
}

wifi_scheduling_down()
{
	/sbin/wifi down wifi0
}

show_help()
{
	echo 'Wireless_scheduling : invalid argument'
}


if [ $# = 0 ]; then
show_help
exit 0
fi

case $1 in

up)
wifi_scheduling_up
;;
down)
wifi_scheduling_down
;;
*)
show_help
;;
esac
