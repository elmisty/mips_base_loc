#!/bin/sh
echo [$0]: $1 ... > /dev/console

##2G module uses PCIe_0

#implict txbf calibration data for 2G
#nvram set 1:rpcal2g=0
#TXBFCAL=`devdata get -e rpcal2g`
#[ "$TXBFCAL" != "" ] && nvram set 1:rpcal2g=$TXBFCAL

##5G band uses PCIe_1

#implict txbf calibration data for 5G band
#TXBFCAL=`devdata get -e rpcal5gb0`
#[ "$TXBFCAL" != "" ] && nvram set 0:rpcal5gb0=$TXBFCAL
#TXBFCAL=`devdata get -e rpcal5gb1`
#[ "$TXBFCAL" != "" ] && nvram set 0:rpcal5gb1=$TXBFCAL
#TXBFCAL=`devdata get -e rpcal5gb2`
#[ "$TXBFCAL" != "" ] && nvram set 0:rpcal5gb2=$TXBFCAL
#TXBFCAL=`devdata get -e rpcal5gb3`
#[ "$TXBFCAL" != "" ] && nvram set 0:rpcal5gb3=$TXBFCAL

#HuanYao: Move calibration to init_wifi_mod.php.

#we only insert wifi modules in init. 
#xmldbc -P /etc/services/WIFI/init_wifi_mod.php >> /var/init_wifi_mod.sh
#chmod +x /var/init_wifi_mod.sh
#/bin/sh /var/init_wifi_mod.sh

#initial wifi interfaces
service PHYINF.WIFI restart
#workaroud for wifi security issue
xmldbc -t "PHYINF.WIFI:10:service PHYINF.WIFI restart"

