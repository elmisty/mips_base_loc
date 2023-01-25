#!/bin/sh
echo [$0]: $1 ... > /dev/console
if [ "$1" = "start" ]; then
#	ddnsd &
	ddnsd -m 3&
else
	killall ddnsd
fi
