#!/bin/sh
echo [$0]: $1 ... > /dev/console
event WAN-1.UP				insert "vpn:service VPN restart"
event WAN-1.DOWN			insert "vpn:service VPN stop"
service VPN start

exit 0
