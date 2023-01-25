#!/bin/sh
echo [$0]: $1 ... > /dev/console
if [ "$1" = "start" ]; then
	event INFSVCS.LAN-1.UP		add "event STATUS.READY"
	event INFSVCS.BRIDGE-1.UP	add "event STATUS.READY"
	event INFSVCS.LAN-1.DOWN	add "event STATUS.NOTREADY"
	event INFSVCS.BRIDGE-1.DOWN	add "event STATUS.NOTREADY"

	service BRIDGE start
	service LAN start
	service WAN start
	service HW_ACCEL start
	service DEVICE start
else
	service HW_ACCEL stop
	service WAN stop
	service LAN stop
	service BRIDGE stop
	service DEVICE stop
fi