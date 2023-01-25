#/bin/sh

killall wscd
killall iwcontrol
killall iapp
killall map_checker
killall map_agent
cp -ra /bin /tmp/
mount /tmp/bin /bin
cp -ra /sbin/wscd /bin/
cp -ra /sbin/iwcontrol /bin/
cp -ra /sbin/iapp /bin/
rm -rf /var/wsc*
cp -ra /default/easymesh/var/* /var/
cp -ra /default/easymesh/etc/* /etc/
chmod 777 /etc/efm_init.sh
cp -ra /default/var/wps /var/
init.sh
wscd -start -c /var/wsc-wlan0-wlan1.conf -w wlan0 -w2 wlan1 -fi /var/wscd-wlan0.fifo -fi2 /var/wscd-wlan1.fifo -daemon
wscd -mode 2 -c /var/wsc-wlan0-vxd.conf -w wlan0-vxd -fi /var/wscd-wlan0-vxd.fifo -daemon
iapp br0 wlan0 wlan1
iwcontrol wlan0 wlan1 wlan0-vxd

cp -ra /lib /tmp
mount /tmp/lib /lib
chmod 777 /bin/map_agent
chmod 777 /lib/libmultiap.so
