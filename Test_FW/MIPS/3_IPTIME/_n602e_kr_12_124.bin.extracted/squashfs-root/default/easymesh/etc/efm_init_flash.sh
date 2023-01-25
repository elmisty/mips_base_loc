#/bin/sh

killall wscd
killall iwcontrol
killall iapp
killall map_checker
killall map_agent
cp -ra /bin /tmp/
mount /tmp/bin /bin
cp -ra /sbin/flash /bin/
cp -ra /sbin/wscd /bin/
cp -ra /sbin/iwcontrol /bin/
cp -ra /sbin/iapp /bin/
flash default
ifconfig wlan0-vxd up
brctl addif br0 wlan0-vxd
rm -rf /var/wsc*
cp -ra /default/easymesh/var/* /var/
cp -ra /default/easymesh/etc/* /etc/
cp -ra /default/var/wps /var/
init.sh
flash set HW_WLAN0_WSC_PIN 96095393
flash set HW_WLAN1_WSC_PIN 96095393
flash set MIB_VER 1
flash set wlan0 DOT11K_ENABLE 1
flash set wlan0 DOT11V_ENABLE 1
flash set wlan0-va0 DOT11K_ENABLE 1
flash set wlan0-va0 DOT11V_ENABLE 1
flash set wlan0-va1 DOT11K_ENABLE 1
flash set wlan0-va1 DOT11V_ENABLE 1
flash set wlan0-va2 DOT11K_ENABLE 1
flash set wlan0-va2 DOT11V_ENABLE 1
flash set wlan0-va3 DOT11K_ENABLE 1
flash set wlan0-va3 DOT11V_ENABLE 1
flash set wlan0-va4 DOT11K_ENABLE 1
flash set wlan0-va4 DOT11V_ENABLE 1
flash set wlan0-va4 WLAN_DISABLED 0
flash set wlan1 DOT11K_ENABLE 1
flash set wlan1 DOT11V_ENABLE 1
flash set wlan1-va0 DOT11K_ENABLE 1
flash set wlan1-va0 DOT11V_ENABLE 1
flash set wlan1-va1 DOT11K_ENABLE 1
flash set wlan1-va1 DOT11V_ENABLE 1
flash set wlan1-va2 DOT11K_ENABLE 1
flash set wlan1-va2 DOT11V_ENABLE 1
flash set wlan1-va3 DOT11K_ENABLE 1
flash set wlan1-va3 DOT11V_ENABLE 1
flash set wlan1-va4 DOT11K_ENABLE 1
flash set wlan1-va4 DOT11V_ENABLE 1
flash set wlan1-va4 MAP_BSS_TYPE 0
flash set wlan0 STACTRL_ENABLE 1
flash set wlan0 STACTRL_PREFER 1
flash set wlan1 STACTRL_ENABLE 1
flash set DHCP 1
flash set DHCP_LEASE_TIME 480
flash set MAP_CONTROLLER 2
flash set REPEATER_ENABLED1 1
flash set HW_NIC0_ADDR 705dcc046f40
flash set HW_NIC1_ADDR 705dcc046f41
flash set HW_WLAN0_WLAN_ADDR 705dcc046f40
flash set HW_WLAN0_WLAN_ADDR1 725dcc046f40
flash set HW_WLAN0_WLAN_ADDR2 725dcc056f40
flash set HW_WLAN0_WLAN_ADDR3 725dcc066f40
flash set HW_WLAN0_WLAN_ADDR4 725dcc076f40
flash set HW_WLAN1_WLAN_ADDR 705dcc046f42
flash set HW_WLAN1_WLAN_ADDR1 725dcc046f42
flash set HW_WLAN1_WLAN_ADDR2 725dcc056f42
flash set HW_WLAN1_WLAN_ADDR3 725dcc066f42
flash set HW_WLAN1_WLAN_ADDR4 725dcc076f42
flash sethw HW_NIC0_ADDR 705dcc046f40
flash sethw HW_NIC1_ADDR 705dcc046f41
flash sethw HW_WLAN0_WLAN_ADDR 705dcc046f40
flash sethw HW_WLAN0_WLAN_ADDR1 725dcc046f40
flash sethw HW_WLAN0_WLAN_ADDR2 725dcc056f40
flash sethw HW_WLAN0_WLAN_ADDR3 725dcc066f40
flash sethw HW_WLAN0_WLAN_ADDR4 725dcc076f40
flash sethw HW_WLAN1_WLAN_ADDR 705dcc046f42
flash sethw HW_WLAN1_WLAN_ADDR1 725dcc046f42
flash sethw HW_WLAN1_WLAN_ADDR2 725dcc056f42
flash sethw HW_WLAN1_WLAN_ADDR3 725dcc066f42
flash sethw HW_WLAN1_WLAN_ADDR4 725dcc076f42
wscd -start -c /var/wsc-wlan0-wlan1.conf -w wlan0 -w2 wlan1 -fi /var/wscd-wlan0.fifo -fi2 /var/wscd-wlan1.fifo -daemon
wscd -mode 2 -c /var/wsc-wlan0-vxd.conf -w wlan0-vxd -fi /var/wscd-wlan0-vxd.fifo -daemon
iapp br0 wlan0 wlan1
iwcontrol wlan0 wlan1 wlan0-vxd
map_checker
map_agent &

cp -ra /lib /tmp
mount /tmp/lib /lib
chmod 777 /bin/map_agent
chmod 777 /lib/libmultiap.so
