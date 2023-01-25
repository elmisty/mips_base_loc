#!/bin/sh
fdisk $1 <<end
n
p
1


t
b
w
end