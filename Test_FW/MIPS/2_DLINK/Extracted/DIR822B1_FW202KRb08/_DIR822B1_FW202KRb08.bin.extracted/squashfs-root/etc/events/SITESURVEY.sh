#!/bin/sh
#status=`xmldbc -g /runtime/phyinf:2/media/connectstatus`
#if [ "$status" = "Connected" ]; then
#	alphawifi ra0 sta_scan_update
#	sleep 5;
#fi
if [ -f /var/ssvy.txt ]; then
	rm /var/ssvy.txt
fi
iwlist wlan1 scanning >> /var/ssvy.txt
iwlist wlan0 scanning >> /var/ssvy.txt
Parse2DB sitesurvey -f /var/ssvy.txt -d > /dev/null
rm /var/ssvy.txt
exit 0
