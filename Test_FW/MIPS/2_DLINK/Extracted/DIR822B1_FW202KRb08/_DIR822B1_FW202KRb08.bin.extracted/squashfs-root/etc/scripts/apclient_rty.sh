#!/bin/sh
xmldbc -k "APCLIENT_RETRY"
/etc/events/SITESURVEY.sh
service PHYINF.WIFISTA-1.1 restart
exit 0
