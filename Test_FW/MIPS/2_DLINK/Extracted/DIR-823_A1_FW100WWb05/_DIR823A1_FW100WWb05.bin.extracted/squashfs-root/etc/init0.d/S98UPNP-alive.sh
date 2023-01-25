#!/bin/sh
echo [$0]: $1 ... > /dev/console
if [ -f "/var/run/LAN-1.UP" ]; then
	service UPNP.LAN-1 restart
else
	sleep 20
	service UPNP.LAN-1 restart
fi

#workaround to fix UPNP-alive issue.
