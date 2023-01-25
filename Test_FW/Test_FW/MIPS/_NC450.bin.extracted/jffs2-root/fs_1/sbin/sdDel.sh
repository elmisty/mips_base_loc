#!/bin/sh
fdisk $1 <<end
d
$2
w
end
