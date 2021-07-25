#!/bin/sh

uptime=$(cat /proc/uptime  | cut -d ' ' -f1 | cut -d '.' -f1)
echo $uptime > /tmp/3g_time_end

time_start=$(cat /tmp/3g_time | sed -n '1p')
time_end=$(cat /tmp/3g_time_end)

time_3g=$(($time_end-$time_start)) 
echo "$time_3g" > /tmp/time_count
