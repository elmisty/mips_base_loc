#!/bin/sh
#trigger by pppd to record PPTP client state
echo "[$0]: [$1] PPTP client [$2][$3] ..." > /dev/console
case "$1" in
add)
	xmldbc -P /etc/scripts/vpn-helper.php -V ACTION=$1 -V PID=$2 -V CLIENT=$3
	;;
remove)
	xmldbc -P /etc/scripts/vpn-helper.php -V ACTION=$1 -V PID=$2
	;;
*)
	"not support [$1] ..."
	;;	
esac

exit 0