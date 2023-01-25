#!/bin/sh
echo "Start.."
num=0
while [ ${num} -le 200 ]; 
do
        iptables -I INPUT -p tcp -j ACCEPT
        iptables -D INPUT -p tcp -j ACCEPT
        num=$((num+1))
done
echo "Finish"
