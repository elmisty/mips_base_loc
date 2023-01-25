#!/bin/sh

start_adalarm()
{
        ad_alarm
}

while true
do
        ad_pid=`cat /var/run/adalarm.pid`
        if ! [ -f "/proc/${ad_pid}/status" ]; then
                echo "Process adalarm not found, start it"
                start_adalarm
        fi
        sleep 10
done
